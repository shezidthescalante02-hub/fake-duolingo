// Diccionario offline (Open English WordNet + CMU + wordfreq + MCR español).
export interface DictSense { pos: string; def: string; ex: string[]; syn: string[] }
export interface DictEntry {
  word: string;
  lemmaOf?: string;       // si se buscó una forma flexionada
  senses: DictSense[];
  ipaGB?: string; ipaUS?: string; ipaCMU?: string;
  zipf?: number;
  cefr?: string;
  syn: string[]; ant: string[]; fam: string[];
  es?: string[];
}

const cache = new Map<string, Promise<Record<string, any>>>();

function shard(letter: string): Promise<Record<string, any>> {
  if (!/^[a-z]$/.test(letter)) return Promise.resolve({});
  if (!cache.has(letter)) {
    const p = fetch(`dict/${letter}.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
    cache.set(letter, p);
  }
  return cache.get(letter)!;
}

export function cefrFromZipf(z?: number): string | undefined {
  if (z === undefined) return undefined;
  if (z >= 5.5) return "A1–A2";
  if (z >= 4.8) return "B1";
  if (z >= 4.1) return "B2";
  if (z >= 3.4) return "C1";
  return "C2";
}

export function freqLabel(z?: number): string {
  if (z === undefined) return "sin datos";
  if (z >= 5.5) return "muy alta";
  if (z >= 4.5) return "alta";
  if (z >= 3.5) return "media";
  if (z >= 2.5) return "baja";
  return "muy baja";
}

// Candidatos de lema para una forma flexionada (heurística simple)
export function lemmaCandidates(w: string): string[] {
  const c = [w];
  const add = (x: string) => { if (x.length > 1 && !c.includes(x)) c.push(x); };
  if (w.endsWith("ies")) add(w.slice(0, -3) + "y");
  if (w.endsWith("ied")) add(w.slice(0, -3) + "y");
  if (w.endsWith("es")) { add(w.slice(0, -2)); add(w.slice(0, -2) + "is"); }
  if (w.endsWith("s") && !w.endsWith("ss")) add(w.slice(0, -1));
  if (w.endsWith("ed")) { add(w.slice(0, -2)); add(w.slice(0, -1)); if (/(.)\1ed$/.test(w)) add(w.slice(0, -3)); }
  if (w.endsWith("ing")) { add(w.slice(0, -3)); add(w.slice(0, -3) + "e"); if (/(.)\1ing$/.test(w)) add(w.slice(0, -4)); }
  if (w.endsWith("er")) { add(w.slice(0, -2)); add(w.slice(0, -1)); }
  if (w.endsWith("est")) { add(w.slice(0, -3)); add(w.slice(0, -2)); }
  if (w.endsWith("ier")) add(w.slice(0, -3) + "y");
  if (w.endsWith("iest")) add(w.slice(0, -4) + "y");
  if (w.endsWith("a")) { add(w.slice(0, -1) + "um"); add(w.slice(0, -1) + "on"); }
  if (w.endsWith("i")) add(w.slice(0, -1) + "us");
  if (w.endsWith("ly")) add(w.slice(0, -2));
  const irregular: Record<string, string> = {
    went: "go", gone: "go", was: "be", were: "be", been: "be", is: "be", are: "be", had: "have", has: "have", did: "do", done: "do",
    made: "make", said: "say", took: "take", taken: "take", saw: "see", seen: "see", came: "come", knew: "know", known: "know",
    thought: "think", brought: "bring", bought: "buy", caught: "catch", taught: "teach", sought: "seek", found: "find", held: "hold",
    led: "lead", left: "leave", meant: "mean", met: "meet", paid: "pay", ran: "run", sent: "send", spent: "spend", stood: "stand",
    told: "tell", understood: "understand", wrote: "write", written: "write", began: "begin", begun: "begin", arose: "arise", arisen: "arise",
    drew: "draw", drawn: "draw", grew: "grow", grown: "grow", shown: "show", chose: "choose", chosen: "choose", fell: "fall", fallen: "fall",
    lay: "lie", lain: "lie", undertook: "undertake", undertaken: "undertake", children: "child", people: "person", men: "man", women: "woman",
    data: "datum", criteria: "criterion", phenomena: "phenomenon", analyses: "analysis", hypotheses: "hypothesis", theses: "thesis",
    better: "good", best: "good", worse: "bad", worst: "bad", feet: "foot", mice: "mouse", bore: "bear", borne: "bear", forgone: "forgo",
  };
  if (irregular[w]) add(irregular[w]);
  return c;
}

function build(word: string, rec: any): DictEntry {
  return {
    word,
    senses: (rec.s || []).map((s: any) => ({ pos: s[0], def: s[1], ex: s[2] || [], syn: s[3] || [] })),
    ipaGB: rec.g, ipaUS: rec.u, ipaCMU: rec.c, zipf: rec.z, cefr: cefrFromZipf(rec.z),
    syn: rec.y || [], ant: rec.a || [], fam: rec.f || [], es: rec.e,
  };
}

export async function lookup(raw: string): Promise<DictEntry | null> {
  const w = raw.toLowerCase().trim().replace(/[“”"(),.;:!?]/g, "").replace(/’/g, "'");
  if (!w) return null;
  const sh = await shard(w[0]);
  if (sh[w]) return build(w, sh[w]);
  for (const c of lemmaCandidates(w).slice(1)) {
    const s2 = c[0] === w[0] ? sh : await shard(c[0]);
    if (s2[c]) { const e = build(c, s2[c]); e.lemmaOf = w; return e; }
  }
  return null;
}

// Búsqueda por prefijo (para el buscador del diccionario)
export async function searchPrefix(q: string, limit = 30): Promise<string[]> {
  const w = q.toLowerCase().trim();
  if (!w) return [];
  const sh = await shard(w[0]);
  const res: string[] = [];
  for (const k of Object.keys(sh)) {
    if (k.startsWith(w)) { res.push(k); if (res.length >= limit * 4) break; }
  }
  res.sort((a, b) => (sh[b].z || 0) - (sh[a].z || 0) || a.length - b.length);
  return res.slice(0, limit);
}

export async function zipfOf(word: string): Promise<number | undefined> {
  const e = await lookup(word);
  return e?.zipf;
}

export async function exists(word: string): Promise<boolean> {
  const w = word.toLowerCase();
  const sh = await shard(w[0]);
  return !!sh[w];
}
