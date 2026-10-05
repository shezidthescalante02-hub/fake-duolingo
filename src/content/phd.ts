import type { PhdScenario } from "./types";

export const PHD_SCENARIOS: PhdScenario[] = [
  {
    id: "phd-supervisor-first", title: "First meeting with your supervisor", setting: "Supervisor's office, first week of the PhD", lvl: 60, mode: "speak", discipline: "linguistics",
    turns: [
      { who: "Supervisor", say: "Welcome! So, tell me where you are with the project. What would you like to have achieved by the end of this first year?" },
    ],
    task: "Explain your project briefly and propose two concrete goals for the first year. Ask one question about how you'll work together (meeting frequency, feedback, etc.).",
    phrases: [
      { label: "Framing", items: ["At this stage, my main aim is to…", "Broadly speaking, the project looks at…"] },
      { label: "Goals", items: ["By the end of the year, I'd like to have…", "A realistic first milestone would be…"] },
      { label: "Working together", items: ["How often would you suggest we meet?", "Would you prefer to receive drafts by email or discuss them in person?"] },
    ],
    pitfalls: [{ t: "I want you to tell me what to do.", k: "bad", note: "Too passive; supervisors expect initiative." }, { t: "I've drafted a tentative plan, but I'd value your view on whether it's realistic.", k: "good" }],
    model: "At this stage, my main aim is to build a solid description of the tonal system of Guarijío, with a focus on how tone interacts with stress. By the end of the year, I'd like to have completed two fieldwork trips and a first analysis of a core wordlist. I've drafted a tentative timeline, but I'd really value your view on whether it's realistic. Also, how often would you suggest we meet — every two weeks, perhaps?",
  },
  {
    id: "phd-defend-method", title: "Defending a methodological decision", setting: "Progress review panel", lvl: 66, mode: "speak",
    turns: [
      { who: "Panel member", say: "You've chosen to work with only six consultants. Isn't that a serious weakness for a phonological description?" },
    ],
    task: "Defend your decision: explain the rationale, acknowledge the limitation, and say how you mitigate it.",
    phrases: [
      { label: "Acknowledge", items: ["That's a fair question.", "I'm aware that six is a small number."] },
      { label: "Justify", items: ["The decision was driven by…", "In descriptive phonology, depth of data per speaker is often more important than…"] },
      { label: "Mitigate", items: ["To mitigate this, I…", "I'm also planning to cross-check the patterns with…"] },
    ],
    model: "That's a fair question, and I'm aware that six is a small number. The decision was driven partly by the size of the speaker community and partly by the aims of the project: for a first description of the tonal system, I need many repetitions and contexts from each speaker, which isn't feasible with a large sample. To mitigate the limitation, I selected consultants from two villages and three age groups, and I'm planning to cross-check key patterns with archival recordings.",
  },
  {
    id: "phd-seminar-article", title: "Discussing an article in a seminar", setting: "Weekly reading group", lvl: 64, mode: "speak",
    turns: [
      { who: "Chair", say: "So, what did people make of this week's paper? Was the argument convincing?" },
      { who: "Colleague", say: "I thought it was pretty convincing, actually. The data looked solid." },
    ],
    task: "Give your evaluation: agree partly with your colleague, then raise one specific concern about the paper (any paper you know, or one of the app's readings).",
    phrases: [
      { label: "Partial agreement", items: ["I'd agree that the data are impressive, but…", "Building on what Ana said, …"] },
      { label: "Concern", items: ["What I wasn't fully convinced by was…", "I wonder whether the authors have considered…"] },
      { label: "Inviting others", items: ["I'm curious what others thought about…"] },
    ],
  },
  {
    id: "phd-conference-question", title: "Asking a question at a conference", setting: "Q&A after a 20-minute talk", lvl: 62, mode: "speak",
    turns: [{ who: "Chair", say: "We have time for a couple of questions. Yes, at the back." }],
    task: "Ask a clear, concise question about a talk on language documentation (thank the speaker, one sentence of context, one question).",
    phrases: [{ label: "Formula", items: ["Thank you for a really interesting talk.", "You mentioned that… I was wondering…", "Could you say a bit more about…?"] }],
    pitfalls: [{ t: "A three-minute mini-lecture followed by 'so what do you think?'", k: "bad" }, { t: "Thanks — you mentioned that younger speakers merge the tones. I was wondering whether that's also true in compounds?", k: "good" }],
  },
  {
    id: "phd-respond-criticism", title: "Responding to reviewer criticism", setting: "Writing a response letter to journal reviewers", lvl: 70, mode: "write",
    turns: [{ who: "Reviewer 2", say: "The authors' claim that the change is contact-induced is not supported by the data presented. The paper should either provide evidence or remove the claim." }],
    task: "Write a response (100–150 words) to Reviewer 2: thank them, explain how you've revised the paper (e.g., softened the claim and added evidence), and point to the changes.",
    phrases: [
      { label: "Opening", items: ["We thank the reviewer for this helpful comment.", "We agree that the original formulation overstated…"] },
      { label: "Changes", items: ["We have therefore revised the claim to…", "We have added a paragraph (p. 12) discussing…"] },
      { label: "Polite disagreement", items: ["While we take the reviewer's point, we would respectfully maintain that…"] },
    ],
    model: "We thank the reviewer for this helpful comment. We agree that the original formulation overstated the strength of the evidence for contact-induced change. We have therefore revised the claim in the abstract and in Section 5 to present contact as one possible explanation rather than an established cause (pp. 2 and 14). In addition, we have added a paragraph discussing an alternative, internally motivated account and the kind of evidence that would distinguish between the two (p. 15). We believe these changes make the argument more accurate and more transparent.",
  },
  {
    id: "phd-lay-explain", title: "Explaining your research at a family dinner", setting: "Informal conversation with non-specialists", lvl: 58, mode: "speak",
    turns: [{ who: "Relative", say: "So what exactly do you do all day? Isn't a language just… words?" }],
    task: "Explain what you study and why it matters, in everyday English, with one vivid example. Keep it friendly.",
    phrases: [{ label: "Making it concrete", items: ["Think of it like…", "For example, in Guarijío…", "What's fascinating is that…"] }],
  },
  {
    id: "phd-clarify", title: "Asking for clarification", setting: "Supervision meeting", lvl: 60, mode: "speak",
    turns: [{ who: "Supervisor", say: "I think the chapter needs to be more theoretically grounded before you send it to the committee." }],
    task: "Ask for clarification about what exactly 'more theoretically grounded' means, and check your understanding by paraphrasing.",
    phrases: [{ label: "Clarifying", items: ["Could you say a bit more about what you mean by…?", "Do you mean that I should…, or rather…?", "So, if I've understood correctly, …"] }],
  },
  {
    id: "phd-disagree-supervisor", title: "Disagreeing with your supervisor", setting: "Supervision meeting", lvl: 68, mode: "speak",
    turns: [{ who: "Supervisor", say: "I'd drop the perception experiment entirely. It's too much work and it's not central." }],
    task: "Disagree respectfully: explain why the experiment matters to your argument, propose a compromise (e.g., a smaller version).",
    phrases: [
      { label: "Softened disagreement", items: ["I see the concern about workload, but…", "I'm not sure I'd want to drop it completely, because…"] },
      { label: "Compromise", items: ["Would a scaled-down version work, for example…?", "What if I limited it to…?"] },
    ],
  },
  {
    id: "phd-data-talk", title: "Talking about your data", setting: "Lab meeting", lvl: 64, mode: "speak",
    turns: [{ who: "Lab member", say: "Can you walk us through what your dataset actually looks like?" }],
    task: "Describe your (real or planned) dataset: size, type of recordings, annotation, problems so far.",
    phrases: [{ label: "Describing data", items: ["The corpus currently consists of…", "Each recording is annotated for…", "One problem we've run into is…"] }],
  },
  {
    id: "phd-limitations-viva", title: "Discussing limitations in the viva", setting: "Doctoral defence", lvl: 72, mode: "speak",
    turns: [{ who: "External examiner", say: "If you could start the project again, what would you do differently?" }],
    task: "Answer honestly: name a genuine limitation, explain what you learned, and how it would change your design — without undermining your whole thesis.",
    phrases: [{ label: "Reflective", items: ["With hindsight, I would…", "One thing I underestimated was…", "That said, I think the core findings hold because…"] }],
  },
  {
    id: "phd-specialist", title: "Explaining a concept to specialists", setting: "Phonology workshop", lvl: 74, mode: "either",
    turns: [{ who: "Workshop leader", say: "Could you briefly explain how you're analysing the tone–stress interaction, for those of us who work on different families?" }],
    task: "Give a technically precise explanation (90 seconds or 150 words) suitable for phonologists outside your language family.",
    phrases: [{ label: "Technical precision", items: ["I'm treating tone as…, following…", "The key diagnostic is…", "Crucially, …", "This contrasts with analyses in which…"] }],
  },
  {
    id: "phd-researcher-chat", title: "Networking with another researcher", setting: "Conference coffee break", lvl: 60, mode: "speak",
    turns: [{ who: "Researcher", say: "Hi! I saw your poster yesterday. Are you working on Uto-Aztecan too?" }],
    task: "Make small talk that leads naturally to your research, find a shared interest and suggest staying in touch.",
    phrases: [{ label: "Networking", items: ["Yes — I work on…", "What are you working on at the moment?", "That sounds really relevant to…", "Would you mind if I emailed you about…?"] }],
  },
];
