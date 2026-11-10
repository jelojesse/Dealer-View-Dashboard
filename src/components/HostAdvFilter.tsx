// @ts-nocheck
/**
 * Component: HostAdvFilter
 * Converted from the Claude Design artboard HostAdvFilter.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, advsForHost, byId, hostName, peekNav, val, D } from '../lib/shared';
import './HostAdvFilter.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { query: '', host: '', adv: '' }; }
  componentDidUpdate(prev) { if (this.props.open && !prev.open) this.setState({ query: '', host: '', adv: '' }); }
  renderVals() {
    var self = this, s = this.state, p = this.props;
    var host = s.host ? byId(D.hosts, s.host) : null;
    var q = s.query.trim().toLowerCase();
    var advs = host ? advsForHost(host.id) : [];
    return {
      visible: !!(p.open ?? false), none: null, w: 520,
      query: s.query,
      setQuery: function (v) { self.setState({ query: val(v), host: '', adv: '' }); },
      showList: q.length > 0 && !host,
      matches: D.hosts.filter(function (h) { return (h.name + ' ' + h.city).toLowerCase().indexOf(q) !== -1; }).slice(0, 8).map(function (h) {
        return { name: h.name, address: h.address, city: h.city, pick: function () { self.setState({ host: h.id, query: h.name, adv: '' }); } };
      }),
      hasAdvs: advs.length > 0,
      noAdvs: advs.length === 0,
      note: host ? 'This Host has no Advertisers yet.' : 'Advertiser field will appear if this Host has available Advertisers',
      advOptions: advs.map(function (a) { return a.name; }),
      adv: s.adv,
      setAdv: function (v) { self.setState({ adv: val(v) }); },
      noHost: !host,
      close: p.onClose || function () {},
      apply: function () { (p.onApply || function () {})({ host: host.id, hostName: host.name, adv: s.adv }); }
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    {v.visible ? (
      <>
        <div className="ntv-root" style={{ position: "fixed", inset: "0", zIndex: "200", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(9, 22, 53, 0.45)", fontFamily: "var(--font-sans)", color: "var(--fg-primary)" }}>
        <NTV.Modal title={"Filter by Host & Advertiser"} width={v.w} onClose={v.close}>
          <p style={{ margin: "-8px 0 16px", fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>Select a Host and Advertiser</p>
          <div style={{ position: "relative" }}>
            <NTV.FormField label="Assign Host">
              <NTV.Input size="l" placeholder="Ex. Plaza O’ George" iconRight="magnifying-glass" label="Host" value={v.query} onChange={v.setQuery} />
            </NTV.FormField>
            {v.showList ? (
              <>
                <div role="listbox" aria-label="Hosts" style={{ position: "absolute", left: "0", right: "0", top: "72px", zIndex: "5", maxHeight: "220px", overflowY: "auto", padding: "4px 0", background: "var(--list-bg)", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-card)" }}>
                {(v.matches || []).map((_h, $index) => (
                  <React.Fragment key={$index}>
                    <button type="button" role="option" aria-selected="false" className="haf-opt" onClick={_h?.pick} style={{ display: "flex", flexDirection: "column", width: "100%", padding: "8px 14px", border: "0", background: "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "var(--fg-primary)" }}>
                      <span style={{ fontSize: "14px", lineHeight: "20px", fontWeight: "600" }}>{_h?.name}</span>
                      <span style={{ fontSize: "12px", lineHeight: "20px", color: "var(--fg-secondary)" }}>{_h?.address}{", "}{_h?.city}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
              </>
            ) : null}
          </div>
          {v.hasAdvs ? (
            <>
              <div style={{ marginTop: "16px" }}>
              <NTV.FormField label="Advertiser (Optional)">
                <NTV.Select size="l" placeholder="All advertisers" options={v.advOptions} value={v.adv} onChange={v.setAdv} />
              </NTV.FormField>
            </div>
            </>
          ) : null}
          {v.noAdvs ? (
            <>
              <div style={{ marginTop: "16px", padding: "12px 14px", border: "1px solid var(--info-main)", borderRadius: "var(--radius-sm)", background: "var(--info-050)", color: "var(--info-600)", fontSize: "14px", lineHeight: "20px", fontWeight: "700" }}>{v.note}</div>
            </>
          ) : null}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
            <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.close}>Cancel</NTV.Button>
            <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.noHost} onClick={v.apply}>Proceed</NTV.Button>
          </div>
        </NTV.Modal>
      </div>
      </>
    ) : null}
    </>
));

export default Component;
