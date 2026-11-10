// @ts-nocheck
/**
 * Page: Media Details  (route /media/detail)
 * Single media item from the Media Library (Figma 6160:125596 image, 6160:125551 video).
 * Opened from a Media Library card (eye icon / ⋯ View Details) with
 * navFn('DealerMediaDetail.dc.html', { id }).
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { addNav, arrived, byId, hostName, navFn, peekNav, toast, toastVals, D } from '../lib/shared';
import DealerNav from '../components/DealerNav';
import DateRangePicker, { fmtDate, fmtRange } from '../components/DateRangePicker';
import { FOLDERS } from './DealerMedia';
import './DealerMediaDetail.css';

/* ============================== Logic ============================== */

var CHIP_LIMIT = 7;
var TYPE_LABEL = { image: 'Image', video: 'Video', widget: 'Widget' };
var TABS = ['Reports', 'In Playlist', 'Playing Where', 'History'];
function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
function fmtDur(sec) { var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), x = sec % 60; return h + 'h ' + m + 'm ' + x + 's'; }
function secsOf(d) { var m = /(\d+)\s*min/.exec(d || ''), x = /(\d+)\s*sec/.exec(d || ''); return (m ? +m[1] * 60 : 0) + (x ? +x[1] : 0) || 15; }

class Component extends DCLogic {
  constructor(props) {
    super(props);
    var f = arrived('DealerMediaDetail.dc.html') || {};
    var today = new Date(2026, 10, 10);
    this.state = { id: (byId(D.media, f.id) || D.media[0]).id, tab: 'Reports', range: { start: addDays(today, -29), end: today }, report: 1, allFolders: false, toast: null };
  }
  componentWillUnmount() { if (this._tt) clearTimeout(this._tt); }
  renderVals() {
    var self = this, st = this.state;
    var m = byId(D.media, st.id) || D.media[0];
    var seed = parseInt(m.id.slice(1), 10) || 1;
    var ext = (/\.([a-z0-9]+)$/i.exec(m.title) || [, m.kind === 'video' ? 'mp4' : 'jpg'])[1].toUpperCase();

    // Where it's used
    var pls = D.playlists.filter(function (p) { return p.items.indexOf(m.id) !== -1; });
    var where = [];
    pls.forEach(function (p) { p.screens.forEach(function (sid) { var sc = byId(D.screens, sid); if (sc && !where.some(function (w) { return w.id === sid; })) where.push(sc); }); });
    var lic = 0, hosts = {};
    where.forEach(function (sc) { lic += sc.lic.length; hosts[sc.host] = 1; });

    // Folders: its own folder first, then a deterministic handful of others.
    var names = FOLDERS.map(function (x) { return x.name; }).filter(function (n) { return n !== m.folder; });
    var nf = m.folder ? 2 + (seed * 5) % 13 : 0;
    var folders = (m.folder ? [m.folder] : []).concat(names.filter(function (_n, i) { return (i * 7 + seed) % 3 === 0; }).slice(0, Math.max(0, nf - 1)));
    var shownFolders = st.allFolders ? folders : folders.slice(0, CHIP_LIMIT);

    // Playlist report rows for the chosen date range (mock numbers, stable per item + range).
    var r = st.range || {};
    var days = r.start ? Math.round(((r.end || r.start) - r.start) / 864e5) + 1 : 0;
    var each = secsOf(m.duration);
    var reports = [];
    pls.forEach(function (p, pi) {
      p.screens.forEach(function (sid, si) {
        var sc = byId(D.screens, sid); if (!sc) return;
        var plays = days ? Math.max(1, Math.round(days * (3 + ((seed * 13 + pi * 7 + si * 11 + st.report) % 9)) / 3)) : 0;
        reports.push({ host: hostName(sc.host), playlist: p.name, plays: plays, dur: fmtDur(plays * each), start: fmtDate(r.start), end: fmtDate(r.end || r.start),
          openHost: navFn('DealerHostDetail.dc.html', { id: sc.host }), openPl: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) });
      });
    });
    reports.forEach(function (x, i) { x.n = i + 1; });

    var owner = m.adv ? (byId(D.advertisers, m.adv) || {}).name : (m.host ? hostName(m.host) : D.dealer.short);
    var history = [['Uploaded to Media Library', m.uploaded, owner]];
    if (m.folder) history.push(['Added to folder “' + m.folder + '”', m.uploaded, owner]);
    pls.forEach(function (p) { history.push(['Added to playlist “' + p.name + '”', p.published, 'NTV360 Support']); });
    if (where.length) history.push(['Started playing on ' + where.length + ' screen(s)', pls[0].published, 'System']);

    return {
      none: null, i12: 12, i14: 14,
      crumbs: [{ label: 'Media Library', href: 'DealerMedia.dc.html' }, 'Media Library / ' + m.title],
      m: { title: m.title, image: m.image, video: m.video || '', isVideo: !!m.video, kind: m.kind,
        filetype: ext + ' ' + (TYPE_LABEL[m.kind] || 'File'), owner: owner, uploaded: m.uploaded, size: m.size, duration: m.duration || '—' },
      folderCount: folders.length, folders: shownFolders, noFolders: folders.length === 0,
      moreFolders: !st.allFolders && folders.length > CHIP_LIMIT ? '+' + (folders.length - CHIP_LIMIT) + ' More' : '',
      lessFolders: st.allFolders && folders.length > CHIP_LIMIT,
      toggleFolders: function () { self.setState({ allFolders: !self.state.allFolders }); },
      openFolder: navFn('DealerMedia.dc.html', {}),
      counts: [['License Count', lic], ['Host Count', Object.keys(hosts).length], ['Playlist Count', pls.length], ['Screen Count', where.length]].map(function (c) { return { label: c[0], value: c[1] }; }),
      range: st.range, setRange: function (x) { self.setState({ range: x }); }, today: new Date(2026, 10, 10),
      generate: function () { self.setState({ report: self.state.report + 1, tab: 'Reports' }); toast(self, 'Report generated for ' + fmtRange(self.state.range)); },
      tabs: TABS.map(function (t) { var n = t === 'In Playlist' ? pls.length : t === 'Playing Where' ? where.length : null; return { label: n == null ? t : t + ' (' + n + ')', on: st.tab === t, pick: function () { self.setState({ tab: t }); } }; }),
      t: { reports: st.tab === 'Reports', playlists: st.tab === 'In Playlist', where: st.tab === 'Playing Where', history: st.tab === 'History' },
      reports: reports, noReports: reports.length === 0,
      playlists: pls.map(function (p, i) { var l = 0; p.screens.forEach(function (x) { var sc = byId(D.screens, x); l += sc ? sc.lic.length : 0; }); return { n: i + 1, name: p.name, screens: p.screens.length, lic: l, published: p.published, open: navFn('DealerPlaylistDetail.dc.html', { id: p.id }) }; }),
      noPlaylists: pls.length === 0,
      where: where.map(function (sc, i) { return { n: i + 1, screen: sc.name, host: hostName(sc.host), lic: sc.lic.length, type: sc.type, open: navFn('DealerScreenDetail.dc.html', { id: sc.id }), openHost: navFn('DealerHostDetail.dc.html', { id: sc.host }) }; }),
      noWhere: where.length === 0,
      history: history.map(function (h, i) { return { n: i + 1, what: h[0], date: h[1], by: h[2] }; }),
      toast: toastVals(st.toast)
    };
  }
}

;(function () { var P = 'DealerMediaDetail.dc.html'; var C = Component; var R = C.prototype.renderVals; C.prototype.renderVals = function () { var self = this; if (P && !self.__nw) { self.__nw = setInterval(function () { try { if (peekNav(P)) { var n = new C(self.props); self.setState(n.state); } } catch (e) {} }, 250); } return addNav(R.apply(this, arguments)); }; var U = C.prototype.componentWillUnmount; C.prototype.componentWillUnmount = function () { if (this.__nw) clearInterval(this.__nw); if (U) return U.apply(this, arguments); }; })();

/* ============================== Markup ============================== */

var COLS_REPORTS = "50px 1.3fr 1.3fr 0.8fr 1fr 1fr 1fr";
var COLS_PL = "50px 1.6fr 0.8fr 0.8fr 1fr";
var COLS_WHERE = "50px 1.6fr 1.3fr 0.7fr 0.7fr";
var COLS_HIST = "50px 2fr 1fr 1fr";

defineTemplate(Component, (v) => (
    <div className="pg-media-detail" style={{ display: "contents" }}>
    <div className="ntv-root" style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <div style={{ flex: "none", position: "relative", zIndex: "10" }}>
        <DealerNav active="content" activeItem="Media Library" />
      </div>
      <div className="dv-scroll">
        <main className="dv-main">
          <NTV.Breadcrumbs items={v.crumbs} />
          <div className="md-top">
            <section className="dv-card md-preview" aria-label={`Preview of ${s(v.m?.title)}`}>
              {v.m?.isVideo
                ? <video key={v.m?.video} className="md-media" src={v.m?.video} poster={v.m?.image} controls playsInline preload="metadata" />
                : <img className="md-media" src={v.m?.image} alt={v.m?.title} />}
            </section>
            <aside className="dv-card md-info">
              <h2 className="md-cardtitle">Content Information</h2>
              <div className="md-kvrow">
                <div className="md-kv"><span>Filename</span><span title={v.m?.title}>{v.m?.title}</span></div>
                <div className="md-kv"><span>Filetype</span><span>{v.m?.filetype}</span></div>
              </div>
              <div className="md-kvrow">
                <div className="md-kv"><span>Uploaded by</span><span>{v.m?.owner}</span></div>
                <div className="md-kv"><span>Date Uploaded</span><span>{v.m?.uploaded}</span></div>
              </div>
              <div className="md-folders">
                <span className="md-label">{"Folders ("}{v.folderCount}{")"}</span>
                <div className="md-chips">
                  {(v.folders || []).map((name, i) => (
                    <a key={name + i} className="md-chip" href="DealerMedia.dc.html" data-nav={v.openFolderNav} onClick={v.openFolder} title={name}>
                      <NTV.Icon name="folder" size={10} />
                      <span>{name}</span>
                    </a>
                  ))}
                  {v.moreFolders ? (
                    <button type="button" className="md-chip md-chip--more" onClick={v.toggleFolders}>{v.moreFolders}<NTV.Icon name="angle-right" size={10} /></button>
                  ) : null}
                  {v.lessFolders ? <button type="button" className="md-chip md-chip--more" onClick={v.toggleFolders}>Show Less</button> : null}
                  {v.noFolders ? <span className="dv-sub">Not in any folder</span> : null}
                </div>
              </div>
              <div className="md-counts">
                {(v.counts || []).map((c) => (
                  <div key={c.label} className="md-count">
                    <strong>{c.value}</strong>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
          <section className="dv-card md-reports">
            <div className="dv-between">
              <h2 className="dv-h1">Playlist Reports</h2>
              <div className="dv-row" style={{ gap: "12px" }}>
                <DateRangePicker value={v.range} onChange={v.setRange} align="right" today={v.today} />
                <NTV.Button variant="primary" size="xl" iconRight="file-pdf" onClick={v.generate}>Generate Report</NTV.Button>
              </div>
            </div>
            <div className="dv-tabs" role="tablist">
              {(v.tabs || []).map((_t, $index) => (
                <button key={$index} type="button" role="tab" className="dv-tab" aria-selected={_t?.on} onClick={_t?.pick} style={{ minWidth: "140px" }}>{_t?.label}</button>
              ))}
            </div>
            {v.t?.reports ? (
              <div className="dv-table">
                <div role="table" aria-label="Playlist reports">
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: COLS_REPORTS }}>
                    <div style={{ textAlign: "center" }}>#</div><div>Host Name</div><div>Playlist</div><div>Total Play</div><div>Total Duration</div><div>Start Date</div><div>End Date</div>
                  </div>
                  {(v.reports || []).map((r) => (
                    <div key={r.n} role="row" className="dv-tr" style={{ gridTemplateColumns: COLS_REPORTS }}>
                      <div style={{ textAlign: "center" }}>{r.n}</div>
                      <div><a className="dv-a" href="DealerHostDetail.dc.html" onClick={r.openHost} data-nav={r.openHostNav}>{r.host}</a></div>
                      <div><a className="dv-a" href="DealerPlaylistDetail.dc.html" onClick={r.openPl} data-nav={r.openPlNav}>{r.playlist}</a></div>
                      <div>{r.plays}</div><div>{r.dur}</div><div>{r.start}</div><div>{r.end}</div>
                    </div>
                  ))}
                  {v.noReports ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>No plays to report. This content isn’t in any playlist yet.</div> : null}
                </div>
              </div>
            ) : null}
            {v.t?.playlists ? (
              <div className="dv-table">
                <div role="table" aria-label="In playlist">
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: COLS_PL }}>
                    <div style={{ textAlign: "center" }}>#</div><div>Playlist</div><div>Screens</div><div>Licenses</div><div>Published</div>
                  </div>
                  {(v.playlists || []).map((p) => (
                    <div key={p.n} role="row" className="dv-tr" style={{ gridTemplateColumns: COLS_PL }}>
                      <div style={{ textAlign: "center" }}>{p.n}</div>
                      <div><a className="dv-a" href="DealerPlaylistDetail.dc.html" onClick={p.open} data-nav={p.openNav}>{p.name}</a></div>
                      <div>{p.screens}</div><div>{p.lic}</div><div>{p.published}</div>
                    </div>
                  ))}
                  {v.noPlaylists ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>Not in any playlist yet.</div> : null}
                </div>
              </div>
            ) : null}
            {v.t?.where ? (
              <div className="dv-table">
                <div role="table" aria-label="Playing where">
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: COLS_WHERE }}>
                    <div style={{ textAlign: "center" }}>#</div><div>Screen</div><div>Host</div><div>Type</div><div>Licenses</div>
                  </div>
                  {(v.where || []).map((w) => (
                    <div key={w.n} role="row" className="dv-tr" style={{ gridTemplateColumns: COLS_WHERE }}>
                      <div style={{ textAlign: "center" }}>{w.n}</div>
                      <div><a className="dv-a" href="DealerScreenDetail.dc.html" onClick={w.open} data-nav={w.openNav}>{w.screen}</a></div>
                      <div><a className="dv-a" href="DealerHostDetail.dc.html" onClick={w.openHost} data-nav={w.openHostNav}>{w.host}</a></div>
                      <div>{w.type}</div><div>{w.lic}</div>
                    </div>
                  ))}
                  {v.noWhere ? <div className="dv-empty" style={{ borderTop: "1px solid var(--container-border)" }}>Not playing on any screen.</div> : null}
                </div>
              </div>
            ) : null}
            {v.t?.history ? (
              <div className="dv-table">
                <div role="table" aria-label="History">
                  <div role="row" className="dv-tr dv-th" style={{ gridTemplateColumns: COLS_HIST }}>
                    <div style={{ textAlign: "center" }}>#</div><div>Activity</div><div>Date</div><div>By</div>
                  </div>
                  {(v.history || []).map((h) => (
                    <div key={h.n} role="row" className="dv-tr" style={{ gridTemplateColumns: COLS_HIST }}>
                      <div style={{ textAlign: "center" }}>{h.n}</div><div>{h.what}</div><div>{h.date}</div><div>{h.by}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>
      {v.toast?.show ? (
        <div className="dv-toast" role="status" style={{ borderLeftColor: `${s(v.toast?.color)}` }}>
          <NTV.Icon name={v.toast?.icon} size={v.toast?.size} />
          <span>{v.toast?.text}</span>
        </div>
      ) : null}
    </div>
    </div>
));

export default Component;
