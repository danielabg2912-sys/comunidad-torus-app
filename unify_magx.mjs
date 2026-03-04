import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
};

const BRAIN = 'C:\\Users\\ALIEN\\.gemini\\antigravity\\brain\\35a033df-6190-417a-a839-be846e0e955b';

// ── 1. Copy images ───────────────────────────────────────────────────────────
const destDir = '.\\public\\products\\parafernalia';
fs.mkdirSync(destDir, { recursive: true });

const images = [
    { src: `${BRAIN}\\magx_bubble_gum_1772564130649.png`, dest: `${destDir}\\magx-bubble-gum.png`, name: 'Bubble Gum' },
    { src: `${BRAIN}\\magx_blueberry_1772564154824.png`, dest: `${destDir}\\magx-blueberry.png`, name: 'Blueberry' },
    { src: `${BRAIN}\\magx_grape_1772564172958.png`, dest: `${destDir}\\magx-grape.png`, name: 'Grape' },
    { src: `${BRAIN}\\magx_kush_berry_1772564187742.png`, dest: `${destDir}\\magx-kush-berry.png`, name: 'Kush Berry' },
    { src: `${BRAIN}\\magx_vainilla_1772564209993.png`, dest: `${destDir}\\magx-vainilla.png`, name: 'Vainilla' },
    { src: `${BRAIN}\\magx_cacao_1772564223234.png`, dest: `${destDir}\\magx-cacao.png`, name: 'Cacao' },
    { src: `${BRAIN}\\magx_mango_1772564244170.png`, dest: `${destDir}\\magx-mango.png`, name: 'Mango' },
    { src: `${BRAIN}\\magx_leaf_palm_1772564258628.png`, dest: `${destDir}\\magx-leaf-palm.png`, name: 'Leaf Palm' },
];

console.log('── Copiando imágenes ──');
for (const img of images) {
    try {
        fs.copyFileSync(img.src, img.dest);
        console.log(`  ✅ ${img.name}`);
    } catch (e) {
        console.log(`  ❌ ${img.name}: ${e.message}`);
    }
}

// ── 2. Update Firebase ───────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// IDs of the 8 separate MAG X products to update
const flavors = [
    { id: '5wgXCjVvLZRiKPIwhV0v', name: 'Bubble Gum', imageUrl: '/products/parafernalia/magx-bubble-gum.png' },
    { id: 'DbuPZEn5CydWqOHAlKFM', name: 'Blueberry', imageUrl: '/products/parafernalia/magx-blueberry.png' },
    { id: 'IEjDCeg6PFAqLDKHwCnk', name: 'Vainilla', imageUrl: '/products/parafernalia/magx-vainilla.png' },
    { id: 'ILjhC9gqibDD4MH4RaE7', name: 'Leaf Palm', imageUrl: '/products/parafernalia/magx-leaf-palm.png' },
    { id: 'SVKoRJgwXjM8VxFR6FBd', name: 'Kush Berry', imageUrl: '/products/parafernalia/magx-kush-berry.png' },
    { id: 'oWf939opznDjNp4fLjH1', name: 'Cacao', imageUrl: '/products/parafernalia/magx-cacao.png' },
    { id: 'w5GO3lseUbfIATBmCyyM', name: 'Grape', imageUrl: '/products/parafernalia/magx-grape.png' },
    { id: 'yOvA7Y3AWQpNaEm61E7C', name: 'Mango', imageUrl: '/products/parafernalia/magx-mango.png' },
];

// Strategy: Keep the first product (Bubble Gum) as the "main" MAG X product
// and add all options to it. Delete or hide the rest.
const mainId = '5wgXCjVvLZRiKPIwhV0v';

// Build options array (all 8 flavors)
const options = flavors.map(f => ({
    name: f.name,
    imageUrl: f.imageUrl,
}));

console.log('\n── Actualizando Firebase ──');

// Update main product with all options
await updateDoc(doc(db, 'products', mainId), {
    name: 'MAG X Natural Wraps',
    imageUrl: '/products/parafernalia/magx-bubble-gum.png',
    images: [],
    options: options,
    description: 'Wraps de cáñamo 100% naturales MAG X. Disponibles en 8 sabores: Bubble Gum, Blueberry, Vainilla, Leaf Palm, Kush Berry, Cacao, Grape y Mango.',
});
console.log('  ✅ Producto principal MAG X actualizado con 8 sabores');

// Hide the other 7 (mark as hidden or delete)
const toHide = flavors.filter(f => f.id !== mainId);
for (const f of toHide) {
    await updateDoc(doc(db, 'products', f.id), {
        hidden: true,
    });
    console.log(`  🙈 ${f.name} → oculto`);
}

console.log('\n🎉 ¡Listo! MAG X unificado en un solo producto con 8 sabores.');
process.exit(0);
