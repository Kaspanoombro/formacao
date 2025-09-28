import type { LogEntry } from '../../atoms/TextLog/TextLog.interface.ts';
import type { TextLogElement, UserPromptElement } from './chatAI.interface.ts';
import '../../atoms/TextLog/TextLog.ts';
import '../../molecules/userQuestionEntry/userQuestionEntry.ts';
import { callLLM } from '../../../services/callLLM.ts';
import htmlTemplate from './chatAI.html?raw';
import cssStyles from './chatAI.css?raw';

export interface ChatAIOptions {
  title?: string;
  placeholder?: string;
  submitButtonText?: string;
  maxHeight?: string;
  showTimestamps?: boolean;
  onMessage?: (message: string) => void;
}

export function createChatAI(options: ChatAIOptions = {}) {
  const chatAI = document.createElement('chat-ai') as ChatAI;
  
  if (options.title) chatAI.setAttribute('title', options.title);
  if (options.placeholder) chatAI.setAttribute('placeholder', options.placeholder);
  if (options.submitButtonText) chatAI.setAttribute('submit-button-text', options.submitButtonText);
  if (options.maxHeight) chatAI.setAttribute('max-height', options.maxHeight);
  if (options.showTimestamps) chatAI.setAttribute('show-timestamps', 'true');
  if (options.onMessage) {
    chatAI.onMessage = options.onMessage;
  }
  
  return chatAI;
}

export class ChatAI extends HTMLElement {
  private textLogEl: TextLogElement | null = null;
  private userPromptEl: UserPromptElement | null = null;
  private containerEl: HTMLElement | null = null;
  private titleEl: HTMLElement | null = null;
  private messageHandler: ((message: string) => void) | null = null;

  static get observedAttributes() {
    return [
      'title',
      'placeholder', 
      'submit-button-text',
      'max-height',
      'show-timestamps'
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
      this.handleUserMessage(inputValue);
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
    if (!message.trim()) return;

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
  set onMessage(handler: (message: string) => void) {
    this.messageHandler = handler;
  }

  addMessage(type: 'user' | 'ai' | 'system', text: string, timestamp?: Date) {
    if (!this.textLogEl) return;

    const logEntry: LogEntry = {
      type: type,
      text: text,
      timestamp: timestamp || new Date()
    };

    this.textLogEl.addEntry(logEntry);
  }

  clearChat() {
    if (this.textLogEl) {
      this.textLogEl.clear();
    }
  }

  focus() {
    if (this.userPromptEl) {
      this.userPromptEl.focus();
    }
  }

  scrollToBottom() {
    if (this.textLogEl) {
      this.textLogEl.scrollToBottom();
    }
  }

  exportChatLog() {
    return this.textLogEl?.exportLog() || [];
  }

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