const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const DATA_DIR = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.resolve(__dirname, '../public/data/questions.json');
const YEAR = 2023;
const BLOCK_COUNT = 8;
const DIGITS_FW = '０１２３４５６７８９';
const CHOICES_PER_QUESTION = 5;
const Y_THRESHOLD = 2.5;
const X_GAP_THRESHOLD = 1.5;
const IMAGE_KEYWORDS = /(画像|写真|図|X線|エックス線|CT|MRI|超音波|エコー|内視鏡|病理組織|顕微鏡|造影)/;

function fwToAscii(text) {
  return text.replace(/[０-９]/g, ch => String(DIGITS_FW.indexOf(ch)))
    .replace(/[．｡。・]/g, '.')
    .replace(/[％]/g, '%')
    .replace(/[，]/g, ',')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/－/g, '-');
}

function normalize(text) {
  return fwToAscii(text)
    .replace(/[\r\f]+/g, '\n')
    .replace(/[\u3000\t]+/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{2,}/g, '\n\n')
    .trim();
}

async function extractText(buffer) {
  const options = {
    pagerender: async pageData => {
      const textContent = await pageData.getTextContent({ disableCombineTextItems: false });
      const items = textContent.items
        .map(item => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width || item.transform[0] || 0
        }))
        .filter(item => item.text && item.text.trim().length > 0);

      items.sort((a, b) => {
        if (Math.abs(a.y - b.y) > Y_THRESHOLD) {
          return b.y - a.y;
        }
        return a.x - b.x;
      });

      const lines = [];
      let currentLine = null;

      for (const item of items) {
        if (!currentLine || Math.abs(item.y - currentLine.y) > Y_THRESHOLD) {
          currentLine = { y: item.y, items: [item] };
          lines.push(currentLine);
        } else {
          currentLine.items.push(item);
        }
      }

      const lineTexts = lines.map(line => {
        const sorted = line.items.sort((a, b) => a.x - b.x);
        let result = '';
        for (let i = 0; i < sorted.length; i += 1) {
          const cur = sorted[i];
          const text = cur.text.trim();
          if (!text) continue;
          if (result.length === 0) result = text;
          else {
            const prev = sorted[i - 1];
            const gap = cur.x - (prev.x + prev.width);
            result += gap > X_GAP_THRESHOLD ? ' ' + text : text;
          }
        }
        return result;
      });

      return lineTexts.join('\n');
    }
  };

  const parsed = await pdf(buffer, options);
  return parsed.text;
}

async function parseAnswers() {
  const buf = fs.readFileSync(path.join(DATA_DIR, 'answer.pdf'));
  const text = await extractText(buf);
  const normalized = normalize(text)
    .replace(/第\s+/g, '第')
    .replace(/問\s+/g, '問');

  const blocks = {};
  const blockRegex = /令和5年度臨床統合試験(?:\(|（)第([0-9]+)ブロック(?:\)|）)本試験([\s\S]*?)(?=令和5年度臨床統合試験|$)/g;

  let match;
  while ((match = blockRegex.exec(normalized))) {
    const blockNum = Number(match[1]);
    const body = match[2];
    const map = new Map();
    const qaRegex = /第([0-9]{1,3})問([^第]+)/g;
    let qa;
    while ((qa = qaRegex.exec(body))) {
      const qNum = Number(qa[1]);
      const digits = [];
      const seen = new Set();
      const found = qa[2].match(/[1-5]/g) || [];
      for (const d of found) {
        if (!seen.has(d)) {
          digits.push(Number(d));
          seen.add(d);
        }
      }
      if (digits.length === 0) {
        console.warn('No answers parsed for block ' + blockNum + ', question ' + qNum);
        continue;
      }
      map.set(qNum, digits);
    }
    blocks[blockNum] = map;
  }
  return blocks;
}

function cleanupSection(section) {
  return section
    .replace(/^臨床統合試験問題\s*/gm, '')
    .replace(/^- ?[0-9]+ -$/gm, '')
    .replace(/^- ?[0-9]+$/gm, '')
    .replace(/マークカード記入上の注意[\s\S]*/g, '')
    .replace(/5191105[\s\S]*/g, '')
    .replace(/\n{2,}/g, '\n\n')
    .trim();
}

function parseChoices(section) {
  const lines = section.split('\n');
  const stemLines = [];
  const choiceBlocks = [];
  const pattern = /^\s*([1-5])[\.\)]\s*(.*)$/;
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (current) current.text.push('');
      else stemLines.push('');
      continue;
    }

    const match = line.match(pattern);
    if (match) {
      if (current) choiceBlocks.push(current);
      current = { label: Number(match[1]), text: [] };
      if (match[2]) current.text.push(match[2]);
    } else if (current) {
      current.text.push(line);
    } else {
      stemLines.push(line);
    }
  }
  if (current) choiceBlocks.push(current);

  if (choiceBlocks.length < CHOICES_PER_QUESTION) {
    throw new Error('Expected at least ' + CHOICES_PER_QUESTION + ' choices, got ' + choiceBlocks.length + '\n' + section);
  }

  if (choiceBlocks.length > CHOICES_PER_QUESTION) {
    choiceBlocks.length = CHOICES_PER_QUESTION;
  }

  const choices = choiceBlocks.map(block => block.text.join(' ').replace(/\s+/g, ' ').trim());
  const stem = stemLines.join('\n').replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();

  return { stem, choices };
}

function inferImages(stem, block, number) {
  if (!IMAGE_KEYWORDS.test(stem)) return [];
  if (!/[示図像写呈]/.test(stem)) return [];

  let count = 1;
  const sameLine = stem.replace(/\n/g, ' ');
  if (/A\s*[と,、]\s*B/.test(sameLine)) count = Math.max(count, 2);
  if (/A\s*[と,、]\s*B\s*[と,、]\s*C/.test(sameLine)) count = Math.max(count, 3);
  if (/A\s*(?:から|〜|~)\s*D|A\s*[と,、]\s*B\s*[と,、]\s*C\s*[と,、]\s*D/.test(sameLine)) count = Math.max(count, 4);

  const labelPattern = /(像|写真|図|標本|画像)\s*([A-D])/g;
  const labels = new Set();
  let lm;
  while ((lm = labelPattern.exec(sameLine))) {
    labels.add(lm[2]);
  }
  if (labels.size) {
    count = Math.max(count, labels.size);
  }

  return Array.from({ length: count }, (_, idx) => `/data/images/block${block}/q${number}_${idx + 1}.png`);
}

async function parseBlock(blockNum, answers) {
  const filePath = path.join(DATA_DIR, 'block' + blockNum + '.pdf');
  const buf = fs.readFileSync(filePath);
  const text = await extractText(buf);
  const normalized = normalize(text);

  const questionRegex = /第\s*([0-9]+)\s*問/g;
  const positions = [];
  let match;
  while ((match = questionRegex.exec(normalized))) {
    positions.push({ number: Number(match[1]), index: match.index });
  }

  const items = [];
  for (let i = 0; i < positions.length; i += 1) {
    const current = positions[i];
    const next = positions[i + 1];
    const rawSection = normalized.slice(current.index, next ? next.index : undefined);
    const sectionBody = cleanupSection(rawSection.replace(/^第\s*[0-9]+\s*問/, ''));

    if (!sectionBody) {
      continue;
    }

    let parsed;
    try {
      parsed = parseChoices(sectionBody);
    } catch (err) {
      console.warn('Failed to parse choices for block ' + blockNum + ', question ' + current.number + ': ' + err.message);
      continue;
    }

    const answer = answers.get(current.number);
    if (!answer) {
      console.warn('Answer missing for block ' + blockNum + ', question ' + current.number);
      continue;
    }

    let type;
    if (answer.length === 1) type = 'single';
    else if (answer.length === 2) type = 'x2';
    else type = 'x3';

    items.push({
      year: YEAR,
      block: blockNum,
      number: current.number,
      type,
      stem: parsed.stem,
      choices: parsed.choices,
      answer,
      images: inferImages(parsed.stem, blockNum, current.number),
      explanation: ''
    });
  }

  return items;
}

async function main() {
  const answerMap = await parseAnswers();
  const all = [];

  for (let block = 1; block <= BLOCK_COUNT; block += 1) {
    const answers = answerMap[block];
    if (!answers) {
      console.warn('No answers found for block ' + block);
      continue;
    }
    const items = await parseBlock(block, answers);
    all.push(...items);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(all, null, 2) + '\n');
  console.log('Wrote ' + all.length + ' questions to ' + OUTPUT_PATH);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
