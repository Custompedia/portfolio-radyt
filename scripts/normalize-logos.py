#!/usr/bin/env python3
"""Normalisasi logo klien: buang latar, samakan bobot optis, satu kanvas 2:1 transparan."""
import math
import os
from collections import deque

from PIL import Image, ImageDraw

SRC_DIR = 'assets/logo-sources'
OUT_DIR = 'public/images/logos/trusted'

# (file sumber, slug keluaran)
LOGOS = [
    ('Coat_of_arms_of_Central_Java.svg.webp', 'jawa-tengah'),
    ('Lambang_Kota_Semarang (1).webp', 'kota-semarang'),
    ('bank-jateng.webp', 'bank-jateng'),
    ('katamedia-jateng.webp', 'katamedia-jateng'),
    ('logo-gojek.webp', 'gojek'),
    ('GoTo_logo.webp', 'goto'),
    ('Logo-Tokopedia.webp', 'tokopedia'),
    ('erha.webp', 'erha'),
    ('kyra.webp', 'kyra'),
    ('doyle.webp', 'doyle'),
    ('Unika_Soegijapranata_Talenta_Propatria_et_Humaniora.webp', 'unika-soegijapranata'),
    ('sampoerna.webp', 'sampoerna'),
    ('ken-ken-indonesia.webp', 'ken-ken-indonesia'),
    ('segel.webp', 'segel'),
    ('cassanatama-naturindo.webp', 'cassanatama-naturindo'),
    ('kunkun-visual.webp', 'kunkun-visual'),
    ('mistar.webp', 'mistar'),
    ('shatara-indah-kreasi.webp', 'shatara-indah-kreasi'),
    ('ecolux.webp', 'ecolux'),
    ('gulabed.webp', 'gulabed'),
    ('handayani.webp', 'handayani'),
]

CANVAS_W, CANVAS_H = 640, 320
MAX_W = int(CANVAS_W * 0.88)
MAX_H = int(CANVAS_H * 0.84)
TARGET_AREA = 240  # rata-rata geometris konten; penyeimbang antara wordmark lebar dan lambang persegi
TOLERANCE = 26
ALPHA_FLOOR = 100


def strip_background(im):
    """Flood fill dari tepi: hanya latar yang menyatu dengan pinggir yang dihapus, bagian dalam aman."""
    px = im.load()
    w, h = im.size
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    if any(c[3] < 250 for c in corners):
        return im
    r0, g0, b0 = corners[0][:3]
    if any(abs(c[0] - r0) + abs(c[1] - g0) + abs(c[2] - b0) > 30 for c in corners):
        return im
    if not (r0 > 235 and g0 > 235 and b0 > 235):  # hanya latar putih yang dibuang, tile berwarna dipertahankan
        return im
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            q.append((x, y))
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        p = px[x, y]
        if abs(p[0] - r0) > TOLERANCE or abs(p[1] - g0) > TOLERANCE or abs(p[2] - b0) > TOLERANCE:
            continue
        seen[i] = 1
        px[x, y] = (p[0], p[1], p[2], 0)
        if x > 0:
            q.append((x - 1, y))
        if x < w - 1:
            q.append((x + 1, y))
        if y > 0:
            q.append((x, y - 1))
        if y < h - 1:
            q.append((x, y + 1))
    return im


def is_solid_tile(im):
    alpha = im.getchannel('A')
    opaque = sum(alpha.histogram()[250:])
    return opaque / (im.width * im.height) > 0.985


def round_corners(im, ratio=0.16):
    """Tile blok warna (Kata Media, Kun Kun) dibulatkan supaya sederet dengan logo lain, bukan kotak mentah."""
    radius = int(min(im.size) * ratio)
    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius, fill=255)
    out = im.copy()
    out.putalpha(Image.composite(im.getchannel('A'), Image.new('L', im.size, 0), mask))
    return out


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for src, slug in LOGOS:
        im = Image.open(os.path.join(SRC_DIR, src)).convert('RGBA')
        im.putalpha(im.getchannel('A').point(lambda a: 0 if a < ALPHA_FLOOR else a))  # checkerboard "transparan" milik file Sampoerna hidup di alpha ~65
        im = strip_background(im)
        bbox = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        im = im.crop(bbox)
        if is_solid_tile(im):
            im = round_corners(im)
        w, h = im.size
        scale = min(MAX_W / w, MAX_H / h, TARGET_AREA / math.sqrt(w * h))
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
        canvas = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
        canvas.paste(im, ((CANVAS_W - im.width) // 2, (CANVAS_H - im.height) // 2), im)
        canvas.save(os.path.join(OUT_DIR, f'{slug}.webp'), 'WEBP', quality=92, method=6)
        print(f'{slug:24s} {w}x{h} -> {im.width}x{im.height}')


if __name__ == '__main__':
    main()
