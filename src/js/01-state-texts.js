/* ---------- storage & state ---------- */
const KEY = "code-crime-scene.v2";
const load = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
const old = load("code-crime-scene.v1");
const S = Object.assign({ ui: "en", code: "py", sound: true, speed: 1, solved: {} },
  { ui: old.ui || "en", code: old.code || "py", sound: old.sound !== false }, load(KEY));
const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ ui: S.ui, code: S.code, sound: S.sound, speed: S.speed, solved: S.solved })); } catch (e) {} };
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- texts ---------- */
const T = {
 en: {
  brand: "Code Crime Scene", issue: "Issue #2 · 5 levels · 50 cases · Python, Java & JavaScript",
  start: "Start the investigation", cont: "Continue the investigation",
  story1: "Code City, after midnight. All over town, programs have started doing strange things.",
  story2: "Five masterminds are behind it, one per district. Each one leaves a calling card at the scene.",
  story3: "You are the detective, your partner is Quackson the rubber duck. Every closed case earns points and moves you up the rank ladder.",
  howTitle: "How to solve a case",
  how1: "Read the witness statement: what should have happened, and what happened instead.",
  how2: "Press <b>Reconstruct</b> and watch the program run line by line. The sticky notes show every value.",
  how3: "Turn on the <b>magnifier</b> and click the line you think is guilty.",
  how4: "Pick the right fix. When the printout matches, the case is closed.",
  levels: "Levels", chooseLevel: "Choose your level", unknownMastermind: "Mastermind: ???",
  bugsN: "{n} bugs per case", noTimer: "no timer", hintsN: "{n} hints", hintsN1: "1 hint", noHints: "no hints", noValues: "values hidden", ptsPerStar: "{n} pts per star",
  files: "Case files", wanted: "WANTED", wantedUnknown: "Identity unknown", arrested: "ARRESTED",
  piecesHint: "Every closed case tears a piece off the poster. The finale unmasks the mastermind.", foundCards: "Notes found at the scenes",
  locked: "Locked", solve: "Open case", caseN: "Case", finale: "Finale", closedShort: "CLOSED",
  expected: "Should be", actual: "Is", enter: "Enter the crime scene", back: "Not yet", perCase: "per case",
  reconstruct: "Reconstruct", pause: "Pause", step: "One step", rewind: "Rewind", speed: "Speed",
  accuse: "Magnifier", accuseOn: "Click the guilty line", pickFix: "How do we fix this line?",
  evidence: "Evidence board", noVars: "The values of the variables appear here during the reconstruction.", hiddenVals: "IMPOSSIBLE: values stay secret. Watch the code, not the notes.",
  output: "Printout", match: "Matches the witness statement", nomatch: "Does not match",
  hint: "Ask Quackson", cost: "−1 star", noMoreHints: "I've told you everything I know. Trust your magnifier!", noHintsLevel: "No hints here",
  gotcha: "GOTCHA!", zap: "ZAP!", loop: "LOOP!", crash: "CRASH!", timeBurst: "TICK TOCK!",
  closed: "CASE CLOSED", culprit: "Culprit", lesson: "What you learned", foundCard: "Found at the scene",
  next: "Next case", seeEnding: "Arrest the mastermind", neverEnds: "never ends", crashes: "crashes",
  timeUp: "Time is up! You lose a star and get one more minute.",
  duckStart: "Start with the reconstruction. Watch the sticky notes closely!",
  duckStartHidden: "No values, no hints. Just you, the code and the clock. Read every line.",
  duckAfterRun: "The printout doesn't match. Did you spot the moment it went wrong? Turn on the magnifier.",
  duckMagnifier: "Magnifier on! Click the line you suspect.",
  duckRight: "That's our suspect! Now pick the fix.",
  duckOneMore: "One down! Reconstruct again – the result is still not right.",
  duckFinal: "Fixed! Let's replay the scene one last time…",
  duckWrongFix: "Careful! Read why that one fails.",
  duckLoop: "It never stops! Look at what changes, or doesn't, in every round.",
  duckCrash: "It crashed! The last highlighted line is where it blew up. Why?",
  pts: "pts", yourRank: "Your rank", ladder: "Rank ladder", rankUp: "RANK UP!", nextAt: "next rank “{r}” at {n} pts", maxRank: "highest rank reached!",
  ladderHow: "Every star is worth points: the harder the level, the more. Replaying a case only counts if you beat your best.",
  noGain: "No new points – you already had {n} stars here.", you: "YOU",
  behindBars: "{v} is behind bars", nextLevel: "Next level",
  end1: "All five masterminds are locked up. Code City sleeps again.",
  end2: "Your best tool was never speed. It was reading one line at a time and replaying the scene.",
  bugsArrested: "Bugs behind bars", playAgain: "Start over", sure: "Sure? Click again to erase all progress",
  stars: "stars", sound: "Sound", siteLang: "Site", codeLang: "Code", deleteLine: "Delete this line",
  tape: "CRIME SCENE · DO NOT CROSS · ",
  taunts: { beginner: "Oopsie! Did I drop that? Catch me if you can, slowpoke.", medium: "Everything you can do, I can copy. Even your mistakes.",
    hard: "Who did it? Nobody. Who will catch me? Nobody.", expert: "I have run since 1998. You cannot fix me. Nobody ever could.",
    impossible: "Tick. Tock. No hints. No values. Just you and me." },
  alibis: ["I've got an alibi!", "Not me, detective!", "I just store a value. Honest!", "My record is clean!", "Wrong suspect!", "I was nowhere near it!"]
 },
 de: {
  brand: "Code-Tatort", issue: "Ausgabe #2 · 5 Stufen · 50 Fälle · Python, Java & JavaScript",
  start: "Ermittlung starten", cont: "Ermittlung fortsetzen",
  story1: "Code City, nach Mitternacht. Überall in der Stadt tun Programme plötzlich seltsame Dinge.",
  story2: "Dahinter stecken fünf Drahtzieher, einer pro Viertel. Jeder hinterlässt am Tatort eine Visitenkarte.",
  story3: "Du ermittelst, dein Partner ist Quackson, die Gummiente. Jeder gelöste Fall bringt Punkte und hebt dich auf der Rangleiter nach oben.",
  howTitle: "So löst du einen Fall",
  how1: "Lies die Zeugenaussage: Was hätte passieren sollen, und was ist stattdessen passiert?",
  how2: "Drück auf <b>Nachstellen</b> und sieh zu, wie das Programm Zeile für Zeile läuft. Die Notizzettel zeigen jeden Wert.",
  how3: "Schalte die <b>Lupe</b> ein und klick auf die Zeile, die du für schuldig hältst.",
  how4: "Wähle die richtige Reparatur. Stimmt der Ausdruck, ist der Fall gelöst.",
  levels: "Stufen", chooseLevel: "Wähle deine Stufe", unknownMastermind: "Drahtzieher: ???",
  bugsN: "{n} Bugs pro Fall", noTimer: "kein Zeitlimit", hintsN: "{n} Tipps", hintsN1: "1 Tipp", noHints: "keine Tipps", noValues: "Werte versteckt", ptsPerStar: "{n} Punkte pro Stern",
  files: "Fallakten", wanted: "GESUCHT", wantedUnknown: "Identität unbekannt", arrested: "GEFASST",
  piecesHint: "Jeder gelöste Fall reißt ein Stück vom Plakat. Das Finale enttarnt den Drahtzieher.", foundCards: "Zettel von den Tatorten",
  locked: "Gesperrt", solve: "Fall öffnen", caseN: "Fall", finale: "Finale", closedShort: "GELÖST",
  expected: "Soll", actual: "Ist", enter: "Tatort betreten", back: "Noch nicht", perCase: "pro Fall",
  reconstruct: "Nachstellen", pause: "Pause", step: "Ein Schritt", rewind: "Zurückspulen", speed: "Tempo",
  accuse: "Lupe", accuseOn: "Klick auf die schuldige Zeile", pickFix: "Wie reparieren wir diese Zeile?",
  evidence: "Beweistafel", noVars: "Hier erscheinen beim Nachstellen die Werte der Variablen.", hiddenVals: "IMPOSSIBLE: Die Werte bleiben geheim. Lies den Code, nicht die Zettel.",
  output: "Ausdruck", match: "Passt zur Zeugenaussage", nomatch: "Passt nicht",
  hint: "Quackson fragen", cost: "−1 Stern", noMoreHints: "Mehr weiß ich auch nicht. Vertrau deiner Lupe!", noHintsLevel: "Hier keine Tipps",
  gotcha: "ERWISCHT!", zap: "ZACK!", loop: "ENDLOS!", crash: "ABSTURZ!", timeBurst: "TICK TACK!",
  closed: "FALL GELÖST", culprit: "Täter", lesson: "Was du gelernt hast", foundCard: "Am Tatort gefunden",
  next: "Nächster Fall", seeEnding: "Den Drahtzieher verhaften", neverEnds: "hört nie auf", crashes: "stürzt ab",
  timeUp: "Zeit abgelaufen! Du verlierst einen Stern und bekommst eine Minute mehr.",
  duckStart: "Fang mit dem Nachstellen an. Achte genau auf die Notizzettel!",
  duckStartHidden: "Keine Werte, keine Tipps. Nur du, der Code und die Uhr. Lies jede Zeile.",
  duckAfterRun: "Der Ausdruck passt nicht. Hast du gesehen, wann es schiefging? Schalte die Lupe ein.",
  duckMagnifier: "Lupe an! Klick auf die Zeile, die du verdächtigst.",
  duckRight: "Das ist unser Verdächtiger! Jetzt wähle die Reparatur.",
  duckOneMore: "Einer weniger! Stell die Szene nochmal nach – das Ergebnis stimmt noch nicht.",
  duckFinal: "Repariert! Wir spielen die Szene ein letztes Mal durch …",
  duckWrongFix: "Vorsicht! Lies, warum das nicht klappt.",
  duckLoop: "Das hört nie auf! Schau, was sich in jeder Runde ändert – oder eben nicht.",
  duckCrash: "Abgestürzt! Die zuletzt markierte Zeile ist da, wo es geknallt hat. Warum?",
  pts: "Punkte", yourRank: "Dein Rang", ladder: "Rangleiter", rankUp: "AUFSTIEG!", nextAt: "nächster Rang „{r}“ ab {n} Punkten", maxRank: "höchster Rang erreicht!",
  ladderHow: "Jeder Stern bringt Punkte: je schwerer die Stufe, desto mehr. Einen Fall nochmal spielen zählt nur, wenn du deinen Bestwert schlägst.",
  noGain: "Keine neuen Punkte – hier hattest du schon {n} Sterne.", you: "DU",
  behindBars: "{v} sitzt hinter Gittern", nextLevel: "Nächste Stufe",
  end1: "Alle fünf Drahtzieher sitzen. Code City schläft wieder ruhig.",
  end2: "Dein bestes Werkzeug war nie Tempo, sondern Zeile für Zeile lesen und die Szene nachstellen.",
  bugsArrested: "Bugs hinter Gittern", playAgain: "Von vorne beginnen", sure: "Sicher? Nochmal klicken löscht den ganzen Fortschritt",
  stars: "Sterne", sound: "Ton", siteLang: "Seite", codeLang: "Code", deleteLine: "Diese Zeile löschen",
  tape: "TATORT · NICHT BETRETEN · ",
  taunts: { beginner: "Hoppla! Hab ich das fallen lassen? Fang mich doch, du Schnecke.", medium: "Alles, was du kannst, kann ich kopieren. Sogar deine Fehler.",
    hard: "Wer war's? Niemand. Wer fängt mich? Niemand.", expert: "Ich laufe seit 1998. Mich repariert keiner. Hat noch nie jemand geschafft.",
    impossible: "Tick. Tack. Keine Tipps. Keine Werte. Nur du und ich." },
  alibis: ["Ich hab ein Alibi!", "Ich war's nicht, Spürnase!", "Ich speichere nur einen Wert. Ehrlich!", "Meine Akte ist sauber!", "Falscher Verdächtiger!", "Ich war nicht mal in der Nähe!"]
 }
};
const t = k => (T[S.ui][k] !== undefined ? T[S.ui][k] : T.en[k]);
const tf = (k, o) => t(k).replace(/\{(\w+)\}/g, (m, x) => o[x]);
const L = o => (o && typeof o === "object" && !Array.isArray(o)) ? (o[S.ui] !== undefined ? o[S.ui] : o.en) : o;
const W = { round: { en: "round", de: "Runde" }, ends: { en: "loop ends", de: "Schleife endet" }, rounds: { en: "rounds", de: "Runden" }, types: { en: "user types", de: "Eingabe:" } };
const arr = (a, lang) => lang === "java" ? "{" + a.join(", ") + "}" : "[" + a.join(", ") + "]";
const bool = (b, lang) => lang === "py" ? (b ? "True" : "False") : String(b);
const dbl = (x, lang) => lang === "js" ? String(x) : (Number.isInteger(x) ? x.toFixed(1) : String(x));
