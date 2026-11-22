import React from 'react';
import { LANGS, LanguageOption } from '../data/i18n';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: string;
  onSelectLanguage: (lang: LanguageOption) => void;
  t: (key: string) => string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLanguage,
  t
}) => {
  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
      <div className="flex items-center gap-2">
        <Languages className="w-5 h-5 text-[#5ee9c8]" />
        <h3 className="text-lg font-bold text-white font-display">
          Multilingual Weather Intelligence (22 Indian Languages)
        </h3>
      </div>
      <p className="text-xs text-[#7d81a8]">
        {t('langSub')}
      </p>

      <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
        {LANGS.map((lang) => {
          const isActive = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLanguage(lang)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#6c8dff] text-white shadow-lg shadow-[#6c8dff]/25 font-bold scale-105'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-[#b7bbdb] border border-white/10'
              } ${lang.isBeta ? 'opacity-80' : ''}`}
            >
              <span>{lang.label}</span>
              {lang.isBeta && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#7d81a8]">beta</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
