// frontend/src/pages/Dashboard/Dashboard.tsx
import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Art Teacher
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Upload Your First Artwork
            </Typography>
            <Typography color="text.secondary">
              Get personalized feedback from our AI art instructor
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Track Your Progress
            </Typography>
            <Typography color="text.secondary">
              See how your skills improve over time
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;