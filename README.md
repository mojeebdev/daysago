# daysago

A minimal, live-ticking "X was Y days ago" site. Split-flap counter for 2020 as
the hook, a few pre-loaded shockers, and a generator so people can plug in
their own date and share a card to X.

## Run locally

```bash
pnpm install   # or npm install
pnpm dev       # or npm run dev
```

Note: this build failed in the sandboxed environment I built it in only
because that sandbox blocks `fonts.googleapis.com` — everything else
(TypeScript, ESLint, all routes) checks out clean. `next/font/google` fetches
JetBrains Mono + Manrope at build time, so on your machine / Vercel this will
build fine.

## Before you deploy

1. **Set your real URL** in `app/layout.tsx` → `export const SITE_URL`. This
   is used for OG tags, the share links, and the X intent links. It needs to
   be right or the shared cards won't preview correctly on X.
2. Push to GitHub, import into Vercel, deploy to a `*.vercel.app` domain —
   zero config needed beyond that.

## How it's put together

- `app/page.tsx` — assembles the hero, shocker row, and generator. Also
  defines `generateMetadata`, which reads `?label=&date=` from the URL so
  every generated/shared link gets its own dynamic OG title + image (this is
  the growth loop — a shared link previews the actual stat, not a generic
  homepage card).
- `app/api/og/route.tsx` — edge route that renders the OG image on the fly
  with `next/og`, styled to match the split-flap board.
- `components/FlipDigit.tsx` / `FlipGroup.tsx` — the signature element: a
  single character that does a 3D flip when its value changes, styled like an
  airport departures board. Respects `prefers-reduced-motion`.
- `components/HeroCounter.tsx` — the big 2020 counter, ticking live down to
  the second.
- `components/ShockerRow.tsx` — smaller pre-loaded reference points
  (`lib/dates.ts` → `SHOCKERS`). Add/remove entries there.
- `components/Generator.tsx` — user input → flip-card result → share to X /
  copy link / download PNG (via `html-to-image`).

## Easy tweaks

- **Add a shocker**: edit the `SHOCKERS` array in `lib/dates.ts`.
- **Change the palette**: all colors are CSS variables at the top of
  `app/globals.css` (`--ink`, `--board`, `--bone`, `--amber`, `--slate`).
- **Change the flip speed**: `280ms` in `components/FlipDigit.tsx` and the
  matching `flip-turn` animation duration in `globals.css`.
