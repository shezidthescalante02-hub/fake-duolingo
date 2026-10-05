import type { Item, KWTItem, CTestItem } from "../content/types";

export function norm(s: string): string {
  return (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[.,;:!?]+$/g, "").replace(/\s+/g, " ").trim();
}

export function lev(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

export interface EvalResult { correct: boolean; score: number; note?: string; detail?: any }

// Partes de un C-test: "{ana|lysis}" -> visible "ana", faltante "lysis"
export function parseCTest(text: string) {
  const parts: ({ t: "text"; v: string } | { t: "gap"; vis: string; miss: string; idx: number })[] = [];
  const re = /\{([^|}]*)\|([^}]*)\}/g;
  let last = 0, m: RegExpExecArray | null, idx = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ t: "text", v: text.slice(last, m.index) });
    parts.push({ t: "gap", vis: m[1], miss: m[2], idx: idx++ });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ t: "text", v: text.slice(last) });
  return parts;
}

export function evaluate(item: Item, resp: any): EvalResult {
  switch (item.kind) {
    case "mcq": return { correct: resp === item.answer, score: resp === item.answer ? 1 : 0 };
    case "tf": return { correct: resp === item.answer, score: resp === item.answer ? 1 : 0 };
    case "gap":
    case "wf": {
      const r = norm(resp);
      const ok = item.answers.some((a) => norm(a) === r);
      const close = !ok && item.answers.some((a) => lev(norm(a), r) <= 1 && r.length > 3);
      return { correct: ok, score: ok ? 1 : 0, note: close ? "Muy cerca: revisa la ortografía. En el examen, la ortografía cuenta." : undefined };
    }
    case "kwt": return evalKwt(item, resp);
    case "judge": {
      const g = resp?.g === item.grammatical, a = resp?.a === item.appropriate;
      return { correct: g && a, score: (g ? 0.5 : 0) + (a ? 0.5 : 0), detail: { g, a } };
    }
    case "order": {
      const got = (resp || []).map((r: any) => (typeof r === "string" ? r : r.t));
      const ok = norm(got.join(" ")) === norm(item.tokens.join(" "));
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case "spot": {
      const ok = resp?.idx === item.wrong;
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case "ctest": {
      const gaps = parseCTest(item.text).filter((p) => p.t === "gap") as any[];
      const res = gaps.map((g) => norm(resp?.[g.idx] || "") === norm(g.miss));
      const n = res.filter(Boolean).length;
      return { correct: n / gaps.length >= 0.8, score: n / gaps.length, detail: res };
    }
    case "match": {
      const errs = resp?.errors ?? 0;
      const n = item.pairs.length;
      return { correct: !!resp?.done && errs <= 1, score: resp?.done ? Math.max(0, 1 - errs / n) : 0, note: errs ? `${errs} ${errs === 1 ? "intento fallido" : "intentos fallidos"} antes de completar.` : undefined };
    }
    case "sort": {
      const res = item.entries.map(([, c], i) => resp?.[i] === c);
      const n = res.filter(Boolean).length;
      return { correct: n === res.length, score: n / res.length, detail: res };
    }
    case "odd": return { correct: resp === item.answer, score: resp === item.answer ? 1 : 0 };
    case "fix": {
      const found = !!resp?.found;
      const ok = found && item.answers.some((a) => norm(a) === norm(resp?.text || ""));
      const close = found && !ok && item.answers.some((a) => lev(norm(a), norm(resp?.text || "")) <= 1);
      return { correct: ok, score: (found ? 0.5 : 0) + (ok ? 0.5 : 0), note: !found ? "El error estaba en otra parte." : close ? "Muy cerca: revisa la ortografía." : undefined };
    }
    case "dictation": {
      const d = dictationDiff(item.text, resp || "");
      return { correct: d.acc >= 0.95, score: Math.round(d.acc * 100) / 100, detail: d };
    }
    case "stress": return { correct: resp === item.answer, score: resp === item.answer ? 1 : 0 };
    case "recall": {
      const r = norm(resp);
      const ok = item.answers.some((a) => norm(a) === r);
      const close = !ok && item.answers.some((a) => lev(norm(a), r) <= 1 && r.length > 3);
      return { correct: ok, score: ok ? 1 : 0, note: close ? "Muy cerca: revisa la ortografía." : undefined };
    }
    case "produce": {
      const s = typeof resp?.score === "number" ? resp.score : 0.6;
      return { correct: s >= 0.6, score: s };
    }
  }
  return { correct: false, score: 0 };
}

function evalKwt(item: KWTItem, resp: string): EvalResult {
  const r = norm(resp);
  const words = r ? r.split(" ").filter(Boolean) : [];
  const key = item.key.toLowerCase();
  const hasKey = words.some((w) => w.replace(/[^a-z']/g, "") === key) || r.includes(key);
  const min = item.minWords ?? 2, max = item.maxWords ?? 6;
  const ok = item.answers.some((a) => norm(a) === r);
  let note: string | undefined;
  if (!hasKey) note = `Debes usar la palabra clave "${item.key}" sin cambiarla.`;
  else if (words.length < min || words.length > max) note = `Usa entre ${min} y ${max} palabras (incluida la palabra clave). Las contracciones cuentan como dos palabras.`;
  if (!ok && hasKey) {
    const close = item.answers.some((a) => lev(norm(a), r) <= 2);
    if (close) note = (note ? note + " " : "") + "Muy cerca: revisa ortografía/forma exacta.";
  }
  // una respuesta aceptada explícitamente siempre es correcta (p. ej. "cannot" para CAN'T)
  return { correct: ok, score: ok ? 1 : 0, note: ok ? undefined : note };
}


// ---------------------------------------------------------------- dictado: alineación palabra a palabra
export function dictTokens(s: string): string[] {
  return (s || "").toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9'\s-]/g, " ").replace(/-/g, " ").split(/\s+/).filter(Boolean);
}
export interface DictDiff { acc: number; ops: { t: string; got?: string; st: "ok" | "sub" | "miss" | "extra" }[] }
export function dictationDiff(target: string, got: string): DictDiff {
  const a = dictTokens(target), b = dictTokens(got);
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  const same = (x: string, y: string) => x === y || (x.length > 5 && lev(x, y) <= 1);
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (same(a[i - 1], b[j - 1]) ? 0 : 1));
  const ops: DictDiff["ops"] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (same(a[i - 1], b[j - 1]) ? 0 : 1)) {
      ops.unshift({ t: a[i - 1], got: b[j - 1], st: same(a[i - 1], b[j - 1]) ? "ok" : "sub" }); i--; j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { ops.unshift({ t: a[i - 1], st: "miss" }); i--; }
    else { ops.unshift({ t: b[j - 1], st: "extra" }); j--; }
  }
  const acc = m ? Math.max(0, 1 - d[m][n] / m) : 0;
  return { acc, ops };
}
