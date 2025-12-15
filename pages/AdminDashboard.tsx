
import React, { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, Search, Plus, Trash2, ShoppingCart, CreditCard, Users2,
  Layers, ShoppingBag, Banknote, QrCode, Scissors, Package, 
  ChevronRight, ChevronLeft, CheckCircle2, Calendar as CalendarIcon,
  TrendingUp, History, X, Clock, Eye, User, MessageSquare, Check, 
  Settings2, Tag, Ban, Truck, GraduationCap, Sparkles, UserPlus, UserCheck,
  Wallet, Unlock, ArrowUpCircle, ArrowDownCircle, Lock, ArrowDownRight, ArrowUpRight,
  AlertTriangle, Phone, MapPin, Edit3, Save, MoreHorizontal, Briefcase, FileText, Target,
  Minus, Percent, Wallet2, Settings, UserMinus, RefreshCw, LayoutGrid, List, Landmark, UserCheck2,
  ChevronLeftCircle, ChevronRightCircle, BookOpen, Image as ImageIcon, Megaphone, Ticket, Layout as LayoutIcon
} from 'lucide-react';
import { ADMIN_MENU } from '../constants';
import { MOCK_PRODUCTS, MOCK_HAIRS, MOCK_APPOINTMENTS as INITIAL_APPOINTMENTS, MOCK_SAVED_HAIR, MOCK_COURSES } from '../services/mockData';
import { UserRole, Product } from '../types';

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
  ],
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dash');
  
  // --- ESTADOS DE DADOS ---
  const [localTeam, setLocalTeam] = useState(MOCK_TEAM);
  const [localProducts, setLocalProducts] = useState(MOCK_PRODUCTS);
  const [localHairs, setLocalHairs] = useState(MOCK_HAIRS);
  const [localCourses, setLocalCourses] = useState(MOCK_COURSES);
  const [localAppointments, setLocalAppointments] = useState(INITIAL_APPOINTMENTS);
  const [localSavedHair, setLocalSavedHair] = useState(MOCK_SAVED_HAIR);
  const [localClients, setLocalClients] = useState(MOCK_CLIENTS);
  const [pricingRules, setPricingRules] = useState(INITIAL_PRICING_RULES);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // --- ESTADOS DE GESTÃO DE SITE & MARKETING ---
  const [homeContent, setHomeContent] = useState({
    heroTitle: 'EXCELÊNCIA EM CABELOS E EDUCAÇÃO',
    heroSubtitle: 'O salão referência em Mega Hair e a academia que forma os melhores profissionais do Brasil.',
    bannerUrl: 'https://picsum.photos/1920/1080?grayscale&random=hero'
  });
  
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Treinamento Master', target: 'Avalistas', date: '2023-12-01', status: 'Ativo', message: 'Reunião de alinhamento técnico às 14h.' },
    { id: 2, title: 'Promoção de Verão', target: 'Todos', date: '2023-11-28', status: 'Ativo', message: 'Desconto de 20% em todos os shampoos.' }
  ]);

  const [promotions, setPromotions] = useState([
    { id: 1, code: 'MASTER10', discount: '10%', type: 'Cupom', active: true },
    { id: 2, code: 'ACADEMY20', discount: '20%', type: 'Aluno Exclusive', active: true }
  ]);

  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  // --- ESTADOS AGENDAMENTO ---
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(true);

  // --- ESTADOS PDV (VENDA DIRETA) ---
  const [pdvCart, setPdvCart] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<any[]>([]);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'UNICO' | 'MISTO'>('UNICO');
  const [payment1, setPayment1] = useState({ method: 'DINHEIRO', value: '' });

  // --- ESTADOS CAIXA ---
  const [isCashierOpen, setIsCashierOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState<string>('');
  const [showCashierModal, setShowCashierModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ description: '', value: '' });

  // --- ESTADOS MODAIS GERAIS ---
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAppraiserModal, setShowAppraiserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showHairModal, setShowHairModal] = useState(false);

  // --- FORMULÁRIOS ---
  const [appraiserSubTab, setAppraiserSubTab] = useState<'list' | 'pricing'>('list');

  // --- CÁLCULOS ---
  const cartTotal = useMemo(() => pdvCart.reduce((acc, i) => acc + i.price, 0), [pdvCart]);
  const stats = useMemo(() => {
    const startVal = parseFloat(openingBalance) || 0;
    const totalIn = transactions.filter(t => t.type === 'Entrada').reduce((acc, t) => acc + t.value, 0);
    const totalOut = transactions.filter(t => t.type === 'Saída').reduce((acc, t) => acc + t.value, 0);
    return { totalIn, totalOut, final: startVal + totalIn - totalOut };
  }, [openingBalance, transactions]);

  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, date: dateStr });
    }
    return days;
  }, [currentCalendarDate]);

  const handleFinalizeSale = () => {
    if (pdvCart.length === 0) return;
    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'Entrada',
      description: `Venda PDV - ${pdvCart.length} itens`,
      value: cartTotal,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setPdvCart([]);
    setSelectedPartners([]);
    setShowFinalizeModal(false);
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'dash':
        return (
          <div className="space-y-10 animate-in fade-in">
            <header>
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase italic">Painel <span className="text-yellow-500">Master</span></h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">LS Célia Hair v5.3 - Master Administrative Console</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricBox label="Caixa" value={`R$ ${stats.final.toFixed(2)}`} status={isCashierOpen ? "Ativo" : "Fechado"} color={isCashierOpen ? "text-emerald-600" : "text-rose-500"} icon={<Wallet size={20}/>} />
              <MetricBox label="Agenda" value={localAppointments.length} status="Hoje" color="text-blue-600" icon={<CalendarIcon size={20}/>} />
              <MetricBox label="Clientes" value={localClients.length} status="Base" color="text-purple-600" icon={<Users2 size={20}/>} />
              <MetricBox label="Estoque" value={localProducts.filter(p => p.stock < 10).length} status="Alertas" color="text-amber-600" icon={<Package size={20}/>} />
            </div>
            <div className="p-16 bg-zinc-950 text-white rounded-[4.5rem] shadow-2xl text-center border-4 border-yellow-400/20">
              <p className="text-yellow-400 text-7xl font-black italic tracking-tighter mb-4">R$ {stats.totalIn.toFixed(2)}</p>
              <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.4em]">Faturamento do Dia</p>
            </div>
          </div>
        );

      case 'site_mkt':
        return (
          <div className="space-y-12 animate-in fade-in">
            <header>
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase italic">Gestão de <span className="text-yellow-500">Site & Marketing</span></h2>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">CMS & Central de Campanhas LS Célia Hair</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* EDITOR DA HOME */}
              <div className="bg-white border-2 border-zinc-100 rounded-[4rem] p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-zinc-950 text-yellow-400 rounded-3xl"><ImageIcon size={24}/></div>
                  <h3 className="text-xl font-black uppercase italic">Aparência do Site</h3>
                </div>
                
                <div className="space-y-6 italic font-bold">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Título do Banner Principal</label>
                    <input 
                      value={homeContent.heroTitle} 
                      onChange={(e) => setHomeContent({...homeContent, heroTitle: e.target.value.toUpperCase()})}
                      className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-yellow-400 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Texto de Apoio (Subtítulo)</label>
                    <textarea 
                      value={homeContent.heroSubtitle} 
                      onChange={(e) => setHomeContent({...homeContent, heroSubtitle: e.target.value})}
                      rows={3}
                      className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-yellow-400 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">URL da Imagem de Banner</label>
                    <input 
                      value={homeContent.bannerUrl} 
                      onChange={(e) => setHomeContent({...homeContent, bannerUrl: e.target.value})}
                      className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-yellow-400 text-sm"
                    />
                  </div>
                  <div className="p-8 bg-zinc-950 rounded-[2.5rem] border-2 border-dashed border-zinc-800 text-center">
                    <ImageIcon size={40} className="mx-auto text-zinc-700 mb-4" />
                    <button className="px-8 py-3 bg-yellow-400 text-black text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all">Upload Novo Banner</button>
                    <p className="text-[9px] text-zinc-600 mt-4 uppercase tracking-widest">Formatos aceitos: JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                  <button onClick={() => alert('Conteúdo publicado!')} className="w-full py-7 bg-zinc-950 text-white rounded-[2.5rem] font-black uppercase text-xs shadow-xl hover:bg-black transition-all active:scale-95">Publicar Alterações</button>
                </div>
              </div>

              {/* MARKETING: COMUNICADOS E PROMOÇÕES */}
              <div className="space-y-10">
                <div className="bg-white border-2 border-zinc-100 rounded-[4rem] p-10 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-zinc-950 text-yellow-400 rounded-3xl"><Megaphone size={24}/></div>
                      <h3 className="text-xl font-black uppercase italic">Comunicados</h3>
                    </div>
                    <button onClick={() => setShowAnnounceModal(true)} className="p-4 bg-zinc-100 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all"><Plus size={20}/></button>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 flex justify-between items-center group">
                        <div className="flex-1">
                          <p className="text-xs font-black uppercase italic text-zinc-900 mb-1">{ann.title}</p>
                          <p className="text-[10px] text-zinc-500 line-clamp-1">{ann.message}</p>
                          <div className="flex gap-2 mt-2">
                             <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-zinc-900 text-white rounded-full">Alvo: {ann.target}</span>
                             <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-yellow-400 text-black rounded-full">{ann.status}</span>
                          </div>
                        </div>
                        <button onClick={() => setAnnouncements(announcements.filter(a => a.id !== ann.id))} className="ml-4 p-3 text-zinc-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    {announcements.length === 0 && <p className="text-center text-zinc-300 py-10 italic uppercase font-black text-xs">Nenhum comunicado ativo</p>}
                  </div>
                </div>

                <div className="bg-zinc-950 text-white rounded-[4rem] p-10 shadow-xl space-y-8 border border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-yellow-400 text-black rounded-3xl"><Ticket size={24}/></div>
                      <h3 className="text-xl font-black uppercase italic">Promoções & Cupons</h3>
                    </div>
                    <button onClick={() => setShowPromoModal(true)} className="p-4 bg-zinc-900 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all border border-zinc-800"><Plus size={20}/></button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {promotions.map(promo => (
                      <div key={promo.id} className="p-6 bg-zinc-900 border border-white/5 rounded-3xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-yellow-400/10 transition-all rotate-12"><Ticket size={80}/></div>
                        <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">{promo.type}</p>
                        <p className="text-2xl font-black text-yellow-400 tracking-tighter italic">{promo.code}</p>
                        <p className="text-[10px] font-black mt-2 uppercase">Desconto: <span className="text-white">{promo.discount}</span></p>
                        <button onClick={() => setPromotions(promotions.filter(p=>p.id!==promo.id))} className="absolute top-4 right-4 text-zinc-700 hover:text-rose-500"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'caixa':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-zinc-900 uppercase italic">Caixa <span className="text-yellow-500">Master</span></h2>
                <div className="flex gap-4">
                  {isCashierOpen ? (
                    <button onClick={() => setIsCashierOpen(false)} className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs italic">Fechar Turno</button>
                  ) : (
                    <button onClick={() => setShowCashierModal(true)} className="px-10 py-5 bg-yellow-400 text-black rounded-3xl font-black uppercase text-xs italic shadow-xl">Abrir Caixa</button>
                  )}
                </div>
             </header>
             {isCashierOpen ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-9 bg-white border border-zinc-100 rounded-[3.5rem] overflow-hidden">
                      <table className="w-full text-left text-sm italic">
                        <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400"><tr><th className="px-10 py-6">Hora</th><th className="px-10 py-6">Movimentação</th><th className="px-10 py-6 text-right">Valor</th></tr></thead>
                        <tbody className="divide-y divide-zinc-50 font-bold">
                           <tr className="text-zinc-400"><td className="px-10 py-6 uppercase">Abertura</td><td className="px-10 py-6 uppercase">Fundo de Manejo</td><td className="px-10 py-6 text-right font-black">R$ {parseFloat(openingBalance || '0').toFixed(2)}</td></tr>
                           {transactions.map(t => (
                             <tr key={t.id}><td className="px-10 py-6 text-zinc-400">{t.date}</td><td className="px-10 py-6 uppercase">{t.description}</td><td className={`px-10 py-6 text-right font-black ${t.type === 'Entrada' ? 'text-zinc-900' : 'text-rose-600'}`}>R$ {t.value.toFixed(2)}</td></tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                   <div className="lg:col-span-3 p-10 bg-zinc-950 text-white rounded-[3.5rem] text-center shadow-xl h-fit border border-white/5">
                      <p className="text-[10px] font-black uppercase text-zinc-500 mb-4">Saldo Atual</p>
                      <p className="text-5xl font-black text-yellow-400 italic tracking-tighter">R$ {stats.final.toFixed(2)}</p>
                   </div>
                </div>
             ) : <div className="h-64 flex items-center justify-center bg-white border-2 border-dashed border-zinc-200 rounded-[4.5rem] text-zinc-300 font-black uppercase italic">Ponto de Venda Inativo</div>}
          </div>
        );

      case 'agendamento':
        const filteredAppointments = localAppointments.filter(app => app.date === selectedDay);
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in h-full">
            <div className="lg:col-span-7 space-y-8">
              <header className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-zinc-900 uppercase italic">Agenda <span className="text-yellow-500">Pro</span></h2>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100">
                  <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1)))} className="p-2 hover:bg-zinc-50 rounded-xl transition-all"><ChevronLeft size={20}/></button>
                  <span className="text-[10px] font-black uppercase italic w-32 text-center">{currentCalendarDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1)))} className="p-2 hover:bg-zinc-50 rounded-xl transition-all"><ChevronRight size={20}/></button>
                </div>
              </header>
              <div className="bg-white border-2 border-zinc-100 rounded-[4rem] p-10 shadow-sm">
                <div className="grid grid-cols-7 gap-2 mb-4 font-black text-[9px] text-zinc-300 text-center uppercase tracking-widest">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-3">
                  {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} className="aspect-square"></div>;
                    const hasAppts = localAppointments.some(app => app.date === d.date);
                    const isSelected = selectedDay === d.date;
                    return (
                      <button key={i} onClick={() => setSelectedDay(d.date)} className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all hover:scale-110 active:scale-95 ${isSelected ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100'}`}>
                        <span className="text-xs font-black">{d.day}</span>
                        {hasAppts && <div className={`absolute bottom-2 w-1 h-1 rounded-full ${isSelected ? 'bg-yellow-400' : 'bg-black'}`}></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col space-y-6">
               <div className="bg-zinc-950 text-white rounded-[4rem] p-12 shadow-2xl flex-grow overflow-hidden flex flex-col border border-white/5 relative">
                  <header className="flex justify-between items-center mb-10">
                    <div><h3 className="text-[10px] font-black uppercase text-zinc-500 italic">Marcações para:</h3><p className="text-xl font-black text-yellow-400 italic uppercase">{selectedDay ? new Date(selectedDay + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : 'Selecione'}</p></div>
                    <button onClick={() => setShowAppointmentModal(true)} className="p-5 bg-yellow-400 text-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"><Plus size={20}/></button>
                  </header>
                  <div className="flex-grow overflow-y-auto scrollbar-hide space-y-4">
                    {filteredAppointments.map(app => (
                      <div key={app.id} className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl flex justify-between items-center group italic">
                        <div><div className="flex items-center gap-2 mb-1"><Clock size={12} className="text-yellow-400"/><p className="text-sm font-black text-white uppercase tracking-tighter">{app.time}</p></div><p className="text-xs font-bold text-zinc-300 uppercase">{app.clientName}</p><p className="text-[9px] font-black text-zinc-600 uppercase mt-2">{app.service}</p></div>
                        <button onClick={() => setLocalAppointments(localAppointments.filter(a => a.id !== app.id))} className="p-3 text-zinc-700 hover:text-rose-500 transition-all"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    {filteredAppointments.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-800 opacity-20 italic font-black text-[10px] uppercase">Sem horários para hoje</div>}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'produtos_online':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Vendas <span className="text-yellow-500">Digitais</span></h2></header>
             <div className="bg-white border border-zinc-100 rounded-[3.5rem] overflow-hidden">
                <table className="w-full text-left text-sm italic font-bold">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400"><tr><th className="px-10 py-6">Pedido</th><th className="px-10 py-6">Comprador</th><th className="px-10 py-6 text-center">Total</th><th className="px-10 py-6 text-right">Status</th></tr></thead>
                   <tbody className="divide-y divide-zinc-50">
                      <tr><td className="px-10 py-6 text-zinc-400">#9921</td><td className="px-10 py-6 text-zinc-900 uppercase">Jéssica Medeiros</td><td className="px-10 py-6 text-center font-black">R$ 290,00</td><td className="px-10 py-6 text-right"><span className="text-[8px] font-black uppercase px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full">Aguardando Envio</span></td></tr>
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'venda_direta':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in h-full">
            <div className="lg:col-span-8 flex flex-col space-y-6">
               <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Checkout <span className="text-yellow-500">Express</span></h2></header>
               <div className="flex-grow overflow-y-auto space-y-8 scrollbar-hide">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10">
                    {localProducts.map(p => (
                      <button key={p.id} onClick={() => setPdvCart([...pdvCart, { ...p, cartId: Date.now() }])} className="p-6 bg-white border border-zinc-100 rounded-[2.5rem] text-left hover:border-yellow-400 hover:scale-[1.03] transition-all shadow-sm group italic">
                        <p className="text-xs font-black uppercase line-clamp-1 mb-1 group-hover:text-yellow-600">{p.name}</p>
                        <p className="text-sm font-black text-zinc-900">R$ {p.price.toFixed(2)}</p>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
            <div className="lg:col-span-4 bg-white border-2 border-zinc-100 rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
               <div className="p-10 border-b bg-zinc-50/50 flex justify-between items-center"><h3 className="text-[10px] font-black uppercase tracking-widest italic">Terminal PDV</h3><button onClick={() => setPdvCart([])} className="text-rose-500 text-[10px] font-black uppercase italic">Zerar</button></div>
               <div className="flex-grow overflow-y-auto p-10 space-y-4 scrollbar-hide">
                  {pdvCart.map(item => (
                    <div key={item.cartId} className="flex justify-between items-center p-5 bg-zinc-50 border border-zinc-100 rounded-3xl group italic font-bold">
                       <div><p className="text-[10px] font-black uppercase">{item.name}</p><p className="text-[10px] text-zinc-400">R$ {item.price.toFixed(2)}</p></div>
                       <button onClick={() => setPdvCart(pdvCart.filter(i => i.cartId !== item.cartId))} className="text-zinc-200 hover:text-rose-500 transition-all"><X size={14}/></button>
                    </div>
                  ))}
                  {pdvCart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-center opacity-10 italic font-black uppercase text-[10px]"><ShoppingCart size={40}/><span>Aguardando Itens</span></div>}
               </div>
               <div className="p-10 bg-zinc-950 text-white space-y-8">
                  <div className="flex justify-between items-end"><span className="text-[10px] font-black uppercase text-zinc-500 italic">Subtotal</span><span className="text-5xl font-black italic text-yellow-400 tracking-tighter">R$ {cartTotal.toFixed(2)}</span></div>
                  <button onClick={() => setShowFinalizeModal(true)} disabled={pdvCart.length === 0} className="w-full py-7 bg-yellow-400 text-black rounded-[2.5rem] font-black uppercase text-xs shadow-2xl disabled:opacity-20 transition-all active:scale-95">Lançar Pagamento</button>
               </div>
            </div>
          </div>
        );

      case 'avalistas':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Gestão de <span className="text-yellow-500">Avaliação</span></h2></header>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 italic font-black">
                {localTeam.filter(t => t.role.includes('Avalista')).map(a => (
                  <div key={a.id} className="p-10 bg-white border border-zinc-100 rounded-[3.5rem] shadow-sm flex flex-col justify-between">
                     <div><p className="text-[10px] text-zinc-400 uppercase mb-2">Profissional Técnico</p><h3 className="text-xl uppercase">{a.name}</h3><p className="text-sm text-yellow-600 mt-4">Meta Mensal: {a.appraiserGoal} Avaliações</p></div>
                     <button className="mt-8 py-4 bg-zinc-950 text-white rounded-[2rem] text-[10px] uppercase shadow-lg">Ver Histórico</button>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'cursos':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Academia <span className="text-yellow-500">LS</span></h2><button className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs italic shadow-xl">Novo Treinamento</button></header>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {localCourses.map(c => (
                  <div key={c.id} className="bg-white border-2 border-zinc-100 rounded-[4rem] p-10 group hover:border-yellow-400 transition-all italic font-bold">
                    <div className="mb-6 p-6 bg-zinc-50 rounded-[2rem] w-fit shadow-inner group-hover:bg-yellow-400 group-hover:text-black transition-all"><BookOpen size={40}/></div>
                    <h3 className="text-xl font-black uppercase text-black mb-2">{c.name}</h3>
                    <p className="text-[10px] text-zinc-400 uppercase mb-8">Professor: {c.instructor}</p>
                    <div className="flex justify-between items-center border-t border-zinc-50 pt-8"><span className="text-2xl font-black tracking-tighter">R$ {c.price.toFixed(2)}</span><button className="p-3 bg-zinc-50 rounded-2xl hover:bg-black hover:text-white transition-all"><Eye size={16}/></button></div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'equipe':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Parceiros <span className="text-yellow-500">LS</span></h2><button onClick={() => {setModalType('create'); setSelectedItem(null); setShowTeamModal(true);}} className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs italic shadow-xl">Novo Membro</button></header>
             <div className="bg-white border border-zinc-100 rounded-[3.5rem] overflow-hidden">
                <table className="w-full text-left text-sm italic font-bold">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400"><tr><th className="px-10 py-6">Nome</th><th className="px-10 py-6">Cargo</th><th className="px-10 py-6 text-center">Comissão</th><th className="px-10 py-6 text-right">Ação</th></tr></thead>
                   <tbody className="divide-y divide-zinc-50">
                      {localTeam.map(t => (
                        <tr key={t.id}><td className="px-10 py-6 text-zinc-900 uppercase">{t.name}</td><td className="px-10 py-6 text-zinc-400 uppercase text-xs">{t.role}</td><td className="px-10 py-6 text-center font-black">{(t.commissionRate * 100).toFixed(0)}%</td><td className="px-10 py-6 text-right"><button onClick={() => {setModalType('edit'); setSelectedItem(t); setShowTeamModal(true);}} className="p-3 bg-zinc-50 rounded-2xl hover:bg-black hover:text-white transition-all"><Edit3 size={14}/></button></td></tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'clientes':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Base de <span className="text-yellow-500">Fidelidade</span></h2><button onClick={() => {setModalType('create'); setSelectedItem(null); setShowClientModal(true);}} className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs italic shadow-xl">Novo Cliente</button></header>
             <div className="bg-white border border-zinc-100 rounded-[3.5rem] overflow-hidden">
                <table className="w-full text-left text-sm italic font-bold">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400"><tr><th className="px-10 py-6">Nome</th><th className="px-10 py-6 text-center">Nível</th><th className="px-10 py-6 text-center">Pontos</th><th className="px-10 py-6 text-right">Histórico</th></tr></thead>
                   <tbody className="divide-y divide-zinc-50">
                      {localClients.map(c => (
                        <tr key={c.id}><td className="px-10 py-6 text-zinc-900 uppercase">{c.name}</td><td className="px-10 py-6 text-center"><span className="text-[9px] font-black uppercase px-3 py-1 bg-yellow-400/10 text-yellow-600 rounded-full">{c.level}</span></td><td className="px-10 py-6 text-center font-black">{c.points}</td><td className="px-10 py-6 text-right"><button onClick={() => {setModalType('edit'); setSelectedItem(c); setShowClientModal(true);}} className="p-3 bg-zinc-50 rounded-2xl hover:bg-black hover:text-white transition-all"><MoreHorizontal size={16}/></button></td></tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'estoque':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Gerência de <span className="text-yellow-500">Insumos</span></h2><button onClick={() => {setModalType('create'); setSelectedItem(null); setShowProductModal(true);}} className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs italic shadow-xl">Novo Item</button></header>
             <div className="bg-white border border-zinc-100 rounded-[3.5rem] overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm italic font-bold">
                   <thead className="bg-zinc-50 text-[10px] font-black uppercase text-zinc-400"><tr><th className="px-10 py-6">Produto</th><th className="px-10 py-6 text-center">Qtd. Estoque</th><th className="px-10 py-6 text-center">Venda</th><th className="px-10 py-6 text-right">Ação</th></tr></thead>
                   <tbody className="divide-y divide-zinc-50">
                      {localProducts.map(p => (
                        <tr key={p.id} className="group hover:bg-zinc-50">
                           <td className="px-10 py-6 uppercase font-black">{p.name}</td>
                           <td className="px-10 py-6 text-center"><p className={`text-xl font-black tracking-tighter ${p.stock < 10 ? 'text-rose-500 animate-pulse' : 'text-zinc-900'}`}>{p.stock}</p></td>
                           <td className="px-10 py-6 text-center font-black">R$ {p.price.toFixed(2)}</td>
                           <td className="px-10 py-6 text-right"><button onClick={() => {setModalType('edit'); setSelectedItem(p); setShowProductModal(true);}} className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all"><Edit3 size={14}/></button></td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case 'cabelo':
        return (
          <div className="space-y-10 animate-in fade-in">
             <header className="flex justify-between items-center"><h2 className="text-2xl font-black text-zinc-900 uppercase italic">Cabelos <span className="text-yellow-500">Guardados</span></h2><button onClick={() => {setModalType('create'); setSelectedItem(null); setShowHairModal(true);}} className="px-10 py-5 bg-zinc-950 text-white rounded-3xl font-black uppercase text-xs italic shadow-xl">Novo Registro</button></header>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 italic font-black">
                {localSavedHair.map(hair => {
                  const fee = Math.max(0, Math.ceil((Date.now() - new Date(hair.startDate).getTime()) / (1000 * 60 * 60 * 24)) - 30);
                  return (
                    <div key={hair.id} className="bg-white border-2 border-zinc-100 rounded-[4rem] p-12 group hover:border-yellow-400 transition-all shadow-sm">
                       <QrCode className="absolute top-10 right-12 text-zinc-100 group-hover:text-yellow-400/20 transition-all" size={60}/>
                       <p className="text-[10px] text-zinc-400 uppercase mb-2">Responsável: {hair.clientName}</p>
                       <h3 className="text-xl uppercase mb-10">{hair.type}</h3>
                       <div className="flex justify-between items-end border-t border-zinc-50 pt-8">
                          <div><p className="text-[9px] text-zinc-400 uppercase">Cód. Retirada</p><p className="tracking-[0.2em]">{hair.retrievalCode}</p></div>
                          <div className="text-right"><p className="text-[9px] text-zinc-400 uppercase">Diária Acumulada</p><p className={`text-2xl tracking-tighter ${fee > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{fee > 0 ? `R$ ${fee.toFixed(2)}` : 'Isento'}</p></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        );

      default:
        return <div className="h-full flex items-center justify-center font-black uppercase italic opacity-20 text-4xl">Sistema em Processamento...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFDFE] text-zinc-900 relative overflow-hidden font-sans">
      <aside className="hidden md:flex w-72 lg:w-80 bg-black text-white flex-col z-30 border-r border-zinc-800 shadow-2xl">
        <div className="p-12 border-b border-zinc-900 transition-all"><h2 className="text-4xl font-black tracking-tighter italic text-white uppercase tracking-tighter">LS <span className="text-yellow-400">ADMIN</span></h2></div>
        <nav className="flex-grow p-8 space-y-2 overflow-y-auto scrollbar-hide">
          {ADMIN_MENU.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-5 px-8 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all italic ${activeTab === item.id ? 'bg-yellow-400 text-black shadow-xl scale-[1.05]' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
              <span>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-grow overflow-y-auto scrollbar-hide p-12 md:p-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto">{renderSection()}</div>
      </main>

      {/* MODAL NOVO AVISO */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-12 shadow-2xl w-full max-w-xl border-t-8 border-yellow-400 relative">
              <button onClick={() => setShowAnnounceModal(false)} className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors"><X/></button>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Disparar <span className="text-yellow-500">Comunicado</span></h3>
              <form onSubmit={e => {
                e.preventDefault();
                const form = e.target as any;
                const newAnn = { id: Date.now(), title: form.title.value.toUpperCase(), target: form.target.value, date: new Date().toISOString().split('T')[0], status: 'Ativo', message: form.msg.value };
                setAnnouncements([newAnn, ...announcements]);
                setShowAnnounceModal(false);
              }} className="space-y-6 italic font-bold">
                <div className="space-y-2"><label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Título Chamativo</label><input name="title" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-yellow-400 text-sm" placeholder="EX: NOVO CURSO DISPONÍVEL"/></div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Público de Alvo</label>
                  <select name="target" className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-yellow-400 uppercase text-sm font-black">
                    <option value="Todos">Todos os Envolvidos</option>
                    <option value="Alunos">Apenas Alunos Academy</option>
                    <option value="Avalistas">Apenas Avalistas Técnicos</option>
                    <option value="Clientes">Clientes da Base</option>
                  </select>
                </div>
                <div className="space-y-2"><label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Conteúdo da Mensagem</label><textarea name="msg" required rows={4} className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-yellow-400 text-sm" placeholder="Digite aqui o texto do aviso..."/></div>
                <button type="submit" className="w-full py-7 bg-zinc-950 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95">Disparar Agora</button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL NOVA PROMOÇÃO */}
      {showPromoModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-12 shadow-2xl w-full max-w-xl border-t-8 border-emerald-500 relative">
              <button onClick={() => setShowPromoModal(false)} className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors"><X/></button>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Criar <span className="text-emerald-500">Campanha Ativa</span></h3>
              <form onSubmit={e => {
                e.preventDefault();
                const form = e.target as any;
                const newPromo = { id: Date.now(), code: form.code.value.toUpperCase(), discount: form.disc.value + '%', type: 'Cupom', active: true };
                setPromotions([newPromo, ...promotions]);
                setShowPromoModal(false);
              }} className="space-y-6 italic font-bold">
                <div className="space-y-2"><label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Código do Cupom</label><input name="code" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-emerald-400 text-sm font-black tracking-widest" placeholder="EX: VERAO2024"/></div>
                <div className="space-y-2"><label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Desconto Nominal (%)</label><input name="disc" type="number" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-emerald-400 text-sm" placeholder="EX: 20"/></div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Tipo de Promoção</label>
                  <select name="type" className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-emerald-400 uppercase text-sm font-black">
                    <option value="Cupom">Cupom Geral</option>
                    <option value="Aluno Exclusive">Exclusivo Alunos</option>
                    <option value="Primeira Compra">Primeira Compra</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-7 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95">Ativar Oferta</button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL NOVO AGENDAMENTO */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white rounded-[4rem] p-12 shadow-2xl w-full max-w-xl border-t-8 border-yellow-400 flex flex-col max-h-[90vh] relative italic font-bold">
              <button onClick={() => setShowAppointmentModal(false)} className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors"><X/></button>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Novo <span className="text-yellow-500">Agendamento</span></h3>
              <div className="overflow-y-auto scrollbar-hide space-y-8 px-2 pb-6">
                <div className="grid grid-cols-2 gap-4"><button onClick={() => setIsExistingClient(true)} className={`py-4 rounded-2xl font-black uppercase text-[10px] transition-all ${isExistingClient ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-400'}`}>Cliente Base</button><button onClick={() => setIsExistingClient(false)} className={`py-4 rounded-2xl font-black uppercase text-[10px] transition-all ${!isExistingClient ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-400'}`}>Novo Visitante</button></div>
                <form onSubmit={e => {
                  e.preventDefault();
                  const form = e.target as any;
                  const newApp = { id: `a${Date.now()}`, clientName: isExistingClient ? localClients.find(c => c.id === form.clientId.value)?.name : form.guestName.value.toUpperCase(), date: form.appDate.value, time: form.appTime.value, service: form.appService.value.toUpperCase(), status: 'pending' as const };
                  setLocalAppointments([...localAppointments, newApp]);
                  setShowAppointmentModal(false);
                }} className="space-y-6">
                  {isExistingClient ? (
                    <div className="space-y-2"><label className="text-[10px] uppercase text-zinc-400">Selecionar</label><select name="clientId" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-black text-sm uppercase">{localClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  ) : (
                    <div className="space-y-4"><div className="space-y-2"><input name="guestName" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none uppercase text-sm" placeholder="NOME COMPLETO..."/></div><div className="space-y-2"><input name="guestWhatsApp" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none text-sm" placeholder="WHATSAPP..."/></div></div>
                  )}
                  <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><input name="appDate" type="date" required defaultValue={selectedDay || ''} className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none text-sm"/></div><div className="space-y-2"><input name="appTime" type="time" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none text-sm"/></div></div>
                  <div className="space-y-2"><input name="appService" required className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none uppercase text-sm" placeholder="SERVIÇO..."/></div>
                  <button type="submit" className="w-full py-7 bg-zinc-950 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl transition-all">Confirmar Horário</button>
                </form>
              </div>
           </div>
        </div>
      )}

      {/* MODAL PDV FINALIZAR */}
      {showFinalizeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="bg-white rounded-[4.5rem] p-12 shadow-2xl w-full max-w-2xl border-t-8 border-yellow-400 flex flex-col max-h-[90vh] relative italic font-bold">
              <button onClick={() => setShowFinalizeModal(false)} className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors"><X/></button>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Finalizar <span className="text-yellow-500">Pagamento</span></h3>
              <div className="overflow-y-auto scrollbar-hide space-y-10 px-2 pb-6">
                 <div className="p-10 bg-zinc-950 text-white rounded-[3rem] flex justify-between items-center shadow-2xl"><span className="text-[11px] font-black uppercase text-zinc-500">Total a Receber</span><span className="text-6xl font-black text-yellow-400 tracking-tighter">R$ {cartTotal.toFixed(2)}</span></div>
                 <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-zinc-400">Vincular Equipe (Comissão)</label>
                    <select value="" onChange={(e) => { const p = localTeam.find(t=>t.id===e.target.value); if(p && !selectedPartners.find(sp=>sp.id===p.id)) setSelectedPartners([...selectedPartners, {...p, manualValue: (cartTotal * p.commissionRate).toFixed(2)}])}} className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-3xl px-8 py-5 font-black uppercase text-sm outline-none focus:border-yellow-400 transition-all"><option value="">Add Profissional...</option>{localTeam.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
                    <div className="space-y-3">
                       {selectedPartners.map(p => (
                         <div key={p.id} className="p-6 bg-zinc-50 rounded-[2.5rem] border-2 border-zinc-100 flex items-center justify-between"><div className="flex items-center gap-4"><div className="p-3 bg-zinc-900 text-white rounded-2xl"><Users2 size={18}/></div><div><p className="text-xs font-black uppercase">{p.name}</p></div></div><div className="flex items-center gap-3"><input type="number" step="0.01" value={p.manualValue} onChange={(e) => setSelectedPartners(selectedPartners.map(sp=>sp.id===p.id?{...sp, manualValue: e.target.value}:sp))} className="w-32 py-3 px-4 bg-white border-2 rounded-2xl text-center font-black text-emerald-600 outline-none"/><button onClick={() => setSelectedPartners(selectedPartners.filter(sp=>sp.id!==p.id))} className="text-rose-500"><X size={16}/></button></div></div>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-400">Método de Recebimento</label>
                    <select value={payment1.method} onChange={e => setPayment1({...payment1, method: e.target.value})} className="w-full bg-zinc-100 rounded-3xl px-8 py-5 font-black text-xs uppercase outline-none focus:ring-2 ring-yellow-400"><option value="DINHEIRO">Dinheiro</option><option value="PIX">Pix</option><option value="CARTÃO">Cartão Master</option></select>
                 </div>
              </div>
              <div className="pt-8 border-t border-zinc-50"><button onClick={handleFinalizeSale} className="w-full py-8 bg-zinc-950 text-white rounded-[3rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-emerald-600 transition-all">Lançar no Caixa Diário</button></div>
           </div>
        </div>
      )}

      {/* OUTROS MODAIS BÁSICOS */}
      {showCashierModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in">
           <div className="bg-white rounded-[4.5rem] p-16 shadow-2xl w-full max-w-md border-t-8 border-yellow-400 text-center relative italic font-bold">
              <button onClick={() => setShowCashierModal(false)} className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors"><X/></button>
              <h3 className="text-3xl font-black italic uppercase mb-10">Abrir <span className="text-yellow-500">Caixa</span></h3>
              <form onSubmit={e => { e.preventDefault(); setIsCashierOpen(true); setShowCashierModal(false); }} className="space-y-8">
                 <input type="number" required placeholder="0.00" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} className="w-full bg-zinc-50 border-4 border-zinc-100 rounded-[2.5rem] px-10 py-8 font-black text-5xl outline-none text-center italic text-zinc-900 shadow-inner" />
                 <button type="submit" className="w-full py-7 bg-zinc-950 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl">Ativar Terminal</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const MetricBox = ({ label, value, status, color, icon }: any) => (
  <div className="p-10 bg-white border border-zinc-100 rounded-[3.5rem] shadow-sm hover:border-zinc-300 transition-all group relative overflow-hidden italic">
    <div className="flex justify-between items-start mb-8 transition-all"><span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">{label}</span><div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:bg-yellow-400 group-hover:text-black transition-all shadow-inner">{icon}</div></div>
    <div className="flex items-baseline space-x-2"><p className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</p></div>
    <p className={`text-[9px] font-black uppercase mt-5 tracking-[0.2em] border-t border-zinc-50 pt-4 ${color}`}>{status}</p>
  </div>
);

const MOCK_TEAM = [
  { id: 't1', name: 'Célia Hair', role: 'Diretora Master', commissionRate: 0.5, appraiserGoal: 50 },
  { id: 't2', name: 'Janice Lima', role: 'Especialista Mega', commissionRate: 0.4, appraiserGoal: 30 },
  { id: 't3', name: 'Roberto Silva', role: 'Avalista Técnico', commissionRate: 0.1, appraiserGoal: 100 },
  { id: 't4', name: 'Alina Dias', role: 'Cabeleireira Master', commissionRate: 0.35, appraiserGoal: 20 },
];

const MOCK_CLIENTS = [
  { id: 'cl1', name: 'Beatriz Cavalcante', email: 'beatriz@email.com', points: 1540, level: 'Diamante' },
  { id: 'cl2', name: 'Mariana Peixoto', email: 'mariana@email.com', points: 890, level: 'Ouro' },
];

export default AdminDashboard;
