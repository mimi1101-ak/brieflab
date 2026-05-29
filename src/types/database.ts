// Hand-written types matching the 20260526120000 migration.
// Regenerate with: npm run db:types

export type Field = 'detail' | 'web' | 'brand' | 'app'
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard'
export type ProjectStatus = 'draft' | 'active' | 'completed' | 'rejected'
export type CurrentStep = 'receive' | 'qna' | 'draft_submit' | 'feedback' | 'deliver'
export type StepIndex = 0 | 1 | 2 | 3 | 4
export type MessageSender = 'client' | 'user' | 'assistant'
export type MessageType = 'brief_delivery' | 'qna_question' | 'qna_answer'

// Internal shape of style_preferences jsonb — finalized in A-2
export type StylePreferences = Record<string, unknown>

// Internal shape of brief_content jsonb — finalized in A-2
// Will contain 7 sections: sender, project, target, direction, deliverables, schedule, notes
export type BriefContent = Record<string, unknown>

export interface ProjectRow {
  id: string
  user_id: string
  title: string
  field: Field
  difficulty: Difficulty
  duration: string
  client_type: string | null
  budget: string | null
  style_preferences: StylePreferences
  brief_content: BriefContent
  status: ProjectStatus
  current_step: CurrentStep
  step_index: StepIndex
  deadline: string | null  // ISO date string (YYYY-MM-DD)
  persona_id: string | null
  project_template_id: string | null
  created_at: string       // ISO timestamptz string
  updated_at: string       // ISO timestamptz string
}

export interface MessageRow {
  id: string
  project_id: string
  sender: MessageSender
  type: MessageType
  subject: string
  body: string
  created_at: string       // ISO timestamptz string
}

// ─── Supabase client generic types ───────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow
        Insert: Omit<ProjectRow, 'id' | 'created_at' | 'updated_at' | 'persona_id' | 'project_template_id'> & {
          id?: string
          status?: ProjectStatus
          current_step?: CurrentStep
          step_index?: StepIndex
          style_preferences?: StylePreferences
          brief_content?: BriefContent
          persona_id?: string | null
          project_template_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<ProjectRow, 'id' | 'created_at'>>
      }
      messages: {
        Row: MessageRow
        Insert: Omit<MessageRow, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<MessageRow, 'id' | 'created_at'>>
      }
    }
  }
}
