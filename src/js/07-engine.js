/* ---------- points & ranks ---------- */
const RANKS = [[0, "Trainee", "Azubi"], [40, "Rookie Detective", "Junge Spürnase"], [120, "Street Sleuth", "Straßen-Spürnase"], [250, "Detective", "Spurenleser-Ass"],
  [450, "Senior Detective", "Erfahrene Spürnase"], [750, "Inspector", "Lupen-Ass"], [1150, "Chief Inspector", "Chef-Lupe"], [1700, "Commissioner", "Kommissariats-Ass"],
  [2500, "Mastermind Hunter", "Schrecken der Drahtzieher"], [3600, "Legend of Code City", "Legende von Code City"], [5000, "Bug Whisperer", "Bug-Orakel"]]
  .map(([at, en, de]) => ({ at, name: { en, de } }));
const MAXPTS = LEVELS.reduce((a, l) => a + l.base * 3 * l.cases.length, 0);
const LVOF = {}; LEVELS.forEach((l, li) => l.cases.forEach(c => { LVOF[c.id] = li; }));
const points = () => Object.entries(S.solved).reduce((a, [id, st]) => a + (LVOF[id] != null ? LEVELS[LVOF[id]].base * st : 0), 0);
const rankOf = p => { let r = 0; RANKS.forEach((k, i) => { if (p >= k.at) r = i; }); return r; };
const rankPct = p => { const r = rankOf(p), nx = RANKS[r + 1]; return nx ? Math.round((p - RANKS[r].at) / (nx.at - RANKS[r].at) * 100) : 100; };
const nextText = p => { const nx = RANKS[rankOf(p) + 1]; return nx ? tf("nextAt", { n: nx.at, r: L(nx.name) }) : t("maxRank"); };
const lvSolved = li => LEVELS[li].cases.filter(c => S.solved[c.id] != null).length;
const lvStars = li => LEVELS[li].cases.reduce((a, c) => a + (S.solved[c.id] || 0), 0);
const lvCaught = li => S.solved[LEVELS[li].cases[LEVELS[li].cases.length - 1].id] != null;
const bugRange = lv => { const n = lv.cases.map(c => c.bugs.length), a = Math.min(...n), b = Math.max(...n); return a === b ? String(a) : `${a}–${b}`; };
const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const wantOf = c => typeof c.want === "function" ? c.want(S.code) : c.want;
const outsOf = steps => steps.filter(s => s.out != null && s.end !== "crash").map(s => s.out);
const lookOf = (li, i) => (li * 3 + i) % LOOKS.length;
const caseLabel = (lv, i) => lv.cases[i].final ? t("finale") : `${t("caseN")} ${i + 1}`;
const fileName = (lv, i) => { const n = lv.cases[i].final ? lv.villain.svg : lv.id + "_" + (i + 1); return S.code === "py" ? n + ".py" : S.code === "java" ? n[0].toUpperCase() + n.slice(1).replace(/_/g, "") + ".java" : n + ".js"; };
function actualText(c) {
  const st = c.sim(new Set(), S.code), o = outsOf(st), end = (st.find(s => s.end) || {}).end;
  return o.join(", ") + (end === "loop" ? `${o.length ? ", " : ""}… (${t("neverEnds")})` : end === "crash" ? `${o.length ? ", " : ""}💥 (${t("crashes")})` : "");
}
function rulesHTML(lv) {
  return [`<span>${ICON.bug} ${tf("bugsN", { n: bugRange(lv) })}</span>`,
    `<span>${ICON.timer} ${lv.time ? fmtTime(lv.time) + " " + t("perCase") : t("noTimer")}</span>`,
    `<span>${ICON.duck} ${lv.hints === 0 ? t("noHints") : lv.hints === 1 ? t("hintsN1") : tf("hintsN", { n: lv.hints })}</span>`,
    lv.hide ? `<span>${ICON.eyeOff} ${t("noValues")}</span>` : "",
    `<span>${ICON.coin} ${tf("ptsPerStar", { n: lv.base })}</span>`].join("");
}

/* ---------- app state ---------- */
const app = $("#app");
let screen = "title", LV = 0, G = null, ovFn = null, justRevealed = null;

function renderTop() {
  document.documentElement.lang = S.ui;
  const p = points(), r = rankOf(p);
  $("#top").innerHTML = `<button class="brand" data-act="home">${ICON.lens}<span>${t("brand")}</span></button>
  <button class="rank-chip" data-act="ladder" aria-label="${t("ladder")}: ${esc(L(RANKS[r].name))}, ${p} ${t("pts")}">${badgeSVG(r)}<span class="rc-name">${esc(L(RANKS[r].name))}</span><span class="rc-pts">${p} ${t("pts")}</span></button>
  <div class="settings">
    <div class="seg" role="group" aria-label="${t("siteLang")}"><span class="seg-l">${t("siteLang")}</span>${["en", "de"].map(l => `<button data-act="ui" data-v="${l}" aria-pressed="${S.ui === l}">${l.toUpperCase()}</button>`).join("")}</div>
    <div class="seg" role="group" aria-label="${t("codeLang")}"><span class="seg-l">${t("codeLang")}</span>${[["py", "Python"], ["java", "Java"], ["js", "JavaScript"]].map(([k, n]) => `<button data-act="code" data-v="${k}" aria-pressed="${S.code === k}">${n}</button>`).join("")}</div>
    <button class="snd" data-act="sound" aria-pressed="${S.sound}" aria-label="${t("sound")}" title="${t("sound")}">${S.sound ? ICON.sOn : ICON.sOff}</button>
  </div>`;
}
function render() {
  renderTop();
  if (screen === "scene" && G) renderScene();
  else if (screen === "board") renderBoard();
  else if (screen === "levels") renderLevels();
  else if (screen === "lvlend") renderLvlEnd();
  else { screen = "title"; renderTitle(); }
}

/* ---------- title ---------- */
function renderTitle() {
  const any = Object.keys(S.solved).length > 0;
  app.innerHTML = `<section class="title-screen">
    <div class="cover panel"><div class="rays" aria-hidden="true"></div>
      <div class="cover-in">
        <div class="issue">${t("issue")}</div>
        <h1 class="logo">${t("brand")}</h1>
        <div class="cover-art">
          <div class="cover-duck">${DUCK}</div>
          <div class="lineup" aria-hidden="true">${LEVELS.map((lv, i) => `<div class="lu ${lvCaught(i) ? "" : "sil"}" style="--d:${i * .15}s;--lc:${lv.color}">${villainSVG(lv)}</div>`).join("")}</div>
        </div>
        <button class="btn big" data-act="start">${any ? t("cont") : t("start")}</button>
      </div>
    </div>
    <div class="story">${[1, 2, 3].map(i => `<div class="caption panel" style="--d:${i * .12}s"><p>${t("story" + i)}</p></div>`).join("")}</div>
    <div class="how panel"><h2>${t("howTitle")}</h2><ol>${[1, 2, 3, 4].map(i => `<li>${t("how" + i)}</li>`).join("")}</ol></div>
  </section>`;
}

/* ---------- levels ---------- */
function rankCard() {
  const p = points(), r = rankOf(p);
  return `<div class="rank-card panel">${badgeSVG(r, "big")}<div class="rk-body"><div class="lbl">${t("yourRank")}</div><div class="rk-name">${esc(L(RANKS[r].name))}</div>
    <div class="bar"><i style="width:${rankPct(p)}%"></i></div><div class="small">${p} ${t("pts")} · ${esc(nextText(p))}</div></div>
    <button class="btn ghost small" data-act="ladder">${t("ladder")}</button></div>`;
}
function renderLevels() {
  app.innerHTML = `<section class="levels-screen">
    ${rankCard()}
    <h2 class="h-display lv-h">${t("chooseLevel")}</h2>
    <div class="lv-grid">${LEVELS.map((lv, li) => { const n = lvSolved(li), caught = lvCaught(li), nm = esc(L(lv.name));
      return `<button class="lv-card ${lv.hide ? "glitch" : ""} ${caught ? "caught" : ""}" data-act="level" data-i="${li}" style="--lc:${lv.color};--d:${li * .08}s">
        <span class="lv-band"><span class="lv-name" data-text="${nm}">${nm}</span></span>
        <span class="lv-vil ${caught ? "" : "sil"}">${villainSVG(lv)}</span>
        <span class="lv-who">${caught ? esc(L(lv.villain.name)) : t("unknownMastermind")}</span>
        <span class="lv-rules">${rulesHTML(lv)}</span>
        <span class="lv-prog"><span class="bar"><i style="width:${n * 10}%"></i></span><span>${n}/10</span><span class="lv-stars">${starSVG(true)} ${lvStars(li)}/30</span></span>
        ${caught ? `<span class="mini-stamp">${t("arrested")}</span>` : ""}
      </button>`; }).join("")}</div>
  </section>`;
}

/* ---------- board ---------- */
const isSolved = (lv, i) => S.solved[lv.cases[i].id] != null;
const unlocked = (lv, i) => i === 0 || isSolved(lv, i - 1);
function renderBoard() {
  const lv = LEVELS[LV], cs = lv.cases, caught = lvCaught(LV);
  const tiles = cs.slice(0, 9).map(c => `<div class="tile ${S.solved[c.id] != null ? (c.id === justRevealed ? "reveal" : "gone") : ""}">?</div>`).join("");
  const notes = cs.slice(0, 9).filter(c => S.solved[c.id] != null).map(c => `<li>“${esc(L(c.card))}”</li>`).join("");
  app.innerHTML = `<section class="board-screen" style="--lc:${lv.color}">
    <div>
      <div class="files-head"><button class="btn ghost small" data-act="levels">← ${t("levels")}</button>
        <h2 class="h-display">${t("files")} <span class="lv-tag ${lv.hide ? "glitch-tag" : ""}">${esc(L(lv.name))}</span></h2>
        <div class="star-total">${starSVG(true)} ${lvStars(LV)} / 30</div></div>
      <div class="lv-rules inline">${rulesHTML(lv)}</div>
      <div class="cards">${cs.map((c, i) => {
        const st = S.solved[c.id], open = unlocked(lv, i);
        return `<button class="case-card ${st != null ? "solved" : ""} ${open ? "" : "locked"} ${c.final ? "final" : ""}" data-act="open" data-i="${i}" ${open ? "" : "disabled"} style="--d:${i * .05}s">
          <span class="case-no">${caseLabel(lv, i)}</span>
          <span class="case-title">${esc(L(c.title))}</span>
          <span class="case-who">${esc(L(c.who))}</span>
          <span class="case-foot">${open ? (st != null ? starsHTML(st) : `<span class="open-tag">${t("solve")} →</span>`) : `${ICON.lock} ${t("locked")}`}<span class="cb">${ICON.bug}×${c.bugs.length}</span></span>
          ${st != null ? `<span class="mini-stamp">${t("closedShort")}</span>` : ""}
        </button>`; }).join("")}</div>
    </div>
    <aside class="poster panel ${caught ? "caught" : ""}">
      <div class="poster-title">${t("wanted")}</div>
      <div class="poster-art">${villainSVG(lv)}<div class="tiles">${caught ? "" : tiles}</div>${caught ? `<div class="arrest">${t("arrested")}</div>` : ""}</div>
      <div class="poster-name">${caught ? esc(L(lv.villain.name)) : t("wantedUnknown")}</div>
      <p class="small">${t("piecesHint")}</p>
      ${notes ? `<div class="found"><div class="found-h">${t("foundCards")}</div><ul>${notes}</ul></div>` : ""}
    </aside>
  </section>`;
  justRevealed = null;
}

/* ---------- overlays ---------- */
function overlay(html) {
  document.querySelectorAll(".overlay").forEach(o => o.remove());
  const o = document.createElement("div"); o.className = "overlay"; o.innerHTML = html;
  o.addEventListener("click", e => { if (e.target === o && !o.querySelector(".closed")) closeOverlay(); });
  document.body.appendChild(o); return o;
}
function closeOverlay() { ovFn = null; document.querySelectorAll(".overlay").forEach(o => o.remove()); }
function openIntro(i) {
  const lv = LEVELS[LV], c = lv.cases[i];
  ovFn = () => openIntro(i);
  const o = overlay(`<div class="intro panel" role="dialog" aria-modal="true" aria-label="${esc(L(c.title))}" style="--lc:${lv.color}">
    <div class="intro-head"><span class="case-no">${caseLabel(lv, i)} · ${esc(L(lv.name))}</span><h2 class="h-display">${esc(L(c.title))}</h2></div>
    <div class="witness">${faceSVG(lookOf(LV, i))}<div style="flex:1;min-width:0"><div class="w-name">${esc(L(c.who))}</div><div class="bubble big" id="iq"></div></div></div>
    <div class="evidence-row">
      <div class="ev ok"><span>${t("expected")}</span><code>${esc(wantOf(c).join(", "))}</code></div>
      <div class="ev bad"><span>${t("actual")}</span><code>${esc(actualText(c))}</code></div>
    </div>
    <div class="lv-rules inline">${ICON.bug} ×${c.bugs.length} ${(c.time || lv.time) ? `<span>${ICON.timer} ${fmtTime(c.time || lv.time)}</span>` : ""}${lv.hide ? `<span>${ICON.eyeOff} ${t("noValues")}</span>` : ""}</div>
    ${c.final ? `<div class="taunt">${villainSVG(lv)}<p>${esc(t("taunts")[lv.id])}</p></div>` : ""}
    <div class="intro-actions"><button class="btn ghost" data-act="close-ov">${t("back")}</button><button class="btn big" data-act="enter" data-i="${i}">${t("enter")}</button></div>
  </div>`);
  typeText($("#iq", o), L(c.quote), 18);
  sfx("pop");
  setTimeout(() => $('[data-act="enter"]', o)?.focus({ preventScroll: true }), 50);
}
function openLadder() {
  ovFn = openLadder;
  const p = points(), r = rankOf(p);
  overlay(`<div class="ladder panel" role="dialog" aria-modal="true" aria-label="${t("ladder")}">
    <div class="ladder-head"><h2 class="h-display">${t("ladder")}</h2><button class="btn ghost small" data-act="close-ov" aria-label="✕">${ICON.x}</button></div>
    <p class="small">${t("ladderHow")}</p>
    <div class="bar big"><i style="width:${Math.round(p / MAXPTS * 100)}%"></i></div><div class="small">${p} / ${MAXPTS} ${t("pts")}</div>
    <ol class="rungs">${RANKS.map((k, i) => `<li class="${i < r ? "done" : i === r ? "cur" : "todo"}" style="--d:${(RANKS.length - i) * .04}s">${badgeSVG(i)}<span class="rg-name">${esc(L(k.name))}</span>${i === r ? `<span class="you">${t("you")}</span>` : ""}<span class="rg-at">${k.at} ${t("pts")}</span></li>`).reverse().join("")}</ol>
  </div>`);
  sfx("pop");
}

/* ---------- scene ---------- */
function startCase(i) {
  closeOverlay();
  const lv = LEVELS[LV], c = lv.cases[i];
  G = { li: LV, lv, i, c, fixed: new Set(), stars: 3, hint: 0, hintsMax: Math.min(lv.hints, c.hints.length), steps: [], si: -1, playing: false, mode: "look", fixTag: null, vars: {}, closed: false,
        order: {}, tried: new Set(), fast: false, time: c.time || lv.time || null, lastSay: lv.hide ? "duckStartHidden" : "duckStart", clock: null, tid: null };
  screen = "scene"; render();
  if (G.time) startClock();
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}
function leaveScene() { if (G) { pause(); stopClock(); } G = null; }

function renderScene() {
  const { c, i, lv } = G, hl0 = G.hintsMax - G.hint;
  app.innerHTML = `<section class="scene" style="--lc:${lv.color}">
    <div class="scene-head">
      <button class="btn ghost small" data-act="board">← ${t("files")}</button>
      <div class="sh-title"><span class="case-no">${caseLabel(lv, i)} · <span class="lv-dot"></span>${esc(L(lv.name))}</span><h2 class="h-display">${esc(L(c.title))}</h2></div>
      <div class="sh-right">${G.time ? `<div class="deadline" id="deadline" aria-live="off">${lv.hide ? clockSVG() : ICON.timer}<span id="clock-t"></span></div>` : ""}<div class="stars" id="stars">${starsHTML(G.stars)}</div></div>
    </div>
    <div class="scene-grid">
      <div class="col-main">
        <div class="report panel">${faceSVG(lookOf(G.li, i))}
          <div class="report-body"><div class="w-name">${esc(L(c.who))}</div><p>${esc(L(c.quote))}</p>
            <div class="evidence-row"><div class="ev ok"><span>${t("expected")}</span><code>${esc(wantOf(c).join(", "))}</code></div><div class="ev bad"><span>${t("actual")}</span><code>${esc(actualText(c))}</code></div></div>
          </div>
        </div>
        <div class="toolbar">
          <button class="btn" id="b-play" data-act="play"></button>
          <button class="btn ghost" data-act="step">${t("step")}</button>
          <button class="btn ghost" data-act="rewind">${t("rewind")}</button>
          <button class="btn ghost spd" data-act="speed" aria-label="${t("speed")}" title="${t("speed")}">${ICON.speed}<span>${S.speed}×</span></button>
          <span class="sp"></span>
          <button class="btn red" id="b-acc" data-act="accuse" aria-pressed="false">${ICON.lens}<span>${t("accuse")}</span></button>
        </div>
        <div class="code-panel panel" id="codep" data-mode="look">
          <div class="tape" aria-hidden="true"><span>${t("tape").repeat(12)}</span></div>
          <div class="code-head"><span class="file">${fileName(lv, i)}</span><span class="mode-hint" id="mode-hint"></span></div>
          <div class="code-wrap" id="cwrap">
            <div class="marker" id="marker">${ICON.marker}</div>
            <div class="lines" id="lines"></div>
            <div class="cond" id="cond" hidden></div>
            <div class="lens" id="lens" hidden aria-hidden="true"><div class="glass"><div class="lens-in" id="lens-in"></div></div></div>
          </div>
        </div>
        <div class="fixes" id="fixes" hidden></div>
      </div>
      <aside class="col-side">
        <div class="board-ev panel"><h3>${t("evidence")}</h3><div class="notes" id="notes"></div></div>
        <div class="printout panel"><h3>${t("output")}</h3><div class="paper" id="paper" aria-live="polite"></div><div class="verdict" id="verdict"></div></div>
        <div class="duck-box"><div class="duck" id="duck">${DUCK}</div><div class="bubble" id="duck-say" aria-live="polite"></div></div>
        <button class="btn ghost hint-btn" data-act="hint" ${G.hintsMax ? "" : "disabled"}>${G.hintsMax ? `${t("hint")} (${hl0}) <small>${t("cost")}</small>` : t("noHintsLevel")}</button>
      </aside>
    </div>
  </section>`;
  rebuildCode();
  resetTrace();
  setMode(G.fixTag ? "fix" : G.mode === "accuse" ? "accuse" : "look");
  if (G.fixTag) showFixes(false);
  say(G.lastSay);
  paintClock();
  const cw = $("#cwrap");
  cw.addEventListener("pointermove", lensMove);
  cw.addEventListener("pointerleave", () => { const l = $("#lens"); if (l) l.hidden = true; });
}

function codeLines(c, lang, fixed) {
  const out = [];
  for (const raw of c.code[lang]) {
    let [text, tag] = Array.isArray(raw) ? raw : [raw, ""], state = "";
    if (tag && c.bugs.includes(tag) && fixed.has(tag)) {
      const ok = c.fixes[tag].find(f => f.ok);
      if (ok.code === null) continue;
      text = text.match(/^\s*/)[0] + ok.code[lang].trimStart(); state = "fixed";
    }
    out.push({ text, tag, state });
  }
  return out;
}
function rebuildCode(justTag) {
  G.lines = codeLines(G.c, S.code, G.fixed);
  G.tagIdx = {};
  G.lines.forEach((l, i) => { if (l.tag && !(l.tag in G.tagIdx)) G.tagIdx[l.tag] = i; });
  const el = $("#lines");
  el.innerHTML = G.lines.map((l, i) => `<button class="ln ${l.state} ${justTag && l.tag === justTag && l.state ? "just" : ""}" type="button" data-act="line" data-i="${i}"><span class="no">${i + 1}</span><code>${hl(l.text, S.code) || " "}</code></button>`).join("");
  if (G.hint >= 2) markWarm();
  refreshLens();
}
function refreshLens() { const el = $("#lines"), li = $("#lens-in"); if (el && li) li.innerHTML = el.outerHTML.replace(' id="lines"', ""); }
function markWarm() { for (const b of G.c.bugs) if (!G.fixed.has(b) && G.tagIdx[b] != null) $("#lines").children[G.tagIdx[b]].classList.add("warm"); }

function setMode(m) {
  G.mode = m;
  const p = $("#codep"); if (!p) return;
  p.dataset.mode = m;
  const b = $("#b-acc"); b.setAttribute("aria-pressed", String(m === "accuse")); b.classList.toggle("on", m === "accuse"); b.disabled = m === "fix";
  $("#mode-hint").textContent = m === "accuse" ? t("accuseOn") : m === "fix" ? t("pickFix") : "";
  if (m !== "accuse") $("#lens").hidden = true;
  updatePlayBtn();
}
function updatePlayBtn() { const b = $("#b-play"); if (b) b.innerHTML = G.playing ? `${ICON.pause}<span>${t("pause")}</span>` : `${ICON.play}<span>${t("reconstruct")}</span>`; }

function say(x) {
  if (!G) return; G.lastSay = x;
  const el = $("#duck-say"); if (!el) return;
  const txt = typeof x === "string" ? (T.en[x] !== undefined ? t(x) : x) : L(x);
  typeText(el, txt, 15);
  const d = $("#duck"); d.classList.remove("talk"); void d.offsetWidth; d.classList.add("talk");
}

/* trace playback */
function resetTrace() {
  if (!G) return;
  pause();
  G.steps = G.c.sim(G.fixed, S.code); G.si = -1; G.vars = {};
  const n = $("#notes"); if (n) n.innerHTML = `<p class="empty">${G.lv.hide ? t("hiddenVals") : t("noVars")}</p>`;
  const p = $("#paper"); if (p) p.innerHTML = "";
  const v = $("#verdict"); if (v) v.innerHTML = "";
  $("#marker")?.classList.remove("show");
  const c = $("#cond"); if (c) c.hidden = true;
  document.querySelectorAll(".ln.cur").forEach(e => e.classList.remove("cur"));
  $("#codep")?.classList.remove("siren");
}
function pause() { if (!G) return; G.playing = false; clearTimeout(G.tid); updatePlayBtn(); }
function play() {
  if (G.playing) { pause(); return; }
  if (G.si >= G.steps.length - 1) resetTrace();
  G.playing = true; updatePlayBtn(); loopTick();
}
function loopTick() {
  if (!G || !G.playing) return;
  if (!stepFwd()) { G.playing = false; updatePlayBtn(); onTraceEnd(); return; }
  G.tid = setTimeout(loopTick, 780 / (S.speed * (G.fast ? 2 : 1)));
}
function stepBtn() {
  pause();
  if (G.si >= G.steps.length - 1) resetTrace();
  stepFwd();
  if (G.si >= G.steps.length - 1) onTraceEnd();
}
function siren(word, sound) {
  const p = $("#codep"); p.classList.remove("siren"); void p.offsetWidth; p.classList.add("siren");
  const r = p.getBoundingClientRect(); burst(word, r.left + r.width / 2, r.top + 80, "red"); sfx(sound);
}
function stepFwd() {
  if (G.si >= G.steps.length - 1) return false;
  const st = G.steps[++G.si], lines = $("#lines");
  document.querySelectorAll(".ln.cur").forEach(e => e.classList.remove("cur"));
  const idx = G.tagIdx[st.t];
  if (idx != null) {
    const ln = lines.children[idx]; ln.classList.add("cur");
    const m = $("#marker"); m.classList.add("show");
    m.style.transform = `translateY(${lines.offsetTop + ln.offsetTop + (ln.offsetHeight - 28) / 2}px)`;
    showCond(G.lv.hide ? null : st.cond, ln);
    if (st.end === "crash") { ln.classList.add("boom"); setTimeout(() => ln.classList.remove("boom"), 1200); }
  }
  if (st.v) { Object.assign(G.vars, st.v); renderNotes(Object.keys(st.v)); }
  if (st.end === "crash") { printLine(st.out, "crash"); siren(t("crash"), "crash"); }
  else if (st.out != null) printLine(st.out);
  if (st.end === "loop") { printLine("… ∞", "more"); siren(t("loop"), "loop"); }
  else if (st.end !== "crash") sfx("step");
  return true;
}
function showCond(text, ln) {
  const c = $("#cond");
  if (!text) { c.hidden = true; return; }
  const wrap = $("#cwrap"), code = ln.querySelector("code"), wr = wrap.getBoundingClientRect(), cr = code.getBoundingClientRect();
  c.hidden = false; c.textContent = text;
  c.style.left = (cr.right - wr.left + wrap.scrollLeft + 16) + "px";
  c.style.top = (cr.top - wr.top + wrap.scrollTop + cr.height / 2) + "px";
  c.style.animation = "none"; void c.offsetWidth; c.style.animation = "";
}
const NOTE_C = ["var(--yellow)", "var(--pink)", "var(--sky)"];
function renderNotes(changed) {
  const box = $("#notes"); box.querySelector(".empty")?.remove();
  Object.entries(G.vars).forEach(([k, v], i) => {
    let n = box.querySelector(`[data-k="${k}"]`), fresh = false;
    if (!n) {
      fresh = true; n = document.createElement("div"); n.className = "note new"; n.dataset.k = k;
      n.style.setProperty("--r", (((i * 37) % 7) - 3) + "deg"); n.style.setProperty("--nc", NOTE_C[i % 3]);
      n.innerHTML = `<span class="k">${esc(k)}</span><span class="v"></span>`; box.appendChild(n);
      setTimeout(() => n.classList.remove("new"), 450);
    }
    const ve = n.querySelector(".v"), shown = G.lv.hide ? "?" : v;
    if (n.dataset.v !== v) {
      n.dataset.v = v; ve.textContent = shown; ve.classList.toggle("txt", !G.lv.hide && v.startsWith('"')); ve.classList.toggle("hid", G.lv.hide);
      if (!fresh && changed.includes(k)) { n.classList.remove("flip"); void n.offsetWidth; n.classList.add("flip"); }
    }
  });
}
function printLine(txt, cls) {
  const d = document.createElement("div"); d.className = "pl" + (cls ? " " + cls : "");
  $("#paper").appendChild(d); typeText(d, txt, cls === "crash" ? 12 : 40, true);
}
function onTraceEnd() {
  if (!G || G.closed) return;
  const end = (G.steps.find(s => s.end) || {}).end;
  const ok = !end && outsOf(G.steps).join("|") === wantOf(G.c).join("|");
  $("#verdict").innerHTML = ok ? `<span class="chip good">${ICON.check} ${t("match")}</span>` : `<span class="chip bad">${ICON.x} ${t("nomatch")}</span>`;
  if (ok && G.fixed.size === G.c.bugs.length) closeCase();
  else if (!ok && G.mode === "look") say(end === "loop" ? "duckLoop" : end === "crash" ? "duckCrash" : "duckAfterRun");
}

/* accusing */
function onLine(i, el) {
  if (!G || G.closed || G.mode === "fix") return;
  if (G.mode !== "accuse") { setMode("accuse"); say("duckMagnifier"); sfx("pop"); return; }
  const l = G.lines[i];
  if (l.tag && G.c.bugs.includes(l.tag) && !G.fixed.has(l.tag)) {
    pause();
    el.classList.add("guilty");
    const r = el.getBoundingClientRect();
    burst(t("gotcha"), r.left + Math.min(r.width / 2, 260), r.top - 10, "yellow"); sfx("gotcha");
    G.fixTag = l.tag; setMode("fix"); say("duckRight"); showFixes(true);
  } else {
    loseStar(); sfx("wrong");
    el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    alibi(el);
  }
}
function alibi(el) {
  document.querySelectorAll(".cond.alibi").forEach(a => a.remove());
  const wrap = $("#cwrap"), code = el.querySelector("code"), wr = wrap.getBoundingClientRect(), cr = code.getBoundingClientRect();
  const a = document.createElement("div"); a.className = "cond alibi";
  const list = t("alibis"); a.textContent = list[Math.random() * list.length | 0];
  a.style.left = (cr.right - wr.left + wrap.scrollLeft + 16) + "px";
  a.style.top = (cr.top - wr.top + wrap.scrollTop + cr.height / 2) + "px";
  wrap.appendChild(a); setTimeout(() => a.remove(), 1700);
}
function loseStar() {
  const box = $("#stars"); if (!box) return;
  if (G.stars > 1) {
    const on = box.querySelectorAll(".star.on"); on[on.length - 1].classList.add("lost");
    G.stars--; setTimeout(() => { if ($("#stars") && G) $("#stars").innerHTML = starsHTML(G.stars); }, 620);
  } else { box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); }
}
function showFixes(anim) {
  const tag = G.fixTag, fx = G.c.fixes[tag];
  const order = G.order[tag] || (G.order[tag] = shuffle(fx.map((f, i) => i)));
  const box = $("#fixes"); box.hidden = false;
  box.innerHTML = `<h3 class="h-display">${t("pickFix")}</h3><div class="fix-grid">${order.map((oi, k) => {
    const f = fx[oi], tried = G.tried.has(tag + oi);
    return `<button class="fix-card ${tried ? "wrong" : ""} ${anim ? "deal" : ""}" style="--d:${k * .1}s" data-act="fix" data-o="${oi}" ${tried ? "disabled" : ""}>
      <span class="fix-letter">${"ABC"[k]}</span>
      ${f.code === null ? `<span class="del">${ICON.trash} ${t("deleteLine")}</span>` : `<code>${hl(f.code[S.code].trimStart(), S.code)}</code>`}
      ${f.why ? `<span class="why" ${tried ? "" : "hidden"}>${esc(L(f.why))}</span>` : ""}
    </button>`; }).join("")}</div>`;
  if (anim) setTimeout(() => box.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }), 120);
}
function onFix(oi, el) {
  if (!G || !G.fixTag) return;
  const tag = G.fixTag, f = G.c.fixes[tag][oi];
  if (!f.ok) {
    G.tried.add(tag + oi); el.classList.add("wrong"); el.disabled = true;
    el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    const w = el.querySelector(".why"); if (w) w.hidden = false;
    loseStar(); sfx("wrong"); say("duckWrongFix");
    return;
  }
  sfx("fix");
  const lnEl = $("#lines").children[G.tagIdx[tag]], r = lnEl.getBoundingClientRect();
  burst(t("zap"), r.left + Math.min(r.width / 2, 240), r.top - 10, "green");
  $("#fixes").hidden = true; G.fixTag = null; setMode("look");
  const go = () => {
    if (!G) return;
    G.fixed.add(tag); rebuildCode(tag); resetTrace();
    if (G.fixed.size < G.c.bugs.length) say("duckOneMore");
    else { say("duckFinal"); G.fast = true; setTimeout(() => G && !G.closed && play(), 750); }
  };
  if (f.code === null) { lnEl.classList.add("vanish"); setTimeout(go, 520); } else go();
  window.scrollTo({ top: Math.max(0, $("#codep").getBoundingClientRect().top + scrollY - 90), behavior: reduced ? "auto" : "smooth" });
}
function hint() {
  if (!G || G.closed || !G.hintsMax) return;
  if (G.hint >= G.hintsMax) { say("noMoreHints"); return; }
  const h = G.c.hints[G.hint++]; loseStar(); say(h); sfx("pop");
  if (G.hint >= 2) markWarm();
  const b = $('[data-act="hint"]'); if (b) b.innerHTML = `${t("hint")} (${G.hintsMax - G.hint}) <small>${t("cost")}</small>`;
}

/* magnifier lens */
const finePointer = matchMedia("(pointer: fine)").matches;
function lensMove(e) {
  if (!finePointer || !G || G.mode !== "accuse") return;
  const wrap = $("#cwrap"), lines = $("#lines"), lens = $("#lens"), inner = $("#lens-in");
  const wr = wrap.getBoundingClientRect(), lr = lines.getBoundingClientRect(), R = 85, s = 1.65;
  const lx = e.clientX - lr.left, ly = e.clientY - lr.top;
  lens.hidden = false;
  lens.style.left = (e.clientX - wr.left + wrap.scrollLeft - R) + "px";
  lens.style.top = (e.clientY - wr.top + wrap.scrollTop - R) + "px";
  inner.style.width = lines.offsetWidth + "px";
  inner.style.transform = `translate(${R - lx * s}px, ${R - ly * s}px) scale(${s})`;
}

/* clock */
function startClock() {
  stopClock();
  G.clock = setInterval(() => {
    if (!G || G.closed) return;
    G.time--;
    if (G.time <= 10 && G.time > 0) sfx("tick");
    if (G.time <= 0) {
      G.time = 60; loseStar(); sfx("wrong"); say("timeUp");
      const d = $("#deadline"); if (d) { const r = d.getBoundingClientRect(); burst(t("timeBurst"), r.left + r.width / 2, r.bottom + 40, "red"); }
    }
    paintClock();
  }, 1000);
}
function stopClock() { if (G && G.clock) { clearInterval(G.clock); G.clock = null; } }
function paintClock() {
  if (!G || G.time == null) return;
  const el = $("#clock-t"); if (el) el.textContent = fmtTime(G.time);
  $("#deadline")?.classList.toggle("urgent", G.time <= 30);
}

/* closing */
function closeCase() {
  if (G.closed) return;
  G.closed = true; pause(); stopClock();
  const c = G.c, prev = S.solved[c.id], p0 = points();
  S.solved[c.id] = Math.max(prev || 0, G.stars);
  if (prev == null && !c.final) justRevealed = c.id;
  save();
  const g = G; g.p0 = p0; g.p1 = points(); g.prev = prev;
  setTimeout(() => {
    sfx("stamp"); setTimeout(() => sfx("win"), 250);
    document.body.classList.add("shake-screen"); setTimeout(() => document.body.classList.remove("shake-screen"), 500);
    confetti(); showClosed(g, true); renderTop();
  }, 650);
}
function gainHTML(g, anim) {
  const p = anim ? g.p0 : g.p1, r = rankOf(p);
  if (g.p1 === g.p0) return `<div class="gain none"><span class="small">${tf("noGain", { n: g.prev })}</span></div>`;
  return `<div class="gain"><div class="gain-n" id="gain-n">+${anim ? 0 : g.p1 - g.p0}</div>
    <div class="gain-r"><span id="gain-badge">${badgeSVG(r)}</span><div class="gain-b"><div class="rk-name" id="gain-name">${esc(L(RANKS[r].name))}</div>
      <div class="bar"><i id="gain-bar" style="width:${rankPct(p)}%"></i></div><div class="small" id="gain-txt">${p} ${t("pts")} · ${esc(nextText(p))}</div></div></div>
    <div class="rankup" id="rankup" ${!anim && rankOf(g.p0) < rankOf(g.p1) ? "" : "hidden"}>${t("rankUp")}</div></div>`;
}
function animateGain(g) {
  const nEl = $("#gain-n"); if (!nEl) return;
  const r0 = rankOf(g.p0), r1 = rankOf(g.p1), dur = reduced ? 0 : 1100, t0 = performance.now(); let lastR = r0;
  const tick = now => {
    if (!$("#gain-n")) return;
    const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3), p = Math.round(g.p0 + (g.p1 - g.p0) * e), r = rankOf(p);
    $("#gain-n").textContent = "+" + (p - g.p0);
    $("#gain-bar").style.width = rankPct(p) + "%";
    $("#gain-txt").textContent = `${p} ${t("pts")} · ${nextText(p)}`;
    if (r !== lastR) { lastR = r; $("#gain-badge").innerHTML = badgeSVG(r, "pop"); $("#gain-name").textContent = L(RANKS[r].name); }
    if (k < 1) { if (Math.random() < .35) sfx("type"); requestAnimationFrame(tick); }
    else if (r1 > r0) { const ru = $("#rankup"); if (ru) { ru.hidden = false; sfx("rankup"); confetti(); } }
  };
  setTimeout(() => requestAnimationFrame(tick), 700);
}
function showClosed(g, anim) {
  ovFn = () => showClosed(g, false);
  const { c, i, lv } = g;
  overlay(`<div class="closed panel" role="dialog" aria-modal="true" aria-label="${t("closed")}" style="--lc:${lv.color}">
    <div class="stamp">${t("closed")}</div>
    <div class="earned">${starsHTML(g.stars)}</div>
    ${gainHTML(g, anim)}
    <div class="mug">
      <div class="mug-frame ${c.final ? "vil-frame" : ""}">${c.final ? villainSVG(lv) : bugSVG(i % 6)}<div class="mug-plate">${esc(L(c.culprit))}</div></div>
      <div><div class="lbl">${t("culprit")}</div><div class="mug-name">${esc(L(c.culprit))}</div><div class="lbl">${t("lesson")}</div><p>${esc(L(c.lesson))}</p></div>
    </div>
    ${c.card ? `<div class="scrap"><div class="lbl">${t("foundCard")}</div><div class="scrap-paper">“${esc(L(c.card))}”</div></div>` : ""}
    <div class="intro-actions">
      ${c.final ? `<button class="btn big" data-act="lvlend">${t("seeEnding")}</button>`
        : `<button class="btn ghost" data-act="board">${t("files")}</button><button class="btn big" data-act="next" data-i="${i + 1}">${t("next")} →</button>`}
    </div>
  </div>`);
  if (anim) animateGain(g);
}

/* level end + grand finale */
function renderLvlEnd() {
  const lv = LEVELS[LV], last = LV === LEVELS.length - 1, all = LEVELS.every((l, i) => lvCaught(i)), p = points(), r = rankOf(p);
  app.innerHTML = `<section class="end" style="--lc:${lv.color}">
    <div class="end-hero panel"><div class="rays" aria-hidden="true"></div><div class="end-in">
      <div class="end-clock">${villainSVG(lv)}<div class="bars" aria-hidden="true"></div></div>
      <h1 class="logo small">${esc(tf("behindBars", { v: L(lv.villain.name) }))}</h1>
      <p>${esc(L(lv.villain.end))}</p>
      ${all ? `<p>${t("end1")}</p><p>${t("end2")}</p>` : ""}
      <div class="rank">${badgeSVG(r)}<div><span class="lbl" style="color:#fff">${t("yourRank")}</span><strong>${esc(L(RANKS[r].name))}</strong><span>${p} / ${MAXPTS} ${t("pts")}</span></div></div>
    </div></div>
    <div class="panel arrested-list"><h2 class="h-display">${t("bugsArrested")}</h2>
      <ul>${lv.cases.map((c, i) => `<li>${c.final ? villainSVG(lv) : bugSVG(i % 6)}<div><strong>${esc(L(c.culprit))}</strong><p>${esc(L(c.lesson))}</p></div></li>`).join("")}</ul></div>
    <div class="intro-actions">${all ? `<button class="btn ghost" data-act="reset-all">${t("playAgain")}</button>` : ""}<button class="btn ghost" data-act="levels">${t("levels")}</button>${last ? "" : `<button class="btn" data-act="level" data-i="${LV + 1}">${t("nextLevel")} →</button>`}</div>
  </section>`;
}

/* ---------- events ---------- */
function rerender() {
  if (G) pause();
  render();
  if (ovFn) ovFn();
}
const go = s => { leaveScene(); closeOverlay(); screen = s; render(); window.scrollTo(0, 0); };
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
  const a = b.dataset.act, i = +b.dataset.i;
  switch (a) {
    case "home": go("title"); break;
    case "start": case "levels": go("levels"); break;
    case "level": LV = i; go("board"); if (!lvSolved(LV)) openIntro(0); break;
    case "board": go("board"); break;
    case "open": openIntro(i); break;
    case "close-ov": closeOverlay(); break;
    case "ladder": openLadder(); break;
    case "enter": startCase(i); break;
    case "next": go("board"); openIntro(i); break;
    case "lvlend": go("lvlend"); confetti(); sfx("win"); break;
    case "ui": S.ui = b.dataset.v; save(); rerender(); break;
    case "code": S.code = b.dataset.v; save(); rerender(); break;
    case "sound": S.sound = !S.sound; save(); renderTop(); sfx("pop"); break;
    case "speed": S.speed = S.speed >= 3 ? 1 : S.speed + 1; save(); b.querySelector("span").textContent = S.speed + "×"; sfx("pop");
      if (G && G.playing) { clearTimeout(G.tid); loopTick(); } break;
    case "play": play(); break;
    case "step": stepBtn(); break;
    case "rewind": resetTrace(); break;
    case "accuse": if (G.mode === "fix") break; setMode(G.mode === "accuse" ? "look" : "accuse"); if (G.mode === "accuse") { say("duckMagnifier"); sfx("pop"); } break;
    case "line": onLine(i, b); break;
    case "fix": onFix(+b.dataset.o, b); break;
    case "hint": hint(); break;
    case "reset-all":
      if (b.dataset.armed) { S.solved = {}; save(); go("title"); }
      else { b.dataset.armed = "1"; b.textContent = t("sure"); }
      break;
  }
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  const o = $(".overlay");
  if (o && !o.querySelector(".closed")) closeOverlay();
  else if (G && G.mode === "accuse") setMode("look");
});

render();
