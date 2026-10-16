import React from 'react';
import { LayoutDashboard, TableProperties, BookOpen, UploadCloud, FileText } from 'lucide-react';
import { ActiveTab } from '../../types/filter';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Executive Dashboard',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />
    },
    {
      id: 'pdf',
      label: 'Summary PDF',
      icon: <FileText className="w-3.5 h-3.5" />
    },
    {
      id: 'analyst',
      label: 'Data Workbench',
      icon: <TableProperties className="w-3.5 h-3.5" />
    },
    {
      id: 'indicators',
      label: 'Indicator Dictionary',
      icon: <BookOpen className="w-3.5 h-3.5" />
    },
    {
      id: 'admin',
      label: 'Dataset Administration',
      icon: <UploadCloud className="w-3.5 h-3.5" />
    }
  ];

  return (
    <div className="bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1.5 py-2 overflow-x-auto no-scrollbar" aria-label="Workspaces">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-1.5 px-3 text-xs font-semibold rounded-lg whitespace-nowrap transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-mda-600 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
