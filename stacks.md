# daysago Stack

## What this project is

A minimal Next.js web app that answers the viral prompt "2020 was how many days ago?" with:
- a live, ticking split-flap hero counter,
- a set of preloaded reference shockers,
- a generator that creates shareable cards and X tweet links,
- on-the-fly OG image rendering via a Next.js edge route.

## Core stack

- `next` 16.2.10
- `react` 19.2.4
- `react-dom` 19.2.4
- `typescript` 5
- `eslint` 9 + `eslint-config-next` 16.2.10
- `tailwindcss` 4 + `@tailwindcss/postcss`
- `html-to-image` for client-side PNG card export

## App architecture

### Routing

- `app/layout.tsx`
  - root layout using `next/font/google`
  - exports `SITE_URL` used for share links and dynamic metadata
- `app/page.tsx`
  - Compose page sections: `HeroCounter`, `ShockerRow`, `Generator`
  - `generateMetadata` reads `?label=&date=` from search params and builds dynamic Open Graph metadata

### Dynamic OG image generation

- `app/api/og/route.tsx`
  - edge runtime route using `next/og`
  - generates a social preview image from query data
  - supports explicit `days` override for anchored hero share cards

### Components

- `components/FlipDigit.tsx`
  - client component for one split-flap digit
  - animates a 3D flip on value changes
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

### Shared logic

- `lib/dates.ts`
  - `anchoredValue()` for the main hero counter
  - `elapsedSince()` for calculated days/hours/minutes/seconds
  - `formatDayLabel()` and `padDigits()` utility helpers
  - static `SHOCKERS` array for preloaded reference events

### Styling

- `app/globals.css`
  - Tailwind CSS imported with `@import "tailwindcss"`
  - custom theme variables for `--ink`, `--board`, `--bone`, `--amber`, `--slate`
  - responsive layout and split-flap animation styles
  - reduced-motion support disables flip animations when requested

## Build and developer tooling

- `npm` / `package-lock.json`
- `next dev` / `next build` / `next start`
- `eslint` configured through `eslint-config-next`
- TypeScript project configured via `tsconfig.json`

## Deployment notes

- App is designed to deploy as a Next.js app, e.g. Vercel.
- `SITE_URL` in `app/layout.tsx` must be updated to the production URL for correct OG previews and shared link behavior.
- No server-side database or external backend is required beyond the Next.js edge OG route.

## AI / prompt-engineering attribution

- Prompt engineering for this project was authored by Mojeeb Titilayo.
- Optimized by Claude.

## What is not present in this repo

- no external API integrations
- no database or storage layer
- no authentication
- no vector database or LLM inference service
- no serverless function beyond the Next.js edge OG route
