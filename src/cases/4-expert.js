/* ---------- level 4: expert ---------- */
LEVELS.push({ id: "expert", name: tx("Expert", "Expert"), color: "#9b6bff", base: 50, time: 180, hints: 1, hide: false,
 villain: { name: tx("The Legacy", "Das Erbstück"), svg: "robot",
   end: tx("The Legacy has been switched off. Old code is full of bugs that hide in pairs. You found them one by one, without ever being scared to touch it.",
           "Das Erbstück ist abgeschaltet. Alter Code steckt voller Bugs, die sich paarweise verstecken. Du hast sie einzeln gefunden, ohne Angst, ihn anzufassen.") },
 cases: [
{ id: "e1",
  title: tx("The Report Card Robbery", "Der Zeugnis-Raub"),
  who: tx("Tara, teacher", "Tara, Lehrerin"),
  quote: tx("Four quizzes: 4, 3, 3 and 4 points. That is an average of 3.5. The report card says 2! The grading program is older than me.", "Vier Tests: 4, 3, 3 und 4 Punkte. Das ist ein Schnitt von 3,5. Im Zeugnis steht 2! Das Notenprogramm ist älter als ich."),
  culprit: tx("Twin Trouble", "Doppel-Ärger"),
  lesson: tx("Two classics at once: a loop that starts at 1 instead of 0, and a division that throws away the decimals. Real bugs often come in pairs.", "Zwei Klassiker auf einmal: eine Schleife, die bei 1 statt 0 beginnt, und eine Division, die die Nachkommastellen wegwirft. Echte Bugs kommen oft zu zweit."),
  card: tx("Beep. Boop. Bug.", "Piep. Bup. Bug."),
  hints: [tx("Two bugs. How many quizzes really go into the total? And look at the division: //, int / int and Math.floor all throw away decimals.", "Zwei Bugs. Wie viele Tests landen wirklich in der Summe? Und schau dir die Division an: //, int / int und Math.floor werfen Nachkommastellen weg.")],
  want: ["3.5"], bugs: ["b1", "b2"],
  code: {
    py: [["grades = [4, 3, 3, 4]", "g"], ["total = 0", "t"], ["for i in range(1, len(grades)):", "b1"], ["    total += grades[i]", "add"], ["average = total // len(grades)", "b2"], ["print(average)", "out"]],
    java: [["int[] grades = {4, 3, 3, 4};", "g"], ["int total = 0;", "t"], ["for (int i = 1; i < grades.length; i++) {", "b1"], ["    total += grades[i];", "add"], "}", ["double average = total / grades.length;", "b2"], ["System.out.println(average);", "out"]],
    js: [["const grades = [4, 3, 3, 4];", "g"], ["let total = 0;", "t"], ["for (let i = 1; i < grades.length; i++) {", "b1"], ["  total += grades[i];", "add"], "}", ["const average = Math.floor(total / grades.length);", "b2"], ["console.log(average);", "out"]]
  },
  fixes: {
    b1: [
      ok("for i in range(len(grades)):", "for (int i = 0; i < grades.length; i++) {", "for (let i = 0; i < grades.length; i++) {"),
      no("for i in range(2, len(grades)):", "for (int i = 2; i < grades.length; i++) {", "for (let i = 2; i < grades.length; i++) {", "That starts even later. Now two quizzes are ignored.", "Das beginnt noch später. Jetzt fehlen zwei Tests."),
      no("for i in range(1, len(grades) + 1):", "for (int i = 1; i <= grades.length; i++) {", "for (let i = 1; i <= grades.length; i++) {", "Still skips the first quiz and then reaches past the last one: crash.", "Überspringt weiter den ersten Test und greift dann über den letzten hinaus: Absturz.")
    ],
    b2: [
      ok("average = total / len(grades)", "double average = (double) total / grades.length;", "const average = total / grades.length;"),
      no("average = round(total / len(grades))", "double average = Math.round((double) total / grades.length);", "const average = Math.round(total / grades.length);", "Rounds the average to a whole number. The report card would still lie.", "Rundet den Schnitt auf eine ganze Zahl. Das Zeugnis würde weiter lügen."),
      no("average = total % len(grades)", "double average = total % grades.length;", "const average = total % grades.length;", "% gives the remainder of a division, not the average.", "% liefert den Rest einer Division, nicht den Durchschnitt.")
    ]
  },
  sim(F, lang) {
    const g = [4, 3, 3, 4], start = F.has("b1") ? 0 : 1; let total = 0;
    const s = [P("g", { grades: arr(g, lang) }), P("t", { total: "0" })];
    for (let i = start; i < 4; i++) {
      s.push(P("b1", { i: String(i) }, `${L(W.round)} ${i - start + 1}`));
      const old = total; total += g[i];
      s.push(P("add", { total: String(total) }, `${old} + ${g[i]} = ${total}`));
    }
    s.push(P("b1", null, `${L(W.ends)}: ${4 - start} ${L(W.rounds)}`));
    let shown, cond;
    if (F.has("b2")) { shown = dbl(total / 4, lang); cond = `${total} / 4 = ${shown}`; }
    else { const a = Math.floor(total / 4); shown = lang === "java" ? a.toFixed(1) : String(a);
      cond = lang === "py" ? `${total} // 4 = ${a}` : lang === "java" ? `${total} / 4 (int) = ${a}` : `floor(${total / 4}) = ${a}`; }
    s.push(P("b2", { average: shown }, cond), O("out", shown));
    return s;
  } },

{ id: "e2",
  title: tx("The Password That Forgot", "Das vergessliche Passwort"),
  who: tx("Nadia, security chief", "Nadia, Sicherheitschefin"),
  quote: tx("“detect1ve” has 9 letters and a digit. Our rules want at least 8 characters and one digit. The old checker says: too weak. Twice wrong!", "„detect1ve“ hat 9 Zeichen und eine Ziffer. Unsere Regel: mindestens 8 Zeichen und eine Ziffer. Der alte Prüfer sagt: zu schwach. Doppelt falsch!"),
  culprit: tx("Goldfish Gary", "Goldfisch-Gitte"),
  lesson: tx("“At least 8” means >= 8. And a flag that should remember “found it once” must never be overwritten by later letters: use or.", "„Mindestens 8“ heißt >= 8. Und ein Merker, der sich „einmal gefunden“ merken soll, darf von späteren Buchstaben nicht überschrieben werden: nimm or."),
  card: tx("Old code never dies.", "Alter Code stirbt nie."),
  hints: [tx("Two bugs. Check the length rule against “at least 8”. Then watch the digit flag after the 1: does it stay true?", "Zwei Bugs. Vergleiche die Längenregel mit „mindestens 8“. Dann beobachte den Ziffern-Merker nach der 1: Bleibt er wahr?")],
  want: lang => [bool(true, lang)], bugs: ["b1", "b2"],
  code: {
    py: [['pw = "detect1ve"', "pw"], ["long_enough = len(pw) > 9", "b1"], ["has_digit = False", "hd"], ["for ch in pw:", "lp"], ["    has_digit = ch.isdigit()", "b2"], ["print(long_enough and has_digit)", "out"]],
    java: [['String pw = "detect1ve";', "pw"], ["boolean longEnough = pw.length() > 9;", "b1"], ["boolean hasDigit = false;", "hd"], ["for (char ch : pw.toCharArray()) {", "lp"], ["    hasDigit = Character.isDigit(ch);", "b2"], "}", ["System.out.println(longEnough && hasDigit);", "out"]],
    js: [['const pw = "detect1ve";', "pw"], ["const longEnough = pw.length > 9;", "b1"], ["let hasDigit = false;", "hd"], ["for (const ch of pw) {", "lp"], ['  hasDigit = "0123456789".includes(ch);', "b2"], "}", ["console.log(longEnough && hasDigit);", "out"]]
  },
  fixes: {
    b1: [
      ok("long_enough = len(pw) >= 8", "boolean longEnough = pw.length() >= 8;", "const longEnough = pw.length >= 8;"),
      no("long_enough = len(pw) < 8", "boolean longEnough = pw.length() < 8;", "const longEnough = pw.length < 8;", "That is the rule for “too short”. Long passwords would fail.", "Das ist die Regel für „zu kurz“. Lange Passwörter fallen durch."),
      no("long_enough = len(pw) == 8", "boolean longEnough = pw.length() == 8;", "const longEnough = pw.length === 8;", "Only exactly 8 characters would pass. “detect1ve” has 9.", "Nur genau 8 Zeichen kämen durch. „detect1ve“ hat 9.")
    ],
    b2: [
      ok("    has_digit = has_digit or ch.isdigit()", "    hasDigit = hasDigit || Character.isDigit(ch);", '  hasDigit = hasDigit || "0123456789".includes(ch);'),
      no("    has_digit = has_digit and ch.isdigit()", "    hasDigit = hasDigit && Character.isDigit(ch);", '  hasDigit = hasDigit && "0123456789".includes(ch);', "and needs it to be true already. It starts false, so it stays false forever.", "and braucht es schon wahr. Es startet falsch, also bleibt es für immer falsch."),
      no('    has_digit = ch == "1"', "    hasDigit = ch == '1';", '  hasDigit = ch === "1";', "Same overwrite problem, and only the digit 1 would count.", "Gleiches Überschreib-Problem, und nur die Ziffer 1 würde zählen.")
    ]
  },
  sim(F, lang) {
    const pw = "detect1ve", le = F.has("b1") ? pw.length >= 8 : pw.length > 9, LE = vn("long_enough", "longEnough", lang), HD = vn("has_digit", "hasDigit", lang);
    const s = [P("pw", { pw: q(pw) }), P("b1", { [LE]: bool(le, lang) }, `${pw.length} ${F.has("b1") ? ">= 8" : "> 9"} → ${bool(le, lang)}`), P("hd", { [HD]: bool(false, lang) })]; let hd = false;
    for (const ch of pw) { s.push(P("lp", { ch: cq(ch, lang) })); const dg = ch >= "0" && ch <= "9"; hd = F.has("b2") ? hd || dg : dg; s.push(P("b2", { [HD]: bool(hd, lang) })); }
    s.push(O("out", bool(le && hd, lang), null, `${bool(le, lang)} ${vn("and", "&&", lang)} ${bool(hd, lang)}`));
    return s;
  } },

{ id: "e3",
  title: tx("The Greedy Vending Machine", "Der gierige Automat"),
  who: tx("Jonas, student", "Jonas, Schüler"),
  quote: tx("The machine owed me 45 cents change. It gave me three coins and kept 10 cents for itself. It has done this for 20 years.", "Der Automat schuldete mir 45 Cent Wechselgeld. Er gab mir drei Münzen und behielt 10 Cent für sich. Das macht er seit 20 Jahren."),
  culprit: tx("Coin Clara", "Münz-Manni"),
  lesson: tx("Greedy change: always try the biggest coin first, and keep using it as long as it fits. That needs a while, not an if.", "Gieriges Wechselgeld: Immer zuerst die größte Münze probieren und sie nehmen, solange sie passt. Dafür braucht man while, nicht if."),
  card: tx("I was written in 1998.", "Ich wurde 1998 geschrieben."),
  hints: [tx("Two bugs. Which coin should the machine try first? And can it use the same coin twice?", "Zwei Bugs. Welche Münze sollte der Automat zuerst probieren? Und kann er dieselbe Münze zweimal nehmen?")],
  want: ["3", "0"], bugs: ["b1", "b2"],
  code: {
    py: [["amount = 45", "a"], ["coins = [5, 10, 20, 50]", "b1"], ["count = 0", "c"], ["for c in coins:", "lp"], ["    if amount >= c:", "b2"], ["        amount -= c", "sub"], ["        count += 1", "inc"], ["print(count)", "o1"], ["print(amount)", "o2"]],
    java: [["int amount = 45;", "a"], ["int[] coins = {5, 10, 20, 50};", "b1"], ["int count = 0;", "c"], ["for (int c : coins) {", "lp"], ["    if (amount >= c) {", "b2"], ["        amount -= c;", "sub"], ["        count++;", "inc"], "    }", "}", ["System.out.println(count);", "o1"], ["System.out.println(amount);", "o2"]],
    js: [["let amount = 45;", "a"], ["const coins = [5, 10, 20, 50];", "b1"], ["let count = 0;", "c"], ["for (const c of coins) {", "lp"], ["  if (amount >= c) {", "b2"], ["    amount -= c;", "sub"], ["    count++;", "inc"], "  }", "}", ["console.log(count);", "o1"], ["console.log(amount);", "o2"]]
  },
  fixes: {
    b1: [
      ok("coins = [50, 20, 10, 5]", "int[] coins = {50, 20, 10, 5};", "const coins = [50, 20, 10, 5];"),
      no("coins = [10, 5, 20, 50]", "int[] coins = {10, 5, 20, 50};", "const coins = [10, 5, 20, 50];", "Still small coins first. The machine runs out of change before it ever tries a big coin.", "Immer noch kleine Münzen zuerst. Der Rest ist weg, bevor eine große Münze drankommt."),
      no("coins = [50]", "int[] coins = {50};", "const coins = [50];", "45 cents cannot be paid with fifties alone.", "45 Cent kann man nicht nur mit Fünfzigern zahlen.")
    ],
    b2: [
      ok("    while amount >= c:", "    while (amount >= c) {", "  while (amount >= c) {"),
      no("    if amount > c:", "    if (amount > c) {", "  if (amount > c) {", "Still only one coin of each kind, and now an exact fit is refused too.", "Immer noch nur eine Münze pro Sorte, und jetzt wird auch ein genau passender Betrag abgelehnt."),
      no("    if amount == c:", "    if (amount == c) {", "  if (amount === c) {", "Only pays out a coin when the rest is exactly that coin.", "Zahlt nur eine Münze aus, wenn der Rest genau diese Münze ist.")
    ]
  },
  sim(F, lang) {
    const coins = F.has("b1") ? [50, 20, 10, 5] : [5, 10, 20, 50], s = [P("a", { amount: "45" }), P("b1", { coins: arr(coins, lang) }), P("c", { count: "0" })]; let a = 45, n = 0;
    for (const c of coins) { s.push(P("lp", { c: String(c) }));
      for (;;) { const y = a >= c; s.push(P("b2", null, `${a} >= ${c} → ${bool(y, lang)}`)); if (!y) break;
        a -= c; s.push(P("sub", { amount: String(a) })); n++; s.push(P("inc", { count: String(n) })); if (!F.has("b2")) break; } }
    s.push(O("o1", n), O("o2", a));
    return s;
  } },

{ id: "e4",
  title: tx("The Fake Primes", "Die falschen Primzahlen"),
  who: tx("Prof. Weiss, number museum", "Prof. Weiss, Zahlenmuseum"),
  quote: tx("Of 4, 6 and 7 only 7 is a prime. Our ancient prime detector found two primes, and neither of them was 7!", "Von 4, 6 und 7 ist nur 7 eine Primzahl. Unser uralter Primzahl-Detektor fand zwei Primzahlen, und keine davon war die 7!"),
  culprit: tx("Divider Dora", "Teiler-Theo"),
  lesson: tx("“d divides n” means the remainder is 0: n % d == 0. And to test a number you must try every possible divider, not stop halfway too early.", "„d teilt n“ heißt: Der Rest ist 0, also n % d == 0. Und zum Testen musst du jeden möglichen Teiler probieren, nicht zu früh aufhören."),
  card: tx("My comments are lies.", "Meine Kommentare lügen."),
  hints: [tx("Two bugs. Which dividers does the inner loop try for 4? And what remainder means “divides evenly”?", "Zwei Bugs. Welche Teiler probiert die innere Schleife bei 4? Und welcher Rest heißt „geht glatt auf“?")],
  want: ["1"], bugs: ["b1", "b2"],
  code: {
    py: [["nums = [4, 6, 7]", "n"], ["primes = 0", "p"], ["for n in nums:", "lp"], ["    is_prime = True", "ip"], ["    for d in range(2, n // 2):", "b1"], ["        if n % d == 1:", "b2"], ["            is_prime = False", "nf"], ["    if is_prime:", "if"], ["        primes += 1", "inc"], ["print(primes)", "out"]],
    java: [["int[] nums = {4, 6, 7};", "n"], ["int primes = 0;", "p"], ["for (int n : nums) {", "lp"], ["    boolean isPrime = true;", "ip"], ["    for (int d = 2; d < n / 2; d++) {", "b1"], ["        if (n % d == 1) {", "b2"], ["            isPrime = false;", "nf"], "        }", "    }", ["    if (isPrime) {", "if"], ["        primes++;", "inc"], "    }", "}", ["System.out.println(primes);", "out"]],
    js: [["const nums = [4, 6, 7];", "n"], ["let primes = 0;", "p"], ["for (const n of nums) {", "lp"], ["  let isPrime = true;", "ip"], ["  for (let d = 2; d < Math.floor(n / 2); d++) {", "b1"], ["    if (n % d === 1) {", "b2"], ["      isPrime = false;", "nf"], "    }", "  }", ["  if (isPrime) {", "if"], ["    primes++;", "inc"], "  }", "}", ["console.log(primes);", "out"]]
  },
  fixes: {
    b1: [
      ok("    for d in range(2, n):", "    for (int d = 2; d < n; d++) {", "  for (let d = 2; d < n; d++) {"),
      no("    for d in range(1, n):", "    for (int d = 1; d < n; d++) {", "  for (let d = 1; d < n; d++) {", "Every number can be divided by 1. Nothing would ever be a prime.", "Jede Zahl ist durch 1 teilbar. Dann wäre nie etwas eine Primzahl."),
      no("    for d in range(2, n + 1):", "    for (int d = 2; d <= n; d++) {", "  for (let d = 2; d <= n; d++) {", "Every number divides itself. 7 would be thrown out too.", "Jede Zahl ist durch sich selbst teilbar. Auch die 7 fiele raus.")
    ],
    b2: [
      ok("        if n % d == 0:", "        if (n % d == 0) {", "    if (n % d === 0) {"),
      no("        if n % d != 0:", "        if (n % d != 0) {", "    if (n % d !== 0) {", "That kicks numbers out when d does NOT divide them. Exactly the wrong way round.", "Das wirft Zahlen raus, wenn d sie NICHT teilt. Genau verkehrt herum."),
      no("        if n // d == 0:", "        if (n / d == 0) {", "    if (Math.floor(n / d) === 0) {", "That asks whether the division result is 0. For d smaller than n it never is.", "Das fragt, ob das Teilungsergebnis 0 ist. Für d kleiner als n ist es das nie.")
    ]
  },
  sim(F, lang) {
    const IP = vn("is_prime", "isPrime", lang), s = [P("n", { nums: arr([4, 6, 7], lang) }), P("p", { primes: "0" })]; let pr = 0;
    for (const n of [4, 6, 7]) {
      s.push(P("lp", { n: String(n) }), P("ip", { [IP]: bool(true, lang) })); let ip = true;
      const end = F.has("b1") ? n : Math.floor(n / 2), want = F.has("b2") ? 0 : 1;
      if (end <= 2) s.push(P("b1", null, `range(2, ${end}): ${L(tx("empty", "leer"))}`));
      for (let d = 2; d < end; d++) { s.push(P("b1", { d: String(d) })); const r = n % d; s.push(P("b2", null, `${n} % ${d} = ${r} → ${bool(r === want, lang)}`));
        if (r === want) { ip = false; s.push(P("nf", { [IP]: bool(false, lang) })); } }
      s.push(P("if", null, bool(ip, lang)));
      if (ip) { pr++; s.push(P("inc", { primes: String(pr) })); }
    }
    s.push(O("out", pr));
    return s;
  } },

{ id: "e5",
  title: tx("The Inflation That Wasn’t", "Die Inflation, die keine war"),
  who: tx("Bea, market stall", "Bea, Marktstand"),
  quote: tx("Festival day: all prices double. Lemonade 3 becomes 6, waffles 5 become 10, so the price board total should be 16. The old till says 5.", "Festtag: Alle Preise verdoppeln sich. Limo 3 wird 6, Waffeln 5 werden 10, also sollte die Preistafel 16 zeigen. Die alte Kasse sagt 5."),
  culprit: tx("Copy Cody", "Kopie-Kuno"),
  lesson: tx("Changing a copy (p) does not change the list. Write back into the list with prices[i] = …, and collect with += instead of overwriting with =.", "Eine Kopie (p) zu ändern ändert die Liste nicht. Schreib mit prices[i] = … in die Liste zurück, und sammle mit += statt mit = zu überschreiben."),
  card: tx("Refactor me? Never.", "Mich umbauen? Niemals."),
  hints: [tx("Two bugs. Does the prices list ever change? And does total collect, or overwrite?", "Zwei Bugs. Ändert sich die Liste prices jemals? Und sammelt total, oder überschreibt es?")],
  want: ["16"], bugs: ["b1", "b2"],
  code: {
    py: [["prices = [3, 5]", "pr"], ["total = 0", "t"], ["for i in range(len(prices)):", "lp"], ["    p = prices[i]", "p"], ["    p = p * 2", "b1"], ["    total = prices[i]", "b2"], ["print(total)", "out"]],
    java: [["int[] prices = {3, 5};", "pr"], ["int total = 0;", "t"], ["for (int i = 0; i < prices.length; i++) {", "lp"], ["    int p = prices[i];", "p"], ["    p = p * 2;", "b1"], ["    total = prices[i];", "b2"], "}", ["System.out.println(total);", "out"]],
    js: [["const prices = [3, 5];", "pr"], ["let total = 0;", "t"], ["for (let i = 0; i < prices.length; i++) {", "lp"], ["  let p = prices[i];", "p"], ["  p = p * 2;", "b1"], ["  total = prices[i];", "b2"], "}", ["console.log(total);", "out"]]
  },
  fixes: {
    b1: [
      ok("    prices[i] = p * 2", "    prices[i] = p * 2;", "  prices[i] = p * 2;"),
      no("    p *= 2", "    p *= 2;", "  p *= 2;", "Same thing in short: only the copy p doubles, the list stays the same.", "Dasselbe in kurz: Nur die Kopie p verdoppelt sich, die Liste bleibt gleich."),
      no("    p = prices[i] * 2", "    p = prices[i] * 2;", "  p = prices[i] * 2;", "Still writes into p, not into the list.", "Schreibt immer noch in p, nicht in die Liste.")
    ],
    b2: [
      ok("    total += prices[i]", "    total += prices[i];", "  total += prices[i];"),
      no("    total += 1", "    total += 1;", "  total += 1;", "That counts the items instead of adding up their prices.", "Das zählt die Artikel, statt ihre Preise zu addieren."),
      no("    total = prices[i] * 2", "    total = prices[i] * 2;", "  total = prices[i] * 2;", "Still overwrites total every round. Only the last item survives.", "Überschreibt total weiter jede Runde. Nur der letzte Artikel bleibt übrig.")
    ]
  },
  sim(F, lang) {
    const pr = [3, 5], s = [P("pr", { prices: arr(pr, lang) }), P("t", { total: "0" })]; let total = 0;
    for (let i = 0; i < 2; i++) {
      s.push(P("lp", { i: String(i) })); let p = pr[i]; s.push(P("p", { p: String(p) }));
      if (F.has("b1")) { pr[i] = p * 2; s.push(P("b1", { prices: arr(pr, lang) })); } else { p *= 2; s.push(P("b1", { p: String(p) })); }
      const old = total; total = F.has("b2") ? total + pr[i] : pr[i]; s.push(P("b2", { total: String(total) }, F.has("b2") ? `${old} + ${pr[i]} = ${total}` : null));
    }
    s.push(O("out", total));
    return s;
  } },

{ id: "e6",
  title: tx("The Ghost Seats", "Die Geistersitze"),
  who: tx("Rui, cinema manager", "Rui, Kinoleiter"),
  quote: tx("Two rows, three seats each. We sold 4 tickets. The seat counter says 3. Somebody is sitting there that the program cannot see.", "Zwei Reihen, je drei Sitze. Wir haben 4 Karten verkauft. Der Sitzzähler sagt 3. Da sitzt jemand, den das Programm nicht sieht."),
  culprit: tx("Grid Greta", "Gitter-Gustl"),
  lesson: tx("In a 2D list, grid[row][column]: the outer loop picks the row, the inner loop walks the columns of THAT row. Rows and columns are rarely the same length.", "In einer 2D-Liste gilt grid[Zeile][Spalte]: Die äußere Schleife wählt die Zeile, die innere läuft durch die Spalten DIESER Zeile. Zeilen und Spalten sind selten gleich lang."),
  card: tx("I am older than your laptop.", "Ich bin älter als dein Laptop."),
  hints: [tx("Two bugs. How many seats does a row have, and how many rows are there? And which index comes first?", "Zwei Bugs. Wie viele Sitze hat eine Reihe, und wie viele Reihen gibt es? Und welcher Index kommt zuerst?")],
  want: ["4"], bugs: ["b1", "b2"],
  code: {
    py: [["seats = [[1, 0, 1], [1, 1, 0]]", "s"], ["taken = 0", "t"], ["for i in range(len(seats)):", "li"], ["    for j in range(len(seats)):", "b1"], ["        taken += seats[j][i]", "b2"], ["print(taken)", "out"]],
    java: [["int[][] seats = {{1, 0, 1}, {1, 1, 0}};", "s"], ["int taken = 0;", "t"], ["for (int i = 0; i < seats.length; i++) {", "li"], ["    for (int j = 0; j < seats.length; j++) {", "b1"], ["        taken += seats[j][i];", "b2"], "    }", "}", ["System.out.println(taken);", "out"]],
    js: [["const seats = [[1, 0, 1], [1, 1, 0]];", "s"], ["let taken = 0;", "t"], ["for (let i = 0; i < seats.length; i++) {", "li"], ["  for (let j = 0; j < seats.length; j++) {", "b1"], ["    taken += seats[j][i];", "b2"], "  }", "}", ["console.log(taken);", "out"]]
  },
  fixes: {
    b1: [
      ok("    for j in range(len(seats[i])):", "    for (int j = 0; j < seats[i].length; j++) {", "  for (let j = 0; j < seats[i].length; j++) {"),
      no("    for j in range(len(seats) - 1):", "    for (int j = 0; j < seats.length - 1; j++) {", "  for (let j = 0; j < seats.length - 1; j++) {", "Still counts rows instead of seats, and now even one less.", "Zählt immer noch Reihen statt Sitze, und jetzt sogar einen weniger."),
      no("    for j in range(len(seats[i]) - 1):", "    for (int j = 0; j < seats[i].length - 1; j++) {", "  for (let j = 0; j < seats[i].length - 1; j++) {", "Skips the last seat of every row.", "Überspringt den letzten Sitz jeder Reihe.")
    ],
    b2: [
      ok("        taken += seats[i][j]", "        taken += seats[i][j];", "    taken += seats[i][j];"),
      no("        taken += seats[i][i]", "        taken += seats[i][i];", "    taken += seats[i][i];", "Looks at the same seat again and again.", "Schaut immer wieder auf denselben Sitz."),
      no("        taken += seats[j][j]", "        taken += seats[j][j];", "    taken += seats[j][j];", "Only walks the diagonal and runs off the grid.", "Läuft nur die Diagonale entlang und fällt aus dem Gitter.")
    ]
  },
  sim(F, lang) {
    const g = [[1, 0, 1], [1, 1, 0]], s = [P("s", { seats: lang === "java" ? "{{1, 0, 1}, {1, 1, 0}}" : "[[1, 0, 1], [1, 1, 0]]" }), P("t", { taken: "0" })]; let tk = 0;
    for (let i = 0; i < 2; i++) { s.push(P("li", { i: String(i) }));
      const n = F.has("b1") ? 3 : 2;
      for (let j = 0; j < n; j++) { s.push(P("b1", { j: String(j) }));
        const r = F.has("b2") ? i : j, c = F.has("b2") ? j : i;
        if (!g[r]) { s.push(crash("b2", "index", lang)); return s; }
        tk += g[r][c]; s.push(P("b2", { taken: String(tk) }, `seats[${r}][${c}] = ${g[r][c]}`)); } }
    s.push(O("out", tk));
    return s;
  } },

{ id: "e7",
  title: tx("The Time-Travel Train", "Der Zeitreise-Zug"),
  who: tx("Otto, station master", "Otto, Bahnhofsvorsteher"),
  quote: tx("The train leaves at 10 and the trip takes 300 minutes. The board says it arrives at 10. Passengers think we invented teleportation.", "Der Zug fährt um 10 ab, die Fahrt dauert 300 Minuten. Die Anzeige sagt: Ankunft um 10. Die Fahrgäste glauben, wir hätten das Beamen erfunden."),
  culprit: tx("Modulo Mona", "Modulo-Moritz"),
  lesson: tx("// (or integer /) tells you how many whole hours; % tells you what is left over. And a train timetable has 24 hours, not 12.", "// (oder ganzzahliges /) sagt, wie viele ganze Stunden; % sagt, was übrig bleibt. Und ein Fahrplan hat 24 Stunden, nicht 12."),
  card: tx("Do not touch me. Things break.", "Fass mich nicht an. Dann geht was kaputt."),
  hints: [tx("Two bugs. How many hours are 300 minutes? And what time comes after 12 on a train timetable?", "Zwei Bugs. Wie viele Stunden sind 300 Minuten? Und was kommt auf einem Fahrplan nach 12 Uhr?")],
  want: ["15"], bugs: ["b1", "b2"],
  code: {
    py: [["start = 10", "s"], ["minutes = 300", "m"], ["hours = minutes % 60", "b1"], ["arrival = (start + hours) % 12", "b2"], ["print(arrival)", "out"]],
    java: [["int start = 10;", "s"], ["int minutes = 300;", "m"], ["int hours = minutes % 60;", "b1"], ["int arrival = (start + hours) % 12;", "b2"], ["System.out.println(arrival);", "out"]],
    js: [["const start = 10;", "s"], ["const minutes = 300;", "m"], ["const hours = minutes % 60;", "b1"], ["const arrival = (start + hours) % 12;", "b2"], ["console.log(arrival);", "out"]]
  },
  fixes: {
    b1: [
      ok("hours = minutes // 60", "int hours = minutes / 60;", "const hours = Math.floor(minutes / 60);"),
      no("hours = minutes * 60", "int hours = minutes * 60;", "const hours = minutes * 60;", "That turns minutes into seconds, not hours: 18000.", "Das macht aus Minuten Sekunden, keine Stunden: 18000."),
      no("hours = minutes - 60", "int hours = minutes - 60;", "const hours = minutes - 60;", "240 “hours”? That train would arrive next week.", "240 „Stunden“? Dann käme der Zug nächste Woche an.")
    ],
    b2: [
      ok("arrival = (start + hours) % 24", "int arrival = (start + hours) % 24;", "const arrival = (start + hours) % 24;"),
      no("arrival = (start + hours) % 10", "int arrival = (start + hours) % 10;", "const arrival = (start + hours) % 10;", "A day does not have 10 hours.", "Ein Tag hat keine 10 Stunden."),
      no("arrival = start + hours - 12", "int arrival = start + hours - 12;", "const arrival = start + hours - 12;", "Subtracting 12 always, even in the morning, gives negative times.", "Immer 12 abziehen, auch am Vormittag, ergibt negative Uhrzeiten.")
    ]
  },
  sim(F, lang) {
    const h = F.has("b1") ? 5 : 0, m = F.has("b2") ? 24 : 12, a = (10 + h) % m;
    return [P("s", { start: "10" }), P("m", { minutes: "300" }),
      P("b1", { hours: String(h) }, F.has("b1") ? (lang === "js" ? "floor(300 / 60) = 5" : lang === "py" ? "300 // 60 = 5" : "300 / 60 = 5") : "300 % 60 = 0"),
      P("b2", { arrival: String(a) }, `(10 + ${h}) % ${m} = ${a}`), O("out", a)];
  } },

{ id: "e8",
  title: tx("The Double-Booked Room", "Der doppelt gebuchte Raum"),
  who: tx("Grace, office manager", "Grace, Büroleitung"),
  quote: tx("Team A has the room from 9 to 10, Team B from 10 to 11. One leaves as the other arrives. The booking system screams CLASH and blocks both.", "Team A hat den Raum von 9 bis 10, Team B von 10 bis 11. Die einen gehen, die anderen kommen. Das Buchungssystem schreit KONFLIKT und sperrt beide."),
  culprit: tx("Overlap Olga", "Überlapp-Ulf"),
  lesson: tx("Two time slots clash only if BOTH are true: B starts before A ends, AND B ends after A starts. Touching at 10:00 is not a clash, so use <.", "Zwei Zeitfenster überschneiden sich nur, wenn BEIDES stimmt: B beginnt, bevor A endet, UND B endet, nachdem A beginnt. Berühren um 10:00 ist kein Konflikt, also <."),
  card: tx("Rewrite me and suffer.", "Schreib mich neu, und du leidest."),
  hints: [tx("Two bugs. Does starting exactly at 10 count as “before 10”? And must one or both conditions be true?", "Zwei Bugs. Zählt Beginn genau um 10 als „vor 10“? Und muss eine oder müssen beide Bedingungen stimmen?")],
  want: lang => [bool(false, lang)], bugs: ["b1", "b2"],
  code: {
    py: [["s1, e1 = 9, 10", "a"], ["s2, e2 = 10, 11", "b"], ["starts_early = s2 <= e1", "b1"], ["ends_late = e2 > s1", "el"], ["clash = starts_early or ends_late", "b2"], ["print(clash)", "out"]],
    java: [["int s1 = 9, e1 = 10;", "a"], ["int s2 = 10, e2 = 11;", "b"], ["boolean startsEarly = s2 <= e1;", "b1"], ["boolean endsLate = e2 > s1;", "el"], ["boolean clash = startsEarly || endsLate;", "b2"], ["System.out.println(clash);", "out"]],
    js: [["const s1 = 9, e1 = 10;", "a"], ["const s2 = 10, e2 = 11;", "b"], ["const startsEarly = s2 <= e1;", "b1"], ["const endsLate = e2 > s1;", "el"], ["const clash = startsEarly || endsLate;", "b2"], ["console.log(clash);", "out"]]
  },
  fixes: {
    b1: [
      ok("starts_early = s2 < e1", "boolean startsEarly = s2 < e1;", "const startsEarly = s2 < e1;"),
      no("starts_early = s2 >= e1", "boolean startsEarly = s2 >= e1;", "const startsEarly = s2 >= e1;", "Now it asks whether B starts AFTER A ends. That is the opposite.", "Jetzt fragt es, ob B NACH dem Ende von A beginnt. Das ist das Gegenteil."),
      no("starts_early = s2 == e1", "boolean startsEarly = s2 == e1;", "const startsEarly = s2 === e1;", "Exactly the touching case would count as a clash. The opposite of what we want.", "Genau der Berührungsfall würde als Konflikt zählen. Das Gegenteil von dem, was wir wollen.")
    ],
    b2: [
      ok("clash = starts_early and ends_late", "boolean clash = startsEarly && endsLate;", "const clash = startsEarly && endsLate;"),
      no("clash = not starts_early or ends_late", "boolean clash = !startsEarly || endsLate;", "const clash = !startsEarly || endsLate;", "ends_late alone is true for almost every meeting, so with or everything still clashes.", "ends_late allein stimmt bei fast jedem Termin, mit or kollidiert also weiter alles."),
      no("clash = ends_late", "boolean clash = endsLate;", "const clash = endsLate;", "Ignores the start time completely. Any later meeting would clash.", "Ignoriert den Beginn völlig. Jeder spätere Termin würde kollidieren.")
    ]
  },
  sim(F, lang) {
    const SE = vn("starts_early", "startsEarly", lang), EL = vn("ends_late", "endsLate", lang), se = F.has("b1") ? 10 < 10 : 10 <= 10, el = true, c = F.has("b2") ? se && el : se || el;
    const AND = vn("and", "&&", lang), OR = vn("or", "||", lang);
    return [P("a", { s1: "9", e1: "10" }), P("b", { s2: "10", e2: "11" }), P("b1", { [SE]: bool(se, lang) }, `10 ${F.has("b1") ? "<" : "<="} 10 → ${bool(se, lang)}`),
      P("el", { [EL]: bool(el, lang) }, `11 > 9 → ${bool(el, lang)}`), P("b2", { clash: bool(c, lang) }, `${bool(se, lang)} ${F.has("b2") ? AND : OR} ${bool(el, lang)} → ${bool(c, lang)}`), O("out", bool(c, lang))];
  } },

{ id: "e9",
  title: tx("The Rabbit Explosion", "Die Kaninchen-Explosion"),
  who: tx("Farmer Ines", "Bäuerin Ines"),
  quote: tx("My rabbit forecast follows the famous Fibonacci rule: month 3 should have 2 pairs. The old program says 0 rabbits. Then it said 4. Then it crashed.", "Meine Kaninchen-Prognose folgt der berühmten Fibonacci-Regel: Im Monat 3 sollten es 2 Paare sein. Das alte Programm sagt 0 Kaninchen. Dann sagte es 4. Dann stürzte es ab."),
  culprit: tx("Recursion Rex", "Rekursions-Rolf"),
  lesson: tx("A recursive function needs a base case that really stops it (n <= 1) and a step that gets smaller. fib(n) = fib(n − 1) + fib(n − 2).", "Eine rekursive Funktion braucht einen Abbruch, der sie wirklich stoppt (n <= 1), und einen Schritt, der kleiner wird. fib(n) = fib(n − 1) + fib(n − 2)."),
  card: tx("My author left in 2003.", "Mein Autor ist 2003 gegangen."),
  hints: [tx("Two bugs. What should fib(1) return? And Fibonacci adds the two previous numbers, not the same one twice.", "Zwei Bugs. Was sollte fib(1) liefern? Und Fibonacci addiert die zwei vorigen Zahlen, nicht zweimal dieselbe.")],
  want: ["2"], bugs: ["b1", "b2"],
  code: {
    py: [["def fib(n):", "fn"], ["    if n == 0:", "b1"], ["        return n", "rb"], ["    return fib(n - 1) + fib(n - 1)", "b2"], "", ["print(fib(3))", "out"]],
    java: [["static int fib(int n) {", "fn"], ["    if (n == 0) {", "b1"], ["        return n;", "rb"], "    }", ["    return fib(n - 1) + fib(n - 1);", "b2"], "}", "", ["System.out.println(fib(3));", "out"]],
    js: [["function fib(n) {", "fn"], ["  if (n === 0) {", "b1"], ["    return n;", "rb"], "  }", ["  return fib(n - 1) + fib(n - 1);", "b2"], "}", "", ["console.log(fib(3));", "out"]]
  },
  fixes: {
    b1: [
      ok("    if n <= 1:", "    if (n <= 1) {", "  if (n <= 1) {"),
      no("    if n == 1:", "    if (n == 1) {", "  if (n === 1) {", "fib(0) would no longer stop and dive into negative numbers forever.", "fib(0) würde nicht mehr stoppen und ewig ins Negative tauchen."),
      no("    if n < 0:", "    if (n < 0) {", "  if (n < 0) {", "Stops too late, and returns negative rabbits.", "Stoppt zu spät und liefert negative Kaninchen.")
    ],
    b2: [
      ok("    return fib(n - 1) + fib(n - 2)", "    return fib(n - 1) + fib(n - 2);", "  return fib(n - 1) + fib(n - 2);"),
      no("    return fib(n - 2) + fib(n - 2)", "    return fib(n - 2) + fib(n - 2);", "  return fib(n - 2) + fib(n - 2);", "Still the same number twice, just a different one.", "Immer noch zweimal dieselbe Zahl, nur eine andere."),
      no("    return fib(n) + fib(n - 1)", "    return fib(n) + fib(n - 1);", "  return fib(n) + fib(n - 1);", "fib(n) calls itself with the same n: it never gets smaller and crashes.", "fib(n) ruft sich mit demselben n auf: Es wird nie kleiner und stürzt ab.")
    ]
  },
  sim(F, lang) {
    const s = [P("out", null, "fib(3)")];
    const go = n => {
      s.push(P("fn", { n: String(n) }));
      if (n < -4) throw 0;
      const base = F.has("b1") ? n <= 1 : n === 0;
      s.push(P("b1", null, `${n} ${F.has("b1") ? "<= 1" : "== 0"} → ${bool(base, lang)}`));
      if (base) { s.push(P("rb", null, "return " + n)); return n; }
      const a = go(n - 1), b = go(F.has("b2") ? n - 2 : n - 1);
      s.push(P("b2", { n: String(n) }, `${a} + ${b} = ${a + b}`)); return a + b;
    };
    try { s.push(O("out", go(3))); } catch (e) { s.push(crash("b2", "rec", lang)); }
    return s;
  } },

{ id: "e10", final: true,
  title: tx("The Legacy Weather Station", "Die Erbstück-Wetterstation"),
  who: tx("Wanda, weather presenter", "Wanda, Wetteransagerin"),
  quote: tx("Four days: 12, 18, 15 and 21 degrees. I said “average 16.5, hottest 21” on live TV. The station said 11 and 12. A robot was blinking in the corner.", "Vier Tage: 12, 18, 15 und 21 Grad. Ich habe live im Fernsehen gesagt: „Schnitt 16,5, wärmster Tag 21.“ Die Station sagte 11 und 12. In der Ecke blinkte ein Roboter."),
  culprit: tx("The Legacy", "Das Erbstück"),
  lesson: tx("Old code piles up small bugs: a loop that stops early, a flipped comparison, a division that cuts decimals. Fix them one at a time and test after each.", "Alter Code stapelt kleine Bugs: eine Schleife, die zu früh aufhört, ein verdrehter Vergleich, eine Division, die Nachkommastellen abschneidet. Repariere einen nach dem anderen und teste nach jedem."),
  hints: [tx("Three bugs. Does the loop reach the last day? Which comparison finds the hottest? And does the division keep the .5?", "Drei Bugs. Erreicht die Schleife den letzten Tag? Welcher Vergleich findet den wärmsten? Und behält die Division die ,5?")],
  want: ["16.5", "21"], bugs: ["b1", "b2", "b3"],
  code: {
    py: [["temps = [12, 18, 15, 21]", "tp"], ["total = temps[0]", "t"], ["hottest = temps[0]", "h"], ["for i in range(1, len(temps) - 1):", "b1"], ["    total += temps[i]", "add"], ["    if temps[i] < hottest:", "b2"], ["        hottest = temps[i]", "set"], ["print(total // len(temps))", "b3"], ["print(hottest)", "o2"]],
    java: [["int[] temps = {12, 18, 15, 21};", "tp"], ["int total = temps[0];", "t"], ["int hottest = temps[0];", "h"], ["for (int i = 1; i < temps.length - 1; i++) {", "b1"], ["    total += temps[i];", "add"], ["    if (temps[i] < hottest) {", "b2"], ["        hottest = temps[i];", "set"], "    }", "}", ["System.out.println(total / temps.length);", "b3"], ["System.out.println(hottest);", "o2"]],
    js: [["const temps = [12, 18, 15, 21];", "tp"], ["let total = temps[0];", "t"], ["let hottest = temps[0];", "h"], ["for (let i = 1; i < temps.length - 1; i++) {", "b1"], ["  total += temps[i];", "add"], ["  if (temps[i] < hottest) {", "b2"], ["    hottest = temps[i];", "set"], "  }", "}", ["console.log(Math.floor(total / temps.length));", "b3"], ["console.log(hottest);", "o2"]]
  },
  fixes: {
    b1: [
      ok("for i in range(1, len(temps)):", "for (int i = 1; i < temps.length; i++) {", "for (let i = 1; i < temps.length; i++) {"),
      no("for i in range(len(temps)):", "for (int i = 0; i < temps.length; i++) {", "for (let i = 0; i < temps.length; i++) {", "Day 1 is already in total. Starting at 0 counts it twice.", "Tag 1 steckt schon in total. Bei 0 anfangen zählt ihn doppelt."),
      no("for i in range(2, len(temps)):", "for (int i = 2; i < temps.length; i++) {", "for (let i = 2; i < temps.length; i++) {", "Now day 2 goes missing.", "Jetzt fehlt Tag 2.")
    ],
    b2: [
      ok("    if temps[i] > hottest:", "    if (temps[i] > hottest) {", "  if (temps[i] > hottest) {"),
      no("    if temps[i] == hottest:", "    if (temps[i] == hottest) {", "  if (temps[i] === hottest) {", "Only an equally hot day replaces it. The 21 never wins.", "Nur ein gleich warmer Tag ersetzt ihn. Die 21 gewinnt nie."),
      no("    if temps[i] > total:", "    if (temps[i] > total) {", "  if (temps[i] > total) {", "Compares with the running sum. No single day is ever hotter than that.", "Vergleicht mit der laufenden Summe. Kein einzelner Tag ist je wärmer als die.")
    ],
    b3: [
      ok("print(total / len(temps))", "System.out.println((double) total / temps.length);", "console.log(total / temps.length);"),
      no("print(total % len(temps))", "System.out.println(total % temps.length);", "console.log(total % temps.length);", "% gives the remainder, not the average.", "% liefert den Rest, nicht den Schnitt."),
      no("print(total // len(temps) + 1)", "System.out.println(total / temps.length + 1);", "console.log(Math.floor(total / temps.length) + 1);", "Cutting and then adding 1 is guessing, not calculating.", "Abschneiden und dann 1 dazuzählen ist Raten, nicht Rechnen.")
    ]
  },
  sim(F, lang) {
    const tp = [12, 18, 15, 21], end = F.has("b1") ? 4 : 3, s = [P("tp", { temps: arr(tp, lang) }), P("t", { total: "12" }), P("h", { hottest: "12" })]; let total = 12, hot = 12;
    for (let i = 1; i < end; i++) {
      s.push(P("b1", { i: String(i) }));
      const old = total; total += tp[i]; s.push(P("add", { total: String(total) }, `${old} + ${tp[i]} = ${total}`));
      const op = F.has("b2") ? ">" : "<", y = F.has("b2") ? tp[i] > hot : tp[i] < hot;
      s.push(P("b2", null, `${tp[i]} ${op} ${hot} → ${bool(y, lang)}`));
      if (y) { hot = tp[i]; s.push(P("set", { hottest: String(hot) })); }
    }
    s.push(P("b1", null, `${L(W.ends)}: ${end - 1} ${L(W.rounds)}`));
    const avg = F.has("b3") ? String(total / 4) : String(Math.floor(total / 4));
    s.push(O("b3", avg, null, F.has("b3") ? `${total} / 4` : (lang === "py" ? `${total} // 4` : lang === "java" ? `${total} / 4 (int)` : `floor(${total} / 4)`)), O("o2", hot));
    return s;
  } }
]});
