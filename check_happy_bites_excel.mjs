import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

const buf = readFileSync('./INVENTARIO.xlsx');
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

console.log('--- BUSCANDO "HAPPY" EN EXCEL ---');
let found = false;
for (let i = 1; i < data.length; i++) {
    const rowStr = JSON.stringify(data[i]).toLowerCase();

    if (rowStr.includes('happy') || rowStr.includes('bites')) {
        console.log(`[Fila ${i + 1}]`, data[i]);
        found = true;
    }
}

if (!found) console.log('❌ No encontrado en el Excel');
