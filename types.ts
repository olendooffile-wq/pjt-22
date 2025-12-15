
export enum UserRole {
  CLIENT = 'cliente',
  STUDENT = 'aluno',
  APPRAISER = 'avalista',
  MANAGER = 'gerente',
  ADMIN = 'admin'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  loyaltyPoints: number;
  loyaltyLevel: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'product' | 'hair' | 'course';
  image: string;
}

export interface Hair extends Product {
  nationality: string;
  type: string;
  sizeCm: number;
  weightG: number;
}

export interface Course extends Product {
  instructor: string;
  durationHrs: number;
  modality: 'online' | 'presencial' | 'misto';
}

export interface CartItem {
  product: Product | Hair | Course;
  quantity: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'completed' | 'canceled';
}

export interface SavedHair {
  id: string;
  clientName: string;
  type: string;
  size: number;
  weight: number;
  startDate: string;
  retrievalCode: string;
  active: boolean;
}
