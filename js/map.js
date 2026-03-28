/* ═══════════════════════════════════════════════════
   map.js — Map Initialization & Layer Rendering
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ── Global State ──
let map, currentBasemap;
let basemapIndex = 0;
const layerGroups = {};

// NOTE: sampleData is declared and populated in js/layers-data.js
// which loads before this file. No fetch() needed — works on file://


// ═══════════════════════════════════════════════════
// DATA NORMALISATION
// Runs once after layers-data.js is loaded.
// Fixes: null IDs, Name vs name casing, null geometry.
// ═══════════════════════════════════════════════════
function normalizeData() {
  let counter = 1;

  for (const [layerKey, data] of Object.entries(sampleData)) {
    if (!data || !Array.isArray(data.features)) continue;

    // Filter out features with null geometry so Leaflet never chokes
    data.features = data.features.filter(f => f && f.geometry);

    for (const f of data.features) {
      if (!f.properties) f.properties = {};
      const p = f.properties;

      // ── Ensure every feature has a unique string ID ──
      if (!p.id || p.id === null || p.id === 'null') {
        p.id = layerKey + '_' + (counter++);
      } else {
        p.id = String(p.id);   // guarantee string type for === comparisons
      }

      // ── Normalise "Name" → "name" ──
      // Some shapefiles export the column as "Name" (capital N).
      // If we have a capital-N Name but no lowercase name, copy it down.
      if (!p.name && p.Name) {
        p.name = p.Name;
      }

      // ── Normalise "Ward" → "ward" ──
      if (!p.ward && p.Ward) {
        p.ward = p.Ward;
      }

      // ── Tag the layer key so popups can reference it ──
      if (!p.layer) p.layer = layerKey;
    }
  }
}


// ═══════════════════════════════════════════════════
// MAP SETUP
// ═══════════════════════════════════════════════════
function initMap() {
  if (map) return;

  map = L.map('map', {
    zoomControl: false,
    attributionControl: true
  }).setView(BINGA_CENTER, 9);

  L.control.zoom({ position: 'topright' }).addTo(map);
  L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);

  currentBasemap = L.tileLayer(BASEMAPS.osm.url, {
    attribution: BASEMAPS.osm.attr,
    maxZoom: 19
  }).addTo(map);

  map.on('mousemove', e => {
    document.getElementById('coord-display').textContent =
      `Lat: ${e.latlng.lat.toFixed(4)} | Lng: ${e.latlng.lng.toFixed(4)}`;
  });

  map.on('click', e => {
    if (window._coordCapture) {
      showToast(`Captured: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`, 'info');
      window._coordCapture = false;
    }
  });

  // Normalise real GeoJSON data before rendering
  normalizeData();
  loadAllLayers();

  // Post-render enhancements
  setupZoomStyling();
  injectSvgPatterns();
  applyConservancyPattern();

  buildLayerPanel();
  buildLegend();
  populateDropdowns();
  updateStats();
  buildDashboard();
  renderBookmarks();
}


// ═══════════════════════════════════════════════════
// BASEMAP CONTROL
// ═══════════════════════════════════════════════════
function setBasemap(key) {
  if (currentBasemap) map.removeLayer(currentBasemap);
  currentBasemap = L.tileLayer(BASEMAPS[key].url, {
    attribution: BASEMAPS[key].attr,
    maxZoom: 19
  }).addTo(map);
  currentBasemap.bringToBack();
  showToast('Basemap: ' + BASEMAPS[key].label, 'info');
}

function cycleBasemap() {
  const keys = Object.keys(BASEMAPS);
  basemapIndex = (basemapIndex + 1) % keys.length;
  setBasemap(keys[basemapIndex]);
}

function zoomToDistrict() {
  map.fitBounds(BINGA_BOUNDS);
}


// ═══════════════════════════════════════════════════
// ZOOM-BASED ICON & LABEL SIZING
// Injects CSS classes onto #map based on zoom level.
// Icons and labels scale purely in CSS — no layer rebuild.
// ═══════════════════════════════════════════════════
function setupZoomStyling() {
  const style = document.createElement('style');
  style.id = 'zoom-style';
  style.textContent = `
    /* ── Icon sizes by zoom tier ── */
    #map.zoom-xs  .custom-marker > div { width:16px!important;height:16px!important;font-size:7px!important; }
    #map.zoom-sm  .custom-marker > div { width:20px!important;height:20px!important;font-size:9px!important; }
    #map.zoom-md  .custom-marker > div { width:24px!important;height:24px!important;font-size:10px!important; }
    #map.zoom-lg  .custom-marker > div { width:28px!important;height:28px!important;font-size:11px!important; }
    #map.zoom-xl  .custom-marker > div { width:32px!important;height:32px!important;font-size:13px!important; }

    /* ── Feature labels ── */
    .feature-label {
      background: rgba(255,255,255,0.88);
      border: none !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.18);
      color: #1a1a1a;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 10px;
      letter-spacing: 0.01em;
      padding: 2px 5px;
      border-radius: 3px;
      white-space: nowrap;
      pointer-events: none;
    }
    .feature-label::before { display:none; }

    /* District labels always visible; ward labels only zoom ≥ 11 */
    .district-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: rgba(212,168,67,0.15);
      color: #7a5500;
      border: 1px solid rgba(212,168,67,0.4) !important;
    }
    .park-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(0,90,50,0.10);
      color: #005a32;
      border: 1px solid rgba(0,90,50,0.3) !important;
    }
    .conservancy-label {
      font-size: 10px;
      font-weight: 600;
      background: rgba(82,190,128,0.12);
      color: #1a6636;
      border: 1px solid rgba(82,190,128,0.4) !important;
    }
    .ward-label { font-size: 9px; font-weight: 500; color: #2c5f8a; background: rgba(127,179,216,0.12); border: 1px solid rgba(127,179,216,0.35) !important; }

    /* Point labels — hide at low zoom */
    #map.zoom-xs .point-label,
    #map.zoom-sm .point-label,
    #map.zoom-md .point-label { display: none !important; }
    #map.zoom-xs .ward-label  { display: none !important; }
    #map.zoom-sm .ward-label  { display: none !important; }
    #map.zoom-md .ward-label  { display: none !important; }
  `;
  document.head.appendChild(style);

  const applyZoomClass = () => {
    const z = map.getZoom();
    const el = document.getElementById('map');
    el.classList.remove('zoom-xs','zoom-sm','zoom-md','zoom-lg','zoom-xl');
    if      (z <= 7)  el.classList.add('zoom-xs');
    else if (z <= 9)  el.classList.add('zoom-sm');
    else if (z <= 11) el.classList.add('zoom-md');
    else if (z <= 13) el.classList.add('zoom-lg');
    else              el.classList.add('zoom-xl');
  };

  map.on('zoomend', applyZoomClass);
  applyZoomClass(); // run once on init
}


// ═══════════════════════════════════════════════════
// SVG PATTERN INJECTION (conservancy diagonal stripes)
// ═══════════════════════════════════════════════════
function injectSvgPatterns() {
  // Leaflet creates its SVG overlay on first layer add — safe to call after loadAllLayers
  let svgEl = document.querySelector('.leaflet-overlay-pane svg');
  if (!svgEl) {
    // Fallback: create a hidden SVG at body level that Leaflet can reference
    svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    document.body.appendChild(svgEl);
  }

  let defs = svgEl.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgEl.insertBefore(defs, svgEl.firstChild);
  }

  if (!defs.querySelector('#conservancyStripe')) {
    defs.innerHTML += `
      <pattern id="conservancyStripe" x="0" y="0" width="10" height="10"
               patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
        <rect width="5" height="10" fill="#52BE80" opacity="0.40"/>
        <rect x="5" width="5" height="10" fill="#FFFFFF" opacity="0.10"/>
      </pattern>`;
  }
}

function applyConservancyPattern() {
  if (!layerGroups.conservancies) return;
  layerGroups.conservancies.eachLayer(l => {
    if (l._path) l._path.setAttribute('fill', 'url(#conservancyStripe)');
    // Handle sub-layers inside a LayerGroup (MultiPolygon splits into sub-layers)
    if (l.eachLayer) l.eachLayer(sl => { if (sl._path) sl._path.setAttribute('fill', 'url(#conservancyStripe)'); });
  });
}


// ═══════════════════════════════════════════════════
// CUSTOM MAP ICONS  (base size 24px — CSS scales it)
// ═══════════════════════════════════════════════════
function createIcon(color, iconClass) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background:${color};width:24px;height:24px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2px solid rgba(255,255,255,0.92);
      box-shadow:0 1px 5px rgba(0,0,0,0.35);
      transition:width .15s,height .15s;">
      <i class="fas ${iconClass}" style="color:#fff;font-size:10px;pointer-events:none"></i>
    </div>`,
    iconSize:    [24, 24],
    iconAnchor:  [12, 12],
    popupAnchor: [0, -15]
  });
}


// ═══════════════════════════════════════════════════
// POPUP BUILDER
// ═══════════════════════════════════════════════════
function buildPopup(props, layerKey) {
  const def = LAYER_DEFS[layerKey];
  const isAdmin = ['districtBoundary', 'wardBoundaries', 'villages'].includes(layerKey);

  // Resolve display name — handle "Name" (capital N) from some shapefiles
  const displayName = props.name || props.Name || 'Unnamed';
  const safeId = String(props.id || '').replace(/'/g, "\\'");

  let imgHtml = `<div class="popup-img"><i class="fas ${def.icon}"></i></div>`;
  if (props.imgURL) {
    imgHtml = `<div class="popup-img">
      <img src="${props.imgURL}"
           onerror="this.parentElement.innerHTML='<i class=\\'fas ${def.icon}\\' style=\\'font-size:2rem;color:var(--text-muted)\\'></i>'">
    </div>`;
  }

  let metaHtml = '';
  if (props.ward)    metaHtml += `<div class="popup-meta-row"><i class="fas fa-map-marker-alt"></i><span><strong>Ward:</strong> ${props.ward}</span></div>`;
  if (props.village) metaHtml += `<div class="popup-meta-row"><i class="fas fa-home"></i><span><strong>Village:</strong> ${props.village}</span></div>`;
  if (props.description && !['districtBoundary','wardBoundaries'].includes(layerKey)) {
    metaHtml += `<div class="popup-meta-row"><i class="fas fa-info-circle"></i><span>${props.description}</span></div>`;
  }

  if (isAdmin && props.totalPopulation) {
    metaHtml += `<div class="popup-meta-row"><i class="fas fa-users"></i><span><strong>Population:</strong> ${Number(props.totalPopulation).toLocaleString()}</span></div>`;
    metaHtml += `<div class="popup-meta-row"><i class="fas fa-female"></i><span><strong>Female:</strong> ${Number(props.female).toLocaleString()}</span></div>`;
    metaHtml += `<div class="popup-meta-row"><i class="fas fa-male"></i><span><strong>Male:</strong> ${Number(props.male).toLocaleString()}</span></div>`;
    metaHtml += `<div class="popup-meta-row"><i class="fas fa-house-user"></i><span><strong>Households:</strong> ${Number(props.households).toLocaleString()}</span></div>`;
    metaHtml += `<div class="popup-meta-row"><i class="fas fa-ruler-combined"></i><span><strong>HH Size:</strong> ${props.hhSize}</span></div>`;
  }

  return `
    <div class="popup-card">
      ${imgHtml}
      <div class="popup-body">
        <div class="popup-type">${def.name}</div>
        <h4>${displayName}</h4>
        <div class="popup-meta">${metaHtml}</div>
        <div class="popup-actions">
          <button class="btn btn-sm btn-outline" onclick="editFeatureById('${safeId}','${layerKey}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn btn-sm btn-outline" style="border-color:var(--danger);color:var(--danger)" onclick="deleteFeatureById('${safeId}','${layerKey}')"><i class="fas fa-trash"></i></button>
          <button class="btn btn-sm btn-outline" onclick="zoomToFeatureById('${safeId}','${layerKey}')"><i class="fas fa-search-plus"></i></button>
        </div>
      </div>
    </div>`;
}


// ═══════════════════════════════════════════════════
// ROAD SYMBOLOGY  (keyed on feature.properties.description)
// ═══════════════════════════════════════════════════
const ROAD_STYLES = {
  //  type          color       weight  opacity  dashArray          lineCap
  National:     { color: '#4A2B0F', weight: 6,  opacity: 1.00, dashArray: '14,5',  lineCap: 'round'  },
  tertiary:     { color: '#5C3317', weight: 4,  opacity: 0.90, dashArray: '',       lineCap: 'round'  },
  service:      { color: '#7B4B2A', weight: 2.5,opacity: 0.85, dashArray: '',       lineCap: 'round'  },
  unclassified: { color: '#9E9E9E', weight: 1.8,opacity: 0.75, dashArray: '',       lineCap: 'square' },
  residential:  { color: '#E6C619', weight: 2,  opacity: 0.85, dashArray: '',       lineCap: 'round'  },
  track:        { color: '#C8B89A', weight: 1.2,opacity: 0.60, dashArray: '4,6',    lineCap: 'round'  }
};

function getRoadStyle(feature) {
  const type = (feature.properties && feature.properties.description) || 'unclassified';
  const s = ROAD_STYLES[type] || ROAD_STYLES.unclassified;
  return {
    color:     s.color,
    weight:    s.weight,
    opacity:   s.opacity,
    dashArray: s.dashArray,
    lineCap:   s.lineCap
  };
}

// National roads get a second "casing" pass — a white dashed overlay on top
// so the dark-brown road shows white dashes as requested.
function addNationalCasing(data, map) {
  const nationalFeatures = {
    type: 'FeatureCollection',
    features: data.features.filter(
      f => (f.properties && f.properties.description) === 'National'
    )
  };
  if (!nationalFeatures.features.length) return null;

  return L.geoJSON(nationalFeatures, {
    style: {
      color:     '#FFFFFF',
      weight:    2.5,
      opacity:   0.85,
      dashArray: '10,7',
      lineCap:   'round'
    }
  });
}


// ═══════════════════════════════════════════════════
// LABEL HELPERS
// ═══════════════════════════════════════════════════
function getFeatureLabel(props) {
  return props.name || props.Name || '';
}

function bindFeatureLabel(layer, props, cssClass) {
  const lbl = getFeatureLabel(props);
  if (!lbl) return;
  layer.bindTooltip(lbl, {
    permanent:   true,
    direction:   'center',
    className:   `feature-label ${cssClass}`,
    interactive: false
  });
}

function bindPointLabel(layer, props) {
  const lbl = getFeatureLabel(props);
  if (!lbl) return;
  layer.bindTooltip(lbl, {
    permanent:   true,
    direction:   'top',
    offset:      [0, -14],
    className:   'feature-label point-label',
    interactive: false
  });
}


// ═══════════════════════════════════════════════════
// SHARED LAYER RENDERER
// ═══════════════════════════════════════════════════
function renderLayerGroup(key, data) {
  const def = LAYER_DEFS[key];

  // ── Roads: unique symbology per road type ──
  if (key === 'roads') {
    const baseLayer = L.geoJSON(data, {
      style:         getRoadStyle,
      onEachFeature: (f, layer) => layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 })
    });
    const group = L.layerGroup([baseLayer]);
    group._nationalCasing = addNationalCasing(data);
    if (group._nationalCasing) group.addLayer(group._nationalCasing);
    return group;
  }

  // ── District Boundary: thick amber outline, NO fill, permanent label ──
  if (key === 'districtBoundary') {
    return L.geoJSON(data, {
      style: {
        color:       '#D4A843',
        weight:      5,
        opacity:     1,
        fill:        false,
        dashArray:   '10,5'
      },
      onEachFeature: (f, layer) => {
        layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 });
        bindFeatureLabel(layer, f.properties, 'district-label');
      }
    });
  }

  // ── Ward Boundaries: thin blue outline, NO fill, label at zoom ≥ 11 ──
  if (key === 'wardBoundaries') {
    return L.geoJSON(data, {
      style: {
        color:   '#7FB3D8',
        weight:  1.8,
        opacity: 0.75,
        fill:    false
      },
      onEachFeature: (f, layer) => {
        layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 });
        bindFeatureLabel(layer, f.properties, 'ward-label');
      }
    });
  }

  // ── National Parks: IUCN standard dark green (#005A32), 35% fill ──
  if (key === 'nationalParks') {
    return L.geoJSON(data, {
      style: {
        color:       '#005A32',
        weight:      2.2,
        opacity:     0.9,
        fillColor:   '#005A32',
        fillOpacity: 0.28
      },
      onEachFeature: (f, layer) => {
        layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 });
        bindFeatureLabel(layer, f.properties, 'park-label');
      }
    });
  }

  // ── Conservancies: medium green outline, stripe fill applied post-render ──
  if (key === 'conservancies') {
    return L.geoJSON(data, {
      style: {
        color:       '#1a8a4a',
        weight:      2,
        opacity:     0.85,
        fillColor:   '#52BE80',   // overridden to stripe URL after render
        fillOpacity: 0.5
      },
      onEachFeature: (f, layer) => {
        layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 });
        bindFeatureLabel(layer, f.properties, 'conservancy-label');
      }
    });
  }

  // ── Generic point layers ──
  if (def.type === 'point') {
    return L.geoJSON(data, {
      pointToLayer:  (f, ll) => L.marker(ll, { icon: createIcon(def.color, def.icon) }),
      onEachFeature: (f, layer) => {
        layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 });
        bindPointLabel(layer, f.properties);
      }
    });
  }

  // ── Generic line layers ──
  if (def.type === 'line') {
    return L.geoJSON(data, {
      style:         { color: def.color, weight: 3, opacity: 0.85 },
      onEachFeature: (f, layer) => layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 })
    });
  }

  // ── Generic polygon layers ──
  return L.geoJSON(data, {
    style: {
      color:       def.color,
      weight:      2,
      fillColor:   def.color,
      fillOpacity: 0.12
    },
    onEachFeature: (f, layer) => {
      layer.bindPopup(buildPopup(f.properties, key), { maxWidth: 320 });
      bindFeatureLabel(layer, f.properties, 'feature-label');
    }
  });
}


// ═══════════════════════════════════════════════════
// LOAD ALL LAYERS  (synchronous — data already in memory)
// ═══════════════════════════════════════════════════
function loadAllLayers() {
  for (const [key, def] of Object.entries(LAYER_DEFS)) {
    const data = sampleData[key];

    if (data && data.features && data.features.length > 0) {
      layerGroups[key] = renderLayerGroup(key, data);
    } else {
      // Ensure sampleData always has a valid entry
      sampleData[key] = { type: 'FeatureCollection', features: [] };
      layerGroups[key] = L.layerGroup();
    }

    if (def.visible) layerGroups[key].addTo(map);
  }
}


// ═══════════════════════════════════════════════════
// REBUILD A SINGLE LAYER  (called after CRUD edits)
// ═══════════════════════════════════════════════════
function rebuildLayer(layerKey) {
  const wasVisible = map.hasLayer(layerGroups[layerKey]);
  if (wasVisible) map.removeLayer(layerGroups[layerKey]);

  const data = sampleData[layerKey];
  if (!data || !data.features) return;

  layerGroups[layerKey] = renderLayerGroup(layerKey, data);
  if (wasVisible) layerGroups[layerKey].addTo(map);

  // Re-apply the SVG stripe pattern after conservancies rebuild
  if (layerKey === 'conservancies') {
    injectSvgPatterns();
    applyConservancyPattern();
  }
}


// ═══════════════════════════════════════════════════
// LAYER TOGGLE  (called from UI)
// ═══════════════════════════════════════════════════
function toggleLayer(key, toggleEl) {
  if (map.hasLayer(layerGroups[key])) {
    map.removeLayer(layerGroups[key]);
    toggleEl.classList.remove('on');
  } else {
    layerGroups[key].addTo(map);
    toggleEl.classList.add('on');
  }
}


// ═══════════════════════════════════════════════════
// FIND A LEAFLET LAYER BY FEATURE ID
// ═══════════════════════════════════════════════════
function findLeafletLayer(id, layerKey) {
  let found = null;
  const sid = String(id);
  layerGroups[layerKey].eachLayer(l => {
    if (l.feature && String(l.feature.properties.id) === sid) found = l;
  });
  return found;
}


// ═══════════════════════════════════════════════════
// ZOOM TO A SPECIFIC FEATURE
// ═══════════════════════════════════════════════════
function zoomToFeatureById(id, layerKey) {
  const data = sampleData[layerKey];
  if (!data) return;
  const sid = String(id);
  const feature = data.features.find(f => String(f.properties.id) === sid);
  if (!feature) return;

  if (!map.hasLayer(layerGroups[layerKey])) layerGroups[layerKey].addTo(map);

  if (feature.geometry.type === 'Point') {
    map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 14);
  } else {
    const layer = findLeafletLayer(id, layerKey);
    if (layer && layer.getBounds) map.fitBounds(layer.getBounds());
  }

  layerGroups[layerKey].eachLayer(l => {
    if (l.feature && String(l.feature.properties.id) === sid) l.openPopup();
  });
}
