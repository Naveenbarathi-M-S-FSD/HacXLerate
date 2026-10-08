import React from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Pill,
  Activity,
  Calendar,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { MedicalRecord, PatientProfile } from '../../types';
import { HealthRecordCard } from '../patient/HealthRecordCard';
import { useAuth } from '../../contexts/AuthContext';
import { MedicalWarning } from '../common/MedicalWarning';

interface PatientRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
}

export const PatientRecordsModal: React.FC<PatientRecordsModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const { medicalRecords, medications } = useAuth();

  if (!isOpen) return null;

  const patientRecords = medicalRecords.filter((r) => r.patientId === patient.uid);
  const patientMeds = medications.filter((m) => m.patientId === patient.uid && m.active);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-teal-50/70 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{patient.name}'s Records</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Patient-authorized information
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Health ID: <span className="font-mono font-bold">{patient.healthId}</span> • Blood Group: {patient.bloodGroup} • DOB: {patient.dob}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <MedicalWarning compact />

          {/* Clinical Background Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Medical Conditions
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                {patient.medicalConditions || 'None specified'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-rose-50/50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                Known Allergies
              </p>
              <p className="text-xs font-semibold text-rose-900 mt-1">
                {patient.allergies || 'None reported'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Emergency Contact
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                {patient.emergencyContact || 'None specified'}
              </p>
            </div>
          </div>

          {/* Active Prescribed Medications */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Active Medications ({patientMeds.length})</span>
            </h4>
            {patientMeds.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No active medications registered.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {patientMeds.map((med) => (
                  <div key={med.medicationId} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                    <p className="font-bold text-slate-900">{med.medicineName} ({med.dosage})</p>
                    <p className="text-teal-700 font-medium">{med.frequency} • {med.duration}</p>
                    <p className="text-slate-500 mt-0.5">{med.instructions}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Documents History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Medical History Timeline ({patientRecords.length} Records)</span>
            </h4>

            {patientRecords.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-2xl text-xs text-slate-500">
                No uploaded records available for this patient.
              </div>
            ) : (
              <div className="space-y-3">
                {patientRecords.map((rec) => (
                  <HealthRecordCard key={rec.recordId} record={rec} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
