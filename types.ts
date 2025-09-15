
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface SyllabusData {
  text: string;
  files: File[];
}

export interface QuestionConfigData {
  mcqs: number;
  subjective: number;
  difficulty: Difficulty;
}

export interface Note {
  topic: string;
  content: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface SubjectiveQuestion {
  question: string;
  modelAnswer: string;
}

export interface StudyMaterialData {
  notes: Note[];
  mcqs: MCQ[];
  subjectiveQuestions: SubjectiveQuestion[];
}

export interface FileContent {
  mimeType: string;
  data: string;
  name: string;
}
