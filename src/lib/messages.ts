import { createClient } from '@/lib/supabase/client';
import type { SentMessage } from '@/components/brief/types';

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
    })
    .select('id, project_id, subject, body, created_at')
    .single();

  if (error) {
    console.error('[BriefLab] message insert 실패:', error);
    return null;
  }
  return data as SentMessage;
}
