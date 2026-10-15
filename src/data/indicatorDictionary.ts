import { IndicatorDefinition, IndicatorCategory } from '../types/indicator';

export const INDICATOR_DICTIONARY: IndicatorDefinition[] = [
  // --- Coverage ---
  {
    id: 'teams_visited_area',
    code: 'BG',
    name: '% of Teams Visited Area',
    shortName: 'Visited Area',
    category: 'Coverage',
    description: 'Percentage of monitored drug administration teams that visited their assigned area.',
    numeratorField: 'E',
    numeratorLabel: 'Teams Visited Area',
    denominatorField: 'D',
    denominatorLabel: 'Teams Monitored',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    isPrimaryKpi: true,
    aliases: [
      '% of teams visited area',
      '% teams visited area',
      'teams visited area %',
      'team visited area percentage',
      'percent teams visited area',
      'bg'
    ]
  },
  {
    id: 'teams_not_working',
    code: 'BH',
    name: '% Teams Not Found Working',
    shortName: 'Not Working',
    category: 'Coverage',
    description: 'Percentage of monitored teams that were not found actively working in the field.',
    numeratorField: 'F',
    numeratorLabel: 'Teams Not Working',
    denominatorField: 'D',
    denominatorLabel: 'Teams Monitored',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% teams not found working',
      '% of teams not found working',
      'teams not working %',
      'teams not found working percentage',
      'bh'
    ]
  },

  // --- Reasons Not Working ---
  {
    id: 'reason_team_not_turned_up',
    code: 'BI',
    name: '% Not Working: Team Not Turned Up',
    shortName: 'Team Not Turned Up',
    category: 'Reasons Not Working',
    description: 'Proportion of non-working teams where the team simply did not turn up.',
    numeratorField: 'G',
    numeratorLabel: 'Team Not Turned Up',
    denominatorField: 'F',
    denominatorLabel: 'Teams Not Working',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with reason_teamnotturnedup',
      'reason team not turned up %',
      'team not turned up',
      'bi'
    ]
  },
  {
    id: 'reason_mp_changed',
    code: 'BJ',
    name: '% Not Working: Microplan Changed',
    shortName: 'Microplan Changed',
    category: 'Reasons Not Working',
    description: 'Proportion of non-working teams due to sudden microplan schedule alteration.',
    numeratorField: 'H',
    numeratorLabel: 'Microplan Changed',
    denominatorField: 'F',
    denominatorLabel: 'Teams Not Working',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with reason_mp_changed',
      'reason microplan changed',
      'bj'
    ]
  },
  {
    id: 'reason_team_not_aware',
    code: 'BK',
    name: '% Not Working: Team Not Aware',
    shortName: 'Team Not Aware',
    category: 'Reasons Not Working',
    description: 'Proportion of non-working teams where members were unaware of MDA dates.',
    numeratorField: 'I',
    numeratorLabel: 'Team Not Aware',
    denominatorField: 'F',
    denominatorLabel: 'Teams Not Working',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with reason_team not aware',
      'team not aware %',
      'bk'
    ]
  },
  {
    id: 'reason_other',
    code: 'BL',
    name: '% Not Working: Other Reasons',
    shortName: 'Other Reason',
    category: 'Reasons Not Working',
    description: 'Proportion of non-working teams due to other logistical or local issues.',
    numeratorField: 'J',
    numeratorLabel: 'Other Reason',
    denominatorField: 'F',
    denominatorLabel: 'Teams Not Working',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with reason_other',
      'reason other %',
      'bl'
    ]
  },

  // --- Logistics Availability ---
  {
    id: 'marker_pen_available',
    code: 'BM',
    name: '% Teams with Indelible Marker Pen Available',
    shortName: 'Marker Pen',
    category: 'Logistics',
    description: 'Monitored teams met that had indelible finger markers available.',
    numeratorField: 'L',
    numeratorLabel: 'Marker Pen Available',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    isPrimaryKpi: true,
    aliases: [
      '% of teams with indelible marker pen available',
      'marker pen available %',
      'indelible marker %',
      'bm'
    ]
  },
  {
    id: 'chalk_available',
    code: 'BN',
    name: '% Teams with Chalk Available',
    shortName: 'Chalk Available',
    category: 'Logistics',
    description: 'Monitored teams met that had chalk available for household marking.',
    numeratorField: 'M',
    numeratorLabel: 'Chalk Available',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with chalk available',
      'chalk available %',
      'bn'
    ]
  },
  {
    id: 'family_reg_available',
    code: 'BO',
    name: '% Teams with Family Register Available',
    shortName: 'Family Register',
    category: 'Logistics',
    description: 'Monitored teams met that had family registers for line recording.',
    numeratorField: 'N',
    numeratorLabel: 'Family Register Available',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    isPrimaryKpi: true,
    aliases: [
      '% of teams with family reg available',
      'family register available %',
      'family reg available',
      'bo'
    ]
  },
  {
    id: 'dose_pole_available',
    code: 'BP',
    name: '% Teams with Dose Pole / Measuring Tape Available',
    shortName: 'Dose Pole',
    category: 'Logistics',
    description: 'Monitored teams met that had a dose pole or measuring tape for height-based dosing.',
    numeratorField: 'O',
    numeratorLabel: 'Dose Pole Available',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with dose pole/measuring tape available',
      'dose pole available %',
      'bp'
    ]
  },
  {
    id: 'none_logistics_available',
    code: 'BQ',
    name: '% Teams with None Logistics Available',
    shortName: 'Zero Logistics',
    category: 'Logistics',
    description: 'Teams met who were missing all critical logistics supplies.',
    numeratorField: 'Q',
    numeratorLabel: 'None Logistics',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with none logistics available',
      'none logistics %',
      'bq'
    ]
  },

  // --- Microplan & Team ---
  {
    id: 'mp_available',
    code: 'BR',
    name: '% Teams with Microplan Available',
    shortName: 'Microplan Available',
    category: 'Microplan & Team',
    description: 'Teams met with physical or digital microplan route map available.',
    numeratorField: 'R',
    numeratorLabel: 'MP Available',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with mp available',
      'microplan available %',
      'br'
    ]
  },
  {
    id: 'working_as_per_mp',
    code: 'BS',
    name: '% Teams Working as per Microplan',
    shortName: 'Working as per MP',
    category: 'Microplan & Team',
    description: 'Teams met actively adhering to their assigned microplan schedule and route.',
    numeratorField: 'S',
    numeratorLabel: 'Working as per MP',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    isPrimaryKpi: true,
    aliases: [
      '% of teams working as per mp',
      'working as per microplan %',
      'bs'
    ]
  },
  {
    id: 'both_da_as_per_mp',
    code: 'BU',
    name: '% Teams with Both DA as per Microplan',
    shortName: 'Both DA as per MP',
    category: 'Microplan & Team',
    description: 'Teams where both assigned Drug Administrators were present as planned.',
    numeratorField: 'U',
    numeratorLabel: 'Both DA as per MP',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with both da as per microplan',
      'both da as per mp %',
      'bu'
    ]
  },
  {
    id: 'male_member_present',
    code: 'BW',
    name: '% Teams with a Male Member',
    shortName: 'Male Member in Team',
    category: 'Microplan & Team',
    description: 'Teams that include at least one male member to facilitate household access.',
    numeratorField: 'W',
    numeratorLabel: 'Male Member Present',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'neutral',
    aliases: [
      '% of teams with a male member',
      'male member %',
      'bw'
    ]
  },

  // --- Training ---
  {
    id: 'both_da_trained',
    code: 'CA',
    name: '% Teams with Both DA Trained',
    shortName: 'Both DA Trained',
    category: 'Training',
    description: 'Teams where both Drug Administrators attended formal MDA training.',
    numeratorField: 'AA',
    numeratorLabel: 'Both DA Trained',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    isPrimaryKpi: true,
    aliases: [
      '% of teams with both da trained',
      'both da trained %',
      'ca'
    ]
  },
  {
    id: 'atleast_1_da_trained',
    code: 'BZ',
    name: '% Teams with at Least 1 DA Trained',
    shortName: '>= 1 DA Trained',
    category: 'Training',
    description: 'Teams where at least one member received official training.',
    numeratorField: 'Z',
    numeratorLabel: 'At Least 1 DA Trained',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with atleast 1 da trained',
      'at least 1 da trained %',
      'bz'
    ]
  },
  {
    id: 'none_da_trained',
    code: 'CB',
    name: '% Teams with None DA Trained',
    shortName: 'No DA Trained',
    category: 'Training',
    description: 'Teams where neither Drug Administrator has been trained.',
    numeratorField: 'AB',
    numeratorLabel: 'None DA Trained',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with none da trained',
      'none da trained %',
      'cb'
    ]
  },

  // --- Knowledge Assessment ---
  {
    id: 'atleast_1_basic_knowledge',
    code: 'CE',
    name: '% Teams with at Least 1 DA having Basic Knowledge',
    shortName: 'Basic Knowledge (>=1 DA)',
    category: 'Knowledge',
    description: 'Teams where at least one member correctly demonstrated drug dosing, contraindications, and protocol knowledge.',
    numeratorField: 'AE',
    numeratorLabel: 'At Least 1 DA Knowledge',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with atleast 1 da having basic knowledge',
      'basic knowledge atleast 1 da %',
      'ce'
    ]
  },
  {
    id: 'both_da_basic_knowledge',
    code: 'CD',
    name: '% Teams with Both DA having Basic Knowledge',
    shortName: 'Both DA Basic Knowledge',
    category: 'Knowledge',
    description: 'Teams where both members demonstrated sound MDA clinical knowledge.',
    numeratorField: 'AD',
    numeratorLabel: 'Both DA Knowledge',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with both da having basic knowledge',
      'both da basic knowledge %',
      'cd'
    ]
  },
  {
    id: 'none_da_basic_knowledge',
    code: 'CF',
    name: '% Teams with None DA having Basic Knowledge',
    shortName: 'No Knowledge',
    category: 'Knowledge',
    description: 'Teams where neither member possessed basic MDA guidelines knowledge.',
    numeratorField: 'AF',
    numeratorLabel: 'None DA Knowledge',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with none da having basic knowledge',
      'none da basic knowledge %',
      'cf'
    ]
  },

  // --- Drug Availability ---
  {
    id: 'adequate_ivermectin',
    code: 'CG',
    name: '% Teams with Adequate Ivermectin Available',
    shortName: 'Ivermectin Adequate',
    category: 'Drug Availability',
    description: 'Monitored teams met that had sufficient Ivermectin stock for their daily quota.',
    numeratorField: 'AG',
    numeratorLabel: 'Adequate Ivermectin',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with adequate ivermectin available',
      'adequate ivermectin %',
      'cg'
    ]
  },
  {
    id: 'adequate_dec',
    code: 'CH',
    name: '% Teams with Adequate DEC Available',
    shortName: 'DEC Adequate',
    category: 'Drug Availability',
    description: 'Monitored teams met that had sufficient Diethylcarbamazine (DEC) stock.',
    numeratorField: 'AH',
    numeratorLabel: 'Adequate DEC',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with adequate dec available',
      'adequate dec %',
      'ch'
    ]
  },
  {
    id: 'adequate_alb',
    code: 'CI',
    name: '% Teams with Adequate Albendazole Available',
    shortName: 'Albendazole Adequate',
    category: 'Drug Availability',
    description: 'Monitored teams met that had sufficient Albendazole chewable tablets.',
    numeratorField: 'AI',
    numeratorLabel: 'Adequate ALB',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with adequate alb available',
      'adequate albendazole %',
      'ci'
    ]
  },

  // --- Drug Administration & Beneficiaries ---
  {
    id: 'persons_administered',
    code: 'CJ',
    name: '% Persons Administered Drugs (Directly Observed)',
    shortName: 'Drug Consumption Rate',
    category: 'Drug Administration',
    description: 'Percentage of eligible persons approached who were directly administered the drugs.',
    numeratorField: 'AK',
    numeratorLabel: 'Persons Administered Drugs',
    denominatorField: 'AJ',
    denominatorLabel: 'Persons Approached',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    isPrimaryKpi: true,
    aliases: [
      '% persons administered drugs',
      '% of persons administered drugs',
      'persons administered drugs %',
      'drug administration rate %',
      'cj'
    ]
  },
  {
    id: 'persons_refused',
    code: 'CK',
    name: '% Persons Refused to Consume Drugs',
    shortName: 'Beneficiary Refusal Rate',
    category: 'Drug Administration',
    description: 'Percentage of approached persons refusing to consume medication.',
    numeratorField: 'AL',
    numeratorLabel: 'Persons Refused',
    denominatorField: 'AJ',
    denominatorLabel: 'Persons Approached',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% persons refused to consume drugs',
      '% of persons refused to consume drugs',
      'refusal rate %',
      'ck'
    ]
  },

  // --- Refusal ---
  {
    id: 'teams_with_refusal',
    code: 'CL',
    name: '% Teams with Any Refusal',
    shortName: 'Teams with Refusal',
    category: 'Refusal',
    description: 'Proportion of teams that encountered at least one person refusing medication in their area.',
    numeratorField: 'AM',
    numeratorLabel: 'Teams with Any Refusal',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with any refusal',
      'teams with any refusal %',
      'cl'
    ]
  },

  // --- Documentation ---
  {
    id: 'lf_cases_noted',
    code: 'CN',
    name: '% Teams Noting LF Cases in Register',
    shortName: 'LF Cases Noted',
    category: 'Documentation',
    description: 'Teams recording newly identified Lymphatic Filariasis cases in family registers.',
    numeratorField: 'AO',
    numeratorLabel: 'LF Cases Recorded',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams noting down the details of newly found lf cases in family register',
      'lf cases noted in family register %',
      'cn'
    ]
  },
  {
    id: 'line_listing_updated',
    code: 'CO',
    name: '% Teams with Line Listing Updated Before MDA',
    shortName: 'Line Listing Updated',
    category: 'Documentation',
    description: 'Teams operating in areas where the LF line list was updated prior to campaign launch.',
    numeratorField: 'AP',
    numeratorLabel: 'Line Listing Updated',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with line listing of lf cases updated before the mda round',
      'line listing updated %',
      'co'
    ]
  },
  {
    id: 'family_reg_simultaneous',
    code: 'CP',
    name: '% Teams with Family Register Updated Simultaneously',
    shortName: 'Register Updated Simultaneously',
    category: 'Documentation',
    description: 'Teams recording drug intake in the register concurrently during household visits.',
    numeratorField: 'AQ',
    numeratorLabel: 'Register Updated Simultaneously',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams with family register updated simultaneously',
      'family register updated simultaneously %',
      'cp'
    ]
  },
  {
    id: 'missed_beneficiaries_covered',
    code: 'CQ',
    name: '% Teams Covering Missed Beneficiaries',
    shortName: 'Covering Missed Beneficiaries',
    category: 'Documentation',
    description: 'Teams actively revisiting homes to cover missed members from previous days.',
    numeratorField: 'AR',
    numeratorLabel: 'Covering Missed Beneficiaries',
    denominatorField: 'AR_PLUS_AS', // Sum of AR + AS
    denominatorLabel: 'Teams with Missed Cases (AR+AS)',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    aliases: [
      '% of teams trying to cover missed beneficiaries of previous days',
      'missed beneficiaries covered %',
      'cq'
    ]
  },

  // --- Supervision ---
  {
    id: 'supervisor_ever_visited',
    code: 'CS',
    name: '% Teams Visited by Supervisor',
    shortName: 'Supervisor Visited',
    category: 'Supervision',
    description: 'Percentage of teams that received at least one supportive supervisory visit in the field.',
    numeratorField: 'BB',
    numeratorLabel: 'Supervisor Ever Visited',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'high_is_good',
    isPrimaryKpi: true,
    aliases: [
      '% of teams whose supervisor ever visited the team area',
      'supervisor visited %',
      'supervisor visit percentage',
      'cs'
    ]
  },
  {
    id: 'no_supervisor_visit',
    code: 'CR',
    name: '% Teams with No Supervisor Visit (0 Visits)',
    shortName: 'Zero Supervision',
    category: 'Supervision',
    description: 'Teams that had zero supervisor check-ins.',
    numeratorField: 'AT',
    numeratorLabel: 'No Supervisor Visit',
    denominatorField: 'K',
    denominatorLabel: 'Teams Met DA',
    target: null,
    warningThreshold: null,
    direction: 'low_is_good',
    aliases: [
      '% of teams with no supervisor visit',
      'no supervisor visit %',
      'cr'
    ]
  }
];

export const CATEGORIES: IndicatorCategory[] = [
  'Coverage',
  'Reasons Not Working',
  'Logistics',
  'Microplan & Team',
  'Training',
  'Knowledge',
  'Drug Availability',
  'Drug Administration',
  'Refusal',
  'Documentation',
  'Supervision'
];

export function getIndicatorById(id: string): IndicatorDefinition | undefined {
  return INDICATOR_DICTIONARY.find(ind => ind.id === id);
}

export function getIndicatorByCode(code: string): IndicatorDefinition | undefined {
  return INDICATOR_DICTIONARY.find(ind => ind.code.toLowerCase() === code.toLowerCase());
}
