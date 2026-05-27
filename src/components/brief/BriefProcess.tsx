'use client';
import React from 'react';
import * as Icon from '@/components/ui/Icon';
import { BriefData } from './types';

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

const StepQna = ({ brief, onNext }: { brief: BriefData; onNext: () => void }) => {
  const suggested = [
    `타겟 고객의 사용 환경(모바일/PC 비율)이 어떻게 되나요?`,
    `${brief.fieldLabel}의 톤앤매너 레퍼런스를 더 공유해주실 수 있나요?`,
    `최종 산출물의 활용 채널이 구체적으로 어디인가요?`,
  ];
  const [selected, setSelected] = React.useState([0]);
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>질의응답</h2>
      <p style={{ fontSize: 14, color: 'var(--ink-600)', margin: '0 0 22px' }}>브리프에서 모호한 부분을 클라이언트에게 질문해보세요.</p>
      <div style={{ marginBottom: 14, fontSize: 12.5, fontWeight: 600, color: 'var(--ink-700)' }}>추천 질문</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {suggested.map((q, i) => {
          const sel = selected.includes(i);
          return (
            <button key={i} type="button" onClick={() => setSelected(sel ? selected.filter((x) => x !== i) : [...selected, i])} style={{ textAlign: 'left', background: sel ? 'var(--indigo-50)' : 'var(--white)', border: sel ? '1.5px solid var(--indigo-600)' : '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '12px 14px', fontSize: 13.5, color: 'var(--ink-900)', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, marginTop: 1, flexShrink: 0, border: sel ? 'none' : '1.5px solid var(--ink-300)', background: sel ? 'var(--indigo-600)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {sel && <Icon.Check style={{ width: 12, height: 12, color: '#fff' }} />}
              </div>
              {q}
            </button>
          );
        })}
      </div>
      <textarea placeholder="직접 질문을 작성하세요 (선택)" style={{ width: '100%', minHeight: 80, padding: '12px 14px', border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', marginBottom: 18 }} />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onNext} style={pBtn}>질문 보내기 <Icon.Wand style={{ width: 14, height: 14 }} /></button>
      </div>
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
}: {
  brief: BriefData;
  onBack: () => void;
  onFinish: () => void;
  /** DB current_step を mapDbStepToComponentIdx() で変換した値を渡す */
  initialStepIdx?: number;
  /** true のとき: 自前ヘッダー非表示・minHeight を auto に変更 */
  embedded?: boolean;
}) => {
  const [stepIdx, setStepIdx] = React.useState(initialStepIdx);
  const next = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));

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
          {stepIdx === 1 && <StepQna brief={brief} onNext={next} />}
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
