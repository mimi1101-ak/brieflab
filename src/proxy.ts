import { NextRequest, NextResponse } from 'next/server'
import { ensureSession } from '@/lib/supabase/middleware'

// /auth/* 경로는 코드 교환 흐름 보호를 위해 익명 로그인 없이 통과
// 그 외 모든 경로: 세션이 없으면 익명 세션을 자동 발급
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }
  return ensureSession(request)
}

export const config = {
  matcher: [
    // _next/static, _next/image, favicon.ico, 정적 파일(이미지 등)은 제외
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
