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

// Update both jelly breath products
await updateDoc(doc(db, 'products', 'JJmtqNSYFwmh4VmkL7rU'), {
    imageUrl: '/products/flores/jellybreath.png',
});
console.log('✅ Jelly breath → actualizado');

await updateDoc(doc(db, 'products', 'K4JmK93Qw0rgIYUigpa0'), {
    imageUrl: '/products/flores/jellybreath.png',
});
console.log('✅ Airbuds jelly breath int → actualizado');

console.log('\n🎉 Listo!');
process.exit(0);
