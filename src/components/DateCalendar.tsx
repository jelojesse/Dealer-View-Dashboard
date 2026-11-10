// @ts-nocheck
/**
 * Component: DateCalendar
 * Converted from the Claude Design artboard DateCalendar.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import './DateCalendar.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var v = props.value;
    this.state = { y: v ? v.y : 2026, m: v ? v.m : 10 };
  }
  renderVals() {
    var self = this;
    var names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var y = this.state.y, m = this.state.m;
    var v = this.props.value || null;
    var today = { y: 2026, m: 10, d: 9 };
    var first = new Date(y, m, 1).getDay();
    var count = new Date(y, m + 1, 0).getDate();
    var pick = this.props.onPick || function () {};
    var cells = [];
    for (var i = 0; i < first; i++) cells.push({ blank: true, isDay: false });
    for (var d = 1; d <= count; d++) {
      (function (day) {
        var sel = !!(v && v.y === y && v.m === m && v.d === day);
        var isToday = today.y === y && today.m === m && today.d === day;
        var dow = (first + day - 1) % 7;
        cells.push({
          blank: false, isDay: true, day: day, selected: sel, cls: sel ? '' : 'cal-day',
          aria: names[m] + ' ' + day + ', ' + y + (isToday ? ' (today)' : ''),
          bg: sel ? 'var(--gradient-button)' : 'transparent',
          color: sel ? 'var(--white)' : (isToday ? 'var(--accent-action)' : ((dow === 0 || dow === 6) ? 'var(--fg-secondary)' : 'var(--fg-primary)')),
          weight: sel || isToday ? 700 : 400,
          pick: function () { pick({ y: y, m: m, d: day }); }
        });
      })(d);
    }
    return {
      monthLabel: names[m] + ' ' + y,
      iconSize: 12,
      weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(function (l) { return { label: l }; }),
      cells: cells,
      prev: function () { var nm = self.state.m - 1, ny = self.state.y; if (nm < 0) { nm = 11; ny--; } self.setState({ m: nm, y: ny }); },
      next: function () { var nm = self.state.m + 1, ny = self.state.y; if (nm > 11) { nm = 0; ny++; } self.setState({ m: nm, y: ny }); }
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div className="ntv-root" style={{ width: "100%", maxWidth: "320px", boxSizing: "border-box", padding: "16px", border: "1px solid var(--container-border)", borderRadius: "var(--radius-lg)", background: "var(--bg-surface)", fontFamily: "var(--font-sans)", color: "var(--fg-primary)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <button type="button" aria-label="Previous month" onClick={v.prev} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", padding: "0", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", color: "var(--fg-primary)", cursor: "pointer", transform: "scaleX(-1)" }}><NTV.Icon name="angle-right" size={v.iconSize} /></button>
        <span style={{ fontSize: "16px", lineHeight: "24px", fontWeight: "700" }}>{v.monthLabel}</span>
        <button type="button" aria-label="Next month" onClick={v.next} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", padding: "0", border: "1px solid var(--container-border)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", color: "var(--fg-primary)", cursor: "pointer" }}><NTV.Icon name="angle-right" size={v.iconSize} /></button>
      </div>
      <div role="grid" aria-label={v.monthLabel} style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "4px", textAlign: "center" }}>
        {(v.weekdays || []).map((_w, $index) => (
          <React.Fragment key={$index}>
            <span style={{ fontSize: "12px", lineHeight: "20px", fontWeight: "700", color: "var(--fg-secondary)" }}>{_w?.label}</span>
          </React.Fragment>
        ))}
        {(v.cells || []).map((_c, $index) => (
          <React.Fragment key={$index}>
            {_c?.blank ? (
              <>
                <span />
              </>
            ) : null}
            {_c?.isDay ? (
              <>
                <button type="button" className={_c?.cls} aria-pressed={_c?.selected} aria-label={_c?.aria} onClick={_c?.pick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", margin: "0 auto", padding: "0", border: "0", borderRadius: "var(--radius-full)", background: `${s(_c?.bg)}`, color: `${s(_c?.color)}`, fontFamily: "inherit", fontSize: "14px", lineHeight: "20px", fontWeight: `${s(_c?.weight)}`, cursor: "pointer" }}>{_c?.day}</button>
              </>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
    </>
));

export default Component;
