import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Calendar,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { HealthRecordCard } from '../components/patient/HealthRecordCard';
import { MedicalWarning } from '../components/common/MedicalWarning';

interface HealthRecordsPageProps {
  onOpenUpload: (type?: any) => void;
}

export const HealthRecordsPage: React.FC<HealthRecordsPageProps> = ({ onOpenUpload }) => {
  const { medicalRecords, deleteMedicalRecord } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = medicalRecords.filter((rec) => {
    const matchesFilter = activeFilter === 'all' || rec.recordType === activeFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      rec.title.toLowerCase().includes(term) ||
      (rec.doctorName && rec.doctorName.toLowerCase().includes(term)) ||
      (rec.hospitalName && rec.hospitalName.toLowerCase().includes(term)) ||
      (rec.extractedData?.diagnosis && rec.extractedData.diagnosis.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to remove this medical record?')) {
      await deleteMedicalRecord(recordId);
      showToast('Record deleted from health history', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.records.title}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.records.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpload('prescription')}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>{t.records.uploadButton}</span>
        </button>
      </div>

      <MedicalWarning compact />

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.records.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: t.records.filterAll },
              { id: 'prescription', label: t.records.filterPrescription },
              { id: 'lab_report', label: t.records.filterLab },
              { id: 'doctor_visit', label: t.records.filterVisit },
              { id: 'discharge_summary', label: t.records.filterSummary },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeFilter === f.id
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline List */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">{t.records.noRecordsFound}</p>
          <p className="text-xs text-slate-400">
            Upload your first prescription or diagnostic report to build your clinical history.
          </p>
          <button
            onClick={() => onOpenUpload('prescription')}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
          >
            {t.records.uploadButton}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <HealthRecordCard
              key={record.recordId}
              record={record}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
