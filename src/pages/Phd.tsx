import React, { useState } from "react";
import { Icon } from "../components/Icon";
import { useApp } from "../state";
import { Topbar, go, Empty, OwlSays, Md, Owl } from "../components/ui";
import { PHD_SCENARIOS } from "../content/index";
import { SpeakingRunner } from "../components/SpeakingRunner";
import { WritingRunner } from "../components/WritingRunner";
import { lvlLabel } from "../engine/cefr";
import { aiReady, generate, TUTOR_SYSTEM } from "../services/ai";
import { speak } from "../services/tts";

export function PhdList() {
  const { tr } = useApp();
  return (
    <div>
      <Topbar title={tr("Modo Doctorado", "PhD Mode")} back="#/learn" />
      <OwlSays text="Supervisors, seminars, reviewers, vivas. I'll play all of them. Some of them are nicer than me. Most aren't." mood="smug" size={60} />
      {PHD_SCENARIOS.map((s) => (
        <button key={s.id} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => go(`#/phd/${s.id}`)}>
          <div className="node"><Icon name={s.mode === "write" ? "quill" : "scroll"} size={22} /></div>
          <div className="grow"><div className="serif">{s.title}</div><div className="tiny muted">{s.setting} · {lvlLabel(s.lvl)}</div></div>
        </button>
      ))}
      <div className="card small muted">{tr("Con IA (Gemini, opcional) puedes continuar cada escenario como conversación: el profesor te responde y te repregunta.", "With AI you can continue as a roleplay.")}</div>
    </div>
  );
}

export function PhdPage({ id }: { id: string }) {
  const { tr, settings, addXp } = useApp();
  const sc = PHD_SCENARIOS.find((s) => s.id === id);
  const [mode, setMode] = useState<"brief" | "speak" | "write" | "roleplay" | "done">("brief");
  const [chat, setChat] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  if (!sc) return <Empty>Not found</Empty>;
  const persona = sc.turns[0]?.who || "Professor";

  const send = async () => {
    if (!input.trim()) return;
    const next = [...chat, { role: "user" as const, text: input.trim() }];
    setChat(next); setInput(""); setBusy(true);
    try {
      const sys = TUTOR_SYSTEM + `\nROLEPLAY: You are "${persona}" in this setting: ${sc.setting}. The learner is a doctoral student working on ${settings.researchTopic}. Stay in role, be realistic (sometimes challenging, never rude), keep turns to 2–4 sentences, and ask follow-up questions. The conversation so far began with: ${sc.turns.map((t) => `${t.who}: ${t.say}`).join(" / ")}. After the learner's 4th turn, step out of role and give brief feedback on language (register, hedging, politeness, precision) with 2–3 concrete improvements.`;
      const ans = await generate({ system: sys, parts: [{ text: next[next.length - 1].text }], history: chat, temperature: 0.7 });
      setChat([...next, { role: "model", text: ans }]);
      if (next.filter((m) => m.role === "user").length >= 4) addXp(30, { phd: 1 });
    } catch (e: any) { setChat([...next, { role: "model", text: "Error: " + (e.message || e) }]); } finally { setBusy(false); }
  };

  return (
    <div>
      <Topbar title={sc.title} back="#/phd" />
      <div className="card">
        <div className="tiny muted">{sc.setting}</div>
        {sc.turns.map((t, i) => (
          <div key={i} className="row" style={{ alignItems: "flex-start", margin: "10px 0" }}>
            <Owl mood="thinking" size={44} anim="none" />
            <div className="speech grow"><b className="small">{t.who}:</b> <span className="serif">{t.say}</span> <button className="btn xs ghost" onClick={() => speak(t.say, { accent: "en-GB" })}><Icon name="speaker" size={16} /></button></div>
          </div>
        ))}
        <div className="feedback neutral"><b>{tr("Tu tarea", "Your task")}:</b> <Md text={sc.task} inline /></div>
      </div>
      {mode === "brief" && (
        <>
          <div className="card">
            <h3><Icon name="text" size={16} /> {tr("Expresiones útiles", "Useful language")}</h3>
            {sc.phrases.map((p) => (
              <div key={p.label} style={{ margin: "6px 0" }}><div className="small gold">{p.label}</div>{p.items.map((x) => <div key={x} className="small serif">• {x}</div>)}</div>
            ))}
            {sc.pitfalls && <><div className="hr" />{sc.pitfalls.map((e, i) => <div key={i} className={"ex " + (e.k || "good")}>{e.t}{e.note && <div className="tiny muted">{e.note}</div>}</div>)}</>}
          </div>
          <div className="grid2">
            {sc.mode !== "write" && <button className="btn primary" onClick={() => setMode("speak")}><Icon name="mic" size={16} /> {tr("Responder hablando", "Speak")}</button>}
            {sc.mode !== "speak" && <button className="btn primary" onClick={() => setMode("write")}><Icon name="quill" size={16} /> {tr("Responder por escrito", "Write")}</button>}
            {sc.mode === "speak" && <button className="btn" onClick={() => setMode("write")}><Icon name="quill" size={16} /> {tr("Por escrito", "In writing")}</button>}
            <button className="btn" disabled={!aiReady()} onClick={() => setMode("roleplay")}><Icon name="sparkle" size={16} /> {tr("Conversación con IA", "AI roleplay")}</button>
          </div>
          {!aiReady() && <div className="tiny muted" style={{ marginTop: 6 }}>{tr("La conversación con IA necesita una clave gratuita de Gemini y conexión.", "AI roleplay needs a Gemini key.")}</div>}
        </>
      )}
      {mode === "speak" && <SpeakingRunner task={{ id: sc.id, type: "phd", title: sc.title, prompt: sc.task, context: sc.turns.map((t) => `${t.who}: “${t.say}”`).join("\n"), prepSec: 30, speakSec: 90, lvl: sc.lvl, checklist: ["Responded to what was actually said", "Appropriate politeness and register", "Clear structure", "Specific content (not vague)", "Hedged where appropriate"], phrases: sc.phrases.flatMap((p) => p.items) }} mode="practice" onDone={() => setMode("done")} />}
      {mode === "write" && <WritingRunner task={{ id: sc.id, genre: "PhD scenario", title: sc.title, prompt: sc.turns.map((t) => `**${t.who}:** ${t.say}`).join("\n\n") + "\n\n" + sc.task, lvl: sc.lvl, minWords: 60, focus: ["register", "politeness", "precision"], checklist: ["Responds to what was said", "Appropriate politeness and register", "Clear and specific", "Hedged where appropriate"], model: sc.model }} mode="practice" onDone={() => setMode("done")} />}
      {mode === "roleplay" && (
        <div className="card">
          {chat.map((m, i) => (
            <div key={i} style={{ margin: "8px 0", textAlign: m.role === "user" ? "right" : "left" }}>
              <div className={m.role === "user" ? "chip on" : "speech"} style={{ display: "inline-block", maxWidth: "90%", textAlign: "left", borderRadius: 14 }}>{m.role === "model" ? <Md text={m.text} /> : m.text}</div>
            </div>
          ))}
          {busy && <div className="small muted">{persona} {tr("está escribiendo…", "is typing…")}</div>}
          <textarea className="textarea" style={{ minHeight: 90 }} value={input} onChange={(e) => setInput(e.target.value)} placeholder={tr("Tu respuesta…", "Your reply…")} />
          <button className="btn primary block" disabled={busy || !input.trim()} onClick={send}>{tr("Enviar", "Send")}</button>
        </div>
      )}
      {mode === "done" && (
        <div>
          {sc.model && <details className="card"><summary><Icon name="scroll" size={16} /> {tr("Respuesta modelo", "Model answer")}</summary><div className="serif small" style={{ marginTop: 8 }}>{sc.model}</div></details>}
          <button className="btn primary block" onClick={() => go("#/phd")}>{tr("Otro escenario", "Another scenario")}</button>
        </div>
      )}
    </div>
  );
}
