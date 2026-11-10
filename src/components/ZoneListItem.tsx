// @ts-nocheck
/**
 * Component: ZoneListItem
 * Converted from the Claude Design artboard ZoneListItem.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import './ZoneListItem.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { query: '' }; }
  renderVals() {
    var self = this;
    var p = this.props;
    var playlist = p.playlist ?? '';
    var expanded = !!(p.expanded ?? false);
    var selected = !!(p.selected ?? false);
    var all = p.playlists || [{ name: 'The Sedaap Hero Promo' }, { name: 'Sample Playlist' }];
    var q = (this.state.query || '').trim().toLowerCase();
    var options = all.filter(function (o) { return !q || o.name.toLowerCase().indexOf(q) !== -1; }).map(function (o) {
      var cur = o.name === playlist;
      return { name: o.name, current: cur, pick: o.pick || function () {},
        bg: cur ? 'var(--primary-050)' : 'transparent', color: cur ? 'var(--fg-primary)' : 'var(--fg-secondary)', weight: cur ? 600 : 400 };
    });
    return {
      label: p.label ?? 'Main',
      sub: playlist || 'Assign Playlist',
      subColor: playlist ? 'var(--accent-action)' : 'var(--fg-secondary)',
      expanded: expanded,
      borderColor: expanded || selected ? 'var(--accent-action)' : 'var(--container-border)',
      iconSize: 20, checkSize: 12,
      iconName: (p.checkWhenAssigned && playlist) ? 'circle-check-solid' : 'rectangle-history-solid',
      iconColor: (p.checkWhenAssigned && playlist) ? 'var(--success-400)' : 'var(--fg-secondary)',
      iconTitle: (p.checkWhenAssigned && playlist) ? 'Playlist assigned' : '',
      query: this.state.query,
      setQuery: function (v) { self.setState({ query: v && v.target ? v.target.value : v }); },
      options: options,
      noMatch: options.length === 0,
      toggle: p.onToggle || function () {}
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div className="ntv-root" style={{ display: "flex", flexDirection: "column", width: "100%", boxSizing: "border-box", overflow: "hidden", border: `1px solid ${s(v.borderColor)}`, borderRadius: "var(--radius-md)", background: "var(--bg-surface)", fontFamily: "var(--font-sans)", color: "var(--fg-primary)" }}>
      <button type="button" className="zone-item__head" aria-expanded={v.expanded} onClick={v.toggle} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "16px", border: "0", background: "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}>
        <span aria-hidden="true" style={{ flex: "none", width: "40px", height: "40px", boxSizing: "border-box", borderRadius: "var(--radius-sm)", border: "1px solid var(--state-outline)", background: "#8ba7e9" }} />
        <span style={{ flex: "1 1 auto", minWidth: "0", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "14px", lineHeight: "20px", fontWeight: "600" }}>{v.label}</span>
          <span style={{ fontSize: "12px", lineHeight: "20px", color: `${s(v.subColor)}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.sub}</span>
        </span>
        <span style={{ flex: "none", display: "inline-flex", color: `${s(v.iconColor)}` }}><NTV.Icon name={v.iconName} size={v.iconSize} title={v.iconTitle} /></span>
      </button>
      {v.expanded ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "0 16px 16px" }}>
          <NTV.Input size="l" placeholder="Search Playlists..." iconRight="magnifying-glass" label={`Search playlists for ${s(v.label)}`} value={v.query} onChange={v.setQuery} />
          <div role="listbox" aria-label={`Playlists for ${s(v.label)}`} style={{ maxHeight: "248px", overflowY: "auto", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", padding: "4px 0" }}>
            {(v.options || []).map((_o, $index) => (
              <React.Fragment key={$index}>
                <button type="button" role="option" className="zone-item__opt" aria-selected={_o?.current} onClick={_o?.pick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", width: "100%", minHeight: "40px", padding: "8px 12px", border: "0", background: `${s(_o?.bg)}`, textAlign: "left", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", lineHeight: "20px", color: `${s(_o?.color)}`, fontWeight: `${s(_o?.weight)}` }}>
                  <span>{_o?.name}</span>
                  {_o?.current ? (
                    <>
                      <NTV.Icon name="check" size={v.checkSize} title="Assigned" />
                    </>
                  ) : null}
                </button>
              </React.Fragment>
            ))}
            {v.noMatch ? (
              <>
                <p style={{ margin: "0", padding: "8px 12px", fontSize: "14px", lineHeight: "20px", color: "var(--fg-secondary)" }}>No playlists found</p>
              </>
            ) : null}
          </div>
        </div>
        </>
      ) : null}
    </div>
    </>
));

export default Component;
