import { initializeApp } from 'firebase/app';
import { getFirestore, updateDoc, doc } from 'firebase/firestore';

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

async function updateSlamMichi() {
    console.log("Updating Slam michi (e3VALBWAbGX7062QstE7)...");

    await updateDoc(doc(db, 'products', 'e3VALBWAbGX7062QstE7'), {
        labResults: {
            reportDate: '22-Jan-2026',
            company: 'NEXT HIRE GLOBAL / Valenveras',
            thcTotal: '20.79%',
            thca: '22.72%',
            cbdTotal: '0.2%',
            cbda: '0.2%',
            cbgTotal: '0.5%',
            moisture: '12.7%',
            totalTerpenes: '0.76%',
            terpenesProfile: ['Limonene', 'B-Myrcene', 'Linalool', 'B-Caryophyllene', 'G-elemene', 'A-Humulene', 'Eudesma', 'B-Pinene', 'A-Pinene', 'A-Bisabolol', 'Terpinolene']
        }
    });

    console.log("✅ successfully updated Slam michi");
    process.exit(0);
}

updateSlamMichi().catch(console.error);
