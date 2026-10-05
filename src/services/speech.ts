// Reconocimiento de voz (transcripción) y grabación con análisis de pausas.
// - Android: plugin SpeechRecognition (motor del sistema; puede funcionar offline si el paquete de idioma está descargado)
// - Navegador: Web Speech API (Chrome; requiere conexión)
// - Grabación: MediaRecorder + análisis de energía (pausas, tiempo de fonación) — funciona sin internet
import { call, hasPlugin, listen } from "./native";

export interface AsrUpdate { text: string; final: boolean }
export interface AsrSession { stop: () => Promise<AsrResult> }
export interface AsrResult { text: string; events: { t: number; words: number }[]; startedAt: number; endedAt: number; engine: string }

export function asrAvailable(): boolean {
  return hasPlugin("SpeechRecognition") || !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export async function ensureMicPermission(): Promise<boolean> {
  if (hasPlugin("SpeechRecognition")) {
    try {
      const r = await call<any>("SpeechRecognition", "requestPermissions", { permissions: ["speechRecognition"] });
      return r?.speechRecognition === "granted";
    } catch { return false; }
  }
  return true;
}

export async function startAsr(onUpdate: (u: AsrUpdate) => void, lang = "en-US"): Promise<AsrSession> {
  const startedAt = Date.now();
  const events: { t: number; words: number }[] = [];
  const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

  if (hasPlugin("SpeechRecognition")) {
    const ok = await ensureMicPermission();
    if (!ok) throw new Error("mic-permission");
    let active = true;
    const segments: string[] = [];
    let current = "";
    const emit = () => onUpdate({ text: [...segments, current].filter(Boolean).join(" "), final: false });
    const pr = listen("SpeechRecognition", "partialResults", (d: any) => {
      const m = d?.matches?.[0];
      if (typeof m === "string") {
        current = m;
        events.push({ t: Date.now() - startedAt, words: countWords([...segments, current].join(" ")) });
        emit();
      }
    });
    const restart = async () => {
      if (!active) return;
      if (current) { segments.push(current); current = ""; }
      try {
        await call("SpeechRecognition", "start", { language: lang, maxResults: 1, partialResults: true, popup: false });
      } catch {
        // "No match" / timeout por silencio: reintentar mientras siga activa la grabación
        if (active) setTimeout(restart, 250);
      }
    };
    const ls = listen("SpeechRecognition", "listeningState", (d: any) => {
      if (d?.status === "stopped" && active) setTimeout(restart, 700);
    });
    restart();
    return {
      stop: async () => {
        active = false;
        try { await call("SpeechRecognition", "stop"); } catch {}
        await new Promise((r) => setTimeout(r, 900));
        pr.remove(); ls.remove();
        if (current) segments.push(current);
        return { text: segments.join(" ").trim(), events, startedAt, endedAt: Date.now(), engine: "android" };
      },
    };
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) throw new Error("asr-unavailable");
  const rec = new SR();
  rec.lang = lang; rec.continuous = true; rec.interimResults = true;
  let finals: string[] = [];
  let interim = "";
  let active = true;
  rec.onresult = (e: any) => {
    interim = "";
    const fin: string[] = [];
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) fin.push(r[0].transcript.trim()); else interim += r[0].transcript;
    }
    finals = fin;
    const text = [...finals, interim].join(" ").replace(/\s+/g, " ").trim();
    events.push({ t: Date.now() - startedAt, words: countWords(text) });
    onUpdate({ text, final: false });
  };
  rec.onend = () => { if (active) { try { rec.start(); } catch {} } };
  rec.onerror = () => {};
  rec.start();
  return {
    stop: async () => {
      active = false;
      try { rec.stop(); } catch {}
      await new Promise((r) => setTimeout(r, 600));
      const text = [...finals, interim].join(" ").replace(/\s+/g, " ").trim();
      return { text, events, startedAt, endedAt: Date.now(), engine: "web" };
    },
  };
}

// ---------------------------------------------------------------- grabación + energía
export interface RecResult { blob: Blob | null; url: string | null; durationMs: number; frames: number[]; frameMs: number }
export interface RecSession { stop: () => Promise<RecResult>; level: () => number }

export function recorderAvailable(): boolean {
  return !!(navigator.mediaDevices?.getUserMedia && (window as any).MediaRecorder);
}

export async function startRecorder(): Promise<RecSession> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx: AudioContext = new AC();
  const src = ctx.createMediaStreamSource(stream);
  const an = ctx.createAnalyser();
  an.fftSize = 1024;
  src.connect(an);
  const buf = new Float32Array(an.fftSize);
  const frames: number[] = [];
  const frameMs = 50;
  let lastLevel = 0;
  const iv = setInterval(() => {
    an.getFloatTimeDomainData(buf);
    let s = 0;
    for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
    const rms = Math.sqrt(s / buf.length);
    frames.push(rms); lastLevel = rms;
  }, frameMs);
  const chunks: Blob[] = [];
  let mr: MediaRecorder | null = null;
  try {
    mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    mr.start(250);
  } catch { mr = null; }
  const t0 = Date.now();
  return {
    level: () => lastLevel,
    stop: () =>
      new Promise<RecResult>((resolve) => {
        clearInterval(iv);
        const finish = () => {
          stream.getTracks().forEach((t) => t.stop());
          try { ctx.close(); } catch {}
          const blob = chunks.length ? new Blob(chunks, { type: chunks[0].type || "audio/webm" }) : null;
          resolve({ blob, url: blob ? URL.createObjectURL(blob) : null, durationMs: Date.now() - t0, frames, frameMs });
        };
        if (mr && mr.state !== "inactive") { mr.onstop = finish; mr.stop(); } else finish();
      }),
  };
}

// Análisis de pausas a partir de la energía (independiente del acento)
export interface PauseStats {
  totalSec: number; speechSec: number; phonationRatio: number;
  pauses: number; longPauses: number; meanPause: number; meanRun: number; longestPause: number;
}
export function analyzeFrames(frames: number[], frameMs: number): PauseStats | null {
  if (frames.length < 20) return null;
  const sorted = [...frames].sort((a, b) => a - b);
  const noise = sorted[Math.floor(sorted.length * 0.15)];
  const peak = sorted[Math.floor(sorted.length * 0.95)];
  const thr = noise + (peak - noise) * 0.18;
  const voiced = frames.map((f) => f > thr);
  // suavizar: huecos < 150 ms no son pausas
  const minGap = Math.ceil(150 / frameMs);
  const runs: { v: boolean; len: number }[] = [];
  for (const v of voiced) {
    const last = runs[runs.length - 1];
    if (last && last.v === v) last.len++; else runs.push({ v, len: 1 });
  }
  const merged: { v: boolean; len: number }[] = [];
  for (const r of runs) {
    if (!r.v && r.len < minGap && merged.length) { merged[merged.length - 1].len += r.len; continue; }
    const last = merged[merged.length - 1];
    if (last && last.v === r.v) last.len += r.len; else merged.push({ ...r });
  }
  // recortar silencio inicial y final
  while (merged.length && !merged[0].v) merged.shift();
  while (merged.length && !merged[merged.length - 1].v) merged.pop();
  const sp = merged.filter((r) => r.v), si = merged.filter((r) => !r.v);
  const pauseMin = Math.ceil(250 / frameMs);
  const pauses = si.filter((r) => r.len >= pauseMin);
  const totalSec = (merged.reduce((a, r) => a + r.len, 0) * frameMs) / 1000;
  const speechSec = (sp.reduce((a, r) => a + r.len, 0) * frameMs) / 1000;
  return {
    totalSec, speechSec, phonationRatio: totalSec ? speechSec / totalSec : 0,
    pauses: pauses.length,
    longPauses: pauses.filter((r) => r.len * frameMs >= 1000).length,
    meanPause: pauses.length ? (pauses.reduce((a, r) => a + r.len, 0) * frameMs) / pauses.length / 1000 : 0,
    meanRun: sp.length ? (sp.reduce((a, r) => a + r.len, 0) * frameMs) / sp.length / 1000 : 0,
    longestPause: pauses.length ? (Math.max(...pauses.map((r) => r.len)) * frameMs) / 1000 : 0,
  };
}

// Convierte la grabación a WAV 16 kHz mono (para enviarla opcionalmente a la IA)
export async function blobToWavBase64(blob: Blob): Promise<string> {
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx: AudioContext = new AC();
  const ab = await blob.arrayBuffer();
  const audio = await ctx.decodeAudioData(ab);
  const rate = 16000;
  const len = Math.floor(audio.duration * rate);
  const Off = (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  const off = new Off(1, len, rate);
  const src = off.createBufferSource();
  src.buffer = audio; src.connect(off.destination); src.start();
  const rendered: AudioBuffer = await off.startRendering();
  const data = rendered.getChannelData(0);
  const out = new DataView(new ArrayBuffer(44 + data.length * 2));
  const ws = (o: number, s: string) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, "RIFF"); out.setUint32(4, 36 + data.length * 2, true); ws(8, "WAVE"); ws(12, "fmt ");
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true); out.setUint32(24, rate, true);
  out.setUint32(28, rate * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true); ws(36, "data"); out.setUint32(40, data.length * 2, true);
  for (let i = 0; i < data.length; i++) { const s = Math.max(-1, Math.min(1, data[i])); out.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); }
  try { ctx.close(); } catch {}
  const bytes = new Uint8Array(out.buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
