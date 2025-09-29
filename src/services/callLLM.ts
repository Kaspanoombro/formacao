import OpenAI from 'openai';
import type { CallLLMOptions, CallLLMResponse } from './callLLM.interface';

/**
 * Service class for interacting with Large Language Models via OpenRouter API
 * Handles environment configuration, API calls, and error management
 * 
 * @example
 * ```JavaScript
 * const service = new LLMService();
 * const response = await service.callLLM({
 *   question: "What is the capital of Portugal?",
 *   imageUrl: "https://example.com/image.jpg" // optional
 * });
 * 
 * if (response.success) {
 *   console.log(response.content);
 * } else {
 *   console.error(response.error);
 * }
 * ```
 */
class LLMService {
  /** The OpenAI client instance configured for OpenRouter */
  private openai: OpenAI;

  /**
   * Initializes the LLM service with environment configuration
   * Sets up the OpenAI client with OpenRouter API credentials
   * 
   * @throws {Error} When VITE_OPENROUTER_API_KEY is not defined
   */
  constructor() {
    // Handle both Vite (import.meta.env) and Node.js (process.env) environments
    const apiKey = typeof import.meta !== 'undefined' && import.meta.env 
      ? import.meta.env.VITE_OPENROUTER_API_KEY 
      : process.env.VITE_OPENROUTER_API_KEY;
    
    const baseURL = (typeof import.meta !== 'undefined' && import.meta.env 
      ? import.meta.env.VITE_OPENROUTER_BASE_URL 
      : process.env.VITE_OPENROUTER_BASE_URL) || "https://openrouter.ai/api/v1";

    if (!apiKey) {
      throw new Error('VITE_OPENROUTER_API_KEY is not defined in environment variables');
    }

    this.openai = new OpenAI({
      baseURL,
      apiKey,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        "HTTP-Referer": window.location.origin,
        "X-Title": document.title || "Formacao App",
      },
    });
  }

  /**
   * Sends a request to the LLM and returns the response
   * Supports both text-only and multimodal (text + image) requests
   * 
   * @param options - The request options containing question and optional image
   * @returns Promise that resolves to the LLM response
   * 
   * @example
   * ```javascript
   * // Text-only request
   * const response = await service.callLLM({
   *   question: "Explain quantum computing"
   * });
   * 
   * // Multimodal request with image
   * const response = await service.callLLM({
   *   question: "What do you see in this image?",
   *   imageUrl: "https://example.com/photo.jpg"
   * });
   * ```
   */
  async callLLM(options: CallLLMOptions): Promise<CallLLMResponse> {
    try {
      const modelName = (typeof import.meta !== 'undefined' && import.meta.env 
        ? import.meta.env.VITE_MODEL_NAME 
        : process.env.VITE_MODEL_NAME) || "mistralai/mistral-small-3.2-24b-instruct:free";
      
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "user",
          content: options.imageUrl 
            ? [
                {
                  type: "text",
                  text: options.question
                },
                {
                  type: "image_url",
                  image_url: {
                    url: options.imageUrl
                  }
                }
              ]
            : options.question
        }
      ];

      const completion = await this.openai.chat.completions.create({
        model: modelName,
        messages,
      });

      const responseContent = completion.choices[0]?.message?.content;
      
      if (!responseContent) {
        throw new Error('No response content received from LLM');
      }

      return {
        content: responseContent,
        success: true
      };
    } catch (error) {
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Create and export a singleton instance
const llmService = new LLMService();

/**
 * Convenience function that uses the singleton LLM service instance
 * This is the main export for simple usage throughout the application
 * 
 * @param options - The request options containing question and optional image
 * @returns Promise that resolves to the LLM response
 * 
 * @example
 * ```javascript
 * import { callLLM } from './callLLM.ts';
 * 
 * // Simple usage
 * const response = await callLLM({
 *   question: "What is artificial intelligence?"
 * });
 * 
 * if (response.success) {
 *   console.log('AI Response:', response.content);
 * } else {
 *   console.error('Error:', response.error);
 * }
 * 
 * // With image analysis
 * const imageResponse = await callLLM({
 *   question: "Describe this image in detail",
 *   imageUrl: "https://example.com/image.png"
 * });
 * ```
 */
export const callLLM = (options: CallLLMOptions): Promise<CallLLMResponse> => {
  return llmService.callLLM(options);
};

// Export types for use in other files
export type { CallLLMOptions, CallLLMResponse };

// Export the service class for advanced usage
export { LLMService };