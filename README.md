# NTV360 Dealer View Dashboard

A UI-only React app for the NTV360 **Dealer View**: dashboard, network (hosts, advertisers, licenses, locator),
content (media library, playlists), channel manager, and display (screens with the 3-step create flow, tags).
It runs entirely on mock data, so there is no backend to set up.

It was converted from the Claude Design artifact **NTV360 Webapp** and uses the **NTV360 design system**
(tokens + components).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Change the design

Open this repo in Claude and describe the change, for example:

- "On the Hosts page, add a Status column after Host Name"
- "Make the dashboard summary cards 3 per row and move Advertisers below"
- "Change the primary button gradient to solid accent red everywhere"

[`CLAUDE.md`](./CLAUDE.md) tells Claude where everything lives and which conventions to keep.

## Project map

```
src/
  pages/        one file per screen (Dealer*.tsx) + page-only CSS
  components/   shared pieces: DealerNav, SummaryCard, PushFlow, HostAdvFilter, rows, cards…
  data/         mockData.js — all the fake records the UI shows
  lib/          dc.tsx (page pattern), shared.js (navigation hand-off + helpers)
  styles/       dealer-view.css — shared dv-* utility classes
  ds/ntv360/    NTV360 design system: tokens.css, bundle.css, bundle.js
  routes.ts     page ↔ URL list
public/images/  placeholder images (swap in real ones with the same file names)
```

## Notes

- The images are placeholders. The originals live only inside the Claude Design artifact. To use real
  images, save them as `public/images/<same-id>.jpg`.
- The Super Admin "Screens" flow from the same artifact isn't included here, only the Dealer View.
