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
    offsetX: 0,
    offsetY: 0
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
  world.ui.activeTool = tool;
  world.dragging.mol = null;
  if (tool !== 'light') stopLightBeam();
  updateThermalLabels();
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

  const c = moleculeCenter(hit.mol);
  world.dragging.mol = hit.mol;
  world.dragging.offsetX = p.x - c.x;
  world.dragging.offsetY = p.y - c.y;
});

window.addEventListener('pointermove', (e) => {
  if (world.light.firing && e.pointerId === world.light.pointerId) {
    updateLightBeamTarget(pointerPos(e));
    return;
  }
  if (!world.dragging.mol) return;
  const p = pointerPos(e);
  moveMoleculeCenterTo(
    world.dragging.mol,
    p.x - world.dragging.offsetX,
    p.y - world.dragging.offsetY
  );
});

window.addEventListener('pointerup', (e) => {
  if (world.light.firing && e.pointerId === world.light.pointerId) {
    stopLightBeam();
  }
  world.dragging.mol = null;
});

document.querySelectorAll('.tabBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    cacheCurrentTabScroll();
    world.ui.activeTab = btn.dataset.tab;
    syncTabButtons();
    markSidebarDirty();
    renderSidebar();
  });
});

document.querySelectorAll('.controlToggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('.controlGroup');
    if (!group) return;
    group.classList.toggle('open');
  });
});

searchInput.addEventListener('input', (e) => {
  world.ui.search = e.target.value;
  markSidebarDirty();
  renderSidebar();
});

playPauseBtn.addEventListener('click', () => {
  world.running = !world.running;
  playPauseBtn.textContent = world.running ? 'Pause' : 'Play';
  markSidebarDirty();
  renderSidebar();
});

clearBtn.addEventListener('click', clearWorld);

timeScaleBtn.addEventListener('click', cycleTimeScale);
stirBtn.addEventListener('click', () => startStirring());
lightBtn.addEventListener('click', () => {
  setActiveTool(world.ui.activeTool === 'light' ? 'select' : 'light');
});

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
  resize();
  updateThermalLabels();
  syncTabButtons();
  renderSidebar();
  requestAnimationFrame(frame);
}

initApp();
