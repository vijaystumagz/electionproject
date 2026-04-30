// src/constants/index.js
// Central store for all application constants — avoids magic strings throughout codebase

export const INITIAL_STATE = 'greeting';

export const SENDER = {
  BOT: 'bot',
  USER: 'user',
};

export const COMPONENTS = {
  TIMELINE: 'Timeline',
  POLLING_LOCATOR: 'PollingLocator',
  VOTING_METHODS: 'VotingMethods',
  FEEDBACK_FORM: 'FeedbackForm',
};

export const FEEDBACK_MAX_LENGTH = 500;

export const ARIA = {
  CHAT_LABEL: 'Elexia Election Assistant Chat',
  TTS_ENABLE: 'Enable voice read-aloud',
  TTS_DISABLE: 'Disable voice read-aloud',
  BOT_AVATAR: 'Elexia bot',
  USER_AVATAR: 'You',
  OPTION_SUFFIX: 'option',
};
