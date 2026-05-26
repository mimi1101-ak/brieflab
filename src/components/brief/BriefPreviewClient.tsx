'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useBriefStore } from '@/stores/briefStore';
import { useProjectStore } from '@/stores/projectStore';
import { Project } from '@/types/project';

// BriefData → Project.settings 변환
const FIELD_MAP: Record<string, '상세페이지' | '웹사이트' | '브랜딩' | '앱'> = {
  detail: '상세페이지', web: '웹사이트', brand: '브랜딩', app: '앱',
};
const DIFF_MAP: Record<string, '입문' | '초급' | '중급' | '고급'> = {
  beginner: '입문', easy: '초급', medium: '중급', hard: '고급',
};
const DUR_MAP: Record<string, '1주' | '2주' | '1개월' | '2개월+'> = {
  w1: '1주', w2: '2주', m1: '1개월', m2: '2개월+',
};
const CLIENT_MAP: Record<string, '스타트업' | '소상공인' | '중소기업' | '대기업' | '공공기관' | '개인사업자'> = {
  startup: '스타트업', smb: '소상공인', solo: '개인사업자',
  midsize: '중소기업', corporate: '대기업', public: '공공기관',
};
const BUDGET_MAP: Record<string, '30만원 이하' | '30~100만원' | '100~300만원' | '300만원 이상'> = {
  b1: '30만원 이하', b2: '30~100만원', b3: '100~300만원', b4: '300만원 이상',
};
const STYLE_MAP: Record<string, '미니멀' | '트렌디' | '클래식' | '볼드'> = {
  minimal: '미니멀', trendy: '트렌디', classic: '클래식', bold: '볼드',
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// 아바타 이니셜 (한글 2자)
function initials(name: string): string {
  if (!name) return '??';
  const chars = [...name];
  return chars.slice(0, 2).join('');
}

// 날짜 포맷 (YYYY-MM-DD HH:MM)
function formatDate(iso: string): string {
  const d = new Date(iso);
  const ymd = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const hm  = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${ymd} ${hm}`;
}

// 분야 칩 색상
const FIELD_CHIP: Record<string, { bg: string; color: string }> = {
  '상세페이지': { bg: '#E0F2FE', color: '#0EA5E9' },
  '웹사이트':   { bg: '#EDE9FE', color: '#8B5CF6' },
  '브랜딩':     { bg: '#FEF3C7', color: '#D97706' },
  '앱':         { bg: '#FCE7F3', color: '#EC4899' },
};

export default function BriefPreviewClient() {
  const router   = useRouter();
  const { form, brief, emailBody, clear } = useBriefStore();
  const addProject = useProjectStore((s) => s.addProject);

  // briefStore에 데이터가 없으면 설정 페이지로
  React.useEffect(() => {
    if (!form || !brief || !emailBody) {
      router.replace('/brief/new');
    }
  }, [form, brief, emailBody, router]);

  if (!form || !brief || !emailBody) return null;

  const sender = brief.persona;
  const receivedAt = new Date().toISOString();
  const fieldLabel = FIELD_MAP[form.field || ''] ?? '상세페이지';
  const fieldChip  = FIELD_CHIP[fieldLabel] ?? { bg: '#EEEDFE', color: '#3C3489' };

  const handleAccept = () => {
    const project: Project = {
      id:          generateId(),
      status:      'in_progress',
      currentStep: 1,
      createdAt:   receivedAt,
      updatedAt:   receivedAt,
      settings: {
        category:   fieldLabel,
        difficulty: DIFF_MAP[form.difficulty || ''] ?? '입문',
        duration:   DUR_MAP[form.duration || ''] ?? '1주',
        ...(form.client ? { clientType: CLIENT_MAP[form.client] } : {}),
        ...(form.budget ? { budget: BUDGET_MAP[form.budget] } : {}),
        ...(form.styles.length > 0 ? { styleTags: form.styles.map((s) => STYLE_MAP[s]).filter(Boolean) as ('미니멀' | '트렌디' | '클래식' | '볼드')[] } : {}),
        ...(form.refUrl ? { referenceUrls: [form.refUrl] } : {}),
        ...(form.avoid ? { avoidStyles: form.avoid } : {}),
      },
      briefEmail: {
        sender: {
          name:    sender.name,
          role:    sender.title,
          company: sender.company,
          email:   sender.email,
          phone:   sender.phone,
        },
        subject:    `[${fieldLabel} 의뢰] ${brief.project.name}`,
        body:       emailBody,
        receivedAt,
        attachments: form.refUrl ? [{ type: 'url', label: '참고 레퍼런스', value: form.refUrl }] : undefined,
      },
      qaEmails: [],
      qaCount:  0,
    };
    addProject(project);
    clear();
    router.push(`/project/${project.id}`);
  };

  const handleReject = () => {
    clear();
    router.push('/brief/new');
  };

  const chips = [
    { label: fieldLabel, style: { background: '#EEEDFE', color: '#3C3489', fontWeight: 600 } },
    { label: DIFF_MAP[form.difficulty || ''] ?? '입문', style: {} },
    { label: DUR_MAP[form.duration || ''] ?? '1주', style: {} },
    ...(form.client ? [{ label: CLIENT_MAP[form.client] ?? form.client, style: {} }] : []),
    ...(form.budget ? [{ label: BUDGET_MAP[form.budget] ?? form.budget, style: {} }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* 상단 헤더 */}
      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-indigo)' }}>
            <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5Z" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>BriefLab</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>AI 브리프 연습 플랫폼</div>
          </div>
        </a>
        <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 500 }}>1 / 5단계 · 브리프 수령</div>
      </header>

      <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* (1) 컨텍스트 바 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 500 }}>
              <svg viewBox="0 0 20 20" style={{ width: 18, height: 18, color: 'var(--indigo-600)' }} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="16" height="12" rx="2"/><path d="M2 8h16" strokeLinecap="round"/></svg>
              새 브리프가 도착했어요
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>1 / 5단계 · 브리프 수령</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>이메일을 검토하고 작업 수락 여부를 결정해주세요. 수락하면 자동으로 진행 중 프로젝트에 저장돼요.</div>
        </div>

        {/* (2) 사전 설정 칩 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {chips.map((chip, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: i === 0 ? 600 : 500, padding: '4px 10px', borderRadius: 999, border: i === 0 ? 'none' : '1px solid var(--ink-200)', background: i === 0 ? chip.style.background : '#fff', color: i === 0 ? chip.style.color : 'var(--ink-600)', ...chip.style }}>
              {chip.label}
            </span>
          ))}
        </div>

        {/* (3) 이메일 카드 */}
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.10)', borderRadius: 12, boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: 20 }}>
          {/* 헤더 */}
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--ink-100)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: '#EEEDFE', color: '#3C3489', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {initials(sender.name)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-900)' }}>{sender.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 2 }}>{sender.title} · {sender.company}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 1 }}>{sender.email}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-400)', flexShrink: 0, textAlign: 'right' }}>
              {formatDate(receivedAt)}
            </div>
          </div>

          {/* 제목 */}
          <div style={{ padding: '18px 20px 8px', fontSize: 16, fontWeight: 500, color: 'var(--ink-900)' }}>
            {`[${fieldLabel} 의뢰] ${brief.project.name}`}
          </div>

          {/* 본문 */}
          <div style={{ padding: '8px 20px 20px', fontSize: 14, lineHeight: 1.75, color: 'var(--ink-800)', whiteSpace: 'pre-wrap' }}>
            {emailBody}
          </div>

          {/* 서명 */}
          <div style={{ margin: '0 20px', paddingTop: 16, borderTop: '1px solid var(--ink-100)', paddingBottom: 20, fontSize: 13, color: 'var(--ink-500)' }}>
            <div>{sender.name}</div>
            <div>{sender.title} | {sender.company}</div>
            <div style={{ marginTop: 4 }}>📞 {sender.phone} · ✉ {sender.email}</div>
          </div>

          {/* 첨부 */}
          {form.refUrl && (
            <div style={{ background: 'var(--ink-50)', borderTop: '1px solid var(--ink-100)', padding: '14px 20px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 8 }}>
                <svg viewBox="0 0 20 20" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 2v12M5 9l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 16h16" strokeLinecap="round"/></svg>
                첨부 · 1개
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--indigo-700)' }}>
                <svg viewBox="0 0 20 20" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 6H6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-4" strokeLinecap="round"/><path d="M14 2l4 4-7 7-4 0 0-4 7-7z"/></svg>
                참고 레퍼런스 · <span style={{ fontSize: 12, color: 'var(--ink-400)', wordBreak: 'break-all' }}>{form.refUrl}</span>
              </div>
            </div>
          )}
        </div>

        {/* (4) 액션 버튼 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button
            onClick={handleAccept}
            style={{ flex: 1, background: '#534AB7', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, padding: '14px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 8px 20px rgba(83,74,183,0.35)', letterSpacing: '-0.01em' }}
          >
            <svg viewBox="0 0 20 20" style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10l5 5 7-8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            작업 수락하기
          </button>
          <button
            onClick={handleReject}
            style={{ padding: '14px 20px', border: '1.5px solid var(--ink-200)', background: '#fff', color: 'var(--ink-700)', fontSize: 14, fontWeight: 600, borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            다른 브리프 받기
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-400)' }}>
          수락하면 대시보드의 '진행 중 프로젝트'에 자동으로 저장돼요.
        </div>
      </main>
    </div>
  );
}
