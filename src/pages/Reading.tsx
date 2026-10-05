import React, { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { useApp } from "../state";
import { Topbar, go, Empty, OwlSays } from "../components/ui";
import { READINGS, addCustomReading } from "../content/index";
import { ReadingRunner } from "../components/ReadingRunner";
import { lvlLabel, band } from "../engine/cefr";
import { db } from "../db/db";
import { aiReady, generateReading } from "../services/ai";
import type { ReadingSet } from "../content/types";
import { skillOf } from "../content/helpers";

const DISCIPLINES = ["linguistics", "phonology", "phonetics", "archaeology", "astronomy", "psychology", "economics", "geology", "biology", "history", "medicine", "literature", "technology", "sociology", "anthropology", "environment", "education", "arts", "culture"];

export function ReadingList() {
  const { tr, model } = useApp();
  const [seen, setSeen] = useState<string[]>([]);
  const [d, setD] = useState<string>(new URLSearchParams(location.hash.split("?")[1] || "").get("d") || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { db.kvGet<string[]>("readSets", []).then(setSeen); }, []);
  const ling = ["linguistics", "phonology", "phonetics", "morphology", "syntax", "semantics", "pragmatics", "corpus"];
  const list = READINGS.filter((r) => !d || (d === "culture" ? !ling.includes(r.discipline) : r.discipline === d)).sort((a, b) => a.lvl - b.lvl);
  const gen = async (disc: string) => {
    setBusy(true); setErr("");
    try {
      const target = Math.round(model.skills.reading.theta + 4);
      const r = await generateReading(disc, target);
      const id = "ai-r-" + Date.now();
      const set: ReadingSet = {
        id, title: r.title, discipline: disc as any, genre: "academic", lvl: target, paragraphs: r.paragraphs, source: "Generado con IA (Gemini) — revisa con espíritu crítico",
        questions: (r.questions || []).map((q: any, k: number) => ({ ...q, kind: "mcq", id: `${id}-q${k}`, skill: "reading", tags: q.tags?.length ? q.tags : ["rd:detail"], lvl: target })),
      };
      await addCustomReading(set);
      go(`#/reading/${id}`);
    } catch (e: any) { setErr(String(e.message || e)); } finally { setBusy(false); }
  };
  return (
    <div>
      <Topbar title="Reading" back="#/learn" right={<span className="levelpill">{band(model.skills.reading.theta).code}</span>} />
      <div className="small muted">{tr("Textos originales de distintas disciplinas, progresivamente más difíciles. Usa “Read like a researcher” para ver cómo está construido cada texto.", "Original texts by discipline.")}</div>
      <div className="chips scroll" style={{ margin: "10px 0" }}>
        <button className={"chip " + (!d ? "on" : "")} onClick={() => setD("")}>{tr("Todas", "All")}</button>
        <button className={"chip " + (d === "culture" ? "on" : "")} onClick={() => setD("culture")}><Icon name="globe" size={16} /> {tr("Cultura general", "General knowledge")}</button>
        {Array.from(new Set(READINGS.map((r) => r.discipline))).map((x) => <button key={x} className={"chip " + (d === x ? "on" : "")} onClick={() => setD(x)}>{x}</button>)}
      </div>
      {list.map((r) => (
        <button key={r.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/reading/${r.id}`)}>
          <div className={"node " + (seen.includes(r.id) ? "done" : "new")}><Icon name="book" size={22} /></div>
          <div className="grow">
            <div className="serif">{r.title}</div>
            <div className="tiny muted">{lvlLabel(r.lvl)} · {r.discipline} · {r.questions.length} {tr("preguntas", "questions")}{r.annotations ? " · researcher" : ""}{r.source ? " · IA" : ""}</div>
          </div>
        </button>
      ))}
      {list.length === 0 && <Empty>{tr("Aún no hay textos en esta categoría.", "None yet.")}</Empty>}
      <div className="card">
        <h3><Icon name="sparkle" size={16} /> {tr("Generar un texto nuevo", "Generate a new text")}</h3>
        {aiReady() ? (
          <>
            <div className="small muted">{tr("Texto original + 8 preguntas a tu nivel, en la disciplina que elijas.", "Original text + 8 questions at your level.")}</div>
            <div className="chips" style={{ marginTop: 8 }}>{DISCIPLINES.map((x) => <button key={x} className="chip" disabled={busy} onClick={() => gen(x)}>{x}</button>)}</div>
            {busy && <div className="small muted" style={{ marginTop: 6 }}>Strix {tr("está escribiendo…", "is writing…")}</div>}
            {err && <div className="small bad">{err}</div>}
          </>
        ) : <div className="small muted">{tr("Disponible con una clave gratuita de Gemini (Ajustes → IA).", "Needs a free Gemini key.")}</div>}
      </div>
    </div>
  );
}

export function ReadingPage({ id }: { id: string }) {
  const { tr } = useApp();
  const set = READINGS.find((r) => r.id === id);
  const [done, setDone] = useState<{ c: number; n: number } | null>(null);
  if (!set) return <Empty>Not found</Empty>;
  return (
    <div>
      <Topbar title={set.title} back="#/reading" />
      {set.source && <div className="tiny muted" style={{ marginBottom: 6 }}>{set.source}</div>}
      {!done ? <ReadingRunner set={set} mode="practice" onDone={(r) => setDone({ c: r.filter((x) => x.correct).length, n: r.length })} /> : (
        <div>
          <OwlSays text={done.c / done.n >= 0.8 ? `${done.c}/${done.n}. You read like someone who reviews papers for fun.` : `${done.c}/${done.n}. Let's look at which question types tripped you — the dashboard knows.`} mood={done.c / done.n >= 0.8 ? "proud" : "thinking"} />
          <div className="row"><button className="btn ghost grow" onClick={() => go("#/reading")}>{tr("Más textos", "More texts")}</button><button className="btn primary grow" onClick={() => go("#/dashboard")}>{tr("Ver análisis", "See analysis")}</button></div>
        </div>
      )}
    </div>
  );
}
