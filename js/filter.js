/* ═══════════════════════════════════════════════════
   filter.js — Filter & Data Table
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════
// FILTER PANEL
// ═══════════════════════════════════════════════════

// Populate attribute dropdown when a layer is selected
function updateFilterFields() {
  const key = document.getElementById('filter-layer').value;
  const sel = document.getElementById('filter-attr');
  sel.innerHTML = '<option value="">— Select Attribute —</option>';

  if (!key || !sampleData[key] || !sampleData[key].features.length) return;

  const props = sampleData[key].features[0].properties;
  for (const p of Object.keys(props)) {
    if (p !== 'id' && p !== 'layer') {
      sel.innerHTML += `<option value="${p}">${p}</option>`;
    }
  }
}

// Run the filter and display results
function applyFilter() {
  const layerKey = document.getElementById('filter-layer').value;
  const attr     = document.getElementById('filter-attr').value;
  const val      = document.getElementById('filter-value').value.toLowerCase();

  if (!layerKey || !attr) {
    showToast('Please select a layer and attribute', 'error');
    return;
  }

  const data = sampleData[layerKey];
  if (!data) return;

  const results = data.features.filter(f =>
    String(f.properties[attr]).toLowerCase().includes(val)
  );

  // Build results table
  let html = `<p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.5rem;">
    ${results.length} feature(s) found</p>`;

  if (results.length) {
    html += `<div class="feature-table-wrap"><table class="feature-table">
      <thead><tr><th>Name</th><th>Ward</th><th></th></tr></thead><tbody>`;
    for (const f of results) {
      const displayName = f.properties.name || f.properties.Name || '—';
      const displayWard = f.properties.ward || f.properties.Ward || '—';
      html += `<tr>
        <td>${displayName}</td>
        <td>${displayWard}</td>
        <td><button class="tbl-btn" onclick="zoomToFeatureById('${String(f.properties.id).replace(/'/g,"\\'")}','${layerKey}')">
          <i class="fas fa-crosshairs"></i></button></td>
      </tr>`;
    }
    html += '</tbody></table></div>';
  }

  document.getElementById('filter-results').innerHTML = html;

  // Ensure layer is visible
  if (!map.hasLayer(layerGroups[layerKey])) layerGroups[layerKey].addTo(map);

  // Zoom to single result
  if (results.length === 1) {
    const f = results[0];
    if (f.geometry.type === 'Point') {
      map.setView([f.geometry.coordinates[1], f.geometry.coordinates[0]], 13);
    } else {
      const layer = findLeafletLayer(f.properties.id, layerKey);
      if (layer) map.fitBounds(layer.getBounds());
    }
  }

  showToast(`Found ${results.length} matching feature(s)`, 'success');
}

// Reset filter
function clearFilter() {
  document.getElementById('filter-layer').value = '';
  document.getElementById('filter-attr').innerHTML = '<option value="">— Select Attribute —</option>';
  document.getElementById('filter-value').value = '';
  document.getElementById('filter-results').innerHTML = '';
}


// ═══════════════════════════════════════════════════
// DATA TABLE (sidebar → Data tab)
// ═══════════════════════════════════════════════════
function showDataTable() {
  const key       = document.getElementById('data-layer-select').value;
  const container = document.getElementById('data-table-container');

  if (!key || !sampleData[key]) {
    container.innerHTML = '';
    return;
  }

  const features = sampleData[key].features;
  const cols = features.length
    ? Object.keys(features[0].properties).filter(k => k !== 'id' && k !== 'layer' && k !== 'imgURL')
    : [];

  let html = `<div class="feature-table-wrap"><table class="feature-table"><thead><tr>`;
  cols.forEach(c => html += `<th>${c}</th>`);
  html += `<th>Actions</th></tr></thead><tbody>`;

  for (const f of features) {
    html += '<tr>';
    cols.forEach(c => html += `<td>${f.properties[c] || '—'}</td>`);
    html += `<td class="actions-cell">
      <button class="tbl-btn" onclick="zoomToFeatureById('${f.properties.id}','${key}')" title="Zoom">
        <i class="fas fa-crosshairs"></i></button>
      <button class="tbl-btn" onclick="editFeatureById('${f.properties.id}','${key}')" title="Edit">
        <i class="fas fa-edit"></i></button>
      <button class="tbl-btn del" onclick="deleteFeatureById('${f.properties.id}','${key}')" title="Delete">
        <i class="fas fa-trash"></i></button>
    </td></tr>`;
  }

  html += '</tbody></table></div>';
  container.innerHTML = html;
}
