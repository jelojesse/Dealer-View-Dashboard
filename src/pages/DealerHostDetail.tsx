// @ts-nocheck
/**
 * Page: Host Details  (route /hosts/detail)
 * Converted from the Claude Design artboard DealerHostDetail.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { STATUS, addNav, advsForHost, arrived, byId, contains, hostName, navFn, peekNav, plByName, screenName, toast, toastVals, val, D } from '../lib/shared';
import DateCalendar from '../components/DateCalendar';
import DealerNav from '../components/DealerNav';
import FilterBy, { passes } from '../components/FilterBy';
import PushFlow from '../components/PushFlow';
import './DealerHostDetail.css';

/* ============================== Logic ============================== */

var HCOL = { Active: ['var(--success-main)', 'var(--success-050)'], Inactive: ['var(--danger-main)', 'var(--danger-050)'] };
var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerHostDetail.dc.html') || {};
    var h;
    if (f.id === 'new') { var n = {}; try { n = JSON.parse(localStorage.getItem('ntvHost') || '{}'); } catch (e) {} h = Object.assign({ id: 'new', category: 'Restaurant', status: 'Active', photo: D.B.steak, hours: 'Open 24 hours', dma: 'Birmingham (Ann & Tusc)', networks: [{ name: 'Retail Vision', on: false }], lat: 33.2, lng: -87.5, lic: [] }, n); }
    else h = byId(D.hosts, f.id) || D.hosts[0];
    var lic = D.licenses.filter(function (l) { return l.host === h.id; }).map(function (l) { return Object.assign({}, l); });
    this.state = { sel: {}, licQ: '', contentQ: '', advQ: '', licF: {}, contentF: {}, advF: {}, assignSel: {}, h: Object.assign({}, h), lic: lic, tab: 'License', modal: f.edit ? 'edit' : '', edit: null, pending: '', dateFor: '', push: false, toast: null };
    if (f.edit) this.state.edit = this.makeEdit(h);
  }
  makeEdit(h) { return { tab: 'details', active: h.status !== 'Inactive', name: h.name, category: h.category, address: h.address, city: h.city, state: h.state, zip: h.zip, closed: { Sunday: h.hours !== 'Open 24 hours' } }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state, h = s.h;
    var advs = h.id === 'new' ? [] : advsForHost(h.id);
    var content = D.media.filter(function (m) { return m.host === h.id || advs.some(function (a) { return a.id === m.adv; }); });
    if (content.length < 16) { var hi = parseInt(String(h.id).slice(1), 10) || 0; var rest = D.media.filter(function (m) { return content.indexOf(m) === -1 && m.kind !== 'widget'; }); for (var ci = 0; content.length < 16 && ci < rest.length; ci++) content.push(rest[(hi * 7 + ci) % rest.length]); content = content.filter(function (m, i, a) { return a.indexOf(m) === i; }); }
    var e = s.edit || this.makeEdit(h);
    var setE = function (k) { return function (v) { var o = Object.assign({}, self.state.edit); o[k] = typeof v === 'boolean' ? v : val(v); self.setState({ edit: o }); }; };
    var col = HCOL[h.status] || HCOL.Active;
    var deact = s.edit && !s.edit.active && h.status !== 'Inactive';
    return {
      none: null, i12: 12, i14: 14, w460: 460, w640: 640,
      crumbs: [{ label: 'Hosts', href: 'DealerHosts.dc.html' }, h.name],
      h: { name: h.name, photo: h.photo, status: h.status, color: col[0], tint: col[1], category: h.category, hours: 'Monday - ' + h.hours, hoursList: DAYS.map(function (d, i) { return { day: d, text: h.hours === 'Open 24 hours' ? 'Open 24 hours' : (i === 6 ? 'Closed' : '8:00 AM – 10:00 PM'), today: i === 0 }; }), dma: h.dma,
        full: h.address + ', ' + h.city + ', ' + h.state + ' ' + h.zip, coords: Number(h.lat).toFixed(4) + ', ' + Number(h.lng).toFixed(4) },
      licCount: s.lic.length,
      onlineCount: s.lic.filter(function (l) { return l.status === 'online'; }).length,
      offlineCount: s.lic.filter(function (l) { return l.status === 'offline'; }).length,
      advCount: advs.length,
      tabs: ['License', 'Content', 'Advertisers'].map(function (t) { return { label: t, on: s.tab === t, pick: function () { self.setState({ tab: t }); } }; }),
      yes: true, i10: 10,
      tags: (D.assign.filter(function (a) { return a.kind === 'Host' && a.ref === h.id; })[0] || { tags: ['t1', 't7'] }).tags.map(function (t) { var tg = byId(D.tags, t); var c = { info: 'var(--info-main)', warning: 'var(--warning-main)', teal: 'var(--teal-main)', success: 'var(--success-400)', purple: 'var(--purple-main)', accent: 'var(--accent-action)', hotpink: 'var(--hot-pink-main)' }; return { name: tg ? tg.name : t, color: c[tg ? tg.color : 'info'] }; }),
      usage: s.lic.filter(function (l) { return l.screen; }).length, newly: Math.min(2, s.lic.length),
      selCount: Object.keys(s.sel).filter(function (k) { return s.sel[k]; }).length,
      selLabel: (function (n) { return n ? n + ' selected' : 'Select licenses to unassign'; })(Object.keys(s.sel).filter(function (k) { return s.sel[k]; }).length),
      openUnassign: function () { var ids = Object.keys(self.state.sel).filter(function (k) { return self.state.sel[k]; }); if (!ids.length) { toast(self, 'Select a license first', 'warning'); return; } self.setState({ modal: 'unassign', pending: ids }); },
      openAssign: function () { self.setState({ modal: 'assign', assignSel: {} }); },
      assignable: D.licenses.filter(function (l) { return !l.host && !s.lic.some(function (x) { return x.id === l.id; }); }).map(function (l) { return { id: l.id, alias: l.alias, key: l.key, type: l.type, checked: !!s.assignSel[l.id], toggle: function () { var o = Object.assign({}, self.state.assignSel); o[l.id] = !o[l.id]; self.setState({ assignSel: o }); } }; }),
      assignCount: Object.keys(s.assignSel).filter(function (k) { return s.assignSel[k]; }).length,
      doAssign: function () {
        var ids = Object.keys(self.state.assignSel).filter(function (k) { return self.state.assignSel[k]; });
        var add = D.licenses.filter(function (l) { return ids.indexOf(l.id) !== -1; }).map(function (l) { return Object.assign({}, l, { host: h.id, status: 'ready' }); });
        self.setState({ lic: self.state.lic.concat(add), modal: '', assignSel: {} });
        toast(self, add.length + ' license(s) assigned to ' + h.name);
      },
      licFilterGroups: [
        { key: 'status', title: 'Status', options: ['Online', 'Offline', 'Pending Install', 'Ready for Pairing', 'Disabled'] },
        { key: 'type', title: 'Type', options: ['Ad', 'Menu', 'Closed', 'Announcement'] }
      ],
      licF: s.licF, setLicF: function (x) { self.setState({ licF: x }); },
      contentFilterGroups: [{ key: 'kind', title: 'Content Type', options: ['Video', 'Image', 'Widget'] }],
      contentF: s.contentF, setContentF: function (x) { self.setState({ contentF: x }); },
      licQ: s.licQ, setLicQ: function (v) { self.setState({ licQ: val(v) }); },
      contentQ: s.contentQ, setContentQ: function (v) { self.setState({ contentQ: val(v) }); },
      exportIt: function () { toast(self, 'Exporting licenses to Excel…', 'info'); },
      refresh: function () { toast(self, 'License statuses refreshed', 'info'); },
      tab: { lic: s.tab === 'License', content: s.tab === 'Content', adv: s.tab === 'Advertisers' },
      lcols: '40px 46px 80px minmax(260px, 1.6fr) 120px 70px minmax(150px, 1fr) 100px 100px 140px 160px 160px 130px 150px',
      licRows: s.lic.filter(function (l) { return contains(l.key + ' ' + l.alias, s.licQ) && passes(s.licF, 'status', (STATUS[l.status] || {}).label) && passes(s.licF, 'type', l.type); }).map(function (l, i) {
        var st = STATUS[l.status], on = l.status === 'online', sc = l.screen ? byId(D.screens, l.screen) : null, pl = sc ? plByName(sc.zones.Main) : null, mm = pl ? byId(D.media, pl.items[0]) : null, k = parseInt(l.id.slice(1), 10), hx = function (n) { return ('0' + ((k * n) % 256).toString(16)).slice(-2); };
        return { checked: !!s.sel[l.id], toggle: function () { var o = Object.assign({}, self.state.sel); o[l.id] = !o[l.id]; self.setState({ sel: o }); }, hasShot: on && !!mm, shot: mm ? mm.image : '', quality: on ? 'Good' : '—', mac: 'd8:3a:dd:' + hx(7) + ':' + hx(13) + ':' + hx(29), startup: on ? 'Nov 0' + (1 + k % 9) + ', 2026 9:10 PM' : '—', disconnected: l.status === 'offline' ? 'Nov 0' + (1 + k % 9) + ', 2026 11:42 AM' : (on ? 'Oct ' + (10 + k % 18) + ', 2026 6:05 AM' : '—'), request: l.request || '—', n: i + 1, alias: l.alias, key: l.key, status: st.label, color: st.color, type: l.type, screen: l.screen ? screenName(l.screen) : '—', net: l.net === 'WiFi' ? 'wlan' : (l.net ? 'eth0' : '—'), install: l.install, dateOpen: s.dateFor === l.id,
          open: navFn('DealerLicenseDetail.dc.html', { id: l.id }),
          openScreen: navFn('DealerScreenDetail.dc.html', { id: l.screen }),
          openDate: function () { self.setState({ dateFor: self.state.dateFor === l.id ? '' : l.id }); },
          unassign: function () { self.setState({ modal: 'unassign', pending: l.id }); } };
      }),
      noLic: s.lic.length === 0,
      legend: ['offline', 'online', 'ready', 'pending', 'disabled'].filter(function (k) { return s.lic.some(function (l) { return l.status === k; }); }).map(function (k) { return { label: STATUS[k].label, color: STATUS[k].color }; }),
      dateOpen: !!s.dateFor,
      closeDate: function () { self.setState({ dateFor: '' }); },
      stop: function (ev) { if (ev && ev.stopPropagation) ev.stopPropagation(); },
      dateAlias: (byId(s.lic, s.dateFor) || {}).alias || '',
      pickDate: function (d) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var txt = months[d.m] + ' ' + d.d + ', ' + d.y, id = self.state.dateFor;
        self.setState({ lic: self.state.lic.map(function (l) { return l.id === id ? Object.assign({}, l, { install: txt }) : l; }), dateFor: '' });
        toast(self, 'Install date set to ' + txt);
      },
      openAllLic: navFn('DealerLicenses.dc.html', { host: h.id, hostName: h.name }),
      content: content.filter(function (m) { return contains(m.title, s.contentQ) && passes(s.contentF, 'kind', m.kind.charAt(0).toUpperCase() + m.kind.slice(1)); }).map(function (m) { var B = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] }[m.kind] || ['IMAGE', 'var(--info-main)']; return { image: m.image, title: m.title, badge: B[0], badgeColor: B[1] }; }),
      contentCount: content.length, noContent: content.length === 0,
      openMedia: navFn('DealerMedia.dc.html', { host: h.id, hostName: h.name }),
      advQ: s.advQ, setAdvQ: function (v) { self.setState({ advQ: val(v) }); },
      advF: s.advF, setAdvF: function (x) { self.setState({ advF: x }); },
      advFilterGroups: [
        { key: 'category', title: 'Category', options: advs.map(function (a) { return a.category; }).filter(function (c, i, arr) { return arr.indexOf(c) === i; }).sort() },
        { key: 'status', title: 'Status', options: ['Active', 'Inactive'] }
      ],
      acols: '50px minmax(220px, 2fr) 1fr 1fr 80px 100px 110px',
      advRows: advs.filter(function (a) { return contains(a.name + ' ' + a.category + ' ' + a.city, s.advQ) && passes(s.advF, 'category', a.category) && passes(s.advF, 'status', a.status); }).map(function (a, i) {
        return { n: i + 1, name: a.name, category: a.category, city: a.city, state: a.state, content: D.media.filter(function (m) { return m.adv === a.id; }).length, status: a.status, color: a.status === 'Active' ? 'var(--success-main)' : 'var(--danger-main)', created: a.created, open: navFn('DealerAdvertiserDetail.dc.html', { id: a.id }) };
      }),
      noAdv: advs.length === 0,
      networks: (h.networks || []).map(function (n, i) { return { name: n.name, label: n.on ? 'Enabled' : 'Disabled', color: n.on ? 'var(--success-600)' : 'var(--fg-secondary)', tint: n.on ? 'var(--success-050)' : 'var(--primary-100)', slots: n.on ? (6 - i * 2) + ' slots' : '—' }; }),
      pushOpen: s.push,
      pushTargets: s.lic.filter(function (l) { return l.screen; }).map(function (l) { return { alias: l.alias, willFail: l.status !== 'online' }; }),
      openPush: function () { self.setState({ push: true }); },
      closePush: function () { self.setState({ push: false }); },
      pushDone: function () {},
      m: { edit: s.modal === 'edit', confirmSave: s.modal === 'confirmSave', unassign: s.modal === 'unassign', assign: s.modal === 'assign', delete: s.modal === 'delete' },
      closeModal: function () { self.setState({ modal: '' }); },
      openEdit: function () { self.setState({ modal: 'edit', edit: self.makeEdit(self.state.h) }); },
      categories: ['Restaurant', 'Cafe', 'Auto Service', 'Gym', 'Pharmacy', 'Dental', 'Salon', 'Grocery', 'Bar', 'Laundry', 'Retail', 'Hotel', 'Veterinary', 'Clinic', 'Bakery'],
      e: {
        details: e.tab === 'details', hours: e.tab === 'hours',
        toDetails: function () { setE('tab')('details'); }, toHours: function () { setE('tab')('hours'); },
        active: e.active, activeLabel: e.active ? 'Active' : 'Inactive', setActive: function (on) { setE('active')(typeof on === 'boolean' ? on : !self.state.edit.active); },
        name: e.name, category: e.category, address: e.address, city: e.city, state: e.state, zip: e.zip,
        setName: setE('name'), setCategory: setE('category'), setAddress: setE('address'), setCity: setE('city'), setState: setE('state'), setZip: setE('zip'),
        invalid: !(e.name && e.name.trim() && e.address && e.address.trim()),
        days: DAYS.map(function (d) { var c = !!(e.closed || {})[d]; return { day: d, closed: c, open: '08:00', close: '22:00', toggle: function () { var o = Object.assign({}, self.state.edit), cl = Object.assign({}, o.closed); cl[d] = !cl[d]; o.closed = cl; self.setState({ edit: o }); } }; })
      },
      askSave: function () { self.setState({ modal: 'confirmSave' }); },
      backToEdit: function () { self.setState({ modal: 'edit' }); },
      saveTitle: deact ? 'Deactivate Host?' : 'Update Host?',
      saveText: deact ? h.name + ' will be set to Inactive. Its ' + s.lic.length + ' license(s) stay assigned but the host is hidden from new screens and the Locator.' : 'Save the changes to ' + h.name + '? Updated details show on its licenses and the Locator right away.',
      doSave: function () {
        var x = self.state.edit;
        self.setState({ h: Object.assign({}, self.state.h, { name: x.name, category: x.category, address: x.address, city: x.city, state: x.state, zip: x.zip, status: x.active ? (self.state.h.status === 'Inactive' ? 'Active' : self.state.h.status) : 'Inactive' }), modal: '' });
        toast(self, deact ? 'Host deactivated' : 'Host details updated');
      },
      pendingAlias: (function (ids) { ids = [].concat(ids || []); return ids.length === 1 ? ((byId(s.lic, ids[0]) || {}).alias || '') : ids.length + ' licenses'; })(s.pending),
      doUnassign: function () { var ids = [].concat(self.state.pending || []), a = ids.length === 1 ? byId(self.state.lic, ids[0]).alias : ids.length + ' licenses'; var sel = Object.assign({}, self.state.sel); ids.forEach(function (id) { delete sel[id]; }); self.setState({ lic: self.state.lic.filter(function (l) { return ids.indexOf(l.id) === -1; }), sel: sel, modal: '', pending: '' }); toast(self, a + ' unassigned from ' + h.name); },
      openDelete: function () { self.setState({ modal: 'delete' }); },
      del: s.lic.length ? { can: false, status: 'error', title: 'Can’t Delete Host', cancel: 'Close', text: h.name + ' still has ' + s.lic.length + ' license(s) assigned. Unassign them in the License tab first, then delete the host.' }
        : { can: true, status: 'warning', title: 'Delete Host?', cancel: 'Cancel', text: 'Delete ' + h.name + '? Its content and history will be removed. This can’t be undone.' },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerHostDetail.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-host-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Hosts" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <NTV.Breadcrumbs items={v.crumbs} />
          <section className="dv-card dv-hd" style={{ padding: "24px" }}>
            <span className="dv-avatar"><img src={v.h?.photo} alt="" /></span>
            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="dv-between" style={{ alignItems: "flex-start" }}>
                <div>
                  <h1 className="dv-h2" style={{ fontSize: "22px", lineHeight: "32px" }}>{v.h?.name}</h1>
                  <span className="dv-row" style={{ gap: "6px", fontSize: "12px", color: `${s(v.h?.color)}` }}>
                    <span className="dv-dot" style={{ background: `${s(v.h?.color)}` }} />
                    {v.h?.status}
                  </span>
                </div>
                <NTV.Button variant="primary" size="xl" iconRight="gear" onClick={v.openEdit}>Modify</NTV.Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.6fr 1.6fr", gap: "12px 24px" }}>
                <div className="dv-kv2">
                  <span>Assigned Dealer</span>
                  <span>Ibanez Lighting Inc.</span>
                </div>
                <div className="dv-kv2">
                  <span>Created by</span>
                  <span>Ibanez Lighting Inc.</span>
                </div>
                <div className="dv-kv2">
                  <span>Address</span>
                  <span>{v.h?.full}</span>
                </div>
                <div className="dv-kv2">
                  <span>Business Hours</span>
                  <span className="hd-hrs" tabIndex={0}>
                    <span className="dv-row" style={{ gap: "4px" }}>
                      {v.h?.hours}{" "}
                      <NTV.Icon name="angle-down" size={v.i10} />
                    </span>
                    <span className="hd-hrs__pop" role="tooltip">
                      {(v.h?.hoursList || []).map((_d) => (
                        <span key={_d.day} className={"hd-hrs__row" + (_d.today ? " is-today" : "")}>
                          <span>{_d.day}</span>
                          <span>{_d.text}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                </div>
                <div className="dv-kv2">
                  <span>Category</span>
                  <span>{v.h?.category}</span>
                </div>
                <div className="dv-kv2">
                  <span>DMA</span>
                  <span>{v.h?.dma}</span>
                </div>
                <div className="dv-kv2">
                  <span>Notes</span>
                  <span>N/A</span>
                </div>
                <div className="dv-kv2">
                  <span>Tags</span>
                  <span className="dv-row" style={{ gap: "6px", flexWrap: "wrap", marginTop: "2px" }}>
                    {(v.tags || []).map((_t, $index) => (
                      <React.Fragment key={$index}>
                        <span className="dv-tagpill" style={{ background: `${s(_t?.color)}` }}>{_t?.name}</span>
                      </React.Fragment>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }}>
            <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                  <NTV.IconTile icon="chart-simple" tone="success" />
                  <div>
                    <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>License Status</p>
                    <p className="dv-sub" style={{ fontSize: "11px" }}>Overview of all active, inactive, and unassigned licenses.</p>
                  </div>
                </div>
                <span style={{ fontSize: "26px", lineHeight: "36px", fontWeight: "700" }}>{v.licCount}</span>
              </div>
              <div className="dv-between" style={{ fontSize: "12px" }}>
                <span>
                  {"Online "}
                  <strong style={{ color: "var(--success-main)" }}>{v.onlineCount}</strong>
                </span>
                <span>
                  {"Offline "}
                  <strong style={{ color: "var(--danger-main)" }}>{v.offlineCount}</strong>
                </span>
              </div>
            </div>
            <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                  <NTV.IconTile icon="chart-simple" tone="info" />
                  <div>
                    <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>License Usage Trend</p>
                    <p className="dv-sub" style={{ fontSize: "11px" }}>Tracks license usage growth or decline compared to last week.</p>
                  </div>
                </div>
                <span style={{ fontSize: "26px", lineHeight: "36px", fontWeight: "700" }}>{v.usage}</span>
              </div>
              <div className="dv-between" style={{ fontSize: "12px" }}>
                <span className="dv-row" style={{ gap: "8px" }}>
                  {"Last Week "}
                  <NTV.Trend direction="down">-8.3%</NTV.Trend>
                </span>
                <span className="dv-row" style={{ gap: "8px" }}>
                  {"This Week "}
                  <NTV.Trend direction="up">+8.3%</NTV.Trend>
                </span>
              </div>
            </div>
            <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                  <NTV.IconTile icon="arrows-rotate" tone="teal" />
                  <div>
                    <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>Newly Activated</p>
                    <p className="dv-sub" style={{ fontSize: "11px" }}>Licenses connected to a screen this week.</p>
                  </div>
                </div>
                <span style={{ fontSize: "26px", lineHeight: "36px", fontWeight: "700" }}>{v.newly}</span>
              </div>
              <div className="dv-between" style={{ fontSize: "12px" }}>
                <span className="dv-row" style={{ gap: "8px" }}>
                  {"Last Week "}
                  <NTV.Trend direction="down">-8.3%</NTV.Trend>
                </span>
                <span className="dv-row" style={{ gap: "8px" }}>
                  {"This Week "}
                  <NTV.Trend direction="up">+8.3%</NTV.Trend>
                </span>
              </div>
            </div>
          </section>
          <div className="dv-tabs" role="tablist">
            {(v.tabs || []).map((_t, $index) => (
              <React.Fragment key={$index}>
                <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick} style={{ minWidth: "120px" }}>{_t?.label}</button>
              </React.Fragment>
            ))}
          </div>
          {v.tab?.lic ? (
            <>
              <div className="dv-between">
              <div className="dv-row">
                <FilterBy groups={v.licFilterGroups} value={v.licF} onChange={v.setLicF} />
                <NTV.Button variant="secondary" size="xl" iconLeft="barcode" onClick={v.openAssign}>Assign License</NTV.Button>
                <span className="dv-sub">{v.selLabel}</span>
              </div>
              <div className="dv-row">
                <NTV.Input size="l" placeholder="Search License Key or Alias" iconLeft="magnifying-glass" iconRight="sparkles" label="Search licenses" value={v.licQ} onChange={v.setLicQ} style={{ width: "380px" }} />
                <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
                <NTV.Button variant="secondary" size="xl" iconRight="link-simple-slash" disabled={!v.selCount} onClick={v.openUnassign}>Unassign</NTV.Button>
              </div>
            </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between">
                <div className="dv-row" style={{ gap: "20px" }}>
                  <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>License Data</h2>
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
                <div role="table" aria-label="Host licenses" style={{ minWidth: "1800px" }}>
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.lcols)}` }}>
                    <div />
                    <div style={{ textAlign: "center" }}>#</div>
                    <div>Screenshot</div>
                    <div>License Key</div>
                    <div>License Alias</div>
                    <div>Type</div>
                    <div>Screen</div>
                    <div>Internet Type</div>
                    <div>Internet Speed</div>
                    <div>MAC Address</div>
                    <div>Last Startup</div>
                    <div>Last Disconnected</div>
                    <div>Installation Date</div>
                    <div>Install Request Date</div>
                  </div>
                  {(v.licRows || []).map((_l, $index) => (
                    <React.Fragment key={$index}>
                      <div role="row" className="dv-tr" style={{ gridTemplateColumns: `${s(v.lcols)}`, boxShadow: `inset 4px 0 0 ${s(_l?.color)}`, minHeight: "52px" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <NTV.Checkbox checked={_l?.checked} onChange={_l?.toggle} ariaLabel="Select license" />
                        </div>
                        <div style={{ textAlign: "center" }}>{_l?.n}</div>
                        <div>
                          <span className="dv-thumb" style={{ display: "block", width: "44px", height: "28px", background: "var(--primary-100)" }}>
                            {_l?.hasShot ? (
                              <>
                                <img src={_l?.shot} alt="" />
                              </>
                            ) : null}
                          </span>
                        </div>
                        <div className="dv-row" style={{ gap: "6px" }}>
                          <span className="dv-dot" style={{ background: `${s(_l?.color)}` }} />
                          <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)", overflow: "hidden", textOverflow: "ellipsis" }} href="DealerLicenseDetail.dc.html" onClick={_l?.open} data-nav={_l?.openNav}>{_l?.key}</a>
                        </div>
                        <div>{_l?.alias}</div>
                        <div>{_l?.type}</div>
                        <div>
                          <a className="dv-a" style={{ fontWeight: "500" }} href="DealerScreenDetail.dc.html" onClick={_l?.openScreen} data-nav={_l?.openScreenNav}>{_l?.screen}</a>
                        </div>
                        <div>{_l?.net}</div>
                        <div>{_l?.quality}</div>
                        <div>{_l?.mac}</div>
                        <div>{_l?.startup}</div>
                        <div>{_l?.disconnected}</div>
                        <div className="dv-row" style={{ gap: "4px" }}>
                          {_l?.install}
                          <button type="button" className="dv-ib" style={{ width: "22px", height: "22px", color: "var(--accent-action)" }} aria-label="Edit install date" onClick={_l?.openDate}><NTV.Icon name="pencil" size={v.i10} /></button>
                        </div>
                        <div>{_l?.request}</div>
                      </div>
                    </React.Fragment>
                  ))}
                  {v.noLic ? (
                    <>
                      <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No licenses on this host.</div>
                    </>
                  ) : null}
                </div>
              </div>
            </section>
            </>
          ) : null}
          {v.tab?.content ? (
            <>
              <div className="dv-between">
              <FilterBy groups={v.contentFilterGroups} value={v.contentF} onChange={v.setContentF} />
              <NTV.Input size="l" placeholder="Search Content Name" iconLeft="magnifying-glass" label="Search content" value={v.contentQ} onChange={v.setContentQ} style={{ width: "380px" }} />
            </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>
                {"Host Contents "}
                <span className="dv-sub" style={{ display: "inline", fontWeight: "400" }}>({v.contentCount})</span>
              </h2>
              <div className="dv-grid" style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))", gap: "12px" }}>
                {(v.content || []).map((_c, $index) => (
                  <React.Fragment key={$index}>
                    <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "0 0 0 1px var(--container-border)" }}>
                      <div className="dv-thumb" style={{ aspectRatio: "16 / 10", borderRadius: "0" }}>
                        <img src={_c?.image} alt="" />
                        <span style={{ position: "absolute", left: "6px", top: "6px", padding: "0 6px", borderRadius: "4px", background: "#fff", fontSize: "9px", lineHeight: "16px", fontWeight: "700", color: `${s(_c?.badgeColor)}` }}>{_c?.badge}</span>
                      </div>
                      <div style={{ padding: "6px 8px", fontSize: "11px", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_c?.title}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {v.noContent ? (
                <>
                  <div className="dv-empty">No content for this host yet.</div>
                </>
              ) : null}
            </section>
            </>
          ) : null}
          {v.tab?.adv ? (
            <>
              <div className="dv-between">
                <FilterBy groups={v.advFilterGroups} value={v.advF} onChange={v.setAdvF} />
                <NTV.Input size="l" placeholder="Search Advertiser Name, Category or City" iconLeft="magnifying-glass" label="Search advertisers" value={v.advQ} onChange={v.setAdvQ} style={{ width: "380px" }} />
              </div>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="dv-row" style={{ gap: "20px" }}>
                  <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>
                    {"Advertisers Data "}
                    <span className="dv-sub" style={{ display: "inline", fontWeight: "400" }}>({v.advCount})</span>
                  </h2>
                  <div className="dv-legend" aria-label="Legend">
                    <span><span className="dv-dot" style={{ background: "var(--success-main)" }} />Active</span>
                    <span><span className="dv-dot" style={{ background: "var(--danger-main)" }} />Inactive</span>
                  </div>
                </div>
                <div className="dv-table">
                  <div role="table" aria-label="Host advertisers" style={{ minWidth: "900px" }}>
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: v.acols }}>
                      <div style={{ textAlign: "center" }}>#</div>
                      <div>Advertiser Name</div>
                      <div>Category</div>
                      <div>City</div>
                      <div>State</div>
                      <div>Content</div>
                      <div>Date Created</div>
                    </div>
                    {(v.advRows || []).map((_a) => (
                      <div key={_a.n} role="row" className="dv-tr" style={{ gridTemplateColumns: v.acols, boxShadow: `inset 4px 0 0 ${_a.color}` }}>
                        <div style={{ textAlign: "center" }}>{_a.n}</div>
                        <div><a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerAdvertiserDetail.dc.html" onClick={_a.open} data-nav={_a.openNav}>{_a.name}</a></div>
                        <div>{_a.category}</div>
                        <div>{_a.city}</div>
                        <div>{_a.state}</div>
                        <div>{_a.content}</div>
                        <div>{_a.created}</div>
                      </div>
                    ))}
                    {!(v.advRows || []).length ? (
                      <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>{v.noAdv ? "No advertisers at this host yet." : "No advertisers match your filters."}</div>
                    ) : null}
                  </div>
                </div>
              </section>
            </>
          ) : null}
        </main>
      </div>
      <PushFlow open={v.pushOpen} subject="host" targets={v.pushTargets} onClose={v.closePush} onDone={v.pushDone} />
      {v.dateOpen ? (
        <>
          <div className="dv-ov" onClick={v.closeDate}>
          <div onClick={v.stop} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ margin: "0", color: "var(--white)", fontSize: "14px", lineHeight: "20px", fontWeight: "600" }}>{"Install date · "}{v.dateAlias}</p>
            <div style={{ boxShadow: "var(--shadow-card)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ width: "320px" }}>
                <DateCalendar onPick={v.pickDate} />
              </div>
            </div>
          </div>
        </div>
        </>
      ) : null}
      {v.m?.edit ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Edit Host" width={v.w640} onClose={v.closeModal}>
            <div className="dv-between" style={{ marginBottom: "8px" }}>
              <div className="dv-tabs" role="tablist" style={{ flex: "1", borderBottom: "0" }}>
                <button type="button" role="tab" className="dv-tab" aria-selected={v.e?.details} onClick={v.e?.toDetails}>Details</button>
                <button type="button" role="tab" className="dv-tab" aria-selected={v.e?.hours} onClick={v.e?.toHours}>Business Hours</button>
              </div>
              <div className="dv-row" style={{ gap: "10px" }}>
                <span className="dv-p" style={{ fontSize: "14px" }}>{v.e?.activeLabel}</span>
                <NTV.Switch checked={v.e?.active} onChange={v.e?.setActive} label="Host active" />
              </div>
            </div>
            {v.e?.details ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                <div style={{ gridColumn: "1 / 3" }}>
                  <label className="dv-label" htmlFor="eh-name">Host Name</label>
                  <input id="eh-name" className="dv-field" value={v.e?.name} onChange={v.e?.setName} />
                </div>
                <div>
                  <span className="dv-label">Category</span>
                  <NTV.Select size="l" options={v.categories} value={v.e?.category} onChange={v.e?.setCategory} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="eh-zip">ZIP</label>
                  <input id="eh-zip" className="dv-field" value={v.e?.zip} onChange={v.e?.setZip} />
                </div>
                <div style={{ gridColumn: "1 / 3" }}>
                  <label className="dv-label" htmlFor="eh-addr">Address</label>
                  <input id="eh-addr" className="dv-field" value={v.e?.address} onChange={v.e?.setAddress} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="eh-city">City</label>
                  <input id="eh-city" className="dv-field" value={v.e?.city} onChange={v.e?.setCity} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="eh-state">State</label>
                  <input id="eh-state" className="dv-field" value={v.e?.state} onChange={v.e?.setState} />
                </div>
              </div>
              </>
            ) : null}
            {v.e?.hours ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(v.e?.days || []).map((_d, $index) => (
                  <React.Fragment key={$index}>
                    <div className="hd-hours">
                      <strong style={{ fontSize: "14px" }}>{_d?.day}</strong>
                      <input className="dv-field" type="time" value={_d?.open} disabled={_d?.closed} aria-label="Opens" />
                      <input className="dv-field" type="time" value={_d?.close} disabled={_d?.closed} aria-label="Closes" />
                      <NTV.Checkbox checked={_d?.closed} label="Closed" onChange={_d?.toggle} />
                    </div>
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.openDelete}>Delete Host</button>
              <div className="dv-row">
                <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
                <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.e?.invalid} onClick={v.askSave}>Update</NTV.Button>
              </div>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.confirmSave ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title={v.saveTitle} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.saveText}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.backToEdit}>Back</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.doSave}>Confirm</NTV.Button>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.assign ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Assign License" width={v.w640} onClose={v.closeModal}>
            <p className="dv-sub" style={{ margin: "-8px 0 16px" }}>{"Pick unassigned licenses to add to "}{v.h?.name}</p>
            <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", maxHeight: "300px", overflowY: "auto" }}>
              {(v.assignable || []).map((_a) => (
                <label key={_a.id} className="hd-pick">
                  <NTV.Checkbox checked={_a.checked} onChange={_a.toggle} />
                  <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                    <strong style={{ fontSize: "14px", lineHeight: "20px" }}>{_a.alias}</strong>
                    <span className="dv-sub" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_a.key}{" · "}{_a.type}</span>
                  </span>
                </label>
              ))}
              {!(v.assignable || []).length ? <div className="dv-empty">No unassigned licenses available.</div> : null}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={!v.assignCount} onClick={v.doAssign}>{"Assign" + (v.assignCount ? " (" + v.assignCount + ")" : "")}</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.unassign ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Unassign License?" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              <strong style={{ color: "var(--fg-primary)" }}>{v.pendingAlias}</strong>
              {" will be removed from "}{v.h?.name}{" and stop playing its screen. It goes back to your unassigned licenses."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doUnassign}>Unassign</button>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.delete ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status={v.del?.status} title={v.del?.title} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.del?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>{v.del?.cancel}</NTV.Button>
              {v.del?.can ? (
                <>
                  <a href="DealerHosts.dc.html" className="ntv-btn ntv-btn--danger ntv-btn--xl" style={{ textDecoration: "none" }}>Delete Host</a>
                </>
              ) : null}
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
