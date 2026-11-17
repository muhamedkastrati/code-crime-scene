/* ---------- sound ---------- */
let AC = null;
function tone(f, d, type, g, slide) {
  const t0 = AC.currentTime, o = AC.createOscillator(), v = AC.createGain();
  o.type = type || "square"; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t0 + d);
  v.gain.setValueAtTime(g || .05, t0); v.gain.exponentialRampToValueAtTime(.0001, t0 + d);
  o.connect(v); v.connect(AC.destination); o.start(t0); o.stop(t0 + d + .03);
}
function sfx(k) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const at = (ms, fn) => setTimeout(() => { try { fn(); } catch (e) {} }, ms);
    switch (k) {
      case "step": tone(660, .06, "triangle", .05); break;
      case "type": tone(1500, .02, "square", .01); break;
      case "wrong": tone(230, .3, "sawtooth", .06, -130); break;
      case "gotcha": [523, 659, 784, 1047].forEach((f, i) => at(i * 65, () => tone(f, .12, "square", .045))); break;
      case "fix": [784, 1175].forEach((f, i) => at(i * 90, () => tone(f, .16, "triangle", .08))); break;
      case "stamp": tone(110, .3, "sine", .3, -60); tone(70, .2, "square", .05, -20); break;
      case "win": [523, 659, 784, 1047, 1319].forEach((f, i) => at(i * 110, () => tone(f, .25, "triangle", .07))); break;
      case "tick": tone(1900, .03, "square", .02); break;
      case "loop": [880, 620, 880, 620, 880].forEach((f, i) => at(i * 150, () => tone(f, .13, "square", .04))); break;
      case "crash": tone(150, .5, "sawtooth", .08, -110); at(60, () => tone(90, .4, "square", .06, -40)); break;
      case "rankup": [392, 523, 659, 784, 1047, 1319].forEach((f, i) => at(i * 85, () => tone(f, .22, "square", .05))); at(560, () => tone(1568, .5, "triangle", .07)); break;
      case "pop": tone(900, .08, "triangle", .06, 300); break;
    }
  } catch (e) {}
}
