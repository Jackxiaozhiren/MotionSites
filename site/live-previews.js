/**
 * Live, auto-scrolling project thumbnails.
 *
 * Real same-origin demos are hosted by GitHub Pages. Only the cards near the
 * viewport run in iframes (two desktop / one mobile); off-screen frames are
 * removed so that 30 independent React sites cannot run simultaneously.
 * The original screenshot remains visible as a no-JS / network fallback.
 */
(() => {
  const grid = document.querySelector('#grid');
  const toggle = document.querySelector('#live-previews');
  const note = document.querySelector('#live-preview-note');
  if (!grid || !toggle || !('IntersectionObserver' in window)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map();
  let cards = [];
  let scheduled = false;
  let observer;
  const BASE_HEIGHT = 800;
  const STEP_MS = 90;

  function permitted() {
    return toggle.checked && !reduced.matches &&
      !navigator.connection?.saveData && !document.hidden &&
      !document.querySelector('#demo-dialog')?.open;
  }

  function describeState() {
    toggle.disabled = reduced.matches || !!navigator.connection?.saveData;
    if (reduced.matches) {
      note.textContent = 'Live motion is paused because your device requests reduced motion.';
    } else if (navigator.connection?.saveData) {
      note.textContent = 'Live motion is paused while data-saving mode is enabled.';
    } else {
      note.textContent = 'Only visible projects load live. Turn this off to use screenshots.';
    }
    grid.classList.toggle('live-grid', permitted() && cards.some(card => card.dataset.demo));
  }

  function stop(card) {
    const state = active.get(card);
    if (!state) return;
    clearInterval(state.timer);
    state.frame.onload = null;
    // Navigate away before removing the frame to stop remote media and RAFs.
    state.frame.removeAttribute('src');
    state.layer.remove();
    active.delete(card);
  }

  function stopAll() {
    for (const card of active.keys()) stop(card);
  }

  function resize(state) {
    const width = state.card.getBoundingClientRect().width;
    const baseWidth = innerWidth < 720 ? 430 : 1000;
    state.frame.width = String(baseWidth);
    state.layer.style.setProperty('--preview-base-width', baseWidth + 'px');
    if (width > 0) state.layer.style.setProperty('--preview-scale', String(width / baseWidth));
  }

  function scrollable(frame) {
    try {
      const doc = frame.contentDocument;
      if (!doc?.body) return null;
      const root = doc.scrollingElement || doc.documentElement;
      if (root.scrollHeight > root.clientHeight + 40) return root;
      // Some experiments lock body scroll and use a dedicated scroll wrapper.
      const others = doc.querySelectorAll('main,[class*="scroll"],[data-scroll-container]');
      let best = null;
      let span = 40;
      for (const element of others) {
        const range = element.scrollHeight - element.clientHeight;
        if (range > span && frame.contentWindow.getComputedStyle(element).overflowY !== 'hidden') {
          span = range;
          best = element;
        }
      }
      return best;
    } catch { return null; }
  }

  function advance(state) {
    if (!state.frame.isConnected || !state.loaded || !permitted()) return;
    try {
      const target = scrollable(state.frame);
      if (!target) return;
      const range = Math.max(0, target.scrollHeight - target.clientHeight);
      if (range < 40) return; // Some designs are intentionally one screen.
      const now = performance.now();
      if (!state.lastTime) state.lastTime = now;
      const delta = Math.min(180, now - state.lastTime);
      state.lastTime = now;
      if (state.holdUntil > now) return;
      if (state.restart) {
        state.y = 0;
        state.restart = false;
        state.holdUntil = now + 950;
        target.scrollTop = 0;
        return;
      }
      if (state.target !== target) {
        state.target = target;
        state.y = 0;
      }
      // Allow large sites to reach their footer; do not jump through pages.
      const pixelsPerSecond = Math.max(220, range / 17);
      state.y += pixelsPerSecond * delta / 1000;
      if (state.y >= range) {
        state.y = range;
        state.holdUntil = now + 1800;
        state.restart = true;
      }
      target.scrollTop = state.y;
    } catch {
      // A project may navigate away or replace its scrolling root. Keep its
      // screenshot rather than interrupting gallery navigation.
      stop(state.card);
    }
  }

  function start(card) {
    if (active.has(card)) return;
    const path = card.dataset.demo;
    if (!/^demos\/[a-z0-9-]+\/$/.test(path)) return;
    const layer = document.createElement('div');
    layer.className = 'live-layer';
    layer.setAttribute('aria-hidden', 'true');
    const frame = document.createElement('iframe');
    frame.title = 'Automatically scrolling preview';
    frame.tabIndex = -1;
    frame.loading = 'eager';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.width = String(innerWidth < 720 ? 430 : 1000);
    frame.height = String(BASE_HEIGHT);
    const pill = document.createElement('span');
    pill.className = 'live-pill';
    pill.textContent = 'LIVE · AUTO SCROLL';
    layer.append(frame, pill);
    card.append(layer);
    const state = {
      card, layer, frame, timer: null, loaded: false,
      lastTime: 0, y: 0, holdUntil: 0, restart: false, target: null,
    };
    active.set(card, state);
    resize(state);
    frame.onload = () => {
      if (!active.has(card)) return;
      // A short hydration grace period prevents moving a blank SPA shell.
      setTimeout(() => {
        if (active.get(card) !== state) return;
        state.loaded = true;
        layer.classList.add('is-ready');
      }, 700);
    };
    frame.src = path;
    state.timer = setInterval(() => advance(state), STEP_MS);
  }

  function refresh() {
    scheduled = false;
    describeState();
    for (const card of active.keys()) {
      if (!card.isConnected || !permitted() || !card.dataset.demo) stop(card);
    }
    if (!permitted()) return;
    const screenHeight = innerHeight || 800;
    const eligible = cards.filter(card => {
      if (!card.dataset.demo || !card.isConnected) return false;
      const r = card.getBoundingClientRect();
      const visible = Math.max(0, Math.min(r.bottom, screenHeight) - Math.max(r.top, 0));
      return visible >= Math.min(r.height * .35, 170);
    }).sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      return Math.abs((ra.top + ra.bottom)/2 - screenHeight/2) -
        Math.abs((rb.top + rb.bottom)/2 - screenHeight/2);
    }).slice(0, innerWidth < 720 ? 1 : 2);
    for (const card of active.keys()) if (!eligible.includes(card)) stop(card);
    for (const card of eligible) {
      start(card);
      const state = active.get(card);
      if (state) resize(state);
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(refresh);
  }

  function rebuild() {
    stopAll();
    observer?.disconnect();
    cards = [...grid.querySelectorAll(':scope > .card')];
    observer = new IntersectionObserver(schedule, { threshold: [.1, .35, .65] });
    for (const card of cards) observer.observe(card);
    schedule();
  }

  // Gallery filters replace top-level cards; observing only those children
  // avoids an infinite mutation loop when adding/removing preview layers.
  new MutationObserver(rebuild).observe(grid, { childList: true });
  toggle.addEventListener('change', schedule);
  reduced.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.querySelector('#demo-dialog')?.addEventListener('close', schedule);
  document.querySelector('#demo-dialog')?.addEventListener('cancel', () => {
    stopAll();
  });
  grid.addEventListener('click', event => {
    if (event.target.closest('[data-preview-id]')) {
      stopAll(); // The manually requested large preview takes priority.
      schedule();
    }
  });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pagehide', stopAll);
  rebuild();
})();
