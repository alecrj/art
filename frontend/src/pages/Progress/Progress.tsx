import React from 'react';
import { Container, Typography } from '@mui/material';

const Progress: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Progress
      </Typography>
      <Typography>Coming soon: Track your artistic journey!</Typography>
    </Container>
  );
};

export default Progress;
