# Portfolio (Astro)

Static site. No UI framework, one small TypeScript file for interactivity.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs static files to dist/
npm run preview  # serve the built site locally
```

## Edit content

Content lives in `src/data/portfolio.ts` (text per language in `content`, `projectText` and
`skillGroups`; shared things like links, tags and repo URLs once at the top). UI labels live in
`src/i18n/ui.ts`. Anything marked `TODO` is a placeholder. Replace the placehold.co image URLs
with real screenshots in `public/` or `src/assets/`.

## Theme

Light and dark, switched with the sun/moon button in the top bar (or `T`). First visit follows the
system setting; after a manual choice that choice is saved in localStorage and wins. The colors are
the tokens at the top of `src/styles/main.scss`; all text pairs were checked against WCAG AA (4.5:1).
To tweak the white theme, edit the `light-theme` mixin there.

## Languages

English is served at `/` and every other language at `/<code>/` (e.g. `/pt/`), chosen from a
dropdown with flags in the top bar. Each language has its own résumé PDF in `public/files/`
(`Resume-en.pdf`, `Resume-pt.pdf`, ...; the paths are set per language in `portfolio.ts`).

To add a language (e.g. Japanese, `ja`):

1. `src/i18n/ui.ts`: add a line to `languages` (name + flag from the circle-flags set).
2. `src/i18n/ui.ts`: add a `ja` block of UI strings (copy `en`, translate).
3. `src/data/portfolio.ts`: add a `ja` block per language table (content, résumé path, projects, skills).
4. Add `public/files/Resume-ja.pdf`.

The dropdown, the `/ja/` page and the Astro config pick it up automatically, and TypeScript
fails the build if a step is missing. Note that the JetBrains Mono font has no Japanese glyphs,
so Japanese text falls back to a system font.

## Structure

- `src/pages/index.astro` (default language) and `src/pages/[lang]/index.astro` (all others) – both render `src/components/Portfolio.astro` (4 "process" sections)
- `src/i18n/ui.ts` – UI strings per language
- `src/components/` – TopBar, LangSwitcher, ProcessTable, ProjectCard, StatusBar
- `src/scripts/portfolio.ts` – section switching, Inspector toggle, keyboard shortcuts
- `src/styles/main.scss` – theme tokens at the top (dark in `:root`, light in the `light-theme` mixin), layout below

## Behaviour

- Click a row (or press `1`–`4`) to switch sections; the URL hash is kept in sync.
- `I` toggles Inspector (state saved in localStorage). Right now it reveals the
  "errata" block on each project. Define what it should do before you build more.
- `R` opens the résumé for the current language.
- `T` switches between the light and dark theme.
- Without JavaScript all sections render stacked, so the content stays readable.
- Under 860px wide the layout becomes one column and the process table collapses.

## Deploy (Docker + nginx, for the old PC)

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```
