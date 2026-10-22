/**
 * Deliberately tiny shared presentation behavior: a reading-progress rail and
 * a keyboard-accessible return link. No scroll-tied layout reads inside demo
 * iframes; the gallery's existing live preview scheduler remains unchanged.
 */
(() => {
  const rail = document.querySelector('#reading-progress');
  const top = document.querySelector('#back-to-top');
  const nav = document.querySelector('nav');
  if (!rail || !top || !nav) return;

  let frame = 0;
  function update() {
    frame = 0;
    const total = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const scroll = Math.max(0, Math.min(scrollY, total));
    rail.style.transform = `scaleX(${scroll / total})`;
    nav.classList.toggle('is-scrolled', scroll > 18);
    top.hidden = scroll < 1100;
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  schedule();
})();