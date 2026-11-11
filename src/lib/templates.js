// @ts-nocheck
// Screen templates shared by Create Screen, Screen detail and the Change Template modal.
// TEMPLATES: what a template is (zones a playlist can be assigned to; Background is always last).
// LAYOUTS:   how its preview is drawn (CSS grid tracks, padding, fills) — from Figma "Screens Page V2".

var deep = '#2f467d', mid = '#5273c0', soft = '#8ba7e9', bright = '#709ff8', pale = '#b4ccfb', navy = '#091635', logo = 'var(--primary-700)';

export var TEMPLATES = [
  { id: 'nct-standard', title: 'NCT Standard Template', description: 'Classic layout with main content area, vertical sidebar and horizontal footer zone', zones: ['Main', 'Vertical', 'Horizontal', 'Background'] },
  { id: 'standard-v2', title: 'Standard Template V2', description: 'Main area with a vertical sidebar, a logo slot and a horizontal footer', zones: ['Main', 'Vertical', 'Horizontal', 'Logo', 'Background'] },
  { id: 'fullscreen', title: 'Fullscreen', description: 'One full-screen zone for a single playlist', zones: ['Main', 'Background'] },
  { id: 'test', title: 'Test Template', description: 'A single main zone framed by the background', zones: ['Main', 'Background'] },
  { id: 'two-one', title: '2-1 Zone', description: 'Two stacked zones on the left beside a large main zone', zones: ['Upper Left', 'Lower Left', 'Main', 'Background'] },
  { id: 'one-one', title: '1 to 1 Zone', description: 'Three equal columns above a horizontal footer', zones: ['Left', 'Middle', 'Right', 'Horizontal', 'Background'] },
  { id: 'split', title: 'Split Zone', description: 'Two equal halves side by side', zones: ['Left', 'Main', 'Background'] },
  { id: 'trippy', title: 'Trippy Template', description: 'A main zone inside layered frames', zones: ['Main', 'Background'] },
  { id: 'tiles', title: 'Tile Template', description: 'Three square tiles across the top of the background', zones: ['Tile 1', 'Tile 2', 'Tile 3', 'Background'] }
];

// zone: the TEMPLATES zone name it belongs to; label: what is printed on it (defaults to zone).
// frames: optional nested border colours drawn around the zone (Trippy).
export var LAYOUTS = {
  'nct-standard': { cols: '79fr 21fr', rows: '71fr 29fr', gap: '5px', pad: '5px', bg: pale, zones: [
    { zone: 'Main', col: '1 / 2', row: '1 / 2', bg: deep },
    { zone: 'Vertical', col: '2 / 3', row: '1 / 2', bg: mid },
    { zone: 'Horizontal', col: '1 / 3', row: '2 / 3', bg: soft }] },
  'standard-v2': { cols: '23fr 56fr 21fr', rows: '71fr 29fr', gap: '5px', pad: '5px', bg: pale, zones: [
    { zone: 'Main', col: '1 / 3', row: '1 / 2', bg: deep },
    { zone: 'Vertical', col: '3 / 4', row: '1 / 2', bg: mid },
    { zone: 'Logo', col: '1 / 2', row: '2 / 3', bg: logo },
    { zone: 'Horizontal', col: '2 / 4', row: '2 / 3', bg: soft }] },
  'fullscreen': { cols: '1fr', rows: '1fr', gap: '0', pad: '0', bg: pale, zones: [
    { zone: 'Main', col: '1 / 2', row: '1 / 2', bg: mid }] },
  'test': { cols: '47fr 53fr', rows: '1fr', gap: '0', pad: '10px', bg: pale, zones: [
    { zone: 'Main', col: '1 / 2', row: '1 / 2', bg: mid }] },
  'two-one': { cols: '37fr 63fr', rows: '1fr 1fr', gap: '0', pad: '0', bg: 'var(--bg-surface)', zones: [
    { zone: 'Upper Left', col: '1 / 2', row: '1 / 2', bg: soft },
    { zone: 'Lower Left', col: '1 / 2', row: '2 / 3', bg: deep },
    { zone: 'Main', col: '2 / 3', row: '1 / 3', bg: mid }] },
  'one-one': { cols: '1fr 1fr 1fr', rows: '74fr 26fr', gap: '0', pad: '0', bg: pale, zones: [
    { zone: 'Left', col: '1 / 2', row: '1 / 2', bg: soft },
    { zone: 'Middle', col: '2 / 3', row: '1 / 2', bg: bright },
    { zone: 'Right', col: '3 / 4', row: '1 / 2', bg: pale },
    { zone: 'Horizontal', col: '1 / 4', row: '2 / 3', bg: deep }] },
  'split': { cols: '1fr 1fr', rows: '1fr', gap: '0', pad: '0', bg: pale, zones: [
    { zone: 'Left', col: '1 / 2', row: '1 / 2', bg: mid },
    { zone: 'Main', col: '2 / 3', row: '1 / 2', bg: soft }] },
  'trippy': { cols: '1fr', rows: '1fr', gap: '0', pad: '0', bg: deep, zones: [
    { zone: 'Main', col: '1 / 2', row: '1 / 2', bg: soft, frames: [deep, mid] }] },
  'tiles': { cols: '1fr 1fr 1fr 1fr', rows: '55fr 45fr', gap: '0', pad: '0', bg: mid, zones: [
    { zone: 'Tile 1', label: '1', col: '1 / 2', row: '1 / 2', bg: soft },
    { zone: 'Tile 2', label: '2', col: '2 / 3', row: '1 / 2', bg: navy },
    { zone: 'Tile 3', label: '3', col: '3 / 4', row: '1 / 2', bg: soft }] }
};

export function tplById(id) { for (var i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].id === id) return TEMPLATES[i]; return TEMPLATES[0]; }
export function tplByTitle(t) { for (var i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].title === t) return TEMPLATES[i]; return TEMPLATES[1]; }
export function layoutOf(id) { return LAYOUTS[id] || LAYOUTS['nct-standard']; }
export function zid(label) { return String(label).toLowerCase().replace(/\s+/g, '-'); }
