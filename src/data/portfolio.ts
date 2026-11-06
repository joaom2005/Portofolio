// ---------------------------------------------------------------------------
// ALL site content lives here. Everything marked TODO is a placeholder.
// Only keep what you can defend in an interview: a systems interviewer will
// ask about every line on this page.
//
// Language-neutral data (name, links, tags, repo URLs, image URLs) is defined
// once. Text that changes per language lives in `content` and `projectText`.
// Pages call getContent(lang) to get everything for one language.
// ---------------------------------------------------------------------------

import type { Lang } from '../i18n/ui';

export const site = {
  name: 'joaom',
  version: 'v0.1.0',
  github: 'https://github.com/joaom2005',
  email: 'joao.p.f.martins2005@proton.me',
};

export type ProcessState = 'running' | 'listening';

export interface Process {
  pid: string;
  id: 'about' | 'projects' | 'skills' | 'contact';
  state: ProcessState;
  desc: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  repo: string;
  // Replace with real screenshots/diagrams: one good, legible image beats three tiny ones.
  images: { src: string; alt: string }[];
  // What it is, concretely: size, scope, what you actually did.
  highlights: string[];
  // Shown only in Inspector mode: what broke, what you got wrong, what you learned.
  errata: string[];
}

export interface Content {
  title: string;
  description: string;
  // One résumé PDF per language. Put the files in public/files/.
  resume: string;
  processes: Process[];
  about: {
    headline: string;
    summary: string;
    facts: { k: string; v: string }[];
  };
  projects: Project[];
  skills: { group: string; items: string[] }[];
}

const ph = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}/0b1220/7aa2f7?text=${encodeURIComponent(text)}`;

// ---- projects: shared (language-neutral) part -------------------------------

const projectsShared = [
  {
    slug: 'project-one',
    tags: ['C', 'Linux'], // TODO
    repo: 'https://github.com/your-username/project-one', // TODO
    img: ph(900, 500, 'screenshot'),
  },
  {
    slug: 'project-two',
    tags: ['C++', 'Networking'], // TODO
    repo: 'https://github.com/your-username/project-two', // TODO
    img: ph(900, 500, 'diagram'),
  },
  {
    slug: 'project-three',
    tags: ['AVR', 'Embedded'], // TODO
    repo: 'https://github.com/your-username/project-three', // TODO
    img: ph(900, 500, 'photo / output'),
  },
];

// ---- projects: translatable text, keyed by slug -----------------------------

interface ProjectText {
  title: string;
  summary: string;
  imgAlt: string;
  highlights: string[];
  errata: string[];
}

const projectText: Record<Lang, Record<string, ProjectText>> = {
  en: {
    'project-one': {
      title: 'Project One (placeholder)', // TODO
      summary: 'One sentence: what it is and why it exists.', // TODO
      imgAlt: 'Placeholder screenshot',
      highlights: [
        'Concrete fact #1: what you built and how big it was.', // TODO
        'Concrete fact #2: a design decision and why.', // TODO
      ],
      errata: [
        'What broke, and how you found out.', // TODO
        'What you would do differently.', // TODO
      ],
    },
    'project-two': {
      title: 'Project Two (placeholder)', // TODO
      summary: 'One sentence: what it is and why it exists.', // TODO
      imgAlt: 'Placeholder diagram',
      highlights: ['Concrete fact #1.', 'Concrete fact #2.'], // TODO
      errata: ['What broke.', 'What you learned.'], // TODO
    },
    'project-three': {
      title: 'Project Three (placeholder)', // TODO
      summary: 'One sentence: what it is and why it exists.', // TODO
      imgAlt: 'Placeholder photo',
      highlights: ['Concrete fact #1.', 'Concrete fact #2.'], // TODO
      errata: ['What broke.', 'What you learned.'], // TODO
    },
  },
  pt: {
    'project-one': {
      title: 'Projeto Um (provisório)', // TODO
      summary: 'Uma frase: o que é e porque existe.', // TODO
      imgAlt: 'Captura de ecrã provisória',
      highlights: [
        'Facto concreto n.º 1: o que construíste e qual era a dimensão.', // TODO
        'Facto concreto n.º 2: uma decisão de design e o porquê.', // TODO
      ],
      errata: [
        'O que correu mal e como descobriste.', // TODO
        'O que farias de forma diferente.', // TODO
      ],
    },
    'project-two': {
      title: 'Projeto Dois (provisório)', // TODO
      summary: 'Uma frase: o que é e porque existe.', // TODO
      imgAlt: 'Diagrama provisório',
      highlights: ['Facto concreto n.º 1.', 'Facto concreto n.º 2.'], // TODO
      errata: ['O que correu mal.', 'O que aprendeste.'], // TODO
    },
    'project-three': {
      title: 'Projeto Três (provisório)', // TODO
      summary: 'Uma frase: o que é e porque existe.', // TODO
      imgAlt: 'Fotografia provisória',
      highlights: ['Facto concreto n.º 1.', 'Facto concreto n.º 2.'], // TODO
      errata: ['O que correu mal.', 'O que aprendeste.'], // TODO
    },
  },
};

const buildProjects = (lang: Lang): Project[] =>
  projectsShared.map((p) => {
    const t = projectText[lang][p.slug];
    return {
      slug: p.slug,
      title: t.title,
      summary: t.summary,
      tags: p.tags,
      repo: p.repo,
      images: [{ src: p.img, alt: t.imgAlt }],
      highlights: t.highlights,
      errata: t.errata,
    };
  });

// ---- everything else, per language ------------------------------------------

// TODO: only list what you could talk about for ten minutes.
const skillGroups = {
  en: [
    { group: 'Languages', items: ['C', 'C++'] },
    { group: 'Systems', items: ['Linux', 'AVR microcontrollers'] },
    { group: 'Networking', items: ['TCP/IP', 'Sockets'] },
  ],
  pt: [
    { group: 'Linguagens', items: ['C', 'C++'] },
    { group: 'Sistemas', items: ['Linux', 'Microcontroladores AVR'] },
    { group: 'Redes', items: ['TCP/IP', 'Sockets'] },
  ],
};

const content: Record<Lang, Omit<Content, 'projects' | 'skills'>> = {
  en: {
    title: 'joaom — Systems & Security Portfolio',
    description:
      'Software engineering student focused on low-level systems, embedded/IoT and security.',
    resume: '/files/Resume-en.pdf',
    // The "description" column is plain English on purpose, so a
    // non-technical recruiter can navigate without decoding the metaphor.
    processes: [
      { pid: '001', id: 'about', state: 'running', desc: 'Who I am' },
      { pid: '002', id: 'projects', state: 'running', desc: 'Systems & security work' },
      { pid: '003', id: 'skills', state: 'running', desc: 'C/C++, Linux, networking' }, // TODO keep in sync with skills
      { pid: '004', id: 'contact', state: 'listening', desc: 'Open to internships' },
    ],
    about: {
      headline: 'Systems, embedded and security.', // TODO
      // TODO: 2–3 honest sentences. What you build, what you are looking for.
      summary:
        'Software engineering student interested in low-level systems, embedded/IoT and security. I like understanding how things work underneath, and writing down what broke along the way.',
      facts: [
        { k: 'focus', v: 'low-level · embedded · security' },
        { k: 'looking for', v: 'internships' }, // TODO
        { k: 'languages', v: 'English, Portuguese' }, // TODO
      ],
    },
  },
  pt: {
    title: 'joaom — Portefólio de Sistemas e Segurança',
    description:
      'Estudante de engenharia informática focado em sistemas de baixo nível, embebidos/IoT e segurança.',
    resume: '/files/Resume-pt.pdf',
    processes: [
      { pid: '001', id: 'about', state: 'running', desc: 'Quem sou' },
      { pid: '002', id: 'projects', state: 'running', desc: 'Trabalho em sistemas e segurança' },
      { pid: '003', id: 'skills', state: 'running', desc: 'C/C++, Linux, redes' }, // TODO manter sincronizado com as competências
      { pid: '004', id: 'contact', state: 'listening', desc: 'Disponível para estágios' },
    ],
    about: {
      headline: 'Sistemas, embebidos e segurança.', // TODO
      // TODO: 2–3 frases honestas. O que constróis, o que procuras.
      summary:
        'Estudante de engenharia informática interessado em sistemas de baixo nível, embebidos/IoT e segurança. Gosto de perceber como as coisas funcionam por baixo e de registar o que correu mal pelo caminho.',
      facts: [
        { k: 'foco', v: 'baixo nível · embebidos · segurança' },
        { k: 'procuro', v: 'estágios' }, // TODO
        { k: 'línguas', v: 'inglês, português' }, // TODO
      ],
    },
  },
};

export const getContent = (lang: Lang): Content => ({
  ...content[lang],
  projects: buildProjects(lang),
  skills: skillGroups[lang],
});
