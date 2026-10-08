import React from 'react';
import {
  HeartPulse,
  UserCheck,
  Stethoscope,
  Store,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Bot,
  QrCode,
  FileText,
  Clock,
  Languages,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register', defaultRole?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  const { t } = useLanguage();
  const { loginDemo } = useAuth();

  const handleDemoLogin = (role: UserRole) => {
    loginDemo(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                THULIR
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Health Copilot
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => onNavigateToAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {t.nav.login}
            </button>
            <button
              onClick={() => onNavigateToAuth('register')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
            >
              {t.nav.register}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-900 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Multilingual Healthcare Ecosystem • English & தமிழ்</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            {t.app.tagline}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.app.shortDesc}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigateToAuth('register', 'patient')}
              className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>{t.nav.register}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateToAuth('login')}
              className="px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-2xs transition-colors"
            >
              <span>{t.nav.login}</span>
            </button>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1-Click Hackathon Demo Access
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('patient')}
                  className="p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Demo Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('doctor')}
                  className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-sky-700" />
                  <span>Demo Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('pharmacy')}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Demo Pharmacy</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Pillars Role Cards */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Connected Healthcare Network
              </h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Purpose-built workflows for every participant in the care circle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Patient Card */}
              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 hover:border-teal-300 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t.roles.patient}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {t.roles.patientDesc}
                </p>
                <ul className="text-xs text-slate-600 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Unique 14-digit Health ID & QR badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Multimodal Gemini prescription extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-teal-600" />
                    <span>AI Health Copilot with Tamil & English chat</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToAuth('register', 'patient')}
                    className="w-full py-2.5 rounded-xl border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-bold transition-colors"
                  >
                    Join as Patient
                  </button>
                </div>
              </div>

              {/* Doctor Card */}
              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 hover:border-sky-300 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t.roles.doctor}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {t.roles.doctorDesc}
                </p>
                <ul className="text-xs text-slate-600 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5 text-sky-600" />
                    <span>Scan Patient QR or search by 14-digit ID</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Authorized patient records viewing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Clinical messaging & consultation booking</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToAuth('register', 'doctor')}
                    className="w-full py-2.5 rounded-xl border border-sky-600 text-sky-700 hover:bg-sky-50 text-xs font-bold transition-colors"
                  >
                    Join as Doctor
                  </button>
                </div>
              </div>

              {/* Pharmacy Card */}
              <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50 hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{t.roles.pharmacy}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {t.roles.pharmacyDesc}
                </p>
                <ul className="text-xs text-slate-600 space-y-2 pt-2">
                  <li className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Publish medicine stock & shortage alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct connectivity with local physicians</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified pharmacy network credentials</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToAuth('register', 'pharmacy')}
                    className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors"
                  >
                    Join as Pharmacy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-teal-400" />
            <span className="font-bold tracking-tight">THULIR</span>
            <span className="text-xs text-slate-400 ml-2">Personal Health Copilot</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 THULIR. Built with Google Gemini & Firebase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
