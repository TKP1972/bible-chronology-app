
// Data is meticulously calculated from the provided chronology text.
// Death Year = Birth Year - Age at Death.
// Ordered by birth year for chronological rendering.
export const lifespanOverlapData = [
  { 
    name: 'Adam', 
    birthYearBCE: 4026, 
    deathYearBCE: 3096, 
    ageAtDeath: 930,
    events: [
      { year: 3896, description: 'Seth born' }
    ]
  },
  { name: 'Seth', birthYearBCE: 3896, deathYearBCE: 2984, ageAtDeath: 912, events: [{ year: 3791, description: 'Enosh born' }] },
  { name: 'Enosh', birthYearBCE: 3791, deathYearBCE: 2886, ageAtDeath: 905 },
  { name: 'Kenan', birthYearBCE: 3701, deathYearBCE: 2791, ageAtDeath: 910 },
  { name: 'Mahalalel', birthYearBCE: 3631, deathYearBCE: 2736, ageAtDeath: 895 },
  { name: 'Jared', birthYearBCE: 3566, deathYearBCE: 2604, ageAtDeath: 962 },
  { 
    name: 'Enoch', 
    birthYearBCE: 3404, 
    deathYearBCE: 3039, 
    ageAtDeath: 365,
    events: [
      { year: 3339, description: 'Methuselah born'},
      { year: 3039, description: 'Transferred' }
    ]
  },
  { name: 'Methuselah', birthYearBCE: 3339, deathYearBCE: 2370, ageAtDeath: 969 },
  { name: 'Lamech', birthYearBCE: 3152, deathYearBCE: 2375, ageAtDeath: 777 },
  { 
    name: 'Noah', 
    birthYearBCE: 2970, 
    deathYearBCE: 2020, 
    ageAtDeath: 950,
    events: [
      { year: 2470, description: 'Japheth born' },
      { year: 2468, description: 'Shem born' },
      { year: 2370, description: 'Flood begins' }
    ] 
  },
  { 
    name: 'Shem', 
    birthYearBCE: 2468, 
    deathYearBCE: 1868, 
    ageAtDeath: 600,
    events: [
      { year: 2368, description: 'Arpachshad born' }
    ]
  },
  { name: 'Arpachshad', birthYearBCE: 2368, deathYearBCE: 1930, ageAtDeath: 438 },
  { 
    name: 'Abraham', 
    birthYearBCE: 2018, 
    deathYearBCE: 1843, 
    ageAtDeath: 175,
    events: [
      { year: 1943, description: 'Crosses Euphrates' },
      { year: 1932, description: 'Ishmael born' },
      { year: 1918, description: 'Isaac born' }
    ]
  },
  { name: 'Sarah', birthYearBCE: 2008, deathYearBCE: 1881, ageAtDeath: 127 },
  { name: 'Ishmael', birthYearBCE: 1932, deathYearBCE: 1795, ageAtDeath: 137 },
  { 
    name: 'Isaac', 
    birthYearBCE: 1918, 
    deathYearBCE: 1738, 
    ageAtDeath: 180,
    events: [
      { year: 1878, description: 'Weds Rebekah' },
      { year: 1858, description: 'Esau & Jacob born' }
    ]
  },
  { 
    name: 'Jacob', 
    birthYearBCE: 1858, 
    deathYearBCE: 1711, 
    ageAtDeath: 147,
    events: [
        { year: 1781, description: 'Flees to Mesopotamia' },
        { year: 1767, description: 'Joseph born' },
        { year: 1761, description: 'Benjamin born' },
        { year: 1728, description: 'Moves to Egypt' }
    ]
  },
  { 
    name: 'Joseph', 
    birthYearBCE: 1767, 
    deathYearBCE: 1657, 
    ageAtDeath: 110,
    events: [
      { year: 1750, description: 'Sold into slavery' },
      { year: 1737, description: 'Becomes prime minister' }
    ]
  },
  { name: 'Aaron', birthYearBCE: 1597, deathYearBCE: 1474, ageAtDeath: 123 },
  { 
    name: 'Moses', 
    birthYearBCE: 1593, 
    deathYearBCE: 1473, 
    ageAtDeath: 120,
    events: [
      { year: 1553, description: 'Flees to Midian' },
      { year: 1513, description: 'Leads Exodus' }
    ]
  },
  { name: 'Joshua', birthYearBCE: 1560, deathYearBCE: 1450, ageAtDeath: 110 },
  { 
    name: 'David', 
    birthYearBCE: 1107, 
    deathYearBCE: 1037, 
    ageAtDeath: 70,
    events: [
      { year: 1077, description: 'King of Judah' },
      { year: 1070, description: 'King of all Israel' }
    ]
  },
];
