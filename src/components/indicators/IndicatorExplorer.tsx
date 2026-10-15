import React, { useState } from 'react';
import { Search, BookOpen, Target, CheckCircle2, Info } from 'lucide-react';
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
      <div className="card-subtle rounded-xl p-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-mda-700" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Concurrent Monitoring Indicator Dictionary
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete catalog of canonical indicators, validated mathematical formulas, targets, and column mapping aliases.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, code or alias..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-subtle border border-surface-border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mda-700"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-mda-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  isSelected
                    ? 'bg-mda-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ind => (
          <div
            key={ind.id}
            className="card-subtle rounded-xl p-5 bg-white flex flex-col justify-between hover:border-mda-400 hover:shadow-card-hover transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-mda-800 bg-mda-100 px-2 py-0.5 rounded">
                  {ind.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {ind.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {ind.name}
              </h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                {ind.description}
              </p>

              {/* Formula Box */}
              <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border text-xs space-y-1 mb-4">
                <div className="flex items-start gap-1 text-slate-700">
                  <span className="text-slate-400 font-medium">Num:</span>
                  <span className="font-medium text-slate-900">{ind.numeratorLabel}</span>
                  <span className="font-mono text-[10px] text-slate-400">({ind.numeratorField})</span>
                </div>
                <div className="flex items-start gap-1 text-slate-700">
                  <span className="text-slate-400 font-medium">Den:</span>
                  <span className="font-medium text-slate-900">{ind.denominatorLabel}</span>
                  <span className="font-mono text-[10px] text-slate-400">({ind.denominatorField})</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                <span className="text-slate-500">Benchmark Target:</span>
                <span className="font-semibold text-slate-800">
                  {ind.target ? `${ind.target}%` : 'Not Set'}
                </span>
              </div>

              <button
                onClick={() => onSelectIndicator(ind.id)}
                className="w-full mt-3 py-1.5 px-3 text-xs font-medium text-center text-mda-700 bg-mda-50 hover:bg-mda-100 rounded-lg transition-colors border border-mda-200"
              >
                Inspect in Analyst Workbench →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
