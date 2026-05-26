import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

// Proxy에서 Supabase 세션을 갱신하고 업데이트된 쿠키를 응답에 반영하는 유틸
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, responseHeaders) {
          // 요청 객체에도 쿠키를 반영해 이후 핸들러가 갱신된 세션을 읽을 수 있도록 함
          // (RequestCookies.set은 name, value 두 인수만 허용)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // 응답 객체를 새로 만들어 갱신된 쿠키와 캐시 방지 헤더를 설정
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(responseHeaders).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // getSession() 대신 getUser()를 사용해 서버에서 세션을 검증
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
