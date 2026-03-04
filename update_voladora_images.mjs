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

console.log('🔍 Obteniendo productos de Firebase para actualizar imágenes...');
const snapshot = await getDocs(collection(db, 'products'));

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const name = data.name ? data.name : '';
    const brand = data.brand ? data.brand.toLowerCase() : '';

    if (brand.includes('voladora')) {
        let updates = {};
        if (name === 'Volagomas') {
            updates.imageUrl = '/products/comestibles/volagomas.png';
            console.log(`Actualizando imagen de Volagomas`);
        } else if (name === 'Panketeleves') {
            updates.imageUrl = '/products/comestibles/panketeleves.png';
            console.log(`Actualizando imagen de Panketeleves`);
        } else if (name === 'Chocochips') {
            updates.imageUrl = '/products/comestibles/chocochips.png';
            console.log(`Actualizando imagen de Chocochips`);
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'products', id), updates);
        }
    }
}

console.log('✅ Imágenes actualizadas');
process.exit(0);
