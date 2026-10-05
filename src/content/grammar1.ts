import type { Lesson } from "./types";
import { mcq, gap, kwt, judge, spot } from "./helpers";

export const GRAMMAR_1: Lesson[] = [
  {
    id: "g-tense", module: "grammar", group: "Verb phrase", title: "Tense and aspect", tag: "gram:tense-aspect", lvl: 52, icon: "⏳",
    summary: "Tense locates an event in time; aspect presents its internal structure (completed, ongoing, relevant now). Exams test the combination.",
    body: `English grammaticalises **two tenses** (past vs. non-past) and **two aspects** (perfect and progressive), which combine freely. Most exam items test whether you can read the *time frame* signalled by the context.

#### What the context tells you
- A period that **extends to now** (*over the past decade*, *since 2015*, *so far*) → present perfect: *Research **has shown**…*
- A **finished, located** time (*in 2019*, *last year*, *when I was in Hermosillo*) → past simple.
- An event **before another past event** → past perfect: *By the time the grant arrived, the season **had ended**.*
- A deadline in the future seen as completed → future perfect: *By June we **will have transcribed** all the data.*
- **Stative verbs** (*seem, contain, belong, know, consist*) resist the progressive. When they accept it, the meaning shifts (*She **is being** difficult* = behaving).

#### Academic tense conventions
- Present for current consensus and what a text *does*: *Smith (2019) **argues** that…*, *Table 2 **shows**…*
- Past for the procedures of a specific study: *García (2019) **recorded** 120 speakers.*
- Present perfect for the state of a research area: *Several studies **have examined**…*
- *This is the first/second time* + present perfect: *This is the first time the archive **has been opened**.*`,
    examples: [
      { t: "Over the past two decades, researchers have paid considerable attention to language endangerment.", k: "good" },
      { t: "Over the past two decades, researchers paid considerable attention to language endangerment.", k: "bad", note: "The period reaches the present: past simple clashes with it." },
      { t: "In 2019, García recorded 120 bilingual speakers.", k: "good" },
      { t: "The data are seeming to suggest a correlation.", k: "bad", note: "Stative verb in the progressive." },
      { t: "I was wondering whether you might be willing to share your dataset.", k: "good", note: "Past progressive as politeness (distancing), not past time." },
    ],
    items: [
      mcq("ta1", "gram:tense-aspect", 52, "Over the past two decades, researchers ___ considerable attention to language endangerment.", ["paid", "have paid", "had paid", "were paying"], 1,
        "*Over the past two decades* describes a period that **extends up to the present**, which is the core use of the present perfect.",
        ["The past simple needs a finished period disconnected from now (*in the 1990s*).", null, "The past perfect needs a later past reference point; there is none.", "The past progressive presents an ongoing activity at a past moment, not a period up to now."],
        ["possible-not-correct", null, "meaning-ok-grammar-wrong", "grammar-ok-meaning-wrong"], { tests: "grammar" }),
      gap("ta2", "gram:tense-aspect", 55, "By the time the committee reached a decision, the funding period ___ (already / expire).", ["had already expired"],
        "The expiry happened **before** another past event (the decision): past perfect. *Already* goes between *had* and the participle.", { tests: "grammar" }),
      mcq("ta3", "gram:tense-aspect", 58, "In her 2019 study, García ___ 120 bilingual speakers using a picture-naming task.", ["tests", "has tested", "tested", "had been testing"], 2,
        "Specific procedures of a **completed, dated study** are reported in the past simple. The present (*argues*, *claims*) is used for the author's ideas, not for what they physically did.",
        ["The 'reporting present' works for claims and arguments (*García argues*), not for completed procedures.", "*In 2019* is a finished, located time: incompatible with the present perfect.", null, "Nothing suggests an activity in progress before another past event."]),
      judge("ta4", "gram:tense-aspect", 66, "Recent studies have shown that bilingual children are outperforming monolinguals in executive control tasks.", true, false,
        "Grammatical, but the progressive *are outperforming* presents a **temporary, ongoing** situation. A general finding is expressed with the **simple present** (generic): *bilingual children outperform…* (and, given the debate in this field, a hedge would help).",
        "Recent studies have suggested that bilingual children may outperform monolinguals in some executive control tasks."),
      mcq("ta5", "gram:tense-aspect", 60, "This is the first time the archive ___ to external researchers.", ["is opened", "has been opened", "was opened", "opens"], 1,
        "The frame *This is the first/second/only time…* requires the **present perfect** (it counts occurrences up to now).",
        ["Present simple passive: grammatical in isolation, but the construction requires the perfect.", null, "Past simple would require *That was the first time…*", "Present simple ignores the 'up to now' count."], ["possible-not-correct", null, "meaning-ok-grammar-wrong", "possible-not-correct"], { tests: "grammar" }),
      kwt("ta6", "gram:tense-aspect", 52, "I started working on this corpus three years ago.", "BEEN", "I", "on this corpus for three years.", ["have been working", "'ve been working"],
        "Activity that began in the past and continues now, with emphasis on duration: **present perfect progressive** + *for* + period."),
      spot("ta7", "gram:tense-aspect", 50, ["The results", "were being", "analysed when", "the server crashes."], 3, "the server crashed",
        "The narrative is in the past: the interrupting event must be **past simple** (*crashed*). Past progressive (*were being analysed*) + *when* + past simple is the classic interrupted-action pattern.", { basic: true }),
      mcq("ta8", "gram:tense-aspect", 50, "The data ___ to suggest a strong correlation, but the sample is small.", ["seem", "are seeming", "have been seeming", "seemed being"], 0,
        "*Seem* is a **stative** verb: it describes a state, not an activity, and does not normally take the progressive.",
        [null, "Stative verbs resist the progressive.", "Same problem: progressive with a stative verb.", "Not a possible verb form."], null, { basic: true }),
      mcq("ta9", "gram:tense-aspect", 57, "By the end of the funding period, the team ___ over 400 hours of speech.", ["will record", "will have recorded", "will be recording", "has recorded"], 1,
        "*By* + future point → the action is viewed as **completed before** that point: future perfect.",
        ["Simple future does not express completion before a deadline.", null, "Future progressive presents an activity in progress at that point.", "Present perfect is anchored in the present, not the future."]),
      judge("ta10", "gram:tense-aspect", 62, "I was wondering whether you might be willing to share your dataset with our group.", true, true,
        "Grammatical and appropriate for an academic email. The **past progressive** here does not refer to past time: it is a **distancing** device that makes a request more tentative and polite (as do *might* and *whether*).", undefined, "Academic email to a researcher you don't know"),
    ],
  },
  {
    id: "g-articles", module: "grammar", group: "Noun phrase", title: "Articles", tag: "gram:articles", lvl: 54, icon: "🔤",
    summary: "Generic vs. specific reference, restricted nouns, and the classic Spanish-interference traps (the society, the people think).",
    body: `Articles encode **definiteness** (can the reader identify the referent?) and help mark **generic** reference.

#### Generic reference
- **Plural or mass noun, zero article**: *Bilinguals process language differently.* / *Language change is inevitable.*
- **The + singular** for a class, typical in scientific prose: *The cell is the basic unit of life.*
- **A + singular** for any representative member: *A phoneme is a contrastive unit.*
- Spanish uses the definite article for generics (*la sociedad*, *la gente*); English does **not**: *Society has changed*, *People think…*

#### Specific reference
- *The* when the referent is unique, already mentioned, or **restricted** by a modifier: *history* (in general) vs. *the history of Mexico*.
- Superlatives, ordinals and *same*: *the most frequent*, *the first*, *the same*.
- Roles after *elect, appoint, name, become*: usually zero article: *She was appointed head of department.*

#### a vs. an
Depends on **sound**, not spelling: *an MA*, *an hour*, *a university*, *a one-off*.`,
    examples: [
      { t: "Society has changed dramatically since the arrival of the internet.", k: "good" },
      { t: "The society has changed dramatically since the arrival of the internet.", k: "bad", note: "Generic meaning → zero article (Spanish interference)." },
      { t: "The history of the Guarijío people is closely tied to the Sierra Madre.", k: "good", note: "Restricted by the of-phrase." },
      { t: "She is an MA student.", k: "good", note: "/ɛm/ begins with a vowel sound." },
    ],
    items: [
      mcq("ar1", "gram:articles", 52, "___ language acquisition is a lifelong process for many bilingual speakers.", ["The", "A", "No article (Ø)", "An"], 2,
        "*Language acquisition* is used **generically** (the process in general) and is a mass noun: zero article.",
        ["Spanish would use *La adquisición*; English uses no article for generic mass nouns.", "*Acquisition* here is uncountable.", null, "Wrong form and wrong countability."], ["false-friend", null, null, null], { basic: true }),
      judge("ar2", "gram:articles", 55, "The society has changed dramatically since the arrival of the internet.", true, false,
        "The sentence is grammatical only if it refers to a **specific** society already identified. With the intended **generic** meaning, English uses zero article: *Society has changed…* This is a classic transfer from Spanish *la sociedad*.",
        "Society has changed dramatically since the arrival of the internet.", "Argumentative essay", { basic: true }),
      gap("ar3", "gram:articles", 50, "She is ___ MA student working on Guarijío phonology.", ["an"],
        "The choice between *a* and *an* depends on the **initial sound**: *MA* is pronounced /ˌɛmˈeɪ/, which begins with a vowel sound.", { basic: true, prompt: "Write a or an." }),
      mcq("ar4", "gram:articles", 55, "___ history of the Guarijío people is closely tied to the Sierra Madre.", ["The", "No article (Ø)", "A", "An"], 0,
        "*History* in general takes zero article, but here it is **restricted** by *of the Guarijío people*, which makes it specific and identifiable: *the history of…*",
        [null, "Zero article is for history in general (*History is written by…*).", "There is only one history of this people in this sense.", "Wrong sound and wrong meaning."]),
      spot("ar5", "gram:articles", 50, ["Most of", "the participants", "reported that grammar", "was most difficult part."], 3, "was the most difficult part",
        "Superlatives modifying a noun require **the**: *the most difficult part*.", { basic: true }),
      mcq("ar6", "gram:articles", 58, "___ has a four-chambered heart.", ["Whale", "The whale", "The whales", "Whales"], 1,
        "*The* + singular count noun can refer to a whole **class** (generic definite), common in scientific writing. The verb *has* confirms a singular subject.",
        ["A singular count noun needs a determiner.", null, "*The whales* would need *have* and refers to a specific group.", "Generic plural is fine, but it needs *have*."], [null, null, "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong"], { tests: "both" }),
      judge("ar7", "gram:articles", 50, "Phonology is the study of the sound systems of languages.", true, true,
        "Correct as it stands: *phonology* (discipline, zero article), *the study of…* (restricted by of-phrase), *the sound systems of languages* (restricted). Don't over-correct correct sentences — that's an overthinking trap.", undefined, "Textbook definition"),
      mcq("ar8", "gram:articles", 64, "In 2021 she was elected ___ chair of the linguistics department.", ["the", "a", "no article (Ø)", "an"], 2,
        "After verbs like *elect, appoint, name, make, become* + a **unique role**, English normally uses **zero article**: *was elected chair*, *was appointed director*. (With modification, *the* returns: *the first chair to…*)",
        ["Not impossible in some varieties, but zero article is the standard, expected form for a unique role after *elect*.", "A department normally has only one chair.", null, "Wrong sound."], ["possible-not-correct", null, null, null]),
    ],
  },
  {
    id: "g-determiners", module: "grammar", group: "Noun phrase", title: "Determiners and quantifiers", tag: "gram:determiners", lvl: 56, icon: "🔢",
    summary: "few vs. a few, a number of vs. the number of, each/every/either/neither, other vs. the others.",
    body: `Quantifiers carry **meaning** (positive vs. negative orientation) and **agreement** consequences.

#### Orientation
- **few / little** = not many / not much (negative orientation): *Few studies have replicated this.* → so, be cautious.
- **a few / a little** = some (positive orientation): *A few studies have replicated this.* → there is some support.
- *Only* combines with *a few / a little*: *only a few speakers*, **only little** sounds unnatural.

#### Agreement
- **A number of** + plural verb (= several): *A number of participants **were**…*
- **The number of** + singular verb (the number itself): *The number of speakers **is** declining.*
- **Each / every / either / neither (of)** → singular verb in formal writing: *Each of the speakers **was** recorded.* (*neither of them are* is common in speech but marked in formal prose.)

#### other / another / others / the others
- *another* + singular; *other* + plural; *others* = some other ones; **the others** = **all the remaining** members of a known set.`,
    examples: [
      { t: "Few studies have replicated the effect, so it should be treated with caution.", k: "good" },
      { t: "A few studies have replicated the effect, so it should be treated with caution.", k: "bad", note: "Positive orientation contradicts the conclusion." },
      { t: "Of the twelve speakers, seven used the innovative form; the others preferred the conservative variant.", k: "good" },
    ],
    items: [
      mcq("de1", "gram:determiners", 55, "___ studies have replicated the effect, so the finding should be treated with caution.", ["Few", "A few", "Little", "A little"], 0,
        "The conclusion (*so… caution*) requires **negative orientation**: *few* = hardly any. *A few* would mean there is some support.",
        [null, "Positive orientation: contradicts *so… caution*.", "*Little* is for uncountable nouns.", "Uncountable and positive."], [null, "grammar-ok-meaning-wrong", "meaning-ok-grammar-wrong", null], { tests: "meaning" }),
      mcq("de2", "gram:determiners", 54, "A number of participants ___ unable to complete the second session.", ["was", "were", "has been", "is"], 1,
        "*A number of* means *several* and takes a **plural** verb (notional agreement).",
        ["Singular agreement is used with *the number of*.", null, "Singular.", "Singular and wrong tense."]),
      gap("de3", "gram:determiners", 54, "The number of endangered languages ___ (be) difficult to estimate precisely.", ["is"],
        "*The number of* refers to the number itself, a singular noun: **singular** verb.", { tests: "grammar" }),
      mcq("de4", "gram:determiners", 60, "Neither of the proposed models ___ for the full range of variation.", ["accounts", "accounting", "are accounted", "to account"], 0,
        "*Neither of* + plural NP takes a **singular** verb in formal writing (*neither… accounts*). Plural agreement occurs in speech but is avoided in formal prose and exams.",
        [null, "A finite verb is needed.", "*Account for* is not passivised this way here, and the meaning is wrong.", "A finite verb is needed."]),
      mcq("de5", "gram:determiners", 62, "Only ___ information is available about the dialect spoken in the northern villages.", ["little", "a little", "few", "a few"], 1,
        "*Only* combines with **a little / a few** (*only a little*, *only a few*). *Information* is uncountable, so *a little*.",
        ["*Little* already means 'not much'; *only little* is unidiomatic.", null, "*Few* is for countable nouns.", "Countable quantifier with an uncountable noun."], ["possible-not-correct", null, null, "meaning-ok-grammar-wrong"], { tests: "both" }),
      spot("de6", "gram:determiners", 52, ["Each of", "the speakers", "were recorded", "twice."], 2, "was recorded",
        "*Each (of)* is distributive and takes a **singular** verb.", { basic: true }),
      kwt("de7", "gram:determiners", 56, "Hardly anyone responded to the online survey.", "FEW", "Very", "to the online survey.", ["few people responded", "few people replied", "few participants responded", "few respondents replied"],
        "*Hardly anyone* = **very few people**. Keep the verb in the past.", { min: 2 }),
      mcq("de8", "gram:determiners", 63, "Of the twelve speakers, seven used the innovative form; ___ preferred the conservative variant.", ["others", "the others", "other", "another"], 1,
        "The set is **closed and known** (twelve speakers): the remaining five are definite → **the others**.",
        ["Grammatical, but *others* means 'some other people', not 'all the rest of this group'.", null, "*Other* is a determiner and needs a noun.", "*Another* is singular."], ["grammar-ok-meaning-wrong", null, "meaning-ok-grammar-wrong", null], { tests: "meaning" }),
    ],
  },
  {
    id: "g-prepositions", module: "grammar", group: "Lexicogrammar", title: "Dependent prepositions", tag: "gram:prepositions", lvl: 55, icon: "🔗",
    summary: "The prepositions that nouns, verbs and adjectives select: a favourite target of Use of English papers.",
    body: `Dependent prepositions are **lexically selected**: there is often no logic, only usage. Spanish transfer is the main risk (*depend of*, *consist on*, *married with*).

#### High-frequency academic patterns
- consistent **with**, in line **with**, compatible **with**
- an increase / decrease / rise **in** (+ thing) vs. an increase **of** (+ amount: *of 12%*)
- focus **on**, rely **on**, depend **on**, be based **on**
- differ **from**, distinguish X **from** Y, derive **from**
- representative **of**, characteristic **of**, aware **of**
- draw attention **to**, contribute **to**, be open **to** question, grateful **to** someone **for** something
- **in** the absence of, **on** the grounds that, **on** the basis of, **in** terms of, **with** regard **to**`,
    examples: [
      { t: "The results are consistent with previous findings.", k: "good" },
      { t: "There has been an increase in the number of heritage speakers.", k: "good" },
      { t: "Prices rose by an increase of 12%.", k: "meh", note: "*of* + amount is fine, but here *rose by 12%* is more concise." },
    ],
    items: [
      mcq("pr1", "gram:prepositions", 52, "The results are consistent ___ previous findings.", ["with", "to", "in", "on"], 0, "*Consistent* selects **with**.", undefined, undefined, { basic: true, tests: "collocation" }),
      mcq("pr2", "gram:prepositions", 53, "There has been a sharp increase ___ the number of heritage speakers enrolling in Spanish courses.", ["in", "of", "on", "at"], 0,
        "*Increase in* + the thing that increases; *increase of* + the amount (*an increase of 12%*).",
        [null, "*Of* introduces the amount, not the thing that grows.", "Not idiomatic.", "Not idiomatic."], [null, "possible-not-correct", null, null], { tests: "collocation" }),
      gap("pr3", "gram:prepositions", 50, "The study focuses ___ intonational patterns in spontaneous speech.", ["on"], "*Focus* selects **on**.", { basic: true }),
      mcq("pr4", "gram:prepositions", 62, "This interpretation is open ___ question.", ["to", "for", "of", "at"], 0, "Fixed expression: **open to** question / debate / interpretation / criticism.", undefined, undefined, { tests: "collocation" }),
      spot("pr5", "gram:prepositions", 55, ["The author", "draws attention", "on the role", "of tone."], 2, "to the role", "*Draw attention* **to** something."),
      mcq("pr6", "gram:prepositions", 55, "Her findings differ ___ those of earlier fieldworkers in one important respect.", ["from", "than", "of", "with"], 0,
        "*Differ* takes **from** (*differ from*). (*Different than* occurs in American English, but *differ than* does not.)",
        [null, "*Than* is used with comparatives; even *different than* is informal AmE.", "Not possible.", "*Differ with* = disagree with a person."], [null, "false-friend", null, "grammar-ok-meaning-wrong"]),
      gap("pr7", "gram:prepositions", 55, "The sample was representative ___ the wider population.", ["of"], "*Representative* selects **of**."),
      mcq("pr8", "gram:prepositions", 52, "We are deeply grateful ___ the community for their participation.", ["to", "for", "with", "of"], 0, "Grateful **to** someone **for** something.", undefined, undefined, { basic: true }),
      mcq("pr9", "gram:prepositions", 58, "___ the absence of written records, reconstruction relies on comparative evidence.", ["In", "On", "At", "By"], 0, "Fixed phrase: **in the absence of**."),
      mcq("pr10", "gram:prepositions", 62, "The proposal was rejected ___ the grounds that it lacked ethical approval.", ["on", "in", "under", "at"], 0, "Fixed phrase: **on the grounds that** / **on the grounds of**."),
    ],
  },
  {
    id: "g-modality", module: "grammar", group: "Verb phrase", title: "Modality", tag: "gram:modality", lvl: 58, icon: "🎚️",
    summary: "Epistemic vs. deontic modality, modal perfects, and calibrating certainty in academic claims.",
    body: `Modals express either **epistemic** meaning (how certain the speaker is) or **deontic** meaning (obligation, permission).

#### Epistemic scale (present)
*must* (logical certainty) > *will* > *should* (expectation) > *may / might / could* (possibility) > *can't / couldn't* (logical impossibility).

#### Modal perfects (deduction about the past)
- *must have done* — I'm sure it happened.
- *can't / couldn't have done* — I'm sure it didn't.
- *may / might / could have done* — perhaps it happened.
- *should have done* — it was the right thing, but it didn't happen.
- **needn't have done** — it happened, but was unnecessary. vs. **didn't need to do** — usually: it wasn't necessary (and probably didn't happen).

#### Academic uses
- *may/might/could* to **hedge**: *This may reflect contact with Spanish.*
- *would* for tentative interpretation: *This **would** suggest that…*
- *It could be argued that…* to introduce a position without fully endorsing it.
- *Don't have to* (no obligation) ≠ *mustn't* (prohibition).`,
    examples: [
      { t: "The recordings must have been lost during the move.", k: "good" },
      { t: "We needn't have hired a translator: everyone spoke Spanish.", k: "good", note: "We hired one; it turned out to be unnecessary." },
      { t: "These findings prove that heritage speakers always lose tone contrasts.", k: "bad", note: "Overclaiming: no modal, absolute adverb." },
    ],
    items: [
      mcq("mo1", "gram:modality", 56, "The recordings are missing from the archive; they ___ during the move to the new building.", ["must have been lost", "must be lost", "should have lost", "had to be lost"], 0,
        "Deduction about the past + passive meaning: **must have been** + past participle.",
        [null, "Refers to the present, not to a past event.", "Active voice and 'expectation/criticism' meaning: wrong on both counts.", "*Had to* is obligation, not deduction."], [null, "meaning-ok-grammar-wrong", null, "grammar-ok-meaning-wrong"]),
      mcq("mo2", "gram:modality", 64, "We ___ a translator after all — all the participants spoke Spanish fluently, so we sent her home early.", ["needn't have hired", "didn't need to hire", "mustn't have hired", "couldn't hire"], 0,
        "We **did** hire her (*sent her home early*), and it turned out to be unnecessary: **needn't have** + past participle.",
        [null, "Usually implies we didn't hire anyone — contradicts *sent her home*.", "*Mustn't have* is not used for past deduction in standard English (use *can't have*).", "Ability, not necessity."], [null, "grammar-ok-meaning-wrong", null, "grammar-ok-meaning-wrong"], { tests: "meaning", deep: "*Needn't have* + PP is a counterfactual-necessity form: it presupposes that the event took place. *Didn't need to* simply denies necessity and is neutral about occurrence, although the default implicature is that the event didn't happen; context can cancel it (*I didn't need to hire one, but I did anyway*)." }),
      judge("mo3", "gram:modality", 58, "Given the small sample, these findings prove that heritage speakers always lose tone contrasts.", true, false,
        "Grammatical, but the claim is **overstated** for the evidence (*small sample*). Academic writing calibrates certainty with modals and hedges.",
        "Given the small sample, these findings suggest that heritage speakers may be more likely to lose tone contrasts.", "Discussion section", { tags: ["acad:hedging"] }),
      mcq("mo4", "gram:modality", 58, "It ___ that the sound change began in the north, but the evidence is inconclusive.", ["may be argued", "must be argued", "can't be argued", "should argue"], 0,
        "A tentative, impersonal way to introduce a position: *It may / could be argued that…*",
        [null, "Too strong for *inconclusive* evidence.", "Contradicts the idea that someone can make the argument.", "Active form with a dummy *it*: ungrammatical here."], [null, "too-extreme", "contradicts", "meaning-ok-grammar-wrong"]),
      kwt("mo5", "gram:modality", 58, "I'm sure the reviewer didn't read the methodology section.", "CAN'T", "The reviewer", "the methodology section.", ["can't have read", "cannot have read"],
        "Certainty that something did **not** happen: **can't have** + past participle. (CAN'T counts as two words in Cambridge: *can not*.)", { min: 2 }),
      gap("mo6", "gram:modality", 55, "You ___ (should / submit) the ethics form before collecting data; now the data can't be used.", ["should have submitted"],
        "Criticism of a past action that did **not** happen: **should have** + past participle."),
      mcq("mo7", "gram:modality", 50, "Applicants ___ submit a writing sample, but it may strengthen their application.", ["don't have to", "mustn't", "can't", "haven't to"], 0,
        "No obligation = **don't have to**. *Mustn't* means it is prohibited.",
        [null, "Prohibition: contradicts *may strengthen their application*.", "Not permitted: contradicts the second clause.", "Not a standard form."], [null, "contradicts", "contradicts", null], { basic: true }),
      spot("mo8", "gram:modality", 45, ["The data", "could suggests", "a gradual", "merger."], 1, "could suggest", "Modals are followed by the **bare infinitive**: *could suggest*.", { basic: true }),
    ],
  },
  {
    id: "g-passive", module: "grammar", group: "Verb phrase", title: "Passive voice", tag: "gram:passive", lvl: 56, icon: "🔄",
    summary: "Agentless passives in methods, reporting passives (is said to have), causatives, and verbs that cannot be passivised.",
    body: `The passive promotes the **patient** to subject and backgrounds (or removes) the agent. In academic writing it is useful when the agent is obvious, unknown or irrelevant — typically in **Methods**.

#### Patterns you must control
- **Reporting passives**: *It is believed that X* ↔ *X is believed **to** + infinitive* (*is said to have lost* for past reference).
- **Passive infinitive / gerund**: *to be interviewed*, *object to **being recorded***.
- **Causative**: *have / get something done* (*We had the recordings transcribed*).
- **Phrasal and prepositional verbs** keep their particle: *was carried out*, *has been dealt with*.
- **Intransitive verbs cannot be passivised**: *happen, occur, arise, emerge, appear* → ✗ *was occurred*.
- *Get*-passive is informal: *got filled in* → *was completed*.

#### Style note
Modern style guides accept *we* in many fields (*We recorded…*). Passive is not 'more academic' by itself: choose it for information structure (topic continuity).`,
    examples: [
      { t: "All interviews were conducted in the participants' homes.", k: "good" },
      { t: "The manuscript is believed to date from the 16th century.", k: "good" },
      { t: "A significant change was occurred in the vowel system.", k: "bad", note: "*Occur* is intransitive." },
    ],
    items: [
      mcq("pa1", "gram:passive", 48, "All interviews ___ in the participants' homes between March and June.", ["were conducted", "conducted", "had conducted", "were conducting"], 0,
        "Interviews don't conduct anything: they **were conducted** (by the researchers).",
        [null, "Active voice makes *interviews* the agent.", "Active voice and an unmotivated past perfect.", "Active progressive."], null, { basic: true }),
      kwt("pa2", "gram:passive", 60, "People believe that the manuscript dates from the 16th century.", "BELIEVED", "The manuscript", "from the 16th century.", ["is believed to date"],
        "Reporting passive with subject raising: *X is believed to* + infinitive (present reference → simple infinitive)."),
      kwt("pa3", "gram:passive", 64, "People say that the community lost the language within two generations.", "SAID", "The community", "the language within two generations.", ["is said to have lost"],
        "The saying is present, the losing is past → **perfect infinitive**: *is said to have lost*."),
      spot("pa4", "gram:passive", 52, ["A significant", "change was occurred", "in the vowel", "system."], 1, "change occurred",
        "*Occur* is **intransitive**: it has no object, so it cannot be passivised. Same for *happen, arise, emerge*.", { basic: true }),
      mcq("pa5", "gram:passive", 58, "Several participants objected to ___ without their consent.", ["being recorded", "be recorded", "recording", "have been recorded"], 0,
        "*Object to* — *to* is a **preposition**, so it is followed by a gerund; passive meaning → *being recorded*.",
        [null, "After a preposition we need an -ing form.", "Active: they objected to recording (someone else).", "Not possible after a preposition."], [null, "meaning-ok-grammar-wrong", "grammar-ok-meaning-wrong", null]),
      judge("pa6", "gram:passive", 55, "The questionnaire got filled in by most of the students in under ten minutes.", true, false,
        "The *get*-passive is grammatical but **informal**; *filled in* is also conversational.",
        "Most students completed the questionnaire in under ten minutes.", "Methods section"),
      mcq("pa7", "gram:passive", 55, "We had the recordings ___ by a professional phonetician.", ["transcribed", "transcribe", "to transcribe", "transcribing"], 0,
        "Causative **have + object + past participle** (someone else did it for us).",
        [null, "*Have someone do*: would need a person as object.", "Not used after causative *have*.", "*Have someone doing* means something else."]),
      gap("pa8", "gram:passive", 50, "The fieldwork ___ (carry out) over three consecutive summers.", ["was carried out"], "Passive of a phrasal verb: the particle stays (*was carried out*)."),
    ],
  },
  {
    id: "g-reported", module: "grammar", group: "Clause", title: "Reported speech and reporting verbs", tag: "gram:reported", lvl: 56, icon: "💬",
    summary: "Reporting verb patterns (suggest, deny, encourage), embedded questions, and when backshift is optional.",
    body: `In exams, reported speech is mostly about **verb patterns**, not tense-shifting rules.

#### Patterns
- **V + -ing**: *deny, admit, suggest, recommend, regret* (*denied manipulating*)
- **V + object + to-inf**: *encourage, advise, urge, warn, remind, invite, persuade, tell, ask*
- **V + that-clause**: *argue, claim, point out, acknowledge, concede, insist*
- *Suggest* **never** takes object + to-infinitive: ✗ *suggested me to revise* → *suggested (that) I revise / revising*.
- *Tell* needs a person: *told the committee*; *say* does not take a person directly: *said to the committee*.

#### Embedded questions
Statement word order, no *do*: *She asked whether I **would make** the data available.*

#### Backshift
Optional when the reported content is **still true or still endorsed**: *In 2020, Ruiz argued that attitudes **are** a stronger predictor of shift.*`,
    examples: [
      { t: "My supervisor suggested revising the literature review.", k: "good" },
      { t: "My supervisor suggested me to revise the literature review.", k: "bad" },
      { t: "She asked whether I would make the data publicly available.", k: "good" },
    ],
    items: [
      mcq("re1", "gram:reported", 58, "My supervisor suggested ___ the literature review before collecting any more data.", ["revising", "to revise", "me to revise", "that I revised"], 0,
        "*Suggest* + **-ing** (or *suggest that I revise / should revise*).",
        [null, "*Suggest* doesn't take a to-infinitive.", "*Suggest* doesn't take object + to-infinitive (Spanish transfer from «me sugirió revisar»).", "Formal English prefers the mandative subjunctive *(that) I revise* or *should revise*."], [null, "meaning-ok-grammar-wrong", "false-friend", "possible-not-correct"], { basic: true }),
      mcq("re2", "gram:reported", 52, "She asked me ___ the data publicly available.", ["whether I would make", "if would I make", "whether would I make", "did I make"], 0,
        "Embedded questions use **statement word order** and no auxiliary inversion.", undefined, undefined, { basic: true }),
      kwt("re3", "gram:reported", 52, "'You should apply for the scholarship,' my professor told me.", "ENCOURAGED", "My professor", "for the scholarship.", ["encouraged me to apply"],
        "*Encourage* + **object + to-infinitive**."),
      kwt("re4", "gram:reported", 58, "'I didn't manipulate the data,' the researcher said.", "DENIED", "The researcher", "the data.", ["denied manipulating", "denied having manipulated", "denied that he had manipulated", "denied that she had manipulated", "denied that they had manipulated", "denied he had manipulated", "denied she had manipulated"],
        "*Deny* + **-ing** (or perfect gerund *having manipulated*), or *deny that* + clause.", { min: 2 }),
      mcq("re5", "gram:reported", 54, "In a later paper, the author ___ that her earlier analysis had overlooked a key variable.", ["admitted", "denied of", "refused", "apologised"], 0,
        "*Admit that* + clause = acknowledge something negative about oneself.",
        [null, "*Deny* takes no *of*, and the meaning is opposite.", "*Refuse* takes a to-infinitive, not a that-clause.", "*Apologise for*, not *apologise that* (in formal writing)."]),
      judge("re6", "gram:reported", 62, "In her 2020 paper, Ruiz argued that attitudes are a stronger predictor of language shift than economic factors.", true, true,
        "Correct. **Backshift is optional** when the reported claim is still presented as valid. (*were* would also be correct and slightly more distanced.)", undefined, "Literature review"),
      spot("re7", "gram:reported", 52, ["He told", "to the committee", "that the results", "were preliminary."], 1, "the committee",
        "*Tell* takes the person as a **direct object** (*told the committee*); *say* takes *to* (*said to the committee*).", { basic: true }),
    ],
  },
  {
    id: "g-conditionals", module: "grammar", group: "Clause", title: "Conditionals", tag: "gram:conditionals", lvl: 58, icon: "🔀",
    summary: "Mixed and inverted conditionals, but for / if it hadn't been for, unless, provided that.",
    body: `Beyond the classic types, C1–C2 exams test **mixed time reference**, **inversion** and **alternative conjunctions**.

- **Mixed**: past condition → present result: *If she **had received** the grant, she **would be** in Montreal now.*
- **Inverted** (formal, no *if*): *Had we known…*, *Were it not for…*, *Should you require…* (note: **Should** + bare infinitive).
- *If it hadn't been for* / *But for* / *Without* + NP = a past condition that prevented something.
- **unless** = if… not; **provided (that) / as long as** = only if; **otherwise** = if not (sentence-linking).
- No *would* in the if-clause of hypotheticals: ✗ *If I would have known*.`,
    examples: [
      { t: "Had we known about the strike, we would have rescheduled the interviews.", k: "good" },
      { t: "Should the funding come through, fieldwork will begin in May.", k: "good" },
      { t: "If I would have known about the deadline, I would have submitted earlier.", k: "bad" },
    ],
    items: [
      mcq("co1", "gram:conditionals", 55, "If the sample ___ larger, the effect might have reached significance.", ["had been", "was", "would be", "has been"], 0,
        "Unreal **past** condition → past perfect in the if-clause.", undefined, undefined, { tests: "grammar" }),
      mcq("co2", "gram:conditionals", 58, "If she ___ the grant last year, she would be doing fieldwork in Montreal now.", ["had received", "received", "would receive", "has received"], 0,
        "**Mixed conditional**: unreal past condition (*last year*) with a present result (*now*).",
        [null, "Past simple would make the condition present/unreal now, which clashes with *last year*.", "No *would* in the if-clause.", "Present perfect is not used for unreal conditions."]),
      kwt("co3", "gram:conditionals", 62, "Without the community's support, the project would have failed.", "BEEN", "If it", "community's support, the project would have failed.", ["had not been for the", "hadn't been for the"],
        "*If it hadn't been for* + NP = without + NP (past). Contractions count as two words."),
      kwt("co4", "gram:conditionals", 62, "Please contact the editor if you need further information.", "SHOULD", "", "further information, please contact the editor.", ["should you need", "should you require"],
        "Formal inversion with **should**: *Should you need…* (= If you need…).", { min: 2 }),
      mcq("co5", "gram:conditionals", 64, "___ the funding come through, fieldwork will begin in May.", ["Should", "If", "Unless", "Provided"], 0,
        "The verb is **bare** (*come*, not *comes*): only inverted **should** licenses it.",
        [null, "*If the funding comes through* — the verb form doesn't match.", "Wrong meaning and wrong verb form.", "*Provided the funding comes* — again, the verb form doesn't match."], [null, "meaning-ok-grammar-wrong", null, "meaning-ok-grammar-wrong"], { tests: "grammar" }),
      mcq("co6", "gram:conditionals", 52, "The analysis will be repeated ___ the reviewers request otherwise.", ["unless", "if", "provided", "as long as"], 0,
        "*Unless* = *if… not*: the analysis will be repeated except if reviewers request otherwise.",
        [null, "*If the reviewers request otherwise* contradicts the logic of the sentence.", "Same logical problem.", "Same logical problem."], [null, "grammar-ok-meaning-wrong", "grammar-ok-meaning-wrong", "grammar-ok-meaning-wrong"], { tests: "meaning" }),
      spot("co7", "gram:conditionals", 48, ["If I would have known", "about the deadline,", "I would have", "submitted earlier."], 0, "If I had known",
        "No **would** in the if-clause of a conditional: use past perfect. (*If I would have* is common in some spoken American varieties but is incorrect in exams and formal writing.)", { basic: true }),
    ],
  },
  {
    id: "g-inversion", module: "grammar", group: "Clause", title: "Inversion", tag: "gram:inversion", lvl: 64, icon: "🙃",
    summary: "Negative and restrictive adverbials, so/such, only after, locative inversion — a C1/C2 classic.",
    body: `When certain elements are **fronted**, English inverts the subject and the (first) auxiliary — adding *do* if there is none.

#### Triggers
- Negative / restrictive adverbials: *Never, Rarely, Seldom, Little, At no time, Under no circumstances, Not only…, No sooner… than, Hardly / Scarcely… when, Nowhere*
- **Only** + adverbial: *Only later **did we** realise…*, *Only when… **did**…*, *Not until… **did**…* (inversion is in the **main** clause).
- *So* + adjective / *Such* + be: *So complex **was** the system that…*, *Such **was** the demand that…*
- Comparatives with *as / than* (optional, formal): *…as **did** her colleagues*.

#### Not triggered
Negative words inside the subject: *Not many people **know** this* (no inversion).

#### Locative inversion (no do-support)
*At the centre of the debate **lies** the question of…* — the verb agrees with the **postposed subject**.`,
    examples: [
      { t: "Not only did they reject the hypothesis, but they also proposed an alternative.", k: "good" },
      { t: "Rarely researchers have examined tone sandhi in this family.", k: "bad", note: "Must invert: *Rarely have researchers…*" },
      { t: "At the centre of the debate lies the question of what counts as a native speaker.", k: "good" },
    ],
    items: [
      mcq("in1", "gram:inversion", 60, "Not only ___ the hypothesis, but they also proposed an alternative model.", ["did they reject", "they rejected", "they did reject", "rejected they"], 0,
        "Fronted *Not only* triggers **subject–auxiliary inversion**; with no auxiliary, we add *do*.",
        [null, "No inversion after a fronted negative.", "Emphatic *did*, but still no inversion.", "English inverts the auxiliary, not the lexical verb."]),
      kwt("in2", "gram:inversion", 68, "As soon as the paper was published, it attracted criticism.", "SOONER", "No", "than it attracted criticism.", ["sooner had the paper been published", "sooner was the paper published"],
        "*No sooner* + **inversion** + *than*. Past perfect is the most common choice (*No sooner had…*).", { max: 7 }),
      kwt("in3", "gram:inversion", 70, "We did not realise how important the variable was until much later.", "ONLY", "", "realise how important the variable was.", ["only much later did we", "only later did we"],
        "*Only* + time adverbial fronted → inversion in the main clause: *Only much later did we realise…*", { min: 3 }),
      mcq("in4", "gram:inversion", 64, "Little ___ that the corpus would become a standard reference in the field.", ["did the compilers know", "the compilers knew", "knew the compilers", "the compilers did know"], 0,
        "*Little* (= not at all) fronted → inversion with *do*: *Little did they know…*"),
      mcq("in5", "gram:inversion", 60, "Under no circumstances ___ participants' names be disclosed.", ["should", "they should", "are", "must be"], 0,
        "Fronted negative → modal before the subject: *Under no circumstances should participants' names be disclosed*.",
        [null, "Wrong subject and no inversion.", "Wrong verb form: *are … be disclosed* is ungrammatical.", "Double *be* with the following *be disclosed*."]),
      mcq("in6", "gram:inversion", 66, "So complex ___ that it took two years to describe it.", ["was the tonal system", "the tonal system was", "did the tonal system", "the tonal system is"], 0,
        "*So* + adjective fronted → inversion: *So complex was the system that…*"),
      spot("in7", "gram:inversion", 62, ["Rarely", "researchers have", "examined tone sandhi", "in this family."], 1, "have researchers",
        "*Rarely* fronted triggers inversion: *Rarely **have researchers** examined…*"),
      mcq("in8", "gram:inversion", 70, "At the centre of the debate ___ the question of what counts as a 'native' speaker.", ["lies", "lie", "lying", "is lain"], 0,
        "Locative inversion: the verb agrees with the **postposed subject** (*the question*, singular). No *do*-support.",
        [null, "The subject is singular (*the question*), not *the debate*.", "A finite verb is needed.", "*Lie* is intransitive; no passive."], [null, "word-match", null, null], { tests: "grammar" }),
      judge("in9", "gram:inversion", 64, "Hardly had the interview begun when the recorder stopped working.", true, true,
        "Correct: *Hardly* + inversion + past perfect, followed by **when** (not *than*, which goes with *no sooner*).", undefined, "Fieldwork report"),
    ],
  },
];
