
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionConfigData, StudyMaterialData, FileContent, UnitSummary } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Pro for maximum reasoning depth
const modelName = 'gemini-3-pro-preview';

/**
 * First pass: Extract the list of Units/Chapters from the syllabus.
 */
export const extractUnits = async (
  syllabusText: string,
  syllabusFiles: FileContent[]
): Promise<UnitSummary[]> => {
  const syllabusParts = syllabusFiles.map(f => ({
    inlineData: { mimeType: f.mimeType, data: f.data }
  }));

  const prompt = `
    Analyze the following Engineering Syllabus. 
    Identify all major Units or Chapters. 
    Return a list of Unit Summaries. 
    JSON Output Format: { units: [{ id: "unit1", title: "Unit 1: Title", description: "Brief sub-topics" }] }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // Flash is enough for extraction
    contents: {
      parts: [
        ...syllabusParts,
        { text: syllabusText || "Syllabus provided in files." },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          units: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["id", "title", "description"]
            }
          }
        },
        required: ["units"]
      }
    }
  });

  const result = JSON.parse(response.text || '{"units": []}');
  return result.units;
};

/**
 * Second pass: Generate exhaustive content for ONE specific unit.
 */
export const generateStudyMaterialForUnit = async (
  unit: UnitSummary,
  syllabusText: string,
  syllabusFiles: FileContent[],
  referenceFiles: FileContent[],
  config: QuestionConfigData
): Promise<StudyMaterialData> => {
  
  const syllabusParts = syllabusFiles.map(f => ({
    inlineData: { mimeType: f.mimeType, data: f.data }
  }));

  const referenceParts = referenceFiles.map(f => ({
    inlineData: { mimeType: f.mimeType, data: f.data }
  }));

  const prompt = `
    ACT AS: Senior Computer Science Engineering Professor.
    TASK: Generate EXHAUSTIVE, LENGTHY, and EXAM-ORIENTED notes for ONE SPECIFIC UNIT: "${unit.title}".
    
    STRICT GUIDELINES:
    - Focus ONLY on the topics within "${unit.title}" as defined in the syllabus.
    - Write at least 3000 words for this specific unit. 
    - NO SUMMARIES. Explain every technical detail, register name, bus type, and architectural flow.
    - Assume the student is a complete beginner.
    
    STRUCTURE FOR EACH SUB-TOPIC:
    1. Definition: Simple & academic.
    2. Purpose: Why is this component/logic needed?
    3. Detailed Step-by-Step Working Principle: The "Under the Hood" logic.
    4. Real-life & Technical Examples.
    5. Advantages & Disadvantages.
    6. Comparison Tables (Use Markdown tables).
    7. Possible Exam Questions & Keywords.

    FORMATTING:
    - Use ## for Topics.
    - Use ### for Sub-topics.
    - Use **bold** for ALL key terms.
    - Strictly point-wise. No long blocks of text.
    
    Config:
    - MCQs: ${config.mcqs} (Hard/Concept based for THIS unit)
    - Subjective: ${config.subjective} (10-mark long answers for THIS unit)

    Syllabus Context: ${syllabusText || 'In files.'}
    Reference Material: ${referenceFiles.length > 0 ? 'Use these for classroom flavor.' : 'Rely on professor expertise.'}
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        ...syllabusParts,
        ...referenceParts,
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          notes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["topic", "content"]
            }
          },
          mcqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer"]
            }
          },
          subjectiveQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                modelAnswer: { type: Type.STRING }
              },
              required: ["question", "modelAnswer"]
            }
          }
        },
        required: ["notes", "mcqs", "subjectiveQuestions"]
      },
      thinkingConfig: { thinkingBudget: 12000 } // Deep reasoning for maximum detail
    }
  });

  return JSON.parse(response.text || '{}');
};
