# 把 page.pdf 产出里的大幅背景图重采样为 JPEG，压小 PDF 体积。
# 用法：python scripts/compress-pdf.py（默认处理 dist/mcc-gwb-group-meeting.pdf，原地替换）
# 只动 >1MB 的图片；校徽（带透明通道）与波形截图保持原样。
import fitz, io, sys
from pathlib import Path
from PIL import Image

pdf = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / 'dist' / 'mcc-gwb-group-meeting.pdf'
tmp = pdf.with_suffix('.small.pdf')
doc = fitz.open(pdf)
seen = set()
for page in doc:
    for info in page.get_images(full=True):
        xref = info[0]
        if xref in seen:
            continue
        seen.add(xref)
        img = doc.extract_image(xref)
        if not img or len(img['image']) < 1_000_000:
            continue
        p = Image.open(io.BytesIO(img['image']))
        w, h = p.size
        if w > 1600:
            p = p.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
        p = p.convert('RGB')
        buf = io.BytesIO()
        p.save(buf, format='JPEG', quality=82, optimize=True)
        print(f'replace xref {xref}: {len(img["image"])//1024} KB -> {len(buf.getvalue())//1024} KB ({w}x{h})')
        page.replace_image(xref, stream=buf.getvalue())
doc.save(tmp, garbage=4, deflate=True)
assert doc.page_count == 17, doc.page_count
tmp.replace(pdf)
print(f'OK {doc.page_count} pages, {pdf.stat().st_size//1024} KB')
