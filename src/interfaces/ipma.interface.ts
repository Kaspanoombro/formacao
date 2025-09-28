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
  temperature: number | null; // in Celsius (actual observed temperature from weather station)
  observedAt?: string; // ISO (observation time from weather station)
}

// New interfaces for observation API
export interface IPMAObservationResponse {
  type: "FeatureCollection";
  features: IPMAObservationFeature[];
}

export interface IPMAObservationFeature {
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  type: "Feature";
  properties: IPMAObservationProperties;
}

export interface IPMAObservationProperties {
  intensidadeVentoKM: number;
  temperatura: number; // actual temperature in °C
  idEstacao: number; // station ID
  pressao: number;
  humidade: number; // -99.0 means no data
  localEstacao: string; // station name
  precAcumulada: number;
  idDireccVento: number;
  radiacao: number; // -99.0 means no data
  time: string; // ISO datetime of observation
  intensidadeVento: number;
  descDirVento: string;
}