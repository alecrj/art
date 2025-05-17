// frontend/src/pages/Learning/LearningPath.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Chip,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  School,
  Lock,
  CheckCircle,
  Star,
  ArrowBack
} from '@mui/icons-material';

// Import learning path data
import { foundationBuilderPath } from '../../data/foundationPath';
import { Lesson, LearningPath as LearningPathType } from '../../models/learning/LessonTypes';

// Mock user progress
const mockUserProgress = {
  userId: 'user123',
  currentPathId: 'foundation_builder',
  completedLessons: [],
  currentStreak: 0,
  lastPracticeDate: '',
  totalXP: 0,
  level: 1,
  skillProgress: {}
};

const LearningPathPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<LearningPathType | null>(null);
  const [userProgress, setUserProgress] = useState(mockUserProgress);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Fetch path data
  useEffect(() => {
    // In a real app, we would fetch from API
    // For now, use our mock data
    if (pathId === 'foundation_builder') {
      setSelectedPath(foundationBuilderPath);
    }
  }, [pathId]);

  // Calculate path completion
  const completionPercentage = selectedPath
    ? (userProgress.completedLessons.filter(id => 
        selectedPath.lessons.some(lesson => lesson.id === id)
      ).length / selectedPath.lessons.length) * 100
    : 0;

  // Handle lesson selection
  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  // Handle lesson completion
  const handleLessonComplete = (lessonId: string, score: number) => {
    // Update user progress
    const updatedProgress = {
      ...userProgress,
      completedLessons: [...userProgress.completedLessons, lessonId],
      totalXP: userProgress.totalXP + score,
      lastPracticeDate: new Date().toISOString()
    };
    
    setUserProgress(updatedProgress);
    setSelectedLesson(null);
    
    // In a real app, we would save this to backend
    console.log('Lesson completed:', lessonId, 'Score:', score);
  };

  // Exit lesson view
  const handleExitLesson = () => {
    setSelectedLesson(null);
  };

  // Check if a lesson is unlocked
  const isLessonUnlocked = (lesson: Lesson, index: number) => {
    if (index === 0) return true;
    
    // If previous lesson is completed, unlock this one
    const prevLesson = selectedPath?.lessons[index - 1];
    return prevLesson && userProgress.completedLessons.includes(prevLesson.id);
  };

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: string) => {
    return userProgress.completedLessons.includes(lessonId);
  };

  // If no path is selected or loading
  if (!selectedPath) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5">Loading learning path...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Container>
    );
  }

  // If a lesson is selected, show lesson view
  if (selectedLesson) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleExitLesson}
          >
            Back to {selectedPath.title}
          </Button>
        </Box>
        
        {/* Render lesson component from LessonContainer */}
        <Typography variant="h6">
          This is where we would render the LessonContainer component
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            In a real implementation, this would render the LessonContainer component with the selected lesson data.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => handleLessonComplete(selectedLesson.id, selectedLesson.xpReward)}
            sx={{ mt: 2 }}
          >
            Simulate Lesson Completion
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Path Header */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: selectedPath.color,
              mr: 2 
            }}
          >
            <School sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              {selectedPath.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedPath.description}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Your progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{ width: 200, mr: 2, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2">
                {Math.round(completionPercentage)}%
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ color: 'primary.main', mr: 1 }} />
              {userProgress.totalXP} XP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Level {userProgress.level}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Lessons List */}
      <Grid container spacing={3}>
        {selectedPath.lessons.map((lesson, index) => {
          const isUnlocked = isLessonUnlocked(lesson, index);
          const isCompleted = isLessonCompleted(lesson.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  opacity: isUnlocked ? 1 : 0.7,
                  border: isCompleted ? '2px solid #4caf50' : undefined
                }}
              >
                <CardActionArea
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && handleLessonSelect(lesson)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Typography variant="h6" component="h2">
                        {lesson.title}
                      </Typography>
                      
                      {isCompleted ? (
                        <CheckCircle color="success" />
                      ) : !isUnlocked ? (
                        <Lock color="disabled" />
                      ) : (
                        <Chip 
                          label={`${lesson.xpReward} XP`} 
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {lesson.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 'auto'
                    }}>
                      <Chip
                        label={lesson.difficulty}
                        size="small"
                        variant="outlined"
                      />
                      
                      <Typography variant="caption" color="text.secondary">
                        {Math.floor(lesson.duration / 60)} min
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default LearningPathPage;