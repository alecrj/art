import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { analyzeArtwork } from '../services/ai';
import { uploadImage } from '../services/storage';

const router = express.Router();
const upload = multer({ 
  memory: true,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') }
});

// POST /api/art/analyze - Upload and analyze artwork
router.post('/analyze', upload.single('artwork'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No artwork uploaded' });
    }

    // Process image
    const processedBuffer = await sharp(req.file.buffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const filename = `artwork_${uuidv4()}.jpg`;
    
    // Upload to storage
    const imageUrl = await uploadImage(processedBuffer, filename);
    
    // Analyze with AI
    const analysis = await analyzeArtwork(imageUrl, req.body.notes || '');
    
    res.json({
      success: true,
      imageUrl,
      analysis,
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

// GET /api/art/history - Get user's artwork history
router.get('/history', (req, res) => {
  // TODO: Implement artwork history retrieval
  res.json({ 
    artworks: [],
    message: 'History endpoint - coming soon' 
  });
});

export default router;
