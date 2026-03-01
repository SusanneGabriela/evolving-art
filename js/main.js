/* ============================================================
   EVOLVING ART — main.js
   Horizontal drag-to-scroll + vertical column scroll
   ============================================================ */

(function () {
  const wrapper  = document.querySelector('.timeline-wrapper');
  const dragHint = document.getElementById('dragHint');

  if (!wrapper) return;

  let isDragging   = false;
  let startX       = 0;
  let startScrollL = 0;
  let velocity     = 0;
  let lastX        = 0;
  let lastTime     = 0;
  let animationId  = null;
  let hintHidden   = false;

  function hideHint() {
    if (!hintHidden && dragHint) {
      dragHint.classList.add('hidden');
      hintHidden = true;
    }
  }

  // ── Momentum glide after releasing drag ──────────────────────
  function momentum() {
    if (Math.abs(velocity) < 0.5) return;
    velocity *= 0.92;
    wrapper.scrollLeft += velocity;
    animationId = requestAnimationFrame(momentum);
  }

  // ── Mouse: drag to scroll horizontally ───────────────────────
  wrapper.addEventListener('mousedown', (e) => {
    isDragging   = true;
    startX       = e.clientX;
    startScrollL = wrapper.scrollLeft;
    lastX        = e.clientX;
    lastTime     = Date.now();
    velocity     = 0;
    cancelAnimationFrame(animationId);
    wrapper.classList.add('dragging');
    hideHint();
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const now = Date.now();
    const dt  = now - lastTime;
    const dx  = e.clientX - lastX;
    velocity  = dt > 0 ? (dx / dt) * 16 : 0;
    lastX     = e.clientX;
    lastTime  = now;
    wrapper.scrollLeft = startScrollL - (e.clientX - startX);
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('dragging');
    velocity = -velocity; // invert: dragging left = positive scrollLeft
    animationId = requestAnimationFrame(momentum);
  });

  // ── Touch: drag to scroll horizontally ───────────────────────
  wrapper.addEventListener('touchstart', (e) => {
    startX       = e.touches[0].clientX;
    startScrollL = wrapper.scrollLeft;
    lastX        = startX;
    lastTime     = Date.now();
    velocity     = 0;
    cancelAnimationFrame(animationId);
    hideHint();
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    const now = Date.now();
    const dt  = now - lastTime;
    const dx  = e.touches[0].clientX - lastX;
    velocity  = dt > 0 ? (dx / dt) * 16 : 0;
    lastX     = e.touches[0].clientX;
    lastTime  = now;
    wrapper.scrollLeft = startScrollL - (e.touches[0].clientX - startX);
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    velocity = -velocity;
    animationId = requestAnimationFrame(momentum);
  });

  // ── Wheel / trackpad ─────────────────────────────────────────
  // Rules:
  //   • Horizontal delta  → always scroll timeline left/right
  //   • Vertical delta inside a column → let the column scroll (do nothing)
  //   • Vertical delta outside a column → scroll timeline left/right
  wrapper.addEventListener('wheel', (e) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const col = e.target.closest('.project-column');

    if (isHorizontal) {
      e.preventDefault();
      cancelAnimationFrame(animationId);
      wrapper.scrollLeft += e.deltaX;
      hideHint();
    } else if (!col) {
      // Vertical scroll on empty wrapper area → move timeline
      e.preventDefault();
      cancelAnimationFrame(animationId);
      wrapper.scrollLeft += e.deltaY;
      hideHint();
    }
    // Vertical inside a column: do nothing — browser handles it natively
  }, { passive: false });

  // ── Stop image ghost drag ────────────────────────────────────
  wrapper.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });

})();