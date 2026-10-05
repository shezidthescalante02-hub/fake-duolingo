#!/usr/bin/env python3
"""Genera bancos compactos para ejercicios infinitos a partir del diccionario offline.

public/gen/stress.json : palabras con acento primario inequívoco (US y GB coinciden)
public/gen/defs.json   : palabras de frecuencia media-baja con una definición clara (primer sentido de WordNet)

Uso: python3 scripts/build_gen.py   (requiere public/dict/*.json ya generado)
"""
import json, glob, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DICT = os.path.join(ROOT, "public", "dict")
OUT = os.path.join(ROOT, "public", "gen")
os.makedirs(OUT, exist_ok=True)

V = re.compile(r"(aɪ|aʊ|ɔɪ|eɪ|oʊ|əʊ|eə|ɪə|ʊə|iː|uː|ɑː|ɔː|ɜː|i|ɪ|e|ɛ|æ|ʌ|ɑ|ɒ|ɔ|ʊ|u|ə|ɚ|ɝ|ɜ|o|a)")


def nuclei(ipa: str) -> int:
    return len(V.findall(ipa.replace("ˈ", "").replace("ˌ", "").replace(".", "")))


def stress_index(ipa: str):
    if ipa.count("ˈ") != 1:
        return None
    before = ipa.split("ˈ")[0]
    return nuclei(before)


def ortho_syll(w: str) -> int:
    g = len(re.findall(r"[aeiouy]+", w))
    if w.endswith("e") and not w.endswith(("ee", "le", "ye")) and g > 1:
        g -= 1
    return g


BAD_DEF = re.compile(r"\b(genus|family|species|city|town|river|county|province|island|state of|capital of|order of|suborder|tribe|surname)\b", re.I)

ALL = set()
for f in glob.glob(os.path.join(DICT, "*.json")):
    if not f.endswith("index.json"):
        ALL |= set(json.load(open(f, encoding="utf-8")).keys())


def inflected(w: str) -> bool:
    cands = []
    if w.endswith("ies"): cands.append(w[:-3] + "y")
    if w.endswith("es"): cands.append(w[:-2])
    if w.endswith("s") and not w.endswith("ss"): cands.append(w[:-1])
    if w.endswith("ed"): cands += [w[:-2], w[:-1], w[:-3]]
    if w.endswith("ing"): cands += [w[:-3], w[:-3] + "e", w[:-4]]
    return any(c in ALL for c in cands if len(c) > 2)


stress, defs = [], []
for f in sorted(glob.glob(os.path.join(DICT, "*.json"))):
    if f.endswith("index.json"):
        continue
    d = json.load(open(f, encoding="utf-8"))
    for w, r in d.items():
        if not isinstance(r, dict) or not w.isalpha() or not w.islower():
            continue
        z = r.get("z")
        if z is None:
            continue
        # ---------------- acento
        u = r.get("u")
        if u and 2.8 <= z <= 4.9 and len(w) >= 6 and "(" not in u and "̩" not in u:
            n = nuclei(u)
            si = stress_index(u)
            poss = {x[0] for x in (r.get("s") or [])}
            shifty = w.startswith(("over", "under", "inter", "out", "up", "down", "after", "counter", "self")) or \
                (("verb" in poss) and len(poss) > 1 and w.startswith(("at", "con", "com", "re", "pre", "pro", "sub", "ob", "de", "per", "ex", "in", "im")))
            BLACK = {"contrary", "cigarette", "magazine", "gasoline", "advertisement", "adult", "romance", "research", "controversy", "laboratory",
                     "harass", "kilometre", "kilometer", "vagary", "detail", "address", "finance", "garage", "decade", "ballet", "frontier", "tremendous",
                     "princess", "margarine", "brochure", "debris", "cafe", "café", "inquiry", "enquiry", "integral", "applicable", "formidable",
                     "despicable", "hospitable", "lamentable", "exquisite", "aristocrat", "aristocracy", "tourniquet", "corollary", "capillary", "ancillary", "medicine"}
            if si is not None and 3 <= n <= 5 and ortho_syll(w) == n and not shifty and "-" not in w and w not in BLACK and not w.endswith("arily"):
                g = r.get("g")
                ok = True
                if g:
                    if "(" in g or stress_index(g) is None or nuclei(g) != n or stress_index(g) != si:
                        ok = False
                if ok:
                    stress.append([w, u, g or "", si, n, z])
        # ---------------- definiciones
        s = r.get("s") or []
        if s and len(s) <= 2 and len({x[0] for x in s}) == 1 and 2.6 <= z <= 3.5 and len(w) >= 5:
            pos, df = s[0][0], s[0][1]
            if pos in ("noun", "verb", "adjective", "adverb") and 18 <= len(df) <= 110 and not BAD_DEF.search(df) \
                    and w[:4] not in df.lower() and not re.search(r"[A-Z]", df) and ";" not in df \
                    and not df.startswith("(") and not inflected(w):
                defs.append([w, pos, df, z])

stress.sort(key=lambda x: -x[5])
defs.sort(key=lambda x: -x[3])
json.dump(stress, open(os.path.join(OUT, "stress.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
json.dump(defs, open(os.path.join(OUT, "defs.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("stress:", len(stress), "defs:", len(defs))
