import React, { useState } from 'react';
import {
  HeartPulse,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  Type,
  UserCheck,
  Stethoscope,
  Store,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenDoctorMessages?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenDoctorMessages }) => {
  const { currentUser, logout, loginDemo, messages, seedRealisticDemoData } = useAuth();
  const { t, isLargeText, toggleLargeText } = useLanguage();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleRoleSwitch = (role: UserRole) => {
    loginDemo(role);
    setDemoMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Brand */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 flex items-center justify-center text-white shadow-xs">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    THULIR
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-teal-100 text-teal-800">
                    Copilot
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 hidden md:block">
                  {t.app.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Controls & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Elderly Friendly Text Size Toggle */}
            <button
              type="button"
              onClick={toggleLargeText}
              title={isLargeText ? 'Standard text size' : 'Enlarge text for readability'}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isLargeText
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">{isLargeText ? 'Text: Large' : 'Text: Normal'}</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Quick Demo Switcher for Hackathon Demo */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden md:inline">Demo Switch</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role (Demo)
                    </p>
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('patient')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Patient</p>
                      <p className="text-[11px] text-slate-500">K. Selvaraj (Health ID)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('doctor')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <div>
                      <p className="font-semibold">Doctor</p>
                      <p className="text-[11px] text-slate-500">Dr. A. Ramanathan (Apollo)</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('pharmacy')}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2"
                  >
                    <Store className="w-4 h-4 text-cyan-600" />
                    <div>
                      <p className="font-semibold">Pharmacy</p>
                      <p className="text-[11px] text-slate-500">Thulir Meds & Diagnostics</p>
                    </div>
                  </button>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        seedRealisticDemoData();
                        setDemoMenuOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-teal-700 font-semibold hover:bg-slate-50"
                    >
                      ↻ Reset & Seed Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Notifications / Messages for Patient */}
            {currentUser && currentUser.role === 'patient' && onOpenDoctorMessages && (
              <button
                type="button"
                onClick={onOpenDoctorMessages}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Doctor messages"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-teal-800 flex items-center justify-center font-bold text-xs border border-teal-200">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-1 rounded">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginDemo('patient')}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-xs"
                >
                  {t.nav.login}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
