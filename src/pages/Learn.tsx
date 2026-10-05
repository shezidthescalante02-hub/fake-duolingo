import React, { useMemo, useState } from "react";
import { useApp } from "../state";
import { Topbar, go, Bar, Md, OwlSays, Empty } from "../components/ui";
import { GRAMMAR_LESSONS, UOE_LESSONS, ACADEMIC_LESSONS, lessonById, itemsForTag, tagName, addCustomItems, lessonForTag } from "../content/index";
import type { Lesson, Item } from "../content/types";
import { tagState, tagStatus, errorPattern, receptiveVsProductive } from "../engine/model";
import { band, lvlLabel } from "../engine/cefr";
import { TeachCard } from "../components/Cards";
import { ItemView } from "../components/ItemView";
import { pickItems } from "../engine/session";
import { aiReady, generateItems } from "../services/ai";
import { skillOf } from "../content/helpers";

const MODULES = [
  { h: "#/grammar", i: "🧩", t: "Grammar", s: "B2+ → C2", skill: "grammar" },
  { h: "#/uoe", i: "🔑", t: "Use of English", s: "KWT, word formation, cloze", skill: "useOfEnglish" },
  { h: "#/vocab", i: "🗂️", t: "Vocabulary", s: "SRS · activo vs. pasivo", skill: "vocabulary" },
  { h: "#/reading", i: "📖", t: "Reading", s: "Read like a researcher", skill: "reading", skip: "reading" },
  { h: "#/listening", i: "🎧", t: "Listening", s: "0.75x → 2x · acentos", skill: "listening", skip: "listening" },
  { h: "#/writing", i: "✒️", t: "Writing", s: "★ prioridad principal", skill: "academicWriting", skip: "writing" },
  { h: "#/speaking", i: "🎙️", t: "Speaking", s: "examen + académico", skill: "speaking", skip: "speaking" },
  { h: "#/pron", i: "🔊", t: "Pronunciation", s: "opcional · inteligibilidad", skill: "pronunciation", skip: "pronunciation" },
  { h: "#/academic", i: "🏛️", t: "Academic English", s: "hedging, stance, síntesis", skill: "academicWriting" },
  { h: "#/phd", i: "🎓", t: "PhD Mode", s: "supervisor, seminarios, viva", skill: "speaking" },
  { h: "#/strategy", i: "🪤", t: "Exam Strategy", s: "distractores · sobreanálisis", skill: "strategy" },
  { h: "#/reading?d=culture", i: "🌍", t: "Cultura general", s: "ciencia, historia, arte…", skill: "reading" },
  { h: "#/professor", i: "🧑‍🏫", t: "Professor Mode", s: "pregunta lo que quieras", skill: "" },
  { h: "#/dict", i: "🔎", t: "Diccionario", s: "76 000 entradas offline", skill: "" },
  { h: "#/generate", i: "✨", t: "Generar contenido", s: "IA opcional (Gemini)", skill: "" },
];

export function Learn() {
  const { tr, model, settings } = useApp();
  return (
    <div>
      <Topbar title={tr("Aprender", "Learn")} />
      <div className="grid2 md3">
        {MODULES.map((m) => {
          const skipped = m.skip && (settings.skip as any)[m.skip];
          const ab = m.skill ? model.skills[m.skill] : null;
          return (
            <button key={m.h} className={"tile" + (skipped ? " off" : "")} onClick={() => go(m.h)}>
              {ab && ab.n > 0 && <span className="lvl levelpill" style={{ fontSize: "0.75em" }}>{band(ab.theta).code}</span>}
              <div className="ti">{m.i}</div><div className="tt">{m.t}</div><div className="ts">{skipped ? tr("omitida (toca para abrir)", "skipped") : m.s}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function statusIcon(st: string) { return st === "mastered" ? "👑" : st === "solid" ? "✓" : st === "weak" ? "⚠️" : st === "learning" ? "…" : "○"; }

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
      <div className="small muted" style={{ marginBottom: 6 }}>{tr("Todo está abierto: no hay bloqueos. Los temas marcados ⭐ están cerca de tu nivel actual.", "Everything is open. ⭐ = near your level.")}</div>
      {Object.entries(groups).map(([g, ls]) => (
        <div key={g}>
          <div className="section-title">{g}</div>
          {ls.map((l) => {
            const s = tagState(model, l.tag);
            const st = tagStatus(s);
            const acc = s.recent.length ? Math.round((s.recent.reduce((a, b) => a + b, 0) / s.recent.length) * 100) : null;
            const pat = errorPattern(s);
            const near = Math.abs(l.lvl - th) <= 6;
            return (
              <button key={l.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/lesson/${l.id}`)}>
                <div className={"node " + (st === "mastered" || st === "solid" ? "done" : st === "new" ? "new" : "")}>{l.icon || "📘"}</div>
                <div className="grow">
                  <div className="serif">{l.title} {near && st !== "mastered" ? "⭐" : ""}</div>
                  <div className="tiny muted">{lvlLabel(l.lvl)} · {statusIcon(st)} {st}{acc !== null ? ` · ${acc}%` : ""}{pat === "recurrent" ? " · " + tr("error recurrente", "recurring error") : pat === "pressure" ? " · " + tr("falla bajo presión", "fails under pressure") : ""}</div>
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
            <button className="btn primary grow" onClick={() => go(`#/practice/${encodeURIComponent(lesson.tag)}`)}>{tr("Más práctica", "More practice")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PracticeTag({ tag }: { tag: string }) {
  const { tr, model } = useApp();
  const lesson = lessonForTag(tag);
  const [queue, setQueue] = useState<Item[]>(() => {
    const pool = itemsForTag(tag);
    const sk = pool[0]?.skill || "grammar";
    return pickItems(pool, Math.min(10, pool.length), model.skills[sk]?.theta ?? 58, new Set());
  });
  const [i, setI] = useState(0);
  const [score, setScore] = useState({ n: 0, c: 0 });
  const [busy, setBusy] = useState(false);
  const it = queue[i];
  const more = async () => {
    setBusy(true);
    const pool = itemsForTag(tag).filter((x) => !queue.some((q) => q.id === x.id));
    const sk = pool[0]?.skill || queue[0]?.skill || "grammar";
    let got = pickItems(pool, 6, (model.skills[sk]?.theta ?? 58) + 4, new Set());
    if (!got.length && aiReady()) {
      try {
        const r = await generateItems(tag, lesson?.title || tagName(tag), Math.round(model.skills[sk]?.theta ?? 60) + 4, 5, ["mcq", "gap", "judge", "spot", "kwt"]);
        got = (r.items || []).map((x: any, k: number) => ({ ...x, id: `ai-${tag}-${Date.now()}-${k}`, tags: [tag], skill: skillOf(tag), lvl: Math.round(model.skills[sk]?.theta ?? 60) + 4 }));
        await addCustomItems(got);
      } catch {}
    }
    setQueue([...queue, ...got]);
    setBusy(false);
  };
  return (
    <div>
      <Topbar title={tagName(tag)} back right={<span className="tag">{score.c}/{score.n}</span>} />
      {lesson && <div className="small" style={{ marginBottom: 8 }}><a href={`#/lesson/${lesson.id}`}>📘 {tr("Repasar la lección", "Review the lesson")}</a></div>}
      {it ? (
        <div className="card">
          <ItemView key={it.id + i} item={it} mode="practice" onMore={() => more()} onDone={(r) => { setScore({ n: score.n + 1, c: score.c + (r.correct ? 1 : 0) }); setI(i + 1); }} />
        </div>
      ) : (
        <div className="card center">
          <p>{tr("Terminaste los ítems disponibles de este tema.", "No more items for this topic.")}</p>
          <button className="btn primary" disabled={busy} onClick={more}>{busy ? "…" : aiReady() ? tr("Generar más con IA", "Generate more (AI)") : tr("Buscar más", "Find more")}</button>
          {!aiReady() && <div className="tiny muted" style={{ marginTop: 6 }}>{tr("Con una clave gratuita de Gemini (Ajustes) puedes generar ejercicios ilimitados.", "Add a free Gemini key for unlimited items.")}</div>}
        </div>
      )}
    </div>
  );
}
