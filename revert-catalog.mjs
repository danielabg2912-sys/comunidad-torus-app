// Elimina todos los productos agregados en esta sesión
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

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

const idsToDelete = [
    // 5 productos del inicio de sesión
    '1EPUtwURtzXqBbZZZf6f',
    'uePOAkrCBvlYVBFTKGRZ',
    'wYsc2a1lL61BA7FcOitW',
    'KfBiu239CKyH2aqiWv9J',
    'ekGrMHu0TdGnejBNgynT',
    // 21 productos del PDF BuenFin
    'G3xNvQ4WpSag3n8YzQkq',
    'CkbhkeRbmIHwWCCKMWoO',
    '60gtZ33u61Y1oLCTz1oC',
    'Weic4yr4gMUf4hecWBW8',
    'fm5u5KQWdQHf8lwVJo2B',
    'wnFCo31erJ2ATpVPAmcY',
    'PdYBlbZVqhdrVZFpabif',
    'OZDSyEgdQkfuzgbJsI0n',
    'MhlN0VG86ox73ERMRPqu',
    'B0rl44VhbJl4BNkFFDxv',
    'jMDmG8FtCQOtJrhok3oV',
    'GugsdoBGHJ2GGQekrgvm',
    'XbHAE7Kx7fmYXXeUhX6J',
    '7cc0GNeJ27dE5oOzB0ln',
    'sdTE3LC7ji66guSYcK68',
    'Cs6gpHAZIlaUSeXb9cD2',
    'h9qwiGuZuLEReq3k6atP',
    'HDkbLs2VRyBpdt5A9nwy',
    'X0JdyFMGWSiPKGVgUrNd',
    'R4FVgEmIZYOWKN29AJjs',
    'zsvC8KWOfQzWx4PqIKo2',
];

async function deleteProducts() {
    console.log(`Eliminando ${idsToDelete.length} productos agregados esta sesión...`);
    let deleted = 0;
    let errors = 0;

    for (const id of idsToDelete) {
        try {
            await deleteDoc(doc(db, 'products', id));
            console.log(`✅ Eliminado: ${id}`);
            deleted++;
        } catch (e) {
            console.log(`⚠️  No encontrado o error: ${id}`);
            errors++;
        }
    }

    console.log(`\nListo: ${deleted} eliminados, ${errors} no encontrados`);
    process.exit(0);
}

deleteProducts();
