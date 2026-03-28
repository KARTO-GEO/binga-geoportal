/* ═══════════════════════════════════════════════════
   features.js — Feature CRUD Operations
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

let editingFeatureId = null;


// ═══════════════════════════════════════════════════
// ADD FEATURE
// ═══════════════════════════════════════════════════
function openAddFeatureModal() {
  const key = document.getElementById('data-layer-select').value || Object.keys(LAYER_DEFS)[0];
  document.getElementById('add-layer-select').value = key;
  openModal('add-feature-modal');
}

function addFeature() {
  const layerKey = document.getElementById('add-layer-select').value;
  const lat      = parseFloat(document.getElementById('add-lat').value);
  const lng      = parseFloat(document.getElementById('add-lng').value);
  const name     = document.getElementById('add-name').value.trim();
  const ward     = document.getElementById('add-ward').value.trim();
  const village  = document.getElementById('add-village').value.trim();
  const desc     = document.getElementById('add-desc').value.trim();
  const img      = document.getElementById('add-img').value.trim();

  if (!name || isNaN(lat) || isNaN(lng)) {
    showToast('Name, Latitude and Longitude are required', 'error');
    return;
  }

  const def = LAYER_DEFS[layerKey];

  const feature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      ward,
      village,
      description: desc,
      imgURL: img || `Assets/images/${layerKey}/${name.replace(/\s+/g, '_')}.jpg`,
      layer: layerKey
    }
  };

  // Ensure dataset exists
  if (!sampleData[layerKey]) {
    sampleData[layerKey] = { type: 'FeatureCollection', features: [] };
  }
  sampleData[layerKey].features.push(feature);

  // Add marker to the Leaflet layer group
  const marker = L.marker([lat, lng], { icon: createIcon(def.color, def.icon) });
  marker.bindPopup(buildPopup(feature.properties, layerKey), { maxWidth: 320 });
  marker.feature = feature;
  layerGroups[layerKey].addLayer(marker);

  // Ensure layer is visible and zoom
  if (!map.hasLayer(layerGroups[layerKey])) layerGroups[layerKey].addTo(map);
  map.setView([lat, lng], 13);

  // Cleanup
  closeModal('add-feature-modal');
  ['add-name', 'add-ward', 'add-village', 'add-desc', 'add-img', 'add-lat', 'add-lng']
    .forEach(id => document.getElementById(id).value = '');

  showDataTable();
  buildLayerPanel();
  updateStats();
  showToast(`Feature "${name}" added to ${def.name}`, 'success');
}


// ═══════════════════════════════════════════════════
// DELETE FEATURE
// ═══════════════════════════════════════════════════
function deleteFeatureById(id, layerKey) {
  if (!confirm('Delete this feature? This action cannot be undone.')) return;

  const data = sampleData[layerKey];
  if (!data) return;

  const sid = String(id);
  data.features = data.features.filter(f => String(f.properties.id) !== sid);

  rebuildLayer(layerKey);
  showDataTable();
  buildLayerPanel();
  updateStats();
  showToast('Feature deleted', 'info');
}


// ═══════════════════════════════════════════════════
// EDIT FEATURE
// ═══════════════════════════════════════════════════
function editFeatureById(id, layerKey) {
  const data = sampleData[layerKey];
  if (!data) return;

  const sid = String(id);
  const feature = data.features.find(f => String(f.properties.id) === sid);
  if (!feature) return;

  editingFeatureId = sid;

  const body         = document.getElementById('edit-modal-body');
  const props        = feature.properties;
  const editableKeys = Object.keys(props).filter(k => k !== 'id' && k !== 'layer');

  let html = '';
  for (const k of editableKeys) {
    html += `<div class="form-group">
      <label>${k}</label>
      <input class="filter-input" id="edit-${k}" value="${props[k] || ''}">
    </div>`;
  }
  html += `<input type="hidden" id="edit-layer-key" value="${layerKey}">`;

  body.innerHTML = html;
  openModal('edit-feature-modal');
}

function saveEditFeature() {
  const layerKey = document.getElementById('edit-layer-key').value;
  const data     = sampleData[layerKey];
  const feature  = data.features.find(f => String(f.properties.id) === String(editingFeatureId));
  if (!feature) return;

  const editableKeys = Object.keys(feature.properties).filter(k => k !== 'id' && k !== 'layer');
  for (const k of editableKeys) {
    const el = document.getElementById('edit-' + k);
    if (el) feature.properties[k] = el.value;
  }

  rebuildLayer(layerKey);
  closeModal('edit-feature-modal');
  showDataTable();
  showToast('Feature updated', 'success');
}
