// @ts-nocheck
// Helpers shared by all Dealer View pages: cross-page navigation hand-off (go/stash/arrived),
// lookups into the mock data, toasts, and the create-screen draft. Copied from the design.
import { D } from '../data/mockData';

function navPack(page, filter) { return JSON.stringify({ page: page, filter: filter || null, t: Date.now() }); }
function navHref(a, page, filter) { try { if (!a) return; var base = (a.getAttribute('href') || page).split('?')[0].split('#')[0]; a.setAttribute('href', base + '?nav=' + encodeURIComponent(navPack(page, filter))); } catch (e) {} }
function stash(page, filter) { var v = navPack(page, filter); try { localStorage.setItem('ntvNav', v); } catch (e) {} try { window.name = 'ntvNav:' + v; } catch (e) {} }
function go(page, filter) { stash(page, filter); var a = document.querySelector('a[data-go="' + page + '"]'); if (a) { a.click(); } }
function arrived(page) { var cands = []; try { var m = /[?&]nav=([^&#]*)/.exec(location.search + '&' + location.hash.replace('#', '&')); if (m) cands.push(decodeURIComponent(m[1])); } catch (e) {} try { if (window.name && window.name.indexOf('ntvNav:') === 0) cands.push(window.name.slice(7)); } catch (e) {} try { cands.push(localStorage.getItem('ntvNav')); } catch (e) {} for (var i = 0; i < cands.length; i++) { try { var v = JSON.parse(cands[i] || 'null'); if (v && v.page === page && (!v.t || Date.now() - v.t < 20000)) { try { localStorage.removeItem('ntvNav'); } catch (e) {} try { window.name = ''; } catch (e) {} return v.filter; } } catch (e) {} } return null; }
function val(v) { return v && v.target ? v.target.value : v; }
function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function advsForHost(hid) { var i = parseInt(hid.slice(1), 10) - 1; if (i % 5 === 4) return []; return [0, 1, 2, 3, 4].map(function (k) { return D.advertisers[(i * 2 + k) % 24]; }); }
var STATUS = { online: { label: 'Online', color: 'var(--status-online)' }, offline: { label: 'Offline', color: 'var(--status-offline)' }, pending: { label: 'Pending Install', color: 'var(--info-main)' }, ready: { label: 'Ready for Pairing', color: 'var(--status-pending)' }, disabled: { label: 'Disabled', color: 'var(--status-inactive)' }, unassigned: { label: 'Unassigned', color: 'var(--status-unassigned)' } };
/* Toasts: pages call toast(self, text, kind?, sub?) and render <Toast t={v.toast} /> (components/Toast.tsx),
   which shows top-right under the nav. `close` dismisses early. */
function toastVals(t, self) {
  var kind = (t && t.kind) || 'success';
  var c = { success: ['var(--success-main)', 'circle-check'], info: ['var(--info-main)', 'circle-info'], error: ['var(--danger-main)', 'circle-xmark'], warning: ['var(--warning-main)', 'triangle-exclamation'] }[kind];
  var hide = self ? function () { if (self._tt) clearTimeout(self._tt); self.setState({ toast: null }); } : null;
  var act = t && t.action;
  return { show: !!(t && t.text), text: t ? t.text : '', sub: t ? t.sub || '' : '', kind: kind, id: t ? t.id : 0, color: c[0], icon: c[1], size: 16, ms: t ? t.ms || 0 : 0,
    // Optional inline action (e.g. "undo"): runs, then dismisses the toast.
    action: act ? { label: act.label, run: function () { act.run(); if (hide) hide(); } } : null,
    close: hide };
}
var toastSeq = 0;
// toast(self, text, kind?, sub?, opts?) — opts.action = { label, run } adds an inline button (e.g. undo).
function toast(self, text, kind, sub, opts) {
  opts = opts || {};
  var ms = opts.ms || (opts.action ? 6000 : (sub ? 4000 : 2600));
  if (self._tt) clearTimeout(self._tt);
  self.setState({ toast: { text: text, kind: kind || 'success', sub: sub || '', id: ++toastSeq, ms: ms, action: opts.action || null } });
  self._tt = setTimeout(function () { self.setState({ toast: null }); }, ms);
}
function hostName(id) { var h = byId(D.hosts, id); return h ? h.name : '—'; }
function licsForHost(id) { return D.licenses.filter(function (l) { return l.host === id; }); }
function screenName(id) { var s = byId(D.screens, id); return s ? s.name : '—'; }
function plByName(n) { for (var i = 0; i < D.playlists.length; i++) if (D.playlists[i].name === n) return D.playlists[i]; return null; }
function mediaEntries(ids, block) { var ms = ids.map(function (id) { return byId(D.media, id); }).filter(Boolean); var th = function (m) { return { image: m.image, kind: m.kind, title: m.title, duration: m.duration || '' }; }; var out = []; if (block && ms.length > 2) { var b = ms.slice(0, 3).map(th); b[0].span = 2; out.push({ isBlock: true, isThumb: false, items: b }); ms = ms.slice(3); } ms.forEach(function (m) { var t = th(m); t.isBlock = false; t.isThumb = true; out.push(t); }); return out; }
function contains(hay, q) { return !q || hay.toLowerCase().indexOf(q.toLowerCase().trim()) !== -1; }
function draft(v) { try { if (v) { localStorage.setItem('ntvDraft', JSON.stringify(v)); return v; } return JSON.parse(localStorage.getItem('ntvDraft') || 'null') || {}; } catch (e) { return {}; } }

function navFn(page, filter) { var f = function () { stash(page, filter); }; try { f.nav = JSON.stringify({ page: page, filter: filter || null }); } catch (e) {} return f; }
try { if (!window.__ntvNavL) { window.__ntvNavL = 1; var _nl = function (e) { try { var a = e.target && e.target.closest ? e.target.closest('[data-nav]') : null; if (!a) return; var raw = a.getAttribute('data-nav'); if (!raw) return; var v = JSON.parse(raw); if (v && v.page) stash(v.page, v.filter); } catch (x) {} }; document.addEventListener('pointerdown', _nl, true); document.addEventListener('click', _nl, true); } } catch (e) {}
function addNav(o, d) { d = d || 0; if (!o || typeof o !== 'object' || d > 5) return o; try { if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) addNav(o[i], d + 1); return o; } var ks = Object.keys(o); for (var j = 0; j < ks.length; j++) { var k = ks[j], x = o[k]; if (typeof x === 'function' && x.nav && !(k + 'Nav' in o)) o[k + 'Nav'] = x.nav; else if (x && typeof x === 'object') addNav(x, d + 1); } } catch (e) {} return o; }
function peekNav(page) { try { var v = JSON.parse(localStorage.getItem('ntvNav') || 'null'); return !!(v && v.page === page && (!v.t || Date.now() - v.t < 20000)); } catch (e) { return false; } }

export { D, STATUS, addNav, advsForHost, arrived, byId, contains, draft, go, hostName, licsForHost, mediaEntries, navFn, navHref, navPack, peekNav, plByName, screenName, stash, toast, toastVals, val };
