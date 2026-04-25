import React from 'react';
import { motion } from 'framer-motion';
import { RiLockLine, RiCheckLine } from 'react-icons/ri';
import { Star } from "lucide-react";
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/helpers';
import type { TemplateMeta } from '../../types';

interface TemplateCardProps {
  template: TemplateMeta;
  isAvailable: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  index?: number;
}

// Mini resume preview renderer per layout
const MiniPreview: React.FC<{ layout: string; primary: string; accent: string }> = ({ layout, primary, accent }) => {
  const bar = (w: string, h = 'h-1.5', color = 'bg-gray-200/70') => (
    <div className={`${h} rounded-full ${color}`} style={{ width: w }} />
  );
  const colorBar = (w: string, h = 'h-1.5') => (
    <div className={`${h} rounded-full`} style={{ width: w, background: primary + '60' }} />
  );

  if (layout === 'classic') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden flex">
      <div className="w-1/3 p-2 flex flex-col gap-1.5" style={{ background: primary + '15' }}>
        <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ background: primary + '50' }} />
        {[...Array(5)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-200/80" />)}
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5">
        {colorBar('70%', 'h-2')}
        {bar('50%', 'h-1')}
        <div className="mt-1 space-y-1">{[...Array(4)].map((_, i) => bar(`${90 - i * 12}%`, 'h-1'))}</div>
      </div>
    </div>
  );

  if (layout === 'modern') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden">
      <div className="h-10 flex items-end px-2 pb-1.5" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
        <div className="h-1.5 rounded-full w-20 bg-white/70" />
      </div>
      <div className="p-2 flex flex-col gap-1.5">
        {[...Array(2)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-200/80" style={{ width: `${80 - i * 15}%` }} />)}
        <div className="mt-1 grid grid-cols-2 gap-1">{[...Array(4)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-200/60" />)}</div>
      </div>
    </div>
  );

  if (layout === 'minimal') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden p-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2 rounded-full w-20" style={{ background: primary + '80' }} />
      </div>
      <div className="h-px mb-2" style={{ background: primary + '40' }} />
      {[...Array(5)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-200/70 mb-1.5" style={{ width: `${85 - i * 8}%` }} />)}
    </div>
  );

  if (layout === 'sidebar') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden flex">
      <div className="w-2/5 p-2 flex flex-col gap-1.5" style={{ background: primary }}>
        <div className="w-7 h-7 rounded-full mx-auto" style={{ background: 'rgba(255,255,255,0.3)' }} />
        {[...Array(4)].map((_, i) => <div key={i} className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.35)', width: `${80 - i * 10}%` }} />)}
      </div>
      <div className="flex-1 p-2 flex flex-col gap-1.5">
        {[...Array(5)].map((_, i) => bar(`${90 - i * 10}%`, 'h-1'))}
      </div>
    </div>
  );

  if (layout === 'compact') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden p-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded" style={{ background: primary + '60' }} />
        <div className="h-2 rounded-full flex-1" style={{ background: primary + '50' }} />
      </div>
      {[...Array(6)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-200/70 mb-1" style={{ width: `${95 - i * 5}%` }} />)}
    </div>
  );

  if (layout === 'executive') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden p-2">
      <div className="text-center mb-2">
        <div className="h-2 rounded-full w-3/4 mx-auto mb-1" style={{ background: primary + '70' }} />
        <div className="h-1 rounded-full w-1/2 mx-auto bg-gray-200/70" />
      </div>
      <div className="h-px mb-2" style={{ background: primary }} />
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">{[...Array(4)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-200/70" />)}</div>
    </div>
  );

  if (layout === 'creative') return (
    <div className="absolute inset-3 rounded shadow-sm overflow-hidden" style={{ background: `linear-gradient(145deg, ${primary}18, white)` }}>
      <div className="absolute top-0 right-0 w-12 h-12 rounded-bl-full" style={{ background: primary + '25' }} />
      <div className="p-2">
        <div className="h-2 rounded-full w-24 mb-1" style={{ background: primary + '70' }} />
        <div className="h-1 rounded-full w-16 bg-gray-200/70 mb-2" />
        {[...Array(4)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-200/60 mb-1.5" style={{ width: `${80 - i * 8}%` }} />)}
      </div>
    </div>
  );

  if (layout === 'elegant') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden p-2">
      <div className="border-b-2 pb-2 mb-2" style={{ borderColor: primary + '50' }}>
        <div className="h-2 rounded w-2/3" style={{ background: primary + '60' }} />
        <div className="h-1 rounded w-1/2 bg-gray-200 mt-1" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-1 mb-1">
          <div className="w-1 h-1 rounded-full" style={{ background: primary }} />
          <div className="h-1 rounded-full bg-gray-200/70 flex-1" />
        </div>
      ))}
    </div>
  );

  if (layout === 'bold') return (
    <div className="absolute inset-3 rounded shadow-sm overflow-hidden">
      <div className="h-14" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
        <div className="p-2">
          <div className="h-2 rounded w-3/4 bg-white/80" />
          <div className="h-1 rounded w-1/2 bg-white/50 mt-1" />
        </div>
      </div>
      <div className="bg-white p-2 flex flex-col gap-1">
        {[...Array(4)].map((_, i) => bar(`${85 - i * 10}%`, 'h-1'))}
      </div>
    </div>
  );

  if (layout === 'timeline') return (
    <div className="absolute inset-3 bg-white rounded shadow-sm overflow-hidden p-2">
      <div className="h-2 rounded-full w-3/4 mb-2" style={{ background: primary + '60' }} />
      <div className="relative pl-3">
        <div className="absolute left-1 top-0 bottom-0 w-px" style={{ background: primary + '40' }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative mb-2">
            <div className="absolute -left-3 top-0.5 w-2 h-2 rounded-full" style={{ background: primary }} />
            <div className="h-1.5 rounded-full bg-gray-200/80 mb-0.5" style={{ width: `${70 - i * 10}%` }} />
            <div className="h-1 rounded-full bg-gray-100/80 w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  return null;
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template, isAvailable, isSelected, onSelect, index = 0,
}) => {
  const [primary, accent] = template.defaultColors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={cn(
        'group card overflow-hidden transition-all duration-300',
        isSelected && 'ring-2 ring-primary-500 shadow-glow',
        !isAvailable && 'opacity-75',
        isAvailable && 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
      )}
      onClick={() => isAvailable && onSelect?.(template.id)}
    >
      {/* Preview area */}
      <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, ${primary}12 0%, ${primary}06 100%)` }}>
        <MiniPreview layout={template.layout} primary={primary} accent={accent} />

        {/* Lock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white/90 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
              <RiLockLine className="w-4 h-4 text-secondary-600" />
              <span className="text-xs font-semibold text-gray-700">Premium only</span>
            </div>
          </div>
        )}

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center shadow-md">
            <RiCheckLine className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Plan badge */}
        <div className="absolute top-2 left-2">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', template.plan === 'premium' ? 'bg-violet-100 text-violet-700' : 'bg-green-100 text-green-700')}>
            {template.plan === 'premium' ? 'Premium' : 'Free'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{template.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
        </div>
        {isAvailable ? (
          <Button
            variant={isSelected ? 'primary' : 'outline'} size="sm"
            onClick={(e) => { e.stopPropagation(); onSelect?.(template.id); }}
          >
            {isSelected ? 'Selected' : 'Use'}
          </Button>
        ) : (
          <Badge variant="premium" size="sm">
            <Star className="w-3 h-3" /> Premium
          </Badge>
        )}
      </div>
    </motion.div>
  );
};
