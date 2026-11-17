/* ---------- case helpers ---------- */
const tx = (en, de) => ({ en, de });
const ok = (py, java, js) => ({ ok: true, code: { py, java, js } });
const del = () => ({ ok: true, code: null });
const no = (py, java, js, en, de) => ({ code: { py, java, js }, why: { en, de } });
const P = (t, v, cond, x) => Object.assign({ t }, v ? { v } : null, cond != null ? { cond } : null, x || null);
const O = (t, out, v, cond) => P(t, v, cond, { out: String(out) });
const q = s => `"${s}"`;
const cq = (c, lang) => lang === "java" ? `'${c}'` : `"${c}"`;
const nul = lang => lang === "py" ? "None" : "null";
const vn = (py, other, lang) => lang === "py" ? py : other;
const dict = (o, lang) => { const e = Object.entries(o); if (!e.length) return "{}";
  return lang === "py" ? "{" + e.map(([k, v]) => `"${k}": ${v}`).join(", ") + "}"
    : lang === "java" ? "{" + e.map(([k, v]) => `${k}=${v}`).join(", ") + "}"
    : "{ " + e.map(([k, v]) => `${k}: ${v}`).join(", ") + " }"; };
const CRASH = {
  index: { py: "IndexError: list index out of range", java: "ArrayIndexOutOfBoundsException", js: "TypeError: Cannot read properties of undefined" },
  rec: { py: "RecursionError: maximum recursion depth exceeded", java: "StackOverflowError", js: "RangeError: Maximum call stack size exceeded" },
  none: { py: "AttributeError: 'NoneType' object has no attribute 'upper'", java: "NullPointerException", js: "TypeError: Cannot read properties of null" }
};
const crash = (t, kind, lang) => ({ t, end: "crash", out: CRASH[kind][lang] });
const LOOP = (t, cond) => ({ t, end: "loop", cond });
const LEVELS = [];
