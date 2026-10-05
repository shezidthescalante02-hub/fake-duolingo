import React, { useEffect, useState } from "react";
import { useApp } from "../state";
import { Topbar, go, Empty, OwlSays } from "../components/ui";
import { WRITING_TASKS } from "../content/index";
import { WritingRunner } from "../components/WritingRunner";
import { lvlLabel, band } from "../engine/cefr";
import { db } from "../db/db";

export function WritingList() {
  const { tr, model } = useApp();
  const [hist, setHist] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "acad" | "exam">("all");
  useEffect(() => { db.all<any>("writing").then((h) => setHist(h.sort((a, b) => b.at - a.at))); }, []);
  const tasks = WRITING_TASKS.filter((t) => filter === "all" || (filter === "exam" ? !!t.exam : !t.exam));
  return (
    <div>
      <Topbar title="Writing" back="#/learn" right={<span className="levelpill">{band(model.skills.academicWriting.theta).code}</span>} />
      <OwlSays text="Here we learn to write, not to get texts corrected. I'll show you what's wrong first; the alternatives come after you try again." mood="smug" size={60} />
      <div className="chips" style={{ margin: "10px 0" }}>
        <button className={"chip " + (filter === "all" ? "on" : "")} onClick={() => setFilter("all")}>{tr("Todas", "All")}</button>
        <button className={"chip " + (filter === "acad" ? "on" : "")} onClick={() => setFilter("acad")}>{tr("Académicas / doctorado", "Academic")}</button>
        <button className={"chip " + (filter === "exam" ? "on" : "")} onClick={() => setFilter("exam")}>{tr("De examen", "Exam tasks")}</button>
      </div>
      {tasks.map((t) => {
        const done = hist.filter((h) => h.taskId === t.id);
        return (
          <button key={t.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/writing/${t.id}`)}>
            <div className={"node " + (done.length ? "done" : "new")}>✒️</div>
            <div className="grow">
              <div className="serif">{t.title}</div>
              <div className="tiny muted">{t.genre} · {lvlLabel(t.lvl)} · {t.minWords}{t.maxWords ? "–" + t.maxWords : "+"} {tr("palabras", "words")}{done.length ? ` · ${done.length}× · ${tr("mejor", "best")} ${band(Math.max(...done.map((d) => d.score))).code}` : ""}</div>
            </div>
          </button>
        );
      })}
      {hist.length > 0 && (
        <>
          <div className="section-title">🗂️ {tr("Tus textos", "Your texts")}</div>
          {hist.slice(0, 15).map((h) => (
            <details key={h.id} className="card tight">
              <summary className="small">{new Date(h.at).toLocaleDateString()} · {h.title} · <b>{band(h.score).code}</b> · {h.words} {tr("pal.", "w.")}</summary>
              <div className="serif small" style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{h.v2 || h.v1}</div>
              {h.v2 && <details><summary className="tiny muted">{tr("Ver primera versión", "First version")}</summary><div className="serif small muted" style={{ whiteSpace: "pre-wrap" }}>{h.v1}</div></details>}
            </details>
          ))}
        </>
      )}
    </div>
  );
}

export function WritingPage({ id }: { id: string }) {
  const { tr } = useApp();
  const task = WRITING_TASKS.find((t) => t.id === id);
  const [done, setDone] = useState<any>(null);
  if (!task) return <Empty>Not found</Empty>;
  return (
    <div>
      <Topbar title="Writing" back="#/writing" />
      {!done ? <WritingRunner task={task} mode="practice" exam={task.exam} onDone={setDone} /> : (
        <div>
          <OwlSays text={`Saved. ${done.words} words, estimated ${band(done.score).code}. Every text you write sharpens my picture of you — and yours of English.`} mood="proud" />
          <div className="row"><button className="btn ghost grow" onClick={() => go("#/writing")}>{tr("Otra tarea", "Another task")}</button><button className="btn primary grow" onClick={() => location.reload()}>{tr("Repetir esta", "Redo")}</button></div>
        </div>
      )}
    </div>
  );
}
