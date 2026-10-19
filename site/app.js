/**
 * MotionSites gallery
 * One source of truth: projects.json. Preview screenshots are published only
 * when the capture pipeline has actually built and verified the demos.
 * No frontend build step, runtime dependencies, or analytics required.
 */
const $ = (selector) => document.querySelector(selector);
const grid = $('#grid');
const search = $('#search');
const counter = $('#counter');
const empty = $('#empty');
const status = $('#gallery-status');
const buttons = [...document.querySelectorAll('.chip')];
const demoOnly = $('#demo-only');
const demoDialog = $('#demo-dialog');
const demoFrame = $('#demo-frame');
const demoTitle = $('#demo-dialog-title');
const demoFull = $('#demo-full');
const demoSource = $('#demo-source');
const demoClose = $('#demo-close');
const reset = $('#reset-filters');
const share = $('#share-view');
const shareStatus = $('#share-status');
const tags = new Set(['All', ...buttons.map(button => button.dataset.tag)]);

let projects = [];
let captures = new Map();
let active = 'All';
let showDemosOnly = false;

const escapeHTML = value =>
  String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
const pad = number => String(number).padStart(2, '0');
const sourceURL = project =>
  'https://github.com/Jackxiaozhiren/MotionSites/tree/main/' +
  project.path.split('/').map(encodeURIComponent).join('/');
const gradients = ['#54397f', '#145e73', '#733c64', '#55406b', '#29535b', '#7c523b', '#5e485c', '#26535b'];
// Browsers can fail to load an image even when CI published a manifest.
// Never leave a broken-image icon under a label claiming a real screenshot.
grid.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const cover = image.closest('.cover--photo');
  if (!cover) return;
  const card = image.closest('.card');
  const title = card?.querySelector('h3')?.textContent || 'Project preview';
  const fallback = document.createElement('div');
  fallback.className = 'cover cover--concept';
  fallback.style.setProperty('--a', '#4f385d');
  const kicker = document.createElement('span');
  kicker.className = 'concept-kicker';
  kicker.textContent = 'PREVIEW UNAVAILABLE';
  const name = document.createElement('strong');
  name.className = 'concept-title';
  name.textContent = title;
  const label = document.createElement('span');
  label.className = 'cover-note';
  label.textContent = 'Screenshot failed to load · Try live demo';
  fallback.append(kicker, name, label);
  cover.replaceWith(fallback);
}, true);


const conceptCover = project => `<div class="cover cover--concept" style="--a:${gradients[project.id % gradients.length]}">
  <span class="concept-kicker">MOTION / ${pad(project.id)}</span>
  <strong class="concept-title">${escapeHTML(project.title)}</strong>
  <span class="cover-note">Concept artwork · not a screenshot</span>
</div>`;

const photoCover = (project, capture) => `<div class="cover cover--photo">
  <img loading="lazy" decoding="async" width="480" height="280"
    src="${capture.image}" alt="Screenshot captured from the running ${escapeHTML(project.title)} project">
  <span class="cover-note">Actual project screenshot</span>
</div>`;

function readURLState() {
  const params = new URL(location.href).searchParams;
  const tag = params.get('stack');
  active = tag && tags.has(tag) ? tag : 'All';
  search.value = (params.get('q') || '').slice(0, 120);
  showDemosOnly = params.get('demos') === '1';
  demoOnly.checked = showDemosOnly;
}

function syncURL() {
  const url = new URL(location.href);
  ['stack', 'q', 'demos'].forEach(name => url.searchParams.delete(name));
  if (active !== 'All') url.searchParams.set('stack', active);
  if (search.value.trim()) url.searchParams.set('q', search.value.trim());
  if (showDemosOnly) url.searchParams.set('demos', '1');
  history.replaceState(null, '', url);
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tag === active)));
  const shown = projects
    .filter(project =>
      (active === 'All' || project.tag === active) &&
      (!showDemosOnly || captures.has(project.id)) &&
      [project.title, project.tag, project.path].some(field => field.toLocaleLowerCase().includes(query)))
    .sort((a, b) => Number(captures.has(b.id)) - Number(captures.has(a.id)) || a.id - b.id);

  counter.textContent = `${shown.length} of ${projects.length} projects · ${captures.size} verified live demos`;
  grid.innerHTML = shown.map(project => {
    const capture = captures.get(project.id);
    const link = capture ? capture.demo : sourceURL(project);
    const cover = capture ? photoCover(project, capture) : conceptCover(project);
    const badge = capture
      ? '<span class="project-badge">Live demo</span>'
      : '<span class="project-badge project-badge--neutral">Source only</span>';
    const demoAction = capture
      ? `<button type="button" class="open open--preview" data-preview-id="${project.id}">Preview here ↗<span class="sr-only"> — ${escapeHTML(project.title)}</span></button>
        <a class="open open--demo" target="_blank" rel="noopener noreferrer" href="${capture.demo}">Full demo ↗</a>`
      : '';
    return `<article class="card">
      <a class="cover-link" target="_blank" rel="noopener noreferrer" href="${link}">${cover}</a>
      <div class="info">
        <div class="card-eyebrow"><span class="num">PROJECT ${pad(project.id)}</span>${badge}</div>
        <h3>${escapeHTML(project.title)}</h3>
        <div class="meta">${escapeHTML(project.tag)}</div>
        <div class="card-actions">${demoAction}
          <a class="open" target="_blank" rel="noopener noreferrer"
            href="${sourceURL(project)}">View source ↗</a>
          <a class="open open--guide" href="project.html?id=${project.id}" aria-label="Code notes for ${escapeHTML(project.title)}">Code notes ↗</a>
        </div>
      </div>
    </article>`;
  }).join('');

  empty.hidden = shown.length > 0 || projects.length === 0;
  reset.hidden = active === 'All' && !showDemosOnly && !search.value.trim();
}

// An explicitly requested same-origin demo loads only while the dialog is open.
// Never auto-create five active frames or duplicate hosted third-party resources.
grid.addEventListener('click', event => {
  const trigger = event.target.closest('button[data-preview-id]');
  if (!trigger) return;
  const id = Number(trigger.dataset.previewId);
  const project = projects.find(item => item.id === id);
  const capture = captures.get(id);
  if (!project || !capture || demoDialog.open) return;
  demoTitle.textContent = project.title;
  demoFull.href = capture.demo;
  demoSource.href = sourceURL(project);
  demoFrame.title = 'Interactive preview of ' + project.title;
  demoDialog.showModal();
  // Assign src after showing the dialog so hidden frames do not prefetch demos.
  demoFrame.src = capture.demo;
  demoClose.focus();
});
demoClose.addEventListener('click', () => demoDialog.close());
demoDialog.addEventListener('close', () => {
  demoFrame.removeAttribute('src');
});
demoDialog.addEventListener('click', event => {
  // Native dialog provides focus containment, Escape handling and a backdrop.
  if (event.target === demoDialog) demoDialog.close();
});

function updateView() {
  render();
  syncURL();
}

buttons.forEach(button => button.addEventListener('click', () => {
  active = button.dataset.tag;
  updateView();
}));
search.addEventListener('input', updateView);
demoOnly.addEventListener('change', () => {
  showDemosOnly = demoOnly.checked;
  updateView();
});
reset.addEventListener('click', () => {
  active = 'All';
  showDemosOnly = false;
  search.value = '';
  demoOnly.checked = false;
  updateView();
  search.focus();
});
window.addEventListener('popstate', () => {
  readURLState();
  render();
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.altKey && !event.ctrlKey && !event.metaKey &&
    !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) &&
    !document.activeElement?.isContentEditable) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === 'Escape' && document.activeElement === search) {
    search.value = '';
    updateView();
    search.blur();
  }
});
share.addEventListener('click', async () => {
  syncURL();
  try {
    await navigator.clipboard.writeText(location.href);
    shareStatus.textContent = 'Link copied. Your filters are included.';
  } catch {
    shareStatus.textContent = 'Copy the address from your browser to share this view.';
  }
});

async function loadCaptures() {
  try {
    const response = await fetch('previews/manifest.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('No published demo manifest');
    const manifest = await response.json();
    if (!Array.isArray(manifest.captures)) throw new Error('Invalid demo manifest');
    const ids = new Set(projects.map(project => project.id));
    captures = new Map(manifest.captures
      .filter(item => ids.has(item.id) &&
        typeof item.image === 'string' && /^previews\/[a-z0-9-]+\.jpg$/.test(item.image) &&
        typeof item.demo === 'string' && /^demos\/[a-z0-9-]+\/$/.test(item.demo))
      .map(item => [item.id, item]));
  } catch {
    // Source gallery still works when demo captures have not been deployed.
    status.textContent = 'Live demos are temporarily unavailable; all source projects remain accessible.';
  }
  render();
}

async function init() {
  readURLState();
  try {
    const response = await fetch('projects.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Project catalog request failed');
    const catalog = await response.json();
    if (!Array.isArray(catalog) || !catalog.length) throw new Error('Invalid project catalog');
    projects = catalog.filter(item =>
      Number.isSafeInteger(item.id) && item.id > 0 &&
      typeof item.title === 'string' && typeof item.path === 'string' &&
      typeof item.tag === 'string' && tags.has(item.tag) &&
      /^(?:[a-z0-9-]+\/)*[a-z0-9-]+$/.test(item.path));
    if (!projects.length) throw new Error('No valid projects');
    status.textContent = '';
    render();
    await loadCaptures();
  } catch {
    status.textContent = 'The project catalog could not load. Refresh the page to try again.';
    counter.textContent = '';
  }
}
init();
