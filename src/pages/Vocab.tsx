import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { useApp } from "../state";
import { Topbar, go, Empty, Md, OwlSays } from "../components/ui";
import { db } from "../db/db";
import { VSTATES, vstate, isDue, addWord, shouldProbablyKnow, type VocabEntry } from "../engine/vocab";
import { overall } from "../engine/model";
import { VocabCard } from "../components/Cards";
import { VOCAB_SEED } from "../content/index";
import { speak } from "../services/tts";
import { freqLabel } from "../services/dictionary";

const CATS: { id: string; name: string; test: (v: VocabEntry) => boolean }[] = [
  { id: "should", name: "Words I should probably know", test: () => false },
  { id: "academic", name: "Academic English", test: (v) => v.tags.includes("academic") },
  { id: "toefl", name: "TOEFL", test: (v) => v.tags.includes("toefl") },
  { id: "cambridge", name: "Cambridge", test: (v) => v.tags.includes("cae") || v.tags.includes("cpe") || v.tags.includes("cambridge") },
  { id: "ielts", name: "IELTS", test: (v) => v.tags.includes("ielts") },
  { id: "linguistics", name: "Linguistics", test: (v) => v.tags.includes("linguistics") },
  { id: "phonetics", name: "Phonetics", test: (v) => v.tags.includes("phonetics") },
  { id: "phonology", name: "Phonology", test: (v) => v.tags.includes("phonology") },
  { id: "morphology", name: "Morphology", test: (v) => v.tags.includes("morphology") },
  { id: "syntax", name: "Syntax", test: (v) => v.tags.includes("syntax") },
  { id: "semantics", name: "Semantics", test: (v) => v.tags.includes("semantics") },
  { id: "pragmatics", name: "Pragmatics", test: (v) => v.tags.includes("pragmatics") },
  { id: "corpus", name: "Corpus linguistics", test: (v) => v.tags.includes("corpus") },
  { id: "science", name: "Science", test: (v) => v.tags.includes("science") },
  { id: "social", name: "Social sciences", test: (v) => v.tags.includes("social") },
  { id: "humanities", name: "Humanities", test: (v) => v.tags.includes("humanities") },
  { id: "university", name: "University life", test: (v) => v.tags.includes("university") },
  { id: "everyday", name: "Everyday English", test: (v) => v.tags.includes("everyday") },
  { id: "phrasal", name: "Phrasal verbs", test: (v) => v.tags.includes("phrasal") || v.pos === "phrasal verb" },
  { id: "idiom", name: "Idioms", test: (v) => v.tags.includes("idiom") || v.pos === "idiom" },
  { id: "colloc", name: "Collocations", test: (v) => (v.col?.length || 0) > 0 },
  { id: "family", name: "Word families", test: (v) => (v.fam?.length || 0) > 0 },
  { id: "affix", name: "Prefixes & suffixes", test: (v) => !!v.pre || /^(un|in|im|ir|il|dis|mis|over|under|re|pre|post|anti|inter|trans)[a-z]{3,}/.test(v.id) || /(tion|ment|ity|ness|ise|ize|able|ible|ous|ive|al)$/.test(v.id) },
  { id: "false", name: "False friends", test: (v) => v.tags.includes("false-friend") },
  { id: "general", name: "General vocabulary", test: (v) => v.tags.includes("general") || v.tags.length === 0 },
];

export function VocabPage() {
  const { tr, model, bump } = useApp();
  const [all, setAll] = useState<VocabEntry[]>([]);
  const [cat, setCat] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [q, setQ] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [tab, setTab] = useState<"mine" | "library">("mine");
  const load = () => db.all<VocabEntry>("vocab").then(setAll);
  useEffect(() => { load(); }, []);
  const lvl = overall(model);

  const list = useMemo(() => {
    let l = all.filter((v) => showArchived ? v.archived : !v.archived);
    if (cat === "should") l = l.filter((v) => shouldProbablyKnow(v, lvl));
    else if (cat) l = l.filter(CATS.find((c) => c.id === cat)!.test);
    if (state) l = l.filter((v) => vstate(v) === state);
    if (q) l = l.filter((v) => v.id.includes(q.toLowerCase()) || (v.def || "").toLowerCase().includes(q.toLowerCase()));
    return l.sort((a, b) => b.addedAt - a.addedAt);
  }, [all, cat, state, q, showArchived]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const v of all.filter((x) => !x.archived)) { const s = vstate(v); c[s] = (c[s] || 0) + 1; }
    return c;
  }, [all]);
  const due = all.filter((v) => !v.archived && (isDue(v.recog) || (["recognized", "familiar", "active", "mastered"].includes(vstate(v)) && isDue(v.prod)))).length;

  const library = useMemo(() => {
    const mine = new Set(all.map((v) => v.id));
    let l = VOCAB_SEED.filter((s) => !mine.has(s.w.toLowerCase()));
    if (cat && cat !== "should") { const t = CATS.find((c) => c.id === cat)!; l = l.filter((s) => t.test({ ...s, id: s.w.toLowerCase(), tags: s.tags } as any)); }
    if (q) l = l.filter((s) => s.w.includes(q.toLowerCase()) || s.def.includes(q.toLowerCase()));
    return l;
  }, [all, cat, q]);

  return (
    <div>
      <Topbar title={tr("Mi vocabulario", "My vocabulary")} right={<button className="iconbtn" onClick={() => go("#/dict")}><Icon name="search" size={16} /></button>} />
      <div className="grid3" style={{ marginBottom: 8 }}>
        <div className="stat"><div className="v">{all.filter((v) => !v.archived).length}</div><div className="l">{tr("activas", "active")}</div></div>
        <div className="stat"><div className="v">{(counts.active || 0) + (counts.mastered || 0)}</div><div className="l">{tr("uso activo", "active use")}</div></div>
        <div className="stat"><div className="v">{due}</div><div className="l">{tr("para repasar", "due")}</div></div>
      </div>
      {due > 0 && <button className="btn primary block" onClick={() => go("#/vocab/review")}><Icon name="repeat" size={16} /> {tr("Repasar ahora", "Review now")} ({due})</button>}
      <div className="chips" style={{ margin: "12px 0 6px" }}>
        <button className={"chip " + (tab === "mine" ? "on" : "")} onClick={() => setTab("mine")}>{tr("Mis palabras", "My words")}</button>
        <button className={"chip " + (tab === "library" ? "on" : "")} onClick={() => setTab("library")}><Icon name="cards" size={16} /> {tr("Biblioteca curada", "Curated library")} ({VOCAB_SEED.length})</button>
      </div>
      <input className="input" placeholder={tr("Buscar…", "Search…")} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="chips scroll" style={{ marginTop: 8 }}>
        <button className={"chip " + (!cat ? "on" : "")} onClick={() => setCat("")}>{tr("Todas", "All")}</button>
        {CATS.map((c) => <button key={c.id} className={"chip " + (cat === c.id ? "on" : "") + (c.id === "should" ? " gold" : "")} onClick={() => setCat(cat === c.id ? "" : c.id)}>{c.name}</button>)}
      </div>
      {tab === "mine" && (
        <>
          <div className="chips scroll" style={{ marginTop: 6 }}>
            {VSTATES.map((s) => <button key={s.id} className={"chip " + (state === s.id ? "on" : "")} onClick={() => setState(state === s.id ? "" : s.id)}>{s.name} {counts[s.id] ? `(${counts[s.id]})` : ""}</button>)}
            <button className={"chip " + (showArchived ? "on" : "")} onClick={() => setShowArchived(!showArchived)}><Icon name="archive" size={16} /> {tr("Retiradas", "Retired")}</button>
          </div>
          {list.length === 0 ? (
            <Empty>{all.length === 0 ? tr("Aún no tienes palabras. Toca cualquier palabra en un texto y pulsa “Add to Vocabulary”, o agrega desde la biblioteca curada.", "No words yet.") : tr("Nada con estos filtros.", "Nothing here.")}</Empty>
          ) : list.map((v) => (
            <button key={v.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/vocab/word/${encodeURIComponent(v.id)}`)}>
              <div className="grow">
                <div className="row between"><span className="serif" style={{ fontSize: "1.1em" }}>{v.w}</span><span className="tag">{vstate(v)}</span></div>
                <div className="small muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.pos ? v.pos + " · " : ""}{v.def}</div>
                {shouldProbablyKnow(v, lvl) && <span className="tag gold"><Icon name="star" size={16} /> should know</span>}
              </div>
            </button>
          ))}
        </>
      )}
      {tab === "library" && library.map((s) => (
        <div key={s.w} className="unit">
          <div className="grow">
            <div className="serif">{s.w} <span className="tiny muted">{s.pos} · {s.lvl || ""}</span></div>
            <div className="small muted">{s.def}</div>
          </div>
          <button className="btn sm" onClick={async () => { await addWord(s.w, { seed: s, source: "library" }); bump("wordsAdded"); load(); }}>＋</button>
        </div>
      ))}
    </div>
  );
}

export function WordPage({ id }: { id: string }) {
  const { tr, settings, toast } = useApp();
  const [v, setV] = useState<VocabEntry | null>(null);
  const [edit, setEdit] = useState(false);
  useEffect(() => { db.get<VocabEntry>("vocab", id).then((x) => setV(x || null)); }, [id]);
  if (!v) return <div><Topbar title="…" back /><Empty>{tr("No encontrada", "Not found")}</Empty></div>;
  const save = async (n: VocabEntry) => { await db.put("vocab", n); setV(n); };
  const F = ({ k, label, multi }: { k: keyof VocabEntry; label: string; multi?: boolean }) => {
    const val = v[k] as any;
    if (!edit && (val === undefined || val === "" || (Array.isArray(val) && !val.length))) return null;
    return (
      <div style={{ margin: "8px 0" }}>
        <div className="tiny muted">{label}</div>
        {edit ? (
          multi ? <input className="input" defaultValue={Array.isArray(val) ? val.join("; ") : val || ""} onBlur={(e) => save({ ...v, [k]: e.target.value.split(";").map((x) => x.trim()).filter(Boolean) } as any)} />
            : <input className="input" defaultValue={val || ""} onBlur={(e) => save({ ...v, [k]: e.target.value } as any)} />
        ) : Array.isArray(val) ? <div className="small">{val.join(" · ")}</div> : <div className="small"><Md text={String(val)} inline /></div>}
      </div>
    );
  };
  return (
    <div>
      <Topbar title={v.w} back="#/vocab" right={<button className="iconbtn" onClick={() => setEdit(!edit)}><Icon name={edit ? "check" : "edit"} size={19} /></button>} />
      <div className="card">
        <div className="row between">
          <div>
            <div className="serif" style={{ fontSize: "2em" }}>{v.w}</div>
            <div className="small muted">{v.pos}{v.ipa ? ` · /${v.ipa}/` : ""}{v.ipaUS && v.ipaUS !== v.ipa ? ` · US /${v.ipaUS}/` : ""}</div>
          </div>
          <button className="iconbtn" onClick={() => speak(v.w, { accent: settings.accents[0] })}><Icon name="speaker" size={16} /></button>
        </div>
        <div className="chips" style={{ marginTop: 8 }}>
          <span className="tag gold">{vstate(v)}</span>
          {v.lvl && <span className="tag">CEFR ≈ {v.lvl}</span>}
          {v.zipf !== undefined && <span className="tag">{tr("frecuencia", "freq")}: {freqLabel(v.zipf)}</span>}
          {v.reg && <span className="tag blue">{v.reg}</span>}
          {v.tags.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
      <div className="card">
        <F k="def" label={tr("Significado", "Meaning")} />
        {v.defs && v.defs.length > 1 && !edit && (
          <div style={{ margin: "8px 0" }}><div className="tiny muted">{tr("Otros sentidos", "Other senses")}</div>{v.defs.slice(1).map((d, i) => <div key={i} className="small">• <i>{d.pos}</i> {d.def}</div>)}</div>
        )}
        <F k="ex" label={tr("Ejemplo académico", "Academic example")} />
        <F k="ex2" label={tr("Ejemplo general", "General example")} />
        <F k="ctx" label={tr("Contexto donde la encontraste", "Where you found it")} />
        <F k="col" label="Collocations" multi />
        <F k="syn" label={tr("Sinónimos", "Synonyms")} multi />
        <F k="ant" label={tr("Antónimos", "Antonyms")} multi />
        <F k="fam" label={tr("Familia léxica", "Word family")} multi />
        <F k="pre" label={tr("Prefijos / sufijos", "Affixes")} />
        <F k="note" label={tr("Diferencias con palabras similares", "Confusables")} />
        <F k="err" label={tr("Errores frecuentes", "Common errors")} />
        <F k="es" label={tr("Español (apoyo)", "Spanish")} />
        <F k="tags" label="Tags" multi />
      </div>
      <div className="card small muted">
        {tr("Reconocimiento", "Recognition")}: {v.recog.reps} {tr("aciertos seguidos", "reps")}, {tr("próximo", "next")} {new Date(v.recog.due).toLocaleDateString()} · {tr("Producción", "Production")}: {v.prod.reps}, {tr("próximo", "next")} {new Date(v.prod.due).toLocaleDateString()} · {tr("usos en producción libre", "free uses")}: {v.uses}
      </div>
      <div className="row">
        {v.archived ? (
          <button className="btn grow" onClick={() => { save({ ...v, archived: false }); toast(tr("Recuperada a tu lista activa", "Restored")); }}>↩ {tr("Recuperar", "Restore")}</button>
        ) : (
          <button className="btn grow" onClick={() => { save({ ...v, archived: true }); toast(tr("Retirada (no borrada). Puedes recuperarla en “Retiradas”.", "Retired (not deleted).")); }}><Icon name="archive" size={16} /> {tr("Retirar de la lista activa", "Retire")}</button>
        )}
      </div>
    </div>
  );
}

export function VocabReview() {
  const { tr } = useApp();
  const [queue, setQueue] = useState<{ v: VocabEntry; mode: "recog" | "prod" }[] | null>(null);
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(0);
  useEffect(() => {
    db.all<VocabEntry>("vocab").then((all) => {
      const act = all.filter((v) => !v.archived);
      const q: { v: VocabEntry; mode: "recog" | "prod" }[] = [];
      for (const v of act) {
        if (["recognized", "familiar", "active", "mastered"].includes(vstate(v)) && isDue(v.prod)) q.push({ v, mode: "prod" });
        else if (isDue(v.recog)) q.push({ v, mode: "recog" });
      }
      setQueue(q.sort(() => Math.random() - 0.5).slice(0, 40));
    });
  }, []);
  if (!queue) return null;
  const cur = queue[i];
  return (
    <div>
      <Topbar title={tr("Repaso de vocabulario", "Vocabulary review")} back="#/vocab" right={<span className="tag">{Math.min(i + 1, queue.length)}/{queue.length}</span>} />
      {!cur ? (
        <div>
          <OwlSays text={queue.length ? `Review done: ${ok}/${queue.length}. Your hippocampus thanks you. Probably.` : "Nothing due. Go and find new words — tap any word in a reading."} mood="proud" />
          <button className="btn primary block" onClick={() => go("#/vocab")}>{tr("Volver", "Back")}</button>
        </div>
      ) : (
        <div className="card"><VocabCard key={cur.v.id + cur.mode + i} word={cur.v} mode={cur.mode} onDone={(g) => { if (g) setOk(ok + 1); setI(i + 1); }} /></div>
      )}
    </div>
  );
}
