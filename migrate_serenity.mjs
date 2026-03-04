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

async function migrateSerenity() {
    console.log('🔍 Buscando productos Serenity Vet Pet...');
    const snapshot = await getDocs(collection(db, 'products'));

    let targetIds = [];
    let templateObj = null;

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;

        // Look for "Gotero para perros" or anything from Serenity Vet Pet brand
        if (data.brand === 'Serenity Vet Pet' || data.name.toLowerCase().includes('perros')) {
            targetIds.push(id);
            if (!templateObj) {
                templateObj = { ...data };
                delete templateObj.name;
                delete templateObj.imageUrl;
                delete templateObj.id;
            }
        }
    }

    if (templateObj && targetIds.length > 0) {
        const baseId = 'serenity_vet_pets_base';
        const newDocRef = doc(db, 'products', baseId);

        const newProductData = {
            ...templateObj,
            name: 'Gotero Serenity Vet',
            imageUrl: '/products/serenity/purple_100mg.png', // Default image
            options: [
                { name: '100mg (Gatos / Perros Chicos)', price: 0, imageUrl: '/products/serenity/purple_100mg.png' },
                { name: '500mg (Perros Medianos / Grandes)', price: 0, imageUrl: '/products/serenity/green_500mg.png' }
            ]
        };

        await setDoc(newDocRef, newProductData);
        console.log(`✅ Creado producto base consolidado: Gotero Serenity Vet`);

        for (const oldId of targetIds) {
            await deleteDoc(doc(db, 'products', oldId));
            console.log(`   - Eliminado viejo: ${oldId}`);
        }
    } else {
        console.log('❌ No se encontraron productos Serenity para migrar.');
    }

    console.log('🎉 Migración completada!');
    process.exit(0);
}

migrateSerenity();
