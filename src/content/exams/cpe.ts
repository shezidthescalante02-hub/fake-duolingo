import type { ExamSpec } from "./types";
import type { ReadingSet, ListeningSet, SpeakingTask } from "../types";
import { mcq, gap, kwt } from "../helpers";
import { WRITING_TASKS } from "../writing";

const RS = (id: string, title: string, lvl: number, paragraphs: string[], questions: any[], discipline: any = "culture", genre: any = "journalistic"): ReadingSet => ({ id, title, discipline, genre, lvl, paragraphs, questions });
const g = (n: number) => `(${n}) ________`;
const LET = ["A", "B", "C", "D", "E", "F", "G", "H"];
const U = { skill: "useOfEnglish" as const };

// ------------------------------------------------------------ Part 1
const p1 = RS("cpe-p1", "The Allure of Ruins", 74, [
  `Few sights ${g(1)} the imagination quite like a ruin. Half-collapsed walls and roofless halls ${g(2)} at stories they never fully tell, inviting visitors to fill in what time has erased. In the eighteenth century, wealthy landowners went so far as to ${g(3)} artificial ruins on their estates, a practice that modern visitors tend to ${g(4)} as mere eccentricity.`,
  `Yet the fascination is not hard to understand. Ruins remind us that even the most ${g(5)} empires eventually crumble, and that the past continues to ${g(6)} the present. ${g(7)} to say, they are also big business: heritage sites now ${g(8)} millions of visitors a year, with all the problems of conservation that such numbers bring.`,
], [
  mcq("p1-1", "uoe:mc-cloze", 70, "Gap 1", ["capture", "seize", "clasp", "clutch"], 0, "**Capture the imagination** is the fixed collocation.", undefined, undefined, U),
  mcq("p1-2", "uoe:mc-cloze", 72, "Gap 2", ["hint", "imply", "suggest", "indicate"], 0, "Only **hint** takes *at*: *hint at a story*.", [null, "Transitive: *imply a story* (no *at*).", "Transitive.", "Transitive."], [null, "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong"], { ...U, tests: "grammar" }),
  mcq("p1-3", "uoe:mc-cloze", 74, "Gap 3", ["erect", "elevate", "hoist", "heighten"], 0, "**Erect** a building/structure.", undefined, undefined, U),
  mcq("p1-4", "uoe:mc-cloze", 74, "Gap 4", ["dismiss", "discard", "disregard", "dispose"], 0, "**Dismiss X as Y** — the only option that takes *as*.", [null, "*Discard* = throw away; no *as*.", "*Disregard* doesn't take *as*.", "*Dispose of*."], [null, "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong", "meaning-ok-grammar-wrong"], { ...U, tests: "grammar" }),
  mcq("p1-5", "uoe:mc-cloze", 70, "Gap 5", ["mighty", "heavy", "hefty", "bulky"], 0, "**Mighty empires** — power, not physical weight.", undefined, undefined, U),
  mcq("p1-6", "uoe:mc-cloze", 74, "Gap 6", ["haunt", "pursue", "chase", "track"], 0, "**The past haunts the present** — persists in a troubling way.", undefined, undefined, U),
  mcq("p1-7", "uoe:mc-cloze", 70, "Gap 7", ["Needless", "Useless", "Pointless", "Aimless"], 0, "Fixed phrase: **Needless to say**.", undefined, undefined, U),
  mcq("p1-8", "uoe:mc-cloze", 70, "Gap 8", ["draw", "pull", "tow", "drag"], 0, "**Draw visitors / crowds**.", undefined, undefined, U),
], "history");

// ------------------------------------------------------------ Part 2
const p2 = RS("cpe-p2", "Why We Put Things Off", 74, [
  `Procrastination is often dismissed ${g(9)} mere laziness, but psychologists have come ${g(10)} see it as a problem of emotion regulation. We put off tasks not because we are idle ${g(11)} because they make us anxious or bored. ${g(12)} more we delay, the worse we feel, and the more tempting further delay becomes — a cycle that is notoriously difficult to break ${g(13)} of.`,
  `Paradoxically, people who are hard ${g(14)} themselves after procrastinating tend to procrastinate more, ${g(15)} than less. Self-compassion, it turns out, may be ${g(16)} far more effective remedy than self-criticism.`,
], [
  ["Gap 9", ["as"], "*be dismissed as*."], ["Gap 10", ["to"], "*come to* + infinitive = gradually begin to."], ["Gap 11", ["but"], "*not because… but because…*"], ["Gap 12", ["The"], "*The more…, the worse…*"],
  ["Gap 13", ["out"], "*break out of a cycle*."], ["Gap 14", ["on"], "*be hard on oneself*."], ["Gap 15", ["rather"], "*rather than*."], ["Gap 16", ["a"], "*a far more effective remedy*."],
].map(([q, a, e], i) => gap(`p2-${9 + i}`, "uoe:open-cloze", 68 + (i % 4) * 2, q as string, a as string[], e as string, { ...U, prompt: "Write ONE word." })), "psychology", "expository");

// ------------------------------------------------------------ Part 3
const p3 = RS("cpe-p3", "The Paradox of Choice", 76, [
  `It seems self-evident that more choice is better. Yet some psychologists have argued that an ${g(17)} (ABUNDANT) of options can lead to ${g(18)} (SATISFY): faced with too many alternatives, consumers become ${g(19)} (DECIDE) and are ${g(20)} (CONSTANT) haunted by the options they rejected.`,
  `This ${g(21)} (APPEAR) contradiction has been ${g(22)} (WIDE) discussed, though some ${g(23)} (REPLICATE) attempts have failed, suggesting that the effect is less ${g(24)} (UNIVERSE) than was once claimed.`,
], [
  ["Gap 17 (ABUNDANT)", ["abundance"]], ["Gap 18 (SATISFY)", ["dissatisfaction"]], ["Gap 19 (DECIDE)", ["indecisive"]], ["Gap 20 (CONSTANT)", ["constantly"]],
  ["Gap 21 (APPEAR)", ["apparent"]], ["Gap 22 (WIDE)", ["widely"]], ["Gap 23 (REPLICATE)", ["replication"]], ["Gap 24 (UNIVERSE)", ["universal"]],
].map(([q, a], i) => gap(`p3-${17 + i}`, "uoe:wordform", 68 + (i % 4) * 2, q as string, a as string[], "Identify the word class required by the syntax, then any prefix required by the meaning.", { ...U, prompt: "Form a word from the word in capitals." })), "psychology", "expository");

// ------------------------------------------------------------ Part 4
const p4 = [
  kwt("p4-25", "uoe:kwt", 70, "It's pointless to argue with him.", "POINT", "There", "with him.", ["is no point arguing", "is no point in arguing", "'s no point arguing", "'s no point in arguing"], "*There's no point (in)* + -ing.", { max: 8 }),
  kwt("p4-26", "uoe:kwt", 72, "She was on the point of leaving when the phone rang.", "VERGE", "She was", "when the phone rang.", ["on the verge of leaving"], "*On the verge of* + -ing.", { max: 8 }),
  kwt("p4-27", "uoe:kwt", 74, "The success of the project depends entirely on funding.", "HINGES", "Whether the project succeeds", "funding.", ["hinges entirely on", "hinges entirely upon"], "*Hinge on* = depend crucially on.", { max: 8 }),
  kwt("p4-28", "uoe:kwt", 68, "I didn't expect the exam to be so difficult.", "MUCH", "The exam was", "I had expected.", ["much more difficult than", "much harder than", "much tougher than"], "*much* + comparative + *than*.", { max: 8 }),
  kwt("p4-29", "uoe:kwt", 78, "His arrogance made him unpopular with his colleagues.", "ENDEAR", "His arrogance did", "his colleagues.", ["nothing to endear him to", "little to endear him to"], "*Do nothing / little to endear someone to someone*.", { max: 8 }),
  kwt("p4-30", "uoe:kwt", 72, "Nobody could have predicted the outcome.", "FORESEEN", "The outcome", "by anyone.", ["could not have been foreseen", "couldn't have been foreseen"], "Passive modal perfect.", { max: 8 }),
];

// ------------------------------------------------------------ Part 5
const p5 = RS("cpe-p5", "On Being Wrong", 78, [
  "For most of my working life I assumed that being wrong was an occasional accident, like missing a train — inconvenient, mildly embarrassing, and best forgotten. It took me an unreasonably long time to notice that the experience of being wrong is, in a curious sense, indistinguishable from the experience of being right. Until the moment of discovery, error feels exactly like truth. That is precisely what makes it so dangerous.",
  "I came to this realisation not through philosophy but through a manuscript. I had spent two years editing the letters of a minor Victorian poet, and I was quite certain that a particular undated letter belonged to the spring of 1862. Every detail seemed to confirm it. When a colleague pointed out, almost apologetically, that the watermark on the paper had not been manufactured until 1867, my first reaction was not gratitude but a kind of indignation, as though the paper itself had behaved badly.",
  "What struck me afterwards was not the mistake — scholars make them constantly — but how thoroughly my certainty had shaped what I saw. Details that fitted my date had seemed significant; those that did not had seemed trivial and were quietly set aside. I had not been careless. I had been diligent in the service of a conclusion I had already reached.",
  "There is a tendency, in academic life especially, to treat admitting error as a kind of defeat. Reviewers who spot a flaw are thanked in print through gritted teeth; scholars who change their minds are said to have 'abandoned' positions, as if they had deserted a post under fire. I have come to think this gets things precisely backwards. The capacity to be persuaded by evidence is not a weakness of a scholarly mind but its defining strength.",
  "None of this makes being wrong pleasant. I still feel the small, hot flush of embarrassment when a student catches a slip in a lecture. But I have learned to treat that sensation less as a wound than as a signal — the feeling, so to speak, of the ground shifting slightly beneath one's assumptions. It is uncomfortable. It is also the only way I know of standing somewhere new.",
], [
  mcq("p5-31", "rd:inference", 76, "In the first paragraph, the writer suggests that error is dangerous because…", ["it cannot be recognised from the inside until it is discovered", "it is always embarrassing", "it is rare and therefore unexpected", "it is easily forgotten"], 0, "*Until the moment of discovery, error feels exactly like truth.*", [null, "Mentioned, but not why it is dangerous.", "Contradicts his conclusion.", "Not the reason."], [null, "wrong-focus", "contradicts", "word-match"], { skill: "reading" }),
  mcq("p5-32", "rd:attitude", 78, "How did the writer initially react to his colleague's discovery?", ["With irrational resentment", "With immediate gratitude", "With amusement", "With professional calm"], 0, "*Not gratitude but a kind of indignation, as though the paper itself had behaved badly.*", undefined, undefined, { skill: "reading" }),
  mcq("p5-33", "rd:paraphrase", 80, "What does the writer mean by 'diligent in the service of a conclusion I had already reached'?", ["He worked carefully, but only to confirm what he already believed.", "He was careless with evidence.", "He reached his conclusion too slowly.", "He was proud of his hard work."], 0, "Confirmation bias: diligence directed at confirming a prior belief.", [null, "*I had not been careless*.", null, null], [null, "contradicts", null, null], { skill: "reading" }),
  mcq("p5-34", "rd:attitude", 80, "In the fourth paragraph, the writer criticises academic culture for…", ["framing changes of mind as failures", "ignoring reviewers", "making too many errors", "valuing evidence too highly"], 0, "*Treat admitting error as a kind of defeat… gets things precisely backwards.*", undefined, undefined, { skill: "reading" }),
  mcq("p5-35", "rd:vocab", 78, "The phrase 'through gritted teeth' suggests that the thanks are…", ["given reluctantly", "given enthusiastically", "given in private", "never given"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("p5-36", "rd:conclusion", 80, "What does the final paragraph reveal about the writer's current attitude?", ["He accepts the discomfort of error as necessary for progress.", "He no longer feels embarrassed by mistakes.", "He avoids lecturing to prevent errors.", "He believes errors should be hidden."], 0, "*Uncomfortable… also the only way I know of standing somewhere new.*", [null, "*I still feel the small, hot flush of embarrassment*.", null, null], [null, "contradicts", null, null], { skill: "reading" }),
], "humanities", "argumentative");

// ------------------------------------------------------------ Part 6 (gapped text, 7 gaps, 8 paragraphs)
const removed = [
  "**A** The switch to LED lighting complicates the picture. LEDs are far more energy-efficient, but many early models emitted a bluish light that scatters more readily in the atmosphere and may disturb wildlife more than older sodium lamps.",
  "**B** Some astronomers have responded by moving their telescopes into space, where the atmosphere poses no obstacle at all.",
  "**C** Their concerns were initially dismissed as the special pleading of a small profession. Who, after all, needed to see faint galaxies in order to live a good life?",
  "**D** To lose it would be to lose a connection with almost every generation that came before us. To regain it, in many places, would require little more than turning off lights nobody is using.",
  "**E** The culprit is artificial light — not in itself, but light in the wrong place. Streetlamps, illuminated billboards and floodlit buildings scatter light upwards, where it is reflected by particles in the atmosphere and forms the orange glow that hangs over cities.",
  "**F** Against this background, a small but growing movement has begun to treat darkness as something worth protecting. Some towns have designated themselves 'dark-sky communities', committing to shielded lighting that directs light downwards.",
  "**G** Nor are they alone. Newly hatched sea turtles, which instinctively crawl towards the brightest horizon — historically, moonlight over the sea — may head inland towards roads instead.",
  "**H** There are, inevitably, objections. Residents worry about safety, and the evidence on whether lighting reduces crime is surprisingly mixed.",
];
const p6 = RS("cpe-p6", "The Return of the Night Sky", 78, [
  "For most of human history, the night sky was a shared inheritance, as visible to a shepherd as to an emperor. Today, by some estimates, a majority of people in Europe and North America cannot see the Milky Way from where they live.",
  "**[ 37 ]**",
  "This glow, known as skyglow, can extend dozens of kilometres beyond urban areas. Astronomers were the first to complain, as observatories that had once been remote found themselves on the edge of expanding suburbs.",
  "**[ 38 ]**",
  "The answer, it turns out, includes a great many other species. Migrating birds, which navigate partly by the stars, can become disoriented by brightly lit buildings, sometimes with fatal consequences.",
  "**[ 39 ]**",
  "Humans, too, may pay a price. Exposure to light at night can suppress melatonin, a hormone involved in regulating sleep, although the health consequences of typical urban light levels are still being investigated.",
  "**[ 40 ]**",
  "Such measures need not mean plunging streets into gloom. Well-designed fixtures can illuminate the ground more effectively than older lamps while sending little light into the sky.",
  "**[ 41 ]**",
  "Manufacturers have since developed warmer LEDs, and some cities have dimmed or switched off lights in the small hours, when few people are about. The savings in energy can be considerable.",
  "**[ 42 ]**",
  "Perhaps the strongest argument for darkness, however, is not scientific at all. The sight of the Milky Way arching overhead has inspired myths, navigation and science for millennia.",
  "**[ 43 ]**",
  "———— Removed paragraphs (one is extra) ————",
  ...removed,
], [37, 38, 39, 40, 41, 42, 43].map((n, i) => mcq(`p6-${n}`, "rd:organization", 76 + (i % 3) * 2, `Which paragraph (A–H) fits gap ${n}?`, LET, [4, 2, 6, 5, 0, 7, 3][i],
  ["E names *the culprit* behind the loss of the Milky Way and introduces *the orange glow*, which the next paragraph calls *This glow*.",
   "C (*Their concerns… Who, after all, needed…?*) refers to astronomers and asks the question answered by *The answer, it turns out…*",
   "G (*Nor are they alone*) adds turtles to the birds; *Humans, too* then continues the list.",
   "F (*Against this background*) responds to the harms just listed; *Such measures* in the next paragraph refers to its shielded lighting.",
   "A introduces LEDs; *Manufacturers have since developed warmer LEDs* answers its problem.",
   "H (*There are, inevitably, objections*) precedes *Perhaps the strongest argument for darkness, however…*",
   "D (*To lose it*) refers to *the sight of the Milky Way*."][i] + " B is the extra paragraph.", undefined, undefined, { skill: "reading" })), "environment", "expository");

// ------------------------------------------------------------ Part 7 (multiple matching)
const p7 = RS("cpe-p7", "Writing My First Book", 76, [
  "**A — Historian** I had assumed that the research would be the hard part and the writing a matter of tidying up. In fact the research was a pleasure; the writing was a siege. What finally broke the deadlock was a rule I imposed on myself: three hundred words a day, however bad. Most of them were deleted later, but the habit carried me through. My editor's most useful contribution was to cut the first chapter entirely — painful, but she was right.",
  "**B — Neuroscientist** Writing for a general audience meant unlearning everything my training had taught me about caution. Every sentence I wrote came wrapped in qualifications, and the result was unreadable. I learned to hold the caveats back for the places where they genuinely mattered. Some colleagues were sniffy about the book, regarding popular writing as beneath serious scientists, which I found more amusing than hurtful.",
  "**C — Novelist** I wrote my first novel in secret, telling nobody, partly because I was convinced it would never be finished. When it was rejected by fourteen publishers, I was devastated — and then, rather perversely, determined. The fifteenth accepted it with one condition: that I change the ending. I refused, and to my surprise they published it anyway.",
  "**D — Philosopher** What I underestimated was how lonely the process would be. Teaching is sociable; writing is not. I joined a group of academics who met weekly simply to write in the same room, without talking, and found it transformed my productivity. The book that emerged argues the opposite of the thesis I set out to defend, which I've come to see as a sign that the writing was doing real intellectual work.",
], [
  ["was surprised by which part of the process proved most difficult?", 0],
  ["had to resist a professional habit of excessive caution?", 1],
  ["kept the project hidden from others?", 2],
  ["found that writing alongside others improved their output?", 3],
  ["accepted that a major cut suggested by someone else was justified?", 0],
  ["mentions the disapproval of some fellow professionals?", 1],
  ["turned repeated rejection into motivation?", 2],
  ["ended up arguing against their original position?", 3],
  ["refused to make a change requested by a publisher?", 2],
  ["established a strict daily routine?", 0],
].map(([q, a], i) => mcq(`p7-${44 + i}`, "rd:detail", 74 + (i % 3) * 2, `Which writer… ${q}`, ["A — Historian", "B — Neuroscientist", "C — Novelist", "D — Philosopher"], a as number, "Locate the paraphrase in one section and rule out the others.", undefined, undefined, { skill: "reading" })), "literature", "journalistic");

// ------------------------------------------------------------ Listening
const L = (id: string, title: string, lvl: number, voices: ListeningSet["voices"], lines: [number, string][], questions: any[], type: ListeningSet["type"] = "conversation"): ListeningSet =>
  ({ id, title, type, discipline: "culture", lvl, voices, lines: lines.map(([v, t]) => ({ v, t })), questions });
const S = { skill: "listening" as const };

const lp1 = [
  L("pl1-1", "Extract 1: A museum of ordinary things", 74, [{ name: "Presenter", accent: "en-GB", gender: "m" }, { name: "Curator", accent: "en-GB", gender: "f" }], [
    [0, "Your new exhibition consists entirely of everyday objects — kettles, bus tickets, a broken umbrella. Some critics have called it a provocation."],
    [1, "I'd call it an invitation. We tend to preserve the extraordinary and throw away the ordinary, so future historians end up knowing more about palaces than kitchens. I'm not claiming a kettle is as important as a crown. I'm saying it tells a different and rather neglected story."],
  ], [
    mcq("pl1q1", "ls:attitude", 72, "How does the curator respond to the critics?", ["She reframes the exhibition's purpose rather than conceding the criticism.", "She agrees that it is provocative.", "She dismisses critics as ignorant.", "She admits the objects are unimportant."], 0, "", undefined, undefined, S),
    mcq("pl1q2", "ls:inference", 76, "What point is the curator making?", ["Collecting habits distort what is known about the past.", "Kettles are more important than crowns.", "Palaces should not be preserved.", "Historians dislike ordinary objects."], 0, "", [null, "Explicitly denied.", null, null], [null, "contradicts", null, null], S),
  ]),
  L("pl1-2", "Extract 2: Working from home", 74, [{ name: "Woman", accent: "en-US", gender: "f" }, { name: "Man", accent: "en-US", gender: "m" }], [
    [0, "Are you still working from home three days a week?"],
    [1, "Two now. I thought I'd love it, and I do — the quiet is wonderful for writing. But I found the ideas dried up. Most of my best ones come from overhearing something in the corridor and thinking, 'Hang on, that's relevant to what I'm doing.'"],
    [0, "Serendipity doesn't work over video calls."],
    [1, "Exactly. Nobody schedules a meeting to have an accidental conversation."],
  ], [
    mcq("pl2q1", "ls:causal", 72, "Why has the man reduced his days at home?", ["He missed the chance encounters that generate ideas.", "He found the house too noisy.", "His employer required it.", "He disliked video calls."], 0, "", [null, "He says *the quiet is wonderful*.", null, null], [null, "contradicts", null, null], S),
    mcq("pl2q2", "ls:inference", 74, "What do both speakers imply about video calls?", ["They cannot reproduce unplanned interaction.", "They are better for writing.", "They should replace meetings.", "They are too expensive."], 0, "", undefined, undefined, S),
  ]),
  L("pl1-3", "Extract 3: A historian of umbrellas", 76, [{ name: "Lecturer", accent: "en-IE", gender: "m" }], [
    [0, "When the umbrella first appeared on the streets of London in the eighteenth century, it was widely mocked. Carrying one suggested that you could not afford a carriage, which was a social admission few gentlemen were willing to make. It took decades — and, frankly, a great deal of rain — before practicality triumphed over pride."],
  ], [
    mcq("pl3q1", "ls:inference", 74, "Why were early umbrella users mocked?", ["Using one implied a lack of wealth.", "Umbrellas were considered feminine.", "They were expensive.", "They were useless in heavy rain."], 0, "", undefined, undefined, S),
    mcq("pl3q2", "ls:attitude", 76, "What is the tone of the lecturer's final comment?", ["Wryly humorous", "Angry", "Sad", "Formal and neutral"], 0, "*Frankly, a great deal of rain* — dry humour.", undefined, undefined, S),
  ]),
];

const lp2 = [L("pl2", "Part 2: Saving the sounds of the past", 76, [{ name: "Archivist", accent: "en-GB", gender: "f" }], [
  [0, "I work as a sound archivist, which in practice means I spend my days trying to rescue recordings before they disappear. People assume the oldest recordings are the most fragile, but often it's the opposite. Wax cylinders from the 1900s can be surprisingly stable; it's magnetic tape from the 1970s and 80s that worries me most, because the binder that holds the magnetic particles absorbs moisture and starts to break down."],
  [0, "When that happens, the tape becomes sticky and can shed its coating as it's played — so playing it is exactly what damages it. One remedy, oddly enough, is to bake the tape at a low temperature for several hours, which temporarily stabilises it long enough for a single careful transfer."],
  [0, "We prioritise collections that exist nowhere else. A large part of our work at the moment involves fieldwork recordings of endangered languages, made by linguists decades ago. Often the only copy sits in a cardboard box in someone's office. Our real enemy isn't time so much as obsolescence: the machines needed to play some formats are no longer manufactured, and the engineers who know how to repair them are retiring."],
  [0, "Digitisation isn't the end of the story either. Digital files need to be migrated to new formats and storage systems regularly. I sometimes tell people that a digital archive is less like a library and more like a garden — it needs constant tending."],
], [
  ["People assume that the ___ recordings are the most fragile.", ["oldest"]],
  ["The archivist is most worried about magnetic ___.", ["tape"]],
  ["The ___ in tape absorbs moisture and breaks down.", ["binder"]],
  ["Damaged tape becomes ___ when played.", ["sticky"]],
  ["One remedy is to ___ the tape at a low temperature.", ["bake"]],
  ["Many current projects involve recordings of endangered ___.", ["languages"]],
  ["Often the only copy is kept in a ___ in someone's office.", ["cardboard box", "box"]],
  ["She says the real enemy is ___ rather than time.", ["obsolescence"]],
  ["She compares a digital archive to a ___.", ["garden"]],
].map(([q, a], i) => gap(`pl2s${i + 1}`, "ls:detail", 72 + (i % 3) * 2, q as string, a as string[], "Sentence completion: the answer is a word or short phrase heard in the recording. Spelling must be correct.", { ...S, prompt: "Complete the sentence." })), "lecture")];

const lp3 = [L("pl3", "Part 3: Interview with an urban planner", 78, [{ name: "Host", accent: "en-US", gender: "f" }, { name: "Marcus", accent: "en-GB", gender: "m" }], [
  [0, "Marcus Hale has spent twenty years advising cities on how to slow down. Marcus, what does that actually mean?"],
  [1, "It's less mystical than it sounds. It means designing streets so that walking is the obvious choice for short journeys — narrower roads, more crossings, shops on the ground floor. When people walk, they encounter each other. Cities become places to be, not just places to pass through."],
  [0, "Critics say it's a middle-class luxury."],
  [1, "I understand why they say it, and I think it's a fair challenge, not a fatal one. If you redesign a neighbourhood and rents double, you've simply exported the problem. So any serious scheme has to include measures to keep housing affordable. Otherwise, I'd agree with the critics."],
  [0, "What's the biggest obstacle you face?"],
  [1, "Honestly? Not money, and not engineering. It's that every change creates losers who are very visible — a driver who loses a parking space — and winners who are invisible, like the child who's now safe walking to school. Politicians hear from the first group far more than the second."],
  [0, "Has your thinking changed over the years?"],
  [1, "Enormously. When I started, I thought good design would speak for itself. Now I spend more time listening to residents than drawing plans. The best ideas I've implemented came from people who'd lived on a street for forty years."],
], [
  mcq("pl3-1", "ls:detail", 74, "According to Marcus, 'slowing down' a city mainly involves…", ["making walking the natural choice for short trips", "reducing the speed limit everywhere", "closing city centres to traffic", "encouraging people to work less"], 0, "", undefined, undefined, S),
  mcq("pl3-2", "ls:attitude", 78, "How does Marcus regard the criticism that slow cities are a middle-class luxury?", ["As a legitimate concern that can be addressed", "As completely unfounded", "As decisive proof that the idea fails", "As irrelevant to planning"], 0, "*A fair challenge, not a fatal one.*", [null, "Too strong.", "*Not a fatal one*.", null], [null, "too-extreme", "contradicts", null], S),
  mcq("pl3-3", "ls:inference", 80, "What does Marcus see as the main political difficulty?", ["Those who lose out are more vocal than those who benefit.", "There is not enough money.", "Engineers resist change.", "Children do not walk to school."], 0, "", undefined, undefined, S),
  mcq("pl3-4", "ls:detail", 78, "How has Marcus's approach changed?", ["He now relies more on residents' knowledge.", "He now designs more plans.", "He has stopped working with politicians.", "He now focuses on engineering."], 0, "", undefined, undefined, S),
  mcq("pl3-5", "ls:purpose", 78, "Why does Marcus mention a child walking to school?", ["To illustrate a benefit that is easily overlooked", "To criticise parents", "To argue for more parking", "To describe his own childhood"], 0, "", undefined, undefined, S),
], "interview")];

const r1 = ["burnout in their previous job", "a health problem", "redundancy", "a long-held ambition", "a chance conversation", "family pressure", "moving to another country", "financial reasons"];
const r2 = ["lack of confidence", "being much older than classmates", "a drop in income", "learning technical vocabulary", "loneliness", "convincing an employer", "balancing study and childcare", "physical exhaustion"];
const lp4 = [L("pl4", "Part 4: Five people who changed career in mid-life", 78, [
  { name: "Speaker 1", accent: "en-GB", gender: "m" }, { name: "Speaker 2", accent: "en-US", gender: "f" }, { name: "Speaker 3", accent: "en-AU", gender: "m" }, { name: "Speaker 4", accent: "en-IE", gender: "f" }, { name: "Speaker 5", accent: "en-IN", gender: "m" }], [
  [0, "Speaker one. I'd been an accountant for twenty years when my firm closed its local office and let half of us go. I'd always fancied nursing, so I took the plunge. The hardest part, oddly, wasn't the science; it was walking into lectures full of nineteen-year-olds and feeling like everyone's dad."],
  [1, "Speaker two. I'd dreamed of being a carpenter since I was a girl, but I ended up in insurance because it was 'sensible'. At forty-five I finally did the apprenticeship. What nobody warns you about is the money — going from a salary to apprentice wages was a real shock, and we had to cut back on everything."],
  [2, "Speaker three. I was on a train, chatting to a stranger who turned out to be a park ranger, and something just clicked. Six months later I'd enrolled on a conservation course. The trouble was, employers kept asking for experience I didn't have. Persuading someone to take a chance on me took over a year."],
  [3, "Speaker four. I was completely burnt out in advertising — I wasn't sleeping, I'd stopped enjoying anything. Retraining as a teacher saved me, I think. But the first year, juggling coursework with two small children at home, nearly finished me off. There were weeks I studied from midnight to two."],
  [4, "Speaker five. When we moved to Canada, my engineering qualifications weren't recognised, so I had to start again. I chose software development. Honestly, the coding itself was fine. What I struggled with was believing I could do it — I kept thinking everyone else was cleverer."],
], [
  ...[2, 3, 4, 0, 6].map((a, i) => mcq(`pl4a${i + 1}`, "ls:causal", 76, `TASK ONE — Speaker ${i + 1}: what led them to change career?`, r1.map((x, k) => `${LET[k]} ${x}`), a, "Listen for the cause, not merely for topics mentioned.", undefined, undefined, S)),
  ...[1, 2, 5, 6, 0].map((a, i) => mcq(`pl4b${i + 1}`, "ls:detail", 78, `TASK TWO — Speaker ${i + 1}: what was the biggest difficulty?`, r2.map((x, k) => `${LET[k]} ${x}`), a, "Identify the difficulty the speaker emphasises most.", undefined, undefined, S)),
], "discussion")];

const sp: SpeakingTask[] = [
  { id: "ps-1", type: "exam", exam: "cpe", title: "Part 1 — Interview", prompt: "How important is it for you to have a routine? Why?", prepSec: 0, speakSec: 30, lvl: 66, checklist: ["Extended, natural answer"] },
  { id: "ps-2", type: "exam", exam: "cpe", title: "Part 2 — Collaborative task (solo adaptation)", context: "Imagine a set of pictures showing different ways people share knowledge: a public lecture, an online forum, a grandmother teaching a child to cook, a museum guide.", prompt: "Talk about how effective each way of sharing knowledge might be, then decide which would be most valuable in a campaign promoting lifelong learning.", prepSec: 15, speakSec: 120, lvl: 72, checklist: ["Evaluated several options", "Speculated and compared", "Reached a justified decision"] },
  { id: "ps-3", ...({} as any), type: "exam", exam: "cpe", title: "Part 3 — Long turn", prompt: "**How important is it for a society to preserve its languages?**\n\nYou may consider:\n- identity and culture\n- economic opportunities\n- the role of education", prepSec: 10, speakSec: 120, lvl: 74, checklist: ["Coherent 2-minute argument", "Went beyond the prompts", "Sophisticated, precise language"] },
  { id: "ps-4", type: "exam", exam: "cpe", title: "Part 3 — Discussion", prompt: "Do you think technology will make language learning unnecessary in the future?", prepSec: 0, speakSec: 60, lvl: 74, checklist: ["Nuanced view", "Speculation", "Examples"] },
];

export const CPE: ExamSpec = {
  id: "cpe", name: "Cambridge C2 Proficiency (CPE)", short: "C2 Proficiency",
  desc: "Reading & Use of English (7 partes, 90 min), Writing (2 partes, 90 min), Listening (4 partes, ~40 min, se escucha dos veces), Speaking (3 partes, ~16 min).",
  scale: "Cambridge English Scale 180–230. C2: 200–230 (Grado A 220–230, B 213–219, C 200–212); 180–199 = certificado C1.",
  formatNote: "Formato basado en la descripción pública de Cambridge English. Material original. Speaking adaptado para practicar en solitario. La conversión a la escala de Cambridge es aproximada.",
  sections: [
    {
      id: "rue", name: "Reading & Use of English", minutes: 90, kind: "receptive", parts: [
        { id: "p1", name: "Part 1 — Multiple-choice cloze", instructions: "For questions 1–8, choose the answer which best fits each gap.", kind: "reading", reading: p1, marks: 1, group: "uoe" },
        { id: "p2", name: "Part 2 — Open cloze", instructions: "For questions 9–16, write ONE word in each gap.", kind: "reading", reading: p2, marks: 1, group: "uoe" },
        { id: "p3", name: "Part 3 — Word formation", instructions: "For questions 17–24, use the word in capitals to form a word that fits the gap.", kind: "reading", reading: p3, marks: 1, group: "uoe" },
        { id: "p4", name: "Part 4 — Key word transformations", instructions: "For questions 25–30, use between three and eight words, including the word given.", kind: "items", items: p4, marks: 2, group: "uoe" },
        { id: "p5", name: "Part 5 — Multiple choice", instructions: "For questions 31–36, choose the answer which fits best according to the text.", kind: "reading", reading: p5, marks: 2, group: "reading" },
        { id: "p6", name: "Part 6 — Gapped text", instructions: "Seven paragraphs have been removed. Choose from A–H. There is one extra paragraph.", kind: "reading", reading: p6, marks: 2, group: "reading" },
        { id: "p7", name: "Part 7 — Multiple matching", instructions: "For questions 44–53, choose from the sections A–D.", kind: "reading", reading: p7, marks: 1, group: "reading" },
      ],
    },
    {
      id: "writing", name: "Writing", minutes: 90, kind: "writing", parts: [
        { id: "w1", name: "Part 1 — Essay (summary + evaluation of two texts)", instructions: "240–280 words.", kind: "writing", writing: WRITING_TASKS.find((t) => t.id === "w-cpe-essay")! },
        { id: "w2", name: "Part 2 — Choose one task", instructions: "280–320 words.", kind: "choice-writing", writingOptions: [WRITING_TASKS.find((t) => t.id === "w-cpe-article")!, WRITING_TASKS.find((t) => t.id === "w-cae-review")!].map((w, i) => (i === 1 ? { ...w, id: "w-cpe-review", genre: "C2 Proficiency: Review", minWords: 280, maxWords: 320, exam: "cpe" as const } : w)) },
      ],
    },
    {
      id: "listening", name: "Listening", minutes: 40, kind: "receptive", parts: [
        { id: "l1", name: "Part 1 — Three extracts", instructions: "Choose the best answer. You will hear each extract twice.", kind: "listening", listening: lp1, plays: 2, marks: 1, group: "listening" },
        { id: "l2", name: "Part 2 — Sentence completion", instructions: "Complete the sentences. You will hear the recording twice.", kind: "listening", listening: lp2, plays: 2, marks: 1, group: "listening" },
        { id: "l3", name: "Part 3 — Interview", instructions: "Choose the best answer. You will hear the recording twice.", kind: "listening", listening: lp3, plays: 2, marks: 1, group: "listening" },
        { id: "l4", name: "Part 4 — Multiple matching", instructions: "Two tasks. You will hear the recording twice.", kind: "listening", listening: lp4, plays: 2, marks: 1, group: "listening" },
      ],
    },
    { id: "speaking", name: "Speaking", minutes: 16, kind: "speaking", parts: [{ id: "s", name: "Parts 1–3", instructions: "Answer each task in the time given.", kind: "speaking", speaking: sp }] },
  ],
};
