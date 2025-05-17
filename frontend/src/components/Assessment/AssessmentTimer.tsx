// frontend/src/components/Assessment/AssessmentTimer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import { Timer, PlayArrow, Stop } from '@mui/icons-material';

interface AssessmentTimerProps {
  duration: number; // Duration in seconds
  onStart: () => void;
  onComplete: () => void;
  onTick?: (remainingTime: number) => void;
  autoStart?: boolean;
  disabled?: boolean;
}

const AssessmentTimer: React.FC<AssessmentTimerProps> = ({
  duration,
  onStart,
  onComplete,
  onTick,
  autoStart = false,
  disabled = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Start timer
  const startTimer = useCallback(() => {
    if (disabled || isCompleted) return;
    
    setIsRunning(true);
    onStart();
  }, [disabled, isCompleted, onStart]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setTimeRemaining(duration);
    setIsRunning(false);
    setIsCompleted(false);
  }, [duration]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isCompleted) {
      startTimer();
    }
  }, [autoStart, isCompleted, startTimer]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime <= 0) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, onTick, onComplete]);

  // Calculate progress percentage
  const progress = ((duration - timeRemaining) / duration) * 100;
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (): 'primary' | 'warning' | 'error' => {
    const percentRemaining = (timeRemaining / duration) * 100;
    if (percentRemaining > 50) return 'primary';
    if (percentRemaining > 20) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      {/* Time display */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Timer sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="div" color={getTimerColor()}>
          {formatTime(timeRemaining)}
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={getTimerColor()}
          sx={{
            height: 8,
            borderRadius: 4,
            transition: 'all 0.3s ease'
          }}
        />
      </Box>

      {/* Status indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {!isRunning && !isCompleted && (
          <Chip
            icon={<PlayArrow />}
            label="Ready to start"
            color="primary"
            variant="outlined"
            onClick={startTimer}
            disabled={disabled}
            sx={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          />
        )}
        
        {isRunning && (
          <Chip
            icon={<Stop />}
            label="Drawing in progress..."
            color={getTimerColor()}
            variant="filled"
          />
        )}
        
        {isCompleted && (
          <Chip
            icon={<Timer />}
            label="Time's up! Great job!"
            color="success"
            variant="filled"
          />
        )}
      </Box>

      {/* Motivational messages during drawing */}
      {isRunning && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {timeRemaining > 20 && "Draw whatever comes to mind! 🎨"}
            {timeRemaining <= 20 && timeRemaining > 10 && "Keep going, you're doing great! ✨"}
            {timeRemaining <= 10 && timeRemaining > 5 && "Almost there! 🚀"}
            {timeRemaining <= 5 && timeRemaining > 0 && "Final touches! 🌟"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AssessmentTimer;