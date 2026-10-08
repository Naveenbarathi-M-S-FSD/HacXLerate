import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { extractMedicalDocument } from '../../services/gemini';
import { uploadMedicalDocument } from '../../services/storage';
import {
  ExtractedMedicalData,
  ExtractedMedication,
  ExtractedLabTest,
  MedicalRecord,
  Medication,
} from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { MedicalWarning } from '../common/MedicalWarning';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'prescription' | 'lab_report' | 'doctor_visit' | 'discharge_summary' | 'other';
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'prescription',
}) => {
  const { t, language } = useLanguage();
  const { currentUser, addMedicalRecord } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
  const [recordType, setRecordType] = useState(defaultType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Review & Edit state
  const [title, setTitle] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalAdvice, setClinicalAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medications, setMedications] = useState<ExtractedMedication[]>([]);
  const [labTests, setLabTests] = useState<ExtractedLabTest[]>([]);
  const [aiSummary, setAiSummary] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Default title
      const typeName =
        recordType === 'prescription'
          ? 'Doctor Prescription'
          : recordType === 'lab_report'
          ? 'Lab Test Report'
          : 'Medical Document';
      setTitle(`${typeName} - ${new Date().toLocaleDateString()}`);
    }
  };

  const handleStartExtraction = async () => {
    if (!selectedFile || !filePreview) {
      showToast('Please select a prescription or document file to upload', 'error');
      return;
    }

    setStep('analyzing');

    try {
      const extracted: ExtractedMedicalData = await extractMedicalDocument(
        filePreview,
        selectedFile.type,
        recordType,
        language
      );

      // Populate review form with extracted data
      if (extracted.doctorName) setDoctorName(extracted.doctorName);
      if (extracted.hospitalName) setHospitalName(extracted.hospitalName);
      if (extracted.recordDate) setRecordDate(extracted.recordDate);
      if (extracted.diagnosis) setDiagnosis(extracted.diagnosis);
      if (extracted.clinicalAdvice) setClinicalAdvice(extracted.clinicalAdvice);
      if (extracted.followUpDate) setFollowUpDate(extracted.followUpDate);
      if (extracted.medications && extracted.medications.length > 0) {
        setMedications(extracted.medications);
      }
      if (extracted.labTests && extracted.labTests.length > 0) {
        setLabTests(extracted.labTests);
      }
      if ((extracted as any).aiSummary) {
        setAiSummary((extracted as any).aiSummary);
      } else {
        setAiSummary(`Document processed on ${recordDate}. Identified ${extracted.medications?.length || 0} medications.`);
      }

      setStep('review');
      showToast('Document analyzed by Gemini. Please review the extracted data.', 'success');
    } catch (err) {
      console.error('Extraction error:', err);
      showToast('Extraction failed. You can enter details manually.', 'error');
      setStep('review');
    }
  };

  const handleAddMedicationRow = () => {
    setMedications([
      ...medications,
      {
        medicineName: '',
        dosage: '',
        frequency: 'Once daily',
        duration: '7 days',
        instructions: 'After food',
      },
    ]);
  };

  const handleRemoveMedicationRow = (idx: number) => {
    setMedications(medications.filter((_, i) => i !== idx));
  };

  const handleMedChange = (idx: number, field: keyof ExtractedMedication, value: string) => {
    const updated = [...medications];
    updated[idx] = { ...updated[idx], [field]: value };
    setMedications(updated);
  };

  const handleAddLabRow = () => {
    setLabTests([
      ...labTests,
      {
        testName: '',
        testResult: '',
        unit: 'mg/dL',
        referenceRange: 'Normal',
        abnormalIndicator: 'normal',
      },
    ]);
  };

  const handleRemoveLabRow = (idx: number) => {
    setLabTests(labTests.filter((_, i) => i !== idx));
  };

  const handleLabChange = (idx: number, field: keyof ExtractedLabTest, value: any) => {
    const updated = [...labTests];
    updated[idx] = { ...updated[idx], [field]: value };
    setLabTests(updated);
  };

  const handleConfirmSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);

    try {
      const recordId = 'rec_' + Date.now();

      // Store file
      let storageResult = { downloadUrl: filePreview || '', storagePath: 'uploads/' + recordId };
      if (selectedFile) {
        storageResult = await uploadMedicalDocument(selectedFile, currentUser.uid, 'records');
      }

      // Create new MedicalRecord
      const newRecord: MedicalRecord = {
        recordId,
        patientId: currentUser.uid,
        recordType: recordType as any,
        title: title || `${recordType} (${recordDate})`,
        uploadedFileUrl: storageResult.downloadUrl,
        storagePath: storageResult.storagePath,
        recordDate,
        doctorName: doctorName || undefined,
        hospitalName: hospitalName || undefined,
        aiSummary: aiSummary || undefined,
        extractedData: {
          doctorName,
          hospitalName,
          recordDate,
          diagnosis,
          medications,
          labTests,
          clinicalAdvice,
          followUpDate,
        },
        createdAt: new Date().toISOString(),
      };

      // Create linked Medications
      const newMeds: Medication[] = medications
        .filter((m) => m.medicineName.trim().length > 0)
        .map((m, idx) => ({
          medicationId: `med_${recordId}_${idx}`,
          patientId: currentUser.uid,
          medicineName: m.medicineName,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions,
          sourceRecordId: recordId,
          active: true,
          createdAt: new Date().toISOString(),
        }));

      await addMedicalRecord(newRecord, newMeds);

      showToast(t.upload.saveSuccess, 'success');
      onClose();
    } catch (err) {
      console.error('Error saving record:', err);
      showToast('Failed to save record. Please check details.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {step === 'review' ? t.upload.reviewExtractedTitle : t.upload.modalTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'review' ? t.upload.reviewNote : t.upload.supportedFormats}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'upload' && (
            <div className="space-y-4">
              {/* Record Type selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  {t.upload.selectRecordType}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'prescription', label: t.upload.prescription },
                    { id: 'lab_report', label: t.upload.labReport },
                    { id: 'doctor_visit', label: t.upload.doctorVisit },
                    { id: 'discharge_summary', label: t.upload.dischargeSummary },
                    { id: 'other', label: t.upload.other },
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setRecordType(type.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        recordType === type.id
                          ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-8 text-center bg-teal-50/30 hover:bg-teal-50/60 cursor-pointer transition-all space-y-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {filePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={filePreview}
                      alt="Uploaded preview"
                      className="max-h-48 rounded-xl object-contain border border-slate-200 shadow-xs"
                    />
                    <p className="text-xs font-semibold text-teal-900">
                      {selectedFile?.name} ({(selectedFile?.size! / 1024).toFixed(1)} KB)
                    </p>
                    <span className="text-xs text-teal-700 underline">Click to change file</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="p-3 bg-white rounded-full text-teal-600 shadow-sm border border-teal-100">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {t.upload.dragDropText}
                    </p>
                    <p className="text-xs text-slate-500">{t.upload.supportedFormats}</p>
                  </div>
                )}
              </div>

              {/* Gemini info badge */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Thulir uses Gemini Multimodal AI to read prescriptions, dosages, and lab tests automatically.
                </span>
              </div>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <LoadingSpinner label={t.upload.analyzingDocument} />
              <p className="text-xs text-slate-500 max-w-sm">
                Multimodal OCR is identifying doctor instructions, medication names, dosages, and test indicators...
              </p>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-5">
              <MedicalWarning compact />

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Diabetology Consultation"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.upload.recordDate}
                  </label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.upload.extractedDoctor}
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Dr. A. Ramanathan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.upload.extractedHospital}
                  </label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Apollo City Clinic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.upload.extractedDiagnosis}
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Essential Hypertension, Seasonal Flu"
                />
              </div>

              {/* Extracted Medications */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>{t.upload.extractedMedications} ({medications.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddMedicationRow}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.upload.addMedicationRow}</span>
                  </button>
                </div>

                {medications.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No medications detected. Click above to add manually if needed.</p>
                ) : (
                  <div className="space-y-2">
                    {medications.map((med, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                      >
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            placeholder="Medicine Name (e.g. Metformin)"
                            value={med.medicineName}
                            onChange={(e) => handleMedChange(idx, 'medicineName', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-medium"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Dosage (500mg)"
                            value={med.dosage}
                            onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Freq (Twice daily)"
                            value={med.frequency}
                            onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Instructions"
                            value={med.instructions}
                            onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                        </div>
                        <div className="sm:col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicationRow(idx)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Extracted Lab Tests (if lab report) */}
              {(recordType === 'lab_report' || labTests.length > 0) && (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>{t.upload.extractedLabTests} ({labTests.length})</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddLabRow}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.upload.addLabTestRow}</span>
                    </button>
                  </div>

                  {labTests.map((lab, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          placeholder="Test Name (e.g. HbA1c)"
                          value={lab.testName}
                          onChange={(e) => handleLabChange(idx, 'testName', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 font-medium"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Result (e.g. 7.4)"
                          value={lab.testResult}
                          onChange={(e) => handleLabChange(idx, 'testResult', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Unit (mg/dL)"
                          value={lab.unit}
                          onChange={(e) => handleLabChange(idx, 'unit', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <select
                          value={lab.abnormalIndicator || 'normal'}
                          onChange={(e) => handleLabChange(idx, 'abnormalIndicator', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveLabRow(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up and advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.upload.followUpDate}
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.upload.clinicalAdvice}
                  </label>
                  <input
                    type="text"
                    value={clinicalAdvice}
                    onChange={(e) => setClinicalAdvice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    placeholder="e.g. Low sodium diet, 30 min daily walk"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
          >
            {t.upload.cancel}
          </button>

          {step === 'upload' && (
            <button
              type="button"
              disabled={!selectedFile}
              onClick={handleStartExtraction}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.upload.analyzeWithGemini}</span>
            </button>
          )}

          {step === 'review' && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleConfirmSave}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? t.common.loading : t.upload.confirmAndSave}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
