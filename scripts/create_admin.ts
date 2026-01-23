import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const createAdminUser = async () => {
    const email = 'admin@torus.com';
    const password = 'password123';
    const userData = {
        name: 'Administrador',
        email: email,
        nito: 'ADMIN-001',
        role: 'admin',
    };

    try {
        console.log(`Creating user ${email}...`);
        // 1. Create in Auth
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('User created in Firebase Auth.');
        } catch (authError: any) {
            if (authError.code === 'auth/email-already-in-use') {
                console.log('User already exists in Auth, proceeding to update Firestore...');
            } else {
                throw authError;
            }
        }

        // 2. Create/Update in Firestore
        await setDoc(doc(db, 'users', email), userData);
        console.log('User document created/updated in Firestore.');

        console.log('------------------------------------------------');
        console.log('SUCCESS! Admin user ready.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdminUser();
