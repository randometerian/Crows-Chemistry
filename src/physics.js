function startStirring(duration = 6.8, power = world.stirStrength) {
  world.stirring.timeLeft = Math.max(world.stirring.timeLeft, duration);
  world.stirring.power = Math.max(world.stirring.power, power);
  addReactionLog('tool', `Stirrer engaged at ${power.toFixed(1)}x`);
  updateThermalLabels();
}

function distancePointToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lenSq = dx * dx + dy * dy || 1;
  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq, 0, 1);
  const px = start.x + dx * t;
  const py = start.y + dy * t;
  return Math.hypot(point.x - px, point.y - py);
}

function getLightToolSource(target) {
  const b = world.bounds;
  return { x: b.x + b.w * 0.5, y: b.y - 20 };
}

function buildLightRays(source, target, power, bandId) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const band = getLightBand(bandId);
  const spacing = 5.2;
  const offsets = [-spacing, 0, spacing];
  return offsets.map((offset, index) => ({
    start: { x: source.x + nx * offset, y: source.y + ny * offset },
    end: { x: target.x + nx * offset, y: target.y + ny * offset },
    length,
    visualWidth: index === 1 ? 0.72 : 0.52,
    glowWidth: index === 1 ? 1.2 : 0.9,
    hitWidth: 3.4 + power * 1.05,
    intensity: clamp((index === 1 ? 0.62 : 0.48) + power * 0.22, 0.32, 1),
    color: band.color
  }));
}

function startLightBeam(pointerId, target) {
  world.light.firing = true;
  world.light.pointerId = pointerId;
  world.light.power = world.lightStrength;
  world.light.timeLeft = 0;
  world.light.target = { ...target };
  world.light.source = getLightToolSource(target);
  world.light.rays = buildLightRays(world.light.source, world.light.target, world.light.power, world.light.band);
  world.light.travel = 0;
  world.light.maxTravel = Math.max(0, ...world.light.rays.map(ray => ray.length || 0));
  addReactionLog('tool', `${getLightBand(world.light.band).label} beam engaged at ${world.light.power.toFixed(1)}x`);
  updateThermalLabels();
}

function updateLightBeamTarget(target) {
  if (!world.light.firing || !world.bounds) return;
  world.light.target = {
    x: clamp(target.x, world.bounds.x, world.bounds.x + world.bounds.w),
    y: clamp(target.y, world.bounds.y, world.bounds.y + world.bounds.h)
  };
  world.light.source = getLightToolSource(world.light.target);
  world.light.rays = buildLightRays(world.light.source, world.light.target, world.light.power, world.light.band);
  world.light.maxTravel = Math.max(0, ...world.light.rays.map(ray => ray.length || 0));
  world.light.travel = Math.min(world.light.travel, world.light.maxTravel);
}

function stopLightBeam() {
  world.light.firing = false;
  world.light.pointerId = null;
  world.light.source = null;
  world.light.target = null;
  world.light.rays = [];
  world.light.timeLeft = 0;
  world.light.travel = 0;
  world.light.maxTravel = 0;
  updateThermalLabels();
}

function applyLightExcitation(dt) {
  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    mol.photoExcitation = Math.max(0, (mol.photoExcitation || 0) - dt * 0.45);
    mol.lastLightBand = null;
    for (const atom of mol.atoms) {
      atom.excited = Math.max(0, (atom.excited || 0) - dt * 0.9);
    }
  }

  if (!world.light.firing || !world.bounds || !world.light.rays.length) {
    world.light.timeLeft = 0;
    return;
  }

  world.light.timeLeft += dt;
  world.light.travel = Math.min(world.light.maxTravel, world.light.travel + dt * (680 + world.light.power * 260));
  const b = world.bounds;
  const band = getLightBand(world.light.band);

  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    const center = moleculeCenter(mol);
    if (center.y < b.y || center.y > b.y + b.h) continue;

    let bestHit = 0;
    for (const ray of world.light.rays) {
      const visibleLength = Math.min(ray.length, world.light.travel);
      if (visibleLength <= 2) continue;
      const end = {
        x: ray.start.x + ((ray.end.x - ray.start.x) / ray.length) * visibleLength,
        y: ray.start.y + ((ray.end.y - ray.start.y) / ray.length) * visibleLength
      };
      const beamDistance = distancePointToSegment(center, ray.start, end);
      if (beamDistance > ray.hitWidth + moleculeRadius(mol) * 0.38) continue;
      const laneHit = clamp(1 - beamDistance / Math.max(1, ray.hitWidth + moleculeRadius(mol) * 0.38), 0, 1);
      bestHit = Math.max(bestHit, laneHit * ray.intensity);
    }

    if (bestHit <= 0) continue;
    const response = getMaterialLightResponse(mol.type, band.id);
    const bandBoost = band.photochemical ? 1.15 : (band.id === 'visible' ? 0.55 : 0.25);
    const excitationGain = bestHit * dt * 5.2 * bandBoost * response.absorption * response.excitationMultiplier;
    mol.photoExcitation = clamp((mol.photoExcitation || 0) + excitationGain, 0, 1.8);
    mol.lastLightBand = band.id;
    for (const atom of mol.atoms) {
      atom.excited = clamp((atom.excited || 0) + bestHit * dt * (band.photochemical ? 5.0 : 3.1) * response.absorption * response.excitationMultiplier + rand(0.01, 0.05), 0, 1.4);
      atom.excitedColor = response.emissionColor;
    }
    if (response.lightToHeatFactor > 0) {
      world.heatPulseC = clamp(world.heatPulseC + excitationGain * response.lightToHeatFactor * 0.45, -900, 2200);
    }
  }
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
    const phaseBoost = mol.phase === 'liquid' ? 1.9 : ((mol.phase === 'particle' || mol.phase === 'solid') ? 1.35 : 0.9);
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
  const phasePressureAtm = world.pressureAtm;
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

  applyLightExcitation(dt);
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

    if (mol.phase === 'particle' || mol.phase === 'solid') {
      const settle = clamp((mol.density || 1) * 0.42, 0.18, 1.2);
      for (const a of mol.atoms) {
        a.fy += settle * (mol.phase === 'solid' ? 1.15 : 1);
        a.vx *= mol.phase === 'solid' ? 0.972 : 0.985;
        a.vy *= mol.phase === 'solid' ? 0.982 : 0.992;
      }
    }

    if (mol.phase === 'liquid') {
      const yNorm = clamp((center.y - b.y) / b.h, 0, 1);
      const layer = liquidLayout.layers.find(entry => entry.layerKey === getLiquidLayerKey(mol));
      const targetYNorm = layer
        ? clamp((layer.centerY - b.y) / b.h, 0.16, 0.93)
        : clamp(0.18 + (mol.density / 1.45) * 0.68, 0.16, 0.93);
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

    const baseDamp = mol.phase === 'gas' || mol.phase === 'particle' || mol.phase === 'solid'
      ? (0.996 - ambientHeat * 0.005 - Math.max(0, pressureAtm - 1) * 0.0016)
      : (0.993 - ambientHeat * 0.0025);

    for (const a of mol.atoms) {
      a.vx *= baseDamp;
      a.vy *= baseDamp;

      a.vx += (a.fx / a.m) * dt * 60;
      a.vy += (a.fy / a.m) * dt * 60;

      const vmax = (mol.phase === 'gas' || mol.phase === 'particle' || mol.phase === 'solid')
        ? (1.9 + ambientHeat * 3.8) * thermalScale * clamp(1.1 - Math.max(0, pressureAtm - 1) * 0.08, 0.65, 1.18)
        : (1.1 + ambientHeat * 1.0) * Math.min(thermalScale, 1.7);
      const cappedVmax = mol.phase === 'solid' ? Math.min(vmax, 0.75 + ambientHeat * 0.35) : vmax;

      const v = Math.hypot(a.vx, a.vy);
      if (v > cappedVmax) {
        const s = cappedVmax / v;
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
  handlePhaseTransitions(dt, ambientTempC, phasePressureAtm);
  runScriptedReactions(dt, ambientTempC, pressureAtm);
  world.molecules = world.molecules.filter(m => m.alive);

  if (world.selectedMolId && !world.molecules.some(m => m.id === world.selectedMolId)) {
    world.selectedMolId = null;
    markSidebarDirty();
  }
}
