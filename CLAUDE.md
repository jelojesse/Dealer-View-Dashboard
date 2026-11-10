# Dealer View Dashboard — guide for Claude

UI-only React app (no backend) for the **NTV360 Dealer View**. It was converted from the
Claude Design artifact "NTV360 Webapp" (Dealer View page). The repo owner is a UI/UX designer:
they will ask for design changes in plain language ("make the Hosts table denser", "add a
Status column", "change the dashboard cards to 3 per row"). Your job is to make that change in
code, keep it consistent with the NTV360 design system, verify it, and commit.

## Run / verify
- `npm install` once, then `npm run dev` → http://localhost:5173 (HashRouter: URLs look like `/#/hosts`).
- `npm run build` must pass before committing.
- After a visual change, look at the page (screenshot it if you have a browser/Playwright) at
  1600×1000 and check that nothing else on the page broke.

## Where things live
| What | Where |
|---|---|
| Page list, URLs, titles | `src/routes.ts` |
| Each page | `src/pages/Dealer*.tsx` (+ `Dealer*.css` for page-only styles) |
| Reusable pieces (nav bar, summary card, push-updates modal, filters, rows…) | `src/components/*.tsx` |
| Mock data (dealer, hosts, advertisers, licenses, screens, playlists, media, channels, tags) | `src/data/mockData.js` |
| Shared helpers (cross-page nav hand-off, lookups, toasts, draft) | `src/lib/shared.js` |
| Shared utility classes `dv-*` (cards, tables, chips, tabs, modals, toasts…) | `src/styles/dealer-view.css` |
| NTV360 design tokens (colors, spacing, radii, shadows, gradients) | `src/ds/ntv360/tokens.css` |
| NTV360 components (`NTV.Button`, `NTV.Input`, `NTV.Select`, `NTV.Modal`, `NTV.StatusModal`, `NTV.Icon`, `NTV.Navbar`, `NTV.Breadcrumbs`, `NTV.Stepper`, `NTV.Switch`, `NTV.Checkbox`, `NTV.Trend`, `NTV.IconTile`, …) | `src/ds/ntv360/bundle.js` + `bundle.css` (design-system build — don't hand-edit; treat as a library) |
| Placeholder images | `public/images/<id>.jpg` (referenced as `images/<id>.jpg`) |

| Route | Page file |
|---|---|
| `/` | DealerDashboard |
| `/hosts`, `/hosts/detail`, `/hosts/new` | DealerHosts, DealerHostDetail, DealerNewHost |
| `/advertisers`, `/advertisers/detail`, `/advertisers/new` | DealerAdvertisers, DealerAdvertiserDetail, DealerNewAdvertiser |
| `/licenses`, `/licenses/detail`, `/locator` | DealerLicenses, DealerLicenseDetail, DealerLocator |
| `/media`, `/playlists`, `/playlists/detail` | DealerMedia, DealerPlaylists, DealerPlaylistDetail |
| `/channels`, `/channels/detail` | DealerChannels, DealerChannelDetail |
| `/screens`, `/screens/new`, `/screens/new/assign-playlist`, `/screens/new/publish`, `/screens/detail` | DealerScreens, DealerNewScreen, DealerAssignPlaylist, DealerPublish, DealerScreenDetail |
| `/tags` | DealerTags |

## How a page file is structured (keep this pattern)
```tsx
class Component extends DCLogic {          // Logic: a normal React class component
  constructor(props) { super(props); this.state = { … }; }
  renderVals() { return { rows, query, setQuery, … }; }   // everything the markup needs
}
defineTemplate(Component, (v) => (          // Markup: plain JSX reading v.*
  <div className="pg-hosts" style={{ display: "contents" }}> … </div>
));
```
- **Visual/layout/copy changes** → edit the JSX in the Markup section (inline `style={{…}}`
  objects and `dv-*` classes). Most changes are here.
- **New data shown on screen** → add it to `renderVals()` (and to `mockData.js` if it's data),
  then read it in the markup as `v.name`.
- **Interactions** (open a modal, toggle, filter) → keep the state in `this.state`, expose a
  handler from `renderVals()`, bind it in JSX (`onClick={v.openThing}`).
- Page-only CSS goes in `src/pages/<Page>.css`, scoped under the page's wrapper class
  (`.pg-hosts .my-class { … }`) so it can't leak into other pages.
- Files start with `// @ts-nocheck` on purpose (logic is plain JS from the design). New code may
  be TypeScript-light; don't spend effort adding types.

## Design rules
- Use tokens, never raw hex for theme colors: `var(--accent-action)`, `var(--fg-primary)`,
  `var(--fg-secondary)`, `var(--bg-app)`, `var(--bg-surface)`, `var(--container-border)`,
  `var(--status-online|offline|pending|inactive)`, `var(--radius-sm|md|lg)`, `var(--shadow-card)`.
- Font is Nunito (`var(--font-sans)`). Page titles: `dv-h1` (20/32 bold, accent). Card titles 20/32 bold.
  Body 14/24, meta 12/20 in `--fg-secondary`. Table cells 12/20.
- Prefer an existing NTV360 component (`NTV.Button variant="primary|secondary" size="xl"`, `NTV.Input`,
  `NTV.Select`, `NTV.Modal`, `NTV.StatusModal`, `NTV.Icon name="…"`) or an existing `dv-*` class
  over new custom markup. Icon names: see the `ICONS` map at the top of `src/ds/ntv360/bundle.js`.
- Keep the page shell: `<DealerNav active="…" activeItem="…"/>` at top, then `.dv-scroll > main.dv-main`.
- A change to something shared (`components/*`, `dealer-view.css`, tokens) affects every page —
  say so when you do it, and check a couple of other pages.

## Navigation (don't break it)
Pages link to each other by **design file name** (`href="DealerHosts.dc.html"`, `go('DealerHostDetail.dc.html', { id })`,
`navFn(...)`). `App.tsx` intercepts those clicks and maps them to routes via `ROUTE_BY_FILE`.
Detail pages read which record to show with `arrived('<File>.dc.html')` (hand-off through
`localStorage`/`?nav=`). When adding a page: add the component in `src/pages`, add a row to
`ROUTES` in `src/routes.ts`, and link to it by its file name.

## Git
- Work on a branch, small focused commits with a message describing the design change
  ("Hosts: add Status column and tighten row height").
- Run `npm run build` before committing.
