// @ts-nocheck
/**
 * Page: Screen Details  (route /screens/detail)
 * Converted from the Claude Design artboard DealerScreenDetail.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, arrived, byId, draft, hostName, licsForHost, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import LicenseTableRow from '../components/LicenseTableRow';
import PushFlow from '../components/PushFlow';
import ScreenPreview from '../components/ScreenPreview';
import TemplateCard from '../components/TemplateCard';
import ZoneListItem from '../components/ZoneListItem';
import './DealerScreenDetail.css';

/* ============================== Logic ============================== */

var TEMPLATES = [
  { id: 'nct-standard', title: 'NCT Standard Template', zones: ['Main', 'Vertical', 'Horizontal', 'Background'] },
  { id: 'standard-v2', title: 'Standard Template V2', zones: ['Main', 'Vertical', 'Horizontal', 'Logo', 'Background'] },
  { id: 'fullscreen', title: 'Fullscreen', zones: ['Main', 'Background'] },
  { id: 'test', title: 'Test Template', zones: ['Main', 'Background'] },
  { id: 'two-one', title: '2-1 Zone', zones: ['Upper Left', 'Lower Left', 'Main', 'Background'] },
  { id: 'one-one', title: '1 to 1 Zone', zones: ['Left', 'Middle', 'Right', 'Horizontal', 'Background'] }
];
function tplByTitle(t) { for (var i = 0; i < TEMPLATES.length; i++) if (TEMPLATES[i].title === t) return TEMPLATES[i]; return TEMPLATES[1]; }
function zid(label) { return label.toLowerCase().replace(/\s+/g, '-'); }
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerScreenDetail.dc.html') || {};
    var sc;
    if (f.id === 'new') {
      var d = draft(), h = byId(D.hosts, f.host) || D.hosts[0];
      sc = { id: 'new', name: d.name || 'Untitled Screen', desc: d.desc || '', host: h.id, type: d.type || 'Ad', template: d.template || 'Standard Template V2', created: 'Nov 9, 2026', createdBy: 'Ibanez Lighting Inc.', demo: false, zones: d.zones || {}, lic: licsForHost(h.id).filter(function (l) { return !l.screen; }).slice(0, f.count || 1).map(function (l) { return l.id; }) };
      if (!sc.lic.length) sc.lic = ['l94'];
    } else {
      sc = byId(D.screens, f.id) || (props.demo ? byId(D.screens, 's6') : D.screens[0]);
    }
    var tpl = tplByTitle(sc.template);
    var pls = {}; tpl.zones.forEach(function (z) { pls[zid(z)] = sc.zones[z] || (z === 'Logo' ? 'Shopee Mart Deals' : ''); });
    var lic = function (id) { var l = byId(D.licenses, id); return { id: l.id, key: l.key, alias: l.alias, internet: l.net || 'LAN', speed: l.speed, online: l.status === 'online', on: true }; };
    var spare = licsForHost(sc.host).filter(function (l) { return !l.screen && sc.lic.indexOf(l.id) === -1; }).map(function (l) { return l.id; }).concat(['l95', 'l96', 'l97']);
    this.state = {
      sc: sc, title: sc.name, desc: sc.desc || ('This screen plays at ' + hostName(sc.host) + '.'), type: sc.type, notes: '', template: tpl.id,
      licenses: sc.demo ? [] : sc.lic.map(lic), spare: sc.demo ? [] : spare.map(lic),
      playlists: pls, zone: '', expanded: '', dirty: false, modal: '', sel: {}, push: false,
      ct: { step: 0, tpl: tpl.id, map: {} }, clone: { name: '', desc: '', type: '', host: '' }, doneTitle: '', doneText: '', toast: null
    };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state, sc = s.sc;
    var demo = !!sc.demo;
    var edit = function (k) { return function (v) { var o = { dirty: true }; o[k] = val(v); self.setState(o); }; };
    var tpl = TEMPLATES.filter(function (t) { return t.id === s.template; })[0];
    var plNames = D.playlists.map(function (p) { return p.name; });
    var zoneList = tpl.zones.map(function (label) {
      var id = zid(label);
      return { label: label, playlistName: s.playlists[id] || '', expanded: !demo && s.expanded === id, selected: s.zone === id,
        toggle: function () { if (demo) { self.setState({ zone: id }); return; } if (self.state.expanded === id) self.setState({ expanded: '' }); else self.setState({ expanded: id, zone: id }); },
        options: plNames.map(function (n) { return { name: n, pick: function () { var p = Object.assign({}, self.state.playlists); p[id] = n; self.setState({ playlists: p, expanded: '', dirty: true }); } }; }) };
    });
    var lic = s.licenses;
    var onCount = lic.filter(function (l) { return l.on; }).length;
    var check = function (k) { return function () { var a = Object.assign({}, self.state.sel); if (a[k]) delete a[k]; else a[k] = true; self.setState({ sel: a }); }; };
    var cl = s.clone;
    var setCl = function (k) { return function (v) { var c = Object.assign({}, self.state.clone); c[k] = val(v); self.setState({ clone: c }); }; };
    var close = function () { self.setState({ modal: '' }); };
    // change template wizard
    var ctTpl = TEMPLATES.filter(function (t) { return t.id === s.ct.tpl; })[0];
    var ctAssigned = ctTpl.zones.filter(function (z) { return !!s.ct.map[zid(z)]; }).length;
    var ct = {
      step: s.ct.step, isPick: s.ct.step === 0, isAssign: s.ct.step === 1, name: ctTpl.title,
      steps: [{ label: 'Select Template', state: s.ct.step > 0 ? 'done' : undefined }, { label: 'Assign Playlist to Zones' }],
      assigned: ctAssigned, total: ctTpl.zones.length,
      zones: ctTpl.zones.map(function (z) { var id = zid(z), v = s.ct.map[id] || ''; return { label: z, value: v, color: v ? 'var(--success-main)' : 'var(--primary-300)', icon: v ? 'circle-check' : 'circle-info',
        set: function (x) { var m = Object.assign({}, self.state.ct.map); m[id] = val(x); self.setState({ ct: Object.assign({}, self.state.ct, { map: m }) }); } }; }),
      backLabel: s.ct.step === 0 ? 'Cancel' : 'Back', nextLabel: s.ct.step === 0 ? 'Next' : 'Apply Template',
      blocked: s.ct.step === 1 && ctAssigned < ctTpl.zones.length,
      back: function () { if (self.state.ct.step === 0) close(); else self.setState({ ct: Object.assign({}, self.state.ct, { step: 0 }) }); },
      next: function () {
        if (self.state.ct.step === 0) {
          var t = TEMPLATES.filter(function (x) { return x.id === self.state.ct.tpl; })[0], m = {};
          t.zones.forEach(function (z) { m[zid(z)] = self.state.playlists[zid(z)] || ''; });
          self.setState({ ct: { step: 1, tpl: t.id, map: m } });
        } else {
          self.setState({ template: self.state.ct.tpl, playlists: self.state.ct.map, modal: '', zone: '', expanded: '', dirty: true });
          toast(self, 'Template changed to ' + ctTpl.title + '. Save to push it to your licenses.', 'info');
        }
      }
    };
    return {
      none: null, yes: true, iconSm: 12, iconMd: 14, iconLg: 32, w460: 460, w521: 521, w700: 700, w900: 900,
      demo: demo, notDemo: !demo,
      crumbs: [{ label: 'Screens', href: 'DealerScreens.dc.html' }, s.title || 'Screen'],
      title: s.title, desc: s.desc, type: s.type, notes: s.notes, created: sc.created, createdBy: sc.createdBy,
      infoSub: demo ? 'Read only' : 'Edit Screen Data',
      hostName: demo ? 'N/A' : hostName(sc.host), hasHost: !demo,
      openHost: navFn('DealerHostDetail.dc.html', { id: sc.host }),
      templateName: tpl.title,
      previewHint: demo ? 'Click a zone to see its playlist' : 'Click a zone to edit its playlist',
      zonesHint: demo ? 'Zones of ' + tpl.title + ' and their playlists' : 'Below are the zones of ' + tpl.title + '. Click a Zone to edit its Playlist',
      typeOptions: ['Ad', 'Menu', 'Announcement'],
      typeOpen: !!s.typeOpen, i12: 12, i14: 14,
      toggleType: function () { self.setState({ typeOpen: !self.state.typeOpen }); },
      closeType: function () { self.setState({ typeOpen: false }); },
      typeKey: function (e) { if (e.key === 'Escape') self.setState({ typeOpen: false }); },
      typeItems: ['Ad', 'Menu', 'Announcement'].map(function (t) { return { label: t, on: s.type === t, pick: function () { self.setState({ typeOpen: false }); edit('type')(t); } }; }),
      setTitle: edit('title'), setDesc: edit('desc'), setType: edit('type'), setNotes: edit('notes'),
      clean: !s.dirty,
      save: function () { if (onCount === 0) { self.setState({ dirty: false }); toast(self, 'Screen saved'); } else self.setState({ push: true }); },
      pushOpen: s.push,
      pushTargets: lic.filter(function (l) { return l.on; }).map(function (l) { return { alias: l.alias, willFail: !l.online }; }),
      closePush: function () { self.setState({ push: false }); },
      pushDone: function () { self.setState({ dirty: false }); },
      bgSelected: s.zone === 'background',
      selectBackground: function () { self.setState({ zone: 'background', expanded: demo ? '' : 'background' }); },
      withLogo: s.template === 'standard-v2',
      zone: s.zone || 'none',
      selectZone: function (z) { self.setState({ zone: z, expanded: demo ? '' : z }); },
      zoneList: zoneList,
      licTitleColor: demo ? 'var(--fg-secondary)' : 'var(--fg-primary)',
      playingText: demo ? 'N/A' : 'Playing in ' + onCount + ' license(s)',
      licTone: demo ? 'ghost' : 'default',
      cannotUnassign: demo || lic.length === 0,
      licRows: lic.map(function (l, i) {
        return { n: i + 1, key: l.key, alias: l.alias, internet: l.internet, speed: l.speed, online: l.online, on: l.on,
          toggle: function () { self.setState({ licenses: self.state.licenses.map(function (x) { return x.key === l.key ? Object.assign({}, x, { on: !x.on }) : x; }), dirty: true }); } };
      }),
      licEmpty: lic.length === 0, onCount: onCount,
      m: { assign: s.modal === 'assign', unassign: s.modal === 'unassign', clone: s.modal === 'clone', template: s.modal === 'template', delete: s.modal === 'delete', done: s.modal === 'done' },
      closeModal: close,
      openAssign: function () { self.setState({ modal: 'assign', sel: {} }); },
      openUnassign: function () { self.setState({ modal: 'unassign', sel: {} }); },
      assignChecks: s.spare.map(function (l) { return { label: l.alias + ' · ' + l.key, checked: !!s.sel[l.key], toggle: check(l.key) }; }),
      noneToAssign: s.spare.length === 0,
      selNone: Object.keys(s.sel).length === 0,
      confirmAssign: function () { var sel = self.state.sel; self.setState({ licenses: self.state.licenses.concat(self.state.spare.filter(function (l) { return sel[l.key]; })), spare: self.state.spare.filter(function (l) { return !sel[l.key]; }), modal: '', sel: {}, dirty: true }); },
      unassignChecks: lic.map(function (l) { return { label: l.alias + ' · ' + l.key, checked: !!s.sel[l.key], toggle: check(l.key) }; }),
      confirmUnassign: function () { var sel = self.state.sel; self.setState({ licenses: self.state.licenses.filter(function (l) { return !sel[l.key]; }), spare: self.state.spare.concat(self.state.licenses.filter(function (l) { return sel[l.key]; })), modal: '', sel: {}, dirty: true }); },
      openClone: function () { self.setState({ modal: 'clone', clone: { name: self.state.title + ' (Copy)', desc: '', type: self.state.type, host: '' } }); },
      hostOptions: D.hosts.map(function (h) { return h.name; }),
      cl: { name: cl.name, desc: cl.desc, type: cl.type, host: cl.host, blocked: !(cl.name.trim() && cl.type && cl.host),
        setName: setCl('name'), setDesc: setCl('desc'), setType: setCl('type'), setHost: setCl('host') },
      confirmClone: function () { self.setState({ modal: 'done', doneTitle: 'Screen Cloned', doneText: '“' + self.state.clone.name + '” was created for ' + self.state.clone.host + '. Assign licenses to it from its details page.' }); },
      openTemplate: function () { self.setState({ modal: 'template', ct: { step: 0, tpl: self.state.template, map: {} } }); },
      templateOptions: TEMPLATES.map(function (t) { return { title: t.title, description: t.zones.length + ' zones: ' + t.zones.join(', '), layout: t.id, selected: s.ct.tpl === t.id, pick: function () { self.setState({ ct: Object.assign({}, self.state.ct, { tpl: t.id }) }); } }; }),
      plOptions: plNames,
      ct: ct,
      openDelete: function () { self.setState({ modal: 'delete' }); },
      doneTitle: s.doneTitle, doneText: s.doneText,
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerScreenDetail.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-screen-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="display" activeItem="Screens" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <NTV.Breadcrumbs items={v.crumbs} />
          {v.demo ? (
            <>
              <div className="dv-note" style={{ alignItems: "center" }}>
              <NTV.Icon name="lock" size={v.iconSm} />
              <span>
                <strong>View only.</strong>
                {" This is a demo screen shared by NTV360. You can preview it and clone it, but you can’t edit, save or delete it."}
              </span>
            </div>
            </>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div style={{ minWidth: "0" }}>
              <div className="dv-row" style={{ gap: "10px" }}>
                <h1 className="dv-h2">{v.title}</h1>
                {v.demo ? (
                  <>
                    <span className="dv-pill" style={{ background: "var(--purple-main)", color: "var(--white)" }}>Demo Screen</span>
                  </>
                ) : null}
              </div>
              <p style={{ margin: "0", fontSize: "16px", lineHeight: "24px", color: "var(--fg-secondary)" }}>{v.desc}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <NTV.Button variant="secondary" size="xl" iconRight="copy" onClick={v.openClone}>Clone Screen</NTV.Button>
              {v.notDemo ? (
                <>
                  <NTV.Button variant="danger" size="xl" iconRight="trash" onClick={v.openDelete}>Delete Screen</NTV.Button>
                  <NTV.Button variant="primary" size="xl" iconRight="floppy-disk" disabled={v.clean} onClick={v.save}>Save</NTV.Button>
                </>
              ) : null}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "stretch" }}>
            <section className="dv-card" aria-labelledby="info-title" style={{ flex: "1 1 560px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <h2 id="info-title" className="dv-h2">Screen Information</h2>
                <p className="dv-sub">{v.infoSub}</p>
              </div>
              <div>
                <label className="dv-label" htmlFor="sd-title">Screen Title</label>
                <input id="sd-title" className="dv-field" value={v.title} disabled={v.demo} onChange={v.setTitle} />
              </div>
              <div>
                <label className="dv-label" htmlFor="sd-desc">Description</label>
                <input id="sd-desc" className="dv-field" value={v.desc} disabled={v.demo} onChange={v.setDesc} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
                <div>
                  <span className="dv-label" id="sd-type-label">Screen Type</span>
                  {v.notDemo ? (
                    <div className="sd-type" onKeyDown={v.typeKey}>
                      <button type="button" className={'dv-field sd-type__trigger' + (v.typeOpen ? ' is-open' : '')} aria-haspopup="listbox" aria-expanded={v.typeOpen} aria-labelledby="sd-type-label" onClick={v.toggleType}>
                        <span>{v.type}</span>
                        <NTV.Icon name={v.typeOpen ? 'angle-up' : 'angle-down'} size={v.i14} />
                      </button>
                      {v.typeOpen ? (
                        <>
                          <div aria-hidden="true" className="sd-type__backdrop" onClick={v.closeType} />
                          <div className="ntv-menu sd-type__menu" role="listbox" aria-labelledby="sd-type-label">
                            {(v.typeItems || []).map((_o) => (
                              <button key={_o.label} type="button" role="option" aria-selected={_o.on} className={'ntv-option' + (_o.on ? ' is-selected' : '')} onClick={_o.pick}>
                                <span>{_o.label}</span>
                                {_o.on ? <NTV.Icon name="check" size={v.i12} /> : null}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                  {v.demo ? (
                    <>
                      <input className="dv-field" value={v.type} disabled={v.yes} aria-label="Screen Type" />
                    </>
                  ) : null}
                </div>
                <div>
                  <label className="dv-label" htmlFor="sd-pub">Published By</label>
                  <input id="sd-pub" className="dv-field" value={v.createdBy} disabled={v.yes} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="sd-host">Host</label>
                  <input id="sd-host" className="dv-field" value={v.hostName} disabled={v.yes} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
                <div>
                  <label className="dv-label" htmlFor="sd-tpl">Template</label>
                  <input id="sd-tpl" className="dv-field" value={v.templateName} disabled={v.yes} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="sd-date">Created</label>
                  <input id="sd-date" className="dv-field" value={v.created} disabled={v.yes} />
                </div>
              </div>
              <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
                <label className="dv-label" htmlFor="sd-notes">Notes</label>
                <textarea id="sd-notes" className="dv-field" rows="4" disabled={v.demo} onChange={v.setNotes} style={{ flex: "1 1 auto", minHeight: "100px" }} value={v.notes} />
              </div>
              {v.hasHost ? (
                <>
                  <a className="dv-a" href="DealerHostDetail.dc.html" onClick={v.openHost} style={{ alignSelf: "flex-start", fontSize: "14px" }} data-nav={v.openHostNav}>{"View host: "}{v.hostName}{" →"}</a>
                </>
              ) : null}
            </section>
            <section aria-labelledby="preview-title" style={{ flex: "1 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h2 id="preview-title" className="dv-h2">Screen Preview</h2>
                  <p className="dv-sub">{v.templateName}{" · 1920 × 1080 · "}{v.previewHint}</p>
                </div>
                <button type="button" aria-pressed={v.bgSelected} onClick={v.selectBackground} style={{ display: "inline-flex", alignItems: "center", height: "28px", padding: "4px 8px", border: "0", borderRadius: "var(--radius-sm)", background: "#5273c0", color: "var(--white)", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", lineHeight: "20px", fontWeight: "500" }}>Select Background</button>
              </div>
              <ScreenPreview background="wood" withLogo={v.withLogo} selected={v.zone} onSelect={v.selectZone} />
            </section>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "stretch" }}>
            <section className="dv-card" aria-labelledby="lic-title" style={{ flex: "1 1 560px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between">
                <div>
                  <h2 id="lic-title" className="dv-h2" style={{ color: `${s(v.licTitleColor)}` }}>License List</h2>
                  <p className="dv-sub">{v.playingText}</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <NTV.Button variant="primary" tone={v.licTone} size="xl" iconRight="minus" disabled={v.cannotUnassign} onClick={v.openUnassign}>Unassign Licenses</NTV.Button>
                  <NTV.Button variant="primary" tone={v.licTone} size="xl" iconRight="plus" disabled={v.demo} onClick={v.openAssign}>Assign Licenses</NTV.Button>
                </div>
              </div>
              {v.notDemo ? (
                <>
                  <div className="dv-table" style={{ maxHeight: "330px" }}>
                  <div role="table" aria-label="Licenses" style={{ minWidth: "760px" }}>
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: "46px minmax(0, 1fr) 150px 130px 115px 80px" }}>
                      <div style={{ textAlign: "center" }}>#</div>
                      <div>License Key</div>
                      <div>Alias</div>
                      <div>Internet Type</div>
                      <div>Internet Speed</div>
                      <div>Action</div>
                    </div>
                    {(v.licRows || []).map((_l, $index) => (
                      <React.Fragment key={$index}>
                        <LicenseTableRow n={_l?.n} licenseKey={_l?.key} alias={_l?.alias} internet={_l?.internet} speed={_l?.speed} online={_l?.online} on={_l?.on} onToggle={_l?.toggle} />
                      </React.Fragment>
                    ))}
                    {v.licEmpty ? (
                      <>
                        <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>This screen isn’t assigned to any licenses. Use Assign Licenses to add some.</div>
                      </>
                    ) : null}
                  </div>
                </div>
                </>
              ) : null}
              {v.demo ? (
                <>
                  <div className="dv-empty" style={{ flex: "1 1 auto", minHeight: "240px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ color: "var(--primary-700)" }}><NTV.Icon name="tv" size={v.iconLg} /></span>
                  <p style={{ margin: "0" }}>
                    Demo screens don’t play on licenses. Clone it to make your own copy you can publish.
                  </p>
                </div>
                </>
              ) : null}
            </section>
            <section className="dv-card" aria-labelledby="tpl-title" style={{ flex: "1 1 560px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h2 id="tpl-title" className="dv-h2">{v.templateName}</h2>
                  <p className="dv-sub">{v.zonesHint}</p>
                </div>
                {v.notDemo ? (
                  <>
                    <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.openTemplate}>Change Template</NTV.Button>
                  </>
                ) : null}
              </div>
              <div className="sd-zones" style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "1 1 0", minHeight: "320px", overflowY: "auto", paddingRight: "4px" }}>
                {(v.zoneList || []).map((_z, $index) => (
                  <React.Fragment key={$index}>
                    <ZoneListItem label={_z?.label} playlist={_z?.playlistName} expanded={_z?.expanded} selected={_z?.selected} playlists={_z?.options} onToggle={_z?.toggle} />
                  </React.Fragment>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <PushFlow open={v.pushOpen} subject="screen" targets={v.pushTargets} onClose={v.closePush} onDone={v.pushDone} />
      {v.m?.assign ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Assign Licenses" width={v.w521} onClose={v.closeModal}>
            <p className="dv-sub" style={{ marginBottom: "16px" }}>
              {"Check the licenses you want to assign. Only licenses on "}{v.hostName}{" or unassigned ones are listed."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "260px", overflowY: "auto", padding: "16px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-app)" }}>
              {(v.assignChecks || []).map((_c, $index) => (
                <React.Fragment key={$index}>
                  <NTV.Checkbox checked={_c?.checked} label={_c?.label} onChange={_c?.toggle} />
                </React.Fragment>
              ))}
              {v.noneToAssign ? (
                <>
                  <p className="dv-sub">No free licenses. Request more from the Licenses page.</p>
                </>
              ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.selNone} onClick={v.confirmAssign}>Assign Licenses</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.unassign ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Unassign Licenses" width={v.w521} onClose={v.closeModal}>
            <p className="dv-sub" style={{ marginBottom: "16px" }}>Check the licenses you want to unassign</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "260px", overflowY: "auto", padding: "16px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-app)" }}>
              {(v.unassignChecks || []).map((_c, $index) => (
                <React.Fragment key={$index}>
                  <NTV.Checkbox checked={_c?.checked} label={_c?.label} onChange={_c?.toggle} />
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.selNone} onClick={v.confirmUnassign}>Unassign Licenses</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.clone ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={`You are cloning “${s(v.title)}”`} width={v.w700} onClose={v.closeModal}>
            <p className="dv-sub" style={{ marginBottom: "16px" }}>Fill the basic information to continue with the cloning process</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <NTV.FormField label="Screen Name">
                <NTV.Input size="l" placeholder="Enter Screen Name" label="Screen Name" value={v.cl?.name} onChange={v.cl?.setName} />
              </NTV.FormField>
              <NTV.FormField label="Description (Optional)">
                <NTV.Input size="l" placeholder="ex. This screen is used for Medicine" label="Description" value={v.cl?.desc} onChange={v.cl?.setDesc} />
              </NTV.FormField>
              <NTV.FormField label="Click to Select a Screen Type">
                <NTV.Select size="l" placeholder="Select" options={v.typeOptions} value={v.cl?.type} onChange={v.cl?.setType} />
              </NTV.FormField>
              <NTV.FormField label="Select Host">
                <NTV.Select size="l" placeholder="Select a host" options={v.hostOptions} value={v.cl?.host} onChange={v.cl?.setHost} />
              </NTV.FormField>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.cl?.blocked} onClick={v.confirmClone}>Proceed</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.template ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Change Template" width={v.w900} onClose={v.closeModal}>
            <div style={{ marginBottom: "16px" }}>
              <NTV.Stepper steps={v.ct?.steps} current={v.ct?.step} style={{ width: "100%" }} />
            </div>
            {v.ct?.isPick ? (
              <>
                <p className="dv-sub" style={{ marginBottom: "12px" }}>Choose the new layout. You’ll assign playlists to its zones next.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", maxHeight: "56vh", overflowY: "auto" }}>
                {(v.templateOptions || []).map((_t, $index) => (
                  <React.Fragment key={$index}>
                    <TemplateCard title={_t?.title} description={_t?.description} layout={_t?.layout} selected={_t?.selected} onSelect={_t?.pick} />
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
            {v.ct?.isAssign ? (
              <>
                <div className="dv-between" style={{ marginBottom: "12px" }}>
                <p className="dv-sub">
                  {"Assign a playlist to every zone of "}
                  <strong style={{ color: "var(--fg-primary)" }}>{v.ct?.name}</strong>
                  . Zones with the same name keep their playlist.
                </p>
                <div role="status" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "6px 12px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "600", color: "var(--accent-action)" }}>{v.ct?.assigned}{" / "}{v.ct?.total}</span>
                  <span className="dv-p" style={{ lineHeight: "20px" }}>Zones Assigned</span>
                </div>
              </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "50vh", overflowY: "auto" }}>
                {(v.ct?.zones || []).map((_z, $index) => (
                  <React.Fragment key={$index}>
                    <div className="ct-zone">
                      <span style={{ fontSize: "14px", lineHeight: "24px", fontWeight: "700" }}>{_z?.label}</span>
                      <NTV.Select size="l" placeholder="Select a playlist" options={v.plOptions} value={_z?.value} onChange={_z?.set} />
                      <span style={{ color: `${s(_z?.color)}`, display: "inline-flex" }}><NTV.Icon name={_z?.icon} size={v.iconMd} /></span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.ct?.back}>{v.ct?.backLabel}</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.ct?.blocked} onClick={v.ct?.next}>{v.ct?.nextLabel}</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.delete ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Warning!" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              {"Delete "}
              <strong style={{ color: "var(--fg-primary)" }}>{v.title}</strong>
              {"? It will stop playing on "}{v.onCount}{" license(s). This can’t be undone."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <a href="DealerScreens.dc.html" className="ntv-btn ntv-btn--danger ntv-btn--xl" style={{ textDecoration: "none" }}>Delete</a>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.done ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="success" title={v.doneTitle} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.doneText}</p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.closeModal} style={{ minWidth: "100px" }}>Ok</NTV.Button>
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
