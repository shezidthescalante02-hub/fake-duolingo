import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../state";
import { buildSession, type Activity } from "../engine/session";
import { ItemView, type ItemResult } from "../components/ItemView";
import { TeachCard, VocabCard } from "../components/Cards";
import { ReadingRunner } from "../components/ReadingRunner";
import { ListeningRunner } from "../components/ListeningRunner";
import { WritingRunner } from "../components/WritingRunner";
import { SpeakingRunner } from "../components/SpeakingRunner";
import { Bar, Owl, OwlSays, go, fmtTime, DiffBadge, Confetti, Ring, CountUp } from "../components/ui";
import { Icon } from "../components/Icon";
import { tagName } from "../content/index";
import { stopSpeaking } from "../services/tts";

export function SessionPage({ minutes: minutesProp, focus }: { minutes: number | null; focus?: string }) {
  const { model, settings, tr, say, addXp, profile } = useApp();
  const [minutes, setMinutes] = useState<number | null>(minutesProp);
  const [acts, setActs] = useState<Activity[] | null>(null);
  const [i, setI] = useState(0);
  const [stats, setStats] = useState({ items: 0, correct: 0, harmful: 0, xp0: profile.xp, run: 0, best: 0 });
  const [done, setDone] = useState(false);
  const [owl, setOwl] = useState<any>(null);
  const [extending, setExtending] = useState(false);
  const t0 = useRef(Date.now());
  const seen = useRef(new Set<string>());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (minutesProp === null) setOwl(say("noPressure"));
    if (settings.difficulty === "c2") setOwl(say("c2mode"));
    buildSession({ minutes: minutesProp, diffId: settings.difficulty, model, settings, focus }).then((a) => { a.forEach(markSeen); setActs(a); });
    const iv = setInterval(() => setElapsed((Date.now() - t0.current) / 1000), 1000);
    return () => { clearInterval(iv); stopSpeaking(); };
  }, []);

  const markSeen = (a: Activity) => { if (a.k === "item") seen.current.add(a.item.id); };

  // agrega otro bloque a la misma sesión (sin límite: nunca se acaba)
  const extend = async (block = 15) => {
    setExtending(true);
    let more = await buildSession({ minutes: block, diffId: settings.difficulty, model, settings, focus, seen: seen.current });
    if (!more.length) more = await buildSession({ minutes: block, diffId: settings.difficulty, model, settings, focus }); // repaso si todo se vio
    more.forEach(markSeen);
    setExtending(false);
    return more;
  };

  // pre-carga el siguiente bloque cuando quedan pocas actividades
  useEffect(() => {
    if (minutes !== null || !acts || extending) return;
    if (acts.length - i <= 3) extend().then((more) => setActs((cur) => [...(cur || []), ...more]));
    // eslint-disable-next-line
  }, [i, acts?.length, minutes]);

  const advance = (r?: ItemResult | ItemResult[]) => {
    const rs = r ? (Array.isArray(r) ? r : [r]) : [];
    setStats((s) => {
      let run = s.run;
      for (const x of rs) run = x.correct ? run + 1 : 0;
      return { ...s, items: s.items + rs.length, correct: s.correct + rs.filter((x) => x.correct).length, harmful: s.harmful + rs.filter((x) => x.firstCorrect && !x.correct && x.changes > 0).length, run, best: Math.max(s.best, run) };
    });
    setOwl(null);
    if (acts && i + 1 >= acts.length) {
      if (minutes === null) { setI(i + 1); return; } // el siguiente bloque llega solo
      finish();
    } else setI(i + 1);
    window.scrollTo(0, 0);
  };

  const finish = () => {
    stopSpeaking();
    const mins = Math.round((Date.now() - t0.current) / 60000);
    const counters: Record<string, number> = { minutes: mins, sessions: 1 };
    if (mins >= 60) counters.marathon = 1;
    if (settings.difficulty === "c2" && stats.items >= 8) counters.nightmare = 1;
    if (stats.items >= 15 && stats.harmful === 0) counters.cleanSessions = 1;
    addXp(10, counters);
    const rate = stats.items ? stats.correct / stats.items : 1;
    setOwl(say(rate >= 0.8 ? "sessionGood" : rate >= 0.55 ? "sessionMeh" : "sessionBad"));
    setDone(true);
  };

  const keepGoing = async () => {
    setDone(false); setOwl(null); setMinutes(null);
    const more = await extend();
    setActs((cur) => [...(cur || []), ...more]);
    setI((x) => x + 1);
  };

  if (!acts) return <div className="card center" style={{ marginTop: 40 }}><Owl mood="thinking" size={110} /><div className="muted">{tr("Preparando tu sesión…", "Preparing…")}</div></div>;

  if (done) {
    const rate = stats.items ? Math.round((stats.correct / stats.items) * 100) : 0;
    return (
      <div className="fadein result-hero" style={{ paddingTop: 16 }}>
        {rate >= 80 && <Confetti />}
        <Ring pct={rate} size={150} stroke={11} color={rate >= 80 ? "green" : rate >= 55 ? "gold" : "red"}>
          <div><div className="serif" style={{ fontSize: "2.2em", fontWeight: 700 }}><CountUp to={rate} suffix="%" /></div><div className="tiny muted">{tr("aciertos", "correct")}</div></div>
        </Ring>
        {owl && <div style={{ textAlign: "left", marginTop: 14 }}><OwlSays text={owl.t} gloss={owl.gloss} mood={owl.mood} size={90} /></div>}
        <div className="grid3 stagger" style={{ marginTop: 14, textAlign: "left" }}>
          <div className="stat"><div className="v"><CountUp to={stats.items} /></div><div className="l">{tr("ejercicios", "exercises")}</div></div>
          <div className="stat"><div className="v">+<CountUp to={profile.xp - stats.xp0} /></div><div className="l">XP</div></div>
          <div className="stat"><div className="v">{fmtTime(elapsed)}</div><div className="l">{tr("tiempo", "time")}</div></div>
        </div>
        {stats.best >= 3 && <div className="card tight small row" style={{ gap: 8, textAlign: "left" }}><Icon name="flame" className="flame-on" /> {tr("Mejor racha de la sesión:", "Best streak:")} <b>{stats.best}</b></div>}
        {stats.harmful > 0 && <div className="card tight small row" style={{ gap: 8, textAlign: "left" }}><Icon name="brain" /> {tr("Cambiaste", "You changed")} {stats.harmful} {tr("respuesta(s) correcta(s) por incorrecta(s). Lo veremos en Estrategia.", "correct answer(s) to wrong ones.")}</div>}
        <button className="btn primary block" style={{ marginTop: 14 }} onClick={keepGoing} disabled={extending}><Icon name="infinity" /> {tr("Seguir estudiando (sin límite)", "Keep going (no limit)")}</button>
        <button className="btn ghost block" style={{ marginTop: 10 }} onClick={() => go("#/")}>{tr("Terminar por hoy", "Finish")}</button>
      </div>
    );
  }

  const a = acts[i];
  if (!a) return <div className="card center" style={{ marginTop: 40 }}><Owl mood="thinking" size={110} /><div className="muted">{tr("Preparando más ejercicios…", "Loading more…")}</div></div>;
  const pct = minutes === null ? ((stats.items % 10) / 10) * 100 : Math.min(100, (elapsed / (minutes * 60)) * 100);
  return (
    <div>
      <div className="sess-head">
        <button className="iconbtn" aria-label="Salir" onClick={() => { if (stats.items > 0) finish(); else go("#/"); }}><Icon name="x" /></button>
        <div className="grow">
          <div className="row between tiny muted" style={{ marginBottom: 4 }}>
            <span className="row" style={{ gap: 5 }}>{minutes === null ? <><Icon name="infinity" size={14} /> {tr("sin límite", "no limit")}</> : <><Icon name="hourglass" size={14} /> {minutes} min</>}</span>
            <span>{fmtTime(elapsed)}</span>
          </div>
          <Bar pct={minutes === null ? pct : (i / acts.length) * 100} kind={minutes === null ? "gold" : ""} />
        </div>
      </div>
      <div className="sess-sub">
        <span className="sess-reason">{a.reason}{a.k === "item" ? " · " + tagName(a.item.tags[0]) : ""}</span>
        <span className="row" style={{ gap: 6 }}>
          {stats.run >= 3 && <span className="combo-chip" key={stats.run}><Icon name="flame" size={13} /> {stats.run}</span>}
          <DiffBadge id={settings.difficulty} />
        </span>
      </div>
      {owl && i === 0 && <OwlSays text={owl.t} gloss={owl.gloss} mood={owl.mood} size={64} />}
      <div className="act-enter" key={i}>
        {a.k === "teach" && <TeachCard lesson={a.lesson} onDone={() => advance()} />}
        {a.k === "item" && <div className="card"><ItemView key={a.item.id + i} item={a.item} mode="session" onDone={(r) => advance(r)} limitSec={limitFor(a.item, settings.difficulty)} /></div>}
        {a.k === "vocab" && <div className="card"><VocabCard key={a.word.id + a.mode + i} word={a.word} mode={a.mode} onDone={(ok) => advance({ correct: ok, score: ok ? 1 : 0, timeMs: 0, changes: 0 })} /></div>}
        {a.k === "reading" && <ReadingRunner key={i} set={a.set} mode="session" onDone={(r) => advance(r)} />}
        {a.k === "listening" && <ListeningRunner key={i} set={a.set} mode="session" onDone={(r) => advance(r)} />}
        {a.k === "useWords" && <WritingRunner key={i} task={{ id: "w-use-words", genre: "Short response", title: "Use it or lose it", prompt: `Write about 60 words on any topic (ideally related to ${settings.researchTopic}) using **at least two** of these recently learned words: **${a.words.map((w) => w.w).join(", ")}**.`, lvl: 58, minWords: 55, maxWords: 100, focus: ["vocabulary"], checklist: ["Uses at least two target words", "Each word is used precisely", "The text makes sense as a whole"], mustUseVocab: 2 }} mode="session" onDone={() => advance()} />}
        {a.k === "speaking" && <SpeakingRunner key={i} task={a.task} mode="session" onDone={() => advance()} />}
      </div>
      <div className="center" style={{ marginTop: 10 }}>
        <button className="btn xs ghost" onClick={() => { setOwl(say("skipped")); advance(); }}><Icon name="skip" size={14} /> {tr("Saltar esta actividad", "Skip this activity")}</button>
      </div>
    </div>
  );
}

function limitFor(item: any, diffId: string): number | null {
  const base: Record<string, number> = { mcq: 45, tf: 35, gap: 40, kwt: 75, wf: 35, judge: 40, order: 50, spot: 40, ctest: 150, odd: 30, fix: 50, recall: 40, stress: 25, sort: 70 };
  if (["produce", "match", "dictation"].includes(item.kind)) return null;
  if (diffId === "toefl") return base[item.kind] || 45;
  if (diffId === "c2") return Math.round((base[item.kind] || 45) * 0.85);
  return null;
}
