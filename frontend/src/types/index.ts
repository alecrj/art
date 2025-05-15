export interface ArtworkAnalysis {
  feedback: string;
  timestamp: string;
  model: string;
}

export interface ArtworkSubmission {
  imageUrl: string;
  analysis: ArtworkAnalysis;
  metadata: {
    originalSize: number;
    processedSize: number;
    dimensions: string;
  };
}

export interface User {
  id: string;
  name: string;
  level: string;
  email?: string;
}
