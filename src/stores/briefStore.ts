'use client';
import { create } from 'zustand';
import { BriefData, BriefForm } from '@/components/brief/types';

// 수락 전 임시 브리프 데이터 — persist 없음 (새로고침 시 초기화)
interface BriefStore {
  form: BriefForm | null;
  brief: BriefData | null;
  emailBody: string | null;
  setPreviewData: (form: BriefForm, brief: BriefData, emailBody: string) => void;
  clear: () => void;
}

export const useBriefStore = create<BriefStore>()((set) => ({
  form: null,
  brief: null,
  emailBody: null,
  setPreviewData: (form, brief, emailBody) => set({ form, brief, emailBody }),
  clear: () => set({ form: null, brief: null, emailBody: null }),
}));
