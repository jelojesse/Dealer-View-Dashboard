// @ts-nocheck
/**
 * Page: Login  (route /login)
 * Mock sign-in for switching between the Dealer view and the Admin view. No real passwords:
 * picking a view stores the role (lib/shared.js setRole) and opens that view's home page.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { getRole, go, setImpersonating, setRole } from '../lib/shared';
import './Login.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() {
    var last = getRole();
    var pick = function (role, page) { return function () { setImpersonating(null); setRole(role); go(page); }; };
    return {
      i16: 16,
      options: [
        { key: 'dealer', title: 'Dealer', who: 'Ibanez Lighting Inc.', role: 'Dealer Admin', text: 'Manage your hosts, advertisers, licenses, content and screens.', icon: 'building', tone: 'danger', pick: pick('dealer', 'DealerDashboard.dc.html'), last: last === 'dealer' },
        { key: 'admin', title: 'Admin', who: 'Joe Admin', role: 'Super Admin', text: 'Oversee every dealer: onboarding, risk, licenses and impersonation.', icon: 'user-gear', tone: 'info', pick: pick('admin', 'AdminDealers.dc.html'), last: last === 'admin' }
      ]
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-login" style={{ display: "contents" }}>
    <div className="ntv-root lg-page">
      <main className="lg-card" aria-labelledby="lg-title">
        <NTV.Logo height={36} />
        <div>
          <h1 id="lg-title" className="lg-h1">Sign in</h1>
          <p className="lg-sub">Choose a view to continue. This is a prototype — no password needed.</p>
        </div>
        <div className="lg-options">
          {(v.options || []).map((_o) => (
            <button key={_o.key} type="button" className="lg-option" onClick={_o.pick}>
              <NTV.IconTile icon={_o.icon} tone={_o.tone} />
              <span className="lg-option__body">
                <span className="lg-option__title">
                  {"Sign in as "}{_o.title}
                  {_o.last ? <span className="lg-option__last">Last used</span> : null}
                </span>
                <span className="lg-option__who">{_o.who}{" · "}{_o.role}</span>
                <span className="lg-option__text">{_o.text}</span>
              </span>
              <NTV.Icon name="angle-right" size={v.i16} />
            </button>
          ))}
        </div>
      </main>
      {/* go(...) navigates by clicking these hidden design-file links (same as DealerNav). */}
      <div aria-hidden="true" style={{ display: "none" }}>
        <a data-go="DealerDashboard.dc.html" href="DealerDashboard.dc.html" tabIndex="-1">Dealer</a>
        <a data-go="AdminDealers.dc.html" href="AdminDealers.dc.html" tabIndex="-1">Admin</a>
      </div>
    </div>
    </div>
));

export default Component;
