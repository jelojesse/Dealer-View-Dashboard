// @ts-nocheck
/**
 * Page: Locator  (route /locator)
 * Rebuilt from Figma "Locator Page V2 – NTV360" (section 5295:51615) and the interaction recording.
 * Real map: Leaflet + OpenStreetMap tiles (free; swap the tile URL in componentDidMount for another style).
 *
 * Two modes (top-right toggle, with a short "Shifting to … Mode" loader):
 *  - Locator:   pick dealers (search dropdown), see their territories as outlines; "navigate to area" zooms in,
 *               opens the Territory panel (info + host list) and shows host pins; a pin opens the host popup.
 *  - Territory: territory list, hover shows the name, click fills it and opens General Information + Hosts Overview.
 *               Shift + Click adds territories to the selection.
 * Editing (Territory mode): Add Territory (name + dealer -> draw on the map -> overlap check -> review -> save),
 *   ••• menu (Rename, Edit Boundaries, Assign Dealer / Unassign, Delete) and Checklist -> Merge (N).
 *   Territories live in this.state.terrs, so edits last until the page reloads (mock data).
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - Map work (Leaflet layers) lives in the lifecycle methods: componentDidMount / componentDidUpdate.
 */
import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { STATUS, byId, contains, licsForHost, navFn, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import FilterBy, { passes } from '../components/FilterBy';
import './DealerLocator.css';

/* ============================== Logic ============================== */

var KIND = {
  individual: { label: 'Individual Territory', color: '#f7931e', fill: '#f7931e' },
  merged: { label: 'Merged Territory', color: '#3d2db5', fill: '#5b4bd6' },
  unassigned: { label: 'Unassigned Territory', color: '#1fa38a', fill: '#1fa38a' }
};
var PIN = { online: '#3adb30', pending: '#ffa500', offline: '#e73535' };
var CAT_COLORS = ['#5b4bd6', '#e73535', '#6ee96a', '#ffc04d', '#3d7bf7', '#b55bb0', '#f07a2a', '#3bbfa0', '#8a8f9c', '#d4a72c'];
var HOURS = [['Monday', '10:00 AM - 08:00 PM'], ['Tuesday', '10:00 AM - 08:00 PM'], ['Wednesday', '10:00 AM - 08:00 PM'], ['Thursday', '10:00 AM - 08:00 PM'], ['Friday', '10:00 AM - 08:00 PM'], ['Saturday', '09:00 AM - 08:00 PM'], ['Sunday', '10:00 AM - 06:00 PM']];
var START = { center: [32.75, -87.2], zoom: 7 };

function hostState(h) {
  var ls = licsForHost(h.id);
  if (ls.some(function (l) { return l.status === 'offline'; })) return 'offline';
  if (ls.some(function (l) { return l.status === 'pending' || l.status === 'ready'; })) return 'pending';
  return 'online';
}
/* Hosts per territory: the real D.hosts sit in Aztech Foundations; the others get a few generated pins inside their outline. */
var HOSTS_BY_TERR = null;
function hostsFor(t, all) {
  if (!HOSTS_BY_TERR) {
    HOSTS_BY_TERR = {};
    D.locTerritories.forEach(function (tt, ti) {
      if (tt.id === 'lt1') { HOSTS_BY_TERR[tt.id] = D.hosts.map(function (h) { return { id: h.id, name: h.name, category: h.category, address: h.address, city: h.city, state: h.state, zip: h.zip, photo: h.photo, status: h.status, lat: h.lat, lng: h.lng, st: hostState(h), lics: licsForHost(h.id).map(function (l) { return l.alias; }), real: true }; }); return; }
      if (tt.kind === 'unassigned') { HOSTS_BY_TERR[tt.id] = []; return; }
      var b = L.latLngBounds(tt.outline), c = b.getCenter(), dLat = (b.getNorth() - b.getSouth()) * 0.28, dLng = (b.getEast() - b.getWest()) * 0.28;
      HOSTS_BY_TERR[tt.id] = [0, 1, 2, 3, 4, 5].map(function (k) {
        var src = D.hosts[(ti * 7 + k * 5) % D.hosts.length], a = (k / 6) * Math.PI * 2 + ti;
        return { id: tt.id + 'h' + k, name: src.name, category: src.category, address: src.address, city: tt.state, state: '', zip: src.zip, photo: src.photo, status: k === 5 ? 'Inactive' : 'Active',
          lat: c.lat + Math.sin(a) * dLat * (0.5 + (k % 3) * 0.25), lng: c.lng + Math.cos(a) * dLng * (0.5 + (k % 2) * 0.4), st: ['online', 'online', 'pending', 'online', 'offline', 'pending'][k], lics: ['License # ' + (10 + k), 'License # ' + (29 + k)], real: false };
      });
    });
  }
  if (!(t.id in HOSTS_BY_TERR) && (t.outline || t.parts)) HOSTS_BY_TERR[t.id] = hostsForNew(t, all || []);
  return HOSTS_BY_TERR[t.id] || [];
}
/* ---------- Geometry helpers (lat/lng rings) ---------- */
function ringsOf(t) { return t.parts || [t.outline]; }
function pointIn(pt, ring) { var x = pt[1], y = pt[0], inside = false; for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) { var xi = ring[i][1], yi = ring[i][0], xj = ring[j][1], yj = ring[j][0]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside; } return inside; }
function segX(a, b, c, d) { var o = function (p, q, r) { return (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]); }; var o1 = o(a, b, c), o2 = o(a, b, d), o3 = o(c, d, a), o4 = o(c, d, b); return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0); }
function ringsOverlap(a, b) {
  if (a.some(function (p) { return pointIn(p, b); }) || b.some(function (p) { return pointIn(p, a); })) return true;
  for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) if (segX(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true;
  return false;
}
function areaKm2(ring) { var lat0 = ring.reduce(function (s, p) { return s + p[0]; }, 0) / ring.length, kx = 111.32 * Math.cos(lat0 * Math.PI / 180), ky = 110.57, a = 0; for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) a += (ring[j][1] * kx + ring[i][1] * kx) * (ring[j][0] * ky - ring[i][0] * ky); return Math.abs(a / 2); }
function fmtArea(km) { return (km >= 100 ? Math.round(km).toLocaleString('en-US') : km.toFixed(1)) + ' km²'; }
function centerOf(rings) { var b = L.latLngBounds([]); rings.forEach(function (r) { b.extend(L.latLngBounds(r)); }); var c = b.getCenter(); return { lat: c.lat.toFixed(7), lng: c.lng.toFixed(7) }; }
function stateAt(c) { var lat = +c.lat, lng = +c.lng; return lng < -88.47 ? 'Mississippi' : lng > -85.0 ? 'Georgia' : lat > 35.0 ? 'Tennessee' : 'Alabama'; }
function today() { return new Date(2026, 10, 20).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
/* Hosts for territories made in this session: merged = the parts' hosts; drawn = real hosts that fall inside. */
function hostsForNew(t, all) {
  if (t.from) return t.from.reduce(function (acc, id) { var src = all.filter(function (x) { return x.id === id; })[0]; return acc.concat(src ? hostsFor(src, all) : (HOSTS_BY_TERR[id] || [])); }, []);
  var rings = ringsOf(t), base = hostsFor({ id: 'lt1' });
  return base.filter(function (h) { return rings.some(function (r) { return pointIn([h.lat, h.lng], r); }); });
}
function dealerNames(t) { return t.dealers.map(function (id) { var d = byId(D.locDealers, id); return d ? d.name : ''; }).filter(Boolean); }
function pinIcon(color, big) {
  var w = big ? 34 : 26, h = Math.round(w * 1.32);
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 26 34"><path d="M13 0C5.8 0 0 5.6 0 12.6 0 22 13 34 13 34s13-12 13-21.4C26 5.6 20.2 0 13 0z" fill="' + color + '" stroke="#fff" stroke-width="1.5"/><circle cx="13" cy="12.5" r="4.6" fill="#fff"/></svg>';
  return L.divIcon({ className: 'lc-pin', html: svg, iconSize: [w, h], iconAnchor: [w / 2, h] });
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.mapEl = React.createRef();
    this.state = {
      mode: 'locator', switching: '', panel: false, pickFilters: {},
      dq: '', pickerOpen: false, selected: [],
      vis: { merged: true, individual: true, unassigned: true },
      focus: '', hostQ: '', hostFilters: {}, openHost: '', popup: '',
      tq: '', checklist: false, hover: '', picks: [], tick: 0, toast: null,
      terrs: D.locTerritories.slice(), menu: false,
      modal: '', fName: '', fDealer: '', fErr: false, renameVal: '', assignQ: '', assignPick: '', mergeName: '', mergeColor: '#5b4bd6',
      draft: null, overlapWith: [], success: null
    };
  }

  /* ---------- Leaflet lifecycle ---------- */
  componentDidMount() {
    var self = this;
    var map = this.map = L.map(this.mapEl.current, { zoomControl: false, attributionControl: true, minZoom: 5, maxZoom: 17, zoomSnap: 0.5 }).setView(START.center, START.zoom);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    this.terrLayer = L.layerGroup().addTo(map);
    this.pinLayer = L.layerGroup().addTo(map);
    this.drawLayer = L.layerGroup().addTo(map);
    map.on('click', function (e) { var d = self.state.draft; if (d && d.kind === 'draw' && !self.state.modal) self.setState({ draft: Object.assign({}, d, { pts: d.pts.concat([[+e.latlng.lat.toFixed(5), +e.latlng.lng.toFixed(5)]]) }) }); });
    map.on('move zoom', function () { if (self.state.popup) self.setState({ tick: self.state.tick + 1 }); });
    map.on('click', function () { if (self.state.popup) self.setState({ popup: '' }); });
    this._outside = function (e) { if (self.state.pickerOpen && !(e.target.closest && e.target.closest('.lc-left'))) self.setState({ pickerOpen: false }); };
    document.addEventListener('mousedown', this._outside);
    this._keyUp = function (e) { if (e.key === 'Escape') { if (self.state.modal && self.state.modal !== 'wait') self.setState({ modal: '' }); else self.setState({ popup: '', pickerOpen: false, menu: false }); } };
    document.addEventListener('keydown', this._keyUp);
    this.drawLayers();
    setTimeout(function () { map.invalidateSize(); }, 50);
  }
  componentDidUpdate(prev, prevState) {
    var s = this.state, keys = ['mode', 'selected', 'vis', 'focus', 'hover', 'picks', 'hostFilters', 'hostQ', 'openHost', 'popup', 'terrs', 'draft'];
    if (keys.some(function (k) { return prevState[k] !== s[k]; })) this.drawLayers();
    if (prevState.draft !== s.draft && this.map) { var el = this.map.getContainer(); if (s.draft && s.draft.kind === 'draw') el.classList.add('lc-drawing'); else el.classList.remove('lc-drawing'); }
    if (prevState.panel !== s.panel || prevState.focus !== s.focus || prevState.picks !== s.picks) { var m = this.map; setTimeout(function () { m && m.invalidateSize(); }, 0); }
  }
  componentWillUnmount() { if (this.map) this.map.remove(); this.map = null; document.removeEventListener('keydown', this._keyUp); document.removeEventListener('mousedown', this._outside); if (this._tt) clearTimeout(this._tt); if (this._sw) clearTimeout(this._sw); if (this._wt) clearTimeout(this._wt); }

  visibleTerritories() {
    var s = this.state, sel = s.selected;
    return s.terrs.filter(function (t) {
      if (!s.vis[t.kind]) return false;
      if (s.draft && s.draft.kind === 'edit' && s.draft.id === t.id) return false;
      if (s.mode === 'territory') return true;
      return t.dealers.some(function (id) { return sel.indexOf(id) !== -1; });
    });
  }
  focusedHosts() {
    var s = this.state, t = s.focus ? byId(s.terrs, s.focus) : null;
    if (!t || s.mode !== 'locator') return [];
    return hostsFor(t, s.terrs).filter(function (h) { return contains(h.name + ' ' + h.lics.join(' '), s.hostQ) && passes(s.hostFilters, 'status', h.status) && passes(s.hostFilters, 'state', h.st.charAt(0).toUpperCase() + h.st.slice(1)); });
  }
  drawLayers() {
    var self = this, s = this.state, map = this.map;
    if (!map) return;
    this.terrLayer.clearLayers(); this.pinLayer.clearLayers();
    var terrMode = s.mode === 'territory';
    this.visibleTerritories().forEach(function (t) {
      var k = t.color && t.kind === 'merged' ? { color: t.color, fill: t.color } : KIND[t.kind], focused = s.focus === t.id, picked = s.picks.indexOf(t.id) !== -1, hovered = s.hover === t.id;
      var style = terrMode
        ? { color: k.color, weight: picked ? 2.5 : 1.5, fillColor: k.fill, fillOpacity: picked ? 0.78 : (hovered ? 0.28 : 0.12), opacity: 1 }
        : { color: k.color, weight: focused ? 4 : 2, fillColor: k.fill, fillOpacity: 0, opacity: 1 };
      var poly = L.polygon(ringsOf(t).map(function (r) { return [r]; }), style).addTo(self.terrLayer);
      if (terrMode || !focused) poly.bindTooltip(t.name, { className: 'lc-tip', direction: 'top', sticky: true, offset: [0, -10] });
      poly.on('mouseover', function () { if (self.state.mode === 'territory') self.setState({ hover: t.id }); });
      poly.on('mouseout', function () { if (self.state.hover === t.id) self.setState({ hover: '' }); });
      poly.on('click', function (e) { L.DomEvent.stopPropagation(e); if (self.state.draft) { if (self.state.draft.kind === 'draw') self.map.fire('click', { latlng: e.latlng }); return; } self.pickTerritory(t.id, e.originalEvent && e.originalEvent.shiftKey); });
    });
    this.focusedHosts().forEach(function (h) {
      var big = s.popup === h.id || s.openHost === h.id;
      var m = L.marker([h.lat, h.lng], { icon: pinIcon(PIN[h.st], big), title: h.name, riseOnHover: true, zIndexOffset: big ? 1000 : 0, keyboard: true }).addTo(self.pinLayer);
      m.on('click', function (e) { L.DomEvent.stopPropagation(e); self.setState({ popup: h.id, openHost: h.id }); });
    });
    this.drawDraft();
  }
  drawDraft() {
    var self = this, d = this.state.draft;
    this.drawLayer.clearLayers(); this.draftPoly = null;
    if (!d) return;
    var color = '#f7931e', pts = d.pts;
    if (pts.length >= 3) this.draftPoly = L.polygon(pts, { color: color, weight: 2, fillColor: color, fillOpacity: 0.18, dashArray: d.kind === 'draw' ? '6 6' : null, interactive: false }).addTo(this.drawLayer);
    else if (pts.length === 2) L.polyline(pts, { color: color, weight: 2, dashArray: '6 6', interactive: false }).addTo(this.drawLayer);
    pts.forEach(function (p, i) {
      if (d.kind === 'edit') {
        var m = L.marker(p, { draggable: true, icon: L.divIcon({ className: 'lc-vtx', iconSize: [14, 14], iconAnchor: [7, 7] }), keyboard: false }).addTo(self.drawLayer);
        m.on('drag', function (e) { var ll = e.target.getLatLng(), np = (self._livePts || self.state.draft.pts).slice(); np[i] = [ll.lat, ll.lng]; if (self.draftPoly) self.draftPoly.setLatLngs(np); self._livePts = np; });
        m.on('dragend', function () { if (self._livePts) self.setState({ draft: Object.assign({}, self.state.draft, { pts: self._livePts.map(function (q) { return [+q[0].toFixed(5), +q[1].toFixed(5)]; }) }) }); self._livePts = null; });
      } else {
        var first = i === 0 && pts.length >= 3;
        var c = L.circleMarker(p, { radius: first ? 7 : 5, color: color, weight: 2, fillColor: '#fff', fillOpacity: 1 }).addTo(self.drawLayer);
        if (first) { c.bindTooltip('Click to finish', { direction: 'top', className: 'lc-tip' }); c.on('click', function (e) { L.DomEvent.stopPropagation(e); self.finishDraw(); }); }
      }
    });
  }

  /* ---------- Editing flows ---------- */
  wait(then) { this.setState({ modal: 'wait', menu: false }); this._wt = setTimeout(function () { then(); }, 900); }
  done(title, text) { this.setState({ modal: 'success', success: { title: title, text: text || 'Your changes have been saved successfully.' } }); }
  finishDraw() {
    var s = this.state, d = s.draft;
    if (!d || d.pts.length < 3) { toast(this, 'Add at least 3 points to make a territory', 'warning'); return; }
    if (d.kind === 'edit') { this.saveDraft(); return; }
    var hits = s.terrs.filter(function (t) { return ringsOf(t).some(function (r) { return ringsOverlap(d.pts, r); }); });
    if (hits.length) this.setState({ modal: 'overlap', overlapWith: hits.map(function (t) { return t.name; }) });
    else this.setState({ modal: 'review' });
  }
  clipDraft() {
    var s = this.state, d = s.draft;
    var others = s.terrs.reduce(function (a, t) { return a.concat(ringsOf(t)); }, []);
    var kept = d.pts.filter(function (p) { return !others.some(function (r) { return pointIn(p, r); }); });
    if (kept.length < 3) { toast(this, 'Too much of the shape overlaps to clip it. Redraw it instead.', 'warning'); return; }
    this.setState({ draft: Object.assign({}, d, { pts: kept }), modal: 'review' });
    toast(this, 'Overlapping corners removed', 'info');
  }
  saveDraft() {
    var self = this, s = this.state, d = s.draft;
    this.wait(function () {
      var c = centerOf([d.pts]);
      if (d.kind === 'edit') {
        var terrs = s.terrs.map(function (t) { return t.id === d.id ? Object.assign({}, t, { outline: d.pts, parts: null, lat: c.lat, lng: c.lng, area: fmtArea(areaKm2(d.pts)) }) : t; });
        delete HOSTS_BY_TERR[d.id];
        self.setState({ terrs: terrs, draft: null, picks: [d.id], panel: true }, function () { self.done('Territory Modified'); });
      } else {
        var id = 'lt' + Date.now(), nt = { id: id, name: d.name, kind: d.dealer ? 'individual' : 'unassigned', dealers: d.dealer ? [d.dealer] : [], state: stateAt(c), created: today(), area: fmtArea(areaKm2(d.pts)), outline: d.pts, lat: c.lat, lng: c.lng };
        self.setState({ terrs: [nt].concat(s.terrs), draft: null, picks: [id], panel: true }, function () { self.done('Territory Added', '“' + d.name + '” is now on the map.'); });
      }
    });
  }
  fitTo(outlines, pad) {
    if (!this.map || !outlines.length) return;
    var b = L.latLngBounds([]); outlines.forEach(function (o) { b.extend(L.latLngBounds(o)); });
    var s = this.state, left = s.panel ? 420 : 80, right = (s.mode === 'locator' ? s.focus : s.picks.length) ? 380 : 80;
    this.map.flyToBounds(b, { paddingTopLeft: [left, 60], paddingBottomRight: [right, 60], duration: 0.8, maxZoom: pad || 11 });
  }
  pickTerritory(id, shift) {
    var s = this.state, t = byId(s.terrs, id);
    if (!t || s.draft) return;
    if (s.mode === 'locator') { this.setState({ focus: id, popup: '', openHost: '', hostQ: '', hostFilters: {} }, () => this.fitTo(ringsOf(t))); return; }
    var picks = shift ? (s.picks.indexOf(id) !== -1 ? s.picks.filter(function (x) { return x !== id; }) : s.picks.concat([id])) : [id];
    this.setState({ picks: picks, menu: false }, () => { if (!shift) this.fitTo(ringsOf(t)); });
  }

  startDraw() {
    var s = this.state;
    this.setState({ modal: '', panel: false, picks: [], menu: false, draft: { kind: 'draw', name: s.fName.trim(), dealer: s.fDealer, pts: [] } });
    toast(this, 'Click on the map to add points', 'info', 'Click the first point (or Finish) to close the shape.');
  }
  openMerge() {
    var s = this.state, names = s.picks.map(function (id) { var x = byId(s.terrs, id); return x ? x.name : ''; });
    this.setState({ modal: 'merge', menu: false, mergeName: names.slice(0, 2).join(' + '), mergeColor: '#5b4bd6' });
  }
  renderVals() {
    var self = this, s = this.state, terrMode = s.mode === 'territory';
    var sel = s.selected;
    var selDealers = sel.map(function (id) { return byId(D.locDealers, id); }).filter(Boolean);
    var focusT = s.focus ? byId(s.terrs, s.focus) : null;
    var hosts = this.focusedHosts();
    var popupHost = s.popup ? hostsFor(focusT || { id: '' }, s.terrs).filter(function (h) { return h.id === s.popup; })[0] : null;
    var pt = popupHost && this.map ? this.map.latLngToContainerPoint([popupHost.lat, popupHost.lng]) : null;
    var terrForDealer = function (did) { return s.terrs.filter(function (t) { return t.dealers.indexOf(did) !== -1; })[0]; };
    var pickedTs = s.picks.map(function (id) { return byId(s.terrs, id); }).filter(Boolean);
    var mainPick = pickedTs[pickedTs.length - 1];
    var donut = (function () {
      if (!mainPick) return null;
      var hs = hostsFor(mainPick, s.terrs), counts = {};
      if (!hs.length && !/^lt\d{1,2}$/.test(mainPick.id)) return { empty: true, segs: [] };
      (hs.length ? hs : D.hosts).forEach(function (h) { counts[h.category] = (counts[h.category] || 0) + 1; });
      var cats = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 8);
      var tot = cats.reduce(function (a, c) { return a + counts[c]; }, 0) || 1, C = 2 * Math.PI * 42, acc = 0;
      return { total: mainPick.id === 'lt1' ? 142 : Math.max(tot * 7, 12), segs: cats.map(function (c, i) { var len = counts[c] / tot * C, seg = { label: c, color: CAT_COLORS[i], dash: len.toFixed(2) + ' ' + C.toFixed(2), off: (-acc).toFixed(2) }; acc += len; return seg; }) };
    })();
    var terrList = s.terrs.filter(function (t) { return s.vis[t.kind] && contains(t.name + ' ' + dealerNames(t).join(' '), s.tq); });
    return {
      i10: 10, i12: 12, i14: 14, i16: 16, none: null,
      crumbs: [{ label: 'Dashboard', href: 'DealerDashboard.dc.html' }, 'Locator'],
      terrMode: terrMode, locMode: !terrMode,
      vis: [['merged', 'Merged Territory', 'lc-vis--merged'], ['individual', 'Individual Territory', 'lc-vis--individual']].map(function (x) {
        return { label: x[1], on: !!s.vis[x[0]], cls: x[2], toggle: function () { var n = Object.assign({}, self.state.vis); n[x[0]] = !n[x[0]]; self.setState({ vis: n }); } };
      }),
      setMode: function (m) { return function () {
        if (self.state.mode === m || self.state.switching) return;
        self.setState({ switching: m, popup: '' });
        self._sw = setTimeout(function () { self.setState({ mode: m, switching: '', focus: '', picks: [], hover: '', openHost: '' }); }, 1100);
      }; },
      switching: s.switching, switchLabel: s.switching === 'territory' ? 'Shifting to Territory Mode' : 'Shifting to Locator Mode',
      panel: s.panel, togglePanel: function () { self.setState({ panel: !self.state.panel, pickerOpen: false }); }, panelIcon: s.panel ? 'angle-up' : 'angle-down',
      /* ---- Locator mode: dealers ---- */
      dq: s.dq, setDq: function (x) { self.setState({ dq: val(x), pickerOpen: true }); },
      openPicker: function () { self.setState({ pickerOpen: true }); },
      searchFocus: function (e) { if (self.state.mode === 'locator' && e.target && e.target.tagName === 'INPUT') self.setState({ pickerOpen: true, panel: true }); }, closePicker: function () { self.setState({ pickerOpen: false }); },
      pickerOpen: s.pickerOpen && !terrMode,
      pickFilterGroups: [{ key: 'status', title: 'Status', options: ['Active', 'Inactive'] }],
      pickFilters: s.pickFilters, setPickFilters: function (x) { self.setState({ pickFilters: x }); },
      options: D.locDealers.filter(function (d) { return contains(d.name, s.dq) && passes(s.pickFilters, 'status', d.status); }).map(function (d) {
        var on = sel.indexOf(d.id) !== -1;
        return { id: d.id, name: d.name, on: on, initials: d.initials, color: d.color, status: d.status, active: d.status === 'Active', hosts: d.hosts, licenses: d.licenses,
          toggle: function () { self.setState({ selected: on ? self.state.selected.filter(function (x) { return x !== d.id; }) : self.state.selected.concat([d.id]) }); } };
      }),
      selCount: selDealers.length + ' selected', clearAll: function () { self.setState({ selected: [], focus: '', popup: '' }); },
      dealers: selDealers.map(function (d) {
        var t = terrForDealer(d.id);
        return { id: d.id, name: d.name, initials: d.initials, color: d.color, status: d.status, active: d.status === 'Active', hosts: d.hosts, licenses: d.licenses, online: d.online, pending: d.pending, offline: d.offline,
          focused: !!(t && s.focus === t.id), hasArea: !!t,
          remove: function () { self.setState({ selected: self.state.selected.filter(function (x) { return x !== d.id; }), focus: t && self.state.focus === t.id ? '' : self.state.focus }); },
          go: function () { if (t) self.pickTerritory(t.id); else toast(self, d.name + ' has no territory yet', 'info'); } };
      }),
      noDealers: selDealers.length === 0,
      /* ---- Locator mode: territory panel ---- */
      focus: focusT ? { name: focusT.name, dealer: dealerNames(focusT).join(', ') || 'Unassigned', state: focusT.state, lng: focusT.lng, lat: focusT.lat, area: focusT.area, created: focusT.created, unassigned: focusT.kind === 'unassigned' } : null,
      closeFocus: function () { self.setState({ focus: '', popup: '', openHost: '' }); },
      hostQ: s.hostQ, setHostQ: function (x) { self.setState({ hostQ: val(x) }); },
      hostFilterGroups: [{ key: 'state', title: 'Connection', options: ['Online', 'Pending', 'Offline'] }, { key: 'status', title: 'Status', options: ['Active', 'Inactive'] }],
      hostFilters: s.hostFilters, setHostFilters: function (x) { self.setState({ hostFilters: x }); },
      hosts: hosts.map(function (h) {
        var open = s.openHost === h.id;
        return { id: h.id, name: h.name, city: (h.city + ' ' + (h.state || '') + ' ' + h.zip).replace(/\s+/g, ' ').trim(), status: h.status, active: h.status === 'Active', pin: PIN[h.st], lics: h.lics, licN: h.lics.length, open: open, category: h.category,
          coords: (+h.lat).toFixed(7) + ', ' + (+h.lng).toFixed(7),
          toggle: function () { self.setState({ openHost: open ? '' : h.id }); },
          locate: function () { if (self.map) self.map.flyTo([h.lat, h.lng], Math.max(self.map.getZoom(), 13), { duration: 0.6 }); self.setState({ popup: h.id, openHost: h.id }); } };
      }),
      noHosts: !!focusT && hosts.length === 0,
      assignDealer: function () { self.setState({ modal: 'assign', assignQ: '', assignPick: '' }); },
      /* ---- Host popup ---- */
      popup: popupHost && pt ? { show: true, left: pt.x, top: pt.y, name: popupHost.name, photo: popupHost.photo, status: popupHost.status, active: popupHost.status === 'Active', category: popupHost.category,
        address: popupHost.address + ', ' + popupHost.city + (popupHost.zip ? ' ' + popupHost.zip : ''), coords: (+popupHost.lat).toFixed(7) + ', ' + (+popupHost.lng).toFixed(7), hours: HOURS,
        open: popupHost.real ? navFn('DealerHostDetail.dc.html', { id: popupHost.id }) : null, real: popupHost.real } : { show: false },
      closePopup: function () { self.setState({ popup: '' }); },
      copyCoords: function () { var c = popupHost ? (+popupHost.lat).toFixed(7) + ', ' + (+popupHost.lng).toFixed(7) : ''; try { navigator.clipboard.writeText(c); } catch (e) {} toast(self, 'Coordinates copied', 'info'); },
      demoHost: function () { toast(self, 'This sample host has no details page', 'info'); },
      /* ---- Territory mode ---- */
      tq: s.tq, setTq: function (x) { self.setState({ tq: val(x) }); },
      dealersSel: s.terrs.filter(function (t) { return s.vis[t.kind]; }).length + ' territories',
      checklist: s.checklist, setChecklist: function (on) { self.setState({ checklist: on }); },
      addTerritory: function () { self.setState({ modal: 'add', fName: '', fDealer: '', fErr: false, menu: false }); },
      dealerOptions: ['No dealer'].concat(D.locDealers.map(function (d) { return d.name; })),
      fName: s.fName, setFName: function (x) { self.setState({ fName: val(x), fErr: false }); }, fErr: s.fErr,
      fDealerName: s.fDealer ? (byId(D.locDealers, s.fDealer) || {}).name : '',
      setFDealer: function (x) { var n = val(x), d = D.locDealers.filter(function (q) { return q.name === n; })[0]; self.setState({ fDealer: d ? d.id : '' }); },
      addReady: !!s.fName.trim(),
      proceedAdd: function () {
        if (!self.state.fName.trim()) { self.setState({ fErr: true }); return; }
        if (!self.state.fDealer) { self.setState({ modal: 'nodealer' }); return; }
        self.startDraw();
      },
      startDrawAnyway: function () { self.startDraw(); },
      backToAdd: function () { self.setState({ modal: 'add' }); },
      draft: s.draft ? { kind: s.draft.kind, name: s.draft.name, n: s.draft.pts.length, canFinish: s.draft.pts.length >= 3, isDraw: s.draft.kind === 'draw' } : null,
      undoPoint: function () { var d = self.state.draft; if (d && d.pts.length) self.setState({ draft: Object.assign({}, d, { pts: d.pts.slice(0, -1) }) }); },
      cancelDraft: function () { self.setState({ draft: null, modal: '', panel: true }); },
      finishDraft: function () { self.finishDraw(); },
      redraw: function () { var d = self.state.draft; self.setState({ draft: Object.assign({}, d, { pts: [] }), modal: '' }); },
      clipOverlap: function () { self.clipDraft(); },
      keepOverlap: function () { self.setState({ modal: 'review' }); },
      overlapWith: s.overlapWith,
      review: s.draft && s.draft.pts.length >= 3 ? (function () { var c = centerOf([s.draft.pts]); return { name: s.draft.name, state: stateAt(c), lng: c.lng, lat: c.lat, area: fmtArea(areaKm2(s.draft.pts)) }; })() : null,
      saveReview: function () { self.saveDraft(); },
      closeModal: function () { self.setState({ modal: '' }); },
      modal: s.modal,
      success: s.success, okSuccess: function () { self.setState({ modal: '', success: null }); },
      /* ••• menu */
      menuOpen: s.menu, toggleMenu: function () { self.setState({ menu: !self.state.menu }); },
      menuItems: (function () {
        if (!mainPick) return [];
        if (pickedTs.length > 1) return [
          { label: 'Merge ' + pickedTs.length + ' Territories', icon: 'merge', run: function () { self.openMerge(); } },
          { label: 'Unassign Selected', icon: 'user-xmark', run: function () { self.setState({ modal: 'unassignMany', menu: false }); }, danger: true }
        ];
        var un = mainPick.kind === 'unassigned';
        return [
          { label: 'Rename Territory', icon: 'pen-to-square', run: function () { self.setState({ modal: 'rename', renameVal: mainPick.name, menu: false }); } },
          { label: 'Edit Boundaries', icon: 'draw-polygon', run: function () { self.setState({ menu: false, panel: false, draft: { kind: 'edit', id: mainPick.id, name: mainPick.name, pts: ringsOf(mainPick)[0].slice() } }); toast(self, 'Drag the points to reshape the territory', 'info'); } },
          un ? { label: 'Assign Dealer', icon: 'user-plus', run: function () { self.setState({ modal: 'assign', assignQ: '', assignPick: '', menu: false }); } }
             : { label: 'Unassign Territory', icon: 'user-xmark', run: function () { self.setState({ modal: 'unassign', menu: false }); } },
          { label: 'Delete Territory', icon: 'trash', run: function () { self.setState({ modal: 'delete', menu: false }); }, danger: true }
        ];
      })(),
      /* rename */
      renameVal: s.renameVal, setRename: function (x) { self.setState({ renameVal: val(x) }); },
      renameReady: !!(s.renameVal.trim() && mainPick && s.renameVal.trim() !== mainPick.name),
      doRename: function () { var name = self.state.renameVal.trim(), id = mainPick.id; self.wait(function () { self.setState({ terrs: self.state.terrs.map(function (x) { return x.id === id ? Object.assign({}, x, { name: name }) : x; }) }, function () { self.done('Territory Renamed', 'It’s now called “' + name + '”.'); }); }); },
      /* unassign / delete */
      pickNames: pickedTs.map(function (x) { return x.name; }),
      doUnassign: function () { var ids = s.picks.slice(); self.wait(function () { self.setState({ terrs: self.state.terrs.map(function (x) { return ids.indexOf(x.id) !== -1 ? Object.assign({}, x, { kind: 'unassigned', dealers: [] }) : x; }) }, function () { self.done(ids.length > 1 ? 'Territories Unassigned' : 'Territory Unassigned', 'They stay on the map as unassigned territories.'); }); }); },
      doDelete: function () { var id = mainPick.id, name = mainPick.name; self.wait(function () { self.setState({ terrs: self.state.terrs.filter(function (x) { return x.id !== id; }), picks: [] }, function () { self.done('Territory Deleted', '“' + name + '” was removed from the map.'); }); }); },
      /* assign dealer */
      assignQ: s.assignQ, setAssignQ: function (x) { self.setState({ assignQ: val(x) }); },
      assignList: D.locDealers.filter(function (d) { return contains(d.name, s.assignQ); }).map(function (d) { return { id: d.id, name: d.name, initials: d.initials, color: d.color, active: d.status === 'Active', status: d.status, hosts: d.hosts, licenses: d.licenses, on: s.assignPick === d.id, pick: function () { self.setState({ assignPick: self.state.assignPick === d.id ? '' : d.id }); } }; }),
      assignReady: !!s.assignPick,
      doAssign: function () { var did = self.state.assignPick, id = mainPick ? mainPick.id : s.focus, dn = (byId(D.locDealers, did) || {}).name; self.wait(function () { self.setState({ terrs: self.state.terrs.map(function (x) { return x.id === id ? Object.assign({}, x, { kind: 'individual', dealers: [did] }) : x; }), selected: self.state.selected.indexOf(did) === -1 ? self.state.selected.concat([did]) : self.state.selected }, function () { self.done('Dealer Assigned', dn + ' now owns this territory.'); }); }); },
      /* merge */
      canMerge: s.checklist && pickedTs.length >= 2, mergeLabel: 'Merge (' + pickedTs.length + ')', openMerge: function () { self.openMerge(); },
      mergeName: s.mergeName, setMergeName: function (x) { self.setState({ mergeName: val(x) }); }, mergeColor: s.mergeColor,
      mergeColors: ['#5b4bd6', '#f7931e', '#1fa38a', '#3d7bf7', '#e73535', '#b55bb0'].map(function (c) { return { c: c, on: s.mergeColor === c, pick: function () { self.setState({ mergeColor: c }); } }; }),
      mergeReady: !!s.mergeName.trim(),
      mergeThumbs: pickedTs.map(function (x) {
        var rings = ringsOf(x), b = L.latLngBounds([]); rings.forEach(function (r) { b.extend(L.latLngBounds(r)); });
        var w = b.getEast() - b.getWest(), h = b.getNorth() - b.getSouth(), k = 180 / Math.max(w, h, 0.0001);
        return { id: x.id, name: x.name, d: rings.map(function (r) { return r.map(function (q, i) { return (i ? 'L' : 'M') + (10 + (q[1] - b.getWest()) * k).toFixed(1) + ' ' + (10 + (b.getNorth() - q[0]) * k).toFixed(1); }).join(' ') + 'Z'; }).join(' ') };
      }),
      doMerge: function () {
        var ids = s.picks.slice(), name = self.state.mergeName.trim();
        self.wait(function () {
          var parts = [], dealers = [], src = self.state.terrs.filter(function (x) { return ids.indexOf(x.id) !== -1; });
          src.forEach(function (x) { parts = parts.concat(ringsOf(x)); x.dealers.forEach(function (d) { if (dealers.indexOf(d) === -1) dealers.push(d); }); });
          var c = centerOf(parts), id = 'lt' + Date.now();
          var nt = { id: id, name: name, kind: dealers.length ? 'merged' : 'unassigned', dealers: dealers, state: stateAt(c), created: today(), area: fmtArea(parts.reduce(function (a, r) { return a + areaKm2(r); }, 0)), outline: parts[0], parts: parts, lat: c.lat, lng: c.lng, from: ids, color: self.state.mergeColor };
          hostsFor(nt, self.state.terrs);
          self.setState({ terrs: [nt].concat(self.state.terrs.filter(function (x) { return ids.indexOf(x.id) === -1; })), picks: [id], checklist: false }, function () { self.done('Territories Merged', src.length + ' territories are now “' + name + '”.'); });
        });
      },
      terrs: terrList.map(function (t) {
        var names = dealerNames(t), picked = s.picks.indexOf(t.id) !== -1;
        return { id: t.id, name: t.name, kind: t.kind, merged: t.kind === 'merged', unassigned: t.kind === 'unassigned', picked: picked, names: names, avatars: t.dealers.map(function (id) { return byId(D.locDealers, id); }).filter(Boolean).slice(0, 5),
          more: t.kind === 'merged' && names.length > 1 ? '1 of ' + names.length + ' dealers selected' : '',
          pick: function (e) { self.pickTerritory(t.id, e && e.shiftKey); }, check: function (on) { var p = on ? self.state.picks.concat([t.id]) : self.state.picks.filter(function (x) { return x !== t.id; }); self.setState({ picks: p }); },
          hover: function () { self.setState({ hover: t.id }); }, leave: function () { if (self.state.hover === t.id) self.setState({ hover: '' }); } };
      }),
      pick: mainPick ? { name: mainPick.name, dealer: dealerNames(mainPick).join(', ') || 'Unassigned', state: mainPick.state, lng: mainPick.lng, lat: mainPick.lat, area: mainPick.area, created: mainPick.created, count: pickedTs.length } : null,
      donut: donut,
      clearPicks: function () { self.setState({ picks: [] }); },
      terrMenu: function () { toast(self, 'Rename, merge and delete come in the next pass', 'info'); },
      /* ---- Map controls ---- */
      rightOpen: terrMode ? !!mainPick : !!focusT,
      zoomIn: function () { self.map && self.map.zoomIn(); }, zoomOut: function () { self.map && self.map.zoomOut(); },
      fit: function () { var ts = self.visibleTerritories().filter(function (t) { return t.kind !== 'unassigned' || terrMode; }); self.fitTo(ts.map(function (t) { return t.outline; }), 9); },
      reset: function () { self.setState({ focus: '', picks: [], popup: '', openHost: '' }); if (self.map) self.map.flyTo(START.center, START.zoom, { duration: 0.6 }); },
      toast: toastVals(s.toast, this)
    };
  }
}

/* ============================== Markup ============================== */

function Avatar({ initials, color, active, size }) {
  return (
    <span className={'lc-av' + (active ? ' is-active' : '')} style={{ width: size || 40, height: size || 40, background: color }}>
      <span>{initials}</span>
      {active !== undefined ? <span className={'lc-av__dot' + (active ? ' is-on' : '')} /> : null}
    </span>
  );
}
function Kv({ k, children }) { return <div className="lc-kv"><span>{k}</span><span>{children}</span></div>; }

defineTemplate(Component, (v) => (
    <div className="pg-locator" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "1100" }}>
        <DealerNav active="network" activeItem="Locator" />
      </div>
      <main className="lc-main">
        <div className="dv-between dv-page-head" style={{ flex: "none" }}>
          <NTV.Breadcrumbs items={v.crumbs} />
          <div className="dv-row" style={{ gap: "8px" }}>
            <span className="lc-vis-label">TERRITORY VISIBILITY</span>
            {v.vis.map((_c) => (
              <button key={_c.label} type="button" className={'lc-vis ' + _c.cls + (_c.on ? ' is-on' : '')} aria-pressed={_c.on} onClick={_c.toggle}>
                {_c.on ? <NTV.Icon name="check" size={v.i10} /> : null}{_c.label}
              </button>
            ))}
          </div>
        </div>

        <section className="lc-card" aria-label="Map">
          <div ref={v.__mapRef} className="lc-map" />

          {/* ---------------- Left panel ---------------- */}
          <aside className={'lc-left' + (v.panel ? '' : ' is-collapsed')} aria-label={v.terrMode ? 'Territories' : 'Dealers'}>
            <div className="lc-search" onFocusCapture={v.searchFocus}>
              {v.locMode ? (
                <NTV.Input size="l" placeholder="Search Dealer Name" iconRight="magnifying-glass" label="Search dealer name" value={v.dq} onChange={v.setDq} />
              ) : (
                <NTV.Input size="l" placeholder="Search Territory" iconRight="magnifying-glass" label="Search territory" value={v.tq} onChange={v.setTq} />
              )}
              <button type="button" className="lc-collapse" aria-expanded={v.panel} aria-label={v.panel ? 'Collapse list' : 'Expand list'} onClick={v.togglePanel}><NTV.Icon name={v.panelIcon} size={v.i12} /></button>
            </div>

            {v.pickerOpen ? (
              <div className="lc-picker">
                <div className="lc-picker__head">
                  <span>{"Showing "}{v.options.length.toLocaleString('en-US')}{" Dealers"}</span>
                  <FilterBy groups={v.pickFilterGroups} value={v.pickFilters} onChange={v.setPickFilters} align="right" iconOnly label="Filter dealers" />
                </div>
                <div className="lc-picker__list" role="listbox" aria-label="Dealers" aria-multiselectable="true">
                  {v.options.map((_o) => (
                    <button key={_o.id} type="button" role="option" aria-selected={_o.on} className={'lc-opt' + (_o.on ? ' is-on' : '')} onClick={_o.toggle}>
                      <span className="lc-opt__box" aria-hidden="true">{_o.on ? <NTV.Icon name="check" size={v.i10} /> : null}</span>
                      <span className="lc-opt__name">{_o.name}</span>
                    </button>
                  ))}
                  {v.options.length === 0 ? <p className="lc-empty">No dealers match “{v.dq}”.</p> : null}
                </div>
              </div>
            ) : null}

            {v.panel && !v.pickerOpen && v.locMode ? (
              <>
                <div className="dv-between lc-head">
                  <h1 className="lc-title">Locator</h1>
                  {v.noDealers ? null : <span className="lc-sub">{v.selCount}{" • "}<button type="button" className="lc-link" onClick={v.clearAll}>Clear all</button></span>}
                </div>
                <div className="lc-list">
                  {v.dealers.map((_d) => (
                    <div key={_d.id} className={'lc-dealer' + (_d.focused ? ' is-on' : '')}>
                      <div className="dv-between" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                        <div className="dv-row" style={{ gap: "10px", minWidth: "0" }}>
                          <Avatar initials={_d.initials} color={_d.color} active={_d.active} />
                          <span className="lc-dealer__body">
                            <strong>{_d.name}</strong>
                            <span className="lc-meta"><span className={_d.active ? 'lc-ok' : 'lc-off'}>{_d.status}</span><i />{"Hosts "}<b>{_d.hosts}</b><NTV.Icon name="map" size={v.i12} />{" Licenses "}<b>{_d.licenses}</b><NTV.Icon name="id-card" size={v.i12} /></span>
                          </span>
                        </div>
                        <button type="button" className="lc-x" aria-label={'Remove ' + _d.name} onClick={_d.remove}><NTV.Icon name="x" size={v.i10} /></button>
                      </div>
                      <div className="lc-dealer__foot">
                        <span className="lc-meta"><b className="lc-ok">{_d.online}</b>{" Online"}<b className="lc-pend">{_d.pending}</b>{" Pending"}<b className="lc-bad">{_d.offline}</b>{" Offline"}</span>
                        <button type="button" className="lc-go" aria-label={'Navigate to ' + _d.name + '’s area'} onClick={_d.go}><span>navigate to area</span><NTV.Icon name="angle-right" size={v.i14} /></button>
                      </div>
                    </div>
                  ))}
                  {v.noDealers ? (
                    <div className="lc-zero">
                      <NTV.Icon name="building" size={v.i16} />
                      <strong>Empty Data</strong>
                      <span>Select Dealers to get started</span>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {v.panel && v.terrMode ? (
              <>
                <div className="dv-between lc-head" style={{ marginBottom: "-4px" }}>
                  <span className="lc-sub">{v.dealersSel}</span>
                  <button type="button" className="lc-link" onClick={v.clearPicks}>Clear all</button>
                </div>
                <div className="dv-between lc-head">
                  <h1 className="lc-title">Territory</h1>
                  <span className="dv-row lc-sub" style={{ gap: "8px" }}>Turn on Checklist <NTV.Switch checked={v.checklist} onChange={v.setChecklist} label="Turn on checklist" /></span>
                </div>
                {v.canMerge ? (
                  <button type="button" className="lc-merge" onClick={v.openMerge}><NTV.Icon name="merge" size={v.i14} />{v.mergeLabel}</button>
                ) : (
                  <NTV.Button variant="primary" size="l" onClick={v.addTerritory} style={{ width: "100%", justifyContent: "center" }}>Add Territory</NTV.Button>
                )}
                <div className="lc-list">
                  {v.terrs.map((_t) => (
                    <div key={_t.id} className={'lc-terr' + (_t.picked ? ' is-on' : '')} onMouseEnter={_t.hover} onMouseLeave={_t.leave}>
                      {v.checklist ? <NTV.Checkbox checked={_t.picked} onChange={_t.check} /> : null}
                      <button type="button" className="lc-terr__btn" onClick={_t.pick} aria-pressed={_t.picked}>
                        <span className="lc-terr__body">
                          <strong>{_t.name}</strong>
                          <span className="lc-meta">
                            {_t.merged ? <span className="lc-badge">Merged</span> : null}
                            {_t.unassigned ? <span className="lc-badge lc-badge--un">Unassigned</span> : null}
                            {_t.avatars.map((_a) => (<span key={_a.id} className="dv-row" style={{ gap: "4px" }}><Avatar initials={_a.initials} color={_a.color} size={16} />{_t.avatars.length <= 2 ? _a.name : null}</span>))}
                          </span>
                          {_t.more ? <span className="lc-meta" style={{ marginTop: "4px" }}>{_t.more}<span className="lc-bad">{" • Add 1 to the selection"}</span></span> : null}
                        </span>
                        <NTV.Icon name="angle-right" size={v.i14} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </aside>

          {/* ---------------- Mode toggle ---------------- */}
          <div className={'lc-modes' + (v.rightOpen ? ' is-shifted' : '')} role="group" aria-label="Map mode">
            <NTV.Button variant={v.locMode ? 'primary' : 'secondary'} size="l" iconRight="location-dot" onClick={v.setMode('locator')} aria-pressed={v.locMode}>Locator</NTV.Button>
            <NTV.Button variant={v.terrMode ? 'primary' : 'secondary'} size="l" iconRight="map" onClick={v.setMode('territory')} aria-pressed={v.terrMode}>Territory</NTV.Button>
          </div>

          {/* ---------------- Right panel: Locator mode ---------------- */}
          {v.locMode && v.focus ? (
            <aside className="lc-right" aria-label="Territory">
              <div className="dv-row" style={{ gap: "8px" }}>
                <button type="button" className="lc-close" aria-label="Close territory panel" onClick={v.closeFocus}><NTV.Icon name="angle-right" size={v.i10} /></button>
                <h2 className="lc-h2">Territory</h2>
              </div>
              <div className="lc-box">
                <Kv k="Territory Name">{v.focus.name}</Kv>
                <Kv k="Assigned to">{v.focus.dealer}</Kv>
                <Kv k="State">{v.focus.state}</Kv>
                <Kv k="Longitude">{v.focus.lng}</Kv>
                <Kv k="Latitude">{v.focus.lat}</Kv>
                <Kv k="Total Area">{v.focus.area}</Kv>
                <Kv k="Created">{v.focus.created}</Kv>
              </div>
              {v.focus.unassigned ? (
                <div className="lc-box" style={{ alignItems: "center", textAlign: "center", gap: "10px" }}>
                  <strong style={{ fontSize: "14px" }}>Unassigned Territory</strong>
                  <p className="lc-warn">This territory has no dealer assigned yet. It won’t behave like a normal territory until you assign one.</p>
                  <NTV.Button variant="primary" size="m" onClick={v.assignDealer}>Assign Dealer</NTV.Button>
                </div>
              ) : (
                <>
                  <h3 className="lc-h3">Hosts</h3>
                  <div className="dv-row" style={{ gap: "8px" }}>
                    <NTV.Input size="m" placeholder="Search Host Name or Licenses" iconRight="magnifying-glass" label="Search hosts" value={v.hostQ} onChange={v.setHostQ} style={{ flex: "1", minWidth: "0" }} />
                    <FilterBy groups={v.hostFilterGroups} value={v.hostFilters} onChange={v.setHostFilters} align="right" iconOnly />
                  </div>
                  <div className="lc-list">
                    {v.hosts.map((_h) => (
                      <div key={_h.id} className={'lc-host' + (_h.open ? ' is-on' : '')}>
                        <div className="lc-host__top">
                          <button type="button" className="lc-host__pin" aria-label={'Show ' + _h.name + ' on the map'} onClick={_h.locate}>
                            <svg width="16" height="21" viewBox="0 0 26 34" aria-hidden="true"><path d="M13 0C5.8 0 0 5.6 0 12.6 0 22 13 34 13 34s13-12 13-21.4C26 5.6 20.2 0 13 0z" fill={_h.pin} /></svg>
                          </button>
                          <button type="button" className="lc-host__main" onClick={_h.locate}>
                            <span className="dv-row" style={{ gap: "6px", flexWrap: "wrap" }}><strong>{_h.name}</strong><span className={'lc-chip' + (_h.active ? '' : ' is-off')}>{_h.status}</span></span>
                            <span className="lc-meta">{_h.city}</span>
                          </button>
                          <button type="button" className="lc-host__lic" aria-expanded={_h.open} onClick={_h.toggle}><b>{_h.licN}</b>{" Licenses"}<NTV.Icon name={_h.open ? 'angle-up' : 'angle-down'} size={v.i12} /></button>
                        </div>
                        {_h.open ? (
                          <div className="lc-host__more">
                            <div><strong>Category:</strong><span>{_h.category}</span><strong style={{ marginTop: "6px" }}>Licenses:</strong>{_h.lics.map((_l) => (<span key={_l} className="dv-row" style={{ gap: "6px" }}><span className="dv-dot" style={{ background: "var(--success-main)" }} />{_l}</span>))}</div>
                          </div>
                        ) : null}
                        <div className="lc-host__foot"><span>‹</span><span>{_h.coords}</span></div>
                      </div>
                    ))}
                    {v.noHosts ? <p className="lc-empty">No hosts match.</p> : null}
                  </div>
                </>
              )}
            </aside>
          ) : null}

          {/* ---------------- Right panel: Territory mode ---------------- */}
          {v.terrMode && v.pick ? (
            <aside className="lc-right" aria-label="Territory details">
              <div className="dv-between" style={{ flexWrap: "nowrap" }}>
                <div className="dv-row" style={{ gap: "8px", minWidth: "0" }}>
                  <button type="button" className="lc-close" aria-label="Close territory details" onClick={v.clearPicks}><NTV.Icon name="angle-right" size={v.i10} /></button>
                  <h2 className="lc-h2" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.pick.count > 1 ? v.pick.count + ' territories selected' : v.pick.name}</h2>
                </div>
                <span style={{ position: "relative" }}>
                  <button type="button" className="lc-x" aria-label="Territory actions" aria-haspopup="menu" aria-expanded={v.menuOpen} onClick={v.toggleMenu}><NTV.Icon name="ellipsis" size={v.i14} /></button>
                  {v.menuOpen ? (
                    <div className="lc-menu" role="menu">
                      {v.menuItems.map((_m) => (<button key={_m.label} type="button" role="menuitem" className={'lc-mi' + (_m.danger ? ' is-danger' : '')} onClick={_m.run}><NTV.Icon name={_m.icon} size={v.i12} />{_m.label}</button>))}
                    </div>
                  ) : null}
                </span>
              </div>
              <div className="lc-box">
                <h3 className="lc-h3" style={{ marginBottom: "4px" }}>General Information</h3>
                <Kv k="State">{v.pick.state}</Kv>
                <Kv k="Assigned to">{v.pick.dealer}</Kv>
                <Kv k="Longitude">{v.pick.lng}</Kv>
                <Kv k="Latitude">{v.pick.lat}</Kv>
                <Kv k="Total Area">{v.pick.area}</Kv>
                <Kv k="Created">{v.pick.created}</Kv>
              </div>
              {v.donut && v.donut.empty ? (
                <div className="lc-box" style={{ gap: "6px" }}>
                  <h3 className="lc-h3">Hosts Overview</h3>
                  <p className="lc-empty" style={{ margin: "12px 0" }}>No hosts inside this territory yet.</p>
                </div>
              ) : null}
              {v.donut && !v.donut.empty ? (
                <div className="lc-box" style={{ gap: "12px" }}>
                  <h3 className="lc-h3">Hosts Overview</h3>
                  <div style={{ position: "relative", width: "200px", height: "200px", margin: "0 auto" }}>
                    <svg viewBox="0 0 100 100" width="200" height="200" role="img" aria-label="Hosts by category">
                      <g transform="rotate(-90 50 50)">
                        {v.donut.segs.map((_g) => (<circle key={_g.label} cx="50" cy="50" r="42" fill="none" stroke={_g.color} strokeWidth="16" strokeDasharray={_g.dash} strokeDashoffset={_g.off} />))}
                      </g>
                    </svg>
                    <div className="lc-donut-c"><strong>{v.donut.total}</strong><span>Total Hosts</span></div>
                  </div>
                  <div className="lc-legend">
                    {v.donut.segs.map((_g) => (<span key={_g.label}><span className="dv-dot" style={{ background: _g.color }} />{_g.label}</span>))}
                  </div>
                </div>
              ) : null}
            </aside>
          ) : null}

          {v.terrMode && !v.draft ? <div className="lc-hint" style={{ left: v.panel ? "416px" : "70px" }}><NTV.Icon name="circle-info" size={v.i12} />Shift + Click to select territories</div> : null}

          {v.draft ? (
            <div className="lc-drawbar" role="region" aria-label={v.draft.isDraw ? 'Drawing a territory' : 'Editing boundaries'}>
              <span className="lc-drawbar__txt">
                <strong>{v.draft.isDraw ? 'Drawing “' + v.draft.name + '”' : 'Editing “' + v.draft.name + '”'}</strong>
                <span>{v.draft.isDraw ? (v.draft.n < 3 ? 'Click on the map to add points (' + v.draft.n + ' so far, at least 3).' : v.draft.n + ' points · click the first point or Finish to close the shape.') : 'Drag the white points to reshape the boundary.'}</span>
              </span>
              {v.draft.isDraw ? <NTV.Button variant="secondary" size="m" iconLeft="arrow-left-long" disabled={!v.draft.n} onClick={v.undoPoint}>Undo</NTV.Button> : null}
              <NTV.Button variant="secondary" size="m" onClick={v.cancelDraft}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="m" disabled={!v.draft.canFinish} onClick={v.finishDraft}>{v.draft.isDraw ? 'Finish' : 'Save Changes'}</NTV.Button>
            </div>
          ) : null}

          {/* ---------------- Map controls ---------------- */}
          <div className={'lc-ctrls' + (v.rightOpen ? ' is-shifted' : '')}>
            <button type="button" aria-label="Zoom in" onClick={v.zoomIn}><NTV.Icon name="plus" size={v.i12} /></button>
            <button type="button" aria-label="Zoom out" onClick={v.zoomOut}><NTV.Icon name="minus" size={v.i12} /></button>
            <button type="button" aria-label="Fit all territories" onClick={v.fit}><NTV.Icon name="expand" size={v.i12} /></button>
            <button type="button" aria-label="Reset map" onClick={v.reset}><NTV.Icon name="arrows-rotate" size={v.i12} /></button>
          </div>

          {/* ---------------- Host popup ---------------- */}
          {v.popup.show ? (
            <div className="lc-pop" style={{ left: v.popup.left + "px", top: v.popup.top + "px" }} role="dialog" aria-label={v.popup.name} onClick={(e) => e.stopPropagation()}>
              <div className="dv-row" style={{ gap: "12px", alignItems: "flex-start" }}>
                <span className="lc-pop__img"><img src={v.popup.photo} alt="" /></span>
                <div style={{ flex: "1", minWidth: "0" }}>
                  <strong className="lc-pop__name">{v.popup.name}</strong>
                  <span className="dv-row" style={{ gap: "6px", marginTop: "4px" }}><span className={'lc-chip' + (v.popup.active ? '' : ' is-off')}>{v.popup.status}</span><span className="lc-chip lc-chip--info">{v.popup.category}</span></span>
                </div>
                <button type="button" className="lc-x" aria-label="Close" onClick={v.closePopup}><NTV.Icon name="x" size={v.i10} /></button>
              </div>
              <div className="lc-pop__sec">
                <strong>Operating Hours</strong>
                {v.popup.hours.map((_h) => (<div key={_h[0]} className="lc-kv lc-kv--sm"><span>{_h[0]}</span><span>{_h[1]}</span></div>))}
              </div>
              <div className="dv-row lc-meta" style={{ gap: "6px" }}><NTV.Icon name="location-dot" size={v.i12} />{v.popup.address}</div>
              <div className="lc-pop__coords"><span>{v.popup.coords}</span><button type="button" className="lc-x" aria-label="Copy coordinates" onClick={v.copyCoords}><NTV.Icon name="copy" size={v.i12} /></button></div>
              {v.popup.real ? (
                <a className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--l lc-pop__btn" href="DealerHostDetail.dc.html" onClick={v.popup.open} data-nav={v.popup.openNav}><span>View Host Details</span><NTV.Icon name="angle-right" size={v.i12} /></a>
              ) : (
                <NTV.Button variant="primary" size="l" iconRight="angle-right" onClick={v.demoHost} className="lc-pop__btn">View Host Details</NTV.Button>
              )}
            </div>
          ) : null}

          {v.modal ? (
            <div className="lc-mov" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && v.modal !== 'wait') v.closeModal(); }}>
              {v.modal === 'add' ? (
                <NTV.Modal title="Add Territory" width={500} onClose={v.closeModal} footer={<div className="lc-mfoot"><NTV.Button variant="secondary" size="xl" onClick={v.closeModal}>Cancel</NTV.Button><NTV.Button variant="primary" size="xl" disabled={!v.addReady} onClick={v.proceedAdd}>Proceed</NTV.Button></div>}>
                  <label className="lc-label" htmlFor="lc-fname">Territory Name</label>
                  <NTV.Input size="l" placeholder="e.g Aztech Foundations" label="Territory name" value={v.fName} onChange={v.setFName} error={v.fErr} />
                  {v.fErr ? <p className="lc-err" role="alert">Enter a territory name first.</p> : null}
                  <label className="lc-label" style={{ marginTop: "14px" }}>Assign Dealer</label>
                  <NTV.Select size="l" placeholder="Select Dealer" options={v.dealerOptions} value={v.fDealerName} onChange={v.setFDealer} />
                </NTV.Modal>
              ) : null}
              {v.modal === 'nodealer' ? (
                <NTV.StatusModal status="warning" title="No Dealer Assigned" actions={<><NTV.Button variant="secondary" size="xl" onClick={v.backToAdd}>Go Back</NTV.Button><NTV.Button variant="primary" size="xl" onClick={v.startDrawAnyway}>Proceed</NTV.Button></>}>No dealer selected. Are you sure you want to continue?</NTV.StatusModal>
              ) : null}
              {v.modal === 'overlap' ? (
                <NTV.StatusModal status="warning" title="Overlapping Territories" actions={<div className="lc-ovl-actions"><div className="lc-mfoot" style={{ justifyContent: "center" }}><NTV.Button variant="secondary" size="xl" onClick={v.redraw}>Redraw</NTV.Button><NTV.Button variant="primary" size="xl" onClick={v.clipOverlap}>Clip Overlapping Areas</NTV.Button></div><button type="button" className="lc-keep" onClick={v.keepOverlap}>Keep Overlapping Areas</button><span className="lc-sub">This territory will remain overlapping with the territories above.</span></div>}>
                  The boundaries you’ve drawn overlap with an existing territory. How do you want to proceed?
                  <span className="lc-alert"><span>Your territory overlaps with the following:</span>{v.overlapWith.map((_n) => (<strong key={_n}>{_n}</strong>))}</span>
                </NTV.StatusModal>
              ) : null}
              {v.modal === 'review' && v.review ? (
                <NTV.Modal title="Review Territory Details" width={500} onClose={v.closeModal} footer={<div className="lc-mfoot"><NTV.Button variant="secondary" size="xl" onClick={v.closeModal}>Cancel</NTV.Button><NTV.Button variant="primary" size="xl" onClick={v.saveReview}>Save</NTV.Button></div>}>
                  <div className="lc-review">
                    <div className="lc-kv"><span>Territory Name</span><span>{v.review.name}</span></div>
                    <div className="lc-kv"><span>State</span><span>{v.review.state}</span></div>
                    <div className="lc-kv"><span>Longitude</span><span>{v.review.lng}</span></div>
                    <div className="lc-kv"><span>Latitude</span><span>{v.review.lat}</span></div>
                    <div className="lc-kv"><span>Total Area</span><span>{v.review.area}</span></div>
                  </div>
                </NTV.Modal>
              ) : null}
              {v.modal === 'rename' ? (
                <NTV.Modal title="Rename Territory" width={500} onClose={v.closeModal} footer={<div className="lc-mfoot"><NTV.Button variant="secondary" size="xl" onClick={v.closeModal}>Cancel</NTV.Button><NTV.Button variant="primary" size="xl" disabled={!v.renameReady} onClick={v.doRename}>Rename</NTV.Button></div>}>
                  <NTV.Input size="l" label="Territory name" value={v.renameVal} onChange={v.setRename} />
                </NTV.Modal>
              ) : null}
              {v.modal === 'unassign' || v.modal === 'unassignMany' ? (
                <NTV.StatusModal status="warning" title={v.modal === 'unassign' ? 'Unassign Territory' : 'Unassign Selected Territories?'} actions={<><NTV.Button variant="secondary" size="xl" onClick={v.closeModal}>Cancel</NTV.Button><NTV.Button variant="primary" size="xl" onClick={v.doUnassign}>{v.modal === 'unassign' ? 'Unassign Territory' : 'Unassign Territories'}</NTV.Button></>}>
                  {v.modal === 'unassign' ? 'Are you sure you want to unassign “' + (v.pickNames[0] || '') + '” from its Dealer? This action cannot be undone.' : 'Are you sure you want to unassign the selected territories from their Dealers? This action cannot be undone.'}
                  {v.modal === 'unassignMany' ? <span className="lc-alert"><span>Territories Selected</span>{v.pickNames.map((_n) => (<strong key={_n}>{_n}</strong>))}</span> : null}
                </NTV.StatusModal>
              ) : null}
              {v.modal === 'delete' ? (
                <NTV.StatusModal status="warning" title="Delete Territory" actions={<><NTV.Button variant="secondary" size="xl" onClick={v.closeModal}>Cancel</NTV.Button><NTV.Button variant="primary" size="xl" onClick={v.doDelete}>Delete Territory</NTV.Button></>}>
                  {'Are you sure you want to delete “' + (v.pickNames[0] || '') + '”? Its boundary is removed from the map. This action cannot be undone.'}
                </NTV.StatusModal>
              ) : null}
              {v.modal === 'assign' ? (
                <NTV.Modal title="Assign Dealer" width={500} onClose={v.closeModal} footer={<div className="lc-mfoot"><NTV.Button variant="secondary" size="xl" onClick={v.closeModal}>Cancel</NTV.Button><NTV.Button variant="primary" size="xl" disabled={!v.assignReady} onClick={v.doAssign}>Assign</NTV.Button></div>}>
                  <NTV.Input size="l" placeholder="Search Dealer Name" iconRight="magnifying-glass" label="Search dealer name" value={v.assignQ} onChange={v.setAssignQ} />
                  <div className="lc-assign" role="listbox" aria-label="Dealers">
                    {v.assignList.map((_d) => (
                      <button key={_d.id} type="button" role="option" aria-selected={_d.on} className={'lc-dealer lc-dealer--opt' + (_d.on ? ' is-on' : '')} onClick={_d.pick}>
                        <Avatar initials={_d.initials} color={_d.color} active={_d.active} size={36} />
                        <span className="lc-dealer__body"><strong>{_d.name}</strong><span className="lc-meta"><span className={_d.active ? 'lc-ok' : 'lc-off'}>{_d.status}</span><i />{"Hosts "}<b>{_d.hosts}</b><i />{"Licenses "}<b>{_d.licenses}</b></span></span>
                        <span className="lc-check">{_d.on ? <NTV.Icon name="check" size={v.i10} /> : null}</span>
                      </button>
                    ))}
                  </div>
                </NTV.Modal>
              ) : null}
              {v.modal === 'merge' ? (
                <NTV.Modal title="Merge Territory" width={605} onClose={v.closeModal} footer={<div className="lc-mfoot"><NTV.Button variant="secondary" size="xl" onClick={v.closeModal}>Cancel</NTV.Button><NTV.Button variant="primary" size="xl" disabled={!v.mergeReady} onClick={v.doMerge}>Merge</NTV.Button></div>}>
                  <label className="lc-label">Add Territory Name & Color</label>
                  <div className="dv-row" style={{ gap: "8px", alignItems: "stretch" }}>
                    <span className="lc-swatches" role="radiogroup" aria-label="Territory colour">
                      {v.mergeColors.map((_c) => (<button key={_c.c} type="button" role="radio" aria-checked={_c.on} aria-label={'Colour ' + _c.c} className={'lc-sw' + (_c.on ? ' is-on' : '')} style={{ background: _c.c }} onClick={_c.pick} />))}
                    </span>
                    <NTV.Input size="l" placeholder="Territory name" label="Merged territory name" value={v.mergeName} onChange={v.setMergeName} style={{ flex: "1" }} />
                  </div>
                  <label className="lc-label" style={{ marginTop: "14px" }}>Territories Involved</label>
                  <div className="lc-thumbs">
                    {v.mergeThumbs.map((_m) => (<figure key={_m.id}><svg viewBox="0 0 200 200" width="100%" height="150" role="img" aria-label={_m.name}><path d={_m.d} fill={v.mergeColor} fillOpacity="0.75" stroke={v.mergeColor} strokeWidth="2" /></svg><figcaption>{_m.name}</figcaption></figure>))}
                  </div>
                  <p className="lc-note">The selected territories will become one territory on the map. You can review and adjust dealers, hosts, and boundaries after merging.</p>
                </NTV.Modal>
              ) : null}
              {v.modal === 'wait' ? (
                <div className="lc-loading" role="status"><span className="lc-spin" />Please Wait<span className="lc-sub">Please wait while our systems adjust.</span></div>
              ) : null}
              {v.modal === 'success' && v.success ? (
                <NTV.StatusModal status="success" title={v.success.title} actions={<NTV.Button variant="primary" size="xl" onClick={v.okSuccess}>Ok</NTV.Button>}>{v.success.text}</NTV.StatusModal>
              ) : null}
            </div>
          ) : null}

          {v.switching ? (
            <div className="lc-ov" role="status" aria-live="polite">
              <div className="lc-loading"><span className="lc-spin" />{v.switchLabel}<span className="lc-sub">This will only take a moment.</span></div>
            </div>
          ) : null}
        </section>
      </main>
      <Toast t={v.toast} />
    </div>
    </div>
));

/* Hand the map container ref to the template without changing the plain-JSX pattern. */
var _rv = Component.prototype.renderVals;
Component.prototype.renderVals = function () { var o = _rv.apply(this, arguments); o.__mapRef = this.mapEl; if (o.popup && o.popup.open && o.popup.open.nav) o.popup.openNav = o.popup.open.nav; return o; };

export default Component;
