function startStirring(duration = 6.8, power = world.stirStrength) {
  world.stirring.timeLeft = Math.max(world.stirring.timeLeft, duration);
  world.stirring.power = Math.max(world.stirring.power, power);
  addReactionLog('tool', `Stirrer engaged at ${power.toFixed(1)}x`);
  updateThermalLabels();
}

function applyStirring(dt) {
  if (world.stirring.timeLeft <= 0 || !world.bounds) {
    world.stirring.timeLeft = 0;
    world.stirring.power = 0;
    return;
  }

  world.stirring.timeLeft = Math.max(0, world.stirring.timeLeft - dt);
  const b = world.bounds;
  const cx = b.x + b.w * 0.5;
  const cy = b.y + b.h * 0.58;
  const swirl = (0.14 + world.stirring.power * 0.11) * dt * 60;
  const inward = (0.018 + world.stirring.power * 0.006) * dt * 60;
  const verticalWave = Math.sin(world.time * 3.1) * (0.08 + world.stirring.power * 0.022) * dt * 60;

  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    const center = moleculeCenter(mol);
    const dx = center.x - cx;
    const dy = center.y - cy;
    const radius = Math.max(24, Math.hypot(dx, dy));
    const tangentialX = -dy / radius;
    const tangentialY = dx / radius;
    const radialX = -dx / radius;
    const radialY = -dy / radius;
    const edgeBoost = clamp(radius / Math.max(1, b.w * 0.45), 0.45, 1.45);
    const phaseBoost = mol.phase === 'liquid' ? 1.9 : (mol.phase === 'particle' ? 1.35 : 0.9);
    const centerLift = clamp(1.25 - radius / Math.max(1, b.w * 0.42), 0.3, 1.15);

    for (const atom of mol.atoms) {
      atom.vx += tangentialX * swirl * edgeBoost * phaseBoost;
      atom.vy += tangentialY * swirl * edgeBoost * phaseBoost;
      atom.vx += radialX * inward * phaseBoost;
      atom.vy += radialY * inward * phaseBoost + verticalWave * centerLift * phaseBoost;
    }
  }

  if (world.stirring.timeLeft <= 0.001) {
    world.stirring.timeLeft = 0;
    world.stirring.power = 0;
  }
}


function updatePhysics(dt) {
  const b = world.bounds;
  const ambientTempC = getEffectiveTemperatureC();
  const pressureAtm = getEffectivePressureAtm();
  const ambientHeat = tempToHeatLevel(ambientTempC);
  const thermalScale = Math.sqrt(cToK(ambientTempC) / 298.15);
  const liquidLayout = getLiquidLayerLayout();
  world.heatPulseC *= Math.pow(world.heatPulseC >= 0 ? 0.48 : 0.54, dt);
  if (Math.abs(world.heatPulseC) < 0.08) world.heatPulseC = 0;

  for (const event of world.thermalEvents) {
    event.age += dt;
  }
  world.thermalEvents = world.thermalEvents.filter(event => event.age < event.ttl);

  for (const mol of world.molecules) {
    for (const a of mol.atoms) {
      a.fx = 0;
      a.fy = 0;
    }
  }

  applyStirring(dt);
  applyMoleculeRepulsion(dt);

  for (const mol of world.molecules) {
    for (const bond of mol.bonds) {
      const a = mol.atoms[bond.a];
      const c = mol.atoms[bond.b];
      const k = 0.26 + 0.10 * bond.order;
      springBond(a, c, bond.rest, k, 0.28, 1);
    }

    for (const shape of (mol.shapeConstraints || [])) {
      const a = mol.atoms[shape.a];
      const c = mol.atoms[shape.b];
      const wobbleRest = shape.rest * (1 + Math.sin(world.time * 1.9 + shape.phase) * shape.wobble);
      springBond(a, c, wobbleRest, shape.strength, shape.damping, 1);
      softRepulsion(a, c, shape.minDist, 0.07);
    }

    for (const ang of mol.angleConstraints) {
      applyAngleConstraint(mol, ang, 0.032, dt);
    }
  }

  for (const mol of world.molecules) {
    const center = moleculeCenter(mol);

    if (mol.phase === 'gas') {
      const pressureOffset = pressureAtm - 1;
      const gasTargetX = b.x + b.w * 0.5;
      const gasTargetY = b.y + b.h * 0.28;
      for (const a of mol.atoms) {
        const jitter = (5 + ambientHeat * 9) * thermalScale * clamp(0.82 + pressureAtm * 0.18, 0.55, 2.2);
        a.fx += Math.sin(world.time * 1.8 + a.phase) * jitter * 0.18;
        a.fy += Math.cos(world.time * 2.1 + a.phase * 1.3) * jitter * 0.18;
        a.fx += (gasTargetX - a.x) * pressureOffset * 0.0018;
        a.fy += (gasTargetY - a.y) * pressureOffset * 0.0014;
      }
    }

    if (mol.phase === 'particle') {
      const settle = clamp((mol.density || 1) * 0.42, 0.18, 1.2);
      for (const a of mol.atoms) {
        a.fy += settle;
        a.vx *= 0.985;
        a.vy *= 0.992;
      }
    }

    if (mol.phase === 'liquid') {
      const yNorm = clamp((center.y - b.y) / b.h, 0, 1);
      const targetYNorm = clamp(0.18 + (mol.density / 1.45) * 0.68, 0.16, 0.93);
      const densityBias = (targetYNorm - yNorm) * 12;

      const mixFactor = (mol.miscibleGroup === 'water') ? 0.55 :
                        (mol.miscibleGroup === 'organic-heavy') ? 0.85 : 0.42;

      for (const a of mol.atoms) {
        a.fy += densityBias * mixFactor;
        const drag = 0.989 - ambientHeat * 0.012;
        a.vx *= drag;
        a.vy *= drag;
      }

      const cx = b.x + b.w * 0.5;
      for (const a of mol.atoms) {
        a.fx += (cx - a.x) * 0.004;
      }
    }

    const boundaryPullX = (b.x + b.w * 0.5 - center.x) * 0.0008;
    for (const a of mol.atoms) {
      a.fx += boundaryPullX;
    }

    const baseDamp = mol.phase === 'gas' || mol.phase === 'particle'
      ? (0.996 - ambientHeat * 0.005 - Math.max(0, pressureAtm - 1) * 0.0016)
      : (0.993 - ambientHeat * 0.0025);

    for (const a of mol.atoms) {
      a.vx *= baseDamp;
      a.vy *= baseDamp;

      a.vx += (a.fx / a.m) * dt * 60;
      a.vy += (a.fy / a.m) * dt * 60;

      const vmax = (mol.phase === 'gas' || mol.phase === 'particle')
        ? (1.9 + ambientHeat * 3.8) * thermalScale * clamp(1.1 - Math.max(0, pressureAtm - 1) * 0.08, 0.65, 1.18)
        : (1.1 + ambientHeat * 1.0) * Math.min(thermalScale, 1.7);

      const v = Math.hypot(a.vx, a.vy);
      if (v > vmax) {
        const s = vmax / v;
        a.vx *= s;
        a.vy *= s;
      }

      a.x += a.vx * dt * 60;
      a.y += a.vy * dt * 60;
    }

    keepMoleculeInsideVessel(mol, b);
    confineMoleculeToPhaseZone(mol, b, liquidLayout, dt);
  }

  handleDissolution(dt);
  handleCarbonation(dt, ambientTempC, pressureAtm);
  handleAqueousIonChemistry(dt, ambientTempC, pressureAtm);
  handleLiquidMixing(dt);
  handlePhaseTransitions(dt, ambientTempC, pressureAtm);
  runScriptedReactions(dt, ambientTempC, pressureAtm);
  world.molecules = world.molecules.filter(m => m.alive);

  if (world.selectedMolId && !world.molecules.some(m => m.id === world.selectedMolId)) {
    world.selectedMolId = null;
    markSidebarDirty();
  }
}
