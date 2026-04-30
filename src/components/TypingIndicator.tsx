import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    aria-label="Elexia is typing"
    role="status"
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        aria-hidden="true"
        style={{
          width: '36px', height: '36px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <Bot size={18} color="var(--text-primary)" />
      </div>
      <div className="message-bubble message-bot" style={{ display: 'flex', gap: '4px' }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay }}
          >
            •
          </motion.span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default React.memo(TypingIndicator);
