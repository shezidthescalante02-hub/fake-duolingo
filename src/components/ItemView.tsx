import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Item, MCQItem, Trap } from "../content/types";
import { TRAP_LABEL } from "../content/types";
import { evaluate, parseCTest, type EvalResult } from "../engine/evaluate";
import { useApp } from "../state";
import { Md, OwlSays, Tap, Timer, useCountdown, shuffle } from "./ui";
import { sfx } from "../services/sound";
import { ProfessorSheet } from "./Professor";
import type { Attempt } from "../engine/model";
import { lvlLabel } from "../engine/cefr";
import { words } from "../engine/textAnalysis";
import type { OwlLine } from "../owl/messages";

export interface ItemResult { correct: boolean; score: number; attempt?: Attempt; timeMs: number; changes: number; firstCorrect?: boolean }

let correctRun = 0;

const CAUSES: { id: string; es: string }[] = [
  { id: "didnt-know", es: "No lo sabía" },
  { id: "rushed", es: "Lo sabía, me precipité" },
  { id: "overthought", es: "Lo sobrepensé" },
  { id: "misread", es: "Leí mal la pregunta" },
  { id: "distracted", es: "Me distraje" },
];

export function ItemView(props: {
  item: Item;
  mode: "practice" | "diagnostic" | "sim" | "review" | "session";
  limitSec?: number | null;
  feedback?: boolean;
  onDone: (r: ItemResult) => void;
  index?: number;
  total?: number;
  exam?: string;
  hideProfessor?: boolean;
  context?: string;            // texto relacionado (lectura) para Professor Mode
  onMore?: (kind: "similar" | "harder") => void;
  showLevel?: boolean;
  compact?: boolean;
}) {
  const { item, mode } = props;
  const app = useApp();
  const { settings, record, say, model, lock, tr } = app;
  const feedback = props.feedback ?? (mode === "practice" || mode === "session" || mode === "review");
  const [resp, setResp] = useState<any>(initialResp(item));
  const [hist, setHist] = useState<any[]>([]);
  const [checked, setChecked] = useState<EvalResult | null>(null);
  const [conf, setConf] = useState<"sure" | "unsure" | "guess" | undefined>();
  const [cause, setCause] = useState<string | undefined>();
  const [askChange, setAskChange] = useState(false);
  const [changeReason, setChangeReason] = useState<"evidence" | "doubt" | undefined>();
  const [owlMsg, setOwlMsg] = useState<OwlLine | null>(null);
  const [prof, setProf] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const t0 = useRef(Date.now());
  const timed = !!props.limitSec;
  const left = useCountdown(props.limitSec ?? null, timed && !checked, () => { setTimeUp(true); submit(true); });

  useEffect(() => {
    setResp(initialResp(item)); setHist([]); setChecked(null); setConf(undefined); setCause(undefined);
    setAskChange(false); setChangeReason(undefined); setOwlMsg(null); setTimeUp(false); t0.current = Date.now();
    // eslint-disable-next-line
  }, [item.id]);

  const choose = (v: any) => {
    if (checked) return;
    sfx.tap();
    setResp(v);
    setHist((h) => (h.length && JSON.stringify(h[h.length - 1]) === JSON.stringify(v) ? h : [...h, v]));
  };

  const changes = Math.max(0, hist.length - 1);
  const firstCorrect = hist.length ? evaluate(item, hist[0]).correct : undefined;
  const answered = isAnswered(item, resp);

  function submit(force = false) {
    if (checked) return;
    if (!force && !answered) return;
    if (!force && changes > 0 && !changeReason && feedback && (item.kind === "mcq" || item.kind === "tf")) { setAskChange(true); return; }
    const r = evaluate(item, resp);
    const timeMs = Date.now() - t0.current;
    if (!feedback) {
      finalize(r, timeMs, undefined);
      return;
    }
    setChecked(r);
    if (r.correct) { sfx.correct(); correctRun++; } else { sfx.wrong(); correctRun = 0; }
    // reacción del búho
    let ev: any = r.correct ? (correctRun >= 5 && correctRun % 5 === 0 ? "correctStreak" : item.lvl >= 75 ? "correctHard" : "correct") : "wrong";
    if (!r.correct && firstCorrect && changes > 0) ev = "overthink";
    else if (r.correct && changes > 0 && firstCorrect === false) ev = "goodChange";
    else if (!r.correct && settings.sarcasm !== "off" && (item.basic || item.lvl < model.skills[item.skill].theta - 18)) ev = "wrongBasic";
    else if (!r.correct && timeMs < 4000 && item.kind === "mcq") ev = "rushed";
    if (r.correct && Math.random() < 0.55 && ev === "correct") setOwlMsg(null);
    else setOwlMsg(say(ev));
  }

  async function finalize(r: EvalResult, timeMs: number, selfTag?: string) {
    const trap: Trap | null = item.kind === "mcq" && !r.correct ? ((item as MCQItem).traps?.[resp] ?? null) : null;
    const trapsSeen = item.kind === "mcq" ? ((item as MCQItem).traps || []).filter(Boolean) as Trap[] : [];
    const { attempt } = await record({
      itemId: item.id, skill: item.skill, tags: item.tags, lvl: item.lvl, correct: r.correct, score: r.score,
      timed, timeMs, limitMs: props.limitSec ? props.limitSec * 1000 : undefined,
      first: hist[0], final: resp, changes, firstCorrect, trap, trapsSeen, confidence: conf, selfTag, changeReason,
      mode, produce: item.kind === "produce", exam: props.exam,
    });
    props.onDone({ correct: r.correct, score: r.score, attempt, timeMs, changes, firstCorrect });
  }

  const cont = () => { if (checked) finalize(checked, Date.now() - t0.current, cause); };

  // ---------------------------------------------------------------- render por tipo
  const dis = !!checked;
  const body = (() => {
    switch (item.kind) {
      case "mcq": return <MCQ item={item} resp={resp} choose={choose} checked={checked} order={undefined} />;
      case "tf": {
        const opts = item.mode === "YNNG" ? [["T", "YES"], ["F", "NO"], ["NG", "NOT GIVEN"]] : [["T", "TRUE"], ["F", "FALSE"], ["NG", "NOT GIVEN"]];
        return (
          <>
            <div className="ex-context"><Tap text={item.statement} source="tf" /></div>
            {opts.map(([v, l]) => (
              <button key={v} disabled={dis} className={"opt " + optCls(v, resp, checked ? item.answer : null)} onClick={() => choose(v)}>
                <span className="k">{v === "NG" ? "?" : v === "T" ? "✓" : "✗"}</span><span>{l}</span>
              </button>
            ))}
          </>
        );
      }
      case "gap":
      case "wf": {
        const [a, b] = item.text.split("___");
        return (
          <div className="ex-context" style={{ whiteSpace: "normal" }}>
            <Tap text={a} />
            <input className={"gapinput " + (checked ? (checked.correct ? "right" : "wrong") : "")} value={resp} disabled={dis} autoCapitalize="off" autoCorrect="off" spellCheck={false}
              onChange={(e) => setResp(e.target.value)} onBlur={() => resp && setHist((h) => [...h, resp])} onKeyDown={(e) => e.key === "Enter" && submit()} />
            <Tap text={b || ""} />
            {item.kind === "wf" && <span className="tag gold" style={{ marginLeft: 8 }}>{item.base.toUpperCase()}</span>}
          </div>
        );
      }
      case "kwt":
        return (
          <>
            <div className="ex-context" style={{ whiteSpace: "normal" }}><Tap text={item.first} /></div>
            <div className="center" style={{ margin: "6px 0" }}><span className="levelpill gold">{item.key.toUpperCase()}</span></div>
            <div className="ex-context" style={{ whiteSpace: "normal", borderLeftColor: "var(--gold)" }}>
              {item.start} <input className={"gapinput " + (checked ? (checked.correct ? "right" : "wrong") : "")} style={{ minWidth: 180 }} value={resp} disabled={dis} autoCapitalize="off" autoCorrect="off" spellCheck={false}
                onChange={(e) => setResp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} /> {item.end}
            </div>
            <div className="tiny muted">{tr(`Entre ${item.minWords ?? 2} y ${item.maxWords ?? 6} palabras, incluida la palabra clave (sin cambiarla).`, `Use ${item.minWords ?? 2}–${item.maxWords ?? 6} words including the key word.`)}</div>
          </>
        );
      case "judge":
        return (
          <>
            {item.context && <div className="tag blue" style={{ marginBottom: 6 }}>{item.context}</div>}
            <div className="ex-context"><Tap text={item.sentence} /></div>
            <JudgeRow label={tr("¿Es gramatical?", "Is it grammatical?")} val={resp.g} set={(v) => choose({ ...resp, g: v })} right={checked ? item.grammatical : undefined} dis={dis} />
            <JudgeRow label={tr("¿Es apropiada para este contexto académico?", "Is it appropriate in this academic context?")} val={resp.a} set={(v) => choose({ ...resp, a: v })} right={checked ? item.appropriate : undefined} dis={dis} />
          </>
        );
      case "order": return <OrderView item={item} resp={resp} setResp={(v: any) => { setResp(v); }} dis={dis} checked={checked} />;
      case "spot":
        return (
          <>
            <div className="ex-context" style={{ whiteSpace: "normal" }}>
              {item.segments.map((s, i) => (
                <span key={i} onClick={() => !dis && choose({ idx: i })} style={{ cursor: "pointer", padding: "2px 3px", borderRadius: 6, marginRight: 2, borderBottom: "2px dotted var(--line2)",
                  background: checked && i === item.wrong ? "var(--green-soft)" : resp?.idx === i ? (checked ? "var(--red-soft)" : "var(--gold-soft)") : undefined }}>
                  <sup className="tiny muted">{String.fromCharCode(65 + i)}</sup>{s}
                </span>
              ))}
            </div>
            {item.wrong === -1 || true ? (
              <button className={"chip " + (resp?.idx === -1 ? "on" : "")} disabled={dis} onClick={() => choose({ idx: -1 })}>{tr("No hay error", "No error")}</button>
            ) : null}
          </>
        );
      case "produce": return <ProduceView item={item} resp={resp} setResp={setResp} checked={checked} />;
      case "ctest": return <CTestView item={item} resp={resp} setResp={setResp} checked={checked} />;
    }
  })();

  const showCtx = item.ctx && item.kind !== "tf";
  return (
    <div className="fadein">
      <div className="row between" style={{ marginBottom: 6 }}>
        <div className="row" style={{ gap: 6 }}>
          {props.showLevel !== false && <span className="tag">{lvlLabel(item.lvl)}</span>}
          {item.tests && feedback && checked && <span className="tag blue">{testsLabel(item.tests)}</span>}
          {timed && !checked && <Timer left={left} total={props.limitSec!} />}
        </div>
        <div className="row" style={{ gap: 6 }}>
          {lock.dictionary && <span className="lock">🔒 {tr("diccionario", "dictionary")}</span>}
          {!props.hideProfessor && !lock.professor && feedback && (
            <button className="btn xs ghost" onClick={() => setProf(true)}>🧑‍🏫 Professor</button>
          )}
        </div>
      </div>
      {showCtx && <div className="ex-context"><Tap text={item.ctx!} /></div>}
      {item.prompt && <div className="ex-prompt"><Md text={item.prompt} inline /></div>}
      {body}

      {/* confianza opcional */}
      {feedback && settings.askConfidence && !checked && item.kind !== "produce" && (
        <div className="chips" style={{ marginTop: 10 }}>
          {([["sure", "Segura"], ["unsure", "Dudando"], ["guess", "Adivinando"]] as const).map(([k, l]) => (
            <button key={k} className={"chip " + (conf === k ? "on" : "")} onClick={() => setConf(conf === k ? undefined : k)}>{l}</button>
          ))}
        </div>
      )}

      {askChange && !checked && (
        <div className="feedback neutral">
          <h4>{tr("Cambiaste tu respuesta. ¿Por qué?", "You changed your answer. Why?")}</h4>
          <div className="small muted" style={{ marginBottom: 8 }}>{tr("Esto entrena la diferencia entre revisar con evidencia y sobrepensar.", "This trains the difference between evidence-based revision and overthinking.")}</div>
          <div className="chips">
            <button className="chip" onClick={() => { setChangeReason("evidence"); setAskChange(false); setTimeout(() => submitAfterReason("evidence"), 0); }}>🔎 {tr("Encontré nueva evidencia", "I found new evidence")}</button>
            <button className="chip" onClick={() => { setChangeReason("doubt"); setAskChange(false); setTimeout(() => submitAfterReason("doubt"), 0); }}>🌀 {tr("Dudé / me pareció que también podía ser", "I just doubted")}</button>
          </div>
        </div>
      )}

      {checked && feedback && (
        <div className={"feedback " + (checked.correct ? "good" : checked.score > 0 ? "neutral" : "badf")}>
          <h4>{checked.correct ? "✓ " + tr("Correcto", "Correct") : checked.score > 0 ? "◐ " + tr("Parcialmente correcto", "Partly correct") : "✗ " + tr("Incorrecto", "Incorrect")}{timeUp ? " · ⏱ " + tr("tiempo agotado", "time's up") : ""}</h4>
          {!checked.correct && <CorrectAnswer item={item} />}
          {checked.note && <div className="small gold" style={{ margin: "6px 0" }}>{checked.note}</div>}
          {item.kind === "mcq" && !checked.correct && typeof resp === "number" && (item as MCQItem).why?.[resp] && (
            <div className="small" style={{ margin: "6px 0" }}>
              <b>{tr("Por qué tu opción no funciona:", "Why your option doesn't work:")}</b> <Md text={(item as MCQItem).why![resp]!} inline />
              {(item as MCQItem).traps?.[resp] && <div><span className="tag red">{tr("Trampa", "Trap")}: {TRAP_LABEL[(item as MCQItem).traps![resp]!]}</span></div>}
            </div>
          )}
          <Md text={item.explain} />
          {item.kind === "judge" && (item as any).better && <div className="ex good">{(item as any).better}</div>}
          {changes > 0 && firstCorrect !== undefined && (
            <div className="small" style={{ marginTop: 6 }}>
              {firstCorrect && !checked.correct ? "🌀 " + tr("Tu primera respuesta era correcta. Registrado como sobreanálisis.", "Your first answer was right. Logged as overthinking.") :
                !firstCorrect && checked.correct ? "🔎 " + tr("Buen cambio: corregiste con evidencia.", "Good revision.") : ""}
            </div>
          )}
          {owlMsg && <div style={{ marginTop: 10 }}><OwlSays text={owlMsg.t} gloss={owlMsg.gloss} mood={owlMsg.mood} size={56} /></div>}
          {!checked.correct && settings.askCause && !(firstCorrect && changes > 0) && (
            <div style={{ marginTop: 10 }}>
              <div className="small muted" style={{ marginBottom: 6 }}>{tr("¿Qué pasó? (opcional, mejora tu diagnóstico)", "What happened? (optional)")}</div>
              <div className="chips">
                {CAUSES.map((c) => <button key={c.id} className={"chip " + (cause === c.id ? "on" : "")} onClick={() => setCause(cause === c.id ? undefined : c.id)}>{c.es}</button>)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="sticky-actions">
        {!checked ? (
          <button className="btn primary block" disabled={!answered && !timeUp} onClick={() => submit()}>
            {feedback ? tr("Comprobar", "Check") : tr("Siguiente", "Next")}
          </button>
        ) : (
          <div className="row">
            {props.onMore && <button className="btn ghost" onClick={() => props.onMore!("similar")} title="Otro ejemplo">＋</button>}
            <button className="btn primary grow" onClick={cont}>{tr("Continuar", "Continue")}</button>
          </div>
        )}
      </div>

      <ProfessorSheet open={prof} onClose={() => setProf(false)} item={item} resp={resp} checked={!!checked} context={props.context} onMore={props.onMore} />
    </div>
  );

  function submitAfterReason(reason: "evidence" | "doubt") {
    const r = evaluate(item, resp);
    setChecked(r);
    if (r.correct) { sfx.correct(); correctRun++; } else { sfx.wrong(); correctRun = 0; }
    const ev = !r.correct && firstCorrect ? "overthink" : r.correct && firstCorrect === false ? "goodChange" : r.correct ? "correct" : "wrong";
    setOwlMsg(say(ev as any));
    void reason;
  }
}

function testsLabel(t: string) {
  return ({ grammar: "Evalúa gramática", meaning: "Evalúa significado", both: "Gramática + significado", register: "Evalúa registro", collocation: "Evalúa colocación", form: "Evalúa forma" } as any)[t] || t;
}

function initialResp(item: Item): any {
  switch (item.kind) {
    case "mcq": case "tf": return null;
    case "gap": case "wf": case "kwt": return "";
    case "judge": return { g: null, a: null };
    case "order": return [];
    case "spot": return null;
    case "produce": return { text: "", score: null, checks: [] };
    case "ctest": return {};
  }
}

function isAnswered(item: Item, r: any): boolean {
  switch (item.kind) {
    case "mcq": case "tf": return r !== null && r !== undefined;
    case "gap": case "wf": case "kwt": return !!(r && r.trim());
    case "judge": return r.g !== null && r.a !== null;
    case "order": return r.length === item.tokens.length;
    case "spot": return r !== null;
    case "produce": return typeof r.score === "number";
    case "ctest": return Object.values(r || {}).some((v: any) => v && v.trim());
  }
}

function optCls(v: any, sel: any, right: any) {
  if (right !== null && right !== undefined) {
    if (v === right) return "right";
    if (v === sel) return "wrong";
    return "dim";
  }
  return v === sel ? "sel" : "";
}

function MCQ({ item, resp, choose, checked }: { item: MCQItem; resp: any; choose: (v: any) => void; checked: EvalResult | null; order?: number[] }) {
  return (
    <>
      {item.options.map((o, i) => (
        <button key={i} disabled={!!checked} className={"opt " + optCls(i, resp, checked ? item.answer : null)} onClick={() => choose(i)}>
          <span className="k">{String.fromCharCode(65 + i)}</span>
          <span className="grow">
            {o}
            {checked && i !== item.answer && i !== resp && item.why?.[i] && <div className="why"><Md text={item.why[i]!} inline /></div>}
          </span>
        </button>
      ))}
    </>
  );
}

function JudgeRow({ label, val, set, right, dis }: { label: string; val: boolean | null; set: (v: boolean) => void; right?: boolean; dis: boolean }) {
  return (
    <div className="row between" style={{ margin: "10px 0" }}>
      <div className="small grow">{label}</div>
      {[true, false].map((v) => (
        <button key={String(v)} disabled={dis} className={"chip " + (right !== undefined ? (v === right ? "on" : val === v ? "" : "") : val === v ? "on" : "")}
          style={right !== undefined && val === v && v !== right ? { borderColor: "var(--red)", color: "var(--red)" } : right !== undefined && v === right ? { borderColor: "var(--green)", color: "var(--green)" } : {}}
          onClick={() => set(v)}>{v ? "Sí" : "No"}</button>
      ))}
    </div>
  );
}

function OrderView({ item, resp, setResp, dis, checked }: any) {
  const pool = useMemo(() => shuffle([...item.tokens, ...(item.extra || [])].map((t: string, i: number) => ({ t, i }))), [item.id]);
  const used = new Set(resp.map((r: any) => r.i));
  const set = (v: any[]) => setResp(v);
  // la respuesta se guarda como objetos {t,i}; evaluate compara textos
  return (
    <>
      {item.lead && <div className="ex-context"><b>A:</b> {item.lead}</div>}
      <div className="small muted">{tr2("Toca las piezas para formar la respuesta de B.", "Tap the pieces to build B's reply.")}</div>
      <div className="tokens" style={{ borderColor: checked ? (checked.correct ? "var(--green)" : "var(--red)") : undefined }}>
        <b style={{ alignSelf: "center" }}>B:</b>
        {item.fixed && <span className="token" style={{ opacity: 0.7, pointerEvents: "none" }}>{item.fixed}</span>}
        {resp.map((r: any, k: number) => (
          <span key={k} className="token" onClick={() => !dis && set(resp.filter((_: any, j: number) => j !== k))}>{r.t}</span>
        ))}
        {item.end && <span style={{ alignSelf: "center" }}>{item.end}</span>}
      </div>
      <div className="tokens" style={{ borderStyle: "solid" }}>
        {pool.map((p: any) => (
          <span key={p.i} className={"token " + (used.has(p.i) ? "used" : "")} onClick={() => !dis && set([...resp, p])}>{p.t}</span>
        ))}
      </div>
    </>
  );
}
const tr2 = (es: string, _en: string) => es;

function ProduceView({ item, resp, setResp, checked }: any) {
  const { tr } = useApp();
  const wc = words(resp.text || "").length;
  const must: string[] = item.mustUse || [];
  const low = (resp.text || "").toLowerCase();
  const used = must.filter((w) => low.includes(w.toLowerCase().split(" ")[0].slice(0, Math.max(4, w.length - 2))));
  const [stage, setStage] = useState<"write" | "check">("write");
  const checks: string[] = item.checklist || ["The response completes the task", "Grammar is accurate", "Vocabulary is precise and appropriate", "The register fits the context"];
  return (
    <>
      <div className="card flat tight"><Md text={item.task} /></div>
      {must.length > 0 && <div className="chips" style={{ margin: "6px 0" }}>{must.map((w) => <span key={w} className={"tag " + (used.includes(w) ? "green" : "gold")}>{w}</span>)}</div>}
      <textarea className="textarea" value={resp.text} disabled={stage === "check"} placeholder="Write here…" onChange={(e) => setResp({ ...resp, text: e.target.value })} spellCheck={false} />
      <div className="row between small muted"><span>{wc} {tr("palabras", "words")}{item.minWords ? ` / mín. ${item.minWords}` : ""}</span><span>{must.length ? `${used.length}/${must.length} ${tr("palabras obligatorias", "required words")}` : ""}</span></div>
      {stage === "write" && (
        <button className="btn block" style={{ marginTop: 8 }} disabled={wc < Math.max(5, (item.minWords || 10) * 0.5)} onClick={() => setStage("check")}>{tr("Terminé: autoevaluar", "Done: self-check")}</button>
      )}
      {stage === "check" && !checked && (
        <div className="card flat tight">
          <div className="small muted" style={{ marginBottom: 6 }}>{tr("Marca lo que tu texto realmente cumple (sé honesta, el búho lo verá):", "Tick what your text really does:")}</div>
          {checks.map((c, i) => (
            <label key={i} className="row" style={{ padding: "6px 0" }}>
              <input type="checkbox" checked={resp.checks.includes(i)} onChange={(e) => setResp({ ...resp, checks: e.target.checked ? [...resp.checks, i] : resp.checks.filter((x: number) => x !== i) })} />
              <span className="small">{c}</span>
            </label>
          ))}
          <button className="btn sm" onClick={() => {
            const selfScore = checks.length ? resp.checks.length / checks.length : 0.6;
            const mustScore = must.length ? used.length / must.length : 1;
            const lenScore = item.minWords ? Math.min(1, wc / item.minWords) : 1;
            setResp({ ...resp, score: Math.round((selfScore * 0.5 + mustScore * 0.3 + lenScore * 0.2) * 100) / 100 });
          }}>{tr("Calcular puntuación", "Score it")}</button>
        </div>
      )}
      {checked && item.model && (
        <div className="card flat tight"><div className="small gold">{tr("Respuesta modelo (una de muchas posibles)", "Model answer (one of many)")}</div><div className="serif"><Md text={item.model} /></div></div>
      )}
    </>
  );
}

function CTestView({ item, resp, setResp, checked }: any) {
  const parts = useMemo(() => parseCTest(item.text), [item.text]);
  return (
    <div className="passage" style={{ lineHeight: 2.1 }}>
      {parts.map((p: any, i: number) =>
        p.t === "text" ? <React.Fragment key={i}>{p.v}</React.Fragment> : (
          <span key={i} className="cword">
            {p.vis}
            <input value={resp[p.idx] || ""} disabled={!!checked} autoCapitalize="off" autoCorrect="off" spellCheck={false}
              className={checked ? (checked.detail?.[p.idx] ? "right" : "wrong") : ""}
              style={{ width: `${Math.max(2.2, p.miss.length * 0.68 + 0.8)}em` }}
              onChange={(e) => setResp({ ...resp, [p.idx]: e.target.value })} />
            {checked && !checked.detail?.[p.idx] && <sup className="tiny ok">{p.miss}</sup>}
          </span>
        )
      )}
    </div>
  );
}

function CorrectAnswer({ item }: { item: Item }) {
  const { tr } = useApp();
  let a: React.ReactNode = null;
  switch (item.kind) {
    case "mcq": a = <>{String.fromCharCode(65 + item.answer)}. {item.options[item.answer]}</>; break;
    case "tf": a = item.answer === "T" ? (item.mode === "YNNG" ? "YES" : "TRUE") : item.answer === "F" ? (item.mode === "YNNG" ? "NO" : "FALSE") : "NOT GIVEN"; break;
    case "gap": case "wf": case "kwt": a = item.answers.join(" / "); break;
    case "judge": a = `${item.grammatical ? "Gramatical" : "No gramatical"} · ${item.appropriate ? "apropiada" : "no apropiada"}`; break;
    case "order": a = (item.fixed ? item.fixed + " " : "") + item.tokens.join(" ") + (item.end || ""); break;
    case "spot": a = item.wrong === -1 ? tr("No hay error", "No error") : <>{String.fromCharCode(65 + item.wrong)}: “{item.segments[item.wrong]}” → <b>{item.fix}</b></>; break;
    default: return null;
  }
  return <div className="small" style={{ marginBottom: 6 }}><b>{tr("Respuesta:", "Answer:")}</b> {a}</div>;
}
