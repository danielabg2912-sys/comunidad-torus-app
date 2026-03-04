import fs from 'fs';
import path from 'path';
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

async function checkMissingImages() {
    console.log('Fetching products from Firebase...');
    const snap = await getDocs(collection(db, 'products'));
    const missing = [];
    const publicDir = path.join(process.cwd(), 'public');

    snap.forEach(doc => {
        const product = doc.data();
        let isMissing = false;

        if (product.imageUrl) {
            const urlPath = product.imageUrl.split('?')[0];
            const localPath = path.join(publicDir, ...urlPath.split('/'));
            if (!fs.existsSync(localPath)) {
                isMissing = true;
            }
        } else {
            isMissing = true;
        }

        // Only include non-hidden products
        if (isMissing && !product.hidden) {
            missing.push({
                name: product.name || 'Sin Nombre',
                brand: product.brand || product.provider || product.subCategory || 'Sin Proveedor'
            });
        }
    });

    console.log(`\n=== PRODUCTOS SIN FOTO (${missing.length}) ===\n`);

    // Sort alphabetically by brand then by name
    missing.sort((a, b) => {
        if (a.brand < b.brand) return -1;
        if (a.brand > b.brand) return 1;
        return a.name.localeCompare(b.name);
    });

    missing.forEach(m => {
        console.log(`- ${m.name} - ${m.brand}`);
    });

    process.exit(0);
}

checkMissingImages();
