// Actualiza SOLO el imageUrl de los productos existentes que coinciden con las imágenes subidas
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const app = initializeApp({
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
});
const db = getFirestore(app);

// Mapa de palabras clave en el nombre → nueva imagen
// Solo actualizamos los IDs que encontramos que corresponden a las imágenes subidas
const updateMap = {
    'CBDGDW': '/products/digest-well-new.jpg',    // Digest Well
    'CBDGSEN': '/products/sensation-gomitas.jpg',   // Gomitas Sensation
    'CBDGSOM': '/products/somnia-gomitas.jpg',       // Gomitas Somnia
};

// También buscar PhytoBalance y Cannasex por nombre
const snap = await getDocs(collection(db, 'products'));
snap.forEach(d => {
    const name = (d.data().name || '').toLowerCase();
    if (name.includes('phyto') || name.includes('balance') && name.includes('cbd')) {
        updateMap[d.id] = '/products/phytobalance-new.jpg';
        console.log(`Encontrado PhytoBalance: ${d.id} → "${d.data().name}"`);
    }
    if (name.includes('cannasex') || name.includes('luv')) {
        updateMap[d.id] = '/products/cannasex-luv.jpg';
        console.log(`Encontrado Cannasex LuV: ${d.id} → "${d.data().name}"`);
    }
});

console.log('\n=== Actualizando imageUrl de productos existentes ===\n');
for (const [id, imgUrl] of Object.entries(updateMap)) {
    try {
        await updateDoc(doc(db, 'products', id), { imageUrl: imgUrl });
        console.log(`✅ ${id} → ${imgUrl}`);
    } catch (e) {
        console.log(`❌ ${id}: ${e.message}`);
    }
}

console.log('\n¡Listo! Solo se actualizó el campo imageUrl, nada más.');
process.exit(0);
