import fs from 'fs';
import pdfParse from 'pdf-parse';

async function parsePDF() {
    console.log('Reading PDF...');
    const dataBuffer = fs.readFileSync('C:\\Users\\ALIEN\\Desktop\\Cannabis Analysis - Valenveras.pdf');
    const data = await pdfParse(dataBuffer);

    console.log("--------------- TEXT EXTRACTED ---------------");
    console.log(data.text);
    console.log("----------------------------------------------");

    fs.writeFileSync('nanamichi_analysis.txt', data.text);
    console.log('Saved to nanamichi_analysis.txt');
}

parsePDF().catch(err => {
    console.error('Error:', err);
});
