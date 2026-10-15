import * as XLSX from 'xlsx';
import { ColumnMapping, MonitoringRow, ValidationSummary } from '../types/dataset';
import { mapColumnHeaders, normalizeHeaderString } from './columnMapper';

export interface ParsedSheetInfo {
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface ParseResult {
  sheetNames: string[];
  selectedSheet: string;
  detectedHeaderRow: number; // 1-indexed
  headers: string[];
  mappings: ColumnMapping[];
  detailRows: MonitoringRow[];
  districtTotalRows: MonitoringRow[];
  grandTotalRow?: MonitoringRow;
  validationSummary: ValidationSummary;
  rawJsonPreview: Record<string, any>[];
}

/**
 * Inspects an Excel or CSV file and lists all worksheets
 */
export async function inspectWorkbookSheets(file: File): Promise<{
  workbook: XLSX.WorkBook;
  sheets: ParsedSheetInfo[];
}> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  const sheets: ParsedSheetInfo[] = workbook.SheetNames.map(name => {
    const sheet = workbook.Sheets[name];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    return {
      name,
      rowCount: range.e.r - range.s.r + 1,
      columnCount: range.e.c - range.s.c + 1
    };
  });

  return { workbook, sheets };
}

/**
 * Auto-detects the most likely header row index (1-indexed) in the worksheet
 */
export function detectHeaderRowIndex(rows: any[][]): number {
  const keywords = ['district', 'planning unit', 'monitored', 'ida', 'visited area', 'met da', 'block'];

  let bestRowIdx = 1;
  let maxScore = 0;

  // Check first 15 rows
  const limit = Math.min(15, rows.length);
  for (let i = 0; i < limit; i++) {
    const row = rows[i] || [];
    let score = 0;
    const rowText = row.map(cell => normalizeHeaderString(String(cell || ''))).join(' ');

    keywords.forEach(kw => {
      if (rowText.includes(kw)) {
        score += 2;
      }
    });

    // Favor rows with many non-empty string headers
    const stringHeadersCount = row.filter(cell => typeof cell === 'string' && cell.trim().length > 1).length;
    score += stringHeadersCount * 0.1;

    if (score > maxScore) {
      maxScore = score;
      bestRowIdx = i + 1; // 1-indexed
    }
  }

  return bestRowIdx;
}

/**
 * Parses a selected worksheet from an Excel/CSV file with robust column mapping
 */
export async function parseWorksheet(
  workbook: XLSX.WorkBook,
  sheetName: string,
  forcedHeaderRow?: number
): Promise<ParseResult> {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in workbook.`);
  }

  // Convert raw sheet to array of rows
  const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    blankrows: false
  });

  if (rawRows.length === 0) {
    throw new Error(`Sheet "${sheetName}" is empty.`);
  }

  const detectedHeaderRow = forcedHeaderRow ?? detectHeaderRowIndex(rawRows);
  const headerRow0 = detectedHeaderRow - 1; // 0-indexed

  const headerStrings = (rawRows[headerRow0] || []).map(cell => String(cell || '').trim());
  const mappings = mapColumnHeaders(headerStrings);

  const colLetterToIdx: Record<string, number> = {};
  mappings.forEach(m => {
    if (m.canonicalField && !m.canonicalField.startsWith('unmapped_')) {
      colLetterToIdx[m.canonicalField] = m.sourceIndex;
    }
  });

  const detailRows: MonitoringRow[] = [];
  const districtTotalRows: MonitoringRow[] = [];
  let grandTotalRow: MonitoringRow | undefined = undefined;
  let trailingExcludedCount = 0;
  let districtTotalsExcluded = 0;

  const dataRowsStart = headerRow0 + 1;

  for (let r = dataRowsStart; r < rawRows.length; r++) {
    const rowCells = rawRows[r] || [];

    // Get District (col A) and Planning Unit (col B)
    const distIdx = colLetterToIdx['district'] ?? 0;
    const puIdx = colLetterToIdx['planningUnit'] ?? 1;
    const regimeIdx = colLetterToIdx['regime'] ?? 2;

    const rawDistrict = rowCells[distIdx] !== null ? String(rowCells[distIdx]).trim() : '';
    const rawPu = rowCells[puIdx] !== null ? String(rowCells[puIdx]).trim() : '';
    const rawRegime = rowCells[regimeIdx] !== null ? String(rowCells[regimeIdx]).trim() : 'IDA';

    // If both district and PU are empty, this is an unlabelled trailing row (like row 94/96)
    if (!rawDistrict && !rawPu) {
      trailingExcludedCount++;
      continue;
    }

    const rawMetrics: Record<string, number | null> = {};
    const sheetPercentages: Record<string, number | null> = {};

    mappings.forEach(m => {
      const cellVal = rowCells[m.sourceIndex];
      let numVal: number | null = null;
      if (cellVal !== null && cellVal !== undefined && cellVal !== '') {
        const parsed = Number(cellVal);
        numVal = isNaN(parsed) ? null : parsed;
      }

      if (m.canonicalField && !m.canonicalField.startsWith('unmapped_')) {
        // Classify whether it's raw count or percentage
        if (['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ', 'BA', 'BB'].includes(m.canonicalField)) {
          rawMetrics[m.canonicalField] = numVal;
        } else if (!['district', 'planningUnit', 'regime'].includes(m.canonicalField)) {
          sheetPercentages[m.canonicalField] = numVal;
        }
      }
    });

    const monitoringRow: MonitoringRow = {
      sourceRowIndex: r + 1,
      district: rawDistrict,
      planningUnit: rawPu,
      regime: rawRegime,
      rawMetrics,
      sheetPercentages
    };

    const isGrandTotal = rawDistrict.toLowerCase().includes('grand total') || rawPu.toLowerCase().includes('pus');
    const isDistrictTotal = rawDistrict.toLowerCase().includes('total') || (!rawPu && rawDistrict);

    if (isGrandTotal) {
      grandTotalRow = monitoringRow;
    } else if (isDistrictTotal) {
      districtTotalsExcluded++;
      monitoringRow.district = rawDistrict.replace(/ total/gi, '').trim();
      districtTotalRows.push(monitoringRow);
    } else {
      detailRows.push(monitoringRow);
    }
  }

  // Compile validation summary
  const unmapped = mappings.filter(m => m.confidence === 'unmapped').map(m => m.sourceColumn).filter(Boolean);
  const missingRequired: string[] = [];

  if (colLetterToIdx['district'] === undefined) missingRequired.push('District Name');
  if (colLetterToIdx['planningUnit'] === undefined) missingRequired.push('Planning Unit Name');
  if (colLetterToIdx['D'] === undefined) missingRequired.push('No. of Teams Monitored (Column D)');
  if (colLetterToIdx['K'] === undefined) missingRequired.push('No. of Teams Met DA (Column K)');

  const warnings: string[] = [];
  const errors: string[] = [];

  if (missingRequired.length > 0) {
    errors.push(`Missing required columns: ${missingRequired.join(', ')}`);
  }

  if (detailRows.length === 0) {
    errors.push('No valid planning unit detail rows could be detected.');
  }

  if (districtTotalsExcluded > 0) {
    warnings.push(`Safely excluded ${districtTotalsExcluded} district subtotal rows to prevent double counting.`);
  }

  if (grandTotalRow) {
    warnings.push(`Safely excluded precomputed grand total row (${grandTotalRow.district} - ${grandTotalRow.planningUnit}) from aggregates.`);
  }

  if (trailingExcludedCount > 0) {
    warnings.push(`Ignored ${trailingExcludedCount} trailing unlabelled summary rows.`);
  }

  const validationSummary: ValidationSummary = {
    isValid: errors.length === 0,
    totalRowsProcessed: rawRows.length - dataRowsStart,
    detailRowsCount: detailRows.length,
    districtTotalsExcludedCount: districtTotalsExcluded,
    grandTotalExcluded: !!grandTotalRow,
    trailingRowsExcludedCount: trailingExcludedCount,
    unmappedColumns: unmapped,
    missingRequiredColumns: missingRequired,
    warnings,
    errors,
    zeroDenominatorCount: 0
  };

  // Generate lightweight raw preview for the first 10 rows
  const rawJsonPreview = rawRows.slice(headerRow0, headerRow0 + 11).map((row, idx) => {
    const item: Record<string, any> = { '#': idx === 0 ? 'Header' : idx };
    row.forEach((c, cIdx) => {
      const colName = headerStrings[cIdx] || `Col ${cIdx + 1}`;
      item[colName] = c;
    });
    return item;
  });

  return {
    sheetNames: workbook.SheetNames,
    selectedSheet: sheetName,
    detectedHeaderRow,
    headers: headerStrings,
    mappings,
    detailRows,
    districtTotalRows,
    grandTotalRow,
    validationSummary,
    rawJsonPreview
  };
}
