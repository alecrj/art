// frontend/src/contexts/ProgressContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

export interface LessonProgress {
  id: string;
  completed: boolean;
  xpEarned: number;
  lastCompleted?: string; // ISO date string
  attempts: number;
}

export interface PathProgress {
  id: string;
  title: string;
  lessonsCompleted: number;
  totalLessons: number;
  xpEarned: number;
  lastAccessed?: string; // ISO date string
  lessons: Record<string, LessonProgress>;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  lastActive?: string; // ISO date string
  totalXp: number;
  level: number;
  completedPaths: string[];
  activePaths: Record<string, PathProgress>;
  achievements: string[];
}

interface ProgressContextType {
  userProgress: UserProgress | null;
  loading: boolean;
  completeLesson: (pathId: string, lessonId: string, xpEarned: number) => Promise<void>;
  startLesson: (pathId: string, lessonId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

// Default progress state
const defaultProgress: UserProgress = {
  currentStreak: 0,
  longestStreak: 0,
  totalXp: 0,
  level: 1,
  completedPaths: [],
  activePaths: {},
  achievements: []
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user progress on auth change
  useEffect(() => {
    if (currentUser) {
      refreshProgress();
    } else {
      setUserProgress(null);
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch user progress from API
  const refreshProgress = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await api.get('/progress/user');
      setUserProgress(response.data.progress || defaultProgress);
    } catch (error) {
      console.error('Failed to load progress:', error);
      // Initialize with default progress if not found
      setUserProgress(defaultProgress);
    } finally {
      setLoading(false);
    }
  };

  // Mark a lesson as completed and update progress
  const completeLesson = async (pathId: string, lessonId: string, xpEarned: number) => {
    if (!currentUser || !userProgress) return;

    // Create a copy of current progress
    const updatedProgress = { ...userProgress };

    // Ensure path exists in active paths
    if (!updatedProgress.activePaths[pathId]) {
      updatedProgress.activePaths[pathId] = {
        id: pathId,
        title: pathId, // Will be updated when we fetch path details
        lessonsCompleted: 0,
        totalLessons: 0, // Will be updated when we fetch path details
        xpEarned: 0,
        lessons: {}
      };
    }

    const path = updatedProgress.activePaths[pathId];
    
    // Check if lesson is already completed
    const isNewCompletion = !path.lessons[lessonId]?.completed;
    
    // Update lesson progress
    path.lessons[lessonId] = {
      id: lessonId,
      completed: true,
      xpEarned: (path.lessons[lessonId]?.xpEarned || 0) + xpEarned,
      lastCompleted: new Date().toISOString(),
      attempts: (path.lessons[lessonId]?.attempts || 0) + 1
    };

    // Update path and user progress
    if (isNewCompletion) {
      path.lessonsCompleted += 1;
    }
    path.xpEarned += xpEarned;
    path.lastAccessed = new Date().toISOString();
    
    updatedProgress.totalXp += xpEarned;
    
    // Update level based on XP
    updatedProgress.level = Math.floor(updatedProgress.totalXp / 100) + 1;
    
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastActive = userProgress.lastActive?.split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastActive === yesterday.toISOString().split('T')[0]) {
      // Continuing streak
      updatedProgress.currentStreak += 1;
    } else if (lastActive !== today) {
      // New streak
      updatedProgress.currentStreak = 1;
    }
    
    // Update longest streak if needed
    if (updatedProgress.currentStreak > updatedProgress.longestStreak) {
      updatedProgress.longestStreak = updatedProgress.currentStreak;
    }
    
    updatedProgress.lastActive = new Date().toISOString();
    
    // Save progress locally
    setUserProgress(updatedProgress);
    
    // Send to API
    try {
      await api.post('/progress/update', {
        pathId,
        lessonId,
        xpEarned,
        completed: true
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
      // Revert on failure
      await refreshProgress();
    }
  };

  // Start a lesson (marks it as attempted)
  const startLesson = async (pathId: string, lessonId: string) => {
    if (!currentUser || !userProgress) return;

    // Create a copy of current progress
    const updatedProgress = { ...userProgress };

    // Ensure path exists in active paths
    if (!updatedProgress.activePaths[pathId]) {
      updatedProgress.activePaths[pathId] = {
        id: pathId,
        title: pathId,
        lessonsCompleted: 0,
        totalLessons: 0,
        xpEarned: 0,
        lessons: {}
      };
    }

    const path = updatedProgress.activePaths[pathId];
    
    // Ensure lesson exists
    if (!path.lessons[lessonId]) {
      path.lessons[lessonId] = {
        id: lessonId,
        completed: false,
        xpEarned: 0,
        attempts: 0
      };
    }
    
    // Update path last accessed
    path.lastAccessed = new Date().toISOString();
    
    // Save progress locally
    setUserProgress(updatedProgress);
    
    // Send to API
    try {
      await api.post('/progress/update', {
        pathId,
        lessonId,
        started: true
      });
    } catch (error) {
      console.error('Failed to update lesson start:', error);
    }
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        userProgress, 
        loading, 
        completeLesson, 
        startLesson, 
        refreshProgress 
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};