// backend/src/routes/assessment.ts
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from '../services/storage';
import { verifyToken } from '../middleware/auth';
import { detectSkillLevel } from '../assessment/skillDetector';
import { assignLearningPath, generateCelebrationMessage, generateEncouragement } from '../assessment/pathAssigner';
import { AssessmentResult } from '../models/assessment/Assessment';

const router = express.Router();

// Configure multer for assessment uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') }
});

// POST /api/assessment/analyze - Analyze 30-second drawing for skill assessment
router.post('/analyze', verifyToken, upload.single('drawing'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No drawing uploaded' });
    }

    // Get authenticated user
    const userId = req.user.uid;
    const userEmail = req.user.email;

    console.log(`Processing assessment for user: ${userEmail}`);

    // Extract assessment data
    const drawingTime = parseInt(req.body.drawingTime) || 30;
    const deviceType = req.body.deviceType || 'web';
    const userNotes = req.body.notes || '';

    // Process image
    const processedBuffer = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename for assessment
    const filename = `assessment_${userId}_${uuidv4()}.jpg`;
    
    // Upload to storage
    const imageUrl = await uploadImage(processedBuffer, filename);
    
    // Detect skill level and analyze artwork
    const skillAnalysis = await detectSkillLevel(imageUrl, drawingTime);
    
    // Assign learning path based on analysis
    const pathAssignment = assignLearningPath(skillAnalysis);
    
    // Generate celebration and encouragement
    const celebrationMessage = generateCelebrationMessage(skillAnalysis, pathAssignment.path);
    const encouragement = generateEncouragement(skillAnalysis);
    
    // Create assessment result
    const assessmentResult: AssessmentResult = {
      // Celebration & Positives
      celebrationMessage,
      positives: skillAnalysis.positives,
      encouragement,
      
      // Skill Detection
      skillLevel: skillAnalysis.skillLevel,
      skillMarkers: skillAnalysis.skillMarkers,
      
      // Path Assignment
      recommendedPath: pathAssignment.path,
      pathReason: pathAssignment.reason,
      
      // Art Style Detection
      detectedStyles: skillAnalysis.detectedStyles,
      
      // Next Steps
      nextSteps: pathAssignment.nextSteps,
      firstLesson: pathAssignment.firstLesson,
      
      // Metadata
      analysisId: uuidv4(),
      timestamp: new Date().toISOString(),
      model: 'gpt-4-vision-assessment'
    };

    // TODO: Save assessment to database
    console.log(`Assessment completed - Path: ${pathAssignment.path}, Level: ${skillAnalysis.skillLevel}`);
    
    res.json({
      success: true,
      imageUrl,
      assessment: assessmentResult,
      user: {
        id: userId,
        email: userEmail
      },
      metadata: {
        originalSize: req.file.size,
        processedSize: processedBuffer.length,
        drawingTime,
        deviceType
      }
    });

  } catch (error) {
    console.error('Error in assessment analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze assessment drawing',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/assessment/paths - Get information about learning paths
router.get('/paths', (req, res) => {
  const paths = {
    foundation_builder: {
      id: 'foundation_builder',
      title: 'Foundation Builder',
      description: 'Perfect for beginners! Build confidence with art basics through fun, bite-sized lessons.',
      target_users: 'Complete beginners to art',
      lesson_count: 15,
      duration_per_lesson: '2-3 minutes',
      sample_lessons: [
        'Your First Circle',
        'Confident Lines',
        'Basic Shapes',
        'Simple Objects'
      ]
    },
    skill_sharpener: {
      id: 'skill_sharpener',
      title: 'Skill Sharpener',
      description: 'Level up your existing skills with targeted technique improvements.',
      target_users: 'Artists with basic foundation skills',
      lesson_count: 20,
      duration_per_lesson: '3-4 minutes',
      sample_lessons: [
        'Line Variation Mastery',
        'Advanced Shading',
        'Composition Rules',
        'Style Development'
      ]
    },
    master_class: {
      id: 'master_class',
      title: 'Master Class',
      description: 'Explore artistic styles and push creative boundaries.',
      target_users: 'Intermediate to advanced artists',
      lesson_count: 25,
      duration_per_lesson: '4-6 minutes',
      sample_lessons: [
        'Finding Your Style',
        'Advanced Techniques',
        'Creative Exploration',
        'Portfolio Development'
      ]
    }
  };

  res.json({ paths });
});

// GET /api/assessment/user-profile - Get user's assessment profile
router.get('/user-profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // TODO: Retrieve from database
    // For now, return placeholder
    res.json({
      message: 'User assessment profile - ready for database integration',
      userId,
      needsAssessment: true
    });

  } catch (error) {
    console.error('Error fetching user assessment profile:', error);
    res.status(500).json({ error: 'Failed to fetch assessment profile' });
  }
});

export default router;