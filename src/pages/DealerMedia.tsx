// @ts-nocheck
/**
 * Page: Media Library  (route /media)
 * Converted from the Claude Design artboard DealerMedia.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, advsForHost, arrived, byId, contains, go, hostName, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import HostAdvFilter from '../components/HostAdvFilter';
import './DealerMedia.css';

/* ============================== Logic ============================== */

var FOLDERS = [
  { name: 'Food Assets', host: 'h1', adv: 'a2', created: 'Jun 19, 2026, 10:00 PM', modified: 'Jun 22, 2026, 12:00 PM' },
  { name: 'Promo Videos', host: 'h4', adv: 'a6', created: 'Jul 2, 2026, 9:15 AM', modified: 'Oct 30, 2026, 4:40 PM' },
  { name: 'Brand Logos', host: '', adv: 'a1', created: 'Jul 8, 2026, 1:20 PM', modified: 'Sep 2, 2026, 8:05 AM' },
  { name: 'Seasonal', host: 'h7', adv: '', created: 'Aug 1, 2026, 11:00 AM', modified: 'Nov 3, 2026, 2:10 PM' },
  { name: 'Menus', host: 'h3', adv: '', created: 'Aug 14, 2026, 3:30 PM', modified: 'Oct 18, 2026, 9:45 AM' },
  { name: 'Coffee Assets', host: 'h5', adv: 'a1', created: 'Sep 3, 2026, 10:10 AM', modified: 'Oct 21, 2026, 6:00 PM' },
  { name: 'Game Day Assets', host: 'h15', adv: 'a13', created: 'Sep 9, 2026, 7:00 PM', modified: 'Nov 1, 2026, 7:30 PM' },
  { name: 'Fitness Assets', host: 'h7', adv: 'a11', created: 'Sep 20, 2026, 8:00 AM', modified: 'Oct 12, 2026, 10:00 AM' },
  { name: 'Auto Assets', host: 'h9', adv: 'a10', created: 'Oct 2, 2026, 2:00 PM', modified: 'Oct 29, 2026, 11:20 AM' },
  { name: 'Holiday Assets', host: '', adv: '', created: 'Oct 25, 2026, 5:45 PM', modified: 'Nov 8, 2026, 3:15 PM' }
];
var BADGE = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] };
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerMedia.dc.html') || {};
    var media = D.media.map(function (m, i) { var o = Object.assign({}, m); if (i % 4 === 3) o.folder = FOLDERS[5 + (i % 5)].name; return o; });
    this.state = { media: media, folders: FOLDERS.map(function (x) { return Object.assign({}, x); }), type: f.type === 'Unused' ? 'Unused' : '', source: f.source || '', host: f.host || '', hostName: f.hostName || '', adv: '', asc: true, query: '', sel: {}, limit: 30,
      foldersOpen: true, mediaOpen: true, allFolders: false, panel: '', panelQ: '', menu: '', modal: '', open: '', dtab: 'Reports', cf: null, fd: null, ra: null, mv: null, up: null, filterOpen: false, toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); if (this._ut) clearInterval(this._ut); }
  renderVals() {
    var self = this, s = this.state;
    var hostAdvIds = s.host ? advsForHost(s.host).map(function (a) { return a.id; }) : null;
    var advObj = s.adv ? D.advertisers.filter(function (a) { return a.name === s.adv; })[0] : null;
    var list = s.media.filter(function (m) {
      if (s.type === 'Unused' && m.used) return false;
      if (['Images', 'Videos', 'Widgets'].indexOf(s.type) !== -1 && m.kind + 's' !== s.type.toLowerCase()) return false;
      if (s.source && m.source !== s.source) return false;
      if (s.host && !(m.host === s.host || hostAdvIds.indexOf(m.adv) !== -1)) return false;
      if (advObj && m.adv !== advObj.id) return false;
      return contains(m.title, s.query);
    }).sort(function (a, b) { return s.asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title); });
    var panelOpen = !!s.panel;
    var vis = list.slice(0, s.limit);
    var selIds = Object.keys(s.sel).filter(function (k) { return s.sel[k]; });
    var close = function () { self.setState({ modal: '', cf: null, fd: null, ra: null, mv: null }); };
    var card = function (m) { var b = BADGE[m.kind] || BADGE.image; return { image: m.image, title: m.title, badge: b[0], badgeColor: b[1], open: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ modal: 'detail', open: m.id, dtab: 'Reports' }); } }; };
    var dm = byId(s.media, s.open);
    var pls = dm ? D.playlists.filter(function (p) { return p.items.indexOf(dm.id) !== -1; }) : [];
    var where = []; pls.forEach(function (p) { p.screens.forEach(function (sid) { var sc = byId(D.screens, sid); if (sc && !where.some(function (w) { return w.id === sid; })) where.push(sc); }); });
    var chipsOn = [];
    if (s.host) chipsOn.push({ label: 'Host: ' + s.hostName, clear: function () { self.setState({ host: '', hostName: '', adv: '' }); } });
    if (s.adv) chipsOn.push({ label: 'Advertiser: ' + s.adv, clear: function () { self.setState({ adv: '' }); } });
    if (s.source) chipsOn.push({ label: 'Source: ' + s.source, clear: function () { self.setState({ source: '' }); } });
    var pf = s.folders.filter(function (f) { return f.name === s.panel; })[0];
    var pItems = pf ? s.media.filter(function (m) { return m.folder === pf.name && contains(m.title, s.panelQ); }) : [];
    var up = s.up || { step: 0, host: '', adv: '', pls: {}, files: [] };
    var upHost = D.hosts.filter(function (h) { return h.name === up.host; })[0];
    var upAdvs = upHost ? advsForHost(upHost.id) : [];
    var setUp = function (o) { self.setState({ up: Object.assign({}, self.state.up, o) }); };
    var ra = s.ra || { name: '', host: '', adv: '' };
    var raHost = D.hosts.filter(function (h) { return h.name === ra.host; })[0];
    var seed = dm ? parseInt(dm.id.slice(1), 10) || 3 : 3;
    var bars = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map(function (d, i) { var v = dm && dm.used ? 40 + ((seed * 37 + i * 53) % 90) : 0; return { d: d, v: v, h: Math.round(v / 130 * 120) + 2 }; });
    var foldersShown = s.allFolders ? s.folders : s.folders.slice(0, 10);
    var mv = s.mv || {};
    var doUpload = function () {
      var u = self.state.up, n = 3;
      var files = ['Holiday Banner.jpg', 'Promo Loop.mp4', 'Weekend Specials.jpg'].map(function (x) { return { name: x, pct: 0 }; });
      setUp({ step: 2, files: files });
      if (self._ut) clearInterval(self._ut);
      self._ut = setInterval(function () {
        var cur = self.state.up; if (!cur) { clearInterval(self._ut); return; }
        var fs = cur.files.map(function (f) { return { name: f.name, pct: Math.min(100, f.pct + 34) }; });
        if (fs.every(function (f) { return f.pct >= 100; })) {
          clearInterval(self._ut);
          var hst = D.hosts.filter(function (h) { return h.name === cur.host; })[0], ad = D.advertisers.filter(function (a) { return a.name === cur.adv; })[0];
          var add = fs.map(function (f, i) { var vid = /mp4$/.test(f.name); return { id: 'mu' + Date.now() + i, title: f.name, kind: vid ? 'video' : 'image', image: vid ? D.B.advert : D.B.oranges, source: ad ? 'Advertisers' : (hst ? 'Hosts' : 'Others'), used: Object.keys(cur.pls).some(function (k) { return cur.pls[k]; }), adv: ad ? ad.id : null, host: hst ? hst.id : null, folder: self.state.panel || '', uploaded: 'Nov 10, 2026', size: vid ? '24.1 MB' : '2.3 MB', duration: vid ? '30 sec' : '15 sec' }; });
          self.setState({ media: add.concat(self.state.media), modal: '', up: null });
          toast(self, n + ' assets Added');
          return;
        }
        setUp({ files: fs });
      }, 350);
    };
    return {
      none: null, i10: 10, i12: 12, i14: 14, i16: 16, i18: 18, w460: 460, w500: 500, w900: 900,
      stats: [['Contents', 'All upload media across categories', D.totals.content.toLocaleString(), 'folder', 'red-orange', '', '-8.3%', '+8.3%'], ['Videos', 'Includes .mp4, .mov, and other video formats.', '412', 'video', 'warning', 'Videos', '-4.1%', '+6.2%'], ['Images', 'Image assets used for ad displays.', '698', 'image', 'info', 'Images', '-2.7%', '+9.8%'], ['Widgets', 'External sources and dynamic media outputs.', '130', 'rss', 'teal', 'Widgets', '-1.5%', '+3.1%']].map(function (k) {
        return { label: k[0], desc: k[1], value: k[2], icon: k[3], tone: k[4], last: k[6], this: k[7], border: s.type === k[5] && k[5] ? 'var(--accent-action)' : 'var(--container-border)', pick: function () { self.setState({ type: self.state.type === k[5] ? '' : k[5] }); } };
      }),
      typeOptions: ['All Types', 'Images', 'Videos', 'Widgets', 'Unused'], typeValue: s.type || '',
      setType: function (v) { var x = val(v); self.setState({ type: x === 'All Types' ? '' : x }); },
      sortLabel: s.asc ? 'Ascending' : 'Descending', toggleSort: function () { self.setState({ asc: !self.state.asc }); },
      chipsOn: chipsOn,
      query: s.query, setQuery: function (v) { self.setState({ query: val(v) }); },
      noSel: selIds.length === 0,
      foldersOpen: s.foldersOpen, foldersIcon: s.foldersOpen ? 'angle-down' : 'angle-right', toggleFolders: function () { self.setState({ foldersOpen: !self.state.foldersOpen }); },
      mediaOpen: s.mediaOpen, mediaIcon: s.mediaOpen ? 'angle-down' : 'angle-right', toggleMedia: function () { self.setState({ mediaOpen: !self.state.mediaOpen }); },
      folderCount: s.folders.length, viewAllLabel: s.allFolders ? 'View less' : 'View all', toggleAllFolders: function () { self.setState({ allFolders: !self.state.allFolders }); },
      folderCols: panelOpen ? 5 : 5,
      folders: foldersShown.map(function (f) {
        var on = s.panel === f.name;
        return { name: f.name, cls: on ? 'on' : '', icon: on ? 'folder-solid' : 'folder', menuOpen: s.menu === f.name,
          open: function () { self.setState({ panel: on ? '' : f.name, panelQ: '' }); },
          menu: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ menu: self.state.menu === f.name ? '' : f.name }); },
          rename: function () { self.setState({ menu: '', modal: 'folder', fd: { mode: 'rename', old: f.name, name: f.name } }); },
          reassign: function () { var h = byId(D.hosts, f.host), a = byId(D.advertisers, f.adv); self.setState({ menu: '', modal: 'reassign', ra: { name: f.name, host: h ? h.name : '', adv: a ? a.name : '' } }); },
          duplicate: function () { var copy = Object.assign({}, f, { name: f.name + ' Copy', created: 'Nov 10, 2026, 9:55 AM', modified: 'Nov 10, 2026, 9:55 AM' }); var fs = self.state.folders.slice(); fs.splice(fs.indexOf(f) + 1, 0, copy); self.setState({ menu: '', folders: fs }); toast(self, 'Folder “' + copy.name + '” Created'); },
          remove: function () { var n = self.state.media.filter(function (m) { return m.folder === f.name; }).length; self.setState({ menu: '', modal: 'confirm', cf: { title: 'Delete Folder?', text: 'Delete “' + f.name + '”? Its ' + n + ' file(s) stay in your Media Library.', act: 'folder', key: f.name } }); } };
      }),
      menuOpen: !!s.menu, closeMenu: function () { self.setState({ menu: '' }); },
      stop: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); },
      mediaCount: list.length, mediaCols: panelOpen ? 6 : 10,
      items: vis.map(function (m) { var c = card(m); c.checked = !!s.sel[m.id]; c.cls = s.sel[m.id] ? 'sel' : ''; c.toggle = function () { var o = Object.assign({}, self.state.sel); o[m.id] = !o[m.id]; self.setState({ sel: o }); }; return c; }),
      empty: list.length === 0, shown: vis.length, matched: list.length, hasMore: list.length > vis.length,
      more: function () { self.setState({ limit: self.state.limit + 20 }); },
      panel: pf ? { open: true, name: pf.name, host: (byId(D.hosts, pf.host) || {}).name || 'Not assigned', adv: (byId(D.advertisers, pf.adv) || {}).name || 'Not assigned', created: pf.created, modified: pf.modified,
        count: s.media.filter(function (m) { return m.folder === pf.name; }).length, items: pItems.slice(0, 15).map(card), shown: Math.min(15, pItems.length), empty: pItems.length === 0 } : { open: false },
      closePanel: function () { self.setState({ panel: '' }); },
      panelQ: s.panelQ, setPanelQ: function (v) { self.setState({ panelQ: val(v) }); },
      openAddToFolder: function () { self.setState({ modal: 'move', mv: { mode: 'pick', to: self.state.panel, pick: {} } }); },
      filterOpen: s.filterOpen, openFilter: function () { self.setState({ filterOpen: true }); }, closeFilter: function () { self.setState({ filterOpen: false }); },
      applyFilter: function (x) { self.setState({ filterOpen: false, host: x.host, hostName: x.hostName, adv: x.adv || '' }); },
      m: { detail: s.modal === 'detail', confirm: s.modal === 'confirm', folder: s.modal === 'folder', reassign: s.modal === 'reassign', move: s.modal === 'move', upload: s.modal === 'upload' },
      closeModal: close,
      d: dm ? { title: dm.title, image: dm.image, kind: dm.kind, size: dm.size, duration: dm.duration || '—', uploaded: dm.uploaded, folder: dm.folder || '—', owner: dm.adv ? byId(D.advertisers, dm.adv).name : (dm.host ? hostName(dm.host) : 'Ibanez Lighting'),
        plays: bars.reduce(function (a, b) { return a + b.v; }, 0),
        playlists: pls.map(function (p) { return { name: p.name, screens: p.screens.length + ' screen(s)', open: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) }; }), noPlaylists: pls.length === 0,
        where: where.map(function (sc) { return { screen: sc.name, host: hostName(sc.host), lic: sc.lic.length + ' license(s)', open: navFn('DealerScreenDetail.dc.html', { id: sc.id }) }; }), noWhere: where.length === 0 } : {},
      dTabs: [['Reports', 'Reports'], ['In Playlist', 'In Playlist (' + pls.length + ')'], ['Playing Where', 'Playing Where (' + where.length + ')']].map(function (t) { return { label: t[1], on: s.dtab === t[0], pick: function () { self.setState({ dtab: t[0] }); } }; }),
      dt: { reports: s.dtab === 'Reports', playlists: s.dtab === 'In Playlist', where: s.dtab === 'Playing Where' },
      bars: bars,
      askDelete: function () { self.setState({ modal: 'confirm', cf: { title: 'Delete File?', text: dm.used ? dm.title + ' is in ' + pls.length + ' playlist(s) playing on ' + where.length + ' screen(s). Deleting removes it from all of them.' : 'Delete ' + dm.title + '? It isn’t used anywhere. This can’t be undone.', act: 'files', ids: [dm.id] } }); },
      askBulkDelete: function () { var used = self.state.media.filter(function (m) { return selIds.indexOf(m.id) !== -1 && m.used; }).length; self.setState({ modal: 'confirm', cf: { title: 'Delete ' + selIds.length + ' File(s)?', text: used ? used + ' of these are used in playlists. Deleting removes them from those playlists and the screens playing them.' : 'These files aren’t used anywhere. This can’t be undone.', act: 'files', ids: selIds } }); },
      cf: s.cf || { title: '', text: '' },
      cfOk: function () {
        var c = self.state.cf;
        if (c.act === 'folder') { self.setState({ folders: self.state.folders.filter(function (f) { return f.name !== c.key; }), media: self.state.media.map(function (m) { return m.folder === c.key ? Object.assign({}, m, { folder: '' }) : m; }), panel: self.state.panel === c.key ? '' : self.state.panel, modal: '', cf: null }); toast(self, 'Folder deleted'); }
        else { self.setState({ media: self.state.media.filter(function (m) { return c.ids.indexOf(m.id) === -1; }), sel: {}, modal: '', cf: null, open: '' }); toast(self, c.ids.length + ' file(s) deleted'); }
      },
      newFolder: function () { self.setState({ modal: 'folder', fd: { mode: 'new', name: '' } }); },
      fd: s.fd ? { title: s.fd.mode === 'new' ? 'New Folder' : 'Rename Folder', sub: s.fd.mode === 'new' ? 'Group your media into a folder' : 'Give this folder a new name', ok: s.fd.mode === 'new' ? 'Create Folder' : 'Save Changes', name: s.fd.name, bad: !s.fd.name.trim(),
        set: function (v) { self.setState({ fd: Object.assign({}, self.state.fd, { name: val(v) }) }); },
        save: function () { var x = self.state.fd, n = x.name.trim();
          if (x.mode === 'new') { self.setState({ folders: [{ name: n, host: '', adv: '', created: 'Nov 10, 2026, 9:55 AM', modified: 'Nov 10, 2026, 9:55 AM' }].concat(self.state.folders), modal: '', fd: null }); toast(self, 'Folder “' + n + '” Created'); }
          else { self.setState({ folders: self.state.folders.map(function (f) { return f.name === x.old ? Object.assign({}, f, { name: n, modified: 'Nov 10, 2026, 9:55 AM' }) : f; }), media: self.state.media.map(function (m) { return m.folder === x.old ? Object.assign({}, m, { folder: n }) : m; }), panel: self.state.panel === x.old ? n : self.state.panel, modal: '', fd: null }); toast(self, 'Folder renamed'); } } } : { title: '', sub: '', ok: '', name: '', bad: true },
      hostOptions: D.hosts.map(function (h) { return h.name; }),
      ra: { name: ra.name, host: ra.host, adv: ra.adv, noHost: !raHost, advs: raHost ? advsForHost(raHost.id).map(function (a) { return a.name; }) : [],
        setHost: function (v) { self.setState({ ra: Object.assign({}, self.state.ra, { host: val(v), adv: '' }) }); },
        setAdv: function (v) { self.setState({ ra: Object.assign({}, self.state.ra, { adv: val(v) }) }); },
        save: function () { var r = self.state.ra, h = D.hosts.filter(function (x) { return x.name === r.host; })[0], a = D.advertisers.filter(function (x) { return x.name === r.adv; })[0];
          self.setState({ folders: self.state.folders.map(function (f) { return f.name === r.name ? Object.assign({}, f, { host: h ? h.id : '', adv: a ? a.id : '', modified: 'Nov 10, 2026, 9:55 AM' }) : f; }), modal: '', ra: null }); toast(self, '“' + r.name + '” reassigned to ' + r.host); } },
      openMove: function () { self.setState({ modal: 'move', mv: { mode: 'bulk', to: '' } }); },
      mv: mv.mode === 'pick' ? {
        title: 'Add Files to ' + mv.to, sub: 'Pick files from your library to add to this folder', ok: 'Add Files', bad: !Object.keys(mv.pick).some(function (k) { return mv.pick[k]; }),
        options: s.media.filter(function (m) { return m.folder !== mv.to; }).slice(0, 12).map(function (m) { return { name: m.title, cls: mv.pick[m.id] ? 'on' : '', pick: function () { var p = Object.assign({}, self.state.mv.pick); p[m.id] = !p[m.id]; self.setState({ mv: Object.assign({}, self.state.mv, { pick: p }) }); } }; }),
        go: function () { var ids = Object.keys(self.state.mv.pick).filter(function (k) { return self.state.mv.pick[k]; }), to = self.state.mv.to; self.setState({ media: self.state.media.map(function (m) { return ids.indexOf(m.id) !== -1 ? Object.assign({}, m, { folder: to }) : m; }), modal: '', mv: null }); toast(self, ids.length + (ids.length === 1 ? ' asset' : ' assets') + ' Added'); }
      } : {
        title: 'Bulk Move', sub: 'Move ' + selIds.length + ' selected file(s) to a folder', ok: 'Move Files', bad: !mv.to,
        options: s.folders.map(function (f) { return { name: f.name, cls: mv.to === f.name ? 'on' : '', pick: function () { self.setState({ mv: Object.assign({}, self.state.mv, { to: f.name }) }); } }; }),
        go: function () { var to = self.state.mv.to; self.setState({ media: self.state.media.map(function (m) { return selIds.indexOf(m.id) !== -1 ? Object.assign({}, m, { folder: to }) : m; }), sel: {}, modal: '', mv: null }); toast(self, selIds.length + (selIds.length === 1 ? ' asset' : ' assets') + ' moved to ' + to); }
      },
      openUpload: function () { self.setState({ modal: 'upload', up: { step: 0, host: '', adv: '', pls: {}, files: [] } }); },
      up: {
        isAssign: up.step === 0, isPlaylist: up.step === 1, isUploading: up.step === 2, busy: up.step === 2,
        sub: up.step === 0 ? 'Assign the content to a host and advertiser' : (up.step === 1 ? 'Select a playlist to add this content' : 'Uploading your files…'),
        host: up.host, adv: up.adv, setHost: function (v) { setUp({ host: val(v), adv: '' }); }, setAdv: function (v) { setUp({ adv: val(v) }); },
        hasAdvs: upAdvs.length > 0, noAdvs: !!upHost && upAdvs.length === 0, advs: upAdvs.map(function (a) { return a.name; }),
        playlists: D.playlists.map(function (p) { return { name: p.name, on: !!up.pls[p.id], toggle: function () { var o = Object.assign({}, self.state.up.pls); o[p.id] = !o[p.id]; setUp({ pls: o }); } }; }),
        files: up.files,
        blocked: (up.step === 0 && !upHost) || up.step === 2,
        nextLabel: up.step === 0 ? 'Next' : 'Upload',
        skip: function () { if (self.state.up.step === 0) setUp({ step: 1, host: '', adv: '' }); else doUpload(); },
        next: function () { if (self.state.up.step === 0) setUp({ step: 1 }); else doUpload(); }
      },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerMedia.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-media" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="content" activeItem="Media Library" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between">
            <h1 className="dv-h1" style={{ fontSize: "20px", lineHeight: "32px" }}>Media Library</h1>
            <div className="dv-row">
              <NTV.Button variant="secondary" size="xl" iconRight="folder-plus" onClick={v.newFolder}>New Folder</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight="arrow-up-from-bracket" onClick={v.openUpload}>Upload Media</NTV.Button>
            </div>
          </div>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }}>
            {(v.stats || []).map((_k, $index) => (
              <React.Fragment key={$index}>
                <button type="button" className="dv-card ml-stat" onClick={_k?.pick} style={{ cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: "var(--fg-primary)", borderColor: `${s(_k?.border)}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", width: "100%" }}>
                    <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                      <NTV.IconTile icon={_k?.icon} tone={_k?.tone} />
                      <div>
                        <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>{_k?.label}</p>
                        <p className="dv-sub" style={{ fontSize: "11px" }}>{_k?.desc}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "26px", lineHeight: "36px", fontWeight: "700" }}>{_k?.value}</span>
                  </div>
                  <div className="dv-between" style={{ width: "100%", fontSize: "12px" }}>
                    <span className="dv-row" style={{ gap: "8px" }}>
                      {"Last Week "}
                      <NTV.Trend direction="down">{_k?.last}</NTV.Trend>
                    </span>
                    <span className="dv-row" style={{ gap: "8px" }}>
                      {"This Week "}
                      <NTV.Trend direction="up">{_k?.this}</NTV.Trend>
                    </span>
                  </div>
                </button>
              </React.Fragment>
            ))}
          </section>
          <div className="dv-between">
            <div className="dv-row" style={{ flexWrap: "wrap", gap: "12px" }}>
              <div style={{ width: "210px", flex: "none" }}>
                <NTV.Select size="l" placeholder="Media Type" options={v.typeOptions} value={v.typeValue} onChange={v.setType} />
              </div>
              <NTV.Button variant="secondary" size="xl" iconRight="arrow-down-a-z" onClick={v.toggleSort}>{v.sortLabel}</NTV.Button>
              <NTV.Button variant="secondary" size="xl" iconRight="user" onClick={v.openFilter}>Filter By User</NTV.Button>
              {(v.chipsOn || []).map((_c, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className="dv-chip" aria-pressed="true" onClick={_c?.clear}>
                    <span>{_c?.label}</span>
                    <NTV.Icon name="x" size={v.i10} />
                  </button>
                </React.Fragment>
              ))}
            </div>
            <div className="dv-row" style={{ gap: "12px" }}>
              <NTV.Input size="l" placeholder="Search Images, Videos or Widgets" iconLeft="magnifying-glass" iconRight="sparkles" label="Search media" value={v.query} onChange={v.setQuery} style={{ width: "400px" }} />
              <NTV.Button variant="primary" size="xl" iconRight="arrows-rotate" disabled={v.noSel} onClick={v.openMove}>Bulk Move</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight="trash" disabled={v.noSel} onClick={v.askBulkDelete}>Bulk Delete</NTV.Button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <section className="dv-card" style={{ flex: "1 1 0", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between">
                <button type="button" className="ml-sec" onClick={v.toggleFolders}>
                  <NTV.Icon name={v.foldersIcon} size={v.i12} />
                  {"Folders "}
                  <span className="dv-sub" style={{ fontSize: "14px" }}>({v.folderCount})</span>
                </button>
                <button type="button" className="dv-a" onClick={v.toggleAllFolders} style={{ fontSize: "12px", fontWeight: "500" }}>{v.viewAllLabel}{" ›"}</button>
              </div>
              {v.foldersOpen ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${s(v.folderCols)}, minmax(0, 1fr))`, gap: "10px" }}>
                  {(v.folders || []).map((_f, $index) => (
                    <React.Fragment key={$index}>
                      <div className={`ml-folder ${s(_f?.cls)}`} onClick={_f?.open}>
                        <NTV.Icon name={_f?.icon} size={v.i16} />
                        <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_f?.name}</span>
                        <button type="button" className="dv-ib" aria-label="Folder options" onClick={_f?.menu}>
                          <NTV.Icon name="ellipsis" size={v.i14} style={{ transform: "rotate(90deg)" }} />
                        </button>
                        {_f?.menuOpen ? (
                          <>
                            <div className="dv-menu" role="menu" onClick={v.stop} style={{ top: "44px", right: "0", minWidth: "170px" }}>
                            <button type="button" className="dv-mi" onClick={_f?.rename} style={{ color: "var(--accent-action)" }}>
                              <NTV.Icon name="pencil" size={v.i12} />
                              <span style={{ color: "var(--fg-primary)" }}>Rename</span>
                            </button>
                            <button type="button" className="dv-mi" onClick={_f?.reassign} style={{ color: "var(--accent-action)" }}>
                              <NTV.Icon name="arrows-rotate" size={v.i12} />
                              <span style={{ color: "var(--fg-primary)" }}>Reassign</span>
                            </button>
                            <button type="button" className="dv-mi" onClick={_f?.duplicate} style={{ color: "var(--accent-action)" }}>
                              <NTV.Icon name="copy" size={v.i12} />
                              <span style={{ color: "var(--fg-primary)" }}>Duplicate</span>
                            </button>
                            <button type="button" className="dv-mi dv-danger" onClick={_f?.remove}>
                              <NTV.Icon name="trash" size={v.i12} />
                              Delete
                            </button>
                          </div>
                          </>
                        ) : null}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                </>
              ) : null}
              <button type="button" className="ml-sec" onClick={v.toggleMedia}>
                <NTV.Icon name={v.mediaIcon} size={v.i12} />
                {"Media Contents "}
                <span className="dv-sub" style={{ fontSize: "14px" }}>({v.mediaCount})</span>
              </button>
              {v.mediaOpen ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${s(v.mediaCols)}, minmax(0, 1fr))`, gap: "12px" }}>
                  {(v.items || []).map((_m, $index) => (
                    <React.Fragment key={$index}>
                      <div className={`ml-card ${s(_m?.cls)}`} onClick={_m?.toggle}>
                        <div className="dv-thumb" style={{ aspectRatio: "16 / 10", borderRadius: "0" }}>
                          <img src={_m?.image} alt="" />
                          <span className="ml-badge" style={{ color: `${s(_m?.badgeColor)}` }}>{_m?.badge}</span>
                          {_m?.checked ? (
                            <>
                              <span className="ml-check"><NTV.Icon name="check" size={v.i10} /></span>
                            </>
                          ) : null}
                        </div>
                        <div className="dv-row" style={{ gap: "4px", padding: "6px 4px 6px 8px" }}>
                          <span style={{ flex: "1", minWidth: "0", fontSize: "11px", lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_m?.title}</span>
                          <button type="button" className="dv-ib" style={{ width: "22px", height: "22px", color: "var(--fg-secondary)" }} aria-label="View details" onClick={_m?.open}><NTV.Icon name="eye" size={v.i12} /></button>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                  {v.empty ? (
                  <>
                    <div className="dv-empty">No media match these filters.</div>
                  </>
                ) : null}
                </>
              ) : null}
              <div className="dv-between">
                <span className="dv-sub" style={{ fontSize: "11px" }}>{"Showing "}{v.shown}{" of "}{v.matched}{" items"}</span>
                {v.hasMore ? (
                  <>
                    <button type="button" className="dv-a" onClick={v.more} style={{ fontSize: "11px", fontWeight: "500", color: "var(--fg-primary)" }}>Show More...</button>
                  </>
                ) : null}
              </div>
            </section>
            {v.panel?.open ? (
              <>
                <aside className="dv-card" style={{ flex: "none", width: "500px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="dv-between" style={{ flexWrap: "nowrap" }}>
                  <h2 className="dv-row" style={{ margin: "0", gap: "10px", fontSize: "18px", lineHeight: "28px", fontWeight: "700", color: "var(--accent-action)" }}>
                    <NTV.Icon name="folder" size={v.i18} />
                    {v.panel?.name}
                  </h2>
                  <button type="button" className="dv-ib" aria-label="Close folder" onClick={v.closePanel}><NTV.Icon name="x" size={v.i16} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px", paddingBottom: "14px", borderBottom: "1px solid var(--container-border)" }}>
                  <div className="dv-kv">
                    <span style={{ color: "var(--fg-primary)", fontWeight: "600" }}>Assigned Host</span>
                    <span style={{ fontWeight: "400", fontSize: "12px", color: "var(--fg-secondary)" }}>{v.panel?.host}</span>
                  </div>
                  <div className="dv-kv">
                    <span style={{ color: "var(--fg-primary)", fontWeight: "600" }}>Assigned Advertiser</span>
                    <span style={{ fontWeight: "400", fontSize: "12px", color: "var(--fg-secondary)" }}>{v.panel?.adv}</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                  <div className="dv-kv">
                    <span style={{ color: "var(--fg-primary)", fontWeight: "600" }}>Date Created</span>
                    <span style={{ fontWeight: "400", fontSize: "12px", color: "var(--fg-secondary)" }}>{v.panel?.created}</span>
                  </div>
                  <div className="dv-kv">
                    <span style={{ color: "var(--fg-primary)", fontWeight: "600" }}>Date Modified</span>
                    <span style={{ fontWeight: "400", fontSize: "12px", color: "var(--fg-secondary)" }}>{v.panel?.modified}</span>
                  </div>
                </div>
                <div className="dv-between">
                  <span style={{ fontSize: "14px" }}>
                    {"Media Contents "}
                    <span className="dv-sub" style={{ display: "inline" }}>({v.panel?.count})</span>
                  </span>
                  <NTV.Input size="l" placeholder="Search Images, Videos or Widgets" iconLeft="magnifying-glass" label="Search folder" value={v.panelQ} onChange={v.setPanelQ} style={{ width: "260px" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px" }}>
                  <button type="button" className="ml-add" aria-label="Add files to folder" onClick={v.openAddToFolder}><NTV.Icon name="plus" size={v.i18} /></button>
                  {(v.panel?.items || []).map((_m, $index) => (
                    <React.Fragment key={$index}>
                      <div className="ml-card" style={{ cursor: "default" }}>
                        <div className="dv-thumb" style={{ aspectRatio: "16 / 10", borderRadius: "0" }}>
                          <img src={_m?.image} alt="" />
                          <span className="ml-badge" style={{ color: `${s(_m?.badgeColor)}` }}>{_m?.badge}</span>
                        </div>
                        <div className="dv-row" style={{ gap: "2px", padding: "4px 2px 4px 6px" }}>
                          <span style={{ flex: "1", minWidth: "0", fontSize: "10px", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_m?.title}</span>
                          <button type="button" className="dv-ib" style={{ width: "20px", height: "20px", color: "var(--fg-secondary)" }} aria-label="View details" onClick={_m?.open}><NTV.Icon name="eye" size={v.i10} /></button>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {v.panel?.empty ? (
                  <>
                    <p className="dv-sub">This folder is empty. Use + to add files.</p>
                  </>
                ) : null}
                <span className="dv-sub" style={{ fontSize: "11px" }}>{"Showing "}{v.panel?.shown}{" of "}{v.panel?.count}{" items"}</span>
              </aside>
              </>
            ) : null}
          </div>
        </main>
      </div>
      {v.menuOpen ? (
        <>
          <div aria-hidden="true" onClick={v.closeMenu} style={{ position: "fixed", inset: "0", zIndex: "30" }} />
        </>
      ) : null}
      <HostAdvFilter open={v.filterOpen} onApply={v.applyFilter} onClose={v.closeFilter} />
      {v.m?.detail ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={v.d?.title} width={v.w900} onClose={v.closeModal}>
            <div style={{ display: "grid", gridTemplateColumns: "340px minmax(0, 1fr)", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="dv-thumb" style={{ aspectRatio: "16 / 9" }}><img src={v.d?.image} alt="" /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div className="dv-kv">
                    <span>Type</span>
                    <span>{v.d?.kind}</span>
                  </div>
                  <div className="dv-kv">
                    <span>Size</span>
                    <span>{v.d?.size}</span>
                  </div>
                  <div className="dv-kv">
                    <span>Duration</span>
                    <span>{v.d?.duration}</span>
                  </div>
                  <div className="dv-kv">
                    <span>Uploaded</span>
                    <span>{v.d?.uploaded}</span>
                  </div>
                  <div className="dv-kv">
                    <span>Folder</span>
                    <span>{v.d?.folder}</span>
                  </div>
                  <div className="dv-kv">
                    <span>Owner</span>
                    <span>{v.d?.owner}</span>
                  </div>
                </div>
                <NTV.Button variant="primary" tone="neutral" size="m" iconRight="trash" onClick={v.askDelete}>Delete</NTV.Button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "0" }}>
                <div className="dv-tabs" role="tablist">
                  {(v.dTabs || []).map((_t, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick}>{_t?.label}</button>
                    </React.Fragment>
                  ))}
                </div>
                {v.dt?.reports ? (
                  <>
                    <p className="dv-sub">{"Plays in the last 7 days · "}{v.d?.plays}{" total"}</p>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", height: "160px", padding: "10px 0", borderBottom: "1px solid var(--container-border)" }}>
                    {(v.bars || []).map((_b, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: "1" }}>
                          <span className="dv-sub" style={{ fontSize: "10px" }}>{_b?.v}</span>
                          <div style={{ width: "28px", borderRadius: "4px 4px 0 0", background: "var(--accent-action)", height: `${s(_b?.h)}px` }} />
                          <span className="dv-sub" style={{ fontSize: "10px" }}>{_b?.d}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  </>
                ) : null}
                {v.dt?.playlists ? (
                  <>
                    {(v.d?.playlists || []).map((_p, $index) => (
                    <React.Fragment key={$index}>
                      <a href="DealerPlaylistDetail.dc.html" onClick={_p?.open} className="dv-between" style={{ padding: "10px 12px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", textDecoration: "none", color: "var(--fg-primary)" }} data-nav={_p?.openNav}>
                        <strong style={{ fontSize: "14px" }}>{_p?.name}</strong>
                        <span className="dv-sub">{_p?.screens}</span>
                      </a>
                    </React.Fragment>
                  ))}
                    {v.d?.noPlaylists ? (
                    <>
                      <div className="dv-empty">Not in any playlist yet.</div>
                    </>
                  ) : null}
                  </>
                ) : null}
                {v.dt?.where ? (
                  <>
                    {(v.d?.where || []).map((_w, $index) => (
                    <React.Fragment key={$index}>
                      <div className="dv-between" style={{ padding: "8px 0", borderTop: "1px solid var(--container-border)", fontSize: "14px" }}>
                        <a className="dv-a" href="DealerScreenDetail.dc.html" onClick={_w?.open} data-nav={_w?.openNav}>{_w?.screen}</a>
                        <span className="dv-sub">{_w?.host}{" · "}{_w?.lic}</span>
                      </div>
                    </React.Fragment>
                  ))}
                    {v.d?.noWhere ? (
                    <>
                      <div className="dv-empty">Not playing on any screen.</div>
                    </>
                  ) : null}
                  </>
                ) : null}
              </div>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.confirm ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title={v.cf?.title} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.cf?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.cfOk}>Delete</button>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.folder ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={v.fd?.title} width={v.w500} onClose={v.closeModal}>
            <p className="dv-sub" style={{ margin: "-8px 0 16px" }}>{v.fd?.sub}</p>
            <label className="dv-label" htmlFor="fd">Folder Name</label>
            <input id="fd" className="dv-field" placeholder="Enter folder name" value={v.fd?.name} onChange={v.fd?.set} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.fd?.bad} onClick={v.fd?.save}>{v.fd?.ok}</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.reassign ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Reassign Folder" width={v.w500} onClose={v.closeModal}>
            <p className="dv-sub" style={{ margin: "-8px 0 16px" }}>Move “{v.ra?.name}” to a different host or advertiser</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <span className="dv-label">Host</span>
                <NTV.Select size="l" placeholder="Select host" options={v.hostOptions} value={v.ra?.host} onChange={v.ra?.setHost} />
              </div>
              <div>
                <span className="dv-label">Advertiser</span>
                <NTV.Select size="l" placeholder="Select advertiser" options={v.ra?.advs} value={v.ra?.adv} onChange={v.ra?.setAdv} disabled={v.ra?.noHost} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.ra?.noHost} onClick={v.ra?.save}>Update</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.move ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={v.mv?.title} width={v.w500} onClose={v.closeModal}>
            <p className="dv-sub" style={{ margin: "-8px 0 12px" }}>{v.mv?.sub}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
              {(v.mv?.options || []).map((_o, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className={`ml-folder ${s(_o?.cls)}`} onClick={_o?.pick} style={{ fontFamily: "inherit", textAlign: "left" }}>
                    <NTV.Icon name="folder" size={v.i14} />
                    <span style={{ flex: "1" }}>{_o?.name}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.mv?.bad} onClick={v.mv?.go}>{v.mv?.ok}</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.upload ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Upload Content" width={v.w500} onClose={v.closeModal}>
            <p className="dv-sub" style={{ margin: "-8px 0 16px" }}>{v.up?.sub}</p>
            {v.up?.isAssign ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <span className="dv-label">Host</span>
                  <NTV.Select size="l" placeholder="Select host" options={v.hostOptions} value={v.up?.host} onChange={v.up?.setHost} />
                </div>
                {v.up?.hasAdvs ? (
                  <>
                    <div>
                    <span className="dv-label">Advertiser</span>
                    <NTV.Select size="l" placeholder="Select advertiser" options={v.up?.advs} value={v.up?.adv} onChange={v.up?.setAdv} />
                  </div>
                  </>
                ) : null}
                {v.up?.noAdvs ? (
                  <>
                    <div className="dv-note">
                    <NTV.Icon name="circle-info" size={v.i14} />
                    <span>This host has no advertisers yet.</span>
                  </div>
                  </>
                ) : null}
              </div>
              </>
            ) : null}
            {v.up?.isPlaylist ? (
              <>
                <span className="dv-label">Assign Playlist</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "260px", overflowY: "auto", padding: "12px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)" }}>
                {(v.up?.playlists || []).map((_p, $index) => (
                  <React.Fragment key={$index}>
                    <NTV.Checkbox checked={_p?.on} label={_p?.name} onChange={_p?.toggle} />
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
            {v.up?.isUploading ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(v.up?.files || []).map((_f, $index) => (
                  <React.Fragment key={$index}>
                    <div className="dv-row">
                      <NTV.Icon name="image" size={v.i14} />
                      <span style={{ flex: "1", fontSize: "13px" }}>{_f?.name}</span>
                      <div style={{ width: "180px" }}><NTV.ProgressBar value={_f?.pct} /></div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} disabled={v.up?.busy} onClick={v.up?.skip}>Skip</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.up?.blocked} onClick={v.up?.next}>{v.up?.nextLabel}</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.toast?.show ? (
        <>
          <div className="dv-toast" role="status" style={{ borderLeftColor: `${s(v.toast?.color)}` }}>
          <NTV.Icon name={v.toast?.icon} size={v.toast?.size} />
          <span>{v.toast?.text}</span>
        </div>
        </>
      ) : null}
    </div>
    </div>
));

export default Component;
