// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  subscriptionPlan: 'Basic' | 'premium';
  emailVerified: boolean;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { name: string; email: string; password: string; profileImageUrl?: string; }
export interface AuthResponse extends User { token: string; }

// Resume Types
export interface ResumeTemplate {
  theme: string;          // template ID e.g. "01"-"10"
  colorPalette: string[]; // [primaryColor, accentColor]
}

export interface ProfileInfo {
  profilePreviewUrl?: string;
  fullName?: string;
  designation?: string;
  summary?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id?: string;
  name: string;
  progress: number;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  github?: string;
  livedemo?: string;
}

export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  year: string;
}

export interface Language {
  id?: string;
  name: string;
  progress: number;
}

export interface Resume {
  _id?: string;
  id?: string;
  userId: string;
  title: string;
  thumbnailLink?: string;
  template?: ResumeTemplate;
  profileInfo?: ProfileInfo;
  contactInfo?: ContactInfo;
  workExperience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  interests?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Payment Types
export interface Payment {
  _id?: string;
  userId: string;
  stripePaymentIntentId: string;
  stripeClientSecret?: string;
  stripeChargeId?: string;
  amount: number;
  currency: string;
  planType: string;
  status: 'created' | 'paid' | 'failed';
  receipt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplatesResponse {
  availableTemplates: string[];
  allTemplates: string[];
  subscriptionPlan: string;
  isPremium: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string> | string;
}

export type SectionType =
  | 'profileInfo' | 'contactInfo' | 'workExperience' | 'education'
  | 'skills' | 'projects' | 'certifications' | 'languages' | 'interests';

// Template catalog
export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  plan: 'basic' | 'premium';
  layout: 'classic' | 'modern' | 'minimal' | 'sidebar' | 'creative' | 'executive' | 'compact' | 'elegant' | 'bold' | 'timeline';
  defaultColors: string[];
}

export const COLOR_PALETTES: { name: string; colors: string[] }[] = [
  { name: 'Mossy',     colors: ['#636B2F', '#BAC095'] },
  { name: 'Indigo',    colors: ['#4F46E5', '#818cf8'] },
  { name: 'Violet',   colors: ['#7C3AED', '#a78bfa'] },
  { name: 'Rose',     colors: ['#E11D48', '#fb7185'] },
  { name: 'Sky',      colors: ['#0284C7', '#38bdf8'] },
  { name: 'Emerald',  colors: ['#059669', '#34d399'] },
  { name: 'Amber',    colors: ['#D97706', '#fbbf24'] },
  { name: 'Slate',    colors: ['#334155', '#64748b'] },
  { name: 'Teal',     colors: ['#0F766E', '#2dd4bf'] },
  { name: 'Orange',   colors: ['#EA580C', '#fb923c'] },
  { name: 'Fuchsia',  colors: ['#A21CAF', '#e879f9'] },
];

export const TEMPLATE_CATALOG: TemplateMeta[] = [
  { id: '01', name: 'Classic',    description: 'Timeless two-column with sidebar.',         plan: 'basic',   layout: 'classic',   defaultColors: ['#4F46E5','#818cf8'] },
  { id: '02', name: 'Modern',     description: 'Bold header, clean grid layout.',           plan: 'basic',   layout: 'modern',    defaultColors: ['#7C3AED','#a78bfa'] },
  { id: '03', name: 'Minimal',    description: 'Ultra-clean single-column elegance.',       plan: 'basic',   layout: 'minimal',   defaultColors: ['#334155','#64748b'] },
  { id: '04', name: 'Sidebar',    description: 'Dark accent sidebar with bright body.',     plan: 'basic',   layout: 'sidebar',   defaultColors: ['#0284C7','#38bdf8'] },
  { id: '05', name: 'Compact',    description: 'Dense, info-rich - great for engineers.',   plan: 'basic',   layout: 'compact',   defaultColors: ['#059669','#34d399'] },
  { id: '06', name: 'Executive',  description: 'Sophisticated horizontal rule layout.',     plan: 'premium', layout: 'executive', defaultColors: ['#334155','#64748b'] },
  { id: '07', name: 'Creative',   description: 'Standout design for creative roles.',       plan: 'premium', layout: 'creative',  defaultColors: ['#A21CAF','#e879f9'] },
  { id: '08', name: 'Elegant',    description: 'Serif accents and refined spacing.',        plan: 'premium', layout: 'elegant',   defaultColors: ['#D97706','#fbbf24'] },
  { id: '09', name: 'Bold',       description: 'High contrast, maximum visual impact.',     plan: 'premium', layout: 'bold',      defaultColors: ['#E11D48','#fb7185'] },
  { id: '10', name: 'Timeline',   description: 'Vertical timeline for experience section.', plan: 'premium', layout: 'timeline',  defaultColors: ['#0F766E','#2dd4bf'] },
];
