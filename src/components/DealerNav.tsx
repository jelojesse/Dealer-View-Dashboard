// @ts-nocheck
/**
 * Component: DealerNav
 * Converted from the Claude Design artboard DealerNav.dc.html.
 *
 * - `renderVals()` in the Logic section returns every value the markup uses (as `v.*`).
 * - The Markup section is plain JSX; edit layout, copy and inline styles there.
 */
import React from 'react';
import { DCLogic, defineTemplate, s } from '../lib/dc';
import { NTV } from '../ds/ntv360';
import { go } from '../lib/shared';

/* ============================== Logic ============================== */

class Component extends DCLogic {
  renderVals() {
    var map = { dashboard: 'DealerDashboard.dc.html', Hosts: 'DealerHosts.dc.html', Advertisers: 'DealerAdvertisers.dc.html', Licenses: 'DealerLicenses.dc.html', Locator: 'DealerLocator.dc.html', 'Media Library': 'DealerMedia.dc.html', Playlists: 'DealerPlaylists.dc.html', channel: 'DealerChannels.dc.html', Screens: 'DealerScreens.dc.html', Tags: 'DealerTags.dc.html' };
    return {
      yes: true,
      active: this.props.active ?? 'dashboard',
      activeItem: this.props.activeItem ?? '',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: 'grid-2' },
        { key: 'network', label: 'Network', icon: 'network-wired', menu: ['Hosts', 'Advertisers', 'Licenses', 'Locator'] },
        { key: 'content', label: 'Content', icon: 'clapperboard-play', menu: ['Media Library', 'Playlists'] },
        { key: 'channel', label: 'Channel Manager', icon: 'earth-americas' },
        { key: 'display', label: 'Display', icon: 'tv', menu: ['Screens', 'Tags'] }
      ],
      links: Object.keys(map).map(function (k) { return { href: map[k], label: k }; }),
      nav: function (key, item) {
        var target = map[item] || map[key];
        if (!target) return;
        var a = document.querySelector('a[data-go="' + target + '"]');
        if (a) a.click();
      }
    };
  }
}

/* ============================== Markup ============================== */

defineTemplate(Component, (v) => (
    <>
    <div className="ntv-root" style={{ width: "100%", position: "relative" }}>
      <NTV.Navbar items={v.items} active={v.active} activeItem={v.activeItem} userName="Ibanez Lighting Inc." userRole="Dealer Admin" unread={v.yes} onNavigate={v.nav} style={{ width: "100%" }} />
      <div aria-hidden="true" style={{ display: "none" }}>
        {(v.links || []).map((_l, $index) => (
          <React.Fragment key={$index}>
            <a data-go={_l?.href} href={_l?.href} tabIndex="-1">{_l?.label}</a>
          </React.Fragment>
        ))}
      </div>
    </div>
    </>
));

export default Component;
