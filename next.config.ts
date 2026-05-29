import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @anthropic-ai/sdk는 Node.js 전용 패키지이므로 Turbopack 번들에서 제외.
  // 이렇게 해야 native process.env(ANTHROPIC_API_KEY 포함)에 정상 접근할 수 있음.
  serverExternalPackages: ['@anthropic-ai/sdk'],
};

export default nextConfig;
