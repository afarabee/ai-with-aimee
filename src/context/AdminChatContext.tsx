import { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AdminChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

const AdminChatContext = createContext<AdminChatContextType | null>(null);

export function AdminChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <AdminChatContext.Provider value={{ isOpen, setIsOpen, messages, setMessages }}>
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
