'use client';
import React from 'react';
import * as Icon from '@/components/ui/Icon';
import { BriefForm, Lookup } from './types';

interface FieldLabels {
  field: string | null; difficulty: string | null; duration: string | null;
  client: string | null; budget: string | null; styles: string | null;
}

const SummaryRow = ({ label, value, fallback = '—', highlight = false }: { label: string; value: string | null; fallback?: string; highlight?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--ink-100)' }}>
    <div style={{ fontSize: 12.5, color: 'var(--ink-500)', flexShrink: 0, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: value ? 600 : 400, color: value ? (highlight ? 'var(--indigo-700)' : 'var(--ink-900)') : 'var(--ink-400)', textAlign: 'right', lineHeight: 1.5 }}>{value || fallback}</div>
  </div>
);

export const Sidebar = ({ form, fieldLabels, completion, requiredCount, requiredFilled }: { form: BriefForm; fieldLabels: FieldLabels; completion: number; requiredCount: number; requiredFilled: number }) => (
  <aside style={{ position: 'sticky', top: 24, background: 'var(--white)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
    <div style={{ padding: '20px 22px 18px', background: 'linear-gradient(135deg,var(--indigo-600) 0%,var(--indigo-700) 100%)', color: 'var(--white)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icon.Spark2 style={{ width: 16, height: 16 }} />
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', opacity: 0.9 }}>브리프 미리보기</div>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, letterSpacing: '-0.02em' }}>AI가 만들 브리프 요약</div>
      <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.85 }}>필수 항목 {requiredFilled} / {requiredCount}</div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${completion}%`, background: 'var(--white)', borderRadius: 999, transition: 'width 240ms ease' }} />
      </div>
    </div>

    <div style={{ padding: '8px 22px 6px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: 'var(--ink-500)', textTransform: 'uppercase', margin: '12px 0 4px' }}>필수 항목</div>
      <SummaryRow label="요청 분야" value={fieldLabels.field} highlight />
      <SummaryRow label="난이도" value={fieldLabels.difficulty} highlight />
      <SummaryRow label="제작 기간" value={fieldLabels.duration} highlight />
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: 'var(--ink-500)', textTransform: 'uppercase', margin: '16px 0 4px' }}>추가 항목</div>
      <SummaryRow label="클라이언트" value={fieldLabels.client} fallback="자동 매칭" />
      <SummaryRow label="예산" value={fieldLabels.budget} fallback="자동 매칭" />
      <SummaryRow label="스타일" value={fieldLabels.styles} fallback="자동 매칭" />
      <SummaryRow label="참고 URL" value={form.refUrl || null} fallback="없음" />
    </div>

    <div style={{ margin: 16, padding: 14, background: 'var(--indigo-50)', borderRadius: 'var(--radius)', border: '1px solid var(--indigo-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Icon.Sparkle style={{ width: 14, height: 14, color: 'var(--indigo-700)' }} />
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--indigo-800)' }}>초보자를 위한 팁</div>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--indigo-900)' }}>
        처음이라면 <b>입문 · 1주 이내</b>로 시작해보세요. 짧고 명확한 브리프가 외주 프로세스를 익히기에 가장 좋습니다.
      </div>
    </div>
  </aside>
);
