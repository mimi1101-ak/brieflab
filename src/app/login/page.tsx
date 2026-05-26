'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import * as Icon from '@/components/ui/Icon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 매직 링크 클릭 시 이 경로로 리다이렉트됨
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (otpError) {
      setError(otpError.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ink-50)',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          background: 'var(--white)',
          border: '1px solid var(--ink-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          padding: '40px 36px',
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--indigo-500), var(--indigo-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 'var(--shadow-indigo)',
              flexShrink: 0,
            }}
          >
            <Icon.Spark2 style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              BriefLab
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>AI 브리프 연습 플랫폼</div>
          </div>
        </div>

        {sent ? (
          /* 발송 완료 상태 */
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 999,
                background: 'var(--indigo-50)',
                border: '1px solid var(--indigo-100)',
                color: 'var(--indigo-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Icon.Check style={{ width: 26, height: 26 }} />
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                margin: '0 0 10px',
                color: 'var(--ink-900)',
                letterSpacing: '-0.02em',
              }}
            >
              메일함을 확인해주세요
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.7, margin: '0 0 24px' }}>
              <b style={{ color: 'var(--ink-800)' }}>{email}</b>로<br />
              로그인 링크를 발송했습니다.
            </p>
            <button
              type="button"
              onClick={() => { setSent(false); setEmail(''); }}
              style={{
                background: 'transparent',
                border: '1px solid var(--ink-200)',
                color: 'var(--ink-600)',
                fontSize: 13,
                fontWeight: 600,
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              다른 이메일로 재발송
            </button>
          </div>
        ) : (
          /* 로그인 폼 */
          <>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                margin: '0 0 8px',
                letterSpacing: '-0.025em',
                color: 'var(--ink-900)',
              }}
            >
              시작하기
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--ink-500)', margin: '0 0 28px', lineHeight: 1.6 }}>
              이메일로 로그인 링크를 받아 바로 시작하세요.
            </p>

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--ink-700)',
                  marginBottom: 7,
                }}
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: '1.5px solid var(--ink-200)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 14,
                  color: 'var(--ink-900)',
                  background: 'var(--white)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: error ? 8 : 18,
                  transition: 'border-color 150ms ease',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--indigo-500)'; }}
                onBlur={(e) => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--ink-200)'; }}
              />

              {error && (
                <p
                  style={{
                    fontSize: 12.5,
                    color: 'var(--danger)',
                    margin: '0 0 16px',
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: loading ? 'var(--indigo-300)' : 'var(--indigo-600)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : 'var(--shadow-indigo)',
                  transition: 'background 150ms ease, box-shadow 150ms ease',
                  letterSpacing: '-0.01em',
                }}
              >
                {loading ? '발송 중...' : '로그인하기'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
