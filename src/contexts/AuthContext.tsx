import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  PatientProfile,
  DoctorProfile,
  PharmacyProfile,
  MedicalRecord,
  Medication,
  Appointment,
  Reminder,
  DoctorPatientAccess,
  DoctorMessage,
  PharmacyPost,
  UserRole,
} from '../types';
import {
  DEMO_PATIENT_USER,
  DEMO_PATIENT_PROFILE,
  DEMO_DOCTOR_USER,
  DEMO_DOCTOR_PROFILE,
  DEMO_PHARMACY_USER,
  DEMO_PHARMACY_PROFILE,
  DEMO_MEDICAL_RECORDS,
  DEMO_MEDICATIONS,
  DEMO_APPOINTMENTS,
  DEMO_REMINDERS,
  DEMO_ACCESS_GRANTS,
  DEMO_MESSAGES,
  DEMO_PHARMACY_POSTS,
} from '../data/demoData';
import { generateHealthId } from '../services/qr';

interface AuthContextType {
  currentUser: UserProfile | null;
  patientProfile: PatientProfile | null;
  doctorProfile: DoctorProfile | null;
  pharmacyProfile: PharmacyProfile | null;
  medicalRecords: MedicalRecord[];
  medications: Medication[];
  appointments: Appointment[];
  reminders: Reminder[];
  messages: DoctorMessage[];
  pharmacyPosts: PharmacyPost[];
  accessGrants: DoctorPatientAccess[];
  loading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  loginDemo: (role: UserRole) => void;
  registerPatient: (data: Partial<PatientProfile> & { email: string; password?: string }) => Promise<void>;
  registerDoctor: (data: Partial<DoctorProfile> & { email: string; password?: string }) => Promise<void>;
  registerPharmacy: (data: Partial<PharmacyProfile> & { email: string; password?: string }) => Promise<void>;
  logout: () => void;
  seedRealisticDemoData: () => void;
  addMedicalRecord: (record: MedicalRecord, newMedications?: Medication[]) => Promise<void>;
  updateMedicalRecord: (record: MedicalRecord) => Promise<void>;
  deleteMedicalRecord: (recordId: string) => Promise<void>;
  addMedication: (med: Medication) => Promise<void>;
  toggleMedication: (medicationId: string) => Promise<void>;
  deleteMedication: (medicationId: string) => Promise<void>;
  addReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (reminder: Reminder) => Promise<void>;
  toggleReminder: (reminderId: string) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  getDoctorAccessStatus: (doctorId: string, patientId: string) => 'granted' | 'requested' | 'revoked' | 'none';
  grantDoctorAccess: (doctorId: string, patientId: string) => Promise<void>;
  revokeDoctorAccess: (doctorId: string, patientId: string) => Promise<void>;
  requestDoctorAccess: (doctorId: string, patientId: string) => Promise<void>;
  findPatientByHealthId: (healthId: string) => PatientProfile | null;
  sendMessage: (doctorId: string, doctorName: string, patientId: string, message: string) => Promise<void>;
  createPharmacyPost: (post: PharmacyPost) => Promise<void>;
  deletePharmacyPost: (postId: string) => Promise<void>;
  updatePatientProfile: (updated: Partial<PatientProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [pharmacyProfile, setPharmacyProfile] = useState<PharmacyProfile | null>(null);

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [messages, setMessages] = useState<DoctorMessage[]>([]);
  const [pharmacyPosts, setPharmacyPosts] = useState<PharmacyPost[]>([]);
  const [accessGrants, setAccessGrants] = useState<DoctorPatientAccess[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize state from localStorage or load realistic demo baseline
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('thulir_current_user');
      const savedPatient = localStorage.getItem('thulir_patient_profile');
      const savedDoctor = localStorage.getItem('thulir_doctor_profile');
      const savedPharmacy = localStorage.getItem('thulir_pharmacy_profile');

      const savedRecords = localStorage.getItem('thulir_medical_records');
      const savedMeds = localStorage.getItem('thulir_medications');
      const savedApts = localStorage.getItem('thulir_appointments');
      const savedReminders = localStorage.getItem('thulir_reminders');
      const savedMessages = localStorage.getItem('thulir_messages');
      const savedPosts = localStorage.getItem('thulir_pharmacy_posts');
      const savedGrants = localStorage.getItem('thulir_access_grants');

      if (savedRecords) setMedicalRecords(JSON.parse(savedRecords));
      else setMedicalRecords(DEMO_MEDICAL_RECORDS);

      if (savedMeds) setMedications(JSON.parse(savedMeds));
      else setMedications(DEMO_MEDICATIONS);

      if (savedApts) setAppointments(JSON.parse(savedApts));
      else setAppointments(DEMO_APPOINTMENTS);

      if (savedReminders) setReminders(JSON.parse(savedReminders));
      else setReminders(DEMO_REMINDERS);

      if (savedMessages) setMessages(JSON.parse(savedMessages));
      else setMessages(DEMO_MESSAGES);

      if (savedPosts) setPharmacyPosts(JSON.parse(savedPosts));
      else setPharmacyPosts(DEMO_PHARMACY_POSTS);

      if (savedGrants) setAccessGrants(JSON.parse(savedGrants));
      else setAccessGrants(DEMO_ACCESS_GRANTS);

      if (savedUser) {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        if (savedPatient) setPatientProfile(JSON.parse(savedPatient));
        if (savedDoctor) setDoctorProfile(JSON.parse(savedDoctor));
        if (savedPharmacy) setPharmacyProfile(JSON.parse(savedPharmacy));
      } else {
        // Default to Demo Patient for instant rich preview
        setCurrentUser(DEMO_PATIENT_USER);
        setPatientProfile(DEMO_PATIENT_PROFILE);
      }
    } catch (e) {
      console.error('Error loading initial data:', e);
      setCurrentUser(DEMO_PATIENT_USER);
      setPatientProfile(DEMO_PATIENT_PROFILE);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync state helpers to localStorage
  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
  };

  const seedRealisticDemoData = () => {
    setMedicalRecords(DEMO_MEDICAL_RECORDS);
    setMedications(DEMO_MEDICATIONS);
    setAppointments(DEMO_APPOINTMENTS);
    setReminders(DEMO_REMINDERS);
    setMessages(DEMO_MESSAGES);
    setPharmacyPosts(DEMO_PHARMACY_POSTS);
    setAccessGrants(DEMO_ACCESS_GRANTS);

    saveState('thulir_medical_records', DEMO_MEDICAL_RECORDS);
    saveState('thulir_medications', DEMO_MEDICATIONS);
    saveState('thulir_appointments', DEMO_APPOINTMENTS);
    saveState('thulir_reminders', DEMO_REMINDERS);
    saveState('thulir_messages', DEMO_MESSAGES);
    saveState('thulir_pharmacy_posts', DEMO_PHARMACY_POSTS);
    saveState('thulir_access_grants', DEMO_ACCESS_GRANTS);
  };

  const loginDemo = (role: UserRole) => {
    if (role === 'patient') {
      setCurrentUser(DEMO_PATIENT_USER);
      setPatientProfile(DEMO_PATIENT_PROFILE);
      setDoctorProfile(null);
      setPharmacyProfile(null);
      saveState('thulir_current_user', DEMO_PATIENT_USER);
      saveState('thulir_patient_profile', DEMO_PATIENT_PROFILE);
    } else if (role === 'doctor') {
      setCurrentUser(DEMO_DOCTOR_USER);
      setDoctorProfile(DEMO_DOCTOR_PROFILE);
      setPatientProfile(null);
      setPharmacyProfile(null);
      saveState('thulir_current_user', DEMO_DOCTOR_USER);
      saveState('thulir_doctor_profile', DEMO_DOCTOR_PROFILE);
    } else if (role === 'pharmacy') {
      setCurrentUser(DEMO_PHARMACY_USER);
      setPharmacyProfile(DEMO_PHARMACY_PROFILE);
      setPatientProfile(null);
      setDoctorProfile(null);
      saveState('thulir_current_user', DEMO_PHARMACY_USER);
      saveState('thulir_pharmacy_profile', DEMO_PHARMACY_PROFILE);
    }
  };

  const login = async (email: string, role: UserRole = 'patient'): Promise<boolean> => {
    // If matching demo credentials or standard sign in
    if (email.includes('doctor') || role === 'doctor') {
      loginDemo('doctor');
      return true;
    } else if (email.includes('pharmacy') || role === 'pharmacy') {
      loginDemo('pharmacy');
      return true;
    } else {
      loginDemo('patient');
      return true;
    }
  };

  const registerPatient = async (data: Partial<PatientProfile> & { email: string; password?: string }) => {
    const uid = 'patient_' + Date.now();
    const healthId = generateHealthId();

    const user: UserProfile = {
      uid,
      role: 'patient',
      name: data.name || 'New Patient',
      email: data.email,
      phone: data.emergencyContact?.split('-')?.[1]?.trim() || '',
      createdAt: new Date().toISOString(),
      language: 'en',
    };

    const profile: PatientProfile = {
      uid,
      healthId,
      name: data.name || 'New Patient',
      dob: data.dob || '1970-01-01',
      gender: data.gender || 'male',
      bloodGroup: data.bloodGroup || 'O+',
      address: data.address || '',
      emergencyContact: data.emergencyContact || '',
      medicalConditions: data.medicalConditions || 'None reported',
      allergies: data.allergies || 'None',
      currentMedications: data.currentMedications || 'None',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setPatientProfile(profile);
    setDoctorProfile(null);
    setPharmacyProfile(null);

    saveState('thulir_current_user', user);
    saveState('thulir_patient_profile', profile);
  };

  const registerDoctor = async (data: Partial<DoctorProfile> & { email: string; password?: string }) => {
    const uid = 'doctor_' + Date.now();
    const user: UserProfile = {
      uid,
      role: 'doctor',
      name: data.name || 'Dr. Medical Officer',
      email: data.email,
      phone: data.phone || '',
      createdAt: new Date().toISOString(),
    };

    const profile: DoctorProfile = {
      uid,
      name: data.name || 'Dr. Medical Officer',
      email: data.email,
      phone: data.phone || '',
      specialization: data.specialization || 'General Medicine',
      registrationNumber: data.registrationNumber || 'MED-' + Math.floor(10000 + Math.random() * 90000),
      experience: data.experience || '5 Years',
      hospitalName: data.hospitalName || 'City Health Clinic',
      hospitalType: data.hospitalType || 'Clinic',
      address: data.address || '',
      verificationStatus: 'demo_verified',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setDoctorProfile(profile);
    setPatientProfile(null);
    setPharmacyProfile(null);

    saveState('thulir_current_user', user);
    saveState('thulir_doctor_profile', profile);
  };

  const registerPharmacy = async (data: Partial<PharmacyProfile> & { email: string; password?: string }) => {
    const uid = 'pharmacy_' + Date.now();
    const user: UserProfile = {
      uid,
      role: 'pharmacy',
      name: data.pharmacyName || 'Health Chemist',
      email: data.email,
      phone: data.phone || '',
      createdAt: new Date().toISOString(),
    };

    const profile: PharmacyProfile = {
      uid,
      pharmacyName: data.pharmacyName || 'Health Chemist',
      ownerName: data.ownerName || 'Licensed Pharmacist',
      email: data.email,
      phone: data.phone || '',
      licenseNumber: data.licenseNumber || 'DRG-' + Math.floor(10000 + Math.random() * 90000),
      pharmacyType: data.pharmacyType || 'Retail Pharmacy',
      address: data.address || '',
      verificationStatus: 'demo_verified',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setPharmacyProfile(profile);
    setPatientProfile(null);
    setDoctorProfile(null);

    saveState('thulir_current_user', user);
    saveState('thulir_pharmacy_profile', profile);
  };

  const logout = () => {
    setCurrentUser(null);
    setPatientProfile(null);
    setDoctorProfile(null);
    setPharmacyProfile(null);
    localStorage.removeItem('thulir_current_user');
  };

  const addMedicalRecord = async (record: MedicalRecord, newMedications?: Medication[]) => {
    const updatedRecords = [record, ...medicalRecords];
    setMedicalRecords(updatedRecords);
    saveState('thulir_medical_records', updatedRecords);

    if (newMedications && newMedications.length > 0) {
      const updatedMeds = [...newMedications, ...medications];
      setMedications(updatedMeds);
      saveState('thulir_medications', updatedMeds);
    }
  };

  const updateMedicalRecord = async (record: MedicalRecord) => {
    const updated = medicalRecords.map((r) => (r.recordId === record.recordId ? record : r));
    setMedicalRecords(updated);
    saveState('thulir_medical_records', updated);
  };

  const deleteMedicalRecord = async (recordId: string) => {
    const updated = medicalRecords.filter((r) => r.recordId !== recordId);
    setMedicalRecords(updated);
    saveState('thulir_medical_records', updated);
  };

  const addMedication = async (med: Medication) => {
    const updated = [med, ...medications];
    setMedications(updated);
    saveState('thulir_medications', updated);
  };

  const toggleMedication = async (medicationId: string) => {
    const updated = medications.map((m) =>
      m.medicationId === medicationId ? { ...m, active: !m.active } : m
    );
    setMedications(updated);
    saveState('thulir_medications', updated);
  };

  const deleteMedication = async (medicationId: string) => {
    const updated = medications.filter((m) => m.medicationId !== medicationId);
    setMedications(updated);
    saveState('thulir_medications', updated);
  };

  const addReminder = async (reminder: Reminder) => {
    const updated = [reminder, ...reminders];
    setReminders(updated);
    saveState('thulir_reminders', updated);
  };

  const updateReminder = async (reminder: Reminder) => {
    const updated = reminders.map((r) => (r.reminderId === reminder.reminderId ? reminder : r));
    setReminders(updated);
    saveState('thulir_reminders', updated);
  };

  const toggleReminder = async (reminderId: string) => {
    const updated = reminders.map((r) =>
      r.reminderId === reminderId ? { ...r, completed: !r.completed } : r
    );
    setReminders(updated);
    saveState('thulir_reminders', updated);
  };

  const deleteReminder = async (reminderId: string) => {
    const updated = reminders.filter((r) => r.reminderId !== reminderId);
    setReminders(updated);
    saveState('thulir_reminders', updated);
  };

  const addAppointment = async (appointment: Appointment) => {
    const updated = [appointment, ...appointments];
    setAppointments(updated);
    saveState('thulir_appointments', updated);
  };

  const cancelAppointment = async (appointmentId: string) => {
    const updated = appointments.map((a) =>
      a.appointmentId === appointmentId ? { ...a, status: 'cancelled' as const } : a
    );
    setAppointments(updated);
    saveState('thulir_appointments', updated);
  };

  const getDoctorAccessStatus = (doctorId: string, patientId: string): 'granted' | 'requested' | 'revoked' | 'none' => {
    const grant = accessGrants.find((g) => g.doctorId === doctorId && g.patientId === patientId);
    return grant ? grant.status : 'none';
  };

  const grantDoctorAccess = async (doctorId: string, patientId: string) => {
    const grantId = `${doctorId}_${patientId}`;
    const newGrant: DoctorPatientAccess = {
      accessId: grantId,
      doctorId,
      patientId,
      status: 'granted',
      grantedAt: new Date().toISOString(),
    };
    const updated = [...accessGrants.filter((g) => g.accessId !== grantId), newGrant];
    setAccessGrants(updated);
    saveState('thulir_access_grants', updated);
  };

  const revokeDoctorAccess = async (doctorId: string, patientId: string) => {
    const grantId = `${doctorId}_${patientId}`;
    const updated = accessGrants.map((g) =>
      g.accessId === grantId ? { ...g, status: 'revoked' as const, revokedAt: new Date().toISOString() } : g
    );
    setAccessGrants(updated);
    saveState('thulir_access_grants', updated);
  };

  const requestDoctorAccess = async (doctorId: string, patientId: string) => {
    const grantId = `${doctorId}_${patientId}`;
    const newGrant: DoctorPatientAccess = {
      accessId: grantId,
      doctorId,
      patientId,
      status: 'requested',
      grantedAt: new Date().toISOString(),
    };
    const updated = [...accessGrants.filter((g) => g.accessId !== grantId), newGrant];
    setAccessGrants(updated);
    saveState('thulir_access_grants', updated);
  };

  const findPatientByHealthId = (healthId: string): PatientProfile | null => {
    const cleanSearch = healthId.replace(/[^0-9]/g, '');
    if (patientProfile && patientProfile.healthId.replace(/[^0-9]/g, '') === cleanSearch) {
      return patientProfile;
    }
    if (DEMO_PATIENT_PROFILE.healthId.replace(/[^0-9]/g, '') === cleanSearch) {
      return DEMO_PATIENT_PROFILE;
    }
    return null;
  };

  const sendMessage = async (
    doctorId: string,
    doctorName: string,
    patientId: string,
    messageText: string
  ) => {
    const newMsg: DoctorMessage = {
      messageId: 'msg_' + Date.now(),
      doctorId,
      doctorName,
      patientId,
      message: messageText,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    saveState('thulir_messages', updated);
  };

  const createPharmacyPost = async (post: PharmacyPost) => {
    const updated = [post, ...pharmacyPosts];
    setPharmacyPosts(updated);
    saveState('thulir_pharmacy_posts', updated);
  };

  const deletePharmacyPost = async (postId: string) => {
    const updated = pharmacyPosts.filter((p) => p.postId !== postId);
    setPharmacyPosts(updated);
    saveState('thulir_pharmacy_posts', updated);
  };

  const updatePatientProfile = async (updated: Partial<PatientProfile>) => {
    if (!patientProfile) return;
    const merged = { ...patientProfile, ...updated, updatedAt: new Date().toISOString() };
    setPatientProfile(merged);
    saveState('thulir_patient_profile', merged);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        patientProfile,
        doctorProfile,
        pharmacyProfile,
        medicalRecords,
        medications,
        appointments,
        reminders,
        messages,
        pharmacyPosts,
        accessGrants,
        loading,
        login,
        loginDemo,
        registerPatient,
        registerDoctor,
        registerPharmacy,
        logout,
        seedRealisticDemoData,
        addMedicalRecord,
        updateMedicalRecord,
        deleteMedicalRecord,
        addMedication,
        toggleMedication,
        deleteMedication,
        addReminder,
        updateReminder,
        toggleReminder,
        deleteReminder,
        addAppointment,
        cancelAppointment,
        getDoctorAccessStatus,
        grantDoctorAccess,
        revokeDoctorAccess,
        requestDoctorAccess,
        findPatientByHealthId,
        sendMessage,
        createPharmacyPost,
        deletePharmacyPost,
        updatePatientProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
