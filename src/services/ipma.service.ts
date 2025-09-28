/**
 * IPMA Service: fetch current temperatures for Portuguese cities using observation endpoints.
 * NOTE: Network may fail in tests; tests should mock fetch. This code is defensive and
 * parses the observation GeoJSON payload, using actual temperature readings from weather stations.
 * 
 * This service provides functionality to retrieve real-time weather data from the Portuguese
 * Institute for Sea and Atmosphere (IPMA) public API, finding the closest weather stations
 * to major Portuguese cities and extracting temperature readings.
 * 
 * @example
 * ```JavaScript
 * import { fetchCurrentTemps } from './ipma.service.ts';
 * 
 * // Fetch temperatures for specific cities
 * const temps = await fetchCurrentTemps(['Lisboa', 'Porto']);
 * console.log(temps.Lisboa.temperature); // Current temperature in Celsius
 * 
 * // Fetch all available cities
 * const allTemps = await fetchCurrentTemps(['Lisboa', 'Porto', 'Coimbra']);
 * ```
 */
import type {
  CityName,
  CityTemperature,
  IPMAObservationResponse,
  IPMAObservationFeature,
} from '../interfaces/ipma.interface.ts';

export type { CityName } from '../interfaces/ipma.interface.ts';



/**
 * Approximate coordinates for Portuguese cities to find the closest weather stations
 * Contains latitude and longitude pairs for major Portuguese cities used to calculate
 * the distance to weather observation stations
 * 
 * @constant
 * @type {Record<CityName, [number, number]>}
 */
const CITY_COORDINATES: Record<CityName, [number, number]> = {
  Lisboa: [38.7223, -9.1393], // [latitude, longitude]
  Porto: [41.1579, -8.6291],
  Coimbra: [40.2033, -8.4103],
};

/**
 * Safely converts an unknown value to a finite number or null
 * Handles both numeric and string inputs, ensuring only valid finite numbers are returned
 * 
 * @param n - The value to convert to a number
 * @returns The converted number if valid and finite, null otherwise
 * 
 * @example
 * ```JavaScript
 * toNumber(42); // returns 42
 * toNumber("3.14"); // returns 3.14
 * toNumber("abc"); // returns null
 * toNumber(NaN); // returns null
 * toNumber(Infinity); // returns null
 * ```
 */
function toNumber(n: unknown): number | null {
  if (typeof n === 'number' && isFinite(n)) return n;
  if (typeof n === 'string') {
    const v = Number(n);
    return Number.isFinite(v) ? v : null;
  }
  return null;
}

/**
 * Calculate the distance between two coordinates using Haversine formula
 * This formula calculates the shortest distance between two points on the surface
 * of a sphere (Earth), given their latitude and longitude coordinates
 * 
 * @param lat1 - Latitude of the first point in decimal degrees
 * @param lon1 - Longitude of the first point in decimal degrees
 * @param lat2 - Latitude of the second point in decimal degrees
 * @param lon2 - Longitude of the second point in decimal degrees
 * @returns The distance between the two points in kilometers
 * 
 * @example
 * ```JavaScript
 * // Calculate distance between Lisbon and Porto
 * const distance = calculateDistance(38.7223, -9.1393, 41.1579, -8.6291);
 * console.log(`Distance: ${distance.toFixed(2)} km`); // Distance: ~274.15 km
 * ```
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Find the closest weather station to a given city with valid temperature data
 * Calculates distances from the city coordinates to all available weather stations
 * and returns the nearest one that has valid temperature readings
 * 
 * @param city - The city name to find the closest station for
 * @param observations - Array of weather station observation features from IPMA API
 * @returns The closest weather station feature or null if no valid station found
 * 
 * @example
 * ```JavaScript
 * const observations = await fetchObservations();
 * const closestStation = findClosestStation('Lisboa', observations.features);
 * if (closestStation) {
 *   console.log(`Temperature: ${closestStation.properties.temperatura}°C`);
 * }
 * ```
 */
function findClosestStation(city: CityName, observations: IPMAObservationFeature[]): IPMAObservationFeature | null {
  const [cityLat, cityLon] = CITY_COORDINATES[city];
  let closestStation: IPMAObservationFeature | null = null;
  let minDistance = Infinity;

  for (const station of observations) {
    const [stationLon, stationLat] = station.geometry.coordinates;
    // Skip stations with invalid temperature data
    if (station.properties.temperatura === -99.0 || !isFinite(station.properties.temperatura)) {
      continue;
    }
    
    const distance = calculateDistance(cityLat, cityLon, stationLat, stationLon);
    if (distance < minDistance) {
      minDistance = distance;
      closestStation = station;
    }
  }

  return closestStation;
}

/**
 * Fetch weather observations from IPMA API
 * Retrieves current weather station data in GeoJSON format from the Portuguese
 * Institute for Sea and Atmosphere public API endpoint
 * 
 * @returns Promise that resolves to the complete IPMA observation response
 * @throws Error when the HTTP request fails
 * 
 * @example
 * ```JavaScript
 * try {
 *   const observations = await fetchObservations();
 *   console.log(`Found ${observations.features.length} weather stations`);
 * } catch (error) {
 *   console.error('Failed to fetch weather data:', error.message);
 * }
 * ```
 */
async function fetchObservations(): Promise<IPMAObservationResponse> {
  const res = await fetch(
    'https://api.ipma.pt/open-data/observation/meteorology/stations/obs-surface.geojson',
    { cache: 'no-store' as RequestCache });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

/**
 * Fetch current temperatures for specified Portuguese cities
 * Retrieves real-time temperature data by finding the closest weather stations
 * to each requested city and extracting valid temperature readings
 * 
 * @param cities - Array of city names to fetch temperatures for
 * @returns Promise that resolves to a record mapping city names to temperature data
 * 
 * @example
 * ```JavaScript
 * // Fetch temperatures for specific cities
 * const temps = await fetchCurrentTemps(['Lisboa', 'Porto']);
 * console.log(`Lisboa: ${temps.Lisboa.temperature}°C`);
 * console.log(`Porto: ${temps.Porto.temperature}°C`);
 * 
 * // Handle cases where temperature data might be unavailable
 * if (temps.Lisboa.temperature !== null) {
 *   console.log(`Lisboa temperature observed at: ${temps.Lisboa.observedAt}`);
 * } else {
 *   console.log('Lisboa temperature data unavailable');
 * }
 * 
 * // Fetch all available cities
 * const allTemps = await fetchCurrentTemps(['Lisboa', 'Porto', 'Coimbra']);
 * ```
 */
export async function fetchCurrentTemps(
  cities: CityName[],
): Promise<Record<CityName, CityTemperature>> {
  const result: Record<CityName, CityTemperature> = {
    Lisboa: { city: 'Lisboa', temperature: null },
    Porto: { city: 'Porto', temperature: null },
    Coimbra: { city: 'Coimbra', temperature: null },
  };

  try {
    // Fetch all weather station observations
    const observations = await fetchObservations();
    
    // Find the closest station for each city and extract temperature
    for (const city of cities) {
      try {
        const closestStation = findClosestStation(city, observations.features);
        if (closestStation) {
          const temperature = toNumber(closestStation.properties.temperatura);
          if (temperature !== null && temperature !== -99.0) {
            result[city] = {
              city,
              temperature,
              observedAt: closestStation.properties.time,
            } as CityTemperature;
          }
        }
      } catch {
        // Keep null for this city if processing fails
      }
    }
  } catch {
    // Silent fail; keep nulls for all cities
  }

  return result;
}
