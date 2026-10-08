import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  QrCode,
  Save,
  LogOut,
  Download,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { QRCodeCard } from '../components/patient/QRCodeCard';

export const PatientProfilePage: React.FC = () => {
  const { currentUser, patientProfile, updatePatientProfile, logout } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [name, setName] = useState(patientProfile?.name || currentUser?.name || '');
  const [dob, setDob] = useState(patientProfile?.dob || '1963-04-14');
  const [gender, setGender] = useState(patientProfile?.gender || 'male');
  const [bloodGroup, setBloodGroup] = useState(patientProfile?.bloodGroup || 'B+');
  const [address, setAddress] = useState(patientProfile?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(patientProfile?.emergencyContact || '');
  const [medicalConditions, setMedicalConditions] = useState(patientProfile?.medicalConditions || '');
  const [allergies, setAllergies] = useState(patientProfile?.allergies || '');
  const [currentMedications, setCurrentMedications] = useState(patientProfile?.currentMedications || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePatientProfile({
        name,
        dob,
        gender,
        bloodGroup,
        address,
        emergencyContact,
        medicalConditions,
        allergies,
        currentMedications,
      });
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t.profile.title}</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your personal demographics, health registry ID, and emergency contact details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </div>

      {/* Prominent QR Code and 14-digit Health ID card */}
      {patientProfile && (
        <QRCodeCard
          healthId={patientProfile.healthId}
          patientName={patientProfile.name}
          dob={patientProfile.dob}
          bloodGroup={patientProfile.bloodGroup}
        />
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 pb-2 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          <span>{t.profile.personalInfo}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.fullName}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.email}</label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ''}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.dob}</label>
            <input
              type="date"
              disabled={!isEditing}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 disabled:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.gender}</label>
            <select
              disabled={!isEditing}
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 bg-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.bloodGroup}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 font-bold text-teal-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.phone}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={currentUser?.phone || '+91 94432 10891'}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.address}</label>
          <input
            type="text"
            disabled={!isEditing}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.emergencyContact}</label>
          <input
            type="text"
            disabled={!isEditing}
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50 font-medium text-rose-900"
          />
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 pt-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" />
          <span>{t.profile.clinicalBackground}</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.medicalConditions}</label>
            <textarea
              rows={2}
              disabled={!isEditing}
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.allergies}</label>
            <textarea
              rows={2}
              disabled={!isEditing}
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t.profile.currentMedications}</label>
            <textarea
              rows={2}
              disabled={!isEditing}
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm disabled:bg-slate-50"
            />
          </div>
        </div>

        {isEditing && (
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? t.common.loading : t.profile.saveProfile}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
