// @ts-nocheck
/**
 * Component: ScreenPreview
 * Converted from the Claude Design artboard ScreenPreview.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import './ScreenPreview.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() {
    var p = this.props;
    var sel = p.selected ?? 'main';
    var bg = p.background ?? 'wood';
    var on = p.onSelect || function () {};
    var ring = 'inset 0 0 0 3px var(--accent-action)';
    var logo = !!(p.withLogo ?? false);
    var defs = logo ? [
      { id: 'main', label: 'Main', col: '1 / 3', row: '1 / 2', image: p.mainImage || 'images/c4a37fb83fc3e691fe48d16d07aea2c3.jpg' },
      { id: 'vertical', label: 'Vertical', col: '3 / 4', row: '1 / 2', image: p.verticalImage || 'images/00a9efca3bfe9d27b9efdfc8e2059e1a.jpg' },
      { id: 'logo', label: 'Logo', col: '1 / 2', row: '2 / 3', image: p.logoImage || 'images/b31eb17cc186f1f9342c815ac2bb13e9.jpg' },
      { id: 'horizontal', label: 'Horizontal', col: '2 / 4', row: '2 / 3', image: p.horizontalImage || 'images/071fd1b30a9fd087421447c24a93d410.jpg' }
    ] : [
      { id: 'main', label: 'Main', col: '1 / 2', row: '1 / 2', image: p.mainImage || 'images/c4a37fb83fc3e691fe48d16d07aea2c3.jpg' },
      { id: 'vertical', label: 'Vertical', col: '2 / 3', row: '1 / 2', image: p.verticalImage || 'images/00a9efca3bfe9d27b9efdfc8e2059e1a.jpg' },
      { id: 'horizontal', label: 'Horizontal', col: '1 / 3', row: '2 / 3', image: p.horizontalImage || 'images/071fd1b30a9fd087421447c24a93d410.jpg' }
    ];
    return {
      cols: logo ? '192fr 535fr 162fr' : '702fr 154fr',
      bgColor: bg === 'navy' ? 'var(--primary-main)' : (bg === 'none' ? 'var(--primary-100)' : '#c8a06a'),
      hasBgImage: bg === 'wood',
      bgImage: 'images/eb46f209fd54080980c88eeb301eaed2.jpg',
      bgRing: sel === 'background' ? ring : 'none',
      pickBg: function () { on('background'); },
      zones: defs.map(function (d) {
        return { label: d.label, col: d.col, row: d.row, image: d.image, selected: sel === d.id,
          ring: sel === d.id ? ring : 'none', pick: function (e) { if (e && e.stopPropagation) e.stopPropagation(); on(d.id); } };
      })
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", boxSizing: "border-box", overflow: "hidden", background: `${s(v.bgColor)}` }}>
      {v.hasBgImage ? (
        <>
          <img src={v.bgImage} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </>
      ) : null}
      <button type="button" aria-label="Show Background playlist" onClick={v.pickBg} style={{ position: "absolute", inset: "0", padding: "0", border: "0", background: "transparent", cursor: "pointer", boxShadow: `${s(v.bgRing)}` }} />
      <div style={{ position: "absolute", inset: "0", boxSizing: "border-box", padding: "10px", display: "grid", gridTemplateColumns: `${s(v.cols)}`, gridTemplateRows: "806fr 234fr", gap: "10px", pointerEvents: "none" }}>
        {(v.zones || []).map((_z, $index) => (
          <React.Fragment key={$index}>
            <button type="button" className="sp-zone" aria-pressed={_z?.selected} aria-label={`Show ${s(_z?.label)} playlist`} onClick={_z?.pick} style={{ position: "relative", gridColumn: `${s(_z?.col)}`, gridRow: `${s(_z?.row)}`, minWidth: "0", minHeight: "0", padding: "0", border: "0", overflow: "hidden", cursor: "pointer", pointerEvents: "auto", background: "#8ba7e9", boxShadow: `${s(_z?.ring)}` }}>
              <img src={_z?.image} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <span style={{ position: "absolute", inset: "0", boxShadow: `${s(_z?.ring)}` }} />
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
    </>
));

export default Component;
