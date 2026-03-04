import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

const buf = readFileSync('./INVENTARIO.xlsx');
const wb = XLSX.read(buf, { type: 'buffer' });

console.log('=== HOJAS:', wb.SheetNames, '===\n');

for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    console.log(`\n========== HOJA: "${sheetName}" (${data.length} filas) ==========`);
    for (let i = 0; i < Math.min(data.length, 200); i++) {
        const row = data[i];
        if (row.some(c => c !== '')) {
            console.log(`[${i + 1}] ${JSON.stringify(row)}`);
        }
    }
}
