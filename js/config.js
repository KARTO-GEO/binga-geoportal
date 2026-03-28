/* ═══════════════════════════════════════════════════
   config.js — Application Configuration
   Binga Geoportal
   ═══════════════════════════════════════════════════ */

// ── Placeholder Login Credentials ──
const CREDENTIALS = [
  { email: 'admin@binga.ac.zw',   password: 'Binga2024!', name: 'Admin',       role: 'Administrator' },
  { email: 'planner@binga.ac.zw', password: 'Binga2024!', name: 'Planner',     role: 'District Planner' },
  { email: 'gis@binga.ac.zw',     password: 'Binga2024!', name: 'GIS Officer', role: 'GIS Analyst' }
];

// ── Map Defaults ──
const BINGA_CENTER = [-17.62, 27.34];
const BINGA_BOUNDS = [[-18.3, 26.5], [-17.0, 28.5]];

// ── Basemap Tile Sources ──
const BASEMAPS = {
  osm:       { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                                   attr: '&copy; OpenStreetMap contributors', label: 'OpenStreetMap' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '&copy; Esri',                       label: 'Satellite' },
  topo:      { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',                                     attr: '&copy; OpenTopoMap',                label: 'Topographic' },
  dark:      { url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',                         attr: '&copy; CartoDB',                    label: 'Dark' }
};

// ── Layer Definitions ──
// Each layer: name, Font Awesome icon, hex color, geometry type, group, default visibility
const LAYER_DEFS = {
  districtBoundary: { name: 'District Boundary', icon: 'fa-border-all',  color: '#D4A843', type: 'polygon', group: 'Administrative', visible: true  },
  wardBoundaries:   { name: 'Ward Boundaries',   icon: 'fa-th-large',   color: '#7FB3D8', type: 'polygon', group: 'Administrative', visible: true  },
  villages:         { name: 'Villages',           icon: 'fa-home',       color: '#E8C96A', type: 'point',   group: 'Administrative', visible: false },
  roads:            { name: 'Roads',              icon: 'fa-road',       color: '#F39C12', type: 'line',    group: 'Infrastructure', visible: true  },
  clinics:          { name: 'Clinics',            icon: 'fa-hospital',   color: '#E74C3C', type: 'point',   group: 'Services',       visible: true  },
  hospitals:        { name: 'Hospitals',          icon: 'fa-h-square',   color: '#C0392B', type: 'point',   group: 'Services',       visible: false },
  schools:          { name: 'Schools',            icon: 'fa-school',     color: '#3498DB', type: 'point',   group: 'Services',       visible: false },
  touristSites:     { name: 'Tourist Sites',      icon: 'fa-camera',     color: '#9B59B6', type: 'point',   group: 'Tourism',        visible: true  },
  businessCentres:  { name: 'Business Centres',   icon: 'fa-store',      color: '#27AE60', type: 'point',   group: 'Commerce',       visible: false },
  serviceCentres:   { name: 'Service Centres',    icon: 'fa-building',   color: '#1ABC9C', type: 'point',   group: 'Commerce',       visible: false },
  rivers:           { name: 'Rivers',             icon: 'fa-water',      color: '#2980B9', type: 'line',    group: 'Hydrology',      visible: true  },
  dams:             { name: 'Dams',               icon: 'fa-tint',       color: '#2471A3', type: 'point',   group: 'Hydrology',      visible: true  },
  waterPoints:      { name: 'Water Points',       icon: 'fa-faucet',     color: '#5DADE2', type: 'point',   group: 'Hydrology',      visible: false },
  nationalParks:    { name: 'National Parks',     icon: 'fa-tree',       color: '#196F3D', type: 'polygon', group: 'Conservation',   visible: true  },
  conservancies:    { name: 'Conservancies',      icon: 'fa-leaf',       color: '#52BE80', type: 'polygon', group: 'Conservation',   visible: false },
  policeStations:   { name: 'Police Stations',    icon: 'fa-shield-alt', color: '#2C3E50', type: 'point',   group: 'Security',       visible: false },
  policeBases:      { name: 'Police Bases',       icon: 'fa-flag',       color: '#34495E', type: 'point',   group: 'Security',       visible: false },
  borderPosts:      { name: 'Border Posts',       icon: 'fa-passport',   color: '#8E44AD', type: 'point',   group: 'Infrastructure', visible: false },
  airstrips:        { name: 'Airstrips',          icon: 'fa-plane',      color: '#95A5A6', type: 'point',   group: 'Infrastructure', visible: false },
  miningClaims:     { name: 'Mining Claims',      icon: 'fa-gem',        color: '#D35400', type: 'point',   group: 'Resources',      visible: false },
  fishingCamps:     { name: 'Fishing Camps',      icon: 'fa-fish',       color: '#1F618D', type: 'point',   group: 'Resources',      visible: false },
  hotSprings:       { name: 'Hot Springs',        icon: 'fa-fire',       color: '#E67E22', type: 'point',   group: 'Tourism',        visible: false }
};
