import React, { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, Search, Plus, Trash2, ShoppingCart, CreditCard, Users2,
  Layers, ShoppingBag, Banknote, QrCode, Scissors, Package, 
  ChevronRight, ChevronLeft, CheckCircle2, Calendar,
  TrendingUp, History, X, Clock, Eye, User, MessageSquare, Check, 
  Settings2, Tag, Ban, Truck, GraduationCap, Sparkles, UserPlus, UserCheck,
  Wallet, Unlock, ArrowUpCircle, ArrowDownCircle, Lock, ArrowDownRight, ArrowUpRight,
  AlertTriangle, Phone, MapPin, Edit3, Save, MoreHorizontal, Briefcase, FileText, Target,
  Minus, Percent, Wallet2
} from 'lucide-react';
import { ADMIN_MENU } from '../constants';
import { MOCK_PRODUCTS, MOCK_HAIRS, MOCK_APPOINTMENTS as INITIAL_APPOINTMENTS, MOCK_SAVED_HAIR, MOCK_COURSES } from '../services/mockData';

// --- REGRAS DE NEGÓCIO CABELO ---
const HAIR_PRICING_RULES: any = {
  texture: { 'CACHEADO': 150, 'LISO': 100, 'ONDULADO': 100 },
  length: {
    '50CM': 10, '55CM': 50, '60CM': 100, '65CM': 150, '70CM': 200, 
    '75CM': 250, '80CM': 300, '90CM': 350, '100CM': 400, '110CM': 500, '120CM': 600
  },
  circumference: {
    '6CM': 0, '7CM': 30, '8CM': 50, '9CM': 70, '10CM': 130, '11CM': 150, 
    '12CM': 200, '13CM': 230, '14CM': 270, '15CM': 350, '16CM': 450
  },
  type: { 'VIRGEM': 100, 'SELAGEM': 100, 'PINTADO': 100 },
  ends: { 'CHEIA': 0, 'FINA': 0, 'QUEBRADA': 0 },
  quality: { 'EXCELENTE - FIOS FINO': 50, 'BOM - FIOS GROSSOS': 50, 'RUIM - COM PONTA DUPLA/FREZE': -50 }
};

const MOCK_SERVICES = [
  { id: 's1', name: 'Aplicação de Mega Hair', basePrice: 1200, category: 'service' },
  { id: 's2', name: 'Manutenção Mensal', basePrice: 450, category: 'service' },
  { id: 's3', name: 'Coloração LS Profissional', basePrice: 350, category: 'service' },
  { id: 's4', name: 'Corte e Escova Master', basePrice: 180, category: 'service' },
];

const MOCK_TEAM = [
  { id: 't1', name: 'Célia Hair', role: 'Diretora Master', commissionRate: 0.5, appraiserGoal: 50 },
  { id: 't2', name: 'Janice Lima', role: 'Especialista Mega', commissionRate: 0.4, appraiserGoal: 30 },
  { id: 't3', name: 'Roberto Color', role: 'Colorista Master', commissionRate: 0.3, appraiserGoal: 20 },
  { id: 't4', name: 'Ana Estética', role: 'Especialista Facial', commissionRate: 0.3, appraiserGoal: 10 },
];

const MOCK_APPRAISAL_HISTORY = [
  { id: 'h1', appraiserId: 't1', date: '2023-11-25 10:30', client: 'Beatriz Silva', specs: 'Liso 60cm', value: 850.00 },
  { id: 'h2', appraiserId: 't2', date: '2023-11-25 11:45', client: 'Clara Nunes', specs: 'Cacheado 70cm', value: 1200.00 },
  { id: 'h3', appraiserId: 't1', date: '2023-11-24 14:20', client: 'Marina Lemos', specs: 'Ondulado 55cm', value: 600.00 },
];

const MOCK_CLIENTS_LIST = [
  { id: 'c1', name: 'Marta Helena', whatsapp: '(11) 99999-0001', points: 150, spent: 4500.00 },
  { id: 'c2', name: 'Sofia Costa', whatsapp: '(11) 99999-0002', points: 45, spent: 1200.00 },
  { id: 'c3', name: 'Julia Lima', whatsapp: '(11) 99999-0003', points: 300, spent: 8900.00 },
];

const PAYMENT_METHODS = [
  { id: 'dinheiro', label: 'Dinheiro', icon: <Banknote size={18} className="text-emerald-500" /> },
  { id: 'cartao', label: 'Cartão', icon: <CreditCard size={18} className="text-blue-500" /> },
  { id: 'pix', label: 'PIX', icon: <QrCode size={18} className="text-cyan-500" /> },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dash');
  
  // Gestão de Dados e Estoque
  const [localTeam, setLocalTeam] = useState(MOCK_TEAM);
  const [localClients, setLocalClients] = useState(MOCK_CLIENTS_LIST);
  const [localProducts, setLocalProducts] = useState(MOCK_PRODUCTS.map(p => ({ ...p, unit: 'unid', costPrice: p.price * 0.4 })));
  const [localHairs, setLocalHairs] = useState(MOCK_HAIRS.map(h => ({ ...h, unit: 'g', costPrice: h.price * 0.6 })));
  const [localCourses, setLocalCourses] = useState(MOCK_COURSES);
  
  // Estados Avalistas
  const [selectedAppraiser, setSelectedAppraiser] = useState<any>(null);
  const [appraisalHistory, setAppraisalHistory] = useState(MOCK_APPRAISAL_HISTORY);

  // Caixa e Transações
  const [isCashierOpen, setIsCashierOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState<number | string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showCashierModal, setShowCashierModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ description: '', value: '' as number | string });

  // PDV e Pedidos
  const [pdvCart, setPdvCart] = useState<any[]>([]);
  const [pdvCheckoutStep, setPdvCheckoutStep] = useState<'cart' | 'partners' | 'payment'>('cart');
  const [selectedPartners, setSelectedPartners] = useState<{id: string, name: string, amount: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'Fernanda Lima', items: ['Shampoo LS Célia Profissional'], itemIds: ['p1'], total: 209.90, status: 'pending', whatsapp: '(11) 98888-7777' },
  ]);

  // Modais Genéricos
  const [showItemModal, setShowItemModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemType, setItemType] = useState<'product' | 'hair' | 'course' | 'team' | 'client' | 'goal'>('product');

  // Cálculo de Estatísticas Consolidadas
  const stats = useMemo(() => {
    const startVal = typeof openingBalance === 'number' ? openingBalance : 0;
    
    // Entradas categorizadas
    const inputs = transactions.filter(t => t.type === 'Entrada');
    const productsSales = inputs.reduce((acc, t) => acc + (t.categories?.products || 0), 0);
    const hairsSales = inputs.reduce((acc, t) => acc + (t.categories?.hairs || 0), 0);
    const servicesSales = inputs.reduce((acc, t) => acc + (t.categories?.services || 0), 0);
    const coursesSales = inputs.reduce((acc, t) => acc + (t.categories?.courses || 0), 0);
    
    // Saídas (Despesas + Comissões + Pagamentos Clientes Cabelo)
    const outputs = transactions.filter(t => t.type === 'Saída');
    const commissionsPayout = transactions.filter(t => t.description.includes('COMISSÃO') || t.description.includes('GANHO')).reduce((acc, t) => acc + t.value, 0);
    const totalExpenses = outputs.reduce((acc, t) => acc + t.value, 0);

    const totalIn = inputs.reduce((acc, t) => acc + t.value, 0);
    const totalOut = totalExpenses;
    
    // Lucro Bruto (Vendas - Custo Fixo de Parceiros/Avalistas)
    const netProfit = servicesSales - commissionsPayout;

    return { 
      totalIn, 
      totalOut, 
      final: startVal + totalIn - totalOut, 
      productsSales, 
      hairsSales, 
      servicesSales, 
      coursesSales,
      commissionsPayout,
      netProfit
    };
  }, [openingBalance, transactions]);

  // --- LÓGICA DE VENDA PDV ---
  const finalizeSale = (methodLabel: string) => {
    const timestamp = Date.now();
    const timeStr = new Date().toLocaleTimeString('pt-BR');

    // 1. Categorização do Carrinho
    const saleData = {
      services: pdvCart.filter(i => i.category === 'service').reduce((acc, i) => acc + i.price, 0),
      products: pdvCart.filter(i => i.category === 'product').reduce((acc, i) => acc + i.price, 0),
      hairs: pdvCart.filter(i => i.category === 'hair').reduce((acc, i) => acc + i.price, 0),
      courses: pdvCart.filter(i => i.category === 'course').reduce((acc, i) => acc + i.price, 0),
    };

    // 2. Transação Principal
    const mainTransaction = {
      id: timestamp,
      date: timeStr,
      description: `Venda Direta [PDV]`,
      method: methodLabel,
      type: 'Entrada',
      value: pdvCart.reduce((acc, i) => acc + i.price, 0),
      categories: saleData
    };

    // 3. Transações de Comissões (Saídas de Caixa)
    const commissionTransactions = selectedPartners.map(p => ({
      id: timestamp + Math.random(),
      date: timeStr,
      description: `COMISSÃO: ${p.name}`,
      method: '-',
      type: 'Saída',
      value: p.amount
    }));

    // 4. Atualização de Estoque
    pdvCart.forEach(item => {
      if (item.category === 'product') {
        setLocalProducts(prev => prev.map(p => p.id === item.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p));
      }
      if (item.category === 'hair') {
        setLocalHairs(prev => prev.map(h => h.id === item.id ? { ...h, stock: Math.max(0, h.stock - 1) } : h));
      }
    });

    setTransactions([mainTransaction, ...commissionTransactions, ...transactions]);
    setPdvCart([]);
    setSelectedPartners([]);
    setPdvCheckoutStep('cart');
    alert('Venda processada e estoque atualizado!');
  };

  // --- LÓGICA DE PEDIDOS ONLINE ---
  const handleDeliverOrder = (order: any) => {
    const timestamp = Date.now();
    const timeStr = new Date().toLocaleTimeString('pt-BR');

    // Adiciona ao caixa
    const transaction = {
      id: timestamp,
      date: timeStr,
      description: `Venda Online [ENTREGA]: ${order.id}`,
      method: 'ONLINE',
      type: 'Entrada',
      value: order.total,
      categories: { products: order.total } // Simplificado
    };

    // Desconta estoque
    order.itemIds?.forEach((id: string) => {
      setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock - 1) } : p));
    });

    setTransactions([transaction, ...transactions]);
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'delivered' } : o));
    alert('Pedido entregue e contabilizado no caixa!');
  };

  // --- LÓGICA DE AVALIAÇÃO (COMPRA DE CABELO) ---
  const handleConfirmHairPurchase = (appraiserId: string, clientName: string, value: number, specs: string) => {
    const timestamp = Date.now();
    const timeStr = new Date().toLocaleTimeString('pt-BR');

    // 1. Saída de Caixa para pagar o Cliente
    const paymentTransaction = {
      id: timestamp,
      date: timeStr,
      description: `COMPRA CABELO: ${clientName} (${specs})`,
      method: 'DINHEIRO',
      type: 'Saída',
      value: value
    };

    // 2. Ganho fixo de R$ 50 para o Avalista (Saída de Caixa/Comissão)
    const appraiser = localTeam.find(t => t.id === appraiserId);
    const bonusTransaction = {
      id: timestamp + 1,
      date: timeStr,
      description: `GANHO AVALISTA (R$ 50): ${appraiser?.name || 'Avalista'}`,
      method: '-',
      type: 'Saída',
      value: 50
    };

    setTransactions([paymentTransaction, bonusTransaction, ...transactions]);
    setAppraisalHistory([{ id: 'h' + timestamp, appraiserId, date: timeStr, client: clientName, value, specs }, ...appraisalHistory]);
    alert(`Compra de R$ ${value} registrada. Avalista recebeu R$ 50 de bônus fixo.`);
  };

  const handleOpenCashier = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCashierOpen(true);
    setShowCashierModal(false);
  };

  const openAddModal = (type: any) => {
    setItemType(type);
    setModalMode('add');
    let defaultItem: any = { name: '', stock: 0, price: 0, unit: 'unid' };
    if (type === 'team') defaultItem = { name: '', role: 'Avalista', commissionRate: 0.3, appraiserGoal: 10 };
    setEditingItem(defaultItem);
    setShowItemModal(true);
  };

  // Add openEditModal to handle editing existing items
  const openEditModal = (type: any, item: any) => {
    setItemType(type);
    setModalMode('edit');
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const data = editingItem;
    if (modalMode === 'add') {
      data.id = 'n' + Date.now();
      if (itemType === 'team') setLocalTeam([...localTeam, data]);
      if (itemType === 'product') setLocalProducts([...localProducts, { ...data, costPrice: data.price * 0.4 }]);
    } else {
      if (itemType === 'team' || itemType === 'goal') setLocalTeam(localTeam.map(t => t.id === data.id ? data : t));
      if (itemType === 'product') setLocalProducts(localProducts.map(p => p.id === data.id ? data : p));
    }
    setShowItemModal(false);
  };

  const togglePartnerSelection = (partner: any) => {
    const isSelected = selectedPartners.find(p => p.id === partner.id);
    if (isSelected) {
      setSelectedPartners(selectedPartners.filter(p => p.id !== partner.id));
    } else {
      const suggestedAmount = pdvCart.reduce((acc, i) => acc + (i.category === 'service' ? i.price * partner.commissionRate : 0), 0);
      setSelectedPartners([...selectedPartners, { id: partner.id, name: partner.name, amount: suggestedAmount }]);
    }
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'dash':
        return (
          <div className="space-y-8 animate-in fade-in">
            <header>
               <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard <span className="text-yellow-500">Financeiro</span></h2>
               <p className="text-zinc-500 text-sm mt-1">Visão geral de faturamento, estoque e comissões.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricBox label="Saldo em Caixa" value={`R$ ${stats.final.toFixed(2)}`} status={isCashierOpen ? "Ativo" : "Fechado"} color={isCashierOpen ? "text-emerald-600" : "text-red-500"} icon={<Wallet size={20}/>} />
              <MetricBox label="Vendas Produtos" value={`R$ ${stats.productsSales.toFixed(2)}`} status="Online + PDV" color="text-blue-600" icon={<ShoppingBag size={20}/>} />
              <MetricBox label="Vendas Cabelos" value={`R$ ${stats.hairsSales.toFixed(2)}`} status="Lote / Estoque" color="text-purple-600" icon={<Sparkles size={20}/>} />
              <MetricBox label="Lucro Serviços" value={`R$ ${stats.netProfit.toFixed(2)}`} status="Pós-Comissões" color="text-emerald-600" icon={<TrendingUp size={20}/>} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 p-10 bg-white border border-zinc-200 rounded-[3rem] shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Resumo de Saídas (Comissões & Despesas)</h4>
                    <ArrowDownCircle size={18} className="text-rose-500" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex items-center gap-3"><div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><Percent size={18}/></div><span className="text-sm font-bold text-zinc-800">Total Comissões Pagas</span></div>
                        <span className="text-lg font-black text-rose-600">R$ {stats.commissionsPayout.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex items-center gap-3"><div className="p-2 bg-zinc-200 text-zinc-600 rounded-xl"><Wallet2 size={18}/></div><span className="text-sm font-bold text-zinc-800">Outras Despesas de Caixa</span></div>
                        <span className="text-lg font-black text-zinc-400">R$ {(stats.totalOut - stats.commissionsPayout).toFixed(2)}</span>
                     </div>
                  </div>
               </div>
               <div className="p-10 bg-zinc-950 text-white rounded-[3rem] shadow-xl flex flex-col justify-center text-center">
                  <p className="text-yellow-400 text-5xl font-black italic tracking-tighter mb-2">R$ {stats.totalIn.toFixed(2)}</p>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Entradas Brutas Hoje</p>
                  <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center px-4">
                     <div className="text-left">
                        <p className="text-rose-500 font-black text-lg">- R$ {stats.totalOut.toFixed(2)}</p>
                        <p className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">Saídas Totais</p>
                     </div>
                     <div className="text-right">
                        <p className="text-emerald-500 font-black text-lg">R$ {stats.final.toFixed(2)}</p>
                        <p className="text-[9px] uppercase font-bold text-zinc-600 tracking-widest">Saldo Final</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'avalistas':
        if (selectedAppraiser) {
          const history = appraisalHistory.filter(h => h.appraiserId === selectedAppraiser.id);
          const totalSpent = history.reduce((a, b) => a + b.value, 0);
          return (
            <div className="space-y-8 animate-in slide-in-from-right">
              <button onClick={() => setSelectedAppraiser(null)} className="flex items-center space-x-2 text-xs font-bold text-zinc-400 hover:text-black uppercase tracking-widest"><ChevronLeft size={16}/> Voltar para Lista</button>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 p-10 bg-zinc-950 text-white rounded-[3rem] shadow-xl relative overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Avalista Master</p>
                      <h3 className="text-3xl font-black italic tracking-tighter mb-8">{selectedAppraiser.name}</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5">
                           <span className="text-[10px] font-bold text-zinc-400 uppercase">Ganhos em Compras</span>
                           <span className="text-xl font-black text-yellow-400">R$ {history.length * 50}</span>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5">
                           <span className="text-[10px] font-bold text-zinc-400 uppercase">Meta Mensal</span>
                           <div className="flex items-center gap-3">
                              <span className="text-xl font-black">{selectedAppraiser.appraiserGoal} <span className="text-[10px] text-zinc-500">UNID</span></span>
                              <button onClick={() => openEditModal('goal', selectedAppraiser)} className="p-2 hover:bg-yellow-400 hover:text-black rounded-lg transition-all"><Edit3 size={14}/></button>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[3rem] overflow-hidden shadow-sm">
                   <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 italic">Histórico de Compras de Cabelo</h3>
                      <span className="text-[10px] font-bold text-zinc-400">Total Pago: R$ {totalSpent.toFixed(2)}</span>
                   </div>
                   <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400">
                         <tr><th className="px-8 py-5">Data</th><th className="px-8 py-5">Cliente</th><th className="px-8 py-5 text-right">Valor Pago</th><th className="px-8 py-5 text-center">Bônus Avalista</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                         {history.map(h => (
                           <tr key={h.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-8 py-5 text-zinc-400">{h.date}</td>
                              <td className="px-8 py-5 font-bold text-zinc-900">{h.client}</td>
                              <td className="px-8 py-5 text-right font-black">R$ {h.value.toFixed(2)}</td>
                              <td className="px-8 py-5 text-center"><span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black italic">R$ 50,00</span></td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-8 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-900">Gestão de <span className="text-yellow-500">Avalistas</span></h2>
                <button onClick={() => openAddModal('team')} className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold shadow-xl flex items-center gap-2 hover:bg-black transition-all"><UserPlus size={16}/> Novo Avalista</button>
             </header>
             <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black uppercase text-zinc-400">
                      <tr><th className="px-8 py-5">Avalista</th><th className="px-8 py-5 text-center">Volume (Mês)</th><th className="px-8 py-5 text-center">Meta</th><th className="px-8 py-5 text-right">Ações</th></tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-100">
                      {localTeam.filter(t => t.appraiserGoal).map(a => (
                        <tr key={a.id} className="hover:bg-zinc-50 transition-colors group">
                           <td className="px-8 py-5 font-bold text-zinc-900">{a.name}</td>
                           <td className="px-8 py-5 text-center font-black">{appraisalHistory.filter(h => h.appraiserId === a.id).length}</td>
                           <td className="px-8 py-5 text-center font-black text-zinc-300">{a.appraiserGoal}</td>
                           <td className="px-8 py-5 text-right">
                              <button onClick={() => setSelectedAppraiser(a)} className="px-5 py-2.5 bg-zinc-100 text-zinc-500 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-900 hover:text-white transition-all">Ver Ganhos</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'venda_direta':
        if (!isCashierOpen) return <div className="h-[60vh] flex items-center justify-center text-zinc-400 font-bold italic">Abra o caixa para iniciar vendas no PDV.</div>;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
             <div className="lg:col-span-7 space-y-6">
                <header className="flex justify-between items-center"><h2 className="text-xl font-bold text-zinc-900">PDV - Balcão</h2><div className="relative w-64"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} /><input type="text" placeholder="Filtrar catálogo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-zinc-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-yellow-400 transition-all" /></div></header>
                <div className="grid grid-cols-2 gap-4">
                   {[...MOCK_SERVICES, ...localProducts, ...localHairs].filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item: any, i) => (
                     <button key={i} onClick={() => { setPdvCart([...pdvCart, { ...item, tempId: Date.now() + Math.random(), price: item.price || item.basePrice || 0 }]); setPdvCheckoutStep('cart'); }} className={`p-5 bg-white border border-zinc-100 rounded-2xl flex items-center justify-between shadow-sm transition-all group hover:border-yellow-400`}>
                        <div className="flex items-center space-x-3 text-left overflow-hidden">
                           <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-300 group-hover:text-yellow-500 shrink-0">{item.basePrice ? <Scissors size={18} /> : <Package size={18} />}</div>
                           <div className="min-w-0">
                              <p className="text-[11px] font-bold text-zinc-800 truncate">{item.name}</p>
                              <p className="text-[10px] text-zinc-400 font-black">R$ {(item.price || item.basePrice).toFixed(2)} {item.stock !== undefined && `• Est: ${item.stock}`}</p>
                           </div>
                        </div>
                        <Plus size={16} className="text-zinc-200 group-hover:text-yellow-500 shrink-0" />
                     </button>
                   ))}
                </div>
             </div>
             <div className="lg:col-span-5 h-[75vh] sticky top-12 bg-white border border-zinc-200 rounded-[3rem] shadow-xl flex flex-col overflow-hidden">
                {pdvCheckoutStep === 'cart' && (
                  <>
                    <div className="p-8 border-b border-zinc-100 flex justify-between items-center"><h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Carrinho Ativo</h3><span className="bg-yellow-400 text-[10px] font-black px-3 py-1 rounded-full">{pdvCart.length} Itens</span></div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-4">
                       {pdvCart.map((c, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl group border border-zinc-100">
                            <div className="min-w-0 mr-4"><p className="text-xs font-bold text-zinc-800 truncate">{c.name}</p><p className="text-[10px] text-zinc-400 font-black">R$ {c.price.toFixed(2)}</p></div>
                            <button onClick={() => setPdvCart(pdvCart.filter(item => item.tempId !== c.tempId))} className="text-zinc-300 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                         </div>
                       ))}
                    </div>
                    <div className="p-8 bg-zinc-50 border-t border-zinc-100">
                       <div className="flex justify-between items-center mb-8"><span className="text-xs font-black uppercase text-zinc-500 tracking-widest">Subtotal</span><span className="text-3xl font-black italic tracking-tighter text-zinc-900">R$ {pdvCart.reduce((a, b) => a + b.price, 0).toFixed(2)}</span></div>
                       <button onClick={() => pdvCart.length > 0 && setPdvCheckoutStep('partners')} disabled={pdvCart.length === 0} className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-30">Vincular Comissões</button>
                    </div>
                  </>
                )}
                {pdvCheckoutStep === 'partners' && (
                  <>
                    <div className="p-8 border-b border-zinc-100"><button onClick={() => setPdvCheckoutStep('cart')} className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 mb-4 hover:text-black transition-colors"><ChevronLeft size={16} /> Voltar</button><h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 italic">Vincular Parceiros / Ganhos</h3></div>
                    <div className="flex-1 p-8 overflow-y-auto space-y-4">
                       {localTeam.map(partner => {
                         const isSelected = selectedPartners.find(p => p.id === partner.id);
                         return (
                           <div key={partner.id} onClick={() => togglePartnerSelection(partner)} className={`p-5 rounded-[2rem] border transition-all cursor-pointer ${isSelected ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-zinc-100 hover:border-zinc-300'}`}>
                              <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-zinc-700">{partner.name}</span>{isSelected && <CheckCircle2 size={16} className="text-yellow-500"/>}</div>
                              {isSelected && (
                                <div onClick={e => e.stopPropagation()} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-zinc-200">
                                   <span className="text-[9px] font-black text-zinc-400 italic">R$</span>
                                   <input type="number" value={isSelected.amount} onChange={e => setSelectedPartners(selectedPartners.map(p => p.id === partner.id ? {...p, amount: parseFloat(e.target.value) || 0} : p))} className="w-full bg-transparent outline-none font-black text-xs text-black" />
                                </div>
                              )}
                           </div>
                         );
                       })}
                    </div>
                    <div className="p-8 bg-zinc-50 border-t border-zinc-100"><button onClick={() => setPdvCheckoutStep('payment')} className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Escolher Pagamento</button></div>
                  </>
                )}
                {pdvCheckoutStep === 'payment' && (
                   <div className="flex-1 p-8 space-y-4">
                      <button onClick={() => setPdvCheckoutStep('partners')} className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 mb-6 hover:text-black transition-colors"><ChevronLeft size={16} /> Voltar</button>
                      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-6 italic">Método de Recebimento</h3>
                      {PAYMENT_METHODS.map(m => (
                        <button key={m.id} onClick={() => finalizeSale(m.label)} className="w-full flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl hover:border-yellow-400 transition-all group">
                           <div className="flex items-center space-x-4"><div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">{m.icon}</div><span className="text-xs font-bold text-zinc-700">{m.label}</span></div>
                           <ChevronRight size={16} className="text-zinc-200 group-hover:text-yellow-500 transition-colors" />
                        </button>
                      ))}
                   </div>
                )}
             </div>
          </div>
        );

      case 'produtos_online':
        return (
          <div className="space-y-8 animate-in fade-in">
             <header><h2 className="text-2xl font-bold text-zinc-900">Pedidos <span className="text-yellow-500">E-commerce</span></h2></header>
             <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black uppercase text-zinc-400">
                      <tr><th className="px-8 py-5">Pedido</th><th className="px-8 py-5">Cliente</th><th className="px-8 py-5">Valor</th><th className="px-8 py-5 text-center">Status</th><th className="px-8 py-5 text-right">Ações</th></tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                           <td className="px-8 py-5 font-bold text-zinc-900">{o.id}</td>
                           <td className="px-8 py-5"><div><p className="font-bold text-zinc-700">{o.customer}</p><p className="text-[10px] text-zinc-400">{o.whatsapp}</p></div></td>
                           <td className="px-8 py-5 font-black">R$ {o.total.toFixed(2)}</td>
                           <td className="px-8 py-5 text-center">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${o.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {o.status}
                              </span>
                           </td>
                           <td className="px-8 py-5 text-right flex justify-end gap-2">
                              {o.status === 'pending' && (
                                <button onClick={() => handleDeliverOrder(o)} className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 text-[10px] font-black uppercase italic"><Truck size={14}/> Entregar & Contabilizar</button>
                              )}
                              {o.status === 'delivered' && <CheckCircle2 className="text-emerald-500" size={20} />}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'caixa':
        return (
          <div className="space-y-8 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-900">Fluxo de <span className="text-yellow-500">Caixa Diário</span></h2>
                <div className="flex gap-3">
                   {isCashierOpen ? (
                     <>
                        <button onClick={() => setShowExpenseModal(true)} className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-all">Lançar Saída</button>
                        <button onClick={() => setIsCashierOpen(false)} className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">Fechar Turno</button>
                     </>
                   ) : (
                     <button onClick={() => setShowCashierModal(true)} className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3"><Unlock size={18}/> Abrir Caixa</button>
                   )}
                </div>
             </header>

             {isCashierOpen ? (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-9 bg-white border border-zinc-200 rounded-[3rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-black uppercase text-zinc-400">
                          <tr><th className="px-8 py-5">Horário</th><th className="px-8 py-5">Lançamento</th><th className="px-8 py-5">Método</th><th className="px-8 py-5 text-right">Valor</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                          <tr className="bg-zinc-50/20 italic text-zinc-400 font-bold"><td className="px-8 py-5">Início</td><td className="px-8 py-5">Abertura</td><td className="px-8 py-5">-</td><td className="px-8 py-5 text-right">R$ {Number(openingBalance).toFixed(2)}</td></tr>
                          {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-8 py-5 text-zinc-400">{t.date}</td>
                              <td className="px-8 py-5 font-bold flex items-center gap-2">{t.type === 'Entrada' ? <ArrowUpCircle size={16} className="text-emerald-500" /> : <ArrowDownCircle size={16} className="text-rose-500" />}{t.description}</td>
                              <td className="px-8 py-5"><span className="text-[10px] font-bold bg-zinc-100 px-3 py-1 rounded-lg">{t.method || '-'}</span></td>
                              <td className={`px-8 py-5 text-right font-black ${t.type === 'Entrada' ? 'text-zinc-900' : 'text-rose-600'}`}>R$ {t.value.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="lg:col-span-3">
                    <div className="p-10 bg-zinc-900 text-white rounded-[3rem] shadow-xl text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-3 italic">Saldo Consolidado</p>
                      <p className="text-5xl font-black tracking-tighter text-yellow-400 italic">R$ {stats.final.toFixed(2)}</p>
                    </div>
                  </div>
               </div>
             ) : (
               <div className="h-[40vh] flex flex-col items-center justify-center bg-white border border-dashed border-zinc-200 rounded-[3rem] text-center p-12"><Lock size={50} className="text-zinc-100 mb-6"/><button onClick={() => setShowCashierModal(true)} className="px-12 py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Ativar Caixa Diário</button></div>
             )}
          </div>
        );

      case 'estoque':
        return (
          <div className="space-y-8 animate-in fade-in pb-20">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-900">Controle de <span className="text-yellow-500">Estoque Global</span></h2>
                <div className="flex gap-4">
                  <button onClick={() => openAddModal('product')} className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold shadow-xl hover:bg-black transition-all">+ Add Produto</button>
                </div>
             </header>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                   <div className="p-8 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center"><h3 className="text-sm font-black uppercase text-zinc-900 italic">Produtos Balcão</h3><Tag size={18} className="text-zinc-300" /></div>
                   <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400">
                         <tr><th className="px-8 py-5">Nome</th><th className="px-8 py-5 text-center">Estoque</th><th className="px-8 py-5 text-right">Preço</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                         {localProducts.map(p => (
                           <tr key={p.id} className="hover:bg-zinc-50 group transition-colors">
                              <td className="px-8 py-5 font-bold text-zinc-800">{p.name}</td>
                              <td className="px-8 py-5 text-center"><span className={`px-3 py-1 rounded-lg font-black text-xs ${p.stock < 5 ? 'bg-rose-100 text-rose-600' : 'bg-zinc-100 text-zinc-600'}`}>{p.stock}</span></td>
                              <td className="px-8 py-5 text-right font-black">R$ {p.price.toFixed(2)}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                   <div className="p-8 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center"><h3 className="text-sm font-black uppercase text-zinc-900 italic">Lote de Cabelos</h3><Sparkles size={18} className="text-zinc-300" /></div>
                   <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400">
                         <tr><th className="px-8 py-5">Tipo</th><th className="px-8 py-5 text-center">Peso</th><th className="px-8 py-5 text-right">Preço</th></tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                         {localHairs.map(h => (
                           <tr key={h.id} className="hover:bg-zinc-50 transition-colors">
                              <td className="px-8 py-5 font-bold text-zinc-800">{h.name}</td>
                              <td className="px-8 py-5 text-center font-black">{h.stock}g</td>
                              <td className="px-8 py-5 text-right font-black">R$ {h.price.toFixed(2)}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      default:
        return <div className="h-[60vh] flex items-center justify-center text-zinc-300 font-bold italic uppercase text-xs tracking-[0.5em]">Funcionalidade Admin LS Célia em Construção...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F8FA] text-zinc-900 relative overflow-hidden font-sans">
      <aside className="hidden md:flex w-72 lg:w-80 bg-zinc-950 text-white flex-col z-30 border-r border-zinc-800">
        <div className="p-12 border-b border-zinc-800"><h2 className="text-3xl font-black tracking-tighter italic">LS <span className="text-yellow-400 text-4xl">ADMIN</span></h2></div>
        <nav className="flex-grow p-8 space-y-2 overflow-y-auto scrollbar-hide">
          {ADMIN_MENU.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedAppraiser(null); }} className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-yellow-400 text-black shadow-2xl scale-[1.05]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
              <span className={activeTab === item.id ? 'text-black' : 'text-zinc-500'}>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-grow overflow-y-auto scrollbar-hide p-10 md:p-16"><div className="max-w-7xl mx-auto">{renderSection()}</div></main>

      {/* MODAL GENÉRICO */}
      {showItemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white rounded-[3rem] p-12 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
              <button onClick={() => setShowItemModal(false)} className="absolute top-10 right-10 text-zinc-300 hover:text-black transition-colors"><X size={24} /></button>
              <h3 className="text-2xl font-black italic mb-10 tracking-tighter uppercase">Gestão de <span className="text-yellow-500">{itemType === 'goal' ? 'Meta' : 'Dados'}</span></h3>
              <form onSubmit={handleSaveItem} className="space-y-8">
                 {itemType === 'goal' ? (
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Definir Novo Volume Mensal (UNID)</label>
                       <div className="flex items-center gap-6">
                          <button type="button" onClick={() => setEditingItem({...editingItem, appraiserGoal: Math.max(0, editingItem.appraiserGoal - 1)})} className="p-5 bg-zinc-100 rounded-2xl hover:bg-yellow-400 transition-all shadow-sm"><Minus size={24}/></button>
                          <input type="number" value={editingItem.appraiserGoal} onChange={e => setEditingItem({...editingItem, appraiserGoal: parseInt(e.target.value) || 0})} className="w-full text-center bg-zinc-50 border-2 border-zinc-100 rounded-3xl py-8 text-5xl font-black italic outline-none" />
                          <button type="button" onClick={() => setEditingItem({...editingItem, appraiserGoal: editingItem.appraiserGoal + 1})} className="p-5 bg-zinc-100 rounded-2xl hover:bg-yellow-400 transition-all shadow-sm"><Plus size={24}/></button>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Nome / Identificação</label><input required value={editingItem?.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Valor de Venda (R$)</label><input required type="number" value={editingItem?.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-6 py-4 font-bold outline-none" /></div>
                    </div>
                 )}
                 <button type="submit" className="w-full py-6 bg-zinc-900 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-yellow-400 hover:text-black transition-all">Confirmar e Salvar</button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL CAIXA */}
      {showCashierModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white rounded-[3rem] p-12 shadow-2xl w-full max-w-md">
              <h3 className="text-2xl font-black italic mb-10 tracking-tighter uppercase">Abertura <span className="text-yellow-500">Caixa</span></h3>
              <form onSubmit={handleOpenCashier} className="space-y-8">
                 <div className="space-y-3"><label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Saldo Inicial em Mão</label><input type="number" required placeholder="0.00" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl px-8 py-5 font-black text-3xl outline-none italic" /></div>
                 <button type="submit" className="w-full py-6 bg-zinc-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-yellow-400 hover:text-black transition-all">Iniciar Jornada</button>
              </form>
           </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white rounded-[3rem] p-12 shadow-2xl w-full max-w-md">
              <h3 className="text-xl font-black italic mb-8 text-rose-500 uppercase tracking-tighter">Saída de Valor</h3>
              <form onSubmit={e => { e.preventDefault(); const v = parseFloat(expenseData.value as string) || 0; setTransactions([{ id: Date.now(), date: new Date().toLocaleTimeString('pt-BR'), description: `SAÍDA: ${expenseData.description}`, method: 'DINHEIRO', type: 'Saída', value: v }, ...transactions]); setShowExpenseModal(false); }} className="space-y-6">
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Finalidade</label><input required placeholder="Ex: Material Escritório" value={expenseData.description} onChange={e => setExpenseData({...expenseData, description: e.target.value})} className="w-full p-5 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold text-sm outline-none" /></div>
                 <div className="space-y-2"><label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Valor Retirado (R$)</label><input type="number" required placeholder="0.00" value={expenseData.value} onChange={e => setExpenseData({...expenseData, value: e.target.value})} className="w-full p-5 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold text-sm outline-none" /></div>
                 <button type="submit" className="w-full py-6 bg-rose-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-rose-700 transition-all">Registrar Retirada</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const MetricBox = ({ label, value, status, color, icon }: any) => (
  <div className="p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:border-zinc-300 transition-all group">
    <div className="flex justify-between items-start mb-6"><span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span><div className="p-3 bg-zinc-50 rounded-xl text-zinc-400 group-hover:text-zinc-900 transition-colors shadow-inner">{icon}</div></div>
    <div className="flex items-baseline space-x-2"><p className="text-3xl font-black text-zinc-900 leading-none tracking-tighter italic">{value}</p></div>
    <p className={`text-[9px] font-black uppercase mt-4 tracking-[0.2em] ${color}`}>{status}</p>
  </div>
);

export default AdminDashboard;