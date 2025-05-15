// backend/src/models/User.ts
export interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    emailVerified: boolean;
    createdAt: Date;
    lastLoginAt: Date;
    preferences?: UserPreferences;
  }
  
  export interface UserPreferences {
    artStyle?: string[];
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    focusAreas?: string[];
    notificationsEnabled?: boolean;
  }
  
  export interface UserProgress {
    uid: string;
    totalUploads: number;
    artworkGallery: string[];
    achievements: Achievement[];
    skillProgression: SkillProgression;
  }
  
  export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    icon: string;
  }
  
  export interface SkillProgression {
    composition: number;
    colorTheory: number;
    technique: number;
    creativity: number;
    overall: number;
  }