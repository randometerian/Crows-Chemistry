const elementStyles = {
  H: { r: 10, m: 1, color: '#8fc5ff', valenceDots: 1 },
  N: { r: 16, m: 14, color: '#7ea6ff', valenceDots: 5 },
  O: { r: 16, m: 16, color: '#f39a9a', valenceDots: 6 },
  C: { r: 15, m: 12, color: '#b8b8b8', valenceDots: 4 },
  Cl: { r: 18, m: 35.5, color: '#8ee07e', valenceDots: 7 },
  Na: { r: 19, m: 23, color: '#ffe08a', valenceDots: 1 }
};

const LIBRARY_ITEMS = [
  {
    key: 'H2',
    name: 'Hydrogen gas',
    label: 'H₂',
    formula: 'H₂',
    category: 'molecules',
    phase: 'gas',
    description: 'Light diatomic gas. Can react with oxygen when heated.',
    search: 'hydrogen h2 gas molecule'
  },
  {
    key: 'O2',
    name: 'Oxygen gas',
    label: 'O₂',
    formula: 'O₂',
    category: 'molecules',
    phase: 'gas',
    description: 'Diatomic oxygen. Supports water formation in this model.',
    search: 'oxygen o2 gas molecule'
  },
  {
    key: 'Cl2',
    name: 'Chlorine gas',
    label: 'Cl₂',
    formula: 'Cl₂',
    category: 'molecules',
    phase: 'gas',
    description: 'Reactive halogen gas. Can participate in acid and salt chemistry.',
    search: 'chlorine cl2 gas halogen'
  },
  {
    key: 'HCl',
    name: 'Hydrogen chloride',
    label: 'HCl',
    formula: 'HCl',
    category: 'molecules',
    phase: 'gas',
    description: 'Polar gas that forms from hydrogen and chlorine chemistry.',
    search: 'hydrogen chloride hcl gas acid'
  },
  {
    key: 'HOCl',
    name: 'Hypochlorous acid',
    label: 'HOCl',
    formula: 'HOCl',
    category: 'molecules',
    phase: 'liquid',
    description: 'Reactive oxychlorine acid that forms when chlorine meets water.',
    search: 'hypochlorous acid hocl oxychlorine bleach acid'
  },
  {
    key: 'HClO2',
    name: 'Chlorous acid',
    label: 'HClO₂',
    formula: 'HClO₂',
    category: 'molecules',
    phase: 'liquid',
    description: 'Intermediate oxychlorine acid in the stepwise oxidation ladder.',
    search: 'chlorous acid hclo2 oxychlorine acid'
  },
  {
    key: 'HClO3',
    name: 'Chloric acid',
    label: 'HClO₃',
    formula: 'HClO₃',
    category: 'molecules',
    phase: 'liquid',
    description: 'Strong oxychlorine acid that can oxidize further toward perchloric acid.',
    search: 'chloric acid hclo3 oxychlorine acid'
  },
  {
    key: 'HClO4',
    name: 'Perchloric acid',
    label: 'HClO₄',
    formula: 'HClO₄',
    category: 'molecules',
    phase: 'liquid',
    description: 'Highly oxidized oxychlorine acid at the end of the current chlorine ladder.',
    search: 'perchloric acid hclo4 oxychlorine acid'
  },
  {
    key: 'CO',
    name: 'Carbon monoxide',
    label: 'CO',
    formula: 'CO',
    category: 'molecules',
    phase: 'gas',
    description: 'Reactive carbon oxide gas that can oxidize further to carbon dioxide.',
    search: 'carbon monoxide co gas oxide'
  },
  {
    key: 'CO2',
    name: 'Carbon dioxide',
    label: 'CO₂',
    formula: 'CO₂',
    category: 'molecules',
    phase: 'gas',
    description: 'Linear carbon oxide gas produced by combustion and oxidation.',
    search: 'carbon dioxide co2 gas combustion'
  },
  {
    key: 'NaCl',
    name: 'Sodium chloride',
    label: 'NaCl',
    formula: 'NaCl',
    category: 'molecules',
    phase: 'particle',
    description: 'Ionic salt built from sodium and chlorine.',
    search: 'sodium chloride nacl salt ionic'
  },
  {
    key: 'NaOH',
    name: 'Sodium hydroxide',
    label: 'NaOH',
    formula: 'NaOH',
    category: 'molecules',
    phase: 'particle',
    description: 'Caustic base that neutralizes hydrogen chloride in the sandbox.',
    search: 'sodium hydroxide naoh base caustic'
  },
  {
    key: 'NaOCl',
    name: 'Sodium hypochlorite',
    label: 'NaOCl',
    formula: 'NaOCl',
    category: 'molecules',
    phase: 'liquid',
    description: 'Bleach-like oxidizer. Reacts with acetone in haloform chemistry.',
    search: 'sodium hypochlorite naocl bleach oxidizer'
  },
  {
    key: 'H2O',
    name: 'Water',
    label: 'H₂O',
    formula: 'H₂O',
    category: 'molecules',
    phase: 'liquid',
    description: 'Bent polar liquid with medium density.',
    search: 'water h2o liquid molecule'
  },
  {
    key: 'H2O2',
    name: 'Hydrogen peroxide',
    label: 'H₂O₂',
    formula: 'H₂O₂',
    category: 'molecules',
    phase: 'liquid',
    description: 'Reactive oxygen-rich liquid that can form in hot hydrogen/oxygen mixes.',
    search: 'hydrogen peroxide h2o2 oxidizer liquid'
  },
  {
    key: 'CH4',
    name: 'Methane',
    label: 'CH₄',
    formula: 'CH₄',
    category: 'molecules',
    phase: 'gas',
    description: 'Simple hydrocarbon fuel used for basic combustion chemistry.',
    search: 'methane ch4 gas combustion fuel'
  },
  {
    key: 'CH3Cl',
    name: 'Chloromethane',
    label: 'CH₃Cl',
    formula: 'CH₃Cl',
    category: 'molecules',
    phase: 'gas',
    description: 'First chlorinated methane intermediate in the halogenation chain.',
    search: 'chloromethane ch3cl methyl chloride gas halogenation'
  },
  {
    key: 'CH2Cl2',
    name: 'Dichloromethane',
    label: 'CH₂Cl₂',
    formula: 'CH₂Cl₂',
    category: 'molecules',
    phase: 'liquid',
    description: 'Dense chlorinated solvent formed by further methane chlorination.',
    search: 'dichloromethane ch2cl2 methylene chloride solvent'
  },
  {
    key: 'acetone',
    name: 'Acetone',
    label: 'Acetone',
    formula: 'C₃H₆O',
    category: 'molecules',
    phase: 'liquid',
    description: 'Light organic liquid used here for simple layering behavior.',
    search: 'acetone c3h6o liquid solvent organic'
  },
  {
    key: 'CH3OH',
    name: 'Methanol',
    label: 'CH₃OH',
    formula: 'CH₃OH',
    category: 'molecules',
    phase: 'liquid',
    description: 'Polar alcohol solvent that can oxidize into formaldehyde.',
    search: 'methanol ch3oh alcohol solvent oxidation'
  },
  {
    key: 'CH2O',
    name: 'Formaldehyde',
    label: 'CH₂O',
    formula: 'CH₂O',
    category: 'molecules',
    phase: 'gas',
    description: 'Reactive carbonyl intermediate from methanol oxidation.',
    search: 'formaldehyde ch2o methanal oxidation intermediate'
  },
  {
    key: 'HCOOH',
    name: 'Formic acid',
    label: 'HCOOH',
    formula: 'HCOOH',
    category: 'molecules',
    phase: 'liquid',
    description: 'Simple carboxylic acid formed by oxidizing formaldehyde.',
    search: 'formic acid hcooh methanoic acid'
  },
  {
    key: 'CH3CHO',
    name: 'Acetaldehyde',
    label: 'CH₃CHO',
    formula: 'CH₃CHO',
    category: 'molecules',
    phase: 'liquid',
    description: 'Simple aldehyde staged for later oxidation chemistry.',
    search: 'acetaldehyde ch3cho ethanal aldehyde'
  },
  {
    key: 'CH3COOH',
    name: 'Acetic acid',
    label: 'CH₃COOH',
    formula: 'CH₃COOH',
    category: 'molecules',
    phase: 'liquid',
    description: 'Weak acid staged for later acetate and oxidation chemistry.',
    search: 'acetic acid ch3cooh ethanoic acid vinegar'
  },
  {
    key: 'CHCl3',
    name: 'Chloroform',
    label: 'CHCl₃',
    formula: 'CHCl₃',
    category: 'molecules',
    phase: 'liquid',
    description: 'Haloform product from bleach-acetone chemistry in this model.',
    search: 'chloroform chcl3 haloform'
  },
  {
    key: 'CCl4',
    name: 'Carbon tetrachloride',
    label: 'CCl₄',
    formula: 'CCl₄',
    category: 'molecules',
    phase: 'liquid',
    description: 'Heavy nonpolar chlorinated solvent at the end of the methane chlorination chain.',
    search: 'carbon tetrachloride ccl4 chlorinated solvent'
  },
  {
    key: 'O3',
    name: 'Ozone',
    label: 'O₃',
    formula: 'O₃',
    category: 'molecules',
    phase: 'gas',
    description: 'Reactive triatomic oxygen species built from oxygen radicals.',
    search: 'ozone o3 gas oxidizer'
  },
  {
    key: 'NaHCO3',
    name: 'Sodium bicarbonate',
    label: 'NaHCO₃',
    formula: 'NaHCO₃',
    category: 'molecules',
    phase: 'particle',
    description: 'Bicarbonate salt that can release carbon dioxide on heating.',
    search: 'sodium bicarbonate nahco3 baking soda salt'
  },
  {
    key: 'Na2CO3',
    name: 'Sodium carbonate',
    label: 'Na₂CO₃',
    formula: 'Na₂CO₃',
    category: 'molecules',
    phase: 'particle',
    description: 'Basic carbonate salt formed from stronger carbon dioxide capture.',
    search: 'sodium carbonate na2co3 washing soda salt'
  },
  {
    key: 'NaC2H3O2',
    name: 'Sodium acetate',
    label: 'NaC₂H₃O₂',
    formula: 'NaC₂H₃O₂',
    category: 'molecules',
    phase: 'particle',
    description: 'Salt byproduct in simplified haloform pathway.',
    search: 'sodium acetate nac2h3o2 acetate salt'
  },
  {
    key: 'atom-H',
    name: 'Hydrogen atom',
    label: 'H',
    formula: 'H',
    category: 'atoms',
    phase: 'particle',
    description: 'Single hydrogen atom. Mostly a visual particle here.',
    search: 'hydrogen atom h'
  },
  {
    key: 'atom-N',
    name: 'Nitrogen atom',
    label: 'N',
    formula: 'N',
    category: 'atoms',
    phase: 'particle',
    description: 'Single nitrogen atom reserved for future nitrogen chemistry.',
    search: 'nitrogen atom n'
  },
  {
    key: 'atom-O',
    name: 'Oxygen atom',
    label: 'O',
    formula: 'O',
    category: 'atoms',
    phase: 'particle',
    description: 'Single oxygen atom. Mostly a visual particle here.',
    search: 'oxygen atom o'
  },
  {
    key: 'atom-C',
    name: 'Carbon atom',
    label: 'C',
    formula: 'C',
    category: 'atoms',
    phase: 'particle',
    description: 'Single carbon atom. Mostly a visual particle here.',
    search: 'carbon atom c'
  },
  {
    key: 'atom-Cl',
    name: 'Chlorine atom',
    label: 'Cl',
    formula: 'Cl',
    category: 'atoms',
    phase: 'particle',
    description: 'Single chlorine atom. Mostly a visual particle here.',
    search: 'chlorine atom cl'
  },
  {
    key: 'atom-Na',
    name: 'Sodium atom',
    label: 'Na',
    formula: 'Na',
    category: 'atoms',
    phase: 'particle',
    description: 'Reactive alkali atom that readily forms ionic bonds.',
    search: 'sodium atom na metal'
  }
];

const SPECIES = {
  H2: {
    key: 'H2',
    label: 'H₂',
    display: 'Hydrogen gas',
    phase: 'gas',
    density: 0.09,
    miscibleGroup: 'gas',
    atomEls: ['H', 'H'],
    bonds: [{ a: 0, b: 1, order: 1, rest: 30 }],
    color: '#8fc5ff',
    formula: 'H₂'
  },
  Cl2: {
    key: 'Cl2',
    label: 'Cl₂',
    display: 'Chlorine gas',
    phase: 'gas',
    density: 3.2,
    miscibleGroup: 'gas',
    atomEls: ['Cl', 'Cl'],
    bonds: [{ a: 0, b: 1, order: 1, rest: 34 }],
    color: '#8ee07e',
    formula: 'Cl₂'
  },
  HCl: {
    key: 'HCl',
    label: 'HCl',
    display: 'Hydrogen chloride',
    phase: 'gas',
    density: 1.49,
    miscibleGroup: 'gas',
    atomEls: ['H', 'Cl'],
    bonds: [{ a: 0, b: 1, order: 1, rest: 31 }],
    color: '#a9e9b0',
    formula: 'HCl'
  },
  HOCl: {
    key: 'HOCl',
    label: 'HOCl',
    display: 'Hypochlorous acid',
    phase: 'liquid',
    density: 1.17,
    miscibleGroup: 'water',
    atomEls: ['H', 'O', 'Cl'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 1, b: 2, order: 1, rest: 31 }
    ],
    angleConstraints: [{ center: 1, a: 0, b: 2, angle: 103 * Math.PI / 180 }],
    color: '#bcefa3',
    formula: 'HOCl'
  },
  HClO2: {
    key: 'HClO2',
    label: 'HClO₂',
    display: 'Chlorous acid',
    phase: 'liquid',
    density: 1.28,
    miscibleGroup: 'water',
    atomEls: ['H', 'O', 'Cl', 'O'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 1, b: 2, order: 1, rest: 31 },
      { a: 2, b: 3, order: 2, rest: 31 }
    ],
    angleConstraints: [
      { center: 1, a: 0, b: 2, angle: 104 * Math.PI / 180 },
      { center: 2, a: 1, b: 3, angle: 108 * Math.PI / 180 }
    ],
    color: '#b0e39a',
    formula: 'HClO₂'
  },
  HClO3: {
    key: 'HClO3',
    label: 'HClO₃',
    display: 'Chloric acid',
    phase: 'liquid',
    density: 1.36,
    miscibleGroup: 'water',
    atomEls: ['H', 'O', 'Cl', 'O', 'O'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 1, b: 2, order: 1, rest: 31 },
      { a: 2, b: 3, order: 2, rest: 31 },
      { a: 2, b: 4, order: 2, rest: 31 }
    ],
    angleConstraints: [
      { center: 1, a: 0, b: 2, angle: 104 * Math.PI / 180 },
      { center: 2, a: 1, b: 3, angle: 106 * Math.PI / 180 },
      { center: 2, a: 1, b: 4, angle: 106 * Math.PI / 180 },
      { center: 2, a: 3, b: 4, angle: 112 * Math.PI / 180 }
    ],
    color: '#a6d88f',
    formula: 'HClO₃'
  },
  HClO4: {
    key: 'HClO4',
    label: 'HClO₄',
    display: 'Perchloric acid',
    phase: 'liquid',
    density: 1.67,
    miscibleGroup: 'water',
    atomEls: ['H', 'O', 'Cl', 'O', 'O', 'O'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 1, b: 2, order: 1, rest: 31 },
      { a: 2, b: 3, order: 2, rest: 31 },
      { a: 2, b: 4, order: 2, rest: 31 },
      { a: 2, b: 5, order: 2, rest: 31 }
    ],
    angleConstraints: [
      { center: 1, a: 0, b: 2, angle: 104 * Math.PI / 180 },
      { center: 2, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 2, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 2, a: 1, b: 5, angle: 109.5 * Math.PI / 180 },
      { center: 2, a: 3, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 2, a: 3, b: 5, angle: 109.5 * Math.PI / 180 },
      { center: 2, a: 4, b: 5, angle: 109.5 * Math.PI / 180 }
    ],
    color: '#9dcd87',
    formula: 'HClO₄'
  },
  CO: {
    key: 'CO',
    label: 'CO',
    display: 'Carbon monoxide',
    phase: 'gas',
    density: 1.25,
    miscibleGroup: 'gas',
    atomEls: ['C', 'O'],
    bonds: [{ a: 0, b: 1, order: 2, rest: 29 }],
    color: '#c2b6b0',
    formula: 'CO'
  },
  CO2: {
    key: 'CO2',
    label: 'CO₂',
    display: 'Carbon dioxide',
    phase: 'gas',
    density: 1.98,
    miscibleGroup: 'gas',
    atomEls: ['O', 'C', 'O'],
    bonds: [
      { a: 0, b: 1, order: 2, rest: 29 },
      { a: 1, b: 2, order: 2, rest: 29 }
    ],
    angleConstraints: [{ center: 1, a: 0, b: 2, angle: Math.PI }],
    color: '#c9c3be',
    formula: 'CO₂'
  },
  NaCl: {
    key: 'NaCl',
    label: 'NaCl',
    display: 'Sodium chloride',
    phase: 'particle',
    density: 2.16,
    miscibleGroup: 'salt',
    atomEls: ['Na', 'Cl'],
    bonds: [{ a: 0, b: 1, order: 1, rest: 33, ionic: true }],
    color: '#c9e8a7',
    formula: 'NaCl'
  },
  NaOH: {
    key: 'NaOH',
    label: 'NaOH',
    display: 'Sodium hydroxide',
    phase: 'particle',
    density: 2.13,
    miscibleGroup: 'salt',
    atomEls: ['Na', 'O', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 32, ionic: true },
      { a: 1, b: 2, order: 1, rest: 28 }
    ],
    angleConstraints: [{ center: 1, a: 0, b: 2, angle: Math.PI }],
    color: '#d5e8b1',
    formula: 'NaOH'
  },
  NaOCl: {
    key: 'NaOCl',
    label: 'NaOCl',
    display: 'Sodium hypochlorite',
    phase: 'liquid',
    density: 1.11,
    miscibleGroup: 'water',
    atomEls: ['Na', 'O', 'Cl'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 32, ionic: true },
      { a: 1, b: 2, order: 1, rest: 31 }
    ],
    angleConstraints: [{ center: 1, a: 0, b: 2, angle: 112 * Math.PI / 180 }],
    color: '#c6f1a8',
    formula: 'NaOCl'
  },
  O2: {
    key: 'O2',
    label: 'O₂',
    display: 'Oxygen gas',
    phase: 'gas',
    density: 1.43,
    miscibleGroup: 'gas',
    atomEls: ['O', 'O'],
    bonds: [{ a: 0, b: 1, order: 2, rest: 34 }],
    color: '#f39a9a',
    formula: 'O₂'
  },
  H2O: {
    key: 'H2O',
    label: 'H₂O',
    display: 'Water',
    phase: 'liquid',
    density: 1.0,
    miscibleGroup: 'water',
    atomEls: ['O', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 1, rest: 28 }, { a: 0, b: 2, order: 1, rest: 28 }],
    angleConstraints: [{ center: 0, a: 1, b: 2, angle: 104.5 * Math.PI / 180 }],
    color: '#6fc3ff',
    formula: 'H₂O'
  },
  H2O2: {
    key: 'H2O2',
    label: 'H₂O₂',
    display: 'Hydrogen peroxide',
    phase: 'liquid',
    density: 1.45,
    miscibleGroup: 'water',
    atomEls: ['H', 'O', 'O', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 27 },
      { a: 1, b: 2, order: 1, rest: 28 },
      { a: 2, b: 3, order: 1, rest: 27 }
    ],
    angleConstraints: [
      { center: 1, a: 0, b: 2, angle: 96 * Math.PI / 180 },
      { center: 2, a: 1, b: 3, angle: 96 * Math.PI / 180 }
    ],
    color: '#a5d7ff',
    formula: 'H₂O₂'
  },
  CH4: {
    key: 'CH4',
    label: 'CH₄',
    display: 'Methane',
    phase: 'gas',
    density: 0.66,
    miscibleGroup: 'gas',
    atomEls: ['C', 'H', 'H', 'H', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 28 },
      { a: 0, b: 3, order: 1, rest: 28 },
      { a: 0, b: 4, order: 1, rest: 28 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 }
    ],
    color: '#9cc4ff',
    formula: 'CH₄'
  },
  CH3Cl: {
    key: 'CH3Cl',
    label: 'CH₃Cl',
    display: 'Chloromethane',
    phase: 'gas',
    density: 2.3,
    miscibleGroup: 'gas',
    atomEls: ['C', 'H', 'H', 'H', 'Cl'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 28 },
      { a: 0, b: 3, order: 1, rest: 28 },
      { a: 0, b: 4, order: 1, rest: 31 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 }
    ],
    color: '#9fe0b4',
    formula: 'CH₃Cl'
  },
  CH2Cl2: {
    key: 'CH2Cl2',
    label: 'CH₂Cl₂',
    display: 'Dichloromethane',
    phase: 'liquid',
    density: 1.33,
    miscibleGroup: 'organic-heavy',
    atomEls: ['C', 'H', 'H', 'Cl', 'Cl'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 28 },
      { a: 0, b: 3, order: 1, rest: 31 },
      { a: 0, b: 4, order: 1, rest: 31 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 }
    ],
    color: '#8fd3bd',
    formula: 'CH₂Cl₂'
  },
  acetone: {
    key: 'acetone',
    label: 'Acetone',
    display: 'Acetone',
    phase: 'liquid',
    density: 0.79,
    miscibleGroup: 'organic-light',
    atomEls: ['C','C','C','O','H','H','H','H','H','H'],
    bonds: [
      { a:0, b:1, order:1, rest:26 },
      { a:1, b:2, order:1, rest:26 },
      { a:1, b:3, order:2, rest:28 },
      { a:0, b:4, order:1, rest:28 },
      { a:0, b:5, order:1, rest:28 },
      { a:0, b:6, order:1, rest:28 },
      { a:2, b:7, order:1, rest:28 },
      { a:2, b:8, order:1, rest:28 },
      { a:2, b:9, order:1, rest:28 }
    ],
    color: '#d9a7ff',
    formula: 'C₃H₆O'
  },
  CH3OH: {
    key: 'CH3OH',
    label: 'CH₃OH',
    display: 'Methanol',
    phase: 'liquid',
    density: 0.79,
    miscibleGroup: 'water',
    atomEls: ['C', 'H', 'H', 'H', 'O', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 28 },
      { a: 0, b: 3, order: 1, rest: 28 },
      { a: 0, b: 4, order: 1, rest: 29 },
      { a: 4, b: 5, order: 1, rest: 28 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 4, a: 0, b: 5, angle: 104.5 * Math.PI / 180 }
    ],
    color: '#8ec3ff',
    formula: 'CH₃OH'
  },
  CH2O: {
    key: 'CH2O',
    label: 'CH₂O',
    display: 'Formaldehyde',
    phase: 'gas',
    density: 1.09,
    miscibleGroup: 'gas',
    atomEls: ['C', 'H', 'H', 'O'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 28 },
      { a: 0, b: 3, order: 2, rest: 29 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 116 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 122 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 122 * Math.PI / 180 }
    ],
    color: '#d4c3be',
    formula: 'CH₂O'
  },
  HCOOH: {
    key: 'HCOOH',
    label: 'HCOOH',
    display: 'Formic acid',
    phase: 'liquid',
    density: 1.22,
    miscibleGroup: 'water',
    atomEls: ['H', 'C', 'O', 'O', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 1, b: 2, order: 2, rest: 29 },
      { a: 1, b: 3, order: 1, rest: 29 },
      { a: 3, b: 4, order: 1, rest: 28 }
    ],
    angleConstraints: [
      { center: 1, a: 0, b: 2, angle: 122 * Math.PI / 180 },
      { center: 1, a: 0, b: 3, angle: 116 * Math.PI / 180 },
      { center: 1, a: 2, b: 3, angle: 122 * Math.PI / 180 },
      { center: 3, a: 1, b: 4, angle: 104.5 * Math.PI / 180 }
    ],
    color: '#9cd2ff',
    formula: 'HCOOH'
  },
  CH3CHO: {
    key: 'CH3CHO',
    label: 'CH₃CHO',
    display: 'Acetaldehyde',
    phase: 'liquid',
    density: 0.78,
    miscibleGroup: 'organic-light',
    atomEls: ['C', 'H', 'H', 'H', 'C', 'H', 'O'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 28 },
      { a: 0, b: 3, order: 1, rest: 28 },
      { a: 0, b: 4, order: 1, rest: 28 },
      { a: 4, b: 5, order: 1, rest: 28 },
      { a: 4, b: 6, order: 2, rest: 29 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 4, a: 0, b: 5, angle: 116 * Math.PI / 180 },
      { center: 4, a: 0, b: 6, angle: 122 * Math.PI / 180 },
      { center: 4, a: 5, b: 6, angle: 122 * Math.PI / 180 }
    ],
    color: '#d1b4a7',
    formula: 'CH₃CHO'
  },
  CH3COOH: {
    key: 'CH3COOH',
    label: 'CH₃COOH',
    display: 'Acetic acid',
    phase: 'liquid',
    density: 1.05,
    miscibleGroup: 'water',
    atomEls: ['C', 'H', 'H', 'H', 'C', 'O', 'O', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 28 },
      { a: 0, b: 3, order: 1, rest: 28 },
      { a: 0, b: 4, order: 1, rest: 28 },
      { a: 4, b: 5, order: 2, rest: 29 },
      { a: 4, b: 6, order: 1, rest: 29 },
      { a: 6, b: 7, order: 1, rest: 28 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 4, a: 0, b: 5, angle: 122 * Math.PI / 180 },
      { center: 4, a: 0, b: 6, angle: 116 * Math.PI / 180 },
      { center: 4, a: 5, b: 6, angle: 122 * Math.PI / 180 },
      { center: 6, a: 4, b: 7, angle: 104.5 * Math.PI / 180 }
    ],
    color: '#a7c6ff',
    formula: 'CH₃COOH'
  },
  CHCl3: {
    key: 'CHCl3',
    label: 'CHCl₃',
    display: 'Chloroform',
    phase: 'liquid',
    density: 1.49,
    miscibleGroup: 'organic-heavy',
    atomEls: ['C', 'H', 'Cl', 'Cl', 'Cl'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 28 },
      { a: 0, b: 2, order: 1, rest: 31 },
      { a: 0, b: 3, order: 1, rest: 31 },
      { a: 0, b: 4, order: 1, rest: 31 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 }
    ],
    color: '#9fdba5',
    formula: 'CHCl₃'
  },
  CCl4: {
    key: 'CCl4',
    label: 'CCl₄',
    display: 'Carbon tetrachloride',
    phase: 'liquid',
    density: 1.59,
    miscibleGroup: 'organic-heavy',
    atomEls: ['C', 'Cl', 'Cl', 'Cl', 'Cl'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 31 },
      { a: 0, b: 2, order: 1, rest: 31 },
      { a: 0, b: 3, order: 1, rest: 31 },
      { a: 0, b: 4, order: 1, rest: 31 }
    ],
    angleConstraints: [
      { center: 0, a: 1, b: 2, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 1, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 3, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 2, b: 4, angle: 109.5 * Math.PI / 180 },
      { center: 0, a: 3, b: 4, angle: 109.5 * Math.PI / 180 }
    ],
    color: '#8cbf92',
    formula: 'CCl₄'
  },
  O3: {
    key: 'O3',
    label: 'O₃',
    display: 'Ozone',
    phase: 'gas',
    density: 2.14,
    miscibleGroup: 'gas',
    atomEls: ['O', 'O', 'O'],
    bonds: [
      { a: 0, b: 1, order: 1, rest: 30 },
      { a: 1, b: 2, order: 2, rest: 30 }
    ],
    angleConstraints: [{ center: 1, a: 0, b: 2, angle: 117 * Math.PI / 180 }],
    color: '#ffb0b0',
    formula: 'O₃'
  },
  NaHCO3: {
    key: 'NaHCO3',
    label: 'NaHCO₃',
    display: 'Sodium bicarbonate',
    phase: 'particle',
    density: 2.2,
    miscibleGroup: 'salt',
    atomEls: ['Na', 'H', 'C', 'O', 'O', 'O'],
    bonds: [
      { a: 0, b: 3, order: 1, rest: 33, ionic: true },
      { a: 2, b: 3, order: 2, rest: 29 },
      { a: 2, b: 4, order: 1, rest: 29 },
      { a: 2, b: 5, order: 1, rest: 29 },
      { a: 5, b: 1, order: 1, rest: 28 }
    ],
    angleConstraints: [
      { center: 2, a: 3, b: 4, angle: 120 * Math.PI / 180 },
      { center: 2, a: 3, b: 5, angle: 120 * Math.PI / 180 },
      { center: 2, a: 4, b: 5, angle: 120 * Math.PI / 180 },
      { center: 5, a: 2, b: 1, angle: 104.5 * Math.PI / 180 }
    ],
    color: '#c8dfb5',
    formula: 'NaHCO₃'
  },
  Na2CO3: {
    key: 'Na2CO3',
    label: 'Na₂CO₃',
    display: 'Sodium carbonate',
    phase: 'particle',
    density: 2.54,
    miscibleGroup: 'salt',
    atomEls: ['Na', 'Na', 'C', 'O', 'O', 'O'],
    bonds: [
      { a: 0, b: 3, order: 1, rest: 33, ionic: true },
      { a: 1, b: 4, order: 1, rest: 33, ionic: true },
      { a: 2, b: 3, order: 2, rest: 29 },
      { a: 2, b: 4, order: 1, rest: 29 },
      { a: 2, b: 5, order: 1, rest: 29 }
    ],
    angleConstraints: [
      { center: 2, a: 3, b: 4, angle: 120 * Math.PI / 180 },
      { center: 2, a: 3, b: 5, angle: 120 * Math.PI / 180 },
      { center: 2, a: 4, b: 5, angle: 120 * Math.PI / 180 }
    ],
    color: '#bed8a8',
    formula: 'Na₂CO₃'
  },
  NaC2H3O2: {
    key: 'NaC2H3O2',
    label: 'NaC₂H₃O₂',
    display: 'Sodium acetate',
    phase: 'particle',
    density: 1.53,
    miscibleGroup: 'salt',
    atomEls: ['Na', 'C', 'C', 'O', 'O', 'H', 'H', 'H'],
    bonds: [
      { a: 0, b: 3, order: 1, rest: 33, ionic: true },
      { a: 1, b: 2, order: 1, rest: 28 },
      { a: 1, b: 3, order: 2, rest: 28 },
      { a: 1, b: 4, order: 1, rest: 29 },
      { a: 2, b: 5, order: 1, rest: 28 },
      { a: 2, b: 6, order: 1, rest: 28 },
      { a: 2, b: 7, order: 1, rest: 28 }
    ],
    color: '#c7d5a7',
    formula: 'NaC₂H₃O₂'
  }
};

let nextMolId = 1;
let nextAtomId = 1;


const TARGET_VALENCE = { H: 1, N: 3, O: 2, C: 4, Cl: 1, Na: 1 };
const VALENCE_ELECTRONS = { H: 1, N: 5, O: 6, C: 4, Cl: 7, Na: 1 };
const SHELL_TARGET_ELECTRONS = { H: 2, N: 8, O: 8, C: 8, Cl: 8, Na: 0 };
const ELECTRONEGATIVITY = { H: 2.20, N: 3.04, O: 3.44, C: 2.55, Cl: 3.16, Na: 0.93 };
const SUBSCRIPT = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const NAMED_FORMULAS = {
  H2: 'Hydrogen gas',
  O2: 'Oxygen gas',
  Cl2: 'Chlorine gas',
  CO: 'Carbon monoxide',
  CO2: 'Carbon dioxide',
  H2O: 'Water',
  H2O2: 'Hydrogen peroxide',
  HCl: 'Hydrogen chloride',
  HOCl: 'Hypochlorous acid',
  HClO2: 'Chlorous acid',
  HClO3: 'Chloric acid',
  HClO4: 'Perchloric acid',
  CH4: 'Methane',
  CH3Cl: 'Chloromethane',
  CH2Cl2: 'Dichloromethane',
  CH3OH: 'Methanol',
  CH2O: 'Formaldehyde',
  HCOOH: 'Formic acid',
  CH3CHO: 'Acetaldehyde',
  CH3COOH: 'Acetic acid',
  NaCl: 'Sodium chloride',
  NaOH: 'Sodium hydroxide',
  NaOCl: 'Sodium hypochlorite',
  O3: 'Ozone',
  CHCl3: 'Chloroform',
  CCl4: 'Carbon tetrachloride',
  NaHCO3: 'Sodium bicarbonate',
  Na2CO3: 'Sodium carbonate',
  NaC2H3O2: 'Sodium acetate'
};
const FORMULA_META = {
  H2: { phase: 'gas', density: 0.09, miscibleGroup: 'gas', color: '#8fc5ff' },
  O2: { phase: 'gas', density: 1.43, miscibleGroup: 'gas', color: '#f39a9a' },
  Cl2: { phase: 'gas', density: 3.2, miscibleGroup: 'gas', color: '#8ee07e' },
  CO: { phase: 'gas', density: 1.25, miscibleGroup: 'gas', color: '#c2b6b0' },
  CO2: { phase: 'gas', density: 1.98, miscibleGroup: 'gas', color: '#c9c3be' },
  HCl: { phase: 'gas', density: 1.49, miscibleGroup: 'gas', color: '#a9e9b0' },
  HOCl: { phase: 'liquid', density: 1.17, miscibleGroup: 'water', color: '#bcefa3' },
  HClO2: { phase: 'liquid', density: 1.28, miscibleGroup: 'water', color: '#b0e39a' },
  HClO3: { phase: 'liquid', density: 1.36, miscibleGroup: 'water', color: '#a6d88f' },
  HClO4: { phase: 'liquid', density: 1.67, miscibleGroup: 'water', color: '#9dcd87' },
  H2O: { phase: 'liquid', density: 1.0, miscibleGroup: 'water', color: '#6fc3ff' },
  H2O2: { phase: 'liquid', density: 1.45, miscibleGroup: 'water', color: '#a5d7ff' },
  CH4: { phase: 'gas', density: 0.66, miscibleGroup: 'gas', color: '#9cc4ff' },
  CH3Cl: { phase: 'gas', density: 2.3, miscibleGroup: 'gas', color: '#9fe0b4' },
  CH2Cl2: { phase: 'liquid', density: 1.33, miscibleGroup: 'organic-heavy', color: '#8fd3bd' },
  CH3OH: { phase: 'liquid', density: 0.79, miscibleGroup: 'water', color: '#8ec3ff' },
  CH2O: { phase: 'gas', density: 1.09, miscibleGroup: 'gas', color: '#d4c3be' },
  HCOOH: { phase: 'liquid', density: 1.22, miscibleGroup: 'water', color: '#9cd2ff' },
  CH3CHO: { phase: 'liquid', density: 0.78, miscibleGroup: 'organic-light', color: '#d1b4a7' },
  CH3COOH: { phase: 'liquid', density: 1.05, miscibleGroup: 'water', color: '#a7c6ff' },
  NaCl: { phase: 'particle', density: 2.16, miscibleGroup: 'salt', color: '#c9e8a7' },
  NaOH: { phase: 'particle', density: 2.13, miscibleGroup: 'salt', color: '#d5e8b1' },
  NaOCl: { phase: 'liquid', density: 1.11, miscibleGroup: 'water', color: '#c6f1a8' },
  O3: { phase: 'gas', density: 2.14, miscibleGroup: 'gas', color: '#ffb0b0' },
  CHCl3: { phase: 'liquid', density: 1.49, miscibleGroup: 'organic-heavy', color: '#9fdba5' },
  CCl4: { phase: 'liquid', density: 1.59, miscibleGroup: 'organic-heavy', color: '#8cbf92' },
  NaHCO3: { phase: 'particle', density: 2.2, miscibleGroup: 'salt', color: '#c8dfb5' },
  Na2CO3: { phase: 'particle', density: 2.54, miscibleGroup: 'salt', color: '#bed8a8' },
  NaC2H3O2: { phase: 'particle', density: 1.53, miscibleGroup: 'salt', color: '#c7d5a7' }
};
const BOND_REST = {
  'H-H': 30,
  'H-O': 28,
  'O-O': 31,
  'H-Cl': 31,
  'Cl-Cl': 34,
  'Na-Cl': 33,
  'Na-O': 32,
  'O-Cl': 31,
  'C-H': 30,
  'C-O': 29,
  'C-C': 29,
  'C-Cl': 31,
  'Na-C': 33,
  'N-H': 28,
  'N-O': 30
};
const BOND_STABILITY = {
  'H-H': 0.72,
  'H-O': 0.80,
  'O-O': 0.62,
  'H-Cl': 0.70,
  'Cl-Cl': 0.52,
  'Na-Cl': 0.76,
  'Na-O': 0.70,
  'O-Cl': 0.66,
  'C-H': 0.88,
  'C-O': 0.86,
  'C-C': 0.84,
  'C-Cl': 0.76,
  'Na-C': 0.62
};
const FORMATION_EA_K = {
  'H-H': 760,
  'H-O': 980,
  'O-O': 1300,
  'H-Cl': 1000,
  'Cl-Cl': 900,
  'Na-Cl': 450,
  'Na-O': 520,
  'O-Cl': 620,
  'C-H': 1600,
  'C-O': 1700,
  'C-C': 1800,
  'C-Cl': 1120,
  'Na-C': 1100
};
const SPEED_PRESET = [0.5, 1, 2, 4, 8];
const MAX_REACTION_LOG = 1200;
const THERMAL_EVENT_TTL = 1.6;
const EVAPORATION_CONFIG = {
  H2O: { boilC: 100, condenseC: 92, gasDensity: 0.06, gasMiscibleGroup: 'gas', liquidDensity: 1.0, liquidMiscibleGroup: 'water', evapRate: 0.08, coolDeltaC: -10 },
  H2O2: { boilC: 150, condenseC: 138, gasDensity: 0.08, gasMiscibleGroup: 'gas', liquidDensity: 1.45, liquidMiscibleGroup: 'water', evapRate: 0.05, coolDeltaC: -12 },
  acetone: { boilC: 56, condenseC: 46, gasDensity: 0.18, gasMiscibleGroup: 'gas', liquidDensity: 0.79, liquidMiscibleGroup: 'organic-light', evapRate: 0.14, coolDeltaC: -9 },
  CHCl3: { boilC: 61, condenseC: 52, gasDensity: 0.28, gasMiscibleGroup: 'gas', liquidDensity: 1.49, liquidMiscibleGroup: 'organic-heavy', evapRate: 0.10, coolDeltaC: -8 }
};
const AQUEOUS_ION_PROFILES = {
  HCl: { ions: { 'H3O+': 1, 'Cl-': 1 }, strength: 'strong-acid' },
  HClO3: { ions: { 'H3O+': 1, 'ClO3-': 1 }, strength: 'strong-acid' },
  HClO4: { ions: { 'H3O+': 1, 'ClO4-': 1 }, strength: 'strong-acid' },
  NaOH: { ions: { 'Na+': 1, 'OH-': 1 }, strength: 'strong-base' },
  NaCl: { ions: { 'Na+': 1, 'Cl-': 1 }, strength: 'strong-electrolyte' },
  NaHCO3: { ions: { 'Na+': 1, 'HCO3-': 1 }, strength: 'buffer' },
  Na2CO3: { ions: { 'Na+': 2, 'CO3^2-': 1 }, strength: 'basic-salt' },
  NaOCl: { ions: { 'Na+': 1, 'OCl-': 1 }, strength: 'basic-salt' },
  NaC2H3O2: { ions: { 'Na+': 1, 'CH3COO-': 1 }, strength: 'basic-salt' }
};
const WEAK_AQUEOUS_ACIDS = {
  HOCl: { acidUnits: 0.18, ionLabel: 'OCl-' },
  HClO2: { acidUnits: 0.42, ionLabel: 'ClO2-' },
  HCOOH: { acidUnits: 0.34, ionLabel: 'HCOO-' },
  CH3COOH: { acidUnits: 0.16, ionLabel: 'CH3COO-' },
  CO2: { acidUnits: 0.12, note: 'carbonic-acid equivalent' }
};
const DISSOLUTION_CONFIG = {
  CO2: { solventGroup: 'water', dissolvedDensity: 1.01, nearRadius: 135, requiredNeighbors: 4, dissolveRate: 0.09, precipitateRate: 0.04 },
  HCl: { solventGroup: 'water', dissolvedDensity: 1.02, nearRadius: 150, requiredNeighbors: 3, dissolveRate: 0.22, precipitateRate: 0.01, sourcePhases: ['gas'] },
  NaCl: { solventGroup: 'water', dissolvedDensity: 1.05, nearRadius: 120, requiredNeighbors: 3, dissolveRate: 0.08, precipitateRate: 0.02 },
  NaOH: { solventGroup: 'water', dissolvedDensity: 1.08, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.12, precipitateRate: 0.03 },
  NaHCO3: { solventGroup: 'water', dissolvedDensity: 1.06, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.08, precipitateRate: 0.025 },
  Na2CO3: { solventGroup: 'water', dissolvedDensity: 1.09, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.08, precipitateRate: 0.025 },
  NaC2H3O2: { solventGroup: 'water', dissolvedDensity: 1.04, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.07, precipitateRate: 0.025 }
};
const FALLBACK_REACTION_DATA = {
  speciesHints: {
    CO: 'Scripted carbon monoxide intermediate.',
    CO2: 'Scripted carbon dioxide combustion product.',
    NaOH: 'Scripted sodium hydroxide base.',
    NaOCl: 'Scripted bleach reagent for the haloform pathway.',
    CH4: 'Scripted methane fuel.',
    O3: 'Scripted ozone radical product.',
    acetone: 'Scripted organic reagent for the haloform pathway.',
    CHCl3: 'Scripted haloform product.',
    H2: 'Participates in scripted oxidation and halogenation rules.',
    O2: 'Participates in scripted oxidation and peroxide rules.',
    H2O2: 'Can form and decompose in scripted thermal rules.',
    Cl2: 'Participates in scripted hydrogen chlorination.',
    HCl: 'Scripted hydrogen chloride product.',
    HOCl: 'Reactive oxychlorine acid formed from chlorine and water.',
    HClO2: 'Intermediate oxychlorine acid in the oxidation ladder.',
    HClO3: 'Strong oxychlorine acid in the higher oxidation states.',
    HClO4: 'Most oxidized oxychlorine acid in the current rule set.',
    CH3CHO: 'Aldehyde intermediate that can oxidize to acetic acid.',
    CH3COOH: 'Weak acid product from acetaldehyde oxidation.',
    'atom-C': 'Scripted carbon oxidation feedstock.',
    'atom-N': 'Reserved for future nitrogen chemistry.'
  },
  reactions: [
    {
      id: 'carbon_monoxide_formation',
      name: 'Carbon Monoxide Formation',
      reactants: [{ type: 'atom-C', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'CO', count: 1 }],
      conditions: { tempMinC: 20, tempMaxC: 2200, proximity: 90 },
      kinetics: { progressPerSecond: 1.0, contactThreshold: 0.55, decayPerSecond: 1.6, drift: 0.03 },
      thermalDeltaC: 28,
      displayEquation: 'C + O -> CO',
      note: 'Simplified atomic oxidation step.'
    },
    {
      id: 'carbon_dioxide_formation',
      name: 'Carbon Dioxide Formation',
      reactants: [{ type: 'CO', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'CO2', count: 1 }],
      conditions: { tempMinC: 30, tempMaxC: 2400, proximity: 110 },
      kinetics: { progressPerSecond: 0.95, contactThreshold: 0.7, decayPerSecond: 1.4, drift: 0.03 },
      thermalDeltaC: 44,
      displayEquation: 'CO + O -> CO2',
      note: 'Further oxidation of carbon monoxide.'
    },
    {
      id: 'haloform_bleach_acetone',
      name: 'Haloform Chlorination',
      reactants: [{ type: 'acetone', count: 1 }, { type: 'NaOCl', count: 3 }],
      products: [{ type: 'CHCl3', count: 1 }, { type: 'NaC2H3O2', count: 1 }, { type: 'NaCl', count: 2 }, { type: 'H2O', count: 1 }],
      conditions: { tempMinC: 8, tempMaxC: 70, proximity: 210, phase: 'liquid' },
      kinetics: { progressPerSecond: 0.9, contactThreshold: 1.2, decayPerSecond: 0.6, drift: 0.06 },
      thermalDeltaC: 18,
      displayEquation: 'acetone + 3 NaOCl -> CHCl3 + NaC2H3O2 + 2 NaCl + H2O',
      note: 'Requires sustained liquid contact.'
    },
    {
      id: 'water_combustion',
      name: 'Hydrogen Oxidation',
      reactants: [{ type: 'H2', count: 2 }, { type: 'O2', count: 1 }],
      products: [{ type: 'H2O', count: 2 }],
      conditions: { tempMinC: 180, tempMaxC: 2400, proximity: 150 },
      kinetics: { progressPerSecond: 1.6, contactThreshold: 0.65, decayPerSecond: 1.8, drift: 0.045 },
      thermalDeltaC: 120,
      displayEquation: '2 H2 + O2 -> 2 H2O',
      note: 'Needs heat and close gas contact.'
    },
    {
      id: 'methane_combustion',
      name: 'Methane Combustion',
      reactants: [{ type: 'CH4', count: 1 }, { type: 'O2', count: 2 }],
      products: [{ type: 'CO2', count: 1 }, { type: 'H2O', count: 2 }],
      conditions: { tempMinC: 260, tempMaxC: 2800, proximity: 160 },
      kinetics: { progressPerSecond: 1.15, contactThreshold: 0.75, decayPerSecond: 1.7, drift: 0.05 },
      thermalDeltaC: 150,
      displayEquation: 'CH4 + 2 O2 -> CO2 + 2 H2O',
      note: 'Hot gas-phase combustion pathway.'
    },
    {
      id: 'hydrogen_chlorination',
      name: 'Hydrogen Chlorination',
      reactants: [{ type: 'H2', count: 1 }, { type: 'Cl2', count: 1 }],
      products: [{ type: 'HCl', count: 2 }],
      conditions: { tempMinC: 40, tempMaxC: 1800, proximity: 145 },
      kinetics: { progressPerSecond: 1.0, contactThreshold: 0.7, decayPerSecond: 1.5, drift: 0.04 },
      thermalDeltaC: 74,
      displayEquation: 'H2 + Cl2 -> 2 HCl',
      note: 'Gas-phase halogenation.'
    },
    {
      id: 'chlorine_hydrolysis',
      name: 'Chlorine Hydrolysis',
      reactants: [{ type: 'Cl2', count: 1 }, { type: 'H2O', count: 1 }],
      products: [{ type: 'HOCl', count: 1 }, { type: 'HCl', count: 1 }],
      conditions: { tempMinC: -5, tempMaxC: 120, proximity: 145 },
      kinetics: { progressPerSecond: 0.55, contactThreshold: 0.95, decayPerSecond: 1.2, drift: 0.05 },
      thermalDeltaC: 22,
      displayEquation: 'Cl2 + H2O -> HOCl + HCl',
      note: 'Simplified aqueous chlorine disproportionation.'
    },
    {
      id: 'sodium_water_reaction',
      name: 'Sodium Water Reaction',
      reactants: [{ type: 'atom-Na', count: 2 }, { type: 'H2O', count: 2 }],
      products: [{ type: 'NaOH', count: 2 }, { type: 'H2', count: 1 }],
      conditions: { tempMinC: -10, tempMaxC: 1200, proximity: 130 },
      kinetics: { progressPerSecond: 1.2, contactThreshold: 0.7, decayPerSecond: 1.6, drift: 0.045 },
      thermalDeltaC: 92,
      displayEquation: '2 Na + 2 H2O -> 2 NaOH + H2',
      note: 'Simplified alkali metal-water reaction.'
    },
    {
      id: 'acid_base_neutralization',
      name: 'Hydrogen Chloride Neutralization',
      reactants: [{ type: 'HCl', count: 1 }, { type: 'NaOH', count: 1 }],
      products: [{ type: 'NaCl', count: 1 }, { type: 'H2O', count: 1 }],
      conditions: { tempMinC: -20, tempMaxC: 1400, proximity: 135 },
      kinetics: { progressPerSecond: 1.0, contactThreshold: 0.65, decayPerSecond: 1.5, drift: 0.04 },
      thermalDeltaC: 34,
      displayEquation: 'HCl + NaOH -> NaCl + H2O',
      note: 'Simplified neutralization pathway.'
    },
    {
      id: 'acetaldehyde_oxidation',
      name: 'Acetaldehyde Oxidation',
      reactants: [{ type: 'CH3CHO', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'CH3COOH', count: 1 }],
      conditions: { tempMinC: 25, tempMaxC: 840, proximity: 115 },
      kinetics: { progressPerSecond: 0.72, contactThreshold: 0.72, decayPerSecond: 1.25, drift: 0.035 },
      thermalDeltaC: 46,
      displayEquation: 'CH3CHO + O -> CH3COOH',
      note: 'Aldehyde oxidation toward a weak carboxylic acid.'
    },
    {
      id: 'hypochlorous_oxidation',
      name: 'Hypochlorous Acid Oxidation',
      reactants: [{ type: 'HOCl', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'HClO2', count: 1 }],
      conditions: { tempMinC: 10, tempMaxC: 480, proximity: 120, phase: 'liquid' },
      kinetics: { progressPerSecond: 0.52, contactThreshold: 0.82, decayPerSecond: 1.1, drift: 0.05 },
      thermalDeltaC: 18,
      displayEquation: 'HOCl + O -> HClO2',
      note: 'Stepwise oxychlorine oxidation in the water phase.'
    },
    {
      id: 'chlorous_oxidation',
      name: 'Chlorous Acid Oxidation',
      reactants: [{ type: 'HClO2', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'HClO3', count: 1 }],
      conditions: { tempMinC: 20, tempMaxC: 520, proximity: 120, phase: 'liquid' },
      kinetics: { progressPerSecond: 0.48, contactThreshold: 0.86, decayPerSecond: 1.08, drift: 0.05 },
      thermalDeltaC: 16,
      displayEquation: 'HClO2 + O -> HClO3',
      note: 'Further oxidation along the oxychlorine acid ladder.'
    },
    {
      id: 'chloric_oxidation',
      name: 'Chloric Acid Oxidation',
      reactants: [{ type: 'HClO3', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'HClO4', count: 1 }],
      conditions: { tempMinC: 30, tempMaxC: 560, proximity: 125, phase: 'liquid' },
      kinetics: { progressPerSecond: 0.44, contactThreshold: 0.9, decayPerSecond: 1.05, drift: 0.05 },
      thermalDeltaC: 14,
      displayEquation: 'HClO3 + O -> HClO4',
      note: 'Highest oxidation step for the current oxychlorine pathway.'
    },
    {
      id: 'ozone_formation',
      name: 'Ozone Formation',
      reactants: [{ type: 'O2', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'O3', count: 1 }],
      conditions: { tempMinC: -40, tempMaxC: 700, proximity: 95 },
      kinetics: { progressPerSecond: 0.8, contactThreshold: 0.6, decayPerSecond: 1.5, drift: 0.03 },
      thermalDeltaC: -24,
      displayEquation: 'O2 + O -> O3',
      note: 'Oxygen radical association.'
    },
    {
      id: 'ozone_decomposition',
      name: 'Ozone Decomposition',
      reactants: [{ type: 'O3', count: 1 }],
      products: [{ type: 'O2', count: 1 }, { type: 'atom-O', count: 1 }],
      conditions: { tempMinC: 140, tempMaxC: 2600, proximity: 80 },
      kinetics: { progressPerSecond: 0.55, contactThreshold: 0.85, decayPerSecond: 1.2, drift: 0 },
      thermalDeltaC: 30,
      displayEquation: 'O3 -> O2 + O',
      note: 'Thermal ozone breakdown.'
    }
  ]
};

let sidebarDirty = true;

function markSidebarDirty() {
  sidebarDirty = true;
}

function getVesselRect() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const sideW = Math.min(360, w - 28) + 28;
  const compactHud = w <= 1100;

  if (compactHud) {
    const bottomH = 84;

    return {
      x: Math.max(sideW + 18, 250),
      y: 28,
      w: Math.max(300, w - sideW - 32),
      h: Math.max(240, h - bottomH - 42)
    };
  }

  const rightPanelW = 368;

  return {
    x: Math.max(sideW + 18, 250),
    y: 28,
    w: Math.max(300, w - sideW - rightPanelW - 22),
    h: Math.max(240, h - 42)
  };
}

function buildAtomsForSpecies(type, cx, cy) {
  const spec = SPECIES[type];
  const atoms = spec.atomEls.map((el, i) => {
    const style = elementStyles[el];
    return {
      id: nextAtomId++,
      el,
      x: cx,
      y: cy,
      vx: rand(-0.8, 0.8),
      vy: rand(-0.8, 0.8),
      fx: 0,
      fy: 0,
      r: style.r,
      m: style.m,
      charge: 0,
      phase: i * 1.13 + Math.random() * 0.4,
      spin: i * 0.73 + Math.random() * 0.4
    };
  });

  if (type === 'H2') {
    atoms[0].x -= 16; atoms[1].x += 16;
  } else if (type === 'Cl2') {
    atoms[0].x -= 19; atoms[1].x += 19;
  } else if (type === 'HCl') {
    atoms[0].x -= 14; atoms[1].x += 16;
  } else if (type === 'CO') {
    atoms[0].x -= 15; atoms[1].x += 15;
  } else if (type === 'CO2') {
    atoms[0].x = cx - 31; atoms[0].y = cy;
    atoms[1].x = cx;      atoms[1].y = cy;
    atoms[2].x = cx + 31; atoms[2].y = cy;
  } else if (type === 'NaCl') {
    atoms[0].x -= 17; atoms[1].x += 17;
    atoms[0].charge = +1;
    atoms[1].charge = -1;
  } else if (type === 'NaOH') {
    atoms[0].x = cx - 24; atoms[0].y = cy;
    atoms[1].x = cx;      atoms[1].y = cy;
    atoms[2].x = cx + 24; atoms[2].y = cy;
  } else if (type === 'NaOCl') {
    atoms[0].x = cx - 18; atoms[0].y = cy + 12;
    atoms[1].x = cx + 2; atoms[1].y = cy - 8;
    atoms[2].x = cx + 21; atoms[2].y = cy + 11;
    atoms[0].charge = +1;
    atoms[2].charge = -1;
  } else if (type === 'O2') {
    atoms[0].x -= 18; atoms[1].x += 18;
  } else if (type === 'H2O') {
    atoms[0].x = cx;      atoms[0].y = cy;
    atoms[1].x = cx - 22; atoms[1].y = cy + 14;
    atoms[2].x = cx + 22; atoms[2].y = cy + 14;
  } else if (type === 'HOCl') {
    atoms[0].x = cx - 28; atoms[0].y = cy + 6;
    atoms[1].x = cx - 2;  atoms[1].y = cy;
    atoms[2].x = cx + 30; atoms[2].y = cy + 10;
  } else if (type === 'HClO2') {
    atoms[0].x = cx - 42; atoms[0].y = cy + 10;
    atoms[1].x = cx - 15; atoms[1].y = cy + 3;
    atoms[2].x = cx + 12; atoms[2].y = cy;
    atoms[3].x = cx + 38; atoms[3].y = cy - 18;
  } else if (type === 'HClO3') {
    atoms[0].x = cx - 44; atoms[0].y = cy + 12;
    atoms[1].x = cx - 18; atoms[1].y = cy + 4;
    atoms[2].x = cx + 8;  atoms[2].y = cy;
    atoms[3].x = cx + 36; atoms[3].y = cy - 20;
    atoms[4].x = cx + 34; atoms[4].y = cy + 20;
  } else if (type === 'HClO4') {
    atoms[0].x = cx - 48; atoms[0].y = cy + 14;
    atoms[1].x = cx - 22; atoms[1].y = cy + 4;
    atoms[2].x = cx + 4;  atoms[2].y = cy;
    atoms[3].x = cx + 34; atoms[3].y = cy - 22;
    atoms[4].x = cx + 38; atoms[4].y = cy + 2;
    atoms[5].x = cx + 26; atoms[5].y = cy + 28;
  } else if (type === 'H2O2') {
    atoms[0].x = cx - 36; atoms[0].y = cy + 2;
    atoms[1].x = cx - 11; atoms[1].y = cy - 9;
    atoms[2].x = cx + 11; atoms[2].y = cy + 9;
    atoms[3].x = cx + 36; atoms[3].y = cy - 2;
  } else if (type === 'CH4') {
    atoms[0].x = cx;      atoms[0].y = cy;
    atoms[1].x = cx + 8;  atoms[1].y = cy - 32;
    atoms[2].x = cx - 33; atoms[2].y = cy - 2;
    atoms[3].x = cx + 35; atoms[3].y = cy + 6;
    atoms[4].x = cx - 2;  atoms[4].y = cy + 37;
  } else if (type === 'CH3Cl') {
    atoms[0].x = cx;      atoms[0].y = cy;
    atoms[1].x = cx + 8;  atoms[1].y = cy - 30;
    atoms[2].x = cx - 31; atoms[2].y = cy - 2;
    atoms[3].x = cx + 31; atoms[3].y = cy + 7;
    atoms[4].x = cx - 3;  atoms[4].y = cy + 36;
  } else if (type === 'CH2Cl2') {
    atoms[0].x = cx;      atoms[0].y = cy;
    atoms[1].x = cx + 7;  atoms[1].y = cy - 30;
    atoms[2].x = cx - 31; atoms[2].y = cy - 3;
    atoms[3].x = cx + 34; atoms[3].y = cy + 6;
    atoms[4].x = cx - 2;  atoms[4].y = cy + 38;
  } else if (type === 'acetone') {
    atoms[0].x = cx - 26; atoms[0].y = cy;
    atoms[1].x = cx;      atoms[1].y = cy;
    atoms[2].x = cx + 26; atoms[2].y = cy;
    atoms[3].x = cx;      atoms[3].y = cy - 26;
    atoms[4].x = cx - 51; atoms[4].y = cy - 22;
    atoms[5].x = cx - 57; atoms[5].y = cy + 2;
    atoms[6].x = cx - 44; atoms[6].y = cy + 25;
    atoms[7].x = cx + 51; atoms[7].y = cy - 22;
    atoms[8].x = cx + 57; atoms[8].y = cy + 2;
    atoms[9].x = cx + 44; atoms[9].y = cy + 25;
  } else if (type === 'CH3OH') {
    atoms[0].x = cx - 8;  atoms[0].y = cy;
    atoms[1].x = cx - 33; atoms[1].y = cy - 4;
    atoms[2].x = cx - 9;  atoms[2].y = cy - 30;
    atoms[3].x = cx - 4;  atoms[3].y = cy + 30;
    atoms[4].x = cx + 20; atoms[4].y = cy - 3;
    atoms[5].x = cx + 41; atoms[5].y = cy + 11;
  } else if (type === 'CH2O') {
    atoms[0].x = cx - 4;  atoms[0].y = cy;
    atoms[1].x = cx - 27; atoms[1].y = cy - 13;
    atoms[2].x = cx - 27; atoms[2].y = cy + 13;
    atoms[3].x = cx + 28; atoms[3].y = cy;
  } else if (type === 'HCOOH') {
    atoms[0].x = cx - 36; atoms[0].y = cy;
    atoms[1].x = cx - 8;  atoms[1].y = cy;
    atoms[2].x = cx + 24; atoms[2].y = cy - 16;
    atoms[3].x = cx + 22; atoms[3].y = cy + 15;
    atoms[4].x = cx + 45; atoms[4].y = cy + 30;
  } else if (type === 'CH3CHO') {
    atoms[0].x = cx - 26; atoms[0].y = cy;
    atoms[1].x = cx - 50; atoms[1].y = cy - 13;
    atoms[2].x = cx - 50; atoms[2].y = cy + 13;
    atoms[3].x = cx - 24; atoms[3].y = cy - 30;
    atoms[4].x = cx + 2;  atoms[4].y = cy;
    atoms[5].x = cx + 24; atoms[5].y = cy + 18;
    atoms[6].x = cx + 34; atoms[6].y = cy - 18;
  } else if (type === 'CH3COOH') {
    atoms[0].x = cx - 28; atoms[0].y = cy;
    atoms[1].x = cx - 52; atoms[1].y = cy - 13;
    atoms[2].x = cx - 52; atoms[2].y = cy + 13;
    atoms[3].x = cx - 28; atoms[3].y = cy - 30;
    atoms[4].x = cx - 1;  atoms[4].y = cy;
    atoms[5].x = cx + 28; atoms[5].y = cy - 18;
    atoms[6].x = cx + 28; atoms[6].y = cy + 18;
    atoms[7].x = cx + 50; atoms[7].y = cy + 32;
  } else if (type === 'CHCl3') {
    atoms[0].x = cx;      atoms[0].y = cy;
    atoms[1].x = cx + 8;  atoms[1].y = cy - 32;
    atoms[2].x = cx - 33; atoms[2].y = cy - 2;
    atoms[3].x = cx + 35; atoms[3].y = cy + 6;
    atoms[4].x = cx - 2;  atoms[4].y = cy + 37;
  } else if (type === 'O3') {
    atoms[0].x = cx - 24; atoms[0].y = cy + 11;
    atoms[1].x = cx;      atoms[1].y = cy - 4;
    atoms[2].x = cx + 24; atoms[2].y = cy + 11;
  } else if (type === 'CCl4') {
    atoms[0].x = cx;      atoms[0].y = cy;
    atoms[1].x = cx + 8;  atoms[1].y = cy - 32;
    atoms[2].x = cx - 33; atoms[2].y = cy - 2;
    atoms[3].x = cx + 35; atoms[3].y = cy + 6;
    atoms[4].x = cx - 2;  atoms[4].y = cy + 38;
  } else if (type === 'NaHCO3') {
    atoms[0].x = cx - 35; atoms[0].y = cy + 10;
    atoms[1].x = cx + 38; atoms[1].y = cy + 24;
    atoms[2].x = cx - 5;  atoms[2].y = cy;
    atoms[3].x = cx + 18; atoms[3].y = cy - 18;
    atoms[4].x = cx + 22; atoms[4].y = cy + 2;
    atoms[5].x = cx + 12; atoms[5].y = cy + 24;
    atoms[0].charge = +1;
    atoms[4].charge = -1;
  } else if (type === 'Na2CO3') {
    atoms[0].x = cx - 38; atoms[0].y = cy + 8;
    atoms[1].x = cx + 38; atoms[1].y = cy + 8;
    atoms[2].x = cx;      atoms[2].y = cy;
    atoms[3].x = cx - 18; atoms[3].y = cy - 20;
    atoms[4].x = cx + 18; atoms[4].y = cy - 20;
    atoms[5].x = cx;      atoms[5].y = cy + 24;
    atoms[0].charge = +1;
    atoms[1].charge = +1;
    atoms[4].charge = -1;
  } else if (type === 'NaC2H3O2') {
    atoms[0].x = cx - 30; atoms[0].y = cy + 8;
    atoms[1].x = cx - 8;  atoms[1].y = cy;
    atoms[2].x = cx + 16; atoms[2].y = cy + 1;
    atoms[3].x = cx - 10; atoms[3].y = cy - 23;
    atoms[4].x = cx + 7;  atoms[4].y = cy - 20;
    atoms[5].x = cx + 37; atoms[5].y = cy - 14;
    atoms[6].x = cx + 38; atoms[6].y = cy + 15;
    atoms[7].x = cx + 17; atoms[7].y = cy + 31;
    atoms[0].charge = +1;
    atoms[3].charge = -1;
  }

  return atoms;
}

function addMolecule(type, x, y, options = {}) {
  const spec = SPECIES[type];
  if (!spec) return null;
  const select = options.select !== false;
  const layoutScale = options.layoutScale ?? 1.08;

  const bounds = world.bounds;
  const cx = x ?? rand(bounds.x + 80, bounds.x + bounds.w - 80);
  const cy = y ?? rand(bounds.y + 80, bounds.y + bounds.h - 80);
  const atoms = buildAtomsForSpecies(type, cx, cy);

  if (atoms.length > 1 && layoutScale !== 1) {
    for (const atom of atoms) {
      atom.x = cx + (atom.x - cx) * layoutScale;
      atom.y = cy + (atom.y - cy) * layoutScale;
    }
  }

  const shapeConstraints = [];

  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dx = atoms[j].x - atoms[i].x;
      const dy = atoms[j].y - atoms[i].y;
      const rest = Math.hypot(dx, dy);
      if (!Number.isFinite(rest) || rest < 8) continue;
      const bonded = spec.bonds.some(b =>
        (b.a === i && b.b === j) || (b.a === j && b.b === i)
      );
      shapeConstraints.push({
        a: i,
        b: j,
        rest,
        strength: bonded ? 0.16 : 0.07,
        damping: bonded ? 0.18 : 0.12,
        wobble: bonded ? 0.03 : 0.045,
        phase: Math.random() * TAU,
        minDist: Math.max(atoms[i].r + atoms[j].r - 4, rest * 0.54)
      });
    }
  }

  const mol = {
    id: nextMolId++,
    type,
    label: spec.label,
    display: spec.display,
    phase: spec.phase,
    density: spec.density,
    miscibleGroup: spec.miscibleGroup,
    nativePhase: spec.phase,
    color: spec.color,
    formula: spec.formula,
    atoms,
    bonds: spec.bonds.map(b => ({ age: 45, strain: 0, core: true, ...b, rest: b.rest * layoutScale })),
    angleConstraints: (spec.angleConstraints || []).map(a => ({ ...a })),
    shapeConstraints,
    dissolved: false,
    reactionProgress: {},
    alive: true
  };

  world.molecules.push(mol);
  if (select) world.selectedMolId = mol.id;
  markSidebarDirty();
  return mol;
}

function addAtom(el, x, y, options = {}) {
  const bounds = world.bounds;
  const cx = x ?? rand(bounds.x + 80, bounds.x + bounds.w - 80);
  const cy = y ?? rand(bounds.y + 80, bounds.y + bounds.h - 80);
  const style = elementStyles[el];
  const select = options.select !== false;

  const mol = {
    id: nextMolId++,
    type: `atom-${el}`,
    label: el,
    display: `${el} atom`,
    phase: 'particle',
    density: 0.5,
    miscibleGroup: 'particle',
    nativePhase: 'particle',
    color: style.color,
    formula: el,
    reactionProgress: {},
    atoms: [{
      id: nextAtomId++,
      el,
      x: cx,
      y: cy,
      vx: rand(-0.8, 0.8),
      vy: rand(-0.8, 0.8),
      fx: 0,
      fy: 0,
      r: style.r,
      m: style.m,
      charge: 0,
      phase: Math.random() * 3,
      spin: Math.random() * 2
    }],
    bonds: [],
    angleConstraints: [],
    alive: true
  };

  world.molecules.push(mol);
  if (select) world.selectedMolId = mol.id;
  markSidebarDirty();
  return mol;
}

function setMoleculePhaseMode(mol, nextPhase) {
  const config = EVAPORATION_CONFIG[mol.type];
  if (!config || mol.phase === nextPhase) return;

  if (nextPhase === 'gas') {
    mol.phase = 'gas';
    mol.density = config.gasDensity;
    mol.miscibleGroup = config.gasMiscibleGroup;
  } else {
    mol.phase = mol.nativePhase || 'liquid';
    mol.density = config.liquidDensity;
    mol.miscibleGroup = config.liquidMiscibleGroup;
  }
}

function setMoleculeDissolvedState(mol, dissolved) {
  const config = DISSOLUTION_CONFIG[mol.type];
  if (!config) return;

  mol.dissolved = dissolved;
  if (dissolved) {
    mol.phase = 'liquid';
    mol.density = config.dissolvedDensity;
    mol.miscibleGroup = config.solventGroup;
  } else {
    mol.phase = mol.nativePhase || 'particle';
    mol.density = SPECIES[mol.type]?.density ?? mol.density;
    mol.miscibleGroup = SPECIES[mol.type]?.miscibleGroup || mol.miscibleGroup;
  }
}

function isWaterPhaseMolecule(mol) {
  if (!mol?.alive || mol.phase !== 'liquid') return false;
  if (mol.miscibleGroup === 'water') return true;
  return mol.dissolved && DISSOLUTION_CONFIG[mol.type]?.solventGroup === 'water';
}

function formatIonLabel(ion) {
  const withSubscripts = prettyFormula(ion.replace('^', ''));
  return withSubscripts
    .replace('2-', '²⁻')
    .replace('+', '⁺')
    .replace('-', '⁻');
}

function getWaterChemistrySnapshot() {
  const aqueous = world.molecules.filter(isWaterPhaseMolecule);
  if (!aqueous.length) return null;

  const speciesCounts = {};
  const ionCounts = {};
  let waterCount = 0;
  let acidUnits = 0;
  let baseUnits = 0;
  let conductivity = 0;

  for (const mol of aqueous) {
    speciesCounts[mol.type] = (speciesCounts[mol.type] || 0) + 1;
    if (mol.type === 'H2O') waterCount += 1;

    const ionProfile = AQUEOUS_ION_PROFILES[mol.type];
    if (ionProfile) {
      for (const [ion, count] of Object.entries(ionProfile.ions)) {
        ionCounts[ion] = (ionCounts[ion] || 0) + count;
        conductivity += count;
      }
      if (ionProfile.ions['H3O+']) acidUnits += ionProfile.ions['H3O+'];
      if (ionProfile.ions['OH-']) baseUnits += ionProfile.ions['OH-'];
      if (ionProfile.ions['CO3^2-']) baseUnits += ionProfile.ions['CO3^2-'] * 0.7;
      if (ionProfile.ions['HCO3-']) baseUnits += ionProfile.ions['HCO3-'] * 0.16;
      if (ionProfile.ions['OCl-']) baseUnits += ionProfile.ions['OCl-'] * 0.18;
      if (ionProfile.ions['CH3COO-']) baseUnits += ionProfile.ions['CH3COO-'] * 0.1;
    }

    const weak = WEAK_AQUEOUS_ACIDS[mol.type];
    if (weak) {
      acidUnits += weak.acidUnits;
      ionCounts['H3O+'] = (ionCounts['H3O+'] || 0) + weak.acidUnits * 0.45;
      if (weak.ionLabel) ionCounts[weak.ionLabel] = (ionCounts[weak.ionLabel] || 0) + weak.acidUnits * 0.45;
    }
  }

  const dissolvedTypes = Object.keys(speciesCounts)
    .filter(type => type !== 'H2O')
    .sort((a, b) => speciesCounts[b] - speciesCounts[a]);
  const scale = Math.max(6, waterCount * 0.22 + dissolvedTypes.reduce((sum, type) => sum + speciesCounts[type], 0) * 0.9);
  const delta = (baseUnits - acidUnits) / scale;
  const pH = clamp(7 + Math.sign(delta) * Math.log10(1 + Math.abs(delta) * 42) * 3.15, 0, 14);
  const majorIons = Object.entries(ionCounts)
    .filter(([, count]) => count >= 0.4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([ion, count]) => ({ ion, count }));

  return {
    aqueousCount: aqueous.length,
    waterCount,
    speciesCounts,
    dissolvedTypes,
    ionCounts,
    majorIons,
    conductivity,
    acidity: acidUnits,
    basicity: baseUnits,
    pH,
    isCarbonated: (speciesCounts.CO2 || 0) > 0
  };
}

function clearWorld() {
  world.molecules = [];
  world.stats.reactions = 0;
  world.selectedMolId = null;
  world.pressureAtm = 1;
  world.heatPulseC = 0;
  world.stirring.timeLeft = 0;
  world.stirring.power = 0;
  world.thermalEvents = [];
  world.thermalStats.addedC = 0;
  world.thermalStats.removedC = 0;
  addReactionLog('system', 'Sandbox cleared');
  markSidebarDirty();
}

function moleculeCenter(mol) {
  let mx = 0, my = 0, m = 0;
  for (const a of mol.atoms) {
    mx += a.x * a.m;
    my += a.y * a.m;
    m += a.m;
  }
  return { x: mx / m, y: my / m };
}

function getLiquidLayerKey(mol) {
  if (mol.dissolved) return DISSOLUTION_CONFIG[mol.type]?.solventGroup || mol.miscibleGroup || mol.type;
  return mol.type;
}

function getLiquidLayerLayout() {
  const b = world.bounds;
  if (!b) return { surfaceY: null, liquidHeight: 0, layers: [] };
  const waterChemistry = getWaterChemistrySnapshot();

  const liquids = world.molecules.filter(m => m.alive && m.phase === 'liquid');
  const groups = {};

  for (const mol of liquids) {
    const key = getLiquidLayerKey(mol);
    if (!groups[key]) groups[key] = [];
    groups[key].push(mol);
  }

  const layers = Object.entries(groups)
    .map(([layerKey, arr]) => {
      const sample = arr[0];
      const preferredType = layerKey === 'water'
        ? 'H2O'
        : sample.type;
      const spec = SPECIES[preferredType] || SPECIES[sample.type] || sample;
      const dissolvedCounts = {};
      for (const mol of arr) {
        if (!mol.dissolved) continue;
        dissolvedCounts[mol.type] = (dissolvedCounts[mol.type] || 0) + 1;
      }
      const dissolvedTypes = Object.keys(dissolvedCounts)
        .sort((a, b2) => dissolvedCounts[b2] - dissolvedCounts[a]);
      return {
        layerKey,
        count: arr.length,
        density: spec?.density ?? sample?.density ?? 1.0,
        color: spec?.color || sample?.color || '#9bbcff',
        dissolvedTypes,
        chemistry: layerKey === 'water' ? waterChemistry : null
      };
    })
    .sort((a, b2) => a.density - b2.density);

  if (!layers.length) return { surfaceY: null, liquidHeight: 0, layers: [] };

  const total = layers.reduce((sum, layer) => sum + layer.count, 0);
  const liquidHeight = Math.min(b.h * 0.7, total * 13);
  let y = b.y + b.h - liquidHeight;

  for (const layer of layers) {
    const h = liquidHeight * (layer.count / total);
    layer.y = y;
    layer.h = h;
    layer.centerY = y + h * 0.5;
    y += h;
  }

  return {
    surfaceY: b.y + b.h - liquidHeight,
    liquidHeight,
    layers
  };
}

function confineMoleculeToPhaseZone(mol, b, liquidLayout, dt) {
  const center = moleculeCenter(mol);
  const radius = moleculeRadius(mol);
  const left = b.x + 14;
  const right = b.x + b.w - 14;
  const top = b.y + 14;
  const bottom = b.y + b.h - 14;

  let minAllowedY = top;
  let maxAllowedY = bottom;
  let targetY = null;
  let softRange = null;

  if (mol.phase === 'liquid') {
    const layer = liquidLayout.layers.find(entry => entry.layerKey === getLiquidLayerKey(mol));
    if (layer) {
      targetY = layer.centerY;
      softRange = {
        min: layer.y - Math.max(18, layer.h * 0.35),
        max: layer.y + layer.h + Math.max(18, layer.h * 0.35)
      };
    } else if (liquidLayout.surfaceY != null) {
      minAllowedY = liquidLayout.surfaceY + radius;
    }
  } else if (mol.phase === 'gas') {
    const isDragged = world.dragging.mol && world.dragging.mol.id === mol.id;
    const isSubmerged = liquidLayout.surfaceY != null && center.y > liquidLayout.surfaceY + radius * 0.35;
    const gasCeiling = liquidLayout.surfaceY == null
      ? bottom
      : Math.max(top + radius, liquidLayout.surfaceY - radius - 6);
    minAllowedY = top;
    maxAllowedY = (isDragged || isSubmerged) ? bottom : gasCeiling;
    targetY = top + (maxAllowedY - top) * 0.35;
  }

  if (targetY != null && Number.isFinite(targetY)) {
    let pullScale = 0.0035;
    if (mol.phase === 'liquid' && softRange) {
      const overshootTop = Math.max(0, softRange.min - center.y);
      const overshootBottom = Math.max(0, center.y - softRange.max);
      const overshoot = overshootTop + overshootBottom;
      pullScale = overshoot > 0
        ? (0.006 + overshoot * 0.00018)
        : 0.0011;
    }

    const pull = (targetY - center.y) * pullScale * dt * 60;
    for (const atom of mol.atoms) {
      atom.vy += pull;
    }
  }

  let shiftX = 0;
  let shiftY = 0;
  if (center.x < left + radius) shiftX = left + radius - center.x;
  else if (center.x > right - radius) shiftX = right - radius - center.x;

  if (center.y < minAllowedY) shiftY = minAllowedY - center.y;
  else if (center.y > maxAllowedY) shiftY = maxAllowedY - center.y;

  if (shiftX !== 0 || shiftY !== 0) {
    for (const atom of mol.atoms) {
      atom.x += shiftX;
      atom.y += shiftY;
      if (shiftX !== 0) atom.vx *= -0.32;
      if (shiftY !== 0) atom.vy *= -0.22;
    }
  }
}

function moleculeVelocity(mol) {
  let vx = 0, vy = 0;
  for (const a of mol.atoms) {
    vx += a.vx;
    vy += a.vy;
  }
  return { vx: vx / mol.atoms.length, vy: vy / mol.atoms.length };
}
