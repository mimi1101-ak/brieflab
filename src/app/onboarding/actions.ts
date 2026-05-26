'use server'
import { upsertProfile } from '@/lib/supabase/profiles'

export async function saveNickname(nickname: string) {
  await upsertProfile({ nickname: nickname.trim() })
}

export async function saveDesignType(designType: string) {
  await upsertProfile({ preferred_design_type: designType })
}
