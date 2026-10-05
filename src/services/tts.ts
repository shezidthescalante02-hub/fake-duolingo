// Texto a voz: Android TTS (offline, voces del sistema) o Web Speech API en navegador.
import { call, hasPlugin } from "./native";
import type { Accent, Voice } from "../content/types";

let volume = 1;
export function setVoiceVolume(v: number) { volume = Math.max(0, Math.min(1, v)); }

let webVoices: SpeechSynthesisVoice[] = [];
function loadWebVoices() {
  try {
    webVoices = window.speechSynthesis?.getVoices() || [];
  } catch { webVoices = []; }
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadWebVoices();
  window.speechSynthesis.onvoiceschanged = loadWebVoices;
}

let nativeVoices: { voiceURI: string; name: string; lang: string }[] | null = null;
async function getNativeVoices() {
  if (nativeVoices) return nativeVoices;
  try {
    const r = await call<{ voices: any[] }>("TextToSpeech", "getSupportedVoices");
    nativeVoices = r.voices || [];
  } catch { nativeVoices = []; }
  return nativeVoices;
}

export function ttsAvailable(): boolean {
  return hasPlugin("TextToSpeech") || (typeof window !== "undefined" && "speechSynthesis" in window);
}

let cancelled = false;
let currentUtter: SpeechSynthesisUtterance | null = null;

export async function stopSpeaking() {
  cancelled = true;
  if (hasPlugin("TextToSpeech")) { try { await call("TextToSpeech", "stop"); } catch {} }
  else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function normLang(l: string) { return l.replace("_", "-").toLowerCase(); }

export async function availableAccents(): Promise<Accent[]> {
  const set = new Set<string>();
  if (hasPlugin("TextToSpeech")) {
    const vs = await getNativeVoices();
    for (const v of vs) set.add(normLang(v.lang));
  } else {
    loadWebVoices();
    for (const v of webVoices) set.add(normLang(v.lang));
  }
  const all: Accent[] = ["en-US", "en-GB", "en-AU", "en-IN", "en-IE", "en-ZA", "en-CA", "en-NZ"];
  return all.filter((a) => set.has(a.toLowerCase()));
}

// Elige una voz distinta por hablante (índice) dentro del acento pedido
async function pickNativeVoice(accent: string, speakerIdx: number): Promise<number | undefined> {
  const vs = await getNativeVoices();
  const matches = vs.map((v, i) => ({ v, i })).filter(({ v }) => normLang(v.lang) === accent.toLowerCase());
  if (!matches.length) return undefined;
  // preferir voces locales (offline)
  const local = matches.filter(({ v }) => (v as any).localService === true || /local/i.test(v.name) || /local/i.test(v.voiceURI));
  const pool = local.length ? local : matches;
  return pool[speakerIdx % pool.length].i;
}

function pickWebVoice(accent: string, speakerIdx: number, gender?: string): SpeechSynthesisVoice | undefined {
  loadWebVoices();
  let pool = webVoices.filter((v) => normLang(v.lang) === accent.toLowerCase());
  if (!pool.length) pool = webVoices.filter((v) => normLang(v.lang).startsWith("en"));
  if (!pool.length) return undefined;
  if (gender) {
    const g = pool.filter((v) => (gender === "f" ? /female|woman|samantha|karen|moira|tessa|serena|fiona|victoria|zira|susan|hazel|libby|sonia|natasha/i : /male|daniel|alex|fred|george|ryan|thomas|david|mark|guy|oliver/i).test(v.name));
    if (g.length) pool = g;
  }
  return pool[speakerIdx % pool.length];
}

export async function speak(text: string, opts: { accent?: string; rate?: number; voice?: Voice; speakerIdx?: number } = {}): Promise<void> {
  cancelled = false;
  const accent = opts.voice?.accent || opts.accent || "en-US";
  const rate = opts.rate ?? 1;
  const pitch = opts.voice?.pitch ?? (opts.voice?.gender === "m" ? 0.92 : opts.voice?.gender === "f" ? 1.06 : 1);
  if (hasPlugin("TextToSpeech")) {
    const voice = await pickNativeVoice(accent, opts.speakerIdx ?? 0);
    try {
      await call("TextToSpeech", "speak", { text, lang: accent, rate, pitch, volume, voice, category: "playback", queueStrategy: 0 });
    } catch (e) {
      // si el acento no está instalado, usar inglés de EE. UU.
      await call("TextToSpeech", "speak", { text, lang: "en-US", rate, pitch, volume, category: "playback", queueStrategy: 0 });
    }
    return;
  }
  if (!("speechSynthesis" in window)) throw new Error("tts-unavailable");
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = accent; u.rate = rate; u.pitch = pitch; u.volume = volume;
    const v = pickWebVoice(accent, opts.speakerIdx ?? 0, opts.voice?.gender);
    if (v) u.voice = v;
    let settled = false;
    const finish = () => { if (!settled) { settled = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    // Respaldo: algunos navegadores no disparan 'end' (o no tienen voces)
    const est = (text.split(/\s+/).length / (2.6 * rate)) * 1000 + 2500;
    setTimeout(finish, est);
    currentUtter = u;
    window.speechSynthesis.speak(u);
    // Chrome a veces se queda "pausado" con textos largos
    const keep = setInterval(() => {
      if (!window.speechSynthesis.speaking) { clearInterval(keep); return; }
      window.speechSynthesis.pause(); window.speechSynthesis.resume();
    }, 12000);
    u.addEventListener("end", () => clearInterval(keep));
  });
}

// Reproduce un diálogo línea por línea. onLine informa la línea actual. Devuelve false si se detuvo.
export async function playLines(lines: { v: number; t: string }[], voices: Voice[], rate: number, from = 0, onLine?: (i: number) => void): Promise<boolean> {
  cancelled = false;
  for (let i = from; i < lines.length; i++) {
    if (cancelled) return false;
    onLine?.(i);
    const l = lines[i];
    const voice = voices[l.v] || voices[0];
    await speak(l.t, { voice, rate, speakerIdx: l.v });
    if (cancelled) return false;
    await new Promise((r) => setTimeout(r, 250));
  }
  onLine?.(-1);
  return true;
}

export function wasCancelled() { return cancelled; }
