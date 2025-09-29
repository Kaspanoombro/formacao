import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import {
  fetchCurrentTemps,
  type CityName
} from './ipma.service.ts';
import type {
  IPMAObservationResponse,
} from '../interfaces/ipma.interface.ts';

// Mock fetch globally
global.fetch = vi.fn();

describe('Service: IPMA (Weather Service)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Utility Functions', () => {

    beforeEach(async () => {
      // We need to import the internal functions for testing
      // Since they're not exported, we'll test them through the public API
      // and create separate tests for the utility logic
    });

    describe('toNumber function (via integration)', () => {
      it('handles valid numeric strings', async () => {
        const mockResponse: IPMAObservationResponse = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-9.1286, 38.7660]
            },
            properties: {
              intensidadeVentoKM: 10,
              temperatura: 25.5,
              idEstacao: 1200545,
              pressao: 1013.2,
              humidade: 65,
              localEstacao: 'Lisboa',
              precAcumulada: 0,
              idDireccVento: 9,
              radiacao: 500,
              time: '2023-01-01T12:00:00Z',
              intensidadeVento: 3,
              descDirVento: 'N'
            }
          }]
        };

        (fetch as Mock).mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });

        const result = await fetchCurrentTemps(['Lisboa']);
        expect(result.Lisboa.temperature).toBe(25.5);
      });
    });

    describe('calculateDistance function (via integration)', () => {
      it('calculates distance correctly through closest station selection', async () => {
        const mockResponse: IPMAObservationResponse = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-9.1286, 38.7660] // Lisboa coordinates
              },
              properties: {
                intensidadeVentoKM: 10,
                temperatura: 25,
                idEstacao: 1200545,
                pressao: 1013,
                humidade: 65,
                localEstacao: 'Lisboa',
                precAcumulada: 0,
                idDireccVento: 9,
                radiacao: 500,
                time: '2023-01-01T12:00:00Z',
                intensidadeVento: 3,
                descDirVento: 'N'
              }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-8.4103, 41.1579] // Porto coordinates
              },
              properties: {
                intensidadeVentoKM: 15,
                temperatura: 20,
                idEstacao: 1200576,
                pressao: 1015,
                humidade: 70,
                localEstacao: 'Porto',
                precAcumulada: 0,
                idDireccVento: 9,
                radiacao: 450,
                time: '2023-01-01T12:00:00Z',
                intensidadeVento: 4,
                descDirVento: 'NW'
              }
            }
          ]
        };

        (fetch as Mock).mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockResponse)
        });

        const result = await fetchCurrentTemps(['Lisboa']);
        // Should select the closest station (Lisboa station for Lisboa city)
        expect(result.Lisboa.temperature).toBe(25);
      });
    });
  });

  describe('fetchCurrentTemps function', () => {
    it('successfully fetches temperatures for valid cities', async () => {
      const mockResponse: IPMAObservationResponse = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-9.1286, 38.7660]
          },
          properties: {
            intensidadeVentoKM: 10,
            temperatura: 22.5,
            idEstacao: 1200545,
            pressao: 1013.2,
            humidade: 65,
            localEstacao: 'Lisboa',
            precAcumulada: 0,
            idDireccVento: 9,
            radiacao: 500,
            time: '2023-01-01T12:00:00Z',
            intensidadeVento: 3,
            descDirVento: 'N'
          }
        }]
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const cities: CityName[] = ['Lisboa'];
      const result = await fetchCurrentTemps(cities);

      expect(result.Lisboa).toEqual({
        city: 'Lisboa',
        temperature: 22.5,
        observedAt: '2023-01-01T12:00:00Z'
      });
    });

    it('fetches temperatures for multiple cities', async () => {
      const mockResponse: IPMAObservationResponse = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-9.1286, 38.7660] // Lisboa
            },
            properties: {
              intensidadeVentoKM: 10,
              temperatura: 25,
              idEstacao: 1200545,
              pressao: 1013,
              humidade: 65,
              localEstacao: 'Lisboa',
              precAcumulada: 0,
              idDireccVento: 9,
              radiacao: 500,
              time: '2023-01-01T12:00:00Z',
              intensidadeVento: 3,
              descDirVento: 'N'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-8.4103, 41.1579] // Porto
            },
            properties: {
              intensidadeVentoKM: 15,
              temperatura: 18,
              idEstacao: 1200576,
              pressao: 1015,
              humidade: 70,
              localEstacao: 'Porto',
              precAcumulada: 0,
              idDireccVento: 9,
              radiacao: 450,
              time: '2023-01-01T12:00:00Z',
              intensidadeVento: 4,
              descDirVento: 'NW'
            }
          }
        ]
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const cities: CityName[] = ['Lisboa', 'Porto'];
      const result = await fetchCurrentTemps(cities);

      expect(result.Lisboa.temperature).toBe(25);
      expect(result.Porto.temperature).toBe(18);
    });

    it('handles cities without nearby stations', async () => {
      const mockResponse: IPMAObservationResponse = {
        type: 'FeatureCollection',
        features: [] // No weather stations
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const cities: CityName[] = ['Lisboa'];
      const result = await fetchCurrentTemps(cities);

      expect(result.Lisboa).toEqual({
        city: 'Lisboa',
        temperature: null
      });
    });

    it('handles API fetch errors', async () => {
      (fetch as Mock).mockRejectedValue(new Error('Network error'));

      const cities: CityName[] = ['Lisboa'];
      const result = await fetchCurrentTemps(cities);

      expect(result.Lisboa).toEqual({
        city: 'Lisboa',
        temperature: null
      });
    });

    it('handles invalid API responses', async () => {
      (fetch as Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const cities: CityName[] = ['Porto'];
      const result = await fetchCurrentTemps(cities);

      expect(result.Porto).toEqual({
        city: 'Porto',
        temperature: null
      });
    });

    it('handles malformed JSON responses', async () => {
      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      const cities: CityName[] = ['Coimbra'];
      const result = await fetchCurrentTemps(cities);

      expect(result.Coimbra).toEqual({
        city: 'Coimbra',
        temperature: null
      });
    });

    it('handles missing temperature data', async () => {
      const mockResponse: IPMAObservationResponse = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-9.1286, 38.7660]
          },
          properties: {
            intensidadeVentoKM: 10,
            temperatura: -99, // No data indicator
            idEstacao: 1200545,
            pressao: 1013,
            humidade: -99, // No data
            localEstacao: 'Lisboa',
            precAcumulada: 0,
            idDireccVento: 9,
            radiacao: -99, // No data
            time: '2023-01-01T12:00:00Z',
            intensidadeVento: 3,
            descDirVento: 'N'
          }
        }]
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const cities: CityName[] = ['Lisboa'];
      const result = await fetchCurrentTemps(cities);

      expect(result.Lisboa.temperature).toBe(null);
    });

    it('handles empty city array', async () => {
      const result = await fetchCurrentTemps([]);
      expect(result).toEqual({
        Lisboa: { city: 'Lisboa', temperature: null },
        Porto: { city: 'Porto', temperature: null },
        Coimbra: { city: 'Coimbra', temperature: null }
      });
    });

    it('uses correct API endpoint', async () => {
      const mockResponse: IPMAObservationResponse = {
        type: 'FeatureCollection',
        features: []
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await fetchCurrentTemps(['Lisboa']);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.ipma.pt/open-data/observation/meteorology/stations/obs-surface.geojson',
        { cache: 'no-store' }
      );
    });

    it('handles weather stations with valid temperatures', async () => {
      const mockResponse: IPMAObservationResponse = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-8.2451, 40.2033] // Coimbra area
            },
            properties: {
              intensidadeVentoKM: 8,
              temperatura: 19.5,
              idEstacao: 1200535,
              pressao: 1012.5,
              humidade: 75,
              localEstacao: 'Coimbra',
              precAcumulada: 0.2,
              idDireccVento: 7,
              radiacao: 400,
              time: '2023-01-01T14:30:00Z',
              intensidadeVento: 2,
              descDirVento: 'SW'
            }
          }
        ]
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchCurrentTemps(['Coimbra']);

      expect(result.Coimbra).toEqual({
        city: 'Coimbra',
        temperature: 19.5,
        observedAt: '2023-01-01T14:30:00Z'
      });
    });

    it('selects closest station when multiple stations available', async () => {
      const mockResponse: IPMAObservationResponse = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-9.5, 38.5] // Far from Lisboa
            },
            properties: {
              intensidadeVentoKM: 12,
              temperatura: 30,
              idEstacao: 1200500,
              pressao: 1010,
              humidade: 60,
              localEstacao: 'Far Station',
              precAcumulada: 0,
              idDireccVento: 9,
              radiacao: 600,
              time: '2023-01-01T12:00:00Z',
              intensidadeVento: 3,
              descDirVento: 'N'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-9.1286, 38.7660] // Lisboa exact coordinates
            },
            properties: {
              intensidadeVentoKM: 10,
              temperatura: 25,
              idEstacao: 1200545,
              pressao: 1013,
              humidade: 65,
              localEstacao: 'Lisboa Close',
              precAcumulada: 0,
              idDireccVento: 9,
              radiacao: 500,
              time: '2023-01-01T12:00:00Z',
              intensidadeVento: 3,
              descDirVento: 'N'
            }
          }
        ]
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchCurrentTemps(['Lisboa']);

      // Should select the closest station (temperature 25, not 30)
      expect(result.Lisboa.temperature).toBe(25);
    });
  });
});