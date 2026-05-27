export interface BriefForm {
  field: string | null;
  difficulty: string | null;
  duration: string | null;
  client: string | null;
  budget: string | null;
  styles: string[];
  refUrl: string;
  avoid: string;
}

export interface Persona {
  company: string;
  name: string;
  title: string;
  email: string;
  phone: string;
}

export interface BriefData {
  persona: Persona;
  project: { name: string; purpose: string };
  dates: { kickoff: string; mid: string; final: string };
  target: { age: string; gender: string; lifestyle: string };
  emotion: string;
  deliverable: string;
  budget: string;
  difficulty: string;
  fieldLabel: string;
  durationLabel: string;
  styleLabels: string;
  refUrl: string;
  avoid: string;
}

export interface Lookup {
  field: Record<string, string>;
  difficulty: Record<string, string>;
  duration: Record<string, string>;
  client: Record<string, string>;
  budget: Record<string, string>;
  styles: Record<string, string>;
}

/**
 * 보낸 메일 1건 — DB messages 테이블의 subset.
 * sender='user', type='qna_question' 인 행을 매핑한다.
 * created_at: ISO string (DB 값) — 로컬 낙관적 레코드도 new Date().toISOString() 사용
 */
export interface SentMessage {
  id: string;
  project_id: string;
  subject: string;
  body: string;
  created_at: string;
}
