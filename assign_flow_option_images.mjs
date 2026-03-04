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

async function addImageToFlowOption() {
    console.log('🔍 Buscando Choco almendra Flow...');
    const snapshot = await getDocs(collection(db, 'products'));

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;

        if (data.name.toLowerCase().includes('choco almendra flow')) {
            await updateDoc(doc(db, 'products', id), {
                options: [
                    { name: 'Lata Negra', price: 0, imageUrl: '/products/dc/flow_black.png' },
                    { name: 'Lata Rosa', price: 0, imageUrl: '/products/dc/flow_pink.png' }
                ]
            });
            console.log(`✅ Opciones actualizadas con imágenes en (${id})`);
        }
    }

    console.log('🎉 Terminado');
    process.exit(0);
}

addImageToFlowOption();
