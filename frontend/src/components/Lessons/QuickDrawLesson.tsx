// frontend/src/components/Lessons/QuickDrawLesson.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { Timer, Check, Close } from '@mui/icons-material';
import { QuickDrawLesson as QuickDrawLessonType } from '../../models/learning/LessonTypes';
import DrawingCanvas from '../Assessment/DrawingCanvas';
import AssessmentTimer from '../Assessment/AssessmentTimer';

interface QuickDrawLessonProps {
  lesson: QuickDrawLessonType;
  onComplete: (score: number) => void;
  onProgress: (progress: number) => void;
  disabled: boolean;
}

const QuickDrawLesson: React.FC<QuickDrawLessonProps> = ({
  lesson,
  onComplete,
  onProgress,
  disabled
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update progress
  useEffect(() => {
    if (!isStarted) {
      onProgress(0);
    } else if (isDrawing) {
      onProgress(30);
    } else if (isTimeUp) {
      onProgress(80);
    }
  }, [isStarted, isDrawing, isTimeUp, onProgress]);

  // Handle drawing changes
  const handleDrawingChange = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };

  // Handle timer start
  const handleTimerStart = () => {
    setIsStarted(true);
    setIsDrawing(true);
  };

  // Handle timer complete
  const handleTimerComplete = () => {
    setIsDrawing(false);
    setIsTimeUp(true);
  };

  // Handle submit
  const handleSubmit = () => {
    // In a real app, we would analyze the drawing here
    // For now, we'll just provide positive feedback
    setFeedback('Great job! Your circle shows confidence and a good sense of motion. The line quality is expressive!');
    
    // Calculate a score (in a real app, this would be based on AI analysis)
    const score = Math.floor(Math.random() * 5) + 5; // 5-10 points
    
    // Complete the lesson
    setTimeout(() => {
      onComplete(score);
    }, 2000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Instruction */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {lesson.promptText}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You have {lesson.timeLimit} seconds to complete this exercise.
        </Typography>
      </Box>

      {/* Example Image (if available) */}
      {lesson.exampleImageUrl && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="subtitle2" gutterBottom>
            Example:
          </Typography>
          <img
            src={lesson.exampleImageUrl}
            alt="Example"
            style={{
              maxWidth: '100%',
              maxHeight: 200,
              borderRadius: 8,
              border: '1px solid #e0e0e0'
            }}
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Drawing Area */}
      <Box sx={{ textAlign: 'center' }}>
        {!isStarted ? (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setIsStarted(true)}
              disabled={disabled}
            >
              Start Drawing
            </Button>
          </Box>
        ) : (
          <Box sx={{ mb: 3 }}>
            <AssessmentTimer
              duration={lesson.timeLimit}
              onStart={handleTimerStart}
              onComplete={handleTimerComplete}
              autoStart={true}
              disabled={disabled || isTimeUp}
            />
          </Box>
        )}

        <DrawingCanvas
          onDrawingChange={handleDrawingChange}
          disabled={disabled || !isDrawing && !isStarted}
          width={300}
          height={300}
        />

        {isTimeUp && !feedback && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
            disabled={disabled}
          >
            Submit Drawing
          </Button>
        )}

        {feedback && (
          <Alert severity="success" sx={{ mt: 3, textAlign: 'left' }}>
            {feedback}
          </Alert>
        )}
      </Box>

      {/* Success Criteria */}
      {isStarted && (
        <Paper sx={{ mt: 3, p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" gutterBottom>
            Success Criteria:
          </Typography>
          <Box>
            {lesson.successCriteria.map((criterion, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 1 
                }}
              >
                <Check color="success" sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  {criterion}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default QuickDrawLesson;