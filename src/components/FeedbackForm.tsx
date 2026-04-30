import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../utils/firebase';
import { FEEDBACK_MAX_LENGTH } from '../constants';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Sanitizes user input: trims whitespace, strips dangerous HTML characters.
 */
const sanitize = (str: string): string =>
  str
    .trim()
    .slice(0, FEEDBACK_MAX_LENGTH)
    .replace(/[<>"'&]/g, (c) => ({
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;'
    }[c] || c));

const FeedbackForm: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [validationError, setValidationError] = useState<string>('');

  const remaining = FEEDBACK_MAX_LENGTH - text.length;

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const clean = sanitize(text);

    if (!clean) {
      setValidationError('Feedback cannot be empty.');
      return;
    }
    if (clean.length < 5) {
      setValidationError('Please enter at least 5 characters.');
      return;
    }

    setValidationError('');
    setStatus('submitting');
    const success = await submitFeedback(clean);
    setStatus(success ? 'success' : 'error');
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
    setValidationError('');
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
        role="status"
        aria-live="polite"
        style={{
          padding: '20px', display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)',
        }}
      >
        <CheckCircle color="#10b981" aria-hidden="true" />
        <span style={{ color: '#10b981', fontWeight: 500 }}>Thank you! Your feedback has been saved.</span>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card"
      style={{ padding: '20px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      noValidate
      aria-label="Feedback form"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="feedback-input" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Your feedback
        </label>
        <textarea
          id="feedback-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Tell us what you think... (min. 5 characters)"
          maxLength={FEEDBACK_MAX_LENGTH}
          aria-describedby={validationError ? 'feedback-error' : 'feedback-hint'}
          aria-invalid={!!validationError}
          style={{
            width: '100%', minHeight: '100px', padding: '12px',
            background: 'var(--bg-surface)',
            border: `1px solid ${validationError ? '#ef4444' : 'var(--border-light)'}`,
            borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
            fontFamily: 'inherit', resize: 'vertical', outline: 'none',
          }}
        />
        <div
          id="feedback-hint"
          style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}
        >
          <span>Max {FEEDBACK_MAX_LENGTH} characters</span>
          <span aria-live="polite">{remaining} remaining</span>
        </div>
      </div>

      {validationError && (
        <p id="feedback-error" role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={14} aria-hidden="true" /> {validationError}
        </p>
      )}

      {status === 'error' && (
        <p role="alert" style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>
          Failed to submit. Please try again.
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === 'submitting' || !text.trim()}
        aria-disabled={status === 'submitting' || !text.trim()}
        style={{ width: '100%' }}
      >
        {status === 'submitting'
          ? 'Submitting...'
          : <><Send size={16} aria-hidden="true" /> Submit Feedback</>
        }
      </button>
    </form>
  );
};

export default React.memo(FeedbackForm);
