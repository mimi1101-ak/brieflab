'use server'
import { upsertProfile } from '@/lib/supabase/profiles'

export async function saveProfile(nickname: string, designType: string) {
  await upsertProfile({ nickname: nickname.trim(), preferred_design_type: designType })
}
