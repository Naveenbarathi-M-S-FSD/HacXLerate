export type UserRole = 'patient' | 'doctor' | 'pharmacy';

export type Language = 'en' | 'ta';

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
  profilePhoto?: string;
  language?: Language;
}

export interface PatientProfile {
  uid: string;
  healthId: string; // 14-digit unique ID e.g. "9823-4412-8819-03"
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  medicalConditions: string;
  allergies: string;
  currentMedications: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DoctorProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  registrationNumber: string;
  experience: string;
  hospitalName: string;
  hospitalType: string;
  address: string;
  verificationStatus: 'pending' | 'verified' | 'demo_verified';
  createdAt: string;
}

export interface PharmacyProfile {
  uid: string;
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  pharmacyType: string;
  address: string;
  verificationStatus: 'pending' | 'verified' | 'demo_verified';
  createdAt: string;
}

export interface ExtractedMedication {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ExtractedLabTest {
  testName: string;
  testDate?: string;
  testResult: string;
  unit: string;
  referenceRange: string;
  abnormalIndicator?: 'normal' | 'high' | 'low' | 'critical';
}

export interface ExtractedMedicalData {
  doctorName?: string;
  hospitalName?: string;
  recordDate?: string;
  patientName?: string;
  diagnosis?: string;
  medications?: ExtractedMedication[];
  labTests?: ExtractedLabTest[];
  importantObservations?: string[];
  followUpDate?: string;
  clinicalAdvice?: string;
}

export interface MedicalRecord {
  recordId: string;
  patientId: string;
  recordType: 'prescription' | 'lab_report' | 'doctor_visit' | 'discharge_summary' | 'other';
  title: string;
  uploadedFileUrl?: string;
  storagePath?: string;
  recordDate: string;
  doctorName?: string;
  hospitalName?: string;
  extractedData?: ExtractedMedicalData;
  aiSummary?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Medication {
  medicationId: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sourceRecordId?: string;
  active: boolean;
  createdAt: string;
}

export interface Appointment {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName?: string;
  doctorName?: string;
  patientHealthId?: string;
  hospitalName?: string;
  date: string;
  time: string;
  purpose: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Reminder {
  reminderId: string;
  patientId: string;
  type: 'medicine' | 'appointment' | 'checkup' | 'lab_test' | 'custom';
  title: string;
  description: string;
  date: string;
  time: string;
  repeat: 'once' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  enabled: boolean;
  createdAt: string;
}

export interface DoctorPatientAccess {
  accessId: string; // doctorId + '_' + patientId
  doctorId: string;
  patientId: string;
  doctorName?: string;
  patientName?: string;
  patientHealthId?: string;
  status: 'granted' | 'requested' | 'revoked';
  grantedAt: string;
  revokedAt?: string;
}

export interface DoctorMessage {
  messageId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PharmacyPost {
  postId: string;
  pharmacyId: string;
  pharmacyName: string;
  postType: 'stock_available' | 'stock_required' | 'job_vacancy' | 'announcement';
  title: string;
  description: string;
  medicineName?: string;
  quantity?: string;
  quality?: string;
  manufactureDate?: string;
  expiryDate?: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  createdAt: string;
}
