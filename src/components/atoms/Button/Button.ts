import htmlTemplate from './button.html?raw';
import cssStyles from './button.css?raw';
import type { ButtonOptions } from './Button.interface.ts';


/**
 * Custom web component that creates a reusable button element.
 * Extends HTMLElement to provide a custom button with template loading,
 * event handling, and attribute observation capabilities.
 * 
 * @example
 * ```HTML
 * <custom-button text="Click me" disabled></custom-button>
 * ```
 * 
 * @example
 * ```JavaScript
 * const button = document.createElement('custom-button');
 * button.setAttribute('text', 'Submit');
 * button.onClick = () => console.log('Button clicked!');
 * document.body.appendChild(button);
 * ```
 */
class CustomButton extends HTMLElement {
  /** The internal button element */
  private buttonEl!: HTMLButtonElement;
  /** The click event handler function */
  private clickHandler?: () => void;

  /**
   * Defines which attributes should trigger attributeChangedCallback when modified
   * @returns Array of attribute names to observe
   */
  static get observedAttributes(): string[] {
    return ['text', 'disabled'];
  }

  /**
   * Lifecycle method called when the element is connected to the DOM
   * Loads the template and attaches event listeners
   */
  connectedCallback(): void {
    this.loadTemplate();
    this.attachEventListeners();
  }

  /**
   * Lifecycle method called when the element is disconnected from the DOM
   * Removes event listeners to prevent memory leaks
   */
  disconnectedCallback(): void {
    this.removeEventListeners();
  }

  /**
   * Loads the button template from an HTML file and applies styling
   * Falls back to inline HTML if template loading fails
   * @private
   */
  private loadTemplate(): void {
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

      // Set the initial text
      this.buttonEl.textContent = this.getAttribute('text') || '';

      // Set the initially disabled state
      this.buttonEl.disabled = this.hasAttribute('disabled');

      // Apply additional classes
      const className = this.getAttribute('class');
      if (className) {
        this.buttonEl.classList.add(...className.split(' '));
      }

      this.appendChild(content);
    } catch {
      this.renderFallback();
    }
  }

  /**
   * Creates a fallback button element when template loading fails
   * @private
   */
  private renderFallback(): void {
    this.innerHTML = `
      <button class="custom-button" type="button">
        ${this.getAttribute('text') || ''}
      </button>
    `;
    
    this.buttonEl = this.querySelector('.custom-button') as HTMLButtonElement;
    
    // Set the initially disabled state
    this.buttonEl.disabled = this.hasAttribute('disabled');
    
    // Apply additional classes
    const className = this.getAttribute('class');
    if (className) {
      this.buttonEl.classList.add(...className.split(' '));
    }
  }

  /**
   * Attaches click event listener to the button element
   * @private
   */
  private attachEventListeners(): void {
    if (this.buttonEl && this.clickHandler) {
      this.buttonEl.addEventListener('click', this.clickHandler);
    }
  }

  /**
   * Removes click event listener from the button element
   * @private
   */
  private removeEventListeners(): void {
    if (this.buttonEl && this.clickHandler) {
      this.buttonEl.removeEventListener('click', this.clickHandler);
    }
  }

  /**
   * Called when observed attributes change
   * Updates button text and disabled state based on attribute changes
   * @param name - The name of the changed attribute
   * @param _oldValue - The previous value (unused)
   * @param newValue - The new attribute value
   */
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
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
   * Sets the click handler function for the button
   * Automatically removes any previous handler and attaches the new one
   * @param handler - The function to call when the button is clicked
   * @example
   * ```JavaScript
   * button.onClick = () => console.log('Button clicked!');
   * ```
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
   * Gets the underlying HTMLButtonElement
   * @returns The internal button element
   */
  getButtonElement(): HTMLButtonElement {
    return this.buttonEl;
  }

  /**
   * Sets the button text by updating the 'text' attribute
   * @param text - The new text to display on the button
   */
  setText(text: string): void {
    this.setAttribute('text', text);
  }

  /**
   * Sets the disabled state of the button
   * @param disabled - Whether the button should be disabled
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
 * Provides a convenient wrapper around the CustomButton web component
 * 
 * @example
 * ```javascript
 * import { Button } from './Button.ts';
 * 
 * const myButton = new Button({
 *   text: 'Click Me',
 *   onClick: () => alert('Button clicked!'),
 *   className: 'my-custom-class'
 * });
 * 
 * myButton.appendTo(document.body);
 * ```
 */
export class Button {
  /** The underlying CustomButton web component */
  private readonly element: CustomButton;

  /**
   * Creates a new Button instance
   * @param options - Configuration options for the button
   */
  constructor(options: ButtonOptions) {
    this.element = document.createElement('custom-button') as CustomButton;
    this.element.setAttribute('text', options.text);
    this.element.onClick = options.onClick;

    if (options.className) {
      this.element.setAttribute('class', options.className);
    }
  }

  /**
   * Gets the underlying HTML element
   * @returns The CustomButton element
   */
  getElement(): CustomButton {
    return this.element;
  }

  /**
   * Appends the button to a parent element
   * @param parent - The parent element to append to
   * @returns The appended element or null if appending failed
   */
  appendTo(parent: HTMLElement): null | HTMLElement {
    try{
      return parent.appendChild(this.element);
    } catch {
      return null;
    }
  }

  /**
   * Sets the disabled state of the button
   * @param disabled - Whether the button should be disabled
   */
  setDisabled(disabled: boolean): void {
    this.element.setDisabled(disabled);
  }

  /**
   * Sets the button text
   * @param text - The new text to display
   */
  setText(text: string): void {
    this.element.setText(text);
  }

  /**
   * Removes the button from the DOM
   */
  remove(): void {
    this.element.remove();
  }
}