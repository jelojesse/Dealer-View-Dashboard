// @ts-nocheck
/**
 * Component: ContentThumb
 * Converted from the Claude Design artboard ContentThumb.dc.html.
 *
 * Props (all optional, existing callers keep working unchanged)
 *  - image, kind ('image'|'video'|'widget'|'channel'), title, duration, inBlock
 *  - video:      URL of the video file; plays muted/looped while hovered (poster = image)
 *  - onView:     () => void   adds "View Details" to the hover ⋯ menu
 *  - viewHref:   design file the View Details item links to (e.g. 'DealerMediaDetail.dc.html'),
 *                pair with viewNav (a navFn().nav string) for the hand-off
 *  - onRemove:   () => void   adds "Remove" to the hover ⋯ menu
 *  - selectable, checked, onSelect(checked)  shows a checkbox top-left on hover
 * Without onView / onRemove / selectable the thumb looks exactly like before (no hover UI).
 *
 * Also exports the hover building blocks the Media Library cards reuse:
 *  - useReducedMotion(), HoverVideo, ThumbMenu
 */
import React, { useEffect, useRef, useState } from 'react';
import { NTV } from '../ds/ntv360';
import './ContentThumb.css';

/* ---------------------------- shared hover parts ---------------------------- */

export function useReducedMotion() {
  var q = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var [rm, setRm] = useState(q ? q.matches : false);
  useEffect(function () {
    if (!q) return;
    var on = function (e) { setRm(e.matches); };
    q.addEventListener ? q.addEventListener('change', on) : q.addListener(on);
    return function () { q.removeEventListener ? q.removeEventListener('change', on) : q.removeListener(on); };
  }, []);
  return rm;
}

/** Poster image, plus (for video items with a `video` URL) a muted looping video while `active`.
 *  Under prefers-reduced-motion the video never plays; a play icon shows over the poster instead. */
export function HoverVideo(p) {
  var rm = useReducedMotion();
  var ref = useRef(null);
  var [armed, setArmed] = useState(false);
  var canPlay = !!p.video && !rm;
  useEffect(function () { if (p.active && canPlay) setArmed(true); }, [p.active, canPlay]);
  useEffect(function () {
    var el = ref.current; if (!el) return;
    if (p.active) { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); }
    else { el.pause(); try { el.currentTime = 0; } catch (e) {} }
  }, [p.active, armed]);
  var showPlayIcon = p.isVideo && (rm || !p.video);
  return (
    <>
      <img src={p.image} alt="" className="ct-media" draggable={false} />
      {canPlay && armed ? <video ref={ref} className="ct-media ct-video" src={p.video} poster={p.image} muted loop playsInline preload="none" aria-hidden="true" style={{ opacity: p.active ? 1 : 0 }} /> : null}
      {showPlayIcon ? <span className={'ct-play' + (p.active ? ' is-on' : '')} aria-hidden="true"><NTV.Icon name="play" size={12} /></span> : null}
    </>
  );
}

/** 24px round white ⋯ button + small dv-menu. Closes on outside click and Escape.
 *  items: [{ label, icon, onClick, href, nav, danger }] */
export function ThumbMenu(p) {
  var [open, setOpen] = useState(false);
  var ref = useRef(null);
  useEffect(function () {
    if (!open) return;
    var onDoc = function (e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    var onKey = function (e) { if (e.key === 'Escape') { setOpen(false); var b = ref.current && ref.current.querySelector('.ct-more'); if (b) b.focus(); } };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  useEffect(function () { p.onOpenChange && p.onOpenChange(open); }, [open]);
  // Keep menu clicks away from the thumb's parent, except link clicks: those must reach
  // document so App.tsx can turn the design-file href into a route.
  var stop = function (e) { if (!(e.target.closest && e.target.closest('a[href]'))) e.stopPropagation(); };
  return (
    <span ref={ref} className="ct-menuwrap" onClick={stop}>
      <button type="button" className="ct-more" aria-label={p.label || 'More options'} aria-haspopup="menu" aria-expanded={open} onClick={function () { setOpen(!open); }}>
        <NTV.Icon name="ellipsis" size={12} />
      </button>
      {open ? (
        <div className="dv-menu ct-menu" role="menu">
          {(p.items || []).map(function (it, i) {
            var cls = 'dv-mi ct-mi' + (it.danger ? ' dv-danger is-danger' : '');
            var run = function (e) { setOpen(false); it.onClick && it.onClick(e); };
            var body = <><NTV.Icon name={it.icon} size={12} /><span>{it.label}</span></>;
            return it.href
              ? <a key={i} role="menuitem" className={cls} href={it.href} data-nav={it.nav} onClick={run}>{body}</a>
              : <button key={i} type="button" role="menuitem" className={cls} onClick={run}>{body}</button>;
          })}
        </div>
      ) : null}
    </span>
  );
}

/* ------------------------------- ContentThumb ------------------------------- */

var TAGS = {
  image: ['IMAGE', 'var(--info-050)', 'var(--info-600)'],
  video: ['VIDEO', 'var(--danger-050)', 'var(--danger-600)'],
  widget: ['WIDGET', 'var(--teal-050)', 'var(--teal-600)'],
  channel: ['CHANNEL', 'var(--warning-050)', 'var(--warning-600)']
};

export default function ContentThumb(p) {
  var kind = p.kind ?? 'image';
  var inBlock = !!(p.inBlock ?? false);
  var t = TAGS[kind] || TAGS.image;
  var duration = p.duration ?? '';
  var [hover, setHover] = useState(false);
  var [menuOpen, setMenuOpen] = useState(false);
  var items = [];
  if (p.onView || p.viewHref) items.push({ label: 'View Details', icon: 'eye', onClick: p.onView, href: p.viewHref, nav: p.viewNav });
  if (p.onRemove) items.push({ label: 'Remove', icon: 'trash', onClick: p.onRemove, danger: true });
  var interactive = items.length > 0 || !!p.selectable;
  var active = hover || menuOpen;
  var footerBg = kind === 'channel' ? 'var(--warning-main)' : (inBlock ? 'var(--bg-app)' : 'var(--bg-surface)');
  return (
    <div className={'ct-thumb' + (interactive ? ' is-interactive' : '') + (menuOpen ? ' is-menu' : '') + (p.checked ? ' is-checked' : '')}
      onMouseEnter={function () { setHover(true); }} onMouseLeave={function () { setHover(false); }}
      onFocus={function () { setHover(true); }} onBlur={function (e) { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}
      style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: "120px", boxSizing: "border-box", border: `${inBlock ? '0.5px' : '1px'} solid var(--container-border)`, borderRadius: inBlock ? 'var(--radius-md)' : 'var(--radius-lg)', background: "var(--bg-surface)", fontFamily: "var(--font-sans)", color: "var(--fg-primary)", position: "relative" }}>
      <div className="ct-top" style={{ position: "relative", flex: "1 1 0", minHeight: "0", background: "#000", overflow: "hidden", borderRadius: inBlock ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-lg) var(--radius-lg) 0 0' }}>
        <HoverVideo image={p.image ?? 'images/f31035d36ea14a442085349a66032fb9.jpg'} video={p.video} isVideo={kind === 'video'} active={active} />
        <span className="ct-tag" style={{ position: "absolute", left: "9px", top: "8px", display: "inline-flex", alignItems: "center", height: "16px", padding: "0 6px", borderRadius: "10px", background: t[1], color: t[2], fontSize: "10px", lineHeight: "12px", fontWeight: "600", letterSpacing: "0.02em" }}>{t[0]}</span>
        {p.selectable ? <span className="ct-check" onClick={function (e) { e.stopPropagation(); }}><NTV.Checkbox checked={!!p.checked} onChange={p.onSelect} /></span> : null}
      </div>
      {items.length ? <span className="ct-corner"><ThumbMenu items={items} label={'Options for ' + (p.title ?? 'content')} onOpenChange={setMenuOpen} /></span> : null}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", height: inBlock || kind === 'channel' ? '30px' : '36px', flex: "none", boxSizing: "border-box", padding: "0 10px", background: footerBg, borderRadius: inBlock ? '0 0 var(--radius-md) var(--radius-md)' : '0 0 var(--radius-lg) var(--radius-lg)' }}>
        <span style={{ flex: "1 1 auto", minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px", lineHeight: "16px", fontWeight: "600" }}>{p.title ?? 'Steak.jpg'}</span>
        {duration ? <span style={{ flex: "none", fontSize: "10px", lineHeight: "12px" }}>{duration}</span> : null}
      </div>
    </div>
  );
}
