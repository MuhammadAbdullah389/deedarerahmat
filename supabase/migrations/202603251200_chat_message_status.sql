-- Chat message status enhancements: delivered + seen

ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS seen_at TIMESTAMPTZ NULL;

CREATE INDEX IF NOT EXISTS idx_chat_messages_status_lookup
  ON public.chat_messages(conversation_id, sender_role, is_read, delivered_at, seen_at);