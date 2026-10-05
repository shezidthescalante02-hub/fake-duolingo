import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { useApp, persistModelNow } from "../state";
import { Owl, OwlSays, Bar, go, shuffle, Topbar } from "../components/ui";
import { ItemView } from "../components/ItemView";
import { ReadingRunner } from "../components/ReadingRunner";
import { ListeningRunner } from "../components/ListeningRunner";
import { WritingRunner } from "../components/WritingRunner";
import { SpeakingRunner } from "../components/SpeakingRunner";
import { DIAG_GRAMMAR, VOCAB_BANDS, PSEUDOWORDS, DIAG_ACADVOCAB, DIAG_PRESSURE, DIAG_READING_ID, DIAG_LISTENING_ID, DIAG_WRITING, DIAG_SPEAKING, DIAG_PRON_SENTENCES } from "../content/diagnostic";
import { READINGS, LISTENING_SETS } from "../content/index";
import type { Item } from "../content/types";
import { db } from "../db/db";
import { SKILLS, overall, sdOf, type Attempt } from "../engine/model";
import { band, rangeLabel } from "../engine/cefr";
import { addWord } from "../engine/vocab";

type Sec = "intro" | "grammar" | "vocab" | "acadvocab" | "reading" | "listening" | "pressure" | "writing" | "speaking" | "pron" | "results";

export function Diagnostic() {
  const app = useApp();
  const { settings, tr, model, record, say, bump, refreshModel, setLock } = app;
  const sections = useMemo<Sec[]>(() => {
    const s: Sec[] = ["intro", "grammar", "vocab", "acadvocab"];
    if (!settings.skip.reading) s.push("reading");
    if (!settings.skip.listening) s.push("listening");
    s.push("pressure");
    if (!settings.skip.writing) s.push("writing");
    if (!settings.skip.speaking) s.push("speaking");
    s.push("pron", "results");
    return s;
  }, []);
  const [si, setSi] = useState(0);
  const [owlMsg] = useState(() => say("diagStart"));
  const sec = sections[si];
  const next = () => { setSi((x) => Math.min(sections.length - 1, x + 1)); window.scrollTo(0, 0); };
  const startedAt = useState(Date.now())[0];

  useEffect(() => { setLock({ dictionary: true, transcript: true, professor: true, reason: "diagnostic" }); return () => setLock(null); }, []);

  return (
    <div>
      <Topbar title={tr("Diagnóstico inicial", "Initial diagnostic")} back="#/" right={<span className="tag">{si}/{sections.length - 1}</span>} />
      <div style={{ marginBottom: 10 }}><Bar pct={(si / (sections.length - 1)) * 100} /></div>
      {sec === "intro" && (
        <div className="fadein">
          <OwlSays text={owlMsg.t} mood="smug" />
          <div className="card">
            <h3>{tr("Qué vamos a medir", "What we'll measure")}</h3>
            <p className="small">{tr("Gramática y Use of English (adaptativo), tamaño de vocabulario, vocabulario académico, comprensión e inferencia lectora, listening, rendimiento bajo presión, manejo del tiempo, escritura académica, speaking, fluidez, pronunciación (opcional) y tu tendencia a cambiar respuestas.", "Grammar, vocabulary, reading, listening, pressure, writing, speaking…")}</p>
            <p className="small muted">{tr("Sin retroalimentación durante el diagnóstico (para no contaminar la medición). Diccionario bloqueado. Responde con naturalidad: si dudas, elige y sigue.", "No feedback during the diagnostic.")}</p>
          </div>
          <button className="btn primary block" onClick={next}>{tr("Comenzar", "Begin")}</button>
        </div>
      )}
      {sec === "grammar" && <AdaptiveBlock pool={DIAG_GRAMMAR} n={14} skill="grammar" title={tr("Gramática y Use of English", "Grammar & Use of English")} onDone={next} />}
      {sec === "vocab" && <YesNoVocab onDone={next} />}
      {sec === "acadvocab" && <LinearBlock items={DIAG_ACADVOCAB} title={tr("Vocabulario académico", "Academic vocabulary")} onDone={next} />}
      {sec === "reading" && (
        <Section title="Reading" desc={tr("Un texto académico, 8 preguntas, 12 minutos.", "One text, 8 questions, 12 minutes.")}>
          <ReadingRunner set={READINGS.find((r) => r.id === DIAG_READING_ID)!} mode="diagnostic" limitSec={12 * 60} onDone={next} />
        </Section>
      )}
      {sec === "listening" && (
        <Section title="Listening" desc={tr("Una conversación académica. Se escucha una vez (como en el examen). Puedes leer las preguntas antes.", "Heard once.")}>
          <ListeningRunner set={LISTENING_SETS.find((l) => l.id === DIAG_LISTENING_ID)!} mode="diagnostic" plays={1} onDone={next} />
        </Section>
      )}
      {sec === "pressure" && <LinearBlock items={DIAG_PRESSURE} limit={20} title={tr("Bajo presión: 20 segundos por pregunta", "Under pressure: 20 s each")} onDone={next} />}
      {sec === "writing" && (
        <Section title="Writing" desc={tr("15 minutos. Escribe como lo harías en un examen.", "15 minutes.")}>
          <WritingRunner task={DIAG_WRITING as any} mode="diagnostic" onDone={next} />
        </Section>
      )}
      {sec === "speaking" && (
        <Section title="Speaking" desc={tr("30 s de preparación, 60 s para hablar. Si no puedes hablar ahora, omítelo: se medirá después.", "Skip if you can't speak now.")} skip={next}>
          <SpeakingRunner task={DIAG_SPEAKING as any} mode="diagnostic" onDone={next} />
        </Section>
      )}
      {sec === "pron" && <PronCheck onDone={next} />}
      {sec === "results" && <Results startedAt={startedAt} />}
    </div>
  );
}

function Section({ title, desc, children, skip }: { title: string; desc: string; children: React.ReactNode; skip?: () => void }) {
  const { tr } = useApp();
  const [go2, setGo] = useState(false);
  if (!go2) return (
    <div className="card fadein">
      <h2>{title}</h2>
      <p className="small">{desc}</p>
      <button className="btn primary block" onClick={() => setGo(true)}>{tr("Empezar sección", "Start section")}</button>
      {skip && <button className="btn ghost block" style={{ marginTop: 8 }} onClick={skip}>{tr("Omitir por ahora", "Skip for now")}</button>}
    </div>
  );
  return <>{children}</>;
}

function AdaptiveBlock({ pool, n, skill, title, onDone }: { pool: Item[]; n: number; skill: string; title: string; onDone: () => void }) {
  const { model, tr } = useApp();
  const [used, setUsed] = useState<string[]>([]);
  const [current, setCurrent] = useState<Item | null>(null);
  const pick = (u: string[]) => {
    const th = model.skills[skill]?.theta ?? 58;
    const cands = pool.filter((it) => !u.includes(it.id)).sort((a, b) => Math.abs(a.lvl - th) - Math.abs(b.lvl - th));
    return cands[Math.floor(Math.random() * Math.min(2, cands.length))] || null;
  };
  useEffect(() => { setCurrent(pick([])); }, []);
  if (!current) return null;
  return (
    <div className="card">
      <div className="row between"><h3 style={{ margin: 0 }}>{title}</h3><span className="tag">{used.length + 1}/{n}</span></div>
      <div className="tiny muted" style={{ margin: "4px 0 10px" }}>{tr("Adaptativo: la dificultad cambia según tus respuestas.", "Adaptive.")}</div>
      <ItemView key={current.id} item={current} mode="diagnostic" feedback={false} showLevel={false} hideProfessor
        onDone={() => { const u = [...used, current.id]; setUsed(u); if (u.length >= n) onDone(); else setCurrent(pick(u)); }} />
    </div>
  );
}

function LinearBlock({ items, title, onDone, limit }: { items: Item[]; title: string; onDone: () => void; limit?: number }) {
  const [i, setI] = useState(0);
  const it = items[i];
  return (
    <div className="card">
      <div className="row between"><h3 style={{ margin: 0 }}>{title}</h3><span className="tag">{i + 1}/{items.length}</span></div>
      <div style={{ height: 10 }} />
      <ItemView key={it.id} item={it} mode="diagnostic" feedback={false} showLevel={false} hideProfessor limitSec={limit ?? null}
        onDone={() => { if (i + 1 >= items.length) onDone(); else setI(i + 1); }} />
    </div>
  );
}

function YesNoVocab({ onDone }: { onDone: () => void }) {
  const { tr, record } = useApp();
  const list = useMemo(() => shuffle([...VOCAB_BANDS.flatMap((b) => b.words.map((w) => ({ w, lvl: b.lvl, real: true }))), ...PSEUDOWORDS.map((w) => ({ w, lvl: 0, real: false }))]), []);
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<Record<string, boolean>>({});
  const answer = async (yes: boolean) => {
    const a = { ...ans, [list[i].w]: yes };
    setAns(a);
    if (i + 1 < list.length) { setI(i + 1); return; }
    // puntuación: aciertos por banda corregidos por falsas alarmas
    const fa = PSEUDOWORDS.filter((w) => a[w]).length / PSEUDOWORDS.length;
    let score = 30;
    const missed: string[] = [];
    for (const b of VOCAB_BANDS) {
      const hits = b.words.filter((w) => a[w]).length / b.words.length;
      b.words.filter((w) => !a[w]).forEach((w) => missed.push(w));
      const corrected = Math.max(0, hits - fa);
      if (corrected >= 0.6) score = b.lvl + (corrected - 0.6) * 10;
    }
    score = Math.max(25, Math.min(92, Math.round(score - fa * 15)));
    await record({ itemId: "diag-yesno", skill: "vocabulary", tags: ["voc:size"], lvl: score, correct: true, score: 0.5, observed: score, timed: false, timeMs: 0, mode: "diagnostic" });
    // "Words I should probably know": palabras frecuentes que dijo no conocer
    for (const b of VOCAB_BANDS.filter((x) => x.lvl <= 60)) for (const w of b.words) if (!a[w]) await addWord(w, { source: "diagnostic", shouldKnow: true, tags: ["general"] });
    await db.kvSet("diagVocab", { score, fa, missed });
    onDone();
  };
  const cur = list[i];
  return (
    <div className="card center">
      <div className="row between"><h3 style={{ margin: 0 }}>{tr("Tamaño de vocabulario", "Vocabulary size")}</h3><span className="tag">{i + 1}/{list.length}</span></div>
      <p className="small muted" style={{ textAlign: "left" }}>{tr("¿Conoces esta palabra (al menos un significado)? Algunas son pseudopalabras inventadas: decir “sí” a ellas baja tu puntuación. Sé honesta.", "Do you know this word? Some are fake.")}</p>
      <div className="serif" style={{ fontSize: "2.2em", margin: "26px 0" }}>{cur.w}</div>
      <div className="row">
        <button className="btn grow" onClick={() => answer(false)}>✗ {tr("No la conozco", "No")}</button>
        <button className="btn primary grow" onClick={() => answer(true)}>✓ {tr("La conozco", "Yes")}</button>
      </div>
    </div>
  );
}

function PronCheck({ onDone }: { onDone: () => void }) {
  const { tr } = useApp();
  const [i, setI] = useState(-1);
  if (i === -1) return (
    <div className="card fadein">
      <h2>{tr("Pronunciación (opcional)", "Pronunciation (optional)")}</h2>
      <p className="small">{tr("Escucharás 3 oraciones y las repetirás. Mide inteligibilidad para el reconocedor de voz, no tu acento.", "Repeat 3 sentences (intelligibility).")}</p>
      <button className="btn primary block" onClick={() => setI(0)}>{tr("Hacerlo", "Do it")}</button>
      <button className="btn ghost block" style={{ marginTop: 8 }} onClick={onDone}>{tr("Omitir", "Skip")}</button>
    </div>
  );
  const s = DIAG_PRON_SENTENCES[i];
  return <SpeakingRunner key={i} task={{ id: "diag-pron-" + i, type: "repeat", title: `${tr("Oración", "Sentence")} ${i + 1}/3`, prompt: "Repeat", target: s, prepSec: 0, speakSec: 10, lvl: 60, checklist: [] }} mode="diagnostic" onDone={() => (i + 1 >= DIAG_PRON_SENTENCES.length ? onDone() : setI(i + 1))} />;
}

function Results({ startedAt }: { startedAt: number }) {
  const app = useApp();
  const { model, tr, refreshModel, bump, setSettings, record, say } = app;
  const [ready, setReady] = useState(false);
  const [notes, setNotes] = useState<{ strong: string[]; work: string[]; odd: string[]; nodata: string[] }>({ strong: [], work: [], odd: [], nodata: [] });
  const [owl] = useState(() => say("diagEnd"));

  useEffect(() => {
    (async () => {
      const atts = (await db.all<Attempt>("attempts")).filter((a) => a.at >= startedAt && a.mode === "diagnostic");
      // estrategia de examen: rendimiento en ítems con trampas vs sin trampas
      const trapAtt = atts.filter((a) => (a.trapsSeen || []).length > 0);
      const plainAtt = atts.filter((a) => (a.trapsSeen || []).length === 0 && !a.produce && a.observed === undefined);
      if (trapAtt.length >= 4 && plainAtt.length >= 4) {
        const ta = trapAtt.filter((a) => a.correct).length / trapAtt.length, pa = plainAtt.filter((a) => a.correct).length / plainAtt.length;
        await record({ itemId: "diag-strategy", skill: "strategy", tags: ["strat:distractors"], lvl: 60, correct: ta >= pa, observed: Math.round(overall(model) + (ta - pa) * 30), timed: false, timeMs: 0, mode: "diagnostic" });
      }
      // inconsistencias: fallos en ítems fáciles + aciertos en difíciles
      const odd: string[] = [], strong: string[] = [], work: string[] = [], nodata: string[] = [];
      const flags: Record<string, number> = {};
      for (const s of SKILLS) {
        const ab = model.skills[s.id];
        const mine = atts.filter((a) => a.skill === s.id && a.observed === undefined);
        if (ab.n < 1) { nodata.push(s.name); continue; }
        const incons = mine.filter((a) => (a.correct && a.lvl > ab.theta + 12) || (!a.correct && a.lvl < ab.theta - 12)).length;
        if (mine.length >= 4 && incons / mine.length >= 0.3) { odd.push(s.name); flags[s.id] = 1; }
        else if (ab.theta >= 66) strong.push(s.name);
        else if (ab.theta < 58) work.push(s.name);
      }
      const gap = model.skills.pressure.n >= 4 ? model.skills.grammar.theta - model.skills.pressure.theta : 0;
      if (gap > 8) work.push(tr("Rendimiento bajo presión (baja respecto a tu nivel sin tiempo)", "Under pressure"));
      model.flags = flags;
      model.diagnosed = true;
      model.diagnosedAt = Date.now();
      await persistModelNow(model);
      refreshModel();
      bump("diagnostic");
      setNotes({ strong, work, odd, nodata });
      setReady(true);
    })();
  }, []);

  if (!ready) return <div className="card center">…</div>;
  const ov = overall(model);
  return (
    <div className="fadein">
      <OwlSays text={owl.t} mood="thinking" />
      <div className="card hl center">
        <div className="tiny muted">Overall</div>
        <div className="levelpill gold" style={{ fontSize: "2em", padding: "6px 18px" }}>{band(ov).code}</div>
      </div>
      <div className="card">
        <table className="tbl">
          <tbody>
            {SKILLS.map((s) => {
              const a = model.skills[s.id];
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td style={{ textAlign: "right" }}>{a.n < 1 ? <span className="muted">{tr("sin datos aún", "no data yet")}</span> : <><b className="serif">{rangeLabel(a.theta, a.n < 4 ? sdOf(a) / 2 : 0)}</b>{a.n < 3 && <span className="tiny muted"> · {tr("provisional", "provisional")}</span>}</>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {notes.strong.length > 0 && <div className="card tight"><b className="ok">✓ {tr("Parecen dominadas", "Look solid")}:</b> <span className="small">{notes.strong.join(", ")}</span></div>}
      {notes.work.length > 0 && <div className="card tight"><b className="bad"><Icon name="edit" size={16} /> {tr("Necesitan trabajo", "Need work")}:</b> <span className="small">{notes.work.join(", ")}</span></div>}
      {notes.odd.length > 0 && <div className="card tight"><b className="gold"><Icon name="alert" size={16} /> {tr("Resultados inconsistentes (se volverán a comprobar)", "Inconsistent (will re-check)")}:</b> <span className="small">{notes.odd.join(", ")}</span></div>}
      {notes.nodata.length > 0 && <div className="card tight small muted">{tr("Aún sin datos suficientes", "Not enough data")}: {notes.nodata.join(", ")}. {tr("Se medirán mientras estudias.", "Will be measured as you study.")}</div>}
      <div className="card small muted">
        {tr("Este perfil es una primera estimación, no un veredicto. Un diagnóstico de 40 minutos tiene margen de error (por eso algunos niveles aparecen como rango, p. ej. B2+/C1). Cada ejercicio que hagas ajusta el perfil, y las áreas con resultados extraños se vuelven a evaluar automáticamente en tus sesiones.", "This is a first estimate…")}
      </div>
      <button className="btn primary block" onClick={() => { setSettings({ onboarded: true }); go("#/"); }}>{tr("Ir a mi plan", "Go to my plan")}</button>
    </div>
  );
}
