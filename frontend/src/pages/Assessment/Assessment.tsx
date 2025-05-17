// frontend/src/pages/Assessment/Assessment.tsx
import React, { useState, useCallback, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Timer, Brush, Analytics, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import DrawingCanvas from '../../components/Assessment/DrawingCanvas';
import AssessmentTimer from '../../components/Assessment/AssessmentTimer';
import AssessmentResults from '../../components/Assessment/AssessmentResults';
import { useAssessment } from '../../hooks/useAssessment';
import { AssessmentRequest } from '../../types/assessment';

const ASSESSMENT_DURATION = 30; // 30 seconds

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const { isAnalyzing, assessmentResult, error, analyzeDrawing, reset } = useAssessment();

  const steps = ['Welcome', 'Draw', 'Analyzing', 'Results'];

  // Handle canvas drawing changes
  const handleDrawingChange = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  // Handle timer start
  const handleTimerStart = useCallback(() => {
    setIsTimerStarted(true);
    setCurrentStep(1);
  }, []);

  // Handle timer completion
  const handleTimerComplete = useCallback(async () => {
    setIsDrawingComplete(true);
    setCurrentStep(2);

    if (!canvasRef.current) {
      console.error('No canvas available for analysis');
      return;
    }

    const request: AssessmentRequest = {
      drawingTime: ASSESSMENT_DURATION,
      deviceType: isMobile ? 'mobile' : 'web'
    };

    await analyzeDrawing(canvasRef.current, request);
    
    if (!error) {
      setCurrentStep(3);
    }
  }, [isMobile, analyzeDrawing, error]);

  // Handle start learning
  const handleStartLearning = useCallback(() => {
    // Navigate to the assigned learning path
    if (assessmentResult?.assessment.recommendedPath) {
      navigate('/learning-path', { 
        state: { 
          path: assessmentResult.assessment.recommendedPath,
          assessment: assessmentResult.assessment
        }
      });
    }
  }, [navigate, assessmentResult]);

  // Handle try again
  const handleTryAgain = useCallback(() => {
    reset();
    setCurrentStep(0);
    setIsTimerStarted(false);
    setIsDrawingComplete(false);
    canvasRef.current = null;
  }, [reset]);

  // Start initial step
  const handleStartAssessment = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Progress Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                icon={
                  index === 0 ? <School /> :
                  index === 1 ? <Brush /> :
                  index === 2 ? <Analytics /> :
                  <Timer />
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Welcome Step */}
      {currentStep === 0 && (
        <Fade in>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <CardContent>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Welcome to Your Art Journey! 🎨
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Let's discover your artistic potential with a quick 30-second drawing
              </Typography>

              <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Here's how it works:
                </Typography>
                
                <Box sx={{ textAlign: 'left', display: 'inline-block' }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    ✏️ Draw anything you want for 30 seconds
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    🤖 Our AI will find what's awesome about your art
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    🎯 Get matched to the perfect learning path
                  </Typography>
                  <Typography variant="body1">
                    🚀 Start your personalized art journey!
                  </Typography>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                <Typography variant="body2">
                  <strong>Pro tip:</strong> Don't worry about perfection! We're looking for your creative spirit, not a masterpiece. Draw whatever feels natural to you.
                </Typography>
              </Alert>

              <Button
                variant="contained"
                size="large"
                onClick={handleStartAssessment}
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                startIcon={<Brush />}
              >
                Let's Start Drawing!
              </Button>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Drawing Step */}
      {currentStep === 1 && (
        <Fade in>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Draw Anything You Want! ✨
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Express yourself freely - there are no wrong answers
            </Typography>

            <Box sx={{ mb: 3 }}>
              <AssessmentTimer
                duration={ASSESSMENT_DURATION}
                onStart={handleTimerStart}
                onComplete={handleTimerComplete}
                autoStart={false}
                disabled={isDrawingComplete}
              />
            </Box>

            <DrawingCanvas
              onDrawingChange={handleDrawingChange}
              disabled={!isTimerStarted || isDrawingComplete}
              width={isMobile ? 300 : 400}
              height={isMobile ? 300 : 400}
            />

            {!isTimerStarted && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Click the timer to start when you're ready!
              </Typography>
            )}
          </Box>
        </Fade>
      )}

      {/* Analyzing Step */}
      {currentStep === 2 && (
        <Fade in>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={80} sx={{ mb: 3 }} />
            
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Analyzing Your Amazing Art! 🎨
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Our AI is finding all the wonderful things about your drawing...
            </Typography>

            <Typography variant="body1" color="text.secondary">
              This usually takes just a few seconds ✨
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 3, maxWidth: 500, mx: 'auto' }}>
                <Typography variant="body2">
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleTryAgain}
                  sx={{ mt: 1 }}
                >
                  Try Again
                </Button>
              </Alert>
            )}
          </Box>
        </Fade>
      )}

      {/* Results Step */}
      {currentStep === 3 && assessmentResult && (
        <Fade in>
          <AssessmentResults
            result={assessmentResult.assessment}
            imageUrl={assessmentResult.imageUrl}
            onStartLearning={handleStartLearning}
            onTryAgain={handleTryAgain}
          />
        </Fade>
      )}
    </Container>
  );
};

export default Assessment;