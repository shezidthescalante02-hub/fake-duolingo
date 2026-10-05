import React, { useState } from "react";
import { useApp } from "../state";
import { Owl, Toggle, go } from "../components/ui";
import type { ExamId } from "../content/types";

export function Onboarding() {
  const { settings, setSettings, tr } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(settings.name);
  const [field, setField] = useState(settings.field);
  const [topic, setTopic] = useState(settings.researchTopic);
  const [exams, setExams] = useState<ExamId[]>(settings.exams);
  const [target, setTarget] = useState(settings.target);
  const [skip, setSkip] = useState(settings.skip);

  const finish = (diag: boolean) => {
    setSettings({ name: name.trim() || "Sheshi", field, researchTopic: topic, exams, target, skip, onboarded: true });
    go(diag ? "#/diagnostic" : "#/");
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", paddingTop: 20 }}>
      {step === 0 && (
        <div className="center fadein">
          <div style={{ width: 170, margin: "0 auto" }}><Owl mood="smug" size={170} /></div>
          <h1 className="serif" style={{ fontSize: "2em", margin: "8px 0" }}>Fake Duolingo</h1>
          <div className="speech" style={{ textAlign: "left" }}>
            So. You speak English, you've <i>taught</i> English, and yet exams make you second-guess yourself. Delightful. I'm <b>Strix</b>. I will be your tutor, your examiner and, on bad days, your nemesis. No hearts, no lives, no paywalls — just you, me, and C2.
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>{tr("Toda la interfaz está en español; el contenido para aprender está en inglés. Puedes cambiarlo en Ajustes.", "Interface in Spanish; content in English.")}</p>
          <button className="btn primary block" onClick={() => setStep(1)}>{tr("Empezar", "Start")}</button>
        </div>
      )}
      {step === 1 && (
        <div className="card fadein">
          <h2>{tr("Sobre ti", "About you")}</h2>
          <label className="small muted">{tr("¿Cómo te llamo?", "Name")}</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="spacer" />
          <label className="small muted">{tr("Tu campo", "Your field")}</label>
          <input className="input" value={field} onChange={(e) => setField(e.target.value)} />
          <div className="spacer" />
          <label className="small muted">{tr("Tu tema de investigación (se usa para personalizar tareas)", "Research topic")}</label>
          <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <div className="spacer" />
          <div className="small muted">{tr("Meta", "Goal")}</div>
          <div className="chips" style={{ marginTop: 6 }}>
            {(["C1", "C2"] as const).map((t) => <button key={t} className={"chip " + (target === t ? "on" : "")} onClick={() => setTarget(t)}>{t}</button>)}
          </div>
          <div className="spacer" />
          <div className="small muted">{tr("Exámenes que te interesan", "Exams")}</div>
          <div className="chips" style={{ marginTop: 6 }}>
            {([["toefl", "TOEFL iBT"], ["cae", "C1 Advanced"], ["cpe", "C2 Proficiency"], ["ielts", "IELTS Academic"]] as [ExamId, string][]).map(([id, n]) => (
              <button key={id} className={"chip " + (exams.includes(id) ? "on" : "")} onClick={() => setExams(exams.includes(id) ? exams.filter((x) => x !== id) : [...exams, id])}>{n}</button>
            ))}
          </div>
          <div className="spacer" />
          <button className="btn primary block" onClick={() => setStep(2)}>{tr("Siguiente", "Next")}</button>
        </div>
      )}
      {step === 2 && (
        <div className="card fadein">
          <h2>{tr("Habilidades que puedes omitir", "Skills you can skip")}</h2>
          <p className="small muted">{tr("Cuando no tengas tiempo, micrófono o privacidad. Puedes cambiarlo cuando quieras.", "Change anytime.")}</p>
          {([["reading", "Reading"], ["listening", "Listening"], ["speaking", "Speaking"], ["writing", "Writing"], ["pronunciation", tr("Pronunciación (omitida por defecto)", "Pronunciation")]] as [keyof typeof skip, string][]).map(([k, l]) => (
            <div key={k} className="setrow">
              <div className="grow"><div className="l">{l}</div></div>
              <span className="small muted">{skip[k] ? tr("omitida", "skipped") : tr("activa", "on")}</span>
              <Toggle on={!skip[k]} onChange={(v) => setSkip({ ...skip, [k]: !v })} />
            </div>
          ))}
          <div className="spacer" />
          <div className="row" style={{ alignItems: "flex-start" }}>
            <Owl mood="thinking" size={60} />
            <div className="speech small grow">The diagnostic takes about 35–45 minutes. You can pause between sections. It's a first estimate — if something looks odd, I'll re-check it later.</div>
          </div>
          <div className="spacer" />
          <button className="btn primary block" onClick={() => finish(true)}>{tr("Hacer el diagnóstico ahora", "Take the diagnostic")}</button>
          <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => finish(false)}>{tr("Más tarde", "Later")}</button>
        </div>
      )}
    </div>
  );
}
