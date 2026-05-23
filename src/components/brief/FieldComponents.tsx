'use client';
import React from 'react';
import * as Icon from '@/components/ui/Icon';

// ─── Section card ───────────────────────────────────────────────────────────
export const Section = ({
  number, title, subtitle, children, footer,
}: {
  number: string; title: string; subtitle?: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) => (
  <section style={{
    background: 'var(--white)', border: '1px solid var(--ink-200)',
    borderRadius: 'var(--radius-lg)', padding: '28px 28px 24px',
    boxShadow: 'var(--shadow-xs)',
  }}>
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      marginBottom: 20, paddingBottom: 18, borderBottom: '1px solid var(--ink-100)',
    }}>
      <div style={{
        flexShrink: 0, width: 32, height: 32, borderRadius: 8,
        background: 'var(--indigo-50)', color: 'var(--indigo-700)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700,
      }}>{number}</div>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink-900)', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13.5, color: 'var(--ink-500)', margin: '4px 0 0', lineHeight: 1.55 }}>{subtitle}</p>}
      </div>
      {footer}
    </div>
    <div>{children}</div>
  </section>
);

// ─── Field row ──────────────────────────────────────────────────────────────
export const Field = ({
  label, required, optionalText, helper, children,
}: {
  label: string; required?: boolean; optionalText?: string;
  helper?: React.ReactNode; children: React.ReactNode;
}) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--ink-800)', marginBottom: 10 }}>
      <span>{label}</span>
      {required && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--indigo-600)', background: 'var(--indigo-50)', padding: '2px 7px', borderRadius: 999 }}>필수</span>}
      {optionalText && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink-500)', border: '1px solid var(--ink-200)', padding: '2px 7px', borderRadius: 999 }}>{optionalText}</span>}
    </div>
    {children}
    {helper}
  </div>
);

// ─── Helper hint ────────────────────────────────────────────────────────────
export const HelperHint = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12.5, color: 'var(--ink-500)', marginTop: 8, lineHeight: 1.5 }}>
    <Icon.Info style={{ width: 13, height: 13, marginTop: 2, color: 'var(--indigo-500)', flexShrink: 0 }} />
    <span>{children}</span>
  </div>
);

// ─── Option card grid (요청 분야) ────────────────────────────────────────────
interface Option { id: string; label: string; sub?: string; icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; }

export const OptionCardGrid = ({ options, value, onChange }: { options: Option[]; value: string | null; onChange: (v: string) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
    {options.map((opt) => {
      const selected = value === opt.id;
      const IconComp = opt.icon;
      return (
        <button key={opt.id} type="button" onClick={() => onChange(opt.id)} style={{
          position: 'relative', background: selected ? 'var(--indigo-50)' : 'var(--white)',
          border: selected ? '1.5px solid var(--indigo-600)' : '1.5px solid var(--ink-200)',
          borderRadius: 'var(--radius)', padding: '18px 14px 16px', textAlign: 'left',
          transition: 'all 140ms ease', display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', gap: 10, color: 'var(--ink-900)',
          boxShadow: selected ? '0 0 0 4px rgba(79,70,229,0.10)' : 'none', cursor: 'pointer',
        }}
          onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--indigo-300)'; e.currentTarget.style.background = 'var(--ink-50)'; } }}
          onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--ink-200)'; e.currentTarget.style.background = 'var(--white)'; } }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 10, background: selected ? 'var(--indigo-600)' : 'var(--ink-100)', color: selected ? 'var(--white)' : 'var(--ink-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 140ms ease' }}>
            {IconComp && <IconComp style={{ width: 22, height: 22 }} />}
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.3 }}>{opt.label}</div>
          {opt.sub && <div style={{ fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.45 }}>{opt.sub}</div>}
          {selected && (
            <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 999, background: 'var(--indigo-600)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Check style={{ width: 12, height: 12 }} />
            </div>
          )}
        </button>
      );
    })}
  </div>
);

// ─── Segmented row ───────────────────────────────────────────────────────────
export const SegmentedRow = ({ options, value, onChange }: { options: { id: string; label: string }[]; value: string | null; onChange: (v: string) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length},1fr)`, gap: 8, background: 'var(--ink-50)', padding: 6, borderRadius: 'var(--radius)', border: '1px solid var(--ink-200)' }}>
    {options.map((opt) => {
      const selected = value === opt.id;
      return (
        <button key={opt.id} type="button" onClick={() => onChange(opt.id)} style={{
          background: selected ? 'var(--white)' : 'transparent', border: 'none',
          padding: '12px 10px', borderRadius: 'calc(var(--radius) - 4px)', textAlign: 'center',
          fontSize: 14, fontWeight: selected ? 600 : 500,
          color: selected ? 'var(--indigo-700)' : 'var(--ink-600)', transition: 'all 120ms ease',
          boxShadow: selected ? '0 1px 3px rgba(15,19,48,0.10),0 0 0 1px rgba(79,70,229,0.16)' : 'none', cursor: 'pointer',
        }}>{opt.label}</button>
      );
    })}
  </div>
);

// ─── Difficulty grid ─────────────────────────────────────────────────────────
export const DifficultyGrid = ({ options, value, onChange }: { options: { id: string; label: string; sub: string }[]; value: string | null; onChange: (v: string) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
    {options.map((opt, i) => {
      const selected = value === opt.id;
      const dots = i + 1;
      return (
        <button key={opt.id} type="button" onClick={() => onChange(opt.id)} style={{
          background: selected ? 'var(--indigo-50)' : 'var(--white)',
          border: selected ? '1.5px solid var(--indigo-600)' : '1.5px solid var(--ink-200)',
          borderRadius: 'var(--radius)', padding: '16px 14px', textAlign: 'left',
          transition: 'all 140ms ease', color: 'var(--ink-900)',
          boxShadow: selected ? '0 0 0 4px rgba(79,70,229,0.10)' : 'none',
          display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer',
        }}
          onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--indigo-300)'; e.currentTarget.style.background = 'var(--ink-50)'; } }}
          onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--ink-200)'; e.currentTarget.style.background = 'var(--white)'; } }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4].map((n) => (
                <div key={n} style={{ width: 8, height: 8, borderRadius: 2, background: n <= dots ? (selected ? 'var(--indigo-600)' : 'var(--ink-700)') : 'var(--ink-200)' }} />
              ))}
            </div>
            {selected && <Icon.Check style={{ width: 14, height: 14, color: 'var(--indigo-600)' }} />}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>{opt.label}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.5 }}>{opt.sub}</div>
        </button>
      );
    })}
  </div>
);

// ─── Pill row (chips) ────────────────────────────────────────────────────────
export const PillRow = ({ options, value, onChange }: { options: { id: string; label: string }[]; value: string | null; onChange: (v: string | null) => void }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {options.map((opt) => {
      const selected = value === opt.id;
      return (
        <button key={opt.id} type="button" onClick={() => onChange(value === opt.id ? null : opt.id)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: selected ? 'var(--indigo-600)' : 'var(--white)',
          color: selected ? 'var(--white)' : 'var(--ink-700)',
          border: selected ? '1.5px solid var(--indigo-600)' : '1.5px solid var(--ink-200)',
          borderRadius: 999, padding: '8px 14px', fontSize: 13.5,
          fontWeight: selected ? 600 : 500, transition: 'all 120ms ease', cursor: 'pointer',
        }}
          onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--indigo-300)'; e.currentTarget.style.color = 'var(--indigo-700)'; } }}
          onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--ink-200)'; e.currentTarget.style.color = 'var(--ink-700)'; } }}
        >{opt.label}</button>
      );
    })}
  </div>
);

// ─── Style thumbs ────────────────────────────────────────────────────────────
export const styleThumbs: Record<string, { bg: string; el: React.ReactNode }> = {
  minimal: { bg: '#FAFAFA', el: <svg width="100%" height="100%" viewBox="0 0 100 50"><rect x="6" y="14" width="36" height="3" fill="#1F2244"/><rect x="6" y="22" width="60" height="2" fill="#A4A7C4"/><rect x="6" y="28" width="48" height="2" fill="#A4A7C4"/><rect x="6" y="34" width="20" height="3" fill="#0E1330"/></svg> },
  trendy: { bg: 'linear-gradient(135deg,#FFE4E1 0%,#E0E7FF 100%)', el: <svg width="100%" height="100%" viewBox="0 0 100 50"><circle cx="22" cy="25" r="14" fill="#F472B6" opacity=".85"/><circle cx="40" cy="25" r="14" fill="#818CF8" opacity=".85"/><rect x="60" y="16" width="32" height="6" rx="3" fill="#1F2244"/><rect x="60" y="26" width="22" height="4" rx="2" fill="#525787"/></svg> },
  classic: { bg: '#F5F1EA', el: <svg width="100%" height="100%" viewBox="0 0 100 50"><line x1="6" y1="10" x2="94" y2="10" stroke="#5C4A2E" strokeWidth=".5"/><line x1="6" y1="42" x2="94" y2="42" stroke="#5C4A2E" strokeWidth=".5"/><text x="50" y="28" fontSize="11" fill="#3B2E1A" textAnchor="middle" fontFamily="serif" fontStyle="italic">Atelier</text><text x="50" y="38" fontSize="4" fill="#5C4A2E" textAnchor="middle" fontFamily="serif" letterSpacing="2">EST. 1924</text></svg> },
  bold: { bg: '#0E1330', el: <svg width="100%" height="100%" viewBox="0 0 100 50"><rect x="6" y="10" width="42" height="14" fill="#FFE600"/><rect x="6" y="26" width="60" height="14" fill="#FFFFFF"/><text x="9" y="21" fontSize="9" fill="#0E1330" fontWeight="900" letterSpacing="-0.5">BOLD</text><text x="9" y="37" fontSize="9" fill="#0E1330" fontWeight="900" letterSpacing="-0.5">MOVE</text></svg> },
};

// ─── Style tag grid ──────────────────────────────────────────────────────────
export const StyleTagGrid = ({ options, value, onChange }: { options: { id: string; label: string; thumbBg: string; thumb: React.ReactNode }[]; value: string[]; onChange: (v: string[]) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
    {options.map((opt) => {
      const selected = value.includes(opt.id);
      return (
        <button key={opt.id} type="button" onClick={() => onChange(selected ? value.filter((x) => x !== opt.id) : [...value, opt.id])} style={{
          background: selected ? 'var(--indigo-50)' : 'var(--white)',
          border: selected ? '1.5px solid var(--indigo-600)' : '1.5px solid var(--ink-200)',
          borderRadius: 'var(--radius)', padding: 12, textAlign: 'left',
          transition: 'all 140ms ease', display: 'flex', flexDirection: 'column', gap: 10,
          boxShadow: selected ? '0 0 0 4px rgba(79,70,229,0.10)' : 'none', cursor: 'pointer',
        }}
          onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--indigo-300)'; e.currentTarget.style.background = 'var(--ink-50)'; } }}
          onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = 'var(--ink-200)'; e.currentTarget.style.background = 'var(--white)'; } }}
        >
          <div style={{ height: 64, borderRadius: 8, border: '1px solid var(--ink-100)', overflow: 'hidden', background: opt.thumbBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            {opt.thumb}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.label}</div>
            <div style={{ width: 16, height: 16, borderRadius: 4, border: selected ? 'none' : '1.5px solid var(--ink-300)', background: selected ? 'var(--indigo-600)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selected && <Icon.Check style={{ width: 11, height: 11, color: 'var(--white)' }} />}
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

// ─── Text input ──────────────────────────────────────────────────────────────
export const TextInput = ({ value, onChange, placeholder, leftIcon: LeftIcon }: { value: string; onChange: (v: string) => void; placeholder?: string; leftIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--white)', border: focused ? '1.5px solid var(--indigo-600)' : '1.5px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '10px 14px', boxShadow: focused ? '0 0 0 4px rgba(79,70,229,0.10)' : 'none', transition: 'all 120ms ease' }}>
      {LeftIcon && <LeftIcon style={{ width: 16, height: 16, color: 'var(--ink-400)', flexShrink: 0 }} />}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--ink-900)', background: 'transparent', padding: 0 }} />
    </div>
  );
};
