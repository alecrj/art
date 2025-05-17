// backend/src/models/assessment/Assessment.ts
export interface AssessmentRequest {
    imageUrl: string;
    drawingTime: number; // seconds spent drawing
    userNotes?: string;
    deviceType: 'web' | 'mobile';
  }
  
  export interface AssessmentResult {
    // Celebration & Positives (always present)
    celebrationMessage: string;
    positives: string[];
    encouragement: string;
    
    // Skill Detection
    skillLevel: SkillLevel;
    skillMarkers: SkillMarker[];
    
    // Path Assignment
    recommendedPath: LearningPath;
    pathReason: string;
    
    // Art Style Detection
    detectedStyles: ArtStyle[];
    
    // Progression Insights
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
    evidence: string; // What the AI observed
  }
  
  export type SkillLevel = 'absolute_beginner' | 'some_experience' | 'intermediate' | 'advanced';
  
  export type LearningPath = 'foundation_builder' | 'skill_sharpener' | 'master_class';
  
  export interface ArtStyle {
    style: 'realistic' | 'cartoon' | 'abstract' | 'anime' | 'sketch' | 'experimental';
    confidence: number; // 0-1
    elements: string[]; // What indicates this style
  }
  
  export interface LessonPreview {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    preview_url?: string;
  }
  
  // User's complete assessment profile
  export interface UserAssessmentProfile {
    userId: string;
    initialAssessment: AssessmentResult;
    assignedPath: LearningPath;
    skillProgression: SkillProgression;
    preferences: UserArtPreferences;
    createdAt: Date;
    lastUpdated: Date;
  }
  
  export interface SkillProgression {
    current_level: SkillLevel;
    strengths: string[];
    growth_areas: string[];
    progress_metrics: {
      confidence: number; // 0-100
      technique: number;
      creativity: number;
      overall: number;
    };
  }
  
  export interface UserArtPreferences {
    preferred_styles: ArtStyle[];
    interests: string[];
    goals: string[];
    practice_frequency: 'daily' | 'few_times_week' | 'weekly' | 'casual';
  }