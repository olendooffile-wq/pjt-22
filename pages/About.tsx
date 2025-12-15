
import React from 'react';
import { Award, Users, Heart, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen pb-20">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-400/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 italic">
            Nossa <span className="text-yellow-400">História</span>
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed font-light">
            O LS Célia Hair nasceu de um sonho: transformar a autoestima das mulheres através da excelência em Mega Hair e capacitar profissionais para dominar o mercado da beleza com técnica e paixão.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div className="rounded-3xl overflow-hidden aspect-square border border-zinc-900 shadow-2xl">
          <img src="https://picsum.photos/800/800?grayscale&random=about1" alt="Célia Hair" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Mais de 15 anos de excelência</h2>
          <p className="text-zinc-400 leading-relaxed">
            Fundado por Célia Hair, o salão tornou-se referência nacional em técnicas de alongamento capilar invisível e naturalidade. Nossa trajetória é marcada pela busca constante pela perfeição e pelo respeito à saúde dos fios.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl">
              <Award className="text-yellow-400 mb-2" size={24} />
              <h4 className="font-bold text-sm">Prêmios de Inovação</h4>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl">
              <Users className="text-yellow-400 mb-2" size={24} />
              <h4 className="font-bold text-sm">+10k Alunos Formados</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-24 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16 italic">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Heart className="text-yellow-400 mx-auto mb-4" />, title: 'Amor pela Beleza', desc: 'Acreditamos que cada cliente é única e merece um atendimento personalizado.' },
              { icon: <Sparkles className="text-yellow-400 mx-auto mb-4" />, title: 'Excelência Técnica', desc: 'Investimos em tecnologia e formação contínua para entregar resultados perfeitos.' },
              { icon: <Users className="text-yellow-400 mx-auto mb-4" />, title: 'Comunidade', desc: 'Nossa academia fortalece o mercado da beleza gerando renda e oportunidades.' }
            ].map((v, i) => (
              <div key={i} className="space-y-2">
                {v.icon}
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="text-zinc-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
