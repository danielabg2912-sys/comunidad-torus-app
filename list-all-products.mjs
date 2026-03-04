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

const snap = await getDocs(collection(db, 'products'));
console.log(`Total: ${snap.size} productos\n`);
snap.forEach(d => {
    const data = d.data();
    console.log(`ID: ${d.id}`);
    console.log(`  Nombre: ${data.name}`);
    console.log(`  ImageUrl: ${data.imageUrl || 'SIN IMAGEN'}`);
    console.log('');
});
process.exit(0);
