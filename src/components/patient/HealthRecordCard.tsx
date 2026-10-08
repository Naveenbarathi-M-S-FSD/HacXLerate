import React, { useState } from 'react';
import {
  FileText,
  Pill,
  Activity,
  Calendar,
  Building,
  User,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { MedicalRecord } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';

interface HealthRecordCardProps {
  record: MedicalRecord;
  onDelete?: (recordId: string) => void;
}

export const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record, onDelete }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
    prescription: { label: 'Prescription', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' },
    lab_report: { label: 'Lab Report', bg: 'bg-sky-50 border-sky-200', text: 'text-sky-800' },
    doctor_visit: { label: 'Doctor Visit', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800' },
    discharge_summary: { label: 'Discharge Summary', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800' },
    other: { label: 'Medical Document', bg: 'bg-slate-50 border-slate-200', text: 'text-slate-800' },
  };

  const badge = typeConfig[record.recordType] || typeConfig.other;
  const meds = record.extractedData?.medications || [];
  const labs = record.extractedData?.labTests || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${badge.bg} ${badge.text}`}
              >
                {badge.label}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{record.recordDate}</span>
              </div>
            </div>
            <h4 className="text-base font-bold text-slate-900">{record.title}</h4>
            {(record.doctorName || record.hospitalName) && (
              <p className="text-xs text-slate-600 flex items-center gap-2">
                {record.doctorName && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {record.doctorName}
                  </span>
                )}
                {record.hospitalName && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" />
                    {record.hospitalName}
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {record.uploadedFileUrl && (
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="p-2 text-teal-700 hover:bg-teal-50 rounded-xl text-xs font-semibold flex items-center gap-1 border border-teal-200 transition-colors"
                title="View original uploaded file"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Document</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(record.recordId)}
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* AI Summary Highlight */}
        {record.aiSummary && (
          <div className="mt-3 p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-start gap-2.5 text-xs text-teal-950">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-normal">{record.aiSummary}</p>
          </div>
        )}

        {/* Highlights badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {meds.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              <span>{meds.length} {t.records.medicinesCount}</span>
            </span>
          )}
          {labs.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-semibold border border-sky-100">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>{labs.length} {t.records.labResultsCount}</span>
            </span>
          )}
          {record.extractedData?.diagnosis && (
            <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Diagnosis: <strong className="font-semibold text-slate-800">{record.extractedData.diagnosis}</strong>
            </span>
          )}
        </div>

        {/* Toggle Detailed View */}
        {(meds.length > 0 || labs.length > 0 || record.extractedData?.clinicalAdvice) && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>{expanded ? 'Hide Details' : 'View Extracted Breakdown'}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Expanded Breakdown */}
      {expanded && (
        <div className="bg-slate-50/70 p-5 border-t border-slate-100 space-y-4 animate-in fade-in">
          {/* Medications table */}
          {meds.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Medications
              </h5>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {meds.map((m, idx) => (
                  <div key={idx} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">{m.medicineName} ({m.dosage})</p>
                      <p className="text-slate-500">{m.instructions}</p>
                    </div>
                    <div className="text-left sm:text-right text-teal-800 font-medium">
                      <span>{m.frequency}</span> • <span>{m.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lab tests table */}
          {labs.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Lab Results
              </h5>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {labs.map((l, idx) => (
                  <div key={idx} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{l.testName}</p>
                      <p className="text-slate-500">Normal Range: {l.referenceRange} {l.unit}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        l.abnormalIndicator === 'high' ? 'bg-rose-100 text-rose-800' :
                        l.abnormalIndicator === 'low' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {l.testResult} {l.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Advice */}
          {record.extractedData?.clinicalAdvice && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Doctor Advice: </span>
              <span className="text-slate-600">{record.extractedData.clinicalAdvice}</span>
            </div>
          )}
        </div>
      )}

      {/* Image Modal Preview */}
      {showImageModal && record.uploadedFileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="text-sm font-bold text-slate-900">{record.title} (Original Document)</h4>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex justify-center">
              <img
                src={record.uploadedFileUrl}
                alt={record.title}
                className="max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
