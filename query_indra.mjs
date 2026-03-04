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

const snap = await getDocs(collection(db, 'products'));
const indra = [];
snap.forEach(d => {
    const data = d.data();
    if (data.name?.toLowerCase().includes('indra') || data.slug?.toLowerCase().includes('indra')) {
        indra.push({ id: d.id, name: data.name, imageUrl: data.imageUrl, category: data.category, slug: data.slug });
    }
});

console.log(JSON.stringify(indra, null, 2));
process.exit(0);
