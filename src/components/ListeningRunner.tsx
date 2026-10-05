import React, { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import type { ListeningSet } from "../content/types";
import { ItemView, type ItemResult } from "./ItemView";
import { Tap, Md } from "./ui";
import { useApp } from "../state";
import { playLines, stopSpeaking, ttsAvailable } from "../services/tts";
import { diff } from "../engine/difficulty";
import { db } from "../db/db";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export function ListeningRunner({ set, mode = "practice", plays, onDone, exam, questionsFirst = true }: {
  set: ListeningSet; mode?: "practice" | "sim" | "diagnostic" | "session"; plays?: number; onDone: (r: ItemResult[]) => void; exam?: string; questionsFirst?: boolean;
}) {
  const { tr, settings, addXp, bump, lock } = useApp();
  const d = diff(settings.difficulty);
  const practice = mode === "practice" || mode === "session";
  const maxPlays = plays ?? (practice ? (d.replays < 0 ? 99 : d.replays + 1) : 1);
  const [rate, setRate] = useState(practice ? d.ttsRate : 1);
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const [played, setPlayed] = useState(0);
  const [fromLine, setFromLine] = useState(0);
  const [view, setView] = useState<"none" | "transcript" | "explain">("none");
  const [qi, setQi] = useState(0);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [audioDone, setAudioDone] = useState(false);
  const transcriptAllowed = practice && !lock.transcript && (d.transcript || audioDone);

  useEffect(() => () => { stopSpeaking(); }, []);

  const play = async (restart: boolean) => {
    if (playing) return;
    const start = restart ? 0 : fromLine;
    if (restart) { if (played >= maxPlays) return; setPlayed((p) => p + 1); }
    setPlaying(true);
    const finished = await playLines(set.lines, set.voices, rate, start, (i) => { setLine(i); if (i >= 0) setFromLine(i); });
    setPlaying(false);
    if (finished) { setAudioDone(true); setFromLine(0); setLine(-1); }
  };
  const pause = async () => { await stopSpeaking(); setPlaying(false); };

  const canPause = practice;
  const q = set.questions[qi];
  const showQ = questionsFirst || audioDone;

  return (
    <div>
      <div className="card">
        <div className="row between">
          <div>
            <h2 style={{ margin: 0 }}>{set.title}</h2>
            <div className="tiny muted">{set.type} · {set.voices.map((v) => `${v.name} (${v.accent})`).join(", ")}</div>
          </div>
          <span className="tag">{tr("reproducciones", "plays")}: {played}/{maxPlays >= 99 ? "∞" : maxPlays}</span>
        </div>
        {set.note && <div className="small muted" style={{ marginTop: 6 }}>{set.note}</div>}
        {!ttsAvailable() && <div className="small bad" style={{ marginTop: 8 }}>{tr("Este dispositivo no tiene voz sintetizada disponible. En Android, instala/activa 'Servicios de voz de Google' y descarga voces en inglés.", "No TTS voice available.")}</div>}
        <div className="row wrap" style={{ marginTop: 12, gap: 8 }}>
          {!playing ? (
            <>
              <button className="btn primary" disabled={played >= maxPlays && fromLine === 0} onClick={() => play(fromLine === 0)}>
                ▶ {fromLine > 0 ? tr("Continuar", "Resume") : played ? tr("Repetir", "Replay") : tr("Reproducir", "Play")}
              </button>
              {fromLine > 0 && practice && <button className="btn ghost" disabled={played >= maxPlays} onClick={() => { setFromLine(0); play(true); }}>↺ {tr("Desde el inicio", "From start")}</button>}
            </>
          ) : (
            canPause ? <button className="btn" onClick={pause}><Icon name="pause" size={16} /> {tr("Pausa", "Pause")}</button> : <span className="tag gold"><Icon name="speaker" size={16} /> {tr("Reproduciendo… (sin pausa en simulación)", "Playing… (no pause in simulation)")}</span>
          )}
        </div>
        {practice && (
          <>
            <div className="chips" style={{ marginTop: 10 }}>
              {SPEEDS.map((s) => <button key={s} className={"chip " + (rate === s ? "on" : "")} disabled={playing} onClick={() => { setRate(s); if (s >= 1.5) bump("fastListening"); }}>{s}x</button>)}
            </div>
            <div className="chips" style={{ marginTop: 8 }}>
              <button className={"chip " + (view === "none" ? "on" : "")} onClick={() => setView("none")}><Icon name="headphones" size={16} /> {tr("Solo audio", "Audio only")}</button>
              <button className={"chip " + (view === "transcript" ? "on" : "")} disabled={!transcriptAllowed} onClick={() => setView("transcript")}><Icon name="text" size={16} /> {tr("Audio + transcript", "Audio + transcript")}</button>
              <button className={"chip " + (view === "explain" ? "on" : "")} disabled={!audioDone || lock.transcript} onClick={() => setView("explain")}><Icon name="teacher" size={16} /> Transcript + {tr("explicación", "explanation")}</button>
            </div>
            {!transcriptAllowed && <div className="tiny muted" style={{ marginTop: 4 }}>{tr("El transcript se desbloquea al terminar el audio (en este modo de dificultad).", "Transcript unlocks after listening in this mode.")}</div>}
          </>
        )}
        {!practice && <div className="lock" style={{ marginTop: 10 }}><Icon name="lock" size={16} /> {tr("Condiciones de examen: sin transcript, sin cambio de velocidad", "Exam conditions")}{maxPlays > 1 ? ` · ${tr("se escucha", "heard")} ${maxPlays} ${tr("veces", "times")}` : ` · ${tr("se escucha una vez", "heard once")}`}</div>}
        {(view !== "none") && practice && (
          <div className="card flat tight" style={{ marginTop: 10 }}>
            {set.lines.map((l, i) => (
              <p key={i} style={{ margin: "6px 0", background: i === line ? "var(--gold-soft)" : undefined, borderRadius: 6, padding: "2px 4px" }}>
                <b className="small">{set.voices[l.v]?.name}:</b> <span className="serif"><Tap text={l.t} source="listening" /></span>
              </p>
            ))}
          </div>
        )}
        {view === "explain" && practice && (
          <div className="card flat tight">
            <h3><Icon name="teacher" size={16} /> {tr("Claves de comprensión", "Comprehension keys")}</h3>
            {set.questions.map((qq, i) => (
              <div key={qq.id} className="small" style={{ margin: "8px 0" }}><b>Q{i + 1}.</b> <Md text={qq.explain || ""} inline /></div>
            ))}
            <div className="tiny muted">{tr("Si entendiste el audio pero fallaste, compara: ¿reaccionaste a palabras sueltas o al significado?", "Did you react to words or to meaning?")}</div>
          </div>
        )}
      </div>

      {practice && !audioDone && (
        <div className="card flat">
          <div className="small gold" style={{ marginBottom: 6 }}><Icon name="eye" size={16} /> {tr("Lee las preguntas antes de escuchar (como en el examen). Respondes al terminar el audio.", "Preview the questions first.")}</div>
          {set.questions.map((qq, i) => <div key={qq.id} className="small" style={{ margin: "4px 0" }}><b>{i + 1}.</b> {(qq as any).prompt || (qq as any).text}</div>)}
        </div>
      )}
      {showQ && q && (!practice || audioDone) && (
        <div className="card">
          <ItemView key={q.id} item={q} mode={mode === "session" ? "session" : mode} feedback={practice} exam={exam}
            context={set.lines.map((l) => l.t).join(" ")}
            onDone={(r) => {
              const res = [...results, r];
              setResults(res);
              if (qi + 1 >= set.questions.length) {
                stopSpeaking();
                db.kvGet<string[]>("listenSets", []).then((s) => db.kvSet("listenSets", Array.from(new Set([...s, set.id]))));
                if (practice) addXp(20, { listenings: 1 });
                onDone(res);
              } else setQi(qi + 1);
            }} />
        </div>
      )}
    </div>
  );
}
