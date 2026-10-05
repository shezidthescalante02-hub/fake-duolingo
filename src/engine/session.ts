// Generador de sesiones: "Tengo 10 minutos" -> una sesión con propósito pedagógico.
import type { Item, Lesson, ReadingSet, ListeningSet, SpeakingTask } from "../content/types";
import { ALL_LESSONS, READINGS, LISTENING_SETS, itemsForTag, standaloneItems, SPEAKING_TASKS } from "../content/index";
import type { Model } from "./model";
import { tagState, tagStatus, errorPattern } from "./model";
import { diff, type DiffId } from "./difficulty";
import { db } from "../db/db";
import { isDue, vstate, type VocabEntry } from "./vocab";
import type { Settings } from "../state";
import { generateMixed, generate, modeForTag } from "./generator";

export type Activity =
  | { k: "teach"; lesson: Lesson; reason: string }
  | { k: "item"; item: Item; reason: string }
  | { k: "vocab"; word: VocabEntry; mode: "recog" | "prod"; reason: string }
  | { k: "reading"; set: ReadingSet; reason: string }
  | { k: "listening"; set: ListeningSet; reason: string }
  | { k: "useWords"; words: VocabEntry[]; reason: string }
  | { k: "speaking"; task: SpeakingTask; reason: string };

const COST: Record<string, number> = { teach: 120, item: 40, vocab: 18, reading: 540, listening: 420, useWords: 300, speaking: 180 };
export function activityCost(a: Activity): number {
  if (a.k === "item") {
    const k = a.item.kind;
    return k === "produce" ? 300 : k === "kwt" ? 70 : k === "ctest" ? 150 : k === "match" || k === "sort" ? 60 : k === "dictation" || k === "fix" ? 55 : 40;
  }
  return COST[a.k];
}

export async function recentItemIds(days = 4): Promise<Set<string>> {
  const since = Date.now() - days * 86400000;
  const all = await db.all<any>("attempts");
  return new Set(all.filter((a) => a.at >= since).map((a) => a.itemId));
}

export function pickItems(pool: Item[], n: number, target: number, exclude: Set<string>, opts: { trapBias?: number; inferenceBias?: number; noProduce?: boolean } = {}): Item[] {
  const scored = pool
    .filter((it) => !exclude.has(it.id) && !(opts.noProduce && it.kind === "produce"))
    .map((it) => {
      let s = -Math.abs(it.lvl - target) + Math.random() * 6;
      if (opts.trapBias && it.kind === "mcq" && (it as any).traps?.some(Boolean)) s += 4 * opts.trapBias;
      if (opts.inferenceBias && it.tags.some((t) => /inference|attitude|purpose/.test(t))) s += 4 * opts.inferenceBias;
      return { it, s };
    })
    .sort((a, b) => b.s - a.s);
  const out: Item[] = [];
  for (const { it } of scored) { if (out.length >= n) break; out.push(it); exclude.add(it.id); }
  return out;
}

export async function buildSession(opts: { minutes: number | null; diffId: DiffId; model: Model; settings: Settings; focus?: string; seen?: Set<string> }): Promise<Activity[]> {
  const { model, settings } = opts;
  const d = diff(opts.diffId);
  const budget = (opts.minutes ?? 20) * 60;
  let used = 0;
  const acts: Activity[] = [];
  const push = (a: Activity) => { acts.push(a); used += activityCost(a); };
  const left = () => budget - used;
  const exclude = await recentItemIds(3);
  for (const id of opts.seen || []) exclude.add(id);
  const theta = (skill: string) => (model.skills[skill]?.theta ?? 55) + d.lvlOffset;
  const skip = settings.skip;

  // Foco explícito (desde el dashboard o un reto)
  if (opts.focus) {
    const pool = itemsForTag(opts.focus).filter((it) => it.kind !== "produce" || !skip.writing);
    const sk = pool[0]?.skill || "grammar";
    const want = Math.max(4, Math.floor(budget / 45));
    for (const it of pickItems(pool, want, theta(sk), exclude, { trapBias: d.trapBias })) push({ k: "item", item: it, reason: "Foco elegido" });
    if (acts.length < want) { // banco agotado: repasar ítems ya vistos del mismo tema
      const again = pickItems(pool.filter((it) => !acts.some((a) => a.k === "item" && a.item.id === it.id) && !(opts.seen?.has(it.id))), want - acts.length, theta(sk), new Set());
      for (const it of again) push({ k: "item", item: it, reason: "Repaso del tema" });
    }
    const m = modeForTag(opts.focus);
    if (m && acts.length < want) for (const it of await generate(m, want - acts.length, theta(sk), { accents: settings.accents })) push({ k: "item", item: it, reason: "Ejercicio nuevo generado" });
    return acts;
  }

  // 1) Vocabulario pendiente (repaso espaciado)
  const vocab = (await db.all<VocabEntry>("vocab")).filter((v) => !v.archived);
  const dueR = vocab.filter((v) => isDue(v.recog)).sort((a, b) => a.recog.due - b.recog.due);
  const dueP = vocab.filter((v) => ["recognized", "familiar", "active", "mastered"].includes(vstate(v)) && isDue(v.prod)).sort((a, b) => a.prod.due - b.prod.due);
  const vocabBudget = budget * 0.25;
  let vb = 0;
  for (const w of dueP) { if (vb > vocabBudget / 2) break; push({ k: "vocab", word: w, mode: "prod", reason: "Repaso: producción" }); vb += 18; }
  for (const w of dueR) { if (vb > vocabBudget) break; if (acts.some((a) => a.k === "vocab" && a.word.id === w.id)) continue; push({ k: "vocab", word: w, mode: "recog", reason: "Repaso espaciado" }); vb += 18; }

  // 2) Temas que tocan repaso (en contexto distinto)
  const dueTags = Object.entries(model.tags).filter(([t, s]) => s.learned && s.due <= Date.now() && itemsForTag(t).length).sort((a, b) => a[1].due - b[1].due);
  for (const [t] of dueTags.slice(0, Math.max(1, Math.floor(budget / 300)))) {
    if (left() < 60) break;
    const pool = itemsForTag(t).filter((it) => !(skip.writing && it.kind === "produce"));
    for (const it of pickItems(pool, 2, theta(pool[0]?.skill || "grammar") + 3, exclude, { trapBias: d.trapBias, noProduce: left() < 400 })) push({ k: "item", item: it, reason: "Repaso en otro contexto" });
  }

  // 3) Verificación de resultados extraños del diagnóstico
  for (const sk of Object.keys(model.flags || {})) {
    if (left() < 90) break;
    const pool = standaloneItems().filter((it) => it.skill === sk);
    for (const it of pickItems(pool, 2, theta(sk), exclude, { noProduce: true })) push({ k: "item", item: it, reason: "Verificando tu perfil" });
  }

  // 4) Temas débiles / errores recurrentes
  const weak = Object.entries(model.tags).filter(([, s]) => tagStatus(s) === "weak" || errorPattern(s) === "recurrent").map(([t]) => t);
  for (const t of weak.slice(0, 3)) {
    if (left() < 120) break;
    const pool = itemsForTag(t);
    for (const it of pickItems(pool, 2, theta(pool[0]?.skill || "grammar") - 2, exclude, { trapBias: d.trapBias, noProduce: true })) push({ k: "item", item: it, reason: "Error recurrente: refuerzo" });
  }

  // 5) Contenido nuevo: enseñar → ejemplos → comprobar → producir
  if (left() >= 300) {
    const candidates = ALL_LESSONS.filter((l) => !tagState(model, l.tag).learned && !(l.module === "pron" && skip.pronunciation))
      .map((l) => ({ l, s: -Math.abs(l.lvl - (theta(l.items[0]?.skill || "grammar") - d.lvlOffset)) + Math.random() * 8 }))
      .sort((a, b) => b.s - a.s);
    const lesson = candidates[0]?.l;
    if (lesson) {
      push({ k: "teach", lesson, reason: "Contenido nuevo" });
      const n = Math.min(4, Math.max(2, Math.floor(left() / 90)));
      const pool = lesson.items.filter((it) => !(skip.writing && it.kind === "produce"));
      // comprobar primero (reconocimiento), producir al final
      const rec = pickItems(pool.filter((it) => it.kind !== "produce"), n - 1, lesson.lvl, exclude);
      const prodPool = pool.filter((it) => it.kind === "produce" || it.kind === "kwt" || it.kind === "gap");
      const prod = pickItems(prodPool, 1, lesson.lvl + 2, exclude);
      for (const it of [...rec, ...prod]) push({ k: "item", item: it, reason: "Practicar lo nuevo" });
    }
  }

  // 6) Producción obligatoria con vocabulario reciente
  const recent = vocab.filter((v) => ["new", "learning", "recognized", "familiar"].includes(vstate(v))).sort((a, b) => b.addedAt - a.addedAt).slice(0, 8);
  if (!skip.writing && left() >= 280 && recent.length >= 2) push({ k: "useWords", words: recent.slice(0, Math.max(d.mustUse + 1, 3)), reason: "Usar vocabulario nuevo" });

  // 7) Reading / Listening / Speaking según tiempo
  if (!skip.reading && left() >= 480) {
    const seen = await db.kvGet<string[]>("readSets", []);
    const pool = READINGS.filter((r) => !seen.includes(r.id));
    const cand = (pool.length ? pool : READINGS).map((r) => ({ r, s: -Math.abs(r.lvl - theta("reading")) + Math.random() * 6 })).sort((a, b) => b.s - a.s)[0];
    if (cand) push({ k: "reading", set: cand.r, reason: "Lectura a tu nivel" });
  }
  if (!skip.listening && left() >= 400) {
    const seen = await db.kvGet<string[]>("listenSets", []);
    const pool = LISTENING_SETS.filter((r) => !seen.includes(r.id));
    const cand = (pool.length ? pool : LISTENING_SETS).map((r) => ({ r, s: -Math.abs(r.lvl - theta("listening")) + Math.random() * 6 })).sort((a, b) => b.s - a.s)[0];
    if (cand) push({ k: "listening", set: cand.r, reason: "Listening a tu nivel" });
  }
  if (!skip.speaking && left() >= 200 && Math.random() < 0.6) {
    const pool = SPEAKING_TASKS.filter((t) => t.type !== "repeat");
    const t = pool.map((x) => ({ x, s: -Math.abs(x.lvl - theta("speaking")) + Math.random() * 10 })).sort((a, b) => b.s - a.s)[0]?.x;
    if (t) push({ k: "speaking", task: t, reason: "Speaking" });
  }

  // 8) Completar con práctica mixta a tu nivel
  if (left() > 40) {
    const n = Math.floor(left() / 40);
    const pool = standaloneItems().filter((it) => it.kind !== "produce" && !(skip.pronunciation && it.skill === "pronunciation"));
    const byLowest = ["grammar", "useOfEnglish", "academicWriting", "strategy"].sort((a, b) => (model.skills[a]?.theta ?? 55) - (model.skills[b]?.theta ?? 55));
    const mixed = pickItems(pool.filter((it) => byLowest.slice(0, 2).includes(it.skill) || Math.random() < 0.35), n, theta(byLowest[0]), exclude, { trapBias: d.trapBias, inferenceBias: d.inferenceBias });
    for (const it of mixed) push({ k: "item", item: it, reason: "Práctica a tu nivel" });
    // ejercicios generados: siempre una parte (variedad) y todo lo que falte si el banco se agotó
    const want = Math.max(Math.round(n * 0.3), n - mixed.length);
    if (want > 0) {
      const gen = await generateMixed(want, theta("vocabulary"), { listening: skip.listening, pronunciation: skip.pronunciation, reading: skip.reading }, settings.accents);
      for (const it of gen) { if (exclude.has(it.id)) continue; exclude.add(it.id); push({ k: "item", item: it, reason: "Ejercicio nuevo generado" }); }
    }
  }
  // red de seguridad: una sesión nunca queda vacía
  if (acts.length < 3) {
    const gen = await generateMixed(8, theta("vocabulary"), { listening: skip.listening, pronunciation: skip.pronunciation, reading: skip.reading }, settings.accents);
    for (const it of gen) push({ k: "item", item: it, reason: "Ejercicio nuevo generado" });
  }

  // Intercalar: no más de 6 ítems seguidos del mismo tipo; vocabulario repartido
  return interleave(spreadGenerated(acts));
}

// reparte los ejercicios generados entre el resto para que haya variedad de formato
function spreadGenerated(acts: Activity[]): Activity[] {
  const gen = acts.filter((a) => a.k === "item" && a.item.id.startsWith("g-"));
  if (!gen.length) return acts;
  const rest = acts.filter((a) => !(a.k === "item" && a.item.id.startsWith("g-")));
  if (!rest.length) return gen;
  const out: Activity[] = [];
  const every = Math.max(1, Math.floor(rest.length / (gen.length + 1)));
  let g = 0;
  rest.forEach((a, i) => { out.push(a); if ((i + 1) % every === 0 && g < gen.length) out.push(gen[g++]); });
  while (g < gen.length) out.push(gen[g++]);
  return out;
}

function interleave(acts: Activity[]): Activity[] {
  const vocab = acts.filter((a) => a.k === "vocab");
  const rest = acts.filter((a) => a.k !== "vocab");
  const out: Activity[] = [];
  const step = rest.length ? Math.max(1, Math.ceil(vocab.length / Math.max(1, Math.ceil(rest.length / 3)))) : vocab.length;
  let vi = 0;
  // empieza con algunas tarjetas (calentamiento)
  for (let i = 0; i < Math.min(3, vocab.length); i++) out.push(vocab[vi++]);
  for (let i = 0; i < rest.length; i++) {
    out.push(rest[i]);
    if ((i + 1) % 3 === 0) for (let j = 0; j < step && vi < vocab.length; j++) out.push(vocab[vi++]);
  }
  while (vi < vocab.length) out.push(vocab[vi++]);
  return out;
}
