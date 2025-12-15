
import React from 'react';
import { BookOpen, Award, ShoppingBag, User, CheckCircle } from 'lucide-react';
import { MOCK_COURSES } from '../services/mockData';

const StudentDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Profile */}
        <div className="space-y-6">
          <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl text-center">
            <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-black">
              <User size={48} />
            </div>
            <h2 className="text-xl font-bold">Amanda Oliveira</h2>
            <p className="text-zinc-500 text-sm mb-4">Estudante LS Academy</p>
            <div className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs font-bold">
              <Award size={14} />
              <span>Nível Prata</span>
            </div>
          </div>

          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl">
            <h3 className="font-bold mb-4">Fidelidade</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-zinc-500">Pontos atuais</span>
              <span className="text-lg font-bold text-yellow-400">45 pts</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400" style={{ width: '45%' }}></div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-2">Faltam 55 pontos para o Nível Ouro</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-12">
          {/* Active Courses */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold italic">Meus <span className="text-yellow-400">Cursos</span></h2>
              <span className="text-zinc-500 text-sm">2 cursos em andamento</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_COURSES.map(course => (
                <div key={course.id} className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <BookOpen className="text-yellow-400" />
                    <span className="text-[10px] font-bold bg-zinc-900 text-zinc-400 px-2 py-1 rounded">Válido até Jun/2024</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs mb-2">
                      <span>Progresso</span>
                      <span className="text-yellow-400">75%</span>
                    </div>
                    <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: '75%' }}></div>
                    </div>
                    <button className="w-full mt-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold hover:bg-yellow-400 hover:text-black transition-all">
                      Continuar Assistindo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Exclusive Offers */}
          <section>
            <h2 className="text-2xl font-bold italic mb-6">Loja <span className="text-yellow-400">Exclusiva</span></h2>
            <div className="p-8 bg-zinc-950 border border-dashed border-yellow-400/30 rounded-3xl flex flex-col md:flex-row items-center gap-8">
              <div className="p-6 bg-yellow-400 rounded-2xl text-black">
                <ShoppingBag size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Desconto de Aluno Ativado!</h3>
                <p className="text-zinc-500 mb-4">Você tem 15% de desconto automático em todos os produtos da loja física e online enquanto for estudante ativo.</p>
                <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-yellow-400 transition-all">
                  Acessar Loja Especial
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
