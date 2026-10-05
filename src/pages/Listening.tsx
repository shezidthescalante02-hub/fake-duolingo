import React, { useEffect, useState } from "react";
import { useApp } from "../state";
import { Topbar, go, Empty, OwlSays } from "../components/ui";
import { LISTENING_SETS } from "../content/index";
import { ListeningRunner } from "../components/ListeningRunner";
import { lvlLabel, band } from "../engine/cefr";
import { db } from "../db/db";
import { availableAccents } from "../services/tts";

export function ListeningList() {
  const { tr, model } = useApp();
  const [seen, setSeen] = useState<string[]>([]);
  const [accents, setAccents] = useState<string[]>([]);
  useEffect(() => { db.kvGet<string[]>("listenSets", []).then(setSeen); availableAccents().then(setAccents); }, []);
  return (
    <div>
      <Topbar title="Listening" back="#/learn" right={<span className="levelpill">{band(model.skills.listening.theta).code}</span>} />
      <div className="small muted">{tr("Clases, conversaciones, seminarios, entrevistas y anuncios con voces de distintos acentos. Control de velocidad 0.75x–2x y transcript en práctica; en simulaciones, condiciones de examen.", "Lectures, conversations, seminars…")}</div>
      {accents.length > 0 && <div className="tiny muted" style={{ marginTop: 4 }}>{tr("Acentos disponibles en este dispositivo", "Accents on this device")}: {accents.join(", ")}</div>}
      <div style={{ height: 8 }} />
      {[...LISTENING_SETS].sort((a, b) => a.lvl - b.lvl).map((s) => (
        <button key={s.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/listening/${s.id}`)}>
          <div className={"node " + (seen.includes(s.id) ? "done" : "new")}>🎧</div>
          <div className="grow">
            <div className="serif">{s.title}</div>
            <div className="tiny muted">{lvlLabel(s.lvl)} · {s.type} · {Array.from(new Set(s.voices.map((v) => v.accent))).join(" / ")}</div>
          </div>
        </button>
      ))}
      <div className="card small muted">{tr("Nota honesta: el audio se genera con las voces del sistema (texto a voz). Son claras y permiten variar acento y velocidad, pero no reproducen todos los rasgos del habla espontánea (titubeos, solapamientos). Para eso, complementa con podcasts y clases reales.", "Audio uses system TTS voices.")}</div>
    </div>
  );
}

export function ListeningPage({ id }: { id: string }) {
  const { tr } = useApp();
  const set = LISTENING_SETS.find((r) => r.id === id);
  const [done, setDone] = useState<{ c: number; n: number } | null>(null);
  if (!set) return <Empty>Not found</Empty>;
  return (
    <div>
      <Topbar title={set.title} back="#/listening" />
      {!done ? <ListeningRunner set={set} mode="practice" onDone={(r) => setDone({ c: r.filter((x) => x.correct).length, n: r.length })} /> : (
        <div>
          <OwlSays text={`${done.c}/${done.n}. ${done.c / done.n >= 0.8 ? "Your ears are sharper than your self-doubt." : "If you understood the audio but missed questions, check the transcript + explanation: were you reacting to words or to meaning?"}`} mood={done.c / done.n >= 0.8 ? "proud" : "thinking"} />
          <button className="btn primary block" onClick={() => go("#/listening")}>{tr("Más audios", "More")}</button>
        </div>
      )}
    </div>
  );
}
