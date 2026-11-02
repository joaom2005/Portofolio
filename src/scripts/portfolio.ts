// Tiny client script: section switching, Inspector toggle, keyboard shortcuts.
// No framework. Without JS the page still works: every section is shown stacked.

const IDS = ['about', 'projects', 'skills', 'contact'] as const;
type Id = (typeof IDS)[number];

const panels = document.querySelectorAll<HTMLElement>('[data-panel]');
const rows = document.querySelectorAll<HTMLElement>('[data-proc]');
const tabLabel = document.querySelector<HTMLElement>('[data-tab-label]');
const toggles = document.querySelectorAll<HTMLElement>(
  '[data-inspector-toggle], [data-inspector-toggle-key]',
);
const mainToggle = document.querySelector<HTMLElement>('[data-inspector-toggle]');
const inspectorLabel = document.querySelector<HTMLElement>('[data-inspector-label]');
const modeName = document.querySelector<HTMLElement>('[data-mode-name]');
const modeText = document.querySelector<HTMLElement>('[data-mode-text]');
const resume = document.querySelector<HTMLAnchorElement>('[data-resume]');

const isId = (v: string): v is Id => (IDS as readonly string[]).includes(v);

// ---- sections ---------------------------------------------------------------
function show(id: Id, updateHash = true): void {
  panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
  rows.forEach((r) => {
    const on = r.dataset.proc === id;
    r.classList.toggle('is-active', on);
    r.querySelector('a')?.setAttribute('aria-current', on ? 'page' : 'false');
  });
  const pid = String(IDS.indexOf(id) + 1).padStart(3, '0');
  if (tabLabel) tabLabel.textContent = `PID ${pid} – ${id}`;
  if (updateHash) history.replaceState(null, '', `#${id}`);
}

function fromHash(): Id {
  const h = location.hash.replace('#', '');
  return isId(h) ? h : 'about';
}

document.querySelectorAll<HTMLAnchorElement>('[data-proc-link]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.dataset.procLink ?? '';
    if (isId(id)) show(id);
  });
});
// Clicking anywhere on the row works too.
rows.forEach((r) =>
  r.addEventListener('click', () => {
    const id = r.dataset.proc ?? '';
    if (isId(id)) show(id);
  }),
);
window.addEventListener('hashchange', () => show(fromHash(), false));

// ---- inspector --------------------------------------------------------------
const KEY = 'portfolio:inspector';
let inspector = false;

function setInspector(on: boolean): void {
  inspector = on;
  document.documentElement.classList.toggle('inspector', on);
  mainToggle?.setAttribute('aria-pressed', String(on));
  if (inspectorLabel) inspectorLabel.textContent = on ? 'ON' : 'OFF';
  if (modeName) modeName.textContent = on ? 'Inspector mode:' : 'Normal mode:';
  if (modeText) {
    modeText.textContent = on
      ? 'Showing errata: what broke and what I learned.'
      : 'Browse freely, or enable Inspector for more details.';
  }
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* storage can be unavailable (private mode); the toggle still works */
  }
}

toggles.forEach((t) => t.addEventListener('click', () => setInspector(!inspector)));

// ---- keyboard ---------------------------------------------------------------
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;

  const k = e.key.toLowerCase();
  if (k === 'i') setInspector(!inspector);
  else if (k === 'r' && resume) window.open(resume.href, '_blank', 'noopener');
  else if (k >= '1' && k <= '4') show(IDS[Number(k) - 1]);
});

// ---- init -------------------------------------------------------------------
show(fromHash(), false);
try {
  setInspector(localStorage.getItem(KEY) === '1');
} catch {
  setInspector(false);
}
