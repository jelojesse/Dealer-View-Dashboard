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
 * Editing (draw / rename / merge / delete) comes in the next pass — those buttons only toast for now.
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
function hostsFor(t) {
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
  return HOSTS_BY_TERR[t.id] || [];
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
      mode: 'locator', switching: '', panel: true,
      dq: '', pickerOpen: false, selected: D.locDealers.slice(0, 10).map(function (d) { return d.id; }),
      vis: { merged: true, individual: true, unassigned: true },
      focus: '', hostQ: '', hostFilters: {}, openHost: '', popup: '',
      tq: '', checklist: false, hover: '', picks: [], tick: 0, toast: null
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
    map.on('move zoom', function () { if (self.state.popup) self.setState({ tick: self.state.tick + 1 }); });
    map.on('click', function () { if (self.state.popup) self.setState({ popup: '' }); });
    this._keyUp = function (e) { if (e.key === 'Escape') self.setState({ popup: '', pickerOpen: false }); };
    document.addEventListener('keydown', this._keyUp);
    this.drawLayers();
    setTimeout(function () { map.invalidateSize(); }, 50);
  }
  componentDidUpdate(prev, prevState) {
    var s = this.state, keys = ['mode', 'selected', 'vis', 'focus', 'hover', 'picks', 'hostFilters', 'hostQ', 'openHost', 'popup'];
    if (keys.some(function (k) { return prevState[k] !== s[k]; })) this.drawLayers();
    if (prevState.panel !== s.panel || prevState.focus !== s.focus || prevState.picks !== s.picks) { var m = this.map; setTimeout(function () { m && m.invalidateSize(); }, 0); }
  }
  componentWillUnmount() { if (this.map) this.map.remove(); this.map = null; document.removeEventListener('keydown', this._keyUp); if (this._tt) clearTimeout(this._tt); if (this._sw) clearTimeout(this._sw); }

  visibleTerritories() {
    var s = this.state, sel = s.selected;
    return D.locTerritories.filter(function (t) {
      if (!s.vis[t.kind]) return false;
      if (s.mode === 'territory') return true;
      return t.kind === 'unassigned' || t.dealers.some(function (id) { return sel.indexOf(id) !== -1; });
    });
  }
  focusedHosts() {
    var s = this.state, t = s.focus ? byId(D.locTerritories, s.focus) : null;
    if (!t || s.mode !== 'locator') return [];
    return hostsFor(t).filter(function (h) { return contains(h.name + ' ' + h.lics.join(' '), s.hostQ) && passes(s.hostFilters, 'status', h.status) && passes(s.hostFilters, 'state', h.st.charAt(0).toUpperCase() + h.st.slice(1)); });
  }
  drawLayers() {
    var self = this, s = this.state, map = this.map;
    if (!map) return;
    this.terrLayer.clearLayers(); this.pinLayer.clearLayers();
    var terrMode = s.mode === 'territory';
    this.visibleTerritories().forEach(function (t) {
      var k = KIND[t.kind], focused = s.focus === t.id, picked = s.picks.indexOf(t.id) !== -1, hovered = s.hover === t.id;
      var style = terrMode
        ? { color: k.color, weight: picked ? 2.5 : 1.5, fillColor: k.fill, fillOpacity: picked ? 0.78 : (hovered ? 0.28 : 0.12), opacity: 1 }
        : { color: k.color, weight: focused ? 3 : 2, fillColor: k.fill, fillOpacity: focused ? 0.08 : 0, opacity: 1 };
      var poly = L.polygon(t.outline, style).addTo(self.terrLayer);
      poly.bindTooltip(t.name, { className: 'lc-tip', direction: 'top', sticky: true, offset: [0, -10] });
      poly.on('mouseover', function () { if (self.state.mode === 'territory') self.setState({ hover: t.id }); });
      poly.on('mouseout', function () { if (self.state.hover === t.id) self.setState({ hover: '' }); });
      poly.on('click', function (e) { L.DomEvent.stopPropagation(e); self.pickTerritory(t.id, e.originalEvent && e.originalEvent.shiftKey); });
    });
    this.focusedHosts().forEach(function (h) {
      var big = s.popup === h.id || s.openHost === h.id;
      var m = L.marker([h.lat, h.lng], { icon: pinIcon(PIN[h.st], big), title: h.name, riseOnHover: true, zIndexOffset: big ? 1000 : 0, keyboard: true }).addTo(self.pinLayer);
      m.on('click', function (e) { L.DomEvent.stopPropagation(e); self.setState({ popup: h.id, openHost: h.id }); });
    });
  }
  fitTo(outlines, pad) {
    if (!this.map || !outlines.length) return;
    var b = L.latLngBounds([]); outlines.forEach(function (o) { b.extend(L.latLngBounds(o)); });
    var s = this.state, left = s.panel ? 372 : 80, right = (s.mode === 'locator' ? s.focus : s.picks.length) ? 310 : 80;
    this.map.flyToBounds(b, { paddingTopLeft: [left, 60], paddingBottomRight: [right, 60], duration: 0.8, maxZoom: pad || 11 });
  }
  pickTerritory(id, shift) {
    var s = this.state, t = byId(D.locTerritories, id);
    if (s.mode === 'locator') { this.setState({ focus: id, popup: '', openHost: '', hostQ: '', hostFilters: {} }, () => this.fitTo([t.outline])); return; }
    var picks = shift ? (s.picks.indexOf(id) !== -1 ? s.picks.filter(function (x) { return x !== id; }) : s.picks.concat([id])) : [id];
    this.setState({ picks: picks }, () => { if (!shift) this.fitTo([t.outline]); });
  }

  renderVals() {
    var self = this, s = this.state, terrMode = s.mode === 'territory';
    var sel = s.selected;
    var selDealers = sel.map(function (id) { return byId(D.locDealers, id); }).filter(Boolean);
    var focusT = s.focus ? byId(D.locTerritories, s.focus) : null;
    var hosts = this.focusedHosts();
    var popupHost = s.popup ? hostsFor(focusT || { id: '' }).filter(function (h) { return h.id === s.popup; })[0] : null;
    var pt = popupHost && this.map ? this.map.latLngToContainerPoint([popupHost.lat, popupHost.lng]) : null;
    var terrForDealer = function (did) { return D.locTerritories.filter(function (t) { return t.dealers.indexOf(did) !== -1; })[0]; };
    var pickedTs = s.picks.map(function (id) { return byId(D.locTerritories, id); }).filter(Boolean);
    var mainPick = pickedTs[pickedTs.length - 1];
    var donut = (function () {
      if (!mainPick) return null;
      var hs = hostsFor(mainPick), counts = {};
      (hs.length ? hs : D.hosts).forEach(function (h) { counts[h.category] = (counts[h.category] || 0) + 1; });
      var cats = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 8);
      var tot = cats.reduce(function (a, c) { return a + counts[c]; }, 0) || 1, C = 2 * Math.PI * 42, acc = 0;
      return { total: mainPick.id === 'lt1' ? 142 : Math.max(tot * 7, 12), segs: cats.map(function (c, i) { var len = counts[c] / tot * C, seg = { label: c, color: CAT_COLORS[i], dash: len.toFixed(2) + ' ' + C.toFixed(2), off: (-acc).toFixed(2) }; acc += len; return seg; }) };
    })();
    var terrList = D.locTerritories.filter(function (t) { return s.vis[t.kind] && contains(t.name + ' ' + dealerNames(t).join(' '), s.tq); });
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
      options: D.locDealers.filter(function (d) { return contains(d.name, s.dq); }).map(function (d) {
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
      assignDealer: function () { toast(self, 'Assigning dealers comes in the next pass', 'info'); },
      /* ---- Host popup ---- */
      popup: popupHost && pt ? { show: true, left: pt.x, top: pt.y, name: popupHost.name, photo: popupHost.photo, status: popupHost.status, active: popupHost.status === 'Active', category: popupHost.category,
        address: popupHost.address + ', ' + popupHost.city + (popupHost.zip ? ' ' + popupHost.zip : ''), coords: (+popupHost.lat).toFixed(7) + ', ' + (+popupHost.lng).toFixed(7), hours: HOURS,
        open: popupHost.real ? navFn('DealerHostDetail.dc.html', { id: popupHost.id }) : null, real: popupHost.real } : { show: false },
      closePopup: function () { self.setState({ popup: '' }); },
      copyCoords: function () { var c = popupHost ? (+popupHost.lat).toFixed(7) + ', ' + (+popupHost.lng).toFixed(7) : ''; try { navigator.clipboard.writeText(c); } catch (e) {} toast(self, 'Coordinates copied', 'info'); },
      demoHost: function () { toast(self, 'This sample host has no details page', 'info'); },
      /* ---- Territory mode ---- */
      tq: s.tq, setTq: function (x) { self.setState({ tq: val(x) }); },
      dealersSel: selDealers.length + ' dealers selected',
      checklist: s.checklist, setChecklist: function (on) { self.setState({ checklist: on }); },
      addTerritory: function () { toast(self, 'Drawing territories comes in the next pass', 'info'); },
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
              <div className="lc-picker" role="listbox" aria-label="Dealers" aria-multiselectable="true">
                <div className="dv-between" style={{ padding: "0 2px 6px" }}>
                  <span className="lc-sub">Select dealers to show</span>
                  <button type="button" className="lc-link" onClick={v.closePicker}>Done</button>
                </div>
                {v.options.map((_o) => (
                  <button key={_o.id} type="button" role="option" aria-selected={_o.on} className={'lc-dealer lc-dealer--opt' + (_o.on ? ' is-on' : '')} onClick={_o.toggle}>
                    <Avatar initials={_o.initials} color={_o.color} active={_o.active} size={36} />
                    <span className="lc-dealer__body">
                      <strong>{_o.name}</strong>
                      <span className="lc-meta"><span className={_o.active ? 'lc-ok' : 'lc-off'}>{_o.status}</span><i />{"Hosts "}<b>{_o.hosts}</b><i />{"Licenses "}<b>{_o.licenses}</b></span>
                    </span>
                    <span className="lc-check">{_o.on ? <NTV.Icon name="check" size={v.i10} /> : null}</span>
                  </button>
                ))}
                {v.options.length === 0 ? <p className="lc-empty">No dealers match “{v.dq}”.</p> : null}
              </div>
            ) : null}

            {v.panel && !v.pickerOpen && v.locMode ? (
              <>
                <div className="dv-between lc-head">
                  <h1 className="lc-title">Locator</h1>
                  <span className="lc-sub">{v.selCount}{" • "}<button type="button" className="lc-link" onClick={v.clearAll}>Clear all</button></span>
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
                  {v.noDealers ? <p className="lc-empty">No dealers selected. Use the search above to pick dealers.</p> : null}
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
                <NTV.Button variant="primary" size="l" onClick={v.addTerritory} style={{ width: "100%", justifyContent: "center" }}>Add Territory</NTV.Button>
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
                <button type="button" className="lc-x" aria-label="Territory actions" onClick={v.terrMenu}><NTV.Icon name="ellipsis" size={v.i14} /></button>
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
              {v.donut ? (
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

          {v.terrMode ? <div className="lc-hint" style={{ left: v.panel ? "380px" : "70px" }}><NTV.Icon name="circle-info" size={v.i12} />Shift + Click to select territories</div> : null}

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
