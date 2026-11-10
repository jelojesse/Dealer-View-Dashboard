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

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerPlaylistDetail.dc.html') || {};
    var p = byId(D.playlists, f.id) || D.playlists[0];
    var items = p.items.map(function (id, i) { var m = byId(D.media, id); return m ? { key: 'k' + i, blk: !!(p.block && i === 0), m: m, dur: m.duration || '15 sec', trans: 'Fade', mute: true, everywhere: true, hosts: {}, always: true } : null; }).filter(Boolean);
    this.state = { view: 'grid', kind: '', q: '', folder: '', scQ: '', openHost: '', pvScreen: '', p: Object.assign({}, p), items: items, tab: 'Content', sel: {}, reorder: false, modal: '', libQ: '', push: false, ad: null, md: null, info: null, toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state, p = s.p;
    var secs = function (d) { return parseInt(d, 10) || 15; };
    var loop = s.items.reduce(function (a, it) { return a + secs(it.dur); }, 0);
    var selKeys = Object.keys(s.sel).filter(function (k) { return s.sel[k]; });
    var scs = p.screens.map(function (id) { return byId(D.screens, id); }).filter(Boolean);
    var move = function (i, d) { var a = self.state.items.slice(), j = i + d; if (j < 0 || j >= a.length) return; var t = a[i]; a[i] = a[j]; a[j] = t; self.setState({ items: a }); };
    var inPl = {}; s.items.forEach(function (it) { inPl[it.m.id] = 1; });
    var close = function () { self.setState({ modal: '' }); };
    var addItems = function (ms) { var base = self.state.items.length; self.setState({ items: self.state.items.concat(ms.map(function (m, i) { return { key: 'n' + Date.now() + i, blk: m.kind === 'block', m: m, dur: m.duration || '15 sec', trans: 'Fade', mute: true, everywhere: true, hosts: {}, always: true }; })) }); };
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
      tabs: [['Content', 'Content Management'], ['Screens', 'Screens']].map(function (t) { return { label: t[1], on: s.tab === t[0], pick: function () { self.setState({ tab: t[0] }); } }; }),
      i24: 24, i10: 10,
      kindLabel: s.kind ? 'Filter: ' + s.kind + 's' : 'Filter by', cycleKind: function () { var o = ['', 'image', 'video', 'widget']; self.setState({ kind: o[(o.indexOf(self.state.kind) + 1) % o.length] }); },
      q: s.q, setQ: function (v) { self.setState({ q: val(v) }); },
      markLabel: s.items.length > 0 && selKeys.length === s.items.length ? 'Unmark All' : 'Mark All',
      bulkModify: function () { var k = selKeys[0], it = self.state.items.filter(function (x) { return x.key === k; })[0]; if (it) self.setState({ modal: 'modify', md: { key: it.key, tab: 'Basics', dur: it.dur, trans: it.trans, mute: it.mute, everywhere: it.everywhere, hosts: Object.assign({}, it.hosts), always: it.always, bulk: selKeys } }); },
      isGrid: s.view === 'grid', isList: s.view === 'list', toGrid: function () { self.setState({ view: 'grid' }); }, toList: function () { self.setState({ view: 'list' }); },
      libQ: s.libQ, setLibQ: function (v) { self.setState({ libQ: val(v), folder: val(v) ? '__search' : '' }); },
      inFolder: !!s.folder, notInFolder: !s.folder,
      folderName: s.folder === '__search' ? 'Search results' : (s.folder === '__assigned' ? 'Assigned to Dealer' : (s.folder === '__floating' ? 'Floating Contents' : s.folder)),
      backFolders: function () { self.setState({ folder: '', libQ: '' }); },
      openAssigned: function () { self.setState({ folder: '__assigned' }); }, openFloating: function () { self.setState({ folder: '__floating' }); },
      folders: ['Food Assets', 'Promo Videos', 'Brand Logos', 'Seasonal', 'Menus'].map(function (f) { return { name: f, n: D.media.filter(function (m) { return m.folder === f; }).length, open: function () { self.setState({ folder: f }); } }; }),
      folderCount: 5,
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
      items: s.items.filter(function (it) { return (!s.kind || it.m.kind === s.kind) && contains(it.m.title, s.q); }).map(function (it, i) {
        var B = it.blk ? ['CHANNEL', 'var(--warning-main)'] : ({ image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'], block: ['BLOCK', 'var(--purple-main)'] }[it.m.kind] || ['IMAGE', 'var(--info-main)']);
        var sel = !!s.sel[it.key], idx = s.items.indexOf(it);
        return { badge: B[0], badgeColor: B[1], span: it.blk ? 2 : 1, ratio: it.blk ? '32 / 10' : '16 / 10', capBg: it.blk ? 'var(--warning-main)' : 'transparent', capColor: it.blk ? '#fff' : 'var(--fg-primary)', n: idx + 1, image: it.m.image, title: it.m.title, kind: it.m.kind, dur: it.dur, where: it.everywhere ? 'All screens' : Object.keys(it.hosts).filter(function (k) { return it.hosts[k]; }).length + ' host(s)', sched: it.always ? 'Always' : 'Nov 15 – Dec 31',
          checked: sel, cls: sel ? 'sel' : (it.blk ? 'blk' : ''),
          toggle: function () { var o = Object.assign({}, self.state.sel); o[it.key] = !o[it.key]; self.setState({ sel: o }); },
          up: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); move(idx, -1); }, down: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); move(idx, 1); },
          modify: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ modal: 'modify', md: { key: it.key, tab: 'Basics', dur: it.dur, trans: it.trans, mute: it.mute, everywhere: it.everywhere, hosts: Object.assign({}, it.hosts), always: it.always } }); } };
      }),
      empty: s.items.length === 0,
      screens: scs.map(function (sc, i) { var z = Object.keys(sc.zones).filter(function (k) { return sc.zones[k] === p.name; }); return { n: i + 1, name: sc.name, host: hostName(sc.host), zone: z.join(', ') || '—', template: sc.template, lic: sc.lic.length, open: navFn('DealerScreenDetail.dc.html', { id: sc.id }) }; }),
      noScreens: scs.length === 0,
      libQ: s.libQ, setLibQ: function (v) { self.setState({ libQ: val(v) }); },
      lib: D.media.filter(function (m, i) { if (s.folder === '__search') return contains(m.title, s.libQ); if (s.folder === '__assigned') return !!m.adv; if (s.folder === '__floating') return !m.used; return m.folder === s.folder; }).map(function (m) { var has = !!inPl[m.id], B = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] }[m.kind] || ['IMAGE', 'var(--info-main)']; return { badge: B[0], badgeColor: B[1], image: m.image, title: m.title, kind: m.kind, dur: m.duration || '15 sec', icon: has ? 'check' : 'plus', add: function () { if (has) { toast(self, m.title + ' is already in this playlist', 'info'); return; } addItems([m]); toast(self, m.title + ' added'); } }; }),
      pushOpen: s.push,
      pushTargets: (function () { var t = []; scs.forEach(function (sc) { sc.lic.forEach(function (lid) { var l = byId(D.licenses, lid); if (l) t.push({ alias: l.alias, willFail: l.status !== 'online' }); }); }); return t; })(),
      openPush: function () { self.setState({ push: true }); }, closePush: function () { self.setState({ push: false }); }, pushDone: function () {},
      m: { add: s.modal === 'add', modify: s.modal === 'modify', info: s.modal === 'info', bulk: s.modal === 'bulk' },
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
          if (ad.kind === 'block') { var b = picked[0]; addItems([Object.assign({}, b, { id: 'blk' + Date.now(), title: ad.blockName + ' (' + picked.length + ' assets)', kind: 'block', duration: (picked.length * secs(ad.dur)) + ' sec' })]); }
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
        save: function () { var x = self.state.md; self.setState({ items: self.state.items.map(function (it) { return (it.key === x.key || (x.bulk && x.bulk.indexOf(it.key) !== -1)) ? Object.assign({}, it, { dur: x.dur, trans: x.trans, mute: x.mute, everywhere: x.everywhere, hosts: x.hosts, always: x.always }) : it; }), modal: '', md: null }); toast(self, 'Content settings saved'); }
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
                <h1 style={{ margin: "0", fontSize: "20px", lineHeight: "30px", fontWeight: "700" }}>{v.name}</h1>
                <button type="button" className="dv-ib" aria-label="Edit playlist info" onClick={v.openInfo}><NTV.Icon name="pen-to-square" size={v.i14} /></button>
              </div>
              <p className="dv-sub">{v.desc}</p>
            </div>
            <div className="dv-row">
              <NTV.Button variant="primary" size="xl" iconRight="arrow-up-from-bracket" disabled={v.noScreens} onClick={v.openPush}>Push Updates</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight="plus" onClick={v.openAdd}>Add Content</NTV.Button>
            </div>
          </div>
          <div className="dv-tabs" role="tablist">
            {(v.tabs || []).map((_t, $index) => (
              <React.Fragment key={$index}>
                <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick} style={{ minWidth: "140px" }}>{_t?.label}</button>
              </React.Fragment>
            ))}
          </div>
          {v.isContent ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: "20px", alignItems: "start" }}>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "560px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3">Media Contents</h2>
                  <span className="dv-sub">All contents ({v.count}{") · "}{v.loop}{" per loop"}</span>
                </div>
                <div className="dv-between">
                  <div className="dv-row">
                    <NTV.Button variant="secondary" size="m" iconLeft="filter" iconRight={v.none} onClick={v.cycleKind}>{v.kindLabel}</NTV.Button>
                    <NTV.Button variant={v.reorderVariant} size="m" iconLeft="grip-vertical" iconRight={v.none} onClick={v.toggleReorder}>{v.reorderLabel}</NTV.Button>
                  </div>
                  <div className="dv-row">
                    <NTV.Input size="l" placeholder="Search Playlist Content" iconLeft="magnifying-glass" label="Search playlist content" value={v.q} onChange={v.setQ} style={{ width: "230px" }} />
                    <button type="button" className="ntv-btn ntv-btn--m" onClick={v.toggleAll} style={{ background: "var(--fg-primary)", color: "var(--white)", border: "0" }}>
                      <NTV.Icon name="check" size={v.i12} />
                      <span>{v.markLabel}</span>
                    </button>
                    <NTV.Button variant="primary" size="m" iconRight="pen-to-square" disabled={v.noneSel} onClick={v.bulkModify}>Bulk Modify</NTV.Button>
                    <NTV.Button variant="primary" size="m" iconRight="trash" disabled={v.noneSel} onClick={v.askBulk}>Bulk Delete</NTV.Button>
                    <div className="dv-vt" role="group" aria-label="View">
                      <button type="button" aria-label="Grid view" aria-pressed={v.isGrid} onClick={v.toGrid}><NTV.Icon name="grid-2" size={v.i14} /></button>
                      <button type="button" aria-label="List view" aria-pressed={v.isList} onClick={v.toList}><NTV.Icon name="rectangle-history" size={v.i14} /></button>
                    </div>
                  </div>
                </div>
                {v.isGrid ? (
                  <>
                    <div className="dv-grid" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "10px" }}>
                    {(v.items || []).map((_it, $index) => (
                      <React.Fragment key={$index}>
                        <div className={`pd-tile ${s(_it?.cls)}`} onClick={_it?.toggle} style={{ gridColumn: `span ${s(_it?.span)}` }}>
                          <div className="dv-thumb" style={{ aspectRatio: `${s(_it?.ratio)}`, borderRadius: "0" }}>
                            <img src={_it?.image} alt="" />
                            <span style={{ position: "absolute", left: "6px", top: "6px", padding: "0 6px", borderRadius: "4px", background: "#fff", fontSize: "9px", lineHeight: "16px", fontWeight: "700", color: `${s(_it?.badgeColor)}` }}>{_it?.badge}</span>
                          </div>
                          <div className="dv-row" style={{ gap: "4px", padding: "5px 6px", fontSize: "11px", lineHeight: "16px", background: `${s(_it?.capBg)}`, color: `${s(_it?.capColor)}` }}>
                            <span style={{ flex: "1", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_it?.n}{" "}{_it?.title}</span>
                            <span>{_it?.dur}</span>
                            {v.reorder ? (
                              <>
                                <button type="button" className="dv-ib" style={{ width: "18px", height: "18px" }} aria-label="Move earlier" onClick={_it?.up}><NTV.Icon name="angle-up" size={v.i10} /></button>
                                <button type="button" className="dv-ib" style={{ width: "18px", height: "18px" }} aria-label="Move later" onClick={_it?.down}><NTV.Icon name="angle-down" size={v.i10} /></button>
                              </>
                            ) : null}
                            {v.notReorder ? (
                              <>
                                <button type="button" className="dv-ib" style={{ width: "18px", height: "18px" }} aria-label="Modify" onClick={_it?.modify}><NTV.Icon name="gear" size={v.i10} /></button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  </>
                ) : null}
                {v.isList ? (
                  <>
                    <div className="dv-table">
                    <div role="table" aria-label="Playlist contents">
                      <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: "40px 90px 1.6fr 90px 110px 1fr 1fr 70px" }}>
                        <div />
                        <div>Thumbnail</div>
                        <div>File Name</div>
                        <div>File Type</div>
                        <div>Duration</div>
                        <div>Play Where</div>
                        <div>Schedule</div>
                        <div>Action</div>
                      </div>
                      {(v.items || []).map((_it, $index) => (
                        <React.Fragment key={$index}>
                          <div role="row" className="dv-tr" style={{ gridTemplateColumns: "40px 90px 1.6fr 90px 110px 1fr 1fr 70px", minHeight: "52px" }}>
                            <div>
                              <NTV.Checkbox checked={_it?.checked} onChange={_it?.toggle} ariaLabel="Select" />
                            </div>
                            <div>
                              <span className="dv-thumb" style={{ display: "block", width: "56px", height: "34px" }}><img src={_it?.image} alt="" /></span>
                            </div>
                            <div>{_it?.n}{" "}{_it?.title}</div>
                            <div>
                              <span style={{ fontSize: "9px", fontWeight: "700", color: `${s(_it?.badgeColor)}` }}>{_it?.badge}</span>
                            </div>
                            <div>{_it?.dur}</div>
                            <div>{_it?.where}</div>
                            <div>{_it?.sched}</div>
                            <div>
                              <button type="button" className="dv-ib" aria-label="Modify" onClick={_it?.modify}><NTV.Icon name="gear" size={v.i12} /></button>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  </>
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
                <span className="dv-sub" style={{ fontSize: "11px", marginTop: "auto" }}>{"Showing "}{v.count}{" of "}{v.count}{" items"}</span>
              </section>
              <aside className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <NTV.Input size="l" placeholder="Search Content or Folder" iconLeft="magnifying-glass" label="Search content or folder" value={v.libQ} onChange={v.setLibQ} />
                <a href="DealerMedia.dc.html" className="ntv-btn ntv-btn--xl" style={{ textDecoration: "none", justifyContent: "center", border: "1px solid var(--fg-secondary)", background: "var(--bg-surface)", color: "var(--fg-primary)" }}>
                  <NTV.Icon name="arrow-up-from-bracket" size={v.i12} />
                  <span>Upload Content</span>
                </a>
                {v.inFolder ? (
                  <>
                    <button type="button" className="dv-a" onClick={v.backFolders} style={{ alignSelf: "flex-start", fontSize: "12px" }}>‹ Folders</button>
                    <strong style={{ fontSize: "13px" }}>{v.folderName}</strong>
                    {(v.lib || []).map((_m, $index) => (
                    <React.Fragment key={$index}>
                      <div className="pd-lib">
                        <span className="dv-thumb" style={{ width: "64px", height: "36px" }}><img src={_m?.image} alt="" /></span>
                        <span style={{ minWidth: "0" }}>
                          <strong style={{ display: "block", fontSize: "12px", lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_m?.title}</strong>
                          <span className="dv-sub" style={{ fontSize: "10px", color: `${s(_m?.badgeColor)}` }}>{_m?.badge}</span>
                        </span>
                        <button type="button" className="dv-ib" aria-label="Add to playlist" onClick={_m?.add}><NTV.Icon name={_m?.icon} size={v.i12} /></button>
                      </div>
                    </React.Fragment>
                  ))}
                  </>
                ) : null}
                {v.notInFolder ? (
                  <>
                    <button type="button" className="ml-row" onClick={v.openAssigned}>
                    <NTV.Icon name="users" size={v.i14} />
                    Assigned to Dealer
                  </button>
                    <button type="button" className="ml-row" onClick={v.openFloating}>
                    <NTV.Icon name="clock" size={v.i14} />
                    Floating Contents
                  </button>
                    <span className="dv-row" style={{ gap: "6px", fontSize: "13px", padding: "4px 0" }}>
                    <NTV.Icon name="angle-down" size={v.i10} />
                    {"Folders "}
                    <span className="dv-sub" style={{ display: "inline" }}>({v.folderCount})</span>
                  </span>
                    {(v.folders || []).map((_f, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" className="ml-row" onClick={_f?.open} style={{ paddingLeft: "14px" }}>
                        <NTV.Icon name="folder" size={v.i14} />
                        {_f?.name}{" "}
                        <span className="dv-sub" style={{ display: "inline" }}>({_f?.n})</span>
                      </button>
                    </React.Fragment>
                  ))}
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
                      <input id="sd1" className="dv-field" type="date" value="2026-11-15" />
                    </div>
                    <div>
                      <label className="dv-label" htmlFor="sd2">End</label>
                      <input id="sd2" className="dv-field" type="date" value="2026-12-31" />
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
