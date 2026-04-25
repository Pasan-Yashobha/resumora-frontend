import React from 'react';
import { cn } from '../../utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'premium' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

const badgeVariants = {
  default:  'bg-primary-50 text-primary-700 border border-primary-100',
  success:  'bg-green-50 text-green-700 border border-green-100',
  warning:  'bg-amber-50 text-amber-700 border border-amber-100',
  danger:   'bg-red-50 text-red-700 border border-red-100',
  premium:  'bg-gradient-to-r from-violet-500 to-primary-600 text-white border-0 shadow-sm',
  outline:  'bg-transparent text-gray-600 border border-gray-200',
};

const badgeSizes = {
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md', className }) => (
  <span className={cn('inline-flex items-center gap-1 font-medium', badgeVariants[variant], badgeSizes[size], className)}>
    {children}
  </span>
);

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base', xl: 'w-14 h-14 text-lg' };

export const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 'md', className }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className={cn('rounded-full flex items-center justify-center font-semibold shrink-0 overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-600 text-white', avatarSizes[size], className)}>
      {imageUrl ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
};
