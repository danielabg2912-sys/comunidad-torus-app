import fs from 'fs';
import PDFParser from 'pdf2json';

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const text = pdfParser.getRawTextContent();
    console.log("--------------- TEXT EXTRACTED ---------------");
    console.log(text.substring(0, 1000)); // Log the first 1000 chars
    console.log("----------------------------------------------");
    fs.writeFileSync('forbidden_apples_analysis.txt', text);
    console.log('Saved fully to forbidden_apples_analysis.txt');
    process.exit(0);
});

pdfParser.loadPDF("C:\\Users\\ALIEN\\Desktop\\Cannabis Analysis - Valenveras apple.pdf");
