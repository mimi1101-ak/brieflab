'use client';
import React from 'react';
import * as Icon from '@/components/ui/Icon';
import { BriefData, SentMessage } from './types';
import { insertUserMessage } from '@/lib/messages';

// ── 내부 타입 ────────────────────────────────────────────────────────────────
type ReplyEntry = { subject: string; body: string; received_at: string };

const STEPS = [
  { id: 'receive', label: '브리프 수령', sub: '클라이언트의 요청 확인' },
  { id: 'qna', label: '질의응답', sub: '모호한 부분 명확히' },
  { id: 'draft', label: '시안 제출', sub: '디자인 시안 업로드' },
  { id: 'feedback', label: '피드백 수용', sub: '클라이언트 의견 반영' },
  { id: 'deliver', label: '최종 납품', sub: '결과물 전달 및 마감' },
];

const pBtn = { background: 'var(--indigo-600)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 20px', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-indigo)', whiteSpace: 'nowrap' } as React.CSSProperties;
const sBtn = { background: 'var(--white)', border: '1px solid var(--ink-200)', color: 'var(--ink-700)', fontSize: 14, fontWeight: 600, padding: '12px 18px', borderRadius: 'var(--radius)', cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties;

// ── 완료 단계 보기 배너 ───────────────────────────────────────────────────────
const ReadOnlyBanner = ({ onReturn }: { onReturn: () => void }) => (
  <div style={{ background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', borderRadius: 'var(--radius)', padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
    <div style={{ fontSize: 13, color: 'var(--indigo-700)', fontWeight: 500 }}>
      ✅ 완료된 단계예요. 내용을 확인할 수 있지만 수정은 현재 단계에서만 가능합니다.
    </div>
    <button
      type="button"
      onClick={onReturn}
      style={{ background: 'var(--indigo-600)', border: 'none', color: '#fff', fontSize: 12.5, fontWeight: 600, padding: '6px 14px', borderRadius: 'var(--radius)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
    >
      → 현재 진행 중인 단계로
    </button>
  </div>
);

// ── ProcessRail ───────────────────────────────────────────────────────────────
const ProcessRail = ({
  activeIdx,
  viewingIdx,
  onStepClick,
}: {
  activeIdx:   number;
  viewingIdx:  number;
  onStepClick: (idx: number) => void;
}) => (
  <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', boxShadow: 'var(--shadow-xs)' }}>
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 14 }}>실무 워크플로우</div>
    {STEPS.map((step, i) => {
      const status    = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
      const isViewing = i === viewingIdx;
      const clickable = i <= activeIdx;
      return (
        <div
          key={step.id}
          onClick={() => clickable && onStepClick(i)}
          style={{
            display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative',
            paddingBottom: i === STEPS.length - 1 ? 0 : 14,
            cursor: clickable ? 'pointer' : 'default',
            borderRadius: 8,
            background: isViewing ? 'rgba(99,102,241,0.06)' : 'transparent',
            margin: '0 -6px',
            padding: `6px 6px ${i === STEPS.length - 1 ? 6 : 14}px`,
            transition: 'background 150ms ease',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 999, flexShrink: 0, transition: 'all 200ms ease',
              background: status === 'done' ? 'var(--success)' : status === 'active' ? 'var(--indigo-600)' : 'var(--ink-100)',
              color: status === 'pending' ? 'var(--ink-500)' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
              boxShadow: isViewing && i !== activeIdx
                ? '0 0 0 3px rgba(99,102,241,0.35)'
                : status === 'active'
                ? '0 0 0 4px rgba(79,70,229,0.18)'
                : 'none',
            }}>
              {status === 'done' ? <Icon.Check style={{ width: 13, height: 13 }} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 2, flex: 1, minHeight: 24, background: i < activeIdx ? 'var(--success)' : 'var(--ink-200)', marginTop: 4 }} />
            )}
          </div>
          <div style={{ paddingTop: 4, paddingBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: status === 'pending' ? 500 : 700, color: status === 'pending' ? 'var(--ink-500)' : 'var(--ink-900)', whiteSpace: 'nowrap' }}>
              {step.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{step.sub}</div>
          </div>
        </div>
      );
    })}
  </div>
);

// ── StepReceive ───────────────────────────────────────────────────────────────
const StepReceive = ({
  brief,
  onNext,
  readOnly = false,
  onReturnToActive,
}: {
  brief:             BriefData;
  onNext:            () => void;
  readOnly?:         boolean;
  onReturnToActive?: () => void;
}) => (
  <div>
    {readOnly && onReturnToActive && <ReadOnlyBanner onReturn={onReturnToActive} />}
    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>브리프를 받았습니다</h2>
    <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 22px' }}>클라이언트가 보낸 브리프를 확인하고, 작업을 수락할지 결정해주세요.</p>
    <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '18px 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, background: 'linear-gradient(135deg,#DDD6FE,#FCE7F3)', color: 'var(--indigo-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{brief.persona.name[0]}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{brief.persona.name} {brief.persona.title}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{brief.persona.company} · {brief.persona.email}</div>
        </div>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink-800)', whiteSpace: 'pre-line' }}>
        {`안녕하세요, ${brief.persona.company}의 ${brief.persona.name}입니다.\n${brief.project.purpose}\n\n프로젝트명: ${brief.project.name}\n제작 기간: ${brief.durationLabel}\n예산: ${brief.budget}\n\n자세한 내용은 첨부 브리프를 참고 부탁드립니다.`}
      </div>
    </div>
    {!readOnly && (
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" style={sBtn}>거절</button>
        <button type="button" onClick={onNext} style={pBtn}><Icon.Check style={{ width: 14, height: 14 }} /> 작업 수락하기</button>
      </div>
    )}
  </div>
);

// ── StepQna ───────────────────────────────────────────────────────────────────
const StepQna = ({
  brief,
  onNext,
  projectId,
  initialMessages = [],
  initialReplies  = [],
  readOnly = false,
  onReturnToActive,
}: {
  brief:             BriefData;
  onNext:            () => void;
  projectId?:        string;
  initialMessages?:  SentMessage[];
  initialReplies?:   SentMessage[];
  readOnly?:         boolean;
  onReturnToActive?: () => void;
}) => {
  const [sentMessages,    setSentMessages]    = React.useState<SentMessage[]>(initialMessages);

  const [replies, setReplies] = React.useState<Record<string, ReplyEntry>>(() => {
    const init: Record<string, ReplyEntry> = {};
    initialMessages.forEach((msg, i) => {
      if (initialReplies[i]) {
        init[msg.id] = {
          subject:     initialReplies[i].subject,
          body:        initialReplies[i].body,
          received_at: initialReplies[i].created_at,
        };
      }
    });
    return init;
  });

  const [loadingReplyFor, setLoadingReplyFor] = React.useState<string | null>(null);
  const [subjectInput,    setSubjectInput]    = React.useState('');
  const [bodyInput,       setBodyInput]       = React.useState('');
  const [usedChips,       setUsedChips]       = React.useState<Set<number>>(new Set());
  const [saveError,       setSaveError]       = React.useState(false);
  const [replyError,      setReplyError]      = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const sentCount   = sentMessages.length;
  const canSendMore = sentCount < 3;

  const suggested = [
    `타겟 고객의 사용 환경(모바일/PC 비율)이 어떻게 되나요?`,
    `${brief.fieldLabel}의 톤앤매너 레퍼런스를 더 공유해주실 수 있나요?`,
    `최종 산출물의 활용 채널이 구체적으로 어디인가요?`,
  ];

  const PLACEHOLDER_BODY = [
    `안녕하세요, ${brief.persona.company} ${brief.persona.name} ${brief.persona.title}님.`,
    '',
    '보내주신 브리프 잘 확인했습니다.',
    '작업 진행에 앞서 몇 가지 여쭤보고 싶은 부분이 있습니다.',
    '',
    '1. ',
    '2. ',
    '',
    '확인 부탁드립니다. 감사합니다.',
  ].join('\n');

  const autoResize = React.useCallback((el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 240)}px`;
  }, []);

  const charCount = bodyInput.length;
  const charColor = charCount < 200 ? 'var(--ink-500)' : charCount <= 400 ? 'var(--success)' : '#F59E0B';

  const addChip = (idx: number) => {
    const text    = suggested[idx];
    const newBody = bodyInput ? `${bodyInput}\n${text}` : text;
    setBodyInput(newBody);
    setUsedChips((prev) => new Set([...prev, idx]));
    setTimeout(() => {
      if (!textareaRef.current) return;
      autoResize(textareaRef.current);
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newBody.length, newBody.length);
    }, 0);
  };

  const handleSend = async () => {
    if (!bodyInput.trim() || loadingReplyFor) return;

    const subject  = subjectInput.trim() || `${brief.project.name} 관련 문의`;
    const bodyText = bodyInput;
    const now      = new Date().toISOString();
    const tempId   = `local_${Date.now()}`;

    const history: { role: 'user' | 'assistant'; content: string }[] = [];
    sentMessages.forEach((m) => {
      history.push({ role: 'user', content: m.body });
      if (replies[m.id]) {
        history.push({ role: 'assistant', content: replies[m.id].body });
      }
    });

    setSentMessages((prev) => [
      ...prev,
      { id: tempId, project_id: projectId ?? '', subject, body: bodyText, created_at: now },
    ]);
    setSubjectInput('');
    setBodyInput('');
    setUsedChips(new Set());
    setLoadingReplyFor(tempId);
    setTimeout(() => { if (textareaRef.current) textareaRef.current.style.height = '240px'; }, 0);

    if (projectId) {
      insertUserMessage(projectId, subject, bodyText).then((saved) => {
        if (!saved) {
          setSaveError(true);
          setTimeout(() => setSaveError(false), 5000);
        }
      });
    }

    try {
      const res = await fetch('/api/qna-reply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id:      projectId ?? '',
          user_subject:    subject,
          user_body:       bodyText,
          persona_id:      brief.persona_id ?? '',
          brief_summary:   `${brief.project.name}: ${brief.project.purpose}`,
          message_history: history.slice(-6),
        }),
      });
      const data = await res.json() as { reply_body?: string; reply_subject?: string; error?: string };

      if (res.ok && data.reply_body) {
        setReplies((prev) => ({
          ...prev,
          [tempId]: {
            subject:     data.reply_subject ?? `Re: ${subject}`,
            body:        data.reply_body!,
            received_at: new Date().toISOString(),
          },
        }));
      } else {
        setReplyError(true);
        setTimeout(() => setReplyError(false), 5000);
      }
    } catch {
      setReplyError(true);
      setTimeout(() => setReplyError(false), 5000);
    } finally {
      setLoadingReplyFor(null);
    }
  };

  const handleRetryReply = async (msg: SentMessage) => {
    setLoadingReplyFor(msg.id);

    const history: { role: 'user' | 'assistant'; content: string }[] = [];
    for (const m of sentMessages) {
      if (m.id === msg.id) break;
      history.push({ role: 'user', content: m.body });
      if (replies[m.id]) {
        history.push({ role: 'assistant', content: replies[m.id].body });
      }
    }

    try {
      const res = await fetch('/api/qna-reply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id:      projectId ?? '',
          user_subject:    msg.subject,
          user_body:       msg.body,
          persona_id:      brief.persona_id ?? '',
          brief_summary:   `${brief.project.name}: ${brief.project.purpose}`,
          message_history: history.slice(-6),
        }),
      });
      const data = await res.json() as { reply_body?: string; reply_subject?: string; error?: string };

      if (res.ok && data.reply_body) {
        setReplies((prev) => ({
          ...prev,
          [msg.id]: {
            subject:     data.reply_subject ?? `Re: ${msg.subject}`,
            body:        data.reply_body!,
            received_at: new Date().toISOString(),
          },
        }));
      } else {
        setReplyError(true);
        setTimeout(() => setReplyError(false), 5000);
      }
    } catch {
      setReplyError(true);
      setTimeout(() => setReplyError(false), 5000);
    } finally {
      setLoadingReplyFor(null);
    }
  };

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div>
      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {readOnly && onReturnToActive && <ReadOnlyBanner onReturn={onReturnToActive} />}

      {saveError && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 저장에 실패했습니다. 새로고침 후 다시 시도해주세요.
        </div>
      )}
      {replyError && (
        <div style={{ position: 'fixed', bottom: saveError ? 68 : 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 클라이언트 답장을 받지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>질의응답</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 14px' }}>브리프에서 모호한 부분을 클라이언트에게 질문해보세요.</p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', borderRadius: 999, padding: '6px 14px', marginBottom: 22, fontSize: 13, fontWeight: 600, color: 'var(--indigo-700)' }}>
        💌 최대 3회까지 메일을 주고받을 수 있어요 ({sentCount}/3)
      </div>

      {sentMessages.map((msg) => (
        <React.Fragment key={msg.id}>
          <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', marginBottom: (replies[msg.id] || loadingReplyFor === msg.id) ? 6 : 14, overflow: 'hidden', animation: 'fadeSlideIn 300ms ease' }}>
            <div style={{ padding: '11px 16px 9px', borderBottom: '1px solid var(--ink-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-400)', flexShrink: 0 }}>{fmtTime(msg.created_at)}</div>
            </div>
            <div style={{ padding: '10px 16px 12px', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.6, overflow: 'hidden', maxHeight: '4.8em', whiteSpace: 'pre-wrap' }}>
              {msg.body}
            </div>
          </div>

          {loadingReplyFor === msg.id && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: 'var(--ink-500)', background: 'var(--ink-50)', border: '1px dashed var(--ink-300)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--ink-200)', borderTopColor: 'var(--indigo-500)', animation: 'spin 1.0s linear infinite', flexShrink: 0 }} />
              💬 클라이언트가 메일을 확인 중입니다...
            </div>
          )}

          {replies[msg.id] && (
            <div style={{ marginBottom: 22, borderLeft: '2px solid var(--indigo-300)', background: 'var(--indigo-50)', borderRadius: '0 var(--radius) var(--radius) 0', overflow: 'hidden', animation: 'fadeSlideIn 400ms ease' }}>
              <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid rgba(99,102,241,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--indigo-800)' }}>
                  ↩ {brief.persona.name} ({brief.persona.company}) 답장
                </div>
                <div style={{ fontSize: 11, color: 'var(--indigo-500)', flexShrink: 0 }}>
                  {fmtTime(replies[msg.id].received_at)}
                </div>
              </div>
              <div style={{ padding: '10px 16px 14px', fontSize: 14, color: 'var(--indigo-900)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {replies[msg.id].body}
              </div>
            </div>
          )}

          {!readOnly && !replies[msg.id] && loadingReplyFor !== msg.id && !loadingReplyFor && (
            <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => handleRetryReply(msg)}
                style={{ background: 'var(--indigo-50)', border: '1px solid var(--indigo-200)', color: 'var(--indigo-700)', fontSize: 12.5, fontWeight: 600, padding: '7px 14px', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                ↩ 답장 받기
              </button>
            </div>
          )}
        </React.Fragment>
      ))}

      {/* 메일 작성 영역 — readOnly가 아닐 때만 */}
      {!readOnly && (
        canSendMore ? (
          <div style={{ border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--ink-100)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-400)', flexShrink: 0, width: 52 }}>받는 사람</span>
              <span style={{ fontSize: 13.5, color: 'var(--ink-600)' }}>
                {brief.persona.name} {brief.persona.title} ({brief.persona.email})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--ink-100)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-400)', flexShrink: 0, width: 52 }}>제목</span>
              <input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder={`예: ${brief.project.name} 관련 문의드립니다`}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--ink-900)', background: 'transparent', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ position: 'relative', borderBottom: '1px solid var(--ink-100)' }}>
              {!bodyInput && (
                <div
                  aria-hidden
                  style={{ position: 'absolute', inset: 0, padding: '14px 16px', fontSize: 14, lineHeight: 1.7, color: 'var(--ink-400)', pointerEvents: 'none', userSelect: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {PLACEHOLDER_BODY}
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={bodyInput}
                onChange={(e) => { setBodyInput(e.target.value); autoResize(e.target); }}
                style={{ width: '100%', minHeight: 240, padding: '14px 16px', border: 'none', outline: 'none', resize: 'none', overflow: 'hidden', fontSize: 14, lineHeight: 1.7, fontFamily: 'inherit', color: bodyInput ? 'var(--ink-900)' : 'transparent', caretColor: 'var(--ink-900)', background: 'transparent', display: 'block', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink-100)', background: 'var(--ink-50)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-600)', marginBottom: 8 }}>
                📌 추천 질문{' '}
                <span style={{ fontWeight: 400, color: 'var(--ink-400)' }}>(클릭하면 본문에 추가)</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {suggested.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addChip(i)}
                    style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 999, padding: '5px 12px', fontSize: 12.5, color: 'var(--ink-700)', cursor: 'pointer', lineHeight: 1.5, whiteSpace: 'nowrap', transition: 'opacity 150ms ease', opacity: usedChips.has(i) ? 0.45 : 1 }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: charColor }}>
                {charCount}자 <span style={{ color: 'var(--ink-300)' }}>/</span> 권장 200~400자
              </div>
              <button
                type="button"
                onClick={() => { handleSend(); }}
                disabled={!bodyInput.trim() || !!loadingReplyFor}
                style={{ ...pBtn, opacity: (bodyInput.trim() && !loadingReplyFor) ? 1 : 0.45, cursor: (bodyInput.trim() && !loadingReplyFor) ? 'pointer' : 'not-allowed' }}
              >
                📨 메일 보내기
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#166534' }}>
              ✅ 질의응답을 마쳤어요. 다음 단계인 &apos;시안 제출&apos;로 넘어가세요.
            </div>
            <button type="button" onClick={onNext} style={pBtn}>
              다음 단계로 <Icon.ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        )
      )}

      {!readOnly && sentCount >= 1 && canSendMore && !loadingReplyFor && (
        <div style={{ textAlign: 'right', marginTop: 14 }}>
          <button type="button" onClick={onNext} style={{ ...sBtn, fontSize: 13, padding: '8px 14px', color: 'var(--ink-500)' }}>
            질의응답 끝내기 →
          </button>
        </div>
      )}
    </div>
  );
};

// ── StepDraft helpers ─────────────────────────────────────────────────────────
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ── StepDraft ─────────────────────────────────────────────────────────────────
const StepDraft = ({
  onNext,
  brief,
  projectId,
  readOnly = false,
  onReturnToActive,
  initialFeedback = null,
}: {
  onNext:             () => void;
  brief:              BriefData;
  projectId?:         string;
  readOnly?:          boolean;
  onReturnToActive?:  () => void;
  initialFeedback?:   string | null;
}) => {
  const [selectedFile,  setSelectedFile]  = React.useState<File | null>(null);
  const [previewUrl,    setPreviewUrl]    = React.useState<string | null>(null);
  const [description,   setDescription]  = React.useState('');
  const [isLoading,     setIsLoading]    = React.useState(false);
  const [feedback,      setFeedback]     = React.useState<string | null>(initialFeedback);
  const [isConfirmed,   setIsConfirmed]  = React.useState<boolean | null>(
    initialFeedback !== null ? initialFeedback.includes('[컨펌]') : null,
  );
  const [sizeError,     setSizeError]    = React.useState(false);
  const [apiError,      setApiError]     = React.useState(false);
  const [isDragging,    setIsDragging]   = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 4000);
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFeedback(null);
    setIsConfirmed(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
      handleFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFeedback(null);
    setIsConfirmed(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!selectedFile || isLoading) return;
    setIsLoading(true);
    setApiError(false);

    try {
      const base64 = await toBase64(selectedFile);
      const mediaType = selectedFile.type as 'image/jpeg' | 'image/png' | 'image/webp';

      const fieldMap: Record<string, string> = {
        '상세페이지': 'detail', '웹사이트': 'web', '브랜딩': 'brand', '앱': 'app',
      };

      const res = await fetch('/api/draft-feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id:   projectId ?? '',
          image_base64: base64,
          media_type:   mediaType,
          description,
          persona_id:   brief.persona_id ?? '',
          brief_summary: {
            project_name:    brief.project.name,
            project_purpose: brief.project.purpose,
            field:           fieldMap[brief.fieldLabel] ?? 'web',
            emotion:         brief.emotion,
            target:          typeof brief.target === 'string' ? brief.target : JSON.stringify(brief.target),
            deliverable:     brief.deliverable,
          },
        }),
      });

      const data = await res.json() as { feedback?: string; is_confirmed?: boolean; error?: string };

      if (res.ok && data.feedback) {
        setFeedback(data.feedback);
        setIsConfirmed(data.is_confirmed ?? false);
      } else {
        setApiError(true);
        setTimeout(() => setApiError(false), 5000);
      }
    } catch {
      setApiError(true);
      setTimeout(() => setApiError(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {readOnly && onReturnToActive && <ReadOnlyBanner onReturn={onReturnToActive} />}

      {sizeError && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 10MB 이하 이미지만 업로드 가능합니다
        </div>
      )}
      {apiError && (
        <div style={{ position: 'fixed', bottom: sizeError ? 68 : 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 피드백을 받지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>시안 제출</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 22px' }}>
        작업한 시안을 업로드해 클라이언트에게 제출해주세요. 2~3안 제안이 일반적이에요.
      </p>

      {!feedback && !readOnly && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }}
            onChange={handleInputChange}
            disabled={readOnly}
          />

          {previewUrl ? (
            <div style={{ position: 'relative', marginBottom: 18, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1.5px solid var(--ink-200)', background: 'var(--ink-50)' }}>
              <img src={previewUrl} alt="시안 미리보기" style={{ width: '100%', maxHeight: 360, objectFit: 'contain', display: 'block' }} />
              <button
                type="button"
                onClick={removeFile}
                style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 999, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, lineHeight: 1 }}
                aria-label="이미지 제거"
              >
                ×
              </button>
              <div style={{ padding: '8px 14px', fontSize: 12, color: 'var(--ink-500)' }}>
                {selectedFile?.name} · {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(1) : 0}MB
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{ border: `2px dashed ${isDragging ? 'var(--indigo-400)' : 'var(--ink-300)'}`, borderRadius: 'var(--radius-lg)', padding: '44px 24px', textAlign: 'center', background: isDragging ? 'var(--indigo-50)' : 'var(--ink-50)', marginBottom: 18, cursor: 'pointer', transition: 'all 150ms ease' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--white)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)', color: 'var(--indigo-600)' }}>
                <Icon.Upload style={{ width: 22, height: 22 }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                시안 이미지를 끌어다 놓거나 클릭해서 업로드
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>PNG, JPG, WEBP · 최대 10MB</div>
            </div>
          )}

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 300))}
            placeholder="디자인 의도나 특이사항이 있다면 적어주세요 (선택)"
            style={{ width: '100%', minHeight: 80, padding: '12px 14px', border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', marginBottom: 8, boxSizing: 'border-box', color: 'var(--ink-900)' }}
          />
          <div style={{ fontSize: 12, color: 'var(--ink-400)', textAlign: 'right', marginBottom: 18 }}>
            {description.length} / 300자
          </div>

          {isLoading && (
            <div style={{ background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeSlideIn 300ms ease' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--indigo-200)', borderTopColor: 'var(--indigo-600)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-800)' }}>클라이언트가 시안을 검토 중입니다...</div>
                <div style={{ fontSize: 12, color: 'var(--indigo-600)', marginTop: 2 }}>시안 분석은 20~30초 정도 걸릴 수 있어요</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              style={{ ...pBtn, opacity: (selectedFile && !isLoading) ? 1 : 0.45, cursor: (selectedFile && !isLoading) ? 'pointer' : 'not-allowed' }}
            >
              📤 시안 제출하기
            </button>
          </div>
        </>
      )}

      {/* readOnly 상태에서 업로드 전이면 안내 메시지 */}
      {readOnly && !feedback && (
        <div style={{ background: 'var(--ink-50)', border: '1px dashed var(--ink-300)', borderRadius: 'var(--radius-lg)', padding: '40px 24px', textAlign: 'center', color: 'var(--ink-400)', fontSize: 14 }}>
          이 단계는 아직 진행 내용이 없습니다.
        </div>
      )}

      {feedback && (
        <div style={{ animation: 'fadeSlideIn 400ms ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700,
              background: isConfirmed ? '#DCFCE7' : '#FEF3C7',
              color:      isConfirmed ? '#166534' : '#92400E',
              border:     `1px solid ${isConfirmed ? '#BBF7D0' : '#FDE68A'}`,
            }}>
              {isConfirmed ? '✅ 컨펌' : '🔄 수정 요청'}
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>
              {brief.persona.name} 님의 시안 피드백
            </span>
          </div>

          <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', marginBottom: 20, fontSize: 14, color: 'var(--ink-800)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
            {feedback}
          </div>

          {previewUrl && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-400)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>제출한 시안</div>
              <img src={previewUrl} alt="제출 시안" style={{ maxHeight: 180, borderRadius: 'var(--radius)', border: '1px solid var(--ink-200)', objectFit: 'contain', display: 'block' }} />
            </div>
          )}

          {!readOnly && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {isConfirmed ? (
                <button type="button" onClick={onNext} style={pBtn}>
                  다음 단계로 <Icon.ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setFeedback(null); setIsConfirmed(null); }}
                    style={sBtn}
                  >
                    🔧 수정 후 다시 제출
                  </button>
                  <button type="button" onClick={onNext} style={{ ...sBtn, color: 'var(--ink-400)', fontSize: 13 }}>
                    그래도 다음으로 →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── StepFeedback ──────────────────────────────────────────────────────────────
const StepFeedback = ({
  brief,
  onNext,
  readOnly = false,
  onReturnToActive,
  initialFeedback = null,
  projectId,
}: {
  brief:             BriefData;
  onNext:            () => void;
  readOnly?:         boolean;
  onReturnToActive?: () => void;
  initialFeedback?:  string | null;
  projectId?:        string;
}) => {
  const [revisionFile,        setRevisionFile]        = React.useState<File | null>(null);
  const [revisionPreviewUrl,  setRevisionPreviewUrl]  = React.useState<string | null>(null);
  const [revisionDescription, setRevisionDescription] = React.useState('');
  const [isRevisionLoading,   setIsRevisionLoading]   = React.useState(false);
  const [revisionFeedback,    setRevisionFeedback]    = React.useState<string | null>(null);
  const [isRevisionConfirmed, setIsRevisionConfirmed] = React.useState<boolean | null>(null);
  const [revisionSizeError,   setRevisionSizeError]   = React.useState(false);
  const [revisionApiError,    setRevisionApiError]    = React.useState(false);
  const [isDragging,          setIsDragging]          = React.useState(false);
  const revisionFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleRevisionFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setRevisionSizeError(true);
      setTimeout(() => setRevisionSizeError(false), 4000);
      return;
    }
    setRevisionFile(file);
    setRevisionPreviewUrl(URL.createObjectURL(file));
    setRevisionFeedback(null);
    setIsRevisionConfirmed(null);
  };

  const removeRevisionFile = () => {
    setRevisionFile(null);
    if (revisionPreviewUrl) URL.revokeObjectURL(revisionPreviewUrl);
    setRevisionPreviewUrl(null);
    setRevisionFeedback(null);
    setIsRevisionConfirmed(null);
    if (revisionFileInputRef.current) revisionFileInputRef.current.value = '';
  };

  const handleRevisionSubmit = async () => {
    if (!revisionFile || isRevisionLoading) return;
    setIsRevisionLoading(true);
    setRevisionApiError(false);

    try {
      const base64    = await toBase64(revisionFile);
      const mediaType = revisionFile.type as 'image/jpeg' | 'image/png' | 'image/webp';
      const fieldMap: Record<string, string> = {
        '상세페이지': 'detail', '웹사이트': 'web', '브랜딩': 'brand', '앱': 'app',
      };

      const res = await fetch('/api/draft-feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id:        projectId ?? '',
          image_base64:      base64,
          media_type:        mediaType,
          description:       revisionDescription,
          persona_id:        brief.persona_id ?? '',
          brief_summary: {
            project_name:    brief.project.name,
            project_purpose: brief.project.purpose,
            field:           fieldMap[brief.fieldLabel] ?? 'web',
            emotion:         brief.emotion,
            target:          typeof brief.target === 'string' ? brief.target : JSON.stringify(brief.target),
            deliverable:     brief.deliverable,
          },
          is_revision:       true,
          previous_feedback: initialFeedback ?? '',
        }),
      });

      const data = await res.json() as { feedback?: string; is_confirmed?: boolean; error?: string };

      if (res.ok && data.feedback) {
        setRevisionFeedback(data.feedback);
        setIsRevisionConfirmed(data.is_confirmed ?? false);
      } else {
        setRevisionApiError(true);
        setTimeout(() => setRevisionApiError(false), 5000);
      }
    } catch {
      setRevisionApiError(true);
      setTimeout(() => setRevisionApiError(false), 5000);
    } finally {
      setIsRevisionLoading(false);
    }
  };

  return (
    <div>
      <style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {readOnly && onReturnToActive && <ReadOnlyBanner onReturn={onReturnToActive} />}

      {revisionSizeError && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 10MB 이하 이미지만 업로드 가능합니다
        </div>
      )}
      {revisionApiError && (
        <div style={{ position: 'fixed', bottom: revisionSizeError ? 68 : 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 피드백을 받지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>피드백 수용</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 22px' }}>클라이언트의 피드백을 검토하고 수정 방향을 결정해주세요.</p>

      {/* 이전 시안 피드백 카드 */}
      {initialFeedback ? (
        <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '16px 18px', marginBottom: 18, fontSize: 14, color: 'var(--ink-800)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 600, marginBottom: 8 }}>{brief.persona.name} 님의 시안 피드백</div>
          {initialFeedback}
        </div>
      ) : (
        <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '16px 18px', marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 600, marginBottom: 8 }}>{brief.persona.name} 님의 피드백</div>
          <div style={{ fontSize: 14, color: 'var(--ink-800)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{`전반적인 방향성은 좋습니다. 다만 메인 컬러가 다소 무겁게 느껴져요. 조금 더 밝고 친근한 톤으로 조정 부탁드릴 수 있을까요?\n\n그리고 메인 카피의 위계를 좀 더 명확히 잡아주시면 좋을 것 같습니다.`}</div>
        </div>
      )}

      {/* readOnly일 때 재제출 UI 숨김 + 조기 종료 */}
      {readOnly ? null : (
        <>
          {/* 구분선 */}
          <div style={{ borderTop: '1px solid var(--ink-100)', margin: '24px 0' }} />

          {/* 재제출 섹션 */}
          {!revisionFeedback ? (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 4 }}>수정한 시안을 다시 제출하시겠어요?</div>
                <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>수정 후 재제출하면 이전 시안과 비교해서 어떤 점이 좋아졌는지 알려드려요.</div>
              </div>

              <input
                ref={revisionFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleRevisionFile(f); }}
              />

              {revisionPreviewUrl ? (
                <div style={{ position: 'relative', marginBottom: 14, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1.5px solid var(--ink-200)', background: 'var(--ink-50)' }}>
                  <img src={revisionPreviewUrl} alt="수정 시안 미리보기" style={{ width: '100%', maxHeight: 320, objectFit: 'contain', display: 'block' }} />
                  <button type="button" onClick={removeRevisionFile} style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 999, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, lineHeight: 1 }} aria-label="이미지 제거">×</button>
                  <div style={{ padding: '8px 14px', fontSize: 12, color: 'var(--ink-500)' }}>{revisionFile?.name} · {revisionFile ? (revisionFile.size / 1024 / 1024).toFixed(1) : 0}MB</div>
                </div>
              ) : (
                <div
                  onClick={() => revisionFileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f && (f.type === 'image/png' || f.type === 'image/jpeg' || f.type === 'image/webp')) handleRevisionFile(f); }}
                  style={{ border: `2px dashed ${isDragging ? 'var(--indigo-400)' : 'var(--ink-300)'}`, borderRadius: 'var(--radius-lg)', padding: '36px 24px', textAlign: 'center', background: isDragging ? 'var(--indigo-50)' : 'var(--ink-50)', marginBottom: 14, cursor: 'pointer', transition: 'all 150ms ease' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--white)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)', color: 'var(--indigo-600)' }}>
                    <Icon.Upload style={{ width: 18, height: 18 }} />
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>수정한 시안 이미지 업로드</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>PNG, JPG, WEBP · 최대 10MB</div>
                </div>
              )}

              <textarea
                value={revisionDescription}
                onChange={(e) => setRevisionDescription(e.target.value.slice(0, 300))}
                placeholder="수정한 내용을 간단히 설명해주세요 (선택)"
                style={{ width: '100%', minHeight: 70, padding: '11px 14px', border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', marginBottom: 14, boxSizing: 'border-box', color: 'var(--ink-900)' }}
              />

              {isRevisionLoading && (
                <div style={{ background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--indigo-200)', borderTopColor: 'var(--indigo-600)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--indigo-800)' }}>이전 시안과 비교 중입니다...</div>
                    <div style={{ fontSize: 12, color: 'var(--indigo-600)', marginTop: 2 }}>20~30초 정도 걸릴 수 있어요</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" onClick={onNext} style={{ ...sBtn, fontSize: 13, color: 'var(--ink-500)' }}>
                  수정 없이 최종 납품하기 →
                </button>
                <button
                  type="button"
                  onClick={handleRevisionSubmit}
                  disabled={!revisionFile || isRevisionLoading}
                  style={{ ...pBtn, opacity: (revisionFile && !isRevisionLoading) ? 1 : 0.45, cursor: (revisionFile && !isRevisionLoading) ? 'pointer' : 'not-allowed' }}
                >
                  📤 수정 시안 제출하기
                </button>
              </div>
            </>
          ) : (
            /* 비교 피드백 카드 */
            <div style={{ animation: 'fadeSlideIn 400ms ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: 'var(--indigo-50)', color: 'var(--indigo-700)', border: '1px solid var(--indigo-100)' }}>
                  🔄 재제출 피드백
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: isRevisionConfirmed ? '#DCFCE7' : '#FEF3C7', color: isRevisionConfirmed ? '#166534' : '#92400E', border: `1px solid ${isRevisionConfirmed ? '#BBF7D0' : '#FDE68A'}` }}>
                  {isRevisionConfirmed ? '✅ 컨펌' : '🔄 수정 요청'}
                </div>
              </div>

              <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', marginBottom: 18, fontSize: 14, color: 'var(--ink-800)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {revisionFeedback}
              </div>

              {revisionPreviewUrl && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-400)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>제출한 수정 시안</div>
                  <img src={revisionPreviewUrl} alt="수정 시안" style={{ maxHeight: 160, borderRadius: 'var(--radius)', border: '1px solid var(--ink-200)', objectFit: 'contain', display: 'block' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" onClick={onNext} style={{ ...sBtn, fontSize: 13, color: 'var(--ink-500)' }}>
                  수정 없이 최종 납품하기 →
                </button>
                {isRevisionConfirmed ? (
                  <button type="button" onClick={onNext} style={pBtn}>
                    최종 납품으로 <Icon.ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                ) : (
                  <button type="button" onClick={() => { setRevisionFeedback(null); setIsRevisionConfirmed(null); removeRevisionFile(); }} style={sBtn}>
                    🔧 다시 수정하기
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── StepDeliver ───────────────────────────────────────────────────────────────
const StepDeliver = ({ brief, onFinish }: { brief: BriefData; onFinish: () => void }) => (
  <div style={{ textAlign: 'center', padding: '20px 0' }}>
    <div style={{ width: 72, height: 72, borderRadius: 999, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', color: '#fff', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-indigo)' }}>
      <Icon.Sparkle style={{ width: 32, height: 32 }} />
    </div>
    <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>프로젝트 완료!</h2>
    <p style={{ fontSize: 14.5, color: 'var(--ink-600)', margin: '0 auto 28px', maxWidth: 420, lineHeight: 1.6 }}>
      {brief.project.name} 프로젝트를 성공적으로 마무리했어요.<br />AI가 작업 과정을 분석해 피드백을 준비하고 있습니다.
    </p>
    <div style={{ background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', maxWidth: 480, margin: '0 auto 24px', textAlign: 'left' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--indigo-700)', marginBottom: 10, letterSpacing: 0.4, textTransform: 'uppercase' }}>이번 연습 요약</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[['분야', brief.fieldLabel], ['난이도', brief.difficulty], ['제작 기간', brief.durationLabel], ['완료 단계', '5 / 5']].map(([k, v]) => (
          <div key={k}><div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{k}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div></div>
        ))}
      </div>
    </div>
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      <button type="button" onClick={onFinish} style={sBtn}>처음으로</button>
      <button type="button" style={pBtn}><Icon.Sparkle style={{ width: 14, height: 14 }} /> AI 피드백 받기</button>
    </div>
  </div>
);

// ── BriefProcess (메인) ────────────────────────────────────────────────────────
export const BriefProcess = ({
  brief, onBack, onFinish,
  initialStepIdx = 0,
  embedded = false,
  projectId,
  initialMessages = [],
  initialReplies  = [],
  initialDraftFeedback = null,
  onStepChange,
}: {
  brief:                 BriefData;
  onBack:                () => void;
  onFinish:              () => void;
  initialStepIdx?:       number;
  embedded?:             boolean;
  projectId?:            string;
  initialMessages?:      SentMessage[];
  initialReplies?:       SentMessage[];
  initialDraftFeedback?: string | null;
  onStepChange?:         (newStepIdx: number) => Promise<void>;
}) => {
  // activeIdx: 실제 진행 위치 (DB 저장 기준)
  // viewingIdx: 현재 화면에 표시 중인 단계 (사이드바 클릭으로 변경 가능)
  const [activeIdx,  setActiveIdx]  = React.useState(initialStepIdx);
  const [viewingIdx, setViewingIdx] = React.useState(initialStepIdx);

  const next = () => {
    const newIdx = Math.min(activeIdx + 1, STEPS.length - 1);
    setActiveIdx(newIdx);
    setViewingIdx(newIdx);
    onStepChange?.(newIdx).catch((e) =>
      console.error('[BriefLab] onStepChange 실패:', e),
    );
  };

  const handleStepClick = (idx: number) => {
    if (idx <= activeIdx) {
      setViewingIdx(idx);
    }
  };

  const returnToActive = () => setViewingIdx(activeIdx);

  const readOnly = viewingIdx < activeIdx;

  return (
    <div style={{ minHeight: embedded ? 'auto' : '100vh', display: 'flex', flexDirection: 'column', background: embedded ? 'transparent' : 'var(--ink-50)' }}>
      {!embedded && (
        <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
          <button type="button" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', background: 'transparent', border: 'none', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-700)', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>
            <Icon.ChevronLeft style={{ width: 16, height: 16 }} /> 브리프로 돌아가기
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, whiteSpace: 'nowrap' }}>
            <SDot done /><Dash /><SDot done /><Dash />
            <SDot active num={3} label="프로세스 진행" />
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{viewingIdx + 1} / {STEPS.length} — {STEPS[viewingIdx].label}</div>
        </header>
      )}
      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: embedded ? '24px 0' : '32px 36px', display: 'grid', gridTemplateColumns: '260px minmax(0,1fr)', gap: 24, alignItems: 'flex-start' }}>
        <ProcessRail
          activeIdx={activeIdx}
          viewingIdx={viewingIdx}
          onStepClick={handleStepClick}
        />
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '32px 36px', boxShadow: 'var(--shadow-xs)', minHeight: 480 }}>
          {viewingIdx === 0 && (
            <StepReceive
              brief={brief}
              onNext={next}
              readOnly={readOnly}
              onReturnToActive={returnToActive}
            />
          )}
          {viewingIdx === 1 && (
            <StepQna
              brief={brief}
              onNext={next}
              projectId={projectId}
              initialMessages={initialMessages}
              initialReplies={initialReplies}
              readOnly={readOnly}
              onReturnToActive={returnToActive}
            />
          )}
          {viewingIdx === 2 && (
            <StepDraft
              onNext={next}
              brief={brief}
              projectId={projectId}
              readOnly={readOnly}
              onReturnToActive={returnToActive}
              initialFeedback={initialDraftFeedback}
            />
          )}
          {viewingIdx === 3 && (
            <StepFeedback
              brief={brief}
              onNext={next}
              readOnly={readOnly}
              onReturnToActive={returnToActive}
              initialFeedback={initialDraftFeedback}
              projectId={projectId}
            />
          )}
          {viewingIdx === 4 && <StepDeliver brief={brief} onFinish={onFinish} />}
        </div>
      </main>
    </div>
  );
};

const SDot = ({ num, label, done, active }: { num?: number; label?: string; done?: boolean; active?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: active ? 'var(--indigo-700)' : 'var(--ink-500)', fontWeight: active ? 600 : 400 }}>
    <div style={{ width: 22, height: 22, borderRadius: 999, background: done ? 'var(--success)' : active ? 'var(--indigo-600)' : 'var(--ink-100)', color: done || active ? '#fff' : 'var(--ink-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
      {done ? <Icon.Check style={{ width: 11, height: 11 }} /> : num}
    </div>
    {label}
  </div>
);
const Dash = () => <div style={{ width: 24, height: 1, background: 'var(--ink-300)' }} />;
