import express from 'express';

const router = express.Router();

// GET /api/user/profile - Get user profile
router.get('/profile', (req, res) => {
  // TODO: Implement user profile retrieval
  res.json({ 
    user: {
      id: 'demo-user',
      name: 'Art Student',
      level: 'Beginner'
    },
    message: 'Profile endpoint - coming soon' 
  });
});

// POST /api/user/progress - Update user progress
router.post('/progress', (req, res) => {
  // TODO: Implement progress update
  res.json({ 
    success: true,
    message: 'Progress updated - coming soon' 
  });
});

export default router;
