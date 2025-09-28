import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPortugalWeather } from './PortugalWeather.ts';

// Mock payload for observation API
const makeObservationResponse = () => ({
  type: "FeatureCollection",
  features: [
    // Station near Lisboa
    {
      geometry: { type: "Point", coordinates: [-9.1393, 38.7223] },
      type: "Feature",
      properties: {
        intensidadeVentoKM: 15.2,
        temperatura: 28.0,
        idEstacao: 1200501,
        pressao: 1013.2,
        humidade: 65.0,
        localEstacao: "Lisboa (Gago Coutinho)",
        precAcumulada: 0.0,
        idDireccVento: 3,
        radiacao: 850.5,
        time: "2025-09-21T12:00:00",
        intensidadeVento: 4.2,
        descDirVento: "E"
      }
    },
    // Station near Porto
    {
      geometry: { type: "Point", coordinates: [-8.6291, 41.1579] },
      type: "Feature",
      properties: {
        intensidadeVentoKM: 12.8,
        temperatura: 22.5,
        idEstacao: 1200502,
        pressao: 1015.8,
        humidade: 72.0,
        localEstacao: "Porto (Pedras Rubras)",
        precAcumulada: 0.1,
        idDireccVento: 2,
        radiacao: 720.3,
        time: "2025-09-21T12:00:00",
        intensidadeVento: 3.6,
        descDirVento: "NE"
      }
    },
    // Station near Coimbra
    {
      geometry: { type: "Point", coordinates: [-8.4103, 40.2033] },
      type: "Feature",
      properties: {
        intensidadeVentoKM: 9.5,
        temperatura: 24.2,
        idEstacao: 1200503,
        pressao: 1012.1,
        humidade: 68.0,
        localEstacao: "Coimbra (Cernache)",
        precAcumulada: 0.0,
        idDireccVento: 1,
        radiacao: 780.2,
        time: "2025-09-21T12:00:00",
        intensidadeVento: 2.6,
        descDirVento: "N"
      }
    }
  ]
});


describe('Organism: PortugalWeather', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders three city blocks and updates temperatures from IPMA observations', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        // Mock the observation API endpoint
        if (url.includes('obs-surface.geojson')) {
          return { ok: true, json: async () => makeObservationResponse() } as Response;
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
