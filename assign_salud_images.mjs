import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
};

// ── MAPA: archivo de imagen → ruta destino en /public ──────────────────────
const DESKTOP_FOLDER = 'C:\\Users\\ALIEN\\Desktop\\saludescencial';
const DEST_FOLDER = './public/products/salud';

const imageMap = [
    { src: 'breath.jpeg', dest: 'breath.jpeg' },
    { src: 'calmandfocus.jpeg', dest: 'calm_and_focus.jpeg' },
    { src: 'cannasexlub.jpeg', dest: 'cannasex_lub.jpeg' },
    { src: 'cbdesential.jpeg', dest: 'cbd_essential.jpeg' },
    { src: 'cremaagua.jpg', dest: 'crema_agua.jpg' },
    { src: 'digestwellcbd.jpeg', dest: 'digest_well.jpeg' },
    { src: 'energyslim.jpeg', dest: 'energy_slim.jpeg' },
    { src: 'focus.jpg', dest: 'focus_gomitas.jpg' },
    { src: 'mielsaludes.jpeg', dest: 'miel.jpeg' },
    { src: 'phytobalance cbd.jpeg', dest: 'phytobalance.jpeg' },
    { src: 'sensationgomitas.jpeg', dest: 'sensation_gomitas.jpeg' },
    { src: 'somniagomitas.jpeg', dest: 'somnia_gomitas.jpeg' },
];

// ── MAPA: ID de producto en Firebase → ruta pública de imagen ───────────────
const productImageMap = {
    '5fi4Y75P0Neuy0UPBSym': '/products/salud/cbd_essential.jpeg',     // Gotero Essential
    '5r3looUDy9n7uO0bhCUj': '/products/salud/miel.jpeg',             // Miel
    'DAJp5XIkU4L8zBypwX0T': '/products/salud/energy_slim.jpeg',       // Gotero Energy & Slim
    'GoZHI54fNjMVWCx4SEN3': '/products/salud/crema_agua.jpg',         // Lubricante base agua
    'QQoaEVDxkB3mgqgRiTb0': '/products/salud/calm_and_focus.jpeg',    // Gotero Focus and Calm
    'TbUCvxBoqEm75kvolR2K': '/products/salud/phytobalance.jpeg',      // Gotero Phytobalance
    'bQklwI5ckRC7EIHidilz': '/products/salud/focus_gomitas.jpg',      // Gomitas Focus
    'eW5U0Fz5t08WzbqTwojy': '/products/salud/sensation_gomitas.jpeg', // Gomitas Sensation
    'fChpCY1WonemBGY9dzjm': '/products/salud/digest_well.jpeg',       // Gotero Digest Well
    'yt4h1KGD27V9EeQZmYuM': '/products/salud/somnia_gomitas.jpeg',    // Gomitas Somnia
    // Nota: breath → Jelly Breath es Torus AC, no Salud Esencial, pero lo asignamos igualmente
    'JJmtqNSYFwmh4VmkL7rU': '/products/salud/breath.jpeg',           // Jelly breath
    'K4JmK93Qw0rgIYUigpa0': '/products/salud/breath.jpeg',           // Airbuds jelly breath int
    // Lubricante base aceite — usar la misma cannasex
    'lCNkyipt9SHSbyDrz1KO': '/products/salud/cannasex_lub.jpeg',     // Lubricante base aceite
};

// ── PASO 1: Copiar imágenes a /public/products/salud ────────────────────────
if (!fs.existsSync(DEST_FOLDER)) {
    fs.mkdirSync(DEST_FOLDER, { recursive: true });
    console.log(`📁 Carpeta creada: ${DEST_FOLDER}`);
}

console.log('\n── Copiando imágenes ──');
for (const { src, dest } of imageMap) {
    const srcPath = path.join(DESKTOP_FOLDER, src);
    const destPath = path.join(DEST_FOLDER, dest).replace('./', '');
    try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ✅ ${src} → ${destPath}`);
    } catch (e) {
        console.log(`  ❌ Error copiando ${src}: ${e.message}`);
    }
}

// ── PASO 2: Actualizar imageUrl en Firebase ──────────────────────────────────
console.log('\n── Actualizando Firebase ──');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

for (const [productId, imageUrl] of Object.entries(productImageMap)) {
    try {
        await updateDoc(doc(db, 'products', productId), { imageUrl });
        console.log(`  ✅ ${productId} → ${imageUrl}`);
    } catch (e) {
        console.log(`  ❌ Error en ${productId}: ${e.message}`);
    }
}

console.log('\n🎉 ¡Listo! Todas las imágenes asignadas.');
process.exit(0);
