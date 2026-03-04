import fs from 'fs';
import PDFParser from 'pdf2json';

const files = [
    { name: "SBOG", path: "C:\\Users\\ALIEN\\Desktop\\Cannabis Analysis - ValenverasSBOG.pdf", out: "sbog.txt" },
    { name: "GELATO", path: "C:\\Users\\ALIEN\\Desktop\\Cannabis Analysis - Valenveras GELATO.pdf", out: "gelato.txt" },
    { name: "SLAM", path: "C:\\Users\\ALIEN\\Desktop\\Cannabis Analysis - Valenveras SLAMMICHIGAN.pdf", out: "slam.txt" }
];

async function parseAll() {
    for (const file of files) {
        await new Promise((resolve, reject) => {
            const pdfParser = new PDFParser(this, 1);

            pdfParser.on("pdfParser_dataError", errData => {
                console.error(`Error parsing ${file.name}:`, errData.parserError);
                reject(errData.parserError);
            });

            pdfParser.on("pdfParser_dataReady", pdfData => {
                const text = pdfParser.getRawTextContent();
                fs.writeFileSync(file.out, text);
                console.log(`Saved ${file.name} to ${file.out}`);
                resolve();
            });

            pdfParser.loadPDF(file.path);
        });
    }
    console.log("All done.");
}

parseAll().catch(console.error);
