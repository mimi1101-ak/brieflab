import { createClient } from '@/lib/supabase/client'
import type { BriefData, BriefForm } from '@/components/brief/types'
import type { CurrentStep, ProjectRow, StepIndex } from '@/types/database'

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
  const { data: { user: existingUser } } = await supabase.auth.getUser()

  let user = existingUser

  if (!user) {
    // 배포 환경에서 미들웨어 세션이 전달 안 된 경우 fallback: 익명 로그인
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously()
    if (anonError || !anonData.user) {
      console.error('[BriefLab] 익명 로그인 상세 에러:', JSON.stringify(anonError))
      console.error('[BriefLab] anonData:', JSON.stringify(anonData))
      throw new Error('로그인에 실패했어요. 다시 시도해주세요.')
    }
    user = anonData.user
  }

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
      persona_id:          brief.persona_id          ?? null,
      project_template_id: brief.project_template_id ?? null,
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

export async function getCompletedProjects(): Promise<ProjectRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'completed')
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

/**
 * 단계 전진 시 projects.current_step / step_index 동기화.
 * 에러 시 false 반환 (throw 하지 않음).
 */
export async function completeProject(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateProjectStep(
  projectId: string,
  dbStep: string,
  stepIdx: number,
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .update({
      current_step: dbStep as CurrentStep,
      step_index: stepIdx as StepIndex,
    })
    .eq('id', projectId)
  if (error) {
    console.error('[BriefLab] step 업데이트 실패:', error)
    return false
  }
  return true
}
