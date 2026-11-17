/* ---------- syntax colouring ---------- */
const KW = {
  py: "def return for in range len if elif else while and or not is True False None break",
  java: "int double boolean char String void static for if else while new return true false null break",
  js: "const let function for of if else while return true false null new break"
};
const BI = {
  py: "print input int str round abs ord chr sorted append copy upper lower replace isdigit strip key",
  java: "System out println Integer parseInt Math round abs Scanner nextLine valueOf List ArrayList Map HashMap Arrays Character isDigit Comparator Collections length toCharArray charAt equals equalsIgnoreCase toUpperCase toLowerCase replace trim put get getOrDefault size add sort toString of asList reverse comparingInt naturalOrder",
  js: "console log prompt Number Math floor round trunc abs String JSON stringify length push sort reverse toUpperCase toLowerCase replaceAll trim includes charCodeAt fromCharCode localeCompare"
};
const KWS = {}, BIS = {}; for (const l of ["py", "java", "js"]) { KWS[l] = new Set(KW[l].split(" ")); BIS[l] = new Set(BI[l].split(" ")); }
const hl = (src, lang) => src.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?(?:e-?\d+)?\b)|([A-Za-z_]\w*)|([&<>])/g, (m, s, n, w, h) => {
  if (s) return `<span class="s">${esc(s)}</span>`;
  if (n) return `<span class="n">${n}</span>`;
  if (w) return KWS[lang].has(w) ? `<span class="k">${w}</span>` : BIS[lang].has(w) ? `<span class="b">${w}</span>` : w;
  return esc(h);
});
