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

const copies = [
    {
        src: `${MEDIA}\\media_73534c14-8177-47e8-818e-34b0685a0ef2_1772304938685.png`,
        dest: '.\\public\\4pets_root_v2.png'
    },
    {
        src: `${MEDIA}\\media_73534c14-8177-47e8-818e-34b0685a0ef2_1772304955212.png`,
        dest: '.\\public\\libro_portada_root_v2.png'
    },
    {
        src: `${MEDIA}\\media_73534c14-8177-47e8-818e-34b0685a0ef2_1772304959523.png`,
        dest: '.\\public\\libro_interior_root_v2.png'
    },
];

console.log('\n── Moviendo imágenes a LA RAÍZ (v2) ──');
for (const { src, dest } of copies) {
    try {
        fs.copyFileSync(src, dest);
        // Agregar un pequeño comentario al final del archivo si fuera texto, 
        // pero como es binario, solo confiaremos en que el nombre nuevo (v2) cambie el hash de ruta.
        console.log(`  ✅ ${dest}`);
    } catch (e) {
        console.log(`  ❌ ${src}: ${e.message}`);
    }
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('\n── Actualizando Firebase → RAÍZ ──');
await updateDoc(doc(db, 'products', 'qA5oQfS8BYamzOa5YaKO'), {
    imageUrl: '/4pets_root_v2.png',
});
await updateDoc(doc(db, 'products', 'nxB9gpxBHaPOAjWtP5iH'), {
    imageUrl: '/libro_portada_root_v2.png',
    images: ['/libro_interior_root_v2.png'],
});

console.log('\n🎉 ¡Rutas en raíz listas!');
process.exit(0);
