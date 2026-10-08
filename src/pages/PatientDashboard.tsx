import React, { useState } from 'react';
import {
  FileText,
  Pill,
  Calendar,
  BellRing,
  Upload,
  PlusCircle,
  Bot,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { UploadDocumentModal } from '../components/patient/UploadDocumentModal';
import { AIInsightCard } from '../components/patient/AIInsightCard';
import { QRCodeCard } from '../components/patient/QRCodeCard';
import { ActiveTab } from '../components/common/Sidebar';

interface PatientDashboardProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenUpload: (type?: any) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onNavigateTab,
  onOpenUpload,
}) => {
  const {
    currentUser,
    patientProfile,
    medicalRecords,
    medications,
    appointments,
    reminders,
    toggleReminder,
  } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const activeMeds = medications.filter((m) => m.active);
  const upcomingApts = appointments.filter((a) => a.status === 'scheduled');
  const activeReminders = reminders.filter((r) => r.enabled && !r.completed);

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleToggleReminder = async (remId: string) => {
    await toggleReminder(remId);
    showToast('Reminder updated', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-800 to-emerald-700 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Sparkles className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 text-xs font-semibold backdrop-blur-xs">
                Patient Dashboard
              </span>
              {patientProfile && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-900/60 font-mono text-teal-200 text-xs font-bold">
                  Health ID: {patientProfile.healthId}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}, {currentUser?.name || 'Patient'}
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              {t.dashboard.overviewSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenUpload('prescription')}
              className="px-4 py-2.5 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-teal-700" />
              <span>{t.dashboard.uploadPrescription}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('copilot')}
              className="px-4 py-2.5 rounded-xl bg-teal-900/50 hover:bg-teal-900/70 text-white border border-white/20 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-teal-300" />
              <span>{t.dashboard.askCopilot}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Records */}
        <div
          onClick={() => onNavigateTab('records')}
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.healthRecordsCount}
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {medicalRecords.length}
          </p>
          <p className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
            <span>View Timeline</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Medicines */}
        <div
          onClick={() => onNavigateTab('medicines')}
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.activeMedicines}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeMeds.length}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>Manage Dosages</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Appointments */}
        <div
          onClick={() => onNavigateTab('appointments')}
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.upcomingAppointments}
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {upcomingApts.length}
          </p>
          <p className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
            <span>Schedule / View</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Reminders */}
        <div
          onClick={() => onNavigateTab('reminders')}
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.dashboard.activeReminders}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {activeReminders.length}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <span>Medication Alert</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t.dashboard.quickActions}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => onOpenUpload('prescription')}
            className="p-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 text-teal-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all shadow-2xs"
          >
            <Upload className="w-5 h-5 text-teal-700" />
            <span>{t.dashboard.uploadPrescription}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenUpload('lab_report')}
            className="p-3 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/70 text-sky-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all shadow-2xs"
          >
            <FileText className="w-5 h-5 text-sky-700" />
            <span>{t.dashboard.uploadRecord}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('medicines')}
            className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all shadow-2xs"
          >
            <Pill className="w-5 h-5 text-emerald-700" />
            <span>{t.dashboard.addMedicine}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('reminders')}
            className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all shadow-2xs"
          >
            <BellRing className="w-5 h-5 text-amber-700" />
            <span>{t.dashboard.addReminder}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('records')}
            className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex flex-col items-center text-center gap-2 transition-all shadow-2xs"
          >
            <Clock className="w-5 h-5 text-slate-600" />
            <span>{t.dashboard.viewHistory}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('copilot')}
            className="p-3 rounded-xl border border-teal-300 bg-gradient-to-br from-teal-600 to-emerald-600 text-white text-xs font-bold flex flex-col items-center text-center gap-2 transition-all shadow-xs"
          >
            <Bot className="w-5 h-5 text-teal-100" />
            <span>{t.dashboard.askCopilot}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: AI Health Insights + Upcoming Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Health Insights (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <AIInsightCard />

          {/* Quick Health ID / QR Card */}
          {patientProfile && (
            <QRCodeCard
              healthId={patientProfile.healthId}
              patientName={patientProfile.name}
              dob={patientProfile.dob}
              bloodGroup={patientProfile.bloodGroup}
            />
          )}
        </div>

        {/* Sidebar Column: Reminders & Appointments */}
        <div className="space-y-6">
          {/* Upcoming Reminders Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-600" />
                <span>{t.dashboard.upcomingRemindersTitle}</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('reminders')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                View all
              </button>
            </div>

            {reminders.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                {t.dashboard.noReminders}
              </p>
            ) : (
              <div className="space-y-2.5">
                {reminders.slice(0, 4).map((rem) => (
                  <div
                    key={rem.reminderId}
                    className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 transition-all ${
                      rem.completed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-amber-50/40 border-amber-100 text-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className={`font-bold ${rem.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {rem.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{rem.description}</p>
                      <p className="text-[10px] text-amber-800 font-medium">
                        ⏰ {rem.time} • {rem.repeat}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleReminder(rem.reminderId)}
                      className={`p-1.5 rounded-lg shrink-0 ${
                        rem.completed
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next Consultation Preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Next Doctor Visit</span>
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('appointments')}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Manage
              </button>
            </div>

            {upcomingApts.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No upcoming visits booked.</p>
            ) : (
              <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-1.5 text-xs">
                <p className="font-bold text-slate-900">{upcomingApts[0].doctorName}</p>
                <p className="text-sky-900 font-medium">{upcomingApts[0].hospitalName}</p>
                <p className="text-[11px] text-slate-600">{upcomingApts[0].purpose}</p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-sky-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{upcomingApts[0].date} at {upcomingApts[0].time}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
