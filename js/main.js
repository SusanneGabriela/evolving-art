/* ============================================================
   EVOLVING ART — main.js
   Horizontal drag-to-scroll timeline
   ============================================================ */

(function () {
  const wrapper = document.getElementById('timeline');
  const container = wrapper.parentElement;
  const dragHint = document.getElementById('dragHint');

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let lastTranslate = 0;
  let animationId = null;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let hintHidden = false;

  // Calculate max scroll distance
  function getMaxTranslate() {
    return -(wrapper.scrollWidth - container.clientWidth);
  }

  // Apply transform with bounds
  function applyTranslate(x) {
    const max = getMaxTranslate();
    x = Math.max(max, Math.min(0, x));
    wrapper.style.transform = `translateX(${x}px)`;
    currentTranslate = x;
  }

  // Hide hint after first drag
  function hideHint() {
    if (!hintHidden) {
      dragHint.classList.add('hidden');
      hintHidden = true;
    }
  }

  // Momentum animation
  function momentumScroll() {
    if (Math.abs(velocity) < 0.5) return;
    velocity *= 0.93;
    applyTranslate(currentTranslate + velocity);
    animationId = requestAnimationFrame(momentumScroll);
  }

  /* ---- Mouse Events ---- */

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    lastX = e.clientX;
    lastTime = Date.now();
    lastTranslate = currentTranslate;
    velocity = 0;
    cancelAnimationFrame(animationId);
    container.classList.add('dragging');
    hideHint();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const now = Date.now();
    const dt = now - lastTime;
    velocity = dt > 0 ? dx / dt * 16 : 0;
    lastX = e.clientX;
    lastTime = now;
    const moved = e.clientX - startX;
    applyTranslate(lastTranslate + moved);
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('dragging');
    animationId = requestAnimationFrame(momentumScroll);
  });

  /* ---- Touch Events ---- */

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    lastX = startX;
    lastTime = Date.now();
    lastTranslate = currentTranslate;
    velocity = 0;
    cancelAnimationFrame(animationId);
    hideHint();
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - lastX;
    const now = Date.now();
    const dt = now - lastTime;
    velocity = dt > 0 ? dx / dt * 16 : 0;
    lastX = e.touches[0].clientX;
    lastTime = now;
    const moved = e.touches[0].clientX - startX;
    applyTranslate(lastTranslate + moved);
  }, { passive: true });

  container.addEventListener('touchend', () => {
    animationId = requestAnimationFrame(momentumScroll);
  });

  /* ---- Trackpad / Wheel Horizontal Scroll ---- */

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    cancelAnimationFrame(animationId);
    // Prioritize horizontal wheel, but also map vertical wheel to horizontal
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    applyTranslate(currentTranslate - delta);
    hideHint();
  }, { passive: false });

  /* ---- Prevent image drag interfering ---- */
  wrapper.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });

})();
