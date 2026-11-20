// @ts-nocheck
/**
 * Page: Dealers  (route /dealers) — Admin view
 * From Figma "Dealers Page V2 – NTV360" (8844:22312, analytics 9616:28885), laid out like DealerHosts.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 * - The table keeps a fixed height; opening analytics pushes it down (it never collapses).
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { addNav, contains, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import SummaryCard from '../components/SummaryCard';
import FilterBy, { passes } from '../components/FilterBy';
import './AdminDealers.css';

/* ============================== Logic ============================== */

var RISK = { ontrack: { label: 'On Track', color: 'var(--success-main)' }, atrisk: { label: 'At Risk', color: 'var(--warning-main)' }, highrisk: { label: 'High Risk', color: 'var(--danger-main)' } };
/* Column widths from the Figma table (Dealer Table Heading). */
var COLS = '48px minmax(120px, 189fr) minmax(170px, 300fr) minmax(120px, 135fr) minmax(84px, 100fr) minmax(60px, 83fr) minmax(92px, 120fr) minmax(68px, 99fr) minmax(68px, 99fr) minmax(88px, 113fr) minmax(60px, 97fr) minmax(64px, 90fr) minmax(60px, 100fr) minmax(64px, 100fr) minmax(84px, 96fr) 76px';
var W = 900, H = 300, L = 40, R = 880, T = 20, B = 260;

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { query: '', filters: {}, analytics: false, limit: 10, period: 'Month', year: '2026', hoverL: -1, hoverB: -1, toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var all = D.dealers || [];
    var matches = all.filter(function (d) {
      return passes(s.filters, 'status', d.status) && passes(s.filters, 'risk', RISK[d.risk].label) &&
        contains(d.alias + ' ' + d.business + ' ' + d.contact + ' ' + (d.tags || []).join(' '), s.query.replace(/^#/, ''));
    });
    var vis = matches.slice(0, s.limit);
    var ser = D.dealerSeries, n = ser.months.length, step = (R - L) / (n - 1);
    var X = function (i) { return L + i * step; }, Y = function (v) { return B - v / 100 * (B - T); };
    var path = function (vals) { return vals.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' '); };
    var bw = 9, bstep = (R - L) / n;
    var BX = function (i) { return L + bstep * i + bstep / 2; };
    var hl = s.hoverL, hb = s.hoverB;
    return {
      none: null, i14: 14, cols: COLS,
      total: 484, activeCount: 387, inactiveCount: 97,
      analytics: s.analytics, analyticsLabel: s.analytics ? 'Hide Analytics' : 'Show Analytics', analyticsIcon: s.analytics ? 'angle-up' : 'angle-down',
      analyticsTone: s.analytics ? 'neutral' : 'default',
      toggleAnalytics: function () { self.setState({ analytics: !self.state.analytics }); },
      periodOptions: ['Month', 'Quarter'], period: s.period, setPeriod: function (v) { self.setState({ period: val(v) }); },
      yearOptions: ['2026', '2025'], year: s.year, setYear: function (v) { self.setState({ year: val(v) }); },
      grid: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(function (k) { return { y: Y(k).toFixed(1), label: k, tp: (Y(k) / H * 100).toFixed(2) + '%' }; }),
      line: {
        active: path(ser.active), onboarding: path(ser.onboarding), onboardingNow: ser.onboarding[ser.onboarding.length - 1] + 7, activeNow: 32,
        months: ser.months.map(function (m, i) { return { label: m, x: X(i).toFixed(1), xp: (X(i) / W * 100).toFixed(2) + '%', hx: (X(i) - step / 2).toFixed(1), hover: function () { self.setState({ hoverL: i }); } }; }),
        step: step.toFixed(1),
        tip: hl >= 0 ? { show: true, x: X(hl).toFixed(1), y: Y(ser.active[hl]).toFixed(1), left: 'calc(' + (X(hl) / W * 100).toFixed(1) + '% + 12px)', month: ser.months[hl], total: ser.active[hl] + ser.onboarding[hl], fresh: ser.onboarding[hl], active: ser.active[hl], inactive: Math.max(0, Math.round(ser.active[hl] / 5)) } : { show: false }
      },
      clearL: function () { self.setState({ hoverL: -1 }); },
      bars: {
        months: ser.months.map(function (m, i) {
          var c = BX(i);
          return { label: m, xp: (c / W * 100).toFixed(2) + '%', hx: (L + bstep * i).toFixed(1), on: hb === i,
            g: [['ontrack', 'var(--success-main)'], ['atrisk', 'var(--warning-main)'], ['highrisk', 'var(--danger-main)']].map(function (k, j) { var v = ser.risk[k[0]][i]; return { x: (c - bw * 1.5 - 2 + j * (bw + 2)).toFixed(1), y: Y(v).toFixed(1), h: Math.max(1, B - Y(v)).toFixed(1), fill: k[1] }; }),
            hover: function () { self.setState({ hoverB: i }); } };
        }),
        step: bstep.toFixed(1),
        tip: hb >= 0 ? { show: true, left: 'calc(' + (BX(hb) / W * 100).toFixed(1) + '% + 16px)', month: ser.months[hb], on: ser.risk.ontrack[hb], at: ser.risk.atrisk[hb], high: ser.risk.highrisk[hb] } : { show: false }
      },
      clearB: function () { self.setState({ hoverB: -1 }); },
      legend: Object.keys(RISK).map(function (k) { return RISK[k]; }),
      filterGroups: [
        { key: 'status', title: 'Status', options: ['Active', 'Inactive'] },
        { key: 'risk', title: 'Risk', options: ['On Track', 'At Risk', 'High Risk'] }
      ],
      filters: s.filters, setFilters: function (x) { self.setState({ filters: x, limit: 10 }); },
      query: s.query, setQuery: function (v) { self.setState({ query: val(v), limit: 10 }); },
      rows: vis.map(function (d, i) {
        return { n: i + 1, alias: d.alias, business: d.business, contact: d.contact, age: d.age + ' month(s)', lic: d.lic, hosts: d.hosts, adv: d.adv,
          status: d.status, statusCls: d.status === 'Active' ? 'is-active' : 'is-inactive', color: RISK[d.risk].color,
          open: navFn('AdminDealerDetail.dc.html', { id: d.id }),
          edit: function () { toast(self, 'Editing dealers isn’t designed yet', 'info'); },
          remove: function () { toast(self, 'Deleting dealers isn’t designed yet', 'info'); } };
      }),
      empty: vis.length === 0, shown: vis.length, matched: matches.length, hasMore: matches.length > vis.length,
      more: function () { self.setState({ limit: self.state.limit + 10 }); },
      exportIt: function () { toast(self, 'Exporting ' + matches.length + ' dealers to Excel…', 'info'); },
      refresh: function () { toast(self, 'Dealer list refreshed', 'info'); },
      toast: toastVals(s.toast, this)
    };
  }
}

;(function () { var P = 'AdminDealers.dc.html'; var C = Component; var R0 = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R0.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-admin-dealers" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Dealers" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between dv-page-head">
            <h1 className="dv-h1">Dealers</h1>
            <NTV.Button variant="primary" tone={v.analyticsTone} size="xl" iconLeft="chart-simple" iconRight={v.analyticsIcon} onClick={v.toggleAnalytics}>{v.analyticsLabel}</NTV.Button>
          </div>
          <section aria-label="Dealer totals" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="status" title="Total Dealers" description="All registered Dealers" value={v.total} icon="briefcase" tone="success" active={v.activeCount} inactive={v.inactiveCount} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="New Dealer Registrations" description="Weekly dealer registration comparison" value="23" icon="briefcase" tone="info" period="This Week" direction="down" trend="-8.3%" />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="Last Week" description="Compared to two weeks ago" value="18" icon="briefcase" tone="danger" period="Last Week" direction="down" trend="-8.3%" />
              </div>
            </div>
          </section>
          {v.analytics ? (
            <section className="ad-charts" aria-label="Dealer analytics">
              <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3">Dealer Setup Progress Overview</h2>
                  <div className="dv-row" style={{ gap: "10px" }}>
                    <div className="dv-legend" style={{ fontWeight: "700", fontSize: "14px", marginRight: "6px" }}>
                      <span><span className="dv-dot" style={{ background: "var(--info-main)" }} />{"Onboarding: "}<span style={{ color: "var(--info-main)" }}>12</span></span>
                      <span>{"Active: "}<span style={{ color: "var(--success-main)" }}>32</span></span>
                    </div>
                    <div className="ad-sel"><NTV.Select size="m" options={v.periodOptions} value={v.period} onChange={v.setPeriod} /></div>
                    <div className="ad-sel"><NTV.Select size="m" options={v.yearOptions} value={v.year} onChange={v.setYear} /></div>
                  </div>
                </div>
                <div style={{ position: "relative" }} onMouseLeave={v.clearL}>
                  <svg viewBox="0 0 900 300" width="100%" role="img" aria-label="Active and onboarding dealers per month" style={{ display: "block", overflow: "visible" }}>
                    {(v.grid || []).map((_g, $index) => (<line key={$index} x1="40" x2="880" y1={_g.y} y2={_g.y} stroke="#e5e7eb" strokeDasharray="3 4" />))}
                    {(v.line?.months || []).map((_m, $index) => (<line key={$index} x1={_m.x} x2={_m.x} y1="20" y2="260" stroke="#eef0f3" strokeDasharray="3 4" />))}
                    <path d={v.line?.active} fill="none" stroke="var(--info-main)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={v.line?.onboarding} fill="none" stroke="var(--success-main)" strokeWidth="3" strokeDasharray="8 7" strokeLinecap="round" />
                    {v.line?.tip?.show ? <circle cx={v.line.tip.x} cy={v.line.tip.y} r="7" fill="var(--info-main)" stroke="var(--bg-surface)" strokeWidth="2" /> : null}
                    {(v.line?.months || []).map((_m, $index) => (<rect key={$index} x={_m.hx} y="20" width={v.line.step} height="250" fill="transparent" onMouseEnter={_m.hover} style={{ cursor: "pointer" }} />))}
                  </svg>
                  {(v.grid || []).map((_g, $index) => (<span key={$index} className="ax-y" style={{ top: _g.tp, left: "0", width: "3%" }}>{_g.label}</span>))}
                  {(v.line?.months || []).map((_m, $index) => (<span key={$index} className="ax-x" style={{ left: _m.xp, bottom: "-2%" }}>{_m.label}</span>))}
                  {v.line?.tip?.show ? (
                    <div className="ad-tip" style={{ left: v.line.tip.left }}>
                      <div className="dv-between"><p>{v.line.tip.month}</p><strong style={{ color: "var(--info-main)" }}>{v.line.tip.total}</strong></div>
                      <div className="dv-between"><span>New Dealer</span><span style={{ color: "var(--success-main)" }}>{v.line.tip.fresh}</span></div>
                      <div className="dv-between"><span>Active</span><span style={{ color: "var(--success-main)" }}>{v.line.tip.active}</span></div>
                      <div className="dv-between"><span>Inactive</span><span style={{ color: "var(--danger-main)" }}>{v.line.tip.inactive}</span></div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3">Risk Status Overview</h2>
                  <div className="dv-row" style={{ gap: "10px" }}>
                    <div className="dv-legend" style={{ fontWeight: "700", fontSize: "14px", marginRight: "6px" }}>
                      {(v.legend || []).map((_g) => (<span key={_g.label}><span className="dv-dot" style={{ background: _g.color }} />{_g.label}</span>))}
                    </div>
                    <div className="ad-sel"><NTV.Select size="m" options={v.periodOptions} value={v.period} onChange={v.setPeriod} /></div>
                    <div className="ad-sel"><NTV.Select size="m" options={v.yearOptions} value={v.year} onChange={v.setYear} /></div>
                  </div>
                </div>
                <div style={{ position: "relative" }} onMouseLeave={v.clearB}>
                  <svg viewBox="0 0 900 300" width="100%" role="img" aria-label="Dealers by risk status per month" style={{ display: "block", overflow: "visible" }}>
                    {(v.grid || []).map((_g, $index) => (<line key={$index} x1="40" x2="880" y1={_g.y} y2={_g.y} stroke="#e5e7eb" strokeDasharray="3 4" />))}
                    {(v.bars?.months || []).map((_m, $index) => (
                      <g key={$index}>
                        {_m.on ? <rect x={_m.hx} y="20" width={v.bars.step} height="240" fill="var(--primary-050)" /> : null}
                        {_m.g.map((_b, k) => (<rect key={k} x={_b.x} y={_b.y} width="9" height={_b.h} rx="1.5" fill={_b.fill} />))}
                        <rect x={_m.hx} y="20" width={v.bars.step} height="250" fill="transparent" onMouseEnter={_m.hover} style={{ cursor: "pointer" }} />
                      </g>
                    ))}
                  </svg>
                  {(v.grid || []).map((_g, $index) => (<span key={$index} className="ax-y" style={{ top: _g.tp, left: "0", width: "3%" }}>{_g.label}</span>))}
                  {(v.bars?.months || []).map((_m, $index) => (<span key={$index} className="ax-x" style={{ left: _m.xp, bottom: "-2%" }}>{_m.label}</span>))}
                  {v.bars?.tip?.show ? (
                    <div className="ad-tip" style={{ left: v.bars.tip.left }}>
                      <p>{v.bars.tip.month}</p>
                      <div className="dv-between"><span className="dv-row" style={{ gap: "6px" }}><span className="dv-dot" style={{ background: "var(--success-main)" }} />On Track</span><span>{v.bars.tip.on}</span></div>
                      <div className="dv-between"><span className="dv-row" style={{ gap: "6px" }}><span className="dv-dot" style={{ background: "var(--warning-main)" }} />At Risk</span><span>{v.bars.tip.at}</span></div>
                      <div className="dv-between"><span className="dv-row" style={{ gap: "6px" }}><span className="dv-dot" style={{ background: "var(--danger-main)" }} />High Risk</span><span>{v.bars.tip.high}</span></div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}
          <div className="dv-between">
            <FilterBy groups={v.filterGroups} value={v.filters} onChange={v.setFilters} />
            <div className="dv-row" style={{ flexWrap: "wrap", gap: "12px" }}>
              <NTV.Input size="l" placeholder="Search Dealer Alias, Business Name, Contact Person or #Tag" iconLeft="magnifying-glass" iconRight="sparkles" label="Search dealers" value={v.query} onChange={v.setQuery} style={{ width: "500px", maxWidth: "100%" }} />
              <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
            </div>
          </div>
          <section className="dv-card" aria-label="Dealer Data" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="dv-between">
              <div className="dv-row" style={{ gap: "20px" }}>
                <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Dealer Data</h2>
                <div className="dv-legend" aria-label="Legend">
                  {(v.legend || []).map((_g) => (<span key={_g.label}><span className="dv-dot" style={{ background: _g.color }} />{_g.label}</span>))}
                </div>
              </div>
              <div className="dv-row" style={{ gap: "12px" }}>
                <NTV.IconButton icon="arrows-rotate" label="Refresh table" variant="secondary" size="m" onClick={v.refresh} />
                <NTV.IconButton icon="gear" label="Table settings" variant="secondary" size="m" />
              </div>
            </div>
            <div className="dv-table">
              <div role="table" aria-label="Dealers" style={{ minWidth: "1380px" }}>
                <div role="row" className="ad-th" style={{ gridTemplateColumns: v.cols, gridTemplateRows: "32px 32px" }}>
                  <div className="ad-first" style={{ gridRow: "1 / 3", gridColumn: "1", justifyContent: "center" }}>#</div>
                  <div style={{ gridRow: "1 / 3", gridColumn: "2" }}>Dealer Alias</div>
                  <div style={{ gridRow: "1 / 3", gridColumn: "3" }}>Business Name</div>
                  <div style={{ gridRow: "1 / 3", gridColumn: "4" }}>Contact Person</div>
                  <div style={{ gridRow: "1 / 3", gridColumn: "5" }}>Age</div>
                  <div className="ad-g" style={{ gridRow: "1", gridColumn: "6 / 10" }}>Licenses</div>
                  <div className="ad-g" style={{ gridRow: "1", gridColumn: "10 / 13" }}>Hosts</div>
                  <div className="ad-g" style={{ gridRow: "1", gridColumn: "13 / 15" }}>Advertisers</div>
                  <div style={{ gridRow: "2", gridColumn: "6" }}>Total</div>
                  <div style={{ gridRow: "2", gridColumn: "7" }}>Unassigned</div>
                  <div style={{ gridRow: "2", gridColumn: "8" }}>Online</div>
                  <div style={{ gridRow: "2", gridColumn: "9" }}>Offline</div>
                  <div style={{ gridRow: "2", gridColumn: "10" }}>Scheduled</div>
                  <div style={{ gridRow: "2", gridColumn: "11" }}>Total</div>
                  <div style={{ gridRow: "2", gridColumn: "12" }}>Active</div>
                  <div style={{ gridRow: "2", gridColumn: "13" }}>Total</div>
                  <div style={{ gridRow: "2", gridColumn: "14" }}>Active</div>
                  <div style={{ gridRow: "1 / 3", gridColumn: "15" }}>Status</div>
                  <div style={{ gridRow: "1 / 3", gridColumn: "16" }}>Actions</div>
                </div>
                {(v.rows || []).map((_r, $index) => (
                  <div key={$index} role="row" className="dv-tr" style={{ gridTemplateColumns: v.cols, boxShadow: `inset 4px 0 0 ${s(_r.color)}` }}>
                    <div style={{ textAlign: "center" }}>{_r.n}</div>
                    <div><a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="AdminDealerDetail.dc.html" onClick={_r.open} data-nav={_r.openNav}>{_r.alias}</a></div>
                    <div><a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="AdminDealerDetail.dc.html" onClick={_r.open} data-nav={_r.openNav}>{_r.business}</a></div>
                    <div>{_r.contact}</div>
                    <div>{_r.age}</div>
                    <div>{_r.lic.total}</div>
                    <div>{_r.lic.unassigned}</div>
                    <div>{_r.lic.online}</div>
                    <div>{_r.lic.offline}</div>
                    <div>{_r.hosts.scheduled}</div>
                    <div>{_r.hosts.total}</div>
                    <div>{_r.hosts.active}</div>
                    <div>{_r.adv.total}</div>
                    <div>{_r.adv.active}</div>
                    <div><span className={'ad-chip ' + _r.statusCls}>{_r.status}</span></div>
                    <div className="dv-row" style={{ gap: "2px" }}>
                      <button type="button" className="dv-ib dv-edit" aria-label={'Edit ' + _r.business} onClick={_r.edit}><NTV.Icon name="pen-to-square" size={v.i14} /></button>
                      <button type="button" className="dv-ib dv-danger" aria-label={'Delete ' + _r.business} onClick={_r.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                    </div>
                  </div>
                ))}
                {v.empty ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No dealers match your search.</div> : null}
              </div>
            </div>
          </section>
          <div className="dv-foot">
            <span>{"Showing "}{v.shown}{" of "}{v.matched}{" items"}</span>
            {v.hasMore ? <button type="button" onClick={v.more}>Show More...</button> : null}
          </div>
        </main>
      </div>
      <Toast t={v.toast} />
    </div>
    </div>
));

export default Component;
