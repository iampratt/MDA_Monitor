import { ColumnMapping } from '../types/dataset';
import { INDICATOR_DICTIONARY } from '../data/indicatorDictionary';

// Dictionary of aliases for all raw metric columns
export const CANONICAL_FIELD_ALIASES: Record<string, { label: string; aliases: string[]; required?: boolean }> = {
  // Dimensions
  district: {
    label: 'District Name',
    aliases: ['district', 'district name', 'dist_name', 'dist', 'dname'],
    required: true
  },
  planningUnit: {
    label: 'Planning Unit Name',
    aliases: ['planning unit', 'planning unit name', 'pu name', 'puname', 'block name', 'block', 'pu'],
    required: true
  },
  regime: {
    label: 'Regime (IDA / DA)',
    aliases: ['ida / da', 'ida/da', 'regime', 'treatment regime', 'category'],
    required: false
  },

  // Measurements
  D: {
    label: 'No. of Teams Monitored',
    aliases: ['no. of teams monitored', 'teams monitored', 'sum of monitoring_done', 'monitoring_done', 'teams_monitored', 'monitored teams', 'd'],
    required: true
  },
  E: {
    label: 'No. of Teams Visited Area',
    aliases: ['no. of teams visited area', 'sum of team_visited_area_y', 'team_visited_area_y', 'teams visited area', 'visited area', 'e'],
    required: true
  },
  F: {
    label: 'No. of teams not found working',
    aliases: ['no. of teams not found working', 'sum of no. of teams not found working', 'teams not found working', 'not working teams', 'f']
  },
  G: {
    label: 'Reason: Team Not Turned Up',
    aliases: ['no. of teams with reason_teamnotturnedup', 'sum of reason_teamnotturnedup', 'reason_teamnotturnedup', 'team not turned up', 'g']
  },
  H: {
    label: 'Reason: Microplan Changed',
    aliases: ['no. of teams with reason_mp_changed', 'sum of reason_mp_changed', 'reason_mp_changed', 'mp changed', 'h']
  },
  I: {
    label: 'Reason: Team Not Aware',
    aliases: ['no. of teams with reason_team not aware', 'sum of reason_teamnotaware', 'reason_team not aware', 'team not aware', 'i']
  },
  J: {
    label: 'Reason: Other',
    aliases: ['no. of teams with reason_other', 'sum of reason_other', 'reason_other', 'other reason', 'j']
  },
  K: {
    label: 'No. of Teams MONITOR MET (Met DA)',
    aliases: ['no. of teams monitor met', 'no. of monitoring team met da', 'monitoring team met da', 'sum of team met da', 'monitor met da', 'met da', 'k'],
    required: true
  },
  L: {
    label: 'Indelible Marker Pen Available',
    aliases: ['no. of teams with indelible marker pen available', 'marker pen available', 'marker available', 'l']
  },
  M: {
    label: 'Chalk Available',
    aliases: ['no. of teams with chalk available', 'chalk available', 'm']
  },
  N: {
    label: 'Family Register Available',
    aliases: ['no. of teams with family reg available', 'family register available', 'family reg available', 'n']
  },
  O: {
    label: 'Dose Pole/Measuring Tape Available',
    aliases: ['no. of teams with dose pole/measuring tape available', 'dose pole available', 'measuring tape available', 'o']
  },
  P: {
    label: 'Logistics Optional P',
    aliases: ['none', 'p']
  },
  Q: {
    label: 'None Logistics Available',
    aliases: ['no. of teams with none logistics available', 'none logistics available', 'q']
  },
  R: {
    label: 'Microplan Available',
    aliases: ['no. of teams with mp available', 'microplan available', 'mp available', 'r']
  },
  S: {
    label: 'Working as per Microplan',
    aliases: ['no. of teams working as per mp', 'working as per mp', 'working as per microplan', 's']
  },
  T: {
    label: '1 DA as per Microplan',
    aliases: ['no. of teams with 1 da as per microplan', '1 da as per mp', 't']
  },
  U: {
    label: 'Both DA as per Microplan',
    aliases: ['no. of teams with both da as per microplan', 'both da as per mp', 'u']
  },
  V: {
    label: 'None DA as per Microplan',
    aliases: ['no. of teams with none da as per microplan', 'none da as per mp', 'v']
  },
  W: {
    label: 'Teams with a Male Member',
    aliases: ['no. of teams with a male member', 'male member in team', 'w']
  },
  X: {
    label: 'Male Member as per Microplan',
    aliases: ['no. of teams with male member as per microplan', 'male member as per mp', 'x']
  },
  Y: {
    label: '1 DA Trained',
    aliases: ['no. of teams with 1 da trained', '1 da trained', 'y']
  },
  Z: {
    label: 'At Least 1 DA Trained',
    aliases: ['no. of teams with atleast 1 da trained', 'at least 1 da trained', 'z']
  },
  AA: {
    label: 'Both DA Trained',
    aliases: ['no. of teams with both da trained', 'both da trained', 'aa']
  },
  AB: {
    label: 'None DA Trained',
    aliases: ['no. of teams with none da trained', 'none da trained', 'ab']
  },
  AC: {
    label: '1 DA Having Basic Knowledge',
    aliases: ['no. of teams with 1 da having basic knowledge', '1 da basic knowledge', 'ac']
  },
  AD: {
    label: 'Both DA Having Basic Knowledge',
    aliases: ['no. of teams with both da having basic knowledge', 'both da basic knowledge', 'ad']
  },
  AE: {
    label: 'At Least 1 DA Having Basic Knowledge',
    aliases: ['no. of teams with atleast 1 da having basic knowledge', 'atleast 1 da basic knowledge', 'ae']
  },
  AF: {
    label: 'None DA Having Basic Knowledge',
    aliases: ['no. of teams with none da having basic knowledge', 'none da basic knowledge', 'af']
  },
  AG: {
    label: 'Adequate Ivermectin Available',
    aliases: ['no. of teams with adequate ivermectin available', 'adequate ivermectin', 'ag']
  },
  AH: {
    label: 'Adequate DEC Available',
    aliases: ['no. of teams with adequate dec available', 'adequate dec', 'ah']
  },
  AI: {
    label: 'Adequate Albendazole Available',
    aliases: ['no. of teams with adequate alb available', 'adequate albendazole', 'adequate alb', 'ai']
  },
  AJ: {
    label: 'Persons Approached',
    aliases: ['no. of persons approached', 'persons approached', 'approached persons', 'aj']
  },
  AK: {
    label: 'Persons Administered Drugs',
    aliases: ['no. of persons administered drugs', 'persons administered drugs', 'administered drugs', 'ak']
  },
  AL: {
    label: 'Persons Refused Drugs',
    aliases: ['no. of persons refused to take drugs', 'persons refused', 'refused drugs', 'al']
  },
  AM: {
    label: 'Teams with Any Refusal',
    aliases: ['no. of teams with any refusal', 'any refusal', 'am']
  },
  AN: {
    label: 'Teams with Mass Refusal',
    aliases: ['no. of teams with mass refusal', 'mass refusal', 'an']
  },
  AO: {
    label: 'Noting Details of LF Cases in Register',
    aliases: ['no. of teams noting down the details of newly found lf cases in family register', 'lf cases in register', 'ao']
  },
  AP: {
    label: 'Line Listing Updated Before MDA',
    aliases: ['no. of teams with line listing of lf cases updated before the mda round', 'line listing updated', 'ap']
  },
  AQ: {
    label: 'Family Register Updated Simultaneously',
    aliases: ['no. of teams with family register updated simultaneously', 'family register simultaneously updated', 'aq']
  },
  AR: {
    label: 'Covering Missed Beneficiaries',
    aliases: ['no. of teams trying to cover missed beneficiaries of previous days', 'covering missed beneficiaries', 'ar']
  },
  AS: {
    label: 'NOT Covering Missed Beneficiaries',
    aliases: ['no. of teams not trying to cover missed beneficiaries of previous days', 'not covering missed beneficiaries', 'as']
  },
  AT: {
    label: 'Supervisor Visit: 0 Visits',
    aliases: ['no. of teams with supervisor visit_0', 'supervisor visit 0', 'at']
  },
  AU: {
    label: 'Supervisor Visit: 1 Visit',
    aliases: ['no. of teams with supervisor visit_1', 'supervisor visit 1', 'au']
  },
  AV: {
    label: 'Supervisor Visit: 2 Visits',
    aliases: ['no. of teams with supervisor visit_2', 'supervisor visit 2', 'av']
  },
  AW: {
    label: 'Supervisor Visit: 3 Visits',
    aliases: ['no. of teams with supervisor visit_3', 'supervisor visit 3', 'aw']
  },
  AX: {
    label: 'Supervisor Visit: 4 Visits',
    aliases: ['no. of teams with supervisor visit_4', 'supervisor visit 4', 'ax']
  },
  AY: {
    label: 'Supervisor Visit: 5 Visits',
    aliases: ['no. of teams with supervisor visit_5', 'supervisor visit 5', 'ay']
  },
  AZ: {
    label: 'Supervisor Visit: 6 Visits',
    aliases: ['no. of teams with supervisor visit_6', 'supervisor visit 6', 'az']
  },
  BA: {
    label: 'Supervisor Visit: 7+ Visits',
    aliases: ['no. of teams with supervisor visit_7 or >7', 'supervisor visit 7+', 'ba']
  },
  BB: {
    label: 'Supervisor Ever Visited Team Area',
    aliases: ['no. of teams whose supervisor ever visited the team area', 'supervisor ever visited', 'bb']
  }
};

/**
 * Normalizes a column header string for robust comparison
 */
export function normalizeHeaderString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[_\-\/\.\(\)\>\<\,\:\;]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Maps a list of raw column headers to canonical dataset fields
 */
export function mapColumnHeaders(rawHeaders: string[]): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];

  rawHeaders.forEach((header, index) => {
    const rawTrimmed = (header || '').trim();
    const normalized = normalizeHeaderString(rawTrimmed);

    if (!normalized) {
      mappings.push({
        sourceColumn: rawTrimmed || `Column ${index + 1}`,
        sourceIndex: index,
        canonicalField: `unmapped_${index}`,
        matchedAlias: '',
        confidence: 'unmapped',
        sampleValues: []
      });
      return;
    }

    let bestMatchField = '';
    let bestMatchedAlias = '';
    let matchConfidence: 'exact' | 'high' | 'fuzzy' | 'unmapped' = 'unmapped';

    // 1. Check Dimensions and Raw Metric Columns
    for (const [fieldKey, fieldDef] of Object.entries(CANONICAL_FIELD_ALIASES)) {
      for (const alias of fieldDef.aliases) {
        const normAlias = normalizeHeaderString(alias);
        if (normalized === normAlias) {
          bestMatchField = fieldKey;
          bestMatchedAlias = alias;
          matchConfidence = 'exact';
          break;
        } else if (normalized.includes(normAlias) || normAlias.includes(normalized)) {
          if (!bestMatchField) {
            bestMatchField = fieldKey;
            bestMatchedAlias = alias;
            matchConfidence = 'high';
          }
        }
      }
      if (matchConfidence === 'exact') break;
    }

    // 2. Check Calculated Indicator Columns (BG - CS)
    if (matchConfidence === 'unmapped') {
      for (const ind of INDICATOR_DICTIONARY) {
        for (const alias of ind.aliases) {
          const normAlias = normalizeHeaderString(alias);
          if (normalized === normAlias) {
            bestMatchField = ind.code;
            bestMatchedAlias = alias;
            matchConfidence = 'exact';
            break;
          } else if (normalized.includes(normAlias) || normAlias.includes(normalized)) {
            bestMatchField = ind.code;
            bestMatchedAlias = alias;
            matchConfidence = 'high';
          }
        }
        if (matchConfidence === 'exact') break;
      }
    }

    mappings.push({
      sourceColumn: rawTrimmed,
      sourceIndex: index,
      canonicalField: bestMatchField || `unmapped_${index}`,
      matchedAlias: bestMatchedAlias,
      confidence: matchConfidence,
      sampleValues: []
    });
  });

  return mappings;
}
