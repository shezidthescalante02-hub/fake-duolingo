// Genera iconos PNG desde el SVG del búho (requiere sharp, solo en desarrollo)
import * as esbuild from "esbuild";
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
await esbuild.build({ entryPoints: ["src/owl/owlSvg.ts"], bundle: true, format: "esm", outfile: "/tmp/owlSvg.mjs", logLevel: "error" });
const { owlSvg } = await import("/tmp/owlSvg.mjs");
mkdirSync("public/icons", { recursive: true });
const owl = owlSvg({ mood: "smug", perch: false, still: true }).replace('viewBox="0 0 240 236"', 'viewBox="-10 -6 260 248"');
const bg = (size, pad, round) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><radialGradient id="g" cx="50%" cy="30%" r="80%"><stop offset="0%" stop-color="#3a1418"/><stop offset="100%" stop-color="#140d0f"/></radialGradient></defs>
  <rect width="${size}" height="${size}" rx="${round}" fill="url(#g)"/>
  <g transform="translate(${pad},${pad}) scale(${(size - 2 * pad) / 260})">${owl.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g></svg>`;
const out = async (name, size, pad, round) => { await sharp(Buffer.from(bg(size, pad, round))).png().toFile(`public/icons/${name}`); };
await out("icon-192.png", 192, 14, 40);
await out("icon-512.png", 512, 36, 110);
await out("icon-maskable-512.png", 512, 96, 0);
await out("icon-foreground-432.png", 432, 90, 0);
// fuente para el ícono de Android (adaptive icon)
writeFileSync("public/icons/owl.svg", owl);
console.log("icons ok");
