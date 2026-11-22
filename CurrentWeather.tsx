import React from 'react';
import { OpenMeteoWeatherResponse, SolarCycleInfo, ReverseGeocodeResult } from '../types';
import { getWmoInfo } from '../services/weatherService';
import { localizeNumerals, localizePlaceLabel } from '../data/i18n';
import { Wind, Droplets, Thermometer, Sun, Moon, CloudRain, Sunrise, Sunset, Clock, Sparkles, MapPin } from 'lucide-react';

interface CurrentWeatherProps {
  weather: OpenMeteoWeatherResponse | null;
  solarCycle: SolarCycleInfo | null;
  locationLabel: string;
  reverseGeoInfo?: ReverseGeocodeResult | null;
  currentLang: string;
  t: (key: string) => string;
  isLoading: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  solarCycle,
  locationLabel,
  reverseGeoInfo,
  currentLang,
  t,
  isLoading
}) => {
  if (!weather) {
    return (
      <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 text-center text-[#7d81a8] animate-pulse">
        Loading live meteorological &amp; celestial data…
      </div>
    );
  }

  const c = weather.current;
  const wmo = getWmoInfo(c.weather_code);
  const now = new Date();
  const times = weather.hourly.time;
  let startIdx = times.findIndex((t2) => new Date(t2) >= now);
  if (startIdx < 0) startIdx = 0;
  const hourlySlice = times.slice(startIdx, startIdx + 12);

  const isDay = solarCycle?.isDay ?? (c.is_day !== undefined ? c.is_day === 1 : true);
  const phase = solarCycle?.phase || (isDay ? 'day' : 'night');

  // Dynamic Atmospheric Styling
  const skyCardStyle = isDay
    ? phase === 'dawn' || phase === 'dusk'
      ? 'from-[#1e1b4b]/80 via-[#431407]/40 to-[#78350f]/25 border-[#f59e0b]/30'
      : 'from-[#1e3a8a]/40 via-[#0284c7]/20 to-[#fbbf24]/10 border-[#38bdf8]/25'
    : 'from-[#070b1a]/95 via-[#0f172a]/90 to-[#1e1b4b]/50 border-[#818cf8]/25';

  return (
    <div id="forecast" className="space-y-4 scroll-mt-20">
      {/* Main Hero Card with Dynamic Day/Night Lighting */}
      <div
        className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${skyCardStyle} backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/50 transition-colors duration-700`}
      >
        {/* Ambient celestial background glow & stars */}
        {!isDay && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
            <div className="absolute top-4 right-16 w-1 h-1 bg-white rounded-full animate-ping opacity-75" />
            <div className="absolute top-12 right-36 w-1 h-1 bg-white/80 rounded-full" />
            <div className="absolute top-20 right-10 w-1.5 h-1.5 bg-indigo-200 rounded-full animate-pulse" />
            <div className="absolute top-6 left-1/3 w-1 h-1 bg-white/60 rounded-full" />
            <div className="absolute top-16 left-1/2 w-1 h-1 bg-blue-200/70 rounded-full" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}

        {isDay && (
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Column: Location, Day/Night Badge & Main Temp */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${isDay ? 'bg-[#f59e0b]' : 'bg-[#6c8dff]'} animate-ping`} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                  {localizePlaceLabel(locationLabel, currentLang)}
                </h2>
              </div>

              {/* Postal PIN Code Badge */}
              {reverseGeoInfo?.postcode && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/40 shadow-sm">
                  📮 PIN: {reverseGeoInfo.postcode}
                </span>
              )}

              {/* Real-time Day/Night Status Badge */}
              {solarCycle && (
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                    isDay
                      ? 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/40 shadow-sm shadow-[#f59e0b]/15'
                      : 'bg-[#6c8dff]/20 text-[#a5b4fc] border-[#6c8dff]/40 shadow-sm shadow-[#6c8dff]/15'
                  }`}
                >
                  {isDay ? (
                    <Sun className="w-3.5 h-3.5 text-[#fbbf24] animate-[spin_10s_linear_infinite]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-[#a5b4fc]" />
                  )}
                  <span>{solarCycle.phaseLabel.toUpperCase()}</span>
                  <span className="opacity-60 text-[10px]">·</span>
                  <span className="font-mono text-[11px]">{solarCycle.localTimeStr}</span>
                </div>
              )}
            </div>

            {/* Hyperlocal Coordinate & Area breakdown */}
            <div className="flex items-center gap-2 text-xs text-[#94a3b8] flex-wrap">
              <span className="font-mono text-[#5ee9c8]">
                {weather.latitude.toFixed(4)}°N, {weather.longitude.toFixed(4)}°E
              </span>
              {reverseGeoInfo?.blockOrTehsil && (
                <>
                  <span>•</span>
                  <span>Tehsil/Block: {reverseGeoInfo.blockOrTehsil}</span>
                </>
              )}
              {reverseGeoInfo?.district && reverseGeoInfo.district !== reverseGeoInfo.name && (
                <>
                  <span>•</span>
                  <span>District: {reverseGeoInfo.district}</span>
                </>
              )}
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white font-display">
                {localizeNumerals(Math.round(c.temperature_2m), currentLang)}°
              </span>
              <span className="text-4xl sm:text-5xl" role="img" aria-label={wmo.desc}>
                {wmo.icon}
              </span>
            </div>

            <p className="text-base text-[#b7bbdb] font-medium flex items-center gap-2">
              <span>{wmo.desc}</span>
              {c.precipitation > 0 && (
                <span className="text-[#5ee9c8] font-semibold">
                  · {localizeNumerals(c.precipitation, currentLang)} mm falling now
                </span>
              )}
            </p>

            {/* Real-time Diurnal Status Subtitle */}
            {solarCycle && (
              <p className="text-xs text-[#94a3b8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#5ee9c8]" />
                <span>{solarCycle.phaseSubtitle}</span>
                <span className="text-[#64748b]">·</span>
                <span className="font-medium text-[#cbd5e1]">{solarCycle.timeToNextTransition}</span>
              </p>
            )}

            <div className="pt-1 flex items-center gap-2 text-xs text-[#7d81a8]">
              <span>{isLoading ? 'Updating live satellite & NWP feeds…' : 'Live · Open-Meteo verified feed'}</span>
            </div>

            <p className="text-xs italic text-[#7d81a8]">
              {t('quoteText')}
            </p>
          </div>

          {/* Right Column: 4 Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 shrink-0">
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center">
              <Thermometer className="w-4 h-4 text-[#5ee9c8] mb-1" />
              <div className="text-lg sm:text-xl font-bold font-display text-white">
                {localizeNumerals(Math.round(c.apparent_temperature), currentLang)}°
              </div>
              <div className="text-[11px] font-medium text-[#7d81a8] uppercase tracking-wider">
                {t('feelsLikeLbl')}
              </div>
            </div>

            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center">
              <Droplets className="w-4 h-4 text-[#6c8dff] mb-1" />
              <div className="text-lg sm:text-xl font-bold font-display text-white">
                {localizeNumerals(Math.round(c.relative_humidity_2m), currentLang)}%
              </div>
              <div className="text-[11px] font-medium text-[#7d81a8] uppercase tracking-wider">
                {t('humidityLbl')}
              </div>
            </div>

            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center">
              <Wind className="w-4 h-4 text-[#5ee9c8] mb-1" />
              <div className="text-lg sm:text-xl font-bold font-display text-white">
                {localizeNumerals(Math.round(c.wind_speed_10m), currentLang)} <span className="text-xs font-normal text-[#7d81a8]">km/h</span>
              </div>
              <div className="text-[11px] font-medium text-[#7d81a8] uppercase tracking-wider">
                {t('windLbl')}
              </div>
            </div>

            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-3.5 text-center flex flex-col items-center justify-center">
              {isDay ? (
                <Sun className="w-4 h-4 text-[#f4b942] mb-1" />
              ) : (
                <Moon className="w-4 h-4 text-[#a5b4fc] mb-1" />
              )}
              <div className="text-lg sm:text-xl font-bold font-display text-white">
                {c.uv_index != null ? localizeNumerals(Math.round(c.uv_index), currentLang) : (isDay ? '0' : '0 (Night)')}
              </div>
              <div className="text-[11px] font-medium text-[#7d81a8] uppercase tracking-wider">
                {t('uvLbl')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME DAY / NIGHT SOLAR ARC & CELESTIAL POSITION TRACKER */}
      {solarCycle && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {isDay ? (
                <Sun className="w-4 h-4 text-[#fbbf24]" />
              ) : (
                <Moon className="w-4 h-4 text-[#a5b4fc]" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Real-Time Celestial &amp; Diurnal Cycle
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.07] text-[#5ee9c8] font-mono">
                {isDay ? '☀️ Daylight' : '🌙 Night Sky'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#7d81a8]">
              <span className="flex items-center gap-1 font-mono text-[#cbd5e1]">
                <Clock className="w-3.5 h-3.5 text-[#5ee9c8]" />
                {solarCycle.localTimeStr}
              </span>
              <span>•</span>
              <span>Day Length: <strong className="text-white">{solarCycle.dayLengthStr}</strong></span>
            </div>
          </div>

          {/* Interactive Celestial Progress Arc */}
          <div className="relative pt-6 pb-2">
            {/* Background Track */}
            <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden relative">
              <div
                className={`h-full transition-all duration-1000 ${
                  isDay
                    ? 'bg-gradient-to-r from-[#f59e0b] via-[#38bdf8] to-[#f97316]'
                    : 'bg-gradient-to-r from-[#6366f1] via-[#818cf8] to-[#312e81]'
                }`}
                style={{ width: `${solarCycle.progressPct}%` }}
              />
            </div>

            {/* Glowing Sun or Moon Indicator */}
            <div
              className="absolute top-2.5 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-1000"
              style={{ left: `${Math.min(96, Math.max(4, solarCycle.progressPct))}%` }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                  isDay
                    ? 'bg-[#fbbf24] text-[#0b0e1f] shadow-amber-400/50'
                    : 'bg-[#c7d2fe] text-[#0b0e1f] shadow-indigo-400/50'
                }`}
              >
                {isDay ? (
                  <Sun className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </div>
              <span className="text-[10px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded mt-1 border border-white/10 whitespace-nowrap">
                {isDay ? 'Sun' : 'Moon'} ({solarCycle.progressPct}%)
              </span>
            </div>

            {/* Labels at ends */}
            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex items-center gap-1.5 text-[#fbbf24]">
                <Sunrise className="w-4 h-4" />
                <div>
                  <span className="text-[10px] uppercase text-[#7d81a8] block">Sunrise</span>
                  <span className="font-semibold font-mono">{solarCycle.sunriseTimeStr}</span>
                </div>
              </div>

              <div className="text-center px-2 py-1 rounded-lg bg-white/[0.04] border border-white/5">
                <span className="text-[11px] text-[#5ee9c8] font-medium block">
                  {solarCycle.timeToNextTransition}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[#f97316] text-right">
                <div>
                  <span className="text-[10px] uppercase text-[#7d81a8] block">Sunset</span>
                  <span className="font-semibold font-mono">{solarCycle.sunsetTimeStr}</span>
                </div>
                <Sunset className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Strip with Day/Night Hour Tinting */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {hourlySlice.map((isoTime, i) => {
          const idx = startIdx + i;
          const temp = Math.round(weather.hourly.temperature_2m[idx]);
          const code = weather.hourly.weather_code[idx];
          const rainChance = weather.hourly.precipitation_probability[idx];
          const hourIsDay = weather.hourly.is_day?.[idx] === 1;
          const info = getWmoInfo(code);
          const dateObj = new Date(isoTime);
          const hourLabel = dateObj.toLocaleTimeString([], { hour: 'numeric' });

          return (
            <div
              key={isoTime}
              className={`flex-shrink-0 flex flex-col items-center justify-between p-3 rounded-2xl border min-w-[80px] text-center transition-all hover:-translate-y-0.5 ${
                hourIsDay
                  ? 'bg-white/[0.05] hover:bg-white/[0.08] border-white/10'
                  : 'bg-[#0f172a]/70 hover:bg-[#1e293b]/70 border-indigo-500/20'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] text-[#7d81a8]">
                {hourIsDay ? (
                  <Sun className="w-2.5 h-2.5 text-[#f4b942]" />
                ) : (
                  <Moon className="w-2.5 h-2.5 text-[#818cf8]" />
                )}
                <span>{localizeNumerals(hourLabel, currentLang)}</span>
              </div>

              <span className="text-xl my-1.5" role="img" aria-label={info.desc}>
                {info.icon}
              </span>
              <span className="text-sm font-bold text-white">
                {localizeNumerals(temp, currentLang)}°
              </span>
              {rainChance != null && rainChance > 0 ? (
                <span className="mt-1 flex items-center gap-0.5 text-[10px] text-[#5ee9c8]">
                  <CloudRain className="w-2.5 h-2.5" />
                  {localizeNumerals(rainChance, currentLang)}%
                </span>
              ) : (
                <span className="mt-1 text-[10px] text-[#7d81a8] opacity-50">0%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
