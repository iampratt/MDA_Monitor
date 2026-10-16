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
      label: 'Executive Overview',
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
    <div className="bg-[#FFFFFF] border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2 overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-1" aria-label="Workspaces">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 py-1.5 px-3.5 text-xs rounded-md whitespace-nowrap transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
                    isActive
                      ? 'bg-[#14532D] text-white font-medium shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] font-normal'
                  }`}
                >
                  <span className={isActive ? 'text-[#86EFAC]' : 'text-[#94A3B8]'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
