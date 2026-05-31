-- Migration: add_feedback_message_types
-- messages.type CHECK 제약에 draft_feedback, revision_feedback 두 값을 추가한다.
-- messages.content 컬럼이 없는 경우 NOT NULL로 추가한다. (20260529 마이그레이션 누락분)
--
-- ⚠️  이 파일은 Supabase Studio > SQL Editor 에서 직접 실행하세요.
--    코드(Next.js)가 자동으로 적용하지 않습니다.
-- Idempotent: 이미 적용된 환경에서 재실행해도 안전합니다.

-- ─────────────────────────────────────────────────────────────
-- 1. messages.type CHECK 제약 재정의
--    기존: ('brief_delivery', 'qna_question', 'qna_answer')
--    변경 후: 위 3개 + 'draft_feedback', 'revision_feedback'
-- ─────────────────────────────────────────────────────────────
ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_type_check;

ALTER TABLE messages
  ADD CONSTRAINT messages_type_check
  CHECK (type IN (
    'brief_delivery',
    'qna_question',
    'qna_answer',
    'draft_feedback',
    'revision_feedback'
  ));

-- ─────────────────────────────────────────────────────────────
-- 2. messages.content 컬럼 추가 (없을 때만)
--    코드에서 INSERT 시 body·content 두 컬럼을 모두 사용하므로 필요
-- ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'messages'
      AND column_name  = 'content'
  ) THEN
    ALTER TABLE messages ADD COLUMN content text NOT NULL DEFAULT '';
    ALTER TABLE messages ALTER COLUMN content DROP DEFAULT;
  END IF;
END $$;
