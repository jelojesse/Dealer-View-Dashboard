// @ts-nocheck
// Mock data for the Locator page (Figma "Locator Page V2 – NTV360"). Merged into D in mockData.js as
// D.locDealers and D.locTerritories. Shapes are real [lat, lng] outlines in Alabama/Mississippi/Tennessee/Georgia
// so they sit on the right places of the Leaflet map. Edit freely.
//
// Territory kinds:  'individual' (one dealer, orange) · 'merged' (several dealers, purple) · 'unassigned' (no dealer, teal)

/* Dealers shown in the Locator list: [id, name, status, hosts, licenses, online, pending, offline, avatar colour] */
var DEALERS = [
  ['ld1', 'Allan Neill', 'Inactive', 43, 90, 1, 4, 2, '#5b6475'],
  ['ld2', 'Coleman Mockbee', 'Active', 23, 90, 1, 4, 2, '#2f7d4f'],
  ['ld3', 'Kyle Gay', 'Active', 23, 90, 1, 4, 2, '#3a6fb0'],
  ['ld4', 'Steve Snow', 'Active', 23, 90, 1, 4, 2, '#7a4fb0'],
  ['ld5', 'Alexa Ford', 'Active', 23, 90, 1, 4, 2, '#b04f7a'],
  ['ld6', 'Xi Lin Bao', 'Active', 23, 90, 1, 4, 2, '#b07a2f'],
  ['ld7', 'Jordan Lee', 'Active', 18, 64, 3, 1, 0, '#2f8fb0'],
  ['ld8', 'Maria Santos', 'Active', 12, 40, 2, 2, 1, '#b0442f'],
  ['ld9', 'Ben Carter', 'Active', 9, 31, 4, 0, 1, '#4f8a2f'],
  ['ld10', 'Sample Dealer', 'Active', 6, 20, 2, 1, 1, '#6b6b6b'],
  ['ld11', 'Priya Nair', 'Active', 15, 52, 5, 2, 0, '#8a2fb0'],
  ['ld12', 'Tomás Reyes', 'Inactive', 4, 11, 0, 1, 3, '#5b6475']
];

var dealers = DEALERS.map(function (r) {
  return { id: r[0], name: r[1], status: r[2], hosts: r[3], licenses: r[4], online: r[5], pending: r[6], offline: r[7], color: r[8],
    initials: r[1].split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase() };
});

/* [id, name, kind, dealer ids, state, created, area, outline [[lat,lng],…]] */
var TERR = [
  ['lt1', 'Aztech Foundations', 'individual', ['ld1'], 'Alabama', 'July 14, 2025', '15.2 km²',
    [[33.63, -87.63], [33.63, -87.07], [33.52, -86.97], [33.36, -86.98], [33.19, -87.05], [33.14, -87.30], [33.16, -87.52], [33.30, -87.62]]],
  ['lt2', 'Coleman Mockbee Territory', 'individual', ['ld2'], 'Alabama', 'August 2, 2025', '22.8 km²',
    [[35.18, -87.42], [35.18, -87.22], [34.94, -87.22], [34.94, -86.98], [34.80, -86.90], [34.66, -86.96], [34.60, -87.18], [34.62, -87.72], [34.80, -87.74], [34.86, -87.52]]],
  ['lt3', 'Kyle Gay Territory', 'individual', ['ld3'], 'Alabama', 'August 18, 2025', '18.4 km²',
    [[34.98, -86.78], [34.98, -86.45], [34.80, -86.38], [34.58, -86.44], [34.55, -86.66], [34.70, -86.80]]],
  ['lt4', 'Steve Snow', 'individual', ['ld4'], 'Alabama', 'September 1, 2025', '6.1 km²',
    [[33.72, -86.86], [33.70, -86.76], [33.42, -86.70], [33.33, -86.74], [33.34, -86.82], [33.55, -86.86]]],
  ['lt5', 'Tier One Updated', 'merged', ['ld5', 'ld6'], 'Alabama', 'October 3, 2025', '31.7 km²',
    [[32.52, -86.42], [32.52, -86.22], [32.40, -86.10], [32.22, -86.12], [32.12, -86.26], [32.18, -86.44], [32.32, -86.50]]],
  ['lt6', 'Sample Merged Territory', 'merged', ['ld7', 'ld8', 'ld9', 'ld11'], 'Alabama', 'November 9, 2025', '96.3 km²',
    [[31.15, -88.35], [31.12, -87.40], [31.02, -87.10], [30.95, -86.62], [30.60, -86.55], [30.40, -86.90], [30.35, -87.60], [30.25, -88.10], [30.40, -88.38]]],
  ['lt7', 'Sample Territory', 'individual', ['ld10'], 'Georgia', 'December 1, 2025', '12.0 km²',
    [[34.95, -85.20], [34.95, -84.75], [34.55, -84.75], [34.55, -85.20]]],
  ['lt8', 'West Point Territory', 'individual', ['ld12'], 'Mississippi', 'January 12, 2026', '14.6 km²',
    [[34.25, -88.95], [34.25, -88.45], [33.85, -88.45], [33.85, -88.95]]],
  ['lt9', 'Philadelphia Area', 'unassigned', [], 'Mississippi', 'February 4, 2026', '19.9 km²',
    [[33.05, -89.40], [33.05, -88.85], [32.55, -88.85], [32.55, -89.40]]],
  ['lt10', 'Demopolis Area', 'unassigned', [], 'Alabama', 'February 4, 2026', '19.2 km²',
    [[32.80, -88.10], [32.80, -87.55], [32.30, -87.55], [32.30, -88.10]]],
  ['lt11', 'Laurel Area', 'unassigned', [], 'Mississippi', 'March 9, 2026', '18.7 km²',
    [[32.15, -89.55], [32.15, -89.00], [31.65, -89.00], [31.65, -89.55]]],
  ['lt12', 'Eufaula Area', 'unassigned', [], 'Alabama', 'March 9, 2026', '20.4 km²',
    [[32.05, -85.55], [32.05, -85.00], [31.50, -85.00], [31.50, -85.55]]]
];

var territories = TERR.map(function (r) {
  var pts = r[7], lat = 0, lng = 0;
  pts.forEach(function (p) { lat += p[0]; lng += p[1]; });
  return { id: r[0], name: r[1], kind: r[2], dealers: r[3], state: r[4], created: r[5], area: r[6], outline: pts,
    lat: (lat / pts.length).toFixed(7), lng: (lng / pts.length).toFixed(7) };
});

export var LOCATOR = { locDealers: dealers, locTerritories: territories };
