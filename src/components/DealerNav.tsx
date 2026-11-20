// @ts-nocheck
/**
 * Component: DealerNav
 * Converted from the Claude Design artboard DealerNav.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 *
 * Role-aware (mock session in lib/shared.js):
 *  - Dealer view: Dealer navbar ("Ibanez Lighting Inc. · Dealer Admin").
 *  - Admin view:  Admin navbar (Network → Dealers…, System) and "Joe Admin · Super Admin".
 *  - The profile block (top right) opens an account menu with Log out → login screen.
 *  - While an admin impersonates a dealer, a banner under the navbar offers "End session".
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import Toast from './Toast';
import { D, byId, getImpersonating, getRole, go, logout, setImpersonating, setRole, toast, toastVals } from '../lib/shared';
import './DealerNav.css';

/* ============================== Logic ============================== */

var MAP = {
  dashboard: 'DealerDashboard.dc.html', Dealers: 'AdminDealers.dc.html', Hosts: 'DealerHosts.dc.html', Advertisers: 'DealerAdvertisers.dc.html',
  Licenses: 'DealerLicenses.dc.html', Locator: 'DealerLocator.dc.html', 'Media Library': 'DealerMedia.dc.html', Playlists: 'DealerPlaylists.dc.html',
  channel: 'DealerChannels.dc.html', Screens: 'DealerScreens.dc.html', Tags: 'DealerTags.dc.html'
};
/* Extra pages the nav can jump to programmatically (go(...) clicks these hidden links). */
var EXTRA = ['Login.dc.html', 'AdminDealers.dc.html', 'AdminDealerDetail.dc.html'];
var SYSTEM = ['Users', 'Roles & Permissions', 'Settings'];

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { menu: false, toast: null }; this.wrap = React.createRef(); }
  componentDidMount() {
    var self = this;
    var el = this.userEl();
    if (el) {
      el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-haspopup', 'menu'); el.setAttribute('aria-expanded', 'false');
      el.setAttribute('aria-label', 'Account menu');
      this._key = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self.toggleMenu(); } };
      el.addEventListener('keydown', this._key);
    }
    this._doc = function (e) { if (!self.state.menu) return; if (self.wrap.current && !self.wrap.current.contains(e.target)) self.setState({ menu: false }); };
    this._esc = function (e) { if (e.key === 'Escape' && self.state.menu) { self.setState({ menu: false }); var u = self.userEl(); if (u) u.focus(); } };
    document.addEventListener('mousedown', this._doc);
    document.addEventListener('keydown', this._esc);
  }
  componentDidUpdate() { var el = this.userEl(); if (el) el.setAttribute('aria-expanded', this.state.menu ? 'true' : 'false'); }
  componentWillUnmount() {
    var el = this.userEl(); if (el && this._key) el.removeEventListener('keydown', this._key);
    document.removeEventListener('mousedown', this._doc); document.removeEventListener('keydown', this._esc);
    if (this._tt) clearTimeout(this._tt);
  }
  userEl() { return this.wrap.current ? this.wrap.current.querySelector('.ntv-navbar__user') : null; }
  toggleMenu() { this.setState({ menu: !this.state.menu }); }
  renderVals() {
    var self = this;
    var role = getRole() === 'admin' ? 'admin' : 'dealer';
    var imp = role === 'dealer' ? getImpersonating() : null;
    var impDealer = imp ? byId(D.dealers || [], imp) : null;
    var admin = role === 'admin';
    var items = admin ? [
      { key: 'dashboard', label: 'Dashboard', icon: 'grid-2' },
      { key: 'network', label: 'Network', icon: 'network-wired', menu: ['Dealers', 'Hosts', 'Advertisers', 'Licenses'] },
      { key: 'content', label: 'Content', icon: 'clapperboard-play', menu: ['Media Library', 'Playlists'] },
      { key: 'channel', label: 'Channel', icon: 'earth-americas' },
      { key: 'display', label: 'Display', icon: 'tv', menu: ['Screens', 'Tags'] },
      { key: 'system', label: 'System', icon: 'gear', menu: SYSTEM }
    ] : [
      { key: 'dashboard', label: 'Dashboard', icon: 'grid-2' },
      { key: 'network', label: 'Network', icon: 'network-wired', menu: ['Hosts', 'Advertisers', 'Licenses', 'Locator'] },
      { key: 'content', label: 'Content', icon: 'clapperboard-play', menu: ['Media Library', 'Playlists'] },
      { key: 'channel', label: 'Channel Manager', icon: 'earth-americas' },
      { key: 'display', label: 'Display', icon: 'tv', menu: ['Screens', 'Tags'] }
    ];
    var userName = admin ? 'Joe Admin' : (impDealer ? impDealer.business : 'Ibanez Lighting Inc.');
    var userRole = admin ? 'Super Admin' : 'Dealer Admin';
    var hrefs = Object.keys(MAP).map(function (k) { return MAP[k]; }).concat(EXTRA).filter(function (h, i, a) { return a.indexOf(h) === i; });
    return {
      yes: true, i14: 14,
      active: this.props.active ?? 'dashboard',
      activeItem: this.props.activeItem ?? '',
      items: items, userName: userName, userRole: userRole, roleLabel: admin ? 'Admin view' : 'Dealer view',
      links: hrefs.map(function (h) { return { href: h, label: h }; }),
      nav: function (key, item) {
        if (key === 'system') { toast(self, (item || 'System') + ' isn’t designed yet', 'info'); return; }
        // Admin "Dashboard" opens Dealers until an admin dashboard is designed.
        var target = admin && key === 'dashboard' && !item ? MAP.Dealers : (MAP[item] || MAP[key]);
        if (!target) return;
        var a = document.querySelector('a[data-go="' + target + '"]');
        if (a) a.click();
      },
      onWrapClick: function (e) { if (e.target && e.target.closest && e.target.closest('.ntv-navbar__user')) self.toggleMenu(); },
      menu: this.state.menu,
      logOut: function () { self.setState({ menu: false }); logout(); go('Login.dc.html'); },
      impersonating: !!impDealer, impName: impDealer ? impDealer.business : '', impAlias: impDealer ? impDealer.alias : '',
      endSession: function () { var id = imp; setImpersonating(null); setRole('admin'); go('AdminDealerDetail.dc.html', { id: id, ended: true }); },
      toast: toastVals(this.state.toast, this)
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div className="ntv-root dn-wrap" style={{ width: "100%", position: "relative" }}>
      <div onClick={v.onWrapClick}>
        <NTV.Navbar items={v.items} active={v.active} activeItem={v.activeItem} userName={v.userName} userRole={v.userRole} unread={v.yes} onNavigate={v.nav} style={{ width: "100%" }} />
      </div>
      {v.menu ? (
        <div className="dn-menu" role="menu" aria-label="Account">
          <div className="dn-menu__head">
            <span className="dn-menu__avatar" aria-hidden="true"><NTV.Icon name="user" size={v.i14} /></span>
            <span style={{ minWidth: "0" }}>
              <span className="dn-menu__name">{v.userName}</span>
              <span className="dn-menu__role">{v.userRole}{" · "}{v.roleLabel}</span>
            </span>
          </div>
          <button type="button" role="menuitem" className="dn-menu__item" onClick={v.logOut}>
            <NTV.Icon name="arrow-right-from-bracket" size={v.i14} />
            Log out
          </button>
        </div>
      ) : null}
      {v.impersonating ? (
        <div className="dn-imp" role="status">
          <NTV.Icon name="eye" size={v.i14} />
          <span>{"You’re viewing as "}<strong>{v.impName}</strong>{" ("}{v.impAlias}{") · impersonating"}</span>
          <button type="button" className="dn-imp__end" onClick={v.endSession}>End session</button>
        </div>
      ) : null}
      <div aria-hidden="true" style={{ display: "none" }}>
        {(v.links || []).map((_l, $index) => (
          <React.Fragment key={$index}>
            <a data-go={_l?.href} href={_l?.href} tabIndex="-1">{_l?.label}</a>
          </React.Fragment>
        ))}
      </div>
      <Toast t={v.toast} />
    </div>
    </>
));

/* The wrapper ref lives on the class (wrap); attach it via a small shim so the template stays plain JSX. */
var _render = Component.prototype.render;
Component.prototype.render = function () { var out = _render.call(this); return <div ref={this.wrap} style={{ display: "contents" }}>{out}</div>; };

export default Component;
