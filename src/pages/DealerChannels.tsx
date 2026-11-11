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
import FilterBy, { passes } from '../components/FilterBy';
import './DealerChannels.css';

/* ============================== Logic ============================== */

function mineIds() { try { var v = JSON.parse(localStorage.getItem('ntvChannels') || 'null'); if (v) return v; } catch (e) {} return D.channels.filter(function (c) { return c.mine; }).map(function (c) { return c.id; }); }
var SORTS = ['Name (A–Z)', 'Name (Z–A)', 'Most Contents', 'Longest'];
/* Pale tint per genre for the card tag (DS status tints). */
var GENRE_TINT = { Documentary: ['var(--info-050)', 'var(--info-600)'], Education: ['var(--success-050)', 'var(--success-600)'], Technology: ['var(--success-050)', 'var(--success-600)'], Nature: ['var(--danger-050)', 'var(--danger-600)'], Fashion: ['var(--danger-050)', 'var(--danger-600)'], Lifestyle: ['var(--danger-050)', 'var(--danger-main)'], Animals: ['var(--warning-050)', 'var(--warning-600)'], Entertainment: ['var(--purple-050)', 'var(--purple-600)'] };
function genresOf(c) { return c.genres && c.genres.length ? c.genres : [c.genre]; }
function saveMine(ids) { try { localStorage.setItem('ntvChannels', JSON.stringify(ids)); } catch (e) {} }
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { mine: props.empty ? [] : mineIds(), filters: {}, sortOpen: false, sort: 'Name (A–Z)', view: 'grid', query: '', showcase: false, scQ: '', toast: null }; }
  componentDidMount() {
    var self = this; this._sortRef = this._sortRef || React.createRef();
    this._onDoc = function (e) { if (self.state.sortOpen && self._sortRef.current && !self._sortRef.current.contains(e.target)) self.setState({ sortOpen: false }); };
    this._onKey = function (e) { if (e.key === 'Escape' && self.state.sortOpen) self.setState({ sortOpen: false }); };
    document.addEventListener('mousedown', this._onDoc); document.addEventListener('keydown', this._onKey);
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); document.removeEventListener('mousedown', this._onDoc); document.removeEventListener('keydown', this._onKey); }
  renderVals() {
    var self = this, s = this.state;
    var mine = D.channels.filter(function (c) { return s.mine.indexOf(c.id) !== -1; });
    if (!this._sortRef) this._sortRef = React.createRef();
    var genres = []; mine.forEach(function (c) { genresOf(c).forEach(function (g) { if (genres.indexOf(g) === -1) genres.push(g); }); }); genres.sort();
    var shown = mine.filter(function (c) { return genresOf(c).some(function (g) { return passes(s.filters, 'genre', g); }) && contains(c.name, s.query); }).sort(function (a, b) { if (s.sort === 'Most Contents') return b.contents - a.contents; if (s.sort === 'Longest') return b.mins - a.mins; return s.sort === 'Name (Z–A)' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name); });
    return {
      none: null, i40: 40, w1100: 1100,
      i10: 10, i14: 14, i12: 12,
      filterGroups: [{ key: 'genre', title: 'Genre', options: genres }], filters: s.filters, setFilters: function (x) { self.setState({ filters: x }); },
      sortRef: this._sortRef, sortOpen: s.sortOpen, toggleSort: function () { self.setState({ sortOpen: !self.state.sortOpen }); },
      sortItems: SORTS.map(function (o) { return { label: o, on: s.sort === o, pick: function () { self.setState({ sort: o, sortOpen: false }); } }; }),
      isGrid: s.view === 'grid', isList: s.view === 'list', toGrid: function () { self.setState({ view: 'grid' }); }, toList: function () { self.setState({ view: 'list' }); },
      shown: shown.length, mineCount: mine.length,
      query: s.query, setQuery: function (v) { self.setState({ query: val(v) }); },
      hasMine: mine.length > 0, noMine: mine.length === 0, noMatch: mine.length > 0 && shown.length === 0,
      mine: shown.map(function (c, i) { var gs = genresOf(c), tint = GENRE_TINT[gs[0]] || GENRE_TINT.Documentary; return { n: i + 1, tag: gs[0] + (gs.length > 1 ? ' +' + (gs.length - 1) : ''), tagBg: tint[0], tagFg: tint[1], genreList: gs.join(', '), mins: c.mins, contents: c.contents, name: c.name, image: c.image, genre: c.genre, meta: c.mins + ' min loop · ' + c.contents + ' contents', open: navFn('DealerChannelDetail.dc.html', { id: c.id }) }; }),
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
            <div className="dv-row ch-toolbar" style={{ gap: "12px" }}>
              <FilterBy groups={v.filterGroups} value={v.filters} onChange={v.setFilters} />
              <div className="ch-sort" ref={v.sortRef}>
                <NTV.Button variant="secondary" size="xl" iconLeft="bars-filter" className={v.sortOpen ? "is-open" : ""} aria-haspopup="menu" aria-expanded={v.sortOpen} onClick={v.toggleSort}>Sort by</NTV.Button>
                {v.sortOpen ? (
                  <div className="dv-menu" role="menu" aria-label="Sort by" style={{ top: "48px", left: "0", minWidth: "210px" }}>
                    {(v.sortItems || []).map((_o, $index) => (
                      <button key={$index} type="button" role="menuitemradio" aria-checked={_o?.on} className="dv-mi" onClick={_o?.pick} style={{ justifyContent: "space-between", fontWeight: _o?.on ? "700" : "400", color: _o?.on ? "var(--accent-action)" : "var(--fg-primary)" }}>
                        <span>{_o?.label}</span>
                        {_o?.on ? <NTV.Icon name="check" size={v.i12} /> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
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
                <div className="dv-tray dv-grid" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: "14px" }}>
                {(v.mine || []).map((_c, $index) => (
                  <React.Fragment key={$index}>
                    <a className="ch-card" href="DealerChannelDetail.dc.html" onClick={_c?.open} data-nav={_c?.openNav}>
                      <div className="dv-thumb ch-card__cover"><img src={_c?.image} alt="" /></div>
                      <div className="ch-card__info">
                        <div className="ch-card__top">
                          <span className="ch-card__name" title={_c?.name}>{_c?.name}</span>
                          <span className="ch-tag" title={_c?.genreList} style={{ background: `${s(_c?.tagBg)}`, color: `${s(_c?.tagFg)}` }}>{_c?.tag}</span>
                        </div>
                        <div className="ch-card__meta">
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
                          <div>{_c?.genreList}</div>
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
