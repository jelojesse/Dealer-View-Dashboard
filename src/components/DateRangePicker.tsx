// @ts-nocheck
/**
 * Component: DateRangePicker
 * A range trigger (NTV360 DateField look) that opens two month calendars side by side.
 * Built on the DS calendar classes (ntv-calendar / ntv-day with is-start / is-mid / is-end / is-picked),
 * with clickable days — NTV.Calendar itself is display-only and single-month.
 *
 * Props
 *  - value:    { start: Date, end: Date }
 *  - onChange: ({ start, end }) => void   (called on Apply)
 *  - align:    'left' | 'right'           (which edge the panel lines up with)
 *  - today:    Date                        (optional, highlights today)
 *  - compact:  boolean                     (single-month dropdown that applies on the 2nd click;
 *                                            used everywhere a start–end range is picked)
 *  - block:    boolean                     (compact only: trigger and panel fill the container width)
 */
import React, { useEffect, useRef, useState } from 'react';
import { NTV } from '../ds/ntv360';
import './DateRangePicker.css';

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dayNum(d) { return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : null; }
export function fmtDate(d) { return d ? SHORT[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() : ''; }
export function fmtRange(r) { return r && r.start ? fmtDate(r.start) + ' – ' + fmtDate(r.end || r.start) : 'Select date range'; }

function Month(p) {
  var y = p.year, m = p.month;
  var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  var s = dayNum(p.start), e = dayNum(p.end || p.start), t = dayNum(p.today);
  var cells = [];
  for (var i = 0; i < 42; i++) {
    var d = i - first + 1;
    if (d < 1 || d > days) {
      // Compact variant shows the neighbouring months' days, faded; the classic one leaves them blank.
      cells.push(p.showOther
        ? <span key={i} className="ntv-day is-other drp__other" aria-hidden="true"><span className="ntv-day__num">{new Date(y, m, d).getDate()}</span></span>
        : <span key={i} className="ntv-day is-other drp__blank" />);
      continue;
    }
    var n = new Date(y, m, d).getTime();
    var inR = s != null && n >= s && n <= e, isS = n === s, isE = n === e;
    var band = inR && s !== e ? (isS ? 'is-start' : isE ? 'is-end' : 'is-mid') : '';
    var dow = i % 7;
    var cls = ['ntv-day', 'drp__day', (dow === 0 || dow === 6) && 'is-weekend', n === t && 'is-today', band, (isS || isE) && 'is-picked'].filter(Boolean).join(' ');
    cells.push(
      <button key={i} type="button" className={cls} aria-pressed={isS || isE} aria-label={MONTHS[m] + ' ' + d + ', ' + y}
        onClick={(function (dd) { return function () { p.onPick(new Date(y, m, dd)); }; })(d)}>
        <span className="ntv-day__num">{d}</span>
      </button>
    );
  }
  return (
    <div className="drp__month">
      <div className="ntv-calendar__head">
        {p.onPrev ? <button type="button" className="ntv-iconlink" aria-label="Previous month" onClick={p.onPrev}><NTV.Icon name="angle-right" size={14} style={{ transform: 'rotate(180deg)' }} /></button> : <span className="drp__spacer" />}
        <strong>{MONTHS[m] + ' ' + y}</strong>
        {p.onNext ? <button type="button" className="ntv-iconlink" aria-label="Next month" onClick={p.onNext}><NTV.Icon name="angle-right" size={14} /></button> : <span className="drp__spacer" />}
      </div>
      <div className="ntv-calendar__grid">
        {['S', 'M', 'T', 'W', 'TH', 'F', 'S'].map(function (n, i) { return <span key={'h' + i} className="ntv-calendar__dow">{n}</span>; })}
        {cells}
      </div>
    </div>
  );
}

export default function DateRangePicker(p) {
  var value = p.value || {};
  var [open, setOpen] = useState(false);
  var [draft, setDraft] = useState({ start: value.start, end: value.end });
  var [view, setView] = useState(function () { var b = value.start || new Date(); return { y: b.getFullYear(), m: b.getMonth() }; });
  var ref = useRef(null);

  useEffect(function () {
    if (!open) return;
    var onDoc = function (e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    var onKey = function (e) { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  var toggle = function () {
    if (!open) {
      setDraft({ start: value.start, end: value.end });
      var b = value.start || new Date(); setView({ y: b.getFullYear(), m: b.getMonth() });
    }
    setOpen(!open);
  };
  var shift = function (k) { return function () { var d = new Date(view.y, view.m + k, 1); setView({ y: d.getFullYear(), m: d.getMonth() }); }; };
  var pick = function (d) {
    // First click (or a click after a complete range) starts a new range; second click ends it.
    if (!draft.start || draft.end) { setDraft({ start: d, end: null }); return; }
    if (dayNum(d) < dayNum(draft.start)) setDraft({ start: d, end: draft.start });
    else setDraft({ start: draft.start, end: d });
  };
  var apply = function () {
    if (!draft.start) return;
    p.onChange && p.onChange({ start: draft.start, end: draft.end || draft.start });
    setOpen(false);
  };
  var next = new Date(view.y, view.m + 1, 1);

  /* Compact variant (Playlist Reports): one month, ‹ Month Year › header, neighbouring days faded,
     no footer — the second click completes the range, applies it and closes. */
  if (p.compact) {
    var pickC = function (d) {
      if (!draft.start || draft.end) { setDraft({ start: d, end: null }); return; }
      var r = dayNum(d) < dayNum(draft.start) ? { start: d, end: draft.start } : { start: draft.start, end: d };
      setDraft(r);
      p.onChange && p.onChange(r);
      setTimeout(function () { setOpen(false); }, 180);
    };
    return (
      <div className={'drp drp--compact' + (p.align === 'right' ? ' drp--right' : '') + (p.block ? ' drp--block' : '')} ref={ref}>
        <button type="button" className={'drp__trigger' + (open ? ' is-open' : '') + (value.start ? ' has-value' : '')} aria-haspopup="dialog" aria-expanded={open} onClick={toggle}>
          <span>{value.start ? fmtRange(value) : 'Start Date - End Date'}</span>
          <NTV.Icon name={open ? 'angle-up' : 'angle-down'} size={14} />
        </button>
        {open ? (
          <div className="drp__panel" role="dialog" aria-label="Choose date range">
            <Month year={view.y} month={view.m} start={draft.start} end={draft.end} today={p.today} onPick={pickC} onPrev={shift(-1)} onNext={shift(1)} showOther />
            <p className="drp__hint" aria-live="polite">{draft.start && !draft.end ? 'Select an end date' : 'Select a start date'}</p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={'drp' + (p.align === 'right' ? ' drp--right' : '')} ref={ref}>
      <button type="button" className={'drp__trigger' + (open ? ' is-open' : '')} aria-haspopup="dialog" aria-expanded={open} onClick={toggle}>
        <NTV.Icon name="calendar" size={14} />
        <span>{fmtRange(value)}</span>
        <NTV.Icon name={open ? 'angle-up' : 'angle-down'} size={14} />
      </button>
      {open ? (
        <div className="drp__panel" role="dialog" aria-label="Choose date range">
          <div className="drp__months">
            <Month year={view.y} month={view.m} start={draft.start} end={draft.end} today={p.today} onPick={pick} onPrev={shift(-1)} />
            <Month year={next.getFullYear()} month={next.getMonth()} start={draft.start} end={draft.end} today={p.today} onPick={pick} onNext={shift(1)} />
          </div>
          <div className="drp__foot">
            <span className="drp__sum">
              <span><b>Start:</b> {draft.start ? fmtDate(draft.start) : '—'}</span>
              <span><b>End:</b> {draft.end ? fmtDate(draft.end) : '—'}</span>
            </span>
            <span className="drp__btns">
              <NTV.Button variant="secondary" tone="neutral" size="m" onClick={function () { setOpen(false); }}>Cancel</NTV.Button>
              <NTV.Button variant="primary" size="m" disabled={!draft.start} onClick={apply}>Apply</NTV.Button>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
