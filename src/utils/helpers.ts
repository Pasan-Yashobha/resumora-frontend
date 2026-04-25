import { clsx, type ClassValue } from 'clsx';
import type { Resume } from '../types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount / 100);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

// Month/Year options for date selects
export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const YEARS: number[] = (() => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear + 1; y >= 1970; y--) years.push(y);
  return years;
})();

export function formatMonthYear(val?: string): string {
  if (!val) return '';
  // val is "YYYY-MM" or "Present"
  if (val === 'Present') return 'Present';
  const [year, month] = val.split('-');
  if (!year || !month) return val;
  return `${MONTHS[parseInt(month) - 1]} ${year}`;
}

export const MOCK_RESUMES: Resume[] = [
  {
    _id: 'mock-1',
    userId: 'demo',
    title: 'Software Engineer Resume',
    thumbnailLink: '',
    template: { theme: '01', colorPalette: ['#636B2F', '#BAC095'] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profileInfo: { fullName: 'Alex Johnson', designation: 'Senior Software Engineer', summary: 'Full-stack developer with 5+ years of experience building scalable web applications.' },
    contactInfo: { email: 'alex@example.com', phone: '+1 555 000 1234', location: 'San Francisco, CA', linkedIn: 'linkedin.com/in/alexjohnson', github: 'github.com/alexj' },
    workExperience: [
      { id: 'w1', company: 'Acme Corp', role: 'Senior Engineer', startDate: '2022-01', endDate: 'Present', description: '• Led architecture of microservices platform serving 1M+ users\n• Reduced deployment time by 60% via CI/CD automation' },
      { id: 'w2', company: 'Startup Inc', role: 'Full Stack Developer', startDate: '2019-06', endDate: '2021-12', description: '• Built React + Node.js SaaS product from ground up\n• Mentored 3 junior developers' },
    ],
    education: [{ id: 'e1', degree: 'B.Sc. Computer Science', institution: 'MIT', startDate: '2015', endDate: '2019' }],
    skills: [{ id: 's1', name: 'React', progress: 95 }, { id: 's2', name: 'TypeScript', progress: 90 }, { id: 's3', name: 'Node.js', progress: 85 }, { id: 's4', name: 'AWS', progress: 75 }],
    projects: [{ id: 'p1', title: 'Resumora', description: 'SaaS resume builder with React + Spring Boot', github: 'github.com/alexj/resumora', livedemo: 'resumora.app' }],
    certifications: [{ id: 'c1', title: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2023' }],
    languages: [{ id: 'l1', name: 'English', progress: 100 }, { id: 'l2', name: 'Spanish', progress: 65 }],
    interests: ['Open Source', 'Hiking', 'Photography'],
  },
  {
    _id: 'mock-2',
    userId: 'demo',
    title: 'Product Manager CV',
    thumbnailLink: '',
    template: { theme: '02', colorPalette: ['#3D4127', '#BAC095'] },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    profileInfo: { fullName: 'Alex Johnson', designation: 'Product Manager', summary: 'Strategic PM with a track record of launching successful B2B products.' },
    contactInfo: { email: 'alex@example.com', location: 'New York, NY' },
    workExperience: [], education: [], skills: [], projects: [], certifications: [], languages: [], interests: [],
  },
];
