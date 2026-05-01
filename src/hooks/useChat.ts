import { useState, useCallback, useRef, useEffect } from 'react';
import { chatLogic, StateKey, Option } from '../utils/logicEngine';
import { INITIAL_STATE, SENDER } from '../constants';

export interface Message {
  id: string;
  sender: string;
  text: string;
  component?: string;
  options?: Option[] | null;
  isInput?: boolean;
}

/**
 * The core hook for managing the Election Assistant's chat state.
 * Orchestrates message history, bot logic transitions, and typing indicators.
 */
export const useChat = (onBotMessage: (text: string) => void) => {
  const [history, setHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const isInitialized = useRef(false);

  const addBotMessage = useCallback((stateKey: StateKey) => {
    setIsTyping(true);
    
    // Artificial delay for realism
    setTimeout(() => {
      const stateData = chatLogic[stateKey];
      if (!stateData) return;

      const newMessage: Message = {
        id: `${Date.now()}-bot`,
        sender: SENDER.BOT,
        text: stateData.message,
        component: stateData.component,
        options: stateData.options,
        isInput: stateData.isInput,
      };

      setHistory((prev) => [...prev, newMessage]);
      setIsTyping(false);
      onBotMessage(stateData.message);
    }, 800);
  }, [onBotMessage]);

  // Handle free-form AI response insertion
  const addAIResponse = useCallback((text: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-bot-ai`,
      sender: SENDER.BOT,
      text,
      options: [{ label: "Back to Menu", nextState: "greeting" }],
      isInput: false,
    };
    setHistory((prev) => [...prev, newMessage]);
    onBotMessage(text);
  }, [onBotMessage]);

  const addUserMessage = useCallback((text: string) => {
    setHistory((prev) => {
      const updated = [...prev];
      // Clean up previous options/inputs to prevent double interaction
      if (updated.length > 0) {
        const lastMsg = updated[updated.length - 1];
        updated[updated.length - 1] = { ...lastMsg, options: null, isInput: false };
      }
      return [
        ...updated,
        { id: `${Date.now()}-user`, sender: SENDER.USER, text },
      ];
    });
  }, []);

  // Initialize chat
  useEffect(() => {
    if (!isInitialized.current) {
      addBotMessage(INITIAL_STATE);
      isInitialized.current = true;
    }
  }, [addBotMessage]);

  return {
    history,
    isTyping,
    addBotMessage,
    addUserMessage,
    addAIResponse,
  };
};
