/**
 * Produce genuine browser screenshots and locally hosted demos from selected
 * existing source projects. Screenshots are not generated artwork.
 *
 * Run on GitHub Actions after installing Playwright Chromium.
 */
import { spawn, spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import { resolve, join } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const site = join(root, "site");
const targets = [
  { id: 1, dir: "1/jack-portfolio", slug: "jack-portfolio" },
  { id: 3, dir: "3/prisma-landing", slug: "prisma-landing" },
  { id: 20, dir: "21", slug: "axion-studio" },
  { id: 22, dir: "22", slug: "wanderful" },
  { id: 28, dir: "29", slug: "foundation" },
];
await fs.mkdir(join(site, "previews"), { recursive: true });
await fs.mkdir(join(site, "demos"), { recursive: true });

function command(cmd, args, cwd) {
  const run = spawnSync(cmd, args, { cwd, stdio: "inherit", timeout: 180_000, env: { ...process.env, CI: "true" } });
  if (run.error) throw run.error;
  if (run.status !== 0) throw Error(cmd + " exited with " + run.status);
}
async function waitFor(url, ms = 18000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try { const res = await fetch(url); if (res.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 350));
  }
  throw Error("Local preview not ready: " + url);
}

const server = spawn("python3", ["-m", "http.server", "4189", "--bind", "127.0.0.1", "--directory", site], { cwd: root, stdio: "ignore" });
let browser;
const captured = [];
try {
  await waitFor("http://127.0.0.1:4189/");
  browser = await chromium.launch({ headless: true });
  for (const target of targets) {
    const project = join(root, target.dir);
    const output = join(site, "demos", target.slug);
    console.log("\n=== Capturing real project:", target.dir, "===\n");
    try {
      // There are no committed lockfiles in this repository. The CI runner is
      // ephemeral, and project install/build failures do not affect other demos.
      command("npm", ["install", "--ignore-scripts", "--no-fund", "--no-audit"], project);
      command(process.execPath, [join(project, "node_modules/vite/bin/vite.js"), "build", "--base=./"], project);
      await fs.rm(output, { force: true, recursive: true });
      await fs.cp(join(project, "dist"), output, { recursive: true });

      const url = "http://127.0.0.1:4189/demos/" + target.slug + "/";
      await waitFor(url);
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.waitForTimeout(3000);
        const text = await page.locator("body").innerText().catch(() => "");
        if (text.trim().length < 10) throw Error("Page appears empty — screenshot not published.");
        const screenshot = join(site, "previews", target.slug + ".webp");
        await page.screenshot({ path: screenshot, type: "webp", quality: 84 });
        const file = await fs.stat(screenshot);
        if (file.size < 8000) throw Error("Screenshot unexpectedly small.");
        captured.push({
          id: target.id,
          image: "previews/" + target.slug + ".webp",
          demo: "demos/" + target.slug + "/",
        });
        console.log("Captured:", target.slug, file.size, "bytes; body characters:", text.trim().length);
      } finally {
        await page.close();
      }
    } catch (e) {
      console.warn("Skipped project", target.dir, "due to:", String(e));
      await fs.rm(output, { force: true, recursive: true });
    }
  }
} finally {
  if (browser) await browser.close();
  server.kill();
}
await fs.writeFile(join(site, "previews", "manifest.json"), JSON.stringify({ captures: captured }, null, 2) + "\n");
console.log("Captured", captured.length, "real project screenshots out of", targets.length, "candidates.");
if (captured.length === 0) process.exitCode = 1;
