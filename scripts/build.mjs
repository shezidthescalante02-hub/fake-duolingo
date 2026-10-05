// Compila la app a dist/ con esbuild (sin dependencias extra).
// node scripts/build.mjs           -> build de producción
// node scripts/build.mjs --serve   -> servidor local en http://localhost:5173
import * as esbuild from "esbuild";
import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const serve = process.argv.includes("--serve");
const out = "dist";
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync("public", out, { recursive: true });

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const buildId = new Date().toISOString();

const opts = {
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: !serve,
  sourcemap: serve,
  format: "esm",
  target: ["es2020", "chrome100"],
  outfile: join(out, "app.js"),
  jsx: "automatic",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __BUILD_ID__: JSON.stringify(buildId),
    "process.env.NODE_ENV": JSON.stringify(serve ? "development" : "production"),
  },
  logLevel: "info",
};

// index.html y service worker con la lista de archivos a precargar
function listFiles(dir, base = dir) {
  const res = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) res.push(...listFiles(p, base));
    else res.push(p.slice(base.length + 1).replace(/\\/g, "/"));
  }
  return res;
}

function writeShell() {
  const html = readFileSync("src/index.html", "utf8").replace("%BUILD%", buildId);
  writeFileSync(join(out, "index.html"), html);
  const files = listFiles(out).filter((f) => !f.startsWith("dict/") && f !== "sw.js");
  const sw = readFileSync("src/sw.js", "utf8")
    .replace("__PRECACHE__", JSON.stringify(["./", ...files]))
    .replace("__VERSION__", buildId);
  writeFileSync(join(out, "sw.js"), sw);
}

if (serve) {
  const ctx = await esbuild.context(opts);
  await ctx.rebuild();
  writeShell();
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: out, port: 5173 });
  console.log(`Servidor: http://localhost:${port}`);
} else {
  await esbuild.build(opts);
  writeShell();
  console.log("Build OK ->", out);
}
