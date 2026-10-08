import React, { useState } from 'react';
import { X, Send, Stethoscope } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
}) => {
  const { currentUser, sendMessage } = useAuth();
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!text.trim()) {
      showToast('Please enter a clinical message', 'error');
      return;
    }
    setSending(true);
    try {
      await sendMessage(
        currentUser?.uid || 'doctor',
        currentUser?.name || 'Dr. Medical Officer',
        patientId,
        text.trim()
      );
      showToast(`Clinical note sent to ${patientName}`, 'success');
      setText('');
      onClose();
    } catch {
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Send Clinical Note</h3>
              <p className="text-xs text-slate-500">To patient: {patientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Clinical Advice or Follow-up Instructions
          </label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
            placeholder="e.g. Please complete your fasting blood sugar test before our upcoming appointment..."
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={sending || !text.trim()}
            onClick={handleSend}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sending ? 'Sending...' : 'Send Note'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
