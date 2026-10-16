import React, { useState } from 'react';
import { Search, BookOpen, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';

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
    <div className="space-y-5 animate-fadeIn">
      {/* Header Banner */}
      <div className="card-subtle rounded-xl p-5 bg-white border border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Indicator Dictionary & Reference
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Canonical metrics, validated formulas, and spreadsheet column mappings.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search indicator, code, formula..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mda-600/30 focus:border-mda-600 font-medium transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all active:scale-[0.98] ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({INDICATOR_DICTIONARY.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = INDICATOR_DICTIONARY.filter(i => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(ind => (
          <div
            key={ind.id}
            className="card-subtle rounded-xl p-4 sm:p-5 bg-white border border-surface-border flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-mda-800 bg-mda-50 border border-mda-200/60 px-2 py-0.5 rounded">
                  {ind.code}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {ind.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                {ind.name}
              </h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {ind.description}
              </p>

              {/* Formula Box */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1 mb-3">
                <div className="flex items-start gap-1 text-slate-600 text-[11px]">
                  <span className="text-slate-400 font-bold uppercase w-8">Num:</span>
                  <span className="font-semibold text-slate-800 flex-1">{ind.numeratorLabel}</span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">[{ind.numeratorField}]</span>
                </div>
                <div className="flex items-start gap-1 text-slate-600 text-[11px]">
                  <span className="text-slate-400 font-bold uppercase w-8">Den:</span>
                  <span className="font-semibold text-slate-800 flex-1">{ind.denominatorLabel}</span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">[{ind.denominatorField}]</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100 font-medium">
                <span className="text-slate-500">Excel Column:</span>
                <span className="font-mono font-bold text-mda-800 bg-mda-50 px-2 py-0.5 rounded border border-mda-200">
                  Column {ind.code}
                </span>
              </div>

              <button
                onClick={() => onSelectIndicator(ind.id)}
                className="w-full mt-2 py-2 px-3 text-xs font-semibold text-center text-slate-700 bg-slate-50 hover:bg-slate-100/90 rounded-lg transition-all border border-slate-200/90 hover:border-slate-300 flex items-center justify-center gap-1.5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-mda-600"
              >
                <span>Inspect in Workbench</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
