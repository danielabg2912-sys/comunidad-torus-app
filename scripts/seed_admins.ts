import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const admins = [
    {
        name: 'Administrador General',
        email: 'admin@torus.com',
        nito: 'ADMIN-001',
        role: 'admin',
        password: 'password123'
        // No assignedBranch -> Super Admin
    },
    {
        name: 'Admin Del Valle',
        email: 'admin.dv@torus.com',
        nito: 'ADMIN-DV',
        role: 'admin',
        password: 'password123',
        assignedBranch: 'Del Valle'
    },
    {
        name: 'Admin Coyoacán',
        email: 'admin.coy@torus.com',
        nito: 'ADMIN-COY',
        role: 'admin',
        password: 'password123',
        assignedBranch: 'Coyoacán'
    }
];

const seedAdmins = async () => {
    console.log('Starting admin seeding...');

    for (const admin of admins) {
        try {
            console.log(`Processing ${admin.email}...`);

            // 1. Create in Auth
            try {
                await createUserWithEmailAndPassword(auth, admin.email, admin.password);
                console.log('  Created in Auth.');
            } catch (authError: any) {
                if (authError.code === 'auth/email-already-in-use') {
                    console.log('  Already exists in Auth.');
                } else {
                    console.error('  Auth Error:', authError.message);
                }
            }

            // 2. Create/Update in Firestore
            // Remove password from Firestore doc
            const { password, ...firestoreData } = admin;
            await setDoc(doc(db, 'users', admin.email), firestoreData);
            console.log('  Updated in Firestore.');

        } catch (error) {
            console.error(`Error processing ${admin.email}:`, error);
        }
    }

    console.log('------------------------------------------------');
    console.log('Admin seeding complete.');
    console.log('Credentials (password: password123):');
    admins.forEach(a => console.log(`- ${a.email} (${a.assignedBranch || 'Super Admin'})`));
    console.log('------------------------------------------------');
    process.exit(0);
};

seedAdmins();
