import type { ExamSpec } from "./types";
import type { ReadingSet, ListeningSet, SpeakingTask } from "../types";
import { mcq, gap, tf } from "../helpers";
import { WRITING_TASKS } from "../writing";
import { SPEAKING_TASKS } from "../speaking";

const S = { skill: "listening" as const };
const RD = { skill: "reading" as const };
const L = (id: string, title: string, lvl: number, voices: ListeningSet["voices"], lines: [number, string][], questions: any[], type: ListeningSet["type"] = "conversation"): ListeningSet =>
  ({ id, title, type, discipline: "everyday", lvl, voices, lines: lines.map(([v, t]) => ({ v, t })), questions });
const G = (id: string, lvl: number, q: string, a: string[], explain = "Write NO MORE THAN TWO WORDS AND/OR A NUMBER. Spelling counts.") => gap(id, "ls:detail", lvl, q, a, explain, { ...S, prompt: "Complete the notes." });

// ------------------------------------------------------------ LISTENING
const part1 = L("il-1", "Part 1: Registering for a language exchange", 52, [{ name: "Receptionist", accent: "en-GB", gender: "m" }, { name: "Student", accent: "en-AU", gender: "f" }], [
  [0, "Good morning, International Office. How can I help?"],
  [1, "Hi, I'd like to sign up for the language exchange programme, please."],
  [0, "Of course. Can I take your surname?"],
  [1, "It's Delgado. D, E, L, G, A, D, O."],
  [0, "Thank you. And your student number?"],
  [1, "Seven three zero nine one."],
  [0, "Which language would you like to practise?"],
  [1, "I was thinking Japanese, but actually, Korean — my flatmate is Korean and I'd like to surprise her."],
  [0, "Lovely. And how would you describe your level?"],
  [1, "Well, I've done a beginners' course, so… probably lower intermediate? Let's just say intermediate."],
  [0, "Fine. We match people on Mondays or Wednesdays. Which suits you?"],
  [1, "Mondays I have a lab until late, so Wednesday, please."],
  [0, "Sessions start at six or at half past six."],
  [1, "Half past six would be safer."],
  [0, "Right. Most pairs meet in the library, but on Wednesdays it's the café in the student union."],
  [1, "That's even better."],
  [0, "We also ask about hobbies, to help with matching."],
  [1, "Hmm, I used to play the guitar, but these days it's mostly photography."],
  [0, "Great. There's a registration fee of twenty pounds — or fifteen with a student discount, which you'll get."],
  [1, "Perfect. Oh, and you might want to know — I heard about this from a poster in the library."],
  [0, "Thanks, that's useful. You're all set."],
], [
  G("il1-1", 50, "Surname: ___", ["Delgado"]),
  G("il1-2", 50, "Student number: ___", ["73091"]),
  G("il1-3", 52, "Language to practise: ___", ["Korean"], "Mentioned-but-rejected trap: Japanese was her first idea."),
  G("il1-4", 50, "Level: ___", ["intermediate"]),
  G("il1-5", 50, "Day: ___", ["Wednesday", "Wednesdays"]),
  G("il1-6", 52, "Start time: ___ p.m.", ["6.30", "6:30", "half past six", "six thirty"]),
  G("il1-7", 52, "Meeting place: the ___ in the student union", ["café", "cafe"]),
  G("il1-8", 52, "Interest: ___", ["photography"], "*Used to play the guitar* = no longer."),
  G("il1-9", 52, "Fee: £___", ["15", "fifteen"]),
  G("il1-10", 52, "Heard about it from a ___", ["poster"]),
]);

const part2 = L("il-2", "Part 2: Volunteering at the botanical garden", 58, [{ name: "Coordinator", accent: "en-GB", gender: "f" }], [
  [0, "Welcome, everyone, and thank you for your interest in volunteering at the botanical garden. Let me give you an overview."],
  [0, "Most of our volunteers work in one of three areas: the glasshouses, the education centre, or the seed bank. Despite what many people expect, the area that needs the most help at the moment is not the glasshouses but the seed bank, where we're cataloguing over twenty thousand samples."],
  [0, "We ask volunteers to commit to at least one half-day a week for three months. Longer is wonderful, but three months is the minimum, because training takes time."],
  [0, "Training itself is a two-day course. The first day covers health and safety; the second is specific to the area you choose. If you're working in the education centre, you'll also need a background check, as you'll be working with school groups."],
  [0, "A few practical points. Parking on site is limited, so we strongly recommend the number twelve bus, which stops right at the main gate. Volunteers receive a free lunch on the days they work, and after six months you'll get a pass that lets you bring two guests free of charge."],
  [0, "Finally, the information you'll need. The volunteer office is open Tuesday to Friday. The coordinator for the seed bank is Dr Patel; for the education centre, it's Mr Okoro; and for the glasshouses, Ms Lindqvist. If you're unsure, email the general volunteer address and we'll direct you."],
], [
  mcq("il2-11", "ls:detail", 56, "Which area currently needs the most volunteers?", ["The seed bank", "The glasshouses", "The education centre", "The main gate"], 0, "*Not the glasshouses but the seed bank.*", [null, "Mentioned-but-rejected trap.", null, null], [null, "word-match", null, null], S),
  mcq("il2-12", "ls:detail", 56, "What is the minimum commitment?", ["One half-day a week for three months", "One full day a week for six months", "Two days a month", "One weekend a month"], 0, "", undefined, undefined, S),
  mcq("il2-13", "ls:detail", 58, "What does the second day of training cover?", ["Topics specific to the chosen area", "Health and safety", "Background checks", "Working with school groups"], 0, "", undefined, undefined, S),
  mcq("il2-14", "ls:detail", 58, "Who needs a background check?", ["Volunteers in the education centre", "All volunteers", "Seed bank volunteers", "Volunteers who drive"], 0, "", undefined, undefined, S),
  mcq("il2-15", "ls:detail", 56, "How does the coordinator recommend travelling to the garden?", ["By bus", "By car", "By bicycle", "On foot"], 0, "", undefined, undefined, S),
  G("il2-16", 56, "Volunteers get a free ___ on working days.", ["lunch"]),
  G("il2-17", 58, "After ___ months, volunteers can bring two guests free.", ["six", "6"]),
  G("il2-18", 56, "The volunteer office is open Tuesday to ___.", ["Friday"]),
  G("il2-19", 58, "Seed bank coordinator: Dr ___", ["Patel"]),
  G("il2-20", 58, "Glasshouse coordinator: Ms ___", ["Lindqvist"]),
], "announcement");

const part3 = L("il-3", "Part 3: Planning a research project", 64, [{ name: "Tutor", accent: "en-GB", gender: "m" }, { name: "Hana", accent: "en-US", gender: "f" }, { name: "Diego", accent: "en-AU", gender: "m" }], [
  [0, "So, you two are looking at noise in the university library. How's the planning going?"],
  [1, "We've decided to focus on the second floor, because that's the one officially designated as a silent area."],
  [2, "And we want to compare what students say about noise with what we actually measure."],
  [0, "Good. How will you measure it?"],
  [2, "We'd originally planned to use a phone app, but we tested it and the readings were all over the place, so we've borrowed a proper sound level meter from the physics department."],
  [0, "Sensible. And the survey?"],
  [1, "We'll put a short online questionnaire on the library website. We thought about interviews, but they'd take too long and people might say what they think we want to hear."],
  [0, "That's a risk with questionnaires too, of course. When will you collect data?"],
  [2, "Over two weeks, including the week before exams. We expect it to be busiest then."],
  [0, "Busiest, yes — but probably quietest as well. Students tend to take silence more seriously when exams are close. You might want a normal week for comparison."],
  [1, "Good point. We hadn't thought of that."],
  [0, "Now, you each read different sources. What did you make of them?"],
  [1, "The study from Canada was useful for its methods, but the sample was tiny."],
  [2, "I found the report by the library association a bit one-sided — it was basically arguing for more funding."],
  [1, "The journal article on open-plan offices wasn't about libraries at all, but its findings on distraction were surprisingly relevant."],
  [2, "And the student newspaper survey was entertaining, but I wouldn't cite it."],
], [
  mcq("il3-21", "ls:detail", 62, "Why did the students choose the second floor?", ["It is officially a silent area.", "It is the busiest floor.", "It is the noisiest floor.", "It has the most seats."], 0, "", undefined, undefined, S),
  mcq("il3-22", "ls:causal", 64, "Why did they stop using a phone app?", ["Its readings were inconsistent.", "It was too expensive.", "The tutor recommended a meter.", "Students complained about it."], 0, "*The readings were all over the place.*", undefined, undefined, S),
  mcq("il3-23", "ls:causal", 64, "Why did they reject interviews?", ["They would take too long and might produce biased answers.", "Students refused to take part.", "The tutor said they were unreliable.", "They had no recording equipment."], 0, "", undefined, undefined, S),
  mcq("il3-24", "ls:inference", 66, "What problem does the tutor identify with collecting data before exams?", ["The library may be unusually quiet then.", "The library may be closed.", "Students will not answer surveys.", "It will be too noisy to measure."], 0, "*Busiest, yes — but probably quietest as well.*", [null, null, null, "Reverses the tutor's point."], [null, null, null, "reversed"], S),
  mcq("il3-25", "ls:detail", 64, "What does the tutor suggest?", ["Including a normal week for comparison", "Using interviews instead", "Measuring other floors", "Collecting data for a month"], 0, "", undefined, undefined, S),
  ...([["the Canadian study", 0], ["the library association report", 1], ["the article on open-plan offices", 2], ["the student newspaper survey", 3]] as [string, number][]).map(([src, a], i) =>
    mcq(`il3-${26 + i}`, "ls:attitude", 66, `What do the students say about ${src}?`, ["A useful methods but a small sample", "B biased in its aims", "C relevant despite a different setting", "D not suitable as an academic source", "E too old to be useful"], a, "Match each source with the evaluation the students give.", undefined, undefined, S)),
  mcq("il3-30", "ls:organization", 64, "Which source do they NOT discuss?", ["A government report", "A Canadian study", "A journal article", "A student newspaper survey"], 0, "", undefined, undefined, S),
]);

const part4 = L("il-4", "Part 4: Lecture — The history of salt", 68, [{ name: "Lecturer", accent: "en-US", gender: "f" }], [
  [0, "Today's topic may seem humble, but salt has shaped human history in remarkable ways. For most of history, its main value was not flavour but preservation. Before refrigeration, salting was one of the most effective ways of preventing meat and fish from spoiling, because salt draws out the moisture that bacteria need."],
  [0, "Because it was essential, salt was also a source of power. Governments in many periods taxed it heavily, precisely because everyone needed it. In China, a state monopoly on salt provided a major share of government revenue for centuries."],
  [0, "Salt was produced in three main ways. In coastal regions, seawater was left to evaporate in shallow ponds. Inland, people mined rock salt from underground deposits. And in some areas, salty water from natural springs was boiled until only the salt remained — a method that required enormous amounts of fuel, often leading to deforestation."],
  [0, "Trade routes developed around salt. Across the Sahara, caravans carried slabs of salt southwards, where it was exchanged for gold and other goods. Some historians argue that the wealth of certain West African cities depended as much on salt as on gold."],
  [0, "Finally, salt has left traces in language. The English word salary is often said to come from a payment to Roman soldiers for buying salt, though historians now regard that story as uncertain. What is certain is the word's connection to the Latin sal, meaning salt."],
], [
  G("il4-31", 66, "Salt's main historical value was for ___ rather than flavour.", ["preservation"]),
  G("il4-32", 66, "Salt removes ___ that bacteria need.", ["moisture"]),
  G("il4-33", 66, "Governments often ___ salt heavily.", ["taxed"]),
  G("il4-34", 68, "In China, a state ___ on salt provided major revenue.", ["monopoly"]),
  G("il4-35", 66, "On the coast, seawater was left to ___ in ponds.", ["evaporate"]),
  G("il4-36", 66, "Inland, rock salt was ___ from underground.", ["mined"]),
  G("il4-37", 68, "Boiling spring water required lots of fuel, often causing ___.", ["deforestation"]),
  G("il4-38", 66, "Caravans exchanged salt for ___ and other goods.", ["gold"]),
  G("il4-39", 68, "The story that 'salary' comes from soldiers' salt payments is now considered ___.", ["uncertain"]),
  G("il4-40", 66, "The Latin word for salt is ___.", ["sal"]),
], "lecture");

// ------------------------------------------------------------ READING
const R1: ReadingSet = {
  id: "ir-1", title: "The Humble Pencil", discipline: "history", genre: "expository", lvl: 60,
  paragraphs: [
    "It is easy to overlook the pencil. Cheap, light and unassuming, it seems too simple to have a history. Yet the modern pencil is the product of several centuries of experimentation, accident and international rivalry.",
    "The story is usually traced to the mid-sixteenth century, when an unusually pure deposit of graphite was discovered in Borrowdale, in the north-west of England. Local people found that the material left a dark mark and began using it to mark sheep. At the time, graphite was widely believed to be a form of lead, which is why we still speak of pencil 'lead' today, even though pencils have never contained it.",
    "Borrowdale graphite was so pure that it could be sawn into sticks and used directly. It quickly became valuable, and for a period the mine was guarded and its output strictly controlled to prevent theft. Early users wrapped the sticks in string or sheepskin to keep their hands clean; later, craftsmen began to insert them into hollowed-out wooden holders.",
    "Countries without access to pure graphite had to find alternatives. In the 1790s, when war interrupted the supply of English graphite to France, the French engineer Nicolas-Jacques Conté developed a method of mixing powdered graphite with clay and firing the mixture in a kiln. The process had a crucial advantage: by changing the proportion of clay, manufacturers could control how hard or soft the pencil was. The grading systems still printed on pencils today are a legacy of this innovation.",
    "Other familiar features came later. Many pencils are hexagonal rather than round, a shape that makes them easier to grip and stops them from rolling off desks. In 1858, an American named Hymen Lipman received a patent for attaching an eraser to the end of a pencil, although the patent was later declared invalid on the grounds that it merely combined two existing objects.",
    "Today, billions of pencils are produced each year. Digital devices have not made them obsolete: architects, artists and schoolchildren continue to rely on them, and they remain one of the few writing instruments that work in extreme cold, under water, or in zero gravity — although the idea that space agencies relied on pencils for decades is more complicated than the popular story suggests.",
  ],
  questions: [
    tf("ir1-1", "rd:detail", 58, "The Borrowdale graphite deposit was discovered in the sixteenth century.", "T", "*Mid-sixteenth century.*", "TFNG", RD),
    tf("ir1-2", "rd:detail", 60, "Pencils have never contained lead.", "T", "*Even though pencils have never contained it.*", "TFNG", RD),
    tf("ir1-3", "rd:detail", 60, "The Borrowdale mine was the largest graphite mine in Europe.", "NG", "Size compared to other mines is never mentioned.", "TFNG", RD),
    tf("ir1-4", "rd:detail", 62, "Conté's method was developed because France could not obtain English graphite.", "T", "*When war interrupted the supply of English graphite to France.*", "TFNG", RD),
    tf("ir1-5", "rd:detail", 62, "Conté's method made all pencils equally hard.", "F", "Changing the clay proportion controlled hardness — the opposite.", "TFNG", RD),
    tf("ir1-6", "rd:detail", 60, "Lipman's patent remained valid for many decades.", "F", "*Later declared invalid.*", "TFNG", RD),
    gap("ir1-7", "rd:detail", 58, "Early users wrapped graphite sticks in string or ___ to keep their hands clean.", ["sheepskin"], "", { ...RD, prompt: "Complete the sentence with ONE WORD from the text." }),
    gap("ir1-8", "rd:detail", 60, "Conté fired a mixture of graphite and clay in a ___.", ["kiln"], "", { ...RD, prompt: "Complete with ONE WORD from the text." }),
    gap("ir1-9", "rd:detail", 60, "A hexagonal shape stops pencils from ___ off desks.", ["rolling"], "", { ...RD, prompt: "Complete with ONE WORD from the text." }),
    gap("ir1-10", "rd:detail", 60, "The patent was declared invalid because it combined two ___ objects.", ["existing"], "", { ...RD, prompt: "Complete with ONE WORD from the text." }),
    mcq("ir1-11", "rd:purpose", 62, "Why was the Borrowdale mine guarded?", ["Its graphite was valuable and could be stolen.", "It was dangerous.", "The French wanted to capture it.", "Sheep kept entering it."], 0, "", undefined, undefined, RD),
    mcq("ir1-12", "rd:detail", 62, "What was the main advantage of Conté's process?", ["It allowed control over the pencil's hardness.", "It used no graphite.", "It was faster than mining.", "It produced hexagonal pencils."], 0, "", undefined, undefined, RD),
    mcq("ir1-13", "rd:attitude", 64, "What does the writer suggest about the story of pencils in space?", ["It is less straightforward than commonly believed.", "It is completely false.", "It proves pencils are better than pens.", "It explains why pencils are hexagonal."], 0, "*More complicated than the popular story suggests.*", [null, "Too strong.", null, null], [null, "too-extreme", null, null], RD),
  ],
};

const headings = ["i The cost of cooling", "ii How cities trap heat", "iii A problem that is not only about comfort", "iv Measuring the difference", "v Greener solutions", "vi Rethinking surfaces", "vii Why rural areas are warming faster", "viii Unequal exposure"];
const R2: ReadingSet = {
  id: "ir-2", title: "Cities That Cook", discipline: "environment", genre: "expository", lvl: 66,
  paragraphs: [
    "**A** On a still summer evening, the centre of a large city can be several degrees warmer than the surrounding countryside. This phenomenon, known as the urban heat island effect, has been recorded in cities around the world, and the difference is often greatest at night, when rural areas cool rapidly but urban areas continue to release the heat they have absorbed during the day.",
    "**B** Several features of cities contribute to the effect. Asphalt and concrete absorb large amounts of solar energy and release it slowly. Tall buildings trap heat between them and reduce wind speeds. Vehicles, air-conditioning units and industry add waste heat directly to the air. And because cities have relatively little vegetation, they lose the cooling that plants provide through evaporation.",
    "**C** The consequences go well beyond discomfort. During heatwaves, higher urban temperatures are associated with increased illness and death, particularly among elderly people and those with existing health conditions. Heat also increases the demand for electricity for cooling, which can strain power networks at exactly the moment they are most needed.",
    "**D** The burden is not shared equally. Within the same city, neighbourhoods with few trees and dense, older housing are often considerably hotter than leafy, wealthier districts. Studies in several countries have found that lower-income residents are more likely to live in the hottest areas and less likely to have access to air-conditioning.",
    "**E** One of the most effective responses is also one of the oldest: planting trees. Trees shade streets and buildings and cool the air through evaporation. Parks, green roofs and even small pocket gardens can lower local temperatures, although their effect depends heavily on their size and on whether they are adequately watered.",
    "**F** Another approach focuses on the materials cities are made of. Light-coloured 'cool roofs' reflect more sunlight than dark ones, and experimental pavements can reflect or retain water to reduce surface temperatures. Such measures are not without trade-offs — highly reflective surfaces can increase glare, for example — but they offer a way of reducing heat without large amounts of space.",
  ],
  questions: [
    ...["A", "B", "C", "D", "E", "F"].map((p, i) => mcq(`ir2-${14 + i}`, "rd:main-idea", 64 + (i % 3) * 2, `Choose the correct heading for paragraph ${p}.`, headings, [3, 1, 2, 7, 4, 5][i], "Matching headings: the heading summarises the paragraph's MAIN idea, not a detail it mentions. Two headings are extra (i and vii).", undefined, undefined, RD)),
    gap("ir2-20", "rd:detail", 64, "The heat island effect is often strongest at ___.", ["night"], "", { ...RD, prompt: "Summary completion: ONE WORD from the text." }),
    gap("ir2-21", "rd:detail", 64, "Tall buildings reduce ___ speeds.", ["wind"], "", { ...RD, prompt: "Summary completion: ONE WORD from the text." }),
    gap("ir2-22", "rd:detail", 66, "Plants cool cities through ___.", ["evaporation"], "", { ...RD, prompt: "Summary completion: ONE WORD from the text." }),
    gap("ir2-23", "rd:detail", 66, "Highly reflective surfaces can increase ___.", ["glare"], "", { ...RD, prompt: "Summary completion: ONE WORD from the text." }),
    mcq("ir2-24", "rd:inference", 68, "Why can heat strain electricity networks?", ["Demand for cooling rises at the same time as the heat.", "Power stations stop working in heat.", "Cables melt.", "People use more lighting."], 0, "", undefined, undefined, RD),
    mcq("ir2-25", "rd:detail", 66, "According to paragraph E, the cooling effect of green spaces depends on…", ["their size and watering", "the type of trees", "the age of the city", "the number of visitors"], 0, "", undefined, undefined, RD),
    mcq("ir2-26", "rd:purpose", 68, "What is the main purpose of paragraph F?", ["To present a material-based solution and its limitations", "To argue against cool roofs", "To explain why cities are hot", "To compare cities in different countries"], 0, "", undefined, undefined, RD),
  ],
};

const R3: ReadingSet = {
  id: "ir-3", title: "Bringing Back the Mammoth?", discipline: "biology", genre: "argumentative", lvl: 72,
  paragraphs: [
    "Few scientific ambitions capture the public imagination quite like 'de-extinction' — the idea of using genetic technologies to recreate species that have disappeared. Projects have been announced to revive, in some form, the woolly mammoth, the passenger pigeon and the thylacine. Supporters speak of correcting past wrongs and restoring lost ecosystems. I want to suggest that, while the science is genuinely fascinating, the enthusiasm deserves considerably more scrutiny than it usually receives.",
    "The first problem is one of definition. Strictly speaking, no current technique can bring back an extinct species. What researchers propose is to edit the genome of a living relative — the Asian elephant, in the case of the mammoth — so that it carries some traits of the extinct animal. The result would be a cold-adapted elephant, not a mammoth. Calling it de-extinction is, at best, a generous simplification.",
    "The second concerns priorities. Conservation budgets are limited, and money spent on reviving one species is money not spent on protecting the many species currently threatened. Defenders reply that de-extinction research is largely funded by private investors who would not otherwise give to conservation, and that the techniques developed may help living species, for instance by increasing genetic diversity in small populations. This is a reasonable point, and I do not dismiss it. But it does not answer the question of what happens once a revived animal exists and needs a habitat, protection and long-term care.",
    "A third concern is ecological. Ecosystems do not stand still waiting for missing species to return. The Arctic tundra of today is not the mammoth steppe of twelve thousand years ago, and a large herbivore introduced into it might behave in unpredictable ways. Some researchers argue that large grazers could help slow the thawing of permafrost by trampling snow and encouraging grasslands; this hypothesis is intriguing, but it remains largely untested at scale.",
    "Finally, there is a moral hazard. If extinction comes to be seen as reversible, the urgency of preventing it may diminish. Why worry about a disappearing species if technology can restore it later? The argument is speculative, but it is not absurd, and it should give pause to anyone who presents de-extinction as a straightforward good.",
    "None of this means the research should stop. The techniques involved may well yield benefits for conservation and medicine. What it does mean is that the public conversation needs to move beyond spectacle. The question is not whether we can make an elephant that looks a little like a mammoth, but whether doing so is the best use of our knowledge, money and attention at a time when so many living species need help now.",
  ],
  questions: [
    tf("ir3-27", "rd:attitude", 70, "The writer believes the science of de-extinction is uninteresting.", "F", "*The science is genuinely fascinating.* (Writer's view → NO)", "YNNG", RD),
    tf("ir3-28", "rd:attitude", 70, "The writer thinks the term 'de-extinction' is somewhat misleading.", "T", "*At best, a generous simplification.*", "YNNG", RD),
    tf("ir3-29", "rd:attitude", 72, "The writer completely rejects the argument about private funding.", "F", "*This is a reasonable point, and I do not dismiss it.*", "YNNG", RD),
    tf("ir3-30", "rd:attitude", 72, "The writer believes revived mammoths would definitely slow permafrost thaw.", "F", "*Intriguing, but it remains largely untested.*", "YNNG", RD),
    tf("ir3-31", "rd:attitude", 72, "The writer thinks governments should ban de-extinction research.", "F", "*None of this means the research should stop.*", "YNNG", RD),
    mcq("ir3-32", "rd:detail", 70, "What would editing an Asian elephant's genome produce, according to the writer?", ["A cold-adapted elephant", "A true mammoth", "A new species of mammoth", "An extinct elephant"], 0, "", undefined, undefined, RD),
    mcq("ir3-33", "rd:inference", 74, "What is the writer's main point in paragraph 3?", ["Funding arguments do not address the long-term needs of revived animals.", "Private investors should fund conservation.", "Genetic diversity is unimportant.", "De-extinction is too expensive to attempt."], 0, "", undefined, undefined, RD),
    mcq("ir3-34", "rd:purpose", 72, "Why does the writer contrast today's tundra with the mammoth steppe?", ["To show that the original habitat no longer exists", "To describe mammoth behaviour", "To argue that the climate has not changed", "To praise Arctic ecosystems"], 0, "", undefined, undefined, RD),
    mcq("ir3-35", "rd:vocab", 72, "The phrase 'moral hazard' in paragraph 5 refers to…", ["the risk that the possibility of revival reduces efforts to prevent extinction", "the danger of animals escaping", "the cost of research", "the ethics of animal testing"], 0, "", undefined, undefined, RD),
    mcq("ir3-36", "rd:attitude", 74, "How would you describe the writer's overall position?", ["Sceptical but not opposed", "Enthusiastic", "Completely opposed", "Indifferent"], 0, "", [null, "Contradicts the critical tone.", "*None of this means the research should stop.*", null], [null, "contradicts", "too-extreme", null], RD),
    ...([
      ["Supporters of de-extinction speak of", 0],
      ["Current techniques can only", 1],
      ["Ecosystems change over time, so", 2],
      ["The public conversation should", 3],
    ] as [string, number][]).map(([stem, a], i) => mcq(`ir3-${37 + i}`, "rd:detail", 72, `Complete the sentence: *${stem}…*`, ["A restoring lost ecosystems.", "B give living animals some traits of extinct ones.", "C a revived species might not fit its former role.", "D look beyond the spectacle to questions of priority.", "E guarantee the survival of threatened species.", "F prove that mammoths can live in the Arctic."], a, "Matching sentence endings: grammar and meaning must both fit the text.", undefined, undefined, RD)),
  ],
};

const sp1: SpeakingTask[] = [
  { id: "is-1", type: "exam", exam: "ielts", title: "Part 1", prompt: "Let's talk about your studies. What are you studying, and why did you choose it?", prepSec: 0, speakSec: 30, lvl: 54, checklist: ["Direct answer with a reason"] },
  { id: "is-2", type: "exam", exam: "ielts", title: "Part 1", prompt: "Do you prefer studying in the morning or in the evening? Why?", prepSec: 0, speakSec: 25, lvl: 52, checklist: ["Direct answer with a reason"] },
  { id: "is-3", type: "exam", exam: "ielts", title: "Part 1", prompt: "How often do you use a dictionary? Has this changed over time?", prepSec: 0, speakSec: 30, lvl: 56, checklist: ["Uses appropriate tenses"] },
  SPEAKING_TASKS.find((t) => t.id === "sp-ielts-p2")!,
  SPEAKING_TASKS.find((t) => t.id === "sp-ielts-p3")!,
];

export const IELTS: ExamSpec = {
  id: "ielts", name: "IELTS Academic", short: "IELTS",
  desc: "Listening (4 partes, 40 preguntas, ~30 min, se escucha una vez), Reading (3 textos, 40 preguntas, 60 min), Writing (Task 1: 150+ palabras, 20 min; Task 2: 250+ palabras, 40 min), Speaking (3 partes, 11–14 min).",
  scale: "Bandas 0–9 por habilidad; la banda total es el promedio redondeado al medio punto más cercano.",
  formatNote: "Formato basado en la descripción pública de IELTS. Material original. La conversión de respuestas correctas a bandas usa tablas aproximadas; Writing y Speaking se estiman automáticamente (con IA si está configurada).",
  sections: [
    {
      id: "listening", name: "Listening", minutes: 32, kind: "receptive", parts: [
        { id: "l1", name: "Part 1 — Conversation (form completion)", instructions: "Write NO MORE THAN TWO WORDS AND/OR A NUMBER. You will hear the recording ONCE.", kind: "listening", listening: [part1], plays: 1 },
        { id: "l2", name: "Part 2 — Monologue", instructions: "Choose the correct answer / complete the notes. You will hear the recording ONCE.", kind: "listening", listening: [part2], plays: 1 },
        { id: "l3", name: "Part 3 — Discussion", instructions: "Choose the correct answer. You will hear the recording ONCE.", kind: "listening", listening: [part3], plays: 1 },
        { id: "l4", name: "Part 4 — Lecture (note completion)", instructions: "Write ONE WORD ONLY for each answer. You will hear the recording ONCE.", kind: "listening", listening: [part4], plays: 1 },
      ],
    },
    {
      id: "reading", name: "Reading", minutes: 60, kind: "receptive", parts: [
        { id: "r1", name: "Passage 1 — The Humble Pencil", instructions: "Questions 1–13.", kind: "reading", reading: R1 },
        { id: "r2", name: "Passage 2 — Cities That Cook", instructions: "Questions 14–26.", kind: "reading", reading: R2 },
        { id: "r3", name: "Passage 3 — Bringing Back the Mammoth?", instructions: "Questions 27–40.", kind: "reading", reading: R3 },
      ],
    },
    {
      id: "writing", name: "Writing", minutes: 60, kind: "writing", parts: [
        { id: "w1", name: "Task 1", instructions: "Spend about 20 minutes. At least 150 words.", kind: "writing", writing: WRITING_TASKS.find((t) => t.id === "w-ielts-t1")! },
        { id: "w2", name: "Task 2", instructions: "Spend about 40 minutes. At least 250 words.", kind: "writing", writing: WRITING_TASKS.find((t) => t.id === "w-ielts-t2")! },
      ],
    },
    { id: "speaking", name: "Speaking", minutes: 14, kind: "speaking", parts: [{ id: "s", name: "Parts 1–3", instructions: "Answer each question in the time given.", kind: "speaking", speaking: sp1 }] },
  ],
};
