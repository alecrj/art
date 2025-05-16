// frontend/src/services/api.ts - Updated with Authentication
import axios from 'axios';
import { ArtworkSubmission } from '../types';
import { auth } from './firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could redirect to login
      console.warn('Authentication error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const artAPI = {
  analyzeArtwork: async (file: File, notes?: string): Promise<ArtworkSubmission> => {
    const formData = new FormData();
    formData.append('artwork', file);
    if (notes) formData.append('notes', notes);

    const response = await api.post('/art/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getHistory: async (): Promise<any[]> => {
    const response = await api.get('/art/history');
    return response.data.artworks;
  },

  getPublicGallery: async (): Promise<any[]> => {
    // This endpoint doesn't require auth
    const response = await api.get('/art/public');
    return response.data.artworks;
  },
};

export const userAPI = {
  getProfile: async (): Promise<any> => {
    const response = await api.get('/user/profile');
    return response.data.user;
  },

  updateProgress: async (progressData: any): Promise<void> => {
    await api.post('/user/progress', progressData);
  },
};

export default api;