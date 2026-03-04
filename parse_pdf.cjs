const fs = require('fs');
const pdfParse = require('pdf-parse');

// Sometimes the default export is nested
const parse = typeof pdfParse === 'function' ? pdfParse : pdfParse.default;

async function parsePDF() {
    console.log('Reading PDF...');
    const dataBuffer = fs.readFileSync('C:\\Users\\ALIEN\\Desktop\\Cannabis Analysis - Valenveras.pdf');
    try {
        const data = await parse(dataBuffer);

        console.log("--------------- TEXT EXTRACTED ---------------");
        console.log(data.text);
        console.log("----------------------------------------------");

        fs.writeFileSync('nanamichi_analysis.txt', data.text);
        console.log('Saved to nanamichi_analysis.txt');
    } catch (e) {
        console.error('Error parsing PDF:', e);
    }
}

parsePDF();
