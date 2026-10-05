// Genera los recursos gráficos de Android (íconos y splash) a partir del búho. Solo en desarrollo (usa sharp).
import * as esbuild from "esbuild";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
await esbuild.build({ entryPoints: ["src/owl/owlSvg.ts"], bundle: true, format: "esm", outfile: "/tmp/owlSvg2.mjs", logLevel: "error" });
const { owlSvg } = await import("/tmp/owlSvg2.mjs");
const owlInner = owlSvg({ mood: "smug" }).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
const BG = "#140d0f";
const svg = (w, h, owlSize, opts = {}) => {
  const x = (w - owlSize) / 2, y = (h - owlSize * 1.075) / 2 + (opts.dy || 0);
  const bg = opts.transparent ? "" : opts.round
    ? `<defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0%" stop-color="#3a1418"/><stop offset="100%" stop-color="${BG}"/></radialGradient></defs><circle cx="${w / 2}" cy="${h / 2}" r="${w / 2}" fill="url(#g)"/>`
    : `<defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0%" stop-color="#3a1418"/><stop offset="100%" stop-color="${BG}"/></radialGradient></defs><rect width="${w}" height="${h}" rx="${opts.rx || 0}" fill="url(#g)"/>`;
  const text = opts.text ? `<text x="${w / 2}" y="${y + owlSize * 1.075 + owlSize * 0.22}" text-anchor="middle" font-family="Georgia, serif" font-size="${owlSize * 0.13}" fill="#efe4d2" letter-spacing="2">Fake Duolingo</text>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bg}<g transform="translate(${x},${y}) scale(${owlSize / 200})">${owlInner}</g>${text}</svg>`;
};
const out = async (path, s) => { mkdirSync(path.split("/").slice(0, -1).join("/"), { recursive: true }); await sharp(Buffer.from(s)).png({ compressionLevel: 9 }).toFile(path); };
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, f] of Object.entries(dens)) {
  const L = Math.round(48 * f), F = Math.round(108 * f);
  await out(`android-res/mipmap-${d}/ic_launcher.png`, svg(L, L, L * 0.78, { rx: L * 0.2 }));
  await out(`android-res/mipmap-${d}/ic_launcher_round.png`, svg(L, L, L * 0.72, { round: true }));
  await out(`android-res/mipmap-${d}/ic_launcher_foreground.png`, svg(F, F, F * 0.56, { transparent: true }));
}
// splash (una imagen por orientación; Android la escala)
const port = svg(1080, 1920, 420, { text: true, dy: -60 });
const land = svg(1920, 1080, 360, { text: true, dy: -50 });
await out("android-res/drawable/splash.png", port);
for (const d of ["hdpi", "mdpi", "xhdpi", "xxhdpi", "xxxhdpi"]) {
  await out(`android-res/drawable-port-${d}/splash.png`, port);
  await out(`android-res/drawable-land-${d}/splash.png`, land);
}
console.log("android assets ok");
