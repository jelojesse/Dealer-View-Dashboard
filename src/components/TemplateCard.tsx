// @ts-nocheck
/**
 * Component: TemplateCard
 * Template option card from Figma "Screens Page V2" → Change Template Modal.
 *
 * Props: title, description, layout (id in lib/templates LAYOUTS), selected, current,
 *        images ({ [zoneName]: imageUrl } — optional playlist covers drawn in the zones), onSelect.
 * - selected: 2px accent border + round check badge beside the title.
 * - current:  diagonal "CURRENT" ribbon in the preview's top-right corner (the template in use).
 */
import React from 'react';
import { NTV } from '../ds/ntv360';
import { layoutOf } from '../lib/templates';
import './TemplateCard.css';

function Zone({ z, image }) {
  var inner = (
    <div className="tc-zone" style={{ background: z.bg }}>
      {image ? <img src={image} alt="" /> : <span>{z.label || z.zone}</span>}
    </div>
  );
  // nested frames (Trippy): each frame is a padded coloured wrapper around the zone
  (z.frames || []).slice().reverse().forEach(function (c) { inner = <div className="tc-frame" style={{ background: c }}>{inner}</div>; });
  return <div style={{ gridColumn: z.col, gridRow: z.row, display: 'flex', minWidth: 0, minHeight: 0 }}>{inner}</div>;
}

export default function TemplateCard(p) {
  var l = layoutOf(p.layout || 'nct-standard');
  var images = p.images || {};
  return (
    <button type="button" className={'ntv-root tc' + (p.selected ? ' is-selected' : '')} aria-pressed={!!p.selected} onClick={p.onSelect}>
      <div className="tc-preview" aria-hidden="true" style={{ gridTemplateColumns: l.cols, gridTemplateRows: l.rows, gap: l.gap, padding: l.pad, background: l.bg }}>
        {l.zones.map(function (z) { return <Zone key={z.zone} z={z} image={images[z.zone]} />; })}
        {p.current ? (
          <span className="tc-ribbon">
            <span className="tc-ribbon__band">
              <img src="images/ribbon.svg" alt="" width="129.8" height="34.1523" />
              <span>CURRENT</span>
            </span>
          </span>
        ) : null}
      </div>
      <div className="tc-body">
        <div className="tc-head">
          <span className="tc-title" title={p.title}>{p.title || "NCT Standard Template"}</span>
          {p.selected ? <span className="tc-check"><NTV.Icon name="check-solid" size={10} title="Selected" /></span> : null}
        </div>
        <span className="tc-desc">{p.description || ''}</span>
        {p.current ? <span className="dv-visually-hidden">Current template</span> : null}
      </div>
    </button>
  );
}
