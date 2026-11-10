// @ts-nocheck
/**
 * Page: Media Library  (route /media)
 * Converted from the Claude Design artboard DealerMedia.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React, { useEffect, useRef, useState } from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, advsForHost, arrived, byId, contains, go, hostName, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import HostAdvFilter from '../components/HostAdvFilter';
import { HoverVideo, ThumbMenu } from '../components/ContentThumb';
import './DealerMedia.css';

/* Media card (grid + folder side panel). Hover/focus: badge hides, checkbox shows top-left,
   ⋯ menu top-right; video items with a `video` URL play muted while hovered. Body click toggles selection. */
function MediaCard(p) {
  var c = p.c;
  var [hover, setHover] = useState(false);
  var [menu, setMenu] = useState(false);
  var stop = function (e) { e.stopPropagation(); };
  var small = !!p.small;
  return (
    // Link clicks (eye, View Details) must bubble to document so App.tsx can route them,
    // so the card ignores them here instead of the links stopping propagation.
    <div className={'ml-card ' + (c.cls || '') + (menu ? ' is-menu' : '')} onClick={function (e) { if (e.target.closest && e.target.closest('a[href], .ml-cb, .ml-more')) return; c.toggle(); }}
      onMouseEnter={function () { setHover(true); }} onMouseLeave={function () { setHover(false); }}
      onFocus={function () { setHover(true); }} onBlur={function (e) { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}>
      <div className="dv-thumb ml-thumb" style={{ aspectRatio: "16 / 10" }}>
        <HoverVideo image={c.image} video={c.video} isVideo={c.kind === 'video'} active={hover || menu} />
        <span className="ml-badge" style={{ color: c.badgeColor }}>{c.badge}</span>
        <span className="ml-cb" onClick={stop}><NTV.Checkbox checked={!!c.checked} onChange={c.toggle} /></span>
      </div>
      <span className="ml-more"><ThumbMenu items={c.menuItems} label={'Options for ' + c.title} onOpenChange={setMenu} /></span>
      <div className="dv-row" style={{ gap: small ? "2px" : "4px", padding: small ? "4px 2px 4px 6px" : "6px 4px 6px 8px" }}>
        <span style={{ flex: "1", minWidth: "0", fontSize: small ? "10px" : "11px", lineHeight: small ? "16px" : "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
        <a className="dv-ib ml-eye" href="DealerMediaDetail.dc.html" data-nav={c.openNav} onClick={c.open} style={{ width: small ? "20px" : "22px", height: small ? "20px" : "22px" }} aria-label={'View details of ' + c.title}><NTV.Icon name="eye" size={small ? 10 : 12} /></a>
      </div>
    </div>
  );
}

/* Folder tile with its ⋮ menu (page grid + All Folders modal). Menu state lives on the page (`menu`). */
function FolderTile(p) {
  var f = p.f;
  var stop = function (e) { e.stopPropagation(); };
  var onKey = function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); f.open(); } };
  return (
    <div className={'ml-folder ' + (f.cls || '') + (p.big ? ' ml-folder--big' : '')} role="button" tabIndex={0} onClick={f.open} onKeyDown={onKey}>
      <NTV.Icon name={f.icon} size={p.big ? 20 : 16} />
      <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
      <button type="button" className="dv-ib ml-fbtn" aria-label={'Options for ' + f.name} aria-haspopup="menu" aria-expanded={!!f.menuOpen} onClick={f.menu}>
        <NTV.Icon name="ellipsis" size={14} style={{ transform: "rotate(90deg)" }} />
      </button>
      {f.menuOpen ? (
        <div className="dv-menu ml-fmenu" role="menu" onClick={stop} style={{ top: p.big ? "54px" : "44px", right: "0", minWidth: "170px" }}>
          <button type="button" role="menuitem" className="dv-mi" onClick={f.rename} style={{ color: "var(--accent-action)" }}><NTV.Icon name="pencil" size={12} /><span style={{ color: "var(--fg-primary)" }}>Rename</span></button>
          <button type="button" role="menuitem" className="dv-mi" onClick={f.reassign} style={{ color: "var(--accent-action)" }}><NTV.Icon name="arrows-rotate" size={12} /><span style={{ color: "var(--fg-primary)" }}>Reassign</span></button>
          <button type="button" role="menuitem" className="dv-mi" onClick={f.duplicate} style={{ color: "var(--accent-action)" }}><NTV.Icon name="copy" size={12} /><span style={{ color: "var(--fg-primary)" }}>Duplicate</span></button>
          <button type="button" role="menuitem" className="dv-mi dv-danger" onClick={f.remove}><NTV.Icon name="trash" size={12} />Delete</button>
        </div>
      ) : null}
    </div>
  );
}

/* Secondary button that opens a small dv-menu of options; closes on outside click / Escape. */
function MenuButton(p) {
  var [open, setOpen] = useState(false);
  var ref = useRef(null);
  useEffect(function () {
    if (!open) return;
    var onDoc = function (e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    var onKey = function (e) { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey, true);
    return function () { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey, true); };
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <NTV.Button variant="secondary" size="xl" iconLeft={p.icon} aria-haspopup="menu" aria-expanded={open} onClick={function () { setOpen(!open); }}>{p.label}</NTV.Button>
      {open ? (
        <div className="dv-menu" role="menu" style={{ top: "46px", left: "0", minWidth: "180px" }}>
          {p.options.map(function (o) {
            return (
              <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === p.value} className="dv-mi" onClick={function () { setOpen(false); p.onChange(o.value); }} style={{ fontWeight: o.value === p.value ? 700 : 400, color: o.value === p.value ? "var(--accent-action)" : undefined }}>
                <span style={{ flex: "1" }}>{o.label}</span>
                {o.value === p.value ? <NTV.Icon name="check" size={12} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

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
  { name: 'Holiday Assets', host: '', adv: '', created: 'Oct 25, 2026, 5:45 PM', modified: 'Nov 8, 2026, 3:15 PM' },
  { name: 'Nature Assets', host: 'h2', adv: '', created: 'Mar 4, 2026, 9:00 AM', modified: 'Jun 1, 2026, 4:20 PM' },
  { name: 'Earth Assets', host: '', adv: 'a3', created: 'Mar 12, 2026, 2:30 PM', modified: 'May 28, 2026, 10:00 AM' },
  { name: 'Pet Assets', host: 'h6', adv: 'a4', created: 'Mar 20, 2026, 11:15 AM', modified: 'Jul 9, 2026, 1:00 PM' },
  { name: 'Travel Assets', host: 'h8', adv: '', created: 'Apr 2, 2026, 8:45 AM', modified: 'Aug 3, 2026, 5:30 PM' },
  { name: 'Space Assets', host: '', adv: '', created: 'Apr 11, 2026, 3:00 PM', modified: 'Apr 30, 2026, 9:10 AM' },
  { name: 'Game Assets', host: 'h15', adv: 'a13', created: 'Apr 19, 2026, 6:20 PM', modified: 'Sep 14, 2026, 7:45 PM' },
  { name: 'Aqua Assets', host: 'h10', adv: 'a5', created: 'May 1, 2026, 10:30 AM', modified: 'Jul 22, 2026, 11:00 AM' },
  { name: 'AI Assets', host: '', adv: 'a7', created: 'May 9, 2026, 1:45 PM', modified: 'Oct 5, 2026, 2:15 PM' },
  { name: 'Cute Assets', host: 'h11', adv: '', created: 'May 17, 2026, 4:00 PM', modified: 'Aug 19, 2026, 3:40 PM' },
  { name: 'Educational Assets', host: 'h12', adv: 'a8', created: 'May 25, 2026, 9:20 AM', modified: 'Sep 1, 2026, 8:30 AM' },
  { name: 'Scenery Assets', host: '', adv: '', created: 'Jun 3, 2026, 12:00 PM', modified: 'Jun 30, 2026, 6:00 PM' },
  { name: 'Colors Assets', host: 'h13', adv: 'a9', created: 'Jun 8, 2026, 7:10 AM', modified: 'Jul 2, 2026, 9:00 AM' },
  { name: 'SMR Assets', host: 'h14', adv: '', created: 'Jun 12, 2026, 2:50 PM', modified: 'Aug 27, 2026, 4:10 PM' },
  { name: 'Drinks Menu', host: 'h3', adv: 'a2', created: 'Jun 25, 2026, 10:40 AM', modified: 'Oct 9, 2026, 12:30 PM' },
  { name: 'Store Openings', host: 'h1', adv: '', created: 'Jul 14, 2026, 3:25 PM', modified: 'Sep 23, 2026, 10:15 AM' },
  { name: 'Back to School', host: '', adv: 'a12', created: 'Jul 28, 2026, 8:00 AM', modified: 'Aug 30, 2026, 7:00 PM' },
  { name: 'Weekend Specials', host: 'h5', adv: 'a1', created: 'Aug 22, 2026, 5:15 PM', modified: 'Nov 6, 2026, 11:45 AM' },
  { name: 'Community Events', host: 'h4', adv: '', created: 'Sep 15, 2026, 1:30 PM', modified: 'Oct 27, 2026, 2:00 PM' },
  { name: 'Halloween Assets', host: '', adv: '', created: 'Oct 1, 2026, 9:00 AM', modified: 'Oct 31, 2026, 8:00 PM' },
  { name: 'Black Friday', host: 'h9', adv: 'a10', created: 'Nov 2, 2026, 10:00 AM', modified: 'Nov 9, 2026, 4:30 PM' }
];
var FOLDER_SORTS = [{ value: 'az', label: 'Name A–Z' }, { value: 'za', label: 'Name Z–A' }, { value: 'new', label: 'Newest' }, { value: 'old', label: 'Oldest' }];
function folderTime(f) { var t = Date.parse((f.created || '').split(',').slice(0, 2).join(',')); return isNaN(t) ? 0 : t; }
var AF_PAGE = 24;
var BADGE = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] };
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerMedia.dc.html') || {};
    var media = D.media.map(function (m, i) { var o = Object.assign({}, m); if (i % 4 === 3) o.folder = FOLDERS[5 + (i % 5)].name; return o; });
    this.state = { media: media, folders: FOLDERS.map(function (x) { return Object.assign({}, x); }), type: f.type === 'Unused' ? 'Unused' : '', source: f.source || '', host: f.host || '', hostName: f.hostName || '', adv: '', asc: true, query: '', sel: {}, limit: 30,
      foldersOpen: true, mediaOpen: true, panel: '', panelQ: '', menu: '', modal: '', ret: '', af: { q: '', sort: 'az', limit: AF_PAGE }, cf: null, fd: null, ra: null, mv: null, up: null, filterOpen: false, toast: null };
  }
  componentDidMount() {
    var self = this;
    // Folder ⋮ menus (page grid + All Folders modal): close on outside click / Escape.
    this._doc = function (e) { if (self.state.menu && !(e.target.closest && e.target.closest('.ml-fmenu, .ml-fbtn'))) self.setState({ menu: '' }); };
    // Escape closes the innermost thing: an open folder menu, else (if no other menu is open) the All Folders modal.
    this._key = function (e) {
      if (e.key !== 'Escape') return;
      if (self.state.menu) { self.setState({ menu: '' }); return; }
      if (document.querySelector('.pg-media [role="menu"]')) return;
      if (self.state.modal === 'folders') self.setState({ modal: '', ret: '' });
    };
    document.addEventListener('mousedown', this._doc); document.addEventListener('keydown', this._key);
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); if (this._ut) clearInterval(this._ut); document.removeEventListener('mousedown', this._doc); document.removeEventListener('keydown', this._key); }
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
    // Sub-modals opened from the All Folders modal return to it when they close.
    var close = function () { self.setState({ modal: self.state.ret || '', ret: '', cf: null, fd: null, ra: null, mv: null }); };
    var card = function (m) {
      var b = BADGE[m.kind] || BADGE.image, open = navFn('DealerMediaDetail.dc.html', { id: m.id });
      var on = !!s.sel[m.id];
      var toggle = function () { var o = Object.assign({}, self.state.sel); o[m.id] = !o[m.id]; self.setState({ sel: o }); };
      return { id: m.id, image: m.image, video: m.video || '', kind: m.kind, title: m.title, badge: b[0], badgeColor: b[1], checked: on, cls: on ? 'sel' : '', toggle: toggle, open: open, openNav: open.nav,
        menuItems: [
          { label: 'View Details', icon: 'eye', href: 'DealerMediaDetail.dc.html', nav: open.nav, onClick: open },
          { label: 'Rename', icon: 'pencil', onClick: function () { self.setState({ modal: 'folder', fd: { mode: 'file', id: m.id, old: m.title, name: m.title } }); } },
          { label: 'Move to Folder', icon: 'folder', onClick: function () { self.setState({ modal: 'move', mv: { mode: 'bulk', to: m.folder || '', ids: [m.id], title: m.title } }); } },
          { label: 'Download', icon: 'download', onClick: function () { toast(self, 'Downloading ' + m.title + '…', 'info'); } },
          { label: 'Delete', icon: 'trash', danger: true, onClick: function () { var n = D.playlists.filter(function (p) { return p.items.indexOf(m.id) !== -1; }).length; self.setState({ modal: 'confirm', cf: { title: 'Delete File?', text: m.used && n ? m.title + ' is in ' + n + ' playlist(s). Deleting removes it from those playlists and the screens playing them.' : 'Delete ' + m.title + '? It isn’t used anywhere. This can’t be undone.', act: 'files', ids: [m.id] } }); } }
        ] };
    };
    var folderVals = function (f, fromModal) {
      var on = s.panel === f.name, key = (fromModal ? 'af:' : '') + f.name;
      var sub = function (o) { if (fromModal) o.ret = 'folders'; return o; };
      return { name: f.name, cls: on ? 'on' : '', icon: on ? 'folder-solid' : 'folder', menuOpen: s.menu === key,
        open: fromModal ? function () { self.setState({ modal: '', menu: '', panel: f.name, panelQ: '' }); } : function () { self.setState({ panel: on ? '' : f.name, panelQ: '' }); },
        menu: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ menu: self.state.menu === key ? '' : key }); },
        rename: function () { self.setState(sub({ menu: '', modal: 'folder', fd: { mode: 'rename', old: f.name, name: f.name } })); },
        reassign: function () { var h = byId(D.hosts, f.host), a = byId(D.advertisers, f.adv); self.setState(sub({ menu: '', modal: 'reassign', ra: { name: f.name, host: h ? h.name : '', adv: a ? a.name : '' } })); },
        duplicate: function () { var copy = Object.assign({}, f, { name: f.name + ' Copy', created: 'Nov 10, 2026, 9:55 AM', modified: 'Nov 10, 2026, 9:55 AM' }); var fs = self.state.folders.slice(); fs.splice(fs.indexOf(f) + 1, 0, copy); self.setState({ menu: '', folders: fs }); toast(self, 'Folder “' + copy.name + '” Created'); },
        remove: function () { var n = self.state.media.filter(function (m) { return m.folder === f.name; }).length; self.setState(sub({ menu: '', modal: 'confirm', cf: { title: 'Delete Folder?', text: 'Delete “' + f.name + '”? Its ' + n + ' file(s) stay in your Media Library.', act: 'folder', key: f.name } })); } };
    };
    var af = s.af;
    var afList = s.folders.filter(function (f) { return contains(f.name, af.q); }).slice().sort(function (a, b) {
      if (af.sort === 'za') return b.name.localeCompare(a.name);
      if (af.sort === 'new') return folderTime(b) - folderTime(a);
      if (af.sort === 'old') return folderTime(a) - folderTime(b);
      return a.name.localeCompare(b.name);
    });
    var setAf = function (o) { self.setState({ af: Object.assign({}, self.state.af, o) }); };
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
    var foldersShown = s.folders.slice(0, 10);
    var mv = s.mv || {};
    var mvIds = mv.ids || selIds;
    var back = function () { return { modal: self.state.ret || '', ret: '' }; };
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
      folderCount: s.folders.length,
      openAllFolders: function () { self.setState({ modal: 'folders', menu: '', af: { q: '', sort: self.state.af.sort, limit: AF_PAGE } }); },
      closeAllFolders: function () { self.setState({ modal: '', ret: '', menu: '' }); },
      folderCols: 5,
      folders: foldersShown.map(function (f) { return folderVals(f, false); }),
      af: { q: af.q, setQ: function (v) { setAf({ q: val(v), limit: AF_PAGE }); }, sort: af.sort, sorts: FOLDER_SORTS, setSort: function (x) { setAf({ sort: x }); },
        folders: afList.slice(0, af.limit).map(function (f) { return folderVals(f, true); }),
        shown: Math.min(af.limit, afList.length), total: afList.length, hasMore: afList.length > af.limit, empty: afList.length === 0,
        more: function () { setAf({ limit: self.state.af.limit + AF_PAGE }); } },
      stop: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); },
      mediaCount: list.length, mediaCols: panelOpen ? 6 : 10,
      items: vis.map(card),
      empty: list.length === 0, shown: vis.length, matched: list.length, hasMore: list.length > vis.length,
      more: function () { self.setState({ limit: self.state.limit + 20 }); },
      panel: pf ? { open: true, name: pf.name, host: (byId(D.hosts, pf.host) || {}).name || 'Not assigned', adv: (byId(D.advertisers, pf.adv) || {}).name || 'Not assigned', created: pf.created, modified: pf.modified,
        count: s.media.filter(function (m) { return m.folder === pf.name; }).length, items: pItems.slice(0, 15).map(card), shown: Math.min(15, pItems.length), empty: pItems.length === 0 } : { open: false },
      closePanel: function () { self.setState({ panel: '' }); },
      panelQ: s.panelQ, setPanelQ: function (v) { self.setState({ panelQ: val(v) }); },
      openAddToFolder: function () { self.setState({ modal: 'move', mv: { mode: 'pick', to: self.state.panel, pick: {} } }); },
      filterOpen: s.filterOpen, openFilter: function () { self.setState({ filterOpen: true }); }, closeFilter: function () { self.setState({ filterOpen: false }); },
      applyFilter: function (x) { self.setState({ filterOpen: false, host: x.host, hostName: x.hostName, adv: x.adv || '' }); },
      m: { folders: s.modal === 'folders', confirm: s.modal === 'confirm', folder: s.modal === 'folder', reassign: s.modal === 'reassign', move: s.modal === 'move', upload: s.modal === 'upload' },
      closeModal: close,
      askBulkDelete: function () { var used = self.state.media.filter(function (m) { return selIds.indexOf(m.id) !== -1 && m.used; }).length; self.setState({ modal: 'confirm', cf: { title: 'Delete ' + selIds.length + ' File(s)?', text: used ? used + ' of these are used in playlists. Deleting removes them from those playlists and the screens playing them.' : 'These files aren’t used anywhere. This can’t be undone.', act: 'files', ids: selIds } }); },
      cf: s.cf || { title: '', text: '' },
      cfOk: function () {
        var c = self.state.cf;
        if (c.act === 'folder') { self.setState(Object.assign(back(), { folders: self.state.folders.filter(function (f) { return f.name !== c.key; }), media: self.state.media.map(function (m) { return m.folder === c.key ? Object.assign({}, m, { folder: '' }) : m; }), panel: self.state.panel === c.key ? '' : self.state.panel, cf: null })); toast(self, 'Folder deleted'); }
        else { var sel2 = Object.assign({}, self.state.sel); c.ids.forEach(function (id) { delete sel2[id]; }); self.setState(Object.assign(back(), { media: self.state.media.filter(function (m) { return c.ids.indexOf(m.id) === -1; }), sel: sel2, cf: null })); toast(self, c.ids.length + ' file(s) deleted'); }
      },
      newFolder: function () { self.setState({ modal: 'folder', fd: { mode: 'new', name: '' } }); },
      fd: s.fd ? { title: s.fd.mode === 'new' ? 'New Folder' : (s.fd.mode === 'file' ? 'Rename File' : 'Rename Folder'), sub: s.fd.mode === 'new' ? 'Group your media into a folder' : (s.fd.mode === 'file' ? 'Give this file a new name' : 'Give this folder a new name'), label: s.fd.mode === 'file' ? 'File Name' : 'Folder Name', placeholder: s.fd.mode === 'file' ? 'Enter file name' : 'Enter folder name', ok: s.fd.mode === 'new' ? 'Create Folder' : 'Save Changes', name: s.fd.name, bad: !s.fd.name.trim(),
        set: function (v) { self.setState({ fd: Object.assign({}, self.state.fd, { name: val(v) }) }); },
        save: function () { var x = self.state.fd, n = x.name.trim();
          if (x.mode === 'file') { self.setState(Object.assign(back(), { media: self.state.media.map(function (m) { return m.id === x.id ? Object.assign({}, m, { title: n }) : m; }), fd: null })); toast(self, 'File renamed to “' + n + '”'); }
          else if (x.mode === 'new') { self.setState(Object.assign(back(), { folders: [{ name: n, host: '', adv: '', created: 'Nov 10, 2026, 9:55 AM', modified: 'Nov 10, 2026, 9:55 AM' }].concat(self.state.folders), fd: null })); toast(self, 'Folder “' + n + '” Created'); }
          else { self.setState(Object.assign(back(), { folders: self.state.folders.map(function (f) { return f.name === x.old ? Object.assign({}, f, { name: n, modified: 'Nov 10, 2026, 9:55 AM' }) : f; }), media: self.state.media.map(function (m) { return m.folder === x.old ? Object.assign({}, m, { folder: n }) : m; }), panel: self.state.panel === x.old ? n : self.state.panel, fd: null })); toast(self, 'Folder renamed'); } } } : { title: '', sub: '', label: '', placeholder: '', ok: '', name: '', bad: true },
      hostOptions: D.hosts.map(function (h) { return h.name; }),
      ra: { name: ra.name, host: ra.host, adv: ra.adv, noHost: !raHost, advs: raHost ? advsForHost(raHost.id).map(function (a) { return a.name; }) : [],
        setHost: function (v) { self.setState({ ra: Object.assign({}, self.state.ra, { host: val(v), adv: '' }) }); },
        setAdv: function (v) { self.setState({ ra: Object.assign({}, self.state.ra, { adv: val(v) }) }); },
        save: function () { var r = self.state.ra, h = D.hosts.filter(function (x) { return x.name === r.host; })[0], a = D.advertisers.filter(function (x) { return x.name === r.adv; })[0];
          self.setState(Object.assign(back(), { folders: self.state.folders.map(function (f) { return f.name === r.name ? Object.assign({}, f, { host: h ? h.id : '', adv: a ? a.id : '', modified: 'Nov 10, 2026, 9:55 AM' }) : f; }), ra: null })); toast(self, '“' + r.name + '” reassigned to ' + r.host); } },
      openMove: function () { self.setState({ modal: 'move', mv: { mode: 'bulk', to: '' } }); },
      mv: mv.mode === 'pick' ? {
        title: 'Add Files to ' + mv.to, sub: 'Pick files from your library to add to this folder', ok: 'Add Files', bad: !Object.keys(mv.pick).some(function (k) { return mv.pick[k]; }),
        options: s.media.filter(function (m) { return m.folder !== mv.to; }).slice(0, 12).map(function (m) { return { name: m.title, cls: mv.pick[m.id] ? 'on' : '', pick: function () { var p = Object.assign({}, self.state.mv.pick); p[m.id] = !p[m.id]; self.setState({ mv: Object.assign({}, self.state.mv, { pick: p }) }); } }; }),
        go: function () { var ids = Object.keys(self.state.mv.pick).filter(function (k) { return self.state.mv.pick[k]; }), to = self.state.mv.to; self.setState({ media: self.state.media.map(function (m) { return ids.indexOf(m.id) !== -1 ? Object.assign({}, m, { folder: to }) : m; }), modal: '', mv: null }); toast(self, ids.length + (ids.length === 1 ? ' asset' : ' assets') + ' Added'); }
      } : {
        title: mv.ids ? 'Move to Folder' : 'Bulk Move', sub: mv.ids ? 'Move “' + mv.title + '” to a folder' : 'Move ' + selIds.length + ' selected file(s) to a folder', ok: mv.ids ? 'Move File' : 'Move Files', bad: !mv.to,
        options: s.folders.map(function (f) { return { name: f.name, cls: mv.to === f.name ? 'on' : '', pick: function () { self.setState({ mv: Object.assign({}, self.state.mv, { to: f.name }) }); } }; }),
        go: function () { var to = self.state.mv.to; self.setState({ media: self.state.media.map(function (m) { return mvIds.indexOf(m.id) !== -1 ? Object.assign({}, m, { folder: to }) : m; }), sel: mv.ids ? self.state.sel : {}, modal: '', mv: null }); toast(self, mvIds.length + (mvIds.length === 1 ? ' asset' : ' assets') + ' moved to ' + to); }
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
                <button type="button" className="dv-a" onClick={v.openAllFolders} aria-haspopup="dialog" style={{ fontSize: "12px", fontWeight: "500" }}>{"View all ›"}</button>
              </div>
              {v.foldersOpen ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${s(v.folderCols)}, minmax(0, 1fr))`, gap: "10px" }}>
                  {(v.folders || []).map((_f, $index) => <FolderTile key={_f.name + $index} f={_f} />)}
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
                  {(v.items || []).map((_m) => <MediaCard key={_m.id} c={_m} />)}
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
                  {(v.panel?.items || []).map((_m) => <MediaCard key={_m.id} c={_m} small />)}
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
      <HostAdvFilter open={v.filterOpen} onApply={v.applyFilter} onClose={v.closeFilter} />
      {v.m?.folders ? (
        <div className="dv-ov" onMouseDown={(e) => { if (e.target === e.currentTarget) v.closeAllFolders(); }}>
          <NTV.Modal title="All Folders" width={1140} onClose={v.closeAllFolders} className="ml-afmodal">
            <p className="dv-sub" style={{ margin: "-12px 0 16px" }}>Select a folder to view its contents</p>
            <div className="dv-between" style={{ marginBottom: "16px", flexWrap: "nowrap" }}>
              <MenuButton icon="filter" label="Sort by" options={v.af?.sorts} value={v.af?.sort} onChange={v.af?.setSort} />
              <NTV.Input size="l" placeholder="Search Folders..." iconLeft="magnifying-glass" iconRight="sparkles" label="Search folders" value={v.af?.q} onChange={v.af?.setQ} style={{ width: "514px" }} />
            </div>
            <div className="ml-afgrid">
              {(v.af?.folders || []).map((_f, $index) => <FolderTile key={_f.name + $index} f={_f} big />)}
              {v.af?.empty ? <div className="dv-empty" style={{ gridColumn: "1 / -1" }}>No folders match “{v.af?.q}”.</div> : null}
            </div>
            <div className="dv-between" style={{ marginTop: "16px" }}>
              <span className="dv-sub" style={{ fontSize: "12px", color: "var(--fg-primary)" }}>{"Showing "}{v.af?.shown}{" of "}{v.af?.total}{" items"}</span>
              {v.af?.hasMore ? <button type="button" className="dv-a" onClick={v.af?.more} style={{ fontSize: "12px", fontWeight: "500", color: "var(--fg-primary)" }}>Show More...</button> : null}
            </div>
          </NTV.Modal>
        </div>
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
            <label className="dv-label" htmlFor="fd">{v.fd?.label}</label>
            <input id="fd" className="dv-field" placeholder={v.fd?.placeholder} value={v.fd?.name} onChange={v.fd?.set} autoFocus />
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

export { FOLDERS };
export default Component;
