-- Drop admin chat history table and related objects
DROP POLICY IF EXISTS "Allow all operations on admin_chat_history" ON admin_chat_history;
DROP INDEX IF EXISTS idx_admin_chat_session;
DROP TABLE IF EXISTS admin_chat_history;