import React, { useState } from 'react';
import {
  Pill,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { Medication } from '../types';

export const PatientMedicinesPage: React.FC = () => {
  const { currentUser, medications, addMedication, toggleMedication, deleteMedication } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('500 mg');
  const [frequency, setFrequency] = useState('Twice daily');
  const [duration, setDuration] = useState('Ongoing');
  const [instructions, setInstructions] = useState('Take after food with water');

  const activeMeds = medications.filter((m) => m.active);
  const pastMeds = medications.filter((m) => !m.active);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) {
      showToast('Please specify a medicine name', 'error');
      return;
    }

    const newMed: Medication = {
      medicationId: 'med_' + Date.now(),
      patientId: currentUser?.uid || 'patient',
      medicineName: medicineName.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
      instructions: instructions.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };

    await addMedication(newMed);
    showToast('Medication added to your active routine!', 'success');
    setMedicineName('');
    setIsAddModalOpen(false);
  };

  const handleToggle = async (id: string) => {
    await toggleMedication(id);
    showToast('Medication status updated', 'info');
  };

  const handleDelete = async (id: string) => {
    await deleteMedication(id);
    showToast('Medication removed', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.nav.medicines}</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of your active prescribed dosages, intake instructions, and historical medicines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Active Medications */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-600" />
          <span>Active Routine Prescriptions ({activeMeds.length})</span>
        </h3>

        {activeMeds.length === 0 ? (
          <div className="p-8 border border-dashed rounded-2xl text-center text-xs text-slate-500 bg-white">
            No active medications listed. Upload a prescription or click "Add Medicine".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMeds.map((med) => (
              <div
                key={med.medicationId}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {med.medicineName} <span className="text-teal-700 font-semibold">({med.dosage})</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggle(med.medicationId)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      title="Move to past medications"
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(med.medicationId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <p className="font-semibold text-slate-800">
                    Schedule: <span className="text-teal-800">{med.frequency}</span> • {med.duration}
                  </p>
                  <p className="text-slate-600">
                    Instructions: <em>{med.instructions}</em>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past / Inactive Medications */}
      {pastMeds.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Past / Completed Medications ({pastMeds.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastMeds.map((med) => (
              <div
                key={med.medicationId}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 opacity-70 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-700">{med.medicineName} ({med.dosage})</p>
                  <p className="text-slate-500">{med.instructions}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(med.medicationId)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-teal-700 font-semibold"
                >
                  Reactivate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-base font-bold text-slate-900">Add New Medication</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Metformin Hydrochloride"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="500 mg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="Twice daily"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 30 days or Ongoing"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take immediately after food"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
