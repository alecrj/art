// frontend/src/models/learning/LessonTypes.ts
export type LessonType = 
  | 'quick_draw'        // Draw something simple in the app
  | 'complete_drawing'  // Finish a partially started drawing
  | 'real_practice'     // Prompt to draw in real sketchbook
  | 'spot_difference'   // Visual training exercise
  | 'multiple_choice'   // Art theory/technique question
  | 'trace_exercise';   // Follow the lines/shapes

export type LessonDifficulty = 'easy' | 'medium' | 'hard';

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  description: string;
  xpReward: number;
  duration: number; // in seconds
  difficulty: LessonDifficulty;
  pathId: string;
  order: number;
  prerequisites?: string[]; // IDs of lessons that must be completed first
  unlocked?: boolean; // Whether the user has unlocked this lesson
}

export interface QuickDrawLesson extends Lesson {
  type: 'quick_draw';
  promptText: string;
  exampleImageUrl?: string;
  timeLimit: number; // in seconds
  successCriteria: string[];
}

export interface CompleteDrawingLesson extends Lesson {
  type: 'complete_drawing';
  startingImageUrl: string;
  promptText: string;
  timeLimit: number; // in seconds
}

export interface RealPracticeLesson extends Lesson {
  type: 'real_practice';
  instructions: string;
  exampleImageUrl: string;
  checkpointQuestions: string[]; // Questions to verify they did the exercise
}

export interface SpotDifferenceLesson extends Lesson {
  type: 'spot_difference';
  imageSetA: string; // URL
  imageSetB: string; // URL
  differences: Array<{
    description: string;
    coordinates: [number, number]; // x, y position
  }>;
}

export interface MultipleChoiceLesson extends Lesson {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface TraceExerciseLesson extends Lesson {
  type: 'trace_exercise';
  templateImageUrl: string;
  instructions: string;
  accuracy_threshold: number; // percentage match required to pass
}

// Learning path (like a Duolingo course)
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  color: string;
  lessons: Lesson[];
  totalXP: number;
}

// User's progress
export interface UserProgress {
  userId: string;
  currentPathId: string;
  completedLessons: string[]; // Lesson IDs
  currentStreak: number;
  lastPracticeDate: string;
  totalXP: number;
  level: number;
  skillProgress: Record<string, number>; // skill name -> progress (0-100)
}