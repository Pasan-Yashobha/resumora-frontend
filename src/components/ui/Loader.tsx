import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-primary-100" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-primary-600 animate-spin" />
      </div>
      <p className="text-sm text-gray-500 font-medium">Loading Resumora…</p>
    </div>
  </div>
);

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <div className={cn('rounded-full border-2 border-primary-100 border-t-primary-600 animate-spin', sizes[size], className)} />;
};

export const Skeleton: React.FC<{ className?: string; rounded?: boolean }> = ({ className, rounded }) => (
  <div className={cn('shimmer', rounded ? 'rounded-full' : 'rounded-lg', className)} />
);

export const ResumeCardSkeleton: React.FC = () => (
  <div className="card p-5 flex flex-col gap-4">
    <Skeleton className="w-full h-36 rounded-xl" />
    <div className="flex flex-col gap-2">
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-3" />
    </div>
    <div className="flex gap-2 mt-auto">
      <Skeleton className="flex-1 h-8 rounded-lg" />
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="card p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="w-16 h-5 rounded-full" />
    </div>
    <Skeleton className="w-16 h-7" />
    <Skeleton className="w-24 h-3" />
  </div>
);

export const TemplateCardSkeleton: React.FC = () => (
  <div className="card overflow-hidden">
    <Skeleton className="w-full h-48 rounded-none rounded-t-2xl" />
    <div className="p-4 flex flex-col gap-2">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-full h-8 rounded-xl" />
    </div>
  </div>
);

export const SectionLoader: React.FC = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 p-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-full h-10" />
      </div>
    ))}
  </motion.div>
);

interface EmptyStateProps {
  icon: React.ReactNode; title: string; description: string; action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 mb-4 text-3xl">
      {icon}
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>
    {action}
  </motion.div>
);
