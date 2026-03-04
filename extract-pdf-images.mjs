// Extrae imágenes embebidas del PDF BuenFin.pdf
import { PDFDocument } from 'pdf-lib';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = join(__dirname, 'public/products/buenfin-extract');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

async function extractImages() {
    console.log('Leyendo BuenFin.pdf...');
    const pdfBytes = readFileSync(join(__dirname, 'BuenFin.pdf'));
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    const pages = pdfDoc.getPages();
    console.log(`Total de páginas: ${pages.length}`);

    // Extraer imágenes del contexto interno del PDF
    const context = pdfDoc.context;
    let imageCount = 0;

    for (const [ref, obj] of context.enumerateIndirectObjects()) {
        try {
            if (obj && obj.dict) {
                const subtype = obj.dict.get(context.obj('Subtype'));
                const subtypeStr = subtype ? subtype.toString() : '';

                if (subtypeStr === '/Image') {
                    const width = obj.dict.get(context.obj('Width'));
                    const height = obj.dict.get(context.obj('Height'));
                    const filter = obj.dict.get(context.obj('Filter'));
                    const filterStr = filter ? filter.toString() : '';

                    console.log(`Imagen ${imageCount + 1}: ${width}x${height} filtro: ${filterStr}`);

                    const imageData = obj.contents;
                    if (imageData && imageData.length > 1000) { // Solo imágenes significativas
                        let ext = 'jpg';
                        if (filterStr.includes('PNG') || filterStr.includes('FlateDecode')) {
                            ext = filterStr.includes('DCT') ? 'jpg' : 'png';
                        }
                        if (filterStr.includes('DCT')) ext = 'jpg';

                        const filename = `imagen_${String(imageCount + 1).padStart(3, '0')}.${ext}`;
                        writeFileSync(join(outputDir, filename), imageData);
                        console.log(`  ✅ Guardada: ${filename} (${imageData.length} bytes)`);
                        imageCount++;
                    }
                }
            }
        } catch (e) {
            // Ignorar objetos no compatibles
        }
    }

    if (imageCount === 0) {
        // Intentar método alternativo con raw objects
        console.log('\nIntentando método alternativo...');
        for (const [ref, obj] of context.enumerateIndirectObjects()) {
            try {
                const raw = obj.toString();
                if (raw && raw.length > 500) {
                    console.log(`Objeto ref ${ref}: tipo ${obj.constructor.name}, longitud ${raw.length}`);
                }
            } catch (e) { }
        }
    }

    console.log(`\nTotal imágenes extraídas: ${imageCount}`);
    console.log(`Guardadas en: ${outputDir}`);
    process.exit(0);
}

extractImages().catch(err => { console.error(err); process.exit(1); });
