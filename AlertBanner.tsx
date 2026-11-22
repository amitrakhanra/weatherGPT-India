import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ComputedAlerts } from '../types';

interface AlertBannerProps {
  alerts: ComputedAlerts | null;
  t: (key: string) => string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, t }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!alerts || alerts.worstLevel === 'levelLow' || dismissed) {
    return null;
  }

  const worstFlag = alerts.flags.find(f => f.levelKey === alerts.worstLevel) || alerts.flags[0];

  return (
    <div className="bg-gradient-to-r from-[#e5555a]/20 via-[#f0836a]/15 to-[#e5555a]/10 border-b border-[#e5555a]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 text-xs sm:text-sm text-[#ffd9d5]">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-md bg-[#e5555a]/30 text-[#e5555a] shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <div>
            <strong className="font-semibold text-white">{t('alertBannerPrefix')}: </strong>
            <span>{t(worstFlag.labelKey)} — {t(worstFlag.levelKey)} ({worstFlag.detail})</span>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
