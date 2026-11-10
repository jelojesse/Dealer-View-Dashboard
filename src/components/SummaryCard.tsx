// @ts-nocheck
/**
 * Component: SummaryCard
 * Converted from the Claude Design artboard SummaryCard.dc.html.
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
    var variant = p.variant ?? 'status';
    var icon = p.icon ?? 'tv-solid';
    return {
      isStatus: variant === 'status',
      isTrend: variant === 'trend',
      hasIcon: !!icon,
      icon: icon,
      tone: p.tone ?? 'danger',
      title: p.title ?? 'Total screens',
      description: p.description ?? 'All screens ever created',
      value: p.value ?? '6703',
      active: p.active ?? '3041',
      inactive: p.inactive ?? '1165',
      period: p.period ?? 'This Week',
      direction: p.direction ?? 'down',
      trend: p.trend ?? '-8.3%'
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div className="ntv-root" style={{ width: "100%", height: "100%", minHeight: "140px", boxSizing: "border-box", background: "var(--bg-surface)", border: "1px solid var(--container-border)", borderRadius: "var(--radius-lg)", padding: "var(--card-padding)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px", fontFamily: "var(--font-sans)", color: "var(--fg-primary)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {v.hasIcon ? (
            <>
              <NTV.IconTile icon={v.icon} tone={v.tone} />
            </>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h2 style={{ margin: "0", fontSize: "20px", lineHeight: "32px", fontWeight: "700" }}>{v.title}</h2>
            <p style={{ margin: "0", fontSize: "12px", lineHeight: "20px", fontWeight: "500", color: "var(--fg-secondary)" }}>{v.description}</p>
          </div>
        </div>
        <p style={{ margin: "0", fontSize: "28px", lineHeight: "42px", fontWeight: "700" }}>{v.value}</p>
      </div>
      {v.isStatus ? (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "28px", fontSize: "12px", lineHeight: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Active</span>
            <span style={{ fontWeight: "700", color: "var(--success-main)" }}>{v.active}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Inactive</span>
            <span style={{ fontWeight: "700", color: "var(--danger-main)" }}>{v.inactive}</span>
          </div>
        </div>
        </>
      ) : null}
      {v.isTrend ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "28px", fontSize: "12px", lineHeight: "20px" }}>
          <span>{v.period}</span>
          <NTV.Trend direction={v.direction}>{v.trend}</NTV.Trend>
        </div>
        </>
      ) : null}
    </div>
    </>
));

export default Component;
