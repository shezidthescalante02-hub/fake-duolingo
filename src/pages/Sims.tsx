import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { useApp } from "../state";
import { Topbar, go, OwlSays, Timer, useCountdown, Empty, Bar, Md } from "../components/ui";
import { EXAMS, examById } from "../content/exams/index";
import type { ExamSpec, ExamSection, ExamPart } from "../content/exams/types";
import { ItemView, type ItemResult } from "../components/ItemView";
import { ReadingRunner } from "../components/ReadingRunner";
import { ListeningRunner } from "../components/ListeningRunner";
import { WritingRunner } from "../components/WritingRunner";
import { SpeakingRunner } from "../components/SpeakingRunner";
import { db, uid } from "../db/db";
import { partItemCount, itemWeight, toeflBand, toeflBandFromLevel, roundHalf, ieltsRawBand, ieltsBandFromLevel, ieltsOverall, cesFromProportion, cesFromLevel } from "../engine/examScoring";
import { cesToGrade, band, examEstimate } from "../engine/cefr";
import { overall } from "../engine/model";
import { stopSpeaking } from "../services/tts";

interface PartResult { partId: string; name: string; group?: string; correct: number; total: number; marks: number; maxMarks: number; level?: number; traps?: number }
interface SectionResult { id: string; name: string; kind: ExamSection["kind"]; parts: PartResult[]; timeUp: boolean; route?: string }

export function SimList() {
  const { tr, model, settings } = useApp();
  const [sims, setSims] = useState<any[]>([]);
  useEffect(() => { db.all<any>("sims").then((s) => setSims(s.sort((a, b) => b.at - a.at))); }, []);
  const ov = overall(model);
  const last = (id: string) => sims.find((s) => s.exam === id);
  const recommend = (id: string) => model.diagnosed && (!last(id) || Date.now() - last(id).at > 21 * 86400000) && settings.exams.includes(id as any);
  return (
    <div>
      <Topbar title={tr("Simulaciones de examen", "Exam simulations")} />
      <OwlSays text="Full exam conditions: timer, no dictionary, no transcripts, no pausing audio. You can do the whole thing or one section at a time." mood="angry" size={60} />
      {model.diagnosed && <div className="small muted" style={{ margin: "8px 2px" }}>{tr("Tu nivel estimado ahora", "Your current estimate")}: <b>{band(ov).code}</b> · IELTS ≈ {examEstimate(ov).ielts} · TOEFL ≈ {examEstimate(ov).toefl} · Cambridge ≈ {examEstimate(ov).ces}</div>}
      {EXAMS.map((e) => (
        <div key={e.id} className={"card " + (recommend(e.id) ? "hl" : "")}>
          <div className="row between"><h2 style={{ margin: 0 }}>{e.name}</h2>{recommend(e.id) && <span className="tag gold">{tr("recomendado", "recommended")}</span>}</div>
          <div className="small" style={{ margin: "6px 0" }}>{e.desc}</div>
          <div className="tiny muted">{e.scale}</div>
          <details style={{ marginTop: 6 }}><summary className="tiny muted">{tr("Sobre este formato", "About this format")}</summary><div className="tiny muted">{e.formatNote}</div></details>
          <div className="chips" style={{ marginTop: 10 }}>
            {e.sections.map((s) => <button key={s.id} className="chip" onClick={() => go(`#/sim/${e.id}?section=${s.id}`)}>{s.name} · {s.minutes}′</button>)}
          </div>
          <button className="btn primary block" style={{ marginTop: 10 }} onClick={() => go(`#/sim/${e.id}`)}>{tr("Examen completo", "Full exam")} · {e.sections.reduce((a, s) => a + s.minutes, 0)} min</button>
          {last(e.id) && <div className="tiny muted" style={{ marginTop: 6 }}>{tr("Último intento", "Last attempt")}: {new Date(last(e.id).at).toLocaleDateString()} · <a href={`#/simresult/${last(e.id).id}`}>{last(e.id).overallLabel}</a></div>}
        </div>
      ))}
    </div>
  );
}

export function SimRunner({ exam, section }: { exam: string; section?: string }) {
  const { tr, setLock, say, bump, addXp, profile } = useApp();
  const spec = examById(exam);
  const sections = useMemo(() => (spec ? spec.sections.filter((s) => !section || s.id === section) : []), [spec, section]);
  const [si, setSi] = useState(-1);
  const [results, setResults] = useState<SectionResult[]>([]);
  const [owl] = useState(() => say("simStart"));
  useEffect(() => { setLock({ dictionary: true, transcript: true, professor: true, reason: "sim" }); return () => { setLock(null); stopSpeaking(); }; }, []);
  if (!spec) return <Empty>Exam not found</Empty>;

  const finishSection = async (r: SectionResult) => {
    const all = [...results, r];
    setResults(all);
    if (si + 1 < sections.length) { setSi(si + 1); window.scrollTo(0, 0); return; }
    const rec = scoreSim(spec, all, section);
    await db.put("sims", rec);
    const tried = new Set((await db.all<any>("sims")).map((s) => s.exam));
    addXp(section ? 80 : 250, { sims: 1, examsTried: Math.max(0, tried.size - (profile.counters.examsTried || 0)) });
    setLock(null);
    go(`#/simresult/${rec.id}`);
  };

  if (si === -1) return (
    <div>
      <Topbar title={spec.name} back="#/sims" />
      <OwlSays text={owl.t} mood="angry" />
      <div className="card">
        <h3>{section ? sections[0]?.name : tr("Examen completo", "Full exam")}</h3>
        {sections.map((s) => <div key={s.id} className="row between small" style={{ margin: "4px 0" }}><span>{s.name}</span><span>{s.minutes} min</span></div>)}
        <div className="hr" />
        <div className="small"><Icon name="lock" size={16} /> {tr("Diccionario bloqueado · sin transcripts · sin Professor Mode · audio sin pausa · temporizador por sección. Al acabarse el tiempo, la sección se cierra.", "Exam conditions apply.")}</div>
        <div className="small muted" style={{ marginTop: 6 }}>{tr("Puedes tocar palabras para guardarlas en tu vocabulario (sin ver la definición) y estudiarlas después.", "You can save words for later.")}</div>
      </div>
      <button className="btn primary block" onClick={() => setSi(0)}>{tr("Comenzar", "Start")}</button>
    </div>
  );
  const sec = sections[si];
  return <SectionRunner key={sec.id} spec={spec} section={sec} index={si} count={sections.length} onDone={finishSection} />;
}

function SectionRunner({ spec, section, index, count, onDone }: { spec: ExamSpec; section: ExamSection; index: number; count: number; onDone: (r: SectionResult) => void }) {
  const { tr } = useApp();
  const [started, setStarted] = useState(false);
  const [parts, setParts] = useState<ExamPart[]>(section.adaptive ? section.adaptive.router : section.parts);
  const [route, setRoute] = useState<"router" | "upper" | "lower" | undefined>(section.adaptive ? "router" : undefined);
  const [pi, setPi] = useState(0);
  const [res, setRes] = useState<PartResult[]>([]);
  const done = useRef(false);
  const total = section.minutes * 60;
  const left = useCountdown(started ? total : null, started, () => end(true));
  const [choice, setChoice] = useState<number | null>(null);

  const end = (timeUp: boolean, extra: PartResult[] = []) => {
    if (done.current) return; done.current = true;
    stopSpeaking();
    let all = [...res, ...extra];
    // ítems no respondidos por falta de tiempo cuentan como incorrectos
    const remaining = [...parts.slice(pi + (extra.length ? 1 : 0))];
    if (section.adaptive && route === "router") remaining.push(...section.adaptive.lower);
    for (const p of remaining) if (!all.some((r) => r.partId === p.id) && partItemCount(p) > 0) all.push({ partId: p.id, name: p.name, group: p.group, correct: 0, total: partItemCount(p), marks: 0, maxMarks: partItemCount(p) * (p.marks || 1) });
    onDone({ id: section.id, name: section.name, kind: section.kind, parts: all, timeUp, route });
  };

  const partDone = (r: PartResult) => {
    const all = [...res, r];
    setRes(all);
    setChoice(null);
    if (pi + 1 < parts.length) { setPi(pi + 1); window.scrollTo(0, 0); return; }
    if (section.adaptive && route === "router") {
      const c = all.reduce((a, x) => a + x.correct, 0), t = all.reduce((a, x) => a + x.total, 0);
      const up = t ? c / t >= section.adaptive.threshold : false;
      setRoute(up ? "upper" : "lower");
      setParts([...parts, ...(up ? section.adaptive.upper : section.adaptive.lower)]);
      setPi(pi + 1);
      return;
    }
    done.current = true;
    onDone({ id: section.id, name: section.name, kind: section.kind, parts: all, timeUp: false, route });
  };

  if (!started) return (
    <div>
      <Topbar title={`${spec.short} · ${section.name}`} right={<span className="tag">{index + 1}/{count}</span>} />
      <div className="card">
        <h2>{section.name}</h2>
        <div className="small">{tr("Tiempo", "Time")}: {section.minutes} min{section.adaptive ? " · " + tr("multietapa adaptativo", "multistage adaptive") : ""}</div>
        {section.parts.length > 0 && <div style={{ marginTop: 8 }}>{section.parts.map((p) => <div key={p.id} className="small muted">• {p.name}</div>)}</div>}
        {section.kind === "speaking" && <div className="small gold" style={{ marginTop: 8 }}>{tr("Necesitarás micrófono y un lugar tranquilo.", "You'll need a microphone.")}</div>}
      </div>
      <button className="btn primary block" onClick={() => setStarted(true)}>{tr("Empezar sección", "Start section")}</button>
      {section.kind === "speaking" && <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => end(false)}>{tr("Omitir Speaking", "Skip speaking")}</button>}
    </div>
  );

  const p = parts[pi];
  const pre = (
    <div className="row between" style={{ position: "sticky", top: 0, zIndex: 6, background: "var(--bg)", padding: "8px 0" }}>
      <div className="small"><b>{section.name}</b> · {p?.name}</div>
      <Timer left={left} total={total} />
    </div>
  );
  if (!p) return <div>{pre}</div>;
  return (
    <div>
      {pre}
      <div className="card tight small muted"><Md text={p.instructions} inline /></div>
      {p.kind === "items" && <ItemsPart part={p} exam={spec.id} onDone={partDone} />}
      {p.kind === "reading" && p.reading && <ReadingRunner key={p.id} set={p.reading} mode="sim" exam={spec.id} onDone={(r) => partDone(toPart(p, r))} />}
      {p.kind === "listening" && <ListeningPart key={p.id} part={p} exam={spec.id} onDone={partDone} />}
      {p.kind === "writing" && p.writing && <WritingRunner key={p.id} task={p.writing} mode="sim" exam={spec.id} onDone={(w) => partDone({ partId: p.id, name: p.name, correct: 0, total: 0, marks: 0, maxMarks: 0, level: w.score })} />}
      {p.kind === "choice-writing" && p.writingOptions && (choice === null ? (
        <div>{p.writingOptions.map((w, k) => <button key={w.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => setChoice(k)}><div className="grow"><div className="serif">{w.genre}</div><div className="small muted">{w.prompt.slice(0, 160)}…</div></div></button>)}</div>
      ) : <WritingRunner key={p.id + choice} task={p.writingOptions[choice]} mode="sim" exam={spec.id} onDone={(w) => partDone({ partId: p.id, name: p.name + " — " + p.writingOptions![choice].genre, correct: 0, total: 0, marks: 0, maxMarks: 0, level: w.score })} />)}
      {p.kind === "speaking" && p.speaking && <SpeakingPart key={p.id} part={p} exam={spec.id} onDone={partDone} />}
    </div>
  );
}

function toPart(p: ExamPart, r: ItemResult[]): PartResult {
  const total = partItemCount(p) || r.length;
  const correct = r.filter((x) => x.correct).length;
  return { partId: p.id, name: p.name, group: p.group, correct, total, marks: correct * (p.marks || 1), maxMarks: total * (p.marks || 1) };
}

function ItemsPart({ part, exam, onDone }: { part: ExamPart; exam: string; onDone: (r: PartResult) => void }) {
  const [i, setI] = useState(0);
  const [res, setRes] = useState<ItemResult[]>([]);
  const items = part.items || [];
  const it = items[i];
  if (!it) return null;
  return (
    <div className="card">
      <div className="row between" style={{ marginBottom: 8 }}><span className="tiny muted">{part.name}</span><span className="tag">{i + 1}/{items.length}</span></div>
      <ItemView key={it.id} item={it} mode="sim" feedback={false} exam={exam} showLevel={false} hideProfessor limitSec={part.itemSeconds ?? null}
        onDone={(r) => {
          const w = itemWeight(it);
          const adj = w > 1 ? { ...r, correct: true, score: r.score, _w: w } : r;
          const all = [...res, adj as any]; setRes(all);
          if (i + 1 >= items.length) {
            const total = items.reduce((a, x) => a + itemWeight(x), 0);
            const correct = all.reduce((a: number, x: any) => a + (x._w ? Math.round(x.score * x._w) : x.correct ? 1 : 0), 0);
            onDone({ partId: part.id, name: part.name, group: part.group, correct, total, marks: correct * (part.marks || 1), maxMarks: total * (part.marks || 1) });
          } else setI(i + 1);
        }} />
    </div>
  );
}

function ListeningPart({ part, exam, onDone }: { part: ExamPart; exam: string; onDone: (r: PartResult) => void }) {
  const sets = part.listening || [];
  const [si, setSi] = useState(0);
  const [res, setRes] = useState<ItemResult[]>([]);
  const s = sets[si];
  if (!s) return null;
  return <ListeningRunner key={s.id} set={s} mode="sim" plays={part.plays ?? 1} exam={exam} onDone={(r) => { const all = [...res, ...r]; setRes(all); if (si + 1 >= sets.length) onDone(toPart(part, all)); else setSi(si + 1); }} />;
}

function SpeakingPart({ part, exam, onDone }: { part: ExamPart; exam: string; onDone: (r: PartResult) => void }) {
  const tasks = part.speaking || [];
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const t = tasks[i];
  if (!t) return null;
  return <SpeakingRunner key={t.id} task={t} mode="sim" exam={exam} onDone={(r) => { const all = [...scores, r.score]; setScores(all); if (i + 1 >= tasks.length) { const ok = all.filter((x) => x >= 0); onDone({ partId: part.id, name: part.name, correct: 0, total: 0, marks: 0, maxMarks: 0, level: ok.length ? Math.round(ok.reduce((a, b) => a + b, 0) / ok.length) : undefined }); } else setI(i + 1); }} />;
}

// ---------------------------------------------------------------- puntuación
function scoreSim(spec: ExamSpec, secs: SectionResult[], section?: string) {
  const out: { id: string; name: string; label: string; value: number; detail: string; level?: number }[] = [];
  const prop = (s: SectionResult, group?: string) => {
    const ps = s.parts.filter((p) => !group || p.group === group);
    const m = ps.reduce((a, p) => a + p.marks, 0), mm = ps.reduce((a, p) => a + p.maxMarks, 0);
    return { p: mm ? m / mm : 0, m, mm, c: ps.reduce((a, p) => a + p.correct, 0), t: ps.reduce((a, p) => a + p.total, 0) };
  };
  const lvlOf = (s: SectionResult) => { const ls = s.parts.filter((p) => p.level !== undefined).map((p) => p.level!); return ls.length ? ls.reduce((a, b) => a + b, 0) / ls.length : null; };
  for (const s of secs) {
    if (spec.id === "toefl") {
      if (s.kind === "receptive") { const r = prop(s); let b = toeflBand(r.p); if (s.route === "lower") b = Math.min(b, 4.5); out.push({ id: s.id, name: s.name, value: b, label: b.toFixed(1), detail: `${r.c}/${r.t}${s.route ? " · " + (s.route === "upper" ? "módulo alto" : "módulo bajo") : ""}` }); }
      else {
        const items = prop(s); const lv = lvlOf(s);
        const fromItems = items.t ? toeflBand(items.p) : null;
        const fromLvl = lv !== null ? toeflBandFromLevel(lv) : null;
        const b = fromItems !== null && fromLvl !== null ? roundHalf((fromItems * items.t * 0.04 + fromLvl) / (1 + items.t * 0.04)) : (fromLvl ?? fromItems ?? 1);
        out.push({ id: s.id, name: s.name, value: b, label: b.toFixed(1), detail: `${items.t ? items.c + "/" + items.t + " · " : ""}${lv !== null ? "nivel " + band(lv).code : "omitida"}`, level: lv ?? undefined });
      }
    } else if (spec.id === "ielts") {
      if (s.kind === "receptive") { const r = prop(s); const b = ieltsRawBand(r.c, r.t); out.push({ id: s.id, name: s.name, value: b, label: b.toFixed(1), detail: `${r.c}/${r.t} (≈ ${Math.round((r.c / Math.max(1, r.t)) * 40)}/40)` }); }
      else { const lv = lvlOf(s); const b = lv !== null ? ieltsBandFromLevel(lv) : 0; out.push({ id: s.id, name: s.name, value: b, label: lv !== null ? b.toFixed(1) : "—", detail: lv !== null ? "nivel " + band(lv).code : "omitida", level: lv ?? undefined }); }
    } else {
      const ex = spec.id as "cae" | "cpe";
      if (s.id === "rue") {
        const rd = prop(s, "reading"), uo = prop(s, "uoe");
        const cr = cesFromProportion(rd.p, ex), cu = cesFromProportion(uo.p, ex);
        out.push({ id: "reading", name: "Reading", value: cr, label: String(cr), detail: `${rd.m}/${rd.mm} puntos` });
        out.push({ id: "uoe", name: "Use of English", value: cu, label: String(cu), detail: `${uo.m}/${uo.mm} puntos` });
      } else if (s.kind === "receptive") { const r = prop(s); const c = cesFromProportion(r.p, ex); out.push({ id: s.id, name: s.name, value: c, label: String(c), detail: `${r.m}/${r.mm} puntos` }); }
      else { const lv = lvlOf(s); const c = lv !== null ? cesFromLevel(lv, ex) : 0; out.push({ id: s.id, name: s.name, value: c, label: lv !== null ? String(c) : "—", detail: lv !== null ? "nivel " + band(lv).code : "omitida", level: lv ?? undefined }); }
    }
  }
  const valid = out.filter((o) => o.label !== "—");
  let overallScore = 0, overallLabel = "—";
  if (valid.length) {
    if (spec.id === "toefl") { overallScore = roundHalf(valid.reduce((a, o) => a + o.value, 0) / valid.length); overallLabel = (section ? "≈ " : "") + overallScore.toFixed(1); }
    else if (spec.id === "ielts") { overallScore = ieltsOverall(valid.map((o) => o.value)); overallLabel = (section ? "≈ " : "") + overallScore.toFixed(1); }
    else { overallScore = Math.round(valid.reduce((a, o) => a + o.value, 0) / valid.length); overallLabel = `${overallScore} · ${cesToGrade(overallScore, spec.id as any)}`; }
  }
  return { id: uid("sim"), exam: spec.id, examName: spec.name, section: section ? secs[0]?.name : undefined, at: Date.now(), results: out, sections: secs, overallScore, overallLabel };
}

export function SimResult({ id }: { id: string }) {
  const { tr, say } = useApp();
  const [rec, setRec] = useState<any>(null);
  const [owl] = useState(() => say("simEnd"));
  useEffect(() => { db.get("sims", id).then(setRec); }, [id]);
  if (!rec) return null;
  const parts: PartResult[] = rec.sections.flatMap((s: SectionResult) => s.parts.filter((p: PartResult) => p.total > 0));
  const weakest = [...parts].sort((a, b) => a.correct / a.total - b.correct / b.total).slice(0, 3);
  return (
    <div>
      <Topbar title={tr("Resultado", "Result")} back="#/sims" />
      <OwlSays text={owl.t} mood="thinking" />
      <div className="card hl center">
        <div className="small muted">{rec.examName}{rec.section ? " · " + rec.section : ""}</div>
        <div className="serif" style={{ fontSize: "2em" }}>{rec.overallLabel}</div>
        <div className="tiny muted">{tr("Estimación aproximada, no oficial.", "Approximate, unofficial estimate.")}</div>
      </div>
      <div className="card">
        {rec.results.map((r: any) => (
          <div key={r.id} className="row between" style={{ margin: "8px 0" }}><span>{r.name}</span><span><b className="serif">{r.label}</b> <span className="tiny muted">{r.detail}</span></span></div>
        ))}
      </div>
      {parts.length > 0 && (
        <div className="card">
          <h3>{tr("Por parte", "By part")}</h3>
          {parts.map((p) => (
            <div key={p.partId} style={{ margin: "8px 0" }}>
              <div className="row between small"><span>{p.name}</span><span>{p.correct}/{p.total}</span></div>
              <Bar pct={(p.correct / p.total) * 100} thin kind={p.correct / p.total >= 0.75 ? "green" : p.correct / p.total < 0.5 ? "" : "gold"} />
            </div>
          ))}
        </div>
      )}
      {weakest.length > 0 && (
        <div className="card">
          <h3><Icon name="search" size={16} /> {tr("Análisis", "Analysis")}</h3>
          <div className="small">{tr("Partes con menor rendimiento", "Weakest parts")}: {weakest.map((w) => w.name).join(" · ")}</div>
          <div className="small muted" style={{ marginTop: 6 }}>{tr("Tus errores de esta simulación ya alimentan tu perfil: en las próximas sesiones verás más práctica de esos tipos de pregunta y de las trampas en las que caíste. Revisa Estrategia para ver si hubo sobreanálisis o problemas de tiempo.", "Errors feed your profile.")}</div>
          {rec.sections.some((s: SectionResult) => s.timeUp) && <div className="small gold" style={{ marginTop: 6 }}><Icon name="clock" size={16} /> {tr("Se te acabó el tiempo en al menos una sección: practica la gestión del tiempo (Estrategia → Timing).", "Time ran out in a section.")}</div>}
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn sm" onClick={() => go("#/strategy")}>{tr("Ver estrategia", "Strategy")}</button>
            <button className="btn sm" onClick={() => go("#/dashboard")}>Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
