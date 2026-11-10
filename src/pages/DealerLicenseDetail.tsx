// @ts-nocheck
/**
 * Page: License Details  (route /licenses/detail)
 * Converted from the Claude Design artboard DealerLicenseDetail.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { STATUS, addNav, arrived, byId, contains, go, hostName, navFn, peekNav, plByName, screenName, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerLicenseDetail.css';

/* ============================== Logic ============================== */

var TINT = { online: 'var(--success-050)', offline: 'var(--danger-050)', pending: 'var(--warning-050)', ready: 'var(--info-050)', disabled: 'var(--primary-100)', unassigned: 'var(--primary-100)' };
var ZC = { Main: 'var(--chart-1)', Vertical: 'var(--chart-2)', Horizontal: 'var(--chart-3)', Background: 'var(--chart-4)' };
function donut(items) { var C = 314.16, tot = items.reduce(function (a, b) { return a + b.n; }, 0) || 1, acc = 0; return items.map(function (it) { var len = it.n / tot * C, seg = { label: it.label, value: it.value, pct: Math.round(it.n / tot * 100) + '%', color: it.color, dash: len.toFixed(2) + ' ' + C, off: (-acc).toFixed(2) }; acc += len; return seg; }); }
function secs(m) { return parseInt(m.duration, 10) || 15; }
function fmtS(n) { return n >= 60 ? Math.floor(n / 60) + 'm ' + (n % 60) + 's' : n + 's'; }
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerLicenseDetail.dc.html') || {};
    var l = byId(D.licenses, f.id) || byId(D.licenses, 'l44');
    this.state = { seePlaying: true, gridQ: '', l: Object.assign({}, l), tab: 'Details', zone: 'All', showBg: true, now: 0, actions: false, modal: '', cf: null, aliasDraft: '', tagMenu: false, pwShown: false, speed: null, shots: null, code: '', linking: false, toast: null };
  }
  componentDidMount() { var self = this; this._np = setInterval(function () { self.setState({ now: self.state.now + 1 }); }, 2500); }
  componentWillUnmount() { clearInterval(this._np); if (this._tt) clearTimeout(this._tt); if (this._x) clearTimeout(this._x); }
  renderVals() {
    var self = this, s = this.state, l = s.l;
    var st = STATUS[l.status];
    var sc = l.screen ? byId(D.screens, l.screen) : null;
    var online = l.status === 'online';
    var zones = sc ? Object.keys(sc.zones).filter(function (z) { return s.showBg || z !== 'Background'; }) : [];
    var zoneItems = function (z) { var p = plByName(sc.zones[z]); return p ? p.items.map(function (id) { var m = byId(D.media, id); return m ? { m: m, zone: z, pl: p.name } : null; }).filter(Boolean) : []; };
    var all = []; zones.forEach(function (z) { if (s.zone === 'All' || s.zone === z) all = all.concat(zoneItems(z)); });
    var shown = all.filter(function (x) { return contains(x.m.title, s.gridQ); });
    var kinds = {}; all.forEach(function (x) { kinds[x.m.kind] = (kinds[x.m.kind] || 0) + 1; });
    var kc = { image: 'var(--chart-1)', video: 'var(--chart-2)', widget: 'var(--chart-3)' };
    var durItems = zones.filter(function (z) { return s.zone === 'All' || s.zone === z; }).map(function (z) { var t = zoneItems(z).reduce(function (a, x) { return a + secs(x.m); }, 0); return { label: z, n: t, value: fmtS(t), color: ZC[z] }; });
    var durTot = durItems.reduce(function (a, b) { return a + b.n; }, 0);
    var nowIdx = shown.length && s.seePlaying ? s.now % shown.length : -1;
    var runAction = function (label, msg) { return function () { self.setState({ actions: false, modal: '' }); toast(self, label + '…', 'info'); self._x = setTimeout(function () { toast(self, msg); }, 1400); }; };
    var confirmA = function (label, text, msg) { return function () { self.setState({ actions: false, modal: 'confirm', cf: { title: label + '?', text: text, okLabel: label, ok: runAction(label, msg) } }); }; };
    var shots = s.shots || (sc && online ? zoneItems('Main').slice(0, 3).map(function (x, i) { return { image: x.m.image, time: ['Today 9:41 AM', 'Today 8:12 AM', 'Yesterday 6:30 PM'][i] }; }) : []);
    var tagsOn = (l.tags || []).map(function (t) { return byId(D.tags, t); }).filter(Boolean);
    var code = (s.code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    var cf = s.cf || {};
    return {
      none: null, i10: 10, i14: 14, w460: 460, w500: 500, w1000: 1000,
      crumbs: [{ label: 'Licenses', href: 'DealerLicenses.dc.html' }, l.alias],
      alias: l.alias, key: l.key, type: l.type, install: l.host ? l.install : '—', request: l.request,
      hostName: l.host ? hostName(l.host) : 'Unassigned', openHost: navFn('DealerHostDetail.dc.html', { id: l.host }),
      st: { label: st.label, color: st.color, tint: TINT[l.status] },
      tags: tagsOn.map(function (t) { return { name: t.name, remove: function () { self.setState({ l: Object.assign({}, self.state.l, { tags: self.state.l.tags.filter(function (x) { return x !== t.id; }) }) }); toast(self, 'Tag removed'); } }; }),
      tagMenu: s.tagMenu, toggleTagMenu: function () { self.setState({ tagMenu: !self.state.tagMenu }); },
      tagOptions: D.tags.filter(function (t) { return !t.sys && (l.tags || []).indexOf(t.id) === -1; }).map(function (t) { return { name: t.name, pick: function () { self.setState({ tagMenu: false, l: Object.assign({}, self.state.l, { tags: (self.state.l.tags || []).concat([t.id]) }) }); toast(self, 'Tag “' + t.name + '” added'); } }; }),
      noTagOptions: D.tags.filter(function (t) { return !t.sys && (l.tags || []).indexOf(t.id) === -1; }).length === 0,
      canLink: l.status === 'ready' || l.status === 'pending',
      actionsOpen: s.actions, actionsOff: l.status === 'unassigned', toggleActions: function () { self.setState({ actions: !self.state.actions }); },
      actions: [
        { label: 'Check Status', icon: 'circle-info', cls: '', run: runAction('Checking status', 'Player responded · ' + st.label) },
        { label: 'Content Update', icon: 'arrows-rotate', cls: '', run: runAction('Pushing content update', 'Content update sent to ' + l.alias) },
        { label: 'Refetch Content', icon: 'download', cls: '', run: runAction('Refetching content', 'Content refetched on ' + l.alias) },
        { label: 'Reboot Player', icon: 'arrow-rotate-right', cls: '', run: confirmA('Reboot Player', 'The player app restarts and the screen goes blank for about 30 seconds.', 'Player rebooted') },
        { label: 'Reboot Pi', icon: 'power-off', cls: '', run: confirmA('Reboot Pi', 'The Raspberry Pi restarts. The screen is off for 1–2 minutes.', 'Pi rebooted') },
        { label: 'Reset Data', icon: 'trash', cls: 'dv-danger', run: confirmA('Reset Data', 'Downloaded content and cache are cleared and fetched again. This can take several minutes on slow internet.', 'Player data reset') }
      ],
      tabs: ['Details', 'Content'].map(function (t) { return { label: t, on: s.tab === t, pick: function () { self.setState({ tab: t }); } }; }),
      i48: 48, i10: 10,
      unlinked: (l.status === 'ready' || l.status === 'pending') && s.tab === 'Details', showDetails: s.tab === 'Details' && !(l.status === 'ready' || l.status === 'pending'), showContent: s.tab === 'Content',
      copyKey: function () { try { navigator.clipboard.writeText(l.key); } catch (e) {} toast(self, 'License key copied', 'info'); },
      shotCount: shots.length, clearShots: function () { self.setState({ shots: [] }); toast(self, 'Screenshots deleted'); },
      devices: [['Pi', 'raspberry-pi', online], ['Player', 'play', online], ['TV', 'tv', online], ['Display', 'tv', online && l.type !== 'Closed']].map(function (d) { return { name: d[0], icon: d[1], state: d[2] ? 'Online' : 'Offline', color: d[2] ? 'var(--success-400)' : 'var(--fg-secondary)', tint: d[2] ? 'var(--success-050)' : 'var(--primary-100)' }; }),
      lastDisconnect: online ? 'Nov 4, 2026 09:52 AM' : 'Nov 8, 2026 09:14 AM',
      speedAt: s.speed && s.speed !== 'testing' ? 'Just now' : 'Mon, Nov 9, 2026 · 00:02:26',
      conn: online ? 'Good' : 'No signal', down: online ? (s.speed && s.speed !== 'testing' ? '41.20 Mbps' : '25.43 Mbps') : '—', up: online ? (s.speed && s.speed !== 'testing' ? '12.04 Mbps' : '21.40 Mbps') : '—',
      seePlaying: s.seePlaying, toggleSee: function (on) { self.setState({ seePlaying: typeof on === 'boolean' ? on : !self.state.seePlaying }); },
      gridQ: s.gridQ, setGridQ: function (v) { self.setState({ gridQ: val(v) }); },
      zoneLabel: s.zone === 'All' ? 'All Zones' : s.zone + ' Zone',
      zc: { main: s.zone === 'Main' ? 'var(--info-800)' : '#3a4f8f', vertical: s.zone === 'Vertical' ? 'var(--info-800)' : '#5b73b8', horizontal: s.zone === 'Horizontal' ? 'var(--info-800)' : '#8ea4dc' },
      zn: { main: sc ? zoneItems('Main').length : 0, vertical: sc ? zoneItems('Vertical').length : 0, horizontal: sc ? zoneItems('Horizontal').length : 0 },
      bgFill: s.showBg ? (s.zone === 'Background' ? 'var(--info-800)' : '#b4ccfb') : 'var(--primary-100)',
      zMain: function () { self.setState({ zone: self.state.zone === 'Main' ? 'All' : 'Main', now: 0 }); },
      zVert: function () { self.setState({ zone: self.state.zone === 'Vertical' ? 'All' : 'Vertical', now: 0 }); },
      zHor: function () { self.setState({ zone: self.state.zone === 'Horizontal' ? 'All' : 'Horizontal', now: 0 }); },
      isDetails: s.tab === 'Details', isContent: s.tab === 'Content',
      offline: !online, shots: shots,
      takeShot: function () { self.setState({ shots: [{ image: D.B.steak, time: 'Just now' }].concat(shots.slice(0, 2)) }); toast(self, 'Screenshot captured'); },
      piText: online ? 'Pi is online' : (l.status === 'offline' ? 'Offline for 26h' : st.label),
      lastOnline: online ? 'Now' : (l.status === 'offline' ? 'Nov 8, 2026 · 9:14 AM' : '—'), uptime: online ? '6d 4h' : '—',
      anydesk: l.anydesk, pw: s.pwShown ? l.anypw : '••••••••', pwLabel: s.pwShown ? 'Hide Password' : 'Show Password',
      togglePw: function () { self.setState({ pwShown: !self.state.pwShown }); },
      copyId: function () { try { navigator.clipboard.writeText(l.anydesk.replace(/ /g, '')); } catch (e) {} toast(self, 'AnyDesk ID copied', 'info'); },
      openAnydesk: function () { toast(self, 'Opening AnyDesk session ' + l.anydesk + '…', 'info'); },
      hasScreen: !!sc, noScreen: !sc, screenName: sc ? sc.name : 'No screen', templateName: sc ? sc.template : '',
      screenSub: sc ? sc.type + ' · ' + sc.template + ' · click a playlist to open it' : '',
      openScreen: navFn('DealerScreenDetail.dc.html', { id: sc && sc.id }),
      zoneLinks: sc ? Object.keys(sc.zones).map(function (z) { var p = plByName(sc.zones[z]); return { color: { Main: 'var(--accent-action)', Vertical: '#5b73b8', Horizontal: '#8ea4dc', Background: '#b4ccfb' }[z], zone: z, playlist: sc.zones[z], open: navFn('DealerPlaylistDetail.dc.html', { id: p && p.id }) }; }) : [],
      net: l.net ? (l.net === 'WiFi' ? 'Wi-Fi' : 'LAN') : '—', speed: s.speed || l.speed,
      speedOff: !online || s.speed === 'testing', speedLabel: s.speed === 'testing' ? 'Testing…' : 'Run Speedtest',
      runSpeed: function () { self.setState({ speed: 'testing' }); self._x = setTimeout(function () { self.setState({ speed: '41 MB/s ↓ · 12 MB/s ↑' }); toast(self, 'Speedtest done'); }, 1800); },
      zoneChips: ['All'].concat(zones).map(function (z) { return { label: z === 'All' ? 'All Zones' : z, on: s.zone === z, pick: function () { self.setState({ zone: z, now: 0 }); } }; }),
      showBg: s.showBg, toggleBg: function (on) { self.setState({ showBg: typeof on === 'boolean' ? on : !self.state.showBg, zone: 'All' }); },
      assets: (function () { var src = { Hosts: 0, Advertisers: 0, Widgets: 0, Others: 0 }; all.forEach(function (x) { var k = x.m.source === 'Channels' ? 'Others' : x.m.source; src[k in src ? k : 'Others']++; }); var cc = { Hosts: 'var(--danger-main)', Advertisers: 'var(--warning-main)', Widgets: 'var(--info-main)', Others: 'var(--success-main)' }; return { total: all.length, segs: donut(Object.keys(src).map(function (k) { return { label: k, n: src[k], value: src[k], color: cc[k] }; })) }; })(),
      dur: { total: fmtS(durTot), segs: donut(durItems) },
      gridLabel: s.zone === 'All' ? all.length + ' items across ' + zones.length + ' zones' : s.zone + ' · ' + all.length + ' items',
      nowTitle: nowIdx >= 0 ? all[nowIdx].m.title : '—',
      grid: shown.map(function (x, i) { var B = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] }[x.m.kind] || ['IMAGE', 'var(--info-main)']; return { image: x.m.image, title: x.m.title, badge: B[0], badgeColor: B[1], playing: i === nowIdx, cls: i === nowIdx ? 'playing' : '' }; }),
      gridEmpty: shown.length === 0,
      openPreview: function () { self.setState({ modal: 'preview' }); },
      video: 'images/fc95a086282b1f7287a5908d1f7a482b.mp4', poster: 'images/491eee740560584c8c35d92dad5f3c7e.jpg',
      m: { confirm: s.modal === 'confirm', rename: s.modal === 'rename', link: s.modal === 'link', preview: s.modal === 'preview' },
      closeModal: function () { if (self._x) clearTimeout(self._x); self.setState({ modal: '', linking: false }); },
      cf: { title: cf.title || '', text: cf.text || '', okLabel: cf.okLabel || 'OK', ok: cf.ok || function () {} },
      openRename: function () { self.setState({ modal: 'rename', aliasDraft: self.state.l.alias }); },
      aliasDraft: s.aliasDraft, setAliasDraft: function (v) { self.setState({ aliasDraft: val(v) }); }, aliasBad: !s.aliasDraft.trim(),
      saveAlias: function () { self.setState({ l: Object.assign({}, self.state.l, { alias: self.state.aliasDraft.trim() }), modal: '' }); toast(self, 'Alias updated'); },
      openLink: function () { self.setState({ modal: 'link', code: '', linking: false }); },
      lk: { entering: !s.linking, linking: s.linking, code: code,
        boxes: [0, 1, 2, 3, 4, 5].map(function (i) { return { ch: code[i] || '', border: code.length === i ? 'var(--accent-action)' : 'var(--fg-secondary)' }; }),
        set: function (v) { self.setState({ code: val(v) }); },
        blocked: code.length !== 6 || s.linking,
        go: function () { self.setState({ linking: true }); self._x = setTimeout(function () { self.setState({ linking: false, modal: '', l: Object.assign({}, self.state.l, { status: 'online', net: self.state.l.net || 'LAN' }) }); toast(self, 'Device linked · ' + self.state.l.alias + ' is online'); }, 1800); } },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerLicenseDetail.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-license-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Licenses" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between">
            <NTV.Breadcrumbs items={v.crumbs} />
            <strong style={{ fontSize: "14px" }}>Tuesday, November 10, 2026</strong>
          </div>
          <section style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
              <div className="dv-row" style={{ gap: "10px", flexWrap: "wrap", position: "relative" }}>
                <h1 style={{ margin: "0", fontSize: "20px", lineHeight: "30px", fontWeight: "700" }}>{v.alias}</h1>
                <button type="button" className="dv-ib" style={{ color: "var(--accent-action)" }} aria-label="Rename alias" onClick={v.openRename}><NTV.Icon name="pen-to-square" size={v.i14} /></button>
                <button type="button" className="dv-ib" style={{ color: "var(--accent-action)" }} aria-label="Add tag" onClick={v.toggleTagMenu}><NTV.Icon name="tag" size={v.i14} /></button>
                {(v.tags || []).map((_t, $index) => (
                  <React.Fragment key={$index}>
                    <span className="dv-tagpill" style={{ background: "var(--accent-action)", gap: "6px" }}>
                      {_t?.name}
                      <button type="button" aria-label="Remove tag" onClick={_t?.remove} style={{ display: "inline-flex", border: "0", background: "none", padding: "0", color: "inherit", cursor: "pointer" }}><NTV.Icon name="x" size={v.i10} /></button>
                    </span>
                  </React.Fragment>
                ))}
                <span className="dv-pill" style={{ background: `${s(v.st?.tint)}`, color: `${s(v.st?.color)}`, height: "22px" }}>
                  <span className="dv-dot" style={{ background: `${s(v.st?.color)}` }} />
                  {v.st?.label}
                </span>
                {v.tagMenu ? (
                  <>
                    <div className="dv-menu" style={{ top: "34px", left: "120px" }}>
                    {(v.tagOptions || []).map((_o, $index) => (
                      <React.Fragment key={$index}>
                        <button type="button" className="dv-mi" onClick={_o?.pick}>{_o?.name}</button>
                      </React.Fragment>
                    ))}
                    {v.noTagOptions ? (
                      <>
                        <p className="dv-sub" style={{ padding: "8px 14px" }}>All your tags are added.</p>
                      </>
                    ) : null}
                  </div>
                  </>
                ) : null}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "auto auto auto", gap: "4px 32px", fontSize: "12px", lineHeight: "18px" }}>
                <span>
                  <span className="dv-sub" style={{ display: "inline" }}>Host Name:</span>
 
                  <a className="dv-a" href="DealerHostDetail.dc.html" onClick={v.openHost} data-nav={v.openHostNav}>{v.hostName}</a>
                </span>
                <span>
                  <span className="dv-sub" style={{ display: "inline" }}>Business Hours:</span>
 
                  <strong>Monday: Open 24 hours</strong>
                </span>
                <span>
                  <span className="dv-sub" style={{ display: "inline" }}>RPi Time:</span>
 
                  <strong>Nov 10, 2026, 09:58:55 AM</strong>
                </span>
                <span>
                  <span className="dv-sub" style={{ display: "inline" }}>Type:</span>
 
                  <strong>{v.type}{" license"}</strong>
                </span>
                <span>
                  <span className="dv-sub" style={{ display: "inline" }}>Timezone:</span>
 
                  <strong>US/Central</strong>
                </span>
                <span className="dv-row" style={{ gap: "4px" }}>
                  <span className="dv-sub" style={{ display: "inline" }}>License Key:</span>
 
                  <strong>{v.key}</strong>
                  <button type="button" className="dv-ib" style={{ width: "20px", height: "20px", color: "var(--accent-action)" }} aria-label="Copy license key" onClick={v.copyKey}><NTV.Icon name="copy" size={v.i10} /></button>
                </span>
              </div>
            </div>
            <div className="dv-row" style={{ position: "relative", flex: "none" }}>
              {v.canLink ? (
                <>
                  <NTV.Button variant="secondary" size="xl" iconRight="link" onClick={v.openLink}>Link Device</NTV.Button>
                </>
              ) : null}
              <button type="button" className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" onClick={v.toggleActions} disabled={v.actionsOff} style={{ background: "var(--red-orange-main)" }}>
                <span>Take Action</span>
                <NTV.Icon name="angle-right" size={v.i14} />
              </button>
              {v.actionsOpen ? (
                <>
                  <div className="dv-menu" role="menu" style={{ top: "52px", right: "0", minWidth: "220px" }}>
                  {(v.actions || []).map((_a, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" role="menuitem" className={`dv-mi ${s(_a?.cls)}`} onClick={_a?.run}>
                        <NTV.Icon name={_a?.icon} size={v.i14} />
                        {_a?.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                </>
              ) : null}
            </div>
          </section>
          <div className="dv-tabs" role="tablist">
            {(v.tabs || []).map((_t, $index) => (
              <React.Fragment key={$index}>
                <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick} style={{ minWidth: "110px" }}>{_t?.label}</button>
              </React.Fragment>
            ))}
          </div>
          {v.unlinked ? (
            <>
              <section className="dv-card dv-empty" style={{ minHeight: "460px" }}>
              <span style={{ color: "var(--accent-action)" }}><NTV.Icon name="raspberry-pi" size={v.i48} /></span>
              <strong style={{ fontSize: "16px", color: "var(--fg-primary)" }}>No Device Linked Yet</strong>
              <span>
                Turn on the Raspberry Pi at the host and enter the 6-character code shown on the TV to pair it with this license.
              </span>
              <NTV.Button variant="primary" size="m" iconRight="link" onClick={v.openLink}>Link Device</NTV.Button>
            </section>
            </>
          ) : null}
          {v.showDetails ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "330px minmax(0, 1fr)", gap: "20px", alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="dv-between">
                    <h2 className="dv-h3">Live Screenshot</h2>
                    <span className="dv-sub">{v.shotCount}{" Screenshot"}</span>
                  </div>
                  <div style={{ minHeight: "170px", padding: "10px", borderRadius: "var(--radius-sm)", background: "var(--bg-app)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", alignContent: "start" }}>
                    {(v.shots || []).map((_x, $index) => (
                      <React.Fragment key={$index}>
                        <div>
                          <div className="dv-thumb" style={{ aspectRatio: "16 / 10" }}><img src={_x?.image} alt="Screenshot" /></div>
                          <p className="dv-sub" style={{ fontSize: "9px", textAlign: "center" }}>{_x?.time}</p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="dv-row">
                    <NTV.Button variant="primary" size="m" iconLeft="image" iconRight={v.none} disabled={v.offline} onClick={v.takeShot} style={{ flex: "1" }}>Screenshot Player</NTV.Button>
                    <NTV.Button variant="secondary" size="m" iconRight="trash" onClick={v.clearShots}>Delete</NTV.Button>
                  </div>
                </section>
                <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h2 className="dv-h3">Screen Info</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div className="dv-kv2">
                      <span>Screen Name</span>
                      <span>
                        <a className="dv-a" href="DealerScreenDetail.dc.html" onClick={v.openScreen} data-nav={v.openScreenNav}>{v.screenName}</a>
                      </span>
                    </div>
                    <div className="dv-kv2">
                      <span>Screen Template</span>
                      <span>{v.templateName}</span>
                    </div>
                  </div>
                  <p className="dv-sub">Playlist Per Zone</p>
                  {(v.zoneLinks || []).map((_z, $index) => (
                    <React.Fragment key={$index}>
                      <a href="DealerPlaylistDetail.dc.html" onClick={_z?.open} className="dv-row" style={{ gap: "10px", padding: "8px 6px", borderRadius: "var(--radius-sm)", textDecoration: "none", color: "var(--fg-primary)", fontSize: "12px" }} data-nav={_z?.openNav}>
                        <span style={{ width: "22px", height: "14px", borderRadius: "2px", background: `${s(_z?.color)}`, flex: "none" }} />
                        <strong style={{ width: "80px" }}>{_z?.zone}</strong>
                        <span style={{ flex: "1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_z?.playlist}</span>
                        <NTV.Icon name="angle-right" size={v.i10} />
                      </a>
                    </React.Fragment>
                  ))}
                  {v.noScreen ? (
                    <>
                      <p className="dv-sub">No screen on this license yet.</p>
                    </>
                  ) : null}
                </section>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h2 className="dv-h3">Pi and Player Status</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "12px" }}>
                    {(v.devices || []).map((_d, $index) => (
                      <React.Fragment key={$index}>
                        <div className="dv-between" style={{ flexWrap: "nowrap", padding: "10px 12px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)" }}>
                          <span className="dv-row" style={{ gap: "10px" }}>
                            <NTV.IconTile icon={_d?.icon} tone="danger" />
                            <strong style={{ fontSize: "14px" }}>{_d?.name}</strong>
                          </span>
                          <span className="dv-pill" style={{ height: "20px", fontSize: "10px", background: `${s(_d?.tint)}`, color: `${s(_d?.color)}` }}>
                            <span className="dv-dot" style={{ background: `${s(_d?.color)}`, width: "6px", height: "6px" }} />
                            {_d?.state}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "12px" }}>
                    <div className="dv-kv2">
                      <span>Last Startup</span>
                      <span style={{ fontWeight: "400" }}>{v.lastOnline}</span>
                    </div>
                    <div className="dv-kv2">
                      <span>Last Disconnect</span>
                      <span style={{ fontWeight: "400" }}>{v.lastDisconnect}</span>
                    </div>
                    <div className="dv-kv2">
                      <span>Last Update</span>
                      <span style={{ fontWeight: "400" }}>{v.lastOnline}</span>
                    </div>
                    <div className="dv-kv2">
                      <span>TV Brand</span>
                      <span style={{ fontWeight: "400" }}>Samsung Galaxy</span>
                    </div>
                    <div className="dv-kv2">
                      <span>Anydesk</span>
                      <span className="dv-row" style={{ gap: "4px", fontWeight: "400" }}>
                        {v.anydesk}
                        <button type="button" className="dv-ib" style={{ width: "20px", height: "20px", color: "var(--accent-action)" }} aria-label="Copy AnyDesk ID" onClick={v.copyId}><NTV.Icon name="copy" size={v.i10} /></button>
                      </span>
                    </div>
                    <div className="dv-kv2">
                      <span>Anydesk Password</span>
                      <span className="dv-row" style={{ gap: "4px", fontWeight: "400" }}>
                        {v.pw}
                        <button type="button" className="dv-ib" style={{ width: "20px", height: "20px", color: "var(--accent-action)" }} aria-label="Show password" onClick={v.togglePw}><NTV.Icon name="eye" size={v.i10} /></button>
                      </span>
                    </div>
                  </div>
                </section>
                <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="dv-between">
                    <div>
                      <h2 className="dv-h3">System Info</h2>
                      <p className="dv-sub" style={{ fontSize: "10px" }}>{"Last speedtest · "}{v.speedAt}</p>
                    </div>
                    <NTV.Button variant="secondary" size="m" iconLeft="arrows-rotate" iconRight={v.none} disabled={v.speedOff} onClick={v.runSpeed}>{v.speedLabel}</NTV.Button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "24px", fontSize: "12px", lineHeight: "20px" }}>
                    <div>
                      <strong style={{ display: "block", marginBottom: "6px" }}>Type</strong>
                      <div className="dv-between">
                        <span>Connection</span>
                        <span style={{ color: "var(--success-main)" }}>{v.conn}</span>
                      </div>
                      <div className="dv-between">
                        <span>Type</span>
                        <span>{v.net}</span>
                      </div>
                      <div className="dv-between">
                        <span>Current IP</span>
                        <span>119.93.171.229</span>
                      </div>
                      <div className="dv-between">
                        <span>MAC Address</span>
                        <span>b8:27:eb:7e:ca:06</span>
                      </div>
                    </div>
                    <div>
                      <strong style={{ display: "block", marginBottom: "6px" }}>Speed</strong>
                      <div className="dv-between">
                        <span>Download</span>
                        <span style={{ color: "var(--success-main)" }}>{v.down}</span>
                      </div>
                      <div className="dv-between">
                        <span>Upload</span>
                        <span style={{ color: "var(--success-main)" }}>{v.up}</span>
                      </div>
                    </div>
                    <div>
                      <strong style={{ display: "block", marginBottom: "6px" }}>Hardware</strong>
                      <div className="dv-between">
                        <span>Pi version</span>
                        <span>Raspberry Pi 4 Model B</span>
                      </div>
                      <div className="dv-between">
                        <span>RAM</span>
                        <span>4 GB</span>
                      </div>
                      <div className="dv-between">
                        <span>Storage</span>
                        <span>18.2 GB free of 32 GB</span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "var(--primary-100)", marginTop: "6px" }}>
                        <div style={{ width: "43%", height: "100%", borderRadius: "3px", background: "var(--accent-action)" }} />
                      </div>
                    </div>
                    <div>
                      <strong style={{ display: "block", marginBottom: "6px" }}>Software</strong>
                      <div className="dv-between">
                        <span>Player</span>
                        <span>Version 2</span>
                      </div>
                      <div className="dv-between">
                        <span>Server</span>
                        <span>2.9.2</span>
                      </div>
                      <div className="dv-between">
                        <span>UI</span>
                        <span>3.0.42</span>
                      </div>
                      <div className="dv-between">
                        <span>Chromium</span>
                        <span>92.0.415.98</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            </>
          ) : null}
          {v.showContent ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.2fr", gap: "20px" }}>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3" style={{ fontSize: "14px" }}>{v.screenName}</h2>
                  <span className="dv-sub" style={{ fontSize: "10px" }}>Click a zone to filter the playlist</span>
                </div>
                <div style={{ position: "relative", aspectRatio: "16 / 9", display: "grid", gridTemplateColumns: "753fr 165fr", gridTemplateRows: "417fr 89fr", gap: "3px", padding: "3px", borderRadius: "var(--radius-sm)", background: `${s(v.bgFill)}` }}>
                  <button type="button" onClick={v.zMain} style={{ gridColumn: "1 / 2", gridRow: "1 / 2", border: "0", borderRadius: "2px", cursor: "pointer", color: "#fff", fontFamily: "inherit", background: `${s(v.zc?.main)}` }}>
                    <strong style={{ display: "block" }}>Main</strong>
                    <span style={{ fontSize: "10px" }}>{v.zn?.main}{" items"}</span>
                  </button>
                  <button type="button" onClick={v.zVert} style={{ gridColumn: "2 / 3", gridRow: "1 / 2", border: "0", borderRadius: "2px", cursor: "pointer", color: "#fff", fontFamily: "inherit", background: `${s(v.zc?.vertical)}` }}>
                    <strong style={{ display: "block", fontSize: "12px" }}>Vertical</strong>
                    <span style={{ fontSize: "10px" }}>{v.zn?.vertical}{" items"}</span>
                  </button>
                  <button type="button" onClick={v.zHor} style={{ gridColumn: "1 / 3", gridRow: "2 / 3", border: "0", borderRadius: "2px", cursor: "pointer", color: "#fff", fontFamily: "inherit", background: `${s(v.zc?.horizontal)}` }}>
                    <strong>Horizontal</strong>
 
                    <span style={{ fontSize: "10px" }}>{v.zn?.horizontal}{" items"}</span>
                  </button>
                </div>
                <div className="dv-between">
                  <NTV.Button variant="primary" size="m" iconRight="play" onClick={v.openPreview}>Preview</NTV.Button>
                  <span className="dv-row" style={{ gap: "8px", fontSize: "12px" }}>
                    <NTV.Switch checked={v.showBg} onChange={v.toggleBg} label="Background contents" />
                    Background Contents
                  </span>
                </div>
              </section>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3" style={{ fontSize: "14px" }}>Assets Breakdown</h2>
                  <span className="dv-sub" style={{ fontSize: "10px" }}>{v.zoneLabel}</span>
                </div>
                <div className="dv-row" style={{ gap: "24px" }}>
                  <div style={{ position: "relative", width: "150px", height: "150px", flex: "none" }}>
                    <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Assets breakdown">
                      <g transform="rotate(-90 70 70)">
                        <circle cx="70" cy="70" r="50" fill="none" stroke="var(--primary-100)" strokeWidth="16" />
                        {(v.assets?.segs || []).map((_g, $index) => (
                          <React.Fragment key={$index}>
                            <circle cx="70" cy="70" r="50" fill="none" stroke={_g?.color} strokeWidth="16" strokeDasharray={_g?.dash} strokeDashoffset={_g?.off} />
                          </React.Fragment>
                        ))}
                      </g>
                    </svg>
                    <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                      <strong style={{ fontSize: "20px", lineHeight: "24px" }}>{v.assets?.total}</strong>
                      <span style={{ fontSize: "9px", lineHeight: "12px", color: "var(--fg-secondary)" }}>{v.zoneLabel}</span>
                    </div>
                  </div>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(v.assets?.segs || []).map((_g, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 30px 36px", fontSize: "12px" }}>
                          <span className="dv-row" style={{ gap: "8px" }}>
                            <span className="dv-dot" style={{ background: `${s(_g?.color)}` }} />
                            {_g?.label}
                          </span>
                          <strong style={{ textAlign: "right" }}>{_g?.value}</strong>
                          <span className="dv-sub" style={{ textAlign: "right" }}>{_g?.pct}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3" style={{ fontSize: "14px" }}>Duration Breakdown</h2>
                  <span className="dv-sub" style={{ fontSize: "10px" }}>{v.zoneLabel}</span>
                </div>
                <div className="dv-row" style={{ gap: "24px" }}>
                  <div style={{ position: "relative", width: "150px", height: "150px", flex: "none" }}>
                    <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Duration breakdown">
                      <g transform="rotate(-90 70 70)">
                        <circle cx="70" cy="70" r="50" fill="none" stroke="var(--primary-100)" strokeWidth="16" />
                        {(v.dur?.segs || []).map((_g, $index) => (
                          <React.Fragment key={$index}>
                            <circle cx="70" cy="70" r="50" fill="none" stroke={_g?.color} strokeWidth="16" strokeDasharray={_g?.dash} strokeDashoffset={_g?.off} />
                          </React.Fragment>
                        ))}
                      </g>
                    </svg>
                    <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                      <strong style={{ fontSize: "20px", lineHeight: "24px" }}>{v.dur?.total}</strong>
                      <span style={{ fontSize: "9px", lineHeight: "12px", color: "var(--fg-secondary)" }}>Total Play Time</span>
                    </div>
                  </div>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(v.dur?.segs || []).map((_g, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 50px 36px", fontSize: "12px" }}>
                          <span className="dv-row" style={{ gap: "8px" }}>
                            <span className="dv-dot" style={{ background: `${s(_g?.color)}` }} />
                            {_g?.label}
                          </span>
                          <strong style={{ textAlign: "right" }}>{_g?.value}</strong>
                          <span className="dv-sub" style={{ textAlign: "right" }}>{_g?.pct}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
            </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="dv-between">
                <h2 className="dv-h3">Playlist Content</h2>
                <div className="dv-row">
                  <span className="dv-row" style={{ gap: "8px", fontSize: "13px", color: "var(--fg-secondary)" }}>
                    {"See what’s playing "}
                    <NTV.Switch checked={v.seePlaying} onChange={v.toggleSee} label="See what's playing" />
                  </span>
                  <NTV.Input size="l" placeholder="Search a content" iconLeft="magnifying-glass" label="Search content" value={v.gridQ} onChange={v.setGridQ} style={{ width: "280px" }} />
                </div>
              </div>
              <div className="dv-grid" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))", gap: "10px" }}>
                {(v.grid || []).map((_c, $index) => (
                  <React.Fragment key={$index}>
                    <div className={`ld-tile ${s(_c?.cls)}`}>
                      <div className="dv-thumb" style={{ aspectRatio: "16 / 10", borderRadius: "0" }}>
                        <img src={_c?.image} alt="" />
                        <span style={{ position: "absolute", left: "6px", top: "6px", padding: "0 6px", borderRadius: "4px", background: "#fff", fontSize: "9px", lineHeight: "16px", fontWeight: "700", color: `${s(_c?.badgeColor)}` }}>{_c?.badge}</span>
                        {_c?.playing ? (
                          <>
                            <span style={{ position: "absolute", right: "6px", top: "6px", padding: "0 6px", borderRadius: "4px", background: "#fff", fontSize: "9px", lineHeight: "16px", fontWeight: "700", color: "var(--success-400)" }}>● Now Playing</span>
                          </>
                        ) : null}
                      </div>
                      <div style={{ padding: "6px 8px", fontSize: "11px", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_c?.title}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {v.gridEmpty ? (
                <>
                  <div className="dv-empty">No content in this zone.</div>
                </>
              ) : null}
            </section>
            </>
          ) : null}
        </main>
      </div>
      {v.actionsOpen ? (
        <>
          <div aria-hidden="true" onClick={v.toggleActions} style={{ position: "fixed", inset: "0", zIndex: "5" }} />
        </>
      ) : null}
      {v.m?.confirm ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title={v.cf?.title} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.cf?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.cf?.ok}>{v.cf?.okLabel}</NTV.Button>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.rename ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Rename License" width={v.w460} onClose={v.closeModal}>
            <label className="dv-label" htmlFor="ld-alias">Alias</label>
            <input id="ld-alias" className="dv-field" value={v.aliasDraft} onChange={v.setAliasDraft} />
            <p className="dv-sub" style={{ marginTop: "6px" }}>Aliases help you find licenses in lists and reports.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.aliasBad} onClick={v.saveAlias}>Save</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.link ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Link Device" width={v.w500} onClose={v.closeModal}>
            {v.lk?.entering ? (
              <>
                <p className="dv-p" style={{ marginBottom: "16px" }}>Enter the 6-character code shown on the TV connected to the Pi.</p>
                <div className="ld-code" aria-hidden="true">
                {(v.lk?.boxes || []).map((_b, $index) => (
                  <React.Fragment key={$index}>
                    <span style={{ borderColor: `${s(_b?.border)}` }}>{_b?.ch}</span>
                  </React.Fragment>
                ))}
              </div>
                <label className="dv-label" htmlFor="ld-code" style={{ marginTop: "16px" }}>Pairing code</label>
                <input id="ld-code" className="dv-field mono" maxLength="6" placeholder="ex. A7K2QD" value={v.lk?.code} onInput={v.lk?.set} onChange={v.lk?.set} style={{ textTransform: "uppercase", letterSpacing: "4px" }} />
              </>
            ) : null}
            {v.lk?.linking ? (
              <>
                <div className="dv-empty">
                <span className="dv-spinner" style={{ width: "28px", height: "28px" }} />
                <span>{"Pairing with device "}{v.lk?.code}…</span>
              </div>
              </>
            ) : null}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.lk?.blocked} onClick={v.lk?.go}>Link Device</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.preview ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={`Preview · ${s(v.alias)}`} width={v.w1000} onClose={v.closeModal}>
            <video src={v.video} poster={v.poster} autoPlay={true} muted={true} loop={true} playsInline={true} controls={true} style={{ width: "100%", aspectRatio: "16 / 9", display: "block", borderRadius: "var(--radius-md)", background: "#000" }} />
            <p className="dv-sub" style={{ marginTop: "10px" }}>{"Recorded from the player · "}{v.screenName}{" · "}{v.templateName}</p>
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
