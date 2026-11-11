// @ts-nocheck
/**
 * Upload Content modal (opened from the folder panel's + tile on Media Library).
 * Matches the recorded prototype:
 *  - Drop zone: drop files or click to browse (PNG, JPEG, JPG, MP4, WEBM only).
 *  - "Selected Files (n)" with a grid / list view toggle.
 *  - Grid cards: type + resolution pills, name, eye (preview). Hover: checkbox, play (videos),
 *    ⋯ menu (Preview / Remove), name turns accent.
 *  - Footer: Cancel + "Select files to upload" (disabled) → "Upload (n) Content".
 * Props: folder (name shown in the subtitle), onClose(), onUpload(files)
 *   files: [{ name, kind: 'image'|'video', image, video, res, size }]
 */
import React, { useEffect, useRef, useState } from 'react';
import { NTV } from '../ds/ntv360';
import { ThumbMenu } from './ContentThumb';
import './UploadContentModal.css';

var OK_EXT = ['png', 'jpeg', 'jpg', 'mp4', 'webm'];
var ACCEPT = '.png,.jpeg,.jpg,.mp4,.webm,image/png,image/jpeg,video/mp4,video/webm';
var uid = 0;

function resLabel(w, h) {
  var s = Math.min(w, h);
  if (!s) return '';
  if (s >= 2160) return '4K';
  if (s >= 1440) return '2K';
  if (s >= 1080) return 'HD';
  if (s >= 720) return '720p';
  return 'SD';
}
function sizeLabel(b) { return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }

/* Reads a File into a preview entry. Videos get a poster frame grabbed from ~0.1s in. */
function readFile(file, done) {
  var url = URL.createObjectURL(file);
  var isVideo = /^video\//.test(file.type) || /\.(mp4|webm)$/i.test(file.name);
  var base = { id: 'up' + (++uid), name: file.name, kind: isVideo ? 'video' : 'image', url: url, image: isVideo ? '' : url, video: isVideo ? url : '', res: '', size: sizeLabel(file.size), ready: false };
  if (!isVideo) {
    var img = new Image();
    img.onload = function () { done(base.id, { res: resLabel(img.naturalWidth, img.naturalHeight), ready: true }); };
    img.onerror = function () { done(base.id, { ready: true }); };
    img.src = url;
  } else {
    var v = document.createElement('video');
    v.muted = true; v.preload = 'auto'; v.playsInline = true;
    v.onloadeddata = function () { try { v.currentTime = Math.min(0.1, (v.duration || 1) / 2); } catch (e) { grab(); } };
    v.onseeked = grab;
    v.onerror = function () { done(base.id, { ready: true }); };
    v.src = url;
    function grab() {
      v.onseeked = null;
      var poster = '';
      try { var c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); poster = c.toDataURL('image/jpeg', 0.8); } catch (e) {}
      done(base.id, { image: poster, res: resLabel(v.videoWidth, v.videoHeight), ready: true });
    }
  }
  return base;
}

function Pills(p) {
  var f = p.f;
  return (
    <span className="uc-pills">
      <span className={'uc-pill uc-pill--' + f.kind}>{f.kind === 'video' ? 'VIDEO' : 'IMAGE'}</span>
      {f.res ? <span className="uc-pill uc-pill--res">{f.res}</span> : null}
    </span>
  );
}

function Thumb(p) {
  var f = p.f;
  return f.image ? <img src={f.image} alt="" draggable={false} /> : <span className="uc-thumb-ph"><NTV.Icon name={f.kind === 'video' ? 'video' : 'image'} size={16} /></span>;
}

function FileCard(p) {
  var f = p.f;
  var [menu, setMenu] = useState(false);
  return (
    <div className={'uc-card' + (p.checked ? ' is-checked' : '') + (menu ? ' is-menu' : '')}>
      <div className="uc-thumb">
        <Thumb f={f} />
        <Pills f={f} />
        <span className="uc-cb"><NTV.Checkbox checked={!!p.checked} onChange={p.onCheck} label={undefined} aria-label={'Select ' + f.name} /></span>
        {f.kind === 'video' ? <button type="button" className="uc-play" aria-label={'Play ' + f.name} onClick={p.onPreview}><NTV.Icon name="play" size={14} /></button> : null}
        <span className="uc-more"><ThumbMenu label={'Options for ' + f.name} onOpenChange={setMenu} items={[
          { label: 'Preview', icon: 'eye', onClick: p.onPreview },
          { label: 'Remove', icon: 'trash', danger: true, onClick: p.onRemove }
        ]} /></span>
      </div>
      <div className="uc-name">
        <span className="uc-title" title={f.name}>{f.name}</span>
        <button type="button" className="uc-eye" aria-label={'Preview ' + f.name} onClick={p.onPreview}><NTV.Icon name="eye" size={12} /></button>
      </div>
    </div>
  );
}

function FileRow(p) {
  var f = p.f;
  return (
    <div className={'uc-row' + (p.checked ? ' is-checked' : '')}>
      <NTV.Checkbox checked={!!p.checked} onChange={p.onCheck} aria-label={'Select ' + f.name} />
      <button type="button" className="uc-row-thumb" aria-label={'Preview ' + f.name} onClick={p.onPreview}><Thumb f={f} /></button>
      <span className="uc-title" title={f.name}>{f.name}</span>
      <Pills f={f} />
      <span className="uc-row-size">{f.size}</span>
      <button type="button" className="dv-ib" aria-label={'Preview ' + f.name} onClick={p.onPreview}><NTV.Icon name="eye" size={12} /></button>
      <button type="button" className="dv-ib dv-danger" aria-label={'Remove ' + f.name} onClick={p.onRemove}><NTV.Icon name="trash" size={12} /></button>
    </div>
  );
}

export default function UploadContentModal(p) {
  var [files, setFiles] = useState([]);
  var [view, setView] = useState('grid');
  var [checked, setChecked] = useState({});
  var [over, setOver] = useState(false);
  var [preview, setPreview] = useState(null);
  var [error, setError] = useState('');
  var input = useRef(null);
  var kept = useRef(false);   // true once uploaded: object URLs now belong to the library
  var filesRef = useRef(files); filesRef.current = files;

  // Free preview URLs if the modal closes without uploading.
  useEffect(function () { return function () { if (!kept.current) filesRef.current.forEach(function (f) { URL.revokeObjectURL(f.url); }); }; }, []);
  // Escape closes the preview first, then the modal.
  useEffect(function () {
    var onKey = function (e) { if (e.key !== 'Escape' || document.querySelector('.uc-modal [role="menu"]')) return; e.stopPropagation(); if (preview) setPreview(null); else p.onClose(); };
    document.addEventListener('keydown', onKey, true);
    return function () { document.removeEventListener('keydown', onKey, true); };
  }, [preview]);

  var patch = function (id, o) { setFiles(function (fs) { return fs.map(function (f) { return f.id === id ? Object.assign({}, f, o) : f; }); }); };
  var add = function (list) {
    var good = [], bad = [];
    Array.prototype.forEach.call(list || [], function (file) { var ext = (file.name.split('.').pop() || '').toLowerCase(); (OK_EXT.indexOf(ext) !== -1 ? good : bad).push(file); });
    setError(bad.length ? bad.map(function (f) { return f.name; }).join(', ') + (bad.length === 1 ? ' isn’t' : ' aren’t') + ' a supported format, so ' + (bad.length === 1 ? 'it was' : 'they were') + ' skipped.' : '');
    if (good.length) setFiles(function (fs) { return fs.concat(good.map(function (file) { return readFile(file, patch); })); });
  };
  var remove = function (ids) {
    setFiles(function (fs) { return fs.filter(function (f) { if (ids.indexOf(f.id) !== -1) { URL.revokeObjectURL(f.url); return false; } return true; }); });
    setChecked(function (c) { var o = Object.assign({}, c); ids.forEach(function (id) { delete o[id]; }); return o; });
  };
  var toggle = function (id) { setChecked(function (c) { var o = Object.assign({}, c); if (o[id]) delete o[id]; else o[id] = true; return o; }); };
  var checkedIds = files.filter(function (f) { return checked[f.id]; }).map(function (f) { return f.id; });
  var busy = files.some(function (f) { return !f.ready; });
  var n = files.length;
  var upload = function () { kept.current = true; p.onUpload(files.map(function (f) { return { name: f.name, kind: f.kind, image: f.image, video: f.video, res: f.res, size: f.size }; })); };
  var browse = function () { if (input.current) input.current.click(); };

  return (
    <div className="dv-ov uc-ov" onMouseDown={function (e) { if (e.target === e.currentTarget) p.onClose(); }}>
      <NTV.Modal title="Upload Content" width={720} onClose={p.onClose} className="uc-modal">
        <p className="uc-sub">{p.folder ? 'Upload images and videos to “' + p.folder + '”' : 'Upload images and videos to your library'}</p>
        <div className={'uc-drop' + (over ? ' is-over' : '')} role="button" tabIndex={0} aria-label="Drop files here or click to browse"
          onClick={browse} onKeyDown={function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); browse(); } }}
          onDragOver={function (e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') !== -1) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; if (!over) setOver(true); } }}
          onDragLeave={function (e) { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false); }}
          onDrop={function (e) { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}>
          <span className="uc-drop-icon"><NTV.Icon name="arrow-up-from-bracket" size={18} /></span>
          <strong>Drop files here or click to browse</strong>
          <span className="uc-drop-hint">Supported Format: PNG, JPEG, JPG, MP4, WEBM</span>
          <input ref={input} type="file" multiple accept={ACCEPT} hidden onChange={function (e) { add(e.target.files); e.target.value = ''; }} />
        </div>
        {error ? <div className="dv-warn uc-err" role="alert"><NTV.Icon name="triangle-exclamation" size={14} /><span>{error}</span></div> : null}
        {n ? (
          <>
            <div className="uc-head">
              <span className="uc-head-title">Selected Files ({n})</span>
              <div className="uc-head-tools">
                {checkedIds.length ? <button type="button" className="uc-link" onClick={function () { remove(checkedIds); }}>Remove ({checkedIds.length})</button> : null}
                <div className="uc-vt" role="group" aria-label="View">
                  <button type="button" aria-label="Grid view" aria-pressed={view === 'grid'} onClick={function () { setView('grid'); }}><NTV.Icon name="grid" size={12} /></button>
                  <button type="button" aria-label="List view" aria-pressed={view === 'list'} onClick={function () { setView('list'); }}><NTV.Icon name="list" size={12} /></button>
                </div>
              </div>
            </div>
            <div className={view === 'grid' ? 'uc-grid' : 'uc-list'}>
              {files.map(function (f) {
                var q = { f: f, checked: !!checked[f.id], onCheck: function () { toggle(f.id); }, onPreview: function () { setPreview(f); }, onRemove: function () { remove([f.id]); } };
                return view === 'grid' ? <FileCard key={f.id} {...q} /> : <FileRow key={f.id} {...q} />;
              })}
            </div>
          </>
        ) : null}
        <div className="uc-foot">
          <NTV.Button variant="primary" tone="neutral" size="xl" iconRight={null} onClick={p.onClose}>Cancel</NTV.Button>
          <NTV.Button variant="primary" size="xl" iconRight={null} disabled={!n || busy} onClick={upload}>{n ? 'Upload (' + n + ') Content' : 'Select files to upload'}</NTV.Button>
        </div>
      </NTV.Modal>
      {preview ? (
        <div className="dv-ov uc-pv-ov" onMouseDown={function (e) { if (e.target === e.currentTarget) setPreview(null); }}>
          <NTV.Modal title={preview.name} width={820} onClose={function () { setPreview(null); }}>
            <div className="uc-pv">
              {preview.kind === 'video' ? <video src={preview.video} poster={preview.image} controls autoPlay playsInline /> : <img src={preview.image} alt={preview.name} />}
            </div>
          </NTV.Modal>
        </div>
      ) : null}
    </div>
  );
}
