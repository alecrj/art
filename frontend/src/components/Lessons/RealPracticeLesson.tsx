// frontend/src/components/Lessons/RealPracticeLesson.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircleOutline,
  Timer,
  LightbulbOutlined,
  ArrowForward,
  ImageOutlined,
  EmojiEvents
} from '@mui/icons-material';
import { Lesson } from '../../models/learning/LessonTypes';

interface RealPracticeLessonProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
}

const RealPracticeLesson: React.FC<RealPracticeLessonProps> = ({ lesson, onComplete }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const content = lesson.content as any;
  
  const handleComplete = () => {
    setIsComplete(true);
  };
  
  const handleContinue = () => {
    onComplete(lesson.xpReward);
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Real-World Practice Exercise
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            {content.introduction}
          </Typography>
        </Alert>
        
        <Box sx={{ mb: 4 }}>
          <Chip 
            icon={<Timer />} 
            label={`Estimated time: ${content.timeEstimate}`} 
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Typography variant="h6" gutterBottom>
            Instructions:
          </Typography>
          
          <List>
            {content.instructions.map((instruction: string, index: number) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleOutline color="primary" />
                </ListItemIcon>
                <ListItemText primary={instruction} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LightbulbOutlined sx={{ mr: 1 }} />
            Tips for Success:
          </Typography>
          
          <List dense>
            {content.tips.map((tip: string, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {!isComplete ? (
            <>
              <Typography variant="body1" gutterBottom>
                {content.completionCriteria}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ImageOutlined />}
                onClick={() => setDialogOpen(true)}
                sx={{ mr: 2 }}
              >
                Upload Practice Photo
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleComplete}
              >
                Mark as Complete
              </Button>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <EmojiEvents sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Congratulations! You've completed this practice exercise!
              </Typography>
              
              <Chip 
                label={`+${lesson.xpReward} XP`} 
                color="primary"
                sx={{ fontSize: '1.1rem', p: 1, mb: 3 }}
              />
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleContinue}
                endIcon={<ArrowForward />}
              >
                Continue to Next Lesson
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Upload Your Practice</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Upload a photo of your practice drawing to get feedback.
          </Typography>
          {/* Upload component would go here */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: This feature is coming soon! For now, you can simply mark the lesson as complete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setDialogOpen(false);
              handleComplete();
            }}
            variant="contained"
          >
            Mark as Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RealPracticeLesson;