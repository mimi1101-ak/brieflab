'use client';
import { create } from 'zustand';
import { BriefData, BriefForm } from '@/components/brief/types';

interface BriefStore {
  projectId: string | null;
  form: BriefForm | null;
  brief: BriefData | null;
  emailBody: string | null;
  setPreviewData: (form: BriefForm, brief: BriefData, emailBody: string, projectId?: string) => void;
  clear: () => void;
}

export const useBriefStore = create<BriefStore>()((set) => ({
  projectId: null,
  form: null,
  brief: null,
  emailBody: null,
  setPreviewData: (form, brief, emailBody, projectId) =>
    set({ form, brief, emailBody, projectId: projectId ?? null }),
  clear: () => set({ projectId: null, form: null, brief: null, emailBody: null }),
}));
