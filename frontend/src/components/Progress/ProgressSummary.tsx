// frontend/src/components/Progress/ProgressSummary.tsx
import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Grid, 
  Chip,
  Avatar,
  Button
} from '@mui/material';
import { 
  LocalFireDepartment, 
  EmojiEvents, 
  School,
  Timeline
} from '@mui/icons-material';
import { useProgress } from '../../contexts/ProgressContext';
import { useNavigate } from 'react-router-dom';

const ProgressSummary: React.FC = () => {
  const { userProgress, loading } = useProgress();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading your progress...</Typography>
      </Box>
    );
  }
  
  if (!userProgress) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">No progress data available</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/assessment')}
        >
          Take Assessment
        </Button>
      </Box>
    );
  }
  
  // Calculate the XP progress to next level
  const xpForCurrentLevel = (userProgress.level - 1) * 100;
  const xpProgress = userProgress.totalXp - xpForCurrentLevel;
  const xpToNextLevel = 100; // 100 XP per level
  const xpPercentage = (xpProgress / xpToNextLevel) * 100;
  
  // Get active paths sorted by last accessed
  const activePaths = Object.values(userProgress.activePaths || {})
    .sort((a, b) => {
      if (!a.lastAccessed) return 1;
      if (!b.lastAccessed) return -1;
      return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    })
    .slice(0, 3); // Show top 3 active paths
  
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Your Progress
        </Typography>
        
        <Grid container spacing={3}>
          {/* Streak */}
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'primary.light', 
                color: 'white',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <LocalFireDepartment sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0 }}>
                {userProgress.currentStreak}
              </Typography>
              <Typography variant="subtitle1">
                Day Streak
              </Typography>
              <Typography variant="caption">
                Longest: {userProgress.longestStreak} days
              </Typography>
            </Box>
          </Grid>
          
          {/* Level */}
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: 'secondary.light', 
                color: 'white',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0 }}>
                {userProgress.level}
              </Typography>
              <Typography variant="subtitle1">
                Artist Level
              </Typography>
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={xpPercentage} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white'
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'white', mt: 0.5, display: 'block' }}>
                  {xpProgress} / {xpToNextLevel} XP to level {userProgress.level + 1}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Total XP */}
          <Grid item xs={12} sm={4}>
            <Box 
              sx={{ 
                p: 2, 
                textAlign: 'center', 
                bgcolor: '#9c27b0', 
                color: 'white',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <School sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0 }}>
                {userProgress.totalXp}
              </Typography>
              <Typography variant="subtitle1">
                Total XP
              </Typography>
              <Typography variant="caption">
                From {Object.keys(userProgress.activePaths || {}).length} learning paths
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {/* Active Paths */}
        {activePaths.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Learning Paths
            </Typography>
            
            <Grid container spacing={2}>
              {activePaths.map((path) => (
                <Grid item xs={12} key={path.id}>
                  <Card variant="outlined" sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: path.id === 'foundation_builder' ? '#4caf50' : 
                                     path.id === 'skill_sharpener' ? '#2196f3' : '#9c27b0' 
                            }}
                          >
                            <Timeline />
                          </Avatar>
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="h6">{path.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                {path.lessonsCompleted} / {path.totalLessons} lessons • {path.xpEarned} XP
                              </Typography>
                              <Chip 
                                size="small" 
                                label={`${Math.round((path.lessonsCompleted / path.totalLessons) * 100)}%`} 
                                sx={{ ml: 1 }}
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => navigate(`/learning-path/${path.id}`)}
                        >
                          Continue
                        </Button>
                      </Box>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={(path.lessonsCompleted / path.totalLessons) * 100} 
                        sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              {activePaths.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center', width: '100%' }}>
                  <Typography variant="body1">
                    No active learning paths yet. Start your journey!
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/assessment')}
                  >
                    Take Assessment
                  </Button>
                </Box>
              )}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressSummary;