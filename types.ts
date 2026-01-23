
export enum AppView {
  Profile = 'Mi Perfil',
  Booking = 'Agenda tu Cita',
  Menu = 'Menú',
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

export interface Product {
  id: string;
  name: string;
  category: string; // Now a string to allow dynamic categories
  subCategory?: string;
  description: string;
  properties: string;
  imageUrl: string;
  availability: {
    'Del Valle': number;
    'Coyoacán': number;
  };
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