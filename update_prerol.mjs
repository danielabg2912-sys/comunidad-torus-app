import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

async function updatePrerolKief() {
    console.log("Fetching products to find Prerolados kief rosin...");
    const snap = await getDocs(collection(db, 'products'));
    let foundId = null;

    snap.docs.forEach(d => {
        const product = d.data();
        if (product.name && product.name.toLowerCase().includes('prerolados kief rosin')) {
            foundId = d.id;
        }
    });

    if (foundId) {
        console.log(`FOUND Prerolados kief rosin: ID: ${foundId}`);
        await updateDoc(doc(db, 'products', foundId), {
            imageUrl: '/products/torus_ac/prerol_kief.png'
        });
        console.log('✅ Successfully updated Prerol kief image in db');
    } else {
        console.log("Not found.");
    }

    process.exit(0);
}

updatePrerolKief().catch(console.error);
