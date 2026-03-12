const world = {
  running: true,
  temperatureC: 25,
  pressureAtm: 1,
  heatPulseC: 0,
  heatDoseC: 180,
  stirStrength: 1.8,
  lightStrength: 1.2,
  timeScale: 1,
  time: 0,
  molecules: [],
  thermalEvents: [],
  thermalStats: {
    addedC: 0,
    removedC: 0
  },
  stirring: {
    timeLeft: 0,
    power: 0
  },
  light: {
    timeLeft: 0,
    power: 0,
    rays: [],
    firing: false,
    pointerId: null,
    source: null,
    target: null,
    band: 'uv',
    travel: 0,
    maxTravel: 0
  },
  reactionData: {
    speciesHints: {},
    reactions: []
  },
  reactionLog: [],
  reactionLogMutedUntil: 0,
  stats: {
    reactions: 0
  },
  layout: {
    condensedHeight: 0,
    surfaceY: null
  },
  bounds: null,
  selectedMolId: null,
  ui: {
    activeTab: 'library',
    lastRenderedTab: 'library',
    libraryFilter: 'all',
    search: '',
    activeTool: 'select',
    editingTempInput: false,
    tempInputUnit: 'C',
    scrollTopByTab: {
      library: 0,
      scene: 0,
      inspect: 0,
      reactions: 0
    }
  },
  dragging: {
    mol: null,
    atomId: null,
    offsetX: 0,
    offsetY: 0,
    pointerId: null,
    targetX: 0,
    targetY: 0,
    startedAt: 0,
    momentumX: 0,
    momentumY: 0
  }
};


let lastTime = performance.now();
function frame(now) {
  const dt = clamp((now - lastTime) / 1000, 0, 1 / 24);
  lastTime = now;

  if (world.running) {
    const scaledDt = dt * world.timeScale;
    let remaining = scaledDt;
    const substep = 1 / 120;
    while (remaining > 1e-6) {
      const step = Math.min(substep, remaining);
      world.time += step;
      updatePhysics(step);
      remaining -= step;
    }
    updateThermalLabels();
  }

  drawScene();

  if (sidebarDirty) {
    renderSidebar();
  }

  requestAnimationFrame(frame);
}

function setActiveTool(tool) {
  if (world.dragging.mol) {
    armDraggedMoleculeRecovery(world.dragging.mol);
  }
  world.ui.activeTool = tool;
  world.dragging.mol = null;
  world.dragging.atomId = null;
  world.dragging.pointerId = null;
  world.dragging.targetX = 0;
  world.dragging.targetY = 0;
  world.dragging.startedAt = 0;
  world.dragging.momentumX = 0;
  world.dragging.momentumY = 0;
  if (tool !== 'light') stopLightBeam();
  updateThermalLabels();
}

const searchWrap = document.querySelector('.searchWrap');
const tempPresetButtons = [...document.querySelectorAll('[data-temp-preset]')];
const pressurePresetButtons = [...document.querySelectorAll('[data-pressure-preset]')];
const controlGroups = [...document.querySelectorAll('.controlGroup')];

function setControlGroupOpen(group, open) {
  if (!group) return;
  group.classList.toggle('open', open);
  const body = group.querySelector('.controlBody');
  if (body) body.hidden = !open;
}

function collapseAllControlGroups() {
  for (const group of controlGroups) {
    setControlGroupOpen(group, false);
  }
}

function armDraggedMoleculeRecovery(mol) {
  if (!mol || !mol.alive) return;
  const momentum = Math.hypot(world.dragging.momentumX, world.dragging.momentumY);
  mol.dragRecoveryStartedAt = world.time;
  mol.dragRecoveryDuration = 0.52;
  mol.dragRecoveryUntil = world.time + mol.dragRecoveryDuration;
  mol.dragRecoveryStrength = clamp(1.05 + momentum / 18, 1.05, 2.8);
}

function clearDraggingState() {
  world.dragging.mol = null;
  world.dragging.atomId = null;
  world.dragging.pointerId = null;
  world.dragging.targetX = 0;
  world.dragging.targetY = 0;
  world.dragging.startedAt = 0;
  world.dragging.momentumX = 0;
  world.dragging.momentumY = 0;
}

function activateTab(tab) {
  cacheCurrentTabScroll();
  world.ui.activeTab = tab;
  syncTabButtons();
  markSidebarDirty();
  renderSidebar();
}

function updateSearchClearVisibility() {
  const hasValue = !!world.ui.search.trim();
  searchWrap?.classList.toggle('hasValue', hasValue);
  if (searchClearBtn) searchClearBtn.disabled = !hasValue;
}

function nudgeTemperature(deltaC) {
  world.temperatureC = clamp(world.temperatureC + deltaC, TEMP_MIN_C, TEMP_MAX_C);
  updateThermalLabels();
}

function nudgePressure(direction, fine = false) {
  const current = clamp(world.pressureAtm, PRESSURE_MIN_ATM, PRESSURE_MAX_ATM);
  const scale = fine
    ? (current < 1 ? 1.025 : current < 10 ? 1.04 : 1.06)
    : (current < 1 ? 1.07 : current < 10 ? 1.12 : 1.18);
  world.pressureAtm = clamp(direction > 0 ? current * scale : current / scale, PRESSURE_MIN_ATM, PRESSURE_MAX_ATM);
  updateThermalLabels();
}

function editableTarget(target) {
  return !!target?.closest?.('input, textarea, select, [contenteditable="true"]');
}

function toggleRunning() {
  world.running = !world.running;
  setButtonLabel(playPauseBtn, world.running ? 'Pause' : 'Play');
  markSidebarDirty();
  renderSidebar();
}

canvas.addEventListener('pointerdown', (e) => {
  const p = pointerPos(e);
  if (world.ui.activeTool === 'light' && pointInRect(p, world.bounds)) {
    canvas.setPointerCapture?.(e.pointerId);
    startLightBeam(e.pointerId, p);
    return;
  }
  const hit = findTopMoleculeAt(p.x, p.y);

  if (!hit) {
    if (world.selectedMolId !== null) {
      world.selectedMolId = null;
      markSidebarDirty();
    }
    return;
  }

  if (world.selectedMolId !== hit.mol.id) {
    world.selectedMolId = hit.mol.id;
    markSidebarDirty();
  }

  canvas.setPointerCapture?.(e.pointerId);
  world.dragging.mol = hit.mol;
  world.dragging.atomId = hit.atom.id;
  world.dragging.offsetX = p.x - hit.atom.x;
  world.dragging.offsetY = p.y - hit.atom.y;
  world.dragging.pointerId = e.pointerId;
  world.dragging.targetX = hit.atom.x;
  world.dragging.targetY = hit.atom.y;
  world.dragging.startedAt = world.time;
  world.dragging.momentumX = 0;
  world.dragging.momentumY = 0;
});

window.addEventListener('pointermove', (e) => {
  if (world.light.firing && e.pointerId === world.light.pointerId) {
    updateLightBeamTarget(pointerPos(e));
    return;
  }
  if (!world.dragging.mol || e.pointerId !== world.dragging.pointerId) return;
  const p = pointerPos(e);
  const nextTargetX = p.x - world.dragging.offsetX;
  const nextTargetY = p.y - world.dragging.offsetY;
  const dx = nextTargetX - world.dragging.targetX;
  const dy = nextTargetY - world.dragging.targetY;
  world.dragging.momentumX = clamp(world.dragging.momentumX * 0.35 + dx * 0.92, -42, 42);
  world.dragging.momentumY = clamp(world.dragging.momentumY * 0.35 + dy * 0.92, -42, 42);
  world.dragging.targetX = nextTargetX;
  world.dragging.targetY = nextTargetY;
  if (!world.running) {
    const anchor = world.dragging.mol.atoms.find(atom => atom.id === world.dragging.atomId);
    if (anchor) {
      const dxAnchor = world.dragging.targetX - anchor.x;
      const dyAnchor = world.dragging.targetY - anchor.y;
      for (const atom of world.dragging.mol.atoms) {
        atom.x += dxAnchor;
        atom.y += dyAnchor;
        atom.vx *= 0.55;
        atom.vy *= 0.55;
      }
    }
  }
});

window.addEventListener('pointerup', (e) => {
  if (world.light.firing && e.pointerId === world.light.pointerId) {
    stopLightBeam();
  }
  if (world.dragging.mol && e.pointerId === world.dragging.pointerId) {
    if (canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    armDraggedMoleculeRecovery(world.dragging.mol);
    clearDraggingState();
  }
});

window.addEventListener('pointercancel', (e) => {
  if (world.light.firing && e.pointerId === world.light.pointerId) {
    stopLightBeam();
  }
  if (world.dragging.mol && e.pointerId === world.dragging.pointerId) {
    if (canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    armDraggedMoleculeRecovery(world.dragging.mol);
    clearDraggingState();
  }
});

document.querySelectorAll('.tabBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    activateTab(btn.dataset.tab);
  });
});

document.querySelectorAll('.controlToggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('.controlGroup');
    if (!group) return;
    setControlGroupOpen(group, !group.classList.contains('open'));
  });
});

searchInput.addEventListener('input', (e) => {
  world.ui.search = e.target.value;
  updateSearchClearVisibility();
  markSidebarDirty();
  renderSidebar();
});

searchClearBtn?.addEventListener('click', () => {
  world.ui.search = '';
  searchInput.value = '';
  updateSearchClearVisibility();
  markSidebarDirty();
  renderSidebar();
  searchInput.focus();
});

playPauseBtn.addEventListener('click', toggleRunning);

clearBtn.addEventListener('click', clearWorld);

timeScaleBtn.addEventListener('click', cycleTimeScale);
stirBtn.addEventListener('click', () => startStirring());
lightBtn.addEventListener('click', () => {
  setActiveTool(world.ui.activeTool === 'light' ? 'select' : 'light');
});

for (const btn of tempPresetButtons) {
  btn.addEventListener('click', () => {
    world.temperatureC = clamp(Number(btn.dataset.tempPreset), TEMP_MIN_C, TEMP_MAX_C);
    updateThermalLabels();
  });
}

for (const btn of pressurePresetButtons) {
  btn.addEventListener('click', () => {
    world.pressureAtm = clamp(Number(btn.dataset.pressurePreset), PRESSURE_MIN_ATM, PRESSURE_MAX_ATM);
    updateThermalLabels();
  });
}

stirStrengthSlider.addEventListener('input', (e) => {
  world.stirStrength = clamp(Number(e.target.value) || world.stirStrength, Number(stirStrengthSlider.min), Number(stirStrengthSlider.max));
  updateThermalLabels();
});

lightStrengthSlider.addEventListener('input', (e) => {
  world.lightStrength = clamp(Number(e.target.value) || world.lightStrength, Number(lightStrengthSlider.min), Number(lightStrengthSlider.max));
  updateThermalLabels();
});

lightBandSlider.addEventListener('input', (e) => {
  const index = clamp(Math.round(Number(e.target.value) || 0), Number(lightBandSlider.min), Number(lightBandSlider.max));
  world.light.band = LIGHT_BANDS[index]?.id || 'uv';
  updateThermalLabels();
});

heatPulseBtn.addEventListener('click', () => {
  const cx = world.bounds ? world.bounds.x + world.bounds.w * 0.5 : window.innerWidth * 0.5;
  const cy = world.bounds ? world.bounds.y + world.bounds.h * 0.5 : window.innerHeight * 0.5;
  const dose = Math.abs(world.heatDoseC);
  applyThermalImpulse(dose, 'Heater pulse', { x: cx, y: cy, label: `heater ${formatThermalDelta(dose)}`, source: 'heater' });
  updateThermalLabels();
});

coolPulseBtn.addEventListener('click', () => {
  const cx = world.bounds ? world.bounds.x + world.bounds.w * 0.5 : window.innerWidth * 0.5;
  const cy = world.bounds ? world.bounds.y + world.bounds.h * 0.5 : window.innerHeight * 0.5;
  const dose = -Math.abs(world.heatDoseC);
  applyThermalImpulse(dose, 'Cooling shot', { x: cx, y: cy, label: `cool ${formatThermalDelta(dose)}`, source: 'cooler' });
  updateThermalLabels();
});

heatDoseSlider.addEventListener('input', (e) => {
  world.heatDoseC = clamp(Math.abs(Number(e.target.value) || 0), Number(heatDoseSlider.min), Number(heatDoseSlider.max));
  updateThermalLabels();
});

heatSlider.addEventListener('input', (e) => {
  world.temperatureC = sliderValueToTemperature(Number(e.target.value));
  updateThermalLabels();
});

pressureSlider.addEventListener('input', (e) => {
  world.pressureAtm = sliderValueToPressure(Number(e.target.value));
  updateThermalLabels();
});

heatSlider.addEventListener('wheel', (e) => {
  e.preventDefault();
  const baseStep = Math.abs(world.temperatureC) < 120 ? 5 : 12;
  nudgeTemperature((e.deltaY < 0 ? 1 : -1) * (e.shiftKey ? 1 : baseStep));
}, { passive: false });

pressureSlider.addEventListener('wheel', (e) => {
  e.preventDefault();
  nudgePressure(e.deltaY < 0 ? 1 : -1, e.shiftKey);
}, { passive: false });

tempUnitSelect.addEventListener('change', (e) => {
  world.ui.tempInputUnit = e.target.value;
  updateThermalLabels();
});

function commitTempInputValue() {
  const entered = Number(tempInput.value);
  if (!Number.isFinite(entered)) {
    updateThermalLabels();
    return;
  }
  world.temperatureC = clamp(selectedUnitToCelsius(entered), TEMP_MIN_C, TEMP_MAX_C);
  updateThermalLabels();
}

tempInput.addEventListener('focus', () => {
  world.ui.editingTempInput = true;
});

tempInput.addEventListener('blur', () => {
  world.ui.editingTempInput = false;
  commitTempInputValue();
});

tempInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    tempInput.blur();
  }
});

tempInput.addEventListener('wheel', (e) => {
  if (document.activeElement !== tempInput) return;
  e.preventDefault();
  const step = e.shiftKey ? 10 : 1;
  const nextValue = (Number(tempInput.value) || 0) + (e.deltaY < 0 ? step : -step);
  tempInput.value = String(nextValue);
  world.ui.editingTempInput = false;
  commitTempInputValue();
}, { passive: false });

window.addEventListener('keydown', (e) => {
  if (e.key === '/' && !editableTarget(e.target)) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
    return;
  }

  if (e.altKey && !editableTarget(e.target)) {
    if (e.key === '1') activateTab('library');
    else if (e.key === '2') activateTab('scene');
    else if (e.key === '3') activateTab('inspect');
    else if (e.key === '4') activateTab('reactions');
    else return;
    e.preventDefault();
    return;
  }

  if (e.key === 'Escape') {
    if (world.ui.search.trim()) {
      world.ui.search = '';
      searchInput.value = '';
      updateSearchClearVisibility();
      markSidebarDirty();
      renderSidebar();
      return;
    }
    if (world.selectedMolId != null) {
      world.selectedMolId = null;
      markSidebarDirty();
      renderSidebar();
      return;
    }
    if (world.ui.activeTool !== 'select') {
      setActiveTool('select');
    }
    return;
  }

  if (e.key === ' ' && !editableTarget(e.target)) {
    e.preventDefault();
    toggleRunning();
  }
});

async function loadObservationCounter() {
  setObservationCounter('...');
  try {
    const res = await fetch('./api/observations', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    setObservationCounter(data.count, data.storage === 'memory' ? '(temporary)' : '');
  } catch (err) {
    setObservationCounter('...', '(offline)');
  }
}

async function initApp() {
  world.reactionData = await loadReactionData();
  await loadObservationCounter();
  collapseAllControlGroups();
  resize();
  refreshLucideIcons();
  updateSearchClearVisibility();
  updateThermalLabels();
  syncTabButtons();
  renderSidebar();
  requestAnimationFrame(frame);
}

initApp();
