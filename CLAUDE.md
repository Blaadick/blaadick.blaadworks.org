@AGENTS.md

# blaadick.blaadworks.org

Personal site of Blaadick: a home page plus assorted fun stuff (toys, experiments, small pages). Built with Astro.

- Domain: https://blaadick.blaadworks.org
- Hosting: self-hosted on my home server. I handle deployment myself; don't touch the server or deploy anything.
- Site content language: English (for now). The language toggle (`system`/`en`/`ru`, `localStorage` `language`) only sets `<html lang>`; there are no translations yet.

## Stack

- Astro 7 (`astro` is the only dependency), static output by default; `astro.config.mjs` only sets `site`.
- TypeScript in strict mode (`astro/tsconfigs/strict`).
- Plain scoped `<style>` inside `.astro` components; no CSS framework, no UI framework integration yet.
- Package manager: npm (`package-lock.json`). Node >= 22.23.4.

## Commands

- `npm run dev` / `astro dev --background` — dev server at http://localhost:4321 (see AGENTS.md for background mode).
- `npm run build` — build to `dist/`.
- `npm run preview` — serve the built site.
- `npx astro check` — type-check `.astro`/`.ts` files (needs `@astrojs/check`, not installed yet; ask before adding it).
- Run `npm run build` after changes to make sure the site still builds.

## Layout

- `src/pages/` — file-based routes; every `.astro`/`.md` file here is a page.
- `src/layouts/Layout.astro` — base HTML shell (`<head>`, global `html, body` styles).
- `src/components/` — reusable components.
- `src/scripts/` — shared client-side TypeScript helpers.
- `src/assets/` — images/SVGs processed by Astro (imported in components).
- `public/` — files served as-is (favicons, etc.).

`Layout.astro` renders on every page: all backgrounds, and the bottom-right `.controls` with `SettingsMenu.astro`: a settings button that slides up a column of toggles (bottom to top: `BackgroundToggle.astro`, `ThemeToggle.astro`, `LanguageToggle.astro`). Each toggle cycles its states via `setupCycleToggle` (`src/scripts/cycle-toggle.ts`): stores the state in `localStorage`, shows the matching `[data-icon]` (Lucide icons, inlined) and applies it. All buttons are styled by the global `.control` class for shape and `.button` for look. `.button` (global, in `Layout.astro`) is the shared monochrome button style with hover and pressed steps (`.pressed` is set by the head script on left-button press only, so right-click does not look pressed); the card's Open link uses it too. `README.md` is still the starter template's.

## Backgrounds

- Switchable, one visible at a time: `StreaksBackground.astro` (WebGL falling streaks), `DotsBackground.astro` (dot grid; dots near the pointer are pushed away, pointer tracked on `window` with easing) and `TunnelBackground.astro` (perspective grid tunnel, stretched to the window so it always frames the same way, with an accent scan band sweeping into depth every few seconds; lines use `--fg` and the scan recolors only the lines to `--streak` at the same 50% strength as the other backgrounds, read via `readColor(canvas, 'outline-color')`). All use `createFullscreenShader`/`readColor` from `src/scripts/fullscreen-shader.ts`.
- The active one is `data-background` on `<html>`, stored in `localStorage` (`background`, default `streaks`) and set by the inline script in `<head>`. The cycle order is `BACKGROUNDS` in `BackgroundToggle.astro`.
- Each background hides itself with `:global(:root:not([data-background='<name>']))`, skips rendering while hidden (`checkVisibility()`), and draws a single static frame under `prefers-reduced-motion`.
- To add one: new component in `src/components/`, render it in `Layout.astro`, add its name to `BACKGROUNDS`.

## Theming

- Light and dark themes: `system` (follows `prefers-color-scheme`), `dark`, `light`, stored in `localStorage` (`theme`). A manual choice sets `data-theme` on `<html>` (head script applies it before paint), which forces `color-scheme`.
- Colors are CSS variables in `Layout.astro` defined with `light-dark()`: `--bg`, `--fg`, `--accent` (purple), `--streak` (background streak color; its alpha balances streak visibility between themes). Use them instead of hardcoded colors.
- Streaks and dots are colored with `--streak`; backgrounds read their colors from computed styles of their canvas and update on theme change.

## Conventions

- Indentation: tabs in `.astro`, `.mjs`, `.ts`; single quotes in scripts — match the existing files.
- One page = one file in `src/pages/`; shared chrome goes into `Layout.astro`, not copied between pages.
- Prefer Astro components and plain client-side `<script>` for interactive toys. Add a UI framework or integration (`astro add ...`) only when I ask for it.
- No new npm dependencies without asking.
- Images used by components go into `src/assets/` and are imported; only truly static files go into `public/`.
