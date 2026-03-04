import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { Icon } from './common/Icon';
import { ProductDetailModal } from './common/ProductDetailModal';

// Category display mapping for a fun, engaging UI
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'Flores Interior': 'Indoor Premium',
  'Flores Invernadero': 'Invernadero Flow',
  'Flores Exterior': 'Pura Tierra',
  'CBD & Bienestar': 'Cero High, Puro Chill',
  'Comestibles': 'Para el Munchies',
  'Extractos': 'Un Toque Extra',
  'Parafernalia': 'Tus Herramientas de Vuelo',
  'Prerolados': 'Llegar y Prender',
  'Todas': 'Todas las categorías'
};

const getCategoryDisplayName = (category: string) => {
  return CATEGORY_DISPLAY_NAMES[category] || category;
};

interface MenuViewProps {
  products: Product[];
  categories: string[];
}

const ProductCard: React.FC<{ product: Product; onViewDetails: () => void }> = ({ product, onViewDetails }) => {
  const isAvailableAnywhere = (product.availability?.['Del Valle'] ?? 0) > 0 || (product.availability?.['Coyoacán'] ?? 0) > 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-2 border border-slate-100">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain object-center mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="image" className="w-16 h-16 text-slate-300" />
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailableAnywhere ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Disponible
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
              Agotado
            </span>
          )}
        </div>

        {/* Promotion Badge */}
        {product.promotion?.isActive && product.promotion?.discount && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-slate-900 px-3 py-1.5 rounded-lg font-black text-sm shadow-lg">
            -{product.promotion.discount}% OFF
          </div>
        )}

        {/* Category Badge — always bottom-left so it never overlaps with availability badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold shadow-md max-w-[150px] truncate block" title={getCategoryDisplayName(product.category)}>
            {getCategoryDisplayName(product.category)}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <button
            onClick={onViewDetails}
            className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-emerald-500 hover:text-white"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">{product.brand}</p>
        )}

        {product.subCategory && (
          <p className="text-sm text-emerald-600 font-medium mb-3">{product.subCategory}</p>
        )}

        {/* Options Inline Badge */}
        {product.options && product.options.length > 0 && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
              <Icon name="layers" className="w-3.5 h-3.5" />
              {product.options.length} Presentaciones
            </span>
          </div>
        )}

        {/* Properties Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(product.properties || '').split(',').filter(p => p.trim()).slice(0, 3).map((prop, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
            >
              {prop.trim()}
            </span>
          ))}
        </div>

        {/* Branch Availability */}
        {product.availability && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Icon name="map-pin" className="w-3 h-3 text-slate-400" />
              <span className={`font - medium ${(product.availability?.['Del Valle'] ?? 0) > 0 ? 'text-emerald-600' : 'text-slate-400'} `}>
                Del Valle
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="map-pin" className="w-3 h-3 text-slate-400" />
              <span className={`font - medium ${(product.availability?.['Coyoacán'] ?? 0) > 0 ? 'text-emerald-600' : 'text-slate-400'} `}>
                Coyoacán
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Mini card for horizontal scroll sections
const MiniProductCard: React.FC<{ product: Product; onViewDetails: () => void; badge?: React.ReactNode }> = ({ product, onViewDetails, badge }) => {
  return (
    <div
      onClick={onViewDetails}
      className="flex-shrink-0 w-52 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-slate-100 group snap-start"
    >
      <div className="relative h-40 overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain object-center mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="image" className="w-12 h-12 text-slate-300" />
          </div>
        )}
        {badge && <div className="absolute top-2 left-2">{badge}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-3">
        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
          {product.name}
        </h4>
        {product.brand && (
          <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide">{product.brand}</p>
        )}
        <div className="mt-2 flex">
          <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] rounded-full font-bold truncate max-w-full" title={getCategoryDisplayName(product.category)}>
            {getCategoryDisplayName(product.category)}
          </span>
        </div>
      </div>
    </div>
  );
};

const MenuView: React.FC<MenuViewProps> = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Use IntersectionObserver instead of scroll events because it is 100% bulletproof
  // across all mobile browsers regardless of which internal div is actually scrolling.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the top anchor is NOT intersecting (visible), it means we have scrolled down!
        setShowScrollTop(!entry.isIntersecting);
      },
      {
        root: null, // observe relative to viewport
        threshold: 0, // trigger as soon as 1 pixel is out of view
      }
    );

    const target = document.getElementById('top-intersect-anchor');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // Custom category ordering
  const explicitOrder = ['Flores Interior', 'Flores Invernadero', 'Flores Exterior'];
  const remainingCategories = categories.filter(cat => !explicitOrder.includes(cat)).sort();
  const orderedCategories = ['Todas', ...explicitOrder.filter(cat => categories.includes(cat)), ...remainingCategories];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get products with active promotions
  const promotionalProducts = products.filter(product => product.promotion?.isActive);

  // Get bestseller products
  const bestsellerProducts = products.filter(product => product.isBestseller);

  // Get new products
  const newProducts = products.filter(product => product.isNew);

  const isSearchActive = searchQuery.length > 0 || selectedCategory !== 'Todas';

  return (
    <>
      <div className="max-w-7xl mx-auto pb-20 relative">
        {/* Invisible anchor for IntersectionObserver to know when we are at the top */}
        <div id="top-intersect-anchor" className="absolute top-0 left-0 w-full h-[400px] pointer-events-none -z-10 opacity-0" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Catálogo</h1>
          <p className="text-slate-600">Explora nuestra selección de productos premium</p>
        </div>

        {/* Search Bar - Prominent at top */}
        <div className="relative w-full mb-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Icon name="search" className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-5 py-4 border-2 border-slate-200 rounded-2xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out shadow-sm text-base"
            placeholder="🔍 Buscar por nombre, marca o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Show curated sections only when not filtering */}
        {!isSearchActive && (
          <>
            {/* Promotions Section */}
            {(promotionalProducts.length > 0) && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    Promociones
                  </h2>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                    {promotionalProducts.length + 1} {promotionalProducts.length === 0 ? 'oferta' : 'ofertas'}
                  </span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {/* Birthday Promotion - Always Visible */}
                  <div
                    onClick={() => {
                      const modal = document.createElement('div');
                      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm';
                      modal.innerHTML = `
  < div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto" >
                          <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                              🎂 Promoción Cumpleañera
                            </h2>
                            <button onclick="this.closest('.fixed').remove()" class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                          
                          <div class="space-y-6">
                            <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                              <h3 class="font-bold text-purple-900 mb-2">Descuento del 10% en Retiros de Cosecha</h3>
                            </div>

                            <div>
                              <h4 class="font-bold text-slate-900 mb-3">Cómo obtenerlo:</h4>
                              <p class="text-slate-600">Presenta tu INE para verificar tu fecha de nacimiento.</p>
                            </div>

                            <div>
                              <h4 class="font-bold text-slate-900 mb-3">Condiciones:</h4>
                              <p class="text-slate-600">Aplica únicamente una vez durante el mes de tu cumpleaños.</p>
                            </div>

                            <div>
                              <h4 class="font-bold text-slate-900 mb-3">Términos y Condiciones:</h4>
                              <ol class="list-decimal list-inside space-y-2 text-slate-600">
                                <li>La promoción es válida solo durante el mes de tu cumpleaños.</li>
                                <li>Es necesario presentar tu INE para verificar la fecha de nacimiento.</li>
                                <li>El descuento del 10% aplica solo una vez y únicamente en retiros de cosecha.</li>
                                <li>No acumulable con otras promociones.</li>
                                <li>No aplicable en compras anteriores o futuras fuera del mes de cumpleaños.</li>
                              </ol>
                            </div>

                            <button onclick="this.closest('.fixed').remove()" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg transition-colors">
                              Entendido
                            </button>
                          </div>
                        </div >
  `;
                      document.body.appendChild(modal);
                      modal.addEventListener('click', (e) => {
                        if (e.target === modal) modal.remove();
                      });
                    }}
                    className="flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 snap-start group cursor-pointer px-6 py-3.5 flex items-center gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">🎂</div>
                      <div className="h-8 w-px bg-white/30"></div>
                    </div>
                    <div className="flex-1 text-white">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-bold">Promoción Cumpleañera</h3>
                        <div className="bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full text-[9px] font-black">
                          PERMANENTE
                        </div>
                      </div>
                      <p className="text-white/90 text-xs">10% OFF en retiros de cosecha</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-black text-white/90">10%</div>
                      <Icon name="arrow-right" className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Product Promotions */}
                  {promotionalProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="flex-shrink-0 w-80 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 snap-start group"
                    >
                      <div className="relative h-48">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-red-400">
                            <Icon name="image" className="w-16 h-16 text-white/50" />
                          </div>
                        )}

                        {product.promotion?.discount && (
                          <div className="absolute top-3 right-3 bg-yellow-400 text-slate-900 px-4 py-2 rounded-xl font-black text-lg shadow-lg rotate-3 transform">
                            -{product.promotion.discount}%
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>

                      <div className="p-5 text-white">
                        <h3 className="text-xl font-bold mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        {product.promotion?.description && (
                          <p className="text-white/90 text-sm mb-3 line-clamp-2">
                            {product.promotion.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {product.category}
                          </span>
                          <span className="text-sm font-bold flex items-center gap-1">
                            Ver oferta
                            <Icon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lo Más Vendido Section */}
            {bestsellerProducts.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    Lo más vendido
                  </h2>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                    {bestsellerProducts.length} {bestsellerProducts.length === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {bestsellerProducts.map(product => (
                    <MiniProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={() => setSelectedProduct(product)}
                      badge={
                        <span className="px-2 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded-lg shadow">
                          ⭐ Top
                        </span>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Lo Nuevo Section */}
            {newProducts.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    Lo nuevo
                  </h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                    {newProducts.length} {newProducts.length === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {newProducts.map(product => (
                    <MiniProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={() => setSelectedProduct(product)}
                      badge={
                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-black rounded-lg shadow">
                          ✨ Nuevo
                        </span>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Filters Section */}
        <div className="sticky top-16 z-30 bg-[#F5F7FA]/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 bg-white rounded-xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="menu" className="w-5 h-5 text-emerald-600" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full bg-transparent text-slate-700 font-bold py-3.5 pl-12 pr-10 rounded-xl focus:outline-none cursor-pointer"
              >
                {orderedCategories.map(category => (
                  <option key={category} value={category} className="font-semibold text-slate-700">
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                <Icon name="chevron-down" className="w-5 h-5" />
              </div>
            </div>

            {/* Results Counter */}
            <div className="hidden sm:block px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-600 whitespace-nowrap">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="search" className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No encontramos productos</h3>
            <p className="text-slate-500 mb-6">Intenta con otra búsqueda o categoría</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todas') }}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      {/* Scroll Buttons Widget */}
      <div className={`fixed bottom-28 right-6 md:right-8 z-40 flex flex-col gap-2 transition-all duration-500 ${showScrollTop ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
          aria-label="Subir"
          title="Ir arriba"
        >
          <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        <button
          onClick={scrollToBottom}
          className="p-3 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
          aria-label="Bajar"
          title="Ir abajo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default MenuView;