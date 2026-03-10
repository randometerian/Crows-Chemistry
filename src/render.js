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
  if (liquidLayout.layers.length > 0) {
    for (const layer of liquidLayout.layers) {
      ctx.fillStyle = colorWithAlpha(layer.color, 0.10 + layer.count * 0.02);
      ctx.beginPath();
      ctx.roundRect(b.x + 3, layer.y, b.w - 6, layer.h, 12);
      ctx.fill();

      const labelType = layer.layerKey === 'water' ? 'H2O' : layer.layerKey;
      const label = layer.layerKey === 'water' && layer.dissolvedTypes.includes('CO2')
        ? 'Carbonated water'
        : getSpeciesDisplayName(labelType);
      const dissolvedLabel = layer.dissolvedTypes.length
        ? ` + ${layer.dissolvedTypes.slice(0, 3).map(getSpeciesDisplayLabel).join(', ')}${layer.dissolvedTypes.length > 3 ? '...' : ''}`
        : '';
      const chemistryLabel = layer.chemistry
        ? ` • pH ${layer.chemistry.pH.toFixed(1)}${layer.chemistry.majorIons.length ? ` • ${layer.chemistry.majorIons.slice(0, 2).map(entry => formatIonLabel(entry.ion)).join(', ')}` : ''}`
        : '';
      if (layer.h >= 18) {
        ctx.fillStyle = 'rgba(231,237,245,.68)';
        ctx.font = '11px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${label}${dissolvedLabel}${chemistryLabel}`, b.x + 10, layer.centerY);
      }
    }

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

function drawAtom(atom, loneDots, t, selected = false) {
  const style = elementStyles[atom.el];
  const shellR = style.r + 9;

  ctx.save();

  if (loneDots > 0) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--e').trim();
    ctx.globalAlpha = 0.58;

    for (let i = 0; i < loneDots; i++) {
      const ang = t * 0.0011 + atom.phase + (i / loneDots) * TAU;
      const ex = atom.x + Math.cos(ang) * shellR;
      const ey = atom.y + Math.sin(ang) * shellR;
      ctx.beginPath();
      ctx.arc(ex, ey, 1.45, 0, TAU);
      ctx.fill();
    }
  }

  ctx.shadowColor = colorWithAlpha(style.color, selected ? 0.55 : 0.35);
  ctx.shadowBlur = selected ? 16 : 10;

  ctx.fillStyle = style.color;
  ctx.beginPath();
  ctx.arc(atom.x, atom.y, style.r, 0, TAU);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = selected ? 'rgba(255,255,255,.42)' : 'rgba(255,255,255,.12)';
  ctx.lineWidth = selected ? 2 : 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(10,14,20,.9)';
  ctx.font = `700 ${Math.max(11, style.r * 0.75)}px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(atom.el, atom.x, atom.y + 0.5);

  ctx.restore();
}

function drawMolecule(mol, t) {
  for (const bond of mol.bonds) {
    const a = mol.atoms[bond.a];
    const b = mol.atoms[bond.b];
    drawBond(a, b, bond.order);
  }

  const selected = world.selectedMolId === mol.id;
  for (let i = 0; i < mol.atoms.length; i++) {
    drawAtom(mol.atoms[i], getLoneElectronCount(mol, i), t, selected);
  }
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

  for (const mol of world.molecules) {
    drawMolecule(mol, now);
  }

  drawHeatOverlay();
  drawThermalEvents();
}
