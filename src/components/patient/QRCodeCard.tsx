import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check, ShieldCheck, Info } from 'lucide-react';
import { generateHealthIdQRCode } from '../../services/qr';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';

interface QRCodeCardProps {
  healthId: string;
  patientName: string;
  dob?: string;
  bloodGroup?: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  healthId,
  patientName,
  dob,
  bloodGroup,
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    generateHealthIdQRCode(healthId).then((url) => {
      if (active) setQrUrl(url);
    });
    return () => {
      active = false;
    };
  }, [healthId]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(healthId);
    setCopied(true);
    showToast('Health ID copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `THULIR_Health_Card_${healthId}.png`;
    link.click();
    showToast('QR Code card downloaded', 'success');
  };

  return (
    <div className="rounded-2xl border border-teal-200 bg-gradient-to-b from-white to-teal-50/40 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* QR Display */}
        <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-teal-100 flex flex-col items-center shrink-0">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="Patient Health ID QR"
              className="w-44 h-44 object-contain rounded-lg"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center bg-slate-50 rounded-lg text-slate-400">
              <QrCode className="w-10 h-10 animate-pulse" />
            </div>
          )}
          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest mt-2">
            THULIR PASS
          </span>
        </div>

        {/* Details & Action */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-100/80 text-teal-900 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>{t.profile.healthIdTitle}</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">{patientName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {dob && `DOB: ${dob} • `} {bloodGroup && `Blood Group: ${bloodGroup}`}
            </p>
          </div>

          {/* Formatted Health ID badge */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="px-4 py-2 rounded-xl bg-slate-900 text-teal-300 font-mono text-base sm:text-lg font-bold tracking-wider shadow-inner">
              {healthId}
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
              title="Copy Health ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Prototype notice */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-100/90 text-slate-600 text-xs">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{t.profile.healthIdNotice}</span>
          </div>

          {/* Download button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t.profile.downloadQR}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
