// Loads all case files in a sandbox (with small stand-ins for the UI helpers) and returns LEVELS.
const fs = require("fs"), path = require("path"), vm = require("vm");
const STUB = `const S = { ui: "en" };
const L = o => (o && typeof o === "object" && !Array.isArray(o)) ? (o[S.ui] !== undefined ? o[S.ui] : o.en) : o;
const W = { round: { en: "round" }, ends: { en: "loop ends" }, rounds: { en: "rounds" }, types: { en: "user types" } };
const arr = (a, lang) => lang === "java" ? "{" + a.join(", ") + "}" : "[" + a.join(", ") + "]";
const bool = (b, lang) => lang === "py" ? (b ? "True" : "False") : String(b);
const dbl = (x, lang) => lang === "js" ? String(x) : (Number.isInteger(x) ? x.toFixed(1) : String(x));`;
module.exports = function loadLevels() {
  const dir = path.join(__dirname, "..", "src", "cases");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".js")).sort();
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(STUB + "\n" + files.map(f => fs.readFileSync(path.join(dir, f), "utf8")).join("\n") + "\n;globalThis.LEVELS = LEVELS;", ctx);
  return ctx.LEVELS;
};
