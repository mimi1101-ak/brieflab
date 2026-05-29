-- Migration: add_assistant_sender
-- messages.sender 체크 제약에 'assistant' 추가 (AI 자동 답장 저장용)

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_check;
ALTER TABLE messages ADD CONSTRAINT messages_sender_check
  CHECK (sender IN ('client', 'user', 'assistant'));
