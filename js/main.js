/* ============================================================
   EVOLVING ART — main.js
   Horizontal drag + vertical column scroll + order toggle
   ============================================================ */

(function () {

  const wrapper     = document.querySelector('.timeline-wrapper');
  const timeline    = document.getElementById('timeline');
  const dragHint    = document.getElementById('dragHint');
  const orderToggle = document.getElementById('orderToggle');
  const orderLabel  = document.getElementById('orderLabel');

  if (!wrapper || !timeline) return;

  // ── State ────────────────────────────────────────────────────
  let isDragging   = false;
  let startX       = 0;
  let startScrollL = 0;
  let velocity     = 0;
  let lastX        = 0;
  let lastTime     = 0;
  let animationId  = null;
  let hintHidden   = false;
  let newestFirst  = false;

  // ── Helpers ──────────────────────────────────────────────────
  function isMobile() {
    return window.innerWidth < 768;
  }

  function hideHint() {
    if (!hintHidden && dragHint) {
      dragHint.classList.add('hidden');
      hintHidden = true;
    }
  }

  // ── Order toggle ─────────────────────────────────────────────
  // Physically reverses the DOM order of project columns so
  // CSS :first-child border rules still apply correctly.
  function applyOrder() {
    const cols = Array.from(timeline.querySelectorAll('.project-column'));
    if (newestFirst) {
      cols.reverse().forEach(col => timeline.appendChild(col));
      orderLabel.textContent = 'newest \u2192 oldest';
    } else {
      cols.sort((a, b) => a.dataset.order - b.dataset.order)
          .forEach(col => timeline.appendChild(col));
      orderLabel.textContent = 'oldest \u2192 newest';
    }

    // Scroll back to start after reorder
    if (!isMobile()) {
      wrapper.scrollLeft = 0;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (orderToggle) {
    orderToggle.addEventListener('click', () => {
      newestFirst = !newestFirst;
      applyOrder();
    });
  }

  // ── Momentum glide ───────────────────────────────────────────
  function momentum() {
    if (Math.abs(velocity) < 0.5) return;
    velocity *= 0.92;
    wrapper.scrollLeft += velocity;
    animationId = requestAnimationFrame(momentum);
  }

  // ── Mouse drag (desktop only) ────────────────────────────────
  wrapper.addEventListener('mousedown', (e) => {
    if (isMobile()) return;
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
    velocity = -velocity;
    animationId = requestAnimationFrame(momentum);
  });

  // ── Touch drag (tablet horizontal timeline only) ─────────────
  // On mobile (<768px) the layout is vertical so native scroll handles it.
  wrapper.addEventListener('touchstart', (e) => {
    if (isMobile()) return;
    startX       = e.touches[0].clientX;
    startScrollL = wrapper.scrollLeft;
    lastX        = startX;
    lastTime     = Date.now();
    velocity     = 0;
    cancelAnimationFrame(animationId);
    hideHint();
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (isMobile()) return;
    const now = Date.now();
    const dt  = now - lastTime;
    const dx  = e.touches[0].clientX - lastX;
    velocity  = dt > 0 ? (dx / dt) * 16 : 0;
    lastX     = e.touches[0].clientX;
    lastTime  = now;
    wrapper.scrollLeft = startScrollL - (e.touches[0].clientX - startX);
  }, { passive: true });

  wrapper.addEventListener('touchend', () => {
    if (isMobile()) return;
    velocity = -velocity;
    animationId = requestAnimationFrame(momentum);
  });

  // ── Wheel / trackpad (desktop only) ─────────────────────────
  wrapper.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const col = e.target.closest('.project-column');

    if (isHorizontal) {
      e.preventDefault();
      cancelAnimationFrame(animationId);
      wrapper.scrollLeft += e.deltaX;
      hideHint();
    } else if (!col) {
      // Vertical on empty wrapper area → scroll timeline
      e.preventDefault();
      cancelAnimationFrame(animationId);
      wrapper.scrollLeft += e.deltaY;
      hideHint();
    }
    // Vertical inside a column → browser handles naturally
  }, { passive: false });

  // ── Prevent image ghost drag ─────────────────────────────────
  wrapper.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });

})();