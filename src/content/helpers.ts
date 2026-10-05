// Constructores compactos para escribir contenido.
import type { MCQItem, GapItem, KWTItem, WFItem, JudgeItem, OrderItem, SpotItem, ProduceItem, TFItem, CTestItem, SkillId, Trap } from "./types";

type Extra = { deep?: string; basic?: boolean; tests?: MCQItem["tests"]; ctx?: string; skill?: SkillId; tags?: string[]; audio?: string; audioAccent?: string };

export function skillOf(tag: string): SkillId {
  const ns = tag.split(":")[0];
  return (({ gram: "grammar", uoe: "useOfEnglish", voc: "vocabulary", avoc: "academicVocab", acad: "academicWriting", rd: "reading", ls: "listening", strat: "strategy", pron: "pronunciation" } as any)[ns] || "grammar") as SkillId;
}

export function mcq(id: string, tag: string, lvl: number, prompt: string, options: string[], answer: number, explain: string,
  why?: (string | null)[], traps?: (Trap | null)[], x: Extra = {}): MCQItem {
  return { id, kind: "mcq", skill: x.skill ?? skillOf(tag), tags: [tag, ...(x.tags || [])], lvl, prompt, options, answer, explain, why, traps, deep: x.deep, basic: x.basic, tests: x.tests, ctx: x.ctx, audio: x.audio, audioAccent: x.audioAccent };
}
export function gap(id: string, tag: string, lvl: number, text: string, answers: string[], explain: string, x: Extra & { prompt?: string; hint?: string } = {}): GapItem {
  return { id, kind: "gap", skill: x.skill ?? skillOf(tag), tags: [tag, ...(x.tags || [])], lvl, text, answers, explain, deep: x.deep, basic: x.basic, tests: x.tests, prompt: x.prompt ?? "Complete the gap.", hint: x.hint, ctx: x.ctx, audio: x.audio, audioAccent: x.audioAccent };
}
export function kwt(id: string, tag: string, lvl: number, first: string, key: string, start: string, end: string, answers: string[], explain: string, x: Extra & { max?: number; min?: number } = {}): KWTItem {
  return { id, kind: "kwt", skill: x.skill ?? "useOfEnglish", tags: [tag, "uoe:kwt", ...(x.tags || [])], lvl, first, key, start, end, answers, explain, deep: x.deep, prompt: "Complete the second sentence so that it has a similar meaning to the first, using the word given.", maxWords: x.max ?? 6, minWords: x.min ?? 3, tests: x.tests ?? "both" };
}
export function wf(id: string, tag: string, lvl: number, text: string, base: string, answers: string[], explain: string, x: Extra = {}): WFItem {
  return { id, kind: "wf", skill: x.skill ?? "useOfEnglish", tags: [tag, "uoe:wordform", ...(x.tags || [])], lvl, text, base, answers, explain, deep: x.deep, prompt: "Use the word in capitals to form a word that fits the gap.", tests: "form" };
}
export function judge(id: string, tag: string, lvl: number, sentence: string, grammatical: boolean, appropriate: boolean, explain: string, better?: string, context = "Academic writing (research article)", x: Extra = {}): JudgeItem {
  return { id, kind: "judge", skill: x.skill ?? skillOf(tag), tags: [tag, ...(x.tags || [])], lvl, sentence, grammatical, appropriate, explain, better, context, deep: x.deep, prompt: "Two separate questions: is it grammatical? Is it appropriate here?", tests: "register" };
}
export function order(id: string, tag: string, lvl: number, lead: string, tokens: string[], explain: string, x: Extra & { extra?: string[]; end?: string; fixed?: string } = {}): OrderItem {
  return { id, kind: "order", skill: x.skill ?? "grammar", tags: [tag, ...(x.tags || [])], lvl, lead, tokens, explain, extra: x.extra, end: x.end ?? ".", fixed: x.fixed, prompt: "Build a sentence: put the words in the right order." };
}
export function spot(id: string, tag: string, lvl: number, segments: string[], wrong: number, fix: string, explain: string, x: Extra = {}): SpotItem {
  return { id, kind: "spot", skill: x.skill ?? skillOf(tag), tags: [tag, ...(x.tags || [])], lvl, segments, wrong, fix, explain, deep: x.deep, basic: x.basic, prompt: "Which part contains an error? (Choose “No error” if the sentence is correct.)", tests: "grammar" };
}
export function produce(id: string, tag: string, lvl: number, task: string, explain: string, x: Extra & { mustUse?: string[]; minWords?: number; model?: string; checklist?: string[] } = {}): ProduceItem {
  return { id, kind: "produce", skill: x.skill ?? "academicWriting", tags: [tag, ...(x.tags || [])], lvl, task, explain, mustUse: x.mustUse, minWords: x.minWords, model: x.model, checklist: x.checklist, prompt: "Production task" };
}
export function tf(id: string, tag: string, lvl: number, statement: string, answer: "T" | "F" | "NG", explain: string, mode: "TFNG" | "YNNG" = "TFNG", x: Extra = {}): TFItem {
  return { id, kind: "tf", skill: x.skill ?? "reading", tags: [tag, ...(x.tags || [])], lvl, statement, answer, explain, mode, prompt: mode === "YNNG" ? "Does the statement agree with the views of the writer?" : "Do the following statements agree with the information in the text?" };
}
export function ctest(id: string, lvl: number, text: string, explain: string, x: Extra = {}): CTestItem {
  return { id, kind: "ctest", skill: "reading", tags: ["rd:ctest", ...(x.tags || [])], lvl, text, explain, prompt: "Complete the Words: fill in the missing letters to complete the text." };
}
