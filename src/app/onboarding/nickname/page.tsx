'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { saveNickname } from '../actions';

export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const handleNext = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) { setError('닉네임을 입력해주세요.'); return; }
    if (trimmed.length < 2) { setError('닉네임은 2자 이상이어야 해요.'); return; }
    if (trimmed.length > 20) { setError('닉네임은 20자 이하로 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      await saveNickname(trimmed);
      router.push('/onboarding/design-type');
    } catch {
      setError('저장 중 오류가 발생했어요. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNext();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
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
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '40px 40px 36px', width: '100%', maxWidth: 480, border: '1px solid var(--ink-200)' }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'var(--indigo-600)' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'var(--ink-200)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)', whiteSpace: 'nowrap', marginLeft: 4 }}>1 / 2</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--indigo-600)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>프로필 설정</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink-900)', margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1.3 }}>어떻게 불러드릴까요?</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '0 0 28px', lineHeight: 1.6 }}>대시보드에서 보여줄 닉네임을 입력해주세요.<br />나중에 변경할 수 있어요.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>닉네임</label>
          <input
            ref={inputRef}
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="예: 민지, designmimi, 김민지"
            maxLength={20}
            style={{
              width: '100%', padding: '13px 14px', border: `1.5px solid ${error ? 'var(--danger)' : 'var(--ink-200)'}`,
              borderRadius: 'var(--radius)', outline: 'none', fontSize: 15, fontFamily: 'inherit',
              color: 'var(--ink-900)', background: 'var(--white)', transition: 'border-color 140ms, box-shadow 140ms', boxSizing: 'border-box',
            }}
            onFocus={(e) => { if (!error) { e.target.style.borderColor = 'var(--indigo-600)'; e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,0.10)'; } }}
            onBlur={(e) => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--ink-200)'; e.target.style.boxShadow = 'none'; }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 20 }}>
            <span style={{ fontSize: 12.5, color: 'var(--danger)', fontWeight: 500 }}>{error}</span>
            <span style={{ fontSize: 12, color: 'var(--ink-400)' }}>{nickname.length} / 20</span>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={loading}
          style={{
            width: '100%', marginTop: 20, padding: '14px', background: 'var(--indigo-600)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: 'var(--shadow-indigo)', letterSpacing: '-0.01em', opacity: loading ? 0.7 : 1, transition: 'opacity 140ms',
          }}
        >
          {loading ? (
            <><div style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />저장 중…</>
          ) : '다음 →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-400)', margin: '16px 0 0' }}>Enter 키로도 다음으로 넘어갈 수 있어요</p>
      </div>
    </div>
  );
}
