import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
};

const SRC = 'C:\\Users\\ALIEN\\.gemini\\antigravity\\brain\\35a033df-6190-417a-a839-be846e0e955b\\jellybreath_flower_1772563767428.png';
const DEST = '.\\public\\products\\flores\\jellybreath.png';

// Copy image
try {
    fs.mkdirSync('.\\public\\products\\flores', { recursive: true });
    fs.copyFileSync(SRC, DEST);
    console.log('✅ Imagen copiada a:', DEST);
} catch (e) {
    console.log('❌ Error copiando imagen:', e.message);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Find Jellybreath
const snap = await getDocs(collection(db, 'products'));
let found = null;
snap.forEach(d => {
    const data = d.data();
    if (data.name?.toLowerCase().includes('jelly') || data.slug?.toLowerCase().includes('jelly')) {
        found = { id: d.id, ...data };
        console.log('🔍 Encontrado:', d.id, '-', data.name, '| imagen actual:', data.imageUrl);
    }
});

if (found) {
    await updateDoc(doc(db, 'products', found.id), {
        imageUrl: '/products/flores/jellybreath.png',
    });
    console.log('✅ Jellybreath actualizado en Firebase con imagen de flor');
} else {
    console.log('❌ No se encontró Jellybreath en Firebase');
}

process.exit(0);
