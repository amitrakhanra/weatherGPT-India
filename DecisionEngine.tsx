import React from 'react';
import { MonsoonResult } from '../types';
import { getSeasonDates } from '../services/weatherService';
import { localizeNumerals } from '../data/i18n';
import { Sprout, CheckCircle2, Volume2 } from 'lucide-react';

interface DecisionEngineProps {
  monsoonResult: MonsoonResult | null;
  currentLang: string;
  t: (key: string) => string;
  onSpeakAdvisory: (text: string) => void;
}

export const DecisionEngine: React.FC<DecisionEngineProps> = ({
  monsoonResult,
  currentLang,
  t,
  onSpeakAdvisory
}) => {
  const dates = getSeasonDates(monsoonResult);
  const onsetStartStr = dates.onsetStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const onsetEndStr = dates.onsetEnd.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const sowStartStr = dates.sowStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const sowEndStr = dates.sowEnd.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const breakStartStr = dates.breakStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const breakEndStr = dates.breakEnd.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const nurseryStartStr = dates.nurseryStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const irrigPrefillStr = dates.irrigPrefill.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const sowRange = `${localizeNumerals(sowStartStr, currentLang)} – ${localizeNumerals(sowEndStr, currentLang)}`;
  const breakRange = `${localizeNumerals(breakStartStr, currentLang)} – ${localizeNumerals(breakEndStr, currentLang)}`;

  let advisoryHeadline = t('advisoryHeadlineActive');
  let advisoryBody = t('advisoryBodyActive');
  if (dates.now < dates.sowStart) {
    const daysUntil = Math.max(1, Math.ceil((dates.sowStart.getTime() - dates.now.getTime()) / 86400000));
    advisoryHeadline = t('advisoryHeadlinePre').replace('{days}', localizeNumerals(daysUntil, currentLang));
    advisoryBody = t('advisoryBodyPre');
  } else if (dates.now > dates.breakEnd) {
    advisoryHeadline = t('advisoryHeadlineMonitor');
    advisoryBody = t('advisoryBodyMonitor');
  }

  const handleAudioPlay = () => {
    onSpeakAdvisory(`${advisoryHeadline}. ${advisoryBody}`);
  };

  return (
    <section id="decision" className="space-y-4 scroll-mt-20">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#4fce8a]" />
            <h3 className="text-lg font-bold text-white font-display">
              {t('decisionTitle')}
            </h3>
          </div>
          <button
            onClick={handleAudioPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 transition-colors"
            title="Read advisory aloud"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#5ee9c8]" />
            <span>Listen</span>
          </button>
        </div>
        <p className="text-xs text-[#7d81a8] mt-1">
          {t('decisionSub')}
        </p>
      </div>

      {/* Main Farmer Advisory Banner */}
      <div className="bg-gradient-to-r from-[#4fce8a]/15 via-white/[0.04] to-white/[0.02] border border-[#4fce8a]/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#4fce8a] uppercase tracking-wider">
            {t('farmerAdvisory')}
          </span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-white font-display mt-1">
          {advisoryHeadline}
        </h4>
        <p className="text-xs sm:text-sm text-[#b7bbdb] mt-1.5 max-w-3xl leading-relaxed">
          {advisoryBody}
        </p>
      </div>

      {/* 2 Structural Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sowing Window Card */}
        <div className="bg-[#4fce8a]/[0.08] border border-[#4fce8a]/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-lg bg-[#4fce8a]/20 text-[#4fce8a] font-bold text-xs tracking-wider uppercase mb-3">
              {t('actionSowTag')}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white font-display">
              {t('sowWindowHeadline').replace('{range}', sowRange)}
            </h4>
            <p className="text-xs text-[#b7bbdb] mt-1">
              {t('sowWindowDesc')}
            </p>

            <ul className="mt-4 space-y-2 text-xs text-[#b7bbdb]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4fce8a] shrink-0 mt-0.5" />
                <span>{t('nurseryStep').replace('{date}', localizeNumerals(nurseryStartStr, currentLang))}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4fce8a] shrink-0 mt-0.5" />
                <span>{t('stepConfirmRain')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4fce8a] shrink-0 mt-0.5" />
                <span>{t('stepDelayBreak')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Irrigation Card */}
        <div className="bg-[#f0836a]/[0.08] border border-[#f0836a]/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-lg bg-[#f0836a]/20 text-[#f0836a] font-bold text-xs tracking-wider uppercase mb-3">
              {t('actionIrrigationTag')}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white font-display">
              {t('irrigationHeadline').replace('{range}', breakRange)}
            </h4>
            <p className="text-xs text-[#b7bbdb] mt-1">
              {t('irrigationDesc')}
            </p>

            <ul className="mt-4 space-y-2 text-xs text-[#b7bbdb]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f0836a] shrink-0 mt-0.5" />
                <span>{t('irrigPrefillStep').replace('{date}', localizeNumerals(irrigPrefillStr, currentLang))}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f0836a] shrink-0 mt-0.5" />
                <span>{t('stepIrrigateEvery4th')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f0836a] shrink-0 mt-0.5" />
                <span>{t('stepMulch')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
