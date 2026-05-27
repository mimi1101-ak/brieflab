import { BriefForm, BriefData, Lookup, Persona } from './types';

const PERSONA_POOL: Record<string, Persona[]> = {
  startup: [
    { company: '(주)블룸닷', name: '이서연', title: '프로덕트 마케팅 매니저', email: 'seoyeon.lee@bloom.dot', phone: '02-558-3211' },
    { company: '스케일업랩(주)', name: '한지수', title: '마케팅 리드', email: 'jisoo.han@scaleuplab.io', phone: '070-4411-8823' },
    { company: '모아이프(주)', name: '오현우', title: 'Growth 팀장', email: 'hyunwoo@moaif.co', phone: '02-334-5512' },
    { company: '(주)패스트브이', name: '신예솔', title: '브랜드 마케터', email: 'yesol@fastv.kr', phone: '070-7700-2291' },
  ],
  smb: [
    { company: '카페 모도리', name: '박상훈', title: '대표', email: 'modori.cafe@gmail.com', phone: '010-4421-9082' },
    { company: '손뜨개공방 솜', name: '임수현', title: '공방 대표', email: 'som.knit@naver.com', phone: '010-8823-3341' },
    { company: '홈베이킹 오늘', name: '김지원', title: '대표', email: 'today.baking@gmail.com', phone: '010-3344-8821' },
    { company: '포토스튜디오 빛', name: '유성민', title: '대표', email: 'bit.studio@daum.net', phone: '010-5532-9910' },
  ],
  solo: [
    { company: '디자인 스튜디오 A', name: '정예진', title: '대표', email: 'yejin@studio-a.kr', phone: '010-3311-7723' },
    { company: '크리에이티브 로한', name: '노민혁', title: '1인 사업자', email: 'rohan.design@gmail.com', phone: '010-6621-4490' },
    { company: '프리랜서 강세영', name: '강세영', title: '개인사업자', email: 'seyoung.kang@kakao.com', phone: '010-9920-2234' },
    { company: '마케팅 박기현', name: '박기현', title: '프리랜서 마케터', email: 'kihyun.mk@gmail.com', phone: '010-7723-0011' },
  ],
  midsize: [
    { company: '(주)그린라이프', name: '김민준', title: '브랜드 마케팅 팀장', email: 'minjun.kim@greenlife.co.kr', phone: '02-1234-5678' },
    { company: '(주)유니크로드', name: '배소연', title: '마케팅팀 과장', email: 'soyeon.bae@uniqueroad.com', phone: '02-7890-1234' },
    { company: '한울식품(주)', name: '정재원', title: '브랜딩팀장', email: 'jwjung@hanul-food.co.kr', phone: '02-3340-5523' },
    { company: '(주)테크프리미엄', name: '이하늘', title: '기획팀 차장', email: 'haneul.lee@techpremium.com', phone: '031-5500-3311' },
  ],
  corporate: [
    { company: '한솔이엔지㈜', name: '정유진', title: '디지털전략실 차장', email: 'yj.jung@hansol-eng.com', phone: '02-3019-7700' },
    { company: 'SK네트웍스(주)', name: '이동현', title: '브랜드커뮤니케이션팀 팀장', email: 'donghyun.lee@sknetworks.co.kr', phone: '02-2000-3300' },
    { company: '롯데글로벌로지스㈜', name: '박혜원', title: '디지털마케팅실 수석', email: 'hyewon.park@lottegls.com', phone: '02-1400-5000' },
    { company: 'KT&G(주)', name: '최준혁', title: '브랜드전략팀 부장', email: 'junhyuk.choi@ktng.com', phone: '02-3404-6000' },
  ],
  public: [
    { company: '서울문화재단', name: '최도윤', title: '홍보팀 주임', email: 'doyun.choi@sfac.or.kr', phone: '02-3290-7000' },
    { company: '한국디자인진흥원', name: '강민정', title: '산업지원팀 대리', email: 'minjung.kang@kidp.or.kr', phone: '031-780-2114' },
    { company: '서울관광재단', name: '임재영', title: '홍보마케팅팀 주임', email: 'jaeyoung.lim@sto.or.kr', phone: '02-3788-0800' },
    { company: '경기콘텐츠진흥원', name: '오지혜', title: '기획운영팀 대리', email: 'jihye.oh@gcf.or.kr', phone: '031-259-7100' },
  ],
};
PERSONA_POOL.default = PERSONA_POOL.midsize;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const buildBrief = (form: BriefForm, lookup: Lookup): BriefData => {
  const personaPool = PERSONA_POOL[form.client || ''] ?? PERSONA_POOL.default;
  const persona = pick(personaPool);

  const projectVariants: Record<string, { name: string; purpose: string }[]> = {
    detail: [
      { name: '신제품 상세페이지 제작', purpose: '자사몰 및 입점 채널(네이버 스마트스토어, 쿠팡)에서 사용할 신제품 상세페이지를 새로 제작하고자 합니다.' },
      { name: '베스트셀러 리뉴얼 상세페이지', purpose: '기존 베스트셀러 상품의 상세페이지가 노후화되어 전환율 개선을 위한 리뉴얼이 필요합니다.' },
      { name: '시즌 기획전 상세페이지', purpose: '하반기 시즌 기획전에 맞춰 한정 프로모션 전용 상세페이지를 제작하고자 합니다.' },
      { name: '브랜드관 입점 상세페이지', purpose: '대형 플랫폼 브랜드관 입점을 앞두고 브랜드 아이덴티티가 반영된 상세페이지 템플릿이 필요합니다.' },
    ],
    web: [
      { name: '브랜드 웹사이트 리뉴얼', purpose: '기존 웹사이트가 모바일 대응이 미흡하고 정보 구조가 노후화되어 전반적인 리뉴얼이 필요합니다.' },
      { name: '신규 랜딩페이지 제작', purpose: '신제품 론칭에 맞춰 전환율에 최적화된 랜딩페이지를 새로 제작하고자 합니다.' },
      { name: '서비스 소개 홈페이지 구축', purpose: 'B2B 고객 대상으로 서비스 신뢰도를 높일 수 있는 전문적인 홈페이지를 처음부터 구축하고자 합니다.' },
      { name: '이벤트 마이크로사이트', purpose: '창립 기념 이벤트 프로모션을 위한 단기 운영용 마이크로사이트를 제작하려 합니다.' },
    ],
    brand: [
      { name: '브랜드 아이덴티티 리뉴얼', purpose: '창립 5주년을 맞아 브랜드 아이덴티티를 정비하고, 일관된 비주얼 시스템을 갖추고자 합니다.' },
      { name: '서브 브랜드 아이덴티티 구축', purpose: '신규 서브 브랜드 론칭을 위한 로고·컬러 시스템·가이드라인 전반을 구축하고자 합니다.' },
      { name: '리브랜딩 패키지 디자인', purpose: '고객 인식 개선을 위해 로고부터 패키지까지 전반적인 리브랜딩 작업이 필요합니다.' },
      { name: '브랜드 스타일 가이드 제작', purpose: '일관된 마케팅 커뮤니케이션을 위해 컬러·타이포그래피·사용 규정을 담은 스타일 가이드가 필요합니다.' },
    ],
    app: [
      { name: '모바일 앱 UI 디자인', purpose: '신규 출시 예정인 모바일 앱의 핵심 화면 UI를 디자인하여 베타 테스트를 준비하고자 합니다.' },
      { name: '앱 온보딩 플로우 재설계', purpose: '기존 앱의 온보딩 이탈률이 높아 사용자 경험 중심으로 전체 플로우를 재설계하려고 합니다.' },
      { name: '마이페이지 / 설정 화면 개편', purpose: '사용성 불만 피드백이 집중된 마이페이지와 설정 영역을 중심으로 UI를 전면 개편합니다.' },
      { name: '다크모드 UI 디자인 시스템 구축', purpose: '다크모드 지원 요청이 많아 라이트·다크 양쪽에 대응하는 디자인 시스템을 새로 구축하려 합니다.' },
    ],
  };
  const variants = projectVariants[form.field || ''] ?? projectVariants.web;
  const project = pick(variants);

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
    smb:       { age: '30대 ~ 40대', gender: '여성 70% / 남성 30%', lifestyle: '품질을 중시하고 단골 관계를 선호하는 동네 거주자' },
    midsize:   { age: '30대 ~ 50대', gender: '여성 55% / 남성 45%', lifestyle: '가족 중심의 라이프스타일을 추구하는 중산층' },
    corporate: { age: '30대 ~ 50대', gender: '균등', lifestyle: '신뢰와 전문성을 중시하는 의사결정자' },
    public:    { age: '전 연령', gender: '균등', lifestyle: '공공 서비스 이용 시민' },
    default:   { age: '20대 후반 ~ 30대', gender: '여성 60%', lifestyle: '실용성과 디자인을 함께 고려하는 직장인' },
  };
  const target = targetByClient[form.client || ''] ?? targetByClient.default;

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
