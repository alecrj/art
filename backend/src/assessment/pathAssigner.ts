// backend/src/assessment/pathAssigner.ts
import { SkillLevel, LearningPath, LessonPreview, AssessmentResult } from '../models/assessment/Assessment';
import { SkillAnalysis } from './skillDetector';

export function assignLearningPath(skillAnalysis: SkillAnalysis): {
  path: LearningPath;
  reason: string;
  firstLesson: LessonPreview;
  nextSteps: string[];
} {
  const { skillLevel, skillMarkers, detectedStyles } = skillAnalysis;

  // Path assignment logic
  let path: LearningPath;
  let reason: string;
  let firstLesson: LessonPreview;
  let nextSteps: string[];

  switch (skillLevel) {
    case 'absolute_beginner':
      path = 'foundation_builder';
      reason = 'Perfect! You\'re starting your artistic journey. Our Foundation Builder path will help you build confidence with the basics step by step.';
      firstLesson = {
        id: 'foundation-01',
        title: 'Your First Circle',
        description: 'Discover the joy of confident lines and perfect circles. It\'s more fun than you think!',
        duration: '2 minutes',
        difficulty: 'Beginner',
        preview_url: '/lessons/foundation/01/preview'
      };
      nextSteps = [
        'Master confident lines and basic shapes',
        'Build your artistic confidence one stroke at a time',
        'Learn the foundation skills that support all art'
      ];
      break;

    case 'some_experience':
      // Check skill markers to decide between Foundation Builder and Skill Sharpener
      const hasStrongFoundation = skillMarkers.some(
        marker => (marker.category === 'shapes' || marker.category === 'line_quality') 
                 && marker.strength === 'solid'
      );
      
      if (hasStrongFoundation) {
        path = 'skill_sharpener';
        reason = 'I see you have some solid foundation skills! Skill Sharpener will help you take your technique to the next level.';
        firstLesson = {
          id: 'sharpener-01',
          title: 'Confident Line Variation',
          description: 'Take your line work from good to great with expressive techniques',
          duration: '3 minutes',
          difficulty: 'Intermediate',
          preview_url: '/lessons/sharpener/01/preview'
        };
        nextSteps = [
          'Refine your technique with targeted exercises',
          'Add expressiveness to your line work',
          'Build on your existing strengths'
        ];
      } else {
        path = 'foundation_builder';
        reason = 'Let\'s strengthen your fundamentals! Foundation Builder will give you the solid base to really take off.';
        firstLesson = {
          id: 'foundation-01',
          title: 'Your First Circle',
          description: 'Discover the joy of confident lines and perfect circles. It\'s more fun than you think!',
          duration: '2 minutes',
          difficulty: 'Beginner',
          preview_url: '/lessons/foundation/01/preview'
        };
        nextSteps = [
          'Solidify your foundational skills',
          'Build consistency in your technique',
          'Prepare for more advanced concepts'
        ];
      }
      break;

    case 'intermediate':
      path = 'skill_sharpener';
      reason = 'Excellent technique foundation! Skill Sharpener will help you refine your style and tackle new challenges.';
      firstLesson = {
        id: 'sharpener-05',
        title: 'Advanced Shading Techniques',
        description: 'Master light and shadow to bring your drawings to life',
        duration: '4 minutes',
        difficulty: 'Intermediate',
        preview_url: '/lessons/sharpener/05/preview'
      };
      nextSteps = [
        'Refine advanced techniques',
        'Develop your personal style',
        'Master complex artistic concepts'
      ];
      break;

    case 'advanced':
      path = 'master_class';
      reason = 'Impressive skills! Master Class will help you explore artistic styles and push creative boundaries.';
      firstLesson = {
        id: 'master-01',
        title: 'Style Exploration: Finding Your Voice',
        description: 'Discover what makes your art uniquely yours',
        duration: '5 minutes',
        difficulty: 'Advanced',
        preview_url: '/lessons/master/01/preview'
      };
      nextSteps = [
        'Explore different artistic styles',
        'Develop your unique artistic voice',
        'Create portfolio-worthy pieces'
      ];
      break;

    default:
      path = 'foundation_builder';
      reason = 'Let\'s start with the fundamentals and build from there!';
      firstLesson = {
        id: 'foundation-01',
        title: 'Your First Circle',
        description: 'Every master artist started here. Let\'s begin your journey!',
        duration: '2 minutes',
        difficulty: 'Beginner'
      };
      nextSteps = [
        'Master the basics with confidence',
        'Build a strong foundation for growth',
        'Discover the joy of creating'
      ];
  }

  return { path, reason, firstLesson, nextSteps };
}

export function generateCelebrationMessage(skillAnalysis: SkillAnalysis, assignedPath: LearningPath): string {
  const pathMessages = {
    foundation_builder: 'Welcome to your artistic journey! Every great artist started exactly where you are. Let\'s build something amazing together! 🎨✨',
    skill_sharpener: 'Welcome back, Artist! I can see the skills you\'ve developed. Ready to take them to the next level? 🚀🎨',
    master_class: 'Welcome, accomplished Artist! Your technical skills are impressive. Time to explore new creative horizons! 🎭✨'
  };

  return pathMessages[assignedPath];
}

export function generateEncouragement(skillAnalysis: SkillAnalysis): string {
  const { skillLevel, positives } = skillAnalysis;
  
  const encouragements = {
    absolute_beginner: [
      'You have the most important thing - the courage to create! 🌟',
      'Every master artist was once a beginner. You\'re on an exciting journey! 🚀',
      'I love your enthusiasm for learning. That\'s what makes great artists! ✨'
    ],
    some_experience: [
      'I can see you\'ve been practicing! Your skills are developing beautifully. 🎯',
      'You\'re building real artistic muscle. Keep that growth mindset going! 💪',
      'Your improvement potential is exciting to see! 🌱'
    ],
    intermediate: [
      'Your technique shows real dedication to the craft. Impressive! 🎨',
      'You\'ve developed solid skills. Time to add your personal flair! ✨',
      'I see an artist who understands the fundamentals. Let\'s explore further! 🧭'
    ],
    advanced: [
      'Your artistic maturity really shows. Exciting possibilities ahead! 🎭',
      'You have the skills to create amazing work. Let\'s push boundaries! 🚀',
      'Ready to explore new artistic territories? Your foundation is rock solid! ⛰️'
    ]
  };

  const options = encouragements[skillLevel];
  return options[Math.floor(Math.random() * options.length)];
}