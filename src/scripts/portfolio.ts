
// Tiny client script: section switching, Inspector toggle, keyboard shortcuts.
// No framework. Without JS the page still works: every section is shown stacked.

const IDS = ['about', 'projects', 'skills', 'contact'] as const;
type Id = (typeof IDS)[number];

const panels = document.querySelectorAll<HTMLElement>('[data-panel]');
const rows = document.querySelectorAll<HTMLElement>('[data-proc]');

const tabList = document.querySelector<HTMLElement>('[data-tab-list]');
const emptyState = document.querySelector<HTMLElement>('[data-tab-empty]');

const toggles = document.querySelectorAll<HTMLElement>(
  '[data-inspector-toggle], [data-inspector-toggle-key]',
);
const mainToggle = document.querySelector<HTMLElement>('[data-inspector-toggle]');
const inspectorLabel = document.querySelector<HTMLElement>('[data-inspector-label]');
const modeName = document.querySelector<HTMLElement>('[data-mode-name]');
const modeText = document.querySelector<HTMLElement>('[data-mode-text]');
const resume = document.querySelector<HTMLAnchorElement>('[data-resume]');
const langMenu = document.querySelector<HTMLDetailsElement>('[data-lang-menu]');
const langLinks = document.querySelectorAll<HTMLAnchorElement>('[data-lang-link]');

// UI strings for the current language, put on <body data-ui> by Base.astro.
type UiStrings = {
  on: string;
  off: string;
  normalName: string;
  inspectorName: string;
  normalText: string;
  inspectorText: string;
  closeTab: string;
  toLight: string;
  toDark: string;
};
const ui: UiStrings = JSON.parse(document.body.dataset.ui ?? '{}');

// Keep the open section when switching language: /#projects <-> /pt/#projects.
function syncLangSwitch(): void {
  langLinks.forEach((a) => {
    a.hash = location.hash;
  });
}

// Language dropdown: it opens/closes on its own (<details>); close it on an
// outside click or Escape.
document.addEventListener('click', (e) => {
  if (langMenu?.open && !langMenu.contains(e.target as Node)) langMenu.open = false;
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && langMenu?.open) {
    langMenu.open = false;
    langMenu.querySelector('summary')?.focus();
  }
});

const isId = (v: string): v is Id =>
  (IDS as readonly string[]).includes(v);

// ---- sections ---------------------------------------------------------------

// ---- tabs -------------------------------------------------------------------

type Tab = {
  id: Id;
};

let tabs: Tab[] = [];
let activeTabId: Id | null = null;
let draggedTabId: Id | null = null;

function updateHash(id: Id | null): void {
  const hash = id ? `#${id}` : '';
  history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
  syncLangSwitch();
}

function updateActiveSection(): void {
  panels.forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panel === activeTabId);
  });

  rows.forEach((row) => {
    const active = row.dataset.proc === activeTabId;

    row.classList.toggle('is-active', active);
    row.querySelector('a')?.setAttribute(
      'aria-current',
      active ? 'page' : 'false',
    );
  });

  if (emptyState) {
    emptyState.hidden = activeTabId !== null;
  }
}

function renderTabs(): void {
  if (!tabList) return;

  tabList.replaceChildren();

  tabs.forEach((tab) => {
    const pid = String(IDS.indexOf(tab.id) + 1).padStart(3, '0');
    const active = tab.id === activeTabId;

    const container = document.createElement('div');
    container.className = 'tab';
    container.classList.toggle('is-active', active);
    container.draggable = true;
    container.dataset.tabId = tab.id;

    // Start dragging this tab.
    container.addEventListener('dragstart', (e) => {
      draggedTabId = tab.id;
      container.classList.add('is-dragging');

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tab.id);
      }
    });

    // Allow other tabs to receive the dragged tab.
    container.addEventListener('dragover', (e) => {
      e.preventDefault();

      if (!draggedTabId || draggedTabId === tab.id) return;

      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }

      container.classList.add('is-drop-target');
    });

    container.addEventListener('dragleave', () => {
      container.classList.remove('is-drop-target');
    });

    // Clean up drag styling.
    container.addEventListener('dragend', () => {
      draggedTabId = null;

      tabList.querySelectorAll('.tab').forEach((element) => {
        element.classList.remove('is-dragging', 'is-drop-target');
      });
    });

    // Drop onto another tab: insert before the target.
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const sourceId = draggedTabId;
      if (!sourceId || sourceId === tab.id) return;

      const fromIndex = tabs.findIndex((item) => item.id === sourceId);
      const toIndex = tabs.findIndex((item) => item.id === tab.id);

      if (fromIndex === -1 || toIndex === -1) return;

      const [movedTab] = tabs.splice(fromIndex, 1);

      const insertionIndex = fromIndex < toIndex
        ? toIndex - 1
        : toIndex;

      tabs.splice(insertionIndex, 0, movedTab);

      draggedTabId = null;
      renderTabs();
    });

    // Select tab.
    const selectButton = document.createElement('button');
    selectButton.className = 'tab__select';
    selectButton.type = 'button';
    selectButton.id = `tab-${tab.id}`;
    selectButton.setAttribute('role', 'tab');
    selectButton.setAttribute('aria-selected', String(active));
    selectButton.setAttribute('aria-controls', `panel-${tab.id}`);
    selectButton.textContent = `PID ${pid} – ${tab.id}`;

    selectButton.addEventListener('click', () => {
      activateTab(tab.id);
    });

    // Close tab.
    const closeButton = document.createElement('button');
    closeButton.className = 'tab__close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', ui.closeTab.replace('{id}', tab.id));
    closeButton.textContent = '×';

    closeButton.addEventListener('click', () => {
      closeTab(tab.id);
    });

    container.append(selectButton, closeButton);
    tabList.append(container);
  });
}

// The tab bar itself handles drops on empty space.
// This allows moving a tab to the last position.
if (tabList) {
  tabList.addEventListener('dragover', (e) => {
    if (!draggedTabId) return;

    e.preventDefault();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  });

  tabList.addEventListener('drop', (e) => {
    // Individual tabs handle their own drops.
    if (e.target instanceof Element && e.target.closest('.tab')) {
      return;
    }

    e.preventDefault();

    const sourceId = draggedTabId;
    if (!sourceId) return;

    const fromIndex = tabs.findIndex((tab) => tab.id === sourceId);
    if (fromIndex === -1) return;

    const [movedTab] = tabs.splice(fromIndex, 1);
    tabs.push(movedTab);

    draggedTabId = null;
    renderTabs();
  });
}

function activateTab(id: Id, updateUrl = true): void {
  // A section can only have one open tab.
  if (!tabs.some((tab) => tab.id === id)) return;

  activeTabId = id;

  renderTabs();
  updateActiveSection();

  if (updateUrl) updateHash(id);
}

function openTab(id: Id, updateUrl = true): void {
  // Don't create duplicates. Just focus the existing tab.
  if (!tabs.some((tab) => tab.id === id)) {
    tabs.push({ id });
  }

  activateTab(id, updateUrl);
}

function closeTab(id: Id): void {
  const index = tabs.findIndex((tab) => tab.id === id);
  if (index === -1) return;

  const wasActive = activeTabId === id;

  tabs.splice(index, 1);

  if (wasActive) {
    // Prefer the tab to the left, otherwise the first remaining tab.
    activeTabId = tabs[index - 1]?.id ?? tabs[0]?.id ?? null;
  }

  renderTabs();
  updateActiveSection();

  if (wasActive) {
    updateHash(activeTabId);
  }
}

function fromHash(): Id {
  const hash = location.hash.replace('#', '');
  return isId(hash) ? hash : 'about';
}

// Clicking a process link opens or focuses its tab.
document.querySelectorAll<HTMLAnchorElement>('[data-proc-link]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();

    const id = a.dataset.procLink ?? '';
    if (isId(id)) openTab(id);
  });
});

// Clicking anywhere on the process row works too.
rows.forEach((row) => {
  row.addEventListener('click', () => {
    const id = row.dataset.proc ?? '';
    if (isId(id)) openTab(id);
  });
});

// Handle navigation through browser history.
window.addEventListener('hashchange', () => {
  openTab(fromHash(), false);
});

// ---- inspector --------------------------------------------------------------

const KEY = 'portfolio:inspector';
let inspector = false;

function setInspector(on: boolean): void {
  inspector = on;
  document.documentElement.classList.toggle('inspector', on);
  mainToggle?.setAttribute('aria-pressed', String(on));

  if (inspectorLabel) inspectorLabel.textContent = on ? ui.on : ui.off;
  if (modeName) modeName.textContent = on ? ui.inspectorName : ui.normalName;

  if (modeText) {
    modeText.textContent = on ? ui.inspectorText : ui.normalText;
  }

  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    // Storage can be unavailable (private mode); the toggle still works.
  }
}

toggles.forEach((t) => {
  t.addEventListener('click', () => setInspector(!inspector));
});

// ---- theme ------------------------------------------------------------------
// The first value is set before paint by the inline script in Base.astro (saved
// choice, else the system setting). Here we only handle changes.

const THEME_KEY = 'portfolio:theme';
type Theme = 'light' | 'dark';

const themeToggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const systemLight = matchMedia('(prefers-color-scheme: light)');

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

function applyTheme(theme: Theme, save: boolean): void {
  document.documentElement.dataset.theme = theme;

  // The button describes what a click will do.
  const label = theme === 'dark' ? ui.toLight : ui.toDark;
  themeToggle?.setAttribute('aria-label', label);
  themeToggle?.setAttribute('title', label);

  if (!save) return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the toggle still works.
  }
}

const toggleTheme = (): void =>
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);

themeToggle?.addEventListener('click', toggleTheme);

// If the visitor never picked a theme, keep following the system setting live.
systemLight.addEventListener('change', (e) => {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch {
    // ignore
  }
  if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'light' : 'dark', false);
});

applyTheme(currentTheme(), false); // sync the button label with the initial theme

// ---- keyboard ---------------------------------------------------------------

window.addEventListener('keydown', (e) => {
  const t = e.target as HTMLElement | null;

  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) {
    return;
  }

  // Close the active tab.
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
    if (!activeTabId) return;

    e.preventDefault();
    closeTab(activeTabId);
    return;
  }

  // Cycle through open tabs.
  if ((e.ctrlKey || e.metaKey) && e.key === 'Tab') {
    e.preventDefault();

    if (tabs.length < 2 || !activeTabId) return;

    const index = tabs.findIndex((tab) => tab.id === activeTabId);
    const nextIndex = e.shiftKey
      ? (index - 1 + tabs.length) % tabs.length
      : (index + 1) % tabs.length;

    activateTab(tabs[nextIndex].id);
    return;
  }

  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const k = e.key.toLowerCase();

  if (k === 'i') {
    setInspector(!inspector);
  } else if (k === 't') {
    toggleTheme();
  } else if (k === 'r' && resume) {
    window.open(resume.href, '_blank', 'noopener');
  } else if (k >= '1' && k <= '4') {
    openTab(IDS[Number(k) - 1]);
  }
});

// ---- init -------------------------------------------------------------------

openTab(fromHash(), false);
syncLangSwitch();

try {
  setInspector(localStorage.getItem(KEY) === '1');
} catch {
  setInspector(false);
}
