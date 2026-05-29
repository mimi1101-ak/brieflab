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

const ProcessRail = ({ activeIdx }: { activeIdx: number }) => (
  <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', boxShadow: 'var(--shadow-xs)' }}>
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 14 }}>실무 워크플로우</div>
    {STEPS.map((step, i) => {
      const status = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
      return (
        <div key={step.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative', paddingBottom: i === STEPS.length - 1 ? 0 : 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: status === 'done' ? 'var(--success)' : status === 'active' ? 'var(--indigo-600)' : 'var(--ink-100)', color: status === 'pending' ? 'var(--ink-500)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, boxShadow: status === 'active' ? '0 0 0 4px rgba(79,70,229,0.18)' : 'none', transition: 'all 200ms ease' }}>
              {status === 'done' ? <Icon.Check style={{ width: 13, height: 13 }} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: i < activeIdx ? 'var(--success)' : 'var(--ink-200)', marginTop: 4 }} />}
          </div>
          <div style={{ paddingTop: 4, paddingBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: status === 'pending' ? 500 : 700, color: status === 'pending' ? 'var(--ink-500)' : 'var(--ink-900)', whiteSpace: 'nowrap' }}>{step.label}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{step.sub}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const StepReceive = ({ brief, onNext }: { brief: BriefData; onNext: () => void }) => (
  <div>
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
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
      <button type="button" style={sBtn}>거절</button>
      <button type="button" onClick={onNext} style={pBtn}><Icon.Check style={{ width: 14, height: 14 }} /> 작업 수락하기</button>
    </div>
  </div>
);

// ─── StepQna ─────────────────────────────────────────────────────────────────

const StepQna = ({
  brief,
  onNext,
  projectId,
  initialMessages = [],
  initialReplies  = [],
}: {
  brief:            BriefData;
  onNext:           () => void;
  projectId?:       string;
  initialMessages?: SentMessage[];
  initialReplies?:  SentMessage[];   // DB에서 복원한 assistant 메시지 목록
}) => {
  const [sentMessages,    setSentMessages]    = React.useState<SentMessage[]>(initialMessages);

  // replies: key = 보낸 메일 id (tempId 또는 real id), value = 받은 답장
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

  // 멀티라인 placeholder
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

    // 전송 전 이전 대화 캡처 (user + assistant 교차)
    const history: { role: 'user' | 'assistant'; content: string }[] = [];
    sentMessages.forEach((m) => {
      history.push({ role: 'user', content: m.body });
      if (replies[m.id]) {
        history.push({ role: 'assistant', content: replies[m.id].body });
      }
    });

    // 1. 즉시 UI 반영 (낙관적 업데이트) + 로딩 플래그
    setSentMessages((prev) => [
      ...prev,
      { id: tempId, project_id: projectId ?? '', subject, body: bodyText, created_at: now },
    ]);
    setSubjectInput('');
    setBodyInput('');
    setUsedChips(new Set());
    setLoadingReplyFor(tempId);
    setTimeout(() => { if (textareaRef.current) textareaRef.current.style.height = '240px'; }, 0);

    // 2. DB INSERT — user 메시지 (fire & forget, UI 블로킹 없음)
    if (projectId) {
      insertUserMessage(projectId, subject, bodyText).then((saved) => {
        if (!saved) {
          setSaveError(true);
          setTimeout(() => setSaveError(false), 5000);
        }
      });
    }

    // 3. AI 답장 요청
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

  // 기존 메시지에 누락된 답장을 다시 받는 핸들러
  const handleRetryReply = async (msg: SentMessage) => {
    setLoadingReplyFor(msg.id);

    // 이 메시지 이전까지의 대화 기록 구성
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

      {/* 저장 실패 토스트 */}
      {saveError && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 저장에 실패했습니다. 새로고침 후 다시 시도해주세요.
        </div>
      )}

      {/* 답장 실패 토스트 */}
      {replyError && (
        <div style={{ position: 'fixed', bottom: saveError ? 68 : 24, left: '50%', transform: 'translateX(-50%)', background: '#1E1E2E', color: '#fff', fontSize: 13, fontWeight: 500, padding: '10px 18px', borderRadius: 999, zIndex: 9999, whiteSpace: 'nowrap', animation: 'toastIn 200ms ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          ⚠️ 클라이언트 답장을 받지 못했어요. 잠시 후 다시 시도해주세요.
        </div>
      )}

      {/* 헤더 */}
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>질의응답</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 14px' }}>브리프에서 모호한 부분을 클라이언트에게 질문해보세요.</p>

      {/* 횟수 안내 배너 */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--indigo-50)', border: '1px solid var(--indigo-100)', borderRadius: 999, padding: '6px 14px', marginBottom: 22, fontSize: 13, fontWeight: 600, color: 'var(--indigo-700)' }}>
        💌 최대 3회까지 메일을 주고받을 수 있어요 ({sentCount}/3)
      </div>

      {/* 보낸 메일 + 답장 누적 목록 */}
      {sentMessages.map((msg) => (
        <React.Fragment key={msg.id}>

          {/* 보낸 메일 카드 */}
          <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', marginBottom: (replies[msg.id] || loadingReplyFor === msg.id) ? 6 : 14, overflow: 'hidden', animation: 'fadeSlideIn 300ms ease' }}>
            <div style={{ padding: '11px 16px 9px', borderBottom: '1px solid var(--ink-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-400)', flexShrink: 0 }}>{fmtTime(msg.created_at)}</div>
            </div>
            <div style={{ padding: '10px 16px 12px', fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.6, overflow: 'hidden', maxHeight: '4.8em', whiteSpace: 'pre-wrap' }}>
              {msg.body}
            </div>
          </div>

          {/* 로딩 표시 (이 메일의 답장 대기 중일 때만) */}
          {loadingReplyFor === msg.id && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: 'var(--ink-500)', background: 'var(--ink-50)', border: '1px dashed var(--ink-300)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--ink-200)', borderTopColor: 'var(--indigo-500)', animation: 'spin 1.0s linear infinite', flexShrink: 0 }} />
              💬 클라이언트가 메일을 확인 중입니다...
            </div>
          )}

          {/* 답장 카드 */}
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

          {/* 답장 재요청 버튼 — 답장이 없고 로딩 중이 아닐 때 */}
          {!replies[msg.id] && loadingReplyFor !== msg.id && !loadingReplyFor && (
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

      {/* ── 메일 작성 영역 (3회 미만) ────────────────────────────────── */}
      {canSendMore ? (
        <div style={{ border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--white)' }}>

          {/* 받는 사람 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--ink-100)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-400)', flexShrink: 0, width: 52 }}>받는 사람</span>
            <span style={{ fontSize: 13.5, color: 'var(--ink-600)' }}>
              {brief.persona.name} {brief.persona.title} ({brief.persona.email})
            </span>
          </div>

          {/* 제목 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--ink-100)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-400)', flexShrink: 0, width: 52 }}>제목</span>
            <input
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder={`예: ${brief.project.name} 관련 문의드립니다`}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--ink-900)', background: 'transparent', fontFamily: 'inherit' }}
            />
          </div>

          {/* 본문 — 커스텀 멀티라인 플레이스홀더 오버레이 */}
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

          {/* 추천 질문 칩 */}
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

          {/* 하단: 글자 수 + 보내기 버튼 */}
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
        /* 3회 완료 안내 */
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#166534' }}>
            ✅ 질의응답을 마쳤어요. 다음 단계인 &apos;시안 제출&apos;로 넘어가세요.
          </div>
          <button type="button" onClick={onNext} style={pBtn}>
            다음 단계로 <Icon.ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      )}

      {/* 조기 종료 버튼 — 1회 이상 보냈고 3회 미만이며 답장 대기 중이 아닐 때 */}
      {sentCount >= 1 && canSendMore && !loadingReplyFor && (
        <div style={{ textAlign: 'right', marginTop: 14 }}>
          <button type="button" onClick={onNext} style={{ ...sBtn, fontSize: 13, padding: '8px 14px', color: 'var(--ink-500)' }}>
            질의응답 끝내기 →
          </button>
        </div>
      )}
    </div>
  );
};

const StepDraft = ({ onNext }: { onNext: () => void }) => (
  <div>
    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>시안 제출</h2>
    <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 22px' }}>작업한 시안을 업로드해 클라이언트에게 제출해주세요. 2~3안 제안이 일반적이에요.</p>
    <div style={{ border: '2px dashed var(--ink-300)', borderRadius: 'var(--radius-lg)', padding: '40px 24px', textAlign: 'center', background: 'var(--ink-50)', marginBottom: 18 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--white)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)', color: 'var(--indigo-600)' }}>
        <Icon.Upload style={{ width: 22, height: 22 }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>시안 파일을 끌어다 놓거나 클릭해서 업로드</div>
      <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>JPG, PNG, PDF, Figma 링크 지원</div>
    </div>
    <textarea placeholder="시안 설명 (디자인 의도, 차별점 등)" style={{ width: '100%', minHeight: 90, padding: '12px 14px', border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', marginBottom: 18 }} />
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
      <button type="button" onClick={onNext} style={pBtn}>시안 제출하기 <Icon.Wand style={{ width: 14, height: 14 }} /></button>
    </div>
  </div>
);

const StepFeedback = ({ brief, onNext }: { brief: BriefData; onNext: () => void }) => (
  <div>
    <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>피드백 수용</h2>
    <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 22px' }}>클라이언트의 피드백을 검토하고 수정 방향을 결정해주세요.</p>
    <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '16px 18px', marginBottom: 18 }}>
      <div style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 600, marginBottom: 8 }}>{brief.persona.name} 님의 피드백</div>
      <div style={{ fontSize: 14, color: 'var(--ink-800)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{`전반적인 방향성은 좋습니다. 다만 메인 컬러가 다소 무겁게 느껴져요. 조금 더 밝고 친근한 톤으로 조정 부탁드릴 수 있을까요?\n\n그리고 메인 카피의 위계를 좀 더 명확히 잡아주시면 좋을 것 같습니다.`}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
      {['컬러 톤 조정 (밝고 친근하게)', '메인 카피 위계 강화'].map((task, i) => (
        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', fontSize: 13.5, cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ accentColor: 'var(--indigo-600)' }} />{task}
        </label>
      ))}
    </div>
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
      <button type="button" onClick={onNext} style={pBtn}>수정 완료 <Icon.Check style={{ width: 14, height: 14 }} /></button>
    </div>
  </div>
);

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

export const BriefProcess = ({
  brief, onBack, onFinish,
  initialStepIdx = 0,
  embedded = false,
  projectId,
  initialMessages = [],
  initialReplies  = [],
  onStepChange,
}: {
  brief:            BriefData;
  onBack:           () => void;
  onFinish:         () => void;
  /** DB current_step を mapDbStepToComponentIdx() で変換した値を渡す */
  initialStepIdx?:  number;
  /** true のとき: 自前ヘッダー非表示・minHeight を auto に変更 */
  embedded?:        boolean;
  /** 워크스페이스 진입 시 주입되는 프로젝트 ID */
  projectId?:       string;
  /** DB에서 복원한 QnA 사용자 메시지 목록 */
  initialMessages?: SentMessage[];
  /** DB에서 복원한 QnA assistant 답장 목록 (순서 기준 initialMessages[i] 에 대응) */
  initialReplies?:  SentMessage[];
  /** 단계 전진 시 DB 업데이트를 수행하는 콜백 */
  onStepChange?:    (newStepIdx: number) => Promise<void>;
}) => {
  const [stepIdx, setStepIdx] = React.useState(initialStepIdx);
  const next = () => {
    const newIdx = Math.min(stepIdx + 1, STEPS.length - 1);
    setStepIdx(newIdx);
    // 낙관적: UI 즉시 전진, DB 업데이트는 백그라운드
    onStepChange?.(newIdx).catch((e) =>
      console.error('[BriefLab] onStepChange 실패:', e),
    );
  };

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
        <div style={{ fontSize: 12, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{stepIdx + 1} / {STEPS.length} — {STEPS[stepIdx].label}</div>
      </header>
      )}
      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: embedded ? '24px 0' : '32px 36px', display: 'grid', gridTemplateColumns: '260px minmax(0,1fr)', gap: 24, alignItems: 'flex-start' }}>
        <ProcessRail activeIdx={stepIdx} />
        <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '32px 36px', boxShadow: 'var(--shadow-xs)', minHeight: 480 }}>
          {stepIdx === 0 && <StepReceive brief={brief} onNext={next} />}
          {stepIdx === 1 && (
            <StepQna
              brief={brief}
              onNext={next}
              projectId={projectId}
              initialMessages={initialMessages}
              initialReplies={initialReplies}
            />
          )}
          {stepIdx === 2 && <StepDraft onNext={next} />}
          {stepIdx === 3 && <StepFeedback brief={brief} onNext={next} />}
          {stepIdx === 4 && <StepDeliver brief={brief} onFinish={onFinish} />}
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
