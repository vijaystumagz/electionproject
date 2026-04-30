import React from 'react';
import { Bot, User } from 'lucide-react';
import { SENDER, ARIA } from '../constants';

interface MessageBubbleProps {
  sender: string;
  text: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text }) => {
  const isUser = sender === SENDER.USER;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isUser ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          flexShrink: 0,
        }}
      >
        {isUser
          ? <User size={18} color="var(--primary)" aria-label={ARIA.USER_AVATAR} />
          : <Bot size={18} color="var(--text-primary)" aria-label={ARIA.BOT_AVATAR} />
        }
      </div>

      <div
        className={`message-bubble ${isUser ? 'message-user' : 'message-bot'}`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {text}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
