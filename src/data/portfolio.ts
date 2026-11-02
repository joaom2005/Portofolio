// ---------------------------------------------------------------------------
// ALL site content lives here. Everything marked TODO is a placeholder.
// Only keep what you can defend in an interview: a systems interviewer will
// ask about every line on this page.
// ---------------------------------------------------------------------------

export const site = {
  name: 'joaom',
  version: 'v0.1.0',
  title: 'joaom — Systems & Security Portfolio',
  description:
    'Software engineering student focused on low-level systems, embedded/IoT and security.',
  github: 'https://github.com/joaom2005',
  email: 'joao.p.f.martins2005@proton.me',
  resume: '/resume.pdf', // TODO: drop your PDF into /public/resume.pdf
};

export type ProcessState = 'running' | 'listening';

export interface Process {
  pid: string;
  id: 'about' | 'projects' | 'skills' | 'contact';
  state: ProcessState;
  desc: string;
}

// Section list. The "description" column is plain English on purpose, so a
// non-technical recruiter can navigate without decoding the metaphor.
export const processes: Process[] = [
  { pid: '001', id: 'about', state: 'running', desc: 'Who I am' },
  { pid: '002', id: 'projects', state: 'running', desc: 'Systems & security work' },
  { pid: '003', id: 'skills', state: 'running', desc: 'C/C++, Linux, networking' }, // TODO keep in sync with skills below
  { pid: '004', id: 'contact', state: 'listening', desc: 'Open to internships' },
];

export const about = {
  headline: 'Systems, embedded and security.', // TODO
  // TODO: 2–3 honest sentences. What you build, what you are looking for.
  summary:
    'Software engineering student interested in low-level systems, embedded/IoT and security. I like understanding how things work underneath, and writing down what broke along the way.',
  facts: [
    { k: 'focus', v: 'low-level · embedded · security' },
    { k: 'looking for', v: 'internships' }, // TODO
    { k: 'languages', v: 'English, Portuguese' }, // TODO
  ],
};

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

const ph = (w: number, h: number, text: string) =>
  `https://placehold.co/${w}x${h}/0b1220/7aa2f7?text=${encodeURIComponent(text)}`;

export const projects: Project[] = [
  {
    slug: 'project-one',
    title: 'Project One (placeholder)', // TODO
    summary: 'One sentence: what it is and why it exists.', // TODO
    tags: ['C', 'Linux'], // TODO
    repo: 'https://github.com/your-username/project-one', // TODO
    images: [{ src: ph(900, 500, 'screenshot'), alt: 'Placeholder screenshot' }],
    highlights: [
      'Concrete fact #1: what you built and how big it was.', // TODO
      'Concrete fact #2: a design decision and why.', // TODO
    ],
    errata: [
      'What broke, and how you found out.', // TODO
      'What you would do differently.', // TODO
    ],
  },
  {
    slug: 'project-two',
    title: 'Project Two (placeholder)', // TODO
    summary: 'One sentence: what it is and why it exists.', // TODO
    tags: ['C++', 'Networking'], // TODO
    repo: 'https://github.com/your-username/project-two', // TODO
    images: [{ src: ph(900, 500, 'diagram'), alt: 'Placeholder diagram' }],
    highlights: ['Concrete fact #1.', 'Concrete fact #2.'], // TODO
    errata: ['What broke.', 'What you learned.'], // TODO
  },
  {
    slug: 'project-three',
    title: 'Project Three (placeholder)', // TODO
    summary: 'One sentence: what it is and why it exists.', // TODO
    tags: ['AVR', 'Embedded'], // TODO
    repo: 'https://github.com/your-username/project-three', // TODO
    images: [{ src: ph(900, 500, 'photo / output'), alt: 'Placeholder photo' }],
    highlights: ['Concrete fact #1.', 'Concrete fact #2.'], // TODO
    errata: ['What broke.', 'What you learned.'], // TODO
  },
];

// TODO: only list what you could talk about for ten minutes.
export const skills = [
  { group: 'Languages', items: ['C', 'C++'] },
  { group: 'Systems', items: ['Linux', 'AVR microcontrollers'] },
  { group: 'Networking', items: ['TCP/IP', 'Sockets'] },
];
