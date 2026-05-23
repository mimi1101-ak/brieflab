'use client';
import React from 'react';
import * as Icon from '@/components/ui/Icon';

const AI_PALETTES: Record<string, { name: string; tagline: string; colors: string[] }[]> = {
  brand: [
    { name: '따뜻한 브라운 토n', tagline: '안정감 있고 신뢰감을 주는 톤', colors: ['#3D2E1F','#7A5C3E','#C9A876','#E8DCC4','#FAF6EE'] },
    { name: '시원한 오션 블루', tagline: '깨끗하고 모던한 신뢰의 인상', colors: ['#0B2545','#13315C','#3E7CB1','#8FB8DE','#EEF4F8'] },
    { name: '비비드 코랄 글로우', tagline: '활기차고 친근한 라이프스타일', colors: ['#2D1B2E','#FF6B6B','#FFB4A2','#FFD6BA','#FFF1E6'] },
  ],
  detail: [
    { name: '소프트 베이지 누트', tagline: '제품을 자연스럽게 돋보이게', colors: ['#2A2520','#8B6F47','#D4B896','#F2E8DC','#FFFAF3'] },
    { name: '클린 민트 프레시', tagline: '깨끗하고 산뜻한 비건/뷰티 톤', colors: ['#0F2922','#2D8B6F','#7DCFB6','#C9EDDC','#F4FBF7'] },
    { name: '딥 와인 럭셔리', tagline: '프리미엄 제품의 깊이감 강조', colors: ['#1A0E10','#5C1A24','#A03E4C','#D4A5AB','#F8EFF0'] },
  ],
  web: [
    { name: '인디고 테크 블루', tagline: '신뢰감 있는 SaaS·핀테크 톤', colors: ['#0B0E2E','#3730A3','#6366F1','#C7D2FE','#F5F7FF'] },
    { name: '모노톤 미니멀', tagline: '콘텐츠가 주인공인 깔끔함', colors: ['#0A0A0A','#3F3F3F','#A1A1A1','#E5E5E5','#FAFAFA'] },
    { name: '오렌지 에너지', tagline: '활동적인 스타트업 무드', colors: ['#1A1A2E','#FF6B35','#F7931E','#FFD166','#FFF8E7'] },
  ],
  app: [
    { name: '바이올렛 그라데이션', tagline: '젊고 트렌디한 Z세대 앱', colors: ['#1E0B36','#6B2D8E','#A855F7','#E9D5FF','#FAF5FF'] },
    { name: '소프트 핑크 바이브', tagline: '감성적이고 친근한 라이프 앱', colors: ['#2B1B2A','#D8527A','#F8AFA6','#FCE5DD','#FFF5F1'] },
    { name: '딥 그린 그로우', tagline: '건강·환경 카테고리에 적합', colors: ['#0E2620','#1F5D4C','#52B788','#B7E4C7','#F1F8F4'] },
  ],
};

const PaletteCard = ({ palette }: { palette: { name: string; tagline: string; colors: string[] } }) => (
  <div style={{ background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column', transition: 'all 160ms ease', cursor: 'pointer' }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor='var(--indigo-300)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor='var(--ink-200)'; e.currentTarget.style.boxShadow='var(--shadow-xs)'; e.currentTarget.style.transform='translateY(0)'; }}
  >
    <div style={{ display: 'flex', height: 96 }}>
      {palette.colors.map((c, i) => <div key={i} style={{ flex: i === 0 ? 1.4 : 1, background: c }} />)}
    </div>
    <div style={{ padding: '14px 16px 16px' }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '-0.01em', marginBottom: 4 }}>{palette.name}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.5, marginBottom: 12 }}>{palette.tagline}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {palette.colors.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: c, border: '1px solid rgba(15,19,48,0.08)' }} />
            <div style={{ fontSize: 9.5, color: 'var(--ink-500)', letterSpacing: 0.2 }}>{c.toUpperCase().replace('#','')}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ borderTop: '1px solid var(--ink-100)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button style={{ background: 'transparent', border: 'none', color: 'var(--ink-600)', fontSize: 12, fontWeight: 600, padding: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Icon.Copy style={{ width: 12, height: 12 }} /> HEX 복사
      </button>
      <button style={{ background: 'var(--indigo-50)', border: 'none', color: 'var(--indigo-700)', fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>
        이 팔레트 사용
      </button>
    </div>
  </div>
);

export const AiPaletteSection = ({ field }: { field: string | null }) => {
  const [seed, setSeed] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const fieldKey = (field || 'brand') as keyof typeof AI_PALETTES;
  const all = AI_PALETTES[fieldKey] || AI_PALETTES.brand;
  const palettes = [0,1,2].map((i) => all[(i + seed) % all.length]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setSeed((s) => s + 1); setRefreshing(false); }, 700);
  };

  return (
    <section style={{ marginTop: 24, background: 'linear-gradient(180deg,var(--indigo-50) 0%,transparent 100%)', border: '1px solid var(--indigo-100)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
      <style>{`@keyframes aiSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--indigo-500),var(--indigo-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', boxShadow: 'var(--shadow-indigo)' }}>
            <Icon.Sparkle style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>AI 추천 색상 팔레트</h3>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, background: 'var(--indigo-600)', color: '#fff', padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap' }}>BETA</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5 }}>브리프 분야와 톤에 어울리는 팔레트 3가지를 추천드려요.</div>
          </div>
        </div>
        <button type="button" onClick={onRefresh} disabled={refreshing} style={{ background: 'var(--white)', border: '1px solid var(--indigo-200)', color: 'var(--indigo-700)', fontSize: 13, fontWeight: 600, padding: '9px 14px', borderRadius: 'var(--radius)', cursor: refreshing ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', opacity: refreshing ? 0.7 : 1, transition: 'all 140ms ease' }}>
          <Icon.Refresh style={{ width: 14, height: 14, animation: refreshing ? 'aiSpin 700ms linear' : 'none' }} />
          {refreshing ? '추천 받는 중...' : '다시 추천받기'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, opacity: refreshing ? 0.5 : 1, transition: 'opacity 200ms ease' }}>
        {palettes.map((p, i) => <PaletteCard key={`${seed}-${i}`} palette={p} />)}
      </div>
    </section>
  );
};
