// frontend/src/data/foundationPath.ts
import { LearningPath, QuickDrawLesson, MultipleChoiceLesson, RealPracticeLesson } from '../models/learning/LessonTypes';

// First lesson: Your First Circle
const yourFirstCircle: QuickDrawLesson = {
  id: 'foundation-1-circle',
  type: 'quick_draw',
  title: 'Your First Circle',
  description: 'Draw a circle with one confident motion',
  xpReward: 10,
  duration: 60, // 1 minute
  difficulty: 'easy',
  pathId: 'foundation_builder',
  order: 1,
  promptText: 'Draw a circle in one smooth motion. Don\'t worry about making it perfect!',
  exampleImageUrl: '/assets/lessons/foundation/circle-example.svg',
  timeLimit: 30, // 30 seconds
  successCriteria: [
    'Completed the circle',
    'Used a single motion',
    'Showed confidence in line quality'
  ]
};

// Second lesson: Circle Theory
const circleTheory: MultipleChoiceLesson = {
  id: 'foundation-2-circle-theory',
  type: 'multiple_choice',
  title: 'Circle Theory',
  description: 'Learn about what makes a good circle',
  xpReward: 5,
  duration: 30, // 30 seconds
  difficulty: 'easy',
  pathId: 'foundation_builder',
  order: 2,
  question: 'What's more important when drawing a circle?',
  options: [
    'Making it mathematically perfect',
    'Drawing it with confidence and flow',
    'Using a compass or tool',
    'Drawing it very slowly'
  ],
  correctOptionIndex: 1,
  explanation: 'A confident, flowing circle has more life and energy than a perfect but stiff circle. Great artists prioritize confidence over perfection!'
};

// Third lesson: Real-world Practice
const realCirclePractice: RealPracticeLesson = {
  id: 'foundation-3-real-circle',
  type: 'real_practice',
  title: 'Circle Practice',
  description: 'Practice drawing 10 circles in your sketchbook',
  xpReward: 15,
  duration: 120, // 2 minutes
  difficulty: 'easy',
  pathId: 'foundation_builder',
  order: 3,
  instructions: 'In your sketchbook or any paper, draw 10 circles with confident, smooth motions. Focus on the feeling of drawing with your arm, not just your wrist.',
  exampleImageUrl: '/assets/lessons/foundation/circle-practice.jpg',
  checkpointQuestions: [
    'Did you complete all 10 circles?',
    'Did you draw them with smooth, confident motions?',
    'Did you notice any improvement by the 10th circle?'
  ]
};

// Define the Foundation Builder path
export const foundationBuilderPath: LearningPath = {
  id: 'foundation_builder',
  title: 'Foundation Builder',
  description: 'Perfect for beginners! Build confidence with art basics through fun, bite-sized lessons',
  skillLevel: 'beginner',
  icon: 'school',
  color: '#4caf50',
  lessons: [
    yourFirstCircle,
    circleTheory,
    realCirclePractice
  ],
  totalXP: 30 // Sum of all lessons' XP rewards
};

// Export the first lesson for quick access
export const firstLesson = yourFirstCircle;