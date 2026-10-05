import React, { useEffect, useState } from "react";
import { useApp, DEFAULT_SETTINGS } from "../state";
import { Topbar, Toggle, Owl } from "../components/ui";
import { DIFFS } from "../engine/difficulty";
import { levelFromXp, UNLOCKS, OWL_COLORS } from "../engine/game";
import { applyNotifications, notifSupported } from "../services/notify";
import { loadAi, saveAi, listModels, type AiConfig, DEFAULT_AI } from "../services/ai";
import { db } from "../db/db";
import { availableAccents, speak } from "../services/tts";
import type { Accent } from "../content/types";
import { isNative } from "../services/native";

declare const __APP_VERSION__: string;
declare const __BUILD_ID__: string;

const DAYS = [["Do", 1], ["Lu", 2], ["Ma", 3], ["Mi", 4], ["Ju", 5], ["Vi", 6], ["Sá", 7]] as const;

export function SettingsPage() {
  const { settings: s, setSettings, tr, profile, toast } = useApp();
  const lv = levelFromXp(profile.xp).level;
  const [ai, setAi] = useState<AiConfig>(DEFAULT_AI);
  const [models, setModels] = useState<string[]>([]);
  const [aiMsg, setAiMsg] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [accents, setAccents] = useState<string[]>([]);
  useEffect(() => { loadAi().then(setAi); availableAccents().then(setAccents); }, []);

  const exportData = async () => {
    const data = await db.exportAll();
    const blob = new Blob([JSON.stringify({ app: "fake-duolingo", version: __APP_VERSION__, at: new Date().toISOString(), data }, null, 1)], { type: "application/json" });
    const name = `fake-duolingo-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([blob], name, { type: "application/json" });
    if ((navigator as any).canShare?.({ files: [file] })) { try { await (navigator as any).share({ files: [file], title: name }); return; } catch {} }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  };
  const importData = async (f: File) => {
    try {
      const j = JSON.parse(await f.text());
      if (j.app !== "fake-duolingo") throw new Error("archivo no válido");
      if (!confirmLike(tr("Esto reemplazará todos tus datos actuales por los del respaldo.", "This will replace your data."))) return;
      await db.importAll(j.data);
      location.reload();
    } catch (e: any) { toast("Error: " + (e.message || e)); }
  };

  const testAi = async () => {
    setAiMsg("…");
    try {
      const ms = await listModels(ai.key.trim());
      setModels(ms);
      const pick = ms.includes(ai.model) ? ai.model : ms.find((m) => /flash/.test(m) && !/lite|preview|exp/.test(m)) || ms.find((m) => /flash/.test(m)) || ms[0];
      const c: AiConfig = { provider: "gemini", key: ai.key.trim(), model: pick || ai.model };
      setAi(c); await saveAi(c);
      setAiMsg(tr(`✓ Conectado. ${ms.length} modelos disponibles. Usando: ${c.model}`, `Connected. Using ${c.model}`));
    } catch (e: any) { setAiMsg("✗ " + (e.message || e)); }
  };

  return (
    <div>
      <Topbar title={tr("Ajustes", "Settings")} back />

      <div className="section-title">👤 {tr("Perfil", "Profile")}</div>
      <div className="card">
        <div className="setrow"><div className="grow"><div className="l">{tr("Nombre", "Name")}</div></div><input className="input" style={{ maxWidth: 200 }} value={s.name} onChange={(e) => setSettings({ name: e.target.value })} /></div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Tema de investigación", "Research topic")}</div><div className="d">{tr("Personaliza tareas de writing/speaking", "Personalises tasks")}</div></div></div>
        <input className="input" value={s.researchTopic} onChange={(e) => setSettings({ researchTopic: e.target.value })} />
        <div className="setrow"><div className="grow"><div className="l">{tr("Idioma de la interfaz", "Interface language")}</div></div>
          <div className="chips">{(["es", "en"] as const).map((l) => <button key={l} className={"chip " + (s.lang === l ? "on" : "")} onClick={() => setSettings({ lang: l })}>{l === "es" ? "Español" : "English"}</button>)}</div>
        </div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Tamaño de letra", "Font size")}</div></div>
          <div className="chips">{(["small", "normal", "large", "xl"] as const).map((f) => <button key={f} className={"chip " + (s.fontSize === f ? "on" : "")} onClick={() => setSettings({ fontSize: f })}>{f === "small" ? "A−" : f === "normal" ? "A" : f === "large" ? "A+" : "A++"}</button>)}</div>
        </div>
      </div>

      <div className="section-title">😈 {tr("Dificultad y estudio", "Difficulty & study")}</div>
      <div className="card">
        {DIFFS.map((d) => (
          <label key={d.id} className="setrow" style={{ cursor: "pointer" }}>
            <input type="radio" checked={s.difficulty === d.id} onChange={() => setSettings({ difficulty: d.id })} />
            <div className="grow"><div className="l">{d.name}</div><div className="d">{d.desc}</div></div>
          </label>
        ))}
        <div className="hr" />
        {([["reading", "Reading"], ["listening", "Listening"], ["speaking", "Speaking"], ["writing", "Writing"], ["pronunciation", tr("Pronunciación", "Pronunciation")]] as [keyof typeof s.skip, string][]).map(([k, l]) => (
          <div key={k} className="setrow"><div className="grow"><div className="l">{l}</div><div className="d">{tr("Incluir en sesiones automáticas", "Include in sessions")}</div></div><Toggle on={!s.skip[k]} onChange={(v) => setSettings({ skip: { ...s.skip, [k]: !v } })} /></div>
        ))}
        <div className="setrow"><div className="grow"><div className="l">{tr("Preguntar confianza antes de responder", "Ask confidence")}</div><div className="d">{tr("Segura / dudando / adivinando: mejora la detección de errores bajo presión", "Improves error analysis")}</div></div><Toggle on={s.askConfidence} onChange={(v) => setSettings({ askConfidence: v })} /></div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Preguntar la causa de los errores", "Ask error cause")}</div><div className="d">{tr("“No lo sabía” vs. “me precipité”, etc. (opcional al responder)", "")}</div></div><Toggle on={s.askCause} onChange={(v) => setSettings({ askCause: v })} /></div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Mostrar racha", "Show streak")}</div><div className="d">{tr("Solo informativa: nunca pierdes progreso", "Informational only")}</div></div><Toggle on={s.showStreak} onChange={(v) => setSettings({ showStreak: v })} /></div>
      </div>

      <div className="section-title">🦉 Strix</div>
      <div className="card">
        <div className="row"><Owl size={80} /><div className="small muted grow">{tr("Personaliza a tu villano. Los accesorios se desbloquean con nivel (tú vas en el", "Customise your villain (level")} {lv}).</div></div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Sarcasmo", "Sarcasm")}</div></div>
          <div className="chips">{(["off", "mild", "full"] as const).map((x) => <button key={x} className={"chip " + (s.sarcasm === x ? "on" : "")} onClick={() => setSettings({ sarcasm: x })}>{x === "off" ? tr("amable", "kind") : x === "mild" ? tr("ligero", "mild") : tr("completo", "full")}</button>)}</div>
        </div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Groserías ocasionales", "Occasional swearing")}</div><div className="d">damn, hell… {tr("(poco frecuentes)", "(rare)")}</div></div><Toggle on={s.spicy} onChange={(v) => setSettings({ spicy: v })} /></div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Plumaje", "Plumage")}</div></div>
          <div className="chips">{Object.keys(OWL_COLORS).map((c) => { const u = c === "crimson" || UNLOCKS.find((x) => x.id === "color:" + c && lv >= x.level); return <button key={c} disabled={!u} className={"chip " + (s.owlColor === c ? "on" : "")} onClick={() => setSettings({ owlColor: c })}><span style={{ width: 12, height: 12, borderRadius: 6, background: OWL_COLORS[c], display: "inline-block" }} />{u ? "" : "🔒"}</button>; })}</div>
        </div>
        <div className="setrow"><div className="grow"><div className="l">{tr("Accesorio", "Accessory")}</div></div>
          <div className="chips">{(["none", "mortarboard", "scarf", "crown"] as const).map((a) => { const u = a === "none" || UNLOCKS.find((x) => x.id === "acc:" + a && lv >= x.level); const req = UNLOCKS.find((x) => x.id === "acc:" + a)?.level; return <button key={a} disabled={!u} className={"chip " + (s.owlAccessory === a ? "on" : "")} onClick={() => setSettings({ owlAccessory: a })}>{a === "none" ? "—" : a === "mortarboard" ? "🎓" : a === "scarf" ? "🧣" : "👑"}{u ? "" : ` 🔒Lv${req}`}</button>; })}</div>
        </div>
      </div>

      <div className="section-title">🔊 Audio</div>
      <div className="card">
        {([["fx", tr("Efectos", "Effects")], ["music", tr("Música ambiental", "Ambient music")], ["voice", tr("Voces (listening)", "Voices")]] as [keyof typeof s.vol, string][]).map(([k, l]) => (
          <div key={k} className="setrow"><div className="grow"><div className="l">{l}</div><input type="range" min={0} max={1} step={0.05} value={s.vol[k]} onChange={(e) => setSettings({ vol: { ...s.vol, [k]: +e.target.value } })} /></div><span className="small muted" style={{ width: 40 }}>{Math.round(s.vol[k] * 100)}%</span></div>
        ))}
        <div className="setrow"><div className="grow"><div className="l">{tr("Acentos preferidos", "Preferred accents")}</div><div className="d">{tr("Disponibles en este dispositivo", "Available")}: {accents.join(", ") || "—"}</div></div></div>
        <div className="chips">{(["en-US", "en-GB", "en-AU", "en-IN", "en-IE", "en-ZA", "en-CA", "en-NZ"] as Accent[]).map((a) => (
          <button key={a} className={"chip " + (s.accents.includes(a) ? "on" : "")} onClick={() => { const n = s.accents.includes(a) ? s.accents.filter((x) => x !== a) : [...s.accents, a]; setSettings({ accents: n.length ? n : ["en-US"] }); speak("This is how I sound.", { accent: a }); }}>{a}{accents.includes(a) ? "" : " ?"}</button>
        ))}</div>
        <div className="tiny muted" style={{ marginTop: 6 }}>{tr("En Android, las voces dependen de “Servicios de voz de Google”: Ajustes del teléfono → Accesibilidad / Texto a voz → descargar inglés (EE. UU., Reino Unido, Australia, India) para usarlas sin internet.", "On Android, download English voices in system TTS settings.")}</div>
      </div>

      <div className="section-title">🔔 {tr("Recordatorios", "Reminders")}</div>
      <div className="card">
        <div className="setrow"><div className="grow"><div className="l">{tr("Activar recordatorios", "Enable reminders")}</div><div className="d">{notifSupported() ? tr("Puedes desactivarlos por completo cuando quieras", "Turn off anytime") : tr("Solo en la app de Android", "Android app only")}</div></div><Toggle on={s.notif.enabled} onChange={(v) => setSettings({ notif: { ...s.notif, enabled: v } })} /></div>
        {s.notif.enabled && (
          <>
            <div className="small muted" style={{ marginTop: 6 }}>{tr("Días", "Days")}</div>
            <div className="chips" style={{ marginTop: 4 }}>{DAYS.map(([l, d]) => <button key={d} className={"chip " + (s.notif.days.includes(d) ? "on" : "")} onClick={() => setSettings({ notif: { ...s.notif, days: s.notif.days.includes(d) ? s.notif.days.filter((x) => x !== d) : [...s.notif.days, d] } })}>{l}</button>)}</div>
            <div className="small muted" style={{ marginTop: 8 }}>{tr("Horarios (cantidad de recordatorios por día)", "Times")}</div>
            {s.notif.times.map((t, i) => (
              <div key={i} className="row" style={{ marginTop: 4 }}>
                <input type="time" className="input" style={{ maxWidth: 140 }} value={t} onChange={(e) => { const times = [...s.notif.times]; times[i] = e.target.value; setSettings({ notif: { ...s.notif, times } }); }} />
                {s.notif.times.length > 1 && <button className="btn xs ghost" onClick={() => setSettings({ notif: { ...s.notif, times: s.notif.times.filter((_, j) => j !== i) } })}>✕</button>}
              </div>
            ))}
            {s.notif.times.length < 4 && <button className="btn xs" style={{ marginTop: 6 }} onClick={() => setSettings({ notif: { ...s.notif, times: [...s.notif.times, "12:00"] } })}>＋ {tr("horario", "time")}</button>}
            <div className="small muted" style={{ marginTop: 8 }}>{tr("Intensidad", "Intensity")}</div>
            <div className="chips" style={{ marginTop: 4 }}>{(["gentle", "normal", "savage"] as const).map((x) => <button key={x} className={"chip " + (s.notif.intensity === x ? "on" : "")} onClick={() => setSettings({ notif: { ...s.notif, intensity: x } })}>{x === "gentle" ? tr("amable", "gentle") : x === "normal" ? "normal" : tr("salvaje", "savage")}</button>)}</div>
            <div className="setrow"><div className="grow"><div className="l">{tr("Con sonido", "With sound")}</div></div><Toggle on={s.notif.sound} onChange={(v) => setSettings({ notif: { ...s.notif, sound: v } })} /></div>
          </>
        )}
        <button className="btn sm" style={{ marginTop: 8 }} onClick={async () => setNotifMsg(await applyNotifications(s.notif, s.name))}>{tr("Guardar recordatorios", "Apply")}</button>
        {notifMsg && <div className="small" style={{ marginTop: 6 }}>{notifMsg}</div>}
      </div>

      <div className="section-title">🤖 {tr("IA opcional (gratuita)", "Optional AI (free)")}</div>
      <div className="card">
        <p className="small">{tr("La app funciona completa sin IA. Si quieres corrección más profunda de writing/speaking, Professor Mode conversacional y ejercicios ilimitados, puedes usar una clave gratuita de Google Gemini:", "Free Gemini key (optional):")}</p>
        <ol className="small" style={{ paddingLeft: 18 }}>
          <li>{tr("Entra a", "Go to")} <b>aistudio.google.com</b> {tr("con tu cuenta de Google.", "with your Google account.")}</li>
          <li>{tr("Pulsa “Get API key” → “Create API key”. No pide tarjeta.", "Create API key (no card).")}</li>
          <li>{tr("Pégala aquí y pulsa Probar.", "Paste it here and test.")}</li>
        </ol>
        <div className="small gold">{tr("Importante: en el nivel gratuito, Google puede usar lo que envías para mejorar sus productos, y hay límites diarios. Tu clave se guarda solo en este dispositivo.", "Free tier data may be used by Google; daily limits apply.")}</div>
        <input className="input" style={{ marginTop: 8 }} type="password" placeholder="AIza…" value={ai.key} onChange={(e) => setAi({ ...ai, key: e.target.value })} />
        {models.length > 0 && (
          <select className="input" style={{ marginTop: 8 }} value={ai.model} onChange={async (e) => { const c = { ...ai, model: e.target.value }; setAi(c); await saveAi(c); }}>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        )}
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn sm primary" disabled={!ai.key.trim()} onClick={testAi}>{tr("Probar y guardar", "Test & save")}</button>
          {ai.provider === "gemini" && <button className="btn sm danger" onClick={async () => { const c = { ...DEFAULT_AI }; setAi(c); await saveAi(c); setModels([]); setAiMsg(tr("IA desactivada.", "AI off.")); }}>{tr("Quitar", "Remove")}</button>}
        </div>
        {aiMsg && <div className="small" style={{ marginTop: 6 }}>{aiMsg}</div>}
      </div>

      <div className="section-title">💾 {tr("Datos", "Data")}</div>
      <div className="card">
        <p className="small muted">{tr("Todo se guarda en este dispositivo. Exporta un respaldo de vez en cuando (y para pasar tu progreso entre celular, laptop y tablet).", "Data is local. Export backups to move between devices.")}</p>
        <div className="row wrap">
          <button className="btn sm" onClick={exportData}>⬇️ {tr("Exportar respaldo", "Export")}</button>
          <label className="btn sm">⬆️ {tr("Importar respaldo", "Import")}<input type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} /></label>
          <button className="btn sm danger" onClick={async () => { if (!confirmLike(tr("¿Borrar TODO tu progreso? No se puede deshacer.", "Delete everything?"))) return; for (const st of ["kv", "attempts", "vocab", "srs", "sessions", "sims", "writing", "speaking", "custom", "history"] as const) await db.clear(st); location.reload(); }}>🗑️ {tr("Reiniciar todo", "Reset")}</button>
        </div>
        <button className="btn sm ghost" style={{ marginTop: 8 }} onClick={() => setSettings({ onboarded: false })}>{tr("Repetir bienvenida", "Replay onboarding")}</button>
        <button className="btn sm ghost" style={{ marginTop: 8, marginLeft: 6 }} onClick={() => (location.hash = "#/diagnostic")}>{tr("Repetir diagnóstico", "Retake diagnostic")}</button>
      </div>

      <div className="section-title">ℹ️ {tr("Acerca de", "About")}</div>
      <div className="card small muted">
        <div>Fake Duolingo v{__APP_VERSION__} · {isNative() ? "Android" : "Web/PWA"} · build {__BUILD_ID__.slice(0, 16)}</div>
        <div style={{ marginTop: 6 }}>{tr("App de uso personal, sin anuncios ni pagos. No está afiliada a Duolingo, ETS, Cambridge English ni IELTS; las simulaciones usan material original con formatos compatibles, no material oficial.", "Personal app. Not affiliated with Duolingo, ETS, Cambridge or IELTS.")}</div>
        <div style={{ marginTop: 6 }}>{tr("Diccionario", "Dictionary")}: Open English WordNet (CC BY 4.0, {tr("derivado de", "derived from")} Princeton WordNet) · CMU Pronouncing Dictionary (BSD) · wordfreq (CC BY-SA 4.0, Robyn Speer) · Multilingual Central Repository 3.0 (CC BY 3.0).</div>
      </div>
      <div className="spacer" />
    </div>
  );
}

function confirmLike(msg: string) {
  // window.confirm funciona en Android WebView y navegadores
  try { return window.confirm(msg); } catch { return true; }
}
