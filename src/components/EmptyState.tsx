// @ts-nocheck
/**
 * Component: EmptyState
 * Mirrors NTV360 Design System › EmptyState (Claude design system artifact "NTV360 Design System",
 * components/EmptyState). The app's bundled design-system build (src/ds/ntv360) is older and doesn't ship
 * EmptyState or the empty-* icons yet, so this is a faithful local copy — swap it for NTV.EmptyState once
 * the bundle is updated.
 *
 * Props (same as the design system):
 *  - size:     'large' | 'small'      large (Large-Med) for full-width sections, small for cards and side panels
 *  - type:     'excel' | 'media' | 'host' | 'playlist' | 'time'   picks the file icon
 *  - solid:    boolean                solid icon
 *  - title:    string                 what to do, e.g. "Select Dealers to get started"
 *  - message:  string | false         what will happen
 *  - children: optional action buttons
 *  - className / style
 */
import React from 'react';
import ICONS from './emptyStateIcons.json';
import './EmptyState.css';

export default function EmptyState(p) {
  var size = p.size === 'small' ? 'small' : 'large';
  var base = 'empty-' + (p.type || 'excel');
  var name = p.solid ? base + '-solid' : base;
  var icon = ICONS[name] || ICONS['empty-excel'];
  var px = size === 'small' ? 32 : 36;
  return (
    <div className={'ntvx-empty ntvx-empty--' + size + (p.className ? ' ' + p.className : '')} role="status" style={p.style}>
      <div className="ntvx-empty__info">
        <svg className="ntvx-empty__icon" width={px} height={px} viewBox={'0 0 ' + icon[0]} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon[1] }} />
        <div className="ntvx-empty__text">
          <div className="ntvx-empty__title">{p.title || 'Select Date Range to view reports'}</div>
          {p.message !== false ? <div className="ntvx-empty__message">{p.message || 'Choose start and end dates above to load play activity for this content.'}</div> : null}
        </div>
        {p.children ? <div className="ntvx-empty__actions">{p.children}</div> : null}
      </div>
    </div>
  );
}
