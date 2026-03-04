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

const amemBases = [
    {
        targetId: 'amem_high_therapy_base',
        name: 'Gotero High Therapy',
        image: '/products/amem/high_therapy.png',
        options: [
            { name: '10 ml - 350 mg', price: 0 },
            { name: '30 ml - 1000 mg', price: 0 }
        ],
        idsToDelete: []
    },
    {
        targetId: 'amem_high_high_base',
        name: 'Gotero High High',
        image: '/products/amem/high_high.png',
        options: [
            { name: '10 ml - 175 mg', price: 0 },
            { name: '10 ml - 350 mg', price: 0 },
            { name: '30 ml - 1000 mg', price: 0 }
        ],
        idsToDelete: []
    },
    {
        targetId: 'amem_high_dreams_base',
        name: 'Gotero High Dreams',
        image: '/products/amem/high_dreams.png',
        options: [
            { name: '10 ml - 350 mg', price: 0 },
            { name: '30 ml - 1000 mg', price: 0 }
        ],
        idsToDelete: []
    },
    {
        targetId: 'amem_high_balance_base',
        name: 'Gotero High Balance',
        image: '/products/amem/high_balance.png',
        options: [
            { name: '10 ml - 350 mg', price: 0 },
            { name: '30 ml - 1000 mg', price: 0 }
        ],
        idsToDelete: []
    }
];

// Helper to find the base object
const findBaseForName = (name) => {
    if (name.includes('High Therapy')) return amemBases[0];
    if (name.includes('High High')) return amemBases[1];
    if (name.includes('High Dreams')) return amemBases[2];
    if (name.includes('High Balance')) return amemBases[3];
    return null;
};

async function migrateAmemTinctures() {
    console.log('🔍 Obteniendo productos de Firebase...');
    const snapshot = await getDocs(collection(db, 'products'));

    let templateProduct = null;

    // Encontrar y clasificar los productos AMEM existentes
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;

        if (data.brand === 'AMEM' && data.name.includes('Gotero')) {
            // Save one as a template to copy standard fields from (category, availability, etc.)
            if (!templateProduct) {
                templateProduct = { ...data };
                delete templateProduct.name;
                delete templateProduct.imageUrl;
                delete templateProduct.id;
            }

            const baseMatch = findBaseForName(data.name);
            if (baseMatch) {
                baseMatch.idsToDelete.push(id);
            }
        }
    }

    if (!templateProduct) {
        console.log('❌ No se encontraron goteros AMEM para usar de plantilla.');
        process.exit(1);
    }

    // Crear los productos consolidados
    for (const base of amemBases) {
        const newDocRef = doc(db, 'products', base.targetId);
        const newProductData = {
            ...templateProduct,
            name: base.name,
            imageUrl: base.image,
            options: base.options,
            price: 0 // Overall price can be 0 or derived from variants if needed
        };

        await setDoc(newDocRef, newProductData);
        console.log(`✅ Creado base consolidado: ${base.name}`);

        // Eliminar los viejos
        for (const oldId of base.idsToDelete) {
            await deleteDoc(doc(db, 'products', oldId));
            console.log(`   - Eliminado viejo: ${oldId}`);
        }
    }

    console.log('🎉 Migración de AMEM completada!');
    process.exit(0);
}

migrateAmemTinctures();
