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

function phaseTagMarkup(label, phase = label) {
  return `<div class="phaseTag phase-${phaseTagKey(phase)}">${label}</div>`;
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
  const waterChem = getWaterChemistrySnapshot();
  const liquidLayout = getLiquidLayerLayout();
  const primaryChem = liquidLayout.layers.find(layer => layer.chemistry)?.chemistry || null;
  const tempSliderValue = temperatureToSliderValue(world.temperatureC);
  const pressureSliderValue = pressureToSliderValue(world.pressureAtm);
  const fill = sliderNorm(tempSliderValue, Number(heatSlider.min), Number(heatSlider.max)) * 100;
  const doseFill = ((Math.abs(world.heatDoseC) - Number(heatDoseSlider.min)) / (Number(heatDoseSlider.max) - Number(heatDoseSlider.min))) * 100;
  const stirFill = ((world.stirStrength - Number(stirStrengthSlider.min)) / (Number(stirStrengthSlider.max) - Number(stirStrengthSlider.min))) * 100;
  const lightFill = ((world.lightStrength - Number(lightStrengthSlider.min)) / (Number(lightStrengthSlider.max) - Number(lightStrengthSlider.min))) * 100;
  const lightBandFill = ((LIGHT_BANDS.findIndex(entry => entry.id === world.light.band) - Number(lightBandSlider.min)) / (Number(lightBandSlider.max) - Number(lightBandSlider.min))) * 100;
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
  heatDoseLabel.textContent = 'Shot strength';
  heatDoseValue.textContent = `${Math.abs(Math.round(world.heatDoseC))}°C`;
  stirStrengthLabel.textContent = 'Stir strength';
  stirStrengthValue.textContent = `${world.stirStrength.toFixed(1)}x`;
  lightStrengthLabel.textContent = 'Beam intensity';
  lightStrengthValue.textContent = `${world.lightStrength.toFixed(1)}x`;
  lightBandLabel.textContent = 'EM frequency';
  lightBandSlider.value = String(Math.max(0, LIGHT_BANDS.findIndex(entry => entry.id === world.light.band)));
  lightBandValue.textContent = getLightBand(world.light.band).label;
  const stirringText = world.stirring.timeLeft > 0 ? ` • Stirring ${world.stirring.timeLeft.toFixed(1)}s @ ${world.stirring.power.toFixed(1)}x` : '';
  const lightText = world.light.firing ? ` • ${getLightBand(world.light.band).label} beam @ ${world.light.power.toFixed(1)}x` : (world.ui.activeTool === 'light' ? ` • Light tool armed (${getLightBand(world.light.band).label})` : '');
  const waterText = primaryChem ? ` • ${primaryChem.chemistryLabel}` : '';
  simLabel.textContent = `Base ${c}°C • Offset ${formatThermalDelta(pulse) || '0°C'} • Effective ${ambientC}°C • ${formatPressureAtm(effectivePressureAtm)} atm${waterText} • ${world.timeScale}x speed${stirringText}${lightText}`;
  timeScaleBtn.textContent = `Time ${world.timeScale}x`;
  stirBtn.classList.toggle('active', world.stirring.timeLeft > 0);
  stirBtn.textContent = world.stirring.timeLeft > 0 ? 'Stirring' : 'Stir';
  lightBtn.classList.toggle('active', world.ui.activeTool === 'light');
  lightBtn.textContent = world.ui.activeTool === 'light' ? 'Light Tool On' : 'Light Tool';
  canvas.style.cursor = world.ui.activeTool === 'light' ? 'crosshair' : 'default';
  statusText.innerHTML = `${world.running ? 'Running' : 'Paused'}<br>${world.molecules.length} molecules<br>${ambientC}°C effective • ${formatPressureAtm(effectivePressureAtm)} atm${primaryChem ? ` • ${primaryChem.chemistryLabel}` : ''}<br>${world.stats.reactions} reactions • heat +${Math.round(world.thermalStats.addedC)} / -${Math.round(world.thermalStats.removedC)}${world.ui.activeTool === 'light' ? `<br>${getLightBand(world.light.band).label} tool ${world.light.firing ? `firing @ ${world.light.power.toFixed(1)}x` : 'armed'}` : ''}`;
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
  wrap.className = 'content';

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
    empty.innerHTML = `<div><strong>No matches</strong><div class="small" style="margin-top:6px;">Try a different search or filter.</div></div>`;
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
          ${phaseTagMarkup(item.phase)}
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
  wrap.className = 'content';

  const list = document.createElement('div');
  list.className = 'scroll';
  const liquidLayout = getLiquidLayerLayout();

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
    empty.innerHTML = `<div><strong>Sandbox is empty</strong><div class="small" style="margin-top:6px;">Add atoms or molecules from Library.</div></div>`;
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
    empty.innerHTML = `<div><strong>No scene matches</strong><div class="small" style="margin-top:6px;">Your search did not match anything in the sandbox.</div></div>`;
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
          ${phaseTagMarkup(mol.phase)}
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
    empty.innerHTML = `<div><strong>Nothing selected</strong><div class="small" style="margin-top:6px;">Click a molecule in the sandbox or select one from Scene.</div></div>`;
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
      ${phaseTagMarkup(selected.phase)}
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
    <div class="kv"><span>Light bands</span><strong>${material.optical.absorptionBands.join(', ')}</strong></div>
    <div class="kv"><span>Emission color</span><strong>${material.optical.emissionColor}</strong></div>
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
  summary.innerHTML = `
    <div class="inspectSummaryTitle">${getSpeciesDisplayName(selected.type)}</div>
    <div class="inspectSummaryText">${intro}</div>
    <div class="inspectSummaryGrid">
      <div class="inspectMini"><span>Reacts with</span><strong>${formatSpeciesList(profile.reactWith, 4)}</strong></div>
      <div class="inspectMini"><span>Turns into</span><strong>${formatSpeciesList(profile.turnsInto, 4)}</strong></div>
      <div class="inspectMini"><span>Made from</span><strong>${formatSpeciesList(profile.formedFrom, 4)}</strong></div>
      <div class="inspectMini"><span>Thermal</span><strong>${thermalText}</strong></div>
      <div class="inspectMini"><span>Aqueous</span><strong>${aqueousText}</strong></div>
      <div class="inspectMini"><span>Optical</span><strong>Absorbs ${material.optical.absorptionBands.join(', ')}; emits ${material.optical.emittedBand} ${material.optical.emissionColor}.</strong></div>
    </div>
    ${material.descriptors.notes ? `<div class="inspectSummaryText">${material.descriptors.notes}</div>` : ''}
  `;

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
  card.appendChild(actions);

  list.appendChild(card);
  wrap.appendChild(list);
  return wrap;
}

function renderReactionsTab() {
  const wrap = document.createElement('div');
  wrap.className = 'content';

  const head = document.createElement('div');
  head.className = 'logHead';
  head.innerHTML = `<h2>Reaction Log</h2>`;

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
  for (const rule of visibleRules) {
    const row = document.createElement('div');
    row.className = 'hintBox';
    row.innerHTML = `
      <strong style="color:var(--text)">${rule.name}</strong><br>
      <div style="margin:8px 0;display:flex;gap:8px;flex-wrap:wrap;">
        ${thermalBadgeMarkup(rule.thermalDeltaC) || `<span class="thermalBadge">No net thermal impulse</span>`}
        ${thermalWindowMarkup(rule)}
        ${pressureWindowMarkup(rule)}
      </div>
      ${reactionEquation(rule)}<br>
      <span style="color:var(--muted)">${rule.note || 'Scripted pathway.'}</span>
    `;
    knownList.appendChild(row);
  }
  if (visibleRules.length === 0) {
    const emptyRules = document.createElement('div');
    emptyRules.className = 'small';
    emptyRules.textContent = 'No known reaction matches for the current search.';
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
    empty.innerHTML = '<div><strong>No reactions logged</strong><div class="small" style="margin-top:6px;">Run the simulation to capture bond events and pathway reactions.</div></div>';
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
