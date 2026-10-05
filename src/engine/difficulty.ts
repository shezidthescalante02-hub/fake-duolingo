// Modos de dificultad ("¿Cuánto quieres sufrir?"). Cada modo cambia parámetros reales.
export type DiffId = "chill" | "normal" | "academic" | "toefl" | "c2";

export interface DiffMode {
  id: DiffId;
  name: string;
  desc: string;
  lvlOffset: number;       // desplazamiento de dificultad de ítems respecto a tu nivel
  timer: "none" | "soft" | "exam" | "tight"; // presión de tiempo en práctica
  timeFactor: number;      // multiplicador del tiempo base por ítem
  ttsRate: number;         // velocidad del audio en práctica
  transcript: boolean;     // transcripción disponible en práctica
  replays: number;         // reproducciones permitidas (-1 = ilimitadas)
  wordsFactor: number;     // multiplicador de longitud mínima en producción
  mustUse: number;         // palabras recientes obligatorias en producción
  trapBias: number;        // preferencia por ítems con distractores difíciles (0–1)
  inferenceBias: number;   // preferencia por preguntas de inferencia
  hints: boolean;
  xp: number;              // multiplicador de XP
  cls: string;
}

export const DIFFS: DiffMode[] = [
  { id: "chill", name: "Chill", desc: "Sin reloj, audio más lento, pistas visibles. Para días cansados.", lvlOffset: -6, timer: "none", timeFactor: 1.6, ttsRate: 0.9, transcript: true, replays: -1, wordsFactor: 0.8, mustUse: 1, trapBias: 0, inferenceBias: 0.2, hints: true, xp: 0.8, cls: "d0" },
  { id: "normal", name: "Normal", desc: "Tu nivel real. Reloj suave opcional.", lvlOffset: 0, timer: "soft", timeFactor: 1.3, ttsRate: 1.0, transcript: true, replays: 2, wordsFactor: 1, mustUse: 2, trapBias: 0.3, inferenceBias: 0.35, hints: true, xp: 1, cls: "d1" },
  { id: "academic", name: "Academic Hell", desc: "Textos más densos, más nominalización, producción más larga y contextos académicos.", lvlOffset: 6, timer: "soft", timeFactor: 1.1, ttsRate: 1.05, transcript: false, replays: 1, wordsFactor: 1.3, mustUse: 2, trapBias: 0.5, inferenceBias: 0.5, hints: false, xp: 1.3, cls: "d2" },
  { id: "toefl", name: "TOEFL Hell", desc: "Tiempos de examen estrictos, sin transcripción ni repetición, distractores agresivos.", lvlOffset: 6, timer: "exam", timeFactor: 1, ttsRate: 1.1, transcript: false, replays: 0, wordsFactor: 1.2, mustUse: 2, trapBias: 0.75, inferenceBias: 0.6, hints: false, xp: 1.4, cls: "d3" },
  { id: "c2", name: "C2 Nightmare", desc: "Ítems por encima de tu nivel, menos tiempo, audio rápido, inferencias finas, 3 palabras nuevas obligatorias.", lvlOffset: 14, timer: "tight", timeFactor: 0.85, ttsRate: 1.2, transcript: false, replays: 0, wordsFactor: 1.5, mustUse: 3, trapBias: 1, inferenceBias: 0.8, hints: false, xp: 1.6, cls: "d4" },
];

export function diff(id: DiffId): DiffMode {
  return DIFFS.find((d) => d.id === id) ?? DIFFS[1];
}

// Tiempo base (segundos) por tipo de ítem, antes del factor del modo
export const BASE_SECONDS: Record<string, number> = {
  mcq: 45, tf: 35, gap: 40, kwt: 75, wf: 35, judge: 40, order: 50, spot: 40, produce: 300, ctest: 150,
};
