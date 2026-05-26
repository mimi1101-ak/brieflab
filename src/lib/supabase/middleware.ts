import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

function makeSupabaseClient(request: NextRequest, getResponse: () => NextResponse, setResponse: (r: NextResponse) => void) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, responseHeaders) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          const next = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => next.cookies.set(name, value, options))
          Object.entries(responseHeaders ?? {}).forEach(([k, v]) => next.headers.set(k, v))
          setResponse(next)
        },
      },
    }
  )
}

// 기존 정식 로그인 흐름에서 사용 — 세션 갱신 후 user를 반환
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = makeSupabaseClient(request, () => supabaseResponse, (r) => { supabaseResponse = r })
  const { data: { user } } = await supabase.auth.getUser()
  return { supabaseResponse, user }
}

// 세션이 없으면 익명 로그인을 자동으로 수행해 항상 auth.uid()가 채워지도록 보장
export async function ensureSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = makeSupabaseClient(request, () => supabaseResponse, (r) => { supabaseResponse = r })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const { error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('[BriefLab] 익명 로그인 실패:', error.message)
      console.error('[BriefLab] Supabase Dashboard → Authentication → "Allow anonymous sign-ins" 가 ON인지 확인하세요.')
    }
  }

  return supabaseResponse
}
