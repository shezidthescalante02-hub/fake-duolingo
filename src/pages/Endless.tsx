// Práctica infinita: nunca se acaba. Ejercicios generados a partir de datos reales de la app.
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../state";
import { Topbar, go, Bar, fmtTime, OwlSays, Owl } from "../components/ui";
import { Icon } from "../components/Icon";
import { ItemView } from "../components/ItemView";
import { GEN_MODES, generate, generateMixed, type GenMode } from "../engine/generator";
import { VARIETY_ITEMS } from "../content/variety";
import type { Item } from "../content/types";
import { shuffle } from "../components/ui";
import { stopSpeaking } from "../services/tts";

const ICONS: Record<string, string> = { vocab: "cards", personal: "user", dictvocab: "search", stress: "wave", dictation: "headphones", ctest: "puzzle", mix: "shuffle", formats: "layers" };

export function EndlessHub() {
  const { tr, settings } = useApp();
  return (
    <div>
      <Topbar title={tr("Práctica infinita", "Endless practice")} back="#/learn" />
      <OwlSays mood="smug" size={64} text="No finish line. No lives. No excuses. Just you, me and an *obscene* number of exercises." />
      <div className="section-title"><Icon name="infinity" /> {tr("Modos sin fin", "Endless modes")}</div>
      <div className="stagger">
        {[{ id: "mix", es: "Mezcla total", desc: "todos los formatos generados, alternados", skill: "" }, { id: "formats", es: "Formatos variados", desc: "parejas, clasificar, intruso, corregir el error, acento", skill: "" }, ...GEN_MODES].map((m) => {
          const off = (m.id === "dictation" && settings.skip.listening) || (m.id === "stress" && settings.skip.pronunciation);
          return (
            <button key={m.id} className="unit" style={{ width: "100%", textAlign: "left", opacity: off ? 0.6 : 1 }} onClick={() => go(`#/endless/${m.id}`)}>
              <div className={"node " + (m.id === "mix" ? "done" : "")}><Icon name={ICONS[m.id] || "sparkle"} size={22} /></div>
              <div className="grow">
                <div className="serif">{m.es}</div>
                <div className="tiny muted">{m.desc}{off ? " · " + tr("omitida en sesiones, aquí disponible", "skipped in sessions") : ""}</div>
              </div>
              <Icon name="next" size={18} className="muted" />
            </button>
          );
        })}
      </div>
      <div className="card flat tight small muted" style={{ marginTop: 16 }}>
        <Icon name="help" size={16} /> {tr("De dónde salen: definiciones y ejemplos del vocabulario curado y del tuyo, el diccionario offline (WordNet + CMU), y oraciones de las lecturas y audios de la app. No se inventa contenido nuevo; se recombina el que ya existe. Para ejercicios de gramática por tema, entra a cualquier lección y pulsa «Más práctica»: también es infinita.", "Built from existing app data.")}
      </div>
    </div>
  );
}

export function EndlessPage({ mode }: { mode: string }) {
  const { tr, model, settings } = useApp();
  const [queue, setQueue] = useState<Item[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState({ n: 0, c: 0, run: 0, best: 0 });
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const t0 = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  const fetching = useRef(false);
  const seen = useRef(new Set<string>());
  const meta = [...GEN_MODES, { id: "mix", es: "Mezcla total" }, { id: "formats", es: "Formatos variados" }].find((m) => m.id === mode);

  const target = () => {
    const sk = mode === "stress" ? "pronunciation" : mode === "dictation" ? "listening" : mode === "ctest" ? "reading" : "vocabulary";
    return Math.round(model.skills[sk]?.theta ?? 58);
  };

  const more = async (n = 8) => {
    if (fetching.current) return;
    fetching.current = true;
    let got: Item[] = [];
    try {
      if (mode === "mix") got = await generateMixed(n, target(), { listening: false, pronunciation: false, reading: false }, settings.accents);
      else if (mode === "formats") got = shuffle(VARIETY_ITEMS.filter((x) => !seen.current.has(x.id))).slice(0, n);
      else got = await generate(mode as GenMode, n, target(), { accents: settings.accents });
      if (mode === "formats" && got.length < n) { seen.current.clear(); got = [...got, ...shuffle(VARIETY_ITEMS).slice(0, n - got.length)]; }
    } catch {}
    // evita repetir lo de esta misma racha
    const fresh = got.filter((g) => !seen.current.has(g.id));
    const use = fresh.length ? fresh : got;
    use.forEach((g) => seen.current.add(g.id));
    setQueue((q) => [...q, ...use]);
    setLoading(false);
    if (!use.length) setEmpty(true);
    fetching.current = false;
  };

  useEffect(() => { more(10); const iv = setInterval(() => setNow(Date.now()), 1000); return () => { clearInterval(iv); stopSpeaking(); }; }, [mode]);
  useEffect(() => { if (queue.length && queue.length - i <= 3) more(8); }, [i, queue.length]);

  const it = queue[i];
  const pct = score.n ? Math.round((score.c / score.n) * 100) : 0;

  return (
    <div>
      <div className="sess-head">
        <button className="iconbtn" onClick={() => go("#/endless")} aria-label="Salir"><Icon name="x" /></button>
        <div className="grow">
          <div className="row between tiny muted" style={{ marginBottom: 4 }}>
            <span className="row" style={{ gap: 6 }}><Icon name="infinity" size={15} /> {meta?.es || mode}</span>
            <span>{fmtTime((now - t0.current) / 1000)}</span>
          </div>
          <Bar pct={((score.n % 10) / 10) * 100} kind="gold" />
        </div>
      </div>
      <div className="sess-sub">
        <span className="sess-reason">{score.c}/{score.n} · {pct}%</span>
        {score.run >= 3 && <span className="combo-chip" key={score.run}><Icon name="flame" size={13} /> {score.run}</span>}
      </div>
      {loading && <div className="card center"><Owl mood="thinking" size={90} /><div className="muted small">{tr("Preparando ejercicios…", "Preparing…")}</div></div>}
      {empty && !it && (
        <div className="card center">
          <Owl mood="shocked" size={90} />
          <p>{mode === "personal" ? tr("Necesitas al menos una palabra con definición en tu vocabulario (toca cualquier palabra en un texto y pulsa «Add to Vocabulary»).", "Add some words first.") : tr("No pude generar ejercicios de este tipo en este dispositivo.", "Couldn't generate items here.")}</p>
          <button className="btn" onClick={() => go("#/endless")}>{tr("Volver", "Back")}</button>
        </div>
      )}
      {it && (
        <div className="card act-enter" key={it.id + i}>
          <ItemView item={it} mode="practice" onDone={(r) => {
            setScore((s) => { const run = r.correct ? s.run + 1 : 0; return { n: s.n + 1, c: s.c + (r.correct ? 1 : 0), run, best: Math.max(s.best, run) }; });
            setI(i + 1); window.scrollTo(0, 0);
          }} />
        </div>
      )}
    </div>
  );
}
