import type { Lesson } from "./types";
import { mcq, gap, judge, produce, spot } from "./helpers";

export const ACADEMIC: Lesson[] = [
  {
    id: "a-hedging", module: "academic", group: "Claims", title: "Hedging and cautious claims", tag: "acad:hedging", lvl: 58, icon: "🌫️",
    summary: "Calibrate how certain you sound to how strong your evidence is.",
    body: `**Hedging** protects your claim from easy refutation and shows epistemic honesty. It is not weakness: unhedged claims about complex data read as naïve.

#### Calibration ladder
| Evidence | Typical wording |
|---|---|
| Conclusive, replicated | *X causes / shows / demonstrates* |
| Strong | *X strongly suggests / is very likely* |
| Moderate | *X suggests / indicates / appears to* |
| Weak / exploratory | *X may / might / could; there is some evidence that* |
| Speculation | *One possible explanation is…; It is conceivable that…* |

#### Ways to hedge
- Verbs: *suggest, indicate, appear, seem, tend*
- Modals: *may, might, could*
- Adverbs/adjectives: *possibly, likely, arguably, relatively, somewhat*
- **Scope limiters**: *in this sample, in these communities, under laboratory conditions*
- Approximators: *approximately, in most cases*

#### Two failures
**Overclaiming** (*proves, always, clearly*) and **over-hedging** (*it could perhaps possibly be suggested that…*).`,
    examples: [
      { t: "These results suggest that schooling may have accelerated the shift, at least in the communities studied.", k: "good" },
      { t: "These results prove that schooling caused the shift.", k: "bad" },
    ],
    items: [
      mcq("ah1", "acad:hedging", 58, "A small pilot study (n = 12) found that older speakers produced longer vowels. Which sentence is most appropriate?", [
        "Older speakers produce longer vowels.",
        "This pilot study suggests that older speakers may produce longer vowels, although a larger sample is needed.",
        "It is proven that age lengthens vowels.",
        "Older speakers always produce longer vowels than younger ones."], 1,
        "A pilot with 12 participants supports only a **tentative** claim, limited in scope, with an explicit need for confirmation.",
        ["Presented as a general fact: overgeneralises from n = 12.", null, "*Proven* is far too strong.", "*Always* is an absolute claim."], ["too-extreme", null, "too-extreme", "too-extreme"], { tests: "register" }),
      judge("ah2", "acad:hedging", 60, "It could possibly perhaps be suggested that the effect might be due to fatigue.", true, false,
        "Grammatical, but **over-hedged**: four hedges stacked on one claim make the writer sound evasive.", "The effect may be due to fatigue.", "Discussion section"),
      produce("ah3", "acad:hedging", 60, "Hedge each claim **once**, appropriately:\n\n1. *Social media saves minority languages.*\n2. *Children who grow up bilingual have better attention.*\n3. *Tone is disappearing in this language.*",
        "Each claim needs one calibrated hedge and, ideally, a scope limiter.",
        { minWords: 30, model: "1. Social media can contribute to the visibility of minority languages, although its effect on transmission remains unclear.\n2. Children who grow up bilingual may show advantages in some attention tasks.\n3. Tonal contrasts appear to be weakening among younger speakers in the communities studied.", checklist: ["Each claim is hedged once (not over-hedged)", "At least one scope limiter (in this sample / in some contexts)", "Claims remain clear and assertive enough", "Academic register"] }),
      mcq("ah4", "acad:hedging", 62, "Which is an example of **over-hedging**?", ["The data suggest a link.", "There may be a link.", "It might be possible that there could perhaps be a link.", "There is likely to be a link."], 2,
        "Stacking *might, possible, could, perhaps* on one proposition dilutes it into nothing."),
      spot("ah5", "acad:hedging", 58, ["Our findings", "clearly prove", "that bilingualism", "delays cognitive decline."], 1, "suggest",
        "*Clearly prove* is an **overclaim** for observational data on a debated topic. A verb such as *suggest* or *are consistent with the hypothesis that* is appropriate."),
    ],
  },
  {
    id: "a-reporting", module: "academic", group: "Sources", title: "Reporting verbs", tag: "acad:reporting", lvl: 60, icon: "📣",
    summary: "Verbs that report sources also report YOUR stance towards them.",
    body: `Reporting verbs differ in **meaning**, **strength** and **evaluation**:

| Neutral | Tentative | Strong | Writer distances / disagrees |
|---|---|---|---|
| state, note, describe, report, observe | suggest, propose, speculate, hypothesise | argue, maintain, contend, insist, emphasise | claim, allege, assert |

| Writer accepts as fact (factive) | Concession |
|---|---|
| show, demonstrate, establish, reveal, confirm | acknowledge, concede, admit, grant |

#### Patterns
- *argue / claim / suggest / note **that***
- *criticise X **for** Y*, *attribute X **to** Y*, *distinguish X **from** Y*, *question **whether***
- Integral vs. non-integral citation: *García (2019) argues that…* / *…is contested (García, 2019).*

#### Tense
Present for ideas (*García argues*), past for specific findings/procedures (*García found*), present perfect for a body of work (*Several scholars have argued*).`,
    examples: [
      { t: "García (2019) demonstrates that the merger is complete.", k: "good", note: "You endorse it." },
      { t: "García (2019) claims that the merger is complete.", k: "good", note: "You keep a sceptical distance." },
      { t: "García (2019) suggests that the merger may be complete.", k: "good", note: "García herself is tentative." },
    ],
    items: [
      mcq("ar_1", "acad:reporting", 60, "García presents her conclusion tentatively. Which verb represents her position **accurately**?", ["demonstrates", "suggests", "insists", "proves"], 1,
        "*Suggest* reports a **tentative** claim. Misrepresenting the strength of a source is a common academic error.",
        ["Turns a tentative claim into an established fact.", null, "Attributes a forceful stance she didn't take.", "Far too strong."], ["too-extreme", null, "too-extreme", "too-extreme"], { tests: "meaning" }),
      mcq("ar_2", "acad:reporting", 62, "You think the source is right. Which verb signals that you **accept** its finding?", ["shows", "claims", "alleges", "asserts"], 0, "*Show* is **factive**: it presupposes that the reported content is true.", [null, "Signals distance.", "Strongly signals doubt (and suggests wrongdoing in legal contexts).", "Forceful, but doesn't imply you agree."], [null, "reversed", "reversed", null]),
      gap("ar_3", "acad:reporting", 60, "Early descriptions of the language have been criticised ___ ignoring tonal contrasts.", ["for"], "*Criticise someone/something* **for** + NP/-ing."),
      mcq("ar_4", "acad:reporting", 64, "Although she rejects the contact hypothesis, Ruiz ___ that Spanish may have reinforced existing tendencies.", ["concedes", "denies", "doubts", "refutes"], 0,
        "*Concede* = admit a point that partly goes against your own position — exactly the relation signalled by *although*.",
        [null, "Opposite meaning.", "Opposite orientation.", "*Refute* = prove wrong."], [null, "reversed", "reversed", "reversed"], { tests: "meaning" }),
      spot("ar_5", "acad:reporting", 58, ["Smith (2015)", "argues about", "that the change", "began earlier."], 1, "argues", "*Argue that* + clause (no *about* before a that-clause)."),
      produce("ar_6", "acad:reporting", 62, "Report these three sources in **one paragraph** (60–90 words), choosing verbs that reflect each author's stance and your evaluation:\n\n- Author A shows (with a large corpus) that word-final vowels are shortening.\n- Author B thinks, without much evidence, that the change is caused by Spanish.\n- Author C tentatively proposes that the change began in the 1950s.",
        "A strong answer uses a **factive** verb for A, a **distancing** verb for B (and maybe evaluates it), and a **tentative** verb for C.",
        { minWords: 60, model: "Using a large spoken corpus, A (2018) demonstrates that word-final vowels are shortening. B (2020) claims that this change is caused by contact with Spanish, although little evidence is offered in support of this view. C (2021), in turn, tentatively suggests that the shortening began in the 1950s, a hypothesis that remains to be tested against earlier recordings.", checklist: ["Factive verb for A", "Distancing verb for B", "Tentative verb for C", "My own evaluation is visible", "Citations are integrated smoothly"] }),
    ],
  },
  {
    id: "a-argument", module: "academic", group: "Argument", title: "Argumentation: claim, evidence, warrant", tag: "acad:argumentation", lvl: 62, icon: "⚔️",
    summary: "Build arguments that survive a seminar: claims, reasons, evidence, counterarguments and rebuttals.",
    body: `A solid academic argument has:
1. **Claim** — what you want the reader to accept.
2. **Reasons / evidence** — data, examples, sources.
3. **Warrant** — why the evidence supports the claim (often implicit; make it explicit when it isn't obvious).
4. **Qualification** — limits on the claim (hedging).
5. **Counterargument + rebuttal** — the strongest opposing view and your response.

#### Language
- Claim: *This paper argues that…*, *The central claim is that…*
- Evidence: *This is supported by…*, *Evidence for this comes from…*
- Counterargument: *It could be objected that…*, *A possible objection is that…*
- Rebuttal: *However, this objection overlooks…*, *While this is true, it does not follow that…*
- Concession + claim: *Although X, Y.*

#### Logical pitfalls
Correlation ≠ causation; hasty generalisation; appeal to authority; straw man (misrepresenting the opposing view).`,
    examples: [
      { t: "It could be objected that the sample is too small to support this claim. However, the pattern is consistent across all three communities, which makes a sampling artefact unlikely.", k: "good" },
    ],
    items: [
      mcq("aa1", "acad:argumentation", 62, "*Children who attend bilingual schools score higher on reading tests. Therefore, bilingual schooling improves reading.* What is the main weakness?", [
        "It confuses correlation with causation (e.g., families who choose bilingual schools may differ).",
        "It doesn't cite enough sources.",
        "It uses the word 'therefore'.",
        "Reading tests are always unreliable."], 0,
        "The data are **correlational**: a confounding variable (family background, school resources) could explain both.",
        [null, "Citations matter, but they aren't the logical flaw here.", "Connectors are not the problem.", "Overgeneralisation: not all tests are unreliable."], [null, "wrong-focus", "wrong-focus", "too-extreme"], { tests: "meaning" }),
      mcq("aa2", "acad:argumentation", 64, "Which sentence is a **rebuttal** (not just a counterargument)?", [
        "Some scholars argue that tone loss is internally motivated.",
        "It could be objected that the sample is small.",
        "While the sample is small, the effect replicates across three independent communities, which makes chance unlikely.",
        "There are many opinions about tone loss."], 2,
        "A rebuttal **answers** the objection with a reason.",
        ["Reports an opposing view: a counterargument, not a rebuttal.", "States an objection without answering it.", null, "Vague and not an argument."]),
      mcq("aa3", "acad:argumentation", 66, "Which is a **straw man**?", [
        "Proponents of the critical period hypothesis argue that adults can never learn a second language, which is obviously false.",
        "The critical period hypothesis predicts a decline in ultimate attainment with age of onset.",
        "Proponents differ on whether the decline is abrupt or gradual.",
        "Evidence for a critical period in phonology is stronger than for syntax."], 0,
        "It **misrepresents** the opposing view (no serious proponent claims adults *can never* learn an L2) to refute it easily."),
      produce("aa4", "acad:argumentation", 66, "Write a short argument paragraph (90–130 words) for or against this claim: *Doctoral theses in linguistics should be written in English rather than in the language of the community studied.* Include a claim, a reason with an example, a counterargument and a rebuttal.",
        "Check the four moves and the connectors between them.",
        { minWords: 90, checklist: ["Clear claim in the first sentence", "At least one reason with an example", "A counterargument introduced fairly", "A rebuttal that answers it", "Hedging where needed"] }),
    ],
  },
  {
    id: "a-paraphrase", module: "academic", group: "Sources", title: "Paraphrasing without patchwriting", tag: "acad:paraphrase", lvl: 62, icon: "🔁",
    summary: "Change structure and vocabulary, keep the meaning, cite the source — and avoid changing the claim's strength.",
    body: `A good paraphrase:
1. Keeps the **meaning and strength** of the claim (don't turn *may* into *does*).
2. Changes the **structure** (not just synonyms): nominalise, change voice, reorder information.
3. Keeps **technical terms** that have no synonym (*phoneme*, *tone sandhi*).
4. Is **cited**.

**Patchwriting** = original sentence with a few synonyms swapped. It counts as plagiarism in many institutions.

#### Techniques
- Verb → noun: *Speakers increasingly avoid* → *the increasing avoidance of…*
- Active ↔ passive
- Change the starting point (theme)
- Clause ↔ phrase: *because speakers migrated* → *owing to migration*`,
    examples: [
      { t: "Original: Rapid urbanisation may have accelerated the decline of intergenerational transmission.", k: "meh" },
      { t: "Rapid urbanisation could have sped up the decline of intergenerational transmission.", k: "bad", note: "Patchwriting: same structure, two synonyms." },
      { t: "The decline in transmission across generations may have been hastened by the speed at which the region urbanised (López, 2018).", k: "good" },
    ],
    items: [
      mcq("ap1", "acad:paraphrase", 62, "Original: *Rapid urbanisation may have accelerated the decline of intergenerational transmission.* Best paraphrase?", [
        "Rapid urbanisation could have sped up the decline of intergenerational transmission.",
        "Urbanisation caused transmission between generations to decline.",
        "The pace of urbanisation may have hastened the weakening of transmission across generations.",
        "Transmission declined in cities."], 2,
        "C changes the **structure** (new subject: *the pace of urbanisation*), keeps the **hedge** (*may*) and the meaning.",
        ["Patchwriting: same structure, synonyms swapped.", "Changes strength (*may have accelerated* → *caused*).", null, "Loses information and changes the claim (urban vs. urbanisation)."], ["possible-not-correct", "too-extreme", null, "partial"], { tests: "meaning" }),
      mcq("ap2", "acad:paraphrase", 64, "Original: *Few studies have examined prosody in Uto-Aztecan languages.* Which paraphrase **changes the meaning**?", [
        "Prosody in Uto-Aztecan languages has received little scholarly attention.",
        "Research on Uto-Aztecan prosody remains scarce.",
        "Several studies have examined Uto-Aztecan prosody.",
        "Uto-Aztecan prosody is an understudied area."], 2,
        "*Several* reverses the orientation of *few* (= hardly any).", undefined, undefined),
      produce("ap3", "acad:paraphrase", 64, "Paraphrase (change structure, keep meaning and hedging, add a citation):\n\n*It is likely that the loss of tonal contrasts among younger speakers reflects reduced exposure to the language in the home rather than contact with Spanish per se.* (Morales, 2021)",
        "Possible strategies: start with *Reduced exposure at home*, turn *loss* into a verb, keep *likely*, keep the contrast *rather than*.",
        { minWords: 20, model: "According to Morales (2021), younger speakers are probably losing tonal contrasts because they hear the language less at home, not simply because of contact with Spanish.", checklist: ["Different sentence structure", "Same meaning and contrast", "Hedge kept (likely/probably)", "Citation included", "Technical terms preserved"] }),
    ],
  },
  {
    id: "a-summary", module: "academic", group: "Sources", title: "Summarizing", tag: "acad:summarizing", lvl: 60, icon: "🧾",
    summary: "Main claim + key support, in your own words, without examples or your opinion (unless asked).",
    body: `A summary reduces a text to its **main claim** and **essential support**.

1. Identify the **purpose** and **main claim** (often in the abstract, introduction or conclusion).
2. Keep the **logical relations** (cause, contrast, concession).
3. Omit examples, repetitions and minor details.
4. Use **reporting verbs** that reflect the author's stance.
5. Keep your opinion out — unless the task asks for evaluation (then separate it: *However, the argument does not account for…*).

**Structure for an article summary (80–120 words):** reference + main claim → method/evidence → key findings → conclusion/implication.`,
    items: [
      mcq("as1", "acad:summarizing", 60, "Which element usually does **not** belong in a short summary?", ["The author's main claim", "The key evidence", "A vivid example the author uses in paragraph 4", "The conclusion"], 2, "Examples illustrate; they are usually omitted from short summaries."),
      mcq("as2", "acad:summarizing", 62, "Which opening is best for a summary of an article?", [
        "This article is very interesting and talks about tone.",
        "In this article, Morales (2021) examines why younger Guarijío speakers are losing tonal contrasts and argues that reduced home exposure is the main factor.",
        "Tone is a very important feature of languages all over the world.",
        "I think this article is right about tone."], 1,
        "It gives the **reference**, the **topic/purpose** and the **main claim** in one sentence."),
      produce("as3", "acad:summarizing", 64, "Summarise a research article you know well (or your own thesis project) in **80–110 words** using this structure: reference + aim → method → main findings → conclusion.",
        "Check that you kept only essential information and used precise reporting verbs.",
        { minWords: 80, checklist: ["Reference and aim in the first sentence", "Method in one sentence", "Main findings stated precisely", "Conclusion/implication", "No personal opinion mixed in", "Within the word limit"] }),
    ],
  },
  {
    id: "a-synthesis", module: "academic", group: "Sources", title: "Synthesis: comparing and contrasting studies", tag: "acad:synthesis", lvl: 66, icon: "🕸️",
    summary: "Organise the literature by idea, not by author: agreement, disagreement, gaps.",
    body: `**Synthesis** combines several sources into one argument. The key move is organising by **theme**, not by author.

✗ *Smith says X. Jones says Y. Lee says Z.* (a list)
✓ *While there is broad agreement that X (Smith, 2010; Lee, 2015), studies differ on whether Y (cf. Jones, 2018).*

#### Language
- Agreement: *Consistent with…*, *In line with…*, *Similarly, …*, *X and Y both report…*
- Contrast: *In contrast to…*, *Whereas X…, Y…*, *These findings are at odds with…*
- Partial agreement: *X's results partly confirm…*, *Although broadly in line with…, …*
- Gaps: *However, none of these studies…*, *Little attention has been paid to…*, *It remains unclear whether…*
- Evaluating: *The evidence for X is stronger than for Y because…*`,
    examples: [
      { t: "While there is broad agreement that tone loss is under way (Miller, 1996; Ruiz, 2020), studies differ on whether it is driven by contact or by internal change (cf. Morales, 2021).", k: "good" },
    ],
    items: [
      mcq("sy1", "acad:synthesis", 64, "Which sentence **synthesises** rather than lists?", [
        "Miller (1996) studied tone. Ruiz (2020) also studied tone. Morales (2021) studied tone too.",
        "Miller (1996), Ruiz (2020) and Morales (2021) agree that tone is being lost, but only Morales attributes the loss to reduced home exposure.",
        "There are three studies about tone.",
        "Tone has been studied by many people over the years."], 1,
        "B relates the sources to each other (agreement + difference) around a **theme**."),
      gap("sy2", "acad:synthesis", 62, "These results are ___ line with earlier reports of vowel reduction in fast speech.", ["in"], "**In line with** = consistent with."),
      mcq("sy3", "acad:synthesis", 66, "Choose the best gap statement after a literature review.", [
        "Nobody has ever studied anything about Guarijío.",
        "However, none of these studies has examined how tone interacts with stress in spontaneous speech.",
        "This topic is very interesting and important.",
        "There are many gaps in research."], 1,
        "A good gap statement is **specific** and follows from the reviewed literature.",
        ["Overstated and almost certainly false.", null, "Not a gap: an evaluation.", "Vague."], ["too-extreme", null, "wrong-focus", "too-general"]),
      produce("sy4", "acad:synthesis", 68, "Write a **synthesis paragraph** (100–140 words) combining these findings:\n\n- Study A (Mexico, 2015): heritage speakers reduce unstressed vowels more than L1 speakers.\n- Study B (USA, 2019): no difference between heritage and L1 speakers in vowel reduction.\n- Study C (Spain, 2021): reduction depends on amount of daily use, not on speaker group.",
        "Organise by idea: the disagreement between A and B, then C as a possible explanation. End with a gap or implication.",
        { minWords: 100, model: "Findings on vowel reduction in heritage speakers are mixed. While Study A (2015) reports greater reduction of unstressed vowels among heritage speakers than among L1 speakers, Study B (2019) finds no group difference. One way of reconciling these results is suggested by Study C (2021), which shows that reduction varies with the amount of daily language use rather than with speaker group as such. If this is the case, the contrasting results of A and B may reflect differences in how much their participants used the language, a variable neither study controlled. Future work should therefore measure language use directly rather than relying on group labels.", checklist: ["Organised by idea, not by study", "Shows agreement/disagreement explicitly", "Offers an explanation linking sources", "Ends with a gap or implication", "Uses hedging"] }),
    ],
  },
  {
    id: "a-methods", module: "academic", group: "Research writing", title: "Describing methodology", tag: "acad:methodology", lvl: 62, icon: "🧪",
    summary: "Participants, materials, procedure, analysis — precise, replicable, justified.",
    body: `A Methods section must allow **replication** and **justify choices**.

- **Participants**: *Twenty-four speakers (12 women; aged 19–78) were recruited through…*
- **Materials**: *The stimuli consisted of…*, *A wordlist of 60 items was designed to…*
- **Procedure**: past tense, often passive: *Recordings were made using…*, *Each participant was asked to…*
- **Analysis**: *Vowel duration was measured in Praat…*, *Data were analysed using linear mixed-effects models with…*
- **Justification**: *This method was chosen because…*, *Following Ladefoged (2003), …*, *To control for…, …*
- **Ethics**: *Informed consent was obtained from all participants.*

Numbers: spell out numbers that start a sentence (*Twenty-four speakers…*).`,
    items: [
      spot("am1", "acad:methodology", 56, ["24 speakers", "were recruited", "through community", "networks."], 0, "Twenty-four speakers", "Don't begin a sentence with a numeral: spell it out or rephrase."),
      mcq("am2", "acad:methodology", 62, "Which sentence best **justifies** a methodological choice?", [
        "We used a wordlist.",
        "A wordlist was used because it allows controlled comparison of the same segmental contexts across speakers.",
        "Wordlists are good.",
        "We used a wordlist because we wanted to."], 1, "Justification states **why** the method serves the research question."),
      produce("am3", "acad:methodology", 64, "Write 4–5 sentences describing the method of your (real or planned) thesis research: participants, materials, procedure, analysis, and one justification.",
        "Check tense (past), voice (passive or *we*), precision (numbers, tools) and the presence of at least one justification.",
        { minWords: 70, checklist: ["Participants described with numbers", "Materials/stimuli described", "Procedure in past tense", "Analysis tool or method named", "At least one justification (because / in order to / following X)"] }),
      mcq("am4", "acad:methodology", 60, "Choose the most precise sentence.", [
        "We recorded some people for a while.",
        "Each participant was recorded for approximately 45 minutes in a quiet room using a head-mounted microphone.",
        "Participants were recorded a lot.",
        "Recordings happened."], 1, "Precision: quantity, duration, setting, equipment."),
    ],
  },
  {
    id: "a-results", module: "academic", group: "Research writing", title: "Describing and interpreting results", tag: "acad:results", lvl: 64, icon: "📊",
    summary: "Report what you found (Results) separately from what it means (Discussion).",
    body: `#### Reporting results (past tense, precise)
- *Mean duration was significantly longer in stressed syllables (M = 142 ms, SD = 21) than in unstressed ones (M = 98 ms, SD = 18).*
- *As shown in Figure 2, …*, *Table 3 presents…*
- Trends: *rose sharply, declined steadily, remained stable, peaked at, fluctuated*
- Comparisons: *twice as long as*, *considerably higher than*, *slightly lower than*

#### Interpreting (present tense + hedging)
- *This suggests that…*, *One possible explanation is that…*, *This finding is consistent with…*
- *Contrary to our predictions, …*, *Unexpectedly, …*
- **Don't** over-interpret non-significant results: *There was no significant difference* ≠ *the groups are the same*.`,
    items: [
      mcq("ar1x", "acad:results", 64, "A t-test found **no significant difference** between groups. Which interpretation is appropriate?", [
        "The two groups are identical.",
        "We found no evidence of a difference between the groups in this sample.",
        "Group membership has no effect at all.",
        "The hypothesis was proven false."], 1,
        "Absence of evidence ≠ evidence of absence: a non-significant result doesn't prove equality.",
        ["Overinterprets a null result.", null, "Overgeneralises.", "Null results don't 'prove' anything false."], ["too-extreme", null, "too-extreme", "too-extreme"], { tests: "meaning" }),
      mcq("ar2x", "acad:results", 58, "Choose the best description of a trend.", ["The numbers went up a lot and then down.", "The number of speakers declined steadily between 1980 and 2020.", "Speakers did a decline.", "The speakers number was going downly."], 1, "Precise verb + adverb + time frame."),
      gap("ar3x", "acad:results", 60, "As ___ in Figure 2, duration increases with age.", ["shown", "illustrated", "seen"], "Fixed reference to visuals: *As shown in Figure 2*."),
      produce("ar4x", "acad:results", 66, "Data: *Older speakers (60+) produced the glottal stop in 84% of tokens; middle-aged speakers (35–59) in 61%; younger speakers (18–34) in 23%.* Write **2 sentences reporting** the result and **2 sentences interpreting** it (hedged).",
        "Results: past tense, numbers, comparison. Interpretation: present tense, hedge, possible explanation.",
        { minWords: 60, model: "Use of the glottal stop decreased sharply across age groups: older speakers produced it in 84% of tokens, compared with 61% for middle-aged speakers and only 23% for younger speakers. The largest drop occurred between the middle and younger groups. This apparent-time pattern suggests that the glottal stop is being lost. One possible explanation is reduced exposure to the language among younger speakers, although contact with Spanish may also play a role.", checklist: ["Reports numbers accurately", "Uses comparative language", "Separates report from interpretation", "Interpretation is hedged", "Offers a possible explanation"] }),
    ],
  },
  {
    id: "a-limits", module: "academic", group: "Research writing", title: "Discussing limitations", tag: "acad:limitations", lvl: 62, icon: "🚧",
    summary: "State limitations honestly, explain their effect, and say what would address them.",
    body: `A good limitation statement has three parts: **the limitation → its possible effect → how future work could address it**.

- *One limitation of this study is that…*, *The findings should be interpreted in light of…*
- *Because the sample was drawn from…, the results may not generalise to…*
- *Future research could address this by…*

Avoid both extremes: ignoring obvious limitations, or listing so many that the study seems worthless. End by restating what the study **does** contribute.`,
    items: [
      mcq("al1", "acad:limitations", 62, "Which limitation statement is most complete?", [
        "The sample was small.",
        "The study has many problems.",
        "Because the sample was drawn from a single community, the findings may not generalise to other varieties; future work should include speakers from both Sonora and Chihuahua.",
        "Sorry, the sample was not perfect."], 2, "It names the limitation, its **effect** and a **remedy**."),
      produce("al2", "acad:limitations", 64, "Write a limitation paragraph (60–90 words) for your own thesis or a study you know. Include: limitation → effect → future research → what the study still contributes.",
        "Check the four moves.", { minWords: 60, checklist: ["Names a specific limitation", "Explains its possible effect", "Suggests how future work could address it", "Ends with the study's contribution", "Tone is honest but not self-defeating"] }),
    ],
  },
  {
    id: "a-disagree", module: "academic", group: "Interaction", title: "Agreement, disagreement and academic politeness", tag: "acad:disagreement", lvl: 64, icon: "🤺",
    summary: "Disagree with a scholar (or a professor) clearly, respectfully and with reasons.",
    body: `Academic disagreement targets **ideas, not people**, and is supported by **reasons**.

#### Written
- *While X's analysis is persuasive in many respects, it does not account for…*
- *This interpretation is difficult to reconcile with…*
- *X's conclusion rests on the assumption that…, which is questionable because…*

#### Spoken (seminar, supervision)
- *I see your point, but I wonder whether…*
- *That's a fair point. However, in my data…*
- *Could I push back on that slightly? …*
- *I'm not sure I'd go quite that far — …*
- *I take your point about X, but I'd still argue that…*

#### Agreement (with added value)
- *I'd agree with that, and I'd add that…*, *Building on X's point, …*

#### Politeness devices
Hedges, questions instead of assertions, acknowledging the other view first, *we* instead of *you*.`,
    items: [
      mcq("ad1", "acad:disagreement", 62, "Your supervisor says your sample is too small. Which response is **most appropriate**?", [
        "No, you're wrong. It's fine.",
        "That's a fair point. Although the sample is small, the pattern is consistent across all three villages — would that be enough if I framed the claim more cautiously?",
        "Whatever, everyone uses small samples.",
        "I disagree completely with you."], 1,
        "Acknowledge → give a reason → propose a solution (and invite the supervisor's view).", null, null, { skill: "speaking" }),
      judge("ad2", "acad:disagreement", 64, "Smith's analysis is completely wrong and obviously naïve.", true, false,
        "Grammatical, but the criticism is **personalised**, unsupported and too strong for academic prose.",
        "Smith's analysis does not account for the variation found in spontaneous speech, which suggests that the proposed rule may be too narrow.", "Literature review"),
      produce("ad3", "acad:disagreement", 66, "A professor in a seminar says: *“Your interpretation is just speculation — there's no evidence for it.”* Write (or say) a polite but firm reply of 3–4 sentences.",
        "Acknowledge, provide evidence, concede the limit, keep your position.", { minWords: 40, model: "I take your point that the evidence is limited. However, the interpretation is based on two independent patterns in the data: the age gradient and the difference between home and school recordings. I'd agree that it remains a hypothesis rather than a conclusion, and I've framed it that way in the chapter, but I think it's the most plausible explanation of the data we have.", checklist: ["Acknowledges the objection", "Provides specific evidence", "Concedes what is fair", "Maintains the position politely", "Uses hedging and politeness markers"] }),
    ],
  },
  {
    id: "a-precision", module: "academic", group: "Style", title: "Precision, concision and redundancy", tag: "acad:precision", lvl: 64, icon: "✂️",
    summary: "Say exactly what you mean with as few words as needed.",
    body: `#### Redundancy to cut
*past history, future plans, completely unanimous, basic fundamentals, end result, in order to* (often → *to*), *due to the fact that* (→ *because*), *at this point in time* (→ *now*), *it is important to note that* (often deletable), *the reason why… is because* (→ *the reason… is that*).

#### Vague → precise
*things* → factors / features / variables · *a lot* → specify · *big* → substantial / considerable · *show* → reveal / indicate / demonstrate (choose the right strength) · *good* → robust / reliable / valid · *affect* → increase / reduce / modulate.

#### Concision ≠ simplicity
Keep technical terms; remove empty words.`,
    examples: [
      { t: "Due to the fact that the participants were all completely unanimous in their answers, it is important to note that the end result was clear.", k: "bad" },
      { t: "Because the participants answered unanimously, the result was clear.", k: "good" },
    ],
    items: [
      mcq("ap_1", "acad:precision", 60, "Which version is most concise without losing meaning?", [
        "Due to the fact that the participants were all completely unanimous, the end result was clear.",
        "Because the participants were unanimous, the result was clear.",
        "Because of the reason that the participants agreed, the final end result was clear.",
        "The participants were unanimous, which is why, because of this, the result was clear."], 1, "*Due to the fact that* → *because*; *completely unanimous* and *end result* are redundant."),
      judge("ap_2", "acad:precision", 62, "The reason why the vowels are shorter is because speakers talk faster.", true, false,
        "Accepted in speech, but redundant in formal writing (*reason why… because*). Also *talk faster* is imprecise.",
        "The vowels are shorter because of increased speech rate.", "Results section"),
      produce("ap_3", "acad:precision", 64, "Cut this to **25 words or fewer** without losing information:\n\n*At this point in time, it is important to note that there are a lot of different things that can have an effect on the way in which speakers produce vowels in fast speech.*",
        "Target: *Many factors affect how speakers produce vowels in fast speech.* (10 words)", { minWords: 6, maxWords: 25, model: "Many factors affect vowel production in fast speech.", checklist: ["25 words or fewer", "No information lost", "Vague words replaced (things → factors)", "Empty phrases removed"] }),
    ],
  },
  {
    id: "a-email", module: "academic", group: "Interaction", title: "Academic emails", tag: "acad:email", lvl: 56, icon: "✉️",
    summary: "Writing to professors, editors and potential supervisors: clear subject, purpose first, polite request.",
    body: `#### Structure
1. **Subject line**: specific (*Prospective PhD applicant – phonology of Guarijío*).
2. **Greeting**: *Dear Professor Smith,* (not *Hi teacher*; check the title — *Dr* vs. *Professor*).
3. **Purpose in the first two sentences**.
4. **Context** (brief, relevant).
5. **Request**, polite and specific: *I would be grateful if you could…*, *Would you be willing to…?*
6. **Closing**: *Thank you for your time and consideration.* / *I look forward to hearing from you.* + *Best regards / Kind regards,*

#### Politeness
Past forms and modals soften requests: *I was wondering whether…*, *Would it be possible to…?*
Avoid: *I want…*, *Please answer me soon*, overly long life stories.`,
    items: [
      mcq("ae1", "acad:email", 56, "Which opening is best when writing to a potential PhD supervisor you have never met?", [
        "Hi teacher! How are you?",
        "Dear Professor Smith, I am writing to enquire whether you might be accepting doctoral students in 2027.",
        "Hello, I want to do a PhD with you.",
        "To whom it may concern, please read my CV."], 1, "Correct title, purpose in the first sentence, tentative request.", null, null, { skill: "writing" }),
      gap("ae2", "acad:email", 58, "I would be grateful ___ you could send me a copy of the questionnaire.", ["if"], "*I would be grateful if you could…* — a standard polite request."),
      produce("ae3", "acad:email", 62, "Write an email (120–160 words) to a professor at a foreign university asking whether they would consider supervising your PhD on the phonology of an Indigenous language. Mention your background, your project idea and a specific request (e.g., a short video call).",
        "Check structure, register, specificity and politeness.", { minWords: 120, checklist: ["Specific subject line", "Correct greeting and title", "Purpose in first two sentences", "Brief relevant background", "One specific, polite request", "Appropriate closing"], skill: "writing" }),
    ],
  },
];
