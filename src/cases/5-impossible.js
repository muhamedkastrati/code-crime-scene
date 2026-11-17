/* ---------- level 5: IMPOSSIBLE ---------- */
LEVELS.push({ id: "impossible", name: tx("IMPOSSIBLE", "IMPOSSIBLE"), color: "#ff4b4b", base: 80, time: 120, hints: 0, hide: true,
 villain: { name: tx("The Deadline", "Die Deadline"), svg: "clock",
   end: tx("The Deadline is stopped. No hints, no values, a ticking clock, and you still read the code like a book. Code City has a new legend.",
           "Die Deadline ist gestoppt. Keine Tipps, keine Werte, eine tickende Uhr, und trotzdem hast du den Code gelesen wie ein Buch. Code City hat eine neue Legende.") },
 cases: [
{ id: "i1",
  title: tx("The Upside-Down Bank", "Die verkehrte Bank"),
  who: tx("Mr Gold, bank director", "Herr Gold, Bankdirektor"),
  quote: tx("A customer had 100 and withdrew 30, then 70. He should have exactly 0. Our system says he now has 200. He is very happy. I am not.", "Ein Kunde hatte 100 und hob 30 ab, dann 70. Er sollte genau 0 haben. Unser System sagt, er hat jetzt 200. Er freut sich sehr. Ich nicht."),
  culprit: tx("Plus Paula", "Plus-Paul"),
  lesson: tx("A withdrawal subtracts. And taking out everything you have is allowed: <=, not <.", "Abheben zieht ab. Und alles abheben, was man hat, ist erlaubt: <=, nicht <."),
  card: tx("Tick.", "Tick."),
  hints: [], want: ["0"], bugs: ["b1", "b2"],
  code: {
    py: [["balance = 100", "b"], ["for w in [30, 70]:", "lp"], ["    if w < balance:", "b1"], ["        balance += w", "b2"], ["print(balance)", "out"]],
    java: [["int balance = 100;", "b"], ["for (int w : new int[]{30, 70}) {", "lp"], ["    if (w < balance) {", "b1"], ["        balance += w;", "b2"], "    }", "}", ["System.out.println(balance);", "out"]],
    js: [["let balance = 100;", "b"], ["for (const w of [30, 70]) {", "lp"], ["  if (w < balance) {", "b1"], ["    balance += w;", "b2"], "  }", "}", ["console.log(balance);", "out"]]
  },
  fixes: {
    b1: [ok("if w <= balance:", "if (w <= balance) {", "if (w <= balance) {"),
      no("if w > balance:", "if (w > balance) {", "if (w > balance) {", "Only lets you withdraw money you do not have.", "Lässt nur Geld abheben, das man nicht hat."),
      no("if w == balance:", "if (w == balance) {", "if (w === balance) {", "Only allows taking out everything at once.", "Erlaubt nur, alles auf einmal abzuheben.")],
    b2: [ok("balance -= w", "balance -= w;", "balance -= w;"),
      no("balance = w", "balance = w;", "balance = w;", "The balance becomes the withdrawal amount.", "Der Kontostand wird zum Abhebebetrag."),
      no("balance -= balance", "balance -= balance;", "balance -= balance;", "Empties the whole account on the first withdrawal.", "Leert das ganze Konto bei der ersten Abhebung.")]
  },
  sim(F, lang) {
    const s = [P("b", { balance: "100" })]; let b = 100;
    for (const w of [30, 70]) { s.push(P("lp", { w: String(w) })); const y = F.has("b1") ? w <= b : w < b;
      s.push(P("b1", null, `${w} ${F.has("b1") ? "<=" : "<"} ${b} → ${bool(y, lang)}`));
      if (y) { b = F.has("b2") ? b - w : b + w; s.push(P("b2", { balance: String(b) })); } }
    s.push(O("out", b));
    return s;
  } },

{ id: "i2",
  title: tx("The Broken Cipher", "Die kaputte Geheimschrift"),
  who: tx("Agent Zoe", "Agentin Zoe"),
  quote: tx("Our secret code shifts every letter 3 steps: x becomes a, y becomes b, z becomes c. I encrypted “xyz” and got “[\\]”. My contact thinks I sent a smiley.", "Unser Geheimcode verschiebt jeden Buchstaben um 3: aus x wird a, aus y wird b, aus z wird c. Ich habe „xyz“ verschlüsselt und „[\\]“ bekommen. Mein Kontakt hält es für einen Smiley."),
  culprit: tx("Bracket Bruno", "Klammer-Klara"),
  lesson: tx("* / % come before + -. Without brackets, code + 3 % 26 is code + 3. And character codes: 65 is “A”, 97 is “a”.", "* / % kommen vor + -. Ohne Klammern ist code + 3 % 26 dasselbe wie code + 3. Und Zeichencodes: 65 ist „A“, 97 ist „a“."),
  card: tx("Tock.", "Tack."),
  hints: [], want: ["abc"], bugs: ["b1", "b2"],
  code: {
    py: [['word = "xyz"', "w"], ['result = ""', "r"], ["for ch in word:", "lp"], ["    code = ord(ch) - 97", "c"], ["    code = code + 3 % 26", "b1"], ["    result += chr(code + 65)", "b2"], ["print(result)", "out"]],
    java: [['String word = "xyz";', "w"], ['String result = "";', "r"], ["for (char ch : word.toCharArray()) {", "lp"], ["    int code = ch - 97;", "c"], ["    code = code + 3 % 26;", "b1"], ["    result += (char) (code + 65);", "b2"], "}", ["System.out.println(result);", "out"]],
    js: [['const word = "xyz";', "w"], ['let result = "";', "r"], ["for (const ch of word) {", "lp"], ["  let code = ch.charCodeAt(0) - 97;", "c"], ["  code = code + 3 % 26;", "b1"], ["  result += String.fromCharCode(code + 65);", "b2"], "}", ["console.log(result);", "out"]]
  },
  fixes: {
    b1: [ok("code = (code + 3) % 26", "code = (code + 3) % 26;", "code = (code + 3) % 26;"),
      no("code = code % 26 + 3", "code = code % 26 + 3;", "code = code % 26 + 3;", "Wraps around before the shift, so z still runs past the end.", "Springt vor dem Verschieben zurück, z läuft also trotzdem übers Ende."),
      no("code = (code + 3) % 25", "code = (code + 3) % 25;", "code = (code + 3) % 25;", "The alphabet has 26 letters, not 25.", "Das Alphabet hat 26 Buchstaben, nicht 25.")],
    b2: [ok("result += chr(code + 97)", "result += (char) (code + 97);", "result += String.fromCharCode(code + 97);"),
      no("result += chr(code)", "result += (char) code;", "result += String.fromCharCode(code);", "Codes 0 to 25 are invisible control characters, not letters.", "Die Codes 0 bis 25 sind unsichtbare Steuerzeichen, keine Buchstaben."),
      no("result += chr(code + 3)", "result += (char) (code + 3);", "result += String.fromCharCode(code + 3);", "Shifts a second time instead of turning the number back into a letter.", "Verschiebt ein zweites Mal, statt die Zahl in einen Buchstaben zurückzuverwandeln.")]
  },
  sim(F, lang) {
    const s = [P("w", { word: q("xyz") }), P("r", { result: '""' })]; let r = "";
    for (const ch of "xyz") { s.push(P("lp", { ch: cq(ch, lang) })); let c = ch.charCodeAt(0) - 97; s.push(P("c", { code: String(c) }));
      const o = c; c = F.has("b1") ? (c + 3) % 26 : c + 3; s.push(P("b1", { code: String(c) }, F.has("b1") ? `(${o} + 3) % 26 = ${c}` : `${o} + (3 % 26) = ${c}`));
      r += String.fromCharCode(c + (F.has("b2") ? 97 : 65)); s.push(P("b2", { result: q(r) })); }
    s.push(O("out", r));
    return s;
  } },

{ id: "i3",
  title: tx("The Unbalanced Equation", "Die schiefe Gleichung"),
  who: tx("Dr. Kofi, calculator factory", "Dr. Kofi, Taschenrechnerfabrik"),
  quote: tx("“(()())” is perfectly balanced: every bracket that opens also closes. Our bracket checker rejects it. It rejects everything. Sales are zero.", "„(()())“ ist perfekt ausgeglichen: Jede Klammer, die aufgeht, geht auch zu. Unser Klammerprüfer lehnt sie ab. Er lehnt alles ab. Verkauft haben wir null."),
  culprit: tx("Depth Dagmar", "Tiefen-Toni"),
  lesson: tx("Count depth: + 1 for “(”, − 1 for “)”. It is only broken if the depth ever drops below 0 or does not end at 0.", "Zähle die Tiefe: + 1 bei „(“, − 1 bei „)“. Kaputt ist es nur, wenn die Tiefe unter 0 fällt oder am Ende nicht 0 ist."),
  card: tx("Running late?", "Spät dran?"),
  hints: [], want: lang => [bool(true, lang)], bugs: ["b1", "b2"],
  code: {
    py: [['text = "(()())"', "tx"], ["depth = 0", "d"], ["balanced = True", "bl"], ["for ch in text:", "lp"], ['    if ch == "(":', "if"], ["        depth += 1", "up"], "    else:", ["        depth += 1", "b1"], ["    if depth > 0:", "b2"], ["        balanced = False", "bf"], ["print(balanced and depth == 0)", "out"]],
    java: [['String text = "(()())";', "tx"], ["int depth = 0;", "d"], ["boolean balanced = true;", "bl"], ["for (char ch : text.toCharArray()) {", "lp"], ["    if (ch == '(') {", "if"], ["        depth++;", "up"], "    } else {", ["        depth++;", "b1"], "    }", ["    if (depth > 0) {", "b2"], ["        balanced = false;", "bf"], "    }", "}", ["System.out.println(balanced && depth == 0);", "out"]],
    js: [['const text = "(()())";', "tx"], ["let depth = 0;", "d"], ["let balanced = true;", "bl"], ["for (const ch of text) {", "lp"], ['  if (ch === "(") {', "if"], ["    depth++;", "up"], "  } else {", ["    depth++;", "b1"], "  }", ["  if (depth > 0) {", "b2"], ["    balanced = false;", "bf"], "  }", "}", ["console.log(balanced && depth === 0);", "out"]]
  },
  fixes: {
    b1: [ok("depth -= 1", "depth--;", "depth--;"),
      no("depth = 0", "depth = 0;", "depth = 0;", "Forgets all open brackets at once when one closes.", "Vergisst alle offenen Klammern auf einmal, wenn eine zugeht."),
      no("depth += 2", "depth += 2;", "depth += 2;", "Closing brackets make it even deeper.", "Schließende Klammern machen es noch tiefer.")],
    b2: [ok("if depth < 0:", "if (depth < 0) {", "if (depth < 0) {"),
      no("if depth == 0:", "if (depth == 0) {", "if (depth === 0) {", "Depth 0 after a closed group is perfectly fine.", "Tiefe 0 nach einer geschlossenen Gruppe ist völlig in Ordnung."),
      no("if depth != 0:", "if (depth != 0) {", "if (depth !== 0) {", "Every open bracket would count as an error.", "Jede offene Klammer würde als Fehler zählen.")]
  },
  sim(F, lang) {
    const s = [P("tx", { text: q("(()())") }), P("d", { depth: "0" }), P("bl", { balanced: bool(true, lang) })]; let d = 0, ok2 = true;
    for (const ch of "(()())") { s.push(P("lp", { ch: cq(ch, lang) })); const op = ch === "("; s.push(P("if", null, bool(op, lang)));
      if (op) { d++; s.push(P("up", { depth: String(d) })); } else { d = F.has("b1") ? d - 1 : d + 1; s.push(P("b1", { depth: String(d) })); }
      const bad = F.has("b2") ? d < 0 : d > 0; s.push(P("b2", null, `${d} ${F.has("b2") ? "<" : ">"} 0 → ${bool(bad, lang)}`));
      if (bad) { ok2 = false; s.push(P("bf", { balanced: bool(false, lang) })); } }
    s.push(O("out", bool(ok2 && d === 0, lang)));
    return s;
  } },

{ id: "i4",
  title: tx("The Bottomless Pit", "Der bodenlose Schacht"),
  who: tx("Mo, mine engineer", "Mo, Bergbauingenieur"),
  quote: tx("Our tunnel calculator should say 4 × 3 × 2 × 1 = 24 routes. It dug and dug and then the computer screamed about a stack. Or it says 0.", "Unser Tunnelrechner sollte 4 × 3 × 2 × 1 = 24 Wege ausrechnen. Er grub und grub, dann schrie der Computer etwas von einem Stapel. Oder er sagt 0."),
  culprit: tx("Echo Echo", "Echo-Edda"),
  lesson: tx("Recursion must get smaller every call (n − 1), and the base case must return the neutral value: 1 for multiplying.", "Rekursion muss bei jedem Aufruf kleiner werden (n − 1), und der Abbruch muss den neutralen Wert liefern: 1 beim Multiplizieren."),
  card: tx("You are too slow.", "Du bist zu langsam."),
  hints: [], want: ["24"], bugs: ["b1", "b2"],
  code: {
    py: [["def fact(n):", "fn"], ["    if n == 0:", "if"], ["        return 0", "b1"], ["    return n * fact(n)", "b2"], "", ["print(fact(4))", "out"]],
    java: [["static int fact(int n) {", "fn"], ["    if (n == 0) {", "if"], ["        return 0;", "b1"], "    }", ["    return n * fact(n);", "b2"], "}", "", ["System.out.println(fact(4));", "out"]],
    js: [["function fact(n) {", "fn"], ["  if (n === 0) {", "if"], ["    return 0;", "b1"], "  }", ["  return n * fact(n);", "b2"], "}", "", ["console.log(fact(4));", "out"]]
  },
  fixes: {
    b1: [ok("return 1", "return 1;", "return 1;"),
      no("return n", "return n;", "return n;", "n is 0 here, so this still returns 0 and wipes out the product.", "n ist hier 0, also kommt weiter 0 heraus und löscht das Produkt."),
      no("return -1", "return -1;", "return -1;", "Gives a negative number of routes.", "Ergibt eine negative Anzahl Wege.")],
    b2: [ok("return n * fact(n - 1)", "return n * fact(n - 1);", "return n * fact(n - 1);"),
      no("return n * fact(n + 1)", "return n * fact(n + 1);", "return n * fact(n + 1);", "Goes up instead of down. It never reaches 0.", "Geht nach oben statt nach unten. Es erreicht nie 0."),
      no("return n + fact(n - 1)", "return n + fact(n - 1);", "return n + fact(n - 1);", "Adds instead of multiplying: 4 + 3 + 2 + 1.", "Addiert statt zu multiplizieren: 4 + 3 + 2 + 1.")]
  },
  sim(F, lang) {
    const s = [P("out", null, "fact(4)")]; let depth = 0;
    const go = n => {
      s.push(P("fn", { n: String(n) }));
      if (++depth > 7) throw 0;
      const z = n === 0; s.push(P("if", null, `${n} == 0 → ${bool(z, lang)}`));
      if (z) { const r = F.has("b1") ? 1 : 0; s.push(P("b1", null, "return " + r)); return r; }
      const r = n * go(F.has("b2") ? n - 1 : n); s.push(P("b2", { n: String(n) }, `${n} * … = ${r}`)); return r;
    };
    try { s.push(O("out", go(4))); } catch (e) { s.push(crash("b2", "rec", lang)); }
    return s;
  } },

{ id: "i5",
  title: tx("The Crossed Treasure Map", "Die gekreuzte Schatzkarte"),
  who: tx("Captain Lin", "Kapitänin Lin"),
  quote: tx("The treasure code is the sum of both diagonals of the map: corner to corner, both ways. That is 30. The program crashed. My parrot is laughing.", "Der Schatzcode ist die Summe beider Diagonalen der Karte: Ecke zu Ecke, in beide Richtungen. Das ergibt 30. Das Programm ist abgestürzt. Mein Papagei lacht."),
  culprit: tx("Corner Corinna", "Ecken-Eckart"),
  lesson: tx("The last index of a list of length n is n − 1. The other diagonal goes grid[i][n − 1 − i].", "Der letzte Index einer Liste der Länge n ist n − 1. Die andere Diagonale ist grid[i][n − 1 − i]."),
  card: tx("I am always closer than you think.", "Ich bin immer näher, als du denkst."),
  hints: [], want: ["30"], bugs: ["b1", "b2"],
  code: {
    py: [["grid = [[2, 4, 6], [1, 3, 5], [7, 8, 9]]", "g"], ["total = 0", "t"], ["for i in range(len(grid) - 1):", "b1"], ["    total += grid[i][i]", "d1"], ["    total += grid[i][len(grid) - i]", "b2"], ["print(total)", "out"]],
    java: [["int[][] grid = {{2, 4, 6}, {1, 3, 5}, {7, 8, 9}};", "g"], ["int total = 0;", "t"], ["for (int i = 0; i < grid.length - 1; i++) {", "b1"], ["    total += grid[i][i];", "d1"], ["    total += grid[i][grid.length - i];", "b2"], "}", ["System.out.println(total);", "out"]],
    js: [["const grid = [[2, 4, 6], [1, 3, 5], [7, 8, 9]];", "g"], ["let total = 0;", "t"], ["for (let i = 0; i < grid.length - 1; i++) {", "b1"], ["  total += grid[i][i];", "d1"], ["  total += grid[i][grid.length - i];", "b2"], "}", ["console.log(total);", "out"]]
  },
  fixes: {
    b1: [ok("for i in range(len(grid)):", "for (int i = 0; i < grid.length; i++) {", "for (let i = 0; i < grid.length; i++) {"),
      no("for i in range(1, len(grid)):", "for (int i = 1; i < grid.length; i++) {", "for (let i = 1; i < grid.length; i++) {", "Skips the top row.", "Überspringt die oberste Zeile."),
      no("for i in range(len(grid) + 1):", "for (int i = 0; i <= grid.length; i++) {", "for (let i = 0; i <= grid.length; i++) {", "There is no 4th row.", "Eine 4. Zeile gibt es nicht.")],
    b2: [ok("total += grid[i][len(grid) - 1 - i]", "total += grid[i][grid.length - 1 - i];", "total += grid[i][grid.length - 1 - i];"),
      no("total += grid[i][i]", "total += grid[i][i];", "total += grid[i][i];", "The same diagonal twice: 28.", "Zweimal dieselbe Diagonale: 28."),
      no("total += grid[i][len(grid) + i]", "total += grid[i][grid.length + i];", "total += grid[i][grid.length + i];", "Even further off the map.", "Noch weiter neben der Karte.")]
  },
  sim(F, lang) {
    const g = [[2, 4, 6], [1, 3, 5], [7, 8, 9]], n = F.has("b1") ? 3 : 2, s = [P("g", { grid: lang === "java" ? "{{2, 4, 6}, {1, 3, 5}, {7, 8, 9}}" : "[[2, 4, 6], [1, 3, 5], [7, 8, 9]]" }), P("t", { total: "0" })]; let tot = 0;
    for (let i = 0; i < n; i++) { s.push(P("b1", { i: String(i) }));
      tot += g[i][i]; s.push(P("d1", { total: String(tot) }, `grid[${i}][${i}] = ${g[i][i]}`));
      const c = F.has("b2") ? 2 - i : 3 - i, v = g[i][c];
      if (v === undefined) { if (lang !== "js") { s.push(crash("b2", "index", lang)); return s; } tot = NaN; s.push(P("b2", { total: "NaN" }, `grid[${i}][${c}] = undefined`)); }
      else { tot += v; s.push(P("b2", { total: String(tot) }, `grid[${i}][${c}] = ${v}`)); } }
    s.push(O("out", tot));
    return s;
  } },

{ id: "i6",
  title: tx("The Digit Thief", "Der Ziffern-Dieb"),
  who: tx("Luca, lottery office", "Luca, Lotto-Büro"),
  quote: tx("The lucky number is the digit sum of 4096: 4 + 0 + 9 + 6 = 19. The machine said 6. When I tried to fix it, it never stopped spinning.", "Die Glückszahl ist die Quersumme von 4096: 4 + 0 + 9 + 6 = 19. Die Maschine sagte 6. Als ich es reparieren wollte, hörte sie nie mehr auf zu drehen."),
  culprit: tx("Snatcher Sid", "Schnapp-Sabine"),
  lesson: tx("n % 10 is the last digit, n // 10 removes it. Keep going while there are digits left: n > 0.", "n % 10 ist die letzte Ziffer, n // 10 entfernt sie. Mach weiter, solange Ziffern übrig sind: n > 0."),
  card: tx("Every coder fears me.", "Alle Coder fürchten mich."),
  hints: [], want: ["19"], bugs: ["b1", "b2"],
  code: {
    py: [["n = 4096", "n"], ["total = 0", "t"], ["while n > 9:", "b1"], ["    total += n % 10", "add"], ["    n = n % 10", "b2"], ["print(total)", "out"]],
    java: [["int n = 4096;", "n"], ["int total = 0;", "t"], ["while (n > 9) {", "b1"], ["    total += n % 10;", "add"], ["    n = n % 10;", "b2"], "}", ["System.out.println(total);", "out"]],
    js: [["let n = 4096;", "n"], ["let total = 0;", "t"], ["while (n > 9) {", "b1"], ["  total += n % 10;", "add"], ["  n = n % 10;", "b2"], "}", ["console.log(total);", "out"]]
  },
  fixes: {
    b1: [ok("while n > 0:", "while (n > 0) {", "while (n > 0) {"),
      no("while n > 10:", "while (n > 10) {", "while (n > 10) {", "Still stops before the first digit is added.", "Hört immer noch auf, bevor die erste Ziffer dazukommt."),
      no("while n < 0:", "while (n < 0) {", "while (n < 0) {", "4096 is not negative. The loop never starts.", "4096 ist nicht negativ. Die Schleife startet nie.")],
    b2: [ok("n = n // 10", "n = n / 10;", "n = Math.floor(n / 10);"),
      no("n = n - 10", "n = n - 10;", "n = n - 10;", "Subtracts 10 instead of removing a digit: hundreds of rounds of nonsense.", "Zieht 10 ab, statt eine Ziffer zu entfernen: Hunderte Runden Unsinn."),
      no("n = n // 100", "n = n / 100;", "n = Math.floor(n / 100);", "Removes two digits at once. Every second digit is stolen.", "Entfernt zwei Ziffern auf einmal. Jede zweite Ziffer wird geklaut.")]
  },
  sim(F, lang) {
    const s = [P("n", { n: "4096" }), P("t", { total: "0" })]; let n = 4096, tot = 0, r = 0;
    for (;;) { const lim = F.has("b1") ? 0 : 9, y = n > lim; s.push(P("b1", null, `${n} > ${lim} → ${bool(y, lang)}`)); if (!y) break;
      const old = tot; tot += n % 10; s.push(P("add", { total: String(tot) }, `${old} + ${n % 10} = ${tot}`));
      n = F.has("b2") ? Math.floor(n / 10) : n % 10; s.push(P("b2", { n: String(n) }));
      if (++r >= 6) { s.push(LOOP("b1", `${n} > ${lim} → ${bool(true, lang)} …`)); return s; } }
    s.push(O("out", tot));
    return s;
  } },

{ id: "i7",
  title: tx("The Sentence That Reads Both Ways", "Der Satz, der in beide Richtungen geht"),
  who: tx("Poet Remy", "Dichter Remy"),
  quote: tx("“Never odd or even” reads the same backwards, if you ignore spaces and capitals. My palindrome checker says no. I have written 300 poems for nothing.", "„Never odd or even“ liest sich rückwärts gleich, wenn man Leerzeichen und Großbuchstaben ignoriert. Mein Palindrom-Prüfer sagt nein. Ich habe 300 Gedichte umsonst geschrieben."),
  culprit: tx("Mirror Mira", "Spiegel-Siggi"),
  lesson: tx("Clean the data first (spaces, capitals), then compare. And a backwards loop must reach index 0.", "Erst die Daten säubern (Leerzeichen, Großbuchstaben), dann vergleichen. Und eine Rückwärts-Schleife muss bis Index 0 laufen."),
  card: tx("Sprints, crunches, all-nighters: all mine.", "Sprints, Crunch, Nachtschichten: alles meins."),
  hints: [], want: lang => [bool(true, lang)], bugs: ["b1", "b2", "b3"],
  code: {
    py: [['text = "Never odd or even"', "tx"], ["clean = text", "b1"], ['rev = ""', "r"], ["for i in range(len(clean) - 1, 0, -1):", "b2"], ["    rev += clean[i]", "add"], ["print(rev == clean)", "b3"]],
    java: [['String text = "Never odd or even";', "tx"], ["String clean = text;", "b1"], ['String rev = "";', "r"], ["for (int i = clean.length() - 1; i > 0; i--) {", "b2"], ["    rev += clean.charAt(i);", "add"], "}", ["System.out.println(rev.equals(clean));", "b3"]],
    js: [['const text = "Never odd or even";', "tx"], ["const clean = text;", "b1"], ['let rev = "";', "r"], ["for (let i = clean.length - 1; i > 0; i--) {", "b2"], ["  rev += clean[i];", "add"], "}", ["console.log(rev === clean);", "b3"]]
  },
  fixes: {
    b1: [ok('clean = text.replace(" ", "")', 'String clean = text.replace(" ", "");', 'const clean = text.replaceAll(" ", "");'),
      no("clean = text.lower()", "String clean = text.toLowerCase();", "const clean = text.toLowerCase();", "The spaces stay, and they land in different places when reversed.", "Die Leerzeichen bleiben und landen rückwärts an anderen Stellen."),
      no("clean = text.strip()", "String clean = text.trim();", "const clean = text.trim();", "Only removes spaces at the very start and end.", "Entfernt nur Leerzeichen ganz am Anfang und Ende.")],
    b2: [ok("for i in range(len(clean) - 1, -1, -1):", "for (int i = clean.length() - 1; i >= 0; i--) {", "for (let i = clean.length - 1; i >= 0; i--) {"),
      no("for i in range(len(clean) - 2, -1, -1):", "for (int i = clean.length() - 2; i >= 0; i--) {", "for (let i = clean.length - 2; i >= 0; i--) {", "Now the last letter is missing instead of the first.", "Jetzt fehlt der letzte Buchstabe statt dem ersten."),
      no("for i in range(len(clean) - 1, 1, -1):", "for (int i = clean.length() - 1; i > 1; i--) {", "for (let i = clean.length - 1; i > 1; i--) {", "Stops even earlier: two letters missing.", "Hört noch früher auf: Zwei Buchstaben fehlen.")],
    b3: [ok("print(rev.lower() == clean.lower())", "System.out.println(rev.equalsIgnoreCase(clean));", "console.log(rev.toLowerCase() === clean.toLowerCase());"),
      no("print(rev == clean.lower())", "System.out.println(rev.equals(clean.toLowerCase()));", "console.log(rev === clean.toLowerCase());", "Only one side is lowercased. The capital N in rev still does not match.", "Nur eine Seite wird kleingeschrieben. Das große N in rev passt weiter nicht."),
      no("print(rev.upper() == clean)", "System.out.println(rev.toUpperCase().equals(clean));", "console.log(rev.toUpperCase() === clean);", "Uppercases only rev. “NEVER” is not “Never”.", "Macht nur rev groß. „NEVER“ ist nicht „Never“.")]
  },
  sim(F, lang) {
    const text = "Never odd or even", clean = F.has("b1") ? text.replace(/ /g, "") : text, stop = F.has("b2") ? 0 : 1;
    const s = [P("tx", { text: q(text) }), P("b1", { clean: q(clean) }), P("r", { rev: '""' })]; let rev = "";
    for (let i = clean.length - 1; i >= stop; i--) { s.push(P("b2", { i: String(i) })); rev += clean[i]; s.push(P("add", { rev: q(rev) })); }
    s.push(P("b2", null, L(W.ends)));
    const eq = F.has("b3") ? rev.toLowerCase() === clean.toLowerCase() : rev === clean;
    s.push(O("b3", bool(eq, lang), null, `"${rev}" ${F.has("b3") ? "≈" : "=="} "${clean}"`));
    return s;
  } },

{ id: "i8",
  title: tx("The Missing February 29th", "Der verschwundene 29. Februar"),
  who: tx("Lena, calendar printer", "Lena, Kalenderdruckerei"),
  quote: tx("Leap years: 2020 yes, 2200 no, 2000 yes, 2023 no. Our program gave 2200 a February 29th. We printed 10 000 calendars.", "Schaltjahre: 2020 ja, 2200 nein, 2000 ja, 2023 nein. Unser Programm hat 2200 einen 29. Februar geschenkt. Wir haben 10 000 Kalender gedruckt."),
  culprit: tx("Calendar Cal", "Kalender-Karla"),
  lesson: tx("Leap year: divisible by 4, but NOT by 100, unless also by 400. Every number in such a rule matters.", "Schaltjahr: durch 4 teilbar, aber NICHT durch 100, außer auch durch 400. Jede Zahl in so einer Regel zählt."),
  card: tx("Ship it now. Test it later.", "Jetzt ausliefern. Später testen."),
  hints: [], want: lang => [bool(true, lang), bool(false, lang), bool(true, lang), bool(false, lang)], bugs: ["b1", "b2", "b3"],
  code: {
    py: [["for y in [2020, 2200, 2000, 2023]:", "lp"], ["    div4 = y % 4 == 0", "d4"], ["    div100 = y % 10 == 0", "b1"], ["    div400 = y % 40 == 0", "b2"], ["    print(div4 and div100 or div400)", "b3"]],
    java: [["for (int y : new int[]{2020, 2200, 2000, 2023}) {", "lp"], ["    boolean div4 = y % 4 == 0;", "d4"], ["    boolean div100 = y % 10 == 0;", "b1"], ["    boolean div400 = y % 40 == 0;", "b2"], ["    System.out.println(div4 && div100 || div400);", "b3"], "}"],
    js: [["for (const y of [2020, 2200, 2000, 2023]) {", "lp"], ["  const div4 = y % 4 === 0;", "d4"], ["  const div100 = y % 10 === 0;", "b1"], ["  const div400 = y % 40 === 0;", "b2"], ["  console.log(div4 && div100 || div400);", "b3"], "}"]
  },
  fixes: {
    b1: [ok("div100 = y % 100 == 0", "boolean div100 = y % 100 == 0;", "const div100 = y % 100 === 0;"),
      no("div100 = y % 1000 == 0", "boolean div100 = y % 1000 == 0;", "const div100 = y % 1000 === 0;", "That checks for 1000, not 100.", "Das prüft auf 1000, nicht auf 100."),
      no("div100 = y // 100 == 0", "boolean div100 = y / 100 == 0;", "const div100 = Math.floor(y / 100) === 0;", "Division, not remainder. 2200 // 100 is 22, never 0.", "Division statt Rest. 2200 // 100 ist 22, nie 0.")],
    b2: [ok("div400 = y % 400 == 0", "boolean div400 = y % 400 == 0;", "const div400 = y % 400 === 0;"),
      no("div400 = y % 4000 == 0", "boolean div400 = y % 4000 == 0;", "const div400 = y % 4000 === 0;", "One zero too many: 2000 would lose its leap day.", "Eine Null zu viel: 2000 verlöre seinen Schalttag."),
      no("div400 = y % 200 == 0", "boolean div400 = y % 200 == 0;", "const div400 = y % 200 === 0;", "2200 is divisible by 200. It would get a leap day again.", "2200 ist durch 200 teilbar. Es bekäme wieder einen Schalttag.")],
    b3: [ok("print(div4 and not div100 or div400)", "System.out.println(div4 && !div100 || div400);", "console.log(div4 && !div100 || div400);"),
      no("print(div4 or div100 and div400)", "System.out.println(div4 || div100 && div400);", "console.log(div4 || div100 && div400);", "Every year divisible by 4 passes, 2200 too.", "Jedes durch 4 teilbare Jahr kommt durch, auch 2200."),
      no("print(div4 and div400)", "System.out.println(div4 && div400);", "console.log(div4 && div400);", "Only every 400th year would be a leap year.", "Nur jedes 400. Jahr wäre ein Schaltjahr.")]
  },
  sim(F, lang) {
    const s = [], m1 = F.has("b1") ? 100 : 10, m2 = F.has("b2") ? 400 : 40;
    for (const y of [2020, 2200, 2000, 2023]) {
      s.push(P("lp", { y: String(y) }));
      const a = y % 4 === 0, b = y % m1 === 0, c = y % m2 === 0;
      s.push(P("d4", { div4: bool(a, lang) }), P("b1", { div100: bool(b, lang) }, `${y} % ${m1} = ${y % m1}`), P("b2", { div400: bool(c, lang) }, `${y} % ${m2} = ${y % m2}`));
      s.push(O("b3", bool(F.has("b3") ? (a && !b) || c : (a && b) || c, lang)));
    }
    return s;
  } },

{ id: "i9",
  title: tx("The Unsortable Podium", "Das unsortierbare Siegertreppchen"),
  who: tx("Coach Rosa", "Trainerin Rosa"),
  quote: tx("Places 3, 1 and 2 should be sorted to 1, 2, 3. The sorting program turned them into 1, 1, 2. Third place has vanished and first place has a twin.", "Die Plätze 3, 1 und 2 sollen zu 1, 2, 3 sortiert werden. Das Sortierprogramm machte daraus 1, 1, 2. Platz 3 ist verschwunden, und Platz 1 hat einen Zwilling."),
  culprit: tx("Swap Swantje", "Tausch-Tobi"),
  lesson: tx("A swap needs a temporary variable, and once a[j] is overwritten its old value lives only in tmp. Bubble sort compares neighbours up to the second-to-last index.", "Ein Tausch braucht eine Zwischenvariable: Ist a[j] einmal überschrieben, lebt sein alter Wert nur noch in tmp. Bubblesort vergleicht Nachbarn bis zum vorletzten Index."),
  card: tx("Signed: D.", "Gezeichnet: D."),
  hints: [], want: lang => [lang === "js" ? "[1,2,3]" : "[1, 2, 3]"], bugs: ["b1", "b2", "b3"],
  code: {
    py: [["a = [3, 1, 2]", "a"], ["for i in range(len(a)):", "li"], ["    for j in range(len(a) - 2):", "b1"], ["        if a[j] < a[j + 1]:", "b2"], ["            tmp = a[j]", "tmp"], ["            a[j] = a[j + 1]", "s1"], ["            a[j + 1] = a[j]", "b3"], ["print(a)", "out"]],
    java: [["int[] a = {3, 1, 2};", "a"], ["for (int i = 0; i < a.length; i++) {", "li"], ["    for (int j = 0; j < a.length - 2; j++) {", "b1"], ["        if (a[j] < a[j + 1]) {", "b2"], ["            int tmp = a[j];", "tmp"], ["            a[j] = a[j + 1];", "s1"], ["            a[j + 1] = a[j];", "b3"], "        }", "    }", "}", ["System.out.println(Arrays.toString(a));", "out"]],
    js: [["const a = [3, 1, 2];", "a"], ["for (let i = 0; i < a.length; i++) {", "li"], ["  for (let j = 0; j < a.length - 2; j++) {", "b1"], ["    if (a[j] < a[j + 1]) {", "b2"], ["      const tmp = a[j];", "tmp"], ["      a[j] = a[j + 1];", "s1"], ["      a[j + 1] = a[j];", "b3"], "    }", "  }", "}", ["console.log(JSON.stringify(a));", "out"]]
  },
  fixes: {
    b1: [ok("for j in range(len(a) - 1):", "for (int j = 0; j < a.length - 1; j++) {", "for (let j = 0; j < a.length - 1; j++) {"),
      no("for j in range(len(a)):", "for (int j = 0; j < a.length; j++) {", "for (let j = 0; j < a.length; j++) {", "At the last j, a[j + 1] does not exist.", "Beim letzten j gibt es a[j + 1] nicht."),
      no("for j in range(1, len(a) - 1):", "for (int j = 1; j < a.length - 1; j++) {", "for (let j = 1; j < a.length - 1; j++) {", "Never compares the first two places.", "Vergleicht nie die ersten beiden Plätze.")],
    b2: [ok("if a[j] > a[j + 1]:", "if (a[j] > a[j + 1]) {", "if (a[j] > a[j + 1]) {"),
      no("if a[j] == a[j + 1]:", "if (a[j] == a[j + 1]) {", "if (a[j] === a[j + 1]) {", "Swapping equal values changes nothing.", "Gleiche Werte tauschen ändert nichts."),
      no("if a[j] < a[j]:", "if (a[j] < a[j]) {", "if (a[j] < a[j]) {", "Nothing is ever smaller than itself.", "Nichts ist je kleiner als es selbst.")],
    b3: [ok("a[j + 1] = tmp", "a[j + 1] = tmp;", "a[j + 1] = tmp;"),
      no("a[j] = tmp", "a[j] = tmp;", "a[j] = tmp;", "Puts the old value back where it was. No swap at all.", "Legt den alten Wert zurück, wo er war. Gar kein Tausch."),
      no("a[j + 1] = a[j + 1]", "a[j + 1] = a[j + 1];", "a[j + 1] = a[j + 1];", "Assigns a value to itself. The old a[j] is lost.", "Weist einen Wert sich selbst zu. Das alte a[j] ist verloren.")]
  },
  sim(F, lang) {
    const a = [3, 1, 2], fm = () => lang === "java" ? "{" + a.join(", ") + "}" : "[" + a.join(", ") + "]", s = [P("a", { a: fm() })], end = F.has("b1") ? 2 : 1;
    for (let i = 0; i < 3; i++) { s.push(P("li", { i: String(i) }));
      for (let j = 0; j < end; j++) { s.push(P("b1", { j: String(j) }));
        const y = F.has("b2") ? a[j] > a[j + 1] : a[j] < a[j + 1]; s.push(P("b2", null, `${a[j]} ${F.has("b2") ? ">" : "<"} ${a[j + 1]} → ${bool(y, lang)}`));
        if (y) { const tmp = a[j]; s.push(P("tmp", { tmp: String(tmp) })); a[j] = a[j + 1]; s.push(P("s1", { a: fm() })); a[j + 1] = F.has("b3") ? tmp : a[j]; s.push(P("b3", { a: fm() })); } } }
    s.push(O("out", lang === "js" ? "[" + a.join(",") + "]" : "[" + a.join(", ") + "]"));
    return s;
  } },

{ id: "i10", final: true, time: 150,
  title: tx("The Doomsday Clock", "Die Weltuntergangsuhr"),
  who: tx("Mayor Ola", "Bürgermeisterin Ola"),
  quote: tx("3725 seconds until the city festival: that is 1 hour, 2 minutes, 5 seconds. The big town clock shows 10:5:62. People are panicking. A note says: “Signed: D.”", "3725 Sekunden bis zum Stadtfest: Das sind 1 Stunde, 2 Minuten, 5 Sekunden. Die große Stadtuhr zeigt 10:5:62. Die Leute geraten in Panik. Auf einem Zettel steht: „Gezeichnet: D.“"),
  culprit: tx("The Deadline", "Die Deadline"),
  lesson: tx("Converting units is all // and %: hours = s // 3600, minutes = s % 3600 // 60, seconds = s % 60. Under pressure, slow down and check each line.", "Einheiten umrechnen ist nur // und %: Stunden = s // 3600, Minuten = s % 3600 // 60, Sekunden = s % 60. Unter Druck langsam machen und jede Zeile prüfen."),
  hints: [], want: ["1:2:5"], bugs: ["b1", "b2", "b3"],
  code: {
    py: [["seconds = 3725", "s"], ["hours = seconds // 360", "b1"], ["minutes = seconds % 60", "b2"], ["secs = seconds // 60", "b3"], ['print(hours, minutes, secs, sep=":")', "out"]],
    java: [["int seconds = 3725;", "s"], ["int hours = seconds / 360;", "b1"], ["int minutes = seconds % 60;", "b2"], ["int secs = seconds / 60;", "b3"], ['System.out.println(hours + ":" + minutes + ":" + secs);', "out"]],
    js: [["const seconds = 3725;", "s"], ["const hours = Math.floor(seconds / 360);", "b1"], ["const minutes = seconds % 60;", "b2"], ["const secs = Math.floor(seconds / 60);", "b3"], ['console.log(hours + ":" + minutes + ":" + secs);', "out"]]
  },
  fixes: {
    b1: [ok("hours = seconds // 3600", "int hours = seconds / 3600;", "const hours = Math.floor(seconds / 3600);"),
      no("hours = seconds // 60", "int hours = seconds / 60;", "const hours = Math.floor(seconds / 60);", "That is minutes, not hours: 62.", "Das sind Minuten, keine Stunden: 62."),
      no("hours = seconds % 3600", "int hours = seconds % 3600;", "const hours = seconds % 3600;", "That is what is left after the hours, not the hours.", "Das ist der Rest nach den Stunden, nicht die Stunden.")],
    b2: [ok("minutes = seconds % 3600 // 60", "int minutes = seconds % 3600 / 60;", "const minutes = Math.floor(seconds % 3600 / 60);"),
      no("minutes = seconds // 60", "int minutes = seconds / 60;", "const minutes = Math.floor(seconds / 60);", "Counts all minutes, including the full hour: 62.", "Zählt alle Minuten, auch die der vollen Stunde: 62."),
      no("minutes = seconds % 3600", "int minutes = seconds % 3600;", "const minutes = seconds % 3600;", "That is 125 seconds, not 2 minutes.", "Das sind 125 Sekunden, keine 2 Minuten.")],
    b3: [ok("secs = seconds % 60", "int secs = seconds % 60;", "const secs = seconds % 60;"),
      no("secs = seconds - 60", "int secs = seconds - 60;", "const secs = seconds - 60;", "3665 seconds left over? That is not how clocks work.", "3665 Sekunden übrig? So funktionieren Uhren nicht."),
      no("secs = seconds % 3600", "int secs = seconds % 3600;", "const secs = seconds % 3600;", "That is the rest of the hour: 125 seconds.", "Das ist der Rest der Stunde: 125 Sekunden.")]
  },
  sim(F) {
    const sec = 3725, h = Math.floor(sec / (F.has("b1") ? 3600 : 360)), m = F.has("b2") ? Math.floor(sec % 3600 / 60) : sec % 60, x = F.has("b3") ? sec % 60 : Math.floor(sec / 60);
    return [P("s", { seconds: String(sec) }), P("b1", { hours: String(h) }), P("b2", { minutes: String(m) }), P("b3", { secs: String(x) }), O("out", `${h}:${m}:${x}`)];
  } }
]});
