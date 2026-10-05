import React, { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import type { SpeakingTask } from "../content/types";
import { Md, Timer, useCountdown, OwlSays, fmtTime } from "./ui";
import { useApp } from "../state";
import { asrAvailable, startAsr, startRecorder, recorderAvailable, analyzeFrames, blobToWavBase64, type AsrSession, type RecSession, type PauseStats } from "../services/speech";
import { isNative } from "../services/native";
import { speechMetrics, alignTarget, lexicalSophistication } from "../engine/textAnalysis";
import { aiReady, speakingFeedback } from "../services/ai";
import { speak, stopSpeaking } from "../services/tts";
import { db, uid } from "../db/db";
import { detectUses, getVocab, review } from "../engine/vocab";
import { band } from "../engine/cefr";

type Stage = "ready" | "listen" | "prep" | "speak" | "analyse" | "typed";
export interface SpeakingResult { score: number; transcript: string }

export function SpeakingRunner({ task, mode = "practice", onDone, exam }: { task: SpeakingTask; mode?: "practice" | "sim" | "diagnostic" | "session"; onDone: (r: SpeakingResult) => void; exam?: string }) {
  const { tr, record, say, addXp, bump, settings } = useApp();
  const practice = mode === "practice" || mode === "session";
  const [stage, setStage] = useState<Stage>("ready");
  const [engine, setEngine] = useState<"asr" | "rec" | "both">(isNative() ? (asrAvailable() ? "asr" : "rec") : asrAvailable() && recorderAvailable() ? "both" : recorderAvailable() ? "rec" : "asr");
  const [live, setLive] = useState("");
  const [transcript, setTranscript] = useState("");
  const [typed, setTyped] = useState("");
  const [err, setErr] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [pauses, setPauses] = useState<PauseStats | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [align, setAlign] = useState<ReturnType<typeof alignTarget> | null>(null);
  const [checks, setChecks] = useState<number[]>([]);
  const [ai, setAi] = useState<any>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [owl, setOwl] = useState<any>(null);
  const [level, setLevel] = useState(0);
  const asrRef = useRef<AsrSession | null>(null);
  const recRef = useRef<RecSession | null>(null);
  const t0 = useRef(0);
  const repeat = task.type === "repeat" && !!task.target;

  useEffect(() => { if (practice) setOwl(say("speakingStart")); return () => { stopSpeaking(); stopAll(); }; }, []);

  const prepLeft = useCountdown(stage === "prep" ? task.prepSec : null, stage === "prep", () => begin());
  const speakLeft = useCountdown(stage === "speak" ? task.speakSec : null, stage === "speak", () => finish());

  useEffect(() => {
    if (stage !== "speak" || !recRef.current) return;
    const iv = setInterval(() => setLevel(recRef.current?.level() || 0), 80);
    return () => clearInterval(iv);
  }, [stage]);

  async function start() {
    setErr("");
    if (repeat) {
      setStage("listen");
      await speak(task.target!, { accent: "en-US", rate: 1 });
      setStage("prep");
      return;
    }
    if (task.prepSec > 0) setStage("prep"); else begin();
  }

  async function begin() {
    setErr("");
    try {
      if (engine === "asr" || engine === "both") asrRef.current = await startAsr((u) => setLive(u.text), "en-US");
    } catch (e: any) {
      if (engine === "asr") { setErr(tr("No se pudo iniciar el reconocimiento de voz. Revisa el permiso del micrófono o usa 'Grabar audio'.", "ASR failed.") + " (" + (e?.message || e) + ")"); return; }
    }
    try {
      if (engine === "rec" || engine === "both") recRef.current = await startRecorder();
    } catch (e: any) {
      if (engine === "rec") { setErr(tr("No se pudo acceder al micrófono.", "Mic unavailable.") + " (" + (e?.message || e) + ")"); return; }
    }
    t0.current = Date.now();
    setStage("speak");
  }

  async function stopAll() {
    const out: any = {};
    if (asrRef.current) { out.asr = await asrRef.current.stop(); asrRef.current = null; }
    if (recRef.current) { out.rec = await recRef.current.stop(); recRef.current = null; }
    return out;
  }

  async function finish() {
    if (stage !== "speak") return;
    setStage("analyse");
    const dur = (Date.now() - t0.current) / 1000;
    const { asr, rec } = await stopAll();
    const text = (asr?.text || live || "").trim();
    setTranscript(text);
    if (rec?.url) { setAudioUrl(rec.url); setBlob(rec.blob); }
    const ps = rec ? analyzeFrames(rec.frames, rec.frameMs) : null;
    setPauses(ps);
    // pausas aproximadas a partir del reconocedor si no hay grabación
    let asrPauses = 0;
    if (!ps && asr?.events?.length) { for (let i = 1; i < asr.events.length; i++) if (asr.events[i].t - asr.events[i - 1].t > 1500) asrPauses++; }
    const m = { ...speechMetrics(text, ps?.speechSec || dur), durationSec: Math.round(dur), asrPauses };
    setMetrics(m);
    if (repeat) setAlign(alignTarget(task.target!, text));
  }

  async function finishTyped() {
    const text = typed.trim();
    setTranscript(text);
    setMetrics({ ...speechMetrics(text, task.speakSec), durationSec: task.speakSec, typed: true });
    setStage("analyse");
  }

  async function runAi() {
    setAiBusy(true);
    try {
      let b64: string | undefined;
      if (blob) { try { b64 = await blobToWavBase64(blob); } catch {} }
      setAi(await speakingFeedback(task.prompt + (task.context ? "\n" + task.context : ""), transcript, { ...metrics, pauses }, b64));
    } catch (e: any) { setErr(String(e.message || e)); }
    finally { setAiBusy(false); }
  }

  function estimate(): number {
    if (repeat && align) return Math.round(35 + align.accuracy * 50);
    if (!metrics) return 50;
    let s = 48;
    const wpm = metrics.wpm;
    if (wpm >= 110 && wpm <= 175) s += 8; else if (wpm >= 90) s += 3; else s -= 6;
    const fillRate = metrics.words ? metrics.fillers / metrics.words : 0;
    if (fillRate < 0.03) s += 4; else if (fillRate > 0.08) s -= 5;
    if (metrics.ttr >= 0.55) s += 4;
    if (metrics.complexMarkers >= 4) s += 4;
    if (new Set(metrics.connectors).size >= 3) s += 3;
    if (pauses) { if (pauses.phonationRatio >= 0.7) s += 4; if (pauses.longPauses >= 4) s -= 5; if (pauses.meanRun >= 2) s += 3; }
    const used = metrics.durationSec / task.speakSec;
    if (used < 0.5) s -= 8;
    const self = checks.length / Math.max(1, task.checklist.length);
    s = s * 0.7 + (40 + self * 45) * 0.3;
    return Math.round(Math.max(20, Math.min(88, s)));
  }

  async function save() {
    const score = ai?.band ? (bandFromCode(ai.band) ?? estimate()) : estimate();
    const typedMode = !!metrics?.typed;
    if (repeat && align) {
      await record({ itemId: task.id, skill: "pronunciation", tags: ["pron:intelligibility"], lvl: task.lvl, correct: align.accuracy >= 0.85, score: align.accuracy, timed: mode !== "practice", timeMs: 0, mode, exam });
      await record({ itemId: task.id + "-s", skill: "speaking", tags: [], lvl: task.lvl, correct: align.accuracy >= 0.85, score: align.accuracy, timed: false, timeMs: 0, mode, exam });
    } else if (!typedMode) {
      await record({ itemId: task.id, skill: "speaking", tags: task.type === "phd" ? ["acad:speaking"] : [], lvl: task.lvl, correct: score >= task.lvl - 3, score: Math.max(0, Math.min(1, (score - 30) / 60)), observed: score, timed: mode !== "practice", timeMs: 0, mode, produce: true, exam });
      if (pauses || metrics) await record({ itemId: task.id + "-f", skill: "fluency", tags: [], lvl: task.lvl, correct: score >= task.lvl, observed: score, timed: false, timeMs: 0, mode, produce: true });
    }
    const vocab = (await getVocab()).filter((v) => !v.archived);
    const used = detectUses(transcript, vocab);
    for (const u of used) await db.put("vocab", { ...u, uses: (u.uses || 0) + 1, prod: review(u.prod, 2) });
    if (used.length) bump("wordUses", used.length);
    await db.put("speaking", { id: uid("s"), taskId: task.id, title: task.title, transcript, metrics, pauses, score, at: Date.now(), ai, typed: typedMode });
    addXp(practice ? 30 : 0, { speaking: typedMode ? 0 : 1, ...(task.type === "phd" ? { phd: 1 } : {}) });
    onDone({ score, transcript });
  }

  return (
    <div>
      {owl && stage === "ready" && <OwlSays text={owl.t} gloss={owl.gloss} mood={owl.mood} />}
      <div className="card">
        <div className="tiny muted">{task.type}{exam ? " · " + exam.toUpperCase() : ""} · {tr("preparación", "prep")} {task.prepSec}s · {tr("respuesta", "response")} {task.speakSec}s</div>
        <h2 style={{ margin: "2px 0 8px" }}>{task.title}</h2>
        {task.context && <div className="ex-context"><Md text={task.context} /></div>}
        {repeat && stage === "ready" ? <div className="small">{tr("Escucharás una oración. Repítela exactamente.", "You'll hear a sentence. Repeat it exactly.")}</div> : !repeat && <Md text={task.prompt} />}
        {practice && task.phrases && stage !== "speak" && (
          <details style={{ marginTop: 8 }}><summary className="small"><Icon name="text" size={16} /> {tr("Expresiones útiles", "Useful phrases")}</summary><div className="chips" style={{ marginTop: 6 }}>{task.phrases.map((p) => <span key={p} className="tag">{p}</span>)}</div></details>
        )}
      </div>

      {stage === "ready" && (
        <div className="card">
          <div className="small muted" style={{ marginBottom: 8 }}>{tr("Método de captura", "Capture method")}</div>
          <div className="chips">
            {asrAvailable() && <button className={"chip " + (engine === "asr" ? "on" : "")} onClick={() => setEngine("asr")}><Icon name="text" size={16} /> {tr("Transcripción en vivo", "Live transcript")}</button>}
            {recorderAvailable() && <button className={"chip " + (engine === "rec" ? "on" : "")} onClick={() => setEngine("rec")}><Icon name="mic" size={16} /> {tr("Grabar audio (pausas + IA)", "Record audio")}</button>}
            {!isNative() && asrAvailable() && recorderAvailable() && <button className={"chip " + (engine === "both" ? "on" : "")} onClick={() => setEngine("both")}><Icon name="sparkle" size={16} /> {tr("Ambos", "Both")}</button>}
          </div>
          <div className="tiny muted" style={{ marginTop: 6 }}>
            {tr("La transcripción usa el reconocedor de voz del sistema: no evalúa tu acento, solo si se te entiende. La grabación mide pausas y fluidez sin internet; la IA (opcional) puede escuchar el audio.", "ASR measures intelligibility, not accent.")}
          </div>
          {err && <div className="small bad" style={{ marginTop: 6 }}>{err}</div>}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn primary grow" onClick={start}><Icon name="mic" size={16} /> {tr("Empezar", "Start")}</button>
            {practice && !repeat && <button className="btn ghost" onClick={() => setStage("typed")}>⌨️ {tr("Sin micrófono", "No mic")}</button>}
          </div>
          {!practice && <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => onDone({ score: -1, transcript: "" })}>{tr("Omitir esta tarea (no puedo hablar ahora)", "Skip this task")}</button>}
        </div>
      )}

      {stage === "listen" && <div className="card center"><Icon name="speaker" size={16} /> {tr("Escucha…", "Listen…")}</div>}

      {stage === "prep" && (
        <div className="card center">
          <div className="small muted">{tr("Preparación", "Preparation")}</div>
          <div style={{ fontSize: "2.4em", fontFamily: "var(--mono)" }}>{fmtTime(prepLeft)}</div>
          <textarea className="input" placeholder={tr("Notas (opcional)", "Notes")} style={{ minHeight: 80 }} />
          {practice && <button className="btn" style={{ marginTop: 10 }} onClick={begin}>{tr("Estoy lista: hablar ya", "Speak now")}</button>}
        </div>
      )}

      {stage === "speak" && (
        <div className="card center">
          <div className="row between"><span className="tag red">● REC</span><Timer left={speakLeft} total={task.speakSec} /></div>
          <button className="rec on" style={{ margin: "18px auto", display: "block" }} onClick={finish}>■</button>
          {recRef.current && <div className="level-meter" style={{ justifyContent: "center" }}>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ height: Math.max(4, Math.min(34, level * 400 * (0.5 + Math.abs(Math.sin(i + Date.now() / 200))))) }} />)}</div>}
          <div className="small muted">{tr("Toca ■ para terminar", "Tap ■ to stop")}</div>
          {live && <div className="card flat tight" style={{ textAlign: "left", marginTop: 10 }}><span className="serif small">{live}</span></div>}
        </div>
      )}

      {stage === "typed" && (
        <div className="card">
          <div className="small muted">{tr("Modo sin micrófono: escribe lo que dirías, de corrido y sin editar mucho (no cuenta como speaking real, pero entrena la organización).", "Type what you'd say.")}</div>
          <textarea className="textarea" value={typed} onChange={(e) => setTyped(e.target.value)} />
          <button className="btn primary block" disabled={typed.trim().length < 20} onClick={finishTyped}>{tr("Analizar", "Analyse")}</button>
        </div>
      )}

      {stage === "analyse" && metrics && (
        <>
          <div className="card">
            <h3><Icon name="chart" size={16} /> {tr("Métricas objetivas", "Objective metrics")}</h3>
            {repeat && align ? (
              <>
                <div className="serif" style={{ lineHeight: 1.9 }}>{align.words.map((w, i) => <span key={i} className={w.ok ? "ok" : "bad"} style={{ marginRight: 5, textDecoration: w.ok ? undefined : "underline" }}>{w.w}</span>)}</div>
                <div className="small" style={{ marginTop: 6 }}>{tr("Palabras reconocidas", "Words recognised")}: <b>{Math.round(align.accuracy * 100)}%</b></div>
                <div className="tiny muted">{tr("Las palabras en rojo no fueron reconocidas: puede ser por pronunciación, omisión o un error del reconocedor. No es un juicio sobre tu acento.", "Red = not recognised.")}</div>
              </>
            ) : (
              <div className="grid2 md4">
                <div className="stat"><div className="v">{metrics.durationSec}s</div><div className="l">{tr("duración", "duration")} / {task.speakSec}s</div></div>
                <div className="stat"><div className="v">{metrics.wpm || "–"}</div><div className="l">{tr("palabras/min", "words/min")}</div></div>
                <div className="stat"><div className="v">{metrics.fillers}</div><div className="l">{tr("muletillas", "fillers")}</div></div>
                <div className="stat"><div className="v">{metrics.ttr || "–"}</div><div className="l">{tr("variedad léxica", "lexical variety")}</div></div>
                <div className="stat"><div className="v">{metrics.complexMarkers}</div><div className="l">{tr("marcadores de complejidad", "complexity markers")}</div></div>
                <div className="stat"><div className="v">{new Set(metrics.connectors).size}</div><div className="l">{tr("conectores distintos", "connectors")}</div></div>
                {pauses ? <>
                  <div className="stat"><div className="v">{Math.round(pauses.phonationRatio * 100)}%</div><div className="l">{tr("tiempo hablando", "phonation time")}</div></div>
                  <div className="stat"><div className="v">{pauses.pauses} / {pauses.longPauses}</div><div className="l">{tr("pausas / pausas >1s", "pauses / long")}</div></div>
                </> : <div className="stat"><div className="v">{metrics.asrPauses ?? "–"}</div><div className="l">{tr("pausas largas (aprox.)", "long pauses (approx.)")}</div></div>}
              </div>
            )}
            {audioUrl && <audio controls src={audioUrl} style={{ width: "100%", marginTop: 10 }} />}
            <div className="card flat tight" style={{ marginTop: 10 }}>
              <div className="small muted">{tr("Transcripción automática (puede tener errores del reconocedor)", "Automatic transcript")}</div>
              <div className="serif">{transcript || <span className="muted">{tr("(sin transcripción — usa la grabación y la autoevaluación)", "(no transcript)")}</span>}</div>
            </div>
          </div>
          {!repeat && (
            <div className="card">
              <h3><Icon name="check" size={16} /> {tr("Autoevaluación", "Self-check")}</h3>
              {task.checklist.map((c, i) => (
                <label key={i} className="row" style={{ padding: "5px 0" }}>
                  <input type="checkbox" checked={checks.includes(i)} onChange={(e) => setChecks(e.target.checked ? [...checks, i] : checks.filter((x) => x !== i))} />
                  <span className="small">{c}</span>
                </label>
              ))}
              {task.modelPoints && <div className="small muted">{task.modelPoints.join(" · ")}</div>}
            </div>
          )}
          {!repeat && (
            <div className="card">
              <h3><Icon name="sparkle" size={16} /> {tr("Feedback con IA (opcional)", "AI feedback")}</h3>
              {!ai && <div className="small muted">{aiReady() ? (blob ? tr("La IA escuchará tu grabación.", "AI will listen to your recording.") : tr("La IA analizará la transcripción.", "AI will analyse the transcript.")) : tr("Sin clave de IA o sin conexión.", "No AI / offline.")}</div>}
              {!ai && aiReady() && <button className="btn sm" style={{ marginTop: 8 }} disabled={aiBusy || (!transcript && !blob)} onClick={runAi}>{aiBusy ? "…" : tr("Analizar con IA", "Analyse with AI")}</button>}
              {err && <div className="small bad">{err}</div>}
              {ai && (
                <div className="small">
                  <p>{ai.overall}</p>
                  {ai.band && <span className="levelpill gold">{ai.band}</span>}
                  {(ai.issues || []).map((x: any, i: number) => <div key={i} className="feedback neutral" style={{ margin: "6px 0" }}><b className="serif">“{x.quote}”</b> — {x.problem}<div className="muted">{x.why}</div><div className="ok">→ {(x.better || []).join(" · ")}</div></div>)}
                  {ai.pronunciation?.length > 0 && <div><b>{tr("Inteligibilidad", "Intelligibility")}:</b> {ai.pronunciation.join("; ")}</div>}
                  {ai.strengths?.length > 0 && <div><b>{tr("Fortalezas", "Strengths")}:</b> {ai.strengths.join("; ")}</div>}
                </div>
              )}
            </div>
          )}
          <div className="sticky-actions">
            <div className="row">
              {practice && <button className="btn ghost" onClick={() => { setStage("ready"); setLive(""); setTranscript(""); setMetrics(null); setAlign(null); setAi(null); setAudioUrl(null); setPauses(null); }}>↺ {tr("Repetir", "Retry")}</button>}
              <button className="btn primary grow" onClick={save}>{tr("Guardar", "Save")} · {band(estimate()).code}*</button>
            </div>
            <div className="tiny muted center" style={{ marginTop: 4 }}>* {tr("estimación automática, confianza baja", "automatic estimate, low confidence")}</div>
          </div>
        </>
      )}
    </div>
  );
}

function bandFromCode(code: string): number | null {
  const m = code.match(/(B1\+?|B2[+-]?|C1[+-]?|C2[+-]?)/);
  if (!m) return null;
  const table: Record<string, number> = { "B1": 30, "B1+": 35, "B2-": 41, "B2": 46, "B2+": 52, "C1-": 57, "C1": 63, "C1+": 69, "C2-": 75, "C2": 81, "C2+": 88 };
  return table[m[1]] ?? null;
}
