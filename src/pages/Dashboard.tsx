import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../state";
import { Topbar, Bar, go, Stat } from "../components/ui";
import { LineChart, Radar, Heat, Donut } from "../components/Charts";
import { SKILLS, overall, tagStatus, errorPattern, overthinkIndex, pressureGap, sdOf, type Attempt } from "../engine/model";
import { band, examEstimate, rangeLabel } from "../engine/cefr";
import { db } from "../db/db";
import { VSTATES, vstate, isDue, shouldProbablyKnow, type VocabEntry } from "../engine/vocab";
import { GRAMMAR_LESSONS, ACADEMIC_LESSONS, UOE_LESSONS, tagName, itemsForTag } from "../content/index";
import { ACHIEVEMENTS, consistency, levelFromXp, titleFor } from "../engine/game";

export function Dashboard() {
  const { tr, model, profile, modelVersion } = useApp();
  const [hist, setHist] = useState<any[]>([]);
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [atts, setAtts] = useState<Attempt[]>([]);
  const [sims, setSims] = useState<any[]>([]);
  const [lineSkills, setLineSkills] = useState<string[]>(["reading", "writing", "grammar"]);
  useEffect(() => {
    db.all<any>("history").then((h) => setHist(h.sort((a, b) => a.day.localeCompare(b.day))));
    db.all<VocabEntry>("vocab").then(setVocab);
    db.all<Attempt>("attempts").then((a) => setAtts(a.sort((x, y) => x.at - y.at)));
    db.all<any>("sims").then((s) => setSims(s.sort((a, b) => b.at - a.at)));
  }, [modelVersion]);

  const ov = overall(model);
  const est = examEstimate(ov);
  const recent = atts.slice(-60);
  const recentAcc = recent.length ? recent.filter((a) => a.correct).length / recent.length : 0;
  const ot = overthinkIndex(model);
  const pg = pressureGap(model);
  const cons = consistency(profile);
  const lv = levelFromXp(profile.xp);

  const vCounts = useMemo(() => { const c: Record<string, number> = {}; for (const v of vocab.filter((x) => !x.archived)) { const s = vstate(v); c[s] = (c[s] || 0) + 1; } return c; }, [vocab]);
  const vDue = vocab.filter((v) => !v.archived && isDue(v.recog)).length;
  const shouldKnow = vocab.filter((v) => !v.archived && shouldProbablyKnow(v, ov)).length;

  const errTags = useMemo(() => {
    const m: Record<string, { n: number; e: number }> = {};
    for (const a of atts.slice(-400)) for (const t of a.tags) { m[t] = m[t] || { n: 0, e: 0 }; m[t].n++; if (!a.correct) m[t].e++; }
    return Object.entries(m).filter(([, v]) => v.e >= 2).sort((a, b) => b[1].e - a[1].e).slice(0, 8);
  }, [atts]);
  const mastered = Object.entries(model.tags).filter(([t, s]) => ["mastered", "solid"].includes(tagStatus(s)) && itemsForTag(t).length);
  const weak = Object.entries(model.tags).filter(([t, s]) => tagStatus(s) === "weak" && itemsForTag(t).length);

  const series = [
    { name: "Overall", color: "#f0c76a", points: hist.map((h) => ({ x: h.day, y: h.overall })) },
    ...lineSkills.map((k, i) => ({ name: k, color: ["#c94457", "#7ea6d8", "#6fae7b", "#b192d6"][i % 4], points: hist.map((h) => ({ x: h.day, y: h.skills[k] })).filter((p) => p.y !== undefined) })),
  ];
  const core = ["reading", "listening", "speaking", "writing", "grammar", "vocabulary", "academicVocab", "academicWriting", "useOfEnglish", "strategy"];
  const best = (exam: string) => sims.filter((s) => s.exam === exam).sort((a, b) => b.overallScore - a.overallScore)[0];

  return (
    <div>
      <Topbar title={tr("Progreso", "Progress")} right={<button className="iconbtn" onClick={() => go("#/settings")}>⚙️</button>} />
      <div className="card hl">
        <div className="row between">
          <div><div className="tiny muted">Overall</div><div className="levelpill gold" style={{ fontSize: "1.6em" }}>{model.diagnosed ? band(ov).code : "?"}</div></div>
          <div className="grid3" style={{ gap: 6, flex: 1, marginLeft: 12 }}>
            <Stat v={model.diagnosed ? est.ielts.toFixed(1) : "?"} l="IELTS ≈" />
            <Stat v={model.diagnosed ? est.toefl.toFixed(1) : "?"} l="TOEFL (1–6) ≈" />
            <Stat v={model.diagnosed ? est.ces : "?"} l="Cambridge ≈" />
          </div>
        </div>
        <div className="tiny muted" style={{ marginTop: 6 }}>{tr("Equivalencias aproximadas basadas en tu nivel CEFR estimado; no son puntajes oficiales. Las simulaciones dan estimaciones más específicas.", "Approximate equivalences, not official scores.")}</div>
      </div>

      <div className="card"><Radar data={core.map((k) => ({ label: SKILLS.find((s) => s.id === k)!.name.replace("General ", "").replace("Academic ", "Acad. "), value: model.skills[k].theta }))} /></div>

      <div className="section-title">📈 {tr("Evolución", "History")}</div>
      <div className="card">
        <LineChart series={series} />
        <div className="chips scroll" style={{ marginTop: 6 }}>
          {core.map((k) => <button key={k} className={"chip " + (lineSkills.includes(k) ? "on" : "")} onClick={() => setLineSkills(lineSkills.includes(k) ? lineSkills.filter((x) => x !== k) : [...lineSkills, k].slice(-4))}>{SKILLS.find((s) => s.id === k)!.name}</button>)}
        </div>
      </div>

      <div className="section-title">🧭 {tr("Por habilidad", "By skill")}</div>
      <div className="card">
        {SKILLS.map((s) => {
          const a = model.skills[s.id];
          return (
            <div key={s.id} style={{ margin: "9px 0" }}>
              <div className="row between small">
                <span>{s.name}</span>
                <span>{a.n < 1 ? <span className="muted">—</span> : <b className="serif">{rangeLabel(a.theta, a.n < 5 ? sdOf(a) / 2 : 0)}</b>}{a.tN >= 3 && a.uN >= 3 && a.uTheta - a.tTheta > 5 ? <span className="tiny gold"> ⏱−{Math.round(a.uTheta - a.tTheta)}</span> : null}</span>
              </div>
              <Bar pct={a.n < 1 ? 0 : ((a.theta - 30) / 65) * 100} thin kind={a.theta >= 72 ? "gold" : ""} />
            </div>
          );
        })}
        <div className="tiny muted">{tr("⏱−N: puntos que pierdes con reloj en esa habilidad.", "⏱−N: points lost under time pressure.")}</div>
      </div>

      <div className="grid2">
        <div className="card center"><Donut pct={recentAcc * 100} /><div className="small muted">{tr("aciertos recientes (60)", "recent accuracy")}</div></div>
        <div className="card center"><Donut pct={ot.total ? (1 - (ot.rate || 0)) * 100 : 100} color="var(--gold)" /><div className="small muted">{tr("cambios no dañinos", "non-harmful changes")}</div></div>
      </div>
      {pg !== null && <div className="card tight small">⏱️ {tr("Brecha de presión media", "Avg. pressure gap")}: <b>{pg.toFixed(1)}</b> {tr("puntos", "points")}</div>}

      <div className="section-title">🗂️ {tr("Vocabulario", "Vocabulary")}</div>
      <div className="card">
        <div className="grid3">
          <Stat v={vocab.filter((v) => !v.archived).length} l={tr("aprendiendo", "learning")} />
          <Stat v={vCounts.mastered || 0} l={tr("dominadas", "mastered")} />
          <Stat v={vDue} l={tr("en repaso", "due")} />
        </div>
        <div style={{ marginTop: 10 }}>
          {VSTATES.map((s) => <div key={s.id} className="row between small" style={{ margin: "3px 0" }}><span>{s.name} <span className="tiny muted">{s.desc}</span></span><b>{vCounts[s.id] || 0}</b></div>)}
          <div className="row between small"><span>🗄️ {tr("Retiradas", "Retired")}</span><b>{vocab.filter((v) => v.archived).length}</b></div>
          {shouldKnow > 0 && <div className="row between small gold"><span>⭐ Words I should probably know</span><b>{shouldKnow}</b></div>}
        </div>
      </div>

      <div className="section-title">🧩 {tr("Gramática y académico por categoría", "Grammar by category")}</div>
      <div className="card">
        {[...GRAMMAR_LESSONS, ...UOE_LESSONS, ...ACADEMIC_LESSONS].map((l) => {
          const s = model.tags[l.tag];
          if (!s || s.n === 0) return null;
          const acc = s.recent.length ? s.recent.reduce((a, b) => a + b, 0) / s.recent.length : 0;
          const pat = errorPattern(s);
          return (
            <button key={l.id} className="row between small" style={{ width: "100%", background: "none", border: 0, padding: "6px 0", cursor: "pointer" }} onClick={() => go(`#/lesson/${l.id}`)}>
              <span style={{ textAlign: "left" }}>{l.title} <span className="tiny muted">{tagStatus(s)}{pat !== "none" ? " · " + pat : ""}</span></span>
              <span style={{ width: 90 }}><Bar pct={acc * 100} thin kind={acc >= 0.85 ? "green" : acc < 0.6 ? "" : "gold"} /></span>
            </button>
          );
        })}
        {Object.keys(model.tags).length === 0 && <div className="small muted">{tr("Aún sin datos.", "No data yet.")}</div>}
      </div>

      <div className="section-title">⚠️ {tr("Errores frecuentes", "Frequent errors")}</div>
      <div className="card">
        {errTags.length === 0 ? <div className="small muted">{tr("Nada recurrente todavía.", "Nothing recurring yet.")}</div> : errTags.map(([t, v]) => (
          <div key={t} className="row between small" style={{ margin: "5px 0" }}>
            <a href={`#/practice/${encodeURIComponent(t)}`}>{tagName(t)}</a><span className="bad">{v.e}/{v.n}</span>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="card"><h3 className="ok">✓ {tr("Dominados", "Mastered")}</h3>{mastered.length ? mastered.slice(0, 10).map(([t]) => <div key={t} className="small">{tagName(t)}</div>) : <div className="small muted">—</div>}</div>
        <div className="card"><h3 className="bad">✎ {tr("Débiles", "Weak")}</h3>{weak.length ? weak.slice(0, 10).map(([t]) => <div key={t} className="small"><a href={`#/practice/${encodeURIComponent(t)}`}>{tagName(t)}</a></div>) : <div className="small muted">—</div>}</div>
      </div>

      <div className="section-title">🎓 {tr("Simulaciones", "Simulations")}</div>
      <div className="card">
        {sims.length === 0 ? <div className="small muted">{tr("Aún no has hecho simulaciones.", "No simulations yet.")}</div> : (
          <>
            <div className="grid2 md4">
              {["toefl", "cae", "cpe", "ielts"].map((e) => { const b = best(e); return <Stat key={e} v={b ? b.overallLabel : "—"} l={`${e.toUpperCase()} · ${tr("mejor", "best")}`} />; })}
            </div>
            {sims.slice(0, 8).map((s) => <a key={s.id} href={`#/simresult/${s.id}`} className="row between small" style={{ margin: "6px 0", textDecoration: "none", color: "inherit" }}><span>{new Date(s.at).toLocaleDateString()} · {s.examName}{s.section ? " · " + s.section : ""}</span><b>{s.overallLabel}</b></a>)}
          </>
        )}
      </div>

      <div className="section-title">📅 {tr("Constancia (sin presión)", "Consistency")}</div>
      <div className="card">
        <Heat days={profile.days} />
        <div className="row small muted" style={{ marginTop: 8, gap: 14 }}><span>{cons.total} {tr("días en total", "days total")}</span><span>{cons.last30}/30 {tr("este mes", "this month")}</span><span>{profile.counters.minutes || 0} min</span><span>{profile.items} {tr("ejercicios", "items")}</span></div>
      </div>

      <div className="section-title">🏆 {tr("Logros", "Achievements")} · Lv {lv.level} “{titleFor(lv.level)}”</div>
      <div className="grid3">
        {ACHIEVEMENTS.map((a) => (
          <div key={a.id} className="stat center" style={{ opacity: profile.achievements[a.id] ? 1 : 0.35 }} title={a.desc}>
            <div style={{ fontSize: 26 }}>{a.icon}</div><div className="tiny">{a.name}</div>
          </div>
        ))}
      </div>
      <div className="spacer" />
    </div>
  );
}
