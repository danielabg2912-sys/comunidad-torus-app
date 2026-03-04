// Actualiza el producto Tea Pad con las nuevas imágenes
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const app = initializeApp({
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
});
const db = getFirestore(app);

// Actualizar Tea Pad (PRETP) - imagen principal: los 3 tubos juntos (tea_pad_04)
await updateDoc(doc(db, 'products', 'PRETP'), {
    imageUrl: '/products/tea_pad_04.png',
    gallery: [
        '/products/tea_pad_01.png',
        '/products/tea_pad_02.png',
        '/products/tea_pad_03.png',
        '/products/tea_pad_04.png',
        '/products/tea_pad_05.png',
    ]
});

console.log('✅ Tea Pad actualizado con 5 imágenes nuevas');
console.log('   Imagen principal: tea_pad_04.png (3 tubos)');
process.exit(0);
