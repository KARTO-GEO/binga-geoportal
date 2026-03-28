/* ═══════════════════════════════════════════════════
   dashboard.js — Analytics Dashboard
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════
// BUILD DASHBOARD PANEL
// ═══════════════════════════════════════════════════
function buildDashboard() {
  const panel = document.getElementById('dashboard-panel');
  if (!panel) return;

  // Gather stats
  let totalFeatures = 0;
  const layerCounts = {};
  const groupCounts = {};

  for (const [key, def] of Object.entries(LAYER_DEFS)) {
    const count = sampleData[key] ? sampleData[key].features.length : 0;
    totalFeatures += count;
    layerCounts[def.name] = count;
    if (!groupCounts[def.group]) groupCounts[def.group] = 0;
    groupCounts[def.group] += count;
  }

  // Ward population data
  const wardPops = [];
  if (sampleData.wardBoundaries) {
    for (const f of sampleData.wardBoundaries.features) {
      wardPops.push({
        name: f.properties.name.replace('Ward ', 'W').replace(' - ', ': '),
        pop: f.properties.totalPopulation || 0,
        female: f.properties.female || 0,
        male: f.properties.male || 0,
        hh: f.properties.households || 0
      });
    }
  }

  let html = '';

  // ── Summary Cards ──
  html += `
  <div class="dash-cards">
    <div class="dash-card">
      <div class="dash-card-icon" style="background:var(--primary)"><i class="fas fa-users"></i></div>
      <div class="dash-card-info">
        <div class="dash-card-val">159,982</div>
        <div class="dash-card-label">Total Population</div>
      </div>
    </div>
    <div class="dash-card">
      <div class="dash-card-icon" style="background:var(--accent)"><i class="fas fa-layer-group"></i></div>
      <div class="dash-card-info">
        <div class="dash-card-val">${Object.keys(LAYER_DEFS).length}</div>
        <div class="dash-card-label">Data Layers</div>
      </div>
    </div>
    <div class="dash-card">
      <div class="dash-card-icon" style="background:var(--info)"><i class="fas fa-map-pin"></i></div>
      <div class="dash-card-info">
        <div class="dash-card-val">${totalFeatures}</div>
        <div class="dash-card-label">Total Features</div>
      </div>
    </div>
    <div class="dash-card">
      <div class="dash-card-icon" style="background:var(--success)"><i class="fas fa-home"></i></div>
      <div class="dash-card-info">
        <div class="dash-card-val">39,495</div>
        <div class="dash-card-label">Households</div>
      </div>
    </div>
  </div>`;

  // ── Features by Category (horizontal bar chart) ──
  const maxGroupCount = Math.max(...Object.values(groupCounts), 1);
  html += `
  <div class="dash-section">
    <div class="dash-section-title"><i class="fas fa-chart-bar"></i> Features by Category</div>
    <div class="dash-bars">`;

  const groupColors = {
    'Administrative': '#D4A843', 'Infrastructure': '#F39C12', 'Services': '#E74C3C',
    'Tourism': '#9B59B6', 'Commerce': '#27AE60', 'Hydrology': '#2980B9',
    'Conservation': '#196F3D', 'Security': '#2C3E50', 'Resources': '#D35400'
  };

  for (const [group, count] of Object.entries(groupCounts).sort((a, b) => b[1] - a[1])) {
    const pct = (count / maxGroupCount * 100).toFixed(0);
    const color = groupColors[group] || 'var(--accent)';
    html += `
      <div class="dash-bar-row">
        <span class="dash-bar-label">${group}</span>
        <div class="dash-bar-track">
          <div class="dash-bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="dash-bar-val">${count}</span>
      </div>`;
  }
  html += `</div></div>`;

  // ── Ward Population Table ──
  if (wardPops.length) {
    const maxPop = Math.max(...wardPops.map(w => w.pop), 1);
    html += `
    <div class="dash-section">
      <div class="dash-section-title"><i class="fas fa-chart-line"></i> Ward Population Overview</div>
      <div class="dash-ward-chart">`;

    for (const w of wardPops.sort((a, b) => b.pop - a.pop)) {
      const pct = (w.pop / maxPop * 100).toFixed(0);
      const fPct = ((w.female / w.pop) * 100).toFixed(0);
      html += `
        <div class="dash-ward-row">
          <span class="dash-ward-name">${w.name}</span>
          <div class="dash-ward-bar-wrap">
            <div class="dash-ward-bar" style="width:${pct}%">
              <div class="dash-ward-bar-female" style="width:${fPct}%" title="Female: ${w.female.toLocaleString()}"></div>
            </div>
          </div>
          <span class="dash-ward-pop">${w.pop.toLocaleString()}</span>
        </div>`;
    }

    html += `
      </div>
      <div class="dash-legend-mini">
        <span><i class="fas fa-square" style="color:var(--accent);font-size:0.6rem"></i> Female</span>
        <span><i class="fas fa-square" style="color:var(--primary-light);font-size:0.6rem"></i> Male</span>
      </div>
    </div>`;
  }

  // ── Layer Feature Counts ──
  html += `
  <div class="dash-section">
    <div class="dash-section-title"><i class="fas fa-database"></i> Features per Layer</div>
    <div class="dash-layer-grid">`;

  for (const [key, def] of Object.entries(LAYER_DEFS)) {
    const count = sampleData[key] ? sampleData[key].features.length : 0;
    html += `
      <div class="dash-layer-chip" onclick="quickLayerZoom('${key}')">
        <i class="fas ${def.icon}" style="color:${def.color}"></i>
        <span>${def.name}</span>
        <strong>${count}</strong>
      </div>`;
  }

  html += `</div></div>`;

  // ── District Quick Facts ──
  html += `
  <div class="dash-section">
    <div class="dash-section-title"><i class="fas fa-info-circle"></i> District Quick Facts</div>
    <div class="dash-facts">
      <div class="dash-fact"><i class="fas fa-map"></i> <span>Area: <strong>13,000 km²</strong></span></div>
      <div class="dash-fact"><i class="fas fa-crown"></i> <span>Chiefs: <strong>17</strong></span></div>
      <div class="dash-fact"><i class="fas fa-th-large"></i> <span>Wards: <strong>25</strong></span></div>
      <div class="dash-fact"><i class="fas fa-mountain"></i> <span>Elevation: <strong>411–1,200m</strong></span></div>
      <div class="dash-fact"><i class="fas fa-thermometer-half"></i> <span>Temp: <strong>25–40°C</strong></span></div>
      <div class="dash-fact"><i class="fas fa-cloud-rain"></i> <span>Rainfall: <strong>400–600mm/yr</strong></span></div>
      <div class="dash-fact"><i class="fas fa-road"></i> <span>Tarred Roads: <strong>30%</strong></span></div>
      <div class="dash-fact"><i class="fas fa-toilet"></i> <span>Sanitation Access: <strong>15%</strong></span></div>
    </div>
  </div>`;

  panel.innerHTML = html;
}

// Quick zoom to all features in a layer
function quickLayerZoom(layerKey) {
  if (!layerGroups[layerKey]) return;
  if (!map.hasLayer(layerGroups[layerKey])) layerGroups[layerKey].addTo(map);

  const bounds = layerGroups[layerKey].getBounds();
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }

  // Toggle the layer on in the layer panel
  const toggleEl = document.querySelector(`.layer-item[data-layer="${layerKey}"] .layer-toggle`);
  if (toggleEl && !toggleEl.classList.contains('on')) toggleEl.classList.add('on');

  showToast(`Zoomed to ${LAYER_DEFS[layerKey].name}`, 'info');
}
