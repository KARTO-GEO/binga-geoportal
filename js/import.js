/* ═══════════════════════════════════════════════════
   import.js — Data Import (GeoJSON, CSV, KML)
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════
// OPEN IMPORT MODAL
// ═══════════════════════════════════════════════════
function openImportModal() {
  openModal('import-modal');
}

// ═══════════════════════════════════════════════════
// HANDLE FILE IMPORT
// ═══════════════════════════════════════════════════
function handleImportFile() {
  const fileInput = document.getElementById('import-file');
  const layerKey  = document.getElementById('import-layer-select').value;

  if (!fileInput.files.length) {
    showToast('Please select a file to import', 'error');
    return;
  }

  if (!layerKey) {
    showToast('Please select a target layer', 'error');
    return;
  }

  const file   = fileInput.files[0];
  const ext    = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;

    try {
      let importedFeatures = [];

      if (ext === 'geojson' || ext === 'json') {
        importedFeatures = parseGeoJSON(content, layerKey);
      } else if (ext === 'csv') {
        importedFeatures = parseCSV(content, layerKey);
      } else if (ext === 'kml') {
        importedFeatures = parseKML(content, layerKey);
      } else {
        showToast('Unsupported file format. Use .geojson, .csv, or .kml', 'error');
        return;
      }

      if (!importedFeatures.length) {
        showToast('No valid features found in file', 'error');
        return;
      }

      // Add to dataset and persist
      if (!sampleData[layerKey]) {
        sampleData[layerKey] = { type: 'FeatureCollection', features: [] };
      }
      sampleData[layerKey].features.push(...importedFeatures);
      persistAddBatch(layerKey, importedFeatures);

      // Rebuild map layer
      rebuildLayer(layerKey);
      if (!map.hasLayer(layerGroups[layerKey])) layerGroups[layerKey].addTo(map);

      // Zoom to imported features
      const bounds = layerGroups[layerKey].getBounds();
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });

      // Refresh UI
      buildLayerPanel();
      showDataTable();
      updateStats();

      closeModal('import-modal');
      fileInput.value = '';
      showToast(`Imported ${importedFeatures.length} feature(s) into ${LAYER_DEFS[layerKey].name}`, 'success');

    } catch (err) {
      console.error('Import error:', err);
      showToast('Error parsing file: ' + err.message, 'error');
    }
  };

  reader.readAsText(file);
}


// ═══════════════════════════════════════════════════
// PARSERS
// ═══════════════════════════════════════════════════

// ── Parse GeoJSON ──
function parseGeoJSON(content, layerKey) {
  const geojson = JSON.parse(content);
  const features = geojson.type === 'FeatureCollection'
    ? geojson.features
    : geojson.type === 'Feature'
      ? [geojson]
      : [];

  return features.map(f => ({
    type: 'Feature',
    geometry: f.geometry,
    properties: {
      id: Math.random().toString(36).substr(2, 9),
      name:        f.properties.name || f.properties.Name || f.properties.NAME || 'Imported Feature',
      ward:        f.properties.ward || f.properties.Ward || '',
      village:     f.properties.village || f.properties.Village || '',
      description: f.properties.description || f.properties.Description || '',
      imgURL:      f.properties.imgURL || '',
      layer:       layerKey
    }
  }));
}


// ── Parse CSV ──
// Expects columns: name, latitude/lat, longitude/lng/lon, ward, village, description
function parseCSV(content, layerKey) {
  const lines  = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const features = [];

  // Find lat/lng column indices
  const latIdx = headers.findIndex(h => ['latitude', 'lat', 'y'].includes(h));
  const lngIdx = headers.findIndex(h => ['longitude', 'lng', 'lon', 'long', 'x'].includes(h));

  if (latIdx === -1 || lngIdx === -1) {
    showToast('CSV must contain latitude and longitude columns', 'error');
    return [];
  }

  const nameIdx  = headers.findIndex(h => ['name', 'feature_name', 'title'].includes(h));
  const wardIdx  = headers.findIndex(h => ['ward'].includes(h));
  const villIdx  = headers.findIndex(h => ['village'].includes(h));
  const descIdx  = headers.findIndex(h => ['description', 'desc', 'notes'].includes(h));

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    const lat  = parseFloat(cols[latIdx]);
    const lng  = parseFloat(cols[lngIdx]);

    if (isNaN(lat) || isNaN(lng)) continue;

    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: {
        id:          Math.random().toString(36).substr(2, 9),
        name:        (nameIdx >= 0 ? cols[nameIdx] : `Feature ${i}`) || `Feature ${i}`,
        ward:        wardIdx >= 0 ? cols[wardIdx] : '',
        village:     villIdx >= 0 ? cols[villIdx] : '',
        description: descIdx >= 0 ? cols[descIdx] : '',
        imgURL:      '',
        layer:       layerKey
      }
    });
  }

  return features;
}

// Simple CSV row parser (handles quoted fields)
function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}


// ── Parse KML ──
function parseKML(content, layerKey) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(content, 'text/xml');
  const placemarks = doc.querySelectorAll('Placemark');
  const features = [];

  placemarks.forEach(pm => {
    const nameEl  = pm.querySelector('name');
    const descEl  = pm.querySelector('description');
    const pointEl = pm.querySelector('Point coordinates');

    if (pointEl) {
      const coords = pointEl.textContent.trim().split(',');
      const lng = parseFloat(coords[0]);
      const lat = parseFloat(coords[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: {
            id:          Math.random().toString(36).substr(2, 9),
            name:        nameEl ? nameEl.textContent.trim() : 'KML Feature',
            ward:        '',
            village:     '',
            description: descEl ? descEl.textContent.trim() : '',
            imgURL:      '',
            layer:       layerKey
          }
        });
      }
    }

    // Handle LineString
    const lineEl = pm.querySelector('LineString coordinates');
    if (lineEl) {
      const coordPairs = lineEl.textContent.trim().split(/\s+/);
      const lineCoords = coordPairs.map(p => {
        const [lng, lat] = p.split(',').map(Number);
        return [lng, lat];
      }).filter(c => !isNaN(c[0]) && !isNaN(c[1]));

      if (lineCoords.length > 1) {
        features.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: lineCoords },
          properties: {
            id:          Math.random().toString(36).substr(2, 9),
            name:        nameEl ? nameEl.textContent.trim() : 'KML Line',
            ward:        '',
            village:     '',
            description: descEl ? descEl.textContent.trim() : '',
            imgURL:      '',
            layer:       layerKey
          }
        });
      }
    }

    // Handle Polygon (outer ring only; holes are discarded)
    const polyEl = pm.querySelector('Polygon outerBoundaryIs LinearRing coordinates');
    if (polyEl) {
      const coordPairs = polyEl.textContent.trim().split(/\s+/);
      const ringCoords = coordPairs.map(p => {
        const [lng, lat] = p.split(',').map(Number);
        return [lng, lat];
      }).filter(c => !isNaN(c[0]) && !isNaN(c[1]));

      if (ringCoords.length > 3) {
        features.push({
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [ringCoords] },
          properties: {
            id:          Math.random().toString(36).substr(2, 9),
            name:        nameEl ? nameEl.textContent.trim() : 'KML Polygon',
            ward:        '',
            village:     '',
            description: descEl ? descEl.textContent.trim() : '',
            imgURL:      '',
            layer:       layerKey
          }
        });
      }
    }
  });

  return features;
}


// ═══════════════════════════════════════════════════
// UPDATE IMPORT FILE LABEL
// ═══════════════════════════════════════════════════
function updateImportLabel() {
  const fileInput = document.getElementById('import-file');
  const label     = document.getElementById('import-file-label');
  if (fileInput.files.length) {
    label.textContent = fileInput.files[0].name;
    label.style.color = 'var(--accent)';
  } else {
    label.textContent = 'Choose file...';
    label.style.color = 'var(--text-muted)';
  }
}
