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

Everything lives in `src/data/portfolio.ts`. Anything marked `TODO` is a placeholder
(name links, email, projects, skills). Replace the placehold.co image URLs with real
screenshots in `public/` or `src/assets/`. Put your résumé at `public/resume.pdf`.

## Structure

- `src/pages/index.astro` – the page (4 "process" sections)
- `src/components/` – TopBar, ProcessTable, ProjectCard, StatusBar
- `src/scripts/portfolio.ts` – section switching, Inspector toggle, keyboard shortcuts
- `src/styles/main.scss` – theme tokens at the top (`:root`), layout below

## Behaviour

- Click a row (or press `1`–`4`) to switch sections; the URL hash is kept in sync.
- `I` toggles Inspector (state saved in localStorage). Right now it reveals the
  "errata" block on each project. Define what it should do before you build more.
- `R` opens the résumé.
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
