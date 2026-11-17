/* ---------- level 1: beginner ---------- */
LEVELS.push({ id: "beginner", name: tx("Beginner", "Beginner"), color: "#21b36b", base: 10, time: null, hints: 2, hide: false,
 villain: { name: tx("The Careless Peel", "Die Schussel-Schale"), svg: "peel",
   end: tx("The Careless Peel is behind bars. Most bugs are tiny slips: a quote too many, a sign the wrong way round, a + instead of a *. Reading twice beats typing fast.",
           "Die Schussel-Schale sitzt hinter Gittern. Die meisten Bugs sind kleine Ausrutscher: ein Anführungszeichen zu viel, ein Zeichen falsch herum, ein + statt einem *. Zweimal lesen schlägt schnell tippen.") },
 cases: [
{ id: "b1",
  title: tx("The Missing Donation", "Die verschwundene Spende"),
  who: tx("Brenda, baker", "Brenda, Bäckerin"),
  quote: tx("We collected 5, 10, 20 and 15 euros for a new oven. The program says 35! Who took my 15?", "Wir haben 5, 10, 20 und 15 Euro für einen neuen Ofen gesammelt. Das Programm sagt 35! Wer hat meine 15 geklaut?"),
  culprit: tx("Off-by-One Otto", "Eins-daneben-Otto"),
  lesson: tx("Off-by-one error: a loop runs one round too few or too many. Always check the first and the last round.", "Eins-daneben-Fehler: Eine Schleife läuft eine Runde zu wenig oder zu viel. Prüf immer die erste und die letzte Runde."),
  card: tx("Oops…", "Hoppla …"),
  hints: [tx("Count the rounds: 4 donations, but how many times does the loop run in the reconstruction?", "Zähl die Runden: 4 Spenden, aber wie oft läuft die Schleife beim Nachstellen?"),
          tx("Look at where the loop stops. That “- 1” looks suspicious…", "Schau, wo die Schleife aufhört. Dieses „- 1“ sieht verdächtig aus …")],
  want: ["50"], bugs: ["b1"],
  code: {
    py: [["donations = [5, 10, 20, 15]", "d"], ["total = 0", "t"], ["for i in range(len(donations) - 1):", "b1"], ["    total += donations[i]", "add"], ["print(total)", "out"]],
    java: [["int[] donations = {5, 10, 20, 15};", "d"], ["int total = 0;", "t"], ["for (int i = 0; i < donations.length - 1; i++) {", "b1"], ["    total += donations[i];", "add"], "}", ["System.out.println(total);", "out"]],
    js: [["const donations = [5, 10, 20, 15];", "d"], ["let total = 0;", "t"], ["for (let i = 0; i < donations.length - 1; i++) {", "b1"], ["  total += donations[i];", "add"], "}", ["console.log(total);", "out"]]
  },
  fixes: { b1: [
    ok("for i in range(len(donations)):", "for (int i = 0; i < donations.length; i++) {", "for (let i = 0; i < donations.length; i++) {"),
    no("for i in range(1, len(donations)):", "for (int i = 1; i < donations.length; i++) {", "for (let i = 1; i < donations.length; i++) {",
      "Now the loop starts at the second donation. The 5 euros would vanish instead.", "Jetzt beginnt die Schleife bei der zweiten Spende. Dann verschwinden eben die 5 Euro."),
    no("for i in range(len(donations) + 1):", "for (int i = 0; i <= donations.length; i++) {", "for (let i = 0; i <= donations.length; i++) {",
      "One round too far: the loop asks for a 5th donation that does not exist. The program crashes (JavaScript would print NaN).", "Eine Runde zu weit: Die Schleife fragt nach einer 5. Spende, die es nicht gibt. Das Programm stürzt ab (JavaScript würde NaN ausgeben).")
  ] },
  sim(F, lang) {
    const d = [5, 10, 20, 15], n = F.has("b1") ? 4 : 3, s = [P("d", { donations: arr(d, lang) }), P("t", { total: "0" })]; let total = 0;
    for (let i = 0; i < n; i++) {
      s.push(P("b1", { i: String(i) }, `${L(W.round)} ${i + 1}`));
      const old = total; total += d[i];
      s.push(P("add", { total: String(total) }, `${old} + ${d[i]} = ${total}`));
    }
    s.push(P("b1", null, `${L(W.ends)}: ${n} ${L(W.rounds)}`), O("out", total));
    return s;
  } },

{ id: "b2",
  title: tx("The Rejected Birthday", "Der abgewiesene Geburtstag"),
  who: tx("Gustav, museum guard", "Gustav, Museumswächter"),
  quote: tx("Lena turned 18 today and finally wanted an adult ticket. The machine printed a child ticket! She is furious.", "Lena ist heute 18 geworden und wollte endlich ein Erwachsenen-Ticket. Der Automat hat ein Kinderticket gedruckt! Sie ist stinksauer."),
  culprit: tx("Border Bertha", "Grenz-Gerda"),
  lesson: tx("Boundary bug: > and >= only differ at the border value. Always test the border itself (here: 18).", "Grenzfehler: > und >= unterscheiden sich nur genau am Grenzwert. Teste immer die Grenze selbst (hier: 18)."),
  card: tx("Whoops!", "Huch!"),
  hints: [tx("The rule: from 18 on, you are an adult. Does the code count 18 itself?", "Die Regel: Ab 18 ist man erwachsen. Zählt der Code die 18 selbst dazu?"),
          tx("Look at the comparison in the if line. > means “strictly greater than”.", "Schau dir den Vergleich in der if-Zeile an. > heißt „echt größer als“.")],
  want: ["adult"], bugs: ["b1"],
  code: {
    py: [["age = 18", "age"], ["if age > 18:", "b1"], ['    ticket = "adult"', "ad"], "else:", ['    ticket = "child"', "ch"], ["print(ticket)", "out"]],
    java: [["int age = 18;", "age"], "String ticket;", ["if (age > 18) {", "b1"], ['    ticket = "adult";', "ad"], "} else {", ['    ticket = "child";', "ch"], "}", ["System.out.println(ticket);", "out"]],
    js: [["const age = 18;", "age"], "let ticket;", ["if (age > 18) {", "b1"], ['  ticket = "adult";', "ad"], "} else {", ['  ticket = "child";', "ch"], "}", ["console.log(ticket);", "out"]]
  },
  fixes: { b1: [
    ok("if age >= 18:", "if (age >= 18) {", "if (age >= 18) {"),
    no("if age < 18:", "if (age < 18) {", "if (age < 18) {", "This turns the rule upside down: children would get adult tickets and adults child tickets.", "Das dreht die Regel um: Kinder bekämen Erwachsenen-Tickets und Erwachsene Kindertickets."),
    no("if age == 18:", "if (age == 18) {", "if (age === 18) {", "Only people who are exactly 18 would count as adults. A 40-year-old would get a child ticket.", "Nur wer genau 18 ist, wäre erwachsen. Eine 40-Jährige bekäme ein Kinderticket.")
  ] },
  sim(F, lang) {
    const k = F.has("b1"), tk = k ? "adult" : "child";
    return [P("age", { age: "18" }), P("b1", null, `18 ${k ? ">=" : ">"} 18 → ${bool(k, lang)}`), P(k ? "ad" : "ch", { ticket: q(tk) }), O("out", tk)];
  } },

{ id: "b3",
  title: tx("The Shrinking Bill", "Die schrumpfende Rechnung"),
  who: tx("Sami, shopkeeper", "Sami, Ladenbesitzer"),
  quote: tx("A customer bought a book for 10, a cap for 20 and a game for 30. The checkout only charged 30. I am going broke!", "Ein Kunde hat ein Buch für 10, eine Kappe für 20 und ein Spiel für 30 gekauft. Die Kasse wollte nur 30. Ich gehe pleite!"),
  culprit: tx("Reset Rita", "Reset-Rita"),
  lesson: tx("Reset inside a loop: a variable that should collect values is set back to 0 every round. Start collectors once, before the loop.", "Zurücksetzen in der Schleife: Eine Variable, die sammeln soll, wird jede Runde auf 0 gesetzt. Sammel-Variablen nur einmal vor der Schleife starten."),
  card: tx("Hurry up, detective.", "Beeil dich, Spürnase."),
  hints: [tx("Watch the “total” sticky note. Does it ever grow beyond a single price?", "Beobachte den Notizzettel „total“. Wird er je größer als ein einzelner Preis?"),
          tx("Something wipes the total at the start of every round.", "Irgendetwas löscht die Summe am Anfang jeder Runde.")],
  want: ["60"], bugs: ["b1"],
  code: {
    py: [["prices = [10, 20, 30]", "pr"], ["total = 0", "t"], ["for p in prices:", "lp"], ["    total = 0", "b1"], ["    total += p", "add"], ["print(total)", "out"]],
    java: [["int[] prices = {10, 20, 30};", "pr"], ["int total = 0;", "t"], ["for (int p : prices) {", "lp"], ["    total = 0;", "b1"], ["    total += p;", "add"], "}", ["System.out.println(total);", "out"]],
    js: [["const prices = [10, 20, 30];", "pr"], ["let total = 0;", "t"], ["for (const p of prices) {", "lp"], ["  total = 0;", "b1"], ["  total += p;", "add"], "}", ["console.log(total);", "out"]]
  },
  fixes: { b1: [
    del(),
    no("total = p", "total = p;", "total = p;", "Same problem: every round overwrites the total with just the current price. Still 30.", "Gleiches Problem: Jede Runde überschreibt die Summe mit dem aktuellen Preis. Immer noch 30."),
    no("total = 1", "total = 1;", "total = 1;", "It still resets every round, now to 1. Result: 31.", "Es wird immer noch jede Runde zurückgesetzt, jetzt auf 1. Ergebnis: 31.")
  ] },
  sim(F, lang) {
    const p = [10, 20, 30], s = [P("pr", { prices: arr(p, lang) }), P("t", { total: "0" })]; let total = 0;
    for (const x of p) {
      s.push(P("lp", { p: String(x) }));
      if (!F.has("b1")) { total = 0; s.push(P("b1", { total: "0" })); }
      const old = total; total += x;
      s.push(P("add", { total: String(total) }, `${old} + ${x} = ${total}`));
    }
    s.push(O("out", total));
    return s;
  } },

{ id: "b4",
  title: tx("The Stolen High Score", "Der geklaute Highscore"),
  who: tx("Ari, arcade owner", "Ari, betreibt die Spielhalle"),
  quote: tx("Mia smashed the record with 97 points. But the leaderboard crowned the 12-point game! Mia wants justice.", "Mia hat mit 97 Punkten den Rekord geknackt. Aber die Bestenliste hat das 12-Punkte-Spiel gekrönt! Mia will Gerechtigkeit."),
  culprit: tx("Flip-Flop Fred", "Verdreht-Vroni"),
  lesson: tx("Flipped comparison: < instead of > turns “find the biggest” into “find the smallest”. Read comparisons out loud: “if s is smaller than best…”.", "Verdrehter Vergleich: < statt > macht aus „finde das Größte“ ein „finde das Kleinste“. Lies Vergleiche laut vor: „wenn s kleiner als best ist …“."),
  card: tx("I slip into every program.", "Ich rutsche in jedes Programm."),
  hints: [tx("The code keeps a score whenever the comparison says yes. Does it keep the higher one or the lower one?", "Der Code behält einen Wert, wenn der Vergleich Ja sagt. Behält er den höheren oder den niedrigeren?"),
          tx("Look at the comparison sign in the if line. Which way does it point?", "Schau dir das Vergleichszeichen in der if-Zeile an. In welche Richtung zeigt es?")],
  want: ["97"], bugs: ["b1"],
  code: {
    py: [["scores = [45, 97, 12, 60]", "sc"], ["best = scores[0]", "bs"], ["for s in scores:", "lp"], ["    if s < best:", "b1"], ["        best = s", "set"], ["print(best)", "out"]],
    java: [["int[] scores = {45, 97, 12, 60};", "sc"], ["int best = scores[0];", "bs"], ["for (int s : scores) {", "lp"], ["    if (s < best) {", "b1"], ["        best = s;", "set"], "    }", "}", ["System.out.println(best);", "out"]],
    js: [["const scores = [45, 97, 12, 60];", "sc"], ["let best = scores[0];", "bs"], ["for (const s of scores) {", "lp"], ["  if (s < best) {", "b1"], ["    best = s;", "set"], "  }", "}", ["console.log(best);", "out"]]
  },
  fixes: { b1: [
    ok("if s > best:", "if (s > best) {", "if (s > best) {"),
    no("if s == best:", "if (s == best) {", "if (s === best) {", "Only an equal score would replace the best one. Nothing changes and 45 stays on top.", "Nur ein gleich hoher Wert würde den besten ersetzen. Nichts ändert sich, 45 bleibt oben."),
    no("if s != best:", "if (s != best) {", "if (s !== best) {", "Every different score replaces the best one. In the end the last score (60) wins, not the highest.", "Jeder andere Wert ersetzt den besten. Am Ende gewinnt der letzte Wert (60), nicht der höchste.")
  ] },
  sim(F, lang) {
    const sc = [45, 97, 12, 60], op = F.has("b1") ? ">" : "<"; let best = 45;
    const s = [P("sc", { scores: arr(sc, lang) }), P("bs", { best: "45" })];
    for (const x of sc) {
      s.push(P("lp", { s: String(x) }));
      const r = op === ">" ? x > best : x < best;
      s.push(P("b1", null, `${x} ${op} ${best} → ${bool(r, lang)}`));
      if (r) { best = x; s.push(P("set", { best: String(best) })); }
    }
    s.push(O("out", best));
    return s;
  } },

{ id: "b5",
  title: tx("The Endless Countdown", "Der endlose Countdown"),
  who: tx("Marta, mission control", "Marta, Bodenkontrolle"),
  quote: tx("Countdown started: 3… 4… 5… It has been counting for an hour. The astronauts are getting hungry.", "Countdown gestartet: 3 … 4 … 5 … Er zählt seit einer Stunde. Die Crew bekommt langsam Hunger."),
  culprit: tx("Forever Fritz", "Endlos-Egon"),
  lesson: tx("Infinite loop: the condition never becomes false because the variable moves the wrong way. Every while loop needs a step towards its end.", "Endlosschleife: Die Bedingung wird nie falsch, weil sich die Variable in die falsche Richtung bewegt. Jede while-Schleife braucht einen Schritt Richtung Ende."),
  card: tx("You will never catch me.", "Mich fängst du nie."),
  hints: [tx("A countdown must get smaller every round. Watch n on the sticky note.", "Ein Countdown muss jede Runde kleiner werden. Beobachte n auf dem Notizzettel."),
          tx("Find the line that changes n. Does n go up or down?", "Finde die Zeile, die n verändert. Geht n rauf oder runter?")],
  want: ["3", "2", "1", "Liftoff!"], bugs: ["b1"],
  code: {
    py: [["n = 3", "n"], ["while n > 0:", "wh"], ["    print(n)", "pr"], ["    n += 1", "b1"], ['print("Liftoff!")', "out"]],
    java: [["int n = 3;", "n"], ["while (n > 0) {", "wh"], ["    System.out.println(n);", "pr"], ["    n++;", "b1"], "}", ['System.out.println("Liftoff!");', "out"]],
    js: [["let n = 3;", "n"], ["while (n > 0) {", "wh"], ["  console.log(n);", "pr"], ["  n++;", "b1"], "}", ['console.log("Liftoff!");', "out"]]
  },
  fixes: { b1: [
    ok("n -= 1", "n--;", "n--;"),
    no("n = 0", "n = 0;", "n = 0;", "The loop ends after the first round. The rocket launches right after “3” and skips 2 and 1.", "Die Schleife endet nach der ersten Runde. Die Rakete startet gleich nach „3“ und überspringt 2 und 1."),
    no("n *= 2", "n *= 2;", "n *= 2;", "n grows even faster: 3, 6, 12, 24… The countdown still never ends.", "n wächst noch schneller: 3, 6, 12, 24 … Der Countdown endet trotzdem nie.")
  ] },
  sim(F, lang) {
    const k = F.has("b1"), s = [P("n", { n: "3" })]; let n = 3, rounds = 0;
    for (;;) {
      const c = n > 0;
      s.push(P("wh", null, `${n} > 0 → ${bool(c, lang)}`));
      if (!c) break;
      s.push(O("pr", n));
      n = k ? n - 1 : n + 1;
      s.push(P("b1", { n: String(n) }));
      if (!k && ++rounds >= 6) { s.push(LOOP("wh", `${n} > 0 → ${bool(true, lang)} …`)); return s; }
    }
    s.push(O("out", "Liftoff!"));
    return s;
  } },

{ id: "b6",
  title: tx("The 53 Mystery", "Das 53-Rätsel"),
  who: tx("Kim, inventor", "Kim, erfindet Dinge"),
  quote: tx("My brand-new calculator! I typed 5 and 3. It proudly answered 53. My investors left the room.", "Mein brandneuer Taschenrechner! Ich tippe 5 und 3 ein. Er antwortet stolz: 53. Meine Geldgeber sind gegangen."),
  culprit: tx("Glue Gus", "Kleister-Kurt"),
  lesson: tx("Text is not a number: input always arrives as text. \"5\" + \"3\" glues to \"53\". Convert input to numbers before you calculate.", "Text ist keine Zahl: Eingaben kommen immer als Text an. \"5\" + \"3\" wird zu \"53\" verklebt. Wandle Eingaben in Zahlen um, bevor du rechnest."),
  card: tx("Look down!", "Schau nach unten!"),
  hints: [tx("Look at the sticky notes: are a and b numbers or text? Text has quotes around it.", "Schau auf die Notizzettel: Sind a und b Zahlen oder Text? Text steht in Anführungszeichen."),
          tx("+ glues two texts together. The values have to become numbers first.", "+ klebt zwei Texte zusammen. Die Werte müssen erst zu Zahlen werden.")],
  want: ["8"], bugs: ["b1"],
  code: {
    py: [["a = input()", "a"], ["b = input()", "b"], ["total = a + b", "b1"], ["print(total)", "out"]],
    java: [["Scanner in = new Scanner(System.in);", "sc"], ["String a = in.nextLine();", "a"], ["String b = in.nextLine();", "b"], ["String total = a + b;", "b1"], ["System.out.println(total);", "out"]],
    js: [['const a = prompt("First number");', "a"], ['const b = prompt("Second number");', "b"], ["const total = a + b;", "b1"], ["console.log(total);", "out"]]
  },
  fixes: { b1: [
    ok("total = int(a) + int(b)", "int total = Integer.parseInt(a) + Integer.parseInt(b);", "const total = Number(a) + Number(b);"),
    no("total = int(a + b)", "int total = Integer.parseInt(a + b);", "const total = Number(a + b);", "First the two texts get glued into \"53\", then turned into a number. Still 53.", "Erst werden die Texte zu \"53\" verklebt, dann zur Zahl gemacht. Immer noch 53."),
    no("total = str(a) + str(b)", "String total = String.valueOf(a) + String.valueOf(b);", "const total = String(a) + String(b);", "They are already text. Turning text into text changes nothing: still \"53\".", "Das ist schon Text. Text in Text umwandeln ändert nichts: immer noch \"53\".")
  ] },
  sim(F, lang) {
    const s = []; if (lang === "java") s.push(P("sc"));
    s.push(P("a", { a: '"5"' }, `${L(W.types)} 5`), P("b", { b: '"3"' }, `${L(W.types)} 3`));
    if (F.has("b1")) s.push(P("b1", { total: "8" }, "5 + 3 = 8")); else s.push(P("b1", { total: '"53"' }, '"5" + "3" = "53"'));
    s.push(O("out", F.has("b1") ? "8" : "53"));
    return s;
  } },

{ id: "b7",
  title: tx("The Nameless Welcome", "Die namenlose Begrüßung"),
  who: tx("Leo, hotel reception", "Leo, Hotelrezeption"),
  quote: tx("Our new robot greets every guest with “Hello, name”. Mia asked if we forgot who she is.", "Unser neuer Roboter begrüßt jeden Gast mit „Hello, name“. Mia hat gefragt, ob wir vergessen haben, wer sie ist."),
  culprit: tx("Quote Quentin", "Gänsefüßchen-Gerd"),
  lesson: tx("Quotes turn a word into fixed text. name is the variable, \"name\" is just the word name.", "Anführungszeichen machen aus einem Wort festen Text. name ist die Variable, \"name\" nur das Wort name."),
  card: tx("The ink is still wet…", "Die Tinte ist noch feucht …"),
  hints: [tx("Look at the sticky note for greeting. Where does the word “name” come from?", "Schau auf den Notizzettel greeting. Woher kommt das Wort „name“?"),
          tx("Is name used as a variable or as text in the greeting line?", "Wird name in der greeting-Zeile als Variable oder als Text benutzt?")],
  want: ["Hello, Mia"], bugs: ["b1"],
  code: {
    py: [['name = "Mia"', "n"], ['greeting = "Hello, " + "name"', "b1"], ["print(greeting)", "out"]],
    java: [['String name = "Mia";', "n"], ['String greeting = "Hello, " + "name";', "b1"], ["System.out.println(greeting);", "out"]],
    js: [['const name = "Mia";', "n"], ['const greeting = "Hello, " + "name";', "b1"], ["console.log(greeting);", "out"]]
  },
  fixes: { b1: [
    ok('greeting = "Hello, " + name', 'String greeting = "Hello, " + name;', 'const greeting = "Hello, " + name;'),
    no('greeting = "Hello, " + "Mia"', 'String greeting = "Hello, " + "Mia";', 'const greeting = "Hello, " + "Mia";', "Works for Mia today. Tomorrow Leo checks in and still gets “Hello, Mia”. Use the variable.", "Klappt heute für Mia. Morgen checkt Leo ein und bekommt trotzdem „Hello, Mia“. Nimm die Variable."),
    no('greeting = "Hello, name"', 'String greeting = "Hello, name";', 'const greeting = "Hello, name";', "Still the word “name”, now inside one text. Only without quotes does it become the variable.", "Immer noch das Wort „name“, jetzt in einem einzigen Text. Erst ohne Anführungszeichen wird es zur Variable.")
  ] },
  sim(F, lang) {
    const k = F.has("b1"), g = k ? "Hello, Mia" : "Hello, name";
    return [P("n", { name: q("Mia") }), P("b1", { greeting: q(g) }, k ? '"Hello, " + name' : '"Hello, " + "name"'), O("out", g)];
  } },

{ id: "b8",
  title: tx("The Odd Census", "Die ungerade Volkszählung"),
  who: tx("Pia, zookeeper", "Pia, Tierpflegerin"),
  quote: tx("The penguins wear the numbers 2, 5, 8, 11 and 14. Even numbers sleep in the north igloo. The program says 2 penguins, but 3 are snoring there!", "Die Pinguine tragen die Nummern 2, 5, 8, 11 und 14. Gerade Nummern schlafen im Nord-Iglu. Das Programm sagt 2 Pinguine, aber dort schnarchen 3!"),
  culprit: tx("Remainder Ronny", "Rest-Rudi"),
  lesson: tx("n % 2 is the remainder after dividing by 2. Even numbers leave 0, odd numbers leave 1.", "n % 2 ist der Rest beim Teilen durch 2. Gerade Zahlen lassen 0 übrig, ungerade 1."),
  card: tx("Getting warmer?", "Wird dir schon warm?"),
  hints: [tx("Which penguins does the program count? Watch the bubble next to the if line.", "Welche Pinguine zählt das Programm? Achte auf die Sprechblase neben der if-Zeile."),
          tx("Even numbers leave a remainder of 0, not 1.", "Gerade Zahlen lassen den Rest 0, nicht 1.")],
  want: ["3"], bugs: ["b1"],
  code: {
    py: [["numbers = [2, 5, 8, 11, 14]", "nu"], ["evens = 0", "e"], ["for n in numbers:", "lp"], ["    if n % 2 == 1:", "b1"], ["        evens += 1", "inc"], ["print(evens)", "out"]],
    java: [["int[] numbers = {2, 5, 8, 11, 14};", "nu"], ["int evens = 0;", "e"], ["for (int n : numbers) {", "lp"], ["    if (n % 2 == 1) {", "b1"], ["        evens++;", "inc"], "    }", "}", ["System.out.println(evens);", "out"]],
    js: [["const numbers = [2, 5, 8, 11, 14];", "nu"], ["let evens = 0;", "e"], ["for (const n of numbers) {", "lp"], ["  if (n % 2 === 1) {", "b1"], ["    evens++;", "inc"], "  }", "}", ["console.log(evens);", "out"]]
  },
  fixes: { b1: [
    ok("if n % 2 == 0:", "if (n % 2 == 0) {", "if (n % 2 === 0) {"),
    no("if n % 2 == 2:", "if (n % 2 == 2) {", "if (n % 2 === 2) {", "A remainder after dividing by 2 is only ever 0 or 1, never 2. Nothing would get counted.", "Der Rest beim Teilen durch 2 ist immer 0 oder 1, nie 2. Dann wird gar nichts gezählt."),
    no("if n / 2 == 1:", "if (n / 2 == 1) {", "if (n / 2 === 1) {", "That asks “is n twice 1?”, which is only true for 2. / divides, % gives the remainder.", "Das fragt „ist n doppelt so groß wie 1?“ – stimmt nur bei 2. / teilt, % liefert den Rest.")
  ] },
  sim(F, lang) {
    const nums = [2, 5, 8, 11, 14], want = F.has("b1") ? 0 : 1, s = [P("nu", { numbers: arr(nums, lang) }), P("e", { evens: "0" })]; let e = 0;
    for (const n of nums) {
      s.push(P("lp", { n: String(n) }));
      const r = n % 2, hit = r === want;
      s.push(P("b1", null, `${n} % 2 = ${r} → ${bool(hit, lang)}`));
      if (hit) { e++; s.push(P("inc", { evens: String(e) })); }
    }
    s.push(O("out", e));
    return s;
  } },

{ id: "b9",
  title: tx("The Negative Change", "Das negative Wechselgeld"),
  who: tx("Omar, kiosk owner", "Omar, Kioskbesitzer"),
  quote: tx("A boy paid 50 for a skateboard that costs 35. The register says his change is minus 15. Now he thinks he owes me money!", "Ein Junge hat 50 für ein Skateboard um 35 gezahlt. Die Kasse sagt, sein Wechselgeld ist minus 15. Jetzt glaubt er, er schuldet mir Geld!"),
  culprit: tx("Backwards Bob", "Verkehrt-Vera"),
  lesson: tx("Order matters in subtraction: paid − price is not price − paid. Say it in words first: “what he gave minus what it costs”.", "Bei Minus zählt die Reihenfolge: bezahlt − Preis ist nicht Preis − bezahlt. Sag es erst in Worten: „was er gegeben hat minus was es kostet“."),
  card: tx("Almost there…", "Fast geschafft …"),
  hints: [tx("Change is what goes back to the customer. Should it ever be negative?", "Wechselgeld bekommt die Kundschaft zurück. Kann das negativ sein?"),
          tx("Swap the order: what was paid minus what it costs.", "Dreh die Reihenfolge um: was bezahlt wurde minus was es kostet.")],
  want: ["15"], bugs: ["b1"],
  code: {
    py: [["price = 35", "p"], ["paid = 50", "pd"], ["change = price - paid", "b1"], ["print(change)", "out"]],
    java: [["int price = 35;", "p"], ["int paid = 50;", "pd"], ["int change = price - paid;", "b1"], ["System.out.println(change);", "out"]],
    js: [["const price = 35;", "p"], ["const paid = 50;", "pd"], ["const change = price - paid;", "b1"], ["console.log(change);", "out"]]
  },
  fixes: { b1: [
    ok("change = paid - price", "int change = paid - price;", "const change = paid - price;"),
    no("change = price + paid", "int change = price + paid;", "const change = price + paid;", "That adds up to 85. The kiosk would pay out more than it ever got.", "Das ergibt 85. Der Kiosk würde mehr auszahlen, als er bekommen hat."),
    no("change = price - paid + 1", "int change = price - paid + 1;", "const change = price - paid + 1;", "Still negative, just a little less: −14.", "Immer noch negativ, nur etwas weniger: −14.")
  ] },
  sim(F) {
    const k = F.has("b1"), c = k ? 15 : -15;
    return [P("p", { price: "35" }), P("pd", { paid: "50" }), P("b1", { change: String(c) }, k ? "50 - 35 = 15" : "35 - 50 = -15"), O("out", c)];
  } },

{ id: "b10", final: true,
  title: tx("The Birthday Cake Caper", "Der Geburtstagstorten-Coup"),
  who: tx("Nina, party planner", "Nina, plant Partys"),
  quote: tx("Six guests, two slices each. The cake printer just printed the word “slices”. And next to the cake: a banana peel.", "Sechs Gäste, je zwei Stück. Der Tortendrucker hat nur das Wort „slices“ gedruckt. Und neben der Torte: eine Bananenschale."),
  culprit: tx("The Careless Peel", "Die Schussel-Schale"),
  lesson: tx("Hurrying causes the smallest bugs: a + instead of a *, quotes where none belong. Read every line once more before you run it.", "Eile macht die kleinsten Bugs: ein + statt einem *, Anführungszeichen, wo keine hingehören. Lies jede Zeile noch einmal, bevor du startest."),
  hints: [tx("Two bugs this time. First: how many slices are 6 guests × 2?", "Diesmal zwei Bugs. Erstens: Wie viele Stück sind 6 Gäste × 2?"),
          tx("Second: does the last line print the variable or a word?", "Zweitens: Gibt die letzte Zeile die Variable aus oder ein Wort?")],
  want: ["12"], bugs: ["b1", "b2"],
  code: {
    py: [["guests = 6", "g"], ["slices = guests + 2", "b1"], ['print("slices")', "b2"]],
    java: [["int guests = 6;", "g"], ["int slices = guests + 2;", "b1"], ['System.out.println("slices");', "b2"]],
    js: [["const guests = 6;", "g"], ["const slices = guests + 2;", "b1"], ['console.log("slices");', "b2"]]
  },
  fixes: {
    b1: [
      ok("slices = guests * 2", "int slices = guests * 2;", "const slices = guests * 2;"),
      no("slices = guests + guests + 2", "int slices = guests + guests + 2;", "const slices = guests + guests + 2;", "That makes 14: two slices each plus two extra. The cake only has 12.", "Das ergibt 14: zwei Stück pro Gast plus zwei extra. Die Torte hat nur 12."),
      no("slices = 2", "int slices = 2;", "const slices = 2;", "Two slices for the whole party? That ignores the guests completely.", "Zwei Stück für die ganze Party? Das ignoriert die Gäste völlig.")
    ],
    b2: [
      ok("print(slices)", "System.out.println(slices);", "console.log(slices);"),
      no('print("12")', 'System.out.println("12");', 'console.log("12");', "Prints the right number today, but it is fixed text. With 8 guests it would still say 12.", "Gibt heute die richtige Zahl aus, ist aber fester Text. Bei 8 Gästen stünde immer noch 12 da."),
      no("print(guests)", "System.out.println(guests);", "console.log(guests);", "That prints the number of guests, not the slices.", "Das gibt die Zahl der Gäste aus, nicht die Stücke.")
    ]
  },
  sim(F) {
    const sl = F.has("b1") ? 12 : 8;
    return [P("g", { guests: "6" }), P("b1", { slices: String(sl) }, F.has("b1") ? "6 * 2 = 12" : "6 + 2 = 8"), O("b2", F.has("b2") ? sl : "slices")];
  } }
]});
