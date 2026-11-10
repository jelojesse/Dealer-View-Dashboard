// Every Dealer View page, its URL and the design file it came from.
// Links in the pages still point at the design file names (e.g. "DealerHosts.dc.html");
// App.tsx maps them to these routes, so cross-page navigation works unchanged.

import type { ComponentType } from 'react';
import DealerDashboard from './pages/DealerDashboard';
import DealerHosts from './pages/DealerHosts';
import DealerHostDetail from './pages/DealerHostDetail';
import DealerNewHost from './pages/DealerNewHost';
import DealerAdvertisers from './pages/DealerAdvertisers';
import DealerAdvertiserDetail from './pages/DealerAdvertiserDetail';
import DealerNewAdvertiser from './pages/DealerNewAdvertiser';
import DealerLicenses from './pages/DealerLicenses';
import DealerLicenseDetail from './pages/DealerLicenseDetail';
import DealerLocator from './pages/DealerLocator';
import DealerMedia from './pages/DealerMedia';
import DealerPlaylists from './pages/DealerPlaylists';
import DealerPlaylistDetail from './pages/DealerPlaylistDetail';
import DealerChannels from './pages/DealerChannels';
import DealerChannelDetail from './pages/DealerChannelDetail';
import DealerScreens from './pages/DealerScreens';
import DealerNewScreen from './pages/DealerNewScreen';
import DealerAssignPlaylist from './pages/DealerAssignPlaylist';
import DealerPublish from './pages/DealerPublish';
import DealerScreenDetail from './pages/DealerScreenDetail';
import DealerTags from './pages/DealerTags';

export type PageRoute = { file: string; path: string; title: string; component: ComponentType<any> };

export const ROUTES: PageRoute[] = [
  { file: 'DealerDashboard.dc.html', path: '/', title: "Dashboard", component: DealerDashboard },
  { file: 'DealerHosts.dc.html', path: '/hosts', title: "Hosts", component: DealerHosts },
  { file: 'DealerHostDetail.dc.html', path: '/hosts/detail', title: "Host Details", component: DealerHostDetail },
  { file: 'DealerNewHost.dc.html', path: '/hosts/new', title: "New Host", component: DealerNewHost },
  { file: 'DealerAdvertisers.dc.html', path: '/advertisers', title: "Advertisers", component: DealerAdvertisers },
  { file: 'DealerAdvertiserDetail.dc.html', path: '/advertisers/detail', title: "Advertiser Details", component: DealerAdvertiserDetail },
  { file: 'DealerNewAdvertiser.dc.html', path: '/advertisers/new', title: "New Advertiser", component: DealerNewAdvertiser },
  { file: 'DealerLicenses.dc.html', path: '/licenses', title: "Licenses", component: DealerLicenses },
  { file: 'DealerLicenseDetail.dc.html', path: '/licenses/detail', title: "License Details", component: DealerLicenseDetail },
  { file: 'DealerLocator.dc.html', path: '/locator', title: "Locator", component: DealerLocator },
  { file: 'DealerMedia.dc.html', path: '/media', title: "Media Library", component: DealerMedia },
  { file: 'DealerPlaylists.dc.html', path: '/playlists', title: "Playlists", component: DealerPlaylists },
  { file: 'DealerPlaylistDetail.dc.html', path: '/playlists/detail', title: "Playlist Details", component: DealerPlaylistDetail },
  { file: 'DealerChannels.dc.html', path: '/channels', title: "Channel Manager", component: DealerChannels },
  { file: 'DealerChannelDetail.dc.html', path: '/channels/detail', title: "Channel (view only)", component: DealerChannelDetail },
  { file: 'DealerScreens.dc.html', path: '/screens', title: "Screens", component: DealerScreens },
  { file: 'DealerNewScreen.dc.html', path: '/screens/new', title: "Create Screen · 1 Setup", component: DealerNewScreen },
  { file: 'DealerAssignPlaylist.dc.html', path: '/screens/new/assign-playlist', title: "Create Screen · 2 Assign Playlist", component: DealerAssignPlaylist },
  { file: 'DealerPublish.dc.html', path: '/screens/new/publish', title: "Create Screen · 3 Publish", component: DealerPublish },
  { file: 'DealerScreenDetail.dc.html', path: '/screens/detail', title: "Screen Details", component: DealerScreenDetail },
  { file: 'DealerTags.dc.html', path: '/tags', title: "Tags", component: DealerTags },
];

export const ROUTE_BY_FILE: Record<string, string> = Object.fromEntries(ROUTES.map((r) => [r.file, r.path]));
