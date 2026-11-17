// Really runs every case in Python, Java and JavaScript for every combination of fixed bugs
// and compares the output with what the game shows. Usage: node tests/run-real.js [py|java|js]
const fs = require("fs"), vm = require("vm"), path = require("path"), os = require("os"), { spawn } = require("child_process");
const ctx = { LEVELS: require("./load-cases")() };
const JAVA = process.env.JAVA || "java"; // set JAVA=/path/to/java if java is not on PATH
const only = process.argv[2]; // py | java | js
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ccs-run-"));
const subsetsAll = bugs => { const r = []; for (let m = 0; m < (1 << bugs.length); m++) r.push(new Set(bugs.filter((_, i) => m & (1 << i)))); return r; };
function build(c, lang, F) { const out = [];
  for (const raw of c.code[lang]) { let text = Array.isArray(raw) ? raw[0] : raw; const tag = Array.isArray(raw) ? raw[1] : null;
    if (tag && F.has(tag)) { const ok = c.fixes[tag].find(x => x.ok); if (ok.code === null) continue; text = text.match(/^\s*/)[0] + ok.code[lang].trimStart(); }
    out.push(text); }
  return out; }
function javaSrc(lines) { const body = [], meth = []; let inM = false;
  for (const l of lines) { if (!inM && /^static /.test(l)) inM = true; (inM ? meth : body).push(l); if (inM && l === "}") inM = false; }
  return "import java.util.*;\npublic class Main {\n" + meth.join("\n") + "\npublic static void main(String[] args) {\n" + body.join("\n") + "\n}\n}\n"; }
function run(cmd, args, input, ms, cwd) { return new Promise(res => { const p = spawn(cmd, args, { cwd }); let o = "", e = ""; let to = false;
  const timer = setTimeout(() => { to = true; p.kill(); }, ms);
  p.stdout.on("data", d => o += d); p.stderr.on("data", d => e += d); p.on("close", code => { clearTimeout(timer); res({ o, e, code, to }); });
  p.stdin.end(input); }); }
function runJs(lines) { const out = []; let k = 0; const ins = ["5", "3"];
  try { vm.runInNewContext(lines.join("\n"), { console: { log: (...a) => out.push(a.map(String).join(" ")) }, prompt: () => ins[k++] }, { timeout: 400 }); return { out, crash: false, loop: false }; }
  catch (e) { return { out, crash: !/timed out/.test(e.message), loop: /timed out/.test(e.message), msg: e.message }; } }
const jobs = [];
for (const lv of ctx.LEVELS) for (const c of lv.cases) for (const lang of only ? [only] : ["py", "java", "js"]) for (const F of subsetsAll(c.bugs)) jobs.push({ c, lang, F });
let bad = 0, done = 0;
async function doJob({ c, lang, F }, idx) {
  const st = c.sim(F, lang), end = (st.find(x => x.end) || {}).end || null, exp = st.filter(x => x.out !== undefined && x.end !== "crash").map(x => x.out);
  const lines = build(c, lang, F); let got;
  if (lang === "js") got = runJs(lines);
  else if (lang === "py") { const f = path.join(tmp, `p${idx}.py`); fs.writeFileSync(f, lines.join("\n") + "\n"); const r = await run("python", ["-I", f], "5\n3\n", 4000);
    got = { out: r.o.split(/\r?\n/).filter((x, i, a) => !(x === "" && i === a.length - 1)), crash: !r.to && r.code !== 0, loop: r.to, msg: r.e.trim().split("\n").pop() }; }
  else { const d = path.join(tmp, `j${idx}`); fs.mkdirSync(d); fs.writeFileSync(path.join(d, "Main.java"), javaSrc(lines)); const r = await run(JAVA, ["Main.java"], "5\n3\n", 12000, d);
    got = { out: r.o.split(/\r?\n/).filter((x, i, a) => !(x === "" && i === a.length - 1)), crash: !r.to && r.code !== 0, loop: r.to, msg: r.e.trim().split("\n")[0] }; }
  if (got.loop) got.out = got.out.slice(0, 0);
  const okEnd = end === "loop" ? got.loop : end === "crash" ? got.crash : !got.crash && !got.loop;
  const okOut = end === "loop" ? true : JSON.stringify(got.out) === JSON.stringify(exp);
  if (!okEnd || !okOut) { bad++; console.log("BAD", c.id, lang, "[" + [...F] + "]", "sim:", end, JSON.stringify(exp), "real:", got.loop ? "loop" : got.crash ? "crash " + got.msg : "", JSON.stringify(got.out.slice(0, 12))); }
  done++; }
(async () => { let i = 0; const W = 6; await Promise.all(Array.from({ length: W }, async () => { while (i < jobs.length) { const k = i++; await doJob(jobs[k], k); } }));
  console.log(only || "all", "runs", done, "bad", bad); if (bad) process.exitCode = 1; fs.rmSync(tmp, { recursive: true, force: true }); })();
