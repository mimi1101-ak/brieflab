import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 매직 링크 클릭 시 Supabase가 이 경로로 code 파라미터와 함께 리다이렉트함
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, preferred_design_type')
          .eq('user_id', user.id)
          .single()

        // 닉네임 없으면 온보딩 1단계로
        if (!profile?.nickname) {
          return NextResponse.redirect(`${origin}/onboarding/nickname`)
        }
        // 닉네임만 있고 디자인 유형 없으면 온보딩 2단계로
        if (!profile?.preferred_design_type) {
          return NextResponse.redirect(`${origin}/onboarding/design-type`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 코드가 없거나 교환에 실패한 경우 로그인 페이지로
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
