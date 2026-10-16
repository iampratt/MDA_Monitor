import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { getCategoryTheme } from '../../data/categoryThemes';

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
      <div className="bento-card rounded-xl p-5 bg-white border border-[#EAEAEA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-normal text-[#111111] tracking-tight">
              Indicator Dictionary & Reference
            </h2>
            <p className="text-xs text-[#787774] mt-0.5 font-normal">
              Canonical metrics, validated raw mathematical formulas, and spreadsheet column mappings.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#787774] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search indicator, code, formula..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F3] border border-[#EAEAEA] rounded-md text-[#111111] placeholder-[#787774] focus:outline-none focus:border-[#14532D] font-normal"
            />
          </div>
        </div>

        {/* Category Filter Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#EAEAEA]">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all active:scale-[0.98] ${
              selectedCategory === 'All'
                ? 'bg-[#14532D] text-white font-medium shadow-xs'
                : 'bg-[#F1F1EF] text-[#5A5A58] hover:bg-[#EAEAEA]'
            }`}
          >
            All ({INDICATOR_DICTIONARY.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = INDICATOR_DICTIONARY.filter(i => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            const theme = getCategoryTheme(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all active:scale-[0.98] ${
                  isSelected
                    ? `${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} font-bold shadow-xs`
                    : 'bg-[#F1F1EF] text-[#5A5A58] hover:bg-[#EAEAEA]'
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
        {filtered.map(ind => {
          const theme = getCategoryTheme(ind.category);
          return (
            <div
              key={ind.id}
              className="bento-card rounded-xl p-5 bg-white border border-[#EAEAEA] flex flex-col justify-between hover:border-[#CCCCCC] transition-all relative overflow-hidden"
            >
              {/* Subtle top indicator color accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: theme.accentColor }}
              />

              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {ind.code}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                    {ind.category}
                  </span>
                </div>

                <h3 className="text-sm font-medium text-[#111111] mb-1 leading-snug">
                  {ind.name}
                </h3>
                <p className="text-xs text-[#787774] mb-3 line-clamp-2">
                  {ind.description}
                </p>

                {/* Formula Box */}
                <div className="p-2.5 rounded-md bg-[#FBFBFA] border border-[#EAEAEA] text-xs space-y-1 mb-3">
                  <div className="flex items-start gap-1 text-[#787774] text-[11px]">
                    <span className="text-[#5A5A58] font-medium uppercase w-8">Num:</span>
                    <span className="text-[#111111] font-medium flex-1">{ind.numeratorLabel}</span>
                    <span className="font-mono text-[10px] text-[#787774]">[{ind.numeratorField}]</span>
                  </div>
                  <div className="flex items-start gap-1 text-[#787774] text-[11px]">
                    <span className="text-[#5A5A58] font-medium uppercase w-8">Den:</span>
                    <span className="text-[#111111] font-medium flex-1">{ind.denominatorLabel}</span>
                    <span className="font-mono text-[10px] text-[#787774]">[{ind.denominatorField}]</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs py-2 border-t border-[#EAEAEA]">
                  <span className="text-[#787774]">Excel Column:</span>
                  <span className="font-mono text-xs text-[#2F3437] bg-[#F1F1EF] px-2 py-0.5 rounded border border-[#E3E3E0]">
                    Column {ind.code}
                  </span>
                </div>

                <button
                  onClick={() => onSelectIndicator(ind.id)}
                  className="w-full mt-2 py-1.5 px-3 text-xs font-semibold text-center text-[#111111] bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 rounded-md transition-colors border border-[#EAEAEA] flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <span>Inspect in Workbench</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
