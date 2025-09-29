import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LLMService, type CallLLMOptions, type CallLLMResponse } from './callLLM.ts';

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn()
        }
      }
    }))
  };
});

// Mock environment variables
const mockEnv = {
  VITE_OPENROUTER_API_KEY: 'test-api-key',
  VITE_OPENROUTER_BASE_URL: 'https://test-openrouter.ai/api/v1',
  VITE_MODEL_NAME: 'test-model'
};

// Mock import.meta.env using vitest env stubbing
vi.stubEnv('VITE_OPENROUTER_API_KEY', mockEnv.VITE_OPENROUTER_API_KEY);
vi.stubEnv('VITE_OPENROUTER_BASE_URL', mockEnv.VITE_OPENROUTER_BASE_URL);
vi.stubEnv('VITE_MODEL_NAME', mockEnv.VITE_MODEL_NAME);

// Mock window and document for browser environment
Object.defineProperty(global, 'window', {
  value: {
    location: {
      origin: 'https://test-app.com'
    }
  },
  writable: true
});

Object.defineProperty(global, 'document', {
  value: {
    title: 'Test Formacao App'
  },
  writable: true
});

describe('Service: callLLM (LLM Service)', () => {
  let mockOpenAI: never;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Get the mocked OpenAI constructor and create a mock instance
    const OpenAI = (await import('openai')).default;
    mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn()
        }
      }
    };
    
    // Make sure the constructor returns our mock instance
    vi.mocked(OpenAI).mockReturnValue(mockOpenAI);
  });

  describe('LLMService Class', () => {
    it('creates LLMService instance with valid API key', () => {
      expect(() => new LLMService()).not.toThrow();
    });

    it('throws error when API key is missing', () => {
      // Temporarily override the environment
      vi.stubEnv('VITE_OPENROUTER_API_KEY', '');

      expect(() => new LLMService()).toThrow('VITE_OPENROUTER_API_KEY is not defined in environment variables');
      
      // Restore environment
      vi.stubEnv('VITE_OPENROUTER_API_KEY', mockEnv.VITE_OPENROUTER_API_KEY);
    });

    it('uses default base URL when not provided', () => {
      // Temporarily override the environment
      vi.stubEnv('VITE_OPENROUTER_BASE_URL', '');

      expect(() => new LLMService()).not.toThrow();
      
      // Restore environment
      vi.stubEnv('VITE_OPENROUTER_BASE_URL', mockEnv.VITE_OPENROUTER_BASE_URL);
    });

    it('configures OpenAI client with correct parameters', async () => {
      new LLMService();

      const OpenAI = (await import('openai')).default;
      expect(vi.mocked(OpenAI)).toHaveBeenCalledWith({
        baseURL: mockEnv.VITE_OPENROUTER_BASE_URL,
        apiKey: mockEnv.VITE_OPENROUTER_API_KEY,
        dangerouslyAllowBrowser: true,
        defaultHeaders: {
          "HTTP-Referer": "https://test-app.com",
          "X-Title": "Test Formacao App"
        }
      });
    });

    describe('callLLM method', () => {
      it('successfully calls LLM with text-only question', async () => {
        const mockResponse = {
          choices: [{
            message: {
              content: 'This is a test response from the LLM.'
            }
          }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const service = new LLMService();
        const options: CallLLMOptions = {
          question: 'What is artificial intelligence?'
        };

        const result = await service.callLLM(options);

        expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
          model: mockEnv.VITE_MODEL_NAME,
          messages: [{
            role: 'user',
            content: 'What is artificial intelligence?'
          }]
        });

        expect(result).toEqual({
          content: 'This is a test response from the LLM.',
          success: true
        });
      });

      it('successfully calls LLM with multimodal request (text + image)', async () => {
        const mockResponse = {
          choices: [{
            message: {
              content: 'I can see an image with various elements.'
            }
          }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const service = new LLMService();
        const options: CallLLMOptions = {
          question: 'What do you see in this image?',
          imageUrl: 'https://example.com/test-image.jpg'
        };

        const result = await service.callLLM(options);

        expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
          model: mockEnv.VITE_MODEL_NAME,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What do you see in this image?'
              },
              {
                type: 'image_url',
                image_url: {
                  url: 'https://example.com/test-image.jpg'
                }
              }
            ]
          }]
        });

        expect(result).toEqual({
          content: 'I can see an image with various elements.',
          success: true
        });
      });

      it('uses default model when VITE_MODEL_NAME is not set', async () => {
        // Temporarily override the environment
        vi.stubEnv('VITE_MODEL_NAME', '');

        const mockResponse = {
          choices: [{
            message: {
              content: 'Response with default model.'
            }
          }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const service = new LLMService();
        await service.callLLM({ question: 'Test question' });

        expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
          model: 'mistralai/mistral-small-3.2-24b-instruct:free',
          messages: expect.any(Array)
        });

      });

      it('handles API errors gracefully', async () => {
        const mockError = new Error('API request failed');
        mockOpenAI.chat.completions.create.mockRejectedValue(mockError);

        const service = new LLMService();
        const options: CallLLMOptions = {
          question: 'Test question that will fail'
        };

        const result = await service.callLLM(options);

        expect(result).toEqual({
          content: '',
          success: false,
          error: 'API request failed'
        });
      });

      it('handles empty response content', async () => {
        const mockResponse = {
          choices: [{
            message: {
              content: null
            }
          }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const service = new LLMService();
        const result = await service.callLLM({ question: 'Test question' });

        expect(result).toEqual({
          content: '',
          success: false,
          error: 'No response content received from LLM'
        });
      });

      it('handles missing response choices', async () => {
        const mockResponse = {
          choices: []
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const service = new LLMService();
        const result = await service.callLLM({ question: 'Test question' });

        expect(result).toEqual({
          content: '',
          success: false,
          error: 'No response content received from LLM'
        });
      });

      it('handles unknown error types', async () => {
        mockOpenAI.chat.completions.create.mockRejectedValue('String error');

        const service = new LLMService();
        const result = await service.callLLM({ question: 'Test question' });

        expect(result).toEqual({
          content: '',
          success: false,
          error: 'Unknown error occurred'
        });
      });
    });
  });

  describe('Type exports', () => {
    it('exports CallLLMOptions interface', () => {
      const options: CallLLMOptions = {
        question: 'Test question',
        imageUrl: 'https://example.com/image.jpg'
      };

      expect(typeof options.question).toBe('string');
      expect(typeof options.imageUrl).toBe('string');
    });

    it('exports CallLLMResponse interface', () => {
      const response: CallLLMResponse = {
        content: 'Test content',
        success: true,
        error: 'Optional error'
      };

      expect(typeof response.content).toBe('string');
      expect(typeof response.success).toBe('boolean');
      expect(typeof response.error).toBe('string');
    });
  });
});