/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar, ActiveTab } from './components/common/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { HealthRecordsPage } from './pages/HealthRecordsPage';
import { AICopilotPage } from './pages/AICopilotPage';
import { PatientRemindersPage } from './pages/PatientRemindersPage';
import { PatientAppointmentsPage } from './pages/PatientAppointmentsPage';
import { PatientMedicinesPage } from './pages/PatientMedicinesPage';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { DoctorPharmacyNetworkPage } from './pages/DoctorPharmacyNetworkPage';
import { PharmacyDashboard } from './pages/PharmacyDashboard';
import { UploadDocumentModal } from './components/patient/UploadDocumentModal';
import { DoctorMessagesModal } from './components/patient/DoctorMessagesModal';
import { AIInsightCard } from './components/patient/AIInsightCard';
import { UserRole } from './types';

function MainApp() {
  const { currentUser, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadDefaultType, setUploadDefaultType] = useState<any>('prescription');
  const [doctorMessagesOpen, setDoctorMessagesOpen] = useState(false);

  // Auth routing state when not logged in
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const [registerInitialRole, setRegisterInitialRole] = useState<UserRole>('patient');

  const handleOpenUpload = (type: any = 'prescription') => {
    setUploadDefaultType(type);
    setUploadModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Initializing THULIR Health Copilot...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Landing, Login, or Register
  if (!currentUser) {
    if (authView === 'login') {
      return (
        <LoginPage
          onNavigateToRegister={(role) => {
            if (role) setRegisterInitialRole(role);
            setAuthView('register');
          }}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterPage
          initialRole={registerInitialRole}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LandingPage
        onNavigateToAuth={(mode, role) => {
          if (role) setRegisterInitialRole(role);
          setAuthView(mode);
        }}
      />
    );
  }

  // Logged In -> Show Role-Based App View
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenDoctorMessages={() => setDoctorMessagesOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {/* Patient Views */}
          {currentUser.role === 'patient' && (
            <>
              {activeTab === 'dashboard' && (
                <PatientDashboard
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenUpload={handleOpenUpload}
                />
              )}
              {activeTab === 'records' && (
                <HealthRecordsPage onOpenUpload={handleOpenUpload} />
              )}
              {activeTab === 'insights' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <AIInsightCard />
                </div>
              )}
              {activeTab === 'copilot' && <AICopilotPage />}
              {activeTab === 'appointments' && <PatientAppointmentsPage />}
              {activeTab === 'medicines' && <PatientMedicinesPage />}
              {activeTab === 'reminders' && <PatientRemindersPage />}
              {activeTab === 'profile' && <PatientProfilePage />}
            </>
          )}

          {/* Doctor Views */}
          {currentUser.role === 'doctor' && (
            <>
              {(activeTab === 'dashboard' || activeTab === 'doctor_search' || activeTab === 'doctor_patients') && (
                <DoctorDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
              )}
              {activeTab === 'appointments' && <PatientAppointmentsPage />}
              {activeTab === 'doctor_pharmacy_network' && <DoctorPharmacyNetworkPage />}
              {activeTab === 'profile' && <PatientProfilePage />}
            </>
          )}

          {/* Pharmacy Views */}
          {currentUser.role === 'pharmacy' && (
            <>
              {(activeTab === 'dashboard' || activeTab === 'pharmacy_dashboard' || activeTab === 'pharmacy_create_post' || activeTab === 'pharmacy_my_posts') && (
                <PharmacyDashboard />
              )}
              {activeTab === 'doctor_pharmacy_network' && <DoctorPharmacyNetworkPage />}
              {activeTab === 'profile' && <PatientProfilePage />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultType={uploadDefaultType}
      />

      <DoctorMessagesModal
        isOpen={doctorMessagesOpen}
        onClose={() => setDoctorMessagesOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
