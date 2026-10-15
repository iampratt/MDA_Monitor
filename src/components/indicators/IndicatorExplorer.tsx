import React, { useState } from 'react';
import { Search, BookOpen, Target, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { IndicatorCategory } from '../../types/indicator';

interface IndicatorExplorerProps {
  onSelectIndicator: (indicatorId: string) => void;
}

export const IndicatorExplorer: React.FC<IndicatorExplorerProps> = ({ onSelectIndicator }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = INDICATOR_DICTIONARY.filter(ind => {
    if (selectedCategory !== 'All' && ind.category !== selectedCategory) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = ind.name.toLowerCase().includes(q);
      const matchCode = ind.code.toLowerCase().includes(q);
      const matchAliases = ind.aliases.some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchCode && !matchAliases) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="card-subtle rounded-2xl p-6 bg-white shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-mda-50 text-mda-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Concurrent Monitoring Indicator Dictionary
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete catalog of canonical indicators, validated mathematical formulas, targets, and column mapping aliases.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by indicator name, code or alias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-subtle border border-surface-border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mda-700 font-medium"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              selectedCategory === 'All'
                ? 'bg-mda-700 text-white shadow-xs'
                : 'bg-surface-subtle text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories ({INDICATOR_DICTIONARY.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = INDICATOR_DICTIONARY.filter(i => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSelected
                    ? 'bg-mda-700 text-white shadow-xs'
                    : 'bg-surface-subtle text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(ind => (
          <div
            key={ind.id}
            className="card-subtle rounded-2xl p-6 bg-white flex flex-col justify-between hover:border-mda-400 hover:shadow-card-hover transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-bold text-mda-800 bg-mda-100/80 border border-mda-200 px-2.5 py-1 rounded-md">
                  {ind.code}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {ind.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                {ind.name}
              </h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                {ind.description}
              </p>

              {/* Formula Box */}
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border text-xs space-y-1.5 mb-4">
                <div className="flex items-start gap-1.5 text-slate-700">
                  <span className="text-slate-400 font-semibold text-[11px] uppercase w-8">Num:</span>
                  <span className="font-semibold text-slate-900 flex-1">{ind.numeratorLabel}</span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">[{ind.numeratorField}]</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-700">
                  <span className="text-slate-400 font-semibold text-[11px] uppercase w-8">Den:</span>
                  <span className="font-semibold text-slate-900 flex-1">{ind.denominatorLabel}</span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">[{ind.denominatorField}]</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs py-2.5 border-t border-slate-100 font-medium">
                <span className="text-slate-500">Benchmark Target:</span>
                <span className="font-extrabold text-slate-900">
                  {ind.target ? `${ind.target}%` : 'Standard'}
                </span>
              </div>

              <button
                onClick={() => onSelectIndicator(ind.id)}
                className="w-full mt-2.5 py-2 px-3 text-xs font-bold text-center text-mda-800 bg-mda-50 hover:bg-mda-100 rounded-xl transition-all border border-mda-200/60 flex items-center justify-center gap-1.5 group-hover:bg-mda-700 group-hover:text-white group-hover:border-mda-700 shadow-xs"
              >
                <span>Inspect in Analyst Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
