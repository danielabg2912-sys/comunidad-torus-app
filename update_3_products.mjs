import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

const LAB_DATA = {
    'strawberry og': {
        thcTotal: '18.23%', thca: '19.88%', cbdTotal: '0.2%', cbda: '0.3%',
        cbgTotal: '0.4%', moisture: '12.6%', totalTerpenes: '1.01%'
    },
    'gelato': {
        thcTotal: '20.35%', thca: '22.32%', cbdTotal: '0.3%', cbda: '0%',
        cbgTotal: '0.4%', moisture: '12.9%', totalTerpenes: '1.24%'
    },
    'slam michigan': {
        thcTotal: '20.79%', thca: '22.72%', cbdTotal: '0.2%', cbda: '0.2%',
        cbgTotal: '0.5%', moisture: '12.7%', totalTerpenes: '0.76%'
    }
};

const terpenesList = [
    'B-Myrcene', 'Limonene', 'Linalool', 'B-Caryophyllene', 'G-elemene',
    'A-Humulene', 'Eudesma', 'B-Pinene', 'A-Pinene', 'A-Bisabolol', 'Terpinolene'
];

async function updateAllProducts() {
    console.log("Fetching products...");
    const snap = await getDocs(collection(db, 'products'));

    for (const d of snap.docs) {
        const product = d.data();
        if (!product.name) continue;

        const nameLower = product.name.toLowerCase();
        let targetKey = null;

        if (nameLower.includes('strawberry og')) targetKey = 'strawberry og';
        else if (nameLower.includes('gelato')) targetKey = 'gelato';
        else if (nameLower.includes('slam michigan')) targetKey = 'slam michigan';

        if (targetKey) {
            console.log(`Updating ${product.name} (${targetKey})...`);
            await updateDoc(doc(db, 'products', d.id), {
                labResults: {
                    reportDate: '22-Jan-2026',
                    company: 'NEXT HIRE GLOBAL / Valenveras',
                    terpenesProfile: targetKey === 'gelato' ? ['B-Myrcene', 'Limonene', 'Linalool', 'B-Caryophyllene', 'G-elemene', 'A-Humulene', 'Eudesma', 'B-Pinene', 'A-Pinene', 'A-Bisabolol', 'Terpinolene'] : terpenesList,
                    ...LAB_DATA[targetKey]
                }
            });
            console.log(`✅ successfully updated ${product.name}`);
        }
    }

    console.log("All done!");
    process.exit(0);
}

updateAllProducts().catch(console.error);
