// @ts-nocheck
/**
 * Page: Advertisers  (route /advertisers)
 * Converted from the Claude Design artboard DealerAdvertisers.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, contains, navFn, peekNav, toast, toastVals, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import SummaryCard from '../components/SummaryCard';
import FilterBy, { passes } from '../components/FilterBy';

var REGIONS = ['Mid-Atlantic (MA)', 'Mid-East (ME)', 'Mid-West (MW)', 'North East (NE)', 'South East (SE)', 'South West (SW)'];
/* Mock: every advertiser record says "South"; spread them over the dealer regions so the Region filter has something to do. */
var regionOf = function (a) { return REGIONS[(parseInt(String(a.id).slice(1), 10) || 0) % REGIONS.length]; };
import './DealerAdvertisers.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { data: D.advertisers.slice(), query: '', filters: {}, del: null, toast: null }; }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, s = this.state;
    var media = function (a) { return D.media.filter(function (m) { return m.adv === a.id; }); };
    var rows = s.data.filter(function (a) { return passes(s.filters, 'category', a.category) && passes(s.filters, 'region', regionOf(a)) && passes(s.filters, 'status', a.status) && contains(a.name + ' ' + regionOf(a) + ' ' + a.category + ' ' + a.state + ' ' + (a.state === 'AL' ? 'Alabama' : ''), s.query); });
    var cnt = function (k) { return s.data.filter(function (a) { return a.status === k; }).length; };
    var used = s.del ? media(s.del).filter(function (m) { return m.used; }).length : 0;
    return {
      none: null, i14: 14, w460: 460,
      cols: '50px minmax(220px, 2fr) 1fr 1fr 1fr 90px 140px 90px',
      total: s.data.length, activeCount: cnt('Active'), inactiveCount: cnt('Inactive'),
      legend: [{ label: 'Active', color: 'var(--success-main)' }, { label: 'Inactive', color: 'var(--danger-main)' }],
      filterGroups: [
        { key: 'category', title: 'Category', options: s.data.map(function (a) { return a.category; }).filter(function (c, i, arr) { return arr.indexOf(c) === i; }).sort() },
        { key: 'region', title: 'Region', options: REGIONS },
        { key: 'status', title: 'Status', options: ['Active', 'Inactive'] }
      ],
      filters: s.filters, setFilters: function (x) { self.setState({ filters: x }); },
      query: s.query, setQuery: function (v) { self.setState({ query: val(v) }); },
      rows: rows.map(function (a, i) {
        return { n: i + 1, name: a.name, category: a.category, city: a.city, state: a.state, region: regionOf(a), content: media(a).length, status: a.status, color: a.status === 'Active' ? 'var(--success-main)' : 'var(--danger-main)', created: a.created, createdBy: a.createdBy,
          open: navFn('DealerAdvertiserDetail.dc.html', { id: a.id }),
          edit: navFn('DealerAdvertiserDetail.dc.html', { id: a.id, edit: true }),
          remove: function () { self.setState({ del: a }); } };
      }),
      empty: rows.length === 0, shown: rows.length,
      del: !s.del ? { open: false } : used ? { open: true, can: false, status: 'error', title: 'Can’t Delete Advertiser', cancel: 'Close', text: s.del.name + ' has ' + used + ' content item(s) playing in playlists. Remove them from those playlists first.' }
        : { open: true, can: true, status: 'warning', title: 'Delete Advertiser?', cancel: 'Cancel', text: 'Delete ' + s.del.name + ' and its unused content? This can’t be undone.' },
      closeDel: function () { self.setState({ del: null }); },
      doDelete: function () { var a = self.state.del; self.setState({ data: self.state.data.filter(function (x) { return x.id !== a.id; }), del: null }); toast(self, a.name + ' deleted'); },
      exportIt: function () { toast(self, 'Exporting ' + rows.length + ' advertisers to Excel…', 'info'); },
      refresh: function () { toast(self, 'Advertiser list refreshed', 'info'); },
      toast: toastVals(s.toast)
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-advertisers" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Advertisers" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <div className="dv-between">
            <h1 className="dv-h1">Advertiser</h1>
            <a href="DealerNewAdvertiser.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ textDecoration: "none" }}>
              <span>Add Advertiser Profile</span>
              <NTV.Icon name="plus" size={v.i14} />
            </a>
          </div>
          <section aria-label="Advertiser totals" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="status" title="Total Advertisers" description="Weekly performance comparison" value={v.total} icon="tag" tone="teal" active={v.activeCount} inactive={v.inactiveCount} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="New Advertiser Registration" description="Advertisers you registered this week" value="3" icon="users" tone="success" period="This Week" direction="up" trend="+50%" />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: "0", display: "flex" }}>
              <div style={{ width: "100%" }}>
                <SummaryCard variant="trend" title="New Hosts Registration" description="Active hosts added this week" value="4" icon="map" tone="purple" period="Last Week" direction="down" trend="-8.3%" />
              </div>
            </div>
          </section>
          <div className="dv-between">
            <FilterBy groups={v.filterGroups} value={v.filters} onChange={v.setFilters} />
            <div className="dv-row" style={{ flexWrap: "wrap", gap: "12px" }}>
              <NTV.Input size="l" placeholder="Search Advertiser Name, Category, Region or State" iconLeft="magnifying-glass" iconRight="sparkles" label="Search advertisers" value={v.query} onChange={v.setQuery} style={{ width: "460px", maxWidth: "100%" }} />
              <NTV.Button variant="secondary" size="xl" iconRight="file-excel" onClick={v.exportIt}>Export</NTV.Button>
            </div>
          </div>
          <section className="dv-card" aria-label="Advertiser's Data" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="dv-between">
              <div className="dv-row" style={{ gap: "20px" }}>
                <h2 style={{ margin: "0", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>Advertiser’s Data</h2>
                <div className="dv-legend" aria-label="Legend">
                  {(v.legend || []).map((_g, $index) => (
                    <React.Fragment key={$index}>
                      <span>
                        <span className="dv-dot" style={{ background: `${s(_g?.color)}` }} />
                        {_g?.label}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="dv-row">
                <NTV.IconButton icon="arrows-rotate" label="Refresh table" variant="secondary" size="m" onClick={v.refresh} />
                <NTV.IconButton icon="gear" label="Table settings" variant="secondary" size="m" />
              </div>
            </div>
            <div className="dv-table">
              <div role="table" aria-label="Advertisers" style={{ minWidth: "1100px" }}>
                <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: `${s(v.cols)}` }}>
                  <div style={{ textAlign: "center" }}>#</div>
                  <div>Name</div>
                  <div>Region</div>
                  <div>State</div>
                  <div>Category</div>
                  <div>Content</div>
                  <div>Date Created</div>
                  <div>Actions</div>
                </div>
                {(v.rows || []).map((_r, $index) => (
                  <React.Fragment key={$index}>
                    <div role="row" className="dv-tr" style={{ gridTemplateColumns: `${s(v.cols)}`, boxShadow: `inset 4px 0 0 ${s(_r?.color)}` }}>
                      <div style={{ textAlign: "center" }}>{_r?.n}</div>
                      <div>
                        <a className="dv-a" style={{ fontWeight: "500", color: "var(--fg-primary)" }} href="DealerAdvertiserDetail.dc.html" onClick={_r?.open} data-nav={_r?.openNav}>{_r?.name}</a>
                      </div>
                      <div>{_r?.region}</div>
                      <div>{_r?.state}</div>
                      <div>{_r?.category}</div>
                      <div>{_r?.content}</div>
                      <div>{_r?.created}</div>
                      <div className="dv-row" style={{ gap: "2px" }}>
                        <a className="dv-ib dv-edit" aria-label="Modify advertiser" href="DealerAdvertiserDetail.dc.html" onClick={_r?.edit} data-nav={_r?.editNav}><NTV.Icon name="pen-to-square" size={v.i14} /></a>
                        <button type="button" className="dv-ib dv-danger" aria-label="Delete advertiser" onClick={_r?.remove}><NTV.Icon name="trash" size={v.i14} /></button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                {v.empty ? (
                  <>
                    <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No advertisers match your search.</div>
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
      {v.del?.open ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status={v.del?.status} title={v.del?.title} width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>{v.del?.text}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.closeDel}>{v.del?.cancel}</NTV.Button>
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
