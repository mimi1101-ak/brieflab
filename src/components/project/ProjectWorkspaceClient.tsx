'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BriefPreviewClient from '@/components/brief/BriefPreviewClient';
import { BriefProcess } from '@/components/brief/BriefProcess';
import { BriefData, BriefForm } from '@/components/brief/types';
import { getProject } from '@/lib/supabase/projects';
import { mapDbStepToComponentIdx } from '@/lib/stepMapping';

// ─── 데이터 복원용 상수 ──────────────────────────────────────────────────────
const FIELD_MAP: Record<string, string> = {
  detail: '상세페이지', web: '웹사이트', brand: '브랜딩', app: '앱',
};
const DIFFICULTY_MAP: Record<string, string> = {
  beginner: '입문', easy: '초급', medium: '중급', hard: '고급',
};

// ─── 로딩 스켈레톤 ───────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
      <header style={{ height: 57, background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid var(--ink-200)' }} />
      <div style={{ height: 52, background: '#fff', borderBottom: '1px solid var(--ink-200)' }} />
      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[280, 120, 400].map((h, i) => (
          <div key={i} style={{ height: h, borderRadius: 12, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease infinite' }} />
        ))}
      </main>
    </div>
  );
}

// ─── 빈 상태 (프로젝트 없음 / 오류) ─────────────────────────────────────────
function NotFoundState() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5Z" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>BriefLab</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>AI 브리프 연습 플랫폼</div>
          </div>
        </Link>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--indigo-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, color: 'var(--indigo-400)' }} fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12h6M9 16h4M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--indigo-600)', background: 'var(--indigo-50)', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 14 }}>
            프로젝트를 찾을 수 없어요
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            유효하지 않은 프로젝트예요
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.7, margin: 0 }}>
            삭제되었거나 접근 권한이 없는 프로젝트입니다.<br />
            대시보드에서 다른 작업을 선택해주세요.
          </p>
        </div>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'var(--indigo-600)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 20 20" style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 17l-7-7 7-7M17 10H3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            대시보드로 돌아가기
          </button>
        </Link>
      </main>
    </div>
  );
}

// ─── 탭 버튼 ─────────────────────────────────────────────────────────────────
type Tab = 'brief' | 'workspace';

function TabButton({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '12px 20px', border: 'none', background: 'transparent',
        fontSize: 14, fontWeight: active ? 700 : 500,
        color: active ? 'var(--indigo-700)' : 'var(--ink-500)',
        borderBottom: active ? '2.5px solid var(--indigo-600)' : '2.5px solid transparent',
        cursor: 'pointer', transition: 'all 140ms ease', whiteSpace: 'nowrap',
      }}
    >
      {icon} {label}
    </button>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
interface Props { projectId: string }

export default function ProjectWorkspaceClient({ projectId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<Tab>('workspace');

  const [pageLoading, setPageLoading]   = React.useState(true);
  const [notFound,    setNotFound]      = React.useState(false);
  const [title,       setTitle]         = React.useState('');
  const [brief,       setBrief]         = React.useState<BriefData | null>(null);
  const [initialStep, setInitialStep]   = React.useState(0);

  React.useEffect(() => {
    getProject(projectId)
      .then((p) => {
        if (!p) { setNotFound(true); setPageLoading(false); return; }

        // ── BriefData 복원 ────────────────────────────────────────────────
        const content = p.brief_content as Record<string, unknown>;
        const prefs   = p.style_preferences as Record<string, unknown>;
        const snap    = prefs?.form_snapshot as BriefForm | undefined;
        const reconstructedBrief: BriefData = {
          persona:      content.persona      as BriefData['persona'],
          project:      content.project      as BriefData['project'],
          dates:        content.dates        as BriefData['dates'],
          target:       content.target       as BriefData['target'],
          emotion:      String(content.emotion      ?? ''),
          deliverable:  String(content.deliverable  ?? ''),
          budget:       p.budget ?? '협의',
          difficulty:   DIFFICULTY_MAP[p.difficulty] ?? p.difficulty,
          fieldLabel:   FIELD_MAP[p.field] ?? p.field,
          durationLabel: p.duration,
          styleLabels:  String(content.styleLabels ?? ''),
          refUrl:       snap?.refUrl || '없음',
          avoid:        snap?.avoid  || '특별한 제한 없음',
        };

        setTitle(p.title);
        setBrief(reconstructedBrief);
        setInitialStep(mapDbStepToComponentIdx(p.current_step));
        setPageLoading(false);
      })
      .catch((err) => {
        console.error('[BriefLab] 프로젝트 로드 실패:', err);
        setNotFound(true);
        setPageLoading(false);
      });
  }, [projectId]);

  if (pageLoading) return <PageSkeleton />;
  if (notFound || !brief) return <NotFoundState />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── 페이지 헤더 ─────────────────────────────────────────────────── */}
      <header style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '0 36px', position: 'sticky', top: 0, zIndex: 30 }}>
        {/* 상단 바: 로고 + 프로젝트명 + 뒤로가기 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 57 }}>
          <Link
            href="/dashboard"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--ink-600)', fontSize: 13.5, fontWeight: 600, transition: 'opacity 140ms ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            <svg viewBox="0 0 20 20" style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 17l-7-7 7-7M17 10H3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            대시보드
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <svg viewBox="0 0 20 20" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5Z" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.02em', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </div>
          </div>

          <div style={{ width: 100 }} />{/* 우측 여백 균형 */}
        </div>

        {/* 탭 바 */}
        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--ink-100)' }}>
          <TabButton
            active={activeTab === 'brief'}
            onClick={() => setActiveTab('brief')}
            icon={
              <svg viewBox="0 0 20 20" style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="2" y="4" width="16" height="12" rx="2"/><path d="M2 8h16" strokeLinecap="round"/>
              </svg>
            }
            label="브리프 보기"
          />
          <TabButton
            active={activeTab === 'workspace'}
            onClick={() => setActiveTab('workspace')}
            icon={
              <svg viewBox="0 0 20 20" style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 5h14M3 10h10M3 15h6" strokeLinecap="round"/>
                <circle cx="16" cy="13" r="3"/>
                <path d="M16 11v2l1 1" strokeLinecap="round"/>
              </svg>
            }
            label="워크스페이스"
          />
        </div>
      </header>

      {/* ── 탭 콘텐츠 — 양쪽 모두 마운트, 비활성만 display:none ────────── */}

      {/* 탭 1: 브리프 보기 */}
      <div style={{ display: activeTab === 'brief' ? 'block' : 'none', flex: 1 }}>
        <BriefPreviewClient
          projectId={projectId}
          showActions={false}
          embedded={true}
        />
      </div>

      {/* 탭 2: 워크스페이스 */}
      <div style={{ display: activeTab === 'workspace' ? 'block' : 'none', flex: 1 }}>
        <BriefProcess
          brief={brief}
          initialStepIdx={initialStep}
          embedded={true}
          onBack={() => setActiveTab('brief')}
          onFinish={() => router.push('/dashboard')}
        />
      </div>
    </div>
  );
}
