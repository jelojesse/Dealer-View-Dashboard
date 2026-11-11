// @ts-nocheck
/**
 * Page: Create Screen · 1 Setup  (route /screens/new)
 * Converted from the Claude Design artboard DealerNewScreen.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, draft, peekNav, val } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import TemplateCard from '../components/TemplateCard';
import './DealerNewScreen.css';

/* ============================== Logic ============================== */

var TEMPLATES = [
  { id: 'nct-standard', title: 'NCT Standard Template' }, { id: 'standard-v2', title: 'Standard Template V2' },
  { id: 'fullscreen', title: 'Fullscreen' }, { id: 'test', title: 'Test Template' },
  { id: 'two-one', title: '2-1 Zone' }, { id: 'one-one', title: '1 to 1 Zone' }
];
class Component extends DCLogic {
  constructor(props) { super(props); this.state = { name: '', desc: '', type: '', template: '' }; }
  renderVals() {
    var self = this, s = this.state;
    var picked = TEMPLATES.filter(function (t) { return t.id === s.template; })[0];
    var ok = !!(s.name.trim() && s.type && s.template);
    return {
      yes: true, none: null, i14: 14, stepIndex: 0,
      steps: ['Setup', 'Assign Playlist to Zones', 'Publish to Licenses'],
      crumbs: [{ label: 'Screens', href: 'DealerScreens.dc.html' }, 'Create Screen'],
      name: s.name, desc: s.desc, type: s.type, typeOptions: ['Ad', 'Menu', 'Announcement'],
      setName: function (v) { self.setState({ name: val(v) }); },
      setDesc: function (v) { self.setState({ desc: val(v) }); },
      setType: function (v) { self.setState({ type: val(v) }); },
      templates: TEMPLATES.map(function (t) {
        return { title: t.title, description: 'Classic layout with main content area, vertical sidebar and horizontal footer zone', layout: t.id, selected: t.id === s.template,
          pick: function () { self.setState({ template: self.state.template === t.id ? '' : t.id }); } };
      }),
      hasTemplate: !!picked, templateName: picked ? picked.title : '',
      cannotProceed: !ok, canProceed: ok,
      save: function () { draft({ name: s.name.trim(), desc: s.desc.trim(), type: s.type, template: picked.title }); }
    };
  }
}

;(function () { var P = ''; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <div className="pg-new-screen" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="display" activeItem="Screens" />
      </div>
      <div className="dv-scroll">
        <div style={{ padding: "20px 20px 0" }}><NTV.Breadcrumbs items={v.crumbs} /></div>
        <main style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", maxWidth: "1540px", margin: "0 auto", padding: "20px 20px 40px", boxSizing: "border-box" }}>
          <h1 style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", margin: "0" }}>Create Screen</h1>
          <section className="dv-card" aria-label="Progress" style={{ overflowX: "auto" }}><NTV.Stepper steps={v.steps} current={v.stepIndex} style={{ width: "100%" }} /></section>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "20px" }}>
            <section className="dv-card" aria-labelledby="details-title" style={{ flex: "1 1 380px", maxWidth: "450px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <h2 id="details-title" className="dv-h3">Screen Details</h2>
              <NTV.FormField label="Screen Name">
                <NTV.Input size="l" placeholder="Enter Screen Name" label="Screen Name" value={v.name} onChange={v.setName} />
              </NTV.FormField>
              <NTV.FormField label="Description (Optional)">
                <NTV.Input size="l" placeholder="ex. This screen is used for Medicine" label="Description" value={v.desc} onChange={v.setDesc} />
              </NTV.FormField>
              <NTV.FormField label="Click to Select a Screen Type">
                <NTV.Select size="l" placeholder="Select" options={v.typeOptions} value={v.type} onChange={v.setType} />
              </NTV.FormField>
              <div className="dv-note">
                <NTV.Icon name="circle-info" size={v.i14} />
                <span>
                  {"This screen will be created under "}
                  <strong>Ibanez Lighting Inc. (001-IBNLI)</strong>
                  . You’ll pick the host and licenses in step 3.
                </span>
              </div>
            </section>
            <section className="dv-card" aria-labelledby="template-title" style={{ flex: "999 1 560px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <h2 id="template-title" className="dv-h3">Choose Template</h2>
                  <p className="dv-p" style={{ fontSize: "14px", lineHeight: "20px" }}>Pick how content is split across the screen</p>
                </div>
                {v.hasTemplate ? (
                  <>
                    <p className="dv-p">
                    {"Selected "}
                    <strong style={{ color: "var(--fg-primary)" }}>{v.templateName}</strong>
                  </p>
                  </>
                ) : null}
              </div>
              <div style={{ border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", padding: "20px", maxHeight: "604px", overflowY: "auto" }}>
                <div role="group" aria-label="Templates" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                  {(v.templates || []).map((_t, $index) => (
                    <React.Fragment key={$index}>
                      <TemplateCard title={_t?.title} description={_t?.description} layout={_t?.layout} selected={_t?.selected} onSelect={_t?.pick} />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <a href="DealerScreens.dc.html" className="ntv-btn ntv-btn--primary ntv-btn--neutral ntv-btn--xl" style={{ minWidth: "100px", textDecoration: "none" }}>Back</a>
            {v.cannotProceed ? (
              <>
                <NTV.Button variant="primary" size="xl" iconRight={v.none} disabled={v.yes} style={{ minWidth: "100px" }}>Proceed</NTV.Button>
              </>
            ) : null}
            {v.canProceed ? (
              <>
                <a href="DealerAssignPlaylist.dc.html" onClick={v.save} className="ntv-btn ntv-btn--primary ntv-btn--default ntv-btn--xl" style={{ minWidth: "100px", textDecoration: "none" }} data-nav={v.saveNav}>Proceed</a>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
    </div>
));

export default Component;
