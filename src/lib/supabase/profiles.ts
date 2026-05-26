import { createClient } from './server'

export interface Profile {
  user_id: string
  nickname: string | null
  preferred_design_type: string | null
  created_at: string
  updated_at: string
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data ?? null
}

export async function upsertProfile(
  updates: Partial<Pick<Profile, 'nickname' | 'preferred_design_type'>>
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('profiles').upsert({
    user_id: user.id,
    ...updates,
  })

  if (error) throw error
}
