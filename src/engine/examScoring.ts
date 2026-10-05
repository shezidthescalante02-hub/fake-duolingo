// Conversión aproximada de resultados de simulación a escalas de examen.
// Las tablas oficiales no son públicas en su totalidad; se usan aproximaciones razonables y se etiquetan como tales.
import type { ExamPart } from "../content/exams/types";
import { examEstimate } from "./cefr";
import { parseCTest } from "./evaluate";
import type { Item } from "../content/types";

// Un C-test cuenta como tantos ítems como huecos tiene (TOEFL: 10 palabras por texto)
export function itemWeight(it: Item): number {
  return it.kind === "ctest" ? parseCTest(it.text).filter((x) => x.t === "gap").length : 1;
}

export function partItemCount(p: ExamPart): number {
  if (p.kind === "items") return (p.items || []).reduce((a, it) => a + itemWeight(it), 0);
  if (p.kind === "reading") return p.reading?.questions.length || 0;
  if (p.kind === "listening") return (p.listening || []).reduce((a, s) => a + s.questions.length, 0);
  return 0;
}

export function toeflBand(p: number): number {
  const t: [number, number][] = [[0.95, 6], [0.88, 5.5], [0.8, 5], [0.7, 4.5], [0.6, 4], [0.5, 3.5], [0.4, 3], [0.3, 2.5], [0.2, 2], [0.1, 1.5]];
  for (const [min, b] of t) if (p >= min) return b;
  return 1;
}
export function toeflBandFromLevel(lvl: number): number {
  // nivel 0–100 de la app → banda TOEFL aproximada (C2 ≈ 6, C1 ≈ 5–5.5, B2 ≈ 4–4.5)
  if (lvl >= 78) return 6; if (lvl >= 70) return 5.5; if (lvl >= 60) return 5; if (lvl >= 52) return 4.5; if (lvl >= 43) return 4; if (lvl >= 36) return 3.5; if (lvl >= 30) return 3; return 2.5;
}
export function roundHalf(x: number) { return Math.round(x * 2) / 2; }

export function ieltsRawBand(correct: number, total: number): number {
  const raw = Math.round((correct / Math.max(1, total)) * 40);
  const t: [number, number][] = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]];
  for (const [min, b] of t) if (raw >= min) return b;
  return 2;
}
export function ieltsBandFromLevel(lvl: number) { return examEstimate(lvl).ielts; }
export function ieltsOverall(bands: number[]): number {
  const avg = bands.reduce((a, b) => a + b, 0) / bands.length;
  // IELTS redondea al medio punto más cercano (.25 sube a .5, .75 sube al entero)
  return Math.floor(avg * 2 + 0.5) / 2;
}

export function cesFromProportion(p: number, exam: "cae" | "cpe"): number {
  const pts = exam === "cae"
    ? [[0, 122], [0.45, 160], [0.6, 180], [0.8, 200], [1, 210]]
    : [[0, 142], [0.45, 180], [0.6, 200], [0.8, 220], [1, 230]];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    if (p <= x1) return Math.round(y0 + ((p - x0) / (x1 - x0)) * (y1 - y0));
  }
  return pts[pts.length - 1][1];
}
export function cesFromLevel(lvl: number, exam: "cae" | "cpe"): number {
  const c = examEstimate(lvl).ces;
  return exam === "cae" ? Math.max(122, Math.min(210, c)) : Math.max(142, Math.min(230, c));
}
