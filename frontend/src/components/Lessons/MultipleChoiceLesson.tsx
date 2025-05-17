// frontend/src/components/Lessons/MultipleChoiceLesson.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert
} from '@mui/material';
import { MultipleChoiceLesson as MultipleChoiceLessonType } from '../../models/learning/LessonTypes';

interface MultipleChoiceLessonProps {
  lesson: MultipleChoiceLessonType;
  onComplete: (score: number) => void;
  onProgress: (progress: number) => void;
  disabled: boolean;
}

const MultipleChoiceLesson: React.FC<MultipleChoiceLessonProps> = ({
  lesson,
  onComplete,
  onProgress,
  disabled
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Update progress when selection is made
  useEffect(() => {
    if (selectedOption !== null && !isAnswered) {
      onProgress(50);
    } else if (isAnswered) {
      onProgress(100);
    } else {
      onProgress(10);
    }
  }, [selectedOption, isAnswered, onProgress]);

  // Handle option selection
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isAnswered || disabled) return;
    setSelectedOption(parseInt(event.target.value));
  };

  // Handle submit answer
  const handleSubmit = () => {
    if (selectedOption === null || isAnswered || disabled) return;
    
    const correct = selectedOption === lesson.correctOptionIndex;
    setIsCorrect(correct);
    setIsAnswered(true);
    
    // Calculate score (full points if correct, partial if wrong)
    const score = correct ? lesson.xpReward : Math.floor(lesson.xpReward * 0.3);
    
    // Delay before completing to let user read explanation
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Question */}
      <Typography variant="h6" gutterBottom>
        {lesson.question}
      </Typography>

      {/* Options */}
      <FormControl component="fieldset" sx={{ width: '100%', my: 2 }}>
        <RadioGroup
          value={selectedOption}
          onChange={handleOptionChange}
        >
          {lesson.options.map((option, index) => (
            <Paper
              key={index}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: isAnswered 
                  ? (index === lesson.correctOptionIndex 
                    ? 'success.main' 
                    : (index === selectedOption ? 'error.main' : 'divider'))
                  : (index === selectedOption ? 'primary.main' : 'divider'),
                bgcolor: isAnswered
                  ? (index === lesson.correctOptionIndex
                    ? 'success.light'
                    : (index === selectedOption && index !== lesson.correctOptionIndex
                      ? 'error.light'
                      : 'background.paper'))
                  : (index === selectedOption ? 'primary.light' : 'background.paper'),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: !isAnswered && !disabled 
                    ? 'primary.main' 
                    : undefined,
                  cursor: !isAnswered && !disabled 
                    ? 'pointer' 
                    : undefined,
                }
              }}
              onClick={() => {
                if (!isAnswered && !disabled) {
                  setSelectedOption(index);
                }
              }}
            >
              <FormControlLabel
                value={index}
                control={<Radio />}
                label={option}
                disabled={isAnswered || disabled}
                sx={{ width: '100%' }}
              />
            </Paper>
          ))}
        </RadioGroup>
      </FormControl>

      {/* Submit Button */}
      {!isAnswered && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={selectedOption === null || disabled}
          sx={{ mt: 2 }}
        >
          Check Answer
        </Button>
      )}

      {/* Explanation */}
      {isAnswered && (
        <Alert 
          severity={isCorrect ? "success" : "info"}
          sx={{ mt: 3 }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </Typography>
          <Typography variant="body2">
            {lesson.explanation}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default MultipleChoiceLesson;