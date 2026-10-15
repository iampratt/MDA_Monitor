import { IndicatorCategory } from './indicator';

export interface FilterState {
  district: string; // 'all' or specific district name
  planningUnit: string; // 'all' or specific PU name
  category: IndicatorCategory | 'All';
  selectedIndicatorId: string;
  regime: string; // 'all', 'IDA', 'DA'
  searchQuery: string;
}

export type SortField =
  | 'district'
  | 'planningUnit'
  | 'numerator'
  | 'denominator'
  | 'percentage'
  | 'teamsMonitored';

export type SortDirection = 'asc' | 'desc';

export interface TableSortState {
  field: SortField;
  direction: SortDirection;
}

export type ActiveTab = 'overview' | 'analyst' | 'indicators' | 'admin';
