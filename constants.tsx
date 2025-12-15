
import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Users, 
  BookOpen, 
  Calendar, 
  Package, 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Scissors,
  Lock,
  UserCheck,
  ShoppingCart,
  CreditCard,
  Users2,
  UserPlus
} from 'lucide-react';

export const COLORS = {
  primary: '#000000',
  secondary: '#FFFFFF',
  accent: '#FACC15', // Tailwind yellow-400
};

export const MENU_ITEMS = [
  { label: 'Início', path: '/', icon: <Home size={20} /> },
  { label: 'Produtos', path: '/produtos', icon: <ShoppingBag size={20} /> },
  { label: 'Quem Somos', path: '/sobre', icon: <Users size={20} /> },
  { label: 'Endereço', path: '/contato', icon: <Settings size={20} /> },
];

export const ADMIN_MENU = [
  { label: 'Dashboard', id: 'dash', icon: <TrendingUp size={20} /> },
  { label: 'Caixa Diário', id: 'caixa', icon: <DollarSign size={20} /> },
  { label: 'Agendamento', id: 'agendamento', icon: <Calendar size={20} /> },
  { label: 'Produtos Online', id: 'produtos_online', icon: <ShoppingCart size={20} /> },
  { label: 'Venda Direta (PDV)', id: 'venda_direta', icon: <CreditCard size={20} /> },
  { label: 'Gestão de Avalistas', id: 'avalistas', icon: <UserCheck size={20} /> },
  { label: 'Gestão de Cursos', id: 'cursos', icon: <BookOpen size={20} /> },
  { label: 'Gestão de Equipe', id: 'equipe', icon: <Users2 size={20} /> },
  { label: 'Gestão de Clientes', id: 'clientes', icon: <UserPlus size={20} /> },
  { label: 'Estoque', id: 'estoque', icon: <Package size={20} /> },
  { label: 'Cabelo Guardado', id: 'cabelo', icon: <Scissors size={20} /> },
];
