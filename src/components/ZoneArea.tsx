// @ts-nocheck
/**
 * Component: ZoneArea
 * Converted from the Claude Design artboard ZoneArea.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import './ZoneArea.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() {
    var p = this.props;
    var selected = !!(p.selected ?? false);
    var image = p.image ?? '';
    var assigned = !!image;
    return {
      label: p.label ?? 'Main',
      image: image,
      assigned: assigned,
      selected: selected,
      iconSize: 10,
      bg: !assigned && selected ? 'var(--accent-action)' : '#8ba7e9',
      borderStyle: assigned && selected ? 'solid' : 'dashed',
      borderColor: assigned ? (selected ? 'var(--accent-action)' : 'transparent') : 'var(--white)',
      select: p.onSelect || function () {}
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <button type="button" className="zone-area" aria-pressed={v.selected} aria-label={`${s(v.label)} zone`} onClick={v.select} style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", minHeight: "80px", boxSizing: "border-box", padding: "12px", overflow: "hidden", cursor: "pointer", textAlign: "left", border: `2px ${s(v.borderStyle)} ${s(v.borderColor)}`, background: `${s(v.bg)}`, fontFamily: "var(--font-sans)" }}>
      {v.assigned ? (
        <>
          <img src={v.image} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </>
      ) : null}
      <span style={{ position: "relative", alignSelf: "flex-end", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", boxSizing: "border-box", borderRadius: "var(--radius-full)", border: "1px solid var(--white)", background: "#5273c0", color: "var(--white)" }}><NTV.Icon name="plus-solid" size={v.iconSize} /></span>
      <span style={{ position: "relative", alignSelf: "flex-start", display: "inline-flex", alignItems: "center", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--white)", background: "#5273c0", color: "var(--white)", fontSize: "14px", lineHeight: "20px", fontWeight: "600" }}>{v.label}</span>
    </button>
    </>
));

export default Component;
