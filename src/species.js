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

function getMaterialFallbackSpec(type) {
  if (SPECIES[type]) return SPECIES[type];
  if (type.startsWith('atom-')) {
    const el = type.replace('atom-', '');
    const color = elementStyles[el]?.color || '#9bbcff';
    const phase = (el === 'O' || el === 'H' || el === 'Cl' || el === 'N') ? 'gas' : 'particle';
    return {
      phase,
      density: phase === 'gas' ? 0.12 : 0.5,
      miscibleGroup: phase === 'gas' ? 'gas' : 'particle',
      color
    };
  }
  return { phase: 'particle', density: 1, miscibleGroup: 'particle', color: '#9bbcff' };
}

function normalizeMaterialProfile(type, source = {}) {
  const fallback = getMaterialFallbackSpec(type);
  const defaultPhase = source.defaultPhase || fallback.phase || 'particle';
  const defaultStates = {
    [defaultPhase]: {
      density: fallback.density ?? 1,
      miscibleGroup: fallback.miscibleGroup || 'particle',
      color: fallback.color || '#9bbcff'
    }
  };
  const states = { ...defaultStates, ...(source.states || {}) };
  const thermal = {
    meltingPointC: null,
    boilingPointC: null,
    condensePointC: null,
    heatCapacity: 1,
    dHvapKJ: null,
    evapRate: 0,
    coolDeltaC: 0,
    minPressureAtm: 0.01,
    ignitionPointC: null,
    decompositionPointC: null,
    ...source.thermal
  };
  if (states.gas && states.liquid && Number.isFinite(thermal.boilingPointC)) {
    if (!Number.isFinite(thermal.condensePointC)) {
      thermal.condensePointC = thermal.boilingPointC - 8;
    }
    if (!Number.isFinite(thermal.dHvapKJ)) {
      thermal.dHvapKJ = thermal.boilingPointC < 0 ? 12 : 30;
    }
    if (!(thermal.evapRate > 0)) {
      thermal.evapRate = thermal.boilingPointC < 0 ? 0.11 : 0.08;
    }
    if (!(thermal.coolDeltaC < 0)) {
      thermal.coolDeltaC = thermal.boilingPointC < 0 ? -7 : -8;
    }
  }
  if (!states.solid && Number.isFinite(thermal.meltingPointC)) {
    const solidBase = states.liquid || states.particle || states[defaultPhase] || defaultStates[defaultPhase];
    states.solid = {
      density: clamp((solidBase?.density ?? 1) * 1.08, 0.08, 6),
      miscibleGroup: solidBase?.miscibleGroup === 'gas' ? 'solid' : (solidBase?.miscibleGroup || 'solid'),
      color: solidBase?.color || fallback.color || '#9bbcff'
    };
  }
  const descriptors = {
    polarity: 'unknown',
    vaporLevel: states.gas ? 1 : 0,
    condensationLevel: states.liquid ? 1 : 0,
    notes: '',
    ...source.descriptors
  };

  return {
    defaultPhase,
    states,
    descriptors,
    thermal,
    aqueous: {
      role: 'neutral',
      pH: null,
      electrolyte: 'none',
      ionProfile: null,
      weakAcid: null,
      ...source.aqueous
    },
    solubility: {
      solventGroup: null,
      dissolvedDensity: null,
      nearRadius: 120,
      requiredNeighbors: 2,
      dissolveRate: 0,
      precipitateRate: 0,
      sourcePhases: ['particle'],
      ...source.solubility
    },
    optical: {
      absorptionBands: ['visible'],
      emissionColor: fallback.color || '#9bbcff',
      scatteringColor: fallback.color || '#9bbcff',
      photoReactive: false,
      excitationMultiplier: 1,
      lightToHeatFactor: 0.12,
      emittedBand: 'visible',
      ...source.optical
    }
  };
}

const MATERIAL_CONDITIONS = {
  H2: normalizeMaterialProfile('H2', { states: { liquid: { density: 0.071, miscibleGroup: 'cryogenic', color: '#7fb8f5' } }, thermal: { meltingPointC: -259, boilingPointC: -253, condensePointC: -259, heatCapacity: 14.3 }, descriptors: { polarity: 'nonpolar', notes: 'Very light diatomic gas.' }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.65 } }),
  O2: normalizeMaterialProfile('O2', { states: { liquid: { density: 1.14, miscibleGroup: 'cryogenic', color: '#d98f9d' } }, thermal: { meltingPointC: -219, boilingPointC: -183, condensePointC: -188, heatCapacity: 0.92 }, descriptors: { polarity: 'nonpolar', notes: 'Oxidizer; supports combustion.' }, optical: { absorptionBands: ['uv', 'visible'], photoReactive: true, excitationMultiplier: 1.1, emissionColor: '#ffd5d5' } }),
  Cl2: normalizeMaterialProfile('Cl2', { states: { liquid: { density: 1.47, miscibleGroup: 'halogen-liquid', color: '#7bcf73' } }, thermal: { meltingPointC: -101, boilingPointC: -34, condensePointC: -39, heatCapacity: 0.48 }, descriptors: { polarity: 'nonpolar', notes: 'Photochemically active halogen gas.' }, aqueous: { role: 'acid-former', pH: 2.8 }, optical: { absorptionBands: ['visible', 'uv', 'xray'], photoReactive: true, excitationMultiplier: 1.35, emissionColor: '#d9ffd0' } }),
  HCl: normalizeMaterialProfile('HCl', { states: { liquid: { density: 1.19, miscibleGroup: 'acid-liquid', color: '#9adba2' } }, thermal: { meltingPointC: -114, boilingPointC: -85, condensePointC: -90, heatCapacity: 0.84 }, descriptors: { polarity: 'polar', notes: 'Strong acid when dissolved.' }, aqueous: { role: 'strong-acid', pH: 1, electrolyte: 'strong', ionProfile: { ions: { 'H3O+': 1, 'Cl-': 1 }, strength: 'strong-acid' } }, solubility: { solventGroup: 'water', dissolvedDensity: 1.02, nearRadius: 150, requiredNeighbors: 3, dissolveRate: 0.22, precipitateRate: 0.01, sourcePhases: ['gas'] }, optical: { absorptionBands: ['infrared', 'uv'], emissionColor: '#d8fff2' } }),
  HOCl: normalizeMaterialProfile('HOCl', { thermal: { meltingPointC: -30, heatCapacity: 1.1 }, descriptors: { polarity: 'polar', condensationLevel: 0, notes: 'Weak acid and oxidizer.' }, aqueous: { role: 'weak-acid', pH: 5.3, weakAcid: { acidUnits: 0.18, ionLabel: 'OCl-' } }, optical: { absorptionBands: ['uv', 'visible'], photoReactive: true, excitationMultiplier: 1.05, emissionColor: '#ddffc9' } }),
  HClO2: normalizeMaterialProfile('HClO2', { thermal: { meltingPointC: -15, heatCapacity: 1.08 }, descriptors: { polarity: 'polar', condensationLevel: 0 }, aqueous: { role: 'weak-acid', pH: 2.5, weakAcid: { acidUnits: 0.42, ionLabel: 'ClO2-' } }, optical: { absorptionBands: ['uv'], photoReactive: true, excitationMultiplier: 1.12 } }),
  HClO3: normalizeMaterialProfile('HClO3', { thermal: { meltingPointC: -10, heatCapacity: 1.1 }, descriptors: { polarity: 'polar', condensationLevel: 0 }, aqueous: { role: 'strong-acid', pH: 1, electrolyte: 'strong', ionProfile: { ions: { 'H3O+': 1, 'ClO3-': 1 }, strength: 'strong-acid' } }, optical: { absorptionBands: ['uv'], photoReactive: true, excitationMultiplier: 1.1 } }),
  HClO4: normalizeMaterialProfile('HClO4', { thermal: { meltingPointC: -18, heatCapacity: 1.12 }, descriptors: { polarity: 'polar', condensationLevel: 0 }, aqueous: { role: 'strong-acid', pH: 1, electrolyte: 'strong', ionProfile: { ions: { 'H3O+': 1, 'ClO4-': 1 }, strength: 'strong-acid' } }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.95 } }),
  CO: normalizeMaterialProfile('CO', { states: { liquid: { density: 0.79, miscibleGroup: 'cryogenic', color: '#aba29c' } }, thermal: { meltingPointC: -205, boilingPointC: -191, condensePointC: -196, heatCapacity: 1.04 }, descriptors: { polarity: 'low' }, optical: { absorptionBands: ['infrared', 'uv'], excitationMultiplier: 0.72 } }),
  CO2: normalizeMaterialProfile('CO2', { states: { liquid: { density: 1.01, miscibleGroup: 'water', color: '#bbc7d2' } }, thermal: { meltingPointC: -56, boilingPointC: -78, condensePointC: -82, heatCapacity: 0.84 }, descriptors: { polarity: 'nonpolar', notes: 'Can dissolve into water.' }, aqueous: { role: 'weak-acid', pH: 5.6, weakAcid: { acidUnits: 0.12, note: 'carbonic-acid equivalent' } }, solubility: { solventGroup: 'water', dissolvedDensity: 1.01, nearRadius: 135, requiredNeighbors: 4, dissolveRate: 0.09, precipitateRate: 0.04, sourcePhases: ['gas'] }, optical: { absorptionBands: ['infrared'], excitationMultiplier: 0.58, emissionColor: '#cfe6f3', emittedBand: 'infrared' } }),
  NaCl: normalizeMaterialProfile('NaCl', { thermal: { meltingPointC: 801, boilingPointC: 1465, heatCapacity: 0.86 }, descriptors: { polarity: 'ionic', vaporLevel: 0, condensationLevel: 0 }, aqueous: { role: 'salt', pH: 7, electrolyte: 'strong', ionProfile: { ions: { 'Na+': 1, 'Cl-': 1 }, strength: 'strong-electrolyte' } }, solubility: { solventGroup: 'water', dissolvedDensity: 1.05, nearRadius: 120, requiredNeighbors: 3, dissolveRate: 0.08, precipitateRate: 0.02 }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.4, emissionColor: '#f6ffd8' } }),
  NaOH: normalizeMaterialProfile('NaOH', { thermal: { meltingPointC: 318, boilingPointC: 1388, heatCapacity: 1.05 }, descriptors: { polarity: 'ionic', vaporLevel: 0, condensationLevel: 0 }, aqueous: { role: 'strong-base', pH: 14, electrolyte: 'strong', ionProfile: { ions: { 'Na+': 1, 'OH-': 1 }, strength: 'strong-base' } }, solubility: { solventGroup: 'water', dissolvedDensity: 1.08, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.12, precipitateRate: 0.03 }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.45, emissionColor: '#f5ffe0' } }),
  NaOCl: normalizeMaterialProfile('NaOCl', { thermal: { meltingPointC: 18, heatCapacity: 1.06 }, descriptors: { polarity: 'ionic-polar', vaporLevel: 0, condensationLevel: 0, notes: 'Bleach-like aqueous oxidizer.' }, aqueous: { role: 'basic-salt', pH: 11.2, electrolyte: 'strong', ionProfile: { ions: { 'Na+': 1, 'OCl-': 1 }, strength: 'basic-salt' } }, optical: { absorptionBands: ['visible', 'uv'], photoReactive: true, excitationMultiplier: 1.08, emissionColor: '#ecffd2' } }),
  H2O: normalizeMaterialProfile('H2O', { states: { gas: { density: 0.06, miscibleGroup: 'gas', color: '#b8dcff' }, solid: { density: 0.92, miscibleGroup: 'ice', color: '#dff4ff' } }, thermal: { meltingPointC: 0, boilingPointC: 100, condensePointC: 92, heatCapacity: 4.18, dHvapKJ: 40.65, evapRate: 0.08, coolDeltaC: -10, minPressureAtm: 0.01 }, descriptors: { polarity: 'polar', notes: 'Primary solvent.' }, aqueous: { role: 'neutral', pH: 7 }, optical: { absorptionBands: ['microwave', 'infrared', 'visible', 'uv'], excitationMultiplier: 0.9, emissionColor: '#d7f0ff', emittedBand: 'infrared' } }),
  H2O2: normalizeMaterialProfile('H2O2', { states: { gas: { density: 0.08, miscibleGroup: 'gas', color: '#d6ecff' } }, thermal: { meltingPointC: -0.4, boilingPointC: 150, condensePointC: 138, decompositionPointC: 150, heatCapacity: 2.6, dHvapKJ: 51.0, evapRate: 0.05, coolDeltaC: -12, minPressureAtm: 0.02 }, descriptors: { polarity: 'polar' }, aqueous: { role: 'oxidizer', pH: 6.2 }, optical: { absorptionBands: ['uv'], photoReactive: true, excitationMultiplier: 1.12, emissionColor: '#eef7ff' } }),
  CH4: normalizeMaterialProfile('CH4', { states: { liquid: { density: 0.42, miscibleGroup: 'cryogenic', color: '#87b4f0' } }, thermal: { meltingPointC: -182, boilingPointC: -161, condensePointC: -165, ignitionPointC: 537, heatCapacity: 2.2 }, descriptors: { polarity: 'nonpolar', notes: 'Fuel gas.' }, optical: { absorptionBands: ['infrared', 'uv'], excitationMultiplier: 0.62, emissionColor: '#d7e9ff' } }),
  CH3Cl: normalizeMaterialProfile('CH3Cl', { states: { liquid: { density: 0.92, miscibleGroup: 'organic-light', color: '#93d7aa' } }, thermal: { meltingPointC: -97, boilingPointC: -24, condensePointC: -28, heatCapacity: 1.4 }, descriptors: { polarity: 'polar' }, optical: { absorptionBands: ['infrared', 'uv'], photoReactive: true, excitationMultiplier: 1.02, emissionColor: '#dfffe7' } }),
  CH2Cl2: normalizeMaterialProfile('CH2Cl2', { states: { gas: { density: 0.42, miscibleGroup: 'gas', color: '#c9efe0' } }, thermal: { meltingPointC: -97, boilingPointC: 40, condensePointC: 34, heatCapacity: 1.3, dHvapKJ: 28.8, evapRate: 0.08, coolDeltaC: -7, minPressureAtm: 0.02 }, descriptors: { polarity: 'moderate' }, optical: { absorptionBands: ['infrared', 'uv'], excitationMultiplier: 0.74, emissionColor: '#e7fff4' } }),
  acetone: normalizeMaterialProfile('acetone', { states: { gas: { density: 0.18, miscibleGroup: 'gas', color: '#ecd6ff' } }, thermal: { meltingPointC: -95, boilingPointC: 56, condensePointC: 46, heatCapacity: 2.2, dHvapKJ: 31.3, evapRate: 0.14, coolDeltaC: -9, minPressureAtm: 0.02 }, descriptors: { polarity: 'polar', notes: 'Volatile light organic solvent.' }, optical: { absorptionBands: ['visible', 'uv'], excitationMultiplier: 0.9, emissionColor: '#ffe6ff' } }),
  CH3OH: normalizeMaterialProfile('CH3OH', { states: { gas: { density: 0.14, miscibleGroup: 'gas', color: '#d1e7ff' } }, thermal: { meltingPointC: -98, boilingPointC: 65, condensePointC: 58, heatCapacity: 2.5, dHvapKJ: 35.3, evapRate: 0.1, coolDeltaC: -8, minPressureAtm: 0.02 }, descriptors: { polarity: 'polar' }, optical: { absorptionBands: ['infrared', 'uv'], excitationMultiplier: 0.86, emissionColor: '#e5f2ff' } }),
  CH2O: normalizeMaterialProfile('CH2O', { states: { liquid: { density: 0.82, miscibleGroup: 'organic-light', color: '#c7b7b0' } }, thermal: { meltingPointC: -92, boilingPointC: -19, condensePointC: -24, heatCapacity: 1.45 }, descriptors: { polarity: 'polar' }, optical: { absorptionBands: ['uv'], photoReactive: true, excitationMultiplier: 1.05, emissionColor: '#fff1eb' } }),
  HCOOH: normalizeMaterialProfile('HCOOH', { states: { gas: { density: 0.2, miscibleGroup: 'gas', color: '#d7ebff' } }, thermal: { meltingPointC: 8, boilingPointC: 101, condensePointC: 94, heatCapacity: 2.1, dHvapKJ: 25.9, evapRate: 0.07, coolDeltaC: -7, minPressureAtm: 0.02 }, descriptors: { polarity: 'polar' }, aqueous: { role: 'weak-acid', pH: 2.2, weakAcid: { acidUnits: 0.34, ionLabel: 'HCOO-' } }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.84, emissionColor: '#eef7ff' } }),
  CH3CHO: normalizeMaterialProfile('CH3CHO', { states: { gas: { density: 0.16, miscibleGroup: 'gas', color: '#ebd9d2' } }, thermal: { meltingPointC: -123, boilingPointC: 20, condensePointC: 14, heatCapacity: 1.85, dHvapKJ: 25.1, evapRate: 0.11, coolDeltaC: -6, minPressureAtm: 0.02 }, descriptors: { polarity: 'polar' }, optical: { absorptionBands: ['uv'], photoReactive: true, excitationMultiplier: 1.0, emissionColor: '#ffece3' } }),
  CH3COOH: normalizeMaterialProfile('CH3COOH', { states: { gas: { density: 0.19, miscibleGroup: 'gas', color: '#dce8ff' } }, thermal: { meltingPointC: 16, boilingPointC: 118, condensePointC: 110, heatCapacity: 2.0, dHvapKJ: 23.7, evapRate: 0.05, coolDeltaC: -5, minPressureAtm: 0.02 }, descriptors: { polarity: 'polar' }, aqueous: { role: 'weak-acid', pH: 2.9, weakAcid: { acidUnits: 0.16, ionLabel: 'CH3COO-' } }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.82, emissionColor: '#edf3ff' } }),
  CHCl3: normalizeMaterialProfile('CHCl3', { states: { gas: { density: 0.28, miscibleGroup: 'gas', color: '#d7f2da' } }, thermal: { meltingPointC: -63, boilingPointC: 61, condensePointC: 52, heatCapacity: 0.96, dHvapKJ: 29.4, evapRate: 0.1, coolDeltaC: -8, minPressureAtm: 0.02 }, descriptors: { polarity: 'moderate' }, optical: { absorptionBands: ['uv'], photoReactive: true, excitationMultiplier: 0.95, emissionColor: '#edfff0' } }),
  CCl4: normalizeMaterialProfile('CCl4', { states: { gas: { density: 0.31, miscibleGroup: 'gas', color: '#d7ead9' } }, thermal: { meltingPointC: -23, boilingPointC: 77, condensePointC: 69, heatCapacity: 0.86, dHvapKJ: 30.0, evapRate: 0.08, coolDeltaC: -7, minPressureAtm: 0.02 }, descriptors: { polarity: 'nonpolar' }, optical: { absorptionBands: ['uv'], photoReactive: true, excitationMultiplier: 0.92, emissionColor: '#efffef' } }),
  O3: normalizeMaterialProfile('O3', { states: { liquid: { density: 1.6, miscibleGroup: 'cryogenic', color: '#ef9fa8' } }, thermal: { meltingPointC: -192, boilingPointC: -112, condensePointC: -118, decompositionPointC: 140, heatCapacity: 0.92 }, descriptors: { polarity: 'polar' }, optical: { absorptionBands: ['visible', 'uv'], photoReactive: true, excitationMultiplier: 1.18, emissionColor: '#ffd5d5' } }),
  NaHCO3: normalizeMaterialProfile('NaHCO3', { thermal: { meltingPointC: 50, decompositionPointC: 80, heatCapacity: 0.95 }, descriptors: { polarity: 'ionic', vaporLevel: 0, condensationLevel: 0 }, aqueous: { role: 'buffer', pH: 8.3, electrolyte: 'moderate', ionProfile: { ions: { 'Na+': 1, 'HCO3-': 1 }, strength: 'buffer' } }, solubility: { solventGroup: 'water', dissolvedDensity: 1.06, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.08, precipitateRate: 0.025 }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.42, emissionColor: '#f6ffe9' } }),
  Na2CO3: normalizeMaterialProfile('Na2CO3', { thermal: { meltingPointC: 851, decompositionPointC: 851, heatCapacity: 1.1 }, descriptors: { polarity: 'ionic', vaporLevel: 0, condensationLevel: 0 }, aqueous: { role: 'basic-salt', pH: 11.3, electrolyte: 'strong', ionProfile: { ions: { 'Na+': 2, 'CO3^2-': 1 }, strength: 'basic-salt' } }, solubility: { solventGroup: 'water', dissolvedDensity: 1.09, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.08, precipitateRate: 0.025 }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.4, emissionColor: '#f5ffe4' } }),
  NaC2H3O2: normalizeMaterialProfile('NaC2H3O2', { thermal: { meltingPointC: 324, heatCapacity: 1.15 }, descriptors: { polarity: 'ionic', vaporLevel: 0, condensationLevel: 0 }, aqueous: { role: 'basic-salt', pH: 8.9, electrolyte: 'strong', ionProfile: { ions: { 'Na+': 1, 'CH3COO-': 1 }, strength: 'basic-salt' } }, solubility: { solventGroup: 'water', dissolvedDensity: 1.04, nearRadius: 120, requiredNeighbors: 2, dissolveRate: 0.07, precipitateRate: 0.025 }, optical: { absorptionBands: ['uv'], excitationMultiplier: 0.4, emissionColor: '#f4ffe0' } }),
  'atom-H': normalizeMaterialProfile('atom-H', { thermal: { meltingPointC: -259, boilingPointC: -253, condensePointC: -259, heatCapacity: 14.3 }, descriptors: { polarity: 'radical' }, optical: { absorptionBands: ['visible', 'uv'], photoReactive: true, excitationMultiplier: 1.15 } }),
  'atom-N': normalizeMaterialProfile('atom-N', { thermal: { meltingPointC: -210, boilingPointC: -196, condensePointC: -201, heatCapacity: 1.04 }, descriptors: { polarity: 'radical' }, optical: { absorptionBands: ['visible', 'uv'], photoReactive: true, excitationMultiplier: 1.05 } }),
  'atom-O': normalizeMaterialProfile('atom-O', { thermal: { meltingPointC: -219, boilingPointC: -183, condensePointC: -188, heatCapacity: 0.92 }, descriptors: { polarity: 'radical' }, optical: { absorptionBands: ['visible', 'uv'], photoReactive: true, excitationMultiplier: 1.18 } }),
  'atom-C': normalizeMaterialProfile('atom-C', { thermal: { meltingPointC: 3550, heatCapacity: 0.71 }, descriptors: { polarity: 'network-solid', vaporLevel: 0, condensationLevel: 0 }, optical: { absorptionBands: ['visible', 'uv'], excitationMultiplier: 0.8 } }),
  'atom-Cl': normalizeMaterialProfile('atom-Cl', { thermal: { meltingPointC: -101, boilingPointC: -34, condensePointC: -39, heatCapacity: 0.48 }, descriptors: { polarity: 'radical' }, optical: { absorptionBands: ['visible', 'uv'], photoReactive: true, excitationMultiplier: 1.32, emissionColor: '#d9ffd0' } }),
  'atom-Na': normalizeMaterialProfile('atom-Na', { thermal: { meltingPointC: 98, boilingPointC: 883, heatCapacity: 1.23 }, descriptors: { polarity: 'metallic', vaporLevel: 0, condensationLevel: 0 }, aqueous: { role: 'metal' }, optical: { absorptionBands: ['visible', 'uv'], excitationMultiplier: 0.7 } })
};

function getMaterialConditions(type) {
  return MATERIAL_CONDITIONS[type] || normalizeMaterialProfile(type);
}

function getMaterialState(type, phase = getMaterialConditions(type).defaultPhase) {
  const profile = getMaterialConditions(type);
  return profile.states[phase] || (phase === 'particle' ? profile.states.solid : null) || null;
}

function getMaterialOpticalProfile(type) {
  return getMaterialConditions(type).optical;
}

function getMaterialLightResponse(type, bandId) {
  const optical = getMaterialOpticalProfile(type);
  const band = getLightBand(bandId);
  let absorption = optical.absorptionBands.includes(band.id) ? 1 : 0.12;
  if (!optical.absorptionBands.includes(band.id) && band.photochemical && optical.photoReactive) absorption = 0.45;
  if (!optical.absorptionBands.includes(band.id) && band.id === 'visible' && optical.emittedBand === 'visible') absorption = Math.max(absorption, 0.35);
  return {
    absorption,
    excitationMultiplier: optical.excitationMultiplier || 1,
    emissionColor: optical.emissionColor || band.color,
    lightToHeatFactor: optical.lightToHeatFactor || 0.12,
    photoReactive: !!optical.photoReactive,
    emittedBand: optical.emittedBand || 'visible'
  };
}
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
const EVAPORATION_CONFIG = Object.fromEntries(
  Object.entries(MATERIAL_CONDITIONS)
    .filter(([, profile]) => profile.states.gas && profile.states.liquid && Number.isFinite(profile.thermal.boilingPointC))
    .map(([type, profile]) => [
      type,
      {
        boilC: profile.thermal.boilingPointC,
        condenseC: Number.isFinite(profile.thermal.condensePointC) ? profile.thermal.condensePointC : profile.thermal.boilingPointC - 8,
        gasDensity: profile.states.gas.density,
        gasMiscibleGroup: profile.states.gas.miscibleGroup,
        liquidDensity: profile.states.liquid.density,
        liquidMiscibleGroup: profile.states.liquid.miscibleGroup,
        evapRate: profile.thermal.evapRate,
        coolDeltaC: profile.thermal.coolDeltaC,
        dHvapKJ: profile.thermal.dHvapKJ,
        minPressureAtm: profile.thermal.minPressureAtm
      }
    ])
);
const AQUEOUS_ION_PROFILES = Object.fromEntries(
  Object.entries(MATERIAL_CONDITIONS)
    .filter(([, profile]) => profile.aqueous.ionProfile)
    .map(([type, profile]) => [type, profile.aqueous.ionProfile])
);
const WEAK_AQUEOUS_ACIDS = Object.fromEntries(
  Object.entries(MATERIAL_CONDITIONS)
    .filter(([, profile]) => profile.aqueous.weakAcid)
    .map(([type, profile]) => [type, profile.aqueous.weakAcid])
);
const DISSOLUTION_CONFIG = Object.fromEntries(
  Object.entries(MATERIAL_CONDITIONS)
    .filter(([, profile]) => profile.solubility.solventGroup && profile.solubility.dissolveRate > 0)
    .map(([type, profile]) => [
      type,
      {
        solventGroup: profile.solubility.solventGroup,
        dissolvedDensity: profile.solubility.dissolvedDensity,
        nearRadius: profile.solubility.nearRadius,
        requiredNeighbors: profile.solubility.requiredNeighbors,
        dissolveRate: profile.solubility.dissolveRate,
        precipitateRate: profile.solubility.precipitateRate,
        sourcePhases: profile.solubility.sourcePhases
      }
    ])
);
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
    O2: 'Participates in scripted combustion and radical oxygen rules.',
    H2O2: 'Included for decomposition chemistry and related demonstrations.',
    Cl2: 'Participates in scripted hydrogen chlorination.',
    HCl: 'Scripted hydrogen chloride product.',
    HOCl: 'Hypochlorous acid formed from chlorine and water in the aqueous rule set.',
    HClO2: 'Available for reference but not formed by the school-safe scripted rules.',
    HClO3: 'Available for reference but not formed by the school-safe scripted rules.',
    HClO4: 'Available for reference but not formed by the school-safe scripted rules.',
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
      conditions: { tempMinC: -5, tempMaxC: 120, proximity: 145, phase: 'liquid' },
      kinetics: { progressPerSecond: 0.55, contactThreshold: 0.95, decayPerSecond: 1.2, drift: 0.05 },
      thermalDeltaC: 22,
      displayEquation: 'Cl2 + H2O -> HOCl + HCl',
      note: 'Aqueous equilibrium-style chlorine hydrolysis in water.'
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
      id: 'ozone_formation',
      name: 'Ozone Formation',
      reactants: [{ type: 'O2', count: 1 }, { type: 'atom-O', count: 1 }],
      products: [{ type: 'O3', count: 1 }],
      conditions: { tempMinC: -40, tempMaxC: 700, proximity: 95 },
      kinetics: { progressPerSecond: 0.8, contactThreshold: 0.6, decayPerSecond: 1.5, drift: 0.03 },
      thermalDeltaC: -24,
      displayEquation: 'O2 + O -> O3',
      note: 'Radical oxygen chemistry; real ozone formation also needs collisional energy transfer.'
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
  if (w <= 560) {
    const margin = 12;
    const topHud = Math.min(h * 0.42, 350);
    const bottomHud = Math.min(h * 0.28, 220);
    const gap = 12;
    const x = margin;
    const y = margin + topHud + gap;
    return {
      x,
      y,
      w: Math.max(220, w - margin * 2),
      h: Math.max(150, h - y - bottomHud - margin - gap)
    };
  }

  if (w <= 820) {
    const margin = 12;
    const topHud = Math.min(h * 0.46, 430);
    const bottomHud = Math.min(h * 0.34, 284);
    const gap = 12;
    const x = margin;
    const y = margin + topHud + gap;
    return {
      x,
      y,
      w: Math.max(240, w - margin * 2),
      h: Math.max(170, h - y - bottomHud - margin - gap)
    };
  }

  if (w <= 1100) {
    const margin = 14;
    const sideW = Math.min(340, Math.max(280, w * 0.38));
    const bottomH = Math.min(h * 0.28, 216);
    const x = margin + sideW + 16;
    return {
      x,
      y: margin,
      w: Math.max(260, w - x - margin),
      h: Math.max(220, h - bottomH - margin * 2 - 12)
    };
  }

  const margin = 14;
  const sideW = Math.min(360, Math.max(320, w * 0.25));
  const rightPanelW = Math.min(340, Math.max(300, w * 0.24));

  return {
    x: margin + sideW + 18,
    y: margin,
    w: Math.max(300, w - sideW - rightPanelW - margin * 2 - 18),
    h: Math.max(240, h - margin * 2)
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
  const material = getMaterialConditions(type);
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
    phase: material.defaultPhase,
    density: getMaterialState(type, material.defaultPhase)?.density ?? spec.density,
    miscibleGroup: getMaterialState(type, material.defaultPhase)?.miscibleGroup ?? spec.miscibleGroup,
    nativePhase: material.defaultPhase,
    color: getMaterialState(type, material.defaultPhase)?.color ?? spec.color,
    formula: spec.formula,
    atoms,
    bonds: spec.bonds.map(b => ({ age: 45, strain: 0, core: true, ...b, rest: b.rest * layoutScale })),
    angleConstraints: (spec.angleConstraints || []).map(a => ({ ...a })),
    shapeConstraints,
    dissolved: false,
    photoExcitation: 0,
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
  const atomType = `atom-${el}`;
  const material = getMaterialConditions(atomType);
  const atomPhase = material.defaultPhase;
  const atomDensity = getMaterialState(atomType, atomPhase)?.density ?? (atomPhase === 'gas' ? 0.12 : 0.5);
  const atomGroup = getMaterialState(atomType, atomPhase)?.miscibleGroup ?? (atomPhase === 'gas' ? 'gas' : 'particle');

  const mol = {
    id: nextMolId++,
    type: atomType,
    label: el,
    display: `${el} atom`,
    phase: atomPhase,
    density: atomDensity,
    miscibleGroup: atomGroup,
    nativePhase: atomPhase,
    color: getMaterialState(atomType, atomPhase)?.color ?? style.color,
    formula: el,
    photoExcitation: 0,
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
      excited: 0,
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
  const state = getMaterialState(mol.type, nextPhase);
  if (!state || mol.phase === nextPhase) return;

  mol.phase = nextPhase;
  mol.phaseChangedAt = world.time;
  mol.phaseLockUntil = world.time + 0.28;
  mol.density = state.density ?? mol.density;
  mol.miscibleGroup = state.miscibleGroup || mol.miscibleGroup;
  mol.color = state.color || mol.color;
  if (nextPhase === 'solid') {
    mol.layerSnap = {
      kind: 'solid-layer',
      status: 'pending',
      triggerAt: world.time + 0.72,
      duration: 0.28,
      fromX: null,
      fromY: null,
      toX: null,
      toY: null
    };
  } else {
    mol.layerSnap = null;
  }
}

function setMoleculeDissolvedState(mol, dissolved) {
  const config = DISSOLUTION_CONFIG[mol.type];
  if (!config) return;

  mol.dissolved = dissolved;
  mol.layerSnap = null;
  if (dissolved) {
    mol.phase = 'liquid';
    mol.density = config.dissolvedDensity;
    mol.miscibleGroup = config.solventGroup;
  } else {
    const nativePhase = mol.nativePhase || getMaterialConditions(mol.type).defaultPhase || 'particle';
    const state = getMaterialState(mol.type, nativePhase);
    mol.phase = nativePhase;
    mol.density = state?.density ?? SPECIES[mol.type]?.density ?? mol.density;
    mol.miscibleGroup = state?.miscibleGroup || SPECIES[mol.type]?.miscibleGroup || mol.miscibleGroup;
    mol.color = state?.color || SPECIES[mol.type]?.color || mol.color;
  }
}

function getLiquidWaterMolecules() {
  return world.molecules.filter(m => m.alive && m.type === 'H2O' && m.phase === 'liquid');
}

function hasLiquidWaterSolvent() {
  return getLiquidWaterMolecules().length > 0;
}

function isWaterPhaseMolecule(mol) {
  if (!mol?.alive || mol.phase !== 'liquid') return false;
  if (mol.type === 'H2O') return true;
  if (!hasLiquidWaterSolvent()) return false;
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

function buildLiquidChemistrySnapshot(liquids, options = {}) {
  if (!liquids.length) return null;
  const speciesCounts = {};
  const ionCounts = {};
  let waterCount = 0;
  let acidUnits = 0;
  let baseUnits = 0;
  let conductivity = 0;

  for (const mol of liquids) {
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
  const totalCount = liquids.length;
  const waterFraction = totalCount > 0 ? waterCount / totalCount : 0;
  const allowPH = options.forcePH || waterFraction >= 0.22;
  const pH = allowPH
    ? clamp(7 + Math.sign(delta) * Math.log10(1 + Math.abs(delta) * 42) * 3.15, 0, 14)
    : null;
  const majorIons = Object.entries(ionCounts)
    .filter(([, count]) => count >= 0.4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([ion, count]) => ({ ion, count }));
  const acidityStrength = Math.abs(delta);
  let acidityLabel = 'near-neutral';
  if (delta <= -1.8) acidityLabel = 'strongly acidic';
  else if (delta <= -0.9) acidityLabel = 'acidic';
  else if (delta <= -0.3) acidityLabel = 'slightly acidic';
  else if (delta >= 1.8) acidityLabel = 'strongly basic';
  else if (delta >= 0.9) acidityLabel = 'basic';
  else if (delta >= 0.3) acidityLabel = 'slightly basic';
  if (acidityStrength < 0.08) acidityLabel = 'near-neutral';

  return {
    aqueousCount: liquids.length,
    waterCount,
    waterFraction,
    speciesCounts,
    dissolvedTypes,
    ionCounts,
    majorIons,
    conductivity,
    acidity: acidUnits,
    basicity: baseUnits,
    pH,
    hasPH: pH != null,
    acidityLabel,
    chemistryLabel: pH != null ? `pH ${pH.toFixed(1)}` : acidityLabel,
    isCarbonated: (speciesCounts.CO2 || 0) > 0
  };
}

function getWaterChemistrySnapshot() {
  const aqueous = world.molecules.filter(isWaterPhaseMolecule);
  if (!aqueous.length) return null;
  return buildLiquidChemistrySnapshot(aqueous, { forcePH: true });
}

function clearWorld() {
  world.molecules = [];
  world.stats.reactions = 0;
  world.selectedMolId = null;
  world.pressureAtm = 1;
  world.heatPulseC = 0;
  world.stirring.timeLeft = 0;
  world.stirring.power = 0;
  world.light.timeLeft = 0;
  world.light.firing = false;
  world.light.pointerId = null;
  world.light.source = null;
  world.light.target = null;
  world.light.power = 0;
  world.light.rays = [];
  world.thermalEvents = [];
  world.thermalStats.addedC = 0;
  world.thermalStats.removedC = 0;
  world.layout.condensedHeight = 0;
  world.layout.surfaceY = null;
  addReactionLog('system', 'Sandbox cleared');
  if (typeof updateThermalLabels === 'function') {
    updateThermalLabels();
  }
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

function shiftMoleculeCenterTo(mol, x, y, velocityScale = 0.32) {
  const center = moleculeCenter(mol);
  const dx = x - center.x;
  const dy = y - center.y;
  for (const atom of mol.atoms) {
    atom.x += dx;
    atom.y += dy;
    atom.vx *= velocityScale;
    atom.vy *= velocityScale;
  }
}

function getSolidLayerAnchor(mol, layer, bounds = world.bounds) {
  if (!layer || !bounds) return null;

  const solidMembers = (layer.solidMembers || [])
    .filter(entry => entry.alive && entry.phase === 'solid')
    .sort((a, b) => a.id - b.id);
  if (!solidMembers.length) return null;

  const index = solidMembers.findIndex(entry => entry.id === mol.id);
  if (index === -1) return null;

  const radius = moleculeRadius(mol);
  const slotRadius = Math.max(radius, layer.maxSolidRadius || radius);
  const minGapX = Math.max(28, slotRadius * 2.5);
  const minGapY = Math.max(22, slotRadius * 2.0);
  const xPadding = slotRadius + 16;
  const yPadding = Math.max(8, Math.min(layer.h * 0.16, slotRadius * 0.55));
  const minX = bounds.x + xPadding;
  const maxX = bounds.x + bounds.w - xPadding;
  const minY = layer.y + yPadding;
  const maxY = layer.y + layer.h - yPadding;
  const spanX = Math.max(0, maxX - minX);
  const spanY = Math.max(0, maxY - minY);
  const count = solidMembers.length;

  const maxRows = Math.max(1, Math.floor(spanY / minGapY) + 1);
  const maxCols = Math.max(1, Math.floor(spanX / minGapX) + 1);
  let rows = Math.min(count, maxRows);
  let cols = Math.max(1, Math.ceil(count / rows));
  if (cols > maxCols) {
    cols = maxCols;
    rows = Math.max(1, Math.ceil(count / cols));
  }

  const row = Math.floor(index / cols);
  const col = index % cols;
  const rowCount = Math.min(cols, count - row * cols);
  const xProgress = rowCount <= 1 ? 0.5 : col / (rowCount - 1);
  const yProgress = rows <= 1 ? 0.5 : row / (rows - 1);
  const jitterX = (Math.sin(mol.id * 12.9898 + row * 5.19) * 0.5 + 0.5) - 0.5;
  const jitterY = (Math.sin(mol.id * 7.153 + col * 3.71) * 0.5 + 0.5) - 0.5;
  const xNudge = jitterX * Math.min(12, minGapX * 0.18);
  const yNudge = jitterY * Math.min(8, minGapY * 0.16);

  return {
    x: spanX > 0 ? clamp(minX + spanX * (0.08 + xProgress * 0.84) + xNudge, minX, maxX) : minX,
    y: spanY > 0 ? clamp(minY + spanY * (0.16 + yProgress * 0.68) + yNudge, minY, maxY) : minY
  };
}

function getSolidLayerSnapTarget(mol, layer, bounds = world.bounds) {
  const anchor = getSolidLayerAnchor(mol, layer, bounds);
  if (anchor) return anchor;
  if (!layer || !bounds) return null;
  return { x: bounds.x + bounds.w * 0.5, y: layer.centerY };
}

function solidLayerSnapOffset(mol, layer) {
  if (!layer) return 0;
  const center = moleculeCenter(mol);
  const radius = moleculeRadius(mol);
  const margin = Math.max(18, Math.min(38, radius * 0.95));
  if (center.y < layer.y - margin) return center.y - (layer.y - margin);
  if (center.y > layer.y + layer.h + margin) return center.y - (layer.y + layer.h + margin);
  return 0;
}

function updateSolidLayerSnapAnimations(dt, liquidLayout) {
  if (!world.bounds || !liquidLayout?.layers?.length) return;

  for (const mol of world.molecules) {
    const snap = mol.layerSnap;
    if (!snap) continue;

    if (!mol.alive || mol.phase !== 'solid') {
      mol.layerSnap = null;
      continue;
    }

    if (world.dragging.mol?.id === mol.id) continue;

    const layer = liquidLayout.layers.find(entry => entry.layerKey === getLiquidLayerKey(mol));
    if (!layer) continue;

    const offset = solidLayerSnapOffset(mol, layer);
    if (snap.status === 'pending') {
      if (Math.abs(offset) < 1) {
        mol.layerSnap = null;
        continue;
      }
      if (world.time < snap.triggerAt) continue;
      const target = getSolidLayerSnapTarget(mol, layer);
      if (!target) continue;
      mol.layerSnap = {
        ...snap,
        status: 'active',
        startedAt: world.time,
        fromX: moleculeCenter(mol).x,
        fromY: moleculeCenter(mol).y,
        toX: target.x,
        toY: target.y
      };
      continue;
    }

    if (snap.status !== 'active') continue;

    const target = getSolidLayerSnapTarget(mol, layer);
    if (!target) {
      mol.layerSnap = null;
      continue;
    }

    snap.toX = target.x;
    snap.toY = target.y;

    const progress = clamp((world.time - snap.startedAt) / Math.max(0.001, snap.duration || 0.28), 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const nextX = snap.fromX + (snap.toX - snap.fromX) * eased;
    const nextY = snap.fromY + (snap.toY - snap.fromY) * eased;
    shiftMoleculeCenterTo(mol, nextX, nextY, 0.14);

    for (const atom of mol.atoms) {
      atom.vx *= 0.35;
      atom.vy *= 0.35;
      atom.vy += clamp(-offset * 0.0015, -0.12, 0.12) * dt * 60;
    }

    if (progress >= 1) {
      shiftMoleculeCenterTo(mol, snap.toX, snap.toY, 0.08);
      mol.layerSnap = null;
    }
  }
}

function getLiquidLayerKey(mol) {
  if (mol.type === 'H2O' && mol.phase === 'liquid') return 'water';
  if (mol.dissolved) {
    const solventGroup = DISSOLUTION_CONFIG[mol.type]?.solventGroup;
    if (solventGroup === 'water' && !hasLiquidWaterSolvent()) return mol.type;
    return solventGroup || mol.miscibleGroup || mol.type;
  }
  return mol.type;
}

function getLiquidLayerLayout() {
  const b = world.bounds;
  if (!b) return { surfaceY: null, liquidHeight: 0, layers: [] };
  const waterChemistry = getWaterChemistrySnapshot();

  const liquids = world.molecules.filter(m => m.alive && m.phase === 'liquid');
  const condensed = world.molecules.filter(m => m.alive && (m.phase === 'liquid' || m.phase === 'solid'));
  const groups = {};

  for (const mol of condensed) {
    const key = getLiquidLayerKey(mol);
    if (!groups[key]) groups[key] = [];
    groups[key].push(mol);
  }

  const layers = Object.entries(groups)
    .map(([layerKey, arr]) => {
      const sample = arr[0];
      const liquidMembers = arr.filter(mol => mol.phase === 'liquid');
      const preferredType = layerKey === 'water'
        ? 'H2O'
        : sample.type;
      const spec = SPECIES[preferredType] || SPECIES[sample.type] || sample;
      const dissolvedCounts = {};
      for (const mol of liquidMembers) {
        if (!mol.dissolved) continue;
        dissolvedCounts[mol.type] = (dissolvedCounts[mol.type] || 0) + 1;
      }
      const dissolvedTypes = Object.keys(dissolvedCounts)
        .sort((a, b2) => dissolvedCounts[b2] - dissolvedCounts[a]);
      const allSolid = arr.every(mol => mol.phase === 'solid');
      const allLiquid = arr.every(mol => mol.phase === 'liquid');
      const averageDensity = arr.reduce((sum, mol) => sum + (mol.density || 1), 0) / Math.max(1, arr.length);
      const solidMembers = arr
        .filter(mol => mol.phase === 'solid')
        .sort((a, b2) => a.id - b2.id);
      const maxSolidRadius = solidMembers.reduce((max, mol) => Math.max(max, moleculeRadius(mol)), 0);
      const boilType = layerKey === 'water' ? 'H2O' : sample.type;
      const boilPointC = liquidMembers.length && EVAPORATION_CONFIG[boilType]
        ? getPressureAdjustedBoilingPointC(boilType, world.pressureAtm)
        : null;
      const boilingIntensity = Number.isFinite(boilPointC)
        ? clamp((getEffectiveTemperatureC() - boilPointC + 4) / 24, 0, 1.35)
        : 0;
      return {
        layerKey,
        count: arr.length,
        liquidCount: liquidMembers.length,
        solidCount: arr.length - liquidMembers.length,
        density: averageDensity || sample?.density || spec?.density || 1.0,
        color: spec?.color || sample?.color || '#9bbcff',
        dissolvedTypes,
        solidMembers,
        maxSolidRadius,
        phaseTag: allSolid ? 'solid' : (allLiquid ? (layerKey === 'water' ? 'aqueous' : 'liquid') : 'condensed'),
        boilingIntensity,
        chemistry: liquidMembers.length
          ? (layerKey === 'water' ? waterChemistry : buildLiquidChemistrySnapshot(liquidMembers))
          : null
      };
    })
    .sort((a, b2) => a.density - b2.density);

  const condensedTargetHeight = Math.min(b.h * 0.7, condensed.length * 13);
  const prevCondensedHeight = world.layout?.condensedHeight || 0;
  const condensedHeight = condensedTargetHeight <= 0.5
    ? 0
    : prevCondensedHeight + (condensedTargetHeight - prevCondensedHeight) * 0.18;
  const surfaceY = condensedHeight > 0 ? b.y + b.h - condensedHeight : null;

  world.layout.condensedHeight = condensedHeight;
  world.layout.surfaceY = surfaceY;

  if (!layers.length) return { surfaceY, liquidHeight: 0, condensedHeight, layers: [] };

  const total = layers.reduce((sum, layer) => sum + layer.count, 0);
  const liquidHeight = condensedHeight > 0
    ? condensedHeight * clamp(liquids.length / Math.max(1, condensed.length), 0, 1)
    : Math.min(b.h * 0.7, total * 13);
  let y = surfaceY != null ? surfaceY : (b.y + b.h - condensedHeight);

  for (const layer of layers) {
    const h = condensedHeight > 0
      ? condensedHeight * (layer.count / total)
      : Math.min(b.h * 0.7, total * 13) * (layer.count / total);
    layer.y = y;
    layer.h = h;
    layer.centerY = y + h * 0.5;
    y += h;
  }

  return {
    surfaceY,
    liquidHeight,
    condensedHeight,
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
  let targetX = null;
  let targetY = null;
  let softRange = null;

  if (mol.phase === 'liquid' || mol.phase === 'solid') {
    const layer = liquidLayout.layers.find(entry => entry.layerKey === getLiquidLayerKey(mol));
    if (layer) {
      const anchor = mol.phase === 'solid' ? getSolidLayerAnchor(mol, layer, b) : null;
      targetX = anchor?.x ?? null;
      targetY = anchor?.y ?? layer.centerY;
      softRange = {
        min: layer.y - Math.max(mol.phase === 'solid' ? 10 : 18, layer.h * (mol.phase === 'solid' ? 0.22 : 0.35)),
        max: layer.y + layer.h + Math.max(mol.phase === 'solid' ? 10 : 18, layer.h * (mol.phase === 'solid' ? 0.22 : 0.35))
      };
    } else if (mol.phase === 'liquid' && liquidLayout.surfaceY != null) {
      minAllowedY = liquidLayout.surfaceY + radius;
    } else if (mol.phase === 'solid') {
      targetY = bottom - Math.max(radius + 10, b.h * 0.10);
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
  } else if (mol.phase === 'particle') {
    minAllowedY = top;
    maxAllowedY = bottom;
    targetY = bottom - Math.max(radius + 10, b.h * 0.10);
  }

  if (targetY != null && Number.isFinite(targetY)) {
    let pullScale = 0.0035;
    if ((mol.phase === 'liquid' || mol.phase === 'solid') && softRange) {
      const overshootTop = Math.max(0, softRange.min - center.y);
      const overshootBottom = Math.max(0, center.y - softRange.max);
      const overshoot = overshootTop + overshootBottom;
      if (mol.phase === 'solid') {
        pullScale = overshoot > 0
          ? (0.007 + overshoot * 0.00022)
          : 0.0014;
      } else {
        pullScale = overshoot > 0
          ? (0.006 + overshoot * 0.00018)
          : 0.0011;
      }
    } else if (mol.phase === 'solid') {
      pullScale = 0.0085;
    } else if (mol.phase === 'particle') {
      pullScale = 0.0055;
    }

    const pull = (targetY - center.y) * pullScale * dt * 60;
    for (const atom of mol.atoms) {
      atom.vy += pull;
    }
  }

  if (targetX != null && Number.isFinite(targetX)) {
    const pullX = (targetX - center.x) * 0.0022 * dt * 60;
    for (const atom of mol.atoms) {
      atom.vx += pullX;
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
