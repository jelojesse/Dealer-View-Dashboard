// @ts-nocheck
/**
 * Page: Dashboard (Admin view)  (route /admin)
 * From Figma "Dashboard V2 – Overview" › Basic Line Chart (Host) (4777:51026).
 *
 * - KPI cards (Hosts, Dealers, Advertisers, Licenses) act as tabs for the Growth / Downturn chart.
 * - Recent Activity and Top Dealers on the right; Raspberry Pi Versions, Total Installations, Total Users below.
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 */
import React from 'react';
import { DCLogic, defineTemplate } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { navFn, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './AdminDashboard.css';

/* ============================== Logic ============================== */

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/* The design's Y axis is stepped, not linear: each tick gets the same height. */
var TICKS = [0, 5, 10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
var METRICS = [
  { key: 'hosts', title: 'Total Hosts', icon: 'map', value: 4135, week: 11, last: 13, active: 2777, href: 'DealerHosts.dc.html',
    growth: [10, 20, 30, 40, 50, 100, 200, 300, 400, 500, 1000, 1500], down: [0, 3, 20, 30, 40, 10, 40, 0, 30, 10, 30, 0] },
  { key: 'dealers', title: 'Total Dealers', icon: 'buildings', value: 302, week: 11, last: 13, active: 205, href: 'AdminDealers.dc.html',
    growth: [5, 10, 20, 20, 30, 40, 50, 50, 100, 100, 200, 300], down: [0, 0, 5, 10, 5, 20, 10, 5, 10, 20, 5, 0] },
  { key: 'advertisers', title: 'Total Advertisers', icon: 'tag', value: 2788, week: 11, last: 13, active: 1904, href: 'DealerAdvertisers.dc.html',
    growth: [30, 50, 100, 200, 300, 400, 500, 1000, 1000, 1500, 2000, 2500], down: [10, 20, 40, 30, 50, 20, 100, 40, 30, 50, 20, 10] },
  { key: 'licenses', title: 'Total Licenses', icon: 'id-card', value: 4552, week: 11, last: 13, active: 3410, href: 'DealerLicenses.dc.html',
    growth: [50, 100, 200, 300, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000], down: [20, 40, 30, 50, 100, 40, 200, 50, 100, 40, 30, 20] }
];
var PI = [
  ['Raspberry Pi 4 Model B Rev 1.5', 2439, '#f07b7b'], ['Raspberry Pi 3 Model B Rev 1.2', 1242, '#8378cf'], ['Raspberry Pi 4 Model B Rev 1.4', 493, '#3db5a3'],
  ['Raspberry Pi 4 Model B Rev 1.1', 324, '#e73535'], ['Raspberry Pi 4 Model B Rev 1.3', 125, '#ffcbb8'], ['Raspberry Pi 4 Model B Plus Rev 1.3', 6, '#ffc04d']
];
var W = 1400, H = 380, L = 54, R = 1360, T = 10, B = 330;
function yOf(v) { for (var i = 1; i < TICKS.length; i++) { if (v <= TICKS[i]) { var f = (v - TICKS[i - 1]) / (TICKS[i] - TICKS[i - 1]); return B - ((i - 1 + f) / (TICKS.length - 1)) * (B - T); } } return T; }
function xOf(i) { return L + i * (R - L) / 11; }

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { metric: 'hosts', hover: 6, month: 'Month', year: '2026', graph: 'Line Graph', toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var m = METRICS.filter(function (x) { return x.key === s.metric; })[0];
    var path = function (vals) { return vals.map(function (v, i) { return (i ? 'L' : 'M') + xOf(i).toFixed(1) + ' ' + yOf(v).toFixed(1); }).join(' '); };
    var hi = s.hover;
    var piTotal = PI.reduce(function (a, p) { return a + p[1]; }, 0), C = 2 * Math.PI * 44, acc = 0;
    var dealers = (D.dealers || []).slice().sort(function (a, b) { return b.lic.total - a.lic.total; }).slice(0, 10);
    return {
      i10: 10, i12: 12, i14: 14,
      today: 'Friday, November 20, 2026',
      cards: METRICS.map(function (x) { return { key: x.key, title: x.title, icon: x.icon, value: x.value.toLocaleString('en-US').replace(',', ''), week: x.week, last: x.last, on: x.key === s.metric,
        pick: function () { self.setState({ metric: x.key, hover: -1 }); } }; }),
      active: m.active,
      monthOptions: ['Month', 'Quarter'], month: s.month, setMonth: function (x) { self.setState({ month: val(x) }); },
      yearOptions: ['2026', '2025'], year: s.year, setYear: function (x) { self.setState({ year: val(x) }); },
      graphOptions: ['Line Graph', 'Bar Graph'], graph: s.graph, setGraph: function (x) { self.setState({ graph: val(x) }); },
      isLine: s.graph === 'Line Graph',
      ticks: TICKS.map(function (t) { return { label: t, y: yOf(t).toFixed(1), tp: (yOf(t) / H * 100).toFixed(2) + '%' }; }),
      months: MONTHS.map(function (mm, i) { return { label: mm, x: xOf(i).toFixed(1), xp: (xOf(i) / W * 100).toFixed(2) + '%', hx: (xOf(i) - (R - L) / 22).toFixed(1),
        gy: yOf(m.growth[i]).toFixed(1), dy: yOf(m.down[i]).toFixed(1), gh: Math.max(2, B - yOf(m.growth[i])).toFixed(1), dh: Math.max(2, B - yOf(m.down[i])).toFixed(1),
        bx1: (xOf(i) - 13).toFixed(1), bx2: (xOf(i) + 1).toFixed(1),
        hover: function () { self.setState({ hover: i }); } }; }),
      stepW: ((R - L) / 11).toFixed(1),
      growthPath: path(m.growth), downPath: path(m.down),
      tip: hi >= 0 ? { show: true, x: xOf(hi).toFixed(1), gy: yOf(m.growth[hi]).toFixed(1), dy: yOf(m.down[hi]).toFixed(1),
        left: 'calc(' + (xOf(hi) / W * 100).toFixed(1) + '% + 12px)', top: (Math.min(yOf(m.growth[hi]), yOf(m.down[hi])) / H * 100 - 6).toFixed(1) + '%',
        month: FULL[hi], g: '+' + Math.max(0, m.growth[hi] - (hi ? m.growth[hi - 1] : 0) || m.growth[hi]), d: '-' + m.down[hi] } : { show: false },
      clearHover: function () { self.setState({ hover: -1 }); },
      activity: (D.dealerActivity || []).slice(0, 10).map(function (a) { return { id: a.id, text: a.user + ' · ' + a.detail, at: a.at }; }),
      seeMore: function () { toast(self, 'The full activity log isn’t designed yet', 'info'); },
      pi: PI.map(function (p) { var len = p[1] / piTotal * C, seg = { label: p[0], n: p[1].toLocaleString('en-US'), color: p[2], dash: len.toFixed(2) + ' ' + C.toFixed(2), off: (-acc).toFixed(2) }; acc += len; return seg; }),
      piTotal: piTotal,
      installs: { total: 519, cur: 173, next: 346, last: 173, last3: 346 },
      users: { total: 487, superAdmins: 93, dealerAdmins: 44, dealers: 334, subDealers: 16 },
      topDealers: dealers.map(function (d, i) { var pct = [95, 90, 85, 80, 20, 20, 20, 15, 12, 10][i]; return { n: i + 1, name: d.business, pct: pct + '%', up: i < 7, open: navFn('AdminDealerDetail.dc.html', { id: d.id }) }; }),
      toast: toastVals(s.toast, this)
    };
  }
}

/* ============================== Markup ============================== */

function Tile({ icon, size }) { return <span className="ad-tile"><NTV.Icon name={icon} size={size || 14} /></span>; }

defineTemplate(Component, (v) => (
    <div className="pg-admin-dash" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="dashboard" />
      </div>
      <div className="dv-scroll" style={{ flex: "1 1 0", minHeight: "0", overflowY: "auto" }}>
        <main className="ad-main">
          <div className="ad-head">
            <div>
              <h1 className="ad-h1">Welcome Admin!</h1>
              <p className="ad-sub">This is your N-Compass Dashboard. Have a take a look!</p>
            </div>
            <p className="ad-date">{v.today}</p>
          </div>

          <div className="ad-grid">
            {/* ---- Left, row 1: KPI cards + chart ---- */}
            <div className="ad-left">
              <section className="ad-kpis" aria-label="Totals">
                {v.cards.map((_c) => (
                  <button key={_c.key} type="button" className={'ad-card ad-kpi' + (_c.on ? ' is-on' : '')} aria-pressed={_c.on} onClick={_c.pick}>
                    <span className="ad-kpi__head"><Tile icon={_c.icon} /><span className="ad-kpi__title">{_c.title}</span></span>
                    <span className="ad-kpi__row">
                      <span className="ad-kpi__value">{_c.value}</span>
                      <span className="ad-kpi__weeks">
                        <span><b>{_c.week}</b>This Week</span>
                        <span><b>{_c.last}</b>Last Week</span>
                      </span>
                    </span>
                  </button>
                ))}
              </section>

              <section className="ad-card ad-chart" aria-label="Growth and downturn">
                <div className="ad-chart__head">
                  <span className="ad-active">Active: <b>{v.active.toLocaleString('en-US')}</b></span>
                  <div className="ad-chart__tools">
                    <span className="ad-legend"><span><i style={{ background: "var(--success-main,#3adb30)" }} />Growth</span><span><i style={{ background: "#ff7a00" }} />Downturn</span></span>
                    <div className="ad-sel"><NTV.Select size="s" options={v.monthOptions} value={v.month} onChange={v.setMonth} /></div>
                    <div className="ad-sel"><NTV.Select size="s" options={v.yearOptions} value={v.year} onChange={v.setYear} /></div>
                    <div className="ad-sel"><NTV.Select size="s" options={v.graphOptions} value={v.graph} onChange={v.setGraph} /></div>
                  </div>
                </div>
                <div className="ad-plot" onMouseLeave={v.clearHover}>
                  <svg viewBox="0 0 1400 380" width="100%" role="img" aria-label="Growth and downturn per month" style={{ display: "block", overflow: "visible" }}>
                    {v.ticks.map((_t) => (<line key={_t.label} x1="40" x2="1400" y1={_t.y} y2={_t.y} stroke="#eef0f3" strokeDasharray="4 4" />))}
                    {v.months.map((_m) => (<line key={_m.label} x1={_m.x} x2={_m.x} y1="10" y2="330" stroke="#eef0f3" strokeDasharray="4 4" />))}
                    {v.isLine ? (
                      <>
                        <path d={v.growthPath} fill="none" stroke="var(--success-main,#3adb30)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={v.downPath} fill="none" stroke="#ff7a00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : v.months.map((_m) => (
                      <g key={_m.label}>
                        <rect x={_m.bx1} y={_m.gy} width="12" height={_m.gh} rx="2" fill="var(--success-main,#3adb30)" />
                        <rect x={_m.bx2} y={_m.dy} width="12" height={_m.dh} rx="2" fill="#ff7a00" />
                      </g>
                    ))}
                    {v.tip.show && v.isLine ? (
                      <>
                        <circle cx={v.tip.x} cy={v.tip.gy} r="5" fill="#fff" stroke="var(--success-main,#3adb30)" strokeWidth="2" />
                        <circle cx={v.tip.x} cy={v.tip.dy} r="5" fill="#fff" stroke="#ff7a00" strokeWidth="2" />
                      </>
                    ) : null}
                    {v.months.map((_m) => (<rect key={_m.label} x={_m.hx} y="10" width={v.stepW} height="330" fill="transparent" onMouseEnter={_m.hover} style={{ cursor: "pointer" }} />))}
                  </svg>
                  {v.ticks.map((_t) => (<span key={_t.label} className="ad-ax-y" style={{ top: _t.tp }}>{_t.label}</span>))}
                  {v.months.map((_m) => (<span key={_m.label} className="ad-ax-x" style={{ left: _m.xp }}>{_m.label}</span>))}
                  {v.tip.show ? (
                    <div className="ad-tip" style={{ left: v.tip.left, top: v.tip.top }}>
                      <p>Comparison</p>
                      <div><span><i style={{ background: "var(--success-main,#3adb30)" }} />{v.tip.month}</span><span>{v.tip.g}</span></div>
                      <div><span><i style={{ background: "#ff7a00" }} />{v.tip.month}</span><span>{v.tip.d}</span></div>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>

            {/* ---- Right, row 1: Recent Activity ---- */}
            <section className="ad-card ad-recent" aria-label="Recent Activity">
              <div className="ad-card__head"><Tile icon="clapperboard-play" /><h2 className="ad-h2">Recent Activity</h2></div>
              <div className="ad-recent__bar"><span>Recent Most Activity</span><button type="button" className="ad-link" onClick={v.seeMore}>See More</button></div>
              <div className="ad-recent__list">
                {v.activity.map((_a) => (
                  <div key={_a.id} className="ad-act">
                    <span className="ad-fab" aria-hidden="true"><NTV.Icon name="user" size={v.i10} /></span>
                    <span className="ad-act__text"><span>{_a.text}</span><small>{_a.at}</small></span>
                  </div>
                ))}
              </div>
            </section>

            {/* ---- Left, row 2: Pi versions, Installations, Users ---- */}
            <div className="ad-bottom">
              <section className="ad-card ad-pi" aria-label="Raspberry Pi Versions">
                <div className="ad-card__head"><Tile icon="raspberry-pi" /><h2 className="ad-h2">Raspberry Pi Versions</h2></div>
                <div className="ad-pi__body">
                  <div className="ad-pi__chart">
                    <svg viewBox="0 0 120 120" width="140" height="140" role="img" aria-label="Players by Raspberry Pi version">
                      <g transform="rotate(-90 60 60)">
                        {v.pi.map((_p) => (<circle key={_p.label} cx="60" cy="60" r="44" fill="none" stroke={_p.color} strokeWidth="32" strokeDasharray={_p.dash} strokeDashoffset={_p.off} />))}
                      </g>
                    </svg>
                    <span className="ad-pi__total">{v.piTotal}</span>
                  </div>
                  <div className="ad-pi__legend">
                    {v.pi.map((_p) => (<div key={_p.label}><span><i style={{ background: _p.color }} />{_p.label}</span><b>{_p.n}</b></div>))}
                  </div>
                </div>
              </section>
              <section className="ad-card ad-stats" aria-label="Total Installations">
                <div className="ad-card__head"><Tile icon="download" /><h2 className="ad-h2">Total Installations</h2></div>
                <span className="ad-big">{v.installs.total}</span>
                <div className="ad-statgrid">
                  <div><b>{v.installs.cur}</b><span>Current Month</span></div>
                  <div><b>{v.installs.next}</b><span>Upcoming Month</span></div>
                  <div><b>{v.installs.last}</b><span>Last Month</span></div>
                  <div><b>{v.installs.last3}</b><span>Last 3 Months</span></div>
                </div>
              </section>
              <section className="ad-card ad-stats" aria-label="Total Users">
                <div className="ad-card__head"><Tile icon="users" /><h2 className="ad-h2">Total Users</h2></div>
                <span className="ad-big">{v.users.total}</span>
                <div className="ad-statgrid">
                  <div><b>{v.users.superAdmins}</b><span>Super Admin(s)</span></div>
                  <div><b>{v.users.dealerAdmins}</b><span>Dealer Admin(s)</span></div>
                  <div><b>{v.users.dealers}</b><span>Dealer(s)</span></div>
                  <div><b>{v.users.subDealers}</b><span>Sub-Dealer(s)</span></div>
                </div>
              </section>
            </div>

            {/* ---- Right, row 2: Top Dealers ---- */}
            <section className="ad-card ad-top" aria-label="Top Dealers">
              <div className="ad-card__head"><Tile icon="buildings" /><h2 className="ad-h2">Top Dealers</h2></div>
              <ol className="ad-top__list">
                {v.topDealers.map((_d) => (
                  <li key={_d.n}>
                    <a href="AdminDealerDetail.dc.html" onClick={_d.open} data-nav={_d.openNav}>{_d.n}{". "}{_d.name}</a>
                    <span className={_d.up ? 'is-up' : 'is-down'}>{_d.pct}<NTV.Icon name="arrow-up-right" size={v.i10} /></span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </main>
      </div>
      <Toast t={v.toast} />
    </div>
    </div>
));

var _rv = Component.prototype.renderVals;
Component.prototype.renderVals = function () { var o = _rv.apply(this, arguments); (o.topDealers || []).forEach(function (d) { if (d.open && d.open.nav) d.openNav = d.open.nav; }); return o; };

export default Component;
