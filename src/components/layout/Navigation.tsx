import React from 'react';
import { LayoutDashboard, TableProperties, BookOpen, UploadCloud } from 'lucide-react';
import { ActiveTab } from '../../types/filter';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Management Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'analyst',
      label: 'Analyst Workbench',
      icon: <TableProperties className="w-4 h-4" />,
      badge: 'Drill-Down'
    },
    {
      id: 'indicators',
      label: 'Indicator Catalog',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'admin',
      label: 'Admin Portal & Upload',
      icon: <UploadCloud className="w-4 h-4" />
    }
  ];

  return (
    <div className="bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 overflow-x-auto py-2.5 no-scrollbar" aria-label="Tabs">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-2 px-3.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-mda-50 text-mda-800 ring-1 ring-inset ring-mda-600/20 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-mda-700' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-mda-200/60 text-mda-900' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
