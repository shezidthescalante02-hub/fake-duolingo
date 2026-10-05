import type { Lesson } from "./types";
import { mcq, gap, kwt, judge, spot, order, produce } from "./helpers";

export const GRAMMAR_2: Lesson[] = [
  {
    id: "g-relatives", module: "grammar", group: "Clause", title: "Relative clauses", tag: "gram:relatives", lvl: 58, icon: "🧩",
    summary: "Defining vs. non-defining, preposition + whom/which, quantifier + of which, and sentential which.",
    body: `#### Defining vs. non-defining
- **Defining** (restrictive): identifies the referent; no commas; *that* is possible: *The speakers **who/that** grew up in the village…*
- **Non-defining**: adds information; commas; **no *that***: *Guarijío, **which** is spoken in Sonora and Chihuahua, …*
- **Sentential *which***: refers to a whole clause: *Several speakers refused to be recorded, **which** reduced the sample.*

#### Formal patterns
- Preposition + *whom / which* (no *that*, no *who*): *the colleague **with whom** I worked*, *the extent **to which**…*
- Quantifier + *of whom / of which*: *120 speakers, **most of whom** were bilingual*.
- *whose* for possession (also with inanimates): *a language **whose** tonal system…*
- Reduced relatives: *the data **collected** in 2019*, *speakers **living** in the city*.

#### Typical errors
Resumptive pronouns (✗ *the paper that I read **it***), *that* after a comma, and *what* used as a relative (✗ *everything what*).`,
    examples: [
      { t: "We interviewed 120 speakers, most of whom were bilingual.", k: "good" },
      { t: "We interviewed 120 speakers, most of them were bilingual.", k: "bad", note: "Comma splice: two independent clauses." },
      { t: "Guarijío, that is spoken in Sonora, has two main varieties.", k: "bad", note: "No *that* in non-defining clauses." },
    ],
    items: [
      mcq("rc1", "gram:relatives", 58, "We interviewed 120 speakers, most of ___ were bilingual.", ["whom", "them", "who", "which"], 0,
        "Quantifier + **of whom** (people) / **of which** (things) introduces a non-defining relative clause.",
        [null, "*most of them were* creates a comma splice (two main clauses joined by a comma).", "After a preposition we need *whom*.", "*Which* is for things."], [null, "meaning-ok-grammar-wrong", "possible-not-correct", null]),
      mcq("rc2", "gram:relatives", 55, "This is the extent ___ the model can be generalised.", ["to which", "which", "that", "where"], 0, "*The extent* **to which** — fixed formal pattern with a fronted preposition."),
      spot("rc3", "gram:relatives", 55, ["Guarijío,", "that is spoken in", "Sonora and Chihuahua,", "has two main varieties."], 1, "which is spoken in",
        "Non-defining relative clauses (between commas) cannot be introduced by **that**."),
      gap("rc4", "gram:relatives", 56, "It is a language ___ tonal system has never been fully described.", ["whose"],
        "Possession → **whose**, which is also used with inanimate antecedents."),
      mcq("rc5", "gram:relatives", 60, "Several speakers declined to be recorded, ___ reduced the final sample considerably.", ["which", "that", "what", "it"], 0,
        "**Sentential** *which* refers to the whole previous clause (the fact that they declined).",
        [null, "*That* cannot introduce a non-defining clause.", "*What* is not a relative pronoun with an antecedent.", "*It* creates a comma splice."]),
      kwt("rc6", "gram:relatives", 60, "I worked with a colleague on the project. She has since moved to Leiden.", "WHOM", "The colleague", "has since moved to Leiden.", ["with whom i worked", "with whom i worked on the project"],
        "Formal relative with a fronted preposition: *with whom I worked*.", { max: 7 }),
      spot("rc7", "gram:relatives", 50, ["This is the paper", "that I mentioned it", "in my presentation", "last week."], 1, "that I mentioned",
        "English does not use **resumptive pronouns** in relative clauses: the relative pronoun already fills the object slot.", { basic: true }),
    ],
  },
  {
    id: "g-participial", module: "grammar", group: "Clause", title: "Participial and non-finite clauses", tag: "gram:participial", lvl: 62, icon: "🌿",
    summary: "Having + PP, being + PP, reduced adverbial clauses, and the dangling participle trap.",
    body: `Non-finite clauses compress information and are typical of academic prose.

- **-ing** (simultaneous or causal): ***Drawing** on corpus data, the study shows…*
- **Having + past participle** (prior action): ***Having analysed** the data, we…*
- **Past participle** (passive): ***Compared** with Spanish, Guarijío has…*
- **Being + PP** (passive, often causal): ***Being recorded** in noisy conditions, the files required filtering.*
- With subordinators: *when analysing*, *while acknowledging*, *once completed*, *if confirmed*.

#### The dangling participle
The implied subject of the participle must be the **subject of the main clause**.
✗ *Having analysed the data, the results showed…* (the results didn't analyse anything)
✓ *Having analysed the data, **we** found…*`,
    examples: [
      { t: "Having analysed the data, we found a clear pattern.", k: "good" },
      { t: "Having analysed the data, a clear pattern emerged.", k: "bad", note: "Dangling: the pattern did not analyse the data." },
      { t: "Compared with Spanish, Guarijío has a richer system of verbal suffixes.", k: "good" },
    ],
    items: [
      spot("pc1", "gram:participial", 62, ["Having analysed the data,", "a clear pattern", "emerged across", "all age groups."], 1, "we identified a clear pattern",
        "**Dangling participle**: the understood subject of *having analysed* must be the main-clause subject. A pattern cannot analyse data.", { tests: "grammar" } as any),
      mcq("pc2", "gram:participial", 60, "___ in noisy conditions, the files required extensive filtering.", ["Recorded", "Recording", "Having recorded", "To record"], 0,
        "The files **were recorded** (passive meaning): past participle clause.",
        [null, "Active: the files would be doing the recording.", "Active and prior: the files recorded something.", "Purpose meaning — doesn't fit."], [null, "meaning-ok-grammar-wrong", null, null]),
      mcq("pc3", "gram:participial", 62, "___ the limitations of the sample, the authors nevertheless argue that the trend is robust.", ["While acknowledging", "Although acknowledging of", "Despite acknowledge", "Acknowledged"], 0,
        "*While* + **-ing**: a reduced concessive clause with the same subject as the main clause.",
        [null, "*Acknowledge* takes a direct object (no *of*).", "*Despite* needs a noun or -ing (*despite acknowledging*).", "Passive participle: the authors were not acknowledged."]),
      kwt("pc4", "gram:participial", 64, "After we had completed the pilot study, we revised the questionnaire.", "HAVING", "", "the pilot study, we revised the questionnaire.", ["having completed"],
        "Perfect participle (*having* + PP) for an action completed before the main clause.", { min: 2 }),
      judge("pc5", "gram:participial", 64, "Drawing on data from three communities, the study argues that shift is driven by schooling.", true, true,
        "Correct and typical of academic prose. Strictly, a study cannot 'draw on' data, but **metonymic subjects** (*this study, this paper*) are conventional in academic English and accepted with verbs like *argue, show, draw on*.", undefined, "Abstract"),
      gap("pc6", "gram:participial", 60, "___ (compare) with Spanish, Guarijío has a far richer system of verbal suffixes.", ["Compared"], "Fixed reduced clause: **Compared with/to** + NP (passive participle)."),
    ],
  },
  {
    id: "g-np", module: "grammar", group: "Noun phrase", title: "Complex noun phrases", tag: "gram:np-complex", lvl: 66, icon: "🧱",
    summary: "Pre- and post-modification, noun stacks, appositives — the engine of academic density.",
    body: `Academic prose packs information into **noun phrases** rather than clauses.

- **Premodification**: *a **widely cited** corpus-based study*, *language **contact** effects*
- **Postmodification**: PPs (*the role **of tone in lexical contrast***), relative/participle clauses (*the speakers **recorded in 2019***), to-infinitives (*an attempt **to model variation***), appositives (*Guarijío, **a Uto-Aztecan language**,…*)
- **Noun + noun** stacks: keep them readable (max 3–4 nouns): *heritage speaker vowel production* is acceptable; longer stacks become opaque.

#### Agreement trap
The verb agrees with the **head noun**, not the closest noun: *The **distribution** of these variants **is**…*`,
    examples: [
      { t: "The distribution of these variants across age groups is uneven.", k: "good" },
      { t: "The distribution of these variants across age groups are uneven.", k: "bad", note: "Head = distribution (singular)." },
    ],
    items: [
      mcq("np1", "gram:np-complex", 58, "The distribution of these variants across the three age groups ___ uneven.", ["is", "are", "were", "have been"], 0,
        "The head of the subject is **distribution** (singular); *variants* and *groups* are inside postmodifiers.",
        [null, "Agreement with the nearest noun (*groups*) — classic attraction error.", "Same agreement error.", "Same agreement error."], [null, "word-match", "word-match", "word-match"], { tests: "grammar" }),
      order("np2", "gram:np-complex", 66, "What did the paper actually find?", ["a", "significant", "age-related", "decline", "in", "tone", "discrimination"],
        "Premodifiers follow a typical order (evaluation → classifying modifier → head), and the PP postmodifies the head: *a significant age-related decline in tone discrimination*.", { fixed: "It found", end: "." }),
      judge("np3", "gram:np-complex", 70, "The heritage speaker Spanish vowel reduction perception study results suggest a training effect.", true, false,
        "Technically grammatical, but the six-noun stack is **opaque**. Unpack it with postmodification.",
        "The results of the study on how heritage speakers perceive Spanish vowel reduction suggest a training effect.", "Results section"),
      gap("np4", "gram:np-complex", 62, "Guarijío, ___ Uto-Aztecan language spoken in Sonora and Chihuahua, has fewer than 3,000 speakers.", ["a"],
        "An **appositive** NP renames the head; it takes the indefinite article when it classifies (one of many Uto-Aztecan languages)."),
      mcq("np5", "gram:np-complex", 68, "Which version is the most concise and natural in academic prose?", [
        "Children who are acquiring two languages simultaneously show patterns that differ.",
        "Simultaneous bilingual children show different acquisition patterns.",
        "Children that acquire at the same time two languages show different patterns.",
        "Bilingual simultaneous acquiring children show patterns different."], 1,
        "Option B condenses the relative clause into **premodifiers** (*simultaneous bilingual children*) and a compound (*acquisition patterns*) without losing meaning.",
        ["Grammatical, but wordy; *patterns that differ* is vague (differ from what?).", null, "Word order error (*acquire at the same time two languages*) — Spanish-like placement of the adverbial.", "Ungrammatical premodifier order and *patterns different*."], ["possible-not-correct", null, "meaning-ok-grammar-wrong", null], { tests: "register" }),
    ],
  },
  {
    id: "g-coordsub", module: "grammar", group: "Sentence", title: "Coordination and subordination", tag: "gram:coord-subord", lvl: 58, icon: "🪢",
    summary: "Linking ideas with the right logical relation and the right grammatical category (although vs. despite vs. however).",
    body: `Many 'connector' errors are **category** errors: the logical relation is right, the grammar is wrong.

| Relation | Conjunction (+ clause) | Preposition (+ NP / -ing) | Adverb (new sentence / ; ) |
|---|---|---|---|
| Concession | although, even though, while | despite, in spite of | however, nevertheless |
| Cause | because, since, as | because of, due to, owing to | therefore, consequently |
| Contrast | whereas, while | unlike, in contrast to | in contrast, conversely |
| Purpose | so that, in order that | in order to (+ verb) | — |

- ✗ *Despite the sample was small* → *Although the sample was small* / *Despite the small sample* / *Despite the fact that…*
- ✗ *The sample was small, however the effect was robust.* → comma splice; use *; however,* or a full stop.
- *Due to* is adjectival in strict usage (*The delay was due to…*); *owing to / because of* are safer at the start of a sentence in very formal writing.`,
    examples: [
      { t: "Although the sample was small, the effect was robust.", k: "good" },
      { t: "Despite the sample was small, the effect was robust.", k: "bad" },
      { t: "The sample was small; however, the effect was robust.", k: "good" },
    ],
    items: [
      mcq("cs1", "gram:coord-subord", 55, "___ the sample was small, the effect was remarkably robust.", ["Although", "Despite", "However", "In spite of"], 0,
        "A full clause (*the sample was small*) needs a **subordinating conjunction**.",
        [null, "*Despite* is a preposition: + NP or -ing (*Despite the small sample*).", "*However* is an adverb; it can't subordinate a clause.", "Also a preposition."], [null, "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong"], { tests: "grammar", basic: true }),
      spot("cs2", "gram:coord-subord", 56, ["The sample was small,", "however the effect", "was robust across", "all conditions."], 1, "; however, the effect",
        "**Comma splice**: *however* is an adverb, not a conjunction. Use a semicolon or full stop before it, and a comma after it."),
      kwt("cs3", "gram:coord-subord", 60, "Although the data were limited, the authors drew strong conclusions.", "SPITE", "In", "the data, the authors drew strong conclusions.", ["spite of the limited", "spite of limited"],
        "*In spite of* + **NP**: turn the clause into a noun phrase (*the limited data*)."),
      mcq("cs4", "gram:coord-subord", 58, "Older speakers retained the contrast, ___ younger speakers merged the two vowels.", ["whereas", "despite", "however", "unlike"], 0,
        "Contrast between two clauses → *whereas* (or *while*).",
        [null, "Preposition: can't introduce a clause.", "Adverb: would need a new sentence or semicolon.", "Preposition: *unlike younger speakers, who…*"]),
      gap("cs5", "gram:coord-subord", 58, "Recordings were made in a quiet room ___ that background noise would not affect the acoustic measurements.", ["so"],
        "*So that* + clause expresses **purpose**."),
      produce("cs6", "gram:coord-subord", 60, "Combine these three ideas into **one or two well-linked sentences**, showing concession and consequence:\n\n- The corpus is relatively small.\n- It covers three generations of speakers.\n- It allows us to trace change in apparent time.",
        "Good answers subordinate one idea to another instead of listing them, e.g. a concession (*Although…*) and a consequence or purpose relation.",
        { minWords: 20, model: "Although the corpus is relatively small, it covers three generations of speakers and therefore allows us to trace change in apparent time.", checklist: ["Uses a concessive structure correctly", "Uses a consequence/result link", "No comma splice", "The logical relations are accurate"] }),
    ],
  },
  {
    id: "g-embedding", module: "grammar", group: "Sentence", title: "Embedding and content clauses", tag: "gram:embedding", lvl: 62, icon: "🪆",
    summary: "That-clauses, wh-clauses as subjects/objects, extraposition with it, and the subjunctive.",
    body: `**Embedding** places a clause inside another as a constituent.

- **That-clauses** as complements: *The results suggest **that the contrast is weakening**.*
- **Wh-clauses** (embedded questions, nominal relatives): ***What the data show** is a gradual merger.* / *It is unclear **whether** the change is complete.*
- **Extraposition**: heavy clausal subjects are moved to the end with dummy *it*: *That the change is recent is clear* → ***It is clear that** the change is recent.*
- **Mandative subjunctive** after *recommend, suggest, insist, require, essential, vital*: *The committee recommended that the study **be** replicated.*
- *Whether* (not *if*) after prepositions and as subject: *the question **of whether**…*, ***Whether** this holds is unclear.*`,
    examples: [
      { t: "It is unclear whether the change is complete.", k: "good" },
      { t: "The committee recommended that the study be replicated.", k: "good", note: "Mandative subjunctive (formal)." },
      { t: "The debate about if the change is complete continues.", k: "bad", note: "After a preposition: whether." },
    ],
    items: [
      mcq("em1", "gram:embedding", 60, "The debate about ___ the change is complete shows no sign of being resolved.", ["whether", "if", "that", "what"], 0,
        "After a **preposition**, only *whether* can introduce an embedded yes/no question.",
        [null, "*If* cannot follow a preposition.", "*That* clauses cannot follow prepositions (*about that…*).", "*What* would need a gap in the clause."], [null, "possible-not-correct", null, null]),
      mcq("em2", "gram:embedding", 66, "The reviewers insisted that the authors ___ the raw data.", ["release", "released", "would release", "to release"], 0,
        "**Mandative subjunctive**: after *insist (that)* in the sense of 'demand', formal English uses the base form. (*should release* is also correct, especially in BrE.)",
        [null, "Past form reads as a report of fact (*insisted that they had released*) — a different meaning of *insist*.", "Not standard here.", "*Insist* doesn't take *that* + to-infinitive."], [null, "grammar-ok-meaning-wrong", null, null], { tests: "grammar" }),
      kwt("em3", "gram:embedding", 62, "That the sound change is recent is clear.", "CLEAR", "It", "the sound change is recent.", ["is clear that"],
        "**Extraposition**: move the heavy clausal subject to the end and use dummy *it*.", { min: 2 }),
      kwt("em4", "gram:embedding", 66, "The data show a gradual merger, not an abrupt one.", "WHAT", "", "is a gradual merger, not an abrupt one.", ["what the data show", "what the data shows"],
        "A **pseudo-cleft** with a nominal relative clause (*What the data show is…*) puts the new information in focus at the end.", { min: 3 }),
      gap("em5", "gram:embedding", 64, "It is essential that every participant ___ (sign) the consent form before the session.", ["sign", "should sign"],
        "*It is essential that* + **subjunctive** (*sign*) or *should* + infinitive."),
    ],
  },
  {
    id: "g-nominal", module: "grammar", group: "Academic grammar", title: "Nominalization", tag: "gram:nominalization", lvl: 64, icon: "🏗️",
    summary: "Turning processes into things: how academic English packages information — and when it goes too far.",
    body: `**Nominalization** turns verbs and adjectives into nouns: *analyse → analysis*, *vary → variation*, *important → importance*.

#### Why academic writers use it
- **Packaging**: a whole clause becomes an NP that can be the subject of the next sentence (*Speakers shifted to Spanish. **This shift** was…*).
- **Abstraction and density**: more information per clause.
- **Agent-backgrounding**: *The **reduction** of the vowel…* (who reduces it?).

#### When it goes wrong
- Stacked nominalizations with weak verbs: *The **implementation** of the **evaluation** of the **intervention** was **undertaken**.* → *We evaluated the intervention.*
- Hiding responsibility when the agent matters.

**Aim**: one or two strong nominalizations per sentence + an informative verb (*reveals, undermines, accounts for*).`,
    examples: [
      { t: "Speakers rapidly shifted to Spanish. This shift coincided with the arrival of state schooling.", k: "good" },
      { t: "The implementation of the evaluation of the intervention was undertaken by the team.", k: "bad", note: "Over-nominalised: say who did what." },
    ],
    items: [
      mcq("nm1", "gram:nominalization", 62, "Which sentence best **packages** the previous idea so the text can continue? *Younger speakers increasingly avoid the glottal stop.* ___ appears to be driven by contact with Spanish.", ["This avoidance", "They avoid it", "Avoiding", "The avoid"], 0,
        "A **nominalization** with *this* (*this avoidance*) summarises the previous clause and becomes the topic of the new sentence — a key cohesion device.",
        [null, "A full clause cannot be the subject here.", "Possible in principle (*Avoiding it appears…*) but vague without the object.", "*Avoid* is a verb."], [null, null, "possible-not-correct", null], { tests: "register" }),
      gap("nm2", "gram:nominalization", 60, "The ___ (vary) between speakers was greater than expected.", ["variation", "variability"],
        "*Vary* → *variation* (the fact of varying) or *variability* (the property of being variable). Both fit here."),
      judge("nm3", "gram:nominalization", 66, "The implementation of the evaluation of the intervention was undertaken by the research team.", true, false,
        "Grammatical but **over-nominalised**: three abstract nouns and an empty verb (*was undertaken*). The real action is *evaluate*.",
        "The research team evaluated the intervention.", "Methods section"),
      produce("nm4", "gram:nominalization", 66, "Rewrite the two sentences as **one** sentence by nominalising the first one:\n\n*The government closed rural schools in the 1970s. As a result, many families moved to the city.*",
        "Nominalising the first clause (*The closure of rural schools in the 1970s*) lets it become the subject of a causal verb (*led to, prompted, triggered*).",
        { minWords: 10, model: "The closure of rural schools in the 1970s prompted many families to move to the city.", checklist: ["The first clause is turned into a noun phrase", "A precise causal verb links the ideas (led to, prompted, resulted in…)", "No loss of meaning", "No unnecessary extra nominalizations"] }),
      mcq("nm5", "gram:nominalization", 64, "Choose the most academic and precise version.", [
        "Because people moved a lot, the language changed.",
        "Large-scale migration accelerated language change.",
        "The fact that there was a lot of moving of people made the language change.",
        "People's moving made the change of the language happen faster."], 1,
        "Two nominalizations (*migration*, *language change*) plus an informative verb (*accelerated*) — dense, precise and readable.",
        ["Clear but informal (*a lot*), and *changed* loses the idea of speed.", null, "Wordy and informal.", "Clumsy gerund + empty causative *made… happen*."], null, { tests: "register" }),
    ],
  },
  {
    id: "g-infostructure", module: "grammar", group: "Academic grammar", title: "Information structure", tag: "gram:info-structure", lvl: 68, icon: "🎯",
    summary: "Given → new, end-focus, end-weight, clefts and fronting: why a correct sentence can still be badly built.",
    body: `English prefers **given information first** and **new, heavy information last** (end-focus, end-weight).

#### Tools
- **It-cleft**: *It was **the school policy** that triggered the shift* (contrastive focus).
- **Wh-/pseudo-cleft**: *What triggered the shift **was the school policy**.*
- **Passive** to keep the topic as subject: *Guarijío has two varieties. **It is spoken**…* (topic continuity).
- **Existential *there***: introduces new entities: *There **is** little research on…*
- **Fronting**: *More problematic is the claim that…*

#### Diagnostic question
Does each sentence **begin** with something the reader already knows (often the end of the previous sentence)? If not, the paragraph feels choppy even when every sentence is grammatical.`,
    examples: [
      { t: "The shift was triggered by school policy. This policy, introduced in 1952, banned indigenous languages in class.", k: "good", note: "*policy* ends one sentence and starts the next." },
      { t: "The shift was triggered by school policy. Indigenous languages were banned in class by a policy introduced in 1952.", k: "meh", note: "Grammatical, but the link is weaker." },
    ],
    items: [
      mcq("is1", "gram:info-structure", 66, "*Many Guarijío speakers shifted to Spanish in the 1960s.* Which sentence continues the text most cohesively?", [
        "Rural schooling, which banned the language in class, largely drove this shift.",
        "A ban on the language in rural schools was what largely drove the thing.",
        "Banned in class, the language rural schools largely drove the shift.",
        "Largely, rural schools drove it, banning the language in class."], 0,
        "The best continuation puts **new information** (rural schooling) in a clear subject and keeps **this shift** (given) explicit — and avoids vague *thing/it*.",
        [null, "*the thing* is vague and the cleft adds nothing.", "Garbled: the participle has no clear controller.", "*it* is ambiguous and the adverb placement is awkward."], null, { tests: "register" }),
      kwt("is2", "gram:info-structure", 64, "School policy, not economic pressure, triggered the shift.", "WAS", "It", "that triggered the shift, not economic pressure.", ["was school policy"],
        "An **it-cleft** gives contrastive focus to *school policy*.", { min: 2 }),
      kwt("is3", "gram:info-structure", 68, "We need more longitudinal data.", "WHAT", "", "more longitudinal data.", ["what we need is"],
        "A **pseudo-cleft** (*What we need is…*) creates end-focus on the new element.", { min: 3 }),
      judge("is4", "gram:info-structure", 70, "A new framework for analysing tone in Uto-Aztecan languages that takes into account both phonetic and morphological evidence is proposed in this paper.", true, false,
        "Grammatical but **top-heavy**: a 24-word subject before a short predicate violates end-weight. Use active voice or extraposition.",
        "This paper proposes a new framework for analysing tone in Uto-Aztecan languages that takes into account both phonetic and morphological evidence.", "Introduction"),
      mcq("is5", "gram:info-structure", 62, "___ little research on prosody in Uto-Aztecan languages.", ["There is", "It is", "There are", "Exists"], 0,
        "**Existential there** introduces new information; *research* is uncountable → singular *is*.",
        [null, "Dummy *it* doesn't introduce entities (Spanish *hay* ≠ *it is*).", "*Research* is uncountable.", "English requires an overt subject."], [null, "false-friend", "meaning-ok-grammar-wrong", null], { basic: true }),
    ],
  },
  {
    id: "g-cohesion", module: "grammar", group: "Academic grammar", title: "Cohesion: reference, substitution, ellipsis", tag: "gram:cohesion", lvl: 62, icon: "🧵",
    summary: "this + noun, the former/the latter, do so, one/ones, and connectors with the right logic.",
    body: `Cohesion devices tie sentences together (Halliday & Hasan's categories):

- **Reference**: *this / these + summary noun* (*this finding, these limitations*). Bare *this* is often ambiguous: prefer ***this** pattern*.
- **Comparative reference**: *the former / the latter*, *such*, *similar*, *the same*.
- **Substitution**: *one / ones* (nouns), *do so* (verb phrases), *so / not* (clauses: *If so, …*).
- **Ellipsis**: *Some speakers retained the contrast; others did not [retain it].*
- **Conjunctive cohesion**: connectors must match the logical relation (*moreover* adds, *however* contrasts, *thus* concludes).
- **Lexical cohesion**: repetition, synonyms, hypernyms (*Guarijío… the language…*).`,
    examples: [
      { t: "Two explanations have been proposed: contact and drift. The former is better supported.", k: "good" },
      { t: "Participants were asked to read the list aloud, and most did so without hesitation.", k: "good" },
    ],
    items: [
      mcq("ch1", "gram:cohesion", 60, "Two explanations have been proposed: contact with Spanish and internal drift. ___ is better supported by the historical record.", ["The former", "The first one of them", "Former", "That one before"], 0,
        "**The former / the latter** refer back to the first / second of two items.", undefined, undefined, { tests: "register" }),
      gap("ch2", "gram:cohesion", 62, "Participants were asked to read the list aloud, and most did ___ without hesitation.", ["so"],
        "**Do so** substitutes for a verb phrase (*read the list aloud*) in formal style."),
      mcq("ch3", "gram:cohesion", 58, "The effect was found in the younger cohort. ___, it was absent among speakers over sixty.", ["In contrast", "Moreover", "Therefore", "Similarly"], 0,
        "The relation is **contrast** (found vs. absent).",
        [null, "*Moreover* adds a similar point.", "*Therefore* signals a consequence.", "*Similarly* signals similarity — the opposite relation."], [null, "reversed", "reversed", "reversed"], { tests: "meaning" }),
      judge("ch4", "gram:cohesion", 64, "Some participants found the task easy. This was surprising.", true, false,
        "Grammatical, but bare *this* is **vague**: what was surprising — the finding, the participants, the ease? Add a summary noun.",
        "Some participants found the task easy. This finding was surprising, given the complexity of the stimuli.", "Results section"),
      mcq("ch5", "gram:cohesion", 60, "Older speakers retained the contrast; younger speakers ___.", ["did not", "were not", "did not it", "not"], 0,
        "**Ellipsis** with auxiliary *do*: *did not [retain the contrast]*."),
    ],
  },
];
