// @ts-nocheck
/**
 * Form pieces for the Media Library modals (from the screen recording):
 *  - PickField:        label + DS select; a filled value shows a red ✕ that clears it.
 *  - PlaylistPicker:   "Assign Playlist" multi-select dropdown (checkboxes) + "Selected Playlist(s)" chips box.
 *  - AdProfileForm:    body of "Create Advertiser Profile" (logo upload, name, website, email, social, colors).
 * Styling lives in pages/DealerMedia.css (ml-* classes, scoped to .pg-media).
 */
import React, { useEffect, useRef, useState } from 'react';
import { NTV } from '../ds/ntv360';
import ColorPicker from './ColorPicker';

export function PickField(p) {
  return (
    <div className={'ml-ffield ml-pick' + (p.value ? ' has-value' : '')}>
      <span>{p.label}</span>
      <div className="ml-pick-wrap">
        <NTV.Select size="l" placeholder={p.placeholder} options={p.options} value={p.value} onChange={p.onChange} disabled={p.disabled} />
        {p.value && !p.disabled ? (
          <button type="button" className="ml-pick-x" aria-label={'Clear ' + p.label} onClick={function () { p.onChange(''); }}><NTV.Icon name="x" size={12} /></button>
        ) : null}
      </div>
    </div>
  );
}

/* Closes a popover on outside click / Escape. */
function useDismiss(open, setOpen, ref) {
  useEffect(function () {
    if (!open) return;
    var onDoc = function (e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    var onKey = function (e) { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey, true);
    return function () { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey, true); };
  }, [open]);
}

/* options: [{ id, name }], selected: { [id]: true }, onToggle(id) */
export function PlaylistPicker(p) {
  var [open, setOpen] = useState(false);
  var ref = useRef(null);
  useDismiss(open, setOpen, ref);
  var picked = p.options.filter(function (o) { return p.selected[o.id]; });
  return (
    <div className="ml-ffields">
      <div className="ml-ffield">
        <span>Assign Playlist</span>
        <div className={'ml-msel' + (open ? ' is-open' : '')} ref={ref}>
          <button type="button" className="ml-msel-trigger" aria-haspopup="listbox" aria-expanded={open} onClick={function () { setOpen(!open); }}>
            <span>{picked.length ? picked.length + ' playlist/s selected' : 'Select Playlist(s)'}</span>
            <NTV.Icon name={open ? 'angle-up' : 'angle-down'} size={14} />
          </button>
          {open ? (
            <div className="ml-msel-menu" role="listbox" aria-multiselectable="true">
              {p.options.map(function (o) {
                return <div key={o.id} className="ml-msel-opt" role="option" aria-selected={!!p.selected[o.id]}><NTV.Checkbox checked={!!p.selected[o.id]} label={o.name} onChange={function () { p.onToggle(o.id); }} /></div>;
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="ml-ffield">
        <span>Selected Playlist(s)</span>
        <div className="ml-plbox">
          {picked.length ? (
            <div className="ml-plchips">
              {picked.map(function (o) {
                return <span key={o.id} className="ml-plchip">{o.name}<button type="button" aria-label={'Remove ' + o.name} onClick={function () { p.onToggle(o.id); }}><NTV.Icon name="x" size={8} /></button></span>;
              })}
            </div>
          ) : (
            <div className="ml-plempty">
              <NTV.Icon name="play" size={14} />
              <strong>No Playlist selected yet</strong>
              <span>Choose playlist from the list on the above.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* v: { logo, logoName, name, website, email, social, colors: [hex] }, set(patch) */
export function AdProfileForm(p) {
  var v = p.v, set = p.set;
  var fileRef = useRef(null);
  var [picking, setPicking] = useState(false);
  var pickLogo = function (e) {
    var f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    if (!/\.(png|jpe?g|mp4|webm)$/i.test(f.name)) { set({ logoErr: f.name + ' isn’t a supported format.' }); return; }
    set({ logo: URL.createObjectURL(f), logoName: f.name, logoVideo: /^video\//.test(f.type), logoErr: '' });
  };
  var field = function (key, label, ph, opt) {
    return (
      <div className="ml-ffield">
        <label htmlFor={'adp-' + key}>{label}{opt ? <em> (Optional)</em> : null}</label>
        <input id={'adp-' + key} className="dv-field" placeholder={ph} value={v[key]} onChange={function (e) { var o = {}; o[key] = e.target.value; set(o); }} />
      </div>
    );
  };
  return (
    <div className="ml-ffields">
      {v.logo ? (
        <div className="ml-logo has-file">
          {v.logoVideo ? <video src={v.logo} muted autoPlay loop playsInline /> : <img src={v.logo} alt="" />}
          <span className="ml-logo-name">{v.logoName}</span>
          <button type="button" className="ml-logo-x" aria-label="Remove logo" onClick={function () { set({ logo: '', logoName: '' }); }}><NTV.Icon name="x" size={8} /></button>
        </div>
      ) : (
        <button type="button" className="ml-logo" onClick={function () { fileRef.current && fileRef.current.click(); }}>
          <span className="ml-logo-icon"><NTV.Icon name="arrow-up-from-bracket" size={14} /></span>
          <strong>Upload Logo</strong>
          <span>Supported Format: PNG, JPEG, JPG, MP4, WEBM</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept=".png,.jpeg,.jpg,.mp4,.webm" hidden onChange={pickLogo} />
      {v.logoErr ? <div className="ml-ferr"><NTV.Icon name="circle-exclamation" size={14} /><span>{v.logoErr}</span></div> : null}
      {field('name', 'Advertiser Name', 'e.g Acme Media Group')}
      <div className="ml-frow">
        {field('website', 'Website', 'https://')}
        {field('email', 'Email Address', 'e.g Contact@gmail.com')}
      </div>
      {field('social', 'Social Media', 'e.g Contact@gmail.com', true)}
      <div className="ml-ffield">
        <div className="ml-color-head">
          <span>Color Branding<em> (Optional)</em></span>
          <button type="button" className="ml-addcolor" aria-haspopup="dialog" onClick={function () { setPicking(true); }}><NTV.Icon name="plus" size={8} />Add Color</button>
        </div>
        {picking ? (
          <ColorPicker value={v.colors[v.colors.length - 1]} onClose={function () { setPicking(false); }}
            onAdd={function (c) { setPicking(false); if (v.colors.indexOf(c) === -1) set({ colors: v.colors.concat([c]) }); }} />
        ) : null}
        <div className="ml-colors">
          {v.colors.length ? v.colors.map(function (c) {
            return (
              <span key={c} className="ml-swatch">
                <span className="ml-swatch-chip" style={{ background: c }} />
                <span className="ml-swatch-hex">{c.slice(0, 7).toUpperCase()}{c.length > 7 ? ' · ' + Math.round(parseInt(c.slice(7, 9), 16) / 2.55) + '%' : ''}</span>
                <button type="button" aria-label={'Remove color ' + c} onClick={function () { set({ colors: v.colors.filter(function (x) { return x !== c; }) }); }}><NTV.Icon name="x" size={6} /></button>
              </span>
            );
          }) : <span className="ml-colors-empty">No brand colors yet. Use “Add Color”.</span>}
        </div>
      </div>
    </div>
  );
}
