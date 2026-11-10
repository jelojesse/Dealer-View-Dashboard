// @ts-nocheck
/**
 * Page: Dashboard  (route /)
 * Converted from the Claude Design artboard DealerDashboard.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, go, navFn, peekNav, val } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerDashboard.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { range: 'Last 12 months' }; }
  renderVals() {
    var self = this;
    var months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    var vals = [18, 27, 40, 45, 54, 59, 65, 70, 72, 72, 75, 82];
    var n = this.state.range === 'Last 3 months' ? 3 : (this.state.range === 'Last 6 months' ? 6 : 12);
    var ms = months.slice(12 - n), vs = vals.slice(12 - n);
    var X = function (i) { return n === 1 ? 445 : 60 + i * (780 / (n - 1)); };
    var Y = function (v) { return 260 - v * 2.4; };
    var pts = vs.map(function (v, i) { return { x: X(i), y: Y(v), m: ms[i], v: v }; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x + ' ' + p.y; }).join(' ');
    var grid = [0, 20, 40, 60, 80, 100].map(function (v) { return { y: Y(v), ty: Y(v) + 3, label: v }; });
    var bm = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], bh = [3, 5, 4, 6, 5, 4], ba = [2, 3, 5, 3, 4, 3];
    var BY = function (v) { return 260 - v * 30; };
    var tv = [{ m: 'Ad', v: 55 }, { m: 'Menu', v: 26 }, { m: 'Closed', v: 12 }, { m: 'Unassigned', v: 4 }];
    var TY = function (v) { return 260 - v * 3.6; };
    var to = function (page, filter) { return navFn(page, filter); };
    var pct = function (v, of) { return (v / of * 100).toFixed(2) + '%'; };
    var axY = function (list, H) { return list.map(function (g) { return Object.assign({}, g, { tp: pct(g.y, H) }); }); };
    var R = this.vals0();
    R.growth.grid = axY(R.growth.grid, 300); R.growth.pts = R.growth.pts.map(function (p) { return Object.assign({}, p, { xp: pct(p.x, 860) }); });
    R.bars.grid = axY(R.bars.grid, 300); R.bars.items = R.bars.items.map(function (b) { return Object.assign({}, b, { xp: pct(b.tx, 420) }); });
    R.types.grid = axY(R.types.grid, 300); R.types.items = R.types.items.map(function (b) { return Object.assign({}, b, { xp: pct(b.tx, 420), vp: pct(b.vy - 14, 300) }); });
    return R;
  }
  vals0() {
    var self = this;
    var months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    var vals = [18, 27, 40, 45, 54, 59, 65, 70, 72, 72, 75, 82];
    var n = this.state.range === 'Last 3 months' ? 3 : (this.state.range === 'Last 6 months' ? 6 : 12);
    var ms = months.slice(12 - n), vs = vals.slice(12 - n);
    var X = function (i) { return n === 1 ? 445 : 60 + i * (780 / (n - 1)); };
    var Y = function (v) { return 260 - v * 2.4; };
    var pts = vs.map(function (v, i) { return { x: X(i), y: Y(v), m: ms[i], v: v }; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x + ' ' + p.y; }).join(' ');
    var grid = [0, 20, 40, 60, 80, 100].map(function (v) { return { y: Y(v), ty: Y(v) + 3, label: v }; });
    var bm = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], bh = [3, 5, 4, 6, 5, 4], ba = [2, 3, 5, 3, 4, 3];
    var BY = function (v) { return 260 - v * 30; };
    var tv = [{ m: 'Ad', v: 55 }, { m: 'Menu', v: 26 }, { m: 'Closed', v: 12 }, { m: 'Unassigned', v: 4 }];
    var TY = function (v) { return 260 - v * 3.6; };
    var to = function (page, filter) { return navFn(page, filter); };
    return {
      i10: 10, i12: 12, i14: 14,
      kpis: [
        { title: 'Total Licenses', desc: 'All licenses you own.', value: 97, icon: 'id-card', tone: 'hot-pink', href: 'DealerLicenses.dc.html' },
        { title: 'Hosts', desc: 'Venue Partners hosting your screens.', value: 43, icon: 'location-dot', tone: 'info', href: 'DealerHosts.dc.html' },
        { title: 'Advertisers', desc: 'Businesses with ads on your network.', value: 24, icon: 'tag', tone: 'teal', href: 'DealerAdvertisers.dc.html' }
      ],
      rangeOptions: ['Last 3 months', 'Last 6 months', 'Last 12 months'],
      range: this.state.range,
      setRange: function (v) { self.setState({ range: val(v) }); },
      growth: { pts: pts, line: line, area: line + ' L' + X(n - 1) + ' 260 L' + X(0) + ' 260 Z', grid: grid, added: vs[vs.length - 1] - vs[0] },
      bars: { grid: [0, 2, 4, 6, 8].map(function (v) { return { y: BY(v), ty: BY(v) + 3, label: v }; }),
        items: bm.map(function (m, i) { var x = 60 + i * 60; return { m: m, v1: bh[i], v2: ba[i], x1: x, x2: x + 16, tx: x + 15, y1: BY(bh[i]), h1: bh[i] * 30, y2: BY(ba[i]), h2: ba[i] * 30 }; }) },
      types: { grid: [0, 20, 40, 60].map(function (v) { return { y: TY(v), ty: TY(v) + 3, label: v }; }),
        items: tv.map(function (t, i) { var x = 60 + i * 92; return { m: t.m, v: t.v, x: x, tx: x + 22, y: TY(t.v), h: t.v * 3.6, vy: TY(t.v) - 6 }; }) },
      statusRows: [
        { label: 'Online', n: 74, color: 'var(--status-online)', go: to('DealerLicenses.dc.html', { status: 'online' }) },
        { label: 'Offline', n: 6, color: 'var(--status-offline)', go: to('DealerLicenses.dc.html', { status: 'offline' }) },
        { label: 'Pending Install', n: 2, color: 'var(--status-pending)', go: to('DealerLicenses.dc.html', { status: 'pending' }) }
      ],
      netRows: [
        { label: 'LAN', n: 31, icon: 'network-wired', go: to('DealerLicenses.dc.html', { net: 'LAN' }) },
        { label: 'Wi-Fi', n: 51, icon: 'rss', go: to('DealerLicenses.dc.html', { net: 'WiFi' }) }
      ],
      hostRows: [
        { label: 'Active', n: 40, color: 'var(--success-main)', go: to('DealerHosts.dc.html', { status: 'Active' }) },
        { label: 'Inactive', n: 3, color: 'var(--danger-main)', go: to('DealerHosts.dc.html', { status: 'Inactive' }) }
      ],
      contentRows: [
        { label: 'Others', n: 9, color: 'var(--purple-main)', go: to('DealerMedia.dc.html', { source: 'Others' }) },
        { label: 'Advertisers', n: 1, color: 'var(--teal-main)', go: to('DealerMedia.dc.html', { source: 'Advertisers' }) },
        { label: 'Hosts', n: 1, color: 'var(--info-main)', go: to('DealerMedia.dc.html', { source: 'Hosts' }) },
        { label: 'Channels', n: 1, color: 'var(--success-400)', go: to('DealerMedia.dc.html', { source: 'Channels' }) },
        { label: 'Widgets', n: 1, color: 'var(--hot-pink-main)', go: to('DealerMedia.dc.html', { source: 'Widgets' }) }
      ],
      alerts: [
        { icon: 'wifi-slash', title: '6 screens offline for 24h+', sub: 'Not playing ads. Check power or Internet at the Host.', cta: 'View', href: 'DealerLicenses.dc.html', go: to('DealerLicenses.dc.html', { status: 'offline' }) },
        { icon: 'image', title: '64 unused contents', sub: 'Uploaded but not in any playlist.', cta: 'Manage', href: 'DealerMedia.dc.html', go: to('DealerMedia.dc.html', { type: 'Unused' }) },
        { icon: 'lock', title: '8 disabled licenses', sub: 'Turned off, these licenses can’t play content.', cta: 'Review', href: 'DealerLicenses.dc.html', go: to('DealerLicenses.dc.html', { status: 'disabled' }) },
        { icon: 'id-card', title: '4 unassigned licenses', sub: 'Paid-for screens not playing yet.', cta: 'Assign', href: 'DealerLicenses.dc.html', go: to('DealerLicenses.dc.html', { status: 'unassigned' }) }
      ]
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-dashboard" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="dashboard" />
      </div>
      <div style={{ flex: "1 1 0", minHeight: "0", overflowY: "auto" }}>
        <main style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <h1 style={{ margin: "0", fontSize: "24px", lineHeight: "38px", fontWeight: "700" }}>Welcome Dealer!</h1>
              <p style={{ margin: "0", fontSize: "14px", lineHeight: "24px" }}>This is your dealer overview account</p>
            </div>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "24px", fontWeight: "700" }}>Tuesday, November 10, 2026</p>
          </div>
          <section aria-label="Summary" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div className="db-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <NTV.IconTile icon="house-laptop" tone="danger" />
                <h2 style={{ margin: "0", fontSize: "20px", lineHeight: "32px", fontWeight: "700" }}>Welcome, Ibanez Lighting!</h2>
              </div>
              <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>
                <strong style={{ color: "var(--accent-action)" }}>N-Compass TV’s</strong>
                {" dealers are in "}
                <strong style={{ color: "var(--accent-action)" }}>33</strong>
                {" states and "}
                <strong style={{ color: "var(--accent-action)" }}>90</strong>
                {" markets with over "}
                <strong style={{ color: "var(--accent-action)" }}>1,700</strong>
                {" locations and growing. Our commitment is to serving our dealers with this unsurpassed business opportunity."}
              </p>
            </div>
            {(v.kpis || []).map((_k, $index) => (
              <React.Fragment key={$index}>
                <a href={_k?.href} className="db-card db-link" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <NTV.IconTile icon={_k?.icon} tone={_k?.tone} />
                      <div>
                        <p style={{ margin: "0", fontSize: "20px", lineHeight: "32px", fontWeight: "700" }}>{_k?.title}</p>
                        <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>{_k?.desc}</p>
                      </div>
                    </div>
                    <p style={{ margin: "0", fontSize: "28px", lineHeight: "42px", fontWeight: "700" }}>{_k?.value}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", lineHeight: "20px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                      {"Last Week "}
                      <NTV.Trend direction="down">-8.3%</NTV.Trend>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                      {"This Week "}
                      <NTV.Trend direction="up">+8.3%</NTV.Trend>
                    </span>
                  </div>
                </a>
              </React.Fragment>
            ))}
          </section>
          <section aria-label="Charts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px" }}>
            <div className="db-card" style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "16px", minWidth: "0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Network Growth</h2>
                  <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>Assigned licenses (screens installed at Hosts), by month</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", fontSize: "14px", lineHeight: "20px" }}>
                    <span className="db-dot" style={{ background: "var(--success-400)" }} />
                    {"Screens added in range: "}
                    <strong style={{ color: "var(--success-600)" }}>+{v.growth?.added}</strong>
                  </span>
                  <div style={{ width: "220px", flex: "none" }}>
                    <NTV.Select size="l" options={v.rangeOptions} value={v.range} onChange={v.setRange} />
                  </div>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <svg viewBox="0 0 860 300" role="img" aria-label="Network growth line chart" style={{ width: "100%", height: "auto", display: "block" }}>
                  <defs>
                    <linearGradient id="ng" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#3adb30" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#3adb30" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>
                  {(v.growth?.grid || []).map((_g, $index) => (
                    <React.Fragment key={$index}>
                      <line x1="40" x2="850" y1={_g?.y} y2={_g?.y} stroke="#e5e7eb" strokeDasharray="3 3" />
                    </React.Fragment>
                  ))}
                  <path d={v.growth?.area} fill="url(#ng)" />
                  <path d={v.growth?.line} fill="none" stroke="#31b828" strokeWidth="2.5" />
                  {(v.growth?.pts || []).map((_p, $index) => (
                    <React.Fragment key={$index}>
                      <circle cx={_p?.x} cy={_p?.y} r="3.5" fill="#fff" stroke="#31b828" strokeWidth="2" />
                    </React.Fragment>
                  ))}
                </svg>
                {(v.growth?.grid || []).map((_g, $index) => (
                  <React.Fragment key={$index}>
                    <span className="ax-y" style={{ top: `${s(_g?.tp)}`, width: "3.6%" }}>{_g?.label}</span>
                  </React.Fragment>
                ))}
                {(v.growth?.pts || []).map((_p, $index) => (
                  <React.Fragment key={$index}>
                    <span className="ax-x" style={{ left: `${s(_p?.xp)}` }}>{_p?.m}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="db-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>{"New Hosts & Advertisers"}</h2>
                  <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>Signed per month · last 6 months</p>
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px", lineHeight: "20px", fontWeight: "600" }}>
                  <span>
                    <span className="db-dot" style={{ background: "var(--chart-1)" }} />
                    Hosts
                  </span>
                  <span>
                    <span className="db-dot" style={{ background: "var(--teal-main)" }} />
                    Advertisers
                  </span>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <svg viewBox="0 0 420 300" role="img" aria-label="New hosts and advertisers bar chart" style={{ width: "100%", height: "auto", display: "block" }}>
                  {(v.bars?.grid || []).map((_g, $index) => (
                    <React.Fragment key={$index}>
                      <line x1="30" x2="410" y1={_g?.y} y2={_g?.y} stroke="#e5e7eb" strokeDasharray="3 3" />
                    </React.Fragment>
                  ))}
                  {(v.bars?.items || []).map((_b, $index) => (
                    <React.Fragment key={$index}>
                      <rect x={_b?.x1} y={_b?.y1} width="14" height={_b?.h1} fill="#095af3" />
                      <rect x={_b?.x2} y={_b?.y2} width="14" height={_b?.h2} fill="#26a69a" />
                    </React.Fragment>
                  ))}
                </svg>
                {(v.bars?.grid || []).map((_g, $index) => (
                  <React.Fragment key={$index}>
                    <span className="ax-y" style={{ top: `${s(_g?.tp)}`, width: "5.5%" }}>{_g?.label}</span>
                  </React.Fragment>
                ))}
                {(v.bars?.items || []).map((_b, $index) => (
                  <React.Fragment key={$index}>
                    <span className="ax-x" style={{ left: `${s(_b?.xp)}` }}>{_b?.m}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <a href="DealerLicenses.dc.html" className="db-card db-link" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Licenses</h2>
                <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>82 of 97 in use · 8 disabled</p>
              </div>
              <div style={{ position: "relative" }}>
                <svg viewBox="0 0 420 300" role="img" aria-label="Licenses by type bar chart" style={{ width: "100%", height: "auto", display: "block" }}>
                  {(v.types?.grid || []).map((_g, $index) => (
                    <React.Fragment key={$index}>
                      <line x1="30" x2="410" y1={_g?.y} y2={_g?.y} stroke="#e5e7eb" strokeDasharray="3 3" />
                    </React.Fragment>
                  ))}
                  {(v.types?.items || []).map((_b, $index) => (
                    <React.Fragment key={$index}>
                      <rect x={_b?.x} y={_b?.y} width="44" height={_b?.h} fill="#8e0064" />
                    </React.Fragment>
                  ))}
                </svg>
                {(v.types?.grid || []).map((_g, $index) => (
                  <React.Fragment key={$index}>
                    <span className="ax-y" style={{ top: `${s(_g?.tp)}`, width: "5.5%" }}>{_g?.label}</span>
                  </React.Fragment>
                ))}
                {(v.types?.items || []).map((_b, $index) => (
                  <React.Fragment key={$index}>
                    <span className="ax-x" style={{ left: `${s(_b?.xp)}` }}>{_b?.m}</span>
                    <span className="ax-x" style={{ left: `${s(_b?.xp)}`, bottom: "auto", top: `${s(_b?.vp)}`, fontWeight: "700", color: "#091635" }}>{_b?.v}</span>
                  </React.Fragment>
                ))}
              </div>
            </a>
          </section>
          <section aria-label="Status" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div className="db-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Screen Status</h2>
                <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>82 assigned licenses, right now</p>
              </div>
              <div style={{ border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <p style={{ margin: "0" }}>
                    <span style={{ fontSize: "36px", lineHeight: "44px", fontWeight: "700", color: "var(--success-600)" }}>90%</span>
                    {" "}
                    <span style={{ fontSize: "14px" }}>Online (74 of 82)</span>
                  </p>
                </div>
                <div aria-hidden="true" style={{ display: "flex", height: "6px", borderRadius: "999px", overflow: "hidden", gap: "2px" }}>
                  <span style={{ flex: "74", background: "var(--status-online)" }} />
                  <span style={{ flex: "6", background: "var(--status-offline)" }} />
                  <span style={{ flex: "2", background: "var(--status-pending)" }} />
                </div>
                <div>
                  {(v.statusRows || []).map((_r, $index) => (
                    <React.Fragment key={$index}>
                      <a href="DealerLicenses.dc.html" onClick={_r?.go} className="db-row" data-nav={_r?.goNav}>
                        <span>
                          <span className="db-dot" style={{ background: `${s(_r?.color)}` }} />
                          {_r?.label}
                        </span>
                        <strong>{_r?.n}</strong>
                      </a>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {(v.netRows || []).map((_r, $index) => (
                    <React.Fragment key={$index}>
                      <a href="DealerLicenses.dc.html" onClick={_r?.go} className="db-link" style={{ border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)", padding: "12px 16px" }} data-nav={_r?.goNav}>
                        <p style={{ margin: "0", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", lineHeight: "20px", color: "var(--fg-secondary)" }}>
                          <NTV.Icon name={_r?.icon} size={v.i14} />
                          {_r?.label}
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: "20px", lineHeight: "28px", fontWeight: "700" }}>{_r?.n}</p>
                      </a>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div className="db-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Hosts</h2>
                <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>43 Venue Partners · +4 this month</p>
              </div>
              <div style={{ flex: "1 1 auto", border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ margin: "0" }}>
                  <span style={{ fontSize: "36px", lineHeight: "44px", fontWeight: "700" }}>40</span>
                  {" "}
                  <span style={{ fontSize: "14px" }}>active Hosts</span>
                </p>
                <div aria-hidden="true" style={{ display: "flex", height: "6px", borderRadius: "999px", overflow: "hidden", gap: "2px" }}>
                  <span style={{ flex: "40", background: "var(--success-main)" }} />
                  <span style={{ flex: "3", background: "var(--danger-main)" }} />
                </div>
                <div style={{ flex: "1 1 auto" }}>
                  {(v.hostRows || []).map((_r, $index) => (
                    <React.Fragment key={$index}>
                      <a href="DealerHosts.dc.html" onClick={_r?.go} className="db-row" data-nav={_r?.goNav}>
                        <span>
                          <span className="db-dot" style={{ background: `${s(_r?.color)}` }} />
                          {_r?.label}
                        </span>
                        <strong>{_r?.n}</strong>
                      </a>
                    </React.Fragment>
                  ))}
                </div>
                <a href="DealerHosts.dc.html" className="db-act" style={{ alignSelf: "flex-start", height: "32px", fontSize: "14px" }}>
                  {"View Hosts "}
                  <NTV.Icon name="angle-right" size={v.i12} />
                </a>
              </div>
            </div>
            <div className="db-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Content</h2>
                <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>Average items per Ad license, by source</p>
              </div>
              <div style={{ border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ margin: "0" }}>
                  <span style={{ fontSize: "36px", lineHeight: "44px", fontWeight: "700" }}>13</span>
                  {" "}
                  <span style={{ fontSize: "14px" }}>items per Ad license</span>
                </p>
                <div aria-hidden="true" style={{ display: "flex", height: "6px", borderRadius: "999px", overflow: "hidden", gap: "2px" }}>
                  <span style={{ flex: "9", background: "var(--purple-main)" }} />
                  <span style={{ flex: "1", background: "var(--teal-main)" }} />
                  <span style={{ flex: "1", background: "var(--info-main)" }} />
                  <span style={{ flex: "1", background: "var(--success-400)" }} />
                  <span style={{ flex: "1", background: "var(--hot-pink-main)" }} />
                </div>
                <div>
                  {(v.contentRows || []).map((_r, $index) => (
                    <React.Fragment key={$index}>
                      <a href="DealerMedia.dc.html" onClick={_r?.go} className="db-row" data-nav={_r?.goNav}>
                        <span>
                          <span className="db-dot" style={{ background: `${s(_r?.color)}` }} />
                          {_r?.label}
                        </span>
                        <strong>{_r?.n}</strong>
                      </a>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <p style={{ margin: "0", display: "flex", justifyContent: "space-between", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>
                <span>Avg main show playlist</span>
                <strong style={{ color: "var(--fg-primary)" }}>3m 2s</strong>
              </p>
            </div>
            <div className="db-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Needs your attention</h2>
                <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>Issues to fix, most urgent first.</p>
              </div>
              {(v.alerts || []).map((_a, $index) => (
                <React.Fragment key={$index}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)" }}>
                    <span style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--danger-050)", color: "var(--danger-main)" }}><NTV.Icon name={_a?.icon} size={v.i14} /></span>
                    <div style={{ flex: "1 1 auto", minWidth: "0" }}>
                      <p style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "600" }}>{_a?.title}</p>
                      <p style={{ margin: "0", fontSize: "10px", lineHeight: "15px", color: "var(--fg-secondary)" }}>{_a?.sub}</p>
                    </div>
                    <a href={_a?.href} onClick={_a?.go} className="db-act" data-nav={_a?.goNav}>
                      {_a?.cta}{" "}
                      <NTV.Icon name="angle-right" size={v.i10} />
                    </a>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
    </div>
));

export default Component;
