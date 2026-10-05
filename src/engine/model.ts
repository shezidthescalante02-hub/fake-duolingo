// Modelo de la estudiante: habilidades (tipo Rasch/Elo), etiquetas (temas), trampas,
// cambios de respuesta (sobreanálisis) y clasificación de errores.
import { db, uid } from "../db/db";
import type { SkillId, Trap } from "../content/types";

export const SKILLS: { id: SkillId; name: string; group: "core" | "lang" | "academic" | "exam" }[] = [
  { id: "reading", name: "Reading", group: "core" },
  { id: "listening", name: "Listening", group: "core" },
  { id: "speaking", name: "Speaking", group: "core" },
  { id: "writing", name: "Writing", group: "core" },
  { id: "grammar", name: "Grammar", group: "lang" },
  { id: "vocabulary", name: "General vocabulary", group: "lang" },
  { id: "academicVocab", name: "Academic vocabulary", group: "academic" },
  { id: "academicWriting", name: "Academic writing", group: "academic" },
  { id: "useOfEnglish", name: "Use of English", group: "lang" },
  { id: "comprehension", name: "Comprehension", group: "core" },
  { id: "inference", name: "Inference", group: "core" },
  { id: "pronunciation", name: "Pronunciation", group: "lang" },
  { id: "fluency", name: "Fluency", group: "lang" },
  { id: "strategy", name: "Exam strategy", group: "exam" },
  { id: "pressure", name: "Performance under pressure", group: "exam" },
  { id: "timeMgmt", name: "Time management", group: "exam" },
  { id: "overthinking", name: "Overthinking control", group: "exam" },
];

export interface Ability { theta: number; n: number; tTheta: number; tN: number; uTheta: number; uN: number; last: number }
export interface TagState {
  n: number; c: number;
  recent: number[];        // 1 = correcto, 0 = incorrecto (últimos 12)
  tN: number; tC: number;  // con tiempo (presión)
  uN: number; uC: number;  // sin tiempo
  last: number;
  // repaso espaciado del tema
  due: number; ivl: number; ease: number; reps: number;
  learned: boolean;        // ya se enseñó la lección
  prodN: number; prodOk: number; // producción (comprende vs produce)
}
export interface TrapState { seen: number; fell: number }
export interface Changes { cc: number; cw: number; wc: number; ww: number; newEvidence: number; doubt: number }
export interface ErrorCauses { gap: number; slip: number; overthink: number; pressure: number; distraction: number; misread: number; strategy: number }

export interface Model {
  skills: Record<string, Ability>;
  tags: Record<string, TagState>;
  traps: Record<string, TrapState>;
  changes: Changes;
  causes: ErrorCauses;
  diagnosed: boolean;
  diagnosedAt?: number;
  flags: Record<string, number>; // inconsistencias detectadas por habilidad (para re-verificar)
}

const SCALE = 7; // puntos de la escala por logit

export function emptyModel(): Model {
  const skills: Record<string, Ability> = {};
  for (const s of SKILLS) skills[s.id] = { theta: 55, n: 0, tTheta: 55, tN: 0, uTheta: 55, uN: 0, last: 0 };
  return {
    skills, tags: {}, traps: {},
    changes: { cc: 0, cw: 0, wc: 0, ww: 0, newEvidence: 0, doubt: 0 },
    causes: { gap: 0, slip: 0, overthink: 0, pressure: 0, distraction: 0, misread: 0, strategy: 0 },
    diagnosed: false, flags: {},
  };
}

export function pCorrect(theta: number, lvl: number) {
  return 1 / (1 + Math.exp(-(theta - lvl) / SCALE));
}

function kFactor(n: number) {
  return Math.max(1.6, 14 / Math.sqrt(n + 1));
}

export function sdOf(a: Ability) {
  return 3 + 22 / Math.sqrt(a.n + 1);
}

// Relación etiqueta -> habilidades secundarias
export function skillsForTag(tag: string): SkillId[] {
  const [ns, name] = tag.split(":");
  const out: SkillId[] = [];
  if (ns === "gram") out.push("grammar");
  if (ns === "uoe") out.push("useOfEnglish");
  if (ns === "voc") out.push("vocabulary");
  if (ns === "avoc") out.push("academicVocab");
  if (ns === "acad") out.push("academicWriting");
  if (ns === "rd") { out.push("reading"); if (name === "inference" || name === "attitude" || name === "purpose") out.push("inference"); else out.push("comprehension"); }
  if (ns === "ls") { out.push("listening"); if (name === "inference" || name === "attitude" || name === "purpose") out.push("inference"); else out.push("comprehension"); }
  if (ns === "strat") out.push("strategy");
  if (ns === "pron") out.push("pronunciation");
  return out;
}

export interface AttemptInput {
  itemId: string;
  skill: SkillId;
  tags: string[];
  lvl: number;
  correct: boolean;
  score?: number;          // 0–1 para producción o crédito parcial
  timed: boolean;
  timeMs: number;
  limitMs?: number;
  first?: number | string; // primera elección
  final?: number | string;
  changes?: number;        // número de cambios de respuesta
  firstCorrect?: boolean;
  trap?: Trap | null;      // trampa en la que cayó (si aplica)
  trapsSeen?: Trap[];
  confidence?: "sure" | "unsure" | "guess";
  selfTag?: string;        // causa declarada por la usuaria
  changeReason?: "evidence" | "doubt";
  mode: string;            // practice | diagnostic | sim | review | session
  produce?: boolean;       // tarea de producción
  exam?: string;
  observed?: number;       // nivel observado directamente (0–100) en escritura/speaking
}

export interface Attempt extends AttemptInput { id: string; at: number; cause?: keyof ErrorCauses | null }

function updAbility(a: Ability, lvl: number, x: number, timed: boolean) {
  const p = pCorrect(a.theta, lvl);
  const k = kFactor(a.n);
  a.theta = clamp(a.theta + k * (x - p), 5, 99);
  a.n += 1;
  if (timed) {
    const pt = pCorrect(a.tTheta, lvl);
    a.tTheta = clamp(a.tTheta + kFactor(a.tN) * (x - pt), 5, 99); a.tN++;
  } else {
    const pu = pCorrect(a.uTheta, lvl);
    a.uTheta = clamp(a.uTheta + kFactor(a.uN) * (x - pu), 5, 99); a.uN++;
  }
  a.last = Date.now();
}

export function tagState(m: Model, tag: string): TagState {
  if (!m.tags[tag]) m.tags[tag] = { n: 0, c: 0, recent: [], tN: 0, tC: 0, uN: 0, uC: 0, last: 0, due: 0, ivl: 0, ease: 2.4, reps: 0, learned: false, prodN: 0, prodOk: 0 };
  return m.tags[tag];
}

// Clasifica la causa probable de un error: ¿no lo sabía o lo sabía pero falló?
export function classifyError(m: Model, a: AttemptInput): keyof ErrorCauses | null {
  if (a.correct) return null;
  if (a.selfTag === "didnt-know") return "gap";
  if (a.selfTag === "overthought") return "overthink";
  if (a.selfTag === "rushed") return a.timed ? "pressure" : "slip";
  if (a.selfTag === "distracted") return "distraction";
  if (a.selfTag === "misread") return "misread";
  if (a.firstCorrect && (a.changes ?? 0) > 0) return "overthink";
  // evidencia previa de dominio del tema
  let known = 0, total = 0;
  for (const t of a.tags) {
    const s = m.tags[t];
    if (!s || s.n < 3) continue;
    total++;
    const acc = s.uN >= 2 ? s.uC / s.uN : s.c / s.n;
    if (acc >= 0.8) known++;
  }
  const knowsIt = total > 0 && known / total >= 0.5;
  if (a.trap && m.traps[a.trap] && m.traps[a.trap].fell >= 2) return "strategy";
  if (knowsIt && a.timed) return "pressure";
  if (knowsIt) return "slip";
  if (a.confidence === "sure") return "gap"; // concepto erróneo firme
  return "gap";
}

function updObserved(a: Ability, observed: number, timed: boolean) {
  const w = Math.max(0.12, Math.min(0.5, 2 / (a.n + 3)));
  a.theta = clamp(a.theta + (observed - a.theta) * w, 5, 99); a.n += 1;
  if (timed) { a.tTheta = clamp(a.tTheta + (observed - a.tTheta) * w, 5, 99); a.tN++; }
  else { a.uTheta = clamp(a.uTheta + (observed - a.uTheta) * w, 5, 99); a.uN++; }
  a.last = Date.now();
}

export function applyAttempt(m: Model, a: AttemptInput): Attempt {
  const x = a.score ?? (a.correct ? 1 : 0);
  const cause = classifyError(m, a);
  if (a.observed !== undefined) updObserved(m.skills[a.skill], a.observed, a.timed);
  else updAbility(m.skills[a.skill], a.lvl, x, a.timed);
  const secondary = new Set<SkillId>();
  for (const t of a.tags) for (const s of skillsForTag(t)) if (s !== a.skill) secondary.add(s);
  for (const s of secondary) if (m.skills[s] && a.observed === undefined) {
    const ab = m.skills[s];
    const p = pCorrect(ab.theta, a.lvl);
    ab.theta = clamp(ab.theta + kFactor(ab.n) * 0.5 * (x - p), 5, 99); ab.n += 0.5; ab.last = Date.now();
  }
  for (const t of a.tags) {
    const s = tagState(m, t);
    s.n++; if (x >= 0.6) s.c++;
    s.recent.push(x >= 0.6 ? 1 : 0); if (s.recent.length > 12) s.recent.shift();
    if (a.timed) { s.tN++; if (x >= 0.6) s.tC++; } else { s.uN++; if (x >= 0.6) s.uC++; }
    if (a.produce) { s.prodN++; if (x >= 0.6) s.prodOk++; }
    s.last = Date.now();
    scheduleTag(s, x >= 0.6, a.confidence);
  }
  // trampas
  for (const tr of a.trapsSeen ?? []) { m.traps[tr] = m.traps[tr] || { seen: 0, fell: 0 }; m.traps[tr].seen++; }
  if (a.trap) { m.traps[a.trap] = m.traps[a.trap] || { seen: 0, fell: 0 }; m.traps[a.trap].fell++; }
  // cambios de respuesta
  if ((a.changes ?? 0) > 0 && a.firstCorrect !== undefined) {
    if (a.firstCorrect && a.correct) m.changes.cc++;
    else if (a.firstCorrect && !a.correct) m.changes.cw++;
    else if (!a.firstCorrect && a.correct) m.changes.wc++;
    else m.changes.ww++;
    if (a.changeReason === "evidence") m.changes.newEvidence++;
    if (a.changeReason === "doubt") m.changes.doubt++;
    // control de sobreanálisis como habilidad
    const ov = m.skills.overthinking;
    const ox = a.firstCorrect && !a.correct ? 0 : !a.firstCorrect && a.correct ? 1 : 0.6;
    updAbility(ov, a.lvl, ox, a.timed);
  }
  if (cause) m.causes[cause]++;
  // presión y gestión del tiempo
  if (a.timed) {
    updAbility(m.skills.pressure, a.lvl, x, true);
    if (a.limitMs) {
      const used = a.timeMs / a.limitMs;
      const tx = used <= 1 ? (x >= 0.6 ? 1 : 0.5) : 0;
      updAbility(m.skills.timeMgmt, a.lvl, tx, true);
    }
  }
  return { ...a, id: uid("a"), at: Date.now(), cause };
}

// Repaso espaciado de temas (SM-2 simplificado)
export function scheduleTag(s: TagState, ok: boolean, conf?: string) {
  const day = 86400000;
  if (!ok) { s.reps = 0; s.ivl = 0.5; s.ease = Math.max(1.3, s.ease - 0.2); }
  else {
    s.reps++;
    const q = conf === "guess" ? 3 : conf === "unsure" ? 4 : 5;
    s.ease = Math.max(1.3, s.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    s.ivl = s.reps === 1 ? 1 : s.reps === 2 ? 3 : Math.round(s.ivl * s.ease);
  }
  s.due = Date.now() + s.ivl * day;
}

export function tagStatus(s: TagState): "new" | "weak" | "learning" | "solid" | "mastered" {
  if (s.n === 0) return "new";
  const r = s.recent.length ? s.recent.reduce((a, b) => a + b, 0) / s.recent.length : 0;
  if (s.n >= 3 && r < 0.6) return "weak";
  if (s.n >= 8 && r >= 0.9 && s.reps >= 3) return "mastered";
  if (s.n >= 4 && r >= 0.8) return "solid";
  return "learning";
}

export function errorPattern(s: TagState): "none" | "occasional" | "recurrent" | "pressure" {
  const last8 = s.recent.slice(-8);
  const errs = last8.filter((x) => x === 0).length;
  if (s.tN >= 3 && s.uN >= 3 && s.uC / s.uN - s.tC / s.tN >= 0.2) return "pressure";
  if (errs >= 3) return "recurrent";
  if (errs >= 1) return "occasional";
  return "none";
}

// Diferencia comprensión vs producción en un tema
export function receptiveVsProductive(s: TagState) {
  const rec = s.n - s.prodN > 0 ? (s.c - s.prodOk) / (s.n - s.prodN) : null;
  const prod = s.prodN > 0 ? s.prodOk / s.prodN : null;
  return { rec, prod, gap: rec !== null && prod !== null && rec - prod >= 0.25 };
}

export function overall(m: Model): number {
  const core = ["reading", "listening", "speaking", "writing", "grammar", "vocabulary", "academicVocab", "useOfEnglish"];
  const w: Record<string, number> = { reading: 1.2, listening: 1.2, speaking: 1.1, writing: 1.3, grammar: 0.9, vocabulary: 0.8, academicVocab: 0.8, useOfEnglish: 0.8 };
  let s = 0, ws = 0;
  for (const k of core) { const a = m.skills[k]; if (!a || a.n < 1) continue; s += a.theta * w[k]; ws += w[k]; }
  return ws ? s / ws : 55;
}

// Brecha de presión: diferencia media entre desempeño sin tiempo y con tiempo
export function pressureGap(m: Model): number | null {
  let s = 0, n = 0;
  for (const k of Object.keys(m.skills)) {
    const a = m.skills[k];
    if (a.tN >= 4 && a.uN >= 4 && !["pressure", "timeMgmt", "overthinking"].includes(k)) { s += a.uTheta - a.tTheta; n++; }
  }
  return n ? s / n : null;
}

export function overthinkIndex(m: Model): { rate: number | null; harmful: number; helpful: number; total: number } {
  const c = m.changes;
  const total = c.cc + c.cw + c.wc + c.ww;
  return { rate: total ? c.cw / total : null, harmful: c.cw, helpful: c.wc, total };
}

export function clamp(x: number, a: number, b: number) { return Math.max(a, Math.min(b, x)); }

// Persistencia del modelo
export async function loadModel(): Promise<Model> {
  const m = await db.kvGet<Model | null>("model", null);
  if (!m) return emptyModel();
  const base = emptyModel();
  for (const s of SKILLS) if (!m.skills[s.id]) m.skills[s.id] = base.skills[s.id];
  m.changes = { ...base.changes, ...(m.changes || {}) };
  m.causes = { ...base.causes, ...(m.causes || {}) };
  m.flags = m.flags || {};
  return m;
}
export function saveModel(m: Model) { return db.kvSet("model", m); }

// Instantánea para el historial
export async function snapshot(m: Model) {
  const day = new Date().toISOString().slice(0, 10);
  const skills: Record<string, number> = {};
  for (const k of Object.keys(m.skills)) skills[k] = Math.round(m.skills[k].theta * 10) / 10;
  await db.put("history", { id: day, day, overall: Math.round(overall(m) * 10) / 10, skills });
}
