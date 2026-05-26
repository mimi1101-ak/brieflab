import { NextRequest, NextResponse } from 'next/server'

// 인증 비활성화 — 모든 요청을 그대로 통과
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    // _next/static, _next/image, favicon.ico, 정적 파일(이미지 등)은 제외
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
