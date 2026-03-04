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

console.log('🔍 Todos los productos:');
const snapshot = await getDocs(collection(db, 'products'));

const products = snapshot.docs.map(doc => {
    const data = doc.data();
    return `- ${data.name} (Marca: ${data.brand || 'N/A'}, ID: ${doc.id}) [Cats: ${data.category}, ${data.subCategory}]`;
});

console.log(products.sort().join('\n'));
process.exit(0);
