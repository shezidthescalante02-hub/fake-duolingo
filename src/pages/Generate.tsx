import React, { useState } from "react";
import { useApp } from "../state";
import { Topbar, go } from "../components/ui";
import { ALL_LESSONS, addCustomItems } from "../content/index";
import { aiReady, generateItems } from "../services/ai";
import { skillOf } from "../content/helpers";

export function GeneratePage() {
  const { tr, model } = useApp();
  const [tag, setTag] = useState(ALL_LESSONS[0].tag);
  const [n, setN] = useState(6);
  const [offset, setOffset] = useState(4);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const lesson = ALL_LESSONS.find((l) => l.tag === tag)!;
  const run = async () => {
    setBusy(true); setMsg("");
    try {
      const sk = skillOf(tag);
      const lvl = Math.round((model.skills[sk]?.theta ?? 60) + offset);
      const r = await generateItems(tag, lesson.title, lvl, n, ["mcq", "gap", "judge", "spot", "kwt"]);
      const items = (r.items || []).filter((x: any) => x && x.kind && x.explain).map((x: any, k: number) => ({ ...x, id: `ai-${tag}-${Date.now()}-${k}`, tags: [tag], skill: sk, lvl }));
      await addCustomItems(items);
      setMsg(`${items.length} ${tr("ejercicios nuevos guardados en tu banco (funcionan offline).", "new items saved (work offline).")}`);
    } catch (e: any) { setMsg(String(e.message || e)); } finally { setBusy(false); }
  };
  return (
    <div>
      <Topbar title={tr("Generar contenido", "Generate content")} back="#/learn" />
      {!aiReady() ? (
        <div className="card">
          <p>{tr("Esta función usa IA gratuita (Google Gemini) y necesita conexión. El resto de la app funciona sin ella.", "Requires a free Gemini key.")}</p>
          <button className="btn primary" onClick={() => go("#/settings")}>{tr("Configurar IA en Ajustes", "Set up AI")}</button>
        </div>
      ) : (
        <div className="card">
          <label className="small muted">{tr("Tema", "Topic")}</label>
          <select className="input" value={tag} onChange={(e) => setTag(e.target.value)}>
            {ALL_LESSONS.map((l) => <option key={l.id} value={l.tag}>{l.module} · {l.title}</option>)}
          </select>
          <div className="spacer" />
          <label className="small muted">{tr("Cantidad", "How many")}: {n}</label>
          <input type="range" min={3} max={12} value={n} onChange={(e) => setN(+e.target.value)} />
          <label className="small muted">{tr("Dificultad respecto a tu nivel", "Difficulty vs your level")}: {offset > 0 ? "+" : ""}{offset}</label>
          <input type="range" min={-6} max={16} value={offset} onChange={(e) => setOffset(+e.target.value)} />
          <button className="btn primary block" disabled={busy} onClick={run}>{busy ? "…" : tr("Generar", "Generate")}</button>
          {msg && <div className="small" style={{ marginTop: 8 }}>{msg}</div>}
          <div className="tiny muted" style={{ marginTop: 8 }}>{tr("Los ejercicios generados por IA pueden contener errores ocasionales: si una respuesta te parece incorrecta, usa Professor Mode para discutirla.", "AI items may occasionally contain errors.")}</div>
        </div>
      )}
    </div>
  );
}
