/* Lightweight, dependency-free project guide. All user-facing dynamic text
   is created via textContent rather than interpreting catalog data as HTML. */
const github = 'https://github.com/Jackxiaozhiren/MotionSites';
const element = id => document.getElementById(id);
const sourcePath = project =>
  project.path.split('/').map(encodeURIComponent).join('/');
const sourceURL = project => github + '/tree/main/' + sourcePath(project);
const fileURL = (project, file) =>
  github + '/blob/main/' + sourcePath(project) + '/' +
  file.split('/').map(encodeURIComponent).join('/');

function createLink(text, href, className = '') {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  if (className) link.className = className;
  if (/^https:\/\//.test(href)) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  return link;
}

function renderNotes(project, entry) {
  const box = element('detail-notes');
  box.replaceChildren();
  if (!entry || !Array.isArray(entry.features) || !entry.features.length) {
    const message = document.createElement('p');
    message.className = 'muted';
    message.textContent = 'A source-verified implementation breakdown has not been published for this project yet. Explore the source folder to study the interaction, and check its dependencies before reuse.';
    box.append(message);
    return;
  }
  const list = document.createElement('ol');
  list.className = 'detail-steps';
  for (const feature of entry.features) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = feature.title;
    const paragraph = document.createElement('p');
    paragraph.className = 'muted';
    paragraph.textContent = feature.detail;
    item.append(heading, paragraph);
    if (Array.isArray(feature.files)) {
      const links = document.createElement('div');
      links.className = 'detail-file-links';
      for (const file of feature.files) {
        if (typeof file !== 'string' ||
          !/^(?:[a-zA-Z0-9_.-]+\/)*[a-zA-Z0-9_.-]+$/.test(file)) continue;
        links.append(createLink(file + ' ↗', fileURL(project, file), 'detail-inline-link'));
      }
      item.append(links);
    }
    list.append(item);
  }
  box.append(list);
}

async function readJSON(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to load ' + url);
  return response.json();
}

async function optionalCapture(id) {
  try {
    const manifest = await readJSON('previews/manifest.json');
    if (!Array.isArray(manifest.captures)) return null;
    const found = manifest.captures.find(item => item.id === id);
    if (!found || typeof found.image !== 'string' ||
      !/^previews\/[a-z0-9-]+\.jpg$/.test(found.image) ||
      typeof found.demo !== 'string' ||
      !/^demos\/[a-z0-9-]+\/$/.test(found.demo)) return null;
    return found;
  } catch {
    return null;
  }
}

function renderVisual(project, capture) {
  const target = element('detail-visual');
  target.replaceChildren();
  if (capture) {
    const image = document.createElement('img');
    image.src = capture.image;
    image.width = 960;
    image.height = 600;
    image.alt = 'Real browser screenshot of the running ' + project.title + ' project';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      // Keep the page navigable without pretending a broken URL is a capture.
      target.replaceChildren();
      const fallback = document.createElement('div');
      fallback.className = 'detail-concept';
      const title = document.createElement('strong');
      title.textContent = project.title;
      const label = document.createElement('span');
      label.textContent = 'Screenshot unavailable · Live demo link may still work';
      fallback.append(title, label);
      target.append(fallback);
    }, { once: true });
    target.append(image);
    const note = document.createElement('p');
    note.className = 'detail-visual-note';
    note.textContent = 'Real browser capture · Demo assets may depend on third-party hosts';
    target.append(note);
  } else {
    const art = document.createElement('div');
    art.className = 'detail-concept';
    const title = document.createElement('strong');
    title.textContent = project.title;
    const label = document.createElement('span');
    label.textContent = 'Concept cover · No verified live demo';
    art.append(title, label);
    target.append(art);
  }
}

async function init() {
  const raw = new URL(location.href).searchParams.get('id');
  const id = raw && /^(?:[1-9]|[12]\d|30)$/.test(raw) ? Number(raw) : null;
  if (id === null) {
    element('detail-status').textContent = 'Choose a project from the collection to see its guide.';
    return;
  }
  try {
    const [catalog, notes] = await Promise.all([
      readJSON('projects.json'),
      readJSON('project-notes.json')
    ]);
    if (!Array.isArray(catalog)) throw new Error('Invalid catalog');
    const project = catalog.find(item => item.id === id);
    if (!project || typeof project.title !== 'string' ||
      typeof project.path !== 'string' ||
      !/^(?:[a-z0-9-]+\/)*[a-z0-9-]+$/.test(project.path)) {
      element('detail-status').textContent = 'This project is not in the collection.';
      return;
    }
    const note = notes && Object.prototype.hasOwnProperty.call(notes, String(id))
      ? notes[String(id)] : null;
    const capture = await optionalCapture(id);
    document.title = project.title + ' — MotionSites';
    element('detail-number').textContent = 'Project ' + String(id).padStart(2, '0');
    element('detail-title').textContent = project.title;
    element('detail-summary').textContent = note?.description ||
      'An independent frontend experiment. Browse the source code and explore the implementation in your own environment.';
    element('detail-chips').replaceChildren();
    const chip = document.createElement('span');
    chip.className = 'detail-chip';
    chip.textContent = project.tag;
    const state = document.createElement('span');
    state.className = 'detail-chip detail-chip--outline';
    state.textContent = capture ? 'Verified live demo' : 'Source only';
    element('detail-chips').append(chip, state);
    element('detail-source').href = sourceURL(project);
    element('detail-source').target = '_blank';
    element('detail-source').rel = 'noopener noreferrer';
    const demo = element('detail-demo');
    demo.hidden = !capture;
    if (capture) {
      demo.href = capture.demo;
      demo.target = '_blank';
      demo.rel = 'noopener noreferrer';
    }
    renderVisual(project, capture);
    renderNotes(project, note);
    const commands = project.tag === 'HTML'
      ? 'git clone ' + github + '.git\ncd MotionSites/' + project.path +
        '\n# Open index.html in a browser (CDN content may require internet).'
      : 'git clone ' + github + '.git\ncd MotionSites/' + project.path +
        '\nnpm install\nnpm run dev';
    element('detail-command').textContent = commands;
    element('copy-command').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(commands);
        element('copy-result').textContent = 'Commands copied.';
      } catch {
        element('copy-result').textContent = 'Copy the commands manually from the code block.';
      }
    });
    element('detail-caveat').textContent = note?.caveat ||
      'This is a frontend concept, not a deployed product. External media, fonts or other assets may rely on third-party services. Inspect their terms before reuse.';
    element('detail-status').textContent = '';
    element('detail-content').hidden = false;
  } catch {
    element('detail-status').textContent = 'Could not load the project guide. Refresh the page or return to the collection.';
  }
}
init();
