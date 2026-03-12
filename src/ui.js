function toSelectedUnitTemp(celsius) {
  if (world.ui.tempInputUnit === 'F') return cToF(celsius);
  if (world.ui.tempInputUnit === 'K') return cToK(celsius);
  return celsius;
}

function selectedUnitToCelsius(value) {
  if (world.ui.tempInputUnit === 'F') return fToC(value);
  if (world.ui.tempInputUnit === 'K') return kToC(value);
  return value;
}

function phaseTagKey(value = '') {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized.includes('aqueous')) return 'aqueous';
  if (normalized.includes('liquid')) return 'liquid';
  if (normalized.includes('solid')) return 'solid';
  if (normalized.includes('gas')) return 'gas';
  if (normalized.includes('particle')) return 'particle';
  if (normalized.includes('condensed')) return 'condensed';
  if (normalized.includes('data')) return 'data';
  return normalized || 'data';
}

function phaseTagDisplay(label, phase = label, options = {}) {
  const phaseKey = phaseTagKey(phase);
  if (phaseKey === 'particle' && !options.isAtom) {
    return { label: 'solid', phase: 'solid' };
  }
  return { label, phase };
}

function phaseTagMarkup(label, phase = label, options = {}) {
  const display = phaseTagDisplay(label, phase, options);
  return `<div class="phaseTag phase-${phaseTagKey(display.phase)}">${display.label}</div>`;
}

function emptyStateMarkup(icon, title, message) {
  return `
    <div class="emptyStateInner">
      <div class="emptyStateIcon" aria-hidden="true">
        <i data-lucide="${icon}"></i>
      </div>
      <strong>${title}</strong>
      <div class="small">${message}</div>
    </div>
  `;
}

const SCENE_PRESETS = [
  {
    key: 'layer-stack',
    name: 'Layer Stack',
    note: 'Heavy solvent below water with a chlorine headspace for density and phase demos.',
    settings: { temperatureC: 18, pressureAtm: 1, lightBand: 'visible-blue' },
    groups: [
      { type: 'H2O', count: 14, x: 0.48, y: 0.73, spreadX: 220, spreadY: 92 },
      { type: 'CH2Cl2', count: 10, x: 0.52, y: 0.82, spreadX: 200, spreadY: 72 },
      { type: 'Cl2', count: 5, x: 0.50, y: 0.24, spreadX: 220, spreadY: 68 }
    ]
  },
  {
    key: 'uv-chlorination',
    name: 'UV Chlorination',
    note: 'Methane and chlorine staged for the photochemical chain under UV.',
    settings: { temperatureC: 52, pressureAtm: 1.15, lightBand: 'uv' },
    groups: [
      { type: 'CH4', count: 6, x: 0.42, y: 0.25, spreadX: 160, spreadY: 72 },
      { type: 'Cl2', count: 6, x: 0.58, y: 0.25, spreadX: 170, spreadY: 72 }
    ]
  },
  {
    key: 'pressure-synthesis',
    name: 'Pressure Synthesis',
    note: 'CO and hydrogen loaded for methanol synthesis at industrial-like pressure.',
    settings: { temperatureC: 240, pressureAtm: 60, lightBand: 'infrared' },
    groups: [
      { type: 'CO', count: 5, x: 0.42, y: 0.28, spreadX: 170, spreadY: 74 },
      { type: 'H2', count: 10, x: 0.58, y: 0.28, spreadX: 200, spreadY: 80 }
    ]
  },
  {
    key: 'carbon-capture',
    name: 'Carbon Capture',
    note: 'Water, caustic soda, and CO2 for bicarbonate and carbonate pathways.',
    settings: { temperatureC: 34, pressureAtm: 1.4, lightBand: 'visible-green' },
    groups: [
      { type: 'H2O', count: 12, x: 0.50, y: 0.74, spreadX: 210, spreadY: 88 },
      { type: 'NaOH', count: 8, x: 0.50, y: 0.76, spreadX: 170, spreadY: 60 },
      { type: 'CO2', count: 6, x: 0.50, y: 0.26, spreadX: 200, spreadY: 70 }
    ]
  }
];

function ruleStatusLabel(status) {
  if (status === 'ready') return 'Ready now';
  if (status === 'missing') return 'Need reagents';
  return 'Blocked';
}

function ruleStatusWeight(status) {
  if (status === 'ready') return 0;
  if (status === 'blocked') return 1;
  return 2;
}

function ruleStatusMarkup(diag) {
  const blockerMarkup = diag.blockers.length
    ? diag.blockers.slice(0, 3).map(text => `<span class="ruleBlocker">${text}</span>`).join('')
    : `<span class="ruleBlocker ready">Reactants, contact, and conditions are lined up.</span>`;
  return `
    <div class="ruleStatusRow">
      <span class="ruleStatusBadge ${diag.status}">${ruleStatusLabel(diag.status)}</span>
      <div class="ruleBlockerList">${blockerMarkup}</div>
    </div>
  `;
}

function updateTempInputConstraints() {
  if (world.ui.tempInputUnit === 'F') {
    tempInput.min = String(Math.round(cToF(TEMP_MIN_C)));
    tempInput.max = String(Math.round(cToF(TEMP_MAX_C)));
    tempInput.step = '1';
    return;
  }
  if (world.ui.tempInputUnit === 'K') {
    tempInput.min = '0';
    tempInput.max = String(Math.round(cToK(TEMP_MAX_C)));
    tempInput.step = '1';
    return;
  }
  tempInput.min = String(Math.ceil(TEMP_MIN_C));
  tempInput.max = String(Math.round(TEMP_MAX_C));
  tempInput.step = '1';
}

function updateThermalLabels() {
  const c = Math.round(world.temperatureC);
  const f = Math.round(cToF(c));
  const k = Math.round(cToK(c));
  const pulse = Math.round(world.heatPulseC);
  const ambientC = Math.round(getEffectiveTemperatureC());
  const ambientF = Math.round(cToF(ambientC));
  const ambientK = Math.round(cToK(ambientC));
  const effectivePressureAtm = getEffectivePressureAtm();
  const liquidLayout = getLiquidLayerLayout();
  const primaryChem = liquidLayout.layers.find(layer => layer.chemistry)?.chemistry || null;
  const tempSliderValue = temperatureToSliderValue(world.temperatureC);
  const pressureSliderValue = pressureToSliderValue(world.pressureAtm);
  const fill = sliderNorm(tempSliderValue, Number(heatSlider.min), Number(heatSlider.max)) * 100;
  const doseFill = ((Math.abs(world.heatDoseC) - Number(heatDoseSlider.min)) / (Number(heatDoseSlider.max) - Number(heatDoseSlider.min))) * 100;
  const stirFill = ((world.stirStrength - Number(stirStrengthSlider.min)) / (Number(stirStrengthSlider.max) - Number(stirStrengthSlider.min))) * 100;
  const lightFill = ((world.lightStrength - Number(lightStrengthSlider.min)) / (Number(lightStrengthSlider.max) - Number(lightStrengthSlider.min))) * 100;
  const lightBandIndex = Math.max(0, LIGHT_BANDS.findIndex(entry => entry.id === world.light.band));
  const lightBandFill = ((lightBandIndex - Number(lightBandSlider.min)) / (Number(lightBandSlider.max) - Number(lightBandSlider.min))) * 100;
  const pressureFill = sliderNorm(pressureSliderValue, Number(pressureSlider.min), Number(pressureSlider.max)) * 100;
  heatSlider.style.setProperty('--fill', `${clamp(fill, 0, 100)}%`);
  heatDoseSlider.style.setProperty('--fill', `${clamp(doseFill, 0, 100)}%`);
  stirStrengthSlider.style.setProperty('--fill', `${clamp(stirFill, 0, 100)}%`);
  lightStrengthSlider.style.setProperty('--fill', `${clamp(lightFill, 0, 100)}%`);
  lightBandSlider.style.setProperty('--fill', `${clamp(lightBandFill, 0, 100)}%`);
  pressureSlider.style.setProperty('--fill', `${clamp(pressureFill, 0, 100)}%`);
  heatLabel.textContent = `Base: ${c}°C / ${f}°F / ${k}K • Effective: ${ambientC}°C / ${ambientF}°F / ${ambientK}K`;
  heatSlider.value = String(tempSliderValue);
  pressureSlider.value = String(pressureSliderValue);
  pressureLabel.textContent = `Pressure: ${formatPressureAtm(effectivePressureAtm)} atm • Base ${formatPressureAtm(world.pressureAtm)} atm • Gas ${getGasMoleculeCount()}`;
  updateTempInputConstraints();
  if (!world.ui.editingTempInput) {
    tempInput.value = String(Math.round(toSelectedUnitTemp(world.temperatureC)));
  }
  tempUnitSelect.value = world.ui.tempInputUnit;
  heatDoseLabel.textContent = 'Pulse dose';
  heatDoseValue.textContent = `${Math.abs(Math.round(world.heatDoseC))}°C`;
  stirStrengthLabel.textContent = 'Stir strength';
  stirStrengthValue.textContent = `${world.stirStrength.toFixed(1)}x`;
  lightStrengthLabel.textContent = 'Beam intensity';
  lightStrengthValue.textContent = `${world.lightStrength.toFixed(1)}x`;
  lightBandLabel.textContent = 'EM frequency';
  lightBandSlider.value = String(lightBandIndex);
  lightBandValue.textContent = getLightBand(world.light.band).label;
  const gasCount = getGasMoleculeCount();
  const stirringText = world.stirring.timeLeft > 0 ? ` • Stirring ${world.stirring.timeLeft.toFixed(1)}s @ ${world.stirring.power.toFixed(1)}x` : '';
  const lightArmed = world.ui.activeTool === 'light';
  const lightLive = world.light.firing;
  const stirLive = world.stirring.timeLeft > 0;
  const lightText = lightLive ? ` • ${getLightBand(world.light.band).label} beam @ ${world.light.power.toFixed(1)}x` : (lightArmed ? ` • Light tool armed (${getLightBand(world.light.band).label})` : '');
  const primaryChemLabel = primaryChem ? primaryChem.chemistryLabel : 'No dominant liquid chemistry';
  const waterText = primaryChem ? ` • ${primaryChem.chemistryLabel}` : '';
  const toolLabel = lightLive
    ? `${getLightBand(world.light.band).label} beam`
    : lightArmed
    ? `${getLightBand(world.light.band).label} ready`
    : stirLive
    ? `Stir ${world.stirring.power.toFixed(1)}x`
    : 'Select';
  const thermalLedger = `+${Math.round(world.thermalStats.addedC)} / -${Math.round(world.thermalStats.removedC)}°C`;
  const environmentShifted = Math.abs(world.temperatureC - 25) > 20 || Math.abs(world.pressureAtm - 1) > 0.25;
  simLabel.textContent = `Base ${c}°C • Offset ${formatThermalDelta(pulse) || '0°C'} • Effective ${ambientC}°C • ${formatPressureAtm(effectivePressureAtm)} atm${waterText} • ${world.timeScale}x speed${stirringText}${lightText}`;
  setButtonLabel(playPauseBtn, world.running ? 'Pause' : 'Play');
  playPauseBtn.classList.toggle('active', world.running);
  playPauseBtn.classList.toggle('paused', !world.running);
  playPauseBtn.setAttribute('aria-pressed', world.running ? 'true' : 'false');
  setButtonLabel(timeScaleBtn, `Time ${world.timeScale}x`);
  timeScaleBtn.classList.toggle('active', world.timeScale > 1);
  timeScaleBtn.classList.toggle('boosted', world.timeScale > 1);
  timeScaleBtn.setAttribute('aria-pressed', world.timeScale > 1 ? 'true' : 'false');
  stirBtn.classList.toggle('active', stirLive);
  stirBtn.classList.toggle('live', stirLive);
  setButtonLabel(stirBtn, stirLive ? 'Stirring' : 'Stir');
  stirBtn.setAttribute('aria-pressed', stirLive ? 'true' : 'false');
  lightBtn.classList.toggle('active', lightArmed || lightLive);
  lightBtn.classList.toggle('armed', lightArmed && !lightLive);
  lightBtn.classList.toggle('live', lightLive);
  setButtonLabel(lightBtn, lightLive ? 'Firing Beam' : lightArmed ? 'Light Armed' : 'Light Tool');
  lightBtn.setAttribute('aria-pressed', lightArmed || lightLive ? 'true' : 'false');
  lightControlGroup?.classList.toggle('armed', lightArmed && !lightLive);
  lightControlGroup?.classList.toggle('live', lightLive);
  stirControlGroup?.classList.toggle('live', stirLive);
  environmentControlGroup?.classList.toggle('armed', environmentShifted);
  canvas.style.cursor = world.ui.activeTool === 'light' ? 'crosshair' : 'default';
  statusText.innerHTML = `
    <div class="statusGrid">
      <div class="statusMetric">
        <span>State</span>
        <strong class="statusFlag ${world.running ? 'running' : 'paused'}">${world.running ? 'Running' : 'Paused'}</strong>
      </div>
      <div class="statusMetric">
        <span>Molecules</span>
        <strong>${world.molecules.length}</strong>
      </div>
      <div class="statusMetric">
        <span>Temp</span>
        <strong>${ambientC}°C</strong>
      </div>
      <div class="statusMetric">
        <span>Pressure</span>
        <strong>${formatPressureAtm(effectivePressureAtm)} atm</strong>
      </div>
      <div class="statusMetric">
        <span>Tool</span>
        <strong>${toolLabel}</strong>
      </div>
      <div class="statusMetric">
        <span>Reactions</span>
        <strong>${world.stats.reactions}</strong>
      </div>
    </div>
    <div class="statusDetailGrid">
      <div class="statusDetail">
        <span>Chemistry</span>
        <strong>${primaryChemLabel}</strong>
      </div>
      <div class="statusDetail">
        <span>Vessel</span>
        <strong>${gasCount} gas molecules • ${world.timeScale}x speed</strong>
      </div>
      <div class="statusDetail">
        <span>Thermal Ledger</span>
        <strong>${thermalLedger}</strong>
      </div>
    </div>
  `;
}

function cycleTimeScale() {
  const idx = SPEED_PRESET.indexOf(world.timeScale);
  world.timeScale = SPEED_PRESET[(idx + 1) % SPEED_PRESET.length];
  updateThermalLabels();
}


function cacheCurrentTabScroll() {
  const scroller = tabContent.querySelector('.scroll');
  if (!scroller) return;
  const key = world.ui.lastRenderedTab || world.ui.activeTab;
  world.ui.scrollTopByTab[key] = scroller.scrollTop;
}


function moleculeMass(mol) {
  return mol.atoms.reduce((sum, atom) => sum + (elementStyles[atom.el]?.m || 0), 0);
}

function averageBondLength(mol) {
  if (!mol.bonds.length) return null;
  let total = 0;
  for (const bond of mol.bonds) {
    total += dist(mol.atoms[bond.a], mol.atoms[bond.b]);
  }
  return total / mol.bonds.length;
}

function averageBondStrain(mol) {
  if (!mol.bonds.length) return null;
  let total = 0;
  for (const bond of mol.bonds) {
    total += Math.abs(dist(mol.atoms[bond.a], mol.atoms[bond.b]) - bond.rest);
  }
  return total / mol.bonds.length;
}


function pointerPos(e) {
  return { x: e.clientX, y: e.clientY };
}

function findTopMoleculeAt(x, y) {
  for (let i = world.molecules.length - 1; i >= 0; i--) {
    const mol = world.molecules[i];
    for (const atom of mol.atoms) {
      if (Math.hypot(atom.x - x, atom.y - y) <= atom.r + 6) {
        return { mol, atom };
      }
    }
  }
  return null;
}

function moveMoleculeCenterTo(mol, x, y) {
  const c = moleculeCenter(mol);
  const dx = x - c.x;
  const dy = y - c.y;
  for (const a of mol.atoms) {
    a.x += dx;
    a.y += dy;
    a.vx *= 0.7;
    a.vy *= 0.7;
  }
}

function getSelectedMolecule() {
  return world.molecules.find(m => m.id === world.selectedMolId) || null;
}

function getLibraryColor(key) {
  if (key.startsWith('atom-')) {
    const el = key.replace('atom-', '');
    return elementStyles[el].color;
  }
  return SPECIES[key]?.color || '#9bbcff';
}

function addLibraryItem(key) {
  if (key.startsWith('atom-')) {
    addAtom(key.replace('atom-', ''));
  } else {
    const made = addMolecule(key);
    if (!made && key === 'Cl2') {
      addAtom('Cl');
      addAtom('Cl');
    } else if (!made && key === 'NaCl') {
      addAtom('Na');
      addAtom('Cl');
    }
  }
}

function spawnScenePresetGroup(group) {
  const b = world.bounds;
  if (!b) return;
  const count = Math.max(1, Number(group.count) || 1);
  const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const cx = b.x + b.w * (group.x ?? 0.5);
  const cy = b.y + b.h * (group.y ?? 0.5);
  const spreadX = group.spreadX ?? 120;
  const spreadY = group.spreadY ?? 80;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const nx = cols === 1 ? 0 : (col / (cols - 1)) - 0.5;
    const ny = rows === 1 ? 0 : (row / (rows - 1)) - 0.5;
    const x = cx + nx * spreadX + rand(-10, 10);
    const y = cy + ny * spreadY + rand(-10, 10);
    if (group.type.startsWith('atom-')) addAtom(group.type.replace('atom-', ''), x, y, { select: false });
    else addMolecule(group.type, x, y, { select: false });
  }
}

function loadScenePreset(key) {
  const preset = SCENE_PRESETS.find(entry => entry.key === key);
  if (!preset || !world.bounds) return;
  clearWorld();
  world.temperatureC = preset.settings.temperatureC ?? world.temperatureC;
  world.pressureAtm = preset.settings.pressureAtm ?? world.pressureAtm;
  world.light.band = preset.settings.lightBand || world.light.band;
  world.ui.activeTool = 'select';
  world.selectedMolId = null;
  for (const group of preset.groups) {
    spawnScenePresetGroup(group);
  }
  addReactionLog('system', `Loaded preset: ${preset.name}`);
  markSidebarDirty();
  renderSidebar();
  updateThermalLabels();
}

function removeSelectedMolecule() {
  const mol = getSelectedMolecule();
  if (!mol) return;
  world.molecules = world.molecules.filter(m => m.id !== mol.id);
  world.selectedMolId = null;
  markSidebarDirty();
}

function duplicateSelectedMolecule() {
  const mol = getSelectedMolecule();
  if (!mol) return;
  const center = moleculeCenter(mol);
  if (mol.type.startsWith('atom-')) {
    addAtom(mol.type.replace('atom-', ''), center.x + 26, center.y + 22);
  } else {
    addMolecule(mol.type, center.x + 26, center.y + 22);
  }
}

function syncTabButtons() {
  document.querySelectorAll('.tabBtn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === world.ui.activeTab);
  });
}

function renderLibraryTab() {
  const wrap = document.createElement('div');
  wrap.className = 'content contentLibrary';

  const chips = document.createElement('div');
  chips.className = 'chips';

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'atoms', label: 'Atoms' },
    { key: 'molecules', label: 'Molecules' },
    { key: 'liquids', label: 'Liquids' },
    { key: 'gases', label: 'Gases' }
  ];

  for (const f of filters) {
    const btn = document.createElement('button');
    btn.className = 'chipBtn' + (world.ui.libraryFilter === f.key ? ' active' : '');
    btn.textContent = f.label;
    btn.addEventListener('click', () => {
      world.ui.libraryFilter = f.key;
      markSidebarDirty();
      renderSidebar();
    });
    chips.appendChild(btn);
  }

  const list = document.createElement('div');
  list.className = 'scroll';

  const search = world.ui.search.trim().toLowerCase();

  let items = LIBRARY_ITEMS.filter(item => {
    if (world.ui.libraryFilter === 'atoms' && item.category !== 'atoms') return false;
    if (world.ui.libraryFilter === 'molecules' && item.category !== 'molecules') return false;
    if (world.ui.libraryFilter === 'liquids' && item.phase !== 'liquid') return false;
    if (world.ui.libraryFilter === 'gases' && item.phase !== 'gas') return false;
    if (search && !(item.name.toLowerCase().includes(search) || item.formula.toLowerCase().includes(search) || item.search.includes(search))) return false;
    return true;
  });

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'emptyState';
    empty.innerHTML = emptyStateMarkup('search', 'No species match that filter', 'Try a different formula, phase filter, or search term.');
    list.appendChild(empty);
  } else {
    for (const item of items) {
      const card = document.createElement('div');
      card.className = 'card';

      const color = getLibraryColor(item.key);
      const behavior = speciesBehaviorSummary(item.key);
      card.innerHTML = `
        <div class="cardTop">
          <div class="cardTitle">
            <strong><span class="colorDot" style="background:${color}"></span>${item.name}</strong>
            <span>${item.formula}</span>
          </div>
          ${phaseTagMarkup(item.phase, item.phase, { isAtom: item.category === 'atoms' })}
        </div>
        <div class="small">${item.description}</div>
        <div class="small" style="margin-top:8px;">${behavior}</div>
      `;

      const actions = document.createElement('div');
      actions.className = 'cardActions';

      const addBtn = document.createElement('button');
      addBtn.className = 'miniBtn primary';
      addBtn.textContent = 'Add';
      addBtn.addEventListener('click', () => addLibraryItem(item.key));

      const add3Btn = document.createElement('button');
      add3Btn.className = 'miniBtn';
      add3Btn.textContent = 'Add 3';
      add3Btn.addEventListener('click', () => {
        for (let i = 0; i < 3; i++) addLibraryItem(item.key);
      });

      actions.appendChild(addBtn);
      actions.appendChild(add3Btn);
      card.appendChild(actions);

      card.addEventListener('dblclick', () => addLibraryItem(item.key));
      list.appendChild(card);
    }
  }

  wrap.appendChild(chips);
  wrap.appendChild(list);
  return wrap;
}

function renderSceneTab() {
  const wrap = document.createElement('div');
  wrap.className = 'content contentScene';

  const list = document.createElement('div');
  list.className = 'scroll';
  const liquidLayout = getLiquidLayerLayout();

  const presetCard = document.createElement('div');
  presetCard.className = 'card';
  presetCard.innerHTML = `
    <div class="cardTop">
      <div class="cardTitle">
        <strong>Quick Experiments</strong>
        <span>Load a staged scene instead of building from scratch</span>
      </div>
      ${phaseTagMarkup('preset', 'data')}
    </div>
  `;
  const presetGrid = document.createElement('div');
  presetGrid.className = 'presetGrid';
  for (const preset of SCENE_PRESETS) {
    const tile = document.createElement('div');
    tile.className = 'presetCard';
    tile.innerHTML = `
      <strong>${preset.name}</strong>
      <span>${preset.note}</span>
      <div class="presetMeta">${Math.round(preset.settings.temperatureC)}°C • ${formatPressureAtm(preset.settings.pressureAtm)} atm • ${getLightBand(preset.settings.lightBand).label}</div>
    `;
    const loadBtn = document.createElement('button');
    loadBtn.className = 'miniBtn primary';
    loadBtn.textContent = 'Load preset';
    loadBtn.addEventListener('click', () => loadScenePreset(preset.key));
    tile.appendChild(loadBtn);
    presetGrid.appendChild(tile);
  }
  presetCard.appendChild(presetGrid);
  list.appendChild(presetCard);

  for (const layer of liquidLayout.layers) {
    if (!layer.chemistry) continue;
    const labelType = layer.layerKey === 'water' ? 'H2O' : layer.layerKey;
    const chemCard = document.createElement('div');
    chemCard.className = 'card';
    chemCard.innerHTML = `
      <div class="cardTop">
        <div class="cardTitle">
          <strong>${getSpeciesDisplayName(labelType)} chemistry</strong>
          <span>${layer.liquidCount} liquid molecule${layer.liquidCount === 1 ? '' : 's'}</span>
        </div>
        ${phaseTagMarkup(layer.phaseTag || (layer.layerKey === 'water' ? 'aqueous' : 'liquid'))}
      </div>
      <div class="inspectGrid">
        <div class="kv"><span>${layer.chemistry.hasPH ? 'pH' : 'Indicator'}</span><strong>${layer.chemistry.hasPH ? layer.chemistry.pH.toFixed(1) : layer.chemistry.acidityLabel}</strong></div>
        <div class="kv"><span>Major ions</span><strong>${layer.chemistry.majorIons.length ? layer.chemistry.majorIons.map(entry => formatIonLabel(entry.ion)).join(', ') : 'none'}</strong></div>
        <div class="kv"><span>Conductivity</span><strong>${layer.chemistry.conductivity.toFixed(1)}</strong></div>
        <div class="kv"><span>Carbonation</span><strong>${layer.chemistry.isCarbonated ? 'present' : 'none'}</strong></div>
      </div>
    `;
    list.appendChild(chemCard);
  }

  if (world.molecules.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'emptyState';
    empty.innerHTML = emptyStateMarkup('layout-grid', 'Sandbox is empty', 'Load atoms or molecules from the Library to start a scene.');
    list.appendChild(empty);
    wrap.appendChild(list);
    return wrap;
  }

  const grouped = {};
  for (const mol of world.molecules) {
    const key = mol.type;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(mol);
  }

  const search = world.ui.search.trim().toLowerCase();
  const entries = Object.entries(grouped).filter(([key, arr]) => {
    const mol = arr[0];
    const blob = `${mol.display} ${mol.formula} ${mol.phase} ${key}`.toLowerCase();
    return !search || blob.includes(search);
  });

  if (entries.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'emptyState';
    empty.innerHTML = emptyStateMarkup('search', 'No scene matches', 'Nothing in the vessel matches the current search.');
    list.appendChild(empty);
  } else {
    entries.sort((a, b) => a[1][0].display.localeCompare(b[1][0].display));

    for (const [key, arr] of entries) {
      const mol = arr[0];
      const card = document.createElement('div');
      card.className = 'card';

      const color = mol.color || getLibraryColor(key);
      card.innerHTML = `
        <div class="cardTop">
          <div class="cardTitle">
            <strong><span class="colorDot" style="background:${color}"></span>${mol.display}</strong>
            <span>${arr.length} molecule${arr.length === 1 ? '' : 's'} • ${mol.formula}</span>
          </div>
        ${phaseTagMarkup(mol.phase, mol.phase, { isAtom: mol.type.startsWith('atom-') })}
        </div>
      `;

      const actions = document.createElement('div');
      actions.className = 'cardActions';

      const selectBtn = document.createElement('button');
      selectBtn.className = 'miniBtn';
      selectBtn.textContent = 'Select one';
      selectBtn.addEventListener('click', () => {
        world.selectedMolId = arr[0].id;
        world.ui.activeTab = 'inspect';
        markSidebarDirty();
        syncTabButtons();
        renderSidebar();
      });

      const addBtn = document.createElement('button');
      addBtn.className = 'miniBtn primary';
      addBtn.textContent = 'Add one';
      addBtn.addEventListener('click', () => {
        if (key.startsWith('atom-')) addAtom(key.replace('atom-', ''));
        else addMolecule(key);
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'miniBtn';
      removeBtn.textContent = 'Remove all';
      removeBtn.addEventListener('click', () => {
        world.molecules = world.molecules.filter(m => m.type !== key);
        if (world.selectedMolId && !world.molecules.some(m => m.id === world.selectedMolId)) {
          world.selectedMolId = null;
        }
        markSidebarDirty();
        renderSidebar();
      });

      actions.appendChild(selectBtn);
      actions.appendChild(addBtn);
      actions.appendChild(removeBtn);
      card.appendChild(actions);
      list.appendChild(card);
    }
  }

  wrap.appendChild(list);
  return wrap;
}

function renderInspectTab() {
  const wrap = document.createElement('div');
  wrap.className = 'content inspectContent';
  const list = document.createElement('div');
  list.className = 'scroll inspectScroll';

  const selected = getSelectedMolecule();

  if (!selected) {
    const empty = document.createElement('div');
    empty.className = 'emptyState';
    empty.innerHTML = emptyStateMarkup('search', 'Nothing selected', 'Choose a molecule in the vessel to inspect its structure, phases, and chemistry.');
    wrap.appendChild(empty);
    return wrap;
  }

  const card = document.createElement('div');
  card.className = 'card inspectCard';

  const c = moleculeCenter(selected);
  const mass = moleculeMass(selected);
  const avgBond = averageBondLength(selected);
  const bondStrain = averageBondStrain(selected);
  const profile = getSpeciesProfile(selected.type);
  const material = getMaterialConditions(selected.type);

  card.innerHTML = `
    <div class="cardTop">
      <div class="cardTitle">
        <strong><span class="colorDot" style="background:${selected.color}"></span>${selected.display}</strong>
        <span>${selected.formula}</span>
      </div>
      ${phaseTagMarkup(selected.phase, selected.phase, { isAtom: selected.type.startsWith('atom-') })}
    </div>
  `;

  const grid = document.createElement('div');
  grid.className = 'inspectGrid inspectMetaGrid';
  grid.innerHTML = `
    <div class="kv"><span>Type</span><strong>${selected.type}</strong></div>
    <div class="kv"><span>Atoms</span><strong>${selected.atoms.length}</strong></div>
    <div class="kv"><span>Bonds</span><strong>${selected.bonds.length}</strong></div>
    <div class="kv"><span>Mass</span><strong>${mass.toFixed(1)} u</strong></div>
    <div class="kv"><span>Density</span><strong>${selected.density ?? '—'}</strong></div>
    <div class="kv"><span>Reactivity rules</span><strong>${profile.ruleCount}</strong></div>
    <div class="kv"><span>Avg bond</span><strong>${avgBond == null ? '—' : avgBond.toFixed(1)}</strong></div>
    <div class="kv"><span>Bond strain</span><strong>${bondStrain == null ? '—' : bondStrain.toFixed(1)}</strong></div>
    <div class="kv"><span>Center</span><strong>${Math.round(c.x)}, ${Math.round(c.y)}</strong></div>
    <div class="kv"><span>Phases</span><strong>${formatPhaseCapabilities(selected.type)}</strong></div>
    <div class="kv"><span>Polarity</span><strong>${material.descriptors.polarity}</strong></div>
    <div class="kv"><span>Melting</span><strong>${formatMaterialTemp(material.thermal.meltingPointC)}</strong></div>
    <div class="kv"><span>Boiling</span><strong>${formatMaterialTemp(material.thermal.boilingPointC)}</strong></div>
    <div class="kv"><span>Vapor level</span><strong>${material.descriptors.vaporLevel}</strong></div>
    <div class="kv"><span>Condensation</span><strong>${material.descriptors.condensationLevel}</strong></div>
    <div class="kv"><span>Aqueous role</span><strong>${material.aqueous.role}</strong></div>
    <div class="kv"><span>Nominal pH</span><strong>${material.aqueous.pH == null ? 'n/a' : material.aqueous.pH.toFixed(1)}</strong></div>
    <div class="kv"><span>Light bands</span><strong>${formatLightBandList(material.optical.absorptionBands)}</strong></div>
    <div class="kv"><span>Luminescence</span><strong>${material.optical.emissionStrength > 0 ? `${formatLightBandList(material.optical.luminescenceBands)} -> ${material.optical.emissionColor}` : 'none'}</strong></div>
  `;

  const evap = EVAPORATION_CONFIG[selected.type];
  const effectivePressureAtm = getEffectivePressureAtm();
  const ionProfile = AQUEOUS_ION_PROFILES[selected.type];
  const weakAcid = WEAK_AQUEOUS_ACIDS[selected.type];
  const summary = document.createElement('div');
  summary.className = 'hintBox inspectSummary';
  const intro = profile.hint
    ? profile.hint
    : selected.phase === 'liquid'
    ? 'Liquid species in the density/layering model.'
    : 'Particle or gas species used by the scripted sandbox.';
  const thermalText = evap
    ? `Boils near ${Math.round(getPressureAdjustedBoilingPointC(selected.type, effectivePressureAtm))}°C and condenses near ${Math.round(getPressureAdjustedCondensePointC(selected.type, effectivePressureAtm))}°C at ${formatPressureAtm(effectivePressureAtm)} atm.`
    : `Melting ${formatMaterialTemp(material.thermal.meltingPointC)}, boiling ${formatMaterialTemp(material.thermal.boilingPointC)}, heat capacity ${material.thermal.heatCapacity.toFixed(2)}.`;
  const aqueousText = ionProfile
    ? `Dissociates into ${Object.keys(ionProfile.ions).map(formatIonLabel).join(' and ')}.`
    : (!ionProfile && weakAcid && selected.phase === 'liquid')
    ? 'Behaves as a weak acid in water.'
    : `${material.aqueous.role === 'neutral' ? 'No special aqueous chemistry.' : `Aqueous role: ${material.aqueous.role}.`}`;
  const opticalText = (material.optical.emissionStrength || 0) > 0
    ? `Absorbs ${formatLightBandList(material.optical.absorptionBands)} and re-emits ${material.optical.emissionColor} light after ${formatLightBandList(material.optical.luminescenceBands)} exposure.`
    : `Absorbs ${formatLightBandList(material.optical.absorptionBands)}. Primary emission band is ${getLightBand(material.optical.emittedBand).label}.`;
  summary.innerHTML = `
    <div class="inspectSummaryTitle">${getSpeciesDisplayName(selected.type)}</div>
    <div class="inspectSummaryText">${intro}</div>
    <div class="inspectSummaryGrid">
      <div class="inspectMini"><span>Reacts with</span><strong>${formatSpeciesList(profile.reactWith, 4)}</strong></div>
      <div class="inspectMini"><span>Turns into</span><strong>${formatSpeciesList(profile.turnsInto, 4)}</strong></div>
      <div class="inspectMini"><span>Made from</span><strong>${formatSpeciesList(profile.formedFrom, 4)}</strong></div>
      <div class="inspectMini"><span>Thermal</span><strong>${thermalText}</strong></div>
      <div class="inspectMini"><span>Aqueous</span><strong>${aqueousText}</strong></div>
      <div class="inspectMini"><span>Optical</span><strong>${opticalText}</strong></div>
    </div>
    ${material.descriptors.notes ? `<div class="inspectSummaryText">${material.descriptors.notes}</div>` : ''}
  `;

  const reactantDiagnostics = profile.reactantRules
    .map(rule => ({ rule, diag: getReactionRuleDiagnostics(rule, { focusType: selected.type }) }))
    .sort((a, b) => {
      const statusDelta = ruleStatusWeight(a.diag.status) - ruleStatusWeight(b.diag.status);
      return statusDelta || a.rule.name.localeCompare(b.rule.name);
    });
  let readiness = null;
  if (reactantDiagnostics.length) {
    readiness = document.createElement('div');
    readiness.className = 'hintBox';
    readiness.innerHTML = `
      <div class="inspectSummaryTitle">Rule Readiness</div>
      <div class="inspectSummaryText">Why the selected species will or will not take part in each scripted pathway right now.</div>
      <div class="ruleStatusList">
        ${reactantDiagnostics.map(({ rule, diag }) => `
          <div class="ruleStatusEntry">
            <div class="ruleStatusHead">
              <strong>${rule.name}</strong>
              <span class="small">${reactionEquation(rule)}</span>
            </div>
            ${ruleStatusMarkup(diag)}
          </div>
        `).join('')}
      </div>
    `;
  }

  const actions = document.createElement('div');
  actions.className = 'cardActions';

  const dupBtn = document.createElement('button');
  dupBtn.className = 'miniBtn primary';
  dupBtn.textContent = 'Duplicate';
  dupBtn.addEventListener('click', duplicateSelectedMolecule);

  const delBtn = document.createElement('button');
  delBtn.className = 'miniBtn';
  delBtn.textContent = 'Remove';
  delBtn.addEventListener('click', removeSelectedMolecule);

  actions.appendChild(dupBtn);
  actions.appendChild(delBtn);

  card.appendChild(grid);
  card.appendChild(summary);
  if (readiness) card.appendChild(readiness);
  card.appendChild(actions);

  list.appendChild(card);
  wrap.appendChild(list);
  return wrap;
}

function renderReactionsTab() {
  const wrap = document.createElement('div');
  wrap.className = 'content contentReactions';

  const head = document.createElement('div');
  head.className = 'logHead';
  head.innerHTML = `<h2 class="sectionTitle"><i data-lucide="activity" aria-hidden="true"></i><span>Reaction Log</span></h2>`;

  const actions = document.createElement('div');
  actions.className = 'logActions';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'miniBtn';
  copyBtn.textContent = 'Copy log';
  copyBtn.addEventListener('click', copyReactionLog);

  const exportBtn = document.createElement('button');
  exportBtn.className = 'miniBtn primary';
  exportBtn.textContent = 'Export .txt';
  exportBtn.addEventListener('click', exportReactionLog);

  const clearLogBtn = document.createElement('button');
  clearLogBtn.className = 'miniBtn';
  clearLogBtn.textContent = 'Clear log';
  clearLogBtn.addEventListener('click', () => {
    world.reactionLog = [];
    world.reactionLogMutedUntil = world.time + 0.6;
    markSidebarDirty();
    renderSidebar();
  });

  actions.appendChild(copyBtn);
  actions.appendChild(exportBtn);
  actions.appendChild(clearLogBtn);
  head.appendChild(actions);

  const known = document.createElement('div');
  known.className = 'card';
  const rules = world.reactionData.reactions || [];
  const search = world.ui.search.trim().toLowerCase();
  const visibleRules = rules.filter(rule => {
    const blob = `${rule.name} ${reactionEquation(rule)} ${rule.note || ''} ${rule.category || ''}`.toLowerCase();
    return !search || blob.includes(search);
  });
  known.innerHTML = `
    <div class="cardTop">
      <div class="cardTitle">
        <strong>Known Reactions</strong>
        <span>${rules.length} scripted rule${rules.length === 1 ? '' : 's'} loaded from JSON</span>
      </div>
      ${phaseTagMarkup('data', 'data')}
    </div>
  `;
  const knownList = document.createElement('div');
  knownList.style.display = 'grid';
  knownList.style.gap = '8px';
  const ruleDiagnostics = visibleRules
    .map(rule => ({ rule, diag: getReactionRuleDiagnostics(rule) }))
    .sort((a, b) => {
      const statusDelta = ruleStatusWeight(a.diag.status) - ruleStatusWeight(b.diag.status);
      return statusDelta || a.rule.name.localeCompare(b.rule.name);
    });
  for (const { rule, diag } of ruleDiagnostics) {
    const row = document.createElement('div');
    row.className = 'hintBox';
    row.innerHTML = `
      <strong style="color:var(--text)">${rule.name}</strong><br>
      <div style="margin:8px 0;display:flex;gap:8px;flex-wrap:wrap;">
        ${thermalBadgeMarkup(rule.thermalDeltaC) || `<span class="thermalBadge">No net thermal impulse</span>`}
        ${thermalWindowMarkup(rule)}
        ${pressureWindowMarkup(rule)}
      </div>
      ${ruleStatusMarkup(diag)}
      ${reactionEquation(rule)}<br>
      <span style="color:var(--muted)">${rule.note || 'Scripted pathway.'}</span>
    `;
    knownList.appendChild(row);
  }
  if (visibleRules.length === 0) {
    const emptyRules = document.createElement('div');
    emptyRules.className = 'small';
    emptyRules.textContent = 'No scripted reactions match the current search.';
    knownList.appendChild(emptyRules);
  }
  known.appendChild(knownList);

  const list = document.createElement('div');
  list.className = 'scroll';

  const rows = world.reactionLog
    .slice()
    .reverse()
    .filter(entry => !search || `${entry.type} ${entry.message}`.toLowerCase().includes(search));

  if (rows.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'emptyState';
    empty.innerHTML = emptyStateMarkup('activity', 'No reactions logged yet', 'Run the sim or push the environment harder to capture events here.');
    list.appendChild(empty);
  } else {
    for (const entry of rows) {
      const row = document.createElement('div');
      row.className = 'logEntry';
      const thermalMeta = thermalBadgeMarkup(entry.thermalDeltaC);
      row.innerHTML = `
        <div class="logMeta">${formatSimTime(entry.t)} • ${Math.round(entry.tempC)}°C • ${entry.type}</div>
        ${thermalMeta ? `<div style="margin:6px 0 8px 0;display:flex;gap:8px;flex-wrap:wrap;">${thermalMeta}</div>` : ''}
        <div class="logMsg">${formatReactionLogMessage(entry)}</div>
      `;
      list.appendChild(row);
    }
  }

  wrap.appendChild(head);
  wrap.appendChild(known);
  wrap.appendChild(list);
  return wrap;
}

function renderSidebar() {
  sidebarDirty = false;
  cacheCurrentTabScroll();
  tabContent.innerHTML = '';

  let content;
  if (world.ui.activeTab === 'library') content = renderLibraryTab();
  else if (world.ui.activeTab === 'scene') content = renderSceneTab();
  else if (world.ui.activeTab === 'inspect') content = renderInspectTab();
  else content = renderReactionsTab();

  tabContent.appendChild(content);
  refreshLucideIcons();
  const scroller = tabContent.querySelector('.scroll');
  if (scroller) {
    const tabKey = world.ui.activeTab;
    scroller.scrollTop = world.ui.scrollTopByTab[tabKey] || 0;
    scroller.addEventListener('scroll', () => {
      world.ui.scrollTopByTab[tabKey] = scroller.scrollTop;
    }, { passive: true });
  }
  world.ui.lastRenderedTab = world.ui.activeTab;
  sidebarFooterText.textContent = `${world.molecules.length} molecule${world.molecules.length === 1 ? '' : 's'} in sandbox`;
  updateThermalLabels();
}
