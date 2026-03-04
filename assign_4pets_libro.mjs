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

const BRAIN = 'C:\\Users\\ALIEN\\.gemini\\antigravity\\brain\\73534c14-8177-47e8-818e-34b0685a0ef2';
const MEDIA = `${BRAIN}\\.tempmediaStorage`;

// ── Copiar imágenes ──────────────────────────────────────────────────────────
const copies = [
    // 4PETS: imagen procesada con fondo blanco
    {
        src: `${BRAIN}\\4pets_cbd_pro_1772311863396.png`,
        dest: '.\\public\\products\\salud\\4pets_cbd.png'
    },
    // Libro: portada procesada con fondo blanco
    {
        src: `${BRAIN}\\libro_portada_pro_1772311897630.png`,
        dest: '.\\public\\products\\salud\\libro_portada.png'
    },
    // Libro: interior (imagen original del usuario - ya tiene fondo blanco)
    {
        src: `${MEDIA}\\media_73534c14-8177-47e8-818e-34b0685a0ef2_1772304959523.png`,
        dest: '.\\public\\products\\salud\\libro_interior.png'
    },
];

console.log('\n── Copiando imágenes ──');
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

// Gotero 4 Pets
await updateDoc(doc(db, 'products', 'qA5oQfS8BYamzOa5YaKO'), {
    imageUrl: '/products/salud/4pets_cbd.png',
});
console.log('  ✅ Gotero 4 Pets → 4pets_cbd.png');

// Libro para colorear: portada como imageUrl + interior en images[]
await updateDoc(doc(db, 'products', 'nxB9gpxBHaPOAjWtP5iH'), {
    imageUrl: '/products/salud/libro_portada.png',
    images: ['/products/salud/libro_interior.png'],
});
console.log('  ✅ Libro para colorear → portada + interior gallery');

console.log('\n🎉 ¡Listo!');
process.exit(0);
