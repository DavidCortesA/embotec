#!/usr/bin/env python3
"""
Rehace `public/og/opengraph-image.jpg`.

Toma el arte original de `assets/og/opengraph-image-original.png` y le monta
encima una franja con una cuadrícula de 5 x 2 de logos de marca: nueve marcas y
una elipsis en el último hueco, para dar a entender que la lista sigue.

Se ejecuta a mano cuando cambian las marcas o el arte:

    python3 assets/og/build-opengraph-image.py

Depende de ffmpeg (decodificar, recortar, escalar y guardar el JPEG); el
compuesto se hace aquí sobre los píxeles en crudo, que es más predecible que
encadenar filtros.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / 'assets/og/opengraph-image-original.png'
LOGOS = REPO / 'public/assets/logos/brands'
OUT = REPO / 'public/og/opengraph-image.jpg'

# Nueve marcas conocidas, en el orden en que se leen: primero la fila de
# arriba. El décimo hueco es la elipsis.
TILES = [
    'weg',
    'grundfos',
    'goulds-pumps',
    'ksb',
    'sulzer',
    'eaton',
    'parker',
    'goodyear',
    'us-motors',
    None,
]

# Geometría, en píxeles del arte original (1536 x 1024).
CANVAS_W, CANVAS_H = 1536, 1024
# El engrane del logotipo EMBOTEC empieza en y=121 del arte original, así que
# la franja no puede pasar de ahí: si crece, le corta los dientes de arriba.
BAND_H = 112
RULE_H = 3
PAD_X = 118
PAD_TOP = 8
COLS, ROWS = 5, 2

ORANGE = (240, 124, 34)  # naranja de la marca, muestreado del logotipo
NAVY = (27, 58, 107)

GRID_W = CANVAS_W - 2 * PAD_X
CELL_W = GRID_W // COLS
CELL_H = (BAND_H - RULE_H - 2 * PAD_TOP) // ROWS
BOX_W = CELL_W - 70
BOX_H = CELL_H - 12

# Ajustar el logo a su recuadro deja los logotipos de palabra (SULZER,
# GOODYEAR) enormes al lado de los compactos (WEG, KSB), que topan de alto.
# Este es el objetivo de píxeles con tinta por logo: los que se pasan se
# encogen hasta acercarse, y así todos pesan parecido en la franja.
TARGET_INK = 1500

# Salida final. El arte se diseñó a 3:2, así que se mantiene.
OUT_W, OUT_H = 1200, 800


def run(args: list[str], stdin: bytes | None = None) -> bytes:
    result = subprocess.run(
        args, input=stdin, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    if result.returncode != 0:
        sys.exit(f'{" ".join(args[:6])}… falló:\n{result.stderr.decode()}')
    return result.stdout


def decode(path_or_args: list[str], pix_fmt: str) -> bytes:
    return run(
        ['ffmpeg', '-v', 'error', *path_or_args, '-pix_fmt', pix_fmt,
         '-f', 'rawvideo', '-']
    )


def content_box(
    rgba: bytes, width: int, height: int
) -> tuple[int, int, int, int, int]:
    """Recuadro que encierra lo que no es blanco, y cuántos píxeles pintan."""
    left, top, right, bottom, ink = width, height, -1, -1, 0
    for y in range(height):
        row = y * width * 4
        for x in range(width):
            i = row + x * 4
            r, g, b, a = rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]
            if a < 24:
                continue
            # Mezcla sobre blanco antes de decidir: un píxel semitransparente
            # oscuro sí es contenido.
            k = a / 255
            if min(r * k + 255 * (1 - k), g * k + 255 * (1 - k),
                   b * k + 255 * (1 - k)) > 236:
                continue
            left, right = min(left, x), max(right, x)
            top, bottom = min(top, y), max(bottom, y)
            ink += 1
    if right < 0:
        return 0, 0, width, height, width * height
    return left, top, right - left + 1, bottom - top + 1, ink


def scaled_logo(name: str) -> tuple[bytes, int, int]:
    """Logo recortado a su contenido y escalado para caber en la celda."""
    path = LOGOS / f'{name}.png'
    width, height = (
        run(['ffprobe', '-v', 'error', '-select_streams', 'v',
             '-show_entries', 'stream=width,height', '-of', 'csv=p=0',
             str(path)])
        .decode()
        .strip()
        .split(',')
    )
    width, height = int(width), int(height)
    box = content_box(decode(['-i', str(path)], 'rgba'), width, height)

    ratio = min(BOX_W / box[2], BOX_H / box[3], (TARGET_INK / box[4]) ** 0.5)
    out_w = max(1, round(box[2] * ratio))
    out_h = max(1, round(box[3] * ratio))

    data = decode(
        ['-i', str(path), '-vf',
         f'crop={box[2]}:{box[3]}:{box[0]}:{box[1]},'
         f'scale={out_w}:{out_h}:flags=lanczos'],
        'rgba',
    )
    return data, out_w, out_h


def ellipsis_tile() -> tuple[bytes, int, int]:
    """Tres puntos redondos, del mismo peso visual que los logos."""
    radius = max(3, BOX_H // 6)
    gap = radius * 3
    width, height = gap * 2 + radius * 2 + 2, radius * 2 + 2
    centers = [radius + 1 + i * gap for i in range(3)]
    tile = bytearray(width * height * 4)
    for y in range(height):
        for x in range(width):
            i = (y * width + x) * 4
            inside = any(
                (x - cx) ** 2 + (y - (radius + 1)) ** 2 <= radius * radius
                for cx in centers
            )
            tile[i:i + 4] = bytes((*NAVY, 255)) if inside else bytes(4)
    return bytes(tile), width, height


def blit(dst: bytearray, dst_w: int, src: bytes, src_w: int, src_h: int,
         at_x: int, at_y: int) -> None:
    """Pega RGBA sobre RGB, respetando el canal alfa."""
    for y in range(src_h):
        for x in range(src_w):
            s = (y * src_w + x) * 4
            alpha = src[s + 3]
            if alpha == 0:
                continue
            d = ((at_y + y) * dst_w + (at_x + x)) * 3
            if alpha == 255:
                dst[d:d + 3] = src[s:s + 3]
            else:
                k = alpha / 255
                for c in range(3):
                    dst[d + c] = round(src[s + c] * k + dst[d + c] * (1 - k))


def main() -> None:
    # Franja blanca con su regla naranja abajo.
    band = bytearray(b'\xff' * (CANVAS_W * BAND_H * 3))
    for y in range(BAND_H - RULE_H, BAND_H):
        row = y * CANVAS_W * 3
        band[row:row + CANVAS_W * 3] = bytes(ORANGE) * CANVAS_W

    for index, name in enumerate(TILES):
        data, width, height = (
            ellipsis_tile() if name is None else scaled_logo(name)
        )
        at_x = PAD_X + (index % COLS) * CELL_W + (CELL_W - width) // 2
        at_y = PAD_TOP + (index // COLS) * CELL_H + (CELL_H - height) // 2
        blit(band, CANVAS_W, data, width, height, at_x, at_y)

    # La franja tapa la parte de arriba del arte, que está vacía.
    canvas = bytearray(decode(['-i', str(SRC)], 'rgb24'))
    canvas[: len(band)] = band

    run(
        ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
         '-s', f'{CANVAS_W}x{CANVAS_H}', '-i', '-',
         '-vf', f'scale={OUT_W}:{OUT_H}:flags=lanczos',
         '-frames:v', '1', '-q:v', '3', str(OUT)],
        stdin=bytes(canvas),
    )
    print(f'Escrito {OUT.relative_to(REPO)}')


if __name__ == '__main__':
    main()
