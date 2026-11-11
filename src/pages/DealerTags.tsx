// @ts-nocheck
/**
 * Page: Tags  (route /tags)
 * Layout per Figma "Main Page - Tags" (LHfqAfonjZvk4qcrzNMNv4, node 2357:46275):
 * header + Create Tag, 4 stat cards, then two panels side by side —
 * "Tags Data" (assignees and their tags) and "Tags Management" (every tag and how often it's used).
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { addNav, byId, contains, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerTags.css';

/* ============================== Logic ============================== */

// Solid tag colors (white text), per the Figma "Rounded Tags".
var TC = { info: 'var(--info-main)', warning: 'var(--warning-main)', teal: 'var(--teal-main)', success: 'var(--success-main)', purple: 'var(--purple-main)', accent: 'var(--danger-main)', hotpink: 'var(--hot-pink-main)', redorange: 'var(--red-orange-main)' };
var COLORS = ['info', 'warning', 'teal', 'success', 'purple', 'accent', 'redorange', 'hotpink'];
var PAGE = 10;
var KIND = { Host: 'DealerHostDetail.dc.html', Advertiser: 'DealerAdvertiserDetail.dc.html', License: 'DealerLicenseDetail.dc.html', Screen: 'DealerScreenDetail.dc.html' };

// Assignees: the tagged items in mock data, plus demo rows built from hosts / advertisers / licenses
// so the table has realistic volume (tags picked deterministically by index).
function seedAssignees() {
  var picks = D.tags.filter(function (t) { return !t.sys; }).map(function (t) { return t.id; });
  var uniq = function (arr) { return arr.filter(function (x, i) { return arr.indexOf(x) === i; }); };
  var out = [], have = {};
  D.assign.forEach(function (a) { var key = a.kind + ':' + a.ref; if (have[key]) return; have[key] = 1; out.push({ key: key, kind: a.kind, ref: a.ref, name: a.name, tags: uniq(a.tags) }); });
  var add = function (kind, ref, name, i) {
    var key = kind + ':' + ref; if (have[key]) return; have[key] = 1;
    var n = 1 + (i % 3), tags = [];
    for (var k = 0; k < n; k++) { var id = picks[(i * 7 + k * 5) % picks.length]; if (tags.indexOf(id) === -1) tags.push(id); }
    out.push({ key: key, kind: kind, ref: ref, name: name, tags: tags });
  };
  D.hosts.forEach(function (h, i) { add('Host', h.id, h.name, i); });
  D.advertisers.forEach(function (a, i) { add('Advertiser', a.id, a.name, i + 3); });
  D.licenses.forEach(function (l, i) { var h = byId(D.hosts, l.host); add('License', l.id, l.alias + (h ? ' · ' + h.name : ''), i + 1); });
  return out;
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { tags: D.tags.map(function (t) { return Object.assign({}, t); }), assign: seedAssignees(), kind: '', query: '', sel: {}, limit: PAGE, tagLimit: PAGE + 3,
      aSort: '', tSort: '', modal: '', fm: null, target: '', at: null, rm: null, toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var tagOf = function (id) { return byId(s.tags, id); };
    var used = function (id) { return s.assign.filter(function (a) { return a.tags.indexOf(id) !== -1; }).length; };
    // Tags Data: assignees that have at least one tag, filtered by the stat card (kind) and search.
    var list = s.assign.filter(function (a) {
      if (!a.tags.length) return false;
      if (s.kind && a.kind !== s.kind) return false;
      return contains(a.name + ' ' + a.kind + ' ' + a.tags.map(function (t) { var x = tagOf(t); return x ? x.name : ''; }).join(' '), s.query);
    });
    if (s.aSort) list = list.slice().sort(function (a, b) { return s.aSort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); });
    var vis = list.slice(0, s.limit);
    var selKeys = Object.keys(s.sel).filter(function (k) { return s.sel[k]; });
    var allOn = vis.length > 0 && vis.every(function (a) { return s.sel[a.key]; });
    // Tags Management: every tag with how many assignees use it.
    var tlist = s.tags.map(function (t) { return { t: t, n: used(t.id) }; });
    if (s.tSort === 'az') tlist.sort(function (a, b) { return a.t.name.localeCompare(b.t.name); });
    else if (s.tSort === 'za') tlist.sort(function (a, b) { return b.t.name.localeCompare(a.t.name); });
    else if (s.tSort === 'hi') tlist.sort(function (a, b) { return b.n - a.n; });
    else if (s.tSort === 'lo') tlist.sort(function (a, b) { return a.n - b.n; });
    var kindCount = function (k) { return s.assign.filter(function (a) { return a.kind === k && a.tags.length; }).length; };
    var fm = s.fm || { name: '', color: 'info' };
    var tg = byId(s.tags, s.target);
    var at = s.at || { who: '', tags: {} };
    var whoLabel = function (a) { return a.name + ' (' + a.kind + ')'; };
    var atWho = s.assign.filter(function (a) { return whoLabel(a) === at.who; })[0];
    var cycle = function (cur, order) { var i = order.indexOf(cur); return order[(i + 1) % order.length]; };
    return {
      none: null, i10: 10, i12: 12, i14: 14, w460: 460, w560: 560,
      cards: [['Screen', 'Screens', 'tv', 'info'], ['Host', 'Hosts', 'map', 'purple'], ['Advertiser', 'Advertisers', 'rectangle-ad', 'hot-pink'], ['License', 'Licenses', 'barcode', 'red-orange']].map(function (k) {
        return { label: k[1], n: kindCount(k[0]), icon: k[2], tone: k[3], on: s.kind === k[0], border: s.kind === k[0] ? 'var(--accent-action)' : 'var(--container-border)', pick: function () { self.setState({ kind: self.state.kind === k[0] ? '' : k[0], limit: PAGE }); } };
      }),
      query: s.query, setQuery: function (v) { self.setState({ query: val(v), limit: PAGE }); },
      kindChip: s.kind ? s.kind + 's' : '', clearKind: function () { self.setState({ kind: '' }); },
      // ---- Tags Data ----
      rows: vis.map(function (a, i) {
        return { key: a.key, n: i + 1, name: a.name, kind: a.kind, checked: !!s.sel[a.key],
          toggle: function () { var o = Object.assign({}, self.state.sel); o[a.key] = !o[a.key]; self.setState({ sel: o }); },
          tags: a.tags.map(tagOf).filter(Boolean).map(function (t) { return { id: t.id, name: t.name, color: TC[t.color] || TC.info, sys: !!t.sys,
            remove: function () {
              self.setState({ assign: self.state.assign.map(function (x) { return x.key === a.key ? Object.assign({}, x, { tags: x.tags.filter(function (y) { return y !== t.id; }) }) : x; }) });
              toast(self, '“' + t.name + '” removed from ' + a.name);
            } }; }),
          remove: function () { self.setState({ modal: 'rm', rm: { keys: [a.key], title: 'Remove Tags?', text: 'Remove all tags from ' + a.name + '? The item itself isn’t deleted.' } }); } };
      }),
      empty: list.length === 0, shown: vis.length, matched: list.length, hasMore: list.length > vis.length,
      more: function () { self.setState({ limit: self.state.limit + PAGE }); },
      allOn: allOn, toggleAll: function () { var o = Object.assign({}, self.state.sel); vis.forEach(function (a) { o[a.key] = !allOn; }); self.setState({ sel: o }); },
      aSortIcon: s.aSort === 'az' ? 'arrow-down-a-z' : (s.aSort === 'za' ? 'arrow-down-z-a' : 'filter'),
      sortAssignee: function () { self.setState({ aSort: cycle(self.state.aSort, ['', 'az', 'za']) }); },
      bulkOff: selKeys.length === 0,
      bulkDelete: function () { var n = selKeys.length; self.setState({ modal: 'rm', rm: { keys: selKeys, title: 'Remove Tags from ' + n + (n === 1 ? ' Item?' : ' Items?'), text: 'All tags will be removed from the ' + n + ' selected item(s). The items themselves aren’t deleted.' } }); },
      exportCsv: function () { toast(self, 'Exporting ' + list.length + ' rows to CSV…', 'info'); },
      refreshData: function () { self.setState({ sel: {}, limit: PAGE }); toast(self, 'Tags data refreshed', 'info'); },
      rm: s.rm || { title: '', text: '' },
      doRemove: function () { var keys = self.state.rm.keys, sel = Object.assign({}, self.state.sel); keys.forEach(function (k) { delete sel[k]; });
        self.setState({ assign: self.state.assign.map(function (a) { return keys.indexOf(a.key) !== -1 ? Object.assign({}, a, { tags: [] }) : a; }), sel: sel, modal: '', rm: null });
        toast(self, 'Tags removed from ' + keys.length + (keys.length === 1 ? ' item' : ' items')); },
      // ---- Tags Management ----
      tagRows: tlist.slice(0, s.tagLimit).map(function (x, i) {
        var t = x.t;
        return { n: i + 1, name: t.name, color: TC[t.color] || TC.info, total: x.n, locked: !!t.sys,
          edit: function () { self.setState({ modal: 'form', target: t.id, fm: { mode: 'edit', name: t.name, color: t.color } }); },
          remove: function () { self.setState({ modal: 'del', target: t.id }); } };
      }),
      tagShown: Math.min(s.tagLimit, tlist.length), tagTotal: tlist.length, tagMore: tlist.length > s.tagLimit,
      moreTags: function () { self.setState({ tagLimit: self.state.tagLimit + PAGE }); },
      nameSortIcon: s.tSort === 'az' ? 'arrow-down-a-z' : (s.tSort === 'za' ? 'arrow-down-z-a' : 'filter'),
      totalSortIcon: s.tSort === 'hi' ? 'arrow-down-9-1' : (s.tSort === 'lo' ? 'arrow-down-1-9' : 'filter'),
      sortName: function () { self.setState({ tSort: self.state.tSort === 'az' ? 'za' : (self.state.tSort === 'za' ? '' : 'az') }); },
      sortTotal: function () { self.setState({ tSort: self.state.tSort === 'hi' ? 'lo' : (self.state.tSort === 'lo' ? '' : 'hi') }); },
      refreshTags: function () { self.setState({ tSort: '', tagLimit: PAGE + 3 }); toast(self, 'Tags list refreshed', 'info'); },
      // ---- Modals ----
      m: { form: s.modal === 'form', del: s.modal === 'del', rm: s.modal === 'rm', assign: s.modal === 'assign' },
      closeModal: function () { self.setState({ modal: '' }); },
      openNew: function () { self.setState({ modal: 'form', fm: { mode: 'new', name: '', color: 'info' } }); },
      fm: { title: fm.mode === 'edit' ? 'Edit Tag' : 'Create Tag', name: fm.name, bad: !fm.name.trim() || s.tags.some(function (t) { return t.name.toLowerCase() === fm.name.trim().toLowerCase() && t.id !== (fm.mode === 'edit' ? s.target : ''); }),
        setName: function (v) { self.setState({ fm: Object.assign({}, self.state.fm, { name: val(v) }) }); },
        colors: COLORS.map(function (k) { return { name: k, color: TC[k], on: fm.color === k, pick: function () { self.setState({ fm: Object.assign({}, self.state.fm, { color: k }) }); } }; }),
        preview: fm.name.trim() || 'Tag preview', previewColor: TC[fm.color] || TC.info,
        save: function () { var x = self.state.fm;
          if (x.mode === 'edit') { self.setState({ tags: self.state.tags.map(function (t) { return t.id === self.state.target ? Object.assign({}, t, { name: x.name.trim(), color: x.color }) : t; }), modal: '' }); toast(self, 'Tag updated'); }
          else { self.setState({ tags: [{ id: 't' + Date.now(), name: x.name.trim(), color: x.color, sys: false }].concat(self.state.tags), modal: '' }); toast(self, 'Tag “' + x.name.trim() + '” created'); } } },
      delText: tg ? (function () { var n = used(tg.id); return n ? 'Delete “' + tg.name + '”? It will be removed from ' + n + ' item(s) it’s assigned to.' : 'Delete “' + tg.name + '”? It isn’t assigned to anything.'; })() : '',
      doDelete: function () { var id = self.state.target; self.setState({ tags: self.state.tags.filter(function (t) { return t.id !== id; }), assign: self.state.assign.map(function (a) { return Object.assign({}, a, { tags: a.tags.filter(function (x) { return x !== id; }) }); }), modal: '' }); toast(self, 'Tag deleted'); },
      // Assign Tags: pick an item, then toggle the (non-system) tags it should have.
      openAssign: function () { self.setState({ modal: 'assign', at: { who: '', tags: {} } }); },
      at: { who: at.who, whoOptions: s.assign.map(whoLabel),
        setWho: function (v) { var w = val(v), a = s.assign.filter(function (x) { return whoLabel(x) === w; })[0], on = {}; if (a) a.tags.forEach(function (t) { on[t] = true; }); self.setState({ at: { who: w, tags: on } }); },
        tags: s.tags.filter(function (t) { return !t.sys; }).map(function (t) { var on = !!at.tags[t.id]; return { name: t.name, on: on, color: TC[t.color] || TC.info,
          toggle: function () { var o = Object.assign({}, self.state.at.tags); o[t.id] = !o[t.id]; self.setState({ at: Object.assign({}, self.state.at, { tags: o }) }); } }; }),
        bad: !atWho,
        save: function () { var a = atWho, on = self.state.at.tags;
          var keep = a.tags.filter(function (t) { var x = tagOf(t); return x && x.sys; });
          var next = keep.concat(Object.keys(on).filter(function (k) { return on[k]; }));
          self.setState({ assign: self.state.assign.map(function (x) { return x.key === a.key ? Object.assign({}, x, { tags: next }) : x; }), modal: '', at: null });
          toast(self, 'Tags assigned to ' + a.name); } },
      toast: toastVals(s.toast, this)
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-tags" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="display" activeItem="Tags" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main tg-main">
          <div className="dv-between">
            <h1 className="dv-h1">Tags</h1>
            <NTV.Button variant="primary" size="xl" iconRight="plus" onClick={v.openNew}>Create Tag</NTV.Button>
          </div>

          {/* Stat cards: click one to filter Tags Data by that kind. */}
          <section className="tg-stats">
            {(v.cards || []).map((_k) => (
              <button key={_k.label} type="button" className="dv-card tg-stat" aria-pressed={_k.on} onClick={_k.pick} style={{ borderColor: `${s(_k.border)}` }}>
                <div className="dv-between" style={{ width: "100%", flexWrap: "nowrap" }}>
                  <div className="dv-row" style={{ gap: "20px" }}>
                    <NTV.IconTile icon={_k.icon} tone={_k.tone} />
                    <span className="tg-stat-label">{_k.label}</span>
                  </div>
                  <span className="tg-stat-n">{_k.n}</span>
                </div>
                <div className="dv-between" style={{ width: "100%", fontSize: "12px" }}>
                  <span className="dv-row" style={{ gap: "12px" }}>{"Last Week"}<NTV.Trend direction="down">-8.3%</NTV.Trend></span>
                  <span className="dv-row" style={{ gap: "12px" }}>{"This Week"}<NTV.Trend direction="up">+8.3%</NTV.Trend></span>
                </div>
              </button>
            ))}
          </section>

          <div className="tg-split">
            {/* ---------------- Left: Tags Data ---------------- */}
            <div className="tg-col">
              <div className="dv-between" style={{ flexWrap: "nowrap" }}>
                <div className="dv-row">
                  <NTV.Button variant="primary" size="xl" iconRight="tags" onClick={v.openAssign}>Assign Tags</NTV.Button>
                  {v.kindChip ? (
                    <button type="button" className="dv-chip" aria-pressed="true" onClick={v.clearKind}>{v.kindChip}<NTV.Icon name="x" size={v.i10} /></button>
                  ) : null}
                </div>
                <div className="dv-row" style={{ gap: "16px" }}>
                  <NTV.Input size="l" placeholder="Search by Tag, Assignee , Dealer, Host, Advertiser, License" iconLeft="magnifying-glass" label="Search tags" value={v.query} onChange={v.setQuery} style={{ width: "500px" }} />
                  <NTV.Button variant="primary" size="xl" iconRight="trash" disabled={v.bulkOff} onClick={v.bulkDelete} title={v.bulkOff ? "Select rows to remove their tags" : undefined}>Bulk Delete</NTV.Button>
                  <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportCsv}>Export</NTV.Button>
                </div>
              </div>
              <section className="dv-card tg-card">
                <div className="tg-card-head">
                  <h2 className="tg-card-title">Tags Data</h2>
                  <button type="button" className="tg-fab" aria-label="Refresh tags data" onClick={v.refreshData}><NTV.Icon name="arrows-rotate" size={v.i14} /></button>
                </div>
                <div className="tg-table">
                  <div className="tg-tr tg-th tg-data">
                    <div className="tg-c"><NTV.Checkbox checked={v.allOn} onChange={v.toggleAll} aria-label="Select all rows" /></div>
                    <div className="tg-c">#</div>
                    <div><button type="button" className="tg-hbtn" onClick={v.sortAssignee}>Assignee<NTV.Icon name={v.aSortIcon} size={v.i10} /></button></div>
                    <div><span className="tg-hbtn" style={{ cursor: "default" }}>Tags<NTV.Icon name="filter" size={v.i10} /></span></div>
                    <div>Actions</div>
                  </div>
                  {(v.rows || []).map((_r) => (
                    <div key={_r.key} className={"tg-tr tg-data" + (_r.checked ? " tg-sel" : "")}>
                      <div className="tg-c"><NTV.Checkbox checked={_r.checked} onChange={_r.toggle} aria-label={"Select " + _r.name} /></div>
                      <div className="tg-c">{_r.n}</div>
                      <div className="tg-ell" title={_r.kind + ": " + _r.name}>{_r.name}</div>
                      <div className="tg-chips">
                        {(_r.tags || []).map((_t) => (
                          <span key={_t.id} className="tg-pill" style={{ background: `${s(_t.color)}` }}>
                            {_t.name}
                            {!_t.sys ? <button type="button" className="tg-pill-x" aria-label={"Remove " + _t.name} onClick={_t.remove}><NTV.Icon name="x" size={v.i10} /></button> : null}
                          </span>
                        ))}
                      </div>
                      <div><button type="button" className="dv-ib dv-danger" aria-label={"Remove tags from " + _r.name} onClick={_r.remove}><NTV.Icon name="trash" size={v.i14} /></button></div>
                    </div>
                  ))}
                  {v.empty ? <div className="dv-empty">No tagged items match.</div> : null}
                </div>
              </section>
              <div className="dv-foot tg-foot">
                <span>{"Showing "}{v.shown}{" of "}{v.matched}{" items"}</span>
                {v.hasMore ? <button type="button" onClick={v.more}>Show More...</button> : null}
              </div>
            </div>

            {/* ---------------- Right: Tags Management ---------------- */}
            <section className="dv-card tg-card tg-manage">
              <div className="tg-card-head">
                <h2 className="tg-card-title">Tags Management</h2>
                <button type="button" className="tg-fab" aria-label="Refresh tags list" onClick={v.refreshTags}><NTV.Icon name="arrows-rotate" size={v.i14} /></button>
              </div>
              <div className="tg-table">
                <div className="tg-tr tg-th tg-mgmt">
                  <div className="tg-c">#</div>
                  <div><button type="button" className="tg-hbtn" onClick={v.sortName}>Name<NTV.Icon name={v.nameSortIcon} size={v.i10} /></button></div>
                  <div><button type="button" className="tg-hbtn" onClick={v.sortTotal}>Total<NTV.Icon name={v.totalSortIcon} size={v.i10} /></button></div>
                  <div>Actions</div>
                </div>
                {(v.tagRows || []).map((_t) => (
                  <div key={_t.n + _t.name} className="tg-tr tg-mgmt">
                    <div className="tg-c">{_t.n}</div>
                    <div><span className="tg-pill" style={{ background: `${s(_t.color)}` }}>{_t.name}</span></div>
                    <div>{_t.total}</div>
                    <div className="dv-row" style={{ gap: "6px" }}>
                      {_t.locked ? (
                        <span className="tg-locked" title="System tags are managed by NTV360"><NTV.Icon name="lock" size={v.i12} />System</span>
                      ) : (
                        <>
                          <button type="button" className="dv-ib tg-edit" aria-label={"Edit " + _t.name} onClick={_t.edit}><NTV.Icon name="pencil" size={v.i14} /></button>
                          <button type="button" className="dv-ib dv-danger" aria-label={"Delete " + _t.name} onClick={_t.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="dv-foot tg-foot" style={{ marginTop: "16px" }}>
                <span>{"Showing "}{v.tagShown}{" of "}{v.tagTotal}{" items"}</span>
                {v.tagMore ? <button type="button" onClick={v.moreTags}>Show More...</button> : null}
              </div>
            </section>
          </div>
        </main>
      </div>

      {v.m?.form ? (
        <div className="dv-ov">
          <NTV.Modal title={v.fm?.title} width={v.w460} onClose={v.closeModal}>
            <label className="dv-label" htmlFor="tg-n">Tag name</label>
            <input id="tg-n" className="dv-field" placeholder="ex. ONN_Raku" value={v.fm?.name} onChange={v.fm?.setName} />
            <span className="dv-label" style={{ marginTop: "14px" }}>Color</span>
            <div className="dv-row" style={{ gap: "10px" }}>
              {(v.fm?.colors || []).map((_c) => (
                <button key={_c.name} type="button" className="tg-sw" aria-label={_c.name} aria-pressed={_c.on} onClick={_c.pick} style={{ background: `${s(_c.color)}` }} />
              ))}
            </div>
            <div style={{ marginTop: "14px" }}><span className="tg-pill" style={{ background: `${s(v.fm?.previewColor)}` }}>{v.fm?.preview}</span></div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.fm?.bad} onClick={v.fm?.save}>Save</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
      ) : null}
      {v.m?.assign ? (
        <div className="dv-ov">
          <NTV.Modal title="Assign Tags" width={v.w560} onClose={v.closeModal}>
            <p className="dv-sub" style={{ margin: "-12px 0 16px" }}>Pick a host, advertiser, license or screen, then choose its tags.</p>
            <span className="dv-label">Assignee</span>
            <NTV.Select size="l" placeholder="Select an assignee" options={v.at?.whoOptions} value={v.at?.who} onChange={v.at?.setWho} />
            <span className="dv-label" style={{ marginTop: "14px" }}>Tags</span>
            <div className="tg-pick">
              {(v.at?.tags || []).map((_t) => (
                <button key={_t.name} type="button" className="tg-pickbtn" aria-pressed={_t.on} disabled={v.at?.bad} onClick={_t.toggle} style={_t.on ? { background: `${s(_t.color)}`, borderColor: `${s(_t.color)}`, color: "var(--white)" } : { color: `${s(_t.color)}`, borderColor: `${s(_t.color)}` }}>
                  {_t.on ? <NTV.Icon name="check" size={v.i10} /> : null}{_t.name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.at?.bad} onClick={v.at?.save}>Assign Tags</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
      ) : null}
      {v.m?.del ? (
        <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Delete Tag?" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.delText}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doDelete}>Delete</button>
            </div>
          </NTV.StatusModal>
        </div>
      ) : null}
      {v.m?.rm ? (
        <div className="dv-ov">
          <NTV.StatusModal status="warning" title={v.rm?.title} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.rm?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doRemove}>Remove</button>
            </div>
          </NTV.StatusModal>
        </div>
      ) : null}
      <Toast t={v.toast} />
    </div>
    </div>
));

export default Component;
