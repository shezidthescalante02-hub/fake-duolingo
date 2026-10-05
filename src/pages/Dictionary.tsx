import React, { useEffect, useState } from "react";
import { useApp } from "../state";
import { Topbar, Empty } from "../components/ui";
import { searchPrefix, lookup } from "../services/dictionary";

export function DictionaryPage({ initial }: { initial: string }) {
  const { tr, openDict, lock } = useApp();
  const [q, setQ] = useState(initial);
  const [res, setRes] = useState<string[]>([]);
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q.trim()) { setRes([]); return; }
      const r = await searchPrefix(q.trim(), 40);
      if (!r.length) { const e = await lookup(q.trim()); setRes(e ? [e.word] : []); } else setRes(r);
    }, 180);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => { setQ(initial); if (initial) setTimeout(() => openDict(initial), 50); }, [initial]);
  return (
    <div>
      <Topbar title={tr("Diccionario", "Dictionary")} back />
      {lock.dictionary ? <Empty>🔒 {tr("Bloqueado durante esta actividad.", "Locked.")}</Empty> : (
        <>
          <input className="input" autoFocus placeholder={tr("Busca una palabra en inglés…", "Search an English word…")} value={q} onChange={(e) => setQ(e.target.value)} autoCapitalize="off" autoCorrect="off" />
          <div className="tiny muted" style={{ margin: "6px 2px" }}>{tr("76 000+ entradas offline (Open English WordNet) con IPA, frecuencia, sinónimos, familia léxica y equivalentes en español.", "Offline dictionary.")}</div>
          {res.map((w) => (
            <button key={w} className="unit" style={{ width: "100%", textAlign: "left" }} onClick={() => openDict(w, undefined, "dictionary")}>
              <span className="serif">{w}</span>
            </button>
          ))}
          {q && !res.length && <Empty>{tr("Sin resultados.", "No results.")}</Empty>}
        </>
      )}
    </div>
  );
}
