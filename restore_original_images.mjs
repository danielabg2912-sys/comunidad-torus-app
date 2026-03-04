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

// ── Copiar imágenes ORIGINALES (las que el usuario subió) ────────────────────
const copies = [
    // 4PETS: original
    {
        src: `${MEDIA}\\media_73534c14-8177-47e8-818e-34b0685a0ef2_1772304938685.png`,
        dest: '.\\public\\products\\salud\\4pets_cbd.png'
    },
    // Libro: portada original
    {
        src: `${MEDIA}\\media_73534c14-8177-47e8-818e-34b0685a0ef2_1772304955212.png`,
        dest: '.\\public\\products\\salud\\libro_portada.png'
    },
    // Libro: interior original
    {
        src: `${MEDIA}\\media_73534c14-8177-47e8-818e-34b0685a0ef2_1772304959523.png`,
        dest: '.\\public\\products\\salud\\libro_interior.png'
    },
];

console.log('\n── Restaurando imágenes originales ──');
for (const { src, dest } of copies) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`  ✅ ${dest}`);
    } catch (e) {
        console.log(`  ❌ ${src}: ${e.message}`);
    }
}

// ── Actualizar Firebase (asegurar rutas) ──────────────────────────────────────
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('\n── Actualizando Firebase ──');

await updateDoc(doc(db, 'products', 'qA5oQfS8BYamzOa5YaKO'), {
    imageUrl: '/products/salud/4pets_cbd.png',
});
await updateDoc(doc(db, 'products', 'nxB9gpxBHaPOAjWtP5iH'), {
    imageUrl: '/products/salud/libro_portada.png',
    images: ['/products/salud/libro_interior.png'],
});

console.log('\n🎉 ¡Restauradas!');
process.exit(0);
