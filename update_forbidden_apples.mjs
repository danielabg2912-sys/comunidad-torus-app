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

async function addLabDataToForbiddenApples() {
    const snap = await getDocs(collection(db, 'products'));
    let foundId = null;
    snap.forEach(d => {
        const product = d.data();
        if (product.name && product.name.toLowerCase().includes('forbidden apples')) {
            foundId = d.id;
        }
    });

    if (foundId) {
        console.log(`Found Forbidden Apples with ID: ${foundId}`);
        await updateDoc(doc(db, 'products', foundId), {
            labResults: {
                reportDate: '22-Jan-2026',
                company: 'NEXT HIRE GLOBAL / Valenveras',
                thcTotal: '24%',
                thca: '26.28%',
                cbdTotal: '0.3%',
                cbda: '0.3%',
                cbgTotal: '0.5%',
                moisture: '12.5%',
                totalTerpenes: '1.1%',
                terpenesProfile: [
                    'Limonene',
                    'B-Myrcene',
                    'Linalool',
                    'B-Caryophyllene',
                    'G-elemene',
                    'A-Humulene',
                    'Eudesma',
                    'B-Pinene',
                    'A-Pinene',
                    'A-Bisabolol',
                    'Terpinolene'
                ]
            }
        });
        console.log('Successfully updated Forbidden Apples with lab results.');
    } else {
        console.log('Forbidden Apples not found in DB.');
    }
    process.exit(0);
}

addLabDataToForbiddenApples();
