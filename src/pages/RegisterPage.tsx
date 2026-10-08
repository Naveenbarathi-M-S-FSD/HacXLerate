import React, { useState } from 'react';
import {
  HeartPulse,
  UserCheck,
  Stethoscope,
  Store,
  ShieldCheck,
  ArrowRight,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole } from '../types';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  initialRole?: UserRole;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigateToLogin,
  initialRole = 'patient',
}) => {
  const { registerPatient, registerDoctor, registerPharmacy } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [loading, setLoading] = useState(false);

  // Common credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Patient specific
  const [dob, setDob] = useState('1980-05-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [address, setAddress] = useState('Chennai, Tamil Nadu');
  const [emergencyContact, setEmergencyContact] = useState('K. Meenakshi (Spouse) - +91 94441 23456');
  const [medicalConditions, setMedicalConditions] = useState('Type 2 Diabetes');
  const [allergies, setAllergies] = useState('None');
  const [currentMedications, setCurrentMedications] = useState('Metformin 500mg');

  // Doctor specific
  const [specialization, setSpecialization] = useState('General Physician');
  const [registrationNumber, setRegistrationNumber] = useState('TN-MC-84920');
  const [experience, setExperience] = useState('10 Years');
  const [hospitalName, setHospitalName] = useState('City Health Hospital');
  const [hospitalType, setHospitalType] = useState('Clinic');

  // Pharmacy specific
  const [pharmacyName, setPharmacyName] = useState('Thulir Meds & Diagnostics');
  const [ownerName, setOwnerName] = useState('K. Ramesh');
  const [licenseNumber, setLicenseNumber] = useState('TN-DRG-2024-9182');
  const [pharmacyType, setPharmacyType] = useState('Retail Pharmacy');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (selectedRole === 'patient') {
        await registerPatient({
          email,
          password,
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
        showToast('Patient account created! Generated 14-digit Health ID.', 'success');
      } else if (selectedRole === 'doctor') {
        await registerDoctor({
          email,
          password,
          name,
          phone,
          specialization,
          registrationNumber,
          experience,
          hospitalName,
          hospitalType,
          address,
        });
        showToast('Doctor account created with Demo Verification status!', 'success');
      } else if (selectedRole === 'pharmacy') {
        await registerPharmacy({
          email,
          password,
          pharmacyName,
          ownerName,
          phone,
          address,
          licenseNumber,
          pharmacyType,
        });
        showToast('Pharmacy account registered with Demo Verification!', 'success');
      }
    } catch {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-500 items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.auth.registerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">{t.auth.registerSubtitle}</p>
        </div>

        {/* Role Selection Question */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            {t.auth.selectRoleQuestion}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'patient' as UserRole, label: t.roles.patient, icon: UserCheck, desc: 'Health ID & Records' },
              { id: 'doctor' as UserRole, label: t.roles.doctor, icon: Stethoscope, desc: 'Clinical Reviews' },
              { id: 'pharmacy' as UserRole, label: t.roles.pharmacy, icon: Store, desc: 'Stock & Network' },
            ].map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 text-teal-950 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                  <p className="font-bold text-sm mt-2">{r.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-teal-800 pb-2 border-b">
            {selectedRole === 'patient' && 'Patient Registration Details'}
            {selectedRole === 'doctor' && 'Doctor Clinical Registration Details'}
            {selectedRole === 'pharmacy' && 'Pharmacy Enterprise Details'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'pharmacy' ? 'Owner / Representative Name' : 'Full Name'} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. K. Selvaraj"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.auth.email} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@thulir.health"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.auth.password} *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94432 10891"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Patient Extra Fields */}
          {selectedRole === 'patient' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Person & Phone</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. M. Selvaraj (Son) - +91 98401 23456"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Existing Conditions</label>
                  <input
                    type="text"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Type 2 Diabetes, Hypertension"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Known Allergies</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  A unique 14-digit THULIR Health ID & QR code pass will be automatically generated upon registration.
                </span>
              </div>
            </div>
          )}

          {/* Doctor Extra Fields */}
          {selectedRole === 'doctor' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Internal Medicine, Diabetology"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medical Council Reg. Number</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. TMC-67291"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Apollo City Clinic"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 15 Years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 flex items-center justify-between">
                <span>Certificate Verification: Prototype Demo Verified</span>
                <span className="px-2 py-0.5 rounded font-bold bg-sky-100 text-sky-800">
                  Demo Verified
                </span>
              </div>
            </div>
          )}

          {/* Pharmacy Extra Fields */}
          {selectedRole === 'pharmacy' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacy Enterprise Name</label>
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="e.g. Thulir Meds & Diagnostics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Drug License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. TN-CH-2024-DRG-8821"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pharmacy Type</label>
                  <input
                    type="text"
                    value={pharmacyType}
                    onChange={(e) => setPharmacyType(e.target.value)}
                    placeholder="Retail / Wholesale Pharmacy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Address / Location</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span>License Verification: Prototype Demo Verified</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                  Demo Verified
                </span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? t.common.loading : t.auth.registerButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-xs font-bold text-teal-700 hover:underline"
          >
            {t.auth.alreadyHaveAccount}
          </button>
        </div>
      </div>
    </div>
  );
};
