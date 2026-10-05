import type { ExamSpec } from "./types";
import type { ReadingSet, ListeningSet, SpeakingTask } from "../types";
import { mcq, gap, kwt } from "../helpers";
import { WRITING_TASKS } from "../writing";

const RS = (id: string, title: string, lvl: number, paragraphs: string[], questions: any[], discipline: any = "culture", genre: any = "journalistic"): ReadingSet => ({ id, title, discipline, genre, lvl, paragraphs, questions });
const g = (n: number) => `(${n}) ________`;
const LET = ["A", "B", "C", "D", "E", "F", "G", "H"];

// ------------------------------------------------------------ Part 1: Multiple-choice cloze
const p1 = RS("cae-p1", "The Rise of Citizen Science", 62, [
  `Citizen science, in which members of the public ${g(1)} part in scientific research, is far from new. Amateur naturalists have long ${g(2)} records of bird sightings and flowering dates, and some of these records now provide valuable evidence of environmental change. What is new is the scale. The ${g(3)} of smartphones and fast internet connections has ${g(4)} what such projects can achieve. Online platforms now ${g(5)} it possible for anyone with an internet connection to classify galaxies or transcribe historical weather logs.`,
  `Critics have ${g(6)} doubts about the quality of data gathered by non-specialists. Studies suggest, however, that with adequate training and careful project design, volunteers can perform ${g(7)} as well as professionals on many tasks, and the approach has ${g(8)} its value in fields ranging from astronomy to ecology.`,
], [
  mcq("c1-1", "uoe:mc-cloze", 56, "Gap 1", ["take", "make", "have", "do"], 0, "Fixed phrase: **take part in**.", undefined, undefined, { skill: "useOfEnglish" }),
  mcq("c1-2", "uoe:mc-cloze", 58, "Gap 2", ["kept", "held", "stored", "saved"], 0, "Collocation: **keep records**.", undefined, undefined, { skill: "useOfEnglish" }),
  mcq("c1-3", "uoe:mc-cloze", 64, "Gap 3", ["advent", "approach", "access", "onset"], 0, "**The advent of** = the arrival of (a technology, an era). *Onset* is for illnesses or difficult periods.", [null, "Not used for the arrival of technologies.", "*Access to* would need a different structure.", "*Onset* collocates with illness, winter, symptoms."], [null, "wrong-collocation", "grammar-ok-meaning-wrong", "wrong-collocation"], { skill: "useOfEnglish" }),
  mcq("c1-4", "uoe:mc-cloze", 60, "Gap 4", ["transformed", "converted", "translated", "transferred"], 0, "**Transform** = change completely (what projects can achieve).", undefined, undefined, { skill: "useOfEnglish" }),
  mcq("c1-5", "uoe:mc-cloze", 60, "Gap 5", ["make", "let", "allow", "enable"], 0, "Only **make** fits the pattern *___ it possible for someone to do something*.", [null, "*Let* takes a bare infinitive object pattern, not *it possible*.", "*Allow* would need *allow anyone to…*", "*Enable* would need *enable anyone to…*"], [null, "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong"], { skill: "useOfEnglish", tests: "grammar" }),
  mcq("c1-6", "uoe:mc-cloze", 56, "Gap 6", ["raised", "risen", "arisen", "lifted"], 0, "**Raise doubts** (transitive).", undefined, undefined, { skill: "useOfEnglish" }),
  mcq("c1-7", "uoe:mc-cloze", 62, "Gap 7", ["just", "even", "much", "far"], 0, "**Just as well as** = equally well.", undefined, undefined, { skill: "useOfEnglish" }),
  mcq("c1-8", "uoe:mc-cloze", 62, "Gap 8", ["proved", "tested", "tried", "checked"], 0, "**Prove its value / worth**.", undefined, undefined, { skill: "useOfEnglish" }),
], "science");

// ------------------------------------------------------------ Part 2: Open cloze
const p2 = RS("cae-p2", "Why We Forget", 64, [
  `Forgetting is often seen ${g(9)} a failure of memory, but ${g(10)} researchers argue that it serves an important purpose. If we remembered every detail of every day, we ${g(11)} struggle to make sense of new situations. ${g(12)} from being a flaw, forgetting allows us to focus on what matters, ${g(13)} than drowning in irrelevant detail.`,
  `Recent studies suggest that the brain actively weakens memories ${g(14)} are rarely used. This process may help us adapt ${g(15)} changing circumstances. ${g(16)} though forgetting can be frustrating, a memory that kept everything would probably serve us less well.`,
], [
  gap("c2-9", "uoe:open-cloze", 56, "Gap 9: seen ___ a failure", ["as"], "*be seen as*.", { skill: "useOfEnglish", prompt: "Write ONE word." }),
  gap("c2-10", "uoe:open-cloze", 58, "Gap 10: but ___ researchers argue", ["some", "many", "most", "other"], "A quantifier before *researchers*.", { skill: "useOfEnglish", prompt: "Write ONE word." }),
  gap("c2-11", "uoe:open-cloze", 56, "Gap 11: we ___ struggle", ["would"], "Second conditional result clause.", { skill: "useOfEnglish", prompt: "Write ONE word." }),
  gap("c2-12", "uoe:open-cloze", 62, "Gap 12: ___ from being a flaw", ["Far"], "**Far from** + -ing = not at all; on the contrary.", { skill: "useOfEnglish", prompt: "Write ONE word." }),
  gap("c2-13", "uoe:open-cloze", 60, "Gap 13: ___ than drowning", ["rather"], "**Rather than**.", { skill: "useOfEnglish", prompt: "Write ONE word." }),
  gap("c2-14", "uoe:open-cloze", 56, "Gap 14: memories ___ are rarely used", ["that", "which"], "Relative pronoun (defining).", { skill: "useOfEnglish", prompt: "Write ONE word." }),
  gap("c2-15", "uoe:open-cloze", 56, "Gap 15: adapt ___ changing circumstances", ["to"], "**Adapt to**.", { skill: "useOfEnglish", prompt: "Write ONE word." }),
  gap("c2-16", "uoe:open-cloze", 60, "Gap 16: ___ though forgetting can be frustrating", ["Even"], "**Even though**.", { skill: "useOfEnglish", prompt: "Write ONE word." }),
], "psychology", "expository");

// ------------------------------------------------------------ Part 3: Word formation
const p3 = RS("cae-p3", "The Science of Expertise", 64, [
  `Popular books have spread the ${g(17)} (BELIEVE) that 10,000 hours of practice is enough to make anyone an expert. Researchers, however, consider this figure ${g(18)} (LEAD). The original research showed considerable ${g(19)} (VARY) between individuals, and what mattered was not only the amount of practice but its nature.`,
  `So-called deliberate practice involves ${g(20)} (CONTINUE) feedback and requires learners to identify their ${g(21)} (WEAK). It is ${g(22)} (DOUBT) true that practice matters, but genetic and environmental factors also make a ${g(23)} (SIGNIFY) contribution. Expertise, in short, is the product of many ${g(24)} (INTERACT) influences.`,
], [
  gap("c3-17", "uoe:wordform", 56, "Gap 17 (BELIEVE)", ["belief"], "Noun after *the*: **belief**.", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
  gap("c3-18", "uoe:wordform", 60, "Gap 18 (LEAD)", ["misleading"], "Negative adjective: **misleading**.", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
  gap("c3-19", "uoe:wordform", 60, "Gap 19 (VARY)", ["variation", "variability"], "Noun: **variation / variability**.", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
  gap("c3-20", "uoe:wordform", 62, "Gap 20 (CONTINUE)", ["continuous", "continual"], "Adjective before *feedback*: **continuous** (uninterrupted) or **continual** (repeated).", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
  gap("c3-21", "uoe:wordform", 58, "Gap 21 (WEAK)", ["weaknesses"], "Plural noun after *their*: **weaknesses**.", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
  gap("c3-22", "uoe:wordform", 60, "Gap 22 (DOUBT)", ["undoubtedly"], "Adverb: **undoubtedly**.", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
  gap("c3-23", "uoe:wordform", 56, "Gap 23 (SIGNIFY)", ["significant"], "Adjective before *contribution*: **significant**.", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
  gap("c3-24", "uoe:wordform", 64, "Gap 24 (INTERACT)", ["interacting", "interactive", "interrelated"], "Participial adjective: **interacting** influences.", { skill: "useOfEnglish", prompt: "Form a word from the word in capitals." }),
], "psychology", "expository");

// ------------------------------------------------------------ Part 4: KWT
const p4 = [
  kwt("c4-25", "uoe:kwt", 62, "I'd prefer you not to mention this to anyone.", "RATHER", "I'd", "this to anyone.", ["rather you didn't mention", "rather you did not mention"], "*I'd rather you* + past simple (unreal present preference)."),
  kwt("c4-26", "uoe:kwt", 66, "They only realised the error after publication.", "UNTIL", "It was", "that they realised the error.", ["not until after publication", "not until after the publication", "not until the paper was published"], "*It was not until* + time + *that*.", { max: 6 }),
  kwt("c4-27", "uoe:kwt", 68, "The new evidence makes it unlikely that the theory is correct.", "LIKELIHOOD", "In the light of the new evidence,", "of the theory being correct.", ["there is little likelihood", "there's little likelihood", "there is not much likelihood"], "*There is little likelihood of* + NP + -ing."),
  kwt("c4-28", "uoe:kwt", 58, "The lecture was so boring that half the students fell asleep.", "SUCH", "It was", "half the students fell asleep.", ["such a boring lecture that"], "*Such a* + adj + noun + *that*."),
  kwt("c4-29", "uoe:kwt", 62, "Despite her lack of experience, she handled the interview well.", "FACT", "She handled the interview well,", "she lacked experience.", ["despite the fact that", "in spite of the fact that"], "*Despite / in spite of the fact that* + clause."),
  kwt("c4-30", "uoe:kwt", 64, "People think the fire was started deliberately.", "THOUGHT", "The fire", "started deliberately.", ["is thought to have been"], "Reporting passive + perfect passive infinitive."),
];

// ------------------------------------------------------------ Part 5: Long text, multiple choice
const p5 = RS("cae-p5", "Confessions of a Reluctant Polyglot", 68, [
  "I have been asked, more times than I can count, how many languages I speak. The honest answer — 'it depends what you mean by speak' — tends to disappoint people, who were hoping for a number. I can order dinner in seven languages, argue about politics in four, and dream in two. Whether that makes me a polyglot or merely a restless tourist is a question I have stopped trying to answer.",
  "My parents, who spoke different languages at home, never set out to raise a multilingual child; it simply happened, in the way that weather happens. I was well into my twenties before I realised that what I had taken for granted was, for many people, an achievement requiring years of effort. Even then, I felt faintly embarrassed by the compliments, as if I were being praised for my height.",
  "The languages I learned deliberately, as an adult, are a different matter. Each one cost me something: hours, pride, the occasional friendship strained by my insistence on practising. Japanese, in particular, humbled me. After three years of evening classes I could read a newspaper headline and understand perhaps one joke in ten. My teacher, a patient woman with an unnerving ability to detect when I had not done my homework, told me that this was entirely normal. I did not believe her then. I do now.",
  "What I have learned, if anything, is that fluency is not a destination but a moving target. A language I spoke comfortably at thirty has grown rusty at fifty; a language I once found impenetrable now feels like an old coat. The popular image of the polyglot — someone who 'has' twenty languages the way one might have twenty books on a shelf — misrepresents the experience entirely. Languages are less like possessions than like relationships: they need attention, they change, and they can drift away if neglected.",
  "None of this is meant to discourage anyone. On the contrary, I think the obsession with counting languages, or with reaching some imagined finish line, puts people off unnecessarily. The rewards begin long before fluency: the first time a stranger laughs at your joke in their language, or the first novel you read without a dictionary, is worth more than any certificate. If I could give my younger self one piece of advice, it would be to stop keeping score.",
], [
  mcq("c5-31", "rd:attitude", 66, "In the first paragraph, the writer suggests that people who ask how many languages he speaks…", ["want a simpler answer than he can honestly give", "are usually language learners themselves", "doubt that he is telling the truth", "are not really interested in the answer"], 0, "*Tends to disappoint people, who were hoping for a number.*", [null, "Not stated.", "No evidence.", "They are interested — they want a number."], [null, "out-of-scope", "over-inference", "contradicts"], { skill: "reading" }),
  mcq("c5-32", "rd:inference", 70, "What does the comparison with 'being praised for my height' imply?", ["He felt he did not deserve credit for something he had not worked for.", "He was proud of his languages.", "He was unusually tall.", "Compliments made him angry."], 0, "Height is not an achievement; neither was his childhood bilingualism.", undefined, undefined, { skill: "reading" }),
  mcq("c5-33", "rd:detail", 66, "What does the writer say about learning Japanese?", ["It made him realise how slow progress can be.", "His teacher was unfair to him.", "He gave up after three years.", "He could understand most jokes."], 0, "*Humbled me… perhaps one joke in ten.*", [null, "She was *patient*.", "Not stated.", "One in ten."], [null, "contradicts", "out-of-scope", "contradicts"], { skill: "reading" }),
  mcq("c5-34", "rd:inference", 70, "What does 'I did not believe her then. I do now.' suggest?", ["Experience has shown him that his teacher was right.", "He still thinks she was wrong.", "He no longer speaks Japanese.", "He believes teachers exaggerate."], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("c5-35", "rd:paraphrase", 72, "In the fourth paragraph, the writer compares languages to relationships in order to show that…", ["language ability requires ongoing maintenance and changes over time", "people should learn fewer languages", "languages are more important than possessions", "relationships are like learning languages"], 0, "*They need attention, they change, and they can drift away if neglected.*", [null, "Not his point.", "Word match.", "Reverses the comparison."], [null, "out-of-scope", "word-match", "reversed"], { skill: "reading" }),
  mcq("c5-36", "rd:purpose", 70, "What is the writer's main purpose in the final paragraph?", ["To encourage learners to value progress over counting achievements", "To discourage people from learning languages", "To recommend getting certificates", "To explain how he learned to read novels"], 0, "*None of this is meant to discourage… stop keeping score.*", undefined, undefined, { skill: "reading" }),
], "culture", "argumentative");

// ------------------------------------------------------------ Part 6: Cross-text multiple matching
const p6 = RS("cae-p6", "Should Universities Abolish the Lecture?", 70, [
  "**A** — The lecture remains one of the most efficient ways of introducing a large group of students to the core concepts of a field, and I see no realistic alternative for classes of three hundred. The claim that students cannot concentrate for more than fifteen minutes has been repeated so often that it is treated as fact, but the evidence for a fixed limit is weak. Recordings are useful for revision, though attendance tends to fall when they are available. As for 'active learning', I value it, but with very large groups it is often impractical.",
  "**B** — Defenders of the lecture point to its efficiency, but this efficiency is largely an illusion: transmitting information is cheap, but most of it is not retained. Attention research is clear that concentration declines markedly after the first quarter of an hour. If lectures are recorded, there is little reason for students to attend the live version at all, which suggests the format is redundant. Universities should replace lectures with structured active-learning sessions, not merely add a few activities to them.",
  "**C** — I have watched skilled lecturers hold a room for an hour, so I am sceptical of the idea that attention inevitably collapses after a few minutes; what declines is attention to poor lectures. Recorded lectures are a valuable resource for revision and for students with disabilities, but they work best as a supplement to live teaching rather than a replacement for it. Active learning has an important place, alongside lectures rather than instead of them.",
  "**D** — At its best, a lecture is a performance of thinking: students watch an expert reason in real time, hesitate, and change course. Talk of rapidly declining attention spans underestimates students, in my experience. I confess I dislike recorded lectures; something of the atmosphere of a live event is inevitably lost. The most effective courses I know combine lectures with active-learning tasks, each reinforcing the other.",
], [
  mcq("c6-37", "rd:attitude", 70, "Which writer has a different opinion from the others on whether students' attention inevitably declines during lectures?", ["A", "B", "C", "D"], 1, "B accepts a marked decline; A, C and D are sceptical of a fixed limit.", undefined, undefined, { skill: "reading" }),
  mcq("c6-38", "rd:attitude", 72, "Which writer shares A's view on the usefulness of lecture recordings?", ["B", "C", "D", "None of them"], 0 + 1, "A and C both see recordings as useful for revision (C: *a supplement… rather than a replacement*). B thinks they make lectures redundant; D dislikes them.", undefined, undefined, { skill: "reading" }),
  mcq("c6-39", "rd:attitude", 72, "Which writer takes a similar view to D on the relationship between lectures and active learning?", ["A", "B", "C", "None of them"], 2, "C and D both see active learning as complementing lectures. A thinks it is often impractical with large groups; B wants it to replace lectures.", undefined, undefined, { skill: "reading" }),
  mcq("c6-40", "rd:attitude", 72, "Which writer disagrees with B about the efficiency of lectures?", ["A", "C", "D", "None of them"], 0, "A calls lectures *one of the most efficient ways…*; B calls efficiency *largely an illusion*. C and D don't address efficiency.", undefined, undefined, { skill: "reading" }),
], "education", "argumentative");

// ------------------------------------------------------------ Part 7: Gapped text
const gapped = [
  "**A** They are equally important for conservation. Underwater mountains, known as seamounts, often host rich ecosystems, yet many of them have never been charted. Without knowing where they are, it is impossible to protect them.",
  "**B** Light, by contrast, travels well through the atmosphere, which is why aerial photography has become the standard method for mapping coastlines.",
  "**C** The reason is not lack of interest but physics. Radio waves and light, which allow satellites to photograph land in exquisite detail, cannot penetrate more than a short distance into seawater. Mapping the seabed therefore depends largely on sound.",
  "**D** This tension is unlikely to disappear. For now, most scientists argue that the benefits of mapping outweigh the risks, provided that the data are shared openly and that decisions about exploitation are made transparently.",
  "**E** The technique is precise, but painfully slow. A single vessel can survey only a narrow strip of ocean at a time, and the oceans cover roughly 70 per cent of the planet. At that rate, a complete survey by one ship would take centuries.",
  "**F** Their advantages are not only economic. Freed from the need to protect a crew, they can be deployed in rough seas or polar waters where conventional surveys would be too dangerous.",
  "**G** Such crowd-sourced data have obvious limitations. Commercial vessels tend to follow the same shipping lanes, leaving vast areas untouched, and the quality of their instruments varies considerably. Nevertheless, every additional line of soundings adds detail to the map.",
];
const p7 = RS("cae-p7", "Mapping the Last Frontier", 72, [
  "It is often said that we know more about the surface of Mars than about the floor of our own oceans. The claim is something of an exaggeration, but it contains a kernel of truth: until recently, only a small fraction of the seabed had been mapped in high resolution.",
  "**[ 41 ]**",
  "Ships equipped with multibeam echosounders send pulses of sound towards the seabed and measure how long the echoes take to return. Because the speed of sound in water is known, the delay reveals the depth.",
  "**[ 42 ]**",
  "This is why an international initiative launched in 2017 set out to coordinate existing efforts and fill the gaps by 2030. Rather than relying solely on dedicated survey ships, it encourages fishing boats, cargo vessels and even private yachts to share depth data collected on their routes.",
  "**[ 43 ]**",
  "Autonomous vehicles offer another solution. Uncrewed surface vessels, some powered by wind and solar energy, can operate for months without returning to port, steadily scanning remote regions that would be too expensive to reach with crewed ships.",
  "**[ 44 ]**",
  "Why does any of this matter? Detailed maps of the seabed are essential for predicting how tsunamis will travel, for laying undersea cables and for understanding ocean currents, which in turn shape the climate.",
  "**[ 45 ]**",
  "There is, however, a less comfortable side to the story. The same maps that guide conservation could also guide the mining industry, which is increasingly interested in the metal-rich nodules scattered across parts of the deep seabed.",
  "**[ 46 ]**",
  "———— Removed paragraphs (one is extra) ————",
  ...gapped,
], [41, 42, 43, 44, 45, 46].map((n, i) => mcq(`c7-${n}`, "rd:organization", 70 + (i % 3), `Which paragraph (A–G) fits gap ${n}?`, LET.slice(0, 7), [2, 4, 6, 5, 0, 3][i],
  ["C links *only a small fraction… mapped* to its cause (*The reason is…*) and introduces sound, which the next paragraph develops.",
   "E evaluates the echosounder technique (*precise, but painfully slow*), which explains *This is why an international initiative…*",
   "G (*Such crowd-sourced data*) refers back to data shared by fishing boats and yachts.",
   "F (*Their advantages are not only economic*) follows *too expensive to reach with crewed ships* and *Uncrewed* vessels.",
   "A (*They are equally important for conservation*) continues the list of reasons why maps matter; it also prepares *guide conservation* in the next paragraph.",
   "D (*This tension*) refers to the conflict between conservation and mining."][i] + " B is the extra paragraph: nothing in the text sets up its contrast.", undefined, undefined, { skill: "reading" })), "geology", "expository");

// ------------------------------------------------------------ Part 8: Multiple matching
const p8 = RS("cae-p8", "My First Year as a Doctoral Student", 68, [
  "**A — Lucía (linguistics)** Nobody warned me that ethics approval for fieldwork could take four months; I spent most of my first term waiting for paperwork rather than collecting data. My supervisor believes in giving students room to find their own path, which sounds wonderful but, at first, I found it frankly terrifying — I kept wishing someone would just tell me what to do. The isolation was the hardest part until I joined a weekly writing group with other doctoral students. Sitting in a room where everyone was struggling with the same blank page did more for my morale than any workshop.",
  "**B — Tom (chemistry)** My first six months were a catalogue of failed experiments. I assumed I was doing something wrong, until an older student explained that most experiments fail and that this is simply how research works. What I hadn't anticipated was how much time teaching would take: preparing and marking undergraduate lab sessions easily ate two days a week. On the positive side, I love the atmosphere of the lab. Working shoulder to shoulder with people from different countries, sharing equipment and ideas, is the part of the job I'd miss most.",
  "**C — Amara (history)** I went to the archives in Lisbon expecting to study trade records, but I came across a set of letters that nobody seemed to have read in a century, and my whole project changed direction. Reading seventeenth-century handwriting was a challenge in itself — I had to take a palaeography course in my second term. My advice to new students is unglamorous but important: keep a detailed log of every document you consult, with exact references. You will not remember where you saw that crucial sentence.",
  "**D — Kenji (economics)** Everyone in my cohort seemed to know more mathematics than I did, and for months I was convinced I'd been admitted by mistake. Weekly meetings with my supervisor gave my week a structure, which helped. The turning point was presenting a short paper at a conference in the spring: people took my work seriously, asked good questions, and for the first time I believed I belonged in the programme.",
], [
  ["mentions a change in the direction of their research?", 2],
  ["found having too much independence intimidating at first?", 0],
  ["refers to delays caused by administrative procedures?", 0],
  ["says that repeated setbacks are a normal part of research?", 1],
  ["compares themselves unfavourably with their peers?", 3],
  ["recommends a specific record-keeping habit?", 2],
  ["mentions an unexpected demand on their time?", 1],
  ["says that an early success increased their self-belief?", 3],
  ["benefited from a peer support group?", 0],
  ["most values working closely with others?", 1],
].map(([q, a], i) => mcq(`c8-${47 + i}`, "rd:detail", 64 + (i % 4) * 2, `Which person… ${q}`, ["A — Lucía", "B — Tom", "C — Amara", "D — Kenji"], a as number, "Find the paraphrase of the question in one section; check that the other sections do not also match.", undefined, undefined, { skill: "reading" })), "university", "journalistic");

// ------------------------------------------------------------ Listening
const L = (id: string, title: string, lvl: number, voices: ListeningSet["voices"], lines: [number, string][], questions: any[], type: ListeningSet["type"] = "conversation"): ListeningSet =>
  ({ id, title, type, discipline: "culture", lvl, voices, lines: lines.map(([v, t]) => ({ v, t })), questions });

const lp1 = [
  L("cl1-1", "Extract 1: Urban birds documentary", 62, [{ name: "Woman", accent: "en-GB", gender: "f" }, { name: "Man", accent: "en-GB", gender: "m" }], [
    [0, "Did you see that documentary on city birds last night?"],
    [1, "I did. I have to say I expected it to be a bit lightweight — you know, cute pigeons — but the section on how blackbirds in cities sing at a higher pitch to be heard over traffic was genuinely fascinating."],
    [0, "It was. Though I thought they skated over the question of whether that actually affects breeding success. They just implied it did."],
    [1, "True. A bit of a leap, given what they'd shown."],
  ], [
    mcq("cl1q1", "ls:attitude", 62, "What was the man's initial expectation of the documentary?", ["That it would be superficial", "That it would be too technical", "That it would focus on pigeons only", "That it would be about traffic"], 0, "*I expected it to be a bit lightweight.*", undefined, undefined, { skill: "listening" }),
    mcq("cl1q2", "ls:inference", 66, "What do both speakers criticise?", ["An unsupported claim about breeding success", "The quality of the filming", "The choice of birds", "The length of the programme"], 0, "*They just implied it did… A bit of a leap.*", undefined, undefined, { skill: "listening" }),
  ]),
  L("cl1-2", "Extract 2: Conference feedback", 64, [{ name: "Man", accent: "en-US", gender: "m" }, { name: "Woman", accent: "en-US", gender: "f" }], [
    [0, "So, how did your talk go in the end?"],
    [1, "Better than I feared. The room was half empty because it clashed with the keynote, which was disappointing, but the people who came were exactly the ones I wanted to reach. One of them has already emailed about a possible collaboration."],
    [0, "That's great. Would you go again next year?"],
    [1, "Probably, though I'd ask the organisers not to put me against a keynote again."],
  ], [
    mcq("cl2q1", "ls:attitude", 62, "How does the woman feel about the audience at her talk?", ["Pleased with its quality despite its size", "Disappointed with everyone who came", "Surprised that it was so large", "Annoyed that the keynote speaker attended"], 0, "", undefined, undefined, { skill: "listening" }),
    mcq("cl2q2", "ls:detail", 62, "What would she do differently next year?", ["Ask for a different time slot", "Give a keynote", "Not attend", "Email more people beforehand"], 0, "", undefined, undefined, { skill: "listening" }),
  ]),
  L("cl1-3", "Extract 3: Author interview", 66, [{ name: "Interviewer", accent: "en-AU", gender: "f" }, { name: "Author", accent: "en-IE", gender: "m" }], [
    [0, "Your new novel is set entirely in a single afternoon. Was that a deliberate constraint?"],
    [1, "It started as an accident, really. I'd written three hundred pages covering ten years and none of it was alive. Then I noticed that the only chapter I liked took place over a few hours, so I threw the rest away and started again. Painful, but it was the right decision."],
  ], [
    mcq("cl3q1", "ls:detail", 64, "Why did the author decide to set the novel in a single afternoon?", ["The only part of his draft that worked covered a short period.", "His publisher asked him to.", "He wanted a challenge from the start.", "He had very little time to write."], 0, "", [null, null, "He says *it started as an accident*.", null], [null, null, "contradicts", null], { skill: "listening" }),
    mcq("cl3q2", "ls:attitude", 66, "How does he now feel about discarding most of his draft?", ["It was difficult but correct.", "He regrets it.", "It was easy.", "He is still unsure."], 0, "*Painful, but it was the right decision.*", undefined, undefined, { skill: "listening" }),
  ]),
];

const lp2 = [L("cl2", "Part 2: A seagrass researcher", 66, [{ name: "Speaker", accent: "en-GB", gender: "f" }], [
  [0, "Hello, everyone. I'm going to talk about seagrass, which is probably the least glamorous habitat in the ocean — and one of the most important. I first became interested in it during a summer job counting fish in a bay in western Scotland. I expected the fish to be the exciting part; instead, I kept noticing the meadows they were hiding in."],
  [0, "Seagrasses are flowering plants, not seaweeds, which surprises a lot of people. They grow in shallow coastal waters and form dense meadows that act as nurseries for young fish. They also trap sediment, which keeps the water clear, and they store carbon in the seabed beneath them, sometimes for centuries."],
  [0, "Unfortunately, seagrass has declined in many places, mainly because of pollution from farmland, coastal development and damage from boat anchors. In our project, we've been testing a restoration method using hessian bags filled with seeds — the bags are biodegradable, so they simply rot away once the plants are established."],
  [0, "The biggest challenge so far has not been technical but social. We need local boat owners to agree to use moorings that don't drag across the seabed. Once people actually see a restored meadow, though, they tend to become our strongest supporters."],
], [
  ["She first became interested in seagrass during a ___ in Scotland.", ["summer job"]],
  ["She was surprised to notice the ___ rather than the fish.", ["meadows"]],
  ["Seagrasses are flowering plants rather than ___.", ["seaweeds", "seaweed"]],
  ["Seagrass meadows act as ___ for young fish.", ["nurseries", "nursery"]],
  ["By trapping ___, seagrass keeps water clear.", ["sediment"]],
  ["One cause of decline is pollution from ___.", ["farmland"]],
  ["The project plants seeds in bags made of ___.", ["hessian"]],
  ["The main challenge has been ___ rather than technical.", ["social"]],
].map(([q, a], i) => gap(`cl2s${i + 1}`, "ls:detail", 62 + (i % 3) * 2, q as string, a as string[], "Sentence completion: the missing word(s) are heard in the recording; spelling must be correct.", { skill: "listening", prompt: "Complete the sentence with a word or short phrase you hear." })), "lecture")];

const lp3 = [L("cl3", "Part 3: Interview with a literary translator", 70, [{ name: "Host", accent: "en-US", gender: "m" }, { name: "Elena", accent: "en-GB", gender: "f" }], [
  [0, "My guest today is Elena Marsh, who translates fiction from Spanish and Portuguese. Elena, how did you get into translation?"],
  [1, "Rather by the back door. I was working in publishing, reading foreign novels to write reports for editors, and I kept thinking, 'Someone should translate this.' Eventually an editor said, 'Why don't you?' I suspect she was mainly trying to stop me complaining."],
  [0, "People often say a good translation should read as if it were written in English. Do you agree?"],
  [1, "Up to a point. I want readers to forget they're reading a translation, but not to forget they're reading about another place. If a character eats a particular dish, I don't replace it with shepherd's pie."],
  [0, "What's the hardest thing to translate?"],
  [1, "Humour, without a doubt. Puns are the obvious problem, but even more difficult is tone — the particular dry, understated way a narrator jokes. You can translate every word correctly and still kill the joke."],
  [0, "How closely do you work with authors?"],
  [1, "It varies enormously. Some authors want to see every page; others say, 'It's your book now.' I prefer something in between: I send a list of questions, and we discuss the ones that really matter. Most authors are generous — though one did once insist that I had misunderstood his own novel."],
  [0, "And did you?"],
  [1, "No. But I changed the passage anyway. It's his name on the cover."],
  [0, "Finally, what advice would you give to someone starting out?"],
  [1, "Read widely in your own language, not just the one you translate from. Your English is your instrument. Most beginners worry about understanding the source text, but the real test is writing well in the target language."],
], [
  mcq("cl3-1", "ls:inference", 68, "How does Elena suggest she became a translator?", ["Partly by chance, after an editor's suggestion", "Through a formal training course", "Because she was bored in publishing", "Because an author asked her to"], 0, "*Rather by the back door… an editor said, 'Why don't you?'*", undefined, undefined, { skill: "listening" }),
  mcq("cl3-2", "ls:attitude", 70, "What is Elena's view on translations that read 'as if written in English'?", ["She partly agrees but wants to keep the sense of another culture.", "She completely agrees.", "She completely disagrees.", "She thinks it is irrelevant."], 0, "*Up to a point… but not to forget they're reading about another place.*", [null, "*Up to a point* limits agreement.", "She partly agrees.", null], [null, "too-extreme", "too-extreme", null], { skill: "listening" }),
  mcq("cl3-3", "ls:detail", 68, "What does she find most difficult to translate?", ["The tone of humour", "Puns", "Food names", "Dialogue"], 0, "*Even more difficult is tone.*", [null, "Mentioned as *the obvious problem*, but tone is harder.", null, null], [null, "partial", null, null], { skill: "listening" }),
  mcq("cl3-4", "ls:detail", 68, "How does she prefer to work with authors?", ["Discussing a selected list of important questions", "Showing them every page", "Working without consulting them", "Meeting them in person"], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("cl3-5", "ls:inference", 72, "Why did she change the passage the author objected to?", ["She accepted that the author has the final say over his book.", "She realised she had misunderstood it.", "Her editor insisted.", "The author offered to pay her."], 0, "*No. But I changed the passage anyway. It's his name on the cover.*", [null, "She says she had *not* misunderstood.", null, null], [null, "contradicts", null, null], { skill: "listening" }),
  mcq("cl3-6", "ls:detail", 70, "What is her main advice to beginners?", ["Develop their writing in their own language", "Live abroad", "Translate humour first", "Specialise in one author"], 0, "", undefined, undefined, { skill: "listening" }),
], "interview")];

const t1 = ["to meet new people", "to recover from an injury", "to save money", "to escape from work pressure", "because a family member encouraged them", "to prove someone wrong", "to learn a practical skill", "by accident"];
const t2 = ["better concentration", "a new career", "more patience", "unexpected friendships", "a healthier diet", "more confidence in public", "a sense of achievement", "a better memory"];
const lp4 = [L("cl4", "Part 4: Five people talk about a hobby they took up as adults", 70, [
  { name: "Speaker 1", accent: "en-US", gender: "f" }, { name: "Speaker 2", accent: "en-GB", gender: "m" }, { name: "Speaker 3", accent: "en-AU", gender: "f" }, { name: "Speaker 4", accent: "en-IE", gender: "m" }, { name: "Speaker 5", accent: "en-IN", gender: "f" }], [
  [0, "Speaker one. My sister had been nagging me for years to join her pottery class, and eventually I gave in just to keep her quiet. I'm terribly impatient by nature, and clay simply doesn't allow that — if you rush, it collapses. I'd say I've become a calmer, more patient person, which my colleagues have noticed."],
  [1, "Speaker two. I'd been signed off work with a back problem, and the physiotherapist suggested swimming. I hated it at first — the cold, the chlorine. But after a few months, the pain had gone, and what surprised me was the people. There's a group of us who swim at seven every morning and then have breakfast together. They're some of my closest friends now."],
  [2, "Speaker three. Honestly, I started choir because my job was so stressful that I needed something completely unrelated to it. I didn't expect to have to sing a solo within a month! I was terrified, but I did it, and since then I've found presenting at work much less frightening."],
  [3, "Speaker four. A friend told me I'd never stick with anything practical, so I signed up for a carpentry course mainly out of stubbornness. Two years later I've built half the furniture in my flat. More than anything, I get a real sense of satisfaction from looking at something solid and thinking, 'I made that.'"],
  [4, "Speaker five. I wandered into a chess club by mistake — I was looking for a yoga class in the same building. They were short of players and asked me to stay. What I've gained most is the ability to focus on one thing for a long time; my phone stays in my bag for three hours, which is a small miracle."],
], [
  ...[4, 1, 3, 5, 7].map((a, i) => mcq(`cl4a${i + 1}`, "ls:purpose", 68, `TASK ONE — Speaker ${i + 1}: why did they take up the hobby?`, t1.map((x, k) => `${LET[k]} ${x}`), a, "Listen for the reason, not for words that echo the options: several speakers mention work, pain or other people.", undefined, undefined, { skill: "listening" })),
  ...[2, 3, 5, 6, 0].map((a, i) => mcq(`cl4b${i + 1}`, "ls:detail", 70, `TASK TWO — Speaker ${i + 1}: what have they gained?`, t2.map((x, k) => `${LET[k]} ${x}`), a, "Identify the main benefit the speaker emphasises.", undefined, undefined, { skill: "listening" })),
].map((q) => q), "discussion")];

// ------------------------------------------------------------ Speaking
const sp: SpeakingTask[] = [
  { id: "cs-1", type: "exam", exam: "cae", title: "Part 1 — Interview", prompt: "What do you enjoy most about the place where you live? (Answer briefly, about 20–30 seconds.)", prepSec: 0, speakSec: 30, lvl: 56, checklist: ["Natural, extended answer", "Some range of vocabulary"] },
  { id: "cs-2", type: "exam", exam: "cae", title: "Part 1 — Interview", prompt: "If you could learn a completely new skill, what would it be and why?", prepSec: 0, speakSec: 30, lvl: 58, checklist: ["Hypothetical structures used", "Reason given"] },
  { id: "cs-3", type: "exam", exam: "cae", title: "Part 2 — Long turn (adapted)", context: "Imagine two pictures: (A) a group of students studying together in a library late at night; (B) a person studying alone at home with headphones on.", prompt: "Compare the two situations. Why might the people have chosen to study in these ways, and how productive might they be?", prepSec: 10, speakSec: 60, lvl: 64, checklist: ["Compared rather than described", "Speculated (might/could/seems)", "Addressed both questions"] },
  { id: "cs-4", type: "exam", exam: "cae", title: "Part 3 — Collaborative task (solo adaptation)", context: "In the exam you discuss with a partner. Here, talk through the options as if discussing them, weighing each one.", prompt: "**How might universities help students cope with stress?**\n- longer deadlines\n- free counselling\n- sports facilities\n- smaller classes\n- mentoring by older students\n\nTalk about how effective each might be, then decide which TWO would make the biggest difference.", prepSec: 15, speakSec: 120, lvl: 66, checklist: ["Discussed several options", "Compared and evaluated them", "Reached a decision with reasons", "Used language of agreement/negotiation"] },
  { id: "cs-5", type: "exam", exam: "cae", title: "Part 4 — Discussion", prompt: "Some people say that pressure helps students achieve more. To what extent do you agree?", prepSec: 0, speakSec: 60, lvl: 68, checklist: ["Nuanced opinion", "Examples", "Discourse markers"] },
];

export const CAE: ExamSpec = {
  id: "cae", name: "Cambridge C1 Advanced (CAE)", short: "C1 Advanced",
  desc: "Reading & Use of English (8 partes, 90 min), Writing (2 partes, 90 min), Listening (4 partes, ~40 min, cada parte se escucha dos veces), Speaking (4 partes, ~15 min).",
  scale: "Cambridge English Scale 160–210. C1: 180–199 (Grado B 193–199, Grado C 180–192); Grado A 200–210 (C2).",
  formatNote: "Formato basado en la descripción pública de Cambridge English. Material original. El Speaking se adapta para practicar en solitario (las partes con fotos y con compañero se describen en texto). La conversión a la escala de Cambridge es aproximada.",
  sections: [
    {
      id: "rue", name: "Reading & Use of English", minutes: 90, kind: "receptive", parts: [
        { id: "p1", name: "Part 1 — Multiple-choice cloze", instructions: "For questions 1–8, choose the word which best fits each gap.", kind: "reading", reading: p1, marks: 1, group: "uoe" },
        { id: "p2", name: "Part 2 — Open cloze", instructions: "For questions 9–16, write ONE word in each gap.", kind: "reading", reading: p2, marks: 1, group: "uoe" },
        { id: "p3", name: "Part 3 — Word formation", instructions: "For questions 17–24, use the word in capitals to form a word that fits the gap.", kind: "reading", reading: p3, marks: 1, group: "uoe" },
        { id: "p4", name: "Part 4 — Key word transformations", instructions: "For questions 25–30, use between three and six words, including the word given. Do not change the word given.", kind: "items", items: p4, marks: 2, group: "uoe" },
        { id: "p5", name: "Part 5 — Multiple choice", instructions: "For questions 31–36, choose the answer which you think fits best according to the text.", kind: "reading", reading: p5, marks: 2, group: "reading" },
        { id: "p6", name: "Part 6 — Cross-text multiple matching", instructions: "Read four extracts. For questions 37–40, choose from the writers A–D.", kind: "reading", reading: p6, marks: 2, group: "reading" },
        { id: "p7", name: "Part 7 — Gapped text", instructions: "Six paragraphs have been removed. Choose from A–G the one which fits each gap. There is one extra paragraph.", kind: "reading", reading: p7, marks: 2, group: "reading" },
        { id: "p8", name: "Part 8 — Multiple matching", instructions: "For questions 47–56, choose from the sections A–D.", kind: "reading", reading: p8, marks: 1, group: "reading" },
      ],
    },
    {
      id: "writing", name: "Writing", minutes: 90, kind: "writing", parts: [
        { id: "w1", name: "Part 1 — Essay (compulsory)", instructions: "220–260 words.", kind: "writing", writing: WRITING_TASKS.find((t) => t.id === "w-cae-essay")! },
        { id: "w2", name: "Part 2 — Choose one task", instructions: "220–260 words.", kind: "choice-writing", writingOptions: [WRITING_TASKS.find((t) => t.id === "w-cae-proposal")!, WRITING_TASKS.find((t) => t.id === "w-cae-review")!] },
      ],
    },
    {
      id: "listening", name: "Listening", minutes: 40, kind: "receptive", parts: [
        { id: "l1", name: "Part 1 — Three short extracts", instructions: "Choose the best answer. You will hear each extract twice.", kind: "listening", listening: lp1, plays: 2, marks: 1, group: "listening" },
        { id: "l2", name: "Part 2 — Sentence completion", instructions: "Complete the sentences. You will hear the recording twice.", kind: "listening", listening: lp2, plays: 2, marks: 1, group: "listening" },
        { id: "l3", name: "Part 3 — Interview", instructions: "Choose the best answer. You will hear the recording twice.", kind: "listening", listening: lp3, plays: 2, marks: 1, group: "listening" },
        { id: "l4", name: "Part 4 — Multiple matching", instructions: "Two tasks. You will hear the recording twice.", kind: "listening", listening: lp4, plays: 2, marks: 1, group: "listening" },
      ],
    },
    { id: "speaking", name: "Speaking", minutes: 15, kind: "speaking", parts: [{ id: "s", name: "Parts 1–4", instructions: "Answer each task in the time given.", kind: "speaking", speaking: sp }] },
  ],
};
