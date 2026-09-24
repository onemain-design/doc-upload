// Inject the soft password gate into the frozen static snapshots (public/c-v1, public/c-v2), which
// are shipped verbatim and never rebuilt — the Vite plugin only gates freshly built source pages.
// Idempotent: skips any HTML that already carries the <!--du-gate--> marker.
// Usage: node scripts/inject-gate.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const snippet = readFileSync(join(root, "scripts/gate-snippet.html"), "utf8").trim();
const targets = ["public/c-v1", "public/c-v2"].map((p) => join(root, p));

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

let injected = 0;
let skipped = 0;
for (const base of targets) {
  for (const file of htmlFiles(base)) {
    const html = readFileSync(file, "utf8");
    if (html.includes("<!--du-gate-->")) {
      skipped += 1;
      continue;
    }
    writeFileSync(file, html.replace("</head>", `${snippet}\n  </head>`));
    injected += 1;
    console.log("gated", file.replace(root + "/", ""));
  }
}
console.log(`done: ${injected} injected, ${skipped} already gated`);
