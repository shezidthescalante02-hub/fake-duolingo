import type { ExamSpec } from "./types";
import { TOEFL } from "./toefl";
import { CAE } from "./cae";
import { CPE } from "./cpe";
import { IELTS } from "./ielts";

export const EXAMS: ExamSpec[] = [TOEFL, CAE, CPE, IELTS];
export function examById(id: string) { return EXAMS.find((e) => e.id === id); }
