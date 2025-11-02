import { MessageCircle } from 'lucide-react';
import { useAdminChat } from '@/context/AdminChatContext';
import { useEffect } from 'react';

export default function AdminChatOrb() {
  const { isOpen, setIsOpen, messages, hasUnread, setHasUnread } = useAdminChat();

  // Track unread messages when panel is closed
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setHasUnread(true);
      }
    }
  }, [messages, isOpen, setHasUnread]);

  if (isOpen) return null;

  return (
    <button
      onClick={() => {
        setIsOpen(true);
        setHasUnread(false);
      }}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-[999]
        ${hasUnread ? 'glow-pulse' : ''}`}
      style={{
        background: 'rgba(26, 11, 46, 0.8)',
        border: '2px solid #00ffff',
        boxShadow: hasUnread
          ? '0 0 25px #00ffff, 0 0 40px #f50ca0'
          : '0 0 12px #00ffff88',
        backdropFilter: 'blur(8px)',
      }}
      aria-label="Open Admin Copilot"
    >
      <MessageCircle className="w-6 h-6 text-cyan-300" />
    </button>
  );
}
