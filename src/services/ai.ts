// IA opcional y gratuita: Google Gemini (nivel gratuito de Google AI Studio, sin tarjeta).
// Si no hay clave, la app funciona igual con su motor offline.
import { db } from "../db/db";

export interface AiConfig { provider: "none" | "gemini"; key: string; model: string }
export const DEFAULT_AI: AiConfig = { provider: "none", key: "", model: "gemini-2.5-flash" };

let cfg: AiConfig = DEFAULT_AI;
export async function loadAi() { cfg = await db.kvGet<AiConfig>("ai", DEFAULT_AI); return cfg; }
export async function saveAi(c: AiConfig) { cfg = c; await db.kvSet("ai", c); }
export function aiReady() { return cfg.provider === "gemini" && !!cfg.key && navigator.onLine; }
export function aiConfigured() { return cfg.provider === "gemini" && !!cfg.key; }

const BASE = "https://generativelanguage.googleapis.com/v1beta";

export async function listModels(key: string): Promise<string[]> {
  const r = await fetch(`${BASE}/models?key=${encodeURIComponent(key)}&pageSize=200`);
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  return (j.models || [])
    .filter((m: any) => (m.supportedGenerationMethods || []).includes("generateContent"))
    .map((m: any) => String(m.name).replace("models/", ""))
    .filter((n: string) => /gemini/.test(n) && !/(image|tts|embedding|live|audio-dialog|vision)/.test(n));
}

export interface Part { text?: string; inlineData?: { mimeType: string; data: string } }

export async function generate(opts: { system?: string; parts: Part[]; json?: boolean; temperature?: number; history?: { role: "user" | "model"; text: string }[] }): Promise<string> {
  if (!aiConfigured()) throw new Error("no-ai");
  if (!navigator.onLine) throw new Error("offline");
  const contents: any[] = [];
  for (const h of opts.history || []) contents.push({ role: h.role, parts: [{ text: h.text }] });
  contents.push({ role: "user", parts: opts.parts });
  const body: any = {
    contents,
    generationConfig: { temperature: opts.temperature ?? 0.4, ...(opts.json ? { responseMimeType: "application/json" } : {}) },
  };
  if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };
  const r = await fetch(`${BASE}/models/${encodeURIComponent(cfg.model)}:generateContent?key=${encodeURIComponent(cfg.key)}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (r.status === 429) throw new Error("Límite gratuito alcanzado por ahora (429). Intenta más tarde.");
  if (!r.ok) throw new Error(`Error de la IA (${r.status}): ${(await r.text()).slice(0, 240)}`);
  const j = await r.json();
  const text = (j.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || "").join("");
  if (!text) throw new Error("Respuesta vacía de la IA.");
  return text;
}

export async function generateJson<T = any>(opts: { system?: string; prompt: string; parts?: Part[]; temperature?: number }): Promise<T> {
  const txt = await generate({ system: opts.system, parts: [{ text: opts.prompt }, ...(opts.parts || [])], json: true, temperature: opts.temperature });
  try { return JSON.parse(txt); }
  catch {
    const m = txt.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]);
    throw new Error("La IA no devolvió JSON válido.");
  }
}

export const TUTOR_SYSTEM = `You are an expert applied linguist, EFL teacher-trainer and examiner (TOEFL iBT, Cambridge C1 Advanced / C2 Proficiency, IELTS Academic).
The learner is a Spanish-speaking (Mexico) MA student in linguistics who already teaches English, works at C1 level and is aiming for C2 and doctoral-level academic English.
Principles: be precise and linguistically correct; never invent rules, statistics or citations; when usage varies (BrE/AmE, style guides), say so.
Teach rather than rewrite: diagnose the problem first, explain why, offer alternatives, and invite another attempt.
Distinguish clearly between "ungrammatical", "grammatical but unnatural", "grammatical but inappropriate for academic register" and "acceptable variation".
Do not penalise accent; focus on intelligibility and communicative effectiveness. Write explanations in English; you may add a brief Spanish gloss only when it genuinely helps.`;

// Retroalimentación de escritura: primero diagnóstico, sin reescribir el texto completo
export async function writingFeedback(task: string, text: string, genre: string, exam?: string) {
  return generateJson<{
    overall: string; band: string; scores: Record<string, number>;
    problems: { quote: string; type: string; problem: string; why: string; hint: string; options: string[] }[];
    strengths: string[]; nextFocus: string[];
  }>({
    system: TUTOR_SYSTEM,
    prompt: `Task (${genre}${exam ? ", exam: " + exam : ""}):\n${task}\n\nLearner's text:\n"""${text}"""\n\n` +
      `Return JSON with keys: overall (2-3 sentences), band (CEFR sublevel like "C1+" ${exam ? "and the exam's own scale estimate in brackets" : ""}), ` +
      `scores (0-100 for: task, coherence, cohesion, lexis, grammar, register, argumentation, hedging_stance), ` +
      `problems (max 8, most important first; each: quote = exact words from the text, type in [grammar, collocation, register, cohesion, precision, concision, argument, hedging, punctuation, word-choice, structure], ` +
      `problem = what is wrong, why = linguistic explanation, hint = a hint so the learner can fix it alone, options = 2-3 alternative formulations to reveal AFTER a retry; ` +
      `mark "grammatical but not natural/academic" explicitly in 'problem' when relevant), strengths (max 4), nextFocus (max 3). Do NOT rewrite the whole text.`,
  });
}

export async function speakingFeedback(task: string, transcript: string, metrics: any, audioB64?: string) {
  const parts: Part[] = [];
  if (audioB64) parts.push({ inlineData: { mimeType: "audio/wav", data: audioB64 } });
  return generateJson<{
    overall: string; band: string; scores: Record<string, number>;
    issues: { quote: string; problem: string; why: string; better: string[] }[];
    pronunciation: string[]; strengths: string[]; nextFocus: string[]; transcript?: string;
  }>({
    system: TUTOR_SYSTEM,
    prompt: `Speaking task:\n${task}\n\n${audioB64 ? "Audio of the learner's response is attached. First transcribe it faithfully (keep fillers)." : "Automatic transcript (may contain recognition errors; do not penalise likely ASR mistakes):"}\n"""${transcript}"""\n` +
      `Objective metrics: ${JSON.stringify(metrics)}\n` +
      `Return JSON: overall, band (CEFR sublevel), scores (0-100: fluency, coherence, task, lexis, grammar, complexity, intelligibility), ` +
      `issues (max 6: quote, problem, why, better = 2 alternatives), pronunciation (max 4 observations about intelligibility only, never accent per se; empty if no audio), strengths, nextFocus${audioB64 ? ", transcript" : ""}.`,
    parts,
  });
}

export async function professorAnswer(question: string, context: string, history: { role: "user" | "model"; text: string }[]) {
  return generate({
    system: TUTOR_SYSTEM + "\nYou are in 'Professor Mode': answer the learner's question about the exercise thoroughly, with linguistic terminology when useful (e.g., aspect, modality, complementation, information structure), concrete examples, and, if asked, harder examples. Use short paragraphs and bullet points. Plain text with **bold** allowed.",
    parts: [{ text: `Exercise context:\n${context}\n\nQuestion: ${question}` }],
    history,
    temperature: 0.5,
  });
}

// Genera ítems nuevos con el mismo esquema de la app
export async function generateItems(tag: string, title: string, lvl: number, n: number, kinds: string[]) {
  return generateJson<{ items: any[] }>({
    system: TUTOR_SYSTEM,
    temperature: 0.8,
    prompt: `Create ${n} NEW exercise items on "${title}" (tag ${tag}) at difficulty ${lvl}/100 (55=C1 entry, 66=C1+, 78=C2). Use natural, plausible academic or real-world contexts (no absurd sentences). Vary contexts and disciplines.
Allowed item kinds and JSON shapes:
- {"kind":"mcq","prompt":"...","ctx":"optional","options":["..","..","..",".."],"answer":0,"why":["null or why option is wrong",...],"explain":"why the answer is correct"}
- {"kind":"gap","text":"sentence with ___","answers":["accepted1","accepted2"],"explain":"..."}
- {"kind":"kwt","first":"...","key":"KEYWORD","start":"...","end":"...","answers":["2-5 word answers"],"explain":"..."}
- {"kind":"judge","sentence":"...","context":"e.g. Results section of a research article","grammatical":true,"appropriate":false,"better":"...","explain":"..."}
- {"kind":"spot","segments":["seg1","seg2","seg3","seg4"],"wrong":2,"fix":"corrected segment","explain":"..."}
Use only these kinds: ${kinds.join(", ")}. Return {"items":[...]} only. Every answer must be unambiguously correct and the explanation linguistically accurate.`,
  });
}

export async function generateReading(discipline: string, lvl: number) {
  return generateJson<any>({
    system: TUTOR_SYSTEM,
    temperature: 0.9,
    prompt: `Write an ORIGINAL expository/academic reading passage (450-650 words, 5-7 paragraphs) on a specific topic in ${discipline}, difficulty ${lvl}/100 (66=C1+, 78=C2), similar in complexity to TOEFL/IELTS/Cambridge passages. Do not reproduce any existing text. Then write 8 multiple-choice questions covering: main idea, detail, inference, vocabulary in context, author's purpose, reference, paraphrase, attitude. Each with 4 options, the index of the answer, an explanation, a 'why' array explaining each wrong option, and a 'traps' array using these labels or null: true-not-stated, contradicts, too-extreme, out-of-scope, word-match, reversed, partial, over-inference, wrong-focus.
Return JSON: {"title":"...","paragraphs":["..."],"questions":[{"kind":"mcq","prompt":"...","options":[...],"answer":0,"explain":"...","why":[...],"traps":[...],"tags":["rd:inference"]}]}`,
  });
}
