// @ts-nocheck
/**
 * Page: Channel Manager  (route /channels)
 * Converted from the Claude Design artboard DealerChannels.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, contains, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerChannels.css';

/* ============================== Logic ============================== */

function mineIds() { try { var v = JSON.parse(localStorage.getItem('ntvChannels') || 'null'); if (v) return v; } catch (e) {} return D.channels.filter(function (c) { return c.mine; }).map(function (c) { return c.id; }); }
function saveMine(ids) { try { localStorage.setItem('ntvChannels', JSON.stringify(ids)); } catch (e) {} }
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { mine: props.empty ? [] : mineIds(), genre: 'All', sort: 'Name (A–Z)', view: 'grid', query: '', showcase: false, scQ: '', toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var mine = D.channels.filter(function (c) { return s.mine.indexOf(c.id) !== -1; });
    var genres = ['All']; mine.forEach(function (c) { if (genres.indexOf(c.genre) === -1) genres.push(c.genre); });
    var shown = mine.filter(function (c) { return (s.genre === 'All' || c.genre === s.genre) && contains(c.name, s.query); }).sort(function (a, b) { if (s.sort === 'Most Contents') return b.contents - a.contents; if (s.sort === 'Longest') return b.mins - a.mins; return s.sort === 'Name (Z–A)' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name); });
    return {
      none: null, i40: 40, w1100: 1100,
      i10: 10, i14: 14, genreOptions: genres.map(function (g) { return g === 'All' ? 'All Genres' : g; }), genreValue: s.genre === 'All' ? '' : s.genre, setGenre: function (v) { var x = val(v); self.setState({ genre: x === 'All Genres' ? 'All' : x }); },
      sortOptions: ['Name (A–Z)', 'Name (Z–A)', 'Most Contents', 'Longest'], sort: s.sort, setSort: function (v) { self.setState({ sort: val(v) }); },
      isGrid: s.view === 'grid', isList: s.view === 'list', toGrid: function () { self.setState({ view: 'grid' }); }, toList: function () { self.setState({ view: 'list' }); },
      shown: shown.length, mineCount: mine.length,
      genres: genres.map(function (g) { return { label: g, on: s.genre === g, pick: function () { self.setState({ genre: g }); } }; }),
      query: s.query, setQuery: function (v) { self.setState({ query: val(v) }); },
      hasMine: mine.length > 0, noMine: mine.length === 0, noMatch: mine.length > 0 && shown.length === 0,
      mine: shown.map(function (c, i) { return { n: i + 1, mins: c.mins, contents: c.contents, name: c.name, image: c.image, genre: c.genre, meta: c.mins + ' min loop · ' + c.contents + ' contents', open: navFn('DealerChannelDetail.dc.html', { id: c.id }) }; }),
      showcase: s.showcase, openShowcase: function () { self.setState({ showcase: true, scQ: '' }); }, closeShowcase: function () { self.setState({ showcase: false }); },
      scQ: s.scQ, setScQ: function (v) { self.setState({ scQ: val(v) }); },
      scSub: D.channels.length + ' channels available · ' + mine.length + ' in My Channels',
      catalog: D.channels.filter(function (c) { return contains(c.name + ' ' + c.genre, s.scQ); }).map(function (c) {
        var added = s.mine.indexOf(c.id) !== -1;
        return { name: c.name, image: c.image, genre: c.genre, mins: c.mins, contents: c.contents, added: added, label: added ? 'In My Channels' : 'Add to My Channels', icon: added ? 'check' : 'plus', variant: added ? 'secondary' : 'primary',
          add: function () { var ids = self.state.mine.concat([c.id]); saveMine(ids); self.setState({ mine: ids }); toast(self, c.name + ' added to My Channels'); } };
      }),
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-channels" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="channel" activeItem="" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between">
            <h1 className="dv-h1">Channels</h1>
            <NTV.Button variant="primary" size="xl" iconRight="arrow-up-right-from-square" onClick={v.openShowcase}>Go to Showcase</NTV.Button>
          </div>
          <div className="dv-between">
            <div className="dv-row" style={{ gap: "12px" }}>
              <div style={{ width: "210px", flex: "none" }}>
                <NTV.Select size="l" placeholder="Filter by genre" options={v.genreOptions} value={v.genreValue} onChange={v.setGenre} />
              </div>
              <div style={{ width: "210px", flex: "none" }}>
                <NTV.Select size="l" placeholder="Sort by" options={v.sortOptions} value={v.sort} onChange={v.setSort} />
              </div>
            </div>
            <div className="dv-row" style={{ gap: "12px" }}>
              <NTV.Input size="l" placeholder="Search Channels" iconLeft="magnifying-glass" iconRight="sparkles" label="Search channels" value={v.query} onChange={v.setQuery} style={{ width: "360px" }} />
              <div className="dv-vt" role="group" aria-label="View">
                <button type="button" aria-label="Grid view" aria-pressed={v.isGrid} onClick={v.toGrid}><NTV.Icon name="grid-2" size={v.i14} /></button>
                <button type="button" aria-label="List view" aria-pressed={v.isList} onClick={v.toList}><NTV.Icon name="rectangle-history" size={v.i14} /></button>
              </div>
            </div>
          </div>
          {v.hasMine ? (
            <>
              {v.isGrid ? (
              <>
                <div className="dv-grid" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "14px" }}>
                {(v.mine || []).map((_c, $index) => (
                  <React.Fragment key={$index}>
                    <a className="ch-card" href="DealerChannelDetail.dc.html" onClick={_c?.open} style={{ border: "0", background: "transparent" }} data-nav={_c?.openNav}>
                      <div className="dv-thumb" style={{ aspectRatio: "4 / 3", borderRadius: "var(--radius-md)" }}><img src={_c?.image} alt="" /></div>
                      <div style={{ padding: "8px 2px 0", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <div className="dv-between" style={{ flexWrap: "nowrap", gap: "6px" }}>
                          <strong style={{ fontSize: "13px", lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_c?.name}</strong>
                          <span className="dv-pill" style={{ background: "var(--info-050)", color: "var(--info-600)", height: "18px", fontSize: "9px", padding: "0 6px" }}>{_c?.genre}</span>
                        </div>
                        <div className="dv-between" style={{ fontSize: "10px", lineHeight: "16px", color: "var(--fg-secondary)" }}>
                          <span className="dv-row" style={{ gap: "4px" }}>
                            <NTV.Icon name="clock" size={v.i10} />
                            {_c?.mins}{" mins"}
                          </span>
                          <span>{_c?.contents}{" Contents"}</span>
                        </div>
                      </div>
                    </a>
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
              {v.isList ? (
              <>
                <section className="dv-card">
                <div className="dv-table">
                  <div role="table" aria-label="Channels">
                    <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: "50px 90px 1.6fr 1fr 1fr 1fr" }}>
                      <div style={{ textAlign: "center" }}>#</div>
                      <div>Cover</div>
                      <div>Channel</div>
                      <div>Genre</div>
                      <div>Duration</div>
                      <div>Contents</div>
                    </div>
                    {(v.mine || []).map((_c, $index) => (
                      <React.Fragment key={$index}>
                        <div role="row" className="dv-tr" style={{ gridTemplateColumns: "50px 90px 1.6fr 1fr 1fr 1fr", minHeight: "56px" }}>
                          <div style={{ textAlign: "center" }}>{_c?.n}</div>
                          <div>
                            <span className="dv-thumb" style={{ display: "block", width: "64px", height: "40px" }}><img src={_c?.image} alt="" /></span>
                          </div>
                          <div>
                            <a className="dv-a" href="DealerChannelDetail.dc.html" onClick={_c?.open} data-nav={_c?.openNav}>{_c?.name}</a>
                          </div>
                          <div>{_c?.genre}</div>
                          <div>{_c?.mins}{" mins"}</div>
                          <div>{_c?.contents}</div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>
              </>
            ) : null}
              {v.noMatch ? (
              <>
                <div className="dv-card dv-empty">No channels match.</div>
              </>
            ) : null}
              <div className="dv-foot" style={{ marginTop: "0" }}>
              <span>{"Showing "}{v.shown}{" of "}{v.mineCount}{" items"}</span>
              <button type="button">Show More...</button>
            </div>
            </>
          ) : null}
          {v.noMine ? (
            <>
              <div className="dv-card dv-empty" style={{ minHeight: "420px" }}>
              <span style={{ color: "var(--primary-700)" }}><NTV.Icon name="earth-americas" size={v.i40} /></span>
              <strong style={{ fontSize: "16px", color: "var(--fg-primary)" }}>No channels yet</strong>
              <span>Browse the Showcase and add channels to use them in your playlists.</span>
              <NTV.Button variant="primary" size="m" iconRight={v.none} onClick={v.openShowcase}>Go to Showcase</NTV.Button>
            </div>
            </>
          ) : null}
        </main>
      </div>
      {v.showcase ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title="NTV360 Showcase" width={v.w1100} onClose={v.closeShowcase}>
            <div className="dv-between" style={{ marginBottom: "12px" }}>
              <p className="dv-sub">{v.scSub}</p>
              <NTV.Input size="l" placeholder="Search Showcase" iconLeft="magnifying-glass" label="Search showcase" value={v.scQ} onChange={v.setScQ} style={{ width: "280px" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "14px", maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
              {(v.catalog || []).map((_c, $index) => (
                <React.Fragment key={$index}>
                  <div style={{ border: "1px solid var(--container-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    <div className="dv-thumb" style={{ aspectRatio: "16 / 9", borderRadius: "0" }}><img src={_c?.image} alt="" /></div>
                    <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div>
                        <strong style={{ fontSize: "14px" }}>{_c?.name}</strong>
                        <p className="dv-sub">{_c?.genre}{" · "}{_c?.mins}{" min · "}{_c?.contents}{" contents"}</p>
                      </div>
                      <NTV.Button variant={_c?.variant} size="m" iconRight={_c?.icon} disabled={_c?.added} onClick={_c?.add}>{_c?.label}</NTV.Button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
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
