// @ts-nocheck
/**
 * Color Picker pop-up (Create Advertiser Profile → Add Color), from the recording/screenshot:
 * saturation/brightness square, hue bar, opacity bar, eyedropper, hex field + opacity %, Cancel / Add.
 * Props: value ('#RRGGBB' or '#RRGGBBAA', optional), onAdd(hex), onClose()
 * onAdd gets '#RRGGBB' at 100% opacity, '#RRGGBBAA' otherwise.
 */
import React, { useEffect, useRef, useState } from 'react';
import { NTV } from '../ds/ntv360';
import './ColorPicker.css';

function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
function hsvToRgb(h, s, v) {
  var f = function (n) { var k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
  if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return [h, mx ? d / mx : 0, mx];
}
function hex2(n) { return ('0' + n.toString(16)).slice(-2).toUpperCase(); }
function parseHex(str) {
  var m = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec((str || '').trim());
  if (!m) return null;
  var n = parseInt(m[1], 16);
  return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], a: m[2] ? parseInt(m[2], 16) / 255 : null };
}

/* Drag helper: calls fn(xRatio, yRatio) on pointer down/move inside `el`. */
function useDrag(fn) {
  var ref = useRef(null);
  var onDown = function (e) {
    var el = ref.current; if (!el) return;
    e.preventDefault();
    var move = function (ev) { var r = el.getBoundingClientRect(); fn(clamp((ev.clientX - r.left) / r.width, 0, 1), clamp((ev.clientY - r.top) / r.height, 0, 1)); };
    var up = function () { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    move(e);
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };
  return [ref, onDown];
}

export default function ColorPicker(p) {
  var start = parseHex(p.value) || { rgb: [255, 0, 0], a: 1 };
  var hsv0 = rgbToHsv(start.rgb[0], start.rgb[1], start.rgb[2]);
  var [h, setH] = useState(hsv0[0]), [sv, setSv] = useState([hsv0[1], hsv0[2]]), [a, setA] = useState(start.a == null ? 1 : start.a);
  var rgb = hsvToRgb(h, sv[0], sv[1]);
  var hex = hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
  var [hexIn, setHexIn] = useState(hex), [aIn, setAIn] = useState(String(Math.round(a * 100)));
  var editingHex = useRef(false), editingA = useRef(false);
  useEffect(function () { if (!editingHex.current) setHexIn(hex); }, [hex]);
  useEffect(function () { if (!editingA.current) setAIn(String(Math.round(a * 100))); }, [a]);
  useEffect(function () {
    var onKey = function (e) { if (e.key === 'Escape') { e.stopPropagation(); p.onClose(); } };
    document.addEventListener('keydown', onKey, true);
    return function () { document.removeEventListener('keydown', onKey, true); };
  }, []);

  var [svRef, svDown] = useDrag(function (x, y) { setSv([x, 1 - y]); });
  var [hueRef, hueDown] = useDrag(function (x) { setH(x * 360); });
  var [aRef, aDown] = useDrag(function (x) { setA(Math.round(x * 100) / 100); });

  var applyHex = function (str) {
    var c = parseHex(str); if (!c) return false;
    var v = rgbToHsv(c.rgb[0], c.rgb[1], c.rgb[2]);
    if (v[1] > 0) setH(v[0]);
    setSv([v[1], v[2]]);
    if (c.a != null) setA(c.a);
    return true;
  };
  var canDrop = typeof window !== 'undefined' && 'EyeDropper' in window;
  var eyedrop = function () {
    if (!canDrop) return;
    new window.EyeDropper().open().then(function (r) { applyHex(r.sRGBHex); }).catch(function () {});
  };
  var out = '#' + hex + (a < 1 ? hex2(Math.round(a * 255)) : '');
  var hueColor = 'hsl(' + h + ',100%,50%)';
  var solid = 'rgb(' + rgb.join(',') + ')';

  return (
    <div className="cp-ov" onMouseDown={function (e) { if (e.target === e.currentTarget) p.onClose(); }}>
      <div className="cp" role="dialog" aria-label="Color Picker">
        <div className="cp-head">
          <strong>Color Picker</strong>
          <button type="button" className="cp-x" aria-label="Close color picker" onClick={p.onClose}><NTV.Icon name="x" size={12} /></button>
        </div>
        <div className="cp-sv" ref={svRef} onPointerDown={svDown} style={{ background: hueColor }} role="slider" aria-label="Saturation and brightness" aria-valuetext={'#' + hex}>
          <div className="cp-sv-w" /><div className="cp-sv-b" />
          <span className="cp-knob" style={{ left: (sv[0] * 100) + '%', top: ((1 - sv[1]) * 100) + '%', background: solid }} />
        </div>
        <div className="cp-bar cp-hue" ref={hueRef} onPointerDown={hueDown} role="slider" aria-label="Hue" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(h)}>
          <span className="cp-knob" style={{ left: (h / 360 * 100) + '%', background: hueColor }} />
        </div>
        <div className="cp-bar cp-alpha" ref={aRef} onPointerDown={aDown} role="slider" aria-label="Opacity" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(a * 100)}>
          <span className="cp-alpha-fill" style={{ background: 'linear-gradient(90deg, rgba(' + rgb.join(',') + ',0), ' + solid + ')' }} />
          <span className="cp-knob" style={{ left: (a * 100) + '%', background: solid }} />
        </div>
        <div className="cp-fields">
          <button type="button" className="cp-drop" aria-label="Pick a color from the screen" title={canDrop ? 'Pick a color from the screen' : 'Eyedropper isn’t supported in this browser'} disabled={!canDrop} onClick={eyedrop}><NTV.Icon name="eye-dropper" size={14} /></button>
          <input className="cp-hex" aria-label="Hex color" value={hexIn} maxLength={9}
            onFocus={function () { editingHex.current = true; }}
            onChange={function (e) { var v = e.target.value.replace(/[^0-9a-f#]/gi, '').toUpperCase(); setHexIn(v); applyHex(v); }}
            onBlur={function () { editingHex.current = false; setHexIn(hex); }} />
          <span className="cp-pct">
            <input aria-label="Opacity percent" value={aIn} maxLength={3}
              onFocus={function () { editingA.current = true; }}
              onChange={function (e) { var v = e.target.value.replace(/\D/g, ''); setAIn(v); if (v !== '') setA(clamp(parseInt(v, 10), 0, 100) / 100); }}
              onBlur={function () { editingA.current = false; setAIn(String(Math.round(a * 100))); }} />
            <span>%</span>
          </span>
        </div>
        <div className="cp-foot">
          <NTV.Button variant="primary" tone="neutral" size="m" onClick={p.onClose}>Cancel</NTV.Button>
          <NTV.Button variant="primary" size="m" onClick={function () { p.onAdd(out); }}>Add</NTV.Button>
        </div>
      </div>
    </div>
  );
}
