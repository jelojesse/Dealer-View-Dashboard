// @ts-nocheck
/**
 * Component: ContentThumb
 * Converted from the Claude Design artboard ContentThumb.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() {
    var p = this.props;
    var kind = p.kind ?? 'image';
    var inBlock = !!(p.inBlock ?? false);
    var tags = {
      image: ['IMAGE', 'var(--info-050)', 'var(--info-600)'],
      video: ['VIDEO', 'var(--danger-050)', 'var(--danger-600)'],
      widget: ['WIDGET', 'var(--teal-050)', 'var(--teal-600)'],
      channel: ['CHANNEL', 'var(--warning-050)', 'var(--warning-600)']
    };
    var t = tags[kind] || tags.image;
    var duration = p.duration ?? '';
    return {
      image: p.image ?? 'images/f31035d36ea14a442085349a66032fb9.jpg',
      title: p.title ?? 'Steak.jpg',
      tag: t[0], tagBg: t[1], tagFg: t[2],
      duration: duration, hasDuration: !!duration,
      radius: inBlock ? 'var(--radius-md)' : 'var(--radius-lg)',
      borderW: inBlock ? '0.5px' : '1px',
      footerH: inBlock || kind === 'channel' ? '30px' : '36px',
      footerBg: kind === 'channel' ? 'var(--warning-main)' : (inBlock ? 'var(--bg-app)' : 'var(--bg-surface)')
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: "120px", boxSizing: "border-box", overflow: "hidden", border: `${s(v.borderW)} solid var(--container-border)`, borderRadius: `${s(v.radius)}`, background: "var(--bg-surface)", fontFamily: "var(--font-sans)", color: "var(--fg-primary)" }}>
      <div style={{ position: "relative", flex: "1 1 0", minHeight: "0", background: "#000" }}>
        <img src={v.image} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={{ position: "absolute", left: "9px", top: "8px", display: "inline-flex", alignItems: "center", height: "16px", padding: "0 6px", borderRadius: "10px", background: `${s(v.tagBg)}`, color: `${s(v.tagFg)}`, fontSize: "10px", lineHeight: "12px", fontWeight: "600", letterSpacing: "0.02em" }}>{v.tag}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", height: `${s(v.footerH)}`, flex: "none", boxSizing: "border-box", padding: "0 10px", background: `${s(v.footerBg)}` }}>
        <span style={{ flex: "1 1 auto", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px", lineHeight: "16px", fontWeight: "600" }}>{v.title}</span>
        {v.hasDuration ? (
          <>
            <span style={{ flex: "none", fontSize: "10px", lineHeight: "12px" }}>{v.duration}</span>
          </>
        ) : null}
      </div>
    </div>
    </>
));

export default Component;
