import React, { useState } from 'react';
import {
  Search,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  User,
  Calendar,
  MessageSquare,
  FileText,
  Lock,
  Unlock,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { PatientProfile } from '../../types';
import { QRScannerModal } from './QRScannerModal';
import { PatientRecordsModal } from './PatientRecordsModal';
import { SendMessageModal } from './SendMessageModal';
import { DEMO_PATIENT_PROFILE } from '../../data/demoData';

export const DoctorPatientSearch: React.FC = () => {
  const {
    currentUser,
    findPatientByHealthId,
    getDoctorAccessStatus,
    grantDoctorAccess,
    requestDoctorAccess,
    addAppointment,
  } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [searchInput, setSearchInput] = useState('9823-4412-8819-03');
  const [foundPatient, setFoundPatient] = useState<PatientProfile | null>(DEMO_PATIENT_PROFILE);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Appointment schedule state
  const [aptDate, setAptDate] = useState('2026-10-18');
  const [aptTime, setAptTime] = useState('11:00 AM');
  const [aptPurpose, setAptPurpose] = useState('Follow-up Review & Glucose Monitoring');

  const doctorId = currentUser?.uid || 'demo_doctor_uid';
  const accessStatus = foundPatient ? getDoctorAccessStatus(doctorId, foundPatient.uid) : 'none';

  const handleSearch = (idToSearch?: string) => {
    const query = idToSearch || searchInput;
    if (!query.trim()) {
      showToast('Please enter a 14-digit Health ID', 'error');
      return;
    }
    const patient = findPatientByHealthId(query.trim());
    if (patient) {
      setFoundPatient(patient);
      showToast(`Patient found: ${patient.name}`, 'success');
    } else {
      setFoundPatient(null);
      showToast('No patient found with this 14-digit Health ID', 'error');
    }
  };

  const handleGrantAccess = async () => {
    if (!foundPatient) return;
    await grantDoctorAccess(doctorId, foundPatient.uid);
    showToast('Records authorization granted for clinical review', 'success');
  };

  const handleCreateAppointment = async () => {
    if (!foundPatient) return;
    const newApt = {
      appointmentId: 'apt_' + Date.now(),
      patientId: foundPatient.uid,
      doctorId,
      patientName: foundPatient.name,
      doctorName: currentUser?.name || 'Dr. Medical Officer',
      patientHealthId: foundPatient.healthId,
      hospitalName: (currentUser as any)?.hospitalName || 'Clinical Consultation',
      date: aptDate,
      time: aptTime,
      purpose: aptPurpose,
      status: 'scheduled' as const,
      createdAt: new Date().toISOString(),
    };
    await addAppointment(newApt);
    showToast(`Appointment scheduled with ${foundPatient.name} on ${aptDate}`, 'success');
    setIsAppointmentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{t.doctor.searchTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter the patient's unique 14-digit Health ID or scan their QR badge
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.doctor.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSearch()}
            className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {t.doctor.searchButton}
          </button>

          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>{t.doctor.scanQRButton}</span>
          </button>
        </div>

        {/* Demo prompt hint */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Demo Patient ID:</span>
          <button
            onClick={() => {
              setSearchInput('9823-4412-8819-03');
              handleSearch('9823-4412-8819-03');
            }}
            className="font-mono font-bold text-teal-700 hover:underline"
          >
            9823-4412-8819-03 (K. Selvaraj)
          </button>
        </div>
      </div>

      {/* Found Patient Card */}
      {foundPatient && (
        <div className="rounded-2xl border border-teal-200 bg-white p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-lg shrink-0">
                {foundPatient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-900">{foundPatient.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-mono font-semibold text-slate-700">
                    {foundPatient.healthId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Age: {new Date().getFullYear() - parseInt(foundPatient.dob.slice(0, 4))} • Gender: {foundPatient.gender} • Blood Group: {foundPatient.bloodGroup}
                </p>
              </div>
            </div>

            {/* Access permission badge */}
            <div className="flex items-center gap-2">
              {accessStatus === 'granted' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t.doctor.accessGrantedBadge}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>{t.doctor.accessPendingBadge}</span>
                </span>
              )}
            </div>
          </div>

          {/* Clinical summary & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold uppercase text-slate-400">Conditions</p>
              <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                {foundPatient.medicalConditions}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100">
              <p className="text-[11px] font-bold uppercase text-rose-500">Allergies</p>
              <p className="text-xs font-semibold text-rose-900 mt-1 truncate">
                {foundPatient.allergies}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold uppercase text-slate-400">Address</p>
              <p className="text-xs font-semibold text-slate-800 mt-1 truncate">
                {foundPatient.address}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {accessStatus === 'granted' ? (
              <button
                type="button"
                onClick={() => setIsRecordsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{t.doctor.viewAuthorizedRecords}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGrantAccess}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Unlock className="w-4 h-4" />
                <span>Grant / Verify Authorization</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMessageModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>{t.doctor.sendMessageButton}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>{t.doctor.scheduleAppointmentButton}</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedHealthId) => {
          setSearchInput(scannedHealthId);
          handleSearch(scannedHealthId);
        }}
      />

      {/* Patient Records Modal */}
      {foundPatient && (
        <PatientRecordsModal
          isOpen={isRecordsModalOpen}
          onClose={() => setIsRecordsModalOpen(false)}
          patient={foundPatient}
        />
      )}

      {/* Send Message Modal */}
      {foundPatient && (
        <SendMessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          patientId={foundPatient.uid}
          patientName={foundPatient.name}
        />
      )}

      {/* Schedule Appointment Modal */}
      {isAppointmentModalOpen && foundPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Schedule Consultation with {foundPatient.name}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={aptDate}
                onChange={(e) => setAptDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                value={aptTime}
                onChange={(e) => setAptTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Reason</label>
              <input
                type="text"
                value={aptPurpose}
                onChange={(e) => setAptPurpose(e.target.value)}
                placeholder="e.g. Follow-up consultation"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAppointment}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
