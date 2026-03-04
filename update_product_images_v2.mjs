import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
};

const ARTIFACTS = 'C:\\Users\\ALIEN\\.gemini\\antigravity\\brain\\35a033df-6190-417a-a839-be846e0e955b';

// ── Copiar imágenes originales del usuario ──────────────────────────────────
const copies = [
    // 4PETS CBD: imagen original con huellas (fondo blanco ya incluido)
    {
        src: `${ARTIFACTS}\\media__1772560056799.jpg`,
        dest: '.\\public\\products\\salud\\4pets_cbd.png'
    },
    // Libro: portada original
    {
        src: `${ARTIFACTS}\\media__1772560065897.jpg`,
        dest: '.\\public\\products\\salud\\libro_portada.png'
    },
    // Libro: interior original
    {
        src: `${ARTIFACTS}\\media__1772560069237.jpg`,
        dest: '.\\public\\products\\salud\\libro_interior.png'
    },
];

console.log('\n── Copiando imágenes originales ──');
for (const { src, dest } of copies) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`  ✅ ${dest}`);
    } catch (e) {
        console.log(`  ❌ ${src}: ${e.message}`);
    }
}

// ── Actualizar Firebase ──────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('\n── Actualizando Firebase ──');

// Gotero 4 Pets — solo imageUrl (sin images[] adicional)
await updateDoc(doc(db, 'products', 'qA5oQfS8BYamzOa5YaKO'), {
    imageUrl: '/products/salud/4pets_cbd.png',
    images: [],
});
console.log('  ✅ Gotero 4 Pets → 4pets_cbd.png');

// Libro para colorear: portada como imageUrl + interior en images[]
await updateDoc(doc(db, 'products', 'nxB9gpxBHaPOAjWtP5iH'), {
    imageUrl: '/products/salud/libro_portada.png',
    images: ['/products/salud/libro_interior.png'],
});
console.log('  ✅ Libro para colorear → portada + interior');

console.log('\n🎉 ¡Listo! Imágenes actualizadas correctamente.');
process.exit(0);
