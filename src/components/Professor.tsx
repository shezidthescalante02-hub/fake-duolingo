import React, { useState } from "react";
import type { Item } from "../content/types";
import { Md, Sheet, Owl } from "./ui";
import { useApp } from "../state";
import { aiReady, aiConfigured, professorAnswer } from "../services/ai";
import { lessonForTag } from "../content/index";

export function itemToText(item: Item, resp?: any): string {
  const lines: string[] = [];
  if (item.ctx) lines.push("Context: " + item.ctx);
  if (item.prompt) lines.push("Prompt: " + item.prompt);
  switch (item.kind) {
    case "mcq": item.options.forEach((o, i) => lines.push(`${String.fromCharCode(65 + i)}. ${o}${i === item.answer ? "  [correct]" : ""}`)); if (typeof resp === "number") lines.push("Learner chose: " + String.fromCharCode(65 + resp)); break;
    case "gap": case "wf": lines.push("Sentence: " + item.text + " | accepted: " + item.answers.join(", ")); if (resp) lines.push("Learner wrote: " + resp); break;
    case "kwt": lines.push(`Sentence 1: ${item.first}\nKey: ${item.key}\nSentence 2: ${item.start} ____ ${item.end}\nAccepted: ${item.answers.join(" | ")}`); if (resp) lines.push("Learner wrote: " + resp); break;
    case "judge": lines.push(`Sentence: ${item.sentence}\nContext: ${item.context || "academic"}\nGrammatical: ${item.grammatical}; Appropriate: ${item.appropriate}`); break;
    case "tf": lines.push(`Statement: ${item.statement} -> ${item.answer}`); break;
    case "spot": lines.push(`Segments: ${item.segments.map((s, i) => String.fromCharCode(65 + i) + ") " + s).join(" ")}; wrong: ${item.wrong}; fix: ${item.fix}`); break;
    case "order": lines.push(`Target: ${item.tokens.join(" ")}`); break;
    case "ctest": lines.push(`C-test: ${item.text}`); break;
    case "produce": lines.push(`Task: ${item.task}`); if (resp?.text) lines.push("Learner text: " + resp.text); break;
  }
  lines.push("Explanation in app: " + item.explain);
  return lines.join("\n");
}

const QUESTIONS = [
  { id: "why", q: "Why is this wrong?" },
  { id: "better", q: "Why is the correct option better than the others?" },
  { id: "unnatural", q: "Why does my answer sound unnatural?" },
  { id: "rule", q: "What grammar rule applies here?" },
  { id: "advanced", q: "Explain this at an advanced linguistic level." },
  { id: "another", q: "Give me another example." },
  { id: "harder", q: "Give me a harder example." },
];

export function ProfessorSheet({ open, onClose, item, resp, checked, context, onMore }: { open: boolean; onClose: () => void; item: Item; resp?: any; checked: boolean; context?: string; onMore?: (k: "similar" | "harder") => void }) {
  const { tr, bump, lock } = useApp();
  const [chat, setChat] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const lesson = lessonForTag(item.tags[0]);

  const offlineAnswer = (id: string): string => {
    switch (id) {
      case "why":
      case "unnatural":
        if (item.kind === "mcq" && typeof resp === "number" && item.why?.[resp]) return item.why[resp]!;
        return item.explain;
      case "better":
        if (item.kind === "mcq") return item.explain + "\n\n" + item.options.map((o, i) => i === item.answer ? `- **${String.fromCharCode(65 + i)}** ✓ ${o}` : `- ${String.fromCharCode(65 + i)}. ${o}${item.why?.[i] ? " — " + item.why[i] : ""}`).join("\n");
        return item.explain;
      case "rule": return lesson ? `**${lesson.title}**\n\n${lesson.summary}\n\n${lesson.body}` : item.explain;
      case "advanced": return item.deep || (lesson ? lesson.body : item.explain);
      default: return item.explain;
    }
  };

  async function ask(text: string, id?: string) {
    if (!checked) return;
    bump("professor");
    setErr("");
    if (id === "another" || id === "harder") {
      if (onMore) { onClose(); onMore(id === "harder" ? "harder" : "similar"); return; }
    }
    const next = [...chat, { role: "user" as const, text }];
    if (!aiReady()) {
      setChat([...next, { role: "model", text: offlineAnswer(id || "why") + (aiConfigured() ? "\n\n_(Sin conexión: respuesta del banco de explicaciones.)_" : "") }]);
      return;
    }
    setChat(next); setBusy(true);
    try {
      const ans = await professorAnswer(text, itemToText(item, resp) + (context ? "\n\nRelated text:\n" + context.slice(0, 3000) : ""), chat);
      setChat([...next, { role: "model", text: ans }]);
    } catch (e: any) {
      setErr(String(e.message || e));
      setChat([...next, { role: "model", text: offlineAnswer(id || "why") }]);
    } finally { setBusy(false); }
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="row" style={{ marginBottom: 8 }}>
        <Owl mood="thinking" size={54} anim="none" />
        <div className="grow">
          <div className="serif" style={{ fontSize: "1.2em" }}>Professor Mode</div>
          <div className="tiny muted">{aiReady() ? tr("IA conectada (Gemini) + banco de explicaciones", "AI connected") : tr("Modo offline: explicaciones del banco de contenido", "Offline explanations")}</div>
        </div>
        <button className="iconbtn" onClick={onClose}>✕</button>
      </div>
      {lock.professor ? <div className="empty">🔒 {tr("No disponible durante simulaciones.", "Not available during simulations.")}</div> : !checked ? (
        <div className="empty">{tr("Primero responde la pregunta. El profesor no da spoilers.", "Answer first. No spoilers.")}</div>
      ) : (
        <>
          <div className="chips" style={{ marginBottom: 10 }}>
            {QUESTIONS.map((x) => <button key={x.id} className="chip" disabled={busy} onClick={() => ask(x.q, x.id)}>{x.q}</button>)}
          </div>
          {chat.length === 0 && (
            <div className="card flat tight">
              <Md text={item.explain} />
              {item.deep && <><div className="hr" /><div className="small gold">{tr("Nivel avanzado", "Advanced")}</div><Md text={item.deep} /></>}
              {lesson && <div style={{ marginTop: 8 }}><a href={`#/lesson/${lesson.id}`} onClick={onClose}>📘 {tr("Abrir la lección", "Open lesson")}: {lesson.title}</a></div>}
            </div>
          )}
          {chat.map((m, i) => (
            <div key={i} className={m.role === "user" ? "row" : ""} style={{ margin: "8px 0", justifyContent: m.role === "user" ? "flex-end" : undefined }}>
              <div className={m.role === "user" ? "chip on" : "card flat tight"} style={m.role === "user" ? { borderRadius: 14 } : {}}>
                {m.role === "user" ? m.text : <Md text={m.text} />}
              </div>
            </div>
          ))}
          {busy && <div className="muted small">Strix {tr("está pensando…", "is thinking…")}</div>}
          {err && <div className="small bad">{err}</div>}
          <div className="row" style={{ marginTop: 8 }}>
            <input className="input" placeholder={tr("Escribe tu pregunta (en inglés o español)…", "Ask anything…")} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) { ask(q.trim()); setQ(""); } }} />
            <button className="btn" disabled={!q.trim() || busy} onClick={() => { ask(q.trim()); setQ(""); }}>↑</button>
          </div>
          {!aiConfigured() && <div className="tiny muted" style={{ marginTop: 6 }}>{tr("Las preguntas libres se responden mejor con una clave gratuita de Gemini (Ajustes → IA). Sin ella, te muestro la explicación más relevante del banco.", "Add a free Gemini key in Settings for open questions.")}</div>}
        </>
      )}
    </Sheet>
  );
}
