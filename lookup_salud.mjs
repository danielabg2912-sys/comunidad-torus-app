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

async function checkSaludEsencial() {
    console.log('🔍 Buscando productos "Salud Esencial"...');
    const snapshot = await getDocs(collection(db, 'products'));

    snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        if (data.brand && data.brand.toLowerCase().includes('salud') || data.name.toLowerCase().includes('salud esencial')) {
            console.log(`- ${data.name} (ID: ${docSnap.id})`);
        }
    });

    process.exit(0);
}

checkSaludEsencial();
