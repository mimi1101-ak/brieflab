-- Migration: add_messages_body_type_assistant
-- messages 테이블에 body, type 컬럼 추가 + sender 제약에 'assistant' 포함
-- Idempotent: 이미 컬럼이 있어도 안전하게 실행 가능

-- 1. body 컬럼 추가 (없을 때만)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'messages'
      AND column_name  = 'body'
  ) THEN
    ALTER TABLE messages ADD COLUMN body text NOT NULL DEFAULT '';
    -- 기존 행이 있는 경우 빈 문자열로 채워진 뒤 기본값 제거
    ALTER TABLE messages ALTER COLUMN body DROP DEFAULT;
  END IF;
END $$;

-- 2. type 컬럼 추가 (없을 때만)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'messages'
      AND column_name  = 'type'
  ) THEN
    ALTER TABLE messages ADD COLUMN type text NOT NULL DEFAULT 'qna_question';
    ALTER TABLE messages ALTER COLUMN type DROP DEFAULT;
    ALTER TABLE messages ADD CONSTRAINT messages_type_check
      CHECK (type IN ('brief_delivery', 'qna_question', 'qna_answer'));
  END IF;
END $$;

-- 3. sender 제약 업데이트 — 'assistant' 포함
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_check;
ALTER TABLE messages ADD CONSTRAINT messages_sender_check
  CHECK (sender IN ('client', 'user', 'assistant'));
