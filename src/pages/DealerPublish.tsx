// @ts-nocheck
/**
 * Page: Create Screen · 3 Publish  (route /screens/new/publish)
 * Converted from the Claude Design artboard DealerPublish.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { addNav, byId, draft, hostName, licsForHost, mediaEntries, navFn, peekNav, plByName, screenName, toast, toastVals, val, D } from '../lib/shared';
import ContentBlock from '../components/ContentBlock';
import ContentThumb from '../components/ContentThumb';
import DateCalendar from '../components/DateCalendar';
import DealerNav from '../components/DealerNav';
import LicenseRow from '../components/LicenseRow';
import ScreenPreview from '../components/ScreenPreview';
import './DealerPublish.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { hostQuery: '', host: '', pool: ['l94', 'l95', 'l96', 'l97'].map(function (id) { return byId(D.licenses, id).key; }), on: {}, dates: {}, modal: '', pending: '', dateTarget: '', dateDraft: null, reqCount: '', zone: 'main', toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state, d = draft();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var fmt = function (x) { return x ? months[x.m] + ' ' + x.d + ', ' + x.y : ''; };
    var host = byId(D.hosts, s.host);
    var label = function (h) { return h.name + ', ' + h.city + ', ' + h.state; };
    var q = (s.hostQuery || '').trim().toLowerCase();
    var hostMatches = D.hosts.filter(function (h) { return label(h).toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
    var assigned = host ? licsForHost(host.id) : [];
    var isOn = function (u) { return !!s.on[u]; };
    var setOn = function (u, v) { var o = Object.assign({}, self.state.on); if (v) o[u] = true; else delete o[u]; self.setState({ on: o }); };
    var row = function (u, locked) { return { uuid: u, locked: !!locked, on: isOn(u), date: fmt(s.dates[u]), dateOpen: s.dateTarget === u, dateValue: s.dates[u] || null, openDate: function () { self.setState({ dateTarget: self.state.dateTarget === u ? '' : u, dateDraft: self.state.dates[u] || null }); } }; };
    var hostRows = assigned.map(function (l) { var locked = !!l.screen || l.status === 'disabled'; var r = row(l.key, locked); r.toggle = function () { if (!locked) setOn(l.key, !self.state.on[l.key]); }; return r; });
    var poolRows = s.pool.map(function (u) { var r = row(u, false); r.toggle = function () { if (self.state.on[u]) setOn(u, false); else self.setState({ modal: 'confirmAssign', pending: u }); }; return r; });
    var selectable = assigned.filter(function (l) { return !l.screen && l.status !== 'disabled'; }).map(function (l) { return l.key; }).concat(s.pool);
    var onList = selectable.filter(isOn);
    var zoneLabels = { main: 'Main', vertical: 'Vertical', horizontal: 'Horizontal', background: 'Background', logo: 'Logo' };
    var zname = (d.zones || {})[zoneLabels[s.zone]];
    var pl = plByName(zname) || D.playlists[{ main: 0, vertical: 2, horizontal: 5, background: 4, logo: 1 }[s.zone] || 0];
    var n = parseInt(s.reqCount, 10), reqOk = !isNaN(n) && n >= 1 && n <= 50;
    var close = function () { self.setState({ modal: '', pending: '' }); };
    return {
      none: null, iconSm: 12, iconMd: 14, iconLg: 32, w500: 500, w460: 460, stepIndex: 2,
      steps: [{ label: 'Setup', state: 'done' }, { label: 'Assign Playlist to Zones', state: 'done' }, { label: 'Publish to Licenses' }],
      crumbs: [{ label: 'Screens', href: 'DealerScreens.dc.html' }, 'Create Screen'],
      screenName: d.name || 'Untitled Screen', screenDesc: d.desc || (d.type ? d.type + ' screen · ' + d.template : 'New screen'),
      hostQuery: s.hostQuery, setHostQuery: function (v) { self.setState({ hostQuery: val(v) }); },
      showHostList: q.length > 0 && !(host && s.hostQuery === label(host)),
      noHostMatch: hostMatches.length === 0,
      hostOptions: hostMatches.map(function (h) { var c = h.lic.length; return { name: h.name, address: h.address + ', ' + h.city + ', ' + h.state, count: c + (c === 1 ? ' license' : ' licenses'), pick: function () { self.setState({ host: h.id, hostQuery: label(h), on: {}, dateTarget: '' }); } }; }),
      noHost: !host, hasHost: !!host, hostName: host ? host.name : '',
      hostRows: hostRows, hostEmpty: hostRows.length === 0, poolRows: poolRows, poolEmpty: poolRows.length === 0,
      noneOn: onList.length === 0, onCount: onList.length,
      bulkOpen: s.dateTarget === 'bulk', popoverOpen: !!s.dateTarget,
      openBulkDate: function () { self.setState({ dateTarget: self.state.dateTarget === 'bulk' ? '' : 'bulk', dateDraft: null }); },
      closeDate: function () { self.setState({ dateTarget: '' }); },
      dateDraft: s.dateDraft,
      pickDate: function (x) { var ds = Object.assign({}, self.state.dates); if (self.state.dateTarget === 'bulk') onList.forEach(function (u) { ds[u] = x; }); else if (self.state.dateTarget) ds[self.state.dateTarget] = x; self.setState({ dates: ds, dateTarget: '', dateDraft: null }); },
      zone: s.zone, bgSelected: s.zone === 'background',
      selectZone: function (z) { self.setState({ zone: z }); },
      selectBackground: function () { self.setState({ zone: 'background' }); },
      pv: { name: pl.name, zoneLabel: zoneLabels[s.zone] || 'Main', entries: mediaEntries(pl.items, pl.block), open: navFn('DealerPlaylistDetail.dc.html', { id: pl.id }) },
      m: { confirmAssign: s.modal === 'confirmAssign', request: s.modal === 'request', success: s.modal === 'success' },
      closeModal: close,
      confirmAssign: function () { var o = Object.assign({}, self.state.on); if (self.state.pending) o[self.state.pending] = true; self.setState({ on: o, modal: '', pending: '' }); },
      openRequest: function () { self.setState({ modal: 'request', reqCount: '' }); },
      reqCount: s.reqCount, setReqCount: function (e) { self.setState({ reqCount: val(e) }); },
      reqInvalid: s.reqCount !== '' && !reqOk, reqDisabled: !reqOk,
      sendRequest: function () { self.setState({ modal: '' }); toast(self, 'Request for ' + n + ' license(s) sent to NTV360 Support'); },
      reload: function () { toast(self, D.hosts.length + ' hosts loaded', 'info'); },
      publish: function () { self.setState({ modal: 'success', dateTarget: '' }); },
      goDetail: navFn('DealerScreenDetail.dc.html', { id: 'new', host: s.host, count: onList.length }),
      toast: toastVals(s.toast, this)
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-publish" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="display" activeItem="Screens" />
      </div>
      <div className="dv-scroll">
        <div style={{ padding: "20px 20px 0" }}><NTV.Breadcrumbs items={v.crumbs} /></div>
        <main style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "1540px", margin: "0 auto", padding: "20px 20px 40px", boxSizing: "border-box" }}>
          <h1 style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", margin: "0" }}>Create Screen: Publish to Licenses</h1>
          <section className="dv-card" aria-label="Progress" style={{ overflowX: "auto" }}><NTV.Stepper steps={v.steps} current={v.stepIndex} style={{ width: "100%" }} /></section>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "20px" }}>
            <section className="dv-card" aria-labelledby="hosts-title" style={{ flex: "1 1 480px", maxWidth: "592px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between">
                <h2 id="hosts-title" className="dv-h2">Hosts</h2>
                <button type="button" className="dv-a" onClick={v.reload} style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: "400", fontSize: "14px" }}>
                  <span>Reload Hosts</span>
                  <NTV.Icon name="arrow-rotate-right" size={v.iconMd} />
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <NTV.Input size="l" placeholder="Enter Host Name" iconRight="magnifying-glass" label="Host name" value={v.hostQuery} onChange={v.setHostQuery} />
                {v.showHostList ? (
                  <>
                    <div role="listbox" aria-label="Hosts" className="dv-menu" style={{ left: "0", right: "0", top: "46px", maxHeight: "260px", overflowY: "auto" }}>
                    {(v.hostOptions || []).map((_h, $index) => (
                      <React.Fragment key={$index}>
                        <button type="button" role="option" aria-selected="false" className="host-opt dv-mi" onClick={_h?.pick} style={{ justifyContent: "space-between" }}>
                          <span style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontWeight: "600" }}>{_h?.name}</span>
                            <span className="dv-sub">{_h?.address}</span>
                          </span>
                          <span className="dv-sub" style={{ flex: "none" }}>{_h?.count}</span>
                        </button>
                      </React.Fragment>
                    ))}
                    {v.noHostMatch ? (
                      <>
                        <p className="dv-p" style={{ padding: "8px 14px" }}>No hosts found</p>
                      </>
                    ) : null}
                  </div>
                  </>
                ) : null}
              </div>
              <div style={{ flex: "1 1 auto", minHeight: "408px", display: "flex", flexDirection: "column", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)" }}>
                {v.noHost ? (
                  <>
                    <div className="dv-empty" style={{ flex: "1 1 auto" }}>
                    <span style={{ color: "var(--primary-700)" }}><NTV.Icon name="id-card" size={v.iconLg} /></span>
                    <p style={{ margin: "0" }}>
                      {"Select a "}
                      <strong style={{ color: "var(--fg-primary)" }}>Host</strong>
                      {" above to see available "}
                      <strong style={{ color: "var(--fg-primary)" }}>Licenses</strong>
                      .
                    </p>
                  </div>
                  </>
                ) : null}
                {v.hasHost ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px" }}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "40px", marginBottom: "8px" }}>
                      <div style={{ minWidth: "0" }}>
                        <h3 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "600", color: "var(--fg-secondary)" }}>Assigned Licenses</h3>
                        <p className="dv-sub" style={{ fontSize: "10px", lineHeight: "15px" }}>Licenses already on this host · locked ones play another screen</p>
                      </div>
                      <NTV.Button variant="primary" size="m" iconRight="calendar" disabled={v.noneOn} onClick={v.openBulkDate}>Bulk Set Installation Date</NTV.Button>
                      {v.bulkOpen ? (
                        <>
                          <div style={{ position: "absolute", right: "0", top: "40px", zIndex: "30", boxShadow: "var(--shadow-card)", borderRadius: "var(--radius-lg)" }}>
                          <div style={{ width: "320px" }}>
                            <DateCalendar value={v.dateDraft} onPick={v.pickDate} />
                          </div>
                        </div>
                        </>
                      ) : null}
                    </div>
                    {(v.hostRows || []).map((_r, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ position: "relative" }}>
                          <LicenseRow uuid={_r?.uuid} on={_r?.on} locked={_r?.locked} date={_r?.date} onToggle={_r?.toggle} onDate={_r?.openDate} />
                          {_r?.dateOpen ? (
                            <>
                              <div style={{ position: "absolute", right: "0", top: "36px", zIndex: "30", boxShadow: "var(--shadow-card)", borderRadius: "var(--radius-lg)" }}>
                              <div style={{ width: "320px" }}>
                                <DateCalendar value={_r?.dateValue} onPick={v.pickDate} />
                              </div>
                            </div>
                            </>
                          ) : null}
                        </div>
                      </React.Fragment>
                    ))}
                    {v.hostEmpty ? (
                      <>
                        <p className="dv-sub" style={{ padding: "6px 0" }}>
                        No licenses are assigned to this host yet. Switch on an unassigned license below to assign it.
                      </p>
                      </>
                    ) : null}
                    <div style={{ marginTop: "16px", marginBottom: "4px" }}>
                      <h3 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "600", color: "var(--fg-secondary)" }}>Unassigned Licenses</h3>
                      <p className="dv-sub" style={{ fontSize: "10px", lineHeight: "15px" }}>Your licenses not assigned to any host</p>
                    </div>
                    {(v.poolRows || []).map((_r, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ position: "relative" }}>
                          <LicenseRow uuid={_r?.uuid} on={_r?.on} locked={_r?.locked} date={_r?.date} onToggle={_r?.toggle} onDate={_r?.openDate} />
                          {_r?.dateOpen ? (
                            <>
                              <div style={{ position: "absolute", right: "0", top: "36px", zIndex: "30", boxShadow: "var(--shadow-card)", borderRadius: "var(--radius-lg)" }}>
                              <div style={{ width: "320px" }}>
                                <DateCalendar value={_r?.dateValue} onPick={v.pickDate} />
                              </div>
                            </div>
                            </>
                          ) : null}
                        </div>
                      </React.Fragment>
                    ))}
                    {v.poolEmpty ? (
                      <>
                        <p className="dv-sub" style={{ padding: "6px 0" }}>All of your licenses are assigned to hosts.</p>
                      </>
                    ) : null}
                    <button type="button" className="dv-a" onClick={v.openRequest} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px", fontWeight: "400", fontSize: "14px" }}>
                      <NTV.Icon name="plus" size={v.iconSm} />
                      <span>Request More Licenses</span>
                    </button>
                  </div>
                  </>
                ) : null}
              </div>
            </section>
            <div style={{ flex: "999 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <h2 className="dv-h2">{v.screenName}</h2>
                    <p className="dv-p" style={{ lineHeight: "20px" }}>{v.screenDesc}</p>
                  </div>
                  <button type="button" onClick={v.selectBackground} aria-pressed={v.bgSelected} style={{ display: "inline-flex", alignItems: "center", height: "28px", padding: "4px 8px", border: "0", borderRadius: "var(--radius-sm)", background: "#5273c0", color: "var(--white)", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", lineHeight: "20px", fontWeight: "500" }}>Select Background</button>
                </div>
                <ScreenPreview background="wood" selected={v.zone} onSelect={v.selectZone} />
              </div>
              <section className="dv-card" aria-labelledby="preview-title" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="dv-between">
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", minHeight: "32px" }}>
                    <h2 id="preview-title" className="dv-h2">Playlist Content Preview</h2>
                    <span className="dv-p" style={{ lineHeight: "20px" }}>
                      {"( "}
                      <a href="DealerPlaylistDetail.dc.html" onClick={v.pv?.open} style={{ textDecoration: "underline", textUnderlineOffset: "2px" }} data-nav={v.pv?.openNav}>{v.pv?.name}</a>
                      {" )"}
                    </span>
                  </div>
                  <p style={{ margin: "0", display: "flex", gap: "8px", fontSize: "16px", lineHeight: "24px" }}>
                    <span style={{ fontWeight: "600", color: "var(--fg-secondary)" }}>Showing</span>
                    <strong style={{ color: "var(--accent-action)" }}>{v.pv?.zoneLabel}</strong>
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", height: "152px", overflowX: "auto", overflowY: "hidden", paddingBottom: "12px", boxSizing: "border-box" }}>
                  {(v.pv?.entries || []).map((_e, $index) => (
                    <React.Fragment key={$index}>
                      {_e?.isBlock ? (
                        <>
                          <div style={{ flex: "none", height: "136px", display: "flex" }}>
                          <div style={{ height: "100%" }}>
                            <ContentBlock items={_e?.items} />
                          </div>
                        </div>
                        </>
                      ) : null}
                      {_e?.isThumb ? (
                        <>
                          <div style={{ flex: "none", width: "161px", height: "136px", display: "flex" }}>
                          <div style={{ width: "100%", height: "100%" }}>
                            <ContentThumb image={_e?.image} kind={_e?.kind} title={_e?.title} duration={_e?.duration} />
                          </div>
                        </div>
                        </>
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
              </section>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <a href="DealerAssignPlaylist.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--neutral ntv-btn--xl" style={{ minWidth: "100px", textDecoration: "none" }}>Back</a>
            <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.noneOn} onClick={v.publish} style={{ minWidth: "100px" }}>Publish Screen</NTV.Button>
          </div>
        </main>
      </div>
      {v.popoverOpen ? (
        <>
          <div aria-hidden="true" onClick={v.closeDate} style={{ position: "fixed", inset: "0", zIndex: "20" }} />
        </>
      ) : null}
      {v.m?.confirmAssign ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Assign License to Host" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              {"Assigning this license to the screen "}
              <strong style={{ color: "var(--fg-primary)" }}>“{v.screenName}”</strong>
              {" will also assign it to the host selected "}
              <strong style={{ color: "var(--fg-primary)" }}>“{v.hostName}”</strong>
              . Are you sure you want to continue?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.confirmAssign}>Proceed</NTV.Button>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.request ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Request More Licenses" width={v.w500} onClose={v.closeModal}>
            <p className="dv-sub" style={{ marginBottom: "16px" }}>
              Your request goes to NTV360 Support. Approved licenses appear under Unassigned Licenses.
            </p>
            <label htmlFor="req-count" className="dv-label">Number of licenses</label>
            <input id="req-count" className="dv-field" type="number" min="1" max="50" placeholder="1-50" value={v.reqCount} onChange={v.setReqCount} />
            {v.reqInvalid ? (
              <>
                <p style={{ margin: "6px 0 0", fontSize: "12px", lineHeight: "20px", color: "var(--danger-600)" }}>Enter a number from 1 to 50.</p>
              </>
            ) : null}
            <label htmlFor="req-note" className="dv-label" style={{ marginTop: "16px" }}>Note (Optional)</label>
            <textarea id="req-note" className="dv-field" placeholder="ex. New hosts opening in Northport next month" />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.reqDisabled} onClick={v.sendRequest}>Send Request</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.success ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="success" title="Screen Created" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              “{v.screenName}{"” is now playing on "}{v.onCount}{" license(s) at "}{v.hostName}.
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <a href="DealerScreenDetail.dc.html" onClick={v.goDetail} className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ minWidth: "100px", textDecoration: "none" }} data-nav={v.goDetailNav}>Ok</a>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      <Toast t={v.toast} />
    </div>
    </div>
));

export default Component;
