import { defineConfig, type Plugin } from "vite";
import { fileURLToPath, URL } from "node:url";
import { readFileSync } from "node:fs";

// Soft password gate for the shared prototype link. Client-side only (GitHub Pages is static, so the
// built assets remain publicly fetchable) — a deterrent for casual visitors, not real access control.
// The same snippet is injected into the frozen c-v1/c-v2 snapshots by scripts/inject-gate.mjs.
function passwordGate(): Plugin {
  const snippet = readFileSync(fileURLToPath(new URL("./scripts/gate-snippet.html", import.meta.url)), "utf8").trim();
  return {
    name: "password-gate",
    transformIndexHtml(html) {
      return html.includes("<!--du-gate-->") ? html : html.replace("</head>", `${snippet}\n  </head>`);
    },
  };
}

// Root-level Vite app. The design system (tokens/tokens.css + tokens/cx-fonts.css)
// and self-hosted Merchant fonts (tokens/fonts/merchant/) are imported from src/main.ts;
// Vite rewrites the relative font url()s in tokens.css, so the fonts resolve without moving them.
// `base` defaults to "/" (local dev, Vercel served at root). GitHub Pages serves under a repo
// subpath, so the Pages workflow sets BASE_PATH=/doc-upload/ to prefix built asset URLs.
const shared = fileURLToPath(new URL("./src/shared", import.meta.url));

// Multi-page: "/" home selector, "/a/" Option A, "/b/" Option B, "/loans/document-center/" the
// Document Center entry point. Shared primitives via @shared/*.
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [passwordGate()],
  resolve: { alias: { "@shared": shared } },
  server: { open: false },
  build: {
    outDir: "dist",
    target: "es2022",
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("./index.html", import.meta.url)),
        a: fileURLToPath(new URL("./a/index.html", import.meta.url)),
        b: fileURLToPath(new URL("./b/index.html", import.meta.url)),
        c: fileURLToPath(new URL("./c/index.html", import.meta.url)),
        docCenter: fileURLToPath(new URL("./loans/document-center/index.html", import.meta.url)),
      },
    },
  },
});
