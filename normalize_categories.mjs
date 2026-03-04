// normalize_categories.mjs
// Actualiza productos viejos que tienen categorías sin normalizar
// Ejecutar: node normalize_categories.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

// Mapa de normalización: valor viejo → valor nuevo
const categoryNormalize = {
    'Interior': 'Flores Interior',
    'Exterior': 'Flores Exterior',
    'Invernadero': 'Flores Invernadero',
    'CBD': 'CBD & Bienestar',
    'cbd': 'CBD & Bienestar',
    'comestibles': 'Comestibles',
    'extractos': 'Extractos',
    'parafernalia': 'Parafernalia',
    'prerolados': 'Prerolados',
    'Extracto': 'Extractos',
    'Resinas': 'Extractos',
};

console.log('🔍 Leyendo todos los productos de Firebase...');
const snapshot = await getDocs(collection(db, 'products'));
console.log(`📦 Total productos: ${snapshot.size}`);

let updated = 0;
let skipped = 0;

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const oldCat = data.category || '';
    const newCat = categoryNormalize[oldCat];

    if (newCat && newCat !== oldCat) {
        await updateDoc(doc(db, 'products', docSnap.id), { category: newCat });
        console.log(`  ✔ "${data.name}" → ${oldCat} ➜ ${newCat}`);
        updated++;
    } else {
        skipped++;
    }
}

console.log(`\n✅ LISTO: ${updated} productos actualizados, ${skipped} sin cambios`);
process.exit(0);
