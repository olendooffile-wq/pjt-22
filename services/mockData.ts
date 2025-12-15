
import { Product, Hair, Course, Appointment, SavedHair } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Shampoo LS Célia Profissional',
    description: 'Limpeza profunda e hidratação para cabelos quimicamente tratados.',
    price: 89.90,
    stock: 50,
    category: 'product',
    image: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 'p2',
    name: 'Máscara Reconstrutora 500g',
    description: 'Reconstrução capilar imediata com queratina e aminoácidos.',
    price: 120.00,
    stock: 8,
    category: 'product',
    image: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: 'p3',
    name: 'Leave-in Proteção Térmica',
    description: 'Protege os fios do calor do secador e chapinha.',
    price: 75.00,
    stock: 25,
    category: 'product',
    image: 'https://picsum.photos/400/400?random=10'
  }
];

export const MOCK_HAIRS: Hair[] = [
  {
    id: 'h1',
    name: 'Cabelo Brasileiro Premium',
    description: 'Fios virgens, selecionados e higienizados.',
    price: 1500.00,
    stock: 5,
    category: 'hair',
    image: 'https://picsum.photos/400/400?random=3',
    nationality: 'Brasileiro',
    type: 'Liso',
    sizeCm: 60,
    weightG: 100
  },
  {
    id: 'h2',
    name: 'Cabelo Indiano Ondulado',
    description: 'Ondas naturais e toque sedoso.',
    price: 800.00,
    stock: 12,
    category: 'hair',
    image: 'https://picsum.photos/400/400?random=4',
    nationality: 'Indiano',
    type: 'Ondulado',
    sizeCm: 50,
    weightG: 100
  },
  {
    id: 'h3',
    name: 'Cabelo Regional Virgem 70cm',
    description: 'Cabelo raro de pontas cheias.',
    price: 2400.00,
    stock: 2,
    category: 'hair',
    image: 'https://picsum.photos/400/400?random=11',
    nationality: 'Brasileiro',
    type: 'Liso',
    sizeCm: 70,
    weightG: 100
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    name: 'Mega Hair Invisível Master',
    description: 'A técnica definitiva para acabamentos imperceptíveis.',
    price: 1997.00,
    stock: 100,
    category: 'course',
    image: 'https://picsum.photos/400/400?random=5',
    instructor: 'Célia Hair',
    durationHrs: 40,
    modality: 'misto'
  },
  {
    id: 'c2',
    name: 'Gestão de Salão de Luxo',
    description: 'Aprenda a faturar alto com serviços premium.',
    price: 997.00,
    stock: 50,
    category: 'course',
    image: 'https://picsum.photos/400/400?random=12',
    instructor: 'Equipe LS',
    durationHrs: 20,
    modality: 'online'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientName: 'Maria Silva', date: '2023-11-20', time: '14:00', service: 'Mega Hair', status: 'pending' },
  { id: 'a2', clientName: 'João Costa', date: '2023-11-20', time: '16:00', service: 'Corte e Escova', status: 'completed' },
  { id: 'a3', clientName: 'Bruna Mendes', date: '2023-11-21', time: '09:00', service: 'Avaliação de Cabelo', status: 'pending' }
];

export const MOCK_SAVED_HAIR: SavedHair[] = [
  {
    id: 's1',
    clientName: 'Ana Souza',
    type: 'Brasileiro Liso',
    size: 55,
    weight: 150,
    startDate: '2023-10-15', // Mais de 30 dias (deve ter taxa)
    retrievalCode: 'ABC-123',
    active: true
  },
  {
    id: 's2',
    clientName: 'Gisele B.',
    type: 'Indiano Ondulado',
    size: 60,
    weight: 200,
    startDate: '2023-11-15', // Período gratuito
    retrievalCode: 'XYZ-999',
    active: true
  }
];
