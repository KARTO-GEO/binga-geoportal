# 🌍 Binga Geoportal

**Binga Rural District Council — Spatial Data Infrastructure Platform**

A comprehensive geospatial web portal for managing, visualizing, and analyzing spatial data across Binga District, Matabeleland North Province, Zimbabwe.

![Version](https://img.shields.io/badge/Version-1.0-green) ![License](https://img.shields.io/badge/License-BRDC-blue) ![Status](https://img.shields.io/badge/Status-Production-brightgreen)

---

## ✨ Features

### 🗺️ Interactive Map
- **21 data layers** across 8 categories (Administrative, Infrastructure, Services, Commerce, Hydrology, Conservation, Security, Tourism/Resources)
- **4 basemaps**: OpenStreetMap, Satellite (Esri), Topographic, Dark (CartoDB)
- Professional popups with images, metadata, and action buttons
- Real-time coordinate display and scale bar
- Interactive map legend with symbology (toggleable)

### 📊 Data Management
- **View** all feature attributes in sortable data tables
- **Add** new features to any point layer via form with lat/lng input
- **Edit** existing feature attributes inline
- **Delete** features with confirmation
- **Filter** features by layer, attribute, and value

### 📤 Export & Import
- **Export**: CSV, KML, GeoJSON with one-click download
- **Import**: GeoJSON, CSV (with lat/lng columns), KML file upload into any layer

### 📈 Analytics Dashboard
- Summary cards (population, layers, features, households)
- Features-by-category horizontal bar chart
- Ward population comparison chart (male/female breakdown)
- Clickable layer feature chips — zoom to any layer
- District quick facts panel

### 🔧 Map Tools
- **Distance measurement** — click polyline distances (km)
- **Area measurement** — polygon area calculation (km²)
- **Coordinate capture** — click anywhere to get lat/lng
- **Map bookmarks** — save and restore map views (localStorage)

### 🔍 Global Search
- Search across all layers by name, ward, village, or description
- Live results dropdown with highlighted matches
- Click any result to zoom and open popup

### ⌨️ Keyboard Shortcuts
- `F` — Focus search, `B` — Toggle sidebar, `H` — Home extent
- `M` — Cycle basemap, `L` — Toggle legend, `?` — Show shortcuts
- `Esc` — Close modals

### 🔒 Authentication
- Institutional login with `@binga.ac.zw` email domain
- 3 role-based placeholder accounts
- Animated loading screen on startup

### 🖨️ Print Layout
- Print-optimized CSS — hides UI chrome, shows map and legend





### Adding a New Layer

1. Add to `LAYER_DEFS` in `js/config.js`:
```javascript
newLayer: { name: 'New Layer', icon: 'fa-icon', color: '#hex', type: 'point', group: 'Group', visible: false }
```

2. Add data in `js/data.js`:
```javascript
sampleData.newLayer = { type: 'FeatureCollection', features: [ ... ] };
```

3. Create image folder: `Assets/images/NewLayer/`

### Changing the Theme

Edit CSS variables in `css/styles.css`:
```css
:root {
  --primary: #1B5E3B;      /* Main green */
  --accent: #D4A843;        /* Gold accent */
  --bg-dark: #0A1F14;       /* Background */
  /* ... */
}
```

---

## 📋 Requirements

- **Browser**: Chrome, Firefox, Edge, or Safari (modern versions)
- **Internet**: Required for basemap tiles and CDN libraries
- **Server**: Any static file host (no backend required)

### CDN Dependencies (auto-loaded)
- Leaflet.js 1.9.4 — map rendering
- Leaflet Draw 1.0.4 — drawing tools
- Font Awesome 6.5.1 — icons
- Google Fonts — DM Sans + Playfair Display

---

l District Council. All rights reserved.
