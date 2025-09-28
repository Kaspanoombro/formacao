// UserPrompt.ts
import type { InputElement, ButtonElement } from './userQuestionEntry.interface.ts';
import htmlTemplate from './userQuestionEntry.html?raw';
import cssStyles from './userQuestionEntry.css?raw';

class UserPrompt extends HTMLElement {
  private inputEl!: HTMLElement;
  private buttonEl!: HTMLElement;
  private containerEl!: HTMLDivElement;
  private buttonClickHandler?: (inputValue: string) => void;

  static get observedAttributes() {
    return [
      'button-text', 'input-placeholder', 'input-pattern', 'input-label',
      'submit-on-enter', 'clear-on-submit', 'validate-before-submit',
      'layout', 'size', 'disabled'
    ];
  }

  connectedCallback() {
    this.loadTemplate();
    this.setupComponents();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private loadTemplate() {
    try {
      // Inject CSS styles if not already injected
      if (!document.querySelector('style[data-component="user-prompt"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-component', 'user-prompt');
        style.textContent = cssStyles;
        document.head.appendChild(style);
      }

      // Parse HTML template
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlTemplate;
      const template = tempDiv.querySelector('#user-prompt-template') as HTMLTemplateElement;

      if (!template) {
        throw new Error('Template #user-prompt-template not found');
      }

      // Clone template content
      const content = template.content.cloneNode(true) as DocumentFragment;
      this.containerEl = content.querySelector('.user-prompt') as HTMLDivElement;

      this.appendChild(content);

    } catch {
      this.renderFallback();
    }
  }

  private renderFallback() {
    this.innerHTML = `
      <div class="user-prompt">
        <div class="user-prompt__input-container">
          <generic-input class="user-prompt__input"></generic-input>
        </div>
        <div class="user-prompt__button-container">
          <custom-button class="user-prompt__button"></custom-button>
        </div>
      </div>
    `;
    this.containerEl = this.querySelector('.user-prompt') as HTMLDivElement;
  }

  private setupComponents() {
    // Find the placeholder elements
    this.inputEl = this.querySelector('generic-input') as HTMLElement;
    this.buttonEl = this.querySelector('custom-button') as HTMLElement;

    if (!this.inputEl || !this.buttonEl) return;

    this.updateFromAttributes();
  }

  private updateFromAttributes() {
    if (!this.inputEl || !this.buttonEl) return;

    // Update input attributes
    const inputPlaceholder = this.getAttribute('input-placeholder');
    if (inputPlaceholder) this.inputEl.setAttribute('placeholder', inputPlaceholder);

    const inputPattern = this.getAttribute('input-pattern');
    if (inputPattern) this.inputEl.setAttribute('pattern', inputPattern);

    const inputLabel = this.getAttribute('input-label');
    if (inputLabel) this.inputEl.setAttribute('label', inputLabel);

    // Update button attributes
    const buttonText = this.getAttribute('button-text') || 'Enviar';
    this.buttonEl.setAttribute('text', buttonText);

    // Update container classes
    if (this.containerEl) {
      const layout = this.getAttribute('layout');
      if (layout) {
        this.containerEl.classList.remove('vertical', 'compact');
        if (layout !== 'horizontal') {
          this.containerEl.classList.add(layout);
        }
      }

      const size = this.getAttribute('size');
      if (size) {
        this.containerEl.classList.remove('small', 'large');
        if (size !== 'medium') {
          this.containerEl.classList.add(size);
        }
      }

      const disabled = this.hasAttribute('disabled');
      if (disabled) {
        this.containerEl.classList.add('disabled');
        this.inputEl.setAttribute('disabled', '');
        this.buttonEl.setAttribute('disabled', '');
      } else {
        this.containerEl.classList.remove('disabled');
        this.inputEl.removeAttribute('disabled');
        this.buttonEl.removeAttribute('disabled');
      }
    }
  }

  private attachEventListeners() {
    if (!this.inputEl || !this.buttonEl) return;

    // Button click handler
    (this.buttonEl as ButtonElement).onClick = () => {
      this.handleSubmit();
    };

    // Enter key handler
    if (this.hasAttribute('submit-on-enter')) {
      this.inputEl.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // Input change handler for validation
    (this.inputEl as InputElement).onChange = (_value: string, isValid: boolean) => {
      this.updateSubmitButton(isValid);
    };
  }

  private removeEventListeners() {
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSubmit();
    }
  }

  private handleSubmit() {
    if (!this.inputEl || !this.buttonClickHandler) return;

    const inputValue = (this.inputEl as InputElement).value || '',
     isValid = (this.inputEl as InputElement).isValid;

    // Validate before submitting if required
    if (this.hasAttribute('validate-before-submit') && !isValid) return;

    // Show loading state
    this.setLoading(true);

    try {
      // Call the handler
      this.buttonClickHandler(inputValue);

      // Clear input if required
      if (this.hasAttribute('clear-on-submit')) {
        (this.inputEl as InputElement).value = '';
      }

      // Dispatch custom event
      this.dispatchEvent(new CustomEvent('user-submit', {
        detail: { value: inputValue, isValid },
        bubbles: true
      }));

    } finally {
      // Remove the loading state after a short delay
      setTimeout(() => this.setLoading(false), 200);
    }
  }

  private updateSubmitButton(isValid: boolean) {
    if (!this.buttonEl || !this.hasAttribute('validate-before-submit')) return;

    (this.buttonEl as ButtonElement).setDisabled(!isValid);
  }

  private setLoading(loading: boolean) {
    if (!this.containerEl) return;

    if (loading) {
      this.containerEl.classList.add('loading');
      (this.buttonEl as ButtonElement).setDisabled(true);
    } else {
      this.containerEl.classList.remove('loading');
      if (!this.hasAttribute('disabled')) {
        (this.buttonEl as ButtonElement).setDisabled(false);
      }
    }
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this.updateFromAttributes();
  }

  // Public API
  set buttonOnClick(handler: (inputValue: string) => void) {
    this.buttonClickHandler = handler;
  }

  get inputValue(): string {
    return (this.inputEl as InputElement)?.value || '';
  }

  set inputValue(value: string) {
    if (this.inputEl) {
      (this.inputEl as InputElement).value = value;
    }
  }

  get isValid(): boolean {
    return (this.inputEl as InputElement)?.isValid !== false;
  }

  focus() {
    (this.inputEl as InputElement)?.focus();
  }

  clear() {
    if (this.inputEl) {
      (this.inputEl as InputElement).value = '';
    }
  }

  setInputError(message: string) {
    (this.inputEl as InputElement)?.setError(message);
  }

  clearInputError() {
    (this.inputEl as InputElement)?.clearError();
  }
}

// Register the custom element
if (!customElements.get('user-prompt')) {
  customElements.define('user-prompt', UserPrompt);
}
