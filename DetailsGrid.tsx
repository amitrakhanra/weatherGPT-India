import React from 'react';
import { OpenMeteoWeatherResponse, AirQualityData } from '../types';
import { localizeNumerals } from '../data/i18n';
import { Sunrise, Gauge, CloudRain, Sun, Droplets, Layers, Wind, Activity } from 'lucide-react';

interface DetailsGridProps {
  weather: OpenMeteoWeatherResponse | null;
  airQuality: AirQualityData | null;
  currentLang: string;
  t: (key: string) => string;
}

export const DetailsGrid: React.FC<DetailsGridProps> = ({
  weather,
  airQuality,
  currentLang,
  t
}) => {
  if (!weather) return null;

  const c = weather.current;
  const d = weather.daily;
  const h = weather.hourly;

  const sunrise = new Date(d.sunrise[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const sunset = new Date(d.sunset[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const now = new Date();
  const nowIdx = Math.max(0, h.time.findIndex(t2 => new Date(t2) >= now));
  const soilMoisture = h.soil_moisture_0_to_1cm && h.soil_moisture_0_to_1cm[nowIdx] != null
    ? Math.round(Number(h.soil_moisture_0_to_1cm[nowIdx]) * 100)
    : null;

  let aqiText = "—";
  let aqiSub = "Monitoring";
  let aqiColor = "text-white";
  if (airQuality?.current) {
    const aqi = Math.round(airQuality.current.european_aqi);
    const pm = Math.round(airQuality.current.pm2_5);
    if (aqi <= 20) { aqiText = "Good"; aqiColor = "text-[#4fce8a]"; }
    else if (aqi <= 40) { aqiText = "Fair"; aqiColor = "text-[#5ee9c8]"; }
    else if (aqi <= 60) { aqiText = "Moderate"; aqiColor = "text-[#f4b942]"; }
    else if (aqi <= 80) { aqiText = "Poor"; aqiColor = "text-[#f0836a]"; }
    else { aqiText = "Very poor"; aqiColor = "text-[#e5555a]"; }
    aqiSub = `AQI ${localizeNumerals(aqi, currentLang)} · PM2.5: ${localizeNumerals(pm, currentLang)} µg/m³`;
  }

  const cards = [
    {
      icon: Sunrise,
      iconColor: "text-[#f4b942]",
      label: "Sunrise / Sunset",
      value: `${localizeNumerals(sunrise, currentLang)} / ${localizeNumerals(sunset, currentLang)}`,
      desc: "Astronomical solar window"
    },
    {
      icon: Gauge,
      iconColor: "text-[#6c8dff]",
      label: "Pressure",
      value: `${localizeNumerals(Math.round(c.pressure_msl), currentLang)} hPa`,
      desc: "Sea-level barometric pressure"
    },
    {
      icon: CloudRain,
      iconColor: "text-[#5ee9c8]",
      label: "Rain (Today)",
      value: `${localizeNumerals(d.precipitation_sum[0], currentLang)} mm`,
      desc: "24h accumulated rainfall total"
    },
    {
      icon: Sun,
      iconColor: "text-[#f4b942]",
      label: "UV Index (Peak)",
      value: localizeNumerals(Math.round(d.uv_index_max[0]), currentLang),
      desc: "Maximum solar irradiance"
    },
    {
      icon: Droplets,
      iconColor: "text-[#5ee9c8]",
      label: "Rain Chance (Next hr)",
      value: h.precipitation_probability[nowIdx] != null
        ? `${localizeNumerals(h.precipitation_probability[nowIdx], currentLang)}%`
        : '--',
      desc: "Hyperlocal precipitation prob"
    },
    {
      icon: Layers,
      iconColor: "text-[#4fce8a]",
      label: "Soil Moisture (0–1cm)",
      value: soilMoisture != null ? `${localizeNumerals(soilMoisture, currentLang)}%` : '--',
      desc: "Topsoil saturation index"
    },
    {
      icon: Activity,
      iconColor: "text-[#6c8dff]",
      label: "Air Quality (AQI)",
      value: aqiText,
      valueClass: aqiColor,
      desc: aqiSub
    },
    {
      icon: Wind,
      iconColor: "text-[#5ee9c8]",
      label: "Wind Velocity",
      value: `${localizeNumerals(Math.round(c.wind_speed_10m), currentLang)} km/h`,
      desc: "Surface boundary layer (10m)"
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-[#6c8dff]" />
        <h3 className="text-lg font-bold text-white font-display">
          {t('todaysDetails')}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 rounded-2xl p-4 transition-all backdrop-blur-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <div className={`text-xl font-bold font-display mt-2 ${card.valueClass || 'text-white'}`}>
                {card.value}
              </div>
              <div className="text-[11px] text-[#7d81a8] mt-1">
                {card.desc}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
