// backend/src/models/Artwork.ts
export interface Artwork {
    id: string;
    userId: string;
    originalImageUrl: string;
    processedImageUrl: string;
    analysis: ArtworkAnalysis;
    userNotes?: string;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    tags: string[];
    metadata: ArtworkMetadata;
  }
  
  export interface ArtworkAnalysis {
    id: string;
    feedback: string;
    scores: AnalysisScores;
    suggestions: string[];
    strengths: string[];
    areasForImprovement: string[];
    nextSteps: string[];
    timestamp: Date;
    model: string;
    version: string;
  }
  
  export interface AnalysisScores {
    composition: number;
    technique: number;
    colorTheory: number;
    creativity: number;
    overall: number;
  }
  
  export interface ArtworkMetadata {
    originalFileName: string;
    originalSize: number;
    processedSize: number;
    dimensions: {
      width: number;
      height: number;
    };
    format: string;
    uploadSource: 'web' | 'mobile';
  }