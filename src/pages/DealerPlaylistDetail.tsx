// @ts-nocheck
/**
 * Page: Playlist Details  (route /playlists/detail)
 * Converted from the Claude Design artboard DealerPlaylistDetail.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, arrived, byId, contains, hostName, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import ContentBlock from '../components/ContentBlock';
import ContentThumb from '../components/ContentThumb';
import DealerNav from '../components/DealerNav';
import PushFlow from '../components/PushFlow';
import ScreenPreview from '../components/ScreenPreview';
import './DealerPlaylistDetail.css';

/* ============================== Logic ============================== */

// Filter by → Content Type options (Figma "Single Page - All Use Cases", node 5596:34236)
var KINDS = [{ key: 'image', label: 'Image' }, { key: 'video', label: 'Video' }, { key: 'widget', label: 'Widget' }, { key: 'block', label: 'Block' }];

// "Today" for schedule status (the mock data's current date)
var TODAY = '2026-11-10';
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var fmtDate = function (iso) { var x = (iso || '').split('-'); return x.length === 3 ? MON[+x[1] - 1] + ' ' + (+x[2]) : iso; };
// Schedule status → caption color (Figma: green playing, orange upcoming, red ended)
var schedState = function (it) { if (it.always || !it.start || !it.end) return ''; return TODAY < it.start ? 'upcoming' : (TODAY > it.end ? 'expired' : 'active'); };
var SCHED = { active: ['var(--success-main)', 'Playing now'], upcoming: ['var(--warning-main)', 'Upcoming'], expired: ['var(--danger-main)', 'Ended'] };
// Block group frame colors, in order of appearance
var GROUP_COLORS = ['var(--warning-main)', 'var(--danger-main)', 'var(--success-main)', 'var(--primary-400)'];
var GRID_COLS = 8;
// List view helpers (Figma "Single Page - List", node 5596:34412)
var MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var fullDate = function (d) { var x = /^([A-Z][a-z]{2}) (\d+), (\d{4})$/.exec(d || ''); if (!x) return d || '—'; var i = MON.indexOf(x[1]); return i < 0 ? d : MONTHS_FULL[i] + ' ' + x[2] + ', ' + x[3]; };
var longDur = function (d) { var n = parseInt(d, 10); if (isNaN(n)) return d || '—'; if (n < 60) return n + ' sec'; var m = Math.floor(n / 60), r = n % 60; return m + ' min' + (r ? ' and ' + r + ' sec' : ''); };
var uploaderOf = function (m) { if (m.adv) { var a = byId(D.advertisers, m.adv); if (a) return a.name; } if (m.host) return hostName(m.host); return 'Dealer Admin'; };
// Filter by → Content Schedule Status (pick one). Active = playing now or "Always play"; In Queue = upcoming; Inactive = ended
var SCHED_OPTS = [{ key: '', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'upcoming', label: 'In Queue' }, { key: 'expired', label: 'Inactive' }];
var PILL_OF = function (k) { return PILL[k] || PILL.image; };
var schedBucket = function (it) { return schedState(it) || 'active'; };
// Standalone thumbnail tag pills: [background, text]
var PILL = { image: ['var(--info-050)', 'var(--info-main)'], video: ['var(--danger-050)', 'var(--danger-main)'], widget: ['var(--teal-050)', 'var(--teal-600)'], block: ['var(--primary-050)', 'var(--fg-secondary)'] };

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerPlaylistDetail.dc.html') || {};
    var p = byId(D.playlists, f.id) || D.playlists[0];
    var items = p.items.map(function (id, i) { var m = byId(D.media, id); var blk = !!(p.block && i === 0); var sc = (p.schedules || {})[id];
      return m ? { key: 'k' + i, blk: blk, m: m, dur: m.duration || '15 sec', trans: 'Fade', mute: true, everywhere: true, hosts: {}, always: !sc, start: sc ? sc[0] : '', end: sc ? sc[1] : '',
        members: blk ? (p.blockMembers || []).map(function (mid) { return byId(D.media, mid); }).filter(Boolean) : null } : null; }).filter(Boolean);
    this.state = { view: 'grid', kinds: [], sched: '', q: '', folder: '', scQ: '', openHost: '', pvScreen: '', p: Object.assign({}, p), items: items, tab: 'Content', sel: {}, reorder: false, modal: '', menu: '', target: '', mvPos: '1', swQ: '', libQ: '', libLimit: 10, push: false, ad: null, md: null, info: null, toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state, p = s.p, itemVMs = [], libAll = [];
    var secs = function (d) { return parseInt(d, 10) || 15; };
    var loop = s.items.reduce(function (a, it) { return a + secs(it.dur); }, 0);
    var selKeys = Object.keys(s.sel).filter(function (k) { return s.sel[k]; });
    var scs = p.screens.map(function (id) { return byId(D.screens, id); }).filter(Boolean);
    var move = function (i, d) { var a = self.state.items.slice(), j = i + d; if (j < 0 || j >= a.length) return; var t = a[i]; a[i] = a[j]; a[j] = t; self.setState({ items: a }); };
    var inPl = {}; s.items.forEach(function (it) { inPl[it.m.id] = 1; });
    var close = function () { self.setState({ modal: '' }); };
    var addItems = function (ms) { var base = self.state.items.length; self.setState({ items: ms.map(function (m, i) { return { key: 'n' + Date.now() + i, blk: m.kind === 'block', m: m, dur: m.duration || '15 sec', trans: 'Fade', mute: true, everywhere: true, hosts: {}, always: true, start: '', end: '', members: m.members || null }; }).concat(self.state.items) }); };
    // add content wizard
    var ad = s.ad || { step: 0, kind: 'single', sel: {}, q: '', blockName: '', layout: '2 + 2 grid', dur: '15 sec' };
    var setAd = function (o) { self.setState({ ad: Object.assign({}, self.state.ad, o) }); };
    var picked = D.media.filter(function (m) { return ad.sel[m.id]; });
    var adSteps = ad.kind === 'block' ? ['Content Type', 'Select Assets', 'Settings', 'Preview'] : ['Content Type', 'Select Assets', 'Preview'];
    var stepName = adSteps[ad.step];
    // modify
    var md = s.md, mi = md ? s.items.filter(function (x) { return x.key === md.key; })[0] : null;
    var setMd = function (o) { self.setState({ md: Object.assign({}, self.state.md, o) }); };
    var info = s.info || { name: '', desc: '' };
    return {
      none: null, i12: 12, i14: 14, i32: 32, w460: 460, w500: 500, w640: 640, w960: 960,
      crumbs: [{ label: 'Playlist', href: 'DealerPlaylists.dc.html' }, p.name],
      name: p.name, desc: p.desc, count: s.items.length, loop: loop >= 60 ? Math.floor(loop / 60) + 'm ' + (loop % 60) + 's' : loop + 's',
      tabItems: [{ value: 'Content', label: 'Content Management' }, { value: 'Screens', label: 'Screens' }], tab: s.tab, setTab: function (x) { self.setState({ tab: x }); },
      i24: 24, i10: 10,
      filterLabel: (s.kinds.length + (s.sched ? 1 : 0)) ? 'Filter by (' + (s.kinds.length + (s.sched ? 1 : 0)) + ')' : 'Filter by',
      filterGroups: [{ title: 'Content Type', options: KINDS.map(function (k) {
        return { label: k.label, checked: s.kinds.indexOf(k.key) !== -1, onChange: function (on) {
          var cur = self.state.kinds; self.setState({ kinds: on ? cur.concat([k.key]) : cur.filter(function (x) { return x !== k.key; }) }); } };
      }) }, { title: 'Content Schedule Status', single: true, options: SCHED_OPTS.map(function (o) {
        return { label: o.label, checked: s.sched === o.key, onChange: function () { self.setState({ sched: o.key }); } };
      }) }],
      activeChips: KINDS.filter(function (k) { return s.kinds.indexOf(k.key) !== -1; }).map(function (k) { return { key: k.key, label: 'Type', value: k.label, tone: 'info',
        onRemove: function () { self.setState({ kinds: self.state.kinds.filter(function (x) { return x !== k.key; }) }); } }; }).concat(s.sched ? [{ key: 'sched', label: 'Schedule', value: SCHED_OPTS.filter(function (o) { return o.key === s.sched; })[0].label, tone: 'teal',
        onRemove: function () { self.setState({ sched: '' }); } }] : []),
      clearKinds: function () { self.setState({ kinds: [], sched: '' }); },
      view: s.view, setView: function (x) { self.setState({ view: x, reorder: x === 'list' ? false : self.state.reorder }); },
      q: s.q, setQ: function (v) { self.setState({ q: val(v) }); },
      allChecked: s.items.length > 0 && selKeys.length === s.items.length, someChecked: selKeys.length > 0 && selKeys.length < s.items.length,
      markLabel: s.items.length > 0 && selKeys.length === s.items.length ? 'Unmark All' : 'Mark All',
      bulkModify: function () { var k = selKeys[0], it = self.state.items.filter(function (x) { return x.key === k; })[0]; if (it) self.setState({ modal: 'modify', md: { key: it.key, tab: 'Basics', dur: it.dur, trans: it.trans, mute: it.mute, everywhere: it.everywhere, hosts: Object.assign({}, it.hosts), always: it.always, start: it.start || '2026-11-15', end: it.end || '2026-12-31', bulk: selKeys } }); },
      isGrid: s.view === 'grid', isList: s.view === 'list', toGrid: function () { self.setState({ view: 'grid' }); }, toList: function () { self.setState({ view: 'list' }); },
      libQ: s.libQ, setLibQ: function (v) { self.setState({ libQ: val(v), folder: val(v) ? '__search' : '', libLimit: 10 }); },
      inFolder: !!s.folder, notInFolder: !s.folder,
      folderName: s.folder === '__search' ? 'Search results' : (s.folder === '__assigned' ? 'My Contents' : (s.folder === '__floating' ? 'Floating Contents' : s.folder)),
      folderIcon: s.folder === '__assigned' ? 'users' : (s.folder === '__floating' ? 'ghost' : (s.folder === '__search' ? 'magnifying-glass' : '')),
      isRealFolder: !!s.folder && s.folder.indexOf('__') !== 0,
      backFolders: function () { self.setState({ folder: '', libQ: '', libLimit: 10 }); },
      openAssigned: function () { self.setState({ folder: '__assigned', libLimit: 10 }); }, openFloating: function () { self.setState({ folder: '__floating', libLimit: 10 }); },
      folders: ['Food Assets', 'Promo Videos', 'Brand Logos', 'Seasonal', 'Menus'].map(function (f) { return { name: f, n: D.media.filter(function (m) { return m.folder === f; }).length, open: function () { self.setState({ folder: f, libLimit: 10 }); } }; }),
      folderCount: 5, folderShown: 5,
      hostGroups: (function () { var g = {}; scs.forEach(function (sc) { if (!contains(sc.name + ' ' + hostName(sc.host), s.scQ)) return; (g[sc.host] = g[sc.host] || []).push(sc); }); return Object.keys(g).map(function (hid) { var open = s.openHost === hid || (!s.openHost && hid === Object.keys(g)[0]); return { name: hostName(hid), count: g[hid].length, open: open, icon: open ? 'angle-up' : 'angle-down', toggle: function () { self.setState({ openHost: open ? '-' : hid }); },
        screens: g[hid].map(function (sc) { var z = Object.keys(sc.zones).filter(function (k) { return sc.zones[k] === p.name; }); return { name: sc.name, template: sc.template, zone: z.join(', ') || '—', bg: s.pvScreen === sc.id ? 'var(--accent-30)' : 'transparent', pick: function () { self.setState({ pvScreen: sc.id }); } }; }) }; }); })(),
      scQ: s.scQ, setScQ: function (v) { self.setState({ scQ: val(v) }); },
      hasPreview: !!byId(D.screens, s.pvScreen), noPreview: !byId(D.screens, s.pvScreen),
      pvName: (byId(D.screens, s.pvScreen) || {}).name || '', pvOpen: navFn('DealerScreenDetail.dc.html', { id: s.pvScreen }),
      pvZone: (function () { var sc = byId(D.screens, s.pvScreen); if (!sc) return 'main'; var z = Object.keys(sc.zones).filter(function (k) { return sc.zones[k] === p.name; })[0] || 'Main'; return z.toLowerCase(); })(),
      isContent: s.tab === 'Content', isScreens: s.tab === 'Screens',
      allSel: s.items.length > 0 && selKeys.length === s.items.length, someSel: selKeys.length > 0 && selKeys.length < s.items.length, noneSel: selKeys.length === 0, selCount: selKeys.length,
      toggleAll: function () { var all = selKeys.length === s.items.length, o = {}; if (!all) s.items.forEach(function (it) { o[it.key] = true; }); self.setState({ sel: o }); },
      reorder: s.reorder, notReorder: !s.reorder, reorderLabel: s.reorder ? 'Done' : 'Reorder', reorderVariant: s.reorder ? 'primary' : 'secondary',
      toggleReorder: function () { if (self.state.reorder) toast(self, 'Play order saved'); self.setState({ reorder: !self.state.reorder }); },
      askBulk: function () { self.setState({ modal: 'bulk' }); },
      doBulk: function () { var sel = self.state.sel; self.setState({ items: self.state.items.filter(function (it) { return !sel[it.key]; }), sel: {}, modal: '' }); toast(self, selKeys.length + ' item(s) removed'); },
      items: itemVMs = s.items.filter(function (it) { return (!s.kinds.length || s.kinds.indexOf(it.m.kind) !== -1) && (!s.sched || schedBucket(it) === s.sched) && contains(it.m.title, s.q); }).map(function (it, i) {
        var B = it.blk ? ['CHANNEL', 'var(--warning-main)'] : ({ image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'], block: ['BLOCK', 'var(--purple-main)'] }[it.m.kind] || ['IMAGE', 'var(--info-main)']);
        var sel = !!s.sel[it.key], idx = s.items.indexOf(it);
        return { badge: B[0], badgeColor: B[1], span: it.blk ? 2 : 1, ratio: it.blk ? '32 / 10' : '16 / 10', capBg: it.blk ? 'var(--warning-main)' : (SCHED[schedState(it)] ? SCHED[schedState(it)][0] : 'var(--primary-050)'), capColor: (it.blk || schedState(it)) ? '#fff' : 'var(--fg-primary)', blk: it.blk, members: it.members || [], schedTip: schedState(it) ? SCHED[schedState(it)][1] + ' · ' + fmtDate(it.start) + ' – ' + fmtDate(it.end) : '', n: idx + 1, image: it.m.image, title: it.m.title, kind: it.m.kind, dur: it.dur, where: it.everywhere ? 'All screens' : Object.keys(it.hosts).filter(function (k) { return it.hosts[k]; }).length + ' host(s)', sched: schedState(it) ? fmtDate(it.start) + ' – ' + fmtDate(it.end) + ' (' + SCHED[schedState(it)][1] + ')' : 'Always',
          checked: sel, cls: sel ? 'sel' : (it.blk ? 'blk' : ''), key: it.key, typeTag: it.blk ? 'BLOCK' : B[0], longDur: longDur(it.dur), added: fullDate(it.m.uploaded), uploader: it.blk ? 'Dealer Admin' : uploaderOf(it.m), kind: it.m.kind, sched: !!schedState(it),
          menuOpen: s.menu === it.key,
          openMenu: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ menu: self.state.menu === it.key ? '' : it.key }); },
          closeMenu: function () { self.setState({ menu: '' }); },
          menuItems: [
            { icon: 'maximize', label: 'Fullscreen', onClick: function () { self.setState({ modal: 'full', target: it.key }); } },
            { icon: 'retweet', label: 'Quick Move', tone: 'info', onClick: function () { self.setState({ modal: 'move', target: it.key, mvPos: String(idx + 1) }); } },
            { icon: 'right-left', label: 'Swap Content', tone: 'warning', onClick: function () { self.setState({ modal: 'swap', target: it.key, swQ: '' }); } },
            { icon: 'gear', label: 'Settings', tone: 'success', onClick: function () { self.setState({ modal: 'modify', md: { key: it.key, tab: 'Basics', dur: it.dur, trans: it.trans, mute: it.mute, everywhere: it.everywhere, hosts: Object.assign({}, it.hosts), always: it.always, start: it.start || '2026-11-15', end: it.end || '2026-12-31' } }); } },
            'divider',
            { icon: 'x', label: 'Remove', tone: 'danger', onClick: function () { self.setState({ modal: 'remove', target: it.key }); } }
          ],
          toggle: function () { var o = Object.assign({}, self.state.sel); o[it.key] = !o[it.key]; self.setState({ sel: o }); },
          up: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); move(idx, -1); }, down: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); move(idx, 1); },
          modify: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ modal: 'modify', md: { key: it.key, tab: 'Basics', dur: it.dur, trans: it.trans, mute: it.mute, everywhere: it.everywhere, hosts: Object.assign({}, it.hosts), always: it.always, start: it.start || '2026-11-15', end: it.end || '2026-12-31' } }); } };
      }),
      cells: (function (list) {
        var BADGE = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'], block: ['BLOCK', 'var(--purple-main)'] };
        var cells = [], g = 0;
        list.forEach(function (it) {
          if (!it.blk) { cells.push({ it: it, span: 1, head: false, grp: '' }); return; }
          var color = GROUP_COLORS[g++ % GROUP_COLORS.length], gid = 'g' + g;
          cells.push({ it: it, span: 2, head: true, grp: gid, color: color });
          it.members.forEach(function (m) { cells.push({ it: it, span: 1, head: false, grp: gid, color: color, m: m, badge: (BADGE[m.kind] || BADGE.image) }); });
        });
        var col = 0;
        cells.forEach(function (c) { if (col + c.span > GRID_COLS) col = 0; c.col = col; col += c.span; if (col >= GRID_COLS) col = 0; });
        return cells.map(function (c, k) {
          var prev = cells[k - 1], next = cells[k + 1], it = c.it;
          var first = !!c.grp && !(prev && prev.grp === c.grp), last = !!c.grp && !(next && next.grp === c.grp);
          var segStart = !!c.grp && (first || c.col === 0), segEnd = !!c.grp && (last || !next || next.col === 0);
          var cls = c.grp ? ['grp', segStart ? 'seg-start' : '', segEnd ? 'seg-end' : '', segStart && !first ? 'dash-l' : '', segEnd && !last ? 'dash-r' : ''].join(' ') : '';
          var member = !!c.m;
          var std = !c.grp, pill = PILL[it.kind] || PILL.image;
          return { key: (c.grp || '') + k, span: c.span, cls: cls + (it.checked ? ' sel' : '') + (std ? ' std' : '') + (std && it.sched ? ' sched' : '') + (std && it.menuOpen ? ' menu-open' : ''), color: c.color || 'transparent', toggle: it.toggle,
            std: std, checked: it.checked, pillBg: pill[0], pillFg: pill[1], menuOpen: std && it.menuOpen, openMenu: it.openMenu, closeMenu: it.closeMenu, menuItems: it.menuItems,
            image: member ? c.m.image : it.image, title: member ? c.m.title : it.title, badge: member ? c.badge[0] : it.badge, badgeColor: member ? c.badge[1] : it.badgeColor,
            n: c.grp ? null : it.n, dur: c.head ? it.dur : null, tip: c.grp ? '' : it.schedTip,
            capBg: c.head ? c.color : (member ? 'var(--primary-050)' : (it.sched ? it.capBg : 'var(--bg-app)')), capColor: c.head ? '#fff' : (member ? 'var(--fg-primary)' : it.capColor),
            actions: !member, gear: !!c.head, up: it.up, down: it.down, modify: it.modify };
        });
      })(itemVMs),
      empty: s.items.length === 0,
      screens: scs.map(function (sc, i) { var z = Object.keys(sc.zones).filter(function (k) { return sc.zones[k] === p.name; }); return { n: i + 1, name: sc.name, host: hostName(sc.host), zone: z.join(', ') || '—', template: sc.template, lic: sc.lic.length, open: navFn('DealerScreenDetail.dc.html', { id: sc.id }) }; }),
      noScreens: scs.length === 0,
      lib: (libAll = D.media.filter(function (m, i) { if (s.folder === '__search') return contains(m.title, s.libQ); if (s.folder === '__assigned') return !!m.adv; if (s.folder === '__floating') return !m.used; return m.folder === s.folder; }).map(function (m) { var has = !!inPl[m.id], B = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] }[m.kind] || ['IMAGE', 'var(--info-main)']; var pl = PILL[m.kind] || PILL.image; return { badge: B[0], badgeColor: B[1], pillBg: pl[0], pillFg: pl[1], has: has, image: m.image, title: m.title, kind: m.kind, dur: m.duration || '15 sec', icon: has ? 'check' : 'plus', media: m, add: function () { if (has) { toast(self, m.title + ' is already in this playlist', 'info'); return; } addItems([m]); toast(self, m.title + ' added'); } }; })).slice(0, s.libLimit),
      libTotal: libAll.length, libShown: Math.min(s.libLimit, libAll.length), libMore: libAll.length > s.libLimit,
      moreLib: function () { self.setState({ libLimit: self.state.libLimit + 10 }); },
      addAll: function () { var fresh = libAll.filter(function (x) { return !x.has; }); if (!fresh.length) { toast(self, 'Everything in this folder is already in the playlist', 'info'); return; } addItems(fresh.map(function (x) { return x.media; })); toast(self, fresh.length + ' item(s) added'); },
      pushOpen: s.push,
      pushTargets: (function () { var t = []; scs.forEach(function (sc) { sc.lic.forEach(function (lid) { var l = byId(D.licenses, lid); if (l) t.push({ alias: l.alias, willFail: l.status !== 'online' }); }); }); return t; })(),
      openPush: function () { self.setState({ push: true }); }, closePush: function () { self.setState({ push: false }); }, pushDone: function () {},
      m: { add: s.modal === 'add', modify: s.modal === 'modify', info: s.modal === 'info', bulk: s.modal === 'bulk', full: s.modal === 'full', move: s.modal === 'move', swap: s.modal === 'swap', remove: s.modal === 'remove' },
      act: (function () {
        var it = s.items.filter(function (x) { return x.key === s.target; })[0];
        if (!it) return {};
        return { title: it.m.title, image: it.m.image,
          positions: s.items.map(function (x, i) { return String(i + 1); }), pos: s.mvPos, setPos: function (x) { self.setState({ mvPos: val(x) }); },
          doMove: function () { var a = self.state.items.slice(), from = a.indexOf(it), to = Math.max(0, Math.min(a.length - 1, parseInt(self.state.mvPos, 10) - 1)); a.splice(from, 1); a.splice(to, 0, it); self.setState({ items: a, modal: '' }); toast(self, '“' + it.m.title + '” moved to position ' + (to + 1)); },
          swQ: s.swQ, setSwQ: function (x) { self.setState({ swQ: val(x) }); },
          lib: D.media.filter(function (m) { return m.id !== it.m.id && m.kind !== 'block' && contains(m.title, s.swQ); }).slice(0, 24).map(function (m) { var pl = PILL[m.kind] || PILL.image;
            return { title: m.title, image: m.image, badge: m.kind.toUpperCase(), pillBg: pl[0], pillFg: pl[1],
              pick: function () { self.setState({ items: self.state.items.map(function (x) { return x.key === it.key ? Object.assign({}, x, { m: m, dur: m.duration || x.dur }) : x; }), modal: '' }); toast(self, 'Swapped to “' + m.title + '”'); } }; }),
          doRemove: function () { self.setState({ items: self.state.items.filter(function (x) { return x.key !== it.key; }), modal: '' }); toast(self, '“' + it.m.title + '” removed'); } };
      })(),
      closeModal: close,
      openAdd: function () { self.setState({ modal: 'add', ad: { step: 0, kind: 'single', sel: {}, q: '', blockName: p.name + ' Block', layout: '2 + 2 grid', dur: '15 sec' } }); },
      ad: {
        step: ad.step, steps: adSteps.map(function (l, i) { return { label: l, state: i < ad.step ? 'done' : undefined }; }),
        isType: stepName === 'Content Type', isAssets: stepName === 'Select Assets', isSettings: stepName === 'Settings', isPreview: stepName === 'Preview',
        single: ad.kind === 'single', block: ad.kind === 'block',
        pickSingle: function () { setAd({ kind: 'single' }); }, pickBlock: function () { setAd({ kind: 'block' }); },
        q: ad.q, setQ: function (v) { setAd({ q: val(v) }); }, selCount: picked.length,
        assets: D.media.filter(function (m) { return contains(m.title, ad.q); }).map(function (m) { return { image: m.image, title: m.title, on: !!ad.sel[m.id], toggle: function () { var o = Object.assign({}, self.state.ad.sel); o[m.id] = !o[m.id]; setAd({ sel: o }); } }; }),
        blockName: ad.blockName, setBlockName: function (v) { setAd({ blockName: val(v) }); },
        layouts: ['2 + 2 grid', '1 large + 3 small', 'Side by side'], layout: ad.layout, setLayout: function (v) { setAd({ layout: val(v) }); },
        durations: ['10 sec', '15 sec', '30 sec', '60 sec'], dur: ad.dur, setDur: function (v) { setAd({ dur: val(v) }); },
        picked: picked.map(function (m) { return { image: m.image, kind: m.kind, title: m.title, duration: m.duration || '' }; }),
        blockItems: picked.slice(0, 4).map(function (m, i) { return { image: m.image, kind: m.kind, title: m.title, duration: m.duration || '', span: i === 0 && ad.layout === '1 large + 3 small' ? 2 : undefined }; }),
        previewText: ad.kind === 'block' ? '“' + ad.blockName + '” · ' + picked.length + ' assets · ' + ad.layout : picked.length + ' asset(s) will be added to the end of the playlist.',
        blocked: (stepName === 'Select Assets' && picked.length < (ad.kind === 'block' ? 2 : 1)) || (stepName === 'Settings' && !ad.blockName.trim()),
        backLabel: ad.step === 0 ? 'Cancel' : 'Back', nextLabel: stepName === 'Preview' ? 'Add to Playlist' : 'Next',
        back: function () { if (self.state.ad.step === 0) close(); else setAd({ step: self.state.ad.step - 1 }); },
        next: function () {
          if (stepName !== 'Preview') { setAd({ step: self.state.ad.step + 1 }); return; }
          if (ad.kind === 'block') { var b = picked[0]; addItems([Object.assign({}, b, { id: 'blk' + Date.now(), title: ad.blockName || b.title, kind: 'block', members: picked.slice(1), duration: (picked.length * secs(ad.dur)) + ' sec' })]); }
          else addItems(picked);
          self.setState({ modal: '' }); toast(self, (ad.kind === 'block' ? 'Block' : picked.length + ' item(s)') + ' added · push updates to apply');
        }
      },
      md: md && mi ? {
        title: mi.m.title, tabs: ['Basics', 'Play Where', 'Schedule'].map(function (t) { return { label: t, on: md.tab === t, pick: function () { setMd({ tab: t }); } }; }),
        basics: md.tab === 'Basics', where: md.tab === 'Play Where', schedule: md.tab === 'Schedule',
        durations: ['10 sec', '15 sec', '20 sec', '30 sec', '60 sec'], dur: md.dur, setDur: function (v) { setMd({ dur: val(v) }); },
        transitions: ['Fade', 'Slide', 'Cut'], trans: md.trans, setTrans: function (v) { setMd({ trans: val(v) }); },
        mute: md.mute, setMute: function (on) { setMd({ mute: typeof on === 'boolean' ? on : !self.state.md.mute }); },
        everywhere: md.everywhere, selected: !md.everywhere, setEverywhere: function () { setMd({ everywhere: true }); }, setSelected: function () { setMd({ everywhere: false }); },
        hosts: scs.map(function (sc) { return { name: hostName(sc.host), on: !!md.hosts[sc.host], toggle: function () { var o = Object.assign({}, self.state.md.hosts); o[sc.host] = !o[sc.host]; setMd({ hosts: o }); } }; }),
        always: md.always, ranged: !md.always, setAlways: function () { setMd({ always: true }); }, setRanged: function () { setMd({ always: false }); },
        start: md.start, end: md.end, setStart: function (e) { setMd({ start: val(e) }); }, setEnd: function (e) { setMd({ end: val(e) }); },
        save: function () { var x = self.state.md; self.setState({ items: self.state.items.map(function (it) { return (it.key === x.key || (x.bulk && x.bulk.indexOf(it.key) !== -1)) ? Object.assign({}, it, { dur: x.dur, trans: x.trans, mute: x.mute, everywhere: x.everywhere, hosts: x.hosts, always: x.always, start: x.start, end: x.end }) : it; }), modal: '', md: null }); toast(self, 'Content settings saved'); }
      } : {},
      openInfo: function () { self.setState({ modal: 'info', info: { name: p.name, desc: p.desc } }); },
      info: { name: info.name, desc: info.desc, bad: !info.name.trim(),
        setName: function (v) { self.setState({ info: Object.assign({}, self.state.info, { name: val(v) }) }); },
        setDesc: function (v) { self.setState({ info: Object.assign({}, self.state.info, { desc: val(v) }) }); },
        save: function () { self.setState({ p: Object.assign({}, self.state.p, { name: self.state.info.name.trim(), desc: self.state.info.desc }), modal: '' }); toast(self, 'Playlist info saved'); } },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerPlaylistDetail.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-playlist-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="content" activeItem="Playlists" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <NTV.Breadcrumbs items={v.crumbs} />
          <div className="dv-between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="dv-row" style={{ gap: "8px" }}>
                <h1 className="pd-title">{v.name}</h1>
                <button type="button" className="pd-edit" aria-label="Edit playlist info" onClick={v.openInfo}><NTV.Icon name="pen-to-square-solid" size={20} /></button>
              </div>
              <p className="pd-desc">{v.desc}</p>
            </div>
            <div className="dv-row" style={{ gap: "16px" }}>
              <NTV.Button variant="primary" size="xl" iconRight="arrow-up-from-bracket" disabled={v.noScreens} onClick={v.openPush}>Push Updates</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight="plus" onClick={v.openAdd}>Add Content</NTV.Button>
            </div>
          </div>
          <NTV.Tabs items={v.tabItems} value={v.tab} onChange={v.setTab} />
          {v.isContent ? (
            <>
              <div className="pd-layout">
              <div className="pd-main">
              <section className="dv-card pd-filter">
                <div className="dv-between">
                  <h2 className="pd-h2">Media Contents</h2>
                  <span className="pd-count">All contents ({v.count})</span>
                </div>
                <div className="dv-between">
                  <div className="dv-row" style={{ gap: "10px" }}>
                    <NTV.FilterDropdown label={v.filterLabel} groups={v.filterGroups} />
                    {v.isGrid ? <NTV.Button variant={v.reorderVariant} size="xl" iconLeft="grip-vertical" iconRight={v.none} onClick={v.toggleReorder}>{v.reorderLabel}</NTV.Button> : null}
                  </div>
                  <div className="dv-row" style={{ gap: "10px" }}>
                    <NTV.Input size="l" placeholder="Search Playlist Content" iconLeft="magnifying-glass" label="Search playlist content" value={v.q} onChange={v.setQ} style={{ width: "300px" }} />
                    <NTV.Button variant="primary" tone="active" size="xl" iconLeft="check" iconRight={v.none} onClick={v.toggleAll}>{v.markLabel}</NTV.Button>
                    <NTV.Button variant="primary" size="xl" iconLeft="gear" iconRight={v.none} disabled={v.noneSel} onClick={v.bulkModify}>Bulk Modify</NTV.Button>
                    <NTV.Button variant="primary" size="xl" iconLeft="trash" iconRight={v.none} disabled={v.noneSel} onClick={v.askBulk}>Bulk Delete</NTV.Button>
                    <NTV.ToggleView value={v.view} onChange={v.setView} />
                  </div>
                </div>
                <NTV.ActiveFilters chips={v.activeChips} onClear={v.clearKinds} />
              </section>
              <section className="dv-card pd-content">
                {v.isGrid ? (
                  <>
                    <div className="pd-grid">
                    {(v.cells || []).map((_c) => (
                      <div key={_c.key} className={`pd-cell ${s(_c.cls)}`} onClick={_c.toggle} style={{ gridColumn: `span ${s(_c.span)}`, "--g": _c.color }} title={_c.tip || undefined}>
                        <div className="pd-tile__card">
                          <div className="pd-tile__img">
                            <img src={_c.image} alt="" />
                            {_c.std ? (
                              <>
                                <span className="pd-pill" style={{ background: _c.pillBg, color: _c.pillFg }}>{_c.badge}</span>
                                <span className={`pd-check ${_c.checked ? "on" : ""}`} aria-hidden="true">{_c.checked ? <NTV.Icon name="check" size={v.i12} /> : null}</span>
                                <button type="button" className="pd-more" aria-label="More actions" aria-haspopup="menu" aria-expanded={_c.menuOpen} onClick={_c.openMenu}><NTV.Icon name="ellipsis" size={10} /></button>
                              </>
                            ) : (
                              <span className="pd-tag" style={{ color: `${s(_c.badgeColor)}`, borderColor: `${s(_c.badgeColor)}` }}>{_c.badge}</span>
                            )}
                          </div>
                          <div className="pd-tile__cap" style={{ background: `${s(_c.capBg)}`, color: `${s(_c.capColor)}` }}>
                            <span className="pd-tile__name">{_c.n ? <span className="pd-num">{_c.n}</span> : null}{_c.title}</span>
                            {_c.dur ? <span className="pd-dur">{_c.dur}</span> : null}
                            {_c.actions && v.reorder ? (
                              <>
                                <button type="button" className="dv-ib pd-capbtn" aria-label="Move earlier" onClick={_c.up}><NTV.Icon name="angle-up" size={v.i10} /></button>
                                <button type="button" className="dv-ib pd-capbtn" aria-label="Move later" onClick={_c.down}><NTV.Icon name="angle-down" size={v.i10} /></button>
                              </>
                            ) : null}
                            {_c.gear && v.notReorder ? (
                              <button type="button" className="dv-ib pd-capbtn" aria-label="Modify" onClick={_c.modify}><NTV.Icon name="gear" size={v.i10} /></button>
                            ) : null}
                          </div>
                        </div>
                        {_c.menuOpen ? <NTV.ActionMenu items={_c.menuItems} onClose={_c.closeMenu} style={{ top: "38px", right: "10px" }} /> : null}
                      </div>
                    ))}
                  </div>
                  </>
                ) : null}
                {v.isList ? (
                  <div className="pd-ltable">
                    <div role="table" aria-label="Playlist contents" className="pd-ltable__inner">
                      <div role="row" className="pd-lrow pd-lrow--head">
                        <div className="pd-lcell pd-lcell--check"><NTV.Checkbox checked={v.allChecked} indeterminate={v.someChecked} onChange={v.toggleAll} ariaLabel="Select all" /></div>
                        <div className="pd-lcell">Thumbnail</div>
                        <div className="pd-lcell">File Name</div>
                        <div className="pd-lcell">File Type</div>
                        <div className="pd-lcell">Duration</div>
                        <div className="pd-lcell">Date Added</div>
                        <div className="pd-lcell">Uploader</div>
                        <div className="pd-lcell">Actions</div>
                      </div>
                      {(v.items || []).map((_it) => (
                        <div key={_it.key} role="row" className={`pd-lrow ${_it.checked ? "is-sel" : ""}`}>
                          <div className="pd-lcell pd-lcell--check"><NTV.Checkbox checked={_it.checked} onChange={_it.toggle} ariaLabel={`Select ${_it.title}`} /></div>
                          <div className="pd-lcell"><span className="pd-lthumb"><img src={_it.image} alt="" /></span></div>
                          <div className="pd-lcell pd-lcell--name" title={_it.title}>{_it.title}</div>
                          <div className="pd-lcell"><span className="pd-pill" style={{ background: _it.blk ? "var(--primary-050)" : PILL_OF(_it.kind)[0], color: _it.blk ? "var(--fg-secondary)" : PILL_OF(_it.kind)[1] }}>{_it.typeTag}</span></div>
                          <div className="pd-lcell">{_it.longDur}</div>
                          <div className="pd-lcell">{_it.added}</div>
                          <div className="pd-lcell">{_it.uploader}</div>
                          <div className="pd-lcell pd-lcell--act">
                            <button type="button" className="pd-lmore" aria-label="More actions" aria-haspopup="menu" aria-expanded={_it.menuOpen} onClick={_it.openMenu}>
                              <span style={{ display: "inline-flex", transform: "rotate(90deg)" }}><NTV.Icon name="ellipsis" size={v.i14} /></span>
                            </button>
                            {_it.menuOpen ? <NTV.ActionMenu items={_it.menuItems} align="left" onClose={_it.closeMenu} style={{ top: "54px", left: "8px" }} /> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {v.empty ? (
                  <>
                    <div className="dv-empty" style={{ flex: "1" }}>
                    <span style={{ color: "var(--fg-primary)" }}><NTV.Icon name="play" size={v.i24} /></span>
                    <strong style={{ fontSize: "14px", color: "var(--fg-primary)" }}>Welcome to your new playlist! Add Content or drag items here to get started.</strong>
                    <span>Click on the Add Content button or select contents from the right panel.</span>
                  </div>
                  </>
                ) : null}
                {v.reorder ? (
                  <>
                    <div className="dv-note">
                    <NTV.Icon name="circle-info" size={v.i12} />
                    <span>Use the arrows on each item to change play order, then press Done.</span>
                  </div>
                  </>
                ) : null}
              </section>
              <span className="pd-foot">{"Showing "}{v.count}{" of "}{v.count}{" items"}</span>
              </div>
              <aside className="dv-card pd-side">
                <NTV.Input size="l" placeholder="Search Content or Folder" iconLeft="magnifying-glass" label="Search content or folder" value={v.libQ} onChange={v.setLibQ} />
                <a href="DealerMedia.dc.html" className="ntv-btn ntv-btn--secondary ntv-btn--default ntv-btn--xl pd-upload">
                  <NTV.Icon name="upload" size={v.i14} />
                  <span>Upload Content</span>
                </a>
                {v.inFolder ? (
                  <div className="pd-sec">
                    <div className="pd-sec__head">
                      <button type="button" className="pd-back" onClick={v.backFolders}>
                        <span className="pd-back__fab" aria-hidden="true"><span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><NTV.Icon name="angle-right" size={10} /></span></span>
                        {v.folderIcon ? <NTV.Icon name={v.folderIcon} size={20} /> : null}
                        <span className="pd-sec__name">{v.folderName}</span>
                        <span className="pd-sec__n">({v.libTotal})</span>
                      </button>
                      {v.isRealFolder ? <NTV.Button variant="primary" tone="active" size="m" iconRight="plus" onClick={v.addAll}>Add all</NTV.Button> : null}
                    </div>
                    <div className="pd-sec__list pd-sec__list--media">
                      {(v.lib || []).map((_m, $index) => (
                        <button key={$index} type="button" className={`pd-media ${_m?.has ? "is-in" : ""}`} onClick={_m?.add} title={_m?.has ? "Already in this playlist" : "Add to playlist"}>
                          <span className="pd-media__thumb"><img src={_m?.image} alt="" /></span>
                          <span className="pd-media__info">
                            <span className="pd-media__name">{_m?.title}</span>
                            <span className="pd-pill" style={{ background: _m?.pillBg, color: _m?.pillFg }}>{_m?.badge}</span>
                          </span>
                          <span className="pd-media__act"><NTV.Icon name={_m?.icon} size={v.i12} /></span>
                        </button>
                      ))}
                      {(v.lib || []).length === 0 ? <span className="pd-n" style={{ padding: "10px 16px" }}>No content found.</span> : null}
                    </div>
                    {v.isRealFolder ? null : (
                      <div className="pd-sidefoot"><span>Showing <strong>{v.libShown}</strong> of {v.libTotal} items</span>{v.libMore ? <button type="button" onClick={v.moreLib}>Show More...</button> : null}</div>
                    )}
                  </div>
                ) : null}
                {v.notInFolder ? (
                  <>
                    <div className="pd-sec__list">
                      <button type="button" className="ml-row" onClick={v.openAssigned}>
                        <NTV.Icon name="users" size={20} />
                        My Contents
                      </button>
                      <button type="button" className="ml-row" onClick={v.openFloating}>
                        <NTV.Icon name="ghost" size={20} />
                        Floating Contents
                      </button>
                    </div>
                    <div className="pd-sec">
                      <span className="pd-folders">
                        <NTV.Icon name="angle-down" size={v.i14} />
                        Folders
                        <span className="pd-sec__n">({v.folderCount})</span>
                      </span>
                      <div className="pd-sec__list">
                        {(v.folders || []).map((_f, $index) => (
                          <button key={$index} type="button" className="ml-row" onClick={_f?.open}>
                            <NTV.Icon name="folder" size={20} />
                            {_f?.name}
                            <span className="pd-n">({_f?.n})</span>
                          </button>
                        ))}
                      </div>
                      <div className="pd-sidefoot"><span>Showing <strong>{v.folderShown}</strong> of {v.folderCount} folders</span></div>
                    </div>
                  </>
                ) : null}
              </aside>
            </div>
            </>
          ) : null}
          {v.isScreens ? (
            <>
              <div className="dv-between">
              <div>
                <h2 className="dv-h3">Hosts</h2>
                <p className="dv-sub">Hosts and screens playing this playlist (read only)</p>
              </div>
              <NTV.Input size="l" placeholder="Search Screen name, Host or License" iconLeft="magnifying-glass" label="Search screens" value={v.scQ} onChange={v.setScQ} style={{ width: "360px" }} />
            </div>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "20px", alignItems: "start" }}>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {(v.hostGroups || []).map((_g, $index) => (
                  <React.Fragment key={$index}>
                    <button type="button" className="ml-row" onClick={_g?.toggle} style={{ justifyContent: "space-between", fontWeight: "600" }}>
                      <span className="dv-row" style={{ gap: "8px", color: "var(--accent-action)" }}>
                        <NTV.Icon name="map" size={v.i12} />
                        <span style={{ color: "var(--fg-primary)" }}>{_g?.name}</span>
                      </span>
                      <span className="dv-row dv-sub" style={{ gap: "6px" }}>
                        {_g?.count}{" Screen(s)"}
                        <NTV.Icon name={_g?.icon} size={v.i10} />
                      </span>
                    </button>
                    {_g?.open ? (
                      <>
                        {(_g?.screens || []).map((_sc, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" className="ml-row" onClick={_sc?.pick} style={{ paddingLeft: "32px", justifyContent: "space-between", background: `${s(_sc?.bg)}` }}>
                            <span className="dv-row" style={{ gap: "8px" }}>
                              <NTV.Icon name="tv" size={v.i12} />
                              {_sc?.name}
                            </span>
                            <span className="dv-sub">{_sc?.template}{" · "}{_sc?.zone}</span>
                          </button>
                        </React.Fragment>
                      ))}
                      </>
                    ) : null}
                  </React.Fragment>
                ))}
                {v.noScreens ? (
                  <>
                    <div className="dv-empty">Not assigned to any screen yet.</div>
                  </>
                ) : null}
              </section>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {v.hasPreview ? (
                  <>
                    <div className="dv-between">
                    <strong style={{ fontSize: "14px" }}>{v.pvName}</strong>
                    <a className="dv-a" href="DealerScreenDetail.dc.html" onClick={v.pvOpen} style={{ fontSize: "12px" }} data-nav={v.pvOpenNav}>Open screen →</a>
                  </div>
                    <ScreenPreview background="wood" selected={v.pvZone} />
                    <p className="dv-sub">This playlist plays in the highlighted zone.</p>
                  </>
                ) : null}
                {v.noPreview ? (
                  <>
                    <div className="dv-empty" style={{ minHeight: "320px" }}>Select a screen to preview where this playlist plays.</div>
                  </>
                ) : null}
              </section>
            </div>
            </>
          ) : null}
        </main>
      </div>
      <PushFlow open={v.pushOpen} subject="playlist" targets={v.pushTargets} onClose={v.closePush} onDone={v.pushDone} />
      {v.m?.add ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Add Content" width={v.w960} onClose={v.closeModal}>
            <div style={{ marginBottom: "16px" }}>
              <NTV.Stepper steps={v.ad?.steps} current={v.ad?.step} style={{ width: "100%" }} />
            </div>
            {v.ad?.isType ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <button type="button" className="pd-type" aria-pressed={v.ad?.single} onClick={v.ad?.pickSingle}>
                  <NTV.IconTile icon="image" tone="info" />
                  <strong style={{ fontSize: "16px" }}>Single Content</strong>
                  <span className="dv-sub">Each asset plays full zone, one after another.</span>
                </button>
                <button type="button" className="pd-type" aria-pressed={v.ad?.block} onClick={v.ad?.pickBlock}>
                  <NTV.IconTile icon="grid-2" tone="purple" />
                  <strong style={{ fontSize: "16px" }}>Block Content</strong>
                  <span className="dv-sub">Group assets into one block that plays as a single item.</span>
                </button>
              </div>
              </>
            ) : null}
            {v.ad?.isAssets ? (
              <>
                <div className="dv-between" style={{ marginBottom: "10px" }}>
                <span className="dv-sub">{v.ad?.selCount}{" selected"}</span>
                <NTV.Input size="l" placeholder="Search" iconLeft="magnifying-glass" label="Search assets" value={v.ad?.q} onChange={v.ad?.setQ} style={{ width: "260px" }} />
              </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "10px", maxHeight: "50vh", overflowY: "auto" }}>
                {(v.ad?.assets || []).map((_a, $index) => (
                  <React.Fragment key={$index}>
                    <button type="button" className="pd-pick" aria-pressed={_a?.on} onClick={_a?.toggle}>
                      <div className="dv-thumb" style={{ aspectRatio: "16 / 9", borderRadius: "0" }}><img src={_a?.image} alt="" /></div>
                      <div style={{ padding: "6px 8px", fontSize: "11px", lineHeight: "16px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_a?.title}</div>
                    </button>
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
            {v.ad?.isSettings ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="dv-label" htmlFor="bk-n">Block Name</label>
                  <input id="bk-n" className="dv-field" value={v.ad?.blockName} onChange={v.ad?.setBlockName} />
                </div>
                <div>
                  <span className="dv-label">Layout</span>
                  <NTV.Select size="l" options={v.ad?.layouts} value={v.ad?.layout} onChange={v.ad?.setLayout} />
                </div>
                <div>
                  <span className="dv-label">Duration per asset</span>
                  <NTV.Select size="l" options={v.ad?.durations} value={v.ad?.dur} onChange={v.ad?.setDur} />
                </div>
              </div>
              </>
            ) : null}
            {v.ad?.isPreview ? (
              <>
                <p className="dv-sub" style={{ marginBottom: "10px" }}>{v.ad?.previewText}</p>
                <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px" }}>
                {v.ad?.block ? (
                  <>
                    <div style={{ flex: "none", height: "136px", display: "flex" }}>
                    <div style={{ height: "100%" }}>
                      <ContentBlock items={v.ad?.blockItems} />
                    </div>
                  </div>
                  </>
                ) : null}
                {v.ad?.single ? (
                  <>
                    {(v.ad?.picked || []).map((_p, $index) => (
                    <React.Fragment key={$index}>
                      <div style={{ flex: "none", width: "161px", height: "136px", display: "flex" }}>
                        <div style={{ width: "100%", height: "100%" }}>
                          <ContentThumb image={_p?.image} kind={_p?.kind} title={_p?.title} duration={_p?.duration} />
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  </>
                ) : null}
              </div>
              </>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.ad?.back}>{v.ad?.backLabel}</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.ad?.blocked} onClick={v.ad?.next}>{v.ad?.nextLabel}</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.modify ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={`Modify · ${s(v.md?.title)}`} width={v.w640} onClose={v.closeModal}>
            <div className="dv-tabs" role="tablist" style={{ marginBottom: "16px" }}>
              {(v.md?.tabs || []).map((_t, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick}>{_t?.label}</button>
                </React.Fragment>
              ))}
            </div>
            {v.md?.basics ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <span className="dv-label">Duration</span>
                  <NTV.Select size="l" options={v.md?.durations} value={v.md?.dur} onChange={v.md?.setDur} />
                </div>
                <div>
                  <span className="dv-label">Transition</span>
                  <NTV.Select size="l" options={v.md?.transitions} value={v.md?.trans} onChange={v.md?.setTrans} />
                </div>
                <div className="dv-row" style={{ gridColumn: "1 / 3", gap: "10px" }}>
                  <NTV.Switch checked={v.md?.mute} onChange={v.md?.setMute} label="Mute audio" />
                  <span className="dv-p" style={{ fontSize: "14px" }}>Mute audio</span>
                </div>
              </div>
              </>
            ) : null}
            {v.md?.where ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <NTV.Radio name="pw" checked={v.md?.everywhere} label="Play on every screen using this playlist" onChange={v.md?.setEverywhere} />
                <NTV.Radio name="pw" checked={v.md?.selected} label="Only on selected hosts" onChange={v.md?.setSelected} />
                {v.md?.selected ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto", padding: "12px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-app)" }}>
                    {(v.md?.hosts || []).map((_h, $index) => (
                      <React.Fragment key={$index}>
                        <NTV.Checkbox checked={_h?.on} label={_h?.name} onChange={_h?.toggle} />
                      </React.Fragment>
                    ))}
                  </div>
                  </>
                ) : null}
              </div>
              </>
            ) : null}
            {v.md?.schedule ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <NTV.Radio name="sc" checked={v.md?.always} label="Always play" onChange={v.md?.setAlways} />
                <NTV.Radio name="sc" checked={v.md?.ranged} label="Play between dates" onChange={v.md?.setRanged} />
                {v.md?.ranged ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="dv-label" htmlFor="sd1">Start</label>
                      <input id="sd1" className="dv-field" type="date" value={v.md?.start} onChange={v.md?.setStart} />
                    </div>
                    <div>
                      <label className="dv-label" htmlFor="sd2">End</label>
                      <input id="sd2" className="dv-field" type="date" value={v.md?.end} onChange={v.md?.setEnd} />
                    </div>
                  </div>
                  </>
                ) : null}
              </div>
              </>
            ) : null}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.md?.save}>Save</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.info ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Edit Playlist Info" width={v.w500} onClose={v.closeModal}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="dv-label" htmlFor="in-n">Playlist Name</label>
                <input id="in-n" className="dv-field" value={v.info?.name} onChange={v.info?.setName} />
              </div>
              <div>
                <label className="dv-label" htmlFor="in-d">Description</label>
                <textarea id="in-d" className="dv-field" onChange={v.info?.setDesc} value={v.info?.desc} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.info?.bad} onClick={v.info?.save}>Save</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.bulk ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title={`Remove ${s(v.selCount)} Item(s)?`} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              They’ll be removed from this playlist only — the files stay in your Media Library. Push updates afterwards to apply it to screens.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doBulk}>Remove</button>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.full ? (
        <div className="dv-ov" onClick={v.closeModal}>
          <div className="pd-full" onClick={(e) => e.stopPropagation()}>
            <div className="pd-full__head">
              <strong>{v.act?.title}</strong>
              <button type="button" className="dv-ib" aria-label="Close" onClick={v.closeModal} style={{ color: "#fff" }}><NTV.Icon name="x" size={v.i14} /></button>
            </div>
            <img src={v.act?.image} alt={v.act?.title} />
          </div>
        </div>
      ) : null}
      {v.m?.move ? (
        <div className="dv-ov">
          <NTV.Modal title="Quick Move" width={v.w460} onClose={v.closeModal}>
            <p className="dv-p" style={{ marginBottom: "12px" }}>Move <strong style={{ color: "var(--fg-primary)" }}>{v.act?.title}</strong> to position:</p>
            <NTV.Select size="l" options={v.act?.positions} value={v.act?.pos} onChange={v.act?.setPos} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.act?.doMove}>Move</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
      ) : null}
      {v.m?.swap ? (
        <div className="dv-ov">
          <NTV.Modal title="Swap Content" width={v.w640} onClose={v.closeModal}>
            <p className="dv-p" style={{ marginBottom: "12px" }}>Replace <strong style={{ color: "var(--fg-primary)" }}>{v.act?.title}</strong> with:</p>
            <NTV.Input size="l" placeholder="Search Media Library" iconLeft="magnifying-glass" label="Search media library" value={v.act?.swQ} onChange={v.act?.setSwQ} />
            <div className="pd-swap">
              {(v.act?.lib || []).map((_m, $i) => (
                <button key={$i} type="button" className="pd-swap__item" onClick={_m.pick}>
                  <span className="pd-swap__img"><img src={_m.image} alt="" /><span className="pd-pill" style={{ background: _m.pillBg, color: _m.pillFg }}>{_m.badge}</span></span>
                  <span className="pd-swap__name">{_m.title}</span>
                </button>
              ))}
            </div>
          </NTV.Modal>
        </div>
      ) : null}
      {v.m?.remove ? (
        <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Remove Content?" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>Remove <strong style={{ color: "var(--fg-primary)" }}>{v.act?.title}</strong> from this playlist? The file stays in your Media Library.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.act?.doRemove}>Remove</button>
            </div>
          </NTV.StatusModal>
        </div>
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
