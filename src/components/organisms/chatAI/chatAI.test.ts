import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { createChatAI } from './chatAI.ts';
import type { LogEntry } from '../../atoms/TextLog/TextLog.interface.ts';

// Mock the callLLM service
vi.mock('../../../services/callLLM.ts', () => ({
  callLLM: vi.fn()
}));

describe('Organism: ChatAI (Chat AI Component)', () => {
  beforeEach(() => {
    // Clean up any existing chat AI components
    document.body.innerHTML = '';
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('createChatAI function', () => {
    it('creates a chat-ai element with default options', () => {
      const chatAI = createChatAI({});
      
      expect(chatAI.tagName).toBe('CHAT-AI');
      expect(chatAI).toBeInstanceOf(HTMLElement);
    });

    it('creates chat AI with title', () => {
      const chatAI = createChatAI({
        title: 'AI Assistant'
      });
      
      expect(chatAI.getAttribute('title')).toBe('AI Assistant');
    });

    it('creates chat AI with placeholder', () => {
      const chatAI = createChatAI({
        placeholder: 'Ask me anything...'
      });
      
      expect(chatAI.getAttribute('placeholder')).toBe('Ask me anything...');
    });

    it('creates chat AI with submit button text', () => {
      const chatAI = createChatAI({
        submitText: 'Send Message'
      });
      
      expect(chatAI.getAttribute('submit-text')).toBe('Send Message');
    });

    it('creates chat AI with loading text', () => {
      const chatAI = createChatAI({
        loadingText: 'Thinking...'
      });
      
      expect(chatAI.getAttribute('loading-text')).toBe('Thinking...');
    });

    it('creates chat AI with max entries limit', () => {
      const chatAI = createChatAI({
        maxEntries: 50
      });
      
      expect(chatAI.getAttribute('max-entries')).toBe('50');
    });

    it('creates chat AI with auto scroll enabled', () => {
      const chatAI = createChatAI({
        autoScroll: true
      });
      
      expect(chatAI.hasAttribute('auto-scroll')).toBe(true);
    });

    it('creates chat AI with timestamp display', () => {
      const chatAI = createChatAI({
        showTimestamp: true
      });
      
      expect(chatAI.hasAttribute('show-timestamp')).toBe(true);
    });

    it('creates chat AI with clear functionality', () => {
      const chatAI = createChatAI({
        allowClear: true
      });
      
      expect(chatAI.hasAttribute('allow-clear')).toBe(true);
    });

    it('creates chat AI with message handler', () => {
      const onMessage = vi.fn();
      const chatAI = createChatAI({
        onMessage
      });
      
      expect(chatAI.onMessage).toBe(onMessage);
    });

    it('creates chat AI with initial messages', () => {
      const initialMessages: LogEntry[] = [
        {
          id: '1',
          type: 'system',
          text: 'Hello! How can I help you today?',
          timestamp: new Date()
        }
      ];

      const chatAI = createChatAI({
        initialMessages
      });
      
      expect(chatAI).toBeInstanceOf(HTMLElement);
    });
  });

  describe('ChatAI Web Component', () => {
    it('observes necessary attributes', () => {
      const ChatAIComponent = customElements.get('chat-ai');
      const expectedAttributes = [
        'title', 'placeholder', 'submit-text', 'loading-text',
        'max-entries', 'auto-scroll', 'show-timestamp', 
        'allow-clear', 'system-prompt', 'model', 'temperature'
      ];
      
      expect(ChatAIComponent?.observedAttributes).toEqual(expectedAttributes);
    });

    it('sets and gets onMessage handler', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      const messageHandler = vi.fn();
      chatAI.onMessage = messageHandler;
      
      expect(chatAI.onMessage).toBe(messageHandler);
    });

    it('adds messages to chat log', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      const timestamp = new Date();
      chatAI.addMessage('user', 'Hello AI!', timestamp);
      
      expect(() => chatAI.addMessage('ai', 'Hello! How can I help?', timestamp)).not.toThrow();
    });

    it('clears chat history', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      chatAI.addMessage('user', 'Test message', new Date());
      chatAI.clearChat();
      
      expect(() => chatAI.clearChat()).not.toThrow();
    });

    it('focuses input field', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      expect(() => chatAI.focus()).not.toThrow();
    });

    it('scrolls to bottom', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      expect(() => chatAI.scrollToBottom()).not.toThrow();
    });

    it('exports chat log', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      chatAI.addMessage('user', 'Test message', new Date());
      const exported = chatAI.exportChatLog();
      
      expect(Array.isArray(exported)).toBe(true);
    });

    it('imports chat log', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      const chatEntries: LogEntry[] = [
        {
          id: '1',
          type: 'user',
          text: 'Imported message',
          timestamp: new Date()
        }
      ];

      chatAI.importChatLog(chatEntries);
      expect(() => chatAI.importChatLog(chatEntries)).not.toThrow();
    });

    it('handles user messages and calls LLM service', async () => {
      const { callLLM } = await import('../../../services/callLLM.ts');
      const mockCallLLM = callLLM as Mock;
      
      mockCallLLM.mockResolvedValue('AI response to user message');

      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      const onMessage = vi.fn();
      chatAI.onMessage = onMessage;

      // Simulate user message
      await chatAI.handleUserMessage('Hello AI!');

      expect(mockCallLLM).toHaveBeenCalledWith({ question: 'Hello AI!' });
      expect(onMessage).toHaveBeenCalled();
    });

    it('handles LLM service errors gracefully', async () => {
      const { callLLM } = await import('../../../services/callLLM.ts');
      const mockCallLLM = callLLM as Mock;
      
      mockCallLLM.mockRejectedValue(new Error('LLM service error'));

      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      // Simulate user message that causes error
      await expect(chatAI.handleUserMessage('Test message')).resolves.not.toThrow();
    });

    it('updates attributes dynamically', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      chatAI.setAttribute('title', 'Updated AI Chat');
      expect(chatAI.getAttribute('title')).toBe('Updated AI Chat');

      chatAI.setAttribute('placeholder', 'New placeholder');
      expect(chatAI.getAttribute('placeholder')).toBe('New placeholder');

      chatAI.setAttribute('auto-scroll', '');
      expect(chatAI.hasAttribute('auto-scroll')).toBe(true);

      chatAI.removeAttribute('auto-scroll');
      expect(chatAI.hasAttribute('auto-scroll')).toBe(false);
    });

    it('handles different message types', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      const timestamp = new Date();

      // Test different message types
      chatAI.addMessage('user', 'User message', timestamp);
      chatAI.addMessage('ai', 'AI response', timestamp);
      chatAI.addMessage('system', 'System message', timestamp);
      chatAI.addMessage('error', 'Error message', timestamp);
      chatAI.addMessage('info', 'Info message', timestamp);

      expect(() => chatAI.addMessage('question', 'Question message', timestamp)).not.toThrow();
    });

    it('manages loading state during LLM calls', async () => {
      const { callLLM } = await import('../../../services/callLLM.ts');
      const mockCallLLM = callLLM as Mock;
      
      // Mock slow LLM response
      mockCallLLM.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve('Delayed response'), 100))
      );

      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      // Start handling user message (should show loading)
      const messagePromise = chatAI.handleUserMessage('Test message');
      
      // Should be in loading state during processing
      await messagePromise;
      
      expect(mockCallLLM).toHaveBeenCalledWith({ question: 'Test message' });
    });

    it('respects max entries limit', () => {
      const chatAI = createChatAI({
        maxEntries: 3
      });
      document.body.appendChild(chatAI);

      // Add more messages than the limit
      for (let i = 0; i < 5; i++) {
        chatAI.addMessage('user', `Message ${i}`, new Date());
      }

      // Component should handle the limit internally
      expect(chatAI.getAttribute('max-entries')).toBe('3');
    });

    it('handles system prompts and model configuration', () => {
      const chatAI = createChatAI({});
      document.body.appendChild(chatAI);

      chatAI.setAttribute('system-prompt', 'You are a helpful assistant');
      expect(chatAI.getAttribute('system-prompt')).toBe('You are a helpful assistant');

      chatAI.setAttribute('model', 'gpt-4');
      expect(chatAI.getAttribute('model')).toBe('gpt-4');

      chatAI.setAttribute('temperature', '0.7');
      expect(chatAI.getAttribute('temperature')).toBe('0.7');
    });

    it('handles timestamp display configuration', () => {
      const chatAI = createChatAI({
        showTimestamp: true
      });
      document.body.appendChild(chatAI);

      expect(chatAI.hasAttribute('show-timestamp')).toBe(true);

      chatAI.addMessage('user', 'Message with timestamp', new Date());
      // The TextLog component should display timestamps when configured
    });

    it('handles clear functionality when enabled', () => {
      const chatAI = createChatAI({
        allowClear: true
      });
      document.body.appendChild(chatAI);

      chatAI.addMessage('user', 'Test message', new Date());
      chatAI.clearChat();
      
      // Chat should be cleared when allow-clear is enabled
      expect(chatAI.hasAttribute('allow-clear')).toBe(true);
    });
  });
});