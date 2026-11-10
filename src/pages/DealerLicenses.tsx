// @ts-nocheck
/**
 * Page: Licenses  (route /licenses)
 * Converted from the Claude Design artboard DealerLicenses.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { STATUS, addNav, arrived, byId, contains, hostName, navFn, peekNav, plByName, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import HostAdvFilter from '../components/HostAdvFilter';
import FilterBy from '../components/FilterBy';

/* Mock player versions per license (the data has none yet). */
var SERVERS = ['2.9.35', '2.9.4', '2.9.41', '2.9.43'], UIS = ['3.0.44', '3.0.47', '3.0.48'];
var lnum = function (l) { return parseInt(String(l.id).slice(1), 10) || 0; };
var RECENT = new Date('Oct 10, 2026').getTime();
/* Each Filter by group is OR inside the group, AND across groups. */
var LIC_TESTS = {
  lic: { 'Assigned': function (l) { return !!l.host; }, 'Unassigned': function (l) { return !l.host; }, 'Inactive': function (l) { return l.status === 'disabled'; }, 'Recent Installs': function (l) { return !!l.host && new Date(l.install).getTime() >= RECENT; } },
  conn: { 'Online': function (l) { return l.status === 'online'; }, 'Offline': function (l) { return l.status === 'offline'; }, 'Display On': function (l) { return l.status === 'online'; }, 'Display Off': function (l) { return !!l.host && l.status !== 'online'; } },
  server: null, ui: null
};
var licPasses = function (f, l) {
  return Object.keys(f || {}).every(function (g) {
    var sel = f[g] || []; if (!sel.length) return true;
    if (g === 'server') return sel.indexOf(SERVERS[lnum(l) % SERVERS.length]) !== -1;
    if (g === 'ui') return sel.indexOf(UIS[lnum(l) % UIS.length]) !== -1;
    return sel.some(function (o) { return LIC_TESTS[g] && LIC_TESTS[g][o] ? LIC_TESTS[g][o](l) : true; });
  });
};
import './DealerLicenses.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerLicenses.dc.html') || {};
    this.state = { tz: '', filters: {}, range: 'Oct 10, 2026 – Nov 9, 2026', query: '', status: f.status || '', net: f.net || '', host: f.host || '', hostName: f.hostName || '', adv: '', filterOpen: false, limit: 25, req: false, reqCount: '', toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var L = D.licenses;
    var by = function (st) { return L.filter(function (l) { return l.status === st; }).length; };
    var tzOf = function (l) { return l.host ? 'US/Central' : '—'; };
    var base = L.filter(function (l) { return (!s.host || l.host === s.host) && (!s.net || l.net === s.net) && (!s.tz || s.tz === 'All Timezones' || tzOf(l) === s.tz) && licPasses(s.filters, l) && contains(l.alias + ' ' + l.key + ' ' + (l.host ? hostName(l.host) : '') + ' ' + l.anydesk, s.query); });
    var matches = base.filter(function (l) { return !s.status || l.status === s.status; });
    var vis = matches.slice(0, s.limit);
    var chipsOn = [];
    if (s.host) chipsOn.push({ label: 'Host: ' + s.hostName, clear: function () { self.setState({ host: '', hostName: '', adv: '' }); } });
    if (s.adv) chipsOn.push({ label: 'Advertiser: ' + s.adv, clear: function () { self.setState({ adv: '' }); } });
    if (s.status) chipsOn.push({ label: 'Status: ' + STATUS[s.status].label, clear: function () { self.setState({ status: '' }); } });
    if (s.net) chipsOn.push({ label: 'Internet: ' + (s.net === 'WiFi' ? 'Wi-Fi' : s.net), clear: function () { self.setState({ net: '' }); } });
    var copy = function (txt, what) { return function () { try { navigator.clipboard.writeText(txt); } catch (e) {} toast(self, what + ' copied', 'info'); }; };
    var n = parseInt(s.reqCount, 10);
    return {
      none: null, i10: 10, i12: 12, w500: 500,
      cols: '50px 80px minmax(200px, 1.4fr) minmax(170px, 1.2fr) 110px 120px 150px 150px 110px 120px 70px 140px 170px 110px',
      total: L.length,
      byType: { Ad: L.filter(function (l) { return l.type === 'Ad'; }).length, Menu: L.filter(function (l) { return l.type === 'Menu'; }).length, Closed: L.filter(function (l) { return l.type === 'Closed'; }).length },
      tzOptions: ['All Timezones', 'US/Central', 'US/Eastern'], tz: s.tz, setTz: function (v) { self.setState({ tz: val(v) }); },
      rangeOptions: ['Oct 10, 2026 – Nov 9, 2026', 'Last 7 days', 'Last 90 days', 'All time'], range: s.range, setRange: function (v) { self.setState({ range: val(v) }); },
      legend: ['offline', 'online', 'unassigned', 'ready', 'pending', 'disabled'].map(function (k) { return { label: STATUS[k].label, color: STATUS[k].color }; }),
      filterGroups: [
        { key: 'lic', title: 'Licenses Status', options: ['Assigned', 'Unassigned', 'Inactive', 'Recent Installs'] },
        { key: 'conn', title: 'Order by Licenses Status', options: ['Online', 'Offline', 'Display On', 'Display Off'] },
        { key: 'server', title: 'Player Server', options: SERVERS },
        { key: 'ui', title: 'Player UI', options: UIS }
      ],
      filters: s.filters, setFilters: function (x) { self.setState({ filters: x, limit: 25 }); },
      statusOptions: ['All Status'].concat(['online', 'offline', 'pending', 'ready', 'disabled', 'unassigned'].map(function (k) { return STATUS[k].label + ' (' + base.filter(function (l) { return l.status === k; }).length + ')'; })),
      statusValue: s.status ? STATUS[s.status].label + ' (' + base.filter(function (l) { return l.status === s.status; }).length + ')' : 'All Status',
      setStatus: function (v) { var x = val(v) || ''; var k = Object.keys(STATUS).filter(function (key) { return x.indexOf(STATUS[key].label) === 0; })[0] || ''; self.setState({ status: k, limit: 25 }); },
      chipsOn: chipsOn,
      query: s.query, setQuery: function (v) { self.setState({ query: val(v), limit: 25 }); },
      rows: vis.map(function (l, i) {
        var st = STATUS[l.status], on = l.status === 'online', sc = l.screen ? byId(D.screens, l.screen) : null, pl = sc ? plByName(sc.zones.Main) : null, m = pl ? byId(D.media, pl.items[0]) : null;
        var k = parseInt(l.id.slice(1), 10), hx = function (n) { return ('0' + ((k * n) % 256).toString(16)).slice(-2); };
        return { n: i + 1, alias: l.alias, keyShort: l.key.slice(0, 18) + '…', host: l.host ? hostName(l.host) : '—', tz: tzOf(l), color: st.color,
          hasShot: on && !!m, shot: m ? m.image : '', lastUpdate: l.host ? '11/0' + (1 + k % 9) + '/26 12:0' + (k % 10) + ' AM' : '—', lastStartup: l.host ? '11/0' + (1 + k % 9) + '/26 12:1' + (k % 10) + ' AM' : '—',
          up: on ? l.speed : '---', down: on ? (parseInt(l.speed, 10) + 4) + ' MB/s' : '---', speedTint: on ? 'var(--success-050)' : 'transparent', speedColor: on ? 'var(--success-600)' : 'var(--fg-secondary)',
          display: on ? 'ON' : 'OFF', mac: 'd8:3a:dd:' + hx(7) + ':' + hx(13) + ':' + hx(29), anydesk: l.anydesk.replace(/ /g, ''), pw: l.anypw, install: l.host ? l.install : '—',
          open: navFn('DealerLicenseDetail.dc.html', { id: l.id }),
          openHost: navFn('DealerHostDetail.dc.html', { id: l.host }),
          copyKey: copy(l.key, 'License key'), copyId: copy(l.anydesk.replace(/ /g, ''), 'AnyDesk ID'), copyPw: copy(l.anypw, 'AnyDesk password') };
      }),
      empty: vis.length === 0, shown: vis.length, matched: matches.length, hasMore: matches.length > vis.length,
      more: function () { self.setState({ limit: self.state.limit + 25 }); },
      filterOpen: s.filterOpen,
      openFilter: function () { self.setState({ filterOpen: true }); },
      closeFilter: function () { self.setState({ filterOpen: false }); },
      applyFilter: function (x) { self.setState({ filterOpen: false, host: x.host, hostName: x.hostName, adv: x.adv || '', limit: 25 }); },
      exportIt: function () { toast(self, 'Exporting ' + matches.length + ' licenses to Excel…', 'info'); },
      refresh: function () { toast(self, 'License statuses refreshed', 'info'); },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerLicenses.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-licenses" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Licenses" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between"><h1 className="dv-h1">Licenses</h1></div>
          <section aria-label="License totals" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }}>
            <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                  <NTV.IconTile icon="id-card" tone="danger" />
                  <div>
                    <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>Total Licenses</p>
                    <p className="dv-sub" style={{ fontSize: "11px" }}>All licenses you own</p>
                  </div>
                </div>
                <span style={{ fontSize: "26px", lineHeight: "36px", fontWeight: "700" }}>{v.total}</span>
              </div>
              <div className="dv-between" style={{ fontSize: "12px" }}>
                <span>
                  {"Ad "}
                  <strong style={{ color: "var(--warning-main)" }}>{v.byType?.Ad}</strong>
                </span>
                <span>
                  {"Menu "}
                  <strong style={{ color: "var(--info-main)" }}>{v.byType?.Menu}</strong>
                </span>
                <span>
                  {"Closed "}
                  <strong style={{ color: "var(--fg-secondary)" }}>{v.byType?.Closed}</strong>
                </span>
              </div>
            </div>
            <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                <NTV.IconTile icon="play" tone="danger" />
                <div>
                  <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>Player UI</p>
                  <p className="dv-sub" style={{ fontSize: "11px" }}>Version running on your players</p>
                </div>
              </div>
              <div className="dv-between" style={{ fontSize: "12px" }}>
                <span>
                  {"Current Version: "}
                  <strong>3.0.42</strong>
                </span>
                <span>
                  {"Date Created: "}
                  <strong>October 14, 2026</strong>
                </span>
                <span>
                  {"Time Posted: "}
                  <strong>10:17:14 AM</strong>
                </span>
              </div>
            </div>
            <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                <NTV.IconTile icon="network-wired" tone="danger" />
                <div>
                  <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>Player Server</p>
                  <p className="dv-sub" style={{ fontSize: "11px" }}>Server version your players sync with</p>
                </div>
              </div>
              <div className="dv-between" style={{ fontSize: "12px" }}>
                <span>
                  {"Current Version: "}
                  <strong>2.9.2</strong>
                </span>
                <span>
                  {"Date Created: "}
                  <strong>September 12, 2026</strong>
                </span>
                <span>
                  {"Time Posted: "}
                  <strong>10:17:14 AM</strong>
                </span>
              </div>
            </div>
          </section>
          <div className="dv-between">
            <div className="dv-row" style={{ flexWrap: "wrap", gap: "12px" }}>
              <FilterBy groups={v.filterGroups} value={v.filters} onChange={v.setFilters} />
              <div style={{ width: "210px", flex: "none" }}>
                <NTV.Select size="l" placeholder="Timezone" options={v.tzOptions} value={v.tz} onChange={v.setTz} />
              </div>
              <NTV.Button variant="secondary" size="xl" iconRight="user" onClick={v.openFilter}>Filter By User</NTV.Button>
              <div style={{ width: "220px", flex: "none" }}>
                <NTV.Select size="l" options={v.rangeOptions} value={v.range} onChange={v.setRange} />
              </div>
              {(v.chipsOn || []).map((_c, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className="dv-chip" aria-pressed="true" onClick={_c?.clear}>
                    <span>{_c?.label}</span>
                    <NTV.Icon name="x" size={v.i10} />
                  </button>
                </React.Fragment>
              ))}
            </div>
            <div className="dv-row" style={{ gap: "12px" }}>
              <NTV.Input size="l" placeholder="Search License Key/Alias or Host Location" iconLeft="magnifying-glass" iconRight="sparkles" label="Search licenses" value={v.query} onChange={v.setQuery} style={{ width: "380px", maxWidth: "100%" }} />
              <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
            </div>
          </div>
          <section className="dv-card" aria-label="Licenses Data" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="dv-between">
              <div className="dv-row" style={{ gap: "20px" }}>
                <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>Licenses Data</h2>
                <div className="dv-legend" aria-label="Legend">
                  {(v.legend || []).map((_g, $index) => (
                    <React.Fragment key={$index}>
                      <span>
                        <span className="dv-dot" style={{ background: `${s(_g?.color)}` }} />
                        {_g?.label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="dv-row">
                <NTV.IconButton icon="arrows-rotate" label="Refresh table" variant="secondary" size="m" onClick={v.refresh} />
                <NTV.IconButton icon="gear" label="Table settings" variant="secondary" size="m" />
              </div>
            </div>
            <div className="dv-table">
              <div role="table" aria-label="Licenses" style={{ minWidth: "2010px" }}>
                <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.cols)}` }}>
                  <div style={{ textAlign: "center" }}>#</div>
                  <div>Screenshot</div>
                  <div>License Key</div>
                  <div>Host</div>
                  <div>Timezone</div>
                  <div>Alias</div>
                  <div>Last Update</div>
                  <div>Last Startup</div>
                  <div>Upload Speed</div>
                  <div>Download Speed</div>
                  <div>Display</div>
                  <div>MAC Address</div>
                  <div>Anydesk</div>
                  <div>Install Date</div>
                </div>
                {(v.rows || []).map((_r, $index) => (
                  <React.Fragment key={$index}>
                    <div role="row" className="dv-tr" style={{ gridTemplateColumns: `${s(v.cols)}`, boxShadow: `inset 4px 0 0 ${s(_r?.color)}`, minHeight: "52px" }}>
                      <div style={{ textAlign: "center" }}>{_r?.n}</div>
                      <div>
                        <span className="dv-thumb" style={{ display: "block", width: "44px", height: "28px", background: "var(--primary-100)" }}>
                          {_r?.hasShot ? (
                            <>
                              <img src={_r?.shot} alt="" />
                            </>
                          ) : null}
                        </span>
                      </div>
                      <div className="dv-row" style={{ gap: "6px" }}>
                        <span className="dv-dot" style={{ background: `${s(_r?.color)}` }} />
                        <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)", overflow: "hidden", textOverflow: "ellipsis" }} href="DealerLicenseDetail.dc.html" onClick={_r?.open} data-nav={_r?.openNav}>{_r?.keyShort}</a>
                        <button type="button" className="dv-ib" style={{ width: "22px", height: "22px", color: "var(--accent-action)" }} aria-label="Copy license key" onClick={_r?.copyKey}><NTV.Icon name="copy" size={v.i12} /></button>
                      </div>
                      <div>
                        <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerHostDetail.dc.html" onClick={_r?.openHost} data-nav={_r?.openHostNav}>{_r?.host}</a>
                      </div>
                      <div>{_r?.tz}</div>
                      <div>{_r?.alias}</div>
                      <div>{_r?.lastUpdate}</div>
                      <div>{_r?.lastStartup}</div>
                      <div>
                        <span className="dv-pill" style={{ height: "20px", fontSize: "10px", background: `${s(_r?.speedTint)}`, color: `${s(_r?.speedColor)}` }}>{_r?.up}</span>
                      </div>
                      <div>
                        <span className="dv-pill" style={{ height: "20px", fontSize: "10px", background: `${s(_r?.speedTint)}`, color: `${s(_r?.speedColor)}` }}>{_r?.down}</span>
                      </div>
                      <div>{_r?.display}</div>
                      <div>{_r?.mac}</div>
                      <div style={{ lineHeight: "16px" }}>
                        <div className="dv-row" style={{ gap: "4px" }}>
                          <span>{"ID - "}{_r?.anydesk}</span>
                          <button type="button" className="dv-ib" style={{ width: "18px", height: "18px" }} aria-label="Copy AnyDesk ID" onClick={_r?.copyId}><NTV.Icon name="copy" size={v.i10} /></button>
                        </div>
                        <div className="dv-row" style={{ gap: "4px" }}>
                          <span>{"PW - "}{_r?.pw}</span>
                          <button type="button" className="dv-ib" style={{ width: "18px", height: "18px" }} aria-label="Copy AnyDesk password" onClick={_r?.copyPw}><NTV.Icon name="copy" size={v.i10} /></button>
                        </div>
                      </div>
                      <div>{_r?.install}</div>
                    </div>
                  </React.Fragment>
                ))}
                {v.empty ? (
                  <>
                    <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No licenses match these filters.</div>
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
      <HostAdvFilter open={v.filterOpen} onApply={v.applyFilter} onClose={v.closeFilter} />
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
