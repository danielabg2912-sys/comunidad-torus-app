import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { MOCK_USERS, MOCK_PRODUCTS, MOCK_COURSES, INITIAL_SIERRA_ACTIVITIES, MOCK_RESERVATIONS } from '../constants';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const seedDatabase = async () => {
    console.log('Starting database seed...');
    const batch = writeBatch(db);

    // Seed Users
    console.log('Seeding users...');
    for (const user of MOCK_USERS) {
        // Use email as ID for easier lookup
        const userRef = doc(db, 'users', user.email);
        const { password, ...userData } = user;
        batch.set(userRef, userData);
    }

    // Seed Products
    console.log('Seeding products...');
    for (const product of MOCK_PRODUCTS) {
        const productRef = doc(db, 'products', product.id);
        batch.set(productRef, product);
    }

    // Seed Courses
    console.log('Seeding courses...');
    for (const course of MOCK_COURSES) {
        const courseRef = doc(db, 'courses', course.id);
        batch.set(courseRef, course);
    }

    // Seed Sierra Activities
    console.log('Seeding sierra activities...');
    for (const activity of INITIAL_SIERRA_ACTIVITIES) {
        const activityRef = doc(db, 'sierra_activities', activity.id);
        batch.set(activityRef, activity);
    }

    // Seed Reservations
    console.log('Seeding reservations...');
    for (const reservation of MOCK_RESERVATIONS) {
        const reservationRef = doc(db, 'reservations', reservation.id);
        batch.set(reservationRef, reservation);
    }

    try {
        await batch.commit();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// Auto-run if executed directly
seedDatabase();
