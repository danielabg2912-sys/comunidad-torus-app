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

console.log('🔍 Obteniendo productos de Firebase para actualizar imágenes de Happy Bites...');
const snapshot = await getDocs(collection(db, 'products'));

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const name = data.name || '';
    const brand = data.brand || '';

    if (brand.toLowerCase().includes('happy bites')) {
        let updates = {};
        if (name.includes('Stiizy soda 20mg')) {
            updates.imageUrl = '/products/comestibles/stiizy_soda.jpg';
        } else if (name.includes('Stiizy elixir 100mg')) {
            updates.imageUrl = '/products/comestibles/stiizy_elixir.jpg';
        } else if (name.includes('Gomitas Aura Plus') || name.includes('Gomitas aura plus')) {
            updates.imageUrl = '/products/comestibles/gomitas_aura_plus.jpg';
        } else if (name.includes('Gomitas Aura') || name.includes('Gomitas aura')) {
            if (!name.includes('Plus') && !name.includes('plus')) {
                updates.imageUrl = '/products/comestibles/gomitas_aura.jpg';
            }
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'products', id), updates);
            console.log(`✅ Imagen actualizada para: ${name}`);
        }
    }
}

console.log('Terminado');
process.exit(0);
