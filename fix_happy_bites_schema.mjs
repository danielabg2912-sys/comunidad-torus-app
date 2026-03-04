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

console.log('🔍 Obteniendo productos de Firebase para corregir schema...');
const snapshot = await getDocs(collection(db, 'products'));

for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;

    if (data.brand === 'Happy Bites') {
        let updates = {};
        if (typeof data.availability === 'string') {
            updates.availability = {
                'Del Valle': data.stock || 10,
                'Coyoacán': data.stock || 10
            };
        }
        if (!data.properties) {
            updates.properties = '';
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(doc(db, 'products', id), updates);
            console.log(`✅ Schema corregido para: ${data.name}`);
        }
    }
}

console.log('Terminado');
process.exit(0);
