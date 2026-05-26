import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/supabase/profiles'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await getProfile()

  return (
    <ProfileClient
      initialNickname={profile?.nickname ?? ''}
      initialDesignType={profile?.preferred_design_type ?? ''}
      email={user.email ?? ''}
    />
  )
}
