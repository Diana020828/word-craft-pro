import { CVData } from '@/types/cv';

const STORAGE_KEY = 'cv_data';

export const cvStorage = {
  save: (data: CVData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  load: (): CVData | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};