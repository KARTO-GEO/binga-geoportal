/* ═══════════════════════════════════════════════════
   export.js — Data Export (CSV, KML, GeoJSON)
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ── CSV Export ──
function exportCSV() {
  const key = document.getElementById('data-layer-select').value;
  if (!key || !sampleData[key]) { showToast('Select a layer first', 'error'); return; }

  const features = sampleData[key].features;
  if (!features.length) { showToast('No features to export', 'error'); return; }

  // Build column list
  const cols = Object.keys(features[0].properties).filter(k => k !== 'layer');
  if (features[0].geometry.type === 'Point') cols.push('latitude', 'longitude');

  let csv = cols.join(',') + '\n';

  for (const f of features) {
    const row = cols.map(c => {
      if (c === 'latitude')  return f.geometry.coordinates[1];
      if (c === 'longitude') return f.geometry.coordinates[0];
      return `"${String(f.properties[c] || '').replace(/"/g, '""')}"`;
    });
    csv += row.join(',') + '\n';
  }

  downloadFile(csv, `${LAYER_DEFS[key].name.replace(/\s+/g, '_')}.csv`, 'text/csv');
  showToast('CSV exported', 'success');
}


// ── KML Export ──
function exportKML() {
  const key = document.getElementById('data-layer-select').value;
  if (!key || !sampleData[key]) { showToast('Select a layer first', 'error'); return; }

  const features = sampleData[key].features;

  let kml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  kml += `<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n`;
  kml += `<name>${LAYER_DEFS[key].name}</name>\n`;

  for (const f of features) {
    kml += `<Placemark>\n`;
    kml += `  <name>${f.properties.name || ''}</name>\n`;
    kml += `  <description>${f.properties.description || ''}</description>\n`;

    if (f.geometry.type === 'Point') {
      kml += `  <Point><coordinates>${f.geometry.coordinates[0]},${f.geometry.coordinates[1]},0</coordinates></Point>\n`;
    } else if (f.geometry.type === 'LineString') {
      const coords = f.geometry.coordinates.map(c => c.join(',') + ',0').join(' ');
      kml += `  <LineString><coordinates>${coords}</coordinates></LineString>\n`;
    } else if (f.geometry.type === 'Polygon') {
      const coords = f.geometry.coordinates[0].map(c => c.join(',') + ',0').join(' ');
      kml += `  <Polygon><outerBoundaryIs><LinearRing><coordinates>${coords}</coordinates></LinearRing></outerBoundaryIs></Polygon>\n`;
    }

    kml += `</Placemark>\n`;
  }

  kml += `</Document>\n</kml>`;

  downloadFile(kml, `${LAYER_DEFS[key].name.replace(/\s+/g, '_')}.kml`, 'application/vnd.google-earth.kml+xml');
  showToast('KML exported', 'success');
}


// ── GeoJSON Export ──
function exportGeoJSON() {
  const key = document.getElementById('data-layer-select').value;
  if (!key || !sampleData[key]) { showToast('Select a layer first', 'error'); return; }

  const json = JSON.stringify(sampleData[key], null, 2);
  downloadFile(json, `${LAYER_DEFS[key].name.replace(/\s+/g, '_')}.geojson`, 'application/json');
  showToast('GeoJSON exported', 'success');
}
