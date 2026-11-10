// @ts-nocheck
/**
 * Component: LicenseRow
 * Converted from the Claude Design artboard LicenseRow.dc.html.
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
    var on = !!(p.on ?? false);
    var locked = !!(p.locked ?? false);
    var date = p.date ?? '';
    var active = on && !locked;
    return {
      uuid: p.uuid ?? '333ac3cd-f731-4c9b-a543-6174829bdb70',
      on: on || locked,
      locked: locked,
      hint: locked ? 'Already playing another screen on this host' : '',
      opacity: locked ? 0.45 : 1,
      idColor: locked ? 'var(--fg-faint)' : 'var(--fg-primary)',
      showDate: !locked,
      dateText: date || 'set installation date',
      dateColor: date ? 'var(--fg-primary)' : 'var(--fg-secondary)',
      dateWeight: date ? 600 : 400,
      dateDisabled: !active,
      calBorder: active ? 'var(--fg-primary)' : 'transparent',
      calBg: active ? 'var(--bg-surface)' : 'var(--bg-disabled)',
      calFg: active ? 'var(--fg-primary)' : 'var(--fg-secondary)',
      calCursor: active ? 'pointer' : 'not-allowed',
      iconSize: 12,
      toggle: p.onToggle || function () {},
      openDate: p.onDate || function () {}
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div className="ntv-root" title={v.hint} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", minHeight: "34px", boxSizing: "border-box", fontFamily: "var(--font-sans)", opacity: `${s(v.opacity)}` }}>
      <span style={{ flex: "0 0 44px", width: "44px", height: "24px", display: "inline-flex", alignItems: "center" }}>
        <NTV.Switch checked={v.on} disabled={v.locked} onChange={v.toggle} label={`Publish to license ${s(v.uuid)}`} style={{ width: "44px", height: "24px", flex: "none" }} />
      </span>
      <span style={{ flex: "1 1 auto", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "14px", lineHeight: "20px", color: `${s(v.idColor)}` }}>{v.uuid}</span>
      {v.showDate ? (
        <>
          <span style={{ flex: "none", fontSize: "14px", lineHeight: "20px", color: `${s(v.dateColor)}`, fontWeight: `${s(v.dateWeight)}` }}>{v.dateText}</span>
          <button type="button" aria-label={`Set installation date for ${s(v.uuid)}`} disabled={v.dateDisabled} onClick={v.openDate} style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", padding: "0", borderRadius: "var(--radius-sm)", border: `1px solid ${s(v.calBorder)}`, background: `${s(v.calBg)}`, color: `${s(v.calFg)}`, cursor: `${s(v.calCursor)}` }}><NTV.Icon name="calendar" size={v.iconSize} /></button>
        </>
      ) : null}
    </div>
    </>
));

export default Component;
