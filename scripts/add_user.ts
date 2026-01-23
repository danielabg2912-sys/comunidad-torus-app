import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addUser = async () => {
    console.log('Adding user lbarrios20@gmail.com...');
    try {
        await setDoc(doc(db, 'users', 'lbarrios20@gmail.com'), {
            name: 'Luis Barrios',
            email: 'lbarrios20@gmail.com',
            nito: 'ADMIN-LUIS',
            role: 'admin',
            password: 'password123' // Not used for auth, just for profile ref
        });
        console.log('User added successfully!');
    } catch (error) {
        console.error('Error adding user:', error);
    }
};

addUser();
