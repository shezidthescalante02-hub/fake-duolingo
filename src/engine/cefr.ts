// Escala interna 0–100 alineada con subniveles CEFR.
// No es una escala oficial: es una escala de progreso para la app.
export interface Band { code: string; min: number; label: string }

export const BANDS: Band[] = [
  { code: "B1", min: 0, label: "B1 o inferior" },
  { code: "B1+", min: 32, label: "B1+" },
  { code: "B2-", min: 38, label: "B2 bajo" },
  { code: "B2", min: 43, label: "B2" },
  { code: "B2+", min: 49, label: "B2 alto" },
  { code: "C1-", min: 55, label: "C1 inicial" },
  { code: "C1", min: 60, label: "C1" },
  { code: "C1+", min: 66, label: "C1 alto" },
  { code: "C2-", min: 72, label: "C2 inicial" },
  { code: "C2", min: 78, label: "C2" },
  { code: "C2+", min: 85, label: "C2 sólido" },
  { code: "C2★", min: 92, label: "C2 experto" },
];

export function band(score: number): Band {
  let b = BANDS[0];
  for (const x of BANDS) if (score >= x.min) b = x;
  return b;
}

export function bandProgress(score: number): { band: Band; next?: Band; pct: number } {
  const i = BANDS.findIndex((b) => b === band(score));
  const cur = BANDS[i];
  const next = BANDS[i + 1];
  if (!next) return { band: cur, pct: Math.min(100, ((score - cur.min) / (100 - cur.min)) * 100) };
  return { band: cur, next, pct: Math.max(0, Math.min(100, ((score - cur.min) / (next.min - cur.min)) * 100)) };
}

export function cefrMajor(score: number): string {
  if (score >= 72) return "C2";
  if (score >= 55) return "C1";
  if (score >= 38) return "B2";
  return "B1";
}

// Nivel de dificultad de un ítem a texto
export function lvlLabel(lvl: number) { return band(lvl).code; }

// Etiqueta "inconsistente" cuando la incertidumbre es alta
export function rangeLabel(score: number, sd: number): string {
  const lo = band(score - sd).code, hi = band(score + sd).code;
  return lo === hi ? lo : `${lo}/${hi}`;
}

// Equivalencias aproximadas (orientativas) con escalas de examen.
// Basadas en las tablas públicas CEFR de cada organismo; son estimaciones, no puntajes oficiales.
export function examEstimate(score: number) {
  const s = Math.max(0, Math.min(100, score));
  // IELTS: B2≈5.5–6.5, C1≈7.0–8.0, C2≈8.5–9.0
  const ielts = s < 38 ? 5.0 : s < 43 ? 5.5 : s < 49 ? 6.0 : s < 55 ? 6.5 : s < 60 ? 7.0 : s < 66 ? 7.5 : s < 72 ? 8.0 : s < 85 ? 8.5 : 9.0;
  // TOEFL iBT (escala 1–6 desde enero de 2026): B2≈4–4.5, C1≈5–5.5, C2≈6
  const toefl = s < 38 ? 3.5 : s < 46 ? 4.0 : s < 55 ? 4.5 : s < 62 ? 5.0 : s < 72 ? 5.5 : 6.0;
  // Cambridge English Scale: B2 160–179, C1 180–199, C2 200–230
  const ces = Math.round(s < 38 ? 150 + (s / 38) * 10 : s < 55 ? 160 + ((s - 38) / 17) * 20 : s < 72 ? 180 + ((s - 55) / 17) * 20 : 200 + ((s - 72) / 28) * 30);
  return { ielts, toefl, ces };
}

export function cesToGrade(ces: number, exam: "cae" | "cpe"): string {
  if (exam === "cae") {
    if (ces >= 200) return "Grade A (C2)";
    if (ces >= 193) return "Grade B (C1)";
    if (ces >= 180) return "Grade C (C1)";
    if (ces >= 160) return "B2 level certificate";
    return "Below B2";
  }
  if (ces >= 220) return "Grade A (C2)";
  if (ces >= 213) return "Grade B (C2)";
  if (ces >= 200) return "Grade C (C2)";
  if (ces >= 180) return "C1 level certificate";
  return "Below C1";
}
