import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BriefLab — AI 브리프 연습 플랫폼",
  description: "AI가 만들어주는 가상 클라이언트 브리프로 실전 디자인 프로세스를 연습하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
