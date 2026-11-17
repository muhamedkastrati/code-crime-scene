/* ---------- drawings ---------- */
const INK = "var(--ink)";
const DUCK = `<svg viewBox="0 0 150 130" aria-hidden="true"><g stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
<path d="M112 84l28-18-6 32z" fill="var(--yellow)"/>
<ellipse cx="80" cy="94" rx="52" ry="29" fill="var(--yellow)"/>
<path d="M72 92q24-16 44 2q-22 18-44-2z" fill="var(--yellow-deep)"/>
<circle cx="54" cy="56" r="27" fill="var(--yellow)"/>
<path d="M30 60q-22-1-26 8q13 9 30 2z" fill="#ff9a1f"/>
<circle cx="47" cy="52" r="4.6" fill="${INK}" stroke="none"/><circle cx="48.6" cy="50.4" r="1.6" fill="#fff" stroke="none"/>
<path d="M27 37q27-34 56 0z" fill="#b5793e"/>
<path d="M22 38q33-9 66 0" fill="none"/>
<path d="M83 37l13 7" fill="none"/>
<path d="M41 24l4 11M55 19v13M69 23l-3 11" stroke="#7a4e24" stroke-width="2.4"/>
</g></svg>`;
const TICKS = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, r1 = 37, r2 = 43;
  return `<line x1="${(70 + Math.sin(a) * r1).toFixed(1)}" y1="${(84 - Math.cos(a) * r1).toFixed(1)}" x2="${(70 + Math.sin(a) * r2).toFixed(1)}" y2="${(84 - Math.cos(a) * r2).toFixed(1)}"/>`; }).join("");
const clockSVG = () => `<svg class="clock" viewBox="0 0 140 150" aria-hidden="true"><g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
<path d="M42 130l-12 15M98 130l12 15" fill="none"/>
<circle cx="34" cy="32" r="17" fill="var(--red)"/><circle cx="106" cy="32" r="17" fill="var(--red)"/>
<path d="M70 16v12" fill="none"/><circle cx="70" cy="13" r="5" fill="${INK}"/>
<circle cx="70" cy="84" r="56" fill="var(--red)"/><circle cx="70" cy="84" r="45" fill="#fff"/>
<g stroke-width="2.5">${TICKS}</g>
<line class="hand" x1="70" y1="84" x2="70" y2="46" stroke-width="2.5" stroke="var(--red)"/>
<path d="M45 64l19 9M95 64l-19 9" stroke-width="6"/>
<circle cx="56" cy="80" r="6" fill="${INK}"/><circle cx="84" cy="80" r="6" fill="${INK}"/>
<path d="M48 98q22 18 44 0z" fill="#fff"/>
<path d="M56 100v6M63 102v8M70 103v8M77 102v8M84 100v6" stroke-width="2"/>
</g></svg>`;
const LOOKS = [
  { bg: "#ffe9a8", skin: "#f2c39b", shirt: "#ffffff", hat: `<path d="M30 32c-9-14 5-23 12-15 2-11 17-11 19-1 7-8 21 0 12 16z" fill="#fff"/><rect x="31" y="27" width="40" height="9" rx="2" fill="#fff"/>` },
  { bg: "#cfe3ff", skin: "#d9a07a", shirt: "#2f5bd3", hat: `<path d="M26 36q24-24 48 0z" fill="#2f5bd3"/><rect x="21" y="33" width="58" height="7" rx="3" fill="#1d3a8f"/><circle cx="50" cy="26" r="3" fill="var(--yellow)"/>` },
  { bg: "#d8f5e4", skin: "#a8714f", shirt: "#21b36b", hat: `<path d="M26 44q0-24 24-24t24 24q-7-12-24-12t-24 12z" fill="#3a2418"/>` },
  { bg: "#ffd6ea", skin: "#f5d0b5", shirt: "#7a3df5", hat: `<path d="M27 42q0-22 23-22t23 22q-8-9-23-9t-23 9z" fill="#e8742c"/><path d="M24 48q0-32 26-32t26 32" fill="none" stroke-width="5"/><rect x="17" y="40" width="11" height="17" rx="4" fill="var(--red)"/><rect x="72" y="40" width="11" height="17" rx="4" fill="var(--red)"/>` },
  { bg: "#e3e6ff", skin: "#8d5a3b", shirt: "#ff8a3d", hat: `<path d="M27 42q0-22 23-22t23 22q-8-9-23-9t-23 9z" fill="#1c1c1c"/><circle cx="50" cy="19" r="7" fill="#1c1c1c"/><path d="M25 50q0 14 14 16" fill="none" stroke-width="3"/><circle cx="40" cy="66" r="3" fill="${INK}"/>` },
  { bg: "#fff1c9", skin: "#f0c8a8", shirt: "#9aa0b5", hat: `<path d="M27 40l3-14 7 8 5-13 6 11 6-12 5 12 7-9 4 17z" fill="#d9d9e3"/><circle cx="40" cy="31" r="7" fill="var(--sky)"/><circle cx="60" cy="31" r="7" fill="var(--sky)"/><path d="M47 31h6" fill="none"/>` },
  { bg: "#ffe1e1", skin: "#e8b48f", shirt: "#c2255c", hat: `<path d="M26 46q-2-26 24-26t24 26q-4-14-24-14t-24 14z" fill="#6b3b22"/><circle cx="41" cy="47" r="7.5" fill="none" stroke-width="2.5"/><circle cx="59" cy="47" r="7.5" fill="none" stroke-width="2.5"/><path d="M48.5 47h3" fill="none" stroke-width="2.5"/>` }
];
const faceSVG = k => { const l = LOOKS[k]; return `<svg class="face" viewBox="0 0 100 100" aria-hidden="true" style="background:${l.bg}"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 102c4-23 19-31 38-31s34 8 38 31z" fill="${l.shirt}"/>
<circle cx="50" cy="48" r="24" fill="${l.skin}"/>${l.hat}
<circle cx="41" cy="47" r="2.8" fill="${INK}" stroke="none"/><circle cx="59" cy="47" r="2.8" fill="${INK}" stroke="none"/>
<path d="M36 39l8 3M64 39l-8 3" stroke-width="2.5"/>
<path d="M42 62q8-6 16 0" fill="none"/></g></svg>`; };
const BUGC = ["#ff8a3d", "#9b6bff", "#2fbf9f", "#ff5fa2", "#3da5ff", "#a3c43b"];
const bugSVG = i => i >= 6 ? clockSVG() : `<svg class="bugface" viewBox="0 0 100 100" aria-hidden="true"><g stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
<path d="M40 22q-6-13-15-14M60 22q6-13 15-14" fill="none"/><circle cx="24" cy="8" r="4" fill="${INK}"/><circle cx="76" cy="8" r="4" fill="${INK}"/>
<path d="M22 62l-12-4M22 74l-12 4M78 62l12-4M78 74l12 4" fill="none"/>
<ellipse cx="50" cy="67" rx="29" ry="27" fill="${BUGC[i]}"/><path d="M50 42v52" fill="none"/>
<circle cx="37" cy="64" r="4.5" fill="${INK}" stroke="none" opacity=".35"/><circle cx="63" cy="76" r="4.5" fill="${INK}" stroke="none" opacity=".35"/>
<circle cx="50" cy="33" r="16" fill="#2b2a35"/>
<circle cx="44" cy="31" r="5" fill="#fff" stroke="none"/><circle cx="56" cy="31" r="5" fill="#fff" stroke="none"/>
<circle cx="45" cy="32" r="2.2" fill="${INK}" stroke="none"/><circle cx="57" cy="32" r="2.2" fill="${INK}" stroke="none"/>
<path d="M44 40q7 4 13-1" fill="none" stroke="#fff" stroke-width="2"/></g></svg>`;
const ICON = {
  lens: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M15 15l6 6" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>`,
  marker: `<svg viewBox="0 0 28 28" aria-hidden="true"><circle class="glassfill" cx="11" cy="11" r="7.5" stroke="var(--ink)" stroke-width="3"/><path d="M17 17l8 8" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/></svg>`,
  play: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>`,
  pause: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="5" height="16" rx="1" fill="currentColor"/></svg>`,
  lock: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" fill="currentColor"/><path d="M8 10V7a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>`,
  trash: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
  check: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>`,
  sOn: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8q3 4 0 8M19 5q5 7 0 14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  sOff: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`
};
const starSVG = on => `<svg class="star ${on ? "on" : ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.7.8-5 4.6 1.4 6.7L12 17.4 6 20.8l1.4-6.7-5-4.6 6.7-.8z"/></svg>`;
const starsHTML = n => [0, 1, 2].map(i => starSVG(i < n)).join("");
const BURST = (() => { const p = []; for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, r = i % 2 ? .6 : 1; p.push((105 + Math.cos(a) * 100 * r).toFixed(1) + "," + (75 + Math.sin(a) * 70 * r).toFixed(1)); } return p.join(" "); })();
