/* ═══════════════════════════════════════════════════
   tools.js — Map Tools (Measurement, Coordinates)
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// Internal flag for coordinate-capture mode
window._coordCapture = false;


// ═══════════════════════════════════════════════════
// MEASUREMENT TOOL
// ═══════════════════════════════════════════════════
function startMeasure(type) {
  showToast('Click on the map to start measuring. Double-click to finish.', 'info');

  let points  = [];
  let polyline = null;
  let polygon  = null;

  const onClick = (e) => {
    points.push(e.latlng);

    if (type === 'distance' && points.length > 1) {
      if (polyline) map.removeLayer(polyline);
      polyline = L.polyline(points, {
        color: '#D4A843', weight: 3, dashArray: '6,6'
      }).addTo(map);
    }

    if (type === 'area' && points.length > 2) {
      if (polygon) map.removeLayer(polygon);
      polygon = L.polygon(points, {
        color: '#D4A843', weight: 2,
        fillColor: '#D4A843', fillOpacity: 0.15
      }).addTo(map);
    }
  };

  const onDblClick = () => {
    map.off('click', onClick);
    map.off('dblclick', onDblClick);

    if (type === 'distance' && points.length > 1) {
      let dist = 0;
      for (let i = 1; i < points.length; i++) {
        dist += points[i - 1].distanceTo(points[i]);
      }
      showToast(`Distance: ${(dist / 1000).toFixed(2)} km`, 'success');
    }

    if (type === 'area' && points.length > 2) {
      // Approximate area using Shoelace formula
      let area = 0;
      for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].lng * points[j].lat;
        area -= points[j].lng * points[i].lat;
      }
      area = Math.abs(area / 2)
        * 111320 * 111320
        * Math.cos(points[0].lat * Math.PI / 180);
      showToast(`Area: ~${(area / 1e6).toFixed(2)} km²`, 'success');
    }

    // Auto-remove drawn shapes after 5 seconds
    setTimeout(() => {
      if (polyline) map.removeLayer(polyline);
      if (polygon)  map.removeLayer(polygon);
    }, 5000);
  };

  map.on('click', onClick);
  map.on('dblclick', onDblClick);
}


// ═══════════════════════════════════════════════════
// COORDINATE CAPTURE
// ═══════════════════════════════════════════════════
function toggleCoordCapture() {
  window._coordCapture = !window._coordCapture;
  showToast(
    window._coordCapture
      ? 'Click on map to capture coordinates'
      : 'Coordinate capture off',
    'info'
  );
}
