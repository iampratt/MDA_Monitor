export interface MonitoringRow {
  id?: string;
  sourceRowIndex: number;
  district: string;
  planningUnit: string;
  regime?: string; // IDA or DA
  rawMetrics: Record<string, number | null>;
  sheetPercentages?: Record<string, number | null>;
  normalizedMetrics?: Record<string, number | null>;
}

export interface DatasetVersion {
  id: string;
  title?: string;
  sourceFilename: string;
  uploadedBy: string;
  uploadedAt: string;
  reportingPeriod: string;
  status: 'published' | 'draft' | 'archived' | 'failed';
  rowCount: number;
  districtCount: number;
  planningUnitCount: number;
  schemaVersion: string;
  validationSummary: ValidationSummary;
  records: MonitoringRow[];
  districtTotals?: MonitoringRow[];
  grandTotal?: MonitoringRow;
}

export interface ValidationSummary {
  isValid: boolean;
  totalRowsProcessed: number;
  detailRowsCount: number;
  districtTotalsExcludedCount: number;
  grandTotalExcluded: boolean;
  trailingRowsExcludedCount: number;
  unmappedColumns: string[];
  missingRequiredColumns: string[];
  warnings: string[];
  errors: string[];
  zeroDenominatorCount: number;
}

export interface ColumnMapping {
  sourceColumn: string;
  sourceIndex: number;
  canonicalField: string;
  matchedAlias: string;
  confidence: 'exact' | 'high' | 'fuzzy' | 'manual' | 'unmapped';
  sampleValues: (string | number | null)[];
}

export interface PublishedDatasetMeta {
  activeDatasetId: string;
  publishedAt: string;
  publishedBy: string;
  title: string;
  reportingPeriod: string;
  sourceFilename: string;
  rowCount: number;
  districtCount: number;
}
