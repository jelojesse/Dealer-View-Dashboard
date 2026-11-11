// @ts-nocheck
/**
 * Component: TemplateCard
 * Converted from the Claude Design artboard TemplateCard.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() {
    var deep = '#2f467d', mid = '#5273c0', soft = '#8ba7e9', bright = '#6c9cf5', pale = '#b4ccfb', logo = 'var(--primary-700)';
    var L = {
      'nct-standard': { cols: '79fr 21fr', rows: '71fr 29fr', gap: '5px', pad: '5px', zones: [
        { label: 'Main', col: '1 / 2', row: '1 / 2', bg: deep },
        { label: 'Vertical', col: '2 / 3', row: '1 / 2', bg: mid },
        { label: 'Horizontal', col: '1 / 3', row: '2 / 3', bg: soft }] },
      'standard-v2': { cols: '23fr 56fr 21fr', rows: '71fr 29fr', gap: '5px', pad: '5px', zones: [
        { label: 'Main', col: '1 / 3', row: '1 / 2', bg: deep },
        { label: 'Vertical', col: '3 / 4', row: '1 / 2', bg: mid },
        { label: 'Logo', col: '1 / 2', row: '2 / 3', bg: logo },
        { label: 'Horizontal', col: '2 / 4', row: '2 / 3', bg: soft }] },
      'fullscreen': { cols: '1fr', rows: '1fr', gap: '0', pad: '0', zones: [
        { label: 'Main', col: '1 / 2', row: '1 / 2', bg: mid }] },
      'test': { cols: '47fr 53fr', rows: '1fr', gap: '0', pad: '10px', zones: [
        { label: 'Main', col: '1 / 2', row: '1 / 2', bg: mid }] },
      'two-one': { cols: '37fr 63fr', rows: '1fr 1fr', gap: '0', pad: '0', zones: [
        { label: 'Upper Left', col: '1 / 2', row: '1 / 2', bg: soft },
        { label: 'Lower Left', col: '1 / 2', row: '2 / 3', bg: deep },
        { label: 'Main', col: '2 / 3', row: '1 / 3', bg: mid }] },
      'one-one': { cols: '1fr 1fr 1fr', rows: '74fr 26fr', gap: '0', pad: '0', zones: [
        { label: 'Left', col: '1 / 2', row: '1 / 2', bg: soft },
        { label: 'Middle', col: '2 / 3', row: '1 / 2', bg: bright },
        { label: 'Right', col: '3 / 4', row: '1 / 2', bg: pale },
        { label: 'Horizontal', col: '1 / 4', row: '2 / 3', bg: deep }] }
    };
    var l = L[this.props.layout ?? 'nct-standard'] || L['nct-standard'];
    var selected = !!(this.props.selected ?? false);
    return {
      title: this.props.title ?? 'NCT Standard Template',
      description: this.props.description ?? 'Classic layout with main content area, vertical sidebar and horizontal footer zone',
      cols: l.cols, rows: l.rows, gap: l.gap, pad: l.pad, zones: l.zones,
      selected: selected,
      borderColor: selected ? 'var(--accent-action)' : 'var(--container-border)',
      ring: selected ? 'inset 0 0 0 1px var(--accent-action)' : 'none',
      checkSize: 12,
      select: this.props.onSelect || function () {}
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <button type="button" className="ntv-root" aria-pressed={v.selected} onClick={v.select} style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: "284px", boxSizing: "border-box", padding: "0", textAlign: "left", cursor: "pointer", overflow: "hidden", background: "var(--bg-surface)", border: `1px solid ${s(v.borderColor)}`, boxShadow: `${s(v.ring)}`, borderRadius: "var(--radius-sm)", fontFamily: "var(--font-sans)", color: "var(--fg-primary)" }}>
      <div aria-hidden="true" style={{ display: "grid", width: "100%", height: "162px", flex: "none", boxSizing: "border-box", gridTemplateColumns: `${s(v.cols)}`, gridTemplateRows: `${s(v.rows)}`, gap: `${s(v.gap)}`, padding: `${s(v.pad)}`, background: "#b4ccfb" }}>
        {(v.zones || []).map((_z, $index) => (
          <React.Fragment key={$index}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gridColumn: `${s(_z?.col)}`, gridRow: `${s(_z?.row)}`, background: `${s(_z?.bg)}`, color: "var(--white)", fontSize: "14px", lineHeight: "20px", fontWeight: "600" }}>{_z?.label}</div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>{v.title}</span>
          {v.selected ? (
            <>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none", width: "24px", height: "24px", borderRadius: "var(--radius-full)", background: "var(--accent-action)", color: "var(--white)" }}><NTV.Icon name="check" size={v.checkSize} title="Selected" /></span>
            </>
          ) : null}
        </div>
        <span style={{ fontSize: "14px", lineHeight: "20px", fontWeight: "600", color: "var(--fg-secondary)" }}>{v.description}</span>
      </div>
    </button>
    </>
));

export default Component;
