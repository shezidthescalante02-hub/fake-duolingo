// Análisis automático (offline) de textos escritos y transcripciones orales.
// No sustituye a una corrección humana o de IA: detecta patrones observables y errores típicos.
import { lookup } from "../services/dictionary";

export interface Issue {
  id: string;
  cat: "grammar" | "collocation" | "register" | "false-friend" | "clarity" | "academic" | "mechanics";
  match: string;
  index: number;
  msg: string;            // qué problema hay
  why: string;            // por qué (explicación lingüística)
  hint: string;           // pista para que lo corrijas tú (no la respuesta completa)
  alt?: string;           // alternativa (se muestra solo después de reintentar)
  soft?: boolean;         // "revisa", no necesariamente error
}

interface Rule { id: string; re: RegExp; cat: Issue["cat"]; msg: string; why: string; hint: string; alt?: string; soft?: boolean }

const RULES: Rule[] = [
  { id: "research-countable", re: /\b(a|one|many|several) researche?s?\b(?! (team|group|project|question|design|assistant|paper|article|interest|area|field|agenda|gap|method|methods|programme|program|grant|council|centre|center|institute|participant|participants|tool|tools))/gi, cat: "grammar", msg: "‘research’ es (casi siempre) incontable.", why: "In standard academic English, research is a mass noun: we say *research*, *a study*, *a piece of research*, or *several studies*.", hint: "¿Puedes usar un sustantivo contable o quitar el artículo?", alt: "a study / several studies / research" },
  { id: "make-research", re: /\b(make|makes|made|making) (a |an |the |some )?research\b/gi, cat: "collocation", msg: "Colocación no idiomática: *make research*.", why: "Research collocates with *do*, *conduct*, *carry out* or *undertake*, not *make* (calco de «hacer una investigación»).", hint: "¿Qué verbo colocan los investigadores con *research*?", alt: "conduct / carry out research" },
  { id: "uncountable-plural", re: /\b(informations|advices|evidences|knowledges|feedbacks|equipments|vocabularies|furnitures|homeworks)\b/gi, cat: "grammar", msg: "Sustantivo incontable en plural.", why: "Nouns such as information, advice, evidence, knowledge, feedback and equipment are uncountable in English and do not take -s.", hint: "Usa la forma singular, o un cuantificador como *pieces of* / *a body of*.", alt: "information / pieces of advice / a body of evidence" },
  { id: "a-uncountable", re: /\b(an?) (information|advice|evidence|equipment|feedback|progress|knowledge)\b/gi, cat: "grammar", msg: "Artículo indefinido con sustantivo incontable.", why: "Uncountable nouns cannot take *a/an*. Use zero article, *some*, or a partitive (*a piece of*, *a body of*).", hint: "¿Necesitas *a*? Prueba sin él o con un partitivo." },
  { id: "explain-me", re: /\bexplain(s|ed|ing)? (me|him|her|us|them|you)\b/gi, cat: "grammar", msg: "*explain* no toma objeto indirecto sin *to*.", why: "Explain is not a ditransitive verb like *tell*: the pattern is *explain something to someone* or *explain to someone what/how…*.", hint: "Reordena: explain + cosa + to + persona.", alt: "explain it to me / explain to them how…" },
  { id: "discuss-about", re: /\b(discuss|discusses|discussed|discussing) about\b/gi, cat: "grammar", msg: "*discuss* es transitivo: no lleva *about*.", why: "Discuss takes a direct object (*discuss the results*). The noun *discussion* can take *about/of*, but the verb cannot.", hint: "Elimina la preposición.", alt: "discuss the findings" },
  { id: "emphasize-on", re: /\b(emphasi[sz]e|emphasi[sz]es|emphasi[sz]ed|emphasi[sz]ing|stress|stresses|stressed) on\b/gi, cat: "grammar", msg: "*emphasise/stress* son transitivos.", why: "The verb takes a direct object (*emphasise the role of…*); the preposition belongs to the noun phrase *place emphasis on*.", hint: "Quita *on* o usa la construcción nominal.", alt: "emphasise X / place emphasis on X" },
  { id: "depend-of", re: /\b(depend|depends|depended|depending|dependent) of\b/gi, cat: "grammar", msg: "Preposición: *depend on*, no *of*.", why: "Calco de «depender de». In English the verb, adjective and noun all select *on* (dependent on, dependence on).", hint: "¿Qué preposición rige *depend*?", alt: "depend on" },
  { id: "consist-on", re: /\bconsist(s|ed|ing)? on\b/gi, cat: "grammar", msg: "*consist on* no existe.", why: "*Consist of* = be composed of; *consist in* = have as its essential feature (formal). *On* is not possible.", hint: "¿Te refieres a ‘estar compuesto de’ o ‘radicar en’?", alt: "consist of / consist in" },
  { id: "despite-of", re: /\bdespite of\b/gi, cat: "grammar", msg: "*despite of* es incorrecto.", why: "Despite is itself a preposition and takes a direct complement; *of* only appears in *in spite of*.", hint: "Elige una de las dos formas correctas.", alt: "despite / in spite of" },
  { id: "in-the-other-hand", re: /\bin the other hand\b/gi, cat: "collocation", msg: "La expresión fija es *on the other hand*.", why: "Fixed connector; the preposition is *on*. Note also that it signals a contrasting perspective, not simply additional information.", hint: "Revisa la preposición.", alt: "on the other hand" },
  { id: "according-with", re: /\baccording with\b/gi, cat: "collocation", msg: "*according with* no es idiomático.", why: "Use *according to* (as reported by / in line with) or *in accordance with* (in conformity with rules).", hint: "¿Qué preposición acompaña a *according*?", alt: "according to / in accordance with" },
  { id: "based-in", re: /\bbased in (the |these |this |our |their |previous )?(data|results|evidence|findings|theory|analysis|literature|idea|ideas|study|studies|assumption|assumptions|principle|principles|model|framework|observations?)\b/gi, cat: "collocation", msg: "Para ‘basado en (datos/teoría)’ se usa *based on*.", why: "*Based in* refers to location (a company based in Mexico). For foundations, evidence or reasoning, English uses *based on*.", hint: "Cambia la preposición.", alt: "based on" },
  { id: "people-is", re: /\bpeople (is|was|has|does)\b/gi, cat: "grammar", msg: "Concordancia: *people* es plural.", why: "*People* (the plural of *person*) requires plural agreement: people are/were/have.", hint: "Ajusta el verbo.", alt: "people are" },
  { id: "double-comparative", re: /\bmore (better|worse|easier|harder|faster|bigger|smaller|larger|higher|lower|stronger|weaker|clearer|simpler)\b/gi, cat: "grammar", msg: "Doble comparativo.", why: "The -er suffix already marks the comparative; *more* duplicates it.", hint: "Elimina *more*.", basic: true } as any,
  { id: "actual-current", re: /\bactual (situation|moment|context|days|times|government|president|state of affairs)\b/gi, cat: "false-friend", msg: "Falso amigo: *actual* ≠ «actual».", why: "*Actual* means real/genuine (as opposed to apparent). For «actual» (present-day) use *current* or *present*.", hint: "¿Quieres decir ‘real’ o ‘del momento presente’?", alt: "current / present" },
  { id: "actually-currently", re: /\bactually,? (in|at) (the )?(present|this moment|these days|today)\b/gi, cat: "false-friend", msg: "Falso amigo: *actually* ≠ «actualmente».", why: "*Actually* means ‘in fact’; «actualmente» is *currently / at present*.", hint: "Busca el adverbio temporal adecuado.", alt: "currently / at present" },
  { id: "assist-to", re: /\bassist(s|ed|ing)? to (the |a |an )?(class|classes|lecture|lectures|conference|conferences|meeting|meetings|seminar|seminars|school|university|event|course|workshop)/gi, cat: "false-friend", msg: "Falso amigo: «asistir a» = *attend*.", why: "*Assist* means help. Being present at an event is *attend* (transitive, no preposition).", hint: "¿Qué verbo significa estar presente en un evento?", alt: "attend the conference" },
  { id: "since-years", re: /\bsince (\d+|many|several|a few|some) (years|months|weeks|days|decades)\b/gi, cat: "grammar", msg: "Duración con *for*, punto de inicio con *since*.", why: "*Since* introduces a point in time (since 2019); a period of time takes *for* (for three years). Calco de «desde hace».", hint: "¿Es un punto en el tiempo o un período?", alt: "for several years" },
  { id: "be-agree", re: /\b(am|is|are|was|were) agree\b/gi, cat: "grammar", msg: "*agree* es un verbo, no un adjetivo.", why: "Spanish «estar de acuerdo» uses a copula; English *agree* is a full lexical verb: *I agree*, *They agreed*.", hint: "Elimina el verbo *be*.", alt: "I agree" },
  { id: "it-exists", re: /\bit exists? (a|an|some|many|several|no)\b/gi, cat: "grammar", msg: "Existencia: usa *there is/are*.", why: "English uses existential *there* for introducing entities; *it exists* is a calque of «existe».", hint: "Reformula con el sujeto existencial.", alt: "there is a / there are several" },
  { id: "how-called", re: /\bhow (it|this|that|they) (is|are|was|were) called\b/gi, cat: "grammar", msg: "Calco de «cómo se llama».", why: "English asks *what something is called*: the name is a nominal complement, so the wh-word is *what*.", hint: "Cambia el pronombre interrogativo.", alt: "what it is called" },
  { id: "in-base-to", re: /\bin base (to|of|on)\b/gi, cat: "collocation", msg: "*in base to* no existe.", why: "Calco de «en base a». English uses *on the basis of* or *based on*.", hint: "Busca la expresión nominal equivalente.", alt: "on the basis of" },
  { id: "could-of", re: /\b(could|would|should|must|might) of\b/gi, cat: "grammar", msg: "*could of* → *could have*.", why: "The weak form /əv/ of *have* sounds like *of*, but the modal perfect is modal + have + past participle.", hint: "¿Qué auxiliar va después del modal?", alt: "could have" },
  { id: "less-count", re: /\bless (people|students|participants|studies|words|errors|mistakes|cases|items|children|speakers|languages|countries|questions)\b/gi, cat: "grammar", msg: "Con contables en plural, *fewer* en registro formal.", why: "Prescriptive and formal usage distinguishes *fewer* (count) from *less* (mass). Exams and academic editors expect *fewer* here.", hint: "¿El sustantivo es contable?", alt: "fewer participants" },
  { id: "amount-count", re: /\b(amount|amounts) of (people|students|participants|studies|countries|speakers|words|cases|languages|errors|books)\b/gi, cat: "collocation", msg: "*amount of* con contables → *number of*.", why: "*Amount* quantifies mass nouns (an amount of time); countable plurals take *number* (a number of participants).", hint: "¿Se puede contar?", alt: "the number of participants" },
  { id: "very-unique", re: /\b(very|really|quite|extremely) (unique|essential|crucial|fundamental|impossible|perfect|unprecedented)\b/gi, cat: "academic", msg: "Adjetivo no graduable intensificado.", why: "Unique, essential, impossible etc. are absolute (non-gradable) in careful academic style; intensifying them sounds informal or imprecise.", hint: "Elimina el intensificador o elige un adjetivo graduable.", soft: true },
  { id: "make-emphasis", re: /\bmake (an? |special )?emphasis\b/gi, cat: "collocation", msg: "*make emphasis* no es idiomático.", why: "Calco de «hacer énfasis». English: *place/put/lay emphasis on* or simply *emphasise*.", hint: "¿Qué verbo colocan con *emphasis*?", alt: "place emphasis on" },
  { id: "realize-study", re: /\b(reali[sz]e|reali[sz]es|reali[sz]ed|reali[sz]ing) (a|an|the|this|our|their) (study|research|survey|analysis|interview|interviews|experiment|project|fieldwork|investigation)\b/gi, cat: "false-friend", msg: "Falso amigo: «realizar» ≠ *realise*.", why: "*Realise* means become aware of something. To carry out a study is *conduct*, *carry out*, *undertake* or *perform*.", hint: "¿Qué verbo significa ‘llevar a cabo’?", alt: "conduct a study" },
  { id: "do-mistake", re: /\b(do|does|did|doing|done) (a |an |many |several |some )?(mistake|mistakes|decision|decisions|progress|an effort|effort|a contribution|contribution|a difference|a suggestion|suggestions)\b/gi, cat: "collocation", msg: "Colocación *make* / *do*.", why: "English collocates *make* with mistakes, decisions, progress, an effort, a contribution, a difference, suggestions.", hint: "¿*make* o *do*?", alt: "make a mistake / make progress" },
  { id: "pay-attention-in", re: /\bpay(s|ed|ing)? (more |less |close |particular |special )?attention (in|on)\b/gi, cat: "collocation", msg: "*pay attention to*.", why: "The fixed pattern is *pay attention to* + NP.", hint: "Revisa la preposición.", alt: "pay attention to" },
  { id: "interested-on", re: /\binterested on\b/gi, cat: "collocation", msg: "*interested in*.", why: "The adjective *interested* selects *in*.", hint: "Revisa la preposición.", alt: "interested in" },
  { id: "allow-to", re: /(?<!\b(?:is|are|was|were|be|been|being|get|got|not|am)\s)\b(allows?|allowed|allowing|permits?|permitted|enables?|enabled|enabling) to (\w+)/gi, cat: "grammar", msg: "*allow/enable/permit* necesitan objeto antes de *to*.", why: "These verbs take the pattern V + object + to-infinitive (*allows researchers to compare*) or V + noun phrase (*allows comparison*); *allow to compare* lacks the object.", hint: "¿Quién es capaz de hacer la acción? Añádelo, o nominaliza.", alt: "allows researchers to compare / allows for comparison" },
  { id: "suggest-to", re: /\bsuggest(s|ed|ing)? (him|her|them|me|us|you) to\b/gi, cat: "grammar", msg: "*suggest someone to do* no es estándar.", why: "Suggest takes a that-clause (often with the mandative subjunctive: *suggest that they revise*) or a gerund (*suggest revising*).", hint: "Usa *that* + cláusula o un gerundio.", alt: "suggest that they revise / suggest revising" },
  { id: "aim-at-inf", re: /\baims? at (analy[sz]e|examine|explore|investigate|study|describe|identify|determine|compare|show|assess|evaluate)\b/gi, cat: "grammar", msg: "*aim at* + forma -ing (o *aim to* + infinitivo).", why: "After the preposition *at*, the verb must be a gerund; alternatively, *aim* takes a to-infinitive directly.", hint: "Elige: *aim to + verbo* o *aim at + -ing*.", alt: "aims to examine / aims at examining" },
  { id: "repeated-word", re: /\b(\w+) \1\b/gi, cat: "mechanics", msg: "Palabra repetida.", why: "A word appears twice in a row — usually a typo.", hint: "Elimina la repetición." },
  { id: "more-and-more", re: /\bmore and more\b/gi, cat: "register", msg: "Expresión poco académica.", why: "*More and more* is common in speech but sounds informal in academic prose.", hint: "¿Hay un adverbio más formal para ‘cada vez más’?", alt: "increasingly", soft: true },
  { id: "nowadays", re: /\bnowadays\b/gi, cat: "register", msg: "*nowadays* suena a ensayo escolar.", why: "Acceptable but overused in student essays; academic writers prefer more precise time references.", hint: "Sé más preciso: ¿desde cuándo? ¿en qué contexto?", alt: "currently / in recent decades / at present", soft: true },
  { id: "a-lot-of", re: /\b(a lot of|lots of|tons of|loads of|plenty of)\b/gi, cat: "register", msg: "Cuantificador informal.", why: "In academic register, quantifiers are expected to be more precise or formal.", hint: "¿Cuánto exactamente? Usa un cuantificador formal o un dato.", alt: "a considerable number of / many / a substantial proportion of", soft: true },
  { id: "vague-thing", re: /\b(things|stuff|something like that|and so on|etc\.?)\b/gi, cat: "academic", msg: "Expresión vaga.", why: "Academic writing values lexical precision: *things* or *etc.* leave the reader to fill in the category.", hint: "Nombra la categoría concreta (factors, variables, features…).", soft: true },
  { id: "contraction", re: /\b(\w+n't|it's|that's|there's|they're|we're|you're|I'm|I've|we've|they've|I'd|it'll|we'll|let's|what's|who's)\b/gi, cat: "register", msg: "Contracción en registro formal.", why: "Formal academic prose normally avoids contractions.", hint: "Escribe la forma completa.", soft: true },
  { id: "informal-words", re: /\b(get|gets|got|gotten|getting|really|pretty much|kind of|sort of|basically|totally|huge|big deal|okay|ok|anyway|guys|kids|super|awesome|stuff)\b/gi, cat: "register", msg: "Palabra informal o vaga.", why: "These words are typical of conversation. In academic writing, a more precise lexical verb or adjective is usually expected (e.g., *get* → obtain, become, receive, reach).", hint: "Busca un equivalente preciso y formal.", soft: true },
  { id: "you-generic", re: /\b(you|your)\b/gi, cat: "register", msg: "*you* genérico.", why: "Academic writing avoids addressing the reader with generic *you*; use impersonal constructions or *one*, *people*, *researchers*.", hint: "¿Puedes despersonalizar la oración?", soft: true },
  { id: "boosters", re: /\b(prove|proves|proved|proven|obviously|clearly shows|undoubtedly|definitely|always|never|everyone|nobody|all people)\b/gi, cat: "academic", msg: "Posible afirmación demasiado fuerte (overclaiming).", why: "Empirical claims are rarely absolute. Strong boosters can make a claim look unsupported unless the evidence is conclusive.", hint: "¿Tu evidencia justifica esta fuerza? Considera matizar (hedging).", soft: true },
  { id: "and-start", re: /(^|[.!?]\s+)(And|But|So|Also),?\s/g, cat: "register", msg: "Oración que empieza con *And/But/So/Also*.", why: "Not ungrammatical, but in formal writing a connector such as *However*, *Therefore* or *In addition* is usually preferred at sentence level.", hint: "Usa un conector formal o une las oraciones.", soft: true },
  { id: "exclamation", re: /!/g, cat: "register", msg: "Signo de exclamación.", why: "Exclamation marks are rare in academic prose; emphasis is achieved lexically or structurally.", hint: "Elimínalo y expresa la fuerza con léxico.", soft: true },
  { id: "data-is", re: /\bdata (is|was|shows|suggests|indicates)\b/gi, cat: "academic", msg: "*data* singular vs. plural.", why: "Both *data is* and *data are* occur; many academic journals and style guides (especially in the sciences) still prefer plural agreement. Be consistent.", hint: "Comprueba la convención de tu campo y sé consistente.", soft: true },
  { id: "in-conclusion-i-think", re: /\bin conclusion,? i (think|believe|feel)\b/gi, cat: "academic", msg: "Conclusión poco asertiva / subjetiva.", why: "A conclusion should synthesise the argument; *I think* adds little and can weaken authority.", hint: "Expresa tu posición como conclusión del argumento.", soft: true },
];

export interface TextStats {
  words: number; sentences: number; paragraphs: number;
  avgSentence: number; sdSentence: number; longSentences: number;
  mattr: number;             // diversidad léxica (TTR móvil, ventana 50)
  nominalRate: number;       // nominalizaciones por 100 palabras
  passiveCount: number;
  hedges: string[]; boosters: string[]; connectors: string[]; reporting: string[];
  firstPerson: number;
  subordination: number;     // subordinantes por oración
  repeated: { w: string; n: number }[];
  rareRatio?: number;        // proporción de palabras de contenido poco frecuentes (Zipf < 4)
}

const STOP = new Set("the a an and or but if of to in on at for with by from as is are was were be been being this that these those it its they them their there here which who whom whose what when where why how not no nor so than then too very can could may might must shall should will would do does did have has had i we you he she our my your his her us me him also into about between through during before after above below over under again further once both each few more most other some such only own same just than into while because although though whereas since unless until whether".split(" "));

const HEDGES = ["may", "might", "could", "appear to", "appears to", "seem to", "seems to", "suggest", "suggests", "indicate", "indicates", "likely", "unlikely", "possibly", "perhaps", "probably", "tend to", "tends to", "arguably", "to some extent", "to a certain extent", "relatively", "in part", "partly", "largely", "generally", "somewhat", "it is possible that", "it is likely that", "presumably", "apparently", "approximately", "in most cases", "in many cases"];
const BOOSTERS = ["clearly", "obviously", "certainly", "definitely", "undoubtedly", "prove", "proves", "always", "never", "of course", "in fact", "indeed", "must"];
const CONNECTORS = ["however", "moreover", "furthermore", "therefore", "consequently", "thus", "hence", "nevertheless", "nonetheless", "in contrast", "by contrast", "conversely", "similarly", "likewise", "in addition", "additionally", "accordingly", "notwithstanding", "on the other hand", "in particular", "for instance", "for example", "that is", "in other words", "as a result", "to illustrate", "overall", "in sum", "taken together", "whereas", "while", "although", "despite", "rather"];
const REPORTING = ["argue", "argues", "argued", "claim", "claims", "claimed", "contend", "contends", "maintain", "maintains", "assert", "asserts", "note", "notes", "noted", "observe", "observes", "observed", "demonstrate", "demonstrates", "demonstrated", "show", "shows", "showed", "report", "reports", "reported", "propose", "proposes", "proposed", "acknowledge", "acknowledges", "concede", "concedes", "posit", "posits", "highlight", "highlights", "emphasise", "emphasize", "emphasises", "emphasizes", "question", "questions", "challenge", "challenges", "suggest", "suggests", "found", "find", "finds"];
const SUBORD = ["because", "although", "though", "whereas", "while", "if", "unless", "since", "when", "which", "who", "whom", "whose", "that", "whether", "so that", "in order to", "despite", "even though", "once", "until", "after", "before", "where"];
const PARTICIPLES = "been|done|made|seen|shown|known|given|taken|written|found|held|thought|brought|taught|told|chosen|drawn|built|sent|left|led|meant|put|set|kept|said|understood|undertaken|overlooked|begun|grown|spoken|broken|considered|regarded".split("|");

export function words(text: string): string[] {
  return (text.toLowerCase().match(/[a-z]+(?:['’-][a-z]+)*/g) || []);
}

export function sentencesOf(text: string): string[] {
  return text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z“"(])/).map((s) => s.trim()).filter((s) => s.length > 1);
}

function countPhrases(low: string, list: string[]): string[] {
  const found: string[] = [];
  for (const h of list) {
    const re = new RegExp(`\\b${h.replace(/ /g, "\\s+")}\\b`, "g");
    const m = low.match(re);
    if (m) for (const _ of m) found.push(h);
  }
  return found;
}

export const INFORMAL_OK_IDS = ["contraction", "you-generic", "informal-words", "and-start", "exclamation", "a-lot-of", "nowadays", "more-and-more", "in-conclusion-i-think", "data-is", "vague-thing"];

export function analyzeText(text: string, academic = true): { stats: TextStats; issues: Issue[] } {
  const w = words(text);
  const sents = sentencesOf(text);
  const lens = sents.map((s) => words(s).length);
  const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0;
  const sd = lens.length ? Math.sqrt(lens.reduce((a, b) => a + (b - avg) ** 2, 0) / lens.length) : 0;
  // MATTR
  const win = Math.min(50, w.length);
  let mattr = 0;
  if (w.length >= 10) {
    let acc = 0, n = 0;
    for (let i = 0; i + win <= w.length; i++) { acc += new Set(w.slice(i, i + win)).size / win; n++; }
    mattr = n ? acc / n : 0;
  }
  const nominal = w.filter((x) => x.length > 6 && /(tion|sion|ment|ness|ity|ance|ence|ism|isation|ization|ure)s?$/.test(x)).length;
  const low = " " + text.toLowerCase().replace(/\s+/g, " ") + " ";
  const passive = (text.match(new RegExp(`\\b(am|is|are|was|were|be|been|being)\\s+(\\w+ly\\s+)?(\\w+ed|${PARTICIPLES.join("|")})\\b`, "gi")) || []).length;
  const freq: Record<string, number> = {};
  for (const x of w) if (!STOP.has(x) && x.length > 3) freq[x] = (freq[x] || 0) + 1;
  const repeated = Object.entries(freq).filter(([, n]) => n >= Math.max(4, w.length / 60)).map(([k, n]) => ({ w: k, n })).sort((a, b) => b.n - a.n).slice(0, 6);
  const subCount = countPhrases(low, SUBORD).length;
  const stats: TextStats = {
    words: w.length,
    sentences: sents.length,
    paragraphs: text.split(/\n\s*\n/).filter((p) => p.trim()).length,
    avgSentence: Math.round(avg * 10) / 10,
    sdSentence: Math.round(sd * 10) / 10,
    longSentences: lens.filter((l) => l > 40).length,
    mattr: Math.round(mattr * 100) / 100,
    nominalRate: w.length ? Math.round((nominal / w.length) * 1000) / 10 : 0,
    passiveCount: passive,
    hedges: countPhrases(low, HEDGES),
    boosters: countPhrases(low, BOOSTERS),
    connectors: countPhrases(low, CONNECTORS),
    reporting: countPhrases(low, REPORTING),
    firstPerson: (text.match(/\b(I|me|my|we|our|us)\b/g) || []).length,
    subordination: sents.length ? Math.round((subCount / sents.length) * 10) / 10 : 0,
    repeated,
  };
  const issues: Issue[] = [];
  for (const r of RULES) {
    r.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    let count = 0;
    if (!academic && INFORMAL_OK_IDS.includes(r.id)) continue;
    while ((m = r.re.exec(text)) && count < 6) {
      if (r.id === "repeated-word" && ["had", "that"].includes(m[1].toLowerCase())) continue;
      issues.push({ id: r.id, cat: r.cat, match: m[0], index: m.index, msg: r.msg, why: r.why, hint: r.hint, alt: r.alt, soft: r.soft });
      count++;
      if (!r.re.global) break;
    }
  }
  return { stats, issues };
}

// Proporción de palabras de contenido poco frecuentes (sofisticación léxica)
export async function lexicalSophistication(text: string): Promise<{ rareRatio: number; rare: string[] }> {
  const uniq = Array.from(new Set(words(text).filter((x) => !STOP.has(x) && x.length > 3)));
  let rare: string[] = [], known = 0;
  for (const u of uniq.slice(0, 220)) {
    const e = await lookup(u);
    if (!e || e.zipf === undefined) continue;
    known++;
    if (e.zipf < 4.0) rare.push(e.word);
  }
  return { rareRatio: known ? rare.length / known : 0, rare };
}

// Estimación automática (0–100) de la calidad formal de un texto académico. Confianza baja.
export function estimateWritingScore(stats: TextStats, issues: Issue[], opts: { minWords: number; rareRatio?: number }) {
  let s = 50;
  const notes: string[] = [];
  const len = stats.words / Math.max(1, opts.minWords);
  if (len < 0.7) { s -= 12; notes.push("Texto bastante más corto de lo pedido."); } else if (len < 1) { s -= 5; notes.push("Algo por debajo de la extensión mínima."); }
  if (stats.mattr >= 0.78) s += 6; else if (stats.mattr >= 0.72) s += 3; else if (stats.mattr < 0.62 && stats.words > 80) { s -= 4; notes.push("Diversidad léxica baja (repeticiones)."); }
  if (opts.rareRatio !== undefined) { if (opts.rareRatio >= 0.3) s += 7; else if (opts.rareRatio >= 0.2) s += 4; else if (opts.rareRatio < 0.1) { s -= 3; notes.push("Vocabulario muy frecuente; poco léxico académico."); } }
  if (stats.avgSentence >= 16 && stats.avgSentence <= 30) s += 4; else if (stats.avgSentence > 35) { s -= 3; notes.push("Oraciones muy largas en promedio."); } else if (stats.avgSentence < 12 && stats.sentences > 3) { s -= 3; notes.push("Oraciones muy cortas: poca complejidad sintáctica."); }
  if (stats.subordination >= 0.9) s += 4;
  if (stats.nominalRate >= 4) s += 3;
  const connVar = new Set(stats.connectors).size;
  if (connVar >= 4) s += 4; else if (connVar <= 1 && stats.sentences > 4) { s -= 3; notes.push("Pocos conectores: la cohesión depende solo del orden."); }
  if (stats.hedges.length >= 2) s += 3;
  if (stats.sdSentence >= 6) s += 2;
  const hard = issues.filter((i) => !i.soft).length;
  const soft = issues.filter((i) => i.soft).length;
  s -= hard * 4 + Math.min(10, soft * 1.2);
  return { score: Math.max(10, Math.min(92, Math.round(s))), notes };
}

// Métricas orales a partir de una transcripción
export function speechMetrics(transcript: string, durationSec: number) {
  const w = words(transcript);
  const fillers = (transcript.toLowerCase().match(/\b(um+|uh+|er+|erm|ah+|like|you know|i mean|sort of|kind of|basically|actually)\b/g) || []);
  const wpm = durationSec > 0 ? Math.round((w.length / durationSec) * 60) : 0;
  const uniq = new Set(w).size;
  const sents = sentencesOf(transcript);
  const complex = countPhrases(" " + transcript.toLowerCase() + " ", SUBORD).length;
  return {
    words: w.length, wpm, fillers: fillers.length, fillerList: fillers,
    ttr: w.length ? Math.round((uniq / w.length) * 100) / 100 : 0,
    complexMarkers: complex,
    connectors: countPhrases(" " + transcript.toLowerCase() + " ", CONNECTORS),
  };
}

// Compara lo que se dijo con un texto objetivo (inteligibilidad para el reconocedor)
export function alignTarget(target: string, said: string) {
  const t = words(target), s = words(said);
  // LCS para alinear
  const dp: number[][] = Array.from({ length: t.length + 1 }, () => Array(s.length + 1).fill(0));
  for (let i = 1; i <= t.length; i++) for (let j = 1; j <= s.length; j++)
    dp[i][j] = t[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const matched = new Set<number>();
  let i = t.length, j = s.length;
  while (i > 0 && j > 0) {
    if (t[i - 1] === s[j - 1]) { matched.add(i - 1); i--; j--; }
    else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j--;
  }
  return { words: t.map((x, k) => ({ w: x, ok: matched.has(k) })), accuracy: t.length ? matched.size / t.length : 0 };
}
