// @ts-nocheck
/**
 * Component: LicenseTableRow
 * Converted from the Claude Design artboard LicenseTableRow.dc.html.
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
    var p = this.props;
    var online = !!(p.online ?? true);
    return {
      n: p.n ?? 1,
      licenseKey: p.licenseKey ?? '6ec28334-0c92-4bff-baa0-b095fac549e2',
      alias: p.alias ?? 'License # 101',
      internet: p.internet ?? 'LAN',
      speed: p.speed ?? '36 MB/s',
      on: !!(p.on ?? true),
      dot: online ? 'var(--status-online)' : 'var(--status-offline)',
      statusLabel: online ? 'Online' : 'Offline',
      iconSm: 12,
      toggle: p.onToggle || function () {}
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div role="row" className="ntv-root" style={{ display: "grid", gridTemplateColumns: "46px minmax(0, 1fr) 150px 130px 115px 80px", alignItems: "center", minWidth: "760px", height: "54px", boxSizing: "border-box", borderTop: "1px solid var(--container-border)", background: "var(--bg-surface)", fontFamily: "var(--font-sans)", fontSize: "12px", lineHeight: "20px", color: "var(--fg-primary)" }}>
      <div role="cell" style={{ textAlign: "center" }}>{v.n}</div>
      <div role="cell" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 16px", minWidth: "0" }}>
        <span role="img" aria-label={v.statusLabel} title={v.statusLabel} style={{ flex: "none", width: "8px", height: "8px", borderRadius: "var(--radius-full)", background: `${s(v.dot)}` }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.licenseKey}</span>
      </div>
      <div role="cell" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 16px" }}>
        <span style={{ whiteSpace: "nowrap" }}>{v.alias}</span>
        <button type="button" aria-label={`Rename ${s(v.alias)}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", padding: "0", border: "0", background: "transparent", color: "var(--fg-primary)", cursor: "pointer" }}><NTV.Icon name="pencil" size={v.iconSm} /></button>
      </div>
      <div role="cell" style={{ padding: "0 16px" }}>{v.internet}</div>
      <div role="cell" style={{ padding: "0 16px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", height: "22px", padding: "0 8px", borderRadius: "var(--radius-sm)", background: "var(--success-050)", color: "var(--success-600)", fontWeight: "600", whiteSpace: "nowrap" }}>{v.speed}</span>
      </div>
      <div role="cell" style={{ display: "flex", alignItems: "center", padding: "0 16px" }}>
        <span style={{ flex: "0 0 44px", width: "44px", height: "24px", display: "inline-flex", alignItems: "center" }}>
          <NTV.Switch checked={v.on} onChange={v.toggle} label={`Play on ${s(v.alias)}`} style={{ width: "44px", height: "24px", flex: "none" }} />
        </span>
      </div>
    </div>
    </>
));

export default Component;
