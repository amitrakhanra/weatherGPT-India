import React from 'react';
import { MonsoonResult } from '../types';
import { getSeasonDates } from '../services/weatherService';
import { localizePlaceLabel } from '../data/i18n';
import { Compass } from 'lucide-react';

interface PhaseHeroProps {
  monsoonResult: MonsoonResult | null;
  locationLabel: string;
  currentLang: string;
  t: (key: string) => string;
}

export const PhaseHero: React.FC<PhaseHeroProps> = ({
  monsoonResult,
  locationLabel,
  currentLang,
  t
}) => {
  const dates = getSeasonDates(monsoonResult);
  const now = dates.now;

  let phaseKey = 'phasePre';
  let color = '#7d81a8';
  let icon = '🌱';
  let descKey = 'phasePreDesc';

  if (now < dates.onsetStart) {
    phaseKey = 'phasePre';
    color = '#7d81a8';
    icon = '🌱';
    descKey = 'phasePreDesc';
  } else if (now <= dates.onsetEnd) {
    phaseKey = 'phaseApproaching';
    color = '#5ee9c8';
    icon = '⛅';
    descKey = 'phaseApproachingDesc';
  } else if (now < dates.breakStart) {
    phaseKey = 'phaseEstablished';
    color = '#4fce8a';
    icon = '🌧️';
    descKey = 'phaseEstablishedDesc';
  } else if (now <= dates.breakEnd) {
    phaseKey = 'phaseBreak';
    color = '#f0836a';
    icon = '☀️';
    descKey = 'phaseBreakDesc';
  } else {
    phaseKey = 'phaseEstablished';
    color = '#4fce8a';
    icon = '🌧️';
    descKey = 'phaseEstablishedDesc';
  }

  const phases = [
    { key: 'phasePre', label: t('phasePre'), color: '#7d81a8' },
    { key: 'phaseApproaching', label: t('phaseApproaching'), color: '#5ee9c8' },
    { key: 'phaseEstablished', label: t('phaseEstablished'), color: '#4fce8a' },
    { key: 'phaseBreak', label: t('phaseBreak'), color: '#f0836a' }
  ];

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#5ee9c8]" />
          <h3 className="text-lg font-bold text-white font-display">
            {t('phaseYourLocation')}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4fce8a]/15 text-[#4fce8a] uppercase tracking-wider">
            Live Climatology
          </span>
        </div>
        <p className="text-xs text-[#7d81a8] mt-1">
          {t('phaseGridNote')}
        </p>
      </div>

      {/* Phase Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-[#b7bbdb]">
        {phases.map(p => (
          <div key={p.key} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: p.color }}
            />
            <span className={phaseKey === p.key ? 'text-white font-bold' : ''}>
              {p.label}
            </span>
          </div>
        ))}
      </div>

      {/* Phase Hero Card */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-6">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner"
          style={{ backgroundColor: `${color}25`, border: `1px solid ${color}50` }}
        >
          {icon}
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-bold text-white font-display">
            {localizePlaceLabel(locationLabel, currentLang)}
          </h4>
          <span
            className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: `${color}22`, color: color }}
          >
            {t(phaseKey)}
          </span>
          <p className="text-xs text-[#b7bbdb] mt-2 max-w-xl">
            {t(descKey)}
          </p>
        </div>
      </div>
    </section>
  );
};
