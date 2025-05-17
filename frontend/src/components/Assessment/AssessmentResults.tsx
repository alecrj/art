// frontend/src/components/Assessment/AssessmentResults.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  Alert,
  Divider,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  EmojiEvents,
  AutoAwesome,
  TrendingUp,
  PlayArrow,
  CheckCircle,
  Psychology,
  Palette,
  School
} from '@mui/icons-material';
import { AssessmentResult } from '../../types/assessment';

interface AssessmentResultsProps {
  result: AssessmentResult;
  imageUrl: string;
  onStartLearning: () => void;
  onTryAgain: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  result,
  imageUrl,
  onStartLearning,
  onTryAgain
}) => {
  // Path display info
  const pathInfo = {
    foundation_builder: {
      title: 'Foundation Builder',
      subtitle: 'Perfect for building artistic confidence!',
      icon: <School />,
      color: '#4caf50',
      description: 'Start your artistic journey with fun, confidence-building lessons'
    },
    skill_sharpener: {
      title: 'Skill Sharpener',
      subtitle: 'Level up your existing skills!',
      icon: <TrendingUp />,
      color: '#2196f3',
      description: 'Refine your technique with targeted improvements'
    },
    master_class: {
      title: 'Master Class',
      subtitle: 'Explore new creative horizons!',
      icon: <Psychology />,
      color: '#9c27b0',
      description: 'Push creative boundaries and develop your unique style'
    }
  };

  const currentPath = pathInfo[result.recommendedPath];

  // Skill level display
  const skillLevelInfo = {
    absolute_beginner: { label: 'Starting Your Journey', color: '#4caf50', progress: 10 },
    some_experience: { label: 'Building Skills', color: '#2196f3', progress: 35 },
    intermediate: { label: 'Developing Artist', color: '#ff9800', progress: 65 },
    advanced: { label: 'Skilled Artist', color: '#9c27b0', progress: 90 }
  };

  const skillInfo = skillLevelInfo[result.skillLevel];

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Celebration Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: currentPath.color,
            mx: 'auto',
            mb: 2
          }}
        >
          <EmojiEvents sx={{ fontSize: 40, color: 'white' }} />
        </Avatar>
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {result.celebrationMessage}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {result.encouragement}
        </Typography>
      </Box>

      {/* Your Drawing */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Drawing ✨
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img
              src={imageUrl}
              alt="Your assessment drawing"
              style={{
                maxWidth: '100%',
                maxHeight: 300,
                borderRadius: 8,
                border: '1px solid #e0e0e0'
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Positives Found */}
      <Alert 
        severity="success" 
        icon={<AutoAwesome />}
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" gutterBottom>
          What I Love About Your Art:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          {result.positives.map((positive, index) => (
            <li key={index}>
              <Typography variant="body1">{positive}</Typography>
            </li>
          ))}
        </Box>
      </Alert>

      {/* Skill Assessment */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Psychology sx={{ mr: 1 }} />
            Your Skill Assessment
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">{skillInfo.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {skillInfo.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={skillInfo.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: skillInfo.color
                }
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {result.skillMarkers.map((marker, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {marker.category.replace('_', ' ').toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {marker.description}
                  </Typography>
                  <Chip
                    label={marker.strength}
                    size="small"
                    color={marker.strength === 'solid' ? 'success' : 
                           marker.strength === 'developing' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recommended Learning Path */}
      <Card sx={{ mb: 3, bgcolor: `${currentPath.color}10` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: currentPath.color, mr: 2 }}>
              {currentPath.icon}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {currentPath.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {currentPath.subtitle}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {result.pathReason}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {currentPath.description}
          </Typography>
        </CardContent>
      </Card>

      {/* First Lesson Preview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PlayArrow sx={{ mr: 1 }} />
            Your First Lesson
          </Typography>
          
          <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {result.firstLesson.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {result.firstLesson.description}
            </Typography>
            <Typography variant="body2">
              Duration: {result.firstLesson.duration} • {result.firstLesson.difficulty}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Your Next Steps
          </Typography>
          
          <List dense>
            {result.nextSteps.map((step, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Detected Art Styles */}
      {result.detectedStyles.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Palette sx={{ mr: 1 }} />
              Art Styles Detected
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {result.detectedStyles.map((style, index) => (
                <Chip
                  key={index}
                  label={`${style.style} (${Math.round(style.confidence * 100)}%)`}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={onStartLearning}
          sx={{
            mr: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            bgcolor: currentPath.color
          }}
          startIcon={<PlayArrow />}
        >
          Start My Art Journey! 🎨
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          onClick={onTryAgain}
          sx={{ px: 3, py: 1.5 }}
        >
          Try Another Drawing
        </Button>
      </Box>
    </Box>
  );
};

export default AssessmentResults;