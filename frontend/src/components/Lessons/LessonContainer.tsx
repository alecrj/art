// frontend/src/components/Lessons/LessonContainer.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Avatar
} from '@mui/material';
import { ArrowForward, Celebration, School, Star } from '@mui/icons-material';
import { Lesson } from '../../models/learning/LessonTypes';
import QuickDrawLesson from './QuickDrawLesson';
import MultipleChoiceLesson from './MultipleChoiceLesson';
import RealPracticeLesson from './RealPracticeLesson';

interface LessonContainerProps {
  lesson: Lesson;
  onComplete: (lessonId: string, score: number) => void;
  onExit: () => void;
}

const LessonContainer: React.FC<LessonContainerProps> = ({
  lesson,
  onComplete,
  onExit
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  // Handle lesson completion
  const handleLessonComplete = (lessonScore: number) => {
    setScore(lessonScore);
    setIsCompleted(true);
    setProgress(100);
  };

  // Handle progress updates
  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  // Continue to next lesson
  const handleContinue = () => {
    onComplete(lesson.id, score);
  };

  // Render appropriate lesson component based on type
  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'quick_draw':
        return (
          <QuickDrawLesson
            lesson={lesson}
            onComplete={handleLessonComplete}
            onProgress={handleProgressUpdate}
            disabled={isCompleted}
          />
        );
      case 'multiple_choice':
        return (
          <MultipleChoiceLesson
            lesson={lesson}
            onComplete={handleLessonComplete}
            onProgress={handleProgressUpdate}
            disabled={isCompleted}
          />
        );
      case 'real_practice':
        return (
          <RealPracticeLesson
            lesson={lesson}
            onComplete={handleLessonComplete}
            onProgress={handleProgressUpdate}
            disabled={isCompleted}
          />
        );
      // Add other lesson types as they're implemented
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>
              This lesson type ({lesson.type}) is coming soon!
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Lesson Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            {lesson.title}
          </Typography>
          <Chip
            label={`${lesson.xpReward} XP`}
            color="primary"
            icon={<Star />}
          />
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mt: 2, height: 8, borderRadius: 4 }}
        />
      </Paper>

      {/* Lesson Content */}
      <Paper sx={{ p: 0, overflow: 'hidden', mb: 2 }}>
        {!isCompleted ? (
          renderLessonContent()
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Avatar 
              sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'success.main' }}
            >
              <Celebration sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom>
              Great job!
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You earned {lesson.xpReward} XP
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              endIcon={<ArrowForward />}
              sx={{ mt: 3 }}
            >
              Continue
            </Button>
          </Box>
        )}
      </Paper>

      {/* Bottom Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={onExit}
          disabled={isCompleted}
        >
          Exit
        </Button>
        
        <Chip
          icon={<School />}
          label={`${lesson.difficulty} · ${Math.floor(lesson.duration / 60)} min`}
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default LessonContainer;