
/**
 * Configuration options for calling the LLM service
 */
export interface CallLLMOptions {
  /** The question or prompt to send to the LLM */
  question: string;
  /** Optional image URL for multimodal requests */
  imageUrl?: string;
}

/**
 * Response object returned by the LLM service
 */
export interface CallLLMResponse {
  /** The response content from the LLM */
  content: string;
  /** Whether the request was successful */
  success: boolean;
  /** Error message if the request failed */
  error?: string;
}
