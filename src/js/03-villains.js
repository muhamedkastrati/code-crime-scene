/* ---------- villains, badges, extra icons ---------- */
const VG = body => `<svg class="vil" viewBox="0 0 140 150" aria-hidden="true"><g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
const VIL = {
  peel: () => VG(`<path d="M66 34q-8-16 0-26q9 0 9 24" fill="#7a5a2a"/>
<path d="M56 50q-34 8-46 70q22-8 32-34q-8 34 4 58q14-22 14-56z" fill="var(--yellow)"/>
<path d="M84 50q34 8 46 70q-22-8-32-34q8 34-4 58q-14-22-14-56z" fill="var(--yellow)"/>
<path d="M50 56q20-40 40 0q6 46-20 82q-26-36-20-82z" fill="#fff3b0"/>
<circle cx="62" cy="74" r="5" fill="${INK}" stroke="none"/><circle cx="80" cy="74" r="5" fill="${INK}" stroke="none"/>
<path d="M55 63l12 4M87 63l-12 4" stroke-width="3.5"/>
<path d="M58 94q12 10 26-2" fill="none"/><path d="M80 93l5-4" fill="none" stroke-width="3"/>
<circle cx="40" cy="112" r="3" fill="#7a5a2a" stroke="none"/><circle cx="104" cy="104" r="3" fill="#7a5a2a" stroke="none"/>`),
  cat: () => VG(`<path d="M28 66L34 18L64 46z" fill="#ff9a3d"/><path d="M112 66L106 18L76 46z" fill="#ff9a3d"/>
<path d="M36 52L39 30L54 45z" fill="var(--pink)" stroke-width="2.5"/><path d="M104 52L101 30L86 45z" fill="var(--pink)" stroke-width="2.5"/>
<ellipse cx="70" cy="84" rx="50" ry="44" fill="#ff9a3d"/>
<path d="M60 44l4 14M70 42v16M80 44l-4 14" stroke-width="4"/>
<path d="M38 76q14-12 28 0q-14 9-28 0z" fill="var(--mint)"/><path d="M74 76q14-12 28 0q-14 9-28 0z" fill="var(--mint)"/>
<path d="M52 69v14M88 69v14" stroke-width="4.5"/>
<path d="M63 96h14l-7 8z" fill="var(--pink)"/>
<path d="M70 104q-6 9-15 4M70 104q6 9 15 4" fill="none"/>
<path d="M30 92l-22-4M30 100l-22 4M110 92l22-4M110 100l22 4" fill="none" stroke-width="3"/>
<rect x="44" y="124" width="52" height="18" rx="3" fill="#fff"/><path d="M50 130h40M50 136h28" stroke-width="2.5"/>`),
  ghost: () => VG(`<path d="M28 142V70a42 42 0 0184 0v72l-14-12-14 12-14-12-14 12-14-12z" fill="#fff"/>
<path d="M28 96q-18 2-20 20M112 96q18 2 20 20" fill="none"/>
<ellipse cx="55" cy="72" rx="8" ry="13" fill="${INK}"/><ellipse cx="85" cy="72" rx="8" ry="13" fill="${INK}"/>
<circle cx="57" cy="67" r="2.5" fill="#fff" stroke="none"/><circle cx="87" cy="67" r="2.5" fill="#fff" stroke="none"/>
<ellipse cx="70" cy="104" rx="9" ry="12" fill="${INK}"/>
<path d="M40 52q6-8 14-10" fill="none" stroke="#c9d6ff" stroke-width="5"/>`),
  robot: () => VG(`<path d="M70 28V14" fill="none"/><circle cx="70" cy="11" r="6" fill="var(--red)"/>
<rect x="18" y="46" width="12" height="26" rx="3" fill="#9b6bff"/><rect x="110" y="46" width="12" height="26" rx="3" fill="#9b6bff"/>
<rect x="28" y="28" width="84" height="66" rx="9" fill="#c9c3e6"/>
<rect x="40" y="40" width="60" height="38" rx="5" fill="#2b2a35"/>
<rect x="50" y="49" width="12" height="10" fill="#21e07b" stroke="none"/><rect x="78" y="49" width="12" height="10" fill="#21e07b" stroke="none"/>
<path d="M54 69h8m6 0h6m6 0h6" stroke="#21e07b" stroke-width="3.5"/>
<circle cx="35" cy="35" r="2.5" fill="${INK}" stroke="none"/><circle cx="105" cy="35" r="2.5" fill="${INK}" stroke="none"/><circle cx="35" cy="87" r="2.5" fill="${INK}" stroke="none"/><circle cx="105" cy="87" r="2.5" fill="${INK}" stroke="none"/>
<rect x="60" y="94" width="20" height="8" fill="#6b6982"/>
<rect x="34" y="102" width="72" height="44" rx="6" fill="#9b6bff"/>
<text x="70" y="131" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="16" fill="#fff" stroke="none">1998</text>
<circle cx="96" cy="112" r="4" fill="#b5793e" stroke="none" opacity=".8"/><circle cx="44" cy="138" r="3" fill="#b5793e" stroke="none" opacity=".8"/>`),
  clock: () => clockSVG()
};
const villainSVG = lv => VIL[lv.villain.svg]();

let gid = 0;
const TIER_C = ["#e0995a", "#d5dbe6", "#ffd23f", "#9feaff"];
const tierOf = r => r < 3 ? 0 : r < 5 ? 1 : r < 7 ? 2 : r < 9 ? 3 : 4;
function badgeSVG(r, cls) {
  const tier = tierOf(r), id = "rbw" + (++gid), fill = tier === 4 ? `url(#${id})` : TIER_C[tier];
  return `<svg class="badge ${cls || ""}" viewBox="0 0 64 66" aria-hidden="true">${tier === 4 ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4b4b"/><stop offset=".25" stop-color="#ffd23f"/><stop offset=".5" stop-color="#21b36b"/><stop offset=".75" stop-color="#2f9bff"/><stop offset="1" stop-color="#9b6bff"/></linearGradient></defs>` : ""}
<g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
${tier >= 2 ? `<path d="M16 46l-8 16 10-2 4 6 8-14M48 46l8 16-10-2-4 6-8-14" fill="${tier >= 3 ? "var(--red)" : "var(--blue)"}"/>` : ""}
<path d="M32 3L57 11V29Q57 49 32 60Q7 49 7 29V11Z" fill="${fill}"/>
<path d="M32 11L49 16.5V30Q49 43 32 51Q15 43 15 30V16.5Z" fill="rgba(255,255,255,.5)" stroke-width="2"/>
<text x="32" y="41" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="24" fill="${INK}" stroke="none">${r + 1}</text></g></svg>`;
}
Object.assign(ICON, {
  timer: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13.5" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 9v5l3 2M9 2.5h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  bug: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="14" rx="6" ry="7" fill="currentColor"/><circle cx="12" cy="6.5" r="3.2" fill="currentColor"/><path d="M6 11L2 9M6 15H2M6 18l-3 2M18 11l4-2M18 15h4M18 18l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  duck: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7q3-1 4 1q1-5 6-5t5 5q0 3-3 5h3q4 0 4 4q-2 5-10 5t-9-6q0-3 3-4q-3 0-3-5z" fill="currentColor"/></svg>`,
  eyeOff: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12q10-12 20 0q-10 12-20 0z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M3 21L21 3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  coin: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7v10M9 9.5h4.5a1.8 1.8 0 010 3.6h-3a1.8 1.8 0 000 3.6H15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  speed: `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5l8 7-8 7zM12 5l8 7-8 7z" fill="currentColor"/></svg>`
});
