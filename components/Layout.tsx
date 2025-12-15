
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogIn, Menu, X, Instagram, MessageCircle, LayoutDashboard, Crown } from 'lucide-react';
import { MENU_ITEMS, COLORS } from '../constants';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole | null;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onOpenAuth, onOpenCart, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-black tracking-tighter group-hover:italic transition-all">
                LS <span className="text-yellow-400">CÉLIA</span> HAIR
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-10">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-yellow-400 ${
                    location.pathname === item.path ? 'text-yellow-400' : 'text-zinc-500'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* LINK DINÂMICO DO ADMIN NO MENU PRINCIPAL - ULTRA VISÍVEL */}
              {userRole === UserRole.ADMIN && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] bg-yellow-400 text-black px-6 py-3 rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 border-2 border-yellow-400 animate-in zoom-in"
                >
                  <Crown size={16} />
                  <span>Gerenciar Sistema</span>
                </Link>
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={onOpenCart}
                className="relative p-3 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-500 hover:text-yellow-400 hover:border-yellow-400/30 transition-all shadow-lg"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-black shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={onOpenAuth}
                className={`hidden sm:flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border shadow-xl ${
                  userRole 
                    ? 'bg-yellow-400/5 border-yellow-400/30 text-yellow-400' 
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                }`}
              >
                <LogIn size={18} />
                <span>{userRole ? userRole : 'Acessar'}</span>
              </button>

              <button className="md:hidden p-3 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-400" onClick={toggleMenu}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-900 p-6 space-y-4 animate-in slide-in-from-top-4">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-yellow-400 hover:bg-zinc-900 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {userRole === UserRole.ADMIN && (
              <Link
                to="/admin"
                className="flex items-center space-x-4 px-6 py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] text-black bg-yellow-400 shadow-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                <span>Painel Administrador</span>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-10">
             <span className="text-3xl font-black italic tracking-tighter">
                LS <span className="text-yellow-400">CÉLIA</span> HAIR
             </span>
          </div>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] mb-12">Referência Master em Mega Hair e Formação Profissional</p>
          <div className="flex justify-center space-x-6">
              <a href="#" className="p-4 bg-zinc-900 rounded-[1.5rem] text-zinc-500 hover:text-yellow-400 hover:scale-110 transition-all border border-zinc-800">
                <Instagram size={24} />
              </a>
              <a href="#" className="p-4 bg-zinc-900 rounded-[1.5rem] text-zinc-500 hover:text-yellow-400 hover:scale-110 transition-all border border-zinc-800">
                <MessageCircle size={24} />
              </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
