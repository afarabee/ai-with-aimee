-- Create admin chat history table for persistent memory
CREATE TABLE IF NOT EXISTS admin_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast session-based queries
CREATE INDEX idx_admin_chat_session ON admin_chat_history (session_id, created_at);

-- Enable RLS
ALTER TABLE admin_chat_history ENABLE ROW LEVEL SECURITY;

-- Allow all operations (behind password gate, no user auth)
CREATE POLICY "Allow all operations on admin_chat_history"
  ON admin_chat_history
  FOR ALL
  USING (true)
  WITH CHECK (true);