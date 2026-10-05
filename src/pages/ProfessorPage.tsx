import React, { useState } from "react";
import { Icon } from "../components/Icon";
import { useApp } from "../state";
import { Topbar, Md, Owl, go } from "../components/ui";
import { ALL_LESSONS } from "../content/index";
import { aiReady, generate, TUTOR_SYSTEM } from "../services/ai";

const SAMPLES = [
  "Why is 'despite the sample was small' wrong?",
  "What's the difference between 'imply' and 'infer'?",
  "When should I use 'whom'?",
  "Is 'data is' acceptable in academic writing?",
  "Explain the difference between coherence and cohesion at an advanced level.",
  "Why does 'make a research' sound unnatural?",
];

export function ProfessorPage() {
  const { tr, bump, lock } = useApp();
  const [chat, setChat] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const offline = (question: string) => {
    const words = question.toLowerCase().match(/[a-z']{4,}/g) || [];
    const scored = ALL_LESSONS.map((l) => {
      const hay = (l.title + " " + l.summary + " " + l.body).toLowerCase();
      return { l, s: words.reduce((a, w) => a + (hay.includes(w) ? 1 : 0), 0) };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 2);
    if (!scored.length) return tr("Sin conexión a la IA no puedo responder preguntas libres, y no encontré una lección relacionada. Prueba con otras palabras clave o configura una clave gratuita de Gemini en Ajustes.", "No related lesson found offline.");
    return scored.map(({ l }) => `**${l.title}** — [[${tr("lección relacionada", "related lesson")}]]\n\n${l.summary}\n\n${l.body}\n\n→ #/lesson/${l.id}`).join("\n\n---\n\n");
  };

  const ask = async (text: string) => {
    if (!text.trim()) return;
    bump("professor");
    const next = [...chat, { role: "user" as const, text }];
    setChat(next); setQ("");
    if (!aiReady()) { setChat([...next, { role: "model", text: offline(text) }]); return; }
    setBusy(true);
    try {
      const ans = await generate({ system: TUTOR_SYSTEM + "\nYou are in Professor Mode: give thorough, linguistically precise explanations with examples; offer a harder example at the end.", parts: [{ text }], history: chat, temperature: 0.5 });
      setChat([...next, { role: "model", text: ans }]);
    } catch (e: any) { setChat([...next, { role: "model", text: offline(text) + "\n\n_(" + (e.message || e) + ")_" }]); } finally { setBusy(false); }
  };

  if (lock.professor) return <div><Topbar title="Professor Mode" back /><div className="empty"><Icon name="lock" size={16} /></div></div>;
  return (
    <div>
      <Topbar title="Professor Mode" back />
      <div className="row" style={{ alignItems: "flex-start" }}>
        <Owl mood="thinking" size={70} />
        <div className="speech grow small">Ask me anything about English: why something is wrong, why B beats A, why a sentence sounds unnatural, what rule applies. I explain; I don't just hand out answers. {aiReady() ? "" : "(Offline: I'll point you to the most relevant lesson.)"}</div>
      </div>
      {chat.length === 0 && <div className="chips" style={{ margin: "12px 0" }}>{SAMPLES.map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}</div>}
      {chat.map((m, i) => (
        <div key={i} style={{ margin: "10px 0", textAlign: m.role === "user" ? "right" : "left" }}>
          <div className={m.role === "user" ? "chip on" : "card flat tight"} style={{ display: "inline-block", maxWidth: "100%", textAlign: "left", borderRadius: 14 }}>
            {m.role === "user" ? m.text : <>{m.text.split(/→ (#\/lesson\/[\w-]+)/).map((part, k) => k % 2 ? <button key={k} className="btn xs" onClick={() => go(part)}><Icon name="learn" size={16} /> {tr("Abrir lección", "Open lesson")}</button> : <Md key={k} text={part} />)}</>}
          </div>
        </div>
      ))}
      {busy && <div className="small muted">Strix {tr("está pensando…", "is thinking…")}</div>}
      <div className="sticky-actions">
        <div className="row">
          <textarea className="input" style={{ minHeight: 48 }} placeholder={tr("Escribe tu pregunta…", "Your question…")} value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn primary" disabled={busy || !q.trim()} onClick={() => ask(q)}>↑</button>
        </div>
      </div>
    </div>
  );
}
