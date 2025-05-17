// backend/src/app.ts - Update to include progress routes
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Initialize Firebase Admin
import initializeFirebase from './config/firebase';
initializeFirebase();

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import artRoutes from './routes/art';
import userRoutes from './routes/user';
import assessmentRoutes from './routes/assessment';
import progressRoutes from './routes/progress'; // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    firebase: 'initialized'
  });
});

// Routes
app.use('/api/art', artRoutes);
app.use('/api/user', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/progress', progressRoutes); // Add this line

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔥 Firebase Admin: initialized`);
});

export default app;