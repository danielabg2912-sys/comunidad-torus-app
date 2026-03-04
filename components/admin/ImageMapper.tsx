import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Product } from '../../types';
import { Icon } from '../common/Icon';

const AVAILABLE_IMAGES = [
    'calm-focus.png',
    'digest-well.jpg',
    'gomitas-sensation.png',
    'phytobalance.jpg',
    'tea_pad_01.png',
    'tea_pad_02.png',
    'tea_pad_03.png',
    'tea_pad_04.png',
    'tea_pad_05.png',
    'WhatsApp Image 2026-02-12 at 9.29.38 AM (2).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.38 AM.jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (1).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (10).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (2).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (3).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (4).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (5).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (6).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (7).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (8).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM (9).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.39 AM.jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (1).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (2).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (3).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (4).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (5).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (6).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (7).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (8).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM (9).jpeg',
    'WhatsApp Image 2026-02-12 at 9.29.40 AM.jpeg',
    'WhatsApp Image 2026-02-12 at 9.30.17 AM (1).jpeg',
    'WhatsApp Image 2026-02-12 at 9.30.17 AM (2).jpeg',
    'WhatsApp Image 2026-02-12 at 9.30.17 AM.jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.11 AM (1).jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.11 AM (2).jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.11 AM (3).jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.11 AM.jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.12 AM (1).jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.12 AM (2).jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.12 AM (4).jpeg',
    'WhatsApp Image 2026-02-12 at 9.31.12 AM.jpeg'
];

export const ImageMapper: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const fetchedProducts = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as Product[];
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateImage = async (product: Product, imageName: string) => {
        setSavingId(product.id);
        try {
            const productRef = doc(db, 'products', product.id);
            await updateDoc(productRef, {
                imageUrl: `/products/${imageName}`
            });

            // Update local state
            setProducts(prev => prev.map(p =>
                p.id === product.id
                    ? { ...p, imageUrl: `/products/${imageName}` }
                    : p
            ));
        } catch (error) {
            console.error("Error updating product image:", error);
            alert("Error al actualizar la imagen");
        } finally {
            setSavingId(null);
        }
    };

    const handleAutoAssign = async () => {
        setLoading(true);
        let updatedCount = 0;

        try {
            const updates = products.map(async (product) => {
                // Find matching image
                const normalizedProductName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');

                // Strategy 1: Exact match in filename
                let match = AVAILABLE_IMAGES.find(img =>
                    img.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedProductName) ||
                    normalizedProductName.includes(img.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, ''))
                );

                // Strategy 2: Specific Keywords
                if (!match) {
                    if (product.name.toLowerCase().includes('digest')) match = AVAILABLE_IMAGES.find(img => img.includes('digest'));
                    else if (product.name.toLowerCase().includes('focus')) match = AVAILABLE_IMAGES.find(img => img.includes('focus'));
                    else if (product.name.toLowerCase().includes('sensation')) match = AVAILABLE_IMAGES.find(img => img.includes('sensation'));
                    else if (product.name.toLowerCase().includes('phyto')) match = AVAILABLE_IMAGES.find(img => img.includes('phyto'));
                    else if (product.name.toLowerCase().includes('tea pad')) {
                        // Assign random tea pad image
                        const teaPadImages = AVAILABLE_IMAGES.filter(img => img.includes('tea_pad'));
                        if (teaPadImages.length > 0) {
                            match = teaPadImages[Math.floor(Math.random() * teaPadImages.length)];
                        }
                    }
                }

                if (match && !product.imageUrl) {
                    const productRef = doc(db, 'products', product.id);
                    await updateDoc(productRef, {
                        imageUrl: `/products/${match}`
                    });
                    updatedCount++;
                    return { ...product, imageUrl: `/products/${match}` };
                }
                return product;
            });

            const resolvedProducts = await Promise.all(updates);
            setProducts(resolvedProducts);
            alert(`Se asignaron automáticamente ${updatedCount} imágenes 🎉`);
        } catch (error) {
            console.error("Error auto-assigning images:", error);
            alert("Error al asignar imágenes automáticamente");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 overflow-y-auto">
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 text-white">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Mapeador de Imágenes 📸</h1>
                            <p className="text-slate-400">Asigna imágenes a los productos del catálogo</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleAutoAssign}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/20"
                            >
                                <span className="text-lg">✨</span>
                                <span>Auto-Asignar Sugerencias</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Icon name="x" className="w-5 h-5" />
                                <span>Cerrar</span>
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Product List */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-white">Procesando...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-slate-800 rounded-2xl p-4 flex gap-6 items-start border border-slate-700">
                                    {/* Current Image */}
                                    <div className="w-32 flex-shrink-0">
                                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-700 relative">
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <Icon name="image" className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <span className={`text-[10px] px-2 py-1 rounded-full ${product.imageUrl ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {product.imageUrl ? 'Tiene Imagen' : 'Sin Imagen'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 text-xs">
                                                        {product.category}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 text-xs">
                                                        ${(product as any).price}
                                                    </span>
                                                </div>
                                            </div>
                                            {savingId === product.id && (
                                                <span className="text-purple-400 text-sm animate-pulse">Guardando...</span>
                                            )}
                                        </div>

                                        {/* Image Selector Grid */}
                                        <div className="mt-4">
                                            <p className="text-xs text-slate-400 mb-2">Seleccionar nueva imagen:</p>
                                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 h-40 overflow-y-auto pr-2 custom-scrollbar">
                                                {AVAILABLE_IMAGES.map((imgName) => (
                                                    <button
                                                        key={imgName}
                                                        onClick={() => handleUpdateImage(product, imgName)}
                                                        className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${product.imageUrl === `/products/${imgName}`
                                                            ? 'border-purple-500 ring-2 ring-purple-500/50'
                                                            : 'border-slate-700 hover:border-slate-500'
                                                            }`}
                                                        title={imgName}
                                                    >
                                                        <img
                                                            src={`/products/${imgName}`}
                                                            alt={imgName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                        {product.imageUrl === `/products/${imgName}` && (
                                                            <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                                                <Icon name="check" className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
