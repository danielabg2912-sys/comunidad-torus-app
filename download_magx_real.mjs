import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
import https from 'https';
import http from 'http';

const firebaseConfig = {
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
};

const destDir = '.\\public\\products\\parafernalia';
fs.mkdirSync(destDir, { recursive: true });

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const proto = url.startsWith('https') ? https : http;
        proto.get(url, res => {
            // Follow redirects
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.close();
                return download(res.headers.location, dest).then(resolve).catch(reject);
            }
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', err => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

// Real images from magxwraps.com
const flavors = [
    { name: 'Kush Berry', url: 'http://magxwraps.com/wp-content/uploads/2023/01/KB-1.jpg', file: 'magx-kush-berry.png', fbId: 'SVKoRJgwXjM8VxFR6FBd' },
    { name: 'Bubble Gum', url: 'http://magxwraps.com/wp-content/uploads/2022/10/BG-1-1.jpg', file: 'magx-bubble-gum.png', fbId: '5wgXCjVvLZRiKPIwhV0v' },
    { name: 'Vainilla', url: 'http://magxwraps.com/wp-content/uploads/2022/10/SV-1-1.jpg', file: 'magx-vainilla.png', fbId: 'IEjDCeg6PFAqLDKHwCnk' },
    { name: 'Cacao', url: 'http://magxwraps.com/wp-content/uploads/2022/10/MC-1-1.jpg', file: 'magx-cacao.png', fbId: 'oWf939opznDjNp4fLjH1' },
    { name: 'Leaf Palm', url: 'http://magxwraps.com/wp-content/uploads/2022/10/PL-1.jpg', file: 'magx-leaf-palm.png', fbId: 'ILjhC9gqibDD4MH4RaE7' },
    { name: 'Mango', url: 'http://magxwraps.com/wp-content/uploads/2022/10/MM-1.jpg', file: 'magx-mango.png', fbId: 'yOvA7Y3AWQpNaEm61E7C' },
    { name: 'Grape', url: 'http://magxwraps.com/wp-content/uploads/2022/10/IG-1.jpg', file: 'magx-grape.png', fbId: 'w5GO3lseUbfIATBmCyyM' },
    { name: 'Blueberry', url: 'http://magxwraps.com/wp-content/uploads/2022/10/BB-1.jpg', file: 'magx-blueberry.png', fbId: 'DbuPZEn5CydWqOHAlKFM' },
];

console.log('── Descargando imágenes reales de magxwraps.com ──');
for (const f of flavors) {
    const dest = `${destDir}\\${f.file}`;
    try {
        await download(f.url, dest);
        console.log(`  ✅ ${f.name}`);
    } catch (e) {
        console.log(`  ❌ ${f.name}: ${e.message}`);
    }
}

// Update Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('\n── Actualizando Firebase ──');

// Build options with real images for main product (Bubble Gum is main)
const options = flavors.map(f => ({
    name: f.name,
    imageUrl: `/products/parafernalia/${f.file}`,
}));

// Update main product
await updateDoc(doc(db, 'products', '5wgXCjVvLZRiKPIwhV0v'), {
    name: 'MAG X Natural Wraps',
    imageUrl: '/products/parafernalia/magx-bubble-gum.png',
    options: options,
    description: 'Wraps de cáñamo 100% naturales MAG X. Disponibles en 8 sabores.',
});
console.log('  ✅ Producto principal MAG X actualizado con imágenes reales');

// Update individual hidden products with real images too
for (const f of flavors) {
    if (f.fbId === '5wgXCjVvLZRiKPIwhV0v') continue;
    await updateDoc(doc(db, 'products', f.fbId), {
        imageUrl: `/products/parafernalia/${f.file}`,
        hidden: true,
    });
}
console.log('  ✅ Todos los sabores actualizados con imágenes reales');

console.log('\n🎉 ¡Listo! Imágenes reales de magxwraps.com aplicadas.');
process.exit(0);
