import type { Lesson } from "./types";
import { mcq, gap, kwt, wf } from "./helpers";

export const UOE: Lesson[] = [
  {
    id: "u-kwt", module: "grammar", group: "Use of English", title: "Key word transformations", tag: "uoe:kwt", lvl: 62, icon: "🔑",
    summary: "Cambridge Part 4: same meaning, a given key word, a strict word limit. Grammar AND lexis.",
    body: `**Format**: C1 Advanced — 6 items, 3–6 words including the key word. C2 Proficiency — 6 items, 3–8 words.

#### Strategy
1. Identify **what changes** between the two sentences (structure, part of speech, fixed phrase).
2. The key word is usually part of a **fixed expression** or **structure** (*bearing on, cast doubt on, no sooner… than, ought to have*).
3. Keep **tense and meaning** identical; don't add or lose information.
4. Count words: **contractions count as two** (*can't* = *can not*).
5. Never change the key word.

#### Common targets
Modal perfects, passive reporting, inversion, conditionals (*but for, if it hadn't been for*), wish/if only, causatives, fixed phrases (*make a deep impression on, have no bearing on, come as no surprise to, take into consideration*).`,
    examples: [
      { t: "The deadline is irrelevant to our decision. → The deadline HAS NO BEARING ON our decision.", k: "good" },
    ],
    items: [
      kwt("kw1", "uoe:kwt", 64, "It was wrong of the authors to ignore the earlier study.", "OUGHT", "The authors", "the earlier study.", ["ought not to have ignored", "oughtn't to have ignored"], "Criticism of a past action: **ought not to have** + past participle."),
      kwt("kw2", "uoe:kwt", 66, "The reviewers were very impressed by the quality of the data.", "DEEP", "The quality of the data", "on the reviewers.", ["made a deep impression", "made a very deep impression"], "Fixed phrase: **make a deep impression on** someone."),
      kwt("kw3", "uoe:kwt", 64, "I had no idea the archive contained so many recordings.", "DID", "Little", "the archive contained so many recordings.", ["did i know", "did i know that", "did i realise", "did i realize"], "*Little* fronted → inversion with *did*."),
      kwt("kw4", "uoe:kwt", 68, "The deadline is irrelevant to our decision.", "BEARING", "The deadline", "our decision.", ["has no bearing on", "doesn't have any bearing on", "does not have any bearing on"], "*Have no bearing on* = be irrelevant to.", { max: 6 }),
      kwt("kw5", "uoe:kwt", 56, "She almost certainly misread the instructions.", "MUST", "She", "the instructions.", ["must have misread"], "Strong deduction about the past: **must have** + PP."),
      kwt("kw6", "uoe:kwt", 58, "There's no point in repeating the experiment.", "WORTH", "It", "the experiment.", ["is not worth repeating", "isn't worth repeating"], "*It is (not) worth* + **-ing**."),
      kwt("kw7", "uoe:kwt", 60, "People expect the results to be published next year.", "EXPECTED", "The results", "next year.", ["are expected to be published"], "Reporting passive: *X is expected to* + passive infinitive."),
      kwt("kw8", "uoe:kwt", 62, "The researchers did not take age into account.", "CONSIDERATION", "The researchers failed to take", ".", ["age into consideration"], "*Take something into consideration* = take into account. *Fail to* replaces the negative.", { min: 3 }),
      kwt("kw9", "uoe:kwt", 55, "I regret not attending the conference.", "WISH", "I", "the conference.", ["wish i had attended", "wish i'd attended", "wish that i had attended"], "Regret about the past → *wish* + **past perfect**."),
      kwt("kw10", "uoe:kwt", 68, "The new evidence makes the theory less convincing.", "CAST", "The new evidence", "the theory.", ["casts doubt on", "casts doubt upon", "casts some doubt on"], "*Cast doubt on* = make something seem less certain or convincing."),
      kwt("kw11", "uoe:kwt", 66, "He is very unlikely to accept the offer.", "CHANCE", "There is", "accepting the offer.", ["little chance of him", "little chance of his", "hardly any chance of him", "very little chance of him", "very little chance of his"], "*There is little chance of* + (object/possessive) + -ing = it is unlikely."),
      kwt("kw12", "uoe:kwt", 56, "Her explanation was so clear that everyone understood it.", "SUCH", "It was", "that everyone understood it.", ["such a clear explanation"], "*Such a* + adjective + noun + *that*."),
      kwt("kw13", "uoe:kwt", 70, "His argument didn't convince me at all.", "LEFT", "His argument", "unconvinced.", ["left me totally", "left me completely", "left me entirely", "left me wholly"], "*Leave someone* + adjective (*unconvinced*), with an intensifier carrying *at all*.", { min: 3 }),
      kwt("kw14", "uoe:kwt", 70, "I was not at all surprised that the paper was rejected.", "SURPRISE", "The rejection of the paper", "to me.", ["came as no surprise", "came as no surprise at all"], "*Come as no surprise to* someone.", { max: 8 }),
      kwt("kw15", "uoe:kwt", 66, "The committee reached a decision very quickly.", "TIME", "It", "to reach a decision.", ["took the committee very little time", "took the committee little time", "took the committee no time", "did not take the committee much time"], "*It takes / took* + someone + time + to-infinitive.", { max: 8 }),
    ],
  },
  {
    id: "u-wf", module: "grammar", group: "Use of English", title: "Word formation", tag: "uoe:wordform", lvl: 60, icon: "🧬",
    summary: "Prefixes, suffixes, negative forms and internal changes (Cambridge Part 3).",
    body: `Ask three questions for every gap:
1. **What part of speech** does the syntax require? (article + __ + noun → adjective; *the* + __ + *of* → noun)
2. **Singular or plural?** Positive or **negative**? (context clues: *but, although, unfortunately*)
3. Does the word need a **prefix** (*un-, in-, im-, ir-, il-, dis-, mis-, over-, under-*) **and** a suffix?

#### Frequent academic suffixes
-tion/-sion, -ment, -ity, -ness, -ance/-ence, -al, -ive, -ous, -able/-ible, -ise/-ize, -ly, -hood, -ship.

#### Spelling traps
*maintain → maintenance*, *pronounce → pronunciation*, *explain → explanation*, *repeat → repetition*, *argue → argument*, *prove → proof*, *deep → depth*, *wide → width*.`,
    examples: [{ t: "The findings have important implications for language policy. (IMPLY)", k: "good" }],
    items: [
      wf("wf1", "uoe:wordform", 66, "The ___ of the results to other populations remains uncertain.", "GENERAL", ["generalisability", "generalizability"], "*General → generalise → generalisable → **generalisability*** (noun after *the… of*)."),
      wf("wf2", "uoe:wordform", 58, "Her argument rests on a ___ assumption.", "QUESTION", ["questionable"], "Adjective between article and noun: *question → **questionable***."),
      wf("wf3", "uoe:wordform", 55, "The findings have important ___ for language policy.", "IMPLY", ["implications"], "Noun after an adjective; plural because of *have* and the general sense: ***implications***."),
      wf("wf4", "uoe:wordform", 55, "The results were broadly ___ with those of earlier studies.", "COMPARE", ["comparable"], "Adjective after *were* (+ *broadly*): ***comparable*** (note stress shift: /ˈkɒmpərəbl/)."),
      wf("wf5", "uoe:wordform", 52, "The questionnaire was completed ___.", "ANONYMOUS", ["anonymously"], "Adverb modifying *completed*: ***anonymously***."),
      wf("wf6", "uoe:wordform", 60, "The two sounds are in complementary ___.", "DISTRIBUTE", ["distribution"], "Fixed phonological term: ***complementary distribution***."),
      wf("wf7", "uoe:wordform", 68, "This interpretation is, frankly, ___: no evidence supports it.", "DEFEND", ["indefensible"], "Negative meaning (*no evidence supports it*) → prefix *in-* + *-ible*: ***indefensible***."),
      wf("wf8", "uoe:wordform", 62, "The policy had several ___ consequences that nobody had foreseen.", "INTEND", ["unintended"], "Negative prefix + participial adjective: ***unintended***."),
      wf("wf9", "uoe:wordform", 62, "The vowel system has been ___ simplified over three generations.", "PROGRESS", ["progressively"], "Adverb: ***progressively***."),
      wf("wf10", "uoe:wordform", 64, "Researchers must guarantee the ___ of participants' data.", "CONFIDENT", ["confidentiality"], "*Confident* (sure) ≠ *confidential* (secret) → noun ***confidentiality***."),
      wf("wf11", "uoe:wordform", 64, "The study suffers from a lack of ___ diversity.", "METHOD", ["methodological"], "Adjective before *diversity*: ***methodological***."),
      wf("wf12", "uoe:wordform", 72, "The theory has been criticised for its ___ of a highly complex phenomenon.", "SIMPLE", ["oversimplification", "over-simplification"], "Criticism (*criticised for*) → excessive simplifying: prefix *over-*: ***oversimplification***."),
      wf("wf13", "uoe:wordform", 56, "The changes were ___ only to trained listeners.", "NOTICE", ["noticeable"], "Adjective after *were*: ***noticeable*** (keeps the *e* to preserve /s/)."),
      wf("wf14", "uoe:wordform", 64, "Accurate ___ of the vowels required careful acoustic analysis.", "PRONOUNCE", ["pronunciation"], "Spelling trap: *pronounce* → ***pronunciation*** (no *o* after *n*).", { basic: true }),
    ],
  },
  {
    id: "u-colloc", module: "vocab", group: "Use of English", title: "Academic collocations", tag: "uoe:collocation", lvl: 60, icon: "🤝",
    summary: "Verb + noun and adverb + adjective partnerships that make writing sound native and precise.",
    body: `Collocations are **conventional word partnerships**. Errors are rarely ungrammatical — they just sound non-native.

#### Verb + noun (research)
*conduct / carry out* research · *test / support / reject* a hypothesis · *draw* a conclusion · *fill / address* a gap · *raise* a question / concerns · *pose* a threat / a challenge · *shed / throw* light on · *reach* a consensus · *play a* (pivotal / key) *role*

#### Adverb + adjective
*highly* significant / unlikely · *widely* used / cited · *closely* related · *heavily* dependent on · *strikingly* similar · *readily* available · *acutely* aware

#### Adjective + noun
*compelling* evidence · *growing* body of research · *sharp* contrast · *broad* consensus · *serious* limitation · *rigorous* analysis`,
    examples: [
      { t: "This study sheds light on an understudied variety.", k: "good" },
      { t: "This study gives light on an understudied variety.", k: "bad" },
    ],
    items: [
      mcq("col1", "uoe:collocation", 56, "This study ___ light on a severely understudied variety.", ["sheds", "gives", "puts", "makes"], 0, "Fixed collocation: **shed (or throw) light on**.", undefined, ["wrong-collocation", "wrong-collocation", "wrong-collocation"].map((x, i) => (i === 0 ? null : x)) as any, { tests: "collocation" }),
      mcq("col2", "uoe:collocation", 54, "The experiment was designed to ___ the hypothesis that frequency predicts reduction.", ["test", "make", "do", "put"], 0, "We **test** (support, confirm, reject) a hypothesis.", undefined, undefined, { tests: "collocation" }),
      mcq("col3", "uoe:collocation", 60, "This thesis aims to ___ a gap in the literature on Uto-Aztecan prosody.", ["fill", "close", "complete", "cover"], 0,
        "**Fill** (or **address**) a gap in the literature.",
        [null, "*Close the gap* usually means reducing a difference between groups (*close the achievement gap*).", "Not a collocate of *gap*.", "Not idiomatic here."], [null, "possible-not-correct", "wrong-collocation", "wrong-collocation"], { tests: "collocation" }),
      mcq("col4", "uoe:collocation", 54, "It is too early to ___ firm conclusions from such a small sample.", ["draw", "make", "take", "get"], 0, "We **draw** conclusions.", [null, "Calque of «hacer conclusiones».", "Not idiomatic.", "Informal and not a collocate."], [null, "false-friend", "wrong-collocation", "wrong-register"], { tests: "collocation" }),
      mcq("col5", "uoe:collocation", 58, "Language shift ___ a serious threat to intergenerational transmission.", ["poses", "makes", "gives", "puts"], 0, "**Pose** a threat / a challenge / a problem / a question.", undefined, undefined, { tests: "collocation" }),
      mcq("col6", "uoe:collocation", 50, "These findings ___ important questions about how proficiency is measured.", ["raise", "rise", "arise", "lift"], 0,
        "*Raise* is **transitive** (raise questions); *rise* and *arise* are intransitive.", [null, "Intransitive: can't take an object.", "Intransitive: *questions arise from…*", "Wrong collocate."], [null, "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong", "wrong-collocation"], { basic: true }),
      mcq("col7", "uoe:collocation", 58, "The argument relies ___ on a single, rather dated source.", ["heavily", "strongly", "hardly", "deeply"], 0, "*Rely* **heavily** on.", [null, "Not the usual collocate with *rely*.", "*Hardly* means 'almost not' — reverses the meaning.", "Not idiomatic."], [null, "wrong-collocation", "reversed", "wrong-collocation"], { tests: "collocation" }),
      mcq("col8", "uoe:collocation", 62, "Schooling played a ___ role in the shift to Spanish.", ["pivotal", "pivot", "pivoting", "turning"], 0, "Adjective + *role*: **pivotal** (key, crucial, central, major)."),
      mcq("col9", "uoe:collocation", 60, "After three meetings, the committee still failed to ___ a consensus.", ["reach", "arrive", "get", "make"], 0, "**Reach** a consensus (or *arrive at* — with the preposition).", [null, "*Arrive* needs *at*.", "Informal.", "Not idiomatic."]),
      mcq("col10", "uoe:collocation", 66, "It should be ___ in mind that the corpus was compiled in the 1970s.", ["borne", "born", "bear", "carried"], 0, "*Bear in mind* → passive: *it should be **borne** in mind* (past participle of *bear*; *born* is only for birth)."),
      mcq("col11", "uoe:collocation", 64, "The authors are ___ aware of the limitations of self-reported data.", ["acutely", "sharply", "severely", "steeply"], 0, "**Acutely aware** = very conscious of.", undefined, undefined, { tests: "collocation" }),
      mcq("col12", "uoe:collocation", 60, "There is a ___ body of research on heritage language phonology.", ["growing", "rising", "raising", "climbing"], 0, "**A growing body of** research/evidence/literature."),
    ],
  },
  {
    id: "u-phrasal", module: "vocab", group: "Use of English", title: "Academic phrasal verbs", tag: "uoe:phrasal", lvl: 58, icon: "🧲",
    summary: "The phrasal verbs that ARE acceptable in academic prose: account for, rule out, stem from, build on…",
    body: `Phrasal verbs are not automatically informal. These are standard in academic writing:

- **account for** (explain / constitute a proportion): *Age accounts for 40% of the variance.*
- **rule out** (exclude a possibility)
- **stem from** (originate in)
- **build on** (develop further from previous work)
- **draw on** (use as a source)
- **put forward / set out** (propose / present)
- **carry out** (conduct)
- **point out** (indicate, note)
- **bring about / give rise to** (cause)
- **single out** (select for special attention)
- **call into question** (cast doubt on)

Less suitable for formal prose: *find out, look into, come up with, get rid of, figure out* — prefer *determine, investigate, devise, eliminate, establish*.`,
    items: [
      gap("pv1", "uoe:phrasal", 58, "We cannot ___ out the possibility that the effect is an artefact of the recording equipment.", ["rule"], "**Rule out** = exclude a possibility."),
      gap("pv2", "uoe:phrasal", 60, "The decline in transmission ___ from a combination of economic and educational factors.", ["stems", "stemmed"], "**Stem from** = originate in."),
      gap("pv3", "uoe:phrasal", 56, "Age ___ for roughly 40% of the variance in vowel duration.", ["accounts", "accounted"], "**Account for** a proportion = constitute it."),
      gap("pv4", "uoe:phrasal", 58, "This thesis ___ on earlier descriptive work by Miller (1996).", ["builds", "draws"], "**Build on** (develop further) / **draw on** (use as a source)."),
      mcq("pv5", "uoe:phrasal", 60, "In Chapter 3, the author ___ a new model of tone sandhi.", ["puts forward", "comes up", "gets across", "brings up"], 0, "**Put forward** = propose (an idea, model, hypothesis).",
        [null, "*Come up with* (with *with*) would be informal; *comes up* alone means 'appears'.", "*Get across* = communicate successfully.", "*Bring up* = mention / raise a child."]),
      mcq("pv6", "uoe:phrasal", 62, "These new data ___ the earlier interpretation into question.", ["call", "put", "bring", "set"], 0, "**Call into question** = cast doubt on."),
      mcq("pv7", "uoe:phrasal", 58, "Which verb is **most appropriate** in a thesis? *We aim to ___ whether the contrast is phonemic.*", ["determine", "find out", "figure out", "work out"], 0, "*Find out, figure out, work out* are conversational; **determine** is the academic equivalent.", null, [null, "wrong-register", "wrong-register", "wrong-register"], { tests: "register" }),
    ],
  },
  {
    id: "u-idioms", module: "vocab", group: "Use of English", title: "Idioms and fixed expressions (C2)", tag: "uoe:idiom", lvl: 70, icon: "🎭",
    summary: "Fixed phrases that C2 Proficiency loves and that educated writers actually use.",
    body: `Fixed expressions frequent in educated prose and in Cambridge C2:

- **at odds with** (in conflict with) · **on a par with** (equal to) · **in the wake of** (following)
- **by and large** (generally) · **to all intents and purposes** (practically)
- **the jury is still out** (no decision yet) · **a moot point** (debatable / irrelevant)
- **fall short of** (fail to reach) · **lend weight to** (support) · **pave the way for** (make possible)
- **a far cry from** (very different from) · **by no means** (not at all)
- **come to terms with** (accept) · **a double-edged sword** (has advantages and disadvantages)
- **take something with a pinch of salt** (be sceptical)

Note: *beg the question* traditionally means 'assume the conclusion' (circular reasoning); using it to mean 'raise the question' is common but criticised by careful writers.`,
    items: [
      mcq("id1", "uoe:idiom", 66, "The new findings are ___ odds with the standard account of the sound change.", ["at", "on", "in", "by"], 0, "**At odds with** = in disagreement with."),
      mcq("id2", "uoe:idiom", 72, "Whether the change is truly complete remains a ___ point.", ["moot", "mute", "mood", "moat"], 0, "**A moot point** = open to debate (or, in AmE, of no practical relevance).", [null, "*Mute* = silent (a common confusion).", "Not related.", "Not related."], [null, "misheard", "misheard", "misheard"]),
      mcq("id3", "uoe:idiom", 66, "The jury is still ___ on whether bilingualism confers a cognitive advantage.", ["out", "in", "off", "over"], 0, "**The jury is (still) out** = no decision has been reached."),
      mcq("id4", "uoe:idiom", 64, "The observed values fall ___ of what the model predicts.", ["short", "low", "down", "behind"], 0, "**Fall short of** = fail to reach."),
      mcq("id5", "uoe:idiom", 64, "These data lend ___ to the contact hypothesis.", ["weight", "heavy", "power", "height"], 0, "**Lend weight / support / credence to** = support."),
      mcq("id6", "uoe:idiom", 60, "Her pioneering fieldwork paved the ___ for later studies of tone.", ["way", "road", "path", "street"], 0, "**Pave the way for** = make something possible."),
      mcq("id7", "uoe:idiom", 64, "By and ___, the speakers agreed with the statement.", ["large", "big", "far", "wide"], 0, "**By and large** = generally, on the whole."),
      mcq("id8", "uoe:idiom", 68, "In the ___ of the 1994 reform, several bilingual schools were closed.", ["wake", "awake", "waking", "woken"], 0, "**In the wake of** = following (often with negative consequences)."),
      gap("id9", "uoe:idiom", 70, "The current system is a far ___ from the one envisaged by the original planners.", ["cry"], "**A far cry from** = very different from."),
      mcq("id10", "uoe:idiom", 72, "Social media is something of a ___-edged sword for minority languages: it increases visibility but also exposure to English.", ["double", "two", "twice", "dual"], 0, "**A double-edged sword** = something with both advantages and disadvantages."),
    ],
  },
  {
    id: "u-opencloze", module: "grammar", group: "Use of English", title: "Open cloze: grammar words", tag: "uoe:open-cloze", lvl: 62, icon: "🕳️",
    summary: "One word per gap: prepositions, conjunctions, auxiliaries, determiners, parts of fixed phrases.",
    body: `Cambridge Part 2: **one word** per gap, usually a **function word**.

Look for:
- Missing **auxiliaries** in inversions (*Not only __ they…* → *did*)
- Parts of **fixed phrases** (*as __ as*, *by no __*, *in __ of*)
- **Comparative** structures (*the more…, __ more…* → *the*)
- **Linkers** (*__ the fact that* → *despite*)
- **Relative pronouns** and **quantifiers** (*all of __*, *__ of whom*)

Contractions are not accepted as one word.`,
    items: [
      gap("oc1", "uoe:open-cloze", 56, "___ the fact that the sample was small, the trend was unmistakable.", ["Despite"], "**Despite the fact that** + clause (one word only, so not *In spite of*)."),
      gap("oc2", "uoe:open-cloze", 60, "Not ___ did the author ignore the data, but she also misrepresented it.", ["only"], "**Not only** + inversion… **but also**."),
      gap("oc3", "uoe:open-cloze", 56, "The results were ___ striking that we decided to repeat the analysis.", ["so"], "**So** + adjective + *that*."),
      gap("oc4", "uoe:open-cloze", 60, "It was not ___ 2010 that the first grammar of the language was published.", ["until", "till"], "*It was not until* + time + *that*: emphasises lateness."),
      gap("oc5", "uoe:open-cloze", 64, "Much ___ we tried, we could not locate the remaining speakers.", ["as"], "**Much as** = although (concessive)."),
      gap("oc6", "uoe:open-cloze", 58, "The more data we collected, ___ clearer the pattern became.", ["the"], "Correlative comparative: **the** more…, **the** clearer…"),
      gap("oc7", "uoe:open-cloze", 52, "She has worked on Guarijío phonology ___ over a decade.", ["for"], "Duration → **for**.", { basic: true }),
      gap("oc8", "uoe:open-cloze", 66, "Speakers of all ages, young and old ___, used the innovative form.", ["alike"], "**X and Y alike** = both X and Y."),
      gap("oc9", "uoe:open-cloze", 66, "___ for the community's support, the project would have failed.", ["But"], "**But for** + NP = if it hadn't been for."),
      gap("oc10", "uoe:open-cloze", 62, "The proposal was by ___ means universally accepted.", ["no"], "**By no means** = not at all."),
    ],
  },
  {
    id: "u-mccloze", module: "vocab", group: "Use of English", title: "Lexical nuance (multiple-choice cloze)", tag: "uoe:mc-cloze", lvl: 64, icon: "🎯",
    summary: "Four near-synonyms, one fits: collocation, dependent prepositions and connotation decide.",
    body: `In Part 1 all options are usually **similar in meaning**. The answer is decided by:
1. **Collocation** (*fierce opposition*, not *hard opposition*)
2. **Grammar after the word** (*attribute X **to** Y*, *credit Y **with** X*)
3. **Connotation** (*notorious* is negative, *renowned* positive)
4. **Fixed phrases**

Don't choose the option that 'means the right thing' in Spanish — choose the one that **fits the pattern**.`,
    items: [
      mcq("mc1", "uoe:mc-cloze", 60, "The proposal met with ___ opposition from senior faculty.", ["fierce", "hard", "steep", "thick"], 0, "**Fierce** opposition / competition / debate.", [null, "Not a collocate of *opposition*.", "*Steep* goes with rises, prices, learning curves.", "Not idiomatic."], [null, "wrong-collocation", "wrong-collocation", "wrong-collocation"], { tests: "collocation" }),
      mcq("mc2", "uoe:mc-cloze", 62, "The new data fully ___ out the earlier claim.", ["bear", "carry", "hold", "stand"], 0, "**Bear out** = confirm, support.", [null, "*Carry out* = conduct.", "*Hold out* = resist / last.", "*Stand out* = be noticeable."], [null, "grammar-ok-meaning-wrong", "grammar-ok-meaning-wrong", "grammar-ok-meaning-wrong"], { tests: "meaning" }),
      mcq("mc3", "uoe:mc-cloze", 64, "The decline is often ___ to urbanisation, although schooling is likely to be more important.", ["attributed", "credited", "blamed", "ascribed on"], 0,
        "**Attribute X to Y** = say that X is caused by Y. Neutral, academic.",
        [null, "*Credit* is positive and takes *with* (*credited with*) or *to* for positive achievements.", "*Blame* is evaluative and usually takes *on* or *for*.", "*Ascribe* takes *to*, not *on*."], [null, "wrong-register", "wrong-register", "meaning-ok-grammar-wrong"], { tests: "both" }),
      mcq("mc4", "uoe:mc-cloze", 64, "The village is ___ for its pottery, which is sold throughout the region.", ["renowned", "notorious", "infamous", "remarkable"], 0, "**Renowned for** = famous for (positive).", [null, "*Notorious* = famous for something bad.", "*Infamous* = well known for something bad.", "*Remarkable* doesn't take *for* in this sense."], [null, "grammar-ok-meaning-wrong", "grammar-ok-meaning-wrong", "meaning-ok-grammar-wrong"], { tests: "meaning" }),
      mcq("mc5", "uoe:mc-cloze", 66, "The committee ___ the proposal down on the grounds of cost.", ["turned", "put", "sent", "took"], 0, "**Turn down** = reject.", [null, "*Put down* = criticise / suppress.", "Not a phrasal verb with this meaning.", "*Take down* = write / dismantle."]),
      mcq("mc6", "uoe:mc-cloze", 68, "Funding cuts have ___ the project's long-term viability.", ["jeopardised", "risked", "endangered of", "threatened to"], 0, "**Jeopardise** + object = put at risk.", [null, "*Risk* takes the thing you might lose but sounds odd with *viability*; also changes the agent's intention.", "*Endanger* takes a direct object (no *of*).", "*Threaten to* + verb, not + noun."], [null, "possible-not-correct", "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong"]),
    ],
  },
];
