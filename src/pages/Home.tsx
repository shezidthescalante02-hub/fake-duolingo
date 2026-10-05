import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../state";
import { Owl, Bar, go, DiffBadge, Ring, Md } from "../components/ui";
import { Icon } from "../components/Icon";
import { greetingEvent, owlLine } from "../owl/messages";
import { overall, SKILLS, tagStatus, errorPattern } from "../engine/model";
import { band, bandProgress } from "../engine/cefr";
import { levelFromXp, titleFor, consistency, questProgress } from "../engine/game";
import { DIFFS } from "../engine/difficulty";
import { db } from "../db/db";
import { isDue, vstate, type VocabEntry } from "../engine/vocab";
import { tagName, itemsForTag } from "../content/index";
import { iconForTag } from "../components/Icon";

const TIMES: { m: number; l: string }[] = [{ m: 5, l: "5" }, { m: 10, l: "10" }, { m: 20, l: "20" }, { m: 30, l: "30" }, { m: 60, l: "60" }, { m: 0, l: "∞" }];

export function Home() {
  const { settings, setSettings, model, profile, tr, modelVersion } = useApp();
  const [due, setDue] = useState({ vocab: 0, topics: 0 });
  const greet = useMemo(() => owlLine(greetingEvent(profile.lastActive), { name: settings.name, spicy: settings.spicy }), []);
  const ov = overall(model);
  const lv = levelFromXp(profile.xp);
  const bp = bandProgress(ov);
  const cons = consistency(profile);
  const [talk, setTalk] = useState(true);
  useEffect(() => { const t = setTimeout(() => setTalk(false), 1800); return () => clearTimeout(t); }, []);

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
  const hour = new Date().getHours();

  return (
    <div className="stagger">
      {/* saludo del búho */}
      <div className="home-greet">
        <Owl mood={greet.mood || "smug"} size={112} anim="idle" talking={talk} />
        <div className="speech grow">
          <Md text={greet.t} inline />
          {greet.gloss && <span className="gloss"><Icon name="book" size={14} /> <span>{greet.gloss}</span></span>}
        </div>
      </div>

      {/* tarjeta principal */}
      <div className="card hero ornate">
        <div className="hero-top">
          <Ring pct={model.diagnosed ? bp.pct : 0} size={92} stroke={8}>
            <div>
              <div className="big-level">{model.diagnosed ? bp.band.code : "?"}</div>
              <div className="tiny muted">CEFR</div>
            </div>
          </Ring>
          <div className="grow">
            <div className="eyebrow">{hour < 12 ? tr("Buenos días", "Good morning") : hour < 19 ? tr("Buenas tardes", "Good afternoon") : tr("Buenas noches", "Good evening")}, {settings.name}</div>
            <div className="serif" style={{ fontSize: "1.15em", margin: "2px 0 6px" }}>Lv {lv.level} · <span className="italic gold">{titleFor(lv.level)}</span></div>
            <Bar pct={(lv.into / lv.need) * 100} thin kind="gold" />
            <div className="tiny muted" style={{ marginTop: 4 }}>{lv.into}/{lv.need} XP · {model.diagnosed && bp.next ? `${Math.round(bp.pct)}% → ${bp.next.code}` : tr("haz el diagnóstico para ver tu nivel", "take the diagnostic")}</div>
          </div>
        </div>
        {settings.showStreak && (
          <div className="stats-row">
            <div className="pillstat"><Icon name="flame" size={18} className={cons.streak > 0 ? "flame-on" : ""} /><span><b>{cons.streak}</b> {tr("racha", "streak")}</span></div>
            <div className="pillstat"><Icon name="calendar" size={18} /><span><b>{cons.last30}</b>/30 {tr("días", "days")}</span></div>
            <div className="pillstat"><Icon name="sparkle" size={18} /><span><b>{profile.xp}</b> XP</span></div>
          </div>
        )}
      </div>

      {!model.diagnosed && (
        <div className="card red">
          <h2 className="row" style={{ gap: 8 }}><Icon name="search" /> {tr("Diagnóstico inicial", "Initial diagnostic")}</h2>
          <p className="small">{tr("Antes de adaptar todo a ti, necesito evaluarte: gramática, vocabulario, lectura, listening, escritura, speaking, presión del tiempo y sobreanálisis. Unos 35–45 minutos; puedes pausar y omitir habilidades.", "Let me assess you first (35–45 min).")}</p>
          <button className="btn primary block" onClick={() => go("#/diagnostic")}>{tr("Empezar diagnóstico", "Start diagnostic")}</button>
        </div>
      )}

      {/* sesión */}
      <button className="cta-start" onClick={() => go("#/session?m=0")}>
        <span className="cta-ico"><Icon name="infinity" size={26} /></span>
        <span className="grow">
          <div className="cta-t">{tr("Estudiar sin límite", "Study without limits")}</div>
          <div className="cta-s">{tr("Una sesión que se adapta y nunca se acaba. Sales cuando quieras.", "An adaptive session that never runs out.")}</div>
        </span>
        <Icon name="arrowRight" size={22} />
      </button>

      <div className="section-title"><Icon name="hourglass" /> {tr("O elige cuánto tiempo", "Or choose a length")}</div>
      <div className="time-row">
        {TIMES.filter((t) => t.m !== 0).map((t) => (
          <button key={t.m} className="time-pill" onClick={() => go(`#/session?m=${t.m}`)}>
            <b>{t.l}</b><span>min</span>
          </button>
        ))}
      </div>

      <div className="section-title"><Icon name="bolt" /> {tr("¿Cuánto quieres sufrir?", "How much do you want to suffer?")}</div>
      <div className="chips scroll">
        {DIFFS.map((d) => <button key={d.id} className={"chip " + (settings.difficulty === d.id ? "on" : "")} onClick={() => setSettings({ difficulty: d.id })}>{d.name}</button>)}
      </div>
      <div className="small muted" style={{ margin: "8px 2px" }}><DiffBadge id={settings.difficulty} /> {DIFFS.find((d) => d.id === settings.difficulty)?.desc}</div>

      {(due.vocab > 0 || due.topics > 0) && (
        <div className="card tight row between">
          <div className="row small" style={{ gap: 10 }}><span className="mini-ico"><Icon name="repeat" size={18} /></span><span><b>{due.vocab}</b> {tr("palabras y", "words and")} <b>{due.topics}</b> {tr("temas listos para repaso", "topics due")}</span></div>
          <button className="btn sm" onClick={() => go("#/session?m=10")}>{tr("Repasar", "Review")}</button>
        </div>
      )}

      {(weakSkills.length > 0 || weakTags.length > 0) && (
        <>
          <div className="section-title"><Icon name="target" /> {tr("Recomendado para ti", "Recommended")}</div>
          {weakTags.map(([t]) => (
            <button key={t} className="unit" style={{ width: "100%" }} onClick={() => go(`#/practice/${encodeURIComponent(t)}`)}>
              <div className="node warn"><Icon name={iconForTag(t)} size={22} /></div>
              <div className="grow" style={{ textAlign: "left" }}><div className="serif">{tagName(t)}</div><div className="tiny muted">{tr("Error recurrente: práctica infinita dirigida", "Recurring error")}</div></div>
              <Icon name="next" size={18} className="muted" />
            </button>
          ))}
          {weakSkills.map((s) => (
            <div key={s.id} className="small muted row" style={{ margin: "6px 2px", gap: 8 }}><Icon name="down" size={16} /> {tr("Tu habilidad más baja ahora", "Lowest skill")}: <b>{s.name}</b> ({band(model.skills[s.id].theta).code})</div>
          ))}
        </>
      )}

      {profile.daily.ch && (
        <>
          <div className="section-title"><Icon name="bolt" /> {tr("Reto del día", "Daily challenge")} <span className="sub">{tr("opcional · sin castigo", "optional · no penalty")}</span></div>
          <div className={"card tight " + (profile.daily.done ? "hl" : "")}>
            <div className="row between">
              <div><div className="serif">{profile.daily.ch.title}</div><div className="small muted">{profile.daily.ch.desc}</div></div>
              {profile.daily.done ? <span className="tag green"><Icon name="check" size={13} /> +{profile.daily.ch.xp} XP</span> : <button className="btn sm" onClick={() => go(profile.daily.ch!.route)}>{tr("Ir", "Go")}</button>}
            </div>
          </div>
        </>
      )}

      {profile.quests.list.length > 0 && (
        <>
          <div className="section-title"><Icon name="map" /> {tr("Misiones de la semana", "Weekly quests")} <span className="sub">{tr("opcionales", "optional")}</span></div>
          {profile.quests.list.map((qq) => {
            const p = questProgress(profile, qq as any);
            const done = p >= qq.target;
            return (
              <div key={qq.id} className={"card tight quest" + (done ? " done" : "")}>
                <div className="row between small"><span className="row" style={{ gap: 8 }}>{done ? <Icon name="check" size={16} className="ok" /> : <Icon name="flag" size={16} className="muted" />}{qq.title}</span><span className={done ? "ok" : "muted"}>{Math.min(p, qq.target)}/{qq.target} · {qq.xp} XP</span></div>
                <div style={{ marginTop: 7 }}><Bar pct={(p / qq.target) * 100} thin kind={done ? "green" : "gold"} /></div>
              </div>
            );
          })}
        </>
      )}

      <div className="section-title"><Icon name="compass" /> {tr("Ir directo a", "Jump to")}</div>
      <div className="grid2 md3">
        {[
          ["#/endless", "infinity", tr("Práctica infinita", "Endless practice"), tr("nunca se acaba", "never ends")],
          ["#/writing", "quill", "Writing", tr("prioridad principal", "top priority")],
          ["#/grammar", "puzzle", "Grammar", "B2+ → C2"],
          ["#/academic", "columns", "Academic English", tr("hedging, stance, síntesis", "hedging, stance")],
          ["#/phd", "scroll", tr("Modo Doctorado", "PhD Mode"), tr("supervisor, seminarios", "supervisor, seminars")],
          ["#/sims", "exam", tr("Simulaciones", "Simulations"), "TOEFL · C1 · C2 · IELTS"],
        ].map(([h, i, t, s]) => (
          <button key={h} className="tile" onClick={() => go(h)}><div className="ti"><Icon name={i} size={22} /></div><div className="tt">{t}</div><div className="ts">{s}</div></button>
        ))}
      </div>
      <div className="spacer" />
    </div>
  );
}
