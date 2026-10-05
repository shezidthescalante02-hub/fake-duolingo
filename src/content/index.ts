import type { Item, Lesson, ReadingSet, ListeningSet } from "./types";
import { GRAMMAR_1 } from "./grammar1";
import { GRAMMAR_2 } from "./grammar2";
import { GRAMMAR_3 } from "./grammar3";
import { UOE } from "./uoe";
import { ACADEMIC } from "./academic";
import { STRATEGY } from "./strategy";
import { PRON } from "./pron";
import { READINGS_1 } from "./readings1";
import { READINGS_2 } from "./readings2";
import { LISTENINGS } from "./listening";
import { WRITING_TASKS } from "./writing";
import { SPEAKING_TASKS } from "./speaking";
import { PHD_SCENARIOS } from "./phd";
import { VOCAB_SEED } from "./vocab";
import { VARIETY_ITEMS } from "./variety";
import { db } from "../db/db";

export { WRITING_TASKS, SPEAKING_TASKS, PHD_SCENARIOS, VOCAB_SEED };

export const GRAMMAR_LESSONS: Lesson[] = [...GRAMMAR_1, ...GRAMMAR_2, ...GRAMMAR_3];
export const UOE_LESSONS: Lesson[] = UOE;
export const ACADEMIC_LESSONS: Lesson[] = ACADEMIC;
export const STRATEGY_LESSONS: Lesson[] = STRATEGY;
export const PRON_LESSONS: Lesson[] = PRON;
export const ALL_LESSONS: Lesson[] = [...GRAMMAR_LESSONS, ...UOE_LESSONS, ...ACADEMIC_LESSONS, ...STRATEGY_LESSONS, ...PRON_LESSONS];

export let READINGS: ReadingSet[] = [...READINGS_1, ...READINGS_2];
export let LISTENING_SETS: ListeningSet[] = [...LISTENINGS];

// Contenido personalizado / generado con IA (se guarda en la base local)
let customItems: Item[] = [];
export async function loadCustom() {
  const rows = await db.all<any>("custom");
  customItems = rows.filter((r) => r.type === "item").map((r) => r.item);
  const reads = rows.filter((r) => r.type === "reading").map((r) => r.reading);
  READINGS = [...READINGS_1, ...READINGS_2, ...reads];
  rebuild();
}
export async function addCustomItems(items: Item[]) {
  await db.putMany("custom", items.map((it) => ({ id: "c-" + it.id, type: "item", item: it })));
  customItems = [...customItems, ...items];
  rebuild();
}
export async function addCustomReading(r: ReadingSet) {
  await db.put("custom", { id: "cr-" + r.id, type: "reading", reading: r });
  READINGS = [...READINGS, r];
  rebuild();
}

let itemIndex = new Map<string, Item>();
let tagIndex = new Map<string, Item[]>();
let lessonByTag = new Map<string, Lesson>();

function rebuild() {
  itemIndex = new Map(); tagIndex = new Map(); lessonByTag = new Map();
  const add = (it: Item) => {
    itemIndex.set(it.id, it);
    for (const t of it.tags) { if (!tagIndex.has(t)) tagIndex.set(t, []); tagIndex.get(t)!.push(it); }
  };
  for (const l of ALL_LESSONS) { lessonByTag.set(l.tag, l); for (const it of l.items) add(it); }
  for (const r of READINGS) for (const q of r.questions) add(q);
  for (const s of LISTENING_SETS) for (const q of s.questions) add(q);
  for (const it of VARIETY_ITEMS) add(it);
  for (const it of customItems) add(it);
}
rebuild();

// Ítems generados al vuelo (ejercicios infinitos): se registran para que el índice los conozca
export function registerGenerated(items: Item[]) {
  for (const it of items) {
    if (itemIndex.has(it.id)) continue;
    itemIndex.set(it.id, it);
  }
}

export function findItem(id: string) { return itemIndex.get(id); }
export function itemsForTag(tag: string): Item[] { return tagIndex.get(tag) || []; }
export function allTags(): string[] { return Array.from(tagIndex.keys()); }
export function lessonForTag(tag?: string): Lesson | undefined { return tag ? lessonByTag.get(tag) : undefined; }
export function lessonById(id: string) { return ALL_LESSONS.find((l) => l.id === id); }
export function readingSetOf(itemId: string) { return READINGS.find((r) => r.questions.some((q) => q.id === itemId)); }
export function listeningSetOf(itemId: string) { return LISTENING_SETS.find((r) => r.questions.some((q) => q.id === itemId)); }

// Items "sueltos" que funcionan sin texto adicional (para sesiones mixtas)
export function standaloneItems(): Item[] {
  const out: Item[] = [];
  for (const l of ALL_LESSONS) for (const it of l.items) out.push(it);
  for (const it of VARIETY_ITEMS) out.push(it);
  for (const it of customItems) out.push(it);
  return out;
}

export const TAG_NAMES: Record<string, string> = {};
for (const l of ALL_LESSONS) TAG_NAMES[l.tag] = l.title;
Object.assign(TAG_NAMES, {
  "rd:main-idea": "Main idea", "rd:detail": "Supporting details", "rd:inference": "Inference", "rd:purpose": "Author's purpose",
  "rd:attitude": "Author's attitude / tone", "rd:organization": "Organisation", "rd:reference": "Reference", "rd:vocab": "Vocabulary in context",
  "rd:paraphrase": "Paraphrase", "rd:implication": "Implications", "rd:conclusion": "Conclusions", "rd:limitations": "Limitations",
  "rd:counter": "Counterarguments", "rd:ctest": "Complete the Words",
  "ls:gist": "Global comprehension", "ls:detail": "Details", "ls:inference": "Inference", "ls:purpose": "Speaker's purpose", "ls:attitude": "Attitude",
  "ls:organization": "Organisation", "ls:causal": "Causal relations", "ls:response": "Choose a response",
  "uoe:kwt": "Key word transformations", "avoc:linguistics": "Linguistics terminology", "voc:false-friends": "False friends", "ls:dictation": "Dictation", "voc:dict": "Vocabulary breadth", "voc:personal": "Your vocabulary", "uoe:wordform": "Word formation", "avoc:core": "Academic vocabulary (core)",
});
export function tagName(t: string) { return TAG_NAMES[t] || t; }
