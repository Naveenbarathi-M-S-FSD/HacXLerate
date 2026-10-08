import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  HelpCircle,
  Clock,
  Pill,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { generateHealthSummary, HealthSummaryResult } from '../../services/gemini';
import { MedicalWarning } from '../common/MedicalWarning';

export const AIInsightCard: React.FC = () => {
  const { patientProfile, medicalRecords, medications } = useAuth();
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<HealthSummaryResult | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await generateHealthSummary(patientProfile, medicalRecords, medications, language);
      setSummary(res);
    } catch (e) {
      console.error('Failed to generate insights:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [medicalRecords.length, medications.length, language]);

  return (
    <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/50 via-white to-emerald-50/30 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-600 text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.dashboard.aiInsightsTitle}
            </h3>
            <p className="text-xs text-slate-500">
              Grounded strictly in your {medicalRecords.length} stored health records
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={fetchInsights}
          className="p-2 rounded-xl text-teal-700 hover:bg-teal-50 border border-teal-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold"
          title="Refresh AI Insights"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <MedicalWarning compact />

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin" />
          <p className="text-xs text-slate-600 font-medium">{t.dashboard.aiAnalyzing}</p>
        </div>
      ) : summary ? (
        <div className="space-y-4">
          {/* Recent highlights */}
          {summary.recentHighlights && (
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>{t.dashboard.recentHighlights}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {summary.recentHighlights}
              </p>
            </div>
          )}

          {/* Medication adherence note */}
          {summary.medicationAdherence && (
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>{t.dashboard.medicationAdherence}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {summary.medicationAdherence}
              </p>
            </div>
          )}

          {/* Follow-up Checklist */}
          {summary.followUpRecommendations && (
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{t.dashboard.followUpRecommendations}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {summary.followUpRecommendations}
              </p>
            </div>
          )}

          {/* Questions for doctor */}
          {summary.questionsForDoctor && summary.questionsForDoctor.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>{t.dashboard.questionsForDoctor}</span>
              </h4>
              <ul className="space-y-1.5">
                {summary.questionsForDoctor.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
