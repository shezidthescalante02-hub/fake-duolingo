import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import type { ReadingSet, Annotation } from "../content/types";
import { ItemView, type ItemResult } from "./ItemView";
import { Tap, Timer, useCountdown, Md } from "./ui";
import { useApp } from "../state";
import { db } from "../db/db";

const ANN_LABEL: Record<Annotation["type"], string> = { claim: "Claim", evidence: "Evidence", hedge: "Hedge", counter: "Counterargument", stance: "Stance", limit: "Limitation" };

export function ReadingRunner({ set, mode = "practice", limitSec, onDone, exam }: {
  set: ReadingSet; mode?: "practice" | "sim" | "diagnostic" | "session"; limitSec?: number | null; onDone: (r: ItemResult[]) => void; exam?: string;
}) {
  const { tr, bump, addXp, lock } = useApp();
  const [tab, setTab] = useState<"text" | "q">("text");
  const [qi, setQi] = useState(0);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [researcher, setResearcher] = useState(false);
  const [rlrStage, setRlrStage] = useState<"off" | "guess" | "reveal">("off");
  const [guessThesis, setGuessThesis] = useState<number | null>(null);
  const timed = !!limitSec;
  const done = useRef(false);
  const finish = (res: ItemResult[]) => {
    if (done.current) return; done.current = true;
    db.kvGet<string[]>("readSets", []).then((s) => db.kvSet("readSets", Array.from(new Set([...s, set.id]))));
    if (mode === "practice" || mode === "session") addXp(20, { readings: 1 });
    onDone(res);
  };
  const left = useCountdown(limitSec ?? null, timed && qi < set.questions.length, () => finish(results));
  const feedback = mode === "practice" || mode === "session";
  const canResearch = feedback && !lock.transcript && (set.annotations?.length || 0) > 0;

  // marcar anotaciones en el párrafo
  const renderPara = (p: string, i: number) => {
    if (!researcher || !set.annotations) return <Tap text={p} source={exam ? "sim:" + exam : "reading"} />;
    const anns = set.annotations.filter((a) => a.p === i && p.includes(a.q));
    if (!anns.length) return <Tap text={p} />;
    const pieces: React.ReactNode[] = [];
    let rest = p, k = 0;
    const sorted = [...anns].sort((a, b) => p.indexOf(a.q) - p.indexOf(b.q));
    for (const a of sorted) {
      const idx = rest.indexOf(a.q);
      if (idx < 0) continue;
      pieces.push(<Tap key={k++} text={rest.slice(0, idx)} />);
      pieces.push(<span key={k++} className={"mark-" + a.type} title={a.note}><Tap text={a.q} /><sup className="tiny gold"> {ANN_LABEL[a.type]}</sup></span>);
      rest = rest.slice(idx + a.q.length);
    }
    pieces.push(<Tap key={k++} text={rest} />);
    return <>{pieces}</>;
  };

  const thesisOptions = useMemo(() => {
    const claims = (set.annotations || []).filter((a) => a.type === "claim" || a.type === "stance");
    const others = (set.annotations || []).filter((a) => a.type === "evidence" || a.type === "hedge" || a.type === "limit");
    if (!claims.length || others.length < 2) return null;
    const correct = claims[0];
    const opts = [correct, others[0], others[1]].sort(() => Math.random() - 0.5);
    return { opts, answer: opts.indexOf(correct) };
  }, [set.id]);

  useEffect(() => {
    if (rlrStage === "guess" && !thesisOptions) { setRlrStage("reveal"); setResearcher(true); bump("rlr"); }
  }, [rlrStage, thesisOptions]);

  const q = set.questions[qi];
  return (
    <div>
      <div className="row between" style={{ marginBottom: 8 }}>
        <div className="chips">
          <button className={"chip " + (tab === "text" ? "on" : "")} onClick={() => setTab("text")}><Icon name="text" size={16} /> {tr("Texto", "Text")}</button>
          <button className={"chip " + (tab === "q" ? "on" : "")} onClick={() => setTab("q")}><Icon name="help" size={16} /> {tr("Preguntas", "Questions")} {Math.min(qi + 1, set.questions.length)}/{set.questions.length}</button>
        </div>
        {timed && <Timer left={left} total={limitSec!} />}
      </div>

      {tab === "text" && (
        <div className="card">
          <div className="row between">
            <h2 style={{ margin: 0 }}>{set.title}</h2>
            {canResearch && (
              <button className={"btn xs " + (researcher ? "gold" : "ghost")} onClick={() => { if (!researcher && rlrStage === "off") setRlrStage("guess"); else { setResearcher(!researcher); } }}>
                <Icon name="search" size={16} /> Read like a researcher
              </button>
            )}
          </div>
          <div className="tiny muted" style={{ margin: "4px 0 10px" }}>{set.discipline} · {set.genre}{feedback ? " · " + tr("toca cualquier palabra para buscarla", "tap any word") : ""}</div>
          {rlrStage === "guess" && thesisOptions && (
            <div className="feedback neutral">
              <h4><Icon name="search" size={16} /> {tr("Antes de ver el análisis: ¿cuál de estos fragmentos expresa la afirmación principal (claim) o la postura del autor?", "Which fragment is the main claim?")}</h4>
              {thesisOptions.opts.map((a, i) => (
                <button key={i} className={"opt " + (guessThesis === null ? "" : i === thesisOptions.answer ? "right" : guessThesis === i ? "wrong" : "dim")} disabled={guessThesis !== null} onClick={() => setGuessThesis(i)}>
                  <span className="k">{String.fromCharCode(65 + i)}</span><span className="serif">“{a.q}”</span>
                </button>
              ))}
              {guessThesis !== null && (
                <>
                  <div className="small" style={{ margin: "6px 0" }}>{thesisOptions.opts[thesisOptions.answer].note}</div>
                  <button className="btn sm gold" onClick={() => { setRlrStage("reveal"); setResearcher(true); bump("rlr"); }}>{tr("Ver el texto anotado", "Show annotated text")}</button>
                </>
              )}
            </div>
          )}
          {researcher && (
            <div className="legend" style={{ margin: "8px 0" }}>
              {(Object.keys(ANN_LABEL) as Annotation["type"][]).map((t) => <span key={t}><i className={"mark-" + t} style={{ display: "inline-block" }} />{ANN_LABEL[t]}</span>)}
            </div>
          )}
          <div className="passage">
            {set.paragraphs.map((p, i) => <p key={i}><span className="pn">{i + 1}</span>{renderPara(p, i)}</p>)}
          </div>
          {researcher && set.annotations && (
            <div className="card flat tight">
              <h3><Icon name="search" size={16} /> {tr("Cómo está construido este texto", "How this text is built")}</h3>
              {set.annotations.map((a, i) => (
                <div key={i} className="small" style={{ margin: "6px 0" }}>
                  <span className={"tag " + (a.type === "claim" ? "blue" : a.type === "evidence" ? "green" : a.type === "hedge" ? "gold" : a.type === "counter" ? "red" : "")}>{ANN_LABEL[a.type]} · ¶{a.p + 1}</span> <Md text={a.note} inline />
                </div>
              ))}
            </div>
          )}
          <div className="sticky-actions"><button className="btn primary block" onClick={() => setTab("q")}>{tr("Ir a las preguntas", "Go to questions")} →</button></div>
        </div>
      )}

      {tab === "q" && q && (
        <div className="card">
          <ItemView key={q.id} item={q} mode={mode === "session" ? "session" : mode} feedback={feedback} exam={exam} context={set.paragraphs.join("\n\n")}
            index={qi} total={set.questions.length}
            onDone={(r) => {
              const res = [...results, r];
              setResults(res);
              if (qi + 1 >= set.questions.length) finish(res); else setQi(qi + 1);
            }} />
        </div>
      )}
    </div>
  );
}
