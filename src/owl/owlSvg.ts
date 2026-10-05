// Strix, el búho villano de Fake Duolingo. Diseño original en SVG puro (v2).
// Capa de cuello alto con forro carmesí, cuernos de plumas, monóculo con cadena, broche de granate
// y una pila de libros viejos como percha. Las animaciones viven en app.css (clases .o-*).

export type OwlMood = "smug" | "angry" | "happy" | "shocked" | "proud" | "soft" | "sleepy" | "thinking";

export interface OwlOptions {
  mood?: OwlMood;
  body?: string; // color principal del plumaje
  accessory?: "none" | "mortarboard" | "crown" | "scarf";
  blink?: boolean;   // (compatibilidad) el parpadeo ahora es por CSS
  perch?: boolean;   // libros bajo las garras
  still?: boolean;   // sin elementos animados extra (iconos)
}

type Pt = [number, number];
interface Face {
  lidL: [number, number]; lidR: [number, number]; // altura del párpado (0 abierto … 1 cerrado) en borde exterior / interior
  pupil: number; px: number; py: number; slit?: boolean;
  browL: [Pt, Pt]; browR: [Pt, Pt]; // [exterior, interior]
  beak: "closed" | "open" | "smirk";
  happyEyes?: boolean; glow?: boolean; tilt: number;
}

const FACES: Record<OwlMood, Face> = {
  smug: { lidL: [0.46, 0.4], lidR: [0.36, 0.3], pupil: 7, px: 3, py: 2, browL: [[66, 80], [106, 90]], browR: [[176, 72], [136, 84]], beak: "smirk", tilt: -3 },
  angry: { lidL: [0.22, 0.46], lidR: [0.22, 0.46], pupil: 4, px: 0, py: 1, slit: true, glow: true, browL: [[64, 72], [110, 96]], browR: [[176, 72], [130, 96]], beak: "open", tilt: 0 },
  happy: { lidL: [0, 0], lidR: [0, 0], pupil: 8, px: 0, py: 0, happyEyes: true, browL: [[68, 78], [104, 76]], browR: [[172, 78], [136, 76]], beak: "open", tilt: 4 },
  shocked: { lidL: [0, 0], lidR: [0, 0], pupil: 3.5, px: 0, py: -1, browL: [[70, 70], [106, 66]], browR: [[170, 70], [134, 66]], beak: "open", tilt: 0 },
  proud: { lidL: [0.44, 0.44], lidR: [0.44, 0.44], pupil: 7, px: 0, py: -2, browL: [[66, 76], [106, 82]], browR: [[174, 76], [134, 82]], beak: "smirk", tilt: -5 },
  soft: { lidL: [0.16, 0.1], lidR: [0.16, 0.1], pupil: 9.5, px: 0, py: 2, browL: [[70, 84], [104, 74]], browR: [[170, 84], [136, 74]], beak: "closed", tilt: 6 },
  sleepy: { lidL: [0.7, 0.7], lidR: [0.66, 0.66], pupil: 7, px: 0, py: 4, browL: [[68, 84], [106, 86]], browR: [[172, 84], [134, 86]], beak: "closed", tilt: 8 },
  thinking: { lidL: [0.28, 0.24], lidR: [0.5, 0.42], pupil: 6.5, px: -5, py: -5, browL: [[66, 70], [104, 76]], browR: [[174, 82], [134, 88]], beak: "closed", tilt: -7 },
};

export function owlSvg(opts: OwlOptions = {}): string {
  const mood = opts.mood && FACES[opts.mood] ? opts.mood : "smug";
  const f = FACES[mood];
  const u = "o" + Math.random().toString(36).slice(2, 8);
  const body = opts.body ?? "#8c1c2c";
  const dark = shade(body, -0.42);
  const darker = shade(body, -0.68);
  const deep = shade(body, -0.82);
  const light = shade(body, 0.18);
  const belly = mix(body, "#f3dcc4", 0.26);
  const bellyLine = shade(belly, -0.28);
  const gold = "#d9ab4a", goldD = "#8a6014", goldL = "#f6d98c";
  const perch = opts.perch ?? true;

  // ---------------------------------------------------------------- ojos
  const eye = (cx: number, cy: number, lid: [number, number], side: "L" | "R") => {
    const r = 19;
    if (f.happyEyes) {
      return `<g class="o-eye">
        <path d="M${cx - 15},${cy + 4} Q${cx},${cy - 14} ${cx + 15},${cy + 4}" stroke="${deep}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <path d="M${cx - 11},${cy + 2} Q${cx},${cy - 8} ${cx + 11},${cy + 2}" stroke="${gold}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
    }
    const outerX = side === "L" ? cx - r - 3 : cx + r + 3;
    const innerX = side === "L" ? cx + r + 3 : cx - r - 3;
    const yOuter = cy - r + lid[0] * 2 * r;
    const yInner = cy - r + lid[1] * 2 * r;
    const top = cy - r - 4;
    const px = cx + f.px * (side === "L" ? 1 : 1), py = cy + f.py;
    const pupil = f.slit
      ? `<ellipse cx="${px}" cy="${py}" rx="${f.pupil * 0.7}" ry="${f.pupil * 2.3}" fill="#120306"/>`
      : `<circle cx="${px}" cy="${py}" r="${f.pupil}" fill="#120306"/>`;
    return `<g class="o-eye">
      <clipPath id="c${side}${u}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <circle cx="${cx}" cy="${cy}" r="${r + 3.5}" fill="${deep}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#iris${u})"/>
      <g clip-path="url(#c${side}${u})">
        <g class="o-pupil">${pupil}
          <circle cx="${px + 5}" cy="${py - 5}" r="3" fill="#fff" opacity=".92"/>
          <circle cx="${px - 4}" cy="${py + 5}" r="1.3" fill="#fff" opacity=".55"/>
        </g>
        <path d="M${outerX},${top} L${innerX},${top} L${innerX},${yInner} Q${cx},${(yOuter + yInner) / 2 + 2.5} ${outerX},${yOuter} Z" fill="${dark}"/>
        <path d="M${innerX},${yInner} Q${cx},${(yOuter + yInner) / 2 + 2.5} ${outerX},${yOuter}" stroke="${deep}" stroke-width="2.6" fill="none"/>
${opts.still ? "" : `        <rect class="o-blink" style="transform-box:fill-box;transform-origin:50% 0;transform:scaleY(0)" x="${cx - r - 2}" y="${cy - r - 2}" width="${2 * r + 4}" height="${2 * r + 4}" fill="${dark}"/>`}
      </g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${deep}" stroke-width="2"/>
    </g>`;
  };

  const brow = ([o, i]: [Pt, Pt]) => {
    // cuña de plumas: delgada afuera, gruesa adentro
    const dx = i[0] - o[0], dy = i[1] - o[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const s = ny > 0 ? -1 : 1; // normal hacia arriba
    const to = 2.2, ti = 6.5;
    const p1: Pt = [o[0] + nx * to * s, o[1] + ny * to * s], p2: Pt = [i[0] + nx * ti * s, i[1] + ny * ti * s];
    const p3: Pt = [i[0] - nx * ti * 0.6 * s, i[1] - ny * ti * 0.6 * s], p4: Pt = [o[0] - nx * to * 0.4 * s, o[1] - ny * to * 0.4 * s];
    return `<path class="o-brow" d="M${p1} L${p2} L${p3} L${p4} Z" fill="${deep}" stroke="${deep}" stroke-width="2.5" stroke-linejoin="round"/>`;
  };

  // ---------------------------------------------------------------- pico
  const beak =
    f.beak === "open"
      ? `<g class="o-beak"><path d="M110,121 Q120,114 130,121 L126,130 Q120,134 114,130 Z" fill="url(#gold${u})" stroke="${goldD}" stroke-width="1.4"/>
         <path class="o-jaw" d="M114,131 Q120,146 126,131 Q120,136 114,131 Z" fill="#3a0910" stroke="${goldD}" stroke-width="1.2"/></g>`
      : f.beak === "smirk"
        ? `<g class="o-beak"><path d="M110,121 Q120,114 130,121 Q128,134 121,145 Q119,147 118,144 Q112,133 110,121 Z" fill="url(#gold${u})" stroke="${goldD}" stroke-width="1.4"/>
           <path d="M124,131 Q129,133 133,130" stroke="${goldD}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`
        : `<g class="o-beak"><path d="M110,121 Q120,114 130,121 Q128,134 121,145 Q119,147 118,144 Q112,133 110,121 Z" fill="url(#gold${u})" stroke="${goldD}" stroke-width="1.4"/></g>`;

  // ---------------------------------------------------------------- plumas del pecho (escamas)
  const scales: string[] = [];
  for (let row = 0; row < 5; row++) {
    const y = 160 + row * 11;
    const w = 70 - Math.abs(row - 1.5) * 9;
    const n = Math.max(3, Math.round(w / 13));
    for (let c = 0; c < n; c++) {
      const x = 120 - w / 2 + (c + (row % 2 ? 0.5 : 0)) * (w / n);
      scales.push(`<path d="M${(x - 5).toFixed(1)},${y} q5,6 10,0" stroke="${bellyLine}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".55"/>`);
    }
  }

  // ---------------------------------------------------------------- accesorios
  let acc = "";
  if (opts.accessory === "mortarboard") {
    acc = `<g class="o-acc"><path d="M74,52 L120,34 L166,52 L120,70 Z" fill="#17111a" stroke="#000" stroke-width="1.5"/>
      <path d="M96,58 L96,72 Q120,82 144,72 L144,58" fill="#17111a"/>
      <path d="M120,52 L158,58 L160,80" stroke="${gold}" stroke-width="2" fill="none"/><circle cx="160" cy="83" r="4" fill="${gold}"/></g>`;
  } else if (opts.accessory === "crown") {
    acc = `<g class="o-acc" transform="rotate(-8 120 50)"><path d="M92,66 L94,40 L106,54 L120,32 L134,54 L146,40 L148,66 Z" fill="url(#gold${u})" stroke="${goldD}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="120" cy="52" r="4" fill="#b3283c"/><circle cx="104" cy="60" r="2.4" fill="#2f6b4f"/><circle cx="136" cy="60" r="2.4" fill="#2f6b4f"/></g>`;
  } else if (opts.accessory === "scarf") {
    acc = `<g class="o-acc"><path d="M66,146 Q120,170 174,146 L176,160 Q120,186 64,160 Z" fill="#1f3b30"/>
      <path d="M70,152 Q120,174 170,152" stroke="${gold}" stroke-width="3" fill="none"/><path d="M68,158 Q120,180 172,158" stroke="#7a1f2b" stroke-width="2" fill="none"/>
      <path d="M140,164 L150,210 L134,206 Z" fill="#1f3b30"/><path d="M141,176 L147,204" stroke="${gold}" stroke-width="2.5"/></g>`;
  }

  // ---------------------------------------------------------------- extras de humor
  let extra = "";
  if (!opts.still) {
    if (mood === "sleepy") extra = `<g class="o-zzz" fill="${goldL}" font-family="Georgia,serif" font-weight="700"><text x="176" y="58" font-size="18">z</text><text x="190" y="40" font-size="13">z</text><text x="200" y="26" font-size="9">z</text></g>`;
    if (mood === "shocked") extra = `<path class="o-sweat" d="M58,76 Q52,88 58,92 Q64,88 58,76 Z" fill="#9fc6e8" opacity=".9"/>`;
    if (mood === "proud" || mood === "happy") extra = `<g class="o-spark" fill="${goldL}"><path d="M194,64 l3,8 8,3 -8,3 -3,8 -3,-8 -8,-3 8,-3z"/><path d="M42,58 l2,5 5,2 -5,2 -2,5 -2,-5 -5,-2 5,-2z"/></g>`;
    if (mood === "angry") extra = `<g class="o-steam" stroke="${shade(body, 0.35)}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"><path d="M40,50 q-6,-8 0,-16 q6,-8 0,-16"/><path d="M200,50 q6,-8 0,-16 q-6,-8 0,-16"/></g>`;
    if (mood === "thinking") extra = `<g class="o-dots" fill="${goldL}"><circle cx="186" cy="60" r="3"/><circle cx="198" cy="48" r="4"/><circle cx="212" cy="32" r="5.5"/></g>`;
  }

  const books = perch
    ? `<g class="o-books">
        <rect x="34" y="236" width="172" height="20" rx="3" fill="#20342b"/>
        <rect x="34" y="236" width="172" height="5" rx="2" fill="#2c463a"/>
        <path d="M48,236 v20 M60,236 v20 M180,236 v20 M192,236 v20" stroke="${gold}" stroke-width="2" opacity=".75"/>
        <rect x="200" y="238" width="5" height="16" fill="#e9dcc0" opacity=".8"/>
        <rect x="52" y="218" width="144" height="19" rx="3" fill="#4b2418"/>
        <rect x="52" y="218" width="144" height="4" rx="2" fill="#5e3020"/>
        <path d="M66,218 v19 M182,218 v19" stroke="${gold}" stroke-width="2" opacity=".8"/>
        <rect x="104" y="223" width="40" height="9" rx="1.5" fill="none" stroke="${gold}" stroke-width="1.2" opacity=".7"/>
        <path d="M54,221 h-0 M190,220 h4 v15 h-4" stroke="#e9dcc0" stroke-width="2" fill="none" opacity=".6"/>
      </g>`
    : "";

  const tuft = (s: 1 | -1) => {
    const X = (x: number) => (s === 1 ? x : 240 - x);
    return `<g class="o-tuft o-tuft${s === 1 ? "L" : "R"}">
      <path d="M${X(80)},76 C${X(72)},56 ${X(60)},34 ${X(48)},10 C${X(70)},24 ${X(92)},44 ${X(104)},66 Z" fill="${dark}"/>
      <path d="M${X(82)},70 C${X(76)},54 ${X(66)},38 ${X(58)},22 C${X(74)},34 ${X(88)},48 ${X(98)},64 Z" fill="${body}" opacity=".75"/>
      <path d="M${X(84)},66 C${X(78)},52 ${X(70)},40 ${X(64)},30" stroke="${deep}" stroke-width="1.4" fill="none" opacity=".6"/>
    </g>`;
  };

  return `<svg viewBox="0 0 240 ${perch ? 260 : 236}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Strix, el búho">
  <defs>
    <radialGradient id="bodyG${u}" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="${light}"/><stop offset="55%" stop-color="${body}"/><stop offset="100%" stop-color="${darker}"/>
    </radialGradient>
    <radialGradient id="iris${u}" cx="50%" cy="42%" r="62%">
      ${f.glow ? `<stop offset="0%" stop-color="#ffe08a"/><stop offset="45%" stop-color="#ff6a2a"/><stop offset="100%" stop-color="#a3121e"/>`
      : `<stop offset="0%" stop-color="#ffe9a3"/><stop offset="55%" stop-color="#e7a531"/><stop offset="100%" stop-color="#9b5a0c"/>`}
    </radialGradient>
    <linearGradient id="gold${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${goldL}"/><stop offset="100%" stop-color="#b9862a"/></linearGradient>
    <linearGradient id="lining${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${shade(body, 0.05)}"/><stop offset="100%" stop-color="${darker}"/></linearGradient>
    <radialGradient id="bellyG${u}" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="${belly}" stop-opacity=".75"/><stop offset="100%" stop-color="${belly}" stop-opacity=".25"/></radialGradient>
    <radialGradient id="disc${u}" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="${shade(body, -0.12)}"/><stop offset="100%" stop-color="${shade(body, -0.34)}"/></radialGradient>
  </defs>
  ${books}
  <g class="o-all">
    <g class="o-cape">
      <path d="M58,168 C40,140 26,98 18,52 C48,74 70,100 84,130 Z" fill="${deep}"/>
      <path d="M182,168 C200,140 214,98 222,52 C192,74 170,100 156,130 Z" fill="${deep}"/>
      <path d="M58,160 C44,134 34,104 28,70 C50,90 66,110 78,132 Z" fill="url(#lining${u})"/>
      <path d="M182,160 C196,134 206,104 212,70 C190,90 174,110 162,132 Z" fill="url(#lining${u})"/>
      <path d="M18,52 C26,98 40,140 58,168 M222,52 C214,98 200,140 182,168" stroke="${gold}" stroke-width="1.6" fill="none" opacity=".85"/>
    </g>
    <g class="o-body">
      <path d="M120,54 C170,54 192,96 192,144 C192,196 160,230 120,230 C80,230 48,196 48,144 C48,96 70,54 120,54 Z" fill="url(#bodyG${u})"/>
      <ellipse cx="120" cy="184" rx="46" ry="46" fill="url(#bellyG${u})"/>
      <path d="M70,92 C80,72 100,62 120,60" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".12"/>
      ${scales.join("")}
      <g class="o-wingL"><path d="M54,118 C36,156 42,200 82,228 C72,200 70,164 80,130 Z" fill="${dark}"/>
        <path d="M52,150 C50,176 58,196 72,212 M58,136 C56,164 62,186 76,204" stroke="${deep}" stroke-width="1.6" fill="none" opacity=".7"/></g>
      <g class="o-wingR"><path d="M186,118 C204,156 198,200 158,228 C168,200 170,164 160,130 Z" fill="${dark}"/>
        <path d="M188,150 C190,176 182,196 168,212 M182,136 C184,164 178,186 164,204" stroke="${deep}" stroke-width="1.6" fill="none" opacity=".7"/></g>
      <g class="o-feet" fill="url(#gold${u})" stroke="${goldD}" stroke-width="1.2">
        <path d="M92,222 q-4,8 -1,12 q3,-2 4,-8z"/><path d="M100,224 q-1,9 2,12 q3,-3 2,-10z"/><path d="M108,222 q2,8 6,11 q1,-4 -2,-9z"/>
        <path d="M148,222 q4,8 1,12 q-3,-2 -4,-8z"/><path d="M140,224 q1,9 -2,12 q-3,-3 -2,-10z"/><path d="M132,222 q-2,8 -6,11 q-1,-4 2,-9z"/>
      </g>
    </g>
    <g class="o-head" style="transform-origin:120px 150px"><g transform="rotate(${f.tilt * 0.45} 120 150)">
      ${tuft(1)}${tuft(-1)}
      <path d="M120,92 C104,72 62,72 58,104 C54,138 92,150 120,134 C148,150 186,138 182,104 C178,72 136,72 120,92 Z" fill="url(#disc${u})"/>
      <path d="M120,92 C104,72 62,72 58,104 C54,138 92,150 120,134 C148,150 186,138 182,104 C178,72 136,72 120,92 Z" fill="none" stroke="${deep}" stroke-width="2" opacity=".7"/>
      ${eye(94, 106, f.lidL, "L")}
      ${eye(146, 106, f.lidR, "R")}
      ${brow(f.browL)}${brow(f.browR)}
      <g class="o-monocle">
        <circle cx="146" cy="106" r="24" fill="#fff" fill-opacity=".05" stroke="url(#gold${u})" stroke-width="3.2"/>
        <path class="o-glint" d="M132,96 Q138,88 148,86" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".55"/>
        <path d="M168,116 Q186,148 170,176" stroke="${gold}" stroke-width="1.5" fill="none" stroke-dasharray="3 2.6"/>
      </g>
      ${beak}
    </g></g>
    ${acc}
  </g>
  ${extra}
</svg>`;
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  r = f(r); g = f(g); b = f(b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = (s: number) => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return "#" + ((1 << 24) + (c(16) << 16) + (c(8) << 8) + c(0)).toString(16).slice(1);
}
