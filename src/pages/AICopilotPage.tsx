import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { askHealthCopilot } from '../services/gemini';
import { MedicalWarning } from '../components/common/MedicalWarning';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const AICopilotPage: React.FC = () => {
  const { currentUser, patientProfile, medicalRecords, medications } = useAuth();
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'model',
      text:
        language === 'ta'
          ? `வணக்கம் ${patientProfile?.name || ''}! நான் உங்கள் துளிர் AI நல்வாழ்வு வழிகாட்டி. உங்கள் மருத்துவர் சீட்டுகள், இரத்தப் பரிசோதனை முடிவுகள், மற்றும் உட்கொள்ளும் மருந்துகள் பற்றிய கேள்விகளை நீங்கள் இங்கே கேட்கலாம்.\n\n⚠️ குறிப்பு: நான் ஒரு வழிகாட்டியே, மருத்துவர் அல்ல. முக்கியமான முடிவுகளுக்கு மருத்துவரிடம் ஆலோசிக்கவும்.`
          : `Hello ${patientProfile?.name || ''}! I am THULIR Health Copilot. I can help answer questions grounded in your stored prescriptions, lab reports, and medications.\n\n⚠️ Note: AI-generated information may be inaccurate. Please verify important medical information with a qualified healthcare professional.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const patientContext = {
        name: patientProfile?.name || currentUser?.name,
        healthId: patientProfile?.healthId,
        medicalConditions: patientProfile?.medicalConditions,
        allergies: patientProfile?.allergies,
        medications: medications.filter((m) => m.active),
        records: medicalRecords.map((r) => ({
          title: r.title,
          date: r.recordDate,
          doctor: r.doctorName,
          hospital: r.hospitalName,
          diagnosis: r.extractedData?.diagnosis,
          meds: r.extractedData?.medications,
          labs: r.extractedData?.labTests,
          aiSummary: r.aiSummary,
        })),
      };

      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const reply = await askHealthCopilot(question, history, patientContext, language);

      const botMsg: ChatMessage = {
        id: 'reply_' + Date.now(),
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'model',
        text: 'Sorry, I encountered an issue processing your query. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    t.copilot.q1,
    t.copilot.q2,
    t.copilot.q3,
    t.copilot.q4,
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-teal-700 to-emerald-500 text-white rounded-2xl shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{t.copilot.title}</h2>
            <p className="text-xs text-slate-500">
              Personalized Q&A grounded in your {medicalRecords.length} stored health records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Records Protected</span>
        </div>
      </div>

      <MedicalWarning compact />

      {/* Suggested chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Try Asking:
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(s)}
            className="px-3 py-1.5 rounded-full border border-teal-200 bg-white hover:bg-teal-50 text-teal-900 text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-teal-600 text-white shadow-2xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm space-y-1.5 leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none font-normal'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] text-right font-medium ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 rounded-tl-none flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
              <span>{t.copilot.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0 pt-1"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.copilot.inputPlaceholder}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 bg-white shadow-2xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.copilot.send}</span>
        </button>
      </form>
    </div>
  );
};
