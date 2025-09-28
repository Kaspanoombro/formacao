# Button Component

## Overview

The Button component is a reusable custom web element that provides a flexible and styled button interface. It consists of two main classes:

- **CustomButton**: A web component extending HTMLElement
- **Button**: A wrapper class for easier programmatic usage

## Features

- Custom web component with template loading
- Attribute observation for reactive updates
- Event handling with click callbacks
- Disabled state support
- CSS class customization
- Fallback rendering when templates fail
- Memory leak prevention with proper cleanup

## Usage

### As Web Component

```html
<!-- Basic usage -->
<custom-button text="Click Me"></custom-button>

<!-- With disabled state -->
<custom-button text="Submit" disabled></custom-button>

<!-- With custom classes -->
<custom-button text="Save" class="primary large"></custom-button>
```

### As JavaScript Class

```javascript
import { Button } from './Button.ts';

// Create a new button
const myButton = new Button({
  text: 'Click Me',
  onClick: () => {
    console.log('Button clicked!');
  },
  className: 'my-custom-class'
});

// Append to DOM
myButton.appendTo(document.body);

// Update button text
myButton.setText('Updated Text');

// Disable/enable button
myButton.setDisabled(true);
myButton.setDisabled(false);

// Remove from DOM
myButton.remove();
```

### Programmatic Web Component Usage

```javascript
// Create element
const button = document.createElement('custom-button');
button.setAttribute('text', 'Dynamic Button');

// Set click handler
button.onClick = () => {
  alert('Button clicked!');
};

// Append to DOM
document.body.appendChild(button);

// Update properties
button.setText('New Text');
button.setDisabled(true);
```

## API Reference

### CustomButton (Web Component)

#### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `text` | string | The text to display on the button |
| `disabled` | boolean | Whether the button is disabled |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `onClick` | `(handler: () => void)` | Sets the click event handler |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getButtonElement()` | - | `HTMLButtonElement` | Gets the underlying button element |
| `setText(text)` | `text: string` | `void` | Sets the button text |
| `setDisabled(disabled)` | `disabled: boolean` | `void` | Sets the disabled state |

#### Lifecycle Methods

| Method | Description |
|--------|-------------|
| `connectedCallback()` | Called when element is added to DOM |
| `disconnectedCallback()` | Called when element is removed from DOM |
| `attributeChangedCallback()` | Called when observed attributes change |

### Button (Wrapper Class)

#### Constructor

```javascript
new Button(options: ButtonOptions)
```

**ButtonOptions:**
- `text: string` - The button text
- `onClick: () => void` - Click event handler
- `className?: string` - Optional CSS classes

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getElement()` | - | `HTMLElement` | Gets the underlying custom element |
| `appendTo(parent)` | `parent: HTMLElement` | `void` | Appends button to parent element |
| `setText(text)` | `text: string` | `void` | Updates button text |
| `setDisabled(disabled)` | `disabled: boolean` | `void` | Sets disabled state |
| `remove()` | - | `void` | Removes button from DOM |

## Events

The button component supports click events through the `onClick` property or event handler.

```javascript
// Using onClick property
button.onClick = () => {
  console.log('Button was clicked!');
};

// Using addEventListener (on the underlying button element)
const buttonElement = button.getButtonElement();
buttonElement.addEventListener('click', (event) => {
  console.log('Click event:', event);
});
```

## Styling

The component loads CSS from `button.css`. You can customize the appearance by:

1. Modifying the CSS file
2. Adding custom classes via the `className` option
3. Overriding styles in your application CSS

```css
/* Example custom styling */
.custom-button.primary {
  background-color: #007bff;
  color: white;
}

.custom-button.large {
  padding: 12px 24px;
  font-size: 16px;
}
```

## Browser Compatibility

This component uses modern web standards:
- Custom Elements API
- Template elements
- ES6 classes
- Modern JavaScript features

Ensure your target browsers support these features or include appropriate polyfills.

## Error Handling

The component includes fallback rendering when template loading fails:
- Gracefully degrades to inline HTML
- Logs errors to console for debugging
- Maintains functionality even without external templates

## Best Practices

1. **Memory Management**: The component automatically removes event listeners on disconnect
2. **Attribute Updates**: Use the provided methods rather than direct attribute manipulation
3. **Event Handling**: Set click handlers through the `onClick` property for proper cleanup
4. **Styling**: Use CSS classes rather than inline styles for better maintainability
5. **Testing**: Test both web component and wrapper class usage patterns