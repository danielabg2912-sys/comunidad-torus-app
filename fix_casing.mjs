import fs from 'fs';
import path from 'path';
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

async function alignPaths() {
    console.log('Checking recently updated MAG X and INNDRA products for casing issues...');
    const snap = await getDocs(collection(db, 'products'));

    for (const d of snap.docs) {
        const product = d.data();
        let changed = false;

        // 1. Check INNDRA
        if (product.name && product.name.includes('INNDRA')) {
            console.log(`Checking ${product.name}... Current URL: ${product.imageUrl}`);
            // The files are inndra_50mg.png and inndra_250mg.png
            if (product.name.includes('50 mg') && product.imageUrl !== '/products/comestibles/inndra_50mg.png') {
                await updateDoc(doc(db, 'products', d.id), { imageUrl: '/products/comestibles/inndra_50mg.png' });
                console.log(`✅ Fixed INNDRA 50mg path`);
            }
            if (product.name.includes('250 mg') && product.imageUrl !== '/products/comestibles/inndra_250mg.png') {
                await updateDoc(doc(db, 'products', d.id), { imageUrl: '/products/comestibles/inndra_250mg.png' });
                console.log(`✅ Fixed INNDRA 250mg path`);
            }
        }

        // 2. Check MAG X main product
        if (product.name && product.name.includes('MAG X') && product.options) {
            console.log(`Checking MAG X options...`);
            let optionsChanged = false;
            const newOptions = product.options.map(opt => {
                if (opt.imageUrl && opt.imageUrl.includes('magx-')) {
                    // Ensure the URL matches the exact lowercase spelling we have in public/products/parafernalia/
                    let correctFileName = opt.imageUrl.split('/').pop().toLowerCase();
                    // Some of them have uppercase in DB e.g. magx-Kush-Berry.png instead of magx-kush-berry.png
                    if (opt.imageUrl !== `/products/parafernalia/${correctFileName}`) {
                        optionsChanged = true;
                        opt.imageUrl = `/products/parafernalia/${correctFileName}`;
                    }
                }
                return opt;
            });

            if (optionsChanged) {
                await updateDoc(doc(db, 'products', d.id), { options: newOptions });
                console.log(`✅ Fixed MAG X options case sensitivity`);
            }
        }
    }

    console.log('Done.');
    process.exit(0);
}

alignPaths();
