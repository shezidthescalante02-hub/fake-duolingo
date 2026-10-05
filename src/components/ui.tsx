import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../state";
import { owlSvg, type OwlMood } from "../owl/owlSvg";
import { OWL_COLORS } from "../engine/game";
import { bandProgress } from "../engine/cefr";
import { Icon } from "./Icon";

// ---------------------------------------------------------------- búho
export function Owl({ mood = "smug", size = 80, anim = "bob", talking = false, perch }: { mood?: OwlMood | string; size?: number; anim?: "bob" | "shake" | "hop" | "none" | "idle"; blinkable?: boolean; talking?: boolean; perch?: boolean }) {
  const { settings } = useApp();
  const delay = useMemo(() => (-Math.random() * 5).toFixed(2) + "s", []);
  const showPerch = perch ?? size >= 84;
  const html = useMemo(() => owlSvg({ mood: mood as OwlMood, body: OWL_COLORS[settings.owlColor] || OWL_COLORS.crimson, accessory: settings.owlAccessory, perch: showPerch, still: size < 48 }), [mood, settings.owlColor, settings.owlAccessory, showPerch, size]);
  const [enter, setEnter] = useState(false);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } setEnter(true); const t = setTimeout(() => setEnter(false), 520); return () => clearTimeout(t); }, [mood]);
  const animated = anim !== "none" && size >= 40;
  const cls = ["owl", "mood-" + mood, animated ? "anim" : "", anim === "bob" ? "bob" : anim === "shake" ? "shake" : anim === "hop" ? "hop" : "", talking ? "talking" : "", enter ? "enter" : ""].join(" ");
  return <div className={cls} style={{ width: size, ["--bd" as any]: delay }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function OwlSays({ text, gloss, mood = "smug", size = 74 }: { text: string; gloss?: string; mood?: string; size?: number }) {
  const [talk, setTalk] = useState(true);
  useEffect(() => { setTalk(true); const t = setTimeout(() => setTalk(false), 1600); return () => clearTimeout(t); }, [text]);
  return (
    <div className="owlrow">
      <Owl mood={mood} size={size} talking={talk} anim="idle" />
      <div className="speech grow" key={text}>
        <Md text={text} inline />
        {gloss && <span className="gloss"><Icon name="book" size={14} /> <span>{gloss}</span></span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- mini markdown
function inlineMd(s: string, keyBase = ""): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[\[[^\]]+\]\])/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<b key={keyBase + i++}>{tok.slice(2, -2)}</b>);
    else if (tok.startsWith("`")) out.push(<code key={keyBase + i++}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[[")) out.push(<span key={keyBase + i++} className="tag gold">{tok.slice(2, -2)}</span>);
    else out.push(<em key={keyBase + i++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function Md({ text, inline = false, className = "" }: { text: string; inline?: boolean; className?: string }) {
  if (inline) return <span className={className}>{inlineMd(text)}</span>;
  const lines = text.replace(/\r/g, "").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0, k = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^#{2,4} /.test(l)) { out.push(<h4 key={k++}>{inlineMd(l.replace(/^#{2,4} /, ""))}</h4>); i++; continue; }
    if (/^\s*[-•] /.test(l)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-•] /.test(lines[i])) { items.push(lines[i].replace(/^\s*[-•] /, "")); i++; }
      out.push(<ul key={k++}>{items.map((it, j) => <li key={j}>{inlineMd(it, `${k}-${j}-`)}</li>)}</ul>);
      continue;
    }
    if (/^\s*\d+\. /.test(l)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\. /, "")); i++; }
      out.push(<ol key={k++}>{items.map((it, j) => <li key={j}>{inlineMd(it, `${k}-${j}-`)}</li>)}</ol>);
      continue;
    }
    if (l.startsWith("> ")) {
      const q: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) { q.push(lines[i].slice(2)); i++; }
      out.push(<blockquote key={k++}>{inlineMd(q.join(" "))}</blockquote>);
      continue;
    }
    if (l.trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      out.push(
        <div key={k++} style={{ overflowX: "auto", margin: "0.6em 0" }}>
          <table className="tbl">
            <thead><tr>{rows[0].map((c, j) => <th key={j}>{inlineMd(c)}</th>)}</tr></thead>
            <tbody>{rows.slice(1).map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j}>{inlineMd(c, `${ri}-${j}-`)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,4} |\s*[-•] |\s*\d+\. |> |\s*\|)/.test(lines[i])) { para.push(lines[i]); i++; }
    out.push(<p key={k++}>{para.map((pl, j) => <React.Fragment key={j}>{j > 0 && <br />}{inlineMd(pl, `${k}-${j}-`)}</React.Fragment>)}</p>);
  }
  return <div className={"prose " + className}>{out}</div>;
}

// ---------------------------------------------------------------- texto con palabras tocables
export function Tap({ text, source, className = "", hl }: { text: string; source?: string; className?: string; hl?: string[] }) {
  const { openDict } = useApp();
  const parts = useMemo(() => text.split(/([A-Za-z][A-Za-z'’-]*)/), [text]);
  const hlSet = useMemo(() => new Set((hl || []).map((x) => x.toLowerCase())), [hl]);
  const sentenceOf = (idx: number) => {
    let pos = 0; for (let i = 0; i < idx; i++) pos += parts[i].length;
    const start = Math.max(text.lastIndexOf(".", pos), text.lastIndexOf("?", pos), text.lastIndexOf("!", pos)) + 1;
    const ends = [".", "?", "!"].map((c) => text.indexOf(c, pos)).filter((x) => x >= 0);
    const end = ends.length ? Math.min(...ends) + 1 : text.length;
    return text.slice(start, end).trim();
  };
  return (
    <span className={className}>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className={"w" + (hlSet.has(p.toLowerCase()) ? " hl" : "")} onClick={(e) => { e.stopPropagation(); openDict(p, sentenceOf(i), source); }}>{p}</span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </span>
  );
}

// ---------------------------------------------------------------- piezas básicas
export function Bar({ pct, kind = "", thin = false }: { pct: number; kind?: "" | "gold" | "green"; thin?: boolean }) {
  return <div className={`bar ${kind} ${thin ? "thin" : ""}`}><i style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>;
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <label className="switch"><input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} /><span /></label>;
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <>
      <div className="sheet-bg" onClick={onClose} />
      <div className="sheet" role="dialog">
        <div className="grab" />
        {children}
      </div>
    </>
  );
}

export function Topbar({ title, back, right }: { title: string; back?: string | boolean; right?: React.ReactNode }) {
  return (
    <div className="topbar">
      {back !== undefined && back !== false && (
        <button className="iconbtn" aria-label="Atrás" onClick={() => (typeof back === "string" ? (location.hash = back) : history.back())}><Icon name="back" size={20} /></button>
      )}
      <h1>{title}</h1>
      {right}
    </div>
  );
}

export function LevelPill({ score, gold = false }: { score: number; gold?: boolean }) {
  const b = bandProgress(score);
  return <span className={"levelpill" + (gold ? " gold" : "")}>{b.band.code}</span>;
}

export function Stat({ v, l }: { v: React.ReactNode; l: string }) {
  return <div className="stat"><div className="v">{v}</div><div className="l">{l}</div></div>;
}

export function DiffBadge({ id }: { id: string }) {
  const names: Record<string, [string, string]> = { chill: ["Chill", "d0"], normal: ["Normal", "d1"], academic: ["Academic Hell", "d2"], toefl: ["TOEFL Hell", "d3"], c2: ["C2 Nightmare", "d4"] };
  const [n, c] = names[id] || names.normal;
  return <span className={`diffbadge ${c}`}>{n}</span>;
}

// ---------------------------------------------------------------- temporizador
export function useCountdown(totalSec: number | null, running: boolean, onEnd?: () => void) {
  const leftRef = useRef(totalSec ?? 0);
  const prevTotal = useRef<number | null>(totalSec);
  const fired = useRef(false);
  const endRef = useRef(onEnd); endRef.current = onEnd;
  const [, force] = useState(0);
  // reinicia de forma síncrona cuando cambia el total (evita disparos instantáneos)
  if (prevTotal.current !== totalSec) { prevTotal.current = totalSec; leftRef.current = totalSec ?? 0; fired.current = false; }
  useEffect(() => {
    if (!running || totalSec === null) return;
    const t0 = Date.now(), start = leftRef.current;
    if (start <= 0) return;
    const iv = setInterval(() => {
      const l = Math.max(0, start - (Date.now() - t0) / 1000);
      leftRef.current = l;
      force((x) => x + 1);
      if (l <= 0 && !fired.current) { fired.current = true; clearInterval(iv); endRef.current?.(); }
    }, 250);
    return () => clearInterval(iv);
    // eslint-disable-next-line
  }, [running, totalSec]);
  return leftRef.current;
}

export function fmtTime(sec: number) {
  const s = Math.max(0, Math.ceil(sec));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(r).padStart(2, "0");
}

export function Timer({ left, total }: { left: number; total: number }) {
  const cls = left <= Math.min(30, total * 0.1) ? "crit" : left <= total * 0.25 ? "warn" : "";
  return <span className={"timer " + cls}><Icon name="clock" size={14} /> {fmtTime(left)}</span>;
}

export function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 0.5, dx: (Math.random() - 0.5) * 160, rot: 360 + Math.random() * 720, color: ["#ecc978", "#b6334a", "#f1e6d4", "#7cba86", "#d2a54b", "#8a1b2c"][i % 6] })), []);
  return <div className="confetti">{pieces.map((p, i) => <i key={i} style={{ left: p.left + "%", animationDelay: p.delay + "s", background: p.color, ["--dx" as any]: p.dx + "px", ["--rot" as any]: p.rot + "deg" }} />)}</div>;
}

export function Empty({ children }: { children: React.ReactNode }) { return <div className="empty">{children}</div>; }

export function pct(a: number, b: number) { return b ? Math.round((a / b) * 100) : 0; }

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function go(hash: string) { location.hash = hash; }

// ---------------------------------------------------------------- anillo de progreso
export function Ring({ pct, size = 96, stroke = 8, children, color }: { pct: number; size?: number; stroke?: number; children?: React.ReactNode; color?: "gold" | "red" | "green" }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => { const t = setTimeout(() => setShown(Math.max(0, Math.min(100, pct))), 60); return () => clearTimeout(t); }, [pct]);
  const id = useMemo(() => "rg" + Math.random().toString(36).slice(2, 7), []);
  const stops = color === "green" ? ["#3f7c4b", "#a6dcae"] : color === "red" ? ["#8a1b2c", "#e2677a"] : ["#9c711d", "#f7e3b0"];
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={stops[0]} /><stop offset="100%" stopColor={stops[1]} /></linearGradient></defs>
        <circle className="ring-bg" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)} style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,.9,.3,1)" }} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

export function CountUp({ to, ms = 900, suffix = "" }: { to: number; ms?: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="count-up">{v}{suffix}</span>;
}

export function XpFloat() {
  const [items, setItems] = useState<{ id: number; xp: number }[]>([]);
  useEffect(() => {
    const f = (e: any) => { const id = Date.now() + Math.random(); setItems((a) => [...a.slice(-2), { id, xp: e.detail }]); setTimeout(() => setItems((a) => a.filter((x) => x.id !== id)), 1200); };
    window.addEventListener("fx:xp", f);
    return () => window.removeEventListener("fx:xp", f);
  }, []);
  return <>{items.map((x) => <div key={x.id} className="xp-float">+{x.xp} XP</div>)}</>;
}
