
import { GoogleGenAI, Type } from "@google/genai";
import { SpreadsheetState, AIActionResponse, AnalysisResponse } from "../types";

/**
 * Safely retrieves the API key from the environment variables.
 */
const getApiKey = (): string => {
  try {
    return (typeof process !== 'undefined' && process.env?.API_KEY) || 
           (window as any).process?.env?.API_KEY || 
           "";
  } catch (e) {
    console.warn("API_KEY access failed.");
    return "";
  }
};

/**
 * Transforms or edits data based on user instructions using gemini-3-pro-preview
 */
export async function transformData(
  state: SpreadsheetState,
  instruction: string
): Promise<AIActionResponse> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key is missing. AI transformation unavailable.");

  // Create instance inside the call to ensure fresh environment state
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Act as a professional data engineer. You are given a spreadsheet dataset and a transformation instruction.
      Instructions: ${instruction}

      Current Data:
      ${JSON.stringify(state.data, null, 2)}

      Task: 
      1. Apply the transformation to the data. 
      2. If the instruction asks for new columns, add them.
      3. If the instruction asks to correct or format existing columns, do so.
      4. If the instruction asks to fill missing values, infer them logically.
      
      Return the updated data in the exact JSON schema provided.
    `,
    config: {
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          updatedData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
            },
            description: "The complete updated dataset.",
          },
          explanation: {
            type: Type.STRING,
            description: "A brief explanation of what changes were made.",
          },
        },
        required: ["updatedData", "explanation"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("AI returned empty result.");
  
  return JSON.parse(text.trim()) as AIActionResponse;
}

/**
 * Analyzes data for patterns and insights using gemini-3-flash-preview
 */
export async function analyzeData(
  state: SpreadsheetState
): Promise<AnalysisResponse> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key is missing. Analysis feature disabled.");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Analyze this spreadsheet data and provide high-level insights and a summary.
      Data: ${JSON.stringify(state.data.slice(0, 100), null, 2)} (Showing first 100 rows)
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["summary", "insights"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI returned empty analysis.");

  return JSON.parse(text.trim()) as AnalysisResponse;
}
