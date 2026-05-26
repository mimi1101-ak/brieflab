'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import * as Icon from '@/components/ui/Icon';
import {
  Section, Field, HelperHint, OptionCardGrid, SegmentedRow,
  DifficultyGrid, PillRow, StyleTagGrid, TextInput, styleThumbs,
} from '@/components/brief/FieldComponents';
import { Sidebar } from '@/components/brief/Sidebar';
import { buildBrief } from '@/components/brief/briefData';
import { BriefForm, Lookup } from '@/components/brief/types';
import { useBriefStore } from '@/stores/briefStore';
import { buildEmailBody } from '@/lib/buildEmailBody';
import { insertDraftProject } from '@/lib/supabase/projects';

const FIELD_OPTIONS = [
  { id: 'detail', label: '상세페이지 제작', sub: '쇼핑몰·상품 페이지', icon: Icon.Detail },
  { id: 'web',    label: '웹사이트 제작',   sub: '랜딩·기업 사이트',   icon: Icon.Web },
  { id: 'brand',  label: '브랜딩',          sub: '로고·아이덴티티',    icon: Icon.Brand },
  { id: 'app',    label: '앱 제작',          sub: '모바일 앱 UI',       icon: Icon.App },
];
const DIFFICULTY_OPTIONS = [
  { id: 'beginner', label: '입문', sub: '명확한 요구사항, 수정 1~2회, 단순 산출물' },
  { id: 'easy',     label: '초급', sub: '일부 모호한 요구사항, 수정 2~3회' },
  { id: 'medium',   label: '중급', sub: '복합 요구사항, 중간 방향 전환 포함' },
  { id: 'hard',     label: '고급', sub: '까다로운 클라이언트, 잦은 변경' },
];
const DURATION_OPTIONS = [
  { id: 'w1', label: '1주 이내' },
  { id: 'w2', label: '2주' },
  { id: 'm1', label: '1개월' },
  { id: 'm2', label: '2개월 이상' },
];
const CLIENT_OPTIONS = [
  { id: 'startup',   label: '스타트업' },
  { id: 'smb',       label: '소상공인' },
  { id: 'solo',      label: '개인사업자' },
  { id: 'midsize',   label: '중소기업' },
  { id: 'corporate', label: '대기업' },
  { id: 'public',    label: '공공기관' },
];
const BUDGET_OPTIONS = [
  { id: 'b1', label: '30만원 이하' },
  { id: 'b2', label: '30~100만원' },
  { id: 'b3', label: '100~300만원' },
  { id: 'b4', label: '300만원 이상' },
];
const STYLE_OPTIONS = [
  { id: 'minimal', label: '미니멀', thumbBg: styleThumbs.minimal.bg, thumb: styleThumbs.minimal.el },
  { id: 'trendy',  label: '트렌디', thumbBg: styleThumbs.trendy.bg,  thumb: styleThumbs.trendy.el },
  { id: 'classic', label: '클래식', thumbBg: styleThumbs.classic.bg, thumb: styleThumbs.classic.el },
  { id: 'bold',    label: '볼드',   thumbBg: styleThumbs.bold.bg,    thumb: styleThumbs.bold.el },
];

const LOOKUP: Lookup = {
  field:      Object.fromEntries(FIELD_OPTIONS.map((o) => [o.id, o.label])),
  difficulty: Object.fromEntries(DIFFICULTY_OPTIONS.map((o) => [o.id, o.label])),
  duration:   Object.fromEntries(DURATION_OPTIONS.map((o) => [o.id, o.label])),
  client:     Object.fromEntries(CLIENT_OPTIONS.map((o) => [o.id, o.label])),
  budget:     Object.fromEntries(BUDGET_OPTIONS.map((o) => [o.id, o.label])),
  styles:     Object.fromEntries(STYLE_OPTIONS.map((o) => [o.id, o.label])),
};

const StepDot = ({ num, label, done, active }: { num?: number; label: string; done?: boolean; active?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: active ? 'var(--indigo-700)' : 'var(--ink-500)', fontWeight: active ? 600 : 400 }}>
    <div style={{ width: 22, height: 22, borderRadius: 999, background: done ? 'var(--success)' : active ? 'var(--indigo-600)' : 'var(--ink-100)', color: done || active ? '#fff' : 'var(--ink-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
      {done ? <Icon.Check style={{ width: 11, height: 11 }} /> : num}
    </div>
    {label}
  </div>
);
const Dash = () => <div style={{ width: 24, height: 1, background: 'var(--ink-300)' }} />;

interface BriefNewClientProps {
  preferredField?: string | null;
}

export default function BriefNewClient({ preferredField }: BriefNewClientProps) {
  const router = useRouter();
  const setPreviewData = useBriefStore((s) => s.setPreviewData);

  const [form, setForm] = React.useState<BriefForm>({
    field:      preferredField ?? null,
    difficulty: null,
    duration:   null,
    client:     null,
    budget:     null,
    styles:     [],
    refUrl:     '',
    avoid:      '',
  });
  const [generating, setGenerating] = React.useState(false);
  const [genError, setGenError] = React.useState<string | null>(null);

  const update = <K extends keyof BriefForm>(key: K, value: BriefForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const requiredFilled = (form.field ? 1 : 0) + (form.difficulty ? 1 : 0) + (form.duration ? 1 : 0);
  const requiredCount  = 3;
  const canSubmit      = requiredFilled === requiredCount;
  const optionalCount  = (form.client ? 1 : 0) + (form.budget ? 1 : 0) + (form.styles.length > 0 ? 1 : 0) + (form.refUrl ? 1 : 0);
  const completion     = Math.round(((requiredFilled + optionalCount) / (requiredCount + 4)) * 100);

  const fieldLabels = {
    field:      form.field      ? LOOKUP.field[form.field]           : null,
    difficulty: form.difficulty ? LOOKUP.difficulty[form.difficulty] : null,
    duration:   form.duration   ? LOOKUP.duration[form.duration]     : null,
    client:     form.client     ? LOOKUP.client[form.client]         : null,
    budget:     form.budget     ? LOOKUP.budget[form.budget]         : null,
    styles:     form.styles.map((id) => LOOKUP.styles[id]).join(', ') || null,
  };

  const handleSubmit = async () => {
    if (!canSubmit || generating) return;
    setGenerating(true);
    setGenError(null);
    // 1초 지연 → AI 생성 체감
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const brief     = buildBrief(form, LOOKUP);
      const emailBody = buildEmailBody(brief);
      const projectId = await insertDraftProject(form, brief, emailBody);
      setPreviewData(form, brief, emailBody, projectId);
      router.push(`/brief/preview?id=${projectId}`);
    } catch (err) {
      console.error('[BriefLab] 브리프 저장 실패:', err);
      setGenError('브리프 저장에 실패했어요. 다시 시도해주세요.');
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-indigo)' }}>
            <Icon.Spark2 style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>BriefLab</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>AI 브리프 연습 플랫폼</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <StepDot num={1} label="설정" active />
          <Dash />
          <StepDot num={2} label="브리프 확인" />
          <Dash />
          <StepDot num={3} label="프로세스 시작" />
        </div>
        <div style={{ width: 80 }} />
      </header>

      <main style={{ flex: 1, maxWidth: 1240, width: '100%', margin: '0 auto', padding: '32px 36px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--indigo-700)', background: 'var(--indigo-50)', padding: '4px 10px', borderRadius: 999, marginBottom: 12 }}>
              <Icon.Spark2 style={{ width: 12, height: 12 }} /> STEP 1 / 3
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>어떤 브리프를 연습해볼까요?</h1>
            <p style={{ fontSize: 14.5, color: 'var(--ink-600)', margin: '8px 0 0', lineHeight: 1.6 }}>조건을 선택하면 AI가 현실적인 가상 클라이언트 브리프를 만들어드려요.<br />필수 항목 3가지만 선택하면 시작할 수 있어요.</p>
          </div>

          <Section number="1" title="필수 선택 항목" subtitle="브리프 생성에 꼭 필요한 정보예요. 3가지 모두 선택해주세요.">
            <Field label="요청 분야" required helper={<HelperHint>어떤 작업을 연습하고 싶으신가요? 분야에 따라 산출물 형식과 디자인 방향이 달라져요.</HelperHint>}>
              <OptionCardGrid options={FIELD_OPTIONS} value={form.field} onChange={(v) => update('field', v)} />
            </Field>
            <Field label="난이도" required helper={<HelperHint>처음이라면 <b>입문</b>부터 시작해보세요. 단계가 올라갈수록 클라이언트가 까다로워져요.</HelperHint>}>
              <DifficultyGrid options={DIFFICULTY_OPTIONS} value={form.difficulty} onChange={(v) => update('difficulty', v)} />
            </Field>
            <Field label="제작 기간" required helper={<HelperHint>실제 외주에서는 납기가 작업 범위와 가격에 직접 영향을 줍니다.</HelperHint>}>
              <SegmentedRow options={DURATION_OPTIONS} value={form.duration} onChange={(v) => update('duration', v)} />
            </Field>
          </Section>

          <Section number="2" title="추가 선택 항목" subtitle="더 구체적인 브리프를 원한다면 선택해주세요. 비워두면 AI가 자동으로 매칭해드려요."
            footer={<div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', background: 'var(--ink-100)', padding: '4px 10px', borderRadius: 999 }}>선택사항</div>}
          >
            <Field label="클라이언트 유형" optionalText="선택" helper={<HelperHint>유형마다 말투와 요구 스타일이 달라져 실무 체감도가 올라가요.</HelperHint>}>
              <PillRow options={CLIENT_OPTIONS} value={form.client} onChange={(v) => update('client', v)} />
            </Field>
            <Field label="예산 범위" optionalText="선택">
              <SegmentedRow options={BUDGET_OPTIONS} value={form.budget} onChange={(v) => update('budget', v)} />
            </Field>
            <Field label="선호 스타일" optionalText="복수 선택" helper={<HelperHint>스타일 태그는 여러 개 선택할 수 있어요. AI가 조합해서 반영합니다.</HelperHint>}>
              <StyleTagGrid options={STYLE_OPTIONS} value={form.styles} onChange={(v) => update('styles', v)} />
            </Field>
            <Field label="참고 브랜드 / 사이트" optionalText="선택">
              <TextInput value={form.refUrl} onChange={(v) => update('refUrl', v)} placeholder="예: https://..." leftIcon={Icon.Link} />
            </Field>
            <Field label="피해야 할 스타일" optionalText="선택" helper={<HelperHint>예: &quot;유치한 디자인&quot;, &quot;지나치게 화려한 그래픽&quot; 등</HelperHint>}>
              <textarea
                value={form.avoid}
                onChange={(e) => update('avoid', e.target.value)}
                placeholder="피해야 할 스타일을 자유롭게 적어주세요"
                style={{ width: '100%', minHeight: 72, padding: '12px 14px', border: '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', outline: 'none', fontSize: 14, resize: 'vertical', background: 'var(--white)', color: 'var(--ink-900)', fontFamily: 'inherit' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--indigo-600)'; e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,0.10)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--ink-200)'; e.target.style.boxShadow = 'none'; }}
              />
            </Field>
          </Section>
          <div style={{ height: 8 }} />
        </div>

        <Sidebar form={form} fieldLabels={fieldLabels} completion={completion} requiredCount={requiredCount} requiredFilled={requiredFilled} />
      </main>

      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(180%) blur(8px)', borderTop: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: genError ? 'var(--danger)' : canSubmit ? 'var(--ink-700)' : 'var(--ink-500)' }}>
          {genError ? (
            <><Icon.Info style={{ width: 16, height: 16 }} />{genError}</>
          ) : canSubmit ? (
            <><div style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--success)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Check style={{ width: 11, height: 11 }} /></div>모든 필수 항목이 선택되었습니다</>
          ) : (
            <><Icon.Info style={{ width: 16, height: 16, color: 'var(--ink-400)' }} />필수 항목 <b style={{ color: 'var(--ink-900)' }}>{requiredFilled}/{requiredCount}</b> 선택됨 — 나머지를 채워주세요</>
          )}
        </div>
        <button
          type="button"
          disabled={!canSubmit || generating}
          onClick={handleSubmit}
          style={{ background: canSubmit ? 'var(--indigo-600)' : 'var(--ink-200)', border: 'none', color: canSubmit ? 'var(--white)' : 'var(--ink-400)', fontSize: 14.5, fontWeight: 700, padding: '12px 22px', borderRadius: 'var(--radius)', display: 'inline-flex', alignItems: 'center', gap: 8, cursor: canSubmit && !generating ? 'pointer' : 'not-allowed', boxShadow: canSubmit ? 'var(--shadow-indigo)' : 'none', transition: 'all 140ms ease', letterSpacing: '-0.01em' }}
        >
          {generating ? (
            <><div style={{ width: 14, height: 14, borderRadius: 999, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'var(--white)', animation: 'spin 0.7s linear infinite' }} />브리프 생성 중…</>
          ) : (
            <><Icon.Wand style={{ width: 16, height: 16 }} />브리프 생성하기</>
          )}
        </button>
      </div>
    </div>
  );
}
