import type { Lesson } from "./types";
import { mcq, gap, kwt, judge, spot, produce } from "./helpers";

export const GRAMMAR_3: Lesson[] = [
  {
    id: "g-punct", module: "grammar", group: "Sentence", title: "Punctuation", tag: "gram:punctuation", lvl: 56, icon: "❝",
    summary: "Comma splices, restrictive commas, semicolons, colons, and the commas Spanish speakers add (or forget).",
    body: `#### High-impact rules
- **Comma splice**: two independent clauses can't be joined by a comma alone. Use a full stop, a semicolon, or a conjunction.
- **No comma between subject and verb**, however long the subject: ✗ *The main finding of the study, is that…*
- **Restrictive vs. non-restrictive**: commas change meaning. *The speakers who were bilingual performed better* (only some) vs. *The speakers, who were bilingual, performed better* (all).
- **Introductory elements**: comma after long adverbials and transitions: *However, …*, *In the second experiment, …*
- **Semicolon**: between closely related independent clauses, and before conjunctive adverbs (*; however,*).
- **Colon**: introduces an explanation, list or elaboration after a **complete** clause: *Two factors matter: age and schooling.* (✗ *The factors are: age and schooling.*)
- **That-clauses**: no comma before *that* (✗ *They argue, that…*).`,
    examples: [
      { t: "The speakers, who were bilingual, performed better.", k: "good", note: "All speakers were bilingual." },
      { t: "The speakers who were bilingual performed better.", k: "good", note: "Only the bilingual ones." },
      { t: "The authors argue, that the change is recent.", k: "bad" },
    ],
    items: [
      spot("pu1", "gram:punctuation", 52, ["The main finding", "of the study,", "is that tone", "is being lost."], 1, "of the study",
        "Never separate the **subject** from its **verb** with a single comma, however long the subject is (Spanish writers often add one here).", { basic: true }),
      mcq("pu2", "gram:punctuation", 60, "Which sentence says that **only some** speakers were bilingual?", [
        "The speakers who were bilingual performed better on the task.",
        "The speakers, who were bilingual, performed better on the task.",
        "The speakers, who were bilingual performed better on the task.",
        "The speakers who were bilingual, performed better on the task."], 0,
        "No commas → **restrictive** relative clause → it selects a subset (only the bilingual speakers).",
        [null, "Commas → non-restrictive: *all* the speakers were bilingual.", "Missing the closing comma: ungrammatical punctuation.", "Comma between subject and verb."], [null, "grammar-ok-meaning-wrong", null, null], { tests: "meaning" }),
      spot("pu3", "gram:punctuation", 54, ["The authors argue,", "that the change", "began in the", "late nineteenth century."], 0, "The authors argue",
        "No comma before a **that**-clause complement."),
      mcq("pu4", "gram:punctuation", 58, "Choose the correctly punctuated sentence.", [
        "The sample was small, nevertheless, the trend was clear.",
        "The sample was small; nevertheless, the trend was clear.",
        "The sample was small nevertheless the trend was clear.",
        "The sample was small: nevertheless the trend, was clear."], 1,
        "*Nevertheless* is a conjunctive **adverb**: semicolon (or full stop) before, comma after.",
        ["Comma splice.", null, "Run-on sentence.", "Wrong colon use and comma between subject and verb."]),
      mcq("pu5", "gram:punctuation", 60, "Choose the correct use of the colon.", [
        "The two main factors are: age and schooling.",
        "Two factors explain the pattern: age and schooling.",
        "Two factors: explain the pattern, age and schooling.",
        "The pattern is explained by: age and schooling."], 1,
        "A colon follows a **complete clause** and introduces what it announces.",
        ["Colon between a verb and its complement.", null, "Colon breaks the clause.", "Colon between a preposition and its object."]),
    ],
  },
  {
    id: "g-agreement", module: "grammar", group: "Sentence", title: "Agreement", tag: "gram:agreement", lvl: 55, icon: "⚖️",
    summary: "Attraction errors, collective nouns, data/criteria/phenomena, either…or, and agreement after inversion.",
    body: `- The verb agrees with the **head** of the subject, not the nearest noun: *The **list** of exceptions **is** long.*
- **Latin/Greek plurals**: *criterion → criteria*, *phenomenon → phenomena*, *hypothesis → hypotheses*, *analysis → analyses*, *datum → data* (*data* is often plural in academic writing).
- **Either/neither… or/nor**: agree with the nearer subject: *Neither the author nor the reviewers **were**…*
- **Collective nouns** (*team, committee, community*): singular in AmE; singular or plural in BrE depending on whether the group acts as one.
- **One of the + plural noun + who/that** → plural verb in the relative clause: *one of the speakers who **use** the old form*.
- Subject after *there* / inversion: *There **are** several reasons*, *Among the factors **were**…*`,
    examples: [
      { t: "These criteria were applied consistently.", k: "good" },
      { t: "This criteria was applied consistently.", k: "bad" },
      { t: "She is one of the few speakers who still use the old form.", k: "good" },
    ],
    items: [
      mcq("ag1", "gram:agreement", 52, "The list of exceptions to the rule ___ surprisingly long.", ["is", "are", "were", "have been"], 0, "Head noun: **list** (singular).", [null, "Agreement with the nearest noun (*exceptions*) instead of the head (*list*).", "Same attraction error, and wrong tense.", "Same attraction error."], [null, "word-match", "word-match", "word-match"], { basic: true }),
      spot("ag2", "gram:agreement", 54, ["This criteria", "was applied", "to all", "transcriptions."], 0, "This criterion / These criteria", "*Criteria* is the **plural** of *criterion*.", { basic: true }),
      mcq("ag3", "gram:agreement", 58, "Neither the author nor the reviewers ___ aware of the error.", ["were", "was", "has been", "is"], 0,
        "With *neither… nor*, the verb agrees with the **nearer** subject (*the reviewers*, plural)."),
      gap("ag4", "gram:agreement", 62, "She is one of the few remaining speakers who still ___ (use) the inherited tonal patterns.", ["use"],
        "The antecedent of *who* is *speakers* (plural), so the relative clause verb is plural: *who still use*."),
      mcq("ag5", "gram:agreement", 60, "Among the most important factors ___ age of arrival and amount of input.", ["were", "was", "is", "has been"], 0,
        "After a fronted locative/prepositional phrase, the subject follows the verb: the subject is *age of arrival and amount of input* (plural).", [null, "Singular, but the real (postposed) subject is a coordination of two NPs: plural.", "Singular.", "Singular and wrong tense."]),
      mcq("ag6", "gram:agreement", 56, "These two ___ make different predictions about the direction of change.", ["hypotheses", "hypothesis", "hypothesises", "hypothesis's"], 0, "*Hypothesis* → plural **hypotheses**.", undefined, undefined, { basic: true }),
    ],
  },
  {
    id: "g-wordorder", module: "grammar", group: "Sentence", title: "Word order", tag: "gram:word-order", lvl: 56, icon: "↔️",
    summary: "Adverb placement, enough, phrasal verb objects, indirect questions, and Spanish-like orders.",
    body: `- **Verb + object adjacency**: English rarely separates them: ✗ *We analysed carefully the data* → *We carefully analysed the data / analysed the data carefully*.
- **Frequency and focusing adverbs** go before the main verb, after *be* and the first auxiliary: *Speakers **often** omit…*, *The effect **has only** been observed…*
- **enough** follows adjectives/adverbs (*large enough*) and precedes nouns (*enough data*).
- **Phrasal verbs** with pronoun objects: separable verbs put the pronoun in the middle: *carry it out*, ✗ *carry out it*.
- **Indirect questions**: statement order (*I wonder what the problem **is***).
- **Order of adverbials**: manner – place – time is the default (*recorded carefully in the village last year*).`,
    examples: [
      { t: "We carefully analysed the data.", k: "good" },
      { t: "We analysed carefully the data.", k: "bad", note: "Adverb between verb and object (Spanish order)." },
    ],
    items: [
      spot("wo1", "gram:word-order", 52, ["We analysed", "carefully the data", "from the three", "communities."], 1, "the data carefully",
        "English avoids placing an adverb **between a verb and its object**.", { basic: true }),
      mcq("wo2", "gram:word-order", 54, "The sample was not ___ to support generalisations.", ["large enough", "enough large", "enough largely", "largely enough"], 0, "*Enough* **follows** adjectives.", undefined, undefined, { basic: true }),
      mcq("wo3", "gram:word-order", 56, "The pilot study raised several issues, so we decided to ___ again with a larger group.", ["carry it out", "carry out it", "carry it on out", "out carry it"], 0,
        "Separable phrasal verb + **pronoun** object: the pronoun goes **between** verb and particle."),
      mcq("wo4", "gram:word-order", 55, "Could you tell me ___?", ["what the deadline is", "what is the deadline", "what the deadline", "is what the deadline"], 0,
        "Indirect questions use **statement word order**.", [null, "Direct-question order inside an indirect question.", "Missing verb.", "Garbled."]),
      mcq("wo5", "gram:word-order", 60, "The effect ___ in laboratory settings.", ["has only been observed", "only has been observed", "has been observed only ever", "has been only ever observed"], 0,
        "Focusing adverbs like *only* go after the **first auxiliary** (mid position) in neutral style. (*has been observed only in laboratory settings* is also possible, with focus on the location.)"),
    ],
  },
  {
    id: "g-complement", module: "grammar", group: "Verb phrase", title: "Advanced complementation", tag: "gram:complementation", lvl: 64, icon: "🧷",
    summary: "Verb + -ing vs. to-infinitive (with meaning change), object + infinitive, raising, and adjective complements.",
    body: `#### Meaning changes
- *stop to do* (in order to) vs. *stop doing* (cease)
- *remember/forget to do* (future duty) vs. *remember/forget doing* (past memory)
- *try to do* (attempt) vs. *try doing* (experiment)
- *go on to do* (next step) vs. *go on doing* (continue)
- *mean to do* (intend) vs. *mean doing* (involve)
- *regret to inform* (formal announcement) vs. *regret doing* (past action)

#### Patterns academic writers need
- **Raising**: *The variable **appears to have** no effect* (← It appears that…). Also *seem, tend, prove, turn out*.
- *be likely / unlikely / bound / certain* + to-infinitive.
- *be worth* + -ing; *it is worth* + -ing; *there is no point (in)* + -ing.
- *look forward to / object to / be committed to / contribute to* + **-ing** (*to* is a preposition).`,
    examples: [
      { t: "The variable appears to have no effect on duration.", k: "good" },
      { t: "We look forward to receiving your comments.", k: "good" },
      { t: "We look forward to receive your comments.", k: "bad" },
    ],
    items: [
      mcq("cp1", "gram:complementation", 55, "We look forward to ___ your comments on the draft.", ["receiving", "receive", "be receiving", "received"], 0, "*To* here is a **preposition**: + -ing.", undefined, undefined, { basic: true }),
      mcq("cp2", "gram:complementation", 62, "After presenting the data, the author goes on ___ an alternative explanation.", ["to propose", "proposing", "propose", "to proposing"], 0,
        "*Go on to do* = move on to the **next** step. *Go on doing* = continue doing the same thing.",
        [null, "Means she continued proposing — not the intended sequence.", "Bare infinitive not possible.", "Ungrammatical."], [null, "grammar-ok-meaning-wrong", null, null], { tests: "meaning" }),
      kwt("cp3", "gram:complementation", 64, "It appears that the variable has no effect on vowel duration.", "APPEARS", "The variable", "no effect on vowel duration.", ["appears to have"],
        "**Raising**: the subject of the that-clause becomes the subject of *appear* + to-infinitive.", { min: 2 }),
      mcq("cp4", "gram:complementation", 60, "I remember ___ this argument in a seminar years ago, but I can't recall who made it.", ["hearing", "to hear", "hear", "to have heard of"], 0,
        "*Remember doing* = memory of a past event; *remember to do* = not forget a duty.",
        [null, "*Remember to hear* would mean not forgetting a future duty.", "Not possible.", "Odd and changes meaning."], [null, "grammar-ok-meaning-wrong", null, null], { tests: "meaning" }),
      kwt("cp5", "gram:complementation", 66, "The results will almost certainly attract criticism.", "BOUND", "The results", "criticism.", ["are bound to attract"],
        "*Be bound to* + infinitive = almost certain to happen.", { min: 3 }),
      gap("cp6", "gram:complementation", 60, "It is worth ___ (note) that the two corpora were compiled decades apart.", ["noting"], "*It is worth* + **-ing**."),
    ],
  },
  {
    id: "g-hedging", module: "grammar", group: "Academic grammar", title: "The grammar of hedging", tag: "gram:hedging-grammar", lvl: 62, icon: "🌫️",
    summary: "Modal verbs, lexical verbs, adverbs, adjectives and impersonal structures that calibrate certainty.",
    body: `Hedging is a **grammatical system**, not only a list of phrases:

- **Modal auxiliaries**: *may, might, could, would*
- **Lexical verbs**: *suggest, indicate, appear, seem, tend*
- **Adverbs**: *possibly, probably, arguably, relatively, largely, to some extent*
- **Adjectives / nouns**: *likely, possible, a tendency, a possibility*
- **Impersonal frames**: *It is possible that…, There is some evidence that…*
- **Approximators**: *approximately, around, in most cases*
- **Limiting the scope**: *in this sample*, *under these conditions*

**Calibration**: one hedge per claim is usually enough. *It might possibly perhaps suggest…* is **over-hedging** and sounds evasive.`,
    examples: [
      { t: "These results suggest that schooling may have accelerated the shift.", k: "good" },
      { t: "These results might possibly perhaps suggest that schooling could maybe have played a role.", k: "bad", note: "Over-hedging." },
      { t: "These results prove that schooling caused the shift.", k: "bad", note: "Overclaiming." },
    ],
    items: [
      mcq("hg1", "gram:hedging-grammar", 60, "Which sentence is **best calibrated** for a correlational study with 40 participants?", [
        "Schooling caused the shift.",
        "These data suggest that schooling may have contributed to the shift.",
        "It might possibly be perhaps the case that schooling could have had some role.",
        "Schooling definitely played the main role in the shift."], 1,
        "One evidential verb (*suggest*) + one modal (*may*) + a cautious causal verb (*contributed to*) match **correlational evidence**.",
        ["Causal overclaim from correlational data.", null, "Over-hedged: stacks four hedges and becomes evasive.", "Booster (*definitely*) with weak evidence."], ["too-extreme", null, null, "too-extreme"], { tests: "register", tags: ["acad:hedging"] }),
      kwt("hg2", "gram:hedging-grammar", 62, "Younger speakers probably use fewer tonal contrasts.", "LIKELY", "Younger speakers", "fewer tonal contrasts.", ["are likely to use"], "*Be likely to* + infinitive is a common hedge.", { min: 3 }),
      judge("hg3", "gram:hedging-grammar", 64, "It could perhaps be possible that the effect might reflect a sampling artefact.", true, false,
        "Grammatical, but **four hedges** for one claim (*could, perhaps, possible, might*) — over-hedging.",
        "The effect may reflect a sampling artefact.", "Discussion section", { tags: ["acad:hedging"] }),
      produce("hg4", "gram:hedging-grammar", 64, "Hedge this overclaim **appropriately** (one or two hedging devices, not more):\n\n*Bilingual education saves endangered languages.*",
        "Good versions qualify the verb (*can help*, *may contribute to*), limit the scope (*in some contexts*), or both.",
        { minWords: 8, model: "Bilingual education can contribute to the revitalisation of endangered languages, at least in some community contexts.", checklist: ["The claim is softened", "It uses no more than two hedges", "The meaning is still clear and assertive enough", "Register is academic"], tags: ["acad:hedging"] }),
    ],
  },
  {
    id: "g-stance", module: "grammar", group: "Academic grammar", title: "Stance and evaluation", tag: "gram:stance", lvl: 66, icon: "🧭",
    summary: "How grammar encodes the writer's attitude: stance adverbs, evaluative adjectives, reporting verbs and that-clauses.",
    body: `**Stance** = the writer's attitude, certainty and evaluation. Grammatical resources:

- **Stance adverbs**: *Surprisingly, Importantly, Unfortunately, Arguably, Crucially*
- **Evaluative adjective + that/to-clause**: *It is **striking** that…*, *It is **important** to note that…*
- **Reporting verbs** (positive/neutral/negative): *demonstrate / note / claim* — *claim* subtly distances you.
- **Concessive structures** for balanced stance: *While X is plausible, Y…*
- **Attitude nouns**: *a **compelling** argument*, *a **serious** limitation*, *an **oversimplification***

Stance should be **visible but justified**: evaluation + reason.`,
    examples: [
      { t: "Smith demonstrates that the merger is complete.", k: "good", note: "You accept the conclusion." },
      { t: "Smith claims that the merger is complete.", k: "meh", note: "You signal doubt (subtle distance)." },
      { t: "Crucially, the effect disappears when age is controlled.", k: "good" },
    ],
    items: [
      mcq("st1", "gram:stance", 64, "You **disagree** with Smith's conclusion. Which verb best signals your distance?", ["demonstrates", "shows", "claims", "establishes"], 2,
        "*Claim* reports a position **without endorsing it**; *demonstrate, show, establish* present the conclusion as fact.",
        ["Implies you accept the conclusion as proven.", "Same: factive.", null, "Strongly factive."], ["reversed", "reversed", null, "reversed"], { tests: "meaning", tags: ["acad:reporting"] }),
      mcq("st2", "gram:stance", 62, "___, the effect disappears entirely when age is controlled for.", ["Crucially", "Crucial", "It is crucial", "Crucially that"], 0,
        "A **stance adverb** modifies the whole clause and signals the writer's evaluation."),
      gap("st3", "gram:stance", 60, "It is ___ (strike) that none of the earlier studies controlled for schooling.", ["striking"],
        "Evaluative adjective + extraposed that-clause: *It is striking that…*"),
      judge("st4", "gram:stance", 66, "This is a really bad argument because it doesn't make sense.", true, false,
        "Grammatical, but the evaluation is **informal and unsupported**. Academic stance names the problem precisely.",
        "This argument is unconvincing because it conflates correlation with causation.", "Critical review"),
    ],
  },
  {
    id: "g-register", module: "grammar", group: "Academic grammar", title: "Formal register", tag: "gram:formal-register", lvl: 60, icon: "🎩",
    summary: "Grammatical vs. appropriate: contractions, phrasal verbs vs. Latinate verbs, vague language, direct questions.",
    body: `A sentence can be perfectly **grammatical** and still **inappropriate** for academic writing.

| Informal | More formal / academic |
|---|---|
| look into | investigate, examine |
| find out | determine, establish |
| get | obtain, become, receive |
| a lot of | a considerable number/amount of, many, much |
| big | substantial, considerable, major |
| really important | crucial, essential |
| things | factors, aspects, features |
| So, … | Therefore, … / Thus, … |
| can't, don't | cannot, do not |

Also avoid: direct questions to the reader in excess, *you* (generic), exclamation marks, *etc.* (be specific).

**Not every phrasal verb is informal**: *carry out, point out, account for, rule out, set out* are standard in academic prose.`,
    examples: [
      { t: "We looked into a lot of things that could affect the results.", k: "bad", note: "Grammatical, too informal." },
      { t: "We examined several factors that could affect the results.", k: "good" },
      { t: "The interviews were carried out in Spanish.", k: "good", note: "*Carry out* is fine in academic writing." },
    ],
    items: [
      judge("fr1", "gram:formal-register", 55, "We looked into a lot of things that could have messed up the results.", true, false,
        "Grammatical, but *looked into*, *a lot of things*, *messed up* are **conversational**.",
        "We examined several factors that could have distorted the results.", "Methods section"),
      judge("fr2", "gram:formal-register", 58, "The interviews were carried out in Spanish and later translated.", true, true,
        "Appropriate: *carry out* is a standard collocation in academic prose. Not all phrasal verbs are informal.", undefined, "Methods section"),
      mcq("fr3", "gram:formal-register", 58, "Choose the most appropriate verb: *Further research is needed to ___ whether the effect is stable over time.*", ["determine", "find out", "figure out", "check out"], 0,
        "*Determine* is the precise, formal choice for establishing a fact through research.",
        [null, "Grammatical, but conversational.", "Informal.", "Informal and means 'look at'."], [null, "wrong-register", "wrong-register", "wrong-register"], { tests: "register" }),
      mcq("fr4", "gram:formal-register", 60, "Choose the most appropriate version for a thesis.", [
        "So, why does this happen? Well, there are lots of reasons.",
        "Several factors may account for this pattern.",
        "There are, like, many reasons for this.",
        "Why? Many reasons, obviously."], 1,
        "Concise, impersonal and hedged — typical academic register.", ["Conversational question–answer style and *lots of*.", null, "Filler *like*.", "Fragmented and booster *obviously*."]),
      spot("fr5", "gram:formal-register", 58, ["The results", "don't support", "the hypothesis", "proposed by García."], 1, "do not support",
        "Formal academic prose avoids **contractions**. (Not a grammar error: a register error.)"),
    ],
  },
  {
    id: "g-acadchoices", module: "grammar", group: "Academic grammar", title: "Grammatical choices in academic writing", tag: "gram:academic-choices", lvl: 70, icon: "🖋️",
    summary: "Active vs. passive, we vs. impersonal, tense by section, and choosing the structure that serves the argument.",
    body: `Advanced writers choose structures for their **rhetorical effect**:

- **Active with *we*** for decisions and contributions: *We argue…*, *We excluded tokens that…* (accepted in most fields today).
- **Passive** for procedures where the agent is obvious: *Tokens were segmented manually.*
- **Tense by section**: Introduction/literature (present + present perfect), Methods (past), Results (past; present for what figures show), Discussion (present for interpretation, modals for implications).
- **Theme choice**: start sentences with what you want the reader to track (the variable, the language, the finding).
- **Clause vs. phrase**: *Because speakers moved* (clause, dynamic) vs. *Because of migration* (phrase, dense).`,
    examples: [
      { t: "We argue that tone loss is contact-induced.", k: "good", note: "Claim → active *we*." },
      { t: "Tokens were segmented manually in Praat.", k: "good", note: "Procedure → passive." },
      { t: "Table 2 showed the mean durations.", k: "meh", note: "Tables *show* (present): they still show it." },
    ],
    items: [
      mcq("ac1", "gram:academic-choices", 66, "Which sentence follows usual tense conventions in a **Results** section?", ["Table 2 shows that mean duration decreased with age.", "Table 2 showed that mean duration decreases with age.", "Table 2 has shown that mean duration decreased.", "Table 2 will show that mean duration decreases."], 0,
        "What a table/figure displays is in the **present** (*shows*); the observed outcome of the study is in the **past** (*decreased*).",
        [null, "Tables still show their content: present. The finding itself is reported in the past.", "Present perfect is odd for what a table displays.", "Future is only for signposting (*Section 4 will discuss*)."]),
      judge("ac2", "gram:academic-choices", 64, "In this paper it is argued by the author that tone loss is contact-induced.", true, false,
        "Grammatical, but the double impersonalisation is clumsy. For your **own claim**, active *we/I* (or *This paper argues*) is clearer and accepted in most fields.",
        "This paper argues that tone loss is contact-induced.", "Introduction"),
      mcq("ac3", "gram:academic-choices", 64, "Which sentence is best for a **Methods** section?", ["We were segmenting the tokens manually.", "Tokens were segmented manually in Praat.", "Tokens are segmented manually by us.", "Segmenting manually the tokens was done."], 1,
        "Procedure with an obvious agent → **past passive**.",
        ["Past progressive suggests an interrupted/background activity.", null, "Present + *by us* is unnatural.", "Garbled word order."]),
      produce("ac4", "gram:academic-choices", 70, "Write **three sentences** about your own research, one for each section: (1) Introduction — state the gap; (2) Methods — one procedure; (3) Discussion — one cautious interpretation. Use the conventional tense/voice for each.",
        "Typical choices: (1) present perfect/present for the gap (*little research has examined…*); (2) past, often passive (*Recordings were made…*); (3) present + modal (*This pattern may reflect…*).",
        { minWords: 40, checklist: ["Introduction sentence uses present / present perfect for the gap", "Methods sentence uses past (active with we or passive)", "Discussion sentence interprets with a hedge", "All three are clearly about my research"] }),
    ],
  },
];
