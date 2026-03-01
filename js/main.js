/* ============================================================
   EVOLVING ART — main.js  (fixed)
   Horizontal drag-to-scroll timeline + vertical column scroll
   ============================================================ */

(function () {
  // Use the WRAPPER (overflow container) for scrollLeft, not the inner flex div
  const wrapper   = document.querySelector('.timeline-wrapper');
  const dragHint  = document.getElementById('dragHint');

  if (!wrapper) return;

  let isDragging    = false;
  let startX        = 0;
  let startScrollL  = 0;
  let velocity      = 0;
  let lastX         = 0;
  let lastTime      = 0;
  let animationId   = null;
  let hintHidden    = false;

  // ── Enable horizontal scrolling on the wrapper via CSS ──────
  // (overflow-x must be auto/scroll; we set it here to avoid
  //  needing a CSS change, but you can also add it in style.css)
  wrapper.style.overflowX = 'auto';
  wrapper.style.overflowY = 'hidden';

  // Hide the native scrollbar visually (already in CSS, belt+braces)
  wrapper.style.scrollbarWidth = 'none'; // Firefox

  function hideHint() {
    if (!hintHidden && dragHint) {
      dragHint.classList.add('hidden');
      hintHidden = true;
    }
  }

  // ── Momentum ─────────────────────────────────────────────────
  function momentumScroll() {
    if (Math.abs(velocity) < 0.5) return;
    velocity *= 0.92;
    wrapper.scrollLeft += velocity;
    animationId = requestAnimationFrame(momentumScroll);
  }

  // ── Mouse drag ───────────────────────────────────────────────
  wrapper.addEventListener('mousedown', (e) => {
    // Only start drag on the wrapper itself, not inside a column
    isDragging   = true;
    startX       = e.clientX;
    startScrollL = wrapper.scrollLeft;
    lastX        = e.clientX;
    lastTime     = Date.now();
    velocity     = 0;
    cancelAnimationFrame(animationId);
    wrapper.classList.add('dragging');
    hideHint();
    e.preventDefault(); // prevent text selection while dragging
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
    // Flip velocity: dragging left means scrollLeft increases
    velocity = -velocity;
    animationId = requestAnimationFrame(momentumScroll);
  });

  // ── Touch drag ───────────────────────────────────────────────
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
    animationId = requestAnimationFrame(momentumScroll);
  });

  // ── Wheel / trackpad ─────────────────────────────────────────
  // KEY FIX: only hijack events that are PRIMARILY horizontal,
  // or events on the wrapper bg itself (not inside a column).
  // Vertical wheel inside a column should scroll that column normally.
  wrapper.addEventListener('wheel', (e) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const col = e.target.closest('.project-column');

    if (isHorizontal) {
      // Always handle horizontal wheel for timeline scrubbing
      e.preventDefault();
      cancelAnimationFrame(animationId);
      wrapper.scrollLeft += e.deltaX;
      hideHint();
    } else if (!col) {
      // Vertical wheel on the wrapper background (not in a column) → scroll timeline
      e.preventDefault();
      cancelAnimationFrame(animationId);
      wrapper.scrollLeft += e.deltaY;
      hideHint();
    }
    // If vertical wheel inside a column → do nothing, let the column scroll naturally
  }, { passive: false });

  // ── Prevent image drag ghost ─────────────────────────────────
  wrapper.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });

})();