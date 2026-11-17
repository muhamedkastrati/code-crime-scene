/* ---------- level 2: medium ---------- */
LEVELS.push({ id: "medium", name: tx("Medium", "Medium"), color: "#2f9bff", base: 20, time: null, hints: 2, hide: false,
 villain: { name: tx("The Copycat", "Die Kopierkatze"), svg: "cat",
   end: tx("The Copycat is caught. Pasted code carries pasted mistakes. Every copied line deserves a second look.",
           "Die Kopierkatze ist gefasst. Eingefügter Code bringt eingefügte Fehler mit. Jede kopierte Zeile verdient einen zweiten Blick.") },
 cases: [
{ id: "m1",
  title: tx("The Silent Capital", "Der stumme Großbuchstabe"),
  who: tx("Elif, word game designer", "Elif, entwirft Wortspiele"),
  quote: tx("Anna has two vowels: A and a. My game gave her only one point. She says the game hates capital letters.", "Anna hat zwei Vokale: A und a. Mein Spiel gab ihr nur einen Punkt. Sie sagt, das Spiel hasst Großbuchstaben."),
  culprit: tx("Lowercase Lou", "Klein-Klara"),
  lesson: tx("Text comparisons are case-sensitive: \"A\" is not \"a\". Convert to lower case before you compare.", "Textvergleiche achten auf Groß und Klein: \"A\" ist nicht \"a\". Wandle vor dem Vergleich in Kleinbuchstaben um."),
  card: tx("Copy that.", "Verstanden. Kopiert."),
  hints: [tx("Watch which letters make the counter go up. What about the very first one?", "Achte darauf, welche Buchstaben den Zähler erhöhen. Was ist mit dem allerersten?"),
          tx("Capital A is not in \"aeiou\". Make the letter small first.", "Großes A steht nicht in \"aeiou\". Mach den Buchstaben erst klein.")],
  want: ["2"], bugs: ["b1"],
  code: {
    py: [['word = "Anna"', "w"], ["vowels = 0", "v"], ["for ch in word:", "lp"], ['    if ch in "aeiou":', "b1"], ["        vowels += 1", "inc"], ["print(vowels)", "out"]],
    java: [['String word = "Anna";', "w"], ["int vowels = 0;", "v"], ["for (char ch : word.toCharArray()) {", "lp"], ['    if ("aeiou".indexOf(ch) >= 0) {', "b1"], ["        vowels++;", "inc"], "    }", "}", ["System.out.println(vowels);", "out"]],
    js: [['const word = "Anna";', "w"], ["let vowels = 0;", "v"], ["for (const ch of word) {", "lp"], ['  if ("aeiou".includes(ch)) {', "b1"], ["    vowels++;", "inc"], "  }", "}", ["console.log(vowels);", "out"]]
  },
  fixes: { b1: [
    ok('if ch.lower() in "aeiou":', 'if ("aeiou".indexOf(Character.toLowerCase(ch)) >= 0) {', 'if ("aeiou".includes(ch.toLowerCase())) {'),
    no('if ch in "AEIOU":', 'if ("AEIOU".indexOf(ch) >= 0) {', 'if ("AEIOU".includes(ch)) {', "Now only capital vowels count. The small a at the end would be missed.", "Jetzt zählen nur große Vokale. Das kleine a am Ende fehlt dann."),
    no('if ch in "aeiouy":', 'if ("aeiouy".indexOf(ch) >= 0) {', 'if ("aeiouy".includes(ch)) {', "Adding y does not help: the problem is the capital A, not a missing letter.", "Ein y hinzuzufügen hilft nicht: Das Problem ist das große A, nicht ein fehlender Buchstabe.")
  ] },
  sim(F, lang) {
    const s = [P("w", { word: q("Anna") }), P("v", { vowels: "0" })]; let v = 0;
    for (const ch of "Anna") {
      s.push(P("lp", { ch: cq(ch, lang) }));
      const hit = "aeiou".includes(F.has("b1") ? ch.toLowerCase() : ch);
      s.push(P("b1", null, `${cq(F.has("b1") ? ch.toLowerCase() : ch, lang)} → ${bool(hit, lang)}`));
      if (hit) { v++; s.push(P("inc", { vowels: String(v) })); }
    }
    s.push(O("out", v));
    return s;
  } },

{ id: "m2",
  title: tx("The Backwards Billboard", "Die verkehrte Leuchtreklame"),
  who: tx("Ravi, sign maker", "Ravi, baut Schilder"),
  quote: tx("For the mirror sign we reverse the word. LOOP backwards must be POOL. The machine wrote POO. The mayor is not amused.", "Für das Spiegelschild drehen wir das Wort um. LOOP rückwärts muss POOL sein. Die Maschine schrieb POO. Der Bürgermeister ist nicht amüsiert."),
  culprit: tx("Zero Zoe", "Null-Nora"),
  lesson: tx("Counting down has to reach index 0. In Python range stops before its end, so the end must be -1. In Java and JavaScript use i >= 0.", "Rückwärts zählen muss bei Index 0 ankommen. In Python hört range vor dem Ende auf, also muss das Ende -1 sein. In Java und JavaScript nimm i >= 0."),
  card: tx("Paste, paste, paste.", "Einfügen, einfügen, einfügen."),
  hints: [tx("How many letters end up in rev? Which one is missing?", "Wie viele Buchstaben landen in rev? Welcher fehlt?"),
          tx("Positions start at 0. Does the loop ever reach i = 0?", "Positionen beginnen bei 0. Erreicht die Schleife jemals i = 0?")],
  want: ["POOL"], bugs: ["b1"],
  code: {
    py: [['word = "LOOP"', "w"], ['rev = ""', "r"], ["for i in range(len(word) - 1, 0, -1):", "b1"], ["    rev += word[i]", "add"], ["print(rev)", "out"]],
    java: [['String word = "LOOP";', "w"], ['String rev = "";', "r"], ["for (int i = word.length() - 1; i > 0; i--) {", "b1"], ["    rev += word.charAt(i);", "add"], "}", ["System.out.println(rev);", "out"]],
    js: [['const word = "LOOP";', "w"], ['let rev = "";', "r"], ["for (let i = word.length - 1; i > 0; i--) {", "b1"], ["  rev += word[i];", "add"], "}", ["console.log(rev);", "out"]]
  },
  fixes: { b1: [
    ok("for i in range(len(word) - 1, -1, -1):", "for (int i = word.length() - 1; i >= 0; i--) {", "for (let i = word.length - 1; i >= 0; i--) {"),
    no("for i in range(len(word), 0, -1):", "for (int i = word.length(); i > 0; i--) {", "for (let i = word.length; i > 0; i--) {", "Starts one place too far: there is no letter at position 4. Crash (JavaScript adds “undefined”).", "Beginnt eine Stelle zu weit: An Position 4 gibt es keinen Buchstaben. Absturz (JavaScript hängt „undefined“ an)."),
    no("for i in range(0, len(word)):", "for (int i = 0; i < word.length(); i++) {", "for (let i = 0; i < word.length; i++) {", "That walks forwards. You would get LOOP again, not POOL.", "Das läuft vorwärts. Heraus käme wieder LOOP, nicht POOL.")
  ] },
  sim(F) {
    const w = "LOOP", end = F.has("b1") ? 0 : 1, s = [P("w", { word: q(w) }), P("r", { rev: '""' })]; let rev = "";
    for (let i = 3; i >= end; i--) { s.push(P("b1", { i: String(i) })); rev += w[i]; s.push(P("add", { rev: q(rev) }, `+ "${w[i]}"`)); }
    s.push(P("b1", null, `${L(W.ends)}: i = ${end - 1}`), O("out", rev));
    return s;
  } },

{ id: "m3",
  title: tx("The Phantom Heatwave", "Die Phantom-Hitzewelle"),
  who: tx("Sven, polar researcher", "Sven, Polarforscher"),
  quote: tx("It was −5, −2 and −9 degrees this week. The report says the warmest day was 0 degrees. That day never happened!", "Diese Woche hatte es −5, −2 und −9 Grad. Der Bericht sagt, der wärmste Tag hatte 0 Grad. Den Tag gab es nie!"),
  culprit: tx("Start-Value Stan", "Startwert-Stefan"),
  lesson: tx("A starting value can win by accident. Start “the best so far” with the first real value, not with 0.", "Ein Startwert kann aus Versehen gewinnen. Starte „das Beste bisher“ mit dem ersten echten Wert, nicht mit 0."),
  card: tx("Meow.", "Miau."),
  hints: [tx("Does warmest ever change during the reconstruction?", "Ändert sich warmest beim Nachstellen überhaupt?"),
          tx("Every temperature is below 0. What does warmest start with?", "Jede Temperatur liegt unter 0. Womit startet warmest?")],
  want: ["-2"], bugs: ["b1"],
  code: {
    py: [["temps = [-5, -2, -9]", "tp"], ["warmest = 0", "b1"], ["for t in temps:", "lp"], ["    if t > warmest:", "if"], ["        warmest = t", "set"], ["print(warmest)", "out"]],
    java: [["int[] temps = {-5, -2, -9};", "tp"], ["int warmest = 0;", "b1"], ["for (int t : temps) {", "lp"], ["    if (t > warmest) {", "if"], ["        warmest = t;", "set"], "    }", "}", ["System.out.println(warmest);", "out"]],
    js: [["const temps = [-5, -2, -9];", "tp"], ["let warmest = 0;", "b1"], ["for (const t of temps) {", "lp"], ["  if (t > warmest) {", "if"], ["    warmest = t;", "set"], "  }", "}", ["console.log(warmest);", "out"]]
  },
  fixes: { b1: [
    ok("warmest = temps[0]", "int warmest = temps[0];", "let warmest = temps[0];"),
    no("warmest = -1", "int warmest = -1;", "let warmest = -1;", "-1 is still warmer than every temperature in the list. The answer would be −1.", "-1 ist immer noch wärmer als jede Temperatur in der Liste. Ergebnis wäre −1."),
    no("warmest = 100", "int warmest = 100;", "let warmest = 100;", "Nothing beats 100, so 100 would stay the “warmest” day.", "Nichts schlägt 100, also bliebe 100 der „wärmste“ Tag.")
  ] },
  sim(F, lang) {
    const tp = [-5, -2, -9]; let w = F.has("b1") ? -5 : 0;
    const s = [P("tp", { temps: arr(tp, lang) }), P("b1", { warmest: String(w) })];
    for (const t of tp) {
      s.push(P("lp", { t: String(t) }));
      const r = t > w; s.push(P("if", null, `${t} > ${w} → ${bool(r, lang)}`));
      if (r) { w = t; s.push(P("set", { warmest: String(w) })); }
    }
    s.push(O("out", w));
    return s;
  } },

{ id: "m4",
  title: tx("The Two Right Shoes", "Die zwei rechten Schuhe"),
  who: tx("Juno, robot engineer", "Juno, baut Roboter"),
  quote: tx("My robot should swap its shoes from left to right. Now it is wearing two right shoes and keeps walking in circles.", "Mein Roboter soll seine Schuhe von links nach rechts tauschen. Jetzt trägt er zwei rechte Schuhe und läuft im Kreis."),
  culprit: tx("Overwrite Olga", "Überschreib-Olga"),
  lesson: tx("Swapping needs a parking spot. After a = b the old value of a is gone, unless you saved it in temp first.", "Tauschen braucht einen Parkplatz. Nach a = b ist der alte Wert von a weg, außer du hast ihn vorher in temp gesichert."),
  card: tx("Purr…", "Schnurr …"),
  hints: [tx("Watch the sticky notes: after line 4, where is the word “left” still stored?", "Achte auf die Notizzettel: Wo steht das Wort „left“ nach Zeile 4 noch?"),
          tx("temp holds the old a. Is it ever used?", "temp hält das alte a fest. Wird es je benutzt?")],
  want: ["right left"], bugs: ["b1"],
  code: {
    py: [['a = "left"', "a"], ['b = "right"', "b"], ["temp = a", "tm"], ["a = b", "ab"], ["b = a", "b1"], ["print(a, b)", "out"]],
    java: [['String a = "left";', "a"], ['String b = "right";', "b"], ["String temp = a;", "tm"], ["a = b;", "ab"], ["b = a;", "b1"], ['System.out.println(a + " " + b);', "out"]],
    js: [['let a = "left";', "a"], ['let b = "right";', "b"], ["const temp = a;", "tm"], ["a = b;", "ab"], ["b = a;", "b1"], ["console.log(a, b);", "out"]]
  },
  fixes: { b1: [
    ok("b = temp", "b = temp;", "b = temp;"),
    no("b = b", "b = b;", "b = b;", "b keeps “right”. Both shoes stay right shoes.", "b bleibt „right“. Beide Schuhe bleiben rechte Schuhe."),
    no('b = "a"', 'b = "a";', 'b = "a";', "That stores the letter a as text, not a value.", "Das speichert den Buchstaben a als Text, nicht einen Wert.")
  ] },
  sim(F) {
    const nb = F.has("b1") ? "left" : "right";
    return [P("a", { a: q("left") }), P("b", { b: q("right") }), P("tm", { temp: q("left") }), P("ab", { a: q("right") }), P("b1", { b: q(nb) }), O("out", "right " + nb)];
  } },

{ id: "m5",
  title: tx("The Last Ice Cream", "Das letzte Eis"),
  who: tx("Lotta, ice cream fan", "Lotta, Eis-Fan"),
  quote: tx("I had 21 coins and each ice cream costs 7. The app sold me 2 and kept my last 7 coins. Exactly 7! That is a whole ice cream!", "Ich hatte 21 Münzen, und jedes Eis kostet 7. Die App hat mir 2 verkauft und meine letzten 7 Münzen behalten. Genau 7! Das ist ein ganzes Eis!"),
  culprit: tx("Almost Al", "Beinahe-Bea"),
  lesson: tx("While loops have borders too. “As long as I can afford it” means budget >= price, including the exact amount.", "Auch while-Schleifen haben Grenzen. „Solange ich es mir leisten kann“ heißt budget >= price, den genauen Betrag eingeschlossen."),
  card: tx("Copy. Paste. Escape.", "Kopieren. Einfügen. Abhauen."),
  hints: [tx("After two ice creams, how much money is left? Is it enough for one more?", "Wie viel Geld ist nach zwei Eis übrig? Reicht das für noch eins?"),
          tx("Check the while condition when budget and price are equal.", "Prüf die while-Bedingung, wenn budget und price gleich sind.")],
  want: ["3"], bugs: ["b1"],
  code: {
    py: [["budget = 21", "bu"], ["price = 7", "pr"], ["bought = 0", "bo"], ["while budget > price:", "b1"], ["    budget -= price", "sub"], ["    bought += 1", "inc"], ["print(bought)", "out"]],
    java: [["int budget = 21;", "bu"], ["int price = 7;", "pr"], ["int bought = 0;", "bo"], ["while (budget > price) {", "b1"], ["    budget -= price;", "sub"], ["    bought++;", "inc"], "}", ["System.out.println(bought);", "out"]],
    js: [["let budget = 21;", "bu"], ["const price = 7;", "pr"], ["let bought = 0;", "bo"], ["while (budget > price) {", "b1"], ["  budget -= price;", "sub"], ["  bought++;", "inc"], "}", ["console.log(bought);", "out"]]
  },
  fixes: { b1: [
    ok("while budget >= price:", "while (budget >= price) {", "while (budget >= price) {"),
    no("while budget > 0:", "while (budget > 0) {", "while (budget > 0) {", "Works for 21 by luck. With 20 coins it would buy a third ice cream for 6 and go into debt.", "Klappt bei 21 nur zufällig. Mit 20 Münzen würde es ein drittes Eis für 6 kaufen und Schulden machen."),
    no("while budget < price:", "while (budget < price) {", "while (budget < price) {", "This loop never even starts: 21 is not less than 7. Nothing gets bought.", "Diese Schleife startet gar nicht: 21 ist nicht kleiner als 7. Es wird nichts gekauft.")
  ] },
  sim(F, lang) {
    const op = F.has("b1") ? ">=" : ">", s = [P("bu", { budget: "21" }), P("pr", { price: "7" }), P("bo", { bought: "0" })]; let b = 21, n = 0;
    for (;;) {
      const c = op === ">=" ? b >= 7 : b > 7;
      s.push(P("b1", null, `${b} ${op} 7 → ${bool(c, lang)}`));
      if (!c) break;
      b -= 7; s.push(P("sub", { budget: String(b) })); n++; s.push(P("inc", { bought: String(n) }));
    }
    s.push(O("out", n));
    return s;
  } },

{ id: "m6",
  title: tx("The Open Vault", "Der offene Tresor"),
  who: tx("Bea, bank security", "Bea, Banksicherheit"),
  quote: tx("Our rule: at least 8 characters AND a digit. Somebody opened the vault with the password “abc1”. Four characters!", "Unsere Regel: mindestens 8 Zeichen UND eine Ziffer. Jemand hat den Tresor mit dem Passwort „abc1“ geöffnet. Vier Zeichen!"),
  culprit: tx("Either-Or Ed", "Entweder-Oder-Edi"),
  lesson: tx("“or” lets you in if ONE condition is true, “and” needs BOTH. Security rules almost always need “and”.", "„oder“ lässt dich rein, wenn EINE Bedingung stimmt, „und“ braucht BEIDE. Sicherheitsregeln brauchen fast immer „und“."),
  card: tx("You are slower than my scissors.", "Du bist langsamer als meine Schere."),
  hints: [tx("Look at the bubble next to the if: which values get combined?", "Schau auf die Sprechblase neben dem if: Welche Werte werden verknüpft?"),
          tx("The rule says AND. What does the code say?", "Die Regel sagt UND. Was sagt der Code?")],
  want: ["rejected"], bugs: ["b1"],
  code: {
    py: [['pw = "abc1"', "pw"], ["long_enough = len(pw) >= 8", "le"], ["has_digit = any(c.isdigit() for c in pw)", "hd"], ["if long_enough or has_digit:", "b1"], ['    print("accepted")', "acc"], "else:", ['    print("rejected")', "rej"]],
    java: [['String pw = "abc1";', "pw"], ["boolean longEnough = pw.length() >= 8;", "le"], ['boolean hasDigit = pw.matches(".*\\\\d.*");', "hd"], ["if (longEnough || hasDigit) {", "b1"], ['    System.out.println("accepted");', "acc"], "} else {", ['    System.out.println("rejected");', "rej"], "}"],
    js: [['const pw = "abc1";', "pw"], ["const longEnough = pw.length >= 8;", "le"], ["const hasDigit = /\\d/.test(pw);", "hd"], ["if (longEnough || hasDigit) {", "b1"], ['  console.log("accepted");', "acc"], "} else {", ['  console.log("rejected");', "rej"], "}"]
  },
  fixes: { b1: [
    ok("if long_enough and has_digit:", "if (longEnough && hasDigit) {", "if (longEnough && hasDigit) {"),
    no("if long_enough or not has_digit:", "if (longEnough || !hasDigit) {", "if (longEnough || !hasDigit) {", "Still “or”: one condition is enough to pass. Long passwords without digits get in.", "Immer noch „oder“: Eine Bedingung reicht. Lange Passwörter ohne Ziffer kommen rein."),
    no("if not long_enough and has_digit:", "if (!longEnough && hasDigit) {", "if (!longEnough && hasDigit) {", "Now only SHORT passwords with a digit pass. Exactly the wrong ones.", "Jetzt kommen nur KURZE Passwörter mit Ziffer durch. Genau die falschen.")
  ] },
  sim(F, lang) {
    const le = vn("long_enough", "longEnough", lang), hd = vn("has_digit", "hasDigit", lang), k = F.has("b1");
    const op = lang === "py" ? (k ? "and" : "or") : (k ? "&&" : "||"), r = !k;
    return [P("pw", { pw: q("abc1") }), P("le", { [le]: bool(false, lang) }, "4 >= 8"), P("hd", { [hd]: bool(true, lang) }),
      P("b1", null, `${bool(false, lang)} ${op} ${bool(true, lang)} → ${bool(r, lang)}`), O(r ? "acc" : "rej", r ? "accepted" : "rejected")];
  } },

{ id: "m7",
  title: tx("The Zero Dominoes", "Die Null-Dominos"),
  who: tx("Kai, domino artist", "Kai, baut Domino-Kunst"),
  quote: tx("How many ways can I line up 5 dominoes? Should be 5 × 4 × 3 × 2 × 1 = 120. The program insists: 0. Zero! Is my art worthless?!", "Auf wie viele Arten kann ich 5 Dominosteine aufreihen? Sollte 5 × 4 × 3 × 2 × 1 = 120 sein. Das Programm besteht auf 0. Null! Ist meine Kunst wertlos?!"),
  culprit: tx("Zero Zack", "Null-Nils"),
  lesson: tx("Anything times 0 is 0. Products start at 1, sums start at 0.", "Alles mal 0 ist 0. Produkte starten bei 1, Summen bei 0."),
  card: tx("Scratch… scratch…", "Kratz … kratz …"),
  hints: [tx("What is on the result sticky note after each round?", "Was steht nach jeder Runde auf dem Notizzettel result?"),
          tx("What do you get when you multiply 0 by anything?", "Was kommt raus, wenn du 0 mit irgendwas multiplizierst?")],
  want: ["120"], bugs: ["b1"],
  code: {
    py: [["n = 5", "n"], ["result = 0", "b1"], ["for i in range(1, n + 1):", "lp"], ["    result *= i", "mul"], ["print(result)", "out"]],
    java: [["int n = 5;", "n"], ["int result = 0;", "b1"], ["for (int i = 1; i <= n; i++) {", "lp"], ["    result *= i;", "mul"], "}", ["System.out.println(result);", "out"]],
    js: [["const n = 5;", "n"], ["let result = 0;", "b1"], ["for (let i = 1; i <= n; i++) {", "lp"], ["  result *= i;", "mul"], "}", ["console.log(result);", "out"]]
  },
  fixes: { b1: [
    ok("result = 1", "int result = 1;", "let result = 1;"),
    no("result = n", "int result = n;", "let result = n;", "Then 5 gets multiplied in twice: 5 × 1 × 2 × 3 × 4 × 5 = 600.", "Dann wird die 5 doppelt eingerechnet: 5 × 1 × 2 × 3 × 4 × 5 = 600."),
    no("result = 5 * 4 * 3 * 2", "int result = 5 * 4 * 3 * 2;", "let result = 5 * 4 * 3 * 2;", "Right number to start with, but the loop multiplies everything again: 120 × 120 = 14400.", "Richtiger Start, aber die Schleife multipliziert alles nochmal: 120 × 120 = 14400.")
  ] },
  sim(F) {
    let r = F.has("b1") ? 1 : 0; const s = [P("n", { n: "5" }), P("b1", { result: String(r) })];
    for (let i = 1; i <= 5; i++) { s.push(P("lp", { i: String(i) })); const o = r; r *= i; s.push(P("mul", { result: String(r) }, `${o} * ${i} = ${r}`)); }
    s.push(O("out", r));
    return s;
  } },

{ id: "m8",
  title: tx("The Skipped Chapters", "Die übersprungenen Kapitel"),
  who: tx("Hedda, librarian", "Hedda, Bibliothekarin"),
  quote: tx("The printer should print pages 1 to 5. It printed 1, 3 and 5. Now the story jumps from the dragon straight to the wedding.", "Der Drucker soll die Seiten 1 bis 5 drucken. Er hat 1, 3 und 5 gedruckt. Jetzt springt die Geschichte vom Drachen direkt zur Hochzeit."),
  culprit: tx("Leapfrog Larry", "Bocksprung-Bruno"),
  lesson: tx("The third value of range (or page += 2) is the step size. Step 2 skips every second item.", "Der dritte Wert von range (oder page += 2) ist die Schrittweite. Schritt 2 überspringt jedes zweite Element."),
  card: tx("Copycats always land on their feet.", "Kopierkatzen landen immer auf den Pfoten."),
  hints: [tx("Which pages are missing? Do you see a pattern?", "Welche Seiten fehlen? Siehst du ein Muster?"),
          tx("Look at how much page grows each round.", "Schau, um wie viel page jede Runde wächst.")],
  want: ["1", "2", "3", "4", "5"], bugs: ["b1"],
  code: {
    py: [["last = 5", "l"], ["for page in range(1, last + 1, 2):", "b1"], ["    print(page)", "pr"]],
    java: [["int last = 5;", "l"], ["for (int page = 1; page <= last; page += 2) {", "b1"], ["    System.out.println(page);", "pr"], "}"],
    js: [["const last = 5;", "l"], ["for (let page = 1; page <= last; page += 2) {", "b1"], ["  console.log(page);", "pr"], "}"]
  },
  fixes: { b1: [
    ok("for page in range(1, last + 1):", "for (int page = 1; page <= last; page++) {", "for (let page = 1; page <= last; page++) {"),
    no("for page in range(0, last):", "for (int page = 0; page < last; page++) {", "for (let page = 0; page < last; page++) {", "Starts at page 0 and stops at 4. This book has no page 0.", "Beginnt bei Seite 0 und hört bei 4 auf. Eine Seite 0 hat das Buch nicht."),
    no("for page in range(2, last + 1, 2):", "for (int page = 2; page <= last; page += 2) {", "for (let page = 2; page <= last; page += 2) {", "Now only the even pages: 2 and 4.", "Jetzt nur die geraden Seiten: 2 und 4.")
  ] },
  sim(F) {
    const st = F.has("b1") ? 1 : 2, s = [P("l", { last: "5" })];
    for (let p = 1; p <= 5; p += st) { s.push(P("b1", { page: String(p) }, `+${st}`)); s.push(O("pr", p)); }
    s.push(P("b1", null, L(W.ends)));
    return s;
  } },

{ id: "m9",
  title: tx("The Fruit That Was Not There", "Die Frucht, die nicht da war"),
  who: tx("Mo, fruit stand", "Mo, Obststand"),
  quote: tx("I just wanted to show the last fruit in the basket. The screen exploded with an error. My customers ran away.", "Ich wollte nur die letzte Frucht im Korb anzeigen. Der Bildschirm explodierte mit einer Fehlermeldung. Meine Kundschaft ist weggelaufen."),
  culprit: tx("Reachy Rick", "Zu-weit-Zora"),
  lesson: tx("A list with 3 items has the positions 0, 1 and 2. The last position is always length − 1.", "Eine Liste mit 3 Einträgen hat die Positionen 0, 1 und 2. Die letzte Position ist immer Länge − 1."),
  card: tx("Nine lives, detective. I have nine lives.", "Neun Leben, Spürnase. Ich hab neun Leben."),
  hints: [tx("How many fruits are there, and what are their positions?", "Wie viele Früchte gibt es, und welche Positionen haben sie?"),
          tx("Counting starts at 0, so the last position is length − 1.", "Gezählt wird ab 0, also ist die letzte Position Länge − 1.")],
  want: ["pear"], bugs: ["b1"],
  code: {
    py: [['fruits = ["apple", "kiwi", "pear"]', "f"], ["last = fruits[len(fruits)]", "b1"], ["print(last)", "out"]],
    java: [['String[] fruits = {"apple", "kiwi", "pear"};', "f"], ["String last = fruits[fruits.length];", "b1"], ["System.out.println(last);", "out"]],
    js: [['const fruits = ["apple", "kiwi", "pear"];', "f"], ["const last = fruits[fruits.length];", "b1"], ["console.log(last);", "out"]]
  },
  fixes: { b1: [
    ok("last = fruits[len(fruits) - 1]", "String last = fruits[fruits.length - 1];", "const last = fruits[fruits.length - 1];"),
    no("last = fruits[3]", "String last = fruits[3];", "const last = fruits[3];", "The same mistake, just typed out: positions are 0, 1, 2. There is no 3.", "Der gleiche Fehler, nur ausgeschrieben: Die Positionen sind 0, 1, 2. Eine 3 gibt es nicht."),
    no("last = fruits[1]", "String last = fruits[1];", "const last = fruits[1];", "Position 1 is the middle fruit: kiwi.", "Position 1 ist die mittlere Frucht: Kiwi.")
  ] },
  sim(F, lang) {
    const s = [P("f", { fruits: arr(['"apple"', '"kiwi"', '"pear"'], lang) })];
    if (F.has("b1")) { s.push(P("b1", { last: q("pear") }, "3 - 1 = 2"), O("out", "pear")); return s; }
    if (lang === "js") { s.push(P("b1", { last: "undefined" }, "fruits[3]"), O("out", "undefined")); return s; }
    s.push(P("b1", null, "fruits[3]"), crash("b1", "index", lang));
    return s;
  } },

{ id: "m10", final: true,
  title: tx("The Copycat Garden", "Der Kopierkatzen-Garten"),
  who: tx("Greta, gardener", "Greta, Gärtnerin"),
  quote: tx("My flower bed is 4 by 3 metres. The planner says 16 square metres and 16 metres of fence. Both wrong! And there are cat paw prints all over my keyboard.", "Mein Blumenbeet ist 4 mal 3 Meter. Der Planer sagt 16 Quadratmeter und 16 Meter Zaun. Beides falsch! Und auf meiner Tastatur sind überall Katzenpfoten."),
  culprit: tx("The Copycat", "Die Kopierkatze"),
  lesson: tx("Copy-paste is fast, but every pasted line needs checking. Here width was pasted where height belonged, twice.", "Kopieren und Einfügen geht schnell, aber jede eingefügte Zeile muss geprüft werden. Hier stand zweimal width, wo height hingehörte."),
  hints: [tx("Two bugs. Which variable is never used at all?", "Zwei Bugs. Welche Variable wird nie benutzt?"),
          tx("Area is width × height, the fence goes around: 2 × (width + height).", "Fläche ist Breite × Höhe, der Zaun geht rundherum: 2 × (Breite + Höhe).")],
  want: ["12", "14"], bugs: ["b1", "b2"],
  code: {
    py: [["width = 4", "w"], ["height = 3", "h"], ["area = width * width", "b1"], ["fence = 2 * (width + width)", "b2"], ["print(area)", "oa"], ["print(fence)", "of"]],
    java: [["int width = 4;", "w"], ["int height = 3;", "h"], ["int area = width * width;", "b1"], ["int fence = 2 * (width + width);", "b2"], ["System.out.println(area);", "oa"], ["System.out.println(fence);", "of"]],
    js: [["const width = 4;", "w"], ["const height = 3;", "h"], ["const area = width * width;", "b1"], ["const fence = 2 * (width + width);", "b2"], ["console.log(area);", "oa"], ["console.log(fence);", "of"]]
  },
  fixes: {
    b1: [
      ok("area = width * height", "int area = width * height;", "const area = width * height;"),
      no("area = width + height", "int area = width + height;", "const area = width + height;", "That adds the sides: 7. Area means multiplying.", "Das addiert die Seiten: 7. Fläche heißt multiplizieren."),
      no("area = height * height", "int area = height * height;", "const area = height * height;", "Copied again, just the other way round: 9.", "Wieder kopiert, nur andersrum: 9.")
    ],
    b2: [
      ok("fence = 2 * (width + height)", "int fence = 2 * (width + height);", "const fence = 2 * (width + height);"),
      no("fence = width + height", "int fence = width + height;", "const fence = width + height;", "That is only half the way around: 7.", "Das ist nur der halbe Weg rundherum: 7."),
      no("fence = 2 * width * height", "int fence = 2 * width * height;", "const fence = 2 * width * height;", "That is twice the area, not the fence: 24.", "Das ist die doppelte Fläche, nicht der Zaun: 24.")
    ]
  },
  sim(F) {
    const a = F.has("b1") ? 12 : 16, f = F.has("b2") ? 14 : 16;
    return [P("w", { width: "4" }), P("h", { height: "3" }), P("b1", { area: String(a) }, F.has("b1") ? "4 * 3" : "4 * 4"),
      P("b2", { fence: String(f) }, F.has("b2") ? "2 * (4 + 3)" : "2 * (4 + 4)"), O("oa", a), O("of", f)];
  } }
]});
