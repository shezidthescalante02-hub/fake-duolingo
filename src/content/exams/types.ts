import type { Item, ReadingSet, ListeningSet, WritingTask, SpeakingTask, ExamId } from "../types";

export interface ExamPart {
  id: string;
  name: string;
  instructions: string;
  kind: "items" | "reading" | "listening" | "writing" | "choice-writing" | "speaking";
  items?: Item[];
  reading?: ReadingSet;
  listening?: ListeningSet[];      // uno o varios audios en la parte
  plays?: number;                  // veces que se escucha (Cambridge: 2; IELTS/TOEFL: 1)
  writing?: WritingTask;
  writingOptions?: WritingTask[];
  speaking?: SpeakingTask[];
  marks?: number;                  // puntos por respuesta correcta
  group?: "reading" | "uoe" | "listening";  // para Cambridge (Reading vs Use of English)
  itemSeconds?: number;            // tiempo por ítem (TOEFL)
}

export interface ExamSection {
  id: string;
  name: string;
  minutes: number;
  kind: "receptive" | "writing" | "speaking";
  parts: ExamPart[];
  adaptive?: { router: ExamPart[]; upper: ExamPart[]; lower: ExamPart[]; threshold: number };
  note?: string;
}

export interface ExamSpec {
  id: ExamId;
  name: string;
  short: string;
  desc: string;
  scale: string;
  sections: ExamSection[];
  formatNote: string;
}
