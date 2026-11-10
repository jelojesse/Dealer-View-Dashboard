// @ts-nocheck
/**
 * Component: ContentBlock
 * Converted from the Claude Design artboard ContentBlock.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import ContentThumb from './ContentThumb';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() {
    var items = this.props.items || [
      { image: 'images/8a2e22dd42dd5d67dbc30a39aec23ef3.jpg', kind: 'channel', title: 'Beyond the Blue', duration: '150 sec', span: 2 },
      { image: 'images/3150cc95c587f5d4777692f813e16534.jpg', kind: 'image', title: 'Telescope.jpg' },
      { image: 'images/945726549cb1ef1b00c0d26d31d3f3f2.jpg', kind: 'image', title: 'StarLens.jpg' },
      { image: 'images/ec827ec7c42f6fc992bed1db57a88695.jpg', kind: 'image', title: 'OrbitWear.jpg' }
    ];
    var n = 0;
    var list = items.map(function (it) { var s = it.span || 1; n += s; return { image: it.image, kind: it.kind, title: it.title, duration: it.duration || '', span: s }; });
    return { items: list, cols: 'repeat(' + n + ', 150px)', yes: true };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div role="group" aria-label="Block content" style={{ display: "grid", gridTemplateColumns: `${s(v.cols)}`, gridTemplateRows: "minmax(0, 1fr)", gap: "10px", height: "100%", minHeight: "136px", boxSizing: "border-box", padding: "10px", border: "2px solid var(--warning-main)", borderRadius: "var(--radius-md)", background: "rgba(255, 165, 0, 0.12)" }}>
      {(v.items || []).map((_it, $index) => (
        <React.Fragment key={$index}>
          <div style={{ gridColumn: `span ${s(_it?.span)}`, minWidth: "0", minHeight: "0", display: "flex" }}>
            <div style={{ width: "100%", height: "100%" }}>
              <ContentThumb image={_it?.image} kind={_it?.kind} title={_it?.title} duration={_it?.duration} inBlock={v.yes} />
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
    </>
));

export default Component;
