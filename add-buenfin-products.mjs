// Copia imágenes con nombres propios y agrega todos los productos del BuenFin a Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const pngDir = join(__dirname, 'public/products/buenfin-png');
const prodDir = join(__dirname, 'public/products');

// Mapa: archivo_ok.png → nombre limpio en /products/
const imageCopyMap = {
    'imagen_003_ok.png': 'panke-televes-150mg.png',
    'imagen_004_ok.png': 'volagomas-250mg.png',
    'imagen_005_ok.png': 'chocochips-150mg.png',
    'imagen_008_ok.png': 'zen-dc-500mg.png',
    'imagen_009_ok.png': 'flow-dc-rosa.png',
    'imagen_010_ok.png': 'flow-dc-negro.png',
    'imagen_011_ok.png': 'aceite-dc-organico.png',
    'imagen_014_ok.png': 'energy-slim-cbd-20ml.png',
    'imagen_015_ok.png': 'unguento-salud-esencial-100mg.png',
    'imagen_016_ok.png': 'cannasex-luv-acostado.png',
    'imagen_017_ok.png': '4pets-cbd-20ml.png',
    'imagen_018_ok.png': 'digest-well-broad-20ml.png',
    'imagen_021_ok.png': 'high-balance-30ml.png',
    'imagen_022_ok.png': 'high-dreams-30ml.png',
    'imagen_023_ok.png': 'high-high-30ml.png',
    'imagen_024_ok.png': 'high-therapy-30ml.png',
    'imagen_027_ok.png': 'mag-x-natural-wraps.png',
    'imagen_028_ok.png': 'jabon-artesanal-cbd.png',
    'imagen_031_ok.png': 'serenity-vet-drops.png',
    'imagen_032_ok.png': 'bucket-hat-holograma-raton.png',
    'imagen_033_ok.png': 'bucket-hat-holograma-tortuga.png',
};

// Copiar imágenes a /products/
console.log('=== Copiando imágenes ===');
for (const [src, dst] of Object.entries(imageCopyMap)) {
    const srcPath = join(pngDir, src);
    const dstPath = join(prodDir, dst);
    if (existsSync(srcPath)) {
        copyFileSync(srcPath, dstPath);
        console.log(`✅ ${dst}`);
    } else {
        console.log(`⚠️  No encontrado: ${src}`);
    }
}

// Datos de los productos
const products = [
    {
        name: 'Panke Televes 150mg',
        description: 'Panque artesanal de La Voladura con 150mg de FECO. Ingredientes: Harina, cocoa, chocolate amargo 70% cacao, mantequilla, vainilla, azúcar, huevo. Una delicia cannábica horneada con amor.',
        price: 180,
        category: 'Comestibles',
        subCategory: 'Repostería',
        stock: 20,
        featured: false,
        tags: ['comestible', 'panque', 'feco', 'la voladura', '150mg'],
        imageUrl: '/products/panke-televes-150mg.png',
        brand: 'La Voladura',
    },
    {
        name: 'Volagomas 250mg',
        description: 'Gomitas en lata de La Voladura con 250mg totales. 20 piezas de 12.5mg cada una. Ingredientes: Grenetina, glucosa, sacarosa, FECO, lecitina de soya, saborizante, colorante artificial, aceite de coco, ácido cítrico y sorbato de potasio.',
        price: 250,
        category: 'Comestibles',
        subCategory: 'Gomitas',
        stock: 25,
        featured: false,
        tags: ['comestible', 'gomitas', 'feco', 'la voladura', '250mg'],
        imageUrl: '/products/volagomas-250mg.png',
        brand: 'La Voladura',
    },
    {
        name: 'Chocochips 150mg',
        description: 'Galletas chocochips artesanales de La Voladura. 150mg totales – 3 piezas de 50mg cada una. Ingredientes: Harina de trigo, mantequilla, huevo, azúcar mascabado, chocolate 70% cacao y FECO.',
        price: 160,
        category: 'Comestibles',
        subCategory: 'Repostería',
        stock: 20,
        featured: false,
        tags: ['comestible', 'galletas', 'chocochips', 'feco', 'la voladura', '150mg'],
        imageUrl: '/products/chocochips-150mg.png',
        brand: 'La Voladura',
    },
    {
        name: 'Zen DC 500mg',
        description: 'Bolsa de terciopelo roja con cannabis organics artesanal Zen DC by Torus. 500mg. Un producto premium para la calma y el bienestar mental.',
        price: 650,
        category: 'CBD',
        subCategory: 'Flores',
        stock: 15,
        featured: false,
        tags: ['zen', 'dc', 'torus', 'organico', 'artesanal', '500mg'],
        imageUrl: '/products/zen-dc-500mg.png',
        brand: 'Torus',
    },
    {
        name: 'Flow DC Lata Rosa',
        description: 'Cannabis organics artesanal Flow DC by Torus en presentación lata rosa. Mezcla especial para el flujo creativo y bienestar diario.',
        price: 450,
        category: 'CBD',
        subCategory: 'Flores',
        stock: 15,
        featured: false,
        tags: ['flow', 'dc', 'torus', 'organico', 'artesanal'],
        imageUrl: '/products/flow-dc-rosa.png',
        brand: 'Torus',
    },
    {
        name: 'Flow DC Lata Negra',
        description: 'Cannabis organics artesanal Flow DC by Torus en presentación lata negra. Mezcla especial para el flujo creativo y bienestar diario.',
        price: 450,
        category: 'CBD',
        subCategory: 'Flores',
        stock: 15,
        featured: false,
        tags: ['flow', 'dc', 'torus', 'organico', 'artesanal'],
        imageUrl: '/products/flow-dc-negro.png',
        brand: 'Torus',
    },
    {
        name: 'Aceite DC Orgánico',
        description: 'Aceite DC orgánico artesanal by Torus. Full Spectrum / Rosin / FS Descarboxilado. 3ml. Producto artesanal de alta calidad para un bienestar integral.',
        price: 380,
        category: 'CBD',
        subCategory: 'Aceites',
        stock: 10,
        featured: false,
        tags: ['aceite', 'dc', 'organico', 'torus', 'full spectrum', 'rosin', '3ml'],
        imageUrl: '/products/aceite-dc-organico.png',
        brand: 'Torus',
    },
    {
        name: 'Energy & Slim CBD 20ml',
        description: 'Aceite CBD Aislado de Salud Esencial. Línea Energy & Slim. 20ml. Formulado para apoyar el metabolismo y los niveles de energía diarios.',
        price: 750,
        category: 'CBD',
        subCategory: 'Aceites',
        stock: 20,
        featured: false,
        tags: ['cbd', 'aislado', 'salud esencial', 'energy', 'slim', '20ml'],
        imageUrl: '/products/energy-slim-cbd-20ml.png',
        brand: 'Salud Esencial',
    },
    {
        name: 'Ungüento Salud Esencial 100mg',
        description: 'Ungüento tópico de Salud Esencial con 100mg de CBD. En presentación en frasco de vidrio. Ideal para aplicación localizada en zonas de tensión o malestar.',
        price: 320,
        category: 'CBD',
        subCategory: 'Tópicos',
        stock: 15,
        featured: false,
        tags: ['cbd', 'topico', 'unguento', 'salud esencial', '100mg'],
        imageUrl: '/products/unguento-salud-esencial-100mg.png',
        brand: 'Salud Esencial',
    },
    {
        name: 'Cannasex LuV 50ml',
        description: 'Lubricante íntimo Cannasex LuV de Salud Esencial. A base de aceite, uso comestible y tópico. Con MCT oil y CBD Full Spectrum. 50ml. Propiedades afrodisíacas y estimulantes.',
        price: 650,
        category: 'CBD',
        subCategory: 'Tópicos',
        stock: 15,
        featured: false,
        tags: ['cbd', 'lubricante', 'intimo', 'salud esencial', 'mct oil', '50ml'],
        imageUrl: '/products/cannasex-luv-acostado.png',
        brand: 'Salud Esencial',
    },
    {
        name: '4Pets CBD 20ml',
        description: 'Aceite CBD Aislado de Salud Esencial especialmente formulado para mascotas. 20ml. Ayuda a calmar la ansiedad y mejorar el bienestar de tus animales.',
        price: 580,
        category: 'CBD',
        subCategory: 'Mascotas',
        stock: 15,
        featured: false,
        tags: ['cbd', 'mascotas', 'pets', 'salud esencial', 'aislado', '20ml'],
        imageUrl: '/products/4pets-cbd-20ml.png',
        brand: 'Salud Esencial',
    },
    {
        name: 'Digest Well CBD Broad 20ml',
        description: 'Aceite CBD Broad Spectrum de Salud Esencial para el sistema digestivo. 20ml. Formulado para aliviar malestares digestivos y mejorar la absorción de nutrientes.',
        price: 850,
        category: 'CBD',
        subCategory: 'Aceites',
        stock: 20,
        featured: false,
        tags: ['cbd', 'broad spectrum', 'digestivo', 'salud esencial', '20ml'],
        imageUrl: '/products/digest-well-broad-20ml.png',
        brand: 'Salud Esencial',
    },
    {
        name: 'High Balance Natural Energy 30ml',
        description: 'Aceite Natural Energy de High Balance. 30ml. Formulado para mejorar los niveles de energía con ingredientes naturales y cannabinoides.',
        price: 520,
        category: 'CBD',
        subCategory: 'Aceites',
        stock: 10,
        featured: false,
        tags: ['cbd', 'energia', 'high balance', 'natural', '30ml'],
        imageUrl: '/products/high-balance-30ml.png',
        brand: 'High Balance',
    },
    {
        name: 'High Dreams Natural Sleep 30ml',
        description: 'Aceite Natural Sleep de High Dreams. 30ml. Formulado para mejorar la calidad del sueño de forma natural con cannabinoides.',
        price: 520,
        category: 'CBD',
        subCategory: 'Aceites',
        stock: 10,
        featured: false,
        tags: ['cbd', 'sueño', 'high dreams', 'natural', '30ml'],
        imageUrl: '/products/high-dreams-30ml.png',
        brand: 'High Balance',
    },
    {
        name: 'High High Natural Relief 30ml',
        description: 'Aceite Natural Relief de High High. 30ml. Formulado para el alivio natural de dolores y malestares cotidianos con cannabinoides.',
        price: 520,
        category: 'CBD',
        subCategory: 'Aceites',
        stock: 10,
        featured: false,
        tags: ['cbd', 'alivio', 'dolor', 'high high', 'natural', '30ml'],
        imageUrl: '/products/high-high-30ml.png',
        brand: 'High Balance',
    },
    {
        name: 'High Therapy Natural Relief 30ml',
        description: 'Aceite Natural Relief de High Therapy. 30ml. Formulado para terapia de alivio profundo con cannabinoides de alta calidad.',
        price: 520,
        category: 'CBD',
        subCategory: 'Aceites',
        stock: 10,
        featured: false,
        tags: ['cbd', 'terapia', 'alivio', 'high therapy', 'natural', '30ml'],
        imageUrl: '/products/high-therapy-30ml.png',
        brand: 'High Balance',
    },
    {
        name: 'MAG-X Natural Roots Wraps',
        description: 'Wraps MAG-X Natural Roots de 100% Cáñamo. 4 wraps por empaque. Papeles de liar naturales y orgánicos para una experiencia pura y limpia.',
        price: 120,
        category: 'Accesorios',
        subCategory: 'Papeles',
        stock: 50,
        featured: false,
        tags: ['wraps', 'hemp', 'canamo', 'natural', 'papers', 'mag-x'],
        imageUrl: '/products/mag-x-natural-wraps.png',
        brand: 'MAG-X',
    },
    {
        name: 'Jabón Artesanal CBD',
        description: 'Jabón artesanal con CBD. Elaborado con ingredientes naturales y extracto de cáñamo. Hidratante y antioxidante para el cuidado diario de la piel.',
        price: 180,
        category: 'Cuidado Personal',
        subCategory: 'Jabones',
        stock: 20,
        featured: false,
        tags: ['cbd', 'jabon', 'artesanal', 'natural', 'piel'],
        imageUrl: '/products/jabon-artesanal-cbd.png',
    },
    {
        name: 'Serenity Vet CBD Full Spectrum',
        description: 'CBD Full Spectrum para veterinaria (Serenity Vet). Presentación en dos tamaños. Medicina holística veterinaria para el bienestar de las mascotas.',
        price: 680,
        category: 'CBD',
        subCategory: 'Mascotas',
        stock: 10,
        featured: false,
        tags: ['cbd', 'full spectrum', 'mascotas', 'veterinaria', 'serenity vet'],
        imageUrl: '/products/serenity-vet-drops.png',
        brand: 'Serenity Vet',
    },
    {
        name: 'Bucket Hat Holográfico Ratón',
        description: 'Bucket hat holográfico con parche bordado de ratón. Material holográfico iridiscente de alta calidad. Accesorio fashion y llamativo para cualquier ocasión.',
        price: 350,
        category: 'Accesorios',
        subCategory: 'Ropa y Sombreros',
        stock: 10,
        featured: false,
        tags: ['sombrero', 'bucket hat', 'holograma', 'raton', 'moda'],
        imageUrl: '/products/bucket-hat-holograma-raton.png',
    },
    {
        name: 'Bucket Hat Holográfico Tortuga',
        description: 'Bucket hat holográfico con parche bordado de tortuga. Material holográfico iridiscente de alta calidad. Accesorio fashion y llamativo para cualquier ocasión.',
        price: 350,
        category: 'Accesorios',
        subCategory: 'Ropa y Sombreros',
        stock: 10,
        featured: false,
        tags: ['sombrero', 'bucket hat', 'holograma', 'tortuga', 'moda'],
        imageUrl: '/products/bucket-hat-holograma-tortuga.png',
    },
];

async function uploadProducts() {
    console.log('\n=== Subiendo productos a Firebase ===\n');
    let added = 0;

    for (const product of products) {
        try {
            const docRef = await addDoc(collection(db, 'products'), {
                ...product,
                createdAt: new Date().toISOString(),
            });
            console.log(`✅ ${product.name} → ID: ${docRef.id}`);
            added++;
        } catch (err) {
            console.error(`❌ ${product.name}: ${err.message}`);
        }
    }

    console.log(`\n=== Listo! ${added}/${products.length} productos agregados ===`);
    process.exit(0);
}

uploadProducts();
