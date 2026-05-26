'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, QAEmail } from '@/types/project';
import { AI_REPLY_DELAY_MS } from '@/lib/constants';

interface PendingReply {
  projectId: string;
  scheduleAt: number; // Unix ms
}

interface ProjectStore {
  projects: Project[];
  // 페이지 이탈 후 재진입 시에도 AI 답장이 도착하도록, 타이머 메타를 스토어에 저장
  pendingReplies: PendingReply[];

  addProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  addQAEmail: (projectId: string, email: QAEmail) => void;
  getProject: (id: string) => Project | undefined;
  schedulePendingReply: (projectId: string) => void;
  resolvePendingReply: (projectId: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      pendingReplies: [],

      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),

      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id
              ? { ...p, ...patch, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      addQAEmail: (projectId, email) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  qaEmails: [...p.qaEmails, email],
                  qaCount:
                    email.direction === 'sent' ? p.qaCount + 1 : p.qaCount,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      getProject: (id) => get().projects.find((p) => p.id === id),

      // 전송 시 AI_REPLY_DELAY_MS 뒤 도착 예정을 기록
      schedulePendingReply: (projectId) => {
        const scheduleAt = Date.now() + AI_REPLY_DELAY_MS;
        set((s) => ({
          pendingReplies: [
            ...s.pendingReplies.filter((r) => r.projectId !== projectId),
            { projectId, scheduleAt },
          ],
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, pendingAIReply: true, pendingAIReplyAt: new Date(scheduleAt).toISOString(), updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      resolvePendingReply: (projectId) => {
        set((s) => ({
          pendingReplies: s.pendingReplies.filter(
            (r) => r.projectId !== projectId
          ),
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, pendingAIReply: false, pendingAIReplyAt: undefined, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },
    }),
    { name: 'briefPractice_projects' }
  )
);
