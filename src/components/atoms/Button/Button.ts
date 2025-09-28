import type { ButtonOptions } from './Button.interface.ts';
import htmlTemplate from './button.html?raw';
import cssStyles from './button.css?raw';

/**
 * Custom Button Web Component <custom-button>
 * Uses imported HTML template and CSS styling
 */
export function createButton(text: string, onClick: () => void, className?: string): HTMLElement {
  const element = document.createElement('custom-button');
  element.setAttribute('text', text);
  element.setAttribute('class', className || '');
  (element as any).onClick = onClick;
  return element;
}

class CustomButton extends HTMLElement {
  private buttonEl!: HTMLButtonElement;
  private clickHandler?: () => void;

  static get observedAttributes() {
    return ['text', 'disabled'];
  }

  connectedCallback() {
    this.loadTemplate();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private loadTemplate() {
    try {
      // Inject CSS styles if not already injected
      if (!document.querySelector('style[data-component="custom-button"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-component', 'custom-button');
        style.textContent = cssStyles;
        document.head.appendChild(style);
      }

      // Parse HTML template
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlTemplate;
      const template = tempDiv.querySelector('#custom-button-template') as HTMLTemplateElement;

      if (!template) {
        throw new Error('Template #custom-button-template not found');
      }

      // Clone template content
      const content = template.content.cloneNode(true) as DocumentFragment;
      this.buttonEl = content.querySelector('.custom-button') as HTMLButtonElement;

      // Set initial text
      this.buttonEl.textContent = this.getAttribute('text') || '';

      // Set initial disabled state
      this.buttonEl.disabled = this.hasAttribute('disabled');

      // Apply additional classes
      const className = this.getAttribute('class');
      if (className) {
        this.buttonEl.classList.add(...className.split(' '));
      }

      this.appendChild(content);
    } catch (error) {
      console.error('Failed to load custom-button template:', error);
      this.renderFallback();
    }
  }

  private renderFallback() {
    this.innerHTML = `
      <button class="custom-button" type="button">
        ${this.getAttribute('text') || ''}
      </button>
    `;
    
    this.buttonEl = this.querySelector('.custom-button') as HTMLButtonElement;
    
    // Set initial disabled state
    this.buttonEl.disabled = this.hasAttribute('disabled');
    
    // Apply additional classes
    const className = this.getAttribute('class');
    if (className) {
      this.buttonEl.classList.add(...className.split(' '));
    }
  }

  private attachEventListeners() {
    if (this.buttonEl && this.clickHandler) {
      this.buttonEl.addEventListener('click', this.clickHandler);
    }
  }

  private removeEventListeners() {
    if (this.buttonEl && this.clickHandler) {
      this.buttonEl.removeEventListener('click', this.clickHandler);
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (!this.buttonEl) return;

    switch (name) {
      case 'text':
        this.buttonEl.textContent = newValue;
        break;
      case 'disabled':
        this.buttonEl.disabled = newValue !== null;
        break;
    }
  }

  /**
   * Set the click handler function
   */
  set onClick(handler: () => void) {
    if (this.clickHandler && this.buttonEl) {
      this.buttonEl.removeEventListener('click', this.clickHandler);
    }

    this.clickHandler = handler;

    if (this.buttonEl && handler) {
      this.buttonEl.addEventListener('click', handler);
    }
  }

  /**
   * Get the button element
   */
  getButtonElement(): HTMLButtonElement {
    return this.buttonEl;
  }

  /**
   * Set button text
   */
  setText(text: string): void {
    this.setAttribute('text', text);
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled: boolean): void {
    if (disabled) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
}

// Register the custom element
if (!customElements.get('custom-button')) {
  customElements.define('custom-button', CustomButton);
}

/**
 * Button class for backwards compatibility and direct usage
 */
export class Button {
  private element: CustomButton;

  constructor(options: ButtonOptions) {
    this.element = document.createElement('custom-button') as CustomButton;
    this.element.setAttribute('text', options.text);
    this.element.onClick = options.onClick;

    if (options.className) {
      this.element.setAttribute('class', options.className);
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  appendTo(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  setDisabled(disabled: boolean): void {
    this.element.setDisabled(disabled);
  }

  setText(text: string): void {
    this.element.setText(text);
  }

  remove(): void {
    this.element.remove();
  }
}