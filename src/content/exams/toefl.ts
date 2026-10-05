import type { ExamSpec, ExamPart } from "./types";
import type { ReadingSet, ListeningSet, SpeakingTask, CTestItem } from "../types";
import { mcq, order, ctest } from "../helpers";
import { WRITING_TASKS } from "../writing";

// Genera un C-test: primera oración intacta; luego se elimina la segunda mitad de cada segunda palabra.
export function autoCTest(id: string, lvl: number, intro: string, body: string, gaps = 10): CTestItem {
  let count = 0, k = 0;
  const out = body.replace(/[A-Za-z]+/g, (w) => {
    k++;
    if (count >= gaps || k % 2 === 1 || w.length < 2) return w;
    count++;
    const keep = Math.floor(w.length / 2);
    return `{${w.slice(0, keep)}|${w.slice(keep)}}`;
  });
  return ctest(id, lvl, intro + " " + out, "In a C-test, use grammar (agreement, word class, collocation) and meaning together: the visible letters narrow the options, the context selects the form.");
}

const L = (id: string, title: string, type: ListeningSet["type"], lvl: number, voices: ListeningSet["voices"], lines: [number, string][], questions: any[]): ListeningSet =>
  ({ id, title, type, discipline: "university", lvl, voices, lines: lines.map(([v, t]) => ({ v, t })), questions });

const R = (id: string, title: string, lvl: number, paragraphs: string[], questions: any[], discipline: any = "science"): ReadingSet =>
  ({ id, title, discipline, genre: "expository", lvl, paragraphs, questions });

// ------------------------------------------------------------------ READING
const ct1 = autoCTest("tf-ct1", 58, "Sleep is not simply a period of rest for the brain.", "During sleep, the brain actively processes information gathered during the day. Researchers believe that this activity helps to strengthen important memories and remove less useful connections between neurons. This may explain why students who sleep well after studying often remember more than those who stay awake.");
const ct2 = autoCTest("tf-ct2", 70, "Coral reefs occupy less than one percent of the ocean floor.", "Nevertheless, they support an extraordinary proportion of marine species. Their complex structures provide shelter, breeding grounds and feeding areas for thousands of organisms. However, rising water temperatures can cause corals to expel the algae that supply most of their energy, a process known as bleaching, which often leaves entire reefs vulnerable to disease.");
const ct3 = autoCTest("tf-ct3", 50, "Many cities are planting more trees along their streets.", "Trees provide shade in summer and can lower the temperature of nearby buildings. They also absorb rainwater, which reduces flooding after heavy storms. In addition, people often say that green streets make them feel calmer and more willing to walk.");

const daily1 = R("tf-d1", "Email from the library", 50, [
  "Subject: Your reserved item is ready\n\nHi Ana,\n\nThe book you reserved, *Introduction to Phonetics* (3rd ed.), is now available at the circulation desk. We will hold it for you until 5 p.m. on Friday. If you do not collect it by then, it will be offered to the next person on the waiting list. Please bring your student ID.\n\nMain Library Services",
], [
  mcq("tfd1q1", "rd:purpose", 48, "What is the main purpose of the email?", ["To tell the student that a reserved book can be collected", "To remind the student that a book is overdue", "To ask the student to renew a book", "To announce new library hours"], 0, "The email says the reserved book *is now available*.", undefined, undefined, { skill: "reading" }),
  mcq("tfd1q2", "rd:detail", 50, "What will happen if Ana does not go to the library by Friday at 5 p.m.?", ["Another student may get the book.", "She will have to pay a fine.", "Her student ID will be blocked.", "The library will mail the book."], 0, "*It will be offered to the next person on the waiting list.*", undefined, undefined, { skill: "reading" }),
], "university");

const daily2 = R("tf-d2", "Café notice", 52, [
  "**Riverside Café — Exam Week Hours**\n\nMon–Thu: 7:00 a.m. – midnight\nFri: 7:00 a.m. – 8:00 p.m.\nSat–Sun: closed\n\nStudents who show a library card get a free refill on any hot drink. Quiet zone upstairs: no phone calls, please. Card payments only this week while our cash register is being repaired.",
], [
  mcq("tfd2q1", "rd:detail", 50, "When does the café close on Friday?", ["8:00 p.m.", "Midnight", "7:00 a.m.", "It is closed all day"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("tfd2q2", "rd:detail", 52, "How can a student get a free refill?", ["By showing a library card", "By paying with a card", "By sitting upstairs", "By visiting before 8 a.m."], 0, "", [null, "Card payment is a separate point (word-match trap).", "Unrelated.", "Unrelated."], [null, "word-match", null, null], { skill: "reading" }),
  mcq("tfd2q3", "rd:inference", 54, "What can be inferred about paying with cash this week?", ["It will not be possible.", "It will be cheaper.", "It is only allowed upstairs.", "It requires a library card."], 0, "*Card payments only… while our cash register is being repaired.*", undefined, undefined, { skill: "reading" }),
], "university");

const daily3 = R("tf-d3", "Laboratory access policy", 64, [
  "**Chemistry Building — New Access Policy (effective March 1)**\n\nUndergraduate students may use the teaching laboratories only during scheduled sessions or when a teaching assistant is present. Graduate students may request after-hours access by completing the online safety module and obtaining written approval from their supervisor. Access cards will be reactivated within two working days of approval. Students who prop open fire doors will have their access suspended immediately, regardless of the reason.",
], [
  mcq("tfd3q1", "rd:detail", 62, "What must a graduate student do to work in the lab after hours?", ["Complete a safety module and get written approval from a supervisor", "Ask a teaching assistant to stay", "Attend a scheduled session", "Wait two working days"], 0, "Two conditions are stated.", [null, "That applies to undergraduates.", "That's the undergraduate rule.", "That's the reactivation time, not the requirement."], [null, "wrong-focus", "wrong-focus", "partial"], { skill: "reading" }),
  mcq("tfd3q2", "rd:inference", 66, "What does the policy suggest about propping open fire doors?", ["It is treated as a serious violation with no exceptions.", "It is allowed during scheduled sessions.", "It is acceptable with a supervisor's approval.", "It is only a problem for undergraduates."], 0, "*Suspended immediately, regardless of the reason.*", undefined, undefined, { skill: "reading" }),
  mcq("tfd3q3", "rd:vocab", 64, "The word **reactivated** is closest in meaning to…", ["made to work again", "replaced", "checked", "cancelled"], 0, "", undefined, undefined, { skill: "reading" }),
], "university");

const daily4 = R("tf-d4", "Text messages", 46, [
  "**Mia (2:14 p.m.):** Are we still meeting at 4 to work on the poster?\n**Leo (2:20 p.m.):** Can we make it 4:30? My lab ran late.\n**Mia (2:21 p.m.):** Sure. Same place — the study room on the 2nd floor.",
], [
  mcq("tfd4q1", "rd:detail", 44, "Why does Leo want to change the time?", ["His lab session finished late.", "The study room is busy.", "He forgot about the poster.", "Mia asked him to."], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("tfd4q2", "rd:detail", 46, "Where will they meet?", ["In a study room on the second floor", "In the lab", "At the café", "It is not decided"], 0, "*Same place — the study room on the 2nd floor.*", undefined, undefined, { skill: "reading" }),
], "everyday");

const daily5 = R("tf-d5", "Shuttle notice", 50, [
  "**Campus Shuttle — Route Change**\n\nDue to road construction on Elm Avenue, the Blue Line shuttle will not stop at the Science Library from June 3 to June 28. Passengers should use the temporary stop on Oak Street, a five-minute walk from the library. Departure times are unchanged. The Red Line is not affected.",
], [
  mcq("tfd5q1", "rd:main-idea", 48, "What is the notice mainly about?", ["A temporary change to a shuttle stop", "New shuttle departure times", "The closure of the Science Library", "A new Red Line route"], 0, "", [null, "*Departure times are unchanged.*", "The library isn't closed.", "*The Red Line is not affected.*"], [null, "contradicts", "out-of-scope", "contradicts"], { skill: "reading" }),
  mcq("tfd5q2", "rd:detail", 50, "Why is the change happening?", ["Because of road construction", "Because the library is being renovated", "Because of low passenger numbers", "Because the Red Line was cancelled"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("tfd5q3", "rd:inference", 52, "What can be inferred about passengers going to the Science Library in June?", ["They will need to walk a short distance from Oak Street.", "They will arrive later than usual.", "They must take the Red Line.", "They cannot reach the library."], 0, "", undefined, undefined, { skill: "reading" }),
], "university");

const acadA = R("tf-aA", "Light in the Deep Sea", 60, [
  "Below about 200 metres, sunlight in the ocean fades rapidly, and below 1,000 metres it is effectively absent. Yet the deep sea is not entirely dark. Many organisms produce their own light through bioluminescence, a chemical reaction in which a compound called luciferin is oxidised with the help of an enzyme, releasing energy as light. By one estimate, about three-quarters of the animals observed in some deep-water surveys are capable of producing light.",
  "The functions of this light vary. Some fish use it for camouflage: by emitting a faint glow from their undersides that matches the light coming from above, they avoid casting a silhouette that predators below could detect. Others use light as a lure. The anglerfish, for example, dangles a glowing appendage in front of its mouth to attract prey. Light can also serve as a signal between members of the same species, helping them find mates in a vast and dark environment.",
], [
  mcq("taAq1", "rd:detail", 58, "According to the passage, what is bioluminescence?", ["Light produced by a chemical reaction inside organisms", "Sunlight reflected by deep-sea animals", "Heat released by deep-sea vents", "The absence of light below 1,000 metres"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taAq2", "rd:vocab", 60, "The word **faint** is closest in meaning to…", ["weak", "colourful", "sudden", "warm"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taAq3", "rd:inference", 64, "Why does a glow on a fish's underside help it avoid predators below?", ["It hides the dark shape the fish would otherwise create against the light above.", "It frightens the predators.", "It makes the fish look larger.", "It attracts other fish to protect it."], 0, "Counter-illumination removes the silhouette.", undefined, undefined, { skill: "reading" }),
  mcq("taAq4", "rd:purpose", 62, "Why does the author mention the anglerfish?", ["To give an example of light used to attract prey", "To show that most fish are predators", "To describe camouflage", "To explain how luciferin works"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taAq5", "rd:organization", 62, "How is the second paragraph organised?", ["It lists several functions of bioluminescence with examples.", "It compares two theories.", "It describes a process step by step.", "It argues against an earlier claim."], 0, "", undefined, undefined, { skill: "reading" }),
], "biology");

const acadB = R("tf-aB", "The Little Ice Age", 70, [
  "Between roughly the fourteenth and nineteenth centuries, many parts of the Northern Hemisphere experienced a period of relatively cool conditions often called the Little Ice Age. Glaciers in the Alps advanced, some rivers that rarely freeze today froze regularly, and in several regions harvests failed more often than in preceding centuries. The term can be misleading, however: the cooling was modest compared with true ice ages, and it was neither uniform nor continuous across the globe.",
  "Scientists have proposed several causes, which probably acted in combination. A series of large volcanic eruptions injected particles into the upper atmosphere that reflected sunlight back into space. Solar activity also appears to have been unusually low during part of the period, notably between about 1645 and 1715. Some researchers have additionally pointed to changes in ocean circulation, which may have amplified cooling in particular regions. Disentangling these factors remains difficult, partly because reliable instrumental temperature records begin only towards the end of the period.",
], [
  mcq("taBq1", "rd:main-idea", 68, "What is the passage mainly about?", ["The characteristics and possible causes of a historical cool period", "Why glaciers advance", "The history of temperature measurement", "The effect of volcanoes on agriculture"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taBq2", "rd:attitude", 72, "Why does the author say that the term 'Little Ice Age' 'can be misleading'?", ["Because the cooling was modest and not uniform", "Because it lasted longer than an ice age", "Because there was no cooling at all", "Because it occurred only in the Alps"], 0, "", [null, null, "Too extreme / contradicts.", "Overgeneralised from an example."], [null, null, "contradicts", "too-specific"], { skill: "reading" }),
  mcq("taBq3", "rd:detail", 70, "Which is NOT mentioned as a possible cause?", ["Increased greenhouse gases", "Volcanic eruptions", "Low solar activity", "Changes in ocean circulation"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taBq4", "rd:inference", 74, "What does the author imply by saying the causes 'probably acted in combination'?", ["No single factor is likely to explain the period fully.", "Volcanoes were the main cause.", "The causes are completely unknown.", "Scientists agree on one explanation."], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taBq5", "rd:causal", 74, "Why is it difficult to separate the different factors?", ["Reliable instrument records start only near the end of the period.", "The eruptions were too small to measure.", "Solar activity cannot be studied.", "Ocean circulation never changes."], 0, "", undefined, undefined, { skill: "reading" }),
], "geology");

const acadC = R("tf-aC", "Does Language Shape Thought?", 74, [
  "The idea that the language we speak influences the way we think is often associated with the linguists Edward Sapir and Benjamin Lee Whorf. In its strongest form — that language determines thought, so that speakers cannot conceive of distinctions their language does not encode — the hypothesis has been widely rejected. Speakers of all languages can learn new concepts and describe them, if sometimes at greater length.",
  "Weaker versions, however, have found experimental support. Russian, for instance, has separate basic terms for lighter and darker blues, and in one study Russian speakers were faster than English speakers at distinguishing shades that crossed this boundary. Speakers of some languages that describe space using cardinal directions rather than 'left' and 'right' have been shown to keep track of their orientation with remarkable accuracy. Such findings suggest not that language imprisons thought, but that habitual ways of speaking may make certain distinctions easier or more automatic.",
], [
  mcq("taCq1", "rd:main-idea", 72, "What is the main point of the passage?", ["The strong form of the hypothesis is rejected, but weaker forms have some support.", "Language determines thought.", "Russian speakers see more colours.", "Sapir and Whorf were wrong about everything."], 0, "", [null, "That's the rejected strong form.", "Overgeneralises the colour study.", "Too extreme."], [null, "contradicts", "over-inference", "too-extreme"], { skill: "reading" }),
  mcq("taCq2", "rd:detail", 70, "Why does the author mention speakers' ability to learn new concepts?", ["As evidence against the strong form of the hypothesis", "To support the strong form", "To describe the Russian study", "To explain cardinal directions"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taCq3", "rd:inference", 76, "What does the Russian study show?", ["A lexical distinction can speed up perceptual discrimination.", "Russians cannot see some colours.", "English has no words for blue.", "Language has no effect on perception."], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taCq4", "rd:vocab", 74, "The word **habitual** is closest in meaning to…", ["regular and customary", "unusual", "deliberate", "formal"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taCq5", "rd:attitude", 76, "Which phrase best captures the author's conclusion?", ["Language may make certain distinctions easier, not impossible to escape.", "Language imprisons thought.", "Experiments on language are unreliable.", "Only cardinal directions matter."], 0, "", undefined, undefined, { skill: "reading" }),
], "linguistics");

const acadD = R("tf-aD", "The Language of Bees", 52, [
  "Honeybees that find a good source of food return to the hive and perform a 'waggle dance' that tells other bees where to go. The bee moves forward while shaking its body from side to side, then circles back and repeats the movement. The angle of the forward run relative to vertical shows the direction of the food relative to the sun. The length of the waggle run indicates how far away the food is.",
  "The Austrian scientist Karl von Frisch spent decades studying this behaviour, and in 1973 he shared the Nobel Prize in Physiology or Medicine for his work on animal behaviour. His research showed that insects, often considered simple, can communicate surprisingly precise information.",
], [
  mcq("taDq1", "rd:detail", 50, "What does the length of the waggle run show?", ["The distance to the food", "The direction of the sun", "The quality of the food", "The number of bees needed"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taDq2", "rd:detail", 50, "What does the angle of the forward run show?", ["The direction of the food relative to the sun", "The distance to the food", "The time of day", "The size of the hive"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taDq3", "rd:purpose", 52, "Why does the author mention the Nobel Prize?", ["To show the importance of von Frisch's research", "To explain the dance", "To compare bees and humans", "To describe Austria"], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taDq4", "rd:inference", 54, "What does the final sentence suggest?", ["Insects may be more sophisticated than people assume.", "Bees are smarter than humans.", "All insects dance.", "Von Frisch studied only bees."], 0, "", undefined, undefined, { skill: "reading" }),
  mcq("taDq5", "rd:vocab", 52, "The word **precise** is closest in meaning to…", ["exact", "simple", "fast", "secret"], 0, "", undefined, undefined, { skill: "reading" }),
], "biology");

const RP = (id: string, name: string, r: ReadingSet | null, items?: any[]): ExamPart => r
  ? { id, name, instructions: name.startsWith("Read in Daily Life") ? "Read the text and answer the questions." : "Read the passage and answer the questions.", kind: "reading", reading: r }
  : { id, name, instructions: "Fill in the missing letters to complete the text.", kind: "items", items };

// ------------------------------------------------------------------ LISTENING
const US1 = { name: "Speaker", accent: "en-US" as const, gender: "f" as const };
const responses: [string, string[], number][] = [
  ["Do you know if the career center is open on Saturdays?", ["I think it's closed on weekends, but you could check online.", "Yes, I'm a career student.", "It opens the door.", "On Saturday I went shopping."], 0],
  ["I can't believe I left my laptop charger at home again.", ["You can borrow mine — I'm not using it right now.", "Your home is very nice.", "The laptop was expensive.", "I charge it every week."], 0],
  ["Professor Lee said the deadline has been extended.", ["Really? Until when?", "She is very tall.", "I extended my visa.", "The deadline was the line."], 0],
  ["Would you mind closing the window? It's getting cold.", ["Not at all.", "Yes, I'm cold too, so no.", "The window is glass.", "I mind my business."], 0],
  ["How did the presentation go?", ["Better than I expected, actually.", "It went by bus.", "I'll present it tomorrow.", "Presentations are important."], 0],
  ["Are you taking statistics this semester or next?", ["Next — this semester is already full.", "Statistics are numbers.", "I took the bus.", "Yes, I am."], 0],
  ["I'm thinking of switching my major to linguistics.", ["What made you decide that?", "Linguistics is a major.", "I switched the light off.", "My major is tall."], 0],
  ["Didn't you say you'd already submitted the form?", ["I thought I had, but it didn't go through.", "Yes, I said it.", "The form is long.", "Submit it, please."], 0],
];
const respSets: ListeningSet[] = responses.map(([line, opts, ans], i) => L(`tl-r${i + 1}`, `Choose a Response ${i + 1}`, "short", 54, [US1], [[0, line]], [
  mcq(`tlr${i + 1}`, "ls:response", 52 + i, "Choose the best response.", opts, ans, "The best response fits both the meaning and the social function of the statement (request, complaint, news, question).", undefined, [null, "word-match", "word-match", "wrong-focus"], { skill: "listening" }),
]));

const conv1 = L("tl-c1", "Conversation: Housing office", "conversation", 58, [{ name: "Student", accent: "en-US", gender: "m" }, { name: "Officer", accent: "en-GB", gender: "f" }], [
  [0, "Hi, I'd like to ask about changing rooms. My building is right next to the stadium, and the noise on game nights makes it impossible to study."],
  [1, "I see. Room changes are possible, but there's a waiting list until the second week of the semester. After that, we can usually offer something within a few days."],
  [0, "Okay. Is there anything I can do in the meantime?"],
  [1, "The quiet study rooms in the library are open until two in the morning during the week. And on game nights, you're welcome to use the lounge in North Hall — it's on the other side of campus."],
], [
  mcq("tlc1q1", "ls:purpose", 56, "Why does the student go to the housing office?", ["He wants to move because his room is too noisy.", "He wants a room near the stadium.", "He lost his room key.", "He wants a job at the library."], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tlc1q2", "ls:inference", 60, "What does the officer suggest?", ["Studying elsewhere until a room change is possible", "Moving immediately", "Complaining to the stadium", "Waiting until next year"], 0, "", undefined, undefined, { skill: "listening" }),
]);
const conv2 = L("tl-c2", "Conversation: Group project", "conversation", 62, [{ name: "Ines", accent: "en-AU", gender: "f" }, { name: "Raj", accent: "en-IN", gender: "m" }], [
  [0, "Raj, have you heard from Tom? He was supposed to send the data analysis yesterday."],
  [1, "Nothing. I emailed him twice. Honestly, I'm starting to think we should just divide his part between us."],
  [0, "I'd rather talk to him first. Maybe something's happened. If we don't hear back by tonight, we can tell the professor and split it."],
  [1, "Fair enough. I'll message him on the group chat too — he checks that more than email."],
], [
  mcq("tlc2q1", "ls:gist", 60, "What problem are the students discussing?", ["A group member has not delivered his part of the work.", "The professor changed the deadline.", "They disagree about the topic.", "Their data are incorrect."], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tlc2q2", "ls:attitude", 64, "What is Ines's attitude towards Tom?", ["She wants to give him a chance before acting.", "She is angry and wants to report him immediately.", "She doesn't care.", "She thinks he has already finished."], 0, "*I'd rather talk to him first. Maybe something's happened.*", undefined, undefined, { skill: "listening" }),
]);
const ann1 = L("tl-a1", "Announcement: Geology field trip", "announcement", 56, [{ name: "Instructor", accent: "en-US", gender: "m" }], [
  [0, "Quick announcement about Saturday's field trip. Because of the forecast, we're moving it to Sunday — same time, eight a.m., same meeting point outside the Earth Sciences building. Please bring water and sturdy shoes; the trail will be muddy. If you can't make Sunday, email me by Thursday and I'll give you an alternative assignment."],
], [
  mcq("tla1q1", "ls:detail", 54, "Why has the field trip been changed?", ["Because of the weather forecast", "Because the instructor is busy", "Because the trail is closed", "Because of a meeting"], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tla1q2", "ls:detail", 56, "What should students do if they cannot go on Sunday?", ["Email the instructor by Thursday", "Go on Saturday instead", "Meet outside the building", "Bring water"], 0, "", undefined, undefined, { skill: "listening" }),
]);
const ann2 = L("tl-a2", "Announcement: Guest lecture", "announcement", 60, [{ name: "Coordinator", accent: "en-GB", gender: "f" }], [
  [0, "Good morning, everyone. A reminder that this Thursday's guest lecture on climate migration has been moved from Room 101 to the main auditorium, as registrations exceeded the room's capacity. The talk starts at five, but doors open at four-thirty, and seats are not reserved. Recordings won't be available afterwards, at the speaker's request."],
], [
  mcq("tla2q1", "ls:causal", 58, "Why has the lecture been moved?", ["More people registered than the room could hold.", "The speaker requested a bigger room for recording.", "Room 101 is being renovated.", "The time changed."], 0, "", [null, "Recording is mentioned separately (and won't happen).", "Not mentioned.", "The time hasn't changed."], [null, "word-match", "out-of-scope", "contradicts"], { skill: "listening" }),
  mcq("tla2q2", "ls:inference", 62, "What can be inferred from the announcement?", ["Students who want a seat should arrive early.", "The lecture will be online.", "Seats must be booked in advance.", "The talk will start at 4:30."], 0, "Unreserved seats + large demand.", undefined, undefined, { skill: "listening" }),
]);
const talk1 = L("tl-t1", "Academic Talk: Chiaroscuro", "lecture", 64, [{ name: "Professor", accent: "en-GB", gender: "m" }], [
  [0, "Today we're looking at chiaroscuro — from the Italian for 'light-dark'. It refers to strong contrasts between light and shadow used to model three-dimensional forms on a flat surface. Renaissance painters had used shading for this purpose, but around 1600 Caravaggio pushed it to an extreme."],
  [0, "In many of his paintings, figures emerge from almost total darkness, lit by a single, sharp light source. Art historians sometimes call this tenebrism. The effect is dramatic, even theatrical: it directs the viewer's attention to particular gestures or faces and leaves the rest in shadow."],
  [0, "Why does this matter? Partly because the style spread remarkably quickly. Painters across Europe — in Spain, in the Netherlands — adopted versions of it within a generation. So when you see a dark background and a raking light in a seventeenth-century painting, it's worth asking whether you're looking at Caravaggio's influence."],
], [
  mcq("tlt1q1", "ls:gist", 62, "What is the talk mainly about?", ["A painting technique based on strong light–dark contrast and its influence", "Caravaggio's biography", "Italian vocabulary", "Renaissance architecture"], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tlt1q2", "ls:detail", 62, "What is tenebrism, according to the professor?", ["An extreme form of chiaroscuro with figures emerging from darkness", "A type of Renaissance shading", "A way of painting landscapes", "A Dutch school of painting"], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tlt1q3", "ls:purpose", 66, "Why does the professor mention Spain and the Netherlands?", ["To show how quickly the style spread", "To compare their art with Italian art", "To list places Caravaggio lived", "To explain the origin of the word"], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tlt1q4", "ls:inference", 68, "What does the professor suggest students do when they see a dark background in a 17th-century painting?", ["Consider whether it reflects Caravaggio's influence", "Assume it was painted by Caravaggio", "Ignore the lighting", "Look for Renaissance shading"], 0, "", [null, "Too strong: he says *ask whether*.", null, null], [null, "too-extreme", null, null], { skill: "listening" }),
]);
const talk2 = L("tl-t2", "Academic Talk: Body Clocks", "lecture", 66, [{ name: "Lecturer", accent: "en-US", gender: "f" }], [
  [0, "Almost every cell in your body runs on a roughly twenty-four-hour cycle — a circadian rhythm. These internal clocks keep running even without external cues, but they drift slightly, so they need to be reset every day. The most powerful reset signal is light, especially in the morning."],
  [0, "Here's the interesting part. Light in the evening has the opposite effect: it tends to push the clock later. So bright screens late at night can make it harder to fall asleep at your usual time — not because of the content you're watching, but because of the light itself."],
  [0, "This is also why travelling east, across several time zones, is usually harder than travelling west. Going east, you need to shift your clock earlier, and our internal clocks find it easier to stretch the day than to shorten it."],
], [
  mcq("tlt2q1", "ls:detail", 64, "What is the strongest signal for resetting circadian rhythms?", ["Light", "Food", "Exercise", "Temperature"], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tlt2q2", "ls:causal", 66, "According to the lecturer, why can screens at night make it harder to sleep?", ["Their light shifts the body clock later.", "The content is too exciting.", "They make noise.", "They reset the clock earlier."], 0, "*Not because of the content… but because of the light itself.*", [null, "Explicitly rejected.", null, "Reversed."], [null, "contradicts", null, "reversed"], { skill: "listening" }),
  mcq("tlt2q3", "ls:inference", 70, "Why is travelling east usually harder?", ["It requires shortening the day, which the body clock adapts to less easily.", "Flights east are longer.", "There is less light in the east.", "The clock stops working."], 0, "", undefined, undefined, { skill: "listening" }),
  mcq("tlt2q4", "ls:organization", 66, "How does the lecturer organise the talk?", ["She explains a mechanism and then applies it to everyday situations.", "She compares two competing theories.", "She tells a personal story.", "She lists research methods."], 0, "", undefined, undefined, { skill: "listening" }),
]);

const LP = (id: string, name: string, sets: ListeningSet[]): ExamPart => ({ id, name, instructions: "Listen and answer. You will hear the audio only once.", kind: "listening", listening: sets, plays: 1 });

// ------------------------------------------------------------------ WRITING
const B = (id: string, lead: string, tokens: string[], lvl: number, fixed?: string, end = ".") => order(id, "gram:word-order", lvl, lead, tokens, "Build a grammatical reply: check subject–verb order, auxiliary placement, and where adverbials and prepositional phrases go.", { fixed, end, skill: "writing" });
const build = [
  B("tw-b1", "Did you finish the reading for tomorrow?", ["haven't had", "time", "to look at it", "yet"], 50, "I"),
  B("tw-b2", "Where should we meet before the exam?", ["meet", "outside", "the main entrance", "at nine"], 50, "Let's"),
  B("tw-b3", "Why was the seminar cancelled?", ["the professor", "had to", "attend", "a conference"], 54, "Because"),
  B("tw-b4", "Can you help me with the statistics assignment?", ["be happy", "to go over it", "with you", "after class"], 56, "I'd"),
  B("tw-b5", "What did the advisor say about your proposal?", ["suggested", "that I", "narrow down", "my research question"], 58, "She"),
  B("tw-b6", "Do you know when the library closes?", ["sure", "whether", "it closes", "at ten or eleven"], 62, "I'm not", "."),
  B("tw-b7", "Have you decided which course to take?", ["haven't", "made up", "my mind", "yet"], 58, "I"),
  B("tw-b8", "Is the new lab open to undergraduates?", ["only", "graduate students", "are allowed", "to use it"], 62, "No,"),
  B("tw-b9", "How was the field trip?", ["was", "more interesting", "than", "I had expected"], 64, "It"),
  B("tw-b10", "Why didn't you submit the essay online?", ["the system", "wouldn't let", "me", "upload the file"], 66, "Because"),
];

// ------------------------------------------------------------------ SPEAKING
const repeatSentences = [
  "Welcome to the university library.",
  "The front desk is on your left as you enter.",
  "You can borrow up to ten books at a time.",
  "Laptops are available for loan with a valid student card.",
  "Quiet study rooms on the third floor must be reserved in advance.",
  "If you need help finding sources, ask a librarian at the research help desk.",
  "During exam weeks, the building stays open until two in the morning from Monday to Thursday.",
];
const repeatTasks: SpeakingTask[] = repeatSentences.map((s, i) => ({ id: `ts-r${i + 1}`, type: "repeat", title: `Listen and Repeat ${i + 1}/7`, prompt: "Listen and repeat exactly.", target: s, prepSec: 0, speakSec: 8 + Math.floor(i / 2) * 2, lvl: 48 + i * 4, checklist: [], exam: "toefl" }));
const interviewQs = [
  "To start, could you tell me which technologies you use most for studying, and how?",
  "Think about a time when technology helped you learn something difficult. What happened?",
  "Some people believe that students learn better from printed books than from screens. What is your opinion?",
  "Should universities require students to take at least one course entirely online? Why or why not?",
];
const interviewTasks: SpeakingTask[] = interviewQs.map((q, i) => ({ id: `ts-i${i + 1}`, type: "interview", title: `Take an Interview ${i + 1}/4`, prompt: q, prepSec: 0, speakSec: 45, lvl: 54 + i * 4, checklist: ["Answered directly", "Gave a reason or example", "Spoke fluently for most of the time"], exam: "toefl" }));

export const TOEFL: ExamSpec = {
  id: "toefl", name: "TOEFL iBT (formato 2026)", short: "TOEFL",
  desc: "Formato actualizado desde el 21 de enero de 2026: Reading y Listening multietapa adaptativos, tareas breves, escala 1–6.",
  scale: "Bandas 1–6 por sección; total = promedio redondeado al 0.5 más cercano.",
  formatNote: "Basado en la descripción pública de ETS: Reading ≈30 min (Complete the Words, Read in Daily Life, Read an Academic Passage), Listening ≈29 min, Writing ≈23 min (Build a Sentence, Write an Email 7 min, Academic Discussion 10 min), Speaking ≈8 min (Listen and Repeat ×7, Take an Interview ×4, 45 s). Esta simulación usa material original; Reading es adaptativo en dos etapas; Listening es lineal. El número de ítems es algo menor que el oficial.",
  sections: [
    {
      id: "reading", name: "Reading", minutes: 30, kind: "receptive", parts: [],
      adaptive: {
        threshold: 0.7,
        router: [RP("r1", "Complete the Words", null, [ct1]), RP("r2", "Read in Daily Life 1", daily1), RP("r3", "Read in Daily Life 2", daily2), RP("r4", "Read an Academic Passage", acadA)],
        upper: [RP("r5", "Complete the Words", null, [ct2]), RP("r6", "Read in Daily Life", daily3), RP("r7", "Read an Academic Passage", acadB), RP("r8", "Read an Academic Passage", acadC)],
        lower: [RP("r5b", "Complete the Words", null, [ct3]), RP("r6b", "Read in Daily Life", daily4), RP("r7b", "Read in Daily Life", daily5), RP("r8b", "Read an Academic Passage", acadD)],
      },
    },
    {
      id: "listening", name: "Listening", minutes: 29, kind: "receptive", parts: [
        LP("l1", "Listen and Choose a Response", respSets),
        LP("l2", "Listen to a Conversation", [conv1, conv2]),
        LP("l3", "Listen to an Announcement", [ann1, ann2]),
        LP("l4", "Listen to an Academic Talk", [talk1, talk2]),
      ],
    },
    {
      id: "writing", name: "Writing", minutes: 23, kind: "writing", parts: [
        { id: "w1", name: "Build a Sentence", instructions: "Move the words and phrases to form a grammatical reply.", kind: "items", items: build },
        { id: "w2", name: "Write an Email", instructions: "You have 7 minutes.", kind: "writing", writing: WRITING_TASKS.find((t) => t.id === "w-toefl-email")! },
        { id: "w3", name: "Write for an Academic Discussion", instructions: "You have 10 minutes.", kind: "writing", writing: WRITING_TASKS.find((t) => t.id === "w-toefl-disc")! },
      ],
    },
    {
      id: "speaking", name: "Speaking", minutes: 8, kind: "speaking", parts: [
        { id: "s1", name: "Listen and Repeat", instructions: "Scenario: a library orientation. Repeat each sentence exactly.", kind: "speaking", speaking: repeatTasks },
        { id: "s2", name: "Take an Interview", instructions: "Topic: technology and learning. 45 seconds per answer, no preparation time.", kind: "speaking", speaking: interviewTasks },
      ],
    },
  ],
};
