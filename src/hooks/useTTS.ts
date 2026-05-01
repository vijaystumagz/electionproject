import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing Text-to-Speech (TTS) functionality.
 * Provides a toggle and a speak function.
 */
export const useTTS = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      if (prev && synthRef.current) {
        synthRef.current.cancel();
      }
      return !prev;
    });
  }, []);

  const speak = useCallback((text: string) => {
    if (!isEnabled || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synthRef.current.speak(utterance);
  }, [isEnabled]);

  return { isEnabled, toggle, speak };
};
