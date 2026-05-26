'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { saveDesignType } from '../actions';

const DESIGN_OPTIONS = [
  {
    id: 'detail',
    label: '상세페이지',
    sub: '쇼핑몰·제품 상세 페이지',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 28, height: 28 }}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 8h18M7 12h10M7 15h7" strokeLinecap="round" />
      </svg>
    ),
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    id: 'brand',
    label: '로고·브랜딩',
    sub: '로고·아이덴티티 디자인',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 28, height: 28 }}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" strokeLinecap="round" />
      </svg>
    ),
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
  {
    id: 'web',
    label: '웹페이지',
    sub: '랜딩·기업·포트폴리오 사이트',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 28, height: 28 }}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 8h20M6 6h.01M8 6h.01M10 6h.01" strokeLinecap="round" />
      </svg>
    ),
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
  {
    id: 'app',
    label: '앱',
    sub: '모바일 앱 UI/UX',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 28, height: 28 }}>
        <rect x="7" y="2" width="10" height="20" rx="3" />
        <path d="M11 18h2" strokeLinecap="round" />
      </svg>
    ),
    color: '#EC4899',
    bg: '#FCE7F3',
  },
];

export default function DesignTypePage() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleDone = async () => {
    if (!selected) { setError('분야를 선택해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await saveDesignType(selected);
      router.push('/');
    } catch {
      setError('저장 중 오류가 발생했어요. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selected) handleDone();
  };

  return (
    <div
      style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-indigo)' }}>
          <svg viewBox="0 0 16 16" style={{ width: 14, height: 14, color: '#fff' }} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 2l1.8 4L14 6.8l-3 2.8.7 4.2L8 11.6l-3.7 2.2.7-4.2-3-2.8 4.2-.8z" />
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>BriefLab</span>
      </div>

      {/* Card */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '40px 40px 36px', width: '100%', maxWidth: 520, border: '1px solid var(--ink-200)' }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'var(--indigo-600)' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'var(--indigo-600)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)', whiteSpace: 'nowrap', marginLeft: 4 }}>2 / 2</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--indigo-600)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>프로필 설정</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.3 }}>주로 어떤 디자인을 하시나요?</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '0 0 28px', lineHeight: 1.6 }}>가장 많이 하거나 집중하고 싶은 분야를 선택해주세요.<br />브리프 시작 시 기본값으로 사용돼요.</p>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}>
          {DESIGN_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => { setSelected(opt.id); setError(''); }}
                style={{
                  background: isSelected ? opt.bg : 'var(--white)',
                  border: `2px solid ${isSelected ? opt.color : 'var(--ink-200)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 10,
                  textAlign: 'left',
                  transition: 'all 140ms ease',
                  outline: 'none',
                  boxShadow: isSelected ? `0 0 0 4px ${opt.color}22` : 'none',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = opt.color; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--ink-200)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: isSelected ? `${opt.color}22` : 'var(--ink-100)', color: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 140ms' }}>
                  {opt.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? opt.color : 'var(--ink-900)', marginBottom: 3 }}>{opt.label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.4 }}>{opt.sub}</div>
                </div>
                {isSelected && (
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: 999, background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 12 12" style={{ width: 10, height: 10 }} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && <p style={{ fontSize: 12.5, color: 'var(--danger)', fontWeight: 500, margin: '4px 0 0' }}>{error}</p>}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button
            type="button"
            onClick={() => router.back()}
            style={{ padding: '13px 18px', background: 'var(--white)', border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink-700)', cursor: 'pointer', flexShrink: 0 }}
          >
            ← 이전
          </button>
          <button
            onClick={handleDone}
            disabled={loading || !selected}
            style={{
              flex: 1, padding: '13px', background: selected ? 'var(--indigo-600)' : 'var(--ink-200)', color: selected ? '#fff' : 'var(--ink-400)',
              border: 'none', borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700,
              cursor: !selected || loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: selected ? 'var(--shadow-indigo)' : 'none', letterSpacing: '-0.01em',
              transition: 'all 140ms ease', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <><div style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />저장 중…</>
            ) : '완료 — 대시보드로 이동'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-400)', margin: '14px 0 0' }}>선택 후 Enter 키로도 완료할 수 있어요</p>
      </div>
    </div>
  );
}
