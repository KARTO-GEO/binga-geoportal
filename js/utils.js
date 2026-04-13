/* ═══════════════════════════════════════════════════
   utils.js — Utility Functions
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ── Toast Notifications ──
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons  = { success: 'fa-check-circle',       error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const colors = { success: 'var(--success)',         error: 'var(--danger)',         info: 'var(--info)' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type]}" style="color:${colors[type]};font-size:1.1rem"></i>
    <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}


// ── Modal Helpers ──
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}


// ── File Download Helper ──
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


// ── Sidebar Toggle ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  // Let the map recalculate its size after the CSS transition
  setTimeout(() => map.invalidateSize(), 350);
}


// ═══════════════════════════════════════════════════
// USER-CHANGES PERSISTENCE  (localStorage delta)
// Saves only the diff vs. the base data in layers-data.js,
// so even large datasets never bloat storage.
//
// Schema stored at key 'binga_user_changes':
//   added:   { layerKey: [feature, …] }
//   edits:   { "layerKey||featureId": { …patch } }
//   deleted: { "layerKey||featureId": true }
// ═══════════════════════════════════════════════════
const PERSIST_KEY = 'binga_user_changes';

function _loadChanges() {
  try {
    return JSON.parse(localStorage.getItem(PERSIST_KEY)) || { added: {}, edits: {}, deleted: {} };
  } catch { return { added: {}, edits: {}, deleted: {} }; }
}

function _saveChanges(changes) {
  try { localStorage.setItem(PERSIST_KEY, JSON.stringify(changes)); }
  catch (e) { console.warn('[Binga] Persist failed:', e); }
}

// Called once by normalizeData() to merge saved changes into sampleData.
function applyUserChanges() {
  const changes = _loadChanges();

  // 1. Remove deleted base-data features
  for (const key of Object.keys(changes.deleted)) {
    const sep = key.indexOf('||');
    const layerKey = key.slice(0, sep);
    const featureId = key.slice(sep + 2);
    const data = sampleData[layerKey];
    if (data && Array.isArray(data.features)) {
      data.features = data.features.filter(f => String(f.properties.id) !== featureId);
    }
  }

  // 2. Apply property edits to base-data features
  for (const [key, patch] of Object.entries(changes.edits)) {
    const sep = key.indexOf('||');
    const layerKey = key.slice(0, sep);
    const featureId = key.slice(sep + 2);
    const data = sampleData[layerKey];
    if (data && Array.isArray(data.features)) {
      const feature = data.features.find(f => String(f.properties.id) === featureId);
      if (feature) Object.assign(feature.properties, patch);
    }
  }

  // 3. Re-inject user-added / imported features
  for (const [layerKey, features] of Object.entries(changes.added)) {
    if (!sampleData[layerKey]) sampleData[layerKey] = { type: 'FeatureCollection', features: [] };
    // Avoid duplicates if applyUserChanges were ever called twice
    const existingIds = new Set(sampleData[layerKey].features.map(f => String(f.properties.id)));
    for (const f of features) {
      if (!existingIds.has(String(f.properties.id))) {
        sampleData[layerKey].features.push(f);
      }
    }
  }
}

// Record a newly added/imported feature.
function persistAdd(layerKey, feature) {
  const changes = _loadChanges();
  if (!changes.added[layerKey]) changes.added[layerKey] = [];
  changes.added[layerKey].push(feature);
  _saveChanges(changes);
}

// Record a batch of imported features.
function persistAddBatch(layerKey, features) {
  const changes = _loadChanges();
  if (!changes.added[layerKey]) changes.added[layerKey] = [];
  changes.added[layerKey].push(...features);
  _saveChanges(changes);
}

// Record edited properties.  Works for both user-added and base-data features.
function persistEdit(layerKey, featureId, patch) {
  const fid = String(featureId);
  const changes = _loadChanges();

  // If the feature lives in added[], update it there
  if (changes.added[layerKey]) {
    const idx = changes.added[layerKey].findIndex(f => String(f.properties.id) === fid);
    if (idx !== -1) {
      Object.assign(changes.added[layerKey][idx].properties, patch);
      _saveChanges(changes);
      return;
    }
  }

  // Otherwise store a property patch against the base-data feature
  const key = `${layerKey}||${fid}`;
  changes.edits[key] = Object.assign(changes.edits[key] || {}, patch);
  _saveChanges(changes);
}

// Record a deletion.  Works for both user-added and base-data features.
function persistDelete(layerKey, featureId) {
  const fid = String(featureId);
  const changes = _loadChanges();

  // If the feature was user-added, remove it from added[]
  if (changes.added[layerKey]) {
    const idx = changes.added[layerKey].findIndex(f => String(f.properties.id) === fid);
    if (idx !== -1) {
      changes.added[layerKey].splice(idx, 1);
      if (!changes.added[layerKey].length) delete changes.added[layerKey];
      _saveChanges(changes);
      return;
    }
  }

  // Otherwise mark the base-data feature as deleted
  const key = `${layerKey}||${fid}`;
  changes.deleted[key] = true;
  delete changes.edits[key]; // discard any pending edit for this feature
  _saveChanges(changes);
}


// ── Tab Switching ──
function switchTab(btn, panelId) {
  document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  ['dashboard-panel', 'layers-panel', 'filter-panel', 'data-panel', 'tools-panel'].forEach(id => {
    document.getElementById(id).style.display = (id === panelId) ? 'block' : 'none';
  });
}
