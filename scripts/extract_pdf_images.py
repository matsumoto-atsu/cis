#!/usr/bin/env python3
import json
import re
import shutil
import struct
import subprocess
import tempfile
import zlib
from pathlib import Path
from typing import Dict, List, Optional, Tuple

WHITESPACE = b" \t\r\n\x0c\x0b"


def _skip_ws(data: bytes, pos: int) -> int:
    while pos < len(data) and data[pos] in WHITESPACE:
        pos += 1
    return pos


def _read_braces(data: bytes, pos: int, open_bytes: bytes, close_bytes: bytes) -> Tuple[bytes, int]:
    depth = 0
    start = pos
    i = pos
    step_open = len(open_bytes)
    step_close = len(close_bytes)
    while i < len(data):
        if data[i:i + step_open] == open_bytes:
            depth += 1
            i += step_open
            continue
        if data[i:i + step_close] == close_bytes:
            depth -= 1
            i += step_close
            if depth == 0:
                return data[start:i], i
            continue
        i += 1
    raise ValueError("Unbalanced braces in dictionary parsing")


def _read_token(data: bytes, pos: int) -> Tuple[bytes, int]:
    pos = _skip_ws(data, pos)
    if pos >= len(data):
        return b"", pos
    if data[pos:pos + 2] == b"<<":
        return _read_braces(data, pos, b"<<", b">>")
    if data[pos:pos + 1] == b"[":
        return _read_braces(data, pos, b"[", b"]")
    start = pos
    while pos < len(data) and data[pos] not in b" \t\r\n<>[]()":
        pos += 1
    return data[start:pos], pos


def _read_value_token(data: bytes, pos: int) -> Tuple[bytes, int]:
    token, new_pos = _read_token(data, pos)
    token = token.strip()
    if re.fullmatch(rb"\d+", token):
        pos2 = _skip_ws(data, new_pos)
        if pos2 < len(data):
            gen_token, pos3 = _read_token(data, pos2)
            gen_clean = gen_token.strip()
            if re.fullmatch(rb"\d+", gen_clean):
                pos4 = _skip_ws(data, pos3)
                if pos4 < len(data) and data[pos4:pos4 + 1] == b"R":
                    token = token + b" " + gen_clean + b" R"
                    new_pos = pos4 + 1
                else:
                    new_pos = pos3
            else:
                new_pos = pos3
    return token, new_pos


def _parse_reference(token: bytes) -> Optional[int]:
    token = token.strip()
    match = re.fullmatch(rb"(\d+)\s+(\d+)\s+R", token)
    if not match:
        return None
    return int(match.group(1))


def _parse_filters(token: Optional[bytes]) -> List[str]:
    if not token:
        return []
    token = token.strip()
    if token.startswith(b"["):
        return [name.decode("ascii", "ignore") for name in re.findall(rb"/([A-Za-z0-9]+)", token)]
    if token.startswith(b"/"):
        return [token[1:].decode("ascii", "ignore")]
    return []


def _parse_dict(raw: bytes) -> Dict[str, bytes]:
    raw = raw.strip()
    if not raw.startswith(b"<<") or not raw.endswith(b">>"):
        return {}
    pos = 2
    result: Dict[str, bytes] = {}
    while pos < len(raw) - 2:
        pos = _skip_ws(raw, pos)
        if pos >= len(raw) - 2:
            break
        if raw[pos:pos + 2] == b">>":
            break
        if raw[pos:pos + 1] != b"/":
            break
        key_start = pos + 1
        pos = key_start
        while pos < len(raw) and raw[pos] not in b" \t\r\n<>/[]()":
            pos += 1
        key = raw[key_start:pos].decode("ascii", "ignore")
        value, pos = _read_value_token(raw, pos)
        result[key] = value.strip()
    return result


def _decode_flate(stream: bytes, decode_parms: Optional[Dict[str, bytes]], width: int, components: int, bits_per_component: int) -> bytes:
    data = zlib.decompress(stream)
    if not decode_parms:
        return data
    predictor = int(decode_parms.get("Predictor", b"1").decode("ascii", "ignore"))
    if predictor <= 1:
        return data
    if 10 <= predictor <= 15:
        colors = int(decode_parms.get("Colors", str(components).encode()))
        columns = int(decode_parms.get("Columns", str(width).encode()))
        bits = int(decode_parms.get("BitsPerComponent", str(bits_per_component).encode()))
        if bits != 8:
            raise NotImplementedError("Only 8-bit predictors are supported")
        row_length = colors * columns
        result = bytearray()
        offset = 0
        prev_row = bytearray(row_length)
        while offset < len(data):
            if offset + 1 + row_length > len(data):
                break
            filter_type = data[offset]
            offset += 1
            row = bytearray(data[offset:offset + row_length])
            offset += row_length
            if filter_type == 0:
                pass
            elif filter_type == 1:
                for i in range(row_length):
                    left = row[i - colors] if i >= colors else 0
                    row[i] = (row[i] + left) & 0xFF
            elif filter_type == 2:
                for i in range(row_length):
                    row[i] = (row[i] + prev_row[i]) & 0xFF
            elif filter_type == 3:
                for i in range(row_length):
                    left = row[i - colors] if i >= colors else 0
                    up = prev_row[i]
                    row[i] = (row[i] + ((left + up) // 2)) & 0xFF
            elif filter_type == 4:
                for i in range(row_length):
                    left = row[i - colors] if i >= colors else 0
                    up = prev_row[i]
                    up_left = prev_row[i - colors] if i >= colors else 0
                    p = left + up - up_left
                    pa = abs(p - left)
                    pb = abs(p - up)
                    pc = abs(p - up_left)
                    if pa <= pb and pa <= pc:
                        predictor_val = left
                    elif pb <= pc:
                        predictor_val = up
                    else:
                        predictor_val = up_left
                    row[i] = (row[i] + predictor_val) & 0xFF
            else:
                raise NotImplementedError(f"Unsupported PNG predictor {filter_type}")
            result.extend(row)
            prev_row = row
        return bytes(result)
    raise NotImplementedError(f"Predictor {predictor} is not supported")


def _write_png(path: Path, width: int, height: int, data: bytes, components: int, mask: Optional[bytes]) -> None:
    if components not in (1, 3):
        raise NotImplementedError("Only grayscale and RGB images are supported")
    if mask is not None and len(mask) != width * height:
        raise ValueError("Mask size does not match image dimensions")
    if components == 1:
        if mask is None:
            color_type = 0
            bytes_per_pixel = 1
            payload = data
        else:
            color_type = 4
            bytes_per_pixel = 2
            payload = bytearray(width * height * 2)
            for i in range(width * height):
                payload[2 * i] = data[i]
                payload[2 * i + 1] = mask[i]
            payload = bytes(payload)
    else:
        if mask is None:
            color_type = 2
            bytes_per_pixel = 3
            payload = data
        else:
            color_type = 6
            bytes_per_pixel = 4
            payload = bytearray(width * height * 4)
            for i in range(width * height):
                base_index = 3 * i
                target = 4 * i
                payload[target] = data[base_index]
                payload[target + 1] = data[base_index + 1]
                payload[target + 2] = data[base_index + 2]
                payload[target + 3] = mask[i]
            payload = bytes(payload)
    rows = bytearray()
    stride = width * bytes_per_pixel
    for y in range(height):
        rows.append(0)
        start = y * stride
        rows.extend(payload[start:start + stride])
    compressed = zlib.compress(bytes(rows))

    def build_chunk(chunk_type: bytes, chunk_data: bytes) -> bytes:
        return (struct.pack("!I", len(chunk_data)) + chunk_type + chunk_data +
                struct.pack("!I", zlib.crc32(chunk_type + chunk_data) & 0xFFFFFFFF))

    png = bytearray()
    png.extend(b"\x89PNG\r\n\x1a\n")
    png.extend(build_chunk(b"IHDR", struct.pack("!IIBBBBB", width, height, 8, color_type, 0, 0, 0)))
    png.extend(build_chunk(b"IDAT", compressed))
    png.extend(build_chunk(b"IEND", b""))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(bytes(png))


def _to_windows_path(path: Path) -> str:
    path_str = str(path)
    if path_str.startswith('/mnt/') and len(path_str) > 7:
        drive = path_str[5]
        rest = path_str[7:]
        return f"{drive.upper()}:\\{rest.replace('/', '\\')}"
    return path_str


class PDFImageExtractor:
    def __init__(self, pdf_path: Path):
        self.pdf_path = pdf_path
        self.data = pdf_path.read_bytes()
        self.objects: Dict[int, Dict[str, object]] = {}
        self._parse_objects()

    def _parse_objects(self) -> None:
        for match in re.finditer(rb"(\d+)\s+(\d+)\s+obj", self.data):
            obj_num = int(match.group(1))
            start = match.end()
            end = self.data.find(b"endobj", start)
            if end == -1:
                continue
            content = self.data[start:end]
            stream = None
            dict_bytes = content
            stream_pos = content.find(b"stream")
            if stream_pos != -1:
                dict_bytes = content[:stream_pos]
                stream_start = stream_pos + len(b"stream")
                if content[stream_start:stream_start + 2] == b"\r\n":
                    stream_start += 2
                elif content[stream_start:stream_start + 1] == b"\n":
                    stream_start += 1
                stream_end = content.find(b"endstream", stream_start)
                if stream_end == -1:
                    stream_data = content[stream_start:]
                else:
                    stream_data = content[stream_start:stream_end]
                stream = stream_data
            dict_bytes = dict_bytes.strip()
            self.objects[obj_num] = {
                "dict": dict_bytes,
                "stream": stream,
            }

    def _find_entry(self, dict_bytes: bytes, key: bytes) -> Optional[bytes]:
        idx = dict_bytes.find(key)
        if idx == -1:
            return None
        pos = idx + len(key)
        token, _ = _read_value_token(dict_bytes, pos)
        return token.strip()

    def _resolve_dict(self, token: Optional[bytes]) -> Optional[bytes]:
        if token is None:
            return None
        token = token.strip()
        if token.startswith(b"<<"):
            return token
        ref = _parse_reference(token)
        if ref is None:
            return None
        obj = self.objects.get(ref)
        if not obj:
            return None
        return obj["dict"]

    def _resolve_stream(self, ref: int) -> Optional[bytes]:
        obj = self.objects.get(ref)
        if not obj:
            return None
        return obj.get("stream")

    def get_page_objects(self) -> List[int]:
        pages = [num for num, obj in self.objects.items() if b"/Type /Page" in obj["dict"]]
        return sorted(pages)

    def _get_xobject_map(self, page_dict: bytes) -> Dict[str, int]:
        resources = self._resolve_dict(self._find_entry(page_dict, b"/Resources"))
        if not resources:
            return {}
        xobject_token = self._resolve_dict(self._find_entry(resources, b"/XObject"))
        if not xobject_token:
            return {}
        result: Dict[str, int] = {}
        pos = 2
        while pos < len(xobject_token) - 2:
            pos = _skip_ws(xobject_token, pos)
            if pos >= len(xobject_token) - 2 or xobject_token[pos:pos + 2] == b">>":
                break
            if xobject_token[pos:pos + 1] != b"/":
                break
            name_start = pos + 1
            pos = name_start
            while pos < len(xobject_token) and xobject_token[pos] not in b" \t\r\n<>/[]()":
                pos += 1
            name = xobject_token[name_start:pos].decode("ascii", "ignore")
            token, pos = _read_value_token(xobject_token, pos)
            ref = _parse_reference(token)
            if ref is not None:
                result[name] = ref
        return result

    def _get_page_contents(self, page_dict: bytes) -> bytes:
        contents_token = self._find_entry(page_dict, b"/Contents")
        if contents_token is None:
            return b""
        streams: List[bytes] = []
        token = contents_token.strip()
        if token.startswith(b"["):
            for ref_token in re.findall(rb"(\d+\s+\d+\s+R)", token):
                ref = _parse_reference(ref_token)
                if ref is None:
                    continue
                stream_data = self._get_decoded_stream(ref)
                if stream_data is not None:
                    streams.append(stream_data)
        else:
            ref = _parse_reference(token)
            if ref is not None:
                stream_data = self._get_decoded_stream(ref)
                if stream_data is not None:
                    streams.append(stream_data)
        return b"\n".join(streams)

    def _get_decoded_stream(self, obj_num: int) -> Optional[bytes]:
        obj = self.objects.get(obj_num)
        if not obj or obj["stream"] is None:
            return None
        filters = _parse_filters(self._find_entry(obj["dict"], b"/Filter"))
        decode_parms = None
        decode_token = self._find_entry(obj["dict"], b"/DecodeParms")
        if decode_token:
            if decode_token.strip().startswith(b"<<"):
                decode_parms = _parse_dict(decode_token)
            else:
                ref = _parse_reference(decode_token)
                if ref is not None:
                    ref_obj = self.objects.get(ref)
                    if ref_obj:
                        decode_parms = _parse_dict(ref_obj["dict"])
        data = obj["stream"]
        for filt in filters:
            if filt == "FlateDecode":
                data = zlib.decompress(data)
            else:
                raise NotImplementedError(f"Stream filter {filt} not supported in content stream")
        return data

    def get_page_images(self, page_obj: int) -> List[Tuple[str, int]]:
        obj = self.objects.get(page_obj)
        if not obj:
            return []
        page_dict = obj["dict"]
        xobject_map = self._get_xobject_map(page_dict)
        content_data = self._get_page_contents(page_dict)
        names = re.findall(rb"/([A-Za-z0-9_]+)\s+Do", content_data)
        result: List[Tuple[str, int]] = []
        for name_bytes in names:
            name = name_bytes.decode("ascii", "ignore")
            ref = xobject_map.get(name)
            if ref is None:
                continue
            target = self.objects.get(ref)
            if not target or b"/Subtype /Image" not in target["dict"]:
                continue
            result.append((name, ref))
        return result

    def _infer_components(self, dict_bytes: bytes) -> int:
        color_token = self._find_entry(dict_bytes, b"/ColorSpace")
        if not color_token:
            return 3
        token = color_token.strip()
        if token.startswith(b"/DeviceGray"):
            return 1
        if token.startswith(b"/DeviceRGB"):
            return 3
        if token.startswith(b"/DeviceCMYK"):
            return 4
        ref = _parse_reference(token)
        if ref is not None:
            obj = self.objects.get(ref)
            if obj:
                raw = obj["dict"].strip()
                if raw.startswith(b"["):
                    inner = raw[1:-1].strip()
                    if inner.startswith(b"/ICCBased"):
                        parts = inner.split()
                        if len(parts) >= 2:
                            icc_ref = _parse_reference(parts[1])
                            if icc_ref is not None:
                                icc_obj = self.objects.get(icc_ref)
                                if icc_obj:
                                    icc_dict = _parse_dict(icc_obj["dict"])
                                    n_val = icc_dict.get("N")
                                    if n_val:
                                        return int(n_val)
                else:
                    parsed = _parse_dict(raw)
                    n_val = parsed.get("N")
                    if n_val:
                        return int(n_val)
        return 3

    def extract_image(self, image_obj_num: int, output_path: Path) -> None:
        obj = self.objects.get(image_obj_num)
        if not obj or obj["stream"] is None:
            return
        dict_bytes = obj["dict"]
        width_token = self._find_entry(dict_bytes, b"/Width")
        height_token = self._find_entry(dict_bytes, b"/Height")
        bpc_token = self._find_entry(dict_bytes, b"/BitsPerComponent")
        if not (width_token and height_token and bpc_token):
            return
        width = int(width_token)
        height = int(height_token)
        bits_per_component = int(bpc_token)
        filters = _parse_filters(self._find_entry(dict_bytes, b"/Filter"))
        decode_parms = None
        decode_token = self._find_entry(dict_bytes, b"/DecodeParms")
        if decode_token:
            if decode_token.strip().startswith(b"<<"):
                decode_parms = _parse_dict(decode_token)
            else:
                ref = _parse_reference(decode_token)
                if ref is not None:
                    ref_obj = self.objects.get(ref)
                    if ref_obj:
                        decode_parms = _parse_dict(ref_obj["dict"])
        smask_ref = _parse_reference(self._find_entry(dict_bytes, b"/SMask") or b"")
        mask_ref = _parse_reference(self._find_entry(dict_bytes, b"/Mask") or b"")
        mask_payload: Optional[Tuple[bytes, int, int]] = None
        if smask_ref:
            mask_payload = self._extract_mask_data(smask_ref)
        elif mask_ref:
            mask_payload = self._extract_mask_data(mask_ref)
        if filters == ["DCTDecode"]:
            with tempfile.TemporaryDirectory(dir=str(output_path.parent)) as tmpdir:
                tmp_dir = Path(tmpdir)
                jpg_path = tmp_dir / "base.jpg"
                jpg_path.write_bytes(obj["stream"])
                mask_file: Optional[Path] = None
                if mask_payload is not None:
                    mask_data, mask_width, mask_height = mask_payload
                    if mask_width != width or mask_height != height:
                        raise ValueError("Mask dimensions do not match base image dimensions")
                    mask_file = tmp_dir / "mask.png"
                    _write_png(mask_file, mask_width, mask_height, mask_data, 1, None)
                output_path.parent.mkdir(parents=True, exist_ok=True)
                self._convert_via_powershell(jpg_path, output_path, mask_file)
        elif filters == ["FlateDecode"]:
            components = self._infer_components(dict_bytes)
            decoded = _decode_flate(obj["stream"], decode_parms, width, components, bits_per_component)
            mask_bytes = None
            if mask_payload is not None:
                mask_data, mask_width, mask_height = mask_payload
                if mask_width != width or mask_height != height:
                    raise ValueError("Mask dimensions do not match base image dimensions")
                mask_bytes = mask_data
            output_path.parent.mkdir(parents=True, exist_ok=True)
            _write_png(output_path, width, height, decoded, components, mask_bytes)
        else:
            raise NotImplementedError(f"Image filter {filters} is not supported")

    def _extract_mask_data(self, mask_ref: int) -> Optional[Tuple[bytes, int, int]]:
        mask_obj = self.objects.get(mask_ref)
        if not mask_obj or mask_obj["stream"] is None:
            return None
        mask_dict = mask_obj["dict"]
        width_token = self._find_entry(mask_dict, b"/Width")
        height_token = self._find_entry(mask_dict, b"/Height")
        bpc_token = self._find_entry(mask_dict, b"/BitsPerComponent")
        if not (width_token and height_token and bpc_token):
            return None
        width = int(width_token)
        height = int(height_token)
        bits_per_component = int(bpc_token)
        filters = _parse_filters(self._find_entry(mask_dict, b"/Filter"))
        decode_parms = None
        decode_token = self._find_entry(mask_dict, b"/DecodeParms")
        if decode_token:
            if decode_token.strip().startswith(b"<<"):
                decode_parms = _parse_dict(decode_token)
            else:
                ref = _parse_reference(decode_token)
                if ref is not None:
                    ref_obj = self.objects.get(ref)
                    if ref_obj:
                        decode_parms = _parse_dict(ref_obj["dict"])
        data = mask_obj["stream"]
        if filters == ["FlateDecode"]:
            decoded = _decode_flate(data, decode_parms, width, 1, bits_per_component)
            return decoded, width, height
        if filters == ["DCTDecode"]:
            with tempfile.TemporaryDirectory(dir=str(self.pdf_path.parent)) as tmpdir:
                tmp_dir = Path(tmpdir)
                jpg_path = tmp_dir / "mask.jpg"
                jpg_path.write_bytes(data)
                png_path = tmp_dir / "mask.png"
                self._convert_via_powershell(jpg_path, png_path, None)
                mask_png = png_path.read_bytes()
                return mask_png, width, height
        raise NotImplementedError(f"Mask filter {filters} is not supported")

    def _convert_via_powershell(self, input_path: Path, output_path: Path, mask_path: Optional[Path]) -> None:
        def _escape(value: str) -> str:
            return value.replace("'", "''")

        input_win = _to_windows_path(input_path)
        output_win = _to_windows_path(output_path)
        mask_win = _to_windows_path(mask_path) if mask_path else ""
        script_template = """
Add-Type -AssemblyName System.Drawing
$inputPath = '{input_path}'
$outputPath = '{output_path}'
$maskPath = '{mask_path}'
$img = [System.Drawing.Bitmap]::FromFile($inputPath)
try {{
    if ($maskPath -ne '') {{
        $mask = [System.Drawing.Bitmap]::FromFile($maskPath)
        try {{
            if ($mask.Width -ne $img.Width -or $mask.Height -ne $img.Height) {{
                throw 'Mask dimensions do not match image dimensions.'
            }}
            if ($img.PixelFormat -ne [System.Drawing.Imaging.PixelFormat]::Format32bppArgb) {{
                $tmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
                $g = [System.Drawing.Graphics]::FromImage($tmp)
                $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
                $g.Dispose()
                $img.Dispose()
                $img = $tmp
            }}
            for ($y = 0; $y -lt $img.Height; $y++) {{
                for ($x = 0; $x -lt $img.Width; $x++) {{
                    $pixel = $img.GetPixel($x, $y)
                    $alpha = $mask.GetPixel($x, $y).R
                    $img.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B))
                }}
            }}
        }}
        finally {{
            $mask.Dispose()
        }}
    }}
    $img.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}}
finally {{
    $img.Dispose()
}}
"""
        script = script_template.format(
            input_path=_escape(input_win),
            output_path=_escape(output_win),
            mask_path=_escape(mask_win),
        )
        args = [
            "powershell.exe",
            "-NoLogo",
            "-NoProfile",
            "-Command",
            script,
        ]
        subprocess.run(args, check=True)


def extract_all_blocks(pdf_prefix: str = "block", questions_path: Path = Path("public/data/questions.json")) -> None:
    base_dir = Path.cwd()
    images_root = base_dir / "public" / "data" / "images"
    questions_data = json.loads(questions_path.read_text(encoding="utf-8"))
    questions_by_block: Dict[int, List[dict]] = {}
    for entry in questions_data:
        block = int(entry.get("block"))
        questions_by_block.setdefault(block, []).append(entry)

    images_root.mkdir(parents=True, exist_ok=True)

    for pdf_path in sorted(base_dir.glob(f"{pdf_prefix}*.pdf")):
        extractor = PDFImageExtractor(pdf_path)
        block_name = pdf_path.stem
        try:
            block_number = int(block_name.replace("block", ""))
        except ValueError:
            raise ValueError(f"Cannot determine block number from {block_name}")

        block_questions = sorted(questions_by_block.get(block_number, []), key=lambda q: q["number"])
        questions_with_images = [q for q in block_questions if q.get("images")]

        page_image_groups: List[Tuple[int, List[Tuple[str, int]]]] = []
        for page_index, page_obj in enumerate(extractor.get_page_objects(), start=1):
            images = extractor.get_page_images(page_obj)
            if images:
                page_image_groups.append((page_index, images))

        if len(page_image_groups) != len(questions_with_images):
            raise ValueError(
                f"Image count mismatch in {pdf_path}: PDF has {len(page_image_groups)} pages with images, "
                f"but questions.json lists {len(questions_with_images)} questions with images."
            )

        block_dir = images_root / block_name
        if block_dir.exists():
            shutil.rmtree(block_dir)
        block_dir.mkdir(parents=True, exist_ok=True)

        page_iter = iter(page_image_groups)
        page_iter = iter(page_image_groups)
        for q in block_questions:
            if not q.get("images"):
                continue
            try:
                page_index, image_refs = next(page_iter)
            except StopIteration:
                raise ValueError("Ran out of extracted images before assigning all questions")

            new_paths: List[str] = []
            for image_idx, (_, image_obj) in enumerate(image_refs, start=1):
                filename = f"q{q['number']}_{image_idx}.png"
                target = block_dir / filename
                extractor.extract_image(image_obj, target)
                new_paths.append(f"/data/images/{block_name}/{filename}")
            q["images"] = new_paths
        print(f"Extracted images for {pdf_path} -> {block_dir}")

    questions_path.write_text(json.dumps(questions_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    extract_all_blocks()
