// frontend/src/components/Lessons/LessonContainer.tsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Lesson } from '../../models/learning/LessonTypes';
import QuickDrawLesson from './QuickDrawLesson';
import MultipleChoiceLesson from './MultipleChoiceLesson';
import RealPracticeLesson from './RealPracticeLesson';

interface LessonContainerProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
}

const LessonContainer: React.FC<LessonContainerProps> = ({ lesson, onComplete }) => {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {lesson.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {lesson.description}
      </Typography>
      
      <Box sx={{ my: 3 }}>
        {lesson.type === 'quickDraw' && (
          <QuickDrawLesson 
            lesson={lesson} 
            onComplete={onComplete} 
          />
        )}
        
        {lesson.type === 'multipleChoice' && (
          <MultipleChoiceLesson 
            lesson={lesson} 
            onComplete={onComplete} 
          />
        )}
        
        {lesson.type === 'realPractice' && (
          <RealPracticeLesson 
            lesson={lesson} 
            onComplete={onComplete} 
          />
        )}
      </Box>
    </Paper>
  );
};

export default LessonContainer;