import React from 'react';
import { cn } from '../../utils/helpers';
import { MONTHS, YEARS } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string;
  leftElement?: React.ReactNode; rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label, error, hint, leftElement, rightElement, className, id, ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {leftElement && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftElement}</div>}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
            error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : 'border-gray-200 hover:border-gray-300',
            leftElement && 'pl-10', rightElement && 'pr-10', className
          )}
          {...props}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightElement}</div>}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string; hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, hint, className, id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 resize-none placeholder:text-gray-400 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
          error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
    </div>
  );
};

interface RangeInputProps {
  label?: string; value: number; onChange: (value: number) => void; min?: number; max?: number;
}

export const RangeInput: React.FC<RangeInputProps> = ({ label, value, onChange, min = 0, max = 100 }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-medium text-primary-600">{value}%</span>
      </div>
    )}
    <input
      type="range" min={min} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary-600"
      style={{ background: `linear-gradient(to right, #636B2F 0%, #636B2F ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)` }}
    />
  </div>
);

// Month/Year date select 
interface DateSelectProps {
  label?: string;
  value: string; // "YYYY-MM" or "Present" or ""
  onChange: (value: string) => void;
  allowPresent?: boolean;
  error?: string;
}

export const DateSelect: React.FC<DateSelectProps> = ({ label, value, onChange, allowPresent = false, error }) => {
  const isPresent = value === 'Present';
  const [year, month] = value && !isPresent ? value.split('-') : ['', ''];

  const handleMonth = (m: string) => {
    const y = year || new Date().getFullYear().toString();
    onChange(`${y}-${m}`);
  };

  const handleYear = (y: string) => {
    const m = month || '01';
    onChange(`${y}-${m}`);
  };

  const handlePresent = (checked: boolean) => {
    onChange(checked ? 'Present' : '');
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      {allowPresent && (
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer mb-1">
          <input
            type="checkbox"
            checked={isPresent}
            onChange={(e) => handlePresent(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Currently working here
        </label>
      )}
      {!isPresent && (
        <div className="grid grid-cols-2 gap-2">
          <select
            value={month || ''}
            onChange={(e) => handleMonth(e.target.value)}
            className={cn(
              'rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
            ))}
          </select>
          <select
            value={year || ''}
            onChange={(e) => handleYear(e.target.value)}
            className={cn(
              'rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <option value="">Year</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Year-only select (for education/certifications)
interface YearSelectProps {
  label?: string; value: string; onChange: (v: string) => void; error?: string;
}

export const YearSelect: React.FC<YearSelectProps> = ({ label, value, onChange, error }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
        error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
      )}
    >
      <option value="">Select year</option>
      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
