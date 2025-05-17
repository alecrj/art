// frontend/src/pages/Dashboard/Dashboard.tsx - Update to include progress summary
import React from 'react';
import { Container, Typography, Box, Paper, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Assessment, Upload } from '@mui/icons-material';
import ProgressSummary from '../../components/Progress/ProgressSummary';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Art Teacher
      </Typography>
      
      {/* Progress Summary */}
      <ProgressSummary />
      
      <Divider sx={{ my: 4 }} />
      
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
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Upload sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Upload Your Artwork
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Get personalized feedback from our AI art instructor
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/upload')}
              fullWidth
            >
              Upload Art
            </Button>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;