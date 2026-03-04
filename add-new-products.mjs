// Script para agregar nuevos productos al catálogo de Firebase (sin Storage)
// Las imágenes se sirven localmente desde /products/
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

async function addProducts() {
    console.log('=== Agregando nuevos productos a Firebase ===\n');

    const products = [
        {
            name: 'Digest Well CBD',
            description: 'Aceite CBD Full Spectrum especialmente formulado para apoyar el sistema digestivo. 1000mg de CBD en 20ml. Dosis máxima recomendada: 60 gotas en 24 horas. Agitar suavemente antes de usar.',
            price: 850,
            category: 'CBD',
            subCategory: 'Aceites',
            stock: 20,
            featured: false,
            tags: ['cbd', 'digestivo', 'full spectrum', 'aceite'],
            imageUrl: '/products/digest-well-new.jpg',
        },
        {
            name: 'PhytoBalance CBD',
            description: 'Aceite CBD Full Spectrum para equilibrio y bienestar general. 1000mg de CBD en 20ml. Dosis máxima recomendada: 60 gotas en 24 horas. Agitar suavemente antes de usar.',
            price: 850,
            category: 'CBD',
            subCategory: 'Aceites',
            stock: 20,
            featured: false,
            tags: ['cbd', 'bienestar', 'full spectrum', 'aceite', 'balance'],
            imageUrl: '/products/phytobalance-new.jpg',
        },
        {
            name: 'Cannasex LuV',
            description: 'Lubricante íntimo a base de aceite con MCT oil y CBD Full Spectrum. De uso comestible y tópico. Propiedades afrodisíacas, estimulantes y analgésicas. Aplicar en área genital. 50ml.',
            price: 650,
            category: 'CBD',
            subCategory: 'Tópicos',
            stock: 15,
            featured: false,
            tags: ['cbd', 'lubricante', 'íntimo', 'mct oil', 'afrodisíaco'],
            imageUrl: '/products/cannasex-luv.jpg',
        },
        {
            name: 'Sensation Gomitas Calmantes',
            description: 'Gomitas calmantes de extracto de cáñamo con CBD y Delta 8. Relación 1:1. Contiene CBDA, Delta 8, CBD Broad, CBD FSO y CBN. Nivel de THC: Medio. 32gr (+5 gratis).',
            price: 450,
            category: 'CBD',
            subCategory: 'Comestibles',
            stock: 30,
            featured: false,
            tags: ['cbd', 'delta8', 'gomitas', 'calmante', 'cbda', 'cbn'],
            imageUrl: '/products/sensation-gomitas.jpg',
        },
        {
            name: 'Somnia Gomitas',
            description: 'Gomitas de extracto de cáñamo con CBN y Delta 8. Relación 1:1. Contiene CBDA, D8, CBD, CBD FS y CBN. Especialmente formuladas para apoyar el sueño y el descanso. 32gr (+5 gratis).',
            price: 450,
            category: 'CBD',
            subCategory: 'Comestibles',
            stock: 30,
            featured: false,
            tags: ['cbd', 'delta8', 'cbn', 'gomitas', 'sueño', 'descanso'],
            imageUrl: '/products/somnia-gomitas.jpg',
        }
    ];

    for (const product of products) {
        try {
            console.log(`📦 Agregando: ${product.name}`);
            const docRef = await addDoc(collection(db, 'products'), {
                ...product,
                createdAt: new Date().toISOString(),
            });
            console.log(`  ✅ Creado con ID: ${docRef.id}\n`);
        } catch (error) {
            console.error(`  ❌ Error con ${product.name}:`, error.message);
        }
    }

    console.log('=== Proceso completado ===');
    process.exit(0);
}

addProducts();
