// @ts-nocheck
/**
 * Page: Hosts  (route /hosts)
 * Converted from the Claude Design artboard DealerHosts.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, arrived, contains, go, hostName, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import SummaryCard from '../components/SummaryCard';
import './DealerHosts.css';

/* ============================== Logic ============================== */

var HCOL = { Active: 'var(--success-main)', Inactive: 'var(--danger-main)' };
var LIC_RANGES = [
  { key: '0-5', label: '0-5 Licenses', chip: '0-5', min: 0, max: 5 },
  { key: '6-10', label: '6-10 Licenses', chip: '6-10', min: 6, max: 10 },
  { key: '11+', label: '11 and Above Licenses', chip: '11 and Above', min: 11, max: Infinity }
];
// Filter by groups. tone = chip color for that parent filter (see NTV.FilterChip)
var FILTER_GROUPS = [
  { title: 'Status', field: 'statuses', tone: 'info', options: [{ key: 'Active', label: 'Active' }, { key: 'Inactive', label: 'Inactive' }] },
  { title: 'Licenses', field: 'licRanges', tone: 'red-orange', options: LIC_RANGES }
];
// Hosts table columns ('#' is always shown). Toggled from the gear → NTV.ColumnVisibility.
var HOST_COLS = [
  { key: 'name', label: 'Host Name', w: 'minmax(200px, 1.6fr)', min: 200 },
  { key: 'address', label: 'Address', w: 'minmax(160px, 2.3fr)', min: 160 },
  { key: 'city', label: 'City', w: 'minmax(140px, 2.3fr)', min: 140 },
  { key: 'state', label: 'State', w: 'minmax(60px, 0.7fr)', min: 60 },
  { key: 'zip', label: 'Postal Code', w: 'minmax(90px, 0.7fr)', min: 90 },
  { key: 'tz', label: 'Timezone', w: 'minmax(100px, 0.8fr)', min: 100 },
  { key: 'lic', label: 'Total Licenses', w: 'minmax(100px, 0.65fr)', min: 100 },
  { key: 'actions', label: 'Actions', w: '94px', min: 94 }
];
var PAGE = 10; // rows shown at first and added by "Show More..."
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var TZ_BY_STATE = { AK: 'US/Alaska', HI: 'US/Hawaii', AZ: 'US/Arizona',
  CA: 'US/Pacific', WA: 'US/Pacific', OR: 'US/Pacific', NV: 'US/Pacific',
  CO: 'US/Mountain', UT: 'US/Mountain', NM: 'US/Mountain', MT: 'US/Mountain', WY: 'US/Mountain', ID: 'US/Mountain',
  TX: 'US/Central', IL: 'US/Central', AL: 'US/Central', MS: 'US/Central', LA: 'US/Central', AR: 'US/Central', MO: 'US/Central', IA: 'US/Central', MN: 'US/Central', WI: 'US/Central', OK: 'US/Central', KS: 'US/Central', NE: 'US/Central', SD: 'US/Central', ND: 'US/Central', TN: 'US/Central' };
var tzFor = function (st) { return TZ_BY_STATE[st] || 'US/Eastern'; };
var SERIES = { '2026': [12, 15, 18, 21, 25, 27, 30, 32, 35, 38, 41, 43], '2025': [2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] };
class Component extends DCLogic {
  constructor(props) { super(props); var f = arrived('DealerHosts.dc.html') || {}; this.state = { query: '', statuses: f.status ? [f.status] : [], licRanges: [], analytics: !!props.analytics, limit: PAGE, blocked: null, month: '', year: '2026', graph: 'Line Graph', hover: -1, hiddenCols: [], colsOpen: false, toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var count = function (k) { return D.hosts.filter(function (h) { return h.status === k; }).length; };
    var inLic = function (h) { var n = h.lic.length; return !s.licRanges.length || LIC_RANGES.some(function (r) { return s.licRanges.indexOf(r.key) !== -1 && n >= r.min && n <= r.max; }); };
    var matches = D.hosts.filter(function (h) { return (!s.statuses.length || s.statuses.indexOf(h.status) !== -1) && inLic(h) && contains(h.name + ' ' + h.address + ' ' + h.city + ' ' + h.state + ' ' + h.zip + ' ' + h.dma + ' ' + h.category, s.query.replace(/^#/, '')); });
    var vis = matches.slice(0, s.limit);
    var tot = SERIES[s.year] || SERIES['2026'], fresh = tot.map(function (v, i) { return i ? v - tot[i - 1] : (s.year === '2026' ? 1 : 2); });
    var step = 820 / 11, X = function (i) { return 50 + i * step; };
    var YL = function (v) { return 260 - v / 50 * 240; }, YR = function (v) { return 260 - v / 5 * 240; };
    var path = function (vals, Y) { return vals.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' '); };
    // closed shape under a line, for the gradient area fill (Figma "Network Growth" chart)
    var area = function (vals, Y) { return path(vals, Y) + ' L' + X(vals.length - 1).toFixed(1) + ' 260 L' + X(0).toFixed(1) + ' 260 Z'; };
    var hi = s.hover >= 0 ? s.hover : (s.month ? MONTHS.indexOf(s.month) : -1);
    var top = D.hosts.slice().sort(function (a, b) { return b.lic.length - a.lic.length || a.name.localeCompare(b.name); }).slice(0, 10);
    return {
      none: null, i14: 14, w460: 460,
      show: HOST_COLS.reduce(function (o, c) { o[c.key] = s.hiddenCols.indexOf(c.key) === -1; return o; }, {}),
      cols: ['44px'].concat(HOST_COLS.filter(function (c) { return s.hiddenCols.indexOf(c.key) === -1; }).map(function (c) { return c.w; })).join(' '),
      tableMin: HOST_COLS.reduce(function (n, c) { return n + (s.hiddenCols.indexOf(c.key) === -1 ? c.min : 0); }, 44) + 'px',
      colsOpen: s.colsOpen,
      toggleCols: function () { self.setState({ colsOpen: !self.state.colsOpen }); },
      closeCols: function () { self.setState({ colsOpen: false }); },
      colColumns: HOST_COLS.map(function (c) { return { key: c.key, label: c.label, visible: s.hiddenCols.indexOf(c.key) === -1 }; }),
      toggleCol: function (key, on) { var h = self.state.hiddenCols.filter(function (k) { return k !== key; }); self.setState({ hiddenCols: on ? h : h.concat([key]) }); },
      resetCols: function () { self.setState({ hiddenCols: [] }); },
      total: D.hosts.length, activeCount: count('Active'), inactiveCount: count('Inactive'),
      analytics: s.analytics, analyticsLabel: s.analytics ? 'Hide Analytics' : 'Show Analytics', analyticsIcon: s.analytics ? 'angle-up' : 'angle-down',
      toggleAnalytics: function () { self.setState({ analytics: !self.state.analytics }); },
      monthOptions: MONTHS, month: s.month, setMonth: function (v) { self.setState({ month: val(v), hover: -1 }); },
      yearOptions: ['2026', '2025'], year: s.year, setYear: function (v) { self.setState({ year: val(v), hover: -1 }); },
      graphOptions: ['Line Graph', 'Bar Graph'], graph: s.graph, setGraph: function (v) { self.setState({ graph: val(v) }); },
      ch: { isLine: s.graph === 'Line Graph', isBar: s.graph === 'Bar Graph', step: step.toFixed(1),
        total: path(tot, YL), fresh: path(fresh, YR), totalArea: area(tot, YL), freshArea: area(fresh, YR),
        // 10 intervals like the design: left axis 0–50 (total), right axis 0–5 (new, whole numbers only)
        grid: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (k) { var y = 260 - k * 24; return { y: y, ty: y + 3, tp: (y / 300 * 100).toFixed(2) + '%', l: k * 5, r: k % 2 ? '' : k / 2 }; }),
        months: MONTHS.map(function (m, i) { return { label: m, xp: (X(i) / 900 * 100).toFixed(2) + '%', x: X(i).toFixed(1), hx: (X(i) - step / 2).toFixed(1), bx1: (X(i) - 15).toFixed(1), bx2: (X(i) + 1).toFixed(1),
          ty: YL(tot[i]).toFixed(1), th: (260 - YL(tot[i])).toFixed(1), ny: YR(fresh[i]).toFixed(1), nh: Math.max(2, 260 - YR(fresh[i])).toFixed(1),
          hover: function () { self.setState({ hover: i }); } }; }) },
      tip: hi >= 0 ? { show: true, x: X(hi).toFixed(1), ty: YL(tot[hi]).toFixed(1), ny: YR(fresh[hi]).toFixed(1), left: (X(hi) / 900 * 100).toFixed(1) + '%', month: MONTHS[hi], total: tot[hi], fresh: '+' + fresh[hi] } : { show: false },
      clearHover: function () { self.setState({ hover: -1 }); },
      top: top.map(function (h, i) { return { n: i + 1, name: h.name, lic: h.lic.length, open: navFn('DealerHostDetail.dc.html', { id: h.id }) }; }),
      legend: [{ label: 'Active', color: HCOL.Active }, { label: 'Inactive', color: HCOL.Inactive }],
      filterLabel: (s.statuses.length + s.licRanges.length) ? 'Filter by (' + (s.statuses.length + s.licRanges.length) + ')' : 'Filter by',
      // Groups for NTV.FilterDropdown: collapsible sections of checkboxes (collapsed by default, applied immediately)
      filterGroups: FILTER_GROUPS.map(function (g) {
        return { title: g.title, options: g.options.map(function (o) {
          return { label: o.label, checked: s[g.field].indexOf(o.key) !== -1, onChange: function (on) {
            var cur = self.state[g.field], nx = on ? cur.concat([o.key]) : cur.filter(function (k) { return k !== o.key; });
            var u = { limit: PAGE }; u[g.field] = nx; self.setState(u); } };
        }) };
      }),
      // Chips under the filter bar — one per checked option, colored by its parent filter (tone)
      activeChips: FILTER_GROUPS.reduce(function (acc, g) {
        return acc.concat(g.options.filter(function (o) { return s[g.field].indexOf(o.key) !== -1; }).map(function (o) {
          return { key: g.field + ':' + o.key, label: g.title, value: o.chip || o.label, tone: g.tone, onRemove: function () {
            var u = { limit: PAGE }; u[g.field] = self.state[g.field].filter(function (k) { return k !== o.key; }); self.setState(u); } };
        }));
      }, []),
      clearFilters: function () { self.setState({ statuses: [], licRanges: [], limit: PAGE }); },
      query: s.query, setQuery: function (v) { self.setState({ query: val(v), limit: PAGE }); },
      rows: vis.map(function (h, i) {
        return { n: i + 1, name: h.name, photo: h.photo, category: h.category, address: h.address, city: h.city, state: h.state, zip: h.zip, tz: tzFor(h.state), lic: h.lic.length, status: h.status, color: HCOL[h.status] || HCOL.Active, created: h.created,
          open: navFn('DealerHostDetail.dc.html', { id: h.id }),
          edit: navFn('DealerHostDetail.dc.html', { id: h.id, edit: true }),
          openLic: navFn('DealerLicenses.dc.html', { host: h.id, hostName: h.name }),
          remove: function () { self.setState({ blocked: h }); } };
      }),
      empty: vis.length === 0, shown: vis.length, matched: matches.length, hasMore: matches.length > vis.length,
      more: function () { self.setState({ limit: self.state.limit + PAGE }); },
      blocked: { open: !!s.blocked, name: s.blocked ? s.blocked.name : '', n: s.blocked ? s.blocked.lic.length : 0, go: navFn('DealerHostDetail.dc.html', { id: s.blocked && s.blocked.id }) },
      closeBlocked: function () { self.setState({ blocked: null }); },
      exportIt: function () { toast(self, 'Exporting ' + matches.length + ' hosts to Excel…', 'info'); },
      refresh: function () { toast(self, 'Host list refreshed', 'info'); },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerHosts.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-hosts" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Hosts" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between" style={{ paddingTop: "5px" }}>
            <h1 className="dv-h1">Hosts</h1>
            <div className="dv-row">
              <a href="DealerNewHost.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ textDecoration: "none" }}>
                <span>Add Host Place</span>
                <NTV.Icon name="map" size={v.i14} />
              </a>
              <NTV.Button variant="primary" size="xl" iconLeft="chart-simple" iconRight={v.analyticsIcon} onClick={v.toggleAnalytics}>{v.analyticsLabel}</NTV.Button>
            </div>
          </div>
          <section aria-label="Host totals" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="status" title="Total Hosts" description="All registered Hosts" value={v.total} icon="map" tone="success" active={v.activeCount} inactive={v.inactiveCount} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="New Host Registered" description="Weekly Host registration comparison" value="4" icon="map" tone="info" period="This Week" direction="up" trend="+33.3%" />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="Last Week" description="1 week ago (Oct 26 – Nov 1)" value="3" icon="map" tone="danger" period="Last Week" direction="down" trend="-25%" />
              </div>
            </div>
          </section>
          {v.analytics ? (
            <>
              <section aria-label="Host analytics" style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)", gap: "20px" }}>
              <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="dv-between" style={{ gap: "16px" }}>
                  <div>
                    <h2 className="ha-title">Host Analytics</h2>
                    <p className="ha-sub">Total Hosts and new Hosts registered, by month</p>
                  </div>
                  <div className="dv-row" style={{ gap: "16px", flexWrap: "wrap", justifyContent: "flex-end", flex: "1 1 auto" }}>
                  <div className="ha-legend">
                    <span><span className="ha-dot" style={{ background: "var(--success-main)" }} />Total Host</span>
                    <span><span className="ha-dot" style={{ background: "var(--info-main)" }} />New Host</span>
                  </div>
                  <div className="dv-row" style={{ gap: "10px" }}>
                    <div style={{ width: "210px", flex: "none" }}>
                      <NTV.Select size="l" placeholder="Month" options={v.monthOptions} value={v.month} onChange={v.setMonth} />
                    </div>
                    <div style={{ width: "210px", flex: "none" }}>
                      <NTV.Select size="l" placeholder="Year" options={v.yearOptions} value={v.year} onChange={v.setYear} />
                    </div>
                    <div style={{ width: "210px", flex: "none" }}>
                      <NTV.Select size="l" options={v.graphOptions} value={v.graph} onChange={v.setGraph} />
                    </div>
                  </div>
                  </div>
                </div>
                <div style={{ position: "relative" }} onMouseLeave={v.clearHover}>
                  <svg viewBox="0 0 900 300" width="100%" role="img" aria-label="Total and new hosts per month" style={{ display: "block", overflow: "visible" }}>
                    <defs>
                      <linearGradient id="ha-fill-total" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--success-main)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="var(--success-main)" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="ha-fill-new" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--info-main)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--info-main)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {(v.ch?.grid || []).map((_g, $index) => (
                      <React.Fragment key={$index}>
                        <line x1="36" x2="884" y1={_g?.y} y2={_g?.y} stroke="var(--container-border)" strokeDasharray="4 4" />
                      </React.Fragment>
                    ))}
                    {(v.ch?.months || []).map((_m, $index) => (
                      <React.Fragment key={$index}>
                        <line x1={_m?.x} x2={_m?.x} y1="20" y2="260" stroke="var(--container-border)" strokeDasharray="4 4" />
                      </React.Fragment>
                    ))}
                    {v.ch?.isBar ? (
                      <>
                        {(v.ch?.months || []).map((_m, $index) => (
                        <React.Fragment key={$index}>
                          <rect x={_m?.bx1} y={_m?.ty} width="14" height={_m?.th} rx="3" fill="url(#ha-fill-total)" stroke="var(--success-main)" strokeWidth="1.5" />
                          <rect x={_m?.bx2} y={_m?.ny} width="14" height={_m?.nh} rx="3" fill="url(#ha-fill-new)" stroke="var(--info-main)" strokeWidth="1.5" />
                        </React.Fragment>
                      ))}
                      </>
                    ) : null}
                    {v.ch?.isLine ? (
                      <>
                        <path d={v.ch?.totalArea} fill="url(#ha-fill-total)" stroke="none" />
                        <path d={v.ch?.freshArea} fill="url(#ha-fill-new)" stroke="none" />
                        <path d={v.ch?.total} fill="none" stroke="var(--success-main)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={v.ch?.fresh} fill="none" stroke="var(--info-main)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : null}
                    {v.tip?.show ? (
                      <>
                        <line x1={v.tip?.x} x2={v.tip?.x} y1="20" y2="260" stroke="var(--fg-secondary)" strokeWidth="1" strokeDasharray="4 4" />
                        <circle cx={v.tip?.x} cy={v.tip?.ty} r="6.5" fill="var(--bg-surface)" stroke="var(--success-main)" strokeWidth="3" />
                        <circle cx={v.tip?.x} cy={v.tip?.ny} r="6.5" fill="var(--bg-surface)" stroke="var(--info-main)" strokeWidth="3" />
                      </>
                    ) : null}
                    {(v.ch?.months || []).map((_m, $index) => (
                      <React.Fragment key={$index}>
                        <rect x={_m?.hx} y="20" width={v.ch?.step} height="250" fill="transparent" onMouseEnter={_m?.hover} style={{ cursor: "pointer" }} />
                      </React.Fragment>
                    ))}
                  </svg>
                  {(v.ch?.grid || []).map((_g, $index) => (
                    <React.Fragment key={$index}>
                      <span className="ax-y" style={{ top: `${s(_g?.tp)}`, left: "0", width: "4%" }}>{_g?.l}</span>
                      <span className="ax-y" style={{ top: `${s(_g?.tp)}`, left: "auto", right: "0", width: "2%", color: "var(--info-main)" }}>{_g?.r}</span>
                    </React.Fragment>
                  ))}
                  {(v.ch?.months || []).map((_m, $index) => (
                    <React.Fragment key={$index}>
                      <span className="ax-x" style={{ left: `${s(_m?.xp)}`, bottom: "2%" }}>{_m?.label}</span>
                    </React.Fragment>
                  ))}
                  {v.tip?.show ? (
                    <>
                      <div style={{ position: "absolute", left: `${s(v.tip?.left)}`, top: "30%", transform: "translateX(12px)", minWidth: "150px", padding: "12px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-surface)", boxShadow: "var(--shadow-card)", fontSize: "12px", lineHeight: "20px", pointerEvents: "none" }}>
                      <p style={{ margin: "0 0 6px", fontWeight: "600" }}>Comparison</p>
                      <div className="dv-between" style={{ flexWrap: "nowrap", gap: "20px" }}>
                        <span className="dv-row" style={{ gap: "6px" }}>
                          <span className="dv-dot" style={{ background: "var(--success-main)" }} />
                          {v.tip?.month}{" total"}
                        </span>
                        <strong>{v.tip?.total}</strong>
                      </div>
                      <div className="dv-between" style={{ flexWrap: "nowrap", gap: "20px" }}>
                        <span className="dv-row" style={{ gap: "6px" }}>
                          <span className="dv-dot" style={{ background: "var(--info-main)" }} />
                          {v.tip?.month}{" new"}
                        </span>
                        <strong>{v.tip?.fresh}</strong>
                      </div>
                    </div>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="dv-row" style={{ gap: "14px", marginBottom: "6px" }}>
                  <NTV.IconTile icon="map" tone="success" />
                  <div>
                    <h2 className="dv-h2">Top Host(s)</h2>
                    <p className="dv-sub">Hosts with the most licenses.</p>
                  </div>
                </div>
                {(v.top || []).map((_t, $index) => (
                  <React.Fragment key={$index}>
                    <a href="DealerHostDetail.dc.html" onClick={_t?.open} className="dv-between" style={{ flexWrap: "nowrap", textDecoration: "none", color: "var(--fg-primary)", fontSize: "14px", lineHeight: "24px" }} data-nav={_t?.openNav}>
                      <span>{_t?.n}{". "}{_t?.name}</span>
                      <span>
                        <strong>{_t?.lic}</strong>
 
                        <span className="dv-sub" style={{ display: "inline" }}>License(s)</span>
                      </span>
                    </a>
                  </React.Fragment>
                ))}
              </div>
            </section>
            </>
          ) : null}
          <div className="dv-between">
            <div style={{ flex: "none" }}>
              <NTV.FilterDropdown label={v.filterLabel} groups={v.filterGroups} />
            </div>
            <div className="dv-row" style={{ flexWrap: "wrap", gap: "16px" }}>
              <NTV.Input size="l" placeholder="Search Host Name, Address, City, Postal Code, DMA Name or #Tag" iconLeft="magnifying-glass" iconRight="sparkles" label="Search hosts" value={v.query} onChange={v.setQuery} style={{ width: "500px", maxWidth: "100%" }} />
              <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
            </div>
          </div>
          <NTV.ActiveFilters chips={v.activeChips} onClear={v.clearFilters} style={{ marginTop: "-10px" }} />
          <section className="dv-card" aria-label="Hosts Data" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="dv-between">
              <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>Hosts Data</h2>
              <div className="dv-row" style={{ gap: "20px" }}>
                <NTV.IconButton icon="arrows-rotate" label="Refresh table" variant="secondary" size="m" onClick={v.refresh} />
                <div style={{ position: "relative" }}>
                  <NTV.IconButton icon="gear" label="Table settings" variant="secondary" size="m" onClick={v.toggleCols} />
                  {v.colsOpen ? (
                    <>
                      <div className="ntv-colvis__backdrop" onClick={v.closeCols} />
                      <NTV.ColumnVisibility columns={v.colColumns} onToggle={v.toggleCol} onReset={v.resetCols} onClose={v.closeCols} />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="dv-table hosts-table">
              <div role="table" aria-label="Hosts" style={{ minWidth: v.tableMin }}>
                <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.cols)}` }}>
                  <div style={{ textAlign: "center" }}>#</div>
                  {v.show.name ? <div>Host Name</div> : null}
                  {v.show.address ? <div>Address</div> : null}
                  {v.show.city ? <div>City</div> : null}
                  {v.show.state ? <div>State</div> : null}
                  {v.show.zip ? <div>Postal Code</div> : null}
                  {v.show.tz ? <div>Timezone</div> : null}
                  {v.show.lic ? <div>Total Licenses</div> : null}
                  {v.show.actions ? <div>Actions</div> : null}
                </div>
                {(v.rows || []).map((_r, $index) => (
                  <React.Fragment key={$index}>
                    <div role="row" className="dv-tr" style={{ gridTemplateColumns: `${s(v.cols)}`, boxShadow: `inset 4px 0 0 ${s(_r?.color)}` }}>
                      <div style={{ textAlign: "center" }}>{_r?.n}</div>
                      {v.show.name ? <div>
                        <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerHostDetail.dc.html" onClick={_r?.open} data-nav={_r?.openNav}>{_r?.name}</a>
                      </div> : null}
                      {v.show.address ? <div>{_r?.address}</div> : null}
                      {v.show.city ? <div>{_r?.city}</div> : null}
                      {v.show.state ? <div>{_r?.state}</div> : null}
                      {v.show.zip ? <div>{_r?.zip}</div> : null}
                      {v.show.tz ? <div>{_r?.tz}</div> : null}
                      {v.show.lic ? <div>
                        <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerLicenses.dc.html" onClick={_r?.openLic} data-nav={_r?.openLicNav}>{_r?.lic}</a>
                      </div> : null}
                      {v.show.actions ? <div className="dv-row" style={{ gap: "2px" }}>
                        <a className="dv-ib dv-edit" aria-label="Edit host" href="DealerHostDetail.dc.html" onClick={_r?.edit} data-nav={_r?.editNav}><NTV.Icon name="pen-to-square" size={v.i14} /></a>
                        <button type="button" className="dv-ib dv-danger" aria-label="Delete host" onClick={_r?.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                      </div> : null}
                    </div>
                  </React.Fragment>
                ))}
                {v.empty ? (
                  <>
                    <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No hosts match your search.</div>
                  </>
                ) : null}
              </div>
            </div>
          </section>
          <div className="dv-foot">
            <span>{"Showing "}{v.shown}{" of "}{v.matched}{" items"}</span>
            {v.hasMore ? (
              <>
                <button type="button" onClick={v.more}>Show More...</button>
              </>
            ) : null}
          </div>
        </main>
      </div>
      {v.blocked?.open ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="error" title="Can’t Delete Host" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              <strong style={{ color: "var(--fg-primary)" }}>{v.blocked?.name}</strong>
              {" still has "}{v.blocked?.n}{" license(s) assigned. Unassign them from the host’s License tab first, then delete the host."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeBlocked}>Close</NTV.Button>
              <a href="DealerHostDetail.dc.html" onClick={v.blocked?.go} className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ textDecoration: "none" }} data-nav={v.blocked?.goNav}>Go to Licenses</a>
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
