// TODO: 작업 C에서 실제 워크스페이스(질의응답·시안·피드백·납품) 구현 예정

import Link from 'next/link';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5Z" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>BriefLab</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>AI 브리프 연습 플랫폼</div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--indigo-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, color: 'var(--indigo-400)' }} fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12h6M9 16h4M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--indigo-600)', background: 'var(--indigo-50)', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 14 }}>
            작업 상세 페이지 · 준비 중
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            이 페이지는 다음 단계에서 구현돼요
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.7, margin: 0 }}>
            질의응답·시안 제출·피드백·납품 워크스페이스는<br />
            작업 C에서 이 프로젝트({id.slice(0, 8)}…)와 연결됩니다.
          </p>
        </div>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'var(--indigo-600)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 22px', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 20 20" style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 17l-7-7 7-7M17 10H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            대시보드로 돌아가기
          </button>
        </Link>
      </main>
    </div>
  );
}
