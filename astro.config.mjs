import { defineConfig } from 'astro/config';

// Fully static output: the built site is plain HTML/CSS/JS that any web server
// (nginx in a Docker container on your old PC, for example) can serve.
export default defineConfig({
  // site: 'https://your-domain.tld',
});
