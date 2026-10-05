// Vocabulario personal: dos tarjetas por palabra (reconocer / producir) y estados de dominio.
import { db } from "../db/db";
import type { VocabSeed } from "../content/types";
import { lookup, type DictEntry } from "../services/dictionary";

export type VState = "new" | "learning" | "recognized" | "familiar" | "active" | "mastered";
export const VSTATES: { id: VState; name: string; desc: string }[] = [
  { id: "new", name: "New", desc: "Recién agregada" },
  { id: "learning", name: "Learning", desc: "En estudio" },
  { id: "recognized", name: "Recognized", desc: "La reconoces en contexto" },
  { id: "familiar", name: "Familiar", desc: "Reconocimiento estable en el tiempo" },
  { id: "active", name: "Active", desc: "La produces correctamente" },
  { id: "mastered", name: "Mastered", desc: "La usas con precisión de forma espontánea" },
];

export interface Card { due: number; ivl: number; ease: number; reps: number; lapses: number; last: number }
export function newCard(): Card { return { due: Date.now(), ivl: 0, ease: 2.5, reps: 0, lapses: 0, last: 0 } }

export interface VocabEntry {
  id: string;             // palabra en minúsculas
  w: string;
  pos?: string;
  def?: string;
  defs?: { pos: string; def: string; ex: string[] }[];
  ipa?: string; ipaUS?: string;
  ex?: string; ex2?: string;
  col?: string[]; fam?: string[]; syn?: string[]; ant?: string[];
  tags: string[];
  reg?: string; es?: string; note?: string; err?: string; lvl?: string; pre?: string;
  zipf?: number;
  ctx?: string;           // oración donde la encontraste
  source?: string;        // módulo de origen
  addedAt: number;
  archived: boolean;      // retirada de la lista activa (no se borra)
  recog: Card;
  prod: Card;
  uses: number;           // usos correctos en producción libre
  lookups: number;
  shouldKnow?: boolean;   // "Words I should probably know"
  custom?: boolean;
}

const DAY = 86400000;

// grade: 0 = otra vez, 1 = difícil, 2 = bien, 3 = fácil
export function review(c: Card, grade: 0 | 1 | 2 | 3): Card {
  const n = { ...c, last: Date.now() };
  if (grade === 0) {
    n.lapses++; n.reps = 0; n.ivl = 0; n.ease = Math.max(1.3, n.ease - 0.2);
    n.due = Date.now() + 10 * 60000; // 10 min
    return n;
  }
  n.reps++;
  if (n.reps === 1) n.ivl = grade === 3 ? 3 : 1;
  else if (n.reps === 2) n.ivl = grade === 1 ? 2 : grade === 3 ? 7 : 4;
  else n.ivl = Math.round(n.ivl * (grade === 1 ? 1.2 : grade === 3 ? n.ease * 1.3 : n.ease));
  n.ease = Math.max(1.3, n.ease + (grade === 1 ? -0.15 : grade === 3 ? 0.12 : 0));
  // pequeña variación para no acumular repasos el mismo día
  n.due = Date.now() + n.ivl * DAY * (0.92 + Math.random() * 0.16);
  return n;
}

export function vstate(e: VocabEntry): VState {
  const r = e.recog, p = e.prod;
  if (p.reps >= 2 && p.ivl >= 21 && e.uses >= 2) return "mastered";
  if (p.reps >= 2) return "active";
  if (r.reps >= 2 && r.ivl >= 7) return "familiar";
  if (r.reps >= 2) return "recognized";
  if (r.reps >= 1 || r.lapses > 0 || p.reps > 0) return "learning";
  return "new";
}

export function isDue(c: Card) { return c.due <= Date.now(); }

export async function getVocab(): Promise<VocabEntry[]> { return db.all<VocabEntry>("vocab"); }

export function fromSeed(s: VocabSeed): Partial<VocabEntry> {
  return { w: s.w, pos: s.pos, def: s.def, ex: s.ex, ex2: s.ex2, col: s.col, fam: s.fam, syn: s.syn, ant: s.ant, tags: s.tags, reg: s.reg, es: s.es, note: s.note, err: s.err, lvl: s.lvl, pre: s.pre };
}

export function fromDict(d: DictEntry): Partial<VocabEntry> {
  const first = d.senses[0];
  return {
    w: d.word, pos: first?.pos, def: first?.def, defs: d.senses.slice(0, 5).map((s) => ({ pos: s.pos, def: s.def, ex: s.ex })),
    ipa: d.ipaGB || d.ipaUS || d.ipaCMU, ipaUS: d.ipaUS || d.ipaCMU, syn: d.syn, ant: d.ant, fam: d.fam, zipf: d.zipf,
    es: d.es?.slice(0, 4).join(", "), lvl: d.cefr,
  };
}

// Agregar palabra (desde cualquier ejercicio)
export async function addWord(word: string, opts: { ctx?: string; source?: string; seed?: VocabSeed; tags?: string[]; shouldKnow?: boolean } = {}): Promise<VocabEntry> {
  const id = word.toLowerCase().trim();
  const existing = await db.get<VocabEntry>("vocab", id);
  if (existing) {
    if (existing.archived) existing.archived = false;
    if (opts.ctx && !existing.ctx) existing.ctx = opts.ctx;
    existing.lookups++;
    await db.put("vocab", existing);
    return existing;
  }
  const d = await lookup(id);
  const base: VocabEntry = {
    id, w: word.trim(), tags: [], addedAt: Date.now(), archived: false, recog: newCard(), prod: newCard(), uses: 0, lookups: 1,
  };
  const merged: VocabEntry = { ...base, ...(d ? fromDict(d) : {}), ...(opts.seed ? stripUndef(fromSeed(opts.seed)) : {}) } as VocabEntry;
  merged.tags = Array.from(new Set([...(merged.tags || []), ...(opts.tags || [])]));
  if (d?.ipaGB && !merged.ipa) merged.ipa = d.ipaGB;
  if (opts.ctx) merged.ctx = opts.ctx;
  if (opts.source) merged.source = opts.source;
  if (opts.shouldKnow) merged.shouldKnow = true;
  await db.put("vocab", merged);
  return merged;
}

function stripUndef<T extends object>(o: T): T {
  const r: any = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined) r[k] = v;
  return r;
}

// Palabras recientes (para tareas de producción obligatoria)
export async function recentWords(n = 8): Promise<VocabEntry[]> {
  const all = (await getVocab()).filter((v) => !v.archived);
  const notActive = all.filter((v) => ["new", "learning", "recognized", "familiar"].includes(vstate(v)));
  notActive.sort((a, b) => b.addedAt - a.addedAt);
  return notActive.slice(0, n);
}

// "Words I should probably know": frecuentes para tu nivel pero que no dominas
export function shouldProbablyKnow(e: VocabEntry, levelScore: number): boolean {
  if (e.shouldKnow) return true;
  if (e.zipf === undefined) return false;
  // umbral: una usuaria C1 debería conocer casi todo lo que tenga Zipf >= 4.0
  const threshold = levelScore >= 72 ? 3.4 : levelScore >= 60 ? 3.8 : levelScore >= 55 ? 4.0 : 4.4;
  return e.zipf >= threshold;
}

// Detectar uso de palabras del vocabulario en un texto producido
export function detectUses(text: string, words: VocabEntry[]): VocabEntry[] {
  const low = " " + text.toLowerCase().replace(/[^a-z'\- ]/g, " ") + " ";
  return words.filter((w) => {
    const forms = inflections(w.id);
    return forms.some((f) => low.includes(" " + f + " "));
  });
}

export function inflections(w: string): string[] {
  const f = new Set([w]);
  if (w.includes(" ")) return [w];
  f.add(w + "s"); f.add(w + "es"); f.add(w + "ed"); f.add(w + "d"); f.add(w + "ing"); f.add(w + "ly");
  if (w.endsWith("y")) { f.add(w.slice(0, -1) + "ies"); f.add(w.slice(0, -1) + "ied"); f.add(w.slice(0, -1) + "ily"); }
  if (w.endsWith("e")) { f.add(w.slice(0, -1) + "ing"); f.add(w.slice(0, -1) + "ed"); }
  if (/[^aeiou][aeiou][bdgmnpt]$/.test(w)) { f.add(w + w.slice(-1) + "ed"); f.add(w + w.slice(-1) + "ing"); }
  if (w.endsWith("is")) f.add(w.slice(0, -2) + "es"); // hypothesis -> hypotheses
  if (w.endsWith("on")) f.add(w.slice(0, -2) + "a");  // criterion -> criteria
  if (w.endsWith("um")) f.add(w.slice(0, -2) + "a");  // datum -> data
  return Array.from(f);
}
