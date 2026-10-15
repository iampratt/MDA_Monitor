export type IndicatorCategory =
  | 'Coverage'
  | 'Reasons Not Working'
  | 'Logistics'
  | 'Microplan & Team'
  | 'Training'
  | 'Knowledge'
  | 'Drug Availability'
  | 'Drug Administration'
  | 'Refusal'
  | 'Documentation'
  | 'Supervision';

export type IndicatorDirection = 'high_is_good' | 'low_is_good' | 'neutral';

export type AggregationMethod = 'sum_ratio' | 'count_sum' | 'custom';

export interface IndicatorDefinition {
  id: string;
  code: string; // Column letter in original sheet, e.g. 'BG', 'BM', etc.
  name: string;
  shortName: string;
  category: IndicatorCategory;
  description: string;
  numeratorField: string;
  numeratorLabel: string;
  denominatorField: string;
  denominatorLabel: string;
  target: number | null; // e.g. 90 for 90%
  warningThreshold: number | null; // e.g. 75
  direction: IndicatorDirection;
  aliases: string[]; // Known header aliases for auto-mapping
  isPrimaryKpi?: boolean;
  notes?: string;
}

export interface CalculatedIndicatorValue {
  indicatorId: string;
  numerator: number;
  denominator: number;
  percentage: number | null;
  formattedPercentage: string;
  status: 'good' | 'warning' | 'danger' | 'neutral' | 'no_data';
  meetsTarget: boolean | null;
}

export interface DistrictAggregate {
  district: string;
  totalPlanningUnits: number;
  rawSums: Record<string, number>;
  indicatorValues: Record<string, CalculatedIndicatorValue>;
}

export interface GrandAggregate {
  totalDistricts: number;
  totalPlanningUnits: number;
  rawSums: Record<string, number>;
  indicatorValues: Record<string, CalculatedIndicatorValue>;
}
