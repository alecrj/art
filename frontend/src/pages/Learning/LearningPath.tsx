// frontend/src/pages/Learning/LearningPath.tsx - Update to use progress
import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Check, 
  Lock, 
  PlayArrow,
  ArrowBack
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import LessonContainer from '../../components/Lessons/LessonContainer';
import api from '../../services/api';

// Import Foundation Path Data
import { foundationPath } from '../../data/foundationPath';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'quickDraw' | 'multipleChoice' | 'realPractice';
  xpReward: number;
  content: any;
}

interface LearningPathData {
  id: string;
  title: string;
  description: string;
  level: string;
  lessons: Lesson[];
}

const LearningPath: React.FC = () => {
  const { pathId, lessonId } = useParams<{ pathId: string; lessonId: string }>();
  const { userProgress, completeLesson, startLesson } = useProgress();
  const navigate = useNavigate();
  
  const [path, setPath] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [pathProgress, setPathProgress] = useState<any>(null);
  
  // Load path data
  useEffect(() => {
    if (!pathId) return;
    
    const fetchPath = async () => {
      setLoading(true);
      try {
        // In production, we'd load this from the API
        // For now, we'll use the mock data for foundation path
        let pathData;
        
        if (pathId === 'foundation_builder') {
          pathData = foundationPath;
        } else {
          // Fetch from API when we have more paths
          try {
            const response = await api.get(`/learning-paths/${pathId}`);
            pathData = response.data.path;
          } catch (error) {
            console.error('Failed to load path:', error);
            // Fallback to foundation path
            pathData = foundationPath;
          }
        }
        
        setPath(pathData);
        
        // If we have a lesson ID, set it as active
        if (lessonId) {
          const lesson = pathData.lessons.find((l: Lesson) => l.id === lessonId);
          if (lesson) {
            setActiveLesson(lesson);
            // Mark as started
            startLesson(pathId, lessonId);
          }
        }
        
        // Get progress for this path
        if (userProgress?.activePaths?.[pathId]) {
          setPathProgress(userProgress.activePaths[pathId]);
        } else {
          setPathProgress({
            id: pathId,
            title: pathData.title,
            lessonsCompleted: 0,
            totalLessons: pathData.lessons.length,
            xpEarned: 0,
            lessons: {}
          });
        }
      } catch (error) {
        console.error('Failed to load path:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPath();
  }, [pathId, lessonId, userProgress, startLesson]);
  
  // Handle lesson completion
  const handleLessonComplete = async (xpEarned: number) => {
    if (!pathId || !activeLesson) return;
    
    // Update progress
    await completeLesson(pathId, activeLesson.id, xpEarned);
    
    // Back to path overview
    setActiveLesson(null);
    navigate(`/learning-path/${pathId}`);
  };
  
  // Determine if a lesson is unlocked
  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    
    if (!pathProgress) return false;
    
    // Check if previous lesson is completed
    const prevLesson = path?.lessons[index - 1];
    return prevLesson && pathProgress.lessons[prevLesson.id]?.completed;
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading learning path...
        </Typography>
      </Container>
    );
  }
  
  if (!path) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6">
          Learning path not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  // If we have an active lesson, show the lesson container
  if (activeLesson) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => {
            setActiveLesson(null);
            navigate(`/learning-path/${pathId}`);
          }}
          sx={{ mb: 2 }}
        >
          Back to Learning Path
        </Button>
        
        <LessonContainer 
          lesson={activeLesson}
          onComplete={handleLessonComplete}
        />
      </Container>
    );
  }
  
  // Calculate progress percentage
  const lessonsCompleted = pathProgress?.lessonsCompleted || 0;
  const totalLessons = path.lessons.length;
  const progressPercentage = totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0;
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button 
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {path.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {path.description}
              </Typography>
              <Chip 
                label={path.level} 
                color="primary" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6">
                {lessonsCompleted} / {totalLessons} Lessons
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pathProgress?.xpEarned || 0} XP Earned
              </Typography>
              
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ mt: 1, height: 8, borderRadius: 4, width: 200 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      <Typography variant="h5" gutterBottom>
        Lessons
      </Typography>
      
      <Stepper 
        nonLinear 
        activeStep={-1}
        sx={{ 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'flex-start',
          mb: 4
        }}
      >
        {path.lessons.map((lesson, index) => {
          const isCompleted = pathProgress?.lessons?.[lesson.id]?.completed;
          const isUnlocked = isLessonUnlocked(index);
          
          return (
            <Step key={lesson.id} sx={{ width: '100%', mb: { xs: 2, md: 0 } }}>
              <StepButton
                onClick={() => {
                  if (isUnlocked) {
                    setActiveLesson(lesson);
                    navigate(`/learning-path/${pathId}/lesson/${lesson.id}`);
                  }
                }}
                disabled={!isUnlocked}
                sx={{
                  width: '100%',
                  '& .MuiStepLabel-iconContainer': {
                    paddingRight: 2
                  }
                }}
                icon={
                  isCompleted ? (
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                      <Check sx={{ fontSize: 18 }} />
                    </Avatar>
                  ) : isUnlocked ? (
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <PlayArrow sx={{ fontSize: 18 }} />
                    </Avatar>
                  ) : (
                    <Avatar sx={{ bgcolor: 'grey.400', width: 32, height: 32 }}>
                      <Lock sx={{ fontSize: 18 }} />
                    </Avatar>
                  )
                }
              >
                <Box sx={{ textAlign: 'left', p: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: isCompleted ? 'bold' : 'normal' }}>
                    {lesson.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lesson.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1 }}>
                    <Chip 
                      label={lesson.type === 'quickDraw' ? 'Quick Draw' : 
                             lesson.type === 'multipleChoice' ? 'Multiple Choice' : 
                             'Real Practice'} 
                      size="small" 
                      variant="outlined"
                      color={isCompleted ? 'success' : 'default'}
                    />
                    <Chip 
                      label={`${lesson.xpReward} XP`} 
                      size="small"
                      variant="outlined"
                      color={isCompleted ? 'success' : 'default'}
                    />
                  </Box>
                </Box>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        {progressPercentage === 100 ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🎉 You've completed all lessons in this path! 🎉
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Complete all lessons to master this path!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default LearningPath;