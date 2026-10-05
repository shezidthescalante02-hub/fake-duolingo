import React, { useEffect, useState } from "react";
import { useApp } from "./state";
import { DictSheet } from "./components/DictSheet";
import { Owl, Confetti } from "./components/ui";
import { ACHIEVEMENTS, titleFor } from "./engine/game";
import { loadCustom } from "./content/index";
import { Home } from "./pages/Home";
import { Onboarding } from "./pages/Onboarding";
import { Diagnostic } from "./pages/Diagnostic";
import { SessionPage } from "./pages/Session";
import { Learn, LessonsHub, LessonPage, PracticeTag } from "./pages/Learn";
import { VocabPage, WordPage, VocabReview } from "./pages/Vocab";
import { DictionaryPage } from "./pages/Dictionary";
import { ReadingList, ReadingPage } from "./pages/Reading";
import { ListeningList, ListeningPage } from "./pages/Listening";
import { WritingList, WritingPage } from "./pages/Writing";
import { SpeakingList, SpeakingPage, PronPage } from "./pages/Speaking";
import { PhdList, PhdPage } from "./pages/Phd";
import { StrategyPage, InstinctDrill } from "./pages/Strategy";
import { SimList, SimRunner, SimResult } from "./pages/Sims";
import { Dashboard } from "./pages/Dashboard";
import { ProfessorPage } from "./pages/ProfessorPage";
import { SettingsPage } from "./pages/Settings";
import { GeneratePage } from "./pages/Generate";

function useHash() {
  const [h, setH] = useState(location.hash || "#/");
  useEffect(() => {
    const f = () => { setH(location.hash || "#/"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return h;
}

export function parseRoute(h: string) {
  const [path, qs] = h.replace(/^#/, "").split("?");
  const parts = path.split("/").filter(Boolean);
  const q = new URLSearchParams(qs || "");
  return { parts, q };
}

const NAV = [
  { h: "#/", i: "🏠", es: "Hoy", en: "Today" },
  { h: "#/learn", i: "📚", es: "Aprender", en: "Learn" },
  { h: "#/vocab", i: "🗂️", es: "Vocab", en: "Vocab" },
  { h: "#/sims", i: "🎓", es: "Exámenes", en: "Exams" },
  { h: "#/dashboard", i: "📊", es: "Progreso", en: "Progress" },
];
const SIDE_EXTRA = [
  { h: "#/writing", i: "✒️", es: "Writing", en: "Writing" },
  { h: "#/reading", i: "📖", es: "Reading", en: "Reading" },
  { h: "#/listening", i: "🎧", es: "Listening", en: "Listening" },
  { h: "#/speaking", i: "🎙️", es: "Speaking", en: "Speaking" },
  { h: "#/phd", i: "🎓", es: "Modo Doctorado", en: "PhD Mode" },
  { h: "#/professor", i: "🧑‍🏫", es: "Professor Mode", en: "Professor Mode" },
  { h: "#/dict", i: "🔎", es: "Diccionario", en: "Dictionary" },
  { h: "#/settings", i: "⚙️", es: "Ajustes", en: "Settings" },
];

export function App() {
  const app = useApp();
  useEffect(() => { const f = () => app.closeDict(); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  const { ready, settings, tr } = app;
  const hash = useHash();
  const [customReady, setCustomReady] = useState(false);
  useEffect(() => { loadCustom().finally(() => setCustomReady(true)); }, []);

  if (!ready || !customReady) return <div className="boot"><div className="boot-owl">🦉</div><div className="boot-text">Fake Duolingo</div></div>;

  const { parts, q } = parseRoute(hash);
  const r = parts[0] || "";
  if (!settings.onboarded && r !== "diagnostic" && r !== "onboarding" && r !== "settings") return <div className="main full"><Onboarding /><Overlays /></div>;

  const full = ["session", "diagnostic", "lesson", "practice", "sim", "reading", "listening", "writing", "speaking", "phd", "onboarding"].includes(r) && parts.length > 1 || r === "diagnostic" || r === "session";

  let page: React.ReactNode;
  switch (r) {
    case "": page = <Home />; break;
    case "onboarding": page = <Onboarding />; break;
    case "diagnostic": page = <Diagnostic />; break;
    case "session": page = <SessionPage minutes={q.get("m") === "0" ? null : Number(q.get("m") || 10)} focus={q.get("focus") || undefined} />; break;
    case "learn": page = <Learn />; break;
    case "grammar": page = <LessonsHub module="grammar" />; break;
    case "academic": page = <LessonsHub module="academic" />; break;
    case "uoe": page = <LessonsHub module="uoe" />; break;
    case "pron": page = <PronPage />; break;
    case "lesson": page = <LessonPage id={parts[1]} />; break;
    case "practice": page = <PracticeTag tag={decodeURIComponent(parts.slice(1).join("/"))} />; break;
    case "vocab": page = parts[1] === "word" ? <WordPage id={decodeURIComponent(parts[2])} /> : parts[1] === "review" ? <VocabReview /> : <VocabPage />; break;
    case "dict": page = <DictionaryPage initial={q.get("q") || ""} />; break;
    case "reading": page = parts[1] ? <ReadingPage id={parts[1]} /> : <ReadingList />; break;
    case "listening": page = parts[1] ? <ListeningPage id={parts[1]} /> : <ListeningList />; break;
    case "writing": page = parts[1] ? <WritingPage id={parts[1]} /> : <WritingList />; break;
    case "speaking": page = parts[1] ? <SpeakingPage id={parts[1]} /> : <SpeakingList />; break;
    case "phd": page = parts[1] ? <PhdPage id={parts[1]} /> : <PhdList />; break;
    case "strategy": page = parts[1] === "instinct" ? <InstinctDrill /> : <StrategyPage />; break;
    case "sims": page = <SimList />; break;
    case "sim": page = <SimRunner exam={parts[1] as any} section={q.get("section") || undefined} />; break;
    case "simresult": page = <SimResult id={parts[1]} />; break;
    case "dashboard": page = <Dashboard />; break;
    case "professor": page = <ProfessorPage />; break;
    case "settings": page = <SettingsPage />; break;
    case "generate": page = <GeneratePage />; break;
    default: page = <Home />;
  }

  const navActive = (h: string) => (h === "#/" ? hash === "#/" || hash === "" : hash.startsWith(h));
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand"><div className="owl-mini"><Owl size={40} anim="none" /></div> Fake Duolingo</div>
        {[...NAV, ...SIDE_EXTRA].map((n) => (
          <button key={n.h} className={navActive(n.h) ? "on" : ""} onClick={() => (location.hash = n.h)}><span>{n.i}</span>{tr(n.es, n.en)}</button>
        ))}
      </nav>
      <main className={"main" + (full ? " full" : "")}>{page}</main>
      {!full && (
        <div className="tabbar">
          {NAV.map((n) => (
            <button key={n.h} className={navActive(n.h) ? "on" : ""} onClick={() => (location.hash = n.h)}>
              <span className="ico">{n.i}</span>{tr(n.es, n.en)}
            </button>
          ))}
        </div>
      )}
      <Overlays />
    </div>
  );

}

function Overlays() {
  const { tr, toastMsg, levelUp, clearLevelUp, newAch, clearAch, lock } = useApp();
  const quiet = lock.reason === "diagnostic" || lock.reason === "sim"; // no interrumpir exámenes
  return (
    <>
      <DictSheet />
      {toastMsg && <div className="toast">{toastMsg}</div>}
      {levelUp && !quiet && (
        <>
          <Confetti />
          <div className="sheet-bg" onClick={clearLevelUp} />
          <div className="sheet center">
            <div className="grab" />
            <div style={{ width: 130, margin: "0 auto" }}><Owl mood="proud" size={130} anim="hop" /></div>
            <div className="serif" style={{ fontSize: "1.6em" }}>{tr("¡Nivel", "Level")} {levelUp}!</div>
            <div className="gold">“{titleFor(levelUp)}”</div>
            <p className="small muted">LEVEL UP. Somewhere, a Cambridge examiner felt a chill.</p>
            <button className="btn primary" onClick={clearLevelUp}>{tr("Seguir", "Continue")}</button>
          </div>
        </>
      )}
      {!levelUp && !quiet && newAch.length > 0 && (
        <>
          <div className="sheet-bg" onClick={clearAch} />
          <div className="sheet center">
            <div className="grab" />
            <div className="small muted">{tr("Logro desbloqueado", "Achievement unlocked")}</div>
            {newAch.map((id) => { const a = ACHIEVEMENTS.find((x) => x.id === id); return a ? <div key={id} style={{ margin: "10px 0" }}><div style={{ fontSize: 40 }}>{a.icon}</div><div className="serif" style={{ fontSize: "1.3em" }}>{a.name}</div><div className="small muted">{a.desc}</div></div> : null; })}
            <button className="btn primary" onClick={clearAch}>OK</button>
          </div>
        </>
      )}
    </>
  );
}
