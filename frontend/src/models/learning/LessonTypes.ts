// frontend/src/models/learning/LessonTypes.ts
// Base lesson interface
export interface Lesson {
    id: string;
    title: string;
    description: string;
    type: LessonType;
    xpReward: number;
    content: QuickDrawContent | MultipleChoiceContent | RealPracticeContent;
  }
  
  export type LessonType = 'quickDraw' | 'multipleChoice' | 'realPractice';
  
  // Quick Draw lesson - drawing in the app
  export interface QuickDrawContent {
    instructions: string;
    timeLimit: number; // seconds
    template?: string | null; // Optional template image
    examples: Example[];
    successCriteria: string[];
  }
  
  export interface Example {
    imageUrl: string;
    caption: string;
  }
  
  // Multiple Choice lesson - theory and knowledge
  export interface MultipleChoiceContent {
    introduction: string;
    questions: Question[];
    requiredCorrect: number; // Number of correct answers needed to pass
  }
  
  export interface Question {
    question: string;
    options: string[];
    correctOptionIndex: number;
    explanation: string;
  }
  
  // Real Practice lesson - exercises to do offline
  export interface RealPracticeContent {
    introduction: string;
    instructions: string[];
    timeEstimate: string;
    tips: string[];
    completionCriteria: string;
  }
  
  // Progress tracking interfaces
  export interface LessonProgress {
    completed: boolean;
    lastCompleted?: string; // ISO date
    xpEarned: number;
    attempts: number;
  }
  
  export interface PathProgress {
    id: string;
    lessonsCompleted: number;
    totalLessons: number;
    xpEarned: number;
    lessons: Record<string, LessonProgress>;
  }