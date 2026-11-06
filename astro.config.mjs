import { defineConfig } from "astro/config";
import icon from "astro-icon";
// Single source of truth for languages: src/i18n/ui.ts
import { locales, defaultLang } from "./src/i18n/ui.ts";

export default defineConfig({
  // site: "https://your-domain.example", // optional: enables absolute hreflang links
  integrations: [icon()],
  i18n: {
    defaultLocale: defaultLang,
    locales,
    // default language at /, the others at /<code>/
    routing: { prefixDefaultLocale: false },
  },
});
