const world = {
  running: true,
  temperatureC: 25,
  pressureAtm: 1,
  heatPulseC: 0,
  heatDoseC: 180,
  stirStrength: 1.8,
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
  reactionData: {
    speciesHints: {},
    reactions: []
  },
  reactionLog: [],
  reactionLogMutedUntil: 0,
  stats: {
    reactions: 0
  },
  bounds: null,
  selectedMolId: null,
  ui: {
    activeTab: 'library',
    lastRenderedTab: 'library',
    libraryFilter: 'all',
    search: '',
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

canvas.addEventListener('pointerdown', (e) => {
  const p = pointerPos(e);
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
  if (!world.dragging.mol) return;
  const p = pointerPos(e);
  moveMoleculeCenterTo(
    world.dragging.mol,
    p.x - world.dragging.offsetX,
    p.y - world.dragging.offsetY
  );
});

window.addEventListener('pointerup', () => {
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

stirStrengthSlider.addEventListener('input', (e) => {
  world.stirStrength = clamp(Number(e.target.value) || world.stirStrength, Number(stirStrengthSlider.min), Number(stirStrengthSlider.max));
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
  world.temperatureC = Number(e.target.value);
  updateThermalLabels();
});

pressureSlider.addEventListener('input', (e) => {
  world.pressureAtm = clamp(Number(e.target.value), Number(pressureSlider.min), Number(pressureSlider.max));
  updateThermalLabels();
});

tempUnitSelect.addEventListener('change', (e) => {
  world.ui.tempInputUnit = e.target.value;
  updateThermalLabels();
});

tempInput.addEventListener('change', () => {
  const entered = Number(tempInput.value);
  if (!Number.isFinite(entered)) {
    updateThermalLabels();
    return;
  }
  const min = Number(heatSlider.min);
  const max = Number(heatSlider.max);
  world.temperatureC = clamp(selectedUnitToCelsius(entered), min, max);
  updateThermalLabels();
});

async function initApp() {
  world.reactionData = await loadReactionData();
  resize();
  updateThermalLabels();
  syncTabButtons();
  renderSidebar();
  requestAnimationFrame(frame);
}

initApp();
