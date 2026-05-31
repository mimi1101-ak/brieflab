'use client';
import React from 'react';
import Link from 'next/link';
import * as Icon from '@/components/ui/Icon';
import { getProject } from '@/lib/supabase/projects';
import {
  fetchProjectMessages,
  fetchProjectReplies,
  fetchProjectFeedbacks,
  type FeedbackMessage,
} from '@/lib/messages';
import { getPersonaById } from '@/components/brief/personaPool';
import { getProjectById } from '@/components/brief/projectPool';
import type { SentMessage } from '@/components/brief/types';
import type { ProjectRow } from '@/types/database';

// ── 상수 ──────────────────────────────────────────────────────────────────────
const FIELD_LABEL: Record<string, string> = {
  detail: '상세페이지', web: '웹사이트', brand: '브랜딩', app: '앱',
};
const DIFF_LABEL: Record<string, string> = {
  beginner: '입문', easy: '초급', medium: '중급', hard: '고급',
};
const FIELD_COLOR: Record<string, { color: string; bg: string }> = {
  detail: { color: '#0EA5E9', bg: '#E0F2FE' },
  web:    { color: '#8B5CF6', bg: '#EDE9FE' },
  brand:  { color: '#F59E0B', bg: '#FEF3C7' },
  app:    { color: '#EC4899', bg: '#FCE7F3' },
};

// ── 날짜 포맷 ─────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}
function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ── 로딩 스켈레톤 ─────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ height: 57, background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid var(--ink-200)' }} />
      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[120, 80, 320, 240].map((h, i) => (
          <div key={i} style={{ height: h, borderRadius: 12, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s ease infinite' }} />
        ))}
      </main>
    </div>
  );
}

// ── 잘못된 접근(미완료/없음) 상태 ──────────────────────────────────────────────
function InvalidState({ reason }: { reason: 'notfound' | 'notcompleted' }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 24px', display: 'flex', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--ink-600)', fontSize: 13.5, fontWeight: 600 }}>
          <Icon.ChevronLeft style={{ width: 15, height: 15 }} /> 대시보드
        </Link>
      </header>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 20, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--indigo-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Doc style={{ width: 28, height: 28, color: 'var(--indigo-400)' }} />
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--indigo-600)', background: 'var(--indigo-50)', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 12, margin: '0 0 12px' }}>
            {reason === 'notfound' ? '프로젝트를 찾을 수 없어요' : '아직 완료되지 않은 작업이에요'}
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            {reason === 'notfound' ? '유효하지 않은 프로젝트예요' : '완료 후에 결과를 볼 수 있어요'}
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.7, margin: 0 }}>
            {reason === 'notfound'
              ? '삭제되었거나 접근 권한이 없는 프로젝트입니다.'
              : '모든 단계를 마치고 완료하기를 누르면 결과 화면을 확인할 수 있어요.'}
          </p>
        </div>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'var(--indigo-600)', border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 700, padding: '11px 20px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <Icon.ChevronLeft style={{ width: 14, height: 14 }} /> 대시보드로 돌아가기
          </button>
        </Link>
      </main>
    </div>
  );
}

// ── 섹션 헤더 ─────────────────────────────────────────────────────────────────
function SectionTitle({ step, title }: { step: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo-700)', background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>
        {step}
      </div>
      <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--ink-900)', letterSpacing: '-0.02em' }}>{title}</h2>
    </div>
  );
}

// ── 이메일 카드 (받은 메일) ───────────────────────────────────────────────────
function ReceivedMailCard({ from, company, email, time, body }: {
  from: string; company: string; email: string; time: string; body: string;
}) {
  return (
    <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--ink-100)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 999, background: 'linear-gradient(135deg,#DDD6FE,#FCE7F3)', color: 'var(--indigo-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
          {from[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)' }}>{from}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 1 }}>{company} · {email}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-400)', flexShrink: 0 }}>{time}</div>
      </div>
      <div style={{ padding: '14px 18px', fontSize: 13.5, color: 'var(--ink-800)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
        {body}
      </div>
    </div>
  );
}

// ── 이메일 스레드: 보낸 메일 ──────────────────────────────────────────────────
function SentMailCard({ subject, body, time }: { subject: string; body: string; time: string }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px 9px', borderBottom: '1px solid var(--ink-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-400)', flexShrink: 0 }}>{time}</div>
      </div>
      <div style={{ padding: '10px 16px 14px', fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{body}</div>
    </div>
  );
}

// ── 이메일 스레드: 받은 답장 ──────────────────────────────────────────────────
function ReplyMailCard({ from, subject, body, time }: { from: string; subject: string; body: string; time: string }) {
  return (
    <div style={{ borderLeft: '2px solid var(--indigo-300)', background: 'var(--indigo-50)', borderRadius: '0 var(--radius) var(--radius) 0', overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid rgba(99,102,241,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--indigo-800)' }}>↩ {from} 답장 · {subject}</div>
        <div style={{ fontSize: 11, color: 'var(--indigo-500)', flexShrink: 0 }}>{time}</div>
      </div>
      <div style={{ padding: '10px 16px 14px', fontSize: 13.5, color: 'var(--indigo-900)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{body}</div>
    </div>
  );
}

// ── 빈 상태 카드 ──────────────────────────────────────────────────────────────
function EmptyCard({ message }: { message: string }) {
  return (
    <div style={{ background: 'var(--ink-50)', border: '1px dashed var(--ink-300)', borderRadius: 'var(--radius)', padding: '32px 24px', textAlign: 'center', color: 'var(--ink-400)', fontSize: 13.5 }}>
      {message}
    </div>
  );
}

// ── 피드백 타임라인 아이템 ────────────────────────────────────────────────────
function FeedbackItem({ fb, isLast }: { fb: FeedbackMessage; isLast: boolean }) {
  const isRevision = fb.type === 'revision_feedback';
  const isConfirmed = fb.body.includes('[컨펌]');
  const typeLabel = isRevision ? '재제출 피드백' : '시안 피드백';

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* 타임라인 선 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 999, background: isRevision ? 'var(--indigo-600)' : 'var(--indigo-100)', border: `2px solid ${isRevision ? 'var(--indigo-600)' : 'var(--indigo-300)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon.Sparkle style={{ width: 13, height: 13, color: isRevision ? '#fff' : 'var(--indigo-600)' }} />
        </div>
        {!isLast && <div style={{ width: 2, flex: 1, minHeight: 24, background: 'var(--ink-200)', marginTop: 4 }} />}
      </div>
      {/* 카드 */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--indigo-700)', background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>
            {typeLabel}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap',
            background: isConfirmed ? '#DCFCE7' : '#FEF3C7',
            color:      isConfirmed ? '#166534' : '#92400E',
            border:     `1px solid ${isConfirmed ? '#BBF7D0' : '#FDE68A'}`,
          }}>
            {isConfirmed ? '✅ 컨펌' : '🔄 수정 요청'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-400)', marginLeft: 'auto' }}>{fmtTime(fb.created_at)}</span>
        </div>
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '18px 20px', fontSize: 13.5, color: 'var(--ink-800)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
          {fb.body}
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
interface Props { projectId: string }

export default function ProjectResultClient({ projectId }: Props) {
  const [loading,         setLoading]         = React.useState(true);
  const [invalid,         setInvalid]         = React.useState<'notfound' | 'notcompleted' | null>(null);
  const [project,         setProject]         = React.useState<ProjectRow | null>(null);
  const [messages,        setMessages]        = React.useState<SentMessage[]>([]);
  const [replies,         setReplies]         = React.useState<SentMessage[]>([]);
  const [feedbacks,       setFeedbacks]       = React.useState<FeedbackMessage[]>([]);
  const [showFullBrief,   setShowFullBrief]   = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      getProject(projectId),
      fetchProjectMessages(projectId),
      fetchProjectReplies(projectId),
      fetchProjectFeedbacks(projectId),
    ])
      .then(([p, msgs, reps, fbs]) => {
        if (!p) { setInvalid('notfound'); setLoading(false); return; }
        if (p.status !== 'completed') { setInvalid('notcompleted'); setLoading(false); return; }
        setProject(p);
        setMessages(msgs);
        setReplies(reps);
        setFeedbacks(fbs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[BriefLab] 결과 페이지 로드 실패:', err);
        setInvalid('notfound');
        setLoading(false);
      });
  }, [projectId]);

  if (loading) return <PageSkeleton />;
  if (invalid) return <InvalidState reason={invalid} />;
  if (!project) return <InvalidState reason="notfound" />;

  // ── 데이터 복원 ──────────────────────────────────────────────────────────────
  const content   = project.brief_content as Record<string, unknown>;
  const prefs     = project.style_preferences as Record<string, unknown>;
  const snap      = prefs?.form_snapshot as Record<string, unknown> | undefined;

  const pooledPersona  = project.persona_id ? getPersonaById(project.persona_id) : undefined;
  const persona        = pooledPersona ?? (content.persona as { name: string; title: string; company: string; email: string; phone?: string } | undefined);

  const pooledProject  = project.project_template_id ? getProjectById(project.project_template_id) : undefined;
  const projectInfo    = pooledProject
    ? { name: pooledProject.name, purpose: pooledProject.purpose }
    : (content.project as { name: string; purpose: string } | undefined);

  const fieldMeta    = FIELD_COLOR[project.field] ?? FIELD_COLOR.web;
  const fieldLabel   = FIELD_LABEL[project.field] ?? project.field;
  const diffLabel    = DIFF_LABEL[project.difficulty] ?? project.difficulty;
  const completedAt  = fmtDate(project.updated_at);

  const briefEmailBody = persona && projectInfo
    ? `안녕하세요, ${persona.company}의 ${persona.name}입니다.\n${projectInfo.purpose}\n\n프로젝트명: ${projectInfo.name}\n제작 기간: ${project.duration}\n예산: ${project.budget ?? '협의'}\n\n자세한 내용은 첨부 브리프를 참고 부탁드립니다.`
    : '브리프 내용을 불러올 수 없습니다.';

  // replies를 id 기반 맵으로 구성 (messages와 인덱스 1:1 대응)
  const replyMap: Record<number, SentMessage> = {};
  messages.forEach((_, i) => { if (replies[i]) replyMap[i] = replies[i]; });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes briefOpen{ from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── 헤더 ──────────────────────────────────────────────────────────── */}
      <header style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 30, height: 57, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          href="/dashboard"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: 'var(--ink-600)', fontSize: 13.5, fontWeight: 600, transition: 'opacity 140ms ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          <Icon.ChevronLeft style={{ width: 15, height: 15 }} /> 대시보드
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Icon.Spark2 style={{ width: 13, height: 13 }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.02em' }}>결과 보기</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      {/* ── 메인 ──────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: 760, width: '100%', margin: '0 auto', padding: '32px 24px 80px', display: 'flex', flexDirection: 'column', gap: 40, animation: 'fadeUp 300ms ease' }}>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section>
          {/* 완료 pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 14 }}>
            <Icon.Check style={{ width: 13, height: 13 }} /> 완료된 작업
          </div>
          {/* 제목 */}
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.3 }}>
            {project.title}
          </h1>
          {/* 메타 뱃지 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: fieldMeta.color, background: fieldMeta.bg, padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>
              {fieldLabel}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', background: 'var(--ink-100)', padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>
              {diffLabel}
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-500)', background: 'var(--ink-100)', padding: '4px 12px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              <Icon.Calendar style={{ width: 11, height: 11 }} /> {project.duration}
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-500)', background: 'var(--ink-100)', padding: '4px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>
              {completedAt} 완료
            </span>
          </div>
          {/* 클라이언트 */}
          {persona && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '10px 16px', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 999, background: 'linear-gradient(135deg,#DDD6FE,#FCE7F3)', color: 'var(--indigo-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {persona.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)' }}>{persona.name} {persona.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 1 }}>{persona.company} · {persona.email}</div>
              </div>
            </div>
          )}
        </section>

        {/* 구분선 */}
        <div style={{ borderTop: '1px solid var(--ink-200)', margin: '-20px 0' }} />

        {/* ── 섹션 1: 클라이언트 브리프 ──────────────────────────────────── */}
        <section>
          <SectionTitle step="STEP 1" title="클라이언트 브리프" />
          {persona ? (
            <ReceivedMailCard
              from={`${persona.name} ${persona.title}`}
              company={persona.company}
              email={persona.email}
              time={fmtDate(project.created_at)}
              body={briefEmailBody}
            />
          ) : (
            <EmptyCard message="브리프 정보를 불러올 수 없습니다." />
          )}
          {/* 브리프 상세 (타겟/감성/산출물) */}
          {!!(content.target || content.emotion || content.deliverable) && (
            <div style={{ marginTop: 12, background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
              {(
                [
                  ['타겟', typeof content.target === 'object' && content.target !== null
                    ? Object.values(content.target as Record<string,string>).filter(Boolean).join(' · ')
                    : String(content.target ?? '')],
                  ['감성 키워드', String(content.emotion ?? '')],
                  ['최종 산출물', String(content.deliverable ?? '')],
                  ['스타일', String(content.styleLabels ?? '')],
                  ['레퍼런스', String(snap?.refUrl ?? '없음')],
                  ['금지 사항', String(snap?.avoid ?? '특별한 제한 없음')],
                ] as [string, string][]
              ).filter(([, v]) => v && v !== '' && v !== 'undefined').map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{k}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-800)', lineHeight: 1.5 }}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {/* ── 상세 브리프 토글 ── */}
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() => setShowFullBrief(v => !v)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: showFullBrief ? 'var(--indigo-50)' : 'var(--white)',
                border: `1px solid ${showFullBrief ? 'var(--indigo-200)' : 'var(--ink-200)'}`,
                borderRadius: 'var(--radius)', padding: '10px 16px',
                fontSize: 13, fontWeight: 600,
                color: showFullBrief ? 'var(--indigo-700)' : 'var(--ink-600)',
                cursor: 'pointer', transition: 'all 160ms ease',
              }}
            >
              <Icon.Doc style={{ width: 14, height: 14 }} />
              {showFullBrief ? '상세 브리프 접기' : '상세 브리프 보기'}
              <svg
                viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ width: 14, height: 14, transition: 'transform 200ms ease', transform: showFullBrief ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {showFullBrief && (() => {
              // ── 상세 브리프에 사용할 데이터 파싱 ───────────────────────────
              const target  = (content.target ?? {}) as { age?: string; gender?: string; lifestyle?: string };
              const dates   = (content.dates  ?? {}) as { kickoff?: string; mid?: string; final?: string };
              const emotion      = String(content.emotion     ?? '');
              const deliverable  = String(content.deliverable ?? '');
              const styleLabels  = String(content.styleLabels ?? '');
              const refUrl       = String(snap?.refUrl ?? '없음');
              const avoid        = String(snap?.avoid  ?? '특별한 제한 없음');
              const isWebOrDetail = project.field === 'web' || project.field === 'detail';

              // ── 인라인 서브컴포넌트 ─────────────────────────────────────────
              const BSec = ({ icon, title, rows }: {
                icon: React.ReactNode;
                title: string;
                rows: [string, string][];
              }) => (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--indigo-50)', color: 'var(--indigo-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>{title}</span>
                  </div>
                  <div style={{ paddingLeft: 34 }}>
                    {rows.filter(([, v]) => v && v !== '' && v !== 'undefined' && v !== 'null').map(([label, value]) => (
                      <div key={label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--ink-100)', fontSize: 13 }}>
                        <span style={{ color: 'var(--ink-500)', fontWeight: 500, lineHeight: 1.5 }}>{label}</span>
                        <span style={{ color: 'var(--ink-900)', lineHeight: 1.55 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );

              return (
                <div style={{ marginTop: 10, background: 'var(--white)', border: '1px solid var(--indigo-100)', borderRadius: 'var(--radius-lg)', padding: '24px 22px', animation: 'briefOpen 220ms ease' }}>
                  {/* 문서 헤더 */}
                  <div style={{ paddingBottom: 16, borderBottom: '2px solid var(--ink-900)', marginBottom: 22 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: 'var(--ink-400)', textTransform: 'uppercase', marginBottom: 6 }}>CLIENT BRIEF</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink-900)', letterSpacing: '-0.025em' }}>
                      {projectInfo?.name ?? project.title}
                    </div>
                    {persona && (
                      <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 6 }}>
                        발신: {persona.company} · {persona.name} {persona.title}
                      </div>
                    )}
                  </div>

                  {/* 1. 담당자 정보 */}
                  {persona && (
                    <BSec
                      icon={<Icon.Building style={{ width: 13, height: 13 }} />}
                      title="담당자 정보"
                      rows={[
                        ['이름 / 직책', `${persona.name} / ${persona.title}`],
                        ['기관·기업명', persona.company],
                        ['이메일',       persona.email],
                        ['전화번호',     persona.phone ?? ''],
                      ]}
                    />
                  )}

                  {/* 2. 프로젝트 주요 내용 */}
                  {projectInfo && (
                    <BSec
                      icon={<Icon.Doc style={{ width: 13, height: 13 }} />}
                      title="프로젝트 주요 내용"
                      rows={[
                        ['프로젝트명', projectInfo.name],
                        ['배경',       projectInfo.purpose],
                        ['요구 내용',  styleLabels && emotion ? `${fieldLabel} 작업물이 필요합니다. 톤앤매너는 ${styleLabels} 방향이며, 타겟에게 ${emotion}는 인상을 전달하고자 합니다.` : `${fieldLabel} 작업물이 필요합니다.`],
                        ['프로젝트 성격', '신규 제작'],
                      ]}
                    />
                  )}

                  {/* 3. 타겟 정보 */}
                  <BSec
                    icon={<Icon.Tag style={{ width: 13, height: 13 }} />}
                    title="타겟 정보"
                    rows={[
                      ['연령대',      target.age      ?? ''],
                      ['성별',        target.gender    ?? ''],
                      ['라이프스타일', target.lifestyle ?? ''],
                      ['감정 톤',     emotion],
                    ]}
                  />

                  {/* 4. 레퍼런스 및 방향성 */}
                  <BSec
                    icon={<Icon.Palette style={{ width: 13, height: 13 }} />}
                    title="레퍼런스 및 방향성"
                    rows={[
                      ['선호 스타일',    styleLabels],
                      ['피해야 할 스타일', avoid],
                      ['참고 사이트',    refUrl],
                    ]}
                  />

                  {/* 5. 산출물 범위 */}
                  <BSec
                    icon={<Icon.Doc style={{ width: 13, height: 13 }} />}
                    title="산출물 범위"
                    rows={[
                      ['납품 형식', deliverable],
                      ['반응형',   isWebOrDetail ? '모바일 대응 필수' : '해당 없음'],
                    ]}
                  />

                  {/* 6. 일정 및 커뮤니케이션 */}
                  <BSec
                    icon={<Icon.Calendar style={{ width: 13, height: 13 }} />}
                    title="일정 및 커뮤니케이션"
                    rows={[
                      ['킥오프 미팅',  dates.kickoff    ?? ''],
                      ['중간 시안',    dates.mid        ?? ''],
                      ['최종 납기',    dates.final      ?? ''],
                      ['제작 기간',    project.duration],
                      ['소통 방식',    '이메일 (회신은 24시간 이내)'],
                    ]}
                  />

                  {/* 7. 기타 정보 */}
                  <BSec
                    icon={<Icon.Money style={{ width: 13, height: 13 }} />}
                    title="기타 정보"
                    rows={[
                      ['예산 범위', project.budget ?? '협의'],
                      ['난이도(연습)', diffLabel],
                      ['기타 요청',  '시안은 2~3안 제안 부탁드리며, 최종 선정 후 1~2회 수정을 거쳐 마감하고자 합니다.'],
                    ]}
                  />
                </div>
              );
            })()}
          </div>
        </section>

        {/* 구분선 */}
        <div style={{ borderTop: '1px solid var(--ink-200)', margin: '-20px 0' }} />

        {/* ── 섹션 2: 질의응답 ─────────────────────────────────────────────── */}
        <section>
          <SectionTitle step="STEP 2" title="질의응답" />
          {messages.length === 0 ? (
            <EmptyCard message="질의응답을 진행하지 않았어요." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messages.map((msg, i) => (
                <React.Fragment key={msg.id}>
                  <SentMailCard
                    subject={msg.subject}
                    body={msg.body}
                    time={fmtTime(msg.created_at)}
                  />
                  {replyMap[i] && (
                    <ReplyMailCard
                      from={persona ? `${persona.name} (${persona.company})` : '클라이언트'}
                      subject={replyMap[i].subject}
                      body={replyMap[i].body}
                      time={fmtTime(replyMap[i].created_at)}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </section>

        {/* 구분선 */}
        <div style={{ borderTop: '1px solid var(--ink-200)', margin: '-20px 0' }} />

        {/* ── 섹션 3: 시안 + 피드백 ────────────────────────────────────────── */}
        <section>
          <SectionTitle step="STEP 3 – 4" title="제출 시안 · AI 피드백" />

          {/* 시안 자리표시자 */}
          <div style={{ border: '2px dashed var(--ink-300)', borderRadius: 'var(--radius-lg)', padding: '40px 24px', textAlign: 'center', background: 'var(--white)', marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--ink-100)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Upload style={{ width: 20, height: 20, color: 'var(--ink-400)' }} />
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-500)', marginBottom: 4 }}>제출한 시안 이미지</div>
            <div style={{ fontSize: 12, color: 'var(--ink-400)', lineHeight: 1.6 }}>
              시안 이미지 저장 기능이 준비 중이에요.<br />곧 여기서 확인할 수 있어요.
            </div>
          </div>

          {/* 피드백 타임라인 */}
          {feedbacks.length === 0 ? (
            <EmptyCard message="기록된 AI 피드백이 없어요." />
          ) : (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)', letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 16 }}>
                AI 피드백 타임라인 ({feedbacks.length}건)
              </div>
              {feedbacks.map((fb, i) => (
                <FeedbackItem key={fb.id} fb={fb} isLast={i === feedbacks.length - 1} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
