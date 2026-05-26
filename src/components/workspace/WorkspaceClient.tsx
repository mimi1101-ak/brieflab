'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/projectStore';

interface WorkspaceClientProps {
  projectId: string;
}

export default function WorkspaceClient({ projectId }: WorkspaceClientProps) {
  const router  = useRouter();
  const project = useProjectStore((s) => s.getProject(projectId));

  React.useEffect(() => {
    if (project === undefined) {
      // 스토어가 아직 hydrate 중일 수 있으므로 잠시 대기 후 확인
      const t = setTimeout(() => {
        if (!useProjectStore.getState().getProject(projectId)) {
          router.replace('/');
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [project, projectId, router]);

  if (!project) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: 14, color: 'var(--ink-500)' }}>불러오는 중…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.briefEmail.subject}</div>
          <span style={{ fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: '#EEEDFE', color: '#3C3489', whiteSpace: 'nowrap', flexShrink: 0 }}>{project.settings.category}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>자동 저장됨</div>
          <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-600)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            ← 대시보드로
          </Link>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex' }}>
        {/* 좌측 스텝퍼 사이드바 (Step 5에서 구현 예정) */}
        <aside style={{ width: 240, borderRight: '1px solid var(--ink-200)', background: '#fff', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          {[
            { step: 1, label: '브리프 수령' },
            { step: 2, label: '질의응답' },
            { step: 3, label: '시안 제출' },
            { step: 4, label: '피드백 수용' },
            { step: 5, label: '최종 납품' },
          ].map(({ step, label }) => {
            const isCurrent = project.currentStep === step;
            const isDone    = project.currentStep > step;
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: isCurrent ? 'var(--indigo-50)' : 'transparent', color: isCurrent ? 'var(--indigo-700)' : isDone ? 'var(--ink-600)' : 'var(--ink-400)', fontWeight: isCurrent ? 600 : 500, fontSize: 13.5, cursor: 'default' }}>
                <div style={{ width: 24, height: 24, borderRadius: 999, background: isDone ? 'var(--success)' : isCurrent ? 'var(--indigo-600)' : 'var(--ink-100)', color: isDone || isCurrent ? '#fff' : 'var(--ink-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {isDone ? '✓' : step}
                </div>
                {label}
              </div>
            );
          })}
        </aside>

        {/* 메인 영역 */}
        <main style={{ flex: 1, padding: '32px 40px', overflow: 'auto' }}>
          {project.currentStep === 1 && (
            <div>
              <div style={{ fontSize: 14, color: 'var(--ink-500)', marginBottom: 16 }}>단계 1 — 브리프 수령 (Step 5에서 상세 UI 구현 예정)</div>
              <div style={{ background: '#fff', border: '1px solid var(--ink-200)', borderRadius: 12, padding: '20px 24px', whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.75, color: 'var(--ink-800)' }}>
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{project.briefEmail.subject}</div>
                {project.briefEmail.body}
              </div>
            </div>
          )}
          {project.currentStep !== 1 && (
            <div style={{ color: 'var(--ink-500)', fontSize: 14 }}>
              추후 구현 예정 (단계 {project.currentStep})
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
