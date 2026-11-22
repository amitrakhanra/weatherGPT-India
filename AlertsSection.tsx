import React from 'react';
import { ComputedAlerts } from '../types';
import { AlertCircle } from 'lucide-react';

interface AlertsSectionProps {
  alerts: ComputedAlerts | null;
  t: (key: string) => string;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts, t }) => {
  return (
    <section id="alerts" className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4 scroll-mt-20">
      <div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[#e5555a]" />
          <h3 className="text-lg font-bold text-white font-display">
            {t('liveAlertsTitle')}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e5555a]/15 text-[#e5555a] uppercase tracking-wider">
            Hydrological Risk
          </span>
        </div>
        <p className="text-xs text-[#7d81a8] mt-1">
          {t('liveAlertsSub')}
        </p>
      </div>

      <div className="divide-y divide-white/5">
        {!alerts ? (
          <div className="py-4 text-xs text-[#7d81a8]">Calculating risk matrices…</div>
        ) : (
          alerts.flags.map((flag, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${flag.color}20` }}
                >
                  {flag.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t(flag.labelKey)}
                  </div>
                  <div className="text-xs text-[#7d81a8] mt-0.5">
                    {flag.detail}
                  </div>
                </div>
              </div>

              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0"
                style={{
                  backgroundColor: `${flag.color}20`,
                  color: flag.color
                }}
              >
                {t(flag.levelKey)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
