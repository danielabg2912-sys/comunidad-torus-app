import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

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

async function separateSerenity() {
    console.log('🔍 Buscando el producto base consolidado Serenity...');
    const snapshot = await getDocs(collection(db, 'products'));

    let baseProduct = null;
    let baseId = '';

    for (const docSnap of snapshot.docs) {
        if (docSnap.id === 'serenity_vet_pets_base' || docSnap.data().name === 'Gotero Serenity Vet') {
            baseProduct = docSnap.data();
            baseId = docSnap.id;
            break;
        }
    }

    if (baseProduct) {
        console.log('✅ Producto base encontrado. Separando en Perros y Gatos...');

        // Dog Product
        const dogData = {
            ...baseProduct,
            name: 'Gotero Serenity Vet para Perros',
            imageUrl: '/products/serenity/green_500mg.png',
            options: [
                { name: 'Chicos (100mg)', price: 0, imageUrl: '/products/serenity/purple_100mg.png' },
                { name: 'Medianos / Grandes (500mg)', price: 0, imageUrl: '/products/serenity/green_500mg.png' }
            ]
        };
        await setDoc(doc(db, 'products', 'serenity_vet_perros'), dogData);
        console.log('🐾 Producto para Perros creado.');

        // Cat Product
        const catData = {
            ...baseProduct,
            name: 'Gotero Serenity Vet para Gatos',
            imageUrl: '/products/serenity/purple_100mg.png',
            options: [
                { name: 'Única Presentación (100mg)', price: 0, imageUrl: '/products/serenity/purple_100mg.png' }
            ]
        };
        await setDoc(doc(db, 'products', 'serenity_vet_gatos'), catData);
        console.log('🐈 Producto para Gatos creado.');

        // Delete the old base
        await deleteDoc(doc(db, 'products', baseId));
        console.log(`🗑️ Eliminado producto base anterior (${baseId})`);
    } else {
        console.log('❌ No se encontró el producto base Serenity Vet.');
    }

    console.log('🎉 Separación completada!');
    process.exit(0);
}

separateSerenity();
