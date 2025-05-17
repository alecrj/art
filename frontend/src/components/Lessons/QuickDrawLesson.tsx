// frontend/src/components/Lessons/QuickDrawLesson.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import { Check, Timer, Brush, ArrowForward } from '@mui/icons-material';
import DrawingCanvas from '../Assessment/DrawingCanvas';
import AssessmentTimer from '../Assessment/AssessmentTimer';
import { Lesson } from '../../models/learning/LessonTypes';

interface QuickDrawLessonProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
}

const QuickDrawLesson: React.FC<QuickDrawLessonProps> = ({ lesson, onComplete }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [drawingCanvas, setDrawingCanvas] = useState<HTMLCanvasElement | null>(null);
  
  // Extract content (with type assertion since we know it's QuickDrawContent)
  const content = lesson.content as any;
  
  const handleDrawingChange = (canvas: HTMLCanvasElement) => {
    setDrawingCanvas(canvas);
  };
  
  const handleTimerStart = () => {
    setIsDrawing(true);
  };
  
  const handleTimerComplete = () => {
    setIsDrawing(false);
    setIsComplete(true);
  };
  
  const handleComplete = () => {
    onComplete(lesson.xpReward);
  };
  
  return (
    <Box>
      {/* Instructions */}
      <Box sx={{ mb: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            {content.instructions}
          </Typography>
        </Alert>
        
        <Grid container spacing={3}>
          {/* Success Criteria */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Success Criteria
            </Typography>
            <List dense>
              {content.successCriteria.map((criteria: string, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Check color="success" />
                  </ListItemIcon>
                  <ListItemText primary={criteria} />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          {/* Examples */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Examples
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {content.examples.map((example: any, index: number) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <img 
                    src="https://via.placeholder.com/150" // Placeholder for now
                    alt={example.caption}
                    style={{ width: 120, height: 120, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                  <Typography variant="caption" display="block">
                    {example.caption}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Drawing Area */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Your Drawing
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Chip 
            icon={<Timer />} 
            label={`Time limit: ${content.timeLimit} seconds`}
            color="primary"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <AssessmentTimer
            duration={content.timeLimit}
            onStart={handleTimerStart}
            onComplete={handleTimerComplete}
            autoStart={false}
            disabled={isComplete}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <DrawingCanvas
            onDrawingChange={handleDrawingChange}
            disabled={!isDrawing && isComplete}
            width={400}
            height={400}
          />
        </Box>
        
        {!isDrawing && !isComplete && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click the timer to start your {content.timeLimit}-second drawing exercise!
          </Typography>
        )}
        
        {isComplete && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body1">
                Great job completing this exercise! You've earned {lesson.xpReward} XP.
              </Typography>
            </Alert>
            
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
    </Box>
  );
};

export default QuickDrawLesson;