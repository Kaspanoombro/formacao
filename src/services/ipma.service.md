# IPMA Service

A TypeScript service for fetching current temperature data from Portuguese cities using the IPMA (Instituto Português do Mar e da Atmosfera) public API.

## Overview

The IPMA Service provides functionality to retrieve real-time weather data from the Portuguese Institute for Sea and Atmosphere public API. It finds the closest weather stations to major Portuguese cities and extracts temperature readings from actual weather observation data.

## Features

- **Real-time Data**: Fetches current weather observations from IPMA API
- **Distance Calculation**: Uses Haversine formula to find closest weather stations
- **Error Handling**: Defensive programming with graceful error handling
- **Type Safety**: Full TypeScript support with proper interfaces
- **Data Validation**: Filters out invalid temperature readings (-99.0°C sentinel values)

## Supported Cities

- **Lisboa** (Lisbon) - Coordinates: 38.7223°N, 9.1393°W
- **Porto** - Coordinates: 41.1579°N, 8.6291°W
- **Coimbra** - Coordinates: 40.2033°N, 8.4103°W

## API Reference

### Main Function

#### `fetchCurrentTemps(cities: CityName[]): Promise<Record<CityName, CityTemperature>>`

Fetches current temperatures for specified Portuguese cities.

**Parameters:**
- `cities`: Array of city names to fetch temperatures for

**Returns:**
- Promise that resolves to a record mapping city names to temperature data

**Example:**
```typescript
import { fetchCurrentTemps } from './ipma.service.ts';

// Fetch temperatures for specific cities
const temps = await fetchCurrentTemps(['Lisboa', 'Porto']);
console.log(`Lisboa: ${temps.Lisboa.temperature}°C`);
console.log(`Porto: ${temps.Porto.temperature}°C`);

// Handle cases where temperature data might be unavailable
if (temps.Lisboa.temperature !== null) {
  console.log(`Lisboa temperature observed at: ${temps.Lisboa.observedAt}`);
} else {
  console.log('Lisboa temperature data unavailable');
}

// Fetch all available cities
const allTemps = await fetchCurrentTemps(['Lisboa', 'Porto', 'Coimbra']);
```

### Utility Functions

#### `calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number`

Calculate the distance between two coordinates using Haversine formula.

**Parameters:**
- `lat1`: Latitude of the first point in decimal degrees
- `lon1`: Longitude of the first point in decimal degrees
- `lat2`: Latitude of the second point in decimal degrees
- `lon2`: Longitude of the second point in decimal degrees

**Returns:**
- The distance between the two points in kilometers

**Example:**
```typescript
// Calculate distance between Lisbon and Porto
const distance = calculateDistance(38.7223, -9.1393, 41.1579, -8.6291);
console.log(`Distance: ${distance.toFixed(2)} km`); // Distance: ~274.15 km
```

#### `toNumber(n: unknown): number | null`

Safely converts an unknown value to a finite number or null.

**Parameters:**
- `n`: The value to convert to a number

**Returns:**
- The converted number if valid and finite, null otherwise

**Example:**
```typescript
toNumber(42);      // returns 42
toNumber("3.14");  // returns 3.14
toNumber("abc");   // returns null
toNumber(NaN);     // returns null
toNumber(Infinity); // returns null
```

## Data Types

### CityName
```typescript
type CityName = 'Lisboa' | 'Porto' | 'Coimbra';
```

### CityTemperature
```typescript
interface CityTemperature {
  city: CityName;
  temperature: number | null;
  observedAt?: string;
}
```

## Error Handling

The service implements defensive programming practices:

- **Network Failures**: Silent failure with null temperature values
- **Invalid Data**: Filters out -99.0°C sentinel values and non-finite numbers
- **Missing Stations**: Graceful handling when no valid weather stations are found
- **API Errors**: HTTP errors are caught and handled gracefully

## Usage Patterns

### Basic Usage
```typescript
import { fetchCurrentTemps } from './ipma.service.ts';

const temperatures = await fetchCurrentTemps(['Lisboa', 'Porto']);
```

### Error Handling
```typescript
try {
  const temperatures = await fetchCurrentTemps(['Lisboa', 'Porto', 'Coimbra']);
  
  Object.entries(temperatures).forEach(([city, data]) => {
    if (data.temperature !== null) {
      console.log(`${city}: ${data.temperature}°C`);
    } else {
      console.log(`${city}: Temperature data unavailable`);
    }
  });
} catch (error) {
  console.error('Failed to fetch temperatures:', error);
}
```

### React Component Integration
```typescript
import React, { useState, useEffect } from 'react';
import { fetchCurrentTemps, CityName } from './ipma.service.ts';

const WeatherComponent: React.FC = () => {
  const [temperatures, setTemperatures] = useState<Record<CityName, CityTemperature>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemperatures = async () => {
      try {
        const temps = await fetchCurrentTemps(['Lisboa', 'Porto', 'Coimbra']);
        setTemperatures(temps);
      } finally {
        setLoading(false);
      }
    };

    loadTemperatures();
  }, []);

  if (loading) return <div>Loading temperatures...</div>;

  return (
    <div>
      {Object.entries(temperatures).map(([city, data]) => (
        <div key={city}>
          {city}: {data.temperature ? `${data.temperature}°C` : 'N/A'}
        </div>
      ))}
    </div>
  );
};
```

## API Endpoint

The service uses the following IPMA public API endpoint:
- **URL**: `https://api.ipma.pt/open-data/observation/meteorology/stations/obs-surface.geojson`
- **Format**: GeoJSON with weather station observations
- **Update Frequency**: Real-time (cache disabled)
- **Rate Limiting**: Follow IPMA API guidelines

## Testing Considerations

When testing this service:

- **Mock `fetch`**: Network calls should be mocked in unit tests
- **Test Error Cases**: Verify graceful handling of API failures
- **Validate Data**: Test with various temperature values including edge cases
- **Distance Calculation**: Verify Haversine formula accuracy

## Dependencies

- **External**: None (uses native `fetch` API)
- **Internal**: Requires IPMA interface types from `../interfaces/ipma.interface.ts`

## Browser Compatibility

- Modern browsers with `fetch` API support
- Node.js environments with fetch polyfill or native fetch (Node 18+)