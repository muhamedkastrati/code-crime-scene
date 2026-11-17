// Builds index.html (one self-contained page) from src/. Run: node tools/build.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), rd = f => fs.readFileSync(path.join(root, f), "utf8");
const list = dir => fs.readdirSync(path.join(root, dir)).filter(f => f.endsWith(".js")).sort().map(f => dir + "/" + f);
const js = [...list("src/js").filter(f => !f.endsWith("07-engine.js")), ...list("src/cases"), "src/js/07-engine.js"].map(rd).join("\n");
const icon = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="#ffd23f" stroke="#17161f" stroke-width="2.6"/><path d="M15 15l6 6" stroke="#17161f" stroke-width="3.2" stroke-linecap="round"/></svg>');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Code Crime Scene</title>
<meta name="description" content="A comic-detective debugging game: 50 coding crime scenes in Python, Java and JavaScript, from Beginner to IMPOSSIBLE.">
<link rel="icon" href="${icon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap">
<style>
${rd("src/style.css")}</style>
</head>
<body>
<div class="wrap">
  <header class="top" id="top"></header>
  <main id="app"></main>
</div>
<script>
(() => {
"use strict";
${js}
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, "index.html"), html);
console.log("index.html built:", (html.length / 1024).toFixed(0), "KB");
