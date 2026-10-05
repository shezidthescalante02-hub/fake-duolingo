import React, { useMemo, useState } from "react";
import { useApp } from "../state";
import { Topbar, go, Bar, Md, OwlSays, Empty, Owl, shuffle } from "../components/ui";
import { GRAMMAR_LESSONS, UOE_LESSONS, ACADEMIC_LESSONS, lessonById, itemsForTag, tagName, addCustomItems, lessonForTag } from "../content/index";
import type { Lesson, Item } from "../content/types";
import { tagState, tagStatus, errorPattern, receptiveVsProductive } from "../engine/model";
import { band, lvlLabel } from "../engine/cefr";
import { TeachCard } from "../components/Cards";
import { ItemView } from "../components/ItemView";
import { pickItems } from "../engine/session";
import { aiReady, generateItems } from "../services/ai";
import { skillOf } from "../content/helpers";
import { Icon, iconForTag } from "../components/Icon";
import { generate, modeForTag } from "../engine/generator";

const MODULES = [
  { h: "#/endless", i: "infinity", t: "Práctica infinita", s: "nunca se acaba", skill: "" },
  { h: "#/grammar", i: "puzzle", t: "Grammar", s: "B2+ → C2", skill: "grammar" },
  { h: "#/uoe", i: "key", t: "Use of English", s: "KWT, word formation, cloze", skill: "useOfEnglish" },
  { h: "#/vocab", i: "cards", t: "Vocabulary", s: "SRS · activo vs. pasivo", skill: "vocabulary" },
  { h: "#/reading", i: "book", t: "Reading", s: "Read like a researcher", skill: "reading", skip: "reading" },
  { h: "#/listening", i: "headphones", t: "Listening", s: "0.75x → 2x · acentos", skill: "listening", skip: "listening" },
  { h: "#/writing", i: "quill", t: "Writing", s: "prioridad principal", skill: "academicWriting", skip: "writing" },
  { h: "#/speaking", i: "mic", t: "Speaking", s: "examen + académico", skill: "speaking", skip: "speaking" },
  { h: "#/pron", i: "speaker", t: "Pronunciation", s: "opcional · inteligibilidad", skill: "pronunciation", skip: "pronunciation" },
  { h: "#/academic", i: "columns", t: "Academic English", s: "hedging, stance, síntesis", skill: "academicWriting" },
  { h: "#/phd", i: "scroll", t: "PhD Mode", s: "supervisor, seminarios, viva", skill: "speaking" },
  { h: "#/strategy", i: "target", t: "Exam Strategy", s: "distractores · sobreanálisis", skill: "strategy" },
  { h: "#/reading?d=culture", i: "globe", t: "Cultura general", s: "ciencia, historia, arte…", skill: "reading" },
  { h: "#/professor", i: "teacher", t: "Professor Mode", s: "pregunta lo que quieras", skill: "" },
  { h: "#/dict", i: "search", t: "Diccionario", s: "76 000 entradas offline", skill: "" },
  { h: "#/generate", i: "sparkle", t: "Generar contenido", s: "IA opcional (Gemini)", skill: "" },
];

export function Learn() {
  const { tr, model, settings } = useApp();
  return (
    <div>
      <Topbar title={tr("Aprender", "Learn")} />
      <div className="grid2 md3 stagger">
        {MODULES.map((m) => {
          const skipped = m.skip && (settings.skip as any)[m.skip];
          const ab = m.skill ? model.skills[m.skill] : null;
          return (
            <button key={m.h} className={"tile" + (skipped ? " off" : "")} onClick={() => go(m.h)}>
              {ab && ab.n > 0 && <span className="lvl levelpill" style={{ fontSize: "0.75em" }}>{band(ab.theta).code}</span>}
              <div className="ti"><Icon name={m.i} size={22} /></div><div className="tt">{m.t}</div><div className="ts">{skipped ? tr("omitida (toca para abrir)", "skipped") : m.s}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const STATUS_ES: Record<string, string> = { mastered: "dominado", solid: "sólido", weak: "débil", learning: "aprendiendo", new: "nuevo" };

export function LessonsHub({ module }: { module: "grammar" | "academic" | "uoe" }) {
  const { tr, model } = useApp();
  const lessons = module === "grammar" ? GRAMMAR_LESSONS : module === "uoe" ? UOE_LESSONS : ACADEMIC_LESSONS;
  const groups = useMemo(() => {
    const g: Record<string, Lesson[]> = {};
    for (const l of lessons) (g[l.group || "—"] = g[l.group || "—"] || []).push(l);
    return g;
  }, [module]);
  const skill = module === "grammar" ? "grammar" : module === "uoe" ? "useOfEnglish" : "academicWriting";
  const th = model.skills[skill].theta;
  const title = module === "grammar" ? "Grammar" : module === "uoe" ? "Use of English" : "Academic English";
  return (
    <div>
      <Topbar title={title} back="#/learn" right={<span className="levelpill">{band(th).code}</span>} />
      <div className="small muted" style={{ marginBottom: 6 }}>{tr("Todo está abierto: no hay bloqueos. Los temas con estrella están cerca de tu nivel actual.", "Everything is open. Starred = near your level.")}</div>
      {Object.entries(groups).map(([g, ls]) => (
        <div key={g} className="stagger">
          <div className="section-title">{g}</div>
          {ls.map((l) => {
            const s = tagState(model, l.tag);
            const st = tagStatus(s);
            const acc = s.recent.length ? Math.round((s.recent.reduce((a, b) => a + b, 0) / s.recent.length) * 100) : null;
            const pat = errorPattern(s);
            const near = Math.abs(l.lvl - th) <= 6;
            return (
              <button key={l.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/lesson/${l.id}`)}>
                <div className={"node " + (st === "mastered" || st === "solid" ? "done" : st === "new" ? "new" : st === "weak" ? "warn" : "")}><Icon name={st === "mastered" ? "crown" : iconForTag(l.tag)} size={22} /></div>
                <div className="grow">
                  <div className="serif row" style={{ gap: 6 }}>{l.title} {near && st !== "mastered" ? <Icon name="star" size={14} className="gold" /> : null}</div>
                  <div className="tiny muted">{lvlLabel(l.lvl)} · {STATUS_ES[st] || st}{acc !== null ? ` · ${acc}%` : ""}{pat === "recurrent" ? " · " + tr("error recurrente", "recurring error") : pat === "pressure" ? " · " + tr("falla bajo presión", "fails under pressure") : ""}</div>
                  {s.n > 0 && <div style={{ marginTop: 4 }}><Bar pct={acc ?? 0} thin kind={st === "mastered" ? "gold" : st === "weak" ? "" : "green"} /></div>}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function LessonPage({ id }: { id: string }) {
  const { tr, model } = useApp();
  const lesson = lessonById(id);
  const [stage, setStage] = useState<"teach" | "practice" | "done">("teach");
  const [i, setI] = useState(0);
  const [res, setRes] = useState<boolean[]>([]);
  const [extra, setExtra] = useState<Item[]>([]);
  if (!lesson) return <Empty>Not found</Empty>;
  const items = [...lesson.items.filter((x) => x.kind !== "produce"), ...lesson.items.filter((x) => x.kind === "produce"), ...extra];
  const s = tagState(model, lesson.tag);
  const rvp = receptiveVsProductive(s);

  const onMore = async (kind: "similar" | "harder") => {
    const pool = itemsForTag(lesson.tag).filter((x) => !items.some((y) => y.id === x.id));
    const target = (items[i]?.lvl || lesson.lvl) + (kind === "harder" ? 8 : 0);
    const got = pickItems(pool, 1, target, new Set());
    if (got.length) { setExtra([...extra, ...got]); return; }
    if (aiReady()) {
      try {
        const r = await generateItems(lesson.tag, lesson.title, target, 3, ["mcq", "gap", "judge", "spot", "kwt"]);
        const its = (r.items || []).map((x: any, k: number) => ({ ...x, id: `ai-${lesson.tag}-${Date.now()}-${k}`, tags: [lesson.tag], skill: skillOf(lesson.tag), lvl: target, explain: x.explain || "" }));
        await addCustomItems(its);
        setExtra([...extra, ...its]);
      } catch {}
    }
  };

  return (
    <div>
      <Topbar title={lesson.title} back />
      {stage === "teach" && <TeachCard lesson={lesson} onDone={() => setStage("practice")} />}
      {stage === "practice" && items[i] && (
        <div className="card">
          <div className="row between" style={{ marginBottom: 8 }}><span className="tiny muted">{tr("Práctica", "Practice")}</span><span className="tag">{i + 1}/{items.length}</span></div>
          <ItemView key={items[i].id} item={items[i]} mode="practice" onMore={onMore}
            onDone={(r) => { setRes([...res, r.correct]); if (i + 1 >= items.length) setStage("done"); else setI(i + 1); }} />
        </div>
      )}
      {stage === "done" && (
        <div className="fadein">
          <OwlSays text={res.filter(Boolean).length / Math.max(1, res.length) >= 0.8 ? "That topic is now on my list of things you're dangerous at. I'll bring it back later, in a different context, to make sure." : "We'll revisit this one. Not as punishment — as strategy."} mood={res.filter(Boolean).length / Math.max(1, res.length) >= 0.8 ? "proud" : "soft"} />
          <div className="card">
            <div className="row between"><span>{tr("Resultado", "Result")}</span><b>{res.filter(Boolean).length}/{res.length}</b></div>
            <div className="small muted" style={{ marginTop: 6 }}>{tr("Próximo repaso", "Next review")}: {s.due ? new Date(s.due).toLocaleDateString() : "—"} · {tr("estado", "status")}: {tagStatus(s)}</div>
            {rvp.gap && <div className="small gold" style={{ marginTop: 6 }}>{tr("Reconoces esta estructura mejor de lo que la produces: más tareas de producción en tus sesiones.", "You recognise more than you produce.")}</div>}
          </div>
          <div className="row">
            <button className="btn ghost grow" onClick={() => history.back()}>{tr("Volver", "Back")}</button>
            <button className="btn primary grow" onClick={() => go(`#/practice/${encodeURIComponent(lesson.tag)}`)}><Icon name="infinity" size={18} /> {tr("Más práctica", "More practice")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PracticeTag({ tag }: { tag: string }) {
  const { tr, model, settings } = useApp();
  const lesson = lessonForTag(tag);
  const bank = itemsForTag(tag);
  const sk = bank[0]?.skill || "grammar";
  const th = () => model.skills[sk]?.theta ?? 58;
  const [queue, setQueue] = useState<Item[]>(() => pickItems(bank, Math.min(10, bank.length), th(), new Set()));
  const [i, setI] = useState(0);
  const [score, setScore] = useState({ n: 0, c: 0, run: 0 });
  const [round, setRound] = useState(1);
  const [note, setNote] = useState<string | null>(null);
  const wrong = React.useRef(new Set<string>());
  const busy = React.useRef(false);
  const it = queue[i];

  // nunca se acaba: banco sin ver → generados → IA (si hay clave) → repaso de lo visto (primero lo fallado)
  const more = async () => {
    if (busy.current) return;
    busy.current = true;
    const seenIds = new Set(queue.map((q) => q.id));
    let got = pickItems(bank.filter((x) => !seenIds.has(x.id)), 6, th() + 3, new Set());
    const gm = modeForTag(tag);
    if (got.length < 4 && gm) got = [...got, ...(await generate(gm, 6 - got.length, Math.round(th()), { accents: settings.accents }))];
    if (got.length < 4 && aiReady()) {
      try {
        const r = await generateItems(tag, lesson?.title || tagName(tag), Math.round(th()) + 4, 5, ["mcq", "gap", "judge", "spot", "kwt"]);
        const its = (r.items || []).map((x: any, k: number) => ({ ...x, id: `ai-${tag}-${Date.now()}-${k}`, tags: [tag], skill: skillOf(tag), lvl: Math.round(th()) + 4, explain: x.explain || "" }));
        await addCustomItems(its);
        got = [...got, ...its];
      } catch {}
    }
    if (got.length < 4) {
      // nueva ronda: lo que fallaste primero, luego lo más antiguo; nunca el último visto
      const recent = new Set(queue.slice(-4).map((q) => q.id));
      const failed = bank.filter((x) => wrong.current.has(x.id) && !recent.has(x.id));
      const rest = shuffle(bank.filter((x) => !wrong.current.has(x.id) && !recent.has(x.id)));
      got = [...got, ...failed, ...rest].slice(0, 8);
      if (got.length) { setRound((r) => r + 1); setNote(tr(`Ronda ${round + 1}: el banco de este tema tiene ${bank.length} ejercicios; repasamos primero lo que fallaste.`, `Round ${round + 1}: recycling, missed items first.`)); }
    }
    setQueue((q) => [...q, ...got]);
    busy.current = false;
  };
  React.useEffect(() => { if (queue.length - i <= 2) more(); }, [i]);

  return (
    <div>
      <div className="sess-head">
        <button className="iconbtn" onClick={() => history.back()} aria-label="Salir"><Icon name="x" /></button>
        <div className="grow">
          <div className="row between tiny muted" style={{ marginBottom: 4 }}><span className="row" style={{ gap: 6 }}><Icon name="infinity" size={14} /> {tagName(tag)}</span><span>{score.c}/{score.n}</span></div>
          <Bar pct={((score.n % 10) / 10) * 100} kind="gold" />
        </div>
      </div>
      <div className="sess-sub">
        {lesson ? <a className="sess-reason" href={`#/lesson/${lesson.id}`}><Icon name="learn" size={14} /> {tr("Repasar la lección", "Review the lesson")}</a> : <span />}
        {score.run >= 3 && <span className="combo-chip" key={score.run}><Icon name="flame" size={13} /> {score.run}</span>}
      </div>
      {note && <div className="card flat tight small muted fadein">{note}{!aiReady() && " " + tr("Con una clave gratuita de Gemini (Ajustes) también se generan ejercicios nuevos de gramática.", "")}</div>}
      {it ? (
        <div className="card act-enter" key={it.id + i}>
          <ItemView item={it} mode="practice" onMore={() => more()} onDone={(r) => {
            if (!r.correct) wrong.current.add(it.id); else wrong.current.delete(it.id);
            setScore((s) => ({ n: s.n + 1, c: s.c + (r.correct ? 1 : 0), run: r.correct ? s.run + 1 : 0 }));
            setI(i + 1); window.scrollTo(0, 0);
          }} />
        </div>
      ) : (
        <div className="card center"><Owl mood="thinking" size={80} /><div className="muted small">{tr("Buscando más…", "Loading…")}</div></div>
      )}
    </div>
  );
}
