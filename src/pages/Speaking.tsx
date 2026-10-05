import React, { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { useApp } from "../state";
import { Topbar, go, Empty, OwlSays, Bar } from "../components/ui";
import { SPEAKING_TASKS, PRON_LESSONS } from "../content/index";
import { SpeakingRunner } from "../components/SpeakingRunner";
import { lvlLabel, band } from "../engine/cefr";
import { db } from "../db/db";
import { tagState, tagStatus } from "../engine/model";

export function SpeakingList() {
  const { tr, model, settings } = useApp();
  const [hist, setHist] = useState<any[]>([]);
  useEffect(() => { db.all<any>("speaking").then((h) => setHist(h.sort((a, b) => b.at - a.at))); }, []);
  const groups: [string, string][] = [["phd", tr("Académico / doctorado", "Academic / PhD")], ["academic", tr("Académico", "Academic")], ["exam", tr("Tareas de examen", "Exam tasks")], ["interview", "TOEFL Interview"], ["general", "General"], ["repeat", "Listen & Repeat"]];
  return (
    <div>
      <Topbar title="Speaking" back="#/learn" right={<span className="levelpill">{band(model.skills.speaking.theta).code}</span>} />
      {settings.skip.speaking && <div className="card tight small">{tr("Speaking está marcado como omitido en tus sesiones automáticas, pero puedes practicarlo aquí cuando quieras.", "Skipped in sessions; available here.")}</div>}
      {groups.map(([type, name]) => {
        const ts = SPEAKING_TASKS.filter((t) => t.type === type);
        if (!ts.length) return null;
        return (
          <div key={type}>
            <div className="section-title">{name}</div>
            {ts.map((t) => {
              const done = hist.filter((h) => h.taskId === t.id);
              return (
                <button key={t.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/speaking/${t.id}`)}>
                  <div className={"node " + (done.length ? "done" : "new")}><Icon name="mic" size={22} /></div>
                  <div className="grow">
                    <div className="serif">{t.title}</div>
                    <div className="tiny muted">{lvlLabel(t.lvl)} · {t.speakSec}s{done.length ? ` · ${done.length}×` : ""}</div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function SpeakingPage({ id }: { id: string }) {
  const { tr } = useApp();
  const task = SPEAKING_TASKS.find((t) => t.id === id);
  const [done, setDone] = useState<any>(null);
  if (!task) return <Empty>Not found</Empty>;
  return (
    <div>
      <Topbar title="Speaking" back="#/speaking" />
      {!done ? <SpeakingRunner task={task} mode="practice" exam={task.exam} onDone={setDone} /> : (
        <div>
          <OwlSays text="Saved. Clarity over perfection — always." mood="proud" />
          <div className="row"><button className="btn ghost grow" onClick={() => go("#/speaking")}>{tr("Otra tarea", "Another")}</button><button className="btn primary grow" onClick={() => location.reload()}>{tr("Repetir", "Redo")}</button></div>
        </div>
      )}
    </div>
  );
}

export function PronPage() {
  const { tr, model, settings, setSettings } = useApp();
  return (
    <div>
      <Topbar title={tr("Pronunciación", "Pronunciation")} back="#/learn" right={model.skills.pronunciation.n > 0 ? <span className="levelpill">{band(model.skills.pronunciation.theta).code}</span> : undefined} />
      <OwlSays text="Your pronunciation is already good — I won't nag you. This module is here when you want it: intelligibility, stress, rhythm, intonation, connected speech." mood="soft" size={60} />
      <div className="setrow card tight">
        <div className="grow"><div className="l">{tr("Incluir pronunciación en sesiones automáticas", "Include in sessions")}</div><div className="d">{tr("Desactivado por defecto", "Off by default")}</div></div>
        <input type="checkbox" checked={!settings.skip.pronunciation} onChange={(e) => setSettings({ skip: { ...settings.skip, pronunciation: !e.target.checked } })} />
      </div>
      {PRON_LESSONS.map((l) => {
        const s = tagState(model, l.tag);
        const st = tagStatus(s);
        return (
          <button key={l.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/lesson/${l.id}`)}>
            <div className={"node " + (st === "solid" || st === "mastered" ? "done" : st === "new" ? "new" : "")}>{l.icon}</div>
            <div className="grow"><div className="serif">{l.title}</div><div className="tiny muted">{lvlLabel(l.lvl)} · {l.summary}</div></div>
          </button>
        );
      })}
      <div className="section-title"><Icon name="mic" size={16} /> {tr("Repetir y medir inteligibilidad", "Repeat & measure")}</div>
      {SPEAKING_TASKS.filter((t) => t.type === "repeat").map((t) => (
        <button key={t.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/speaking/${t.id}`)}>
          <div className="node new"><Icon name="repeat" size={22} /></div><div className="grow"><div className="serif small">{t.target}</div><div className="tiny muted">{lvlLabel(t.lvl)}</div></div>
        </button>
      ))}
    </div>
  );
}
