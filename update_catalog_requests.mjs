import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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

const exteriorImages = [
    '/products/flores/exterior/image00004.jpg',
    '/products/flores/exterior/image00008.jpg',
    '/products/flores/exterior/image00019.jpg',
    '/products/flores/exterior/image00040.jpg',
    '/products/flores/exterior/image00043.jpg',
    '/products/flores/exterior/image00055.jpg',
    '/products/flores/exterior/image00059.jpg',
    '/products/flores/exterior/image00060.jpg',
    '/products/flores/exterior/image00071.jpg',
    '/products/flores/exterior/image00073.jpg'
];

const interiorImages = [
    '/products/flores/interior/image00036.jpg',
    '/products/flores/interior/image00047.jpg',
    '/products/flores/interior/image00051.jpg',
    '/products/flores/interior/image00066.jpg',
    '/products/flores/interior/image00069.jpg'
];

const invernaderoImages = [
    '/products/flores/invernadero/image00012.jpg',
    '/products/flores/invernadero/image00030.jpg',
    '/products/flores/invernadero/image00064.jpg'
];

let extIdx = 0;
let intIdx = 0;
let invIdx = 0;

console.log('🔍 Obteniendo productos de Firebase...');
const snapshot = await getDocs(collection(db, 'products'));

let deletedCount = 0;
let brandFixedCount = 0;
let typoFixedCount = 0;
let imagesAssignedCount = 0;

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;

    let updates = {};

    // 1. ELIMINAR "CARTUCHO LUSH"
    if (data.name && data.name.toLowerCase().includes('cartucho lush')) {
        await deleteDoc(doc(db, 'products', id));
        console.log(`🗑️ Eliminado: ${data.name}`);
        deletedCount++;
        continue; // No hacemos más updates en este doc borrado
    }

    // 2. ARREGLAR MARCA "Smoking / Webs" -> "Smoking"
    if (data.brand && data.brand.includes('Smoking / Webs')) {
        updates.brand = data.brand.replace('Smoking / Webs', 'Smoking');
        console.log(`🏷️ Marca actualizada en: ${data.name}`);
        brandFixedCount++;
    }

    // 3. ARREGLAR TYPO "phytobalnce" -> "phytobalance"
    if (data.name && data.name.toLowerCase().includes('phytobalnce')) {
        // Reemplazo case-insensitive
        updates.name = data.name.replace(/phytobalnce/i, 'Phytobalance');
        // Actualizar también la descripción si contiene el typo
        if (data.description && data.description.toLowerCase().includes('phytobalnce')) {
            updates.description = data.description.replace(/phytobalnce/i, 'Phytobalance');
        }
        console.log(`✍️ Typo corregido: ${data.name} -> ${updates.name}`);
        typoFixedCount++;
    }

    // 4. ASIGNAR IMÁGENES A FLORES (Solo si no tienen ya o no importa, sobreeescribimos para asegurar)
    if (data.category === 'Flores Exterior' || data.category === 'Exterior') {
        updates.imageUrl = exteriorImages[extIdx % exteriorImages.length];
        extIdx++;
        imagesAssignedCount++;
    } else if (data.category === 'Flores Interior' || data.category === 'Interior') {
        updates.imageUrl = interiorImages[intIdx % interiorImages.length];
        intIdx++;
        imagesAssignedCount++;
    } else if (data.category === 'Flores Invernadero' || data.category === 'Invernadero') {
        updates.imageUrl = invernaderoImages[invIdx % invernaderoImages.length];
        invIdx++;
        imagesAssignedCount++;
    }

    // Aplicar los updates si hubo alguno
    if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, 'products', id), updates);
    }
}

console.log('\n✅ PROCESO COMPLETADO ✅');
console.log(`- Productos eliminados (Lush): ${deletedCount}`);
console.log(`- Marcas arregladas (Smoking): ${brandFixedCount}`);
console.log(`- Typos corregidos (Phytobalance): ${typoFixedCount}`);
console.log(`- Imágenes de flores asignadas: ${imagesAssignedCount}`);
process.exit(0);
