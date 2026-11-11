// @ts-nocheck
/**
 * Page: New Host  (route /hosts/new)
 * Converted from the Claude Design artboard DealerNewHost.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, contains, go, navFn, peekNav, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerNewHost.css';

/* ============================== Logic ============================== */

var PLACES = [
  { name: 'Druid City Coffee House', address: '2300 4th St', city: 'Tuscaloosa', state: 'AL', zip: '35401', category: 'Cafe', mx: 880, my: 330 },
  { name: 'Druid Hills Dental Care', address: '1012 Hargrove Rd E', city: 'Tuscaloosa', state: 'AL', zip: '35405', category: 'Dental', mx: 895, my: 350 },
  { name: 'Lakeview Pizza Co.', address: '4721 Lakeshore Dr', city: 'Hoover', state: 'AL', zip: '35244', category: 'Restaurant', mx: 940, my: 290 },
  { name: 'Northport Fitness Center', address: '1800 McFarland Blvd N', city: 'Northport', state: 'AL', zip: '35476', category: 'Gym', mx: 860, my: 310 },
  { name: 'Vestavia Grill & Bar', address: '700 Montgomery Hwy', city: 'Vestavia Hills', state: 'AL', zip: '35216', category: 'Bar', mx: 950, my: 275 },
  { name: 'Pelham Pet Supply', address: '2970 Pelham Pkwy', city: 'Pelham', state: 'AL', zip: '35124', category: 'Pet Store', mx: 960, my: 330 },
  { name: 'Homewood Laundry Lounge', address: '1820 29th Ave S', city: 'Homewood', state: 'AL', zip: '35209', category: 'Laundry', mx: 930, my: 268 },
  { name: 'Bessemer Auto Spa', address: '1500 9th Ave N', city: 'Bessemer', state: 'AL', zip: '35020', category: 'Auto Service', mx: 905, my: 300 }
];
function pos(mx, my) { return 'calc(50% - ' + mx + 'px) calc(50% - ' + my + 'px)'; }
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { step: 0, q: '', pick: -1, manual: false, f: { name: '', category: '', hours: 'Open 24 hours', address: '', city: '', state: 'AL', zip: '' }, created: false }; }
  renderVals() {
    var self = this, s = this.state, f = s.f;
    var list = PLACES.map(function (p, i) { return Object.assign({ i: i }, p); }).filter(function (p) { return contains(p.name + ' ' + p.address + ' ' + p.city + ' ' + p.zip, s.q); });
    var pk = PLACES[s.pick];
    var setF = function (k) { return function (v) { var o = Object.assign({}, self.state.f); o[k] = val(v); self.setState({ f: o }); }; };
    var formOk = !!(f.name.trim() && f.category && f.address.trim() && f.city.trim() && f.zip.trim());
    return {
      none: null, i14: 14, i16: 16, i32: 32, w460: 460, map: D.B.map,
      crumbs: [{ label: 'Hosts', href: 'DealerHosts.dc.html' }, 'New Host'],
      steps: [{ label: 'Search Host Place', state: s.step > 0 ? 'done' : undefined }, { label: 'Create Host Place' }],
      step: s.step, isSearch: s.step === 0, isForm: s.step === 1,
      q: s.q, setQ: function (v) { self.setState({ q: val(v) }); },
      places: list.map(function (p) { return { name: p.name, address: p.address + ', ' + p.city + ', ' + p.state + ' ' + p.zip, category: p.category, sel: s.pick === p.i, pick: function () { self.setState({ pick: p.i }); } }; }),
      noPlaces: list.length === 0,
      hasPick: !!pk, noPick: !pk, pickName: pk ? pk.name : '', pickAddr: pk ? pk.address + ', ' + pk.city + ', ' + pk.state + ' ' + pk.zip : '',
      pickPos: pk ? pos(pk.mx, pk.my) : pos(860, 320),
      manual: function () { self.setState({ step: 1, manual: true, pick: -1, f: { name: '', category: '', hours: 'Open 24 hours', address: '', city: '', state: 'AL', zip: '' } }); },
      formSub: s.manual ? 'Enter the business details by hand. We’ll place the pin from the address.' : 'Prefilled from the map. Check everything before creating the host.',
      formPos: pk ? pos(pk.mx, pk.my) : pos(880, 320),
      locNote: pk ? pk.name + ' · ' + pk.city : 'Pin placed from the city center — refine it later from Edit Host.',
      categories: ['Restaurant', 'Cafe', 'Auto Service', 'Gym', 'Pharmacy', 'Dental', 'Salon', 'Grocery', 'Bar', 'Laundry', 'Retail', 'Hotel', 'Veterinary', 'Clinic', 'Bakery', 'Pet Store'],
      hourOptions: ['Open 24 hours', 'Mon–Sat 8 AM–10 PM', 'Mon–Fri 9 AM–6 PM', 'Daily 11 AM–11 PM'],
      f: { name: f.name, category: f.category, hours: f.hours, address: f.address, city: f.city, state: f.state, zip: f.zip,
        setName: setF('name'), setCategory: setF('category'), setHours: setF('hours'), setAddress: setF('address'), setCity: setF('city'), setState: setF('state'), setZip: setF('zip') },
      blocked: s.step === 0 ? !pk : !formOk,
      nextLabel: s.step === 0 ? 'Next' : 'Create Host',
      back: function () { if (self.state.step === 0) { var a = document.querySelector('a[data-go="DealerHosts.dc.html"]'); if (a) a.click(); } else self.setState({ step: 0 }); },
      next: function () {
        if (self.state.step === 0) { var p = PLACES[self.state.pick]; self.setState({ step: 1, manual: false, f: { name: p.name, category: p.category, hours: 'Mon–Sat 8 AM–10 PM', address: p.address, city: p.city, state: p.state, zip: p.zip } }); }
        else { try { localStorage.setItem('ntvHost', JSON.stringify(Object.assign({}, self.state.f, { created: 'Nov 9, 2026' }))); } catch (e) {} self.setState({ created: true }); }
      },
      created: s.created,
      viewHost: navFn('DealerHostDetail.dc.html', { id: 'new' })
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-new-host" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Hosts" />
      </div>
      <div className="dv-scroll">
        <div style={{ padding: "20px 20px 0" }}><NTV.Breadcrumbs items={v.crumbs} /></div>
        <main style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "20px 20px 40px", boxSizing: "border-box" }}>
          <div>
            <h1 style={{ margin: "0", fontSize: "20px", lineHeight: "30px", fontWeight: "700" }}>Create a Host</h1>
            <p className="dv-sub">Search a business or fill the host form manually.</p>
          </div>
          <section className="dv-card"><NTV.Stepper steps={v.steps} current={v.step} style={{ width: "100%" }} /></section>
          {v.isSearch ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "stretch" }}>
              <section className="dv-card" style={{ flex: "0 0 420px", display: "flex", flexDirection: "column", gap: "16px", borderLeft: "4px solid var(--accent-action)" }}>
                <div>
                  <h2 className="dv-h3">Host Place</h2>
                  <p className="dv-sub">Find the business on the map to fill in its address, hours and coordinates.</p>
                </div>
                <NTV.Input size="l" placeholder="Business name, address or ZIP" iconLeft="magnifying-glass" label="Search place" value={v.q} onChange={v.setQ} />
                <div role="listbox" aria-label="Places" style={{ border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", overflow: "hidden", marginTop: "-1px" }}>
                  {(v.places || []).map((_p, $index) => (
                    <React.Fragment key={$index}>
                      <button type="button" role="option" className="pl-opt" aria-selected={_p?.sel} onClick={_p?.pick} style={{ marginTop: "-1px" }}>
                        <span style={{ color: "var(--danger-main)", paddingTop: "2px" }}><NTV.Icon name="location-dot-solid" size={v.i16} /></span>
                        <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                          <span style={{ fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>{_p?.name}</span>
                          <span className="dv-sub">{_p?.address}{" · "}{_p?.category}</span>
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                  {v.noPlaces ? (
                    <>
                      <div className="dv-empty" style={{ padding: "24px" }}>No places found for “{v.q}”.</div>
                    </>
                  ) : null}
                </div>
                <button type="button" onClick={v.manual} style={{ marginTop: "auto", height: "36px", border: "1px solid var(--accent-action)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", color: "var(--accent-action)", fontFamily: "inherit", fontSize: "13px", cursor: "pointer" }}>Can’t find it? Enter details manually</button>
              </section>
              <section className="dv-card" style={{ flex: "1 1 0", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px", padding: "0", overflow: "hidden" }}>
                <div className="mini-map" style={{ backgroundImage: `url(${s(v.map)})`, backgroundSize: "1880px 906px", backgroundPosition: `${s(v.pickPos)}` }}>
                  {v.hasPick ? (
                    <>
                      <span className="mini-pin"><NTV.Icon name="location-dot-solid" size={v.i32} /></span>
                    </>
                  ) : null}
                </div>
                {v.hasPick ? (
                  <>
                    <div className="dv-kv">
                    <span>Selected place</span>
                    <span>{v.pickName}</span>
                  </div>
                    <p className="dv-sub">{v.pickAddr}</p>
                  </>
                ) : null}
                {v.noPick ? (
                  <>
                    <p className="dv-sub">Pick a result to drop a pin.</p>
                  </>
                ) : null}
              </section>
            </div>
            </>
          ) : null}
          {v.isForm ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "stretch" }}>
              <section className="dv-card" style={{ flex: "1 1 560px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h2 className="dv-h3">Host details</h2>
                  <p className="dv-sub">{v.formSub}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                  <div style={{ gridColumn: "1 / 3" }}>
                    <label className="dv-label" htmlFor="nh-name">Host Name</label>
                    <input id="nh-name" className="dv-field" placeholder="ex. Druid City Coffee" value={v.f?.name} onChange={v.f?.setName} />
                  </div>
                  <div>
                    <span className="dv-label">Category</span>
                    <NTV.Select size="l" placeholder="Select" options={v.categories} value={v.f?.category} onChange={v.f?.setCategory} />
                  </div>
                  <div>
                    <span className="dv-label">Business Hours</span>
                    <NTV.Select size="l" options={v.hourOptions} value={v.f?.hours} onChange={v.f?.setHours} />
                  </div>
                  <div style={{ gridColumn: "1 / 3" }}>
                    <label className="dv-label" htmlFor="nh-addr">Address</label>
                    <input id="nh-addr" className="dv-field" placeholder="Street address" value={v.f?.address} onChange={v.f?.setAddress} />
                  </div>
                  <div>
                    <label className="dv-label" htmlFor="nh-city">City</label>
                    <input id="nh-city" className="dv-field" value={v.f?.city} onChange={v.f?.setCity} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="dv-label" htmlFor="nh-state">State</label>
                      <input id="nh-state" className="dv-field" value={v.f?.state} onChange={v.f?.setState} />
                    </div>
                    <div>
                      <label className="dv-label" htmlFor="nh-zip">ZIP</label>
                      <input id="nh-zip" className="dv-field" value={v.f?.zip} onChange={v.f?.setZip} />
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / 3" }}>
                    <label className="dv-label" htmlFor="nh-notes">Notes (Optional)</label>
                    <textarea id="nh-notes" className="dv-field" placeholder="Parking, contact person, install notes…" />
                  </div>
                </div>
              </section>
              <section className="dv-card" style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <h2 className="dv-h3">Location</h2>
                <div className="mini-map" style={{ backgroundImage: `url(${s(v.map)})`, backgroundSize: "1880px 906px", backgroundPosition: `${s(v.formPos)}` }}>
                  <span className="mini-pin"><NTV.Icon name="location-dot-solid" size={v.i32} /></span>
                </div>
                <p className="dv-sub">{v.locNote}</p>
                <div className="dv-note">
                  <NTV.Icon name="circle-info" size={v.i14} />
                  <span>
                    {"New hosts start as "}
                    <strong>Active</strong>
                    {" with no licenses. Assign licenses from the host page or when you create a screen."}
                  </span>
                </div>
              </section>
            </div>
            </>
          ) : null}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.back}>Back</NTV.Button>
            <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.blocked} onClick={v.next}>{v.nextLabel}</NTV.Button>
          </div>
        </main>
      </div>
      {v.created ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="success" title="Host Created" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              <strong style={{ color: "var(--fg-primary)" }}>{v.f?.name}</strong>
              {" was added to your hosts."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <a href="DealerHosts.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--neutral ntv-btn--xl" style={{ textDecoration: "none" }}>Back to Hosts</a>
              <a href="DealerHostDetail.dc.html" onClick={v.viewHost} className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ textDecoration: "none" }} data-nav={v.viewHostNav}>View Host</a>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
    </div>
    </div>
));

export default Component;
