// ---------------------------------------------------------------------------
// UI strings (buttons, headings, labels). Site CONTENT (about, projects,
// skills, résumé path) lives in src/data/portfolio.ts.
//
// TO ADD A LANGUAGE (e.g. Japanese):
//   1. add one line to `languages` below       ('ja': name + flag)
//   2. add a `ja` block of UI strings below    (copy `en`, translate it)
//   3. add a `ja` block in src/data/portfolio.ts (content + résumé path)
//   4. drop public/files/Resume-ja.pdf
// The dropdown, the routing (/ja/) and astro.config.mjs pick it up by themselves.
// TypeScript fails the build if you do 1 but forget 2 or 3.
// ---------------------------------------------------------------------------

// One entry per language. `label` is the language's own name; `flag` is an
// astro-icon name from the circle-flags set (https://icon-sets.iconify.design/circle-flags/).
// Flags are countries, not languages: pick whichever you prefer (gb/us for English).
export const languages = {
  en: { label: 'English', flag: 'circle-flags:gb' },
  pt: { label: 'Português', flag: 'circle-flags:pt' },
} as const;

export type Lang = keyof typeof languages;
export const locales = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'en'; // served at /, the others at /<code>/

export const getLang = (l?: string): Lang =>
  (locales as string[]).includes(l ?? '') ? (l as Lang) : defaultLang;

const en = {
  skip: 'Skip to content',
  topbar: {
    portfolio: 'Portfolio',
    inspector: 'Inspector',
    on: 'ON',
    off: 'OFF',
    resume: 'Resume (PDF)',
    language: 'Language',
    siteTools: 'Site tools',
  },
  procs: {
    label: 'Sections',
    pid: 'PID',
    name: 'NAME',
    state: 'STATE',
    desc: 'DESCRIPTION',
    hint: 'Click a process to view details…',
  },
  viewer: {
    label: 'Section viewer',
    tabs: 'Open sections',
    empty: 'No open tabs. Select a process to open a section.',
  },
  projectsTitle: 'Systems & Security Work',
  skillsTitle: 'Skills',
  contactTitle: 'Contact',
  viewGithub: 'View on GitHub ↗',
  contactLead: 'Open to internships. The fastest way to reach me is email.',
  github: 'GitHub ↗',
  repo: 'Repo ↗',
  technologies: 'Technologies',
  errata: 'What broke / what I learned',
  status: {
    toggleInspector: 'Toggle Inspector',
    openResume: 'Open Résumé',
    getInTouch: 'Get in Touch',
  },
  // Strings used by src/scripts/portfolio.ts (passed to the browser as JSON).
  script: {
    on: 'ON',
    off: 'OFF',
    normalName: 'Normal mode:',
    inspectorName: 'Inspector mode:',
    normalText: 'Browse freely, or enable Inspector for more details.',
    inspectorText: 'Showing errata: what broke and what I learned.',
    closeTab: 'Close {id} tab',
  },
};

const pt: typeof en = {
  skip: 'Saltar para o conteúdo',
  topbar: {
    portfolio: 'Portefólio',
    inspector: 'Inspetor',
    on: 'LIGADO',
    off: 'DESLIGADO',
    resume: 'Currículo (PDF)',
    language: 'Idioma',
    siteTools: 'Ferramentas do site',
  },
  procs: {
    label: 'Secções',
    pid: 'PID',
    name: 'NOME',
    state: 'ESTADO',
    desc: 'DESCRIÇÃO',
    hint: 'Clica num processo para ver os detalhes…',
  },
  viewer: {
    label: 'Visualizador de secções',
    tabs: 'Secções abertas',
    empty: 'Nenhum separador aberto. Seleciona um processo para abrir uma secção.',
  },
  projectsTitle: 'Trabalho em Sistemas e Segurança',
  skillsTitle: 'Competências',
  contactTitle: 'Contacto',
  viewGithub: 'Ver no GitHub ↗',
  contactLead: 'Disponível para estágios. A forma mais rápida de me contactar é por email.',
  github: 'GitHub ↗',
  repo: 'Repositório ↗',
  technologies: 'Tecnologias',
  errata: 'O que correu mal / o que aprendi',
  status: {
    toggleInspector: 'Alternar Inspetor',
    openResume: 'Abrir Currículo',
    getInTouch: 'Contactar',
  },
  script: {
    on: 'LIGADO',
    off: 'DESLIGADO',
    normalName: 'Modo normal:',
    inspectorName: 'Modo inspetor:',
    normalText: 'Navega à vontade, ou ativa o Inspetor para mais detalhes.',
    inspectorText: 'A mostrar erratas: o que correu mal e o que aprendi.',
    closeTab: 'Fechar separador {id}',
  },
};

// Record<Lang, ...> makes TypeScript complain if a language in `languages`
// has no UI block here.
export const ui: Record<Lang, typeof en> = { en, pt };
