import React from 'react';
import { OpenMeteoWeatherResponse } from '../types';
import { localizeNumerals } from '../data/i18n';
import { Globe2, Bug } from 'lucide-react';

interface HybridAndDiseaseProps {
  weather: OpenMeteoWeatherResponse | null;
  currentLang: string;
  t: (key: string) => string;
}

export const HybridAndDisease: React.FC<HybridAndDiseaseProps> = ({
  weather,
  currentLang,
  t
}) => {
  let rainAnomalyPct = 0;
  if (weather?.daily?.precipitation_sum) {
    const sum7 = weather.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + (b || 0), 0);
    const climatologyNormal = 45;
    rainAnomalyPct = Math.round(((sum7 - climatologyNormal) / climatologyNormal) * 100);
  }

  const sign = rainAnomalyPct >= 0 ? '+' : '';
  const anomalyColor = rainAnomalyPct >= 0 ? 'text-[#5ee9c8]' : 'text-[#f0836a]';

  return (
    <div className="space-y-6">
      {/* Hybrid Global + Local Outlook */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#5ee9c8]" />
            <h3 className="text-lg font-bold text-white font-display">
              {t('hybridTitle')}
            </h3>
          </div>
          <p className="text-xs text-[#7d81a8] mt-1">
            {t('hybridSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider">
              {t('ensoLbl')}
            </span>
            <div className="text-lg font-bold text-white font-display mt-1">
              Weak La Niña
            </div>
            <p className="text-xs text-[#b7bbdb] mt-2 leading-relaxed">
              {t('ensoDesc')}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider">
              {t('iodLbl')}
            </span>
            <div className="text-lg font-bold text-white font-display mt-1">
              Neutral IOD
            </div>
            <p className="text-xs text-[#b7bbdb] mt-2 leading-relaxed">
              {t('iodDesc')}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider">
              {t('rainAnomalyLbl')}
            </span>
            <div className={`text-lg font-bold font-display mt-1 ${anomalyColor}`}>
              {sign}{localizeNumerals(rainAnomalyPct, currentLang)}%
            </div>
            <p className="text-xs text-[#b7bbdb] mt-2 leading-relaxed">
              {t('rainAnomalyDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Vector-borne Disease Index */}
      <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-[#f4b942]" />
            <h3 className="text-lg font-bold text-white font-display">
              {t('diseaseTitle')}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f4b942]/15 text-[#f4b942] uppercase tracking-wider">
              Epidemiological Index
            </span>
          </div>
          <p className="text-xs text-[#7d81a8] mt-1">
            {t('diseaseSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider">
              {t('diseaseDengueLbl')}
            </span>
            <div className="text-lg font-bold text-[#f0836a] font-display mt-1">
              {t('riskModerateVal')}
            </div>
            <p className="text-xs text-[#b7bbdb] mt-2 leading-relaxed">
              {t('diseaseDengueDesc')}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider">
              {t('diseaseHeatLbl')}
            </span>
            <div className="text-lg font-bold text-[#4fce8a] font-display mt-1">
              {t('riskLowVal')}
            </div>
            <p className="text-xs text-[#b7bbdb] mt-2 leading-relaxed">
              {t('diseaseHeatDesc')}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider">
              {t('diseaseWaterLbl')}
            </span>
            <div className="text-lg font-bold text-[#4fce8a] font-display mt-1">
              {t('riskLowVal')}
            </div>
            <p className="text-xs text-[#b7bbdb] mt-2 leading-relaxed">
              {t('diseaseWaterDesc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
