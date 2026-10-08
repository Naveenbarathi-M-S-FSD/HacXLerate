import React, { useState } from 'react';
import { X, QrCode, Camera, Check, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DEMO_PATIENT_PROFILE } from '../../data/demoData';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (healthId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(true);

  if (!isOpen) return null;

  const handleSimulateScan = (healthId: string) => {
    setScanning(false);
    setTimeout(() => {
      onScanSuccess(healthId);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Scan Patient QR Code</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative aspect-square max-w-64 mx-auto bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 border-4 border-teal-500 shadow-inner">
          <div className="absolute inset-4 border-2 border-dashed border-teal-300/60 rounded-xl pointer-events-none" />
          <div className="w-full h-0.5 bg-teal-400 absolute animate-bounce" />
          <QrCode className="w-20 h-20 text-white/30" />
          <p className="text-white text-xs mt-4 text-center font-medium">
            Position Patient's 14-digit QR in frame
          </p>
        </div>

        {/* Quick Demo Scan Options for Hackathon */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Demo Instant Scan:
          </p>
          <button
            type="button"
            onClick={() => handleSimulateScan(DEMO_PATIENT_PROFILE.healthId)}
            className="w-full p-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <p className="text-xs font-bold text-teal-950">{DEMO_PATIENT_PROFILE.name}</p>
              <p className="text-[11px] text-teal-700 font-mono">{DEMO_PATIENT_PROFILE.healthId}</p>
            </div>
            <span className="px-2 py-1 rounded-lg bg-teal-600 text-white text-[10px] font-bold">
              Scan This QR
            </span>
          </button>
        </div>

        <div className="pt-2 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
