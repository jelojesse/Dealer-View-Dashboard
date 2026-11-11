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
import UploadContentModal from '../components/UploadContentModal';
import Toast from '../components/Toast';
import { PickField, PlaylistPicker, AdProfileForm } from '../components/MediaFormBits';
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
    <div className={'ml-card ' + (c.cls || '') + (menu ? ' is-menu' : '')} draggable={!menu} onDragStart={c.dragStart} onDragEnd={c.dragEnd} onClick={function (e) { if (e.target.closest && e.target.closest('a[href], .ml-cb, .ml-more')) return; c.toggle(); }}
      onMouseEnter={function () { setHover(true); }} onMouseLeave={function () { setHover(false); }}
      onFocus={function () { setHover(true); }} onBlur={function (e) { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}>
      <div className="dv-thumb ml-thumb" style={small ? undefined : { aspectRatio: "16 / 10" }}>
        <HoverVideo image={c.image} video={c.video} isVideo={c.kind === 'video'} active={hover || menu} />
        <span className="ml-badge" style={{ color: c.badgeColor }}>{c.badge}</span>
        <span className="ml-cb" onClick={stop}><NTV.Checkbox checked={!!c.checked} onChange={c.toggle} /></span>
      </div>
      <span className="ml-more"><ThumbMenu items={c.menuItems} label={'Options for ' + c.title} onOpenChange={setMenu} /></span>
      <div className="dv-row" style={{ gap: "4px", padding: small ? "9px 8px 9px 9px" : "6px 4px 6px 8px" }}>
        <span style={{ flex: "1", minWidth: "0", fontSize: small ? "12px" : "11px", lineHeight: small ? "20px" : "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
        <a className={'dv-ib ml-eye' + (small ? ' ml-eye--round' : '')} href="DealerMediaDetail.dc.html" data-nav={c.openNav} onClick={c.open} style={{ width: small ? "20px" : "22px", height: small ? "20px" : "22px" }} aria-label={'View details of ' + c.title}><NTV.Icon name="eye" size={small ? 10 : 12} /></a>
      </div>
    </div>
  );
}

/* Folder tile with its ⋮ menu (page grid + All Folders modal). Menu state lives on the page (`menu`).
   Page grid (recording): single click selects (for Bulk Delete), double click opens the folder preview panel.
   Keyboard: Space selects, Enter opens. In the All Folders modal (no selection there) a click opens. */
function FolderTile(p) {
  var f = p.f;
  var stop = function (e) { e.stopPropagation(); };
  var sel = f.toggleSel;
  var onKey = function (e) {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter') { e.preventDefault(); f.open(); }
    else if (e.key === ' ') { e.preventDefault(); if (sel) sel(); else f.open(); }
  };
  // Ignore clicks that come from the ⋮ button / menu.
  var fromMenu = function (e) { return !!(e.target.closest && e.target.closest('.ml-fbtn, .ml-fmenu')); };
  return (
    <div className={'ml-folder ' + (f.cls || '') + (p.big ? ' ml-folder--big' : '')} role="button" tabIndex={0} aria-pressed={sel ? !!f.checked : undefined}
      onClick={function (e) { if (fromMenu(e)) return; if (sel) sel(); else f.open(); }}
      onDoubleClick={sel ? function (e) { if (fromMenu(e)) return; f.open(); } : undefined}
      onMouseDown={function (e) { if (e.detail > 1) e.preventDefault(); /* no text highlight on double click */ }}
      onKeyDown={onKey}
      onDragOver={f.dz ? f.dz.over : undefined} onDragLeave={f.dz ? f.dz.leave : undefined} onDrop={f.dz ? f.dz.drop : undefined}>
      <NTV.Icon name={f.icon} size={p.big ? 20 : 16} />
      <span className="ml-fname">
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
        {/* While dragging: how many of the dragged files are already in this folder (recording). */}
        {f.dup ? <span className="ml-fdup" title={f.dup + ' of the dragged files already in this folder'}>{f.dup}</span> : null}
      </span>
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
var PANEL_PAGE = 15;
var BADGE = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] };
var MV_PAGE = 24;
/* A file can sit in several folders (recording: "Add Files" adds, it doesn't move). `fl` = folder names. */
function inF(m, name) { return (m.fl || []).indexOf(name) !== -1; }
function withF(m, add, drop) { var fl = (m.fl || []).filter(function (n) { return n !== drop; }); if (add && fl.indexOf(add) === -1) fl = fl.concat([add]); return Object.assign({}, m, { fl: fl }); }
function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerMedia.dc.html') || {};
    // Demo folders: every 4th file sits in a folder, and some files are also in a second one.
    var media = D.media.map(function (m, i) { var o = Object.assign({}, m), fl = m.folder ? [m.folder] : [];
      if (i % 4 === 3) fl.push(FOLDERS[5 + (i % 5)].name);
      if (i % 6 === 1) fl.push(FOLDERS[i % 10].name);
      o.fl = fl.filter(function (n, k) { return fl.indexOf(n) === k; }); return o; });
    this.state = { media: media, folders: FOLDERS.map(function (x) { return Object.assign({}, x); }), type: f.type === 'Unused' ? 'Unused' : '', source: f.source || '', host: f.host || '', hostName: f.hostName || '', adv: '', asc: true, query: '', sel: {}, limit: 30,
      foldersOpen: true, mediaOpen: true, panel: '', panelQ: '', panelLimit: PANEL_PAGE, drag: null, dropTo: '', menu: '', fsel: {}, modal: '', ret: '', af: { q: '', sort: 'az', limit: AF_PAGE }, cf: null, fd: null, ra: null, mv: null, up: null, nf: null, adp: null, okm: null, ucCtx: '', extraAdvs: {}, filterOpen: false, toast: null };
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
    // Selected folders (hover checkbox on the folder tiles); only names that still exist count.
    var fselNames = s.folders.filter(function (f) { return s.fsel[f.name]; }).map(function (f) { return f.name; });
    // Sub-modals opened from the All Folders modal return to it when they close.
    var close = function () { self.setState({ modal: self.state.ret || '', ret: '', cf: null, fd: null, ra: null, mv: null }); };
    /* Drag & drop (recording): cards drag from the Media Contents grid ('main') or the folder panel ('panel').
       Dragging a selected card carries every selected card. While dragging, each folder that already holds
       some of the dragged files shows a red count badge. Dropping on a folder (or the open panel) ADDS the
       files to it; files already there are skipped ("# duplicate files were found", with undo). Dropping a
       panel card on the Media Contents grid removes it from the open folder. */
    var byIdM = {}; s.media.forEach(function (m) { byIdM[m.id] = m; });
    var addTo = function (folder, ids) {
      var before = self.state.media, sel = self.state.sel;
      var fresh = ids.filter(function (id) { return byIdM[id] && !inF(byIdM[id], folder); }), dup = ids.length - fresh.length;
      if (fresh.length) self.setState({ media: before.map(function (m) { return fresh.indexOf(m.id) !== -1 ? withF(m, folder) : m; }), sel: {} });
      var undo = { label: 'undo', run: function () { self.setState({ media: before, sel: sel }); } };
      if (dup) toast(self, plural(dup, 'duplicate file was found.', 'duplicate files were found.'), 'error', fresh.length ? 'Existing files were skipped · ' + plural(fresh.length, 'asset', 'assets') + ' added to “' + folder + '”' : 'Existing files were skipped', fresh.length ? { action: undo } : null);
      else toast(self, plural(fresh.length, 'asset', 'assets') + ' Added', 'success', 'Added to “' + folder + '”', { action: undo });
    };
    var removeFrom = function (folder, ids) {
      var before = self.state.media;
      self.setState({ media: before.map(function (m) { return ids.indexOf(m.id) !== -1 ? withF(m, null, folder) : m; }), sel: {} });
      toast(self, plural(ids.length, 'asset', 'assets') + ' removed from “' + folder + '”', 'success', '', { action: { label: 'undo', run: function () { self.setState({ media: before }); } } });
    };
    var zone = function (key, accept, onDrop) {
      return {
        on: s.dropTo === key,
        over: function (e) { var d = self.state.drag; if (!d || !accept(d)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (self.state.dropTo !== key) self.setState({ dropTo: key }); },
        leave: function (e) { if (e.currentTarget.contains(e.relatedTarget)) return; if (self.state.dropTo === key) self.setState({ dropTo: '' }); },
        drop: function (e) { e.preventDefault(); var d = self.state.drag; self.setState({ drag: null, dropTo: '' }); if (d && accept(d)) onDrop(d.ids); }
      };
    };
    var card = function (m, from) {
      var b = BADGE[m.kind] || BADGE.image, open = navFn('DealerMediaDetail.dc.html', { id: m.id });
      var on = !!s.sel[m.id];
      var toggle = function () { self.setState(function (st) { var o = Object.assign({}, st.sel); o[m.id] = !o[m.id]; return { sel: o }; }); };
      var dragStart = function (e) {
        var ids = on ? selIds : [m.id];
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', ids.join(','));
        // Update state after the browser has captured the drag image.
        setTimeout(function () { self.setState({ drag: { ids: ids, from: from }, menu: '' }); }, 0);
      };
      var dragEnd = function () { self.setState({ drag: null, dropTo: '' }); };
      var dragging = !!(s.drag && s.drag.from === from && s.drag.ids.indexOf(m.id) !== -1);
      return { id: m.id, image: m.image, video: m.video || '', kind: m.kind, title: m.title, badge: b[0], badgeColor: b[1], checked: on, cls: (on ? 'sel' : '') + (dragging ? ' dragging' : ''), toggle: toggle, open: open, openNav: open.nav, dragStart: dragStart, dragEnd: dragEnd,
        menuItems: [
          { label: 'View Details', icon: 'eye', href: 'DealerMediaDetail.dc.html', nav: open.nav, onClick: open },
          { label: 'Rename', icon: 'pencil', onClick: function () { self.setState({ modal: 'folder', fd: { mode: 'file', id: m.id, old: m.title, name: '' } }); } },
          { label: 'Move to Folder', icon: 'folder', onClick: function () { self.setState({ modal: 'move', mv: { ids: [m.id], picked: {}, q: '', view: '', vq: '', limit: MV_PAGE } }); } },
          { label: 'Download', icon: 'download', onClick: function () { toast(self, 'Downloading ' + m.title + '…', 'info'); } },
          { label: 'Delete', icon: 'trash', danger: true, onClick: function () { var n = D.playlists.filter(function (p) { return p.items.indexOf(m.id) !== -1; }).length; self.setState({ modal: 'confirm', cf: { title: 'Delete File?', text: m.used && n ? m.title + ' is in ' + n + ' playlist(s). Deleting removes it from those playlists and the screens playing them.' : 'Delete ' + m.title + '? It isn’t used anywhere. This can’t be undone.', act: 'files', ids: [m.id] } }); } }
        ] };
    };
    var folderVals = function (f, fromModal) {
      var on = s.panel === f.name, key = (fromModal ? 'af:' : '') + f.name;
      var sub = function (o) { if (fromModal) o.ret = 'folders'; return o; };
      var dz = fromModal ? null : zone('folder:' + f.name, function (d) { return !(d.from === 'panel' && f.name === s.panel); }, function (ids) { addTo(f.name, ids); });
      var picked = !fromModal && !!s.fsel[f.name];
      // While dragging: how many of the dragged files this folder already has (red badge).
      var dup = !fromModal && s.drag ? s.drag.ids.filter(function (id) { return byIdM[id] && inF(byIdM[id], f.name); }).length : 0;
      return { name: f.name, cls: (on ? 'on' : '') + (picked ? ' picked' : '') + (dz && dz.on ? ' drop' : ''), icon: on || picked ? 'folder-solid' : 'folder', menuOpen: s.menu === key, dz: dz, dup: dup,
        checked: picked,
        toggleSel: fromModal ? null : function () { self.setState(function (st) { var o = Object.assign({}, st.fsel); if (o[f.name]) delete o[f.name]; else o[f.name] = true; return { fsel: o }; }); },
        open: fromModal ? function () { self.setState({ modal: '', menu: '', panel: f.name, panelQ: '', panelLimit: PANEL_PAGE }); } : function () { self.setState({ panel: on ? '' : f.name, panelQ: '', panelLimit: PANEL_PAGE }); },
        menu: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ menu: self.state.menu === key ? '' : key }); },
        rename: function () { self.setState(sub({ menu: '', modal: 'folder', fd: { mode: 'rename', old: f.name, name: '' } })); },
        reassign: function () { var h = byId(D.hosts, f.host), a = byId(D.advertisers, f.adv); self.setState(sub({ menu: '', modal: 'reassign', ra: { name: f.name, host: '', adv: '', curHost: h ? h.name : '', curAdv: a ? a.name : '' } })); },
        // Duplicate (recording): copy goes right after the original as "Name (1)", "Name (2)"…; keeps host/advertiser.
        duplicate: function () {
          var fs = self.state.folders.slice(), base = f.name.replace(/ \(\d+\)$/, ''), k = 1;
          while (fs.some(function (x) { return x.name === base + ' (' + k + ')'; })) k++;
          var copy = Object.assign({}, f, { name: base + ' (' + k + ')', created: 'Nov 11, 2026, 9:55 AM', modified: 'Nov 11, 2026, 9:55 AM' });
          fs.splice(fs.indexOf(f) + 1, 0, copy);
          self.setState({ menu: '', folders: fs });
          toast(self, '“' + copy.name + '” Created', 'success', 'Added to your folder list.');
        },
        remove: function () { var n = self.state.media.filter(function (m) { return inF(m, f.name); }).length; self.setState(sub({ menu: '', modal: 'confirm', cf: { title: 'Delete Folder?', text: 'Delete “' + f.name + '”? Its ' + n + ' file(s) stay in your Media Library.', act: 'folder', key: f.name } })); } };
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
    var pItems = pf ? s.media.filter(function (m) { return inF(m, pf.name) && contains(m.title, s.panelQ); }) : [];
    // Advertisers for a host: the mock list plus any created here via "Create Ad Profile".
    var advsOf = function (hid) { return hid ? advsForHost(hid).concat(s.extraAdvs[hid] || []) : []; };
    var hostByName = function (n) { return D.hosts.filter(function (h) { return h.name === n; })[0]; };
    var up = s.up || { step: 0, host: '', adv: '', pls: {} };
    var upHost = hostByName(up.host);
    var upAdvs = upHost ? advsOf(upHost.id) : [];
    var setUp = function (o) { self.setState({ up: Object.assign({}, self.state.up, o) }); };
    // Reassign: fields start empty with the folder's current host/advertiser as placeholders.
    var ra = s.ra || { name: '', host: '', adv: '', curHost: '', curAdv: '' };
    var raHost = hostByName(ra.host || ra.curHost);
    var nf = s.nf || { name: '', host: '', adv: '' };
    var nfHost = hostByName(nf.host);
    var nfAdvs = nfHost ? advsOf(nfHost.id) : [];
    var adp = s.adp || { logo: '', logoName: '', name: '', website: '', email: '', social: '', colors: [] };
    var foldersShown = s.folders.slice(0, 10);
    /* "Add Files" modal (Figma 6160:130753 / 130855 / 130957): tick one or more destination folders;
       › previews a folder's contents (breadcrumb "Folders › Name"). Files are added, duplicates skipped. */
    var mv = s.mv || { ids: [], picked: {}, q: '', view: '', vq: '', limit: MV_PAGE };
    var setMv = function (o) { self.setState({ mv: Object.assign({}, self.state.mv, o) }); };
    var mvList = s.folders.filter(function (f) { return contains(f.name, mv.q); });
    var mvPicked = s.folders.filter(function (f) { return mv.picked && mv.picked[f.name]; }).map(function (f) { return f.name; });
    var mvAll = mvList.length > 0 && mvList.every(function (f) { return mv.picked[f.name]; });
    var mvSrc = s.panel && mv.ids && mv.ids.every(function (id) { return byIdM[id] && inF(byIdM[id], s.panel); }) ? s.panel : 'All assets';
    var mvView = mv.view ? s.media.filter(function (m) { return inF(m, mv.view) && contains(m.title, mv.vq); }) : [];
    var back = function () { return { modal: self.state.ret || '', ret: '' }; };
    // Upload Media flow: host/advertiser → playlists → pick files (Upload Content modal).
    var toFiles = function () { self.setState({ modal: 'ucm', ucCtx: 'upload' }); };
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
      // Bulk actions need 2+ selected: Bulk Delete counts thumbnails and folders together;
      // Bulk Move is for thumbnails only, so it stays off while any folder is selected.
      moveOff: selIds.length < 2 || fselNames.length > 0,
      delOff: selIds.length + fselNames.length < 2,
      moveHint: fselNames.length ? 'Bulk Move works on thumbnails only — unselect folders to move files' : 'Select 2 or more thumbnails to move them',
      delHint: 'Select 2 or more thumbnails or folders to delete them',
      // Shown next to Bulk Move whenever a bulk action is available (2+ selected); clears every selection.
      unmarkAll: function () { self.setState({ sel: {}, fsel: {} }); },
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
      items: vis.map(function (m) { return card(m, 'main'); }),
      dragging: !!s.drag,
      mainDz: zone('main', function (d) { return d.from === 'panel'; }, function (ids) { removeFrom(self.state.panel, ids); }),
      empty: list.length === 0, shown: vis.length, matched: list.length, hasMore: list.length > vis.length,
      more: function () { self.setState({ limit: self.state.limit + 20 }); },
      panel: pf ? { open: true, name: pf.name, host: (byId(D.hosts, pf.host) || {}).name || 'Not assigned', adv: (byId(D.advertisers, pf.adv) || {}).name || 'Not assigned', created: pf.created, modified: pf.modified,
        count: s.media.filter(function (m) { return inF(m, pf.name); }).length, items: pItems.slice(0, s.panelLimit).map(function (m) { return card(m, 'panel'); }),
        dz: zone('panel', function (d) { return d.from === 'main'; }, function (ids) { addTo(pf.name, ids); }), shown: Math.min(s.panelLimit, pItems.length), matched: pItems.length, hasMore: pItems.length > s.panelLimit, empty: pItems.length === 0,
        more: function () { self.setState({ panelLimit: self.state.panelLimit + PANEL_PAGE }); } } : { open: false },
      closePanel: function () { self.setState({ panel: '' }); },
      panelQ: s.panelQ, setPanelQ: function (v) { self.setState({ panelQ: val(v) }); },
      // + tile in the folder panel → Upload Content modal; uploaded files land in the open folder.
      openAddToFolder: function () { self.setState({ modal: 'ucm', ucCtx: 'folder', menu: '' }); },
      ucFolder: s.ucCtx === 'folder' ? s.panel : '',
      // Files picked in Upload Content: from the folder panel they go into that folder (with its host/advertiser);
      // from "Upload Media" they get the host/advertiser/playlists chosen in the earlier steps.
      ucUpload: function (files) {
        var st = self.state, fromFolder = st.ucCtx === 'folder';
        var pfo = fromFolder ? (st.folders.filter(function (f) { return f.name === st.panel; })[0] || {}) : {};
        var u = st.up || { pls: {} }, uh = hostByName(u.host), ua = D.advertisers.filter(function (a) { return a.name === u.adv; })[0];
        var hostId = fromFolder ? pfo.host || null : (uh ? uh.id : null), advId = fromFolder ? pfo.adv || null : (ua ? ua.id : null);
        var used = !fromFolder && Object.keys(u.pls).some(function (k) { return u.pls[k]; });
        var stamp = Date.now();
        var add = files.map(function (f, i) { return { id: 'mu' + stamp + i, title: f.name, kind: f.kind, image: f.image || D.B.advert, video: f.video || undefined, source: advId ? 'Advertisers' : (hostId ? 'Hosts' : 'Others'), used: used, adv: advId, host: hostId, fl: pfo.name ? [pfo.name] : [], uploaded: 'Nov 11, 2026', size: f.size, duration: f.kind === 'video' ? '30 sec' : '15 sec', res: f.res }; });
        var n = add.length;
        self.setState({ media: add.concat(st.media), modal: '', up: null, ucCtx: '' });
        toast(self, n + (n === 1 ? ' asset' : ' assets') + ' Added', 'success', pfo.name ? 'Added to “' + pfo.name + '”' : (ua ? 'Assigned to ' + ua.name : (uh ? 'Assigned to ' + uh.name : 'Added to your library')));
      },
      ucClose: function () { self.setState({ modal: '', up: null, ucCtx: '' }); },
      // Success pop-up (Folder Reassigned / Advertiser Profile Created); Ok returns to `back`.
      okm: s.okm || { title: '', text: '' },
      okDone: function () { var b = (self.state.okm || {}).back || ''; self.setState({ modal: b, okm: null }); },
      filterOpen: s.filterOpen, openFilter: function () { self.setState({ filterOpen: true }); }, closeFilter: function () { self.setState({ filterOpen: false }); },
      applyFilter: function (x) { self.setState({ filterOpen: false, host: x.host, hostName: x.hostName, adv: x.adv || '' }); },
      m: { ucm: s.modal === 'ucm', ok: s.modal === 'ok', nf: s.modal === 'nf', adp: s.modal === 'adp', folders: s.modal === 'folders', confirm: s.modal === 'confirm', folder: s.modal === 'folder', reassign: s.modal === 'reassign', move: s.modal === 'move', upload: s.modal === 'upload' },
      closeModal: close,
      /* Bulk Delete (recording): "Delete Selected Media" lists the folders the files are in (red note);
         "Delete Selected Folders?" says the files stay in All Contents. Both end in a success pop-up. */
      askBulkDelete: function () {
        var nfi = selIds.length, nf = fselNames.length;
        var fset = []; selIds.forEach(function (id) { (byIdM[id] && byIdM[id].fl || []).forEach(function (n) { if (fset.indexOf(n) === -1) fset.push(n); }); });
        var inside = s.media.filter(function (m) { return fselNames.some(function (n) { return inF(m, n); }); }).length;
        var title = nfi && nf ? 'Delete Selected Items?' : (nf ? 'Delete Selected Folders?' : 'Delete Selected Media');
        self.setState({ modal: 'confirm', cf: { title: title, bulk: true, act: 'files', ids: selIds, folders: fselNames,
          nFiles: nfi, nFolders: nf, inFolders: fset.length, folderPreview: fset.slice(0, 3).join(', ') + (fset.length > 3 ? ' +' + (fset.length - 3) + ' more' : ''), filesInside: inside } });
      },
      cf: s.cf || { title: '', text: '' },
      cfOk: function () {
        var c = self.state.cf;
        var dropFl = function (m, names) { return names.some(function (n) { return inF(m, n); }) ? Object.assign({}, m, { fl: m.fl.filter(function (n) { return names.indexOf(n) === -1; }) }) : m; };
        if (c.act === 'folder') { self.setState(Object.assign(back(), { folders: self.state.folders.filter(function (f) { return f.name !== c.key; }), media: self.state.media.map(function (m) { return dropFl(m, [c.key]); }), panel: self.state.panel === c.key ? '' : self.state.panel, cf: null })); toast(self, 'Folder deleted'); }
        else {
          var sel2 = Object.assign({}, self.state.sel); c.ids.forEach(function (id) { delete sel2[id]; });
          var gone = c.folders || [];
          var media2 = self.state.media.filter(function (m) { return c.ids.indexOf(m.id) === -1; }).map(function (m) { return dropFl(m, gone); });
          var next = { media: media2, sel: sel2, fsel: gone.length ? {} : self.state.fsel, folders: self.state.folders.filter(function (f) { return gone.indexOf(f.name) === -1; }), panel: gone.indexOf(self.state.panel) !== -1 ? '' : self.state.panel, cf: null };
          if (c.bulk) {
            var okm = c.ids.length && gone.length ? { title: 'Items Deleted', text: 'The selected media files and folders have been deleted successfully.' }
              : (gone.length ? { title: 'Folders Deleted', text: 'The selected Folders have been deleted successfully.' } : { title: 'Media Deleted', text: 'The selected media files have been deleted successfully.' });
            self.setState(Object.assign(next, { modal: 'ok', ret: '', okm: Object.assign(okm, { back: '' }) }));
          } else {
            self.setState(Object.assign(back(), next));
            toast(self, plural(c.ids.length, 'file', 'files') + ' deleted');
          }
        }
      },
      // New Folder (recording): name + Assign Host; then Assign Advertiser, or a notice when the host has none.
      newFolder: function () { self.setState({ modal: 'nf', nf: { name: '', host: '', adv: '' } }); },
      nf: { name: nf.name, host: nf.host, adv: nf.adv, advs: nfAdvs.map(function (a) { return a.name; }), hasAdvs: nfAdvs.length > 0, noAdvs: !!nfHost && nfAdvs.length === 0, bad: !nf.name.trim(),
        setName: function (v) { self.setState({ nf: Object.assign({}, self.state.nf, { name: val(v) }) }); },
        setHost: function (v) { self.setState({ nf: Object.assign({}, self.state.nf, { host: val(v), adv: '' }) }); },
        setAdv: function (v) { self.setState({ nf: Object.assign({}, self.state.nf, { adv: val(v) }) }); },
        save: function () { var x = self.state.nf, n = x.name.trim(), h = hostByName(x.host), a = D.advertisers.filter(function (q) { return q.name === x.adv; })[0];
          // Success is a pop-up (recording), not a toast.
          self.setState({ modal: 'ok', nf: null, okm: { title: 'New Folder Added', text: 'The Folder “' + n + '” was successfully assigned and added to the folder section.', back: '' },
            folders: [{ name: n, host: h ? h.id : '', adv: a ? a.id : '', created: 'Nov 11, 2026, 9:55 AM', modified: 'Nov 11, 2026, 9:55 AM' }].concat(self.state.folders) }); } },
      // Rename (recording): the field starts empty with the current name as its placeholder.
      fd: s.fd ? { title: s.fd.mode === 'file' ? 'Rename File' : 'Rename Folder', sub: s.fd.mode === 'file' ? 'Enter a new name for this file' : 'Enter a new name for this folder', label: s.fd.mode === 'file' ? 'File Name' : 'Folder Name', placeholder: s.fd.old || 'Enter a name', ok: 'Save Changes', name: s.fd.name, bad: !s.fd.name.trim() || s.fd.name.trim() === s.fd.old,
        set: function (v) { self.setState({ fd: Object.assign({}, self.state.fd, { name: val(v) }) }); },
        save: function () { var x = self.state.fd, n = x.name.trim();
          if (x.mode === 'file') { self.setState(Object.assign(back(), { media: self.state.media.map(function (m) { return m.id === x.id ? Object.assign({}, m, { title: n }) : m; }), fd: null })); toast(self, 'File renamed to “' + n + '”'); }
          else if (x.mode === 'new') { self.setState(Object.assign(back(), { folders: [{ name: n, host: '', adv: '', created: 'Nov 10, 2026, 9:55 AM', modified: 'Nov 10, 2026, 9:55 AM' }].concat(self.state.folders), fd: null })); toast(self, 'Folder “' + n + '” Created'); }
          else { self.setState(Object.assign(back(), { folders: self.state.folders.map(function (f) { return f.name === x.old ? Object.assign({}, f, { name: n, modified: 'Nov 10, 2026, 9:55 AM' }) : f; }), media: self.state.media.map(function (m) { return inF(m, x.old) ? Object.assign({}, m, { fl: m.fl.map(function (k) { return k === x.old ? n : k; }) }) : m; }), panel: self.state.panel === x.old ? n : self.state.panel, fd: null })); toast(self, 'Folder renamed'); } } } : { title: '', sub: '', label: '', placeholder: '', ok: '', name: '', bad: true },
      hostOptions: D.hosts.map(function (h) { return h.name; }),
      ra: { name: ra.name, host: ra.host, adv: ra.adv, hostPh: ra.curHost || 'Select Host Name', advPh: (!ra.host && ra.curAdv) || 'Select Advertiser Name',
        noHost: !raHost, advs: raHost ? advsOf(raHost.id).map(function (a) { return a.name; }) : [],
        bad: !ra.host && !ra.adv,
        setHost: function (v) { self.setState({ ra: Object.assign({}, self.state.ra, { host: val(v), adv: '' }) }); },
        setAdv: function (v) { self.setState({ ra: Object.assign({}, self.state.ra, { adv: val(v) }) }); },
        save: function () { var r = self.state.ra, h = hostByName(r.host || r.curHost), a = D.advertisers.filter(function (x) { return x.name === r.adv; })[0];
          // A new host without a picked advertiser clears the old advertiser; keeping the host keeps it unless a new one is picked.
          var advId = a ? a.id : (r.host ? '' : (D.advertisers.filter(function (x) { return x.name === r.curAdv; })[0] || {}).id || '');
          self.setState({ modal: 'ok', ret: '', okm: { title: 'Folder Reassigned', text: 'The folder has been successfully reassigned to the selected host and Advertiser', back: self.state.ret || '' },
            folders: self.state.folders.map(function (f) { return f.name === r.name ? Object.assign({}, f, { host: h ? h.id : '', adv: advId, modified: 'Nov 11, 2026, 9:55 AM' }) : f; }), ra: null }); } },
      openMove: function () { self.setState({ modal: 'move', mv: { ids: selIds, picked: {}, q: '', view: '', vq: '', limit: MV_PAGE } }); },
      mv: {
        n: (mv.ids || []).length, src: mvSrc, q: mv.q, setQ: function (v) { setMv({ q: val(v) }); },
        allOn: mvAll, toggleAll: function () { var p = Object.assign({}, self.state.mv.picked); mvList.forEach(function (f) { if (mvAll) delete p[f.name]; else p[f.name] = true; }); setMv({ picked: p }); },
        rows: mvList.map(function (f) { var on = !!mv.picked[f.name];
          return { name: f.name, on: on,
            toggle: function () { var p = Object.assign({}, self.state.mv.picked); if (p[f.name]) delete p[f.name]; else p[f.name] = true; setMv({ picked: p }); },
            view: function (e) { if (e && e.stopPropagation) e.stopPropagation(); setMv({ view: f.name, vq: '', limit: MV_PAGE }); } }; }),
        empty: mvList.length === 0,
        // Folder preview (breadcrumb view)
        view: mv.view, viewing: !!mv.view, back: function () { setMv({ view: '' }); },
        vq: mv.vq, setVq: function (v) { setMv({ vq: val(v), limit: MV_PAGE }); },
        vCount: mv.view ? s.media.filter(function (m) { return inF(m, mv.view); }).length : 0,
        vItems: mvView.slice(0, mv.limit || MV_PAGE).map(function (m) { var b = BADGE[m.kind] || BADGE.image; return { id: m.id, title: m.title, image: m.image, badge: b[0], badgeColor: b[1], open: navFn('DealerMediaDetail.dc.html', { id: m.id }) }; }),
        vMore: mvView.length > (mv.limit || MV_PAGE), more: function () { setMv({ limit: (self.state.mv.limit || MV_PAGE) + MV_PAGE }); },
        vEmpty: mvView.length === 0,
        bad: mvPicked.length === 0,
        go: function () {
          var st = self.state, ids = st.mv.ids, dests = s.folders.filter(function (f) { return st.mv.picked[f.name]; }).map(function (f) { return f.name; });
          var added = 0, dup = 0;
          var media2 = st.media.map(function (m) { if (ids.indexOf(m.id) === -1) return m; var o = m; dests.forEach(function (d) { if (inF(o, d)) dup++; else { o = withF(o, d); added++; } }); return o; });
          self.setState({ media: media2, sel: {}, modal: '', mv: null });
          var where = dests.length === 1 ? '“' + dests[0] + '”' : dests.length + ' folders';
          if (!added) toast(self, plural(dup, 'duplicate file was found.', 'duplicate files were found.'), 'error', 'Existing files were skipped');
          else toast(self, plural(ids.length, 'asset', 'assets') + ' Added', 'success', 'Added to ' + where + (dup ? ' · ' + plural(dup, 'duplicate', 'duplicates') + ' skipped' : ''));
        }
      },
      openUpload: function () { self.setState({ modal: 'upload', up: { step: 0, host: '', adv: '', pls: {} } }); },
      up: {
        isAssign: up.step === 0, isPlaylist: up.step === 1,
        sub: up.step === 0 ? 'Select a Dealer, Host, and Advertiser to assign this content.' : 'Select a playlist to add this content.',
        host: up.host, adv: up.adv, setHost: function (v) { setUp({ host: val(v), adv: '' }); }, setAdv: function (v) { setUp({ adv: val(v) }); },
        hasAdvs: upAdvs.length > 0, noAdvs: !!upHost && upAdvs.length === 0, advs: upAdvs.map(function (a) { return a.name; }),
        plOptions: D.playlists.map(function (p) { return { id: p.id, name: p.name }; }), pls: up.pls,
        togglePl: function (id) { var o = Object.assign({}, self.state.up.pls); if (o[id]) delete o[id]; else o[id] = true; setUp({ pls: o }); },
        createAd: function () { self.setState({ modal: 'adp', adp: { logo: '', logoName: '', name: '', website: '', email: '', social: '', colors: [] } }); },
        // Skip on step 1 clears the assignment; Skip on step 2 clears playlists. Done moves on either way.
        skip: function () { if (self.state.up.step === 0) setUp({ step: 1, host: '', adv: '' }); else { setUp({ pls: {} }); toFiles(); } },
        next: function () { if (self.state.up.step === 0) setUp({ step: 1 }); else toFiles(); }
      },
      // Create Advertiser Profile (from Upload Content when the host has no advertisers).
      adp: adp, adpBad: !adp.name.trim(),
      setAdp: function (o) { self.setState({ adp: Object.assign({}, self.state.adp, o) }); },
      adpBack: function () { self.setState({ modal: 'upload' }); },
      adpCancel: function () { self.setState({ modal: '', adp: null, up: null }); },
      adpSave: function () {
        var st = self.state, x = st.adp, h = hostByName(st.up.host), n = x.name.trim();
        var adv = { id: 'ax' + Date.now(), name: n, logo: x.logo, website: x.website, email: x.email, social: x.social, colors: x.colors, created: true };
        D.advertisers.push(adv);
        var ex = Object.assign({}, st.extraAdvs); if (h) ex[h.id] = (ex[h.id] || []).concat([adv]);
        self.setState({ extraAdvs: ex, adp: null, up: Object.assign({}, st.up, { adv: n }), modal: 'ok', okm: { title: 'Advertiser Profile Created', text: 'Hurray! You successfully created an Advertiser Profile', back: 'upload' } });
      },
      toast: toastVals(s.toast, this)
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
              {/* Secondary style per Figma 7673:130020 (white, gray border + text). */}
              <NTV.Button variant="secondary" size="xl" iconRight="folder-plus" className="ml-btn-nf" onClick={v.newFolder}>New Folder</NTV.Button>
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
            <div className="dv-row" style={{ flexWrap: "wrap", gap: "16px" }}>
              <div className="ml-typesel" style={{ width: "210px", flex: "none" }}>
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
              {!v.delOff ? <NTV.Button variant="primary" size="xl" iconRight="x" onClick={v.unmarkAll}>Unmark All</NTV.Button> : null}
              <span title={v.moveOff ? v.moveHint : undefined}><NTV.Button variant="primary" size="xl" iconRight="arrows-rotate" disabled={v.moveOff} onClick={v.openMove}>Bulk Move</NTV.Button></span>
              <span title={v.delOff ? v.delHint : undefined}><NTV.Button variant="primary" size="xl" iconRight="trash" disabled={v.delOff} onClick={v.askBulkDelete}>Bulk Delete</NTV.Button></span>
            </div>
          </div>
          <div className={v.panel?.open ? "ml-split ml-split--open" : "ml-split"}>
            <section className="dv-card ml-pane ml-main">
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
                <div className={"ml-scroll" + (v.mainDz?.on ? " ml-drop" : "")} onDragOver={v.mainDz?.over} onDragLeave={v.mainDz?.leave} onDrop={v.mainDz?.drop}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${s(v.mediaCols)}, minmax(0, 1fr))`, gap: "10px" }}>
                  {(v.items || []).map((_m) => <MediaCard key={_m.id} c={_m} />)}
                </div>
                  {v.empty ? (
                  <>
                    <div className="dv-empty">No media match these filters.</div>
                  </>
                ) : null}
                </div>
              ) : null}
              <div className="dv-between ml-foot">
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
                <aside className={"dv-card ml-pane ml-panel" + (v.panel?.dz?.on ? " ml-drop" : "")} onDragOver={v.panel?.dz?.over} onDragLeave={v.panel?.dz?.leave} onDrop={v.panel?.dz?.drop}>
                {/* Layout per Figma 7637:129889 "Folder preview" (620×670). */}
                <div className="ml-pnl-head">
                  <h2 className="ml-pnl-title"><NTV.Icon name="folder" size={20} /><span>{v.panel?.name}</span></h2>
                  <button type="button" className="ml-pnl-x" aria-label="Close folder" onClick={v.closePanel}><NTV.Icon name="x" size={20} /></button>
                </div>
                <div className="ml-pnl-info">
                  <div className="ml-pnl-row ml-pnl-row--top">
                    <div className="ml-pnl-kv"><span>Assigned Host</span><span title={v.panel?.host}>{v.panel?.host}</span></div>
                    <div className="ml-pnl-kv"><span>Assigned Advertiser</span><span title={v.panel?.adv}>{v.panel?.adv}</span></div>
                  </div>
                  <div className="ml-pnl-row">
                    <div className="ml-pnl-kv"><span>Date Created</span><span>{v.panel?.created}</span></div>
                    <div className="ml-pnl-kv"><span>Date Modified</span><span>{v.panel?.modified}</span></div>
                  </div>
                </div>
                <div className="ml-pnl-media">
                  <span className="ml-pnl-label">{"Media Contents "}<span>({v.panel?.count})</span></span>
                  <NTV.Input size="l" placeholder="Search Images, Videos or Widgets" iconLeft="magnifying-glass" iconRight="sparkles" label="Search folder" value={v.panelQ} onChange={v.setPanelQ} className="ml-pnl-search" />
                </div>
                {v.panel?.count === 0 ? (
                  // Empty folder (Figma 7659:130010): + opens Upload Content, same as the + tile.
                  <div className="ml-pnl-empty">
                    <button type="button" className="ml-pnl-empty-add" aria-label="Upload media to this folder" onClick={v.openAddToFolder}><NTV.Icon name="plus" size={22} /></button>
                    <div>
                      <p className="ml-pnl-empty-title">There’s no media contents yet</p>
                      <p className="ml-pnl-empty-sub">Upload media to get started</p>
                    </div>
                  </div>
                ) : (
                <div className="ml-scroll ml-pnl-grid">
                  <div className="ml-pnl-cards">
                    <button type="button" className="ml-add" aria-label="Add files to folder" onClick={v.openAddToFolder}><NTV.Icon name="plus" size={24} /></button>
                    {(v.panel?.items || []).map((_m) => <MediaCard key={_m.id} c={_m} small />)}
                  </div>
                  {v.panel?.empty ? <p className="dv-sub" style={{ marginTop: "12px" }}>No media in this folder match “{v.panelQ}”.</p> : null}
                </div>
                )}
                {v.panel?.hasMore ? (
                  <div className="dv-between ml-foot">
                    <span className="dv-sub" style={{ fontSize: "11px" }}>{"Showing "}{v.panel?.shown}{" of "}{v.panel?.matched}{" items"}</span>
                    <button type="button" className="dv-a" onClick={v.panel?.more} style={{ fontSize: "11px", fontWeight: "500", color: "var(--fg-primary)" }}>Show More...</button>
                  </div>
                ) : null}
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
          {/* StatusModal already wraps children in a <p>, so the text goes in as plain text and the buttons as `actions`. */}
          <NTV.StatusModal status="warning" title={v.cf?.title} width={v.w460} className="ml-cfmodal"
            actions={<>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.cfOk}>Delete</button>
            </>}>
            {/* StatusModal wraps children in a <p>: use spans (display:block) for the red note. */}
            {v.cf?.bulk ? (
              <>
                {v.cf?.nFiles ? <span className="ml-cfline">Are you sure you want to delete the selected <b>{v.cf?.nFiles}</b> media contents{v.cf?.nFolders ? <> and <b>{v.cf?.nFolders}</b> folders</> : null}?</span> : null}
                {!v.cf?.nFiles ? <span className="ml-cfline">Are you sure you want to delete these ({v.cf?.nFolders}) folders. This won’t delete any media — the <b>{v.cf?.filesInside} files</b> they contain will remain in All Contents. Only the folders and their organization will be removed.</span> : null}
                {v.cf?.nFiles ? (
                  <span className="ml-cfbox">
                    {v.cf?.inFolders ? <span>These files are in <b>{v.cf?.inFolders} {v.cf?.inFolders === 1 ? "folder" : "folders"}</b> ({v.cf?.folderPreview}). Deleting it will remove it from all of them.</span> : null}
                    {v.cf?.nFolders ? <span>Files inside the selected folders stay in All Contents.</span> : null}
                    <b className="ml-cfbox-warn">This action is permanent and cannot be undone</b>
                  </span>
                ) : null}
              </>
            ) : v.cf?.text}
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.folder ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={v.fd?.title} width={v.w500} onClose={v.closeModal} className="ml-fmodal">
            <p className="ml-fsub">{v.fd?.sub}</p>
            <div className="ml-ffields">
              <div className="ml-ffield">
                <label htmlFor="fd">{v.fd?.label}</label>
                <input id="fd" className="dv-field" placeholder={v.fd?.placeholder} value={v.fd?.name} onChange={v.fd?.set} autoFocus />
              </div>
            </div>
            <div className="ml-ffoot">
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
          <NTV.Modal title="Reassign Folder" width={v.w500} onClose={v.closeModal} className="ml-fmodal">
            <p className="ml-fsub">Assign the folder to a different host or advertiser</p>
            <div className="ml-ffields">
              <PickField label="Assign Host" placeholder={v.ra?.hostPh} options={v.hostOptions} value={v.ra?.host} onChange={v.ra?.setHost} />
              <PickField label="Assign Advertiser" placeholder={v.ra?.advPh} options={v.ra?.advs} value={v.ra?.adv} onChange={v.ra?.setAdv} disabled={v.ra?.noHost} />
            </div>
            <div className="ml-ffoot">
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.ra?.bad} onClick={v.ra?.save}>Update</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.move ? (
        <>
          <div className="dv-ov">
          {/* "Add Files" (Figma 6160:130753 list · 130855 selected · 130957 folder preview). */}
          <NTV.Modal title="Add Files" width={750} onClose={v.closeModal} className="ml-fmodal ml-mvmodal">
            <p className="ml-fsub">Select a folder to show content Destination</p>
            {v.mv?.viewing ? (
              <>
                <nav className="ml-mvcrumbs" aria-label="Breadcrumb">
                  <button type="button" onClick={v.mv?.back}>Folders</button>
                  <NTV.Icon name="angle-right" size={v.i12} />
                  <b>{v.mv?.view}</b>
                </nav>
                <div className="ml-mvbox ml-mvprev">
                  <div className="dv-between" style={{ flexWrap: "nowrap" }}>
                    <span className="ml-mvprev-t">{"Media Contents "}<span>({v.mv?.vCount})</span></span>
                    <NTV.Input size="l" placeholder="Search Images, Videos or Widgets" iconLeft="magnifying-glass" iconRight="sparkles" label="Search folder" value={v.mv?.vq} onChange={v.mv?.setVq} style={{ width: "300px" }} />
                  </div>
                  <div className="ml-mvgrid">
                    {(v.mv?.vItems || []).map((_m) => (
                      <div key={_m.id} className="ml-mvcard">
                        <div className="ml-mvthumb"><img src={_m.image} alt="" /><span className="ml-badge" style={{ color: _m.badgeColor }}>{_m.badge}</span></div>
                        <div className="ml-mvcard-row">
                          <span title={_m.title}>{_m.title}</span>
                          <a className="dv-ib ml-eye ml-eye--round" href="DealerMediaDetail.dc.html" data-nav={_m.openNav} onClick={_m.open} aria-label={"View details of " + _m.title}><NTV.Icon name="eye" size={10} /></a>
                        </div>
                      </div>
                    ))}
                  </div>
                  {v.mv?.vEmpty ? <p className="dv-sub" style={{ textAlign: "center", margin: "24px 0" }}>This folder is empty.</p> : null}
                  {v.mv?.vMore ? <button type="button" className="dv-a ml-mvmore" onClick={v.mv?.more}>Show More...</button> : null}
                </div>
              </>
            ) : (
              <>
                <div className="dv-between ml-mvtools" style={{ flexWrap: "nowrap" }}>
                  <label className="ml-mvall"><NTV.Checkbox checked={v.mv?.allOn} onChange={v.mv?.toggleAll} />Select All</label>
                  <NTV.Input size="m" placeholder="Search Folders..." iconLeft="magnifying-glass" iconRight="sparkles" label="Search folders" value={v.mv?.q} onChange={v.mv?.setQ} style={{ width: "300px" }} />
                </div>
                <div className="ml-mvbox ml-mvlist" role="listbox" aria-multiselectable="true" aria-label="Destination folders">
                  {(v.mv?.rows || []).map((_r) => (
                    <div key={_r.name} role="option" aria-selected={_r.on} tabIndex={0} className={"ml-mvrow" + (_r.on ? " on" : "")} onClick={_r.toggle}
                      onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && e.target === e.currentTarget) { e.preventDefault(); _r.toggle(); } }}>
                      <span className="ml-mvrow-l">
                        <span onClick={(e) => e.stopPropagation()}><NTV.Checkbox checked={_r.on} onChange={_r.toggle} aria-label={"Select " + _r.name} /></span>
                        <NTV.Icon name="folder" size={v.i14} />
                        <span>{_r.name}</span>
                      </span>
                      <button type="button" className="ml-mvview" onClick={_r.view} aria-label={"View folder " + _r.name}><span>View Folder</span><NTV.Icon name="angle-right-solid" size={v.i12} /></button>
                    </div>
                  ))}
                  {v.mv?.empty ? <p className="dv-sub" style={{ textAlign: "center", margin: "24px 0" }}>No folders match “{v.mv?.q}”.</p> : null}
                </div>
              </>
            )}
            <div className="ml-mvfoot">
              <span className="ml-mvnote"><NTV.Icon name="circle-exclamation" size={v.i14} /><span>You are adding <b>{v.mv?.n}</b> Media {v.mv?.n === 1 ? "File" : "Files"} from <strong>{v.mv?.src}</strong></span></span>
              <div className="dv-row">
                <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal} style={{ width: "106px" }}>Cancel</NTV.Button>
                <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.mv?.bad} onClick={v.mv?.go} style={{ width: "100px" }}>Add</NTV.Button>
              </div>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.upload ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Upload Content" width={v.up?.isAssign ? 605 : v.w500} onClose={v.closeModal} className="ml-fmodal">
            <p className="ml-fsub">{v.up?.sub}</p>
            {v.up?.isAssign ? (
              <div className="ml-ffields">
                <PickField label="Host" placeholder="Select Host Name" options={v.hostOptions} value={v.up?.host} onChange={v.up?.setHost} />
                {v.up?.noAdvs ? (
                  <div className="ml-ferr" role="alert"><NTV.Icon name="circle-exclamation" size={14} /><span>No advertiser Found for this Host. Click “Create Ad Profile” to add one</span></div>
                ) : (
                  <PickField label="Advertiser" placeholder="Select Advertiser Name" options={v.up?.advs} value={v.up?.adv} onChange={v.up?.setAdv} disabled={!v.up?.hasAdvs} />
                )}
              </div>
            ) : null}
            {v.up?.isPlaylist ? <PlaylistPicker options={v.up?.plOptions} selected={v.up?.pls} onToggle={v.up?.togglePl} /> : null}
            <div className="ml-ffoot">
              {v.up?.isAssign && v.up?.noAdvs ? <NTV.Button variant="primary" size="xl" iconRight={v.none} className="ml-ffoot-left" onClick={v.up?.createAd}>Create Ad Profile</NTV.Button> : null}
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.up?.skip}>Skip</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.up?.next}>Done</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.nf ? (
        <div className="dv-ov">
          <NTV.Modal title="New Folder" width={v.w500} onClose={v.closeModal} className="ml-fmodal">
            <p className="ml-fsub">Create a folder to organize media assets</p>
            <div className="ml-ffields">
              <div className="ml-ffield">
                <label htmlFor="nf-name">Folder Name</label>
                <input id="nf-name" className="dv-field" placeholder="Ex. Educational Assets" value={v.nf?.name} onChange={v.nf?.setName} autoFocus />
              </div>
              <PickField label="Assign Host" placeholder="Ex. SM Mall" options={v.hostOptions} value={v.nf?.host} onChange={v.nf?.setHost} />
              {v.nf?.noAdvs ? <div className="ml-ferr" role="alert"><NTV.Icon name="circle-exclamation" size={14} /><span>No Advertiser found for this host</span></div> : null}
              {v.nf?.hasAdvs ? <PickField label="Assign Advertiser" placeholder="Ex. Jollibee" options={v.nf?.advs} value={v.nf?.adv} onChange={v.nf?.setAdv} /> : null}
            </div>
            <div className="ml-ffoot">
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.nf?.bad} onClick={v.nf?.save}>Create</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
      ) : null}
      {v.m?.adp ? (
        <div className="dv-ov">
          <NTV.Modal title="Create Advertiser Profile" width={538} onClose={v.adpCancel} className="ml-fmodal">
            <p className="ml-fsub">Add new Advertiser for this host</p>
            <AdProfileForm v={v.adp} set={v.setAdp} />
            <div className="ml-ffoot">
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} className="ml-ffoot-left" onClick={v.adpBack}>Back</NTV.Button>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.adpCancel}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.adpBad} onClick={v.adpSave}>Create Ad Profile</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
      ) : null}
      {v.m?.ok ? (
        <div className="dv-ov">
          <NTV.StatusModal status="success" title={v.okm?.title} width={400} className="ml-okmodal"
            actions={<NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.okDone}>Ok</NTV.Button>}>
            {v.okm?.text}
          </NTV.StatusModal>
        </div>
      ) : null}
      {v.m?.ucm ? <UploadContentModal folder={v.ucFolder} onClose={v.ucClose} onUpload={v.ucUpload} /> : null}
      <Toast t={v.toast} />
    </div>
    </div>
));

export { FOLDERS };
export default Component;
