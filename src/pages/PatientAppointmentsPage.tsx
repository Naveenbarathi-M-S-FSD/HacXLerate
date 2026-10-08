import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Building,
  User,
  Plus,
  XCircle,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { Appointment } from '../types';

export const PatientAppointmentsPage: React.FC = () => {
  const { currentUser, appointments, cancelAppointment, addAppointment } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const [doctorName, setDoctorName] = useState('Dr. A. Ramanathan');
  const [hospitalName, setHospitalName] = useState('Apollo City Clinic');
  const [date, setDate] = useState('2026-10-22');
  const [time, setTime] = useState('10:00 AM');
  const [purpose, setPurpose] = useState('Routine Health Review & Follow-up');

  const filtered = appointments.filter((apt) => {
    if (activeTab === 'upcoming') return apt.status === 'scheduled';
    if (activeTab === 'past') return apt.status === 'completed';
    if (activeTab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const handleCancel = async (aptId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(aptId);
      showToast('Appointment cancelled', 'info');
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      appointmentId: 'apt_' + Date.now(),
      patientId: currentUser?.uid || 'patient',
      doctorId: 'doc_' + Date.now(),
      doctorName,
      hospitalName,
      patientName: currentUser?.name || 'Patient',
      date,
      time,
      purpose,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    await addAppointment(newApt);
    showToast('Consultation appointment scheduled!', 'success');
    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.appointments.title}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.appointments.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.appointments.bookAppointment}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'upcoming', label: t.appointments.upcomingTab },
          { id: 'past', label: t.appointments.pastTab },
          { id: 'cancelled', label: t.appointments.cancelledTab },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointment list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">{t.appointments.noAppointments}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((apt) => (
            <div
              key={apt.appointmentId}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      apt.status === 'scheduled'
                        ? 'bg-sky-100 text-sky-800'
                        : apt.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{apt.doctorName}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.hospitalName}</span>
                  </p>
                </div>

                {apt.status === 'scheduled' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(apt.appointmentId)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.appointments.cancelAppointment}</span>
                  </button>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-teal-800">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{apt.date} • {apt.time}</span>
                </div>
                <p className="text-slate-600">
                  <strong>Purpose:</strong> {apt.purpose}
                </p>
                {apt.notes && (
                  <p className="text-slate-500 italic">Note: {apt.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-base font-bold text-slate-900">{t.appointments.bookAppointment}</h3>
              <button onClick={() => setIsBookModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.appointments.doctor}</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. A. Ramanathan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.appointments.hospital}</label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g. Apollo City Clinic"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.appointments.purpose}</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Blood Sugar Follow-up"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
