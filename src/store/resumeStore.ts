import { create } from 'zustand';
import type { Resume } from '../types';

interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;
  setResumes: (resumes: Resume[]) => void;
  setCurrentResume: (resume: Resume | null) => void;
  addResume: (resume: Resume) => void;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,

  setResumes: (resumes) => set({ resumes }),

  setCurrentResume: (resume) => set({ currentResume: resume }),

  addResume: (resume) =>
    set((state) => ({ resumes: [resume, ...state.resumes] })),

  updateResume: (id, updates) =>
    set((state) => ({
      resumes: state.resumes.map((r) => {
        const resumeId = r._id || r.id;
        return resumeId === id ? { ...r, ...updates } : r;
      }),
      currentResume:
        state.currentResume &&
        (state.currentResume._id === id || state.currentResume.id === id)
          ? { ...state.currentResume, ...updates }
          : state.currentResume,
    })),

  deleteResume: (id) =>
    set((state) => ({
      resumes: state.resumes.filter((r) => r._id !== id && r.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));
