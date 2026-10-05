import type { Lesson } from "./types";
import { mcq, judge } from "./helpers";

export const STRATEGY: Lesson[] = [
  {
    id: "s-distractors", module: "strategy", title: "Anatomy of a distractor", tag: "strat:distractors", lvl: 56, icon: "🪤",
    summary: "Wrong options are designed, not random. Learn the families and you'll see them coming.",
    body: `Test writers build wrong options ('distractors') from predictable templates:

- **True but not stated**: correct in the real world, absent from the text.
- **Word match**: repeats words from the text but changes the meaning.
- **Too extreme**: *always, never, all, only, completely* when the text is hedged.
- **Reversed**: swaps cause and effect, or who did what.
- **Partial**: true for one part of the question only.
- **Wrong focus**: a true detail that doesn't answer *this* question.
- **Over-inference**: goes further than the evidence allows.
- **Out of scope**: the text's topic, but not its claim.

#### The habit
For every option, ask: **"Where exactly does the text say this?"** If you can't point to a sentence, it's suspect — especially if it sounds smart.`,
    items: [
      mcq("sd1", "strat:distractors", 56, "Text: *Some researchers have suggested that bilingualism may delay the onset of dementia symptoms.*\nQuestion: What does the text say about bilingualism?\nOption: **Bilingualism prevents dementia.**\nWhy is this option wrong?", ["Too extreme / overstated", "Out of scope", "Word match", "Partial"], 0,
        "The text is doubly hedged (*some researchers*, *suggested*, *may delay*); the option turns *delay symptoms* into *prevents dementia*.", undefined, undefined, { tests: "meaning" }),
      mcq("sd2", "strat:distractors", 58, "Text: *Rainfall increased after the forest was replanted.*\nOption: **Increased rainfall led to the replanting of the forest.**\nWhy is it wrong?", ["Reversed relationship", "True but not stated", "Too general", "Correct"], 0, "The text gives a sequence (replanting → rainfall); the option reverses the direction."),
      mcq("sd3", "strat:distractors", 60, "Text: *The museum's collection of Mayan ceramics, the largest in Europe, attracts scholars from many countries.*\nQuestion: Why do scholars visit the museum?\nOption: **Because Europe has many museums.**\nWhy is it wrong?", ["Word match / out of scope", "Reversed", "Partial", "Too extreme"], 0, "It reuses *Europe* and *museum* but answers something the text never says."),
      mcq("sd4", "strat:distractors", 62, "Text: *Although the treatment reduced symptoms, it had no measurable effect on long-term recovery.*\nQuestion: What was the effect of the treatment?\nOption: **It reduced symptoms.**\nWhy might this be a trap?", ["Partial: true, but ignores the main point (no effect on recovery)", "Contradicts the text", "Too extreme", "Not a trap: it's the full answer"], 0,
        "It's true, but the sentence's **main clause** (the point the writer emphasises) is the lack of long-term effect. If another option captures both, it's better."),
      mcq("sd5", "strat:distractors", 64, "Text: *Many villagers moved to the city in search of work.*\nQuestion: What can be inferred?\nOption: **The village economy offered limited employment.**\nIs this a valid inference?", ["Yes — it follows directly from 'in search of work'", "No — it's out of scope", "No — it's too extreme", "No — it contradicts the text"], 0,
        "A valid inference is a **small, necessary step** from the text: people leaving to find work implies limited work at home."),
      mcq("sd6", "strat:distractors", 64, "Text: *Many villagers moved to the city in search of work.*\nOption: **The village will soon be abandoned.**\nWhat's wrong?", ["Over-inference / speculation", "Reversed", "Partial", "Nothing — it's a valid inference"], 0, "A prediction about the future goes far beyond the evidence: that's speculation, not inference."),
    ],
  },
  {
    id: "s-possible", module: "strategy", title: "Possible ≠ correct (the linguist's trap)", tag: "strat:possible-vs-correct", lvl: 62, icon: "🧠",
    summary: "Linguists can imagine a context where almost anything works. Exams ask what works HERE, in the standard variety.",
    body: `Your training as a linguist is an advantage — and a trap. You know that *almost any form is possible in some variety, register or context*. Exams don't ask that.

#### The exam's question is always narrower
- **Standard written variety** (unless stated otherwise).
- **This sentence**, with **this context** — no invented scenarios.
- The **most** appropriate option, not the only conceivable one.

#### Self-check before changing an answer
1. Am I imagining a context that isn't in the text? → stop.
2. Am I defending an option with "in some dialects / in speech…"? → that's descriptive linguistics, not the exam's norm.
3. Is the item testing **grammar** (form) or **meaning** (sense, logic)? Use the right criterion.

The goal isn't to stop thinking — it's to **think with the right criterion**.`,
    examples: [
      { t: "‘If I would have known…’ — attested in some American varieties. Exam answer: wrong.", k: "meh" },
      { t: "‘Neither of them are…’ — common in speech. Formal written norm: is.", k: "meh" },
    ],
    items: [
      mcq("sp1", "strat:possible-vs-correct", 60, "Item: *The committee, ___ members were all senior academics, rejected the proposal.* Options: whose / who's / which / that. You think *which* could work 'if we reinterpret the sentence'. What should you do?", [
        "Choose 'whose': it's the only option that fits the sentence as written.",
        "Choose 'which': linguistically, any form is possible in some context.",
        "Skip it: it's ambiguous.",
        "Choose 'that' because it's the most frequent relative."], 0, "Answer the sentence **as written**. *Whose members* is the only grammatical option; reinterpreting the sentence is overthinking."),
      mcq("sp2", "strat:possible-vs-correct", 62, "Which strategy best prevents 'possible-not-correct' errors?", [
        "Imagine every context in which each option could work.",
        "Find the specific clue in the sentence (word after the gap, tense, collocation) that rules options out.",
        "Always choose the most formal option.",
        "Change your answer whenever you feel doubt."], 1, "Look for **positive evidence** in the item. Imagining contexts expands the possible; clues narrow it to the correct."),
      judge("sp3", "strat:possible-vs-correct", 58, "Data is often misinterpreted by journalists.", true, true,
        "Both *data is* and *data are* are accepted in contemporary standard English (the singular mass use is very common). In an exam, don't 'correct' this unless the item clearly tests the plural form.", undefined, "General academic prose"),
    ],
  },
  {
    id: "s-gramvsmeaning", module: "strategy", title: "Is it testing grammar or meaning?", tag: "strat:grammar-vs-meaning", lvl: 60, icon: "🔬",
    summary: "Identify the target of the item in 3 seconds and you'll use the right criterion.",
    body: `#### Signals that the item tests **grammar**
- Options are different **forms of the same word** (*receive / receiving / received*).
- Options differ in **function words** (*despite / although / however*).
- The word **after the gap** constrains the form (*to* + -ing, *enough* + noun).

#### Signals that it tests **meaning / collocation**
- Options are **different words** of the same category (*fierce / hard / steep*).
- All options are grammatical → the criterion is **meaning, logic or collocation**.

#### Signals that it tests **logic**
- Connectors (*therefore / however / similarly*) → check the **relation** between ideas.

Once you know the target, ignore everything else.`,
    items: [
      mcq("sg1", "strat:grammar-vs-meaning", 58, "Options: *although / despite / however / whereas* for the gap in “___ the small sample, the result was robust.” What is mainly being tested?", ["Grammar: the gap is followed by a noun phrase, so a preposition is needed", "Meaning only", "Collocation", "Spelling"], 0, "Three options express concession: the decision is **grammatical** (*despite* + NP)."),
      mcq("sg2", "strat:grammar-vs-meaning", 60, "Options: *fierce / steep / hard / thick* for “The proposal met with ___ opposition.” What is mainly being tested?", ["Collocation", "Grammar", "Tense", "Punctuation"], 0, "All are adjectives, all grammatical: the criterion is **collocation**."),
      mcq("sg3", "strat:grammar-vs-meaning", 62, "Options: *therefore / moreover / in contrast / similarly* in “Older speakers retained it. ___, younger speakers lost it.” What is tested?", ["The logical relation between sentences", "Grammar", "Register", "Collocation"], 0, "All are sentence adverbs: the test is the **logical relation** (here, contrast)."),
    ],
  },
  {
    id: "s-inference", module: "strategy", title: "Inference vs. speculation", tag: "strat:inference-vs-speculation", lvl: 64, icon: "🕵️",
    summary: "An exam inference is a short, necessary step from the text — not a creative theory.",
    body: `In reading and listening exams, an **inference** is something that **must be true** (or is very strongly implied) given the text, even if it's not stated word for word.

| Inference ✓ | Speculation ✗ |
|---|---|
| Follows from one or two sentences | Requires extra assumptions |
| Close to the text's wording | Adds new ideas, predictions, motives |
| Would be accepted by most readers | Only works with 'imagine that…' |

#### Test
Cover the option. Ask: *What does the text force me to conclude?* Then look for the option closest to that.`,
    items: [
      mcq("si1", "strat:inference-vs-speculation", 64, "Text: *Despite repeated invitations, the professor did not attend the conference, which was held in her own city.*\nWhich is a valid inference?", [
        "She chose not to attend, since distance was not an obstacle.",
        "She dislikes conferences in general.",
        "She was ill.",
        "The conference was poorly organised."], 0, "*Her own city* + *repeated invitations* rule out distance and lack of invitation, so not attending was likely a choice. The others add unsupported motives.", [null, "Overgeneralises from one event.", "No evidence.", "No evidence."], [null, "over-inference", "over-inference", "out-of-scope"]),
      mcq("si2", "strat:inference-vs-speculation", 66, "Text: *The second edition of the dictionary added 4,000 entries, most of them loanwords from Spanish.*\nWhat can be inferred?", [
        "The first edition contained fewer entries than the second.",
        "The language will soon disappear.",
        "The editors preferred Spanish.",
        "Loanwords are bad for languages."], 0, "Adding entries necessarily means the first edition was smaller. The rest are speculation or evaluation."),
    ],
  },
  {
    id: "s-overthinking", module: "strategy", title: "Overthinking and answer changing", tag: "strat:overthinking", lvl: 60, icon: "🌀",
    summary: "What research actually says about changing answers — and how to change them well.",
    body: `#### The evidence (honestly)
Studies on answer changing (e.g., Kruger, Wirtz & Miller, 2005) found that **most** answer changes on multiple-choice tests go from wrong to right, yet people *remember* the painful right-to-wrong changes more — the "first instinct fallacy". So "never change your answer" is **bad advice in general**.

**But you are not the average test-taker.** This app tracks *your* changes:
- **C→W** (correct to wrong): harmful changes
- **W→C** (wrong to correct): helpful changes
Check your ratio in the dashboard. If your C→W changes are frequent, your problem is specific: you change answers based on *doubt* rather than *evidence*.

#### Rule for changing
Change **only** when you can name the evidence: a word in the text, a grammatical constraint, a collocation. *"B also sounds possible"* is not evidence.

#### Time-boxing
If you've spent 2× the average time on an item, mark it, choose your best answer, move on. Come back only if time remains.`,
    items: [
      mcq("so1", "strat:overthinking", 60, "Which reason is a **good** reason to change an answer?", [
        "I re-read the paragraph and found a sentence that contradicts my first choice.",
        "Option C also sounds possible.",
        "I've chosen B too many times in a row.",
        "The first answer felt too easy."], 0, "Change on **evidence**, not on doubt, patterns or difficulty feelings."),
      mcq("so2", "strat:overthinking", 62, "According to research on answer-changing, which is true?", [
        "Changes are, on average, more often from wrong to right than from right to wrong.",
        "You should never change your first answer.",
        "First instincts are always correct.",
        "Changing answers is always harmful."], 0, "The 'first instinct' belief is largely a memory bias. What matters is **why** you change — which is what the app tracks for you."),
    ],
  },
  {
    id: "s-timing", module: "strategy", title: "Timing: when to move on", tag: "strat:timing", lvl: 58, icon: "⏱️",
    summary: "Budget time per item, triage, and never leave blanks.",
    body: `#### Budgets (approximate)
- Cambridge Reading & Use of English: ~90 min for 7–8 parts → plan **minutes per part** (e.g., C1: Parts 1–4 ≈ 25 min; Parts 5–8 ≈ 65 min).
- IELTS Reading: 60 min, 3 passages → **≈ 20 min per passage**, and the third is usually hardest.
- TOEFL iBT (2026 format): short timed tasks — the clock is per task or section; don't over-invest in one item.

#### Triage
1. First pass: answer what you know; mark doubtful items.
2. Never leave a blank: there's **no negative marking** in these exams.
3. Second pass: marked items, in order of 'closest to solved'.

#### The 2× rule
If an item takes twice your average, choose your best answer, flag it, move on.`,
    items: [
      mcq("st1x", "strat:timing", 58, "You have 3 minutes left and 5 unanswered multiple-choice questions. Best move?", ["Answer all five quickly (no negative marking)", "Spend the time perfecting one", "Leave them blank", "Re-check earlier answers"], 0, "No negative marking → every blank is a guaranteed zero; a guess has a 25% chance."),
      mcq("st2x", "strat:timing", 60, "In IELTS Academic Reading, a sensible plan is…", ["About 20 minutes per passage, slightly less for passage 1", "40 minutes on passage 1", "Read all passages first, then all questions", "Start with the hardest passage always"], 0, "Three passages in 60 minutes; difficulty usually increases."),
    ],
  },
  {
    id: "s-listening", module: "strategy", title: "Listening traps", tag: "strat:listening", lvl: 60, icon: "🎧",
    summary: "Mentioned-but-rejected, self-corrections, and words you hear that aren't the answer.",
    body: `Listening distractors exploit **real-time processing**:

- **Mentioned but rejected**: *We thought about Tuesday, but in the end we went for Thursday.*
- **Self-correction**: *It starts at 9 — sorry, 9:30.*
- **Word spotting**: an option repeats a word you heard, but the meaning differs.
- **Similar sounds**: *fifteen / fifty*, *thirteen / thirty* (stress!).
- **Attitude**: the speaker's opinion is often in **intonation and hedges** (*Well… I suppose it's fine*) rather than in content words.

#### Habits
- Read the questions **before** the audio; predict the type of answer.
- Listen for **signposts**: *however, actually, in the end, the main reason*.
- If you understand everything but still choose wrong, you're probably reacting to **words** instead of **meaning**.`,
    items: [
      mcq("sl1", "strat:listening", 60, "You hear: *“We were going to meet on Tuesday, but the room wasn't available, so we moved it to Thursday.”* When is the meeting?", ["Thursday", "Tuesday", "Both days", "It was cancelled"], 0, "Classic **mentioned-but-rejected** trap: *Tuesday* is heard first and stressed, but the final decision is Thursday.", [null, "Mentioned but rejected.", "No.", "No."], [null, "word-match", null, null], { skill: "listening" }),
      mcq("sl2", "strat:listening", 62, "You hear: *“The deadline is the fifteenth — no, wait, I tell a lie, it's the fifth.”* What's the deadline?", ["The 5th", "The 15th", "The 50th", "Not stated"], 0, "**Self-correction** (*I tell a lie* = I made a mistake, BrE idiom).", undefined, undefined, { skill: "listening" }),
      mcq("sl3", "strat:listening", 64, "You hear: *“Well… I suppose the methodology is… adequate.”* What is the speaker's attitude?", ["Unenthusiastic / mildly critical", "Very positive", "Angry", "Neutral factual report"], 0, "Hesitation + *I suppose* + a lukewarm adjective (*adequate*) signal reservation.", undefined, undefined, { skill: "listening" }),
    ],
  },
];
