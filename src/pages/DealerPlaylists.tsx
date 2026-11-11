// @ts-nocheck
/**
 * Page: Playlists  (route /playlists)
 * Converted from the Claude Design artboard DealerPlaylists.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { addNav, byId, contains, navFn, peekNav, screenName, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import SummaryCard from '../components/SummaryCard';
import './DealerPlaylists.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { pls: D.playlists.map(function (p) { return Object.assign({}, p); }), tab: 'Playlists', status: '', menu: '', query: '', modal: '', fm: null, target: '', toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var cover = function (p) { var m = byId(D.media, p.items[0]); return m ? m.image : D.B.zWood; };
    var rows = s.pls.filter(function (p) { if (s.status === 'Assigned' && !p.screens.length) return false; if (s.status === 'Unassigned' && p.screens.length) return false; return contains(p.name + ' ' + p.desc, s.query); });
    var allScreens = {}; s.pls.forEach(function (p) { p.screens.forEach(function (x) { allScreens[x] = 1; }); });
    var blocks = s.pls.filter(function (p) { return p.block; });
    var tp = byId(s.pls, s.target);
    var close = function () { self.setState({ modal: '', fm: null }); };
    var fm = s.fm || { name: '', desc: '' };
    return {
      none: null, i14: 14, w460: 460, w500: 500,
      crumbs: ['Content', 'Playlists'],
      total: s.pls.length, blockTotal: blocks.length, screenTotal: Object.keys(allScreens).length,
      tabs: [['Playlists', 'Playlists (' + s.pls.length + ')'], ['Blocks', 'Blocks (' + blocks.length + ')']].map(function (t) { return { label: t[1], on: s.tab === t[0], pick: function () { self.setState({ tab: t[0] }); } }; }),
      assignedCount: s.pls.filter(function (p) { return p.screens.length; }).length, unassignedCount: s.pls.filter(function (p) { return !p.screens.length; }).length,
      tableTitle: s.tab === 'Playlists' ? 'Playlist Data' : 'Block Data', shown: rows.length,
      statusOptions: ['All Status', 'Assigned', 'Unassigned'], statusValue: s.status || 'All Status', setStatus: function (v) { var x = val(v); self.setState({ status: x === 'All Status' ? '' : x }); },
      menuOpen: !!s.menu, closeMenu: function () { self.setState({ menu: '' }); },
      exportIt: function () { toast(self, 'Exporting playlists to Excel…', 'info'); },
      isPl: s.tab === 'Playlists', isBlocks: s.tab === 'Blocks',
      query: s.query, setQuery: function (v) { self.setState({ query: val(v) }); },
      cols: '50px minmax(260px, 1.8fr) 1fr 1.6fr 110px 120px 90px',
      rows: rows.map(function (p, i) {
        var names = p.screens.map(screenName);
        return { n: i + 1, name: p.name, cover: cover(p), desc: p.desc, count: p.items.length, published: p.published, status: p.screens.length ? 'Assigned' : 'Unassigned', stTint: p.screens.length ? 'var(--success-050)' : 'var(--primary-100)', stColor: p.screens.length ? 'var(--success-600)' : 'var(--fg-secondary)', menuOpen: s.menu === p.id, menu: function () { self.setState({ menu: self.state.menu === p.id ? '' : p.id }); },
          assigned: names.length ? names[0] + (names.length > 1 ? ' +' + (names.length - 1) + ' more' : '') : '--', screenList: names.join(', '),
          open: navFn('DealerPlaylistDetail.dc.html', { id: p.id }),
          edit: function () { self.setState({ menu: '', modal: 'form', target: p.id, fm: { mode: 'edit', name: p.name, desc: p.desc } }); },
          clone: function () { var c = Object.assign({}, p, { id: 'p' + Date.now(), name: p.name + ' (Copy)', screens: [], published: 'Nov 10, 2026' }); self.setState({ menu: '', pls: [c].concat(self.state.pls) }); toast(self, '“' + c.name + '” created'); },
          remove: function () { self.setState({ modal: 'del', target: p.id }); } };
      }),
      empty: rows.length === 0,
      blocks: blocks.map(function (p, i) { var ms = p.items.slice(0, 3).map(function (id) { return byId(D.media, id); }).filter(Boolean); return { n: i + 1, name: p.name.replace(/ Promo| Loop/, '') + ' Block', cover: cover(p), items: ms.length + ' assets', dur: (ms.length * 15 + 135) + ' sec', pl: p.name, open: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) }; }),
      m: { form: s.modal === 'form', del: s.modal === 'del' },
      closeModal: close,
      openCreate: function () { self.setState({ modal: 'form', fm: { mode: 'new', name: '', desc: '' } }); },
      fm: { title: fm.mode === 'edit' ? 'Edit Playlist Info' : 'Create Playlist', okLabel: fm.mode === 'edit' ? 'Save' : 'Create', name: fm.name, desc: fm.desc, bad: !fm.name.trim(),
        setName: function (v) { self.setState({ fm: Object.assign({}, self.state.fm, { name: val(v) }) }); },
        setDesc: function (v) { self.setState({ fm: Object.assign({}, self.state.fm, { desc: val(v) }) }); },
        save: function () {
          var x = self.state.fm;
          if (x.mode === 'edit') { self.setState({ pls: self.state.pls.map(function (p) { return p.id === self.state.target ? Object.assign({}, p, { name: x.name.trim(), desc: x.desc }) : p; }), modal: '' }); toast(self, 'Playlist info saved'); }
          else { var np = { id: 'p' + Date.now(), name: x.name.trim(), desc: x.desc || 'New playlist', published: 'Nov 9, 2026', items: [], block: false, screens: [] }; self.setState({ pls: [np].concat(self.state.pls), modal: '' }); toast(self, '“' + np.name + '” created. Open it to add content.'); }
        } },
      del: !tp ? {} : tp.screens.length ? { can: false, status: 'error', title: 'Can’t Delete Playlist', cancel: 'Close', text: tp.name + ' is used by ' + tp.screens.length + ' screen(s): ' + tp.screens.map(screenName).slice(0, 3).join(', ') + (tp.screens.length > 3 ? '…' : '') + '. Replace it on those screens first.' }
        : { can: true, status: 'warning', title: 'Delete Playlist?', cancel: 'Cancel', text: 'Delete ' + tp.name + '? Its content stays in your Media Library.' },
      doDelete: function () { var id = self.state.target; self.setState({ pls: self.state.pls.filter(function (p) { return p.id !== id; }), modal: '' }); toast(self, 'Playlist deleted'); },
      toast: toastVals(s.toast, this)
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-playlists" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="content" activeItem="Playlists" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between">
            <h1 className="dv-h1">Playlist</h1>
            <NTV.Button variant="primary" size="xl" iconRight="plus" onClick={v.openCreate}>Create Playlist</NTV.Button>
          </div>
          <section style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="status" title="Playlist(s)" description="Current count of playlist" value={v.total} icon="play" tone="danger" active={v.assignedCount} inactive={v.unassignedCount} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="New this week" description="Playlist(s)" value="2" icon="" period="This Week" direction="down" trend="-8.3%" />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="Last week" description="Playlist(s)" value="3" icon="" period="Last Week" direction="up" trend="+40.3%" />
              </div>
            </div>
          </section>
          <div className="dv-tabs" role="tablist" style={{ borderBottom: "0" }}>
            {(v.tabs || []).map((_t, $index) => (
              <React.Fragment key={$index}>
                <button type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick} style={{ minWidth: "110px" }}>{_t?.label}</button>
              </React.Fragment>
            ))}
          </div>
          <div className="dv-between">
            <div style={{ width: "220px", flex: "none" }}>
              <NTV.Select size="l" placeholder="Filter by status" options={v.statusOptions} value={v.statusValue} onChange={v.setStatus} />
            </div>
            <div className="dv-row" style={{ gap: "12px" }}>
              <NTV.Input size="l" placeholder="Search Playlist Name" iconLeft="magnifying-glass" label="Search playlists" value={v.query} onChange={v.setQuery} style={{ width: "420px" }} />
              <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
            </div>
          </div>
          <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="dv-between">
              <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>{v.tableTitle}</h2>
              <NTV.IconButton icon="gear" label="Table settings" variant="secondary" size="m" />
            </div>
            {v.isPl ? (
              <>
                <div className="dv-table">
                <div role="table" aria-label="Playlists" style={{ minWidth: "1100px" }}>
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.cols)}` }}>
                    <div style={{ textAlign: "center" }}>#</div>
                    <div>Playlist Name</div>
                    <div>Published Date</div>
                    <div>Assigned To</div>
                    <div>Total Content</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  {(v.rows || []).map((_r, $index) => (
                    <React.Fragment key={$index}>
                      <div role="row" className="dv-tr" style={{ gridTemplateColumns: `${s(v.cols)}`, overflow: "visible" }}>
                        <div style={{ textAlign: "center" }}>{_r?.n}</div>
                        <div>
                          <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerPlaylistDetail.dc.html" onClick={_r?.open} data-nav={_r?.openNav}>{_r?.name}</a>
                        </div>
                        <div>{_r?.published}</div>
                        <div><span title={_r?.screenList}>{_r?.assigned}</span></div>
                        <div>{_r?.count}</div>
                        <div>
                          <span className="dv-pill" style={{ height: "20px", fontSize: "10px", background: `${s(_r?.stTint)}`, color: `${s(_r?.stColor)}` }}>{_r?.status}</span>
                        </div>
                        <div className="dv-row" style={{ gap: "2px", position: "relative", overflow: "visible" }}>
                          <button type="button" className="dv-ib dv-danger" aria-label="Delete" onClick={_r?.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                          <button type="button" className="dv-ib" aria-label="More actions" onClick={_r?.menu}><NTV.Icon name="ellipsis" size={v.i14} /></button>
                          {_r?.menuOpen ? (
                            <>
                              <div className="dv-menu" style={{ top: "34px", right: "0", minWidth: "160px" }}>
                              <button type="button" className="dv-mi" onClick={_r?.edit}>
                                <NTV.Icon name="pen-to-square" size={v.i12} />
                                Edit Info
                              </button>
                              <button type="button" className="dv-mi" onClick={_r?.clone}>
                                <NTV.Icon name="copy" size={v.i12} />
                                Clone
                              </button>
                            </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  {v.empty ? (
                    <>
                      <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No playlists match your search.</div>
                    </>
                  ) : null}
                </div>
              </div>
              </>
            ) : null}
            {v.isBlocks ? (
              <>
                <div className="dv-table">
                <div role="table" aria-label="Blocks">
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: "50px 1.6fr 1fr 1fr 1fr" }}>
                    <div style={{ textAlign: "center" }}>#</div>
                    <div>Block Name</div>
                    <div>Items</div>
                    <div>Duration</div>
                    <div>Used In Playlist</div>
                  </div>
                  {(v.blocks || []).map((_b, $index) => (
                    <React.Fragment key={$index}>
                      <div role="row" className="dv-tr" style={{ gridTemplateColumns: "50px 1.6fr 1fr 1fr 1fr" }}>
                        <div style={{ textAlign: "center" }}>{_b?.n}</div>
                        <div className="dv-row" style={{ gap: "10px" }}>
                          <span className="dv-thumb" style={{ width: "48px", height: "28px", flex: "none" }}><img src={_b?.cover} alt="" /></span>
                          <strong>{_b?.name}</strong>
                        </div>
                        <div>{_b?.items}</div>
                        <div>{_b?.dur}</div>
                        <div>
                          <a className="dv-a" href="DealerPlaylistDetail.dc.html" onClick={_b?.open} data-nav={_b?.openNav}>{_b?.pl}</a>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              </>
            ) : null}
          </section>
          <div className="dv-foot">
            <span>{"Showing "}{v.shown}{" of "}{v.total}{" items"}</span>
            <button type="button">Show More...</button>
          </div>
        </main>
      </div>
      {v.menuOpen ? (
        <>
          <div aria-hidden="true" onClick={v.closeMenu} style={{ position: "fixed", inset: "0", zIndex: "30" }} />
        </>
      ) : null}
      {v.m?.form ? (
        <>
          <div className="dv-ov">
          <NTV.Modal title={v.fm?.title} width={v.w500} onClose={v.closeModal}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="dv-label" htmlFor="pl-n">Playlist Name</label>
                <input id="pl-n" className="dv-field" placeholder="ex. Lunch Specials" value={v.fm?.name} onChange={v.fm?.setName} />
              </div>
              <div>
                <label className="dv-label" htmlFor="pl-d">Description</label>
                <textarea id="pl-d" className="dv-field" placeholder="What is this playlist for?" onChange={v.fm?.setDesc} value={v.fm?.desc} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.fm?.bad} onClick={v.fm?.save}>{v.fm?.okLabel}</NTV.Button>
            </div>
          </NTV.Modal>
        </div>
        </>
      ) : null}
      {v.m?.del ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status={v.del?.status} title={v.del?.title} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.del?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>{v.del?.cancel}</NTV.Button>
              {v.del?.can ? (
                <>
                  <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doDelete}>Delete</button>
                </>
              ) : null}
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
      <Toast t={v.toast} />
    </div>
    </div>
));

export default Component;
