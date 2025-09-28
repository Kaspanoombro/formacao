# CallLLM Service

## Overview

The CallLLM service provides a comprehensive interface for interacting with Large Language Models (LLMs) through the OpenRouter API. It supports both text-only and multimodal (text + image) requests with proper error handling and environment configuration.

## Features

- **OpenRouter Integration**: Uses OpenRouter API for access to multiple LLM providers
- **Multimodal Support**: Handles both text and image inputs
- **Environment Configuration**: Supports both Vite and Node.js environments
- **Error Handling**: Comprehensive error management with detailed error messages
- **Singleton Pattern**: Provides a convenient singleton instance for easy usage
- **TypeScript Support**: Full type safety with detailed interfaces

## Architecture

The service consists of:
- **LLMService Class**: Main service class handling API interactions
- **callLLM Function**: Convenient wrapper using singleton instance
- **Type Definitions**: TypeScript interfaces for type safety

## Usage

### Simple Usage (Recommended)

```javascript
import { callLLM } from './callLLM.ts';

// Basic text request
const response = await callLLM({
  question: "What is the capital of Portugal?"
});

if (response.success) {
  console.log('Answer:', response.content);
} else {
  console.error('Error:', response.error);
}
```

### Multimodal Usage (Text + Image)

```javascript
import { callLLM } from './callLLM.ts';

// Request with image analysis
const response = await callLLM({
  question: "What do you see in this image? Describe it in detail.",
  imageUrl: "https://example.com/photo.jpg"
});

if (response.success) {
  console.log('Image Description:', response.content);
} else {
  console.error('Analysis failed:', response.error);
}
```

### Advanced Usage (Service Class)

```javascript
import { LLMService } from './callLLM.ts';

// Create your own service instance
const customLLMService = new LLMService();

// Use the service
const response = await customLLMService.callLLM({
  question: "Explain quantum computing in simple terms"
});
```

### Error Handling

```javascript
import { callLLM } from './callLLM.ts';

try {
  const response = await callLLM({
    question: "Your question here"
  });
  
  if (response.success) {
    // Handle successful response
    console.log(response.content);
  } else {
    // Handle API errors
    console.error('API Error:', response.error);
  }
} catch (error) {
  // Handle network or other errors
  console.error('Network Error:', error);
}
```

## API Reference

### Types

#### CallLLMOptions

Configuration options for LLM requests.

```typescript
interface CallLLMOptions {
  question: string;      // The question or prompt to send
  imageUrl?: string;     // Optional image URL for multimodal requests
}
```

#### CallLLMResponse

Response object returned by the service.

```typescript
interface CallLLMResponse {
  content: string;       // The response content from the LLM
  success: boolean;      // Whether the request was successful
  error?: string;        // Error message if the request failed
}
```

### Functions

#### callLLM(options)

Main convenience function for making LLM requests.

**Parameters:**
- `options: CallLLMOptions` - Request configuration

**Returns:**
- `Promise<CallLLMResponse>` - Promise resolving to the LLM response

**Example:**
```javascript
const response = await callLLM({
  question: "What is machine learning?",
  imageUrl: "https://example.com/diagram.png" // optional
});
```

### Classes

#### LLMService

Main service class for LLM interactions.

##### Constructor

```javascript
new LLMService()
```

Creates a new LLM service instance. Automatically configures the OpenAI client using environment variables.

**Throws:**
- `Error` - When `VITE_OPENROUTER_API_KEY` is not defined

##### Methods

###### callLLM(options)

Sends a request to the LLM and returns the response.

**Parameters:**
- `options: CallLLMOptions` - Request configuration

**Returns:**
- `Promise<CallLLMResponse>` - Promise resolving to the LLM response

## Environment Configuration

The service requires the following environment variables:

### Required Variables

- **VITE_OPENROUTER_API_KEY**: Your OpenRouter API key

### Optional Variables

- **VITE_OPENROUTER_BASE_URL**: OpenRouter API base URL (defaults to "https://openrouter.ai/api/v1")
- **VITE_MODEL_NAME**: LLM model to use (defaults to "mistralai/mistral-small-3.2-24b-instruct:free")

### Environment Setup

Create a `.env` file in your project root:

```env
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VITE_MODEL_NAME=mistralai/mistral-small-3.2-24b-instruct:free
```

## Supported Models

The service works with any model available through OpenRouter. Popular options include:

- **Mistral Models**: `mistralai/mistral-small-3.2-24b-instruct:free`
- **OpenAI Models**: `openai/gpt-4o`, `openai/gpt-3.5-turbo`
- **Anthropic Models**: `anthropic/claude-3-haiku`, `anthropic/claude-3-sonnet`
- **Google Models**: `google/gemini-pro`, `google/gemini-pro-vision`

## Image Support

The service supports multimodal requests with images:

### Supported Image Formats
- JPEG, PNG, GIF, WebP
- Images must be publicly accessible via URL
- Recommended maximum size: 20MB

### Image Usage Example

```javascript
const response = await callLLM({
  question: "What's happening in this image?",
  imageUrl: "https://example.com/image.jpg"
});
```

## Error Handling

The service provides comprehensive error handling:

### Common Error Types

1. **Configuration Errors**: Missing API keys or invalid configuration
2. **Network Errors**: Connection issues or timeouts
3. **API Errors**: Invalid requests or API limits
4. **Model Errors**: Model-specific issues or unsupported features

### Error Response Format

When `success` is `false`, the response includes an error message:

```javascript
{
  content: "",
  success: false,
  error: "Detailed error message"
}
```

## Best Practices

1. **Environment Variables**: Always use environment variables for API keys
2. **Error Handling**: Always check the `success` field before using `content`
3. **Rate Limiting**: Be mindful of API rate limits when making frequent requests
4. **Image URLs**: Ensure image URLs are publicly accessible and properly formatted
5. **Model Selection**: Choose appropriate models based on your use case and budget

## Integration Examples

### React Component

```jsx
import { useState } from 'react';
import { callLLM } from '../services/callLLM.ts';

function ChatComponent() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (question) => {
    setLoading(true);
    try {
      const result = await callLLM({ question });
      if (result.success) {
        setResponse(result.content);
      } else {
        setResponse(`Error: ${result.error}`);
      }
    } catch (error) {
      setResponse(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? 'Loading...' : response}
    </div>
  );
}
```

### Vue Component

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>{{ response }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { callLLM } from '../services/callLLM.ts';

const response = ref('');
const loading = ref(false);

const handleSubmit = async (question) => {
  loading.value = true;
  try {
    const result = await callLLM({ question });
    response.value = result.success ? result.content : `Error: ${result.error}`;
  } catch (error) {
    response.value = `Network error: ${error.message}`;
  } finally {
    loading.value = false;
  }
};
</script>
```

## Testing

```javascript
import { callLLM } from './callLLM.ts';

// Test basic functionality
describe('CallLLM Service', () => {
  test('should return successful response for valid question', async () => {
    const response = await callLLM({
      question: "What is 2+2?"
    });
    
    expect(response.success).toBe(true);
    expect(response.content).toBeTruthy();
  });

  test('should handle multimodal requests', async () => {
    const response = await callLLM({
      question: "Describe this image",
      imageUrl: "https://example.com/test-image.jpg"
    });
    
    expect(response.success).toBe(true);
    expect(response.content).toBeTruthy();
  });
});
```