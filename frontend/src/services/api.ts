import axios from 'axios';
import { Phase, TimeBlock, Resource, Note, ProgressLog } from '../../../shared/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const roadmapApi = {
  getRoadmap: async () => {
    const response = await api.get<{ success: boolean; data: Phase[] }>('/roadmap');
    return response.data.data;
  },

  getPhase: async (phaseId: string) => {
    const response = await api.get<{ success: boolean; data: Phase }>(`/roadmap/phase/${phaseId}`);
    return response.data.data;
  },

  updateTimeBlock: async (timeBlockId: string, completed: boolean) => {
    const response = await api.patch<{ success: boolean; data: TimeBlock }>(
      `/roadmap/timeblock/${timeBlockId}`,
      { completed }
    );
    return response.data.data;
  },

  updateResource: async (resourceId: string, data: Partial<Resource>) => {
    const response = await api.patch<{ success: boolean; data: Resource }>(
      `/roadmap/resource/${resourceId}`,
      data
    );
    return response.data.data;
  },
};

export const progressApi = {
  getOverview: async () => {
    const response = await api.get('/progress/overview');
    return response.data.data;
  },

  getLogs: async (limit = 50, offset = 0) => {
    const response = await api.get(`/progress/logs?limit=${limit}&offset=${offset}`);
    return response.data.data;
  },

  createLog: async (data: { timeBlockId: string; actualDuration: number; notes?: string }) => {
    const response = await api.post<{ success: boolean; data: ProgressLog }>('/progress/log', data);
    return response.data.data;
  },
};

export const notesApi = {
  getNotes: async (entityType: string, entityId: string) => {
    const response = await api.get<{ success: boolean; data: Note[] }>(
      `/notes/${entityType}/${entityId}`
    );
    return response.data.data;
  },

  createNote: async (data: { entityType: string; entityId: string; content: string }) => {
    const response = await api.post<{ success: boolean; data: Note }>('/notes', data);
    return response.data.data;
  },

  updateNote: async (noteId: string, content: string) => {
    const response = await api.put<{ success: boolean; data: Note }>(`/notes/${noteId}`, {
      content,
    });
    return response.data.data;
  },

  deleteNote: async (noteId: string) => {
    await api.delete(`/notes/${noteId}`);
  },
};

export default api;