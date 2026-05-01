import React, { useRef, useEffect, ReactElement, FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Volume2, VolumeX, Send } from 'lucide-react';
import { Option } from '../utils/logicEngine';
import { SENDER, COMPONENTS, ARIA } from '../constants';

// Hooks
import { useChat } from '../hooks/useChat';
import { useAI } from '../hooks/useAI';
import { useTTS } from '../hooks/useTTS';

// Components
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import OptionButton from './OptionButton';
import Timeline from './Timeline';
import PollingLocator from './PollingLocator';
import VotingMethods from './VotingMethods';
import FeedbackForm from './FeedbackForm';

/**
 * The primary Chat Interface component.
 * Orchestrates the user journey using custom hooks for state, AI, and TTS.
 */
const Assistant: React.FC = (): ReactElement => {
  const [userInput, setUserInput] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize modular features
  const { isEnabled: ttsEnabled, toggle: toggleTts, speak } = useTTS();
  const { getResponse: getAIResponse, isProcessing: isAIProcessing } = useAI();
  const { 
    history, 
    isTyping, 
    addBotMessage, 
    addUserMessage, 
    addAIResponse 
  } = useChat(speak);

  // Auto-scroll logic
  useEffect(() => {
    if (history.length > 0) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history, isTyping, isAIProcessing]);

  /**
   * Handles button clicks from the state machine logic.
   */
  const handleOptionClick = (option: Option): void => {
    addUserMessage(option.label);
    addBotMessage(option.nextState);
  };

  /**
   * Handles free-text submission for the AI chat state.
   */
  const handleAISubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const query = userInput.trim();
    setUserInput('');
    addUserMessage(query);

    const aiResponse = await getAIResponse(query);
    addAIResponse(aiResponse);
  };

  const lastMessage = history[history.length - 1];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <section
        className="glass-panel"
        style={{ maxWidth: '800px', margin: '0 auto', height: '620px', display: 'flex', flexDirection: 'column' }}
        aria-label={ARIA.CHAT_LABEL}
      >
        {/* Header Section */}
        <header style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '50%' }} aria-hidden="true">
              <Bot size={24} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Elexia Assistant</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your smart voting guide</p>
            </div>
          </div>

          <button
            onClick={toggleTts}
            className="btn btn-outline"
            style={{ padding: '8px', borderRadius: '50%' }}
            aria-label={ttsEnabled ? ARIA.TTS_DISABLE : ARIA.TTS_ENABLE}
            aria-pressed={ttsEnabled}
          >
            {ttsEnabled
              ? <Volume2 size={18} className="text-gradient" aria-hidden="true" />
              : <VolumeX size={18} color="var(--text-muted)" aria-hidden="true" />
            }
          </button>
        </header>

        {/* Chat Conversation Area */}
        <div
          ref={chatContainerRef}
          role="log"
          aria-live="polite"
          aria-label={ARIA.CHAT_LABEL}
          style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <AnimatePresence mode="popLayout">
            {history.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === SENDER.USER ? 'flex-end' : 'flex-start',
                  gap: '8px',
                }}
              >
                <MessageBubble sender={msg.sender} text={msg.text} />

                {/* Dynamic Component Injection */}
                {msg.component === COMPONENTS.TIMELINE && <div style={{ marginTop: '10px' }}><Timeline /></div>}
                {msg.component === COMPONENTS.POLLING_LOCATOR && <div style={{ marginTop: '10px' }}><PollingLocator /></div>}
                {msg.component === COMPONENTS.VOTING_METHODS && <div style={{ marginTop: '10px' }}><VotingMethods /></div>}
                {msg.component === COMPONENTS.FEEDBACK_FORM && <div style={{ marginTop: '10px' }}><FeedbackForm /></div>}

                {/* Inline Options (Buttons) */}
                {msg.options && msg.sender === SENDER.BOT && (
                  <nav
                    aria-label="Response options"
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}
                  >
                    {msg.options.map((opt, idx) => (
                      <OptionButton
                        key={`${opt.nextState}-${idx}`}
                        label={opt.label}
                        index={idx}
                        onClick={() => handleOptionClick(opt)}
                      />
                    ))}
                  </nav>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {(isTyping || isAIProcessing) && <TypingIndicator />}
        </div>

        {/* AI Input Form (only visible in input states) */}
        {lastMessage?.isInput && !isTyping && !isAIProcessing && (
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderTop: '1px solid var(--border-light)', background: 'rgba(255, 255, 255, 0.02)' }}
          >
            <form
              onSubmit={handleAISubmit}
              style={{ padding: '20px', display: 'flex', gap: '12px' }}
              aria-label="AI Question Form"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask anything about the election..."
                aria-label="Type your question"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={!userInput.trim()}
                aria-label="Send message"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
          </motion.footer>
        )}
      </section>
    </div>
  );
};

export default Assistant;
