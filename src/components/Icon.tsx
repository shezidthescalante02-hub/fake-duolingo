// Iconos de línea propios (SVG, sin dependencias). Trazo 1.7, esquinas redondeadas.
import React from "react";

const P: Record<string, React.ReactNode> = {
  home: <><path d="M3.5 10.5 12 3.8l8.5 6.7" /><path d="M5.5 9v10.5h4.5v-6h4v6h4.5V9" /></>,
  learn: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /><path d="M8.5 7.5h7" /></>,
  cards: <><rect x="3" y="6" width="13" height="15" rx="2" /><path d="M7 3h11a2 2 0 0 1 2 2v12" /><path d="M6.5 11h6M6.5 15h4" /></>,
  exam: <><path d="M2.5 9 12 4.5 21.5 9 12 13.5z" /><path d="M6.5 11v4.5c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3V11" /><path d="M21.5 9v5" /></>,
  chart: <><path d="M4 20V4" /><path d="M4 20h16" /><path d="m7.5 15 3.5-4 3 2.5 5-6" /><circle cx="19" cy="7.5" r="0.6" fill="currentColor" /></>,
  pen: <><path d="M15.5 4.5l4 4L9 19l-5 1 1-5z" /><path d="m13.5 6.5 4 4" /></>,
  quill: <><path d="M20 4c-6 0-11 4.5-12.5 11.5L6 20" /><path d="M20 4c.5 6-4 10.5-11 11.5" /><path d="M9 15l3-3" /></>,
  headphones: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4.5" height="6.5" rx="1.5" /><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21M8.5 21h7" /></>,
  book: <><path d="M12 6.5C10 4.8 7 4.5 3.5 5v13.5c3.5-.5 6.5-.2 8.5 1.5 2-1.7 5-2 8.5-1.5V5C17 4.5 14 4.8 12 6.5z" /><path d="M12 6.5V20" /></>,
  speaker: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4 4 0 0 1 0 6" /><path d="M18 6.5a7.5 7.5 0 0 1 0 11" /></>,
  columns: <><path d="M3 8.5 12 4l9 4.5" /><path d="M4.5 20h15" /><path d="M6.5 10.5V17M10 10.5V17M14 10.5V17M17.5 10.5V17" /><path d="M4 8.5h16" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.8" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  hourglass: <><path d="M6.5 3.5h11M6.5 20.5h11" /><path d="M7.5 3.5c0 4.5 4.5 5.5 4.5 8.5s-4.5 4-4.5 8.5M16.5 3.5c0 4.5-4.5 5.5-4.5 8.5s4.5 4 4.5 8.5" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" /><circle cx="12" cy="12" r="6.3" /></>,
  sparkle: <><path d="M12 3.5c.8 4.2 2.3 5.7 6.5 6.5-4.2.8-5.7 2.3-6.5 6.5-.8-4.2-2.3-5.7-6.5-6.5 4.2-.8 5.7-2.3 6.5-6.5z" /><path d="M18.5 15.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5z" /></>,
  flame: <><path d="M12 21c-4 0-6.5-2.6-6.5-6.2 0-3.5 2.6-5.5 3.6-8.8 1.8 1.3 2.6 3 2.7 4.6 1-.9 1.6-2.3 1.6-3.8 3 2 5.1 5 5.1 8 0 3.6-2.5 6.2-6.5 6.2z" /><path d="M12 21c-1.7 0-2.8-1.1-2.8-2.7 0-1.8 1.6-2.7 2.8-4.3 1.2 1.6 2.8 2.5 2.8 4.3 0 1.6-1.1 2.7-2.8 2.7z" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  back: <path d="M15 5l-7 7 7 7" />,
  next: <path d="m9 5 7 7-7 7" />,
  arrowRight: <><path d="M4.5 12h15" /><path d="m13.5 6 6 6-6 6" /></>,
  play: <path d="M7.5 5v14l11.5-7z" />,
  pause: <><path d="M8 5v14M16 5v14" /></>,
  stop: <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />,
  repeat: <><path d="M4 11V9.5A3.5 3.5 0 0 1 7.5 6H19" /><path d="m16 3 3 3-3 3" /><path d="M20 13v1.5a3.5 3.5 0 0 1-3.5 3.5H5" /><path d="m8 21-3-3 3-3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  star: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />,
  crown: <><path d="M3.5 8l4 3.5L12 5l4.5 6.5 4-3.5-2 10.5h-13z" /><path d="M5.5 21h13" /></>,
  alert: <><path d="M12 3.5 21.5 20h-19z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.3" r="0.5" fill="currentColor" /></>,
  down: <><path d="M4 6.5l6 6 3.5-3.5L20 15.5" /><path d="M20 10.5v5h-5" /></>,
  up: <><path d="M4 17.5l6-6 3.5 3.5L20 8.5" /><path d="M20 13.5v-5h-5" /></>,
  map: <><path d="M3.5 6.5 9 4l6 2.5 5.5-2.5v13.5L15 20l-6-2.5-5.5 2.5z" /><path d="M9 4v13.5M15 6.5V20" /></>,
  bolt: <path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6z" />,
  puzzle: <path d="M9 4.5a2 2 0 0 1 4 0V6h4a1 1 0 0 1 1 1v4h-1.5a2 2 0 0 0 0 4H18v4a1 1 0 0 1-1 1h-4v-1.5a2 2 0 0 0-4 0V20H5a1 1 0 0 1-1-1v-4h1.5a2 2 0 0 0 0-4H4V7a1 1 0 0 1 1-1h4z" />,
  key: <><circle cx="8" cy="15" r="4.5" /><path d="M11.2 11.8 20 3M16.5 6.5l2.5 2.5M14 9l2 2" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" /></>,
  teacher: <><circle cx="9" cy="7" r="3" /><path d="M3.5 20v-2.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V20" /><path d="M14 4h7v8h-5" /><path d="m15 9 2.5-2.5" /></>,
  infinity: <path d="M12 12c-2-2.7-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.3 5.5-4zm0 0c2 2.7 3.6 4 5.5 4a4 4 0 0 0 0-8c-1.9 0-3.5 1.3-5.5 4z" />,
  layers: <><path d="m12 3.5 9 4.5-9 4.5-9-4.5z" /><path d="m3 12 9 4.5 9-4.5" /><path d="m3 16 9 4.5 9-4.5" /></>,
  shuffle: <><path d="M3.5 7h3c4.5 0 6 10 10.5 10h3.5" /><path d="M3.5 17h3c1.7 0 2.9-1.4 3.9-3.2M13.6 10.2C14.6 8.4 15.8 7 17.5 7H21" /><path d="m18.5 4.5 2.5 2.5-2.5 2.5M18.5 14.5l2.5 2.5-2.5 2.5" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  sort: <><rect x="3.5" y="4" width="7" height="16" rx="1.5" /><rect x="13.5" y="4" width="7" height="16" rx="1.5" /><path d="M6 8h2M6 11h2M16 8h2" /></>,
  help: <><circle cx="12" cy="12" r="8.5" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7" /><circle cx="12" cy="17" r="0.5" fill="currentColor" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4.5h11l-2 4 2 4H5" /></>,
  trophy: <><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z" /><path d="M7.5 6H4.5a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4" /><path d="M12 13.5V17M8.5 20.5h7M9.5 17h5v3.5h-5z" /></>,
  brain: <><path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 2.5h.5V4.5z" /><path d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 2.5h-.5V4.5z" /><path d="M9.5 4.5v15M14.5 4.5v15" /></>,
  bulb: <><path d="M9 17.5h6M10 20.5h4" /><path d="M12 3.5a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-.6c0-.8.4-1.5 1-2A6 6 0 0 0 12 3.5z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>,
  bell: <><path d="M6 10a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4S6 15 6 10z" /><path d="M10 19.5a2 2 0 0 0 4 0" /></>,
  trash: <><path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 14h9l1-14" /></>,
  archive: <><rect x="3" y="4" width="18" height="4.5" rx="1" /><path d="M4.5 8.5V20h15V8.5M10 12h4" /></>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>,
  download: <><path d="M12 4v11M7 10.5l5 5 5-5" /><path d="M4.5 19.5h15" /></>,
  upload: <><path d="M12 15.5V4.5M7 9l5-5 5 5" /><path d="M4.5 19.5h15" /></>,
  turtle: <><path d="M4 15.5c0-4.5 3.5-8 8-8s8 3.5 8 8z" /><path d="M20 15.5h1.5M5 15.5 4 18.5M19 15.5l1 3M9 15.5 8.5 18.5M15 15.5l.5 3" /><path d="M8 11.5h8M12 7.5v8" /></>,
  rabbit: <><path d="M13 21h-5a4 4 0 0 1 0-8h3a5 5 0 0 1 5 5v3z" /><path d="M14 13c0-4-1.5-8.5-3-9.5-1 2 .2 6.5 1 9" /><path d="M16 14c1.5-3 3.5-7 2.5-9-1.5.5-3.5 4.5-4 8" /></>,
  text: <><path d="M4 6h16M4 10.5h16M4 15h10M4 19.5h7" /></>,
  translate: <><path d="M3.5 5.5h9M8 3.5v2M10.5 5.5c-.8 3.5-3.2 6.5-6.5 8" /><path d="M6 9c1.2 2 3 3.6 5 4.5" /><path d="m12.5 20.5 4-9.5 4 9.5M14 17h5" /></>,
  dice: <><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="8.5" cy="8.5" r="1" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
  wave: <path d="M2.5 12h2l2-5 3 10 3-14 3 14 2.5-8 1.5 3h2.5" />,
  owl: <><path d="M6 5l2.5 3M18 5l-2.5 3" /><path d="M5.5 9.5C5.5 6.5 8.5 5 12 5s6.5 1.5 6.5 4.5V15c0 3.5-3 5.5-6.5 5.5S5.5 18.5 5.5 15z" /><circle cx="9.5" cy="11" r="2" /><circle cx="14.5" cy="11" r="2" /><path d="m11.2 13.5.8 1.2.8-1.2" /></>,
  scroll: <><path d="M7 3.5h11a2 2 0 0 1 2 2v1.5h-4" /><path d="M16 7v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V17h10" /><path d="M7 3.5a2 2 0 0 0-2 2V17" /><path d="M8.5 9h4.5M8.5 12.5h4.5" /></>,
  swords: <><path d="M14.5 3.5H20v5.5L9.5 19.5 4.5 14.5z" /><path d="m7 12 5 5M3.5 20.5l3-3" /></>,
  feather: <><path d="M20.5 3.5c-7 0-13 5-13 13v4" /><path d="M7.5 16.5h6c3.5-2 6-6.5 7-13" /><path d="M10 12.5h5.5" /></>,
  medal: <><circle cx="12" cy="15" r="5" /><path d="M8.5 11 6 3.5h4l2 5 2-5h4L15.5 11" /><path d="m12 13 .8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  more: <><circle cx="5.5" cy="12" r="1.2" fill="currentColor" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /><circle cx="18.5" cy="12" r="1.2" fill="currentColor" /></>,
  skip: <><path d="M5 5.5 15 12 5 18.5z" /><path d="M19 5v14" /></>,
  heartbeat: <path d="M3 12h4l2-5 3.5 10 2.5-6 1.5 1H21" />,
  gauge: <><path d="M4 17a8 8 0 1 1 16 0" /><path d="m12 17 4-5.5" /></>,
};

export type IconName = keyof typeof P | string;

export function Icon({ name, size = 20, className = "", stroke = 1.7, style }: { name: IconName; size?: number; className?: string; stroke?: number; style?: React.CSSProperties }) {
  const p = P[name] ?? P.sparkle;
  return (
    <svg className={"ico " + className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      {p}
    </svg>
  );
}

// Icono para cada lección/tema según su etiqueta (sustituye a los emojis de contenido)
export function iconForTag(tag: string): string {
  const [ns, t = ""] = tag.split(":");
  if (ns === "pron") return t === "stress" || t === "rhythm" || t === "intonation" ? "wave" : "speaker";
  if (ns === "strat") return t === "timing" ? "clock" : t === "overthinking" ? "brain" : t === "listening" ? "headphones" : "target";
  if (ns === "acad") return ({ hedging: "feather", reporting: "quill", argumentation: "swords", paraphrase: "repeat", summarizing: "text", synthesis: "layers", methodology: "compass", results: "chart", limitations: "alert", disagreement: "swords", precision: "edit", email: "scroll" } as any)[t] || "columns";
  if (ns === "uoe") return ({ kwt: "key", wordform: "puzzle", collocation: "link", phrasal: "link", idiom: "sparkle", "open-cloze": "edit", "mc-cloze": "target" } as any)[t] || "key";
  if (ns === "gram") return ({ "tense-aspect": "clock", articles: "text", determiners: "layers", prepositions: "link", modality: "gauge", passive: "repeat", reported: "quill", conditionals: "shuffle", inversion: "repeat", relatives: "link", participial: "layers", "np-complex": "layers", "coord-subord": "link", embedding: "layers", nominalization: "puzzle", "info-structure": "map", cohesion: "link", punctuation: "edit", agreement: "check", "word-order": "shuffle", complementation: "puzzle", "hedging-grammar": "feather", stance: "compass", "formal-register": "columns", "academic-choices": "bulb" } as any)[t] || "puzzle";
  if (ns === "rd") return "book";
  if (ns === "ls") return "headphones";
  if (ns === "voc" || ns === "avoc") return "cards";
  return "puzzle";
}
