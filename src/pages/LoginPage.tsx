import React, { useState } from 'react';
import {
  HeartPulse,
  UserCheck,
  Stethoscope,
  Store,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onNavigateToRegister: (role?: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToRegister }) => {
  const { login, loginDemo, seedRealisticDemoData } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      await login(email, role);
      showToast('Welcome back to Thulir!', 'success');
    } catch {
      showToast('Sign in failed. Try demo login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (demoRole: UserRole) => {
    loginDemo(demoRole);
    showToast(`Logged in as Demo ${demoRole.toUpperCase()}`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-500 items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.auth.loginTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.auth.loginSubtitle}</p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-5 rounded-2xl border border-teal-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Instant Hackathon Access</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('patient')}
              className="p-2.5 rounded-xl bg-white hover:bg-teal-100/50 border border-teal-200 text-teal-950 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-2xs"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('doctor')}
              className="p-2.5 rounded-xl bg-white hover:bg-sky-100/50 border border-sky-200 text-sky-950 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-2xs"
            >
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('pharmacy')}
              className="p-2.5 rounded-xl bg-white hover:bg-teal-100/50 border border-teal-200 text-teal-950 text-xs font-bold flex flex-col items-center gap-1 transition-all shadow-2xs"
            >
              <Store className="w-4 h-4 text-teal-600" />
              <span>Pharmacy</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['patient', 'doctor', 'pharmacy'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                    role === r
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.auth.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="selvaraj.patient@thulir.health"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.auth.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? t.common.loading : t.auth.loginButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Register navigation */}
        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => onNavigateToRegister(role)}
            className="text-xs font-bold text-teal-700 hover:underline"
          >
            {t.auth.dontHaveAccount}
          </button>
        </div>
      </div>
    </div>
  );
};
