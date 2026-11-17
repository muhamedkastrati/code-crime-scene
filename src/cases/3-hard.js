/* ---------- level 3: hard ---------- */
LEVELS.push({ id: "hard", name: tx("Hard", "Hard"), color: "#ff8a3d", base: 35, time: 240, hints: 1, hide: false,
 villain: { name: tx("Nobody", "Niemand"), svg: "ghost",
   end: tx("Nobody is behind bars. Missing values, empty spots and edge cases hide where nobody looks. Now somebody does: you.",
           "Niemand sitzt hinter Gittern. Fehlende Werte, leere Stellen und Grenzfälle verstecken sich dort, wo niemand hinschaut. Jetzt schaut jemand hin: du.") },
 cases: [
{ id: "h1",
  title: tx("The Haunted Backpack", "Der verhexte Rucksack"),
  who: tx("Tom, camp leader", "Tom, Lagerleitung"),
  quote: tx("I copied the packing list to make a wishlist and added a guitar to the wishlist. Now the guitar is in the real backpack too! It is far too heavy.", "Ich habe die Packliste kopiert, um eine Wunschliste zu machen, und auf die Wunschliste eine Gitarre gesetzt. Jetzt ist die Gitarre auch im echten Rucksack! Der ist viel zu schwer."),
  culprit: tx("Twin Tina", "Zwillings-Zita"),
  lesson: tx("For lists, = does not copy. Both names point to the SAME list. Make a real copy if you want two lists.", "Bei Listen kopiert = nicht. Beide Namen zeigen auf DIESELBE Liste. Mach eine echte Kopie, wenn du zwei Listen willst."),
  card: tx("Boo.", "Buh."),
  hints: [tx("Watch both sticky notes when the guitar is added.", "Beobachte beide Notizzettel, wenn die Gitarre dazukommt."),
          tx("wishlist = packed gives the list a second name. It does not make a second list.", "wishlist = packed gibt der Liste einen zweiten Namen. Eine zweite Liste entsteht nicht.")],
  want: ["2"], bugs: ["b1"],
  code: {
    py: [['packed = ["tent", "map"]', "p"], ["wishlist = packed", "b1"], ['wishlist.append("guitar")', "ap"], ["print(len(packed))", "out"]],
    java: [['List<String> packed = new ArrayList<>(List.of("tent", "map"));', "p"], ["List<String> wishlist = packed;", "b1"], ['wishlist.add("guitar");', "ap"], ["System.out.println(packed.size());", "out"]],
    js: [['const packed = ["tent", "map"];', "p"], ["const wishlist = packed;", "b1"], ['wishlist.push("guitar");', "ap"], ["console.log(packed.length);", "out"]]
  },
  fixes: { b1: [
    ok("wishlist = packed.copy()", "List<String> wishlist = new ArrayList<>(packed);", "const wishlist = [...packed];"),
    no("wishlist = packed[0]", "String wishlist = packed.get(0);", "const wishlist = packed[0];", "That takes only the first item, “tent”, as text. You cannot add a guitar to a word.", "Das nimmt nur den ersten Eintrag „tent“ als Text. An ein Wort kann man keine Gitarre hängen."),
    no("wishlist = []", "List<String> wishlist = new ArrayList<>();", "const wishlist = [];", "A new empty list: the backpack is safe, but the wishlist forgot everything that was packed.", "Eine neue leere Liste: Der Rucksack ist sicher, aber die Wunschliste hat alles Gepackte vergessen.")
  ] },
  sim(F, lang) {
    const two = arr(['"tent"', '"map"'], lang), three = arr(['"tent"', '"map"', '"guitar"'], lang);
    if (F.has("b1")) return [P("p", { packed: two }), P("b1", { wishlist: two }, L(tx("new list", "neue Liste"))), P("ap", { wishlist: three }), O("out", 2)];
    return [P("p", { packed: two }), P("b1", { wishlist: two }, L(tx("same list!", "dieselbe Liste!"))), P("ap", { wishlist: three, packed: three }), O("out", 3)];
  } },

{ id: "h2",
  title: tx("The Missing Fraction of a Cent", "Der fehlende Bruchteil-Cent"),
  who: tx("Ivy, café owner", "Ivy, betreibt ein Café"),
  quote: tx("Coffee costs 0.30. A customer paid with 0.10 and 0.20. The register shouted “missing money” and locked the door!", "Kaffee kostet 0,30. Ein Gast zahlte mit 0,10 und 0,20. Die Kasse schrie „missing money“ und hat die Tür verriegelt!"),
  culprit: tx("Float Phil", "Komma-Konrad"),
  lesson: tx("Computers store decimals in binary, so 0.1 + 0.2 is 0.30000000000000004. Never compare decimals with ==. Check whether they are close enough.", "Computer speichern Kommazahlen binär, darum ist 0.1 + 0.2 gleich 0.30000000000000004. Vergleiche Kommazahlen nie mit ==. Prüf, ob sie nah genug beieinander liegen."),
  card: tx("Nobody saw me.", "Niemand hat mich gesehen."),
  hints: [tx("Look very closely at the value on the total sticky note.", "Schau dir den Wert auf dem Notizzettel total ganz genau an."),
          tx("Decimals are rarely exact. Compare with a small tolerance instead of ==.", "Kommazahlen sind selten exakt. Vergleiche mit kleiner Toleranz statt mit ==.")],
  want: ["paid"], bugs: ["b1"],
  code: {
    py: [["total = 0.1 + 0.2", "t"], ["if total == 0.3:", "b1"], ['    print("paid")', "pd"], "else:", ['    print("missing money")', "mm"]],
    java: [["double total = 0.1 + 0.2;", "t"], ["if (total == 0.3) {", "b1"], ['    System.out.println("paid");', "pd"], "} else {", ['    System.out.println("missing money");', "mm"], "}"],
    js: [["const total = 0.1 + 0.2;", "t"], ["if (total === 0.3) {", "b1"], ['  console.log("paid");', "pd"], "} else {", ['  console.log("missing money");', "mm"], "}"]
  },
  fixes: { b1: [
    ok("if abs(total - 0.3) < 1e-9:", "if (Math.abs(total - 0.3) < 1e-9) {", "if (Math.abs(total - 0.3) < 1e-9) {"),
    no("if int(total) == 0.3:", "if ((int) total == 0.3) {", "if (Math.trunc(total) === 0.3) {", "Cutting off the decimals turns 0.3 into 0. And 0 is not 0.3.", "Die Nachkommastellen abschneiden macht aus 0.3 eine 0. Und 0 ist nicht 0.3."),
    no("if round(total) == 0.3:", "if (Math.round(total) == 0.3) {", "if (Math.round(total) === 0.3) {", "Rounding to a whole number gives 0. Still not 0.3.", "Auf eine ganze Zahl runden ergibt 0. Immer noch nicht 0.3.")
  ] },
  sim(F, lang) {
    const k = F.has("b1");
    return [P("t", { total: String(0.1 + 0.2) }, "0.1 + 0.2"),
      P("b1", null, k ? `|total - 0.3| < 1e-9 → ${bool(true, lang)}` : `${0.1 + 0.2} == 0.3 → ${bool(false, lang)}`), O(k ? "pd" : "mm", k ? "paid" : "missing money")];
  } },

{ id: "h3",
  title: tx("The Guest List Ghost", "Das Gästelisten-Gespenst"),
  who: tx("Dex, bouncer", "Dex, Türsteher"),
  quote: tx("Cleo is on the guest list, I swear. Third name. The scanner said “no ticket” before it even got to her name.", "Cleo steht auf der Gästeliste, ich schwöre. Dritter Name. Der Scanner sagte „kein Ticket“, bevor er überhaupt bei ihrem Namen war."),
  culprit: tx("Quitter Quinn", "Aufgeber-Anton"),
  lesson: tx("A return ends the whole function at once. “Not found” can only be decided after the loop has checked every name.", "Ein return beendet sofort die ganze Funktion. „Nicht gefunden“ kann man erst sagen, wenn die Schleife jeden Namen geprüft hat."),
  card: tx("Nobody is perfect.", "Niemand ist perfekt."),
  hints: [tx("How many names does the loop check before it answers?", "Wie viele Namen prüft die Schleife, bevor sie antwortet?"),
          tx("The function gives up after the first wrong name. That return belongs after the loop, and there already is one.", "Die Funktion gibt nach dem ersten falschen Namen auf. Dieses return gehört nach die Schleife, und dort steht schon eins.")],
  want: lang => [bool(true, lang)], bugs: ["b1"],
  code: {
    py: [["def has_ticket(names, guest):", "fn"], ["    for n in names:", "lp"], ["        if n == guest:", "if"], ["            return True", "rt"], ["        return False", "b1"], ["    return False", "rf"], "", ['print(has_ticket(["Ada", "Ben", "Cleo"], "Cleo"))', "out"]],
    java: [["static boolean hasTicket(String[] names, String guest) {", "fn"], ["    for (String n : names) {", "lp"], ["        if (n.equals(guest)) {", "if"], ["            return true;", "rt"], "        }", ["        return false;", "b1"], "    }", ["    return false;", "rf"], "}", "", ['System.out.println(hasTicket(new String[]{"Ada", "Ben", "Cleo"}, "Cleo"));', "out"]],
    js: [["function hasTicket(names, guest) {", "fn"], ["  for (const n of names) {", "lp"], ["    if (n === guest) {", "if"], ["      return true;", "rt"], "    }", ["    return false;", "b1"], "  }", ["  return false;", "rf"], "}", "", ['console.log(hasTicket(["Ada", "Ben", "Cleo"], "Cleo"));', "out"]]
  },
  fixes: { b1: [
    del(),
    no("return True", "return true;", "return true;", "Now everyone gets in as soon as the first name is checked, even without a ticket.", "Jetzt kommt jeder rein, sobald der erste Name geprüft ist, auch ohne Ticket."),
    no("break", "break;", "break;", "Leaves the loop after the first name. Cleo is never checked.", "Verlässt die Schleife nach dem ersten Namen. Cleo wird nie geprüft.")
  ] },
  sim(F, lang) {
    const s = [P("out", null, L(tx("call with guest Cleo", "Aufruf mit Gast Cleo"))), P("fn", { guest: q("Cleo") })]; let res = false;
    for (const n of ["Ada", "Ben", "Cleo"]) {
      s.push(P("lp", { n: q(n) }));
      const eq = n === "Cleo"; s.push(P("if", null, `"${n}" == "Cleo" → ${bool(eq, lang)}`));
      if (eq) { s.push(P("rt", null, "return " + bool(true, lang))); res = true; break; }
      if (!F.has("b1")) { s.push(P("b1", null, "return " + bool(false, lang))); res = false; break; }
    }
    s.push(O("out", bool(res, lang)));
    return s;
  } },

{ id: "h4",
  title: tx("The Broken Times Table", "Das kaputte Einmaleins"),
  who: tx("Ms Okafor, maths teacher", "Frau Okafor, Mathelehrerin"),
  quote: tx("The times-table poster should show 1 2 3 and 2 4 6. It printed 1 1 1 and 4 4 4. The kids now believe 2 × 3 is 4.", "Das Einmaleins-Plakat soll 1 2 3 und 2 4 6 zeigen. Gedruckt wurde 1 1 1 und 4 4 4. Die Kinder glauben jetzt, 2 × 3 ist 4."),
  culprit: tx("Echo Eddie", "Echo-Emil"),
  lesson: tx("In nested loops each loop has its own counter. Mixing up i and j is easy and hard to spot, so check which variable belongs where.", "In verschachtelten Schleifen hat jede Schleife ihren eigenen Zähler. i und j verwechselt man leicht und sieht es schwer, also prüf, welche Variable wohin gehört."),
  card: tx("I am nobody. Nobody is me.", "Ich bin niemand. Niemand ist ich."),
  hints: [tx("Watch i and j on the sticky notes. Which one is actually used in the calculation?", "Achte auf i und j. Welcher wird in der Rechnung wirklich benutzt?"),
          tx("Row times column: the print should use both counters.", "Zeile mal Spalte: Die Ausgabe sollte beide Zähler benutzen.")],
  want: ["1", "2", "3", "2", "4", "6"], bugs: ["b1"],
  code: {
    py: [["for i in range(1, 3):", "li"], ["    for j in range(1, 4):", "lj"], ["        print(i * i)", "b1"]],
    java: [["for (int i = 1; i <= 2; i++) {", "li"], ["    for (int j = 1; j <= 3; j++) {", "lj"], ["        System.out.println(i * i);", "b1"], "    }", "}"],
    js: [["for (let i = 1; i <= 2; i++) {", "li"], ["  for (let j = 1; j <= 3; j++) {", "lj"], ["    console.log(i * i);", "b1"], "  }", "}"]
  },
  fixes: { b1: [
    ok("print(i * j)", "System.out.println(i * j);", "console.log(i * j);"),
    no("print(j * j)", "System.out.println(j * j);", "console.log(j * j);", "Now the row is ignored: 1, 4, 9 twice.", "Jetzt wird die Zeile ignoriert: zweimal 1, 4, 9."),
    no("print(i + j)", "System.out.println(i + j);", "console.log(i + j);", "That adds instead of multiplying: 2, 3, 4, 3, 4, 5.", "Das addiert statt zu multiplizieren: 2, 3, 4, 3, 4, 5.")
  ] },
  sim(F) {
    const s = [];
    for (let i = 1; i <= 2; i++) { s.push(P("li", { i: String(i) }));
      for (let j = 1; j <= 3; j++) { s.push(P("lj", { j: String(j) })); const b = F.has("b1") ? j : i; s.push(O("b1", i * b, null, `${i} * ${b}`)); } }
    return s;
  } },

{ id: "h5",
  title: tx("The Slowest Winner", "Der langsamste Sieger"),
  who: tx("Coach Rosa", "Trainerin Rosa"),
  quote: tx("Race times: 10, 9 and 100 seconds. The fastest was 9 seconds, obviously. The app crowned the 10-second runner. The 9-second kid is crying.", "Laufzeiten: 10, 9 und 100 Sekunden. Am schnellsten war natürlich die 9. Die App hat den 10-Sekunden-Läufer gekrönt. Das 9-Sekunden-Kind weint."),
  culprit: tx("Alphabet Al", "Alphabet-Alf"),
  lesson: tx("Text is sorted character by character, like a dictionary: \"10\" comes before \"9\" because \"1\" < \"9\". Sort numbers as numbers.", "Text wird Zeichen für Zeichen sortiert, wie im Wörterbuch: \"10\" kommt vor \"9\", weil \"1\" < \"9\". Sortiere Zahlen als Zahlen."),
  card: tx("You cannot catch what is not there.", "Du kannst nicht fangen, was nicht da ist."),
  hints: [tx("Look at the order on the sticky note after sorting. Is that how numbers go?", "Schau auf die Reihenfolge nach dem Sortieren. Ist das die Reihenfolge von Zahlen?"),
          tx("The times are text. Text is sorted like words in a dictionary.", "Die Zeiten sind Text. Text wird sortiert wie Wörter im Wörterbuch.")],
  want: ["9"], bugs: ["b1"],
  code: {
    py: [['times = ["10", "9", "100"]', "t"], ["times = sorted(times)", "b1"], ["print(times[0])", "out"]],
    java: [['String[] times = {"10", "9", "100"};', "t"], ["Arrays.sort(times);", "b1"], ["System.out.println(times[0]);", "out"]],
    js: [['const times = ["10", "9", "100"];', "t"], ["times.sort();", "b1"], ["console.log(times[0]);", "out"]]
  },
  fixes: { b1: [
    ok("times = sorted(times, key=int)", "Arrays.sort(times, Comparator.comparingInt(Integer::parseInt));", "times.sort((a, b) => a - b);"),
    no("times = times[::-1]", "Collections.reverse(Arrays.asList(times));", "times.reverse();", "That only flips the order, it does not sort. \"100\" would come first.", "Das dreht nur die Reihenfolge um, sortiert aber nicht. \"100\" käme zuerst."),
    no("times = sorted(times, key=str)", "Arrays.sort(times, Comparator.naturalOrder());", "times.sort((a, b) => a.localeCompare(b));", "Still compares text character by character: \"10\" before \"9\".", "Vergleicht immer noch Text Zeichen für Zeichen: \"10\" vor \"9\".")
  ] },
  sim(F, lang) {
    const k = F.has("b1"), after = k ? ['"9"', '"10"', '"100"'] : ['"10"', '"100"', '"9"'];
    return [P("t", { times: arr(['"10"', '"9"', '"100"'], lang) }), P("b1", { times: arr(after, lang) }, k ? L(tx("as numbers", "als Zahlen")) : L(tx('as text: "1" < "9"', 'als Text: "1" < "9"'))), O("out", k ? "9" : "10")];
  } },

{ id: "h6",
  title: tx("The Endless Treasure Hunt", "Die endlose Schatzsuche"),
  who: tx("Captain Lin", "Kapitänin Lin"),
  quote: tx("My robot halves the search area every step. The treasure is in the last chest, number 4. The robot has been opening chest 3 since Tuesday.", "Mein Roboter halbiert bei jedem Schritt den Suchbereich. Der Schatz liegt in der letzten Truhe, Nummer 4. Der Roboter öffnet seit Dienstag Truhe 3."),
  culprit: tx("Stuck Stu", "Festgefahren-Fred"),
  lesson: tx("Binary search must shrink the window every round. low = mid can leave it unchanged forever; mid + 1 always moves past the checked spot.", "Binäre Suche muss das Fenster jede Runde verkleinern. low = mid kann es für immer gleich lassen; mid + 1 geht immer über die geprüfte Stelle hinaus."),
  card: tx("Can you see me? No? Good.", "Siehst du mich? Nein? Gut."),
  hints: [tx("Watch low and mid. Do they still change after a few rounds?", "Achte auf low und mid. Ändern sie sich nach ein paar Runden noch?"),
          tx("mid was already checked. The next search should start AFTER it.", "mid wurde schon geprüft. Die nächste Suche sollte DAHINTER anfangen.")],
  want: ["4"], bugs: ["b1"],
  code: {
    py: [["nums = [1, 3, 5, 7, 9]", "n"], ["target = 9", "t"], ["low, high = 0, len(nums) - 1", "lh"], ["while low <= high:", "wh"], ["    mid = (low + high) // 2", "mid"], ["    if nums[mid] == target:", "if"], ["        break", "br"], ["    elif nums[mid] < target:", "el"], ["        low = mid", "b1"], "    else:", ["        high = mid - 1", "hi"], ["print(mid)", "out"]],
    java: [["int[] nums = {1, 3, 5, 7, 9};", "n"], ["int target = 9;", "t"], ["int low = 0, high = nums.length - 1, mid = 0;", "lh"], ["while (low <= high) {", "wh"], ["    mid = (low + high) / 2;", "mid"], ["    if (nums[mid] == target) {", "if"], ["        break;", "br"], ["    } else if (nums[mid] < target) {", "el"], ["        low = mid;", "b1"], "    } else {", ["        high = mid - 1;", "hi"], "    }", "}", ["System.out.println(mid);", "out"]],
    js: [["const nums = [1, 3, 5, 7, 9];", "n"], ["const target = 9;", "t"], ["let low = 0, high = nums.length - 1, mid = 0;", "lh"], ["while (low <= high) {", "wh"], ["  mid = Math.floor((low + high) / 2);", "mid"], ["  if (nums[mid] === target) {", "if"], ["    break;", "br"], ["  } else if (nums[mid] < target) {", "el"], ["    low = mid;", "b1"], "  } else {", ["    high = mid - 1;", "hi"], "  }", "}", ["console.log(mid);", "out"]]
  },
  fixes: { b1: [
    ok("low = mid + 1", "low = mid + 1;", "low = mid + 1;"),
    no("low = mid - 1", "low = mid - 1;", "low = mid - 1;", "Moves the search backwards towards the small numbers. It never reaches 9.", "Schiebt die Suche rückwärts zu den kleinen Zahlen. Die 9 wird nie erreicht."),
    no("high = mid + 1", "high = mid + 1;", "high = mid + 1;", "Changes the wrong end of the window. It never closes and the loop spins forever.", "Verändert das falsche Ende des Fensters. Es schließt sich nie, und die Schleife dreht sich ewig.")
  ] },
  sim(F, lang) {
    const nums = [1, 3, 5, 7, 9], s = [P("n", { nums: arr(nums, lang) }), P("t", { target: "9" }), P("lh", { low: "0", high: "4" })]; let low = 0, high = 4, mid = 0, r = 0;
    while (true) {
      const c = low <= high; s.push(P("wh", null, `${low} <= ${high} → ${bool(c, lang)}`)); if (!c) break;
      mid = Math.floor((low + high) / 2); s.push(P("mid", { mid: String(mid) }));
      const v = nums[mid]; s.push(P("if", null, `${v} == 9 → ${bool(v === 9, lang)}`));
      if (v === 9) { s.push(P("br")); break; }
      s.push(P("el", null, `${v} < 9 → ${bool(true, lang)}`));
      low = F.has("b1") ? mid + 1 : mid; s.push(P("b1", { low: String(low) }));
      if (++r >= 6) { s.push(LOOP("wh", `${low} <= ${high} → ${bool(true, lang)} …`)); return s; }
    }
    s.push(O("out", mid));
    return s;
  } },

{ id: "h7",
  title: tx("The Zero O’Clock Mystery", "Das Null-Uhr-Rätsel"),
  who: tx("Hugo, watchmaker", "Hugo, Uhrmacher"),
  quote: tx("My new digital watch shows 0 at midnight and 0 at noon. Customers ask me what “zero o’clock” is. There is no such time!", "Meine neue Digitaluhr zeigt um Mitternacht 0 und zu Mittag 0. Die Kundschaft fragt, was „null Uhr“ sein soll. Auf einer 12-Stunden-Uhr gibt es das nicht!"),
  culprit: tx("Midnight Max", "Mitternachts-Moritz"),
  lesson: tx("Edge cases hide at the borders: 0 and 12 behave differently on a 12-hour clock. Always test the first and last value.", "Grenzfälle verstecken sich an den Rändern: 0 und 12 verhalten sich auf einer 12-Stunden-Uhr anders. Teste immer den ersten und letzten Wert."),
  card: tx("Nobody fixes me.", "Niemand repariert mich."),
  hints: [tx("Which hours look wrong in the printout?", "Welche Stunden sehen im Ausdruck falsch aus?"),
          tx("% 12 gives 0 for both 0 and 12. Those should be shown as 12.", "% 12 ergibt für 0 und 12 beide Male 0. Die sollten als 12 angezeigt werden.")],
  want: ["12", "1", "12"], bugs: ["b1"],
  code: {
    py: [["for hour in [0, 13, 12]:", "lp"], ["    shown = hour % 12", "b1"], ["    print(shown)", "pr"]],
    java: [["for (int hour : new int[]{0, 13, 12}) {", "lp"], ["    int shown = hour % 12;", "b1"], ["    System.out.println(shown);", "pr"], "}"],
    js: [["for (const hour of [0, 13, 12]) {", "lp"], ["  const shown = hour % 12;", "b1"], ["  console.log(shown);", "pr"], "}"]
  },
  fixes: { b1: [
    ok("shown = hour % 12 or 12", "int shown = hour % 12 == 0 ? 12 : hour % 12;", "const shown = hour % 12 || 12;"),
    no("shown = hour % 13", "int shown = hour % 13;", "const shown = hour % 13;", "13 o’clock would become 0 and midnight stays 0. Clocks do not have a 0.", "13 Uhr würde 0, und Mitternacht bleibt 0. Uhren haben keine 0."),
    no("shown = hour - 12", "int shown = hour - 12;", "const shown = hour - 12;", "Midnight becomes −12 and noon becomes 0.", "Mitternacht wird −12 und Mittag wird 0.")
  ] },
  sim(F) {
    const s = [];
    for (const h of [0, 13, 12]) { s.push(P("lp", { hour: String(h) })); const m = h % 12, v = F.has("b1") ? (m || 12) : m;
      s.push(P("b1", { shown: String(v) }, `${h} % 12 = ${m}${F.has("b1") && m === 0 ? " → 12" : ""}`)); s.push(O("pr", v)); }
    return s;
  } },

{ id: "h8",
  title: tx("The Forgetful Vote Counter", "Der vergessliche Stimmenzähler"),
  who: tx("Mayor Ola", "Bürgermeisterin Ola"),
  quote: tx("Pet election! Votes: cat, dog, cat. The counter says cat has 1 vote. The cats are planning a protest.", "Haustierwahl! Stimmen: cat, dog, cat. Der Zähler sagt, cat hat 1 Stimme. Die Katzen planen einen Protest."),
  culprit: tx("Amnesia Amy", "Vergess-Valentin"),
  lesson: tx("counts[w] = 1 overwrites the old count. To count, read the old value and add 1, with 0 for words seen the first time.", "counts[w] = 1 überschreibt den alten Stand. Zum Zählen den alten Wert lesen und 1 dazuzählen, mit 0 für Wörter, die zum ersten Mal kommen."),
  card: tx("Nobody counts on me.", "Auf Niemand ist Verlass."),
  hints: [tx("Watch the counts sticky note when “cat” shows up the second time.", "Achte auf den Notizzettel counts, wenn „cat“ zum zweiten Mal kommt."),
          tx("Setting the count to 1 forgets everything before. It should grow instead.", "Den Zähler auf 1 setzen vergisst alles davor. Er sollte stattdessen wachsen.")],
  want: ["2"], bugs: ["b1"],
  code: {
    py: [['words = ["cat", "dog", "cat"]', "w"], ["counts = {}", "c"], ["for w in words:", "lp"], ["    counts[w] = 1", "b1"], ['print(counts["cat"])', "out"]],
    java: [['String[] words = {"cat", "dog", "cat"};', "w"], ["Map<String, Integer> counts = new HashMap<>();", "c"], ["for (String w : words) {", "lp"], ["    counts.put(w, 1);", "b1"], "}", ['System.out.println(counts.get("cat"));', "out"]],
    js: [['const words = ["cat", "dog", "cat"];', "w"], ["const counts = {};", "c"], ["for (const w of words) {", "lp"], ["  counts[w] = 1;", "b1"], "}", ['console.log(counts["cat"]);', "out"]]
  },
  fixes: { b1: [
    ok("counts[w] = counts.get(w, 0) + 1", "counts.put(w, counts.getOrDefault(w, 0) + 1);", "counts[w] = (counts[w] || 0) + 1;"),
    no("counts[w] += 1", "counts.put(w, counts.get(w) + 1);", "counts[w] += 1;", "The first time a word appears it has no count yet. Python and Java crash, JavaScript gets NaN.", "Beim ersten Auftreten hat das Wort noch keinen Zähler. Python und Java stürzen ab, JavaScript bekommt NaN."),
    no("counts[w] = len(words)", "counts.put(w, words.length);", "counts[w] = words.length;", "Every word gets 3, even dog, which appears once.", "Jedes Wort bekommt 3, sogar dog, das nur einmal vorkommt.")
  ] },
  sim(F, lang) {
    const s = [P("w", { words: arr(['"cat"', '"dog"', '"cat"'], lang) }), P("c", { counts: dict({}, lang) })], c = {};
    for (const w of ["cat", "dog", "cat"]) { s.push(P("lp", { w: q(w) })); c[w] = F.has("b1") ? (c[w] || 0) + 1 : 1; s.push(P("b1", { counts: dict(c, lang) })); }
    s.push(O("out", c.cat));
    return s;
  } },

{ id: "h9",
  title: tx("The Vanishing Cents", "Die verschwundenen Cents"),
  who: tx("Fatima, toy shop", "Fatima, Spielzeugladen"),
  quote: tx("Three robot kits at 19.99 each. The register charged 59. Every sale loses 97 cents. Somebody is getting rich, and it is not me.", "Drei Roboter-Bausätze zu je 19,99. Die Kasse verlangte 59. Jeder Verkauf verliert 97 Cent. Irgendwer wird reich, und das bin nicht ich."),
  culprit: tx("Chopper Chuck", "Abschneide-Achim"),
  lesson: tx("int() and (int) do not round, they chop off everything after the point. For money, round to 2 decimals (or count in cents).", "int() und (int) runden nicht, sie schneiden alles nach dem Komma ab. Bei Geld auf 2 Stellen runden (oder in Cent rechnen)."),
  card: tx("You are close. Too close.", "Du bist nah dran. Zu nah."),
  hints: [tx("Compare price × qty with what ends up on the total sticky note.", "Vergleiche price × qty mit dem, was auf dem Notizzettel total landet."),
          tx("Cutting to a whole number throws the cents away. Money needs 2 decimals.", "Auf eine ganze Zahl kürzen wirft die Cents weg. Geld braucht 2 Nachkommastellen.")],
  want: ["59.97"], bugs: ["b1"],
  code: {
    py: [["price = 19.99", "p"], ["qty = 3", "q"], ["total = int(price * qty)", "b1"], ["print(total)", "out"]],
    java: [["double price = 19.99;", "p"], ["int qty = 3;", "q"], ["double total = (int) (price * qty);", "b1"], ["System.out.println(total);", "out"]],
    js: [["const price = 19.99;", "p"], ["const qty = 3;", "q"], ["const total = Math.trunc(price * qty);", "b1"], ["console.log(total);", "out"]]
  },
  fixes: { b1: [
    ok("total = round(price * qty, 2)", "double total = Math.round(price * qty * 100) / 100.0;", "const total = Math.round(price * qty * 100) / 100;"),
    no("total = round(price * qty)", "double total = Math.round(price * qty);", "const total = Math.round(price * qty);", "Rounds to whole euros: 60. Now the customer pays 3 cents too much.", "Rundet auf ganze Euro: 60. Jetzt zahlt die Kundschaft 3 Cent zu viel."),
    no("total = int(price) * qty", "double total = (int) price * qty;", "const total = Math.trunc(price) * qty;", "Cuts the price to 19 first: 57. Even more money disappears.", "Kürzt zuerst den Preis auf 19: 57. Noch mehr Geld verschwindet.")
  ] },
  sim(F, lang) {
    const v = F.has("b1") ? "59.97" : (lang === "java" ? "59.0" : "59");
    return [P("p", { price: "19.99" }), P("q", { qty: "3" }), P("b1", { total: v }, `19.99 * 3 = ${19.99 * 3}`), O("out", v)];
  } },

{ id: "h10", final: true,
  title: tx("Nobody’s Name Tag", "Niemands Namensschild"),
  who: tx("Sal, conference host", "Sal, leitet die Konferenz"),
  quote: tx("The badge printer printed ANN, then crashed with a scary error. One guest registered without a name. Bo never got a badge at all.", "Der Schilderdrucker druckte ANN und stürzte dann mit einer gruseligen Meldung ab. Ein Gast hat sich ohne Namen angemeldet. Bo hat nie ein Schild bekommen."),
  culprit: tx("Nobody", "Niemand"),
  lesson: tx("A missing value (None / null) is not text. Check for it before you use it, and make sure your loop really reaches the end.", "Ein fehlender Wert (None / null) ist kein Text. Prüf ihn, bevor du ihn benutzt, und sorg dafür, dass deine Schleife wirklich bis zum Ende läuft."),
  hints: [tx("Two bugs. What is the second name in the list?", "Zwei Bugs. Was ist der zweite Name in der Liste?"),
          tx("And does the loop ever reach Bo?", "Und erreicht die Schleife überhaupt Bo?")],
  want: ["ANN", "?", "BO"], bugs: ["b1", "b2"],
  code: {
    py: [['names = ["ann", None, "bo"]', "n"], ["for i in range(len(names) - 1):", "b1"], ["    print(names[i].upper())", "b2"]],
    java: [['String[] names = {"ann", null, "bo"};', "n"], ["for (int i = 0; i < names.length - 1; i++) {", "b1"], ["    System.out.println(names[i].toUpperCase());", "b2"], "}"],
    js: [['const names = ["ann", null, "bo"];', "n"], ["for (let i = 0; i < names.length - 1; i++) {", "b1"], ["  console.log(names[i].toUpperCase());", "b2"], "}"]
  },
  fixes: {
    b1: [
      ok("for i in range(len(names)):", "for (int i = 0; i < names.length; i++) {", "for (let i = 0; i < names.length; i++) {"),
      no("for i in range(1, len(names)):", "for (int i = 1; i < names.length; i++) {", "for (let i = 1; i < names.length; i++) {", "Skips ann at the start instead of bo at the end.", "Überspringt ann am Anfang statt bo am Ende."),
      no("for i in range(len(names) + 1):", "for (int i = 0; i <= names.length; i++) {", "for (let i = 0; i <= names.length; i++) {", "One step past the end: there is no 4th name. Crash.", "Ein Schritt zu weit: Einen 4. Namen gibt es nicht. Absturz.")
    ],
    b2: [
      ok('print(names[i].upper() if names[i] else "?")', 'System.out.println(names[i] != null ? names[i].toUpperCase() : "?");', 'console.log(names[i] ? names[i].toUpperCase() : "?");'),
      no("print(names[i])", "System.out.println(names[i]);", "console.log(names[i]);", "No crash, but the names stay small and the empty one is printed as None / null.", "Kein Absturz, aber die Namen bleiben klein, und der leere wird als None / null gedruckt."),
      no('print("?".upper())', 'System.out.println("?".toUpperCase());', 'console.log("?".toUpperCase());', "Now every guest is a question mark. Only Nobody would be proud of that.", "Jetzt ist jeder Gast ein Fragezeichen. Darauf wäre nur Niemand stolz.")
    ]
  },
  sim(F, lang) {
    const names = ["ann", null, "bo"], n = F.has("b1") ? 3 : 2, s = [P("n", { names: arr(['"ann"', nul(lang), '"bo"'], lang) })];
    for (let i = 0; i < n; i++) {
      s.push(P("b1", { i: String(i) }));
      const v = names[i];
      if (v === null && !F.has("b2")) { s.push(crash("b2", "none", lang)); return s; }
      s.push(O("b2", v === null ? "?" : v.toUpperCase()));
    }
    s.push(P("b1", null, `${L(W.ends)}: ${n} ${L(W.rounds)}`));
    return s;
  } }
]});
