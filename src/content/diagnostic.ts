import type { Item } from "./types";
import { mcq, gap, kwt, judge, spot, wf } from "./helpers";

// Banco exclusivo del diagnóstico (no se repite en práctica normal), de B2 a C2.
export const DIAG_GRAMMAR: Item[] = [
  mcq("dg1", "gram:tense-aspect", 44, "She has lived in Hermosillo ___ 2015.", ["since", "for", "from", "during"], 0, "Point in time → *since*.", undefined, undefined, { basic: true }),
  mcq("dg2", "gram:conditionals", 45, "If I ___ more time, I would join the reading group.", ["had", "have", "would have", "will have"], 0, "Second conditional: past form in the if-clause.", undefined, undefined, { basic: true }),
  mcq("dg3", "gram:relatives", 48, "The report, ___ was published last month, has attracted a lot of attention.", ["which", "that", "what", "who"], 0, "Non-defining relative clause (commas) → *which*, never *that*."),
  mcq("dg4", "gram:complementation", 50, "He's used to ___ up early for fieldwork.", ["getting", "get", "got", "be getting"], 0, "*Be used to* + -ing (*to* is a preposition)."),
  mcq("dg5", "gram:coord-subord", 52, "___ the bad weather, the fieldwork went ahead as planned.", ["Despite", "Although", "However", "Even"], 0, "Noun phrase → preposition *despite*."),
  wf("dg6", "uoe:wordform", 55, "There is growing ___ that early exposure matters.", "AWARE", ["awareness"], "Noun after *growing*: *awareness*."),
  judge("dg7", "gram:formal-register", 55, "We got a lot of really interesting data from the kids.", true, false, "Grammatical but informal (*got, a lot of, really, kids*).", "We obtained a considerable amount of valuable data from the children.", "Results section"),
  kwt("dg8", "gram:modality", 58, "It's possible that the files were deleted by mistake.", "MAY", "The files", "by mistake.", ["may have been deleted"], "Past possibility + passive: *may have been* + PP."),
  mcq("dg9", "gram:relatives", 58, "The museum, ___ collection includes over 2,000 masks, is closed on Mondays.", ["whose", "which", "that", "who's"], 0, "Possession → *whose*."),
  mcq("dg10", "gram:inversion", 60, "Hardly ___ the room when the fire alarm went off.", ["had she entered", "she had entered", "did she entered", "she entered"], 0, "*Hardly* fronted → inversion + past perfect."),
  mcq("dg11", "uoe:collocation", 60, "These findings ___ further investigation.", ["warrant", "deserve to", "merit of", "justify for"], 0, "*Warrant* + object = justify. The others are ungrammatical as written."),
  gap("dg12", "gram:prepositions", 60, "The proposal was rejected on the ___ that it was too expensive.", ["grounds"], "Fixed phrase: *on the grounds that*."),
  mcq("dg13", "gram:embedding", 62, "It's high time we ___ a decision.", ["made", "make", "will make", "have made"], 0, "*It's (high) time* + past form (unreal present)."),
  mcq("dg14", "uoe:collocation", 64, "The new results ___ doubt on the earlier claim.", ["cast", "put", "made", "gave"], 0, "*Cast doubt on*."),
  kwt("dg15", "uoe:kwt", 66, "She didn't apologise for her mistake at all.", "APOLOGY", "She", "her mistake.", ["made no apology for", "didn't make any apology for", "did not make any apology for", "offered no apology for"], "*Make no apology for* = not apologise at all."),
  mcq("dg16", "gram:embedding", 68, "The committee insisted that the report ___ revised before publication.", ["be", "was", "is", "would"], 0, "Mandative subjunctive after *insist that* (demand)."),
  spot("dg17", "gram:inversion", 70, ["Not until", "the data were analysed", "the researchers realised", "the error."], 2, "did the researchers realise", "*Not until* + clause fronted → inversion in the main clause."),
  mcq("dg18", "gram:coord-subord", 72, "The findings, ___ preliminary, are encouraging.", ["albeit", "despite", "however", "notwithstanding"], 0, "*Albeit* + adjective = although (they are) preliminary."),
  mcq("dg19", "uoe:mc-cloze", 72, "The new regulations are likely to ___ researchers from sharing data.", ["deter", "defer", "detain", "detract"], 0, "*Deter someone from doing* = discourage."),
  gap("dg20", "gram:conditionals", 74, "___ it not for her intervention, the archive would have been lost.", ["Were"], "Inverted conditional: *Were it not for* + NP (= if it were not for). *Had it not been for* would need *been*, which the sentence doesn't have."),
  mcq("dg21", "uoe:open-cloze", 74, "Much ___ I admire her work, I cannot accept this conclusion.", ["as", "though", "that", "so"], 0, "*Much as* = although (concessive)."),
  judge("dg22", "gram:inversion", 76, "Seldom has a single study generated such controversy.", true, true, "Correct inversion after *Seldom*; appropriate in formal writing.", undefined, "Literature review"),
  kwt("dg23", "uoe:kwt", 78, "The evidence did not support the hypothesis in any way.", "BORNE", "The hypothesis was", "by the evidence.", ["in no way borne out", "not borne out at all", "not in any way borne out", "not at all borne out"], "*Bear out* = support; passive *was borne out*.", { max: 8 }),
  mcq("dg24", "uoe:mc-cloze", 78, "His remarks were ___ to the discussion and only wasted time.", ["extraneous", "extravagant", "exterior", "extrinsic"], 0, "*Extraneous* = irrelevant.", [null, "= excessive in spending.", "= outside surface.", "= external (not inherent) — not 'irrelevant'."], [null, null, null, "possible-not-correct"]),
  mcq("dg25", "uoe:idiom", 80, "The data are, to all ___ and purposes, unusable.", ["intents", "intends", "intentions", "intense"], 0, "Fixed phrase: *to all intents and purposes* (AmE also *for all intents and purposes*)."),
  mcq("dg26", "uoe:mc-cloze", 82, "The author's prose is so ___ that even specialists struggle to follow it.", ["turgid", "lucid", "terse", "limpid"], 0, "*Turgid* = pompous and hard to follow. *Lucid/limpid* = clear (opposite); *terse* = brief.", [null, "Opposite meaning.", "Brief, not hard to follow.", "Opposite meaning."], [null, "reversed", "grammar-ok-meaning-wrong", "reversed"]),
];

// Prueba sí/no de tamaño de vocabulario (palabras reales por banda de frecuencia + pseudopalabras)
export const VOCAB_BANDS: { lvl: number; words: string[] }[] = [
  { lvl: 35, words: ["purpose", "measure", "journey", "wealth", "silence"] },
  { lvl: 50, words: ["reluctant", "invest", "sufficient", "anticipate", "inevitable", "scrutiny"] },
  { lvl: 60, words: ["plausible", "brittle", "ubiquitous", "palatable"] },
  { lvl: 70, words: ["meagre", "culminate", "wane", "quandary", "sanguine", "recalcitrant"] },
  { lvl: 78, words: ["cajole", "perfunctory", "obfuscate", "lugubrious"] },
  { lvl: 88, words: ["pusillanimous", "sesquipedalian", "perspicacious", "tergiversate", "crepuscular"] },
];
export const PSEUDOWORDS = ["plintering", "graffle", "mornolent", "brastic", "scrumpation", "fendulous", "obtrify", "carmusive", "pranticle", "dorrigate", "crannifest", "sorbulent", "tranquate", "mespolid", "quindle", "glomerize"];

// Vocabulario académico (significado)
export const DIAG_ACADVOCAB: Item[] = [
  mcq("dv1", "avoc:core", 52, "Which word means **'make a problem worse'**?", ["exacerbate", "mitigate", "elucidate", "corroborate"], 0, "*Exacerbate* = worsen; *mitigate* is its opposite.", undefined, undefined, { skill: "academicVocab" }),
  mcq("dv2", "avoc:core", 56, "*The link between the variables is **tenuous**.* This means the link is…", ["weak", "strong", "obvious", "new"], 0, "*Tenuous* = very weak or slight.", undefined, undefined, { skill: "academicVocab" }),
  mcq("dv3", "avoc:core", 58, "Choose the best word: *The small sample ___ any firm generalisation.*", ["precludes", "includes", "presumes", "promotes"], 0, "*Preclude* = make impossible.", undefined, undefined, { skill: "academicVocab" }),
  mcq("dv4", "avoc:core", 62, "*Her argument is **cogent**.* It is…", ["clear and convincing", "long and detailed", "controversial", "emotional"], 0, "", undefined, undefined, { skill: "academicVocab" }),
  mcq("dv5", "avoc:core", 64, "Which word best completes: *These two explanations are not mutually ___.*", ["exclusive", "excluded", "exclusionary", "excluding"], 0, "Fixed phrase *mutually exclusive*.", undefined, undefined, { skill: "academicVocab" }),
  mcq("dv6", "avoc:core", 68, "*The study **purports** to show a causal link.* The writer suggests that…", ["the study claims this, perhaps without justification", "the study proves this", "the study denies this", "the study ignores this"], 0, "*Purport* implies the claim may not be justified.", undefined, undefined, { skill: "academicVocab" }),
  mcq("dv7", "avoc:core", 72, "Choose the word that means **'until now'** (formal).", ["hitherto", "thereby", "whereby", "henceforth"], 0, "*Henceforth* = from now on (opposite direction).", undefined, undefined, { skill: "academicVocab" }),
  mcq("dv8", "avoc:core", 76, "*The analysis **conflates** tone with stress.* This is a criticism because the analysis…", ["treats two distinct things as one", "separates them too strictly", "ignores tone", "measures stress incorrectly"], 0, "", undefined, undefined, { skill: "academicVocab" }),
];

// Bloque bajo presión: ítems de Use of English con tiempo muy ajustado (se comparan con tu rendimiento sin tiempo)
export const DIAG_PRESSURE: Item[] = [
  mcq("dp1", "gram:agreement", 54, "The number of participants ___ lower than expected.", ["was", "were", "have been", "are"], 0, "*The number of* → singular."),
  mcq("dp2", "gram:prepositions", 55, "The results are consistent ___ our hypothesis.", ["with", "to", "on", "for"], 0, ""),
  mcq("dp3", "gram:complementation", 58, "I look forward to ___ from you.", ["hearing", "hear", "heard", "be hearing"], 0, ""),
  mcq("dp4", "gram:determiners", 60, "Only ___ speakers still use the old form.", ["a few", "few", "a little", "little"], 0, "*Only a few* + countable."),
  mcq("dp5", "gram:modality", 62, "You ___ have told me; I already knew.", ["needn't", "mustn't", "couldn't", "shouldn't"], 0, "Unnecessary past action: *needn't have*."),
  mcq("dp6", "gram:inversion", 66, "No sooner ___ than the questions began.", ["had she finished", "she had finished", "did she finished", "she finished"], 0, ""),
  mcq("dp7", "uoe:collocation", 64, "The study ___ light on an unexplored area.", ["sheds", "makes", "gives", "puts"], 0, ""),
  mcq("dp8", "gram:conditionals", 68, "___ you require further information, please contact us.", ["Should", "If", "Unless", "Had"], 0, "Bare verb *require* → inverted *Should*."),
];

// Lectura y comprensión auditiva del diagnóstico (usan textos del banco)
export const DIAG_READING_ID = "r-testing";
export const DIAG_LISTENING_ID = "l-advisor";

export const DIAG_WRITING = {
  id: "diag-writing", genre: "Paragraph", title: "Diagnostic writing", lvl: 60, minWords: 120, maxWords: 180, timeMin: 15,
  prompt: "In 120–180 words, write an academic paragraph responding to this question: *Should universities require doctoral students to publish articles before submitting their thesis?* Take a position, support it with reasons, and acknowledge one counterargument.",
  focus: ["argumentation", "academic register", "accuracy"],
  checklist: ["Clear position", "Supported reasons", "Counterargument acknowledged", "Formal register", "Accurate grammar"],
};

export const DIAG_SPEAKING = {
  id: "diag-speaking", type: "academic" as const, title: "Diagnostic speaking", lvl: 60, prepSec: 30, speakSec: 60,
  prompt: "Explain your research interests (or a topic you know well) to a professor from another field. Say what the question is, why it matters, and how you would investigate it.",
  checklist: ["Clear structure", "Why it matters", "How to investigate", "Fluency without long pauses"],
};

export const DIAG_PRON_SENTENCES = [
  "The results of the third study were published in a linguistics journal.",
  "Researchers have suggested that the vowel contrast is gradually disappearing.",
  "Her hypothesis was supported by evidence from three different villages.",
];
