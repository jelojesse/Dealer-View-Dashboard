// @ts-nocheck
/**
 * Page: New Advertiser  (route /advertisers/new)
 * Converted from the Claude Design artboard DealerNewAdvertiser.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, contains, navFn, peekNav, val, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import './DealerNewAdvertiser.css';

/* ============================== Logic ============================== */

var ADDR = [
  { line1: '1 Cahaba Brewing Way', city: 'Birmingham', st: 'AL', zip: '35222', mx: 935, my: 265 },
  { line1: '2200 University Blvd', city: 'Tuscaloosa', st: 'AL', zip: '35401', mx: 878, my: 334 },
  { line1: '1500 McFarland Blvd N', city: 'Northport', st: 'AL', zip: '35476', mx: 862, my: 312 },
  { line1: '3000 Riverchase Galleria', city: 'Hoover', st: 'AL', zip: '35244', mx: 942, my: 292 },
  { line1: '120 Main St', city: 'Trussville', st: 'AL', zip: '35173', mx: 975, my: 248 },
  { line1: '45 Oak Mountain Dr', city: 'Pelham', st: 'AL', zip: '35124', mx: 958, my: 330 },
  { line1: '800 Peachtree St NE', city: 'Atlanta', st: 'GA', zip: '30308', mx: 1300, my: 230 },
  { line1: '200 Capitol Ave', city: 'Jackson', st: 'MS', zip: '39201', mx: 420, my: 520 },
  { line1: '501 Broadway', city: 'Nashville', st: 'TN', zip: '37203', mx: 1000, my: 40 },
  { line1: '1 Beach Blvd', city: 'Pensacola', st: 'FL', zip: '32502', mx: 860, my: 880 }
];
var ST = { AL: 'Alabama', GA: 'Georgia', MS: 'Mississippi', TN: 'Tennessee', FL: 'Florida' };
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { name: '', category: '', genCat: '', photo: false, state: 'Alabama', addr: '', pick: -1, done: false }; }
  renderVals() {
    var self = this, s = this.state;
    var code = Object.keys(ST).filter(function (k) { return ST[k] === s.state; })[0];
    var p = ADDR[s.pick];
    var q = (s.addr || '').trim();
    var sugs = ADDR.map(function (a, i) { return Object.assign({ i: i }, a); }).filter(function (a) { return a.st === code && contains(a.line1 + ' ' + a.city + ' ' + a.zip, q); });
    var showSug = q.length > 0 && !(p && s.addr === p.line1);
    var center = { AL: [900, 300], GA: [1250, 260], MS: [450, 450], TN: [950, 80], FL: [900, 820] }[code];
    return {
      none: null, i14: 14, i32: 32, w460: 460, map: D.B.map,
      crumbs: [{ label: 'Advertisers', href: 'DealerAdvertisers.dc.html' }, 'New Advertiser'],
      name: s.name, setName: function (v) { self.setState({ name: val(v) }); },
      category: s.category, setCategory: function (v) { self.setState({ category: val(v) }); },
      categories: ['Cafe', 'Food', 'Retail', 'Automotive', 'Insurance', 'Finance', 'Dental', 'Fitness', 'Real Estate', 'Legal', 'Health', 'Events'],
      states: Object.keys(ST).map(function (k) { return ST[k]; }), state: s.state, stateName: s.state,
      setStateF: function (v) { self.setState({ state: val(v), pick: -1, addr: '' }); },
      addr: s.addr, setAddr: function (v) { self.setState({ addr: val(v), pick: -1 }); },
      showSug: showSug, noSug: sugs.length === 0,
      sugs: sugs.map(function (a) { return { line1: a.line1, line2: a.city + ', ' + a.st + ' ' + a.zip, pick: function () { self.setState({ pick: a.i, addr: a.line1 }); } }; }),
      city: p ? p.city : '', zip: p ? p.zip : '', region: p ? 'SE' : '', stCode: p ? p.st : '', addrPicked: p ? p.line1 : '',
      lat: p ? (33.9 - p.my / 900).toFixed(4) : '', lng: p ? (-88.6 + p.mx / 1000).toFixed(4) : '', yes: true, i10: 10, i24: 24,
      genCats: ['Food & Beverage', 'Retail', 'Services', 'Automotive', 'Health'], genCat: s.genCat, setGenCat: function (v) { self.setState({ genCat: val(v) }); },
      hasPhoto: s.photo, noPhoto: !s.photo, photo: D.B.oranges, pickPhoto: function () { self.setState({ photo: !self.state.photo }); },
      picked: !!p, mapLabel: p ? p.line1 + ', ' + p.city : 'Showing ' + s.state,
      pos: 'calc(50% - ' + (p ? p.mx : center[0]) + 'px) calc(50% - ' + (p ? p.my : center[1]) + 'px)',
      blocked: !(s.name.trim() && s.category && p),
      create: function () { try { localStorage.setItem('ntvAdv', JSON.stringify({ id: 'new', name: s.name.trim(), category: s.category, city: p.city, state: p.st, region: 'South', status: 'Active', created: 'Nov 9, 2026', createdBy: 'Ibanez Lighting Inc.', media: [] })); } catch (e) {} self.setState({ done: true }); },
      done: s.done,
      view: navFn('DealerAdvertiserDetail.dc.html', { id: 'new' })
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-new-advertiser" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="network" activeItem="Advertisers" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <NTV.Breadcrumbs items={v.crumbs} />
          <div style={{ display: "grid", gridTemplateColumns: "420px minmax(0, 1fr)", gap: "20px", alignItems: "stretch" }}>
            <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <h1 className="dv-h3">Advertisers Information</h1>
                <p className="dv-sub">Fill in the details to create a new advertiser profile</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "8px 0" }}>
                <button type="button" onClick={v.pickPhoto} style={{ width: "72px", height: "72px", borderRadius: "999px", border: "0", background: "var(--primary-100)", color: "var(--fg-secondary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {v.hasPhoto ? (
                    <>
                      <img src={v.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </>
                  ) : null}
                  {v.noPhoto ? (
                    <>
                      <NTV.Icon name="user" size={v.i24} />
                    </>
                  ) : null}
                </button>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>Profile Image</span>
                <span className="dv-sub" style={{ fontSize: "10px" }}>Click to upload</span>
              </div>
              <div>
                <label className="dv-label" htmlFor="na-name">Advertiser Name</label>
                <input id="na-name" className="dv-field" placeholder="Ex. Cahaba Brewing" value={v.name} onChange={v.setName} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <span className="dv-label">Category</span>
                  <NTV.Select size="l" placeholder="Select" options={v.categories} value={v.category} onChange={v.setCategory} />
                </div>
                <div>
                  <span className="dv-label">General Category</span>
                  <NTV.Select size="l" placeholder="Select" options={v.genCats} value={v.genCat} onChange={v.setGenCat} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="dv-label" htmlFor="na-lat">Latitude</label>
                  <input id="na-lat" className="dv-field" placeholder="Ex. 33.2098" value={v.lat} disabled={v.yes} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="na-lng">Longitude</label>
                  <input id="na-lng" className="dv-field" placeholder="Ex. -87.5692" value={v.lng} disabled={v.yes} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="dv-label" htmlFor="na-addr">Address</label>
                  <input id="na-addr" className="dv-field" placeholder="Pick on the map" value={v.addrPicked} disabled={v.yes} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="na-city">City</label>
                  <input id="na-city" className="dv-field" placeholder="City" value={v.city} disabled={v.yes} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label className="dv-label" htmlFor="na-st">State</label>
                  <input id="na-st" className="dv-field" value={v.stCode} disabled={v.yes} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="na-rg">Region</label>
                  <input id="na-rg" className="dv-field" value={v.region} disabled={v.yes} />
                </div>
                <div>
                  <label className="dv-label" htmlFor="na-zip">Zipcode</label>
                  <input id="na-zip" className="dv-field" value={v.zip} disabled={v.yes} />
                </div>
              </div>
              <NTV.Button variant="primary" size="m" iconLeft="floppy-disk" iconRight={v.none} disabled={v.blocked} onClick={v.create} style={{ alignSelf: "flex-end" }}>Save Advertiser Profile</NTV.Button>
            </section>
            <section className="dv-card" style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "0" }}>
              <div className="dv-between">
                <div>
                  <h2 className="dv-h3">Location Map</h2>
                  <p className="dv-sub">Search an address or pick from the suggestions</p>
                </div>
                <span className="dv-pill" style={{ background: "var(--primary-100)", color: "var(--fg-secondary)" }}>
                  <NTV.Icon name="location-dot" size={v.i10} />
                  {v.mapLabel}
                </span>
              </div>
              <div className="dv-row" style={{ gap: "10px", position: "relative" }}>
                <div style={{ flex: "1", position: "relative" }}>
                  <NTV.Input size="l" placeholder="Search location, City or Address" iconLeft="magnifying-glass" label="Search location" value={v.addr} onChange={v.setAddr} />
                  {v.showSug ? (
                    <>
                      <div className="dv-menu" role="listbox" style={{ left: "0", right: "0", top: "46px", maxHeight: "260px", overflowY: "auto" }}>
                      {(v.sugs || []).map((_g, $index) => (
                        <React.Fragment key={$index}>
                          <button type="button" role="option" className="sug" onClick={_g?.pick}>
                            <span style={{ color: "var(--danger-main)" }}><NTV.Icon name="location-dot-solid" size={v.i14} /></span>
                            <span style={{ display: "flex", flexDirection: "column" }}>
                              <strong style={{ fontSize: "14px", lineHeight: "20px" }}>{_g?.line1}</strong>
                              <span className="dv-sub">{_g?.line2}</span>
                            </span>
                          </button>
                        </React.Fragment>
                      ))}
                      {v.noSug ? (
                        <>
                          <p className="dv-p" style={{ padding: "8px 14px" }}>{"No addresses in "}{v.stateName}{" match."}</p>
                        </>
                      ) : null}
                    </div>
                    </>
                  ) : null}
                </div>
                <div style={{ width: "210px", flex: "none" }}>
                  <NTV.Select size="l" options={v.states} value={v.state} onChange={v.setStateF} />
                </div>
              </div>
              <div className="mini-map" style={{ flex: "1", height: "auto", minHeight: "520px", backgroundImage: `url(${s(v.map)})`, backgroundSize: "1880px 906px", backgroundPosition: `${s(v.pos)}` }}>
                {v.picked ? (
                  <>
                    <span className="mini-pin"><NTV.Icon name="location-dot-solid" size={v.i32} /></span>
                  </>
                ) : null}
              </div>
            </section>
          </div>
        </main>
      </div>
      {v.done ? (
        <>
          <div className="dv-ov">
          <NTV.StatusModal status="success" title="Advertiser Created" width={v.w460}>
            <p className="dv-p" style={{ textAlign: "center" }}>
              <strong style={{ color: "var(--fg-primary)" }}>{v.name}</strong>
              {" was added. Upload their content next so you can add it to playlists."}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <a href="DealerAdvertisers.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--neutral ntv-btn--xl" style={{ textDecoration: "none" }}>Back to List</a>
              <a href="DealerAdvertiserDetail.dc.html" onClick={v.view} className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ textDecoration: "none" }} data-nav={v.viewNav}>Upload Content</a>
            </div>
          </NTV.StatusModal>
        </div>
        </>
      ) : null}
    </div>
    </div>
));

export default Component;
