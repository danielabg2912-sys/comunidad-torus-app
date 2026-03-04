// clean_and_reimport.mjs
// 1. Borra TODOS los productos de Firebase
// 2. Re-importa los 148 del INVENTARIO.xlsx limpiamente
// Ejecutar: node clean_and_reimport.mjs

import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';

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

// ==== PASO 1: BORRAR TODOS LOS PRODUCTOS ====
console.log('🗑️  Borrando todos los productos de Firebase...');
const snapshot = await getDocs(collection(db, 'products'));
console.log(`   Encontrados: ${snapshot.size} productos`);

const ids = snapshot.docs.map(d => d.id);
// Borrar en batches de 500
const BATCH_SIZE = 400;
for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    ids.slice(i, i + BATCH_SIZE).forEach(id => {
        batch.delete(doc(db, 'products', id));
    });
    await batch.commit();
    console.log(`   ✔ Borrados ${Math.min(i + BATCH_SIZE, ids.length)}/${ids.length}...`);
}
console.log('✅ Todos los productos borrados\n');

// ==== MAPEOS ====
const categoryMap = {
    'cbd': 'CBD & Bienestar',
    'comestibles': 'Comestibles',
    'exterior': 'Flores Exterior',
    'interior': 'Flores Interior',
    'invernadero': 'Flores Invernadero',
    'extractos': 'Extractos',
    'parafernalia': 'Parafernalia',
    'prerolados': 'Prerolados',
};

function getSubCategory(name, category) {
    const n = name.toLowerCase();
    const c = category.toLowerCase();
    if (c === 'cbd') {
        if (n.includes('gotero') || n.includes('tintura') || n.includes('full spectrum') || n.includes('phytobalance') || n.includes('focus and calm')) return 'Goteros y Tinturas';
        if (n.includes('gomita')) return 'Gomitas CBD';
        if (n.includes('crema') || n.includes('balsamo') || n.includes('pomada') || n.includes('topic') || n.includes('locion')) return 'Cremas y Tópicos';
        if (n.includes('lubricante')) return 'Lubricantes';
        if (n.includes('pet') || n.includes('perro') || n.includes('gato') || n.includes('cat') || n.includes('dog') || n.includes('4 pets') || n.includes('vet')) return 'Para Mascotas';
        return 'Goteros y Tinturas';
    }
    if (c === 'comestibles') {
        if (n.includes('chocolate') || n.includes('choco') || n.includes('brownie')) return 'Chocolates y Brownies';
        if (n.includes('gomita')) return 'Gomitas';
        if (n.includes('galleta') || n.includes('saquito') || n.includes('tartalina') || n.includes('deli cloud')) return 'Galletas y Snacks';
        if (n.includes('miel')) return 'Mieles';
        if (n.includes('agua') || n.includes('xoda') || n.includes('soda') || n.includes('cannamoy')) return 'Bebidas';
        return 'Snacks';
    }
    if (c === 'exterior' || c === 'interior' || c === 'invernadero') {
        if (n.includes('mix')) return 'Mezclas';
        return 'Variedades';
    }
    if (c === 'extractos') {
        if (n.includes('cartucho') || n.includes('lush') || n.includes('stizzy')) return 'Cartuchos';
        if (n.includes('moon rock') || n.includes('rosin') || n.includes('bho') || n.includes('live')) return 'Concentrados';
        if (n.includes('balsamo') || n.includes('topic')) return 'Tópicos';
        return 'Concentrados';
    }
    if (c === 'parafernalia') {
        if (n.includes('smoking') || n.includes('mag x') || n.includes('mag') || n.includes('cono') || n.includes('papel')) return 'Papeles y Conos';
        if (n.includes('bateria') || n.includes('limpiador') || n.includes('pipa')) return 'Accesorios';
        if (n.includes('jabon')) return 'Jabones';
        if (n.includes('gorra') || n.includes('bucket') || n.includes('bag') || n.includes('bocket') || n.includes('totem')) return 'Ropa y Merch';
        if (n.includes('comic') || n.includes('libro') || n.includes('colorear')) return 'Arte y Papelería';
        return 'Accesorios';
    }
    if (c === 'prerolados') {
        if (n.includes('kief') || n.includes('rosin')) return 'Kief Rosin';
        if (n.includes('invernadero')) return 'Invernadero';
        if (n.includes('tea pad') || n.includes('tea')) return 'Tea Pad';
        return 'Prerolados';
    }
    return '';
}

const brandNormalize = {
    'torus ac': 'Torus AC',
    'salud esencial': 'Salud Esencial',
    'amem': 'AMEM',
    'dc': 'DC',
    'mag': 'MAG',
    'webs': 'Smoking / Webs',
    'gatita frita': 'Gatita Frita',
    'voladoras': 'Voladoras',
    'voladoras ': 'Voladoras',
    'indra': 'Indra',
    'jabones': 'Jabones',
    'marihuanela': 'Marihuanela',
    'cristobal': 'Cristóbal',
    'noe': 'Noe',
    'tercera vibra': 'Tercera Vibra',
    'serenity vet pet': 'Serenity Vet Pet',
    'dani': 'Dani',
    'gatita frita ': 'Gatita Frita',
    'sin asignar': '',
    '': '',
};

// ==== PASO 2: LEER Y RE-IMPORTAR ====
console.log('📖 Leyendo INVENTARIO.xlsx...');
const buf = readFileSync('./INVENTARIO.xlsx');
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

const products = [];
for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || !row[0]) continue;
    const rawName = String(row[0] || '').trim();
    const rawCat = String(row[2] || '').trim().toLowerCase();
    const rawBrand = String(row[3] || '').trim().toLowerCase();
    if (!rawName || rawName.length < 2) continue;
    if (!rawCat || !categoryMap[rawCat]) continue;
    const category = categoryMap[rawCat];
    const brand = brandNormalize[rawBrand] !== undefined ? brandNormalize[rawBrand] : rawBrand;
    const subCategory = getSubCategory(rawName, rawCat);
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    products.push({
        name,
        category,
        subCategory,
        brand,
        description: `${name}${subCategory ? ' — ' + subCategory : ''}`,
        properties: '',
        imageUrl: '',
        availability: { 'Del Valle': 10, 'Coyoacán': 10 },
        isBestseller: false,
        isNew: false,
    });
}

console.log(`✅ ${products.length} productos listos para importar`);
console.log('🚀 Importando a Firebase...\n');

let count = 0;
for (const product of products) {
    try {
        await addDoc(collection(db, 'products'), product);
        count++;
        if (count % 20 === 0) console.log(`  ✔ ${count}/${products.length} subidos...`);
    } catch (err) {
        console.error(`  ✗ Error en "${product.name}":`, err.message);
    }
}

console.log(`\n🎉 LISTO: ${count} productos en Firebase (limpio)`);
process.exit(0);
