import React, { useState } from 'react';
import { Product } from '../types';
import { Icon } from './common/Icon';

interface MenuViewProps {
  products: Product[];
  categories: string[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const checkAvailability = (branch: 'Del Valle' | 'Coyoacán') => {
    return product.availability[branch] > 0
      ? <span className="text-accent-green font-medium">Disponible</span>
      : <span className="text-accent-red font-medium">Agotado</span>;
  };

  const isAvailableAnywhere = product.availability['Del Valle'] > 0 || product.availability['Coyoacán'] > 0;

  return (
    <div
      className={`bg-dark-secondary rounded-lg border border-dark-tertiary overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg border-accent-gold/30' : 'hover:border-dark-border'}`}
    >
      {/* Header - Always Visible */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-grow">
          <h3 className="text-lg font-bold text-text-light">{product.name}</h3>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-dark-tertiary text-text-muted border border-dark-border">
              {product.category}
            </span>
            {product.subCategory && (
              <span className="text-xs text-accent-gold/80 italic">
                {product.subCategory}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Availability Badge (Mobile Condensed) */}
          <div className="text-right">
            {isAvailableAnywhere ? (
              <span className="flex items-center text-xs sm:text-sm text-accent-green bg-green-900/20 px-2 py-1 rounded">
                <div className="w-2 h-2 bg-accent-green rounded-full mr-1.5 animate-pulse"></div>
                Disponible
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-accent-red bg-red-900/20 px-2 py-1 rounded">
                Agotado
              </span>
            )}
          </div>

          <Icon
            name="chevron-down"
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-dark-tertiary bg-dark-primary/30 animate-fadeIn">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-dark-tertiary text-gray-600">
                  <Icon name="image" className="w-8 h-8 opacity-50" />
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-4 md:p-6 flex-grow">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Descripción</h4>
                <p className="text-gray-300 leading-relaxed text-sm">{product.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Propiedades</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.properties.split(',').map((prop, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-dark-tertiary text-text-light border border-dark-border">
                        {prop.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Disponibilidad por Sucursal</h4>
                  <div className="space-y-2 text-sm bg-dark-primary p-3 rounded border border-dark-border">
                    <div className="flex justify-between items-center border-b border-dark-border pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-400">Del Valle</span>
                      {checkAvailability('Del Valle')}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-400">Coyoacán</span>
                      {checkAvailability('Coyoacán')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuView: React.FC<MenuViewProps> = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCategories = ['Todas', ...categories];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-text-light mb-6">Menú</h1>

      <div className="sticky top-16 z-30 bg-dark-primary/95 backdrop-blur-sm py-4 border-b border-dark-border mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:top-0 sm:static">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-dark-border rounded-lg leading-5 bg-dark-secondary text-text-light placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-green focus:border-accent-green transition duration-150 ease-in-out"
              placeholder="Buscar cepas, productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border ${selectedCategory === category
                  ? 'bg-accent-green text-white border-accent-green shadow-lg shadow-green-900/30'
                  : 'bg-dark-secondary text-gray-400 border-dark-tertiary hover:border-gray-500 hover:text-white'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-dark-secondary rounded-lg border border-dark-tertiary border-dashed">
          <Icon name="search" className="w-12 h-12 text-dark-tertiary mx-auto mb-4" />
          <p className="text-text-muted text-lg">No encontramos lo que buscas.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('Todas') }}
            className="mt-4 text-accent-green hover:underline"
          >
            Ver todo el menú
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuView;