# ChatAI Component

A TypeScript web component that provides an interactive AI chat interface with LLM integration, message history, and customizable appearance and behavior.

## Overview

The ChatAI component is an organism-level component that creates a complete chat experience with AI integration. It combines multiple sub-components (TextLog for message display and UserPrompt for input) to provide a seamless conversational interface powered by Large Language Models through the callLLM service.

## Features

- **AI Integration**: Automatic LLM responses through callLLM service
- **Message History**: Persistent chat log with timestamps
- **Real-time Interaction**: Immediate message processing and display
- **Customizable UI**: Configurable title, placeholder, and button text
- **Flexible Layout**: Adjustable height and responsive design
- **Export/Import**: Chat log persistence capabilities
- **Event Handling**: Custom message handlers and callbacks
- **Error Handling**: Graceful handling of API failures

## Usage

### HTML Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="./chatAI.ts"></script>
</head>
<body>
    <!-- Basic usage -->
    <chat-ai title="AI Assistant" placeholder="Ask me anything..."></chat-ai>
    
    <!-- Advanced configuration -->
    <chat-ai 
        title="Customer Support Bot"
        placeholder="How can I help you today?"
        submit-button-text="Send Message"
        max-height="600px"
        show-timestamps="true">
    </chat-ai>
</body>
</html>
```

### JavaScript Factory Function

```typescript
import { createChatAI } from './chatAI.ts';

// Create with custom options
const chatAI = createChatAI({
  title: 'AI Assistant',
  placeholder: 'Type your question here...',
  submitButtonText: 'Send',
  maxHeight: '500px',
  showTimestamps: true,
  onMessage: (message) => {
    console.log('User sent:', message);
  }
});

document.body.appendChild(chatAI);

// Create with default options
const simpleChat = createChatAI();
document.getElementById('chat-container').appendChild(simpleChat);
```

### Programmatic Usage

```typescript
// Direct element creation
const chatAI = document.createElement('chat-ai') as ChatAI;
chatAI.setAttribute('title', 'My AI Helper');
chatAI.setAttribute('max-height', '600px');
chatAI.setAttribute('show-timestamps', 'true');

// Set up message handler
chatAI.onMessage = (message) => {
  console.log('User message:', message);
};

document.body.appendChild(chatAI);
```

## API Reference

### Factory Function

#### `createChatAI(options?: ChatAIOptions): ChatAI`

Creates and configures a chat-ai custom element with the specified options.

**Parameters:**
- `options` (optional): Configuration options for the chat component

**Returns:**
- `ChatAI`: A configured ChatAI custom element

### Configuration Interface

#### `ChatAIOptions`

Configuration options for creating a ChatAI component instance.

```typescript
interface ChatAIOptions {
  title?: string;                    // Title displayed at top of chat
  placeholder?: string;              // Input field placeholder text
  submitButtonText?: string;         // Submit button text
  maxHeight?: string;               // Maximum height (CSS value)
  showTimestamps?: boolean;         // Show message timestamps
  onMessage?: (message: string) => void; // Message callback handler
}
```

### Custom Element: `<chat-ai>`

The main web component that handles the chat interface.

#### Attributes

- **title**: Sets the chat interface title (default: "AI Chat")
- **placeholder**: Sets the input field placeholder text
- **submit-button-text**: Sets the submit button text
- **max-height**: Sets the maximum height of the chat container
- **show-timestamps**: Enables/disables message timestamps ("true"/"false")

#### Properties

- **textLogEl**: Reference to the text log component
- **userPromptEl**: Reference to the user prompt component
- **containerEl**: Reference to the main container element
- **titleEl**: Reference to the title element

#### Methods

##### `onMessage` (setter)
```typescript
set onMessage(handler: (message: string) => void)
```
Sets the message handler callback function called when a user sends a message.

##### `addMessage(type, text, timestamp?)`
```typescript
addMessage(type: 'user' | 'ai' | 'system', text: string, timestamp?: Date): void
```
Adds a message to the chat log.

**Parameters:**
- `type`: The type of message ('user', 'ai', or 'system')
- `text`: The message content
- `timestamp`: Optional timestamp (defaults to current time)

**Example:**
```typescript
chatAI.addMessage('user', 'Hello, how are you?');
chatAI.addMessage('ai', 'I am doing well, thank you for asking!');
chatAI.addMessage('system', 'Connection established', new Date());
```

##### `clearChat()`
```typescript
clearChat(): void
```
Clears all messages from the chat log.

##### `focus()`
```typescript
focus(): void
```
Focuses the input field for user interaction.

##### `scrollToBottom()`
```typescript
scrollToBottom(): void
```
Scrolls the chat log to the bottom to show the latest messages.

##### `exportChatLog()`
```typescript
exportChatLog(): LogEntry[]
```
Exports the current chat log entries.

**Returns:**
- Array of log entries containing message history

**Example:**
```typescript
const chatHistory = chatAI.exportChatLog();
localStorage.setItem('chat-backup', JSON.stringify(chatHistory));
```

##### `importChatLog(entries)`
```typescript
importChatLog(entries: LogEntry[]): void
```
Imports chat log entries into the chat.

**Parameters:**
- `entries`: Array of log entries to import

**Example:**
```typescript
const savedHistory = JSON.parse(localStorage.getItem('chat-backup') || '[]');
chatAI.importChatLog(savedHistory);
```

## Component Architecture

```
ChatAI (Organism)
├── Header
│   └── Title Element
├── Content Area
│   ├── TextLog Component (Message Display)
│   │   ├── User Messages
│   │   ├── AI Responses  
│   │   └── System Messages
│   └── UserPrompt Component (Input Area)
│       ├── Input Field
│       └── Submit Button
└── Styling & Layout
```

## Message Flow

1. **User Input**: User types message and clicks submit or presses Enter
2. **Message Display**: User message is immediately added to chat log
3. **LLM Call**: Message is sent to callLLM service for AI processing
4. **AI Response**: AI response is received and displayed in chat log
5. **Error Handling**: Any errors are caught and displayed as error messages
6. **Callback Execution**: Optional onMessage callback is triggered

## Styling

The component uses CSS custom properties for theming:

```css
chat-ai {
  --chat-ai-max-height: 400px;
  --chat-ai-bg: #ffffff;
  --chat-ai-border: #e1e1e1;
  --chat-ai-text: #333333;
  --chat-ai-user-bg: #007bff;
  --chat-ai-ai-bg: #f8f9fa;
}
```

### CSS Classes

- `.chat-ai-container`: Main container element
- `.chat-ai-header`: Header section with title
- `.chat-ai-title`: Title element
- `.chat-ai-content`: Content area containing log and input
- `.chat-ai-log`: Text log component area
- `.chat-ai-input`: User prompt component area

## Event Handling

The component handles several types of events:

- **User Submit**: When user submits a message
- **Attribute Changes**: When observed attributes are modified
- **AI Response**: When LLM service returns a response
- **Error Events**: When API calls or processing fails

## Error Handling

The component implements comprehensive error handling:

- **API Failures**: LLM service errors are caught and displayed
- **Network Issues**: Connection problems show appropriate messages
- **Invalid Input**: Input validation prevents empty submissions
- **Template Loading**: Fallback rendering when templates fail

## Framework Integration

### React
```tsx
import React, { useRef, useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'chat-ai': any;
    }
  }
}

const ChatComponent: React.FC = () => {
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.onMessage = (message: string) => {
        console.log('User message:', message);
      };
    }
  }, []);

  return (
    <chat-ai
      ref={chatRef}
      title="AI Assistant"
      placeholder="Type your message..."
      show-timestamps="true"
    />
  );
};
```

### Vue
```vue
<template>
  <chat-ai
    :title="chatTitle"
    :placeholder="inputPlaceholder"
    :show-timestamps="showTimestamps"
    @vue:mounted="setupChat"
  />
</template>

<script>
export default {
  data() {
    return {
      chatTitle: 'AI Helper',
      inputPlaceholder: 'Ask me anything...',
      showTimestamps: true
    };
  },
  methods: {
    setupChat(el) {
      el.onMessage = (message) => {
        this.$emit('user-message', message);
      };
    }
  }
};
</script>
```

## Performance Considerations

- **Message Throttling**: Prevents spam by limiting rapid submissions
- **Memory Management**: Automatic cleanup of event listeners
- **Efficient Rendering**: Minimal DOM manipulation after initial render
- **Lazy Loading**: Components load templates and styles on demand

## Accessibility

- **Keyboard Navigation**: Full keyboard support with tab navigation
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Automatic focus handling for user input
- **Color Contrast**: High contrast ratios for readability

## Testing

### Unit Testing
```typescript
import { createChatAI } from './chatAI.ts';

describe('ChatAI Component', () => {
  test('creates component with options', () => {
    const chat = createChatAI({
      title: 'Test Chat',
      placeholder: 'Test placeholder'
    });
    
    expect(chat.getAttribute('title')).toBe('Test Chat');
    expect(chat.getAttribute('placeholder')).toBe('Test placeholder');
  });

  test('adds messages to chat log', () => {
    const chat = createChatAI();
    document.body.appendChild(chat);
    
    chat.addMessage('user', 'Test message');
    const messages = chat.exportChatLog();
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('Test message');
  });
});
```

### Integration Testing
```typescript
// Mock the callLLM service
jest.mock('../../../services/callLLM.ts', () => ({
  callLLM: jest.fn().mockResolvedValue({
    success: true,
    content: 'Mocked AI response'
  })
}));
```

## Browser Compatibility

- **Chrome/Edge**: Full support (v67+)
- **Firefox**: Full support (v63+)  
- **Safari**: Full support (v13+)
- **Mobile**: Responsive design works on all modern mobile browsers

## Dependencies

### Internal Dependencies
- TextLog component (atoms)
- UserPrompt component (molecules)
- callLLM service
- LogEntry interface

### External Dependencies
- Modern browser with Web Components support
- Network access for LLM API calls

## Contributing

When contributing to this component:

1. Maintain TypeScript strict mode compliance
2. Add JSDoc comments for all public methods
3. Include comprehensive unit tests
4. Follow established CSS naming conventions
5. Ensure accessibility standards compliance
6. Test with multiple LLM providers