import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

// Update ID: 0cTUOlDWZbfnNyLV2nAU (Chocolates 90 mg) -> INNDRA 50 mg
const doc1 = doc(db, 'products', '0cTUOlDWZbfnNyLV2nAU');
await updateDoc(doc1, {
    name: 'Chocolates 50 mg',
    brand: 'INNDRA', // the UI seems to show "INDRA" as brand/subtitle
    imageUrl: '/products/comestibles/inndra_50mg.png'
});
console.log('✅ Updated 90mg -> 50mg INNDRA');

// Update ID: UUnWDXDctqkPFT8IvfXC (Chocolates 500 mg) -> INNDRA 250 mg
const doc2 = doc(db, 'products', 'UUnWDXDctqkPFT8IvfXC');
await updateDoc(doc2, {
    name: 'Chocolates 250 mg',
    brand: 'INNDRA',
    imageUrl: '/products/comestibles/inndra_250mg.png'
});
console.log('✅ Updated 500mg -> 250mg INNDRA');

process.exit(0);
