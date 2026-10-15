import { MonitoringRow } from '../types/dataset';
import {
  IndicatorDefinition,
  CalculatedIndicatorValue,
  DistrictAggregate,
  GrandAggregate
} from '../types/indicator';
import { INDICATOR_DICTIONARY } from '../data/indicatorDictionary';

/**
 * Extracts numerator value from a monitoring row
 */
export function getRowNumerator(row: MonitoringRow, indicator: IndicatorDefinition): number | null {
  const numCol = indicator.numeratorField;
  const val = row.rawMetrics[numCol];
  if (val === null || val === undefined || isNaN(val)) {
    return null;
  }
  return Number(val);
}

/**
 * Extracts denominator value from a monitoring row
 */
export function getRowDenominator(row: MonitoringRow, indicator: IndicatorDefinition): number | null {
  const denCol = indicator.denominatorField;

  // Custom compound denominator for CQ: AR + AS
  if (denCol === 'AR_PLUS_AS') {
    const ar = row.rawMetrics['AR'];
    const as = row.rawMetrics['AS'];
    const valAR = (ar !== null && ar !== undefined && !isNaN(ar)) ? Number(ar) : 0;
    const valAS = (as !== null && as !== undefined && !isNaN(as)) ? Number(as) : 0;
    return valAR + valAS;
  }

  const val = row.rawMetrics[denCol];
  if (val === null || val === undefined || isNaN(val)) {
    return null;
  }
  return Number(val);
}

/**
 * Computes single indicator value from summed numerator and denominator
 */
export function evaluateIndicatorRatio(
  numerator: number,
  denominator: number,
  indicator: IndicatorDefinition
): CalculatedIndicatorValue {
  if (denominator <= 0 || isNaN(denominator) || isNaN(numerator)) {
    return {
      indicatorId: indicator.id,
      numerator,
      denominator,
      percentage: null,
      formattedPercentage: 'N/A',
      status: 'no_data',
      meetsTarget: null
    };
  }

  const rawPercent = (numerator / denominator) * 100;
  // Cap displayed percentage cleanly to 1 decimal place or 2 decimal places
  const percentage = Math.round(rawPercent * 10) / 10;
  const formattedPercentage = `${percentage.toFixed(1)}%`;

  let status: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
  let meetsTarget: boolean | null = null;

  if (indicator.direction === 'high_is_good') {
    const target = indicator.target ?? 90;
    const warn = indicator.warningThreshold ?? 75;
    meetsTarget = rawPercent >= target;
    if (rawPercent >= target) {
      status = 'good';
    } else if (rawPercent >= warn) {
      status = 'warning';
    } else {
      status = 'danger';
    }
  } else if (indicator.direction === 'low_is_good') {
    const target = indicator.target ?? 5;
    const warn = indicator.warningThreshold ?? 15;
    meetsTarget = rawPercent <= target;
    if (rawPercent <= target) {
      status = 'good';
    } else if (rawPercent <= warn) {
      status = 'warning';
    } else {
      status = 'danger';
    }
  }

  return {
    indicatorId: indicator.id,
    numerator,
    denominator,
    percentage,
    formattedPercentage,
    status,
    meetsTarget
  };
}

/**
 * Calculates all indicators for a collection of monitoring rows (detail rows only)
 */
export function calculateAggregateIndicators(
  rows: MonitoringRow[]
): Record<string, CalculatedIndicatorValue> {
  const result: Record<string, CalculatedIndicatorValue> = {};

  for (const indicator of INDICATOR_DICTIONARY) {
    let sumNumerator = 0;
    let sumDenominator = 0;
    let hasValidData = false;

    for (const row of rows) {
      const num = getRowNumerator(row, indicator);
      const den = getRowDenominator(row, indicator);

      if (num !== null) {
        sumNumerator += num;
      }
      if (den !== null) {
        sumDenominator += den;
        hasValidData = true;
      }
    }

    if (!hasValidData) {
      result[indicator.id] = {
        indicatorId: indicator.id,
        numerator: 0,
        denominator: 0,
        percentage: null,
        formattedPercentage: 'N/A',
        status: 'no_data',
        meetsTarget: null
      };
    } else {
      result[indicator.id] = evaluateIndicatorRatio(sumNumerator, sumDenominator, indicator);
    }
  }

  return result;
}

/**
 * Computes district-level aggregates for all districts in the dataset
 */
export function computeDistrictAggregates(rows: MonitoringRow[]): DistrictAggregate[] {
  const grouped: Record<string, MonitoringRow[]> = {};

  for (const row of rows) {
    const dName = row.district.trim();
    if (!grouped[dName]) {
      grouped[dName] = [];
    }
    grouped[dName].push(row);
  }

  const aggregates: DistrictAggregate[] = [];

  for (const [district, districtRows] of Object.entries(grouped)) {
    // Raw column sums
    const rawSums: Record<string, number> = {};
    for (const r of districtRows) {
      for (const [col, val] of Object.entries(r.rawMetrics)) {
        if (val !== null && !isNaN(val)) {
          rawSums[col] = (rawSums[col] || 0) + Number(val);
        }
      }
    }

    const indicatorValues = calculateAggregateIndicators(districtRows);

    aggregates.push({
      district,
      totalPlanningUnits: districtRows.length,
      rawSums,
      indicatorValues
    });
  }

  // Sort alphabetically by district
  return aggregates.sort((a, b) => a.district.localeCompare(b.district));
}

/**
 * Computes grand aggregate across all detail rows
 */
export function computeGrandAggregate(rows: MonitoringRow[]): GrandAggregate {
  const rawSums: Record<string, number> = {};
  const districtSet = new Set<string>();

  for (const r of rows) {
    districtSet.add(r.district.trim());
    for (const [col, val] of Object.entries(r.rawMetrics)) {
      if (val !== null && !isNaN(val)) {
        rawSums[col] = (rawSums[col] || 0) + Number(val);
      }
    }
  }

  const indicatorValues = calculateAggregateIndicators(rows);

  return {
    totalDistricts: districtSet.size,
    totalPlanningUnits: rows.length,
    rawSums,
    indicatorValues
  };
}

/**
 * Calculate indicator value for a single planning unit row
 */
export function calculateRowIndicator(
  row: MonitoringRow,
  indicator: IndicatorDefinition
): CalculatedIndicatorValue {
  const num = getRowNumerator(row, indicator) ?? 0;
  const den = getRowDenominator(row, indicator) ?? 0;
  return evaluateIndicatorRatio(num, den, indicator);
}
