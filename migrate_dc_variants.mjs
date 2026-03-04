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

const dcBases = [
    {
        targetId: 'dc_gotero_rosin_base',
        name: 'Gotero Full Spectrum Rosin',
        image: '/products/dc/tincture.png',
        options: [
            { name: '2000 mg', price: 0 },
            { name: 'Descarboxilado 5000 mg', price: 0 }
        ],
        idsToDelete: []
    },
    {
        targetId: 'dc_saquito_galletas_base',
        name: 'Saquito Galletas Zen',
        image: '/products/dc/zen_pouch.png',
        options: [
            { name: '500 mg', price: 0 },
            { name: '1000 mg', price: 0 }
        ],
        idsToDelete: []
    }
];

// Helper to find the base object
const findBaseForName = (name) => {
    if (name.toLowerCase().includes('gotero full spectrum')) return dcBases[0];
    if (name.toLowerCase().includes('saquito galletas')) return dcBases[1];
    return null;
};

async function migrateDCTinctures() {
    console.log('🔍 Obteniendo productos de Firebase...');
    const snapshot = await getDocs(collection(db, 'products'));

    let templateGotero = null;
    let templateSaquito = null;

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const id = docSnap.id;

        if (data.brand === 'DC') {
            const baseMatch = findBaseForName(data.name);
            if (baseMatch) {
                baseMatch.idsToDelete.push(id);

                // Save templates
                if (baseMatch === dcBases[0] && !templateGotero) {
                    templateGotero = { ...data };
                    delete templateGotero.name;
                    delete templateGotero.imageUrl;
                    delete templateGotero.id;
                }
                if (baseMatch === dcBases[1] && !templateSaquito) {
                    templateSaquito = { ...data };
                    delete templateSaquito.name;
                    delete templateSaquito.imageUrl;
                    delete templateSaquito.id;
                }
            }
        }
    }

    // Create Gotero Base
    if (templateGotero) {
        const gBase = dcBases[0];
        const newDocRef = doc(db, 'products', gBase.targetId);
        const newProductData = {
            ...templateGotero,
            name: gBase.name,
            imageUrl: gBase.image,
            options: gBase.options,
            price: 0
        };
        await setDoc(newDocRef, newProductData);
        console.log(`✅ Creado base consolidado: ${gBase.name}`);

        for (const oldId of gBase.idsToDelete) {
            await deleteDoc(doc(db, 'products', oldId));
            console.log(`   - Eliminado viejo: ${oldId}`);
        }
    }

    // Create Saquito Base
    if (templateSaquito) {
        const sBase = dcBases[1];
        const newDocRef = doc(db, 'products', sBase.targetId);
        const newProductData = {
            ...templateSaquito,
            name: sBase.name,
            imageUrl: sBase.image,
            options: sBase.options,
            price: 0
        };
        await setDoc(newDocRef, newProductData);
        console.log(`✅ Creado base consolidado: ${sBase.name}`);

        for (const oldId of sBase.idsToDelete) {
            await deleteDoc(doc(db, 'products', oldId));
            console.log(`   - Eliminado viejo: ${oldId}`);
        }
    }

    console.log('🎉 Migración de DC completada!');
    process.exit(0);
}

migrateDCTinctures();
