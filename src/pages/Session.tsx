import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../state";
import { buildSession, type Activity } from "../engine/session";
import { ItemView, type ItemResult } from "../components/ItemView";
import { TeachCard, VocabCard } from "../components/Cards";
import { ReadingRunner } from "../components/ReadingRunner";
import { ListeningRunner } from "../components/ListeningRunner";
import { WritingRunner } from "../components/WritingRunner";
import { SpeakingRunner } from "../components/SpeakingRunner";
import { Bar, Owl, OwlSays, go, fmtTime, DiffBadge, Confetti } from "../components/ui";
import { tagName } from "../content/index";
import { stopSpeaking } from "../services/tts";

export function SessionPage({ minutes, focus }: { minutes: number | null; focus?: string }) {
  const { model, settings, tr, say, addXp, profile } = useApp();
  const [acts, setActs] = useState<Activity[] | null>(null);
  const [i, setI] = useState(0);
  const [stats, setStats] = useState({ items: 0, correct: 0, harmful: 0, xp0: profile.xp });
  const [done, setDone] = useState(false);
  const [owl, setOwl] = useState<any>(null);
  const t0 = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (minutes === null) setOwl(say("noPressure"));
    if (settings.difficulty === "c2") setOwl(say("c2mode"));
    buildSession({ minutes, diffId: settings.difficulty, model, settings, focus }).then(setActs);
    const iv = setInterval(() => setElapsed((Date.now() - t0.current) / 1000), 1000);
    return () => { clearInterval(iv); stopSpeaking(); };
  }, []);

  const advance = (r?: ItemResult | ItemResult[]) => {
    const rs = r ? (Array.isArray(r) ? r : [r]) : [];
    setStats((s) => ({ ...s, items: s.items + rs.length, correct: s.correct + rs.filter((x) => x.correct).length, harmful: s.harmful + rs.filter((x) => x.firstCorrect && !x.correct && x.changes > 0).length }));
    setOwl(null);
    if (acts && i + 1 >= acts.length) {
      if (minutes === null) { // sin límite: generar otro bloque
        buildSession({ minutes: 15, diffId: settings.difficulty, model, settings }).then((more) => { setActs([...acts, ...more]); setI(i + 1); });
        return;
      }
      finish();
    } else setI(i + 1);
    window.scrollTo(0, 0);
  };

  const finish = () => {
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

  if (!acts) return <div className="card center" style={{ marginTop: 40 }}><Owl mood="thinking" size={90} /><div className="muted">{tr("Preparando tu sesión…", "Preparing…")}</div></div>;
  if (acts.length === 0) return (
    <div className="card center" style={{ marginTop: 30 }}>
      <Owl mood="shocked" size={90} />
      <p>{tr("No encontré actividades para este foco.", "Nothing to practise here.")}</p>
      <button className="btn" onClick={() => go("#/")}>{tr("Volver", "Back")}</button>
    </div>
  );

  if (done) {
    const rate = stats.items ? Math.round((stats.correct / stats.items) * 100) : 0;
    return (
      <div className="fadein" style={{ paddingTop: 20 }}>
        {rate >= 80 && <Confetti />}
        {owl && <OwlSays text={owl.t} gloss={owl.gloss} mood={owl.mood} size={90} />}
        <div className="grid3" style={{ marginTop: 14 }}>
          <div className="stat"><div className="v">{stats.items}</div><div className="l">{tr("ejercicios", "exercises")}</div></div>
          <div className="stat"><div className="v">{rate}%</div><div className="l">{tr("aciertos", "correct")}</div></div>
          <div className="stat"><div className="v">+{profile.xp - stats.xp0}</div><div className="l">XP</div></div>
        </div>
        {stats.harmful > 0 && <div className="card tight small">🌀 {tr("Cambiaste", "You changed")} {stats.harmful} {tr("respuesta(s) correcta(s) por incorrecta(s). Lo veremos en Estrategia.", "correct answer(s) to wrong ones.")}</div>}
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn ghost grow" onClick={() => go("#/")}>{tr("Terminar", "Finish")}</button>
          <button className="btn primary grow" onClick={() => location.reload()}>{tr("Otra sesión", "Another")}</button>
        </div>
      </div>
    );
  }

  const a = acts[i];
  return (
    <div>
      <div className="ex-head" style={{ paddingTop: 6 }}>
        <button className="iconbtn" onClick={() => { if (stats.items > 0) finish(); else go("#/"); }}>✕</button>
        <Bar pct={minutes === null ? ((i % 12) / 12) * 100 : (i / acts.length) * 100} />
        <span className="tiny muted" style={{ minWidth: 44, textAlign: "right" }}>{fmtTime(elapsed)}</span>
      </div>
      <div className="row between" style={{ marginBottom: 8 }}>
        <span className="tiny muted">{a.reason}{a.k === "item" ? " · " + tagName(a.item.tags[0]) : ""}</span>
        <DiffBadge id={settings.difficulty} />
      </div>
      {owl && i === 0 && <OwlSays text={owl.t} gloss={owl.gloss} mood={owl.mood} size={60} />}
      {a.k === "teach" && <TeachCard key={i} lesson={a.lesson} onDone={() => advance()} />}
      {a.k === "item" && <div className="card"><ItemView key={a.item.id + i} item={a.item} mode="session" onDone={(r) => advance(r)} limitSec={limitFor(a.item, settings.difficulty)} /></div>}
      {a.k === "vocab" && <div className="card"><VocabCard key={a.word.id + a.mode + i} word={a.word} mode={a.mode} onDone={(ok) => advance({ correct: ok, score: ok ? 1 : 0, timeMs: 0, changes: 0 })} /></div>}
      {a.k === "reading" && <ReadingRunner key={i} set={a.set} mode="session" onDone={(r) => advance(r)} />}
      {a.k === "listening" && <ListeningRunner key={i} set={a.set} mode="session" onDone={(r) => advance(r)} />}
      {a.k === "useWords" && <WritingRunner key={i} task={{ id: "w-use-words", genre: "Short response", title: "Use it or lose it", prompt: `Write about 60 words on any topic (ideally related to ${settings.researchTopic}) using **at least two** of these recently learned words: **${a.words.map((w) => w.w).join(", ")}**.`, lvl: 58, minWords: 55, maxWords: 100, focus: ["vocabulary"], checklist: ["Uses at least two target words", "Each word is used precisely", "The text makes sense as a whole"], mustUseVocab: 2 }} mode="session" onDone={() => advance()} />}
      {a.k === "speaking" && <SpeakingRunner key={i} task={a.task} mode="session" onDone={() => advance()} />}
      <div className="center" style={{ marginTop: 10 }}>
        <button className="btn xs ghost" onClick={() => { setOwl(say("skipped")); advance(); }}>{tr("Saltar esta actividad", "Skip this activity")}</button>
      </div>
    </div>
  );
}

function limitFor(item: any, diffId: string): number | null {
  const base: Record<string, number> = { mcq: 45, tf: 35, gap: 40, kwt: 75, wf: 35, judge: 40, order: 50, spot: 40, ctest: 150 };
  if (item.kind === "produce") return null;
  if (diffId === "toefl") return base[item.kind] || 45;
  if (diffId === "c2") return Math.round((base[item.kind] || 45) * 0.85);
  return null;
}
