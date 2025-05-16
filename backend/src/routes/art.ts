// backend/src/routes/art.ts - Updated with Authentication
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { analyzeArtwork } from '../services/ai';
import { uploadImage } from '../services/storage';
import { verifyToken, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Fixed multer configuration
const upload = multer({ 
  storage: multer.memoryStorage(), // Changed from memory: true
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') }
});

// POST /api/art/analyze - Upload and analyze artwork (PROTECTED)
router.post('/analyze', verifyToken, upload.single('artwork'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No artwork uploaded' });
    }

    // Get authenticated user
    const userId = req.user.uid;
    const userEmail = req.user.email;

    console.log(`Processing artwork for user: ${userEmail}`);

    // Process image
    const processedBuffer = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename with user context
    const filename = `artwork_${userId}_${uuidv4()}.jpg`;
    
    // Upload to storage
    const imageUrl = await uploadImage(processedBuffer, filename);
    
    // Analyze with AI (include user context)
    const analysis = await analyzeArtwork(imageUrl, req.body.notes || '', {
      userId,
      userEmail,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      imageUrl,
      analysis,
      user: {
        id: userId,
        email: userEmail
      },
      metadata: {
        originalSize: req.file.size,
        processedSize: processedBuffer.length,
        dimensions: req.body.dimensions || 'auto-detected'
      }
    });
  } catch (error) {
    console.error('Error analyzing artwork:', error);
    res.status(500).json({ error: 'Failed to analyze artwork' });
  }
});

// GET /api/art/history - Get user's artwork history (PROTECTED)
router.get('/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // TODO: Implement actual history retrieval from database
    // For now, return placeholder with user context
    res.json({ 
      artworks: [],
      userId,
      message: 'History endpoint - ready for database integration'
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch artwork history' });
  }
});

// GET /api/art/public - Get public artworks (NO AUTH REQUIRED)
router.get('/public', optionalAuth, (req, res) => {
  // Public artwork gallery - no auth required
  res.json({ 
    artworks: [],
    message: 'Public gallery - coming soon' 
  });
});

export default router;