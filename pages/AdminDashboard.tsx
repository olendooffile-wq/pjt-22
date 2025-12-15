
import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Search, Plus, Trash2, ShoppingCart, CreditCard, Users2,
  Layers, ShoppingBag, Banknote, QrCode, Scissors, Package, 
  ChevronRight, ChevronLeft, CheckCircle2, Calendar,
  TrendingUp, History, X, Clock, Eye, User, MessageSquare, Check, 
  Settings2, Tag, Ban, Truck, GraduationCap, Sparkles, UserPlus, UserCheck,
  Wallet, Unlock, ArrowUpCircle, ArrowDownCircle, Lock, ArrowDownRight, ArrowUpRight,
  AlertTriangle, Phone, MapPin, Edit3, Save, MoreHorizontal, Briefcase, FileText, Target,
  Minus, Percent, Wallet2, Settings, UserMinus, RefreshCw, LayoutGrid, List
} from 'lucide-react';
import { ADMIN_MENU } from '../constants';
import { MOCK_PRODUCTS, MOCK_HAIRS, MOCK_APPOINTMENTS as INITIAL_APPOINTMENTS, MOCK_SAVED_HAIR, MOCK_COURSES } from '../services/mockData';

// --- CONFIGURAÇÃO INICIAL DA TABELA DE PRECIFICAÇÃO ---
const INITIAL_PRICING_RULES: any = {
  'TEXTURA': [
    { id: 't1', name: 'CACHEADO', value: 150 },
    { id: 't2', name: 'LISO', value: 100 },
    { id: 't3', name: 'ONDULADO', value: 100 },
  ],
  'TAMANHO': [
    { id: 'sz1', name: '50CM', value: 10 },
    { id: 'sz2', name: '55CM', value: 50 },
    { id: 'sz3', name: '60CM', value: 100 },
    { id: 'sz4', name: '65CM', value: 150 },
    { id: 'sz5', name: '70CM', value: 200 },
    { id: 'sz6', name: '75CM', value: 250 },
    { id: 'sz7', name: '80CM', value: 300 },
  ],
  'CIRCUNFERÊNCIA': [
    { id: 'c1', name: '6CM', value: 0 },
    { id: 'c2', name: '7CM', value: 30 },
    { id: 'c3', name: '8CM', value: 50 },
    { id: 'c4', name: '9CM', value: 70 },
  ],
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dash');
  
  // Estados de Dados Locais (Simulando Banco)
  const [localTeam, setLocalTeam] = useState(MOCK_TEAM);
  const [localProducts, setLocalProducts] = useState(MOCK_PRODUCTS.map(p => ({ ...p, costPrice: p.price * 0.4 })));
  const [localHairs, setLocalHairs] = useState(MOCK_HAIRS.map(h => ({ ...h, costPrice: h.price * 0.6 })));
  const [localAppointments, setLocalAppointments] = useState(INITIAL_APPOINTMENTS);
  const [localSavedHair, setLocalSavedHair] = useState(MOCK_SAVED_HAIR);
  const [localClients, setLocalClients] = useState(MOCK_CLIENTS);
  const [pricingRules, setPricingRules] = useState(INITIAL_PRICING_RULES);

  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Fernanda Lima', items: ['Shampoo LS Célia Profissional'], total: 209.90, status: 'pending', date: '2023-11-25' },
    { id: 'ORD-002', customer: 'Juliana Paes', items: ['Cabelo Brasileiro 60cm'], total: 1500.00, status: 'confirmed', date: '2023-11-24' },
  ]);

  // Estados de Caixa e PDV
  const [isCashierOpen, setIsCashierOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState<number | string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pdvCart, setPdvCart] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  
  // Modais e Estados de Criação
  const [showCashierModal, setShowCashierModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showNewHairModal, setShowNewHairModal] = useState(false);
  const [showNewAppraiserModal, setShowNewAppraiserModal] = useState(false);
  const [showNewPricingCategoryModal, setShowNewPricingCategoryModal] = useState(false);
  const [showNewPricingItemModal, setShowNewPricingItemModal] = useState<string | null>(null);

  const [expenseData, setExpenseData] = useState({ description: '', value: '' });
  const [newAppraiser, setNewAppraiser] = useState({ name: '', role: 'Avalista Técnico', appraiserGoal: '' });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemData, setNewItemData] = useState({ name: '', value: '' });

  // Sub-tabs dentro de Avalistas
  const [appraiserSubTab, setAppraiserSubTab] = useState<'list' | 'pricing'>('list');

  // --- LÓGICA DE NEGÓCIO ---

  const stats = useMemo(() => {
    const startVal = typeof openingBalance === 'number' ? openingBalance : parseFloat(openingBalance as string) || 0;
    const inputs = transactions.filter(t => t.type === 'Entrada');
    const outputs = transactions.filter(t => t.type === 'Saída');
    const totalIn = inputs.reduce((acc, t) => acc + t.value, 0);
    const totalOut = outputs.reduce((acc, t) => acc + t.value, 0);
    return { totalIn, totalOut, final: startVal + totalIn - totalOut };
  }, [openingBalance, transactions]);

  const handleOpenCashier = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCashierOpen(true);
    setShowCashierModal(false);
  };

  const addToPdvCart = (item: any) => {
    setPdvCart([...pdvCart, { ...item, cartId: Date.now() }]);
  };

  const removeFromPdvCart = (cartId: number) => {
    setPdvCart(pdvCart.filter(i => i.cartId !== cartId));
  };

  const finalizePdvSale = (method: string) => {
    const total = pdvCart.reduce((acc, i) => acc + i.price, 0);
    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleTimeString('pt-BR'),
      description: `VENDA DIRETA: ${pdvCart.length} itens`,
      method,
      type: 'Entrada',
      value: total
    };
    
    if (selectedPartner) {
        const commissionValue = total * 0.3;
        const commissionTx = {
            id: Date.now() + 1,
            date: new Date().toLocaleTimeString('pt-BR'),
            description: `COMISSÃO: ${selectedPartner.name}`,
            method: '-',
            type: 'Saída',
            value: commissionValue
        };
        setTransactions([commissionTx, newTransaction, ...transactions]);
    } else {
        setTransactions([newTransaction, ...transactions]);
    }

    setPdvCart([]);
    setSelectedPartner(null);
  };

  const handleAddAppraiser = (e: React.FormEvent) => {
    e.preventDefault();
    const appraiser = {
      id: `t${localTeam.length + 1}`,
      name: newAppraiser.name,
      role: newAppraiser.role,
      commissionRate: 0.3,
      appraiserGoal: parseInt(newAppraiser.appraiserGoal) || 0
    };
    setLocalTeam([...localTeam, appraiser]);
    setShowNewAppraiserModal(false);
    setNewAppraiser({ name: '', role: 'Avalista Técnico', appraiserGoal: '' });
  };

  const handleDeleteAppraiser = (id: string) => {
    setLocalTeam(localTeam.filter(t => t.id !== id));
  };

  const handleAddPricingCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const key = newCategoryName.toUpperCase();
    setPricingRules({ ...pricingRules, [key]: [] });
    setNewCategoryName('');
    setShowNewPricingCategoryModal(false);
  };

  const handleDeletePricingCategory = (category: string) => {
    const updated = { ...pricingRules };
    delete updated[category];
    setPricingRules(updated);
  };

  const handleAddPricingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showNewPricingItemModal) return;
    const category = showNewPricingItemModal;
    const newItem = {
      id: `ni${Date.now()}`,
      name: newItemData.name.toUpperCase(),
      value: parseFloat(newItemData.value) || 0
    };
    setPricingRules({
      ...pricingRules,
      [category]: [...pricingRules[category], newItem]
    });
    setNewItemData({ name: '', value: '' });
    setShowNewPricingItemModal(null);
  };

  const handleDeletePricingItem = (category: string, itemId: string) => {
    setPricingRules({
      ...pricingRules,
      [category]: pricingRules[category].filter((i: any) => i.id !== itemId)
    });
  };

  const calculateHairFee = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) return (diffDays - 30) * 1.0;
    return 0;
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'dash':
        return (
          <div className="space-y-8 animate-in fade-in">
            <header>
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase italic">Painel <span className="text-yellow-500">Master</span></h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">LS Célia Hair Integrated System</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricBox label="Saldo Atual" value={`R$ ${stats.final.toFixed(2)}`} status={isCashierOpen ? "Ativo" : "Fechado"} color={isCashierOpen ? "text-emerald-600" : "text-rose-500"} icon={<Wallet size={20}/>} />
              <MetricBox label="Agendamentos" value={localAppointments.filter(a => a.status === 'pending').length} status="Para Hoje" color="text-blue-600" icon={<Calendar size={20}/>} />
              <MetricBox label="Estoque Baixo" value={localProducts.filter(p => p.stock < 10).length} status="Itens Alerta" color="text-amber-600" icon={<Package size={20}/>} />
              <MetricBox label="Cabelos Guardados" value={localSavedHair.filter(h => h.active).length} status="Em custódia" color="text-purple-600" icon={<Scissors size={20}/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="p-10 bg-white border border-zinc-200 rounded-[3.5rem] shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-8 italic">Últimos Pedidos Online</h4>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div>
                          <p className="text-xs font-black uppercase italic">{order.customer}</p>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase">{order.id}</p>
                        </div>
                        <span className="text-sm font-black text-zinc-900">R$ {order.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="p-10 bg-zinc-950 text-white rounded-[3.5rem] shadow-2xl flex flex-col justify-center text-center">
                  <p className="text-yellow-400 text-6xl font-black italic tracking-tighter mb-4">R$ {stats.totalIn.toFixed(2)}</p>
                  <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.4em]">Entradas Brutas Hoje</p>
               </div>
            </div>
          </div>
        );

      case 'venda_direta':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in h-full">
            <div className="lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
               <header className="flex justify-between items-center">
                 <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Venda <span className="text-yellow-500">Direta</span></h2>
                 <div className="relative w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16}/>
                    <input placeholder="Buscar item..." className="w-full bg-zinc-100 border-none rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase outline-none focus:ring-2 ring-yellow-400" />
                 </div>
               </header>
               
               <div className="flex-grow overflow-y-auto pr-2 space-y-8 scrollbar-hide">
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Produtos e Acessórios</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {localProducts.map(p => (
                        <button key={p.id} onClick={() => addToPdvCart(p)} className="p-4 bg-white border border-zinc-200 rounded-[2rem] text-left hover:border-yellow-400 hover:scale-[1.02] transition-all shadow-sm group">
                          <p className="text-xs font-black uppercase italic line-clamp-1 mb-1">{p.name}</p>
                          <p className="text-sm font-bold text-zinc-900">R$ {p.price.toFixed(2)}</p>
                          <p className="text-[9px] text-zinc-400 font-bold mt-2 group-hover:text-yellow-600 transition-colors uppercase">Estoque: {p.stock}</p>
                        </button>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Serviços e Procedimentos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {MOCK_SERVICES.map(s => (
                        <button key={s.id} onClick={() => addToPdvCart(s)} className="p-4 bg-zinc-950 text-white rounded-[2rem] text-left hover:bg-yellow-400 hover:text-black hover:scale-[1.02] transition-all shadow-lg border border-white/5">
                          <p className="text-xs font-black uppercase italic line-clamp-1 mb-1">{s.name}</p>
                          <p className="text-sm font-bold opacity-80">R$ {s.price.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  </section>
               </div>
            </div>

            <div className="lg:col-span-4 bg-white border-2 border-zinc-100 rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden">
               <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-xs font-black uppercase tracking-widest italic">Carrinho PDV</h3>
                  <button onClick={() => setPdvCart([])} className="text-[10px] font-black uppercase text-rose-500 hover:underline">Limpar</button>
               </div>
               
               <div className="flex-grow overflow-y-auto p-8 space-y-4">
                  {pdvCart.map(item => (
                    <div key={item.cartId} className="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group">
                       <div>
                         <p className="text-xs font-black uppercase italic">{item.name}</p>
                         <p className="text-[10px] font-bold text-zinc-400">R$ {item.price.toFixed(2)}</p>
                       </div>
                       <button onClick={() => removeFromPdvCart(item.cartId)} className="p-2 text-zinc-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                    </div>
                  ))}
                  {pdvCart.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                       <ShoppingCart size={40} className="mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Aguardando itens...</p>
                    </div>
                  )}
               </div>

               <div className="p-8 bg-zinc-950 text-white space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Parceiro Executor (Comissão)</label>
                    <select value={selectedPartner?.id || ''} onChange={(e) => setSelectedPartner(localTeam.find(t => t.id === e.target.value))} className="w-full bg-zinc-900 border-none rounded-xl px-4 py-3 text-xs font-bold uppercase outline-none text-yellow-400">
                       <option value="">Sem parceiro vinculado</option>
                       {localTeam.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-end">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Venda</span>
                     <span className="text-3xl font-black italic text-yellow-400">R$ {pdvCart.reduce((acc, i) => acc + i.price, 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => finalizePdvSale('DINHEIRO')} disabled={pdvCart.length === 0} className="py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 transition-all disabled:opacity-20">Dinheiro/Pix</button>
                    <button onClick={() => finalizePdvSale('CARTÃO')} disabled={pdvCart.length === 0} className="py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-20">Cartão</button>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'avalistas':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-end">
                <div>
                   <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Gestão de <span className="text-yellow-500">Avalistas & Preços</span></h2>
                   <div className="flex mt-6 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 w-fit">
                      <button onClick={() => setAppraiserSubTab('list')} className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${appraiserSubTab === 'list' ? 'bg-black text-white shadow-lg' : 'text-zinc-400 hover:text-black'}`}>
                        <Users2 size={14}/> <span>Avalistas</span>
                      </button>
                      <button onClick={() => setAppraiserSubTab('pricing')} className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${appraiserSubTab === 'pricing' ? 'bg-black text-white shadow-lg' : 'text-zinc-400 hover:text-black'}`}>
                        <Tag size={14}/> <span>Tabela de Preços</span>
                      </button>
                   </div>
                </div>
                {appraiserSubTab === 'list' ? (
                  <button onClick={() => setShowNewAppraiserModal(true)} className="px-8 py-4 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-yellow-400 hover:text-black transition-all italic flex items-center gap-3"><UserPlus size={16}/> Novo Avalista</button>
                ) : (
                  <button onClick={() => setShowNewPricingCategoryModal(true)} className="px-8 py-4 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-yellow-400 hover:text-black transition-all italic flex items-center gap-3"><LayoutGrid size={16}/> Nova Categoria</button>
                )}
             </header>

             {appraiserSubTab === 'list' ? (
                <div className="bg-white border border-zinc-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400 italic"><tr className="border-b border-zinc-100"><th className="px-10 py-6">Avalista</th><th className="px-10 py-6">Cargo</th><th className="px-10 py-6 text-center">Meta (Mensal)</th><th className="px-10 py-6 text-right">Ações</th></tr></thead>
                    <tbody className="divide-y divide-zinc-100">
                        {localTeam.filter(t => t.appraiserGoal !== undefined).map(a => (
                          <tr key={a.id} className="hover:bg-zinc-50 transition-colors group">
                            <td className="px-10 py-6 font-black text-zinc-900 uppercase italic">{a.name}</td>
                            <td className="px-10 py-6 text-zinc-400 text-xs font-bold uppercase">{a.role}</td>
                            <td className="px-10 py-6 text-center font-black text-2xl italic tracking-tighter text-zinc-800">{a.appraiserGoal}</td>
                            <td className="px-10 py-6 text-right space-x-2">
                                <button className="p-3 bg-zinc-100 text-zinc-400 hover:bg-zinc-950 hover:text-white rounded-2xl transition-all shadow-sm"><Settings2 size={14}/></button>
                                <button onClick={() => handleDeleteAppraiser(a.id)} className="p-3 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm"><Trash2 size={14}/></button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {Object.keys(pricingRules).map(category => (
                     <div key={category} className="bg-white border-2 border-zinc-100 rounded-[3.5rem] shadow-sm overflow-hidden flex flex-col group hover:border-yellow-400/50 transition-all">
                        <div className="p-8 border-b border-zinc-50 bg-zinc-50/50 flex justify-between items-center">
                           <h3 className="text-sm font-black italic uppercase tracking-tighter">{category}</h3>
                           <div className="flex gap-2">
                              <button onClick={() => setShowNewPricingItemModal(category)} className="p-2 bg-white border border-zinc-200 text-zinc-400 rounded-xl hover:text-black transition-all shadow-sm"><Plus size={14}/></button>
                              <button onClick={() => handleDeletePricingCategory(category)} className="p-2 bg-white border border-zinc-200 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                           </div>
                        </div>
                        <div className="p-8 flex-grow space-y-3">
                           {pricingRules[category].map((item: any) => (
                             <div key={item.id} className="flex justify-between items-center p-4 bg-zinc-50 border border-zinc-100 rounded-2xl group/item">
                                <div>
                                   <p className="text-[10px] font-black uppercase italic text-zinc-900">{item.name}</p>
                                   <p className="text-lg font-black italic tracking-tighter text-yellow-600">R$ {item.value.toFixed(2)}</p>
                                </div>
                                <button onClick={() => handleDeletePricingItem(category, item.id)} className="p-2 text-zinc-200 hover:text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all"><X size={14}/></button>
                             </div>
                           ))}
                           {pricingRules[category].length === 0 && (
                             <div className="h-32 flex flex-col items-center justify-center text-center opacity-20 italic">
                               <Package size={24} className="mb-2" />
                               <p className="text-[10px] font-black uppercase tracking-widest">Sem itens</p>
                             </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             )}
          </div>
        );

      case 'caixa':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Fluxo de <span className="text-yellow-500">Caixa Diário</span></h2>
                <div className="flex gap-4">
                  {isCashierOpen ? (
                    <>
                      <button onClick={() => setShowExpenseModal(true)} className="px-10 py-4 bg-white border border-zinc-200 text-zinc-700 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-zinc-50 italic transition-all">Nova Saída</button>
                      <button onClick={() => setIsCashierOpen(false)} className="px-10 py-4 bg-zinc-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black italic transition-all">Fechar Turno</button>
                    </>
                  ) : (
                    <button onClick={() => setShowCashierModal(true)} className="px-10 py-5 bg-zinc-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl italic flex items-center gap-4 transition-all hover:scale-[1.02]"><Unlock size={18}/> Ativar Caixa</button>
                  )}
                </div>
             </header>

             {isCashierOpen ? (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-9 bg-white border border-zinc-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black uppercase text-zinc-400 italic"><tr><th className="px-10 py-6">Horário</th><th className="px-10 py-6">Movimentação</th><th className="px-10 py-6">Método</th><th className="px-10 py-6 text-right">Valor</th></tr></thead>
                      <tbody className="divide-y divide-zinc-100">
                          <tr className="bg-zinc-50/20 italic text-zinc-400 font-bold"><td className="px-10 py-6">Início</td><td className="px-10 py-6">Saldo de Abertura</td><td className="px-10 py-6">-</td><td className="px-10 py-6 text-right font-black">R$ {Number(openingBalance).toFixed(2)}</td></tr>
                          {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-10 py-6 text-zinc-400 italic">{t.date}</td>
                              <td className="px-10 py-6 font-black flex items-center gap-3 uppercase italic text-[11px]">
                                {t.type === 'Entrada' ? <ArrowUpCircle size={16} className="text-emerald-500" /> : <ArrowDownCircle size={16} className="text-rose-500" />}
                                {t.description}
                              </td>
                              <td className="px-10 py-6"><span className="text-[10px] font-black bg-zinc-100 px-4 py-1.5 rounded-xl uppercase italic text-zinc-500">{t.method || '-'}</span></td>
                              <td className={`px-10 py-6 text-right font-black text-lg italic ${t.type === 'Entrada' ? 'text-zinc-900' : 'text-rose-600'}`}>R$ {t.value.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="lg:col-span-3 p-10 bg-zinc-950 text-white rounded-[3.5rem] shadow-2xl text-center border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4 italic">Saldo Disponível</p>
                    <p className="text-5xl font-black tracking-tighter text-yellow-400 italic">R$ {stats.final.toFixed(2)}</p>
                  </div>
               </div>
             ) : (
               <div className="h-[45vh] flex flex-col items-center justify-center bg-white border-4 border-dashed border-zinc-100 rounded-[4rem] text-center p-12">
                 <Lock size={60} className="text-zinc-100 mb-8"/>
                 <button onClick={() => setShowCashierModal(true)} className="px-16 py-6 bg-zinc-950 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl italic hover:scale-105 transition-all">Ativar Jornada Diária</button>
               </div>
             )}
          </div>
        );

      case 'agendamento':
        return (
          <div className="space-y-8 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Agenda de <span className="text-yellow-500">Serviços</span></h2>
                <button className="px-8 py-4 bg-zinc-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl italic flex items-center gap-3"><Plus size={16}/> Novo Agendamento</button>
             </header>

             <div className="bg-white border border-zinc-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400 italic"><tr className="border-b border-zinc-100"><th className="px-10 py-6">Horário</th><th className="px-10 py-6">Cliente</th><th className="px-10 py-6">Procedimento</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Ações</th></tr></thead>
                   <tbody className="divide-y divide-zinc-100">
                      {localAppointments.map(app => (
                        <tr key={app.id} className="hover:bg-zinc-50 transition-colors">
                           <td className="px-10 py-6 text-zinc-400 italic font-bold">{app.time}</td>
                           <td className="px-10 py-6 font-black text-zinc-900 uppercase italic">{app.clientName}</td>
                           <td className="px-10 py-6"><span className="text-[10px] font-black bg-zinc-100 px-4 py-1.5 rounded-full uppercase italic text-zinc-500">{app.service}</span></td>
                           <td className="px-10 py-6">
                              <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full italic ${app.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {app.status === 'completed' ? 'Concluído' : 'Aguardando'}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <button className="p-2 text-zinc-300 hover:text-black transition-colors"><MoreHorizontal size={20}/></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'cabelo':
        return (
          <div className="space-y-8 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Cabelos <span className="text-yellow-500">Guardados</span></h2>
                <button onClick={() => setShowNewHairModal(true)} className="px-8 py-4 bg-zinc-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl italic flex items-center gap-3"><Scissors size={16}/> Registrar Custódia</button>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localSavedHair.map(hair => {
                  const fee = calculateHairFee(hair.startDate);
                  return (
                    <div key={hair.id} className="p-8 bg-white border-2 border-zinc-100 rounded-[3.5rem] shadow-sm relative group overflow-hidden">
                       <div className="absolute top-6 right-8 text-zinc-100 group-hover:text-yellow-400 transition-colors opacity-20 group-hover:opacity-100"><QrCode size={40}/></div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 italic">Cliente: {hair.clientName}</p>
                       <h3 className="text-xl font-black italic tracking-tighter text-zinc-900 uppercase mb-6">{hair.type}</h3>
                       
                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center"><p className="text-[8px] font-black uppercase text-zinc-400">Peso</p><p className="text-lg font-black text-zinc-800 italic">{hair.weight}g</p></div>
                          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center"><p className="text-[8px] font-black uppercase text-zinc-400">Tamanho</p><p className="text-lg font-black text-zinc-800 italic">{hair.size}cm</p></div>
                       </div>

                       <div className="flex justify-between items-center border-t border-zinc-100 pt-6">
                          <div>
                             <p className="text-[9px] font-black uppercase text-zinc-400 italic">Código de Retirada</p>
                             <p className="font-black text-zinc-900 tracking-widest">{hair.retrievalCode}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black uppercase text-zinc-400 italic">Taxa de Permanência</p>
                             <p className={`font-black text-xl italic ${fee > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {fee > 0 ? `R$ ${fee.toFixed(2)}` : 'GRÁTIS'}
                             </p>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        );

      case 'estoque':
        return (
          <div className="space-y-8 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Gestão de <span className="text-yellow-500">Estoque</span></h2>
                <div className="flex gap-4">
                   <button className="px-6 py-3 bg-zinc-100 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><ArrowDownCircle size={14}/> Entrada</button>
                   <button className="px-6 py-3 bg-zinc-100 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><ArrowUpCircle size={14}/> Saída</button>
                </div>
             </header>

             <div className="bg-white border border-zinc-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400 italic"><tr className="border-b border-zinc-100"><th className="px-10 py-6">Item</th><th className="px-10 py-6">Categoria</th><th className="px-10 py-6 text-center">Estoque Atual</th><th className="px-10 py-6 text-right">Status</th></tr></thead>
                   <tbody className="divide-y divide-zinc-100">
                      {localProducts.map(p => (
                        <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                           <td className="px-10 py-6 font-black text-zinc-900 uppercase italic">{p.name}</td>
                           <td className="px-10 py-6"><span className="text-[9px] font-black uppercase bg-zinc-100 px-3 py-1 rounded-full text-zinc-400 italic">Produtos</span></td>
                           <td className="px-10 py-6 text-center font-black text-lg italic tracking-tighter text-zinc-800">{p.stock}</td>
                           <td className="px-10 py-6 text-right">
                              {p.stock < 10 ? (
                                <span className="text-[9px] font-black uppercase px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full italic animate-pulse flex items-center gap-2 w-fit ml-auto">
                                   <AlertTriangle size={12}/> Comprar Urgente
                                </span>
                              ) : (
                                <span className="text-[9px] font-black uppercase px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full italic w-fit ml-auto">Normal</span>
                              )}
                           </td>
                        </tr>
                      ))}
                      {localHairs.map(h => (
                        <tr key={h.id} className="hover:bg-zinc-50 transition-colors">
                           <td className="px-10 py-6 font-black text-zinc-900 uppercase italic">{h.name}</td>
                           <td className="px-10 py-6"><span className="text-[9px] font-black uppercase bg-yellow-400/10 px-3 py-1 rounded-full text-yellow-600 italic">Cabelos</span></td>
                           <td className="px-10 py-6 text-center font-black text-lg italic tracking-tighter text-zinc-800">{h.stock}</td>
                           <td className="px-10 py-6 text-right">
                              <span className="text-[9px] font-black uppercase px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full italic w-fit ml-auto">Pronta Entrega</span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'clientes':
        return (
          <div className="space-y-8 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Base de <span className="text-yellow-500">Clientes</span></h2>
                <div className="relative w-72">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16}/>
                   <input placeholder="Buscar cliente por nome ou CPF..." className="w-full bg-white border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 text-xs font-black uppercase outline-none focus:ring-2 ring-yellow-400 shadow-sm" />
                </div>
             </header>

             <div className="bg-white border border-zinc-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400 italic"><tr className="border-b border-zinc-100"><th className="px-10 py-6">Cliente</th><th className="px-10 py-6">Nível Fidelidade</th><th className="px-10 py-6 text-center">Pontos</th><th className="px-10 py-6 text-right">Ações</th></tr></thead>
                   <tbody className="divide-y divide-zinc-100">
                      {localClients.map(c => (
                        <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                           <td className="px-10 py-6">
                              <p className="font-black text-zinc-900 uppercase italic">{c.name}</p>
                              <p className="text-[10px] text-zinc-400 font-bold">{c.email}</p>
                           </td>
                           <td className="px-10 py-6">
                              <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full italic ${
                                c.level === 'Diamante' ? 'bg-indigo-100 text-indigo-600' :
                                c.level === 'Ouro' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-zinc-100 text-zinc-500'
                              }`}>
                                {c.level}
                              </span>
                           </td>
                           <td className="px-10 py-6 text-center font-black text-lg italic tracking-tighter text-zinc-800">{c.points}</td>
                           <td className="px-10 py-6 text-right">
                              <button className="px-6 py-2 bg-zinc-100 text-zinc-500 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-950 hover:text-white transition-all italic">Ficha Completa</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'produtos_online':
        return (
          <div className="space-y-8 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase italic">Pedidos <span className="text-yellow-500">Online</span></h2>
             </header>

             <div className="bg-white border border-zinc-200 rounded-[3.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400 italic"><tr className="border-b border-zinc-100"><th className="px-10 py-6">Nº Pedido</th><th className="px-10 py-6">Cliente</th><th className="px-10 py-6 text-center">Total</th><th className="px-10 py-6 text-center">Data</th><th className="px-10 py-6 text-right">Status</th></tr></thead>
                   <tbody className="divide-y divide-zinc-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                           <td className="px-10 py-6 text-zinc-400 italic font-bold">#{o.id}</td>
                           <td className="px-10 py-6 font-black text-zinc-900 uppercase italic">{o.customer}</td>
                           <td className="px-10 py-6 text-center font-black italic">R$ {o.total.toFixed(2)}</td>
                           <td className="px-10 py-6 text-center text-[11px] text-zinc-400 font-bold">{o.date}</td>
                           <td className="px-10 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                 {o.status === 'pending' ? (
                                   <>
                                      <button className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Check size={16}/></button>
                                      <button className="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><X size={16}/></button>
                                   </>
                                 ) : (
                                   <span className="text-[9px] font-black uppercase px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full italic">Confirmado</span>
                                 )}
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      default:
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-pulse">
            <RefreshCw size={60} className="text-zinc-100 mb-8 animate-spin duration-3000" />
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-200">Módulo em Integração...</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-4">LS Célia Hair Software v2.5</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFDFE] text-zinc-900 relative overflow-hidden font-sans selection:bg-yellow-400 selection:text-black">
      {/* Sidebar Fixo Lateral */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-black text-white flex-col z-30 border-r border-zinc-800 shadow-2xl">
        <div className="p-12 border-b border-zinc-900"><h2 className="text-4xl font-black tracking-tighter italic text-white uppercase">LS <span className="text-yellow-400">ADMIN</span></h2></div>
        <nav className="flex-grow p-8 space-y-2 overflow-y-auto scrollbar-hide">
          {ADMIN_MENU.map((item) => (
            <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all italic ${activeTab === item.id ? 'bg-yellow-400 text-black shadow-xl scale-[1.05]' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
            >
              <span className={activeTab === item.id ? 'text-black' : 'text-zinc-600 group-hover:text-white'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-grow overflow-y-auto scrollbar-hide p-12 md:p-16 relative bg-zinc-50">
          <div className="max-w-7xl mx-auto">{renderSection()}</div>
      </main>

      {/* MODAIS GLOBAIS */}
      {showCashierModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-16 shadow-2xl w-full max-w-md border-t-8 border-yellow-400 text-center">
              <h3 className="text-3xl font-black italic uppercase mb-10 text-black">Abertura de <span className="text-yellow-500">Caixa</span></h3>
              <form onSubmit={handleOpenCashier} className="space-y-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 block italic">Saldo Inicial em Espécie</label>
                    <input type="number" required placeholder="0.00" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} className="w-full bg-zinc-50 border-4 border-zinc-100 rounded-[2.5rem] px-10 py-8 font-black text-5xl outline-none text-center italic" />
                 </div>
                 <button type="submit" className="w-full py-7 bg-zinc-950 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-yellow-400 hover:text-black transition-all italic">Ativar Turno</button>
              </form>
           </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl w-full max-w-md border-t-8 border-rose-500">
              <h3 className="text-2xl font-black italic mb-10 text-rose-500 uppercase tracking-tighter text-center">Registrar <span className="text-black">Saída</span></h3>
              <form onSubmit={e => { 
                  e.preventDefault(); 
                  const v = parseFloat(expenseData.value) || 0; 
                  setTransactions([{ id: Date.now(), date: new Date().toLocaleTimeString('pt-BR'), description: `RETIRADA: ${expenseData.description.toUpperCase()}`, method: 'DINHEIRO', type: 'Saída', value: v }, ...transactions]); 
                  setShowExpenseModal(false); 
                  setExpenseData({ description: '', value: '' });
                }} className="space-y-8">
                 <div className="space-y-3"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Descrição do Gasto</label><input required placeholder="EX: COMPRA DE TOALHAS" value={expenseData.description} onChange={e => setExpenseData({...expenseData, description: e.target.value})} className="w-full p-6 bg-zinc-50 border-2 border-zinc-100 rounded-3xl font-black text-sm outline-none uppercase italic" /></div>
                 <div className="space-y-3"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Valor (R$)</label><input type="number" required placeholder="0.00" value={expenseData.value} onChange={e => setExpenseData({...expenseData, value: e.target.value})} className="w-full p-6 bg-zinc-50 border-2 border-zinc-100 rounded-3xl font-black text-3xl outline-none italic" /></div>
                 <button type="submit" className="w-full py-6 bg-rose-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-rose-700 transition-all italic">Confirmar Retirada</button>
              </form>
           </div>
        </div>
      )}

      {showNewAppraiserModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-16 shadow-2xl w-full max-w-md border-t-8 border-yellow-400">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-10 text-center">Novo <span className="text-yellow-500">Avalista</span></h3>
              <form onSubmit={handleAddAppraiser} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Nome do Profissional</label>
                    <input required className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none uppercase italic text-sm" placeholder="Nome Completo" value={newAppraiser.name} onChange={e => setNewAppraiser({...newAppraiser, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Meta de Avaliações (Mês)</label>
                    <input required type="number" className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none italic text-sm" placeholder="Ex: 50" value={newAppraiser.appraiserGoal} onChange={e => setNewAppraiser({...newAppraiser, appraiserGoal: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full py-6 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-yellow-400 hover:text-black transition-all italic">Cadastrar na Equipe</button>
                 <button type="button" onClick={() => setShowNewAppraiserModal(false)} className="w-full py-2 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:text-black">Cancelar</button>
              </form>
           </div>
        </div>
      )}

      {showNewPricingCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-16 shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-10 text-center">Nova <span className="text-yellow-500">Categoria</span></h3>
              <form onSubmit={handleAddPricingCategory} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Nome da Categoria</label>
                    <input required className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none uppercase italic text-sm" placeholder="EX: NACIONALIDADE" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                 </div>
                 <button type="submit" className="w-full py-6 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-yellow-400 hover:text-black transition-all italic">Criar Categoria</button>
                 <button type="button" onClick={() => setShowNewPricingCategoryModal(false)} className="w-full py-2 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:text-black">Cancelar</button>
              </form>
           </div>
        </div>
      )}

      {showNewPricingItemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-16 shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-10 text-center">Novo Item em <span className="text-yellow-500">{showNewPricingItemModal}</span></h3>
              <form onSubmit={handleAddPricingItem} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Nome do Item</label>
                    <input required className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none uppercase italic text-sm" placeholder="EX: BRASILEIRO" value={newItemData.name} onChange={e => setNewItemData({...newItemData, name: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Valor Base (R$)</label>
                    <input required type="number" step="0.01" className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none italic text-sm" placeholder="0.00" value={newItemData.value} onChange={e => setNewItemData({...newItemData, value: e.target.value})} />
                 </div>
                 <button type="submit" className="w-full py-6 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-yellow-400 hover:text-black transition-all italic">Adicionar à Tabela</button>
                 <button type="button" onClick={() => setShowNewPricingItemModal(null)} className="w-full py-2 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:text-black">Cancelar</button>
              </form>
           </div>
        </div>
      )}

      {showNewHairModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-16 shadow-2xl w-full max-w-lg">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-10">Novo Cabelo <span className="text-yellow-500">Guardado</span></h3>
              <form onSubmit={e => { 
                e.preventDefault();
                setShowNewHairModal(false);
              }} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Cliente</label><input required className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none" placeholder="Nome Completo" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Tipo</label><input required className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none" placeholder="Ex: Brasileiro Liso" /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Peso (g)</label><input required type="number" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Tamanho (cm)</label><input required type="number" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold outline-none" /></div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-yellow-400 hover:text-black transition-all italic">Gerar Código e Guardar</button>
                 <button type="button" onClick={() => setShowNewHairModal(false)} className="w-full py-4 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:text-black">Cancelar</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const MetricBox = ({ label, value, status, color, icon }: any) => (
  <div className="p-10 bg-white border border-zinc-100 rounded-[3.5rem] shadow-sm hover:border-zinc-300 transition-all group relative overflow-hidden">
    <div className="flex justify-between items-start mb-8">
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">{label}</span>
      <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:bg-yellow-400 group-hover:text-black transition-all shadow-inner">{icon}</div>
    </div>
    <div className="flex items-baseline space-x-2">
      <p className="text-3xl font-black text-zinc-900 tracking-tighter italic">{value}</p>
    </div>
    <p className={`text-[9px] font-black uppercase mt-5 tracking-[0.2em] italic border-t border-zinc-50 pt-4 ${color}`}>{status}</p>
  </div>
);

// --- DADOS MOCK EXTRAS ---

const MOCK_TEAM = [
  { id: 't1', name: 'Célia Hair', role: 'Diretora Master', commissionRate: 0.5, appraiserGoal: 50 },
  { id: 't2', name: 'Janice Lima', role: 'Especialista Mega', commissionRate: 0.4, appraiserGoal: 30 },
  { id: 't3', name: 'Roberto Color', role: 'Colorista Master', commissionRate: 0.3, appraiserGoal: 20 },
];

const MOCK_SERVICES = [
  { id: 's1', name: 'Aplicação Mega Hair Master', price: 850.00, category: 'service' },
  { id: 's2', name: 'Manutenção Mega Hair', price: 450.00, category: 'service' },
  { id: 's3', name: 'Corte e Escova Premium', price: 180.00, category: 'service' },
  { id: 's4', name: 'Coloração Especial', price: 320.00, category: 'service' },
];

const MOCK_CLIENTS = [
  { id: 'cl1', name: 'Beatriz Cavalcante', email: 'beatriz@email.com', points: 1540, level: 'Diamante' },
  { id: 'cl2', name: 'Mariana Peixoto', email: 'mariana@email.com', points: 890, level: 'Ouro' },
  { id: 'cl3', name: 'Fernanda Rocha', email: 'fernanda@email.com', points: 210, level: 'Bronze' },
];

export default AdminDashboard;
