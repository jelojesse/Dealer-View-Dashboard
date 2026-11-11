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
  constructor(props) { super(props); this.state = { range: 'Last 12 months', chartType: 'Line', hover: -1 }; }
  renderVals() {
    var pct = function (v, of) { return (v / of * 100).toFixed(2) + '%'; };
    var R = this.vals0();
    R.growth.grid = R.growth.grid.map(function (g) { return Object.assign({}, g, { tp: pct(g.y, 300) }); });
    R.growth.ticks = R.growth.ticks.map(function (t) { return Object.assign({}, t, { xp: pct(t.x, 1200) }); });
    if (R.tip.show) R.tip.left = pct(R.tip.x, 1200);
    return R;
  }
  vals0() {
    var self = this;
    // Network Growth: running totals per month. The last month (Nov) is the current, in-progress month.
    var months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    var seriesDef = [
      { key: 'screens', label: 'Screens', color: 'var(--success-main)', vals: [18, 27, 40, 45, 54, 59, 65, 70, 72, 72, 75, 82] },
      { key: 'hosts', label: 'Hosts', color: 'var(--info-main)', vals: [9, 11, 12, 14, 15, 16, 19, 24, 28, 34, 39, 43] },
      { key: 'advertisers', label: 'Advertisers', color: 'var(--teal-main)', vals: [1, 1, 2, 2, 3, 4, 6, 9, 14, 17, 21, 24] }
    ];
    var n = this.state.range === 'Last 3 months' ? 3 : (this.state.range === 'Last 6 months' ? 6 : 12);
    var ms = months.slice(12 - n);
    var column = this.state.chartType === 'Column';
    // Lines run edge to edge; columns sit in the middle of equal-width month slots.
    var X = column
      ? function (i) { return 60 + (i + 0.5) * (1120 / n); }
      : function (i) { return n === 1 ? 620 : 60 + i * (1120 / (n - 1)); };
    var Y = function (v) { return 260 - v * 2.4; };
    var series = seriesDef.map(function (s) {
      var vs = s.vals.slice(12 - n);
      var pts = vs.map(function (v, i) { return { x: X(i), y: Y(v), m: ms[i], v: v }; });
      var done = pts.slice(0, -1), last = pts[pts.length - 1], prev = done[done.length - 1];
      return {
        key: s.key, label: s.label, color: s.color, pts: pts,
        line: done.map(function (p, i) { return (i ? 'L' : 'M') + p.x + ' ' + p.y; }).join(' '),
        live: 'M' + prev.x + ' ' + prev.y + ' L' + last.x + ' ' + last.y,
        added: vs[vs.length - 1] - vs[0]
      };
    });
    var grid = [0, 20, 40, 60, 80, 100].map(function (v) { return { y: Y(v), label: v }; });
    var step = column ? 1120 / n : (n > 1 ? 1120 / (n - 1) : 1120);
    // Column view: one group per month, one bar per series. The current month is faded (still in progress).
    var bars = null;
    if (column) {
      var groupW = Math.min(step * 0.6, 150), barW = groupW / series.length, r = Math.min(4, barW / 2 - 1);
      bars = [];
      ms.forEach(function (m, i) {
        series.forEach(function (sr, k) {
          var x = X(i) - groupW / 2 + k * barW + 1, w = barW - 2, top = sr.pts[i].y, h = 260 - top, rr = Math.min(r, h);
          bars.push({ key: sr.key + i, color: sr.color, live: i === n - 1,
            d: 'M' + x + ' 260 V' + (top + rr) + ' Q' + x + ' ' + top + ' ' + (x + rr) + ' ' + top +
               ' H' + (x + w - rr) + ' Q' + (x + w) + ' ' + top + ' ' + (x + w) + ' ' + (top + rr) + ' V260 Z' });
        });
      });
    }
    var ticks = ms.map(function (m, i) { return { x: X(i), hx: X(i) - step / 2, m: i === n - 1 ? m + ' (to date)' : m, live: i === n - 1, hover: function () { self.setState({ hover: i }); } }; });
    var hi = this.state.hover >= 0 && this.state.hover < n ? this.state.hover : -1;
    var tip = hi < 0 ? { show: false } : { show: true, x: X(hi), flip: hi > n / 2, month: ms[hi] + (hi === n - 1 ? ' (to date)' : ''),
      rows: series.map(function (sr) { return { key: sr.key, label: sr.label, color: sr.color, v: sr.pts[hi].v, y: sr.pts[hi].y }; }) };
    // "Line with Annotations" view: notes drawn on top of the same data.
    var annotated = this.state.chartType === 'Line with Annotations';
    var labelW = function (t) { return t.length * 6.6 + 14; };
    var anno = null;
    if (annotated) {
      var scr = seriesDef[0].vals;
      var vis = scr.slice(12 - n);
      // Y-axis line: average Screens over the selected range.
      var avg = Math.round(vis.reduce(function (a, b) { return a + b; }, 0) / vis.length);
      var avgText = 'Avg Screens: ' + avg;
      // X-axis line: completed month with the biggest Screens gain (vs. the month before it).
      var best = -1, bestGain = -1;
      for (var i = 0; i < n - 1; i++) { var gi = 12 - n + i; if (gi > 0 && scr[gi] - scr[gi - 1] > bestGain) { bestGain = scr[gi] - scr[gi - 1]; best = i; } }
      var jumpText = 'Biggest jump: +' + bestGain + ' Screens';
      // Range band: the in-progress month.
      var bandX = n > 1 ? X(n - 2) : X(0);
      // Point labels: latest value for each series.
      var pointsA = series.map(function (sr) {
        var p = sr.pts[sr.pts.length - 1], t = sr.label + ': ' + p.v, w = labelW(t);
        return { key: sr.key, color: sr.color, x: p.x, y: p.y, text: t, w: w, bx: p.x - w - 12, by: p.y - 11 };
      });
      anno = {
        yLine: { y: Y(avg), text: avgText, w: labelW(avgText), bx: 66, by: Y(avg) - 24 },
        xLine: best < 0 ? null : (function () { var x = X(best), w = labelW(jumpText), left = x + w + 8 > 1180; return { x: x, text: jumpText, w: w, bx: left ? x - w - 6 : x + 6, by: 24 }; })(),
        band: { x: bandX, w: X(n - 1) - bandX, text: ms[n - 1] + ' (to date)', tw: labelW(ms[n - 1] + ' (to date)') },
        jumpPt: best < 0 ? null : { x: X(best), y: series[0].pts[best].y, color: series[0].color },
        points: pointsA
      };
    }
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
      setRange: function (v) { self.setState({ range: val(v), hover: -1 }); },
      chartTypeOptions: ['Line', 'Line with Annotations', 'Column'],
      chartType: this.state.chartType,
      setChartType: function (v) { self.setState({ chartType: val(v), hover: -1 }); },
      growth: { series: series, grid: grid, ticks: ticks, step: step, anno: anno, column: column, bars: bars },
      tip: tip, clearHover: function () { self.setState({ hover: -1 }); },
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
        { icon: 'lock', title: '8 disabled licenses', sub: 'Turned off, these licenses can’t play content.', cta: 'Review', href: 'DealerLicenses.dc.html', go: to('DealerLicenses.dc.html', { status: 'disabled' }) }
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
          <section aria-label="Charts" className="db-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "24px", fontWeight: "700" }}>Network Growth</h2>
                <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>{"Screens, Hosts and Advertisers on your network · this month updates live"}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div className="db-legend">
                  {(v.growth?.series || []).map((_s) => (
                    <span key={_s.key} className="db-legend__item">
                      <span className="db-dot" style={{ background: _s.color }} />
                      {_s.label}
                    </span>
                  ))}
                </div>
                <div className="db-range" aria-label="Chart type">
                  <NTV.Select size="l" options={v.chartTypeOptions} value={v.chartType} onChange={v.setChartType} />
                </div>
                <div className="db-range" aria-label="Date range">
                  <NTV.Select size="l" options={v.rangeOptions} value={v.range} onChange={v.setRange} />
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }} onMouseLeave={v.clearHover}>
              <svg viewBox="0 0 1200 300" role="img" aria-label="Network growth line chart: screens, hosts and advertisers by month" style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}>
                {(v.growth?.grid || []).map((_g, $index) => (
                  <line key={'h' + $index} x1="40" x2="1190" y1={_g?.y} y2={_g?.y} stroke="var(--container-border)" strokeDasharray="3 4" />
                ))}
                {!v.growth?.column ? (v.growth?.ticks || []).map((_t, $index) => (
                  <line key={'v' + $index} x1={_t?.x} x2={_t?.x} y1="20" y2="260" stroke="var(--container-border)" strokeDasharray="3 4" />
                )) : null}
                {v.growth?.column && v.tip?.show ? (
                  <rect x={v.tip.x - v.growth.step / 2} y="20" width={v.growth.step} height="240" fill="var(--primary-050)" />
                ) : null}
                {v.growth?.column ? (v.growth.bars || []).map((_b) => (
                  <path key={_b.key} d={_b.d} fill={_b.color} opacity={_b.live ? 0.45 : 1} />
                )) : null}
                {v.growth?.anno ? (
                  <g className="db-anno-band">
                    <rect x={v.growth.anno.band.x} y="20" width={v.growth.anno.band.w} height="240" fill="var(--primary-050)" />
                    <rect x={v.growth.anno.band.x + v.growth.anno.band.w - v.growth.anno.band.tw} y="0" width={v.growth.anno.band.tw} height="18" rx="3" fill="var(--fg-secondary)" />
                    <text x={v.growth.anno.band.x + v.growth.anno.band.w - v.growth.anno.band.tw / 2} y="13" textAnchor="middle" className="db-anno-text">{v.growth.anno.band.text}</text>
                  </g>
                ) : null}
                {(v.growth?.column ? [] : v.growth?.series || []).map((_s) => (
                  <g key={_s.key}>
                    <path d={_s.line} fill="none" stroke={_s.color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
                    <path d={_s.live} fill="none" stroke={_s.color} strokeWidth="4" strokeDasharray="2 8" strokeLinecap="round" />
                  </g>
                ))}
                {v.growth?.anno ? (
                  <g className="db-anno" pointerEvents="none">
                    {/* Y-axis annotation: average Screens */}
                    <line x1="60" x2="1180" y1={v.growth.anno.yLine.y} y2={v.growth.anno.yLine.y} stroke="var(--accent-action)" strokeWidth="1.5" strokeDasharray="6 4" />
                    <rect x={v.growth.anno.yLine.bx} y={v.growth.anno.yLine.by} width={v.growth.anno.yLine.w} height="20" rx="3" fill="var(--accent-action)" />
                    <text x={v.growth.anno.yLine.bx + v.growth.anno.yLine.w / 2} y={v.growth.anno.yLine.by + 14} textAnchor="middle" className="db-anno-text">{v.growth.anno.yLine.text}</text>
                    {/* X-axis annotation: biggest monthly gain */}
                    {v.growth.anno.xLine ? (
                      <>
                        <line x1={v.growth.anno.xLine.x} x2={v.growth.anno.xLine.x} y1="20" y2="260" stroke="var(--fg-primary)" strokeWidth="1.5" strokeDasharray="6 4" />
                        <rect x={v.growth.anno.xLine.bx} y={v.growth.anno.xLine.by} width={v.growth.anno.xLine.w} height="20" rx="3" fill="var(--fg-primary)" />
                        <text x={v.growth.anno.xLine.bx + v.growth.anno.xLine.w / 2} y={v.growth.anno.xLine.by + 14} textAnchor="middle" className="db-anno-text">{v.growth.anno.xLine.text}</text>
                      </>
                    ) : null}
                    {v.growth.anno.jumpPt ? (
                      <circle cx={v.growth.anno.jumpPt.x} cy={v.growth.anno.jumpPt.y} r="7" fill="var(--bg-surface)" stroke={v.growth.anno.jumpPt.color} strokeWidth="3" />
                    ) : null}
                    {/* Point annotations: latest value per series */}
                    {v.growth.anno.points.map((_p) => (
                      <g key={_p.key}>
                        <circle cx={_p.x} cy={_p.y} r="6" fill={_p.color} stroke="var(--bg-surface)" strokeWidth="2" />
                        <rect x={_p.bx} y={_p.by} width={_p.w} height="22" rx="3" fill={_p.color} />
                        <text x={_p.bx + _p.w / 2} y={_p.by + 15} textAnchor="middle" className="db-anno-text">{_p.text}</text>
                      </g>
                    ))}
                  </g>
                ) : null}
                {v.tip?.show && !v.growth?.column ? (
                  <>
                    <line x1={v.tip.x} x2={v.tip.x} y1="20" y2="260" stroke="var(--fg-faint)" strokeWidth="1" />
                    {v.tip.rows.map((_r) => (
                      <circle key={_r.key} cx={v.tip.x} cy={_r.y} r="5" fill="var(--bg-surface)" stroke={_r.color} strokeWidth="2" />
                    ))}
                  </>
                ) : null}
                {(v.growth?.ticks || []).map((_t, $index) => (
                  <rect key={'r' + $index} x={_t?.hx} y="20" width={v.growth?.step} height="250" fill="transparent" onMouseEnter={_t?.hover} style={{ cursor: "pointer" }} />
                ))}
              </svg>
              {(v.growth?.grid || []).map((_g, $index) => (
                <span key={$index} className="ax-y" style={{ top: `${s(_g?.tp)}`, width: "2.6%" }}>{_g?.label}</span>
              ))}
              {(v.growth?.ticks || []).map((_t, $index) => (
                <span key={$index} className="ax-x" style={{ left: `${s(_t?.xp)}`, fontWeight: _t?.live ? "700" : undefined }}>{_t?.m}</span>
              ))}
              {v.tip?.show ? (
                <div className="db-tip" style={{ left: v.tip.left, transform: v.tip.flip ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}>
                  <p style={{ margin: "0 0 6px", fontWeight: "600" }}>{v.tip.month}</p>
                  {v.tip.rows.map((_r) => (
                    <div key={_r.key} className="db-tip__row">
                      <span><span className="db-dot" style={{ background: _r.color }} />{_r.label}</span>
                      <strong>{_r.v}</strong>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
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
