# 🌍 Binga Geoportal

**Binga Rural District Council — Spatial Data Infrastructure Platform**

A comprehensive, world-class geospatial web portal for managing, visualizing, and analyzing spatial data across Binga District, Matabeleland North Province, Zimbabwe.

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

---

## 📁 Project Structure (Modular)

```
binga-geoportal/
│
├── index.html                  # Main HTML shell — links all CSS/JS
│
├── css/
│   ├── styles.css              # Complete stylesheet (tokens, layout, components, dashboard)
│   └── print.css               # Print-optimized layout
│
├── js/
│   ├── config.js               # Credentials, map defaults, basemaps, layer definitions
│   ├── data.js                 # Placeholder GeoJSON datasets (all 21 layers)
│   ├── utils.js                # Toast notifications, modal helpers, sidebar, tabs
│   ├── auth.js                 # Login / logout handling
│   ├── map.js                  # Map init, basemaps, icons, popups, layer rendering
│   ├── ui.js                   # Layer panel, legend, dropdowns, stats
│   ├── filter.js               # Filter panel logic and data table
│   ├── features.js             # Add / edit / delete feature CRUD
│   ├── export.js               # CSV, KML, GeoJSON export
│   ├── tools.js                # Measurement and coordinate capture tools
│   ├── search.js               # Global search across all layers
│   ├── dashboard.js            # Analytics dashboard with charts & stats
│   ├── import.js               # Import GeoJSON, CSV, KML files
│   └── shortcuts.js            # Keyboard shortcuts & map bookmarks
│
├── Assets/
│   └── images/
│       ├── Dams/               # Dam feature images
│       ├── Clinics/            # Clinic images
│       ├── Roads/              # Road images
│       ├── TouristSites/       # Tourist site images
│       ├── BusinessCentres/    # Business centre images
│       ├── ServiceCentres/     # Service centre images
│       ├── Rivers/             # River images
│       ├── WaterPoints/        # Water point images
│       ├── NationalParks/      # National park images
│       ├── Conservancies/      # Conservancy images
│       ├── PoliceStations/     # Police station images
│       ├── PoliceBases/        # Police base images
│       ├── Villages/           # Village images
│       ├── Wards/              # Ward images
│       ├── District/           # District images
│       ├── Hospitals/          # Hospital images
│       ├── Schools/            # School images
│       ├── BorderPosts/        # Border post images
│       ├── Airstrips/          # Airstrip images
│       ├── MiningClaims/       # Mining claim images
│       ├── FishingCamps/       # Fishing camp images
│       └── HotSprings/        # Hot spring images
│
└── README.md                   # This file
```

### File Responsibilities

| File | Purpose | Lines |
|------|---------|-------|
| `index.html` | HTML structure, modals, loading screen, script loading | ~340 |
| `css/styles.css` | All styling — tokens, layout, components, dashboard, responsive | ~1,450 |
| `css/print.css` | Print-optimized layout for map output | ~90 |
| `js/config.js` | Credentials, map constants, basemap URLs, 21 layer definitions | ~50 |
| `js/data.js` | All placeholder GeoJSON datasets with helper factories | ~340 |
| `js/map.js` | Leaflet init, basemaps, custom icons, popups, layer rendering | ~270 |
| `js/ui.js` | Layer panel builder, legend, dropdown population, stats | ~100 |
| `js/filter.js` | Filter panel and data table builder | ~125 |
| `js/features.js` | Add, edit, delete feature CRUD with map/UI sync | ~140 |
| `js/export.js` | CSV, KML, GeoJSON export | ~80 |
| `js/tools.js` | Distance & area measurement, coordinate capture | ~90 |
| `js/search.js` | Global search across all layers with highlighted results | ~95 |
| `js/dashboard.js` | Analytics dashboard — bar charts, ward stats, layer counts | ~185 |
| `js/import.js` | Import GeoJSON, CSV, KML files into any layer | ~265 |
| `js/shortcuts.js` | Keyboard shortcuts and map bookmark system | ~135 |
| `js/utils.js` | Toasts, modals, file download, sidebar, tabs | ~70 |
| `js/auth.js` | Login/logout + Enter key handler | ~40 |

---

## 🚀 Deployment

### Option A: GitHub Pages (Recommended — Free)

#### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign up (free)
2. Click **"New Repository"** (green button)
3. Repository name: `binga-geoportal`
4. Set visibility to **Public**
5. Click **"Create repository"**

#### Step 2: Upload the Project
1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop the entire project contents:
   - `index.html`
   - `css/` folder
   - `js/` folder
   - `Assets/` folder
   - `README.md`
3. Click **"Commit changes"**

#### Step 3: Enable GitHub Pages
1. Go to repository **Settings** → **Pages** (left sidebar)
2. Under **"Source"**, select **"Deploy from a branch"**
3. Under **"Branch"**, select **`main`** and **`/ (root)`**
4. Click **Save**
5. Wait 1–2 minutes

#### Step 4: Access Your Portal
Your portal will be live at:
```
https://<your-username>.github.io/binga-geoportal/
```

---

### Option B: Netlify (Free)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the `binga-geoportal` folder into the upload zone
4. Instant deployment with a random URL
5. Set a custom domain under **Domain settings** (optional)

---

### Option C: Vercel (Free)

1. Go to [vercel.com](https://vercel.com) — sign up with GitHub
2. Click **"New Project"** → import your `binga-geoportal` repo
3. Framework preset: **Other**
4. Click **Deploy**

---

### Option D: Cloudflare Pages (Free)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Build settings: leave blank (static site)
4. Deploy — available at `binga-geoportal.pages.dev`

---

## 🔐 Login Credentials (Demo)

| Email | Password | Role |
|-------|----------|------|
| `admin@binga.ac.zw` | `Binga2024!` | Administrator |
| `planner@binga.ac.zw` | `Binga2024!` | District Planner |
| `gis@binga.ac.zw` | `Binga2024!` | GIS Officer |

> ⚠️ These are placeholder credentials. For production, integrate a proper authentication backend (Firebase Auth, Auth0, or custom API).

---

## 🖼️ Adding Feature Images

1. Take or source photos for each feature
2. Name the file to match the feature name with underscores:
   - Feature: `Nakaluba Dam` → File: `Nakaluba_Dam.jpg`
3. Place in the corresponding folder: `Assets/images/Dams/Nakaluba_Dam.jpg`
4. The popup automatically displays the image when clicking a feature

---

## 🔧 Customization Guide

### Replacing Placeholder Data with Real Data

Edit `js/data.js` and update coordinates:

```javascript
sampleData.clinics = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.6234, 27.3412, 'Binga Clinic', 'Ward 4', 'Binga Centre', 'Description', 'Clinics'),
    // ... add real surveyed points
  ]
};
```

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

## 🛣️ Roadmap

- [ ] Backend API with PostgreSQL/PostGIS
- [ ] User registration and role-based access control
- [ ] Mobile GPS data collection app
- [ ] Spatial analysis (buffer, intersect, proximity)
- [ ] Dashboard with charts and analytics
- [ ] Print-to-PDF map export
- [ ] Integration with Zimbabwe national SDI
- [ ] Offline map tile caching
- [ ] Data versioning and audit trail

---

## 📞 Support

**Binga Rural District Council**
- 📍 Binga Centre, Matabeleland North, Zimbabwe
- 📧 gis@binga.ac.zw

---

© 2024 Binga Rural District Council. All rights reserved.
