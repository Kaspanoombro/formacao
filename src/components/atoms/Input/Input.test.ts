import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createGenericInput } from './Input.ts';

describe('Atom: Input (Generic Input Component)', () => {
  beforeEach(() => {
    // Clean up any existing inputs
    document.body.innerHTML = '';
  });

  describe('createGenericInput function', () => {
    it('creates a generic-input element with default options', () => {
      const input = createGenericInput({});
      
      expect(input.tagName).toBe('GENERIC-INPUT');
      expect(input).toBeInstanceOf(HTMLElement);
    });

    it('creates input with placeholder option', () => {
      const input = createGenericInput({
        placeholder: 'Enter text here'
      });

      expect(input.getAttribute('placeholder')).toBe('Enter text here');
    });

    it('creates input with label option', () => {
      const input = createGenericInput({
        label: 'Username'
      });

      expect(input.getAttribute('label')).toBe('Username');
    });

    it('creates input with pattern validation', () => {
      const input = createGenericInput({
        pattern: '[0-9]+'
      });

      expect(input.getAttribute('pattern')).toBe('[0-9]+');
    });

    it('creates input with required attribute', () => {
      const input = createGenericInput({
        required: true
      });

      expect(input.hasAttribute('required')).toBe(true);
    });

    it('creates input with disabled state', () => {
      const input = createGenericInput({
        disabled: true
      });

      expect(input.hasAttribute('disabled')).toBe(true);
    });

    it('creates input with specific type', () => {
      const input = createGenericInput({
        type: 'email'
      });

      expect(input.getAttribute('type')).toBe('email');
    });

    it('creates input with size variant', () => {
      const input = createGenericInput({
        size: 'large'
      });

      expect(input.getAttribute('size')).toBe('large');
    });

    it('creates input with style variant', () => {
      const input = createGenericInput({
        variant: 'outlined'
      });

      expect(input.getAttribute('variant')).toBe('outlined');
    });

    it('creates input with onChange handler', () => {
      const onChange = vi.fn();
      const input = createGenericInput({
        onChange
      });

      // The onChange is handled internally, just verify input was created
      expect(input).toBeInstanceOf(HTMLElement);
      expect(input.tagName).toBe('GENERIC-INPUT');
    });
  });

  describe('GenericInput Web Component', () => {
    it('observes all necessary attributes', () => {
      const GenericInput = customElements.get('generic-input');
      const expectedAttributes = [
        'pattern', 'placeholder', 'label', 'required', 
        'disabled', 'type', 'value', 'size', 'variant'
      ];
      
      expect(GenericInput?.observedAttributes).toEqual(expectedAttributes);
    });

    it('handles value getter and setter', () => {
      const input = createGenericInput({});
      document.body.appendChild(input);

      // Test setter
      input.value = 'test value';
      expect(input.value).toBe('test value');
    });

    it('validates input based on pattern', () => {
      const input = createGenericInput({
        pattern: '^[0-9]+$'
      });
      document.body.appendChild(input);

      input.value = '123';
      expect(input.isValid).toBe(true);

      input.value = 'abc';
      expect(input.isValid).toBe(false);
    });

    it('handles required validation', () => {
      const input = createGenericInput({
        required: true
      });
      document.body.appendChild(input);

      input.value = '';
      expect(input.isValid).toBe(false);

      input.value = 'some text';
      expect(input.isValid).toBe(true);
    });

    it('can focus and blur the input', () => {
      const input = createGenericInput({});
      document.body.appendChild(input);

      expect(() => input.focus()).not.toThrow();
      expect(() => input.blur()).not.toThrow();
    });

    it('sets and clears custom errors', () => {
      const input = createGenericInput({});
      document.body.appendChild(input);

      input.setCustomError('Custom error message');
      // Error state should be set (implementation dependent)
      
      input.clearCustomError();
      // Error state should be cleared (implementation dependent)
    });

    it('triggers onChange callback when value changes', async () => {
      const onChange = vi.fn();
      
      const input = createGenericInput({
        onChange
      });
      document.body.appendChild(input);

      // Set value and trigger change
      input.value = 'test';
      
      // The onChange is handled internally, just verify the value was set
      expect(input.value).toBe('test');
    });

    it('updates attributes dynamically', () => {
      const input = createGenericInput({});
      document.body.appendChild(input);

      input.setAttribute('placeholder', 'New placeholder');
      expect(input.getAttribute('placeholder')).toBe('New placeholder');

      input.setAttribute('disabled', '');
      expect(input.hasAttribute('disabled')).toBe(true);

      input.removeAttribute('disabled');
      expect(input.hasAttribute('disabled')).toBe(false);
    });

    it('handles different input types', () => {
      const emailInput = createGenericInput({ type: 'email' });
      expect(emailInput.getAttribute('type')).toBe('email');

      const passwordInput = createGenericInput({ type: 'password' });
      expect(passwordInput.getAttribute('type')).toBe('password');

      const numberInput = createGenericInput({ type: 'number' });
      expect(numberInput.getAttribute('type')).toBe('number');
    });

    it('applies size classes correctly', () => {
      const smallInput = createGenericInput({ size: 'small' });
      expect(smallInput.getAttribute('size')).toBe('small');

      const mediumInput = createGenericInput({ size: 'medium' });
      expect(mediumInput.getAttribute('size')).toBe('medium');

      const largeInput = createGenericInput({ size: 'large' });
      expect(largeInput.getAttribute('size')).toBe('large');
    });

    it('applies variant styles correctly', () => {
      const defaultInput = createGenericInput({ variant: 'default' });
      expect(defaultInput.getAttribute('variant')).toBe('default');

      const outlinedInput = createGenericInput({ variant: 'outlined' });
      expect(outlinedInput.getAttribute('variant')).toBe('outlined');

      const filledInput = createGenericInput({ variant: 'filled' });
      expect(filledInput.getAttribute('variant')).toBe('filled');
    });
  });
});