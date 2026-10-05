// Ejercicios infinitos: se generan al vuelo a partir de datos reales de la app
// (vocabulario curado, tu vocabulario, diccionario offline, textos de reading y listening).
// No se inventa contenido: cada ítem reutiliza definiciones, ejemplos y transcripciones existentes.
import type { Item, MCQItem, MatchItem, RecallItem, StressItem, DictationItem, CTestItem, SkillId, VocabSeed } from "../content/types";
import { VOCAB_SEED, READINGS, LISTENING_SETS, registerGenerated } from "../content/index";
import { db } from "../db/db";
import type { VocabEntry } from "./vocab";

export type GenMode = "vocab" | "dictvocab" | "personal" | "stress" | "dictation" | "ctest";
export const GEN_MODES: { id: GenMode; es: string; desc: string; skill: SkillId }[] = [
  { id: "vocab", es: "Vocabulario académico", desc: "definiciones, parejas y recuerdo activo con las 164 palabras curadas", skill: "academicVocab" },
  { id: "personal", es: "Tu vocabulario", desc: "las palabras que agregaste, en formatos nuevos", skill: "vocabulary" },
  { id: "dictvocab", es: "Amplitud léxica", desc: "palabras de frecuencia baja del diccionario (nivel C1–C2)", skill: "vocabulary" },
  { id: "stress", es: "Acento de palabra", desc: "más de 3 000 palabras con su IPA (EE. UU. y Reino Unido)", skill: "pronunciation" },
  { id: "dictation", es: "Dictado", desc: "oraciones de las lecturas y audios, con voces de varios acentos", skill: "listening" },
  { id: "ctest", es: "Complete the Words", desc: "C-tests nuevos a partir de las lecturas (formato TOEFL 2026)", skill: "reading" },
];

// ---------------------------------------------------------------- utilidades
const rnd = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
function sample<T>(a: T[], n: number): T[] {
  const c = [...a]; const out: T[] = [];
  while (c.length && out.length < n) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]);
  return out;
}
function hash(s: string): string { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
const stripMd = (s: string) => s.replace(/\*\*?|__|`/g, "").replace(/\s+/g, " ").trim();
const lvlOf = (l?: string) => (l === "C2" ? 72 : l === "C1" ? 60 : l === "B2" ? 48 : 58);

interface Lex { w: string; pos: string; def: string; ex?: string; syn?: string[]; ant?: string[]; es?: string; lvl: number; src: "seed" | "personal" }
function fromSeed(s: VocabSeed): Lex { return { w: s.w, pos: s.pos, def: s.def, ex: s.ex, syn: s.syn, ant: s.ant, es: s.es, lvl: lvlOf(s.lvl), src: "seed" }; }
function fromEntry(e: VocabEntry): Lex | null {
  if (!e.def || !e.pos) return null;
  return { w: e.w, pos: e.pos, def: e.def, ex: e.ex || e.ctx, syn: e.syn, ant: e.ant, es: e.es, lvl: lvlOf(e.lvl), src: "personal" };
}
const related = (a: Lex, b: Lex) => a.w === b.w || (a.syn || []).includes(b.w) || (b.syn || []).includes(a.w) || (a.ant || []).includes(b.w) || (b.ant || []).includes(a.w);
const posKey = (p: string) => p.split(" ")[0].replace("satellite", "").trim();

function explainLex(l: Lex) {
  return `**${l.w}** (${l.pos}) — ${l.def}${l.ex ? `\n\n> ${l.ex}` : ""}${l.es ? `\n\nEspañol: *${l.es}*` : ""}`;
}

// ---------------------------------------------------------------- vocabulario (curado o personal)
function defToWord(t: Lex, pool: Lex[], tag: string, skill: SkillId): MCQItem | null {
  const ds = sample(pool.filter((x) => posKey(x.pos) === posKey(t.pos) && !related(x, t)), 3);
  if (ds.length < 3) return null;
  const opts = sample([t, ...ds], 4);
  return { id: `g-dw-${t.w}`, kind: "mcq", skill, tags: [tag], lvl: t.lvl, prompt: `Which word means: *${t.def}*?`, options: opts.map((o) => o.w), answer: opts.indexOf(t), explain: explainLex(t), tests: "meaning" };
}
function wordToDef(t: Lex, pool: Lex[], tag: string, skill: SkillId): MCQItem | null {
  const ds = sample(pool.filter((x) => !related(x, t) && x.def !== t.def), 3);
  if (ds.length < 3) return null;
  const opts = sample([t, ...ds], 4);
  return { id: `g-wd-${t.w}`, kind: "mcq", skill, tags: [tag], lvl: t.lvl - 2, prompt: `What does **${t.w}** mean?`, options: opts.map((o) => o.def), answer: opts.indexOf(t), explain: explainLex(t), tests: "meaning" };
}
function matchSet(pool: Lex[], tag: string, skill: SkillId, kind: "def" | "es" | "syn"): MatchItem | null {
  let cand = pool;
  if (kind === "es") cand = pool.filter((x) => x.es);
  if (kind === "syn") cand = pool.filter((x) => x.syn && x.syn.length);
  const picked: Lex[] = [];
  for (const x of sample(cand, 40)) {
    if (picked.length >= 5) break;
    if (picked.some((p) => related(p, x))) continue;
    if (kind === "syn" && picked.some((p) => (p.syn || []).includes(x.syn![0]) || (x.syn || []).includes(p.syn![0]))) continue;
    if (kind === "es") {
      const esx = x.es!.toLowerCase().split(/[,;]/).map((t) => t.trim());
      if (picked.some((p) => { const esp = p.es!.toLowerCase().split(/[,;]/).map((t) => t.trim()); return esp.includes(esx[0]) || esx.includes(esp[0]); })) continue;
    }
    if (kind === "def" && picked.some((p) => p.pos === x.pos && (p.syn || []).some((sy) => (x.syn || []).includes(sy)))) continue;
    picked.push(x);
  }
  if (picked.length < 4) return null;
  const right = (x: Lex) => (kind === "def" ? x.def : kind === "es" ? x.es!.split(/[,;]/)[0].trim() : x.syn![0]);
  const prompt = kind === "def" ? "Match each word with its meaning." : kind === "es" ? "Match each word with its Spanish equivalent." : "Match each word with a near-synonym.";
  return {
    id: `g-m${kind}-${hash(picked.map((p) => p.w).join("|"))}`, kind: "match", skill, tags: [tag], lvl: Math.round(picked.reduce((a, p) => a + p.lvl, 0) / picked.length),
    prompt, pairs: picked.map((p) => [p.w, right(p)] as [string, string]), heads: ["Word", kind === "def" ? "Meaning" : kind === "es" ? "Español" : "Synonym"],
    explain: picked.map((p) => `- **${p.w}**: ${p.def}${kind === "es" && p.es ? ` (${p.es})` : ""}`).join("\n"),
  };
}
function recall(t: Lex, tag: string, skill: SkillId): RecallItem | null {
  if (!t.ex) return null;
  const stem = t.w.length > 5 ? t.w.slice(0, t.w.length - 2) : t.w;
  const re = new RegExp(`\\b(${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[a-z]*)\\b`, "i");
  const m = t.ex.match(re);
  if (!m || t.w.includes(" ")) return null;
  const form = m[1];
  if (Math.abs(form.length - t.w.length) > 4) return null;
  const text = t.ex.replace(form, "___");
  return {
    id: `g-rc-${t.w}`, kind: "recall", skill, tags: [tag], lvl: t.lvl + 4, text, word: form, answers: [form], def: t.def,
    prompt: `Write the missing word. It starts with **${form[0]}** and has ${form.length} letters.`, explain: explainLex(t), tests: "form",
  };
}

async function lexPool(mode: "vocab" | "personal"): Promise<Lex[]> {
  if (mode === "vocab") return VOCAB_SEED.map(fromSeed);
  const mine = (await db.all<VocabEntry>("vocab")).filter((v) => !v.archived).map(fromEntry).filter(Boolean) as Lex[];
  return mine;
}

function genLex(pool: Lex[], targets: Lex[], n: number, tag: string, skill: SkillId): Item[] {
  const out: Item[] = [];
  const makers = [
    (t: Lex) => defToWord(t, pool, tag, skill),
    (t: Lex) => wordToDef(t, pool, tag, skill),
    (t: Lex) => recall(t, tag, skill),
    () => matchSet(pool, tag, skill, "def"),
    () => matchSet(pool, tag, skill, "es"),
    () => matchSet(pool, tag, skill, "syn"),
  ];
  let guard = 0;
  while (out.length < n && guard++ < n * 8) {
    const t = rnd(targets);
    const it = rnd(makers)(t);
    if (it && !out.some((o) => o.id === it.id)) out.push(it);
  }
  return out;
}

// ---------------------------------------------------------------- diccionario: amplitud léxica
let defsCache: [string, string, string, number][] | null = null;
async function defsData() {
  if (!defsCache) defsCache = await fetch("gen/defs.json").then((r) => r.json()).catch(() => []);
  return defsCache!;
}
function zLvl(z: number) { return Math.round(Math.max(50, Math.min(85, 50 + (4.4 - z) * 14))); }
async function genDict(n: number, target: number): Promise<Item[]> {
  const data = await defsData();
  if (data.length < 10) return [];
  // banda de frecuencia según el nivel objetivo (más alto = palabras más raras)
  const zc = Math.max(2.6, Math.min(3.5, 4.4 - (target - 50) / 14));
  const near = data.filter((d) => Math.abs(d[3] - zc) <= 0.35);
  const pool = near.length > 40 ? near : data;
  const out: Item[] = [];
  for (const t of sample(pool, n * 2)) {
    if (out.length >= n) break;
    const same = data.filter((d) => d[1] === t[1] && d[0] !== t[0] && Math.abs(d[3] - t[3]) < 0.5);
    const ds = sample(same, 3);
    if (ds.length < 3) continue;
    const opts = sample([t, ...ds], 4);
    const dir = Math.random() < 0.5;
    out.push({
      id: `g-dd-${dir ? "w" : "d"}-${t[0]}`, kind: "mcq", skill: "vocabulary", tags: ["voc:dict"], lvl: zLvl(t[3]),
      prompt: dir ? `Which word means: *${t[2]}*?` : `What does **${t[0]}** mean?`,
      options: opts.map((o) => (dir ? o[0] : o[2])), answer: opts.indexOf(t),
      explain: `**${t[0]}** (${t[1]}) — ${t[2]}\n\nToca la palabra para verla en el diccionario y agregarla a tu vocabulario si te interesa.`, tests: "meaning",
    } as MCQItem);
  }
  return out;
}

// ---------------------------------------------------------------- acento de palabra
let stressCache: [string, string, string, number, number, number][] | null = null;
async function genStress(n: number, target: number): Promise<Item[]> {
  if (!stressCache) stressCache = await fetch("gen/stress.json").then((r) => r.json()).catch(() => []);
  const data = stressCache!;
  if (!data.length) return [];
  // palabras más raras o más largas para niveles altos; prefiere acento no inicial (más informativo)
  const pool = data.filter((d) => zLvl(d[5] + 0.6) <= target + 12);
  const out: StressItem[] = [];
  for (const d of sample(pool.length > 50 ? pool : data, n * 3)) {
    if (out.length >= n) break;
    if (d[3] === 0 && Math.random() < 0.55) continue;
    const [w, us, gb, idx, syl, z] = d;
    out.push({
      id: `g-st-${w}`, kind: "stress", skill: "pronunciation", tags: ["pron:stress"], lvl: zLvl(z + 0.6) - (syl <= 3 ? 2 : 0), word: w, syl, answer: idx, ipa: us, ipaGB: gb || undefined,
      prompt: "Which syllable carries the primary stress?",
      explain: `Acento primario en la ${["1.ª", "2.ª", "3.ª", "4.ª", "5.ª"][idx]} sílaba. IPA (EE. UU.): /${us}/${gb ? ` · (Reino Unido): /${gb}/` : " (no hay transcripción británica en el diccionario offline)"}. La marca ˈ va **antes** de la sílaba tónica; ˌ marca acento secundario.\n\nFuente: diccionario CMU / Wiktionary incluidos en la app. Algunas palabras varían entre hablantes; si conoces otra pronunciación aceptada, coméntalo en Professor Mode.`,
    });
  }
  return out;
}

// ---------------------------------------------------------------- dictado
let sentCache: { t: string; lvl: number; src: string }[] | null = null;
function sentences() {
  if (sentCache) return sentCache;
  const out: { t: string; lvl: number; src: string }[] = [];
  const push = (raw: string, lvl: number, src: string) => {
    for (const s of stripMd(raw).split(/(?<=[.?!])\s+(?=[A-Z])/)) {
      const t = s.trim();
      const n = t.split(/\s+/).length;
      if (n < 7 || n > 22) continue;
      if (/[0-9()\[\]"“”:;/–—]/.test(t)) continue;
      if (!/[.?!]$/.test(t)) continue;
      out.push({ t, lvl, src });
    }
  };
  for (const r of READINGS) for (const p of r.paragraphs) push(p, r.lvl, r.title);
  for (const s of LISTENING_SETS) for (const l of s.lines) push(l.t, s.lvl, s.title);
  sentCache = out;
  return out;
}
function genDictation(n: number, target: number, accents: string[]): Item[] {
  const all = sentences();
  const pool = all.filter((s) => Math.abs(s.lvl + (s.t.split(" ").length - 14) * 0.8 - target) <= 12);
  return sample(pool.length >= n ? pool : all, n).map((s): DictationItem => ({
    id: `g-dc-${hash(s.t)}`, kind: "dictation", skill: "listening", tags: ["ls:dictation"], lvl: Math.round(s.lvl + (s.t.split(" ").length - 14) * 0.8),
    text: s.t, accent: rnd(accents.length ? accents : ["en-US", "en-GB"]), prompt: "Listen and type exactly what you hear.",
    explain: `Fuente: *${s.src}*. El dictado entrena la percepción de formas débiles, finales de palabra y concordancia: lo que no oyes, lo reconstruyes con gramática.`,
  }));
}

// ---------------------------------------------------------------- Complete the Words (C-test)
function makeCTest(text: string, gaps = 10): string | null {
  const sents = text.split(/(?<=[.?!])\s+/);
  if (sents.length < 2) return null;
  const intro = sents[0];
  let body = sents.slice(1).join(" ");
  let count = 0, k = 0;
  body = body.replace(/[A-Za-z]+/g, (w) => {
    k++;
    if (count >= gaps || k % 2 === 1 || w.length < 2) return w;
    count++;
    const keep = Math.floor(w.length / 2);
    return `{${w.slice(0, keep)}|${w.slice(keep)}}`;
  });
  return count >= 8 ? intro + " " + body : null;
}
function genCTest(n: number, target: number): Item[] {
  const paras: { t: string; lvl: number; id: string }[] = [];
  READINGS.forEach((r) => r.paragraphs.forEach((p, i) => {
    const t = stripMd(p);
    const wc = t.split(/\s+/).length;
    if (wc >= 45 && wc <= 140 && !t.includes("\n")) paras.push({ t, lvl: r.lvl, id: `${r.id}-${i}` });
  }));
  const pool = paras.filter((p) => Math.abs(p.lvl - target) <= 10);
  const out: CTestItem[] = [];
  for (const p of sample(pool.length >= n ? pool : paras, n)) {
    // recortar a ~70 palabras terminando en punto
    let t = p.t;
    const s = t.split(/(?<=[.?!])\s+/); let acc = "";
    for (const x of s) { if ((acc + " " + x).split(/\s+/).length > 75 && acc.split(/\s+/).length > 40) break; acc = (acc ? acc + " " : "") + x; }
    t = acc;
    const ct = makeCTest(t);
    if (!ct) continue;
    out.push({ id: `g-ct-${p.id}`, kind: "ctest", skill: "reading", tags: ["rd:ctest"], lvl: p.lvl, text: ct, prompt: "Complete the Words: fill in the missing letters to complete the text.", explain: "Usa la gramática (concordancia, clase de palabra, colocación) y el significado: las letras visibles reducen las opciones y el contexto elige la forma." });
  }
  return out;
}

// ---------------------------------------------------------------- API
export async function generate(mode: GenMode, n: number, target: number, opts: { accents?: string[] } = {}): Promise<Item[]> {
  let items: Item[] = [];
  if (mode === "vocab" || mode === "personal") {
    const pool = await lexPool(mode);
    const base = mode === "personal" ? [...pool, ...VOCAB_SEED.map(fromSeed)] : pool; // distractores
    if (pool.length >= 1 && base.length >= 8) {
      const near = pool.filter((p) => Math.abs(p.lvl - target) <= 12);
      items = genLex(base, near.length >= 6 ? near : pool, n, mode === "personal" ? "voc:personal" : "avoc:core", mode === "personal" ? "vocabulary" : "academicVocab");
    }
  } else if (mode === "dictvocab") items = await genDict(n, target);
  else if (mode === "stress") items = await genStress(n, target);
  else if (mode === "dictation") items = genDictation(n, target, opts.accents || []);
  else if (mode === "ctest") items = genCTest(n, target);
  registerGenerated(items);
  return items;
}

// Modos que pueden alimentar un tema/etiqueta concreta
export function modeForTag(tag: string): GenMode | null {
  if (tag === "pron:stress") return "stress";
  if (tag === "ls:dictation") return "dictation";
  if (tag === "rd:ctest") return "ctest";
  if (tag === "voc:dict") return "dictvocab";
  if (tag === "voc:personal") return "personal";
  if (tag === "avoc:core" || tag.startsWith("avoc:")) return "vocab";
  return null;
}

// Mezcla variada para sesiones (respeta habilidades omitidas)
export async function generateMixed(n: number, target: number, skip: { listening: boolean; pronunciation: boolean; reading: boolean }, accents: string[]): Promise<Item[]> {
  const modes: GenMode[] = ["vocab", "vocab", "dictvocab", "personal"];
  if (!skip.listening) modes.push("dictation", "dictation");
  if (!skip.pronunciation) modes.push("stress");
  if (!skip.reading) modes.push("ctest");
  const out: Item[] = [];
  let guard = 0;
  while (out.length < n && guard++ < n * 4) {
    const m = rnd(modes);
    const got = await generate(m, 1, target, { accents });
    for (const g of got) if (!out.some((o) => o.id === g.id)) out.push(g);
  }
  return out;
}
