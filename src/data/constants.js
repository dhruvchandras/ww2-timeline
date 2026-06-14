export const THEATERS = {
  WESTERN_EUROPE: 'western-europe',
  EASTERN_FRONT: 'eastern-front',
  PACIFIC: 'pacific',
  NORTH_AFRICA: 'north-africa',
  MEDITERRANEAN: 'mediterranean',
  HOME_FRONT: 'home-front',
};

export const THEATER_META = {
  'western-europe': { label: 'Western Europe', color: '#4a90d9', shortLabel: 'W. Europe' },
  'eastern-front':  { label: 'Eastern Front',  color: '#c0392b', shortLabel: 'E. Front'  },
  'pacific':        { label: 'Pacific',         color: '#27ae8f', shortLabel: 'Pacific'   },
  'north-africa':   { label: 'North Africa',    color: '#d4a017', shortLabel: 'N. Africa' },
  'mediterranean':  { label: 'Mediterranean',   color: '#7d9e5a', shortLabel: 'Mediterr.' },
  'home-front':     { label: 'Home Front / Global', color: '#9b8ea0', shortLabel: 'Global' },
};

export const CATEGORIES = {
  MILITARY:   'military',
  POLITICAL:  'political',
  NAVAL:      'naval',
  AIR:        'air',
  ATROCITY:   'atrocity',
  TECHNOLOGY: 'technology',
};

export const CATEGORY_META = {
  military:   { label: 'Military Operations', icon: '⚔️'  },
  political:  { label: 'Political / Diplomatic', icon: '🏛️' },
  naval:      { label: 'Naval',               icon: '⚓'  },
  air:        { label: 'Air Campaigns',        icon: '✈️'  },
  atrocity:   { label: 'Atrocities / Holocaust', icon: '☠️' },
  technology: { label: 'Technology / Weapons', icon: '🔬' },
};

export const SCALES = {
  STRATEGIC:   'strategic',
  OPERATIONAL: 'operational',
  TACTICAL:    'tactical',
};

export const SCALE_META = {
  strategic:   { label: 'Strategic',   description: 'War-level decisions' },
  operational: { label: 'Operational', description: 'Campaign-level'      },
  tactical:    { label: 'Tactical',    description: 'Battle-level'         },
};

export const PERSPECTIVES = {
  ALLIED:  'allied',
  AXIS:    'axis',
  NEUTRAL: 'neutral',
};

export const PHASES = [
  {
    id: 'phoney-war',
    label: 'The Phoney War',
    start: '1939-09-01',
    end: '1940-04-08',
    color: 'rgba(120,120,80,0.13)',
  },
  {
    id: 'german-expansion',
    label: 'German Expansion',
    start: '1940-04-09',
    end: '1941-06-21',
    color: 'rgba(192,57,43,0.10)',
  },
  {
    id: 'global-war',
    label: 'Global War Begins',
    start: '1941-06-22',
    end: '1942-11-07',
    color: 'rgba(74,144,217,0.10)',
  },
  {
    id: 'turning-point',
    label: 'The Turning Point',
    start: '1942-11-08',
    end: '1944-06-05',
    color: 'rgba(39,174,143,0.10)',
  },
  {
    id: 'allied-advance',
    label: 'Allied Advance',
    start: '1944-06-06',
    end: '1945-05-08',
    color: 'rgba(125,158,90,0.13)',
  },
  {
    id: 'pacific-endgame',
    label: 'Pacific Endgame',
    start: '1945-05-09',
    end: '1945-09-02',
    color: 'rgba(212,160,23,0.13)',
  },
];

export const WAR_START = new Date('1939-09-01');
export const WAR_END   = new Date('1945-09-02');
