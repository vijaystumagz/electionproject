import { describe, it, expect } from 'vitest';
import { chatLogic } from '../utils/logicEngine';
import { INITIAL_STATE } from '../constants';

describe('chatLogic state machine', () => {
  it('should have a valid initial state', () => {
    expect(chatLogic[INITIAL_STATE]).toBeDefined();
    expect(chatLogic[INITIAL_STATE].message).toBeTypeOf('string');
    expect(chatLogic[INITIAL_STATE].options).toBeInstanceOf(Array);
  });

  it('every state should have a non-empty message', () => {
    Object.entries(chatLogic).forEach(([key, state]) => {
      expect(state.message, `State "${key}" has no message`).toBeTruthy();
    });
  });

  it('every option nextState should resolve to a valid state', () => {
    Object.entries(chatLogic).forEach(([key, state]) => {
      if (state.options) {
        state.options.forEach((opt) => {
          expect(
            chatLogic[opt.nextState],
            `In state "${key}", option "${opt.label}" points to unknown state "${opt.nextState}"`
          ).toBeDefined();
        });
      }
    });
  });

  it('greeting state should have multiple options', () => {
    expect(chatLogic.greeting.options.length).toBeGreaterThan(1);
  });

  it('should transition from greeting to registered_check', () => {
    const option = chatLogic.greeting.options.find((o) => o.nextState === 'registered_check');
    expect(option).toBeDefined();
    expect(chatLogic.registered_check).toBeDefined();
  });

  it('should transition from registered_no to show_registration', () => {
    const option = chatLogic.registered_no.options.find((o) => o.nextState === 'show_registration');
    expect(option).toBeDefined();
    expect(chatLogic.show_registration).toBeDefined();
  });

  it('feedback_prompt state should exist and have valid options', () => {
    expect(chatLogic.feedback_prompt).toBeDefined();
    expect(chatLogic.feedback_prompt.options.length).toBeGreaterThan(0);
  });

  it('voter_id state should reference known next states', () => {
    chatLogic.voter_id.options.forEach((opt) => {
      expect(chatLogic[opt.nextState]).toBeDefined();
    });
  });
});
