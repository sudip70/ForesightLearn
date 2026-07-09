#!/usr/bin/env node
/**
 * Fiscally web build: inline the modular source (CSS + ordered classic scripts)
 * back into a single deployable dist/fiscally-web.html.
 *
 * By default the inline is faithful (byte-preserving) so the built file behaves
 * exactly like the modular source. Pass --minify to run esbuild over the CSS/JS
 * (esbuild is an optional devDependency; if absent we fall back to faithful inline).
 *
 * The app uses global functions wired to inline onclick="" handlers, so the
 * scripts must stay classic/global — we concatenate, never ES-module-bundle.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const MINIFY = process.argv.includes("--minify");

async function loadEsbuild() {
  if (!MINIFY) return null;
  try {
    return await import("esbuild");
  } catch {
    console.warn("[build] --minify requested but esbuild is not installed; using faithful inline.");
    return null;
  }
}

async function main() {
  const esbuild = await loadEsbuild();
  const html = await readFile(resolve(ROOT, "index.html"), "utf8");

  // 1) CSS
  let css = await readFile(resolve(ROOT, "src/styles/app.css"), "utf8");
  if (esbuild) css = (await esbuild.transform(css, { loader: "css", minify: true })).code;

  // 2) JS — read every <script src> between the markers, in document order
  const scriptBlock = html.match(/<!--BUILD:SCRIPTS-->([\s\S]*?)<!--\/BUILD:SCRIPTS-->/);
  if (!scriptBlock) throw new Error("BUILD:SCRIPTS markers not found in index.html");
  const srcs = [...scriptBlock[1].matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
  if (!srcs.length) throw new Error("No <script src> tags found between markers");
  const parts = [];
  for (const src of srcs) parts.push(await readFile(resolve(ROOT, src), "utf8"));
  let js = parts.join("\n");
  if (esbuild) js = (await esbuild.transform(js, { loader: "js", minify: true })).code;

  // 3) Inline back into the shell
  // Use function replacers so `$` sequences in CSS/JS (e.g. money formatting "'$'+x")
  // are inserted literally and never treated as String.replace special patterns.
  let out = html
    .replace(
      /<!--BUILD:STYLES-->[\s\S]*?<!--\/BUILD:STYLES-->/,
      () => `<style>\n${css}\n</style>`
    )
    .replace(
      /<!--BUILD:SCRIPTS-->[\s\S]*?<!--\/BUILD:SCRIPTS-->/,
      () => `<script>\n${js}\n</script>`
    );

  // 4) Inline local images (images/*.png) as data URIs so dist stays single-file
  for (const [, src] of out.matchAll(/src="(images\/[^"]+\.png)"/g)) {
    const b64 = (await readFile(resolve(ROOT, src))).toString("base64");
    out = out.replaceAll(`src="${src}"`, () => `src="data:image/png;base64,${b64}"`);
  }

  await mkdir(resolve(ROOT, "dist"), { recursive: true });
  const outPath = resolve(ROOT, "dist/fiscally-web.html");
  await writeFile(outPath, out, "utf8");
  console.log(`[build] wrote ${outPath} (${out.length} bytes${MINIFY && esbuild ? ", minified" : ""})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
