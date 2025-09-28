import OpenAI from 'openai';

interface CallLLMOptions {
  question: string;
  imageUrl?: string;
}

interface CallLLMResponse {
  content: string;
  success: boolean;
  error?: string;
}

class LLMService {
  private openai: OpenAI;

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

// Export the main function for easy use
export const callLLM = (options: CallLLMOptions): Promise<CallLLMResponse> => {
  return llmService.callLLM(options);
};

// Export types for use in other files
export type { CallLLMOptions, CallLLMResponse };

// Export the service class for advanced usage
export { LLMService };