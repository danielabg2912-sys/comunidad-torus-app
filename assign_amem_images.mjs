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

console.log('🔍 Actualizando imágenes de Goteros Amem...');
const snapshot = await getDocs(collection(db, 'products'));

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const name = data.name || '';

    if (data.brand === 'AMEM') {
        let updates = {};

        if (name.includes('High Therapy')) {
            updates.imageUrl = '/products/amem/high_therapy.png';
        } else if (name.includes('High High')) {
            updates.imageUrl = '/products/amem/high_high.png';
        } else if (name.includes('High Dreams')) {
            updates.imageUrl = '/products/amem/high_dreams.png';
        } else if (name.includes('High Balance')) {
            updates.imageUrl = '/products/amem/high_balance.png';
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'products', id), updates);
            console.log(`✅ Imagen agregada a: ${name}`);
        }
    }
}

console.log('Terminado');
process.exit(0);
