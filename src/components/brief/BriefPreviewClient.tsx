'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBriefStore } from '@/stores/briefStore';
import { buildBrief } from '@/components/brief/briefData';
import { buildEmailBody } from '@/lib/buildEmailBody';
import { BriefData, BriefForm, Lookup, Persona } from '@/components/brief/types';
import { getPersonaById } from './personaPool';
import { getProjectById } from './projectPool';
import { insertDraftProject, acceptProject, deleteProject, getProject } from '@/lib/supabase/projects';

// ─── 룩업 테이블 (BriefNewClient와 동일) ─────────────────────────────────────
const LOOKUP: Lookup = {
  field:      { detail: '상세페이지 제작', web: '웹사이트 제작', brand: '브랜딩', app: '앱 제작' },
  difficulty: { beginner: '입문', easy: '초급', medium: '중급', hard: '고급' },
  duration:   { w1: '1주 이내', w2: '2주', m1: '1개월', m2: '2개월 이상' },
  client:     { startup: '스타트업', smb: '소상공인', solo: '개인사업자', midsize: '중소기업', corporate: '대기업', public: '공공기관' },
  budget:     { b1: '30만원 이하', b2: '30~100만원', b3: '100~300만원', b4: '300만원 이상' },
  styles:     { minimal: '미니멀', trendy: '트렌디', classic: '클래식', bold: '볼드' },
};

const FIELD_MAP: Record<string, string> = {
  detail: '상세페이지', web: '웹사이트', brand: '브랜딩', app: '앱',
};
const FIELD_CHIP: Record<string, { bg: string; color: string }> = {
  '상세페이지': { bg: '#E0F2FE', color: '#0EA5E9' },
  '웹사이트':   { bg: '#EDE9FE', color: '#8B5CF6' },
  '브랜딩':     { bg: '#FEF3C7', color: '#D97706' },
  '앱':         { bg: '#FCE7F3', color: '#EC4899' },
};

function initials(name: string): string {
  const chars = [...(name || '')];
  return chars.slice(0, 2).join('') || '??';
}
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ─── 간단한 토스트 ─────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1F2937', color: '#fff', fontSize: 13.5, fontWeight: 500, padding: '12px 20px', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
      <svg viewBox="0 0 20 20" style={{ width: 16, height: 16, flexShrink: 0, color: '#F87171' }} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01" strokeLinecap="round"/></svg>
      {message}
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginLeft: 4, padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ─── 스켈레톤 로딩 ────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }`}</style>
      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', height: 57 }} />
      <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {[1,2,3].map((i) => (
          <div key={i} style={{ height: i === 2 ? 300 : 40, borderRadius: 10, marginBottom: 16, background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease infinite' }} />
        ))}
      </main>
    </div>
  );
}

// ─── 확인 다이얼로그 ──────────────────────────────────────────────────────────
function ConfirmDialog({ onConfirm, onCancel, loading }: { onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000 }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '28px 28px 22px', maxWidth: 360, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 10 }}>브리프를 거절할까요?</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.6, marginBottom: 22 }}>이 브리프를 거절하면 복구할 수 없어요. 계속하시겠어요?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px 16px', border: '1.5px solid var(--ink-200)', background: '#fff', color: 'var(--ink-700)', fontSize: 14, fontWeight: 600, borderRadius: 9, cursor: 'pointer' }}>취소</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '10px 16px', border: 'none', background: '#EF4444', color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 9, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {loading ? <div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} /> : null}
            거절하기
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  projectId: string | null;
  /** false のとき: 수락/재생성/거절 버튼 영역을 숨김 (기본 true) */
  showActions?: boolean;
  /** true のとき: 자체 헤더 숨김 + minHeight auto (탭 내부 임베드용) */
  embedded?: boolean;
}

export default function BriefPreviewClient({ projectId, showActions = true, embedded = false }: Props) {
  const router = useRouter();
  const { projectId: storeId, form: storeForm, brief: storeBrief, emailBody: storeEmailBody, setPreviewData, clear } = useBriefStore();

  const [form, setForm] = React.useState<BriefForm | null>(null);
  const [brief, setBrief] = React.useState<BriefData | null>(null);
  const [emailBody, setEmailBody] = React.useState<string | null>(null);
  const [pageLoading, setPageLoading] = React.useState(true);

  type Action = 'accept' | 'regenerate' | 'reject' | null;
  const [action, setAction] = React.useState<Action>(null);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  const receivedAt = React.useRef(new Date().toISOString());

  // ─── 초기 데이터 로드 ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!projectId) { router.replace('/brief/new'); return; }

    // 캐시 히트: briefStore에 이미 이 프로젝트 데이터가 있으면 바로 사용
    if (storeId === projectId && storeForm && storeBrief && storeEmailBody) {
      setForm(storeForm);
      setBrief(storeBrief);
      setEmailBody(storeEmailBody);
      setPageLoading(false);
      return;
    }

    // 새로고침 등 캐시 미스: DB에서 로드
    getProject(projectId).then((project) => {
      if (!project) { router.replace('/brief/new'); return; }
      const content = project.brief_content as Record<string, unknown>;
      const prefs   = project.style_preferences as Record<string, unknown>;
      const snap    = prefs?.form_snapshot as BriefForm | undefined;
      const reconstructedForm: BriefForm = snap ?? {
        field: project.field, difficulty: project.difficulty,
        duration: null, client: null, budget: null,
        styles: [], refUrl: '', avoid: '',
      };
      const pooledPersona  = project.persona_id ? getPersonaById(project.persona_id) : undefined;
      const persona        = pooledPersona ?? (content.persona as Persona);
      const pooledProject  = project.project_template_id
        ? getProjectById(project.project_template_id)
        : undefined;
      const projectData    = pooledProject
        ? { name: pooledProject.name, purpose: pooledProject.purpose }
        : (content.project as BriefData['project']);
      const reconstructedBrief: BriefData = {
        persona,
        persona_id:          project.persona_id          ?? undefined,
        project:             projectData,
        project_template_id: project.project_template_id ?? undefined,
        dates:        content.dates        as BriefData['dates'],
        target:       content.target       as BriefData['target'],
        emotion:      String(content.emotion ?? ''),
        deliverable:  String(content.deliverable ?? ''),
        budget:       project.budget ?? '협의',
        difficulty:   project.difficulty,
        fieldLabel:   FIELD_MAP[project.field] ?? project.field,
        durationLabel: project.duration,
        styleLabels:  String(content.styleLabels ?? ''),
        refUrl:       reconstructedForm.refUrl || '없음',
        avoid:        reconstructedForm.avoid  || '특별한 제한 없음',
      };
      const body = String(content.emailBody ?? '');
      setForm(reconstructedForm);
      setBrief(reconstructedBrief);
      setEmailBody(body);
      setPreviewData(reconstructedForm, reconstructedBrief, body, projectId);
      setPageLoading(false);
    }).catch(() => { router.replace('/brief/new'); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const showError = (msg: string) => setToast(msg);

  // ─── 수락하기 ────────────────────────────────────────────────────────────
  const handleAccept = async () => {
    if (!projectId || action) return;
    setAction('accept');
    try {
      await acceptProject(projectId);
      clear();
      router.push('/dashboard');
    } catch {
      showError('수락에 실패했어요. 다시 시도해주세요.');
      setAction(null);
    }
  };

  // ─── 다시 생성하기 ────────────────────────────────────────────────────────
  const handleRegenerate = async () => {
    if (!projectId || !form || action) return;
    setAction('regenerate');
    try {
      // 기존 draft 삭제 먼저
      await deleteProject(projectId);
      // 새 브리프 생성
      const newBrief     = buildBrief(form, LOOKUP);
      const newEmailBody = buildEmailBody(newBrief);
      const newId        = await insertDraftProject(form, newBrief, newEmailBody);
      setPreviewData(form, newBrief, newEmailBody, newId);
      // 데이터를 직접 업데이트하고 URL만 교체 (페이지 깜빡임 최소화)
      setBrief(newBrief);
      setEmailBody(newEmailBody);
      setAction(null);
      router.replace(`/brief/preview?id=${newId}`);
    } catch {
      showError('재생성에 실패했어요. 다시 시도해주세요.');
      setAction(null);
    }
  };

  // ─── 거절하기 ────────────────────────────────────────────────────────────
  const handleReject = async () => {
    if (!projectId) return;
    setAction('reject');
    setShowConfirm(false);
    try {
      await deleteProject(projectId);
      clear();
      router.push('/brief/new');
    } catch {
      showError('거절 처리에 실패했어요. 다시 시도해주세요.');
      setAction(null);
    }
  };

  if (pageLoading) return <Skeleton />;
  if (!form || !brief || !emailBody) return null;

  const sender     = brief.persona;
  const fieldLabel = FIELD_MAP[form.field || ''] ?? '상세페이지';
  const fieldChip  = FIELD_CHIP[fieldLabel] ?? { bg: '#EEEDFE', color: '#3C3489' };

  const chips = [
    { label: fieldLabel, primary: true },
    { label: LOOKUP.difficulty[form.difficulty || ''] ?? form.difficulty ?? '', primary: false },
    { label: LOOKUP.duration[form.duration   || ''] ?? form.duration   ?? '', primary: false },
    ...(form.client ? [{ label: LOOKUP.client[form.client] ?? form.client, primary: false }] : []),
    ...(form.budget ? [{ label: LOOKUP.budget[form.budget] ?? form.budget, primary: false }] : []),
  ];

  const anyLoading = action !== null;

  return (
    <div style={{ minHeight: embedded ? 'auto' : '100vh', background: embedded ? 'transparent' : 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {showConfirm && (
        <ConfirmDialog
          onConfirm={handleReject}
          onCancel={() => { setShowConfirm(false); setAction(null); }}
          loading={action === 'reject'}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* 헤더 — embedded 모드에서는 부모 페이지 헤더 사용 */}
      {!embedded && <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', transition: 'opacity 150ms ease' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-indigo)' }}>
            <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5Z" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>BriefLab</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>AI 브리프 연습 플랫폼</div>
          </div>
        </Link>
        <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 500 }}>1 / 5단계 · 브리프 수령</div>
      </header>}

      <main style={{ flex: 1, maxWidth: 720, width: '100%', margin: '0 auto', padding: embedded ? '24px 24px 32px' : '32px 24px 80px' }}>
        {/* 컨텍스트 바 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 500 }}>
              <svg viewBox="0 0 20 20" style={{ width: 18, height: 18, color: 'var(--indigo-600)' }} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="16" height="12" rx="2"/><path d="M2 8h16" strokeLinecap="round"/></svg>
              새 브리프가 도착했어요
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-400)' }}>1 / 5단계 · 브리프 수령</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>이메일을 검토하고 수락 여부를 결정해주세요.</div>
        </div>

        {/* 사전 설정 칩 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {chips.filter(c => c.label).map((chip, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: chip.primary ? 600 : 500, padding: '4px 10px', borderRadius: 999, border: chip.primary ? 'none' : '1px solid var(--ink-200)', background: chip.primary ? fieldChip.bg : '#fff', color: chip.primary ? fieldChip.color : 'var(--ink-600)' }}>
              {chip.label}
            </span>
          ))}
        </div>

        {/* 이메일 카드 */}
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.10)', borderRadius: 12, boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: 20 }}>
          {/* 발신자 헤더 */}
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
              {formatDate(receivedAt.current)}
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

        {/* 액션 버튼 3개 — showActions=false 시 완전 숨김 */}
        {showActions && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              {/* ① 수락하기 */}
              <button
                onClick={handleAccept}
                disabled={anyLoading}
                style={{ flex: '2 1 160px', background: anyLoading && action !== 'accept' ? 'var(--ink-200)' : '#534AB7', color: anyLoading && action !== 'accept' ? 'var(--ink-400)' : '#fff', border: 'none', fontSize: 15, fontWeight: 700, padding: '14px 20px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: anyLoading ? 'not-allowed' : 'pointer', boxShadow: anyLoading ? 'none' : '0 8px 20px rgba(83,74,183,0.35)', letterSpacing: '-0.01em', transition: 'all 160ms ease' }}
              >
                {action === 'accept'
                  ? <><div style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />수락 중…</>
                  : <><svg viewBox="0 0 20 20" style={{ width: 17, height: 17 }} fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 10l5 5 7-8" strokeLinecap="round" strokeLinejoin="round"/></svg>수락하기</>
                }
              </button>

              {/* ② 다시 생성하기 */}
              <button
                onClick={handleRegenerate}
                disabled={anyLoading}
                style={{ flex: '1 1 120px', padding: '14px 18px', border: '1.5px solid var(--ink-200)', background: '#fff', color: anyLoading ? 'var(--ink-400)' : 'var(--ink-700)', fontSize: 14, fontWeight: 600, borderRadius: 10, cursor: anyLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, whiteSpace: 'nowrap', transition: 'all 140ms ease' }}
              >
                {action === 'regenerate'
                  ? <><div style={{ width: 13, height: 13, borderRadius: 999, border: '2px solid var(--ink-300)', borderTopColor: 'var(--indigo-600)', animation: 'spin 0.7s linear infinite' }} />생성 중…</>
                  : <><svg viewBox="0 0 20 20" style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 10a6 6 0 116 6" strokeLinecap="round"/><path d="M4 14v-4H8" strokeLinecap="round" strokeLinejoin="round"/></svg>다시 생성하기</>
                }
              </button>

              {/* ③ 거절하기 */}
              <button
                onClick={() => { if (!anyLoading) setShowConfirm(true); }}
                disabled={anyLoading}
                style={{ flex: '1 1 90px', padding: '14px 16px', border: '1.5px solid var(--ink-200)', background: 'transparent', color: anyLoading ? 'var(--ink-300)' : 'var(--ink-500)', fontSize: 14, fontWeight: 500, borderRadius: 10, cursor: anyLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'all 140ms ease' }}
              >
                거절하기
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-400)' }}>
              수락하면 대시보드의 '진행 중 작업'에 자동으로 저장돼요.
            </div>
          </>
        )}
      </main>
    </div>
  );
}
