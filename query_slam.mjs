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

async function querySlam() {
    console.log("Fetching products...");
    const snap = await getDocs(collection(db, 'products'));

    snap.docs.forEach(d => {
        const product = d.data();
        if (product.name && product.name.toLowerCase().includes('slam')) {
            console.log(`FOUND SLAM: ID: ${d.id}, Name: ${product.name}, Sub: ${product.subCategory}`);
        }
    });

    console.log("All done!");
    process.exit(0);
}

querySlam().catch(console.error);
