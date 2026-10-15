import React from 'react';
import { LayoutDashboard, TableProperties, BookOpen, UploadCloud } from 'lucide-react';
import { ActiveTab } from '../../types/filter';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Management Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'analyst',
      label: 'Analyst Workbench',
      icon: <TableProperties className="w-4 h-4" />
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
        <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto py-2 sm:py-0">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-mda-700 text-mda-700 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
