import React, { useState, useEffect, useRef, useCallback, ReactElement, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Volume2, VolumeX, Send } from 'lucide-react';
import { chatLogic, StateKey, Option } from '../utils/logicEngine';
import { INITIAL_STATE, SENDER, COMPONENTS, ARIA } from '../constants';
import { getAIResponse } from '../utils/ai';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import OptionButton from './OptionButton';
import Timeline from './Timeline';
import PollingLocator from './PollingLocator';
import VotingMethods from './VotingMethods';
import FeedbackForm from './FeedbackForm';

interface Message {
  id: string;
  sender: string;
  text: string;
  component?: string;
  options?: Option[] | null;
  isInput?: boolean;
}

const Assistant: React.FC = (): ReactElement => {
  const [history, setHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const speakText = useCallback((text: string): void => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [ttsEnabled]);

  const addBotMessage = useCallback((stateKey: StateKey): void => {
    setIsTyping(true);
    setTimeout(() => {
      const stateData = chatLogic[stateKey];
      if (!stateData) return;

      setHistory((prev) => [
        ...prev,
        {
          id: `${Date.now()}-bot`,
          sender: SENDER.BOT,
          text: stateData.message,
          component: stateData.component,
          options: stateData.options,
          isInput: stateData.isInput,
        },
      ]);
      setIsTyping(false);
      speakText(stateData.message);
    }, 800);
  }, [speakText]);

  useEffect(() => {
    addBotMessage(INITIAL_STATE);
  }, [addBotMessage]);

  useEffect(() => {
    if (history.length > 1 || (isTyping && history.length > 0)) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [history, isTyping]);

  const handleOptionClick = useCallback((option: Option): void => {
    setHistory((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastMsg = updated[updated.length - 1];
        updated[updated.length - 1] = { ...lastMsg, options: null, isInput: false };
      }
      return [
        ...updated,
        { id: `${Date.now()}-user`, sender: SENDER.USER, text: option.label },
      ];
    });
    addBotMessage(option.nextState);
  }, [addBotMessage]);

  const handleAISubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const query = userInput.trim();
    setUserInput('');

    setHistory((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastMsg = updated[updated.length - 1];
        updated[updated.length - 1] = { ...lastMsg, options: null, isInput: false };
      }
      return [
        ...updated,
        { id: `${Date.now()}-user`, sender: SENDER.USER, text: query },
      ];
    });

    setIsTyping(true);
    const aiResponse = await getAIResponse(query);
    
    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-bot`,
        sender: SENDER.BOT,
        text: aiResponse,
        options: [{ label: "Back to Menu", nextState: "greeting" }],
        isInput: false,
      },
    ]);
    setIsTyping(false);
    speakText(aiResponse);
  };

  const toggleTts = (): void => {
    setTtsEnabled((prev) => {
      if (prev && window.speechSynthesis) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  const lastMessage = history[history.length - 1];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <section
        className="glass-panel"
        style={{ maxWidth: '800px', margin: '0 auto', height: '620px', display: 'flex', flexDirection: 'column' }}
        aria-label={ARIA.CHAT_LABEL}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        </div>

        {/* Chat Area */}
        <div
          ref={chatContainerRef}
          role="log"
          aria-live="polite"
          aria-label={ARIA.CHAT_LABEL}
          style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <AnimatePresence>
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

                {/* Dynamic Component Rendering */}
                {msg.component === COMPONENTS.TIMELINE && <div style={{ marginTop: '10px' }}><Timeline /></div>}
                {msg.component === COMPONENTS.POLLING_LOCATOR && <div style={{ marginTop: '10px' }}><PollingLocator /></div>}
                {msg.component === COMPONENTS.VOTING_METHODS && <div style={{ marginTop: '10px' }}><VotingMethods /></div>}
                {msg.component === COMPONENTS.FEEDBACK_FORM && <div style={{ marginTop: '10px' }}><FeedbackForm /></div>}

                {/* Option Buttons */}
                {msg.options && msg.sender === SENDER.BOT && (
                  <div
                    role="group"
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
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
        </div>

        {/* AI Input Area */}
        {lastMessage?.isInput && !isTyping && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAISubmit}
            style={{
              padding: '20px',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question here..."
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
            <button type="submit" className="btn btn-primary" disabled={!userInput.trim()}>
              <Send size={18} />
            </button>
          </motion.form>
        )}
      </section>
    </div>
  );
};

export default Assistant;
