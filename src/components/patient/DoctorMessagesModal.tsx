import React from 'react';
import { X, Bell, Stethoscope, Clock, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface DoctorMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorMessagesModal: React.FC<DoctorMessagesModalProps> = ({ isOpen, onClose }) => {
  const { messages } = useAuth();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t.dashboard.doctorMessagesTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Direct clinical notes and instructions from your doctors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No messages from your doctors yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.messageId}
                className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>{msg.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
