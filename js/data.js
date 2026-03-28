/* ═══════════════════════════════════════════════════
   data.js — Placeholder GeoJSON Datasets
   Binga Geoportal
   
   Replace coordinates and attributes with real
   surveyed data for production use.
   ═══════════════════════════════════════════════════ */

// ── Helper Factories ──
function makePt(lat, lng, name, ward, village, desc, layer) {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      ward,
      village,
      description: desc,
      imgURL: `Assets/images/${layer}/${name.replace(/\s+/g, '_')}.jpg`,
      layer
    }
  };
}

function makeLine(coords, name, ward, village, desc, layer) {
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: coords },
    properties: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      ward,
      village,
      description: desc,
      imgURL: '',
      layer
    }
  };
}

function makePoly(coords, name, props, layer) {
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
    properties: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      layer,
      ...props
    }
  };
}


// ═══════════════════════════════════════════════════
// DATASETS — keyed to match LAYER_DEFS
// ═══════════════════════════════════════════════════
const sampleData = {};


/* ── District Boundary ── */
sampleData.districtBoundary = {
  type: 'FeatureCollection',
  features: [
    makePoly(
      [[26.7,-17.1],[27.0,-17.05],[27.5,-17.1],[28.0,-17.2],[28.3,-17.5],[28.2,-17.9],[28.0,-18.1],[27.6,-18.2],[27.2,-18.15],[26.8,-17.9],[26.65,-17.5],[26.7,-17.1]],
      'Binga District',
      { ward:'All', village:'All', description:'Binga District boundary covering 13,000 sq km in Matabeleland North Province',
        totalPopulation:159982, female:83191, male:76791, households:39495, hhSize:4.1 },
      'districtBoundary'
    )
  ]
};


/* ── Ward Boundaries ── */
const wardData = [
  { name:'Ward 1 - Siabuwa',      coords:[[27.0,-17.2],[27.3,-17.2],[27.3,-17.4],[27.0,-17.4],[27.0,-17.2]], pop:6400,  f:3328, m:3072, hh:1580, hs:4.1 },
  { name:'Ward 2 - Sinamagonde',   coords:[[27.3,-17.2],[27.6,-17.2],[27.6,-17.4],[27.3,-17.4],[27.3,-17.2]], pop:5800,  f:3016, m:2784, hh:1432, hs:4.1 },
  { name:'Ward 3 - Kariangwe',     coords:[[27.0,-17.4],[27.3,-17.4],[27.3,-17.6],[27.0,-17.6],[27.0,-17.4]], pop:7200,  f:3744, m:3456, hh:1778, hs:4.0 },
  { name:'Ward 4 - Binga Centre',  coords:[[27.3,-17.4],[27.6,-17.4],[27.6,-17.6],[27.3,-17.6],[27.3,-17.4]], pop:12500, f:6500, m:6000, hh:3086, hs:4.1 },
  { name:'Ward 5 - Manjolo',       coords:[[27.6,-17.2],[27.9,-17.2],[27.9,-17.4],[27.6,-17.4],[27.6,-17.2]], pop:5400,  f:2808, m:2592, hh:1333, hs:4.0 },
  { name:'Ward 6 - Pashu',         coords:[[27.6,-17.4],[27.9,-17.4],[27.9,-17.6],[27.6,-17.6],[27.6,-17.4]], pop:6100,  f:3172, m:2928, hh:1506, hs:4.0 },
  { name:'Ward 7 - Simatelele',    coords:[[27.0,-17.6],[27.3,-17.6],[27.3,-17.8],[27.0,-17.8],[27.0,-17.6]], pop:4900,  f:2548, m:2352, hh:1210, hs:4.1 },
  { name:'Ward 8 - Mlibizi',       coords:[[27.3,-17.6],[27.6,-17.6],[27.6,-17.8],[27.3,-17.8],[27.3,-17.6]], pop:8200,  f:4264, m:3936, hh:2025, hs:4.0 },
];

sampleData.wardBoundaries = {
  type: 'FeatureCollection',
  features: wardData.map(w =>
    makePoly(w.coords, w.name, {
      ward: w.name, village: 'Multiple',
      description: `Administrative ward boundary — ${w.name}`,
      totalPopulation: w.pop, female: w.f, male: w.m,
      households: w.hh, hhSize: w.hs
    }, 'wardBoundaries')
  )
};


/* ── Villages ── */
sampleData.villages = {
  type: 'FeatureCollection',
  features: [
    { ...makePt(-17.32,27.15,'Siabuwa Village','Ward 1 - Siabuwa','Siabuwa','Administrative village in Ward 1','villages'),
      properties:{ ...makePt(-17.32,27.15,'Siabuwa Village','Ward 1','Siabuwa','','villages').properties,
        totalPopulation:1200, female:624, male:576, households:296, hhSize:4.1 }},
    { ...makePt(-17.45,27.45,'Sinamagonde Village','Ward 2 - Sinamagonde','Sinamagonde','Central village of Ward 2','villages'),
      properties:{ ...makePt(-17.45,27.45,'Sinamagonde Village','Ward 2','Sinamagonde','','villages').properties,
        totalPopulation:980, female:510, male:470, households:242, hhSize:4.0 }},
    { ...makePt(-17.55,27.35,'Binga Centre Village','Ward 4 - Binga Centre','Binga Centre','District headquarters village','villages'),
      properties:{ ...makePt(-17.55,27.35,'Binga Centre Village','Ward 4','Binga Centre','','villages').properties,
        totalPopulation:3200, female:1664, male:1536, households:790, hhSize:4.1 }},
    { ...makePt(-17.7,27.2,'Simatelele Village','Ward 7 - Simatelele','Simatelele','Lakeside village with tourism potential','villages'),
      properties:{ ...makePt(-17.7,27.2,'Simatelele Village','Ward 7','Simatelele','','villages').properties,
        totalPopulation:850, female:442, male:408, households:210, hhSize:4.0 }},
    { ...makePt(-17.65,27.55,'Mlibizi Village','Ward 8 - Mlibizi','Mlibizi','Major fishing and transport hub','villages'),
      properties:{ ...makePt(-17.65,27.55,'Mlibizi Village','Ward 8','Mlibizi','','villages').properties,
        totalPopulation:2800, female:1456, male:1344, households:691, hhSize:4.1 }},
  ]
};


/* ── Clinics ── */
sampleData.clinics = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.62, 27.34, 'Binga District Hospital Clinic', 'Ward 4 - Binga Centre', 'Binga Centre', 'Primary health clinic at Binga Centre',        'Clinics'),
    makePt(-17.35, 27.18, 'Siabuwa Clinic',                 'Ward 1 - Siabuwa',      'Siabuwa',      'Rural health clinic serving Ward 1',            'Clinics'),
    makePt(-17.48, 27.52, 'Sinamagonde Clinic',              'Ward 2 - Sinamagonde',  'Sinamagonde',  'Community clinic with maternity ward',          'Clinics'),
    makePt(-17.72, 27.22, 'Simatelele Clinic',               'Ward 7 - Simatelele',   'Simatelele',   'Remote clinic near Lake Kariba',                'Clinics'),
    makePt(-17.68, 27.58, 'Mlibizi Clinic',                  'Ward 8 - Mlibizi',      'Mlibizi',      'Clinic serving fishing communities',            'Clinics'),
    makePt(-17.40, 27.75, 'Pashu Clinic',                    'Ward 6 - Pashu',        'Pashu',        'Rural health outpost',                         'Clinics'),
    makePt(-17.55, 27.10, 'Kariangwe Clinic',                'Ward 3 - Kariangwe',    'Kariangwe',    'Community health centre',                      'Clinics'),
  ]
};


/* ── Hospitals ── */
sampleData.hospitals = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.62, 27.35, 'Binga District Hospital',   'Ward 4 - Binga Centre', 'Binga Centre', 'Main district hospital with 120 beds',         'Hospitals'),
    makePt(-17.65, 27.56, 'Mlibizi Hospital',           'Ward 8 - Mlibizi',      'Mlibizi',      'Secondary hospital serving southern wards',     'Hospitals'),
    makePt(-17.33, 27.20, 'Siabuwa Mission Hospital',   'Ward 1 - Siabuwa',      'Siabuwa',      'Mission hospital serving northern wards',       'Hospitals'),
  ]
};


/* ── Schools ── */
sampleData.schools = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.61, 27.33, 'Binga Primary School',      'Ward 4 - Binga Centre', 'Binga Centre', 'Largest primary school in the district',  'Schools'),
    makePt(-17.63, 27.36, 'Binga Secondary School',    'Ward 4 - Binga Centre', 'Binga Centre', 'Government secondary school',             'Schools'),
    makePt(-17.34, 27.17, 'Siabuwa Primary School',    'Ward 1 - Siabuwa',      'Siabuwa',      'Rural primary school',                    'Schools'),
    makePt(-17.70, 27.20, 'Simatelele Primary School',  'Ward 7 - Simatelele',   'Simatelele',   'Primary school near the lake',            'Schools'),
    makePt(-17.67, 27.57, 'Mlibizi Secondary School',   'Ward 8 - Mlibizi',      'Mlibizi',      'Secondary school with science labs',       'Schools'),
  ]
};


/* ── Tourist Sites ── */
sampleData.touristSites = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.62, 27.38, 'Binga Crocodile Farm',         'Ward 4 - Binga Centre', 'Binga Centre', 'Popular tourist attraction with guided tours',     'TouristSites'),
    makePt(-17.78, 27.45, 'Lake Kariba Viewpoint',        'Ward 8 - Mlibizi',      'Mlibizi',      'Stunning panoramic views of Lake Kariba',          'TouristSites'),
    makePt(-17.55, 27.80, 'Chizarira National Park Gate', 'Ward 6 - Pashu',        'Pashu',        'Main entrance to Chizarira National Park',         'TouristSites'),
    makePt(-17.30, 27.25, 'Zambezi Gorge Viewpoint',      'Ward 1 - Siabuwa',      'Siabuwa',      'Scenic gorge along the Zambezi River',             'TouristSites'),
    makePt(-17.45, 27.30, 'Binga Hot Springs',            'Ward 3 - Kariangwe',    'Kariangwe',    'Natural hot springs with therapeutic waters',       'TouristSites'),
    makePt(-17.72, 27.18, 'Sinamwenda Cultural Village',  'Ward 7 - Simatelele',   'Simatelele',   'Traditional Tonga cultural experience',             'TouristSites'),
  ]
};


/* ── Business Centres ── */
sampleData.businessCentres = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.62, 27.33, 'Binga Business Centre',   'Ward 4 - Binga Centre', 'Binga Centre', 'Main commercial hub of Binga District', 'BusinessCentres'),
    makePt(-17.66, 27.55, 'Mlibizi Business Centre',  'Ward 8 - Mlibizi',      'Mlibizi',      'Trading centre near the harbour',       'BusinessCentres'),
    makePt(-17.33, 27.19, 'Siabuwa Business Centre',  'Ward 1 - Siabuwa',      'Siabuwa',      'Rural trading centre',                  'BusinessCentres'),
    makePt(-17.42, 27.50, 'Manjolo Business Centre',   'Ward 5 - Manjolo',      'Manjolo',      'Growing commercial centre',             'BusinessCentres'),
  ]
};


/* ── Service Centres ── */
sampleData.serviceCentres = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.61, 27.34, 'Binga Service Centre',  'Ward 4 - Binga Centre', 'Binga Centre', 'District administrative service centre', 'ServiceCentres'),
    makePt(-17.67, 27.54, 'Mlibizi Service Centre', 'Ward 8 - Mlibizi',      'Mlibizi',      'Government services hub',               'ServiceCentres'),
  ]
};


/* ── Roads ── */
sampleData.roads = {
  type: 'FeatureCollection',
  features: [
    makeLine([[27.0,-17.62],[27.15,-17.60],[27.34,-17.62],[27.55,-17.63],[27.8,-17.65]],  'Dete-Binga Road',    'Multiple', 'Multiple', 'Major arterial road connecting Dete to Binga',          'Roads'),
    makeLine([[27.34,-17.62],[27.40,-17.45],[27.50,-17.30],[27.60,-17.15]],                'Karoi-Binga Road',   'Multiple', 'Multiple', 'Key route connecting Binga to Karoi and Harare',        'Roads'),
    makeLine([[27.34,-17.62],[27.34,-17.70],[27.35,-17.78]],                               'Binga-Mlibizi Road', 'Ward 4/8', 'Multiple', 'Road connecting Binga Centre to Mlibizi Harbour',       'Roads'),
    makeLine([[27.34,-17.62],[27.20,-17.55],[27.10,-17.45],[27.00,-17.35]],                'Binga-Siabuwa Road', 'Multiple', 'Multiple', 'Northern road to Siabuwa area',                         'Roads'),
    makeLine([[27.55,-17.63],[27.65,-17.55],[27.75,-17.50]],                               'Pashu Road',         'Ward 6',   'Pashu',    'Access road to Pashu ward',                             'Roads'),
  ]
};


/* ── Rivers ── */
sampleData.rivers = {
  type: 'FeatureCollection',
  features: [
    makeLine([[27.5,-17.05],[27.45,-17.15],[27.40,-17.25],[27.38,-17.35],[27.35,-17.50],[27.34,-17.65],[27.35,-17.80]], 'Mlibizi River',  'Multiple', 'Multiple', 'Major river flowing into Lake Kariba',  'Rivers'),
    makeLine([[26.7,-17.10],[26.75,-17.30],[26.80,-17.50],[26.85,-17.70],[26.90,-17.90]],                               'Gwayi River',    'Multiple', 'Multiple', 'Western boundary river of Binga District','Rivers'),
    makeLine([[28.2,-17.20],[28.15,-17.40],[28.10,-17.60],[28.05,-17.80],[28.0,-18.0]],                                 'Sengwa River',   'Multiple', 'Multiple', 'Eastern boundary river',                'Rivers'),
    makeLine([[27.2,-17.30],[27.25,-17.45],[27.30,-17.55]],                                                              'Sebungwe River', 'Multiple', 'Multiple', 'Tributary flowing into Lake Kariba',     'Rivers'),
    makeLine([[27.6,-17.25],[27.55,-17.40],[27.50,-17.55]],                                                              'Masumu River',   'Multiple', 'Multiple', 'Perennial river in eastern Binga',       'Rivers'),
  ]
};


/* ── Dams ── */
sampleData.dams = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.50, 27.25, 'Nakaluba Dam',    'Ward 3 - Kariangwe',  'Kariangwe',  'Small earth dam for livestock and irrigation',    'Dams'),
    makePt(-17.38, 27.40, 'Manjolo Dam',     'Ward 5 - Manjolo',    'Manjolo',    'Community dam supplying water to Manjolo',        'Dams'),
    makePt(-17.58, 27.15, 'Kariangwe Dam',   'Ward 3 - Kariangwe',  'Kariangwe',  'Irrigation dam with siltation challenges',        'Dams'),
    makePt(-17.72, 27.30, 'Simatelele Dam',  'Ward 7 - Simatelele', 'Simatelele', 'Dam near Lake Kariba shore',                      'Dams'),
  ]
};


/* ── Water Points ── */
sampleData.waterPoints = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.60, 27.32, 'Binga Centre Borehole 1', 'Ward 4 - Binga Centre',  'Binga Centre', 'Deep borehole with hand pump',    'WaterPoints'),
    makePt(-17.35, 27.16, 'Siabuwa Borehole',        'Ward 1 - Siabuwa',       'Siabuwa',      'Solar-powered borehole',          'WaterPoints'),
    makePt(-17.45, 27.48, 'Sinamagonde Well',         'Ward 2 - Sinamagonde',   'Sinamagonde',  'Protected community well',        'WaterPoints'),
    makePt(-17.68, 27.20, 'Simatelele Borehole',      'Ward 7 - Simatelele',    'Simatelele',   'Bush pump borehole',              'WaterPoints'),
    makePt(-17.64, 27.53, 'Mlibizi Borehole',         'Ward 8 - Mlibizi',       'Mlibizi',      'Piped water supply point',        'WaterPoints'),
  ]
};


/* ── National Parks ── */
sampleData.nationalParks = {
  type: 'FeatureCollection',
  features: [
    makePoly(
      [[27.5,-17.4],[28.0,-17.4],[28.0,-17.8],[27.5,-17.8],[27.5,-17.4]],
      'Chizarira National Park',
      { ward:'Multiple', village:'N/A',
        description:'One of Zimbabwe\'s most remote and rugged national parks covering 2,000 sq km. Home to elephants, buffalo, leopard, and the rare Taita falcon.' },
      'nationalParks'
    )
  ]
};


/* ── Conservancies ── */
sampleData.conservancies = {
  type: 'FeatureCollection',
  features: [
    makePoly([[27.0,-17.2],[27.3,-17.2],[27.3,-17.4],[27.0,-17.4],[27.0,-17.2]], 'Mucheni Conservancy', { ward:'Ward 1', village:'Multiple', description:'Community conservancy with consumptive wildlife concessions' }, 'conservancies'),
    makePoly([[27.6,-17.5],[27.9,-17.5],[27.9,-17.7],[27.6,-17.7],[27.6,-17.5]], 'Sijaria Conservancy', { ward:'Ward 6', village:'Multiple', description:'Conservation area with safari operations' },                'conservancies'),
  ]
};


/* ── Police Stations ── */
sampleData.policeStations = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.62, 27.33, 'Binga Police Station',  'Ward 4 - Binga Centre', 'Binga Centre', 'Main district police station',             'PoliceStations'),
    makePt(-17.66, 27.55, 'Mlibizi Police Station', 'Ward 8 - Mlibizi',      'Mlibizi',      'Police station serving southern wards',     'PoliceStations'),
  ]
};


/* ── Police Bases ── */
sampleData.policeBases = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.34, 27.18, 'Siabuwa Police Base',   'Ward 1 - Siabuwa', 'Siabuwa', 'Rural police outpost',                     'PoliceBases'),
    makePt(-17.55, 27.78, 'Chizarira Police Base',  'Ward 6 - Pashu',   'Pashu',   'Anti-poaching base near Chizarira',        'PoliceBases'),
  ]
};


/* ── Border Posts ── */
sampleData.borderPosts = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.60, 27.37, 'Kasambabezi Border Post', 'Ward 4 - Binga Centre', 'Binga Centre', 'Formal border post on the Zambezi River, 3km NE of Binga Centre', 'BorderPosts'),
  ]
};


/* ── Airstrips ── */
sampleData.airstrips = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.61, 27.31, 'Binga Airstrip',  'Ward 4 - Binga Centre', 'Binga Centre', 'Recently refurbished public airstrip',  'Airstrips'),
    makePt(-17.70, 27.55, 'Mlibizi Airstrip', 'Ward 8 - Mlibizi',      'Mlibizi',      'Private airstrip near the harbour',     'Airstrips'),
  ]
};


/* ── Mining Claims ── */
sampleData.miningClaims = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.50, 27.60, 'Binga Graphite Mine',       'Ward 5 - Manjolo',    'Manjolo',    'Active graphite mining claim',   'MiningClaims'),
    makePt(-17.55, 27.70, 'Kariangwe Lithium Prospect', 'Ward 3 - Kariangwe',  'Kariangwe',  'Lithium exploration claim',      'MiningClaims'),
    makePt(-17.45, 27.80, 'Pashu Coal Deposit',         'Ward 6 - Pashu',      'Pashu',      'Coal mining claim',             'MiningClaims'),
  ]
};


/* ── Fishing Camps ── */
sampleData.fishingCamps = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.75, 27.40, 'Mlibizi Fishing Camp',     'Ward 8 - Mlibizi',      'Mlibizi',      'Major fishing camp on Lake Kariba',      'FishingCamps'),
    makePt(-17.70, 27.25, 'Sinamwenda Fishing Camp',   'Ward 7 - Simatelele',   'Simatelele',   'Traditional fishing community',          'FishingCamps'),
    makePt(-17.60, 27.42, 'Binga Harbour Camp',        'Ward 4 - Binga Centre', 'Binga Centre', 'Fishing camp near Binga harbour',        'FishingCamps'),
  ]
};


/* ── Hot Springs ── */
sampleData.hotSprings = {
  type: 'FeatureCollection',
  features: [
    makePt(-17.45, 27.30, 'Binga Hot Springs', 'Ward 3 - Kariangwe', 'Kariangwe', 'Natural geothermal hot springs with therapeutic properties', 'HotSprings'),
  ]
};
