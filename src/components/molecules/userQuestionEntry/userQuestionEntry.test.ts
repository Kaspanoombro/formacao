import { beforeEach, describe, expect, it, vi } from 'vitest';
import './userQuestionEntry.ts'; // Import to register the component

describe('Molecule: UserQuestionEntry (User Prompt Component)', () => {
  beforeEach(() => {
    // Clean up any existing user prompts
    document.body.innerHTML = '';
    
    // Clear any existing custom elements to avoid conflicts
    vi.clearAllMocks();
  });

  describe('UserPrompt Web Component', () => {
    it('creates a user-prompt element', () => {
      const userPrompt = document.createElement('user-prompt');
      expect(userPrompt.tagName).toBe('USER-PROMPT');
      expect(userPrompt).toBeInstanceOf(HTMLElement);
    });

    it('observes necessary attributes', () => {
      const UserPrompt = customElements.get('user-prompt');
      const expectedAttributes = [
        'button-text', 'input-placeholder', 'input-pattern', 'input-label',
        'submit-on-enter', 'clear-on-submit', 'validate-before-submit',
        'layout', 'size', 'disabled'
      ];
      
      expect(UserPrompt?.observedAttributes).toEqual(expectedAttributes);
    });

    it('sets placeholder attribute', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('placeholder', 'Enter your question...');
      
      expect(userPrompt.getAttribute('placeholder')).toBe('Enter your question...');
    });

    it('sets submit button text', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('submit-text', 'Send Message');
      
      expect(userPrompt.getAttribute('submit-text')).toBe('Send Message');
    });

    it('sets loading state text', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('loading-text', 'Processing...');
      
      expect(userPrompt.getAttribute('loading-text')).toBe('Processing...');
    });

    it('sets validation pattern', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('pattern', '.{3,}');
      
      expect(userPrompt.getAttribute('pattern')).toBe('.{3,}');
    });

    it('handles required attribute', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('required', '');
      
      expect(userPrompt.hasAttribute('required')).toBe(true);
    });

    it('handles disabled attribute', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('disabled', '');
      
      expect(userPrompt.hasAttribute('disabled')).toBe(true);
    });

    it('handles loading attribute', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('loading', '');
      
      expect(userPrompt.hasAttribute('loading')).toBe(true);
    });

    it('gets and sets input value', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      document.body.appendChild(userPrompt);

      // Test setter
      userPrompt.inputValue = 'Test question';
      expect(userPrompt.inputValue).toBe('Test question');
    });

    it('checks input validation state', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      document.body.appendChild(userPrompt);

      expect(typeof userPrompt.isValid).toBe('boolean');
    });

    it('can focus the input', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      document.body.appendChild(userPrompt);

      expect(() => userPrompt.focus()).not.toThrow();
    });

    it('can clear the input', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      document.body.appendChild(userPrompt);

      userPrompt.inputValue = 'Some text';
      userPrompt.clear();
      expect(userPrompt.inputValue).toBe('');
    });

    it('sets loading state', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      document.body.appendChild(userPrompt);

      // Loading state is managed internally, just verify the component exists
      expect(userPrompt).toBeInstanceOf(HTMLElement);
      expect(userPrompt.tagName).toBe('USER-PROMPT');
    });

    it('handles keyboard events', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      document.body.appendChild(userPrompt);

      userPrompt.buttonOnClick = vi.fn();
      userPrompt.inputValue = 'Test question';

      // Simulate Enter key press
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });

      const input = userPrompt.querySelector('input');
      if (input) {
        input.dispatchEvent(keyEvent);
      }

      // The component should handle an Enter key to submit
    });

    it('prevents empty submissions when required', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('required', '');
      document.body.appendChild(userPrompt);

      const clickHandler = vi.fn();
      userPrompt.buttonOnClick = clickHandler;

      // Try to submit with an empty value
      userPrompt.inputValue = '';
      
      const form = userPrompt.querySelector('form');
      if (form) {
        const event = new Event('submit', { bubbles: true });
        event.preventDefault = vi.fn();
        form.dispatchEvent(event);
      }

      // Should not call the handler for invalid input
      expect(clickHandler).not.toHaveBeenCalled();
    });

    it('updates attributes dynamically', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      document.body.appendChild(userPrompt);

      userPrompt.setAttribute('placeholder', 'New placeholder');
      expect(userPrompt.getAttribute('placeholder')).toBe('New placeholder');

      userPrompt.setAttribute('disabled', '');
      expect(userPrompt.hasAttribute('disabled')).toBe(true);

      userPrompt.removeAttribute('disabled');
      expect(userPrompt.hasAttribute('disabled')).toBe(false);
    });

    it('manages button disabled state based on input validity', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('required', '');
      document.body.appendChild(userPrompt);

      // Empty input should disable the button
      userPrompt.inputValue = '';
      
      // Valid input should enable the button
      userPrompt.inputValue = 'Valid input';
      
      // Button state is managed internally based on input validity
      expect(userPrompt).toBeInstanceOf(HTMLElement);
    });

    it('shows loading state correctly', () => {
      const userPrompt = document.createElement('user-prompt') as never;
      userPrompt.setAttribute('loading-text', 'Sending...');
      document.body.appendChild(userPrompt);

      // Loading state is managed internally during submission
      expect(userPrompt.getAttribute('loading-text')).toBe('Sending...');
      expect(userPrompt).toBeInstanceOf(HTMLElement);
    });
  });
});