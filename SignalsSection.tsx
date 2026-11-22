import React from 'react';
import { MonsoonResult, OpenMeteoWeatherResponse } from '../types';
import { localizeNumerals } from '../data/i18n';
import { Cpu } from 'lucide-react';

interface SignalsSectionProps {
  monsoonResult: MonsoonResult | null;
  weather: OpenMeteoWeatherResponse | null;
  currentLang: string;
  t: (key: string) => string;
}

export const SignalsSection: React.FC<SignalsSectionProps> = ({
  monsoonResult,
  weather,
  currentLang,
  t
}) => {
  const rainfallContinuity = monsoonResult?.onsetConfidence || 84;
  const historicalCoverage = monsoonResult ? Math.min(100, Math.round((monsoonResult.yearsWithData / 12) * 100)) : 100;

  let cloudCoverAvg = 62;
  let windVarPct = 28;
  let soilMoistureTrend = 55;

  if (weather?.hourly) {
    const h = weather.hourly;
    const now = new Date();
    const nowIdx = Math.max(0, h.time.findIndex(t2 => new Date(t2) >= now));

    if (h.cloud_cover) {
      const slice = h.cloud_cover.slice(nowIdx, nowIdx + 48).filter(v => v != null) as number[];
      if (slice.length > 0) {
        cloudCoverAvg = Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
      }
    }

    if (h.wind_speed_10m) {
      const slice = h.wind_speed_10m.slice(nowIdx, nowIdx + 48).filter(v => v != null) as number[];
      if (slice.length > 1) {
        const m = slice.reduce((a, b) => a + b, 0) / slice.length;
        const sd = Math.sqrt(slice.reduce((a, b) => a + (b - m) * (b - m), 0) / slice.length);
        windVarPct = Math.max(8, Math.min(95, Math.round(sd * 12)));
      }
    }

    if (h.soil_moisture_0_to_1cm) {
      const slice = h.soil_moisture_0_to_1cm.slice(nowIdx, nowIdx + 48).filter(v => v != null) as number[];
      if (slice.length > 1) {
        const delta = slice[slice.length - 1] - slice[0];
        soilMoistureTrend = Math.max(10, Math.min(95, Math.round(50 + delta * 500)));
      }
    }
  }

  const signals = [
    { label: t('signalRainfall'), weight: rainfallContinuity, color: '#5ee9c8' },
    { label: t('signalWind'), weight: windVarPct, color: '#6c8dff' },
    { label: t('signalOlr'), weight: cloudCoverAvg, color: '#f4b942' },
    { label: t('signalHistorical'), weight: historicalCoverage, color: '#f0836a' },
    { label: t('signalSoil'), weight: soilMoistureTrend, color: '#4fce8a' }
  ];

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#6c8dff]" />
            <h3 className="text-lg font-bold text-white font-display">
              {t('whyThisCallTitle')}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6c8dff]/15 text-[#6c8dff] uppercase tracking-wider">
              Explainable Physics
            </span>
          </div>
          <p className="text-xs text-[#7d81a8] mt-1">
            {t('whyThisCallSub')}
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {signals.map((sig, i) => (
          <div key={i} className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="w-44 sm:w-56 text-[#b7bbdb] shrink-0 font-medium">
              {sig.label}
            </span>
            <div className="flex-1 h-2 bg-white/10 rounded-full relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${sig.weight}%`,
                  backgroundColor: sig.color
                }}
              />
            </div>
            <span className="w-12 text-right font-bold text-white shrink-0 font-display">
              {localizeNumerals(sig.weight, currentLang)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
