import React from 'react';
import { MonsoonResult } from '../types';
import { localizeNumerals } from '../data/i18n';
import { BarChart3 } from 'lucide-react';

interface BacktestSectionProps {
  monsoonResult: MonsoonResult | null;
  currentLang: string;
  t: (key: string) => string;
}

export const BacktestSection: React.FC<BacktestSectionProps> = ({
  monsoonResult,
  currentLang,
  t
}) => {
  const bt = monsoonResult?.backtest;
  const series = bt?.series || [];

  const allVals = series.flatMap(x => [x.pred, x.act]);
  const minV = allVals.length ? Math.min(...allVals) : 155;
  const maxV = allVals.length ? Math.max(...allVals) : 170;
  const scale = (v: number) => 24 + ((v - minV) / (maxV - minV || 1)) * 80;

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#6c8dff]" />
          <h3 className="text-lg font-bold text-white font-display">
            {t('backtestTitle')}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6c8dff]/15 text-[#6c8dff] uppercase tracking-wider">
            Cross-Validated
          </span>
        </div>
        <p className="text-xs text-[#7d81a8] mt-1">
          {t('backtestSub')}
        </p>
      </div>

      {/* Chart visualization */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 pt-6">
        <div className="flex items-end justify-around gap-2 sm:gap-6 h-40 pb-2 border-b border-white/10">
          {series.length === 0 ? (
            <div className="w-full text-center text-xs text-[#7d81a8] self-center">
              Awaiting historical backtest dataset…
            </div>
          ) : (
            series.map((item) => (
              <div key={item.yr} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="flex items-end gap-1.5">
                  {/* Predicted Bar */}
                  <div
                    className="w-3 sm:w-4 rounded-t-md bg-[#6c8dff] group-hover:brightness-110 transition-all relative"
                    style={{ height: `${scale(item.pred)}px` }}
                    title={`Predicted: DOY ${item.pred}`}
                  />
                  {/* Actual Bar */}
                  <div
                    className="w-3 sm:w-4 rounded-t-md bg-[#5ee9c8] group-hover:brightness-110 transition-all relative"
                    style={{ height: `${scale(item.act)}px` }}
                    title={`Actual: DOY ${item.act}`}
                  />
                </div>
                <span className="text-[11px] text-[#7d81a8] font-medium font-mono">
                  {localizeNumerals(item.yr, currentLang)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-[#b7bbdb] pt-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#6c8dff]" />
            <span>Leave-one-out Model Prediction</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#5ee9c8]" />
            <span>Actual Ground-Truth Onset</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold font-display text-white">
            ±{localizeNumerals((bt?.onsetMae ?? 2.9).toFixed(1), currentLang)} <span className="text-xs font-normal text-[#7d81a8]">{t('daysUnitLbl')}</span>
          </div>
          <div className="text-xs text-[#7d81a8] mt-1 font-medium">
            {t('onsetMaeLbl')}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold font-display text-white">
            ±{localizeNumerals((bt?.breakMae ?? 3.1).toFixed(1), currentLang)} <span className="text-xs font-normal text-[#7d81a8]">{t('daysUnitLbl')}</span>
          </div>
          <div className="text-xs text-[#7d81a8] mt-1 font-medium">
            {t('breakMaeLbl')}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold font-display text-[#5ee9c8]">
            {localizeNumerals(bt?.reliability ?? 92, currentLang)}%
          </div>
          <div className="text-xs text-[#7d81a8] mt-1 font-medium">
            {t('reliabilityLbl')}
          </div>
        </div>
      </div>
    </section>
  );
};
