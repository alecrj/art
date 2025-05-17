// frontend/src/types/assessment.ts
export interface AssessmentRequest {
    drawingTime: number;
    userNotes?: string;
    deviceType: 'web' | 'mobile';
  }
  
  export interface AssessmentResult {
    // Celebration & Positives
    celebrationMessage: string;
    positives: string[];
    encouragement: string;
    
    // Skill Detection  
    skillLevel: 'absolute_beginner' | 'some_experience' | 'intermediate' | 'advanced';
    skillMarkers: SkillMarker[];
    
    // Path Assignment
    recommendedPath: 'foundation_builder' | 'skill_sharpener' | 'master_class';
    pathReason: string;
    
    // Art Style Detection
    detectedStyles: ArtStyle[];
    
    // Next Steps
    nextSteps: string[];
    firstLesson: LessonPreview;
    
    // Metadata
    analysisId: string;
    timestamp: string;
    model: string;
  }
  
  export interface SkillMarker {
    category: 'line_quality' | 'shapes' | 'proportions' | 'creativity' | 'detail' | 'confidence';
    strength: 'emerging' | 'developing' | 'solid';
    description: string;
    evidence: string;
  }
  
  export interface ArtStyle {
    style: 'realistic' | 'cartoon' | 'abstract' | 'anime' | 'sketch' | 'experimental';
    confidence: number;
    elements: string[];
  }
  
  export interface LessonPreview {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    preview_url?: string;
  }
  
  export interface AssessmentResponse {
    success: boolean;
    imageUrl: string;
    assessment: AssessmentResult;
    user: {
      id: string;
      email: string;
    };
    metadata: {
      originalSize: number;
      processedSize: number;
      drawingTime: number;
      deviceType: string;
    };
  }