#!/usr/bin/env python3
"""
Construye el diccionario offline de Fake Duolingo a partir de fuentes abiertas:

  * Open English WordNet (CC BY 4.0, derivado de Princeton WordNet)
      https://github.com/globalwordnet/english-wordnet
      -> definiciones, ejemplos, sinónimos, antónimos, familia léxica, IPA GB/US
  * CMU Pronouncing Dictionary (licencia BSD)
      https://github.com/cmusphinx/cmudict
      -> IPA (inglés estadounidense) cuando OEWN no trae pronunciación
  * wordfreq (datos CC BY-SA 4.0)
      https://github.com/rspeer/wordfreq
      -> frecuencia Zipf (1 = rarísima, 7 = muy común)

Uso:
  python3 scripts/build_dictionary.py <dir_oewn> <dir_cmudict> <dir_wordfreq> public/dict

Salida: public/dict/<letra>.json (un archivo por letra inicial) + index.json
"""
import gzip, json, os, re, sys
from collections import defaultdict

import yaml
Loader = getattr(yaml, "CSafeLoader", yaml.SafeLoader)

OEWN, CMU, WF, OUT = sys.argv[1:5]
# Opcionales: CILI + OMW (equivalentes en español del Multilingual Central Repository, CC BY 3.0)
CILI = sys.argv[5] if len(sys.argv) > 5 else None
OMW = sys.argv[6] if len(sys.argv) > 6 else None

# ---------------------------------------------------------------- msgpack mini
def mp_decode(buf):
    pos = 0
    def rd():
        nonlocal pos
        b = buf[pos]; pos += 1
        if b <= 0x7f: return b
        if 0x80 <= b <= 0x8f: return {rd(): rd() for _ in range(b & 0x0f)}
        if 0x90 <= b <= 0x9f: return [rd() for _ in range(b & 0x0f)]
        if 0xa0 <= b <= 0xbf:
            n = b & 0x1f; s = buf[pos:pos+n].decode("utf-8"); pos += n; return s
        if b == 0xc0: return None
        if b == 0xc2: return False
        if b == 0xc3: return True
        if b in (0xd9, 0xda, 0xdb):
            ln = {0xd9: 1, 0xda: 2, 0xdb: 4}[b]
            n = int.from_bytes(buf[pos:pos+ln], "big"); pos += ln
            s = buf[pos:pos+n].decode("utf-8"); pos += n; return s
        if b in (0xdc, 0xdd):
            ln = 2 if b == 0xdc else 4
            n = int.from_bytes(buf[pos:pos+ln], "big"); pos += ln
            return [rd() for _ in range(n)]
        if b in (0xde, 0xdf):
            ln = 2 if b == 0xde else 4
            n = int.from_bytes(buf[pos:pos+ln], "big"); pos += ln
            return {rd(): rd() for _ in range(n)}
        if b in (0xcc, 0xcd, 0xce, 0xcf):
            ln = {0xcc: 1, 0xcd: 2, 0xce: 4, 0xcf: 8}[b]
            v = int.from_bytes(buf[pos:pos+ln], "big"); pos += ln; return v
        if b >= 0xe0: return b - 0x100
        raise ValueError(hex(b))
    return rd()

print("frecuencias…")
raw = gzip.open(os.path.join(WF, "wordfreq/data/large_en.msgpack.gz")).read()
data = mp_decode(raw)
zipf = {}
for i, bucket in enumerate(data[1:]):
    for w in bucket:
        if w not in zipf:
            zipf[w] = round(9 - i / 100, 2)
print("  palabras con frecuencia:", len(zipf))

# ---------------------------------------------------------------- CMU -> IPA
ARPA = {
 "AA":"ɑ","AE":"æ","AH":"ʌ","AO":"ɔ","AW":"aʊ","AY":"aɪ","EH":"ɛ","ER":"ɝ","EY":"eɪ",
 "IH":"ɪ","IY":"i","OW":"oʊ","OY":"ɔɪ","UH":"ʊ","UW":"u",
 "B":"b","CH":"tʃ","D":"d","DH":"ð","F":"f","G":"ɡ","HH":"h","JH":"dʒ","K":"k","L":"l",
 "M":"m","N":"n","NG":"ŋ","P":"p","R":"ɹ","S":"s","SH":"ʃ","T":"t","TH":"θ","V":"v",
 "W":"w","Y":"j","Z":"z","ZH":"ʒ",
}
VOW = {"AA","AE","AH","AO","AW","AY","EH","ER","EY","IH","IY","OW","OY","UH","UW"}
# Ataques silábicos legales en inglés (para colocar la marca de acento: principio de ataque máximo)
ONSETS = set(x.split() and tuple(x.split()) for x in """
P;B;T;D;K;G;F;V;TH;DH;S;Z;SH;ZH;HH;CH;JH;M;N;L;R;W;Y
P L;P R;P Y;B L;B R;B Y;T R;T W;D R;D W;K L;K R;K W;K Y;G L;G R;G W;F L;F R;F Y;TH R;TH W;SH R;S P;S T;S K;S M;S N;S L;S W;S F;V Y;M Y;N Y;HH Y;HH W
S P L;S P R;S T R;S K L;S K R;S K W;S P Y;S K Y
""".replace("\n", ";").split(";") if x.strip())

def cmu_to_ipa(phones):
    syl_nuclei = [i for i, p in enumerate(phones) if p[:2] in VOW or p[:-1] in VOW]
    base = [re.sub(r"\d", "", p) for p in phones]
    stress = {}
    for idx in syl_nuclei:
        s = phones[idx][-1]
        if s in "12" and len(syl_nuclei) > 1:
            # buscar inicio de sílaba con ataque máximo legal
            j = idx
            prev_nuc = max([n for n in syl_nuclei if n < idx], default=-1)
            k = idx
            while k - 1 > prev_nuc and tuple(base[k-1:idx]) in ONSETS:
                k -= 1
            stress[k] = "ˈ" if s == "1" else "ˌ"
    out = []
    for i, p in enumerate(base):
        if i in stress: out.append(stress[i])
        sym = ARPA.get(p, "")
        if p == "AH" and phones[i].endswith("0"): sym = "ə"
        if p == "ER" and phones[i].endswith("0"): sym = "ɚ"
        out.append(sym)
    return "".join(out)

print("CMU…")
cmu = {}
with open(os.path.join(CMU, "cmudict.dict"), encoding="utf-8") as f:
    for line in f:
        line = line.split("#")[0].strip()
        if not line: continue
        w, *ph = line.split()
        if "(" in w: continue
        cmu[w] = cmu_to_ipa(ph)

# ---------------------------------------------------------------- OEWN
print("OEWN synsets…")
ydir = os.path.join(OEWN, "src/yaml")
synsets = {}
for fn in sorted(os.listdir(ydir)):
    if fn.startswith(("noun.", "verb.", "adj.", "adv.")):
        with open(os.path.join(ydir, fn), encoding="utf-8") as f:
            synsets.update(yaml.load(f, Loader=Loader))
print("  synsets:", len(synsets))

def key2lemma(k):
    return k.split("%")[0].replace("_", " ")

spa_by_ili = defaultdict(list)
if CILI and OMW:
    print("español (MCR)…")
    ili2pwn = {}
    for line in open(os.path.join(CILI, "ili-map-pwn30.tab"), encoding="utf-8"):
        a, b = line.strip().split("\t")
        ili2pwn[a] = b.replace("-s", "-a")
    pwn2spa = defaultdict(list)
    for line in open(os.path.join(OMW, "wns/mcr/wn-data-spa.tab"), encoding="utf-8"):
        if line.startswith("#"): continue
        parts = line.rstrip("\n").split("\t")
        if len(parts) == 3 and parts[1] == "spa:lemma":
            pwn2spa[parts[0]].append(parts[2].replace("_", " "))
    for ili, off in ili2pwn.items():
        if off in pwn2spa: spa_by_ili[ili] = pwn2spa[off]

POS = {"n": "noun", "v": "verb", "a": "adjective", "s": "adjective", "r": "adverb"}

entries = {}
print("OEWN entries…")
for fn in sorted(os.listdir(ydir)):
    if not fn.startswith("entries-"): continue
    with open(os.path.join(ydir, fn), encoding="utf-8") as f:
        ent = yaml.load(f, Loader=Loader)
    for lemma, byPos in ent.items():
        # nombres propios fuera; frases (phrasal verbs, idioms) dentro
        if not re.fullmatch(r"[a-z][a-z' \-]*", lemma): continue
        e = entries.setdefault(lemma, {"w": lemma, "senses": [], "ipaGB": None, "ipaUS": None,
                                        "syn": [], "ant": [], "fam": [], "es": []})
        for pos, info in byPos.items():
            for pr in info.get("pronunciation", []) or []:
                v = pr.get("value"); var = pr.get("variety")
                if var == "GB" and not e["ipaGB"]: e["ipaGB"] = v
                elif var == "US" and not e["ipaUS"]: e["ipaUS"] = v
                elif not var and not e["ipaUS"]: e["ipaUS"] = v
            for s in info.get("sense", []) or []:
                ss = synsets.get(s["synset"])
                if not ss: continue
                d = (ss.get("definition") or [""])[0]
                ex = [x if isinstance(x, str) else x.get("text", "") for x in (ss.get("example") or [])][:2]
                syn = [m for m in ss.get("members", []) if m != lemma and m.islower()][:5]
                e["senses"].append([POS.get(pos, pos), d, ex, syn])
                for t in spa_by_ili.get(ss.get("ili", ""), [])[:3]:
                    if t not in e["es"] and len(e["es"]) < 6: e["es"].append(t)
                for m in syn:
                    if m not in e["syn"]: e["syn"].append(m)
                for k in s.get("antonym", []) or []:
                    a = key2lemma(k)
                    if a not in e["ant"]: e["ant"].append(a)
                for k in (s.get("derivation", []) or []) + (s.get("pertainym", []) or []):
                    a = key2lemma(k)
                    if a != lemma and a not in e["fam"]: e["fam"].append(a)

print("  lemas:", len(entries))

def cefr_from_zipf(z):
    if z is None: return None
    if z >= 5.5: return "A1-A2"
    if z >= 4.8: return "B1"
    if z >= 4.1: return "B2"
    if z >= 3.4: return "C1"
    return "C2"

shards = defaultdict(dict)
for lemma, e in entries.items():
    if not e["senses"]: continue
    z = zipf.get(lemma)
    multi = " " in lemma
    # Filtro: palabras con frecuencia registrada, o expresiones multipalabra
    if z is None and not multi: continue
    if z is not None and z < 1.8 and not multi: continue
    ipa = e["ipaGB"] or e["ipaUS"]
    rec = {
        "s": e["senses"][:8],
    }
    if e["ipaGB"]: rec["g"] = e["ipaGB"]
    if e["ipaUS"]: rec["u"] = e["ipaUS"]
    if not e["ipaGB"] and not e["ipaUS"] and lemma in cmu: rec["c"] = cmu[lemma]
    if z is not None: rec["z"] = z
    if e["syn"]: rec["y"] = e["syn"][:8]
    if e["ant"]: rec["a"] = e["ant"][:5]
    if e["fam"]: rec["f"] = e["fam"][:8]
    if e["es"]: rec["e"] = e["es"]
    shards[lemma[0]][lemma] = rec

os.makedirs(OUT, exist_ok=True)
index = {}
total = 0
for letter, d in sorted(shards.items()):
    with open(os.path.join(OUT, f"{letter}.json"), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, separators=(",", ":"))
    index[letter] = len(d); total += len(d)

# lista compacta de frecuencias para palabras sin entrada (detección "words I should probably know")
with open(os.path.join(OUT, "index.json"), "w", encoding="utf-8") as f:
    json.dump({"letters": index, "total": total,
               "sources": ["Open English WordNet (CC BY 4.0) / Princeton WordNet",
                           "CMU Pronouncing Dictionary (BSD)",
                           "wordfreq (CC BY-SA 4.0)",
                           "Multilingual Central Repository 3.0 vía OMW (CC BY 3.0) — equivalentes en español"]}, f)
print("entradas:", total)
