
export enum AppView {
  Profile = 'Mi Perfil',
  Booking = 'Agenda tu Cita',
  Menu = 'Catálogo',
  Community = 'Comunidad',
  LegalTracking = 'Seguimiento Legal',
  Admin = 'Admin',
}

export interface User {
  name: string;
  email: string;
  nito: string;
  role: 'member' | 'admin';
  password?: string;
  assignedBranch?: 'Del Valle' | 'Coyoacán'; // Optional: if present, restricts admin to this branch
  legalStatus?: LegalStatus[];
}

export type AppointmentPurpose = 'Trámite' | 'Curso' | 'Retiro de Cosecha';

export interface Reservation {
  id: string;
  type: 'cita' | 'curso';
  purpose?: AppointmentPurpose; // Purpose of the appointment ('cita')
  date: string;
  time: string;
  branch: 'Del Valle' | 'Coyoacán';
  isPast: boolean;
  status?: 'active' | 'cancelled' | 'completed'; // Added status field
  userName: string;
  userNito: string;
}

export interface LegalStatus {
  processName: string;
  caseNumber: string;
  status: string;
  notes: string;
  url?: string;
  updatedAt?: string;
}

export interface ProductOption {
  name: string;
  price?: number;
  imageUrl?: string; // Optional image specific to this variant
}

export interface Product {
  id: string;
  name: string;
  category: string; // Now a string to allow dynamic categories
  subCategory?: string;
  description: string;
  properties: string;
  imageUrl: string;
  images?: string[]; // Optional gallery of additional images shown in detail modal
  availability: {
    'Del Valle': number;
    'Coyoacán': number;
  };
  isBestseller?: boolean;
  isNew?: boolean;
  brand?: string; // Marca del producto
  promotion?: {
    isActive: boolean;
    discount?: number; // Percentage discount
    description?: string; // Promotion description
  };
  options?: ProductOption[]; // e.g., sizes or variations
}

export enum CourseType {
  Presencial = 'Presencial',
  EnLineaVivo = 'En Línea (En Vivo)',
  EnLineaGrabado = 'En Línea (Grabado)',
}

export interface Course {
  id: string;
  title: string;
  type: CourseType;
  description: string;
  cost: number;
  branch?: 'Del Valle' | 'Coyoacán';
  meetingLink?: string;
  videoUrl?: string;
  schedule?: {
    date: string;
    time: string;
    branch: 'Del Valle' | 'Coyoacán';
    capacity: number;
    booked: number;
  }[];
}

export interface SierraActivity {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  content: string;
  highlights?: string[];
}

export interface CourseRegistration {
  userNito: string;
  courseId: string;
}