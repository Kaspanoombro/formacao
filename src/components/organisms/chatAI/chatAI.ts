import type { LogEntry } from '../../atoms/TextLog/TextLog.interface.ts';
import type { TextLogElement, UserPromptElement } from './chatAI.interface.ts';
import '../../atoms/TextLog/TextLog.ts';
import '../../molecules/userQuestionEntry/userQuestionEntry.ts';
import { callLLM } from '../../../services/callLLM.ts';
import htmlTemplate from './chatAI.html?raw';
import cssStyles from './chatAI.css?raw';

/**
 * Configuration options for creating a ChatAI component instance
 * Defines the customization parameters available when creating a chat interface
 * 
 * @interface ChatAIOptions
 */
export interface ChatAIOptions {
  /** The title displayed at the top of the chat interface */
  title?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Text displayed on the submit button */
  submitText?: string;
  /** Loading text shown while processing */
  loadingText?: string;
  /** Maximum number of entries in chat log */
  maxEntries?: number;
  /** Whether to auto-scroll to bottom */
  autoScroll?: boolean;
  /** Whether to show timestamps for each message */
  showTimestamp?: boolean;
  /** Whether to allow clearing chat history */
  allowClear?: boolean;
  /** System prompt for AI model */
  systemPrompt?: string;
  /** AI model name to use */
  model?: string;
  /** Temperature setting for AI model */
  temperature?: number;
  /** Callback function called when a user sends a message */
  onMessage?: (message: string) => void;
  /** Initial messages to populate the chat */
  initialMessages?: LogEntry[];
}

/**
 * Factory function to create a ChatAI component instance
 * Creates and configures a chat-ai custom element with the specified options,
 * providing an interactive AI chat interface with LLM integration
 * 
 * @param options - Configuration options for the chat component
 * @returns A configured ChatAI custom element
 * 
 * @example
 * ```javascript
 * import { createChatAI } from './chatAI.ts';
 * 
 * // Create with custom options
 * const chatAI = createChatAI({
 *   title: 'AI Assistant',
 *   placeholder: 'Type your question here...',
 *   submitButtonText: 'Send',
 *   maxHeight: '500px',
 *   showTimestamps: true,
 *   onMessage: (message) => {
 *     console.log('User sent:', message);
 *   }
 * });
 * 
 * document.body.appendChild(chatAI);
 * ```
 * 
 * @example
 * ```JavaScript
 * // Create with default options
 * const simpleChat = createChatAI();
 * document.getElementById('chat-container').appendChild(simpleChat);
 * ```
 */
export function createChatAI(options: ChatAIOptions = {}) {
  const chatAI = document.createElement('chat-ai') as ChatAI;
  
  if (options.title) chatAI.setAttribute('title', options.title);
  if (options.placeholder) chatAI.setAttribute('placeholder', options.placeholder);
  if (options.submitText) chatAI.setAttribute('submit-text', options.submitText);
  if (options.loadingText) chatAI.setAttribute('loading-text', options.loadingText);
  if (options.maxEntries) chatAI.setAttribute('max-entries', options.maxEntries.toString());
  if (options.autoScroll) chatAI.setAttribute('auto-scroll', 'true');
  if (options.showTimestamp) chatAI.setAttribute('show-timestamp', 'true');
  if (options.allowClear) chatAI.setAttribute('allow-clear', 'true');
  if (options.systemPrompt) chatAI.setAttribute('system-prompt', options.systemPrompt);
  if (options.model) chatAI.setAttribute('model', options.model);
  if (options.temperature !== undefined) chatAI.setAttribute('temperature', options.temperature.toString());
  if (options.onMessage) {
    chatAI.onMessage = options.onMessage;
  }
  if (options.initialMessages) {
    // Handle initial messages after the component is connected
    setTimeout(() => {
      options.initialMessages?.forEach(message => {
        chatAI.addMessage(message.type, message.text, message.timestamp);
      });
    }, 0);
  }
  
  return chatAI;
}

/**
 * Custom web component that provides an interactive AI chat interface
 * Extends HTMLElement to create a complete chat experience with LLM integration,
 * message history, and customizable appearance and behavior
 * 
 * @example
 * ```HTML
 * <!-- Basic HTML usage -->
 * <chat-ai title="AI Assistant" placeholder="Ask me anything..."></chat-ai>
 * ```
 * 
 * @example
 * ```javascript
 * // Programmatic usage
 * const chatAI = document.createElement('chat-ai');
 * chatAI.setAttribute('title', 'My AI Helper');
 * chatAI.setAttribute('max-height', '600px');
 * chatAI.setAttribute('show-timestamps', 'true');
 * 
 * // Set up message handler
 * chatAI.onMessage = (message) => {
 *   console.log('User message:', message);
 * };
 * 
 * document.body.appendChild(chatAI);
 * ```
 */
export class ChatAI extends HTMLElement {
  /** Reference to the text log component for displaying messages */
  private textLogEl: TextLogElement | null = null;
  /** Reference to the user prompt component for input handling */
  private userPromptEl: UserPromptElement | null = null;
  /** Reference to the main container element */
  private containerEl: HTMLElement | null = null;
  /** Reference to the title element */
  private titleEl: HTMLElement | null = null;
  /** Optional callback function for handling user messages */
  private messageHandler: ((message: string) => void) | null = null;

  /**
   * Defines which attributes should trigger attributeChangedCallback when modified
   * @returns Array of attribute names to observe
   */
  static get observedAttributes() {
    return [
      'title', 'placeholder', 'submit-text', 'loading-text',
      'max-entries', 'auto-scroll', 'show-timestamp', 
      'allow-clear', 'system-prompt', 'model', 'temperature'
    ];
  }

  connectedCallback() {
    this.loadTemplate();
    this.setupComponents();
    this.updateFromAttributes();
  }

  disconnectedCallback() {
    // Clean up event listeners if needed
  }

  private loadTemplate() {
    try {
      this.innerHTML = htmlTemplate;
      
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync(cssStyles);
      
      if (this.shadowRoot) {
        this.shadowRoot.adoptedStyleSheets = [styleSheet];
      } else {
        const style = document.createElement('style');
        style.textContent = cssStyles;
        this.appendChild(style);
      }
      
    } catch {
      this.renderFallback();
    }

    this.containerEl = this.querySelector('.chat-ai-container');
    this.titleEl = this.querySelector('.chat-ai-title');
    this.textLogEl = this.querySelector('text-log');
    this.userPromptEl = this.querySelector('user-prompt');
  }

  private renderFallback() {
    this.innerHTML = `
      <div class="chat-ai-container">
        <div class="chat-ai-header">
          <h3 class="chat-ai-title">AI Chat</h3>
        </div>
        <div class="chat-ai-content">
          <text-log class="chat-ai-log" show-footer="false"></text-log>
          <user-prompt class="chat-ai-input" 
                       validate-before-submit="false"
                       submit-on-enter="true"
                       clear-on-submit="true">
          </user-prompt>
        </div>
      </div>
    `;
  }

  private setupComponents() {
    if (!this.textLogEl || !this.userPromptEl) return;

    // Setup user prompt event handler
    this.userPromptEl.buttonOnClick = (inputValue: string) => {
      this.handleUserMessage(inputValue).then(() => {});
    };

    // Note: Removed duplicate user-submit event listener to prevent message duplication
    // The buttonOnClick handler already handles user input submission
  }

  private updateFromAttributes() {
    if (!this.containerEl) return;

    // Update title
    const title = this.getAttribute('title') || 'AI Chat';
    if (this.titleEl) {
      this.titleEl.textContent = title;
    }

    // Update placeholder
    const placeholder = this.getAttribute('placeholder');
    if (placeholder && this.userPromptEl) {
      this.userPromptEl.setAttribute('input-placeholder', placeholder);
    }

    // Update submit button text
    const submitButtonText = this.getAttribute('submit-button-text');
    if (submitButtonText && this.userPromptEl) {
      this.userPromptEl.setAttribute('button-text', submitButtonText);
    }

    // Update max height
    const maxHeight = this.getAttribute('max-height');
    if (maxHeight) {
      this.style.setProperty('--chat-ai-max-height', maxHeight);
    }

    // Update show timestamps
    const showTimestamps = this.getAttribute('show-timestamps') === 'true';
    if (this.textLogEl) {
      this.textLogEl.setAttribute('show-timestamps', showTimestamps.toString());
    }
  }

  private async handleUserMessage(message: string) {
    //if (!message.trim()) return;

    // Add a user message to the log
    this.addMessage('user', message);

    // Call an external message handler if provided
    if (this.messageHandler) {
      this.messageHandler(message);
    }

    // Call the actual LLM service
    try {
      const response = await callLLM({ question: message });
      if (response.success) {
        this.addMessage('ai', response.content);
      } else {
        this.addMessage('ai', `Error: ${response.error || 'Failed to get AI response'}`);
      }
    } catch {
      this.addMessage('ai', 'Sorry, I encountered an error while processing your message.');
    }
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this.updateFromAttributes();
  }

  // Public API
  
  /**
   * Sets the message handler callback function
   * Called whenever a user sends a message through the chat interface
   * @param handler - Function to handle user messages
   */
  set onMessage(handler: (message: string) => void) {
    this.messageHandler = handler;
  }

  /**
   * Gets the current message handler callback function
   * @returns The current message handler or null if not set
   */
  get onMessage() {
    return this.messageHandler;
  }

  /**
   * Adds a message to the chat log
   * @param type - The type of message ('user', 'ai', or 'system')
   * @param text - The message content
   * @param timestamp - Optional timestamp (defaults to current time)
   */
  addMessage(type: 'user' | 'ai' | 'system', text: string, timestamp?: Date) {
    if (!this.textLogEl) return;

    const logEntry: LogEntry = {
      type: type,
      text: text,
      timestamp: timestamp || new Date()
    };

    this.textLogEl.addEntry(logEntry);
  }

  /**
   * Clears all messages from the chat log
   */
  clearChat() {
    if (this.textLogEl) {
      this.textLogEl.clear();
    }
  }

  /**
   * Focuses the input field for user interaction
   */
  focus() {
    if (this.userPromptEl) {
      this.userPromptEl.focus();
    }
  }

  /**
   * Scrolls the chat log to the bottom
   */
  scrollToBottom() {
    if (this.textLogEl) {
      this.textLogEl.scrollToBottom();
    }
  }

  /**
   * Exports the current chat log entries
   * @returns Array of log entries
   */
  exportChatLog() {
    return this.textLogEl?.exportLog() || [];
  }

  /**
   * Imports chat log entries into the chat
   * @param entries - Array of log entries to import
   */
  importChatLog(entries: LogEntry[]) {
    if (this.textLogEl) {
      this.textLogEl.importLog(entries);
    }
  }
}

// Register the custom element
if (!customElements.get('chat-ai')) {
  customElements.define('chat-ai', ChatAI);
}