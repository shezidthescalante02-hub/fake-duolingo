import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Item, MCQItem, Trap, MatchItem, SortItem, FixItem, DictationItem, StressItem, RecallItem, OddItem } from "../content/types";
import { TRAP_LABEL } from "../content/types";
import { evaluate, parseCTest, type EvalResult, type DictDiff } from "../engine/evaluate";
import { useApp } from "../state";
import { Md, OwlSays, Tap, Timer, useCountdown, shuffle } from "./ui";
import { Icon } from "./Icon";
import { sfx } from "../services/sound";
import { speak, stopSpeaking } from "../services/tts";
import { ProfessorSheet } from "./Professor";
import type { Attempt } from "../engine/model";
import { lvlLabel } from "../engine/cefr";
import { words } from "../engine/textAnalysis";
import type { OwlLine } from "../owl/messages";

export interface ItemResult { correct: boolean; score: number; attempt?: Attempt; timeMs: number; changes: number; firstCorrect?: boolean }

let correctRun = 0;
export function currentCombo() { return correctRun; }

const CAUSES: { id: string; es: string }[] = [
  { id: "didnt-know", es: "No lo sabía" },
  { id: "rushed", es: "Lo sabía, me precipité" },
  { id: "overthought", es: "Lo sobrepensé" },
  { id: "misread", es: "Leí mal la pregunta" },
  { id: "distracted", es: "Me distraje" },
];

const KIND_LABEL: Record<string, string> = {
  mcq: "Opción múltiple", tf: "True / False / Not Given", gap: "Completar", wf: "Word formation", kwt: "Key word transformation", judge: "¿Gramatical? ¿Apropiada?",
  order: "Build a sentence", spot: "Detectar el error", produce: "Producción", ctest: "Complete the Words", match: "Unir parejas", sort: "Clasificar",
  odd: "¿Cuál no encaja?", fix: "Encuentra y corrige", dictation: "Dictado", stress: "Acento de palabra", recall: "Recuerdo activo",
};

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
  context?: string;
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
  const [combo, setCombo] = useState(0);
  const t0 = useRef(Date.now());
  const timed = !!props.limitSec;
  const left = useCountdown(props.limitSec ?? null, timed && !checked, () => { setTimeUp(true); submit(true); });

  useEffect(() => {
    setResp(initialResp(item)); setHist([]); setChecked(null); setConf(undefined); setCause(undefined);
    setAskChange(false); setChangeReason(undefined); setOwlMsg(null); setTimeUp(false); t0.current = Date.now();
    // eslint-disable-next-line
  }, [item.id]);

  // las parejas se comprueban solas al completarse
  useEffect(() => { if (item.kind === "match" && resp?.done && !checked) submit(); /* eslint-disable-next-line */ }, [resp?.done]);

  const choose = (v: any) => {
    if (checked) return;
    sfx.tap();
    setResp(v);
    setHist((h) => (h.length && JSON.stringify(h[h.length - 1]) === JSON.stringify(v) ? h : [...h, v]));
  };

  const changes = Math.max(0, hist.length - 1);
  const firstCorrect = hist.length ? evaluate(item, hist[0]).correct : undefined;
  const answered = isAnswered(item, resp);

  function react(r: EvalResult, timeMs: number) {
    if (r.correct) { sfx.correct(); correctRun++; } else { sfx.wrong(); correctRun = 0; }
    setCombo(correctRun);
    let ev: any = r.correct ? (correctRun >= 5 && correctRun % 5 === 0 ? "correctStreak" : item.lvl >= 75 ? "correctHard" : "correct") : "wrong";
    if (!r.correct && firstCorrect && changes > 0) ev = "overthink";
    else if (r.correct && changes > 0 && firstCorrect === false) ev = "goodChange";
    else if (!r.correct && settings.sarcasm !== "off" && (item.basic || item.lvl < model.skills[item.skill].theta - 18)) ev = "wrongBasic";
    else if (!r.correct && timeMs < 4000 && item.kind === "mcq") ev = "rushed";
    if (r.correct && Math.random() < 0.6 && ev === "correct") setOwlMsg(null);
    else setOwlMsg(say(ev));
  }

  function submit(force = false) {
    if (checked) return;
    if (!force && !answered) return;
    if (!force && changes > 0 && !changeReason && feedback && (item.kind === "mcq" || item.kind === "tf")) { setAskChange(true); return; }
    const r = evaluate(item, resp);
    const timeMs = Date.now() - t0.current;
    if (!feedback) { finalize(r, timeMs, undefined); return; }
    setChecked(r);
    react(r, timeMs);
  }

  async function finalize(r: EvalResult, timeMs: number, selfTag?: string) {
    stopSpeaking();
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
      case "mcq": return <MCQ item={item} resp={resp} choose={choose} checked={checked} />;
      case "tf": {
        const opts = item.mode === "YNNG" ? [["T", "YES"], ["F", "NO"], ["NG", "NOT GIVEN"]] : [["T", "TRUE"], ["F", "FALSE"], ["NG", "NOT GIVEN"]];
        return (
          <>
            <div className="ex-context"><Tap text={item.statement} source="tf" /></div>
            <div className="opts">
              {opts.map(([v, l], i) => (
                <button key={v} disabled={dis} style={{ ["--i" as any]: i }} className={"opt " + optCls(v, resp, checked ? item.answer : null)} onClick={() => choose(v)}>
                  <span className="k">{v === "NG" ? "?" : v === "T" ? <Icon name="check" size={15} stroke={2.4} /> : <Icon name="x" size={15} stroke={2.4} />}</span><span>{l}</span>
                </button>
              ))}
            </div>
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
            <div className="center" style={{ margin: "6px 0" }}><span className="keyword">{item.key.toUpperCase()}</span></div>
            <div className="ex-context gold" style={{ whiteSpace: "normal" }}>
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
            <div className="ex-context spotline" style={{ whiteSpace: "normal" }}>
              {item.segments.map((s, i) => (
                <span key={i} onClick={() => !dis && choose({ idx: i })}
                  className={"seg" + (checked && i === item.wrong ? " right" : resp?.idx === i ? (checked ? " wrong" : " sel") : "")}>
                  <sup>{String.fromCharCode(65 + i)}</sup>{s}
                </span>
              ))}
            </div>
            <button className={"chip " + (resp?.idx === -1 ? "on" : "")} disabled={dis} onClick={() => choose({ idx: -1 })}>{tr("No hay error", "No error")}</button>
          </>
        );
      case "produce": return <ProduceView item={item} resp={resp} setResp={setResp} checked={checked} />;
      case "ctest": return <CTestView item={item} resp={resp} setResp={setResp} checked={checked} />;
      case "match": return <MatchView item={item} resp={resp} setResp={setResp} dis={dis} />;
      case "sort": return <SortView item={item} resp={resp} setResp={(v: any) => { sfx.tap(); setResp(v); }} checked={checked} />;
      case "odd": return <OddView item={item} resp={resp} choose={choose} checked={checked} />;
      case "fix": return <FixView item={item} resp={resp} setResp={setResp} checked={checked} submit={() => submit()} />;
      case "dictation": return <DictationView item={item} resp={resp} setResp={setResp} checked={checked} />;
      case "stress": return <StressView item={item} resp={resp} choose={choose} checked={checked} />;
      case "recall": return <RecallView item={item} resp={resp} setResp={setResp} checked={checked} submit={() => submit()} />;
    }
  })();

  const showCtx = item.ctx && item.kind !== "tf";
  const verdict = checked ? (checked.correct ? "good" : checked.score > 0 ? "neutral" : "badf") : "";
  return (
    <div className={"item-view kind-" + item.kind + (checked ? " is-checked " + verdict : "")}>
      <div className="item-meta">
        <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
          <span className="kind-label">{KIND_LABEL[item.kind]}</span>
          {props.showLevel !== false && <span className="tag">{lvlLabel(item.lvl)}</span>}
          {item.tests && feedback && checked && <span className="tag blue">{testsLabel(item.tests)}</span>}
          {timed && !checked && <Timer left={left} total={props.limitSec!} />}
        </div>
        <div className="row" style={{ gap: 6 }}>
          {lock.dictionary && <span className="lock"><Icon name="lock" size={13} /> {tr("diccionario", "dictionary")}</span>}
          {!props.hideProfessor && !lock.professor && feedback && (
            <button className="btn xs ghost" onClick={() => setProf(true)}><Icon name="teacher" size={15} /> Professor</button>
          )}
        </div>
      </div>
      {showCtx && <div className="ex-context"><Tap text={item.ctx!} /></div>}
      {item.prompt && <div className="ex-prompt"><Md text={item.prompt} inline /></div>}
      {item.audio && item.kind !== "dictation" && <AudioRow text={item.audio} accent={item.audioAccent} />}
      <div className="item-body">{body}</div>

      {feedback && settings.askConfidence && !checked && item.kind !== "produce" && item.kind !== "match" && (
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
            <button className="chip" onClick={() => { setChangeReason("evidence"); setAskChange(false); setTimeout(() => submitAfterReason(), 0); }}><Icon name="search" size={15} /> {tr("Encontré nueva evidencia", "I found new evidence")}</button>
            <button className="chip" onClick={() => { setChangeReason("doubt"); setAskChange(false); setTimeout(() => submitAfterReason(), 0); }}><Icon name="brain" size={15} /> {tr("Dudé / me pareció que también podía ser", "I just doubted")}</button>
          </div>
        </div>
      )}

      {checked && feedback && (
        <div className={"feedback " + verdict}>
          <div className="fb-head">
            <span className="fb-badge">{checked.correct ? <Icon name="check" size={20} stroke={2.6} /> : checked.score > 0 ? <Icon name="gauge" size={20} stroke={2.2} /> : <Icon name="x" size={20} stroke={2.6} />}</span>
            <h4>{checked.correct ? tr("Correcto", "Correct") : checked.score > 0 ? tr("Parcialmente correcto", "Partly correct") : tr("Incorrecto", "Incorrect")}{timeUp ? " · " + tr("tiempo agotado", "time's up") : ""}</h4>
            {checked.correct && combo >= 3 && <span className="combo" key={combo}>×{combo}</span>}
          </div>
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
              {firstCorrect && !checked.correct ? tr("Tu primera respuesta era correcta. Registrado como sobreanálisis.", "Your first answer was right. Logged as overthinking.") :
                !firstCorrect && checked.correct ? tr("Buen cambio: corregiste con evidencia.", "Good revision.") : ""}
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

      <div className={"sticky-actions" + (checked ? " " + verdict : "")}>
        {!checked ? (
          item.kind === "match" ? <div className="tiny muted center">{tr("Toca un elemento de cada columna para unirlos.", "Tap one item in each column to pair them.")}</div> :
          <button className="btn primary block" disabled={!answered && !timeUp} onClick={() => submit()}>
            {feedback ? tr("Comprobar", "Check") : tr("Siguiente", "Next")}
          </button>
        ) : (
          <div className="row">
            {props.onMore && <button className="btn ghost" onClick={() => props.onMore!("similar")} title={tr("Otro parecido", "Another one")}><Icon name="plus" /></button>}
            <button className="btn primary grow" onClick={cont}>{tr("Continuar", "Continue")} <Icon name="arrowRight" size={18} /></button>
          </div>
        )}
      </div>

      <ProfessorSheet open={prof} onClose={() => setProf(false)} item={item} resp={resp} checked={!!checked} context={props.context} onMore={props.onMore} />
    </div>
  );

  function submitAfterReason() {
    const r = evaluate(item, resp);
    setChecked(r);
    if (r.correct) { sfx.correct(); correctRun++; } else { sfx.wrong(); correctRun = 0; }
    setCombo(correctRun);
    const ev = !r.correct && firstCorrect ? "overthink" : r.correct && firstCorrect === false ? "goodChange" : r.correct ? "correct" : "wrong";
    setOwlMsg(say(ev as any));
  }
}

function testsLabel(t: string) {
  return ({ grammar: "Evalúa gramática", meaning: "Evalúa significado", both: "Gramática + significado", register: "Evalúa registro", collocation: "Evalúa colocación", form: "Evalúa forma" } as any)[t] || t;
}

function initialResp(item: Item): any {
  switch (item.kind) {
    case "mcq": case "tf": case "odd": case "stress": return null;
    case "gap": case "wf": case "kwt": case "dictation": case "recall": return "";
    case "judge": return { g: null, a: null };
    case "order": return [];
    case "spot": return null;
    case "produce": return { text: "", score: null, checks: [] };
    case "ctest": return {};
    case "match": return { errors: 0, done: false };
    case "sort": return [];
    case "fix": return { sel: null, found: false, text: "" };
  }
}

function isAnswered(item: Item, r: any): boolean {
  switch (item.kind) {
    case "mcq": case "tf": case "odd": case "stress": return r !== null && r !== undefined;
    case "gap": case "wf": case "kwt": case "recall": return !!(r && r.trim());
    case "dictation": return !!(r && r.trim().split(/\s+/).length >= 2);
    case "judge": return r.g !== null && r.a !== null;
    case "order": return r.length === item.tokens.length;
    case "spot": return r !== null;
    case "produce": return typeof r.score === "number";
    case "ctest": return Object.values(r || {}).some((v: any) => v && v.trim());
    case "match": return !!r?.done;
    case "sort": return item.entries.every((_, i) => typeof r?.[i] === "number");
    case "fix": return r?.sel !== null && !!(r?.text || "").trim();
  }
  return false;
}

function optCls(v: any, sel: any, right: any) {
  if (right !== null && right !== undefined) {
    if (v === right) return "right";
    if (v === sel) return "wrong";
    return "dim";
  }
  return v === sel ? "sel" : "";
}

function MCQ({ item, resp, choose, checked }: { item: MCQItem; resp: any; choose: (v: any) => void; checked: EvalResult | null }) {
  return (
    <div className="opts">
      {item.options.map((o, i) => (
        <button key={i} disabled={!!checked} style={{ ["--i" as any]: i }} className={"opt " + optCls(i, resp, checked ? item.answer : null)} onClick={() => choose(i)}>
          <span className="k">{String.fromCharCode(65 + i)}</span>
          <span className="grow">
            {o}
            {checked && i !== item.answer && i !== resp && item.why?.[i] && <div className="why"><Md text={item.why[i]!} inline /></div>}
          </span>
        </button>
      ))}
    </div>
  );
}

function OddView({ item, resp, choose, checked }: { item: OddItem; resp: any; choose: (v: any) => void; checked: EvalResult | null }) {
  return (
    <div className="odd-grid">
      {item.options.map((o, i) => (
        <button key={i} disabled={!!checked} style={{ ["--i" as any]: i }} className={"odd-tile " + optCls(i, resp, checked ? item.answer : null)} onClick={() => choose(i)}>{o}</button>
      ))}
    </div>
  );
}

function JudgeRow({ label, val, set, right, dis }: { label: string; val: boolean | null; set: (v: boolean) => void; right?: boolean; dis: boolean }) {
  return (
    <div className="judge-row">
      <div className="small grow">{label}</div>
      <div className="seg-toggle">
        {[true, false].map((v) => {
          const st = right !== undefined ? (v === right ? "right" : val === v ? "wrong" : "") : val === v ? "on" : "";
          return <button key={String(v)} disabled={dis} className={st} onClick={() => set(v)}>{v ? "Sí" : "No"}</button>;
        })}
      </div>
    </div>
  );
}

function OrderView({ item, resp, setResp, dis, checked }: any) {
  const pool = useMemo(() => shuffle([...item.tokens, ...(item.extra || [])].map((t: string, i: number) => ({ t, i }))), [item.id]);
  const used = new Set(resp.map((r: any) => r.i));
  const set = (v: any[]) => { sfx.tap(); setResp(v); };
  return (
    <>
      {item.lead && <div className="ex-context"><b>A:</b> {item.lead}</div>}
      <div className="small muted">Toca las piezas para formar la respuesta de B.</div>
      <div className={"tokens answer" + (checked ? (checked.correct ? " right" : " wrong") : "")}>
        <b style={{ alignSelf: "center" }}>B:</b>
        {item.fixed && <span className="token fixed">{item.fixed}</span>}
        {resp.map((r: any, k: number) => (
          <span key={r.i} className="token pop" onClick={() => !dis && set(resp.filter((_: any, j: number) => j !== k))}>{r.t}</span>
        ))}
        {item.end && <span style={{ alignSelf: "center" }}>{item.end}</span>}
      </div>
      <div className="tokens bank">
        {pool.map((p: any) => (
          <span key={p.i} className={"token " + (used.has(p.i) ? "used" : "")} onClick={() => !dis && !used.has(p.i) && set([...resp, p])}>{p.t}</span>
        ))}
      </div>
    </>
  );
}

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

// ---------------------------------------------------------------- unir parejas (estilo Duolingo, con feedback inmediato)
function MatchView({ item, resp, setResp, dis }: { item: MatchItem; resp: any; setResp: (v: any) => void; dis: boolean }) {
  const left = useMemo(() => shuffle(item.pairs.map((p, i) => ({ t: p[0], i }))), [item.id]);
  const right = useMemo(() => shuffle(item.pairs.map((p, i) => ({ t: p[1], i }))), [item.id]);
  const [sl, setSl] = useState<number | null>(null);
  const [sr, setSr] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [bad, setBad] = useState<[number, number] | null>(null);
  const [good, setGood] = useState<number | null>(null);
  const errors = useRef(0);
  useEffect(() => { setSl(null); setSr(null); setDone(new Set()); setBad(null); errors.current = 0; }, [item.id]);

  const attempt = (l: number | null, r: number | null) => {
    if (l === null || r === null) return;
    if (l === r) {
      const nd = new Set(done); nd.add(l); setDone(nd); setGood(l); sfx.xp();
      setTimeout(() => setGood(null), 450);
      setSl(null); setSr(null);
      if (nd.size === item.pairs.length) setTimeout(() => setResp({ errors: errors.current, done: true }), 380);
    } else {
      errors.current++; setBad([l, r]); sfx.wrong();
      setTimeout(() => { setBad(null); setSl(null); setSr(null); }, 520);
    }
  };
  const tapL = (i: number) => { if (dis || done.has(i) || bad) return; sfx.tap(); setSl(i); attempt(i, sr); };
  const tapR = (i: number) => { if (dis || done.has(i) || bad) return; sfx.tap(); setSr(i); attempt(sl, i); };
  const cls = (side: "l" | "r", i: number) => {
    if (done.has(i)) return good === i ? "m-tile matched flash" : "m-tile matched";
    if (bad && (side === "l" ? bad[0] : bad[1]) === i) return "m-tile bad";
    if ((side === "l" ? sl : sr) === i) return "m-tile sel";
    return "m-tile";
  };
  return (
    <div className="match">
      {item.heads && <div className="match-heads"><span>{item.heads[0]}</span><span>{item.heads[1]}</span></div>}
      <div className="match-cols">
        <div className="col">{left.map((x, k) => <button key={x.i} style={{ ["--i" as any]: k }} className={cls("l", x.i)} onClick={() => tapL(x.i)}>{x.t}</button>)}</div>
        <div className="col">{right.map((x, k) => <button key={x.i} style={{ ["--i" as any]: k + 0.5 }} className={cls("r", x.i)} onClick={() => tapR(x.i)}>{x.t}</button>)}</div>
      </div>
      <div className="match-progress">{Array.from({ length: item.pairs.length }, (_, i) => <i key={i} className={i < done.size ? "on" : ""} />)}</div>
      {resp?.done && errors.current > 0 && <div className="tiny muted center">{errors.current} {errors.current === 1 ? "intento fallido" : "intentos fallidos"}</div>}
    </div>
  );
}

// ---------------------------------------------------------------- clasificar
function SortView({ item, resp, setResp, checked }: { item: SortItem; resp: any[]; setResp: (v: any) => void; checked: EvalResult | null }) {
  const order = useMemo(() => shuffle(item.entries.map((_, i) => i)), [item.id]);
  const next = order.find((i) => typeof resp[i] !== "number");
  const [fly, setFly] = useState<{ idx: number; cat: number } | null>(null);
  const put = (cat: number) => {
    if (next === undefined || checked || fly) return;
    setFly({ idx: next, cat });
    setTimeout(() => { const r = [...resp]; r[next] = cat; setResp(r); setFly(null); }, 260);
  };
  const unput = (i: number) => { if (checked) return; const r = [...resp]; r[i] = undefined; setResp(r); };
  const placed = item.entries.filter((_, i) => typeof resp[i] === "number").length;
  return (
    <div className="sort">
      {!checked && (
        <div className="sort-stage">
          {next !== undefined ? (
            <div key={next} className={"sort-card" + (fly ? ` fly-${fly.cat}-of-${item.cats.length}` : "")}>{item.entries[next][0]}</div>
          ) : <div className="sort-card done"><Icon name="check" size={22} /> Todo clasificado</div>}
          <div className="tiny muted center">{placed}/{item.entries.length}</div>
        </div>
      )}
      <div className={"sort-buckets n" + item.cats.length}>
        {item.cats.map((c, ci) => (
          <div key={ci} className="bucket">
            <button className="bucket-head" disabled={!!checked || next === undefined} onClick={() => put(ci)}>{c}</button>
            <div className="bucket-items">
              {item.entries.map(([t, right], i) => resp[i] === ci ? (
                <span key={i} className={"chip pop " + (checked ? (right === ci ? "ok-chip" : "bad-chip") : "")} onClick={() => unput(i)}>
                  {t}{checked && right !== ci && <small> → {item.cats[right]}</small>}
                </span>
              ) : null)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- encontrar y corregir
function fixSpan(item: FixItem) {
  const toks = item.sentence.split(" ");
  const clean = (s: string) => s.replace(/[.,;:!?]+$/g, "").toLowerCase();
  const target = item.wrong.split(" ").map(clean);
  for (let i = 0; i + target.length <= toks.length; i++) {
    if (target.every((t, k) => clean(toks[i + k]) === t)) return { toks, start: i, end: i + target.length - 1 };
  }
  return { toks, start: -1, end: -1 };
}
function FixView({ item, resp, setResp, checked, submit }: { item: FixItem; resp: any; setResp: (v: any) => void; checked: EvalResult | null; submit: () => void }) {
  const { toks, start, end } = useMemo(() => fixSpan(item), [item.id]);
  const inSpan = (i: number) => i >= start && i <= end;
  const tap = (i: number) => {
    if (checked) return;
    sfx.tap();
    const found = inSpan(i);
    const keep = resp.sel !== null && ((found && inSpan(resp.sel)) || resp.sel === i);
    setResp({ ...resp, sel: i, found, text: keep ? resp.text : "" });
  };
  const selText = resp.sel === null ? "" : resp.found ? item.wrong : toks[resp.sel].replace(/[.,;:!?]+$/g, "");
  return (
    <div className="fix">
      <div className="ex-context fixline">
        {toks.map((t, i) => {
          const isSel = resp.sel !== null && (resp.found ? inSpan(i) : resp.sel === i);
          const c = checked ? (inSpan(i) ? " err" : isSel ? " miss" : "") : isSel ? " sel" : "";
          return <React.Fragment key={i}><span className={"ftok" + c} onClick={() => tap(i)}>{t}</span>{" "}</React.Fragment>;
        })}
      </div>
      {resp.sel !== null && (
        <div className="fix-input pop">
          <div className="tiny muted">Corrige <b className="strike">{selText}</b> →</div>
          <input className={"input" + (checked ? (checked.correct ? " right" : " wrong") : "")} autoFocus value={resp.text} disabled={!!checked} autoCapitalize="off" autoCorrect="off" spellCheck={false}
            placeholder="corrección" onChange={(e) => setResp({ ...resp, text: e.target.value })} onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
      )}
      {resp.sel === null && <div className="tiny muted">Toca la palabra (o una de las palabras) donde está el error.</div>}
    </div>
  );
}

function AudioRow({ text, accent }: { text: string; accent?: string }) {
  const [on, setOn] = useState<null | "n" | "s">(null);
  const play = async (rate: number, k: "n" | "s") => {
    if (on) { stopSpeaking(); setOn(null); return; }
    setOn(k); try { await speak(text, { accent: accent || "en-US", rate }); } catch {} setOn(null);
  };
  useEffect(() => () => { stopSpeaking(); }, []);
  return (
    <div className="play-row">
      <button className={"playbtn" + (on === "n" ? " on" : "")} onClick={() => play(1, "n")} aria-label="Escuchar"><Icon name={on === "n" ? "stop" : "speaker"} size={28} /></button>
      <button className={"playbtn small" + (on === "s" ? " on" : "")} onClick={() => play(0.7, "s")} aria-label="Lento"><Icon name="turtle" size={20} /></button>
      <span className="tiny muted">Escucha (puedes repetir)</span>
    </div>
  );
}

// ---------------------------------------------------------------- dictado
function DictationView({ item, resp, setResp, checked }: { item: DictationItem; resp: string; setResp: (v: any) => void; checked: EvalResult | null }) {
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState<null | "n" | "s">(null);
  const play = async (rate: number, k: "n" | "s") => {
    if (playing) { stopSpeaking(); setPlaying(null); return; }
    setPlaying(k); setPlays((p) => p + 1);
    try { await speak(item.text, { accent: item.accent, rate }); } catch {}
    setPlaying(null);
  };
  useEffect(() => () => { stopSpeaking(); }, []);
  const d: DictDiff | undefined = checked?.detail;
  return (
    <div className="dictation">
      <div className="play-row">
        <button className={"playbtn" + (playing === "n" ? " on" : "")} onClick={() => play(1, "n")}><Icon name={playing === "n" ? "stop" : "speaker"} size={30} /></button>
        <button className={"playbtn small" + (playing === "s" ? " on" : "")} onClick={() => play(0.7, "s")} title="Lento"><Icon name="turtle" size={22} /></button>
        <div className="tiny muted">{item.accent} · {plays} {plays === 1 ? "reproducción" : "reproducciones"}</div>
      </div>
      <textarea className="textarea short" value={resp} disabled={!!checked} placeholder="Type what you hear…" spellCheck={false} autoCapitalize="sentences" autoCorrect="off" onChange={(e) => setResp(e.target.value)} />
      {d && (
        <div className="diff">
          {d.ops.map((o, i) => (
            <span key={i} className={"dw " + o.st}>{o.st === "sub" ? <><s>{o.got}</s> {o.t}</> : o.t}</span>
          ))}
          <div className="tiny muted" style={{ marginTop: 6 }}>{Math.round(d.acc * 100)}% de exactitud · <span className="dw miss">omitida</span> <span className="dw sub">cambiada</span> <span className="dw extra">sobrante</span></div>
          <div className="serif small" style={{ marginTop: 6 }}>{item.text}</div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- acento de palabra
function StressView({ item, resp, choose, checked }: { item: StressItem; resp: any; choose: (v: any) => void; checked: EvalResult | null }) {
  const word = item.word.replace(/\s*\(.*\)/, "");
  const pos = item.word.match(/\((.*)\)/)?.[1];
  return (
    <div className="stress">
      <div className="stress-word serif">{word}{pos && <span className="tiny muted"> ({pos})</span>}</div>
      <div className="stress-dots">
        {Array.from({ length: item.syl }, (_, i) => {
          const st = checked ? (i === item.answer ? " right" : i === resp ? " wrong" : "") : i === resp ? " sel" : "";
          return (
            <button key={i} disabled={!!checked} className={"sdot" + st} onClick={() => choose(i)} style={{ ["--i" as any]: i }}>
              <i /><span>{i + 1}</span>
            </button>
          );
        })}
      </div>
      <div className="tiny muted center">{item.syl} sílabas · toca la tónica</div>
      {checked && (
        <div className="stress-ipa pop">
          <span className="ipa">/{item.ipa}/</span>{item.ipaGB && item.ipaGB !== item.ipa && <span className="ipa muted"> · GB /{item.ipaGB}/</span>}
          <button className="btn xs ghost" onClick={() => speak(word, { accent: "en-US", rate: 0.85 })}><Icon name="speaker" size={15} /> US</button>
          <button className="btn xs ghost" onClick={() => speak(word, { accent: "en-GB", rate: 0.85 })}><Icon name="speaker" size={15} /> GB</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- recuerdo activo
function RecallView({ item, resp, setResp, checked, submit }: { item: RecallItem; resp: string; setResp: (v: any) => void; checked: EvalResult | null; submit: () => void }) {
  const [a, b] = item.text.split("___");
  return (
    <>
      {item.def && <div className="def-hint"><Icon name="bulb" size={16} /> <span>{item.def}</span></div>}
      <div className="ex-context" style={{ whiteSpace: "normal" }}>
        {a}
        <input className={"gapinput " + (checked ? (checked.correct ? "right" : "wrong") : "")} value={resp} disabled={!!checked} placeholder={item.word[0] + "…".padEnd(Math.min(10, item.word.length), "·")}
          autoCapitalize="off" autoCorrect="off" spellCheck={false} onChange={(e) => setResp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {b}
      </div>
    </>
  );
}

function CorrectAnswer({ item }: { item: Item }) {
  const { tr } = useApp();
  let a: React.ReactNode = null;
  switch (item.kind) {
    case "mcq": case "odd": a = <>{String.fromCharCode(65 + item.answer)}. {item.options[item.answer]}</>; break;
    case "tf": a = item.answer === "T" ? (item.mode === "YNNG" ? "YES" : "TRUE") : item.answer === "F" ? (item.mode === "YNNG" ? "NO" : "FALSE") : "NOT GIVEN"; break;
    case "gap": case "wf": case "kwt": case "recall": a = item.answers.join(" / "); break;
    case "judge": a = `${item.grammatical ? "Gramatical" : "No gramatical"} · ${item.appropriate ? "apropiada" : "no apropiada"}`; break;
    case "order": a = (item.fixed ? item.fixed + " " : "") + item.tokens.join(" ") + (item.end || ""); break;
    case "spot": a = item.wrong === -1 ? tr("No hay error", "No error") : <>{String.fromCharCode(65 + item.wrong)}: “{item.segments[item.wrong]}” → <b>{item.fix}</b></>; break;
    case "fix": a = <>“{item.wrong}” → <b>{item.answers[0]}</b>{item.answers.length > 1 ? <span className="muted"> (también: {item.answers.slice(1).join(", ")})</span> : null}</>; break;
    case "stress": a = <>{["1.ª", "2.ª", "3.ª", "4.ª", "5.ª"][item.answer]} sílaba</>; break;
    default: return null;
  }
  return <div className="small" style={{ marginBottom: 6 }}><b>{tr("Respuesta:", "Answer:")}</b> {a}</div>;
}

