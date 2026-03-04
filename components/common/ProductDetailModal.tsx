import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../../types';
import { Icon } from './Icon';
import { Button } from './Button';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
    if (!isOpen || !product) return null;

    const [mounted, setMounted] = useState(false);
    const [selectedOptionIdx, setSelectedOptionIdx] = useState<number>(0);
    const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

    // Reset selection when modal opens or product changes
    useEffect(() => {
        if (isOpen && product) {
            setSelectedOptionIdx(0);
            setActiveImageIdx(0);
        }
    }, [isOpen, product]);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Build gallery: [imageUrl, ...images]
    const galleryImages = product
        ? [product.imageUrl, ...(product.images || [])].filter(Boolean)
        : [];
    const activeImage = product?.options?.[selectedOptionIdx]?.imageUrl
        || galleryImages[activeImageIdx]
        || '';

    const checkAvailability = (branch: 'Del Valle' | 'Coyoacán') => {
        if (!product.availability) return false;
        if (typeof product.availability === 'object') {
            return (product.availability[branch] || 0) > 0;
        }
        return String(product.availability).toLowerCase() === 'disponible';
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden animate-in zoom-in-95 duration-300">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all hover:scale-110"
                    >
                        <Icon name="x" className="w-5 h-5 text-slate-600" />
                    </button>

                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative bg-slate-100 flex flex-col">
                            {/* Main Image */}
                            <div className="relative aspect-[4/3] md:aspect-auto flex-1">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain object-center mix-blend-multiply"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon name="image" className="w-20 h-20 text-slate-300" />
                                    </div>
                                )}
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail Gallery — only when multiple images exist */}
                            {galleryImages.length > 1 && !product.options?.length && (
                                <div className="flex gap-2 p-3 bg-white border-t border-slate-100 overflow-x-auto">
                                    {galleryImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIdx(idx)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImageIdx === idx
                                                ? 'border-emerald-500 shadow-md scale-105'
                                                : 'border-slate-200 hover:border-emerald-300 opacity-70 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-contain bg-white" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Content Section */}
                        <div className="p-8 flex flex-col">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                    {product.name}
                                </h2>

                                {product.subCategory && (
                                    <p className="text-emerald-600 font-medium mb-4">{product.subCategory}</p>
                                )}

                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {product.description}
                                </p>

                                {/* Product Options (Variations) */}
                                {product.options && product.options.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                                            Presentación
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {product.options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedOptionIdx(idx)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${selectedOptionIdx === idx
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {option.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Properties */}
                                {product.properties && typeof product.properties === 'string' && product.properties.trim().length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                                            Propiedades
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.properties.split(',').map((prop, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
                                                >
                                                    {prop.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Availability */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                                        Disponibilidad
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                            <div className="flex items-center gap-2">
                                                <Icon name="map-pin" className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium text-slate-700">Del Valle</span>
                                            </div>
                                            {checkAvailability('Del Valle') ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                    Disponible
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-semibold text-sm">Agotado</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                            <div className="flex items-center gap-2">
                                                <Icon name="map-pin" className="w-4 h-4 text-slate-400" />
                                                <span className="font-medium text-slate-700">Coyoacán</span>
                                            </div>
                                            {checkAvailability('Coyoacán') ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                    Disponible
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-semibold text-sm">Agotado</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <Button
                                    onClick={onClose}
                                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-lg transition-all"
                                >
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return mounted ? createPortal(modalContent, document.body) : null;
};
