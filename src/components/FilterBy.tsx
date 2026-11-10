// @ts-nocheck
/**
 * Component: FilterBy
 * Secondary "Filter by" button that opens a panel of collapsible checkbox groups
 * (accordion sections with a – / + toggle), matching the NTV360 Filter By pattern.
 *
 * Props
 *  - groups:   [{ key: 'status', title: 'Status', options: ['Active', 'Inactive'] }]
 *  - value:    { status: ['Active'] }   (selected options per group key)
 *  - onChange: (nextValue) => void
 *  - align:    'left' | 'right'          (which edge the panel lines up with)
 */
import React, { useEffect, useRef, useState } from 'react';
import { NTV } from '../ds/ntv360';
import './FilterBy.css';

export function filterCount(value) {
  return Object.keys(value || {}).reduce(function (n, k) { return n + ((value[k] || []).length); }, 0);
}
/** true when `item` passes group `key` (an empty group means "no filter"). */
export function passes(value, key, itemValue) {
  var sel = (value || {})[key] || [];
  return !sel.length || sel.indexOf(itemValue) !== -1;
}

export default function FilterBy(p) {
  var [open, setOpen] = useState(false);
  var [closed, setClosed] = useState({});
  var ref = useRef(null);
  var value = p.value || {};
  var n = filterCount(value);

  useEffect(function () {
    if (!open) return;
    var onDoc = function (e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    var onKey = function (e) { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  var toggle = function (key, opt) {
    var cur = (value[key] || []).slice(), i = cur.indexOf(opt);
    if (i === -1) cur.push(opt); else cur.splice(i, 1);
    var next = Object.assign({}, value); next[key] = cur;
    p.onChange && p.onChange(next);
  };

  return (
    <div className={'fb' + (p.align === 'right' ? ' fb--right' : '')} ref={ref}>
      <NTV.Button variant="secondary" size="xl" iconLeft="filter" className={open || n ? 'is-open' : ''} onClick={function () { setOpen(!open); }}>
        {(p.label || 'Filter by') + (n ? ' (' + n + ')' : '')}
      </NTV.Button>
      {open ? (
        <div className="fb__panel" role="dialog" aria-label="Filters">
          {(p.groups || []).map(function (g) {
            var isClosed = !!closed[g.key];
            return (
              <div key={g.key} className="fb__group">
                <button type="button" className="fb__head" aria-expanded={!isClosed}
                  onClick={function () { var c = Object.assign({}, closed); c[g.key] = !isClosed; setClosed(c); }}>
                  <span>{g.title}</span>
                  <NTV.Icon name={isClosed ? 'plus' : 'minus'} size={12} />
                </button>
                {!isClosed ? (
                  <div className="fb__opts">
                    {g.options.map(function (o) {
                      return <NTV.Checkbox key={o} label={o} checked={(value[g.key] || []).indexOf(o) !== -1} onChange={function () { toggle(g.key, o); }} />;
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
          {n ? <button type="button" className="fb__clear" onClick={function () { p.onChange && p.onChange({}); }}>Clear all</button> : null}
        </div>
      ) : null}
    </div>
  );
}
