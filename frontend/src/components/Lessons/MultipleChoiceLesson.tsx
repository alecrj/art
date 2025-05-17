// frontend/src/components/Lessons/MultipleChoiceLesson.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip
} from '@mui/material';
import {
  Check,
  Close,
  ArrowForward,
  QuizOutlined,
  EmojiEvents
} from '@mui/icons-material';
import { Lesson, MultipleChoiceContent, Question } from '../../models/learning/LessonTypes';

interface MultipleChoiceLessonProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
}

const MultipleChoiceLesson: React.FC<MultipleChoiceLessonProps> = ({ lesson, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Type assertion since we know it's MultipleChoiceContent
  const content = lesson.content as MultipleChoiceContent;
  
  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    setShowExplanation(true);
  };
  
  const handleContinue = () => {
    if (activeStep < content.questions.length - 1) {
      setActiveStep(activeStep + 1);
      setShowExplanation(false);
    } else {
      // Calculate score
      const correctAnswers = answers.filter(
        (answer, index) => answer === content.questions[index].correctOptionIndex
      ).length;
      
      // Check if passed
      const passed = correctAnswers >= content.requiredCorrect;
      
      if (passed) {
        setIsComplete(true);
      } else {
        // Reset to first question
        setActiveStep(0);
        setAnswers([]);
        setShowExplanation(false);
      }
    }
  };
  
  const handleComplete = () => {
    onComplete(lesson.xpReward);
  };
  
  const currentQuestion = content.questions[activeStep];
  const hasAnswered = answers[activeStep] !== undefined;
  const isCorrect = hasAnswered && answers[activeStep] === currentQuestion.correctOptionIndex;
  
  return (
    <Box>
      {/* Introduction */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body1">
          {content.introduction}
        </Typography>
      </Alert>
      
      {/* Progress */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1">
          Question {activeStep + 1} of {content.questions.length}
        </Typography>
        <Chip 
          icon={<QuizOutlined />} 
          label={`Need ${content.requiredCorrect} correct to pass`}
          color="primary"
          variant="outlined"
        />
      </Box>
      
      {!isComplete ? (
        <>
          {/* Current Question */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question}
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
              <RadioGroup
                value={answers[activeStep] !== undefined ? answers[activeStep] : ''}
                onChange={(e, value) => handleAnswer(activeStep, parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={option}
                    disabled={showExplanation}
                    sx={{
                      py: 1,
                      px: 2,
                      my: 0.5,
                      borderRadius: 1,
                      bgcolor: showExplanation
                        ? index === currentQuestion.correctOptionIndex
                          ? 'success.light'
                          : answers[activeStep] === index
                            ? 'error.light'
                            : 'transparent'
                        : 'transparent',
                      '&:hover': {
                        bgcolor: showExplanation ? undefined : 'action.hover'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            {showExplanation && (
              <Alert 
                severity={isCorrect ? "success" : "error"} 
                icon={isCorrect ? <Check /> : <Close />}
                sx={{ mt: 3 }}
              >
                <Typography variant="subtitle1">
                  {isCorrect ? 'Correct!' : 'Not quite.'}
                </Typography>
                <Typography variant="body2">
                  {currentQuestion.explanation}
                </Typography>
              </Alert>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              {!showExplanation ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!hasAnswered}
                >
                  Check Answer
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleContinue}
                  endIcon={<ArrowForward />}
                >
                  {activeStep < content.questions.length - 1 ? 'Next Question' : 'See Results'}
                </Button>
              )}
            </Box>
          </Paper>
          
          {/* Question Progress */}
          <Stepper activeStep={activeStep} alternativeLabel>
            {content.questions.map((question, index) => (
              <Step key={index} completed={index < activeStep}>
                <StepLabel>
                  {index < answers.length && (
                    answers[index] === content.questions[index].correctOptionIndex ? (
                      <Check color="success" />
                    ) : (
                      <Close color="error" />
                    )
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </>
      ) : (
        // Completion Screen
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <EmojiEvents sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom>
            Congratulations! You've completed this lesson!
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            You answered {answers.filter(
              (answer, index) => answer === content.questions[index].correctOptionIndex
            ).length} out of {content.questions.length} questions correctly.
          </Typography>
          
          <Chip 
            label={`+${lesson.xpReward} XP`} 
            color="primary"
            sx={{ fontSize: '1.2rem', p: 2, mb: 3 }}
          />
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleComplete}
            endIcon={<ArrowForward />}
          >
            Continue to Next Lesson
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MultipleChoiceLesson;