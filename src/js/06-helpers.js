/* ---------- small helpers ---------- */
function typeText(el, text, ms, tick) {
  if (el._tid) clearInterval(el._tid);
  if (reduced) { el.textContent = text; return; }
  el.textContent = ""; let i = 0;
  el._tid = setInterval(() => {
    if (!el.isConnected) { clearInterval(el._tid); return; }
    el.textContent = text.slice(0, ++i);
    if (tick && i % 2) sfx("type");
    if (i >= text.length) clearInterval(el._tid);
  }, ms || 20);
}
function burst(text, x, y, color) {
  if (reduced) return;
  const b = document.createElement("div"); b.className = "burst";
  b.style.left = Math.min(innerWidth - 110, Math.max(110, x)) + "px";
  b.style.top = Math.min(innerHeight - 80, Math.max(80, y)) + "px";
  b.innerHTML = `<svg viewBox="0 0 210 150"><polygon points="${BURST}" fill="var(--${color})" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/></svg><span>${esc(text)}</span>`;
  document.body.appendChild(b); setTimeout(() => b.remove(), 1000);
}
function confetti() {
  if (reduced) return;
  const cv = document.createElement("canvas"); cv.className = "confetti"; document.body.appendChild(cv);
  const dpr = Math.min(2, devicePixelRatio || 1), Wd = innerWidth, H = innerHeight;
  cv.width = Wd * dpr; cv.height = H * dpr; const x = cv.getContext("2d"); x.scale(dpr, dpr);
  const cols = ["#ffd23f", "#ff4b4b", "#2f9bff", "#21b36b", "#ffb3d9"];
  const P = Array.from({ length: 160 }, () => ({ x: Wd / 2 + (Math.random() - .5) * Wd * .35, y: H * .38, vx: (Math.random() - .5) * 15, vy: -Math.random() * 15 - 4,
    r: Math.random() * 6, vr: (Math.random() - .5) * .3, s: 7 + Math.random() * 9, c: cols[Math.random() * 5 | 0], k: Math.random() * 3 | 0 }));
  const t0 = performance.now();
  (function f(now) {
    x.clearRect(0, 0, Wd, H);
    for (const p of P) {
      p.vy += .36; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.strokeStyle = "#17161f"; x.lineWidth = 2; x.beginPath();
      if (p.k === 0) x.rect(-p.s / 2, -p.s / 3, p.s, p.s * .66);
      else if (p.k === 1) x.arc(0, 0, p.s / 2, 0, 7);
      else { for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, rr = i % 2 ? p.s * .26 : p.s * .62; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); }
      x.fill(); x.stroke(); x.restore();
    }
    if (now - t0 < 3300) requestAnimationFrame(f); else cv.remove();
  })(t0);
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
