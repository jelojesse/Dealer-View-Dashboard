// @ts-nocheck
/**
 * Page: Channel (view only)  (route /channels/detail)
 * Converted from the Claude Design artboard DealerChannelDetail.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, arrived, byId, contains, go, navFn, peekNav, screenName, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerChannelDetail.css';

/* ============================== Logic ============================== */

function mineIds() { try { var v = JSON.parse(localStorage.getItem('ntvChannels') || 'null'); if (v) return v; } catch (e) {} return D.channels.filter(function (c) { return c.mine; }).map(function (c) { return c.id; }); }
class Component extends DCLogic {
  constructor(props) { super(props); var f = arrived('DealerChannelDetail.dc.html') || {}; var mine = mineIds(); this.state = { c: byId(D.channels, f.id) || byId(D.channels, mine[0]) || D.channels[0], tab: 'Contents', modal: '', pi: 0, q: '', sel: 0 }; }
  renderVals() {
    var self = this, s = this.state, c = s.c;
    var idx = parseInt(c.id.slice(1), 10);
    var pls = D.playlists.filter(function (p, i) { return (i + idx) % 4 === 0; }).slice(0, 3);
    var scs = {}; pls.forEach(function (p) { p.screens.forEach(function (x) { scs[x] = 1; }); });
    var contents = []; for (var i = 0; i < Math.min(c.contents, 12); i++) { var m = D.media[(idx * 3 + i) % D.media.length]; contents.push({ i: i, image: i === 0 ? c.image : m.image, title: c.name + ' · Episode ' + (i + 1), meta: (30 + (i * 17) % 90) + ' sec', size: (4 + i % 9) + '.2 MB' }); }
    var mine = mineIds().indexOf(c.id) !== -1;
    return {
      none: null, i10: 10, i14: 14, w460: 460, w900: 900,
      crumbs: [{ label: 'Channel Manager', href: 'DealerChannels.dc.html' }, c.name],
      c: c, plCount: pls.length, scCount: Object.keys(scs).length, notMine: !mine,
      tabs: [['Contents', 'Channel Contents'], ['Playing Where', 'Playing Where']].map(function (t) { return { label: t[1], on: s.tab === t[0], pick: function () { self.setState({ tab: t[0] }); } }; }),
      isContents: s.tab === 'Contents', isWhere: s.tab === 'Playing Where',
      q: s.q, setQ: function (v) { self.setState({ q: val(v) }); },
      sel: contents[s.sel % contents.length],
      contents: contents.filter(function (x) { return contains(x.title, s.q); }).map(function (x) { return Object.assign({}, x, { border: s.sel === x.i ? 'var(--accent-action)' : 'var(--container-border)', pick: function () { self.setState({ sel: x.i }); } }); }),
      where: pls.map(function (p, i) { var lic = 0; p.screens.forEach(function (x) { var sc = byId(D.screens, x); lic += sc ? sc.lic.length : 0; }); return { n: i + 1, name: p.name, screens: p.screens.map(screenName).slice(0, 2).join(', ') + (p.screens.length > 2 ? ' +' + (p.screens.length - 2) : ''), lic: lic, open: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) }; }),
      noWhere: pls.length === 0,
      m: { preview: s.modal === 'preview', unassign: s.modal === 'unassign' },
      closeModal: function () { self.setState({ modal: '' }); },
      openPreview: function () { self.setState({ modal: 'preview', pi: 0 }); },
      previewImg: contents[s.pi % contents.length].image, previewLabel: contents[s.pi % contents.length].title, previewPos: (s.pi % contents.length + 1) + ' / ' + contents.length,
      prev: function () { self.setState({ pi: (self.state.pi - 1 + contents.length) % contents.length }); },
      next: function () { self.setState({ pi: (self.state.pi + 1) % contents.length }); },
      askUnassign: function () { self.setState({ modal: 'unassign' }); },
      unassignText: pls.length ? c.name + ' will be removed from My Channels and from ' + pls.length + ' playlist(s), so it stops playing on ' + Object.keys(scs).length + ' screen(s). You can add it again from the Showcase.' : c.name + ' will be removed from My Channels. You can add it again from the Showcase.',
      doUnassign: function () { try { localStorage.setItem('ntvChannels', JSON.stringify(mineIds().filter(function (x) { return x !== c.id; }))); } catch (e) {} var a = document.querySelector('a[data-go="DealerChannels.dc.html"]'); if (a) a.click(); }
    };
  }
}

;(function () { var P = 'DealerChannelDetail.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-channel-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="channel" activeItem="" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <NTV.Breadcrumbs items={v.crumbs} />
          <div className="dv-between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="dv-row" style={{ gap: "10px" }}>
                <h1 style={{ margin: "0", fontSize: "20px", lineHeight: "30px", fontWeight: "700" }}>{v.c?.name}</h1>
                <span className="dv-pill" style={{ background: "var(--info-050)", color: "var(--info-600)", height: "20px", fontSize: "10px" }}>{v.c?.genre}</span>
                <span className="dv-pill" style={{ background: "var(--primary-100)", color: "var(--fg-secondary)", height: "20px", fontSize: "10px" }}>
                  <NTV.Icon name="lock" size={v.i10} />
                  View only
                </span>
              </div>
              <p className="dv-sub">
                {"Curated by NTV360 · "}{v.c?.mins}{" min loop · "}{v.c?.contents}{" contents · in "}{v.plCount}{" playlist(s) on "}{v.scCount}{" screen(s)"}
              </p>
            </div>
            <div className="dv-row">
              <NTV.Button variant="secondary" size="xl" iconRight="play" onClick={v.openPreview}>Preview</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight="minus" disabled={v.notMine} onClick={v.askUnassign}>Unassign Channel</NTV.Button>
            </div>
          </div>
          <div className="dv-tabs" role="tablist">
            {(v.tabs || []).map((_t, $index) => (
              <React.Fragment key={$index}>
                <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick} style={{ minWidth: "140px" }}>{_t?.label}</button>
              </React.Fragment>
            ))}
          </div>
          {v.isContents ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: "20px", alignItems: "start" }}>
              <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="dv-between">
                  <h2 className="dv-h3">Channel Contents</h2>
                  <span className="dv-sub">All contents ({v.c?.contents})</span>
                </div>
                <div className="dv-between">
                  <span className="dv-sub">Click a content to see its details</span>
                  <NTV.Input size="l" placeholder="Search Channel Content" iconLeft="magnifying-glass" label="Search content" value={v.q} onChange={v.setQ} style={{ width: "280px" }} />
                </div>
                <div className="dv-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                  {(v.contents || []).map((_m, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" onClick={_m?.pick} style={{ padding: "0", border: `2px solid ${s(_m?.border)}`, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-surface)", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                        <div className="dv-thumb" style={{ aspectRatio: "16 / 10", borderRadius: "0" }}>
                          <img src={_m?.image} alt="" />
                          <span style={{ position: "absolute", left: "6px", top: "6px", padding: "0 6px", borderRadius: "4px", background: "#fff", fontSize: "9px", lineHeight: "16px", fontWeight: "700", color: "var(--danger-main)" }}>VIDEO</span>
                        </div>
                        <div style={{ padding: "6px 8px", fontSize: "11px", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--fg-primary)" }}>{_m?.title}</div>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </section>
              <aside className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="dv-thumb" style={{ aspectRatio: "16 / 10" }}><img src={v.sel?.image} alt="" /></div>
                <strong style={{ fontSize: "15px" }}>{v.sel?.title}</strong>
                <p className="dv-sub" style={{ fontSize: "11px" }}>NTV360 Content Team · Aug 28, 2026</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--bg-app)" }}>
                  <div className="dv-kv2">
                    <span>Content Duration</span>
                    <span>{v.sel?.meta}</span>
                  </div>
                  <div className="dv-kv2">
                    <span>Content Size</span>
                    <span>{v.sel?.size}</span>
                  </div>
                </div>
                <div className="dv-row" style={{ gap: "10px", padding: "10px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)" }}>
                  <span className="dv-thumb" style={{ width: "56px", height: "36px", flex: "none" }}><img src={v.c?.image} alt="" /></span>
                  <div style={{ minWidth: "0" }}>
                    <strong style={{ fontSize: "13px" }}>{v.c?.name}</strong>
                    <p className="dv-sub" style={{ fontSize: "10px" }}>Channel thumbnail · managed by NTV360</p>
                  </div>
                </div>
              </aside>
            </div>
            </>
          ) : null}
          {v.isWhere ? (
            <>
              <section className="dv-card">
              <div className="dv-table">
                <div role="table" aria-label="Playing where">
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: "50px 1.4fr 1.6fr 100px" }}>
                    <div style={{ textAlign: "center" }}>#</div>
                    <div>Playlist</div>
                    <div>Screens</div>
                    <div>Licenses</div>
                  </div>
                  {(v.where || []).map((_w, $index) => (
                    <React.Fragment key={$index}>
                      <div role="row" className="dv-tr" style={{ gridTemplateColumns: "50px 1.4fr 1.6fr 100px" }}>
                        <div style={{ textAlign: "center" }}>{_w?.n}</div>
                        <div>
                          <a className="dv-a" href="DealerPlaylistDetail.dc.html" onClick={_w?.open} data-nav={_w?.openNav}>{_w?.name}</a>
                        </div>
                        <div>{_w?.screens}</div>
                        <div>{_w?.lic}</div>
                      </div>
                    </React.Fragment>
                  ))}
                  {v.noWhere ? (
                    <>
                      <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>Not in any playlist yet. Add it from a playlist’s Add Content.</div>
                    </>
                  ) : null}
                </div>
              </div>
            </section>
            </>
          ) : null}
        </main>
      </div>
      {v.m?.preview ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={`Preview · ${s(v.c?.name)}`} width={v.w900} onClose={v.closeModal}>
            <div className="dv-thumb" style={{ aspectRatio: "16 / 9", borderRadius: "var(--radius-md)" }}>
              <img src={v.previewImg} alt="" />
              <span className="dv-pill" style={{ position: "absolute", left: "12px", bottom: "12px", background: "rgba(9,22,53,.7)", color: "var(--white)" }}>{v.previewLabel}</span>
            </div>
            <div className="dv-row" style={{ justifyContent: "center", marginTop: "12px" }}>
              <button type="button" className="dv-ib" aria-label="Previous" onClick={v.prev}>
                <NTV.Icon name="angle-down" size={v.i14} style={{ transform: "rotate(90deg)" }} />
              </button>
              <span className="dv-sub">{v.previewPos}</span>
              <button type="button" className="dv-ib" aria-label="Next" onClick={v.next}><NTV.Icon name="angle-right" size={v.i14} /></button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.unassign ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Unassign Channel?" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.unassignText}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doUnassign}>Unassign</button>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
    </div>
    </div>
));

export default Component;
