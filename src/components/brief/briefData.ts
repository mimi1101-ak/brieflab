import { BriefForm, BriefData, Lookup } from './types';
import { pickRandomPersona, type ClientType } from './personaPool';
import { pickRandomProject, type DesignField } from './projectPool';

const VALID_CLIENT_TYPES = new Set<ClientType>(['startup', 'smb', 'solo', 'midsize', 'corporate', 'public']);
const VALID_FIELDS       = new Set<DesignField>(['detail', 'web', 'brand', 'app']);

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const buildBrief = (form: BriefForm, lookup: Lookup): BriefData => {
  const clientType: ClientType = VALID_CLIENT_TYPES.has(form.client as ClientType)
    ? (form.client as ClientType)
    : 'midsize';
  const field: DesignField = VALID_FIELDS.has(form.field as DesignField)
    ? (form.field as DesignField)
    : 'web';

  const persona         = pickRandomPersona(clientType);
  const projectTemplate = pickRandomProject(field, clientType);
  const project         = { name: projectTemplate.name, purpose: projectTemplate.purpose };

  const today = new Date();
  const durationToDates: Record<string, { kickoff: string; mid: string; final: string }> = {
    w1: { kickoff: addDays(today, 1), mid: addDays(today, 4),  final: addDays(today, 8) },
    w2: { kickoff: addDays(today, 1), mid: addDays(today, 8),  final: addDays(today, 15) },
    m1: { kickoff: addDays(today, 2), mid: addDays(today, 16), final: addDays(today, 32) },
    m2: { kickoff: addDays(today, 2), mid: addDays(today, 30), final: addDays(today, 62) },
  };
  const dates = durationToDates[form.duration || ''] ?? durationToDates.w2;

  const targetByClient: Record<string, { age: string; gender: string; lifestyle: string }> = {
    startup:   { age: '20대 후반 ~ 30대 초반', gender: '여성 60% / 남성 40%', lifestyle: '트렌드에 민감하고 SNS를 적극 활용하는 직장인' },
    smb:       { age: '30대 ~ 40대',           gender: '여성 70% / 남성 30%', lifestyle: '품질을 중시하고 단골 관계를 선호하는 동네 거주자' },
    midsize:   { age: '30대 ~ 50대',           gender: '여성 55% / 남성 45%', lifestyle: '가족 중심의 라이프스타일을 추구하는 중산층' },
    corporate: { age: '30대 ~ 50대',           gender: '균등',                lifestyle: '신뢰와 전문성을 중시하는 의사결정자' },
    public:    { age: '전 연령',               gender: '균등',                lifestyle: '공공 서비스 이용 시민' },
    default:   { age: '20대 후반 ~ 30대',      gender: '여성 60%',            lifestyle: '실용성과 디자인을 함께 고려하는 직장인' },
  };
  const target = targetByClient[clientType] ?? targetByClient.default;

  const emotionByStyle: Record<string, string> = {
    minimal: '깔끔하다, 정돈되어 있다, 신뢰감 있다',
    trendy:  '트렌디하다, 감각적이다, 친근하다',
    classic: '고급스럽다, 차분하다, 전통이 느껴진다',
    bold:    '강렬하다, 자신감 있다, 인상적이다',
  };
  const emotion = form.styles.length > 0
    ? form.styles.map((s) => emotionByStyle[s]).filter(Boolean).join(' / ')
    : '신뢰감 있다, 친근하다';

  const deliverableByField: Record<DesignField, string> = {
    detail: 'PSD, JPG, PNG (모바일 / PC 대응)',
    web:    'Figma, 반응형 HTML/CSS 가이드',
    brand:  'AI, PDF (로고 + 가이드라인 + 응용물)',
    app:    'Figma (iOS / Android 핵심 화면 12종)',
  };

  const styleLabels = form.styles.map((s) => lookup.styles[s]).filter(Boolean).join(', ') || '제한 없음';

  return {
    persona,
    persona_id:          persona.id,
    project,
    project_template_id: projectTemplate.id,
    dates,
    target,
    emotion,
    deliverable:   deliverableByField[field],
    budget:        lookup.budget[form.budget || '']     || '협의',
    difficulty:    lookup.difficulty[form.difficulty || ''] || '',
    fieldLabel:    lookup.field[form.field || '']       || '',
    durationLabel: lookup.duration[form.duration || ''] || '',
    styleLabels,
    refUrl: form.refUrl || '없음',
    avoid:  form.avoid  || '특별한 제한 없음',
  };
};
