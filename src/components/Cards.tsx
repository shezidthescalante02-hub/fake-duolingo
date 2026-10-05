import React, { useEffect, useMemo, useState } from "react";
import { Icon, iconForTag } from "./Icon";
import type { Lesson } from "../content/types";
import { Md, Tap, OwlSays, shuffle } from "./ui";
import { useApp } from "../state";
import { db } from "../db/db";
import { review, vstate, type VocabEntry, inflections } from "../engine/vocab";
import { VOCAB_SEED } from "../content/index";
import { norm, lev } from "../engine/evaluate";
import { sfx } from "../services/sound";
import { speak } from "../services/tts";
import { tagState } from "../engine/model";

// ---------------------------------------------------------------- tarjeta de enseñanza
export function TeachCard({ lesson, onDone }: { lesson: Lesson; onDone: () => void }) {
  const { tr, model, refreshModel } = useApp();
  return (
    <div className="fadein">
      <div className="row" style={{ marginBottom: 6 }}>
        <span className="mini-ico" style={{ width: 44, height: 44 }}><Icon name={iconForTag(lesson.tag)} size={24} /></span>
        <div className="grow">
          <div className="tiny muted">{tr("Nuevo concepto", "New concept")} · {lesson.group || lesson.module}</div>
          <div className="serif" style={{ fontSize: "1.3em" }}>{lesson.title}</div>
        </div>
      </div>
      <div className="card hl"><Md text={lesson.summary} /></div>
      <div className="card"><Md text={lesson.body} /></div>
      {lesson.examples && lesson.examples.length > 0 && (
        <div className="card">
          <h3>{tr("Ejemplos", "Examples")}</h3>
          {lesson.examples.map((e, i) => (
            <div key={i} className={"ex " + (e.k || "good")}>
              <Tap text={e.t} />
              {e.note && <div className="tiny muted" style={{ fontFamily: "var(--sans)" }}>{e.note}</div>}
            </div>
          ))}
        </div>
      )}
      <div className="sticky-actions">
        <button className="btn primary block" onClick={() => { const s = tagState(model, lesson.tag); s.learned = true; if (!s.due) s.due = Date.now() + 86400000; refreshModel(); onDone(); }}>
          {tr("Entendido: comprobar", "Got it: check me")}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- tarjeta de vocabulario (reconocer / producir)
export function VocabCard({ word, mode, onDone }: { word: VocabEntry; mode: "recog" | "prod"; onDone: (ok: boolean) => void }) {
  const { tr, addXp, say, settings, bump } = useApp();
  const [choice, setChoice] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [flip, setFlip] = useState(false);

  const def = word.def || word.defs?.[0]?.def || "(sin definición — edítala en tu vocabulario)";
  const options = useMemo(() => {
    if (mode !== "recog") return [];
    const others = shuffle(VOCAB_SEED.filter((s) => s.w !== word.w && s.def !== def)).slice(0, 3).map((s) => s.def);
    return shuffle([def, ...others]);
  }, [word.id, mode]);

  const exampleBlank = useMemo(() => {
    const ex = word.ex || word.ctx || word.defs?.[0]?.ex?.[0] || "";
    if (!ex) return "";
    let out = ex;
    for (const f of inflections(word.id).sort((a, b) => b.length - a.length)) {
      const re = new RegExp(`\\b${f.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
      if (re.test(out)) { out = out.replace(re, "_____"); break; }
    }
    return out.includes("_____") ? out : "";
  }, [word.id]);

  const grade = async (g: 0 | 1 | 2 | 3) => {
    const before = vstate(word);
    const upd: VocabEntry = { ...word, [mode === "recog" ? "recog" : "prod"]: review(mode === "recog" ? word.recog : word.prod, g) } as any;
    await db.put("vocab", upd);
    const after = vstate(upd);
    if (after === "mastered" && before !== "mastered") { say("wordMastered"); bump("wordsMastered"); }
    addXp(g >= 2 ? 6 : 2, { reviews: 1 });
    onDone(g >= 2);
  };

  const checkRecog = (i: number) => {
    setChoice(i);
    const ok = options[i] === def;
    setResult(ok);
    ok ? sfx.correct() : sfx.wrong();
  };
  const checkProd = () => {
    const t = norm(typed);
    const forms = inflections(word.id);
    const ok = forms.includes(t);
    const close = !ok && forms.some((f) => lev(f, t) <= 1);
    setResult(ok);
    ok ? sfx.correct() : sfx.wrong();
    if (close) setTyped(typed + " ");
  };

  return (
    <div className="fadein">
      <div className="row between" style={{ marginBottom: 8 }}>
        <span className="tag gold">{mode === "recog" ? tr("Reconocer", "Recognise") : tr("Producir", "Produce")}</span>
        <span className="tag">{vstate(word)}</span>
      </div>
      {mode === "recog" ? (
        <>
          <div className="center" style={{ margin: "14px 0" }}>
            <div className="serif" style={{ fontSize: "2em" }}>{word.w}</div>
            <div className="small muted">{word.pos}{word.ipa ? ` · /${word.ipa}/` : ""} <button className="btn xs ghost" onClick={() => speak(word.w, { accent: settings.accents[0] })}><Icon name="speaker" size={16} /></button></div>
            {word.ctx && <div className="small serif muted" style={{ marginTop: 6 }}>“{word.ctx}”</div>}
          </div>
          {options.length >= 3 ? options.map((o, i) => (
            <button key={i} disabled={result !== null} className={"opt " + (result !== null ? (o === def ? "right" : choice === i ? "wrong" : "dim") : "")} onClick={() => checkRecog(i)}>
              <span className="k">{String.fromCharCode(65 + i)}</span><span>{o}</span>
            </button>
          )) : !flip ? (
            <button className="btn block" onClick={() => setFlip(true)}>{tr("Mostrar significado", "Show meaning")}</button>
          ) : (
            <div className="card flat"><div>{def}</div>{word.ex && <div className="ex">{word.ex}</div>}</div>
          )}
        </>
      ) : (
        <>
          <div className="card flat">
            <div className="small muted">{word.pos}</div>
            <div style={{ fontSize: "1.1em" }}>{def}</div>
            {exampleBlank && <div className="ex" style={{ marginTop: 8 }}>{exampleBlank}</div>}
            {word.col && word.col.length > 0 && result === null && <div className="tiny muted">{tr("Pista: colocación", "Hint: collocation")} — {word.col[0].replace(new RegExp(word.w, "i"), "___")}</div>}
          </div>
          <input className={"input " + (result === null ? "" : result ? "right" : "wrong")} placeholder={tr("Escribe la palabra…", "Type the word…")} value={typed} disabled={result !== null}
            onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => e.key === "Enter" && typed.trim() && checkProd()} autoCapitalize="off" autoCorrect="off" spellCheck={false} />
        </>
      )}
      {result !== null && (
        <div className={"feedback " + (result ? "good" : "badf")}>
          <h4>{result ? "✓ " + tr("Correcto", "Correct") : "✗ " + word.w}</h4>
          {!result && mode === "recog" && <div className="small">{def}</div>}
          {word.ex && <div className="ex">{word.ex}</div>}
          {word.col && word.col.length > 0 && <div className="small"><b>Collocations:</b> {word.col.join(" · ")}</div>}
          {word.note && <div className="small" style={{ marginTop: 4 }}><Icon name="bulb" size={16} /> <Md text={word.note} inline /></div>}
        </div>
      )}
      <div className="sticky-actions">
        {mode === "prod" && result === null && <button className="btn primary block" disabled={!typed.trim()} onClick={checkProd}>{tr("Comprobar", "Check")}</button>}
        {(result !== null || (flip && options.length < 3)) && (
          <div className="grid2" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <button className="btn sm danger" onClick={() => grade(0)}>{tr("Otra vez", "Again")}</button>
            <button className="btn sm" disabled={result === false} onClick={() => grade(1)}>{tr("Difícil", "Hard")}</button>
            <button className="btn sm" disabled={result === false} onClick={() => grade(2)}>{tr("Bien", "Good")}</button>
            <button className="btn sm gold" disabled={result === false} onClick={() => grade(3)}>{tr("Fácil", "Easy")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SessionOwl({ text, gloss, mood }: { text: string; gloss?: string; mood?: string }) {
  return <OwlSays text={text} gloss={gloss} mood={mood} />;
}
