// Gamificación sin castigos: XP, niveles, logros, misiones opcionales, retos diarios opcionales.
export interface Profile {
  xp: number;
  days: string[];               // días con estudio (YYYY-MM-DD)
  lastActive: number;
  minutes: number;
  items: number;
  correct: number;
  achievements: Record<string, number>;
  quests: { week: string; list: Quest[] };
  daily: { day: string; ch: Daily | null; done: boolean };
  counters: Record<string, number>;
  unlocked: string[];
}
export interface Quest { id: string; title: string; target: number; progress: number; counter: string; xp: number }
export interface Daily { id: string; title: string; desc: string; route: string; counter: string; target: number; xp: number; start: number }

export function emptyProfile(): Profile {
  return { xp: 0, days: [], lastActive: 0, minutes: 0, items: 0, correct: 0, achievements: {}, quests: { week: "", list: [] }, daily: { day: "", ch: null, done: false }, counters: {}, unlocked: [] };
}

// Curva de niveles: cada nivel pide un poco más que el anterior
export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  let level = 1, need = 150, rest = xp;
  while (rest >= need) { rest -= need; level++; need = Math.round(150 + (level - 1) * 60 + Math.pow(level - 1, 1.6) * 10); }
  return { level, into: rest, need };
}

export const LEVEL_TITLES: [number, string][] = [
  [1, "Promising Specimen"], [3, "Suspiciously Competent"], [5, "Hedging Apprentice"], [8, "Footnote Enthusiast"],
  [11, "Mildly Dangerous"], [15, "Nominalisation Enjoyer"], [20, "Peer-Review Survivor"], [26, "Distractor Slayer"],
  [33, "Insufferably Fluent"], [40, "C2 Menace"], [50, "Strix's Equal (Allegedly)"],
];
export function titleFor(level: number) { let t = LEVEL_TITLES[0][1]; for (const [l, n] of LEVEL_TITLES) if (level >= l) t = n; return t; }

export const UNLOCKS: { level: number; id: string; name: string; kind: "accessory" | "color" }[] = [
  { level: 3, id: "color:oxblood", name: "Plumaje oxblood", kind: "color" },
  { level: 5, id: "acc:mortarboard", name: "Birrete académico", kind: "accessory" },
  { level: 8, id: "color:wine", name: "Plumaje vino", kind: "color" },
  { level: 11, id: "acc:scarf", name: "Bufanda de biblioteca", kind: "accessory" },
  { level: 15, id: "color:garnet", name: "Plumaje granate", kind: "color" },
  { level: 20, id: "acc:crown", name: "Corona de villano", kind: "accessory" },
];
export const OWL_COLORS: Record<string, string> = { crimson: "#8c1c2c", oxblood: "#6b1420", wine: "#7a1f3d", garnet: "#9a2a2a" };

export function dayKey(d = new Date()) {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
}
export function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const w = Math.ceil(((t.getTime() - y.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${w}`;
}

// Constancia sin presión: días estudiados en los últimos 30, y racha actual (informativa)
export function consistency(p: Profile) {
  const set = new Set(p.days);
  let streak = 0;
  const d = new Date();
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1); // hoy aún no cuenta como roto
  while (set.has(dayKey(d))) { streak++; d.setDate(d.getDate() - 1); }
  let last30 = 0;
  const e = new Date();
  for (let i = 0; i < 30; i++) { if (set.has(dayKey(e))) last30++; e.setDate(e.getDate() - 1); }
  return { streak, last30, total: p.days.length };
}

export interface AchDef { id: string; name: string; desc: string; icon: string; test: (p: Profile) => boolean }
const c = (p: Profile, k: string) => p.counters[k] || 0;
export const ACHIEVEMENTS: AchDef[] = [
  { id: "first", name: "First Blood", desc: "Primera respuesta registrada", icon: "flag", test: (p) => p.items >= 1 },
  { id: "diag", name: "Know Thyself", desc: "Completar el diagnóstico inicial", icon: "search", test: (p) => c(p, "diagnostic") >= 1 },
  { id: "i100", name: "Centurion", desc: "100 ejercicios", icon: "medal", test: (p) => p.items >= 100 },
  { id: "i500", name: "Relentless", desc: "500 ejercicios", icon: "swords", test: (p) => p.items >= 500 },
  { id: "i2000", name: "Unstoppable Force", desc: "2000 ejercicios", icon: "flame", test: (p) => p.items >= 2000 },
  { id: "d7", name: "Habit Forming", desc: "Estudiar 7 días distintos (no tienen que ser seguidos)", icon: "calendar", test: (p) => p.days.length >= 7 },
  { id: "d30", name: "Creature of Habit", desc: "Estudiar 30 días distintos", icon: "calendar", test: (p) => p.days.length >= 30 },
  { id: "d100", name: "Institution", desc: "Estudiar 100 días distintos", icon: "columns", test: (p) => p.days.length >= 100 },
  { id: "v25", name: "Word Hoarder", desc: "25 palabras en tu vocabulario", icon: "cards", test: (p) => c(p, "wordsAdded") >= 25 },
  { id: "v100", name: "Lexical Dragon", desc: "100 palabras en tu vocabulario", icon: "crown", test: (p) => c(p, "wordsAdded") >= 100 },
  { id: "vm10", name: "Ten Tamed", desc: "10 palabras en estado Mastered", icon: "trophy", test: (p) => c(p, "wordsMastered") >= 10 },
  { id: "use20", name: "Put It To Work", desc: "Usar vocabulario nuevo en producción 20 veces", icon: "edit", test: (p) => c(p, "wordUses") >= 20 },
  { id: "w1", name: "Blank Page Survivor", desc: "Primer texto escrito", icon: "quill", test: (p) => c(p, "writing") >= 1 },
  { id: "w10", name: "Prolific", desc: "10 textos escritos", icon: "scroll", test: (p) => c(p, "writing") >= 10 },
  { id: "rewrite5", name: "Second Draft Energy", desc: "Reescribir 5 textos tras el feedback", icon: "repeat", test: (p) => c(p, "rewrite") >= 5 },
  { id: "s1", name: "Found Your Voice", desc: "Primera respuesta oral", icon: "mic", test: (p) => c(p, "speaking") >= 1 },
  { id: "s15", name: "Podium Ready", desc: "15 respuestas orales", icon: "mic", test: (p) => c(p, "speaking") >= 15 },
  { id: "rlr5", name: "Read Like a Researcher", desc: "Analizar 5 textos con el modo investigador", icon: "search", test: (p) => c(p, "rlr") >= 5 },
  { id: "fast", name: "Speed Listener", desc: "Completar un listening a 1.5x o más", icon: "rabbit", test: (p) => c(p, "fastListening") >= 1 },
  { id: "sim1", name: "Dress Rehearsal", desc: "Primera simulación completa o por secciones", icon: "exam", test: (p) => c(p, "sims") >= 1 },
  { id: "sim4", name: "Test Tourist", desc: "Probar simulaciones de los 4 exámenes", icon: "map", test: (p) => c(p, "examsTried") >= 4 },
  { id: "nooverthink", name: "Trust Issues Resolved", desc: "Sesión de 15+ ítems sin cambiar respuestas correctas", icon: "brain", test: (p) => c(p, "cleanSessions") >= 1 },
  { id: "night", name: "Actual Night Owl", desc: "Estudiar después de las 23:00", icon: "owl", test: (p) => c(p, "night") >= 1 },
  { id: "early", name: "Dawn Scholar", desc: "Estudiar antes de las 7:00", icon: "sparkle", test: (p) => c(p, "early") >= 1 },
  { id: "marathon", name: "Just Ten Minutes™", desc: "Una sesión de más de 60 minutos", icon: "hourglass", test: (p) => c(p, "marathon") >= 1 },
  { id: "nightmare", name: "Masochist", desc: "Completar una sesión en C2 Nightmare", icon: "bolt", test: (p) => c(p, "nightmare") >= 1 },
  { id: "prof10", name: "Office Hours", desc: "10 preguntas en Professor Mode", icon: "teacher", test: (p) => c(p, "professor") >= 10 },
  { id: "comeback", name: "The Return", desc: "Volver después de 7+ días sin estudiar (sin culpa)", icon: "back", test: (p) => c(p, "comeback") >= 1 },
  { id: "phd5", name: "Supervisor Approved", desc: "5 escenarios del modo doctorado", icon: "exam", test: (p) => c(p, "phd") >= 5 },
  { id: "lvl10", name: "Double Digits", desc: "Llegar al nivel 10", icon: "star", test: (p) => levelFromXp(p.xp).level >= 10 },
];

// Misiones semanales opcionales (no hay castigo por no completarlas)
const QUEST_POOL: Omit<Quest, "progress">[] = [
  { id: "q-items", title: "Responde 120 ejercicios", target: 120, counter: "items", xp: 150 },
  { id: "q-write", title: "Escribe 3 textos", target: 3, counter: "writing", xp: 200 },
  { id: "q-speak", title: "Graba 4 respuestas orales", target: 4, counter: "speaking", xp: 150 },
  { id: "q-words", title: "Agrega 20 palabras", target: 20, counter: "wordsAdded", xp: 120 },
  { id: "q-uses", title: "Usa 8 palabras nuevas al escribir", target: 8, counter: "wordUses", xp: 160 },
  { id: "q-read", title: "Completa 3 lecturas", target: 3, counter: "readings", xp: 150 },
  { id: "q-listen", title: "Completa 3 listenings", target: 3, counter: "listenings", xp: 150 },
  { id: "q-review", title: "Repasa 60 tarjetas", target: 60, counter: "reviews", xp: 120 },
  { id: "q-phd", title: "2 escenarios de doctorado", target: 2, counter: "phd", xp: 140 },
  { id: "q-rlr", title: "Lee 2 textos como investigadora", target: 2, counter: "rlr", xp: 120 },
];

export function ensureQuests(p: Profile): Profile {
  const wk = weekKey();
  if (p.quests.week === wk) return p;
  const shuffled = [...QUEST_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
  const base: Record<string, number> = {};
  for (const q of shuffled) base[q.counter] = p.counters[q.counter] || 0;
  return { ...p, quests: { week: wk, list: shuffled.map((q) => ({ ...q, progress: 0, start: base[q.counter] } as any)) } };
}

export function questProgress(p: Profile, q: Quest & { start?: number }) {
  return Math.min(q.target, (p.counters[q.counter] || 0) - (q.start || 0));
}

const DAILY_POOL: Omit<Daily, "start">[] = [
  { id: "dc-vocab60", title: "Úsalo o piérdelo", desc: "Escribe 60 palabras usando al menos dos palabras que aprendiste recientemente.", route: "#/writing/use-words", counter: "wordUses", target: 2, xp: 60 },
  { id: "dc-inference", title: "Detective de inferencias", desc: "Responde 8 preguntas de inferencia.", route: "#/practice/rd:inference", counter: "inference", target: 8, xp: 50 },
  { id: "dc-instinct", title: "Confía en tu instinto", desc: "Haz 10 ítems de Use of English sin cambiar ninguna respuesta.", route: "#/strategy/instinct", counter: "instinct", target: 1, xp: 60 },
  { id: "dc-hedge", title: "Hedge your bets", desc: "Practica hedging y stance (6 ítems).", route: "#/practice/acad:hedging", counter: "hedging", target: 6, xp: 50 },
  { id: "dc-speak60", title: "60 segundos de fama", desc: "Explica tu pregunta de investigación en 60 segundos.", route: "#/speaking/phd-rq60", counter: "speaking", target: 1, xp: 60 },
  { id: "dc-kwt", title: "Transformista", desc: "Resuelve 6 key word transformations.", route: "#/practice/uoe:kwt", counter: "kwt", target: 6, xp: 55 },
  { id: "dc-reading", title: "Lectura con lupa", desc: "Completa una lectura en modo investigador.", route: "#/reading", counter: "rlr", target: 1, xp: 60 },
  { id: "dc-review", title: "Limpieza de repasos", desc: "Repasa 20 tarjetas de vocabulario.", route: "#/vocab/review", counter: "reviews", target: 20, xp: 45 },
];

export function ensureDaily(p: Profile): Profile {
  const d = dayKey();
  if (p.daily.day === d) return p;
  const ch = DAILY_POOL[Math.floor(Math.random() * DAILY_POOL.length)];
  return { ...p, daily: { day: d, ch: { ...ch, start: p.counters[ch.counter] || 0 }, done: false } };
}
