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

const happyBitesProducts = [
    {
        name: "Stiizy soda 20mg",
        category: "Comestibles",
        subcategory: "Bebidas",
        brand: "Happy Bites",
        description: "Stiizy soda con 20mg de dosificación.",
        price: 0,
        availability: "Disponible",
        stock: 10,
        imageUrl: ""
    },
    {
        name: "Stiizy elixir 100mg",
        category: "Comestibles",
        subcategory: "Bebidas",
        brand: "Happy Bites",
        description: "Stiizy elixir con 100mg de dosificación.",
        price: 0,
        availability: "Disponible",
        stock: 10,
        imageUrl: ""
    },
    {
        name: "Amigos soda 50mg",
        category: "Comestibles",
        subcategory: "Bebidas",
        brand: "Happy Bites",
        description: "Amigos soda con 50mg de dosificación.",
        price: 0,
        availability: "Disponible",
        stock: 10,
        imageUrl: ""
    },
    {
        name: "Gomitas Aura Plus",
        category: "Comestibles",
        subcategory: "Gomitas",
        brand: "Happy Bites",
        description: "Gomitas Aura Plus.",
        price: 0,
        availability: "Disponible",
        stock: 10,
        imageUrl: ""
    },
    {
        name: "Gomitas Aura",
        category: "Comestibles",
        subcategory: "Gomitas",
        brand: "Happy Bites",
        description: "Gomitas Aura.",
        price: 0,
        availability: "Disponible",
        stock: 10,
        imageUrl: ""
    }
];

async function addProducts() {
    console.log('⏳ Agregando productos Happy Bites a Firebase...');
    for (const product of happyBitesProducts) {
        try {
            const docRef = await addDoc(collection(db, 'products'), product);
            console.log(`✅ Agregado: ${product.name} (ID: ${docRef.id})`);
        } catch (e) {
            console.error(`❌ Error al agregar ${product.name}:`, e);
        }
    }
    console.log('🎉 Terminado!');
    process.exit(0);
}

addProducts();
