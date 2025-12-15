
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Award } from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/mockData';

const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale&random=hero" 
            alt="Salão LS Célia Hair" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
            EXCELÊNCIA EM <span className="text-yellow-400 underline decoration-yellow-400/30">CABELOS</span> E EDUCAÇÃO
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-10 font-light">
            O salão referência em Mega Hair e a academia que forma os melhores profissionais do Brasil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/produtos" 
              className="w-full sm:w-auto px-10 py-4 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-all flex items-center justify-center space-x-2"
            >
              <span>Ver Produtos</span>
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/sobre" 
              className="w-full sm:w-auto px-10 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-full hover:bg-zinc-800 transition-all"
            >
              Conheça Nossa História
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Star className="text-yellow-400" size={32} />, title: 'Qualidade Premium', desc: 'Trabalhamos apenas com cabelos selecionados e higienizados.' },
          { icon: <Shield className="text-yellow-400" size={32} />, title: 'Procedimentos Seguros', desc: 'Equipe especializada e produtos dermatologicamente testados.' },
          { icon: <Award className="text-yellow-400" size={32} />, title: 'Cursos Certificados', desc: 'Formação completa com reconhecimento no mercado da beleza.' }
        ].map((f, i) => (
          <div key={i} className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl hover:border-yellow-400/50 transition-colors">
            {f.icon}
            <h3 className="text-xl font-bold mt-6 mb-3">{f.title}</h3>
            <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Product Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Destaques da Loja</h2>
            <p className="text-zinc-500">Nossos produtos mais vendidos para o seu cuidado diário.</p>
          </div>
          <Link to="/produtos" className="text-yellow-400 hover:underline hidden md:block">Ver todos →</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="group bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden hover:border-yellow-400 transition-all">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-300">
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
