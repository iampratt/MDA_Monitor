import { IndicatorCategory } from '../types/indicator';

export interface CategoryTheme {
  category: IndicatorCategory | string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentBar: string;
  accentColor: string;
  subtleBg: string;
}

const DEFAULT_THEME: CategoryTheme = {
  category: 'General',
  badgeBg: 'bg-slate-100',
  badgeText: 'text-slate-800',
  badgeBorder: 'border-slate-200',
  accentBar: 'bg-slate-500',
  accentColor: '#64748B',
  subtleBg: 'bg-slate-50/50'
};

const CATEGORY_THEME_MAP: Record<string, CategoryTheme> = {
  'Coverage': {
    category: 'Coverage',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    accentBar: 'bg-emerald-600',
    accentColor: '#059669',
    subtleBg: 'bg-emerald-50/20'
  },
  'Reasons Not Working': {
    category: 'Reasons Not Working',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    accentBar: 'bg-rose-500',
    accentColor: '#E11D48',
    subtleBg: 'bg-rose-50/20'
  },
  'Logistics': {
    category: 'Logistics',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
    accentBar: 'bg-blue-600',
    accentColor: '#2563EB',
    subtleBg: 'bg-blue-50/20'
  },
  'Microplan & Team': {
    category: 'Microplan & Team',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    accentBar: 'bg-amber-500',
    accentColor: '#D97706',
    subtleBg: 'bg-amber-50/20'
  },
  'Training': {
    category: 'Training',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
    accentBar: 'bg-purple-600',
    accentColor: '#7C3AED',
    subtleBg: 'bg-purple-50/20'
  },
  'Knowledge': {
    category: 'Knowledge',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
    badgeBorder: 'border-sky-200',
    accentBar: 'bg-sky-600',
    accentColor: '#0284C7',
    subtleBg: 'bg-sky-50/20'
  },
  'Drug Availability': {
    category: 'Drug Availability',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-200',
    accentBar: 'bg-teal-600',
    accentColor: '#0D9488',
    subtleBg: 'bg-teal-50/20'
  },
  'Drug Administration': {
    category: 'Drug Administration',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
    accentBar: 'bg-emerald-700',
    accentColor: '#047857',
    subtleBg: 'bg-emerald-50/25'
  },
  'Refusal': {
    category: 'Refusal',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-800',
    badgeBorder: 'border-red-200',
    accentBar: 'bg-red-500',
    accentColor: '#DC2626',
    subtleBg: 'bg-red-50/20'
  },
  'Documentation': {
    category: 'Documentation',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    accentBar: 'bg-indigo-500',
    accentColor: '#6366F1',
    subtleBg: 'bg-indigo-50/20'
  },
  'Supervision': {
    category: 'Supervision',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
    accentBar: 'bg-cyan-600',
    accentColor: '#0891B2',
    subtleBg: 'bg-cyan-50/20'
  }
};

export function getCategoryTheme(category: string): CategoryTheme {
  return CATEGORY_THEME_MAP[category] || DEFAULT_THEME;
}
