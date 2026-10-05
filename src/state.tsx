import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { db } from "./db/db";
import { applyAttempt, emptyModel, loadModel, saveModel, snapshot, type AttemptInput, type Model, type Attempt } from "./engine/model";
import { emptyProfile, ensureDaily, ensureQuests, levelFromXp, dayKey, ACHIEVEMENTS, type Profile } from "./engine/game";
import type { DiffId } from "./engine/difficulty";
import { diff } from "./engine/difficulty";
import { owlLine, type OwlEvent, type OwlLine } from "./owl/messages";
import { setVolumes, sfx, vibrate } from "./services/sound";
import { setVoiceVolume } from "./services/tts";
import { DEFAULT_NOTIF, type NotifSettings } from "./services/notify";
import type { Accent, ExamId } from "./content/types";
import { loadAi } from "./services/ai";

export interface Settings {
  name: string;
  lang: "es" | "en";
  difficulty: DiffId;
  skip: { reading: boolean; listening: boolean; speaking: boolean; writing: boolean; pronunciation: boolean };
  vol: { music: number; fx: number; voice: number; notif: number };
  spicy: boolean;               // groserías ocasionales del búho
  sarcasm: "off" | "mild" | "full";
  owlColor: string;
  owlAccessory: "none" | "mortarboard" | "scarf" | "crown";
  showStreak: boolean;
  askConfidence: boolean;
  askCause: boolean;
  fontSize: "small" | "normal" | "large" | "xl";
  accents: Accent[];
  exams: ExamId[];
  target: "C1" | "C2";
  notif: NotifSettings;
  haptics: boolean;
  onboarded: boolean;
  field: string;                // campo de investigación (para personalizar)
  researchTopic: string;
}

export const DEFAULT_SETTINGS: Settings = {
  name: "Sheshi",
  lang: "es",
  difficulty: "normal",
  skip: { reading: false, listening: false, speaking: false, writing: false, pronunciation: true },
  vol: { music: 0, fx: 0.45, voice: 1, notif: 0.5 },
  spicy: true,
  sarcasm: "full",
  owlColor: "crimson",
  owlAccessory: "none",
  showStreak: true,
  askConfidence: false,
  askCause: true,
  fontSize: "normal",
  accents: ["en-US", "en-GB", "en-AU"],
  exams: ["toefl", "cae", "cpe", "ielts"],
  target: "C2",
  notif: DEFAULT_NOTIF,
  haptics: true,
  onboarded: false,
  field: "Linguistics (phonology)",
  researchTopic: "the phonology of Guarijío (Uto-Aztecan, Sonora)",
};

export interface Lock { dictionary: boolean; transcript: boolean; professor: boolean; reason?: string }
const NO_LOCK: Lock = { dictionary: false, transcript: false, professor: false };

interface Ctx {
  ready: boolean;
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  model: Model;
  modelVersion: number;
  profile: Profile;
  record: (a: AttemptInput) => Promise<{ attempt: Attempt; xp: number }>;
  addXp: (xp: number, counters?: Record<string, number>) => void;
  bump: (counter: string, n?: number) => void;
  owl: { line: OwlLine; key: number } | null;
  say: (ev: OwlEvent) => OwlLine;
  toast: (msg: string) => void;
  toastMsg: string | null;
  lock: Lock;
  setLock: (l: Partial<Lock> | null) => void;
  dictWord: { word: string; ctx?: string; source?: string } | null;
  openDict: (word: string, ctx?: string, source?: string) => void;
  closeDict: () => void;
  tr: (es: string, en: string) => string;
  refreshModel: () => void;
  levelUp: number | null;
  clearLevelUp: () => void;
  newAch: string[];
  clearAch: () => void;
}

const C = createContext<Ctx>(null as any);
export const useApp = () => useContext(C);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const modelRef = useRef<Model>(emptyModel());
  const [modelVersion, setMV] = useState(0);
  const [profile, setProfile] = useState<Profile>(emptyProfile());
  const profileRef = useRef(profile);
  const [owl, setOwl] = useState<{ line: OwlLine; key: number } | null>(null);
  const [toastMsg, setToast] = useState<string | null>(null);
  const [lock, setLockS] = useState<Lock>(NO_LOCK);
  const [dictWord, setDictWord] = useState<Ctx["dictWord"]>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [newAch, setNewAch] = useState<string[]>([]);
  const saveTimer = useRef<any>(null);
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    (async () => {
      const s = await db.kvGet<Settings>("settings", DEFAULT_SETTINGS);
      const merged = { ...DEFAULT_SETTINGS, ...s, skip: { ...DEFAULT_SETTINGS.skip, ...(s.skip || {}) }, vol: { ...DEFAULT_SETTINGS.vol, ...(s.vol || {}) }, notif: { ...DEFAULT_NOTIF, ...(s.notif || {}) } };
      setS(merged);
      modelRef.current = await loadModel();
      let p = await db.kvGet<Profile>("profile", emptyProfile());
      p = { ...emptyProfile(), ...p, counters: { ...(p.counters || {}) } };
      if (p.lastActive && Date.now() - p.lastActive > 7 * 86400000) p.counters.comeback = (p.counters.comeback || 0) + 1;
      p = ensureDaily(ensureQuests(p));
      profileRef.current = p;
      setProfile(p);
      await loadAi();
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    setVolumes({ fx: settings.vol.fx, music: settings.vol.music });
    setVoiceVolume(settings.vol.voice);
    const root = document.documentElement;
    root.classList.remove("fs-small", "fs-large", "fs-xl");
    if (settings.fontSize !== "normal") root.classList.add("fs-" + settings.fontSize);
    root.lang = settings.lang;
  }, [settings]);

  const setSettings = useCallback((p: Partial<Settings>) => {
    setS((prev) => { const n = { ...prev, ...p }; db.kvSet("settings", n); return n; });
  }, []);

  const persistProfile = useCallback((p: Profile) => {
    profileRef.current = p;
    setProfile(p);
    db.kvSet("profile", p);
  }, []);

  const checkAchievements = useCallback((p: Profile): Profile => {
    const got: string[] = [];
    for (const a of ACHIEVEMENTS) if (!p.achievements[a.id] && a.test(p)) { p.achievements[a.id] = Date.now(); got.push(a.id); }
    if (got.length) setNewAch((x) => [...x, ...got]);
    return p;
  }, []);

  const touchDay = (p: Profile) => {
    const d = dayKey();
    if (!p.days.includes(d)) p.days = [...p.days, d];
    const h = new Date().getHours();
    if (h >= 23) p.counters.night = (p.counters.night || 0) + 1;
    if (h < 7 && h >= 4) p.counters.early = (p.counters.early || 0) + 1;
    p.lastActive = Date.now();
  };

  const addXp = useCallback((xp: number, counters?: Record<string, number>) => {
    const p: Profile = { ...profileRef.current, counters: { ...profileRef.current.counters } };
    const before = levelFromXp(p.xp).level;
    p.xp += Math.round(xp);
    if (xp > 0) { try { window.dispatchEvent(new CustomEvent("fx:xp", { detail: Math.round(xp) })); } catch {} }
    for (const [k, v] of Object.entries(counters || {})) p.counters[k] = (p.counters[k] || 0) + v;
    touchDay(p);
    const after = levelFromXp(p.xp).level;
    if (after > before) { setLevelUp(after); sfx.level(); }
    // reto diario
    if (p.daily.ch && !p.daily.done) {
      const ch = p.daily.ch;
      if ((p.counters[ch.counter] || 0) - ch.start >= ch.target) { p.daily = { ...p.daily, done: true }; p.xp += ch.xp; }
    }
    persistProfile(checkAchievements(p));
  }, [persistProfile, checkAchievements]);

  const bump = useCallback((counter: string, n = 1) => addXp(0, { [counter]: n }), [addXp]);

  const say = useCallback((ev: OwlEvent) => {
    const line = owlLine(ev, { name: settings.name, spicy: settings.spicy });
    setOwl({ line, key: Date.now() });
    return line;
  }, [settings.name, settings.spicy]);

  const record = useCallback(async (a: AttemptInput) => {
    const m = modelRef.current;
    const attempt = applyAttempt(m, a);
    await db.put("attempts", attempt);
    setMV((v) => v + 1);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { saveModel(m); snapshot(m); }, 800);
    const d = diff(settings.difficulty);
    const x = a.score ?? (a.correct ? 1 : 0);
    const base = a.produce ? 25 : 10;
    const xp = Math.round((x >= 0.6 ? base : 3) * d.xp * (a.lvl >= 72 ? 1.3 : 1));
    const p: Profile = { ...profileRef.current, counters: { ...profileRef.current.counters } };
    p.items++; if (x >= 0.6) p.correct++;
    for (const t of a.tags) {
      if (t === "rd:inference" || t === "ls:inference") p.counters.inference = (p.counters.inference || 0) + 1;
      if (t === "acad:hedging") p.counters.hedging = (p.counters.hedging || 0) + 1;
      if (t === "uoe:kwt") p.counters.kwt = (p.counters.kwt || 0) + 1;
    }
    profileRef.current = p;
    addXp(xp);
    if (settings.haptics) vibrate(x >= 0.6 ? 10 : 30);
    return { attempt, xp };
  }, [settings.difficulty, settings.haptics, addXp]);

  const toast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600); }, []);
  const setLock = useCallback((l: Partial<Lock> | null) => setLockS(l ? { ...NO_LOCK, ...l } : NO_LOCK), []);
  const openDict = useCallback((word: string, ctx?: string, source?: string) => setDictWord({ word, ctx, source }), []);
  const closeDict = useCallback(() => setDictWord(null), []);
  const tr = useCallback((es: string, en: string) => (settings.lang === "en" ? en : es), [settings.lang]);
  const refreshModel = useCallback(() => setMV((v) => v + 1), []);

  const value = useMemo<Ctx>(() => ({
    ready, settings, setSettings, model: modelRef.current, modelVersion, profile, record, addXp, bump, owl, say, toast, toastMsg,
    lock, setLock, dictWord, openDict, closeDict, tr, refreshModel, levelUp, clearLevelUp: () => setLevelUp(null), newAch, clearAch: () => setNewAch([]),
  }), [ready, settings, setSettings, modelVersion, profile, record, addXp, bump, owl, say, toast, toastMsg, lock, setLock, dictWord, openDict, closeDict, tr, refreshModel, levelUp, newAch]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export async function persistModelNow(m: Model) { await saveModel(m); await snapshot(m); }
