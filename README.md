# Uye

A polished Next.js starter for an English-learning website. It uses TypeScript, Tailwind CSS v4, and a small component architecture that is ready for the final copy and imagery.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
app/                  # Routes, global styles, and metadata
pages/                # Pages Router route (login)
components/
  layout/             # Site-level composition (header, footer)
  sections/           # Page sections composed from UI primitives
    hero/              # Hero-only composition pieces
  auth/               # Shared authentication shell and form
  ui/                 # Reusable, presentational building blocks
content/              # Page copy and navigation data
lib/                  # Small shared utilities
public/               # Static images and brand assets
```

## Updating the hero

All current placeholder copy lives in `content/home.ts`. Replace the strings there when the final text arrives. The hero is intentionally split into a section shell (`components/sections/hero-section.tsx`) and its lesson-card presentation (`components/sections/hero/lesson-preview.tsx`); this keeps page data and UI composition independent. Add final hero imagery to `public/` and use it from the section with `next/image` when needed.

The existing small PNGs in `public/` are palette references. The initial theme tokens are based on them: navy `#010E36`, blue `#3D72FB`, light gray `#F4F4F4`, and white `#FFFFFF`.

## Checks

```bash
npm run lint
npm run build
```

## First commit

```bash
git add .
git commit -m "chore: initialize Uye landing page"
```
