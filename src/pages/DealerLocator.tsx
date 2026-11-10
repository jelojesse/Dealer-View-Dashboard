// @ts-nocheck
/**
 * Page: Locator  (route /locator)
 * Converted from the Claude Design artboard DealerLocator.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { STATUS, addNav, licsForHost, navFn, peekNav, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerLocator.css';

/* ============================== Logic ============================== */

var SC = { online: 'var(--status-online)', pending: 'var(--status-pending)', offline: 'var(--status-offline)' };
function hostState(h) { var ls = licsForHost(h.id); if (ls.some(function (l) { return l.status === 'offline'; })) return 'offline'; if (ls.some(function (l) { return l.status === 'pending' || l.status === 'ready'; })) return 'pending'; return 'online'; }
function bbox(pts) { var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; }); return [Math.min.apply(0, xs), Math.min.apply(0, ys), Math.max.apply(0, xs), Math.max.apply(0, ys)]; }
function view(b) { var w = Math.max(b[2] - b[0], 60) + 160, h = Math.max(b[3] - b[1], 60) + 160; return { cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2, z: Math.max(0.7, Math.min(4, Math.min(1400 / w, 900 / h))) }; }
class Component extends DCLogic {
  constructor(props) { super(props); var v = view(bbox(D.terr)); this.state = { query: '', status: { online: true, pending: true, offline: true }, open: '', card: '', panel: true, terrOpen: false, cx: v.cx, cy: v.cy, z: v.z }; }
  renderVals() {
    var self = this, s = this.state;
    var q = s.query.trim().toLowerCase();
    var rows = D.hosts.map(function (h) {
      var ls = licsForHost(h.id), stt = hostState(h);
      var hay = (h.name + ' ' + h.address + ' ' + h.city + ' ' + h.zip + ' ' + ls.map(function (l) { return l.alias + ' ' + l.key; }).join(' ')).toLowerCase();
      return { h: h, ls: ls, st: stt, match: (!q || hay.indexOf(q) !== -1) && s.status[stt] };
    });
    var matches = rows.filter(function (r) { return r.match; });
    var fitTo = function (list) { if (!list.length) return; var v = view(bbox(list.map(function (r) { return [r.h.mx, r.h.my]; }))); self.setState({ cx: v.cx, cy: v.cy, z: v.z }); };
    var cardRow = rows.filter(function (r) { return r.h.id === s.card; })[0];
    var cnt = function (k) { return rows.filter(function (r) { return r.st === k; }).length; };
    var inv = (1 / s.z).toFixed(3);
    return {
      i12: 12, i14: 14, map: D.B.map,
      panelCls: s.panel ? '' : 'closed', panelClosed: !s.panel, togglePanel: function () { self.setState({ panel: !self.state.panel }); },
      query: s.query, setQuery: function (v) { self.setState({ query: val(v), card: '' }); },
      terr: D.territory, terrOpen: s.terrOpen, terrIcon: s.terrOpen ? 'angle-up' : 'angle-down', toggleTerr: function () { self.setState({ terrOpen: !self.state.terrOpen }); },
      hostTotal: D.hosts.length, licTotal: D.licenses.filter(function (l) { return l.host; }).length,
      fitTerr: function () { var v = view(bbox(D.terr)); self.setState({ cx: v.cx, cy: v.cy, z: v.z, card: '' }); },
      chips: [['online', 'Online'], ['pending', 'Pending'], ['offline', 'Offline']].map(function (c) { return { label: c[1], color: SC[c[0]], n: cnt(c[0]), on: !!s.status[c[0]], pick: function () { var o = Object.assign({}, self.state.status); o[c[0]] = !o[c[0]]; self.setState({ status: o }); } }; }),
      countLabel: matches.length + ' of ' + rows.length + ' hosts',
      list: matches.map(function (r) {
        var open = s.open === r.h.id;
        return { name: r.h.name, address: r.h.address + ', ' + r.h.city + ' ' + r.h.zip, color: SC[r.st], licN: r.ls.length + ' lic', open: open, icon: open ? 'angle-up' : 'angle-down',
          toggle: function () { if (open) self.setState({ open: '' }); else self.setState({ open: r.h.id, card: r.h.id, cx: r.h.mx, cy: r.h.my - 40 / Math.max(self.state.z, 2.5), z: Math.max(self.state.z, 2.5) }); },
          lics: r.ls.map(function (l) { return { alias: l.alias, status: STATUS[l.status].label, color: STATUS[l.status].color, open: navFn('DealerLicenseDetail.dc.html', { id: l.id }) }; }),
          openHost: navFn('DealerHostDetail.dc.html', { id: r.h.id }) };
      }),
      empty: matches.length === 0,
      fit: function () { fitTo(matches); self.setState({ card: '' }); },
      z: s.z.toFixed(3), inv: inv, tx: (-s.cx * s.z).toFixed(1), ty: (-s.cy * s.z).toFixed(1),
      strokeW: (2.5 / s.z).toFixed(2), dashW: (10 / s.z).toFixed(1) + ' ' + (6 / s.z).toFixed(1),
      terrPts: D.terr.map(function (p) { return p.join(','); }).join(' '),
      pins: rows.map(function (r) { var sel = s.card === r.h.id; return { name: r.h.name, x: r.h.mx, y: r.h.my, color: SC[r.st], op: r.match ? 1 : 0.22, size: sel ? 34 : 26, zi: sel ? 4 : (r.match ? 2 : 1),
        pick: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); self.setState({ card: r.h.id, open: r.h.id }); } }; }),
      card: cardRow ? { show: true, x: cardRow.h.mx, y: cardRow.h.my, name: cardRow.h.name, photo: cardRow.h.photo, color: SC[cardRow.st], status: cardRow.st.charAt(0).toUpperCase() + cardRow.st.slice(1), address: cardRow.h.address + ', ' + cardRow.h.city + ', ' + cardRow.h.state + ' ' + cardRow.h.zip, lic: cardRow.ls.length + ' license(s) · ' + cardRow.h.category,
        open: navFn('DealerHostDetail.dc.html', { id: cardRow.h.id }) } : { show: false },
      closeCard: function () { if (self.state.card) self.setState({ card: '' }); },
      stop: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); },
      zoomIn: function () { self.setState({ z: Math.min(6, self.state.z * 1.4) }); },
      zoomOut: function () { self.setState({ z: Math.max(0.5, self.state.z / 1.4) }); },
      legend: [{ label: 'Online', color: SC.online }, { label: 'Pending', color: SC.pending }, { label: 'Offline', color: SC.offline }]
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-locator" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Locator" />
      </div>
      <div className="lc-wrap">
        <aside className={`lc-panel ${s(v.panelCls)}`} aria-label="Locator panel">
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px", borderBottom: "1px solid var(--container-border)" }}>
            <div className="dv-between">
              <h1 className="dv-h2">Locator</h1>
              <button type="button" className="dv-ib" aria-label="Collapse panel" onClick={v.togglePanel}>
                <NTV.Icon name="angle-down" size={v.i14} style={{ transform: "rotate(90deg)" }} />
              </button>
            </div>
            <NTV.Input size="l" placeholder="Name, address, city, ZIP or license" iconLeft="magnifying-glass" label="Search locator" value={v.query} onChange={v.setQuery} />
            <button type="button" onClick={v.toggleTerr} aria-expanded={v.terrOpen} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-app)", cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: "var(--fg-primary)" }}>
              <span style={{ color: "var(--accent-action)" }}><NTV.Icon name="map" size={v.i14} /></span>
              <span style={{ flex: "1", minWidth: "0" }}>
                <strong style={{ display: "block", fontSize: "14px", lineHeight: "20px" }}>{v.terr?.name}</strong>
                <span className="dv-sub">{"Your territory · "}{v.terr?.state}</span>
              </span>
              <NTV.Icon name={v.terrIcon} size={v.i12} />
            </button>
            {v.terrOpen ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "0 4px" }}>
                <div className="dv-kv">
                  <span>Area</span>
                  <span>{v.terr?.area}</span>
                </div>
                <div className="dv-kv">
                  <span>Created</span>
                  <span>{v.terr?.created}</span>
                </div>
                <div className="dv-kv">
                  <span>Hosts</span>
                  <span>{v.hostTotal}</span>
                </div>
                <div className="dv-kv">
                  <span>Licenses</span>
                  <span>{v.licTotal}</span>
                </div>
                <button type="button" className="dv-a" onClick={v.fitTerr} style={{ gridColumn: "1 / 3", justifySelf: "start", fontSize: "13px" }}>Zoom to territory</button>
              </div>
              </>
            ) : null}
            <div role="group" aria-label="Status" className="dv-row" style={{ gap: "8px", flexWrap: "wrap" }}>
              {(v.chips || []).map((_c, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className="dv-chip" aria-pressed={_c?.on} onClick={_c?.pick}>
                    <span className="dv-dot" style={{ background: `${s(_c?.color)}` }} />
                    {_c?.label}{" "}
                    <span style={{ color: "var(--fg-secondary)" }}>{_c?.n}</span>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="dv-between" style={{ padding: "10px 16px" }}>
            <span className="dv-sub">{v.countLabel}</span>
            <button type="button" className="dv-a" onClick={v.fit} style={{ fontSize: "12px" }}>Fit map to results</button>
          </div>
          <div style={{ flex: "1 1 0", minHeight: "0", overflowY: "auto" }}>
            {(v.list || []).map((_h, $index) => (
              <React.Fragment key={$index}>
                <div>
                  <button type="button" className="lc-row" aria-expanded={_h?.open} onClick={_h?.toggle}>
                    <span className="dv-dot" style={{ background: `${s(_h?.color)}`, width: "10px", height: "10px" }} />
                    <span style={{ flex: "1", minWidth: "0" }}>
                      <strong style={{ display: "block", fontSize: "14px", lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_h?.name}</strong>
                      <span className="dv-sub" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_h?.address}</span>
                    </span>
                    <span className="dv-sub" style={{ flex: "none" }}>{_h?.licN}</span>
                    <NTV.Icon name={_h?.icon} size={v.i12} />
                  </button>
                  {_h?.open ? (
                    <>
                      <div style={{ padding: "4px 16px 12px 36px", display: "flex", flexDirection: "column", gap: "6px", background: "var(--accent-30)" }}>
                      {(_h?.lics || []).map((_l, $index) => (
                        <React.Fragment key={$index}>
                          <a href="DealerLicenseDetail.dc.html" onClick={_l?.open} className="dv-between" style={{ textDecoration: "none", color: "var(--fg-primary)", fontSize: "12px", lineHeight: "20px", flexWrap: "nowrap" }} data-nav={_l?.openNav}>
                            <span className="dv-row" style={{ gap: "8px" }}>
                              <span className="dv-dot" style={{ background: `${s(_l?.color)}` }} />
                              <strong>{_l?.alias}</strong>
                            </span>
                            <span className="dv-sub">{_l?.status}</span>
                          </a>
                        </React.Fragment>
                      ))}
                      <a className="dv-a" href="DealerHostDetail.dc.html" onClick={_h?.openHost} style={{ fontSize: "12px", marginTop: "4px" }} data-nav={_h?.openHostNav}>View Host Details →</a>
                    </div>
                    </>
                  ) : null}
                </div>
              </React.Fragment>
            ))}
            {v.empty ? (
              <>
                <div className="dv-empty">No hosts or licenses match “{v.query}”.</div>
              </>
            ) : null}
          </div>
        </aside>
        <div className="lc-map" onClick={v.closeCard}>
          {v.panelClosed ? (
            <>
              <div className="lc-toggle">
              <NTV.Button variant="primary" size="m" iconRight="angle-right" onClick={v.togglePanel}>Show Panel</NTV.Button>
            </div>
            </>
          ) : null}
          <div className="lc-layer" style={{ transform: `translate(${s(v.tx)}px, ${s(v.ty)}px) scale(${s(v.z)})` }}>
            <img src={v.map} alt="Map of Alabama" style={{ position: "absolute", inset: "0", width: "1880px", height: "906px", display: "block" }} />
            <svg width="1880" height="906" viewBox="0 0 1880 906" style={{ position: "absolute", inset: "0", pointerEvents: "none" }}>
              <polygon points={v.terrPts} fill="rgba(52, 95, 220, 0.07)" stroke="var(--accent-action)" strokeWidth={v.strokeW} strokeDasharray={v.dashW} />
            </svg>
            {(v.pins || []).map((_p, $index) => (
              <React.Fragment key={$index}>
                <button type="button" className="lc-pin" aria-label={_p?.name} onClick={_p?.pick} style={{ left: `${s(_p?.x)}px`, top: `${s(_p?.y)}px`, opacity: `${s(_p?.op)}`, color: `${s(_p?.color)}`, transform: `translate(-50%, -100%) scale(${s(v.inv)})`, zIndex: `${s(_p?.zi)}` }}><NTV.Icon name="location-dot-solid" size={_p?.size} /></button>
              </React.Fragment>
            ))}
            {v.card?.show ? (
              <>
                <div className="lc-card" onClick={v.stop} style={{ left: `${s(v.card?.x)}px`, top: `${s(v.card?.y)}px`, transform: `translate(-50%, calc(-100% - 40px)) scale(${s(v.inv)})` }}>
                <div className="dv-thumb" style={{ height: "110px", borderRadius: "0" }}><img src={v.card?.photo} alt="" /></div>
                <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div className="dv-between" style={{ flexWrap: "nowrap" }}>
                    <strong style={{ fontSize: "14px", lineHeight: "20px" }}>{v.card?.name}</strong>
                    <span className="dv-st" style={{ fontSize: "12px" }}>
                      <span className="dv-dot" style={{ background: `${s(v.card?.color)}` }} />
                      {v.card?.status}
                    </span>
                  </div>
                  <p className="dv-sub">{v.card?.address}</p>
                  <p className="dv-sub">{v.card?.lic}</p>
                  <a href="DealerHostDetail.dc.html" onClick={v.card?.open} className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--m" style={{ textDecoration: "none", marginTop: "6px", justifyContent: "center" }} data-nav={v.card?.openNav}>View Host Details</a>
                </div>
              </div>
              </>
            ) : null}
          </div>
          <div className="lc-zoom" onClick={v.stop}>
            <button type="button" aria-label="Zoom in" onClick={v.zoomIn}><NTV.Icon name="plus" size={v.i14} /></button>
            <button type="button" aria-label="Zoom out" onClick={v.zoomOut}><NTV.Icon name="minus" size={v.i14} /></button>
            <button type="button" aria-label="Fit to results" onClick={v.fit}><NTV.Icon name="expand" size={v.i14} /></button>
          </div>
          <div className="lc-legend">
            {(v.legend || []).map((_g, $index) => (
              <React.Fragment key={$index}>
                <span className="dv-row" style={{ gap: "6px" }}>
                  <span className="dv-dot" style={{ background: `${s(_g?.color)}` }} />
                  {_g?.label}
                </span>
              </React.Fragment>
            ))}
            <span className="dv-row" style={{ gap: "6px" }}>
              <span style={{ width: "16px", borderTop: "2px dashed var(--accent-action)" }} />
              Your territory
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
));

export default Component;
