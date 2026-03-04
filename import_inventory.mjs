// import_inventory.mjs
// Importa todos los productos del INVENTARIO.xlsx a Firebase Firestore
// Ejecutar: node import_inventory.mjs

import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

// ==== CONFIG FIREBASE ====
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

// ==== MAPEO DE CATEGORÍAS ====
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

// ==== MAPEO DE SUBCATEGORÍAS ====
function getSubCategory(name, category, brand) {
    const n = name.toLowerCase();
    const c = category.toLowerCase();

    if (c === 'cbd') {
        if (n.includes('gotero') || n.includes('tintura') || n.includes('full spectrum') || n.includes('phytobalance') || n.includes('focus and calm') || n.includes('phytobalance')) return 'Goteros y Tinturas';
        if (n.includes('gomita')) return 'Gomitas CBD';
        if (n.includes('crema') || n.includes('locion') || n.includes('balsamo') || n.includes('tópico') || n.includes('pomada') || n.includes('topic')) return 'Cremas y Tópicos';
        if (n.includes('lubricante')) return 'Lubricantes';
        if (n.includes('pet') || n.includes('perro') || n.includes('gato') || n.includes('cat') || n.includes('dog') || n.includes('4 pets') || n.includes('vet')) return 'Para Mascotas';
        return 'Goteros y Tinturas';
    }

    if (c === 'comestibles') {
        if (n.includes('chocolate') || n.includes('choco') || n.includes('brownie')) return 'Chocolates y Brownies';
        if (n.includes('gomita')) return 'Gomitas';
        if (n.includes('galleta') || n.includes('saquito') || n.includes('tartalina') || n.includes('deli cloud')) return 'Galletas y Snacks';
        if (n.includes('miel')) return 'Mieles';
        if (n.includes('agua') || n.includes('xoda') || n.includes('soda') || n.includes('bebida') || n.includes('cannamoy')) return 'Bebidas';
        return 'Snacks';
    }

    if (c === 'exterior' || c === 'interior' || c === 'invernadero') {
        if (n.includes('mix')) return 'Mezclas';
        return 'Variedades';
    }

    if (c === 'extractos') {
        if (n.includes('cartucho') || n.includes('lush')) return 'Cartuchos';
        if (n.includes('moon rock') || n.includes('rosin') || n.includes('bho') || n.includes('live')) return 'Concentrados';
        if (n.includes('balsamo') || n.includes('topic') || n.includes('tópico')) return 'Tópicos';
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
        if (n.includes('tea pad')) return 'Tea Pad';
        return 'Prerolados';
    }

    return '';
}

// ==== NORMALIZAR MARCA ====
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

// ==== LEER EXCEL ====
console.log('📖 Leyendo INVENTARIO.xlsx...');
const buf = readFileSync('./INVENTARIO.xlsx');
const wb = XLSX.read(buf, { type: 'buffer' });
const ws = wb.Sheets[wb.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// ==== PROCESAR FILAS ====
const products = [];
for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || !row[0]) continue; // Skip empty rows

    const rawName = String(row[0] || '').trim();
    const unit = String(row[1] || '').trim(); // pz or gr
    const rawCat = String(row[2] || '').trim().toLowerCase();
    const rawBrand = String(row[3] || '').trim().toLowerCase();

    if (!rawName || rawName.length < 2) continue;

    // Skip header rows or partial rows
    if (rawName.toLowerCase() === 'nombre' || rawName.toLowerCase() === 'producto') continue;

    // Skip rows without a category
    if (!rawCat || Object.keys(categoryMap).indexOf(rawCat) === -1) continue;

    const category = categoryMap[rawCat] || rawCat;
    const brand = brandNormalize[rawBrand] !== undefined ? brandNormalize[rawBrand] : rawBrand;
    const subCategory = getSubCategory(rawName, rawCat, brand);

    // Capitalize first letter of name
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    products.push({
        name,
        category,
        subCategory,
        brand,
        description: `${name} — ${category}${subCategory ? ' / ' + subCategory : ''}`,
        properties: '',
        imageUrl: '',
        availability: {
            'Del Valle': 10,
            'Coyoacán': 10,
        },
        isBestseller: false,
        isNew: false,
    });
}

console.log(`✅ Procesados ${products.length} productos válidos`);
console.log('Categorías encontradas:', [...new Set(products.map(p => p.category))]);
console.log('Marcas encontradas:', [...new Set(products.map(p => p.brand).filter(Boolean))]);

// ==== CONFIRMAR ANTES DE SUBIR ====
console.log('\n🚀 Iniciando carga a Firebase...');

let count = 0;
const errors = [];

for (const product of products) {
    try {
        await addDoc(collection(db, 'products'), product);
        count++;
        if (count % 10 === 0) console.log(`  ✔ ${count}/${products.length} productos subidos...`);
    } catch (err) {
        errors.push({ product: product.name, error: err.message });
        console.error(`  ✗ Error en "${product.name}":`, err.message);
    }
}

console.log(`\n✅ COMPLETADO: ${count} productos importados a Firebase`);
if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} errores:`);
    errors.forEach(e => console.log(`  - ${e.product}: ${e.error}`));
}

process.exit(0);
