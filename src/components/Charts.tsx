import React from "react";
import { BANDS } from "../engine/cefr";

// Gráfica de líneas simple en SVG (evolución histórica)
export function LineChart({ series, height = 180, yMin = 30, yMax = 95, bands = true }: { series: { name: string; color: string; points: { x: string; y: number }[] }[]; height?: number; yMin?: number; yMax?: number; bands?: boolean }) {
  const W = 600, H = height, pl = 34, pr = 10, pt = 10, pb = 22;
  const xs = Array.from(new Set(series.flatMap((s) => s.points.map((p) => p.x)))).sort();
  if (xs.length === 0) return <div className="empty small">Aún no hay historial. Estudia unos días y aquí verás tu evolución.</div>;
  const X = (x: string) => pl + (xs.length === 1 ? (W - pl - pr) / 2 : (xs.indexOf(x) / (xs.length - 1)) * (W - pl - pr));
  const Y = (y: number) => pt + (1 - (y - yMin) / (yMax - yMin)) * (H - pt - pb);
  const gridBands = BANDS.filter((b) => b.min >= yMin && b.min <= yMax && /^(B2|C1|C2)$/.test(b.code));
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img">
      {bands && gridBands.map((b) => (
        <g key={b.code}>
          <line x1={pl} x2={W - pr} y1={Y(b.min)} y2={Y(b.min)} stroke="var(--line)" strokeDasharray="3 4" />
          <text x={4} y={Y(b.min) + 3}>{b.code}</text>
        </g>
      ))}
      {series.map((s) => {
        const pts = s.points.filter((p) => xs.includes(p.x));
        const d = pts.map((p, i) => `${i ? "L" : "M"}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(" ");
        return (
          <g key={s.name}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => <circle key={i} cx={X(p.x)} cy={Y(p.y)} r={pts.length < 20 ? 3 : 1.6} fill={s.color} />)}
          </g>
        );
      })}
      {xs.length > 1 && [xs[0], xs[xs.length - 1]].map((x, i) => <text key={i} x={X(x)} y={H - 6} textAnchor={i ? "end" : "start"}>{x.slice(5)}</text>)}
    </svg>
  );
}

// Radar de habilidades
export function Radar({ data, size = 300 }: { data: { label: string; value: number }[]; size?: number }) {
  const n = data.length, c = size / 2, r = size / 2 - 46;
  const ang = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const pt = (i: number, v: number) => { const k = (Math.max(30, Math.min(95, v)) - 30) / 65; return [c + Math.cos(ang(i)) * r * k, c + Math.sin(ang(i)) * r * k]; };
  const rings = [43, 55, 66, 78, 92];
  return (
    <svg className="chart" viewBox={`-50 -6 ${size + 100} ${size + 12}`} style={{ maxWidth: 420, margin: "0 auto" }}>
      {rings.map((v) => <polygon key={v} points={data.map((_, i) => pt(i, v).join(",")).join(" ")} fill="none" stroke="var(--line)" />)}
      {data.map((_, i) => <line key={i} x1={c} y1={c} x2={pt(i, 95)[0]} y2={pt(i, 95)[1]} stroke="var(--line)" />)}
      <polygon points={data.map((d, i) => pt(i, d.value).join(",")).join(" ")} fill="rgba(168,43,61,.35)" stroke="var(--primary3)" strokeWidth={2} />
      {data.map((d, i) => {
        const [x, y] = pt(i, 108);
        return <text key={i} x={x} y={y} textAnchor={Math.abs(x - c) < 10 ? "middle" : x > c ? "start" : "end"} style={{ fontSize: 10, fill: "var(--text2)" }}>{d.label}</text>;
      })}
      {["B2", "C1", "C2"].map((t, i) => <text key={t} x={c + 3} y={pt(0, [43, 55, 78][i])[1] - 2} style={{ fontSize: 8 }}>{t}</text>)}
    </svg>
  );
}

export function Donut({ pct, label, size = 90, color = "var(--primary3)" }: { pct: number; label?: string; size?: number; color?: string }) {
  const r = size / 2 - 7, C = 2 * Math.PI * r;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface3)" strokeWidth={8} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={8} fill="none" strokeDasharray={`${(C * Math.max(0, Math.min(100, pct))) / 100} ${C}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="round" />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" style={{ fill: "var(--text)", fontSize: size / 5, fontWeight: 700 }}>{label ?? Math.round(pct) + "%"}</text>
    </svg>
  );
}

export function Heat({ days }: { days: string[] }) {
  const set = new Set(days);
  const cells: { d: string; on: boolean }[] = [];
  const now = new Date();
  for (let i = 83; i >= 0; i--) { const x = new Date(now); x.setDate(now.getDate() - i); const k = new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 10); cells.push({ d: k, on: set.has(k) }); }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(21, 1fr)", gap: 3 }}>
      {cells.map((c) => <div key={c.d} title={c.d} style={{ aspectRatio: "1", borderRadius: 3, background: c.on ? "var(--primary3)" : "var(--surface3)" }} />)}
    </div>
  );
}
