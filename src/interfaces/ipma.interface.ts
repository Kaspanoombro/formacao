export interface IPMACities {
  owner: string;
  country: string;
  data: IPMACityForecast[];
  globalIdLocal: number;
  dataUpdate: string; // ISO datetime, e.g., "2025-09-24T16:31:02"
}

export interface IPMACityForecast {
  precipitaProb: string; // percent as string, e.g., "47.0"
  tMin: string;          // temperature as string, e.g., "15.9"
  tMax: string;          // temperature as string, e.g., "28.6"
  predWindDir: string;   // wind direction, e.g., "N", "NW", ...
  idWeatherType: number; // weather type code
  classWindSpeed: number;
  longitude: string;     // e.g., "-9.1286"
  forecastDate: string;  // "YYYY-MM-DD"
  latitude: string;      // e.g., "38.7660"
  classPrecInt?: number; // optional (nem sempre presente)
}

export type CityName = 'Lisboa' | 'Porto' | 'Coimbra';

export interface CityTemperature {
  city: CityName;
  temperature: number | null; // in Celsius (we use forecast tMax by default)
  observedAt?: string; // ISO (we store forecastDate from payload when available)
}