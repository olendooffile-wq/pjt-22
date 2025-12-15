
import React, { useState, useMemo } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, CheckCircle2, Truck, Store, MessageCircle, MapPin } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

type Step = 'cart' | 'checkout' | 'success';
type DeliveryMethod = 'store' | 'delivery';

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onClearCart }) => {
  const [step, setStep] = useState<Step>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('store');
  const [cep, setCep] = useState('');
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: ''
  });

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [items]);
  
  const activeShippingCost = deliveryMethod === 'delivery' ? (shippingPrice || 0) : 0;
  const total = subtotal + activeShippingCost;

  const handleCalculateShipping = () => {
    if (cep.length < 8) return;
    setIsCalculating(true);
    setTimeout(() => {
      const mockPrice = 15 + Math.random() * 20;
      setShippingPrice(mockPrice);
      setIsCalculating(false);
      setDeliveryMethod('delivery');
    }, 800);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    onClearCart();
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep('cart');
      setShippingPrice(null);
      setCep('');
      setFormData({ name: '', whatsapp: '', address: '' });
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={resetAndClose} 
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md animate-in slide-in-from-right duration-500">
          <div className="h-full flex flex-col bg-zinc-950 shadow-2xl border-l border-zinc-900 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950 z-10">
              <div className="flex items-center space-x-3">
                {step === 'checkout' && (
                  <button onClick={() => setStep('cart')} className="p-1 -ml-1 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                )}
                <ShoppingBag className="text-yellow-400" />
                <h2 className="text-xl font-bold italic">
                  {step === 'cart' ? 'Seu ' : step === 'checkout' ? 'Dados para ' : 'Pedido '}
                  <span className="text-yellow-400">{step === 'cart' ? 'Carrinho' : step === 'checkout' ? 'Entrega' : 'Enviado!'}</span>
                </h2>
              </div>
              <button 
                onClick={resetAndClose}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* View 1: Cart Items */}
            {step === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-hide">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-6 bg-zinc-900 rounded-full text-zinc-700">
                        <ShoppingBag size={48} />
                      </div>
                      <p className="text-zinc-500">O seu carrinho está vazio.</p>
                      <button onClick={resetAndClose} className="text-yellow-400 font-bold hover:underline">Continuar comprando</button>
                    </div>
                  ) : (
                    <>
                      {items.map((item) => (
                        <div key={item.product.id} className="flex space-x-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900">
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover opacity-80" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="text-sm font-bold line-clamp-1">{item.product.name}</h3>
                                <button onClick={() => onRemove(item.product.id)} className="text-zinc-600 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                              </div>
                              <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">{item.product.category}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                                <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="p-1 text-zinc-400 hover:text-white transition-colors"><Minus size={14} /></button>
                                <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="p-1 text-zinc-400 hover:text-white transition-colors"><Plus size={14} /></button>
                              </div>
                              <span className="text-sm font-bold text-yellow-400">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="pt-6 border-t border-zinc-900">
                        <div className="flex items-center space-x-2 mb-4">
                          <Truck className="text-zinc-500" size={16} />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Calcular Frete</h4>
                        </div>
                        <div className="flex space-x-2">
                          <input type="text" placeholder="Seu CEP (00000-000)" value={cep} maxLength={9} onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm outline-none focus:border-yellow-400 transition-all" />
                          <button onClick={handleCalculateShipping} disabled={isCalculating || cep.length < 8} className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">{isCalculating ? '...' : 'Calcular'}</button>
                        </div>
                        {shippingPrice !== null && (
                          <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                             <div className="flex items-center space-x-2">
                               <CheckCircle2 size={14} className="text-green-500" />
                               <span className="text-xs text-zinc-400 font-medium tracking-tight">Entrega disponível</span>
                             </div>
                             <span className="text-xs font-bold text-green-500">R$ {shippingPrice.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {items.length > 0 && (
                  <div className="px-6 py-8 border-t border-zinc-900 space-y-6 bg-zinc-950">
                    <div className="space-y-2">
                      <div className="flex justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-widest"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-widest"><span>Frete</span><span className={shippingPrice !== null ? "text-white" : "text-zinc-700"}>{shippingPrice !== null ? `R$ ${shippingPrice.toFixed(2)}` : 'A calcular'}</span></div>
                      <div className="flex justify-between items-end pt-4">
                        <span className="text-lg font-bold italic">Total Estimado</span>
                        <span className="text-2xl font-black text-yellow-400">R$ {(subtotal + (shippingPrice || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                    <button onClick={() => setStep('checkout')} className="w-full py-4 bg-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/10 flex items-center justify-center space-x-3 group">
                      <span>Seguir para Entrega</span><ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* View 2: Checkout Form */}
            {step === 'checkout' && (
              <form onSubmit={handleCheckout} className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome Completo</label>
                      <input required type="text" placeholder="Seu nome" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">WhatsApp / Celular</label>
                      <input required type="tel" placeholder="(00) 00000-0000" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Método de Recebimento</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setDeliveryMethod('store')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${deliveryMethod === 'store' ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        <Store size={24} className="mb-2" /><span className="text-[10px] font-black uppercase tracking-widest">Retirada</span>
                      </button>
                      <button type="button" onClick={() => setDeliveryMethod('delivery')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${deliveryMethod === 'delivery' ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        <Truck size={24} className="mb-2" /><span className="text-[10px] font-black uppercase tracking-widest">Entrega</span>
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Endereço de Entrega</label>
                      <textarea required placeholder="Rua, Número, CEP..." rows={3} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400" />
                    </div>
                  )}

                  {deliveryMethod === 'store' && (
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start space-x-3 animate-in fade-in">
                      <MapPin className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                      <div><p className="text-[10px] font-black uppercase text-zinc-400">Ponto de Retirada</p><p className="text-[11px] text-zinc-500">Av. Principal das Belezas, 1234, São Paulo - SP</p></div>
                    </div>
                  )}
                </div>

                {/* BOTÃO FIXO NO RODAPÉ DO CHECKOUT */}
                <div className="px-6 py-8 border-t border-zinc-900 space-y-4 bg-zinc-950 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Total Final</span>
                    <span className="text-2xl font-black text-yellow-400">R$ {total.toFixed(2)}</span>
                  </div>
                  <button type="submit" className="w-full py-5 bg-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20 active:scale-[0.98]">
                    Confirmar Pedido
                  </button>
                </div>
              </form>
            )}

            {/* View 3: Success */}
            {step === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={48} /></div>
                <h3 className="text-2xl font-black italic mb-2">Pedido <span className="text-yellow-400">Recebido!</span></h3>
                <p className="text-zinc-500 text-sm mb-8 px-4">Olá <span className="text-white font-bold">{formData.name}</span>, seu pedido foi enviado. Entraremos em contato via WhatsApp para finalizar o pagamento.</p>
                <button onClick={resetAndClose} className="w-full py-4 bg-zinc-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all border border-zinc-800 mb-4">Voltar para o Início</button>
                <a href={`https://wa.me/5511999999999?text=Olá, meu nome é ${formData.name}. Acabei de realizar um pedido no site LS Célia Hair.`} target="_blank" className="flex items-center space-x-2 text-green-500 font-bold hover:underline text-sm"><MessageCircle size={18} /><span>Chamar no WhatsApp agora</span></a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
