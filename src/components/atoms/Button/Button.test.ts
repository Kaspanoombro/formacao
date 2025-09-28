import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Button } from './Button.ts';

describe('Atom: Button (Web Component)', () => {
  beforeEach(() => {
    // Clean up any existing buttons
    document.body.innerHTML = '';
  });

  describe('Button Class', () => {
    it('creates a Button instance with text and onClick handler', () => {
      const onClick = vi.fn();
      const button = new Button({
        text: 'Test Button',
        onClick
      });

      expect(button).toBeInstanceOf(Button);
      expect(button.getElement().tagName).toBe('CUSTOM-BUTTON');
      expect(button.getElement().getAttribute('text')).toBe('Test Button');
    });

    it('creates a Button with custom className', () => {
      const onClick = vi.fn();
      const button = new Button({
        text: 'Styled Button',
        onClick,
        className: 'custom-style'
      });

      expect(button.getElement().getAttribute('class')).toBe('custom-style');
    });

    it('appends button to parent element', () => {
      const onClick = vi.fn();
      const button = new Button({
        text: 'Append Test',
        onClick
      });
      const parent = document.createElement('div');

      button.appendTo(parent);

      expect(parent.children.length).toBe(1);
      expect(parent.firstChild).toBe(button.getElement());
    });

    it('sets disabled state', () => {
      const onClick = vi.fn();
      const button = new Button({
        text: 'Disable Test',
        onClick
      });

      button.setDisabled(true);
      expect(button.getElement().hasAttribute('disabled')).toBe(true);

      button.setDisabled(false);
      expect(button.getElement().hasAttribute('disabled')).toBe(false);
    });

    it('sets button text', () => {
      const onClick = vi.fn();
      const button = new Button({
        text: 'Initial Text',
        onClick
      });

      button.setText('Updated Text');
      expect(button.getElement().getAttribute('text')).toBe('Updated Text');
    });

    it('removes button from DOM', () => {
      const onClick = vi.fn();
      const button = new Button({
        text: 'Remove Test',
        onClick
      });
      document.body.appendChild(button.getElement());

      expect(document.body.children.length).toBe(1);
      button.remove();
      expect(document.body.children.length).toBe(0);
    });
  });

  describe('CustomButton Web Component', () => {
    it('creates custom-button element with text attribute', () => {
      const button = document.createElement('custom-button') as any;
      button.setAttribute('text', 'Custom Button');
      document.body.appendChild(button);

      expect(button.tagName).toBe('CUSTOM-BUTTON');
      expect(button.getAttribute('text')).toBe('Custom Button');
    });

    it('handles disabled attribute', () => {
      const button = document.createElement('custom-button') as any;
      button.setAttribute('text', 'Disabled Button');
      button.setAttribute('disabled', '');
      document.body.appendChild(button);

      expect(button.hasAttribute('disabled')).toBe(true);
    });

    it('observes text and disabled attributes', () => {
      const CustomButton = customElements.get('custom-button');
      expect(CustomButton?.observedAttributes).toEqual(['text', 'disabled']);
    });

    it('sets onClick handler and triggers click event', () => {
      const button = document.createElement('custom-button') as any;
      button.setAttribute('text', 'Click Test');
      document.body.appendChild(button);

      const onClick = vi.fn();
      button.onClick = onClick;

      // Wait for component to be fully rendered
      setTimeout(() => {
        const buttonEl = button.getButtonElement();
        if (buttonEl) {
          buttonEl.click();
          expect(onClick).toHaveBeenCalled();
        }
      }, 0);
    });

    it('updates text via setText method', () => {
      const button = document.createElement('custom-button') as any;
      button.setAttribute('text', 'Initial');
      document.body.appendChild(button);

      button.setText('Updated');
      expect(button.getAttribute('text')).toBe('Updated');
    });

    it('updates disabled state via setDisabled method', () => {
      const button = document.createElement('custom-button') as any;
      button.setAttribute('text', 'Toggle Test');
      document.body.appendChild(button);

      button.setDisabled(true);
      expect(button.hasAttribute('disabled')).toBe(true);

      button.setDisabled(false);
      expect(button.hasAttribute('disabled')).toBe(false);
    });
  });
});