import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import * as xlsx from 'xlsx';

const firebaseConfig = {
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Check Excel file
console.log('--- BUSCANDO EN EXCEL ---');
const workbook = xlsx.readFile('INVENTARIO.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

const headers = data[0];
let foundInExcel = false;

// Search from row 1 (index 1) to ignore headers
for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const stringRow = row.map(cell => String(cell || '').toLowerCase()).join(' ');

    if (stringRow.includes('happy') || stringRow.includes('bites')) {
        console.log(`Fila ${i}:`, row);
        foundInExcel = true;
    }
}

if (!foundInExcel) {
    console.log('❌ No se encontró nada sobre Happy Bites en el Excel.');
}

// 2. Check Firebase
console.log('\n--- BUSCANDO EN FIREBASE ---');
const snapshot = await getDocs(collection(db, 'products'));
let foundInFirebase = false;

for (const docSnap of snapshot.docs) {
    const product = docSnap.data();
    const stringData = JSON.stringify(product).toLowerCase();

    if (stringData.includes('happy') || stringData.includes('bites')) {
        console.log(`ID: ${docSnap.id} | Categoría: ${product.category} | Nombre: ${product.name} | Marca: ${product.brand}`);
        foundInFirebase = true;
    }
}

if (!foundInFirebase) {
    console.log('❌ No se encontró nada sobre Happy Bites en Firebase.');
}

process.exit(0);
