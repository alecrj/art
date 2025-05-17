// backend/src/routes/progress.ts
import express from 'express';
import { verifyToken } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import admin from '../config/firebase';

const router = express.Router();
const db = admin.firestore();

// GET /api/progress/user - Get user progress
router.get('/user', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  
  // Get user progress from Firestore
  const progressDoc = await db.collection('userProgress').doc(userId).get();
  
  if (!progressDoc.exists) {
    // Initialize progress if not found
    return res.json({
      progress: {
        currentStreak: 0,
        longestStreak: 0,
        totalXp: 0,
        level: 1,
        completedPaths: [],
        activePaths: {},
        achievements: [],
        lastActive: null
      }
    });
  }
  
  res.json({ progress: progressDoc.data() });
}));

// POST /api/progress/update - Update user progress
router.post('/update', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { pathId, lessonId, xpEarned, completed, started } = req.body;
  
  // Get current progress
  const progressRef = db.collection('userProgress').doc(userId);
  const progressDoc = await progressRef.get();
  
  // Initialize if not found
  if (!progressDoc.exists) {
    await progressRef.set({
      currentStreak: 0,
      longestStreak: 0,
      totalXp: 0,
      level: 1,
      completedPaths: [],
      activePaths: {},
      achievements: [],
      lastActive: null
    });
  }
  
  // Get path information
  const pathRef = db.collection('learningPaths').doc(pathId);
  const pathDoc = await pathRef.get();
  
  if (!pathDoc.exists) {
    return res.status(404).json({ error: `Learning path ${pathId} not found` });
  }
  
  const pathData = pathDoc.data();
  const totalLessons = pathData?.lessons?.length || 0;
  
  // Transaction to update progress
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(progressRef);
    const data = doc.data() || {
      currentStreak: 0,
      longestStreak: 0,
      totalXp: 0,
      level: 1,
      completedPaths: [],
      activePaths: {},
      achievements: [],
      lastActive: null
    };
    
    // Create path if it doesn't exist
    if (!data.activePaths[pathId]) {
      data.activePaths[pathId] = {
        id: pathId,
        title: pathData?.title || pathId,
        lessonsCompleted: 0,
        totalLessons,
        xpEarned: 0,
        lessons: {}
      };
    }
    
    const path = data.activePaths[pathId];
    
    // Create lesson if it doesn't exist
    if (!path.lessons[lessonId]) {
      path.lessons[lessonId] = {
        id: lessonId,
        completed: false,
        xpEarned: 0,
        attempts: 0
      };
    }
    
    const lesson = path.lessons[lessonId];
    
    // Update lesson data
    if (completed) {
      const isNewCompletion = !lesson.completed;
      
      lesson.completed = true;
      lesson.xpEarned = (lesson.xpEarned || 0) + (xpEarned || 0);
      lesson.lastCompleted = new Date().toISOString();
      lesson.attempts = (lesson.attempts || 0) + 1;
      
      // Update path progress
      if (isNewCompletion) {
        path.lessonsCompleted += 1;
        
        // Check if path is completed
        if (path.lessonsCompleted >= path.totalLessons && !data.completedPaths.includes(pathId)) {
          data.completedPaths.push(pathId);
          
          // TODO: Add achievement for completing a path
        }
      }
      
      path.xpEarned += (xpEarned || 0);
      data.totalXp += (xpEarned || 0);
      
      // Update level
      data.level = Math.floor(data.totalXp / 100) + 1;
      
      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const lastActive = data.lastActive?.split('T')[0];
      
      if (lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastActive === yesterdayStr) {
          // Continuing streak
          data.currentStreak += 1;
        } else if (lastActive !== today) {
          // New streak
          data.currentStreak = 1;
        }
        
        // Update longest streak if needed
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak;
        }
      } else {
        // First activity
        data.currentStreak = 1;
        data.longestStreak = 1;
      }
    } else if (started) {
      // Just mark as started/attempted
      lesson.attempts = (lesson.attempts || 0) + 1;
    }
    
    // Update last active timestamp
    path.lastAccessed = new Date().toISOString();
    data.lastActive = new Date().toISOString();
    
    transaction.set(progressRef, data);
  });
  
  res.json({ success: true });
}));

// GET /api/progress/path/:pathId - Get detailed path progress
router.get('/path/:pathId', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { pathId } = req.params;
  
  // Get user progress
  const progressDoc = await db.collection('userProgress').doc(userId).get();
  const userProgress = progressDoc.exists ? progressDoc.data() : null;
  
  // Get path data
  const pathDoc = await db.collection('learningPaths').doc(pathId).get();
  
  if (!pathDoc.exists) {
    return res.status(404).json({ error: `Learning path ${pathId} not found` });
  }
  
  const pathData = pathDoc.data();
  
  // Get user's progress for this path
  const pathProgress = userProgress?.activePaths?.[pathId] || {
    id: pathId,
    title: pathData?.title || pathId,
    lessonsCompleted: 0,
    totalLessons: pathData?.lessons?.length || 0,
    xpEarned: 0,
    lessons: {}
  };
  
  // Merge path data with progress
  const mergedPath = {
    ...pathData,
    progress: pathProgress
  };
  
  res.json({ path: mergedPath });
}));

export default router;