// @ts-nocheck
/**
 * Component: DemoTag
 * Converted from the Claude Design artboard DemoTag.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() { return { label: this.props.label ?? 'Demo' }; }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <span style={{ display: "inline-flex", alignItems: "center", boxSizing: "border-box", height: "24px", padding: "0 12px", borderRadius: "var(--radius-md)", background: "var(--purple-main)", color: "var(--white)", fontFamily: "var(--font-sans)", fontSize: "12px", lineHeight: "20px", fontWeight: "600", whiteSpace: "nowrap" }}>{v.label}</span>
    </>
));

export default Component;
