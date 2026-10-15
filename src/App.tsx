import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { ManagementOverview } from './components/overview/ManagementOverview';
import { AnalystView } from './components/analyst/AnalystView';
import { IndicatorExplorer } from './components/indicators/IndicatorExplorer';
import { AdminPortal } from './components/admin/AdminPortal';
import { getActiveDataset, resetToBundledDataset } from './services/storageService';
import { computeGrandAggregate, computeDistrictAggregates } from './services/indicatorCalculator';
import { ActiveTab, FilterState } from './types/filter';
import { DatasetVersion } from './types/dataset';
import defaultDataset from './data/activeDataset.json';

export const App: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<DatasetVersion>(() => getActiveDataset());
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isCustomDataset, setIsCustomDataset] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-sans antialiased text-surface-dark selection:bg-mda-100 selection:text-mda-900">
      {/* Top Header */}
      <Header
        dataset={activeDataset}
        onOpenAdmin={() => setActiveTab('admin')}
        onRefresh={handleRefresh}
        isCustomDataset={isCustomDataset}
        onResetBaseline={handleResetBaseline}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
