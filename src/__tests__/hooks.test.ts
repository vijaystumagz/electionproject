import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTTS } from '../hooks/useTTS';
import { useAI } from '../hooks/useAI';

// Mock SpeechSynthesis and SpeechSynthesisUtterance
const mockSpeak = vi.fn();
const mockCancel = vi.fn();

if (typeof window !== 'undefined') {
  (window as any).speechSynthesis = {
    speak: mockSpeak,
    cancel: mockCancel,
    getVoices: () => [],
  };
  
  // Define SpeechSynthesisUtterance globally for the test environment
  (global as any).SpeechSynthesisUtterance = class {
    text: string = '';
    rate: number = 1.0;
    pitch: number = 1.0;
    constructor(text: string) {
      this.text = text;
    }
  };
}

// Mock AI utility
vi.mock('../utils/ai', () => ({
  getAIResponse: vi.fn().mockResolvedValue('Mock AI Response'),
}));

describe('Custom Hooks', () => {
  describe('useTTS', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('initializes with TTS disabled', () => {
      const { result } = renderHook(() => useTTS());
      expect(result.current.isEnabled).toBe(false);
    });

    it('toggles TTS state', () => {
      const { result } = renderHook(() => useTTS());
      act(() => {
        result.current.toggle();
      });
      expect(result.current.isEnabled).toBe(true);
    });

    it('calls speak when enabled', () => {
      const { result } = renderHook(() => useTTS());
      act(() => {
        result.current.toggle(); // Enable
      });
      act(() => {
        result.current.speak('Hello');
      });
      expect(mockSpeak).toHaveBeenCalled();
    });

    it('does not call speak when disabled', () => {
      const { result } = renderHook(() => useTTS());
      act(() => {
        result.current.speak('Hello');
      });
      expect(mockSpeak).not.toHaveBeenCalled();
    });
  });

  describe('useAI', () => {
    it('handles successful AI response', async () => {
      const { result } = renderHook(() => useAI());
      let response;
      await act(async () => {
        response = await result.current.getResponse('Test prompt');
      });
      expect(response).toBe('Mock AI Response');
      expect(result.current.isProcessing).toBe(false);
    });

    it('handles AI error gracefully', async () => {
      const { getAIResponse } = await import('../utils/ai');
      (getAIResponse as any).mockRejectedValueOnce(new Error('API Down'));
      
      const { result } = renderHook(() => useAI());
      let response;
      await act(async () => {
        response = await result.current.getResponse('Test prompt');
      });
      expect(response).toContain('resting');
      expect(result.current.error).toBe('API Down');
    });
  });
});
