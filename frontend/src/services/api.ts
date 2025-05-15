import axios from 'axios';
import { ArtworkSubmission } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
