import { useState, useCallback } from 'react';
import { getAIResponse as fetchAIResponse } from '../utils/ai';

/**
 * Custom hook for interacting with the Gemini AI engine.
 * Handles loading state and error reporting.
 */
export const useAI = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getResponse = useCallback(async (prompt: string): Promise<string> => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetchAIResponse(prompt);
      return response;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown AI error';
      setError(msg);
      return "I'm sorry, my AI brain is resting right now. Please try again later.";
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { getResponse, isProcessing, error };
};
