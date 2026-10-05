import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../state";
import { Owl, OwlSays, Bar, go, DiffBadge } from "../components/ui";
import { greetingEvent, owlLine } from "../owl/messages";
import { overall, SKILLS, tagStatus, errorPattern } from "../engine/model";
import { band, bandProgress } from "../engine/cefr";
import { levelFromXp, titleFor, consistency, questProgress } from "../engine/game";
import { DIFFS } from "../engine/difficulty";
import { db } from "../db/db";
import { isDue, vstate, type VocabEntry } from "../engine/vocab";
import { tagName, itemsForTag } from "../content/index";

const TIMES: { m: number; l: string }[] = [{ m: 5, l: "5 min" }, { m: 10, l: "10 min" }, { m: 20, l: "20 min" }, { m: 30, l: "30 min" }, { m: 60, l: "60 min" }, { m: 0, l: "∞" }];

export function Home() {
  const { settings, setSettings, model, profile, tr, modelVersion } = useApp();
  const [due, setDue] = useState({ vocab: 0, topics: 0 });
  const greet = useMemo(() => owlLine(greetingEvent(profile.lastActive), { name: settings.name, spicy: settings.spicy }), []);
  const ov = overall(model);
  const lv = levelFromXp(profile.xp);
  const bp = bandProgress(ov);
  const cons = consistency(profile);

  useEffect(() => {
    (async () => {
      const vocab = (await db.all<VocabEntry>("vocab")).filter((v) => !v.archived);
      const dv = vocab.filter((v) => isDue(v.recog) || (vstate(v) !== "new" && vstate(v) !== "learning" && isDue(v.prod))).length;
      const dt = Object.values(model.tags).filter((t) => t.learned && t.due <= Date.now()).length;
      setDue({ vocab: dv, topics: dt });
    })();
  }, [modelVersion]);

  const weakSkills = SKILLS.filter((s) => model.skills[s.id].n >= 3 && !["pressure", "timeMgmt", "overthinking", "fluency"].includes(s.id))
    .sort((a, b) => model.skills[a.id].theta - model.skills[b.id].theta).slice(0, 2);
  const weakTags = Object.entries(model.tags).filter(([t, s]) => (tagStatus(s) === "weak" || errorPattern(s) === "recurrent") && itemsForTag(t).length).slice(0, 3);

  return (
    <div>
      <div className="row" style={{ alignItems: "flex-start", marginTop: 8 }}>
        <Owl mood={greet.mood || "smug"} size={86} />
        <div className="grow">
          <div className="speech"><span>{greet.t}</span>{greet.gloss && <span className="gloss">📖 {greet.gloss}</span>}</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row between">
          <div>
            <div className="tiny muted">{tr("Nivel general (CEFR)", "Overall (CEFR)")}</div>
            <div className="row" style={{ gap: 8 }}><span className="levelpill gold" style={{ fontSize: "1.25em" }}>{model.diagnosed ? bp.band.code : "?"}</span>{model.diagnosed && bp.next && <span className="small muted">→ {bp.next.code}</span>}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="tiny muted">Lv {lv.level} · {titleFor(lv.level)}</div>
            <div className="small gold">{profile.xp} XP</div>
          </div>
        </div>
        {model.diagnosed && <div style={{ marginTop: 10 }}><Bar pct={bp.pct} kind="gold" /><div className="tiny muted" style={{ marginTop: 4 }}>{Math.round(bp.pct)}% {tr("del camino hacia", "of the way to")} {bp.next?.code || "C2★"}</div></div>}
        <div style={{ marginTop: 8 }}><Bar pct={(lv.into / lv.need) * 100} thin /><div className="tiny muted" style={{ marginTop: 3 }}>{lv.into}/{lv.need} XP → Lv {lv.level + 1}</div></div>
        {settings.showStreak && (
          <div className="row small muted" style={{ marginTop: 8, gap: 14 }}>
            <span>🔥 {cons.streak} {tr("días seguidos", "day streak")}</span>
            <span>📅 {cons.last30}/30 {tr("días este mes", "days this month")}</span>
          </div>
        )}
      </div>

      {!model.diagnosed && (
        <div className="card red">
          <h2>🔍 {tr("Diagnóstico inicial", "Initial diagnostic")}</h2>
          <p className="small">{tr("Antes de adaptar todo a ti, necesito evaluarte: gramática, vocabulario, lectura, listening, escritura, speaking, presión del tiempo y sobreanálisis. Unos 35–45 minutos; puedes pausar y omitir habilidades.", "Let me assess you first (35–45 min).")}</p>
          <button className="btn primary block" onClick={() => go("#/diagnostic")}>{tr("Empezar diagnóstico", "Start diagnostic")}</button>
        </div>
      )}

      <div className="section-title">⏳ {tr("¿Cuánto tiempo tienes?", "How much time do you have?")}</div>
      <div className="grid3">
        {TIMES.map((t) => (
          <button key={t.m} className="tile" style={{ minHeight: 70, alignItems: "center", justifyContent: "center" }} onClick={() => go(`#/session?m=${t.m}`)}>
            <div className="tt" style={{ fontSize: "1.2em" }}>{t.l}</div>
            <div className="ts">{t.m === 0 ? tr("sin límite", "no limit") : t.m <= 10 ? tr("rápido", "quick") : tr("sesión", "session")}</div>
          </button>
        ))}
      </div>

      <div className="section-title">😈 {tr("¿Cuánto quieres sufrir?", "How much do you want to suffer?")}</div>
      <div className="chips scroll">
        {DIFFS.map((d) => <button key={d.id} className={"chip " + (settings.difficulty === d.id ? "on" : "")} onClick={() => setSettings({ difficulty: d.id })}>{d.name}</button>)}
      </div>
      <div className="small muted" style={{ margin: "6px 2px" }}><DiffBadge id={settings.difficulty} /> {DIFFS.find((d) => d.id === settings.difficulty)?.desc}</div>

      {(due.vocab > 0 || due.topics > 0) && (
        <div className="card tight row between">
          <div className="small">🔁 {due.vocab} {tr("palabras y", "words and")} {due.topics} {tr("temas listos para repaso", "topics due")}</div>
          <button className="btn sm" onClick={() => go("#/session?m=10")}>{tr("Repasar", "Review")}</button>
        </div>
      )}

      {(weakSkills.length > 0 || weakTags.length > 0) && (
        <>
          <div className="section-title">🎯 {tr("Recomendado para ti", "Recommended")}</div>
          {weakTags.map(([t]) => (
            <button key={t} className="unit" style={{ width: "100%" }} onClick={() => go(`#/practice/${encodeURIComponent(t)}`)}>
              <div className="node">⚠️</div>
              <div className="grow" style={{ textAlign: "left" }}><div className="serif">{tagName(t)}</div><div className="tiny muted">{tr("Error recurrente: refuerzo dirigido", "Recurring error")}</div></div>
            </button>
          ))}
          {weakSkills.map((s) => (
            <div key={s.id} className="small muted" style={{ margin: "4px 2px" }}>📉 {tr("Tu habilidad más baja ahora", "Lowest skill")}: <b>{s.name}</b> ({band(model.skills[s.id].theta).code})</div>
          ))}
        </>
      )}

      {profile.daily.ch && (
        <>
          <div className="section-title">⚡ {tr("Reto del día", "Daily challenge")} <span className="sub">{tr("opcional · sin castigo", "optional · no penalty")}</span></div>
          <div className={"card tight " + (profile.daily.done ? "hl" : "")}>
            <div className="row between">
              <div><div className="serif">{profile.daily.ch.title}</div><div className="small muted">{profile.daily.ch.desc}</div></div>
              {profile.daily.done ? <span className="tag green">✓ +{profile.daily.ch.xp} XP</span> : <button className="btn sm" onClick={() => go(profile.daily.ch!.route)}>{tr("Ir", "Go")}</button>}
            </div>
          </div>
        </>
      )}

      {profile.quests.list.length > 0 && (
        <>
          <div className="section-title">🗺️ {tr("Misiones de la semana", "Weekly quests")} <span className="sub">{tr("opcionales", "optional")}</span></div>
          {profile.quests.list.map((qq) => {
            const p = questProgress(profile, qq as any);
            return (
              <div key={qq.id} className="card tight">
                <div className="row between small"><span>{qq.title}</span><span className={p >= qq.target ? "ok" : "muted"}>{p}/{qq.target} · {qq.xp} XP</span></div>
                <div style={{ marginTop: 6 }}><Bar pct={(p / qq.target) * 100} thin kind={p >= qq.target ? "green" : "gold"} /></div>
              </div>
            );
          })}
        </>
      )}

      <div className="section-title">🧭 {tr("Ir directo a", "Jump to")}</div>
      <div className="grid2 md3">
        {[
          ["#/writing", "✒️", "Writing", tr("prioridad principal", "top priority")],
          ["#/grammar", "🧩", "Grammar", tr("B2+ → C2", "B2+ → C2")],
          ["#/academic", "🏛️", "Academic English", tr("hedging, stance, síntesis", "hedging, stance")],
          ["#/phd", "🎓", tr("Modo Doctorado", "PhD Mode"), tr("supervisor, seminarios", "supervisor, seminars")],
          ["#/sims", "📝", tr("Simulaciones", "Simulations"), "TOEFL · C1 · C2 · IELTS"],
          ["#/strategy", "🪤", tr("Estrategia de examen", "Exam strategy"), tr("distractores, sobreanálisis", "distractors")],
        ].map(([h, i, t, s]) => (
          <button key={h} className="tile" onClick={() => go(h)}><div className="ti">{i}</div><div className="tt">{t}</div><div className="ts">{s}</div></button>
        ))}
      </div>
      <div className="spacer" />
    </div>
  );
}
