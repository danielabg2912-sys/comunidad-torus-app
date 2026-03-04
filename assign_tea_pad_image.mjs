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

console.log('🔍 Actualizando imagen de Tea Pad...');
const snapshot = await getDocs(collection(db, 'products'));

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const name = data.name || '';

    if (name.toLowerCase().includes('tea pad')) {
        await updateDoc(doc(db, 'products', id), {
            imageUrl: '/products/amem/tea_pad.png'
        });
        console.log(`✅ Imagen agregada a: ${name}`);
    }
}

console.log('Terminado');
process.exit(0);
