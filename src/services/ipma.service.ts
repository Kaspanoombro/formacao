/**
 * IPMA Service: fetch current temperatures for Portuguese cities using observation endpoints.
 * NOTE: Network may fail in tests; tests should mock fetch. This code is defensive and
 * parses the observation GeoJSON payload, using actual temperature readings from weather stations.
 */
import type {
  CityName,
  CityTemperature,
  IPMAObservationResponse,
  IPMAObservationFeature,
} from '../interfaces/ipma.interface.ts';

export type { CityName } from '../interfaces/ipma.interface.ts';



// Approximate coordinates for Portuguese cities to find closest weather stations
const CITY_COORDINATES: Record<CityName, [number, number]> = {
  Lisboa: [38.7223, -9.1393], // [latitude, longitude]
  Porto: [41.1579, -8.6291],
  Coimbra: [40.2033, -8.4103],
};

function toNumber(n: unknown): number | null {
  if (typeof n === 'number' && isFinite(n)) return n;
  if (typeof n === 'string') {
    const v = Number(n);
    return Number.isFinite(v) ? v : null;
  }
  return null;
}

// Calculate distance between two coordinates using Haversine formula
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

async function fetchObservations(): Promise<IPMAObservationResponse> {
  const res = await fetch(
    'https://api.ipma.pt/open-data/observation/meteorology/stations/obs-surface.geojson',
    { cache: 'no-store' as RequestCache });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

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
    
    // Find closest station for each city and extract temperature
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
