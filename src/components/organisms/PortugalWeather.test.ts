import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPortugalWeather } from './PortugalWeather';

// Mock payloads for forecast endpoints per city id
const makeForecast = (tMax: number, tMin?: number) => ({
  dataUpdate: '2025-09-21T12:00:00',
  forecastDate: '2025-09-21T00:00:00',
  location: { local: 'X' },
  forecast: [
    {
      forecastDate: '2025-09-21T00:00:00',
      tMin: tMin ?? Math.max(0, tMax - 8),
      tMax: tMax,
      idWeatherType: 1,
    },
  ],
});

describe('Organism: PortugalWeather', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders three city blocks and updates temperatures from IPMA forecast', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        // Decide response by city id present in the url
        if (url.includes('1110600')) {
          return { ok: true, json: async () => makeForecast(28.0) } as Response;
        }
        if (url.includes('1010500')) {
          return { ok: true, json: async () => makeForecast(22.5) } as Response;
        }
        if (url.includes('1030300')) {
          return { ok: true, json: async () => makeForecast(24.2) } as Response;
        }
        return { ok: true, json: async () => ({}) } as Response;
      }),
    );

    const el = createPortugalWeather();
    // Ensure the custom element is connected so lifecycle runs
    document.body.appendChild(el);

    // Initially shows loading status and placeholders
    expect(el.querySelector('.weather-pt__status')?.textContent).toContain('Loading…');
    const values = el.querySelectorAll('.city-temp__value');
    expect(values.length).toBe(3);

    // Wait a macrotask for async updates
    await new Promise((r) => setTimeout(r, 0));

    expect(el.querySelector('.weather-pt__status')?.textContent).toContain('Updated now');

    const texts = Array.from(el.querySelectorAll('.city-temp__value')).map((n) => n.textContent);
    expect(texts).toContain('28 °C');
    expect(texts).toContain('22.5 °C');
    expect(texts).toContain('24.2 °C');
  });
});
