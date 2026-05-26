'use client';
import React from 'react';
import Link from 'next/link';
import * as Icon from '@/components/ui/Icon';

const PROCESS_STEPS = [
  { id: 'receive', label: '브리프 수령', short: '수령' },
  { id: 'qna', label: '질의응답', short: '질의' },
  { id: 'draft', label: '시안 제출', short: '시안' },
  { id: 'feedback', label: '피드백 수용', short: '피드백' },
  { id: 'deliver', label: '최종 납품', short: '납품' },
];

const FIELD_META: Record<string, { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string; bg: string }> = {
  detail: { label: '상세페이지', icon: Icon.Detail, color: '#0EA5E9', bg: '#E0F2FE' },
  web:    { label: '웹사이트', icon: Icon.Web, color: '#8B5CF6', bg: '#EDE9FE' },
  brand:  { label: '브랜딩', icon: Icon.Brand, color: '#F59E0B', bg: '#FEF3C7' },
  app:    { label: '앱 제작', icon: Icon.App, color: '#EC4899', bg: '#FCE7F3' },
};
const DIFF: Record<string, string> = { beginner: '입문', easy: '초급', medium: '중급', hard: '고급' };

const ACTIVE_BRIEFS = [
  { id: 1, title: '그린라이프 브랜드 리뉴얼 프로젝트', field: 'brand', difficulty: 'medium', stepIdx: 2, deadline: '2026-05-19', daysLeft: 14, client: '(주)그린라이프' },
  { id: 2, title: '신제품 비건 스킨케어 상세페이지', field: 'detail', difficulty: 'easy', stepIdx: 1, deadline: '2026-05-12', daysLeft: 7, client: '카페 모도리' },
  { id: 3, title: '식품 스타트업 랜딩페이지 제작', field: 'web', difficulty: 'hard', stepIdx: 3, deadline: '2026-05-26', daysLeft: 21, client: '(주)블룸닷' },
];
const COMPLETED_BRIEFS = [
  { id: 11, title: '카페 메뉴판 리디자인', field: 'brand', difficulty: 'beginner', completedAt: '2026-04-28', score: 4.5 },
  { id: 12, title: '뷰티 브랜드 인스타 광고 페이지', field: 'detail', difficulty: 'easy', completedAt: '2026-04-20', score: 4.2 },
  { id: 13, title: '핀테크 앱 온보딩 화면 4종', field: 'app', difficulty: 'medium', completedAt: '2026-04-12', score: 4.8 },
  { id: 14, title: '동네 빵집 SNS 홍보 페이지', field: 'detail', difficulty: 'beginner', completedAt: '2026-04-03', score: 4.0 },
  { id: 15, title: '교육 스타트업 기업 소개 사이트', field: 'web', difficulty: 'medium', completedAt: '2026-03-25', score: 4.6 },
];
const MONTHLY_GOAL = 3;

// ─── Avatar ──────────────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  { bg: '#EEF2FF', color: '#3730A3' },
  { bg: '#E0E7FF', color: '#4338CA' },
  { bg: '#C7D2FE', color: '#4338CA' },
  { bg: '#DDD6FE', color: '#5B21B6' },
  { bg: '#EDE9FE', color: '#6D28D9' },
];

function getAvatarStyle(nickname: string): { bg: string; color: string } {
  if (!nickname) return { bg: 'linear-gradient(135deg,#FCE7F3,#DDD6FE)', color: '#3730A3' };
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash | 0;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

// ─── Header ─────────────────────────────────────────────────────────────────
const Header = ({ empty, onToggle, nickname }: {
  empty: boolean;
  onToggle: () => void;
  nickname?: string | null;
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowMenu(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showMenu]);

  const avatarStyle = getAvatarStyle(nickname ?? '');
  const initial = nickname ? nickname.charAt(0) : '?';

  return (
    <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid var(--ink-200)', padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: 'var(--shadow-indigo)' }}>
          <Icon.Spark2 style={{ width: 16, height: 16 }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>BriefLab</div>
          <div style={{ fontSize: 11, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>AI 브리프 연습 플랫폼</div>
        </div>
      </div>
      <nav style={{ display: 'flex', gap: 4, fontSize: 13.5, fontWeight: 600 }}>
        {(['대시보드', '브리프', '포트폴리오', '커뮤니티'] as const).map((t, i) => (
          <a key={t} href={i === 1 ? '/brief' : '#'} style={{ padding: '8px 14px', borderRadius: 8, textDecoration: 'none', background: i === 0 ? 'var(--indigo-50)' : 'transparent', color: i === 0 ? 'var(--indigo-700)' : 'var(--ink-600)', whiteSpace: 'nowrap' }}>{t}</a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onToggle} style={{ background: empty ? 'var(--indigo-50)' : 'var(--ink-100)', border: empty ? '1px solid var(--indigo-200)' : '1px solid var(--ink-200)', color: empty ? 'var(--indigo-700)' : 'var(--ink-600)', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {empty ? '📭 빈 상태' : '📊 데이터 있음'}
        </button>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--ink-600)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon.Bell style={{ width: 18, height: 18 }} />
        </button>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(v => !v)}
            aria-label="프로필 메뉴"
            style={{ width: 32, height: 32, borderRadius: 999, background: avatarStyle.bg, color: avatarStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, boxShadow: 'var(--shadow-xs)', border: '1.5px solid rgba(255,255,255,0.8)', cursor: 'pointer', outline: 'none' }}
          >
            {initial}
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 224, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(17,24,39,0.14), 0 0 0 1px rgba(17,24,39,0.06)', overflow: 'hidden', zIndex: 100 }}>
              <div style={{ padding: '6px 0' }}>
                <Link
                  href="/profile"
                  onClick={() => setShowMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 13.5, fontWeight: 500, color: 'var(--ink-700)', textDecoration: 'none', transition: 'background 120ms' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink-50)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <svg viewBox="0 0 20 20" style={{ width: 16, height: 16, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="10" cy="7" r="3" />
                    <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
                  </svg>
                  프로필 설정
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ─── Greeting panel ──────────────────────────────────────────────────────────
const Stat = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
    <span style={{ fontSize: 14 }}>{icon}</span>
    <span style={{ opacity: 0.7 }}>{label}</span>
    <b style={{ fontWeight: 700 }}>{value}</b>
  </div>
);

const GreetingPanel = ({ empty, nickname }: { empty: boolean; nickname?: string | null }) => {
  const stats = empty
    ? { total: '0개', avgScore: '-', streak: '0일', monthlyDone: 0 }
    : { total: '14개', avgScore: '4.4', streak: '6일', monthlyDone: 2 };
  const pct = Math.min(100, (stats.monthlyDone / MONTHLY_GOAL) * 100);
  const hour = new Date().getHours();
  const greeting = empty ? '환영해요' : hour < 12 ? '좋은 아침이에요' : hour < 18 ? '오늘도 화이팅이에요' : '늦은 시간까지 수고하세요';
  const userName = nickname ?? '새로운 디자이너';

  return (
    <div style={{ background: 'linear-gradient(135deg,var(--indigo-700) 0%,var(--indigo-900) 100%)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
      <div aria-hidden style={{ position: 'absolute', top: -40, right: -20, width: 220, height: 220, background: 'radial-gradient(circle,rgba(155,163,255,0.45),transparent 70%)', filter: 'blur(8px)' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: -60, right: 120, width: 180, height: 180, background: 'radial-gradient(circle,rgba(236,72,153,0.18),transparent 70%)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center', position: 'relative' }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6, fontWeight: 500 }}>{greeting}, {userName} 님 👋</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.3 }}>
            {empty ? <>BriefLab에 오신 걸<br />환영해요!</> : <>오늘은 어떤 브리프에<br />도전해볼까요?</>}
          </h1>
          <div style={{ display: 'flex', gap: 20, marginTop: 18, fontSize: 13, flexWrap: 'wrap' }}>
            <Stat icon="🎯" label="총 완료" value={stats.total} />
            <Stat icon="📈" label="평균 평점" value={stats.avgScore} />
            <Stat icon="🔥" label="연속 학습" value={stats.streak} />
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 'var(--radius)', padding: '18px 22px', minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, letterSpacing: 0.3, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>5월 목표</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#FDE68A', whiteSpace: 'nowrap' }}>{MONTHLY_GOAL - stats.monthlyDone}개 남음</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>{stats.monthlyDone}</span>
            <span style={{ fontSize: 14, opacity: 0.7 }}>/ {MONTHLY_GOAL}개 완료</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.18)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#FDE68A,#F472B6)', borderRadius: 999, transition: 'width 360ms ease' }} />
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.78, lineHeight: 1.5 }}>한 달에 3개 이상 완료하면<br /><b style={{ color: '#FDE68A' }}>꾸준한 학습자</b> 배지를 받아요</div>
        </div>
      </div>
    </div>
  );
};

// ─── Step bar ────────────────────────────────────────────────────────────────
const StepBar = ({ activeIdx }: { activeIdx: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
    {PROCESS_STEPS.map((step, i) => {
      const status = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
      return (
        <React.Fragment key={step.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ width: status === 'active' ? 18 : 14, height: status === 'active' ? 18 : 14, borderRadius: 999, background: status === 'done' ? 'var(--success)' : status === 'active' ? 'var(--indigo-600)' : 'var(--ink-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: status === 'active' ? '0 0 0 4px rgba(79,70,229,0.18)' : 'none', transition: 'all 200ms ease', animation: status === 'active' ? 'pulseSoft 2s ease-in-out infinite' : 'none' }}>
              {status === 'done' && <Icon.Check style={{ width: 9, height: 9, color: '#fff' }} strokeWidth={3} />}
            </div>
            <div style={{ fontSize: 10.5, fontWeight: status === 'active' ? 700 : 500, color: status === 'pending' ? 'var(--ink-400)' : status === 'active' ? 'var(--indigo-700)' : 'var(--ink-700)', whiteSpace: 'nowrap' }}>{step.short}</div>
          </div>
          {i < PROCESS_STEPS.length - 1 && <div style={{ flex: 1, height: 2, marginTop: -16, background: i < activeIdx ? 'var(--success)' : 'var(--ink-200)', transition: 'background 200ms ease' }} />}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Active brief card ───────────────────────────────────────────────────────
const ActiveCard = ({ brief }: { brief: typeof ACTIVE_BRIEFS[0] }) => {
  const meta = FIELD_META[brief.field];
  const FieldIcon = meta.icon;
  const dueSoon = brief.daysLeft <= 7;
  return (
    <Link href="/brief" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: 22, boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', gap: 16, transition: 'all 160ms ease', cursor: 'pointer' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--indigo-300)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--ink-200)'; e.currentTarget.style.boxShadow='var(--shadow-xs)'; e.currentTarget.style.transform='translateY(0)'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FieldIcon style={{ width: 18, height: 18 }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: meta.color, whiteSpace: 'nowrap' }}>{meta.label}</span>
                <span style={{ fontSize: 10, color: 'var(--ink-300)' }}>•</span>
                <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{DIFF[brief.difficulty]}</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-400)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{brief.client}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: dueSoon ? 'var(--danger)' : 'var(--ink-600)', background: dueSoon ? '#FEE2E2' : 'var(--ink-100)', padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0 }}>D-{brief.daysLeft}</div>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--ink-900)', letterSpacing: '-0.02em', lineHeight: 1.4 }}>{brief.title}</h3>
        <div style={{ marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)', letterSpacing: 0.3, textTransform: 'uppercase' }}>진행 단계</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--indigo-700)' }}>{PROCESS_STEPS[brief.stepIdx].label} 중</span>
          </div>
          <StepBar activeIdx={brief.stepIdx} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--ink-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-500)' }}>
            <Icon.Calendar style={{ width: 13, height: 13 }} /> 마감 {brief.deadline}
          </div>
          <button style={{ background: 'var(--indigo-600)', color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 700, padding: '8px 14px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', cursor: 'pointer' }}>
            이어서 작업 <Icon.ChevronRight style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </Link>
  );
};

// ─── Score stars ─────────────────────────────────────────────────────────────
const ScoreStars = ({ score }: { score: number }) => {
  const filled = Math.floor(score);
  const half = score - filled >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map((n) => {
        let fill = 'var(--ink-200)';
        if (n <= filled) fill = '#F59E0B';
        else if (n === filled + 1 && half) fill = 'url(#half)';
        return (
          <svg key={n} viewBox="0 0 24 24" style={{ width: 13, height: 13 }}>
            <defs><linearGradient id="half"><stop offset="50%" stopColor="#F59E0B"/><stop offset="50%" stopColor="var(--ink-200)"/></linearGradient></defs>
            <path d="M12 2l3 6.5L22 9.5l-5 4.7 1.2 7L12 17.8 5.8 21.2 7 14.2l-5-4.7 7-1z" fill={fill}/>
          </svg>
        );
      })}
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-700)', marginLeft: 4 }}>{score.toFixed(1)}</span>
    </div>
  );
};

// ─── Completed brief card ─────────────────────────────────────────────────────
const CompletedCard = ({ brief }: { brief: typeof COMPLETED_BRIEFS[0] }) => {
  const meta = FIELD_META[brief.field];
  const FieldIcon = meta.icon;
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 140ms ease', cursor: 'pointer' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--indigo-300)'; e.currentTarget.style.background='var(--ink-50)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--ink-200)'; e.currentTarget.style.background='var(--white)'; }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: meta.bg, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FieldIcon style={{ width: 20, height: 20 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: meta.color, whiteSpace: 'nowrap' }}>{meta.label}</span>
          <span style={{ fontSize: 10, color: 'var(--ink-300)' }}>•</span>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{DIFF[brief.difficulty]}</span>
          <span style={{ fontSize: 10, color: 'var(--ink-300)' }}>•</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-500)', whiteSpace: 'nowrap' }}>{brief.completedAt} 완료</span>
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>{brief.title}</div>
      </div>
      <ScoreStars score={brief.score} />
      <button style={{ background: 'transparent', border: '1px solid var(--ink-200)', color: 'var(--ink-700)', fontSize: 12.5, fontWeight: 600, padding: '7px 12px', borderRadius: 8, whiteSpace: 'nowrap', cursor: 'pointer' }}>결과 보기</button>
    </div>
  );
};

// ─── Empty states ─────────────────────────────────────────────────────────────
const EmptyActive = () => (
  <div style={{ background: 'var(--white)', border: '1.5px dashed var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
    <div style={{ width: 88, height: 88, borderRadius: 22, background: 'linear-gradient(135deg,var(--indigo-50),#FCE7F3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg viewBox="0 0 80 80" style={{ width: 56, height: 56 }}>
        <rect x="14" y="18" width="42" height="50" rx="4" fill="#fff" stroke="var(--indigo-400)" strokeWidth="2"/>
        <line x1="22" y1="30" x2="48" y2="30" stroke="var(--indigo-200)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="38" x2="42" y2="38" stroke="var(--indigo-200)" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="46" x2="46" y2="46" stroke="var(--indigo-200)" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="58" cy="56" r="12" fill="var(--indigo-600)"/>
        <path d="M58 50v12 M52 56h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em', marginBottom: 6 }}>아직 진행 중인 브리프가 없어요</div>
      <div style={{ fontSize: 13.5, color: 'var(--ink-500)', lineHeight: 1.6 }}>첫 번째 브리프를 시작해볼까요?<br />분야와 난이도를 골라 5분 만에 시작할 수 있어요.</div>
    </div>
    <Link href="/brief" style={{ textDecoration: 'none' }}>
      <button style={{ background: 'var(--indigo-600)', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 700, padding: '10px 18px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-indigo)', cursor: 'pointer' }}>
        <Icon.Plus style={{ width: 14, height: 14 }} /> 첫 브리프 시작하기
      </button>
    </Link>
  </div>
);

const EmptyCompleted = () => (
  <div style={{ background: 'var(--white)', border: '1.5px dashed var(--ink-200)', borderRadius: 'var(--radius)', padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 16, color: 'var(--ink-500)' }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--ink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon.Star style={{ width: 22, height: 22, color: 'var(--ink-400)' }} />
    </div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 2 }}>아직 완료된 브리프가 없어요</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-500)' }}>브리프를 완료하면 평가 점수와 함께 여기에 모아드려요.</div>
    </div>
  </div>
);

// ─── Section header ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, count, action }: { title: string; subtitle: string; count: number; action?: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{title}</h2>
        <span style={{ fontSize: 12, fontWeight: 700, flexShrink: 0, background: 'var(--indigo-50)', color: 'var(--indigo-700)', padding: '3px 9px', borderRadius: 999 }}>{count}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 4 }}>{subtitle}</div>
    </div>
    {action}
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const Dashboard = () => {
  const [empty, setEmpty] = React.useState(false);
  const active = empty ? [] : ACTIVE_BRIEFS;
  const completed = empty ? [] : COMPLETED_BRIEFS;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--ink-50)' }}>
      <Header empty={empty} onToggle={() => setEmpty((e) => !e)} />
      <main style={{ flex: 1, maxWidth: 1240, width: '100%', margin: '0 auto', padding: '32px 36px 120px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <GreetingPanel empty={empty} />

        <section>
          <SectionHeader
            title="진행 중인 작업" count={active.length}
            subtitle={empty ? '첫 브리프를 시작해보세요. 단계별로 가이드해드려요.' : '현재 작업 중인 브리프예요. 단계별로 차근차근 완성해보세요.'}
            action={!empty ? (
              <button style={{ background: 'transparent', border: 'none', color: 'var(--indigo-700)', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', cursor: 'pointer' }}>
                모두 보기 <Icon.ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            ) : undefined}
          />
          {active.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))', gap: 16 }}>
              {active.map((b) => <ActiveCard key={b.id} brief={b} />)}
            </div>
          ) : <EmptyActive />}
        </section>

        <section>
          <SectionHeader
            title="완료된 작업" count={completed.length}
            subtitle={empty ? '완성한 브리프는 평가 점수와 함께 여기에 쌓여요.' : '지금까지 완성한 브리프 모음이에요. 클릭해서 결과물을 다시 볼 수 있어요.'}
            action={!empty ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <select style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', color: 'var(--ink-700)', fontSize: 13, fontWeight: 500, padding: '7px 10px', borderRadius: 8, cursor: 'pointer' }}>
                  <option>전체 분야</option><option>상세페이지</option><option>웹사이트</option><option>브랜딩</option><option>앱 제작</option>
                </select>
                <select style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', color: 'var(--ink-700)', fontSize: 13, fontWeight: 500, padding: '7px 10px', borderRadius: 8, cursor: 'pointer' }}>
                  <option>최근 순</option><option>평점 높은 순</option>
                </select>
              </div>
            ) : undefined}
          />
          {completed.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {completed.map((b) => <CompletedCard key={b.id} brief={b} />)}
            </div>
          ) : <EmptyCompleted />}
        </section>
      </main>

      {/* Sticky new brief CTA */}
      <div style={{ position: 'sticky', bottom: 24, marginTop: -24, marginBottom: 24, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
        <Link href="/brief" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'var(--indigo-600)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, padding: '14px 26px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 32px rgba(79,70,229,0.4)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', cursor: 'pointer' }}>
            <Icon.Plus style={{ width: 18, height: 18 }} /> 새 브리프 시작하기
          </button>
        </Link>
      </div>
    </div>
  );
};
