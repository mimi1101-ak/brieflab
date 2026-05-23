import { BriefForm, BriefData, Lookup } from './types';

const PERSONAS: Record<string, { company: string; name: string; title: string; email: string; phone: string }> = {
  startup:   { company: '(주)블룸닷', name: '이서연', title: '프로덕트 마케팅 매니저', email: 'seoyeon.lee@bloom.dot', phone: '02-558-3211' },
  smb:       { company: '카페 모도리', name: '박상훈', title: '대표', email: 'modori.cafe@gmail.com', phone: '010-4421-9082' },
  solo:      { company: '디자인 스튜디오 A', name: '정예진', title: '대표', email: 'yejin@studio-a.kr', phone: '010-3311-7723' },
  midsize:   { company: '(주)그린라이프', name: '김민준', title: '브랜드 마케팅 팀장', email: 'minjun.kim@greenlife.co.kr', phone: '02-1234-5678' },
  corporate: { company: '한솔이엔지㈜', name: '정유진', title: '디지털전략실 차장', email: 'yj.jung@hansol-eng.com', phone: '02-3019-7700' },
  public:    { company: '서울문화재단', name: '최도윤', title: '홍보팀 주임', email: 'doyun.choi@sfac.or.kr', phone: '02-3290-7000' },
  default:   { company: '(주)그린라이프', name: '김민준', title: '브랜드 마케팅 팀장', email: 'minjun.kim@greenlife.co.kr', phone: '02-1234-5678' },
};

export const buildBrief = (form: BriefForm, lookup: Lookup): BriefData => {
  const persona = PERSONAS[form.client || ''] || PERSONAS.default;

  const projectByField: Record<string, { name: string; purpose: string }> = {
    detail: { name: '신제품 상세페이지 제작', purpose: '자사몰 및 입점 채널(네이버 스마트스토어, 쿠팡)에서 사용할 신제품 상세페이지를 새로 제작하고자 합니다.' },
    web:    { name: '브랜드 웹사이트 리뉴얼', purpose: '기존 웹사이트가 모바일 대응이 미흡하고 정보 구조가 노후화되어 전반적인 리뉴얼이 필요합니다.' },
    brand:  { name: '브랜드 아이덴티티 리뉴얼', purpose: '창립 5주년을 맞아 브랜드 아이덴티티를 정비하고, 일관된 비주얼 시스템을 갖추고자 합니다.' },
    app:    { name: '모바일 앱 UI 디자인', purpose: '신규 출시 예정인 모바일 앱의 핵심 화면 UI를 디자인하여 베타 테스트를 준비하고자 합니다.' },
  };
  const project = projectByField[form.field || ''] || projectByField.web;

  const durationToDates: Record<string, { kickoff: string; mid: string; final: string }> = {
    w1: { kickoff: '2026-05-12', mid: '2026-05-15', final: '2026-05-19' },
    w2: { kickoff: '2026-05-12', mid: '2026-05-19', final: '2026-05-26' },
    m1: { kickoff: '2026-05-12', mid: '2026-05-26', final: '2026-06-12' },
    m2: { kickoff: '2026-05-12', mid: '2026-06-09', final: '2026-07-12' },
  };
  const dates = durationToDates[form.duration || ''] || durationToDates.w2;

  const targetByClient: Record<string, { age: string; gender: string; lifestyle: string }> = {
    startup:   { age: '20대 후반 ~ 30대 초반', gender: '여성 60% / 남성 40%', lifestyle: '트렌드에 민감하고 SNS를 적극 활용하는 직장인' },
    smb:       { age: '30대 ~ 40대', gender: '여성 70% / 남성 30%', lifestyle: '품질을 중시하고 단골 관계를 선호하는 동네 거주자' },
    midsize:   { age: '30대 ~ 50대', gender: '여성 55% / 남성 45%', lifestyle: '가족 중심의 라이프스타일을 추구하는 중산층' },
    corporate: { age: '30대 ~ 50대', gender: '균등', lifestyle: '신뢰와 전문성을 중시하는 의사결정자' },
    public:    { age: '전 연령', gender: '균등', lifestyle: '공공 서비스 이용 시민' },
    default:   { age: '20대 후반 ~ 30대', gender: '여성 60%', lifestyle: '실용성과 디자인을 함께 고려하는 직장인' },
  };
  const target = targetByClient[form.client || ''] || targetByClient.default;

  const emotionByStyle: Record<string, string> = {
    minimal: '깔끔하다, 정돈되어 있다, 신뢰감 있다',
    trendy:  '트렌디하다, 감각적이다, 친근하다',
    classic: '고급스럽다, 차분하다, 전통이 느껴진다',
    bold:    '강렬하다, 자신감 있다, 인상적이다',
  };
  const emotion = form.styles.length > 0
    ? form.styles.map((s) => emotionByStyle[s]).filter(Boolean).join(' / ')
    : '신뢰감 있다, 친근하다';

  const deliverableByField: Record<string, string> = {
    detail: 'PSD, JPG, PNG (모바일 / PC 대응)',
    web:    'Figma, 반응형 HTML/CSS 가이드',
    brand:  'AI, PDF (로고 + 가이드라인 + 응용물)',
    app:    'Figma (iOS / Android 핵심 화면 12종)',
  };

  const styleLabels = form.styles.map((s) => lookup.styles[s]).filter(Boolean).join(', ') || '제한 없음';

  return {
    persona, project, dates, target, emotion,
    deliverable: deliverableByField[form.field || ''] || 'Figma',
    budget: lookup.budget[form.budget || ''] || '협의',
    difficulty: lookup.difficulty[form.difficulty || ''] || '',
    fieldLabel: lookup.field[form.field || ''] || '',
    durationLabel: lookup.duration[form.duration || ''] || '',
    styleLabels,
    refUrl: form.refUrl || '없음',
    avoid: form.avoid || '특별한 제한 없음',
  };
};
