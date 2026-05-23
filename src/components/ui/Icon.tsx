import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const Detail = (p: IconProps) => <svg {...base} {...p}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>;
export const Web = (p: IconProps) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 7h.01M10 7h.01"/></svg>;
export const Brand = (p: IconProps) => <svg {...base} {...p}><path d="M12 3l2.5 5.5L20 9.5l-4 4 1 5.5-5-2.6L7 19l1-5.5-4-4 5.5-1z"/></svg>;
export const App = (p: IconProps) => <svg {...base} {...p}><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>;
export const Check = (p: IconProps) => <svg {...base} strokeWidth={2} {...p}><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>;
export const ChevronDown = (p: IconProps) => <svg {...base} strokeWidth={1.8} {...p}><path d="M6 9l6 6 6-6"/></svg>;
export const ChevronRight = (p: IconProps) => <svg {...base} strokeWidth={2} {...p}><path d="M9 6l6 6-6 6"/></svg>;
export const ChevronLeft = (p: IconProps) => <svg {...base} strokeWidth={1.8} {...p}><path d="M15 6l-6 6 6 6"/></svg>;
export const Sparkle = (p: IconProps) => <svg {...base} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
export const Info = (p: IconProps) => <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>;
export const Help = (p: IconProps) => <svg {...base} {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>;
export const Plus = (p: IconProps) => <svg {...base} strokeWidth={1.8} {...p}><path d="M12 5v14M5 12h14"/></svg>;
export const X = (p: IconProps) => <svg {...base} strokeWidth={1.8} {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
export const Wand = (p: IconProps) => <svg {...base} {...p}><path d="M3 21l11-11M14 4l1.5 1.5M19 4l-1.5 1.5M19 9l-1.5-1.5M14 9l1.5-1.5"/><path d="M14 10l-1-1"/></svg>;
export const Calendar = (p: IconProps) => <svg {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg>;
export const Money = (p: IconProps) => <svg {...base} {...p}><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v.01M18 14.5v.01"/></svg>;
export const Palette = (p: IconProps) => <svg {...base} {...p}><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.5 1-2 2-2h1.5a3.5 3.5 0 0 0 3.5-3.5C21 8.4 17 3 12 3z"/><circle cx="7.5" cy="11" r="1" fill="currentColor"/><circle cx="9.5" cy="7" r="1" fill="currentColor"/><circle cx="14" cy="6.5" r="1" fill="currentColor"/><circle cx="17" cy="9.5" r="1" fill="currentColor"/></svg>;
export const Tag = (p: IconProps) => <svg {...base} {...p}><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>;
export const Link = (p: IconProps) => <svg {...base} {...p}><path d="M10 14a4 4 0 0 1 0-5.7l2.5-2.5a4 4 0 1 1 5.7 5.7L17 12.5"/><path d="M14 10a4 4 0 0 1 0 5.7l-2.5 2.5a4 4 0 1 1-5.7-5.7L7 11.5"/></svg>;
export const Doc = (p: IconProps) => <svg {...base} {...p}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>;
export const Spark2 = (p: IconProps) => <svg {...base} {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>;
export const Building = (p: IconProps) => <svg {...base} {...p}><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></svg>;
export const Bell = (p: IconProps) => <svg {...base} {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0"/></svg>;
export const Upload = (p: IconProps) => <svg {...base} {...p}><path d="M12 16V6M8 10l4-4 4 4M5 18h14"/></svg>;
export const Copy = (p: IconProps) => <svg {...base} strokeWidth={1.8} {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>;
export const Refresh = (p: IconProps) => <svg {...base} strokeWidth={2} {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>;
export const Star = (p: IconProps) => <svg {...base} {...p}><path d="M12 2l3 6.5L22 9.5l-5 4.7 1.2 7L12 17.8 5.8 21.2 7 14.2l-5-4.7 7-1z"/></svg>;
