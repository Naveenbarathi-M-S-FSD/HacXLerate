import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json({ limit: '25mb' }));

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Extract Medical Document Information (Multimodal OCR)
app.post('/api/gemini/extract', async (req, res) => {
  try {
    const { fileBase64, mimeType, recordType, language } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: 'Missing fileBase64' });
    }

    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');

    const promptText = `
You are THULIR's specialized Medical Document OCR and Clinical Data Extraction Engine.
Analyze this medical document (${recordType || 'prescription/medical report'}).
Carefully extract all identifiable facts into structured JSON.
CRITICAL SAFETY & ACCURACY RULES:
1. Do NOT invent, assume, or hallucinate medical data. If a field (e.g. doctor name, hospital, diagnosis) is not mentioned or illegible, use null.
2. The AI must NOT diagnose diseases. Only extract what is explicitly written.
3. For medications: extract medicineName, dosage (e.g. 500mg), frequency (e.g. Twice daily, 1-0-1), duration, and instructions (e.g. after food).
4. For lab tests: extract testName, testDate, testResult, unit, referenceRange, and abnormalIndicator ("normal" | "high" | "low" | "critical").
5. Provide a 2-sentence concise summary in ${language === 'ta' ? 'Tamil' : 'English'}.
6. Respond with ONLY valid JSON adhering to the following structure:
{
  "doctorName": string | null,
  "hospitalName": string | null,
  "recordDate": string | null,
  "patientName": string | null,
  "diagnosis": string | null,
  "medications": [
    {
      "medicineName": string,
      "dosage": string,
      "frequency": string,
      "duration": string,
      "instructions": string
    }
  ],
  "labTests": [
    {
      "testName": string,
      "testDate": string | null,
      "testResult": string,
      "unit": string,
      "referenceRange": string,
      "abnormalIndicator": "normal" | "high" | "low" | "critical"
    }
  ],
  "importantObservations": string[],
  "followUpDate": string | null,
  "clinicalAdvice": string | null,
  "aiSummary": string
}
`;

    const contents = {
      parts: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        },
        {
          text: promptText,
        },
      ],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      // If wrapped in markdown blocks
      const cleanJson = outputText.replace(/^```json/g, '').replace(/```$/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Gemini Extract Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to extract medical document',
    });
  }
});

// Endpoint: Generate Patient Health Insights & Summary
app.post('/api/gemini/summary', async (req, res) => {
  try {
    const { patientInfo, records, medications, language } = req.body;

    const langName = language === 'ta' ? 'Tamil' : 'English';
    const prompt = `
You are THULIR's Personalized Health Copilot.
Analyze the following patient's clinical background and uploaded medical records:

Patient Name: ${patientInfo?.name || 'Patient'}
Existing Conditions: ${patientInfo?.medicalConditions || 'None reported'}
Known Allergies: ${patientInfo?.allergies || 'None reported'}

Active / Recorded Medications:
${JSON.stringify(medications || [], null, 2)}

Recent Medical Records:
${JSON.stringify(records || [], null, 2)}

TASKS:
1. Provide a concise summary of recent clinical developments.
2. Highlight important medication reminders and adherence points.
3. Identify follow-up items or pending checks explicitly documented.
4. Suggest 3 important questions the patient can ask their doctor during their next visit.
5. All text should be in ${langName}.

SAFETY RULES:
- Do NOT diagnose any disease.
- Do NOT prescribe new medications or change dosages.
- Include a clear warning statement.

Return valid JSON with keys:
{
  "recentHighlights": string,
  "medicationAdherence": string,
  "followUpRecommendations": string,
  "questionsForDoctor": string[],
  "disclaimer": "AI-generated information may be inaccurate. Always verify important medical information with a qualified healthcare professional."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsedData = {};
    try {
      parsedData = JSON.parse(outputText);
    } catch {
      const cleanJson = outputText.replace(/^```json/g, '').replace(/```$/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Gemini Summary Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate health summary',
    });
  }
});

// Endpoint: Patient AI Copilot Chatbot
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history, patientContext, language } = req.body;

    const langName = language === 'ta' ? 'Tamil' : 'English';
    const systemPrompt = `
You are THULIR Health Copilot, a caring, respectful personal health assistant.
The user is a patient inquiring about their health, medications, and medical records.

PATIENT'S AUTHORIZED HEALTH RECORDS & PROFILE:
- Name: ${patientContext?.name || 'Patient'}
- Health ID: ${patientContext?.healthId || 'N/A'}
- Existing Conditions: ${patientContext?.medicalConditions || 'None specified'}
- Allergies: ${patientContext?.allergies || 'None'}
- Current Active Medications: ${JSON.stringify(patientContext?.medications || [])}
- Uploaded Records Summary: ${JSON.stringify(patientContext?.records || [])}

STRICT OPERATIONAL GUIDELINES:
1. Answer the patient's question based PRIMARILY on the above authorized records.
2. If the patient asks for information that is NOT in their records (e.g. "What was my cholesterol in 2022?"), explicitly say:
   "I don't have that information in your available health records."
3. YOU ARE NOT A DOCTOR. Never diagnose diseases, never suggest starting or stopping prescription medications.
4. For any potential emergencies (e.g. severe chest pain, shortness of breath, sudden numbness, high fever with confusion), immediately instruct them:
   "Please call 108 or proceed to the nearest emergency room immediately."
5. Clearly distinguish stored patient information from general wellness knowledge:
   - "From your records: ..."
   - "General health guidance: ..."
6. Provide responses in ${langName} in a warm, elderly-friendly, empathetic tone.
7. Always end responses with:
   "⚠️ Note: AI-generated information may be inaccurate. Please verify important medical information with a qualified healthcare professional."
`;

    const chatContents: any[] = [];
    chatContents.push({ role: 'user', parts: [{ text: systemPrompt }] });
    chatContents.push({ role: 'model', parts: [{ text: `Understood. I will act strictly as Thulir Health Copilot in ${langName}, answering accurately from the patient's records with full safety disclaimers.` }] });

    // Include recent history if available
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        chatContents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }],
        });
      }
    }

    // User's current message
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
    });

    return res.json({
      success: true,
      reply: response.text || 'I could not generate a response at this moment.',
    });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to process chat message',
    });
  }
});

// Mount Vite middleware for dev or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`THULIR Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
