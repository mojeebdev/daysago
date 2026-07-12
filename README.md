# daysago

A minimal Next.js web app that answers the viral prompt “2020 was how many
days ago?” with:

- a live, ticking split-flap hero counter,
- a set of preloaded reference shockers,
- a generator that creates shareable cards and X tweet links,
- on-the-fly OG image rendering via a Next.js edge route.

## Run locally

```bash
npm install
npm run dev
```

## Stack

- `next` 16.2.10
- `react` 19.2.4
- `react-dom` 19.2.4
- `typescript` 5
- `eslint` 9 + `eslint-config-next` 16.2.10
- `tailwindcss` 4 + `@tailwindcss/postcss`
- `html-to-image` for client-side PNG card export

## What’s inside

- `app/layout.tsx`
  - root layout using `next/font/google`
  - exports `SITE_URL` used for share links and dynamic metadata
- `app/page.tsx`
  - composes `HeroCounter`, `ShockerRow`, and `Generator`
  - `generateMetadata` reads `?label=&date=` and builds dynamic Open Graph metadata
- `app/api/og/route.tsx`
  - edge runtime route using `next/og`
  - generates a social preview image from query data
  - supports explicit `days` override for anchored hero share cards
- `components/FlipDigit.tsx`
  - client component for one split-flap digit
  - animates a 3D flip when the value changes
- `components/FlipGroup.tsx`
  - renders a row of `FlipDigit` characters
- `components/HeroCounter.tsx`
  - live client-side ticking counter that updates every second
  - uses anchored day math so the 2020 count increments cleanly at UTC midnight
- `components/ShockerRow.tsx`
  - renders reference cards for preloaded shockers with live elapsed-day updates
- `components/Generator.tsx`
  - accepts label + date input
  - renders share card, copy link, X tweet link, and download PNG via `html-to-image`
- `lib/dates.ts`
  - shared time calculations for anchors, elapsed days, formatting, and padding
- `app/globals.css`
  - Tailwind CSS imported with `@import "tailwindcss"`
  - custom theme variables and split-flap animation styles

## Before you deploy

1. Set your real URL in `app/layout.tsx` → `export const SITE_URL`.
   This is used for OG tags, the share links, and the X intent tweet links.
2. Push to GitHub and deploy on Vercel or another Next.js-compatible host.

## Notes

- No external API integrations are required.
- No database or storage layer is included.
- No authentication is required.
- The only server-side code is the Next.js edge OG image route.
