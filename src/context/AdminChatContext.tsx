import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  created_at?: string;
}

interface AdminChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  saveMessage: (role: 'user' | 'assistant', content: string) => Promise<void>;
  sessionId: string;
  hasUnread: boolean;
  setHasUnread: (unread: boolean) => void;
  pendingIntent: string | null;
  setPendingIntent: (intent: string | null) => void;
}

const AdminChatContext = createContext<AdminChatContextType | null>(null);

export function AdminChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [hasUnread, setHasUnread] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<string | null>(null);

  // Initialize or load session ID
  useEffect(() => {
    const storedId = localStorage.getItem('adminChatSession');
    if (storedId) {
      setSessionId(storedId);
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem('adminChatSession', newId);
      setSessionId(newId);
    }
  }, []);

  // Load persisted messages from Supabase
  useEffect(() => {
    if (!sessionId) return;
    
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('admin_chat_history')
        .select('role, content, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (data && !error) {
        const loadedMessages = data.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
          created_at: msg.created_at,
        }));
        setMessages(loadedMessages);
      }
    };

    loadMessages();
  }, [sessionId]);

  // Save message to both state and Supabase
  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    const msg: Message = { 
      role, 
      content, 
      timestamp: new Date() 
    };
    
    // Optimistic UI update
    setMessages(prev => [...prev, msg]);

    // Persist to Supabase
    try {
      await supabase.from('admin_chat_history').insert([{ 
        session_id: sessionId, 
        role, 
        content 
      }]);

      // Set unread if assistant replies while panel closed
      if (role === 'assistant' && !isOpen) {
        setHasUnread(true);
      }
    } catch (error) {
      console.error('Failed to save message to Supabase:', error);
    }
  };

  return (
    <AdminChatContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      messages, 
      setMessages, 
      saveMessage, 
      sessionId,
      hasUnread,
      setHasUnread,
      pendingIntent,
      setPendingIntent
    }}>
      {children}
    </AdminChatContext.Provider>
  );
}

export const useAdminChat = () => {
  const context = useContext(AdminChatContext);
  if (!context) {
    throw new Error('useAdminChat must be used within AdminChatProvider');
  }
  return context;
};
