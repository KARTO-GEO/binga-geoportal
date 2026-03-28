/* ═══════════════════════════════════════════════════
   ui.js — UI Panel Builders
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════
// LAYER PANEL (sidebar → Layers tab)
// ═══════════════════════════════════════════════════
function buildLayerPanel() {
  const panel = document.getElementById('layers-panel');

  // Group layers by their "group" property
  const groups = {};
  for (const [key, def] of Object.entries(LAYER_DEFS)) {
    if (!groups[def.group]) groups[def.group] = [];
    groups[def.group].push({ key, ...def });
  }

  let html = `
    <div class="search-box">
      <i class="fas fa-search"></i>
      <input placeholder="Search layers..." oninput="filterLayers(this.value)">
    </div>
    <div style="display:flex;gap:0.4rem;padding:0 0 0.75rem">
      <button class="btn btn-sm btn-outline" style="flex:1;font-size:0.78rem" onclick="toggleAllLayers(true)">
        <i class="fas fa-eye"></i> All On
      </button>
      <button class="btn btn-sm btn-outline" style="flex:1;font-size:0.78rem" onclick="toggleAllLayers(false)">
        <i class="fas fa-eye-slash"></i> All Off
      </button>
    </div>`;

  for (const [group, layers] of Object.entries(groups)) {
    html += `<div class="layer-section"><div class="layer-section-title">${group}</div>`;
    for (const l of layers) {
      const count = sampleData[l.key] ? sampleData[l.key].features.length : 0;
      const isOn  = l.visible ? 'on' : '';
      html += `
        <div class="layer-item" data-layer="${l.key}" data-name="${l.name.toLowerCase()}">
          <div class="layer-toggle ${isOn}" onclick="toggleLayer('${l.key}', this)"></div>
          <div class="layer-dot" style="background:${l.color}"></div>
          <span class="layer-name">${l.name}</span>
          <span class="layer-count">${count}</span>
        </div>`;
    }
    html += '</div>';
  }

  panel.innerHTML = html;
}


// ── Layer Search Filter ──
function filterLayers(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.layer-item').forEach(el => {
    el.style.display = el.dataset.name.includes(q) ? 'flex' : 'none';
  });
}

// ── Toggle All Layers On / Off ──
function toggleAllLayers(turnOn) {
  for (const key of Object.keys(LAYER_DEFS)) {
    if (turnOn && !map.hasLayer(layerGroups[key])) {
      layerGroups[key].addTo(map);
    } else if (!turnOn && map.hasLayer(layerGroups[key])) {
      map.removeLayer(layerGroups[key]);
    }
  }
  // Sync the toggle switches in the panel
  document.querySelectorAll('.layer-toggle').forEach(el => {
    turnOn ? el.classList.add('on') : el.classList.remove('on');
  });
  showToast(turnOn ? 'All layers turned on' : 'All layers turned off', 'info');
}


// ═══════════════════════════════════════════════════
// LEGEND
// ═══════════════════════════════════════════════════
function buildLegend() {
  // Road sub-type entries (mirrors ROAD_STYLES in map.js)
  const ROAD_LEGEND = [
    { label: 'National Road',    color: '#4A2B0F', weight: 6,   dash: '14,5', casing: true  },
    { label: 'Tertiary Road',    color: '#5C3317', weight: 4,   dash: '',     casing: false },
    { label: 'Service Road',     color: '#7B4B2A', weight: 2.5, dash: '',     casing: false },
    { label: 'Unclassified',     color: '#9E9E9E', weight: 1.8, dash: '',     casing: false },
    { label: 'Residential Road', color: '#E6C619', weight: 2,   dash: '',     casing: false },
    { label: 'Track / Trail',    color: '#C8B89A', weight: 1.2, dash: '4,6',  casing: false }
  ];

  let html = '';
  for (const [key, def] of Object.entries(LAYER_DEFS)) {

    // ── Roads: expand to per-type sub-entries ──
    if (key === 'roads') {
      html += `<div class="legend-item" style="font-weight:600;padding-bottom:2px;margin-top:2px">
        <i class="fas fa-road" style="color:#7B4B2A;margin-right:5px;font-size:0.75rem"></i>
        <span>Roads</span></div>`;
      for (const r of ROAD_LEGEND) {
        const svgW = 30, svgH = 10, y = svgH / 2;
        const w = Math.min(r.weight, svgH - 1);
        const dashAttr = r.dash ? `stroke-dasharray="${r.dash}"` : '';
        const casingLine = r.casing
          ? `<line x1="0" y1="${y}" x2="${svgW}" y2="${y}"
               stroke="#FFFFFF" stroke-width="${Math.max(w * 0.32, 1.2)}"
               stroke-linecap="round" stroke-dasharray="9,9"/>`
          : '';
        const swatch = `<svg width="${svgW}" height="${svgH}" style="flex-shrink:0;overflow:visible;display:block">
          <line x1="0" y1="${y}" x2="${svgW}" y2="${y}"
            stroke="${r.color}" stroke-width="${w}"
            stroke-linecap="round" ${dashAttr}/>
          ${casingLine}
        </svg>`;
        html += `<div class="legend-item" style="padding-left:10px">${swatch}<span style="font-size:0.78rem">${r.label}</span></div>`;
      }
      continue;
    }

    // ── National Parks: IUCN standard dark green ──
    if (key === 'nationalParks') {
      const swatch = `<div class="legend-swatch" style="
        background:#005A32;opacity:0.85;border:2px solid #005A32;
        border-radius:2px"></div>`;
      html += `<div class="legend-item">${swatch}<span>${def.name}</span></div>`;
      continue;
    }

    // ── Conservancies: striped swatch ──
    if (key === 'conservancies') {
      const swatch = `<div style="
        width:14px;height:14px;flex-shrink:0;border-radius:2px;
        border:2px solid #1a8a4a;
        background: repeating-linear-gradient(
          45deg,
          rgba(82,190,128,0.55) 0px,
          rgba(82,190,128,0.55) 3px,
          rgba(255,255,255,0.25) 3px,
          rgba(255,255,255,0.25) 6px
        )"></div>`;
      html += `<div class="legend-item">${swatch}<span>${def.name}</span></div>`;
      continue;
    }

    // ── District: no fill, thick dashed amber ──
    if (key === 'districtBoundary') {
      const swatch = `<svg width="28" height="10" style="flex-shrink:0;overflow:visible">
        <line x1="0" y1="5" x2="28" y2="5"
          stroke="#D4A843" stroke-width="4" stroke-linecap="round"
          stroke-dasharray="8,4"/>
      </svg>`;
      html += `<div class="legend-item">${swatch}<span>${def.name}</span></div>`;
      continue;
    }

    // ── Ward Boundaries: no fill, thin blue ──
    if (key === 'wardBoundaries') {
      const swatch = `<svg width="28" height="10" style="flex-shrink:0;overflow:visible">
        <line x1="0" y1="5" x2="28" y2="5"
          stroke="#7FB3D8" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
      html += `<div class="legend-item">${swatch}<span>${def.name}</span></div>`;
      continue;
    }

    let swatch;
    if (def.type === 'line') {
      swatch = `<div class="legend-line" style="background:${def.color}"></div>`;
    } else if (def.type === 'polygon') {
      swatch = `<div class="legend-swatch" style="background:${def.color};opacity:0.3;border:2px solid ${def.color}"></div>`;
    } else {
      swatch = `<div class="legend-swatch" style="background:${def.color};border-radius:50%"></div>`;
    }
    html += `<div class="legend-item">${swatch}<span>${def.name}</span></div>`;
  }
  document.getElementById('legend-items').innerHTML = html;
}


// ═══════════════════════════════════════════════════
// POPULATE DROPDOWNS (filter, data, add-feature)
// ═══════════════════════════════════════════════════
function populateDropdowns() {
  const options = Object.entries(LAYER_DEFS)
    .map(([k, v]) => `<option value="${k}">${v.name}</option>`)
    .join('');

  document.getElementById('filter-layer').innerHTML      = '<option value="">— Select Layer —</option>' + options;
  document.getElementById('data-layer-select').innerHTML  = '<option value="">— Select Layer —</option>' + options;
  document.getElementById('add-layer-select').innerHTML   = options;

  // Import modal dropdown
  const importSel = document.getElementById('import-layer-select');
  if (importSel) importSel.innerHTML = options;
}


// ═══════════════════════════════════════════════════
// QUICK STATS (tools panel)
// ═══════════════════════════════════════════════════
function updateStats() {
  let totalFeatures = 0;
  for (const d of Object.values(sampleData)) totalFeatures += d.features.length;

  document.getElementById('stat-layers').textContent   = Object.keys(LAYER_DEFS).length;
  document.getElementById('stat-features').textContent  = totalFeatures;
}
