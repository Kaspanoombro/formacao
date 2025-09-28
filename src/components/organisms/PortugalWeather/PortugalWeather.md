# PortugalWeather Component

A TypeScript web component that displays current temperature data for major Portuguese cities using the IPMA (Instituto Português do Mar e da Atmosfera) weather service.

## Overview

The PortugalWeather component is an organism-level component that creates a weather widget displaying real-time temperature information for Lisboa, Porto, and Coimbra. It automatically fetches data from the IPMA API and provides a clean, responsive interface for viewing current weather conditions.

## Features

- **Real-time Data**: Automatically fetches current temperature data from IPMA
- **Multiple Cities**: Displays temperatures for Lisboa, Porto, and Coimbra
- **Status Updates**: Shows loading states and data availability status
- **Error Handling**: Graceful handling of API failures
- **Web Component**: Standards-based custom element implementation
- **Responsive Design**: Adapts to different screen sizes

## Component Structure

```
PortugalWeather (Organism)
├── Title: "Current temperature (IPMA)"
├── Status: Loading/Update information
└── City List
    ├── CityTemperature (Lisboa)
    ├── CityTemperature (Porto)
    └── CityTemperature (Coimbra)
```

## Usage

### HTML Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="./PortugalWeather.ts"></script>
</head>
<body>
    <!-- Direct HTML usage -->
    <pt-weather></pt-weather>
</body>
</html>
```

### JavaScript Usage

```typescript
import { createPortugalWeather } from './PortugalWeather.ts';

// Factory function approach
const weatherWidget = createPortugalWeather();
document.body.appendChild(weatherWidget);

// Direct element creation
const weather = document.createElement('pt-weather');
document.body.appendChild(weather);
```

### Framework Integration

#### React
```tsx
import React, { useEffect, useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pt-weather': any;
    }
  }
}

const WeatherWidget: React.FC = () => {
  const weatherRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Component will auto-initialize when connected
  }, []);

  return <pt-weather ref={weatherRef} />;
};
```

#### Vue
```vue
<template>
  <pt-weather @vue:mounted="handleMounted" />
</template>

<script>
export default {
  methods: {
    handleMounted() {
      // Component is ready and will fetch data
    }
  }
}
</script>
```

## API Reference

### Factory Function

#### `createPortugalWeather(): HTMLElement`

Creates and returns a new PortugalWeather component instance.

**Returns:**
- `HTMLElement`: A custom HTML element instance of the pt-weather component

**Example:**
```typescript
import { createPortugalWeather } from './PortugalWeather.ts';

const weatherWidget = createPortugalWeather();
document.body.appendChild(weatherWidget);
```

### Custom Element: `<pt-weather>`

The main web component that handles weather data display.

#### Properties

- **cities**: `CityName[]` - Array of supported cities (Lisboa, Porto, Coimbra)
- **statusEl**: `HTMLElement` - Internal status display element
- **cityRefs**: `Map<CityName, CityTemperatureRefs>` - References to city components

#### Methods

##### `connectedCallback(): void`

Lifecycle method called when the element is connected to the DOM. Automatically initializes the component and fetches initial data.

##### `refresh(): Promise<void>`

Manually refreshes temperature data from the IPMA API.

**Example:**
```typescript
const weatherWidget = document.querySelector('pt-weather') as any;
await weatherWidget.refresh();
```

##### `render(): void` (private)

Internal method that creates the component's HTML structure and initializes city temperature components.

## Component States

### Loading State
- **Display**: "Loading…" status message
- **Behavior**: Shows while initial data is being fetched
- **Duration**: Typically 1-3 seconds depending on network conditions

### Success State
- **Display**: "Updated now" status message
- **Behavior**: Temperature data is displayed for all available cities
- **Data**: Shows actual temperature values in Celsius

### No Data State
- **Display**: "No data available" status message
- **Behavior**: API returned successfully but no valid temperature data
- **Common Causes**: All weather stations reporting invalid readings

### Error State
- **Display**: "Failed to fetch data" status message
- **Behavior**: Network error or API failure occurred
- **Fallback**: Component remains functional, manual refresh possible

## Styling

The component uses BEM-style CSS classes:

```css
.weather-pt {
  /* Main container */
}

.weather-pt__title {
  /* Title styling */
}

.weather-pt__status {
  /* Status message styling */
}

.weather-pt__list {
  /* City list container */
}
```

### CSS Variables

You can customize the appearance using CSS custom properties:

```css
pt-weather {
  --weather-bg: #f5f5f5;
  --weather-text: #333;
  --weather-border: #ddd;
}
```

## Data Flow

1. **Initialization**: Component connects to DOM
2. **Rendering**: Creates HTML structure with placeholder data
3. **Data Fetching**: Calls IPMA service to get current temperatures
4. **Update**: Populates city components with real temperature data
5. **Status Update**: Shows success/error status to user

## Error Handling

The component implements robust error handling:

- **Network Failures**: Silent handling with error status display
- **Invalid Data**: Filters out invalid temperature readings
- **API Errors**: Graceful degradation with user-friendly messages
- **Missing Dependencies**: Fails gracefully if city components unavailable

## Dependencies

### Internal Dependencies
- `CityTemperature` component (molecules)
- `ipma.service` (services)

### External Dependencies
- Modern browser with Web Components support
- Network access for IPMA API calls

## Browser Compatibility

- **Chrome/Edge**: Full support (v67+)
- **Firefox**: Full support (v63+)
- **Safari**: Full support (v13+)
- **IE**: Not supported (requires Web Components polyfill)

## Performance Considerations

- **Initial Load**: Single API call for all cities
- **Data Caching**: No built-in caching (handled by IPMA service)
- **Re-renders**: Minimal DOM manipulation after initial render
- **Memory**: Automatic cleanup when element is disconnected

## Testing

### Unit Testing
```typescript
import { createPortugalWeather } from './PortugalWeather.ts';

describe('PortugalWeather', () => {
  test('creates component instance', () => {
    const component = createPortugalWeather();
    expect(component.tagName).toBe('PT-WEATHER');
  });

  test('initializes with loading state', () => {
    const component = createPortugalWeather();
    document.body.appendChild(component);
    
    const status = component.querySelector('.weather-pt__status');
    expect(status.textContent).toBe('Loading…');
  });
});
```

### Integration Testing
```typescript
import { jest } from '@jest/globals';

// Mock IPMA service
jest.mock('../../../services/ipma.service.ts', () => ({
  fetchCurrentTemps: jest.fn().mockResolvedValue({
    Lisboa: { city: 'Lisboa', temperature: 22.5 },
    Porto: { city: 'Porto', temperature: 18.3 },
    Coimbra: { city: 'Coimbra', temperature: 20.1 }
  })
}));
```

## Accessibility

- **Semantic HTML**: Uses proper heading structure
- **ARIA Labels**: Status updates are announced to screen readers
- **Keyboard Navigation**: Standard tab navigation support
- **Color Contrast**: Ensures readable text contrast ratios

## Migration Guide

### From v1 to v2
- No breaking changes in component API
- CSS class names remain unchanged
- New refresh method available for manual updates

## Contributing

When contributing to this component:

1. Maintain TypeScript strict mode compliance
2. Add JSDoc comments for all public methods
3. Include unit tests for new functionality
4. Follow BEM naming conventions for CSS classes
5. Ensure accessibility standards are met