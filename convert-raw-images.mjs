// Descomprime imágenes FlateDecode del PDF y las convierte a PNG válido
import { inflateSync } from 'zlib';
import { createCanvas } from 'canvas';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDir = join(__dirname, 'public/products/buenfin-extract');
const outputDir = join(__dirname, 'public/products/buenfin-png');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// Imágenes de productos únicos (excluir repetidos y fondos grandes)
// Resoluciones medianas = productos. Las 1500x1480 y 2000x1714 son fondos de página.
const productImages = [
    { file: 'imagen_003.png', w: 384, h: 512 },
    { file: 'imagen_004.png', w: 480, h: 640 },
    { file: 'imagen_005.png', w: 384, h: 512 },
    { file: 'imagen_008.png', w: 480, h: 640 },
    { file: 'imagen_009.png', w: 384, h: 512 },
    { file: 'imagen_010.png', w: 384, h: 512 },
    { file: 'imagen_011.png', w: 360, h: 480 },
    { file: 'imagen_014.png', w: 480, h: 640 },
    { file: 'imagen_015.png', w: 672, h: 896 },
    { file: 'imagen_016.png', w: 640, h: 480 },
    { file: 'imagen_017.png', w: 480, h: 640 },
    { file: 'imagen_018.png', w: 672, h: 896 },
    { file: 'imagen_021.png', w: 480, h: 640 },
    { file: 'imagen_022.png', w: 576, h: 768 },
    { file: 'imagen_023.png', w: 576, h: 768 },
    { file: 'imagen_024.png', w: 576, h: 768 },
    { file: 'imagen_027.png', w: 518, h: 1120 },
    { file: 'imagen_028.png', w: 775, h: 517 },
    { file: 'imagen_031.png', w: 518, h: 1120 },
    { file: 'imagen_032.png', w: 370, h: 800 },
    { file: 'imagen_033.png', w: 370, h: 800 },
];

let ok = 0, fail = 0;

for (const { file, w, h } of productImages) {
    const inputPath = join(inputDir, file);
    if (!existsSync(inputPath)) { console.log(`⚠️  No encontrado: ${file}`); continue; }

    try {
        const compressed = readFileSync(inputPath);
        let raw;
        try {
            raw = inflateSync(compressed);
        } catch (e) {
            // Puede que no esté comprimido con zlib header, intentar sin wrapper
            try {
                const { inflateRawSync } = await import('zlib');
                raw = inflateRawSync(compressed);
            } catch (e2) {
                // Usar como está
                raw = compressed;
            }
        }

        const pixelCount = w * h;
        const expectedRGB = pixelCount * 3;
        const expectedRGBA = pixelCount * 4;
        // PDF puede tener un byte "filter row type" al inicio de cada fila para PNG predict
        // Intentar con y sin predictor PNG

        const canvas = createCanvas(w, h);
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(w, h);

        if (raw.length === expectedRGB) {
            for (let i = 0; i < pixelCount; i++) {
                imgData.data[i * 4] = raw[i * 3];
                imgData.data[i * 4 + 1] = raw[i * 3 + 1];
                imgData.data[i * 4 + 2] = raw[i * 3 + 2];
                imgData.data[i * 4 + 3] = 255;
            }
        } else if (raw.length === expectedRGBA) {
            for (let i = 0; i < pixelCount; i++) {
                imgData.data[i * 4] = raw[i * 4];
                imgData.data[i * 4 + 1] = raw[i * 4 + 1];
                imgData.data[i * 4 + 2] = raw[i * 4 + 2];
                imgData.data[i * 4 + 3] = raw[i * 4 + 3];
            }
        } else if (raw.length === h * (w * 3 + 1)) {
            // Con predictor PNG (1 byte de filtro por fila)
            let srcIdx = 0, dstIdx = 0;
            for (let row = 0; row < h; row++) {
                srcIdx++; // saltar byte de filtro
                for (let col = 0; col < w; col++) {
                    imgData.data[dstIdx * 4] = raw[srcIdx];
                    imgData.data[dstIdx * 4 + 1] = raw[srcIdx + 1];
                    imgData.data[dstIdx * 4 + 2] = raw[srcIdx + 2];
                    imgData.data[dstIdx * 4 + 3] = 255;
                    srcIdx += 3;
                    dstIdx++;
                }
            }
        } else {
            console.log(`⚠️  ${file}: tamaño raw=${raw.length}, esperado RGB=${expectedRGB} RGBA=${expectedRGBA} PNG=${h * (w * 3 + 1)}`);
            fail++;
            continue;
        }

        ctx.putImageData(imgData, 0, 0);
        const outPath = join(outputDir, file.replace('.png', '_ok.png'));
        writeFileSync(outPath, canvas.toBuffer('image/png'));
        console.log(`✅ ${file} → ${w}x${h}`);
        ok++;
    } catch (err) {
        console.log(`❌ ${file}: ${err.message}`);
        fail++;
    }
}

console.log(`\n✅ OK: ${ok} | ❌ Fail: ${fail}`);
process.exit(0);
