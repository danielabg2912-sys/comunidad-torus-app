// Script temporal para listar productos de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDNLEv2r7tDQBNLOPPzwEqWuKqTFJbQBxs",
    authDomain: "torus-ac.firebaseapp.com",
    projectId: "torus-ac",
    storageBucket: "torus-ac.firebasestorage.app",
    messagingSenderId: "1036835653030",
    appId: "1:1036835653030:web:6e8e0a7b9e7e7e7e7e7e7e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listProducts() {
    try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const products = [];

        productsSnapshot.forEach((doc) => {
            const data = doc.data();
            products.push({
                id: doc.id,
                name: data.name,
                category: data.category,
                subCategory: data.subCategory || '',
                imageUrl: data.imageUrl || 'NO IMAGE',
                price: data.price || 'NO PRICE'
            });
        });

        console.log('=== PRODUCTOS EN FIREBASE ===');
        console.log(JSON.stringify(products, null, 2));
        console.log(`\nTotal de productos: ${products.length}`);

    } catch (error) {
        console.error('Error:', error);
    }
}

listProducts();
