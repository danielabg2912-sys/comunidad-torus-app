// Busca y muestra solo los productos relacionados con las imágenes subidas
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
});
const db = getFirestore(app);

const keywords = ['somnia', 'sensation', 'digest', 'phyto', 'cannasex', 'luv', 'balance', 'slim', 'energy', 'unguento', 'ungüento', 'pets', '4pets'];

const snap = await getDocs(collection(db, 'products'));
console.log('=== Productos que coinciden con imágenes subidas ===\n');
snap.forEach(d => {
    const name = (d.data().name || '').toLowerCase();
    if (keywords.some(kw => name.includes(kw))) {
        console.log(`ID: ${d.id} | Nombre: "${d.data().name}" | Image: ${d.data().imageUrl || 'SIN IMAGEN'}`);
    }
});
process.exit(0);
