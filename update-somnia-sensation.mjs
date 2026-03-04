// Actualiza las imágenes de Somnia y Sensation en Firebase
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

async function updateImages() {
    console.log('Buscando productos Somnia y Sensation...');
    const snap = await getDocs(collection(db, 'products'));
    const updates = [];

    snap.forEach(d => {
        const name = (d.data().name || '').toLowerCase();
        if (name.includes('somnia')) {
            console.log(`Actualizando Somnia → ID: ${d.id}`);
            updates.push(updateDoc(doc(db, 'products', d.id), { imageUrl: '/products/somnia-gomitas.jpg' }));
        }
        if (name.includes('sensation')) {
            console.log(`Actualizando Sensation → ID: ${d.id}`);
            updates.push(updateDoc(doc(db, 'products', d.id), { imageUrl: '/products/sensation-gomitas.jpg' }));
        }
    });

    if (updates.length === 0) {
        console.log('⚠️  No se encontraron productos con esos nombres.');
    } else {
        await Promise.all(updates);
        console.log(`✅ ${updates.length} productos actualizados.`);
    }
    process.exit(0);
}

updateImages().catch(e => { console.error(e); process.exit(1); });
