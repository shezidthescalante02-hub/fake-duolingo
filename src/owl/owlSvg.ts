// Strix, el búho villano de Fake Duolingo. Diseño original (SVG puro).
// Cuernos de plumas, capa de cuello alto, monóculo dorado, cejas peligrosas.

export type OwlMood = "smug" | "angry" | "happy" | "shocked" | "proud" | "soft" | "sleepy" | "thinking";

export interface OwlOptions {
  mood?: OwlMood;
  body?: string; // color principal
  accessory?: "none" | "mortarboard" | "crown" | "scarf";
  blink?: boolean;
}

export function owlSvg(opts: OwlOptions = {}): string {
  const mood = opts.mood ?? "smug";
  const u = "o" + Math.random().toString(36).slice(2, 8);
  const body = opts.body ?? "#8c1c2c";
  const dark = shade(body, -0.38);
  const darker = shade(body, -0.62);
  const light = shade(body, 0.22);
  const gold = "#d8a640";
  const parchment = "#f3e5c6";

  // ---- ojos: posición de pupila, párpado (0 = abierto, 1 = cerrado), tamaño de pupila
  let lidL = 0.12, lidR = 0.12, pup = 6, pupDx = 0, pupDy = 1;
  let browL = "M50,70 L93,84", browR = "M150,70 L107,84"; // V enojada por defecto
  let beak = "closed";
  let eyesClosedHappy = false;
  switch (mood) {
    case "smug":
      lidL = 0.42; lidR = 0.3; pupDx = 2;
      browL = "M50,72 L93,84"; browR = "M108,78 Q130,62 152,66";
      break;
    case "angry":
      lidL = 0.32; lidR = 0.32; pup = 5;
      browL = "M48,66 L95,88"; browR = "M152,66 L105,88";
      break;
    case "happy":
      eyesClosedHappy = true;
      browL = "M54,70 Q72,62 92,72"; browR = "M146,70 Q128,62 108,72";
      beak = "open";
      break;
    case "shocked":
      lidL = 0; lidR = 0; pup = 3.5; pupDy = 0;
      browL = "M52,62 Q72,50 92,62"; browR = "M148,62 Q128,50 108,62";
      beak = "open";
      break;
    case "proud":
      lidL = 0.38; lidR = 0.38; pupDy = -1;
      browL = "M52,70 Q72,64 93,78"; browR = "M148,70 Q128,64 107,78";
      break;
    case "soft":
      lidL = 0.18; lidR = 0.18; pup = 7;
      browL = "M54,78 Q72,66 92,70"; browR = "M146,78 Q128,66 108,70";
      break;
    case "sleepy":
      lidL = 0.68; lidR = 0.68;
      browL = "M54,76 L92,80"; browR = "M146,76 L108,80";
      break;
    case "thinking":
      lidL = 0.25; lidR = 0.4; pupDx = -4; pupDy = -4;
      browL = "M52,70 Q72,60 92,70"; browR = "M150,74 L107,82";
      break;
  }
  if (opts.blink) { lidL = 1; lidR = 1; eyesClosedHappy = false; }

  const eye = (cx: number, cy: number, lid: number, id: string) => {
    if (eyesClosedHappy) {
      return `<path d="M${cx - 15},${cy + 3} Q${cx},${cy - 13} ${cx + 15},${cy + 3}" stroke="${darker}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    }
    const r = 21;
    const lidY = cy - r + lid * 2 * r;
    return `
    <clipPath id="clip${id}${u}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${parchment}"/>
    <circle cx="${cx + pupDx}" cy="${cy + pupDy}" r="12.5" fill="url(#iris${u})"/>
    <circle cx="${cx + pupDx}" cy="${cy + pupDy}" r="${pup}" fill="#14060a"/>
    <circle cx="${cx + pupDx + 4}" cy="${cy + pupDy - 4}" r="2.6" fill="#fff" opacity="0.9"/>
    <g clip-path="url(#clip${id}${u})">
      <rect x="${cx - r - 2}" y="${cy - r - 2}" width="${2 * r + 4}" height="${lidY - (cy - r) + 2}" fill="${dark}"/>
      <line x1="${cx - r}" y1="${lidY}" x2="${cx + r}" y2="${lidY}" stroke="${darker}" stroke-width="2.5"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${darker}" stroke-width="2.5"/>`;
  };

  const beakSvg =
    beak === "open"
      ? `<path d="M91,110 L100,106 L109,110 L104,121 Q100,127 96,121 Z" fill="${gold}" stroke="#7a5212" stroke-width="1.6"/>
         <path d="M95,116 L105,116 L100,124 Z" fill="#3a0a10"/>`
      : `<path d="M91,108 Q100,102 109,108 L103,124 Q100,131 97,124 Z" fill="${gold}" stroke="#7a5212" stroke-width="1.6"/>
         <path d="M100,124 Q101,130 97,131" stroke="#7a5212" stroke-width="1.4" fill="none"/>`;

  let acc = "";
  if (opts.accessory === "mortarboard") {
    acc = `<g><path d="M60,40 L100,24 L140,40 L100,56 Z" fill="#141014" stroke="#000" stroke-width="1.5"/>
      <rect x="82" y="44" width="36" height="14" rx="3" fill="#141014"/>
      <path d="M100,40 L134,46 L136,64" stroke="${gold}" stroke-width="2" fill="none"/>
      <circle cx="136" cy="66" r="3.5" fill="${gold}"/></g>`;
  } else if (opts.accessory === "crown") {
    acc = `<path d="M74,52 L78,30 L90,44 L100,24 L110,44 L122,30 L126,52 Z" fill="${gold}" stroke="#7a5212" stroke-width="2"/>
      <circle cx="100" cy="40" r="3" fill="#b3283c"/>`;
  } else if (opts.accessory === "scarf") {
    acc = `<path d="M54,140 Q100,160 146,140 L146,152 Q100,172 54,152 Z" fill="#1d3a2f"/>
      <path d="M120,150 L128,190 L114,188 Z" fill="#1d3a2f"/>
      <path d="M60,146 Q100,163 140,146" stroke="${gold}" stroke-width="2" fill="none"/>`;
  }

  const chevrons: string[] = [];
  for (let row = 0; row < 3; row++) {
    for (let c = 0; c < 3 - (row === 2 ? 1 : 0); c++) {
      const x = 80 + c * 14 + (row === 2 ? 7 : 0) + (row === 1 ? 0 : 0);
      const y = 148 + row * 13;
      chevrons.push(`<path d="M${x},${y} l6,5 l6,-5" stroke="${dark}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.75"/>`);
    }
  }

  return `<svg viewBox="0 0 200 215" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Strix, el búho">
  <defs>
    <radialGradient id="bodyG${u}" cx="45%" cy="35%" r="75%">
      <stop offset="0%" stop-color="${light}"/>
      <stop offset="60%" stop-color="${body}"/>
      <stop offset="100%" stop-color="${dark}"/>
    </radialGradient>
    <radialGradient id="iris${u}" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#ffd76a"/>
      <stop offset="70%" stop-color="#e09a26"/>
      <stop offset="100%" stop-color="#a5620e"/>
    </radialGradient>
  </defs>
  <!-- capa de cuello alto -->
  <path d="M40,128 L24,58 L74,94 Z" fill="${darker}"/>
  <path d="M160,128 L176,58 L126,94 Z" fill="${darker}"/>
  <!-- cuernos de plumas -->
  <path d="M56,74 L40,14 L86,58 Z" fill="${dark}"/>
  <path d="M144,74 L160,14 L114,58 Z" fill="${dark}"/>
  <path d="M58,66 L47,28 L76,58 Z" fill="${body}" opacity="0.6"/>
  <path d="M142,66 L153,28 L124,58 Z" fill="${body}" opacity="0.6"/>
  <!-- cuerpo -->
  <ellipse cx="100" cy="128" rx="64" ry="76" fill="url(#bodyG${u})"/>
  <!-- pecho -->
  <ellipse cx="100" cy="162" rx="36" ry="36" fill="${light}" opacity="0.55"/>
  ${chevrons.join("")}
  <!-- alas -->
  <path d="M38,112 Q24,168 66,200 Q52,160 60,118 Z" fill="${dark}"/>
  <path d="M162,112 Q176,168 134,200 Q148,160 140,118 Z" fill="${dark}"/>
  <path d="M44,140 Q42,170 60,190" stroke="${darker}" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M156,140 Q158,170 140,190" stroke="${darker}" stroke-width="2" fill="none" opacity="0.7"/>
  <!-- disco facial -->
  <path d="M100,80 C84,64 46,70 48,102 C50,128 82,132 100,120 C118,132 150,128 152,102 C154,70 116,64 100,80 Z" fill="${dark}" opacity="0.85"/>
  ${eye(76, 100, lidL, "L")}
  ${eye(124, 100, lidR, "R")}
  <!-- cejas -->
  <path d="${browL}" stroke="${darker}" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="${browR}" stroke="${darker}" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- monóculo -->
  <circle cx="124" cy="100" r="24.5" fill="#ffffff" fill-opacity="0.05" stroke="${gold}" stroke-width="3"/>
  <path d="M145,112 Q166,146 146,176" stroke="${gold}" stroke-width="1.6" fill="none" stroke-dasharray="3 2.5"/>
  ${beakSvg}
  <!-- garras -->
  <g fill="${gold}" stroke="#7a5212" stroke-width="1.2">
    <ellipse cx="80" cy="203" rx="5" ry="4"/><ellipse cx="89" cy="205" rx="5" ry="4"/>
    <ellipse cx="111" cy="205" rx="5" ry="4"/><ellipse cx="120" cy="203" rx="5" ry="4"/>
  </g>
  ${acc}
</svg>`;
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  r = f(r); g = f(g); b = f(b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
