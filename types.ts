export interface OpenMeteoWeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    pressure_msl: number;
    uv_index?: number;
    precipitation: number;
    is_day?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: (number | null)[];
    soil_moisture_0_to_1cm?: (number | null)[];
    cloud_cover?: (number | null)[];
    wind_speed_10m?: (number | null)[];
    is_day?: (number | null)[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
  };
}

export interface AirQualityData {
  current?: {
    european_aqi: number;
    pm2_5: number;
  };
}

export interface BacktestRecord {
  yr: number;
  pred: number;
  act: number;
}

export interface MonsoonResult {
  onsetWindowStartDoy: number;
  onsetWindowEndDoy: number;
  onsetConfidence: number;
  breakStartDoy: number;
  breakEndDoy: number;
  breakProbability: number;
  yearsWithData: number;
  statusText: string;
  backtest: {
    series: BacktestRecord[];
    onsetMae: number | null;
    breakMae: number | null;
    reliability: number | null;
  };
}

export interface ComputedRiskFlag {
  icon: string;
  labelKey: string;
  levelKey: 'levelLow' | 'levelModerate' | 'levelWatch';
  color: string;
  detail: string;
}

export interface ComputedAlerts {
  flags: ComputedRiskFlag[];
  worstLevel: 'levelLow' | 'levelModerate' | 'levelWatch';
  worstColor: string;
}

export interface GeocodeResult {
  name: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodeResult {
  name: string;
  suburbOrVillage?: string;
  blockOrTehsil?: string;
  district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  formattedAddress: string;
  shortLabel: string;
  latitude: number;
  longitude: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export type CelestialPhase = 'dawn' | 'day' | 'dusk' | 'night';

export interface SolarCycleInfo {
  isDay: boolean;
  phase: CelestialPhase;
  phaseLabel: string;
  phaseSubtitle: string;
  sunriseTimeStr: string;
  sunsetTimeStr: string;
  localTimeStr: string;
  progressPct: number;
  timeToNextTransition: string;
  dayLengthStr: string;
}

export interface UserProfile {
  phone: string;
  name?: string;
  email?: string;
  verified: boolean;
  loggedInAt: string;
}
