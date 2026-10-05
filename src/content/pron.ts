import type { Lesson } from "./types";
import { mcq, gap } from "./helpers";

// Módulo de pronunciación: opcional, centrado en inteligibilidad (no en "eliminar el acento").
const P = (id: string, tag: string, lvl: number, prompt: string, options: string[], answer: number, explain: string, audio?: string) =>
  mcq(id, tag, lvl, prompt, options, answer, explain, undefined, undefined, { skill: "pronunciation", audio });

export const PRON: Lesson[] = [
  {
    id: "p-intel", module: "pron", title: "Intelligibility first", tag: "pron:intelligibility", lvl: 50, icon: "🎯",
    summary: "What actually affects whether listeners understand you — and what doesn't.",
    body: `The goal of this module is **intelligibility and clarity**, not a 'native' accent. Research on English as an international language (e.g., Jenkins, 2000) suggests that some features matter much more than others for being understood:

**High priority**
- Most consonant contrasts (especially /v/–/b/, /s/–/z/ at word ends, /ʃ/–/tʃ/)
- Vowel **length** contrasts (*ship* vs. *sheep*)
- Consonant clusters at the start of words (*Spain*, not *Espain*)
- **Nuclear stress** — the main stress that marks new or contrastive information

**Lower priority for intelligibility**
- /θ/ and /ð/ (many proficient speakers use [t]/[d] or [f]/[v] and remain intelligible)
- Exact vowel quality, weak forms, some features of connected speech (these help *listening* more than they help being understood)

Your accent is part of your identity. This module trains what improves **communication**.`,
    items: [
      P("pn-pi1", "pron:intelligibility", 50, "Which feature is usually MOST important for being understood?", ["Placing the main stress on the new information", "Pronouncing /θ/ perfectly", "Using British vowels", "Linking every word"], 0, "Nuclear (main) stress guides the listener to what's important; misplacing it causes more misunderstandings than an approximate /θ/."),
    ],
  },
  {
    id: "p-vowels", module: "pron", title: "Vowel contrasts for Spanish speakers", tag: "pron:vowels", lvl: 52, icon: "🔊",
    summary: "Spanish has 5 vowel phonemes; English (depending on variety) has around 12 monophthongs plus diphthongs.",
    body: `Key contrasts:
- /iː/ vs. /ɪ/: *sheep – ship, leave – live, feel – fill*
- /æ/ vs. /ʌ/ vs. /ɑː/: *cat – cut – cart* (in American English, *cart* has /ɑr/)
- /uː/ vs. /ʊ/: *pool – pull, fool – full*
- /ɜː/ (GB) / /ɝ/ (US): *bird, work, research*
- **Schwa /ə/** in unstressed syllables: *a**bout**, **ta**ble, **ph**o**to**graph* — reducing unstressed vowels is what gives English its rhythm.

Tip: for /iː/–/ɪ/, length and tenseness both matter: /ɪ/ is shorter and more central.`,
    items: [
      P("pn-pv1", "pron:vowels", 50, "Which word did you hear?", ["ship", "sheep"], 0, "/ʃɪp/ — short, lax vowel.", "ship"),
      P("pn-pv2", "pron:vowels", 50, "Which word did you hear?", ["live", "leave"], 1, "/liːv/ — long, tense vowel.", "leave"),
      P("pn-pv3", "pron:vowels", 54, "Which word did you hear?", ["cat", "cut", "cart"], 1, "/kʌt/.", "cut"),
      P("pn-pv4", "pron:vowels", 54, "Which word did you hear?", ["pool", "pull"], 1, "/pʊl/ — short vowel.", "pull"),
      P("pn-pv5", "pron:vowels", 58, "Which syllable has a schwa /ə/ in *photographer*?", ["pho-", "-to-", "-gra-", "-pher (and pho-)"], 3, "*pho**TO**grapher* /fəˈtɒɡrəfə/: stress on the 2nd syllable; the 1st and last syllables (and usually the 3rd) are reduced."),
    ],
  },
  {
    id: "p-cons", module: "pron", title: "Consonants and clusters", tag: "pron:consonants", lvl: 52, icon: "🗣️",
    summary: "/b/–/v/, final voicing, initial s-clusters and -ed / -s endings.",
    body: `- **/b/ vs. /v/**: Spanish merges them; English contrasts them (*berry – very, ban – van*). /v/ is labiodental: upper teeth on lower lip.
- **Final /z/**: *raise* /reɪz/ vs. *race* /reɪs/; plurals after voiced sounds are [z]: *words, papers*.
- **Initial s + consonant**: *study, Spain, specific* — avoid adding [e] at the start.
- **/dʒ/ vs. /j/**: *jet – yet, jam – yam*.
- **-ed endings**: [t] after voiceless sounds (*worked*), [d] after voiced (*analysed*), [ɪd] after /t/ or /d/ (*tested, recorded*).
- **-s endings**: [s] (*results*), [z] (*findings*), [ɪz] (*analyses* /əˈnæləsiːz/ is special; *classes* [ɪz]).`,
    items: [
      P("pn-pc1", "pron:consonants", 50, "Which word did you hear?", ["berry", "very"], 1, "Labiodental /v/.", "very"),
      P("pn-pc2", "pron:consonants", 52, "How is -ed pronounced in *analysed*?", ["/t/", "/d/", "/ɪd/"], 1, "After a voiced sound (/z/) → /d/."),
      P("pn-pc3", "pron:consonants", 52, "How is -ed pronounced in *recorded*?", ["/t/", "/d/", "/ɪd/"], 2, "After /d/ → extra syllable /ɪd/."),
      P("pn-pc4", "pron:consonants", 52, "How is -ed pronounced in *worked*?", ["/t/", "/d/", "/ɪd/"], 0, "After a voiceless sound (/k/) → /t/."),
      P("pn-pc5", "pron:consonants", 54, "Which word did you hear?", ["jet", "yet"], 1, "/jɛt/ — a glide, not an affricate.", "yet"),
    ],
  },
  {
    id: "p-stress", module: "pron", title: "Word stress in academic vocabulary", tag: "pron:stress", lvl: 58, icon: "📈",
    summary: "Stress shifts in word families and noun/verb pairs.",
    body: `#### Word families shift stress
- **PHO**tograph – pho**TO**graphy – photo**GRA**phic
- **A**nalyse – a**NA**lysis – ana**LY**tical
- e**CON**omy – eco**NOM**ic – e**CON**omist
- **CON**text – con**TEX**tual
- **HY**pothesis – hypo**THE**tical
- *-tion, -ic, -ical, -ity* usually put stress on the syllable **before** the suffix: *cla**RI**ty, phono**LO**gical, va**RI**ety*.

#### Noun–verb pairs
**RE**cord (n) / re**CORD** (v); **PRE**sent / pre**SENT**; **CON**trast / con**TRAST**; **OB**ject / ob**JECT**; **IN**crease / in**CREASE**.`,
    items: [
      P("pn-ps1", "pron:stress", 56, "Where is the main stress in *analysis*?", ["A-na-ly-sis", "a-NA-ly-sis", "a-na-LY-sis", "a-na-ly-SIS"], 1, "/əˈnæləsɪs/."),
      P("pn-ps2", "pron:stress", 58, "Where is the main stress in *phonological*?", ["PHO-no-lo-gi-cal", "pho-NO-lo-gi-cal", "pho-no-LO-gi-cal", "pho-no-lo-GI-cal"], 2, "Suffix *-ical* → stress on the syllable before: /ˌfəʊnəˈlɒdʒɪkəl/."),
      P("pn-ps3", "pron:stress", 56, "*We need to ___ the interviews.* (verb) Which stress pattern?", ["REcord", "reCORD"], 1, "Verb → second syllable: *re**CORD***."),
      P("pn-ps4", "pron:stress", 60, "Where is the main stress in *hypothetical*?", ["HY-po-the-ti-cal", "hy-PO-the-ti-cal", "hy-po-THE-ti-cal", "hy-po-the-TI-cal"], 2, "/ˌhaɪpəˈθɛtɪkəl/."),
      P("pn-ps5", "pron:stress", 58, "Where is the main stress in *variety*?", ["VA-ri-e-ty", "va-RI-e-ty", "va-ri-E-ty", "va-ri-e-TY"], 1, "*-ity* → stress before: /vəˈraɪəti/."),
    ],
  },
  {
    id: "p-rhythm", module: "pron", title: "Sentence stress, rhythm and weak forms", tag: "pron:rhythm", lvl: 60, icon: "🥁",
    summary: "Content words are stressed; function words often reduce.",
    body: `English tends towards **stress-timing**: stressed syllables occur at roughly regular intervals, and unstressed syllables squeeze between them. Function words usually take **weak forms**:

| Word | Strong | Weak |
|---|---|---|
| can | /kæn/ | /kən/ |
| to | /tuː/ | /tə/ |
| of | /ɒv/ | /əv/ |
| for | /fɔː/ | /fə/ |
| and | /ænd/ | /ən/, /n/ |
| was | /wɒz/ | /wəz/ |

Weak forms matter most for **listening**: if you expect the strong form, you'll miss words in fast speech. In your own speech, using them sounds more fluent, but strong forms are still intelligible.`,
    items: [
      P("pn-pr1", "pron:rhythm", 58, "In this sentence, how is *can* pronounced?", ["/kæn/ (strong)", "/kən/ (weak)"], 1, "Unstressed modal → weak form.", "We can start at nine."),
      P("pn-pr2", "pron:rhythm", 60, "Which words are normally stressed in *The results of the study were published in a journal*?", ["results, study, published, journal", "the, of, were, in", "all words equally", "only journal"], 0, "Content words carry stress; function words reduce."),
      gap("pn-pr3", "pron:rhythm", 62, "Dictation: write the missing word you hear. *I'd like ___ talk about the results.*", ["to"], "Weak form /tə/ — easy to miss.", { skill: "pronunciation", audio: "I'd like to talk about the results.", prompt: "Listen and complete." }),
    ],
  },
  {
    id: "p-inton", module: "pron", title: "Intonation and nuclear stress", tag: "pron:intonation", lvl: 62, icon: "〰️",
    summary: "Where the main stress falls tells the listener what's new or contrastive.",
    body: `**Nuclear stress** (tonic) normally falls on the **last content word** of the phrase, but moves to mark **contrast** or **new information**:
- *I said the **SECOND** chapter, not the first.*
- *A: Did you record the **women**? B: I recorded the **MEN**.*

**Tones**
- Fall ↘: statements, wh-questions, certainty.
- Rise ↗: yes/no questions, lists (non-final items), uncertainty.
- **Fall-rise** ↘↗: reservation, implication ("but…"): *The data are ↘↗good* (= but there's a problem).

Misplaced nuclear stress is one of the most frequent causes of misunderstanding between proficient speakers.`,
    items: [
      P("pn-pin1", "pron:intonation", 62, "A: *Did you analyse the vowels?* B: *I analysed the CONSONANTS.* Why is CONSONANTS stressed?", ["It contrasts with vowels", "It's the longest word", "It's a noun", "It ends the sentence"], 0, "Contrastive focus."),
      P("pn-pin2", "pron:intonation", 64, "*Well, the methodology is… ↘↗fine.* What does the fall-rise suggest?", ["Reservation: there's a 'but'", "Enthusiasm", "A question", "Anger"], 0, "Fall-rise often implies an unstated contrast or reservation."),
    ],
  },
  {
    id: "p-connected", module: "pron", title: "Connected speech", tag: "pron:connected", lvl: 64, icon: "🔗",
    summary: "Linking, elision and assimilation — mainly to understand fast speech.",
    body: `- **Linking**: consonant + vowel across words: *an͜ apple*, *turn͜ off*. Linking /r/ in non-rhotic accents: *far͜ away*.
- **Elision**: /t/ and /d/ often disappear between consonants: *nex(t) day*, *san(d)wich*, *mus(t) be*.
- **Assimilation**: sounds adapt to neighbours: *te**n b**oys* → [tem bɔɪz], *ha**ve t**o* → [hæftə], *di**d y**ou* → [dɪdʒu].
- **Contractions and reductions** in informal speech: *gonna, wanna, kinda* (listen for them; avoid them in academic speaking).

These features explain why you can understand every word in a transcript but miss them in audio.`,
    items: [
      P("pn-pco1", "pron:connected", 62, "What phrase did you hear?", ["next day", "neck stay", "necks day", "next stay"], 0, "The /t/ in *next* is often elided before /d/.", "next day"),
      P("pn-pco2", "pron:connected", 64, "In *Did you see it?*, what often happens to *did you* in fast speech?", ["/dɪdʒu/ (assimilation)", "/dɪd juː/ always", "It disappears", "/dɪt ju/"], 0, "/d/ + /j/ → /dʒ/ (yod coalescence)."),
    ],
  },
];
