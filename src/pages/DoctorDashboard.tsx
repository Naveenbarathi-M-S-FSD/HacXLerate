import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Clock,
  Search,
  Store,
  ShieldCheck,
  Stethoscope,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DoctorPatientSearch } from '../components/doctor/DoctorPatientSearch';
import { ActiveTab } from '../components/common/Sidebar';

interface DoctorDashboardProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, doctorProfile, appointments, accessGrants } = useAuth();
  const { t } = useLanguage();

  const authorizedPatientsCount = accessGrants.filter((g) => g.status === 'granted').length;
  const pendingRequestsCount = accessGrants.filter((g) => g.status === 'requested').length;
  const todayApts = appointments.filter((a) => a.status === 'scheduled');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900 to-teal-800 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-sky-100 text-xs font-semibold">
                Doctor Workspace
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-400/40">
                Verified Practitioner (Demo)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser?.name || 'Dr. Medical Officer'}
            </h2>
            <p className="text-sky-100 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              {doctorProfile?.specialization} • {doctorProfile?.hospitalName} • Registration: {doctorProfile?.registrationNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('doctor_pharmacy_network')}
              className="px-4 py-2.5 rounded-xl bg-white text-teal-900 hover:bg-sky-50 text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-teal-700" />
              <span>Pharmacy Network</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.doctor.statsTodayAppointments}</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{todayApts.length}</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.doctor.statsUpcoming}</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{appointments.length}</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.doctor.statsTotalPatients}</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{authorizedPatientsCount || 1}</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">{t.doctor.statsPendingRequests}</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingRequestsCount}</p>
        </div>
      </div>

      {/* Main Section: Patient Search & Authorized Record View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-600" />
            <span>Search & Authorize Patient</span>
          </h3>
        </div>

        <DoctorPatientSearch />
      </div>

      {/* Today's Appointments List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Upcoming Consultations</span>
          </h3>
        </div>

        {todayApts.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No consultations scheduled.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayApts.map((apt) => (
              <div key={apt.appointmentId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{apt.patientName}</p>
                  <p className="text-slate-500">{apt.purpose}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-bold text-teal-800">{apt.date} • {apt.time}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold uppercase tracking-wider text-[10px]">
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
