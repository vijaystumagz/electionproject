/**
 * @file logicEngine.ts
 * @description The finite state machine (FSM) defining the chat flow and content for Elexia.
 */

/** Valid states in the chat conversation tree. */
export type StateKey = 
  | 'greeting' 
  | 'registered_check' 
  | 'registered_no' 
  | 'show_registration' 
  | 'registered_yes' 
  | 'knows_location' 
  | 'polling_location' 
  | 'timeline' 
  | 'voting_methods' 
  | 'mail_in' 
  | 'in_person' 
  | 'other_topics' 
  | 'voter_id' 
  | 'poll_worker' 
  | 'feedback_prompt' 
  | 'leave_feedback'
  | 'ask_ai';

/** Interface for a conversational response option. */
export interface Option {
  label: string;
  nextState: StateKey;
}

/** Interface for a single state's data/content. */
export interface StateData {
  /** The message text the bot will display. */
  message: string;
  /** List of buttons/options the user can click. */
  options: Option[];
  /** Optional: ID of a custom React component to render alongside the message. */
  component?: string;
  /** Optional: If true, the UI will show a free-text input field. */
  isInput?: boolean;
}

/** The full chat logic configuration object. */
export type ChatLogic = Record<StateKey, StateData>;

/** The state the assistant starts in when the app loads. */
export const INITIAL_STATE: StateKey = 'greeting';

/**
 * Static configuration of the Elexia Assistant's conversational states.
 * This acts as the source of truth for all guided paths.
 */
export const chatLogic: ChatLogic = {
  greeting: {
    message: "Hi there! I'm Elexia. I'm here to help you navigate the voting process. What do you need help with today?",
    options: [
      { label: "Am I registered?", nextState: "registered_check" },
      { label: "Ways to Vote", nextState: "voting_methods" },
      { label: "Find Polling Place", nextState: "polling_location" },
      { label: "Ask Elexia AI", nextState: "ask_ai" },
      { label: "Other Topics", nextState: "other_topics" }
    ]
  },
  ask_ai: {
    message: "I can help with complex questions using my AI brain. What would you like to ask me about the election?",
    isInput: true,
    options: [
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  registered_check: {
    message: "Are you currently registered to vote at your current address?",
    options: [
      { label: "Yes, I am", nextState: "registered_yes" },
      { label: "No, I'm not sure", nextState: "registered_no" }
    ]
  },
  registered_no: {
    message: "No problem! Registering is the first step. You usually need to be 18, a citizen, and meet state residency requirements. Do you want to learn how to register?",
    options: [
      { label: "Show me how", nextState: "show_registration" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  show_registration: {
    message: "You can register online, by mail, or in-person at your local election office. Most states have an online portal.",
    options: [
      { label: "View Key Dates", nextState: "timeline" },
      { label: "Ways to Vote", nextState: "voting_methods" }
    ]
  },
  registered_yes: {
    message: "Awesome! Being registered is half the battle. Do you know where your polling location is?",
    options: [
      { label: "Yes, I do", nextState: "knows_location" },
      { label: "No, help me find it", nextState: "polling_location" }
    ]
  },
  knows_location: {
    message: "Perfect. It sounds like you are well prepared! What else would you like to explore?",
    options: [
      { label: "Voting Methods", nextState: "voting_methods" },
      { label: "Voter ID Laws", nextState: "voter_id" }
    ]
  },
  polling_location: {
    message: "Let's find your polling location.",
    component: 'PollingLocator',
    options: [
      { label: "Ways to Vote", nextState: "voting_methods" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  timeline: {
    message: "Here are the key dates for the upcoming election.",
    component: 'Timeline',
    options: [
      { label: "Ways to Vote", nextState: "voting_methods" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  voting_methods: {
    message: "There are three main ways to cast your ballot. Which one are you interested in?",
    component: 'VotingMethods',
    options: [
      { label: "Tell me about Mail-in", nextState: "mail_in" },
      { label: "In-Person Voting", nextState: "in_person" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  mail_in: {
    message: "Mail-in (or absentee) voting allows you to vote from home. You must request a ballot in advance. Make sure to sign the envelope exactly as you signed your registration!",
    options: [
      { label: "View Deadlines", nextState: "timeline" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  in_person: {
    message: "For in-person voting, you can often vote early or on Election Day. Lines are usually shorter during Early Voting.",
    options: [
      { label: "Find Polling Place", nextState: "polling_location" },
      { label: "Voter ID Requirements", nextState: "voter_id" }
    ]
  },
  other_topics: {
    message: "Here are some other topics I can help with:",
    options: [
      { label: "Voter ID Laws", nextState: "voter_id" },
      { label: "Volunteer as Poll Worker", nextState: "poll_worker" },
      { label: "Leave Feedback", nextState: "feedback_prompt" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  voter_id: {
    message: "Voter ID laws vary by state. Over 30 states require some form of ID at the polls. Often, a driver's license, passport, or state ID is accepted. It's best to check your local state office website for specifics.",
    options: [
      { label: "Find Polling Place", nextState: "polling_location" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  poll_worker: {
    message: "That's fantastic! Poll workers are essential to democracy. You generally get paid for your time, and it's a great way to serve your community. You can sign up through your county election board.",
    options: [
      { label: "View Key Dates", nextState: "timeline" },
      { label: "Main Menu", nextState: "greeting" }
    ]
  },
  feedback_prompt: {
    message: "I hope I was able to help! Would you like to leave any feedback about this assistant?",
    options: [
      { label: "Yes, leave feedback", nextState: "leave_feedback" },
      { label: "No, return to Menu", nextState: "greeting" }
    ]
  },
  leave_feedback: {
    message: "We appreciate your thoughts! Please enter your feedback below.",
    component: 'FeedbackForm',
    options: [
      { label: "Main Menu", nextState: "greeting" }
    ]
  }
};
