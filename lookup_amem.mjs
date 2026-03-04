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

console.log('🔍 Buscando productos Amem en Firebase...');
const snapshot = await getDocs(collection(db, 'products'));

let found = false;
for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const strData = JSON.stringify(data).toLowerCase();

    if (strData.includes('amem') || strData.includes('high therapy') || strData.includes('high high') || strData.includes('high dreams') || strData.includes('high balance')) {
        console.log(`- ${data.name} (Marca: ${data.brand || 'N/A'}, ID: ${docSnap.id})`);
        found = true;
    }
}

if (!found) console.log('❌ No se encontraron productos Amem.');
process.exit(0);
