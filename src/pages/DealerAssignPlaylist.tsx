// @ts-nocheck
/**
 * Page: Create Screen · 2 Assign Playlist  (route /screens/new/assign-playlist)
 * Converted from the Claude Design artboard DealerAssignPlaylist.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, byId, draft, mediaEntries, navFn, peekNav, screenName, toast, toastVals, D } from '../lib/shared';
import ContentBlock from '../components/ContentBlock';
import ContentThumb from '../components/ContentThumb';
import DealerNav from '../components/DealerNav';
import ZoneArea from '../components/ZoneArea';
import ZoneListItem from '../components/ZoneListItem';
import './DealerAssignPlaylist.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { assign: { main: '', vertical: '', horizontal: '', background: '' }, selected: '', expanded: '', toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state, d = draft();
    var cover = function (p) { var m = byId(D.media, p.items[0]); return m ? m.image : ''; };
    var zones = [{ id: 'main', label: 'Main' }, { id: 'vertical', label: 'Vertical' }, { id: 'horizontal', label: 'Horizontal' }, { id: 'background', label: 'Background' }];
    var select = function (id) { self.setState({ selected: id, expanded: id }); };
    var pl = function (id) { return byId(D.playlists, s.assign[id]); };
    var zoneVals = function (id) { var p = pl(id); return { image: p ? cover(p) : '', selected: s.selected === id, select: function () { select(id); } }; };
    var assignedIds = zones.map(function (z) { return s.assign[z.id]; }).filter(Boolean);
    var pv = { showPlaylist: false, isAll: false, hasItems: false, isEmpty: true, entries: [], playlistName: '', showing: '', emptyTarget: 'any zones', open: function () {} };
    var selZone = zones.filter(function (z) { return z.id === s.selected; })[0];
    if (selZone && pl(selZone.id)) {
      var p = pl(selZone.id);
      pv = { showPlaylist: true, isAll: false, hasItems: true, isEmpty: false, entries: mediaEntries(p.items, p.block), playlistName: p.name, showing: selZone.label, emptyTarget: '', open: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) };
    } else if (selZone) { pv.emptyTarget = selZone.label; }
    else if (assignedIds.length) {
      var seen = {}, all = [];
      assignedIds.forEach(function (id) { if (!seen[id]) { seen[id] = true; all = all.concat(byId(D.playlists, id).items); } });
      pv = { showPlaylist: false, isAll: true, hasItems: true, isEmpty: false, entries: mediaEntries(all, false), playlistName: '', showing: 'All Contents', emptyTarget: '', open: function () {} };
    }
    var bgPl = pl('background'), bgSel = s.selected === 'background';
    return {
      yes: true, none: null, iconSm: 10, iconMd: 14, iconLg: 32, stepIndex: 1,
      steps: [{ label: 'Setup', state: 'done' }, { label: 'Assign Playlist to Zones' }, { label: 'Publish to Licenses' }],
      crumbs: [{ label: 'Screens', href: 'DealerScreens.dc.html' }, 'Create Screen'],
      screenName: d.name || 'Untitled Screen',
      zoneList: zones.map(function (z) {
        var p = pl(z.id);
        return { label: z.label, playlistName: p ? p.name : '', expanded: s.expanded === z.id, selected: s.selected === z.id,
          toggle: function () { if (self.state.expanded === z.id) self.setState({ expanded: '' }); else select(z.id); },
          options: D.playlists.map(function (q) { return { name: q.name, pick: function () { var a = Object.assign({}, self.state.assign); a[z.id] = q.id; self.setState({ assign: a, selected: z.id, expanded: '' }); } }; }) };
      }),
      zm: zoneVals('main'), zv: zoneVals('vertical'), zh: zoneVals('horizontal'),
      bg: { selected: bgSel, assigned: !!bgPl, image: bgPl ? cover(bgPl) : '', fill: !bgPl && bgSel ? 'var(--accent-action)' : '#b4ccfb', borderStyle: bgPl && bgSel ? 'solid' : 'dashed', borderColor: bgSel ? 'var(--accent-action)' : '#8ba7e9', select: function () { select('background'); } },
      assignedCount: assignedIds.length, zoneCount: zones.length, pv: pv,
      cannotProceed: assignedIds.length < zones.length, canProceed: assignedIds.length >= zones.length,
      reload: function () { toast(self, D.playlists.length + ' playlists loaded', 'info'); },
      save: function () { var z = {}; zones.forEach(function (x) { z[x.label] = byId(D.playlists, s.assign[x.id]).name; }); draft(Object.assign({}, d, { zones: z })); },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-assign-playlist" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="display" activeItem="Screens" />
      </div>
      <div className="dv-scroll">
        <div style={{ padding: "20px 20px 0" }}><NTV.Breadcrumbs items={v.crumbs} /></div>
        <main style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "1540px", margin: "0 auto", padding: "20px 20px 40px", boxSizing: "border-box" }}>
          <h1 style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", margin: "0" }}>Create Screen: Assign Playlist to Zones</h1>
          <section className="dv-card" aria-label="Progress" style={{ overflowX: "auto" }}><NTV.Stepper steps={v.steps} current={v.stepIndex} style={{ width: "100%" }} /></section>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "20px" }}>
            <section className="dv-card" aria-labelledby="zones-title" style={{ flex: "1 1 380px", maxWidth: "484px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="dv-between">
                <h2 id="zones-title" className="dv-h2">Zones</h2>
                <button type="button" className="dv-a" onClick={v.reload} style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: "400", fontSize: "14px" }}>
                  <span>Reload Playlists</span>
                  <NTV.Icon name="arrow-rotate-right" size={v.iconMd} />
                </button>
              </div>
              <p className="dv-sub" style={{ marginTop: "-8px" }}>Only playlists you own are listed.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(v.zoneList || []).map((_z, $index) => (
                  <React.Fragment key={$index}>
                    <ZoneListItem label={_z?.label} playlist={_z?.playlistName} expanded={_z?.expanded} selected={_z?.selected} playlists={_z?.options} onToggle={_z?.toggle} checkWhenAssigned={v.yes} />
                  </React.Fragment>
                ))}
              </div>
            </section>
            <section className="dv-card" aria-labelledby="screen-title" style={{ flex: "999 1 560px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h2 id="screen-title" className="dv-h2">{v.screenName}</h2>
                  <p className="dv-p" style={{ lineHeight: "20px" }}>Click on a Zone to assign a playlist to it or use the Zone list.</p>
                </div>
                <div role="status" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 12px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "600", color: "var(--accent-action)" }}>{v.assignedCount}{" / "}{v.zoneCount}</span>
                  <span className="dv-p" style={{ lineHeight: "20px" }}>Zones Assigned</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                <button type="button" aria-pressed={v.bg?.selected} onClick={v.bg?.select} style={{ display: "inline-flex", alignItems: "center", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--white)", background: "#5273c0", color: "var(--white)", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", lineHeight: "20px", fontWeight: "600" }}>Background</button>
                <button type="button" aria-label="Assign a playlist to the Background" onClick={v.bg?.select} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", padding: "0", borderRadius: "var(--radius-full)", border: "1px solid var(--white)", background: "#5273c0", color: "var(--white)", cursor: "pointer" }}><NTV.Icon name="plus-solid" size={v.iconSm} /></button>
              </div>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
                <button type="button" className="bg-zone" aria-label="Background zone" aria-pressed={v.bg?.selected} onClick={v.bg?.select} style={{ position: "absolute", inset: "0", padding: "0", overflow: "hidden", cursor: "pointer", border: `2px ${s(v.bg?.borderStyle)} ${s(v.bg?.borderColor)}`, background: `${s(v.bg?.fill)}` }}>
                  {v.bg?.assigned ? (
                    <>
                      <img src={v.bg?.image} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </>
                  ) : null}
                </button>
                <div style={{ position: "absolute", inset: "0", boxSizing: "border-box", padding: "12px", display: "grid", gridTemplateColumns: "753fr 165fr", gridTemplateRows: "417fr 89fr", gap: "10px", pointerEvents: "none" }}>
                  <div style={{ gridColumn: "1 / 2", gridRow: "1 / 2", minWidth: "0", minHeight: "0", pointerEvents: "auto", display: "flex" }}>
                    <div style={{ width: "100%", height: "100%" }}>
                      <ZoneArea label="Main" image={v.zm?.image} selected={v.zm?.selected} onSelect={v.zm?.select} />
                    </div>
                  </div>
                  <div style={{ gridColumn: "2 / 3", gridRow: "1 / 2", minWidth: "0", minHeight: "0", pointerEvents: "auto", display: "flex" }}>
                    <div style={{ width: "100%", height: "100%" }}>
                      <ZoneArea label="Vertical" image={v.zv?.image} selected={v.zv?.selected} onSelect={v.zv?.select} />
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / 3", gridRow: "2 / 3", minWidth: "0", minHeight: "0", pointerEvents: "auto", display: "flex" }}>
                    <div style={{ width: "100%", height: "100%" }}>
                      <ZoneArea label="Horizontal" image={v.zh?.image} selected={v.zh?.selected} onSelect={v.zh?.select} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <section className="dv-card" aria-labelledby="preview-title" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="dv-between">
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", minHeight: "32px" }}>
                <h2 id="preview-title" className="dv-h2">Playlist Content Preview</h2>
                {v.pv?.showPlaylist ? (
                  <>
                    <span className="dv-p" style={{ lineHeight: "20px" }}>
                    {"( "}
                    <a href="DealerPlaylistDetail.dc.html" onClick={v.pv?.open} style={{ textDecoration: "underline", textUnderlineOffset: "2px" }} data-nav={v.pv?.openNav}>{v.pv?.playlistName}</a>
                    {" )"}
                  </span>
                  </>
                ) : null}
                {v.pv?.isAll ? (
                  <>
                    <span className="dv-p" style={{ lineHeight: "20px" }}>(Select a zone to show its playlist)</span>
                  </>
                ) : null}
              </div>
              {v.pv?.hasItems ? (
                <>
                  <p style={{ margin: "0", display: "flex", gap: "8px", fontSize: "16px", lineHeight: "24px" }}>
                  <span style={{ fontWeight: "600", color: "var(--fg-secondary)" }}>Showing</span>
                  <strong style={{ color: "var(--accent-action)" }}>{v.pv?.showing}</strong>
                </p>
                </>
              ) : null}
            </div>
            {v.pv?.hasItems ? (
              <>
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
              </>
            ) : null}
            {v.pv?.isEmpty ? (
              <>
                <div className="dv-empty" style={{ minHeight: "136px", padding: "20px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ color: "var(--primary-700)" }}><NTV.Icon name="rectangle-history-solid" size={v.iconLg} /></span>
                <p style={{ margin: "0" }}>
                  {"No playlist assigned to "}
                  <strong style={{ color: "var(--fg-primary)" }}>{v.pv?.emptyTarget}</strong>
                  {" yet. Pick one from the list to see its content here."}
                </p>
              </div>
              </>
            ) : null}
          </section>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <a href="DealerNewScreen.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--neutral ntv-btn--xl" style={{ minWidth: "100px", textDecoration: "none" }}>Back</a>
            {v.cannotProceed ? (
              <>
                <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.yes} style={{ minWidth: "100px" }}>Proceed</NTV.Button>
              </>
            ) : null}
            {v.canProceed ? (
              <>
                <a href="DealerPublish.dc.html" onClick={v.save} className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ minWidth: "100px", textDecoration: "none" }} data-nav={v.saveNav}>Proceed</a>
              </>
            ) : null}
          </div>
        </main>
      </div>
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
