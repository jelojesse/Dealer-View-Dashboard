// @ts-nocheck
/**
 * Toast confirmation used on every page. Sits top-right just under the nav bar, over the top
 * of the page (KPI cards / page header). Tinted by kind (success, info, warning, error),
 * with a title, optional subtitle and a close button.
 *   <Toast t={v.toast} />   where v.toast = toastVals(state.toast, this)  (lib/shared.js)
 * If a page doesn't pass `this` to toastVals, the close button hides the toast locally.
 */
import React, { useEffect, useState } from 'react';
import { NTV } from '../ds/ntv360';
import './Toast.css';

export default function Toast(p) {
  var t = p.t || {};
  var [hidden, setHidden] = useState(false);
  useEffect(function () { setHidden(false); }, [t.id, t.text]);
  if (!t.show || hidden) return null;
  var close = function () { if (t.close) t.close(); else setHidden(true); };
  return (
    <div className={'dv-toast2 dv-toast2--' + (t.kind || 'success')} role="status" aria-live="polite">
      <NTV.Icon name={t.icon || 'circle-check'} size={18} />
      <div className="dv-toast2-body">
        <p className="dv-toast2-title">{t.text}</p>
        {t.sub ? <p className="dv-toast2-sub">{t.sub}</p> : null}
      </div>
      <button type="button" className="dv-toast2-x" aria-label="Dismiss" onClick={close}><NTV.Icon name="x" size={12} /></button>
    </div>
  );
}
