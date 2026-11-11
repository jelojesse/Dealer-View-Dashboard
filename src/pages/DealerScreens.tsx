// @ts-nocheck
/**
 * Page: Screens  (route /screens)
 * Converted from the Claude Design artboard DealerScreens.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from '../components/Toast';
import { addNav, arrived, byId, contains, hostName, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import DemoTag from '../components/DemoTag';
import SummaryCard from '../components/SummaryCard';
import './DealerScreens.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerScreens.dc.html');
    this.state = { data: D.screens.slice(), selected: {}, query: (f && f.query) || '', filter: (f && f.type) || '', filterOpen: false, confirm: null, toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var rows0 = s.data.filter(function (r) {
      var hay = r.name + ' ' + hostName(r.host) + ' ' + (r.demo ? 'Demo' : '');
      if (!contains(hay, s.query)) return false;
      if (s.filter === 'Demo') return r.demo;
      if (s.filter) return r.type === s.filter;
      return true;
    });
    var sel = s.selected;
    var selCount = rows0.filter(function (r) { return sel[r.id]; }).length;
    var active = s.data.filter(function (r) { return !r.demo && r.lic.some(function (l) { var x = byId(D.licenses, l); return x && x.status === 'online'; }); }).length;
    var setSel = function (next) { self.setState({ selected: next }); };
    return {
      none: null, i10: 10, i14: 14, w460: 460,
      cols: '46px 50px 280px repeat(6, minmax(0, 1fr)) 80px',
      total: s.data.length, activeCount: active, inactiveCount: s.data.length - active,
      query: s.query, setQuery: function (v) { self.setState({ query: val(v) }); },
      filter: s.filter, hasFilter: !!s.filter, filterOpen: s.filterOpen,
      filterLabel: 'Filter by',
      toggleFilter: function () { self.setState({ filterOpen: !self.state.filterOpen }); },
      clearFilter: function () { self.setState({ filter: '' }); },
      filterOptions: ['Ad', 'Menu', 'Announcement', 'Demo'].map(function (o) { return { label: o === 'Demo' ? 'Demo screens' : o + ' screens', pick: function () { self.setState({ filter: o, filterOpen: false }); } }; }),
      rows: rows0.map(function (r, i) {
        return {
          n: i + 1, name: r.name, host: hostName(r.host), type: r.type, template: r.template, created: r.created, createdBy: r.createdBy,
          demo: r.demo, notDemo: !r.demo, checked: !!sel[r.id], cls: sel[r.id] ? 'dv-sel' : '',
          open: navFn('DealerScreenDetail.dc.html', { id: r.id }),
          openHost: navFn('DealerHostDetail.dc.html', { id: r.host }),
          toggle: function () { var n = Object.assign({}, self.state.selected); if (n[r.id]) delete n[r.id]; else n[r.id] = true; setSel(n); },
          remove: function () { self.setState({ confirm: { ids: [r.id], text: 'Delete “' + r.name + '”? It will stop playing on ' + r.lic.length + ' license(s). This can’t be undone.' } }); }
        };
      }),
      empty: rows0.length === 0, shown: rows0.length,
      noneSelected: selCount === 0,
      allChecked: rows0.length > 0 && selCount === rows0.length,
      someChecked: selCount > 0 && selCount < rows0.length,
      toggleAll: function () { var all = selCount === rows0.length; var n = {}; if (!all) rows0.forEach(function (r) { n[r.id] = true; }); setSel(n); },
      askBulk: function () { var ids = Object.keys(self.state.selected); self.setState({ confirm: { ids: ids, text: 'Delete ' + ids.length + ' selected screen(s)? They will stop playing on their licenses. This can’t be undone.' } }); },
      confirm: { open: !!s.confirm, text: s.confirm ? s.confirm.text : '' },
      closeConfirm: function () { self.setState({ confirm: null }); },
      doDelete: function () {
        var ids = self.state.confirm.ids;
        self.setState({ data: self.state.data.filter(function (x) { return ids.indexOf(x.id) === -1; }), selected: {}, confirm: null });
        toast(self, ids.length + ' screen(s) deleted');
      },
      exportIt: function () { toast(self, 'Exporting ' + rows0.length + ' screens to Excel…', 'info'); },
      refresh: function () { toast(self, 'Screen list refreshed', 'info'); },
      toast: toastVals(s.toast, this)
    };
  }
}

;(function () { var P = 'DealerScreens.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-screens" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="display" activeItem="Screens" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main" style={{ minHeight: "100%" }}>
          <div className="dv-between" style={{ paddingTop: "5px" }}>
            <h1 className="dv-h1">Screens</h1>
            <a href="DealerNewScreen.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ textDecoration: "none" }}>
              <span>New Screen</span>
              <NTV.Icon name="plus" size={v.i14} />
            </a>
          </div>
          <section aria-label="Screen totals" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="status" title="Total screens" description="Screens on your licenses" value={v.total} icon="tv-solid" tone="danger" active={v.activeCount} inactive={v.inactiveCount} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="New this week" description="Screen(s)" value="3" icon="" period="This Week" direction="up" trend="+50%" />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="Last week" description="Screen(s)" value="2" icon="" period="Last Week" direction="down" trend="-33.3%" />
              </div>
            </div>
          </section>
          <div className="dv-between">
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
              <NTV.Button variant="secondary" size="xl" iconLeft="filter" iconRight={v.none} onClick={v.toggleFilter}>{v.filterLabel}</NTV.Button>
              {v.hasFilter ? (
                <>
                  <button type="button" className="dv-chip" aria-pressed="true" onClick={v.clearFilter}>
                  <span>{v.filter}</span>
                  <NTV.Icon name="x" size={v.i10} />
                </button>
                </>
              ) : null}
              {v.filterOpen ? (
                <>
                  <div className="dv-menu" role="menu" style={{ top: "52px", left: "0" }}>
                  {(v.filterOptions || []).map((_f, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" role="menuitem" className="dv-mi" onClick={_f?.pick}>{_f?.label}</button>
                    </React.Fragment>
                  ))}
                </div>
                </>
              ) : null}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              <NTV.Input size="l" placeholder="Search Screen Name, Host or Tags" iconLeft="magnifying-glass" label="Search screens" value={v.query} onChange={v.setQuery} style={{ width: "460px", maxWidth: "100%" }} />
              <NTV.Button variant="primary" size="xl" iconRight="trash" disabled={v.noneSelected} onClick={v.askBulk}>Bulk Delete</NTV.Button>
              <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
            </div>
          </div>
          <section className="dv-card" aria-label="Screen Data" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="dv-between">
              <h2 style={{ margin: "0", fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>Screen Data</h2>
              <div className="dv-row">
                <NTV.IconButton icon="arrows-rotate" label="Refresh table" variant="secondary" size="m" onClick={v.refresh} />
                <NTV.IconButton icon="gear" label="Table settings" variant="secondary" size="m" />
              </div>
            </div>
            <div className="dv-table">
              <div role="table" aria-label="Screens" style={{ minWidth: "1300px" }}>
                <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.cols)}` }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <NTV.Checkbox checked={v.allChecked} indeterminate={v.someChecked} onChange={v.toggleAll} ariaLabel="Select all" />
                  </div>
                  <div style={{ textAlign: "center" }}>#</div>
                  <div>Screen Name</div>
                  <div>Host</div>
                  <div>Type</div>
                  <div>Template</div>
                  <div>Creation Date</div>
                  <div>Created By</div>
                  <div>Tags</div>
                  <div>Actions</div>
                </div>
                {(v.rows || []).map((_r, $index) => (
                  <React.Fragment key={$index}>
                    <div role="row" className={`dv-tr ${s(_r?.cls)}`} style={{ gridTemplateColumns: `${s(v.cols)}` }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <NTV.Checkbox checked={_r?.checked} onChange={_r?.toggle} ariaLabel="Select screen" />
                      </div>
                      <div style={{ textAlign: "center" }}>{_r?.n}</div>
                      <div>
                        <a className="dv-a" href="DealerScreenDetail.dc.html" onClick={_r?.open} data-nav={_r?.openNav}>{_r?.name}</a>
                      </div>
                      <div>
                        <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerHostDetail.dc.html" onClick={_r?.openHost} data-nav={_r?.openHostNav}>{_r?.host}</a>
                      </div>
                      <div>{_r?.type}</div>
                      <div>{_r?.template}</div>
                      <div>{_r?.created}</div>
                      <div>{_r?.createdBy}</div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {_r?.demo ? (
                          <>
                            <DemoTag label="Demo" />
                          </>
                        ) : null}
                        {_r?.notDemo ? (
                          <>
                            <span style={{ color: "var(--fg-secondary)" }}>--</span>
                          </>
                        ) : null}
                      </div>
                      <div>
                        <button type="button" className="dv-ib dv-danger" aria-label="Delete screen" onClick={_r?.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                {v.empty ? (
                  <>
                    <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No screens match your search.</div>
                  </>
                ) : null}
              </div>
            </div>
          </section>
          <div className="dv-foot">
            <span>{"Showing "}{v.shown}{" of "}{v.total}{" items"}</span>
            <button type="button">Show More...</button>
          </div>
        </main>
      </div>
      {v.confirm?.open ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="warning" title="Delete Screen?" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.confirm?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeConfirm}>Cancel</NTV.Button>
              <button type="button" className="ntv-btn ntv-btn--danger ntv-btn--xl" onClick={v.doDelete}>Delete</button>
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
