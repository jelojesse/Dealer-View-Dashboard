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
import { addNav, byId, contains, navFn, peekNav, screenName, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import SummaryCard from '../components/SummaryCard';
import './DealerPlaylists.css';

/* ============================== Logic ============================== */

var PAGE = 10; // rows shown at first and added by "Show More..."
// Playlists table columns ('#' always shown). Toggled from the gear -> NTV.ColumnVisibility.
var PL_COLS = [
  { key: 'name', label: 'Playlist Name', w: 'minmax(220px, 1fr)', min: 220 },
  { key: 'published', label: 'Published Date', w: 'minmax(140px, 1fr)', min: 140 },
  { key: 'count', label: 'Total Content', w: 'minmax(110px, 1fr)', min: 110 },
  { key: 'status', label: 'Status', w: 'minmax(110px, 1fr)', min: 110 },
  { key: 'actions', label: 'Actions', w: '100px', min: 100 }
];
var STATUS_OPTS = ['Assigned', 'Unassigned'];
// Blocks table columns ('#' always shown) — Figma Blocks tab, node 41:45559
var BLOCK_COLS = [
  { key: 'name', label: 'Block Name', w: 'minmax(200px, 1fr)', min: 200 },
  { key: 'pl', label: 'Playlist', w: 'minmax(180px, 1fr)', min: 180 },
  { key: 'count', label: 'Total Content', w: 'minmax(110px, 1fr)', min: 110 },
  { key: 'dur', label: 'Total Duration', w: 'minmax(110px, 1fr)', min: 110 },
  { key: 'actions', label: 'Actions', w: '100px', min: 100 }
];

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { pls: D.playlists.map(function (p) { return Object.assign({}, p); }), tab: 'Playlists', statuses: [], limit: PAGE, hiddenCols: [], hiddenBlockCols: [], blockLimit: PAGE, menu: '', query: '', modal: '', fm: null, target: '', toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var cover = function (p) { var m = byId(D.media, p.items[0]); return m ? m.image : D.B.zWood; };
    var matched = s.pls.filter(function (p) { var st = p.screens.length ? 'Assigned' : 'Unassigned'; if (s.statuses.length && s.statuses.indexOf(st) === -1) return false; return contains(p.name + ' ' + p.desc, s.query); });
    var rows = matched.slice(0, s.limit);
    var allScreens = {}; s.pls.forEach(function (p) { p.screens.forEach(function (x) { allScreens[x] = 1; }); });
    var blocks = s.pls.filter(function (p) { return p.block; });
    var blockName = function (p) { return p.name.replace(/ Promo| Loop/, '') + ' Block'; };
    var blocksMatched = blocks.filter(function (p) { return contains(blockName(p) + ' ' + p.name, s.query); });
    var blocksShown = blocksMatched.slice(0, s.blockLimit);
    var tp = byId(s.pls, s.target);
    var close = function () { self.setState({ modal: '', fm: null }); };
    var fm = s.fm || { name: '', desc: '' };
    return {
      none: null, i14: 14, w460: 460, w500: 500,
      crumbs: ['Content', 'Playlists'],
      total: s.pls.length, blockTotal: blocks.length, screenTotal: Object.keys(allScreens).length,
      tabItems: ['Playlists', 'Blocks'], tab: s.tab, setTab: function (x) { self.setState({ tab: x }); },
      assignedCount: s.pls.filter(function (p) { return p.screens.length; }).length, unassignedCount: s.pls.filter(function (p) { return !p.screens.length; }).length,
      tableTitle: s.tab === 'Playlists' ? 'Playlist Data' : 'Block Data', shown: rows.length, matched: matched.length, hasMore: matched.length > rows.length,
      more: function () { self.setState({ limit: self.state.limit + PAGE }); },
      // Filter by (NTV.FilterDropdown) + chips (NTV.ActiveFilters)
      filterLabel: s.statuses.length ? 'Filter by (' + s.statuses.length + ')' : 'Filter by',
      filterGroups: [{ title: 'Status', options: STATUS_OPTS.map(function (o) {
        return { label: o, checked: s.statuses.indexOf(o) !== -1, onChange: function (on) {
          var cur = self.state.statuses; self.setState({ limit: PAGE, statuses: on ? cur.concat([o]) : cur.filter(function (k) { return k !== o; }) }); } };
      }) }],
      activeChips: s.statuses.map(function (o) { return { key: o, label: 'Status', value: o, tone: 'info', onRemove: function () { self.setState({ limit: PAGE, statuses: self.state.statuses.filter(function (k) { return k !== o; }) }); } }; }),
      clearFilters: function () { self.setState({ statuses: [], limit: PAGE }); },
      // Column visibility (gear)
      show: PL_COLS.reduce(function (o, c) { o[c.key] = s.hiddenCols.indexOf(c.key) === -1; return o; }, {}),
      bshow: BLOCK_COLS.reduce(function (o, c) { o[c.key] = s.hiddenBlockCols.indexOf(c.key) === -1; return o; }, {}),
      bcols: ['44px'].concat(BLOCK_COLS.filter(function (c) { return s.hiddenBlockCols.indexOf(c.key) === -1; }).map(function (c) { return c.w; })).join(' '),
      btableMin: BLOCK_COLS.reduce(function (n, c) { return n + (s.hiddenBlockCols.indexOf(c.key) === -1 ? c.min : 0); }, 44) + 'px',
      // gear only shows when the table has 5+ columns (rule lives in NTV.ColumnVisibilityButton); +1 for '#'
      tableColCount: (s.tab === 'Blocks' ? BLOCK_COLS : PL_COLS).length + 1,
      colColumns: (s.tab === 'Blocks' ? BLOCK_COLS : PL_COLS).map(function (c) { var hid = s.tab === 'Blocks' ? s.hiddenBlockCols : s.hiddenCols; return { key: c.key, label: c.label, visible: hid.indexOf(c.key) === -1 }; }),
      toggleCol: function (key, on) { var f = self.state.tab === 'Blocks' ? 'hiddenBlockCols' : 'hiddenCols'; var h = self.state[f].filter(function (k) { return k !== key; }); var u = {}; u[f] = on ? h : h.concat([key]); self.setState(u); },
      resetCols: function () { var u = {}; u[self.state.tab === 'Blocks' ? 'hiddenBlockCols' : 'hiddenCols'] = []; self.setState(u); },
      tableMin: PL_COLS.reduce(function (n, c) { return n + (s.hiddenCols.indexOf(c.key) === -1 ? c.min : 0); }, 44) + 'px',
      menuOpen: !!s.menu, closeMenu: function () { self.setState({ menu: '' }); },
      exportIt: function () { toast(self, 'Exporting playlists to Excel…', 'info'); },
      isPl: s.tab === 'Playlists', isBlocks: s.tab === 'Blocks',
      query: s.query, setQuery: function (v) { self.setState({ query: val(v), limit: PAGE, blockLimit: PAGE }); },
      searchPh: s.tab === 'Blocks' ? 'Search Block Name or Playlist Name' : 'Search Playlist Name',
      bShown: blocksShown.length, bMatched: blocksMatched.length, bHasMore: blocksMatched.length > blocksShown.length,
      bMore: function () { self.setState({ blockLimit: self.state.blockLimit + PAGE }); },
      bEmpty: blocksShown.length === 0,
      cols: ['44px'].concat(PL_COLS.filter(function (c) { return s.hiddenCols.indexOf(c.key) === -1; }).map(function (c) { return c.w; })).join(' '),
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
      blocks: blocksShown.map(function (p, i) { var ms = p.items.slice(0, 3).map(function (id) { return byId(D.media, id); }).filter(Boolean); return { n: i + 1, name: blockName(p), count: ms.length, dur: (ms.length * 15 + 135), pl: p.name, open: navFn('DealerPlaylistDetail.dc.html', { id: p.id }),
        remove: function () { self.setState({ modal: 'delBlock', target: p.id }); } }; }),
      m: { form: s.modal === 'form', del: s.modal === 'del', delBlock: s.modal === 'delBlock' },
      delBlockText: tp ? 'Delete ' + blockName(tp) + '? It will be removed from ' + tp.name + '. The playlist and its content stay.' : '',
      doDeleteBlock: function () { var id = self.state.target; self.setState({ pls: self.state.pls.map(function (p) { return p.id === id ? Object.assign({}, p, { block: false }) : p; }), modal: '' }); toast(self, 'Block deleted'); },
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
      toast: toastVals(s.toast)
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
          <NTV.Tabs items={v.tabItems} value={v.tab} onChange={v.setTab} />
          <div className="dv-between">
            <div style={{ flex: "none" }}>
              {v.isPl ? <NTV.FilterDropdown label={v.filterLabel} groups={v.filterGroups} /> : null}
            </div>
            <div className="dv-row" style={{ gap: "16px" }}>
              <NTV.Input size="l" placeholder={v.searchPh} iconLeft="magnifying-glass" iconRight={v.isBlocks ? "sparkles" : v.none} label={v.searchPh} value={v.query} onChange={v.setQuery} style={{ width: "500px", maxWidth: "100%" }} />
              <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
            </div>
          </div>
          {v.isPl ? <NTV.ActiveFilters chips={v.activeChips} onClear={v.clearFilters} style={{ marginTop: "-10px" }} /> : null}
          <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="dv-between">
              <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>{v.tableTitle}</h2>
              <NTV.ColumnVisibilityButton key={v.tab} columns={v.colColumns} tableColumns={v.tableColCount} onToggle={v.toggleCol} onReset={v.resetCols} />
            </div>
            {v.isPl ? (
              <>
                <div className="dv-table pl-table">
                <div role="table" aria-label="Playlists" style={{ minWidth: v.tableMin }}>
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.cols)}` }}>
                    <div style={{ textAlign: "center" }}>#</div>
                    {v.show.name ? <div>Playlist Name</div> : null}
                    {v.show.published ? <div>Published Date</div> : null}
                    {v.show.count ? <div>Total Content</div> : null}
                    {v.show.status ? <div>Status</div> : null}
                    {v.show.actions ? <div>Actions</div> : null}
                  </div>
                  {(v.rows || []).map((_r, $index) => (
                    <React.Fragment key={$index}>
                      <div role="row" className="dv-tr" style={{ gridTemplateColumns: `${s(v.cols)}`, overflow: "visible" }}>
                        <div style={{ textAlign: "center" }}>{_r?.n}</div>
                        {v.show.name ? <div>
                          <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerPlaylistDetail.dc.html" onClick={_r?.open} data-nav={_r?.openNav}>{_r?.name}</a>
                        </div> : null}
                        {v.show.published ? <div>{_r?.published}</div> : null}
                        {v.show.count ? <div>{_r?.count}</div> : null}
                        {v.show.status ? <div>
                          <span className="dv-pill" style={{ height: "20px", fontSize: "10px", background: `${s(_r?.stTint)}`, color: `${s(_r?.stColor)}` }}>{_r?.status}</span>
                        </div> : null}
                        {v.show.actions ? <div className="dv-row" style={{ gap: "2px", position: "relative", overflow: "visible" }}>
                          <button type="button" className="dv-ib dv-danger" aria-label="Delete" onClick={_r?.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                          <button type="button" className="dv-ib" aria-label="More actions" onClick={_r?.menu}><span style={{ display: "inline-flex", transform: "rotate(90deg)" }}><NTV.Icon name="ellipsis" size={v.i14} /></span></button>
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
                        </div> : null}
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
                <div className="dv-table pl-table">
                <div role="table" aria-label="Blocks" style={{ minWidth: v.btableMin }}>
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.bcols)}` }}>
                    <div style={{ textAlign: "center" }}>#</div>
                    {v.bshow.name ? <div>Block Name</div> : null}
                    {v.bshow.pl ? <div>Playlist</div> : null}
                    {v.bshow.count ? <div>Total Content</div> : null}
                    {v.bshow.dur ? <div>Total Duration</div> : null}
                    {v.bshow.actions ? <div>Actions</div> : null}
                  </div>
                  {(v.blocks || []).map((_b, $index) => (
                    <React.Fragment key={$index}>
                      <div role="row" className="dv-tr" style={{ gridTemplateColumns: `${s(v.bcols)}` }}>
                        <div style={{ textAlign: "center" }}>{_b?.n}</div>
                        {v.bshow.name ? <div>{_b?.name}</div> : null}
                        {v.bshow.pl ? <div>
                          <a className="dv-a" style={{ fontWeight: "400", color: "var(--fg-primary)" }} href="DealerPlaylistDetail.dc.html" onClick={_b?.open} data-nav={_b?.openNav}>{_b?.pl}</a>
                        </div> : null}
                        {v.bshow.count ? <div>{_b?.count}</div> : null}
                        {v.bshow.dur ? <div>{_b?.dur}</div> : null}
                        {v.bshow.actions ? <div className="dv-row" style={{ gap: "2px" }}>
                          <button type="button" className="dv-ib dv-danger" aria-label="Delete block" onClick={_b?.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                        </div> : null}
                      </div>
                    </React.Fragment>
                  ))}
                  {v.bEmpty ? (
                    <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No blocks match your search.</div>
                  ) : null}
                </div>
              </div>
              </>
            ) : null}
          </section>
          <div className="dv-foot">
            <span>{"Showing "}{v.isPl ? v.shown : v.bShown}{" of "}{v.isPl ? v.matched : v.bMatched}{" items"}</span>
            {v.isPl && v.hasMore ? <button type="button" onClick={v.more}>Show More...</button> : null}
            {v.isBlocks && v.bHasMore ? <button type="button" onClick={v.bMore}>Show More...</button> : null}
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
      {v.m?.delBlock ? (
        <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Delete Block?" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.delBlockText}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeModal}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doDeleteBlock}>Delete</button>
            </div>
          </NTV.StatusModal>
        </div>
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
