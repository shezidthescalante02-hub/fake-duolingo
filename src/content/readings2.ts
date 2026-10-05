import type { ReadingSet } from "./types";
import { mcq, tf } from "./helpers";

export const READINGS_2: ReadingSet[] = [
  {
    id: "r-apparent", title: "Watching Language Change Without a Time Machine", discipline: "linguistics", genre: "research", lvl: 80,
    paragraphs: [
      "Linguists who study sound change face an obvious methodological obstacle: change typically unfolds over decades, while research projects rarely last more than a few years. One influential solution, associated with the early work of William Labov, is to study change in apparent time. Rather than following a community for fifty years, the researcher records speakers of different ages at a single moment and treats the differences between generations as a proxy for change over time. If older speakers consistently use one variant and younger speakers another, the younger speakers' pattern is taken to represent the direction in which the community is moving.",
      "The apparent-time construct rests on a crucial assumption: that an individual's speech remains relatively stable once it has been acquired, roughly by late adolescence. If a sixty-year-old's vowels today are essentially those she acquired as a teenager, then her speech offers a window onto the community norms of several decades ago. The approach is elegant and economical, and many of its predictions have been confirmed when communities were later revisited.",
      "Yet the assumption is not always justified. Some linguistic features are age-graded: speakers use them more at certain stages of life and abandon them later, without the community as a whole changing at all. Adolescent slang is the familiar example, but age-grading can also affect phonetic variables, for instance when speakers entering the labour market adopt more standard forms. In such cases, an apparent-time snapshot would wrongly suggest that the community is changing when what is really changing is individuals as they age.",
      "To disentangle these possibilities, researchers turn to real-time evidence of two kinds. Trend studies return to the same community after an interval and sample new speakers, revealing whether community norms have shifted. Panel studies, which are rarer and more demanding, re-record the same individuals. Panel evidence has shown that adults are not as linguistically fixed as the apparent-time assumption implies. In a study of Montreal French, for example, some speakers recorded as adults later shifted their pronunciation of /r/ in the direction of the change under way in the community, while others did not. Perhaps the most widely publicised case is an acoustic analysis of the annual Christmas broadcasts of Queen Elizabeth II, which found that her vowels had moved, over several decades, some way towards those of younger speakers of the standard variety — hardly a speaker one would expect to be swayed by passing fashion.",
      "None of this invalidates apparent-time research. Lifespan changes of this kind are usually smaller than the differences between generations, so apparent-time comparisons may, if anything, underestimate the speed of community change. The more general lesson is methodological: an apparent-time distribution is compatible with several histories, and interpreting it responsibly requires independent evidence about how individuals and communities change. For researchers working on minority languages, where earlier recordings are often scarce, this means treating archival material — however patchy — as a valuable source of real-time comparison.",
    ],
    questions: [
      mcq("ap1x", "rd:main-idea", 76, "What is the main purpose of the passage?", [
        "To explain the apparent-time method, its central assumption, and how real-time evidence qualifies it",
        "To argue that apparent-time research should be abandoned",
        "To describe the history of Montreal French",
        "To prove that adults never change their speech"], 0, "Method → assumption → problem (age-grading) → real-time evidence → balanced conclusion.",
        [null, "Contradicts P5 (*None of this invalidates…*).", "Only an example.", "The passage says the opposite."], [null, "contradicts", "too-specific", "contradicts"]),
      mcq("ap2x", "rd:detail", 74, "What assumption underlies the apparent-time construct?", [
        "Individuals' speech remains relatively stable after adolescence.",
        "Communities never change.",
        "Older speakers are more conservative because of their education.",
        "Younger speakers imitate older speakers."], 0, "*That an individual's speech remains relatively stable once it has been acquired, roughly by late adolescence.*"),
      mcq("ap3x", "rd:vocab", 76, "In paragraph 1, **proxy** is closest in meaning to…", ["a substitute measure", "a contradiction", "a cause", "a final proof"], 0, "Generational differences *stand in for* change over time."),
      mcq("ap4x", "rd:inference", 80, "What problem does age-grading pose for apparent-time studies?", [
        "Differences between age groups may reflect life stages rather than community change.",
        "It makes older speakers impossible to record.",
        "It means that sound change cannot occur.",
        "It only affects slang, not pronunciation."], 0, "An apparent-time snapshot *would wrongly suggest that the community is changing when what is really changing is individuals as they age*.",
        [null, "Out of scope.", "Too extreme.", "Contradicted: it *can also affect phonetic variables*."], [null, "out-of-scope", "too-extreme", "contradicts"]),
      mcq("ap5x", "rd:organization", 78, "What distinguishes panel studies from trend studies?", [
        "Panel studies re-record the same individuals; trend studies sample new speakers from the same community.",
        "Trend studies are more demanding.",
        "Panel studies use apparent time.",
        "Trend studies only use archival recordings."], 0, "Stated directly in P4.", [null, "Reversed: panel studies are *rarer and more demanding*.", "No: both are real-time.", "Not stated."], [null, "reversed", "contradicts", "out-of-scope"]),
      mcq("ap6x", "rd:purpose", 80, "Why does the author describe the Queen as 'hardly a speaker one would expect to be swayed by passing fashion'?", [
        "To emphasise that even a highly conservative, stable speaker showed lifespan change",
        "To criticise the Queen's pronunciation",
        "To suggest that the study was unreliable",
        "To show that royal speech drives community change"], 0, "The ironic remark strengthens the evidence: if *she* changed, adult stability cannot be taken for granted.",
        [null, "No evaluation of her speech.", "Opposite: the example supports the point.", "Reverses the direction: her vowels moved *towards* younger speakers."], [null, "out-of-scope", "reversed", "reversed"]),
      mcq("ap7x", "rd:inference", 84, "Why might apparent-time comparisons *underestimate* the speed of change, according to paragraph 5?", [
        "Because older speakers may themselves have partly adopted the change, reducing the gap between generations",
        "Because younger speakers exaggerate new forms",
        "Because panel studies are rare",
        "Because archival recordings are patchy"], 0,
        "If adults shift slightly towards the change (lifespan change), the difference between old and young looks **smaller** than the real change in the community. This is a necessary step from P4–P5, not stated verbatim.",
        [null, "That would cause overestimation, if anything.", "Rarity of panel studies doesn't affect the size of the estimate.", "Relevant to minority languages, but not the reason."], [null, "reversed", "wrong-focus", "wrong-focus"], { deep: "The logic: change in apparent time = difference between generations. If older speakers have moved partway toward the innovation during their lives, the observed difference is compressed, so the inferred rate of community change is lower than the true rate." }),
      mcq("ap8x", "rd:implication", 78, "What does the passage imply for research on minority languages?", [
        "Even incomplete archival recordings are worth using as real-time evidence.",
        "Apparent-time methods cannot be used.",
        "Only panel studies are valid.",
        "Archival recordings should be avoided because they are patchy."], 0, "*Treating archival material — however patchy — as a valuable source of real-time comparison.*"),
      tf("ap9x", "rd:detail", 76, "In the Montreal study, all adult speakers changed their pronunciation of /r/.", "F", "*Some speakers… shifted… while others did not.*"),
    ],
    annotations: [
      { p: 0, q: "One influential solution, associated with the early work of William Labov", type: "claim", note: "Introduces the method being evaluated." },
      { p: 1, q: "The apparent-time construct rests on a crucial assumption", type: "claim", note: "Identifies the assumption the argument will test." },
      { p: 2, q: "Yet the assumption is not always justified.", type: "counter", note: "Counterargument begins." },
      { p: 3, q: "Panel evidence has shown that adults are not as linguistically fixed as the apparent-time assumption implies.", type: "evidence", note: "Real-time evidence qualifying the assumption." },
      { p: 4, q: "None of this invalidates apparent-time research.", type: "stance", note: "The writer's balanced position after the critique." },
      { p: 4, q: "may, if anything, underestimate", type: "hedge", note: "Double hedge on a counterintuitive claim." },
    ],
  },
  {
    id: "r-hgt", title: "Genes That Travel Sideways", discipline: "biology", genre: "expository", lvl: 74,
    paragraphs: [
      "The familiar image of evolution is a tree: species branch off from common ancestors, and genetic information flows downward from parents to offspring. For much of the living world, this picture is broadly accurate. Among bacteria and archaea, however, genes also move sideways, passing between organisms that may be only distantly related. This process, known as horizontal (or lateral) gene transfer, has transformed how biologists think about microbial evolution.",
      "Bacteria can acquire foreign DNA in at least three ways. In transformation, a cell takes up fragments of DNA released into the environment by other cells, a phenomenon first observed in a famous experiment in 1928, in which a harmless strain of bacteria became virulent after exposure to material from a dead virulent strain. In transduction, viruses that infect bacteria accidentally package bacterial genes and deliver them to new hosts. In conjugation, two cells come into direct contact and one transfers a copy of a small, circular DNA molecule called a plasmid to the other.",
      "The practical significance of these mechanisms is most evident in the spread of antibiotic resistance. Genes that allow bacteria to survive a particular antibiotic are frequently carried on plasmids, and conjugation can move them not only within a species but across species boundaries. A resistance gene that arises in one harmless bacterium may therefore end up in a dangerous pathogen. This helps explain why resistance can spread far more rapidly than would be expected if each species had to evolve it independently through mutation.",
      "Horizontal transfer also complicates efforts to reconstruct evolutionary history. If a bacterium's genome is a mosaic of genes acquired from many sources, then different genes may tell different stories about its ancestry. Some researchers have argued that, for microbes at least, the tree metaphor should be replaced by that of a web or network. Others maintain that a 'core' of genes involved in essential functions, such as building proteins, is transferred rarely enough to preserve a recognisable tree-like signal.",
      "In plants and animals, horizontal transfer appears to be much less common, though not absent. Certain microscopic animals known as bdelloid rotifers, for instance, have been reported to carry a notable proportion of genes of foreign origin, although estimates have been revised as sequencing methods have improved. Such cases suggest that the boundaries between lineages, even in complex organisms, are somewhat more permeable than the traditional tree implies.",
    ],
    questions: [
      mcq("hg1x", "rd:main-idea", 70, "What is the main idea of the passage?", [
        "Gene transfer between organisms, especially microbes, complicates the tree model of evolution and has practical consequences.",
        "Evolution is not real.",
        "Antibiotics should not be used.",
        "Bdelloid rotifers are the most important organisms in evolution."], 0, "Mechanisms, consequences (resistance), theoretical implications, extension to complex organisms."),
      mcq("hg2x", "rd:detail", 68, "Which mechanism involves direct contact between two cells?", ["Conjugation", "Transformation", "Transduction", "Mutation"], 0, "*In conjugation, two cells come into direct contact…*"),
      mcq("hg3x", "rd:inference", 74, "Why can antibiotic resistance spread rapidly?", [
        "Resistance genes can be transferred between species instead of evolving separately in each.",
        "Bacteria mutate faster when exposed to antibiotics.",
        "Plasmids destroy antibiotics.",
        "Viruses are resistant to antibiotics."], 0, "*Far more rapidly than would be expected if each species had to evolve it independently.*",
        [null, "Not stated.", "Plasmids *carry* resistance genes; they don't destroy antibiotics.", "Out of scope."], [null, "true-not-stated", "over-inference", "out-of-scope"]),
      mcq("hg4x", "rd:vocab", 72, "**Mosaic** (paragraph 4) suggests that the genome is…", ["composed of pieces from different sources", "very old", "beautiful", "easy to read"], 0, "A mosaic is made of many separate pieces — here, genes of different origins."),
      mcq("hg5x", "rd:organization", 74, "How does paragraph 4 present the debate about the tree metaphor?", [
        "It reports two opposing positions without fully endorsing either.",
        "It rejects the tree metaphor completely.",
        "It proves the core-gene view correct.",
        "It ignores alternative views."], 0, "*Some researchers have argued… Others maintain…*"),
      mcq("hg6x", "rd:attitude", 76, "The author's comment that estimates for bdelloid rotifers 'have been revised' shows…", [
        "caution about the precision of the reported figures",
        "that the rotifer findings were fraudulent",
        "that horizontal transfer does not occur in animals",
        "strong confidence in the original estimates"], 0, "A hedge signalling that the numbers are uncertain, not that the phenomenon is unreal.",
        [null, "Too extreme.", "Contradicts *though not absent*.", "Opposite."], [null, "too-extreme", "contradicts", "reversed"]),
      tf("hg7x", "rd:detail", 70, "The 1928 experiment demonstrated transduction.", "F", "It demonstrated **transformation** (uptake of DNA from the environment)."),
      tf("hg8x", "rd:detail", 72, "Horizontal gene transfer is as common in animals as in bacteria.", "F", "*Much less common, though not absent.*"),
    ],
    annotations: [
      { p: 0, q: "For much of the living world, this picture is broadly accurate.", type: "hedge", note: "Concedes the traditional model before qualifying it." },
      { p: 2, q: "This helps explain why resistance can spread far more rapidly", type: "claim", note: "Causal claim, softened by *helps explain*." },
      { p: 3, q: "Some researchers have argued", type: "counter", note: "Position 1." },
      { p: 3, q: "Others maintain", type: "counter", note: "Position 2." },
      { p: 4, q: "although estimates have been revised as sequencing methods have improved", type: "limit", note: "Limitation on the evidence." },
      { p: 4, q: "somewhat more permeable than the traditional tree implies", type: "stance", note: "Cautious conclusion." },
    ],
  },
  {
    id: "r-literacy", title: "Counting Readers in the Past", discipline: "history", genre: "academic", lvl: 66,
    paragraphs: [
      "How many people in the past could read? The question matters for historians of religion, politics and culture alike, yet it is notoriously difficult to answer. Before the age of national censuses and standardised testing, few sources record literacy directly. Historians have therefore had to rely on indirect indicators, each of which captures only part of what 'being literate' meant.",
      "The most widely used indicator in early modern England is the ability to sign one's name. After 1754, a change in the law required couples marrying in the Church of England to sign the marriage register or make a mark. Because almost everyone married, these registers provide a remarkably large and socially varied body of evidence, and historians have used them to trace changes in signature rates across regions, occupations and generations.",
      "Signatures, however, are an imperfect measure. In early modern schooling, reading was usually taught before writing, and many children left school after learning to read but before learning to write. A person who could read a printed Bible but had never been taught to form letters would appear in the registers as illiterate. This problem may have been particularly acute for women, whose education more often stopped at reading. Signature rates, in other words, probably underestimate the proportion of people who could read, and the size of that underestimate may have varied between men and women.",
      "Other sources can partly compensate. Records of book ownership in probate inventories, the testimony of autobiographies, and the sheer volume of cheap print — ballads, almanacs, pamphlets — all suggest a reading public larger than signature rates alone would imply. Each of these sources has its own biases: inventories over-represent the wealthy, and autobiographies were written by the unusual minority who later wrote at length. The most persuasive accounts therefore combine several indicators, treating literacy not as a single skill that people either had or lacked but as a range of abilities distributed unevenly across society.",
    ],
    questions: [
      mcq("li1", "rd:main-idea", 64, "What is the passage mainly about?", [
        "The difficulty of measuring historical literacy and the limitations of the main evidence",
        "The history of the Church of England",
        "Why women were not educated",
        "The popularity of ballads"], 0, "The question, the main indicator, its limitations, and complementary sources."),
      mcq("li2", "rd:detail", 62, "Why are marriage registers valuable evidence?", ["Almost everyone married, so they cover a large and varied population.", "They record reading ability directly.", "They were written by historians.", "Only educated people signed them."], 0, "*Because almost everyone married, these registers provide a remarkably large and socially varied body of evidence.*", [null, "They record signing, not reading.", "No.", "Opposite: everyone had to sign or make a mark."], [null, "contradicts", null, "contradicts"]),
      mcq("li3", "rd:inference", 68, "Why might signature rates underestimate women's reading ability more than men's?", [
        "Women's schooling more often ended after reading was taught, before writing.",
        "Women refused to sign registers.",
        "Women read fewer books.",
        "Men forged women's signatures."], 0, "*Whose education more often stopped at reading.*"),
      mcq("li4", "rd:vocab", 64, "**Acute** in paragraph 3 is closest in meaning to…", ["severe", "sharp-angled", "intelligent", "sudden"], 0, "*Particularly acute* = particularly serious."),
      mcq("li5", "rd:purpose", 66, "Why does the author mention cheap print such as ballads and almanacs?", [
        "As evidence that the reading public was larger than signatures suggest",
        "To show that literature was of poor quality",
        "To explain why reading was taught before writing",
        "To argue that signatures are useless"], 0, "These sources *suggest a reading public larger than signature rates alone would imply*."),
      mcq("li6", "rd:conclusion", 70, "Which view of literacy does the final sentence endorse?", [
        "A spectrum of abilities unevenly distributed, best studied with multiple sources",
        "A single skill people either had or lacked",
        "A skill that can be measured only by signatures",
        "A skill limited to the wealthy"], 0, "*Not as a single skill… but as a range of abilities distributed unevenly across society.*"),
      tf("li7", "rd:detail", 64, "Probate inventories over-represent the wealthy.", "T", "Stated in P4."),
      tf("li8", "rd:detail", 66, "Signature rates were higher in towns than in rural areas.", "NG", "Regions are mentioned as a dimension of analysis, but no comparison is reported."),
    ],
    annotations: [
      { p: 0, q: "it is notoriously difficult to answer", type: "claim", note: "Problem statement." },
      { p: 2, q: "Signatures, however, are an imperfect measure.", type: "limit", note: "Limitation of the main indicator." },
      { p: 2, q: "probably underestimate", type: "hedge", note: "Hedged inference." },
      { p: 3, q: "Each of these sources has its own biases", type: "limit", note: "Limitations of the alternatives too." },
      { p: 3, q: "The most persuasive accounts therefore combine several indicators", type: "stance", note: "Writer's methodological position." },
    ],
  },
  {
    id: "r-placebo", title: "The Power and Limits of Expectation", discipline: "medicine", genre: "academic", lvl: 76,
    paragraphs: [
      "In clinical trials, patients who receive an inert substance — a sugar pill, a saline injection — often report that their symptoms improve. This placebo response is sometimes presented as evidence that 'the mind can heal the body'. The reality is more complicated, and more interesting, than either enthusiasts or sceptics tend to admit.",
      "Part of what looks like a placebo effect is not caused by the placebo at all. Many conditions fluctuate naturally, and patients tend to enrol in trials when their symptoms are at their worst. Because extreme values are usually followed by less extreme ones — a statistical phenomenon known as regression to the mean — many patients would improve even without any intervention. Only by comparing a placebo group with a no-treatment group can researchers estimate how much of the improvement is attributable to the placebo itself.",
      "When such comparisons are made, genuine placebo effects do appear, but they are concentrated in outcomes that patients report themselves, such as pain, nausea and fatigue, rather than in objective measures such as tumour size. Expectation and conditioning seem to be the main mechanisms: patients who expect relief, or who have previously experienced relief after taking pills, may experience changes in how symptoms are perceived and, in the case of pain, measurable changes in the brain's processing of pain signals.",
      "Expectations can also do harm. In the nocebo effect, negative expectations produce unpleasant symptoms. Participants in placebo groups regularly report side effects they have been warned about, and the way risks are communicated appears to influence how often such complaints occur. This poses an ethical dilemma for clinicians, who are obliged to inform patients of possible side effects but may, by doing so, help to bring them about.",
      "Perhaps the most surprising recent findings concern so-called open-label placebos. In some trials, patients with conditions such as irritable bowel syndrome were told explicitly that they were receiving inert pills, yet reported greater symptom relief than patients who received no treatment. These results have attracted attention because they appear to sidestep the ethical problem of deception. They are, however, based on relatively small studies, in conditions where symptoms are self-reported, and participants could not be blinded to whether they received pills. Whether open-label placebos have a lasting clinical role remains an open question.",
    ],
    questions: [
      mcq("pl1", "rd:main-idea", 72, "What is the author's overall position on the placebo response?", [
        "It is real but narrower and more complex than popular claims suggest.",
        "It proves that the mind can heal any disease.",
        "It is entirely explained by statistics.",
        "It is unethical and should be banned."], 0, "*More complicated… than either enthusiasts or sceptics tend to admit.*",
        [null, "The enthusiasts' view, which the author qualifies.", "The sceptics' extreme; P3 says genuine effects appear.", "Out of scope."], [null, "too-extreme", "partial", "out-of-scope"]),
      mcq("pl2", "rd:detail", 70, "Why is a no-treatment group necessary?", [
        "To separate the effect of the placebo from natural improvement and regression to the mean",
        "To test the active drug",
        "To ensure patients are blinded",
        "To measure side effects"], 0, "Only the comparison shows *how much of the improvement is attributable to the placebo itself*."),
      mcq("pl3", "rd:inference", 76, "What can be inferred about placebo effects on tumour size?", [
        "They are unlikely to be substantial.",
        "They are larger than effects on pain.",
        "They are caused by regression to the mean.",
        "They have never been studied."], 0, "Effects are concentrated in self-reported outcomes *rather than* objective measures such as tumour size.",
        [null, "Reversed.", "Not stated.", "Too extreme / not stated."], [null, "reversed", "over-inference", "too-extreme"]),
      mcq("pl4", "rd:detail", 74, "What dilemma do clinicians face regarding the nocebo effect?", [
        "Informing patients about side effects may increase the chance that patients experience them.",
        "They cannot prescribe placebos legally.",
        "Patients refuse to take medicine.",
        "Side effects cannot be measured."], 0, "Stated at the end of P4."),
      mcq("pl5", "rd:vocab", 74, "**Sidestep** (paragraph 5) is closest in meaning to…", ["avoid", "solve completely", "cause", "ignore deliberately"], 0, "To sidestep a problem = to avoid having to deal with it."),
      mcq("pl6", "rd:limitations", 78, "Which is **not** mentioned as a limitation of open-label placebo studies?", [
        "They were funded by pharmaceutical companies.",
        "They were relatively small.",
        "Outcomes were self-reported.",
        "Participants could not be blinded."], 0, "Funding is never mentioned; the other three are listed in P5. (*Negative factual* question: find the option NOT in the text.)", undefined, undefined, { tests: "meaning" }),
      mcq("pl7", "rd:attitude", 76, "How does the author regard open-label placebos?", ["With interest but caution", "With complete scepticism", "As proven treatments", "As unethical"], 0, "*Most surprising… attracted attention… however… remains an open question.*"),
      tf("pl8", "rd:detail", 72, "Patients usually join trials when their symptoms are mild.", "F", "*When their symptoms are at their worst.*"),
    ],
    annotations: [
      { p: 0, q: "The reality is more complicated, and more interesting, than either enthusiasts or sceptics tend to admit.", type: "claim", note: "Thesis positioned between two camps." },
      { p: 1, q: "Part of what looks like a placebo effect is not caused by the placebo at all.", type: "counter", note: "Challenges the naïve interpretation." },
      { p: 2, q: "seem to be the main mechanisms", type: "hedge", note: "Hedged causal claim." },
      { p: 3, q: "appears to influence", type: "hedge", note: "Cautious about causation." },
      { p: 4, q: "They are, however, based on relatively small studies", type: "limit", note: "Limitations listed explicitly." },
      { p: 4, q: "remains an open question", type: "stance", note: "Suspended judgement." },
    ],
  },
  {
    id: "r-translation", title: "The Visible Translator", discipline: "literature", genre: "argumentative", lvl: 70,
    paragraphs: [
      "Reviewers of translated novels often praise a translation by saying that it 'reads as if it had been written in English'. The compliment reveals an expectation that is so widespread it can seem natural: that a good translation should be invisible, leaving no trace of the foreign language or of the translator's work. The American translation scholar Lawrence Venuti has argued that this expectation is neither natural nor neutral.",
      "Venuti drew on a distinction made in 1813 by the German philosopher Friedrich Schleiermacher, who described two basic options for the translator: either to leave the author in peace as much as possible and move the reader towards the author, or to leave the reader in peace and move the author towards the reader. Venuti reformulated these as foreignisation and domestication. A domesticating translation smooths away unfamiliar features of the original, adapting cultural references, syntax and idiom to the norms of the target language. A foreignising translation deliberately retains some of that strangeness, reminding readers that they are encountering a text from another culture.",
      "Venuti's critique is directed above all at domestication as the dominant norm in English-language publishing. When translations are expected to sound as if they were originally written in English, he argues, cultural difference is effaced and the translator's labour becomes invisible — with consequences for how translators are credited and paid, and for how readers imagine other cultures. Since a large share of the world's translations are made from English rather than into it, the norm also reinforces an imbalance in which English-language readers rarely encounter the foreign as foreign.",
      "Critics have raised several objections. The distinction between the two strategies, they note, is less clear-cut in practice than in theory: every translation domesticates in some respects and foreignises in others. Moreover, 'strangeness' does not automatically convey cultural difference; it may simply make a text harder to read, or create an exoticised image of the source culture. Some translators working from minority languages have also pointed out that, for communities whose literature is barely known in English, a fluent, accessible translation may do more to win readers than a deliberately estranging one.",
      "Still, the debate has had a lasting effect. Translators are more often named on covers, translators' notes are more common, and the question of what a translation should do — rather than whether it is simply 'faithful' — has become central to the field.",
    ],
    questions: [
      mcq("tl1", "rd:main-idea", 68, "What is the passage mainly about?", [
        "Venuti's critique of invisible, domesticating translation and the debate it provoked",
        "How to translate novels into English",
        "Schleiermacher's philosophy",
        "Why translators are poorly paid"], 0, "Expectation of invisibility → Venuti's framework → critique → objections → impact."),
      mcq("tl2", "rd:detail", 66, "According to the passage, what does a domesticating translation do?", [
        "Adapts the original to the norms of the target language and culture",
        "Keeps the foreign features of the original",
        "Translates word for word",
        "Adds notes explaining cultural references"], 0, "*Smooths away unfamiliar features… adapting… to the norms of the target language.*", [null, "That's foreignisation.", "Not stated.", "Notes are mentioned only in P5, unrelated to this definition."], [null, "reversed", "out-of-scope", "word-match"]),
      mcq("tl3", "rd:purpose", 70, "Why does the author mention reviewers' praise in paragraph 1?", [
        "To illustrate the widespread expectation that translations should be invisible",
        "To show that reviewers dislike translations",
        "To praise English-language novels",
        "To argue that reviewers are always right"], 0, "The compliment *reveals an expectation*."),
      mcq("tl4", "rd:inference", 74, "Why, according to Venuti's reasoning, does the dominance of domestication matter more in English-language publishing?", [
        "Because relatively few books are translated into English, so readers rarely meet foreign texts presented as foreign",
        "Because English is difficult to translate",
        "Because English readers prefer foreign novels",
        "Because translators into English are better paid"], 0, "*A large share of the world's translations are made from English rather than into it.*"),
      mcq("tl5", "rd:counter", 74, "Which objection to Venuti is mentioned?", [
        "Foreignising translations may simply be harder to read or exoticise the source culture.",
        "Schleiermacher never wrote about translation.",
        "Domestication is rare in English publishing.",
        "Translators should be invisible."], 0, "*Strangeness… may simply make a text harder to read, or create an exoticised image.*"),
      mcq("tl6", "rd:vocab", 72, "**Effaced** (paragraph 3) means…", ["erased", "emphasised", "translated", "criticised"], 0, "To efface = to erase or make invisible (cf. *invisible* in the same sentence)."),
      mcq("tl7", "rd:attitude", 72, "What is the author's view of the debate's impact?", ["It has had a lasting, positive influence on the field.", "It was a waste of time.", "It proved Venuti completely right.", "No view is expressed."], 0, "*Still, the debate has had a lasting effect* — with concrete changes listed.", [null, "Contradicts P5.", "Too extreme: the author presents objections fairly.", "P5 gives a view."], [null, "contradicts", "too-extreme", null]),
      tf("tl8", "rd:detail", 70, "Schleiermacher used the terms 'foreignisation' and 'domestication'.", "F", "Venuti *reformulated* Schleiermacher's options with these terms."),
    ],
    annotations: [
      { p: 0, q: "this expectation is neither natural nor neutral", type: "claim", note: "Venuti's thesis (reported)." },
      { p: 2, q: "he argues", type: "stance", note: "Attribution keeps the writer's distance." },
      { p: 3, q: "Critics have raised several objections.", type: "counter", note: "Counterarguments." },
      { p: 3, q: "may do more to win readers than a deliberately estranging one", type: "hedge", note: "Hedged objection." },
      { p: 4, q: "Still, the debate has had a lasting effect.", type: "stance", note: "Writer's evaluation after the objections." },
    ],
  },
  {
    id: "r-digital", title: "The Digital Language Divide", discipline: "technology", genre: "journalistic", lvl: 60,
    paragraphs: [
      "When you type a message on a smartphone, software quietly predicts your next word, corrects your spelling and, if you ask, translates your sentence into dozens of languages. For speakers of English, Spanish or Mandarin, these tools are so ordinary that they are barely noticed. For speakers of most of the world's roughly 7,000 languages, they simply do not exist.",
      "The reason is largely a matter of data. Modern language technologies learn from enormous collections of text and recorded speech. Languages with millions of speakers, a long written tradition and a strong online presence generate such data in abundance. Many Indigenous and minority languages, by contrast, are mainly spoken, have small communities of users, and may have several competing spelling systems — or none at all. The result is a feedback loop: because there is little digital content, there are few tools; and because there are few tools, using the language online is awkward, so little new content is produced.",
      "Some observers worry that this divide will accelerate language shift. If young people find that their phones, games and social networks work smoothly only in a dominant language, they may come to associate their heritage language with the past and the dominant one with modern life. Others are more optimistic, pointing to community projects that have built keyboards, dictionaries and even speech recognition for small languages, often with very modest resources.",
      "These projects raise questions that go beyond engineering. Who decides how a language should be spelled when a keyboard is designed? Who owns recordings and texts once they are used to train software? Increasingly, communities insist that technology for their languages should be developed with them rather than merely about them — a principle that may slow some projects down, but that is also more likely to produce tools people actually want to use.",
    ],
    questions: [
      mcq("dd1", "rd:main-idea", 58, "What is the main topic?", ["The lack of language technology for most languages, its causes and consequences", "How smartphones predict words", "Why Mandarin is popular", "How to design keyboards"], 0, "Gap → cause (data) → consequences → ethical questions."),
      mcq("dd2", "rd:detail", 58, "What is the 'feedback loop' described in paragraph 2?", [
        "Little digital content leads to few tools, which discourages producing new content",
        "More speakers create more dialects",
        "Tools create too much data",
        "Spelling systems change every year"], 0, "Stated at the end of P2."),
      mcq("dd3", "rd:inference", 62, "Why might young people associate their heritage language with the past?", [
        "Because modern technologies they use daily work smoothly only in dominant languages",
        "Because their parents forbid it",
        "Because heritage languages have no grammar",
        "Because schools teach only history in them"], 0, "Inference from P3's conditional."),
      mcq("dd4", "rd:purpose", 62, "Why does the author mention community projects in paragraph 3?", ["To present an optimistic counterpoint", "To prove the divide is closed", "To criticise communities", "To explain how keyboards work"], 0, "*Others are more optimistic, pointing to…*", [null, "Too extreme.", "Opposite.", "Out of scope."], [null, "too-extreme", "reversed", "out-of-scope"]),
      mcq("dd5", "rd:attitude", 64, "What does the author suggest about developing technology 'with' communities?", ["It may be slower but produce more useful tools.", "It is too slow to be worthwhile.", "It is only a political slogan.", "It guarantees language survival."], 0, "*May slow some projects down, but… more likely to produce tools people actually want to use.*"),
      tf("dd6", "rd:detail", 58, "Most of the world's languages lack basic digital tools such as predictive text.", "T", "*For speakers of most of the world's roughly 7,000 languages, they simply do not exist.*"),
    ],
    annotations: [
      { p: 1, q: "The reason is largely a matter of data.", type: "claim", note: "Causal claim with a hedge (*largely*)." },
      { p: 2, q: "Some observers worry", type: "counter", note: "Pessimistic view." },
      { p: 2, q: "Others are more optimistic", type: "counter", note: "Optimistic view." },
      { p: 3, q: "a principle that may slow some projects down, but that is also more likely to produce tools people actually want to use", type: "stance", note: "Writer's balanced evaluation." },
    ],
  },
];
