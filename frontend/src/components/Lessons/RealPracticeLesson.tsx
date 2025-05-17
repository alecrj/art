// frontend/src/components/Lessons/RealPracticeLesson.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';
import { ArrowForward, CheckCircle } from '@mui/icons-material';
import { RealPracticeLesson as RealPracticeLessonType } from '../../models/learning/LessonTypes';

interface RealPracticeLessonProps {
  lesson: RealPracticeLessonType;
  onComplete: (score: number) => void;
  onProgress: (progress: number) => void;
  disabled: boolean;
}

const RealPracticeLesson: React.FC<RealPracticeLessonProps> = ({
  lesson,
  onComplete,
  onProgress,
  disabled
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [responses, setResponses] = useState<boolean[]>(
    Array(lesson.checkpointQuestions.length).fill(false)
  );

  // Update progress based on state
  useEffect(() => {
    if (!isStarted) {
      onProgress(0);
    } else if (!isCompleted) {
      const checkedCount = responses.filter(Boolean).length;
      const progressValue = Math.min(
        80, 
        20 + (checkedCount / responses.length) * 60
      );
      onProgress(progressValue);
    } else {
      onProgress(100);
    }
  }, [isStarted, isCompleted, responses, onProgress]);

  // Handle checkbox change
  const handleCheckboxChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const newResponses = [...responses];
    newResponses[index] = event.target.checked;
    setResponses(newResponses);
  };

  // Handle start practice
  const handleStart = () => {
    setIsStarted(true);
  };

  // Handle complete practice
  const handleComplete = () => {
    setIsCompleted(true);
    
    // Calculate score based on checked items
    const checkedCount = responses.filter(Boolean).length;
    const score = Math.round((checkedCount / responses.length) * lesson.xpReward);
    
    // Complete the lesson
    setTimeout(() => {
      onComplete(score);
    }, 1500);
  };

  // Check if all checkboxes are checked
  const allChecked = responses.every(Boolean);

  return (
    <Box sx={{ p: 3 }}>
      {!isStarted ? (
        // Introduction screen
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Real-World Practice
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            This exercise is meant to be done in your physical sketchbook or paper.
          </Typography>
          
          {lesson.exampleImageUrl && (
            <Box sx={{ mb: 3 }}>
              <img
                src={lesson.exampleImageUrl}
                alt="Practice example"
                style={{
                  maxWidth: '100%',
                  maxHeight: 250,
                  borderRadius: 8,
                  border: '1px solid #e0e0e0'
                }}
              />
            </Box>
          )}
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStart}
            disabled={disabled}
          >
            Start Practice
          </Button>
        </Box>
      ) : (
        // Practice instructions and checklist
        <Box>
          <Typography variant="h6" gutterBottom>
            Practice Instructions
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="body1">
              {lesson.instructions}
            </Typography>
          </Paper>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            When you've completed the practice, check off these items:
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {lesson.checkpointQuestions.map((question, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={responses[index]}
                    onChange={handleCheckboxChange(index)}
                    disabled={disabled || isCompleted}
                    color="primary"
                  />
                }
                label={question}
                sx={{ 
                  display: 'block', 
                  mb: 1,
                  opacity: responses[index] ? 1 : 0.8
                }}
              />
            ))}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleComplete}
            disabled={disabled || isCompleted || !allChecked}
            sx={{ mt: 3 }}
            endIcon={<CheckCircle />}
          >
            Complete Practice
          </Button>
          
          {isCompleted && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Great job completing this real-world practice! This kind of practice is crucial for developing your skills.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RealPracticeLesson;