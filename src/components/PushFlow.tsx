// @ts-nocheck
/**
 * Component: PushFlow
 * Converted from the Claude Design artboard PushFlow.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import './PushFlow.css';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { phase: 'confirm', i: 0, list: [], retry: false, failed: [], failTotal: 0, wasOpen: false }; }
  componentDidUpdate(prev) { if (this.props.open && !prev.open) this.setState({ phase: 'confirm', i: 0, failed: [] }); }
  componentWillUnmount() { if (this._t) clearTimeout(this._t); }
  run(list, retry) {
    var self = this;
    if (this._t) clearTimeout(this._t);
    if (!list.length) { this.setState({ phase: 'done', list: [] }); return; }
    this.setState({ phase: 'pushing', i: 0, list: list, retry: retry });
    var tick = function () {
      self._t = setTimeout(function () {
        if (self.state.phase !== 'pushing') return;
        if (self.state.i + 1 < self.state.list.length) { self.setState({ i: self.state.i + 1 }); tick(); return; }
        var failed = self.state.retry ? [] : self.state.list.filter(function (t) { return t.willFail; });
        if (failed.length) self.setState({ phase: 'failed', failed: failed, failTotal: self.state.list.length });
        else self.setState({ phase: 'done' });
      }, 500);
    };
    tick();
  }
  renderVals() {
    var self = this, s = this.state, p = this.props;
    var targets = p.targets || [];
    var subject = p.subject ?? 'screen';
    var close = function () { if (self._t) clearTimeout(self._t); (p.onClose || function () {})(); };
    var cur = s.list[s.i];
    return {
      visible: !!(p.open ?? false), none: null, yes: true, w: 460,
      s: { confirm: s.phase === 'confirm', pushing: s.phase === 'pushing', failed: s.phase === 'failed', done: s.phase === 'done' },
      confirmTitle: subject === 'playlist' ? 'Push Playlist Updates?' : (subject === 'host' ? 'Push Updates?' : 'Save Screen Changes?'),
      confirmText: 'This will push the changes to ' + targets.length + ' connected license(s) right away.',
      cancel: close,
      start: function () { self.run(targets, false); },
      total: s.list.length, step: s.i + 1, current: cur ? cur.alias : '',
      pct: s.list.length ? Math.round(((s.i + 1) / s.list.length) * 100) : 0,
      failed: s.failed, failCount: s.failed.length, failTotal: s.failTotal, okCount: s.failTotal - s.failed.length,
      failTitle: s.failed.length + (s.failed.length === 1 ? ' License Failed to Update' : ' Licenses Failed to Update'),
      retry: function () { self.run(s.failed.map(function (f) { return { alias: f.alias, willFail: false }; }), true); },
      finishPartial: function () { (p.onDone || function () {})(); close(); },
      doneTitle: subject === 'playlist' ? 'Playlist Updated' : (subject === 'host' ? 'Updates Pushed' : 'Screen Updated'),
      doneText: 'Updates have been pushed to ' + targets.length + ' connected license(s).',
      finish: function () { (p.onDone || function () {})(); close(); }
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    {v.visible ? (
      <>
        <div className="ntv-root" style={{ position: "fixed", inset: "0", zIndex: "200", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(9, 22, 53, 0.45)", fontFamily: "var(--font-sans)" }}>
        {v.s?.confirm ? (
          <>
            <NTV.StatusModal status="warning" title={v.confirmTitle} width={v.w}>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "24px", color: "var(--fg-secondary)", textAlign: "center" }}>{v.confirmText}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.cancel}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.start}>Proceed</NTV.Button>
            </div>
          </NTV.StatusModal>
          </>
        ) : null}
        {v.s?.pushing ? (
          <>
            <div role="dialog" aria-modal="true" aria-label="Pushing Updates" aria-live="polite" style={{ width: "460px", maxWidth: "100%", boxSizing: "border-box", padding: "32px 28px", borderRadius: "var(--radius-lg)", background: "var(--bg-surface)", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center", color: "var(--fg-primary)" }}>
            <h2 style={{ margin: "0", fontSize: "24px", lineHeight: "38px", fontWeight: "600" }}>Pushing Updates</h2>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "24px", color: "var(--fg-secondary)" }}>{"Please wait while the updates are being pushed to "}{v.total}{" license(s)."}</p>
            <div style={{ width: "100%" }}><NTV.ProgressBar value={v.pct} showLabel={v.yes} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", lineHeight: "20px", color: "var(--fg-secondary)" }}>
              <span className="pf-spinner" aria-hidden="true" />
              <span>{v.current}{" ("}{v.step}{" of "}{v.total})</span>
            </div>
          </div>
          </>
        ) : null}
        {v.s?.failed ? (
          <>
            <NTV.StatusModal status="error" title={v.failTitle} width={v.w}>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "24px", color: "var(--fg-secondary)", textAlign: "center" }}>
              {"Your changes have been pushed to "}{v.okCount}{" of "}{v.failTotal}{" licenses. However, "}{v.failCount}{" license(s) failed to update."}
            </p>
            <ul style={{ listStyle: "none", margin: "16px 0 0", padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--info-050)", display: "flex", flexDirection: "column", gap: "6px", textAlign: "center" }}>
              {(v.failed || []).map((_f, $index) => (
                <React.Fragment key={$index}>
                  <li style={{ fontSize: "12px", lineHeight: "20px", fontWeight: "600", color: "var(--info-600)" }}>{_f?.alias}</li>
                </React.Fragment>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
              <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={v.none} onClick={v.finishPartial}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.retry}>Try Again</NTV.Button>
            </div>
          </NTV.StatusModal>
          </>
        ) : null}
        {v.s?.done ? (
          <>
            <NTV.StatusModal status="success" title={v.doneTitle} width={v.w}>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "24px", color: "var(--fg-secondary)", textAlign: "center" }}>{v.doneText}</p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <NTV.Button variant="primary" size="xl" iconRight={v.none} onClick={v.finish} style={{ minWidth: "100px" }}>Ok</NTV.Button>
            </div>
          </NTV.StatusModal>
          </>
        ) : null}
      </div>
      </>
    ) : null}
    </>
));

export default Component;
