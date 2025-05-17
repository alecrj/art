// frontend/src/hooks/useAssessment.ts
import { useState, useCallback } from 'react';
import { AssessmentRequest, AssessmentResponse } from '../types/assessment';
import api from '../services/api';

interface UseAssessmentReturn {
  isAnalyzing: boolean;
  assessmentResult: AssessmentResponse | null;
  error: string | null;
  analyzeDrawing: (canvas: HTMLCanvasElement, request: AssessmentRequest) => Promise<void>;
  reset: () => void;
}

export const useAssessment = (): UseAssessmentReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeDrawing = useCallback(async (canvas: HTMLCanvasElement, request: AssessmentRequest) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.8);
      });

      // Create form data
      const formData = new FormData();
      formData.append('drawing', blob, 'assessment.jpg');
      formData.append('drawingTime', request.drawingTime.toString());
      formData.append('deviceType', request.deviceType);
      
      if (request.userNotes) {
        formData.append('notes', request.userNotes);
      }

      // Send to assessment API
      const response = await api.post<AssessmentResponse>('/assessment/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAssessmentResult(response.data);
      
    } catch (err: any) {
      console.error('Assessment analysis failed:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Failed to analyze your drawing. Please try again!'
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAssessmentResult(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    isAnalyzing,
    assessmentResult,
    error,
    analyzeDrawing,
    reset
  };
};