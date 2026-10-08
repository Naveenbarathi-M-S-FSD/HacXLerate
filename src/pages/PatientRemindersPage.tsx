import React, { useState } from 'react';
import {
  BellRing,
  Plus,
  Pill,
  Calendar,
  Activity,
  FileText,
  Clock,
  Trash2,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { Reminder } from '../types';

export const PatientRemindersPage: React.FC = () => {
  const { currentUser, reminders, addReminder, toggleReminder, deleteReminder } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [type, setType] = useState<Reminder['type']>('medicine');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00 AM');
  const [repeat, setRepeat] = useState<Reminder['repeat']>('daily');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please specify a reminder title', 'error');
      return;
    }

    const newReminder: Reminder = {
      reminderId: 'rem_' + Date.now(),
      patientId: currentUser?.uid || 'patient',
      type,
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      repeat,
      completed: false,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    await addReminder(newReminder);
    showToast('Reminder added successfully!', 'success');
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);

    // Request browser notification permission if available
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const handleToggle = async (id: string) => {
    await toggleReminder(id);
    showToast('Reminder status toggled', 'info');
  };

  const handleDelete = async (id: string) => {
    await deleteReminder(id);
    showToast('Reminder deleted', 'info');
  };

  const typeIcons: Record<string, any> = {
    medicine: Pill,
    appointment: Calendar,
    checkup: Activity,
    lab_test: FileText,
    custom: BellRing,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.reminders.title}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.reminders.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.reminders.addNew}</span>
        </button>
      </div>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <BellRing className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">{t.reminders.noReminders}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((rem) => {
            const Icon = typeIcons[rem.type] || BellRing;
            return (
              <div
                key={rem.reminderId}
                className={`p-5 rounded-2xl border transition-all ${
                  rem.completed
                    ? 'bg-slate-50/80 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-teal-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        rem.completed
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-teal-50 text-teal-700 border border-teal-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {rem.type.replace('_', ' ')}
                      </span>
                      <h4
                        className={`text-sm font-bold ${
                          rem.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {rem.title}
                      </h4>
                      {rem.description && (
                        <p className="text-xs text-slate-500">{rem.description}</p>
                      )}
                      <p className="text-xs font-semibold text-teal-800 flex items-center gap-1.5 pt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{rem.time} • Repeat: {rem.repeat}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggle(rem.reminderId)}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                        rem.completed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {rem.completed ? t.reminders.completed : t.reminders.markDone}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(rem.reminderId)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-base font-bold text-slate-900">{t.reminders.addNew}</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reminder Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option value="medicine">{t.reminders.typeMedicine}</option>
                  <option value="appointment">{t.reminders.typeAppointment}</option>
                  <option value="checkup">{t.reminders.typeCheckup}</option>
                  <option value="lab_test">{t.reminders.typeLabTest}</option>
                  <option value="custom">{t.reminders.typeCustom}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title / Action
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Blood Pressure Pill (Telmisartan 40mg)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions / Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Take with breakfast"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Repeat Frequency
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                >
                  <option value="daily">{t.reminders.frequencyDaily}</option>
                  <option value="once">{t.reminders.frequencyOnce}</option>
                  <option value="weekly">{t.reminders.frequencyWeekly}</option>
                  <option value="monthly">{t.reminders.frequencyMonthly}</option>
                </select>
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
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
