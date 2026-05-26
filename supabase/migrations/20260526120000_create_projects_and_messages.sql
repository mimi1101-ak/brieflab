-- Migration: create_projects_and_messages
-- Creates projects and messages tables with indexes, RLS, and updated_at trigger.
-- Idempotent: safe to run multiple times.

-- ─────────────────────────────────────────────
-- 1. updated_at trigger function (shared)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────
-- 2. projects table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title            text        NOT NULL,
  field            text        NOT NULL CHECK (field IN ('detail', 'web', 'brand', 'app')),
  difficulty       text        NOT NULL CHECK (difficulty IN ('beginner', 'easy', 'medium', 'hard')),
  duration         text        NOT NULL,
  client_type      text,
  budget           text,
  style_preferences jsonb      NOT NULL DEFAULT '{}'::jsonb,
  brief_content    jsonb       NOT NULL DEFAULT '{}'::jsonb,
  status           text        NOT NULL DEFAULT 'active'
                               CHECK (status IN ('draft', 'active', 'completed', 'rejected')),
  current_step     text        NOT NULL DEFAULT 'receive'
                               CHECK (current_step IN ('receive', 'qna', 'draft_submit', 'feedback', 'deliver')),
  step_index       integer     NOT NULL DEFAULT 0 CHECK (step_index BETWEEN 0 AND 4),
  deadline         date,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 3. messages table
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender      text        NOT NULL CHECK (sender IN ('client', 'user')),
  type        text        NOT NULL CHECK (type IN ('brief_delivery', 'qna_question', 'qna_answer')),
  subject     text        NOT NULL,
  body        text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 4. Indexes
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_user_created
  ON projects (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_project_created
  ON messages (project_id, created_at ASC);

-- ─────────────────────────────────────────────
-- 5. updated_at trigger on projects
-- ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- 6. Row Level Security
-- ─────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- projects policies
DROP POLICY IF EXISTS "projects_select" ON projects;
CREATE POLICY "projects_select" ON projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_insert" ON projects;
CREATE POLICY "projects_insert" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_update" ON projects;
CREATE POLICY "projects_update" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_delete" ON projects;
CREATE POLICY "projects_delete" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- messages policies (access gated through project ownership)
DROP POLICY IF EXISTS "messages_select" ON messages;
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
        AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert" ON messages;
CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
        AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_update" ON messages;
CREATE POLICY "messages_update" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
        AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_delete" ON messages;
CREATE POLICY "messages_delete" ON messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
        AND projects.user_id = auth.uid()
    )
  );
