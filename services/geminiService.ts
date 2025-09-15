import { GoogleGenAI, Type } from "@google/genai";
import { QuestionConfigData, StudyMaterialData, FileContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    notes: {
      type: Type.ARRAY,
      description: "Concise, well-structured notes for each topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "The main topic or concept." },
          content: { type: Type.STRING, description: "Detailed, point-wise notes starting each point with a relevant emoji. Include definitions, formulas, and examples." }
        },
        required: ["topic", "content"]
      }
    },
    mcqs: {
      type: Type.ARRAY,
      description: "Multiple Choice Questions based on the syllabus.",
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
      description: "Open-ended subjective questions.",
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
};


export const generateStudyMaterial = async (
  syllabusText: string,
  files: FileContent[],
  config: QuestionConfigData
): Promise<StudyMaterialData> => {
    
  const fileParts = files.map(file => ({
    inlineData: {
      mimeType: file.mimeType,
      data: file.data,
    },
  }));
  
  const fileNames = files.map(f => f.name).join(', ');

  const prompt = `
    You are an intelligent assistant for a B.Tech exam preparation app. Your task is to generate high-quality study material.

    **Syllabus:**
    ${syllabusText}

    ${files.length > 0 ? `**Reference Files:**\nContent from the following uploaded files should be considered: ${fileNames}` : ''}
    
    **Request:**
    1.  **Analyze the Syllabus & Files:** Extract key topics, subtopics, and concepts.
    2.  **Generate Notes:** Create concise, well-structured, point-wise notes for each topic. Start each point with a relevant emoji. For example: '🧠 Definition: An array is a collection...'. Include definitions, formulas, diagrams (as text descriptions), and examples. Ensure clarity and relevance for a B.Tech student.
    3.  **Generate Questions:**
        -   Number of MCQs: ${config.mcqs}
        -   Number of Subjective Questions: ${config.subjective}
        -   Difficulty Level: ${config.difficulty}
    
    **Output Format:**
    Provide the output in a structured JSON format.
    -   MCQs must have 4 options and a correct answer.
    -   Subjective questions must have a model answer.
    -   The entire response must conform to the provided JSON schema.
  `;
  
  const contents = {
    parts: [
      ...fileParts,
      { text: prompt }
    ]
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    }
  });

  const jsonText = response.text;
  
  try {
    const parsedJson = JSON.parse(jsonText);
    // Basic validation to ensure the parsed object matches the expected structure
    if (parsedJson && Array.isArray(parsedJson.notes) && Array.isArray(parsedJson.mcqs) && Array.isArray(parsedJson.subjectiveQuestions)) {
      return parsedJson as StudyMaterialData;
    } else {
      throw new Error("Parsed JSON does not match the expected structure.");
    }
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Raw response text:", jsonText);
    throw new Error("The AI returned an invalid response format.");
  }
};
