import React from 'react';
import { OpenMeteoWeatherResponse } from '../types';
import { getWmoInfo } from '../services/weatherService';
import { localizeNumerals } from '../data/i18n';
import { Calendar, Droplet } from 'lucide-react';

interface Forecast7DayProps {
  weather: OpenMeteoWeatherResponse | null;
  currentLang: string;
  t: (key: string) => string;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({ weather, currentLang, t }) => {
  if (!weather) return null;

  const d = weather.daily;
  const los = d.temperature_2m_min;
  const his = d.temperature_2m_max;
  const globalLo = Math.min(...los);
  const globalHi = Math.max(...his);

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#5ee9c8]" />
          <h3 className="text-lg font-bold text-white font-display">
            {t('forecast7')}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4fce8a]/15 text-[#4fce8a] uppercase tracking-wider">
            Live
          </span>
        </div>
        <p className="hidden sm:block text-xs text-[#7d81a8]">
          {t('forecastSub')}
        </p>
      </div>

      <div className="divide-y divide-white/5">
        {d.time.map((timeStr, i) => {
          const dayName = i === 0 ? t('todayLbl') : new Date(timeStr).toLocaleDateString([], { weekday: 'short' });
          const lo = Math.round(los[i]);
          const hi = Math.round(his[i]);
          const rainProb = d.precipitation_probability_max[i] || 0;
          const wmo = getWmoInfo(d.weather_code[i]);

          const left = ((lo - globalLo) / (globalHi - globalLo || 1)) * 100;
          const width = Math.max(12, ((hi - lo) / (globalHi - globalLo || 1)) * 100);

          return (
            <div key={timeStr} className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-sm">
              {/* Day name */}
              <div className="w-20 sm:w-28 font-medium text-white shrink-0">
                {dayName}
              </div>

              {/* Weather icon & rain */}
              <div className="flex items-center gap-2 w-24 sm:w-28 shrink-0">
                <span className="text-lg" role="img" aria-label={wmo.desc}>
                  {wmo.icon}
                </span>
                {rainProb > 0 ? (
                  <span className="text-xs text-[#5ee9c8] flex items-center gap-0.5">
                    <Droplet className="w-3 h-3" />
                    {localizeNumerals(rainProb, currentLang)}%
                  </span>
                ) : (
                  <span className="text-xs text-[#7d81a8] opacity-50">0%</span>
                )}
              </div>

              {/* Temperature Bar */}
              <div className="flex-1 flex items-center gap-2 sm:gap-3 max-w-md mx-2">
                <span className="text-xs font-medium text-[#7d81a8] w-7 text-right shrink-0">
                  {localizeNumerals(lo, currentLang)}°
                </span>
                <div className="flex-1 h-2 bg-white/10 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#5ee9c8] via-[#6c8dff] to-[#f4b942]"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-white w-7 shrink-0">
                  {localizeNumerals(hi, currentLang)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
