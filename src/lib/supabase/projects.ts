import { createClient } from '@/lib/supabase/client'
import type { BriefData, BriefForm } from '@/components/brief/types'
import type { ProjectRow } from '@/types/database'

const DURATION_LABEL: Record<string, string> = {
  w1: '1주 이내', w2: '2주', m1: '1개월', m2: '2개월 이상',
}
const CLIENT_LABEL: Record<string, string> = {
  startup: '스타트업', smb: '소상공인', solo: '개인사업자',
  midsize: '중소기업', corporate: '대기업', public: '공공기관',
}
const BUDGET_LABEL: Record<string, string> = {
  b1: '30만원 이하', b2: '30~100만원', b3: '100~300만원', b4: '300만원 이상',
}

export async function insertDraftProject(
  form: BriefForm,
  brief: BriefData,
  emailBody: string,
): Promise<string> {
  const supabase = createClient()

  // RLS: user_id를 반드시 포함해야 INSERT 정책을 통과함
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      title: brief.project.name,
      field: form.field!,
      difficulty: form.difficulty!,
      duration: DURATION_LABEL[form.duration!] ?? form.duration!,
      client_type: form.client ? (CLIENT_LABEL[form.client] ?? form.client) : null,
      budget: form.budget ? (BUDGET_LABEL[form.budget] ?? form.budget) : null,
      // form_snapshot: 재생성 시 같은 설정으로 다시 호출하기 위해 원본 ID 보존
      style_preferences: { form_snapshot: { ...form } },
      brief_content: {
        persona: brief.persona,
        project: brief.project,
        dates: brief.dates,
        target: brief.target,
        emotion: brief.emotion,
        deliverable: brief.deliverable,
        styleLabels: brief.styleLabels,
        emailBody,
      },
      status: 'draft',
      current_step: 'receive',
      step_index: 0,
      deadline: brief.dates.final,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)
  return data.id
}

export async function acceptProject(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .update({ status: 'active' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getActiveProjects(): Promise<ProjectRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as ProjectRow[]
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as unknown as ProjectRow
}
