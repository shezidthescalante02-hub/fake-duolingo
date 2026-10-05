import React, { useEffect, useState } from "react";
import { useApp } from "../state";
import { Sheet, Md } from "./ui";
import { lookup, freqLabel, type DictEntry } from "../services/dictionary";
import { addWord } from "../engine/vocab";
import { VOCAB_SEED } from "../content/index";
import { speak } from "../services/tts";
import { db } from "../db/db";

export function seedFor(word: string) {
  const w = word.toLowerCase();
  return VOCAB_SEED.find((s) => s.w.toLowerCase() === w);
}

export function DictSheet() {
  const { dictWord, closeDict, lock, tr, toast, bump, settings } = useApp();
  const [entry, setEntry] = useState<DictEntry | null | undefined>(undefined);
  const [inVocab, setInVocab] = useState(false);
  const word = dictWord?.word || "";

  useEffect(() => {
    if (!dictWord) return;
    setEntry(undefined);
    (async () => {
      const id = word.toLowerCase();
      const e = await lookup(id);
      setEntry(e);
      const lemma = e?.word || id;
      setInVocab(!!(await db.get("vocab", lemma)));
    })();
  }, [dictWord]);

  if (!dictWord) return null;
  const seed = seedFor(entry?.word || word);

  const add = async () => {
    const target = entry?.word || word;
    const tags = dictWord.source?.startsWith("sim:") ? [dictWord.source.split(":")[1]] : [];
    await addWord(target, { ctx: dictWord.ctx, source: dictWord.source, seed, tags });
    bump("wordsAdded");
    setInVocab(true);
    toast(tr(`“${target}” agregada a tu vocabulario`, `“${target}” added`));
  };

  const locked = lock.dictionary;
  return (
    <Sheet open={!!dictWord} onClose={closeDict}>
      <div className="row between">
        <div>
          <div className="serif" style={{ fontSize: "1.6em", lineHeight: 1.1 }}>{entry?.word || word}</div>
          {entry?.lemmaOf && <div className="tiny muted">{tr("forma base de", "base form of")} “{entry.lemmaOf}”</div>}
        </div>
        <div className="row">
          {!locked && entry && <button className="iconbtn" aria-label="pronunciar" onClick={() => speak(entry.word, { accent: settings.accents[0] || "en-US" })}>🔊</button>}
          <button className="iconbtn" onClick={closeDict}>✕</button>
        </div>
      </div>

      {locked ? (
        <div className="card flat tight" style={{ marginTop: 10 }}>
          <div>🔒 {tr("El diccionario está bloqueado en esta actividad, como en el examen real.", "Dictionary locked here, like in the real exam.")}</div>
          <div className="small muted" style={{ marginTop: 6 }}>{tr("Puedes guardar la palabra para estudiarla después sin ver su significado.", "You can save it for later without seeing the meaning.")}</div>
        </div>
      ) : entry === undefined ? (
        <div className="muted" style={{ padding: 16 }}>…</div>
      ) : entry === null && !seed ? (
        <div className="card flat tight" style={{ marginTop: 10 }}>
          {tr("No encontré esta palabra en el diccionario offline. Puedes agregarla igualmente y completar la entrada después.", "Not found offline. You can still add it.")}
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          <div className="row wrap" style={{ gap: 6 }}>
            {(entry?.ipaGB || entry?.ipaUS || entry?.ipaCMU) && (
              <span className="tag">{entry?.ipaGB ? `GB /${entry.ipaGB}/` : ""}{entry?.ipaGB && (entry?.ipaUS || entry?.ipaCMU) ? " · " : ""}{entry?.ipaUS || entry?.ipaCMU ? `US /${entry?.ipaUS || entry?.ipaCMU}/` : ""}</span>
            )}
            {entry?.cefr && <span className="tag gold">CEFR ≈ {entry.cefr}</span>}
            {entry?.zipf !== undefined && <span className="tag">{tr("frecuencia", "frequency")}: {freqLabel(entry.zipf)} ({entry.zipf})</span>}
            {seed?.reg && <span className="tag blue">{seed.reg}</span>}
          </div>
          {seed && (
            <div className="card flat tight" style={{ marginTop: 10 }}>
              <div className="small gold">{seed.pos} · {tr("uso académico", "academic use")}</div>
              <div style={{ margin: "4px 0" }}>{seed.def}</div>
              <div className="ex">{seed.ex}</div>
              {seed.col && <div className="small"><b>Collocations:</b> {seed.col.join(" · ")}</div>}
              {seed.note && <div className="small" style={{ marginTop: 4 }}>💡 <Md text={seed.note} inline /></div>}
              {seed.err && <div className="small" style={{ marginTop: 4 }}>⚠️ <Md text={seed.err} inline /></div>}
            </div>
          )}
          {entry && entry.senses.slice(0, 5).map((s, i) => (
            <div key={i} style={{ margin: "10px 0" }}>
              <span className="tag">{s.pos}</span> <span>{s.def}</span>
              {s.ex.slice(0, 1).map((x, j) => <div key={j} className="small muted serif" style={{ marginLeft: 6 }}>“{x}”</div>)}
            </div>
          ))}
          {entry && entry.syn.length > 0 && <div className="small"><b>{tr("Sinónimos", "Synonyms")}:</b> {entry.syn.slice(0, 6).join(", ")}</div>}
          {entry && entry.ant.length > 0 && <div className="small"><b>{tr("Antónimos", "Antonyms")}:</b> {entry.ant.join(", ")}</div>}
          {entry && entry.fam.length > 0 && <div className="small"><b>{tr("Familia léxica", "Word family")}:</b> {entry.fam.join(", ")}</div>}
          {(seed?.es || entry?.es) && <details style={{ marginTop: 8 }}><summary className="small muted">{tr("Ver equivalente en español", "Spanish")}</summary><div className="small">{seed?.es || entry?.es?.slice(0, 5).join(", ")}</div></details>}
          {dictWord.ctx && <div className="small muted" style={{ marginTop: 8 }}>{tr("Contexto", "Context")}: <span className="serif">“{dictWord.ctx}”</span></div>}
        </div>
      )}
      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn primary grow" disabled={inVocab} onClick={add}>{inVocab ? "✓ " + tr("En tu vocabulario", "In your vocabulary") : "＋ Add to Vocabulary"}</button>
        {!locked && <a className="btn ghost" href={`#/dict?q=${encodeURIComponent(entry?.word || word)}`} onClick={closeDict}>{tr("Abrir", "Open")}</a>}
      </div>
      <div className="tiny muted" style={{ marginTop: 8 }}>{tr("Fuentes: Open English WordNet, CMU Pronouncing Dictionary, wordfreq, MCR. CEFR estimado por frecuencia (aproximado).", "Sources: OEWN, CMU, wordfreq, MCR. CEFR estimated from frequency.")}</div>
    </Sheet>
  );
}
