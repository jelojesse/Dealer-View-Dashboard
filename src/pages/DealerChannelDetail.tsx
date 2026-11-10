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
import FilterBy, { passes } from '../components/FilterBy';
import './DealerChannelDetail.css';

/* ============================== Logic ============================== */

function mineIds() { try { var v = JSON.parse(localStorage.getItem('ntvChannels') || 'null'); if (v) return v; } catch (e) {} return D.channels.filter(function (c) { return c.mine; }).map(function (c) { return c.id; }); }
var PAGE = 12;
var KIND = { image: ['Image', 'IMAGE', 'var(--info-main)'], video: ['Video', 'VIDEO', 'var(--danger-main)'] };
var DUR_BUCKETS = ['Under 30 sec', '30–60 sec', 'Over 60 sec'];
function secsOf(d) { var m = /(d+)s*min/.exec(d || ''), x = /(d+)s*sec/.exec(d || ''); return (m ? +m[1] * 60 : 0) + (x ? +x[1] : 0) || 15; }
function bucketOf(sec) { return sec < 30 ? DUR_BUCKETS[0] : sec <= 60 ? DUR_BUCKETS[1] : DUR_BUCKETS[2]; }
/* Deterministic per-channel content set drawn from the media library (image + video only).
   Media are grouped by picture and the group order is rotated per channel, so each run of
   ~15 items shows distinct images; later passes use the "2"/"3" variants of the same files. */
function channelContents(c) {
  var idx = parseInt(c.id.slice(1), 10) || 0, groups = [], byImg = {};
  D.media.forEach(function (m) { if (!KIND[m.kind]) return; if (!byImg[m.image]) { byImg[m.image] = []; groups.push(byImg[m.image]); } byImg[m.image].push(m); });
  var G = groups.length, start = (idx * 7) % G, out = [];
  for (var i = 0; i < c.contents; i++) {
    var g = groups[(start + i * (G % 2 ? 2 : 1)) % G], m = g[Math.floor(i / G) % g.length], k = KIND[m.kind], sec = secsOf(m.duration);
    out.push({ i: i, id: c.id + '-' + i, image: m.image, title: m.title, kind: k[0], badge: k[1], badgeColor: k[2], meta: m.duration || '15 sec', sec: sec, bucket: bucketOf(sec), size: m.size, uploaded: m.uploaded, by: (m.folder || 'Media Library') + ' · Uploaded ' + m.uploaded });
  }
  return out;
}
class Component extends DCLogic {
  constructor(props) { super(props); var f = arrived('DealerChannelDetail.dc.html') || {}; var mine = mineIds(); this.state = { c: byId(D.channels, f.id) || byId(D.channels, mine[0]) || D.channels[0], tab: 'Contents', modal: '', pi: 0, q: '', sel: 0, view: 'grid', filters: {}, marked: {}, deleted: {}, order: null, reorder: false, drag: null, limit: PAGE }; }
  renderVals() {
    var self = this, s = this.state, c = s.c;
    var idx = parseInt(c.id.slice(1), 10);
    var pls = D.playlists.filter(function (p, i) { return (i + idx) % 4 === 0; }).slice(0, 3);
    var scs = {}; pls.forEach(function (p) { p.screens.forEach(function (x) { scs[x] = 1; }); });
    if (!this._all || this._allFor !== c.id) { this._all = channelContents(c); this._allFor = c.id; }
    var base = this._all.filter(function (x) { return !s.deleted[x.i]; });
    if (s.order) { var pos = {}; s.order.forEach(function (n, k) { pos[n] = k; }); base = base.slice().sort(function (a, b) { return (pos[a.i] == null ? 1e6 + a.i : pos[a.i]) - (pos[b.i] == null ? 1e6 + b.i : pos[b.i]); }); }
    var contents = base.length ? base : [{ i: -1, image: c.image, title: c.name, meta: '—', size: '—', by: 'Media Library', badge: '', kind: '' }];
    var filtered = base.filter(function (x) { return passes(s.filters, 'type', x.kind) && passes(s.filters, 'duration', x.bucket) && contains(x.title, s.q); });
    var shownItems = filtered.slice(0, s.limit);
    var markedN = base.filter(function (x) { return s.marked[x.i]; }).length;
    var allMarked = filtered.length > 0 && filtered.every(function (x) { return s.marked[x.i]; });
    var selItem = contents.filter(function (x) { return x.i === s.sel; })[0] || contents[0];
    var setMark = function (i, on) { var mk = Object.assign({}, self.state.marked); if (on) mk[i] = true; else delete mk[i]; self.setState({ marked: mk }); };
    var dropOn = function (target) { var from = self.state.drag; if (from == null || from === target) return; var ids = base.map(function (x) { return x.i; }), a = ids.indexOf(from), b = ids.indexOf(target); ids.splice(a, 1); ids.splice(b, 0, from); self.setState({ order: ids, drag: null }); };
    var mine = mineIds().indexOf(c.id) !== -1;
    return {
      none: null, i10: 10, i14: 14, w460: 460, w900: 900,
      crumbs: [{ label: 'Channel Manager', href: 'DealerChannels.dc.html' }, c.name],
      c: c, plCount: pls.length, scCount: Object.keys(scs).length, notMine: !mine,
      tabs: [['Contents', 'Channel Contents'], ['Playing Where', 'Playing Where']].map(function (t) { return { label: t[1], on: s.tab === t[0], pick: function () { self.setState({ tab: t[0] }); } }; }),
      isContents: s.tab === 'Contents', isWhere: s.tab === 'Playing Where',
      q: s.q, setQ: function (v) { self.setState({ q: val(v), limit: PAGE }); },
      total: base.length, filteredN: filtered.length, shownN: shownItems.length, hasMore: filtered.length > shownItems.length, noContents: filtered.length === 0,
      showMore: function () { self.setState({ limit: self.state.limit + PAGE }); },
      filterGroups: [{ key: 'type', title: 'Type', options: ['Image', 'Video'] }, { key: 'duration', title: 'Duration', options: DUR_BUCKETS }],
      filters: s.filters, setFilters: function (x) { self.setState({ filters: x, limit: PAGE }); },
      isGrid: s.view === 'grid', isList: s.view === 'list', toGrid: function () { self.setState({ view: 'grid' }); }, toList: function () { self.setState({ view: 'list' }); },
      reorder: s.reorder, reorderLabel: s.reorder ? 'Done' : 'Reorder', reorderIcon: s.reorder ? 'check' : 'grip-vertical', toggleReorder: function () { self.setState({ reorder: !self.state.reorder, drag: null }); },
      markLabel: allMarked ? 'Unmark All' : 'Mark All', markAll: function () { var mk = {}; if (!allMarked) filtered.forEach(function (x) { mk[x.i] = true; }); self.setState({ marked: mk }); },
      markedN: markedN, noneMarked: markedN === 0, bulkLabel: markedN ? 'Bulk Delete (' + markedN + ')' : 'Bulk Delete',
      bulkDelete: function () { var del = Object.assign({}, self.state.deleted); Object.keys(self.state.marked).forEach(function (k) { del[k] = true; }); self.setState({ deleted: del, marked: {} }); },
      sel: selItem,
      contents: shownItems.map(function (x) { var on = !!s.marked[x.i], picked = s.sel === x.i; return Object.assign({}, x, { marked: on, picked: picked, cls: 'ch-tile' + (on ? ' is-marked' : '') + (picked ? ' is-picked' : '') + (s.reorder ? ' is-reorder' : '') + (s.drag === x.i ? ' is-drag' : ''), rowCls: 'dv-tr' + (on || picked ? ' dv-sel' : ''),
        pick: function () { self.setState({ sel: x.i }); }, toggle: function () { setMark(x.i, !on); }, stop: function (e) { e.stopPropagation(); },
        dragStart: function (e) { if (!s.reorder) return; e.dataTransfer.effectAllowed = 'move'; self.setState({ drag: x.i }); }, dragOver: function (e) { if (s.reorder) e.preventDefault(); }, drop: function (e) { e.preventDefault(); dropOn(x.i); }, dragEnd: function () { self.setState({ drag: null }); } }); }),
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
                  <span className="dv-sub">All contents ({v.total})</span>
                </div>
                <div className="dv-between ch-toolbar">
                  <div className="dv-row" style={{ gap: "12px" }}>
                    <FilterBy groups={v.filterGroups} value={v.filters} onChange={v.setFilters} />
                    <NTV.Button variant="secondary" size="xl" iconLeft={v.reorderIcon} className={v.reorder ? "is-open" : ""} aria-pressed={v.reorder} onClick={v.toggleReorder}>{v.reorderLabel}</NTV.Button>
                  </div>
                  <div className="dv-row" style={{ gap: "12px" }}>
                    <NTV.Input size="l" placeholder="Search Channel Content" iconLeft="magnifying-glass" label="Search content" value={v.q} onChange={v.setQ} style={{ width: "260px" }} />
                    <NTV.Button variant="primary" size="xl" iconLeft="square-check" onClick={v.markAll}>{v.markLabel}</NTV.Button>
                    <NTV.Button variant="secondary" size="xl" iconLeft="trash" disabled={v.noneMarked} onClick={v.bulkDelete}>{v.bulkLabel}</NTV.Button>
                    <div className="dv-vt" role="group" aria-label="View">
                      <button type="button" aria-label="Grid view" aria-pressed={v.isGrid} onClick={v.toGrid}><NTV.Icon name="grid-2" size={v.i14} /></button>
                      <button type="button" aria-label="List view" aria-pressed={v.isList} onClick={v.toList}><NTV.Icon name="list" size={v.i14} /></button>
                    </div>
                  </div>
                </div>
                {v.reorder ? <span className="dv-sub">Drag contents to change their play order, then click Done.</span> : null}
                {v.isGrid && !v.noContents ? (
                  <div className="dv-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                    {(v.contents || []).map((_m, $index) => (
                      <div key={_m?.id} role="button" tabIndex={0} className={_m?.cls} onClick={_m?.pick} draggable={v.reorder} onDragStart={_m?.dragStart} onDragOver={_m?.dragOver} onDrop={_m?.drop} onDragEnd={_m?.dragEnd}>
                        <div className="dv-thumb" style={{ aspectRatio: "16 / 10", borderRadius: "0" }}>
                          <img src={_m?.image} alt="" draggable={false} />
                          <span className="ch-badge" style={{ color: `${s(_m?.badgeColor)}` }}>{_m?.badge}</span>
                          <span className="ch-tile__check" onClick={_m?.stop}>
                            {v.reorder ? <NTV.Icon name="grip-vertical" size={v.i14} /> : <NTV.Checkbox checked={_m?.marked} onChange={_m?.toggle} />}
                          </span>
                        </div>
                        <div className="ch-tile__name">{_m?.title}</div>
                        <div className="ch-tile__meta"><span>{_m?.meta}</span><span>{_m?.size}</span></div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {v.isList && !v.noContents ? (
                  <div className="dv-table ch-list">
                    <div role="table" aria-label="Channel contents">
                      <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: "40px 90px 1.6fr 90px 100px 100px 120px" }}>
                        <div />
                        <div>Thumbnail</div>
                        <div>File Name</div>
                        <div>File Type</div>
                        <div>Duration</div>
                        <div>Size</div>
                        <div>Uploaded</div>
                      </div>
                      {(v.contents || []).map((_it, $index) => (
                        <div key={_it?.id} role="row" className={_it?.rowCls} onClick={_it?.pick} draggable={v.reorder} onDragStart={_it?.dragStart} onDragOver={_it?.dragOver} onDrop={_it?.drop} onDragEnd={_it?.dragEnd} style={{ gridTemplateColumns: "40px 90px 1.6fr 90px 100px 100px 120px", minHeight: "52px", cursor: v.reorder ? "grab" : "pointer" }}>
                          <div onClick={_it?.stop}>
                            {v.reorder ? <NTV.Icon name="grip-vertical" size={v.i14} /> : <NTV.Checkbox checked={_it?.marked} onChange={_it?.toggle} />}
                          </div>
                          <div>
                            <span className="dv-thumb" style={{ display: "block", width: "56px", height: "34px" }}><img src={_it?.image} alt="" draggable={false} /></span>
                          </div>
                          <div>{_it?.title}</div>
                          <div>
                            <span style={{ fontSize: "9px", fontWeight: "700", color: `${s(_it?.badgeColor)}` }}>{_it?.badge}</span>
                          </div>
                          <div>{_it?.meta}</div>
                          <div>{_it?.size}</div>
                          <div>{_it?.uploaded}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {v.noContents ? <div className="dv-empty" style={{ border: "1px dashed var(--container-border)", borderRadius: "var(--radius-md)" }}>No contents match these filters.</div> : null}
                <div className="dv-foot" style={{ marginTop: "0" }}>
                  <span>{"Showing "}{v.shownN}{" of "}{v.filteredN}{" items"}</span>
                  {v.hasMore ? <button type="button" onClick={v.showMore}>Show More...</button> : null}
                </div>
              </section>
              <aside className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="dv-thumb" style={{ aspectRatio: "16 / 10" }}><img src={v.sel?.image} alt="" /></div>
                <strong style={{ fontSize: "15px" }}>{v.sel?.title}</strong>
                <p className="dv-sub" style={{ fontSize: "11px" }}>{v.sel?.by}</p>
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
