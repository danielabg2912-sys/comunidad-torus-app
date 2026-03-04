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

console.log('🔍 Obteniendo productos de Firebase para actualizar imagen de Amigos Soda...');
const snapshot = await getDocs(collection(db, 'products'));

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const name = data.name || '';

    if (name.includes('Amigos soda 50mg')) {
        await updateDoc(doc(db, 'products', id), {
            imageUrl: '/products/comestibles/amigos_soda.webp'
        });
        console.log(`✅ Imagen actualizada para: ${name}`);
    }
}

console.log('Terminado');
process.exit(0);
