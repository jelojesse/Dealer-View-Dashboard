// @ts-nocheck
/**
 * Page: Dealer Details  (route /dealers/detail) — Admin view
 * From Figma "Dealers Page V2 – NTV360": Licenses 8844:22346, Hosts 8844:22368, Advertisers 8844:22390,
 * Activity Logs 9598:39373, Impersonate Log 8844:22417, Programmatic 8844:22435, Territory 8844:22453.
 * Laid out with the app's own patterns (page header, SummaryCard-sized KPIs, toolbars, dv-* tables).
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 * - Impersonate (the one primary action) asks for a note, logs the session, and opens the Dealer view
 *   as this dealer. "End session" in the banner comes back here and closes the log row.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { STATUS, addNav, arrived, byId, contains, go, hostName, peekNav, screenName, setImpersonating, setRole, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import FilterBy, { passes } from '../components/FilterBy';
import DateRangePicker from '../components/DateRangePicker';
import './AdminDealerDetail.css';

/* ============================== Logic ============================== */

var TABS = ['Licenses', 'Hosts', 'Advertisers', 'Activity Logs', 'Impersonate Log', 'Programmatic', 'Territory'];
var TIMEZONES = ['US/Eastern', 'US/Central', 'US/Mountain', 'US/Pacific'];
var TAG_COLOR = { 'On Track': 'var(--success-main)', 'At Risk': 'var(--warning-main)', 'High Risk': 'var(--danger-main)', 'Q-Team': 'var(--danger-main)', Trained: 'var(--info-main)', 'Needs Training': 'var(--warning-main)' };
var ROLE_COLOR = { 'Super Admin': '#7b1f6a', Dealer: 'var(--info-main)', 'Dealer Admin': 'var(--warning-main)' };
var ACT_STYLE = { Assigned: ['var(--warning-050)', 'var(--warning-main)'], Created: ['var(--success-050)', 'var(--success-main)'], Updated: ['var(--info-050)', 'var(--info-main)'], Unassigned: ['var(--danger-050)', 'var(--danger-main)'] };
var LIC_COLS = '44px 44px minmax(150px, 1.2fr) minmax(150px, 1fr) minmax(110px, .8fr) 140px 140px 104px 116px 72px 136px 130px minmax(130px, 1fr) 112px';
var HOST_COLS = '48px minmax(200px, 1.6fr) minmax(200px, 1.6fr) minmax(110px, 1fr) 80px 110px 110px 96px';
var ADV_COLS = '48px minmax(200px, 1.6fr) 110px minmax(180px, 1.4fr) minmax(110px, 1fr) 80px 110px 110px minmax(130px, 1fr) 72px';
var ACT_COLS = '48px minmax(200px, 2fr) minmax(130px, 1fr) 130px 110px 110px 150px 48px';
var IMP_COLS = '44px 44px minmax(130px, 1fr) minmax(280px, 2.6fr) 150px 150px 110px 84px';

function two(n) { return (n < 10 ? '0' : '') + n; }
function stamp(d) { var h = d.getHours(), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return two(d.getMonth() + 1) + '/' + two(d.getDate()) + '/' + String(d.getFullYear()).slice(2) + ' ' + two(h) + ':' + two(d.getMinutes()) + ' ' + ap; }
function dur(ms) { var t = Math.max(1, Math.round(ms / 1000)), h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), sec = t % 60; return h + 'h ' + two(m) + 'm ' + two(sec) + 's'; }

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('AdminDealerDetail.dc.html') || {};
    var d = byId(D.dealers, f.id) || D.dealers[12] || D.dealers[0];
    var prog = {}; D.programmatic.forEach(function (p) { prog[p.id] = p.on; p.hosts.forEach(function (h) { prog[h.id] = h.on; }); });
    this.state = { d: d, tab: f.ended ? 'Impersonate Log' : 'Licenses', query: '', filters: {}, tz: '', range: { start: new Date(2026, 9, 6), end: new Date(2026, 9, 16) },
      picked: {}, open: {}, prog: prog, progOpen: { pg1: true }, progPicked: {}, hostOpen: true, modal: '', note: '', noteErr: false, toast: null };
    if (f.ended) this._ended = true;
  }
  componentDidMount() {
    if (this._ended) {
      var live = D.impersonations.filter(function (r) { return r.live; })[0];
      if (live) { var now = new Date(); live.end = stamp(now); live.duration = dur(Date.now() - (live.t0 || Date.now())); live.live = false; }
      toast(this, 'Impersonation session ended', 'success', 'Logged in the Impersonate Log.');
    }
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state, d = s.d, q = s.query.replace(/^#/, '');
    var setTab = function (t) { return function () { self.setState({ tab: t, query: '', filters: {}, picked: {} }); }; };
    var pickedN = Object.keys(s.picked).filter(function (k) { return s.picked[k]; }).length;
    var togglePick = function (id) { return function (on) { var p = Object.assign({}, self.state.picked); p[id] = on; self.setState({ picked: p }); }; };
    var licRows = D.licenses.filter(function (l) { return contains(l.alias + ' ' + (l.host ? hostName(l.host) : '') + ' ' + l.anydesk + ' ' + (l.tags || []).join(' '), q) && passes(s.filters, 'status', STATUS[l.status].label); }).slice(0, 25);
    var hostRows = D.hosts.filter(function (h) { return contains(h.name + ' ' + h.address + ' ' + h.city + ' ' + h.state + ' ' + h.zip, q) && passes(s.filters, 'status', h.status); }).slice(0, 25);
    var advRows = D.advertisers.filter(function (a) { return contains(a.name + ' ' + a.city + ' ' + a.state + ' ' + a.category, q) && passes(s.filters, 'status', a.status); });
    var actRows = D.dealerActivity.filter(function (r) { return contains(r.target + ' ' + r.module + ' ' + r.user, q) && passes(s.filters, 'module', r.module) && passes(s.filters, 'action', r.action); });
    var impRows = D.impersonations.filter(function (r) { return contains(r.who + ' ' + r.start + ' ' + r.end + ' ' + r.note, q); });
    var progRows = D.programmatic.filter(function (p) { return contains(p.name + ' ' + p.hosts.map(function (h) { return h.name; }).join(' '), q); });
    var allOn = D.programmatic.every(function (p) { return s.prog[p.id]; });
    var setProg = function (id, on) { var n = Object.assign({}, self.state.prog); n[id] = on; return n; };
    var t = D.territory;
    return {
      none: null, i12: 12, i14: 14, i16: 16, w520: 520,
      crumbs: [{ label: 'Dealers', href: 'AdminDealers.dc.html' }, d.business],
      d: { business: d.business, alias: d.alias, location: d.location, since: d.since, photo: d.photo, status: d.status, statusColor: d.status === 'Active' ? 'var(--success-main)' : 'var(--fg-secondary)',
        tags: (d.tags || []).map(function (x) { return { label: x, color: TAG_COLOR[x] || 'var(--info-main)' }; }) },
      kpi: { lic: d.lic, hosts: d.hosts, adv: d.adv, hostsInactive: Math.max(0, d.hosts.total - d.hosts.active), advInactive: Math.max(0, d.adv.total - d.adv.active), licInactive: Math.max(0, d.lic.total - d.lic.online) },
      tabs: TABS.map(function (x) { return { label: x, on: s.tab === x, pick: setTab(x) }; }),
      isLic: s.tab === 'Licenses', isHosts: s.tab === 'Hosts', isAdv: s.tab === 'Advertisers', isAct: s.tab === 'Activity Logs', isImp: s.tab === 'Impersonate Log', isProg: s.tab === 'Programmatic', isTerr: s.tab === 'Territory',
      query: s.query, setQuery: function (x) { self.setState({ query: val(x) }); },
      filters: s.filters, setFilters: function (x) { self.setState({ filters: x }); },
      licFilters: [{ key: 'status', title: 'Status', options: ['Online', 'Offline', 'Ready for Pairing', 'Disabled'] }],
      hostFilters: [{ key: 'status', title: 'Status', options: ['Active', 'Inactive'] }],
      actFilters: [{ key: 'module', title: 'Module', options: ['Host', 'Screen', 'Media', 'Playlist', 'Advertiser'] }, { key: 'action', title: 'Action', options: ['Assigned', 'Created', 'Updated', 'Unassigned'] }],
      tzOptions: TIMEZONES, tz: s.tz, setTz: function (x) { self.setState({ tz: val(x) }); },
      range: s.range, setRange: function (r) { self.setState({ range: r }); }, today: new Date(2026, 10, 20),
      pickedN: pickedN, noneSelected: pickedN === 0, bulkLabel: pickedN ? 'Bulk Delete (' + pickedN + ')' : 'Bulk Delete',
      bulkDelete: function () { toast(self, pickedN + ' item(s) deleted', 'success'); self.setState({ picked: {} }); },
      exportIt: function () { toast(self, 'Exporting ' + s.tab.toLowerCase() + ' to Excel…', 'info'); },
      refresh: function () { toast(self, s.tab + ' refreshed', 'info'); },
      licCols: LIC_COLS, hostCols: HOST_COLS, advCols: ADV_COLS, actCols: ACT_COLS, impCols: IMP_COLS,
      lics: licRows.map(function (l, i) {
        var st = STATUS[l.status], on = l.status === 'online', k = parseInt(l.id.slice(1), 10), hx = function (n) { return ('0' + ((k * n) % 256).toString(16)).slice(-2); };
        return { id: l.id, n: i + 1, picked: !!s.picked[l.id], pick: togglePick(l.id), key: l.key.slice(0, 13) + '…', color: st.color, host: l.host ? hostName(l.host) : '—', alias: l.alias,
          lastUpdate: '10/0' + (1 + k % 9) + '/26 12:0' + (k % 10) + ' AM', lastStartup: '10/0' + (1 + k % 9) + '/26 12:1' + (k % 10) + ' AM',
          up: on ? l.speed : '---', down: on ? (parseInt(l.speed, 10) + 4) + ' MB/s' : '---', speedTint: on ? 'var(--success-050)' : 'transparent', speedColor: on ? 'var(--success-600)' : 'var(--fg-secondary)',
          display: on ? 'ON' : 'OFF', mac: 'e4:5f:01:' + hx(7) + ':' + hx(13) + ':' + hx(29), anydesk: 'ID - ' + l.anydesk.replace(/ /g, '').slice(0, 6) + '…', screen: l.screen ? screenName(l.screen) : '—', install: l.host ? l.install : '---' };
      }),
      hosts: hostRows.map(function (h, i) { return { n: i + 1, name: h.name, address: h.address, city: h.city, state: h.state, zip: h.zip, lic: h.lic.length, status: h.status, dot: h.status === 'Active' ? 'var(--success-main)' : 'var(--fg-faint)', cls: h.status === 'Active' ? 'is-active' : 'is-inactive' }; }),
      advs: advRows.map(function (a, i) { return { n: i + 1, name: a.name, assets: (a.media || []).length * 11, address: (100 + i * 37) + ' N Harlan St', city: a.city, state: a.state, created: a.created, zip: '35' + (401 + i), category: a.category, dot: a.status === 'Active' ? 'var(--success-main)' : 'var(--fg-faint)',
        remove: function () { toast(self, 'Removing advertisers isn’t designed yet', 'info'); } }; }),
      acts: actRows.map(function (r, i) { var a = ACT_STYLE[r.action] || ACT_STYLE.Updated; return { n: i + 1, target: r.target, user: r.user, role: r.role, roleColor: ROLE_COLOR[r.role] || 'var(--info-main)', module: r.module, action: r.action, actBg: a[0], actFg: a[1], at: r.at, detail: r.detail,
        open: !!s.open[r.id], toggle: function () { var o = Object.assign({}, self.state.open); o[r.id] = !o[r.id]; self.setState({ open: o }); } }; }),
      imps: impRows.map(function (r, i) { return { id: r.id, n: i + 1, picked: !!s.picked[r.id], pick: togglePick(r.id), who: r.who, note: r.note, start: r.start, end: r.end, duration: r.duration, live: !!r.live,
        view: function () { toast(self, 'Session replay isn’t designed yet', 'info'); }, remove: function () { toast(self, 'Log entry deleted', 'success'); } }; }),
      empty: function (n) { return n === 0; },
      allOn: allOn, toggleAll: function (on) { var n = Object.assign({}, self.state.prog); D.programmatic.forEach(function (p) { n[p.id] = on; p.hosts.forEach(function (h) { n[h.id] = on; }); }); self.setState({ prog: n }); toast(self, on ? 'All programmatic sources on' : 'All programmatic sources off', 'info'); },
      progs: progRows.map(function (p) {
        return { id: p.id, name: p.name, on: !!s.prog[p.id], open: !!s.progOpen[p.id], picked: !!s.progPicked[p.id],
          setOn: function (on) { self.setState({ prog: setProg(p.id, on) }); },
          pick: function (on) { var x = Object.assign({}, self.state.progPicked); x[p.id] = on; self.setState({ progPicked: x }); },
          toggle: function () { var o = Object.assign({}, self.state.progOpen); o[p.id] = !o[p.id]; self.setState({ progOpen: o }); },
          hosts: p.hosts.map(function (h) { return { id: h.id, name: h.name, on: !!s.prog[h.id], picked: !!s.progPicked[h.id],
            setOn: function (on) { self.setState({ prog: setProg(h.id, on) }); },
            pick: function (on) { var x = Object.assign({}, self.state.progPicked); x[h.id] = on; self.setState({ progPicked: x }); } }; }) };
      }),
      terr: { name: t.name, state: t.state, lng: t.lng, lat: t.lat, area: t.area, created: t.created, shape: t.shape, host: t.host },
      hostOpen: s.hostOpen, toggleHost: function () { self.setState({ hostOpen: !self.state.hostOpen }); },
      openTerr: function () { toast(self, 'Territory editor isn’t designed yet', 'info'); },
      modify: function () { toast(self, 'Modify dealer isn’t designed yet', 'info'); },
      impOpen: s.modal === 'imp', openImp: function () { self.setState({ modal: 'imp', note: '', noteErr: false }); },
      closeImp: function () { self.setState({ modal: '' }); },
      note: s.note, setNote: function (x) { self.setState({ note: val(x), noteErr: false }); }, noteErr: s.noteErr,
      startImp: function () {
        var note = (self.state.note || '').trim();
        if (!note) { self.setState({ noteErr: true }); return; }
        var now = new Date();
        D.impersonations.unshift({ id: 'im' + Date.now(), who: 'Joe Admin', note: note, start: stamp(now), end: '—', duration: 'In progress', live: true, t0: Date.now() });
        self.setState({ modal: '' });
        setImpersonating(d.id); setRole('dealer');
        go('DealerDashboard.dc.html');
      },
      toast: toastVals(s.toast, this)
    };
  }
}

;(function () { var P = 'AdminDealerDetail.dc.html'; var C = Component; var R0 = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R0.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

function TableHead({ title, onRefresh, right }) {
  return (
    <div className="dv-between">
      <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>{title}</h2>
      <div className="dv-row" style={{ gap: "12px" }}>
        {right}
        {onRefresh ? <NTV.IconButton icon="arrows-rotate" label="Refresh table" variant="secondary" size="m" onClick={onRefresh} /> : null}
        {onRefresh ? <NTV.IconButton icon="gear" label="Table settings" variant="secondary" size="m" /> : null}
      </div>
    </div>
  );
}

defineTemplate(Component, (v) => (
    <div className="pg-admin-dealer-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Dealers" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between dv-page-head">
            <NTV.Breadcrumbs items={v.crumbs} />
            <div className="dv-row">
              <NTV.Button variant="secondary" size="xl" iconRight="gear" onClick={v.modify}>Modify</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight="user-gear" onClick={v.openImp}>Impersonate</NTV.Button>
            </div>
          </div>

          <section className="dv-card dd-hd" aria-label="Dealer">
            <span className="dv-avatar"><img src={v.d.photo} alt="" /></span>
            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
              <div className="dv-row" style={{ gap: "10px" }}>
                <h1 className="dv-h2" style={{ fontSize: "20px", lineHeight: "32px" }}>{v.d.business}</h1>
                <span className="dv-row" style={{ gap: "6px", fontSize: "12px", color: v.d.statusColor }}><span className="dv-dot" style={{ background: v.d.statusColor }} />{v.d.status}</span>
              </div>
              <span style={{ fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>{"Dealer Alias: "}<strong style={{ color: "var(--fg-primary)" }}>{v.d.alias}</strong></span>
              <span style={{ fontSize: "12px", lineHeight: "20px", fontWeight: "700" }}>{v.d.location}{"  -  Dealer since "}{v.d.since}</span>
            </div>
            <div className="dv-row" style={{ gap: "8px" }}>
              {v.d.tags.map((_t) => (<span key={_t.label} className="dd-tag" style={{ background: _t.color }}>{_t.label}</span>))}
            </div>
          </section>

          <section className="dd-kpi" aria-label="Dealer totals">
            {[
              { title: 'Licenses', desc: 'Licenses overview', icon: 'id-card', tone: 'danger', value: v.kpi.lic.total, foot: [['Active', v.kpi.lic.online, 'var(--success-main)'], ['Inactive', v.kpi.licInactive, 'var(--fg-secondary)'], ['LAN', v.kpi.lic.lan, 'var(--fg-primary)', 'network-wired'], ['WiFi', v.kpi.lic.wifi, 'var(--fg-primary)']] },
              { title: 'Hosts', desc: 'Hosts overview', icon: 'map', tone: 'info', value: v.kpi.hosts.total, foot: [['Active', v.kpi.hosts.active, 'var(--success-main)'], ['Inactive', v.kpi.hostsInactive, 'var(--danger-main)']] },
              { title: 'Advertisers', desc: 'Advertisers overview', icon: 'tag', tone: 'warning', value: v.kpi.adv.total, foot: [['Active', v.kpi.adv.active, 'var(--success-main)'], ['Inactive', v.kpi.advInactive, 'var(--danger-main)']] }
            ].map((_k) => (
              <div key={_k.title} className="dv-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px", minHeight: "140px" }}>
                <div className="dv-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                  <div className="dv-row" style={{ gap: "16px", alignItems: "center" }}>
                    <NTV.IconTile icon={_k.icon} tone={_k.tone} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <p style={{ margin: "0", fontSize: "20px", lineHeight: "32px", fontWeight: "700" }}>{_k.title}</p>
                      <p className="dv-sub" style={{ fontWeight: "500" }}>{_k.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "28px", lineHeight: "42px", fontWeight: "700" }}>{_k.value}</span>
                </div>
                <div className="dv-between" style={{ alignItems: "center", minHeight: "28px", fontSize: "12px", lineHeight: "20px" }}>
                  {_k.foot.map((_f) => (
                    <span key={_f[0]} className="dv-row" style={{ gap: "8px" }}>
                      {_f[3] ? <NTV.Icon name={_f[3]} size={v.i12} /> : null}
                      {_f[0]}<strong style={{ color: _f[2] }}>{_f[1]}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <div className="dv-tabs" role="tablist" aria-label="Dealer sections">
            {v.tabs.map((_t) => (<button key={_t.label} type="button" role="tab" className="dv-tab" aria-selected={_t.on} onClick={_t.pick}>{_t.label}</button>))}
          </div>

          {/* ---------------- Licenses ---------------- */}
          {v.isLic ? (
            <>
              <div className="dv-between">
                <div className="dv-row" style={{ flexWrap: "wrap" }}>
                  <FilterBy groups={v.licFilters} value={v.filters} onChange={v.setFilters} />
                  <div style={{ width: "200px" }}><NTV.Select size="l" placeholder="Timezone" options={v.tzOptions} value={v.tz} onChange={v.setTz} /></div>
                  <DateRangePicker compact value={v.range} onChange={v.setRange} today={v.today} />
                </div>
                <div className="dv-row" style={{ flexWrap: "wrap" }}>
                  <NTV.Input size="l" placeholder="Search License Alias, Host Name, Anydesk, MAC Address or #Tag" iconLeft="magnifying-glass" iconRight="sparkles" label="Search licenses" value={v.query} onChange={v.setQuery} style={{ width: "420px", maxWidth: "100%" }} />
                  <NTV.Button variant="secondary" size="xl" iconRight="trash" disabled={v.noneSelected} onClick={v.bulkDelete}>{v.bulkLabel}</NTV.Button>
                  <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
                </div>
              </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TableHead title="Licenses Data" onRefresh={v.refresh} />
                <div className="dv-table">
                  <div role="table" aria-label="Licenses" style={{ minWidth: "1700px" }}>
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: v.licCols }}>
                      <div /><div style={{ textAlign: "center" }}>#</div><div>License Key</div><div>Host</div><div>Alias</div><div>Last Update</div><div>Last Startup</div><div>Upload Speed</div><div>Download Speed</div><div>Display</div><div>MAC Address</div><div>Anydesk</div><div>Screen</div><div>Installation Date</div>
                    </div>
                    {v.lics.map((_r) => (
                      <div key={_r.id} role="row" className={'dv-tr' + (_r.picked ? ' dv-sel' : '')} style={{ gridTemplateColumns: v.licCols }}>
                        <div><NTV.Checkbox checked={_r.picked} onChange={_r.pick} /></div>
                        <div style={{ textAlign: "center" }}>{_r.n}</div>
                        <div className="dv-row" style={{ gap: "8px" }}><span className="dv-dot" style={{ background: _r.color }} />{_r.key}</div>
                        <div>{_r.host}</div>
                        <div>{_r.alias}</div>
                        <div>{_r.lastUpdate}</div>
                        <div>{_r.lastStartup}</div>
                        <div><span className="dv-pill" style={{ background: _r.speedTint, color: _r.speedColor, height: "22px", borderRadius: "4px" }}>{_r.up}</span></div>
                        <div><span className="dv-pill" style={{ background: _r.speedTint, color: _r.speedColor, height: "22px", borderRadius: "4px" }}>{_r.down}</span></div>
                        <div>{_r.display}</div>
                        <div>{_r.mac}</div>
                        <div>{_r.anydesk}</div>
                        <div>{_r.screen}</div>
                        <div>{_r.install}</div>
                      </div>
                    ))}
                    {v.lics.length === 0 ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No licenses match your search.</div> : null}
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {/* ---------------- Hosts ---------------- */}
          {v.isHosts ? (
            <>
              <div className="dv-between">
                <FilterBy groups={v.hostFilters} value={v.filters} onChange={v.setFilters} />
                <div className="dv-row">
                  <NTV.Input size="l" placeholder="Search Host Name, Address, City, State, & Postal Code" iconLeft="magnifying-glass" iconRight="sparkles" label="Search hosts" value={v.query} onChange={v.setQuery} style={{ width: "420px", maxWidth: "100%" }} />
                  <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
                </div>
              </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TableHead title="Host List" onRefresh={v.refresh} />
                <div className="dv-table">
                  <div role="table" aria-label="Hosts" style={{ minWidth: "1000px" }}>
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: v.hostCols }}>
                      <div style={{ textAlign: "center" }}>#</div><div>Host Name</div><div>Address</div><div>City</div><div>State</div><div>Postal Code</div><div>License Count</div><div>Status</div>
                    </div>
                    {v.hosts.map((_r) => (
                      <div key={_r.n} role="row" className="dv-tr" style={{ gridTemplateColumns: v.hostCols }}>
                        <div style={{ textAlign: "center" }}>{_r.n}</div>
                        <div className="dv-row" style={{ gap: "8px" }}>{_r.name}<span className="dv-dot" style={{ background: _r.dot }} /></div>
                        <div>{_r.address}</div><div>{_r.city}</div><div>{_r.state}</div><div>{_r.zip}</div><div>{_r.lic}</div>
                        <div><span className={'ad-chip ' + _r.cls}>{_r.status}</span></div>
                      </div>
                    ))}
                    {v.hosts.length === 0 ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No hosts match your search.</div> : null}
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {/* ---------------- Advertisers ---------------- */}
          {v.isAdv ? (
            <>
              <div className="dv-between">
                <FilterBy groups={v.hostFilters} value={v.filters} onChange={v.setFilters} />
                <div className="dv-row">
                  <NTV.Input size="l" placeholder="Search Advertiser Name, City, State or Category" iconLeft="magnifying-glass" iconRight="sparkles" label="Search advertisers" value={v.query} onChange={v.setQuery} style={{ width: "420px", maxWidth: "100%" }} />
                  <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
                </div>
              </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TableHead title="Advertiser List" onRefresh={v.refresh} />
                <div className="dv-table">
                  <div role="table" aria-label="Advertisers" style={{ minWidth: "1200px" }}>
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: v.advCols }}>
                      <div style={{ textAlign: "center" }}>#</div><div>Advertiser Name</div><div>Total Assets</div><div>Address</div><div>City</div><div>State</div><div>Date Created</div><div>Postal Code</div><div>Category</div><div>Action</div>
                    </div>
                    {v.advs.map((_r) => (
                      <div key={_r.n} role="row" className="dv-tr" style={{ gridTemplateColumns: v.advCols }}>
                        <div style={{ textAlign: "center" }}>{_r.n}</div>
                        <div className="dv-row" style={{ gap: "8px" }}>{_r.name}<span className="dv-dot" style={{ background: _r.dot }} /></div>
                        <div>{_r.assets}</div><div>{_r.address}</div><div>{_r.city}</div><div>{_r.state}</div><div>{_r.created}</div><div>{_r.zip}</div><div>{_r.category}</div>
                        <div><button type="button" className="dv-ib dv-danger" aria-label={'Remove ' + _r.name} onClick={_r.remove}><NTV.Icon name="trash" size={v.i14} /></button></div>
                      </div>
                    ))}
                    {v.advs.length === 0 ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No advertisers match your search.</div> : null}
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {/* ---------------- Activity Logs ---------------- */}
          {v.isAct ? (
            <>
              <div className="dv-between">
                <FilterBy groups={v.actFilters} value={v.filters} onChange={v.setFilters} />
                <NTV.Input size="l" placeholder="Search Activity, Module or User" iconLeft="magnifying-glass" iconRight="sparkles" label="Search activity" value={v.query} onChange={v.setQuery} style={{ width: "420px", maxWidth: "100%" }} />
              </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TableHead title="Activities" onRefresh={v.refresh} />
                <div className="dv-table">
                  <div role="table" aria-label="Activities" style={{ minWidth: "1000px" }}>
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: v.actCols }}>
                      <div style={{ textAlign: "center" }}>#</div><div>Activity Target</div><div>User</div><div>Role</div><div>Module</div><div>Action</div><div>Date & Time</div><div />
                    </div>
                    {v.acts.map((_r) => (
                      <React.Fragment key={_r.n}>
                        <div role="row" className="dv-tr" style={{ gridTemplateColumns: v.actCols }}>
                          <div style={{ textAlign: "center" }}>{_r.n}</div>
                          <div>{_r.target}</div><div>{_r.user}</div>
                          <div><span className="dd-role" style={{ background: _r.roleColor }}>{_r.role}</span></div>
                          <div>{_r.module}</div>
                          <div><span className="dd-act" style={{ background: _r.actBg, color: _r.actFg }}>{_r.action}</span></div>
                          <div>{_r.at}</div>
                          <div><button type="button" className="dv-ib" aria-expanded={_r.open} aria-label={'Details: ' + _r.target} onClick={_r.toggle}><span className={'dd-chev' + (_r.open ? ' is-open' : '')} style={{ display: "inline-flex" }}><NTV.Icon name="angle-down" size={v.i14} /></span></button></div>
                        </div>
                        {_r.open ? <div className="dd-detail">{_r.detail}</div> : null}
                      </React.Fragment>
                    ))}
                    {v.acts.length === 0 ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No activity matches your search.</div> : null}
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {/* ---------------- Impersonate Log ---------------- */}
          {v.isImp ? (
            <>
              <div className="dv-between">
                <DateRangePicker compact value={v.range} onChange={v.setRange} today={v.today} />
                <div className="dv-row" style={{ flexWrap: "wrap" }}>
                  <NTV.Input size="l" placeholder="Search Impersonator or Date" iconLeft="magnifying-glass" iconRight="sparkles" label="Search impersonate log" value={v.query} onChange={v.setQuery} style={{ width: "420px", maxWidth: "100%" }} />
                  <NTV.Button variant="secondary" size="xl" iconRight="trash" disabled={v.noneSelected} onClick={v.bulkDelete}>{v.bulkLabel}</NTV.Button>
                  <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
                </div>
              </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TableHead title="Impersonate Log" onRefresh={v.refresh} />
                <div className="dv-table">
                  <div role="table" aria-label="Impersonate Log" style={{ minWidth: "1000px" }}>
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: v.impCols }}>
                      <div /><div style={{ textAlign: "center" }}>#</div><div>Impersonator</div><div>Note Description</div><div>Start Session</div><div>End Session</div><div>Duration</div><div>Actions</div>
                    </div>
                    {v.imps.map((_r) => (
                      <div key={_r.id} role="row" className={'dv-tr' + (_r.picked ? ' dv-sel' : '')} style={{ gridTemplateColumns: v.impCols }}>
                        <div><NTV.Checkbox checked={_r.picked} onChange={_r.pick} /></div>
                        <div style={{ textAlign: "center" }}>{_r.n}</div>
                        <div>{_r.who}</div><div title={_r.note}>{_r.note}</div><div>{_r.start}</div><div>{_r.end}</div>
                        <div>{_r.live ? <span className="dd-act" style={{ background: "var(--warning-050)", color: "var(--warning-main)" }}>In progress</span> : _r.duration}</div>
                        <div className="dv-row" style={{ gap: "2px" }}>
                          <button type="button" className="dv-ib" aria-label="View session" onClick={_r.view}><NTV.Icon name="play" size={v.i12} /></button>
                          <button type="button" className="dv-ib dv-danger" aria-label="Delete log entry" onClick={_r.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                        </div>
                      </div>
                    ))}
                    {v.imps.length === 0 ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No sessions match your search.</div> : null}
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {/* ---------------- Programmatic ---------------- */}
          {v.isProg ? (
            <>
              <div className="dv-between" style={{ justifyContent: "flex-end" }}>
                <NTV.Input size="l" placeholder="Search Programmatic or Host" iconLeft="magnifying-glass" iconRight="sparkles" label="Search programmatic" value={v.query} onChange={v.setQuery} style={{ width: "420px", maxWidth: "100%" }} />
              </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <TableHead title="Programmatic List" right={<span className="dv-row" style={{ gap: "8px", fontSize: "12px" }}><NTV.Switch checked={v.allOn} onChange={v.toggleAll} label="Toggle all programmatic sources" />Toggle All</span>} />
                <div className="dv-table">
                  {v.progs.map((_p) => (
                    <React.Fragment key={_p.id}>
                      <div className="dd-src is-head">
                        <NTV.Checkbox checked={_p.picked} onChange={_p.pick} />
                        <NTV.Switch checked={_p.on} onChange={_p.setOn} label={_p.name + ' on or off'} />
                        <span>{_p.name}</span>
                        <button type="button" className="dv-ib" aria-expanded={_p.open} aria-label={(_p.open ? 'Collapse ' : 'Expand ') + _p.name} onClick={_p.toggle} style={{ color: "var(--accent-action)" }}><span className={'dd-chev' + (_p.open ? ' is-open' : '')} style={{ display: "inline-flex" }}><NTV.Icon name="angle-down" size={v.i14} /></span></button>
                      </div>
                      {_p.open ? _p.hosts.map((_h) => (
                        <div key={_h.id} className="dd-src is-child">
                          <NTV.Checkbox checked={_h.picked} onChange={_h.pick} />
                          <NTV.Switch checked={_h.on} onChange={_h.setOn} label={_h.name + ' on or off'} />
                          <span>{_h.name}</span>
                          <span />
                        </div>
                      )) : null}
                    </React.Fragment>
                  ))}
                  {v.progs.length === 0 ? <div className="dv-empty">No programmatic sources match your search.</div> : null}
                </div>
              </section>
            </>
          ) : null}

          {/* ---------------- Territory ---------------- */}
          {v.isTerr ? (
            <div className="dd-terr">
              <div className="dd-map" aria-label={'Territory map: ' + v.terr.name}>
                <svg viewBox="0 0 1100 640" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: "0" }} role="img" aria-label="Territory outline">
                  <rect width="1100" height="640" fill="#e8f5e4" />
                  <g transform="translate(150 60)">
                  <path d="M60 0 C 90 120, 110 260, 230 520" stroke="#b9c3cf" strokeWidth="6" fill="none" />
                  <path d="M0 160 C 120 200, 260 220, 420 300 S 700 380, 800 420" stroke="#d3d9e0" strokeWidth="4" fill="none" />
                  <path d="M560 0 C 600 80, 520 140, 600 200 S 640 330, 700 360 S 760 470, 740 520" stroke="#8fd3f4" strokeWidth="22" fill="none" strokeLinecap="round" />
                  <path d="M600 200 C 650 190, 700 150, 760 160" stroke="#8fd3f4" strokeWidth="12" fill="none" strokeLinecap="round" />
                  <path d="M640 330 C 690 320, 720 290, 790 300" stroke="#8fd3f4" strokeWidth="10" fill="none" strokeLinecap="round" />
                  <polygon points={v.terr.shape} fill="#8cc63f" fillOpacity="0.85" stroke="#4d7a1c" strokeWidth="2" />
                  <text x="610" y="250" fontSize="14" fill="#5a6573" fontFamily="inherit">Wildwood Shores</text>
                  <text x="470" y="490" fontSize="13" fill="#5a6573" fontFamily="inherit">Jumbo</text>
                  <text x="40" y="500" fontSize="13" fill="#5a6573" fontFamily="inherit">Jemison</text>
                  </g>
                </svg>
              </div>
              <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3" style={{ fontSize: "14px" }}>General Information</h2>
                  <button type="button" className="dv-ib" aria-label="Open territory" onClick={v.openTerr} style={{ color: "var(--accent-action)" }}><NTV.Icon name="arrow-up-right-from-square" size={v.i12} /></button>
                </div>
                {[['Territory Name', v.terr.name], ['State', v.terr.state], ['Longitude', v.terr.lng], ['Latitude', v.terr.lat], ['Total Area', v.terr.area], ['Created', v.terr.created]].map((_k) => (
                  <div key={_k[0]} className="dd-kvrow"><span>{_k[0]}</span><span>{_k[1]}</span></div>
                ))}
                <h2 className="dv-h3" style={{ fontSize: "14px", marginTop: "6px" }}>Host</h2>
                <div className="dd-host">
                  <div className="dv-between" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                    <div className="dv-row" style={{ gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--success-main)", marginTop: "2px" }}><NTV.Icon name="location-dot" size={v.i16} /></span>
                      <div>
                        <div className="dv-row" style={{ gap: "8px" }}><strong style={{ fontSize: "12px" }}>{v.terr.host.name}</strong><span className="ad-chip is-active" style={{ height: "18px", fontSize: "10px" }}>{v.terr.host.status}</span></div>
                        <span className="dv-sub" style={{ fontSize: "11px" }}>{v.terr.host.address}</span>
                      </div>
                    </div>
                    <button type="button" className="dv-a dv-row" style={{ gap: "6px", fontSize: "12px", whiteSpace: "nowrap" }} aria-expanded={v.hostOpen} onClick={v.toggleHost}>
                      {v.terr.host.licenses.length}{" License(s)"}<span className={'dd-chev' + (v.hostOpen ? ' is-open' : '')} style={{ display: "inline-flex" }}><NTV.Icon name="angle-down" size={v.i12} /></span>
                    </button>
                  </div>
                  {v.hostOpen ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px", lineHeight: "18px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div><strong>Category:</strong><div className="dv-sub">{v.terr.host.category}</div></div>
                        <div><strong>Licenses:</strong>{v.terr.host.licenses.map((_l) => (<div key={_l} className="dv-row" style={{ gap: "8px" }}><span className="dv-dot" style={{ background: "var(--danger-main)" }} /><span className="dv-sub">{_l}</span></div>))}</div>
                      </div>
                      <div><strong>Operation Hours:</strong><div className="dd-hours">{v.terr.host.hours.map((_h) => (<React.Fragment key={_h[0]}><span>{_h[0]}</span><span>{_h[1]}</span></React.Fragment>))}</div></div>
                      <div className="dv-row" style={{ gap: "6px", gridColumn: "1 / -1", fontSize: "11px", color: "var(--fg-secondary)" }}><span style={{ color: "var(--danger-main)" }}><NTV.Icon name="location-dot" size={v.i12} /></span>{v.terr.host.coords}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {v.impOpen ? (
        <div className="dv-ov" role="presentation">
          <NTV.Modal title={'Impersonate ' + v.d.business + '?'} width={v.w520} onClose={v.closeImp}
            footer={<div className="dv-row" style={{ justifyContent: "flex-end", width: "100%" }}>
              <NTV.Button variant="secondary" size="xl" onClick={v.closeImp}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight="user-gear" onClick={v.startImp}>Start Impersonating</NTV.Button>
            </div>}>
            <p className="dv-p" style={{ marginBottom: "16px" }}>You’ll see the Dealer view exactly as <strong style={{ color: "var(--fg-primary)" }}>{v.d.business}</strong> does. The session is recorded in the Impersonate Log.</p>
            <label className="dv-label" htmlFor="dd-note">Reason for impersonating</label>
            <textarea id="dd-note" className="dv-field" rows="3" placeholder="e.g. Reset password for account recovery" value={v.note} onChange={v.setNote} aria-invalid={v.noteErr} style={v.noteErr ? { borderColor: "var(--danger-main)" } : null} />
            {v.noteErr ? <p className="dd-field-err" role="alert">Enter a reason first.</p> : null}
          </NTV.Modal>
        </div>
      ) : null}
      <Toast t={v.toast} />
    </div>
    </div>
));

export default Component;
