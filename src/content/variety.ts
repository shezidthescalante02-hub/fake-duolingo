// Ejercicios de formatos variados: unir parejas, clasificar, intruso, corregir el error, acento de palabra.
// Todo el contenido es original. Cada ítem usa etiquetas existentes para entrar en la práctica por tema.
import type { MatchItem, SortItem, OddItem, FixItem, StressItem, SkillId } from "./types";
import { skillOf } from "./helpers";

const match = (id: string, tag: string, lvl: number, prompt: string, pairs: [string, string][], explain: string, heads?: [string, string], skill?: SkillId): MatchItem =>
  ({ id, kind: "match", skill: skill ?? skillOf(tag), tags: [tag], lvl, prompt, pairs, explain, heads });
const sort = (id: string, tag: string, lvl: number, prompt: string, cats: string[], entries: [string, number][], explain: string, skill?: SkillId): SortItem =>
  ({ id, kind: "sort", skill: skill ?? skillOf(tag), tags: [tag], lvl, prompt, cats, entries, explain });
const odd = (id: string, tag: string, lvl: number, prompt: string, options: string[], answer: number, explain: string, skill?: SkillId): OddItem =>
  ({ id, kind: "odd", skill: skill ?? skillOf(tag), tags: [tag], lvl, prompt, options, answer, explain });
const fix = (id: string, tag: string, lvl: number, sentence: string, wrong: string, answers: string[], explain: string, basic = false, skill?: SkillId): FixItem =>
  ({ id, kind: "fix", skill: skill ?? skillOf(tag), tags: [tag], lvl, sentence, wrong, answers, explain, basic, prompt: "Find the error, tap it, and correct it." });
const stress = (id: string, lvl: number, word: string, syl: number, answer: number, ipa: string, ipaGB: string | undefined, explain: string): StressItem =>
  ({ id, kind: "stress", skill: "pronunciation", tags: ["pron:stress"], lvl, word, syl, answer, ipa, ipaGB, explain, prompt: "Which syllable carries the primary stress?" });

// ------------------------------------------------------------------ unir parejas
export const MATCH_ITEMS: MatchItem[] = [
  match("vm-colloc1", "uoe:collocation", 60, "Match each verb with the noun it collocates with in academic writing.",
    [["draw", "a conclusion"], ["bridge", "the gap"], ["shed", "light on"], ["play", "a role"], ["strike", "a balance"]],
    "These are fixed verb–noun collocations: *draw a conclusion*, *bridge the gap (between X and Y)*, *shed light on*, *play a role (in)*, *strike a balance (between)*. Spanish speakers often say ✗ *make a conclusion* (from *sacar/hacer*) or ✗ *throw light*." , ["Verb", "Noun"]),
  match("vm-colloc2", "uoe:collocation", 68, "Match each adjective with the noun it typically combines with.",
    [["vested", "interest"], ["sweeping", "generalisation"], ["foregone", "conclusion"], ["vicious", "circle"], ["moot", "point"]],
    "*A vested interest* (a personal stake), *a sweeping generalisation* (too broad), *a foregone conclusion* (an inevitable result), *a vicious circle* (problems that reinforce each other), *a moot point* (debatable or no longer relevant).", ["Adjective", "Noun"]),
  match("vm-phrasal", "uoe:phrasal", 56, "Match each phrasal verb with its more formal equivalent.",
    [["carry out", "conduct"], ["look into", "investigate"], ["point out", "note"], ["set up", "establish"], ["come up with", "devise"]],
    "Phrasal verbs are not wrong in academic prose, but single-word Latinate verbs are often more precise and formal: *carry out → conduct*, *look into → investigate*, *point out → note/observe*, *set up → establish*, *come up with → devise/propose*.", ["Phrasal verb", "Formal verb"]),
  match("vm-report", "acad:reporting", 62, "Match each reporting verb with what it signals about the source.",
    [["concede", "admits a point against their own position"], ["refute", "proves a claim wrong"], ["contend", "argues firmly in a debate"], ["speculate", "suggests without firm evidence"], ["cite", "mentions a source as support"]],
    "Reporting verbs carry stance. *Refute* means the claim was shown to be false (stronger than *reject* or *dispute*). *Concede* implies reluctance. *Speculate* signals limited evidence."),
  match("vm-linkers", "gram:coord-subord", 64, "Match each connector with its function.",
    [["whereas", "contrast between two facts"], ["hence", "result or consequence"], ["notwithstanding", "concession (= despite)"], ["namely", "specification"], ["insofar as", "to the extent that"]],
    "*Whereas* links two contrasting clauses; *hence* introduces a consequence (often followed by a noun phrase: *hence the delay*); *notwithstanding* = despite (formal, can follow its noun); *namely* introduces the specific item(s) meant; *insofar as* limits the scope of a claim."),
  match("vm-phon", "avoc:linguistics", 58, "Match each phonological term with its definition.",
    [["allophone", "a contextual variant of a phoneme"], ["minimal pair", "two words differing in a single sound"], ["coda", "consonant(s) after the syllable nucleus"], ["epenthesis", "insertion of a segment"], ["lenition", "weakening of a consonant"]],
    "Core terminology you will use in your thesis. Note the collocations: *X surfaces as an allophone of Y*, *a minimal pair contrasting /p/ and /b/*, *complex codas*, *vowel epenthesis breaks up the cluster*, *intervocalic lenition*.", ["Term", "Definition"], "academicVocab"),
  match("vm-false", "voc:false-friends", 52, "Match each English word with its real meaning (watch the false friends).",
    [["actually", "in fact"], ["eventually", "in the end"], ["sensible", "showing good judgement"], ["assist", "help"], ["embarrassed", "self-conscious, awkward"]],
    "Classic false friends for Spanish speakers: *actually* ≠ *actualmente* (= currently); *eventually* ≠ *eventualmente* (= possibly/occasionally); *sensible* ≠ *sensible* (= sensitive); *assist* ≠ *asistir a* (= attend); *embarrassed* ≠ *embarazada* (= pregnant).", ["English", "Means"], "vocabulary"),
  match("vm-preps", "gram:prepositions", 55, "Match each word with its dependent preposition.",
    [["consist", "of"], ["depend", "on"], ["comply", "with"], ["attribute (X)", "to"], ["abstain", "from"]],
    "*Consist of*, *depend on*, *comply with*, *attribute X to Y*, *abstain from*. Spanish *depender de* and *consistir en* push learners towards ✗ *depend of* and ✗ *consist in* (the latter exists in English but means 'have as its essence' and is rare)."),
  match("vm-plurals", "gram:agreement", 58, "Match each singular noun with its plural.",
    [["criterion", "criteria"], ["phenomenon", "phenomena"], ["hypothesis", "hypotheses"], ["locus", "loci"], ["corpus", "corpora"]],
    "Greek and Latin plurals are frequent in academic writing. *Criteria* and *phenomena* are plurals: ✗ *this criteria* and ✗ *a phenomena* are common errors. *Corpuses* exists, but *corpora* is the norm in linguistics.", ["Singular", "Plural"]),
  match("vm-idioms", "uoe:idiom", 66, "Match each expression with its meaning.",
    [["the jury is still out", "no decision has been reached yet"], ["a double-edged sword", "something with both benefits and drawbacks"], ["the tip of the iceberg", "a small visible part of a larger problem"], ["move the goalposts", "change the rules unfairly"], ["a red herring", "a misleading distraction"]],
    "These idioms appear in C2 reading and listening and in academic commentary (less in research articles themselves)."),
  match("vm-register", "gram:formal-register", 54, "Match each informal expression with a formal equivalent.",
    [["get", "obtain"], ["think about", "consider"], ["go up", "increase"], ["show", "demonstrate"], ["a lot of", "a considerable amount of"]],
    "Raising register is mostly lexical: Latinate verbs replace phrasal or very general verbs. Do not overdo it: *show* is perfectly acceptable in academic prose; *demonstrate* implies stronger evidence."),
];

// ------------------------------------------------------------------ clasificar
export const SORT_ITEMS: SortItem[] = [
  sort("vs-hedge", "acad:hedging", 58, "Sort each expression: does it make the claim more cautious or more certain?",
    ["Hedge (more cautious)", "Booster (more certain)"],
    [["may", 0], ["suggests", 0], ["appears to", 0], ["tends to", 0], ["possibly", 0], ["clearly", 1], ["undoubtedly", 1], ["demonstrates", 1], ["it is evident that", 1], ["certainly", 1]],
    "Hedges limit commitment (*may, suggests, appears to, tends to, possibly*); boosters increase it (*clearly, undoubtedly, demonstrates, it is evident that, certainly*). Good academic writing balances both according to the strength of the evidence."),
  sort("vs-count", "gram:determiners", 56, "Sort the nouns by how they are normally used in academic English.",
    ["Countable", "Uncountable"],
    [["information", 1], ["advice", 1], ["equipment", 1], ["feedback", 1], ["evidence", 1], ["study", 0], ["finding", 0], ["criterion", 0], ["hypothesis", 0], ["phenomenon", 0]],
    "*Information, advice, equipment, feedback, evidence* are uncountable: no plural, no *a/an* (*a piece of evidence*, *some feedback*). *Research* is also uncountable in standard usage."),
  sort("vs-ger", "gram:complementation", 60, "Sort the verbs by the form that follows them.",
    ["+ -ing", "+ to-infinitive"],
    [["avoid", 0], ["consider", 0], ["deny", 0], ["postpone", 0], ["risk", 0], ["aim", 1], ["fail", 1], ["tend", 1], ["manage", 1], ["refuse", 1]],
    "*Avoid/consider/deny/postpone/risk + -ing* (*we avoided using…*); *aim/fail/tend/manage/refuse + to* (*the model fails to predict…*)."),
  sort("vs-reg", "gram:formal-register", 52, "Sort the words by register.",
    ["Formal academic", "Informal"],
    [["nevertheless", 0], ["furthermore", 0], ["consequently", 0], ["obtain", 0], ["numerous", 0], ["anyway", 1], ["plus (as a linker)", 1], ["stuff", 1], ["get", 1], ["a bunch of", 1]],
    "The informal items are typical of speech and emails between friends, not of essays or articles."),
  sort("vs-link", "gram:coord-subord", 60, "Sort the connectors by function.",
    ["Contrast / concession", "Cause / result", "Addition"],
    [["whereas", 0], ["nonetheless", 0], ["albeit", 0], ["consequently", 1], ["hence", 1], ["thereby", 1], ["moreover", 2], ["furthermore", 2], ["in addition", 2]],
    "*Albeit* (+ adjective/adverbial: *a small, albeit significant, effect*) is concessive. *Thereby* (+ -ing) expresses the result or means of the previous action: *…reducing noise, thereby improving accuracy*."),
  sort("vs-manner", "avoc:linguistics", 55, "Sort the English consonants by manner of articulation.",
    ["Stop (plosive)", "Fricative", "Nasal"],
    [["/p/", 0], ["/ɡ/", 0], ["/t/", 0], ["/θ/", 1], ["/z/", 1], ["/ʃ/", 1], ["/m/", 2], ["/n/", 2], ["/ŋ/", 2]],
    "Stops involve complete oral closure; fricatives a narrow constriction producing turbulence; nasals oral closure with the velum lowered.", "academicVocab"),
  sort("vs-stative", "gram:tense-aspect", 58, "Sort the verbs: which are normally stative (rarely used in the progressive)?",
    ["Usually stative", "Dynamic"],
    [["contain", 0], ["belong", 0], ["consist", 0], ["resemble", 0], ["comprise", 0], ["analyse", 1], ["collect", 1], ["interview", 1], ["record", 1], ["write", 1]],
    "Stative verbs describe states or relations: ✗ *The corpus is containing 40 hours* should be *The corpus contains 40 hours*. Dynamic verbs describe actions and are fine in the progressive (*we are recording…*)."),
  sort("vs-stance", "acad:reporting", 62, "Sort the reporting verbs by the writer's attitude to the source.",
    ["Neutral", "Writer accepts it", "Writer distances themself"],
    [["states", 0], ["describes", 0], ["reports", 0], ["demonstrates", 1], ["establishes", 1], ["confirms", 1], ["claims", 2], ["purports", 2], ["alleges", 2]],
    "Choosing *X demonstrates* commits you to X's conclusion; *X claims* signals doubt. *Purport* (+ to-infinitive) is strongly distancing: *a study purporting to show…*."),
  sort("vs-sections", "acad:results", 58, "Sort each sentence into the section of a research article where it most likely belongs.",
    ["Methods", "Results", "Discussion"],
    [["Participants were recruited through community networks.", 0], ["Recordings were made with a head-mounted microphone.", 0], ["Table 2 shows the mean duration by context.", 1], ["Mean vowel duration was 142 ms in open syllables.", 1], ["These findings may reflect contact with Spanish.", 2], ["This contrasts with earlier impressionistic accounts.", 2]],
    "Methods: past passive, procedure. Results: reporting numbers and figures with minimal interpretation. Discussion: interpretation (hedged), comparison with previous work."),
];

// ------------------------------------------------------------------ ¿cuál no encaja?
export const ODD_ITEMS: OddItem[] = [
  odd("vo-conduct", "uoe:collocation", 56, "Three of these collocate naturally with **conduct**. Which one does NOT?", ["research", "an experiment", "a survey", "a conclusion"], 3, "You *draw* or *reach* a conclusion; you *conduct* research, an experiment or a survey."),
  odd("vo-draw", "uoe:collocation", 62, "Three of these collocate naturally with **draw**. Which one does NOT?", ["a distinction", "a conclusion", "attention (to)", "a hypothesis"], 3, "You *formulate*, *advance*, *propose* or *test* a hypothesis; you *draw* a distinction, a conclusion, attention to something."),
  odd("vo-raise", "uoe:collocation", 58, "Three of these collocate naturally with **raise**. Which one does NOT?", ["a question", "an issue", "concerns", "an experiment"], 3, "You *conduct* or *run* an experiment; you *raise* a question, an issue, concerns."),
  odd("vo-hedge", "acad:hedging", 54, "Three of these are hedges. Which one is NOT?", ["may", "appears to", "tends to", "undoubtedly"], 3, "*Undoubtedly* is a booster: it increases commitment."),
  odd("vo-count", "gram:determiners", 54, "Three of these nouns are normally uncountable. Which one is countable?", ["information", "evidence", "equipment", "finding"], 3, "*A finding / two findings*. The others take no plural: *a piece of information / evidence / equipment*."),
  odd("vo-plural", "gram:agreement", 56, "Three of these are plural forms. Which one is NOT?", ["criteria", "phenomena", "analyses", "thesis"], 3, "*Thesis* is singular (plural *theses*)."),
  odd("vo-stative", "gram:tense-aspect", 58, "Three of these verbs are freely used in the progressive. Which one is NOT?", ["investigate", "record", "comprise", "analyse"], 2, "*Comprise* is stative: *the sample comprises 30 speakers*, not ✗ *is comprising*."),
  odd("vo-formal", "gram:formal-register", 54, "Three of these are formal. Which one is informal?", ["obtain", "acquire", "procure", "get hold of"], 3, "*Get hold of* is informal; in academic writing use *obtain* or *acquire*."),
  odd("vo-contrast", "gram:coord-subord", 60, "Three of these connectors express contrast. Which one does NOT?", ["whereas", "nonetheless", "conversely", "accordingly"], 3, "*Accordingly* expresses result (= therefore / in a way that fits)."),
  odd("vo-fric", "avoc:linguistics", 52, "Three of these are fricatives. Which one is NOT?", ["/f/", "/ʒ/", "/θ/", "/d/"], 3, "/d/ is a voiced alveolar stop.", "academicVocab"),
  odd("vo-on", "gram:prepositions", 54, "Three of these verbs are followed by **on**. Which one is NOT?", ["depend", "rely", "focus", "consist"], 3, "*Consist of*. The others: *depend on*, *rely on*, *focus on*."),
];

// ------------------------------------------------------------------ encontrar y corregir el error
export const FIX_ITEMS: FixItem[] = [
  fix("vf-01", "gram:agreement", 50, "The results of the study shows a clear age effect.", "shows", ["show"], "The subject is *the results* (plural); *of the study* is a post-modifier. Agree with the head noun.", true),
  fix("vf-02", "gram:determiners", 52, "This report contains many informations about the community.", "many informations", ["much information", "a lot of information", "a great deal of information", "extensive information"], "*Information* is uncountable: no plural, and it takes *much*, not *many*.", true),
  fix("vf-03", "gram:prepositions", 54, "The participants were asked to explain about their language choices.", "explain about", ["explain"], "*Explain* is transitive: *explain something (to someone)*. Spanish *explicar sobre* pulls in the preposition."),
  fix("vf-04", "gram:prepositions", 48, "Despite of the small sample, the trend is clear.", "Despite of", ["Despite", "In spite of"], "*Despite* takes no *of*; *in spite of* does.", true),
  fix("vf-05", "uoe:collocation", 60, "It is necessary to make emphasis on the role of tone.", "make emphasis on", ["emphasise", "emphasize", "place emphasis on", "put emphasis on", "lay emphasis on"], "*Emphasis* collocates with *place/put/lay*, not *make* (a calque of *hacer énfasis*). The verb *emphasise* is simpler."),
  fix("vf-06", "gram:tense-aspect", 58, "Several studies have shown that tone is depending on vowel height.", "is depending on", ["depends on"], "*Depend* describes a relation (stative here), so the simple present is required."),
  fix("vf-07", "gram:prepositions", 54, "This paper aims to describe the vowel system and to discuss about its implications.", "discuss about", ["discuss"], "*Discuss* is transitive: *discuss its implications*. (The noun takes a preposition: *a discussion of / about*.)"),
  fix("vf-08", "gram:prepositions", 46, "In the other hand, younger speakers rarely use the form.", "In the other hand", ["On the other hand"], "The fixed expression is *on the other hand* (and it should follow *on the one hand* or an implied contrast).", true),
  fix("vf-09", "uoe:collocation", 58, "The interviews were realised in the speakers' homes.", "realised", ["conducted", "carried out", "held"], "*Realise* means 'become aware of' (or 'achieve'). Spanish *realizar* = *conduct / carry out*. In phonology, *realise* is fine for sounds: */t/ is realised as [ɾ]*."),
  fix("vf-10", "voc:false-friends", 52, "Actually, the language is spoken by around two thousand people.", "Actually", ["Currently", "At present", "Today", "Presently", "Nowadays"], "*Actually* = in fact. *Actualmente* = *currently / at present*.", false, "vocabulary"),
  fix("vf-11", "gram:agreement", 56, "This phenomena has not been described before.", "This phenomena", ["This phenomenon", "These phenomena"], "*Phenomena* is plural. Singular: *this phenomenon*; plural: *these phenomena have…* (then the verb changes too)."),
  fix("vf-12", "gram:relatives", 52, "The speakers which took part were all bilingual.", "which", ["who", "that"], "For people, use *who* (or *that* in a defining clause).", true),
  fix("vf-13", "gram:inversion", 66, "Hardly the speakers had finished when the recording stopped.", "Hardly the speakers had", ["Hardly had the speakers"], "Fronted negative adverbials (*hardly, scarcely, no sooner*) trigger subject–auxiliary inversion: *Hardly had the speakers finished when…*"),
  fix("vf-14", "gram:conditionals", 60, "If the sample would have been larger, the effect might have reached significance.", "would have been", ["had been"], "In a third conditional, the *if*-clause takes the past perfect: *If the sample had been larger…*"),
  fix("vf-15", "gram:relatives", 62, "The analysis suggests that the vowel is lengthened, what supports the earlier account.", "what", ["which"], "A sentential relative clause (referring to the whole previous clause) uses *which*, not *what* (Spanish *lo que*)."),
  fix("vf-16", "gram:word-order", 46, "Is important to note that the corpus is small.", "Is important", ["It is important"], "English requires an overt subject: dummy *it* fills the subject position when the real subject is extraposed.", true),
  fix("vf-17", "gram:prepositions", 54, "The results are similar than those reported in earlier work.", "similar than", ["similar to"], "*Similar to*; *than* follows comparatives (*higher than*) and *different than* in AmE."),
  fix("vf-18", "gram:modality", 48, "We could not to replicate the effect.", "could not to replicate", ["could not replicate", "were unable to replicate", "were not able to replicate"], "Modal verbs take the bare infinitive: *could not replicate*. (Compare *be able to*, which takes *to*.)", true),
  fix("vf-19", "gram:agreement", 56, "Each of the speakers were recorded twice.", "were", ["was"], "*Each (of)* takes a singular verb in formal writing."),
  fix("vf-20", "gram:word-order", 62, "The more data we collect, more reliable the model becomes.", "more reliable", ["the more reliable"], "The correlative comparative needs *the* in both halves: *the more…, the more…*"),
  fix("vf-21", "gram:relatives", 60, "The study, that was published in 2018, examined ten speakers.", "that", ["which"], "Non-defining relative clauses (between commas) cannot use *that*."),
  fix("vf-22", "gram:prepositions", 56, "The sample consisted in forty speakers.", "consisted in", ["consisted of", "comprised", "was composed of"], "*Consist of* = be made up of. *Consist in* (rare, formal) = have as its essence."),
];

// ------------------------------------------------------------------ acento (familias con cambio de acento)
export const STRESS_ITEMS: StressItem[] = [
  stress("vst-photography", 56, "photography", 4, 1, "fəˈtɑɡɹəfi", "fəˈtɒɡɹəfi", "pho-**TO**-gra-phy. Words ending in *-graphy* and *-ology* stress the syllable before the suffix (antepenultimate)."),
  stress("vst-photographic", 58, "photographic", 4, 2, "ˌfoʊtəˈɡɹæfɪk", "ˌfəʊtəˈɡɹæfɪk", "pho-to-**GRA**-phic. The suffix *-ic* attracts stress to the syllable immediately before it."),
  stress("vst-economy", 54, "economy", 4, 1, "ɪˈkɑnəmi", "ɪˈkɒnəmi", "e-**CO**-no-my."),
  stress("vst-economic", 56, "economic", 4, 2, "ˌɛkəˈnɑmɪk", "ˌiːkəˈnɒmɪk", "e-co-**NO**-mic: *-ic* shifts the stress to the preceding syllable."),
  stress("vst-analysis", 56, "analysis", 4, 1, "əˈnæləsɪs", "əˈnæləsɪs", "a-**NA**-ly-sis (compare **A**-na-lyse and a-na-**LY**-tic)."),
  stress("vst-analytic", 60, "analytic", 4, 2, "ˌænəˈlɪtɪk", "ˌænəˈlɪtɪk", "a-na-**LY**-tic: *-ic* again."),
  stress("vst-democracy", 56, "democracy", 4, 1, "dɪˈmɑkɹəsi", "dɪˈmɒkɹəsi", "de-**MO**-cra-cy: *-cy* after *-crat-* behaves like *-graphy*."),
  stress("vst-democratic", 58, "democratic", 4, 2, "ˌdɛməˈkɹætɪk", "ˌdeməˈkɹætɪk", "de-mo-**CRA**-tic."),
  stress("vst-phonology", 54, "phonology", 4, 1, "fəˈnɑlədʒi", "fəˈnɒlədʒi", "pho-**NO**-lo-gy: *-ology* stresses the *-ol-* syllable."),
  stress("vst-phonological", 58, "phonological", 5, 2, "ˌfoʊnəˈlɑdʒɪkəl", "ˌfəʊnəˈlɒdʒɪkəl", "pho-no-**LO**-gi-cal: *-ical* stresses the syllable before it."),
  stress("vst-record-n", 50, "record (noun)", 2, 0, "ˈɹɛkɚd", "ˈɹekɔːd", "Many two-syllable noun/verb pairs: nouns are stressed on the first syllable (**RE**-cord), verbs on the second (re-**CORD**)."),
  stress("vst-record-v", 50, "record (verb)", 2, 1, "ɹɪˈkɔɹd", "ɹɪˈkɔːd", "Verb: re-**CORD**. Noun: **RE**-cord."),
  stress("vst-increase-n", 50, "increase (noun)", 2, 0, "ˈɪnkɹis", "ˈɪnkɹiːs", "Noun: **IN**-crease. Verb: in-**CREASE**."),
  stress("vst-increase-v", 50, "increase (verb)", 2, 1, "ɪnˈkɹis", "ɪnˈkɹiːs", "Verb: in-**CREASE**."),
  stress("vst-hypothesis", 60, "hypothesis", 4, 1, "haɪˈpɑθəsɪs", "haɪˈpɒθəsɪs", "hy-**PO**-the-sis (and hy-po-**THE**-ti-cal)."),
  stress("vst-hypothetical", 62, "hypothetical", 5, 2, "ˌhaɪpəˈθɛtɪkəl", "ˌhaɪpəˈθetɪkəl", "hy-po-**THE**-ti-cal: *-ical* again."),
];

export const VARIETY_ITEMS = [...MATCH_ITEMS, ...SORT_ITEMS, ...ODD_ITEMS, ...FIX_ITEMS, ...STRESS_ITEMS];
