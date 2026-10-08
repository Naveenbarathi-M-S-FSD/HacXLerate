import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface MedicalWarningProps {
  compact?: boolean;
}

export const MedicalWarning: React.FC<MedicalWarningProps> = ({ compact = false }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="flex-1">{t.disclaimer.text}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 shadow-xs text-amber-950">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-900">{t.disclaimer.title}</h4>
          <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">
            {t.disclaimer.text}
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50/80 border border-rose-200 px-3 py-1.5 rounded-lg w-fit">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.disclaimer.emergency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
