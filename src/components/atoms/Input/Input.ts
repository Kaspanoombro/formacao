import type { GenericInputElement, InputOptions } from './input.interface.ts';
import htmlTemplate from './input.html?raw';
import cssStyles from './input.css?raw';

/**
 * Factory function to create a generic input element with the specified options
 * Uses imported HTML template and CSS styling with validation
 * 
 * @param options - Configuration options for the input element
 * @returns A configured generic-input HTML element
 * 
 * @example
 * ```javascript
 * import { createGenericInput } from './Input.ts';
 * 
 * const input = createGenericInput({
 *   type: 'email',
 *   placeholder: 'Enter your email',
 *   label: 'Email Address',
 *   required: true,
 *   pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$',
 *   onChange: (value, isValid) => {
 *     console.log('Input changed:', value, 'Valid:', isValid);
 *   }
 * });
 * 
 * document.body.appendChild(input);
 * ```
 */
export function createGenericInput(options: InputOptions): HTMLElement {
  const element = document.createElement('generic-input');

  if (options.pattern) element.setAttribute('pattern', options.pattern);
  if (options.placeholder) element.setAttribute('placeholder', options.placeholder);
  if (options.label) element.setAttribute('label', options.label);
  if (options.required) element.setAttribute('required', '');
  if (options.disabled) element.setAttribute('disabled', '');
  if (options.type) element.setAttribute('type', options.type);
  if (options.size) element.setAttribute('size', options.size);
  if (options.variant) element.setAttribute('variant', options.variant);

  if (options.onChange) {
    (element as GenericInputElement).onChange = options.onChange;
  }

  return element;
}

/**
 * Custom web component that creates a comprehensive input field with validation,
 * styling, and event handling capabilities. Extends HTMLElement to provide
 * a flexible input solution with template loading and attribute observation.
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <generic-input type="text" placeholder="Enter text" label="Name"></generic-input>
 * 
 * <!-- With validation -->
 * <generic-input 
 *   type="email" 
 *   pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
 *   required
 *   label="Email Address">
 * </generic-input>
 * 
 * <!-- Different sizes and variants -->
 * <generic-input size="large" variant="outlined" label="Large Input"></generic-input>
 * ```
 */
class GenericInput extends HTMLElement {
  /** The internal input element */
  private inputEl!: HTMLInputElement;
  /** The label element associated with the input */
  private labelEl!: HTMLLabelElement;
  /** The error display element */
  private errorEl!: HTMLDivElement;
  /** The wrapper container element */
  private wrapperEl!: HTMLDivElement;
  /** The change event handler function */
  private changeHandler?: (value: string, isValid: boolean) => void;

  /**
   * Defines which attributes should trigger attributeChangedCallback when modified
   * @returns Array of attribute names to observe
   */
  static get observedAttributes() {
    return [
      'pattern', 'placeholder', 'label', 'required', 'disabled',
      'type', 'value', 'size', 'variant'
    ];
  }

  /**
   * Lifecycle method called when the element is connected to the DOM
   * Loads the template and attaches event listeners
   */
  connectedCallback() {
    this.loadTemplate();
    this.attachEventListeners();
  }

  /**
   * Lifecycle method called when the element is disconnected from the DOM
   * Removes event listeners to prevent memory leaks
   */
  disconnectedCallback() {
    this.removeEventListeners();
  }

  /**
   * Loads the input template from HTML file and applies styling
   * Falls back to inline HTML if template loading fails
   * @private
   */
  private loadTemplate() {
    try {
      // Inject CSS styles if not already injected
      if (!document.querySelector('style[data-component="generic-input"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-component', 'generic-input');
        style.textContent = cssStyles;
        document.head.appendChild(style);
      }

      // Parse HTML template
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlTemplate;
      const template = tempDiv.querySelector('#generic-input-template') as HTMLTemplateElement;

      if (!template) {
        throw new Error('Template #generic-input-template not found');
      }

      // Clone template content
      const content = template.content.cloneNode(true) as DocumentFragment;
      this.wrapperEl = content.querySelector('.input-wrapper') as HTMLDivElement;
      this.inputEl = content.querySelector('.input-field') as HTMLInputElement;
      this.labelEl = content.querySelector('.input-label') as HTMLLabelElement;
      this.errorEl = content.querySelector('.input-error') as HTMLDivElement;

      this.appendChild(content);
      this.updateFromAttributes();

    } catch {
      this.renderFallback();
    }
  }

  private renderFallback() {
    // Fallback rendering if template loading fails
    this.innerHTML = `
      <div class="input-wrapper">
        <input class="input-field" type="text" />
        <div class="input-error"></div>
      </div>
    `;

    this.wrapperEl = this.querySelector('.input-wrapper') as HTMLDivElement;
    this.inputEl = this.querySelector('.input-field') as HTMLInputElement;
    this.errorEl = this.querySelector('.input-error') as HTMLDivElement;

    this.updateFromAttributes();
  }

  private updateFromAttributes() {
    if (!this.inputEl) return;

    // Update input attributes
    const pattern = this.getAttribute('pattern');
    if (pattern) this.inputEl.pattern = pattern;

    const placeholder = this.getAttribute('placeholder');
    if (placeholder) this.inputEl.placeholder = placeholder;

    this.inputEl.type = this.getAttribute('type') || 'text';
    this.inputEl.required = this.hasAttribute('required');
    this.inputEl.name = this.getAttribute('name') || '';
    this.inputEl.disabled = this.hasAttribute('disabled');
    const value = this.getAttribute('value');
    if (value !== null) this.inputEl.value = value;

    // Update label
    const label = this.getAttribute('label');
    if (this.labelEl && label) {
      this.labelEl.textContent = label;
    }

    // Update wrapper classes
    if (this.wrapperEl) {
      const size = this.getAttribute('size');
      if (size) {
        this.wrapperEl.classList.remove('small', 'large');
        if (size !== 'medium') {
          this.wrapperEl.classList.add(size);
        }
      }

      const variant = this.getAttribute('variant');
      if (variant) {
        this.wrapperEl.classList.remove('outlined', 'filled');
        if (variant !== 'default') {
          this.wrapperEl.classList.add(variant);
        }
      }
    }
  }

  private attachEventListeners() {
    if (!this.inputEl) return;

    this.inputEl.addEventListener('input', this.handleInput.bind(this));
    this.inputEl.addEventListener('blur', this.handleBlur.bind(this));
  }

  private removeEventListeners() {
    if (!this.inputEl) return;

    this.inputEl.removeEventListener('input', this.handleInput.bind(this));
    this.inputEl.removeEventListener('blur', this.handleBlur.bind(this));
  }

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const isValid = this.validateInput(value);

    this.updateValidationState(isValid);

    if (this.changeHandler) {
      this.changeHandler(value, isValid);
    }

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value, isValid },
      bubbles: true
    }));
  }

  private handleBlur(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const isValid = this.validateInput(value);

    this.updateValidationState(isValid, true);
  }

  private validateInput(value: string): boolean {
    if (!this.inputEl) return true;

    // Required validation
    if (this.inputEl.required && !value.trim()) {
      this.setError('Este campo é obrigatório');
      return false;
    }

    // Pattern validation
    const pattern = this.inputEl.pattern;
    if (pattern && value) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        this.setError('Formato inválido');
        return false;
      }
    }

    // HTML5 validation
    if (!this.inputEl.validity.valid) {
      this.setError(this.inputEl.validationMessage);
      return false;
    }

    this.clearError();
    return true;
  }

  private updateValidationState(isValid: boolean, showErrors = false) {
    if (!this.inputEl) return;

    if (isValid) {
      this.inputEl.classList.remove('error');
    } else if (showErrors) {
      this.inputEl.classList.add('error');
    }
  }

  private setError(message: string) {
    if (this.errorEl) {
      this.errorEl.textContent = message;
    }
  }

  private clearError() {
    if (this.errorEl) {
      this.errorEl.textContent = '';
    }
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this.updateFromAttributes();
  }

  // Public API
  set onChange(handler: (value: string, isValid: boolean) => void) {
    this.changeHandler = handler;
  }

  get value(): string {
    return this.inputEl?.value || '';
  }

  set value(val: string) {
    if (this.inputEl) {
      this.inputEl.value = val;
      this.validateInput(val);
    }
  }

  get isValid(): boolean {
    return this.validateInput(this.value);
  }

  focus() {
    this.inputEl?.focus();
  }

  blur() {
    this.inputEl?.blur();
  }

  setCustomError(message: string) {
    this.setError(message);
    this.inputEl?.classList.add('error');
  }

  clearCustomError() {
    this.clearError();
    this.inputEl?.classList.remove('error');
  }
}

// Register the custom element
if (!customElements.get('generic-input')) {
  customElements.define('generic-input', GenericInput);
}

/**
 * Input class for backwards compatibility and direct usage
 */
export class GenericInputClass {
  private readonly element: GenericInput;

  constructor(options: InputOptions) {
    this.element = createGenericInput(options) as GenericInput;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  appendTo(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  get value(): string {
    return this.element.value;
  }

  set value(val: string) {
    this.element.value = val;
  }

  get isValid(): boolean {
    return this.element.isValid;
  }

  focus(): void {
    this.element.focus();
  }

  setError(message: string): void {
    this.element.setCustomError(message);
  }

  clearError(): void {
    this.element.clearCustomError();
  }
}