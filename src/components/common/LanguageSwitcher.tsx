import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
      <div className="flex items-center px-2 py-1 text-xs font-semibold text-slate-500 gap-1.5">
        <Globe className="w-3.5 h-3.5 text-teal-600" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
          language === 'en'
            ? 'bg-white text-teal-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ta')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all font-tamil ${
          language === 'ta'
            ? 'bg-white text-teal-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
};
