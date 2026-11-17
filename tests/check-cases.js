// Checks every case in all 3 languages against its simulation: data shape, expected output, and that no partial fix already matches.
const LEVELS = require("./load-cases")(); let bad = 0, n = 0; const err = (c, m) => { bad++; console.log("BAD", c.id, m); };
const subsets = bugs => { const r = []; for (let m = 0; m < (1 << bugs.length) - 1; m++) r.push(new Set(bugs.filter((_, i) => m & (1 << i)))); return r; };
const outs = st => st.filter(x => x.out !== undefined && x.end !== "crash").map(x => x.out);
for (const lv of LEVELS) { if (lv.cases.length !== 10) console.log("BAD count", lv.id, lv.cases.length);
 for (const c of lv.cases) { n++;
  for (const k of ["title","who","quote","culprit","lesson"]) if (!c[k] || !c[k].en || !c[k].de) err(c, "missing " + k);
  if (!c.final && (!c.card || !c.card.de)) err(c, "card");
  if (lv.hints && (!c.hints || c.hints.length < 1)) err(c, "hints");
  for (const b of c.bugs) { const f = c.fixes[b]; if (!f || f.length !== 3) { err(c, "fixes " + b); continue; }
    if (f.filter(x => x.ok).length !== 1) err(c, "ok count " + b);
    for (const x of f) { if (x.code !== null) for (const l of ["py","java","js"]) if (typeof x.code[l] !== "string") err(c, "fix code " + b + l);
      if (!x.ok && (!x.why || !x.why.de)) err(c, "why " + b); } }
  for (const lang of ["py","java","js"]) {
   const tags = new Set(c.code[lang].filter(Array.isArray).map(x => x[1]));
   for (const b of c.bugs) if (!tags.has(b)) err(c, lang + " bug tag missing " + b);
   const want = typeof c.want === "function" ? c.want(lang) : c.want;
   const full = c.sim(new Set(c.bugs), lang);
   for (const st of full) if (!tags.has(st.t)) err(c, lang + " tag " + st.t);
   if (full.some(x => x.end)) err(c, lang + " full ends " + full.find(x => x.end).end);
   if (JSON.stringify(outs(full)) !== JSON.stringify(want)) err(c, lang + " full " + JSON.stringify(outs(full)) + " want " + JSON.stringify(want));
   for (const F of subsets(c.bugs)) { let st; try { st = c.sim(F, lang); } catch (e) { err(c, lang + " sim throws " + e); continue; }
     for (const x of st) if (!tags.has(x.t)) err(c, lang + " tag " + x.t);
     if (!st.some(x => x.end) && JSON.stringify(outs(st)) === JSON.stringify(want)) err(c, lang + " subset matches " + [...F]);
     if (st.length > 120) console.log("long", c.id, lang, [...F], st.length); }
  } } }
console.log("cases", n, "bad", bad); if (bad) process.exitCode = 1;
