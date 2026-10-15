import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { ManagementOverview } from './components/overview/ManagementOverview';
import { AnalystView } from './components/analyst/AnalystView';
import { IndicatorExplorer } from './components/indicators/IndicatorExplorer';
import { AdminPortal } from './components/admin/AdminPortal';
import { ExecutiveReportView } from './components/report/ExecutiveReportView';
import { PdfViewerPage } from './components/report/PdfViewerPage';
import { getActiveDataset, resetToBundledDataset } from './services/storageService';
import { computeGrandAggregate, computeDistrictAggregates } from './services/indicatorCalculator';
import { ActiveTab, FilterState } from './types/filter';
import { DatasetVersion } from './types/dataset';
import defaultDataset from './data/activeDataset.json';

const getInitialTab = (): ActiveTab => {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#/pdf' || hash === '#pdf' || hash === '#/report' || hash === '#report') return 'pdf';
  if (hash === '#/analyst' || hash === '#analyst') return 'analyst';
  if (hash === '#/indicators' || hash === '#indicators') return 'indicators';
  if (hash === '#/admin' || hash === '#admin') return 'admin';
  return 'overview';
};

export const App: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<DatasetVersion>(() => getActiveDataset());
  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab);
  const [isCustomDataset, setIsCustomDataset] = useState<boolean>(false);

  // Synchronize hash routing with activeTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/pdf' || hash === '#pdf' || hash === '#/report' || hash === '#report') setActiveTab('pdf');
      else if (hash === '#/analyst' || hash === '#analyst') setActiveTab('analyst');
      else if (hash === '#/indicators' || hash === '#indicators') setActiveTab('indicators');
      else if (hash === '#/admin' || hash === '#admin') setActiveTab('admin');
      else if (hash === '#/' || hash === '' || hash === '#overview') setActiveTab('overview');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'overview' ? '' : `#/${tab}`;
  };

  // Synchronize custom dataset check
  useEffect(() => {
    setIsCustomDataset(activeDataset.id !== (defaultDataset as any).id);
  }, [activeDataset]);

  // Master Filter State for Analyst View
  const [filterState, setFilterState] = useState<FilterState>({
    district: 'all',
    planningUnit: 'all',
    category: 'All',
    selectedIndicatorId: 'teams_visited_area',
    regime: 'all',
    searchQuery: ''
  });

  // Calculate aggregates
  const grandAggregate = useMemo(() => {
    return computeGrandAggregate(activeDataset.records);
  }, [activeDataset]);

  const districtAggregates = useMemo(() => {
    return computeDistrictAggregates(activeDataset.records);
  }, [activeDataset]);

  // Navigate directly to Analyst View with prefilled filters
  const handleNavigateToAnalyst = (filters: { district?: string; indicatorId?: string; category?: string }) => {
    setFilterState(prev => ({
      ...prev,
      district: filters.district ?? prev.district,
      selectedIndicatorId: filters.indicatorId ?? prev.selectedIndicatorId,
      category: (filters.category as any) ?? prev.category,
      planningUnit: 'all'
    }));
    setActiveTab('analyst');
  };

  const handleResetFilters = () => {
    setFilterState({
      district: 'all',
      planningUnit: 'all',
      category: 'All',
      selectedIndicatorId: 'teams_visited_area',
      regime: 'all',
      searchQuery: ''
    });
  };

  const handleRefresh = () => {
    const latest = getActiveDataset();
    setActiveDataset(latest);
  };

  const handleResetBaseline = () => {
    const baseline = resetToBundledDataset();
    setActiveDataset(baseline);
    setIsCustomDataset(false);
  };

  const handleDatasetUpdated = (newDataset: DatasetVersion) => {
    setActiveDataset(newDataset);
    setIsCustomDataset(true);
  };

  if (activeTab === 'pdf') {
    return (
      <PdfViewerPage
        dataset={activeDataset}
        grandAggregate={grandAggregate}
        districtAggregates={districtAggregates}
        rows={activeDataset.records}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans antialiased text-surface-dark selection:bg-mda-100 selection:text-mda-900">
      {/* Top Header */}
      <Header
        dataset={activeDataset}
        onOpenAdmin={() => handleTabChange('admin')}
        onOpenReport={() => handleTabChange('pdf')}
        onRefresh={handleRefresh}
        isCustomDataset={isCustomDataset}
        onResetBaseline={handleResetBaseline}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <ManagementOverview
            districtAggregates={districtAggregates}
            grandAggregate={grandAggregate}
            rows={activeDataset.records}
            onNavigateToAnalyst={handleNavigateToAnalyst}
          />
        )}

        {activeTab === 'report' && (
          <ExecutiveReportView
            dataset={activeDataset}
            grandAggregate={grandAggregate}
            districtAggregates={districtAggregates}
            rows={activeDataset.records}
            onNavigateToIndicator={indicatorId => handleNavigateToAnalyst({ indicatorId })}
            onNavigateToDistrict={district => handleNavigateToAnalyst({ district })}
          />
        )}

        {activeTab === 'analyst' && (
          <AnalystView
            rows={activeDataset.records}
            filterState={filterState}
            onFilterChange={updates => setFilterState(prev => ({ ...prev, ...updates }))}
            onResetFilters={handleResetFilters}
            grandAggregate={grandAggregate}
          />
        )}

        {activeTab === 'indicators' && (
          <IndicatorExplorer
            onSelectIndicator={indicatorId => handleNavigateToAnalyst({ indicatorId })}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            currentDataset={activeDataset}
            onDatasetUpdated={handleDatasetUpdated}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
