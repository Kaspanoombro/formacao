/**
 * IPMA Service: fetch forecast temperatures for Portuguese cities using official endpoints.
 * NOTE: Network may fail in tests; tests should mock fetch. This code is defensive and
 * parses the daily forecast payload, using today's tMax (fallback to tMin) as display value.
 */
import type {
  CityName,
  CityTemperature,
  IPMACities,
  IPMACityForecast,
} from '../interfaces/ipma.interface.ts';



// Static mapping per issue description to avoid extra network calls.
const CITY_IDS: Record<CityName, number> = {
  Lisboa: 1110600,
  Porto: 1010500,
  Coimbra: 1030300,
};

function toNumber(n: unknown): number | null {
  if (typeof n === 'number' && isFinite(n)) return n;
  if (typeof n === 'string') {
    const v = Number(n);
    return Number.isFinite(v) ? v : null;
  }
  return null;
}

function pickTodayForecast(forecast: IPMACityForecast[]): IPMACityForecast | null {
  if (!Array.isArray(forecast)) return null;
  // Prefer the first entry (usually today). If there are dates, match today.
  const today = new Date().toISOString().slice(0, 10);
  const byDate = forecast.find(
    (f) => typeof f?.forecastDate === 'string' && f.forecastDate.startsWith(today),
  );
  return byDate ?? forecast[0] ?? null;
}

async function fetchCityForecast(localId: number): Promise<IPMACities> {
  const res = await fetch(
    `https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/${localId}.json`,
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
    // Fetch all city forecasts in parallel
    const tasks = cities.map(async (city) => {
      const id = CITY_IDS[city];
      if (!id) return;
      try {
        const data: IPMACities  = await fetchCityForecast(id);
        const fc = pickTodayForecast(data?.data ?? []);
        // Support both IPMA key styles: tMax/tMin (camel case) and tMax/tMin (lowercase)
        const tMax = toNumber(fc?.tMax ?? fc?.tMax);
        const tMin = toNumber(fc?.tMin ?? fc?.tMin);
        const chosen = tMax ?? tMin ?? null;
        if (chosen != null) {
          result[city] = {
            city,
            temperature: chosen,
            observedAt: fc?.forecastDate || new Date().toISOString(),
          } as CityTemperature;
        }
      } catch {
        // Keep nulls for this city
      }
    });
    await Promise.all(tasks);
  } catch {
    // Silent fail; keep nulls
  }

  return result;
}
