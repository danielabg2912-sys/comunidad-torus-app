// Asigna las fotos clasificadas a los productos de flores en Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const app = initializeApp({
    apiKey: "AIzaSyB_HMNmlKGAj1fcVkSZGn7qyOZYiuGSfZI",
    authDomain: "comunidad-torus-app.firebaseapp.com",
    projectId: "comunidad-torus-app",
    storageBucket: "comunidad-torus-app.firebasestorage.app",
    messagingSenderId: "1039974047446",
    appId: "1:1039974047446:web:fe5eb331d719ea9dd1b377"
});
const db = getFirestore(app);

// Fotos exterior (buds sueltos, pistillos naranjas, luz solar)
const exteriorPhotos = [
    '/products/flores/exterior/image00004.jpg',
    '/products/flores/exterior/image00008.jpg',
    '/products/flores/exterior/image00019.jpg',
    '/products/flores/exterior/image00040.jpg',
    '/products/flores/exterior/image00043.jpg',
    '/products/flores/exterior/image00055.jpg',
    '/products/flores/exterior/image00059.jpg',
    '/products/flores/exterior/image00060.jpg',
    '/products/flores/exterior/image00071.jpg',
    '/products/flores/exterior/image00073.jpg',
];

// Fotos interior (buds densos, tricomas brillantes, uniforme)
const interiorPhotos = [
    '/products/flores/interior/image00036.jpg',
    '/products/flores/interior/image00047.jpg',
    '/products/flores/interior/image00051.jpg',
    '/products/flores/interior/image00066.jpg',
    '/products/flores/interior/image00069.jpg',
];

// Fotos invernadero (tonos púrpura, buds densos controlados)
const invernaderoPhotos = [
    '/products/flores/invernadero/image00012.jpg',
    '/products/flores/invernadero/image00030.jpg',
    '/products/flores/invernadero/image00064.jpg',
];

// Leer todos los productos
const snap = await getDocs(collection(db, 'products'));
const products = [];
snap.forEach(d => products.push({ id: d.id, ...d.data() }));

// Clasificar por categoría/subCategory
const exterior = products.filter(p =>
    p.subCategory === 'Exterior' || (p.id && p.id.startsWith('INT'))
);
const interior = products.filter(p =>
    p.subCategory === 'Interior' || (p.id && p.id.startsWith('INV'))
);

console.log(`Productos exterior encontrados: ${exterior.length}`);
console.log(`Productos interior/invernadero encontrados: ${interior.length}`);

// Asignar imágenes rotando por el array disponible
let extIdx = 0;
let intIdx = 0;

for (const p of exterior) {
    const img = exteriorPhotos[extIdx % exteriorPhotos.length];
    await updateDoc(doc(db, 'products', p.id), {
        imageUrl: img,
        gallery: [img]
    });
    console.log(`✅ EXTERIOR ${p.id} "${p.name}" → ${img}`);
    extIdx++;
}

// Para interior: primeras INV con invernadero, luego el resto con interior
let invIdx = 0;
for (const p of interior) {
    const isInvId = p.id && p.id.startsWith('INV');
    let img;
    if (isInvId && invIdx < invernaderoPhotos.length) {
        img = invernaderoPhotos[invIdx % invernaderoPhotos.length];
        invIdx++;
    } else {
        img = interiorPhotos[intIdx % interiorPhotos.length];
        intIdx++;
    }
    await updateDoc(doc(db, 'products', p.id), {
        imageUrl: img,
        gallery: [img]
    });
    console.log(`✅ INTERIOR/INV ${p.id} "${p.name}" → ${img}`);
}

console.log('\n¡Listo! Todas las fotos asignadas a flores existentes.');
process.exit(0);
