import { apiClient } from './client';
import type { Resume } from '../types';

export const resumeApi = {
  getAll: async (): Promise<Resume[]> => {
    const response = await apiClient.get<Resume[]>('/resumes');
    return response.data;
  },

  getById: async (id: string): Promise<Resume> => {
    const response = await apiClient.get<Resume>(`/resumes/${id}`);
    return response.data;
  },

  create: async (title: string): Promise<Resume> => {
    const response = await apiClient.post<Resume>('/resumes', { title });
    return response.data;
  },

  update: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    const response = await apiClient.put<Resume>(`/resumes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`);
  },

  uploadImages: async (
    id: string,
    thumbnail?: File,
    profileImage?: File
  ): Promise<{ thumbnailLink?: string; profilePreviewUrl?: string; message: string }> => {
    const formData = new FormData();
    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (profileImage) formData.append('profileImage', profileImage);
    const response = await apiClient.put(`/resumes/${id}/upload-images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
