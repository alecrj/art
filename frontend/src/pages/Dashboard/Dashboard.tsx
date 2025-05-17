// frontend/src/pages/Dashboard/Dashboard.tsx
import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assessment, Upload, School, LocalFireDepartment } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Art Teacher
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, textAlign: 'center', border: '2px solid', borderColor: 'primary.main' }}>
            <Assessment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Take Your Art Assessment
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Draw for 30 seconds and discover your perfect learning path
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/assessment')}
              fullWidth
            >
              Start Assessment 🎨
            </Button>
          </Paper>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, textAlign: 'center', border: '2px solid', borderColor: 'success.main' }}>
            <School sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Start Foundation Builder
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Quick, fun exercises to build your art confidence
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/learning-path/foundation_builder')}
              fullWidth
              color="success"
            >
              Start Learning 🚀
            </Button>
          </Paper>
        </Box>
      </Box>
      
      {/* Daily streak reminder */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: '#FFF9C4', borderLeft: '4px solid #FBC02D' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalFireDepartment sx={{ color: '#F57F17', fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h6">
              Keep your daily art streak alive!
            </Typography>
            <Typography variant="body2">
              Just 5 minutes a day will transform your art skills. Complete one exercise to maintain your streak.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;