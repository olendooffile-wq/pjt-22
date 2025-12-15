
import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 italic">Onde <span className="text-yellow-400">Estamos</span></h1>
          <p className="text-zinc-500">Visite nosso salão ou entre em contato para agendamentos.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl">
              <MapPin className="text-yellow-400 mb-4" size={24} />
              <h3 className="font-bold mb-2">Endereço</h3>
              <p className="text-zinc-500 text-sm">Av. Principal das Belezas, 1234<br />Bairro Jardim Hair, São Paulo - SP</p>
            </div>
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl">
              <Phone className="text-yellow-400 mb-4" size={24} />
              <h3 className="font-bold mb-2">Telefones</h3>
              <p className="text-zinc-500 text-sm">(11) 99999-8888 (WhatsApp)<br />(11) 3333-4444</p>
            </div>
            <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl">
              <Clock className="text-yellow-400 mb-4" size={24} />
              <h3 className="font-bold mb-2">Horários</h3>
              <p className="text-zinc-500 text-sm">Segunda a Sexta: 09h às 20h<br />Sábado: 08h às 18h</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 p-8 bg-zinc-950 border border-zinc-900 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Mande uma mensagem</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Nome Completo</label>
                  <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">E-mail</label>
                  <input type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Assunto</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400">
                  <option>Agendamento</option>
                  <option>Dúvidas sobre Cursos</option>
                  <option>Compra de Cabelo</option>
                  <option>Outros</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Mensagem</label>
                <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-400"></textarea>
              </div>
              <button className="w-full py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all flex items-center justify-center space-x-2">
                <Send size={18} />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 h-96 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative">
           <img src="https://picsum.photos/1200/400?grayscale&random=map" className="w-full h-full object-cover opacity-30" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl text-center shadow-2xl">
                <MapPin className="text-yellow-400 mx-auto mb-2" />
                <p className="font-bold">Ver no Google Maps</p>
                <p className="text-xs text-zinc-500">Clique para abrir mapa externo</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
