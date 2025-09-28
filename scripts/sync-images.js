const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = path.join(PROJECT_ROOT, 'text');
const DEST_ROOT = path.join(PROJECT_ROOT, 'public', 'data', 'images');
const QUESTIONS_PATH = path.join(PROJECT_ROOT, 'public', 'data', 'questions.json');
const BLOCK_COUNT = 8;
const VALID_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function resetDestRoot() {
  if (fs.existsSync(DEST_ROOT)) {
    fs.rmSync(DEST_ROOT, { recursive: true, force: true });
  }
  ensureDir(DEST_ROOT);
}

function collectAndCopyImages() {
  /** @type {Record<number, Record<number, string[]>>} */
  const blockImageNames = {};

  for (let block = 1; block <= BLOCK_COUNT; block += 1) {
    const srcDir = path.join(SRC_ROOT, `block${block}`, 'imgs');
    if (!fs.existsSync(srcDir)) {
      continue;
    }

    const destDir = path.join(DEST_ROOT, `block${block}`);
    ensureDir(destDir);

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    /** @type {Map<number, Array<{ name: string; variant: string; ext: string; srcPath: string }>>} */
    const grouped = new Map();

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!VALID_EXTENSIONS.has(ext)) continue;

      const match = entry.name.match(/^image([a-z]*)_([0-9]+)\.(jpe?g|png|webp)$/i);
      if (!match) {
        console.warn(`Skipping unmatched filename: block${block}/${entry.name}`);
        continue;
      }

      const variant = match[1] || '';
      const number = Number.parseInt(match[2], 10);
      if (!Number.isInteger(number)) {
        console.warn(`Skipping file with invalid number: block${block}/${entry.name}`);
        continue;
      }

      const files = grouped.get(number) ?? [];
      files.push({
        name: entry.name,
        variant,
        ext,
        srcPath: path.join(srcDir, entry.name),
      });
      grouped.set(number, files);
    }

    const blockMap = {};
    const sortedNumbers = Array.from(grouped.keys()).sort((a, b) => a - b);

    for (const number of sortedNumbers) {
      const items = grouped.get(number) ?? [];
      items.sort((a, b) => {
        if (a.variant === b.variant) {
          return a.name.localeCompare(b.name);
        }
        if (a.variant === '') return -1;
        if (b.variant === '') return 1;
        return a.variant.localeCompare(b.variant);
      });

      const filenames = [];
      items.forEach((item, index) => {
        const destExt = item.ext === '.jpg' ? '.jpeg' : item.ext;
        const destName = `q${number}_${index + 1}${destExt}`;
        const destPath = path.join(destDir, destName);
        fs.copyFileSync(item.srcPath, destPath);
        filenames.push(destName);
      });

      blockMap[number] = filenames;
    }

    if (Object.keys(blockMap).length > 0) {
      blockImageNames[block] = blockMap;
    }
  }

  return blockImageNames;
}

function updateQuestions(blockImageNames) {
  if (!fs.existsSync(QUESTIONS_PATH)) {
    throw new Error(`questions.json not found at ${QUESTIONS_PATH}`);
  }

  const raw = fs.readFileSync(QUESTIONS_PATH, 'utf8');
  const questions = JSON.parse(raw);

  for (const question of questions) {
    const { block, number } = question;
    const filenames = blockImageNames[block]?.[number] ?? [];
    question.images = filenames.map((name) => `/data/images/block${block}/${name}`);
  }

  const output = `${JSON.stringify(questions, null, 2)}\n`;
  fs.writeFileSync(QUESTIONS_PATH, output, 'utf8');
}

function main() {
  resetDestRoot();
  const blockImageNames = collectAndCopyImages();
  updateQuestions(blockImageNames);
}

main();
