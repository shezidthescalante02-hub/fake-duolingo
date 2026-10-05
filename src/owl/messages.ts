// Personalidad de Strix: sarcástico, villano, diva, estricto, agresivamente motivacional,
// burlón pero nunca cruel. A veces enseña una palabra o expresión (gloss).
export interface OwlLine { t: string; gloss?: string; spicy?: boolean; mood?: string }

export type OwlEvent =
  | "greetMorning" | "greetAfternoon" | "greetNight" | "greetReturn" | "correct" | "correctStreak" | "correctHard"
  | "wrong" | "wrongBasic" | "overthink" | "goodChange" | "rushed" | "sessionGood" | "sessionMeh" | "sessionBad"
  | "levelUp" | "wordMastered" | "diagStart" | "diagEnd" | "writingStart" | "writingDone" | "speakingStart"
  | "simStart" | "simEnd" | "idle" | "noPressure" | "c2mode" | "lateNight" | "skipped";

const L: Record<OwlEvent, OwlLine[]> = {
  greetMorning: [
    { t: "Good morning, {name}. The subjunctive won't conjugate itself. Well — it barely conjugates at all, but still.", mood: "smug" },
    { t: "Ah, you're up. Coffee first, then complex noun phrases. I am not a monster.", mood: "soft" },
    { t: "Morning. Today we become *mildly formidable*.", gloss: "formidable: inspiring respect through being impressively powerful or capable", mood: "proud" },
    { t: "Rise and hedge. It *would appear* that it is morning.", mood: "smug" },
  ],
  greetAfternoon: [
    { t: "Afternoon, {name}. Shall we terrorise some grammar?", mood: "smug" },
    { t: "Back again. I *grudgingly* admit I was waiting.", gloss: "grudgingly: in a reluctant or resentful way", mood: "soft" },
    { t: "The C2 examiners are out there. Lurking. Let's give them nothing.", mood: "angry" },
    { t: "Ten minutes, you said. I've heard that before. Let's see.", mood: "thinking" },
  ],
  greetNight: [
    { t: "Studying at night. Very dark academia of you. I approve.", mood: "proud" },
    { t: "It's late. We'll do something short and *lethal*.", mood: "smug" },
    { t: "Night owl energy. Finally, someone who understands me.", mood: "happy" },
  ],
  lateNight: [
    { t: "It's past midnight. Sleep consolidates memory — that is literally how spaced repetition works. Go to bed after this one.", mood: "soft" },
  ],
  greetReturn: [
    { t: "You're back. No guilt trip — I'm a villain, not your mother. Let's pick up where you left off.", mood: "soft" },
    { t: "Welcome back. Your progress didn't go anywhere. Neither did I. Unfortunately for you.", mood: "smug" },
    { t: "A break is not a failure. It's an *intermission*. Curtain up.", gloss: "intermission: a pause between parts of a performance", mood: "proud" },
  ],
  correct: [
    { t: "Correct. Don't let it go to your head.", mood: "smug" },
    { t: "Yes. Obviously. Next.", mood: "smug" },
    { t: "Right. I'm *begrudgingly* impressed.", gloss: "begrudgingly: reluctantly", mood: "proud" },
    { t: "Correct, and without drama. Growth.", mood: "happy" },
    { t: "Exactly. The examiners weep.", mood: "proud" },
    { t: "Good. Your grammar survived. Barely — no, actually, comfortably.", mood: "happy" },
    { t: "Nailed it. *Insufferably* competent.", gloss: "insufferable: too annoying to bear (used here as a compliment, obviously)", mood: "proud" },
    { t: "Correct. Write that down in your diary of victories.", mood: "happy" },
  ],
  correctStreak: [
    { t: "That's a streak. You are becoming *mildly dangerous*.", mood: "proud" },
    { t: "Five in a row. I'm starting to feel unnecessary. I don't like it.", mood: "shocked" },
    { t: "Look at you, dismantling the test like a structuralist.", mood: "proud" },
    { t: "Keep going. C2 is getting nervous.", mood: "happy" },
  ],
  correctHard: [
    { t: "That was a C2 item. You did not even blink. *Unsettling*.", mood: "shocked" },
    { t: "Hard one, handled. I'll pretend I expected that.", mood: "proud" },
  ],
  wrong: [
    { t: "Not quite. Let's see what went wrong — calmly, like scientists.", mood: "thinking" },
    { t: "Wrong, but *instructively* wrong. Read the explanation.", gloss: "instructive: useful in teaching something", mood: "thinking" },
    { t: "Nope. The good news: mistakes are data. Bad news: this is data about you.", mood: "smug" },
    { t: "Missed it. It happens to the best of us. Mostly to the rest of us.", mood: "soft" },
    { t: "Hmm. *Academically questionable*. Let's fix it.", mood: "angry" },
  ],
  wrongBasic: [
    { t: "You knew this yesterday. Fascinating.", mood: "shocked" },
    { t: "That was a B1 trap and you walked into it like it was a welcome mat.", mood: "angry" },
    { t: "{name}. You have TAUGHT this. To humans.", mood: "shocked" },
    { t: "I'm not angry. I'm just… *crestfallen*.", gloss: "crestfallen: sad and disappointed", mood: "soft" },
    { t: "Basic error detected. Pride: wounded. Lesson: still free.", mood: "smug" },
    { t: "Oh, for heaven's sake. Read it again. Slowly. Like it owes you money.", mood: "angry" },
    { t: "Damn. That one was beneath you. Let's make sure it stays there.", spicy: true, mood: "angry" },
    { t: "What the hell was that? Kidding. Mostly. Read the rule.", spicy: true, mood: "shocked" },
  ],
  overthink: [
    { t: "You had it RIGHT. Then you thought about it. Thinking is overrated in multiple choice.", mood: "angry" },
    { t: "Classic overthinking: first answer correct, second answer *creative*. Exams don't grade creativity.", mood: "smug" },
    { t: "You changed a correct answer without new evidence. The test asks what the text says, not what language *could* do.", mood: "thinking" },
    { t: "Your linguist brain found a context where B works. Congratulations. The exam didn't ask for one.", mood: "smug" },
    { t: "Overthought it. Damn it. Trust the evidence, not the anxiety.", spicy: true, mood: "angry" },
  ],
  goodChange: [
    { t: "You changed your answer — and you were right to. That's revision based on evidence. *Chef's kiss*.", mood: "proud" },
    { t: "Good catch. Second thoughts are fine when they come with evidence.", mood: "happy" },
  ],
  rushed: [
    { t: "That was fast. Too fast. Speed is useful; panic is not.", mood: "thinking" },
    { t: "You answered before finishing the question. Bold. Wrong, but bold.", mood: "smug" },
  ],
  sessionGood: [
    { t: "Excellent session. You're becoming *mildly dangerous*.", mood: "proud" },
    { t: "Impressive. I may have to invent harder questions. Out of spite.", mood: "proud" },
    { t: "That was clean. C1 is not going to earn itself — but you're earning it.", mood: "happy" },
    { t: "Strong work. Go and be insufferable about it for at least ten minutes.", mood: "happy" },
  ],
  sessionMeh: [
    { t: "Decent. Not legendary, not tragic. The two most underrated places to be.", mood: "thinking" },
    { t: "Mixed session. The good part: I now know exactly what to throw at you next.", mood: "smug" },
  ],
  sessionBad: [
    { t: "Rough session. That's fine — you studied while tired, which is more than most people do. We'll come back to these.", mood: "soft" },
    { t: "Bad day, not bad learner. The errors are logged; tomorrow they get *ambushed*.", gloss: "ambush: a surprise attack from a hidden position", mood: "soft" },
    { t: "Listen. A bad session tells me what to teach. It doesn't tell me who you are.", mood: "soft" },
    { t: "Hell of a session, and not in the good way. Rest. I'll be here, plotting.", spicy: true, mood: "soft" },
  ],
  levelUp: [
    { t: "LEVEL UP. Somewhere, a Cambridge examiner felt a chill.", mood: "proud" },
    { t: "New level. I'd clap, but I'm an owl. Imagine the clapping.", mood: "happy" },
  ],
  wordMastered: [
    { t: "Word mastered. It now belongs to you. Use it irresponsibly.", mood: "proud" },
  ],
  diagStart: [
    { t: "Diagnostic time. No pressure. Well — some pressure. It's a diagnostic. I need to see how you behave under it.", mood: "smug" },
  ],
  diagEnd: [
    { t: "Diagnostic complete. Remember: this is a first estimate, not a verdict. I'll keep checking — especially anything that looks odd.", mood: "thinking" },
  ],
  writingStart: [
    { t: "Writing time. No translator. Just you, the page, and my judgement.", mood: "smug" },
    { t: "Write first, polish later. A draft is allowed to be ugly.", mood: "soft" },
  ],
  writingDone: [
    { t: "Submitted. I'll show you the problems first. The solutions you earn by trying again.", mood: "thinking" },
  ],
  speakingStart: [
    { t: "Speak. Clearly, not perfectly. Your accent is not on trial — your argument is.", mood: "smug" },
  ],
  simStart: [
    { t: "Simulation mode. Dictionary locked, transcripts gone, timer on. Exactly like the real thing. Breathe.", mood: "angry" },
  ],
  simEnd: [
    { t: "Simulation over. Let's look at what the numbers say — and what they don't.", mood: "thinking" },
  ],
  idle: [
    { t: "Tip: in multiple choice, the right answer is the one the TEXT supports, not the one a linguist could defend.", mood: "thinking" },
    { t: "Tip: if two options are both grammatical, the question is probably testing meaning or collocation.", mood: "thinking" },
    { t: "Tip: *hedge* claims you can't fully prove. Don't hedge everything — that's just *fence-sitting*.", gloss: "fence-sitting: refusing to take a position", mood: "smug" },
    { t: "Did you know? *Ubiquitous* is ubiquitous in academic writing. Use it once per essay, maximum.", mood: "smug" },
    { t: "Tip: when you hesitate between two answers, find the exact sentence that supports each. No sentence, no answer.", mood: "thinking" },
  ],
  noPressure: [
    { t: "No-pressure mode. No timer. No judgement. Okay, a little judgement. I'm an owl.", mood: "soft" },
  ],
  c2mode: [
    { t: "C2 Nightmare selected. I like your confidence. I'll enjoy this.", mood: "angry" },
  ],
  skipped: [
    { t: "Skipped. Fine. I'll bring it back when you least expect it.", mood: "smug" },
  ],
};

export function owlLine(ev: OwlEvent, opts: { name?: string; spicy?: boolean } = {}): OwlLine {
  const pool = L[ev].filter((l) => opts.spicy || !l.spicy);
  const l = pool[Math.floor(Math.random() * pool.length)] || L[ev][0];
  return { ...l, t: l.t.replace(/\{name\}/g, opts.name || "you") };
}

export function greetingEvent(lastActive?: number): OwlEvent {
  const h = new Date().getHours();
  if (lastActive && Date.now() - lastActive > 3 * 86400000) return "greetReturn";
  if (h >= 0 && h < 4) return "lateNight";
  if (h < 12) return "greetMorning";
  if (h < 19) return "greetAfternoon";
  return "greetNight";
}

const NOTIF: Record<"gentle" | "normal" | "savage", { title: string; body: string }[]> = {
  gentle: [
    { title: "Five minutes?", body: "A short review session is ready whenever you are." },
    { title: "Your words miss you", body: "A few vocabulary cards are due. No rush." },
    { title: "Tiny step", body: "One reading question. That's all. Promise." },
  ],
  normal: [
    { title: "Strix is waiting", body: "Your spaced-repetition queue is due. The forgetting curve is not." },
    { title: "C1 → C2", body: "It won't happen by itself. Ten minutes?" },
    { title: "Academic English o'clock", body: "Today's word: *notwithstanding*. Come and use it." },
    { title: "The owl has questions", body: "Three inference questions are sharpening their claws." },
  ],
  savage: [
    { title: "Oh, look who's busy", body: "The examiners aren't. Ten minutes, {name}." },
    { title: "Your hedging is getting rusty", body: "It *would appear* that you have not studied today." },
    { title: "Reminder from your nemesis", body: "C2 is not going to earn itself." },
    { title: "Fascinating", body: "You knew these words last week. Do you still?" },
  ],
};

export function notifMessage(intensity: "gentle" | "normal" | "savage", name: string) {
  const pool = NOTIF[intensity];
  const m = pool[Math.floor(Math.random() * pool.length)];
  return { title: m.title, body: m.body.replace(/\{name\}/g, name || "you").replace(/\*/g, "") };
}
