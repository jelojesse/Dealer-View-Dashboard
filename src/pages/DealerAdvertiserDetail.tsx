// @ts-nocheck
/**
 * Page: Advertiser Details  (route /advertisers/detail)
 * Converted from the Claude Design artboard DealerAdvertiserDetail.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, advsForHost, arrived, byId, contains, go, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerAdvertiserDetail.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerAdvertiserDetail.dc.html') || {};
    var a;
    if (f.id === 'new') { try { a = JSON.parse(localStorage.getItem('ntvAdv') || 'null'); } catch (e) {} }
    a = a || byId(D.advertisers, f.id) || D.advertisers[0];
    var content = D.media.filter(function (m) { return m.adv === a.id; }).map(function (m) { return Object.assign({}, m); });
    this.state = { pick: '', view: 'grid', kind: '', q: '', ovTab: 'Playlist', a: Object.assign({}, a), content: content, tab: 'Content', modal: f.edit ? 'edit' : '', edit: this.mk(a), confirm: null, target: '', rename: '', up: null, toast: null };
  }
  mk(a) { return { active: a.status === 'Active', name: a.name, category: a.category, city: a.city, state: a.state, region: a.region }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); if (this._ut) clearInterval(this._ut); }
  renderVals() {
    var self = this, s = this.state, a = s.a, e = s.edit;
    var setE = function (k) { return function (v) { var o = Object.assign({}, self.state.edit); o[k] = typeof v === 'boolean' ? v : val(v); self.setState({ edit: o }); }; };
    var hosts = D.hosts.filter(function (h) { return advsForHost(h.id).some(function (x) { return x.id === a.id; }); });
    var usedCount = s.content.filter(function (m) { return m.used; }).length;
    var close = function () { self.setState({ modal: '', confirm: null }); };
    var cf = s.confirm || {};
    var plCount = function (m) { return D.playlists.filter(function (p) { return p.items.indexOf(m.id) !== -1; }).length; };
    return {
      none: null, i12: 12, i32: 32, w460: 460, w600: 600,
      crumbs: [{ label: 'Advertisers', href: 'DealerAdvertisers.dc.html' }, a.name],
      a: { name: a.name, status: a.status, category: a.category, city: a.city, state: a.state, region: a.region, created: a.created, createdBy: a.createdBy,
        color: a.status === 'Active' ? 'var(--status-online)' : 'var(--status-inactive)', tint: a.status === 'Active' ? 'var(--success-050)' : 'var(--primary-100)' },
      tabs: [['Content', 'Content (' + s.content.length + ')'], ['Hosts', 'Hosts (' + hosts.length + ')']].map(function (t) { return { label: t[1], on: s.tab === t[0], pick: function () { self.setState({ tab: t[0] }); } }; }),
      i14: 14, i24: 24,
      tags: (D.assign.filter(function (x) { return x.kind === 'Advertiser' && x.ref === a.id; })[0] || { tags: ['t2'] }).tags.map(function (t) { var tg = byId(D.tags, t); var c = { info: 'var(--info-main)', warning: 'var(--warning-main)', teal: 'var(--teal-main)', success: 'var(--success-400)', purple: 'var(--purple-main)', accent: 'var(--accent-action)', hotpink: 'var(--hot-pink-main)' }; return { name: tg ? tg.name : t, color: c[tg ? tg.color : 'info'] }; }),
      cards: [['Total Content', 'Images & videos in this advertiser’s library', s.content.length, 'grid-2', 'teal'], ['Playlist', 'Playlists running any of this advertiser’s content', D.playlists.filter(function (p) { return s.content.some(function (m) { return p.items.indexOf(m.id) !== -1; }); }).length, 'play', 'success'], ['Host', 'Venues currently showing this advertiser’s content', hosts.length, 'map', 'purple']].map(function (k) { return { label: k[0], desc: k[1], value: k[2], icon: k[3], tone: k[4] }; }),
      contentCount: s.content.length,
      kindLabel: s.kind ? 'Filter: ' + s.kind + 's' : 'Filter by', cycleKind: function () { var o = ['', 'image', 'video', 'widget']; self.setState({ kind: o[(o.indexOf(self.state.kind) + 1) % o.length] }); },
      q: s.q, setQ: function (v) { self.setState({ q: val(v) }); },
      isGrid: s.view === 'grid', isList: s.view === 'list', toGrid: function () { self.setState({ view: 'grid' }); }, toList: function () { self.setState({ view: 'list' }); },
      ovTabs: ['Playlist', 'Block', 'Host'].map(function (t) { return { label: t, on: s.ovTab === t, pick: function () { self.setState({ ovTab: t }); } }; }),
      ov: (function () {
        var m = byId(s.content, s.pick); if (!m) return { none: true, has: false };
        var B = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] }[m.kind] || ['IMAGE', 'var(--info-main)'];
        var pls = D.playlists.filter(function (p) { return p.items.indexOf(m.id) !== -1; });
        var scr = {}; pls.forEach(function (p) { p.screens.forEach(function (x) { scr[x] = 1; }); });
        var list = s.ovTab === 'Playlist' ? pls.map(function (p, i) { return { n: i + 1, name: p.name, icon: 'play', href: 'DealerPlaylistDetail.dc.html', go: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) }; })
          : s.ovTab === 'Block' ? pls.filter(function (p) { return p.block; }).map(function (p, i) { return { n: i + 1, name: p.name + ' Block', icon: 'grid-2', href: 'DealerPlaylistDetail.dc.html', go: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) }; })
          : hosts.map(function (h, i) { return { n: i + 1, name: h.name, icon: 'map', href: 'DealerHostDetail.dc.html', go: navFn('DealerHostDetail.dc.html', { id: h.id }) }; });
        return { none: false, has: true, image: m.image, title: m.title, badge: B[0], badgeColor: B[1], by: a.createdBy, uploaded: m.uploaded, duration: m.kind === 'image' ? 'N/A' : (m.duration || '—'), size: m.size, plays: m.used ? 120 + (parseInt(String(m.id).replace(/\D/g, ''), 10) || 3) * 17 % 600 : 0, screens: Object.keys(scr).length, list: list, empty: list.length === 0,
          download: function () { toast(self, 'Downloading ' + m.title, 'info'); },
          rename: function () { self.setState({ modal: 'rename', target: m.id, rename: m.title }); },
          remove: function () { var n = pls.length; self.setState({ modal: 'confirm', confirm: { status: 'warning', title: 'Delete Content?', can: true, okLabel: 'Delete', cancelLabel: 'Cancel', text: m.used ? m.title + ' is used in ' + Math.max(n, 1) + ' playlist(s). Deleting it removes it from those playlists and the screens playing them.' : 'Delete ' + m.title + '? This can’t be undone.', act: 'delContent', id: m.id } }); } };
      })(),
      isContent: s.tab === 'Content', isHosts: s.tab === 'Hosts',
      content: s.content.filter(function (m) { return (!s.kind || m.kind === s.kind) && contains(m.title, s.q); }).map(function (m) {
        var n = plCount(m), B = { image: ['IMAGE', 'var(--info-main)'], video: ['VIDEO', 'var(--danger-main)'], widget: ['WIDGET', 'var(--success-400)'] }[m.kind] || ['IMAGE', 'var(--info-main)'];
        return { badge: B[0], badgeColor: B[1], border: s.pick === m.id ? 'var(--accent-action)' : 'var(--container-border)', duration: m.kind === 'image' ? 'N/A' : (m.duration || '—'), uploaded: m.uploaded, uploader: a.createdBy, pick: function () { self.setState({ pick: m.id }); }, image: m.image, kind: m.kind, title: m.title, meta: m.size + ' · ' + (m.duration || '') + ' · ' + m.uploaded,
          useLabel: m.used ? 'In ' + Math.max(n, 1) + ' playlist(s)' : 'Unused', useColor: m.used ? 'var(--success-600)' : 'var(--warning-600)', useTint: m.used ? 'var(--success-050)' : 'var(--warning-050)',
          rename: function () { self.setState({ modal: 'rename', target: m.id, rename: m.title }); },
          remove: function () {
            self.setState({ modal: 'confirm', confirm: { status: 'warning', title: 'Delete Content?', can: true, okLabel: 'Delete', cancelLabel: 'Cancel',
              text: m.used ? m.title + ' is used in ' + Math.max(n, 1) + ' playlist(s). Deleting it removes it from those playlists and the screens playing them.' : 'Delete ' + m.title + '? This can’t be undone.',
              act: 'delContent', id: m.id } });
          } };
      }),
      noContent: s.content.length === 0,
      uploading: !!s.up, upName: s.up ? s.up.name : '', upPct: s.up ? s.up.pct : 0,
      upload: function () {
        if (self.state.up) return;
        var name = a.name.split(' ')[0] + ' Promo ' + (self.state.content.length + 1) + '.jpg';
        self.setState({ up: { name: name, pct: 5 } });
        self._ut = setInterval(function () {
          var u = self.state.up; if (!u) return;
          if (u.pct >= 100) { clearInterval(self._ut); self.setState({ up: null, content: self.state.content.concat([{ id: 'mu' + Date.now(), title: u.name, kind: 'image', image: D.B.buynow, size: '1.8 MB', duration: '15 sec', uploaded: 'Nov 9, 2026', used: false }]) }); toast(self, u.name + ' uploaded'); return; }
          self.setState({ up: { name: u.name, pct: Math.min(100, u.pct + 19) } });
        }, 300);
      },
      hosts: hosts.map(function (h, i) { return { n: i + 1, name: h.name, category: h.category, address: h.address + ', ' + h.city, lic: h.lic.length, open: navFn('DealerHostDetail.dc.html', { id: h.id }) }; }),
      noHosts: hosts.length === 0,
      m: { edit: s.modal === 'edit', confirm: s.modal === 'confirm', rename: s.modal === 'rename' },
      closeModal: close,
      openEdit: function () { self.setState({ modal: 'edit', edit: self.mk(self.state.a) }); },
      categories: ['Cafe', 'Food', 'Retail', 'Automotive', 'Insurance', 'Finance', 'Dental', 'Fitness', 'Real Estate', 'Legal', 'Health', 'Events'],
      e: { active: e.active, statusLabel: e.active ? 'Active' : 'Inactive', name: e.name, category: e.category, city: e.city, state: e.state, region: e.region,
        setActive: function (on) { setE('active')(typeof on === 'boolean' ? on : !self.state.edit.active); }, setName: setE('name'), setCategory: setE('category'), setCity: setE('city'), setStateV: setE('state'), setRegion: setE('region'),
        invalid: !e.name.trim() },
      askSave: function () {
        var deact = !self.state.edit.active && self.state.a.status === 'Active';
        self.setState({ modal: 'confirm', confirm: deact ? { status: 'warning', title: 'Deactivate Advertiser?', can: true, okLabel: 'Deactivate', cancelLabel: 'Back', text: a.name + '’s ' + usedCount + ' playing content item(s) will stop showing on your screens until you reactivate it.', act: 'save', back: true }
          : { status: 'warning', title: 'Update Advertiser?', can: true, okLabel: 'Update', cancelLabel: 'Back', text: 'Save the changes to ' + a.name + '?', act: 'save', back: true } });
      },
      openDelete: function () {
        self.setState({ modal: 'confirm', confirm: usedCount ? { status: 'error', title: 'Can’t Delete Advertiser', can: false, cancelLabel: 'Close', text: a.name + ' has ' + usedCount + ' content item(s) in use in playlists. Remove that content from the playlists, then try again.' }
          : { status: 'warning', title: 'Delete Advertiser?', can: true, okLabel: 'Delete', cancelLabel: 'Cancel', text: 'Delete ' + a.name + ' and its ' + s.content.length + ' unused content item(s)? This can’t be undone.', act: 'delAdv' } });
      },
      cf: { status: cf.status || 'warning', title: cf.title || '', text: cf.text || '', can: !!cf.can, okLabel: cf.okLabel || 'OK', cancelLabel: cf.cancelLabel || 'Cancel',
        cancel: function () { if (cf.back) self.setState({ modal: 'edit', confirm: null }); else close(); },
        ok: function () {
          if (cf.act === 'save') { var x = self.state.edit; self.setState({ a: Object.assign({}, self.state.a, { name: x.name, category: x.category, city: x.city, state: x.state, region: x.region, status: x.active ? 'Active' : 'Inactive' }), modal: '', confirm: null }); toast(self, 'Advertiser updated'); }
          else if (cf.act === 'delContent') { self.setState({ content: self.state.content.filter(function (m) { return m.id !== cf.id; }), modal: '', confirm: null }); toast(self, 'Content deleted'); }
          else if (cf.act === 'delAdv') { var l = document.querySelector('a[data-go="DealerAdvertisers.dc.html"]'); if (l) l.click(); }
        } },
      renameVal: s.rename, setRename: function (v) { self.setState({ rename: val(v) }); },
      doRename: function () { var id = self.state.target, n = self.state.rename; self.setState({ content: self.state.content.map(function (m) { return m.id === id ? Object.assign({}, m, { title: n }) : m; }), modal: '' }); toast(self, 'Renamed to ' + n); },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = 'DealerAdvertiserDetail.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-advertiser-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Advertisers" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between">
            <NTV.Breadcrumbs items={v.crumbs} />
            <button type="button" className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" onClick={v.openEdit} style={{ background: "var(--red-orange-main)" }}>
              <span>Modify</span>
              <NTV.Icon name="gear" size={v.i12} />
            </button>
          </div>
          <section className="dv-card" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span className="dv-avatar" style={{ width: "64px", height: "64px", borderWidth: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}><NTV.Icon name="tag" size={v.i24} /></span>
            <div style={{ flex: "1", minWidth: "0" }}>
              <div className="dv-row" style={{ gap: "10px" }}>
                <h1 style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>{v.a?.name}</h1>
                <span className="dv-row" style={{ gap: "4px", fontSize: "11px", color: `${s(v.a?.color)}` }}>
                  <span className="dv-dot" style={{ background: `${s(v.a?.color)}`, width: "6px", height: "6px" }} />
                  {v.a?.status}
                </span>
              </div>
              <p className="dv-sub" style={{ fontSize: "11px" }}>
                {"Assigned Dealer: "}
                <strong style={{ color: "var(--fg-primary)" }}>Ibanez Lighting Inc.</strong>
                {" · Created by: "}
                <strong style={{ color: "var(--fg-primary)" }}>{v.a?.createdBy}</strong>
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "12px", lineHeight: "18px", fontWeight: "600" }}>{v.a?.city}{", "}{v.a?.state}{" "}{v.a?.region}{" · "}{v.a?.category}</p>
            </div>
            <div className="dv-row" style={{ gap: "8px" }}>
              {(v.tags || []).map((_t, $index) => (
                <React.Fragment key={$index}>
                  <span className="dv-tagpill" style={{ background: `${s(_t?.color)}`, height: "24px", padding: "0 14px" }}>{_t?.name}</span>
                </React.Fragment>
              ))}
            </div>
          </section>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }}>
            {(v.cards || []).map((_k, $index) => (
              <React.Fragment key={$index}>
                <div className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div className="dv-between" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                    <div className="dv-row" style={{ gap: "14px", alignItems: "flex-start" }}>
                      <NTV.IconTile icon={_k?.icon} tone={_k?.tone} />
                      <div>
                        <p style={{ margin: "0", fontSize: "18px", lineHeight: "28px", fontWeight: "700" }}>{_k?.label}</p>
                        <p className="dv-sub" style={{ fontSize: "11px" }}>{_k?.desc}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "26px", lineHeight: "36px", fontWeight: "700" }}>{_k?.value}</span>
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
              </React.Fragment>
            ))}
          </section>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 420px", gap: "20px", alignItems: "start" }}>
            <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px", minHeight: "420px" }}>
              <div className="dv-between">
                <h2 className="dv-h3">Advertiser Contents</h2>
                <span className="dv-sub">All contents ({v.contentCount})</span>
              </div>
              <div className="dv-between">
                <div className="dv-row">
                  <NTV.Button variant="secondary" size="m" iconLeft="filter" iconRight={v.none} onClick={v.cycleKind}>{v.kindLabel}</NTV.Button>
                  <NTV.Button variant="secondary" size="m" iconLeft="arrow-up-from-bracket" iconRight={v.none} onClick={v.upload}>Upload Media</NTV.Button>
                </div>
                <div className="dv-row">
                  <NTV.Input size="l" placeholder="Search Advertiser Content" iconLeft="magnifying-glass" label="Search content" value={v.q} onChange={v.setQ} style={{ width: "260px" }} />
                  <div className="dv-vt" role="group" aria-label="View">
                    <button type="button" aria-label="Grid view" aria-pressed={v.isGrid} onClick={v.toGrid}><NTV.Icon name="grid-2" size={v.i14} /></button>
                    <button type="button" aria-label="List view" aria-pressed={v.isList} onClick={v.toList}><NTV.Icon name="rectangle-history" size={v.i14} /></button>
                  </div>
                </div>
              </div>
              {v.uploading ? (
                <>
                  <div className="dv-row" style={{ padding: "12px", border: "1px dashed var(--accent-action)", borderRadius: "var(--radius-sm)" }}>
                  <span className="dv-spinner" />
                  <span style={{ flex: "1", fontSize: "14px" }}>{"Uploading "}{v.upName}…</span>
                  <div style={{ width: "240px" }}><NTV.ProgressBar value={v.upPct} /></div>
                </div>
                </>
              ) : null}
              {v.isGrid ? (
                <>
                  <div className="dv-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
                  {(v.content || []).map((_c, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" onClick={_c?.pick} style={{ padding: "0", border: `2px solid ${s(_c?.border)}`, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-surface)", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                        <div className="dv-thumb" style={{ aspectRatio: "16 / 10", borderRadius: "0" }}>
                          <img src={_c?.image} alt="" />
                          <span style={{ position: "absolute", left: "6px", top: "6px", padding: "0 6px", borderRadius: "4px", background: "#fff", fontSize: "9px", lineHeight: "16px", fontWeight: "700", color: `${s(_c?.badgeColor)}` }}>{_c?.badge}</span>
                        </div>
                        <div style={{ padding: "6px 8px", fontSize: "11px", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--fg-primary)" }}>{_c?.title}</div>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                </>
              ) : null}
              {v.isList ? (
                <>
                  <div className="dv-table">
                  <div role="table" aria-label="Advertiser contents">
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: "80px 1.6fr 90px 110px 120px 1fr" }}>
                      <div>Thumbnail</div>
                      <div>File Name</div>
                      <div>File Type</div>
                      <div>Duration</div>
                      <div>Upload Date</div>
                      <div>Uploader</div>
                    </div>
                    {(v.content || []).map((_c, $index) => (
                      <React.Fragment key={$index}>
                        <div role="row" className="dv-tr" onClick={_c?.pick} style={{ gridTemplateColumns: "80px 1.6fr 90px 110px 120px 1fr", minHeight: "52px", cursor: "pointer" }}>
                          <div>
                            <span className="dv-thumb" style={{ display: "block", width: "52px", height: "32px" }}><img src={_c?.image} alt="" /></span>
                          </div>
                          <div>{_c?.title}</div>
                          <div>
                            <span style={{ fontSize: "9px", fontWeight: "700", color: `${s(_c?.badgeColor)}` }}>{_c?.badge}</span>
                          </div>
                          <div>{_c?.duration}</div>
                          <div>{_c?.uploaded}</div>
                          <div>{_c?.uploader}</div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                </>
              ) : null}
              {v.noContent ? (
                <>
                  <div className="dv-empty" style={{ flex: "1" }}>
                  <span style={{ color: "var(--fg-primary)" }}><NTV.Icon name="play" size={v.i24} /></span>
                  <strong style={{ fontSize: "14px", color: "var(--fg-primary)" }}>No Contents Found</strong>
                  <span>Try uploading content for this advertiser.</span>
                </div>
                </>
              ) : null}
            </section>
            <aside className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "420px" }}>
              {v.ov?.none ? (
                <>
                  <h2 className="dv-h3">Content Overview</h2>
                  <div className="dv-empty" style={{ flex: "1" }}>
                  <NTV.Icon name="circle-info" size={v.i24} />
                  <strong style={{ fontSize: "14px", color: "var(--fg-primary)" }}>Click on a media item to view comprehensive details</strong>
                  <span>Includes stats, playlists, blocks and hosts.</span>
                </div>
                </>
              ) : null}
              {v.ov?.has ? (
                <>
                  <div className="dv-thumb" style={{ aspectRatio: "16 / 9" }}>
                  <img src={v.ov?.image} alt="" />
                  <span style={{ position: "absolute", left: "8px", top: "8px", padding: "0 6px", borderRadius: "4px", background: "#fff", fontSize: "9px", lineHeight: "16px", fontWeight: "700", color: `${s(v.ov?.badgeColor)}` }}>{v.ov?.badge}</span>
                </div>
                  <div className="dv-between" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                  <div style={{ minWidth: "0" }}>
                    <strong style={{ fontSize: "15px", lineHeight: "22px" }}>{v.ov?.title}</strong>
                    <p className="dv-sub" style={{ fontSize: "11px" }}>{v.ov?.by}{" · "}{v.ov?.uploaded}</p>
                  </div>
                  <div className="dv-row" style={{ gap: "6px" }}>
                    <NTV.Button variant="secondary" size="m" iconLeft="download" iconRight={v.none} onClick={v.ov?.download}>Download</NTV.Button>
                    <button type="button" className="dv-ib" aria-label="More" onClick={v.ov?.rename}><NTV.Icon name="ellipsis" size={v.i14} /></button>
                  </div>
                </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--bg-app)" }}>
                  <div className="dv-kv2">
                    <span>Content Duration</span>
                    <span>{v.ov?.duration}</span>
                  </div>
                  <div className="dv-kv2">
                    <span>Content Size</span>
                    <span>{v.ov?.size}</span>
                  </div>
                  <div className="dv-kv2">
                    <span>Total Plays (7 Days)</span>
                    <span>{v.ov?.plays}</span>
                  </div>
                  <div className="dv-kv2">
                    <span>Screens</span>
                    <span>{v.ov?.screens}</span>
                  </div>
                </div>
                  <div className="dv-tabs" role="tablist">
                  {(v.ovTabs || []).map((_t, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick} style={{ flex: "1" }}>{_t?.label}</button>
                    </React.Fragment>
                  ))}
                </div>
                  {(v.ov?.list || []).map((_x, $index) => (
                  <React.Fragment key={$index}>
                    <a href={_x?.href} onClick={_x?.go} className="dv-row" style={{ gap: "10px", padding: "6px 4px", textDecoration: "none", color: "var(--fg-primary)", fontSize: "12px" }} data-nav={_x?.goNav}>
                      <span className="dv-sub" style={{ width: "16px" }}>{_x?.n}</span>
                      <span style={{ color: "var(--accent-action)" }}><NTV.Icon name={_x?.icon} size={v.i10} /></span>
                      {_x?.name}
                    </a>
                  </React.Fragment>
                ))}
                  {v.ov?.empty ? (
                  <>
                    <p className="dv-sub">Nothing here yet.</p>
                  </>
                ) : null}
                  <button type="button" className="dv-a" onClick={v.ov?.remove} style={{ alignSelf: "flex-start", color: "var(--danger-main)", fontSize: "12px", marginTop: "auto" }}>Delete content</button>
                </>
              ) : null}
            </aside>
          </div>
        </main>
      </div>
      {v.m?.edit ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Advertiser Details" width={v.w600} onClose={v.closeModal}>
            <div className="dv-between" style={{ marginBottom: "12px" }}>
              <p className="dv-sub">Update the advertiser’s details and status</p>
              <div className="dv-row" style={{ gap: "10px" }}>
                <span className="dv-p" style={{ fontSize: "14px" }}>{v.e?.statusLabel}</span>
                <NTV.Switch checked={v.e?.active} onChange={v.e?.setActive} label="Advertiser active" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
              <div style={{ gridColumn: "1 / 3" }}>
                <label className="dv-label" htmlFor="ea-name">Advertiser Name</label>
                <input id="ea-name" className="dv-field" value={v.e?.name} onChange={v.e?.setName} />
              </div>
              <div>
                <span className="dv-label">Category</span>
                <NTV.Select size="l" options={v.categories} value={v.e?.category} onChange={v.e?.setCategory} />
              </div>
              <div>
                <label className="dv-label" htmlFor="ea-city">City</label>
                <input id="ea-city" className="dv-field" value={v.e?.city} onChange={v.e?.setCity} />
              </div>
              <div>
                <label className="dv-label" htmlFor="ea-state">State</label>
                <input id="ea-state" className="dv-field" value={v.e?.state} onChange={v.e?.setStateV} />
              </div>
              <div>
                <label className="dv-label" htmlFor="ea-region">Region</label>
                <input id="ea-region" className="dv-field" value={v.e?.region} onChange={v.e?.setRegion} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.openDelete}>Delete Advertiser</button>
              <div className="dv-row">
                <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
                <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.e?.invalid} onClick={v.askSave}>Update</NTV.Button>
              </div>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.confirm ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status={v.cf?.status} title={v.cf?.title} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.cf?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.cf?.cancel}>{v.cf?.cancelLabel}</NTV.Button>
              {v.cf?.can ? (
                <>
                  <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.cf?.ok}>{v.cf?.okLabel}</NTV.Button>
                </>
              ) : null}
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      {v.m?.rename ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="Rename Content" width={v.w460} onClose={v.closeModal}>
            <label className="dv-label" htmlFor="rn">File name</label>
            <input id="rn" className="dv-field" value={v.renameVal} onChange={v.setRename} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.doRename}>Save</NTV.Button>
            </div>
          </NTV.Modal>
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
