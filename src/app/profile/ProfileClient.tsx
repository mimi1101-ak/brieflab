'use client';
import React from 'react';
import Link from 'next/link';
import { saveProfile } from './actions';

const DESIGN_OPTIONS = [
  {
    id: 'detail',
    label: '상세페이지',
    sub: '쇼핑몰·제품 상세 페이지',
    color: '#0EA5E9',
    bg: '#E0F2FE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 26, height: 26 }}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 8h18M7 12h10M7 15h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'brand',
    label: '로고·브랜딩',
    sub: '로고·아이덴티티 디자인',
    color: '#F59E0B',
    bg: '#FEF3C7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 26, height: 26 }}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'web',
    label: '웹페이지',
    sub: '랜딩·기업·포트폴리오 사이트',
    color: '#8B5CF6',
    bg: '#EDE9FE',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 26, height: 26 }}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 8h20M6 6h.01M8 6h.01M10 6h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'app',
    label: '앱',
    sub: '모바일 앱 UI/UX',
    color: '#EC4899',
    bg: '#FCE7F3',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ width: 26, height: 26 }}>
        <rect x="7" y="2" width="10" height="20" rx="3" />
        <path d="M11 18h2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const AVATAR_PALETTE = [
  { bg: '#EEF2FF', color: '#3730A3' },
  { bg: '#E0E7FF', color: '#4338CA' },
  { bg: '#C7D2FE', color: '#4338CA' },
  { bg: '#DDD6FE', color: '#5B21B6' },
  { bg: '#EDE9FE', color: '#6D28D9' },
];

function getAvatarStyle(nickname: string): { bg: string; color: string } {
  if (!nickname) return { bg: 'linear-gradient(135deg,#FCE7F3,#DDD6FE)', color: '#3730A3' };
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash | 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

interface Props {
  initialNickname: string;
  initialDesignType: string;
  email: string;
}

export function ProfileClient({ initialNickname, initialDesignType, email }: Props) {
  const [nickname, setNickname] = React.useState(initialNickname);
  const [designType, setDesignType] = React.useState(initialDesignType);
  const [savedNickname, setSavedNickname] = React.useState(initialNickname);
  const [savedDesignType, setSavedDesignType] = React.useState(initialDesignType);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{ msg: string; ok: boolean } | null>(null);
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmed = nickname.trim();
  const nicknameValid = trimmed.length >= 2 && trimmed.length <= 20;
  const isDirty = nickname !== savedNickname || designType !== savedDesignType;
  const canSave = isDirty && nicknameValid && designType !== '';

  const showToast = (msg: string, ok: boolean) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, ok });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      await saveProfile(trimmed, designType);
      setNickname(trimmed);
      setSavedNickname(trimmed);
      setSavedDesignType(designType);
      showToast('저장되었어요', true);
    } catch (err) {
      console.error(err);
      showToast('저장 중 오류가 발생했어요', false);
    } finally {
      setSaving(false);
    }
  };

  const avatarStyle = getAvatarStyle(nickname);
  const initial = nickname.trim() ? nickname.trim().charAt(0) : '?';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-600)', textDecoration: 'none' }}
        >
          <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 4L6 10l6 6" />
          </svg>
          대시보드
        </Link>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>프로필 설정</div>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: avatarStyle.bg, color: avatarStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, boxShadow: 'var(--shadow-xs)', border: '1.5px solid rgba(255,255,255,0.8)' }}>
          {initial}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 640, width: '100%', margin: '0 auto', padding: '36px 24px 80px' }}>
        {/* Section 1 — 기본 정보 */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '28px 28px 24px', marginBottom: 16, boxShadow: 'var(--shadow-xs)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 22px', letterSpacing: '-0.01em' }}>기본 정보</h2>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 8 }}>이메일</label>
            <div style={{ padding: '11px 14px', background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--ink-400)', userSelect: 'none' }}>
              {email}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>닉네임</label>
              <span style={{ fontSize: 12, color: trimmed.length > 0 && !nicknameValid ? 'var(--danger)' : 'var(--ink-400)', fontWeight: 500 }}>
                {trimmed.length} / 20
              </span>
            </div>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={20}
              placeholder="닉네임을 입력하세요"
              style={{
                width: '100%',
                padding: '11px 14px',
                background: 'var(--white)',
                border: `1.5px solid ${trimmed.length > 0 && !nicknameValid ? 'var(--danger)' : 'var(--ink-200)'}`,
                borderRadius: 'var(--radius)',
                fontSize: 14,
                color: 'var(--ink-900)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 140ms',
              }}
              onFocus={e => { if (nicknameValid || !trimmed) e.target.style.borderColor = 'var(--indigo-500)'; }}
              onBlur={e => { e.target.style.borderColor = trimmed.length > 0 && !nicknameValid ? 'var(--danger)' : 'var(--ink-200)'; }}
            />
            {trimmed.length > 0 && !nicknameValid && (
              <p style={{ fontSize: 12, color: 'var(--danger)', margin: '6px 0 0', fontWeight: 500 }}>닉네임은 2자 이상 20자 이하로 입력해주세요</p>
            )}
          </div>
        </div>

        {/* Section 2 — 디자인 선호도 */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '28px 28px 24px', marginBottom: 24, boxShadow: 'var(--shadow-xs)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>디자인 선호도</h2>
          <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 20px', lineHeight: 1.5 }}>주로 하는 디자인을 선택해주세요. 브리프 시작 시 기본값으로 사용돼요.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {DESIGN_OPTIONS.map(opt => {
              const isSelected = designType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDesignType(opt.id)}
                  style={{
                    background: isSelected ? opt.bg : 'var(--white)',
                    border: `2px solid ${isSelected ? opt.color : 'var(--ink-200)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 16px',
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
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = opt.color; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--ink-200)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: isSelected ? `${opt.color}22` : 'var(--ink-100)', color: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 140ms' }}>
                    {opt.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? opt.color : 'var(--ink-900)', marginBottom: 2 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.4 }}>{opt.sub}</div>
                  </div>
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 999, background: opt.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 12 12" style={{ width: 10, height: 10 }} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          style={{
            width: '100%',
            padding: '14px',
            background: canSave ? 'var(--indigo-600)' : 'var(--ink-200)',
            color: canSave ? '#fff' : 'var(--ink-400)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 15,
            fontWeight: 700,
            cursor: canSave && !saving ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: canSave ? 'var(--shadow-indigo)' : 'none',
            letterSpacing: '-0.01em',
            transition: 'all 140ms ease',
            opacity: saving ? 0.75 : 1,
          }}
        >
          {saving ? (
            <>
              <div style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
              저장 중…
            </>
          ) : '저장'}
        </button>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.ok ? '#1E1B4B' : '#7F1D1D',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          padding: '12px 20px',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 200,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          animation: 'fadeInDown 200ms ease',
        }}>
          {toast.ok ? (
            <svg viewBox="0 0 20 20" style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M6.5 10l2.5 2.5 4.5-4.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4M10 14h.01" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
