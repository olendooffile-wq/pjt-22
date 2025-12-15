
import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_HAIRS, MOCK_COURSES } from '../services/mockData';
import { Product, Hair, Course } from '../types';
import { ShoppingCart, Eye, Package, GraduationCap, Scissors } from 'lucide-react';

interface ProductsProps {
  onAddToCart: (item: Product | Hair | Course) => void;
}

const Products: React.FC<ProductsProps> = ({ onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'hair' | 'courses'>('products');

  const tabs = [
    { id: 'products', label: 'Produtos', icon: <Package size={18} /> },
    { id: 'hair', label: 'Cabelos', icon: <Scissors size={18} /> },
    { id: 'courses', label: 'Cursos', icon: <GraduationCap size={18} /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Catálogo Completo</h1>
        <p className="text-zinc-500">Tudo o que você precisa para realçar sua beleza ou profissionalizar sua carreira.</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 mb-10 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTab === 'products' && MOCK_PRODUCTS.map((p) => (
          <ProductCard key={p.id} item={p} onAdd={onAddToCart} />
        ))}
        {activeTab === 'hair' && MOCK_HAIRS.map((h) => (
          <ProductCard key={h.id} item={h} onAdd={onAddToCart} />
        ))}
        {activeTab === 'courses' && MOCK_COURSES.map((c) => (
          <ProductCard key={c.id} item={c} onAdd={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ 
  item: Product | Hair | Course; 
  onAdd: (i: any) => void 
}> = ({ item, onAdd }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden group hover:border-yellow-400 transition-all flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button className="p-3 bg-white text-black rounded-full hover:bg-yellow-400 transition-colors">
            <Eye size={20} />
          </button>
          <button 
            onClick={() => onAdd(item)}
            className="p-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-base line-clamp-1">{item.name}</h3>
        </div>
        
        {/* Specific Attributes for Hair/Courses */}
        {'nationality' in item && (
          <div className="flex gap-2 mb-3">
            <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800">
              {item.sizeCm}cm
            </span>
            <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-800">
              {item.weightG}g
            </span>
          </div>
        )}
        {'instructor' in item && (
          <p className="text-xs text-yellow-400/80 mb-3 font-medium">Prof: {item.instructor}</p>
        )}

        <p className="text-zinc-500 text-xs mb-4 line-clamp-2 flex-grow">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <button 
            onClick={() => onAdd(item)}
            className="text-[11px] font-black uppercase tracking-wider bg-zinc-900 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-lg border border-zinc-800 transition-all"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
