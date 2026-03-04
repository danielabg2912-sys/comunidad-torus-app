import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

const snapshot = await getDocs(collection(db, 'products'));

console.log('\n=== PRODUCTOS SALUD ESENCIAL ===\n');
for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const brand = (data.brand || '').toLowerCase();
    const name = (data.name || '').toLowerCase();

    if (brand.includes('salud') || name.includes('salud') || name.includes('breath') ||
        name.includes('calm') || name.includes('focus') || name.includes('energy') ||
        name.includes('essential') || name.includes('esencial') || name.includes('canna') ||
        name.includes('phyto') || name.includes('crema') || name.includes('miel') ||
        name.includes('digest') || name.includes('somnia') || name.includes('sensation')) {
        console.log(`ID: ${docSnap.id}`);
        console.log(`  Nombre: ${data.name}`);
        console.log(`  Marca: ${data.brand || '(sin marca)'}`);
        console.log(`  Imagen actual: ${data.imageUrl || '(sin imagen)'}`);
        console.log('');
    }
}

process.exit(0);
