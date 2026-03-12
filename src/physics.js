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
  const pointerId = world.light.pointerId;
  if (pointerId != null && canvas.hasPointerCapture?.(pointerId)) {
    canvas.releasePointerCapture(pointerId);
  }
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

function getLuminescencePhaseScale(mol, response) {
  const phaseScale = response.phaseEmissionScale?.[mol.phase];
  let scale = phaseScale == null
    ? (mol.phase === 'gas' ? 1 : mol.phase === 'liquid' ? 0.72 : mol.phase === 'particle' ? 0.5 : 0.42)
    : phaseScale;
  if (mol.dissolved) scale *= 0.42;
  if (response.lineEmitter && mol.phase !== 'gas') scale *= 0.55;
  return scale;
}

function applyLightExcitation(dt) {
  for (const mol of world.molecules) {
    if (!mol.alive) continue;
    mol.photoExcitation = Math.max(0, (mol.photoExcitation || 0) - dt * 0.45);
    const emissionDecay = 1 / Math.max(0.12, mol.emissionLifetime || 0.30);
    mol.emissionGlow = Math.max(0, (mol.emissionGlow || 0) - dt * emissionDecay);
    if (mol.emissionGlow < 0.015) mol.emissionGlow = 0;
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
    const visibleBand = isVisibleLightBand(band.id);
    const bandBoost = band.photochemical ? 1.15 : (visibleBand ? 0.55 : 0.25);
    const excitationGain = bestHit * dt * 5.2 * bandBoost * response.absorption * response.excitationMultiplier;
    const canEmitVisible = response.emissionStrength > 0 &&
      response.emittedBand === 'visible' &&
      materialRespondsToLightBand(response.luminescenceBands, band.id);
    const emissionBandBoost = band.id === 'uv' ? 1.16 : (visibleBand ? 0.88 : 0.52);
    const visibleEmissionGain = canEmitVisible
      ? excitationGain * response.emissionStrength * getLuminescencePhaseScale(mol, response) * emissionBandBoost
      : 0;
    mol.photoExcitation = clamp((mol.photoExcitation || 0) + excitationGain, 0, 1.8);
    mol.lastLightBand = band.id;
    if (visibleEmissionGain > 0.0006) {
      mol.emissionGlow = clamp((mol.emissionGlow || 0) + visibleEmissionGain * (response.lineEmitter ? 6.8 : 5.2), 0, response.lineEmitter ? 1.7 : 1.35);
      mol.emissionColor = response.emissionColor;
      mol.emissionStyle = response.emissionStyle;
      mol.emissionLifetime = response.emissionLifetime;
    }
    for (const atom of mol.atoms) {
      const baseExcitation = bestHit * dt * (band.photochemical ? 5.0 : 2.6) * response.absorption * response.excitationMultiplier;
      const visibleBoost = canEmitVisible ? (0.34 + response.emissionStrength * 0.95) : 0.14;
      atom.excited = clamp((atom.excited || 0) + baseExcitation * (0.45 + visibleBoost) + rand(0.005, 0.03), 0, 1.4);
      atom.excitedColor = canEmitVisible ? response.emissionColor : band.color;
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

function pinDraggedMolecule(mol, b, dt, allowStretch = false) {
  if (!mol || !b) return;
  const anchor = mol.atoms.find(atom => atom.id === world.dragging.atomId) || mol.atoms[0];
  if (!anchor) return;
  const dx = world.dragging.targetX - anchor.x;
  const dy = world.dragging.targetY - anchor.y;
  const dragMotion = Math.hypot(world.dragging.momentumX, world.dragging.momentumY);
  const carry = clamp(0.82 + dragMotion * 0.006, 0.82, 0.94);

  for (const atom of mol.atoms) {
    if (atom === anchor) continue;
    atom.x += dx * carry;
    atom.y += dy * carry;
  }

  anchor.x = world.dragging.targetX;
  anchor.y = world.dragging.targetY;
  anchor.fx = 0;
  anchor.fy = 0;
  anchor.vx = world.dragging.momentumX * 0.18;
  anchor.vy = world.dragging.momentumY * 0.18;

  for (const atom of mol.atoms) {
    if (atom === anchor) continue;
    atom.fx = 0;
    atom.fy = 0;
    atom.vx *= 0.992;
    atom.vy *= 0.992;
  }

  if (allowStretch && mol.atoms.length > 1 && dragMotion > 0.08) {
    const center = moleculeCenter(mol);
    const radius = Math.max(10, moleculeRadius(mol));
    const dragDirX = world.dragging.momentumX / dragMotion;
    const dragDirY = world.dragging.momentumY / dragMotion;
    const tangentX = -dragDirY;
    const tangentY = dragDirX;
    const stretch = clamp(dragMotion * 0.010, 0, 0.22);

    for (const atom of mol.atoms) {
      if (atom === anchor) continue;
      const relX = atom.x - center.x;
      const relY = atom.y - center.y;
      const along = (relX * dragDirX + relY * dragDirY) / radius;
      const across = (relX * tangentX + relY * tangentY) / radius;
      const lag = clamp(0.72 - along, 0.08, 0.78);
      atom.vx -= dragDirX * stretch * lag;
      atom.vy -= dragDirY * stretch * lag;
      atom.vx += tangentX * across * stretch * 0.16;
      atom.vy += tangentY * across * stretch * 0.16;
    }
  }

  keepMoleculeInsideVessel(mol, b);
  const postAnchor = mol.atoms.find(atom => atom.id === world.dragging.atomId) || anchor;
  if (postAnchor) {
    const fixX = world.dragging.targetX - postAnchor.x;
    const fixY = world.dragging.targetY - postAnchor.y;
    for (const atom of mol.atoms) {
      atom.x += fixX;
      atom.y += fixY;
    }
    postAnchor.x = world.dragging.targetX;
    postAnchor.y = world.dragging.targetY;
  }
  limitMoleculeBondStretch(mol, 1.14, anchor.id);
  if (allowStretch) {
    const dragDecay = Math.pow(0.00018, dt);
    world.dragging.momentumX *= dragDecay;
    world.dragging.momentumY *= dragDecay;
  }
}

function limitMoleculeBondStretch(mol, maxStretchScale = 1.14, pinnedAtomId = null) {
  if (!mol?.bonds?.length) return;

  for (const bond of mol.bonds) {
    const a = mol.atoms[bond.a];
    const b = mol.atoms[bond.b];
    const maxLength = (bond.rest || 30) * maxStretchScale;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distNow = Math.hypot(dx, dy);
    if (!Number.isFinite(distNow) || distNow <= maxLength || distNow < 1e-6) continue;

    const excess = distNow - maxLength;
    const nx = dx / distNow;
    const ny = dy / distNow;
    const aPinned = pinnedAtomId != null && a.id === pinnedAtomId;
    const bPinned = pinnedAtomId != null && b.id === pinnedAtomId;

    if (aPinned && !bPinned) {
      b.x -= nx * excess;
      b.y -= ny * excess;
      b.vx -= nx * excess * 0.12;
      b.vy -= ny * excess * 0.12;
      continue;
    }

    if (bPinned && !aPinned) {
      a.x += nx * excess;
      a.y += ny * excess;
      a.vx += nx * excess * 0.12;
      a.vy += ny * excess * 0.12;
      continue;
    }

    const half = excess * 0.5;
    a.x += nx * half;
    a.y += ny * half;
    b.x -= nx * half;
    b.y -= ny * half;
    a.vx += nx * half * 0.10;
    a.vy += ny * half * 0.10;
    b.vx -= nx * half * 0.10;
    b.vy -= ny * half * 0.10;
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

  applyLightExcitation(dt);
  applyStirring(dt);
  applyMoleculeRepulsion(dt);

  for (const mol of world.molecules) {
    const isDragged = world.dragging.mol?.id === mol.id;
    const recoveryTimeLeft = Math.max(0, (mol.dragRecoveryUntil || 0) - world.time);
    const recoveryDuration = Math.max(0.001, mol.dragRecoveryDuration || 0.85);
    const recoveryProgress = recoveryTimeLeft > 0 ? clamp(recoveryTimeLeft / recoveryDuration, 0, 1) : 0;
    const recoveryStrength = mol.dragRecoveryStrength || 1;
    const releaseBondBoost = 1 + recoveryProgress * 2.35 * recoveryStrength;
    const releaseDampingBoost = 1 + recoveryProgress * 2.0 * recoveryStrength;
    const dragBondBoost = isDragged ? 3.1 : releaseBondBoost;
    const dragDampingBoost = isDragged ? 2.4 : releaseDampingBoost;
    for (const bond of mol.bonds) {
      const a = mol.atoms[bond.a];
      const c = mol.atoms[bond.b];
      const k = 0.26 + 0.10 * bond.order;
      springBond(a, c, bond.rest, k * dragBondBoost, 0.28 * dragDampingBoost, 1);
    }

    for (const shape of (mol.shapeConstraints || [])) {
      const a = mol.atoms[shape.a];
      const c = mol.atoms[shape.b];
      const wobbleRest = shape.rest * (1 + Math.sin(world.time * 1.9 + shape.phase) * shape.wobble);
      springBond(a, c, wobbleRest, shape.strength * dragBondBoost, shape.damping * dragDampingBoost, 1);
      softRepulsion(a, c, shape.minDist, 0.07);
    }

    for (const ang of mol.angleConstraints) {
      const angleStrength = isDragged
        ? 0.082
        : 0.032 * (1 + recoveryProgress * 2.0 * recoveryStrength);
      applyAngleConstraint(mol, ang, angleStrength, dt);
    }
  }

  for (const mol of world.molecules) {
    const center = moleculeCenter(mol);
    const isDragged = world.dragging.mol?.id === mol.id;

    if (!isDragged && mol.phase === 'gas') {
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

    const condensedLayer = (mol.phase === 'liquid' || mol.phase === 'solid')
      ? liquidLayout.layers.find(entry => entry.layerKey === getLiquidLayerKey(mol))
      : null;
    const solidAnchor = (mol.phase === 'solid' && condensedLayer)
      ? getSolidLayerAnchor(mol, condensedLayer, b)
      : null;

    if (!isDragged && (mol.phase === 'particle' || mol.phase === 'solid')) {
      const settleBase = clamp((mol.density || 1) * 0.42, 0.18, 1.2);
      const settle = mol.phase === 'solid' && condensedLayer ? settleBase * 0.38 : settleBase;
      const yNorm = clamp((center.y - b.y) / b.h, 0, 1);
      const targetYNorm = mol.phase === 'solid' && condensedLayer
        ? clamp(((solidAnchor?.y ?? condensedLayer.centerY) - b.y) / b.h, 0.16, 0.95)
        : null;
      const layerBias = targetYNorm == null ? 0 : (targetYNorm - yNorm) * 10.5;
      const layerBiasX = solidAnchor ? (solidAnchor.x - center.x) * 0.0105 : 0;
      for (const a of mol.atoms) {
        a.fy += settle * (mol.phase === 'solid' ? 1.15 : 1) + layerBias;
        if (layerBiasX) a.fx += layerBiasX;
        a.vx *= mol.phase === 'solid' ? 0.972 : 0.985;
        a.vy *= mol.phase === 'solid' ? 0.982 : 0.992;
      }
    }

    if (!isDragged && mol.phase === 'liquid') {
      const yNorm = clamp((center.y - b.y) / b.h, 0, 1);
      const targetYNorm = condensedLayer
        ? clamp((condensedLayer.centerY - b.y) / b.h, 0.16, 0.93)
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

    if (!isDragged) {
      const boundaryTargetX = solidAnchor?.x ?? (b.x + b.w * 0.5);
      const boundaryPullStrength = solidAnchor ? 0.0018 : 0.0008;
      const boundaryPullX = (boundaryTargetX - center.x) * boundaryPullStrength;
      for (const a of mol.atoms) {
        a.fx += boundaryPullX;
      }
    }

    const recoveryTimeLeft = Math.max(0, (mol.dragRecoveryUntil || 0) - world.time);
    if (recoveryTimeLeft > 0 && !isDragged) {
      const recoveryDuration = Math.max(0.001, mol.dragRecoveryDuration || 0.85);
      const recoveryProgress = clamp(recoveryTimeLeft / recoveryDuration, 0, 1);
      const recoveryStrength = mol.dragRecoveryStrength || 1;
      const settle = recoveryProgress * recoveryStrength;
      for (const a of mol.atoms) {
        a.vx *= 1 - Math.min(0.12, settle * 0.06);
        a.vy *= 1 - Math.min(0.12, settle * 0.06);
      }
      limitMoleculeBondStretch(mol, 1.08 + (1 - recoveryProgress) * 0.04);
      if (recoveryTimeLeft <= dt * 1.2) {
        mol.dragRecoveryUntil = 0;
        mol.dragRecoveryStrength = 1;
      }
    }

    const baseDamp = isDragged
      ? 0.9945
      : (mol.phase === 'gas' || mol.phase === 'particle' || mol.phase === 'solid'
          ? (0.996 - ambientHeat * 0.005 - Math.max(0, pressureAtm - 1) * 0.0016)
        : (0.993 - ambientHeat * 0.0025));

    for (const a of mol.atoms) {
      a.vx *= baseDamp;
      a.vy *= baseDamp;

      a.vx += (a.fx / a.m) * dt * 60;
      a.vy += (a.fy / a.m) * dt * 60;

      const vmax = isDragged
        ? (2.4 + ambientHeat * 2.6)
        : ((mol.phase === 'gas' || mol.phase === 'particle' || mol.phase === 'solid')
          ? (1.9 + ambientHeat * 3.8) * thermalScale * clamp(1.1 - Math.max(0, pressureAtm - 1) * 0.08, 0.65, 1.18)
          : (1.1 + ambientHeat * 1.0) * Math.min(thermalScale, 1.7));
      const cappedVmax = (mol.phase === 'solid' && !isDragged) ? Math.min(vmax, 0.75 + ambientHeat * 0.35) : vmax;

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
    if (!isDragged) {
      confineMoleculeToPhaseZone(mol, b, liquidLayout, dt);
    }
  }

  updateSolidLayerSnapAnimations(dt, liquidLayout);

  handleDissolution(dt);
  handleCarbonation(dt, ambientTempC, pressureAtm);
  handleAqueousIonChemistry(dt, ambientTempC, pressureAtm);
  handleLiquidMixing(dt);
  handlePhaseTransitions(dt, ambientTempC, pressureAtm);
  runScriptedReactions(dt, ambientTempC, pressureAtm);

  if (world.dragging.mol?.alive) {
    pinDraggedMolecule(world.dragging.mol, b, dt, true);
  }

  world.molecules = world.molecules.filter(m => m.alive);

  if (world.selectedMolId && !world.molecules.some(m => m.id === world.selectedMolId)) {
    world.selectedMolId = null;
    markSidebarDirty();
  }

  if (world.dragging.mol && !world.molecules.some(m => m.id === world.dragging.mol.id)) {
    clearDraggingState();
  }
}
