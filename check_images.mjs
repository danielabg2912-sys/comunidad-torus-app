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

async function checkImages() {
    console.log('Fetching products...');
    const snap = await getDocs(collection(db, 'products'));
    const missing = [];
    const publicDir = path.join(process.cwd(), 'public');

    snap.forEach(doc => {
        const product = doc.data();
        if (product.imageUrl) {
            // Remove query params if any
            const urlPath = product.imageUrl.split('?')[0];
            // Normalize path for Windows
            const localPath = path.join(publicDir, ...urlPath.split('/'));
            if (!fs.existsSync(localPath)) {
                missing.push({ id: doc.id, name: product.name, url: product.imageUrl });
            }
        } else {
            missing.push({ id: doc.id, name: product.name, url: 'NO_IMAGE_URL_IN_DB' });
        }

        // Also check options
        if (product.options && Array.isArray(product.options)) {
            product.options.forEach(opt => {
                if (opt.imageUrl) {
                    const urlPath = opt.imageUrl.split('?')[0];
                    const localPath = path.join(publicDir, ...urlPath.split('/'));
                    if (!fs.existsSync(localPath)) {
                        missing.push({ id: doc.id, name: `${product.name} - ${opt.name}`, url: opt.imageUrl });
                    }
                }
            });
        }
    });

    console.log(`\nFound ${missing.length} missing images:`);
    missing.forEach(m => console.log(`- ${m.name} -> ${m.url}`));
    process.exit(0);
}

checkImages();
