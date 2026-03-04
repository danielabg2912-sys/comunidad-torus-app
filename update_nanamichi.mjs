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

async function addLabDataToNanamichi() {
    const snap = await getDocs(collection(db, 'products'));
    let foundId = null;
    snap.forEach(d => {
        const product = d.data();
        if (product.name && product.name.toLowerCase().includes('nanamichi')) {
            foundId = d.id;
        }
    });

    if (foundId) {
        console.log(`Found Nanamichi with ID: ${foundId}`);
        await updateDoc(doc(db, 'products', foundId), {
            labResults: {
                reportDate: '22-Jan-2026',
                company: 'NEXT HIRE GLOBAL / Valenveras',
                thcTotal: '21.17%',
                thca: '23.14%',
                cbdTotal: '0.1%',
                cbda: '0.2%',
                cbgTotal: '0.4%',
                moisture: '12.8%',
                totalTerpenes: '1.09%',
                terpenesProfile: [
                    'B-Myrcene',
                    'Limonene',
                    'Linalool',
                    'A-Pinene',
                    'B-Caryophyllene',
                    'G-elemene',
                    'A-Humulene',
                    'Eudesma',
                    'B-Pinene',
                    'A-Bisabolol',
                    'Terpinolene'
                ]
            }
        });
        console.log('Successfully updated Nanamichi with lab results.');
    } else {
        console.log('Nanamichi not found in DB.');
    }
    process.exit(0);
}

addLabDataToNanamichi();
