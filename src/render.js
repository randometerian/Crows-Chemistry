function drawGrid(w, h) {
  ctx.save();
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid').trim();
  ctx.lineWidth = 1;

  for (let x = 0; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLiquidLayerBadge(layer, b) {
  const labelType = layer.layerKey === 'water' ? 'H2O' : layer.layerKey;
  let title = getSpeciesDisplayName(labelType);
  if (labelType === 'H2O') {
    if (layer.phaseTag === 'solid') title = 'Ice';
    else if (layer.phaseTag === 'condensed') title = 'Water / Ice';
    else if (layer.layerKey === 'water' && layer.dissolvedTypes.includes('CO2')) title = 'Carbonated water';
    else title = 'Water';
  } else if (layer.phaseTag === 'solid') {
    title = `Solid ${title}`;
  }
  const detailParts = [];
  if (layer.phaseTag === 'solid') detailParts.push('frozen phase');
  else if (layer.phaseTag === 'condensed' && layer.solidCount > 0 && layer.liquidCount > 0) {
    detailParts.push(`${layer.liquidCount} liquid • ${layer.solidCount} solid`);
  }
  if (layer.boilingIntensity > 0.12) detailParts.push('boiling');
  if (layer.chemistry) detailParts.push(layer.chemistry.chemistryLabel);
  if (layer.dissolvedTypes.length) {
    detailParts.push(layer.dissolvedTypes.slice(0, 2).map(getSpeciesDisplayLabel).join(', '));
  }
  if (layer.chemistry?.majorIons.length) {
    detailParts.push(layer.chemistry.majorIons.slice(0, 2).map(entry => formatIonLabel(entry.ion)).join(', '));
  }
  const detail = detailParts.join('  •  ');
  const badgeX = b.x + 10;
  const badgeY = layer.y + Math.max(8, Math.min(18, layer.h * 0.18));
  const titleFont = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
  const detailFont = '10px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = titleFont;
  const titleWidth = ctx.measureText(title).width;
  ctx.font = detailFont;
  const detailWidth = detail ? ctx.measureText(detail).width : 0;
  const contentWidth = Math.max(titleWidth, detailWidth);
  const badgeWidth = Math.min(b.w - 26, Math.max(108, contentWidth + 22));
  const badgeHeight = detail ? 34 : 22;

  ctx.fillStyle = 'rgba(11,16,24,0.56)';
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(244,247,252,0.96)';
  ctx.font = titleFont;
  ctx.fillText(title, badgeX + 11, badgeY + 7);

  if (detail) {
    ctx.fillStyle = 'rgba(210,219,232,0.88)';
    ctx.font = detailFont;
    ctx.fillText(detail, badgeX + 11, badgeY + 21);
  }
  ctx.restore();
}

function drawLiquidLayerActivity(layer, b) {
  const liquidLike = layer.liquidCount > 0;
  if (!liquidLike || layer.h < 12) return;

  const left = b.x + 4;
  const width = b.w - 8;
  const t = world.time;
  const boiling = clamp(layer.boilingIntensity || 0, 0, 1.35);
  const waveAmp = 0.8 + boiling * 1.5;
  const crestY = layer.y + Math.min(12, Math.max(4, layer.h * 0.10));

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(left, layer.y, width, layer.h, 12);
  ctx.clip();

  ctx.strokeStyle = colorWithAlpha('#ffffff', 0.06 + boiling * 0.08);
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let i = 0; i <= 16; i++) {
    const x = left + (width * i) / 16;
    const y = crestY + Math.sin(t * 2.2 + i * 0.65 + layer.centerY * 0.015) * waveAmp;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const shimmer = ctx.createLinearGradient(left, layer.y, left, layer.y + layer.h);
  shimmer.addColorStop(0, `rgba(255,255,255,${0.05 + boiling * 0.03})`);
  shimmer.addColorStop(0.5, 'rgba(255,255,255,0.01)');
  shimmer.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = shimmer;
  ctx.fillRect(left, layer.y, width, Math.max(10, layer.h * 0.42));

  if (boiling > 0.05) {
    const bubbleCount = Math.min(16, 3 + Math.round(layer.count * 0.05 + boiling * 8));
    for (let i = 0; i < bubbleCount; i++) {
      const px = left + 12 + (((i * 53.7) + t * (18 + i * 3.2) * 12) % Math.max(24, width - 24));
      const rise = ((t * (14 + i * 1.9)) + i * 17) % Math.max(24, layer.h + 22);
      const py = layer.y + layer.h - rise;
      const radius = 1.4 + (i % 3) * 0.55 + boiling * 0.3;
      ctx.fillStyle = `rgba(255,255,255,${0.12 + boiling * 0.10})`;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${0.18 + boiling * 0.12})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(px, py, radius + 0.8, 0, TAU);
      ctx.stroke();
    }
  }

  ctx.restore();

  if (boiling > 0.08) {
    const vaporCount = 4 + Math.round(boiling * 6);
    for (let i = 0; i < vaporCount; i++) {
      const px = left + 16 + (((i * 61) + t * (22 + i * 2.7) * 9) % Math.max(28, width - 32));
      const lift = ((t * (10 + i * 1.3)) + i * 11) % 24;
      const py = layer.y - 6 - lift;
      ctx.fillStyle = `rgba(236,244,255,${0.07 + boiling * 0.07})`;
      ctx.beginPath();
      ctx.arc(px, py, 1.2 + (i % 2) * 0.6, 0, TAU);
      ctx.fill();
    }
  }
}

function drawVessel() {
  const b = world.bounds;
  ctx.save();

  ctx.fillStyle = 'rgba(255,255,255,.02)';
  ctx.strokeStyle = 'rgba(220,230,245,.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, 16);
  ctx.fill();
  ctx.stroke();

  if (world.molecules.length === 0) {
    ctx.fillStyle = 'rgba(255,255,255,.04)';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add atoms or molecules from the Library', b.x + b.w / 2, b.y + b.h / 2 - 12);
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(152,166,184,.8)';
    ctx.fillText('The sandbox starts empty.', b.x + b.w / 2, b.y + b.h / 2 + 12);
  }

  const liquidLayout = getLiquidLayerLayout();
  if (liquidLayout.surfaceY != null && liquidLayout.condensedHeight > 0 && liquidLayout.layers.length === 0) {
    ctx.fillStyle = 'rgba(214,225,240,0.05)';
    ctx.beginPath();
    ctx.roundRect(b.x + 3, liquidLayout.surfaceY, b.w - 6, liquidLayout.condensedHeight, 12);
    ctx.fill();
  }
  if (liquidLayout.layers.length > 0) {
    for (const layer of liquidLayout.layers) {
      const alpha = layer.phaseTag === 'solid'
        ? (0.16 + layer.count * 0.018)
        : (0.10 + layer.count * 0.02);
      ctx.fillStyle = colorWithAlpha(layer.color, alpha);
      ctx.beginPath();
      ctx.roundRect(b.x + 3, layer.y, b.w - 6, layer.h, 12);
      ctx.fill();
      drawLiquidLayerActivity(layer, b);

      if (layer.h >= 28) {
        drawLiquidLayerBadge(layer, b);
      }
    }

  }

  if (liquidLayout.surfaceY != null && liquidLayout.condensedHeight > 0) {
    ctx.strokeStyle = 'rgba(255,255,255,.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(b.x + 8, liquidLayout.surfaceY);
    ctx.lineTo(b.x + b.w - 8, liquidLayout.surfaceY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = 'rgba(255,255,255,.04)';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('vessel', b.x + 12, b.y + 10);

  ctx.restore();
}

function drawBond(a, b, order) {
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const nx = Math.sin(ang);
  const ny = -Math.cos(ang);

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--bond').trim();
  ctx.lineCap = 'round';
  ctx.lineWidth = 2 + order * 0.8;

  if (order === 2) {
    for (const sign of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(a.x + nx * 3 * sign, a.y + ny * 3 * sign);
      ctx.lineTo(b.x + nx * 3 * sign, b.y + ny * 3 * sign);
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  const count = order === 2 ? 4 : 2;
  const midX = (a.x + b.x) * 0.5;
  const midY = (a.y + b.y) * 0.5;

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--e').trim();
  ctx.globalAlpha = 0.68;
  for (let i = 0; i < count; i++) {
    const lane = (i - (count - 1) / 2) * 4;
    ctx.beginPath();
    ctx.arc(midX + nx * lane, midY + ny * lane, 1.85, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

function drawAtom(atom, loneDots, t, selected = false, phase = 'particle') {
  const style = elementStyles[atom.el];
  const excitement = clamp(atom.excited || 0, 0, 1.4);
  const shellR = style.r + 9 + excitement * 2.5;
  const isSolid = phase === 'solid';
  const atomFill = isSolid ? '#e8f7ff' : style.color;
  const shadowColor = isSolid ? 'rgba(218,242,255,0.48)' : colorWithAlpha(style.color, selected ? 0.55 : 0.35);

  ctx.save();

  if (excitement > 0.02) {
    const excitedColor = atom.excitedColor || '#ffeca5';
    ctx.strokeStyle = colorWithAlpha(excitedColor, 0.20 + excitement * 0.22);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, style.r + 4 + excitement * 2, 0, TAU);
    ctx.stroke();
  }

  if (loneDots > 0) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--e').trim();
    ctx.globalAlpha = 0.58 + excitement * 0.12;

    for (let i = 0; i < loneDots; i++) {
      const ang = t * (0.0011 + excitement * 0.0013) + atom.phase + (i / loneDots) * TAU;
      const wobble = 1 + Math.sin(t * 0.009 + atom.phase * 3 + i) * excitement * 0.22;
      const ex = atom.x + Math.cos(ang) * shellR * wobble;
      const ey = atom.y + Math.sin(ang) * shellR * wobble;
      ctx.beginPath();
      ctx.arc(ex, ey, 1.45 + excitement * 0.35, 0, TAU);
      ctx.fill();
    }
  }

  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = isSolid ? (selected ? 18 : 12) : (selected ? 16 : 10);

  ctx.fillStyle = atomFill;
  ctx.beginPath();
  ctx.arc(atom.x, atom.y, style.r, 0, TAU);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = isSolid
    ? (selected ? 'rgba(255,255,255,.82)' : 'rgba(220,245,255,.52)')
    : (selected ? 'rgba(255,255,255,.42)' : 'rgba(255,255,255,.12)');
  ctx.lineWidth = isSolid ? (selected ? 2.3 : 1.5) : (selected ? 2 : 1);
  ctx.stroke();

  if (isSolid) {
    ctx.strokeStyle = 'rgba(255,255,255,0.34)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, style.r + 3.2, 0, TAU);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(10,14,20,.9)';
  ctx.font = `700 ${Math.max(11, style.r * 0.75)}px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(atom.el, atom.x, atom.y + 0.5);

  ctx.restore();
}

function drawLightOverlay() {
  if (!world.light.rays.length) return;

  ctx.save();
  if (world.light.source) {
    const band = getLightBand(world.light.band);
    ctx.fillStyle = colorWithAlpha(band.color, 0.9);
    ctx.beginPath();
    ctx.arc(world.light.source.x, world.light.source.y, 4.2, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = colorWithAlpha(band.color, 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(world.light.source.x, world.light.source.y, 7.5, 0, TAU);
    ctx.stroke();
  }
  for (const ray of world.light.rays) {
    if (!ray.length || ray.length <= 0.001) continue;
    const visibleLength = Math.min(ray.length, world.light.travel || 0);
    if (visibleLength <= 2) continue;
    const endX = ray.start.x + ((ray.end.x - ray.start.x) / ray.length) * visibleLength;
    const endY = ray.start.y + ((ray.end.y - ray.start.y) / ray.length) * visibleLength;
    ctx.strokeStyle = colorWithAlpha(ray.color, 0.82);
    ctx.lineWidth = Math.max(0.44, ray.visualWidth * 0.84);
    ctx.lineCap = 'round';
    ctx.setLineDash([36, 16]);
    ctx.lineDashOffset = -(world.time * 104);
    ctx.beginPath();
    ctx.moveTo(ray.start.x, ray.start.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    ctx.fillStyle = colorWithAlpha(ray.color, 0.9);
    ctx.beginPath();
    ctx.arc(endX, endY, Math.max(0.72, ray.visualWidth * 0.62 + 0.18), 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function renderMoleculeBody(mol, t) {
  for (const bond of mol.bonds) {
    const a = mol.atoms[bond.a];
    const b = mol.atoms[bond.b];
    drawBond(a, b, bond.order);
  }

  const selected = world.selectedMolId === mol.id;
  for (let i = 0; i < mol.atoms.length; i++) {
    drawAtom(mol.atoms[i], getLoneElectronCount(mol, i), t, selected, mol.phase);
  }
}

function drawSolidLayerSnapEffect(mol) {
  const snap = mol.layerSnap;
  if (!snap || snap.status !== 'active') return null;

  const progress = clamp((world.time - snap.startedAt) / Math.max(0.001, snap.duration || 0.28), 0, 1);
  const center = moleculeCenter(mol);
  const radius = moleculeRadius(mol);
  const targetX = snap.toX ?? center.x;
  const targetY = snap.toY ?? center.y;
  const travelAlpha = 1 - progress;

  ctx.save();
  ctx.strokeStyle = colorWithAlpha(mol.color || '#dff4ff', 0.12 + travelAlpha * 0.22);
  ctx.lineWidth = 1.2 + travelAlpha * 1.4;
  ctx.setLineDash([8, 7]);
  ctx.lineDashOffset = -(world.time * 42);
  ctx.beginPath();
  ctx.moveTo(snap.fromX ?? center.x, snap.fromY ?? center.y);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = colorWithAlpha(mol.color || '#dff4ff', 0.06 + travelAlpha * 0.14);
  ctx.beginPath();
  ctx.arc(targetX, targetY, radius + 10 + travelAlpha * 16, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = `rgba(243,251,255,${0.18 + travelAlpha * 0.28})`;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(targetX, targetY, radius + 4 + Math.sin(progress * Math.PI) * 8, 0, TAU);
  ctx.stroke();
  ctx.restore();

  return { progress, center };
}

function drawMolecule(mol, t) {
  const snapState = drawSolidLayerSnapEffect(mol);
  if (!snapState) {
    renderMoleculeBody(mol, t);
    return;
  }

  const popScale = 1 + Math.sin(snapState.progress * Math.PI) * 0.12 - (1 - snapState.progress) * 0.06;
  ctx.save();
  ctx.globalAlpha = 0.90 + Math.sin(snapState.progress * Math.PI) * 0.10;
  ctx.translate(snapState.center.x, snapState.center.y);
  ctx.scale(popScale, popScale);
  ctx.translate(-snapState.center.x, -snapState.center.y);
  renderMoleculeBody(mol, t);
  ctx.restore();
}

function drawHeatOverlay() {
  const effectiveTempC = getEffectiveTemperatureC();
  const amount = tempToHeatLevel(effectiveTempC);
  const cooling = clamp((-world.heatPulseC) / 700, 0, 1);
  if (amount < 0.02 && cooling < 0.02) return;

  ctx.save();
  const g = ctx.createLinearGradient(0, window.innerHeight, 0, 0);
  g.addColorStop(0, `rgba(255,138,82,${0.02 + amount * 0.10})`);
  g.addColorStop(0.45, `rgba(255,208,142,${0.01 + amount * 0.05})`);
  g.addColorStop(1, `rgba(120,188,255,${cooling * 0.07})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  if (amount > 0.10) {
    ctx.globalAlpha = 0.05 + amount * 0.08;
    ctx.strokeStyle = 'rgba(255,207,150,.45)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 7; i++) {
      const x = ((world.time * 70) + i * 160) % (window.innerWidth + 180) - 90;
      const y = window.innerHeight - 90 - i * 18;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - 14, y - 24, x + 14, y - 44, x, y - 68);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawThermalEvents() {
  if (!world.thermalEvents.length) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const event of world.thermalEvents) {
    const life = 1 - event.age / event.ttl;
    const radius = 18 + (1 - life) * 26;
    const y = event.y - (1 - life) * 24;
    const hot = event.deltaC >= 0;
    const color = hot ? `rgba(255,179,120,${0.12 + life * 0.20})` : `rgba(144,205,255,${0.12 + life * 0.18})`;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(event.x, y, radius, 0, TAU);
    ctx.fill();

    ctx.strokeStyle = hot ? `rgba(255,214,170,${life * 0.50})` : `rgba(190,226,255,${life * 0.46})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(event.x, y, radius + 5, 0, TAU);
    ctx.stroke();

    ctx.fillStyle = hot ? `rgba(255,233,210,${life})` : `rgba(216,241,255,${life})`;
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
    ctx.fillText(event.label || formatThermalDelta(event.deltaC), event.x, y - radius - 10);
  }

  ctx.restore();
}

function drawScene() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const now = performance.now();

  ctx.clearRect(0, 0, w, h);
  drawGrid(w, h);
  drawVessel();
  drawLightOverlay();

  for (const mol of world.molecules) {
    drawMolecule(mol, now);
  }

  drawHeatOverlay();
  drawThermalEvents();
}
