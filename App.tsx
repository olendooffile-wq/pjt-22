
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AppraiserDashboard from './pages/AppraiserDashboard';
import CartDrawer from './components/CartDrawer';
import { UserRole, Product, Hair, Course, CartItem } from './types';
import { Lock, User, ShieldAlert, BookOpen, UserCheck, X, ChevronRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (item: Product | Hair | Course) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === item.id);
      if (existing) {
        return prev.map(i => i.product.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product: item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const handleClearCart = () => setCart([]);

  const loginAs = (role: UserRole) => {
    setUserRole(role);
    setShowAuthModal(false);
    
    // Redirecionamento instantâneo
    if (role === UserRole.ADMIN) {
      setTimeout(() => navigate('/admin'), 100);
    } else if (role === UserRole.STUDENT) {
      setTimeout(() => navigate('/estudante'), 100);
    } else if (role === UserRole.APPRAISER) {
      setTimeout(() => navigate('/avalista'), 100);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setShowAuthModal(false);
    navigate('/');
  };

  return (
    <Layout 
      userRole={userRole} 
      onOpenAuth={() => setShowAuthModal(true)} 
      onOpenCart={() => setIsCartOpen(true)}
      cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products onAddToCart={handleAddToCart} />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        
        {/* Rota do Admin simplificada para garantir compatibilidade com HashRouter */}
        <Route 
          path="/admin" 
          element={userRole === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/estudante" 
          element={userRole === UserRole.STUDENT ? <StudentDashboard /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/avalista" 
          element={userRole === UserRole.APPRAISER ? <AppraiserDashboard /> : <Navigate to="/" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
            
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl mx-auto mb-6 flex items-center justify-center text-black shadow-lg">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Área <span className="text-yellow-400">Restrita</span></h2>
              <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest">Acesso ao Sistema Master</p>
            </div>
            
            <div className="space-y-4">
              {[
                { role: UserRole.ADMIN, label: 'Administrador', icon: <ShieldAlert size={20} />, color: 'group-hover:text-red-500' },
                { role: UserRole.APPRAISER, label: 'Avalista', icon: <UserCheck size={20} />, color: 'group-hover:text-blue-500' },
                { role: UserRole.STUDENT, label: 'Aluno Academy', icon: <BookOpen size={20} />, color: 'group-hover:text-green-500' },
              ].map((btn) => (
                <button
                  key={btn.role}
                  onClick={() => loginAs(btn.role)}
                  className="w-full flex items-center justify-between px-8 py-5 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-yellow-400 hover:bg-zinc-800 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 bg-zinc-950 rounded-xl transition-colors ${btn.color}`}>
                      {btn.icon}
                    </div>
                    <span className="font-black text-xs uppercase tracking-[0.2em]">{btn.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-zinc-700 group-hover:text-yellow-400" />
                </button>
              ))}

              {userRole && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-6 py-5 bg-zinc-800/50 text-red-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-3xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  Sair do Sistema
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
