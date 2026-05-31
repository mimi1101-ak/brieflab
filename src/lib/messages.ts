import { createClient } from '@/lib/supabase/client';
import type { SentMessage } from '@/components/brief/types';

/** 피드백 메시지 1건 — draft_feedback 또는 revision_feedback */
export interface FeedbackMessage {
  id: string;
  project_id: string;
  type: 'draft_feedback' | 'revision_feedback';
  subject: string;
  body: string;
  created_at: string;
}

/**
 * 특정 프로젝트의 사용자 QnA 메시지를 가져온다.
 * sender='user', type='qna_question' 필터 적용.
 * 에러 시 []를 반환 (throw 하지 않음).
 */
export async function fetchProjectMessages(projectId: string): Promise<SentMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('id, project_id, subject, body, created_at')
    .eq('project_id', projectId)
    .eq('sender', 'user')
    .eq('type', 'qna_question')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[BriefLab] messages fetch 실패:', error);
    return [];
  }
  return (data ?? []) as SentMessage[];
}

/**
 * 특정 프로젝트의 AI 답장 메시지를 가져온다.
 * sender='assistant', type='qna_answer' 필터 적용.
 * 에러 시 []를 반환 (throw 하지 않음).
 */
export async function fetchProjectReplies(projectId: string): Promise<SentMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('id, project_id, subject, body, created_at')
    .eq('project_id', projectId)
    .eq('sender', 'assistant')
    .eq('type', 'qna_answer')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[BriefLab] replies fetch 실패:', error);
    return [];
  }
  return (data ?? []) as SentMessage[];
}

/**
 * 가장 최근 시안 피드백(draft_feedback) 본문을 가져온다.
 * 없으면 null 반환.
 */
export async function fetchProjectDraftFeedback(projectId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('body, content')
    .eq('project_id', projectId)
    .eq('sender', 'assistant')
    .eq('type', 'draft_feedback')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return (data.body || data.content) ?? null;
}

/**
 * 한 프로젝트의 시안 피드백을 모두 가져온다.
 * draft_feedback(최초 시안) + revision_feedback(재제출 시안) 두 타입을 포함,
 * created_at ASC 정렬 → 시안 제출 피드백 → 재제출 피드백 순서가 유지됨.
 * 에러 시 [] 반환 (throw 하지 않음).
 */
export async function fetchProjectFeedbacks(projectId: string): Promise<FeedbackMessage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('id, project_id, type, subject, body, content, created_at')
    .eq('project_id', projectId)
    .eq('sender', 'assistant')
    .in('type', ['draft_feedback', 'revision_feedback'])
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[BriefLab] feedbacks fetch 실패:', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id:         row.id as string,
    project_id: row.project_id as string,
    type:       row.type as 'draft_feedback' | 'revision_feedback',
    subject:    row.subject as string,
    body:       ((row.body || row.content) ?? '') as string,
    created_at: row.created_at as string,
  }));
}

/**
 * 사용자가 보낸 QnA 메시지를 messages 테이블에 INSERT한다.
 * 에러 시 null 반환 (throw 하지 않음).
 */
export async function insertUserMessage(
  projectId: string,
  subject: string,
  body: string,
): Promise<SentMessage | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .insert({
      project_id: projectId,
      sender: 'user',
      type: 'qna_question',
      subject,
      body,
      content: body,   // DB에 body·content 컬럼이 모두 NOT NULL
    })
    .select('id, project_id, subject, body, created_at')
    .single();

  if (error) {
    console.error('[BriefLab] message insert 실패:', error);
    return null;
  }
  return data as SentMessage;
}
