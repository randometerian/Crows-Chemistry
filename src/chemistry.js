function usedValence(mol, atomIndex) {
  let used = 0;
  for (const bond of mol.bonds) {
    if (bond.a === atomIndex || bond.b === atomIndex) used += bond.order || 1;
  }
  return used;
}

function getBondBetween(mol, idxA, idxB) {
  return mol.bonds.find(b =>
    (b.a === idxA && b.b === idxB) ||
    (b.a === idxB && b.b === idxA)
  ) || null;
}

function getElectronState(mol, atomIndex) {
  const atom = mol.atoms[atomIndex];
  const el = atom.el;
  const valenceElectrons = VALENCE_ELECTRONS[el] ?? 0;
  const preferredBonds = TARGET_VALENCE[el] ?? 0;
  const shellCapacity = SHELL_TARGET_ELECTRONS[el] ?? (valenceElectrons <= 2 ? 2 : 8);
  const bondOrder = usedValence(mol, atomIndex);
  const partialCharge = clamp(atom.charge || 0, -2, 2);
  const bondElectronsOwned = bondOrder;
  const nonbondingElectrons = clamp(
    Math.round(valenceElectrons - bondElectronsOwned - partialCharge),
    0,
    shellCapacity
  );
  const lonePairs = Math.floor(nonbondingElectrons / 2);
  const radicalElectrons = nonbondingElectrons % 2;
  const vacancies = Math.max(0, preferredBonds - bondOrder);
  const shellElectrons = clamp(bondOrder * 2 + nonbondingElectrons, 0, shellCapacity + 2);
  const shellFill = clamp(shellElectrons / Math.max(1, shellCapacity), 0, 1.25);
  const donorStrength = lonePairs + radicalElectrons * 1.35 + clamp(-partialCharge, 0, 2) * 0.9;
  const acceptorStrength = vacancies + clamp(partialCharge, 0, 2) * 0.85;
  const electronPressure = vacancies * 0.95 + radicalElectrons * 1.25 + Math.abs(partialCharge) * 0.35;
  const closedShell = vacancies === 0 && radicalElectrons === 0 && shellFill >= 0.95;

  return {
    el,
    valenceElectrons,
    preferredBonds,
    shellCapacity,
    bondOrder,
    nonbondingElectrons,
    lonePairs,
    radicalElectrons,
    vacancies,
    shellElectrons,
    shellFill,
    donorStrength,
    acceptorStrength,
    electronPressure,
    closedShell
  };
}

function projectedShellElectrons(mol, atomIndex, extraBondOrder = 0) {
  const state = getElectronState(mol, atomIndex);
  const bondOrder = state.bondOrder + extraBondOrder;
  const sharedElectrons = bondOrder * 2;
  const shellTarget = state.shellCapacity;
  return {
    el: state.el,
    sharedElectrons,
    shellTarget,
    overfilled: shellTarget > 0 && sharedElectrons > shellTarget
  };
}

function freeValence(mol, atomIndex) {
  return getElectronState(mol, atomIndex).vacancies;
}

function atomSaturation(mol, atomIndex) {
  return getElectronState(mol, atomIndex).shellFill;
}

function getLoneElectronCount(mol, atomIndex) {
  return Math.min(8, getElectronState(mol, atomIndex).nonbondingElectrons);
}

function moleculeSaturation(mol) {
  if (!mol || !mol.atoms || mol.atoms.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < mol.atoms.length; i++) {
    total += atomSaturation(mol, i);
  }
  return total / mol.atoms.length;
}

function bondNeighborhoodSupport(mol, bond) {
  const aNeighbors = mol.bonds.filter(b => (b.a === bond.a || b.b === bond.a) && b !== bond).length;
  const bNeighbors = mol.bonds.filter(b => (b.a === bond.b || b.b === bond.b) && b !== bond).length;
  return clamp((aNeighbors + bNeighbors) / 4, 0, 1.1);
}

function bondPolarity(elA, elB, ionic = false, order = 1) {
  const enA = ELECTRONEGATIVITY[elA] || 2;
  const enB = ELECTRONEGATIVITY[elB] || 2;
  const delta = clamp((enB - enA) / 2.6, -1, 1);
  const scale = ionic ? 0.9 : (0.16 + Math.abs(delta) * 0.30);
  return delta * scale * order;
}

function refreshMoleculeCharges(mol) {
  for (const atom of mol.atoms) atom.charge = 0;

  for (const bond of mol.bonds) {
    const a = mol.atoms[bond.a];
    const b = mol.atoms[bond.b];
    const shift = bondPolarity(a.el, b.el, !!bond.ionic, bond.order || 1);
    a.charge += shift;
    b.charge -= shift;
  }

  for (let i = 0; i < mol.atoms.length; i++) {
    const atom = mol.atoms[i];
    const missing = freeValence(mol, i);
    if (missing <= 0) continue;

    if (atom.el === 'Na') atom.charge += 0.18 * missing;
    if (atom.el === 'O' || atom.el === 'Cl') atom.charge -= 0.08 * missing;
    if (atom.el === 'H' && mol.atoms.length > 1) atom.charge += 0.04 * missing;
  }
}

function refreshAllCharges() {
  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    refreshMoleculeCharges(mol);
  }
}

function electrostaticPairBias(atomA, atomB) {
  const qProduct = atomA.charge * atomB.charge;
  return clamp((-qProduct * 3.8), -0.85, 1.8);
}

function atomReactivityScore(mol, atomIndex) {
  const atom = mol.atoms[atomIndex];
  const state = getElectronState(mol, atomIndex);
  const polarity = Math.abs(atom.charge || 0);
  let score = state.electronPressure + state.donorStrength * 0.22 + state.acceptorStrength * 0.24 + (1 - Math.min(1, state.shellFill)) * 0.6 + polarity * 0.65;
  if (mol.atoms.length === 1) score += 0.45;
  if (atom.el === 'Na' || atom.el === 'Cl' || atom.el === 'O') score += 0.08 * state.vacancies;
  return score;
}

function moleculeReactiveScore(mol) {
  let best = 0;
  for (let i = 0; i < mol.atoms.length; i++) {
    best = Math.max(best, atomReactivityScore(mol, i));
  }
  return best;
}

function isClosedShellMolecule(mol) {
  if (!mol || mol.atoms.length <= 1) return false;
  for (let i = 0; i < mol.atoms.length; i++) {
    if (!getElectronState(mol, i).closedShell) return false;
  }
  return moleculeSaturation(mol) >= 0.97;
}

function canPairFormBond(molA, idxA, molB, idxB, ambientTempC) {
  const a = molA.atoms[idxA];
  const b = molB.atoms[idxB];
  const stateA = getElectronState(molA, idxA);
  const stateB = getElectronState(molB, idxB);
  const pair = pairKey(a.el, b.el);
  const monoA = molA.atoms.length === 1;
  const monoB = molB.atoms.length === 1;
  const electronMatch =
    (stateA.acceptorStrength > 0.25 && stateB.donorStrength > 0.25) ||
    (stateB.acceptorStrength > 0.25 && stateA.donorStrength > 0.25) ||
    (stateA.radicalElectrons > 0 && stateB.radicalElectrons > 0);

  if (!electronMatch) return false;

  if (pair === 'H-H') return monoA && monoB;
  if (pair === 'Cl-Cl') return monoA && monoB;
  if (pair === 'O-O') {
    if (monoA && monoB) return true;
    return ambientTempC > 280 && (atomReactivityScore(molA, idxA) > 0.95 || atomReactivityScore(molB, idxB) > 0.95);
  }
  if (pair === 'C-C' && ambientTempC < 420) {
    return monoA && monoB;
  }
  return true;
}

function inferMetaFromAtoms(atoms) {
  const formula = formatFormulaFromAtoms(atoms);
  const preset = FORMULA_META[formula];
  if (preset) return { ...preset, formula, display: NAMED_FORMULAS[formula] || formula };

  const hasNa = atoms.some(a => a.el === 'Na');
  const hasO = atoms.some(a => a.el === 'O');
  const hasCl = atoms.some(a => a.el === 'Cl');
  const heavy = atoms.reduce((s, a) => s + (elementStyles[a.el]?.m || 12), 0) / Math.max(1, atoms.length);
  const phase = heavy > 22 ? 'liquid' : 'gas';
  const miscibleGroup = hasNa ? 'salt' : (hasO ? 'water' : (hasCl ? 'halogen' : 'organic-light'));
  return {
    formula,
    display: NAMED_FORMULAS[formula] || formula,
    phase,
    density: clamp(heavy / 12, 0.2, 2.6),
    miscibleGroup,
    color: averageElementColor(atoms)
  };
}

function reindexConstraints(constraints, mapOldToNew) {
  const out = [];
  for (const c of constraints) {
    if (mapOldToNew[c.center] == null || mapOldToNew[c.a] == null || mapOldToNew[c.b] == null) continue;
    out.push({
      center: mapOldToNew[c.center],
      a: mapOldToNew[c.a],
      b: mapOldToNew[c.b],
      angle: c.angle
    });
  }
  return out;
}

function rebuildMoleculeMeta(mol) {
  if (mol.atoms.length === 1) {
    const el = mol.atoms[0].el;
    mol.formula = el;
    mol.label = el;
    mol.display = `${el} atom`;
    mol.phase = 'particle';
    mol.density = 0.5;
    mol.miscibleGroup = 'particle';
    mol.color = elementStyles[el]?.color || '#9bbcff';
    mol.type = `atom-${el}`;
    return;
  }
  const meta = inferMetaFromAtoms(mol.atoms);
  mol.formula = prettyFormula(meta.formula);
  mol.display = meta.display;
  mol.label = prettyFormula(meta.formula);
  mol.phase = meta.phase;
  mol.density = meta.density;
  mol.miscibleGroup = meta.miscibleGroup;
  mol.color = meta.color;
  mol.type = `dyn-${meta.formula}`;
}

function splitDisconnectedMolecule(mol) {
  if (mol.atoms.length <= 1 || mol.bonds.length === 0) {
    rebuildMoleculeMeta(mol);
    return [mol];
  }

  const adj = mol.atoms.map(() => []);
  for (const b of mol.bonds) {
    adj[b.a].push(b.b);
    adj[b.b].push(b.a);
  }

  const seen = new Array(mol.atoms.length).fill(false);
  const components = [];
  for (let i = 0; i < mol.atoms.length; i++) {
    if (seen[i]) continue;
    const stack = [i];
    seen[i] = true;
    const comp = [];
    while (stack.length) {
      const cur = stack.pop();
      comp.push(cur);
      for (const n of adj[cur]) {
        if (!seen[n]) {
          seen[n] = true;
          stack.push(n);
        }
      }
    }
    components.push(comp);
  }

  if (components.length === 1) {
    rebuildMoleculeMeta(mol);
    return [mol];
  }

  const produced = [];
  for (const comp of components) {
    const mapOldToNew = {};
    const atoms = comp.map((oldIdx, newIdx) => {
      mapOldToNew[oldIdx] = newIdx;
      return mol.atoms[oldIdx];
    });
    const bonds = mol.bonds
      .filter(b => mapOldToNew[b.a] != null && mapOldToNew[b.b] != null)
      .map(b => ({ ...b, a: mapOldToNew[b.a], b: mapOldToNew[b.b] }));
    const angleConstraints = reindexConstraints(mol.angleConstraints || [], mapOldToNew);

    const newMol = {
      id: nextMolId++,
      type: 'dynamic',
      label: '',
      display: '',
      phase: 'particle',
      density: 0.8,
      miscibleGroup: 'particle',
      color: '#9bbcff',
      formula: '',
      atoms,
      bonds,
      angleConstraints,
      alive: true
    };
    rebuildMoleculeMeta(newMol);
    produced.push(newMol);
  }

  mol.alive = false;
  world.molecules.push(...produced);
  return produced;
}

function mergeMoleculesWithBond(molA, idxA, molB, idxB, order = 1, ionic = false) {
  if (!molA.alive || !molB.alive || molA.id === molB.id) return null;
  const beforeA = plainFormula(molA.formula);
  const beforeB = plainFormula(molB.formula);

  const offset = molA.atoms.length;
  const atoms = [...molA.atoms, ...molB.atoms];
  const bonds = [
    ...molA.bonds.map(b => ({ ...b })),
    ...molB.bonds.map(b => ({ ...b, a: b.a + offset, b: b.b + offset })),
    {
      a: idxA,
      b: idxB + offset,
      order,
      rest: BOND_REST[pairKey(molA.atoms[idxA].el, molB.atoms[idxB].el)] || (28 + Math.random() * 5),
      age: 0,
      strain: 0,
      ionic
    }
  ];
  const angleConstraints = [
    ...(molA.angleConstraints || []).map(a => ({ ...a })),
    ...(molB.angleConstraints || []).map(a => ({ ...a, center: a.center + offset, a: a.a + offset, b: a.b + offset }))
  ];

  if (ionic) {
    atoms[idxA].charge = atoms[idxA].charge || 0;
    atoms[idxB + offset].charge = atoms[idxB + offset].charge || 0;
    if (atoms[idxA].el === 'Na') atoms[idxA].charge = +1;
    if (atoms[idxB + offset].el === 'Na') atoms[idxB + offset].charge = +1;
    if (atoms[idxA].el === 'Cl' || atoms[idxA].el === 'O') atoms[idxA].charge = -1;
    if (atoms[idxB + offset].el === 'Cl' || atoms[idxB + offset].el === 'O') atoms[idxB + offset].charge = -1;
  }

  const merged = {
    id: nextMolId++,
    type: 'dynamic',
    label: '',
    display: '',
    phase: 'particle',
    density: 0.8,
    miscibleGroup: 'particle',
    color: '#9bbcff',
    formula: '',
    atoms,
    bonds,
    angleConstraints,
    alive: true
  };
  rebuildMoleculeMeta(merged);
  const formed = plainFormula(merged.formula);

  molA.alive = false;
  molB.alive = false;
  world.molecules.push(merged);
  world.stats.reactions += 1;
  const aEl = molA.atoms[idxA]?.el || '?';
  const bEl = molB.atoms[idxB]?.el || '?';
  addReactionLog(
    'form-bond',
    `${beforeA} + ${beforeB} -> ${formed} (${aEl}-${bEl}${order > 1 ? ` order ${order}` : ''}${ionic ? ', ionic' : ''})`
  );
  markSidebarDirty();
  return merged;
}

function canAttemptBond(molA, idxA, molB, idxB, ambientTempC) {
  const a = molA.atoms[idxA];
  const b = molB.atoms[idxB];
  const stateA = getElectronState(molA, idxA);
  const stateB = getElectronState(molB, idxB);
  const reactiveA = atomReactivityScore(molA, idxA);
  const reactiveB = atomReactivityScore(molB, idxB);
  const molReactiveA = moleculeReactiveScore(molA);
  const molReactiveB = moleculeReactiveScore(molB);

  if (stateA.vacancies <= 0 && stateA.radicalElectrons === 0 && stateA.acceptorStrength < 0.2) return false;
  if (stateB.vacancies <= 0 && stateB.radicalElectrons === 0 && stateB.acceptorStrength < 0.2) return false;
  if (a.el === 'Na' && b.el === 'Na') return false;
  if ((a.el === 'Na' || b.el === 'Na') && !(['Cl', 'O'].includes(a.el) && ['Cl', 'O'].includes(b.el))) return false;
  if (!canPairFormBond(molA, idxA, molB, idxB, ambientTempC)) return false;
  if (a.el === 'C' && b.el === 'C' && ambientTempC < 650) {
    const monoA = molA.atoms.length === 1 && molA.type === 'atom-C';
    const monoB = molB.atoms.length === 1 && molB.type === 'atom-C';
    if (!(monoA && monoB)) return false;
  }
  if (
    ambientTempC < 260 &&
    isClosedShellMolecule(molA) &&
    isClosedShellMolecule(molB) &&
    molReactiveA < 0.82 &&
    molReactiveB < 0.82
  ) return false;
  if (
    molA.atoms.length > 2 &&
    molB.atoms.length > 2 &&
    reactiveA < 1.15 &&
    reactiveB < 1.15 &&
    ambientTempC < 520
  ) return false;
  if (projectedShellElectrons(molA, idxA, 1).overfilled || projectedShellElectrons(molB, idxB, 1).overfilled) return false;
  const dEN = Math.abs((ELECTRONEGATIVITY[a.el] || 2) - (ELECTRONEGATIVITY[b.el] || 2));
  if (dEN > 2.4 && !(a.el === 'Na' || b.el === 'Na')) return false;
  return true;
}

function runValenceChemistry(ambientTempC, ambientHeat, dt) {
  let changed = false;
  const tempK = cToK(ambientTempC);
  const atoms = [];
  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    for (let i = 0; i < mol.atoms.length; i++) atoms.push({ mol, idx: i, atom: mol.atoms[i] });
  }

  const formationScale = clamp(0.72 + ambientHeat * 1.10, 0.65, 2.1);
  const coolBonus = ambientTempC < 250 ? 1.25 : 1.0;
  const hotPenalty = ambientTempC > 1800 ? 0.65 : 1.0;
  const formLimit = 4 + Math.floor(atoms.length / 35);
  let formedThisStep = 0;
  for (let i = 0; i < atoms.length; i++) {
    const A = atoms[i];
    if (!A.mol.alive) continue;
    for (let j = i + 1; j < atoms.length; j++) {
      const B = atoms[j];
      if (!B.mol.alive || A.mol.id === B.mol.id) continue;
      if (!canAttemptBond(A.mol, A.idx, B.mol, B.idx, ambientTempC)) continue;

      const dx = B.atom.x - A.atom.x;
      const dy = B.atom.y - A.atom.y;
      const d = Math.hypot(dx, dy);
      const cutoff = A.atom.r + B.atom.r + 7;
      const attractRange = cutoff + 22;
      if (d <= attractRange && d > 1e-3) {
        const nx = dx / d;
        const ny = dy / d;
        const ionicPair = (A.atom.el === 'Na' && (B.atom.el === 'Cl' || B.atom.el === 'O')) ||
                          (B.atom.el === 'Na' && (A.atom.el === 'Cl' || A.atom.el === 'O'));
        const pull = ionicPair ? 0.08 : 0.028;
        A.atom.fx += nx * pull;
        A.atom.fy += ny * pull;
        B.atom.fx -= nx * pull;
        B.atom.fy -= ny * pull;
      }
      if (d > cutoff) continue;

      const kPair = pairKey(A.atom.el, B.atom.el);
      const ionic = (A.atom.el === 'Na' || B.atom.el === 'Na') && (A.atom.el !== 'H' && B.atom.el !== 'H');
      const dEN = Math.abs((ELECTRONEGATIVITY[A.atom.el] || 2) - (ELECTRONEGATIVITY[B.atom.el] || 2));
      const chemBias = ionic ? 1.35 : clamp(0.55 + dEN * 0.22, 0.4, 1.3);
      const proximity = clamp((cutoff - d) / cutoff, 0, 1);
      const relSpeed = Math.hypot(A.atom.vx - B.atom.vx, A.atom.vy - B.atom.vy);
      const speedFactor = clamp(relSpeed / 2.4, 0.25, 1.45);
      const electronA = getElectronState(A.mol, A.idx);
      const electronB = getElectronState(B.mol, B.idx);
      const donorAcceptorFit = clamp(
        electronA.acceptorStrength * electronB.donorStrength +
        electronB.acceptorStrength * electronA.donorStrength +
        electronA.radicalElectrons * electronB.radicalElectrons * 1.2,
        0.05,
        4.5
      );
      const localNeed = clamp(0.55 + (electronA.electronPressure + electronB.electronPressure) * 0.42, 0.55, 2.3);
      const molSatA = moleculeSaturation(A.mol);
      const molSatB = moleculeSaturation(B.mol);
      const siteReactiveA = atomReactivityScore(A.mol, A.idx);
      const siteReactiveB = atomReactivityScore(B.mol, B.idx);
      const moleculeReactiveA = moleculeReactiveScore(A.mol);
      const moleculeReactiveB = moleculeReactiveScore(B.mol);
      const unsaturatedBoost = clamp(1.75 - ((molSatA + molSatB) * 0.5), 0.72, 1.5);
      const phaseAffinity = (
        A.mol.miscibleGroup === B.mol.miscibleGroup ||
        (A.mol.phase === 'gas' && B.mol.phase === 'gas') ||
        (A.mol.miscibleGroup === 'water' && B.mol.miscibleGroup === 'salt') ||
        (A.mol.miscibleGroup === 'salt' && B.mol.miscibleGroup === 'water')
      ) ? 1.14 : 0.94;
      const stableMoleculePenalty = (
        isClosedShellMolecule(A.mol) &&
        isClosedShellMolecule(B.mol) &&
        ambientTempC < 260
      ) ? 0.04 : 1.0;
      const oligomerPenalty = (
        A.mol.atoms.length > 2 &&
        B.mol.atoms.length > 2 &&
        ambientTempC < 520
      ) ? 0.16 : 1.0;
      const reactiveSiteBoost = clamp(0.35 + donorAcceptorFit * 0.28 + (siteReactiveA + siteReactiveB) * 0.45 + (moleculeReactiveA + moleculeReactiveB) * 0.12, 0.35, 2.6);
      const electroBias = 1 + electrostaticPairBias(A.atom, B.atom);
      const collisionWindow = clamp(1.20 - Math.abs(relSpeed - 1.25) / 2.1, 0.30, 1.28);
      const Ea = FORMATION_EA_K[kPair] || 1200;
      const thermalFactor = Math.exp(-Ea / Math.max(240, tempK));
      const chance = (0.0015 + 0.065 * proximity * chemBias * formationScale * coolBonus * hotPenalty * speedFactor * collisionWindow * thermalFactor * localNeed * unsaturatedBoost * phaseAffinity * electroBias * reactiveSiteBoost * stableMoleculePenalty * oligomerPenalty) * (dt * 60);
      if (Math.random() > chance) continue;

      let order = 1;
      if (kPair === 'O-O' && freeValence(A.mol, A.idx) > 1 && freeValence(B.mol, B.idx) > 1 && ambientHeat < 0.55) {
        order = 2;
      }
      const merged = mergeMoleculesWithBond(A.mol, A.idx, B.mol, B.idx, order, ionic);
      if (!merged) continue;
      changed = true;
      formedThisStep += 1;
      if (formedThisStep >= formLimit) break;
      break;
    }
    if (formedThisStep >= formLimit) break;
  }

  for (const mol of world.molecules) {
    if (!mol.alive || mol.bonds.length === 0) continue;

    for (let bi = mol.bonds.length - 1; bi >= 0; bi--) {
      const bond = mol.bonds[bi];
      const a = mol.atoms[bond.a];
      const b = mol.atoms[bond.b];
      bond.age = (bond.age ?? 0) + dt * 60;
      const k = pairKey(a.el, b.el);
      const stability = (BOND_STABILITY[k] || 0.58) * (bond.order > 1 ? 1.35 : 1.0) * (bond.ionic ? 1.20 : 1.0);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1e-6;
      const nx = dx / d;
      const ny = dy / d;
      const reln = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      const stretch = Math.max(0, Math.hypot(dx, dy) - (bond.rest || 30));
      const stress = clamp(stretch / 22, 0, 1);
      bond.strain = (bond.strain ?? stress) * 0.90 + stress * 0.10;
      const sustainedStress = Math.max(stress, bond.strain * 0.92);
      const bondEa = 2600 * stability * (bond.order > 1 ? 1.25 : 1.0) * (bond.ionic ? 1.2 : 1.0);
      const thermalBreak = Math.exp(-bondEa / Math.max(240, tempK));
      const molSat = moleculeSaturation(mol);
      const localSat = (atomSaturation(mol, bond.a) + atomSaturation(mol, bond.b)) * 0.5;
      const neighborhoodSupport = bondNeighborhoodSupport(mol, bond);
      const condensedShield = (mol.phase === 'liquid' || mol.phase === 'solid' || mol.miscibleGroup === 'salt') ? 0.88 : 1.0;
      const vibrationalStress = clamp(Math.abs(reln) / (1.8 + stability * 1.2), 0, 1.4);
      let breakChance = clamp((0.000008 + sustainedStress * sustainedStress * 0.0011 + vibrationalStress * vibrationalStress * 0.00055 + thermalBreak * 0.0014) * (dt * 60), 0, 0.05);
      if (bond.age < 45) breakChance *= 0.06;
      if (ambientTempC < 140 && sustainedStress < 0.72) breakChance *= 0.05;
      if (k === 'H-H' && ambientTempC < 380) breakChance *= 0.35;
      if ((k === 'C-C' || k === 'C-O' || k === 'H-O') && ambientTempC < 520) breakChance *= 0.20;
      if (bond.ionic && ambientTempC < 220) breakChance *= 0.30;
      if (bond.core) breakChance *= 0.12;
      if (bond.core && ambientTempC < 120 && sustainedStress < 0.98) breakChance *= 0.05;
      if (mol.type === 'NaOCl' && (k === 'Na-O' || k === 'O-Cl') && ambientTempC < 90) breakChance *= 0.03;
      if (mol.type === 'acetone' && (k === 'C-C' || k === 'C-O') && ambientTempC < 110) breakChance *= 0.03;
      breakChance *= clamp(1.16 - localSat * 0.36, 0.46, 1.08);
      breakChance *= clamp(1.16 - molSat * 0.30, 0.58, 1.08);
      breakChance *= clamp(1.06 - neighborhoodSupport * 0.24, 0.72, 1.02);
      breakChance *= condensedShield;
      if (bond.age > 180 && ambientTempC < 180) breakChance *= 0.82;
      if (Math.random() < breakChance) {
        const host = plainFormula(mol.formula);
        mol.bonds.splice(bi, 1);
        world.stats.reactions += 1;
        addReactionLog(
          'break-bond',
          `${host} broke ${k} bond (stress=${sustainedStress.toFixed(2)}, chance=${breakChance.toFixed(4)})`
        );
        changed = true;
      }
    }

    splitDisconnectedMolecule(mol);
  }

  if (changed) markSidebarDirty();
}

function applyPairForce(a, b, fx, fy) {
  a.fx += fx; a.fy += fy;
  b.fx -= fx; b.fy -= fy;
}

function springBond(a, b, rest, k, damping, strength = 1) {
  if (strength <= 0.0001) return;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let d = Math.hypot(dx, dy);
  if (d < 1e-6) d = 1e-6;

  const nx = dx / d;
  const ny = dy / d;
  const relvx = b.vx - a.vx;
  const relvy = b.vy - a.vy;
  const reln = relvx * nx + relvy * ny;
  const f = (k * (d - rest) + damping * reln) * strength;
  applyPairForce(a, b, f * nx, f * ny);
}

function softRepulsion(a, b, minDist, k) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let d = Math.hypot(dx, dy);
  if (d < 1e-6) d = 1e-6;
  const overlap = minDist - d;
  if (overlap > 0) {
    const nx = dx / d;
    const ny = dy / d;
    const f = -k * overlap;
    applyPairForce(a, b, f * nx, f * ny);
  }
}

function applyElectrostaticForce(a, b, mediumScale = 1) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d2 = dx * dx + dy * dy;
  if (d2 < 1e-6) return;
  const qProduct = a.charge * b.charge;
  if (Math.abs(qProduct) < 0.0002) return;

  const d = Math.sqrt(d2);
  const nx = dx / d;
  const ny = dy / d;
  const f = clamp((-24 * qProduct * mediumScale) / (d2 + 140), -0.11, 0.11);
  applyPairForce(a, b, f * nx, f * ny);
}

function applyAngleConstraint(mol, con, strength, dt) {
  const c = mol.atoms[con.center];
  const a = mol.atoms[con.a];
  const b = mol.atoms[con.b];

  const a1 = Math.atan2(a.y - c.y, a.x - c.x);
  const a2 = Math.atan2(b.y - c.y, b.x - c.x);

  let diff = a2 - a1;
  while (diff > Math.PI) diff -= TAU;
  while (diff < -Math.PI) diff += TAU;

  const err = diff - con.angle;
  const torque = err * strength;

  a.vx += (-Math.sin(a1) * torque) * dt * 60;
  a.vy += ( Math.cos(a1) * torque) * dt * 60;
  b.vx += ( Math.sin(a2) * torque) * dt * 60;
  b.vy += (-Math.cos(a2) * torque) * dt * 60;
}

function keepMoleculeInsideVessel(mol, b) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const a of mol.atoms) {
    minX = Math.min(minX, a.x - a.r);
    minY = Math.min(minY, a.y - a.r);
    maxX = Math.max(maxX, a.x + a.r);
    maxY = Math.max(maxY, a.y + a.r);
  }

  let pushX = 0, pushY = 0;
  if (minX < b.x + 10) pushX = (b.x + 10 - minX);
  if (maxX > b.x + b.w - 10) pushX = (b.x + b.w - 10 - maxX);
  if (minY < b.y + 10) pushY = (b.y + 10 - minY);
  if (maxY > b.y + b.h - 10) pushY = (b.y + b.h - 10 - maxY);

  if (pushX !== 0 || pushY !== 0) {
    for (const a of mol.atoms) {
      a.x += pushX;
      a.y += pushY;
      if (pushX !== 0) a.vx *= -0.55;
      if (pushY !== 0) a.vy *= -0.55;
    }
  }
}

function nudgeMoleculesTogether(molA, molB, strength, dt) {
  const ca = moleculeCenter(molA);
  const cb = moleculeCenter(molB);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  const len = Math.hypot(dx, dy) || 1e-6;
  const nx = dx / len;
  const ny = dy / len;
  const impulse = strength * dt * 60;

  for (const a of molA.atoms) {
    a.vx += nx * impulse;
    a.vy += ny * impulse;
  }
  for (const b of molB.atoms) {
    b.vx -= nx * impulse;
    b.vy -= ny * impulse;
  }
}

function attractMoleculeTowardPoint(mol, point, strength, dt) {
  const center = moleculeCenter(mol);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const len = Math.hypot(dx, dy) || 1e-6;
  const nx = dx / len;
  const ny = dy / len;
  const impulse = strength * dt * 60;

  for (const atom of mol.atoms) {
    atom.vx += nx * impulse;
    atom.vy += ny * impulse;
  }
}

function moleculeRadius(mol) {
  const center = moleculeCenter(mol);
  let radius = 18;
  for (const atom of mol.atoms) {
    radius = Math.max(radius, Math.hypot(atom.x - center.x, atom.y - center.y) + atom.r);
  }
  return radius;
}

function buildMoleculeSpatialIndex(molecules, cellSize = 180) {
  const cells = new Map();
  const entries = [];

  for (const mol of molecules) {
    const center = moleculeCenter(mol);
    const radius = moleculeRadius(mol);
    const cellX = Math.floor(center.x / cellSize);
    const cellY = Math.floor(center.y / cellSize);
    const entry = { mol, center, radius, cellX, cellY };
    const key = `${cellX},${cellY}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(entry);
    entries.push(entry);
  }

  return { cellSize, cells, entries };
}

function forEachNearbyMoleculePair(index, maxDist, callback) {
  const seen = new Set();
  const range = Math.max(1, Math.ceil(maxDist / index.cellSize));

  for (const entry of index.entries) {
    for (let gx = entry.cellX - range; gx <= entry.cellX + range; gx++) {
      for (let gy = entry.cellY - range; gy <= entry.cellY + range; gy++) {
        const bucket = index.cells.get(`${gx},${gy}`);
        if (!bucket) continue;

        for (const other of bucket) {
          if (other.mol.id <= entry.mol.id) continue;
          const pairId = `${entry.mol.id}:${other.mol.id}`;
          if (seen.has(pairId)) continue;
          seen.add(pairId);
          callback(entry, other);
        }
      }
    }
  }
}

function getNearbyMoleculeEntries(index, point, maxDist) {
  const matches = [];
  const range = Math.max(1, Math.ceil(maxDist / index.cellSize));
  const cellX = Math.floor(point.x / index.cellSize);
  const cellY = Math.floor(point.y / index.cellSize);

  for (let gx = cellX - range; gx <= cellX + range; gx++) {
    for (let gy = cellY - range; gy <= cellY + range; gy++) {
      const bucket = index.cells.get(`${gx},${gy}`);
      if (!bucket) continue;

      for (const entry of bucket) {
        if (dist(point, entry.center) <= maxDist) matches.push(entry);
      }
    }
  }

  return matches;
}

function applyMoleculeRepulsion(dt) {
  const active = world.molecules.filter(m => m.alive);
  const index = buildMoleculeSpatialIndex(active, 180);

  forEachNearbyMoleculePair(index, 180, (entryA, entryB) => {
    const A = entryA.mol;
    const B = entryB.mol;
    const dx = entryB.center.x - entryA.center.x;
    const dy = entryB.center.y - entryA.center.y;
    const d = Math.hypot(dx, dy) || 1e-6;
    const minDist = entryA.radius + entryB.radius + 12;
    if (d >= minDist) return;
    const nx = dx / d;
    const ny = dy / d;
    const push = ((minDist - d) / minDist) * 0.16 * dt * 60;
    for (const atom of A.atoms) {
      atom.vx -= nx * push;
      atom.vy -= ny * push;
    }
    for (const atom of B.atoms) {
      atom.vx += nx * push;
      atom.vy += ny * push;
    }
  });
}

function canRuleRunAtConditions(rule, ambientTempC, pressureAtm) {
  const min = rule.conditions?.tempMinC;
  const max = rule.conditions?.tempMaxC;
  if (Number.isFinite(min) && ambientTempC < min) return false;
  if (Number.isFinite(max) && ambientTempC > max) return false;
  const pressureMin = rule.conditions?.pressureMinAtm;
  const pressureMax = rule.conditions?.pressureMaxAtm;
  if (Number.isFinite(pressureMin) && pressureAtm < pressureMin) return false;
  if (Number.isFinite(pressureMax) && pressureAtm > pressureMax) return false;
  return true;
}

function participantsSatisfyPhotochemistry(rule, participants) {
  if (!rule.conditions?.requiresLight) return true;
  if (!world.light.firing) return false;

  const requiredBandId = rule.conditions?.requiredLightBand || null;
  if (requiredBandId) {
    const currentBand = getLightBand(world.light.band);
    const requiredBand = getLightBand(requiredBandId);
    if (currentBand.energy < requiredBand.energy) return false;
  }

  const threshold = Math.max(0.1, Number(rule.conditions?.excitationMin) || 0.55);
  const excitedTypes = Array.isArray(rule.conditions?.excitedTypes) && rule.conditions.excitedTypes.length
    ? rule.conditions.excitedTypes
    : [participants[0]?.type].filter(Boolean);

  return excitedTypes.every(type =>
    participants.some(mol =>
      mol.type === type &&
      (mol.photoExcitation || 0) >= threshold &&
      (!requiredBandId || (mol.lastLightBand && getLightBand(mol.lastLightBand).energy >= getLightBand(requiredBandId).energy))
    )
  );
}

function findRuleParticipants(rule, anchor, reservedIds, spatialIndex = null) {
  const proximity = rule.conditions?.proximity ?? 140;
  const phase = rule.conditions?.phase || null;
  const participants = [anchor];
  const localReserved = new Set([anchor.id]);
  const anchorCenter = moleculeCenter(anchor);

  if (phase && anchor.phase !== phase) return null;

  for (let i = 1; i < rule.expandedReactants.length; i++) {
    const type = rule.expandedReactants[i];
    let best = null;
    let bestDist = Infinity;
    const candidates = spatialIndex
      ? getNearbyMoleculeEntries(spatialIndex, anchorCenter, proximity * 1.05).map(entry => entry.mol)
      : world.molecules;
    for (const candidate of candidates) {
      if (!candidate.alive || reservedIds.has(candidate.id) || localReserved.has(candidate.id)) continue;
      if (candidate.type !== type) continue;
      if (phase && candidate.phase !== phase) continue;
      const d = dist(anchorCenter, moleculeCenter(candidate));
      if (d <= proximity && d < bestDist) {
        best = candidate;
        bestDist = d;
      }
    }
    if (!best) return null;
    localReserved.add(best.id);
    participants.push(best);
  }

  return participants;
}

function getParticipantCloseness(rule, participants) {
  const proximity = rule.conditions?.proximity ?? 140;
  const anchorCenter = moleculeCenter(participants[0]);
  let total = 0;
  let count = 0;
  for (let i = 1; i < participants.length; i++) {
    const d = dist(anchorCenter, moleculeCenter(participants[i]));
    if (d > proximity * 1.08) return 0;
    total += clamp((proximity - d) / proximity, 0, 1);
    count += 1;
  }
  return count ? total / count : 1;
}

function spawnSpecies(type, x, y) {
  if (type.startsWith('atom-')) return addAtom(type.replace('atom-', ''), x, y, { select: false });
  return addMolecule(type, x, y, { select: false });
}

function executeScriptedReaction(rule, participants) {
  const centers = participants.map(moleculeCenter);
  const velocities = participants.map(moleculeVelocity);
  const center = {
    x: centers.reduce((sum, p) => sum + p.x, 0) / centers.length,
    y: centers.reduce((sum, p) => sum + p.y, 0) / centers.length
  };
  const avgVelocity = {
    vx: velocities.reduce((sum, p) => sum + p.vx, 0) / velocities.length,
    vy: velocities.reduce((sum, p) => sum + p.vy, 0) / velocities.length
  };

  for (const mol of participants) {
    mol.alive = false;
    mol.reactionProgress = {};
  }

  const spawned = [];
  let offsetIndex = 0;
  for (const product of rule.products) {
    const count = Math.max(1, Number(product.count) || 1);
    for (let i = 0; i < count; i++) {
      const angle = (offsetIndex / Math.max(1, rule.products.length + 2)) * TAU;
      const radius = 22 + (offsetIndex % 3) * 14;
      const made = spawnSpecies(
        product.type,
        center.x + Math.cos(angle) * radius + rand(-8, 8),
        center.y + Math.sin(angle) * radius + rand(-8, 8)
      );
      if (made) {
        for (const atom of made.atoms) {
          atom.vx += avgVelocity.vx * 0.4 + rand(-0.6, 0.6);
          atom.vy += avgVelocity.vy * 0.4 + rand(-0.6, 0.6);
        }
        spawned.push(made);
      }
      offsetIndex += 1;
    }
  }

  if (rule.thermalDeltaC) {
    applyThermalImpulse(rule.thermalDeltaC, rule.name || rule.id, {
      x: center.x,
      y: center.y,
      label: reactionEquation(rule),
      log: false,
      source: rule.id
    });
  }

  world.stats.reactions += 1;
  addReactionLog(
    rule.category || 'scripted',
    reactionEquation(rule),
    { thermalDeltaC: rule.thermalDeltaC || 0, source: rule.id, x: center.x, y: center.y }
  );
  markSidebarDirty();
  return spawned;
}

function runScriptedReactions(dt, ambientTempC, pressureAtm) {
  const rules = world.reactionData.reactions || [];
  const reservedIds = new Set();
  const active = world.molecules.filter(m => m.alive);
  const spatialIndex = buildMoleculeSpatialIndex(active, 180);

  for (const rule of rules) {
    if (!canRuleRunAtConditions(rule, ambientTempC, pressureAtm)) continue;
    const decayPerSecond = Math.max(0, Number(rule.kinetics?.decayPerSecond) || 1);
    const progressPerSecond = Math.max(0.05, Number(rule.kinetics?.progressPerSecond) || 0.6);
    const contactThreshold = Math.max(0.1, Number(rule.kinetics?.contactThreshold) || 1);
    const drift = Math.max(0, Number(rule.kinetics?.drift) || 0);
    const anchorType = rule.expandedReactants[0];
    const anchors = world.molecules.filter(m => m.alive && m.type === anchorType && !reservedIds.has(m.id));

    for (const anchor of anchors) {
      anchor.reactionProgress[rule.id] = (anchor.reactionProgress[rule.id] || 0) * Math.max(0, 1 - decayPerSecond * dt);
      const participants = findRuleParticipants(rule, anchor, reservedIds, spatialIndex);
      if (!participants) continue;
      if (!participantsSatisfyPhotochemistry(rule, participants)) continue;

      const center = {
        x: participants.reduce((sum, mol) => sum + moleculeCenter(mol).x, 0) / participants.length,
        y: participants.reduce((sum, mol) => sum + moleculeCenter(mol).y, 0) / participants.length
      };
      if (drift > 0) {
        for (const mol of participants) attractMoleculeTowardPoint(mol, center, drift, dt);
      }

      const closeness = getParticipantCloseness(rule, participants);
      if (closeness <= 0) continue;

      anchor.reactionProgress[rule.id] += progressPerSecond * (0.35 + closeness) * dt;
      if (anchor.reactionProgress[rule.id] < contactThreshold) continue;

      anchor.reactionProgress[rule.id] = 0;
      for (const mol of participants) reservedIds.add(mol.id);
      executeScriptedReaction(rule, participants);
    }
  }
}

function applyReactiveMoleculeDrift(dt, ambientTempC) {
  const active = world.molecules.filter(m => m.alive && m.atoms.length > 0);
  const index = buildMoleculeSpatialIndex(active, 180);

  forEachNearbyMoleculePair(index, 260, (entryA, entryB) => {
    const A = entryA.mol;
    const B = entryB.mol;
    const d = dist(entryA.center, entryB.center);
    if (d > 240) return;

    const reactiveA = moleculeReactiveScore(A);
    const reactiveB = moleculeReactiveScore(B);
    const pairReactive = reactiveA + reactiveB;
    const closedPair = isClosedShellMolecule(A) && isClosedShellMolecule(B);
    const waterOrganicPair =
      (A.miscibleGroup === 'water' && B.miscibleGroup === 'organic-light') ||
      (A.miscibleGroup === 'organic-light' && B.miscibleGroup === 'water');
    const bleachAcetonePair =
      (A.type === 'acetone' && B.type === 'NaOCl') ||
      (A.type === 'NaOCl' && B.type === 'acetone');

    if (closedPair && pairReactive < 1.8 && !bleachAcetonePair) return;

    let strength = 0;
    if (waterOrganicPair) {
      strength += clamp((240 - d) / 240, 0, 1) * 0.020;
    }
    if (pairReactive > 1.15) {
      strength += clamp((220 - d) / 220, 0, 1) * clamp(pairReactive * 0.010, 0, 0.030);
    }
    if (bleachAcetonePair) {
      const tempWindow = Math.exp(-Math.pow((ambientTempC - 42) / 34, 2));
      strength += clamp((260 - d) / 260, 0, 1) * (0.030 + tempWindow * 0.060);
    }

    if (strength <= 0.0005) return;
    nudgeMoleculesTogether(A, B, strength, dt);
  });
}

function handleLiquidMixing(dt) {
    const liquids = world.molecules.filter(m => m.phase === 'liquid');
  const index = buildMoleculeSpatialIndex(liquids, 180);

  forEachNearbyMoleculePair(index, 170, (entryA, entryB) => {
    const A = entryA.mol;
    const B = entryB.mol;
    const ca = entryA.center;
    const cb = entryB.center;
    const d = dist(ca, cb);

    if (d > 170) return;

    const sameGroup = A.miscibleGroup === B.miscibleGroup;
    const nearWaterAcetone =
      (A.miscibleGroup === 'water' && B.miscibleGroup === 'organic-light') ||
      (A.miscibleGroup === 'organic-light' && B.miscibleGroup === 'water');
    const bleachAcetonePair =
      (A.type === 'NaOCl' && B.type === 'acetone') ||
      (A.type === 'acetone' && B.type === 'NaOCl');

    const immiscible =
      !sameGroup && !nearWaterAcetone &&
      !(A.miscibleGroup === 'gas' || B.miscibleGroup === 'gas');

    if (immiscible) {
      const dx = cb.x - ca.x;
      const dy = cb.y - ca.y;
      const len = Math.hypot(dx, dy) || 1e-6;
      const nx = dx / len;
      const ny = dy / len;
      const force = (170 - d) * 0.010;

      for (const a of A.atoms) {
        a.vx -= nx * force * dt * 60;
        a.vy -= ny * force * dt * 60;
      }
      for (const a of B.atoms) {
        a.vx += nx * force * dt * 60;
        a.vy += ny * force * dt * 60;
      }
    } else {
      const midY = (ca.y + cb.y) * 0.5;
      const blend = clamp((170 - d) / 170, 0, 1);
      for (const a of A.atoms) a.vy += (midY - a.y) * (0.0009 + blend * 0.0013) * dt * 60;
      for (const a of B.atoms) a.vy += (midY - a.y) * (0.0009 + blend * 0.0013) * dt * 60;
      if (nearWaterAcetone) {
        nudgeMoleculesTogether(A, B, 0.010 + blend * 0.018, dt);
      }
      if (bleachAcetonePair) {
        nudgeMoleculesTogether(A, B, 0.028 + blend * 0.030, dt);
      }
    }
  });
}

function handleDissolution(dt) {
  const waters = getLiquidWaterMolecules();

  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    const config = DISSOLUTION_CONFIG[mol.type];
    if (!config) continue;

    const center = moleculeCenter(mol);
    const nearbyWater = waters.filter(w => dist(center, moleculeCenter(w)) <= config.nearRadius);
    const enoughWater = nearbyWater.length >= config.requiredNeighbors;
    const sourcePhases = config.sourcePhases || ['particle'];
    const canDissolveFromCurrentPhase = !mol.dissolved && sourcePhases.includes(mol.phase);

    if (canDissolveFromCurrentPhase && enoughWater) {
      const chance = clamp((0.015 + nearbyWater.length * 0.01) * config.dissolveRate * dt * 60, 0, 0.22);
      if (Math.random() < chance) {
        setMoleculeDissolvedState(mol, true);
        for (const atom of mol.atoms) {
          atom.vx *= 0.45;
          atom.vy *= 0.45;
        }
        const message = mol.type === 'HCl'
          ? 'Hydrogen chloride dissolved into water and ionized'
          : `${mol.display} dissolved into the water phase`;
        addReactionLog('solution', message, { source: mol.type, x: center.x, y: center.y });
      }
      continue;
    }

    if (mol.dissolved && !enoughWater) {
      const chance = waters.length === 0
        ? 1
        : clamp(config.precipitateRate * dt * 60, 0, 0.08);
      if (Math.random() < chance) {
        setMoleculeDissolvedState(mol, false);
        addReactionLog('solution', `${mol.display} precipitated out of solution`, { source: mol.type, x: center.x, y: center.y });
      }
    }
  }
}

function handleCarbonation(dt, ambientTempC, pressureAtm) {
  const waters = getLiquidWaterMolecules();

  const co2Molecules = world.molecules.filter(m => m.alive && m.type === 'CO2');
  const stirBoost = world.stirring.timeLeft > 0 ? 1.8 : 1;
  const coldBoost = clamp((28 - ambientTempC) / 26, 0, 1.3);
  const warmPenalty = clamp((ambientTempC - 18) / 50, 0, 1.6);

  for (const mol of co2Molecules) {
    const center = moleculeCenter(mol);
    const nearbyWater = waters.filter(w => dist(center, moleculeCenter(w)) <= 145);
    const submergedInWater = nearbyWater.length >= 3 && nearbyWater.some(w => moleculeCenter(w).y < center.y + 22);
    const isDragged = world.dragging.mol && world.dragging.mol.id === mol.id;

    if (!mol.dissolved && mol.phase === 'gas' && nearbyWater.length >= 3) {
      const absorbChance = clamp(
        (Math.max(0, pressureAtm - 1) * 0.020 + coldBoost * 0.010 + 0.004 + (submergedInWater ? 0.020 : 0) + (isDragged ? 0.012 : 0)) *
        nearbyWater.length * 0.12 * stirBoost * dt * 60,
        0,
        submergedInWater ? 0.45 : 0.22
      );
      if (Math.random() < absorbChance) {
        setMoleculeDissolvedState(mol, true);
        for (const atom of mol.atoms) {
          atom.vx *= 0.35;
          atom.vy *= 0.35;
        }
        addReactionLog('solution', 'CO2 dissolved into water, forming carbonated water', {
          source: 'carbonation',
          x: center.x,
          y: center.y
        });
      }
      continue;
    }

    if (mol.dissolved) {
      const nearbyWaterSupport = nearbyWater.length >= 2;
      const releaseChance = clamp(
        (Math.max(0, 1.35 - pressureAtm) * 0.030 + warmPenalty * 0.018 + (world.stirring.timeLeft > 0 && pressureAtm < 1.6 ? 0.012 : 0)) *
        dt * 60,
        0,
        0.20
      );
      if (!nearbyWaterSupport || waters.length === 0 || Math.random() < releaseChance) {
        setMoleculeDissolvedState(mol, false);
        const releaseCenter = moleculeCenter(mol);
        for (const atom of mol.atoms) {
          atom.vx += rand(-0.20, 0.20);
          atom.vy -= rand(0.35, 0.90);
        }
        addReactionLog('solution', 'Carbonated water released CO2 bubbles', {
          source: 'carbonation',
          x: releaseCenter.x,
          y: releaseCenter.y
        });
      }
    }
  }
}

function handleAqueousIonChemistry(dt, ambientTempC, pressureAtm) {
  const waterChem = getWaterChemistrySnapshot();
  if (!waterChem || waterChem.waterCount < 2) return;

  const dissolvedCO2 = world.molecules.filter(m => m.alive && m.type === 'CO2' && m.dissolved);
  if (!dissolvedCO2.length) return;

  const aqueousNaOH = world.molecules.filter(m => m.alive && m.type === 'NaOH' && isWaterPhaseMolecule(m));
  if (!aqueousNaOH.length) return;

  const stirBoost = world.stirring.timeLeft > 0 ? 1.4 : 1;
  const coolBonus = clamp((30 - ambientTempC) / 25, 0.7, 1.35);
  const pressureBoost = clamp(0.75 + Math.max(0, pressureAtm - 1) * 0.35, 0.75, 1.7);

  for (const co2 of dissolvedCO2) {
    if (!co2.alive) continue;
    const center = moleculeCenter(co2);
    const nearbyBase = aqueousNaOH
      .filter(m => m.alive && dist(center, moleculeCenter(m)) <= 150)
      .sort((a, b) => dist(center, moleculeCenter(a)) - dist(center, moleculeCenter(b)));
    if (!nearbyBase.length) continue;

    const stronglyBasic = waterChem.pH >= 10.2 && nearbyBase.length >= 2;
    const targetType = stronglyBasic ? 'Na2CO3' : 'NaHCO3';
    const baseNeeded = stronglyBasic ? 2 : 1;
    if (nearbyBase.length < baseNeeded) continue;

    const chance = clamp((0.010 + nearbyBase.length * 0.012) * stirBoost * coolBonus * pressureBoost * dt * 60, 0, 0.24);
    if (Math.random() >= chance) continue;

    const consumedBase = nearbyBase.slice(0, baseNeeded);
    co2.alive = false;
    for (const base of consumedBase) base.alive = false;

    const product = spawnSpecies(targetType, center.x + rand(-8, 8), center.y + rand(-8, 8));
    const water = stronglyBasic ? spawnSpecies('H2O', center.x + rand(-14, 14), center.y + rand(-10, 10)) : null;

    if (product && DISSOLUTION_CONFIG[targetType]) setMoleculeDissolvedState(product, true);
    if (water) {
      for (const atom of water.atoms) {
        atom.vx *= 0.35;
        atom.vy *= 0.35;
      }
    }

    world.stats.reactions += 1;
    addReactionLog(
      'solution',
      stronglyBasic
        ? 'Dissolved CO2 reacted with aqueous NaOH to form carbonate'
        : 'Dissolved CO2 reacted with aqueous NaOH to form bicarbonate',
      { source: stronglyBasic ? 'aqueous_carbonate' : 'aqueous_bicarbonate', x: center.x, y: center.y }
    );
    markSidebarDirty();
  }
}

function handlePhaseTransitions(dt, ambientTempC, pressureAtm) {
  const b = world.bounds;
  const phaseShiftCounts = new Map();
  const tryReservePhaseShift = (type, fromPhase, toPhase, limit) => {
    const key = `${type}:${fromPhase}->${toPhase}`;
    const used = phaseShiftCounts.get(key) || 0;
    if (used >= limit) return false;
    phaseShiftCounts.set(key, used + 1);
    return true;
  };

  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    if (mol.phaseLockUntil && world.time < mol.phaseLockUntil) continue;
    const material = getMaterialConditions(mol.type);
    const config = EVAPORATION_CONFIG[mol.type];

    const center = moleculeCenter(mol);
    const yNorm = clamp((center.y - b.y) / Math.max(1, b.h), 0, 1);
    const boilC = config ? getPressureAdjustedBoilingPointC(mol.type, pressureAtm) : null;
    const condenseC = config ? getPressureAdjustedCondensePointC(mol.type, pressureAtm) : null;
    const meltC = Number(material.thermal?.meltingPointC);
    const vacuumBoost = pressureAtm < 1
      ? clamp(Math.pow(1 / Math.max(pressureAtm, 0.01), 0.42), 1, 5.5)
      : 1;
    const farAboveMelt = Number.isFinite(meltC) && ambientTempC >= meltC + 18;
    const farBelowMelt = Number.isFinite(meltC) && ambientTempC <= meltC - 18;
    const farAboveBoil = Number.isFinite(boilC) && ambientTempC >= boilC + 24;
    const farBelowCondense = Number.isFinite(condenseC) && ambientTempC <= condenseC - 24;
    const standardTransitionLimit = 1;
    const extremeTransitionLimit = 2;

    if (mol.phase === 'solid' && Number.isFinite(meltC) && ambientTempC > meltC + 1.5 && getMaterialState(mol.type, 'liquid')) {
      const excess = ambientTempC - meltC;
      const chance = clamp((0.0004 + excess / 5200) * dt * 60, 0, 0.16);
      const limit = farAboveMelt ? extremeTransitionLimit : standardTransitionLimit;
      if ((farAboveMelt || Math.random() < chance) && tryReservePhaseShift(mol.type, 'solid', 'liquid', limit)) {
        setMoleculePhaseMode(mol, 'liquid');
        for (const atom of mol.atoms) {
          atom.vx *= 0.72;
          atom.vy *= 0.72;
        }
        addReactionLog('phase', `${mol.display} melted`, {
          source: `${mol.type}_melt`,
          x: center.x,
          y: center.y
        });
      }
      continue;
    }

    if (mol.phase === 'liquid' && Number.isFinite(meltC) && ambientTempC < meltC - 1.5 && getMaterialState(mol.type, 'solid') && !mol.dissolved) {
      const deficit = meltC - ambientTempC;
      const chance = clamp((0.0005 + deficit / 4800) * dt * 60, 0, 0.22);
      const limit = farBelowMelt ? extremeTransitionLimit : standardTransitionLimit;
      if ((farBelowMelt || Math.random() < chance) && tryReservePhaseShift(mol.type, 'liquid', 'solid', limit)) {
        setMoleculePhaseMode(mol, 'solid');
        for (const atom of mol.atoms) {
          atom.vx *= 0.30;
          atom.vy = Math.max(atom.vy * 0.30, 0.55 + rand(0, 0.35));
        }
        addReactionLog('phase', `${mol.display} froze`, {
          source: `${mol.type}_freeze`,
          x: center.x,
          y: center.y
        });
      }
      continue;
    }

    if (config && mol.phase === 'liquid' && ambientTempC > boilC) {
      const excess = ambientTempC - boilC;
      const surfaceBias = clamp(1.25 - yNorm, 0.45, 1.35);
      const chance = clamp((0.0005 + excess / 4200) * config.evapRate * surfaceBias * vacuumBoost * dt * 60, 0, 0.42);
      const limit = farAboveBoil ? extremeTransitionLimit : standardTransitionLimit;
      if ((farAboveBoil || Math.random() < chance) && tryReservePhaseShift(mol.type, 'liquid', 'gas', limit)) {
        setMoleculePhaseMode(mol, 'gas');
        for (const atom of mol.atoms) {
          atom.vx += rand(-0.45, 0.45);
          atom.vy -= rand(0.2, 0.9);
        }
        addThermalEvent(center.x, center.y, config.coolDeltaC * 0.25, `${getSpeciesDisplayLabel(mol.type)} vapor`);
        addReactionLog('phase', `${mol.display} evaporated`, {
          source: `${mol.type}_evaporate`,
          x: center.x,
          y: center.y
        });
      }
      continue;
    }

    if (config && mol.phase === 'gas' && ambientTempC < condenseC) {
      const deficit = condenseC - ambientTempC;
      const sinkBias = clamp(yNorm + 0.15, 0.30, 1.20);
      const chance = clamp((0.0003 + deficit / 6000) * sinkBias * dt * 60, 0, 0.12);
      const limit = farBelowCondense ? extremeTransitionLimit : standardTransitionLimit;
      if ((farBelowCondense || Math.random() < chance) && tryReservePhaseShift(mol.type, 'gas', 'liquid', limit)) {
        setMoleculePhaseMode(mol, 'liquid');
        for (const atom of mol.atoms) {
          atom.vx *= 0.72;
          atom.vy += rand(0.1, 0.4);
        }
        addThermalEvent(center.x, center.y, Math.abs(config.coolDeltaC) * 0.18, `${getSpeciesDisplayLabel(mol.type)} condensate`);
        addReactionLog('phase', `${mol.display} condensed`, {
          source: `${mol.type}_condense`,
          x: center.x,
          y: center.y
        });
      }
      continue;
    }

    if (
      mol.phase === 'gas' &&
      !config &&
      Number.isFinite(meltC) &&
      ambientTempC < meltC - 8 &&
      getMaterialState(mol.type, 'solid')
    ) {
      const deficit = meltC - ambientTempC;
      const chance = clamp((0.00025 + deficit / 7200) * dt * 60, 0, 0.10);
      const limit = farBelowMelt ? extremeTransitionLimit : standardTransitionLimit;
      if (Math.random() < chance && tryReservePhaseShift(mol.type, 'gas', 'solid', limit)) {
        setMoleculePhaseMode(mol, 'solid');
        for (const atom of mol.atoms) {
          atom.vx *= 0.18;
          atom.vy = Math.max(atom.vy * 0.18, 0.95 + rand(0, 0.55));
        }
        addReactionLog('phase', `${mol.display} deposited into a solid phase`, {
          source: `${mol.type}_deposit`,
          x: center.x,
          y: center.y
        });
      }
    }
  }
}

function handleBleachAcetone(dt, ambientTempC) {
  const acetones = world.molecules.filter(m => m.alive && m.type === 'acetone');
  const bleaches = world.molecules.filter(m => m.alive && m.type === 'NaOCl');
  if (acetones.length === 0 || bleaches.length < 3) return;

  const tempPenalty = ambientTempC < 5 ? 0.20 : ambientTempC > 85 ? 0.45 : 1.0;
  const tempPeak = Math.exp(-Math.pow((ambientTempC - 42) / 26, 2));
  const contactGain = (0.010 + 0.030 * tempPeak * tempPenalty) * (dt * 60);
  const decay = Math.max(0, 1 - dt * 1.8);

  for (const ac of acetones) {
    if (!ac.alive) continue;
    const cA = moleculeCenter(ac);
    const near = bleaches
      .filter(b => b.alive)
      .map(b => ({ mol: b, d: dist(cA, moleculeCenter(b)) }))
      .filter(x => x.d < 320)
      .sort((a, b) => a.d - b.d);
    ac.bleachReactionProgress = (ac.bleachReactionProgress || 0) * decay;
    if (near.length < 3) continue;

    const recruited = near.slice(0, 3);
    const recruitCenter = {
      x: (cA.x + recruited[0].mol.atoms.reduce((s, a) => s + a.x, 0) / recruited[0].mol.atoms.length + recruited[1].mol.atoms.reduce((s, a) => s + a.x, 0) / recruited[1].mol.atoms.length + recruited[2].mol.atoms.reduce((s, a) => s + a.x, 0) / recruited[2].mol.atoms.length) / 4,
      y: (cA.y + recruited[0].mol.atoms.reduce((s, a) => s + a.y, 0) / recruited[0].mol.atoms.length + recruited[1].mol.atoms.reduce((s, a) => s + a.y, 0) / recruited[1].mol.atoms.length + recruited[2].mol.atoms.reduce((s, a) => s + a.y, 0) / recruited[2].mol.atoms.length) / 4
    };
    const tempWindow = Math.exp(-Math.pow((ambientTempC - 42) / 26, 2));
    attractMoleculeTowardPoint(ac, recruitCenter, 0.040 + tempWindow * 0.070, dt);
    for (const item of recruited) {
      attractMoleculeTowardPoint(item.mol, cA, 0.032 + tempWindow * 0.060, dt);
    }

    const tightCluster = recruited.every(x => x.d < 190);
    if (!tightCluster) continue;

    const crowdBoost = clamp(near.length / 5, 0.8, 1.9);
    const intactBoost = isClosedShellMolecule(ac) ? 1.18 : 0.65;
    const bleachIntegrity = recruited.every(x => isClosedShellMolecule(x.mol)) ? 1.20 : 0.70;
    const closeness = recruited.reduce((sum, item) => sum + clamp((220 - item.d) / 220, 0, 1), 0) / recruited.length;
    ac.bleachReactionProgress += contactGain * crowdBoost * intactBoost * bleachIntegrity * (0.55 + closeness);
    if (ac.bleachReactionProgress < 1) continue;
    ac.bleachReactionProgress = 0;

    const b1 = recruited[0].mol;
    const b2 = recruited[1].mol;
    const b3 = recruited[2].mol;
    b1.alive = false;
    b2.alive = false;
    b3.alive = false;
    ac.alive = false;

    const mid = {
      x: (cA.x + moleculeCenter(b1).x + moleculeCenter(b2).x + moleculeCenter(b3).x) / 4,
      y: (cA.y + moleculeCenter(b1).y + moleculeCenter(b2).y + moleculeCenter(b3).y) / 4
    };

    const p1 = addMolecule('CHCl3', mid.x - 24, mid.y - 8, { select: false });
    const p2 = addMolecule('NaC2H3O2', mid.x + 18, mid.y + 12, { select: false });
    const p3 = addMolecule('NaCl', mid.x + 42, mid.y - 10, { select: false });
    const p4 = addMolecule('NaCl', mid.x - 42, mid.y + 8, { select: false });
    const p5 = addMolecule('H2O', mid.x + rand(-10, 10), mid.y + rand(-10, 10), { select: false });

    for (const a of [...p1.atoms, ...p2.atoms, ...p3.atoms, ...p4.atoms, ...p5.atoms]) {
      a.vx += rand(-0.8, 0.8);
      a.vy += rand(-0.7, 0.7);
    }

    world.stats.reactions += 1;
    addReactionLog(
      'pathway',
      'Bleach + acetone pathway: acetone + 3 NaOCl -> CHCl3 + NaC2H3O2 + 2 NaCl + H2O'
    );
    markSidebarDirty();
    break;
  }
}

function handleWaterReaction(heatLevel) {
  if (heatLevel < 0.20) return;

  const hydrogens = world.molecules.filter(m => m.alive && m.type === 'H2');
  const oxygens = world.molecules.filter(m => m.alive && m.type === 'O2');
  if (hydrogens.length < 1 || oxygens.length < 1) return;

  for (const o2 of oxygens) {
    if (!o2.alive) continue;

    const cO = moleculeCenter(o2);
    const velO = moleculeVelocity(o2);
    const candidates = hydrogens
      .filter(h => h.alive)
      .map(h => {
        const cH = moleculeCenter(h);
        const vH = moleculeVelocity(h);
        const relSpeed = Math.hypot(vH.vx - velO.vx, vH.vy - velO.vy);
        return { mol: h, d: dist(cH, cO), relSpeed };
      })
      .filter(x => x.d < 90 && x.relSpeed > 0.8)
      .sort((a, b) => a.d - b.d);

    if (candidates.length < 1) continue;

    const hotWaterChance = clamp(0.004 + heatLevel * 0.05, 0, 0.25);
    const peroxideWindow = Math.exp(-Math.pow(heatLevel - 0.40, 2) / 0.035);
    const peroxideChance = clamp(0.001 + peroxideWindow * 0.018, 0, 0.12);

    if (candidates.length >= 2 && Math.random() < hotWaterChance) {
      const hA = candidates[0].mol;
      const hB = candidates[1].mol;
      const c1 = moleculeCenter(hA);
      const c2 = moleculeCenter(hB);
      const midX = (c1.x + c2.x + cO.x) / 3;
      const midY = (c1.y + c2.y + cO.y) / 3;

      hA.alive = false;
      hB.alive = false;
      o2.alive = false;

      const w1 = addMolecule('H2O', midX - 24, midY - 8, { select: false });
      const w2 = addMolecule('H2O', midX + 24, midY + 8, { select: false });

      for (const a of [...w1.atoms, ...w2.atoms]) {
        a.vx += rand(-1.4, 1.4);
        a.vy += rand(-1.2, 0.6) - heatLevel * 0.25;
      }

      world.stats.reactions += 1;
      markSidebarDirty();
      break;
    }

    if (Math.random() < peroxideChance) {
      const hA = candidates[0].mol;
      const c1 = moleculeCenter(hA);
      const midX = (c1.x + cO.x) * 0.5;
      const midY = (c1.y + cO.y) * 0.5;

      hA.alive = false;
      o2.alive = false;
      const p = addMolecule('H2O2', midX, midY, { select: false });
      for (const a of p.atoms) {
        a.vx += rand(-0.9, 0.9);
        a.vy += rand(-0.8, 0.8);
      }

      world.stats.reactions += 1;
      markSidebarDirty();
      break;
    }
  }
}

function handleAtomicBonding(heatLevel) {
  const atomsH = world.molecules.filter(m => m.alive && m.type === 'atom-H');
  const atomsO = world.molecules.filter(m => m.alive && m.type === 'atom-O');
  const coolingFactor = clamp(1.15 - heatLevel, 0.08, 1.2);

  for (let i = 0; i < atomsH.length; i++) {
    const a = atomsH[i];
    if (!a.alive) continue;
    const ca = moleculeCenter(a);
    for (let j = i + 1; j < atomsH.length; j++) {
      const b = atomsH[j];
      if (!b.alive) continue;
      const cb = moleculeCenter(b);
      if (dist(ca, cb) > 52) continue;
      if (Math.random() < 0.012 * coolingFactor) {
        a.alive = false;
        b.alive = false;
        addMolecule('H2', (ca.x + cb.x) * 0.5, (ca.y + cb.y) * 0.5, { select: false });
        world.stats.reactions += 1;
        break;
      }
    }
  }

  for (let i = 0; i < atomsO.length; i++) {
    const a = atomsO[i];
    if (!a.alive) continue;
    const ca = moleculeCenter(a);
    for (let j = i + 1; j < atomsO.length; j++) {
      const b = atomsO[j];
      if (!b.alive) continue;
      const cb = moleculeCenter(b);
      if (dist(ca, cb) > 58) continue;
      if (Math.random() < 0.008 * coolingFactor) {
        a.alive = false;
        b.alive = false;
        addMolecule('O2', (ca.x + cb.x) * 0.5, (ca.y + cb.y) * 0.5, { select: false });
        world.stats.reactions += 1;
        break;
      }
    }
  }

  for (const o of atomsO) {
    if (!o.alive) continue;
    const co = moleculeCenter(o);
    const nearH = atomsH.filter(h => h.alive && dist(moleculeCenter(h), co) < 62).slice(0, 2);
    if (nearH.length < 2) continue;
    if (Math.random() < 0.006 * coolingFactor) {
      o.alive = false;
      nearH[0].alive = false;
      nearH[1].alive = false;
      addMolecule('H2O', co.x + rand(-8, 8), co.y + rand(-8, 8), { select: false });
      world.stats.reactions += 1;
    }
  }
}

function maybeDecomposePeroxide(heatLevel) {
  if (heatLevel < 0.68) return;
  const peroxides = world.molecules.filter(m => m.alive && m.type === 'H2O2');
  for (const p of peroxides) {
    if (Math.random() > (0.002 + heatLevel * 0.01)) continue;
    const c = moleculeCenter(p);
    p.alive = false;
    const w = addMolecule('H2O', c.x - 16, c.y + 4, { select: false });
    const o = addAtom('O', c.x + 20, c.y - 6, { select: false });
    for (const a of [...w.atoms, ...o.atoms]) {
      a.vx += rand(-1.2, 1.2);
      a.vy += rand(-1.1, 0.8);
    }
    world.stats.reactions += 1;
    break;
  }
}
