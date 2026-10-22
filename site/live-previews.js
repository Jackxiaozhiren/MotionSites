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
  const SCROLL_INTERVAL = 32; // smooth ~30fps instead of jumpy 90ms intervals
  let animationFrame = 0;

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
    clearTimeout(state.hydrateTimer);
    state.frame.onload = null;
    // Navigate away before removing the frame to stop remote media and RAFs.
    state.frame.removeAttribute('src');
    state.layer.remove();
    active.delete(card);
  }

  function stopAll() {
    for (const card of active.keys()) stop(card);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function resize(state) {
    const width = state.card.getBoundingClientRect().width;
    const baseWidth = innerWidth < 720 ? 430 : 1000;
    if (width <= 0 || (state.lastWidth === width && state.baseWidth === baseWidth)) return;
    state.lastWidth = width;
    state.baseWidth = baseWidth;
    const scale = width / baseWidth;
    state.frame.width = String(baseWidth);
    state.layer.style.setProperty('--preview-base-width', baseWidth + 'px');
    state.layer.style.setProperty('--preview-scale', String(scale));
    // Only the top of an 800px iframe was previously visible through a 245px
    // card: scrolling to document bottom would still hide the actual footer.
    // Match the iframe viewport to the *unscaled* height of the cropped card,
    // so the maximum scroll position really shows the end of the page.
    const visibleHeight = state.layer.clientHeight;
    if (visibleHeight > 0) {
      state.frame.style.height = Math.ceil(visibleHeight / scale) + 'px';
    }
  }

  function scrollable(state) {
    try {
      const frame = state.frame;
      const doc = frame.contentDocument;
      if (!doc?.body) return null;
      // Don't query complex React/GSAP trees at 30fps when the scrolling
      // element is unchanged. Re-discover only if the old root was replaced.
      if (state.target?.isConnected &&
          state.target.scrollHeight > state.target.clientHeight + 40) {
        return state.target;
      }
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

  function advance(state, now) {
    if (!state.visible || !state.frame.isConnected || !state.loaded || !permitted()) return;
    try {
      const target = scrollable(state);
      if (!target) return;
      const range = Math.max(0, target.scrollHeight - target.clientHeight);
      if (range < 40) return; // Some designs are intentionally one screen.
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
    // The real iframe receives native desktop hover/mousemove animation events.
    // On touch screens it remains inert so vertical swipe always scrolls gallery.
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      layer.classList.add('live-layer--pointer');
    }
    card.append(layer);
    const state = {
      card, layer, frame, loaded: false, visible: false,
      lastWidth: 0, baseWidth: 0, lastTick: 0,
      lastTime: 0, y: 0, holdUntil: 0, restart: false, target: null,
      hydrateTimer: null,
    };
    active.set(card, state);
    resize(state);
    frame.onload = () => {
      if (active.get(card) !== state) return;
      // Forward pointer wheel gestures to the gallery, instead of trapping
      // visitors inside an embedded demo. Hover and cursor effects stay native.
      try {
        const doc = frame.contentDocument;
        doc?.addEventListener('wheel', event => {
          if (event.ctrlKey) return; // Preserve browser zoom gestures.
          event.preventDefault();
          const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
          scrollBy({ top: event.deltaY * unit, left: event.deltaX * unit });
        }, { capture: true, passive: false });
        // Keep live previews non-navigating. Full interactions belong to the
        // explicit Preview here / Full demo links on the enclosing card.
        doc?.addEventListener('click', event => {
          if (event.target?.closest?.('a[href], area[href]')) event.preventDefault();
        }, true);
        doc?.addEventListener('submit', event => event.preventDefault(), true);
      } catch { /* Only accessible for same-origin published demos. */ }
      // Keep the screenshot visible until the real React/HTML page hydrates.
      // A network load event alone can fire on an empty SPA shell.
      const started = performance.now();
      function checkReady() {
        if (active.get(card) !== state) return;
        let readable = false;
        try {
          const doc = frame.contentDocument;
          // Canvas/WebGL/vector-only projects may have almost no text.
          // Wait for hydrated visual content rather than treating them as blank.
          const content = doc?.body;
          const text = content?.innerText?.trim().length || 0;
          const visuals = content?.querySelectorAll('canvas,svg,img,video').length || 0;
          const nodes = content?.querySelectorAll('*').length || 0;
          readable = !!content && (text >= 20 || (visuals > 0 && nodes >= 8));
        } catch { /* A demo may navigate to another origin. */ }
        if (readable) {
          state.loaded = true;
          layer.classList.add('is-ready');
        } else if (performance.now() - started < 10000) {
          state.hydrateTimer = setTimeout(checkReady, 250);
        }
      }
      state.hydrateTimer = setTimeout(checkReady, 350);
    };
    frame.src = path;
    // One shared loop, only while live previews exist; no idle CPU polling.
    if (!animationFrame) animationFrame = requestAnimationFrame(tick);
  }

  function refresh() {
    scheduled = false;
    describeState();
    if (!permitted()) {
      stopAll();
      return;
    }

    const height = innerHeight || 800;
    const maxFrames = innerWidth < 720 ? 2 : 3;
    // Keep a small neighboring buffer alive during normal scroll reversals;
    // previously an arbitrary 35% card threshold unloaded while still visible.
    const warmMargin = Math.min(600, Math.round(height * .7));
    const candidates = cards.map(card => {
      const cover = card.querySelector('.cover');
      const r = (cover || card).getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < height;
      const near = r.bottom > -warmMargin && r.top < height + warmMargin;
      const distance = Math.abs((r.top + r.bottom) / 2 - height / 2);
      return { card, near, visible, distance };
    }).filter(item => item.near && item.card.dataset.demo);
    candidates.sort((a, b) =>
      Number(b.visible) - Number(a.visible) || a.distance - b.distance);
    const chosen = candidates.slice(0, maxFrames);
    const keep = new Set(chosen.map(item => item.card));

    for (const card of active.keys()) if (!keep.has(card) || !card.isConnected) stop(card);
    for (const item of chosen) {
      start(item.card);
      const state = active.get(item.card);
      if (!state) continue;
      if (state.visible !== item.visible) {
        state.visible = item.visible;
        state.lastTime = 0; // Avoid fast-forwarding after scrolling back.
      }
      resize(state);
    }
  }

  function tick(now) {
    if (!permitted()) {
      stopAll();
      return;
    }
    for (const state of active.values()) {
      if (state.visible && now - state.lastTick >= SCROLL_INTERVAL) {
        state.lastTick = now;
        advance(state, now);
      }
    }
    animationFrame = active.size ? requestAnimationFrame(tick) : 0;
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
  addEventListener('pagehide', () => {
    stopAll();
    cancelAnimationFrame(animationFrame);
  });
  rebuild();
})();
