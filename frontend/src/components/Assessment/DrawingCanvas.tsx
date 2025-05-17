// frontend/src/components/Assessment/DrawingCanvas.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { Undo, Clear, Brush } from '@mui/icons-material';

interface DrawingCanvasProps {
  onDrawingChange: (canvas: HTMLCanvasElement) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
}

interface Point {
  x: number;
  y: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onDrawingChange, 
  disabled = false,
  width = 400,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas context
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    
    // High DPI support
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Get point from event
  const getPointFromEvent = useCallback((event: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDrawing(true);
    const point = getPointFromEvent(event);
    setCurrentStroke([point]);
  }, [disabled, getPointFromEvent]);

  // Continue drawing
  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const point = getPointFromEvent(event);
    const newStroke = [...currentStroke, point];
    setCurrentStroke(newStroke);

    // Draw the line segment
    if (newStroke.length > 1) {
      const prevPoint = newStroke[newStroke.length - 2];
      
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }, [isDrawing, disabled, currentStroke, getPointFromEvent]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
    
    // Notify parent of drawing change
    const canvas = canvasRef.current;
    if (canvas) {
      onDrawingChange(canvas);
    }
  }, [isDrawing, currentStroke, onDrawingChange]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setStrokes([]);
    setCurrentStroke([]);
    onDrawingChange(canvas);
  }, [onDrawingChange]);

  // Undo last stroke
  const undoStroke = useCallback(() => {
    if (strokes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Remove last stroke
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);

    // Redraw everything
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all remaining strokes
    newStrokes.forEach(stroke => {
      if (stroke.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });

    onDrawingChange(canvas);
  }, [strokes, onDrawingChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {/* Canvas */}
      <Paper 
        elevation={3}
        sx={{ 
          position: 'relative',
          border: disabled ? '2px solid #e0e0e0' : '2px solid #1976d2',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            display: 'block',
            cursor: disabled ? 'not-allowed' : 'crosshair',
            width: `${width}px`,
            height: `${height}px`,
            opacity: disabled ? 0.6 : 1
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Canvas overlay with instructions */}
        {strokes.length === 0 && !disabled && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#999',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            <Brush sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ opacity: 0.7 }}>
              Draw anything!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              Express yourself freely
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Canvas controls */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Undo last stroke">
          <IconButton
            onClick={undoStroke}
            disabled={disabled || strokes.length === 0}
            size="small"
          >
            <Undo />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Clear canvas">
          <IconButton
            onClick={clearCanvas}
            disabled={disabled || strokes.length === 0}
            size="small"
            color="error"
          >
            <Clear />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default DrawingCanvas;