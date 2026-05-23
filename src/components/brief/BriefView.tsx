'use client';
import React from 'react';
import * as Icon from '@/components/ui/Icon';
import { BriefData, BriefForm } from './types';
import { AiPaletteSection } from './AiPaletteSection';

const BSection = ({ icon: I, title, children }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 28 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--indigo-50)', color: 'var(--indigo-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I style={{ width: 15, height: 15 }} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--ink-900)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{title}</h3>
    </div>
    <div style={{ paddingLeft: 38 }}>{children}</div>
  </section>
);

const BRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--ink-100)', fontSize: 14 }}>
    <div style={{ color: 'var(--ink-500)', fontWeight: 500 }}>{label}</div>
    <div style={{ color: 'var(--ink-900)', lineHeight: 1.55 }}>{value}</div>
  </div>
);

export const BriefView = ({ brief, form, onBack, onStartProcess }: { brief: BriefData; form: BriefForm; onBack: () => void; onStartProcess: () => void }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--ink-50)' }}>
    <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
      <button type="button" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-700)', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
        <Icon.ChevronLeft style={{ width: 16, height: 16 }} /> 설정으로 돌아가기
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, whiteSpace: 'nowrap' }}>
        <StepDot done label="설정 완료" />
        <Dash />
        <StepDot active num={2} label="브리프 확인" />
        <Dash />
        <StepDot num={3} label="프로세스 시작" />
      </div>
      <button type="button" style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', color: 'var(--ink-700)', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>다시 생성</button>
    </header>

    <main style={{ flex: 1, maxWidth: 980, width: '100%', margin: '0 auto', padding: '32px 36px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg,var(--indigo-50) 0%,#F5F3FF 100%)', border: '1px solid var(--indigo-100)', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 22 }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--indigo-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-indigo)' }}>
          <Icon.Sparkle style={{ width: 16, height: 16 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--indigo-900)' }}>AI가 브리프를 생성했어요</div>
          <div style={{ fontSize: 12.5, color: 'var(--indigo-800)', marginTop: 2 }}>실제 외주처럼 천천히 읽어보고, 궁금한 점은 클라이언트에게 질의응답으로 확인하세요.</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--indigo-700)', background: 'var(--white)', border: '1px solid var(--indigo-100)', padding: '4px 10px', borderRadius: 999 }}>{brief.fieldLabel} · {brief.difficulty}</div>
      </div>

      <article style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '36px 40px 32px' }}>
        <div style={{ paddingBottom: 22, borderBottom: '2px solid var(--ink-900)', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 8 }}>CLIENT BRIEF</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.025em', color: 'var(--ink-900)', lineHeight: 1.3 }}>{brief.project.name}</h1>
          <div style={{ fontSize: 13.5, color: 'var(--ink-600)', marginTop: 8 }}>발신: {brief.persona.company} · {brief.persona.name} {brief.persona.title} &nbsp;|&nbsp; 발행일 2026-05-05</div>
        </div>

        <BSection icon={Icon.Building} title="담당자 정보">
          <BRow label="이름 / 직책" value={`${brief.persona.name} / ${brief.persona.title}`} />
          <BRow label="기관·기업명" value={brief.persona.company} />
          <BRow label="이메일" value={brief.persona.email} />
          <BRow label="전화번호" value={brief.persona.phone} />
        </BSection>

        <BSection icon={Icon.Doc} title="프로젝트 주요 내용">
          <BRow label="프로젝트명" value={brief.project.name} />
          <BRow label="배경" value={brief.project.purpose} />
          <BRow label="요구 내용" value={`${brief.fieldLabel} 작업물이 필요합니다. 톤앤매너는 ${brief.styleLabels} 방향이며, 타겟에게 ${brief.emotion}는 인상을 전달하고자 합니다.`} />
          <BRow label="프로젝트 성격" value="신규 제작" />
        </BSection>

        <BSection icon={Icon.Tag} title="타겟 정보">
          <BRow label="연령대" value={brief.target.age} />
          <BRow label="성별" value={brief.target.gender} />
          <BRow label="라이프스타일" value={brief.target.lifestyle} />
          <BRow label="감정 톤" value={brief.emotion} />
        </BSection>

        <BSection icon={Icon.Palette} title="레퍼런스 및 방향성">
          <BRow label="선호 스타일" value={brief.styleLabels} />
          <BRow label="피해야 할 스타일" value={brief.avoid} />
          <BRow label="참고 사이트" value={brief.refUrl} />
        </BSection>

        <BSection icon={Icon.Doc} title="산출물 범위">
          <BRow label="납품 형식" value={brief.deliverable} />
          <BRow label="반응형" value={form.field === 'web' || form.field === 'detail' ? '모바일 대응 필수' : '해당 없음'} />
        </BSection>

        <BSection icon={Icon.Calendar} title="일정 및 커뮤니케이션">
          <BRow label="킥오프 미팅" value={brief.dates.kickoff} />
          <BRow label="중간 시안" value={brief.dates.mid} />
          <BRow label="최종 납기" value={brief.dates.final} />
          <BRow label="제작 기간" value={brief.durationLabel} />
          <BRow label="소통 방식" value="이메일 (회신은 24시간 이내)" />
        </BSection>

        <BSection icon={Icon.Money} title="기타 정보">
          <BRow label="예산 범위" value={brief.budget} />
          <BRow label="난이도(연습)" value={brief.difficulty} />
          <BRow label="기타 요청" value="시안은 2~3안 제안 부탁드리며, 최종 선정 후 1~2회 수정을 거쳐 마감하고자 합니다." />
        </BSection>

        <AiPaletteSection field={form.field} />
      </article>
      <div style={{ height: 100 }} />
    </main>

    <div style={{ position: 'sticky', bottom: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(180%) blur(8px)', borderTop: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, color: 'var(--ink-600)' }}>브리프를 충분히 읽으셨나요? 다음 단계에서 클라이언트에게 질의응답을 보낼 수 있어요.</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={onBack} style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', color: 'var(--ink-700)', fontSize: 14, fontWeight: 600, padding: '12px 18px', borderRadius: 'var(--radius)', cursor: 'pointer' }}>설정 수정</button>
        <button type="button" onClick={onStartProcess} style={{ background: 'var(--indigo-600)', border: 'none', color: '#fff', fontSize: 14.5, fontWeight: 700, padding: '12px 22px', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-indigo)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
          <Icon.Sparkle style={{ width: 16, height: 16 }} /> 프로세스 시작하기
        </button>
      </div>
    </div>
  </div>
);

const StepDot = ({ num, label, done, active }: { num?: number; label: string; done?: boolean; active?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: active ? 'var(--indigo-700)' : 'var(--ink-500)', fontWeight: active ? 600 : 400 }}>
    <div style={{ width: 22, height: 22, borderRadius: 999, background: done ? 'var(--success)' : active ? 'var(--indigo-600)' : 'var(--ink-100)', color: done || active ? '#fff' : 'var(--ink-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
      {done ? <Icon.Check style={{ width: 11, height: 11 }} /> : num}
    </div>
    {label}
  </div>
);
const Dash = () => <div style={{ width: 24, height: 1, background: 'var(--ink-300)' }} />;
