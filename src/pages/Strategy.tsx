import React, { useMemo, useState } from "react";
import { useApp } from "../state";
import { Topbar, go, OwlSays, Bar, Md } from "../components/ui";
import { STRATEGY_LESSONS, standaloneItems } from "../content/index";
import { TRAP_LABEL, type Item, type MCQItem } from "../content/types";
import { overthinkIndex, pressureGap, tagState, tagStatus } from "../engine/model";
import { lvlLabel } from "../engine/cefr";
import { pickItems } from "../engine/session";
import { sfx } from "../services/sound";

export function StrategyPage() {
  const { tr, model } = useApp();
  const ot = overthinkIndex(model);
  const pg = pressureGap(model);
  const traps = Object.entries(model.traps).filter(([, v]) => v.seen >= 2).map(([k, v]) => ({ k, rate: v.fell / v.seen, ...v })).sort((a, b) => b.rate - a.rate);
  const c = model.causes;
  const totalCauses = Object.values(c).reduce((a, b) => a + b, 0);
  return (
    <div>
      <Topbar title={tr("Estrategia de examen", "Exam strategy")} back="#/learn" />
      <div className="card">
        <h3>🌀 {tr("Tu sobreanálisis", "Your overthinking")}</h3>
        {ot.total === 0 ? <div className="small muted">{tr("Aún no hay cambios de respuesta registrados.", "No answer changes yet.")}</div> : (
          <>
            <div className="grid2" style={{ marginTop: 6 }}>
              <div className="stat"><div className="v bad">{ot.harmful}</div><div className="l">{tr("correcta → incorrecta", "right → wrong")}</div></div>
              <div className="stat"><div className="v ok">{ot.helpful}</div><div className="l">{tr("incorrecta → correcta", "wrong → right")}</div></div>
            </div>
            <div className="small" style={{ marginTop: 8 }}>
              {ot.harmful > ot.helpful
                ? tr("Tus cambios te restan más de lo que te suman. Regla: cambia solo si puedes señalar la evidencia (una palabra del texto, una restricción gramatical).", "Your changes hurt more than they help.")
                : tr("Tus cambios suelen ayudarte: revisar no es tu problema. Sigue cambiando cuando tengas evidencia.", "Your changes usually help.")}
            </div>
            <div className="tiny muted">{tr("Cambios por evidencia", "Evidence-based changes")}: {model.changes.newEvidence} · {tr("por duda", "doubt-based")}: {model.changes.doubt}</div>
          </>
        )}
        <button className="btn sm" style={{ marginTop: 10 }} onClick={() => go("#/strategy/instinct")}>🧘 {tr("Entrenamiento: primera respuesta", "First-instinct drill")}</button>
      </div>

      <div className="card">
        <h3>⏱️ {tr("Presión de tiempo", "Time pressure")}</h3>
        {pg === null ? <div className="small muted">{tr("Se necesitan más ítems con y sin tiempo para comparar.", "Need more timed/untimed data.")}</div> : (
          <div className="small">{pg > 4 ? tr(`Rindes unos ${Math.round(pg)} puntos menos con reloj que sin él. Practica en modo TOEFL Hell para acostumbrarte.`, "") : tr("Tu rendimiento con tiempo es similar al rendimiento sin tiempo. 👏", "")}</div>
        )}
      </div>

      <div className="card">
        <h3>🧠 {tr("¿No lo sabías o lo sabías y fallaste?", "Didn't know vs. slipped")}</h3>
        {totalCauses === 0 ? <div className="small muted">{tr("Sin datos aún.", "No data yet.")}</div> : (
          ([["gap", tr("No lo sabía (laguna de conocimiento)", "Knowledge gap")], ["slip", tr("Lo sabía: error de ejecución", "Slip")], ["overthink", tr("Sobreanálisis", "Overthinking")], ["pressure", tr("Presión de tiempo", "Pressure")], ["strategy", tr("Cayó en una trampa conocida", "Fell for a known trap")], ["misread", tr("Leyó mal la pregunta", "Misread")], ["distraction", tr("Distracción", "Distraction")]] as [keyof typeof c, string][]).map(([k, l]) => (
            <div key={k} style={{ margin: "6px 0" }}>
              <div className="row between small"><span>{l}</span><span>{c[k]}</span></div>
              <Bar pct={(c[k] / totalCauses) * 100} thin kind={k === "gap" ? "" : "gold"} />
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3>🪤 {tr("Trampas que más te engañan", "Traps that fool you most")}</h3>
        {traps.length === 0 ? <div className="small muted">{tr("Aún no hay suficientes datos.", "Not enough data.")}</div> : traps.slice(0, 6).map((t) => (
          <div key={t.k} style={{ margin: "6px 0" }}>
            <div className="row between small"><span>{TRAP_LABEL[t.k as keyof typeof TRAP_LABEL] || t.k}</span><span>{t.fell}/{t.seen}</span></div>
            <Bar pct={t.rate * 100} thin />
          </div>
        ))}
      </div>

      <div className="section-title">📘 {tr("Lecciones", "Lessons")}</div>
      {STRATEGY_LESSONS.map((l) => {
        const st = tagStatus(tagState(model, l.tag));
        return (
          <button key={l.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/lesson/${l.id}`)}>
            <div className={"node " + (st === "solid" || st === "mastered" ? "done" : st === "new" ? "new" : "")}>{l.icon}</div>
            <div className="grow"><div className="serif">{l.title}</div><div className="tiny muted">{lvlLabel(l.lvl)} · {l.summary}</div></div>
          </button>
        );
      })}
    </div>
  );
}

// Una sola oportunidad: el primer toque es la respuesta final
export function InstinctDrill() {
  const { tr, model, record, bump, say } = useApp();
  const items = useMemo(() => pickItems(standaloneItems().filter((it) => it.kind === "mcq" && (it.skill === "grammar" || it.skill === "useOfEnglish")), 10, model.skills.useOfEnglish.theta, new Set()), []);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [res, setRes] = useState<boolean[]>([]);
  const [t0, setT0] = useState(Date.now());
  const it = items[i] as MCQItem | undefined;
  const choose = async (k: number) => {
    if (picked !== null || !it) return;
    setPicked(k);
    const ok = k === it.answer;
    ok ? sfx.correct() : sfx.wrong();
    await record({ itemId: it.id, skill: it.skill, tags: it.tags, lvl: it.lvl, correct: ok, timed: true, timeMs: Date.now() - t0, limitMs: 30000, mode: "practice", changes: 0 });
    setRes([...res, ok]);
  };
  const next = () => { setPicked(null); setT0(Date.now()); if (i + 1 >= items.length) { bump("instinct"); } setI(i + 1); };
  if (!it) {
    const c = res.filter(Boolean).length;
    return (
      <div>
        <Topbar title={tr("Primera respuesta", "First instinct")} back="#/strategy" />
        <OwlSays text={`${c}/${res.length} with zero second-guessing. Compare that with your usual accuracy on the dashboard: if it's similar or better, your first answers deserve more trust.`} mood="proud" />
        <button className="btn primary block" onClick={() => go("#/strategy")}>{tr("Volver", "Back")}</button>
      </div>
    );
  }
  return (
    <div>
      <Topbar title={tr("Primera respuesta", "First instinct")} back="#/strategy" right={<span className="tag">{i + 1}/{items.length}</span>} />
      <div className="small muted" style={{ marginBottom: 8 }}>{tr("Un toque = respuesta final. Sin cambiar. Lee la frase completa una vez, decide y sigue.", "One tap = final answer.")}</div>
      <div className="card">
        {it.ctx && <div className="ex-context">{it.ctx}</div>}
        <div className="ex-prompt"><Md text={it.prompt || ""} inline /></div>
        {it.options.map((o, k) => (
          <button key={k} className={"opt " + (picked === null ? "" : k === it.answer ? "right" : k === picked ? "wrong" : "dim")} onClick={() => choose(k)}>
            <span className="k">{String.fromCharCode(65 + k)}</span><span>{o}</span>
          </button>
        ))}
        {picked !== null && <div className="small" style={{ marginTop: 8 }}><Md text={it.explain} /></div>}
        {picked !== null && <button className="btn primary block" onClick={next}>{tr("Siguiente", "Next")}</button>}
      </div>
    </div>
  );
}
