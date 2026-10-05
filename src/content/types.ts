// Tipos de contenido de Fake Duolingo

export type SkillId =
  | "reading" | "listening" | "speaking" | "writing"
  | "grammar" | "vocabulary" | "academicVocab" | "academicWriting"
  | "useOfEnglish" | "pronunciation" | "strategy" | "inference"
  | "comprehension" | "fluency" | "pressure" | "timeMgmt" | "overthinking";

export type Trap =
  | "true-not-stated"   // verdadero en el mundo, pero el texto no lo dice
  | "contradicts"       // contradice el texto
  | "too-extreme"       // absolutiza (always, never, all, only)
  | "out-of-scope"      // fuera del alcance del texto o la pregunta
  | "word-match"        // repite palabras del texto con otro significado
  | "reversed"          // invierte causa/efecto o la relación
  | "partial"           // solo parte de la respuesta
  | "over-inference"    // especula más allá de la evidencia
  | "wrong-focus"       // detalle cierto pero no responde a la pregunta
  | "too-general" | "too-specific"
  | "possible-not-correct"   // gramaticalmente posible, pero no es lo que el examen pide
  | "meaning-ok-grammar-wrong" // el significado encaja, la gramática no
  | "grammar-ok-meaning-wrong" // gramatical, pero no significa lo que el contexto exige
  | "wrong-collocation" | "wrong-register" | "false-friend" | "misheard";

export const TRAP_LABEL: Record<Trap, string> = {
  "true-not-stated": "Cierto, pero el texto no lo dice",
  contradicts: "Contradice el texto",
  "too-extreme": "Demasiado extremo / absoluto",
  "out-of-scope": "Fuera del alcance",
  "word-match": "Trampa de palabras repetidas",
  reversed: "Relación invertida",
  partial: "Solo parcialmente correcto",
  "over-inference": "Inferencia excesiva / especulación",
  "wrong-focus": "Detalle real pero no responde la pregunta",
  "too-general": "Demasiado general",
  "too-specific": "Demasiado específico",
  "possible-not-correct": "Posible, pero no correcto aquí",
  "meaning-ok-grammar-wrong": "Significado bien, gramática mal",
  "grammar-ok-meaning-wrong": "Gramática bien, significado mal",
  "wrong-collocation": "Colocación incorrecta",
  "wrong-register": "Registro inadecuado",
  "false-friend": "Falso amigo",
  misheard: "Sonido parecido (trampa auditiva)",
};

export type ItemKind = "mcq" | "gap" | "kwt" | "wf" | "judge" | "order" | "spot" | "produce" | "ctest" | "tf";

export interface BaseItem {
  id: string;
  kind: ItemKind;
  skill: SkillId;
  tags: string[];          // p. ej. "gram:inversion", "rd:inference"
  lvl: number;             // dificultad 0–100 (ver engine/cefr.ts)
  prompt?: string;
  ctx?: string;            // contexto (texto breve)
  explain: string;         // por qué la respuesta correcta es correcta
  deep?: string;           // explicación de nivel lingüístico avanzado (Professor Mode)
  basic?: boolean;         // error "básico" para el nivel (activa sarcasmo del búho)
  tests?: "grammar" | "meaning" | "both" | "register" | "collocation" | "form";
  audio?: string;          // texto que se reproduce con TTS (pronunciación, dictado)
  audioAccent?: string;
}

export interface MCQItem extends BaseItem {
  kind: "mcq";
  options: string[];
  answer: number;
  why?: (string | null)[];  // por qué cada distractor es incorrecto
  traps?: (Trap | null)[];
}
export interface TFItem extends BaseItem {
  kind: "tf"; // True / False / Not Given (IELTS)
  statement: string;
  answer: "T" | "F" | "NG";
  mode?: "TFNG" | "YNNG";
}
export interface GapItem extends BaseItem {
  kind: "gap";
  text: string;            // usar ___ para el hueco
  answers: string[];       // respuestas aceptadas (sin distinguir mayúsculas)
  hint?: string;
}
export interface KWTItem extends BaseItem {
  kind: "kwt"; // key word transformation (Cambridge)
  first: string;
  key: string;
  start: string;
  end: string;
  answers: string[];
  maxWords?: number;
  minWords?: number;
}
export interface WFItem extends BaseItem {
  kind: "wf"; // word formation
  text: string;            // con ___
  base: string;
  answers: string[];
}
export interface JudgeItem extends BaseItem {
  kind: "judge"; // ¿gramatical? ¿apropiada para el contexto académico?
  sentence: string;
  grammatical: boolean;
  appropriate: boolean;
  better?: string;
  context?: string;        // p. ej. "Research article, Discussion section"
}
export interface OrderItem extends BaseItem {
  kind: "order"; // Build a Sentence
  lead?: string;           // oración previa (diálogo)
  tokens: string[];        // en el orden correcto
  extra?: string[];        // distractores que no se usan
  fixed?: string;          // fragmento inicial ya puesto
  end?: string;            // puntuación final
}
export interface SpotItem extends BaseItem {
  kind: "spot"; // detectar el error
  segments: string[];
  wrong: number;           // índice del segmento incorrecto (-1 = sin error)
  fix: string;
}
export interface ProduceItem extends BaseItem {
  kind: "produce";
  task: string;
  mustUse?: string[];
  minWords?: number;
  maxWords?: number;
  model?: string;
  checklist?: string[];
}
export interface CTestItem extends BaseItem {
  kind: "ctest"; // Complete the Words (TOEFL 2026)
  text: string;            // palabras incompletas con formato {vis|falt}
}

export type Item = MCQItem | TFItem | GapItem | KWTItem | WFItem | JudgeItem | OrderItem | SpotItem | ProduceItem | CTestItem;

export interface Example { t: string; k?: "good" | "bad" | "meh"; note?: string }

export interface Lesson {
  id: string;
  module: "grammar" | "academic" | "strategy" | "pron" | "writing" | "reading" | "listening" | "speaking" | "vocab";
  group?: string;
  title: string;
  tag: string;             // etiqueta de habilidad principal (p. ej. "gram:inversion")
  lvl: number;
  icon?: string;
  summary: string;
  body: string;            // mini-markdown
  examples?: Example[];
  items: Item[];
}

export type Discipline =
  | "linguistics" | "phonetics" | "phonology" | "morphology" | "syntax" | "semantics" | "pragmatics" | "corpus"
  | "biology" | "psychology" | "history" | "astronomy" | "geology" | "environment" | "economics" | "sociology"
  | "anthropology" | "technology" | "education" | "medicine" | "culture" | "archaeology" | "geography"
  | "arts" | "literature" | "science" | "university" | "everyday";

export interface Annotation {
  p: number;               // índice de párrafo
  q: string;               // fragmento exacto
  type: "claim" | "evidence" | "hedge" | "counter" | "stance" | "limit";
  note: string;
}

export interface ReadingSet {
  id: string;
  title: string;
  discipline: Discipline;
  genre: "academic" | "journalistic" | "argumentative" | "expository" | "research" | "daily" | "review";
  lvl: number;
  paragraphs: string[];
  questions: (MCQItem | TFItem | GapItem)[];
  annotations?: Annotation[];
  source?: string;          // nota: texto original escrito para la app
}

export type Accent = "en-US" | "en-GB" | "en-AU" | "en-IN" | "en-IE" | "en-ZA" | "en-CA" | "en-NZ";
export interface Voice { name: string; accent: Accent; gender?: "f" | "m"; pitch?: number }
export interface ListeningSet {
  id: string;
  title: string;
  type: "lecture" | "conversation" | "interview" | "seminar" | "presentation" | "announcement" | "discussion" | "podcast" | "short";
  discipline: Discipline;
  lvl: number;
  voices: Voice[];
  lines: { v: number; t: string }[];
  questions: (MCQItem | GapItem)[];
  note?: string;
}

export interface WritingTask {
  id: string;
  genre: string;
  title: string;
  prompt: string;
  sources?: string[];       // textos de apoyo (síntesis, resumen)
  lvl: number;
  minWords: number;
  maxWords?: number;
  timeMin?: number;
  exam?: ExamId;
  focus: string[];          // aspectos que se evalúan
  checklist: string[];
  phrases?: string[];
  model?: string;           // respuesta modelo (se muestra después del intento)
  mustUseVocab?: number;    // cuántas palabras recientes debe usar
}

export interface SpeakingTask {
  id: string;
  type: "academic" | "exam" | "phd" | "general" | "repeat" | "interview";
  title: string;
  prompt: string;
  context?: string;
  prepSec: number;
  speakSec: number;
  lvl: number;
  exam?: ExamId;
  checklist: string[];
  phrases?: string[];
  modelPoints?: string[];
  target?: string;          // texto exacto a repetir (Listen & Repeat / pronunciación)
}

export interface PhdScenario {
  id: string;
  title: string;
  setting: string;
  lvl: number;
  turns: { who: string; say: string }[];
  task: string;
  mode: "speak" | "write" | "either";
  phrases: { label: string; items: string[] }[];
  pitfalls?: Example[];
  model?: string;
  discipline?: Discipline;
}

export interface VocabSeed {
  w: string;
  pos: string;
  def: string;
  ex: string;               // ejemplo académico
  ex2?: string;             // ejemplo general
  col?: string[];
  fam?: string[];
  syn?: string[];
  ant?: string[];
  tags: string[];
  reg?: "formal" | "neutral" | "informal" | "technical";
  es?: string;
  note?: string;            // confusiones frecuentes / diferencias con palabras similares
  err?: string;             // errores frecuentes
  lvl?: "B2" | "C1" | "C2";
  pre?: string;             // prefijo/sufijo relevante
}

export type ExamId = "toefl" | "cae" | "cpe" | "ielts";
