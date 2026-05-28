// src/components/brief/projectPool.ts
// BriefLab — 프로젝트 템플릿 풀 (40개)
// 분야 4종 × 10개, 각 프로젝트는 어울리는 클라이언트 유형 태그를 가짐

import type { ClientType } from './personaPool';

// ─── 타입 정의 ──────────────────────────────────────────────────────────
export type DesignField = 'detail' | 'web' | 'brand' | 'app';

export interface ProjectTemplate {
  id: string;
  field: DesignField;
  name: string;       // 프로젝트명
  purpose: string;    // 배경/목적
  suitable_clients: ClientType[];  // 어울리는 클라이언트 유형
}

// ─── 프로젝트 풀 (40개) ────────────────────────────────────────────────
export const PROJECT_POOL: ProjectTemplate[] = [
  // ──────────────────────────────────────────────────────────────────
  // 🛍 DETAIL (상세페이지, 10개)
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'detail_01',
    field: 'detail',
    name: '신제품 비건 스킨케어 라인 상세페이지',
    purpose: '신규 출시 비건 스킨케어 라인을 자사몰과 쿠팡·네이버 스마트스토어 입점 채널에 동시 노출하기 위한 상세페이지가 필요합니다.',
    suitable_clients: ['smb', 'startup', 'midsize'],
  },
  {
    id: 'detail_02',
    field: 'detail',
    name: '수제 그릭요거트 자사몰 상세페이지',
    purpose: '자체 생산하는 수제 그릭요거트의 온라인 판매를 시작하면서, 제품의 차별점을 잘 전달할 자사몰 상세페이지를 새로 제작하고자 합니다.',
    suitable_clients: ['smb', 'midsize'],
  },
  {
    id: 'detail_03',
    field: 'detail',
    name: '무선 청소기 신모델 런칭 상세페이지',
    purpose: '가전 신모델 출시에 맞춰 자사몰과 쿠팡 입점용 상세페이지를 제작합니다. 경쟁사 대비 차별화 포인트가 명확히 드러나야 합니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'detail_04',
    field: 'detail',
    name: '시니어 캐주얼 패션 브랜드 상세페이지',
    purpose: '50대 이상 타겟의 시니어 캐주얼 브랜드 분기별 신상 상세페이지가 필요합니다. 타겟 연령대를 고려한 가독성과 톤이 중요합니다.',
    suitable_clients: ['smb', 'midsize'],
  },
  {
    id: 'detail_05',
    field: 'detail',
    name: '프로바이오틱스 건강기능식품 상세페이지',
    purpose: '자사몰과 약국 채널 동시 출시 예정인 건강기능식품 상세페이지를 제작합니다. 식약처 표기 규정 준수가 필수입니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'detail_06',
    field: 'detail',
    name: '프리미엄 캠핑 텐트 신상품 상세페이지',
    purpose: '캠핑 시즌 진입 시점에 맞춰 출시되는 신제품 텐트의 상세페이지가 필요합니다. 제품 스펙과 사용 시나리오가 명확히 전달되어야 합니다.',
    suitable_clients: ['midsize'],
  },
  {
    id: 'detail_07',
    field: 'detail',
    name: '유아용 친환경 식기 세트 상세페이지',
    purpose: '이커머스와 맘카페 채널 노출을 목표로 한 유아용 친환경 식기 세트 상세페이지를 제작합니다. 부모님들의 신뢰를 얻을 수 있는 정보 구성이 중요합니다.',
    suitable_clients: ['smb', 'startup', 'midsize'],
  },
  {
    id: 'detail_08',
    field: 'detail',
    name: '반려견 수제 간식 상세페이지',
    purpose: '직접 제작한 강아지 수제 간식을 네이버 스마트스토어에서 판매하기 위한 상세페이지가 필요합니다. 소규모 1인 사업자라 합리적인 비용 안에서 진행했으면 합니다.',
    suitable_clients: ['smb', 'solo'],
  },
  {
    id: 'detail_09',
    field: 'detail',
    name: 'AI 영어 학습 구독 서비스 상세페이지',
    purpose: '월 구독형 AI 영어 학습 서비스의 가입 유도용 상세페이지를 제작합니다. 랜딩페이지와 상세페이지의 성격이 혼합된 형태입니다.',
    suitable_clients: ['startup'],
  },
  {
    id: 'detail_10',
    field: 'detail',
    name: '온라인 클래스 패키지 상세페이지',
    purpose: '강의 크리에이터의 신규 강의 패키지를 판매하기 위한 상세페이지가 필요합니다. 강사의 전문성과 강의 커리큘럼이 잘 드러나야 합니다.',
    suitable_clients: ['solo', 'startup'],
  },

  // ──────────────────────────────────────────────────────────────────
  // 🌐 WEB (웹사이트, 10개)
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'web_01',
    field: 'web',
    name: '브랜드 웹사이트 풀 리뉴얼',
    purpose: '기존 웹사이트가 모바일 대응이 미흡하고 정보 구조가 노후화되어 전반적인 리뉴얼이 필요합니다. 브랜드 톤앤매너 갱신이 함께 진행됩니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'web_02',
    field: 'web',
    name: '시리즈 A 투자 유치용 스타트업 랜딩',
    purpose: '시리즈 A 투자 유치 라운드를 앞두고, 투자자 설득과 인재 채용에 동시에 활용할 통합 랜딩페이지가 필요합니다.',
    suitable_clients: ['startup'],
  },
  {
    id: 'web_03',
    field: 'web',
    name: '로스터리 카페 브랜드 사이트 신규 제작',
    purpose: '자체 로스팅을 시작하면서 브랜드 스토리, 원두 라인업, 매장 안내를 통합한 브랜드 사이트를 새로 만들고자 합니다.',
    suitable_clients: ['smb'],
  },
  {
    id: 'web_04',
    field: 'web',
    name: '지역 문화행사 홍보 캠페인 사이트',
    purpose: '시민 참여형 문화 페스티벌의 행사 안내와 참가 신청을 받는 캠페인 사이트가 필요합니다. 행사 종료 후 아카이브로도 활용 예정입니다.',
    suitable_clients: ['public'],
  },
  {
    id: 'web_05',
    field: 'web',
    name: '1인 한의원 브랜드 사이트 제작',
    purpose: '신규 개원한 한의원의 진료 안내와 온라인 예약을 통합한 사이트가 필요합니다. 환자분들이 편안하게 둘러볼 수 있는 분위기가 중요합니다.',
    suitable_clients: ['solo', 'smb'],
  },
  {
    id: 'web_06',
    field: 'web',
    name: '사립 어린이집 홈페이지 리뉴얼',
    purpose: '학부모 대상 정보 안내와 입소 문의를 받는 어린이집 홈페이지를 리뉴얼합니다. 신뢰감 있는 톤과 모바일 가독성이 중요합니다.',
    suitable_clients: ['smb', 'public'],
  },
  {
    id: 'web_07',
    field: 'web',
    name: '갤러리 온라인 전시 플랫폼',
    purpose: '오프라인 전시와 온라인 아카이브를 통합한 갤러리 사이트가 필요합니다. 작품의 분위기를 해치지 않는 차분한 디자인이 중요합니다.',
    suitable_clients: ['public', 'solo'],
  },
  {
    id: 'web_08',
    field: 'web',
    name: '그룹사 통합 채용 브랜딩 사이트',
    purpose: '그룹 차원의 통합 채용 사이트가 필요합니다. 계열사별 직군 안내와 그룹 인재상이 일관되게 전달되어야 합니다.',
    suitable_clients: ['corporate', 'midsize'],
  },
  {
    id: 'web_09',
    field: 'web',
    name: '공유 오피스 입주 안내 사이트',
    purpose: '공유 오피스 브랜드의 지점별 안내와 투어 예약을 받는 사이트가 필요합니다. 1인 창업가부터 중소 팀까지 다양한 타겟을 커버해야 합니다.',
    suitable_clients: ['midsize', 'startup'],
  },
  {
    id: 'web_10',
    field: 'web',
    name: '독립 매거진 웹사이트 신규 제작',
    purpose: '라이프스타일 독립 매거진의 기사 아카이브와 정기 구독을 받는 웹사이트를 새로 제작합니다. 콘텐츠 가독성이 가장 중요합니다.',
    suitable_clients: ['solo', 'startup'],
  },

  // ──────────────────────────────────────────────────────────────────
  // 🎨 BRAND (브랜딩, 10개)
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'brand_01',
    field: 'brand',
    name: '신규 베이커리 브랜드 BI 개발',
    purpose: '신규 오픈 예정인 베이커리의 로고, 패키지, 간판을 통합한 BI 개발이 필요합니다. 동네 단골들이 친근하게 느낄 수 있는 톤이 중요합니다.',
    suitable_clients: ['smb', 'startup'],
  },
  {
    id: 'brand_02',
    field: 'brand',
    name: '종합병원 의료 브랜드 리뉴얼',
    purpose: '개원 30년이 된 종합병원의 브랜드 리뉴얼이 필요합니다. 신뢰감을 유지하면서도 환자 친화적인 톤으로의 전환이 목표입니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'brand_03',
    field: 'brand',
    name: '창립 10주년 브랜드 아이덴티티 리프레시',
    purpose: '창립 10주년을 맞아 브랜드 아이덴티티를 정비하고, 변화한 시장 환경에 맞춰 일관된 비주얼 시스템을 갖추고자 합니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'brand_04',
    field: 'brand',
    name: '시민 환경 캠페인 BI 개발',
    purpose: '시민 분리수거 캠페인의 친근한 BI 개발이 필요합니다. 어린이부터 어르신까지 직관적으로 이해할 수 있어야 합니다.',
    suitable_clients: ['public'],
  },
  {
    id: 'brand_05',
    field: 'brand',
    name: '시리즈 B 스타트업 리브랜딩',
    purpose: '시리즈 B 투자 유치 이후 한 단계 도약하는 시점에 맞춰, 전면 리브랜딩을 진행합니다. 글로벌 진출도 염두에 둔 BI가 필요합니다.',
    suitable_clients: ['startup'],
  },
  {
    id: 'brand_06',
    field: 'brand',
    name: '여성복 영캐주얼 서브 라인 BI 개발',
    purpose: '기존 30대 타겟 여성복 브랜드가 20대 영캐주얼 시장 진입을 위해 서브 라인을 신설합니다. 모브랜드와 일관성을 유지하면서도 새로운 톤을 잡아야 합니다.',
    suitable_clients: ['smb', 'midsize'],
  },
  {
    id: 'brand_07',
    field: 'brand',
    name: '신규 영어 학원 브랜딩',
    purpose: '신규 오픈 영어 학원의 로고, 간판, 굿즈까지 통합 브랜딩 패키지가 필요합니다. 학부모의 신뢰와 아이들의 친근감을 동시에 잡아야 합니다.',
    suitable_clients: ['solo', 'smb', 'midsize'],
  },
  {
    id: 'brand_08',
    field: 'brand',
    name: '지역 농산물 협동조합 브랜드 개발',
    purpose: '지자체 지원으로 설립된 농산물 협동조합의 브랜드 아이덴티티와 포장 디자인을 함께 개발합니다. 지역 특색이 잘 드러나야 합니다.',
    suitable_clients: ['smb', 'public'],
  },
  {
    id: 'brand_09',
    field: 'brand',
    name: '부티크 호텔 브랜드 신규 런칭',
    purpose: '30객실 규모의 부티크 호텔을 새로 오픈하면서, 브랜드 아이덴티티와 공간 사이니지를 함께 개발하고자 합니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'brand_10',
    field: 'brand',
    name: '크리에이터 개인 브랜드 패키지',
    purpose: '구독자 100만 유튜브 크리에이터의 개인 브랜드 아이덴티티와 굿즈 디자인을 통합한 패키지가 필요합니다.',
    suitable_clients: ['solo', 'startup'],
  },

  // ──────────────────────────────────────────────────────────────────
  // 📱 APP (앱 제작, 10개)
  // ──────────────────────────────────────────────────────────────────
  {
    id: 'app_01',
    field: 'app',
    name: '신규 출시 모바일 앱 핵심 화면 UI',
    purpose: '신규 출시 예정인 모바일 앱의 베타 테스트 준비를 위해 핵심 12개 화면의 UI 디자인이 필요합니다.',
    suitable_clients: ['startup'],
  },
  {
    id: 'app_02',
    field: 'app',
    name: '홈트레이닝 앱 신규 디자인',
    purpose: '운동 기록과 영상 강의를 통합한 홈트레이닝 앱을 새로 출시합니다. 사용자가 매일 부담 없이 들어올 수 있는 인터페이스가 핵심입니다.',
    suitable_clients: ['startup', 'midsize'],
  },
  {
    id: 'app_03',
    field: 'app',
    name: '개인 자산관리 앱 전면 리뉴얼',
    purpose: '기존 사용자 이탈률이 높아 전면 리뉴얼이 필요한 자산관리 앱입니다. UX 개선과 시각적 신뢰감 강화가 핵심 목표입니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'app_04',
    field: 'app',
    name: '공공자전거 앱 UI 개선',
    purpose: '지자체 운영 공공자전거 서비스 앱의 사용성 개선이 필요합니다. 시민들의 접근성과 직관성이 가장 중요합니다.',
    suitable_clients: ['public'],
  },
  {
    id: 'app_05',
    field: 'app',
    name: '자사몰 전용 모바일 앱 신규 제작',
    purpose: '웹 자사몰의 전용 앱을 출시해 회원 락인을 강화하고자 합니다. 웹과 앱 간 일관된 경험이 중요합니다.',
    suitable_clients: ['midsize', 'corporate'],
  },
  {
    id: 'app_06',
    field: 'app',
    name: '유아 영어 학습 앱 UI 디자인',
    purpose: '4~7세 타겟 게이미피케이션 영어 학습 앱의 UI 디자인이 필요합니다. 아이들의 집중력 유지와 부모의 진도 확인 기능이 함께 고려되어야 합니다.',
    suitable_clients: ['startup', 'midsize'],
  },
  {
    id: 'app_07',
    field: 'app',
    name: '취미 클래스 매칭 앱 신규 제작',
    purpose: '취미 클래스를 운영하는 호스트와 수강생을 매칭하는 커뮤니티형 앱을 새로 만들고자 합니다.',
    suitable_clients: ['startup'],
  },
  {
    id: 'app_08',
    field: 'app',
    name: '호텔 체인 멤버십 앱 신규 제작',
    purpose: '호텔 체인의 멤버십 등급, 예약, 라운지 이용까지 통합한 멤버십 앱을 새로 출시합니다. 프리미엄 사용자 경험이 핵심입니다.',
    suitable_clients: ['corporate'],
  },
  {
    id: 'app_09',
    field: 'app',
    name: '음식 배달 앱 주문 흐름 리뉴얼',
    purpose: '음식 배달 앱의 주문 단계가 복잡하다는 사용자 피드백을 반영해, 주문 흐름 전반의 UX 리뉴얼이 필요합니다.',
    suitable_clients: ['corporate'],
  },
  {
    id: 'app_10',
    field: 'app',
    name: '1인 살롱 예약/노쇼 관리 앱',
    purpose: '헤어·네일 등 1인 살롱 운영자를 위한 예약 관리와 노쇼 방지 기능이 통합된 앱이 필요합니다.',
    suitable_clients: ['solo', 'smb'],
  },
];

// ─── 헬퍼 함수 ───────────────────────────────────────────────────────────

/**
 * 특정 분야의 모든 프로젝트 템플릿 반환
 */
export const getProjectsByField = (field: DesignField): ProjectTemplate[] => {
  return PROJECT_POOL.filter((p) => p.field === field);
};

/**
 * 분야 + 클라이언트 유형 조합에 어울리는 프로젝트 중 랜덤 1개 선택
 * 해당 조합이 없으면 분야만 일치하는 프로젝트 중 랜덤 선택 (fallback)
 */
export const pickRandomProject = (
  field: DesignField,
  clientType: ClientType,
): ProjectTemplate => {
  const matched = PROJECT_POOL.filter(
    (p) => p.field === field && p.suitable_clients.includes(clientType),
  );
  if (matched.length > 0) {
    return matched[Math.floor(Math.random() * matched.length)];
  }

  // Fallback: 같은 분야에서 아무거나
  const fieldMatched = PROJECT_POOL.filter((p) => p.field === field);
  if (fieldMatched.length > 0) {
    return fieldMatched[Math.floor(Math.random() * fieldMatched.length)];
  }

  // 마지막 fallback
  return PROJECT_POOL[0];
};

/**
 * id로 특정 프로젝트 조회 (저장된 프로젝트 복원 시 사용)
 */
export const getProjectById = (id: string): ProjectTemplate | undefined => {
  return PROJECT_POOL.find((p) => p.id === id);
};
