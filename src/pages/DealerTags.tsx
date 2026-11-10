// @ts-nocheck
/**
 * Page: Tags  (route /tags)
 * Converted from the Claude Design artboard DealerTags.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, byId, contains, go, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerTags.css';

/* ============================== Logic ============================== */

var TC = { info: ['var(--info-600)', 'var(--info-050)'], warning: ['var(--warning-600)', 'var(--warning-050)'], teal: ['var(--teal-main)', 'rgba(20, 184, 166, 0.12)'], success: ['var(--success-600)', 'var(--success-050)'], purple: ['var(--purple-main)', 'rgba(139, 92, 246, 0.12)'], accent: ['var(--accent-action)', 'var(--accent-30)'], hotpink: ['var(--hot-pink-main)', 'rgba(236, 72, 153, 0.12)'] };
var KIND = { Host: ['DealerHostDetail.dc.html', 'id'], Advertiser: ['DealerAdvertiserDetail.dc.html', 'id'], License: ['DealerLicenseDetail.dc.html', 'id'], Screen: ['DealerScreenDetail.dc.html', 'id'] };
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { tags: D.tags.map(function (t) { return Object.assign({}, t); }), assign: D.assign.map(function (a) { return Object.assign({}, a, { tags: a.tags.slice() }); }), type: 'All', kind: '', query: '', open: '', modal: '', fm: null, target: '', toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var itemsOf = function (t) { return s.assign.filter(function (a) { return a.tags.indexOf(t.id) !== -1 && (!s.kind || a.kind === s.kind); }); };
    var rows = s.tags.filter(function (t) { if (s.type === 'Dealer' && t.sys) return false; if (s.type === 'System' && !t.sys) return false; if (s.kind && !itemsOf(t).length) return false; return contains(t.name + ' ' + itemsOf(t).map(function (a) { return a.name; }).join(' '), s.query); });
    var kindCount = function (k) { var m = {}; s.assign.forEach(function (a) { if (a.kind === k && a.tags.length) m[a.ref] = 1; }); return Object.keys(m).length; };
    var fm = s.fm || { name: '', color: 'info' };
    var tg = byId(s.tags, s.target);
    return {
      none: null, i10: 10, i12: 12, i14: 14, w460: 460,
      cards: [['Host', 'Hosts', 'location-dot', 'info'], ['Advertiser', 'Advertisers', 'tag', 'teal'], ['License', 'Licenses', 'id-card', 'hot-pink'], ['Screen', 'Screens', 'tv', 'purple']].map(function (k) {
        return { label: k[1], n: kindCount(k[0]), icon: k[2], tone: k[3], border: s.kind === k[0] ? 'var(--accent-action)' : 'var(--container-border)', pick: function () { self.setState({ kind: self.state.kind === k[0] ? '' : k[0] }); } };
      }),
      types: [['All', s.tags.length], ['Dealer', s.tags.filter(function (t) { return !t.sys; }).length], ['System', s.tags.filter(function (t) { return t.sys; }).length]].map(function (t) { return { label: t[0] === 'Dealer' ? 'My Tags' : (t[0] === 'System' ? 'System Tags' : 'All'), n: t[1], on: s.type === t[0], pick: function () { self.setState({ type: t[0] }); } }; }),
      hasKind: !!s.kind, kind: s.kind + 's', clearKind: function () { self.setState({ kind: '' }); },
      query: s.query, setQuery: function (v) { self.setState({ query: val(v) }); },
      rows: rows.map(function (t, i) {
        var its = itemsOf(t), c = TC[t.color] || TC.info;
        return { n: i + 1, name: t.name, color: c[0], tint: c[1], type: t.sys ? 'System' : 'My Tag', typeColor: t.sys ? 'var(--fg-secondary)' : 'var(--accent-action)', typeTint: t.sys ? 'var(--primary-100)' : 'var(--accent-30)',
          count: its.length, preview: its.map(function (a) { return a.name; }).join(', ') || '—', editable: !t.sys, locked: t.sys, open: s.open === t.id, none: its.length === 0,
          items: its.map(function (a) { var k = KIND[a.kind]; return { kind: a.kind, name: a.name, href: k[0], go: navFn(k[0], { id: a.ref }) }; }),
          toggle: function () { self.setState({ open: self.state.open === t.id ? '' : t.id }); },
          edit: function () { self.setState({ modal: 'form', target: t.id, fm: { mode: 'edit', name: t.name, color: t.color } }); },
          remove: function () { self.setState({ modal: 'del', target: t.id }); } };
      }),
      empty: rows.length === 0,
      m: { form: s.modal === 'form', del: s.modal === 'del' },
      closeModal: function () { self.setState({ modal: '' }); },
      openNew: function () { self.setState({ modal: 'form', fm: { mode: 'new', name: '', color: 'info' } }); },
      fm: { title: fm.mode === 'edit' ? 'Edit Tag' : 'New Tag', name: fm.name, bad: !fm.name.trim() || s.tags.some(function (t) { return t.name.toLowerCase() === fm.name.trim().toLowerCase() && t.id !== (fm.mode === 'edit' ? s.target : ''); }),
        setName: function (v) { self.setState({ fm: Object.assign({}, self.state.fm, { name: val(v) }) }); },
        colors: ['info', 'warning', 'teal', 'success', 'purple', 'accent'].map(function (k) { return { name: k, color: TC[k][0], on: fm.color === k, pick: function () { self.setState({ fm: Object.assign({}, self.state.fm, { color: k }) }); } }; }),
        save: function () { var x = self.state.fm;
          if (x.mode === 'edit') { self.setState({ tags: self.state.tags.map(function (t) { return t.id === self.state.target ? Object.assign({}, t, { name: x.name.trim(), color: x.color }) : t; }), modal: '' }); toast(self, 'Tag updated'); }
          else { self.setState({ tags: self.state.tags.concat([{ id: 't' + Date.now(), name: x.name.trim(), color: x.color, sys: false }]), modal: '' }); toast(self, 'Tag “' + x.name.trim() + '” created'); } } },
      delText: tg ? (function () { var n = s.assign.filter(function (a) { return a.tags.indexOf(tg.id) !== -1; }).length; return n ? 'Delete “' + tg.name + '”? It will be removed from ' + n + ' item(s) it’s assigned to.' : 'Delete “' + tg.name + '”? It isn’t assigned to anything.'; })() : '',
      doDelete: function () { var id = self.state.target; self.setState({ tags: self.state.tags.filter(function (t) { return t.id !== id; }), assign: self.state.assign.map(function (a) { return Object.assign({}, a, { tags: a.tags.filter(function (x) { return x !== id; }) }); }), modal: '' }); toast(self, 'Tag deleted'); },
      toast: toastVals(s.toast)
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
        <main className="dv-main">
          <div className="dv-between" style={{ paddingTop: "5px" }}>
            <h1 className="dv-h1">Tags</h1>
            <NTV.Button variant="primary" size="xl" iconRight="plus" onClick={v.openNew}>New Tag</NTV.Button>
          </div>
          <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }}>
            {(v.cards || []).map((_k, $index) => (
              <React.Fragment key={$index}>
                <button type="button" className="dv-card dv-row" onClick={_k?.pick} style={{ cursor: "pointer", fontFamily: "inherit", textAlign: "left", borderColor: `${s(_k?.border)}` }}>
                  <NTV.IconTile icon={_k?.icon} tone={_k?.tone} />
                  <span className="dv-kv">
                    <span>{"Tagged "}{_k?.label}</span>
                    <span style={{ fontSize: "24px", lineHeight: "32px" }}>{_k?.n}</span>
                  </span>
                </button>
              </React.Fragment>
            ))}
          </section>
          <div className="dv-between">
            <div role="group" aria-label="Tag type" className="dv-row" style={{ gap: "8px" }}>
              {(v.types || []).map((_t, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className="dv-chip" aria-pressed={_t?.on} onClick={_t?.pick}>
                    {_t?.label}{" "}
                    <span style={{ color: "var(--fg-secondary)" }}>{_t?.n}</span>
                  </button>
                </React.Fragment>
              ))}
              {v.hasKind ? (
                <>
                  <button type="button" className="dv-chip" aria-pressed="true" onClick={v.clearKind}>
                  {v.kind}
                  <NTV.Icon name="x" size={v.i10} />
                </button>
                </>
              ) : null}
            </div>
            <NTV.Input size="l" placeholder="Search tag name or tagged item" iconLeft="magnifying-glass" label="Search tags" value={v.query} onChange={v.setQuery} style={{ width: "400px" }} />
          </div>
          <section className="dv-card" style={{ padding: "0", overflow: "hidden" }}>
            <div className="tg-row" style={{ borderTop: "0", background: "var(--bg-app)", fontWeight: "700", color: "var(--fg-secondary)", fontSize: "12px", minHeight: "44px" }}>
              <div style={{ textAlign: "center" }}>#</div>
              <div>Tag</div>
              <div>Type</div>
              <div>Assigned</div>
              <div>Tagged items</div>
              <div>Actions</div>
            </div>
            {(v.rows || []).map((_r, $index) => (
              <React.Fragment key={$index}>
                <div className="tg-row">
                  <div style={{ textAlign: "center" }}>{_r?.n}</div>
                  <div>
                    <span className="dv-pill" style={{ background: `${s(_r?.tint)}`, color: `${s(_r?.color)}` }}>
                      <NTV.Icon name="tag" size={v.i10} />
                      {_r?.name}
                    </span>
                  </div>
                  <div>
                    <span className="dv-pill" style={{ background: `${s(_r?.typeTint)}`, color: `${s(_r?.typeColor)}`, height: "22px", fontSize: "11px" }}>{_r?.type}</span>
                  </div>
                  <div>
                    <button type="button" className="dv-a" onClick={_r?.toggle}>{_r?.count}{" item(s)"}</button>
                  </div>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--fg-secondary)" }}>{_r?.preview}</div>
                  <div className="dv-row" style={{ gap: "2px" }}>
                    {_r?.editable ? (
                      <>
                        <button type="button" className="dv-ib dv-edit" aria-label="Edit tag" onClick={_r?.edit}><NTV.Icon name="pen-to-square" size={v.i14} /></button>
                        <button type="button" className="dv-ib dv-danger" aria-label="Delete tag" onClick={_r?.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                      </>
                    ) : null}
                    {_r?.locked ? (
                      <>
                        <span className="dv-row dv-sub" style={{ gap: "6px" }} title="System tags are managed by NTV360">
                        <NTV.Icon name="lock" size={v.i12} />
                        Locked
                      </span>
                      </>
                    ) : null}
                  </div>
                </div>
                {_r?.open ? (
                  <>
                    <div style={{ padding: "10px 20px 16px 64px", background: "var(--primary-050)", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {(_r?.items || []).map((_it, $index) => (
                      <React.Fragment key={$index}>
                        <a href={_it?.href} onClick={_it?.go} className="dv-chip" style={{ textDecoration: "none" }} data-nav={_it?.goNav}>
                          <span style={{ color: "var(--fg-secondary)" }}>{_it?.kind}</span>
                          {_it?.name}
                        </a>
                      </React.Fragment>
                    ))}
                    {_r?.none ? (
                      <>
                        <span className="dv-sub">Nothing tagged yet.</span>
                      </>
                    ) : null}
                  </div>
                  </>
                ) : null}
              </React.Fragment>
            ))}
            {v.empty ? (
              <>
                <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No tags match.</div>
              </>
            ) : null}
          </section>
          <p className="dv-sub">
            System tags (TV_Online, No_Programmatic, DNI-Dealer) are set by NTV360 and can’t be edited or deleted.
          </p>
        </main>
      </div>
      {v.m?.form ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={v.fm?.title} width={v.w460} onClose={v.closeModal}>
            <label className="dv-label" htmlFor="tg-n">Tag name</label>
            <input id="tg-n" className="dv-field" placeholder="ex. Breakfast" value={v.fm?.name} onChange={v.fm?.setName} />
            <span className="dv-label" style={{ marginTop: "14px" }}>Color</span>
            <div className="dv-row" style={{ gap: "10px" }}>
              {(v.fm?.colors || []).map((_c, $index) => (
                <React.Fragment key={$index}>
                  <button type="button" className="tg-sw" aria-label={_c?.name} aria-pressed={_c?.on} onClick={_c?.pick} style={{ background: `${s(_c?.color)}` }} />
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.fm?.bad} onClick={v.fm?.save}>Save</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.del ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Delete Tag?" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.delText}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doDelete}>Delete</button>
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
