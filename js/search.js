/* ═══════════════════════════════════════════════════
   search.js — Global Feature Search
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════
// GLOBAL SEARCH — searches name across ALL layers
// ═══════════════════════════════════════════════════
function globalSearch(query) {
  const q = query.toLowerCase().trim();
  const resultsEl = document.getElementById('global-search-results');

  if (!q || q.length < 2) {
    resultsEl.innerHTML = '';
    resultsEl.style.display = 'none';
    return;
  }

  const matches = [];

  for (const [key, data] of Object.entries(sampleData)) {
    if (!data || !data.features) continue;
    for (const f of data.features) {
      const p = f.properties || {};

      // Support both "name" and "Name" (capital N) from different shapefiles
      const name    = (p.name || p.Name || '').toLowerCase();
      const ward    = (p.ward || p.Ward || '').toLowerCase();
      const village = (p.village || '').toLowerCase();
      const desc    = (p.description || '').toLowerCase();

      if (name.includes(q) || ward.includes(q) || village.includes(q) || desc.includes(q)) {
        matches.push({
          id:        String(p.id || ''),
          name:      p.name || p.Name || 'Unnamed',
          ward:      p.ward || p.Ward || '',
          layerKey:  key,
          layerName: LAYER_DEFS[key] ? LAYER_DEFS[key].name : key,
          color:     LAYER_DEFS[key] ? LAYER_DEFS[key].color : '#999',
          icon:      LAYER_DEFS[key] ? LAYER_DEFS[key].icon  : 'fa-map-pin'
        });
      }
    }
  }

  if (!matches.length) {
    resultsEl.innerHTML = `<div class="gsearch-empty">No results for "${query}"</div>`;
    resultsEl.style.display = 'block';
    return;
  }

  // Limit to 15 results
  const limited = matches.slice(0, 15);
  let html = '';

  for (const m of limited) {
    html += `
      <div class="gsearch-item" onclick="searchResultClick('${m.id.replace(/'/g,"\\'")}','${m.layerKey}')">
        <div class="gsearch-icon" style="background:${m.color}">
          <i class="fas ${m.icon}"></i>
        </div>
        <div class="gsearch-info">
          <div class="gsearch-name">${highlightMatch(m.name, q)}</div>
          <div class="gsearch-meta">${m.layerName}${m.ward ? ' · ' + m.ward : ''}</div>
        </div>
      </div>`;
  }

  if (matches.length > 15) {
    html += `<div class="gsearch-more">${matches.length - 15} more results...</div>`;
  }

  resultsEl.innerHTML = html;
  resultsEl.style.display = 'block';
}

function highlightMatch(text, query) {
  if (!text) return '';
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.substring(0, idx) +
    '<mark>' + text.substring(idx, idx + query.length) + '</mark>' +
    text.substring(idx + query.length);
}

function searchResultClick(id, layerKey) {
  zoomToFeatureById(id, layerKey);
  document.getElementById('global-search-results').style.display = 'none';
  document.getElementById('global-search-input').value = '';
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
  const searchArea = document.getElementById('global-search-wrap');
  if (searchArea && !searchArea.contains(e.target)) {
    const results = document.getElementById('global-search-results');
    if (results) results.style.display = 'none';
  }
});
