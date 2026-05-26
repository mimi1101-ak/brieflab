import { getProfile } from '@/lib/supabase/profiles'
import BriefPageClient from '@/components/brief/BriefPageClient'

export default async function BriefPage() {
  const profile = await getProfile()
  return <BriefPageClient preferredField={profile?.preferred_design_type ?? null} />
}
