import React from 'react';
import { MonsoonResult } from '../types';
import { getSeasonDates } from '../services/weatherService';
import { localizeNumerals } from '../data/i18n';
import { CloudLightning, Clock, ShieldCheck } from 'lucide-react';

interface MonsoonSectionProps {
  monsoonResult: MonsoonResult | null;
  currentLang: string;
  t: (key: string) => string;
}

export const MonsoonSection: React.FC<MonsoonSectionProps> = ({
  monsoonResult,
  currentLang,
  t
}) => {
  const dates = getSeasonDates(monsoonResult);
  const onsetStartStr = dates.onsetStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const onsetEndStr = dates.onsetEnd.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const breakStartStr = dates.breakStart.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const breakEndStr = dates.breakEnd.toLocaleDateString([], { month: 'short', day: 'numeric' });

  const onsetConf = monsoonResult?.onsetConfidence || 78;
  const breakProb = monsoonResult?.breakProbability || 34;

  return (
    <section id="monsoon" className="space-y-4 scroll-mt-20">
      <div>
        <div className="flex items-center gap-2">
          <CloudLightning className="w-5 h-5 text-[#5ee9c8]" />
          <h3 className="text-lg font-bold text-white font-display">
            {t('monsoonTitle')}
          </h3>
        </div>
        <p className="text-xs text-[#7d81a8] mt-1 max-w-3xl">
          {t('monsoonSub')}
        </p>
        {monsoonResult?.statusText && (
          <p className="text-[11px] text-[#5ee9c8]/90 mt-1 font-mono">
            {monsoonResult.statusText}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Onset Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#7d81a8] uppercase tracking-wider">
                {t('onsetLbl')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5ee9c8]/15 text-[#5ee9c8]">
                {t('confHigh')}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {/* Conic Ring */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-display font-extrabold text-lg text-white shrink-0 relative"
                style={{
                  background: `conic-gradient(#5ee9c8 ${onsetConf}%, rgba(255,255,255,0.08) 0)`
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[#12162e] flex items-center justify-center">
                  {localizeNumerals(onsetConf, currentLang)}%
                </div>
              </div>

              <div>
                <div className="text-xl font-extrabold text-white font-display">
                  {localizeNumerals(onsetStartStr, currentLang)} – {localizeNumerals(onsetEndStr, currentLang)}
                </div>
                <div className="text-xs text-[#7d81a8] mt-0.5">
                  {t('onsetWindowLbl')}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-[#b7bbdb]">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#5ee9c8]" />
                {t('leadTime9')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#6c8dff]" />
                {t('modelMae')}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-[#7d81a8] mb-1.5">
              <span>{t('probVsLeadLbl')}</span>
              <span className="font-semibold text-white">{localizeNumerals(onsetConf, currentLang)}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6c8dff] to-[#5ee9c8] transition-all duration-700"
                style={{ width: `${onsetConf}%` }}
              />
            </div>
          </div>
        </div>

        {/* Break (Mid-season lull) Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#7d81a8] uppercase tracking-wider">
                {t('breakLbl')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f4b942]/15 text-[#f4b942]">
                {t('confModerate')}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {/* Conic Ring */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-display font-extrabold text-lg text-white shrink-0 relative"
                style={{
                  background: `conic-gradient(#f0836a ${breakProb}%, rgba(255,255,255,0.08) 0)`
                }}
              >
                <div className="w-16 h-16 rounded-full bg-[#12162e] flex items-center justify-center">
                  {localizeNumerals(breakProb, currentLang)}%
                </div>
              </div>

              <div>
                <div className="text-xl font-extrabold text-white font-display">
                  {localizeNumerals(breakStartStr, currentLang)} – {localizeNumerals(breakEndStr, currentLang)}
                </div>
                <div className="text-xs text-[#7d81a8] mt-0.5">
                  {t('breakWindowLbl')}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-[#b7bbdb]">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#f0836a]" />
                {t('leadTime21')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#f4b942]" />
                {t('severityMild')}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-[#7d81a8] mb-1.5">
              <span>{t('probVsLeadLbl')}</span>
              <span className="font-semibold text-white">{localizeNumerals(breakProb, currentLang)}%</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#f0836a] to-[#f4b942] transition-all duration-700"
                style={{ width: `${breakProb}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
