const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

const playPauseBtn = document.getElementById('playPauseBtn');
const clearBtn = document.getElementById('clearBtn');
const heatPulseBtn = document.getElementById('heatPulseBtn');
const coolPulseBtn = document.getElementById('coolPulseBtn');
const stirBtn = document.getElementById('stirBtn');
const lightBtn = document.getElementById('lightBtn');
const stirStrengthSlider = document.getElementById('stirStrengthSlider');
const stirStrengthLabel = document.getElementById('stirStrengthLabel');
const stirStrengthValue = document.getElementById('stirStrengthValue');
const lightStrengthSlider = document.getElementById('lightStrengthSlider');
const lightStrengthLabel = document.getElementById('lightStrengthLabel');
const lightStrengthValue = document.getElementById('lightStrengthValue');
const lightBandSlider = document.getElementById('lightBandSlider');
const lightBandLabel = document.getElementById('lightBandLabel');
const lightBandValue = document.getElementById('lightBandValue');
const timeScaleBtn = document.getElementById('timeScaleBtn');
const heatSlider = document.getElementById('heatSlider');
const heatDoseSlider = document.getElementById('heatDoseSlider');
const heatLabel = document.getElementById('heatLabel');
const heatDoseLabel = document.getElementById('heatDoseLabel');
const heatDoseValue = document.getElementById('heatDoseValue');
const tempInput = document.getElementById('tempInput');
const tempUnitSelect = document.getElementById('tempUnitSelect');
const pressureLabel = document.getElementById('pressureLabel');
const pressureSlider = document.getElementById('pressureSlider');
const simLabel = document.getElementById('simLabel');
const statusText = document.getElementById('statusText');
const tabContent = document.getElementById('tabContent');
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const sidebarFooterText = document.getElementById('sidebarFooterText');
const observationCounter = document.getElementById('observationCounter');

const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const TAU = Math.PI * 2;
const GAS_CONSTANT_J_PER_MOL_K = 8.314462618;
const TEMP_MIN_C = -273.15;
const TEMP_MAX_C = 2500;
const TEMP_SLIDER_MIN = 0;
const TEMP_SLIDER_MAX = 1000;
const TEMP_SLIDER_ANCHOR_C = 25;
const TEMP_SLIDER_CURVE = 2.4;
const PRESSURE_MIN_ATM = 0.01;
const PRESSURE_MAX_ATM = 120;
const PRESSURE_SLIDER_MIN = 0;
const PRESSURE_SLIDER_MAX = 1000;
const PRESSURE_SLIDER_ANCHOR_ATM = 1;
const LIGHT_BANDS = [
  { id: 'radio', label: 'Radio', color: '#7db5ff', energy: 0, photochemical: false },
  { id: 'microwave', label: 'Microwave', color: '#87d3ff', energy: 1, photochemical: false },
  { id: 'infrared', label: 'Infrared', color: '#ffb37d', energy: 2, photochemical: false },
  { id: 'visible', label: 'Visible', color: '#fff0b0', energy: 3, photochemical: false },
  { id: 'uv', label: 'UV', color: '#cda7ff', energy: 4, photochemical: true },
  { id: 'xray', label: 'X-Ray', color: '#f2c5ff', energy: 5, photochemical: true },
  { id: 'gamma', label: 'Gamma', color: '#ffd4f0', energy: 6, photochemical: true }
];

function resize() {
  canvas.width = Math.floor(window.innerWidth * DPR);
  canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  world.bounds = getVesselRect();
}
window.addEventListener('resize', resize);

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function dist(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }
function rand(a, b) { return a + Math.random() * (b - a); }
function cToF(c) { return c * 9 / 5 + 32; }
function cToK(c) { return c + 273.15; }
function fToC(f) { return (f - 32) * 5 / 9; }
function kToC(k) { return k - 273.15; }
function sliderNorm(value, min, max) {
  return clamp((value - min) / Math.max(1e-9, max - min), 0, 1);
}
function sliderValueFromNorm(norm, min, max) {
  return min + clamp(norm, 0, 1) * (max - min);
}
function temperatureToSliderValue(tempC) {
  const clamped = clamp(tempC, TEMP_MIN_C, TEMP_MAX_C);
  let norm;
  if (clamped <= TEMP_SLIDER_ANCHOR_C) {
    const ratio = (clamped - TEMP_MIN_C) / Math.max(1e-9, TEMP_SLIDER_ANCHOR_C - TEMP_MIN_C);
    norm = 0.5 * Math.pow(clamp(ratio, 0, 1), 1 / TEMP_SLIDER_CURVE);
  } else {
    const ratio = (clamped - TEMP_SLIDER_ANCHOR_C) / Math.max(1e-9, TEMP_MAX_C - TEMP_SLIDER_ANCHOR_C);
    norm = 0.5 + 0.5 * Math.pow(clamp(ratio, 0, 1), 1 / TEMP_SLIDER_CURVE);
  }
  return Math.round(sliderValueFromNorm(norm, TEMP_SLIDER_MIN, TEMP_SLIDER_MAX));
}
function sliderValueToTemperature(sliderValue) {
  const norm = sliderNorm(sliderValue, TEMP_SLIDER_MIN, TEMP_SLIDER_MAX);
  if (norm <= 0.5) {
    const ratio = Math.pow(norm / 0.5, TEMP_SLIDER_CURVE);
    return TEMP_MIN_C + ratio * (TEMP_SLIDER_ANCHOR_C - TEMP_MIN_C);
  }
  const ratio = Math.pow((norm - 0.5) / 0.5, TEMP_SLIDER_CURVE);
  return TEMP_SLIDER_ANCHOR_C + ratio * (TEMP_MAX_C - TEMP_SLIDER_ANCHOR_C);
}
function pressureToSliderValue(pressureAtm) {
  const clamped = clamp(pressureAtm, PRESSURE_MIN_ATM, PRESSURE_MAX_ATM);
  let norm;
  if (clamped <= PRESSURE_SLIDER_ANCHOR_ATM) {
    const ratio = Math.log(clamped / PRESSURE_MIN_ATM) / Math.log(PRESSURE_SLIDER_ANCHOR_ATM / PRESSURE_MIN_ATM);
    norm = 0.5 * clamp(ratio, 0, 1);
  } else {
    const ratio = Math.log(clamped / PRESSURE_SLIDER_ANCHOR_ATM) / Math.log(PRESSURE_MAX_ATM / PRESSURE_SLIDER_ANCHOR_ATM);
    norm = 0.5 + 0.5 * clamp(ratio, 0, 1);
  }
  return Math.round(sliderValueFromNorm(norm, PRESSURE_SLIDER_MIN, PRESSURE_SLIDER_MAX));
}
function sliderValueToPressure(sliderValue) {
  const norm = sliderNorm(sliderValue, PRESSURE_SLIDER_MIN, PRESSURE_SLIDER_MAX);
  if (norm <= 0.5) {
    const ratio = clamp(norm / 0.5, 0, 1);
    return PRESSURE_MIN_ATM * Math.pow(PRESSURE_SLIDER_ANCHOR_ATM / PRESSURE_MIN_ATM, ratio);
  }
  const ratio = clamp((norm - 0.5) / 0.5, 0, 1);
  return PRESSURE_SLIDER_ANCHOR_ATM * Math.pow(PRESSURE_MAX_ATM / PRESSURE_SLIDER_ANCHOR_ATM, ratio);
}
function tempToHeatLevel(celsius) {
  const k = cToK(celsius);
  return clamp((k - 273.15) / 1400, 0, 1);
}
function getEffectiveTemperatureC() {
  return clamp(world.temperatureC + world.heatPulseC, TEMP_MIN_C, 3200);
}
function getGasMoleculeCount() {
  return world.molecules.filter(m => m.alive && m.phase === 'gas').length;
}
function getEffectivePressureAtm() {
  const bounds = world.bounds;
  const area = bounds ? bounds.w * bounds.h : 420000;
  const volumeScale = clamp(420000 / Math.max(180000, area), 0.7, 1.7);
  const tempScale = clamp(cToK(getEffectiveTemperatureC()) / 298.15, 0.45, 5.5);
  const gasContribution = getGasMoleculeCount() * 0.035 * tempScale * volumeScale;
  return clamp(world.pressureAtm + gasContribution, PRESSURE_MIN_ATM, 150);
}
function formatPressureAtm(pressureAtm) {
  if (pressureAtm < 0.1) return pressureAtm.toFixed(3);
  if (pressureAtm < 10) return pressureAtm.toFixed(2);
  return pressureAtm.toFixed(1);
}
function getPressureAdjustedBoilingPointC(type, pressureAtm) {
  const config = EVAPORATION_CONFIG[type];
  if (!config) return null;

  const pressure = clamp(
    pressureAtm,
    config.minPressureAtm || 0.01,
    150
  );
  const normalBoilK = cToK(config.boilC);
  const dHvapJ = Math.max(12000, (config.dHvapKJ || 35) * 1000);
  const invT = (1 / normalBoilK) - ((GAS_CONSTANT_J_PER_MOL_K / dHvapJ) * Math.log(pressure));
  if (!Number.isFinite(invT) || invT <= 0) return config.boilC;
  return clamp(kToC(1 / invT), -120, 3200);
}
function getPressureAdjustedCondensePointC(type, pressureAtm) {
  const config = EVAPORATION_CONFIG[type];
  if (!config) return null;
  const boilC = getPressureAdjustedBoilingPointC(type, pressureAtm);
  const baseGap = Math.max(4, config.boilC - config.condenseC);
  const gapScale = pressureAtm < 1 ? clamp(0.88 + pressureAtm * 0.2, 0.72, 1.05) : clamp(1 - Math.min(pressureAtm - 1, 8) * 0.03, 0.72, 1);
  return boilC - baseGap * gapScale;
}
function formatThermalDelta(deltaC) {
  if (!Number.isFinite(deltaC) || Math.abs(deltaC) < 0.5) return '';
  return `${deltaC > 0 ? '+' : ''}${Math.round(deltaC)}°C`;
}
function addThermalEvent(x, y, deltaC, label = '') {
  world.thermalEvents.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    x,
    y,
    deltaC,
    label,
    age: 0,
    ttl: THERMAL_EVENT_TTL
  });
  if (world.thermalEvents.length > 48) {
    world.thermalEvents.splice(0, world.thermalEvents.length - 48);
  }
}
function applyThermalImpulse(deltaC, reason = '', options = {}) {
  if (!Number.isFinite(deltaC) || Math.abs(deltaC) < 0.1) return;
  world.heatPulseC = clamp(world.heatPulseC + deltaC, -900, 2200);
  if (deltaC > 0) world.thermalStats.addedC += deltaC;
  else world.thermalStats.removedC += Math.abs(deltaC);

  if (Number.isFinite(options.x) && Number.isFinite(options.y)) {
    addThermalEvent(options.x, options.y, deltaC, options.label || reason);
  }

  if (options.log !== false) {
    addReactionLog(
      'thermal',
      `${reason || 'Thermal change'} ${formatThermalDelta(deltaC)}`.trim(),
      { thermalDeltaC: deltaC, source: options.source || 'system', x: options.x, y: options.y }
    );
  }
}
function colorWithAlpha(hex, alpha) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function pairKey(elA, elB) {
  return [elA, elB].sort().join('-');
}
function pointInRect(point, rect) {
  return !!rect && point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
}
function getLightBand(value = world.light.band) {
  return LIGHT_BANDS.find(entry => entry.id === value) || LIGHT_BANDS[4];
}
function toSubscript(num) {
  return String(num).split('').map(d => SUBSCRIPT[d] || d).join('');
}
function prettyFormula(formula) {
  return String(formula).replace(/[0-9]+/g, m => toSubscript(m));
}
function getAtomCounts(atoms) {
  const counts = {};
  for (const atom of atoms) counts[atom.el] = (counts[atom.el] || 0) + 1;
  return counts;
}
function formatFormulaFromAtoms(atoms) {
  const counts = getAtomCounts(atoms);
  const parts = [];
  if (counts.C) {
    parts.push(`C${counts.C > 1 ? counts.C : ''}`);
    delete counts.C;
  }
  if (counts.H) {
    parts.push(`H${counts.H > 1 ? counts.H : ''}`);
    delete counts.H;
  }
  for (const el of Object.keys(counts).sort()) {
    parts.push(`${el}${counts[el] > 1 ? counts[el] : ''}`);
  }
  return parts.join('') || '?';
}
function averageElementColor(atoms) {
  let r = 0, g = 0, b = 0;
  for (const atom of atoms) {
    const hex = (elementStyles[atom.el]?.color || '#9bbcff').replace('#', '');
    const n = parseInt(hex, 16);
    r += (n >> 16) & 255;
    g += (n >> 8) & 255;
    b += n & 255;
  }
  const n = Math.max(1, atoms.length);
  const rr = Math.round(r / n).toString(16).padStart(2, '0');
  const gg = Math.round(g / n).toString(16).padStart(2, '0');
  const bb = Math.round(b / n).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`;
}

function plainFormula(formula) {
  return String(formula || '').replace(/[₀-₉]/g, ch => ({
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
  }[ch] || ch));
}

function formatSimTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function addReactionLog(type, message, extra = {}) {
  if (world.time < (world.reactionLogMutedUntil || 0)) return;
  world.reactionLog.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    t: world.time,
    tempC: getEffectiveTemperatureC(),
    type,
    message,
    ...extra
  });
  if (world.reactionLog.length > MAX_REACTION_LOG) {
    world.reactionLog.splice(0, world.reactionLog.length - MAX_REACTION_LOG);
  }
  markSidebarDirty();
}

const THERMAL_RULE_DEFAULTS = {
  carbon_monoxide_formation: 34,
  carbon_dioxide_formation: 62,
  haloform_bleach_acetone: 18,
  water_combustion: 220,
  methane_combustion: 320,
  peroxide_decomposition: 88,
  sodium_water_reaction: 180,
  hydrogen_chlorination: 145,
  chlorine_hydrolysis: 22,
  acid_base_neutralization: 72,
  hydrogen_atom_recombination: 24,
  oxygen_atom_recombination: 42,
  ozone_formation: -18,
  ozone_decomposition: 36,
  atomic_water_assembly: 95,
  acetaldehyde_oxidation: 46
};

function normalizeReactionData(data) {
  const source = data && typeof data === 'object' ? data : {};
  const speciesHints = source.speciesHints && typeof source.speciesHints === 'object'
    ? { ...source.speciesHints }
    : {};
  const reactions = Array.isArray(source.reactions)
    ? source.reactions
        .filter(rule => Array.isArray(rule.reactants) && Array.isArray(rule.products))
        .map(rule => {
          const expandedReactants = [];
          for (const part of rule.reactants) {
            const count = Math.max(1, Number(part.count) || 1);
            for (let i = 0; i < count; i++) expandedReactants.push(part.type);
          }
          const rawThermalDelta = rule.thermalDeltaC;
          return {
            ...rule,
            category: rule.category || 'scripted',
            conditions: { ...(rule.conditions || {}) },
            kinetics: { ...(rule.kinetics || {}) },
            thermalDeltaC: rawThermalDelta == null
              ? (THERMAL_RULE_DEFAULTS[rule.id] || 0)
              : (Number(rawThermalDelta) || 0),
            expandedReactants
          };
        })
    : [];
  return { speciesHints, reactions };
}

async function loadReactionData() {
  try {
    const res = await fetch('./reactions.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return normalizeReactionData(await res.json());
  } catch (err) {
    addReactionLog('system', `Using fallback reaction dataset (${err.message || 'load failed'})`);
    return normalizeReactionData(FALLBACK_REACTION_DATA);
  }
}

function getSpeciesHint(type) {
  return world.reactionData.speciesHints[type] || '';
}

function reactionEquation(rule) {
  return rule.displayEquation || `${rule.name || rule.id}`;
}

function getSpeciesCatalogItem(type) {
  return LIBRARY_ITEMS.find(item => item.key === type) || null;
}

function formatObservationCount(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value < 0) return '...';
  return Math.floor(value).toLocaleString('en-US');
}

function setObservationCounter(count, note = '') {
  if (!observationCounter) return;
  const total = formatObservationCount(count);
  const suffix = note ? ` ${note}` : '';
  observationCounter.textContent = `THIS SITE HAS BEEN OBSERVED ${total} TIMES${suffix}`;
}

function getSpeciesDisplayName(type) {
  return SPECIES[type]?.display || getSpeciesCatalogItem(type)?.name || type;
}

function getSpeciesDisplayLabel(type) {
  return SPECIES[type]?.label || getSpeciesCatalogItem(type)?.label || type;
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function formatSpeciesList(types, limit = 6) {
  const labels = uniqueStrings(types).map(getSpeciesDisplayLabel);
  if (labels.length === 0) return 'none';
  if (labels.length <= limit) return labels.join(', ');
  return `${labels.slice(0, limit).join(', ')} +${labels.length - limit} more`;
}

function getSpeciesProfile(type) {
  const rules = world.reactionData.reactions || [];
  const reactantRules = rules.filter(rule => rule.expandedReactants.includes(type));
  const productRules = rules.filter(rule => rule.products.some(part => part.type === type));

  const reactWith = uniqueStrings(
    reactantRules.flatMap(rule => rule.expandedReactants.filter(other => other !== type))
  );
  const turnsInto = uniqueStrings(
    reactantRules.flatMap(rule => rule.products.map(part => part.type)).filter(other => other !== type)
  );
  const formedFrom = uniqueStrings(
    productRules.flatMap(rule => rule.expandedReactants.filter(other => other !== type))
  );

  return {
    type,
    hint: getSpeciesHint(type),
    reactantRules,
    productRules,
    reactWith,
    turnsInto,
    formedFrom,
    ruleCount: uniqueStrings([...reactantRules.map(rule => rule.id), ...productRules.map(rule => rule.id)]).length
  };
}

function formatPhaseCapabilities(type) {
  const states = Object.keys(getMaterialConditions(type).states || {});
  return states.length ? states.join(', ') : 'none';
}

function formatMaterialTemp(value) {
  return Number.isFinite(value) ? `${Math.round(value)}°C` : 'n/a';
}

function speciesBehaviorSummary(type) {
  const profile = getSpeciesProfile(type);
  const material = getMaterialConditions(type);
  const parts = [];
  const evap = EVAPORATION_CONFIG[type];
  const dissolution = DISSOLUTION_CONFIG[type];
  const ionProfile = AQUEOUS_ION_PROFILES[type];
  const weakAcid = WEAK_AQUEOUS_ACIDS[type];
  if (material.descriptors.polarity && material.descriptors.polarity !== 'unknown') {
    parts.push(`Polarity: ${material.descriptors.polarity}.`);
  }
  parts.push(`Phases: ${formatPhaseCapabilities(type)}.`);
  if (profile.reactWith.length) parts.push(`Reacts with ${formatSpeciesList(profile.reactWith, 4)}.`);
  if (profile.turnsInto.length) parts.push(`Can form ${formatSpeciesList(profile.turnsInto, 4)}.`);
  if (profile.formedFrom.length) parts.push(`Can be made from ${formatSpeciesList(profile.formedFrom, 4)}.`);
  if (evap) parts.push(`Evaporates near ${evap.boilC}°C and condenses below ${evap.condenseC}°C.`);
  else if (material.descriptors.vaporLevel === 0) parts.push('No gas-phase transition is modeled.');
  if (dissolution) parts.push(`Dissolves into ${dissolution.solventGroup} when enough solvent is nearby.`);
  if (ionProfile) {
    parts.push(`In water it separates into ${Object.keys(ionProfile.ions).map(formatIonLabel).join(' and ')}.`);
  } else if (weakAcid && type !== 'CO2') {
    parts.push(`In water it acts as a weak acid.`);
  }
  if (material.optical?.absorptionBands?.length) {
    parts.push(`Responds most to ${material.optical.absorptionBands.join(', ')} light.`);
  }
  if (type === 'CO2') parts.push('Under pressure it can dissolve into water and make carbonated water.');
  if (!parts.length) return 'No scripted reactions currently reference this species.';
  return parts.join(' ');
}

function thermalBadgeMarkup(deltaC) {
  if (!Number.isFinite(deltaC) || Math.abs(deltaC) < 0.5) return '';
  const hot = deltaC > 0;
  return `<span class="thermalBadge ${hot ? 'hot' : 'cool'}">${hot ? 'Releases' : 'Consumes'} ${Math.abs(Math.round(deltaC))}°C</span>`;
}

function thermalWindowMarkup(rule) {
  const min = Number(rule.conditions?.tempMinC);
  const max = Number(rule.conditions?.tempMaxC);
  if (!Number.isFinite(min) && !Number.isFinite(max)) return '';
  const minText = Number.isFinite(min) ? `${Math.round(min)}°C` : 'any temp';
  const maxText = Number.isFinite(max) ? `${Math.round(max)}°C` : 'any temp';
  return `<span class="thermalBadge">${minText} to ${maxText}</span>`;
}

function pressureWindowMarkup(rule) {
  const min = Number(rule.conditions?.pressureMinAtm);
  const max = Number(rule.conditions?.pressureMaxAtm);
  if (!Number.isFinite(min) && !Number.isFinite(max)) return '';
  const minText = Number.isFinite(min) ? `${min.toFixed(2)} atm` : 'any pressure';
  const maxText = Number.isFinite(max) ? `${max.toFixed(2)} atm` : 'any pressure';
  return `<span class="thermalBadge">${minText} to ${maxText}</span>`;
}

function formatReactionLogMessage(entry) {
  const parts = [entry.message];
  if (Number.isFinite(entry.thermalDeltaC) && Math.abs(entry.thermalDeltaC) >= 0.5) {
    parts.push(`(${entry.thermalDeltaC > 0 ? '+' : ''}${Math.round(entry.thermalDeltaC)}°C)`);
  }
  return parts.join(' ');
}

function renderRuleList(title, rules, emptyText) {
  const box = document.createElement('div');
  box.className = 'card';
  box.innerHTML = `
    <div class="cardTop">
      <div class="cardTitle">
        <strong>${title}</strong>
        <span>${rules.length} pathway${rules.length === 1 ? '' : 's'}</span>
      </div>
    </div>
  `;

  if (!rules.length) {
    const empty = document.createElement('div');
    empty.className = 'small';
    empty.textContent = emptyText;
    box.appendChild(empty);
    return box;
  }

  for (const rule of rules) {
    const row = document.createElement('div');
    row.className = 'hintBox';
    row.style.marginTop = '10px';
    row.innerHTML = `
      <strong style="color:var(--text)">${rule.name}</strong><br>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 8px 0;">${thermalBadgeMarkup(rule.thermalDeltaC)}${thermalWindowMarkup(rule)}${pressureWindowMarkup(rule)}</div>
      ${reactionEquation(rule)}<br>
      <span style="color:var(--muted)">${rule.note || 'Scripted pathway.'}</span>
    `;
    box.appendChild(row);
  }

  return box;
}

function reactionLogText() {
  return world.reactionLog.map(entry => {
    const stamp = `t=${formatSimTime(entry.t)} temp=${Math.round(entry.tempC)}C type=${entry.type}`;
    return `${stamp} :: ${formatReactionLogMessage(entry)}`;
  }).join('\n');
}

async function copyReactionLog() {
  const text = reactionLogText();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    addReactionLog('system', 'Reaction log copied to clipboard');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    addReactionLog('system', 'Reaction log copied to clipboard');
  }
  markSidebarDirty();
}

function exportReactionLog() {
  const text = reactionLogText();
  if (!text) return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `chem-reactions-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  addReactionLog('system', 'Reaction log exported to file');
  markSidebarDirty();
}
