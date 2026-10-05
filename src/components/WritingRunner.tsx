import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import type { WritingTask } from "../content/types";
import { Md, Timer, useCountdown, OwlSays, Bar } from "./ui";
import { useApp } from "../state";
import { analyzeText, estimateWritingScore, lexicalSophistication, words, type Issue } from "../engine/textAnalysis";
import { aiReady, writingFeedback } from "../services/ai";
import { db, uid } from "../db/db";
import { detectUses, getVocab, recentWords, review, type VocabEntry } from "../engine/vocab";
import { band, BANDS } from "../engine/cefr";
import { diff } from "../engine/difficulty";

type Stage = "write" | "diagnose" | "rewrite" | "reveal";
export interface WritingResult { score: number; text: string; words: number; issues: number }

function bandToScore(code?: string): number | null {
  if (!code) return null;
  const m = code.match(/(B1\+?|B2[+-]?|C1[+-]?|C2[+-★]?)/);
  if (!m) return null;
  const b = BANDS.find((x) => x.code === m[1].replace("★", "★"));
  return b ? b.min + 3 : null;
}

export function WritingRunner({ task, mode = "practice", onDone, exam }: { task: WritingTask; mode?: "practice" | "sim" | "diagnostic" | "session"; onDone: (r: WritingResult) => void; exam?: string }) {
  const { tr, record, say, addXp, bump, settings, lock } = useApp();
  const practice = mode === "practice" || mode === "session";
  const d = diff(settings.difficulty);
  const [stage, setStage] = useState<Stage>("write");
  const [text, setText] = useState("");
  const [v1, setV1] = useState("");
  const [timed, setTimed] = useState(!practice && !!task.timeMin);
  const [started, setStarted] = useState(false);
  const [mustWords, setMustWords] = useState<VocabEntry[]>([]);
  const [analysis, setAnalysis] = useState<{ issues: Issue[]; stats: any; est: { score: number; notes: string[] }; rare?: number } | null>(null);
  const [ai, setAi] = useState<any>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState("");
  const [checks, setChecks] = useState<number[]>([]);
  const [prevIssues, setPrevIssues] = useState<Issue[]>([]);
  const [owl, setOwl] = useState<any>(null);
  const finished = useRef(false);
  const minWords = Math.round(task.minWords * (practice ? d.wordsFactor : 1));
  const wc = words(text).length;
  const academic = !/email|toefl: write an email|review/i.test(task.genre);

  useEffect(() => {
    if (task.mustUseVocab) recentWords(8).then((ws) => setMustWords(ws.slice(0, Math.max(task.mustUseVocab!, practice ? d.mustUse : task.mustUseVocab!) + 1)));
  }, [task.id]);
  useEffect(() => { if (practice) setOwl(say("writingStart")); }, []);

  const limit = task.timeMin ? task.timeMin * 60 : null;
  const left = useCountdown(timed ? limit : null, timed && started && stage === "write", () => submit(true));

  async function analyse(t: string) {
    const { stats, issues } = analyzeText(t, academic);
    const soph = await lexicalSophistication(t);
    const est = estimateWritingScore(stats, issues, { minWords, rareRatio: soph.rareRatio });
    return { stats, issues, est, rare: soph.rareRatio };
  }

  async function submit(force = false) {
    if (!force && wc < 10) return;
    const a = await analyse(text);
    setAnalysis(a);
    if (!practice) {
      // simulación / diagnóstico: sin enseñanza en este momento
      let score = a.est.score;
      if (aiReady()) {
        try { const fb = await writingFeedback(task.prompt, text, task.genre, exam); const s = bandToScore(fb.band); if (s) score = Math.round(score * 0.3 + s * 0.7); setAi(fb); } catch {}
      }
      await finalize(text, score, a.issues.length);
      return;
    }
    setV1(text);
    setStage("diagnose");
    setOwl(say("writingDone"));
  }

  async function runAi(t: string) {
    setAiBusy(true); setAiErr("");
    try { setAi(await writingFeedback(task.prompt + (task.sources ? "\n\nSources:\n" + task.sources.join("\n") : ""), t, task.genre, exam)); }
    catch (e: any) { setAiErr(String(e.message || e)); }
    finally { setAiBusy(false); }
  }

  async function finalize(finalText: string, score: number, nIssues: number) {
    if (finished.current) return; finished.current = true;
    const vocab = (await getVocab()).filter((v) => !v.archived);
    const used = detectUses(finalText, vocab);
    for (const u of used) { await db.put("vocab", { ...u, uses: (u.uses || 0) + 1, prod: review(u.prod, 2) }); }
    if (used.length) bump("wordUses", used.length);
    const skill = /email|review|article|toefl: write an email/i.test(task.genre) ? "writing" : "academicWriting";
    const sc01 = Math.max(0, Math.min(1, (score - 30) / 60));
    await record({ itemId: task.id, skill: skill as any, tags: ["acad:writing", ...(task.focus.includes("hedging") ? ["acad:hedging"] : [])], lvl: task.lvl, correct: score >= task.lvl - 3, score: sc01, observed: score, timed, timeMs: 0, mode: mode === "session" ? "session" : mode, produce: true, exam });
    if (skill === "academicWriting") await record({ itemId: task.id + "-w", skill: "writing", tags: [], lvl: task.lvl, correct: score >= task.lvl - 3, score: sc01, observed: score, timed, timeMs: 0, mode, produce: true, exam });
    await db.put("writing", { id: uid("w"), taskId: task.id, title: task.title, genre: task.genre, v1: v1 || finalText, v2: v1 ? finalText : undefined, score, issues: nIssues, words: words(finalText).length, at: Date.now(), ai, exam });
    addXp(practice ? 40 + Math.round(words(finalText).length / 10) : 0, { writing: 1, ...(v1 && v1 !== finalText ? { rewrite: 1 } : {}) });
    onDone({ score, text: finalText, words: words(finalText).length, issues: nIssues });
  }

  const resolved = useMemo(() => {
    if (stage !== "reveal" || !analysis) return null;
    const now = new Set(analysis.issues.map((i) => i.id + i.match.toLowerCase()));
    return prevIssues.filter((i) => !now.has(i.id + i.match.toLowerCase()));
  }, [stage, analysis, prevIssues]);

  const selfScore = checks.length / Math.max(1, task.checklist.length);
  const finalScore = analysis ? Math.round(analysis.est.score * 0.65 + (35 + selfScore * 55) * 0.35) : 0;

  // ---------------------------------------------------------------- UI
  return (
    <div>
      {owl && stage === "write" && practice && <OwlSays text={owl.t} gloss={owl.gloss} mood={owl.mood} />}
      <div className="card">
        <div className="row between">
          <div><div className="tiny muted">{task.genre}{exam ? " · " + exam.toUpperCase() : ""}</div><h2 style={{ margin: 0 }}>{task.title}</h2></div>
          {timed && started && stage === "write" && limit && <Timer left={left} total={limit} />}
        </div>
        <div style={{ marginTop: 8 }}><Md text={task.prompt} /></div>
        {task.sources && task.sources.map((s, i) => <div key={i} className="ex-context"><Md text={s} /></div>)}
        <div className="row wrap small muted" style={{ gap: 10 }}>
          <span><Icon name="text" size={16} /> {minWords}{task.maxWords ? "–" + task.maxWords : "+"} {tr("palabras", "words")}</span>
          {task.timeMin && <span><Icon name="clock" size={16} /> {task.timeMin} min</span>}
          {lock.dictionary && <span className="lock"><Icon name="lock" size={16} /> {tr("sin diccionario", "no dictionary")}</span>}
        </div>
        {mustWords.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div className="small gold">{tr("Usa al menos", "Use at least")} {task.mustUseVocab}:</div>
            <div className="chips" style={{ marginTop: 4 }}>{mustWords.map((w) => <span key={w.id} className={"tag " + (text.toLowerCase().includes(w.id.slice(0, Math.max(4, w.id.length - 2))) ? "green" : "gold")} title={w.def}>{w.w}</span>)}</div>
          </div>
        )}
        {task.mustUseVocab && mustWords.length < 2 && <div className="small muted" style={{ marginTop: 6 }}>{tr("Todavía no tienes suficientes palabras nuevas: agrega algunas con “Add to Vocabulary” tocando palabras en cualquier texto.", "Add some words first.")}</div>}
      </div>

      {stage === "write" && (
        <>
          {practice && task.timeMin && !started && (
            <label className="row small" style={{ margin: "6px 2px" }}><input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> {tr(`Con el tiempo del examen (${task.timeMin} min)`, "Timed")}</label>
          )}
          {practice && task.phrases && !lock.dictionary && (
            <details className="card flat tight"><summary className="small"><Icon name="text" size={16} /> {tr("Banco de expresiones útiles", "Useful phrases")}</summary><div className="chips" style={{ marginTop: 8 }}>{task.phrases.map((p) => <span key={p} className="tag">{p}</span>)}</div></details>
          )}
          <textarea className="textarea" style={{ minHeight: 260 }} value={text} placeholder={tr("Escribe aquí, sin traductor. Un borrador puede ser imperfecto.", "Write here…")}
            onChange={(e) => { setText(e.target.value); if (!started) setStarted(true); }} spellCheck={false} autoCorrect="off" autoCapitalize="sentences" />
          <div className="row between small muted"><span>{wc} {tr("palabras", "words")}</span>{wc > 0 && <Bar pct={(wc / minWords) * 100} thin kind={wc >= minWords ? "green" : ""} />}</div>
          <div className="sticky-actions"><button className="btn primary block" disabled={wc < 10} onClick={() => submit()}>{practice ? tr("Entregar y diagnosticar", "Submit") : tr("Entregar", "Submit")}</button></div>
        </>
      )}

      {(stage === "diagnose" || stage === "rewrite") && analysis && (
        <>
          {owl && <OwlSays text={owl.t} gloss={owl.gloss} mood={owl.mood} />}
          <div className="card">
            <h3><Icon name="search" size={16} /> {tr("Paso 1 — Qué problemas tiene tu versión", "Step 1 — What's wrong")}</h3>
            <div className="small muted">{tr("Primero el diagnóstico. Las alternativas se muestran después de que lo intentes otra vez.", "Diagnosis first; alternatives after a retry.")}</div>
            <Stats s={analysis.stats} rare={analysis.rare} />
            {analysis.est.notes.map((n, i) => <div key={i} className="small" style={{ margin: "4px 0" }}>• {n}</div>)}
            {analysis.issues.length === 0 && <div className="small ok" style={{ marginTop: 8 }}>{tr("El analizador automático no encontró errores típicos. Eso no significa que el texto sea perfecto: revisa la autoevaluación o usa la IA.", "No typical errors found automatically.")}</div>}
            {analysis.issues.map((is, i) => (
              <div key={i} className={"feedback " + (is.soft ? "neutral" : "badf")} style={{ margin: "8px 0" }}>
                <div className="small"><span className={"tag " + (is.soft ? "gold" : "red")}>{catLabel(is.cat)}</span> <b className="serif">“{is.match}”</b></div>
                <div style={{ marginTop: 4 }}><Md text={is.msg} inline />{is.soft ? <span className="tiny muted"> · {tr("revisa (no siempre es error)", "check (not always wrong)")}</span> : null}</div>
                <div className="small muted" style={{ marginTop: 2 }}><Md text={is.why} inline /></div>
                <div className="small gold" style={{ marginTop: 2 }}><Icon name="bulb" size={16} /> {is.hint}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3><Icon name="sparkle" size={16} /> {tr("Análisis profundo con IA (opcional)", "AI analysis (optional)")}</h3>
            {!ai && <div className="small muted">{aiReady() ? tr("Gemini revisará argumentación, cohesión, registro y precisión — y también solo diagnosticará primero.", "Gemini will diagnose first.") : tr("Sin clave de IA o sin conexión: el análisis anterior es offline. Puedes añadir una clave gratuita de Gemini en Ajustes.", "No AI configured/offline.")}</div>}
            {!ai && aiReady() && <button className="btn sm" style={{ marginTop: 8 }} disabled={aiBusy} onClick={() => runAi(text)}>{aiBusy ? "…" : tr("Analizar con IA", "Analyse with AI")}</button>}
            {aiErr && <div className="small bad">{aiErr}</div>}
            {ai && <AiDiag ai={ai} reveal={false} />}
          </div>

          <div className="card">
            <h3><Icon name="check" size={16} /> {tr("Autoevaluación", "Self-check")}</h3>
            {task.checklist.map((c, i) => (
              <label key={i} className="row" style={{ padding: "5px 0" }}>
                <input type="checkbox" checked={checks.includes(i)} onChange={(e) => setChecks(e.target.checked ? [...checks, i] : checks.filter((x) => x !== i))} />
                <span className="small">{c}</span>
              </label>
            ))}
          </div>

          {stage === "diagnose" && (
            <div className="sticky-actions">
              <div className="row">
                <button className="btn ghost" onClick={async () => { setPrevIssues(analysis.issues); setStage("reveal"); }}>{tr("Ver alternativas ya", "Show alternatives")}</button>
                <button className="btn primary grow" onClick={() => { setPrevIssues(analysis.issues); setStage("rewrite"); }}><Icon name="quill" size={16} /> {tr("Paso 2: reescribir", "Step 2: rewrite")}</button>
              </div>
            </div>
          )}
          {stage === "rewrite" && (
            <div className="card">
              <h3><Icon name="quill" size={16} /> {tr("Paso 2 — Tu nueva versión", "Step 2 — Your revision")}</h3>
              <textarea className="textarea" style={{ minHeight: 240 }} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
              <div className="small muted">{wc} {tr("palabras", "words")}</div>
              <div className="sticky-actions">
                <button className="btn primary block" onClick={async () => { const a = await analyse(text); setAnalysis(a); if (ai && aiReady()) runAi(text); setStage("reveal"); }}>{tr("Revisar mi nueva versión", "Check my revision")}</button>
              </div>
            </div>
          )}
        </>
      )}

      {stage === "reveal" && analysis && (
        <>
          <div className="card hl">
            <h3><Icon name="chart" size={16} /> {tr("Paso 3 — Resultado y alternativas", "Step 3 — Result and alternatives")}</h3>
            <div className="row" style={{ gap: 12 }}>
              <div className="levelpill gold" style={{ fontSize: "1.3em" }}>{band(ai?.band ? bandToScore(ai.band) ?? finalScore : finalScore).code}</div>
              <div className="small muted grow">{ai?.band ? tr("Estimación de la IA: ", "AI estimate: ") + ai.band : tr("Estimación automática + autoevaluación (confianza baja; se afina con más textos).", "Automatic estimate (low confidence).")}</div>
            </div>
            {resolved && prevIssues.length > 0 && (
              <div className="small" style={{ marginTop: 8 }}>
                {v1 !== text ? <>✓ {tr("Corregiste", "You fixed")} <b>{resolved.length}</b> {tr("de", "of")} {prevIssues.length} {tr("problemas detectados.", "issues.")}</> : tr("No reescribiste el texto: aquí tienes las alternativas.", "No rewrite: alternatives below.")}
              </div>
            )}
          </div>
          {(prevIssues.length > 0 || analysis.issues.length > 0) && (
            <div className="card">
              <h3>{tr("Alternativas", "Alternatives")}</h3>
              {[...prevIssues, ...analysis.issues].filter((x, i, arr) => arr.findIndex((y) => y.id === x.id && y.match === x.match) === i).map((is, i) => (
                <div key={i} className="small" style={{ margin: "8px 0" }}>
                  <span className="serif bad">“{is.match}”</span> → {is.alt ? <b className="ok">{is.alt}</b> : <span className="muted">{is.hint}</span>}
                  <div className="tiny muted"><Md text={is.why} inline /></div>
                </div>
              ))}
            </div>
          )}
          {ai && <div className="card"><AiDiag ai={ai} reveal /></div>}
          {task.model && (
            <details className="card"><summary><Icon name="scroll" size={16} /> {tr("Respuesta modelo (una de muchas posibles)", "Model answer")}</summary><div className="serif" style={{ marginTop: 8 }}><Md text={task.model} /></div></details>
          )}
          <div className="sticky-actions"><button className="btn primary block" onClick={() => finalize(text, ai?.band ? (bandToScore(ai.band) ?? finalScore) : finalScore, analysis.issues.length)}>{tr("Guardar y continuar", "Save and continue")}</button></div>
        </>
      )}
    </div>
  );
}

function catLabel(c: string) {
  return ({ grammar: "Gramática", collocation: "Colocación", register: "Registro", "false-friend": "Falso amigo", clarity: "Claridad", academic: "Estilo académico", mechanics: "Mecánica" } as any)[c] || c;
}

function Stats({ s, rare }: { s: any; rare?: number }) {
  return (
    <div className="grid2 md4" style={{ margin: "10px 0" }}>
      <div className="stat"><div className="v">{s.words}</div><div className="l">palabras · {s.sentences} oraciones</div></div>
      <div className="stat"><div className="v">{s.avgSentence}</div><div className="l">palabras/oración (DE {s.sdSentence})</div></div>
      <div className="stat"><div className="v">{s.mattr || "–"}</div><div className="l">diversidad léxica (MATTR)</div></div>
      <div className="stat"><div className="v">{rare !== undefined ? Math.round(rare * 100) + "%" : "–"}</div><div className="l">léxico poco frecuente</div></div>
      <div className="stat"><div className="v">{new Set(s.connectors).size}</div><div className="l">conectores distintos</div></div>
      <div className="stat"><div className="v">{s.hedges.length}</div><div className="l">hedges · {s.boosters.length} boosters</div></div>
      <div className="stat"><div className="v">{s.nominalRate}</div><div className="l">nominalizaciones /100 pal.</div></div>
      <div className="stat"><div className="v">{s.subordination}</div><div className="l">subordinación / oración</div></div>
    </div>
  );
}

function AiDiag({ ai, reveal }: { ai: any; reveal: boolean }) {
  return (
    <div>
      {ai.overall && <p className="small">{ai.overall}</p>}
      {ai.scores && <div className="chips" style={{ margin: "6px 0" }}>{Object.entries(ai.scores).map(([k, v]: any) => <span key={k} className="tag">{k}: {v}</span>)}</div>}
      {(ai.problems || []).map((p: any, i: number) => (
        <div key={i} className="feedback neutral" style={{ margin: "8px 0" }}>
          <div className="small"><span className="tag gold">{p.type}</span> <b className="serif">“{p.quote}”</b></div>
          <div className="small" style={{ marginTop: 4 }}>{p.problem}</div>
          <div className="small muted">{p.why}</div>
          {!reveal && <div className="small gold"><Icon name="bulb" size={16} /> {p.hint}</div>}
          {reveal && p.options?.length > 0 && <div className="small ok" style={{ marginTop: 4 }}>→ {p.options.join(" · ")}</div>}
        </div>
      ))}
      {reveal && ai.strengths?.length > 0 && <div className="small"><b>Fortalezas:</b> {ai.strengths.join("; ")}</div>}
      {reveal && ai.nextFocus?.length > 0 && <div className="small"><b>Siguiente foco:</b> {ai.nextFocus.join("; ")}</div>}
    </div>
  );
}
