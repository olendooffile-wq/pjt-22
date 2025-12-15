
import React, { useState, useMemo } from 'react';
import { 
  Calculator, TrendingUp, History, DollarSign, 
  Calculator as CalcIcon, Plus, Minus, CheckCircle, 
  Scissors, ChevronRight, X, UserPlus, Phone, 
  User, CreditCard, ArrowRight, ArrowLeft 
} from 'lucide-react';

const HAIR_VALUES: any = {
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
  quality: { 'EXCELENTE - FIOS FINOS': 50, 'BOM - FIOS GROSSOS': 50, 'RUIM - PONTA DUPLA/FREZE': -50 }
};

type AppraiserStep = 'form' | 'result' | 'registration' | 'success';

const AppraiserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calc');
  const [step, setStep] = useState<AppraiserStep>('form');
  
  // Calculator States
  const [selections, setSelections] = useState({
    texture: 'LISO',
    length: '60CM',
    circumference: '6CM',
    type: 'VIRGEM',
    ends: 'CHEIA',
    quality: 'BOM - FIOS GROSSOS'
  });

  // Registration States
  const [sellerData, setSellerData] = useState({
    name: '',
    whatsapp: '',
    age: '',
    cpf: ''
  });

  const finalValue = useMemo(() => {
    let total = 0;
    total += HAIR_VALUES.texture[selections.texture] || 0;
    total += HAIR_VALUES.length[selections.length] || 0;
    total += HAIR_VALUES.circumference[selections.circumference] || 0;
    total += HAIR_VALUES.type[selections.type] || 0;
    total += HAIR_VALUES.quality[selections.quality] || 0;
    return total;
  }, [selections]);

  const handleCalculate = () => {
    setStep('result');
  };

  const handleConfirmPrice = () => {
    setStep('registration');
  };

  const handleRegisterSeller = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const resetFlow = () => {
    setStep('form');
    setSellerData({ name: '', whatsapp: '', age: '', cpf: '' });
  };

  return (
    <div className="bg-[#F8F8FA] min-h-screen relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-black">Portal <span className="text-yellow-500">Avalista</span></h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic font-bold">Terminal Técnico LS Hair</p>
          </div>
          <div className="flex bg-zinc-100 p-2 rounded-[2.5rem] border-2 border-zinc-200 shadow-xl">
            <button 
              onClick={() => { setActiveTab('calc'); resetFlow(); }}
              className={`flex items-center space-x-3 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'calc' ? 'bg-black text-white shadow-2xl scale-[1.05]' : 'text-zinc-400 hover:text-black'}`}
            >
              <CalcIcon size={18} />
              <span>Calculadora</span>
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-3 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-black text-white shadow-2xl scale-[1.05]' : 'text-zinc-400 hover:text-black'}`}
            >
              <TrendingUp size={18} />
              <span>Performance</span>
            </button>
          </div>
        </header>

        {activeTab === 'calc' ? (
          <div className="animate-in fade-in duration-500">
            {step === 'form' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8 p-12 bg-white border-2 border-zinc-100 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12"><Scissors size={100} /></div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-12 flex items-center space-x-4">
                    <Calculator className="text-yellow-500" size={32} />
                    <span>Definição de Atributos</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 relative z-10">
                    <Selector label="1. Textura / Curvatura" value={selections.texture} options={Object.keys(HAIR_VALUES.texture)} onChange={(v: string) => setSelections({...selections, texture: v})} />
                    <Selector label="2. Comprimento Real (cm)" value={selections.length} options={Object.keys(HAIR_VALUES.length)} onChange={(v: string) => setSelections({...selections, length: v})} />
                    <Selector label="3. Espessura do Rabo (cm)" value={selections.circumference} options={Object.keys(HAIR_VALUES.circumference)} onChange={(v: string) => setSelections({...selections, circumference: v})} />
                    <Selector label="4. Tratamento Químico" value={selections.type} options={Object.keys(HAIR_VALUES.type)} onChange={(v: string) => setSelections({...selections, type: v})} />
                    <Selector label="5. Estado das Pontas" value={selections.ends} options={['CHEIA', 'FINA', 'QUEBRADA']} onChange={(v: string) => setSelections({...selections, ends: v})} />
                    <Selector label="6. Qualidade dos Fios" value={selections.quality} options={Object.keys(HAIR_VALUES.quality)} onChange={(v: string) => setSelections({...selections, quality: v})} />
                  </div>

                  <button 
                    onClick={handleCalculate}
                    className="w-full py-8 bg-black text-white font-black uppercase text-xs tracking-[0.5em] rounded-[2rem] shadow-2xl hover:bg-yellow-400 hover:text-black transition-all active:scale-[0.98] flex items-center justify-center space-x-4 italic border-2 border-black"
                  >
                    <Calculator size={20} />
                    <span>Calcular Valor de Compra</span>
                  </button>
                </div>

                <div className="lg:col-span-4 p-10 bg-black text-white rounded-[4rem] shadow-2xl">
                  <h3 className="font-black italic uppercase text-[11px] tracking-[0.3em] text-zinc-500 mb-10 flex items-center space-x-3">
                    <History className="text-yellow-400" size={18} />
                    <span>Últimas Avaliações</span>
                  </h3>
                  <div className="space-y-4">
                    {[{ name: 'Janete Souza', val: 'R$ 1.250', date: 'Há 5 min' }, { name: 'Carla Dias', val: 'R$ 850', date: 'Há 1h' }].map((h, i) => (
                      <div key={i} className="flex justify-between items-center p-7 bg-zinc-900/50 rounded-[2rem] border border-white/5">
                        <div><p className="font-black text-xs uppercase tracking-tight italic text-white">{h.name}</p><p className="text-[9px] text-zinc-700 font-bold uppercase mt-1 italic">{h.date}</p></div>
                        <span className="text-yellow-400 font-black text-xl italic tracking-tighter">{h.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'registration' && (
              <div className="max-w-3xl mx-auto p-12 bg-white border-2 border-zinc-100 rounded-[4rem] shadow-2xl animate-in slide-in-from-right duration-500">
                <button onClick={() => setStep('form')} className="mb-10 flex items-center space-x-2 text-[10px] font-black uppercase text-zinc-400 hover:text-black transition-all italic"><ArrowLeft size={16} /> <span>Voltar ao Cálculo</span></button>
                
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-black mb-12 flex items-center space-x-4">
                  <UserPlus className="text-yellow-500" size={32} />
                  <span>Cadastro do Vendedor</span>
                </h3>

                <form onSubmit={handleRegisterSeller} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Nome Completo" icon={<User size={18}/>} placeholder="Nome do vendedor..." value={sellerData.name} onChange={(v: string) => setSellerData({...sellerData, name: v})} />
                    <InputGroup label="WhatsApp" icon={<Phone size={18}/>} placeholder="(00) 00000-0000" value={sellerData.whatsapp} onChange={(v: string) => setSellerData({...sellerData, whatsapp: v})} />
                    <InputGroup label="Idade" icon={<Plus size={18}/>} placeholder="Ex: 25" value={sellerData.age} onChange={(v: string) => setSellerData({...sellerData, age: v})} />
                    <InputGroup label="CPF" icon={<CreditCard size={18}/>} placeholder="000.000.000-00" value={sellerData.cpf} onChange={(v: string) => setSellerData({...sellerData, cpf: v})} />
                  </div>

                  <div className="pt-10">
                    <button type="submit" className="w-full py-7 bg-yellow-400 text-black font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] shadow-2xl hover:bg-black hover:text-white transition-all active:scale-95 italic border-2 border-black/5 flex items-center justify-center space-x-4">
                      <CheckCircle size={20} />
                      <span>Concluir e Salvar Negociação</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'success' && (
              <div className="max-w-2xl mx-auto p-20 bg-white border-2 border-zinc-100 rounded-[5rem] shadow-2xl text-center animate-in zoom-in-95 duration-500">
                 <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10 text-green-500 border-4 border-white shadow-xl">
                    <CheckCircle size={64} />
                 </div>
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black mb-4">Negócio <span className="text-yellow-500">Fechado!</span></h2>
                 <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-12 italic">A avaliação de R$ {finalValue.toFixed(2)} foi salva no histórico de {sellerData.name}.</p>
                 <button onClick={resetFlow} className="w-full py-6 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest italic shadow-2xl hover:bg-zinc-800 transition-all active:scale-95">Iniciar Nova Avaliação</button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MetricCard icon={<DollarSign className="text-green-500" />} label="Minhas Comissões" value="R$ 1.450,00" />
                <MetricCard icon={<CheckCircle className="text-blue-500" />} label="Avaliações Concluídas" value="42" />
                <MetricCard icon={<TrendingUp className="text-yellow-400" />} label="Conversão de Compra" value="78%" />
             </div>

             <div className="p-16 bg-black border-4 border-zinc-900 rounded-[5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000"><TrendingUp size={160} /></div>
                <h3 className="text-3xl font-black italic mb-12 uppercase tracking-tighter text-white">Minha Meta Mensal: <span className="text-yellow-400">R$ 50.000,00</span></h3>
                <div className="space-y-8">
                  <div className="flex justify-between text-xs font-black uppercase tracking-[0.4em] italic text-zinc-500">
                    <span>Faturamento Atual (R$ 42.500)</span>
                    <span className="text-yellow-400">85% Concluído</span>
                  </div>
                  <div className="h-8 bg-zinc-900 rounded-full overflow-hidden p-2 border border-white/5 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-yellow-700 to-yellow-400 rounded-full shadow-lg shadow-yellow-400/20 transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-center text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em] pt-10 italic">Bônus master de R$ 500,00 será liberado ao atingir a meta!</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* OVERLAY DE RESULTADO (MODAL) */}
      {step === 'result' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setStep('form')}></div>
          <div className="relative w-full max-w-xl bg-white border-2 border-zinc-100 rounded-[4rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500">
             <button onClick={() => setStep('form')} className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors"><X size={24} /></button>
             
             <div className="text-center mb-12">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-4 italic">Valor Final Calculado</p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-2xl font-black text-yellow-500 italic">R$</span>
                  <span className="text-8xl font-black text-black italic tracking-tighter drop-shadow-xl">{finalValue.toFixed(2)}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setStep('form')}
                  className="py-6 border-2 border-zinc-100 text-zinc-400 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:border-black hover:text-black transition-all italic active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirmPrice}
                  className="py-6 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 hover:text-black transition-all italic shadow-2xl active:scale-95 flex items-center justify-center space-x-3"
                >
                  <span>Confirmar Compra</span>
                  <ArrowRight size={16} />
                </button>
             </div>
             
             <p className="text-center mt-10 text-[9px] text-zinc-300 font-bold uppercase tracking-[0.4em] italic">Preço definido pelas regras de negócio da LS Célia Hair</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENTES INTERNOS ---

const Selector = ({ label, value, options, onChange }: any) => (
  <div className="space-y-4 group">
    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic font-bold group-hover:text-yellow-600 transition-colors">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl px-8 py-5 outline-none focus:border-yellow-400 focus:bg-white transition-all font-black text-sm uppercase text-zinc-900 cursor-pointer appearance-none shadow-sm"
    >
      {options.map((k: string) => <option key={k} value={k}>{k}</option>)}
    </select>
  </div>
);

const InputGroup = ({ label, icon, placeholder, value, onChange }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic font-bold">{label}</label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-yellow-500 transition-colors">{icon}</div>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-5 pl-16 pr-8 outline-none focus:border-yellow-400 focus:bg-white transition-all font-bold text-zinc-800 shadow-sm italic text-sm"
      />
    </div>
  </div>
);

const MetricCard = ({ icon, label, value }: any) => (
  <div className="p-12 bg-white border-2 border-zinc-100 rounded-[4rem] shadow-xl group hover:border-yellow-400 transition-all relative overflow-hidden">
    <div className="mb-8 p-5 bg-zinc-50 w-fit rounded-[1.5rem] shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-zinc-400 text-[10px] uppercase font-black tracking-[0.3em] mb-3 italic font-bold">{label}</p>
    <p className="text-4xl font-black italic tracking-tighter uppercase text-black">{value}</p>
  </div>
);

export default AppraiserDashboard;
